'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorShell, ShellInput, ShellSelect, ResultCard } from './CalculatorShell';

export function PaycheckCalculator() {
  const [payType, setPayType] = useState<'salary' | 'hourly'>('salary');
  const [salaryAmount, setSalaryAmount] = useState<number>(75000);
  const [hourlyRate, setHourlyRate] = useState<number>(35);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(40);
  const [payFrequency, setPayFrequency] = useState<number>(26); // 26 = Bi-weekly, 12 = Monthly, 52 = Weekly, 24 = Semi-monthly
  const [filingStatus, setFilingStatus] = useState<'single' | 'married'>('single');
  const [stateTaxRate, setStateTaxRate] = useState<number>(4.5); // Custom state tax percentage
  const [stateSelect, setStateSelect] = useState<string>('custom');
  const [preTaxDeductionPercent, setPreTaxDeductionPercent] = useState<number>(5); // e.g. 401k
  const [healthInsurance, setHealthInsurance] = useState<number>(150); // flat per pay period

  const [results, setResults] = useState({
    grossPay: 0,
    federalTax: 0,
    ficaTax: 0,
    stateTax: 0,
    preTaxDeductions: 0,
    netPay: 0,
    annualGross: 0,
    annualNet: 0,
  });

  const statesList = [
    { code: 'TX', name: 'Texas (0%)', rate: 0 },
    { code: 'FL', name: 'Florida (0%)', rate: 0 },
    { code: 'WA', name: 'Washington (0%)', rate: 0 },
    { code: 'CA', name: 'California (~6.0%)', rate: 6.0 },
    { code: 'NY', name: 'New York (~5.5%)', rate: 5.5 },
    { code: 'IL', name: 'Illinois (4.95%)', rate: 4.95 },
    { code: 'custom', name: 'Custom State Rate', rate: 4.5 },
  ];

  const handleStateChange = (val: string) => {
    setStateSelect(val);
    const selected = statesList.find((s) => s.code === val);
    if (selected && val !== 'custom') {
      setStateTaxRate(selected.rate);
    }
  };

  useEffect(() => {
    // Calculate Annual Gross
    let annualGross = 0;
    if (payType === 'salary') {
      annualGross = salaryAmount;
    } else {
      annualGross = hourlyRate * hoursPerWeek * 52;
    }

    // Gross per pay period
    const grossPay = annualGross / payFrequency;

    // Pre-tax deductions per period
    const preTaxDeductions = (grossPay * (preTaxDeductionPercent / 100)) + healthInsurance;

    // Taxable gross per period
    const taxableGross = Math.max(0, grossPay - preTaxDeductions);
    const annualTaxableGross = taxableGross * payFrequency;

    // Simplified Federal Tax Bracket calculation (2026 guidelines)
    let annualFederalTax = 0;
    const stdDeduction = filingStatus === 'single' ? 15000 : 30000;
    const taxableIncome = Math.max(0, annualTaxableGross - stdDeduction);

    if (filingStatus === 'single') {
      if (taxableIncome <= 11600) {
        annualFederalTax = taxableIncome * 0.10;
      } else if (taxableIncome <= 47150) {
        annualFederalTax = 1160 + (taxableIncome - 11600) * 0.12;
      } else if (taxableIncome <= 100525) {
        annualFederalTax = 5426 + (taxableIncome - 47150) * 0.22;
      } else if (taxableIncome <= 191950) {
        annualFederalTax = 17168.5 + (taxableIncome - 100525) * 0.24;
      } else {
        annualFederalTax = 39110.5 + (taxableIncome - 191950) * 0.32;
      }
    } else {
      if (taxableIncome <= 23200) {
        annualFederalTax = taxableIncome * 0.10;
      } else if (taxableIncome <= 94300) {
        annualFederalTax = 2320 + (taxableIncome - 23200) * 0.12;
      } else if (taxableIncome <= 201050) {
        annualFederalTax = 10852 + (taxableIncome - 94300) * 0.22;
      } else {
        annualFederalTax = 34337 + (taxableIncome - 201050) * 0.24;
      }
    }

    const federalTax = annualFederalTax / payFrequency;

    // FICA calculations (6.2% Social Security + 1.45% Medicare)
    const ficaTax = grossPay * 0.0765;

    // State Tax calculation
    const stateTax = taxableGross * (stateTaxRate / 100);

    // Net pay per period
    const netPay = Math.max(0, grossPay - federalTax - ficaTax - stateTax - preTaxDeductions);
    const annualNet = netPay * payFrequency;

    setResults({
      grossPay,
      federalTax,
      ficaTax,
      stateTax,
      preTaxDeductions,
      netPay,
      annualGross,
      annualNet,
    });
  }, [
    payType,
    salaryAmount,
    hourlyRate,
    hoursPerWeek,
    payFrequency,
    filingStatus,
    stateTaxRate,
    preTaxDeductionPercent,
    healthInsurance,
  ]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  const getFreqName = (freq: number) => {
    if (freq === 52) return 'weekly';
    if (freq === 26) return 'bi-weekly';
    if (freq === 24) return 'semi-monthly';
    return 'monthly';
  };

  return (
    <div className="space-y-6">
    <CalculatorShell
      title="Calculator Inputs"
      inputs={
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Pay Type</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPayType('salary')}
                className={`py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  payType === 'salary'
                    ? 'bg-white text-teal-600 shadow-sm border border-slate-100'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Annual Salary
              </button>
              <button
                type="button"
                onClick={() => setPayType('hourly')}
                className={`py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  payType === 'hourly'
                    ? 'bg-white text-teal-600 shadow-sm border border-slate-100'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Hourly Wage
              </button>
            </div>
          </div>

          {payType === 'salary' ? (
            <ShellInput
              label="Annual Gross Salary"
              suffix="$"
              value={salaryAmount}
              onChange={(e) => setSalaryAmount(Number(e.target.value))}
              placeholder="e.g. 75000"
            />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <ShellInput
                label="Hourly Rate"
                suffix="$"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                placeholder="e.g. 25"
              />
              <ShellInput
                label="Hours / Week"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                placeholder="e.g. 40"
              />
            </div>
          )}

          <ShellSelect
            label="Pay Frequency"
            value={payFrequency}
            onChange={(e) => setPayFrequency(Number(e.target.value))}
          >
            <option value={52}>Weekly (52 checks/year)</option>
            <option value={26}>Bi-weekly (26 checks/year)</option>
            <option value={24}>Semi-monthly (24 checks/year)</option>
            <option value={12}>Monthly (12 checks/year)</option>
          </ShellSelect>

          <div className="grid grid-cols-2 gap-4">
            <ShellSelect
              label="Filing Status"
              value={filingStatus}
              onChange={(e) => setFilingStatus(e.target.value as 'single' | 'married')}
            >
              <option value="single">Single</option>
              <option value="married">Married Filing Jointly</option>
            </ShellSelect>

            <ShellSelect
              label="Location/State"
              value={stateSelect}
              onChange={(e) => handleStateChange(e.target.value)}
            >
              {statesList.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </ShellSelect>
          </div>

          {stateSelect === 'custom' && (
            <ShellInput
              label="Custom State Income Tax"
              suffix="%"
              step="0.1"
              value={stateTaxRate}
              onChange={(e) => setStateTaxRate(Number(e.target.value))}
            />
          )}

          <div className="border-t border-slate-100 pt-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-700">Pre-Tax Deductions (Optional)</h3>
            <div className="grid grid-cols-2 gap-4">
              <ShellInput
                label="Retirement/401(k)"
                suffix="%"
                value={preTaxDeductionPercent}
                onChange={(e) => setPreTaxDeductionPercent(Number(e.target.value))}
                placeholder="e.g. 5"
              />
              <ShellInput
                label="Health Ins. (Flat $)"
                suffix="$"
                value={healthInsurance}
                onChange={(e) => setHealthInsurance(Number(e.target.value))}
                placeholder="e.g. 150"
              />
            </div>
          </div>
        </div>
      }
      results={
        <div className="space-y-6">
          <ResultCard label="Estimated Net Pay (per check)" value={formatCurrency(results.netPay)} />
          <div className="text-xs text-slate-500 text-center -mt-4 capitalize">
            Based on {getFreqName(payFrequency)} schedule
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
              <span>Gross Income per period</span>
              <span>{formatCurrency(results.grossPay)}</span>
            </div>

            <div className="border-t border-slate-200/60 my-2"></div>

            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>Federal Income Tax</span>
              <span className="font-medium text-red-500">-{formatCurrency(results.federalTax)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>FICA Taxes (Soc Sec + Med)</span>
              <span className="font-medium text-red-500">-{formatCurrency(results.ficaTax)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>State Income Tax</span>
              <span className="font-medium text-red-500">-{formatCurrency(results.stateTax)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>Pre-Tax Deductions</span>
              <span className="font-medium text-red-500">-{formatCurrency(results.preTaxDeductions)}</span>
            </div>

            <div className="border-t border-slate-200/60 my-2"></div>

            <div className="flex justify-between items-center text-sm font-bold text-slate-800">
              <span>Net Pay (Take-Home)</span>
              <span className="text-teal-600">{formatCurrency(results.netPay)}</span>
            </div>
          </div>

          <div className="pt-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
              Visual Breakdown
            </label>
            <div className="w-full h-3 rounded-full flex overflow-hidden bg-slate-200">
              <div
                style={{ width: `${(results.netPay / results.grossPay) * 100 || 0}%` }}
                className="bg-teal-500"
                title="Net Pay"
              />
              <div
                style={{ width: `${(results.federalTax / results.grossPay) * 100 || 0}%` }}
                className="bg-red-400"
                title="Federal Tax"
              />
              <div
                style={{ width: `${(results.ficaTax / results.grossPay) * 100 || 0}%` }}
                className="bg-orange-400"
                title="FICA"
              />
              <div
                style={{ width: `${(results.stateTax / results.grossPay) * 100 || 0}%` }}
                className="bg-amber-400"
                title="State Tax"
              />
              <div
                style={{ width: `${(results.preTaxDeductions / results.grossPay) * 100 || 0}%` }}
                className="bg-slate-400"
                title="Pre-tax Deductions"
              />
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] text-slate-500 font-medium">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-500"></span>Net Pay</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span>Fed Tax</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400"></span>FICA</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span>State Tax</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400"></span>Pre-Tax</span>
            </div>
          </div>
        </div>
      }
    />

    <div className="bg-slate-100 rounded-2xl p-4 grid grid-cols-2 gap-4 border border-slate-200/50">
      <div className="text-center border-r border-slate-200">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-0.5">
          Annual Gross
        </span>
        <div className="text-md font-bold text-slate-700">
          {formatCurrency(results.annualGross)}
        </div>
      </div>
      <div className="text-center">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-0.5">
          Annual Net Take-Home
        </span>
        <div className="text-md font-bold text-teal-600">
          {formatCurrency(results.annualNet)}
        </div>
      </div>
    </div>
    </div>
  );
}
