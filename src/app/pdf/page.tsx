import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight,
  Combine,
  FileImage,
  FileMinus,
  FilePlus,
  FileText,
  Hash,
  Image as ImageIcon,
  LayoutGrid,
  Lock,
  LockOpen,
  Minimize2,
  PenLine,
  RotateCw,
  Scissors,
  ShieldCheck,
  Signature,
  Sparkles,
  Stamp,
  WifiOff,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { pdfTools, getPdfTool, PDF_GROUPS, PdfToolGroup } from '@/config/pdfTools';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AdSlot } from '@/components/common/AdSlot';

const ICONS: Record<string, LucideIcon> = {
  Combine,
  Scissors,
  RotateCw,
  LayoutGrid,
  FileMinus,
  FilePlus,
  Minimize2,
  Image: ImageIcon,
  FileImage,
  FileText,
  PenLine,
  Signature,
  Stamp,
  Hash,
  Lock,
  LockOpen,
};

const GROUP_ACCENT: Record<string, string> = {
  indigo: 'text-[#4338ca] bg-[#4338ca]/10',
  emerald: 'text-[#0f766e] bg-[#0f766e]/10',
  amber: 'text-[#1463ff] bg-[#1463ff]/12',
  rose: 'text-[#be123c] bg-[#be123c]/10',
  teal: 'text-[#0f766e] bg-[#0f766e]/10',
};

export const metadata: Metadata = {
  title: 'Free PDF Tools - Merge, Split, Compress, Convert & Edit PDF Online',
  description:
    'A full suite of free PDF tools that run entirely in your browser. Merge, split, compress, rotate, convert, edit, and sign PDFs privately - your files never leave your device.',
  alternates: { canonical: 'https://tallywise.co/pdf' },
  openGraph: {
    title: 'Free PDF Tools - Merge, Split, Compress, Convert & Edit PDF Online',
    description:
      'Merge, split, compress, convert, edit, and sign PDFs for free, entirely in your browser. No uploads, no signup.',
    url: 'https://tallywise.co/pdf',
    type: 'website',
  },
};

const groupOrder: PdfToolGroup[] = ['organize', 'optimize', 'convert', 'edit', 'security'];

export default function PdfHubPage() {
  const editPdf = getPdfTool('edit-pdf');

  return (
    <>
      <Header />
      <main className="site-page py-10 md:py-14">
        <div className="site-container">
          <div className="grid gap-8 2xl:grid-cols-[160px_minmax(0,1fr)_160px] 2xl:items-start">
            <aside className="hidden 2xl:block">
              <AdSlot id="pdf-hub-left" type="sidebar" className="my-0" />
            </aside>

            <div className="min-w-0 space-y-8">
              <section className="ink-card overflow-hidden rounded-[2rem] px-5 py-10 text-white md:px-10 md:py-14">
                <div className="mx-auto max-w-4xl text-center">
                  <div className="eyebrow border-white/15 bg-white/10 text-[#76a7ff]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Your files stay on your device
                  </div>
                  <h1 className="font-display mx-auto mt-5 max-w-4xl text-4xl font-black leading-[0.96] tracking-tight sm:text-5xl md:text-7xl">
                    Edit, convert, and organize PDFs in your browser.
                  </h1>
                  <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-8 text-[#cbd9e9] md:text-lg">
                    Choose a tool, select your PDF, and download the result. No signup, software install, or server upload.
                  </p>
                  <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.14em] text-[#cbd9e9]">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2"><WifiOff className="h-4 w-4 text-[#76a7ff]" /> Browser processing</span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2"><Zap className="h-4 w-4 text-[#76a7ff]" /> No account</span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2"><Sparkles className="h-4 w-4 text-[#76a7ff]" /> Text detection and OCR</span>
                  </div>
                </div>
              </section>

              {editPdf && (
                <Link
                  href={`/pdf/${editPdf.slug}`}
                  className="ink-card group grid gap-6 overflow-hidden rounded-[2rem] p-6 text-white transition hover:-translate-y-0.5 md:grid-cols-[1fr_220px] md:p-8 md:items-center"
                >
                  <div>
                    <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-[#76a7ff]">
                      PDF editor
                    </span>
                    <h2 className="font-display mt-4 text-4xl font-black tracking-tight">Edit PDF</h2>
                    <p className="mt-3 max-w-xl text-sm font-semibold leading-7 text-[#cbd9e9]">
                      Click detected text and type your change. You can also OCR scans, add text or images, draw,
                      highlight, erase, undo, and export.
                    </p>
                  </div>
                  <span className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#10243e] transition group-hover:bg-[#e8f0ff]">
                    Open editor <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              )}

              {groupOrder.map((groupKey) => {
                const group = PDF_GROUPS[groupKey];
                const tools = pdfTools.filter((tool) => tool.group === groupKey && tool.slug !== 'edit-pdf');
                if (!tools.length) return null;
                return (
                  <section key={groupKey} className="paper-card rounded-[2rem] p-5 md:p-6">
                    <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
                      <div>
                        <p className="eyebrow">{group.name}</p>
                        <h2 className="font-display mt-3 text-3xl font-black tracking-tight text-[#10243e]">
                          {group.description}
                        </h2>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {tools.map((tool) => {
                        const Icon = ICONS[tool.iconName] ?? FileText;
                        const accent = GROUP_ACCENT[group.color] ?? GROUP_ACCENT.rose;
                        return (
                          <Link
                            key={tool.slug}
                            href={`/pdf/${tool.slug}`}
                            className="tool-card group relative flex min-h-[190px] flex-col justify-between rounded-[1.5rem] p-5"
                          >
                            {tool.status === 'soon' && (
                              <span className="absolute right-4 top-4 rounded-full border border-[#1463ff]/20 bg-[#1463ff]/10 px-2.5 py-1 text-[0.6rem] font-black uppercase tracking-[0.14em] text-[#0f52d4]">
                                Soon
                              </span>
                            )}
                            <div>
                              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <h3 className="font-display mt-5 text-2xl font-black text-[#10243e]">{tool.name}</h3>
                              <p className="mt-3 line-clamp-3 text-sm font-semibold leading-6 text-[#52677f]">
                                {tool.tagline}
                              </p>
                            </div>
                            <div className="mt-5 flex items-center justify-between border-t border-[#d6e0ec] pt-4 text-xs font-black uppercase tracking-[0.14em] text-[#0f52d4]">
                              <span>Open tool</span>
                              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>

            <aside className="hidden 2xl:block">
              <AdSlot id="pdf-hub-right" type="sidebar" className="my-0" />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
