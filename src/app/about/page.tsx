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
      <main className="flex-1 bg-slate-50 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                Our Mission
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight mt-2">
                About Tallywise
              </h1>
              <p className="text-slate-500 text-md font-medium leading-relaxed">
                Tallywise.co builds fast, private, zero-friction browser tools for the work people do every day: calculate numbers, clean up PDFs, convert files, and get on with life.
              </p>
            </div>

            <div className="border-t border-slate-100 pt-8 space-y-6 text-slate-600 font-medium leading-relaxed">
              <h2 className="text-xl font-bold text-slate-800">Why Tallywise?</h2>
              <p>
                Most online utility sites are cluttered with heavy scripts, upload gates, confusing paywalls, and noisy workflows. We believe everyday tools should be instant, mobile-first, and clear enough to trust.
              </p>
              <p>
                Our calculators are calibrated against verified formulas and practical reference standards. Our PDF tools run locally in your browser so documents can be merged, compressed, converted, signed, or edited without uploading private files to a server.
              </p>

              <h2 className="text-xl font-bold text-slate-800">Our Core Principles</h2>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong className="text-slate-800">Instant Execution:</strong> Tools run directly in the browser wherever possible, with no waiting on an upload queue.
                </li>
                <li>
                  <strong className="text-slate-800">Privacy First:</strong> Your numbers and PDF files are processed locally on your device. We do not store or sell private tool inputs.
                </li>
                <li>
                  <strong className="text-slate-800">Accessibility:</strong> Fully responsive CSS layout designs that scale flawlessly to fit smartphones, tablets, and desktop displays alike.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
