'use client';

import React, { useEffect, useState } from 'react';
import { CalculatorShell, ShellInput, ResultCard } from '../CalculatorShell';
import { HealthDisclaimer } from './HealthDisclaimer';

interface Zone {
  name: string;
  pctLow: number;
  pctHigh: number;
  bpmLow: number;
  bpmHigh: number;
}

export function HeartRateZoneCalculator() {
  const [age, setAge] = useState<number>(30);
  const [maxHr, setMaxHr] = useState<number>(0);
  const [zones, setZones] = useState<Zone[]>([]);

  useEffect(() => {
    const max = Math.max(0, 220 - age);
    setMaxHr(max);

    const ranges: [string, number, number][] = [
      ['Zone 1 – Very Light', 50, 60],
      ['Zone 2 – Light', 60, 70],
      ['Zone 3 – Moderate', 70, 80],
      ['Zone 4 – Hard', 80, 90],
      ['Zone 5 – Maximum', 90, 100],
    ];

    setZones(
      ranges.map(([name, low, high]) => ({
        name,
        pctLow: low,
        pctHigh: high,
        bpmLow: Math.round((low / 100) * max),
        bpmHigh: Math.round((high / 100) * max),
      }))
    );
  }, [age]);

  return (
    <CalculatorShell
      title="Enter Your Age"
      inputs={
        <div className="space-y-4">
          <ShellInput label="Age" suffix="years" value={age} onChange={(e) => setAge(Number(e.target.value))} />
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard label="Estimated Max Heart Rate" value={`${maxHr} bpm`} color="rose" />
          <div className="space-y-2 text-sm font-semibold text-slate-700">
            {zones.map((z) => (
              <div key={z.name} className="flex justify-between items-center">
                <span>{z.name} ({z.pctLow}-{z.pctHigh}%)</span>
                <span>{z.bpmLow}-{z.bpmHigh} bpm</span>
              </div>
            ))}
          </div>
          <HealthDisclaimer />
        </div>
      }
    />
  );
}
