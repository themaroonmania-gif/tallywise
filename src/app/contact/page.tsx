'use client';

import React, { useEffect } from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

export default function ContactPage() {
  const email = 'hello@tallywise.co';

  useEffect(() => {
    // Automatically trigger mail client on mount
    window.location.href = `mailto:${email}?subject=Inquiry%20from%20Tallywise.co`;
  }, [email]);

  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50 py-12">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm space-y-6">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 17.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Opening Mail Client...</h1>
              <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                We are launching your default mail program to send a message to <span className="font-bold text-slate-700">{email}</span>.
              </p>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <p className="text-xs text-slate-400 mb-4">
                Did your browser block the automatic popup? Click the button below instead:
              </p>
              <a
                href={`mailto:${email}?subject=Inquiry%20from%20Tallywise.co`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-95"
              >
                Send Email Directly
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
