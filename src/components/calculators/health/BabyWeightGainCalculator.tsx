'use client';

import React, { useEffect, useState } from 'react';
import { CalculatorShell, ShellInput, ResultCard } from '../CalculatorShell';
import { HealthDisclaimer } from './HealthDisclaimer';

export function BabyWeightGainCalculator() {
  const [birthWeightOz, setBirthWeightOz] = useState<number>(120); // 7.5 lbs = 120 oz
  const [currentWeightOz, setCurrentWeightOz] = useState<number>(160);
  const [weeksSinceBirth, setWeeksSinceBirth] = useState<number>(8);

  const [gainedOz, setGainedOz] = useState<number>(0);
  const [avgPerWeekOz, setAvgPerWeekOz] = useState<number>(0);
  const [comparison, setComparison] = useState<string>('');

  useEffect(() => {
    const gained = currentWeightOz - birthWeightOz;
    setGainedOz(gained);

    if (weeksSinceBirth > 0) {
      const perWeek = gained / weeksSinceBirth;
      setAvgPerWeekOz(perWeek);

      if (perWeek < 5) setComparison('Below typical newborn range (5-7 oz/week)');
      else if (perWeek <= 7) setComparison('Within typical newborn range (5-7 oz/week)');
      else setComparison('Above typical newborn range (5-7 oz/week)');
    }
  }, [birthWeightOz, currentWeightOz, weeksSinceBirth]);

  const gainedGrams = gainedOz * 28.3495;
  const avgPerWeekGrams = avgPerWeekOz * 28.3495;

  return (
    <CalculatorShell
      title="Enter Weight Details"
      inputs={
        <div className="space-y-4">
          <ShellInput label="Birth Weight" suffix="oz" value={birthWeightOz} onChange={(e) => setBirthWeightOz(Number(e.target.value))} />
          <ShellInput label="Current Weight" suffix="oz" value={currentWeightOz} onChange={(e) => setCurrentWeightOz(Number(e.target.value))} />
          <ShellInput label="Weeks Since Birth" suffix="wks" value={weeksSinceBirth} onChange={(e) => setWeeksSinceBirth(Number(e.target.value))} />
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard label="Total Weight Gained" value={`${gainedOz.toFixed(1)} oz (${gainedGrams.toFixed(0)} g)`} color="rose" />
          <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
            <span>Average Gain per Week</span>
            <span>{avgPerWeekOz.toFixed(1)} oz ({avgPerWeekGrams.toFixed(0)} g)</span>
          </div>
          <p className="text-sm text-slate-600">{comparison}</p>
          <HealthDisclaimer />
        </div>
      }
    />
  );
}
