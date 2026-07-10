import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Combine, Scissors, RotateCw, LayoutGrid, FileMinus, FilePlus, Minimize2,
  Image as ImageIcon, FileImage, FileText, PenLine, Signature, Stamp, Hash, Lock, LockOpen,
  ShieldCheck, Zap, WifiOff, ArrowRight, type LucideIcon,
} from 'lucide-react';
import { pdfTools, getPdfTool, PDF_GROUPS, PdfToolGroup } from '@/config/pdfTools';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AdSlot } from '@/components/common/AdSlot';

const ICONS: Record<string, LucideIcon> = {
  Combine, Scissors, RotateCw, LayoutGrid, FileMinus, FilePlus, Minimize2,
  Image: ImageIcon, FileImage, FileText, PenLine, Signature, Stamp, Hash, Lock, LockOpen,
};

const GROUP_ACCENT: Record<string, string> = {
  indigo: 'text-indigo-600 bg-indigo-50',
  emerald: 'text-emerald-600 bg-emerald-50',
  amber: 'text-amber-600 bg-amber-50',
  rose: 'text-rose-600 bg-rose-50',
  teal: 'text-teal-600 bg-teal-50',
};

export const metadata: Metadata = {
  title: 'Free PDF Tools — Merge, Split, Compress, Convert & Edit PDF Online',
  description:
    'A full suite of free PDF tools that run entirely in your browser. Merge, split, compress, rotate, convert, edit, and sign PDFs privately — your files never leave your device.',
  alternates: { canonical: 'https://tallywise.co/pdf' },
  openGraph: {
    title: 'Free PDF Tools — Merge, Split, Compress, Convert & Edit PDF Online',
    description:
      'Merge, split, compress, convert, edit, and sign PDFs for free, entirely in your browser. No uploads, no signup.',
    url: 'https://tallywise.co/pdf',
    type: 'website',
  },
};

const groupOrder: PdfToolGroup[] = ['organize', 'optimize', 'convert', 'edit', 'security'];

export default function PdfHubPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50 py-12">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 2xl:grid-cols-[160px_minmax(0,1fr)_160px] 2xl:items-start">
            <aside className="hidden 2xl:block">
              <AdSlot id="pdf-hub-left" type="sidebar" className="my-0 shadow-xl shadow-slate-200/60" />
            </aside>

            <div className="min-w-0 space-y-10">
              <section className="rounded-3xl border-b border-slate-100 bg-white py-14 md:py-20 text-center">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-5">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-100 px-3 py-1.5 text-xs font-bold text-rose-600">
                    <ShieldCheck className="h-3.5 w-3.5" /> Files never leave your browser
                  </div>
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-850 leading-[1.1]">
                    Every PDF tool you need,{' '}
                    <span className="bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-transparent">
                      100% free
                    </span>
                  </h1>
                  <p className="mx-auto max-w-xl text-md md:text-lg font-medium text-slate-500">
                    Merge, split, compress, convert, edit, and sign PDFs — all in your browser. No uploads,
                    no accounts, no watermarks, no limits.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-semibold text-slate-500">
                    <span className="inline-flex items-center gap-1.5"><WifiOff className="h-4 w-4 text-slate-400" /> Works offline once loaded</span>
                    <span className="inline-flex items-center gap-1.5"><Zap className="h-4 w-4 text-slate-400" /> Instant, no server wait</span>
                    <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-slate-400" /> Completely private</span>
                  </div>
                </div>
              </section>

              {(() => {
                const editPdf = getPdfTool('edit-pdf');
                if (!editPdf) return null;
                return (
                  <Link
                    href={`/pdf/${editPdf.slug}`}
                    className="group relative flex flex-col items-start gap-4 overflow-hidden rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-600 to-indigo-650 p-8 text-white shadow-xl shadow-rose-500/10 transition-transform hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                        Most popular
                      </span>
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight">Edit PDF</h2>
                      <p className="max-w-md text-sm font-medium text-white/85">
                        Click anywhere on the page to add text, drop in images, highlight, draw, and more — no watermark, ever.
                      </p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-rose-600 shadow-md transition-colors group-hover:bg-rose-50">
                      Open editor <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                );
              })()}

              {groupOrder.map((groupKey) => {
                const group = PDF_GROUPS[groupKey];
                const tools = pdfTools.filter((t) => t.group === groupKey && t.slug !== 'edit-pdf');
                if (!tools.length) return null;
                return (
                  <section key={groupKey} className="space-y-4">
                    <div className="flex items-baseline justify-between">
                      <h2 className="text-lg font-black text-slate-800">{group.name}</h2>
                      <span className="text-xs font-medium text-slate-400">{group.description}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tools.map((t) => {
                        const Icon = ICONS[t.iconName] ?? Combine;
                        const accent = GROUP_ACCENT[group.color] ?? GROUP_ACCENT.rose;
                        return (
                          <Link
                            key={t.slug}
                            href={`/pdf/${t.slug}`}
                            className="group relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 transition-all duration-300 hover:border-rose-500/20 hover:shadow-xl hover:shadow-rose-500/5"
                          >
                            {t.status === 'soon' && (
                              <span className="absolute right-3 top-3 rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-600 border border-amber-200/60">
                                Soon
                              </span>
                            )}
                            <div className="space-y-3">
                              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <h3 className="text-md font-bold text-slate-800 group-hover:text-rose-600 transition-colors">
                                {t.name}
                              </h3>
                              <p className="text-xs leading-relaxed font-medium text-slate-450 line-clamp-2">
                                {t.tagline}
                              </p>
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
              <AdSlot id="pdf-hub-right" type="sidebar" className="my-0 shadow-xl shadow-slate-200/60" />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
