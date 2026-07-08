'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorShell, ResultCard } from './CalculatorShell';

export function AgeCalculator() {
  const [birthDateStr, setBirthDateStr] = useState<string>('1995-06-15');
  const [targetDateStr, setTargetDateStr] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [error, setError] = useState<string>('');

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
    if (targetDate < birthDate) {
      setError('The "age at" date must be on or after the date of birth.');
      return;
    }
    setError('');

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
    <CalculatorShell
      title="Date Details"
      inputs={
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Date of Birth</label>
            <input
              type="date"
              value={birthDateStr}
              onChange={(e) => setBirthDateStr(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-800 bg-white transition-all hover:border-slate-300"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Age As Of (defaults to today, pick any past or future date)
            </label>
            <input
              type="date"
              value={targetDateStr}
              onChange={(e) => setTargetDateStr(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-800 bg-white transition-all hover:border-slate-300"
            />
          </div>

          {error && (
            <div className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-100 font-semibold">
              {error}
            </div>
          )}
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard
            label="Exact Age"
            value={`${results.years}y ${results.months}m ${results.days}d`}
            color="amber"
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-200/50">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Total Months</span>
              <div className="text-lg font-bold text-slate-800">{results.totalMonths.toLocaleString()}</div>
            </div>
            <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-200/50">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Total Weeks</span>
              <div className="text-lg font-bold text-slate-800">{results.totalWeeks.toLocaleString()}</div>
            </div>
            <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-200/50">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Total Days</span>
              <div className="text-lg font-bold text-slate-800">{results.totalDays.toLocaleString()}</div>
            </div>
            <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-200/50">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Total Hours</span>
              <div className="text-lg font-bold text-slate-800">{results.totalHours.toLocaleString()}</div>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 border-t border-slate-200/60 pt-4">
            <span>Days until next birthday</span>
            <span className="text-amber-600 font-bold text-sm">{results.nextBirthdayDays} Days</span>
          </div>
        </div>
      }
    />
  );
}
