import React from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Tallywise',
  description: 'Tallywise Privacy Policy - Learn about how we handle user data and privacy.',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 bg-white border border-slate-105 rounded-3xl p-8 md:p-12 shadow-sm space-y-6">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Privacy Policy</h1>
          <p className="text-slate-400 text-xs font-semibold">Last Updated: July 8, 2026</p>
          
          <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-4 font-medium">
            <p>At Tallywise.co, accessible from https://tallywise.co, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Tallywise.co and how we use it.</p>
            
            <h2 className="text-lg font-bold text-slate-700 pt-4">Log Files</h2>
            <p>Tallywise.co follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.</p>

            <h2 className="text-lg font-bold text-slate-700 pt-4">Google DoubleClick DART Cookie</h2>
            <p>Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy.</p>

            <h2 className="text-lg font-bold text-slate-700 pt-4">Advertising Partners Privacy Policies</h2>
            <p>Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Tallywise.co, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p>
            <p>Note that Tallywise.co has no access to or control over these cookies that are used by third-party advertisers.</p>
            
            <h2 className="text-lg font-bold text-slate-700 pt-4">Third Party Privacy Policies</h2>
            <p>Tallywise.co's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
