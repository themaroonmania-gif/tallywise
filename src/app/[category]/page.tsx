import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Calculator, CheckCircle2 } from 'lucide-react';
import { calculators, CATEGORIES, CategoryKey } from '@/config/calculators';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
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
  everyday: { badge: 'bg-[#1463ff] text-white', glow: 'from-[#1463ff]/18' },
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
          <div className="mx-auto max-w-6xl">
            <div className="min-w-0 space-y-8">
              <section className={`paper-card relative overflow-hidden rounded-[2rem] p-6 md:p-10`}>
                <div className={`absolute inset-0 -z-0 bg-gradient-to-br ${accent.glow} via-transparent to-transparent`} />
                <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_260px] lg:items-end">
                  <div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] ${accent.badge}`}>
                      {categoryInfo.name} hub
                    </span>
                    <h1 className="font-display mt-5 max-w-3xl text-5xl font-black leading-[0.98] tracking-tight text-[#10243e] md:text-6xl">
                      {categoryInfo.name} calculators
                    </h1>
                    <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-[#52677f]">
                      {categoryInfo.description} Enter your numbers, see the result immediately, and review the formula
                      and assumptions below it.
                    </p>
                  </div>
                  <div className="rounded-[1.25rem] border border-[#d6e0ec] bg-[#f6f9fd] p-5">
                    <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-[#0f52d4]">
                      Available now
                    </p>
                    <p className="font-display mt-2 text-4xl font-black text-[#10243e]">{categoryCalculators.length}</p>
                    <p className="mt-1 text-sm font-semibold text-[#52677f]">calculators</p>
                    <div className="mt-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#0f766e]">
                      <CheckCircle2 className="h-4 w-4" />
                      Instant results
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
                        <Calculator className="h-5 w-5 text-[#1463ff]" />
                      </div>
                      <h2 className="font-display mt-5 text-2xl font-black leading-tight text-[#10243e]">
                        {calc.name}
                      </h2>
                      <p className="mt-3 line-clamp-3 text-sm font-semibold leading-6 text-[#52677f]">
                        {calc.seoDescription}
                      </p>
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-[#d6e0ec] pt-4 text-xs font-black uppercase tracking-[0.14em] text-[#0f52d4]">
                      <span>Open calculator</span>
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
