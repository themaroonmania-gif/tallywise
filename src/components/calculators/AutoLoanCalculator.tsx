'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorShell, ShellInput, ShellSelect, ResultCard } from './CalculatorShell';

export function AutoLoanCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState<number>(35000);
  const [downPayment, setDownPayment] = useState<number>(5000);
  const [tradeInValue, setTradeInValue] = useState<number>(2000);
  const [interestRate, setInterestRate] = useState<number>(5.9);
  const [loanTerm, setLoanTerm] = useState<number>(60); // months
  const [salesTaxRate, setSalesTaxRate] = useState<number>(6.5); // %

  const [results, setResults] = useState({
    loanAmount: 0,
    monthlyPayment: 0,
    totalInterest: 0,
    totalSalesTax: 0,
    totalCost: 0,
  });

  useEffect(() => {
    const price = Math.max(0, vehiclePrice);
    const down = Math.max(0, downPayment);
    const trade = Math.max(0, tradeInValue);
    const rate = Math.max(0, interestRate) / 100 / 12; // monthly rate
    const taxRate = Math.max(0, salesTaxRate) / 100;

    const totalSalesTax = price * taxRate;
    const loanAmount = Math.max(0, price + totalSalesTax - down - trade);

    let monthlyPayment = 0;
    if (loanAmount > 0) {
      if (rate === 0) {
        monthlyPayment = loanAmount / loanTerm;
      } else {
        monthlyPayment = (loanAmount * rate * Math.pow(1 + rate, loanTerm)) / (Math.pow(1 + rate, loanTerm) - 1);
      }
    }

    const totalCost = (monthlyPayment * loanTerm) + down + trade;
    const totalInterest = Math.max(0, (monthlyPayment * loanTerm) - loanAmount);

    setResults({
      loanAmount,
      monthlyPayment: Number(monthlyPayment.toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2)),
      totalSalesTax: Number(totalSalesTax.toFixed(2)),
      totalCost: Number(totalCost.toFixed(2)),
    });
  }, [vehiclePrice, downPayment, tradeInValue, interestRate, loanTerm, salesTaxRate]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <CalculatorShell
      title="Auto Loan Details"
      inputs={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ShellInput
              label="Vehicle Price"
              suffix="$"
              value={vehiclePrice}
              onChange={(e) => setVehiclePrice(Number(e.target.value))}
            />
            <ShellInput
              label="Down Payment"
              suffix="$"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ShellInput
              label="Trade-in Value"
              suffix="$"
              value={tradeInValue}
              onChange={(e) => setTradeInValue(Number(e.target.value))}
            />
            <ShellInput
              label="Sales Tax"
              suffix="%"
              step="0.1"
              value={salesTaxRate}
              onChange={(e) => setSalesTaxRate(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ShellInput
              label="Interest Rate"
              suffix="%"
              step="0.01"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
            <ShellSelect
              label="Loan Term"
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
            >
              <option value={36}>36 Months (3 Years)</option>
              <option value={48}>48 Months (4 Years)</option>
              <option value={60}>60 Months (5 Years)</option>
              <option value={72}>72 Months (6 Years)</option>
              <option value={84}>84 Months (7 Years)</option>
            </ShellSelect>
          </div>
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard label="Estimated Monthly Payment" value={formatCurrency(results.monthlyPayment)} />

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
              <span>Total Loan Amount</span>
              <span>{formatCurrency(results.loanAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>Total Interest Paid</span>
              <span className="text-red-500 font-semibold">{formatCurrency(results.totalInterest)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>Total Sales Tax</span>
              <span>{formatCurrency(results.totalSalesTax)}</span>
            </div>
            <div className="border-t border-slate-200 my-2"></div>
            <div className="flex justify-between items-center text-sm font-bold text-slate-800">
              <span>Total Cost of Vehicle</span>
              <span>{formatCurrency(results.totalCost)}</span>
            </div>
          </div>
        </div>
      }
    />
  );
}
