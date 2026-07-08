'use client';

import React, { useEffect, useState } from 'react';
import { CalculatorShell, ShellInput, ShellSelect, ResultCard } from '../CalculatorShell';

// Factors convert 1 unit -> square meters
const UNITS: Record<string, number> = {
  'Square Meters': 1,
  'Square Feet': 0.09290304,
  Acres: 4046.8564224,
  Hectares: 10000,
};

export function AreaConverter() {
  const [value, setValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState('Acres');
  const [toUnit, setToUnit] = useState('Square Feet');
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    const sqm = value * UNITS[fromUnit];
    setResult(sqm / UNITS[toUnit]);
  }, [value, fromUnit, toUnit]);

  return (
    <CalculatorShell
      title="Convert Area"
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
          value={`${result.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${toUnit}`}
        />
      }
    />
  );
}
