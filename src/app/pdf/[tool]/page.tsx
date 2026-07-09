import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { pdfTools, getPdfTool, PDF_GROUPS, PdfToolDef } from '@/config/pdfTools';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AdSlot } from '@/components/common/AdSlot';
import { pdfToolComponents, ComingSoonPdfTool } from '@/components/pdf/registry';

interface PdfToolPageProps {
  params: Promise<{ tool: string }>;
}

export function generateStaticParams() {
  return pdfTools.map((t) => ({ tool: t.slug }));
}

export async function generateMetadata({ params }: PdfToolPageProps): Promise<Metadata> {
  const { tool } = await params;
  const def = getPdfTool(tool);
  if (!def) return { title: 'PDF Tool Not Found' };

  const canonical = `https://tallywise.co/pdf/${def.slug}`;
  return {
    title: def.seoTitle,
    description: def.seoDescription,
    alternates: { canonical },
    openGraph: {
      title: def.seoTitle,
      description: def.seoDescription,
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: def.seoTitle,
      description: def.seoDescription,
    },
  };
}

export default async function PdfToolPage({ params }: PdfToolPageProps) {
  const { tool } = await params;
  const def = getPdfTool(tool);
  if (!def) notFound();

  const ToolComponent = pdfToolComponents[def.slug];

  const related = def.relatedSlugs
    .map((slug) => getPdfTool(slug))
    .filter((t): t is PdfToolDef => !!t);

  const faqSchema =
    def.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: def.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }
      : null;

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: def.name,
    description: def.seoDescription,
    url: `https://tallywise.co/pdf/${def.slug}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tallywise.co/' },
      { '@type': 'ListItem', position: 2, name: 'PDF Tools', item: 'https://tallywise.co/pdf' },
      { '@type': 'ListItem', position: 3, name: def.name, item: `https://tallywise.co/pdf/${def.slug}` },
    ],
  };

  return (
    <>
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Header />

      <main className="flex-1 bg-slate-50 py-8">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 2xl:grid-cols-[160px_minmax(0,1fr)_160px] 2xl:items-start">
            <aside className="hidden 2xl:block">
              <AdSlot id="pdf-left-ad" type="sidebar" className="my-0 shadow-xl shadow-slate-200/60" />
            </aside>

            <div className="min-w-0">
              <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  <Link href="/" className="hover:text-slate-600 transition-colors">Home</Link>
                  <span>/</span>
                  <Link href="/pdf" className="hover:text-slate-600 transition-colors">PDF Tools</Link>
                  <span>/</span>
                  <span className="text-slate-550 font-bold">{def.name}</span>
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-600 border border-rose-100">
                    {PDF_GROUPS[def.group].name} · 100% Free
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight leading-none">
                    {def.h1}
                  </h1>
                  <p className="text-sm font-medium text-slate-450">{def.tagline}</p>
                </div>

                <div className="w-full">
                  {ToolComponent ? <ToolComponent /> : <ComingSoonPdfTool name={def.name} />}
                </div>

                <article className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 space-y-6 shadow-sm">
                  <div className="prose prose-slate max-w-none prose-sm leading-relaxed prose-headings:font-extrabold prose-headings:text-slate-800 prose-h3:text-sm prose-h3:uppercase prose-h3:tracking-wide prose-h3:text-slate-400 prose-ul:list-disc prose-ul:pl-5 text-slate-600 font-medium">
                    <h2 className="text-xl md:text-2xl font-black text-slate-800 border-b border-slate-100 pb-3">
                      About the {def.name} tool
                    </h2>
                    <div dangerouslySetInnerHTML={{ __html: def.explainerHtml }} className="space-y-4" />
                  </div>
                </article>

                {def.faqs.length > 0 && (
                  <section className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
                    <h2 className="text-xl md:text-2xl font-black text-slate-800 border-b border-slate-100 pb-3">
                      Frequently Asked Questions
                    </h2>
                    <div className="space-y-3">
                      {def.faqs.map((faq, idx) => (
                        <details
                          key={idx}
                          className="group border border-slate-100 rounded-xl bg-slate-50/50 p-4 hover:border-slate-200 transition-all [&_summary::-webkit-details-marker]:hidden"
                        >
                          <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-sm font-bold text-slate-700 select-none">
                            <span>{faq.question}</span>
                            <span className="ml-1.5 shrink-0 rounded-full bg-white p-1 text-slate-400 group-open:rotate-180 transition-transform shadow-sm border border-slate-100">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3.5 w-3.5">
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

                {related.length > 0 && (
                  <section className="space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Related PDF tools</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {related.map((rt) => (
                        <Link
                          key={rt.slug}
                          href={`/pdf/${rt.slug}`}
                          className="bg-white rounded-xl p-4 border border-slate-100 hover:border-rose-500/20 hover:shadow-md transition-all flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-500 text-white mb-2 inline-block">
                              PDF
                            </span>
                            <h3 className="text-xs font-bold text-slate-750">{rt.name}</h3>
                            <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-normal font-medium">
                              {rt.tagline}
                            </p>
                          </div>
                          <div className="text-[10px] font-bold text-rose-600 mt-3 flex items-center justify-between">
                            <span>Open tool</span>
                            <span>→</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>

            <aside className="hidden 2xl:block">
              <AdSlot id="pdf-right-ad" type="sidebar" className="my-0 shadow-xl shadow-slate-200/60" />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
