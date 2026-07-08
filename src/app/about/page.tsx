import React from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Tallywise.co',
  description: 'Learn about Tallywise.co, our mission to build fast, accurate, and accessible online calculators, and how we help users make data-driven decisions.',
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
                Tallywise.co was founded with a singular, clear goal: to build the web's fastest, most accurate, and zero-friction suite of interactive calculations. 
              </p>
            </div>

            <div className="border-t border-slate-100 pt-8 space-y-6 text-slate-600 font-medium leading-relaxed">
              <h2 className="text-xl font-bold text-slate-800">Why Tallywise?</h2>
              <p>
                Most online calculators are cluttered with heavy, slow script files, flashing ad layouts, complex registration barriers, or inaccurate formulas. We believe calculations should be instantaneous, mobile-first, and highly reliable.
              </p>
              <p>
                Our team calibrates every single tool against verified mathematical standards, federal/state tax brackets, obstetric guidelines, and athletic health models. Whether you are checking your paycheck withholdings, estimating your mortgage amortization, curving academic grades, or tracking your body fat index, we compute your results in under a millisecond directly inside your browser.
              </p>

              <h2 className="text-xl font-bold text-slate-800">Our Core Principles</h2>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong className="text-slate-800">Instant Execution:</strong> Zero server dependencies per request. Calculations compute instantly client-side using validated React states.
                </li>
                <li>
                  <strong className="text-slate-800">Privacy First:</strong> Your inputs are processed locally on your device. We do not store, track, or sell your private calculation data.
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
