'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorShell, ResultCard } from './CalculatorShell';
import { HealthDisclaimer } from './health/HealthDisclaimer';

export function PregnancyCalculator() {
  const [lmpDateStr, setLmpDateStr] = useState<string>(() => {
    const today = new Date();
    // Default to 12 weeks ago
    today.setDate(today.getDate() - 84);
    return today.toISOString().split('T')[0];
  });

  const [results, setResults] = useState({
    dueDateStr: '',
    conceptionDateStr: '',
    weeksProgress: 0,
    daysProgress: 0,
    trimester: 1,
    daysRemaining: 0,
  });

  useEffect(() => {
    if (!lmpDateStr) return;

    const lmpDate = new Date(lmpDateStr + 'T00:00:00');
    if (isNaN(lmpDate.getTime())) return;

    const today = new Date();

    // Naegele's Rule: LMP + 280 days (40 weeks)
    const dueDate = new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000);

    // Estimated Conception: LMP + 14 days
    const conceptionDate = new Date(lmpDate.getTime() + 14 * 24 * 60 * 60 * 1000);

    // Gestational age in days
    const diffTime = Math.max(0, today.getTime() - lmpDate.getTime());
    const totalDaysProgress = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const weeksProgress = Math.floor(totalDaysProgress / 7);
    const daysProgress = totalDaysProgress % 7;

    const daysRemaining = Math.max(0, Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    // Trimesters: 1st (0-13 weeks), 2nd (14-27 weeks), 3rd (28+ weeks) - consistent with 40-week (280-day) term
    let trimester = 1;
    if (weeksProgress >= 28) trimester = 3;
    else if (weeksProgress >= 14) trimester = 2;

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    setResults({
      dueDateStr: formatDate(dueDate),
      conceptionDateStr: formatDate(conceptionDate),
      weeksProgress,
      daysProgress,
      trimester,
      daysRemaining,
    });
  }, [lmpDateStr]);

  return (
    <CalculatorShell
      title="Pregnancy Milestones"
      inputs={
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">First Day of Last Period (LMP)</label>
            <input
              type="date"
              value={lmpDateStr}
              onChange={(e) => setLmpDateStr(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800 bg-white"
            />
          </div>
          <p className="text-xs text-slate-500">
            Due date is estimated using Naegele&apos;s Rule (LMP + 280 days / 40 weeks), assuming a typical 28-day
            cycle. Actual delivery dates vary.
          </p>
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard label="Estimated Due Date" value={results.dueDateStr} color="rose" />

          <div className="space-y-3 font-semibold text-slate-700 text-sm">
            <div className="flex justify-between items-center">
              <span>Gestational Progress</span>
              <span className="text-rose-600">{results.weeksProgress} Weeks, {results.daysProgress} Days</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Current Trimester</span>
              <span>Trimester {results.trimester}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Estimated Conception</span>
              <span className="text-xs text-slate-500">{results.conceptionDateStr}</span>
            </div>
            <div className="border-t border-slate-200 my-2"></div>
            <div className="flex justify-between items-center text-slate-800 font-bold">
              <span>Days Until Birth</span>
              <span>{results.daysRemaining} Days</span>
            </div>
          </div>

          <HealthDisclaimer />
        </div>
      }
    />
  );
}
