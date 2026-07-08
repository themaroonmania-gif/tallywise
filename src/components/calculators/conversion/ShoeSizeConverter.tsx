'use client';

import React, { useEffect, useState } from 'react';
import { CalculatorShell, ShellSelect, ResultCard } from '../CalculatorShell';

// Approximate men's shoe size chart, indexed by US size
const SIZE_CHART: { us: number; uk: number; eu: number; cm: number }[] = [
  { us: 6, uk: 5.5, eu: 39, cm: 24 },
  { us: 6.5, uk: 6, eu: 39.5, cm: 24.5 },
  { us: 7, uk: 6.5, eu: 40, cm: 25 },
  { us: 7.5, uk: 7, eu: 40.5, cm: 25.5 },
  { us: 8, uk: 7.5, eu: 41, cm: 26 },
  { us: 8.5, uk: 8, eu: 42, cm: 26.5 },
  { us: 9, uk: 8.5, eu: 42.5, cm: 27 },
  { us: 9.5, uk: 9, eu: 43, cm: 27.5 },
  { us: 10, uk: 9.5, eu: 44, cm: 28 },
  { us: 10.5, uk: 10, eu: 44.5, cm: 28.5 },
  { us: 11, uk: 10.5, eu: 45, cm: 29 },
  { us: 11.5, uk: 11, eu: 45.5, cm: 29.5 },
  { us: 12, uk: 11.5, eu: 46, cm: 30 },
  { us: 13, uk: 12.5, eu: 47, cm: 31 },
];

export function ShoeSizeConverter() {
  const [usSize, setUsSize] = useState<string>('9');

  const closest = SIZE_CHART.reduce((prev, curr) =>
    Math.abs(curr.us - Number(usSize)) < Math.abs(prev.us - Number(usSize)) ? curr : prev
  , SIZE_CHART[0]);

  useEffect(() => {}, [usSize]);

  return (
    <CalculatorShell
      title="Convert Shoe Size"
      inputs={
        <div className="space-y-4">
          <ShellSelect label="US Size (Men's)" value={usSize} onChange={(e) => setUsSize(e.target.value)}>
            {SIZE_CHART.map((row) => (
              <option key={row.us} value={row.us}>{row.us}</option>
            ))}
          </ShellSelect>
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
            Conversions are approximate and based on standard published international sizing charts.
          </p>
        </div>
      }
      results={
        <div className="grid grid-cols-3 gap-3">
          <ResultCard label="UK Size" value={closest.uk} color="indigo" />
          <ResultCard label="EU Size" value={closest.eu} />
          <ResultCard label="Foot (cm)" value={closest.cm} color="amber" />
        </div>
      }
    />
  );
}
