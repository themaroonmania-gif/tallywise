'use client';

import React, { useEffect, useState } from 'react';
import { CalculatorShell, ShellInput, ShellSelect, ResultCard } from '../CalculatorShell';

// Factors convert 1 unit -> kg/m3
const UNITS: Record<string, number> = {
  'kg/m3': 1,
  'g/cm3': 1000,
  'lb/ft3': 16.0185,
};

export function DensityConverter() {
  const [value, setValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState('g/cm3');
  const [toUnit, setToUnit] = useState('kg/m3');
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    const kgm3 = value * UNITS[fromUnit];
    setResult(kgm3 / UNITS[toUnit]);
  }, [value, fromUnit, toUnit]);

  return (
    <CalculatorShell
      title="Convert Density"
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
