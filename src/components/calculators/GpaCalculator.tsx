'use client';

import React, { useState, useEffect } from 'react';

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
  weight: 'standard' | 'honors' | 'ap';
}

export function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'English Literature', grade: 'A', credits: 3, weight: 'ap' },
    { id: '2', name: 'Calculus BC', grade: 'B+', credits: 4, weight: 'ap' },
    { id: '3', name: 'Chemistry', grade: 'A-', credits: 4, weight: 'honors' },
    { id: '4', name: 'U.S. History', grade: 'A', credits: 3, weight: 'standard' },
  ]);

  const [unweightedGpa, setUnweightedGpa] = useState<number>(0);
  const [weightedGpa, setWeightedGpa] = useState<number>(0);
  const [totalCredits, setTotalCredits] = useState<number>(0);

  const gradePoints: Record<string, number> = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0,
  };

  const addCourse = () => {
    const newId = String(Date.now());
    setCourses([...courses, { id: newId, name: '', grade: 'A', credits: 3, weight: 'standard' }]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(
      courses.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  useEffect(() => {
    let unweightedPointsSum = 0;
    let weightedPointsSum = 0;
    let totalCreds = 0;

    courses.forEach((course) => {
      const basePoints = gradePoints[course.grade] ?? 0;
      const cred = course.credits;
      
      // Calculate weight adjustment
      let weightBonus = 0;
      if (course.weight === 'honors') weightBonus = 0.5;
      else if (course.weight === 'ap') weightBonus = 1.0;

      unweightedPointsSum += basePoints * cred;
      weightedPointsSum += (basePoints + weightBonus) * cred;
      totalCreds += cred;
    });

    const unweighted = totalCreds > 0 ? unweightedPointsSum / totalCreds : 0;
    const weighted = totalCreds > 0 ? weightedPointsSum / totalCreds : 0;

    setUnweightedGpa(Number(unweighted.toFixed(2)));
    setWeightedGpa(Number(weighted.toFixed(2)));
    setTotalCredits(totalCreds);
  }, [courses]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Inputs Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="text-xl font-bold text-slate-800">Semester Course List</h2>
            <button
              type="button"
              onClick={addCourse}
              className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              + Add Course
            </button>
          </div>

          <div className="space-y-3">
            {courses.map((course, idx) => (
              <div
                key={course.id}
                className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 transition-all duration-200"
              >
                {/* Course Name */}
                <div className="col-span-12 sm:col-span-4">
                  <input
                    type="text"
                    value={course.name}
                    onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                    placeholder={`Course #${idx + 1}`}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-medium text-slate-800 bg-white"
                  />
                </div>

                {/* Grade */}
                <div className="col-span-4 sm:col-span-3">
                  <select
                    value={course.grade}
                    onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-bold text-slate-800 bg-white"
                  >
                    {Object.keys(gradePoints).map((g) => (
                      <option key={g} value={g}>
                        Grade: {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Credits */}
                <div className="col-span-4 sm:col-span-2">
                  <select
                    value={course.credits}
                    onChange={(e) => updateCourse(course.id, 'credits', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-bold text-slate-800 bg-white"
                  >
                    {[1, 2, 3, 4, 5].map((cred) => (
                      <option key={cred} value={cred}>
                        {cred} Credits
                      </option>
                    ))}
                  </select>
                </div>

                {/* Weight Category */}
                <div className="col-span-3 sm:col-span-2">
                  <select
                    value={course.weight}
                    onChange={(e) => updateCourse(course.id, 'weight', e.target.value as any)}
                    className="w-full px-2 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-semibold text-slate-800 bg-white"
                  >
                    <option value="standard">Standard</option>
                    <option value="honors">Honors (+0.5)</option>
                    <option value="ap">AP/IB (+1.0)</option>
                  </select>
                </div>

                {/* Remove Button */}
                <div className="col-span-1 text-center">
                  <button
                    type="button"
                    onClick={() => removeCourse(course.id)}
                    disabled={courses.length <= 1}
                    className="p-1.5 text-slate-400 hover:text-red-500 disabled:opacity-30 rounded-lg hover:bg-slate-100"
                    title="Remove Course"
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
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Your GPA</h2>

            {/* GPA Displays */}
            <div className="space-y-4">
              <div className="bg-indigo-650 text-white rounded-xl p-5 text-center shadow-md shadow-indigo-600/10">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-85 block mb-1">
                  Weighted GPA
                </span>
                <div className="text-4xl font-extrabold tracking-tight">
                  {weightedGpa.toFixed(2)}
                </div>
              </div>

              <div className="bg-slate-100 text-slate-700 rounded-xl p-4 text-center border border-slate-200/50">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-75 block mb-0.5">
                  Unweighted GPA
                </span>
                <div className="text-2xl font-bold">
                  {unweightedGpa.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Credit count */}
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500 border-t border-slate-200/60 pt-4">
              <span>Total Credits Earned</span>
              <span className="text-slate-850 font-bold text-sm">{totalCredits}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
