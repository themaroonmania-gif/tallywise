'use client';

import React, { useEffect, useState } from 'react';
import { CalculatorShell, ShellInput, ResultCard } from '../CalculatorShell';

export function CmToInchesConverter() {
  const [cm, setCm] = useState<number>(170);
  const [inches, setInches] = useState<number>(0);

  useEffect(() => {
    setInches(cm / 2.54);
  }, [cm]);

  const handleInchesChange = (val: number) => {
    setInches(val);
    setCm(val * 2.54);
  };

  return (
    <CalculatorShell
      title="Convert CM / Inches"
      inputs={
        <div className="space-y-4">
          <ShellInput label="Centimeters" suffix="cm" value={cm} onChange={(e) => setCm(Number(e.target.value))} />
          <ShellInput
            label="Inches"
            suffix="in"
            value={Number(inches.toFixed(4))}
            onChange={(e) => handleInchesChange(Number(e.target.value))}
          />
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard label={`${cm} cm equals`} value={`${inches.toFixed(2)} in`} />
          <ResultCard label={`${inches.toFixed(2)} in equals`} value={`${cm.toFixed(2)} cm`} color="indigo" />
        </div>
      }
    />
  );
}
