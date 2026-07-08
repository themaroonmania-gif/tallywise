'use client';

import React from 'react';

interface CalculatorShellProps {
  title?: string;
  inputs: React.ReactNode;
  results: React.ReactNode;
}

export function CalculatorShell({ title, inputs, results }: CalculatorShellProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">
            {title ?? 'Enter Values'}
          </h2>
          {inputs}
        </div>

        <div className="md:col-span-6 flex flex-col justify-between">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-slate-800">Result</h2>
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-600 border border-teal-200">
                Live
              </span>
            </div>
            {results}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShellInput({
  label,
  suffix,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; suffix?: string }) {
  return (
    <div>
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          {...props}
          className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-semibold text-slate-800 bg-white transition-all hover:border-slate-300"
        />
        {suffix && (
          <span className="absolute right-4 top-3 text-slate-400 font-medium text-sm">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export function ShellSelect({
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <div>
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
        {label}
      </label>
      <select
        {...props}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-semibold text-slate-800 bg-white transition-all hover:border-slate-300"
      >
        {children}
      </select>
    </div>
  );
}

const RESULT_CARD_COLORS: Record<string, string> = {
  teal: 'bg-teal-600 shadow-teal-600/10',
  emerald: 'bg-emerald-600 shadow-emerald-600/10',
  indigo: 'bg-indigo-600 shadow-indigo-600/10',
  rose: 'bg-rose-600 shadow-rose-600/10',
  amber: 'bg-amber-600 shadow-amber-600/10',
};

export function ResultCard({
  label,
  value,
  color = 'teal',
}: {
  label: string;
  value: React.ReactNode;
  color?: string;
}) {
  const colorClass = RESULT_CARD_COLORS[color] ?? RESULT_CARD_COLORS.teal;
  return (
    <div className={`${colorClass} text-white rounded-xl p-6 text-center shadow-md`}>
      <span className="text-xs font-bold uppercase tracking-wider opacity-85 block mb-1">
        {label}
      </span>
      <div className="text-3xl font-extrabold tracking-tight break-all">{value}</div>
    </div>
  );
}
