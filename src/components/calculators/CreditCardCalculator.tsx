'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorShell, ShellInput, ShellSelect, ResultCard } from './CalculatorShell';

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
          warning = 'Your monthly payment is too low. It does not cover the accruing interest, causing your balance to grow indefinitely.';
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
    <CalculatorShell
      title="Credit Card Details"
      inputs={
        <div className="space-y-4">
          <ShellInput
            label="Card Balance"
            suffix="$"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
          />

          <div className="grid grid-cols-2 gap-4">
            <ShellInput
              label="Interest Rate (APR)"
              suffix="%"
              step="0.01"
              value={apr}
              onChange={(e) => setApr(Number(e.target.value))}
            />
            <ShellSelect
              label="Payment Type"
              value={monthlyPaymentType}
              onChange={(e) => setMonthlyPaymentType(e.target.value as 'fixed' | 'minimum')}
            >
              <option value="fixed">Fixed Monthly Amount</option>
              <option value="minimum">Minimum Payment Only</option>
            </ShellSelect>
          </div>

          {monthlyPaymentType === 'fixed' && (
            <ShellInput
              label="Monthly Payment Amount"
              suffix="$"
              value={fixedPayment}
              onChange={(e) => setFixedPayment(Number(e.target.value))}
            />
          )}
        </div>
      }
      results={
        <div className="space-y-4">
          {results.warning ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-xs leading-relaxed font-semibold">
              {results.warning}
            </div>
          ) : (
            <ResultCard
              label="Time to Pay Off Balance"
              value={<>{results.monthsToPayoff} <span className="text-lg font-medium opacity-85">months</span></>}
            />
          )}

          {!results.warning && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                <span>Total Interest Accrued</span>
                <span className="text-red-500 font-semibold">{formatCurrency(results.totalInterest)}</span>
              </div>
              <div className="border-t border-slate-200 my-2"></div>
              <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                <span>Total Amount Paid</span>
                <span>{formatCurrency(results.totalPaid)}</span>
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}
