'use client';

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { GripVertical, ArrowUp, ArrowDown, X, FileText } from 'lucide-react';
import {
  PdfToolShell,
  Dropzone,
  PrimaryButton,
  ResultPanel,
  ErrorNote,
  downloadBlob,
  formatBytes,
} from '../PdfToolShell';

interface QueuedFile {
  id: string;
  file: File;
}

export function MergePdf() {
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; size: number } | null>(null);

  const addFiles = (incoming: File[]) => {
    setError(null);
    setResult(null);
    const pdfs = incoming.filter((f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (pdfs.length !== incoming.length) {
      setError('Some files were skipped because they are not PDFs.');
    }
    setFiles((prev) => [
      ...prev,
      ...pdfs.map((file) => ({ id: `${file.name}-${Date.now()}-${Math.random()}`, file })),
    ]);
  };

  const move = (index: number, dir: -1 | 1) => {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const remove = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const merge = async () => {
    setLoading(true);
    setError(null);
    try {
      const merged = await PDFDocument.create();
      for (const { file } of files) {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const copied = await merged.copyPages(doc, doc.getPageIndices());
        copied.forEach((page) => merged.addPage(page));
      }
      const out = await merged.save();
      const blob = new Blob([out as BlobPart], { type: 'application/pdf' });
      setResult({ blob, size: blob.size });
    } catch (e) {
      setError(
        'Could not merge these files. One of them may be corrupted or password-protected. Try removing it and merging again.'
      );
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
  };

  if (result) {
    return (
      <PdfToolShell>
        <ResultPanel
          filename="merged.pdf"
          size={result.size}
          onDownload={() => downloadBlob(result.blob, 'merged.pdf')}
          onReset={reset}
        />
      </PdfToolShell>
    );
  }

  return (
    <PdfToolShell>
      <Dropzone
        accept="application/pdf"
        multiple
        onFiles={addFiles}
        label="Select PDF files to merge"
        hint="or drag and drop them here — add as many as you like"
      />

      {error && <ErrorNote>{error}</ErrorNote>}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {files.length} file{files.length > 1 ? 's' : ''} · drag order below
          </p>
          {files.map((qf, index) => (
            <div
              key={qf.id}
              className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
            >
              <GripVertical className="h-4 w-4 shrink-0 text-slate-300" />
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-700">{qf.file.name}</p>
                <p className="text-xs text-slate-400">{formatBytes(qf.file.size)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-700 disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => move(index, 1)}
                  disabled={index === files.length - 1}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-700 disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(qf.id)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-rose-600"
                  aria-label="Remove"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length >= 2 && (
        <PrimaryButton onClick={merge} loading={loading}>
          {loading ? 'Merging…' : `Merge ${files.length} PDFs`}
        </PrimaryButton>
      )}
      {files.length === 1 && (
        <p className="text-center text-sm text-slate-400">Add at least one more PDF to merge.</p>
      )}
    </PdfToolShell>
  );
}
