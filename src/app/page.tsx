'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { calculators, CATEGORIES, CategoryKey } from '@/config/calculators';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AdSlot } from '@/components/common/AdSlot';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryKey | 'all'>('all');

  const filteredCalculators = calculators.filter((calc) => {
    const matchesSearch =
      calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.seoDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || calc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (cat: CategoryKey) => {
    if (cat === 'finance') return 'bg-emerald-500 text-white';
    if (cat === 'health') return 'bg-rose-500 text-white';
    if (cat === 'school') return 'bg-indigo-500 text-white';
    if (cat === 'conversion') return 'bg-teal-500 text-white';
    return 'bg-amber-500 text-white';
  };

  return (
    <>
      <Header />

      <main className="flex-1 bg-slate-50 py-12">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 2xl:grid-cols-[160px_minmax(0,1fr)_160px] 2xl:items-start">
            <aside className="hidden 2xl:block">
              <AdSlot id="home-left" type="sidebar" className="my-0 shadow-xl shadow-slate-200/60" />
            </aside>

            <div className="min-w-0 space-y-8">
              <section className="bg-white border-b border-slate-100 py-16 md:py-24 rounded-3xl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-750 font-bold text-xs">
                    ⚡ High-speed mathematical modeling
                  </div>

                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-850 max-w-3xl mx-auto leading-[1.1]">
                    Solve complex sums in{' '}
                    <span className="bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                      milliseconds
                    </span>
                  </h1>

                  <p className="text-slate-500 text-md md:text-lg max-w-xl mx-auto font-medium">
                    Free, private, in-browser tools — accurate calculators for finance, health, and school, plus a full suite of PDF tools. No accounts, no paywalls, instant results.
                  </p>

                  <div className="max-w-md mx-auto relative pt-4">
                    <input
                      type="text"
                      placeholder="Search 60+ calculators (e.g. paycheck, gpa)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-5 py-3.5 pl-12 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium text-slate-800 shadow-sm text-sm"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5 text-slate-400 absolute left-4 top-[30px]"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.602 10.602z" />
                    </svg>
                  </div>
                </div>
              </section>

              <Link
                href="/pdf"
                className="group flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-rose-100 bg-gradient-to-r from-rose-50 to-indigo-50 p-6 md:p-8 transition-all hover:shadow-xl hover:shadow-rose-500/5"
              >
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-rose-600 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-black text-slate-800">
                      New: <span className="text-rose-600">Free PDF Tools</span>
                    </h2>
                    <p className="text-xs md:text-sm font-medium text-slate-500">
                      Merge, split, compress, convert, edit &amp; sign PDFs — 100% in your browser, files never uploaded.
                    </p>
                  </div>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-transform group-hover:translate-x-0.5">
                  Open PDF Tools
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </span>
              </Link>

              <section className="space-y-8">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                      activeCategory === 'all'
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    All Categories
                  </button>
                  {Object.entries(CATEGORIES).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setActiveCategory(key as CategoryKey)}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                        activeCategory === key
                          ? 'bg-indigo-650 text-white shadow-sm'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {value.name}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCalculators.map((calc) => {
                    const isInteractive = true;

                    return (
                      <Link
                        key={calc.slug}
                        href={`/${calc.category}/${calc.slug}`}
                        className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${getCategoryColor(calc.category)}`}>
                              {calc.category}
                            </span>
                            {isInteractive ? (
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                                Live Widget
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                                In Verification
                              </span>
                            )}
                          </div>

                          <h3 className="text-md font-bold text-slate-800 group-hover:text-indigo-650 transition-colors">
                            {calc.name}
                          </h3>

                          <p className="text-xs text-slate-450 leading-relaxed line-clamp-2 font-medium">
                            {calc.seoDescription}
                          </p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-500 group-hover:text-indigo-650 transition-colors">
                          <span>Calculate Now</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </div>
                      </Link>
                    );
                  })}

                  {filteredCalculators.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400 font-medium">
                      No calculators match your search query. Try another term.
                    </div>
                  )}
                </div>
              </section>
            </div>

            <aside className="hidden 2xl:block">
              <AdSlot id="home-right" type="sidebar" className="my-0 shadow-xl shadow-slate-200/60" />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
