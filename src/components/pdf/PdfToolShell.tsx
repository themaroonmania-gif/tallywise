'use client';

import React, { useCallback, useRef, useState } from 'react';
import { Download, Loader2, UploadCloud, X } from 'lucide-react';

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

/** Drag-and-drop plus click file picker. */
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
      className={`cursor-pointer rounded-[1.75rem] border-2 border-dashed p-8 text-center transition-all md:p-10 ${
        dragging
          ? 'border-[#2563eb] bg-[#dbeafe]'
          : 'border-[#e2e8f0] bg-[#f8fafc] hover:border-[#2563eb]/55 hover:bg-[#ffffff]'
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
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#0f172a] text-[#60a5fa] shadow-xl shadow-slate-900/10">
        <UploadCloud className="h-7 w-7" />
      </div>
      <p className="font-display text-2xl font-black tracking-tight text-[#0f172a]">{label ?? 'Select files'}</p>
      <p className="mt-2 text-sm font-semibold text-[#475569]">{hint ?? 'or drag and drop them here'}</p>
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
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f172a] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#f8fafc] shadow-xl shadow-slate-900/15 transition-all hover:-translate-y-0.5 hover:bg-[#1e40af] disabled:cursor-not-allowed disabled:bg-[#cbd5e1] disabled:shadow-none"
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
    <div className="rounded-[1.75rem] border border-[#0f766e]/20 bg-[#ecf8f4] p-6 text-center">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f766e] text-white shadow-xl shadow-[#0f766e]/15">
        <Download className="h-6 w-6" />
      </div>
      <p className="font-display text-2xl font-black text-[#0f172a]">Your file is ready</p>
      <p className="mt-1 truncate text-xs font-semibold text-[#475569]">
        {filename}
        {typeof size === 'number' ? ` - ${formatBytes(size)}` : ''}
      </p>
      {note && <p className="mt-1 text-xs font-bold text-[#0f766e]">{note}</p>}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <button
          onClick={onDownload}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0f766e] px-6 py-3 text-sm font-black text-white shadow-md transition-all hover:bg-[#115e59]"
        >
          <Download className="h-4 w-4" /> Download
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#e2e8f0] bg-white px-6 py-3 text-sm font-black text-[#334155] transition-all hover:bg-[#ffffff]"
        >
          Start over
        </button>
      </div>
    </div>
  );
}

export function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-2xl border border-[#be123c]/20 bg-[#fff1f2] p-3 text-sm font-bold text-[#be123c]">
      <X className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

/** Outer card wrapper for a PDF tool's interactive area. */
export function PdfToolShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="paper-card rounded-[1.75rem] p-4 md:p-7">
      <div className="space-y-5">{children}</div>
    </div>
  );
}
