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
      <main className="flex-1 bg-slate-50 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 bg-white border border-slate-105 rounded-3xl p-8 md:p-12 shadow-sm space-y-6">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">General Disclaimer</h1>
          <p className="text-slate-400 text-xs font-semibold">Last Updated: July 8, 2026</p>
          
          <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-4 font-medium">
            <p>The calculators and estimators on Tallywise.co are provided as self-help tools for your independent use and are not intended to provide professional advice.</p>
            
            <h2 className="text-lg font-bold text-slate-700 pt-4">No Financial or Legal Advice</h2>
            <p>Calculations, amortization charts, tax rates, and payroll deductions shown on these pages are simplified models and estimations. They do not account for all potential local taxes, deductions, individual credit histories, health circumstances, or academic syllabus specifications. We do not guarantee their financial, legal, or mathematical accuracy.</p>

            <h2 className="text-lg font-bold text-slate-700 pt-4">No Clinical/Medical Advice</h2>
            <p>BMI calculators and TDEE calorie projections are screening guidelines based on population averages. They are not clinical diagnostic tools. Consult with certified primary care physicians or dieticians before starting a weight loss, weight gain, or hydration regimen.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
