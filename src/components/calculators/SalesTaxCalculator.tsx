'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorShell, ShellInput, ResultCard } from './CalculatorShell';

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
    <CalculatorShell
      title="Sales Tax Details"
      inputs={
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Calculation Type</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setCalculationMode('add')}
                className={`py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  calculationMode === 'add'
                    ? 'bg-white text-teal-600 shadow-sm border border-slate-100'
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
                    ? 'bg-white text-teal-600 shadow-sm border border-slate-100'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Reverse Tax (Remove)
              </button>
            </div>
          </div>

          <ShellInput
            label={calculationMode === 'add' ? 'Pre-Tax Amount' : 'Total Amount (Post-Tax)'}
            suffix="$"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          <ShellInput
            label="Sales Tax Rate"
            suffix="%"
            step="0.01"
            value={taxRate}
            onChange={(e) => setTaxRate(Number(e.target.value))}
          />
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard
            label={calculationMode === 'add' ? 'Total Amount (With Tax)' : 'Base Price (Without Tax)'}
            value={calculationMode === 'add' ? formatCurrency(results.totalAmount) : formatCurrency(results.baseAmount)}
          />

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
            <div className="flex justify-between items-center text-sm font-bold text-slate-800">
              <span>Total Bill (Post-Tax)</span>
              <span>{formatCurrency(results.totalAmount)}</span>
            </div>
          </div>
        </div>
      }
    />
  );
}
