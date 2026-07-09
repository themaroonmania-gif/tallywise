'use client';

import React, { useRef, useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import {
  MousePointer2, Type, Highlighter, Square, Pen, Trash2, ChevronLeft, ChevronRight, Loader2,
} from 'lucide-react';
import {
  PdfToolShell, Dropzone, PrimaryButton, ResultPanel, ErrorNote, downloadBlob,
} from '../PdfToolShell';
import { renderPdfPages } from '@/lib/pdfRender';
import { baseName } from '@/lib/pdfUtils';

type Tool = 'select' | 'text' | 'highlight' | 'rect' | 'pen';

interface Pt { xPct: number; yPct: number; }
type El =
  | { id: string; page: number; type: 'text'; xPct: number; yPct: number; text: string; sizePct: number; color: string }
  | { id: string; page: number; type: 'highlight' | 'rect'; xPct: number; yPct: number; wPct: number; hPct: number; color: string }
  | { id: string; page: number; type: 'pen'; points: Pt[]; color: string };

interface RenderedPageInfo { url: string; w: number; h: number; }

const COLORS = ['#e11d48', '#0f172a', '#2563eb', '#16a34a', '#eab308'];
const uid = () => Math.random().toString(36).slice(2);

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

export function EditPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<RenderedPageInfo[]>([]);
  const [current, setCurrent] = useState(0);
  const [tool, setTool] = useState<Tool>('select');
  const [color, setColor] = useState(COLORS[0]);
  const [els, setEls] = useState<El[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string; size: number } | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);
  const drafting = useRef<{ id: string; startX: number; startY: number } | null>(null);
  const dragging = useRef<{ id: string; offX: number; offY: number } | null>(null);

  const onFiles = async (files: File[]) => {
    setError(null); setResult(null);
    const f = files[0]; if (!f) return;
    setFile(f); setRendering(true);
    try {
      const rendered = await renderPdfPages(await f.arrayBuffer(), 1.4);
      const infos: RenderedPageInfo[] = [];
      for (const p of rendered) {
        const blob = await p.toBlob('image/jpeg', 0.85);
        infos.push({ url: URL.createObjectURL(blob), w: p.width, h: p.height });
      }
      setPages(infos);
    } catch (e) { console.error(e); setError('Could not open this PDF. It may be corrupted or password-protected.'); setFile(null); }
    finally { setRendering(false); }
  };

  const pct = (clientX: number, clientY: number) => {
    const box = overlayRef.current!.getBoundingClientRect();
    return { xPct: ((clientX - box.left) / box.width) * 100, yPct: ((clientY - box.top) / box.height) * 100 };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.target !== overlayRef.current && (e.target as HTMLElement).dataset.el === undefined) {
      // clicked on an element handled elsewhere
    }
    const { xPct, yPct } = pct(e.clientX, e.clientY);
    if (tool === 'text') {
      const id = uid();
      setEls((p) => [...p, { id, page: current, type: 'text', xPct, yPct, text: 'Text', sizePct: 3.5, color }]);
      setSelected(id); setTool('select');
      return;
    }
    if (tool === 'highlight' || tool === 'rect') {
      const id = uid();
      drafting.current = { id, startX: xPct, startY: yPct };
      setEls((p) => [...p, { id, page: current, type: tool, xPct, yPct, wPct: 0, hPct: 0, color }]);
      overlayRef.current!.setPointerCapture(e.pointerId);
      return;
    }
    if (tool === 'pen') {
      const id = uid();
      drafting.current = { id, startX: xPct, startY: yPct };
      setEls((p) => [...p, { id, page: current, type: 'pen', points: [{ xPct, yPct }], color }]);
      overlayRef.current!.setPointerCapture(e.pointerId);
      return;
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const { xPct, yPct } = pct(e.clientX, e.clientY);
    if (drafting.current) {
      const d = drafting.current;
      setEls((prev) => prev.map((el) => {
        if (el.id !== d.id) return el;
        if (el.type === 'pen') return { ...el, points: [...el.points, { xPct, yPct }] };
        if (el.type === 'highlight' || el.type === 'rect') {
          return { ...el, xPct: Math.min(d.startX, xPct), yPct: Math.min(d.startY, yPct), wPct: Math.abs(xPct - d.startX), hPct: Math.abs(yPct - d.startY) };
        }
        return el;
      }));
      return;
    }
    if (dragging.current) {
      const dr = dragging.current;
      setEls((prev) => prev.map((el) => el.id === dr.id && 'xPct' in el ? { ...el, xPct: xPct - dr.offX, yPct: yPct - dr.offY } : el));
    }
  };

  const onPointerUp = () => { drafting.current = null; dragging.current = null; };

  const startDrag = (e: React.PointerEvent, el: El) => {
    if (tool !== 'select' || el.type === 'pen') return;
    e.stopPropagation();
    setSelected(el.id);
    const { xPct, yPct } = pct(e.clientX, e.clientY);
    dragging.current = { id: el.id, offX: xPct - (el as { xPct: number }).xPct, offY: yPct - (el as { yPct: number }).yPct };
  };

  const deleteSelected = () => { if (selected) { setEls((p) => p.filter((e) => e.id !== selected)); setSelected(null); } };

  const exportPdf = async () => {
    if (!file) return;
    setLoading(true); setError(null);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const docPages = doc.getPages();
      for (const el of els) {
        const page = docPages[el.page];
        if (!page) continue;
        const { width: W, height: H } = page.getSize();
        if (el.type === 'text') {
          const size = (el.sizePct / 100) * H;
          page.drawText(el.text, {
            x: (el.xPct / 100) * W,
            y: H - (el.yPct / 100) * H - size,
            size, font, color: hexToRgb(el.color),
          });
        } else if (el.type === 'highlight' || el.type === 'rect') {
          const x = (el.xPct / 100) * W;
          const w = (el.wPct / 100) * W;
          const h = (el.hPct / 100) * H;
          const y = H - (el.yPct / 100) * H - h;
          if (el.type === 'highlight') {
            page.drawRectangle({ x, y, width: w, height: h, color: hexToRgb(el.color), opacity: 0.35 });
          } else {
            page.drawRectangle({ x, y, width: w, height: h, borderColor: hexToRgb(el.color), borderWidth: 1.5 });
          }
        } else if (el.type === 'pen') {
          for (let i = 1; i < el.points.length; i++) {
            const a = el.points[i - 1], b = el.points[i];
            page.drawLine({
              start: { x: (a.xPct / 100) * W, y: H - (a.yPct / 100) * H },
              end: { x: (b.xPct / 100) * W, y: H - (b.yPct / 100) * H },
              thickness: 2, color: hexToRgb(el.color),
            });
          }
        }
      }
      const bytes = await doc.save();
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
      setResult({ blob, name: `${baseName(file.name)}-edited.pdf`, size: blob.size });
    } catch (e) { console.error(e); setError('Something went wrong while saving your edits.'); }
    finally { setLoading(false); }
  };

  const reset = () => { pages.forEach((p) => URL.revokeObjectURL(p.url)); setFile(null); setPages([]); setEls([]); setSelected(null); setResult(null); setError(null); setCurrent(0); };

  if (result) {
    return (
      <PdfToolShell>
        <ResultPanel filename={result.name} size={result.size}
          onDownload={() => downloadBlob(result.blob, result.name)} onReset={reset} />
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

  if (rendering) {
    return (
      <PdfToolShell>
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-500">
          <Loader2 className="h-7 w-7 animate-spin text-rose-500" />
          <p className="text-sm font-medium">Opening document…</p>
        </div>
      </PdfToolShell>
    );
  }

  const page = pages[current];
  const tools: [Tool, React.ReactNode, string][] = [
    ['select', <MousePointer2 key="s" className="h-4 w-4" />, 'Move'],
    ['text', <Type key="t" className="h-4 w-4" />, 'Text'],
    ['highlight', <Highlighter key="h" className="h-4 w-4" />, 'Highlight'],
    ['rect', <Square key="r" className="h-4 w-4" />, 'Box'],
    ['pen', <Pen key="p" className="h-4 w-4" />, 'Draw'],
  ];

  return (
    <PdfToolShell>
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2">
        {tools.map(([t, icon, label]) => (
          <button key={t} onClick={() => setTool(t)} title={label}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all ${tool === t ? 'bg-rose-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-300'}`}>
            {icon}<span className="hidden sm:inline">{label}</span>
          </button>
        ))}
        <div className="mx-1 flex items-center gap-1">
          {COLORS.map((c) => (
            <button key={c} onClick={() => setColor(c)} aria-label={`Color ${c}`}
              className={`h-6 w-6 rounded-full border-2 transition-transform ${color === c ? 'border-slate-800 scale-110' : 'border-white'}`}
              style={{ backgroundColor: c }} />
          ))}
        </div>
        {selected && (
          <button onClick={deleteSelected} className="inline-flex items-center gap-1 rounded-lg bg-white border border-slate-200 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        )}
      </div>

      <div
        ref={overlayRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="relative mx-auto max-w-2xl touch-none select-none overflow-hidden rounded-xl border border-slate-200 bg-white"
        style={{ cursor: tool === 'select' ? 'default' : 'crosshair' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={page.url} alt={`Page ${current + 1}`} className="pointer-events-none w-full" draggable={false} />

        {els.filter((e) => e.page === current).map((el) => {
          if (el.type === 'text') {
            return (
              <div key={el.id} data-el="1"
                onPointerDown={(e) => startDrag(e, el)}
                onDoubleClick={() => setSelected(el.id)}
                contentEditable={selected === el.id}
                suppressContentEditableWarning
                onBlur={(e) => { const text = e.currentTarget.textContent || ''; setEls((p) => p.map((x) => x.id === el.id && x.type === 'text' ? { ...x, text } : x)); }}
                style={{ left: `${el.xPct}%`, top: `${el.yPct}%`, color: el.color, fontSize: `${el.sizePct}vw`, outline: selected === el.id ? '1px dashed #e11d48' : 'none' }}
                className="absolute cursor-move whitespace-nowrap font-semibold leading-none">
                {el.text}
              </div>
            );
          }
          if (el.type === 'highlight' || el.type === 'rect') {
            return (
              <div key={el.id} data-el="1"
                onPointerDown={(e) => startDrag(e, el)}
                style={{
                  left: `${el.xPct}%`, top: `${el.yPct}%`, width: `${el.wPct}%`, height: `${el.hPct}%`,
                  backgroundColor: el.type === 'highlight' ? el.color : 'transparent',
                  opacity: el.type === 'highlight' ? 0.35 : 1,
                  border: el.type === 'rect' ? `2px solid ${el.color}` : 'none',
                  outline: selected === el.id ? '1px dashed #0f172a' : 'none',
                }}
                className="absolute cursor-move" />
            );
          }
          if (el.type === 'pen') {
            return (
              <svg key={el.id} className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline points={el.points.map((p) => `${p.xPct},${p.yPct}`).join(' ')}
                  fill="none" stroke={el.color} strokeWidth={0.4} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
            );
          }
          return null;
        })}
      </div>

      <div className="flex items-center justify-center gap-4">
        <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
        <span className="text-xs font-bold text-slate-500">Page {current + 1} of {pages.length}</span>
        <button onClick={() => setCurrent((c) => Math.min(pages.length - 1, c + 1))} disabled={current === pages.length - 1}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
      </div>

      <p className="text-center text-xs text-slate-400">
        Tip: pick a tool, then click or drag on the page. Use Move to reposition text and boxes. Double-click text to edit it.
      </p>

      {error && <ErrorNote>{error}</ErrorNote>}
      <div className="flex items-center justify-between">
        <button onClick={reset} className="text-xs font-bold text-rose-600 hover:underline">Change file</button>
      </div>
      <PrimaryButton onClick={exportPdf} loading={loading}>{loading ? 'Saving…' : 'Save edited PDF'}</PrimaryButton>
    </PdfToolShell>
  );
}
