'use client';

import React, { useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import {
  PdfToolShell, Dropzone, PrimaryButton, ResultPanel, ErrorNote, downloadBlob, formatBytes,
} from '../PdfToolShell';
import { baseName } from '@/lib/pdfUtils';

type Pos = 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left';
type Fmt = 'n' | 'n-of-t' | 'page-n';

export function PageNumbers() {
  const [file, setFile] = useState<File | null>(null);
  const [pos, setPos] = useState<Pos>('bottom-center');
  const [fmt, setFmt] = useState<Fmt>('n');
  const [start, setStart] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string; size: number } | null>(null);

  const onFiles = (files: File[]) => { setError(null); setResult(null); const f = files[0]; if (f) setFile(f); };

  const label = (n: number, total: number) =>
    fmt === 'n' ? `${n}` : fmt === 'page-n' ? `Page ${n}` : `${n} of ${total}`;

  const run = async () => {
    if (!file) return;
    setLoading(true); setError(null);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      const size = 11;
      const margin = 28;
      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const num = start + i;
        const txt = label(num, start + pages.length - 1);
        const w = font.widthOfTextAtSize(txt, size);
        const isTop = pos.startsWith('top');
        const y = isTop ? height - margin : margin - size / 2 + 4;
        let x = width / 2 - w / 2;
        if (pos.endsWith('right')) x = width - margin - w;
        else if (pos.endsWith('left')) x = margin;
        page.drawText(txt, { x, y, size, font, color: rgb(0.3, 0.3, 0.3) });
      });
      const bytes = await doc.save();
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
      setResult({ blob, name: `${baseName(file.name)}-numbered.pdf`, size: blob.size });
    } catch (e) { console.error(e); setError('Could not add page numbers to this PDF.'); }
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

  const positions: [Pos, string][] = [
    ['top-left', '↖'], ['top-center', '↑'], ['top-right', '↗'],
    ['bottom-left', '↙'], ['bottom-center', '↓'], ['bottom-right', '↘'],
  ];

  return (
    <PdfToolShell>
      {!file ? (
        <Dropzone accept="application/pdf" onFiles={onFiles} label="Select a PDF" />
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
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Position</label>
            <div className="grid grid-cols-3 gap-2">
              {positions.map(([p, arrow]) => (
                <button key={p} onClick={() => setPos(p)}
                  className={`rounded-xl border p-2.5 text-lg font-bold transition-all ${pos === p ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-500'}`}>{arrow}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Format</label>
              <select value={fmt} onChange={(e) => setFmt(e.target.value as Fmt)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 font-semibold text-slate-800 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20">
                <option value="n">1, 2, 3</option>
                <option value="n-of-t">1 of N</option>
                <option value="page-n">Page 1</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Start at</label>
              <input type="number" min={0} value={start} onChange={(e) => setStart(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 font-semibold text-slate-800 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
            </div>
          </div>
          {error && <ErrorNote>{error}</ErrorNote>}
          <PrimaryButton onClick={run} loading={loading}>{loading ? 'Numbering…' : 'Add page numbers'}</PrimaryButton>
        </>
      )}
    </PdfToolShell>
  );
}
