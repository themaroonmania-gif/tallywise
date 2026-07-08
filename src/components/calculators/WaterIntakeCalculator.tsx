'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorShell, ShellInput, ShellSelect, ResultCard } from './CalculatorShell';
import { HealthDisclaimer } from './health/HealthDisclaimer';

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
    <CalculatorShell
      title="Hydration Details"
      inputs={
        <div className="space-y-4">
          <ShellInput label="Body Weight" suffix="lbs" value={weightLbs} onChange={(e) => setWeightLbs(Number(e.target.value))} />
          <ShellInput label="Daily Exercise" suffix="min" value={exerciseMins} onChange={(e) => setExerciseMins(Number(e.target.value))} />
          <ShellSelect label="Local Climate" value={climate} onChange={(e) => setClimate(e.target.value as 'normal' | 'hot' | 'cold')}>
            <option value="normal">Normal / Moderate Temperature</option>
            <option value="hot">Hot / Dry / Humid Climate</option>
            <option value="cold">Cold / Winter Weather</option>
          </ShellSelect>
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard label="Target Daily Hydration" value={`${results.waterOz} fl oz`} color="rose" />

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-200/50">
              <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Equivalent Cups</span>
              <div className="text-lg font-bold text-slate-800">{results.waterCups} Cups</div>
              <span className="text-[8px] text-slate-400 block mt-0.5">(8 oz each)</span>
            </div>
            <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-200/50">
              <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Equivalent Liters</span>
              <div className="text-lg font-bold text-slate-800">{results.waterLiters} L</div>
              <span className="text-[8px] text-slate-400 block mt-0.5">(Metric volume)</span>
            </div>
          </div>

          <HealthDisclaimer />
        </div>
      }
    />
  );
}
