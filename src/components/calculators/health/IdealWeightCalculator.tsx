'use client';

import React, { useEffect, useState } from 'react';
import { CalculatorShell, ShellInput, ShellSelect, ResultCard } from '../CalculatorShell';
import { HealthDisclaimer } from './HealthDisclaimer';

type Sex = 'male' | 'female';

export function IdealWeightCalculator() {
  const [sex, setSex] = useState<Sex>('male');
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(9);
  const [devineKg, setDevineKg] = useState<number>(0);
  const [robinsonKg, setRobinsonKg] = useState<number>(0);

  useEffect(() => {
    const totalInches = heightFt * 12 + heightIn;
    const inchesOver5ft = Math.max(0, totalInches - 60);

    const devine = sex === 'male'
      ? 50 + 2.3 * inchesOver5ft
      : 45.5 + 2.3 * inchesOver5ft;

    const robinson = sex === 'male'
      ? 52 + 1.9 * inchesOver5ft
      : 49 + 1.7 * inchesOver5ft;

    setDevineKg(Math.max(0, devine));
    setRobinsonKg(Math.max(0, robinson));
  }, [sex, heightFt, heightIn]);

  const toLbs = (kg: number) => (kg * 2.20462).toFixed(1);

  return (
    <CalculatorShell
      title="Enter Your Details"
      inputs={
        <div className="space-y-4">
          <ShellSelect label="Sex" value={sex} onChange={(e) => setSex(e.target.value as Sex)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </ShellSelect>
          <div className="grid grid-cols-2 gap-3">
            <ShellInput label="Height (ft)" suffix="ft" value={heightFt} onChange={(e) => setHeightFt(Number(e.target.value))} />
            <ShellInput label="Height (in)" suffix="in" value={heightIn} onChange={(e) => setHeightIn(Number(e.target.value))} />
          </div>
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard label="Ideal Weight (Devine)" value={`${devineKg.toFixed(1)} kg / ${toLbs(devineKg)} lbs`} color="rose" />
          <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
            <span>Robinson Formula Estimate</span>
            <span>{robinsonKg.toFixed(1)} kg / {toLbs(robinsonKg)} lbs</span>
          </div>
          <p className="text-sm text-slate-600">
            These formulas provide two commonly used clinical estimates of ideal body weight based on height and sex. Individual healthy weight varies by frame size, muscle mass, and body composition.
          </p>
          <HealthDisclaimer />
        </div>
      }
    />
  );
}
