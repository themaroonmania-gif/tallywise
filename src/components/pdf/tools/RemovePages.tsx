'use client';

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import {
  PdfToolShell, Dropzone, PrimaryButton, ResultPanel, ErrorNote, downloadBlob, formatBytes,
} from '../PdfToolShell';
import { parsePageRanges, baseName } from '@/lib/pdfUtils';

export function RemovePages() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
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
      const remove = new Set(parsePageRanges(range, pageCount));
      if (!remove.size) { setError('Enter valid pages to remove, e.g. "2, 4-6".'); setLoading(false); return; }
      if (remove.size >= pageCount) { setError('You cannot remove every page.'); setLoading(false); return; }
      const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const out = await PDFDocument.create();
      const keep = src.getPageIndices().filter((i) => !remove.has(i));
      const copied = await out.copyPages(src, keep);
      copied.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
      setResult({ blob, name: `${baseName(file.name)}-trimmed.pdf`, size: blob.size });
    } catch (e) { console.error(e); setError('Something went wrong while removing pages.'); }
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
        <Dropzone accept="application/pdf" onFiles={onFiles} label="Select a PDF" />
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
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Pages to delete</label>
            <input value={range} onChange={(e) => setRange(e.target.value)}
              placeholder={`e.g. 2, 4-6 (of ${pageCount})`}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-800 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
          </div>
          {error && <ErrorNote>{error}</ErrorNote>}
          <PrimaryButton onClick={run} loading={loading}>{loading ? 'Removing…' : 'Delete pages'}</PrimaryButton>
        </>
      )}
      {!file && error && <ErrorNote>{error}</ErrorNote>}
    </PdfToolShell>
  );
}
