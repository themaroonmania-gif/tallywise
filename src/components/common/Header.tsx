'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronDown,
  Combine,
  FileImage,
  Menu,
  Minimize2,
  PenLine,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { pdfTools, PDF_GROUPS, PdfToolGroup } from '@/config/pdfTools';

const CALC_LINKS = [
  { href: '/finance', label: 'Finance' },
  { href: '/health', label: 'Health' },
  { href: '/school', label: 'School' },
  { href: '/everyday', label: 'Everyday' },
  { href: '/conversion', label: 'Convert' },
];

const pdfGroupOrder: PdfToolGroup[] = ['organize', 'optimize', 'convert', 'edit', 'security'];

function LogoMark() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-[#0f172a] text-sm font-black text-[#f8fafc] shadow-lg shadow-slate-900/15">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.85),transparent_42%)]" />
        <span className="relative">Tw</span>
      </span>
      <span className="leading-none">
        <span className="font-display block text-[1.45rem] font-black tracking-tight text-[#0f172a]">
          Tallywise
        </span>
        <span className="hidden text-[0.62rem] font-black uppercase tracking-[0.24em] text-[#1d4ed8] sm:block">
          Browser tools
        </span>
      </span>
    </span>
  );
}

function PdfMenu() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <Link
        href="/pdf"
        className="inline-flex items-center gap-1 rounded-full border border-[#e2e8f0] bg-[#ffffff]/80 px-3.5 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#1d4ed8] transition hover:border-[#2563eb]/40 hover:bg-white"
      >
        PDF Studio <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </Link>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-[620px] rounded-[1.75rem] border border-[#e2e8f0] bg-[#ffffff] p-4 shadow-2xl shadow-[#0f172a]/15">
          <Link
            href="/pdf/edit-pdf"
            className="ink-card group mb-4 flex items-center justify-between gap-4 rounded-[1.4rem] p-5 text-white"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/15">
                <PenLine className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-xl font-black">Edit PDF</p>
                <p className="text-xs font-semibold text-white/70">
                  Replace text, OCR scans, draw, sign, and export privately.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.16em] text-[#60a5fa]">
              Open <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </span>
          </Link>

          <div className="grid grid-cols-2 gap-x-7 gap-y-5">
            {pdfGroupOrder.map((groupKey) => {
              const group = PDF_GROUPS[groupKey];
              const tools = pdfTools.filter((t) => t.group === groupKey && t.slug !== 'edit-pdf');
              if (!tools.length) return null;
              return (
                <div key={groupKey}>
                  <p className="mb-2 text-[0.64rem] font-black uppercase tracking-[0.18em] text-[#94a3b8]">
                    {group.name}
                  </p>
                  <ul className="space-y-1">
                    {tools.slice(0, 6).map((t) => (
                      <li key={t.slug}>
                        <Link
                          href={`/pdf/${t.slug}`}
                          className="block rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#334155] transition hover:bg-white hover:text-[#2563eb]"
                        >
                          {t.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <Link
            href="/pdf"
            className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-[#e2e8f0] bg-white/70 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-[#0f172a] transition hover:border-[#2563eb]/40"
          >
            View every PDF tool <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e2e8f0]/75 bg-[#f8fafc]/88 backdrop-blur-xl">
      <div className="site-container">
        <div className="flex h-[4.75rem] items-center justify-between">
          <Link href="/" className="group" aria-label="Tallywise home">
            <LogoMark />
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-[#e2e8f0] bg-[#ffffff]/72 p-1.5 shadow-sm lg:flex">
            {CALC_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3.5 py-2 text-xs font-black uppercase tracking-[0.15em] text-[#475569] transition hover:bg-white hover:text-[#0f172a]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <PdfMenu />
            <Link
              href="/pdf/edit-pdf"
              className="inline-flex items-center gap-2 rounded-full bg-[#0f172a] px-4 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-[#f8fafc] shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-[#1e40af]"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#60a5fa]" />
              Edit PDF
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/pdf/edit-pdf"
              className="rounded-full bg-[#0f172a] px-3 py-2 text-[0.65rem] font-black uppercase tracking-[0.14em] text-[#f8fafc]"
            >
              Edit PDF
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label="Toggle menu"
              className="rounded-full border border-[#e2e8f0] bg-[#ffffff]/80 p-2 text-[#0f172a]"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-[#e2e8f0]/70 pb-5 pt-4">
            <div className="grid grid-cols-2 gap-2">
              {CALC_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl border border-[#e2e8f0] bg-[#ffffff]/80 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#334155]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <Link
              href="/pdf/edit-pdf"
              onClick={() => setMobileOpen(false)}
              className="ink-card mt-3 flex items-center gap-3 rounded-3xl p-4 text-white"
            >
              <PenLine className="h-5 w-5 text-[#60a5fa]" />
              <div>
                <p className="text-sm font-black">PDF editor</p>
                <p className="text-xs font-semibold text-white/70">OCR, text replacement, markup, export.</p>
              </div>
            </Link>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { href: '/pdf/merge-pdf', label: 'Merge', icon: Combine },
                { href: '/pdf/compress-pdf', label: 'Compress', icon: Minimize2 },
                { href: '/pdf/jpg-to-pdf', label: 'JPG to PDF', icon: FileImage },
                { href: '/pdf', label: 'All tools', icon: ShieldCheck },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-2xl border border-[#e2e8f0] bg-white/65 px-4 py-3 text-xs font-bold text-[#334155]"
                >
                  <link.icon className="h-4 w-4 text-[#2563eb]" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
