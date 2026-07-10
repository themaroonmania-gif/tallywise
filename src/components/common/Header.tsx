'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown, PenLine, Combine, Minimize2, FileImage, Menu, X,
} from 'lucide-react';
import { pdfTools, PDF_GROUPS, PdfToolGroup } from '@/config/pdfTools';

const CALC_LINKS = [
  { href: '/finance', label: 'Finance' },
  { href: '/health', label: 'Health' },
  { href: '/school', label: 'Academic' },
  { href: '/everyday', label: 'Everyday' },
  { href: '/conversion', label: 'Conversion' },
];

const pdfGroupOrder: PdfToolGroup[] = ['organize', 'optimize', 'convert', 'edit', 'security'];

function PdfMenu() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setOpen(true); };
  const hide = () => { closeTimer.current = setTimeout(() => setOpen(false), 150); };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <Link
        href="/pdf"
        className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-rose-600 border border-rose-100 hover:bg-rose-100 transition-colors"
      >
        PDF Tools <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </Link>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[560px] rounded-2xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-200/60">
          <Link
            href="/pdf/edit-pdf"
            className="mb-3 flex items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-650 p-4 text-white transition-opacity hover:opacity-95"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <PenLine className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black">Edit PDF</p>
                <p className="text-[11px] font-medium text-white/80">Click anywhere to add text, images & more</p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Open →</span>
          </Link>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {pdfGroupOrder.map((groupKey) => {
              const group = PDF_GROUPS[groupKey];
              const tools = pdfTools.filter((t) => t.group === groupKey && t.slug !== 'edit-pdf');
              if (!tools.length) return null;
              return (
                <div key={groupKey}>
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{group.name}</p>
                  <ul className="space-y-1">
                    {tools.map((t) => (
                      <li key={t.slug}>
                        <Link
                          href={`/pdf/${t.slug}`}
                          className="block rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600"
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

          <Link href="/pdf" className="mt-3 block rounded-lg px-2 py-1.5 text-center text-xs font-bold text-rose-600 hover:bg-rose-50">
            View all PDF tools
          </Link>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-650 flex items-center justify-center text-white font-black text-lg shadow-sm shadow-indigo-500/10 transition-transform group-hover:scale-105">
                T
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-800">
                Tally<span className="text-indigo-650 bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">wise</span>
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {CALC_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-650 transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <PdfMenu />
          </nav>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/pdf"
              className="text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg hover:bg-rose-100"
            >
              PDF
            </Link>
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-50"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 py-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              {CALC_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <Link
              href="/pdf/edit-pdf"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-650 p-3 text-white"
            >
              <PenLine className="h-5 w-5" />
              <div>
                <p className="text-xs font-black">Edit PDF</p>
                <p className="text-[10px] font-medium text-white/80">Click anywhere to add text & more</p>
              </div>
            </Link>

            <div className="grid grid-cols-2 gap-3">
              {[
                { href: '/pdf/merge-pdf', label: 'Merge', icon: Combine },
                { href: '/pdf/compress-pdf', label: 'Compress', icon: Minimize2 },
                { href: '/pdf/jpg-to-pdf', label: 'JPG to PDF', icon: FileImage },
                { href: '/pdf', label: 'All PDF tools', icon: Menu },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  <l.icon className="h-4 w-4 text-rose-500" /> {l.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
