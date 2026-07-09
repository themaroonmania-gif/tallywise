'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-100 bg-slate-50 py-12 text-slate-500 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-8">
          
          {/* Logo and Pitch */}
          <div className="space-y-4">
            <span className="font-extrabold text-sm tracking-tight text-slate-800">
              Tally<span className="text-indigo-650 bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">wise</span>
            </span>
            <p className="text-slate-400 leading-relaxed font-medium">
              Free, private, in-browser tools for everyday life: calculators for finance, health, and school, plus a full suite of PDF tools. No accounts, no uploads, zero friction.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-4">Calculators</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/finance" className="hover:text-slate-800 transition-colors">Finance Calculators</Link>
              </li>
              <li>
                <Link href="/health" className="hover:text-slate-800 transition-colors">Health & Fitness</Link>
              </li>
              <li>
                <Link href="/school" className="hover:text-slate-800 transition-colors">Academic Grading</Link>
              </li>
              <li>
                <Link href="/everyday" className="hover:text-slate-800 transition-colors">Everyday Utilities</Link>
              </li>
              <li>
                <Link href="/conversion" className="hover:text-slate-800 transition-colors">Unit Conversion</Link>
              </li>
            </ul>
          </div>

          {/* PDF Tools */}
          <div>
            <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-4">PDF Tools</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/pdf" className="hover:text-slate-800 transition-colors">All PDF Tools</Link>
              </li>
              <li>
                <Link href="/pdf/merge-pdf" className="hover:text-slate-800 transition-colors">Merge PDF</Link>
              </li>
              <li>
                <Link href="/pdf/split-pdf" className="hover:text-slate-800 transition-colors">Split PDF</Link>
              </li>
              <li>
                <Link href="/pdf/compress-pdf" className="hover:text-slate-800 transition-colors">Compress PDF</Link>
              </li>
              <li>
                <Link href="/pdf/edit-pdf" className="hover:text-slate-800 transition-colors">Edit PDF</Link>
              </li>
            </ul>
          </div>

          {/* Legal / Pages */}
          <div>
            <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-4">Information</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/about" className="hover:text-slate-800 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-slate-800 transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-slate-800 transition-colors">Sitemap</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-slate-800 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-slate-800 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-slate-800 transition-colors">Disclaimer</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Warning to limit liability on calcs */}
        <div className="border-t border-slate-200/60 pt-6 text-[10px] text-slate-400 font-medium leading-relaxed mb-6">
          <strong>Disclaimer:</strong> All calculations provided by Tallywise.co are for informational and educational purposes only. Results are estimates based on simplified formulas and should not be construed as professional financial, tax, mortgage, clinical, or academic counseling. Always consult with certified professionals before making final financial, real estate, or health decisions.
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
          <span>&copy; {currentYear} Tallywise.co. All Rights Reserved.</span>
          <span className="mt-2 sm:mt-0">Built for ultimate speed and accuracy.</span>
        </div>
      </div>
    </footer>
  );
}
