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
      <main className="site-page py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <article className="paper-card rounded-[2rem] p-6 md:p-10">
            <span className="eyebrow">Policy</span>
            <h1 className="font-display mt-5 text-5xl font-black tracking-tight text-[#241c17]">Privacy Policy</h1>
            <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-[#8f8170]">Last updated: July 8, 2026</p>

            <div className="content-prose mt-8 space-y-5 border-t border-[#dacbb3] pt-8 text-sm font-semibold">
              <p>At Tallywise.co, accessible from https://tallywise.co, one of our main priorities is visitor privacy. This Privacy Policy describes types of information collected and recorded by Tallywise.co and how we use it.</p>

              <h2 className="font-display text-2xl font-black">Log files</h2>
              <p>Tallywise.co follows a standard procedure of using log files. These files log visitors when they visit websites. The information can include internet protocol addresses, browser type, Internet Service Provider, date and time stamp, referring or exit pages, and possibly the number of clicks. These are not linked to personally identifiable information.</p>

              <h2 className="font-display text-2xl font-black">Google DoubleClick DART cookie</h2>
              <p>Google is one third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads based upon visits to our site and other sites on the internet. Visitors may choose to decline DART cookies by visiting the Google ad and content network Privacy Policy.</p>

              <h2 className="font-display text-2xl font-black">Advertising partners</h2>
              <p>Third-party ad servers or ad networks use technologies like cookies, JavaScript, or web beacons in advertisements and links that appear on Tallywise.co. These are sent directly to users&apos; browsers and may automatically receive your IP address. These technologies measure advertising effectiveness and personalize advertising content.</p>
              <p>Tallywise.co has no access to or control over cookies used by third-party advertisers.</p>

              <h2 className="font-display text-2xl font-black">Third-party policies</h2>
              <p>Tallywise.co&apos;s Privacy Policy does not apply to other advertisers or websites. Consult the respective Privacy Policies of third-party ad servers for more detailed information.</p>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
