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
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#10243e] text-[#76a7ff] shadow-xl shadow-slate-900/10">
              <Mail className="h-7 w-7" />
            </div>

            <span className="eyebrow mt-6">Contact</span>
            <h1 className="font-display mt-5 text-4xl font-black tracking-tight text-[#10243e] md:text-5xl">
              Contact Tallywise
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm font-semibold leading-7 text-[#52677f]">
              Your mail app should open automatically. You can also email{' '}
              <span className="font-black text-[#10243e]">{email}</span>.
            </p>

            <div className="mt-8 border-t border-[#d6e0ec] pt-6">
              <p className="mb-4 text-xs font-bold text-[#8292a6]">
                If nothing opened, use the button below.
              </p>
              <a
                href={`mailto:${email}?subject=Inquiry%20from%20Tallywise.co`}
                className="inline-flex items-center justify-center rounded-xl bg-[#1463ff] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-white shadow-xl shadow-[#1463ff]/20 transition hover:-translate-y-0.5 hover:bg-[#0f52d4]"
              >
                Email Tallywise
              </a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
