import React from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Tallywise',
  description: 'Tallywise Terms of Service - Review terms of usage for our calculators and PDF tools.',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="site-page py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <article className="paper-card rounded-[2rem] p-6 md:p-10">
            <span className="eyebrow">Terms</span>
            <h1 className="font-display mt-5 text-5xl font-black tracking-tight text-[#241c17]">Terms of Service</h1>
            <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-[#8f8170]">Last updated: July 8, 2026</p>

            <div className="content-prose mt-8 space-y-5 border-t border-[#dacbb3] pt-8 text-sm font-semibold">
              <p>Welcome to Tallywise.co. By accessing this website, you agree to comply with and be bound by these terms and conditions of use.</p>

              <h2 className="font-display text-2xl font-black">Disclaimer of warranties</h2>
              <p>The calculators, tools, and content provided on Tallywise.co are for general informational purposes only. We make no representations or warranties of any kind, express or implied, about completeness, accuracy, reliability, suitability, or availability of calculations, outputs, or advice.</p>

              <h2 className="font-display text-2xl font-black">Limitation of liability</h2>
              <p>In no event will Tallywise.co, its owners, or developers be liable for loss or damage including, without limitation, indirect or consequential loss or damage, or any loss or damage arising from loss of data or profits in connection with use of this website.</p>

              <h2 className="font-display text-2xl font-black">Use license</h2>
              <p>Permission is granted to temporarily access and run calculations or document tools on Tallywise.co for personal, non-commercial transitory viewing only. This is a license grant, not a transfer of title.</p>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
