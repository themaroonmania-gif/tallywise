'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator, FileText, Search, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { calculators, CATEGORIES, CategoryKey } from '@/config/calculators';
import { pdfTools } from '@/config/pdfTools';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AdSlot } from '@/components/common/AdSlot';

type FilterKey = CategoryKey | 'pdf' | 'all';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All tools' },
  { key: 'pdf', label: 'PDF Studio' },
  ...Object.entries(CATEGORIES).map(([key, value]) => ({ key: key as CategoryKey, label: value.name })),
];

const categoryBadge: Record<FilterKey, string> = {
  all: 'bg-[#0f172a] text-[#f8fafc]',
  pdf: 'bg-[#be123c] text-white',
  finance: 'bg-[#0f766e] text-white',
  health: 'bg-[#be123c] text-white',
  school: 'bg-[#4338ca] text-white',
  everyday: 'bg-[#2563eb] text-white',
  conversion: 'bg-[#0f766e] text-white',
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const tools = [
    ...calculators.map((tool) => ({
      id: `calc-${tool.slug}`,
      kind: 'calculator' as const,
      group: tool.category as FilterKey,
      badge: CATEGORIES[tool.category].name,
      name: tool.name,
      description: tool.seoDescription,
      href: `/${tool.category}/${tool.slug}`,
    })),
    ...pdfTools.map((tool) => ({
      id: `pdf-${tool.slug}`,
      kind: 'pdf' as const,
      group: 'pdf' as FilterKey,
      badge: 'PDF Studio',
      name: tool.name,
      description: tool.tagline,
      href: `/pdf/${tool.slug}`,
    })),
  ];

  const query = searchQuery.trim().toLowerCase();
  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      !query ||
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.badge.toLowerCase().includes(query);
    const matchesFilter = activeFilter === 'all' || tool.group === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Header />

      <main className="site-page py-10 md:py-14">
        <div className="site-container">
          <div className="grid gap-8 2xl:grid-cols-[160px_minmax(0,1fr)_160px] 2xl:items-start">
            <aside className="hidden 2xl:block">
              <AdSlot id="home-left" type="sidebar" className="my-0" />
            </aside>

            <div className="min-w-0 space-y-8">
              <section className="ink-card relative overflow-hidden rounded-[2rem] px-5 py-10 text-white md:px-10 md:py-14">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#60a5fa]/60 to-transparent" />
                <div className="mx-auto max-w-4xl text-center">
                  <div className="eyebrow border-white/15 bg-white/10 text-[#60a5fa]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Private calculators and PDF studio
                  </div>
                  <h1 className="font-display mx-auto mt-5 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
                    The cleaner way to handle numbers and documents.
                  </h1>
                  <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-8 text-[#bfdbfe] md:text-lg">
                    Calculate, convert, merge, compress, OCR, edit, and export without account gates or upload-first
                    workflows. Tallywise is a focused toolbench for real work.
                  </p>

                  <div className="mx-auto mt-8 max-w-2xl rounded-[1.35rem] border border-white/10 bg-white/10 p-2 shadow-2xl shadow-black/10 backdrop-blur">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#60a5fa]" />
                      <input
                        type="text"
                        placeholder="Search tools: edit PDF, paycheck, GPA, compress..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-[#ffffff] py-4 pl-12 pr-4 text-sm font-bold text-[#0f172a] outline-none transition placeholder:text-[#94a3b8] focus:border-[#60a5fa]"
                      />
                    </div>
                  </div>

                  <div className="mt-7 grid gap-3 text-left sm:grid-cols-3">
                    {[
                      { icon: ShieldCheck, label: 'Private by default', text: 'PDF files stay local whenever possible.' },
                      { icon: Zap, label: 'No fake friction', text: 'Open a tool, use it, download the result.' },
                      { icon: FileText, label: 'PDF editor focus', text: 'OCR, text replacement, markup, and export.' },
                    ].map((item) => (
                      <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                        <item.icon className="mb-3 h-5 w-5 text-[#60a5fa]" />
                        <p className="text-sm font-black">{item.label}</p>
                        <p className="mt-1 text-xs font-semibold leading-5 text-[#bfdbfe]">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="paper-card rounded-[2rem] p-4 md:p-6">
                <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                  <div>
                    <p className="eyebrow">Tool library</p>
                    <h2 className="font-display mt-3 text-3xl font-black tracking-tight text-[#0f172a]">
                      Pick a task, not a category maze.
                    </h2>
                  </div>
                  <p className="max-w-md text-sm font-semibold leading-6 text-[#475569]">
                    {filteredTools.length} tools available. Every card is a direct route to a working calculator or PDF
                    utility.
                  </p>
                </div>

                <div className="mb-6 flex flex-wrap gap-2">
                  {FILTERS.map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setActiveFilter(filter.key)}
                      className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition ${
                        activeFilter === filter.key
                          ? 'border-[#0f172a] bg-[#0f172a] text-[#f8fafc]'
                          : 'border-[#e2e8f0] bg-[#ffffff]/80 text-[#475569] hover:border-[#2563eb]/40 hover:text-[#0f172a]'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredTools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      className="tool-card group flex min-h-[190px] flex-col justify-between rounded-[1.5rem] p-5"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-3">
                          <span className={`rounded-full px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.16em] ${categoryBadge[tool.group]}`}>
                            {tool.badge}
                          </span>
                          {tool.kind === 'pdf' ? (
                            <FileText className="h-5 w-5 text-[#be123c]" />
                          ) : (
                            <Calculator className="h-5 w-5 text-[#2563eb]" />
                          )}
                        </div>
                        <h3 className="font-display mt-5 text-2xl font-black leading-tight text-[#0f172a]">
                          {tool.name}
                        </h3>
                        <p className="mt-3 line-clamp-3 text-sm font-semibold leading-6 text-[#475569]">
                          {tool.description}
                        </p>
                      </div>
                      <div className="mt-5 flex items-center justify-between border-t border-[#e2e8f0] pt-4 text-xs font-black uppercase tracking-[0.14em] text-[#1d4ed8]">
                        <span>{tool.kind === 'pdf' ? 'Open PDF tool' : 'Calculate now'}</span>
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))}

                  {filteredTools.length === 0 && (
                    <div className="col-span-full rounded-[1.5rem] border border-[#e2e8f0] bg-[#ffffff]/80 p-10 text-center">
                      <p className="font-display text-2xl font-black text-[#0f172a]">No matching tools yet.</p>
                      <p className="mt-2 text-sm font-semibold text-[#475569]">Try a different search term or clear the filter.</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <aside className="hidden 2xl:block">
              <AdSlot id="home-right" type="sidebar" className="my-0" />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
