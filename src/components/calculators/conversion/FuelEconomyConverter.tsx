'use client';

import React, { useEffect, useState } from 'react';
import { CalculatorShell, ShellInput, ShellSelect, ResultCard } from '../CalculatorShell';

type Unit = 'MPG (US)' | 'L/100km' | 'km/L';

function toLPer100km(value: number, unit: Unit): number {
  if (unit === 'L/100km') return value;
  if (unit === 'MPG (US)') return value > 0 ? 235.214583 / value : 0;
  // km/L
  return value > 0 ? 100 / value : 0;
}

function fromLPer100km(lPer100km: number, unit: Unit): number {
  if (unit === 'L/100km') return lPer100km;
  if (unit === 'MPG (US)') return lPer100km > 0 ? 235.214583 / lPer100km : 0;
  return lPer100km > 0 ? 100 / lPer100km : 0;
}

export function FuelEconomyConverter() {
  const [value, setValue] = useState<number>(30);
  const [fromUnit, setFromUnit] = useState<Unit>('MPG (US)');
  const [toUnit, setToUnit] = useState<Unit>('L/100km');
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    const l100 = toLPer100km(value, fromUnit);
    setResult(fromLPer100km(l100, toUnit));
  }, [value, fromUnit, toUnit]);

  const units: Unit[] = ['MPG (US)', 'L/100km', 'km/L'];

  return (
    <CalculatorShell
      title="Convert Fuel Economy"
      inputs={
        <div className="space-y-4">
          <ShellInput label="Value" value={value} onChange={(e) => setValue(Number(e.target.value))} />
          <ShellSelect label="From Unit" value={fromUnit} onChange={(e) => setFromUnit(e.target.value as Unit)}>
            {units.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </ShellSelect>
          <ShellSelect label="To Unit" value={toUnit} onChange={(e) => setToUnit(e.target.value as Unit)}>
            {units.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </ShellSelect>
        </div>
      }
      results={
        <ResultCard
          label={`${value} ${fromUnit} equals`}
          value={`${result.toLocaleString(undefined, { maximumFractionDigits: 3 })} ${toUnit}`}
        />
      }
    />
  );
}
