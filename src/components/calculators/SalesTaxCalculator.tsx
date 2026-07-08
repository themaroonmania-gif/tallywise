'use client';

import React, { useState, useEffect } from 'react';

export function SalesTaxCalculator() {
  const [calculationMode, setCalculationMode] = useState<'add' | 'reverse'>('add');
  const [amount, setAmount] = useState<number>(100);
  const [taxRate, setTaxRate] = useState<number>(8.25);

  const [results, setResults] = useState({
    baseAmount: 0,
    taxAmount: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    const inputAmount = Math.max(0, amount);
    const rate = Math.max(0, taxRate) / 100;

    let baseAmount = 0;
    let taxAmount = 0;
    let totalAmount = 0;

    if (calculationMode === 'add') {
      baseAmount = inputAmount;
      taxAmount = inputAmount * rate;
      totalAmount = inputAmount + taxAmount;
    } else {
      // Reverse sales tax
      baseAmount = inputAmount / (1 + rate);
      taxAmount = inputAmount - baseAmount;
      totalAmount = inputAmount;
    }

    setResults({
      baseAmount: Number(baseAmount.toFixed(2)),
      taxAmount: Number(taxAmount.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
    });
  }, [calculationMode, amount, taxRate]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Sales Tax Details</h2>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Calculation Type</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setCalculationMode('add')}
                className={`py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  calculationMode === 'add'
                    ? 'bg-white text-emerald-600 shadow-sm border border-slate-100'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Add Sales Tax
              </button>
              <button
                type="button"
                onClick={() => setCalculationMode('reverse')}
                className={`py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  calculationMode === 'reverse'
                    ? 'bg-white text-emerald-600 shadow-sm border border-slate-100'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Reverse Tax (Remove)
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              {calculationMode === 'add' ? 'Pre-Tax Amount' : 'Total Amount (Post-Tax)'}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-slate-400 font-medium">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Sales Tax Rate (%)</label>
            <input
              type="number"
              step="0.01"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
            />
          </div>
        </div>

        <div className="md:col-span-6 flex flex-col justify-between">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Tax Summary</h2>

            <div className="bg-emerald-600 text-white rounded-xl p-6 text-center shadow-md shadow-emerald-600/10">
              <span className="text-xs font-bold uppercase tracking-wider opacity-85 block mb-1">
                {calculationMode === 'add' ? 'Total Amount (With Tax)' : 'Base Price (Without Tax)'}
              </span>
              <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {calculationMode === 'add' ? formatCurrency(results.totalAmount) : formatCurrency(results.baseAmount)}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                <span>Pre-Tax Subtotal</span>
                <span>{formatCurrency(results.baseAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-600">
                <span>Sales Tax ({taxRate}%)</span>
                <span className="font-semibold text-emerald-600">+{formatCurrency(results.taxAmount)}</span>
              </div>
              <div className="border-t border-slate-200 my-2"></div>
              <div className="flex justify-between items-center text-sm font-bold text-slate-850">
                <span>Total Bill (Post-Tax)</span>
                <span>{formatCurrency(results.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
