'use client';

import React, { useEffect, useState } from 'react';
import { CalculatorShell, ShellInput, ResultCard } from '../CalculatorShell';

export function AcreageCalculator() {
  const [acres, setAcres] = useState<number>(1);
  const [pricePerAcre, setPricePerAcre] = useState<number>(10000);

  const sqft = acres * 43560;
  const sqm = acres * 4046.8564224;
  const hectares = acres * 0.404686;
  const totalPrice = acres * pricePerAcre;

  return (
    <CalculatorShell
      title="Acreage Details"
      inputs={
        <div className="space-y-4">
          <ShellInput label="Acres" value={acres} onChange={(e) => setAcres(Number(e.target.value))} />
          <ShellInput
            label="Price Per Acre (optional)"
            suffix="$"
            value={pricePerAcre}
            onChange={(e) => setPricePerAcre(Number(e.target.value))}
          />
        </div>
      }
      results={
        <div className="space-y-3">
          <ResultCard label="Square Feet" value={sqft.toLocaleString(undefined, { maximumFractionDigits: 0 })} />
          <div className="grid grid-cols-2 gap-3">
            <ResultCard label="Square Meters" value={sqm.toLocaleString(undefined, { maximumFractionDigits: 1 })} color="indigo" />
            <ResultCard label="Hectares" value={hectares.toLocaleString(undefined, { maximumFractionDigits: 4 })} color="emerald" />
          </div>
          {pricePerAcre > 0 && (
            <ResultCard label="Estimated Land Value" value={`$${totalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} color="amber" />
          )}
        </div>
      }
    />
  );
}
