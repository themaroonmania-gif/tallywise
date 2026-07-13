'use client';

import React from 'react';

interface CalculatorShellProps {
  title?: string;
  inputs: React.ReactNode;
  results: React.ReactNode;
}

export function CalculatorShell({ title, inputs, results }: CalculatorShellProps) {
  return (
    <div className="paper-card rounded-[1.75rem] p-4 md:p-7">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-6 space-y-6">
          <h2 className="font-display border-b border-[#d6e0ec] pb-3 text-2xl font-black tracking-tight text-[#10243e]">
            {title ?? 'Enter Values'}
          </h2>
          {inputs}
        </div>

        <div className="md:col-span-6 flex flex-col justify-between">
          <div className="rounded-[1.25rem] border border-[#d6e0ec] bg-[#f6f9fd] p-5 shadow-inner shadow-[#10243e]/5 md:p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#d6e0ec] pb-3">
              <h2 className="font-display text-2xl font-black text-[#10243e]">Result</h2>
              <span className="rounded-full border border-[#0f766e]/20 bg-[#0f766e]/10 px-2.5 py-1 text-[0.62rem] font-black uppercase tracking-[0.16em] text-[#0f766e]">
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
      <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-[#52677f]">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          {...props}
          className="soft-input w-full rounded-xl px-4 py-3 pr-12 font-bold transition hover:border-[#1463ff]/40"
        />
        {suffix && (
          <span className="absolute right-4 top-3.5 text-sm font-bold text-[#8292a6]">
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
      <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-[#52677f]">
        {label}
      </label>
      <select
        {...props}
        className="soft-input w-full rounded-xl px-4 py-3 font-bold transition hover:border-[#1463ff]/40"
      >
        {children}
      </select>
    </div>
  );
}

const RESULT_CARD_COLORS: Record<string, string> = {
  teal: 'bg-[#0f766e] shadow-[#0f766e]/15',
  emerald: 'bg-[#0f766e] shadow-[#0f766e]/15',
  indigo: 'bg-[#4338ca] shadow-[#4338ca]/15',
  rose: 'bg-[#be123c] shadow-[#be123c]/15',
  amber: 'bg-[#1463ff] shadow-[#1463ff]/15',
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
    <div className={`${colorClass} rounded-[1.35rem] p-6 text-center text-white shadow-xl`}>
      <span className="mb-1 block text-xs font-black uppercase tracking-[0.16em] opacity-85">
        {label}
      </span>
      <div className="font-display break-all text-4xl font-black tracking-tight">{value}</div>
    </div>
  );
}
