'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[#e2e8f0] bg-[#0f172a] text-[#f8fafc]">
      <div className="site-container py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.85fr_0.85fr_0.85fr]">
          <div className="space-y-5">
            <div>
              <p className="font-display text-3xl font-black tracking-tight">Tallywise</p>
              <p className="mt-2 max-w-md text-sm font-semibold leading-7 text-[#bfdbfe]">
                Private browser tools for math, documents, money, school, and everyday admin. Built to be fast,
                legible, and boringly dependable.
              </p>
            </div>

            <div className="grid max-w-lg gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <ShieldCheck className="mb-2 h-5 w-5 text-[#60a5fa]" />
                <p className="text-xs font-black uppercase tracking-[0.16em] text-white">Private-first</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-[#bfdbfe]">
                  PDF work happens locally in your browser whenever possible.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <Zap className="mb-2 h-5 w-5 text-[#60a5fa]" />
                <p className="text-xs font-black uppercase tracking-[0.16em] text-white">Fast by design</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-[#bfdbfe]">
                  No account gates, no fake loading screens, no unnecessary steps.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#60a5fa]">
              Calculators
            </h4>
            <ul className="space-y-2.5 text-sm font-semibold text-[#bfdbfe]">
              <li><Link href="/finance" className="transition hover:text-white">Finance calculators</Link></li>
              <li><Link href="/health" className="transition hover:text-white">Health and fitness</Link></li>
              <li><Link href="/school" className="transition hover:text-white">School and grades</Link></li>
              <li><Link href="/everyday" className="transition hover:text-white">Everyday utilities</Link></li>
              <li><Link href="/conversion" className="transition hover:text-white">Unit conversion</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#60a5fa]">
              PDF Studio
            </h4>
            <ul className="space-y-2.5 text-sm font-semibold text-[#bfdbfe]">
              <li><Link href="/pdf/edit-pdf" className="transition hover:text-white">Edit PDF</Link></li>
              <li><Link href="/pdf/merge-pdf" className="transition hover:text-white">Merge PDF</Link></li>
              <li><Link href="/pdf/compress-pdf" className="transition hover:text-white">Compress PDF</Link></li>
              <li><Link href="/pdf/pdf-to-word" className="transition hover:text-white">PDF to Word</Link></li>
              <li><Link href="/pdf" className="inline-flex items-center gap-1 text-[#60a5fa] transition hover:text-white">All PDF tools <ArrowRight className="h-3.5 w-3.5" /></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#60a5fa]">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm font-semibold text-[#bfdbfe]">
              <li><Link href="/about" className="transition hover:text-white">About</Link></li>
              <li><Link href="/contact" className="transition hover:text-white">Contact</Link></li>
              <li><Link href="/privacy" className="transition hover:text-white">Privacy</Link></li>
              <li><Link href="/terms" className="transition hover:text-white">Terms</Link></li>
              <li><Link href="/disclaimer" className="transition hover:text-white">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs font-semibold leading-6 text-[#93c5fd]">
          <p>
            Calculators and document tools are provided for informational use. Results are estimates and are not
            professional financial, tax, legal, medical, or academic advice.
          </p>
          <div className="mt-4 flex flex-col gap-2 text-[0.65rem] font-black uppercase tracking-[0.18em] text-[#94a3b8] sm:flex-row sm:items-center sm:justify-between">
            <span>Copyright {currentYear} Tallywise.co</span>
            <span>Built for clear decisions and cleaner documents</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
