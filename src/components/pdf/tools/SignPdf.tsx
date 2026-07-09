'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Loader2, Eraser } from 'lucide-react';
import {
  PdfToolShell, Dropzone, PrimaryButton, ResultPanel, ErrorNote, downloadBlob,
} from '../PdfToolShell';
import { renderPdfPages } from '@/lib/pdfRender';
import { baseName } from '@/lib/pdfUtils';

interface Placed { xPct: number; yPct: number; wPct: number; }

function SignaturePad({ onChange }: { onChange: (dataUrl: string | null) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const dirty = useRef(false);

  useEffect(() => {
    const c = canvasRef.current!;
    const ctx = c.getContext('2d')!;
    ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.strokeStyle = '#0f172a';
    const pos = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (c.width / r.width), y: (e.clientY - r.top) * (c.height / r.height) };
    };
    const down = (e: PointerEvent) => { drawing.current = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
    const move = (e: PointerEvent) => { if (!drawing.current) return; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); dirty.current = true; };
    const up = () => { if (drawing.current && dirty.current) onChange(c.toDataURL('image/png')); drawing.current = false; };
    c.addEventListener('pointerdown', down); c.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { c.removeEventListener('pointerdown', down); c.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, [onChange]);

  const clear = () => {
    const c = canvasRef.current!;
    c.getContext('2d')!.clearRect(0, 0, c.width, c.height);
    dirty.current = false; onChange(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Draw your signature</label>
        <button onClick={clear} className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-rose-600"><Eraser className="h-3.5 w-3.5" /> Clear</button>
      </div>
      <canvas ref={canvasRef} width={600} height={200}
        className="w-full touch-none rounded-xl border-2 border-dashed border-slate-300 bg-white" style={{ aspectRatio: '3 / 1' }} />
    </div>
  );
}

export function SignPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pageDims, setPageDims] = useState<{ w: number; h: number } | null>(null);
  const [sig, setSig] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Placed>({ xPct: 60, yPct: 80, wPct: 30 });
  const [rendering, setRendering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string; size: number } | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const onFiles = async (files: File[]) => {
    setError(null); setResult(null);
    const f = files[0]; if (!f) return;
    setFile(f); setRendering(true);
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
      const first = doc.getPage(0).getSize();
      setPageDims({ w: first.width, h: first.height });
      const [pg] = await renderPdfPages(await f.arrayBuffer(), 1.2);
      const blob = await pg.toBlob('image/jpeg', 0.85);
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (e) { console.error(e); setError('Could not open this PDF.'); setFile(null); }
    finally { setRendering(false); }
  };

  const moveSig = (clientX: number, clientY: number) => {
    const box = previewRef.current?.getBoundingClientRect();
    if (!box) return;
    const xPct = ((clientX - box.left) / box.width) * 100;
    const yPct = ((clientY - box.top) / box.height) * 100;
    setPlaced((p) => ({ ...p, xPct: Math.max(0, Math.min(100, xPct)), yPct: Math.max(0, Math.min(100, yPct)) }));
  };

  const apply = async () => {
    if (!file || !sig || !pageDims) return;
    setLoading(true); setError(null);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const png = await doc.embedPng(sig);
      const page = doc.getPage(0);
      const { width, height } = page.getSize();
      const sigW = (placed.wPct / 100) * width;
      const sigH = (png.height / png.width) * sigW;
      // placed.x/yPct are the CENTER of the signature, measured from top-left of the page.
      const cx = (placed.xPct / 100) * width;
      const cyTop = (placed.yPct / 100) * height;
      const x = cx - sigW / 2;
      const y = height - cyTop - sigH / 2; // convert to PDF bottom-left origin
      page.drawImage(png, { x, y, width: sigW, height: sigH });
      const bytes = await doc.save();
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
      setResult({ blob, name: `${baseName(file.name)}-signed.pdf`, size: blob.size });
    } catch (e) { console.error(e); setError('Something went wrong while signing the PDF.'); }
    finally { setLoading(false); }
  };

  const reset = () => { if (previewUrl) URL.revokeObjectURL(previewUrl); setFile(null); setPreviewUrl(null); setSig(null); setResult(null); setError(null); };

  if (result) {
    return (
      <PdfToolShell>
        <ResultPanel filename={result.name} size={result.size}
          onDownload={() => downloadBlob(result.blob, result.name)} onReset={reset} />
      </PdfToolShell>
    );
  }

  return (
    <PdfToolShell>
      {!file ? (
        <Dropzone accept="application/pdf" onFiles={onFiles} label="Select a PDF to sign" />
      ) : rendering ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-500">
          <Loader2 className="h-7 w-7 animate-spin text-rose-500" />
          <p className="text-sm font-medium">Opening document…</p>
        </div>
      ) : (
        <>
          <SignaturePad onChange={setSig} />

          {sig && previewUrl && (
            <>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Drag the signature onto page 1 · size {placed.wPct}%
                </label>
                <div ref={previewRef} className="relative mx-auto max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white select-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Page 1 preview" className="w-full" draggable={false} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sig}
                    alt="Signature"
                    draggable={false}
                    onPointerDown={(e) => { dragging.current = true; (e.target as HTMLElement).setPointerCapture(e.pointerId); }}
                    onPointerMove={(e) => { if (dragging.current) moveSig(e.clientX, e.clientY); }}
                    onPointerUp={() => { dragging.current = false; }}
                    style={{ left: `${placed.xPct}%`, top: `${placed.yPct}%`, width: `${placed.wPct}%`, transform: 'translate(-50%, -50%)' }}
                    className="absolute cursor-move rounded"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Signature size</label>
                <input type="range" min={10} max={60} value={placed.wPct}
                  onChange={(e) => setPlaced((p) => ({ ...p, wPct: Number(e.target.value) }))}
                  className="w-full accent-rose-600" />
              </div>
            </>
          )}

          {error && <ErrorNote>{error}</ErrorNote>}
          <div className="flex items-center justify-between">
            <button onClick={reset} className="text-xs font-bold text-rose-600 hover:underline">Change file</button>
          </div>
          <PrimaryButton onClick={apply} loading={loading} disabled={!sig}>
            {loading ? 'Signing…' : sig ? 'Place signature & download' : 'Draw a signature first'}
          </PrimaryButton>
        </>
      )}
      {!file && error && <ErrorNote>{error}</ErrorNote>}
    </PdfToolShell>
  );
}
