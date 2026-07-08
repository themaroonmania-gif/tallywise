'use client';

import React, { useState, useEffect } from 'react';

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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Auto Loan Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Vehicle Price</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-400 font-medium">$</span>
                <input
                  type="number"
                  value={vehiclePrice}
                  onChange={(e) => setVehiclePrice(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Down Payment</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-400 font-medium">$</span>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Trade-in Value</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-400 font-medium">$</span>
                <input
                  type="number"
                  value={tradeInValue}
                  onChange={(e) => setTradeInValue(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Sales Tax (%)</label>
              <input
                type="number"
                step="0.1"
                value={salesTaxRate}
                onChange={(e) => setSalesTaxRate(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Loan Term</label>
              <select
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800 bg-white"
              >
                <option value={36}>36 Months (3 Years)</option>
                <option value={48}>48 Months (4 Years)</option>
                <option value={60}>60 Months (5 Years)</option>
                <option value={72}>72 Months (6 Years)</option>
                <option value={84}>84 Months (7 Years)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="md:col-span-6 flex flex-col justify-between">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Payment Summary</h2>

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
              <div className="flex justify-between items-center text-sm font-bold text-slate-850">
                <span>Total Cost of Vehicle</span>
                <span>{formatCurrency(results.totalCost)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
