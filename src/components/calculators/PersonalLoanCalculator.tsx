'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorShell, ShellInput, ResultCard } from './CalculatorShell';

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
    <CalculatorShell
      title="Personal Loan Details"
      inputs={
        <div className="space-y-4">
          <ShellInput
            label="Loan Amount"
            suffix="$"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
          />

          <div className="grid grid-cols-2 gap-4">
            <ShellInput
              label="Loan Term (Years)"
              min={1}
              max={15}
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
            />
            <ShellInput
              label="Interest Rate"
              suffix="%"
              step="0.01"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
          </div>

          <ShellInput
            label="Origination Fee"
            suffix="%"
            step="0.1"
            value={originationFee}
            onChange={(e) => setOriginationFee(Number(e.target.value))}
          />
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard label="Estimated Monthly Payment" value={formatCurrency(results.monthlyPayment)} />

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
            <div className="flex justify-between items-center text-sm font-bold text-slate-800">
              <span>Total Amount Repaid</span>
              <span>{formatCurrency(results.totalPayments)}</span>
            </div>
          </div>
        </div>
      }
    />
  );
}
