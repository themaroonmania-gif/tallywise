'use client';

import React, { useState, useEffect } from 'react';

export function WeightLossCalculator() {
  const [currentWeight, setCurrentWeight] = useState<number>(180);
  const [targetWeight, setTargetWeight] = useState<number>(165);
  const [timeframeWeeks, setTimeframeWeeks] = useState<number>(12);
  const [tdee, setTdee] = useState<number>(2500);

  const [results, setResults] = useState({
    weightToLose: 0,
    dailyDeficit: 0,
    dailyCalorieTarget: 0,
    warning: '',
  });

  useEffect(() => {
    const wToLose = Math.max(0, currentWeight - targetWeight);
    const totalDays = timeframeWeeks * 7;

    // 1 lb of fat is roughly 3500 calories
    const totalCalorieDeficit = wToLose * 3500;
    const dailyDeficit = totalDays > 0 ? totalCalorieDeficit / totalDays : 0;
    const dailyCalorieTarget = Math.max(0, tdee - dailyDeficit);

    let warning = '';
    // A daily deficit representing > 2 lbs/week loss is generally considered unsafe without clinical supervision
    const weeklyRate = timeframeWeeks > 0 ? wToLose / timeframeWeeks : 0;
    if (weeklyRate > 2) {
      warning = '⚠️ Unsafe weight loss rate. Losing more than 2 lbs (0.9 kg) per week is generally not recommended without consulting a healthcare professional.';
    } else if (dailyCalorieTarget < 1200) {
      warning = '⚠️ Very low calorie target. Consuming fewer than 1,200 calories per day is generally considered unsafe for long-term health.';
    }

    setResults({
      weightToLose: wToLose,
      dailyDeficit: Math.round(dailyDeficit),
      dailyCalorieTarget: Math.round(dailyCalorieTarget),
      warning,
    });
  }, [currentWeight, targetWeight, timeframeWeeks, tdee]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Weight Loss Goal Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Current Weight (lbs)</label>
              <input
                type="number"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Target Weight (lbs)</label>
              <input
                type="number"
                value={targetWeight}
                onChange={(e) => setTargetWeight(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Timeframe (Weeks)</label>
              <input
                type="number"
                value={timeframeWeeks}
                onChange={(e) => setTimeframeWeeks(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Your Daily TDEE</label>
              <input
                type="number"
                value={tdee}
                onChange={(e) => setTdee(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-6 flex flex-col justify-between">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Calorie & Rate Targets</h2>

            {results.warning && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-xs leading-relaxed font-semibold">
                {results.warning}
              </div>
            )}

            <div className="bg-rose-600 text-white rounded-xl p-5 text-center shadow-md shadow-rose-600/10">
              <span className="text-xs font-bold uppercase tracking-wider opacity-85 block mb-1">
                Target Daily Calories
              </span>
              <div className="text-3xl font-extrabold tracking-tight">
                {results.dailyCalorieTarget} <span className="text-lg font-medium opacity-85">kcal/day</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                <span>Weight to Lose</span>
                <span>{results.weightToLose} lbs</span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-655">
                <span>Required Daily Deficit</span>
                <span className="text-rose-600 font-semibold">-{results.dailyDeficit} kcal/day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
