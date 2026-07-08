'use client';

import React, { useState, useEffect } from 'react';

export function WaterIntakeCalculator() {
  const [weightLbs, setWeightLbs] = useState<number>(160);
  const [exerciseMins, setExerciseMins] = useState<number>(45);
  const [climate, setClimate] = useState<'normal' | 'hot' | 'cold'>('normal');

  const [results, setResults] = useState({
    waterOz: 0,
    waterCups: 0,
    waterLiters: 0,
  });

  useEffect(() => {
    const weight = Math.max(0, weightLbs);
    const exercise = Math.max(0, exerciseMins);

    // Baseline calculation: weight * 0.5 oz
    let baselineOz = weight * 0.5;

    // Add exercise adjustment: 12oz for every 30 minutes of exercise
    const exerciseOz = (exercise / 30) * 12;

    // Climate adjustment
    let climateBonus = 0;
    if (climate === 'hot') {
      climateBonus = 16; // Add 16 oz for hot/dry environments
    } else if (climate === 'cold') {
      climateBonus = -8; // Reduce 8 oz in very cold/inactive climates
    }

    const waterOz = Math.max(32, baselineOz + exerciseOz + climateBonus); // Safe minimum of 32 oz
    const waterCups = waterOz / 8;
    const waterLiters = waterOz * 0.0295735;

    setResults({
      waterOz: Math.round(waterOz),
      waterCups: Number(waterCups.toFixed(1)),
      waterLiters: Number(waterLiters.toFixed(2)),
    });
  }, [weightLbs, exerciseMins, climate]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Hydration Details</h2>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Body Weight (lbs)</label>
            <input
              type="number"
              value={weightLbs}
              onChange={(e) => setWeightLbs(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Daily Exercise (Minutes)</label>
            <input
              type="number"
              value={exerciseMins}
              onChange={(e) => setExerciseMins(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Local Climate</label>
            <select
              value={climate}
              onChange={(e) => setClimate(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800 bg-white"
            >
              <option value="normal">Normal / Moderate Temperature</option>
              <option value="hot">Hot / Dry / Humid Climate</option>
              <option value="cold">Cold / Winter Weather</option>
            </select>
          </div>
        </div>

        <div className="md:col-span-6 flex flex-col justify-between">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Daily Water Goal</h2>

            <div className="bg-rose-600 text-white rounded-xl p-5 text-center shadow-md shadow-rose-600/10">
              <span className="text-xs font-bold uppercase tracking-wider opacity-85 block mb-1">
                Target Daily Hydration
              </span>
              <div className="text-3xl font-extrabold tracking-tight">
                {results.waterOz} <span className="text-lg font-medium opacity-85">fl oz</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-250/20">
                <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Equivalent Cups</span>
                <div className="text-lg font-bold text-slate-800">{results.waterCups} Cups</div>
                <span className="text-[8px] text-slate-400 block mt-0.5">(8 oz each)</span>
              </div>
              <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-250/20">
                <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Equivalent Liters</span>
                <div className="text-lg font-bold text-slate-800">{results.waterLiters} L</div>
                <span className="text-[8px] text-slate-400 block mt-0.5">(Metric volume)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
