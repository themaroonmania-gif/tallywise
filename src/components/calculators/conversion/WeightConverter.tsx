'use client';

import React, { useEffect, useState } from 'react';
import { CalculatorShell, ShellInput, ShellSelect, ResultCard } from '../CalculatorShell';

// Factors convert 1 unit -> kilograms
const UNITS: Record<string, number> = {
  Kilograms: 1,
  Pounds: 0.45359237,
  Ounces: 0.028349523125,
  Grams: 0.001,
  'Metric Tons': 1000,
};

export function WeightConverter() {
  const [value, setValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState('Kilograms');
  const [toUnit, setToUnit] = useState('Pounds');
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    const kg = value * UNITS[fromUnit];
    setResult(kg / UNITS[toUnit]);
  }, [value, fromUnit, toUnit]);

  return (
    <CalculatorShell
      title="Convert Weight"
      inputs={
        <div className="space-y-4">
          <ShellInput label="Value" value={value} onChange={(e) => setValue(Number(e.target.value))} />
          <ShellSelect label="From Unit" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
            {Object.keys(UNITS).map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </ShellSelect>
          <ShellSelect label="To Unit" value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
            {Object.keys(UNITS).map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </ShellSelect>
        </div>
      }
      results={
        <ResultCard
          label={`${value} ${fromUnit} equals`}
          value={`${result.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${toUnit}`}
        />
      }
    />
  );
}
