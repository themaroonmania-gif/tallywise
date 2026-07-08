'use client';

import React, { useState, useEffect } from 'react';

export function UnitConverter() {
  const [conversionType, setConversionType] = useState<'length' | 'weight' | 'temp'>('length');
  const [value, setValue] = useState<number>(1);

  // Length units
  const [lengthFrom, setLengthFrom] = useState<string>('m');
  const [lengthTo, setLengthTo] = useState<string>('ft');

  // Weight units
  const [weightFrom, setWeightFrom] = useState<string>('kg');
  const [weightTo, setWeightTo] = useState<string>('lb');

  // Temp units
  const [tempFrom, setTempFrom] = useState<string>('C');
  const [tempTo, setTempTo] = useState<string>('F');

  const [result, setResult] = useState<number>(0);

  const lengthUnits: Record<string, { label: string; ratio: number }> = {
    m: { label: 'Meters (m)', ratio: 1 },
    cm: { label: 'Centimeters (cm)', ratio: 0.01 },
    km: { label: 'Kilometers (km)', ratio: 1000 },
    in: { label: 'Inches (in)', ratio: 0.0254 },
    ft: { label: 'Feet (ft)', ratio: 0.3048 },
    yd: { label: 'Yards (yd)', ratio: 0.9144 },
    mi: { label: 'Miles (mi)', ratio: 1609.34 },
  };

  const weightUnits: Record<string, { label: string; ratio: number }> = {
    kg: { label: 'Kilograms (kg)', ratio: 1 },
    g: { label: 'Grams (g)', ratio: 0.001 },
    lb: { label: 'Pounds (lb)', ratio: 0.45359237 },
    oz: { label: 'Ounces (oz)', ratio: 0.0283495231 },
  };

  useEffect(() => {
    let convertedValue = 0;

    if (conversionType === 'length') {
      const fromObj = lengthUnits[lengthFrom];
      const toObj = lengthUnits[lengthTo];
      if (fromObj && toObj) {
        // Convert to base (meters), then to destination
        const meters = value * fromObj.ratio;
        convertedValue = meters / toObj.ratio;
      }
    } else if (conversionType === 'weight') {
      const fromObj = weightUnits[weightFrom];
      const toObj = weightUnits[weightTo];
      if (fromObj && toObj) {
        // Convert to base (kg), then to destination
        const kg = value * fromObj.ratio;
        convertedValue = kg / toObj.ratio;
      }
    } else {
      // Temperature conversion
      if (tempFrom === tempTo) {
        convertedValue = value;
      } else if (tempFrom === 'C' && tempTo === 'F') {
        convertedValue = (value * 9/5) + 32;
      } else if (tempFrom === 'C' && tempTo === 'K') {
        convertedValue = value + 273.15;
      } else if (tempFrom === 'F' && tempTo === 'C') {
        convertedValue = (value - 32) * 5/9;
      } else if (tempFrom === 'F' && tempTo === 'K') {
        convertedValue = (value - 32) * 5/9 + 273.15;
      } else if (tempFrom === 'K' && tempTo === 'C') {
        convertedValue = value - 273.15;
      } else if (tempFrom === 'K' && tempTo === 'F') {
        convertedValue = (value - 273.15) * 9/5 + 32;
      }
    }

    setResult(Number(convertedValue.toFixed(4)));
  }, [conversionType, value, lengthFrom, lengthTo, weightFrom, weightTo, tempFrom, tempTo]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Conversion Details</h2>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Category</label>
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setConversionType('length')}
                className={`py-2 rounded-lg font-medium text-xs transition-all ${
                  conversionType === 'length' ? 'bg-white text-amber-600 shadow-sm border border-slate-100' : 'text-slate-600'
                }`}
              >
                Length
              </button>
              <button
                type="button"
                onClick={() => setConversionType('weight')}
                className={`py-2 rounded-lg font-medium text-xs transition-all ${
                  conversionType === 'weight' ? 'bg-white text-amber-600 shadow-sm border border-slate-100' : 'text-slate-600'
                }`}
              >
                Weight
              </button>
              <button
                type="button"
                onClick={() => setConversionType('temp')}
                className={`py-2 rounded-lg font-medium text-xs transition-all ${
                  conversionType === 'temp' ? 'bg-white text-amber-600 shadow-sm border border-slate-100' : 'text-slate-600'
                }`}
              >
                Temp
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">From Unit</label>
              {conversionType === 'length' && (
                <select
                  value={lengthFrom}
                  onChange={(e) => setLengthFrom(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-800 bg-white"
                >
                  {Object.entries(lengthUnits).map(([key, obj]) => (
                    <option key={key} value={key}>{obj.label}</option>
                  ))}
                </select>
              )}
              {conversionType === 'weight' && (
                <select
                  value={weightFrom}
                  onChange={(e) => setWeightFrom(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-800 bg-white"
                >
                  {Object.entries(weightUnits).map(([key, obj]) => (
                    <option key={key} value={key}>{obj.label}</option>
                  ))}
                </select>
              )}
              {conversionType === 'temp' && (
                <select
                  value={tempFrom}
                  onChange={(e) => setTempFrom(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-800 bg-white"
                >
                  <option value="C">Celsius (°C)</option>
                  <option value="F">Fahrenheit (°F)</option>
                  <option value="K">Kelvin (K)</option>
                </select>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">To Unit</label>
              {conversionType === 'length' && (
                <select
                  value={lengthTo}
                  onChange={(e) => setLengthTo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-800 bg-white"
                >
                  {Object.entries(lengthUnits).map(([key, obj]) => (
                    <option key={key} value={key}>{obj.label}</option>
                  ))}
                </select>
              )}
              {conversionType === 'weight' && (
                <select
                  value={weightTo}
                  onChange={(e) => setWeightTo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-800 bg-white"
                >
                  {Object.entries(weightUnits).map(([key, obj]) => (
                    <option key={key} value={key}>{obj.label}</option>
                  ))}
                </select>
              )}
              {conversionType === 'temp' && (
                <select
                  value={tempTo}
                  onChange={(e) => setTempTo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-800 bg-white"
                >
                  <option value="C">Celsius (°C)</option>
                  <option value="F">Fahrenheit (°F)</option>
                  <option value="K">Kelvin (K)</option>
                </select>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Value to Convert</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-800"
            />
          </div>
        </div>

        <div className="md:col-span-6 flex flex-col justify-between">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Conversion Result</h2>

            <div className="bg-amber-500 text-white rounded-xl p-6 text-center shadow-md shadow-amber-500/10">
              <span className="text-xs font-bold uppercase tracking-wider opacity-85 block mb-1">
                Converted Output
              </span>
              <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {result}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
