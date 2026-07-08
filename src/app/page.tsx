'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { calculators, CATEGORIES, CategoryKey } from '@/config/calculators';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

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
    return 'bg-amber-500 text-white';
  };

  return (
    <>
      <Header />
      
      <main className="flex-1 bg-slate-50">
        {/* Hero Section */}
        <section className="bg-white border-b border-slate-100 py-16 md:py-24">
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
              Free, accurate, in-browser calculators across finance, health, academics, and math. No accounts, no paywalls, instant outputs.
            </p>

            {/* Search Input */}
            <div className="max-w-md mx-auto relative pt-4">
              <input
                type="text"
                placeholder="Search 25+ calculators (e.g. paycheck, gpa)..."
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

        {/* Category Filters Hub */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
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

          {/* Calculator Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCalculators.map((calc) => {
              // Mark if interactive vs coming soon
              const isInteractive = [
                'paycheck-calculator',
                'mortgage-calculator',
                'tip-calculator',
                'gpa-calculator',
                'grade-calculator',
                'bmi-calculator',
                'calorie-calculator',
                'age-calculator',
                'percentage-calculator',
                'discount-calculator',
              ].includes(calc.slug);

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
      </main>

      <Footer />
    </>
  );
}
