import React from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Tallywise',
  description: 'Tallywise Terms of Service - Review terms of usage for our calculators.',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 bg-white border border-slate-105 rounded-3xl p-8 md:p-12 shadow-sm space-y-6">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Terms of Service</h1>
          <p className="text-slate-400 text-xs font-semibold">Last Updated: July 8, 2026</p>
          
          <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-4 font-medium">
            <p>Welcome to Tallywise.co! By accessing this website, you agree to comply with and be bound by the following terms and conditions of use.</p>
            
            <h2 className="text-lg font-bold text-slate-700 pt-4">Disclaimer of Warranties</h2>
            <p>The calculators, tools, and content provided on Tallywise.co are for general informational purposes only. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the mathematical calculations, outputs, or advice contained herein.</p>

            <h2 className="text-lg font-bold text-slate-700 pt-4">Limitation of Liability</h2>
            <p>In no event will Tallywise.co, its owners, or developers be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.</p>

            <h2 className="text-lg font-bold text-slate-700 pt-4">Use License</h2>
            <p>Permission is granted to temporarily access and run calculations using the tools on Tallywise.co for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
