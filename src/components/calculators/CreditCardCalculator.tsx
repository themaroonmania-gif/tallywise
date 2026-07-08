'use client';

import React, { useState, useEffect } from 'react';

export function CreditCardCalculator() {
  const [balance, setBalance] = useState<number>(3000);
  const [apr, setApr] = useState<number>(22.9);
  const [monthlyPaymentType, setMonthlyPaymentType] = useState<'fixed' | 'minimum'>('fixed');
  const [fixedPayment, setFixedPayment] = useState<number>(150);

  const [results, setResults] = useState({
    monthsToPayoff: 0,
    totalInterest: 0,
    totalPaid: 0,
    warning: '',
  });

  useEffect(() => {
    let currentBalance = Math.max(0, balance);
    const r = Math.max(0, apr) / 100 / 12; // monthly rate
    let totalInterest = 0;
    let months = 0;
    let warning = '';

    if (currentBalance > 0) {
      while (currentBalance > 0 && months < 360) {
        months++;
        const interest = currentBalance * r;
        totalInterest += interest;
        currentBalance += interest;

        // Calculate payment size
        let payment = 0;
        if (monthlyPaymentType === 'fixed') {
          payment = fixedPayment;
        } else {
          // Minimum payment: standard is 3% of balance or $25, whichever is greater
          payment = Math.max(25, currentBalance * 0.03);
        }

        // If payment is less than interest, balance grows infinitely!
        if (payment <= interest) {
          warning = '⚠️ Your monthly payment is too low. It does not cover the accruing interest, causing your balance to grow indefinitely.';
          months = 999; // Represents infinite
          break;
        }

        const actualPayment = Math.min(currentBalance, payment);
        currentBalance -= actualPayment;
      }
    }

    setResults({
      monthsToPayoff: months,
      totalInterest: Number(totalInterest.toFixed(2)),
      totalPaid: Number((balance + totalInterest).toFixed(2)),
      warning,
    });
  }, [balance, apr, monthlyPaymentType, fixedPayment]);

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
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Credit Card Details</h2>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Card Balance</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-slate-400 font-medium">$</span>
              <input
                type="number"
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Interest Rate (APR %)</label>
              <input
                type="number"
                step="0.01"
                value={apr}
                onChange={(e) => setApr(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Payment Type</label>
              <select
                value={monthlyPaymentType}
                onChange={(e) => setMonthlyPaymentType(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800 bg-white"
              >
                <option value="fixed">Fixed Monthly Amount</option>
                <option value="minimum">Minimum Payment Only</option>
              </select>
            </div>
          </div>

          {monthlyPaymentType === 'fixed' && (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Monthly Payment Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-400 font-medium">$</span>
                <input
                  type="number"
                  value={fixedPayment}
                  onChange={(e) => setFixedPayment(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
                />
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-6 flex flex-col justify-between">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Payoff Estimate</h2>

            {results.warning ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-750 text-xs leading-relaxed font-semibold">
                {results.warning}
              </div>
            ) : (
              <div className="bg-emerald-600 text-white rounded-xl p-5 text-center shadow-md shadow-emerald-600/10">
                <span className="text-xs font-bold uppercase tracking-wider opacity-85 block mb-1">
                  Time to Pay Off Balance
                </span>
                <div className="text-3xl font-extrabold tracking-tight">
                  {results.monthsToPayoff} <span className="text-lg font-medium opacity-85">months</span>
                </div>
              </div>
            )}

            {!results.warning && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                  <span>Total Interest Accrued</span>
                  <span className="text-red-500 font-semibold">{formatCurrency(results.totalInterest)}</span>
                </div>
                <div className="border-t border-slate-200 my-2"></div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-850">
                  <span>Total Amount Paid</span>
                  <span>{formatCurrency(results.totalPaid)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
