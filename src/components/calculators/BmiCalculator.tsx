'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorShell, ShellSelect, ResultCard } from './CalculatorShell';
import { HealthDisclaimer } from './health/HealthDisclaimer';

export function BmiCalculator() {
  const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('imperial');
  const [personType, setPersonType] = useState<'adult' | 'child'>('adult');

  // Imperial fields
  const [weightLbs, setWeightLbs] = useState<number>(160);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(9);

  // Metric fields
  const [weightKg, setWeightKg] = useState<number>(72);
  const [heightCm, setHeightCm] = useState<number>(175);

  // Child fields
  const [ageYears, setAgeYears] = useState<number>(10);
  const [gender, setGender] = useState<'boy' | 'girl'>('boy');

  const [bmi, setBmi] = useState<number>(0);
  const [category, setCategory] = useState<string>('Normal');
  const [categoryColor, setCategoryColor] = useState<string>('text-emerald-600 bg-emerald-50 border-emerald-200');
  const [resultColor, setResultColor] = useState<'indigo' | 'emerald' | 'amber' | 'rose'>('emerald');

  useEffect(() => {
    let calculatedBmi = 0;

    if (unitSystem === 'imperial') {
      const totalHeightInches = (heightFt * 12) + heightIn;
      if (totalHeightInches > 0) {
        calculatedBmi = 703 * (weightLbs / (totalHeightInches * totalHeightInches));
      }
    } else {
      const heightMeters = heightCm / 100;
      if (heightMeters > 0) {
        calculatedBmi = weightKg / (heightMeters * heightMeters);
      }
    }

    const roundedBmi = Number(calculatedBmi.toFixed(1));
    setBmi(roundedBmi);

    // Evaluate categories
    if (personType === 'adult') {
      if (roundedBmi < 18.5) {
        setCategory('Underweight');
        setCategoryColor('text-blue-600 bg-blue-50 border-blue-200');
        setResultColor('indigo');
      } else if (roundedBmi < 25.0) {
        setCategory('Normal Weight');
        setCategoryColor('text-emerald-600 bg-emerald-50 border-emerald-200');
        setResultColor('emerald');
      } else if (roundedBmi < 30.0) {
        setCategory('Overweight');
        setCategoryColor('text-amber-600 bg-amber-50 border-amber-200');
        setResultColor('amber');
      } else {
        setCategory('Obese');
        setCategoryColor('text-rose-600 bg-rose-50 border-rose-200');
        setResultColor('rose');
      }
    } else {
      // Simplified approximate percentile bands (real BMI-for-age uses CDC/WHO
      // growth charts specific to exact age-in-months and sex — this is an estimate only).
      if (roundedBmi < 14) {
        setCategory('Underweight (approx. < 5th percentile)');
        setCategoryColor('text-blue-600 bg-blue-50 border-blue-200');
        setResultColor('indigo');
      } else if (roundedBmi < 20) {
        setCategory('Healthy Weight (approx. 5th-85th percentile)');
        setCategoryColor('text-emerald-600 bg-emerald-50 border-emerald-200');
        setResultColor('emerald');
      } else if (roundedBmi < 24) {
        setCategory('Overweight (approx. 85th-95th percentile)');
        setCategoryColor('text-amber-600 bg-amber-50 border-amber-200');
        setResultColor('amber');
      } else {
        setCategory('Obese (approx. ≥ 95th percentile)');
        setCategoryColor('text-rose-600 bg-rose-50 border-rose-200');
        setResultColor('rose');
      }
    }
  }, [unitSystem, personType, weightLbs, heightFt, heightIn, weightKg, heightCm, ageYears, gender]);

  return (
    <CalculatorShell
      title="Body Dimensions"
      inputs={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Age Group</label>
              <div className="flex bg-slate-50 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPersonType('adult')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    personType === 'adult' ? 'bg-white text-rose-600 shadow-sm border border-slate-100' : 'text-slate-500'
                  }`}
                >
                  Adult (20+)
                </button>
                <button
                  type="button"
                  onClick={() => setPersonType('child')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    personType === 'child' ? 'bg-white text-rose-600 shadow-sm border border-slate-100' : 'text-slate-500'
                  }`}
                >
                  Child (2-19)
                </button>
              </div>
            </div>

            <ShellSelect label="Unit System" value={unitSystem} onChange={(e) => setUnitSystem(e.target.value as 'imperial' | 'metric')}>
              <option value="imperial">Imperial (lbs/in)</option>
              <option value="metric">Metric (kg/cm)</option>
            </ShellSelect>
          </div>

          {personType === 'child' && (
            <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Biological Sex</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('boy')}
                    className={`flex-1 py-1.5 border rounded-lg text-xs font-semibold ${gender === 'boy' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'}`}
                  >
                    Boy
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('girl')}
                    className={`flex-1 py-1.5 border rounded-lg text-xs font-semibold ${gender === 'girl' ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-slate-600 border-slate-200'}`}
                  >
                    Girl
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Age (years)</label>
                <input
                  type="number"
                  min={2}
                  max={19}
                  value={ageYears}
                  onChange={(e) => setAgeYears(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium text-slate-800 bg-white"
                />
              </div>
            </div>
          )}

          {unitSystem === 'imperial' ? (
            <>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Height</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="number"
                      value={heightFt}
                      onChange={(e) => setHeightFt(Number(e.target.value))}
                      className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800"
                    />
                    <span className="absolute right-4 top-3 text-slate-400 font-medium">ft</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={heightIn}
                      max={11}
                      onChange={(e) => setHeightIn(Number(e.target.value))}
                      className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800"
                    />
                    <span className="absolute right-4 top-3 text-slate-400 font-medium">in</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Weight</label>
                <div className="relative">
                  <input
                    type="number"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(Number(e.target.value))}
                    className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800"
                  />
                  <span className="absolute right-4 top-3 text-slate-400 font-medium">lbs</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Height</label>
                <div className="relative">
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800"
                  />
                  <span className="absolute right-4 top-3 text-slate-400 font-medium">cm</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Weight</label>
                <div className="relative">
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800"
                  />
                  <span className="absolute right-4 top-3 text-slate-400 font-medium">kg</span>
                </div>
              </div>
            </>
          )}
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard label="Your Calculated BMI" value={bmi || '0.0'} color={resultColor} />

          <div className={`p-4 rounded-xl border text-center font-bold text-md transition-all ${categoryColor}`}>
            Category: {category}
          </div>

          {personType === 'adult' && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
              <div className="w-full h-3.5 bg-slate-200 rounded-full flex overflow-hidden relative">
                <div className="w-[18.5%] bg-blue-400 h-full" />
                <div className="w-[6.4%] bg-emerald-500 h-full" />
                <div className="w-[5.0%] bg-amber-400 h-full" />
                <div className="w-[70.1%] bg-rose-500 h-full" />

                {bmi > 0 && (
                  <div
                    style={{
                      left: `${Math.min(96, Math.max(2, (bmi / 40) * 100))}%`,
                    }}
                    className="absolute top-0 w-1 h-3.5 bg-slate-800 -ml-0.5 border border-white"
                    title={`Your BMI: ${bmi}`}
                  />
                )}
              </div>
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>&lt; 18.5</span>
                <span>18.5 - 24.9</span>
                <span>25.0 - 29.9</span>
                <span>30.0 +</span>
              </div>
            </div>
          )}

          {personType === 'child' && (
            <p className="text-xs text-slate-500">
              Child BMI is highly age- and sex-dependent. This estimate uses simplified bands and is not a
              substitute for official CDC/WHO growth chart percentiles from a pediatrician.
            </p>
          )}

          <HealthDisclaimer />
        </div>
      }
    />
  );
}
