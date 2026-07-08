'use client';

import React, { useEffect, useState } from 'react';
import { CalculatorShell, ShellInput, ShellSelect, ResultCard } from '../CalculatorShell';

// Factors convert 1 unit -> km/h
const UNITS: Record<string, number> = {
  'Miles per hour': 1.609344,
  'Kilometers per hour': 1,
  'Meters per second': 3.6,
  Knots: 1.852,
};

export function SpeedConverter() {
  const [value, setValue] = useState<number>(60);
  const [fromUnit, setFromUnit] = useState('Miles per hour');
  const [toUnit, setToUnit] = useState('Kilometers per hour');
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    const kph = value * UNITS[fromUnit];
    setResult(kph / UNITS[toUnit]);
  }, [value, fromUnit, toUnit]);

  return (
    <CalculatorShell
      title="Convert Speed"
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
