'use client';

import React, { useEffect, useState } from 'react';
import { ShellSelect, ResultCard } from '../CalculatorShell';
import { HealthDisclaimer } from './HealthDisclaimer';

const DAY_MS = 24 * 60 * 60 * 1000;

type Mode = 'lmp' | 'dueDate';

export function ConceptionDateCalculator() {
  const [mode, setMode] = useState<Mode>('lmp');
  const [dateStr, setDateStr] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [conceptionStr, setConceptionStr] = useState<string>('');

  useEffect(() => {
    if (!dateStr) return;
    const date = new Date(dateStr + 'T00:00:00');
    if (isNaN(date.getTime())) return;

    const conceptionDate =
      mode === 'lmp'
        ? new Date(date.getTime() + 14 * DAY_MS)
        : new Date(date.getTime() - 266 * DAY_MS); // 38 weeks before due date

    setConceptionStr(
      conceptionDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    );
  }, [mode, dateStr]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Enter Your Details</h2>
          <ShellSelect label="Calculate From" value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
            <option value="lmp">First Day of Last Period</option>
            <option value="dueDate">Estimated Due Date</option>
          </ShellSelect>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              {mode === 'lmp' ? 'First Day of Last Period' : 'Estimated Due Date'}
            </label>
            <input
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800 bg-white"
            />
          </div>
        </div>

        <div className="md:col-span-6 flex flex-col justify-between">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Estimated Conception</h2>
            <ResultCard label="Approximate Conception Date" value={conceptionStr} color="rose" />
            <p className="text-sm text-slate-600">
              This is a rough estimate only. Actual conception can vary by several days depending on individual cycle length and ovulation timing.
            </p>
            <HealthDisclaimer />
          </div>
        </div>
      </div>
    </div>
  );
}
