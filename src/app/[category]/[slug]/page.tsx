import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ChevronDown, Home } from 'lucide-react';
import { calculators, CalculatorDef } from '@/config/calculators';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AdSlot } from '@/components/common/AdSlot';
import { calculatorComponents, ComingSoonCalculator } from '@/components/calculators/registry';
import type { Metadata } from 'next';

interface CalculatorPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

const categoryBadgeColor: Record<string, string> = {
  finance: 'bg-[#0f766e] text-white',
  health: 'bg-[#be123c] text-white',
  school: 'bg-[#4338ca] text-white',
  conversion: 'bg-[#0f766e] text-white',
  everyday: 'bg-[#2563eb] text-white',
};

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

  const canonical = `https://tallywise.co/${calc.category}/${calc.slug}`;

  return {
    title: calc.seoTitle,
    description: calc.seoDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title: calc.seoTitle,
      description: calc.seoDescription,
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: calc.seoTitle,
      description: calc.seoDescription,
    },
  };
}

export default async function CalculatorPage({ params }: CalculatorPageProps) {
  const { category, slug } = await params;
  const calc = calculators.find((c) => c.slug === slug && c.category === category);

  if (!calc) {
    notFound();
  }

  const CalculatorWidget = calculatorComponents[slug];

  const relatedCalculators = calc.relatedSlugs
    .map((rSlug) => calculators.find((c) => c.slug === rSlug))
    .filter((c): c is CalculatorDef => !!c);

  const faqSchema = calc.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: calc.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: calc.name,
    description: calc.seoDescription,
    url: `https://tallywise.co/${calc.category}/${calc.slug}`,
    applicationCategory: `${calc.category}Application`,
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://tallywise.co/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: calc.category,
        item: `https://tallywise.co/${calc.category}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: calc.name,
        item: `https://tallywise.co/${calc.category}/${calc.slug}`,
      },
    ],
  };

  const badgeColor = categoryBadgeColor[calc.category] ?? categoryBadgeColor.everyday;

  return (
    <>
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header />

      <main className="site-page py-8 md:py-12">
        <div className="site-container">
          <div className="grid gap-8 2xl:grid-cols-[160px_minmax(0,1fr)_160px] 2xl:items-start">
            <aside className="hidden 2xl:block">
              <AdSlot id="left-sidebar-ad" type="sidebar" className="my-0" />
            </aside>

            <div className="min-w-0">
              <div className="mx-auto max-w-5xl space-y-7">
                <nav className="flex flex-wrap items-center gap-2 text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#94a3b8]">
                  <Link href="/" className="inline-flex items-center gap-1 transition hover:text-[#0f172a]">
                    <Home className="h-3.5 w-3.5" />
                    Home
                  </Link>
                  <span>/</span>
                  <Link href={`/${calc.category}`} className="transition hover:text-[#0f172a]">{calc.category}</Link>
                  <span>/</span>
                  <span className="text-[#0f172a]">{calc.name}</span>
                </nav>

                <section className="paper-card rounded-[2rem] p-6 md:p-9">
                  <span className={`inline-flex rounded-full px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] ${badgeColor}`}>
                    {calc.category} calculator
                  </span>
                  <h1 className="font-display mt-5 max-w-4xl text-5xl font-black leading-[0.98] tracking-tight text-[#0f172a] md:text-6xl">
                    {calc.h1}
                  </h1>
                  <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-[#475569]">
                    {calc.seoDescription}
                  </p>
                </section>

                <div className="w-full">
                  {CalculatorWidget ? (
                    <CalculatorWidget />
                  ) : (
                    <ComingSoonCalculator name={calc.name} formula={calc.formulaDescription} />
                  )}
                </div>

                <article className="paper-card rounded-[1.75rem] p-6 md:p-8">
                  <div className="content-prose max-w-none text-sm font-semibold">
                    <h2 className="font-display border-b border-[#e2e8f0] pb-4 text-3xl font-black tracking-tight text-[#0f172a]">
                      How this calculator works
                    </h2>

                    {calc.formulaDescription && (
                      <div className="my-5 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4 font-mono text-xs font-bold text-[#334155]">
                        <span className="mb-2 block text-[0.62rem] font-black uppercase tracking-[0.16em] text-[#1d4ed8]">
                          Formula model
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

                {calc.faqs.length > 0 && (
                  <section className="paper-card rounded-[1.75rem] p-6 md:p-8">
                    <h2 className="font-display border-b border-[#e2e8f0] pb-4 text-3xl font-black tracking-tight text-[#0f172a]">
                      Frequently asked questions
                    </h2>
                    <div className="mt-5 space-y-3">
                      {calc.faqs.map((faq, idx) => (
                        <details
                          key={idx}
                          className="group rounded-2xl border border-[#e2e8f0] bg-[#ffffff]/72 p-4 transition hover:border-[#2563eb]/40 [&_summary::-webkit-details-marker]:hidden"
                        >
                          <summary className="flex cursor-pointer select-none items-center justify-between gap-3 text-sm font-black text-[#0f172a]">
                            <span>{faq.question}</span>
                            <span className="shrink-0 rounded-full border border-[#e2e8f0] bg-white p-1.5 text-[#1d4ed8] transition group-open:rotate-180">
                              <ChevronDown className="h-3.5 w-3.5" />
                            </span>
                          </summary>
                          <p className="mt-3 border-t border-[#e2e8f0] pt-3 text-sm font-semibold leading-7 text-[#475569]">
                            {faq.answer}
                          </p>
                        </details>
                      ))}
                    </div>
                  </section>
                )}

                {relatedCalculators.length > 0 && (
                  <section className="space-y-4">
                    <div>
                      <p className="eyebrow">Related</p>
                      <h2 className="font-display mt-3 text-3xl font-black tracking-tight text-[#0f172a]">
                        More calculators in this workflow
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {relatedCalculators.map((rCalc) => (
                        <Link
                          key={rCalc.slug}
                          href={`/${rCalc.category}/${rCalc.slug}`}
                          className="tool-card group flex min-h-[165px] flex-col justify-between rounded-[1.35rem] p-5"
                        >
                          <div>
                            <span className={`mb-3 inline-flex rounded-full px-3 py-1 text-[0.6rem] font-black uppercase tracking-[0.14em] ${categoryBadgeColor[rCalc.category] ?? categoryBadgeColor.everyday}`}>
                              {rCalc.category}
                            </span>
                            <h3 className="font-display text-xl font-black text-[#0f172a]">{rCalc.name}</h3>
                            <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-[#475569]">
                              {rCalc.seoDescription}
                            </p>
                          </div>
                          <div className="mt-4 flex items-center justify-between text-xs font-black uppercase tracking-[0.14em] text-[#1d4ed8]">
                            <span>Compute</span>
                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>

            <aside className="hidden 2xl:block">
              <AdSlot id="right-sidebar-ad" type="sidebar" className="my-0" />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
