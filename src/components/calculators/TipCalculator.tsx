'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorShell, ShellInput, ResultCard } from './CalculatorShell';

export function TipCalculator() {
  const [billSubtotal, setBillSubtotal] = useState<number>(64.5);
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(3);
  const [customTip, setCustomTip] = useState<string>('');

  const [results, setResults] = useState({
    tipAmount: 0,
    totalBill: 0,
    tipPerPerson: 0,
    totalPerPerson: 0,
  });

  const tipPresets = [10, 15, 18, 20, 25];

  useEffect(() => {
    const subtotal = Math.max(0, billSubtotal);
    const percent = Math.max(0, tipPercent);
    const people = Math.max(1, numberOfPeople);

    const tipAmount = subtotal * (percent / 100);
    const totalBill = subtotal + tipAmount;
    const tipPerPerson = tipAmount / people;
    const totalPerPerson = totalBill / people;

    setResults({
      tipAmount,
      totalBill,
      tipPerPerson,
      totalPerPerson,
    });
  }, [billSubtotal, tipPercent, numberOfPeople]);

  const handlePresetClick = (preset: number) => {
    setTipPercent(preset);
    setCustomTip('');
  };

  const handleCustomTipChange = (val: string) => {
    setCustomTip(val);
    if (val !== '') {
      setTipPercent(Number(val));
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  return (
    <CalculatorShell
      title="Bill Details"
      inputs={
        <div className="space-y-4">
          <ShellInput
            label="Bill Subtotal"
            suffix="$"
            step="0.01"
            value={billSubtotal}
            onChange={(e) => setBillSubtotal(Number(e.target.value))}
            placeholder="e.g. 50.00"
          />

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Tip Percentage</label>
            <div className="grid grid-cols-5 gap-1.5 mb-3">
              {tipPresets.map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handlePresetClick(pct)}
                  className={`py-2 text-xs md:text-sm font-bold rounded-lg border transition-all duration-150 ${
                    tipPercent === pct && customTip === ''
                      ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="number"
                value={customTip}
                onChange={(e) => handleCustomTipChange(e.target.value)}
                placeholder="Custom tip percentage..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-semibold text-slate-800 bg-white transition-all hover:border-slate-300"
              />
              <span className="absolute right-4 top-3 text-slate-400 font-medium">%</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Split Bill Between</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
              >
                -
              </button>
              <input
                type="number"
                value={numberOfPeople}
                min={1}
                onChange={(e) => setNumberOfPeople(Math.max(1, Number(e.target.value)))}
                className="w-20 text-center py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-semibold text-slate-800"
              />
              <button
                type="button"
                onClick={() => setNumberOfPeople(numberOfPeople + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
              >
                +
              </button>
              <span className="text-sm font-semibold text-slate-550">people</span>
            </div>
          </div>
        </div>
      }
      results={
        <div className="space-y-4">
          {numberOfPeople > 1 ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <ResultCard label="Total per Person" value={formatCurrency(results.totalPerPerson)} />
              </div>
              <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-200/50">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block mb-0.5">
                  Tip per Person
                </span>
                <div className="text-md font-bold text-slate-700">
                  {formatCurrency(results.tipPerPerson)}
                </div>
              </div>
              <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-200/50">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block mb-0.5">
                  Subtotal per Person
                </span>
                <div className="text-md font-bold text-slate-700">
                  {formatCurrency(billSubtotal / numberOfPeople)}
                </div>
              </div>
            </div>
          ) : (
            <ResultCard label="Total Bill (Subtotal + Tip)" value={formatCurrency(results.totalBill)} />
          )}

          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
              <span>Bill Subtotal</span>
              <span>{formatCurrency(billSubtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>Tip Percentage</span>
              <span>{tipPercent}%</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>Total Tip Amount</span>
              <span className="font-semibold text-emerald-600">+{formatCurrency(results.tipAmount)}</span>
            </div>

            <div className="border-t border-slate-200/60 my-2"></div>

            <div className="flex justify-between items-center text-md font-extrabold text-slate-800">
              <span>Total Amount Due</span>
              <span className="text-teal-700">{formatCurrency(results.totalBill)}</span>
            </div>
          </div>
        </div>
      }
    />
  );
}
