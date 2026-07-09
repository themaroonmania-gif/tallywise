'use client';

// Lazy-loads pdf.js in the browser and points it at the worker file we copied
// into /public. Keeping this in one place means every tool configures the
// worker identically and pdf.js is only pulled into the bundle when a tool
// that actually renders pages needs it.
import type * as PdfjsModule from 'pdfjs-dist';

let pdfjsPromise: Promise<typeof PdfjsModule> | null = null;

export function loadPdfjs(): Promise<typeof PdfjsModule> {
  if (!pdfjsPromise) {
    pdfjsPromise = import('pdfjs-dist').then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      return pdfjs;
    });
  }
  return pdfjsPromise;
}
