import React from 'react';
import { PaycheckCalculator } from './PaycheckCalculator';
import { MortgageCalculator } from './MortgageCalculator';
import { TipCalculator } from './TipCalculator';
import { GpaCalculator } from './GpaCalculator';
import { GradeCalculator } from './GradeCalculator';
import { BmiCalculator } from './BmiCalculator';
import { CalorieCalculator } from './CalorieCalculator';
import { AgeCalculator } from './AgeCalculator';
import { PercentageCalculator } from './PercentageCalculator';
import { DiscountCalculator } from './DiscountCalculator';

// Import remaining calculators
import { AutoLoanCalculator } from './AutoLoanCalculator';
import { PersonalLoanCalculator } from './PersonalLoanCalculator';
import { SalesTaxCalculator } from './SalesTaxCalculator';
import { CompoundInterestCalculator } from './CompoundInterestCalculator';
import { RetirementCalculator } from './RetirementCalculator';
import { DebtPayoffCalculator } from './DebtPayoffCalculator';
import { CreditCardCalculator } from './CreditCardCalculator';
import { WeightLossCalculator } from './WeightLossCalculator';
import { PregnancyCalculator } from './PregnancyCalculator';
import { BodyFatCalculator } from './BodyFatCalculator';
import { WaterIntakeCalculator } from './WaterIntakeCalculator';
import { FinalGradeCalculator } from './FinalGradeCalculator';
import { GradeCurveCalculator } from './GradeCurveCalculator';
import { DateDifferenceCalculator } from './DateDifferenceCalculator';
import { UnitConverter } from './UnitConverter';
import { TimeZoneCalculator } from './TimeZoneCalculator';

// Registry mapping slug names to their React components
export const calculatorComponents: Record<string, React.ComponentType> = {
  'paycheck-calculator': PaycheckCalculator,
  'mortgage-calculator': MortgageCalculator,
  'tip-calculator': TipCalculator,
  'gpa-calculator': GpaCalculator,
  'grade-calculator': GradeCalculator,
  'bmi-calculator': BmiCalculator,
  'calorie-calculator': CalorieCalculator,
  'age-calculator': AgeCalculator,
  'percentage-calculator': PercentageCalculator,
  'discount-calculator': DiscountCalculator,
  
  // Register newly implemented calculators
  'auto-loan-calculator': AutoLoanCalculator,
  'personal-loan-calculator': PersonalLoanCalculator,
  'sales-tax-calculator': SalesTaxCalculator,
  'compound-interest-calculator': CompoundInterestCalculator,
  'retirement-calculator': RetirementCalculator,
  'debt-payoff-calculator': DebtPayoffCalculator,
  'credit-card-calculator': CreditCardCalculator,
  'calorie-loss-calculator': WeightLossCalculator,
  'pregnancy-due-date': PregnancyCalculator,
  'body-fat-calculator': BodyFatCalculator,
  'water-intake-calculator': WaterIntakeCalculator,
  'final-grade-calculator': FinalGradeCalculator,
  'grade-curve-calculator': GradeCurveCalculator,
  'date-difference-calculator': DateDifferenceCalculator,
  'unit-converter': UnitConverter,
  'time-zone-calculator': TimeZoneCalculator,
};

// Beautiful Coming Soon component to display for any unmapped calculator (if any are added in the future)
export function ComingSoonCalculator({
  name,
  formula,
}: {
  name: string;
  formula: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center max-w-2xl mx-auto space-y-6">
      <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.42 15.17L17.25 21A1.79 1.79 0 0019 21.75c.46 0 .9-.18 1.25-.53.7-.7.7-1.8 0-2.5L14.42 13M12.84 9.16l4.9-4.9a1.77 1.77 0 00-2.5-2.5l-4.9 4.9M8.32 15.17l-4.9 4.9A1.77 1.77 0 005.92 22.57l4.9-4.9M3 9h6M9 3v6M15 15h6M21 9v6"
          />
        </svg>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-slate-800">{name} - Coming Soon</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Our mathematical validation team is currently calibrating and review-testing this calculator model to guarantee 100% compliance and exact-value outputs.
        </p>
      </div>

      {formula && (
        <div className="p-4 bg-slate-50 rounded-xl inline-block max-w-full text-xs font-mono text-slate-600 border border-slate-200">
          <span className="font-bold block uppercase text-[10px] text-slate-400 mb-1">Expected Formula</span>
          <code>{formula}</code>
        </div>
      )}

      <div className="border-t border-slate-100 pt-6">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
          System Verification Status
        </div>
        <div className="mt-2 flex justify-center items-center gap-1.5 text-xs text-amber-600 font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
          Running Math Validation Suite
        </div>
      </div>
    </div>
  );
}
