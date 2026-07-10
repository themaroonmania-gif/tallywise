'use client';

import React, { useState } from 'react';
import { loadPdfjs } from '@/lib/pdfjs';
import { baseName } from '@/lib/pdfUtils';
import {
  PdfToolShell, Dropzone, PrimaryButton, ResultPanel, ErrorNote, downloadBlob,
} from '../PdfToolShell';

export function PdfToText() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string; size: number } | null>(null);

  const onFiles = (files: File[]) => {
    setError(null); setResult(null);
    const f = files[0]; if (f) setFile(f);
  };

  const run = async () => {
    if (!file) return;
    setLoading(true); setError(null);
    try {
      const pdfjs = await loadPdfjs();
      const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
      const parts: string[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map((it) => ('str' in it ? it.str : '')).join(' ');
        parts.push(text.trim());
      }
      await doc.cleanup();
      const blob = new Blob([parts.join('\n\n')], { type: 'text/plain' });
      const name = `${baseName(file.name)}.txt`;
      setResult({ blob, name, size: blob.size });
    } catch (e) { console.error(e); setError('Could not extract text from this PDF. It may be scanned or password-protected.'); }
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
      <Dropzone accept="application/pdf" onFiles={onFiles} label="Select a PDF" />
      {file && (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-semibold text-slate-700">{file.name}</div>
      )}
      {error && <ErrorNote>{error}</ErrorNote>}
      {file && <PrimaryButton onClick={run} loading={loading}>{loading ? 'Extracting text…' : 'Extract text'}</PrimaryButton>}
    </PdfToolShell>
  );
}
