'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorShell, ShellInput, ResultCard } from './CalculatorShell';
import { HealthDisclaimer } from './health/HealthDisclaimer';

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
      warning = 'Unsafe weight loss rate. Losing more than 2 lbs (0.9 kg) per week is generally not recommended without consulting a healthcare professional.';
    } else if (dailyCalorieTarget < 1200) {
      warning = 'Very low calorie target. Consuming fewer than 1,200 calories per day is generally considered unsafe for long-term health.';
    }

    setResults({
      weightToLose: wToLose,
      dailyDeficit: Math.round(dailyDeficit),
      dailyCalorieTarget: Math.round(dailyCalorieTarget),
      warning,
    });
  }, [currentWeight, targetWeight, timeframeWeeks, tdee]);

  return (
    <CalculatorShell
      title="Weight Loss Goal Details"
      inputs={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ShellInput label="Current Weight" suffix="lbs" value={currentWeight} onChange={(e) => setCurrentWeight(Number(e.target.value))} />
            <ShellInput label="Target Weight" suffix="lbs" value={targetWeight} onChange={(e) => setTargetWeight(Number(e.target.value))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ShellInput label="Timeframe" suffix="weeks" value={timeframeWeeks} onChange={(e) => setTimeframeWeeks(Number(e.target.value))} />
            <ShellInput label="Your Daily TDEE" suffix="kcal" value={tdee} onChange={(e) => setTdee(Number(e.target.value))} />
          </div>
          <p className="text-xs text-slate-500">
            Don&apos;t know your TDEE? Use our Calorie Calculator (TDEE) to estimate it from your age, sex, height, weight, and activity level.
          </p>
        </div>
      }
      results={
        <div className="space-y-4">
          {results.warning && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-xs leading-relaxed font-semibold">
              {results.warning}
            </div>
          )}

          <ResultCard label="Target Daily Calories" value={`${results.dailyCalorieTarget} kcal/day`} color="rose" />

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
              <span>Weight to Lose</span>
              <span>{results.weightToLose} lbs</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>Required Daily Deficit</span>
              <span className="text-rose-600 font-semibold">-{results.dailyDeficit} kcal/day</span>
            </div>
          </div>

          <HealthDisclaimer />
        </div>
      }
    />
  );
}
