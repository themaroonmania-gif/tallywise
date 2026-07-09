'use client';

import React, { useCallback, useRef, useState } from 'react';
import { UploadCloud, Loader2, Download, X } from 'lucide-react';

/** Triggers a browser download for a generated Blob. */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

interface DropzoneProps {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
  hint?: string;
}

/** Drag-and-drop + click file picker. */
export function Dropzone({ accept, multiple = false, onFiles, label, hint }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const files = Array.from(fileList);
      if (files.length) onFiles(files);
    },
    [onFiles]
  );

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
        dragging
          ? 'border-rose-500 bg-rose-50'
          : 'border-slate-300 bg-slate-50 hover:border-rose-400 hover:bg-rose-50/40'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-rose-500 shadow-sm">
        <UploadCloud className="h-7 w-7" />
      </div>
      <p className="text-base font-bold text-slate-800">{label ?? 'Select files'}</p>
      <p className="mt-1 text-sm text-slate-500">{hint ?? 'or drag and drop them here'}</p>
    </div>
  );
}

interface PrimaryButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export function PrimaryButton({ onClick, disabled, loading, children }: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-rose-600/10 transition-all hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

interface ResultPanelProps {
  filename: string;
  size?: number;
  onDownload: () => void;
  onReset: () => void;
  note?: string;
}

/** Shown after processing succeeds: a download button plus a reset. */
export function ResultPanel({ filename, size, onDownload, onReset, note }: ResultPanelProps) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
        <Download className="h-6 w-6" />
      </div>
      <p className="text-sm font-bold text-slate-800">Your file is ready</p>
      <p className="mt-1 truncate text-xs text-slate-500">
        {filename}
        {typeof size === 'number' ? ` · ${formatBytes(size)}` : ''}
      </p>
      {note && <p className="mt-1 text-xs font-medium text-emerald-700">{note}</p>}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <button
          onClick={onDownload}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700"
        >
          <Download className="h-4 w-4" /> Download
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50"
        >
          Start over
        </button>
      </div>
    </div>
  );
}

export function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">
      <X className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

/** Outer card wrapper for a PDF tool's interactive area. */
export function PdfToolShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
      <div className="space-y-5">{children}</div>
    </div>
  );
}
