'use client';

import React, { useEffect, useState } from 'react';
import { CalculatorShell, ShellInput, ResultCard } from '../CalculatorShell';

export function PpmCalculator() {
  const [ppm, setPpm] = useState<number>(500);
  const [percent, setPercent] = useState<number>(0);

  useEffect(() => {
    setPercent(ppm / 10000);
  }, [ppm]);

  const handlePercentChange = (val: number) => {
    setPercent(val);
    setPpm(val * 10000);
  };

  return (
    <CalculatorShell
      title="Convert PPM / Percent"
      inputs={
        <div className="space-y-4">
          <ShellInput label="Parts Per Million (PPM)" value={ppm} onChange={(e) => setPpm(Number(e.target.value))} />
          <ShellInput
            label="Percent (%)"
            value={Number(percent.toFixed(6))}
            onChange={(e) => handlePercentChange(Number(e.target.value))}
          />
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard label={`${ppm} ppm equals`} value={`${percent.toFixed(4)}%`} />
          <ResultCard label="Ratio form" value={`1 : ${ppm > 0 ? (1000000 / ppm).toLocaleString(undefined, { maximumFractionDigits: 1 }) : '0'}`} color="indigo" />
        </div>
      }
    />
  );
}
