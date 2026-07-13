import React from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer - Tallywise',
  description: 'Tallywise General Calculator Liability Disclaimer - Read this before applying results.',
};

export default function DisclaimerPage() {
  return (
    <>
      <Header />
      <main className="site-page py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <article className="paper-card rounded-[2rem] p-6 md:p-10">
            <span className="eyebrow">Disclaimer</span>
            <h1 className="font-display mt-5 text-5xl font-black tracking-tight text-[#10243e]">General Disclaimer</h1>
            <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-[#8292a6]">Last updated: July 8, 2026</p>

            <div className="content-prose mt-8 space-y-5 border-t border-[#d6e0ec] pt-8 text-sm font-semibold">
              <p>The calculators and estimators on Tallywise.co are provided as self-help tools for independent use and are not intended to provide professional advice.</p>

              <h2 className="font-display text-2xl font-black">No financial or legal advice</h2>
              <p>Calculations, amortization charts, tax rates, and payroll deductions shown on these pages are simplified models and estimations. They do not account for all local taxes, deductions, individual credit histories, health circumstances, or academic syllabus specifications. We do not guarantee financial, legal, or mathematical accuracy.</p>

              <h2 className="font-display text-2xl font-black">No clinical or medical advice</h2>
              <p>BMI calculators and TDEE calorie projections are screening guidelines based on population averages. They are not clinical diagnostic tools. Consult with certified primary care physicians or dieticians before starting a weight loss, weight gain, or hydration regimen.</p>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
