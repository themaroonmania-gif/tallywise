'use client';

import React, { useState, useEffect } from 'react';

interface Debt {
  id: string;
  name: string;
  balance: number;
  rate: number;
  minPayment: number;
}

export function DebtPayoffCalculator() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', name: 'Credit Card A', balance: 5000, rate: 18.9, minPayment: 150 },
    { id: '2', name: 'Car Loan', balance: 15000, rate: 4.5, minPayment: 320 },
  ]);
  const [extraPayment, setExtraPayment] = useState<number>(200);
  const [method, setMethod] = useState<'avalanche' | 'snowball'>('avalanche');

  const [results, setResults] = useState({
    monthsToPayoff: 0,
    totalInterestPaid: 0,
    avalancheInterest: 0,
    snowballInterest: 0,
    avalancheMonths: 0,
    snowballMonths: 0,
  });

  const updateDebt = (id: string, field: keyof Debt, value: string | number) => {
    setDebts(debts.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const simulatePayoff = (methodType: 'snowball' | 'avalanche') => {
    // Clone debts to avoid mutation
    let activeDebts = debts.map((d) => ({ ...d }));
    let totalInterest = 0;
    let months = 0;

    // Sort debts based on method
    if (methodType === 'snowball') {
      activeDebts.sort((a, b) => a.balance - b.balance);
    } else {
      activeDebts.sort((a, b) => b.rate - a.rate);
    }

    // Run month-by-month simulation up to 300 months safety limit
    while (activeDebts.some((d) => d.balance > 0) && months < 300) {
      months++;
      
      // 1. Calculate monthly interest & add it, accumulate min payments
      let remainingBudget = extraPayment;
      activeDebts.forEach((debt) => {
        if (debt.balance > 0) {
          const interest = debt.balance * (debt.rate / 100 / 12);
          debt.balance += interest;
          totalInterest += interest;
          
          // Pay the minimum payment
          const min = Math.min(debt.balance, debt.minPayment);
          debt.balance -= min;
        }
      });

      // 2. Distribute extra payment (and rolled-over min payments) to the priority debt
      for (let i = 0; i < activeDebts.length; i++) {
        const debt = activeDebts[i];
        if (debt.balance > 0) {
          const payment = Math.min(debt.balance, remainingBudget);
          debt.balance -= payment;
          remainingBudget -= payment;
          if (remainingBudget <= 0) break;
        }
      }
    }

    return { months, interest: totalInterest };
  };

  useEffect(() => {
    const avalanche = simulatePayoff('avalanche');
    const snowball = simulatePayoff('snowball');

    const currentSim = method === 'avalanche' ? avalanche : snowball;

    setResults({
      monthsToPayoff: currentSim.months,
      totalInterestPaid: Number(currentSim.interest.toFixed(2)),
      avalancheInterest: Number(avalanche.interest.toFixed(2)),
      snowballInterest: Number(snowball.interest.toFixed(2)),
      avalancheMonths: avalanche.months,
      snowballMonths: snowball.months,
    });
  }, [debts, extraPayment, method]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Your Debts</h2>

          <div className="space-y-4">
            {debts.map((debt, idx) => (
              <div key={debt.id} className="p-4 rounded-xl border border-slate-150 bg-slate-50/50 space-y-3">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Debt #{idx + 1}: {debt.name || 'Unnamed'}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Balance</label>
                    <input
                      type="number"
                      value={debt.balance}
                      onChange={(e) => updateDebt(debt.id, 'balance', Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-xs text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={debt.rate}
                      onChange={(e) => updateDebt(debt.id, 'rate', Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-xs text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Min Payment</label>
                    <input
                      type="number"
                      value={debt.minPayment}
                      onChange={(e) => updateDebt(debt.id, 'minPayment', Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-xs text-slate-800 bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Extra Monthly Payment</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-400 font-medium">$</span>
                <input
                  type="number"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Payoff Strategy</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800 bg-white"
              >
                <option value="avalanche">Debt Avalanche (Highest Interest First)</option>
                <option value="snowball">Debt Snowball (Smallest Balance First)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Payoff Timeline</h2>

            <div className="bg-emerald-600 text-white rounded-xl p-5 text-center shadow-md shadow-emerald-600/10">
              <span className="text-xs font-bold uppercase tracking-wider opacity-85 block mb-1">
                Estimated Time to Debt-Free
              </span>
              <div className="text-3xl font-extrabold tracking-tight">
                {results.monthsToPayoff} <span className="text-lg font-medium opacity-80">months</span>
              </div>
              <div className="text-xs opacity-75 mt-1">
                ({(results.monthsToPayoff / 12).toFixed(1)} years)
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-200/60">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Method Comparison
              </h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className={`p-3 bg-white rounded-xl border shadow-sm ${method === 'avalanche' ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-150'}`}>
                  <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Avalanche</span>
                  <span className="text-md font-bold text-slate-800">{results.avalancheMonths} mos</span>
                  <span className="text-[9px] text-red-500 block mt-0.5">{formatCurrency(results.avalancheInterest)} interest</span>
                </div>
                <div className={`p-3 bg-white rounded-xl border shadow-sm ${method === 'snowball' ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-150'}`}>
                  <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Snowball</span>
                  <span className="text-md font-bold text-slate-800">{results.snowballMonths} mos</span>
                  <span className="text-[9px] text-red-500 block mt-0.5">{formatCurrency(results.snowballInterest)} interest</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
