'use client';

import React, { useEffect, useState } from 'react';
import { CalculatorShell, ShellInput, ShellSelect, ResultCard } from '../CalculatorShell';
import { HealthDisclaimer } from './HealthDisclaimer';

type Sex = 'male' | 'female';
type UnitSystem = 'imperial' | 'metric';

export function BodyFrameSizeCalculator() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [sex, setSex] = useState<Sex>('male');
  const [heightIn, setHeightIn] = useState<number>(69);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [wristIn, setWristIn] = useState<number>(6.5);
  const [wristCm, setWristCm] = useState<number>(16.5);
  const [frame, setFrame] = useState<string>('Medium');
  const [ratio, setRatio] = useState<number>(0);

  useEffect(() => {
    const heightInches = unit === 'imperial' ? heightIn : heightCm / 2.54;
    const wristInches = unit === 'imperial' ? wristIn : wristCm / 2.54;

    if (wristInches <= 0) return;
    const r = heightInches / wristInches;
    setRatio(r);

    if (sex === 'female') {
      if (r > 10.9) setFrame('Small');
      else if (r >= 9.9) setFrame('Medium');
      else setFrame('Large');
    } else {
      if (r > 10.4) setFrame('Small');
      else if (r >= 9.6) setFrame('Medium');
      else setFrame('Large');
    }
  }, [unit, sex, heightIn, heightCm, wristIn, wristCm]);

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
          {unit === 'imperial' ? (
            <>
              <ShellInput label="Height" suffix="in" value={heightIn} onChange={(e) => setHeightIn(Number(e.target.value))} />
              <ShellInput label="Wrist Circumference" suffix="in" step="0.1" value={wristIn} onChange={(e) => setWristIn(Number(e.target.value))} />
            </>
          ) : (
            <>
              <ShellInput label="Height" suffix="cm" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} />
              <ShellInput label="Wrist Circumference" suffix="cm" step="0.1" value={wristCm} onChange={(e) => setWristCm(Number(e.target.value))} />
            </>
          )}
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard label="Estimated Frame Size" value={frame} color="rose" />
          <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
            <span>Height-to-Wrist Ratio</span>
            <span>{ratio.toFixed(2)}</span>
          </div>
          <p className="text-sm text-slate-600">
            Body frame size is only a rough estimate based on bone structure proxies and does not account for individual variation.
          </p>
          <HealthDisclaimer />
        </div>
      }
    />
  );
}
