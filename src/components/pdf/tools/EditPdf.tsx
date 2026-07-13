'use client';

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useEffectEvent, useRef, useState } from 'react';
import { PDFDocument, StandardFonts, degrees, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Calendar,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eraser,
  FilePlus2,
  Highlighter,
  ImagePlus,
  Italic,
  Loader2,
  Minus,
  MousePointer2,
  PanelLeft,
  Pen,
  PenTool,
  Plus,
  Redo2,
  RotateCw,
  ShieldOff,
  Save,
  ScanText,
  Square,
  TextCursorInput,
  Trash2,
  Type,
  Underline,
  Undo2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  PdfToolShell,
  Dropzone,
  PrimaryButton,
  ResultPanel,
  ErrorNote,
  downloadBlob,
} from '../PdfToolShell';
import { SignaturePad } from '../SignaturePad';
import { renderPdfPages } from '@/lib/pdfRender';
import { loadPdfjs } from '@/lib/pdfjs';
import { baseName } from '@/lib/pdfUtils';

type Tool =
  | 'select'
  | 'editText'
  | 'text'
  | 'whiteout'
  | 'redact'
  | 'highlight'
  | 'rect'
  | 'pen'
  | 'image'
  | 'field-text'
  | 'field-signature'
  | 'field-initials'
  | 'field-date'
  | 'field-checkbox';
type RectTool = 'whiteout' | 'highlight' | 'rect';
type FieldTool = 'field-text' | 'field-signature' | 'field-initials' | 'field-date' | 'field-checkbox';
type FieldKind = 'text' | 'signature' | 'initials' | 'date' | 'checkbox';

const FIELD_KIND_BY_TOOL: Record<FieldTool, FieldKind> = {
  'field-text': 'text',
  'field-signature': 'signature',
  'field-initials': 'initials',
  'field-date': 'date',
  'field-checkbox': 'checkbox',
};

const FIELD_LABELS: Record<FieldKind, string> = {
  text: 'Text field',
  signature: 'Signature',
  initials: 'Initials',
  date: 'Date',
  checkbox: 'Checkbox',
};

// A small set of font choices mapped to both a CSS stack (for the on-screen
// editor) and a pdf-lib StandardFont (for export), so the two stay in sync.
type FontChoice = 'sans' | 'serif' | 'mono';
const FONT_STACKS: Record<FontChoice, string> = {
  sans: 'Helvetica, Arial, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  mono: '"Courier New", Courier, monospace',
};
const FONT_LABELS: Record<FontChoice, string> = { sans: 'Sans', serif: 'Serif', mono: 'Mono' };

type FontVariant = 'regular' | 'bold' | 'italic' | 'boldItalic';
// Maps each user-facing font family to its bold/italic StandardFonts
// variants, all built into pdf-lib — no font embedding/fontkit needed.
const STANDARD_FONT_MAP: Record<FontChoice, Record<FontVariant, StandardFonts>> = {
  sans: {
    regular: StandardFonts.Helvetica,
    bold: StandardFonts.HelveticaBold,
    italic: StandardFonts.HelveticaOblique,
    boldItalic: StandardFonts.HelveticaBoldOblique,
  },
  serif: {
    regular: StandardFonts.TimesRoman,
    bold: StandardFonts.TimesRomanBold,
    italic: StandardFonts.TimesRomanItalic,
    boldItalic: StandardFonts.TimesRomanBoldItalic,
  },
  mono: {
    regular: StandardFonts.Courier,
    bold: StandardFonts.CourierBold,
    italic: StandardFonts.CourierOblique,
    boldItalic: StandardFonts.CourierBoldOblique,
  },
};

function fontVariantFor(bold?: boolean, italic?: boolean): FontVariant {
  if (bold && italic) return 'boldItalic';
  if (bold) return 'bold';
  if (italic) return 'italic';
  return 'regular';
}

interface Pt {
  xPct: number;
  yPct: number;
}

interface PdfTextBox {
  id: string;
  page: number;
  text: string;
  xPct: number;
  yPct: number;
  wPct: number;
  hPct: number;
  fontSizePct: number;
}

interface RenderedPageInfo {
  url: string;
  w: number;
  h: number;
  textBoxes: PdfTextBox[];
  /** Index of the corresponding page in the originally-opened source PDF,
   *  used to copy the right page across on export. -1 means this entry has
   *  no source page (a blank page inserted in the editor). */
  originalIndex: number;
  /** Degrees (0/90/180/270) to rotate this page on export — purely a export
   *  transform, like OrganizePdf; the interactive canvas itself is never
   *  rotated so edit-element coordinates stay simple. */
  rotation: number;
}

interface OcrStatus {
  page: number;
  label: string;
  progress: number;
}

type TextAlign = 'left' | 'center' | 'right';

type El =
  | {
      id: string;
      page: number;
      type: 'text';
      xPct: number;
      yPct: number;
      wPct: number;
      text: string;
      fontSizePct: number;
      color: string;
      fontFamily: FontChoice;
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      align?: TextAlign;
    }
  | {
      id: string;
      page: number;
      type: 'replaceText';
      sourceId: string;
      xPct: number;
      yPct: number;
      wPct: number;
      hPct: number;
      text: string;
      fontSizePct: number;
      color: string;
      fontFamily: FontChoice;
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      align?: TextAlign;
      /** Sampled page-background color used to cover the original text,
       *  so an edit blends into a colored/scanned page instead of leaving
       *  a white rectangle. Falls back to white until sampling resolves.
       *  User-overridable for backgrounds a single color can't match. */
      bgColor: string;
      /** When set and different from `bgColor`, the cover is drawn as a
       *  top-(bgColor)-to-bottom-(bgColorBottom) gradient instead of a flat
       *  fill, so a box sitting on a vertical gradient background doesn't
       *  show as an obvious flat patch. Cleared (set equal to bgColor) by a
       *  manual color override, which always flattens to one chosen color. */
      bgColorBottom?: string;
    }
  | {
      id: string;
      page: number;
      type: RectTool;
      xPct: number;
      yPct: number;
      wPct: number;
      hPct: number;
      color: string;
      /** Only meaningful on 'whiteout': also strip the page's underlying text
       *  layer (by flattening the page to an image) instead of just covering
       *  it, so the original text isn't left selectable/copyable underneath. */
      redact?: boolean;
    }
  | {
      id: string;
      page: number;
      type: 'image';
      xPct: number;
      yPct: number;
      wPct: number;
      hPct: number;
      dataUrl: string;
      mime: 'image/jpeg' | 'image/png';
    }
  | {
      id: string;
      page: number;
      type: 'pen';
      points: Pt[];
      color: string;
    }
  | {
      id: string;
      page: number;
      type: 'field';
      fieldKind: FieldKind;
      name: string;
      xPct: number;
      yPct: number;
      wPct: number;
      hPct: number;
    };

type Selected = { kind: 'element'; id: string } | null;

interface PdfTextItem {
  str: string;
  transform: number[];
  width: number;
  height: number;
  hasEOL?: boolean;
}

interface RawTextRun {
  text: string;
  left: number;
  top: number;
  right: number;
  bottom: number;
  fontSize: number;
  hasEOL: boolean;
}

interface OcrLine {
  text: string;
  confidence?: number;
  bbox?: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}

interface OcrParagraph {
  lines?: OcrLine[];
}

interface OcrBlock {
  paragraphs?: OcrParagraph[];
}

interface OcrWorker {
  setParameters: (params: Record<string, string>) => Promise<unknown>;
  recognize: (
    image: Blob | string,
    options?: Record<string, unknown>,
    output?: { blocks?: boolean }
  ) => Promise<{ data: { blocks?: OcrBlock[] | null } }>;
  terminate: () => Promise<unknown>;
}

interface TesseractModule {
  createWorker: (
    langs?: string,
    oem?: number,
    options?: {
      logger?: (message: { status?: string; progress?: number }) => void;
    }
  ) => Promise<OcrWorker>;
}

const PREVIEW_SCALE = 1.6;
const COLORS = ['#111827', '#dc2626', '#2563eb', '#16a34a', '#ca8a04', '#ffffff'];
// A 1x1 white pixel, used as the thumbnail/preview image for a blank page
// inserted in the editor (stretched to fill by the existing image styling).
const BLANK_PAGE_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
const uid = () => Math.random().toString(36).slice(2);
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function hexToRgbFloats(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

function hexToRgb(hex: string) {
  const { r, g, b } = hexToRgbFloats(hex);
  return rgb(r, g, b);
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function isPdfTextItem(item: unknown): item is PdfTextItem {
  if (!item || typeof item !== 'object') return false;
  const maybe = item as Partial<PdfTextItem>;
  return typeof maybe.str === 'string' && Array.isArray(maybe.transform);
}

function buildTextLines(rawRuns: RawTextRun[], page: number, pageWidth: number, pageHeight: number): PdfTextBox[] {
  const runs = rawRuns
    .filter((run) => run.text.trim() && run.right > run.left && run.bottom > run.top)
    .sort((a, b) => a.top - b.top || a.left - b.left);

  const lines: RawTextRun[][] = [];

  for (const run of runs) {
    const lastLine = lines[lines.length - 1];
    const lastRun = lastLine?.[lastLine.length - 1];
    const centerY = (run.top + run.bottom) / 2;
    const lastCenterY = lastRun ? (lastRun.top + lastRun.bottom) / 2 : 0;
    const sameBaseline = lastRun
      ? Math.abs(centerY - lastCenterY) <= Math.max(4, Math.min(run.fontSize, lastRun.fontSize) * 0.45)
      : false;
    const gap = lastRun ? run.left - lastRun.right : 0;
    const sameSentence = sameBaseline && gap <= Math.max(28, run.fontSize * 3.2);

    if (!lastLine || !lastRun || !sameSentence || lastRun.hasEOL) {
      lines.push([run]);
    } else {
      lastLine.push(run);
    }
  }

  return lines.map((line) => {
    const sorted = line.sort((a, b) => a.left - b.left);
    const left = Math.min(...sorted.map((run) => run.left));
    const top = Math.min(...sorted.map((run) => run.top));
    const right = Math.max(...sorted.map((run) => run.right));
    const bottom = Math.max(...sorted.map((run) => run.bottom));
    const fontSize = sorted.reduce((sum, run) => sum + run.fontSize, 0) / sorted.length;
    const text = sorted.reduce((acc, run, index) => {
      if (index === 0) return run.text;
      const previous = sorted[index - 1];
      const gap = run.left - previous.right;
      return `${acc}${gap > fontSize * 0.22 ? ' ' : ''}${run.text}`;
    }, '');
    const padX = Math.max(1, fontSize * 0.12);
    const padY = Math.max(1, fontSize * 0.18);

    return {
      id: `p${page}-${Math.round(left)}-${Math.round(top)}-${uid()}`,
      page,
      text: text.trim(),
      xPct: (clamp(left - padX, 0, pageWidth) / pageWidth) * 100,
      yPct: (clamp(top - padY, 0, pageHeight) / pageHeight) * 100,
      wPct: (clamp(right - left + padX * 2, 1, pageWidth) / pageWidth) * 100,
      hPct: (clamp(bottom - top + padY * 2, 1, pageHeight) / pageHeight) * 100,
      fontSizePct: clamp((fontSize / pageHeight) * 100, 0.7, 8),
    };
  });
}

async function extractTextBoxes(data: ArrayBuffer, scale: number): Promise<PdfTextBox[][]> {
  const pdfjs = await loadPdfjs();
  const util = (pdfjs as unknown as { Util: { transform: (a: number[], b: number[]) => number[] } }).Util;
  const doc = await pdfjs.getDocument({ data }).promise;
  const pages: PdfTextBox[][] = [];

  for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
    try {
      const page = await doc.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      const content = await page.getTextContent();
      const rawRuns: RawTextRun[] = [];

      for (const item of content.items ?? []) {
        if (!isPdfTextItem(item) || !item.str.trim()) continue;
        const transform = util.transform(viewport.transform, item.transform);
        const fontSize = Math.max(Math.hypot(transform[2], transform[3]), Math.abs(item.height || 0) * scale, 6);
        const width = Math.max(Math.abs(item.width || 0) * scale, Math.abs(transform[0] || 0), 1);
        const left = transform[4];
        const top = transform[5] - fontSize;

        rawRuns.push({
          text: item.str,
          left,
          top,
          right: left + width,
          bottom: top + fontSize * 1.1,
          fontSize,
          hasEOL: Boolean(item.hasEOL),
        });
      }

      pages.push(buildTextLines(rawRuns, pageNumber - 1, viewport.width, viewport.height));
    } catch (e) {
      // One page's text layer failing to parse shouldn't take down the rest.
      console.error(`Text detection failed on page ${pageNumber}, continuing without it:`, e);
      pages.push([]);
    }
  }

  await doc.cleanup();
  return pages;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('Could not read image.'));
    reader.readAsDataURL(file);
  });
}

function loadImageSize(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error('Could not read image dimensions.'));
    image.src = src;
  });
}

const DEFAULT_TEXT_COLOR = '#111827';
const DEFAULT_BG_COLOR = '#ffffff';

const toHex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
const rgbToHex = (r: number, g: number, b: number) => `#${toHex(r)}${toHex(g)}${toHex(b)}`;

/** Darkest pixel (ink) + most-common pixel (background) in an ImageData
 *  region, via 16-levels/channel quantized buckets so anti-aliasing noise
 *  collapses into the true dominant color instead of splitting its vote. */
function dominantColors(data: Uint8ClampedArray) {
  let inkR = 17, inkG = 24, inkB = 39, inkLum = Infinity;
  const buckets = new Map<string, { count: number; r: number; g: number; b: number }>();

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    if (a < 200) continue;

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    if (luminance < inkLum) { inkLum = luminance; inkR = r; inkG = g; inkB = b; }

    const key = `${r >> 4},${g >> 4},${b >> 4}`;
    const bucket = buckets.get(key);
    if (bucket) bucket.count++;
    else buckets.set(key, { count: 1, r, g, b });
  }

  let bg = { count: 0, r: 255, g: 255, b: 255 };
  for (const bucket of buckets.values()) if (bucket.count > bg.count) bg = bucket;

  return { ink: { r: inkR, g: inkG, b: inkB }, background: { r: bg.r, g: bg.g, b: bg.b } };
}

/**
 * Samples a detected text line's region on the rendered page image to recover
 * enough color info to cover the original text without leaving an obvious
 * flat-color patch pasted over a non-flat background:
 *   - `ink`: the darkest pixel in the box (approximates the text color)
 *   - `background`: the most common color across the whole box (used as a
 *     flat fill, and as the "Cover color" swatch shown in the toolbar)
 *   - `backgroundBottom`: the most common color in just the box's bottom
 *     strip. When it differs noticeably from `background` (the top strip is
 *     sampled implicitly via the whole-box dominant color skewing toward it),
 *     the box likely sits on a vertical gradient rather than a flat color —
 *     the caller then fills with a top-to-bottom gradient instead of a flat
 *     rectangle. A genuinely flat background makes the two colors equal (or
 *     very close), so this is a no-op there — same flat-fill behavior as
 *     before, just also handling gradients, which flat sampling alone can't.
 * Works the same whether the line came from the PDF text layer or from OCR.
 */
function sampleRegionColors(
  imageUrl: string,
  box: { xPct: number; yPct: number; wPct: number; hPct: number }
): Promise<{ ink: string; background: string; backgroundBottom: string }> {
  const fallback = { ink: DEFAULT_TEXT_COLOR, background: DEFAULT_BG_COLOR, backgroundBottom: DEFAULT_BG_COLOR };
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return resolve(fallback);

        ctx.drawImage(image, 0, 0);
        const x = clamp(Math.round((box.xPct / 100) * canvas.width), 0, canvas.width - 1);
        const y = clamp(Math.round((box.yPct / 100) * canvas.height), 0, canvas.height - 1);
        const w = clamp(Math.round((box.wPct / 100) * canvas.width), 1, canvas.width - x);
        const h = clamp(Math.round((box.hPct / 100) * canvas.height), 1, canvas.height - y);

        const whole = dominantColors(ctx.getImageData(x, y, w, h).data);
        // Sample the bottom third separately (a thin box may be too short to
        // usefully split top/bottom, so this only kicks in above a minimum
        // height) to detect a vertical gradient without touching pixels
        // outside the box itself — avoids risking picking up an adjacent
        // line of text above/below.
        const bottomStripH = Math.max(1, Math.round(h / 3));
        const bottom = h >= 6
          ? dominantColors(ctx.getImageData(x, y + h - bottomStripH, w, bottomStripH).data).background
          : whole.background;

        resolve({
          ink: rgbToHex(whole.ink.r, whole.ink.g, whole.ink.b),
          background: rgbToHex(whole.background.r, whole.background.g, whole.background.b),
          backgroundBottom: rgbToHex(bottom.r, bottom.g, bottom.b),
        });
      } catch {
        resolve(fallback);
      }
    };
    image.onerror = () => resolve(fallback);
    image.src = imageUrl;
  });
}

function ocrBlocksToTextBoxes(blocks: OcrBlock[] | null | undefined, pageIndex: number, width: number, height: number) {
  const boxes: PdfTextBox[] = [];

  blocks?.forEach((block, blockIndex) => {
    block.paragraphs?.forEach((paragraph, paragraphIndex) => {
      paragraph.lines?.forEach((line, lineIndex) => {
        const text = line.text.trim();
        const box = line.bbox;
        if (!text || !box) return;

        const x0 = clamp(box.x0, 0, width);
        const y0 = clamp(box.y0, 0, height);
        const x1 = clamp(box.x1, x0 + 1, width);
        const y1 = clamp(box.y1, y0 + 1, height);
        const lineHeight = y1 - y0;
        const padX = Math.max(2, lineHeight * 0.12);
        const padY = Math.max(1, lineHeight * 0.16);
        const left = clamp(x0 - padX, 0, width);
        const top = clamp(y0 - padY, 0, height);
        const right = clamp(x1 + padX, left + 1, width);
        const bottom = clamp(y1 + padY, top + 1, height);

        boxes.push({
          id: `ocr-${pageIndex}-${blockIndex}-${paragraphIndex}-${lineIndex}-${uid()}`,
          page: pageIndex,
          text,
          xPct: (left / width) * 100,
          yPct: (top / height) * 100,
          wPct: ((right - left) / width) * 100,
          hPct: ((bottom - top) / height) * 100,
          fontSizePct: clamp((lineHeight / height) * 100 * 0.78, 0.7, 8),
        });
      });
    });
  });

  return boxes;
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const lines: string[] = [];
  const sourceLines = text.replace(/\r/g, '').split('\n');

  for (const sourceLine of sourceLines) {
    const words = sourceLine.split(/\s+/).filter(Boolean);
    if (!words.length) {
      lines.push('');
      continue;
    }

    let line = '';
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) <= maxWidth || !line) {
        line = next;
      } else {
        lines.push(line);
        line = word;
      }
    }
    lines.push(line);
  }

  return lines;
}

function drawTextBlock({
  page,
  font,
  text,
  x,
  top,
  width,
  height,
  pageHeight,
  size,
  color,
  singleLine = false,
  align = 'left',
  underline = false,
}: {
  page: PDFPage;
  font: PDFFont;
  text: string;
  x: number;
  top: number;
  width: number;
  height?: number;
  pageHeight: number;
  size: number;
  color: ReturnType<typeof rgb>;
  /** Keep an edited detected line on one line (matching the on-screen editor)
   *  instead of reflowing it into multiple lines. */
  singleLine?: boolean;
  /** Horizontal alignment of each line within `width`, matching the on-screen editor. */
  align?: TextAlign;
  underline?: boolean;
}) {
  if (!text.trim()) return;
  const lineHeight = size * 1.16;
  // A detected line is one line — collapse any newlines and never wrap, so
  // editing it doesn't silently turn one line into two.
  const lines = singleLine
    ? [text.replace(/\s*\n\s*/g, ' ').trim()]
    : wrapText(text, font, size, width);
  const maxLines = !singleLine && height
    ? Math.max(1, Math.floor((height + size * 0.35) / lineHeight))
    : lines.length;

  lines.slice(0, maxLines).forEach((line, index) => {
    const lineWidth = font.widthOfTextAtSize(line, size);
    const lineX = align === 'center' ? x + Math.max(0, width - lineWidth) / 2 : align === 'right' ? x + Math.max(0, width - lineWidth) : x;
    const y = pageHeight - top - size - index * lineHeight;
    page.drawText(line, { x: lineX, y, size, font, color });
    if (underline) {
      page.drawLine({
        start: { x: lineX, y: y - size * 0.1 },
        end: { x: lineX + lineWidth, y: y - size * 0.1 },
        thickness: Math.max(0.6, size * 0.045),
        color,
      });
    }
  });
}

function elementHasBox(el: El): el is Extract<El, { xPct: number; yPct: number; wPct: number }> {
  return el.type !== 'pen';
}

export function EditPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<RenderedPageInfo[]>([]);
  const [current, setCurrent] = useState(0);
  const [tool, setTool] = useState<Tool>('editText');
  const [color, setColor] = useState(COLORS[0]);
  const [els, setEls] = useState<El[]>([]);
  const [pastEls, setPastEls] = useState<El[][]>([]);
  const [futureEls, setFutureEls] = useState<El[][]>([]);
  const [selected, setSelected] = useState<Selected>(null);
  const [rendering, setRendering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ocrStatus, setOcrStatus] = useState<OcrStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string; size: number } | null>(null);
  const [overlaySize, setOverlaySize] = useState({ width: 0, height: 0 });
  const [focusElementId, setFocusElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  // When saving a PDF that has fillable fields on it, offer to bake them into
  // flat page content instead of leaving them as interactive AcroForm fields.
  const [flattenFields, setFlattenFields] = useState(false);
  const [signaturePanelOpen, setSignaturePanelOpen] = useState(false);
  const [draftSignature, setDraftSignature] = useState<string | null>(null);
  const [savedSignatures, setSavedSignatures] = useState<string[]>([]);

  const overlayRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const drafting = useRef<{ id: string; startX: number; startY: number } | null>(null);
  const dragging = useRef<{
    id: string; type: El['type']; canMove: boolean; offX: number; offY: number;
    startClientX: number; startClientY: number; moved: boolean;
  } | null>(null);
  const resizing = useRef<{ id: string; startX: number; startY: number; startW: number; startH: number } | null>(null);
  const textEditHistory = useRef<Set<string>>(new Set());
  const autoOcrAttempted = useRef<Set<number>>(new Set());
  const fieldCounter = useRef(0);
  const dragPageIndex = useRef<number | null>(null);

  useEffect(() => {
    const node = overlayRef.current;
    if (!node) return;

    const syncSize = () => {
      const box = node.getBoundingClientRect();
      setOverlaySize({ width: box.width, height: box.height });
    };

    syncSize();
    const observer = new ResizeObserver(syncSize);
    observer.observe(node);
    return () => observer.disconnect();
  }, [file, pages.length, current]);

  useEffect(() => {
    if (!focusElementId) return;
    const node = overlayRef.current?.querySelector(`[data-editable-id="${focusElementId}"]`) as HTMLElement | null;
    if (!node) return;

    node.focus();
    const range = document.createRange();
    range.selectNodeContents(node);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    setFocusElementId(null);
  }, [focusElementId, els]);

  const selectedElement = selected?.kind === 'element' ? els.find((el) => el.id === selected.id) ?? null : null;
  const page = pages[current];
  const currentEls = els.filter((el) => el.page === current);
  const editedSourceIds = new Set(
    els
      .filter((el): el is Extract<El, { type: 'replaceText'; sourceId: string }> => el.type === 'replaceText')
      .map((el) => el.sourceId)
  );
  const detectedText = page?.textBoxes.filter((box) => !editedSourceIds.has(box.id)) ?? [];
  const displayWidth = page ? Math.max(280, Math.min(page.w / PREVIEW_SCALE, 860) * zoom) : 0;

  const pushHistorySnapshot = () => {
    setPastEls((prev) => [...prev, els].slice(-60));
    setFutureEls([]);
  };

  const commitEls = (updater: (prev: El[]) => El[]) => {
    setEls((prev) => {
      const next = updater(prev);
      if (next === prev) return prev;
      setPastEls((history) => [...history, prev].slice(-60));
      setFutureEls([]);
      return next;
    });
  };

  const undo = () => {
    setPastEls((prev) => {
      const previous = prev[prev.length - 1];
      if (!previous) return prev;
      setFutureEls((future) => [els, ...future].slice(0, 60));
      setEls(previous);
      setSelected(null);
      return prev.slice(0, -1);
    });
  };

  const redo = () => {
    setFutureEls((prev) => {
      const next = prev[0];
      if (!next) return prev;
      setPastEls((history) => [...history, els].slice(-60));
      setEls(next);
      setSelected(null);
      return prev.slice(1);
    });
  };

  // Every page-structure change (reorder/delete/insert/duplicate) must keep
  // each element's `page` index pointing at the same visual page it was
  // placed on, since elements are addressed by position in `pages`, not by
  // a stable page id. `indexMap` gives the new index for each old index —
  // `null` means that page (and its elements) is gone.
  const remapPagesAndEls = (newPages: RenderedPageInfo[], indexMap: Map<number, number | null>) => {
    setPages(newPages);
    commitEls((prev) =>
      prev
        .map((el) => {
          const mapped = indexMap.get(el.page);
          if (mapped === undefined) return el;
          if (mapped === null) return null;
          return { ...el, page: mapped };
        })
        .filter((el): el is El => el !== null)
    );
  };

  const rotatePageAt = (index: number) => {
    setPages((prev) => prev.map((p, i) => (i === index ? { ...p, rotation: (p.rotation + 90) % 360 } : p)));
  };

  const deletePageAt = (index: number) => {
    if (pages.length <= 1) return;
    const indexMap = new Map<number, number | null>();
    pages.forEach((_, i) => indexMap.set(i, i === index ? null : i < index ? i : i - 1));
    const newPages = pages.filter((_, i) => i !== index);
    remapPagesAndEls(newPages, indexMap);
    setCurrent((c) => clamp(c > index ? c - 1 : c, 0, newPages.length - 1));
    setSelected(null);
  };

  const duplicatePageAt = (index: number) => {
    const source = pages[index];
    if (!source) return;
    // The duplicate shares the source's rendered image and original-PDF
    // index (export copies that source page again); it starts with no
    // elements of its own — only the original page's elements stay in place.
    const copy: RenderedPageInfo = { ...source, textBoxes: [] };
    const indexMap = new Map<number, number | null>();
    pages.forEach((_, i) => indexMap.set(i, i <= index ? i : i + 1));
    const newPages = [...pages.slice(0, index + 1), copy, ...pages.slice(index + 1)];
    remapPagesAndEls(newPages, indexMap);
  };

  const insertBlankPageAt = (index: number) => {
    const ref = pages[index] ?? pages[0];
    if (!ref) return;
    const blank: RenderedPageInfo = {
      url: BLANK_PAGE_DATA_URL,
      w: ref.w,
      h: ref.h,
      textBoxes: [],
      originalIndex: -1,
      rotation: 0,
    };
    const indexMap = new Map<number, number | null>();
    pages.forEach((_, i) => indexMap.set(i, i <= index ? i : i + 1));
    const newPages = [...pages.slice(0, index + 1), blank, ...pages.slice(index + 1)];
    remapPagesAndEls(newPages, indexMap);
    setCurrent(index + 1);
  };

  const reorderPage = (from: number, to: number) => {
    if (from === to) return;
    const newPages = [...pages];
    const [moved] = newPages.splice(from, 1);
    newPages.splice(to, 0, moved);

    const indexMap = new Map<number, number | null>();
    pages.forEach((_, i) => {
      let newIndex: number;
      if (i === from) newIndex = to;
      else if (from < to) newIndex = i > from && i <= to ? i - 1 : i;
      else newIndex = i >= to && i < from ? i + 1 : i;
      indexMap.set(i, newIndex);
    });
    remapPagesAndEls(newPages, indexMap);
    setCurrent((c) => indexMap.get(c) ?? c);
  };

  const onFiles = async (files: File[]) => {
    setError(null);
    setResult(null);
    const f = files[0];
    if (!f) return;

    setFile(f);
    setRendering(true);
    setCurrent(0);
    setEls([]);
    setPastEls([]);
    setFutureEls([]);
    setSelected(null);
    setOcrStatus(null);
    setZoom(1);
    textEditHistory.current.clear();
    autoOcrAttempted.current.clear();

    try {
      const data = await f.arrayBuffer();
      // Detecting existing text lines is a bonus feature layered on top of
      // rendering the page images. If it fails on some browser/PDF, the
      // editor should still open with plain image pages (just without
      // click-to-edit-detected-text) rather than refusing to open at all.
      const [rendered, textBoxes] = await Promise.all([
        renderPdfPages(data.slice(0), PREVIEW_SCALE),
        extractTextBoxes(data.slice(0), PREVIEW_SCALE).catch((e) => {
          console.error('Text detection failed, continuing without it:', e);
          return [] as PdfTextBox[][];
        }),
      ]);
      const infos: RenderedPageInfo[] = [];
      for (const p of rendered) {
        const blob = await p.toBlob('image/jpeg', 0.88);
        infos.push({
          url: URL.createObjectURL(blob),
          w: p.width,
          h: p.height,
          textBoxes: textBoxes[p.index] ?? [],
          originalIndex: p.index,
          rotation: 0,
        });
      }
      setPages(infos);
    } catch (e) {
      console.error(e);
      // Surface the real failure reason instead of always blaming the file —
      // most "corrupted" reports turn out to be a browser/worker issue, not
      // an actually broken PDF, and the generic message hides that.
      const detail = e instanceof Error ? e.message : String(e);
      setError(`Could not open this PDF (${detail}). It may be corrupted, password-protected, or this browser may not support a feature this editor needs.`);
      setFile(null);
    } finally {
      setRendering(false);
    }
  };

  const pct = (clientX: number, clientY: number) => {
    const box = overlayRef.current!.getBoundingClientRect();
    return {
      xPct: clamp(((clientX - box.left) / box.width) * 100, 0, 100),
      yPct: clamp(((clientY - box.top) / box.height) * 100, 0, 100),
    };
  };

  const updateEl = (id: string, updater: (el: El) => El) => {
    setEls((prev) => prev.map((el) => (el.id === id ? updater(el) : el)));
  };

  const commitUpdateEl = (id: string, updater: (el: El) => El) => {
    commitEls((prev) => prev.map((el) => (el.id === id ? updater(el) : el)));
  };

  const createText = (xPct: number, yPct: number) => {
    const id = uid();
    // Default the box to reach the right edge of the page (like a normal text
    // field) instead of a narrow fixed column, so typing wraps naturally
    // rather than running out of room. It can still be dragged narrower.
    const wPct = clamp(100 - xPct - 2, 16, 100);
    commitEls((prev) => [
      ...prev,
      {
        id,
        page: current,
        type: 'text',
        xPct,
        yPct,
        wPct,
        text: 'Text',
        fontSizePct: 2.4,
        color: color === '#ffffff' ? '#111827' : color,
        fontFamily: 'sans',
      },
    ]);
    setSelected({ kind: 'element', id });
    setFocusElementId(id);
    // Stay in the text tool (like editSourceText does for detected lines) so
    // clicking this box — or clicking elsewhere to add another one — keeps
    // editing/placing text instead of dropping into Move mode, where the
    // next click would drag the box instead of typing into it.
  };

  const createField = (fieldTool: FieldTool, xPct: number, yPct: number) => {
    const fieldKind = FIELD_KIND_BY_TOOL[fieldTool];
    const id = uid();
    fieldCounter.current += 1;
    // Default sizes roughly match what each field kind typically needs on a
    // form (checkboxes are square and small, signatures are wide and short).
    const wPct = fieldKind === 'checkbox' ? 3.5 : fieldKind === 'signature' ? 26 : fieldKind === 'initials' ? 10 : 20;
    const hPct = fieldKind === 'checkbox' ? 2.2 : 3.6;
    commitEls((prev) => [
      ...prev,
      {
        id,
        page: current,
        type: 'field',
        fieldKind,
        name: `${fieldKind}_${fieldCounter.current}`,
        xPct: clamp(xPct - wPct / 2, 0, 100 - wPct),
        yPct: clamp(yPct - hPct / 2, 0, 100 - hPct),
        wPct,
        hPct,
      },
    ]);
    setSelected({ kind: 'element', id });
    setTool('select');
  };

  const editSourceText = (box: PdfTextBox) => {
    const existing = els.find((el) => el.type === 'replaceText' && el.sourceId === box.id);
    if (existing) {
      setSelected({ kind: 'element', id: existing.id });
      setFocusElementId(existing.id);
      // Stay in the text-editing tool so you can keep clicking line after
      // line to edit — don't drop into Move mode after each edit.
      setTool('editText');
      return;
    }

    const id = uid();
    // Placeholder colors while sampling, so the box appears instantly instead
    // of waiting on the async color sample before selection/focus can happen.
    commitEls((prev) => [
      ...prev,
      {
        id,
        page: current,
        type: 'replaceText',
        sourceId: box.id,
        xPct: box.xPct,
        yPct: box.yPct,
        wPct: box.wPct,
        hPct: box.hPct,
        text: box.text,
        fontSizePct: box.fontSizePct,
        color: DEFAULT_TEXT_COLOR,
        bgColor: DEFAULT_BG_COLOR,
        fontFamily: 'sans',
      },
    ]);
    setSelected({ kind: 'element', id });
    setFocusElementId(id);
    setTool('editText');

    // Recover the original ink + page-background colors so the edit blends in
    // (keeps the text's color, covers the old text with the real background
    // instead of a white box) rather than looking obviously pasted on.
    const pageUrl = page?.url;
    if (pageUrl) {
      sampleRegionColors(pageUrl, box).then(({ ink, background, backgroundBottom }) => {
        updateEl(id, (el) =>
          el.type === 'replaceText' ? { ...el, color: ink, bgColor: background, bgColorBottom: backgroundBottom } : el
        );
      });
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-editor-control="true"]')) return;
    const { xPct, yPct } = pct(e.clientX, e.clientY);

    if (tool === 'text') {
      createText(xPct, yPct);
      return;
    }

    if (tool === 'whiteout' || tool === 'redact' || tool === 'highlight' || tool === 'rect') {
      const id = uid();
      const elType: RectTool = tool === 'redact' ? 'whiteout' : tool;
      drafting.current = { id, startX: xPct, startY: yPct };
      pushHistorySnapshot();
      setEls((prev) => [
        ...prev,
        { id, page: current, type: elType, xPct, yPct, wPct: 0, hPct: 0, color, redact: tool === 'redact' },
      ]);
      setSelected({ kind: 'element', id });
      overlayRef.current?.setPointerCapture(e.pointerId);
      return;
    }

    if (
      tool === 'field-text' ||
      tool === 'field-signature' ||
      tool === 'field-initials' ||
      tool === 'field-date' ||
      tool === 'field-checkbox'
    ) {
      createField(tool, xPct, yPct);
      return;
    }

    if (tool === 'pen') {
      const id = uid();
      drafting.current = { id, startX: xPct, startY: yPct };
      pushHistorySnapshot();
      setEls((prev) => [...prev, { id, page: current, type: 'pen', points: [{ xPct, yPct }], color }]);
      setSelected({ kind: 'element', id });
      overlayRef.current?.setPointerCapture(e.pointerId);
      return;
    }

    setSelected(null);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const { xPct, yPct } = pct(e.clientX, e.clientY);

    if (resizing.current) {
      const rz = resizing.current;
      setEls((prev) =>
        prev.map((el) => {
          if (el.id !== rz.id || !elementHasBox(el)) return el;
          const wPct = clamp(rz.startW + xPct - rz.startX, 6, 100 - el.xPct);
          // Plain text boxes only carry a width — their height follows the
          // wrapped content — so only widen them, don't force a fixed height.
          if (el.type === 'text') return { ...el, wPct };
          return { ...el, wPct, hPct: clamp(rz.startH + yPct - rz.startY, 1, 100 - el.yPct) };
        })
      );
      return;
    }

    if (drafting.current) {
      const d = drafting.current;
      setEls((prev) =>
        prev.map((el) => {
          if (el.id !== d.id) return el;
          if (el.type === 'pen') return { ...el, points: [...el.points, { xPct, yPct }] };
          if (el.type === 'whiteout' || el.type === 'highlight' || el.type === 'rect') {
            return {
              ...el,
              xPct: Math.min(d.startX, xPct),
              yPct: Math.min(d.startY, yPct),
              wPct: Math.abs(xPct - d.startX),
              hPct: Math.abs(yPct - d.startY),
            };
          }
          return el;
        })
      );
      return;
    }

    if (dragging.current) {
      const dr = dragging.current;
      // In the text tool a text box is click-to-edit only, never dragged.
      if (!dr.canMove) return;
      // Require a small amount of real movement before treating this as a
      // drag, so a plain click/tap to select an element never nudges it.
      if (!dr.moved) {
        const dist = Math.hypot(e.clientX - dr.startClientX, e.clientY - dr.startClientY);
        if (dist < 4) return;
        dr.moved = true;
        pushHistorySnapshot();
      }
      setEls((prev) =>
        prev.map((el) => {
          if (el.id !== dr.id || !elementHasBox(el)) return el;
          const w = 'wPct' in el ? el.wPct : 1;
          const h = 'hPct' in el ? el.hPct : 1;
          return {
            ...el,
            xPct: clamp(xPct - dr.offX, 0, 100 - w),
            yPct: clamp(yPct - dr.offY, 0, 100 - h),
          };
        })
      );
    }
  };

  const onPointerUp = () => {
    // A plain click (no real drag) on a text element means "start typing",
    // not "get ready to move it" — dragging is reserved for an actual drag.
    if (dragging.current && !dragging.current.moved &&
        (dragging.current.type === 'text' || dragging.current.type === 'replaceText')) {
      setFocusElementId(dragging.current.id);
    }
    drafting.current = null;
    dragging.current = null;
    resizing.current = null;
  };

  const startDrag = (e: React.PointerEvent, el: El) => {
    if (el.type === 'pen' || !elementHasBox(el)) return;
    const isTextEl = el.type === 'text' || el.type === 'replaceText';
    const canMove = tool === 'select';
    // Text boxes stay clickable-to-edit in the text tool (just not draggable);
    // other elements are only interactive in Move mode.
    if (!canMove && !isTextEl) return;
    e.stopPropagation();
    setSelected({ kind: 'element', id: el.id });
    const { xPct, yPct } = pct(e.clientX, e.clientY);
    // History is only recorded once the pointer actually moves (see
    // onPointerMove), so a plain click-to-select doesn't pollute undo.
    dragging.current = {
      id: el.id, type: el.type, canMove, offX: xPct - el.xPct, offY: yPct - el.yPct,
      startClientX: e.clientX, startClientY: e.clientY, moved: false,
    };
    overlayRef.current?.setPointerCapture(e.pointerId);
  };

  const startResize = (e: React.PointerEvent, el: El) => {
    if (el.type === 'pen' || !elementHasBox(el)) return;
    e.stopPropagation();
    setSelected({ kind: 'element', id: el.id });
    const { xPct, yPct } = pct(e.clientX, e.clientY);
    pushHistorySnapshot();
    resizing.current = { id: el.id, startX: xPct, startY: yPct, startW: el.wPct, startH: 'hPct' in el ? el.hPct : 1 };
    overlayRef.current?.setPointerCapture(e.pointerId);
  };

  const deleteSelected = () => {
    if (!selectedElement) return;
    if (selectedElement.type === 'replaceText') {
      commitUpdateEl(selectedElement.id, (el) => (el.type === 'replaceText' ? { ...el, text: '' } : el));
      return;
    }
    commitEls((prev) => prev.filter((el) => el.id !== selectedElement.id));
    setSelected(null);
  };

  const changeFontSize = (delta: number) => {
    if (!selectedElement || (selectedElement.type !== 'text' && selectedElement.type !== 'replaceText')) return;
    commitUpdateEl(selectedElement.id, (el) =>
      el.type === 'text' || el.type === 'replaceText'
        ? { ...el, fontSizePct: clamp(el.fontSizePct + delta, 0.7, 10) }
        : el
    );
  };

  const setSelectedFontFamily = (fontFamily: FontChoice) => {
    if (!selectedElement || (selectedElement.type !== 'text' && selectedElement.type !== 'replaceText')) return;
    commitUpdateEl(selectedElement.id, (el) =>
      el.type === 'text' || el.type === 'replaceText' ? { ...el, fontFamily } : el
    );
  };

  const setSelectedTextColor = (c: string) => {
    setColor(c);
    if (!selectedElement || (selectedElement.type !== 'text' && selectedElement.type !== 'replaceText')) return;
    commitUpdateEl(selectedElement.id, (el) =>
      el.type === 'text' || el.type === 'replaceText' ? { ...el, color: c } : el
    );
  };

  const setSelectedBgColor = (c: string) => {
    if (!selectedElement || selectedElement.type !== 'replaceText') return;
    // A manual override always flattens to one chosen color — clear any
    // auto-detected gradient so this picker stays the source of truth once
    // the user has decided the auto-match wasn't right.
    commitUpdateEl(selectedElement.id, (el) =>
      el.type === 'replaceText' ? { ...el, bgColor: c, bgColorBottom: c } : el
    );
  };

  const toggleSelectedBold = () => {
    if (!selectedElement || (selectedElement.type !== 'text' && selectedElement.type !== 'replaceText')) return;
    commitUpdateEl(selectedElement.id, (el) =>
      el.type === 'text' || el.type === 'replaceText' ? { ...el, bold: !el.bold } : el
    );
  };

  const toggleSelectedItalic = () => {
    if (!selectedElement || (selectedElement.type !== 'text' && selectedElement.type !== 'replaceText')) return;
    commitUpdateEl(selectedElement.id, (el) =>
      el.type === 'text' || el.type === 'replaceText' ? { ...el, italic: !el.italic } : el
    );
  };

  const toggleSelectedUnderline = () => {
    if (!selectedElement || (selectedElement.type !== 'text' && selectedElement.type !== 'replaceText')) return;
    commitUpdateEl(selectedElement.id, (el) =>
      el.type === 'text' || el.type === 'replaceText' ? { ...el, underline: !el.underline } : el
    );
  };

  const setSelectedAlign = (align: TextAlign) => {
    if (!selectedElement || (selectedElement.type !== 'text' && selectedElement.type !== 'replaceText')) return;
    commitUpdateEl(selectedElement.id, (el) =>
      el.type === 'text' || el.type === 'replaceText' ? { ...el, align } : el
    );
  };

  const handleImageFile = async (imageFile: File | undefined) => {
    if (!imageFile || !page) return;
    setError(null);
    try {
      const dataUrl = await readFileAsDataUrl(imageFile);
      const size = await loadImageSize(dataUrl);
      const id = uid();
      const wPct = 32;
      const hPct = clamp(wPct * (size.height / size.width) * (page.w / page.h), 4, 70);
      commitEls((prev) => [
        ...prev,
        {
          id,
          page: current,
          type: 'image',
          xPct: 34,
          yPct: 18,
          wPct,
          hPct,
          dataUrl,
          mime: imageFile.type === 'image/png' ? 'image/png' : 'image/jpeg',
        },
      ]);
      setSelected({ kind: 'element', id });
      setTool('select');
    } catch (e) {
      console.error(e);
      setError('Could not add that image. Use a PNG or JPG file.');
    }
  };

  // A drawn/typed signature is placed as a regular image element, so it's
  // draggable/resizable like any other image and needs no special export
  // handling — this also means the same signature can be dropped onto
  // multiple pages by clicking it again in the saved-signatures tray.
  const placeSignature = async (dataUrl: string) => {
    if (!page) return;
    try {
      const size = await loadImageSize(dataUrl);
      const id = uid();
      const wPct = 28;
      const hPct = clamp(wPct * (size.height / size.width) * (page.w / page.h), 3, 40);
      commitEls((prev) => [
        ...prev,
        { id, page: current, type: 'image', xPct: 36, yPct: 72, wPct, hPct, dataUrl, mime: 'image/png' },
      ]);
      setSelected({ kind: 'element', id });
      setTool('select');
    } catch (e) {
      console.error(e);
      setError('Could not place that signature.');
    }
  };

  const confirmDraftSignature = () => {
    if (!draftSignature) return;
    setSavedSignatures((prev) => (prev.includes(draftSignature) ? prev : [draftSignature, ...prev]).slice(0, 6));
    void placeSignature(draftSignature);
  };

  const runOcrOnCurrentPage = async (auto = false) => {
    if (!page || ocrStatus) return;

    if (!auto) setError(null);
    setOcrStatus({ page: current, label: 'Loading OCR engine', progress: 0 });

    let worker: OcrWorker | null = null;
    try {
      const loadedTesseract = (await import('tesseract.js')) as unknown as Partial<TesseractModule> & {
        default?: Partial<TesseractModule>;
      };
      const tesseract = loadedTesseract.createWorker ? loadedTesseract : loadedTesseract.default;
      if (!tesseract?.createWorker) throw new Error('OCR engine did not load.');

      worker = await tesseract.createWorker('eng', 1, {
        logger: (message) => {
          if (!message.status) return;
          setOcrStatus({
            page: current,
            label: message.status.replace(/_/g, ' '),
            progress: clamp(message.progress ?? 0, 0, 1),
          });
        },
      });
      await worker.setParameters({
        preserve_interword_spaces: '1',
        tessedit_pageseg_mode: '11',
      });

      setOcrStatus({ page: current, label: 'Recognizing text', progress: 0.45 });
      const imageBlob = await fetch(page.url).then((res) => res.blob());
      const result = await worker.recognize(imageBlob, {}, { blocks: true });
      const boxes = ocrBlocksToTextBoxes(result.data.blocks, current, page.w, page.h);

      if (!boxes.length) {
        // A page can legitimately have no text at all (a photo, a divider) —
        // only bother the user about it when they asked for OCR explicitly.
        if (!auto) setError('OCR did not find readable text on this page. Try a sharper scan, or use Erase + Text manually.');
        return;
      }

      setPages((prev) =>
        prev.map((info, index) =>
          index === current
            ? {
                ...info,
                textBoxes: [
                  ...info.textBoxes.filter((box) => !box.id.startsWith(`ocr-${current}-`)),
                  ...boxes,
                ],
              }
            : info
        )
      );
      if (!auto) setTool('editText');
    } catch (e) {
      console.error(e);
      if (!auto) setError('OCR could not read this page. Try a clearer scan, or use Erase + Text manually.');
    } finally {
      await worker?.terminate().catch(() => undefined);
      setOcrStatus(null);
    }
  };

  // Scanned pages have no PDF text layer at all, so they'd otherwise sit
  // there uneditable until someone thinks to press the OCR button. Run it
  // automatically, once per page, the moment we land on a page with nothing
  // detected — silently, so a genuinely image-only page doesn't nag anyone.
  useEffect(() => {
    if (!page || ocrStatus) return;
    if (page.textBoxes.length > 0) return;
    if (autoOcrAttempted.current.has(current)) return;
    autoOcrAttempted.current.add(current);
    void runOcrOnCurrentPage(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, current, ocrStatus]);

  const exportPdf = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const srcDoc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const outDoc = await PDFDocument.create();
      // Embed every font-family/bold/italic combination up front (all built
      // into pdf-lib as StandardFonts, so this is cheap) so exported text
      // always matches the family + bold/italic choice made in the editor.
      const fontChoices = Object.keys(STANDARD_FONT_MAP) as FontChoice[];
      const fonts = {} as Record<FontChoice, Record<FontVariant, PDFFont>>;
      for (const family of fontChoices) {
        const variants = STANDARD_FONT_MAP[family];
        fonts[family] = {
          regular: await outDoc.embedFont(variants.regular),
          bold: await outDoc.embedFont(variants.bold),
          italic: await outDoc.embedFont(variants.italic),
          boldItalic: await outDoc.embedFont(variants.boldItalic),
        };
      }
      const fontFor = (el: { fontFamily: FontChoice; bold?: boolean; italic?: boolean }) =>
        fonts[el.fontFamily][fontVariantFor(el.bold, el.italic)];

      // Build the output document's pages in the sidebar's current order.
      // `remapPagesAndEls` keeps every element's `page` index in sync with
      // this same order whenever pages are reordered/inserted/deleted/
      // duplicated, so `outPages[el.page]` below always points at the right
      // page without needing a separate old-index -> new-index lookup here.
      const outPages: PDFPage[] = [];
      for (const info of pages) {
        let outPage: PDFPage;
        if (info.originalIndex < 0) {
          // A blank page inserted in the editor — no source page to copy.
          outPage = outDoc.addPage([info.w / PREVIEW_SCALE, info.h / PREVIEW_SCALE]);
        } else {
          const [copied] = await outDoc.copyPages(srcDoc, [info.originalIndex]);
          outDoc.addPage(copied);
          outPage = copied;
        }
        if (info.rotation) {
          outPage.setRotation(degrees((outPage.getRotation().angle + info.rotation) % 360));
        }
        outPages.push(outPage);
      }

      // A "Redact" whiteout doesn't just cover the original text visually —
      // it must stop the original text from being selectable/searchable in
      // the exported PDF. pdf-lib has no API to strip individual text
      // operators from an existing content stream, so the only reliable way
      // is to replace the whole page with a fresh, image-only page built
      // from the already-rendered preview (which has no text layer at all).
      // Any edit elements on that page (added text, cover rects, etc.) are
      // then drawn on top of that image in the loop below, same as always.
      const redactedPages = new Set(
        els
          .filter((el): el is El & { type: 'whiteout'; redact: true } => el.type === 'whiteout' && Boolean(el.redact))
          .map((el) => el.page)
      );
      for (const pageIndex of redactedPages) {
        const info = pages[pageIndex];
        const target = outPages[pageIndex];
        if (!info || !target || info.originalIndex < 0) continue;
        const { width: W, height: H } = target.getSize();
        const rasterBytes = await fetch(info.url).then((res) => res.arrayBuffer());
        const rasterImage = await outDoc.embedJpg(rasterBytes);
        const idx = outDoc.getPages().indexOf(target);
        outDoc.removePage(idx);
        const blankPage = outDoc.insertPage(idx, [W, H]);
        blankPage.drawImage(rasterImage, { x: 0, y: 0, width: W, height: H });
        outPages[pageIndex] = blankPage;
      }

      const form = hasFields ? outDoc.getForm() : null;

      for (const el of els) {
        const pdfPage = outPages[el.page];
        if (!pdfPage) continue;
        const { width: W, height: H } = pdfPage.getSize();

        if (el.type === 'replaceText' || el.type === 'whiteout') {
          const x = (el.xPct / 100) * W;
          const w = (el.wPct / 100) * W;
          const h = (el.hPct / 100) * H;
          const y = H - (el.yPct / 100) * H - h;
          const padX = W * 0.002;
          const padY = H * 0.0015;
          const maskX = x - padX;
          const maskY = y - padY;
          const maskW = w + padX * 2;
          const maskH = h + padY * 2;

          if (el.type === 'replaceText' && el.bgColorBottom && el.bgColorBottom !== el.bgColor) {
            // A detected vertical gradient — cover with matching thin bands
            // instead of one flat rectangle so the patch doesn't stand out
            // against a gradient background.
            const top = hexToRgbFloats(el.bgColor);
            const bottom = hexToRgbFloats(el.bgColorBottom);
            const bands = 14;
            const bandH = maskH / bands;
            for (let i = 0; i < bands; i++) {
              const t = i / (bands - 1);
              pdfPage.drawRectangle({
                x: maskX,
                // Top of the box has the higher y in PDF space, so band 0
                // (top color) starts at maskY + maskH and works downward.
                y: maskY + maskH - (i + 1) * bandH,
                width: maskW,
                height: bandH + 0.75, // slight overlap to avoid visible seams between bands
                color: rgb(lerp(top.r, bottom.r, t), lerp(top.g, bottom.g, t), lerp(top.b, bottom.b, t)),
              });
            }
          } else {
            // Cover the original text with the sampled flat page background
            // (falling back to white for a plain Erase) so the edit blends in.
            const maskColor = el.type === 'replaceText' ? hexToRgb(el.bgColor) : rgb(1, 1, 1);
            pdfPage.drawRectangle({ x: maskX, y: maskY, width: maskW, height: maskH, color: maskColor });
          }

          if (el.type === 'replaceText') {
            const size = (el.fontSizePct / 100) * H;
            drawTextBlock({
              page: pdfPage,
              font: fontFor(el),
              text: el.text,
              x,
              top: (el.yPct / 100) * H + size * 0.08,
              width: w,
              height: h,
              pageHeight: H,
              size,
              color: hexToRgb(el.color),
              singleLine: true,
              align: el.align,
              underline: el.underline,
            });
          }
        } else if (el.type === 'text') {
          const size = (el.fontSizePct / 100) * H;
          drawTextBlock({
            page: pdfPage,
            font: fontFor(el),
            text: el.text,
            x: (el.xPct / 100) * W,
            top: (el.yPct / 100) * H,
            width: (el.wPct / 100) * W,
            pageHeight: H,
            size,
            color: hexToRgb(el.color),
            align: el.align,
            underline: el.underline,
          });
        } else if (el.type === 'highlight' || el.type === 'rect') {
          const x = (el.xPct / 100) * W;
          const w = (el.wPct / 100) * W;
          const h = (el.hPct / 100) * H;
          const y = H - (el.yPct / 100) * H - h;
          if (el.type === 'highlight') {
            pdfPage.drawRectangle({ x, y, width: w, height: h, color: hexToRgb(el.color), opacity: 0.35 });
          } else {
            pdfPage.drawRectangle({ x, y, width: w, height: h, borderColor: hexToRgb(el.color), borderWidth: 1.5 });
          }
        } else if (el.type === 'image') {
          const bytes = await fetch(el.dataUrl).then((res) => res.arrayBuffer());
          const image = el.mime === 'image/png' ? await outDoc.embedPng(bytes) : await outDoc.embedJpg(bytes);
          const w = (el.wPct / 100) * W;
          const h = (el.hPct / 100) * H;
          pdfPage.drawImage(image, {
            x: (el.xPct / 100) * W,
            y: H - (el.yPct / 100) * H - h,
            width: w,
            height: h,
          });
        } else if (el.type === 'pen') {
          for (let i = 1; i < el.points.length; i++) {
            const a = el.points[i - 1];
            const b = el.points[i];
            pdfPage.drawLine({
              start: { x: (a.xPct / 100) * W, y: H - (a.yPct / 100) * H },
              end: { x: (b.xPct / 100) * W, y: H - (b.yPct / 100) * H },
              thickness: 2,
              color: hexToRgb(el.color),
            });
          }
        } else if (el.type === 'field' && form) {
          const x = (el.xPct / 100) * W;
          const w = (el.wPct / 100) * W;
          const h = (el.hPct / 100) * H;
          const y = H - (el.yPct / 100) * H - h;

          if (el.fieldKind === 'checkbox') {
            const checkbox = form.createCheckBox(el.name);
            checkbox.addToPage(pdfPage, { x, y, width: w, height: h });
          } else {
            // pdf-lib has no dedicated signature-field widget, so signature/
            // initials/date fields are text fields styled to read as fillable
            // placeholders — the same "click to fill" affordance iLovePDF
            // gives, just backed by a real AcroForm text field.
            const textField = form.createTextField(el.name);
            textField.addToPage(pdfPage, {
              x,
              y,
              width: w,
              height: h,
              borderWidth: 1,
              borderColor: rgb(0.02, 0.5, 0.9),
              backgroundColor: rgb(0.93, 0.97, 1),
            });
            textField.setFontSize(Math.max(7, Math.min(14, h * 0.55)));
          }
        }
      }

      if (form && flattenFields) form.flatten();

      const bytes = await outDoc.save();
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
      setResult({ blob, name: `${baseName(file.name)}-edited.pdf`, size: blob.size });
    } catch (e) {
      console.error(e);
      setError('Something went wrong while saving your edits.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    pages.forEach((p) => URL.revokeObjectURL(p.url));
    setFile(null);
    setPages([]);
    setEls([]);
    setPastEls([]);
    setFutureEls([]);
    setSelected(null);
    setResult(null);
    setError(null);
    setOcrStatus(null);
    setCurrent(0);
    setTool('editText');
    setZoom(1);
    textEditHistory.current.clear();
    autoOcrAttempted.current.clear();
  };

  const handleEditorShortcut = useEffectEvent((event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null;
    const isTyping = Boolean(target?.closest('[contenteditable="true"], input, textarea, select'));
    const isMod = event.metaKey || event.ctrlKey;

    if (isMod && event.key.toLowerCase() === 'z' && !event.shiftKey) {
      event.preventDefault();
      undo();
      return;
    }

    if ((isMod && event.key.toLowerCase() === 'y') || (isMod && event.shiftKey && event.key.toLowerCase() === 'z')) {
      event.preventDefault();
      redo();
      return;
    }

    if (!isTyping && (event.key === 'Backspace' || event.key === 'Delete')) {
      event.preventDefault();
      deleteSelected();
    }
  });

  useEffect(() => {
    if (!file) return;

    const onKeyDown = (event: KeyboardEvent) => {
      handleEditorShortcut(event);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [file]);

  if (result) {
    return (
      <PdfToolShell>
        <ResultPanel
          filename={result.name}
          size={result.size}
          onDownload={() => downloadBlob(result.blob, result.name)}
          onReset={reset}
        />
      </PdfToolShell>
    );
  }

  if (!file) {
    return (
      <PdfToolShell>
        <Dropzone accept="application/pdf" onFiles={onFiles} label="Select a PDF to edit" />
        {error && <ErrorNote>{error}</ErrorNote>}
      </PdfToolShell>
    );
  }

  if (rendering || !page) {
    return (
      <PdfToolShell>
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-500">
          <Loader2 className="h-7 w-7 animate-spin text-rose-500" />
          <p className="text-sm font-medium">Opening document...</p>
        </div>
      </PdfToolShell>
    );
  }

  const tools: [Tool, React.ReactNode, string][] = [
    ['editText', <TextCursorInput key="edit" className="h-4 w-4" />, 'Edit detected text'],
    ['select', <MousePointer2 key="select" className="h-4 w-4" />, 'Move'],
    ['text', <Type key="text" className="h-4 w-4" />, 'Add text'],
    ['whiteout', <Eraser key="erase" className="h-4 w-4" />, 'Erase'],
    ['redact', <ShieldOff key="redact" className="h-4 w-4" />, 'Redact (removes text)'],
    ['highlight', <Highlighter key="highlight" className="h-4 w-4" />, 'Highlight'],
    ['rect', <Square key="rect" className="h-4 w-4" />, 'Box'],
    ['pen', <Pen key="pen" className="h-4 w-4" />, 'Draw'],
  ];

  const fieldTools: [Tool, React.ReactNode, string][] = [
    ['field-text', <TextCursorInput key="field-text" className="h-4 w-4" />, 'Text field'],
    ['field-signature', <PenTool key="field-signature" className="h-4 w-4" />, 'Signature field'],
    ['field-initials', <PenTool key="field-initials" className="h-4 w-4" />, 'Initials field'],
    ['field-date', <Calendar key="field-date" className="h-4 w-4" />, 'Date field'],
    ['field-checkbox', <CheckSquare key="field-checkbox" className="h-4 w-4" />, 'Checkbox field'],
  ];

  const hasFields = els.some((el) => el.type === 'field');

  return (
    <PdfToolShell>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(e) => {
          void handleImageFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      <div className="sticky top-2 z-20 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            {tools.map(([t, icon, label]) => (
              <button
                key={t}
                type="button"
                onClick={() => setTool(t)}
                title={label}
                aria-label={label}
                className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-2 text-sm font-bold transition-all sm:w-auto sm:gap-1.5 sm:px-3 ${
                  tool === t
                    ? 'border-rose-600 bg-rose-600 text-white shadow-sm shadow-rose-600/20'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-rose-300 hover:text-rose-600'
                }`}
              >
                {icon}
                <span className="hidden text-xs sm:inline">{label}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              title="Add image"
              aria-label="Add image"
              className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm font-bold text-slate-600 transition-all hover:border-rose-300 hover:text-rose-600 sm:gap-1.5 sm:px-3"
            >
              <ImagePlus className="h-4 w-4" />
              <span className="hidden text-xs sm:inline">Image</span>
            </button>
            <button
              type="button"
              onClick={() => setSignaturePanelOpen((v) => !v)}
              title="Sign"
              aria-label="Sign"
              className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-2 text-sm font-bold transition-all sm:gap-1.5 sm:px-3 ${
                signaturePanelOpen
                  ? 'border-rose-600 bg-rose-600 text-white shadow-sm shadow-rose-600/20'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-rose-300 hover:text-rose-600'
              }`}
            >
              <PenTool className="h-4 w-4" />
              <span className="hidden text-xs sm:inline">Sign</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-0.5 hidden text-[10px] font-black uppercase tracking-wide text-slate-400 lg:inline">
              Fields
            </span>
            {fieldTools.map(([t, icon, label]) => (
              <button
                key={t}
                type="button"
                onClick={() => setTool(t)}
                title={label}
                aria-label={label}
                className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-2 text-sm font-bold transition-all sm:w-auto sm:gap-1.5 sm:px-3 ${
                  tool === t
                    ? 'border-sky-600 bg-sky-600 text-white shadow-sm shadow-sky-600/20'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-sky-300 hover:text-sky-600'
                }`}
              >
                {icon}
                <span className="hidden text-xs sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={undo}
              disabled={!pastEls.length}
              title="Undo"
              aria-label="Undo"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Undo2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!futureEls.length}
              title="Redo"
              aria-label="Redo"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Redo2 className="h-4 w-4" />
            </button>

            <div className="mx-1 hidden h-7 w-px bg-slate-200 sm:block" />

            <button
              type="button"
              onClick={() => setZoom((value) => clamp(Number((value - 0.15).toFixed(2)), 0.65, 2.4))}
              disabled={zoom <= 0.65}
              title="Zoom out"
              aria-label="Zoom out"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="min-w-12 text-center text-xs font-black text-slate-500">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoom((value) => clamp(Number((value + 0.15).toFixed(2)), 0.65, 2.4))}
              disabled={zoom >= 2.4}
              title="Zoom in"
              aria-label="Zoom in"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ZoomIn className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => runOcrOnCurrentPage()}
              disabled={Boolean(ocrStatus)}
              title="OCR this page"
              aria-label="OCR this page"
              className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3 text-xs font-black text-sky-700 transition-all hover:border-sky-300 disabled:cursor-wait disabled:opacity-60"
            >
              {ocrStatus ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanText className="h-4 w-4" />}
              OCR
            </button>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2">
          <span className="mr-1 text-[10px] font-black uppercase tracking-wide text-slate-400">Color</span>
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedTextColor(c)}
              title={`Color ${c}`}
              aria-label={`Color ${c}`}
              className={`h-7 w-7 rounded-full border transition-transform ${
                color === c ? 'border-slate-900 ring-2 ring-slate-200' : 'border-slate-200'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}

          {selectedElement && (selectedElement.type === 'text' || selectedElement.type === 'replaceText') && (
            <>
              <div className="mx-1 h-7 w-px bg-slate-200" />
              <label className="sr-only" htmlFor="font-family">Font</label>
              <select
                id="font-family"
                value={selectedElement.fontFamily}
                onChange={(e) => setSelectedFontFamily(e.target.value as FontChoice)}
                title="Font"
                aria-label="Font"
                className="h-9 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs font-bold text-slate-600 hover:border-rose-300"
              >
                {(Object.keys(FONT_LABELS) as FontChoice[]).map((f) => (
                  <option key={f} value={f}>{FONT_LABELS[f]}</option>
                ))}
              </select>
              <button
                type="button"
                title="Smaller text"
                aria-label="Smaller text"
                onClick={() => changeFontSize(-0.25)}
                className="flex h-9 items-center justify-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-600 hover:border-rose-300"
              >
                <Minus className="h-4 w-4" />
                Text
              </button>
              <button
                type="button"
                title="Larger text"
                aria-label="Larger text"
                onClick={() => changeFontSize(0.25)}
                className="flex h-9 items-center justify-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-600 hover:border-rose-300"
              >
                <Plus className="h-4 w-4" />
                Text
              </button>

              <div className="mx-1 h-7 w-px bg-slate-200" />

              {([
                ['bold', Bold, 'Bold', toggleSelectedBold, Boolean(selectedElement.bold)],
                ['italic', Italic, 'Italic', toggleSelectedItalic, Boolean(selectedElement.italic)],
                ['underline', Underline, 'Underline', toggleSelectedUnderline, Boolean(selectedElement.underline)],
              ] as const).map(([key, Icon, label, onToggle, active]) => (
                <button
                  key={key}
                  type="button"
                  title={label}
                  aria-label={label}
                  aria-pressed={active}
                  onClick={onToggle}
                  className={`flex h-9 w-9 items-center justify-center rounded-md border text-xs font-bold transition-all ${
                    active ? 'border-rose-600 bg-rose-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-rose-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}

              {([
                ['left', AlignLeft, 'Align left'],
                ['center', AlignCenter, 'Align center'],
                ['right', AlignRight, 'Align right'],
              ] as const).map(([value, Icon, label]) => (
                <button
                  key={value}
                  type="button"
                  title={label}
                  aria-label={label}
                  aria-pressed={(selectedElement.align ?? 'left') === value}
                  onClick={() => setSelectedAlign(value)}
                  className={`flex h-9 w-9 items-center justify-center rounded-md border text-xs font-bold transition-all ${
                    (selectedElement.align ?? 'left') === value
                      ? 'border-rose-600 bg-rose-600 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-rose-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </>
          )}

          {selectedElement && selectedElement.type === 'replaceText' && (
            <label
              title="Cover color — change this if the page background isn't a flat color the auto-match got wrong"
              className="flex h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 text-[10px] font-bold uppercase tracking-wide text-slate-500 hover:border-rose-300"
            >
              Cover
              <input
                type="color"
                value={selectedElement.bgColor}
                onChange={(e) => setSelectedBgColor(e.target.value)}
                aria-label="Cover color"
                className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
              />
            </label>
          )}

          {selectedElement && (
            <button
              type="button"
              onClick={deleteSelected}
              title={selectedElement.type === 'replaceText' ? 'Delete replacement text' : 'Delete selected item'}
              aria-label={selectedElement.type === 'replaceText' ? 'Delete replacement text' : 'Delete selected item'}
              className="ml-auto flex h-9 items-center justify-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-3 text-xs font-black text-rose-600 hover:border-rose-300"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          )}
        </div>
      </div>

      {signaturePanelOpen && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">
              Signature — click &quot;Add to page&quot; to place it, then click again to place on other pages
            </span>
            <button
              type="button"
              onClick={() => setSignaturePanelOpen(false)}
              className="text-xs font-bold text-slate-400 hover:text-rose-600"
            >
              Close
            </button>
          </div>

          <SignaturePad onChange={setDraftSignature} />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            {savedSignatures.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">Reuse</span>
                {savedSignatures.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void placeSignature(s)}
                    title="Place this signature again"
                    className="h-10 w-16 rounded border border-slate-200 bg-white p-0.5 hover:border-rose-300"
                  >
                    <img src={s} alt="Saved signature" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
            <PrimaryButton onClick={confirmDraftSignature} disabled={!draftSignature}>
              Add to page
            </PrimaryButton>
          </div>
        </div>
      )}

      {ocrStatus && (
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm font-semibold text-sky-800">
          <div className="flex items-center justify-between gap-3">
            <span>
              Reading page {ocrStatus.page + 1}: {ocrStatus.label}
            </span>
            <span>{Math.round(ocrStatus.progress * 100)}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-sky-500 transition-all"
              style={{ width: `${Math.max(8, ocrStatus.progress * 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[118px_minmax(0,1fr)]">
        <aside className="order-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 lg:order-1 lg:max-h-[76vh] lg:overflow-y-auto">
          <div className="mb-2 flex items-center gap-1.5 px-1 text-[10px] font-black uppercase tracking-wide text-slate-400">
            <PanelLeft className="h-3.5 w-3.5" />
            Pages
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-x-visible lg:pb-0">
            {pages.map((p, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => {
                  dragPageIndex.current = index;
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const from = dragPageIndex.current;
                  dragPageIndex.current = null;
                  if (from !== null) reorderPage(from, index);
                }}
                className={`min-w-20 shrink-0 cursor-grab rounded-xl border bg-white p-1 transition-all active:cursor-grabbing lg:min-w-0 ${
                  index === current
                    ? 'border-rose-500 shadow-sm shadow-rose-500/20'
                    : 'border-slate-200 hover:border-rose-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setCurrent(index);
                    setSelected(null);
                  }}
                  className="block w-full text-left"
                  aria-label={`Go to page ${index + 1}`}
                >
                  <img
                    src={p.url}
                    alt={`Page ${index + 1} thumbnail`}
                    className="h-24 w-full rounded-lg object-cover lg:h-auto"
                    style={{ transform: p.rotation ? `rotate(${p.rotation}deg)` : undefined }}
                  />
                  <span className="mt-1 block text-center text-[10px] font-black text-slate-500">Page {index + 1}</span>
                </button>
                <div className="mt-1 flex items-center justify-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => rotatePageAt(index)}
                    title="Rotate page"
                    aria-label={`Rotate page ${index + 1}`}
                    className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-rose-600"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicatePageAt(index)}
                    title="Duplicate page"
                    aria-label={`Duplicate page ${index + 1}`}
                    className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-rose-600"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertBlankPageAt(index)}
                    title="Insert blank page after"
                    aria-label={`Insert blank page after page ${index + 1}`}
                    className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-rose-600"
                  >
                    <FilePlus2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePageAt(index)}
                    disabled={pages.length <= 1}
                    title="Delete page"
                    aria-label={`Delete page ${index + 1}`}
                    className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <section className="order-1 min-w-0 lg:order-2">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <button onClick={reset} className="text-xs font-bold text-rose-600 hover:underline">
              Change file
            </button>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0}
                aria-label="Previous page"
                className="rounded-md border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-bold text-slate-500">
                Page {current + 1} of {pages.length}
              </span>
              <button
                type="button"
                onClick={() => setCurrent((c) => Math.min(pages.length - 1, c + 1))}
                disabled={current === pages.length - 1}
                aria-label="Next page"
                className="rounded-md border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">
              {page.textBoxes.length ? `${page.textBoxes.length} editable text lines` : 'No text layer yet. Try OCR.'}
            </span>
          </div>

          <div className="max-h-[76vh] overflow-auto rounded-2xl border border-slate-200 bg-[radial-gradient(circle_at_1px_1px,rgba(100,116,139,0.20)_1px,transparent_0)] bg-[length:18px_18px] p-2 shadow-inner sm:p-4">
            <div className="mx-auto" style={{ width: `${displayWidth}px`, maxWidth: zoom <= 1 ? '100%' : undefined }}>
              <div
                ref={overlayRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                className="relative touch-none select-none overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
                style={{ cursor: tool === 'select' ? 'default' : tool === 'editText' ? 'text' : 'crosshair' }}
              >
                <img src={page.url} alt={`Page ${current + 1}`} className="pointer-events-none w-full" draggable={false} />

                {tool === 'editText' &&
                  detectedText.map((box) => (
                    <button
                      key={box.id}
                      type="button"
                      data-editor-control="true"
                      title={box.text}
                      aria-label={`Edit text: ${box.text}`}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        editSourceText(box);
                      }}
                      // Invisible by default so the page just looks like the PDF;
                      // a faint tint appears only on hover/focus to show the line
                      // under the cursor is clickable to edit.
                      className="absolute cursor-text rounded-[1px] border border-transparent bg-transparent transition-colors hover:border-sky-500/40 hover:bg-sky-400/10 focus-visible:border-sky-500/60 focus-visible:bg-sky-400/15"
                      style={{
                        left: `${box.xPct}%`,
                        top: `${box.yPct}%`,
                        width: `${box.wPct}%`,
                        height: `${box.hPct}%`,
                      }}
                    />
                  ))}

                {currentEls.map((el) => {
                  const selectedThis = selectedElement?.id === el.id;

                  if (el.type === 'text' || el.type === 'replaceText') {
                    const fontSize = Math.max(8, (el.fontSizePct / 100) * overlaySize.height);
                    const textHeight =
                      el.type === 'replaceText'
                        ? el.hPct
                        : Math.max(3, (fontSize / Math.max(1, overlaySize.height)) * 100 * 1.25);

                    const isReplace = el.type === 'replaceText';
                    return (
                      <div
                        key={el.id}
                        data-editor-control="true"
                        onPointerDown={(e) => startDrag(e, el)}
                        style={{
                          left: `${el.xPct}%`,
                          top: `${el.yPct}%`,
                          // A detected line stays on ONE line and only grows as
                          // wide as its text (never narrower than the original,
                          // so it still covers it) — editing it never reflows it
                          // into two lines. New text boxes keep wrapping.
                          ...(isReplace
                            ? { minWidth: `${el.wPct}%`, width: 'max-content', whiteSpace: 'nowrap' as const, overflow: 'visible' as const }
                            : { width: `${el.wPct}%`, whiteSpace: 'pre-wrap' as const, overflow: 'hidden' as const }),
                          minHeight: `${textHeight}%`,
                          backgroundColor: isReplace ? el.bgColor : 'transparent',
                          // A detected gradient (bgColorBottom differs from bgColor)
                          // covers with a matching top-to-bottom gradient instead
                          // of a flat swatch, so the cover blends into gradient
                          // backgrounds instead of reading as an obvious patch.
                          backgroundImage:
                            isReplace && el.bgColorBottom && el.bgColorBottom !== el.bgColor
                              ? `linear-gradient(to bottom, ${el.bgColor}, ${el.bgColorBottom})`
                              : undefined,
                          color: el.color,
                          fontFamily: FONT_STACKS[el.fontFamily],
                          fontSize,
                          fontWeight: el.bold ? 700 : 400,
                          fontStyle: el.italic ? 'italic' : 'normal',
                          textDecoration: el.underline ? 'underline' : 'none',
                          textAlign: el.align ?? 'left',
                          // No boxed selection outline — editing should read as
                          // inline text with just a caret, not a framed box.
                          outline: 'none',
                        }}
                        className="absolute cursor-text px-[1px] font-normal leading-tight"
                      >
                        <div
                          data-editable-id={el.id}
                          contentEditable={selectedThis}
                          suppressContentEditableWarning
                          onBlur={() => textEditHistory.current.delete(el.id)}
                          onPointerDown={(e) => {
                            if (selectedThis) e.stopPropagation();
                          }}
                          onInput={(e) => {
                            if (!textEditHistory.current.has(el.id)) {
                              pushHistorySnapshot();
                              textEditHistory.current.add(el.id);
                            }
                            const text = e.currentTarget.innerText.replace(/\n{3,}/g, '\n\n');
                            updateEl(el.id, (currentEl) =>
                              currentEl.type === 'text' || currentEl.type === 'replaceText'
                                ? { ...currentEl, text }
                                : currentEl
                            );
                          }}
                          className="min-h-[1em] outline-none"
                        >
                          {el.text}
                        </div>
                        {selectedThis && (
                          <span
                            data-editor-control="true"
                            onPointerDown={(e) => startResize(e, el)}
                            title="Drag to widen"
                            className={`absolute h-4 w-4 cursor-ew-resize rounded-tl-sm border-l border-t border-rose-500 bg-white ${
                              el.type === 'replaceText' ? 'bottom-0 right-0 cursor-nwse-resize' : 'right-0 top-1/2 -translate-y-1/2'
                            }`}
                          />
                        )}
                      </div>
                    );
                  }

                  if (el.type === 'whiteout' || el.type === 'highlight' || el.type === 'rect' || el.type === 'image') {
                    return (
                      <div
                        key={el.id}
                        data-editor-control="true"
                        onPointerDown={(e) => startDrag(e, el)}
                        style={{
                          left: `${el.xPct}%`,
                          top: `${el.yPct}%`,
                          width: `${el.wPct}%`,
                          height: `${el.hPct}%`,
                          backgroundColor:
                            el.type === 'whiteout' ? '#ffffff' : el.type === 'highlight' ? el.color : 'transparent',
                          opacity: el.type === 'highlight' ? 0.35 : 1,
                          border:
                            el.type === 'rect'
                              ? `2px solid ${el.color}`
                              : el.type === 'whiteout' && el.redact
                                ? '1px dashed #dc2626'
                                : selectedThis
                                  ? '1px solid #e11d48'
                                  : el.type === 'whiteout'
                                    ? '1px solid rgba(15,23,42,0.08)'
                                    : 'none',
                          outline: selectedThis ? '1px solid #e11d48' : 'none',
                        }}
                        className="absolute cursor-move"
                        title={el.type === 'whiteout' && el.redact ? 'Redacted — underlying text is removed on save' : undefined}
                      >
                        {el.type === 'image' && (
                          <img src={el.dataUrl} alt="" className="h-full w-full object-fill" draggable={false} />
                        )}
                        {selectedThis && (
                          <span
                            data-editor-control="true"
                            onPointerDown={(e) => startResize(e, el)}
                            className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize rounded-tl-sm border-l border-t border-rose-500 bg-white"
                          />
                        )}
                      </div>
                    );
                  }

                  if (el.type === 'field') {
                    return (
                      <div
                        key={el.id}
                        data-editor-control="true"
                        onPointerDown={(e) => startDrag(e, el)}
                        title={`${FIELD_LABELS[el.fieldKind]} field "${el.name}"`}
                        style={{
                          left: `${el.xPct}%`,
                          top: `${el.yPct}%`,
                          width: `${el.wPct}%`,
                          height: `${el.hPct}%`,
                          outline: selectedThis ? '1px solid #e11d48' : 'none',
                        }}
                        className="absolute flex cursor-move items-center justify-center gap-1 rounded-[3px] border border-dashed border-sky-500 bg-sky-400/10 px-1 text-[9px] font-black uppercase tracking-wide text-sky-700"
                      >
                        {el.fieldKind === 'checkbox' ? (
                          <CheckSquare className="h-3 w-3 shrink-0" />
                        ) : el.fieldKind === 'date' ? (
                          <Calendar className="h-3 w-3 shrink-0" />
                        ) : el.fieldKind === 'signature' || el.fieldKind === 'initials' ? (
                          <PenTool className="h-3 w-3 shrink-0" />
                        ) : (
                          <TextCursorInput className="h-3 w-3 shrink-0" />
                        )}
                        {el.fieldKind !== 'checkbox' && <span className="truncate">{FIELD_LABELS[el.fieldKind]}</span>}
                        {selectedThis && (
                          <span
                            data-editor-control="true"
                            onPointerDown={(e) => startResize(e, el)}
                            className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize rounded-tl-sm border-l border-t border-rose-500 bg-white"
                          />
                        )}
                      </div>
                    );
                  }

                  if (el.type === 'pen') {
                    return (
                      <svg
                        key={el.id}
                        className="pointer-events-none absolute inset-0 h-full w-full"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <polyline
                          points={el.points.map((p) => `${p.xPct},${p.yPct}`).join(' ')}
                          fill="none"
                          stroke={el.color}
                          strokeWidth={0.4}
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          </div>
        </section>
      </div>

      {hasFields && (
        <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <input
            type="checkbox"
            checked={flattenFields}
            onChange={(e) => setFlattenFields(e.target.checked)}
            className="h-4 w-4 accent-rose-600"
          />
          Flatten fields into the page (uncheck to keep them fillable/interactive)
        </label>
      )}

      {error && <ErrorNote>{error}</ErrorNote>}
      <PrimaryButton onClick={exportPdf} loading={loading}>
        <Save className="h-4 w-4" />
        {loading ? 'Saving...' : 'Save edited PDF'}
      </PrimaryButton>
    </PdfToolShell>
  );
}
