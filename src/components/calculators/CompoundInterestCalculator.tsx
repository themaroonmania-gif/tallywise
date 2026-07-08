'use client';

import React, { useState, useEffect } from 'react';

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
    const n = compoundingFrequency;

    let balance = P;
    let totalContributions = P;

    const totalMonths = t * 12;
    const ratePerMonth = r / 12;

    // Calculate month-by-month for exact contributions handling
    for (let m = 1; m <= totalMonths; m++) {
      // Add monthly interest
      balance += balance * ratePerMonth;
      // Add monthly contribution
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Compound Investment Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Initial Deposit</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-400 font-medium">$</span>
                <input
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Monthly Deposit</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-400 font-medium">$</span>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Years to Grow</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Interest Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Compounding Frequency</label>
            <select
              value={compoundingFrequency}
              onChange={(e) => setCompoundingFrequency(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800 bg-white"
            >
              <option value={12}>Compounded Monthly (12/year)</option>
              <option value={1}>Compounded Annually (1/year)</option>
            </select>
          </div>
        </div>

        <div className="md:col-span-6 flex flex-col justify-between">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Growth Projections</h2>

            <div className="bg-emerald-600 text-white rounded-xl p-6 text-center shadow-md shadow-emerald-600/10">
              <span className="text-xs font-bold uppercase tracking-wider opacity-85 block mb-1">
                Estimated Future Balance
              </span>
              <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {formatCurrency(results.endBalance)}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                <span>Total Principal Contributed</span>
                <span>{formatCurrency(results.totalContributions)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-655">
                <span>Compound Interest Earned</span>
                <span className="text-emerald-600 font-semibold">+{formatCurrency(results.totalInterest)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
