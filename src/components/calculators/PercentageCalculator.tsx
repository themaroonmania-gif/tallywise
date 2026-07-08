'use client';

import React, { useState } from 'react';

export function PercentageCalculator() {
  // Calculator 1: What is X% of Y?
  const [c1Percent, setC1Percent] = useState<number>(15);
  const [c1Value, setC1Value] = useState<number>(200);
  const [c1Result, setC1Result] = useState<number>(30);

  // Calculator 2: X is what percent of Y?
  const [c2Value1, setC2Value1] = useState<number>(50);
  const [c2Value2, setC2Value2] = useState<number>(250);
  const [c2Result, setC2Result] = useState<number>(20);

  // Calculator 3: Percentage Change from X to Y
  const [c3Value1, setC3Value1] = useState<number>(120);
  const [c3Value2, setC3Value2] = useState<number>(180);
  const [c3Result, setC3Result] = useState<number>(50);

  const calculateC1 = (pct: number, val: number) => {
    setC1Percent(pct);
    setC1Value(val);
    setC1Result(Number(((pct / 100) * val).toFixed(4)));
  };

  const calculateC2 = (val1: number, val2: number) => {
    setC2Value1(val1);
    setC2Value2(val2);
    if (val2 !== 0) {
      setC2Result(Number(((val1 / val2) * 100).toFixed(4)));
    } else {
      setC2Result(0);
    }
  };

  const calculateC3 = (val1: number, val2: number) => {
    setC3Value1(val1);
    setC3Value2(val2);
    if (val1 !== 0) {
      setC3Result(Number((((val2 - val1) / val1) * 100).toFixed(4)));
    } else {
      setC3Result(0);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-8">
      
      {/* Mini Calculator 1 */}
      <div className="p-5 rounded-2xl border border-slate-150/70 bg-slate-50/50 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200/50 pb-2">
          1. Calculate percentage of a value
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-700">
          <span>What is</span>
          <input
            type="number"
            value={c1Percent}
            onChange={(e) => calculateC1(Number(e.target.value), c1Value)}
            className="w-20 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-center text-slate-850 bg-white"
          />
          <span>% of</span>
          <input
            type="number"
            value={c1Value}
            onChange={(e) => calculateC1(c1Percent, Number(e.target.value))}
            className="w-28 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-center text-slate-850 bg-white"
          />
          <span>?</span>
          
          <div className="ml-auto flex items-center gap-2 bg-amber-500 text-white px-4 py-1.5 rounded-xl">
            <span className="text-xs opacity-90 font-medium">Result:</span>
            <span className="text-md font-bold">{c1Result}</span>
          </div>
        </div>
      </div>

      {/* Mini Calculator 2 */}
      <div className="p-5 rounded-2xl border border-slate-150/70 bg-slate-50/50 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200/50 pb-2">
          2. Calculate percentage proportion
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-700">
          <input
            type="number"
            value={c2Value1}
            onChange={(e) => calculateC2(Number(e.target.value), c2Value2)}
            className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-center text-slate-850 bg-white"
          />
          <span>is what percent of</span>
          <input
            type="number"
            value={c2Value2}
            onChange={(e) => calculateC2(c2Value1, Number(e.target.value))}
            className="w-28 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-center text-slate-850 bg-white"
          />
          <span>?</span>
          
          <div className="ml-auto flex items-center gap-2 bg-amber-500 text-white px-4 py-1.5 rounded-xl">
            <span className="text-xs opacity-90 font-medium">Result:</span>
            <span className="text-md font-bold">{c2Result}%</span>
          </div>
        </div>
      </div>

      {/* Mini Calculator 3 */}
      <div className="p-5 rounded-2xl border border-slate-150/70 bg-slate-50/50 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200/50 pb-2">
          3. Calculate percentage increase/decrease
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-700">
          <span>What is the % change from</span>
          <input
            type="number"
            value={c3Value1}
            onChange={(e) => calculateC3(Number(e.target.value), c3Value2)}
            className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-center text-slate-850 bg-white"
          />
          <span>to</span>
          <input
            type="number"
            value={c3Value2}
            onChange={(e) => calculateC3(c3Value1, Number(e.target.value))}
            className="w-28 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-center text-slate-850 bg-white"
          />
          <span>?</span>
          
          <div className={`ml-auto flex items-center gap-2 text-white px-4 py-1.5 rounded-xl ${c3Result >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}>
            <span className="text-xs opacity-90 font-medium">Result:</span>
            <span className="text-md font-bold">
              {c3Result >= 0 ? `+${c3Result}% Increase` : `${c3Result}% Decrease`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
