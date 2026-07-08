'use client';

import React, { useEffect, useState } from 'react';
import { ShellInput, ResultCard } from '../CalculatorShell';
import { HealthDisclaimer } from './HealthDisclaimer';

const DAY_MS = 24 * 60 * 60 * 1000;

export function OvulationCalculator() {
  const [lmpDateStr, setLmpDateStr] = useState<string>(() => {
    const today = new Date();
    today.setDate(today.getDate() - 14);
    return today.toISOString().split('T')[0];
  });
  const [cycleLength, setCycleLength] = useState<number>(28);

  const [results, setResults] = useState({
    ovulationDateStr: '',
    fertileStartStr: '',
    fertileEndStr: '',
    nextPeriodStr: '',
  });

  useEffect(() => {
    if (!lmpDateStr || cycleLength <= 0) return;
    const lmpDate = new Date(lmpDateStr + 'T00:00:00');
    if (isNaN(lmpDate.getTime())) return;

    const nextPeriod = new Date(lmpDate.getTime() + cycleLength * DAY_MS);
    const ovulationDate = new Date(nextPeriod.getTime() - 14 * DAY_MS);
    const fertileStart = new Date(ovulationDate.getTime() - 5 * DAY_MS);
    const fertileEnd = ovulationDate;

    const formatDate = (date: Date) =>
      date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });

    setResults({
      ovulationDateStr: formatDate(ovulationDate),
      fertileStartStr: formatDate(fertileStart),
      fertileEndStr: formatDate(fertileEnd),
      nextPeriodStr: formatDate(nextPeriod),
    });
  }, [lmpDateStr, cycleLength]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Enter Cycle Details</h2>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">First Day of Last Period</label>
            <input
              type="date"
              value={lmpDateStr}
              onChange={(e) => setLmpDateStr(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800 bg-white"
            />
          </div>
          <ShellInput label="Average Cycle Length" suffix="days" value={cycleLength} onChange={(e) => setCycleLength(Number(e.target.value))} />
        </div>

        <div className="md:col-span-6 flex flex-col justify-between">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Fertility Estimate</h2>
            <ResultCard label="Estimated Ovulation Date" value={results.ovulationDateStr} color="rose" />
            <div className="space-y-2 text-sm font-semibold text-slate-700">
              <div className="flex justify-between items-center">
                <span>Fertile Window</span>
                <span className="text-right text-xs">{results.fertileStartStr} – {results.fertileEndStr}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Next Period Estimate</span>
                <span>{results.nextPeriodStr}</span>
              </div>
            </div>
            <HealthDisclaimer />
          </div>
        </div>
      </div>
    </div>
  );
}
