'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorShell, ShellInput, ResultCard } from './CalculatorShell';

export function GradeCurveCalculator() {
  const [curveType, setCurveType] = useState<'flat' | 'root'>('flat');
  const [originalGrade, setOriginalGrade] = useState<number>(75);
  const [flatAdjustment, setFlatAdjustment] = useState<number>(8); // default add 8 points

  const [results, setResults] = useState({
    curvedGrade: 0,
    pointDifference: 0,
  });

  useEffect(() => {
    const original = Math.max(0, Math.min(100, originalGrade));
    let curved = original;

    if (curveType === 'flat') {
      curved = Math.min(100, Math.max(0, original + flatAdjustment));
    } else {
      // Root Curve: Sqrt(Original Grade) * 10
      curved = Math.sqrt(original) * 10;
    }

    const curvedGrade = Number(curved.toFixed(1));
    const pointDifference = Number((curvedGrade - original).toFixed(1));

    setResults({
      curvedGrade,
      pointDifference,
    });
  }, [curveType, originalGrade, flatAdjustment]);

  return (
    <CalculatorShell
      title="Grade Curve Details"
      inputs={
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Curving Method</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setCurveType('flat')}
                className={`py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  curveType === 'flat'
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Flat Point Curve
              </button>
              <button
                type="button"
                onClick={() => setCurveType('root')}
                className={`py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  curveType === 'root'
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Root Curve (Sqrt*10)
              </button>
            </div>
          </div>

          <ShellInput
            label="Original Exam Score"
            suffix="%"
            max={100}
            value={originalGrade}
            onChange={(e) => setOriginalGrade(Number(e.target.value))}
          />

          {curveType === 'flat' && (
            <ShellInput
              label="Flat Point Adjustment"
              suffix="pts"
              value={flatAdjustment}
              onChange={(e) => setFlatAdjustment(Number(e.target.value))}
            />
          )}
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard label="New Curved Score" value={`${results.curvedGrade}%`} color="indigo" />

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
              <span>Original Score</span>
              <span>{originalGrade}%</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>Score Change</span>
              <span className={`font-semibold ${results.pointDifference >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                {results.pointDifference >= 0 ? '+' : ''}{results.pointDifference} points
              </span>
            </div>
          </div>
        </div>
      }
    />
  );
}
