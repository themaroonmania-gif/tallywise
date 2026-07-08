'use client';

import React, { useEffect, useState } from 'react';
import { CalculatorShell, ShellInput, ShellSelect, ResultCard } from '../CalculatorShell';
import { HealthDisclaimer } from './HealthDisclaimer';

type UnitSystem = 'imperial' | 'metric';

interface Range {
  label: string;
  low: number;
  high: number;
}

function getBmiCategory(bmi: number): Range {
  if (bmi < 18.5) return { label: 'Underweight', low: 28, high: 40 };
  if (bmi < 25) return { label: 'Normal weight', low: 25, high: 35 };
  if (bmi < 30) return { label: 'Overweight', low: 15, high: 25 };
  return { label: 'Obese', low: 11, high: 20 };
}

export function PregnancyWeightGainCalculator() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [weightLbs, setWeightLbs] = useState<number>(150);
  const [weightKg, setWeightKg] = useState<number>(68);
  const [heightIn, setHeightIn] = useState<number>(65);
  const [heightCm, setHeightCm] = useState<number>(165);
  const [currentWeek, setCurrentWeek] = useState<number>(20);

  const [bmiCategory, setBmiCategory] = useState<Range>({ label: 'Normal weight', low: 25, high: 35 });
  const [recommendedSoFar, setRecommendedSoFar] = useState<{ low: number; high: number }>({ low: 0, high: 0 });

  useEffect(() => {
    const weightKgVal = unit === 'imperial' ? weightLbs * 0.45359237 : weightKg;
    const heightMVal = unit === 'imperial' ? (heightIn * 2.54) / 100 : heightCm / 100;
    if (heightMVal <= 0) return;

    const bmi = weightKgVal / (heightMVal * heightMVal);
    const category = getBmiCategory(bmi);
    setBmiCategory(category);

    // Rough trimester-based pacing: ~10% by week 13, ~50% by week 27, 100% by week 40
    const progress = Math.min(1, Math.max(0, currentWeek / 40));
    setRecommendedSoFar({
      low: Math.round(category.low * progress),
      high: Math.round(category.high * progress),
    });
  }, [unit, weightLbs, weightKg, heightIn, heightCm, currentWeek]);

  return (
    <CalculatorShell
      title="Enter Your Details"
      inputs={
        <div className="space-y-4">
          <ShellSelect label="Units" value={unit} onChange={(e) => setUnit(e.target.value as UnitSystem)}>
            <option value="imperial">Imperial (lb, in)</option>
            <option value="metric">Metric (kg, cm)</option>
          </ShellSelect>
          {unit === 'imperial' ? (
            <>
              <ShellInput label="Pre-Pregnancy Weight" suffix="lbs" value={weightLbs} onChange={(e) => setWeightLbs(Number(e.target.value))} />
              <ShellInput label="Height" suffix="in" value={heightIn} onChange={(e) => setHeightIn(Number(e.target.value))} />
            </>
          ) : (
            <>
              <ShellInput label="Pre-Pregnancy Weight" suffix="kg" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} />
              <ShellInput label="Height" suffix="cm" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} />
            </>
          )}
          <ShellInput label="Current Week of Pregnancy" suffix="wks" value={currentWeek} onChange={(e) => setCurrentWeek(Number(e.target.value))} />
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard label="Pre-Pregnancy BMI Category" value={bmiCategory.label} color="rose" />
          <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
            <span>Recommended Total Gain</span>
            <span>{bmiCategory.low}-{bmiCategory.high} lbs</span>
          </div>
          <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
            <span>Rough Gain So Far (Week {currentWeek})</span>
            <span>{recommendedSoFar.low}-{recommendedSoFar.high} lbs</span>
          </div>
          <p className="text-sm text-slate-600">
            Based on IOM (Institute of Medicine) guidelines. Actual healthy weight gain varies by individual and pregnancy (e.g. twins).
          </p>
          <HealthDisclaimer />
        </div>
      }
    />
  );
}
