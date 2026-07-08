'use client';

import React, { useState, useEffect } from 'react';

interface GradeCategory {
  id: string;
  name: string;
  score: number; // percentage grade
  weight: number; // weight percentage
}

export function GradeCalculator() {
  const [categories, setCategories] = useState<GradeCategory[]>([
    { id: '1', name: 'Exams', score: 85, weight: 40 },
    { id: '2', name: 'Quizzes', score: 90, weight: 20 },
    { id: '3', name: 'Homework', score: 95, weight: 25 },
    { id: '4', name: 'Projects / Participation', score: 100, weight: 15 },
  ]);

  const [finalGrade, setFinalGrade] = useState<number>(0);
  const [letterGrade, setLetterGrade] = useState<string>('A');
  const [totalWeight, setTotalWeight] = useState<number>(100);

  const addCategory = () => {
    const newId = String(Date.now());
    setCategories([...categories, { id: newId, name: '', score: 90, weight: 10 }]);
  };

  const removeCategory = (id: string) => {
    if (categories.length > 1) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const updateCategory = (id: string, field: keyof GradeCategory, value: string | number) => {
    setCategories(
      categories.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const getLetterGrade = (score: number) => {
    if (score >= 97) return 'A+';
    if (score >= 93) return 'A';
    if (score >= 90) return 'A-';
    if (score >= 87) return 'B+';
    if (score >= 83) return 'B';
    if (score >= 80) return 'B-';
    if (score >= 77) return 'C+';
    if (score >= 73) return 'C';
    if (score >= 70) return 'C-';
    if (score >= 67) return 'D+';
    if (score >= 60) return 'D';
    return 'F';
  };

  useEffect(() => {
    let weightedScoresSum = 0;
    let weightsSum = 0;

    categories.forEach((cat) => {
      const score = Math.max(0, cat.score);
      const weight = Math.max(0, cat.weight);
      
      weightedScoresSum += (score * (weight / 100));
      weightsSum += weight;
    });

    setTotalWeight(weightsSum);

    // If weights don't sum to 100, recalculate proportionally
    let grade = 0;
    if (weightsSum > 0) {
      grade = (weightedScoresSum / (weightsSum / 100));
    }

    setFinalGrade(Number(grade.toFixed(2)));
    setLetterGrade(getLetterGrade(grade));
  }, [categories]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Inputs Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="text-xl font-bold text-slate-800">Grade Categories</h2>
            <button
              type="button"
              onClick={addCategory}
              className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              + Add Category
            </button>
          </div>

          <div className="space-y-3">
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                className="grid grid-cols-12 gap-3 items-center p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 transition-all duration-200"
              >
                {/* Category Name */}
                <div className="col-span-12 sm:col-span-5">
                  <input
                    type="text"
                    value={cat.name}
                    onChange={(e) => updateCategory(cat.id, 'name', e.target.value)}
                    placeholder={`Category #${idx + 1} (e.g. Exams)`}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-semibold text-slate-800 bg-white"
                  />
                </div>

                {/* Score (%) */}
                <div className="col-span-5 sm:col-span-3">
                  <div className="relative">
                    <input
                      type="number"
                      max={150}
                      value={cat.score}
                      onChange={(e) => updateCategory(cat.id, 'score', Number(e.target.value))}
                      className="w-full pl-3 pr-8 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-bold text-slate-800 bg-white"
                      placeholder="Score"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">%</span>
                  </div>
                </div>

                {/* Weight (%) */}
                <div className="col-span-5 sm:col-span-3">
                  <div className="relative">
                    <input
                      type="number"
                      max={100}
                      value={cat.weight}
                      onChange={(e) => updateCategory(cat.id, 'weight', Number(e.target.value))}
                      className="w-full pl-3 pr-8 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-bold text-slate-800 bg-white"
                      placeholder="Weight"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">%</span>
                  </div>
                </div>

                {/* Remove Button */}
                <div className="col-span-2 sm:col-span-1 text-center">
                  <button
                    type="button"
                    onClick={() => removeCategory(cat.id)}
                    disabled={categories.length <= 1}
                    className="p-1.5 text-slate-400 hover:text-red-500 disabled:opacity-30 rounded-lg hover:bg-slate-100"
                    title="Remove Category"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Final Grade</h2>

            {/* Final Grade Displays */}
            <div className="space-y-4">
              <div className="bg-indigo-650 text-white rounded-xl p-5 text-center shadow-md shadow-indigo-600/10">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-85 block mb-1">
                  Overall Score
                </span>
                <div className="text-4xl font-extrabold tracking-tight">
                  {finalGrade.toFixed(1)}%
                </div>
              </div>

              <div className="bg-slate-100 text-slate-700 rounded-xl p-4 text-center border border-slate-200/50">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-75 block mb-0.5">
                  Letter Grade
                </span>
                <div className="text-2xl font-bold">
                  {letterGrade}
                </div>
              </div>
            </div>

            {/* Weight Status */}
            <div className="pt-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                <span>Sum of Weights</span>
                <span className={`font-bold ${totalWeight !== 100 ? 'text-amber-600' : 'text-slate-800'}`}>
                  {totalWeight}%
                </span>
              </div>
              
              {totalWeight !== 100 && (
                <div className="mt-2 text-[10px] text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-100 leading-normal">
                  ⚠️ Weights sum to <strong>{totalWeight}%</strong> instead of 100%. We have automatically scaled your grades proportionally.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
