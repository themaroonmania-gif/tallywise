import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ChevronDown, FileText, Home, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';
import { pdfTools, getPdfTool, PDF_GROUPS, PdfToolDef } from '@/config/pdfTools';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AdSlot } from '@/components/common/AdSlot';
import { pdfToolComponents, ComingSoonPdfTool } from '@/components/pdf/registry';

interface PdfToolPageProps {
  params: Promise<{ tool: string }>;
}

const groupBadge: Record<string, string> = {
  organize: 'bg-[#4338ca] text-white',
  optimize: 'bg-[#0f766e] text-white',
  convert: 'bg-[#2563eb] text-white',
  edit: 'bg-[#be123c] text-white',
  security: 'bg-[#0f766e] text-white',
};

export function generateStaticParams() {
  return pdfTools.map((tool) => ({ tool: tool.slug }));
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
    .filter((item): item is PdfToolDef => !!item);

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

      <main className="site-page py-8 md:py-12">
        <div className="site-container">
          <div className="grid gap-8 2xl:grid-cols-[160px_minmax(0,1fr)_160px] 2xl:items-start">
            <aside className="hidden 2xl:block">
              <AdSlot id="pdf-left-ad" type="sidebar" className="my-0" />
            </aside>

            <div className="min-w-0">
              <div className="mx-auto max-w-5xl space-y-7">
                <nav className="flex flex-wrap items-center gap-2 text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#94a3b8]">
                  <Link href="/" className="inline-flex items-center gap-1 transition hover:text-[#0f172a]">
                    <Home className="h-3.5 w-3.5" />
                    Home
                  </Link>
                  <span>/</span>
                  <Link href="/pdf" className="transition hover:text-[#0f172a]">PDF Studio</Link>
                  <span>/</span>
                  <span className="text-[#0f172a]">{def.name}</span>
                </nav>

                <section className="paper-card overflow-hidden rounded-[2rem] p-6 md:p-9">
                  <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                    <div>
                      <span className={`inline-flex rounded-full px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] ${groupBadge[def.group] ?? groupBadge.edit}`}>
                        {PDF_GROUPS[def.group].name} - free
                      </span>
                      <h1 className="font-display mt-5 max-w-4xl text-5xl font-black leading-[0.98] tracking-tight text-[#0f172a] md:text-6xl">
                        {def.h1}
                      </h1>
                      <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-[#475569]">{def.tagline}</p>
                    </div>
                    <div className="rounded-2xl border border-[#e2e8f0] bg-[#ffffff]/80 p-4 text-sm font-semibold leading-6 text-[#475569] lg:max-w-xs">
                      <ShieldCheck className="mb-3 h-5 w-5 text-[#0f766e]" />
                      Files are processed in the browser whenever possible. No account needed.
                    </div>
                  </div>
                </section>

                <div className="w-full">
                  {ToolComponent ? <ToolComponent /> : <ComingSoonPdfTool name={def.name} />}
                </div>

                <article className="paper-card rounded-[1.75rem] p-6 md:p-8">
                  <div className="content-prose max-w-none text-sm font-semibold">
                    <h2 className="font-display border-b border-[#e2e8f0] pb-4 text-3xl font-black tracking-tight text-[#0f172a]">
                      About this tool
                    </h2>
                    <div dangerouslySetInnerHTML={{ __html: def.explainerHtml }} className="space-y-4" />
                  </div>
                </article>

                {def.faqs.length > 0 && (
                  <section className="paper-card rounded-[1.75rem] p-6 md:p-8">
                    <h2 className="font-display border-b border-[#e2e8f0] pb-4 text-3xl font-black tracking-tight text-[#0f172a]">
                      Frequently asked questions
                    </h2>
                    <div className="mt-5 space-y-3">
                      {def.faqs.map((faq, idx) => (
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

                {related.length > 0 && (
                  <section className="space-y-4">
                    <div>
                      <p className="eyebrow">Related</p>
                      <h2 className="font-display mt-3 text-3xl font-black tracking-tight text-[#0f172a]">
                        Keep working with these PDF tools
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {related.map((relatedTool) => (
                        <Link
                          key={relatedTool.slug}
                          href={`/pdf/${relatedTool.slug}`}
                          className="tool-card group flex min-h-[165px] flex-col justify-between rounded-[1.35rem] p-5"
                        >
                          <div>
                            <span className="mb-3 inline-flex rounded-full bg-[#be123c] px-3 py-1 text-[0.6rem] font-black uppercase tracking-[0.14em] text-white">
                              PDF
                            </span>
                            <h3 className="font-display text-xl font-black text-[#0f172a]">{relatedTool.name}</h3>
                            <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-[#475569]">
                              {relatedTool.tagline}
                            </p>
                          </div>
                          <div className="mt-4 flex items-center justify-between text-xs font-black uppercase tracking-[0.14em] text-[#1d4ed8]">
                            <span>Open tool</span>
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
              <AdSlot id="pdf-right-ad" type="sidebar" className="my-0" />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
