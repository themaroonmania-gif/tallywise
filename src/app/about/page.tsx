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
            <span className="eyebrow">About Tallywise</span>
            <h1 className="font-display mt-5 text-5xl font-black leading-[0.98] tracking-tight text-[#10243e] md:text-6xl">
              Useful tools should be easy to verify and easy to use.
            </h1>
            <p className="mt-5 text-base font-semibold leading-8 text-[#52677f] md:text-lg">
              Tallywise brings PDF editing, file conversion, and practical calculators into one clear website. Most
              tasks run directly in your browser and do not require an account.
            </p>

            <div className="content-prose mt-8 space-y-6 border-t border-[#d6e0ec] pt-8 text-sm font-semibold">
              <h2 className="font-display text-3xl font-black">Why Tallywise?</h2>
              <p>
                Many simple online tasks are buried behind account screens, unclear limits, and unnecessary uploads.
                We build each Tallywise tool around a direct input, a visible result, and plain explanations.
              </p>
              <p>
                Our calculators are built around practical formulas and clear inputs. Our PDF tools run locally in
                your browser whenever possible, so documents can be merged, compressed, converted, signed, or edited
                without handing private files to a server.
              </p>

              <h2 className="font-display text-3xl font-black">Core principles</h2>
              <ul className="grid gap-3 pl-0 md:grid-cols-3">
                {[
                  ['Direct', 'Open a tool and use it without creating an account first.'],
                  ['Private', 'PDF work runs on your device instead of being sent to our server.'],
                  ['Clear', 'Inputs, results, formulas, and limitations are written in plain language.'],
                ].map(([title, text]) => (
                  <li key={title} className="list-none rounded-xl border border-[#d6e0ec] bg-[#f6f9fd] p-4">
                    <strong className="block text-[#10243e]">{title}</strong>
                    <span className="mt-2 block text-sm leading-6 text-[#52677f]">{text}</span>
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
