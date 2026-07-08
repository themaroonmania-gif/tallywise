import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { calculators, CATEGORIES, CategoryKey } from '@/config/calculators';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AdSlot } from '@/components/common/AdSlot';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export function generateStaticParams() {
  return [
    { category: 'finance' },
    { category: 'health' },
    { category: 'school' },
    { category: 'everyday' },
    { category: 'conversion' },
  ];
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const catKey = category as CategoryKey;
  const categoryInfo = CATEGORIES[catKey];

  if (!categoryInfo) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${categoryInfo.name} Calculators - Tallywise`,
    description: categoryInfo.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const catKey = category as CategoryKey;
  const categoryInfo = CATEGORIES[catKey];

  if (!categoryInfo) {
    notFound();
  }

  const categoryCalculators = calculators.filter((calc) => calc.category === catKey);

  const getCategoryColor = (cat: CategoryKey) => {
    if (cat === 'finance') return 'bg-emerald-500 text-white';
    if (cat === 'health') return 'bg-rose-500 text-white';
    if (cat === 'school') return 'bg-indigo-500 text-white';
    if (cat === 'conversion') return 'bg-teal-500 text-white';
    return 'bg-amber-500 text-white';
  };

  const getBorderHoverColor = (cat: CategoryKey) => {
    if (cat === 'finance') return 'hover:border-emerald-500/20 hover:shadow-emerald-500/5';
    if (cat === 'health') return 'hover:border-rose-500/20 hover:shadow-rose-500/5';
    if (cat === 'school') return 'hover:border-indigo-500/20 hover:shadow-indigo-500/5';
    if (cat === 'conversion') return 'hover:border-teal-500/20 hover:shadow-teal-500/5';
    return 'hover:border-amber-500/20 hover:shadow-amber-500/5';
  };

  return (
    <>
      <Header />
      
      <main className="flex-1 bg-slate-50 py-12">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 2xl:grid-cols-[160px_minmax(0,1fr)_160px] 2xl:items-start">
            <aside className="hidden 2xl:block">
              <AdSlot id={`category-${catKey}-left`} type="sidebar" className="my-0 shadow-xl shadow-slate-200/60" />
            </aside>

            <div className="min-w-0">
              <div className="space-y-12">
                {/* Category Hero banner */}
                <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm space-y-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${getCategoryColor(catKey)}`}>
                    {categoryInfo.name} Category Hub
                  </span>
                  <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight mt-2">
                    {categoryInfo.name} Calculators
                  </h1>
                  <p className="text-slate-500 text-md max-w-2xl font-medium leading-relaxed">
                    {categoryInfo.description} Browse our selection of verified calculator tools below.
                  </p>
                </div>

                {/* Calculator Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryCalculators.map((calc) => {
                    const isInteractive = true;

                    return (
                      <Link
                        key={calc.slug}
                        href={`/${calc.category}/${calc.slug}`}
                        className={`group bg-white rounded-2xl p-6 border border-slate-100 transition-all duration-300 flex flex-col justify-between ${getBorderHoverColor(catKey)} hover:shadow-xl`}
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
                </div>
              </div>
            </div>

            <aside className="hidden 2xl:block">
              <AdSlot id={`category-${catKey}-right`} type="sidebar" className="my-0 shadow-xl shadow-slate-200/60" />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
