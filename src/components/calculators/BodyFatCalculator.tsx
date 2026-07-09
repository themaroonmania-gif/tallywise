'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorShell, ShellSelect, ResultCard } from './CalculatorShell';
import { HealthDisclaimer } from './health/HealthDisclaimer';

// Tailwind's compiler only picks up classes it can find as literal strings in
// source, so this must be a static map rather than a `text-${x}-600` template.
const categoryTextColorClass: Record<'indigo' | 'emerald' | 'amber' | 'rose', string> = {
  indigo: 'text-indigo-600',
  emerald: 'text-emerald-600',
  amber: 'text-amber-600',
  rose: 'text-rose-600',
};

export function BodyFatCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('imperial');
  const [age, setAge] = useState<number>(30);
  const [weight, setWeight] = useState<number>(170); // lbs or kg

  // Circumferences
  const [height, setHeight] = useState<number>(70); // inches or cm
  const [neck, setNeck] = useState<number>(15); // inches or cm
  const [waist, setWaist] = useState<number>(34); // inches or cm
  const [hips, setHips] = useState<number>(38); // inches or cm (female only)

  const [results, setResults] = useState({
    bodyFat: 0,
    fatMass: 0,
    leanMass: 0,
    category: 'Average',
  });
  const [categoryColor, setCategoryColor] = useState<'indigo' | 'emerald' | 'amber' | 'rose'>('amber');

  useEffect(() => {
    let bodyFat = 0;

    // US Navy Circumference Body Fat Formulas
    if (unitSystem === 'imperial') {
      if (gender === 'male') {
        // Male Imperial: 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
        const diff = waist - neck;
        if (diff > 0 && height > 0) {
          bodyFat = 86.010 * Math.log10(diff) - 70.041 * Math.log10(height) + 36.76;
        }
      } else {
        // Female Imperial: 161.278 * log10(waist + hips - neck) - 139.212 * log10(height) + 1.62
        const sum = waist + hips - neck;
        if (sum > 0 && height > 0) {
          bodyFat = 161.278 * Math.log10(sum) - 139.212 * Math.log10(height) + 1.62;
        }
      }
    } else {
      // Metric formulas
      if (gender === 'male') {
        const diff = waist - neck;
        if (diff > 0 && height > 0) {
          bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(height)) - 450;
        }
      } else {
        const sum = waist + hips - neck;
        if (sum > 0 && height > 0) {
          bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(sum) + 0.22100 * Math.log10(height)) - 450;
        }
      }
    }

    const roundedBf = Math.max(2, Math.min(60, Number(bodyFat.toFixed(1))));
    const fatMass = weight * (roundedBf / 100);
    const leanMass = weight - fatMass;

    // Categorization (American Council on Exercise ranges)
    let category = 'Average';
    if (gender === 'male') {
      if (roundedBf < 6) category = 'Essential Fat';
      else if (roundedBf < 14) category = 'Athletes';
      else if (roundedBf < 18) category = 'Fitness';
      else if (roundedBf < 25) category = 'Average';
      else category = 'Obese';
    } else {
      if (roundedBf < 14) category = 'Essential Fat';
      else if (roundedBf < 21) category = 'Athletes';
      else if (roundedBf < 25) category = 'Fitness';
      else if (roundedBf < 32) category = 'Average';
      else category = 'Obese';
    }

    const colorForCategory: Record<string, 'indigo' | 'emerald' | 'amber' | 'rose'> = {
      'Essential Fat': 'indigo',
      Athletes: 'emerald',
      Fitness: 'emerald',
      Average: 'amber',
      Obese: 'rose',
    };
    setCategoryColor(colorForCategory[category] ?? 'amber');

    setResults({
      bodyFat: roundedBf,
      fatMass: Number(fatMass.toFixed(1)),
      leanMass: Number(leanMass.toFixed(1)),
      category,
    });
  }, [gender, unitSystem, age, weight, height, neck, waist, hips]);

  return (
    <CalculatorShell
      title="Body Dimensions"
      inputs={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ShellSelect label="Sex" value={gender} onChange={(e) => setGender(e.target.value as 'male' | 'female')}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </ShellSelect>
            <ShellSelect label="Units" value={unitSystem} onChange={(e) => setUnitSystem(e.target.value as 'imperial' | 'metric')}>
              <option value="imperial">Imperial</option>
              <option value="metric">Metric</option>
            </ShellSelect>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Age (years)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Weight ({unitSystem === 'imperial' ? 'lbs' : 'kg'})</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Height ({unitSystem === 'imperial' ? 'in' : 'cm'})</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Neck Circum. ({unitSystem === 'imperial' ? 'in' : 'cm'})</label>
              <input
                type="number"
                value={neck}
                onChange={(e) => setNeck(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Waist Circum. ({unitSystem === 'imperial' ? 'in' : 'cm'})</label>
              <input
                type="number"
                value={waist}
                onChange={(e) => setWaist(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800"
              />
            </div>
          </div>

          {gender === 'female' && (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Hip Circum. ({unitSystem === 'imperial' ? 'in' : 'cm'})</label>
              <input
                type="number"
                value={hips}
                onChange={(e) => setHips(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800"
              />
            </div>
          )}
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard label="Body Fat Percentage" value={`${results.bodyFat}%`} color={categoryColor} />

          <div className="space-y-3 font-semibold text-slate-700 text-sm">
            <div className="flex justify-between items-center">
              <span>Fat Mass</span>
              <span>{results.fatMass} {unitSystem === 'imperial' ? 'lbs' : 'kg'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Lean Body Mass</span>
              <span>{results.leanMass} {unitSystem === 'imperial' ? 'lbs' : 'kg'}</span>
            </div>
            <div className="border-t border-slate-200 my-2"></div>
            <div className="flex justify-between items-center text-slate-800 font-bold">
              <span>Fitness Classification</span>
              <span className={categoryTextColorClass[categoryColor]}>{results.category}</span>
            </div>
          </div>

          <HealthDisclaimer />
        </div>
      }
    />
  );
}
