'use client';

import React, { useState, useEffect } from 'react';

export function DateDifferenceCalculator() {
  const [startDateStr, setStartDateStr] = useState<string>('2026-01-01');
  const [endDateStr, setEndDateStr] = useState<string>('2026-12-31');

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

    const start = new Date(startDateStr + 'T00:00:00');
    const end = new Date(endDateStr + 'T00:00:00');

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Date Selection</h2>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Start Date</label>
            <input
              type="date"
              value={startDateStr}
              onChange={(e) => setStartDateStr(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-800 bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">End Date</label>
            <input
              type="date"
              value={endDateStr}
              onChange={(e) => setEndDateStr(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-800 bg-white"
            />
          </div>
        </div>

        <div className="md:col-span-6 flex flex-col justify-between">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Difference Summary</h2>

            <div className="bg-amber-500 text-white rounded-xl p-5 text-center shadow-md shadow-amber-500/10">
              <span className="text-xs font-bold uppercase tracking-wider opacity-85 block mb-1">
                Total Days Between Dates
              </span>
              <div className="text-3xl font-extrabold tracking-tight">
                {results.totalDays.toLocaleString()} <span className="text-lg font-medium opacity-85">days</span>
              </div>
            </div>

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
              <div className="flex justify-between items-center text-slate-850 font-bold">
                <span>Calendar Breakdown</span>
                <span className="text-amber-600">{results.years} Years, {results.months} Months, {results.days} Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
