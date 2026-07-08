'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorShell, ShellInput, ResultCard } from './CalculatorShell';

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
      setWarning(`You need a ${roundedScore}% on your final exam to achieve a ${targetGrade}% overall. Extra credit might be required!`);
    } else if (roundedScore <= 0) {
      setWarning(`You need a 0% or higher. You have already guaranteed a ${targetGrade}% overall grade regardless of your final exam score!`);
    } else {
      setWarning('');
    }
  }, [currentGrade, targetGrade, examWeight]);

  return (
    <CalculatorShell
      title="Final Exam Details"
      inputs={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ShellInput
              label="Current Class Grade"
              suffix="%"
              value={currentGrade}
              onChange={(e) => setCurrentGrade(Number(e.target.value))}
            />
            <ShellInput
              label="Target Grade"
              suffix="%"
              value={targetGrade}
              onChange={(e) => setTargetGrade(Number(e.target.value))}
            />
          </div>
          <ShellInput
            label="Final Exam Weight"
            suffix="%"
            value={examWeight}
            onChange={(e) => setExamWeight(Number(e.target.value))}
          />
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard label="Score Needed on Final Exam" value={`${neededScore}%`} color="indigo" />

          {warning && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-indigo-800 text-xs leading-relaxed font-semibold">
              {warning}
            </div>
          )}
        </div>
      }
    />
  );
}
