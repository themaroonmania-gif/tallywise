'use client';

import React, { useState } from 'react';
import JSZip from 'jszip';
import { loadPdfjs } from '@/lib/pdfjs';
import { baseName } from '@/lib/pdfUtils';
import {
  PdfToolShell, Dropzone, PrimaryButton, ResultPanel, ErrorNote, downloadBlob,
} from '../PdfToolShell';

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

const ROOT_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildDocumentXml(pages: string[]): string {
  const body = pages
    .map((pageText, pageIndex) => {
      const lines = pageText.split('\n');
      const paragraphs = lines
        .map((line) => `<w:p><w:r><w:t xml:space="preserve">${escapeXml(line)}</w:t></w:r></w:p>`)
        .join('');
      // A page break between pages, but not after the last one.
      const pageBreak = pageIndex < pages.length - 1
        ? '<w:p><w:r><w:br w:type="page"/></w:r></w:p>'
        : '';
      return paragraphs + pageBreak;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${body}<w:sectPr/></w:body>
</w:document>`;
}

export function PdfToWord() {
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
      const pages: string[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map((it) => ('str' in it ? it.str : '')).join(' ');
        pages.push(text.trim());
      }
      await doc.cleanup();

      const zip = new JSZip();
      zip.file('[Content_Types].xml', CONTENT_TYPES);
      zip.file('_rels/.rels', ROOT_RELS);
      zip.file('word/document.xml', buildDocumentXml(pages));

      const blob = await zip.generateAsync({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const name = `${baseName(file.name)}.docx`;
      setResult({ blob, name, size: blob.size });
    } catch (e) { console.error(e); setError('Could not convert this PDF. It may be scanned or password-protected.'); }
    finally { setLoading(false); }
  };

  const reset = () => { setFile(null); setResult(null); setError(null); };

  if (result) {
    return (
      <PdfToolShell>
        <ResultPanel filename={result.name} size={result.size}
          onDownload={() => downloadBlob(result.blob, result.name)} onReset={reset}
          note="Opens in Word, Google Docs, and most word processors." />
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
      {file && <PrimaryButton onClick={run} loading={loading}>{loading ? 'Converting…' : 'Convert to Word'}</PrimaryButton>}
    </PdfToolShell>
  );
}
