'use client';

import React, { useState, useEffect } from 'react';

export function PersonalLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(10000);
  const [loanTerm, setLoanTerm] = useState<number>(3); // years
  const [interestRate, setInterestRate] = useState<number>(9.5);
  const [originationFee, setOriginationFee] = useState<number>(2); // %

  const [results, setResults] = useState({
    monthlyPayment: 0,
    totalInterest: 0,
    feeAmount: 0,
    netDisbursed: 0,
    totalPayments: 0,
    apr: 0,
  });

  useEffect(() => {
    const principal = Math.max(0, loanAmount);
    const rate = Math.max(0, interestRate) / 100 / 12; // monthly rate
    const termMonths = loanTerm * 12;
    const feePct = Math.max(0, originationFee) / 100;

    let monthlyPayment = 0;
    if (principal > 0) {
      if (rate === 0) {
        monthlyPayment = principal / termMonths;
      } else {
        monthlyPayment = (principal * rate * Math.pow(1 + rate, termMonths)) / (Math.pow(1 + rate, termMonths) - 1);
      }
    }

    const feeAmount = principal * feePct;
    const netDisbursed = Math.max(0, principal - feeAmount);
    const totalPayments = monthlyPayment * termMonths;
    const totalInterest = Math.max(0, totalPayments - principal);

    // Simplified APR approximation (including origination fee)
    // APR = ((Interest + Fees) / Principal) / (Years of Loan) * 100
    let apr = interestRate;
    if (principal > 0 && loanTerm > 0) {
      const totalFinancingCost = totalInterest + feeAmount;
      apr = (totalFinancingCost / principal) / loanTerm * 100;
    }

    setResults({
      monthlyPayment: Number(monthlyPayment.toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2)),
      feeAmount: Number(feeAmount.toFixed(2)),
      netDisbursed: Number(netDisbursed.toFixed(2)),
      totalPayments: Number(totalPayments.toFixed(2)),
      apr: Number(apr.toFixed(2)),
    });
  }, [loanAmount, loanTerm, interestRate, originationFee]);

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
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Personal Loan Details</h2>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Loan Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-slate-400 font-medium">$</span>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Loan Term (Years)</label>
              <input
                type="number"
                min={1}
                max={15}
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
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
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Origination Fee (%)</label>
            <input
              type="number"
              step="0.1"
              value={originationFee}
              onChange={(e) => setOriginationFee(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
            />
          </div>
        </div>

        <div className="md:col-span-6 flex flex-col justify-between">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Loan Summary</h2>

            <div className="bg-emerald-600 text-white rounded-xl p-6 text-center shadow-md shadow-emerald-600/10">
              <span className="text-xs font-bold uppercase tracking-wider opacity-85 block mb-1">
                Estimated Monthly Payment
              </span>
              <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {formatCurrency(results.monthlyPayment)}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                <span>Total Interest Cost</span>
                <span className="text-red-500 font-semibold">{formatCurrency(results.totalInterest)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-600">
                <span>Origination Fee ({originationFee}%)</span>
                <span>{formatCurrency(results.feeAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-600">
                <span>Net Amount Disbursed</span>
                <span className="text-emerald-600 font-semibold">{formatCurrency(results.netDisbursed)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-600">
                <span>Estimated APR</span>
                <span className="font-semibold text-slate-800">{results.apr}%</span>
              </div>
              <div className="border-t border-slate-200 my-2"></div>
              <div className="flex justify-between items-center text-sm font-bold text-slate-850">
                <span>Total Amount Repaid</span>
                <span>{formatCurrency(results.totalPayments)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
