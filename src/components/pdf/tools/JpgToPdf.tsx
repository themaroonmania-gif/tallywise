'use client';

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { ArrowUp, ArrowDown, X, GripVertical, Image as ImageIcon } from 'lucide-react';
import {
  PdfToolShell, Dropzone, PrimaryButton, ResultPanel, ErrorNote, downloadBlob, formatBytes,
} from '../PdfToolShell';

interface QueuedImage { id: string; file: File; }

type PageSize = 'fit' | 'a4' | 'letter';
const A4 = { w: 595.28, h: 841.89 };
const LETTER = { w: 612, h: 792 };

export function JpgToPdf() {
  const [images, setImages] = useState<QueuedImage[]>([]);
  const [size, setSize] = useState<PageSize>('fit');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; size: number } | null>(null);

  const add = (files: File[]) => {
    setError(null); setResult(null);
    const imgs = files.filter((f) => /image\/(jpe?g|png)/.test(f.type) || /\.(jpe?g|png)$/i.test(f.name));
    if (imgs.length !== files.length) setError('Some files were skipped — only JPG and PNG images are supported.');
    setImages((prev) => [...prev, ...imgs.map((file) => ({ id: `${file.name}-${Math.random()}`, file }))]);
  };

  const move = (i: number, d: -1 | 1) => setImages((prev) => {
    const next = [...prev]; const t = i + d;
    if (t < 0 || t >= next.length) return prev;
    [next[i], next[t]] = [next[t], next[i]]; return next;
  });
  const remove = (id: string) => setImages((prev) => prev.filter((x) => x.id !== id));

  const run = async () => {
    setLoading(true); setError(null);
    try {
      const doc = await PDFDocument.create();
      for (const { file } of images) {
        const bytes = await file.arrayBuffer();
        const isPng = file.type === 'image/png' || /\.png$/i.test(file.name);
        const img = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
        if (size === 'fit') {
          const page = doc.addPage([img.width, img.height]);
          page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        } else {
          const dims = size === 'a4' ? A4 : LETTER;
          const page = doc.addPage([dims.w, dims.h]);
          const scale = Math.min(dims.w / img.width, dims.h / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          page.drawImage(img, { x: (dims.w - w) / 2, y: (dims.h - h) / 2, width: w, height: h });
        }
      }
      const out = await doc.save();
      const blob = new Blob([out as BlobPart], { type: 'application/pdf' });
      setResult({ blob, size: blob.size });
    } catch (e) { console.error(e); setError('Could not convert these images. Make sure they are valid JPG or PNG files.'); }
    finally { setLoading(false); }
  };

  const reset = () => { setImages([]); setResult(null); setError(null); };

  if (result) {
    return (
      <PdfToolShell>
        <ResultPanel filename="images.pdf" size={result.size}
          onDownload={() => downloadBlob(result.blob, 'images.pdf')} onReset={reset} />
      </PdfToolShell>
    );
  }

  return (
    <PdfToolShell>
      <Dropzone accept="image/jpeg,image/png" multiple onFiles={add}
        label="Select JPG or PNG images" hint="or drag and drop — add as many as you like" />
      {error && <ErrorNote>{error}</ErrorNote>}

      {images.length > 0 && (
        <>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Page size</label>
            <div className="grid grid-cols-3 gap-2">
              {([['fit', 'Fit to image'], ['a4', 'A4'], ['letter', 'US Letter']] as const).map(([v, l]) => (
                <button key={v} onClick={() => setSize(v)}
                  className={`rounded-xl border p-2.5 text-sm font-bold transition-all ${size === v ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-600'}`}>{l}</button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {images.map((qi, i) => (
              <div key={qi.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <GripVertical className="h-4 w-4 shrink-0 text-slate-300" />
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600"><ImageIcon className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-700">{qi.file.name}</p>
                  <p className="text-xs text-slate-400">{formatBytes(qi.file.size)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-700 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                  <button onClick={() => move(i, 1)} disabled={i === images.length - 1} className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-700 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                  <button onClick={() => remove(qi.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-rose-600"><X className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
          <PrimaryButton onClick={run} loading={loading}>{loading ? 'Building PDF…' : `Create PDF from ${images.length} image${images.length > 1 ? 's' : ''}`}</PrimaryButton>
        </>
      )}
    </PdfToolShell>
  );
}
