'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  Pen,
  Plus,
  Save,
  Square,
  TextCursorInput,
  Trash2,
  Type,
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
  const [selected, setSelected] = useState<Selected>(null);
  const [rendering, setRendering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string; size: number } | null>(null);
  const [overlaySize, setOverlaySize] = useState({ width: 0, height: 0 });
  const [focusElementId, setFocusElementId] = useState<string | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const drafting = useRef<{ id: string; startX: number; startY: number } | null>(null);
  const dragging = useRef<{ id: string; offX: number; offY: number } | null>(null);
  const resizing = useRef<{ id: string; startX: number; startY: number; startW: number; startH: number } | null>(null);

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

  const onFiles = async (files: File[]) => {
    setError(null);
    setResult(null);
    const f = files[0];
    if (!f) return;

    setFile(f);
    setRendering(true);
    setCurrent(0);
    setEls([]);
    setSelected(null);

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

  const createText = (xPct: number, yPct: number) => {
    const id = uid();
    setEls((prev) => [
      ...prev,
      {
        id,
        page: current,
        type: 'text',
        xPct,
        yPct,
        wPct: 28,
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
    setEls((prev) => [
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

    if (tool === 'text') {
      createText(xPct, yPct);
      return;
    }

    if (tool === 'whiteout' || tool === 'highlight' || tool === 'rect') {
      const id = uid();
      drafting.current = { id, startX: xPct, startY: yPct };
      setEls((prev) => [...prev, { id, page: current, type: tool, xPct, yPct, wPct: 0, hPct: 0, color }]);
      setSelected({ kind: 'element', id });
      overlayRef.current?.setPointerCapture(e.pointerId);
      return;
    }

    if (tool === 'pen') {
      const id = uid();
      drafting.current = { id, startX: xPct, startY: yPct };
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
          if (el.id !== rz.id || !elementHasBox(el) || el.type === 'text') return el;
          return {
            ...el,
            wPct: clamp(rz.startW + xPct - rz.startX, 1, 100 - el.xPct),
            hPct: clamp(rz.startH + yPct - rz.startY, 1, 100 - el.yPct),
          };
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
    drafting.current = null;
    dragging.current = null;
    resizing.current = null;
  };

  const startDrag = (e: React.PointerEvent, el: El) => {
    if (tool !== 'select' || el.type === 'pen' || !elementHasBox(el)) return;
    e.stopPropagation();
    setSelected({ kind: 'element', id: el.id });
    const { xPct, yPct } = pct(e.clientX, e.clientY);
    dragging.current = { id: el.id, offX: xPct - el.xPct, offY: yPct - el.yPct };
    overlayRef.current?.setPointerCapture(e.pointerId);
  };

  const startResize = (e: React.PointerEvent, el: El) => {
    if (el.type === 'pen' || el.type === 'text' || !elementHasBox(el)) return;
    e.stopPropagation();
    setSelected({ kind: 'element', id: el.id });
    const { xPct, yPct } = pct(e.clientX, e.clientY);
    resizing.current = { id: el.id, startX: xPct, startY: yPct, startW: el.wPct, startH: 'hPct' in el ? el.hPct : 1 };
    overlayRef.current?.setPointerCapture(e.pointerId);
  };

  const deleteSelected = () => {
    if (!selectedElement) return;
    if (selectedElement.type === 'replaceText') {
      updateEl(selectedElement.id, (el) => (el.type === 'replaceText' ? { ...el, text: '' } : el));
      return;
    }
    setEls((prev) => prev.filter((el) => el.id !== selectedElement.id));
    setSelected(null);
  };

  const changeFontSize = (delta: number) => {
    if (!selectedElement || (selectedElement.type !== 'text' && selectedElement.type !== 'replaceText')) return;
    updateEl(selectedElement.id, (el) =>
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
      setEls((prev) => [
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
    setSelected(null);
    setResult(null);
    setError(null);
    setCurrent(0);
    setTool('editText');
  };

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

      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
        {tools.map(([t, icon, label]) => (
          <button
            key={t}
            type="button"
            onClick={() => setTool(t)}
            title={label}
            aria-label={label}
            className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm transition-all ${
              tool === t
                ? 'border-rose-600 bg-rose-600 text-white'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-rose-300 hover:text-rose-600'
            }`}
          >
            {icon}
          </button>
        ))}
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          title="Add image"
          aria-label="Add image"
          className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm transition-all ${
            tool === 'image'
              ? 'border-rose-600 bg-rose-600 text-white'
              : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-rose-300 hover:text-rose-600'
          }`}
        >
          <ImagePlus className="h-4 w-4" />
        </button>

        <div className="mx-1 h-7 w-px bg-slate-200" />

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
              onClick={() => changeFontSize(-0.25)}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-600 hover:border-rose-300"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Larger text"
              onClick={() => changeFontSize(0.25)}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-600 hover:border-rose-300"
            >
              <Plus className="h-4 w-4" />
            </button>
          </>
        )}

        {selectedElement && (
          <button
            type="button"
            onClick={deleteSelected}
            title="Delete"
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-rose-600 hover:border-rose-300"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div
        ref={overlayRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative mx-auto max-w-3xl touch-none select-none overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
        style={{ cursor: tool === 'select' ? 'default' : tool === 'editText' ? 'text' : 'crosshair' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
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
            const textHeight = el.type === 'replaceText' ? el.hPct : Math.max(3, (fontSize / Math.max(1, overlaySize.height)) * 100 * 1.25);

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
                  onPointerDown={(e) => {
                    if (selectedThis) e.stopPropagation();
                  }}
                  onInput={(e) => {
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
                {selectedThis && el.type === 'replaceText' && (
                  <span
                    data-editor-control="true"
                    onPointerDown={(e) => startResize(e, el)}
                    className="absolute bottom-0 right-0 h-3 w-3 cursor-nwse-resize rounded-tl-sm border-l border-t border-rose-500 bg-white"
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
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={el.dataUrl} alt="" className="h-full w-full object-fill" draggable={false} />
                )}
                {selectedThis && (
                  <span
                    data-editor-control="true"
                    onPointerDown={(e) => startResize(e, el)}
                    className="absolute bottom-0 right-0 h-3 w-3 cursor-nwse-resize rounded-tl-sm border-l border-t border-rose-500 bg-white"
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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={reset} className="text-xs font-bold text-rose-600 hover:underline">
          Change file
        </button>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="rounded-md border border-slate-200 p-2 text-slate-600 disabled:opacity-30"
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
            className="rounded-md border border-slate-200 p-2 text-slate-600 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {page.textBoxes.length ? `${page.textBoxes.length} text lines detected` : 'No text layer detected'}
        </span>
      </div>

      {error && <ErrorNote>{error}</ErrorNote>}
      <PrimaryButton onClick={exportPdf} loading={loading}>
        <Save className="h-4 w-4" />
        {loading ? 'Saving...' : 'Save edited PDF'}
      </PrimaryButton>
    </PdfToolShell>
  );
}
