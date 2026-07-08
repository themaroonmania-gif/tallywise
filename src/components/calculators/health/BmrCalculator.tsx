'use client';

import React, { useEffect, useState } from 'react';
import { CalculatorShell, ShellInput, ShellSelect, ResultCard } from '../CalculatorShell';
import { HealthDisclaimer } from './HealthDisclaimer';

type Sex = 'male' | 'female';
type UnitSystem = 'metric' | 'imperial';

export function BmrCalculator() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState<number>(30);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(9);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightLbs, setWeightLbs] = useState<number>(160);
  const [weightKg, setWeightKg] = useState<number>(73);
  const [bmr, setBmr] = useState<number>(0);

  useEffect(() => {
    let weightKgVal: number;
    let heightCmVal: number;

    if (unit === 'imperial') {
      weightKgVal = weightLbs * 0.45359237;
      heightCmVal = (heightFt * 12 + heightIn) * 2.54;
    } else {
      weightKgVal = weightKg;
      heightCmVal = heightCm;
    }

    const base = 10 * weightKgVal + 6.25 * heightCmVal - 5 * age;
    const result = sex === 'male' ? base + 5 : base - 161;
    setBmr(Math.max(0, Math.round(result)));
  }, [unit, sex, age, heightFt, heightIn, heightCm, weightLbs, weightKg]);

  return (
    <CalculatorShell
      title="Enter Your Details"
      inputs={
        <div className="space-y-4">
          <ShellSelect label="Units" value={unit} onChange={(e) => setUnit(e.target.value as UnitSystem)}>
            <option value="imperial">Imperial (lb, ft/in)</option>
            <option value="metric">Metric (kg, cm)</option>
          </ShellSelect>
          <ShellSelect label="Sex" value={sex} onChange={(e) => setSex(e.target.value as Sex)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </ShellSelect>
          <ShellInput label="Age" suffix="years" value={age} onChange={(e) => setAge(Number(e.target.value))} />
          {unit === 'imperial' ? (
            <div className="grid grid-cols-2 gap-3">
              <ShellInput label="Height (ft)" suffix="ft" value={heightFt} onChange={(e) => setHeightFt(Number(e.target.value))} />
              <ShellInput label="Height (in)" suffix="in" value={heightIn} onChange={(e) => setHeightIn(Number(e.target.value))} />
            </div>
          ) : (
            <ShellInput label="Height" suffix="cm" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} />
          )}
          {unit === 'imperial' ? (
            <ShellInput label="Weight" suffix="lbs" value={weightLbs} onChange={(e) => setWeightLbs(Number(e.target.value))} />
          ) : (
            <ShellInput label="Weight" suffix="kg" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} />
          )}
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard label="Your BMR" value={`${bmr.toLocaleString()} cal/day`} color="rose" />
          <p className="text-sm text-slate-600">
            This is the number of calories your body burns at complete rest. Multiply by an activity factor to estimate your Total Daily Energy Expenditure (TDEE).
          </p>
          <HealthDisclaimer />
        </div>
      }
    />
  );
}
