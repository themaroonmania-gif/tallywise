'use client';

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useEffectEvent, useRef, useState } from 'react';
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Eraser,
  FileDown,
  Highlighter,
  ImagePlus,
  Loader2,
  Minus,
  MousePointer2,
  PanelLeft,
  Pen,
  Plus,
  Redo2,
  Save,
  ScanText,
  Square,
  TextCursorInput,
  Trash2,
  Type,
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
import { renderPdfPages } from '@/lib/pdfRender';
import { loadPdfjs } from '@/lib/pdfjs';
import { baseName } from '@/lib/pdfUtils';

type Tool = 'select' | 'editText' | 'text' | 'whiteout' | 'highlight' | 'rect' | 'pen' | 'image';
type RectTool = 'whiteout' | 'highlight' | 'rect';
type FontStyle = 'normal' | 'italic';
type PdfFontKey =
  | 'helvetica'
  | 'helveticaBold'
  | 'helveticaOblique'
  | 'helveticaBoldOblique'
  | 'times'
  | 'timesBold'
  | 'timesItalic'
  | 'timesBoldItalic'
  | 'courier'
  | 'courierBold'
  | 'courierOblique'
  | 'courierBoldOblique';

interface TextAppearance {
  fontFamily: string;
  fontWeight: number;
  fontStyle: FontStyle;
  pdfFontKey: PdfFontKey;
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
  fontFamily: string;
  fontWeight: number;
  fontStyle: FontStyle;
  pdfFontKey: PdfFontKey;
}

interface RenderedPageInfo {
  url: string;
  w: number;
  h: number;
  textBoxes: PdfTextBox[];
}

interface OcrStatus {
  page: number;
  label: string;
  progress: number;
}

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
      fontFamily: string;
      fontWeight: number;
      fontStyle: FontStyle;
      pdfFontKey: PdfFontKey;
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
      backgroundColor: string;
      fontFamily: string;
      fontWeight: number;
      fontStyle: FontStyle;
      pdfFontKey: PdfFontKey;
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
    };

type Selected = { kind: 'element'; id: string } | null;

interface PdfTextItem {
  str: string;
  transform: number[];
  width: number;
  height: number;
  hasEOL?: boolean;
  fontName?: string;
}

interface RawTextRun {
  text: string;
  left: number;
  top: number;
  right: number;
  bottom: number;
  fontSize: number;
  hasEOL: boolean;
  fontFamily: string;
  fontWeight: number;
  fontStyle: FontStyle;
  pdfFontKey: PdfFontKey;
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
const uid = () => Math.random().toString(36).slice(2);
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

function inferTextAppearance(fontName?: string, fontFamily?: string): TextAppearance {
  const descriptor = `${fontName ?? ''} ${fontFamily ?? ''}`.toLowerCase();
  const isBold = /(bold|black|heavy|semibold|semi-bold|demi|medium)/.test(descriptor);
  const isItalic = /(italic|oblique)/.test(descriptor);

  if (/(courier|mono|consolas|menlo|monaco)/.test(descriptor)) {
    return {
      fontFamily: '"Courier New", Courier, monospace',
      fontWeight: isBold ? 700 : 400,
      fontStyle: isItalic ? 'italic' : 'normal',
      pdfFontKey: isBold && isItalic ? 'courierBoldOblique' : isBold ? 'courierBold' : isItalic ? 'courierOblique' : 'courier',
    };
  }

  if (/(times|serif|georgia|garamond|cambria)/.test(descriptor)) {
    return {
      fontFamily: '"Times New Roman", Times, serif',
      fontWeight: isBold ? 700 : 400,
      fontStyle: isItalic ? 'italic' : 'normal',
      pdfFontKey: isBold && isItalic ? 'timesBoldItalic' : isBold ? 'timesBold' : isItalic ? 'timesItalic' : 'times',
    };
  }

  return {
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontWeight: isBold ? 700 : 400,
    fontStyle: isItalic ? 'italic' : 'normal',
    pdfFontKey: isBold && isItalic ? 'helveticaBoldOblique' : isBold ? 'helveticaBold' : isItalic ? 'helveticaOblique' : 'helvetica',
  };
}

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

    // Two runs belong to the same visual line only if their vertical extents
    // substantially overlap — robust to different font sizes within one line
    // (e.g. superscripts) while reliably keeping two genuinely different
    // lines apart even when tightly spaced. A simple "centers within N px"
    // check (the previous approach) could misfire on single-spaced text and
    // merge adjacent lines together.
    let sameLine = false;
    if (lastRun) {
      const overlapTop = Math.max(run.top, lastRun.top);
      const overlapBottom = Math.min(run.bottom, lastRun.bottom);
      const overlap = overlapBottom - overlapTop;
      const shorterHeight = Math.min(run.bottom - run.top, lastRun.bottom - lastRun.top);
      sameLine = shorterHeight > 0 && overlap / shorterHeight >= 0.5;
    }
    const gap = lastRun ? run.left - lastRun.right : 0;
    const sameSentence = sameLine && gap <= Math.max(28, run.fontSize * 3.2);

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
    const styleRun = sorted.reduce((best, run) => (run.text.length > best.text.length ? run : best), sorted[0]);
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
      fontFamily: styleRun.fontFamily,
      fontWeight: styleRun.fontWeight,
      fontStyle: styleRun.fontStyle,
      pdfFontKey: styleRun.pdfFontKey,
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
      const styles = (content as { styles?: Record<string, { fontFamily?: string }> }).styles ?? {};
      const rawRuns: RawTextRun[] = [];

      for (const item of content.items ?? []) {
        if (!isPdfTextItem(item) || !item.str.trim()) continue;
        const appearance = inferTextAppearance(item.fontName, item.fontName ? styles[item.fontName]?.fontFamily : undefined);
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
          ...appearance,
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
const DEFAULT_PAGE_COLOR = '#ffffff';
const DEFAULT_TEXT_APPEARANCE: TextAppearance = inferTextAppearance();
const STANDARD_FONT_BY_KEY: Record<PdfFontKey, StandardFonts> = {
  helvetica: StandardFonts.Helvetica,
  helveticaBold: StandardFonts.HelveticaBold,
  helveticaOblique: StandardFonts.HelveticaOblique,
  helveticaBoldOblique: StandardFonts.HelveticaBoldOblique,
  times: StandardFonts.TimesRoman,
  timesBold: StandardFonts.TimesRomanBold,
  timesItalic: StandardFonts.TimesRomanItalic,
  timesBoldItalic: StandardFonts.TimesRomanBoldItalic,
  courier: StandardFonts.Courier,
  courierBold: StandardFonts.CourierBold,
  courierOblique: StandardFonts.CourierOblique,
  courierBoldOblique: StandardFonts.CourierBoldOblique,
};

/**
 * Approximates the original ink color of a detected text line by sampling
 * the darkest pixel inside its bounding box on the rendered page image —
 * so replacing text keeps looking like the source instead of always
 * turning near-black, regardless of whether it came from the PDF's text
 * layer or from OCR on a scanned page.
 */
function sampleTextColor(
  imageUrl: string,
  box: { xPct: number; yPct: number; wPct: number; hPct: number }
): Promise<string> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return resolve(DEFAULT_TEXT_COLOR);

        ctx.drawImage(image, 0, 0);
        const x = clamp(Math.round((box.xPct / 100) * canvas.width), 0, canvas.width - 1);
        const y = clamp(Math.round((box.yPct / 100) * canvas.height), 0, canvas.height - 1);
        const w = clamp(Math.round((box.wPct / 100) * canvas.width), 1, canvas.width - x);
        const h = clamp(Math.round((box.hPct / 100) * canvas.height), 1, canvas.height - y);
        const { data } = ctx.getImageData(x, y, w, h);

        let bestR = 17, bestG = 24, bestB = 39, bestLuminance = Infinity;
        for (let i = 0; i < data.length; i += 4) {
          const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
          if (a < 200) continue;
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
          if (luminance < bestLuminance) {
            bestLuminance = luminance;
            bestR = r; bestG = g; bestB = b;
          }
        }

        const toHex = (n: number) => n.toString(16).padStart(2, '0');
        resolve(`#${toHex(bestR)}${toHex(bestG)}${toHex(bestB)}`);
      } catch {
        resolve(DEFAULT_TEXT_COLOR);
      }
    };
    image.onerror = () => resolve(DEFAULT_TEXT_COLOR);
    image.src = imageUrl;
  });
}

/**
 * Approximates the background color behind a detected text line by finding
 * the most common color strictly *inside* its own bounding box — background
 * pixels vastly outnumber glyph-ink pixels in a tight line box, so the
 * dominant color reliably wins.
 *
 * Earlier this sampled a padded ring *around* the box instead, on the theory
 * that avoiding the box's own ink pixels would give a cleaner read. In
 * practice that ring routinely overlapped the line directly above/below
 * (real documents are rarely spaced far enough apart for a padding ring to
 * clear neighboring lines), so it would average in ink from an unrelated
 * line and return a visibly wrong color. Sampling inside the box avoids that
 * failure mode entirely, at the cost of needing to filter out ink pixels by
 * luminance instead of by position.
 */
function sampleBackgroundColor(
  imageUrl: string,
  box: { xPct: number; yPct: number; wPct: number; hPct: number }
): Promise<string> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return resolve(DEFAULT_PAGE_COLOR);

        ctx.drawImage(image, 0, 0);
        const x = clamp(Math.round((box.xPct / 100) * canvas.width), 0, canvas.width - 1);
        const y = clamp(Math.round((box.yPct / 100) * canvas.height), 0, canvas.height - 1);
        const w = clamp(Math.round((box.wPct / 100) * canvas.width), 1, canvas.width - x);
        const h = clamp(Math.round((box.hPct / 100) * canvas.height), 1, canvas.height - y);
        const { data } = ctx.getImageData(x, y, w, h);

        const buckets = new Map<string, { count: number; r: number; g: number; b: number }>();
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
          if (a < 200) continue;

          // Quantize to 16 levels/channel so anti-aliasing noise around
          // glyph edges collapses into the same bucket, letting the true
          // background win by pixel count instead of splitting its vote.
          const key = `${r >> 4}-${g >> 4}-${b >> 4}`;
          const bucket = buckets.get(key) ?? { count: 0, r: 0, g: 0, b: 0 };
          bucket.count += 1;
          bucket.r += r;
          bucket.g += g;
          bucket.b += b;
          buckets.set(key, bucket);
        }

        let best = [...buckets.values()].sort((a, b) => b.count - a.count)[0];
        if (!best) best = { count: 1, r: 255, g: 255, b: 255 };
        const bestR = Math.round(best.r / best.count);
        const bestG = Math.round(best.g / best.count);
        const bestB = Math.round(best.b / best.count);
        const toHex = (n: number) => n.toString(16).padStart(2, '0');
        resolve(`#${toHex(bestR)}${toHex(bestG)}${toHex(bestB)}`);
      } catch {
        resolve(DEFAULT_PAGE_COLOR);
      }
    };
    image.onerror = () => resolve(DEFAULT_PAGE_COLOR);
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
          ...DEFAULT_TEXT_APPEARANCE,
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
}) {
  if (!text.trim()) return;
  const lineHeight = size * 1.16;
  const lines = wrapText(text, font, size, width);
  const maxLines = height ? Math.max(1, Math.floor((height + size * 0.35) / lineHeight)) : lines.length;

  lines.slice(0, maxLines).forEach((line, index) => {
    page.drawText(line, {
      x,
      y: pageHeight - top - size - index * lineHeight,
      size,
      font,
      color,
    });
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
        ...DEFAULT_TEXT_APPEARANCE,
      },
    ]);
    setSelected({ kind: 'element', id });
    setFocusElementId(id);
    // Stay in the text tool so clicking this box — or clicking elsewhere to
    // add another one — keeps placing/editing text instead of dropping into
    // Move mode, where the next click would drag the box instead of typing.
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
    // Placeholder color while sampling, so the box appears instantly instead
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
        backgroundColor: DEFAULT_PAGE_COLOR,
        fontFamily: box.fontFamily,
        fontWeight: box.fontWeight,
        fontStyle: box.fontStyle,
        pdfFontKey: box.pdfFontKey,
      },
    ]);
    setSelected({ kind: 'element', id });
    setFocusElementId(id);
    setTool('editText');

    // Match the original text's color instead of always defaulting to
    // near-black, so editing a line doesn't change how it looks.
    const pageUrl = page?.url;
    if (pageUrl) {
      Promise.all([sampleTextColor(pageUrl, box), sampleBackgroundColor(pageUrl, box)]).then(([sampledColor, backgroundColor]) => {
        updateEl(id, (el) =>
          el.type === 'replaceText' ? { ...el, color: sampledColor, backgroundColor } : el
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

    if (tool === 'whiteout' || tool === 'highlight' || tool === 'rect') {
      const id = uid();
      drafting.current = { id, startX: xPct, startY: yPct };
      pushHistorySnapshot();
      setEls((prev) => [
        ...prev,
        { id, page: current, type: tool, xPct, yPct, wPct: 0, hPct: 0, color: tool === 'whiteout' ? DEFAULT_PAGE_COLOR : color },
      ]);
      setSelected({ kind: 'element', id });
      overlayRef.current?.setPointerCapture(e.pointerId);
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
      // In the text/editText tools, a text box is click-to-edit only — never
      // dragged. Dragging is reserved for the Move tool.
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
    // Text boxes stay clickable-to-edit in the text/editText tools (just not
    // draggable there); every other element only reacts in Move mode.
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

  const applyColor = (nextColor: string) => {
    setColor(nextColor);
    if (!selectedElement || selectedElement.type === 'image') return;
    commitUpdateEl(selectedElement.id, (el) => ('color' in el ? { ...el, color: nextColor } : el));
  };

  const duplicateSelected = () => {
    if (!selectedElement) return;

    const id = uid();
    let clone: El;

    if (selectedElement.type === 'pen') {
      clone = {
        ...selectedElement,
        id,
        points: selectedElement.points.map((point) => ({
          xPct: clamp(point.xPct + 1.5, 0, 100),
          yPct: clamp(point.yPct + 1.5, 0, 100),
        })),
      };
    } else {
      const w = selectedElement.wPct;
      const h = 'hPct' in selectedElement ? selectedElement.hPct : 3;
      clone = {
        ...selectedElement,
        id,
        xPct: clamp(selectedElement.xPct + 2, 0, 100 - w),
        yPct: clamp(selectedElement.yPct + 2, 0, 100 - h),
      };
    }

    commitEls((prev) => [...prev, clone]);
    setSelected({ kind: 'element', id });
  };

  const clearCurrentPage = () => {
    if (!currentEls.length) return;
    commitEls((prev) => prev.filter((el) => el.page !== current));
    setSelected(null);
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
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const embeddedFonts: Partial<Record<PdfFontKey, PDFFont>> = {};
      const getFont = async (fontKey: PdfFontKey) => {
        let font = embeddedFonts[fontKey];
        if (!font) {
          font = await doc.embedFont(STANDARD_FONT_BY_KEY[fontKey]);
          embeddedFonts[fontKey] = font;
        }
        return font;
      };
      const docPages = doc.getPages();

      for (const el of els) {
        const pdfPage = docPages[el.page];
        if (!pdfPage) continue;
        const { width: W, height: H } = pdfPage.getSize();

        if (el.type === 'replaceText' || el.type === 'whiteout') {
          const x = (el.xPct / 100) * W;
          const w = (el.wPct / 100) * W;
          const h = (el.hPct / 100) * H;
          const y = H - (el.yPct / 100) * H - h;
          const padX = W * 0.002;
          const padY = H * 0.0015;
          pdfPage.drawRectangle({
            x: x - padX,
            y: y - padY,
            width: w + padX * 2,
            height: h + padY * 2,
            color: el.type === 'replaceText' ? hexToRgb(el.backgroundColor) : hexToRgb(el.color),
          });

          if (el.type === 'replaceText') {
            const size = (el.fontSizePct / 100) * H;
            const font = await getFont(el.pdfFontKey);
            drawTextBlock({
              page: pdfPage,
              font,
              text: el.text,
              x,
              top: (el.yPct / 100) * H + size * 0.08,
              width: w,
              height: h,
              pageHeight: H,
              size,
              color: hexToRgb(el.color),
            });
          }
        } else if (el.type === 'text') {
          const size = (el.fontSizePct / 100) * H;
          const font = await getFont(el.pdfFontKey);
          drawTextBlock({
            page: pdfPage,
            font,
            text: el.text,
            x: (el.xPct / 100) * W,
            top: (el.yPct / 100) * H,
            width: (el.wPct / 100) * W,
            pageHeight: H,
            size,
            color: hexToRgb(el.color),
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
          const image = el.mime === 'image/png' ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
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
        }
      }

      const bytes = await doc.save();
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
    ['highlight', <Highlighter key="highlight" className="h-4 w-4" />, 'Highlight'],
    ['rect', <Square key="rect" className="h-4 w-4" />, 'Box'],
    ['pen', <Pen key="pen" className="h-4 w-4" />, 'Draw'],
  ];

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

      <div className="sticky top-2 z-20 rounded-[1.5rem] border border-[#dacbb3] bg-[#fffaf0]/95 p-2 shadow-xl shadow-[#3b2a16]/10 backdrop-blur">
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
                    ? 'border-[#1b2a2f] bg-[#1b2a2f] text-[#f6efe1] shadow-sm shadow-slate-900/20'
                    : 'border-[#dacbb3] bg-white/70 text-[#5f554d] hover:border-[#b77a22]/50 hover:text-[#241c17]'
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
              className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-[#dacbb3] bg-white/70 px-2 text-sm font-bold text-[#5f554d] transition-all hover:border-[#b77a22]/50 hover:text-[#241c17] sm:gap-1.5 sm:px-3"
            >
              <ImagePlus className="h-4 w-4" />
              <span className="hidden text-xs sm:inline">Image</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={undo}
              disabled={!pastEls.length}
              title="Undo"
              aria-label="Undo"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#dacbb3] bg-white/70 text-[#5f554d] transition-all hover:border-[#b77a22]/50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Undo2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!futureEls.length}
              title="Redo"
              aria-label="Redo"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#dacbb3] bg-white/70 text-[#5f554d] transition-all hover:border-[#b77a22]/50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Redo2 className="h-4 w-4" />
            </button>

            <div className="mx-1 hidden h-7 w-px bg-[#dacbb3] sm:block" />

            <button
              type="button"
              onClick={() => setZoom((value) => clamp(Number((value - 0.15).toFixed(2)), 0.65, 2.4))}
              disabled={zoom <= 0.65}
              title="Zoom out"
              aria-label="Zoom out"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#dacbb3] bg-white/70 text-[#5f554d] transition-all hover:border-[#b77a22]/50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(1)}
              title="Fit page"
              aria-label="Fit page"
              className="flex h-10 items-center justify-center rounded-lg border border-[#dacbb3] bg-white/70 px-3 text-xs font-black uppercase tracking-[0.12em] text-[#5f554d] transition-all hover:border-[#b77a22]/50"
            >
              Fit
            </button>
            <span className="min-w-12 text-center text-xs font-black text-[#6f6459]">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoom((value) => clamp(Number((value + 0.15).toFixed(2)), 0.65, 2.4))}
              disabled={zoom >= 2.4}
              title="Zoom in"
              aria-label="Zoom in"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#dacbb3] bg-white/70 text-[#5f554d] transition-all hover:border-[#b77a22]/50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ZoomIn className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => runOcrOnCurrentPage()}
              disabled={Boolean(ocrStatus)}
              title="OCR this page"
              aria-label="OCR this page"
              className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-[#0f766e]/25 bg-[#0f766e]/10 px-3 text-xs font-black text-[#0f766e] transition-all hover:border-[#0f766e]/45 disabled:cursor-wait disabled:opacity-60"
            >
              {ocrStatus ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanText className="h-4 w-4" />}
              OCR
            </button>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-[#dacbb3] pt-2">
          <span className="mr-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#8f8170]">Color</span>
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => applyColor(c)}
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
            </>
          )}

          {selectedElement && (
            <>
              <button
                type="button"
                onClick={duplicateSelected}
                title="Duplicate selected item"
                aria-label="Duplicate selected item"
                className="ml-auto flex h-9 items-center justify-center gap-1 rounded-md border border-[#dacbb3] bg-white/70 px-3 text-xs font-black text-[#5f554d] hover:border-[#b77a22]/50"
              >
                <Copy className="h-4 w-4" />
                Duplicate
              </button>
              <button
                type="button"
                onClick={deleteSelected}
                title={selectedElement.type === 'replaceText' ? 'Delete replacement text' : 'Delete selected item'}
                aria-label={selectedElement.type === 'replaceText' ? 'Delete replacement text' : 'Delete selected item'}
                className="flex h-9 items-center justify-center gap-1 rounded-md border border-[#be123c]/20 bg-[#fff1f2] px-3 text-xs font-black text-[#be123c] hover:border-[#be123c]/40"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </>
          )}
          <button
            type="button"
            onClick={clearCurrentPage}
            disabled={!currentEls.length}
            className="flex h-9 items-center justify-center rounded-md border border-[#dacbb3] bg-white/70 px-3 text-xs font-black uppercase tracking-[0.12em] text-[#5f554d] hover:border-[#b77a22]/50 disabled:cursor-not-allowed disabled:opacity-35"
          >
            Clear page
          </button>
        </div>
      </div>

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

      {selectedElement && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dacbb3] bg-[#fffaf0]/80 px-4 py-3 text-xs font-bold text-[#6f6459]">
          <span>
            Selected: <strong className="text-[#241c17]">{selectedElement.type === 'replaceText' ? 'source text' : selectedElement.type}</strong>
          </span>
          {elementHasBox(selectedElement) && (
            <span>
              Position {Math.round(selectedElement.xPct)}%, {Math.round(selectedElement.yPct)}% -
              Width {Math.round(selectedElement.wPct)}%
            </span>
          )}
          <span className="text-[#8a5417]">Drag to move. Resize from the handle. Delete masks source text.</span>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[124px_minmax(0,1fr)]">
        <aside className="order-2 rounded-[1.5rem] border border-[#dacbb3] bg-[#fbf4e6] p-2 lg:order-1 lg:max-h-[76vh] lg:overflow-y-auto">
          <div className="mb-2 flex items-center gap-1.5 px-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#8f8170]">
            <PanelLeft className="h-3.5 w-3.5" />
            Pages
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-x-visible lg:pb-0">
            {pages.map((p, index) => (
              <button
                key={p.url}
                type="button"
                onClick={() => {
                  setCurrent(index);
                  setSelected(null);
                }}
                className={`min-w-20 rounded-xl border bg-white p-1 text-left transition-all lg:min-w-0 ${
                  index === current
                    ? 'border-[#b77a22] shadow-sm shadow-[#b77a22]/20'
                    : 'border-[#dacbb3] hover:border-[#b77a22]/45'
                }`}
                aria-label={`Go to page ${index + 1}`}
              >
                <img src={p.url} alt={`Page ${index + 1} thumbnail`} className="h-24 w-full rounded-lg object-cover lg:h-auto" />
                <span className="mt-1 block text-center text-[10px] font-black text-[#6f6459]">Page {index + 1}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="order-1 min-w-0 lg:order-2">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dacbb3] bg-[#fffaf0]/80 px-3 py-2">
            <button onClick={reset} className="text-xs font-black text-[#be123c] hover:underline">
              Change file
            </button>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0}
                aria-label="Previous page"
                className="rounded-md border border-[#dacbb3] bg-white p-2 text-[#5f554d] disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-black text-[#5f554d]">
                Page {current + 1} of {pages.length}
              </span>
              <button
                type="button"
                onClick={() => setCurrent((c) => Math.min(pages.length - 1, c + 1))}
                disabled={current === pages.length - 1}
                aria-label="Next page"
                className="rounded-md border border-[#dacbb3] bg-white p-2 text-[#5f554d] disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8f8170]">
              {page.textBoxes.length ? `${page.textBoxes.length} editable text lines` : 'No text layer yet. Try OCR.'}
            </span>
          </div>

          <div className="max-h-[76vh] overflow-auto rounded-[1.5rem] border border-[#dacbb3] bg-[radial-gradient(circle_at_1px_1px,rgba(70,51,28,0.18)_1px,transparent_0)] bg-[length:18px_18px] p-2 shadow-inner sm:p-4">
            <div className="mx-auto" style={{ width: `${displayWidth}px`, maxWidth: zoom <= 1 ? '100%' : undefined }}>
              <div
                ref={overlayRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                className="relative touch-none select-none overflow-hidden rounded-xl border border-[#dacbb3] bg-white shadow-2xl shadow-[#3b2a16]/10"
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
                      // Invisible by default so the page just looks like the PDF —
                      // a faint tint appears only on hover/focus, to hint that the
                      // line under the cursor is clickable, without making every
                      // detected line look like a permanent form field.
                      className="absolute rounded-[2px] border border-transparent bg-transparent transition-colors hover:border-sky-500/40 hover:bg-sky-400/10 focus-visible:border-sky-500/60 focus-visible:bg-sky-400/15"
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

                    return (
                      <div
                        key={el.id}
                        data-editor-control="true"
                        onPointerDown={(e) => {
                          e.stopPropagation();
                          setSelected({ kind: 'element', id: el.id });
                          setFocusElementId(el.id);
                          setTool('select');
                        }}
                        style={{
                          left: `${el.xPct}%`,
                          top: `${el.yPct}%`,
                          width: `${el.wPct}%`,
                          minHeight: `${textHeight}%`,
                          backgroundColor: el.type === 'replaceText' ? el.backgroundColor : 'transparent',
                          color: el.color,
                          fontSize,
                          fontFamily: el.fontFamily,
                          fontWeight: el.fontWeight,
                          fontStyle: el.fontStyle,
                          outline: selectedThis ? '1px solid #e11d48' : '1px dashed transparent',
                        }}
                        className="absolute cursor-text overflow-hidden whitespace-pre-wrap px-[1px] leading-tight"
                      >
                        <div
                          data-editable-id={el.id}
                          contentEditable={selectedThis}
                          suppressContentEditableWarning
                          onBlur={() => textEditHistory.current.delete(el.id)}
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            if (!selectedThis) {
                              setSelected({ kind: 'element', id: el.id });
                              setFocusElementId(el.id);
                              setTool('select');
                            }
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
                          className="min-h-[1em] w-full outline-none"
                        >
                          {el.text}
                        </div>
                        {selectedThis && (
                          <>
                            <span
                              data-editor-control="true"
                              onPointerDown={(e) => startDrag(e, el)}
                              title="Drag to move"
                              className="absolute left-1 top-1 flex h-4 w-4 cursor-move items-center justify-center rounded-full border border-rose-500 bg-white text-[8px] font-black leading-none text-rose-600 shadow-sm"
                            >
                              +
                            </span>
                            <span
                              data-editor-control="true"
                              onPointerDown={(e) => startResize(e, el)}
                              title="Drag to widen"
                              className={`absolute h-4 w-4 cursor-ew-resize rounded-tl-sm border-l border-t border-rose-500 bg-white ${
                                el.type === 'replaceText' ? 'bottom-0 right-0 cursor-nwse-resize' : 'right-0 top-1/2 -translate-y-1/2'
                              }`}
                            />
                          </>
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
                            el.type === 'whiteout' ? el.color : el.type === 'highlight' ? el.color : 'transparent',
                          opacity: el.type === 'highlight' ? 0.35 : 1,
                          border:
                            el.type === 'rect'
                              ? `2px solid ${el.color}`
                              : selectedThis
                                ? '1px solid #e11d48'
                                : el.type === 'whiteout'
                                  ? '1px solid rgba(15,23,42,0.08)'
                                  : 'none',
                          outline: selectedThis ? '1px solid #e11d48' : 'none',
                        }}
                        className="absolute cursor-move"
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

      {error && <ErrorNote>{error}</ErrorNote>}
      <PrimaryButton onClick={exportPdf} loading={loading}>
        {loading ? <Save className="h-4 w-4" /> : <FileDown className="h-4 w-4" />}
        {loading ? 'Saving...' : 'Save edited PDF'}
      </PrimaryButton>
    </PdfToolShell>
  );
}
