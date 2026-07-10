'use client';

import React, { useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { PrimaryButton, ResultPanel, ErrorNote, downloadBlob } from '../PdfToolShell';

const A4 = { w: 595.28, h: 841.89 };
const MARGIN = 56;
const SIZE = 12;
const LEADING = SIZE * 1.35;

function wrapLine(line: string, font: import('pdf-lib').PDFFont, maxWidth: number): string[] {
  if (!line) return [''];
  const words = line.split(' ');
  const out: string[] = [];
  let cur = '';
  for (const w of words) {
    const candidate = cur ? `${cur} ${w}` : w;
    if (font.widthOfTextAtSize(candidate, SIZE) > maxWidth && cur) {
      out.push(cur);
      cur = w;
    } else {
      cur = candidate;
    }
  }
  out.push(cur);
  return out;
}

export function TextToPdf() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; size: number } | null>(null);

  const run = async () => {
    if (!text.trim()) return;
    setLoading(true); setError(null);
    try {
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const maxWidth = A4.w - MARGIN * 2;

      const rawLines = text.split('\n');
      const lines: string[] = [];
      for (const raw of rawLines) lines.push(...wrapLine(raw, font, maxWidth));

      let page = doc.addPage([A4.w, A4.h]);
      let y = A4.h - MARGIN;
      for (const line of lines) {
        if (y < MARGIN) {
          page = doc.addPage([A4.w, A4.h]);
          y = A4.h - MARGIN;
        }
        page.drawText(line, { x: MARGIN, y: y - SIZE, size: SIZE, font, color: rgb(0.06, 0.09, 0.16) });
        y -= LEADING;
      }

      const bytes = await doc.save();
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
      setResult({ blob, size: blob.size });
    } catch (e) { console.error(e); setError('Could not build a PDF from this text.'); }
    finally { setLoading(false); }
  };

  const reset = () => { setText(''); setResult(null); setError(null); };

  if (result) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
        <ResultPanel filename="document.pdf" size={result.size}
          onDownload={() => downloadBlob(result.blob, 'document.pdf')} onReset={reset} />
      </div>
    );
  }

  return (
    <div className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here…"
        rows={14}
        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-800 outline-none focus:border-rose-400 focus:bg-white"
      />
      {error && <ErrorNote>{error}</ErrorNote>}
      <PrimaryButton onClick={run} disabled={!text.trim()} loading={loading}>
        {loading ? 'Building PDF…' : 'Create PDF'}
      </PrimaryButton>
    </div>
  );
}
