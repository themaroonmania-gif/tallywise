'use client';

import { loadPdfjs } from './pdfjs';

export interface RenderedPage {
  index: number;
  width: number;
  height: number;
  /** Encode this rendered page to an image Blob. */
  toBlob: (type: string, quality?: number) => Promise<Blob>;
}

const hasOffscreen = typeof OffscreenCanvas !== 'undefined';

function encodeCanvas(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Failed to encode image.'))), type, quality);
  });
}

/**
 * Render every page of a PDF to a bitmap using pdf.js.
 *
 * Rendering targets an OffscreenCanvas when the browser supports it. This is
 * important: pdf.js drives its on-screen <canvas> rendering loop with
 * requestAnimationFrame, which browsers pause in background/hidden tabs, so an
 * on-screen render can stall indefinitely if the user switches away. Rendering
 * to an OffscreenCanvas runs to completion regardless of tab visibility.
 *
 * `scale` controls resolution (2 ≈ 144dpi). `onProgress` fires after each page.
 */
export async function renderPdfPages(
  data: ArrayBuffer,
  scale: number,
  onProgress?: (done: number, total: number) => void
): Promise<RenderedPage[]> {
  const pdfjs = await loadPdfjs();
  const doc = await pdfjs.getDocument({ data }).promise;
  const pages: RenderedPage[] = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale });
    const w = Math.ceil(viewport.width);
    const h = Math.ceil(viewport.height);

    if (hasOffscreen) {
      const canvas = new OffscreenCanvas(w, h);
      const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D | null;
      if (!ctx) throw new Error('Canvas not supported in this browser.');
      // pdf.js accepts an OffscreenCanvas context at runtime, but its published
      // types only describe HTMLCanvasElement, hence the unknown double-cast.
      await page.render({ canvas, canvasContext: ctx, viewport } as unknown as Parameters<typeof page.render>[0]).promise;
      pages.push({
        index: i - 1,
        width: w,
        height: h,
        toBlob: (type, quality) => canvas.convertToBlob({ type, quality }),
      });
    } else {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported in this browser.');
      await page.render({ canvas, canvasContext: ctx, viewport } as Parameters<typeof page.render>[0]).promise;
      pages.push({
        index: i - 1,
        width: w,
        height: h,
        toBlob: (type, quality) => encodeCanvas(canvas, type, quality),
      });
    }
    onProgress?.(i, doc.numPages);
  }

  await doc.cleanup();
  return pages;
}
