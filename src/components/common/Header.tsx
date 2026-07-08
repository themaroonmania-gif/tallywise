'use client';

import React from 'react';
import Link from 'next/link';

export function Header() {
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

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/finance"
              className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-650 transition-colors"
            >
              Finance
            </Link>
            <Link
              href="/health"
              className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-650 transition-colors"
            >
              Health
            </Link>
            <Link
              href="/school"
              className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-650 transition-colors"
            >
              Academic
            </Link>
            <Link
              href="/everyday"
              className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-650 transition-colors"
            >
              Everyday
            </Link>
            <Link
              href="/conversion"
              className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-650 transition-colors"
            >
              Conversion
            </Link>
          </nav>

          {/* Mobile Menu Icon (Simple indicator or standard layout helper) */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              href="/finance"
              className="text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100"
            >
              Calcs
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
