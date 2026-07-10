'use client';

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useEffectEvent, useRef, useState } from 'react';
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import {
  ChevronLeft,
  ChevronRight,
  Eraser,
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
const uid = () => Math.random().toString(36).slice(2);
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
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
    const page = await doc.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const content = await page.getTextContent();
    const rawRuns: RawTextRun[] = [];

    for (const item of content.items) {
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
    id: string; type: El['type']; offX: number; offY: number;
    startClientX: number; startClientY: number; moved: boolean;
  } | null>(null);
  const resizing = useRef<{ id: string; startX: number; startY: number; startW: number; startH: number } | null>(null);
  const textEditHistory = useRef<Set<string>>(new Set());

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

    try {
      const data = await f.arrayBuffer();
      const [rendered, textBoxes] = await Promise.all([
        renderPdfPages(data.slice(0), PREVIEW_SCALE),
        extractTextBoxes(data.slice(0), PREVIEW_SCALE),
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
      setError('Could not open this PDF. It may be corrupted or password-protected.');
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
      },
    ]);
    setSelected({ kind: 'element', id });
    setFocusElementId(id);
    setTool('select');
  };

  const editSourceText = (box: PdfTextBox) => {
    const existing = els.find((el) => el.type === 'replaceText' && el.sourceId === box.id);
    if (existing) {
      setSelected({ kind: 'element', id: existing.id });
      setFocusElementId(existing.id);
      setTool('select');
      return;
    }

    const id = uid();
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
        color: '#111827',
      },
    ]);
    setSelected({ kind: 'element', id });
    setFocusElementId(id);
    setTool('select');
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-editor-control="true"]')) return;
    const { xPct, yPct } = pct(e.clientX, e.clientY);

    if (tool === 'text' || tool === 'select' || tool === 'editText') {
      // Tapping any blank spot on the page (not just with the Add text tool
      // selected) drops a text box right there and starts typing immediately
      // — the page itself is the canvas, not a fixed set of text boxes.
      createText(xPct, yPct);
      return;
    }

    if (tool === 'whiteout' || tool === 'highlight' || tool === 'rect') {
      const id = uid();
      drafting.current = { id, startX: xPct, startY: yPct };
      pushHistorySnapshot();
      setEls((prev) => [...prev, { id, page: current, type: tool, xPct, yPct, wPct: 0, hPct: 0, color }]);
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
    if (tool !== 'select' || el.type === 'pen' || !elementHasBox(el)) return;
    e.stopPropagation();
    setSelected({ kind: 'element', id: el.id });
    const { xPct, yPct } = pct(e.clientX, e.clientY);
    // History is only recorded once the pointer actually moves (see
    // onPointerMove), so a plain click-to-select doesn't pollute undo.
    dragging.current = {
      id: el.id, type: el.type, offX: xPct - el.xPct, offY: yPct - el.yPct,
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

  const runOcrOnCurrentPage = async () => {
    if (!page || ocrStatus) return;

    setError(null);
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
        setError('OCR did not find readable text on this page. Try a sharper scan, or use Erase + Text manually.');
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
      setTool('editText');
    } catch (e) {
      console.error(e);
      setError('OCR could not read this page. Try a clearer scan, or use Erase + Text manually.');
    } finally {
      await worker?.terminate().catch(() => undefined);
      setOcrStatus(null);
    }
  };

  const exportPdf = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.Helvetica);
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
            color: rgb(1, 1, 1),
          });

          if (el.type === 'replaceText') {
            const size = (el.fontSizePct / 100) * H;
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
          </div>

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
              onClick={runOcrOnCurrentPage}
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
              onClick={() => setColor(c)}
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
              <button
                key={p.url}
                type="button"
                onClick={() => {
                  setCurrent(index);
                  setSelected(null);
                }}
                className={`min-w-20 rounded-xl border bg-white p-1 text-left transition-all lg:min-w-0 ${
                  index === current
                    ? 'border-rose-500 shadow-sm shadow-rose-500/20'
                    : 'border-slate-200 hover:border-rose-200'
                }`}
                aria-label={`Go to page ${index + 1}`}
              >
                <img src={p.url} alt={`Page ${index + 1} thumbnail`} className="h-24 w-full rounded-lg object-cover lg:h-auto" />
                <span className="mt-1 block text-center text-[10px] font-black text-slate-500">Page {index + 1}</span>
              </button>
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
                      className="absolute rounded-[2px] border border-sky-500/35 bg-sky-400/10 opacity-60 transition-opacity hover:opacity-100 focus:opacity-100"
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
                        onPointerDown={(e) => startDrag(e, el)}
                        style={{
                          left: `${el.xPct}%`,
                          top: `${el.yPct}%`,
                          width: `${el.wPct}%`,
                          minHeight: `${textHeight}%`,
                          backgroundColor: el.type === 'replaceText' ? '#ffffff' : 'transparent',
                          color: el.color,
                          fontSize,
                          outline: selectedThis ? '1px solid #e11d48' : '1px dashed transparent',
                        }}
                        className="absolute cursor-move overflow-hidden whitespace-pre-wrap px-[1px] font-semibold leading-tight"
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
        <Save className="h-4 w-4" />
        {loading ? 'Saving...' : 'Save edited PDF'}
      </PrimaryButton>
    </PdfToolShell>
  );
}
