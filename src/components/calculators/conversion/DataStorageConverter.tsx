'use client';

import React, { useEffect, useState } from 'react';
import { CalculatorShell, ShellInput, ShellSelect, ResultCard } from '../CalculatorShell';

const DECIMAL_UNITS: Record<string, number> = {
  Bytes: 1,
  KB: 1000,
  MB: 1000 ** 2,
  GB: 1000 ** 3,
  TB: 1000 ** 4,
};

const BINARY_UNITS: Record<string, number> = {
  Bytes: 1,
  KiB: 1024,
  MiB: 1024 ** 2,
  GiB: 1024 ** 3,
  TiB: 1024 ** 4,
};

export function DataStorageConverter() {
  const [value, setValue] = useState<number>(1);
  const [standard, setStandard] = useState<'Decimal' | 'Binary'>('Decimal');
  const [fromUnit, setFromUnit] = useState('GB');
  const [toUnit, setToUnit] = useState('MB');
  const [result, setResult] = useState<number>(0);

  const units = standard === 'Decimal' ? DECIMAL_UNITS : BINARY_UNITS;

  useEffect(() => {
    // Reset units when switching standard to avoid stale keys
    const keys = Object.keys(units);
    if (!keys.includes(fromUnit)) setFromUnit(keys[3]);
    if (!keys.includes(toUnit)) setToUnit(keys[2]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [standard]);

  useEffect(() => {
    const bytes = value * (units[fromUnit] ?? 1);
    setResult(bytes / (units[toUnit] ?? 1));
  }, [value, fromUnit, toUnit, units]);

  return (
    <CalculatorShell
      title="Convert Data Storage"
      inputs={
        <div className="space-y-4">
          <ShellInput label="Value" value={value} onChange={(e) => setValue(Number(e.target.value))} />
          <ShellSelect label="Standard" value={standard} onChange={(e) => setStandard(e.target.value as 'Decimal' | 'Binary')}>
            <option value="Decimal">Decimal (1 KB = 1,000 bytes)</option>
            <option value="Binary">Binary (1 KiB = 1,024 bytes)</option>
          </ShellSelect>
          <ShellSelect label="From Unit" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
            {Object.keys(units).map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </ShellSelect>
          <ShellSelect label="To Unit" value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
            {Object.keys(units).map((u) => (
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
