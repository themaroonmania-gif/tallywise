import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Calculator, CheckCircle2 } from 'lucide-react';
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

const categoryAccent: Record<CategoryKey, { badge: string; glow: string }> = {
  finance: { badge: 'bg-[#0f766e] text-white', glow: 'from-[#0f766e]/18' },
  health: { badge: 'bg-[#be123c] text-white', glow: 'from-[#be123c]/18' },
  school: { badge: 'bg-[#4338ca] text-white', glow: 'from-[#4338ca]/18' },
  everyday: { badge: 'bg-[#2563eb] text-white', glow: 'from-[#2563eb]/20' },
  conversion: { badge: 'bg-[#0f766e] text-white', glow: 'from-[#0f766e]/18' },
};

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
  const accent = categoryAccent[catKey];

  return (
    <>
      <Header />

      <main className="site-page py-10 md:py-14">
        <div className="site-container">
          <div className="grid gap-8 2xl:grid-cols-[160px_minmax(0,1fr)_160px] 2xl:items-start">
            <aside className="hidden 2xl:block">
              <AdSlot id={`category-${catKey}-left`} type="sidebar" className="my-0" />
            </aside>

            <div className="min-w-0 space-y-8">
              <section className={`paper-card relative overflow-hidden rounded-[2rem] p-6 md:p-10`}>
                <div className={`absolute inset-0 -z-0 bg-gradient-to-br ${accent.glow} via-transparent to-transparent`} />
                <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_260px] lg:items-end">
                  <div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] ${accent.badge}`}>
                      {categoryInfo.name} hub
                    </span>
                    <h1 className="font-display mt-5 max-w-3xl text-5xl font-black leading-[0.98] tracking-tight text-[#0f172a] md:text-6xl">
                      {categoryInfo.name} calculators that stay readable.
                    </h1>
                    <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-[#475569]">
                      {categoryInfo.description} Each tool is formatted for quick input, clear output, and practical
                      context below the calculator.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-[#e2e8f0] bg-[#ffffff]/76 p-5">
                    <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-[#1d4ed8]">
                      In this section
                    </p>
                    <p className="font-display mt-2 text-4xl font-black text-[#0f172a]">{categoryCalculators.length}</p>
                    <p className="mt-1 text-sm font-semibold text-[#475569]">working calculators</p>
                    <div className="mt-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#0f766e]">
                      <CheckCircle2 className="h-4 w-4" />
                      Live widgets
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryCalculators.map((calc) => (
                  <Link
                    key={calc.slug}
                    href={`/${calc.category}/${calc.slug}`}
                    className="tool-card group flex min-h-[205px] flex-col justify-between rounded-[1.5rem] p-5"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`rounded-full px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.16em] ${accent.badge}`}>
                          {calc.category}
                        </span>
                        <Calculator className="h-5 w-5 text-[#2563eb]" />
                      </div>
                      <h2 className="font-display mt-5 text-2xl font-black leading-tight text-[#0f172a]">
                        {calc.name}
                      </h2>
                      <p className="mt-3 line-clamp-3 text-sm font-semibold leading-6 text-[#475569]">
                        {calc.seoDescription}
                      </p>
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-[#e2e8f0] pt-4 text-xs font-black uppercase tracking-[0.14em] text-[#1d4ed8]">
                      <span>Calculate now</span>
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </section>
            </div>

            <aside className="hidden 2xl:block">
              <AdSlot id={`category-${catKey}-right`} type="sidebar" className="my-0" />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
