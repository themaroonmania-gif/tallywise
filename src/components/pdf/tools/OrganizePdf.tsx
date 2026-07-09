'use client';

import React, { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { Trash2, RotateCw, Loader2 } from 'lucide-react';
import {
  PdfToolShell, Dropzone, PrimaryButton, ResultPanel, ErrorNote, downloadBlob,
} from '../PdfToolShell';
import { renderPdfPages } from '@/lib/pdfRender';
import { baseName } from '@/lib/pdfUtils';

interface PageThumb {
  originalIndex: number;
  url: string;
  rotation: number; // 0/90/180/270 added on top of original
}

export function OrganizePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbs, setThumbs] = useState<PageThumb[]>([]);
  const [rendering, setRendering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string; size: number } | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const onFiles = async (files: File[]) => {
    setError(null); setResult(null);
    const f = files[0]; if (!f) return;
    setFile(f); setRendering(true);
    try {
      const pages = await renderPdfPages(await f.arrayBuffer(), 0.5);
      const list: PageThumb[] = [];
      for (const p of pages) {
        const blob = await p.toBlob('image/jpeg', 0.7);
        list.push({ originalIndex: p.index, url: URL.createObjectURL(blob), rotation: 0 });
      }
      setThumbs(list);
    } catch (e) { console.error(e); setError('Could not open this PDF. It may be corrupted or password-protected.'); setFile(null); }
    finally { setRendering(false); }
  };

  const removeAt = (i: number) => setThumbs((prev) => prev.filter((_, idx) => idx !== i));
  const rotateAt = (i: number) => setThumbs((prev) => prev.map((t, idx) => idx === i ? { ...t, rotation: (t.rotation + 90) % 360 } : t));

  const onDrop = (target: number) => {
    if (dragIndex === null || dragIndex === target) return;
    setThumbs((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(target, 0, moved);
      return next;
    });
    setDragIndex(null);
  };

  const apply = async () => {
    if (!file) return;
    if (!thumbs.length) { setError('You must keep at least one page.'); return; }
    setLoading(true); setError(null);
    try {
      const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, thumbs.map((t) => t.originalIndex));
      copied.forEach((page, i) => {
        const extra = thumbs[i].rotation;
        if (extra) {
          const cur = page.getRotation().angle;
          page.setRotation(degrees((cur + extra) % 360));
        }
        out.addPage(page);
      });
      const bytes = await out.save();
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
      setResult({ blob, name: `${baseName(file.name)}-organized.pdf`, size: blob.size });
    } catch (e) { console.error(e); setError('Something went wrong while rebuilding the PDF.'); }
    finally { setLoading(false); }
  };

  const reset = () => { thumbs.forEach((t) => URL.revokeObjectURL(t.url)); setFile(null); setThumbs([]); setResult(null); setError(null); };

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
        <Dropzone accept="application/pdf" onFiles={onFiles} label="Select a PDF to organize" />
      ) : rendering ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-500">
          <Loader2 className="h-7 w-7 animate-spin text-rose-500" />
          <p className="text-sm font-medium">Loading page thumbnails…</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {thumbs.length} page{thumbs.length !== 1 ? 's' : ''} · drag to reorder
            </p>
            <button onClick={reset} className="text-xs font-bold text-rose-600 hover:underline">Change file</button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {thumbs.map((t, i) => (
              <div
                key={`${t.originalIndex}-${i}`}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(i)}
                className="group relative cursor-move rounded-xl border border-slate-200 bg-slate-50 p-2 transition-all hover:border-rose-400"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.url} alt={`Page ${t.originalIndex + 1}`}
                  style={{ transform: `rotate(${t.rotation}deg)` }}
                  className="mx-auto h-32 w-auto rounded shadow-sm transition-transform" />
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">#{i + 1}</span>
                  <div className="flex gap-1">
                    <button onClick={() => rotateAt(i)} className="rounded p-1 text-slate-400 hover:bg-white hover:text-slate-700" aria-label="Rotate"><RotateCw className="h-3.5 w-3.5" /></button>
                    <button onClick={() => removeAt(i)} className="rounded p-1 text-slate-400 hover:bg-white hover:text-rose-600" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {error && <ErrorNote>{error}</ErrorNote>}
          <PrimaryButton onClick={apply} loading={loading}>{loading ? 'Saving…' : 'Save organized PDF'}</PrimaryButton>
        </>
      )}
      {!file && error && <ErrorNote>{error}</ErrorNote>}
    </PdfToolShell>
  );
}
