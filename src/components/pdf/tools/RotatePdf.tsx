'use client';

import React, { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { RotateCw } from 'lucide-react';
import {
  PdfToolShell, Dropzone, PrimaryButton, ResultPanel, ErrorNote, downloadBlob, formatBytes,
} from '../PdfToolShell';
import { parsePageRanges, baseName } from '@/lib/pdfUtils';

export function RotatePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  const [applyAll, setApplyAll] = useState(true);
  const [range, setRange] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string; size: number } | null>(null);

  const onFiles = async (files: File[]) => {
    setError(null); setResult(null);
    const f = files[0]; if (!f) return;
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
      setFile(f); setPageCount(doc.getPageCount());
    } catch { setError('Could not read this PDF. It may be corrupted or password-protected.'); }
  };

  const run = async () => {
    if (!file) return;
    setLoading(true); setError(null);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const pages = doc.getPages();
      const targets = applyAll
        ? pages.map((_, i) => i)
        : parsePageRanges(range, pageCount);
      if (!applyAll && !targets.length) {
        setError('Enter valid pages to rotate, e.g. "1-3, 5".'); setLoading(false); return;
      }
      for (const i of targets) {
        const current = pages[i].getRotation().angle;
        pages[i].setRotation(degrees((current + angle) % 360));
      }
      const bytes = await doc.save();
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
      setResult({ blob, name: `${baseName(file.name)}-rotated.pdf`, size: blob.size });
    } catch (e) { console.error(e); setError('Something went wrong while rotating this PDF.'); }
    finally { setLoading(false); }
  };

  const reset = () => { setFile(null); setPageCount(0); setRange(''); setResult(null); setError(null); };

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
        <Dropzone accept="application/pdf" onFiles={onFiles} label="Select a PDF to rotate" />
      ) : (
        <>
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-700">{file.name}</p>
              <p className="text-xs text-slate-400">{pageCount} pages · {formatBytes(file.size)}</p>
            </div>
            <button onClick={reset} className="text-xs font-bold text-rose-600 hover:underline">Change</button>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Rotation</label>
            <div className="grid grid-cols-3 gap-2">
              {([90, 180, 270] as const).map((a) => (
                <button key={a} onClick={() => setAngle(a)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border p-3 text-sm font-bold transition-all ${angle === a ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-600'}`}>
                  <RotateCw className="h-4 w-4" /> {a}°
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setApplyAll(true)}
              className={`rounded-xl border p-3 text-sm font-bold transition-all ${applyAll ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-600'}`}>
              All pages
            </button>
            <button onClick={() => setApplyAll(false)}
              className={`rounded-xl border p-3 text-sm font-bold transition-all ${!applyAll ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-600'}`}>
              Specific pages
            </button>
          </div>

          {!applyAll && (
            <input value={range} onChange={(e) => setRange(e.target.value)}
              placeholder={`e.g. 1-3, 5 (of ${pageCount})`}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-800 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
          )}

          {error && <ErrorNote>{error}</ErrorNote>}
          <PrimaryButton onClick={run} loading={loading}>{loading ? 'Rotating…' : 'Rotate PDF'}</PrimaryButton>
        </>
      )}
      {!file && error && <ErrorNote>{error}</ErrorNote>}
    </PdfToolShell>
  );
}
