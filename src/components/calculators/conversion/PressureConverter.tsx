'use client';

import React, { useEffect, useState } from 'react';
import { CalculatorShell, ShellInput, ShellSelect, ResultCard } from '../CalculatorShell';

// Factors convert 1 unit -> pascals
const UNITS: Record<string, number> = {
  PSI: 6894.75729,
  Bar: 100000,
  Pascal: 1,
  Atmosphere: 101325,
};

export function PressureConverter() {
  const [value, setValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState('PSI');
  const [toUnit, setToUnit] = useState('Bar');
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    const pa = value * UNITS[fromUnit];
    setResult(pa / UNITS[toUnit]);
  }, [value, fromUnit, toUnit]);

  return (
    <CalculatorShell
      title="Convert Pressure"
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
