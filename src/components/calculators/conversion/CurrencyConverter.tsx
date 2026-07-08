'use client';

import React, { useEffect, useState } from 'react';
import { CalculatorShell, ShellInput, ResultCard } from '../CalculatorShell';

export function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(100);
  const [rate, setRate] = useState<number>(1.08);
  const [fromCode, setFromCode] = useState('USD');
  const [toCode, setToCode] = useState('EUR');
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    setResult(amount * rate);
  }, [amount, rate]);

  return (
    <CalculatorShell
      title="Convert Currency"
      inputs={
        <div className="space-y-4">
          <ShellInput label="Amount" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">From Currency Code</label>
              <input
                type="text"
                value={fromCode}
                onChange={(e) => setFromCode(e.target.value.toUpperCase())}
                maxLength={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-semibold text-slate-800 bg-white uppercase"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">To Currency Code</label>
              <input
                type="text"
                value={toCode}
                onChange={(e) => setToCode(e.target.value.toUpperCase())}
                maxLength={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-semibold text-slate-800 bg-white uppercase"
              />
            </div>
          </div>
          <ShellInput
            label="Exchange Rate (enter current rate)"
            value={rate}
            step="0.0001"
            onChange={(e) => setRate(Number(e.target.value))}
          />
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
            This tool does not fetch live rates. Enter the current exchange rate from your bank or a financial data source for an accurate result.
          </p>
        </div>
      }
      results={
        <ResultCard
          label={`${amount} ${fromCode} equals`}
          value={`${result.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${toCode}`}
        />
      }
    />
  );
}
