'use client';

import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  PdfToolShell, Dropzone, PrimaryButton, ResultPanel, ErrorNote, downloadBlob, formatBytes,
} from '../PdfToolShell';
import { renderPdfPages } from '@/lib/pdfRender';
import { baseName } from '@/lib/pdfUtils';

interface Props {
  format: 'jpg' | 'png';
}

const QUALITY: Record<'low' | 'medium' | 'high', number> = { low: 1, medium: 1.5, high: 2.5 };

export function PdfToImages({ format }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string; size: number } | null>(null);

  const mime = format === 'png' ? 'image/png' : 'image/jpeg';

  const onFiles = (files: File[]) => {
    setError(null); setResult(null);
    const f = files[0];
    if (f) setFile(f);
  };

  const run = async () => {
    if (!file) return;
    setLoading(true); setError(null); setProgress({ done: 0, total: 0 });
    try {
      const pages = await renderPdfPages(await file.arrayBuffer(), QUALITY[quality], (done, total) => setProgress({ done, total }));
      const stem = baseName(file.name);
      if (pages.length === 1) {
        const blob = await pages[0].toBlob(mime, format === 'jpg' ? 0.92 : undefined);
        setResult({ blob, name: `${stem}.${format}`, size: blob.size });
      } else {
        const zip = new JSZip();
        for (const p of pages) {
          const blob = await p.toBlob(mime, format === 'jpg' ? 0.92 : undefined);
          zip.file(`${stem}-page-${p.index + 1}.${format}`, blob);
        }
        const blob = await zip.generateAsync({ type: 'blob' });
        setResult({ blob, name: `${stem}-${format}.zip`, size: blob.size });
      }
    } catch (e) {
      console.error(e);
      setError('Could not convert this PDF. It may be corrupted or password-protected.');
    } finally {
      setLoading(false); setProgress(null);
    }
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
        <Dropzone accept="application/pdf" onFiles={onFiles} label={`Select a PDF to convert to ${format.toUpperCase()}`} />
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
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Image quality</label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((q) => (
                <button key={q} onClick={() => setQuality(q)}
                  className={`rounded-xl border p-2.5 text-sm font-bold capitalize transition-all ${quality === q ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-600'}`}>{q}</button>
              ))}
            </div>
          </div>
          {error && <ErrorNote>{error}</ErrorNote>}
          {loading && progress && progress.total > 0 && (
            <p className="text-center text-sm font-medium text-slate-500">Rendering page {progress.done} of {progress.total}…</p>
          )}
          <PrimaryButton onClick={run} loading={loading}>{loading ? 'Converting…' : `Convert to ${format.toUpperCase()}`}</PrimaryButton>
        </>
      )}
    </PdfToolShell>
  );
}

export function PdfToJpg() { return <PdfToImages format="jpg" />; }
export function PdfToPng() { return <PdfToImages format="png" />; }
