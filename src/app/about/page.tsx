import React from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Tallywise.co',
  description: 'Learn about Tallywise.co, our mission to build fast, private, accessible calculators and PDF tools that run in your browser.',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="site-page py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <article className="paper-card rounded-[2rem] p-6 md:p-10">
            <span className="eyebrow">Our mission</span>
            <h1 className="font-display mt-5 text-5xl font-black leading-[0.98] tracking-tight text-[#241c17] md:text-6xl">
              Tools should feel calm, fast, and trustworthy.
            </h1>
            <p className="mt-5 text-base font-semibold leading-8 text-[#6f6459] md:text-lg">
              Tallywise builds zero-friction browser tools for the work people do every day: calculate numbers,
              clean up PDFs, convert files, and get on with life.
            </p>

            <div className="content-prose mt-8 space-y-6 border-t border-[#dacbb3] pt-8 text-sm font-semibold">
              <h2 className="font-display text-3xl font-black">Why Tallywise?</h2>
              <p>
                Most online utility sites are cluttered with heavy scripts, upload gates, confusing paywalls, and
                noisy workflows. We believe everyday tools should be instant, mobile-first, and clear enough to trust.
              </p>
              <p>
                Our calculators are built around practical formulas and clear inputs. Our PDF tools run locally in
                your browser whenever possible, so documents can be merged, compressed, converted, signed, or edited
                without handing private files to a server.
              </p>

              <h2 className="font-display text-3xl font-black">Core principles</h2>
              <ul className="grid gap-3 pl-0 md:grid-cols-3">
                {[
                  ['Instant execution', 'Open the tool and use it. No account wall, no fake waiting room.'],
                  ['Privacy first', 'Sensitive document work should happen locally whenever the browser can handle it.'],
                  ['Human formatting', 'Results and workflows should be readable on phones, tablets, and desktops.'],
                ].map(([title, text]) => (
                  <li key={title} className="list-none rounded-2xl border border-[#dacbb3] bg-[#fffaf0]/75 p-4">
                    <strong className="block text-[#241c17]">{title}</strong>
                    <span className="mt-2 block text-sm leading-6 text-[#6f6459]">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
