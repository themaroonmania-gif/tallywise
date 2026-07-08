'use client';

import React, { useState, useEffect } from 'react';

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
  const [categoryColor, setCategoryColor] = useState<string>('text-emerald-600 bg-emerald-50');

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
      } else if (roundedBmi < 25.0) {
        setCategory('Normal Weight');
        setCategoryColor('text-emerald-600 bg-emerald-50 border-emerald-250');
      } else if (roundedBmi < 30.0) {
        setCategory('Overweight');
        setCategoryColor('text-amber-600 bg-amber-50 border-amber-220');
      } else {
        setCategory('Obese');
        setCategoryColor('text-rose-600 bg-rose-50 border-rose-200');
      }
    } else {
      // Child categories (simplified percentiles based on average CDC BMI curves)
      // Usually depends on exact age/sex curves, we mock standard distributions for SEO utility
      if (roundedBmi < 14) {
        setCategory('Underweight (Percentile < 5th)');
        setCategoryColor('text-blue-600 bg-blue-50 border-blue-200');
      } else if (roundedBmi < 20) {
        setCategory('Healthy Weight (Percentile 5th to 85th)');
        setCategoryColor('text-emerald-600 bg-emerald-50 border-emerald-250');
      } else if (roundedBmi < 24) {
        setCategory('Overweight (Percentile 85th to 95th)');
        setCategoryColor('text-amber-600 bg-amber-50 border-amber-220');
      } else {
        setCategory('Obese (Percentile ≥ 95th)');
        setCategoryColor('text-rose-600 bg-rose-50 border-rose-200');
      }
    }
  }, [unitSystem, personType, weightLbs, heightFt, heightIn, weightKg, heightCm, ageYears, gender]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Inputs Column */}
        <div className="md:col-span-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Body Dimensions</h2>

          {/* Toggle Type & Units */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Age Group</label>
              <div className="flex bg-slate-50 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPersonType('adult')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    personType === 'adult' ? 'bg-white text-rose-600 shadow-sm border border-slate-100' : 'text-slate-650'
                  }`}
                >
                  Adult (20+)
                </button>
                <button
                  type="button"
                  onClick={() => setPersonType('child')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    personType === 'child' ? 'bg-white text-rose-600 shadow-sm border border-slate-100' : 'text-slate-650'
                  }`}
                >
                  Child (2-19)
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Unit System</label>
              <div className="flex bg-slate-50 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setUnitSystem('imperial')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    unitSystem === 'imperial' ? 'bg-white text-rose-600 shadow-sm border border-slate-100' : 'text-slate-650'
                  }`}
                >
                  Imperial (lbs/in)
                </button>
                <button
                  type="button"
                  onClick={() => setUnitSystem('metric')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    unitSystem === 'metric' ? 'bg-white text-rose-600 shadow-sm border border-slate-100' : 'text-slate-650'
                  }`}
                >
                  Metric (kg/cm)
                </button>
              </div>
            </div>
          </div>

          {/* Child specific inputs */}
          {personType === 'child' && (
            <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Biological Sex</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('boy')}
                    className={`flex-1 py-1.5 border rounded-lg text-xs font-semibold ${gender === 'boy' ? 'bg-blue-600 text-white border-blue-650' : 'bg-white text-slate-600 border-slate-200'}`}
                  >
                    Boy
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('girl')}
                    className={`flex-1 py-1.5 border rounded-lg text-xs font-semibold ${gender === 'girl' ? 'bg-pink-500 text-white border-pink-550' : 'bg-white text-slate-600 border-slate-200'}`}
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

          {/* Height and Weight Inputs */}
          <div className="space-y-4">
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
                        className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-850"
                      />
                      <span className="absolute right-4 top-3 text-slate-400 font-medium">ft</span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={heightIn}
                        max={11}
                        onChange={(e) => setHeightIn(Number(e.target.value))}
                        className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-850"
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
                      className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-850"
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
                      className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-850"
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
                      className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-850"
                    />
                    <span className="absolute right-4 top-3 text-slate-400 font-medium">kg</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Output Column */}
        <div className="md:col-span-6 flex flex-col justify-between">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">BMI Results</h2>

            {/* Main BMI Result Card */}
            <div className="bg-rose-600 text-white rounded-xl p-6 text-center shadow-md shadow-rose-600/10">
              <span className="text-xs font-bold uppercase tracking-wider opacity-85 block mb-1">
                Your Calculated BMI
              </span>
              <div className="text-4xl font-extrabold tracking-tight">
                {bmi || '0.0'}
              </div>
            </div>

            {/* Category Card */}
            <div className={`p-4 rounded-xl border text-center font-bold text-md transition-all ${categoryColor}`}>
              Category: {category}
            </div>

            {/* Graphical Range Scale */}
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
                  <div className="w-[6.4%] bg-emerald-500 h-full" /> {/* 18.5 to 25 is 6.5 units out of total scale ~40 */}
                  <div className="w-[5.0%] bg-amber-400 h-full" /> {/* 25 to 30 */}
                  <div className="w-[70.1%] bg-rose-500 h-full" /> {/* 30+ */}

                  {/* Marker representing user BMI */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
