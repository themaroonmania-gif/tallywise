'use client';

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import {
  PdfToolShell, Dropzone, PrimaryButton, ResultPanel, ErrorNote, downloadBlob, formatBytes,
} from '../PdfToolShell';
import { renderPdfPages } from '@/lib/pdfRender';
import { baseName } from '@/lib/pdfUtils';

// scale = render resolution; quality = JPG quality. Lower = smaller file.
const LEVELS: Record<'strong' | 'balanced' | 'light', { scale: number; quality: number; label: string }> = {
  strong: { scale: 1.0, quality: 0.5, label: 'Strong — smallest file' },
  balanced: { scale: 1.5, quality: 0.7, label: 'Balanced — recommended' },
  light: { scale: 2.0, quality: 0.82, label: 'Light — best quality' },
};

export function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<'strong' | 'balanced' | 'light'>('balanced');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warn, setWarn] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string; size: number; note: string } | null>(null);

  const onFiles = (files: File[]) => {
    setError(null); setResult(null); setWarn(null);
    const f = files[0];
    if (f) setFile(f);
  };

  const run = async () => {
    if (!file) return;
    setLoading(true); setError(null); setWarn(null); setProgress({ done: 0, total: 0 });
    try {
      const original = file.size;
      const cfg = LEVELS[level];
      const pages = await renderPdfPages(await file.arrayBuffer(), cfg.scale, (done, total) => setProgress({ done, total }));
      const out = await PDFDocument.create();
      for (const p of pages) {
        const jpgBlob = await p.toBlob('image/jpeg', cfg.quality);
        const jpg = await out.embedJpg(await jpgBlob.arrayBuffer());
        // Keep original aspect ratio; place at a standard 72dpi page scale.
        const pageW = p.width / cfg.scale;
        const pageH = p.height / cfg.scale;
        const page = out.addPage([pageW, pageH]);
        page.drawImage(jpg, { x: 0, y: 0, width: pageW, height: pageH });
      }
      const bytes = await out.save();
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
      const saved = original - blob.size;
      const pct = Math.round((saved / original) * 100);
      if (blob.size >= original) {
        setWarn('This PDF is already efficiently sized — compressing it further would make it larger, so we kept your original. Compression helps most with scanned or image-heavy PDFs.');
        setLoading(false); setProgress(null);
        return;
      }
      setResult({
        blob,
        name: `${baseName(file.name)}-compressed.pdf`,
        size: blob.size,
        note: `${pct}% smaller — from ${formatBytes(original)} to ${formatBytes(blob.size)}`,
      });
    } catch (e) {
      console.error(e);
      setError('Could not compress this PDF. It may be corrupted or password-protected.');
    } finally {
      setLoading(false); setProgress(null);
    }
  };

  const reset = () => { setFile(null); setResult(null); setError(null); setWarn(null); };

  if (result) {
    return (
      <PdfToolShell>
        <ResultPanel filename={result.name} size={result.size} note={result.note}
          onDownload={() => downloadBlob(result.blob, result.name)} onReset={reset} />
      </PdfToolShell>
    );
  }

  return (
    <PdfToolShell>
      {!file ? (
        <Dropzone accept="application/pdf" onFiles={onFiles} label="Select a PDF to compress" />
      ) : (
        <>
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-700">{file.name}</p>
              <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
            </div>
            <button onClick={reset} className="text-xs font-bold text-rose-600 hover:underline">Change</button>
          </div>
          <div className="space-y-2">
            {(['strong', 'balanced', 'light'] as const).map((l) => (
              <button key={l} onClick={() => setLevel(l)}
                className={`w-full rounded-xl border p-3 text-left text-sm font-bold transition-all ${level === l ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-600'}`}>
                {LEVELS[l].label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400">
            Compression rebuilds each page as an optimized image, so text becomes non-selectable. It shrinks scanned and image-heavy PDFs the most.
          </p>
          {warn && <ErrorNote>{warn}</ErrorNote>}
          {error && <ErrorNote>{error}</ErrorNote>}
          {loading && progress && progress.total > 0 && (
            <p className="text-center text-sm font-medium text-slate-500">Processing page {progress.done} of {progress.total}…</p>
          )}
          <PrimaryButton onClick={run} loading={loading}>{loading ? 'Compressing…' : 'Compress PDF'}</PrimaryButton>
        </>
      )}
    </PdfToolShell>
  );
}
