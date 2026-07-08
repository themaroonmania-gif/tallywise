'use client';

import React, { useEffect, useState } from 'react';
import { CalculatorShell, ShellInput, ShellSelect, ResultCard } from '../CalculatorShell';

// Factors convert 1 unit -> milliliters
const VOLUME_UNITS: Record<string, number> = {
  Cups: 236.588,
  Tablespoons: 14.7868,
  Teaspoons: 4.92892,
  Milliliters: 1,
};

// Approximate grams per cup, by ingredient
const INGREDIENT_DENSITY_G_PER_CUP: Record<string, number> = {
  Flour: 120,
  Sugar: 200,
  Butter: 227,
  Water: 236.588,
};

export function CookingConverter() {
  const [value, setValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState('Cups');
  const [toUnit, setToUnit] = useState('Tablespoons');
  const [ingredient, setIngredient] = useState('Flour');
  const [result, setResult] = useState<number>(0);
  const [grams, setGrams] = useState<number>(0);

  useEffect(() => {
    const ml = value * VOLUME_UNITS[fromUnit];
    setResult(ml / VOLUME_UNITS[toUnit]);

    const cups = ml / VOLUME_UNITS.Cups;
    setGrams(cups * INGREDIENT_DENSITY_G_PER_CUP[ingredient]);
  }, [value, fromUnit, toUnit, ingredient]);

  return (
    <CalculatorShell
      title="Convert Cooking Measurements"
      inputs={
        <div className="space-y-4">
          <ShellInput label="Value" value={value} onChange={(e) => setValue(Number(e.target.value))} />
          <ShellSelect label="From Unit" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
            {Object.keys(VOLUME_UNITS).map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </ShellSelect>
          <ShellSelect label="To Unit" value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
            {Object.keys(VOLUME_UNITS).map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </ShellSelect>
          <ShellSelect label="Ingredient (for gram estimate)" value={ingredient} onChange={(e) => setIngredient(e.target.value)}>
            {Object.keys(INGREDIENT_DENSITY_G_PER_CUP).map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </ShellSelect>
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard
            label={`${value} ${fromUnit} equals`}
            value={`${result.toLocaleString(undefined, { maximumFractionDigits: 3 })} ${toUnit}`}
          />
          <ResultCard
            label={`Approx. weight of ${ingredient}`}
            value={`${grams.toLocaleString(undefined, { maximumFractionDigits: 1 })} g`}
            color="amber"
          />
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed text-center">
            Gram values are approximate estimates based on typical ingredient density.
          </p>
        </div>
      }
    />
  );
}
