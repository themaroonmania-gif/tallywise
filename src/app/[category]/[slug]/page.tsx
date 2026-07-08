import React from 'react';
import { notFound } from 'next/navigation';
import { calculators, CalculatorDef } from '@/config/calculators';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AdSlot } from '@/components/common/AdSlot';
import { calculatorComponents, ComingSoonCalculator } from '@/components/calculators/registry';
import Link from 'next/link';
import type { Metadata } from 'next';

interface CalculatorPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export function generateStaticParams() {
  return calculators.map((calc) => ({
    category: calc.category,
    slug: calc.slug,
  }));
}

export async function generateMetadata({ params }: CalculatorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const calc = calculators.find((c) => c.slug === slug);

  if (!calc) {
    return {
      title: 'Calculator Not Found',
    };
  }

  return {
    title: calc.seoTitle,
    description: calc.seoDescription,
    alternates: {
      canonical: `https://tallywise.co/${calc.category}/${calc.slug}`,
    },
  };
}

export default async function CalculatorPage({ params }: CalculatorPageProps) {
  const { category, slug } = await params;
  const calc = calculators.find((c) => c.slug === slug && c.category === category);

  if (!calc) {
    notFound();
  }

  // Load correct React component from registry
  const CalculatorWidget = calculatorComponents[slug];

  // Resolve related calculators
  const relatedCalculators = calc.relatedSlugs
    .map((rSlug) => calculators.find((c) => c.slug === rSlug))
    .filter((c): c is CalculatorDef => !!c);

  // Generate FAQ Schema JSON-LD
  const faqSchema = calc.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': calc.faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  } : null;

  // Generate WebApplication Schema JSON-LD
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': calc.name,
    'description': calc.seoDescription,
    'url': `https://tallywise.co/${calc.category}/${calc.slug}`,
    'applicationCategory': `${calc.category}Application`,
    'operatingSystem': 'All',
    'browserRequirements': 'Requires JavaScript. Requires HTML5.',
  };

  const isFinance = calc.category === 'finance';
  const categoryBadgeColor =
    calc.category === 'finance'
      ? 'bg-emerald-550 text-white'
      : calc.category === 'health'
      ? 'bg-rose-500 text-white'
      : calc.category === 'school'
      ? 'bg-indigo-500 text-white'
      : 'bg-amber-500 text-white';

  return (
    <>
      {/* FAQ & WebApp Schema injection */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      <Header />

      <main className="flex-1 bg-slate-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
            <Link href="/" className="hover:text-slate-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${calc.category}`} className="hover:text-slate-600 transition-colors">{calc.category}</Link>
            <span>/</span>
            <span className="text-slate-550 font-bold">{calc.name}</span>
          </div>

          {/* H1 - exact search term match */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight leading-none">
              {calc.h1}
            </h1>
            <p className="text-sm font-medium text-slate-450">
              {calc.seoDescription}
            </p>
          </div>

          {/* Ad Slot #1 - directly below H1, above calculator */}
          <AdSlot id="above-tool" type="banner" />

          {/* Calculator Widget Container */}
          <div className="w-full">
            {CalculatorWidget ? (
              <CalculatorWidget />
            ) : (
              <ComingSoonCalculator name={calc.name} formula={calc.formulaDescription} />
            )}
          </div>

          {/* Ad Slot #2 - directly below calculator, above explainer */}
          <AdSlot id="below-tool" type="rectangle" />

          {/* Explainer Content Section */}
          <article className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 space-y-6 shadow-sm">
            <div className="prose prose-slate max-w-none prose-sm leading-relaxed prose-headings:font-extrabold prose-headings:text-slate-800 prose-h3:text-sm prose-h3:uppercase prose-h3:tracking-wide prose-h3:text-slate-400 prose-ul:list-disc prose-ul:pl-5 text-slate-600 font-medium">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 border-b border-slate-100 pb-3">
                How to Calculate & Formula Details
              </h2>
              
              {calc.formulaDescription && (
                <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl font-mono text-xs text-slate-650 my-4">
                  <span className="font-bold text-[10px] text-slate-400 block uppercase tracking-wide mb-1">
                    Mathematical Model Formula
                  </span>
                  <code>{calc.formulaDescription}</code>
                </div>
              )}

              <div
                dangerouslySetInnerHTML={{ __html: calc.explainerHtml }}
                className="space-y-4"
              />
            </div>
          </article>

          {/* FAQ Block (expandable accordions) */}
          {calc.faqs.length > 0 && (
            <section className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 border-b border-slate-100 pb-3">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {calc.faqs.map((faq, idx) => (
                  <details
                    key={idx}
                    className="group border border-slate-100 rounded-xl bg-slate-50/50 p-4 hover:border-slate-200 transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-sm font-bold text-slate-700 select-none">
                      <span>{faq.question}</span>
                      <span className="ml-1.5 shrink-0 rounded-full bg-white p-1 text-slate-400 group-open:rotate-180 transition-transform shadow-sm border border-slate-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          className="h-3.5 w-3.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </span>
                    </summary>
                    <p className="mt-3 text-xs leading-relaxed font-semibold text-slate-550 border-t border-slate-100 pt-3">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Ad Slot #3 - bottom of page */}
          <AdSlot id="bottom-page" type="bottom" />

          {/* Related Calculators Module */}
          {relatedCalculators.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Related Calculators in {calc.category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {relatedCalculators.map((rCalc) => (
                  <Link
                    key={rCalc.slug}
                    href={`/${rCalc.category}/${rCalc.slug}`}
                    className="bg-white rounded-xl p-4 border border-slate-100 hover:border-indigo-500/20 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${categoryBadgeColor} mb-2 inline-block`}>
                        {rCalc.category}
                      </span>
                      <h3 className="text-xs font-bold text-slate-750">{rCalc.name}</h3>
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-normal font-medium">
                        {rCalc.seoDescription}
                      </p>
                    </div>
                    <div className="text-[10px] font-bold text-indigo-650 mt-3 flex items-center justify-between">
                      <span>Compute</span>
                      <span>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
