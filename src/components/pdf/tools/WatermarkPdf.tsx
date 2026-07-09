'use client';

import React, { useState } from 'react';
import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib';
import {
  PdfToolShell, Dropzone, PrimaryButton, ResultPanel, ErrorNote, downloadBlob, formatBytes,
} from '../PdfToolShell';
import { baseName } from '@/lib/pdfUtils';

export function WatermarkPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.25);
  const [fontSize, setFontSize] = useState(50);
  const [diagonal, setDiagonal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string; size: number } | null>(null);

  const onFiles = (files: File[]) => { setError(null); setResult(null); const f = files[0]; if (f) setFile(f); };

  const run = async () => {
    if (!file) return;
    if (!text.trim()) { setError('Enter some watermark text.'); return; }
    setLoading(true); setError(null);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      for (const page of doc.getPages()) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        page.drawText(text, {
          x: width / 2 - (diagonal ? textWidth / 2 * Math.cos(Math.PI / 4) : textWidth / 2),
          y: height / 2 - (diagonal ? textWidth / 2 * Math.sin(Math.PI / 4) : fontSize / 2),
          size: fontSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity,
          rotate: diagonal ? degrees(45) : degrees(0),
        });
      }
      const bytes = await doc.save();
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
      setResult({ blob, name: `${baseName(file.name)}-watermarked.pdf`, size: blob.size });
    } catch (e) { console.error(e); setError('Could not add a watermark to this PDF.'); }
    finally { setLoading(false); }
  };

  const reset = () => { setFile(null); setResult(null); setError(null); };

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
        <Dropzone accept="application/pdf" onFiles={onFiles} label="Select a PDF to watermark" />
      ) : (
        <>
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-700">{file.name}</p>
              <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
            </div>
            <button onClick={reset} className="text-xs font-bold text-rose-600 hover:underline">Change</button>
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Watermark text</label>
            <input value={text} onChange={(e) => setText(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-800 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Opacity: {Math.round(opacity * 100)}%</label>
              <input type="range" min={5} max={100} value={opacity * 100} onChange={(e) => setOpacity(Number(e.target.value) / 100)} className="w-full accent-rose-600" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Size: {fontSize}pt</label>
              <input type="range" min={12} max={120} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-rose-600" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setDiagonal(true)} className={`rounded-xl border p-2.5 text-sm font-bold transition-all ${diagonal ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-600'}`}>Diagonal</button>
            <button onClick={() => setDiagonal(false)} className={`rounded-xl border p-2.5 text-sm font-bold transition-all ${!diagonal ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-600'}`}>Horizontal</button>
          </div>
          {error && <ErrorNote>{error}</ErrorNote>}
          <PrimaryButton onClick={run} loading={loading}>{loading ? 'Applying…' : 'Add watermark'}</PrimaryButton>
        </>
      )}
    </PdfToolShell>
  );
}
