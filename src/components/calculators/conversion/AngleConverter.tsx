'use client';

import React, { useEffect, useState } from 'react';
import { CalculatorShell, ShellInput, ShellSelect, ResultCard } from '../CalculatorShell';

// Factors convert 1 unit -> degrees
const UNITS: Record<string, number> = {
  Degrees: 1,
  Radians: 180 / Math.PI,
  Gradians: 0.9,
};

export function AngleConverter() {
  const [value, setValue] = useState<number>(90);
  const [fromUnit, setFromUnit] = useState('Degrees');
  const [toUnit, setToUnit] = useState('Radians');
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    const degrees = value * UNITS[fromUnit];
    setResult(degrees / UNITS[toUnit]);
  }, [value, fromUnit, toUnit]);

  return (
    <CalculatorShell
      title="Convert Angle"
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
