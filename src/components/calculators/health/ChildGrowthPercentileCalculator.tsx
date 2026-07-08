'use client';

import React, { useEffect, useState } from 'react';
import { CalculatorShell, ShellInput, ShellSelect, ResultCard } from '../CalculatorShell';
import { HealthDisclaimer } from './HealthDisclaimer';

type Sex = 'male' | 'female';

// Very rough heuristic average height/weight by age (years), used only for banding, not precise percentiles.
const AVG_HEIGHT_CM_PER_YEAR: Record<number, number> = {
  1: 76, 2: 87, 3: 96, 4: 103, 5: 110, 6: 116, 7: 122, 8: 128, 9: 133, 10: 138,
  11: 144, 12: 151, 13: 157, 14: 163, 15: 166, 16: 168, 17: 169, 18: 170,
};
const AVG_WEIGHT_KG_PER_YEAR: Record<number, number> = {
  1: 10, 2: 12.5, 3: 14.5, 4: 16.5, 5: 18.5, 6: 21, 7: 23, 8: 26, 9: 29, 10: 32,
  11: 36, 12: 41, 13: 46, 14: 51, 15: 56, 16: 60, 17: 63, 18: 65,
};

function nearestAge(age: number): number {
  const clamped = Math.min(18, Math.max(1, Math.round(age)));
  return clamped;
}

function band(value: number, avg: number): string {
  const ratio = value / avg;
  if (ratio < 0.9) return 'Below Average';
  if (ratio > 1.1) return 'Above Average';
  return 'Average';
}

export function ChildGrowthPercentileCalculator() {
  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState<number>(5);
  const [heightCm, setHeightCm] = useState<number>(110);
  const [weightKg, setWeightKg] = useState<number>(18);
  const [heightBand, setHeightBand] = useState<string>('Average');
  const [weightBand, setWeightBand] = useState<string>('Average');

  useEffect(() => {
    const a = nearestAge(age);
    // Rough sex adjustment: girls' averages ~3-4% lower in these coarse bands
    const sexFactor = sex === 'female' ? 0.97 : 1;
    const avgHeight = AVG_HEIGHT_CM_PER_YEAR[a] * sexFactor;
    const avgWeight = AVG_WEIGHT_KG_PER_YEAR[a] * sexFactor;

    setHeightBand(band(heightCm, avgHeight));
    setWeightBand(band(weightKg, avgWeight));
  }, [sex, age, heightCm, weightKg]);

  return (
    <CalculatorShell
      title="Enter Child's Details"
      inputs={
        <div className="space-y-4">
          <ShellSelect label="Sex" value={sex} onChange={(e) => setSex(e.target.value as Sex)}>
            <option value="male">Boy</option>
            <option value="female">Girl</option>
          </ShellSelect>
          <ShellInput label="Age" suffix="years" value={age} onChange={(e) => setAge(Number(e.target.value))} />
          <ShellInput label="Height" suffix="cm" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} />
          <ShellInput label="Weight" suffix="kg" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} />
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard label="Height Band" value={heightBand} color="rose" />
          <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
            <span>Weight Band</span>
            <span>{weightBand}</span>
          </div>
          <p className="text-sm text-slate-600">
            This tool provides a simplified, approximate estimate only — it is not a clinical growth chart. Consult your pediatrician&apos;s growth chart for clinical accuracy.
          </p>
          <HealthDisclaimer />
        </div>
      }
    />
  );
}
