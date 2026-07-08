'use client';

import React, { useState, useEffect } from 'react';

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
      curved = Math.min(100, original + flatAdjustment);
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Grade Curve Details</h2>

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

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Original Exam Score (%)</label>
            <input
              type="number"
              max={100}
              value={originalGrade}
              onChange={(e) => setOriginalGrade(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-800"
            />
          </div>

          {curveType === 'flat' && (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Flat Point Adjustment</label>
              <input
                type="number"
                value={flatAdjustment}
                onChange={(e) => setFlatAdjustment(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-800"
              />
            </div>
          )}
        </div>

        <div className="md:col-span-6 flex flex-col justify-between">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Curved Results</h2>

            <div className="bg-indigo-650 text-white rounded-xl p-5 text-center shadow-md shadow-indigo-600/10">
              <span className="text-xs font-bold uppercase tracking-wider opacity-85 block mb-1">
                New Curved Score
              </span>
              <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {results.curvedGrade}%
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                <span>Original Score</span>
                <span>{originalGrade}%</span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-655">
                <span>Score Increase</span>
                <span className="text-indigo-600 font-semibold">+{results.pointDifference} points</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
