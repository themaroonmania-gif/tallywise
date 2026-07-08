'use client';

import React, { useEffect, useState } from 'react';
import { CalculatorShell, ShellInput, ShellSelect, ResultCard } from '../CalculatorShell';
import { HealthDisclaimer } from './HealthDisclaimer';

type Sex = 'male' | 'female';
type UnitSystem = 'imperial' | 'metric';

export function WaistHipRatioCalculator() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [sex, setSex] = useState<Sex>('male');
  const [waist, setWaist] = useState<number>(34);
  const [hip, setHip] = useState<number>(40);
  const [ratio, setRatio] = useState<number>(0);
  const [risk, setRisk] = useState<string>('Low');

  useEffect(() => {
    if (hip <= 0) return;
    const r = waist / hip;
    setRatio(r);

    if (sex === 'male') {
      if (r < 0.9) setRisk('Low');
      else if (r <= 0.99) setRisk('Moderate');
      else setRisk('High');
    } else {
      if (r < 0.8) setRisk('Low');
      else if (r <= 0.84) setRisk('Moderate');
      else setRisk('High');
    }
  }, [unit, sex, waist, hip]);

  const riskColor = risk === 'Low' ? 'emerald' : risk === 'Moderate' ? 'amber' : 'rose';

  return (
    <CalculatorShell
      title="Enter Your Measurements"
      inputs={
        <div className="space-y-4">
          <ShellSelect label="Units" value={unit} onChange={(e) => setUnit(e.target.value as UnitSystem)}>
            <option value="imperial">Imperial (inches)</option>
            <option value="metric">Metric (cm)</option>
          </ShellSelect>
          <ShellSelect label="Sex" value={sex} onChange={(e) => setSex(e.target.value as Sex)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </ShellSelect>
          <ShellInput label="Waist Circumference" suffix={unit === 'imperial' ? 'in' : 'cm'} value={waist} onChange={(e) => setWaist(Number(e.target.value))} />
          <ShellInput label="Hip Circumference" suffix={unit === 'imperial' ? 'in' : 'cm'} value={hip} onChange={(e) => setHip(Number(e.target.value))} />
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard label="Waist-to-Hip Ratio" value={ratio.toFixed(2)} color={riskColor} />
          <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
            <span>WHO Risk Category</span>
            <span>{risk}</span>
          </div>
          <p className="text-sm text-slate-600">
            Waist-to-hip ratio (WHR) is used by the World Health Organization as an indicator of fat distribution and associated cardiovascular risk.
          </p>
          <HealthDisclaimer />
        </div>
      }
    />
  );
}
