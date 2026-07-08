'use client';

import React, { useState, useEffect } from 'react';

export function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [currentSalary, setCurrentSalary] = useState<number>(75000);
  const [currentBalance, setCurrentBalance] = useState<number>(25000);
  const [contributionPercent, setContributionPercent] = useState<number>(6);
  const [employerMatchPercent, setEmployerMatchPercent] = useState<number>(50); // matching 50 cents on the dollar
  const [employerLimitPercent, setEmployerLimitPercent] = useState<number>(6); // up to 6% of salary
  const [returnRate, setReturnRate] = useState<number>(7.0);

  const [results, setResults] = useState({
    endingBalance: 0,
    personalContributions: 0,
    employerContributions: 0,
    growthEarnings: 0,
  });

  useEffect(() => {
    const ageCurrent = Math.max(18, currentAge);
    const ageRetire = Math.max(ageCurrent + 1, retirementAge);
    const salary = Math.max(0, currentSalary);
    const returnPct = Math.max(0, returnRate) / 100;
    
    const yearsToGrow = ageRetire - ageCurrent;
    let balance = Math.max(0, currentBalance);
    
    // Annual calculations
    const annualPersonal = salary * (contributionPercent / 100);
    // Matching logic: matching percent (e.g. 50%) * limit percent (e.g. 6% of salary) or contribution percent if smaller
    const matchQualifiedPercent = Math.min(contributionPercent, employerLimitPercent);
    const annualEmployer = salary * (matchQualifiedPercent / 100) * (employerMatchPercent / 100);

    let personalContributions = 0;
    let employerContributions = 0;

    for (let y = 1; y <= yearsToGrow; y++) {
      // Add interest
      balance += balance * returnPct;
      // Add annual contributions (assumed end of year for simplicity)
      balance += annualPersonal + annualEmployer;
      personalContributions += annualPersonal;
      employerContributions += annualEmployer;
    }

    const growthEarnings = Math.max(0, balance - currentBalance - personalContributions - employerContributions);

    setResults({
      endingBalance: Number(balance.toFixed(2)),
      personalContributions: Number(personalContributions.toFixed(2)),
      employerContributions: Number(employerContributions.toFixed(2)),
      growthEarnings: Number(growthEarnings.toFixed(2)),
    });
  }, [currentAge, retirementAge, currentSalary, currentBalance, contributionPercent, employerMatchPercent, employerLimitPercent, returnRate]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">401(k) Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Current Age</label>
              <input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Retirement Age</label>
              <input
                type="number"
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Annual Salary</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-400 font-medium">$</span>
                <input
                  type="number"
                  value={currentSalary}
                  onChange={(e) => setCurrentSalary(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Current 401(k)</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-400 font-medium">$</span>
                <input
                  type="number"
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Contribution (%)</label>
              <input
                type="number"
                value={contributionPercent}
                onChange={(e) => setContributionPercent(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Return Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={returnRate}
                onChange={(e) => setReturnRate(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Employer Match (%)</label>
              <input
                type="number"
                value={employerMatchPercent}
                onChange={(e) => setEmployerMatchPercent(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
                placeholder="50%"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Match Limit (%)</label>
              <input
                type="number"
                value={employerLimitPercent}
                onChange={(e) => setEmployerLimitPercent(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
                placeholder="6%"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-6 flex flex-col justify-between">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Retirement Projections</h2>

            <div className="bg-emerald-600 text-white rounded-xl p-6 text-center shadow-md shadow-emerald-600/10">
              <span className="text-xs font-bold uppercase tracking-wider opacity-85 block mb-1">
                Projected 401(k) Balance at Age {retirementAge}
              </span>
              <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {formatCurrency(results.endingBalance)}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                <span>Personal Contributions</span>
                <span>{formatCurrency(results.personalContributions)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-600">
                <span>Employer Matching</span>
                <span className="text-emerald-600 font-semibold">+{formatCurrency(results.employerContributions)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-655">
                <span>Compound Market Growth</span>
                <span className="text-emerald-600 font-semibold">+{formatCurrency(results.growthEarnings)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
