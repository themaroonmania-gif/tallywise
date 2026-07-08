'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorShell, ShellInput, ShellSelect, ResultCard } from './CalculatorShell';

export function CompoundInterestCalculator() {
  const [initialInvestment, setInitialInvestment] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(200);
  const [years, setYears] = useState<number>(10);
  const [interestRate, setInterestRate] = useState<number>(7.5);
  const [compoundingFrequency, setCompoundingFrequency] = useState<number>(12); // monthly = 12, annually = 1

  const [results, setResults] = useState({
    endBalance: 0,
    totalContributions: 0,
    totalInterest: 0,
  });

  useEffect(() => {
    const P = Math.max(0, initialInvestment);
    const PMT = Math.max(0, monthlyContribution);
    const t = Math.max(0, years);
    const r = Math.max(0, interestRate) / 100;
    const n = compoundingFrequency; // periods per year interest compounds

    let balance = P;
    let totalContributions = P;

    const totalMonths = t * 12;
    const ratePerPeriod = r / n;
    const monthsPerPeriod = 12 / n;

    // Calculate month-by-month; interest compounds every `monthsPerPeriod` months,
    // contributions are added monthly regardless of compounding frequency.
    for (let m = 1; m <= totalMonths; m++) {
      if (m % monthsPerPeriod === 0) {
        balance += balance * ratePerPeriod;
      }
      balance += PMT;
      totalContributions += PMT;
    }

    const totalInterest = Math.max(0, balance - totalContributions);

    setResults({
      endBalance: Number(balance.toFixed(2)),
      totalContributions: Number(totalContributions.toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2)),
    });
  }, [initialInvestment, monthlyContribution, years, interestRate, compoundingFrequency]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <CalculatorShell
      title="Compound Investment Details"
      inputs={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ShellInput
              label="Initial Deposit"
              suffix="$"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
            />
            <ShellInput
              label="Monthly Deposit"
              suffix="$"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ShellInput
              label="Years to Grow"
              suffix="yrs"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
            <ShellInput
              label="Interest Rate"
              suffix="%"
              step="0.01"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
          </div>

          <ShellSelect
            label="Compounding Frequency"
            value={compoundingFrequency}
            onChange={(e) => setCompoundingFrequency(Number(e.target.value))}
          >
            <option value={12}>Compounded Monthly (12/year)</option>
            <option value={1}>Compounded Annually (1/year)</option>
          </ShellSelect>
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard label="Estimated Future Balance" value={formatCurrency(results.endBalance)} />

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
              <span>Total Principal Contributed</span>
              <span>{formatCurrency(results.totalContributions)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>Compound Interest Earned</span>
              <span className="text-emerald-600 font-semibold">+{formatCurrency(results.totalInterest)}</span>
            </div>
          </div>
        </div>
      }
    />
  );
}
