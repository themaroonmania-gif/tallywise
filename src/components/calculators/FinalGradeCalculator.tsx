'use client';

import React, { useState, useEffect } from 'react';

export function FinalGradeCalculator() {
  const [currentGrade, setCurrentGrade] = useState<number>(85);
  const [targetGrade, setTargetGrade] = useState<number>(90);
  const [examWeight, setExamWeight] = useState<number>(20);

  const [neededScore, setNeededScore] = useState<number>(0);
  const [warning, setWarning] = useState<string>('');

  useEffect(() => {
    const current = Math.max(0, currentGrade);
    const target = Math.max(0, targetGrade);
    const weight = Math.max(0.1, examWeight) / 100; // avoid divide by zero

    // Final Exam Grade = [Target Grade - Current Grade * (1 - Exam Weight)] / Exam Weight
    const score = (target - current * (1 - weight)) / weight;
    const roundedScore = Number(score.toFixed(1));
    setNeededScore(roundedScore);

    if (roundedScore > 100) {
      setWarning(`⚠️ You need a ${roundedScore}% on your final exam to achieve a ${targetGrade}% overall. Extra credit might be required!`);
    } else if (roundedScore <= 0) {
      setWarning(`🎉 You need a 0% or higher. You have already guaranteed a ${targetGrade}% overall grade regardless of your final exam score!`);
    } else {
      setWarning('');
    }
  }, [currentGrade, targetGrade, examWeight]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Final Exam Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Current Class Grade (%)</label>
              <input
                type="number"
                value={currentGrade}
                onChange={(e) => setCurrentGrade(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Target Grade (%)</label>
              <input
                type="number"
                value={targetGrade}
                onChange={(e) => setTargetGrade(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Final Exam Weight (%)</label>
            <input
              type="number"
              value={examWeight}
              onChange={(e) => setExamWeight(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-800"
            />
          </div>
        </div>

        <div className="md:col-span-6 flex flex-col justify-between">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Required Exam Score</h2>

            <div className="bg-indigo-650 text-white rounded-xl p-5 text-center shadow-md shadow-indigo-600/10">
              <span className="text-xs font-bold uppercase tracking-wider opacity-85 block mb-1">
                Score Needed on Final Exam
              </span>
              <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {neededScore}%
              </div>
            </div>

            {warning && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-indigo-800 text-xs leading-relaxed font-semibold">
                {warning}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
