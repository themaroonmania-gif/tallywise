'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorShell, ShellInput, ShellSelect, ResultCard } from './CalculatorShell';

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
    const activeDebts = debts.map((d) => ({ ...d }));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debts, extraPayment, method]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <CalculatorShell
      title="Your Debts"
      inputs={
        <div className="space-y-4">
          {debts.map((debt, idx) => (
            <div key={debt.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
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
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-semibold text-xs text-slate-800 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={debt.rate}
                    onChange={(e) => updateDebt(debt.id, 'rate', Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-semibold text-xs text-slate-800 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Min Payment</label>
                  <input
                    type="number"
                    value={debt.minPayment}
                    onChange={(e) => updateDebt(debt.id, 'minPayment', Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-semibold text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
            <ShellInput
              label="Extra Monthly Payment"
              suffix="$"
              value={extraPayment}
              onChange={(e) => setExtraPayment(Number(e.target.value))}
            />
            <ShellSelect
              label="Payoff Strategy"
              value={method}
              onChange={(e) => setMethod(e.target.value as 'avalanche' | 'snowball')}
            >
              <option value="avalanche">Debt Avalanche (Highest Interest First)</option>
              <option value="snowball">Debt Snowball (Smallest Balance First)</option>
            </ShellSelect>
          </div>
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard
            label="Estimated Time to Debt-Free"
            value={<>{results.monthsToPayoff} <span className="text-lg font-medium opacity-80">months</span></>}
          />
          <div className="text-center text-xs text-slate-500 -mt-2">
            ({(results.monthsToPayoff / 12).toFixed(1)} years)
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-200/60">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Method Comparison
            </h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className={`p-3 bg-white rounded-xl border shadow-sm ${method === 'avalanche' ? 'border-teal-500 ring-2 ring-teal-500/10' : 'border-slate-200'}`}>
                <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Avalanche</span>
                <span className="text-md font-bold text-slate-800">{results.avalancheMonths} mos</span>
                <span className="text-[9px] text-red-500 block mt-0.5">{formatCurrency(results.avalancheInterest)} interest</span>
              </div>
              <div className={`p-3 bg-white rounded-xl border shadow-sm ${method === 'snowball' ? 'border-teal-500 ring-2 ring-teal-500/10' : 'border-slate-200'}`}>
                <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Snowball</span>
                <span className="text-md font-bold text-slate-800">{results.snowballMonths} mos</span>
                <span className="text-[9px] text-red-500 block mt-0.5">{formatCurrency(results.snowballInterest)} interest</span>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
