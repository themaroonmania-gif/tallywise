'use client';

import React, { useState, useEffect } from 'react';

export function AgeCalculator() {
  const [birthDateStr, setBirthDateStr] = useState<string>('1995-06-15');
  const [targetDateStr, setTargetDateStr] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [results, setResults] = useState({
    years: 0,
    months: 0,
    days: 0,
    totalMonths: 0,
    totalWeeks: 0,
    totalDays: 0,
    totalHours: 0,
    nextBirthdayDays: 0,
  });

  useEffect(() => {
    if (!birthDateStr || !targetDateStr) return;

    const birthDate = new Date(birthDateStr + 'T00:00:00');
    const targetDate = new Date(targetDateStr + 'T00:00:00');

    if (isNaN(birthDate.getTime()) || isNaN(targetDate.getTime())) return;
    if (targetDate < birthDate) return; // ignore invalid ranges

    const bYear = birthDate.getFullYear();
    const bMonth = birthDate.getMonth();
    const bDay = birthDate.getDate();

    const tYear = targetDate.getFullYear();
    const tMonth = targetDate.getMonth();
    const tDay = targetDate.getDate();

    let years = tYear - bYear;
    let months = tMonth - bMonth;
    let days = tDay - bDay;

    if (days < 0) {
      months--;
      // Get the number of days in the previous month
      const prevMonth = new Date(tYear, tMonth, 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Totals calculations
    const diffTime = Math.abs(targetDate.getTime() - birthDate.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalMonths = (years * 12) + months;
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;

    // Calculate days until next birthday
    const nextBirthday = new Date(tYear, bMonth, bDay);
    if (nextBirthday < targetDate) {
      nextBirthday.setFullYear(tYear + 1);
    }
    const diffToNextBirthday = nextBirthday.getTime() - targetDate.getTime();
    const nextBirthdayDays = Math.ceil(diffToNextBirthday / (1000 * 60 * 60 * 24));

    setResults({
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      nextBirthdayDays,
    });
  }, [birthDateStr, targetDateStr]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Inputs Column */}
        <div className="md:col-span-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Date Details</h2>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Date of Birth</label>
            <input
              type="date"
              value={birthDateStr}
              onChange={(e) => setBirthDateStr(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-855 bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Age at Date</label>
            <input
              type="date"
              value={targetDateStr}
              onChange={(e) => setTargetDateStr(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-855 bg-white"
            />
          </div>
        </div>

        {/* Right Output Column */}
        <div className="md:col-span-6 flex flex-col justify-between">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Age Summary</h2>

            {/* Exact Age Card */}
            <div className="bg-amber-500 text-white rounded-xl p-5 text-center shadow-md shadow-amber-500/10">
              <span className="text-xs font-bold uppercase tracking-wider opacity-85 block mb-1">
                Exact Age
              </span>
              <div className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {results.years} Years, {results.months} Months, {results.days} Days
              </div>
            </div>

            {/* Sub stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-250/20">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Total Months</span>
                <div className="text-lg font-bold text-slate-800">{results.totalMonths.toLocaleString()}</div>
              </div>
              <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-250/20">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Total Weeks</span>
                <div className="text-lg font-bold text-slate-800">{results.totalWeeks.toLocaleString()}</div>
              </div>
              <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-250/20">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Total Days</span>
                <div className="text-lg font-bold text-slate-800">{results.totalDays.toLocaleString()}</div>
              </div>
              <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-250/20">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Total Hours</span>
                <div className="text-lg font-bold text-slate-800">{results.totalHours.toLocaleString()}</div>
              </div>
            </div>

            {/* Next Birthday info */}
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500 border-t border-slate-200/60 pt-4">
              <span>Days until next birthday</span>
              <span className="text-amber-600 font-bold text-sm">{results.nextBirthdayDays} Days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
