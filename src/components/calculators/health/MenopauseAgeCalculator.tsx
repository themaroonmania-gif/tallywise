'use client';

import React, { useEffect, useState } from 'react';
import { CalculatorShell, ShellInput, ShellSelect, ResultCard } from '../CalculatorShell';
import { HealthDisclaimer } from './HealthDisclaimer';

type SmokingStatus = 'no' | 'yes';

export function MenopauseAgeCalculator() {
  const [currentAge, setCurrentAge] = useState<number>(40);
  const [motherAge, setMotherAge] = useState<number>(51);
  const [smoking, setSmoking] = useState<SmokingStatus>('no');

  const [estimateLow, setEstimateLow] = useState<number>(0);
  const [estimateHigh, setEstimateHigh] = useState<number>(0);

  useEffect(() => {
    // Base average is 51; genetics (mother's age) is the strongest predictor
    let center = 51;
    if (motherAge > 0) {
      center = 0.5 * 51 + 0.5 * motherAge;
    }
    if (smoking === 'yes') {
      center -= 1.5;
    }

    setEstimateLow(Math.round(center - 2));
    setEstimateHigh(Math.round(center + 2));
  }, [currentAge, motherAge, smoking]);

  return (
    <CalculatorShell
      title="Enter Your Details"
      inputs={
        <div className="space-y-4">
          <ShellInput label="Your Current Age" suffix="years" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} />
          <ShellInput label="Mother's Age at Menopause (optional)" suffix="years" value={motherAge} onChange={(e) => setMotherAge(Number(e.target.value))} />
          <ShellSelect label="Do You Smoke?" value={smoking} onChange={(e) => setSmoking(e.target.value as SmokingStatus)}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </ShellSelect>
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard label="Estimated Menopause Age Range" value={`${estimateLow}-${estimateHigh} years`} color="rose" />
          <p className="text-sm text-slate-600">
            The average age of menopause is 51, and genetics (such as your mother&apos;s age at menopause) is the strongest known predictor. Smokers tend to reach menopause about 1-2 years earlier on average.
          </p>
          <p className="text-sm text-slate-600 font-semibold">
            This is a rough statistical estimate, not a diagnosis.
          </p>
          <HealthDisclaimer />
        </div>
      }
    />
  );
}
