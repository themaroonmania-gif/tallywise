'use client';

import React, { useEffect, useState } from 'react';
import { ShellInput, ResultCard } from '../CalculatorShell';
import { HealthDisclaimer } from './HealthDisclaimer';

const DAY_MS = 24 * 60 * 60 * 1000;

interface CycleInfo {
  periodStart: string;
  ovulationWindow: string;
}

export function MenstrualCycleCalculator() {
  const [lmpDateStr, setLmpDateStr] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [periodLength, setPeriodLength] = useState<number>(5);
  const [cycles, setCycles] = useState<CycleInfo[]>([]);

  useEffect(() => {
    if (!lmpDateStr || cycleLength <= 0) return;
    const lmpDate = new Date(lmpDateStr + 'T00:00:00');
    if (isNaN(lmpDate.getTime())) return;

    const formatDate = (date: Date) =>
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const results: CycleInfo[] = [];
    for (let i = 1; i <= 3; i++) {
      const periodStart = new Date(lmpDate.getTime() + cycleLength * i * DAY_MS);
      const ovulationDate = new Date(periodStart.getTime() - 14 * DAY_MS);
      const fertileStart = new Date(ovulationDate.getTime() - 5 * DAY_MS);
      results.push({
        periodStart: formatDate(periodStart),
        ovulationWindow: `${formatDate(fertileStart)} – ${formatDate(ovulationDate)}`,
      });
    }
    setCycles(results);
  }, [lmpDateStr, cycleLength, periodLength]);

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
          <ShellInput label="Average Period Length" suffix="days" value={periodLength} onChange={(e) => setPeriodLength(Number(e.target.value))} />
        </div>

        <div className="md:col-span-6 flex flex-col justify-between">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Next 3 Predicted Cycles</h2>
            {cycles[0] && <ResultCard label="Next Period Start" value={cycles[0].periodStart} color="rose" />}
            <div className="space-y-3 text-sm font-semibold text-slate-700">
              {cycles.map((c, idx) => (
                <div key={idx} className="flex justify-between items-center border-t border-slate-200 pt-2 first:border-t-0 first:pt-0">
                  <span>Cycle {idx + 1}: {c.periodStart}</span>
                  <span className="text-xs text-slate-500">Fertile: {c.ovulationWindow}</span>
                </div>
              ))}
            </div>
            <HealthDisclaimer />
          </div>
        </div>
      </div>
    </div>
  );
}
