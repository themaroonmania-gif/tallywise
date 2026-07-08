'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorShell, ShellInput, ShellSelect, ResultCard } from './CalculatorShell';

export function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState<number>(400000);
  const [downPayment, setDownPayment] = useState<number>(80000); // 20%
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [downPaymentType, setDownPaymentType] = useState<'amount' | 'percent'>('amount');
  const [loanTerm, setLoanTerm] = useState<number>(30); // years
  const [interestRate, setInterestRate] = useState<number>(6.5); // %
  const [propertyTaxRate, setPropertyTaxRate] = useState<number>(1.2); // %
  const [homeInsurance, setHomeInsurance] = useState<number>(1200); // $/year
  const [extraPayment, setExtraPayment] = useState<number>(0); // $/month extra

  const [piti, setPiti] = useState({
    principalAndInterest: 0,
    propertyTax: 0,
    homeInsurance: 0,
    pmi: 0,
    totalMonthly: 0,
    loanAmount: 0,
  });

  const [amortization, setAmortization] = useState<{
    year: number;
    interestPaid: number;
    principalPaid: number;
    remainingBalance: number;
  }[]>([]);

  const [payoffStats, setPayoffStats] = useState({
    totalInterest: 0,
    totalInterestWithExtra: 0,
    yearsSaved: 0,
    interestSaved: 0,
  });

  // Handle down payment interactions
  useEffect(() => {
    if (downPaymentType === 'amount') {
      const pct = homePrice > 0 ? (downPayment / homePrice) * 100 : 0;
      setDownPaymentPercent(Number(pct.toFixed(2)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downPayment, homePrice]);

  useEffect(() => {
    if (downPaymentType === 'percent') {
      const amt = homePrice * (downPaymentPercent / 100);
      setDownPayment(Number(amt.toFixed(0)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downPaymentPercent, homePrice]);

  useEffect(() => {
    const loanAmount = Math.max(0, homePrice - downPayment);
    const r = interestRate / 100 / 12; // monthly interest rate
    const n = loanTerm * 12; // total number of monthly payments

    // Principal and Interest Monthly Payment Formula
    let monthlyPI = 0;
    if (r === 0) {
      monthlyPI = loanAmount / n;
    } else {
      monthlyPI = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    if (isNaN(monthlyPI) || !isFinite(monthlyPI)) {
      monthlyPI = 0;
    }

    // Monthly property tax
    const propertyTax = (homePrice * (propertyTaxRate / 100)) / 12;

    // Monthly insurance
    const insurance = homeInsurance / 12;

    // Monthly Private Mortgage Insurance (PMI)
    // Roughly 0.5% to 1.0% of the loan amount annually if down payment is less than 20%
    const pmiRate = downPaymentPercent < 20 ? 0.75 / 100 : 0;
    const pmi = (loanAmount * pmiRate) / 12;

    const totalMonthly = monthlyPI + propertyTax + insurance + pmi;

    setPiti({
      principalAndInterest: monthlyPI,
      propertyTax,
      homeInsurance: insurance,
      pmi,
      totalMonthly,
      loanAmount,
    });

    // Amortization Schedule Calculation
    let balance = loanAmount;
    let balanceWithExtra = loanAmount;
    let totalInterest = 0;
    let totalInterestWithExtra = 0;
    let monthCount = 0;
    let monthCountWithExtra = 0;

    const yearlyData: typeof amortization = [];
    let yearInterest = 0;
    let yearPrincipal = 0;

    // Regular schedule
    for (let m = 1; m <= n; m++) {
      if (balance <= 0) break;
      const iPayment = balance * r;
      let pPayment = monthlyPI - iPayment;
      if (pPayment > balance) pPayment = balance;
      balance -= pPayment;
      totalInterest += iPayment;
      monthCount++;

      // Collect yearly summary
      yearInterest += iPayment;
      yearPrincipal += pPayment;
      if (m % 12 === 0 || balance <= 0) {
        yearlyData.push({
          year: Math.ceil(m / 12),
          interestPaid: yearInterest,
          principalPaid: yearPrincipal,
          remainingBalance: balance,
        });
        yearInterest = 0;
        yearPrincipal = 0;
      }
    }

    // Schedule with extra payment
    const monthlyPIWithExtra = monthlyPI;
    const rExtra = r;
    for (let m = 1; m <= n; m++) {
      if (balanceWithExtra <= 0) break;
      const iPayment = balanceWithExtra * rExtra;
      let pPayment = monthlyPIWithExtra - iPayment + extraPayment;
      if (pPayment > balanceWithExtra) pPayment = balanceWithExtra;
      balanceWithExtra -= pPayment;
      totalInterestWithExtra += iPayment;
      monthCountWithExtra++;
    }

    const monthsSaved = Math.max(0, monthCount - monthCountWithExtra);
    const yearsSaved = Number((monthsSaved / 12).toFixed(1));
    const interestSaved = Math.max(0, totalInterest - totalInterestWithExtra);

    setAmortization(yearlyData.slice(0, 15)); // Show first 15 years to keep clean
    setPayoffStats({
      totalInterest,
      totalInterestWithExtra,
      yearsSaved,
      interestSaved,
    });
  }, [homePrice, downPayment, loanTerm, interestRate, propertyTaxRate, homeInsurance, extraPayment, downPaymentType, downPaymentPercent]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
    <CalculatorShell
      title="Mortgage Details"
      inputs={
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ShellInput
              label="Home Price"
              suffix="$"
              value={homePrice}
              onChange={(e) => setHomePrice(Number(e.target.value))}
              placeholder="e.g. 400000"
            />

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Down Payment</label>
                <div className="flex bg-slate-100 p-0.5 rounded-md text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setDownPaymentType('amount')}
                    className={`px-1.5 py-0.5 rounded ${downPaymentType === 'amount' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    $
                  </button>
                  <button
                    type="button"
                    onClick={() => setDownPaymentType('percent')}
                    className={`px-1.5 py-0.5 rounded ${downPaymentType === 'percent' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    %
                  </button>
                </div>
              </div>
              <div className="relative">
                {downPaymentType === 'amount' ? (
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-semibold text-slate-800 bg-white"
                  />
                ) : (
                  <input
                    type="number"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full pl-4 pr-8 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-semibold text-slate-800 bg-white"
                  />
                )}
                <span className={`absolute ${downPaymentType === 'amount' ? 'left-4' : 'right-4'} top-3 text-slate-400 font-medium`}>
                  {downPaymentType === 'amount' ? '$' : '%'}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-semibold">
                {downPaymentType === 'amount' ? `${downPaymentPercent}% of house price` : `$${downPayment.toLocaleString()} down`}
              </div>
            </div>
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
              <option value={30}>30 Years (Fixed)</option>
              <option value={20}>20 Years (Fixed)</option>
              <option value={15}>15 Years (Fixed)</option>
              <option value={10}>10 Years (Fixed)</option>
            </ShellSelect>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ShellInput
              label="Property Tax"
              suffix="%"
              step="0.01"
              value={propertyTaxRate}
              onChange={(e) => setPropertyTaxRate(Number(e.target.value))}
            />
            <ShellInput
              label="Home Ins. ($/year)"
              suffix="$"
              value={homeInsurance}
              onChange={(e) => setHomeInsurance(Number(e.target.value))}
            />
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-700">Early Payoff Option</h3>
            <ShellInput
              label="Extra Monthly Payment"
              suffix="$"
              value={extraPayment}
              onChange={(e) => setExtraPayment(Number(e.target.value))}
              placeholder="e.g. 200"
            />
          </div>
        </div>
      }
      results={
        <div className="space-y-6">
          <ResultCard label="Estimated Monthly Payment (PITI)" value={formatCurrency(piti.totalMonthly)} />
          <div className="text-xs text-slate-500 text-center -mt-4">
            Loan Amount: {formatCurrency(piti.loanAmount)}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-medium text-slate-700">
              <span>Principal & Interest</span>
              <span>{formatCurrency(piti.principalAndInterest)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>Property Taxes</span>
              <span>{formatCurrency(piti.propertyTax)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>Homeowner Insurance</span>
              <span>{formatCurrency(piti.homeInsurance)}</span>
            </div>
            {piti.pmi > 0 && (
              <div className="flex justify-between items-center text-sm text-slate-600">
                <span>PMI (Mortgage Insurance)</span>
                <span className="text-red-500 font-medium">{formatCurrency(piti.pmi)}</span>
              </div>
            )}
          </div>

          <div>
            <div className="w-full h-3 rounded-full flex overflow-hidden bg-slate-200">
              <div
                style={{ width: `${(piti.principalAndInterest / piti.totalMonthly) * 100 || 0}%` }}
                className="bg-teal-500"
                title="Principal & Interest"
              />
              <div
                style={{ width: `${(piti.propertyTax / piti.totalMonthly) * 100 || 0}%` }}
                className="bg-amber-400"
                title="Property Tax"
              />
              <div
                style={{ width: `${(piti.homeInsurance / piti.totalMonthly) * 100 || 0}%` }}
                className="bg-indigo-400"
                title="Insurance"
              />
              <div
                style={{ width: `${(piti.pmi / piti.totalMonthly) * 100 || 0}%` }}
                className="bg-red-400"
                title="PMI"
              />
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] text-slate-500 font-medium">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-500"></span>P & I</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span>Property Taxes</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-400"></span>Insurance</span>
              {piti.pmi > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span>PMI</span>}
            </div>
          </div>

          {extraPayment > 0 && (
            <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
              <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider block mb-2">
                Extra Payoff Impact
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-0.5">
                    Time Saved
                  </span>
                  <div className="text-md font-bold text-teal-600">
                    {payoffStats.yearsSaved} Years
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-0.5">
                    Interest Saved
                  </span>
                  <div className="text-md font-bold text-teal-600">
                    {formatCurrency(payoffStats.interestSaved)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      }
    />

    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-2">
      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
        Amortization Schedule (First 5 Years)
      </h3>
      <div className="overflow-x-auto rounded-lg border border-slate-100">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <th className="p-2.5">Year</th>
              <th className="p-2.5">Interest Paid</th>
              <th className="p-2.5">Principal Paid</th>
              <th className="p-2.5">Ending Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
            {amortization.slice(0, 5).map((row) => (
              <tr key={row.year} className="hover:bg-slate-50/50">
                <td className="p-2.5">Year {row.year}</td>
                <td className="p-2.5 text-red-500">-{formatCurrency(row.interestPaid)}</td>
                <td className="p-2.5 text-slate-800">{formatCurrency(row.principalPaid)}</td>
                <td className="p-2.5 text-slate-800 font-semibold">{formatCurrency(row.remainingBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}
