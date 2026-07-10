'use client';

// Lazy-loads pdf.js in the browser and points it at the worker file we copied
// into /public. Keeping this in one place means every tool configures the
// worker identically and pdf.js is only pulled into the bundle when a tool
// that actually renders pages needs it.
import type * as PdfjsModule from 'pdfjs-dist';

// pdfjs-dist relies on Promise.withResolvers(), a very new API (Safari 17.4+,
// Chrome 119+). On older mobile browsers it's undefined, which throws
// "undefined is not a function" on every single PDF load. Polyfill it before
// pdfjs ever runs; the worker file carries its own copy of this polyfill
// since it executes in a separate thread (see public/pdf.worker.min.mjs).
if (typeof window !== 'undefined' && typeof Promise.withResolvers !== 'function') {
  (Promise as unknown as { withResolvers: () => unknown }).withResolvers = function withResolvers() {
    let resolve: (value: unknown) => void;
    let reject: (reason?: unknown) => void;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve: resolve!, reject: reject! };
  };
}

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
