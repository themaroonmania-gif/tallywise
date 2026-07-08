'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorShell, ShellInput, ResultCard } from './CalculatorShell';

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
    <CalculatorShell
      title="401(k) Details"
      inputs={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ShellInput
              label="Current Age"
              suffix="yrs"
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
            />
            <ShellInput
              label="Retirement Age"
              suffix="yrs"
              value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ShellInput
              label="Annual Salary"
              suffix="$"
              value={currentSalary}
              onChange={(e) => setCurrentSalary(Number(e.target.value))}
            />
            <ShellInput
              label="Current 401(k)"
              suffix="$"
              value={currentBalance}
              onChange={(e) => setCurrentBalance(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ShellInput
              label="Contribution"
              suffix="%"
              value={contributionPercent}
              onChange={(e) => setContributionPercent(Number(e.target.value))}
            />
            <ShellInput
              label="Return Rate"
              suffix="%"
              step="0.01"
              value={returnRate}
              onChange={(e) => setReturnRate(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
            <ShellInput
              label="Employer Match"
              suffix="%"
              value={employerMatchPercent}
              onChange={(e) => setEmployerMatchPercent(Number(e.target.value))}
              placeholder="50%"
            />
            <ShellInput
              label="Match Limit"
              suffix="%"
              value={employerLimitPercent}
              onChange={(e) => setEmployerLimitPercent(Number(e.target.value))}
              placeholder="6%"
            />
          </div>
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard
            label={`Projected 401(k) Balance at Age ${retirementAge}`}
            value={formatCurrency(results.endingBalance)}
          />

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
              <span>Personal Contributions</span>
              <span>{formatCurrency(results.personalContributions)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>Employer Matching</span>
              <span className="text-emerald-600 font-semibold">+{formatCurrency(results.employerContributions)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>Compound Market Growth</span>
              <span className="text-emerald-600 font-semibold">+{formatCurrency(results.growthEarnings)}</span>
            </div>
          </div>
        </div>
      }
    />
  );
}
