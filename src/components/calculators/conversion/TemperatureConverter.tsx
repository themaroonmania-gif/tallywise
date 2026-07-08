'use client';

import React, { useEffect, useState } from 'react';
import { CalculatorShell, ShellInput, ShellSelect, ResultCard } from '../CalculatorShell';

type Scale = 'Celsius' | 'Fahrenheit' | 'Kelvin';

function toCelsius(value: number, scale: Scale): number {
  if (scale === 'Celsius') return value;
  if (scale === 'Fahrenheit') return (value - 32) * (5 / 9);
  return value - 273.15;
}

function fromCelsius(celsius: number, scale: Scale): number {
  if (scale === 'Celsius') return celsius;
  if (scale === 'Fahrenheit') return celsius * (9 / 5) + 32;
  return celsius + 273.15;
}

export function TemperatureConverter() {
  const [value, setValue] = useState<number>(0);
  const [fromUnit, setFromUnit] = useState<Scale>('Celsius');
  const [toUnit, setToUnit] = useState<Scale>('Fahrenheit');
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    const c = toCelsius(value, fromUnit);
    setResult(fromCelsius(c, toUnit));
  }, [value, fromUnit, toUnit]);

  const units: Scale[] = ['Celsius', 'Fahrenheit', 'Kelvin'];

  return (
    <CalculatorShell
      title="Convert Temperature"
      inputs={
        <div className="space-y-4">
          <ShellInput label="Value" value={value} onChange={(e) => setValue(Number(e.target.value))} />
          <ShellSelect label="From" value={fromUnit} onChange={(e) => setFromUnit(e.target.value as Scale)}>
            {units.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </ShellSelect>
          <ShellSelect label="To" value={toUnit} onChange={(e) => setToUnit(e.target.value as Scale)}>
            {units.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </ShellSelect>
        </div>
      }
      results={
        <ResultCard
          label={`${value}° ${fromUnit} equals`}
          value={`${result.toLocaleString(undefined, { maximumFractionDigits: 2 })}° ${toUnit}`}
        />
      }
    />
  );
}
