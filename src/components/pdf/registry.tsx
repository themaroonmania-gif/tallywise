import React from 'react';
import { Wrench } from 'lucide-react';
import { MergePdf } from './tools/MergePdf';
import { SplitPdf } from './tools/SplitPdf';
import { RotatePdf } from './tools/RotatePdf';
import { RemovePages } from './tools/RemovePages';
import { ExtractPages } from './tools/ExtractPages';
import { JpgToPdf } from './tools/JpgToPdf';
import { PdfToJpg, PdfToPng } from './tools/PdfToImages';
import { CompressPdf } from './tools/CompressPdf';
import { WatermarkPdf } from './tools/WatermarkPdf';
import { PageNumbers } from './tools/PageNumbers';
import { OrganizePdf } from './tools/OrganizePdf';
import { SignPdf } from './tools/SignPdf';
import { EditPdf } from './tools/EditPdf';

// Maps a PDF tool slug to its interactive component. Tools not yet listed here
// fall back to the ComingSoon panel, so the whole catalog can be published for
// SEO while individual tools are filled in.
export const pdfToolComponents: Record<string, React.ComponentType> = {
  'merge-pdf': MergePdf,
  'split-pdf': SplitPdf,
  'rotate-pdf': RotatePdf,
  'remove-pages': RemovePages,
  'extract-pages': ExtractPages,
  'jpg-to-pdf': JpgToPdf,
  'pdf-to-jpg': PdfToJpg,
  'pdf-to-png': PdfToPng,
  'compress-pdf': CompressPdf,
  'watermark-pdf': WatermarkPdf,
  'page-numbers': PageNumbers,
  'organize-pdf': OrganizePdf,
  'sign-pdf': SignPdf,
  'edit-pdf': EditPdf,
};

export function ComingSoonPdfTool({ name }: { name: string }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
        <Wrench className="h-7 w-7" />
      </div>
      <h2 className="text-xl font-extrabold text-slate-800">{name} is coming soon</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        We&apos;re putting the finishing touches on this tool. Like all Tallywise PDF tools, it will run
        entirely in your browser so your files stay private.
      </p>
    </div>
  );
}
