'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorShell, ResultCard } from './CalculatorShell';

export function DateDifferenceCalculator() {
  const [startDateStr, setStartDateStr] = useState<string>('2026-01-01');
  const [endDateStr, setEndDateStr] = useState<string>('2026-12-31');
  const [reversed, setReversed] = useState<boolean>(false);

  const [results, setResults] = useState({
    totalDays: 0,
    totalWeeks: 0,
    totalMonths: 0,
    years: 0,
    months: 0,
    days: 0,
  });

  useEffect(() => {
    if (!startDateStr || !endDateStr) return;

    let start = new Date(startDateStr + 'T00:00:00');
    let end = new Date(endDateStr + 'T00:00:00');

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

    // Normalize so start <= end for the calendar breakdown, but flag if the
    // user entered the dates in reverse order.
    const wasReversed = start > end;
    setReversed(wasReversed);
    if (wasReversed) {
      [start, end] = [end, start];
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

    // Calendar style differences
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    setResults({
      totalDays,
      totalWeeks,
      totalMonths,
      years,
      months,
      days,
    });
  }, [startDateStr, endDateStr]);

  return (
    <CalculatorShell
      title="Date Selection"
      inputs={
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Start Date</label>
            <input
              type="date"
              value={startDateStr}
              onChange={(e) => setStartDateStr(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-800 bg-white transition-all hover:border-slate-300"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">End Date</label>
            <input
              type="date"
              value={endDateStr}
              onChange={(e) => setEndDateStr(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-800 bg-white transition-all hover:border-slate-300"
            />
          </div>

          {reversed && (
            <div className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-100 font-semibold">
              Start date is after end date — showing the absolute difference between the two.
            </div>
          )}
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard
            label="Total Days Between Dates"
            value={`${results.totalDays.toLocaleString()} days`}
            color="amber"
          />

          <div className="space-y-3 font-semibold text-slate-700 text-sm">
            <div className="flex justify-between items-center">
              <span>Total Weeks</span>
              <span>{results.totalWeeks.toLocaleString()} Weeks</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Total Months</span>
              <span>{results.totalMonths.toLocaleString()} Months</span>
            </div>
            <div className="border-t border-slate-200 my-2"></div>
            <div className="flex justify-between items-center text-slate-800 font-bold">
              <span>Calendar Breakdown</span>
              <span className="text-amber-600">{results.years}y {results.months}m {results.days}d</span>
            </div>
          </div>
        </div>
      }
    />
  );
}
