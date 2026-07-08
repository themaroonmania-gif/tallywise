'use client';

import React, { useState } from 'react';
import { CalculatorShell, ShellSelect, ResultCard } from '../CalculatorShell';

// Approximate women's clothing size chart
const SIZE_CHART: { us: string; uk: string; eu: string }[] = [
  { us: '0', uk: '4', eu: '32' },
  { us: '2', uk: '6', eu: '34' },
  { us: '4', uk: '8', eu: '36' },
  { us: '6', uk: '10', eu: '38' },
  { us: '8', uk: '12', eu: '40' },
  { us: '10', uk: '14', eu: '42' },
  { us: '12', uk: '16', eu: '44' },
  { us: '14', uk: '18', eu: '46' },
  { us: '16', uk: '20', eu: '48' },
  { us: '18', uk: '22', eu: '50' },
];

export function ClothingSizeConverter() {
  const [usSize, setUsSize] = useState<string>('8');

  const match = SIZE_CHART.find((row) => row.us === usSize) ?? SIZE_CHART[0];

  return (
    <CalculatorShell
      title="Convert Clothing Size"
      inputs={
        <div className="space-y-4">
          <ShellSelect label="US Size (Women's)" value={usSize} onChange={(e) => setUsSize(e.target.value)}>
            {SIZE_CHART.map((row) => (
              <option key={row.us} value={row.us}>{row.us}</option>
            ))}
          </ShellSelect>
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
            Conversions are approximate — actual fit varies by brand and cut.
          </p>
        </div>
      }
      results={
        <div className="grid grid-cols-2 gap-3">
          <ResultCard label="UK Size" value={match.uk} color="indigo" />
          <ResultCard label="EU Size" value={match.eu} color="amber" />
        </div>
      }
    />
  );
}
