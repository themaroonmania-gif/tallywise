'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorShell, ShellSelect } from './CalculatorShell';
import { HealthDisclaimer } from './health/HealthDisclaimer';

export function CalorieCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(30);
  const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('imperial');

  // Height & Weight
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(10);
  const [heightCm, setHeightCm] = useState<number>(178);
  const [weightLbs, setWeightLbs] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(79.5);

  const [activityLevel, setActivityLevel] = useState<number>(1.375); // Lightly active default
  const [goal, setGoal] = useState<number>(-500); // weight loss (-500 cal) default

  const [results, setResults] = useState({
    bmr: 0,
    tdee: 0,
    targetCalories: 0,
    proteinGrams: 0,
    carbsGrams: 0,
    fatGrams: 0,
  });

  const activityOptions = [
    { label: 'Sedentary (Little or no exercise)', multiplier: 1.2 },
    { label: 'Lightly Active (Exercise 1-3 days/week)', multiplier: 1.375 },
    { label: 'Moderately Active (Exercise 3-5 days/week)', multiplier: 1.55 },
    { label: 'Very Active (Hard exercise 6-7 days/week)', multiplier: 1.725 },
    { label: 'Extremely Active (Athletic training/physical job)', multiplier: 1.9 },
  ];

  const goalOptions = [
    { label: 'Lose Weight (~1 lb/week)', adjustment: -500 },
    { label: 'Mild Weight Loss (~0.5 lb/week)', adjustment: -250 },
    { label: 'Maintain Weight', adjustment: 0 },
    { label: 'Mild Weight Gain (~0.5 lb/week)', adjustment: 250 },
    { label: 'Gain Weight (~1 lb/week)', adjustment: 500 },
  ];

  useEffect(() => {
    let weight = weightKg;
    let height = heightCm;

    if (unitSystem === 'imperial') {
      weight = weightLbs * 0.453592; // lbs to kg
      height = ((heightFt * 12) + heightIn) * 2.54; // inches to cm
    }

    // Mifflin-St Jeor Equation
    let bmr = 0;
    if (gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    const tdee = bmr * activityLevel;
    const targetCalories = Math.max(1200, tdee + goal); // Set safe floor of 1200 calories

    // Simplified Macronutrient Breakdown based on standard healthy ratio:
    // 30% Protein, 40% Carbs, 30% Fats
    // 1g Protein = 4 cal, 1g Carb = 4 cal, 1g Fat = 9 cal
    const proteinGrams = (targetCalories * 0.30) / 4;
    const carbsGrams = (targetCalories * 0.40) / 4;
    const fatGrams = (targetCalories * 0.30) / 9;

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      proteinGrams: Math.round(proteinGrams),
      carbsGrams: Math.round(carbsGrams),
      fatGrams: Math.round(fatGrams),
    });
  }, [gender, age, unitSystem, heightFt, heightIn, heightCm, weightLbs, weightKg, activityLevel, goal]);

  return (
    <CalculatorShell
      title="Body & Goal Inputs"
      inputs={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ShellSelect label="Biological Sex" value={gender} onChange={(e) => setGender(e.target.value as 'male' | 'female')}>
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

            {unitSystem === 'imperial' ? (
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Weight (lbs)</label>
                <input
                  type="number"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800"
                />
              </div>
            ) : (
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800"
                />
              </div>
            )}
          </div>

          {unitSystem === 'imperial' ? (
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
                    onChange={(e) => setHeightIn(Number(e.target.value))}
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800"
                  />
                  <span className="absolute right-4 top-3 text-slate-400 font-medium">in</span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-slate-800"
              />
            </div>
          )}

          <ShellSelect label="Activity Level" value={activityLevel} onChange={(e) => setActivityLevel(Number(e.target.value))}>
            {activityOptions.map((opt) => (
              <option key={opt.multiplier} value={opt.multiplier}>
                {opt.label}
              </option>
            ))}
          </ShellSelect>

          <ShellSelect label="Fitness Goal" value={goal} onChange={(e) => setGoal(Number(e.target.value))}>
            {goalOptions.map((opt) => (
              <option key={opt.adjustment} value={opt.adjustment}>
                {opt.label}
              </option>
            ))}
          </ShellSelect>
        </div>
      }
      results={
        <div className="space-y-4">
          <div className="bg-rose-600 text-white rounded-xl p-6 text-center shadow-md shadow-rose-600/10">
            <span className="text-xs font-bold uppercase tracking-wider opacity-85 block mb-1">
              Target Daily Calorie Intake
            </span>
            <div className="text-4xl font-extrabold tracking-tight">
              {results.targetCalories} <span className="text-lg font-medium opacity-80">kcal</span>
            </div>
            <div className="text-xs opacity-75 mt-1">
              To reach your selected fitness goal
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-200/50">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-0.5">
                BMR (Base Needs)
              </span>
              <div className="text-md font-bold text-slate-800">
                {results.bmr} kcal
              </div>
            </div>
            <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-200/50">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-0.5">
                TDEE (Daily Burn)
              </span>
              <div className="text-md font-bold text-slate-800">
                {results.tdee} kcal
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-200/60">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Recommended Daily Macronutrients
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-white rounded-xl border border-slate-150 shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mx-auto mb-1"></div>
                <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Protein</span>
                <span className="text-md font-bold text-slate-800">{results.proteinGrams}g</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">30%</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-150 shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mx-auto mb-1"></div>
                <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Carbohydrates</span>
                <span className="text-md font-bold text-slate-800">{results.carbsGrams}g</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">40%</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-150 shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mx-auto mb-1"></div>
                <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Fats</span>
                <span className="text-md font-bold text-slate-800">{results.fatGrams}g</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">30%</span>
              </div>
            </div>
          </div>

          <HealthDisclaimer />
        </div>
      }
    />
  );
}
