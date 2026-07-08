'use client';

import React, { useState, useEffect } from 'react';

export function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState<number>(100);
  const [discountPercent, setDiscountPercent] = useState<number>(30);
  const [additionalDiscount, setAdditionalDiscount] = useState<number>(10); // stacked coupon
  const [salesTax, setSalesTax] = useState<number>(7.5); // sales tax

  const [results, setResults] = useState({
    savings: 0,
    priceBeforeTax: 0,
    taxAmount: 0,
    finalPrice: 0,
  });

  const presets = [10, 20, 30, 40, 50, 70];

  useEffect(() => {
    const base = Math.max(0, originalPrice);
    const disc1 = Math.max(0, discountPercent);
    const disc2 = Math.max(0, additionalDiscount);
    const tax = Math.max(0, salesTax);

    // Apply primary discount
    const step1Savings = base * (disc1 / 100);
    const step1Price = base - step1Savings;

    // Apply stacked discount on the intermediate price
    const step2Savings = step1Price * (disc2 / 100);
    const priceBeforeTax = step1Price - step2Savings;

    // Total savings
    const savings = base - priceBeforeTax;

    // Sales tax
    const taxAmount = priceBeforeTax * (tax / 100);

    // Final price
    const finalPrice = priceBeforeTax + taxAmount;

    setResults({
      savings,
      priceBeforeTax,
      taxAmount,
      finalPrice,
    });
  }, [originalPrice, discountPercent, additionalDiscount, salesTax]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Inputs Column */}
        <div className="md:col-span-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Shopping Details</h2>

          {/* Original Price */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Original Price</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-slate-400 font-medium">$</span>
              <input
                type="number"
                step="0.01"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-850"
                placeholder="e.g. 59.99"
              />
            </div>
          </div>

          {/* Discount Presets & Input */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Discount Percentage</label>
            <div className="grid grid-cols-6 gap-1 mb-3">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setDiscountPercent(p)}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all duration-150 ${
                    discountPercent === p
                      ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
            
            <div className="relative">
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium text-slate-800"
              />
              <span className="absolute right-4 top-3 text-slate-400 font-medium">% OFF</span>
            </div>
          </div>

          {/* Additional Discount */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Additional Coupon / Stacked Discount (%) <span className="text-[10px] text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={additionalDiscount}
                onChange={(e) => setAdditionalDiscount(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium text-slate-800"
                placeholder="e.g. 10"
              />
              <span className="absolute right-4 top-3 text-slate-400 font-medium">% OFF</span>
            </div>
          </div>

          {/* Sales Tax */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Sales Tax (%)</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={salesTax}
                onChange={(e) => setSalesTax(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium text-slate-800"
                placeholder="e.g. 7.5"
              />
              <span className="absolute right-4 top-3 text-slate-400 font-medium">%</span>
            </div>
          </div>
        </div>

        {/* Right Output Column */}
        <div className="md:col-span-6 flex flex-col justify-between">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Savings Breakdown</h2>

            {/* Sale Price Card */}
            <div className="bg-amber-500 text-white rounded-xl p-6 text-center shadow-md shadow-amber-600/10">
              <span className="text-xs font-bold uppercase tracking-wider opacity-85 block mb-1">
                Final Sale Price (with Tax)
              </span>
              <div className="text-4xl font-extrabold tracking-tight">
                {formatCurrency(results.finalPrice)}
              </div>
            </div>

            {/* Values summary */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                <span>Original Price</span>
                <span>{formatCurrency(originalPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-650">
                <span>Total Coupon Savings</span>
                <span className="font-semibold text-emerald-600">-{formatCurrency(results.savings)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-650">
                <span>Price Before Tax</span>
                <span>{formatCurrency(results.priceBeforeTax)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-655">
                <span>Sales Tax ({salesTax}%)</span>
                <span>+{formatCurrency(results.taxAmount)}</span>
              </div>

              <div className="border-t border-slate-200/60 my-2"></div>

              <div className="flex justify-between items-center text-md font-extrabold text-slate-800">
                <span>You Save</span>
                <span className="text-emerald-700 font-extrabold">{formatCurrency(results.savings)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
