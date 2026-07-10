'use client';

import React, { useEffect } from 'react';
import { Mail } from 'lucide-react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

export default function ContactPage() {
  const email = 'hello@tallywise.co';

  useEffect(() => {
    window.location.href = `mailto:${email}?subject=Inquiry%20from%20Tallywise.co`;
  }, [email]);

  return (
    <>
      <Header />
      <main className="site-page py-10 md:py-14">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <section className="paper-card rounded-[2rem] p-6 text-center md:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#1b2a2f] text-[#f2c879] shadow-xl shadow-slate-900/10">
              <Mail className="h-7 w-7" />
            </div>

            <span className="eyebrow mt-6">Contact</span>
            <h1 className="font-display mt-5 text-4xl font-black tracking-tight text-[#241c17] md:text-5xl">
              Opening your mail app.
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm font-semibold leading-7 text-[#6f6459]">
              We are launching your default mail program to send a message to{' '}
              <span className="font-black text-[#241c17]">{email}</span>.
            </p>

            <div className="mt-8 border-t border-[#dacbb3] pt-6">
              <p className="mb-4 text-xs font-bold text-[#8f8170]">
                If your browser blocked the automatic handoff, use this button instead.
              </p>
              <a
                href={`mailto:${email}?subject=Inquiry%20from%20Tallywise.co`}
                className="inline-flex items-center justify-center rounded-2xl bg-[#1b2a2f] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#f6efe1] shadow-xl shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-[#26383f]"
              >
                Send email directly
              </a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
