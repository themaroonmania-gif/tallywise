'use client';

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import {
  PdfToolShell, Dropzone, PrimaryButton, ResultPanel, ErrorNote, downloadBlob, formatBytes,
} from '../PdfToolShell';
import { parsePageRanges, baseName } from '@/lib/pdfUtils';

type Mode = 'each' | 'range';

export function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<Mode>('each');
  const [range, setRange] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string; size: number } | null>(null);

  const onFiles = async (files: File[]) => {
    setError(null);
    setResult(null);
    const f = files[0];
    if (!f) return;
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
      setFile(f);
      setPageCount(doc.getPageCount());
    } catch {
      setError('Could not read this PDF. It may be corrupted or password-protected.');
    }
  };

  const run = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const srcBytes = await file.arrayBuffer();
      const src = await PDFDocument.load(srcBytes, { ignoreEncryption: true });
      const stem = baseName(file.name);

      if (mode === 'range') {
        const indices = parsePageRanges(range, pageCount);
        if (!indices.length) {
          setError('Enter a valid page range, e.g. "1-3, 5".');
          setLoading(false);
          return;
        }
        const out = await PDFDocument.create();
        const copied = await out.copyPages(src, indices);
        copied.forEach((p) => out.addPage(p));
        const bytes = await out.save();
        const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
        setResult({ blob, name: `${stem}-pages.pdf`, size: blob.size });
      } else {
        const zip = new JSZip();
        for (let i = 0; i < pageCount; i++) {
          const out = await PDFDocument.create();
          const [pg] = await out.copyPages(src, [i]);
          out.addPage(pg);
          const bytes = await out.save();
          zip.file(`${stem}-page-${i + 1}.pdf`, bytes);
        }
        const blob = await zip.generateAsync({ type: 'blob' });
        setResult({ blob, name: `${stem}-split.zip`, size: blob.size });
      }
    } catch (e) {
      console.error(e);
      setError('Something went wrong while splitting this PDF.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setRange('');
    setResult(null);
    setError(null);
  };

  if (result) {
    return (
      <PdfToolShell>
        <ResultPanel
          filename={result.name}
          size={result.size}
          onDownload={() => downloadBlob(result.blob, result.name)}
          onReset={reset}
        />
      </PdfToolShell>
    );
  }

  return (
    <PdfToolShell>
      {!file ? (
        <Dropzone accept="application/pdf" onFiles={onFiles} label="Select a PDF to split" />
      ) : (
        <>
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-700">{file.name}</p>
              <p className="text-xs text-slate-400">{pageCount} pages · {formatBytes(file.size)}</p>
            </div>
            <button onClick={reset} className="text-xs font-bold text-rose-600 hover:underline">Change</button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMode('each')}
              className={`rounded-xl border p-3 text-sm font-bold transition-all ${mode === 'each' ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-600'}`}
            >
              Every page → ZIP
            </button>
            <button
              onClick={() => setMode('range')}
              className={`rounded-xl border p-3 text-sm font-bold transition-all ${mode === 'range' ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-600'}`}
            >
              Custom range → 1 PDF
            </button>
          </div>

          {mode === 'range' && (
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Pages to extract
              </label>
              <input
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder={`e.g. 1-3, 5 (of ${pageCount})`}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-800 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>
          )}

          {error && <ErrorNote>{error}</ErrorNote>}

          <PrimaryButton onClick={run} loading={loading}>
            {loading ? 'Splitting…' : mode === 'each' ? `Split into ${pageCount} files` : 'Extract pages'}
          </PrimaryButton>
        </>
      )}
      {!file && error && <ErrorNote>{error}</ErrorNote>}
    </PdfToolShell>
  );
}
