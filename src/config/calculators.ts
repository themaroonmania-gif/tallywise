export interface CalculatorDef {
  slug: string;
  category: 'finance' | 'health' | 'school' | 'everyday';
  name: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  formulaDescription: string;
  explainerHtml: string;
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
}

export const CATEGORIES = {
  finance: {
    name: 'Finance',
    description: 'Calculate loans, interest, take-home pay, and manage your debt payoff.',
    color: 'emerald',
    iconName: 'DollarSign',
  },
  health: {
    name: 'Health & Fitness',
    description: 'Track BMI, daily calorie needs (TDEE), pregnancy milestones, and body fat.',
    color: 'rose',
    iconName: 'Activity',
  },
  school: {
    name: 'School & Academic',
    description: 'Calculate your GPA, weigh test scores, and figure out final exam goals.',
    color: 'indigo',
    iconName: 'GraduationCap',
  },
  everyday: {
    name: 'Everyday & Utility',
    description: 'Calculate differences in dates, exact age, percentages, and unit conversions.',
    color: 'amber',
    iconName: 'Calculator',
  },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export const calculators: CalculatorDef[] = [
  // --- FINANCE ---
  {
    slug: 'paycheck-calculator',
    category: 'finance',
    name: 'Paycheck Calculator',
    h1: 'Paycheck Calculator',
    seoTitle: 'Paycheck Calculator - Calculate Take-Home Pay & Taxes',
    seoDescription: 'Estimate your take-home pay or net income after federal, state, and local tax withholdings. Toggle hourly vs salary rates.',
    formulaDescription: 'Net Pay = Gross Pay - Federal Income Tax - FICA (Social Security & Medicare) - State Tax - Pre-tax Deductions',
    explainerHtml: `
      <p>A paycheck calculator helps you estimate your actual take-home pay after taxes and payroll deductions are subtracted from your gross earnings. Whether you are salaried or paid hourly, understanding the difference between your gross pay and net pay is critical for budgeting.</p>
      
      <h3>Hourly vs. Salary Calculations</h3>
      <p>Salaried employees typically receive a fixed gross amount per pay period (e.g., bi-weekly or monthly), whereas hourly employees' gross pay is determined by multiplying the hours worked by their hourly rate. Overtime hours, usually calculated at 1.5 times the hourly rate, are added separately.</p>
      
      <h3>Common Payroll Deductions</h3>
      <ul>
        <li><strong>Federal Income Tax:</strong> Calculated based on your tax bracket, filing status (Single, Married), and W-4 declarations.</li>
        <li><strong>FICA Taxes:</strong> 6.2% for Social Security and 1.45% for Medicare.</li>
        <li><strong>State & Local Tax:</strong> Varies heavily by location. States like Texas and Florida have no state income tax, while California and New York have progressive rates.</li>
        <li><strong>Pre-tax Deductions:</strong> Contributions to a 401(k) or health insurance premiums, which reduce your taxable income.</li>
      </ul>
    `,
    faqs: [
      {
        question: 'What is the difference between gross pay and net pay?',
        answer: 'Gross pay is the total amount of money you earn before any deductions are made. Net pay (take-home pay) is the amount you actually receive in your bank account after taxes, FICA, health insurance, and retirement contributions have been subtracted.'
      },
      {
        question: 'How much are FICA taxes?',
        answer: 'FICA taxes consist of 6.2% for Social Security (up to the wage base limit) and 1.45% for Medicare. Both are withheld from your gross pay, and your employer matches these contributions.'
      },
      {
        question: 'Do states without income tax mean I keep all my money?',
        answer: 'While states like Texas, Florida, and Washington do not levy a state income tax on wage income, you still must pay federal income tax and FICA taxes. Additionally, these states may offset the lack of income tax with higher property or sales taxes.'
      }
    ],
    relatedSlugs: ['mortgage-calculator', 'tip-calculator', 'compound-interest-calculator']
  },
  {
    slug: 'mortgage-calculator',
    category: 'finance',
    name: 'Mortgage Calculator',
    h1: 'Mortgage Calculator',
    seoTitle: 'Mortgage Calculator - Estimate Monthly House Payments',
    seoDescription: 'Calculate your monthly mortgage payment including principal, interest, taxes, and insurance (PITI). Includes amortization schedule.',
    formulaDescription: 'M = P [ i(1 + i)^n ] / [ (1 + i)^n - 1 ] where P is principal, i is monthly interest rate, and n is number of monthly payments.',
    explainerHtml: `
      <p>A mortgage calculator helps home buyers estimate their monthly housing expenses. The calculation goes beyond just the loan principal and interest to include other essential factors like property taxes, homeowner's insurance, and private mortgage insurance (PMI).</p>
      
      <h3>Components of a Mortgage Payment (PITI)</h3>
      <ul>
        <li><strong>Principal:</strong> The actual money borrowed to buy the home, which you pay back over the life of the loan.</li>
        <li><strong>Interest:</strong> The fee charged by the lender for borrowing the money, determined by your interest rate.</li>
        <li><strong>Taxes:</strong> Local real estate or property taxes, which are often held in escrow and paid annually by the bank on your behalf.</li>
        <li><strong>Insurance:</strong> Homeowner's hazard insurance and, if your down payment is less than 20%, Private Mortgage Insurance (PMI).</li>
      </ul>
      
      <h3>How Interest Rates Impact Payments</h3>
      <p>Even a 1% difference in your mortgage interest rate can translate into tens of thousands of dollars saved or spent over a 30-year term. Getting pre-approved and maintaining a high credit score is key to securing the lowest possible rate.</p>
    `,
    faqs: [
      {
        question: 'What is PMI and how do I avoid it?',
        answer: 'Private Mortgage Insurance (PMI) is a lender protection fee required when your down payment is less than 20% of the home purchase price. You can avoid it by putting down 20% or more, or have it removed once your home equity reaches 20%.'
      },
      {
        question: 'Is a 15-year or 30-year mortgage better?',
        answer: 'A 30-year mortgage offers lower monthly payments but costs much more in interest over the life of the loan. A 15-year mortgage has higher monthly payments but allows you to pay off the house twice as fast and save significantly on interest.'
      },
      {
        question: 'What is escrow?',
        answer: 'Escrow is a neutral account set up by your mortgage lender to hold funds for property taxes and homeowner\'s insurance. A portion of your monthly payment goes into escrow, and the lender pays the tax and insurance bills when they come due.'
      }
    ],
    relatedSlugs: ['paycheck-calculator', 'auto-loan-calculator', 'compound-interest-calculator']
  },
  {
    slug: 'tip-calculator',
    category: 'finance',
    name: 'Tip Calculator',
    h1: 'Tip Calculator',
    seoTitle: 'Tip Calculator - Split Bills & Calculate Tips Fast',
    seoDescription: 'Quickly calculate the gratuity for a restaurant bill and easily split the total cost among multiple people.',
    formulaDescription: 'Tip Amount = Bill Subtotal * (Tip Percentage / 100). Total Bill = Bill Subtotal + Tip Amount. Cost per Person = Total Bill / Number of People.',
    explainerHtml: `
      <p>A tip calculator is a handy everyday financial tool that ensures you leave the correct gratuity for service staff and split the final bill evenly among friends or colleagues. Gratuity customs vary widely by region, but standard tipping in the US is typically between 15% and 20%.</p>
      
      <h3>Tipping Etiquette Guidelines</h3>
      <ul>
        <li><strong>Exceptional Service:</strong> 20% to 25% of the pre-tax bill.</li>
        <li><strong>Good/Standard Service:</strong> 18% of the pre-tax bill.</li>
        <li><strong>Average Service:</strong> 15% of the pre-tax bill.</li>
        <li><strong>Poor Service:</strong> 10% or less, though it is usually better to speak with a manager if service is extremely subpar.</li>
      </ul>
      
      <h3>Should you tip on tax?</h3>
      <p>Standard tipping practice is to calculate the tip amount based on the pre-tax subtotal of the bill, rather than the final total that includes state or local sales tax.</p>
    `,
    faqs: [
      {
        question: 'Is tipping calculated before or after tax?',
        answer: 'Traditionally, tips are calculated based on the pre-tax subtotal of your meal, not the total post-tax bill. However, many POS systems and payment screens calculate tips on the post-tax total by default.'
      },
      {
        question: 'How do you split a bill unevenly?',
        answer: 'Standard split-the-bill tools assume an even split. If people order vastly different items, it is fairer to calculate each person\'s subtotal, add their proportional share of the tax, and then add their chosen tip percentage.'
      }
    ],
    relatedSlugs: ['paycheck-calculator', 'sales-tax-calculator', 'discount-calculator']
  },
  // --- SCHOOL ---
  {
    slug: 'gpa-calculator',
    category: 'school',
    name: 'GPA Calculator',
    h1: 'GPA Calculator',
    seoTitle: 'GPA Calculator - Calculate Weighted & Cumulative GPA',
    seoDescription: 'Calculate your high school or college grade point average (GPA). Supports weighted grades (AP/IB/Honors) and cumulative semesters.',
    formulaDescription: 'GPA = Total Grade Points Earned / Total Credit Hours Attempted. Where grade points are derived from letter grades (A = 4.0, B = 3.0, etc.).',
    explainerHtml: `
      <p>A Grade Point Average (GPA) calculator is an essential tool for high school and college students to track their academic standing. Your GPA is a single numerical representation of your overall academic performance across a semester or an entire degree program.</p>
      
      <h3>Unweighted vs. Weighted GPA</h3>
      <p>An unweighted GPA is calculated on a standard 4.0 scale regardless of class difficulty. A weighted GPA gives extra weight to advanced classes like AP (Advanced Placement), IB (International Baccalaureate), or Honors courses, often grading them on a 5.0 scale (A = 5.0, B = 4.0).</p>
      
      <h3>Standard 4.0 Letter Grade Scale</h3>
      <ul>
        <li><strong>A / A+:</strong> 4.0 points</li>
        <li><strong>A-:</strong> 3.7 points</li>
        <li><strong>B+:</strong> 3.3 points</li>
        <li><strong>B:</strong> 3.0 points</li>
        <li><strong>B-:</strong> 2.7 points</li>
        <li><strong>C+:</strong> 2.3 points</li>
        <li><strong>C:</strong> 2.0 points</li>
        <li><strong>D:</strong> 1.0 point</li>
        <li><strong>F:</strong> 0.0 points</li>
      </ul>
    `,
    faqs: [
      {
        question: 'What is a good GPA in high school?',
        answer: 'An unweighted GPA of 3.0 or higher is generally considered good, as it represents a "B" average. For top colleges, a GPA of 3.5 to 4.0 (or higher on a weighted scale) is typically expected.'
      },
      {
        question: 'How do credit hours affect GPA?',
        answer: 'Courses with more credit hours (e.g., a 4-credit science lecture vs. a 1-credit lab) have a greater impact on your GPA. The grade points for a course are multiplied by the credit hours, then divided by the total credit hours.'
      },
      {
        question: 'Can you have a GPA higher than 4.0?',
        answer: 'Yes, if your high school uses a weighted GPA scale, advanced classes (AP/IB/Honors) can yield grade points up to 5.0, pushing your cumulative GPA above a 4.0.'
      }
    ],
    relatedSlugs: ['grade-calculator', 'final-grade-calculator', 'grade-curve-calculator']
  },
  {
    slug: 'grade-calculator',
    category: 'school',
    name: 'Grade Calculator',
    h1: 'Grade Calculator',
    seoTitle: 'Grade Calculator - Weighted Average Grade Tracker',
    seoDescription: 'Calculate your current class grade based on weighted categories (exams, quizzes, homework, participation).',
    formulaDescription: 'Final Grade = Sum of (Category Score * Category Weight) / Sum of Category Weights.',
    explainerHtml: `
      <p>A grade calculator helps students determine their current standing in a class that uses a weighted grading system. Teachers often divide course grades into different categories, such as tests, homework, quizzes, and projects, with each category representing a fixed percentage of the final grade.</p>
      
      <h3>How Weighted Grades Work</h3>
      <p>For example, a syllabus might state: Exams (40%), Homework (25%), Quizzes (20%), and Final Paper (15%). Even if you have a 100% in homework, a poor exam score will have a much larger impact on your final course grade due to the 40% weight.</p>
      
      <h3>Step-by-Step Calculation Example</h3>
      <p>If you have an 85% in Exams (weighted 40%) and a 95% in Homework (weighted 60%):</p>
      <p><code>Grade = (85 * 0.40) + (95 * 0.60) = 34 + 57 = 91% (A-)</code></p>
    `,
    faqs: [
      {
        question: 'What is a weighted grade?',
        answer: 'A weighted grade assigns different levels of importance (weights) to different assignments or categories. High-weight categories, like final exams, affect your overall grade much more than low-weight categories, like daily homework.'
      },
      {
        question: 'How do you calculate a grade if categories don\'t add up to 100%?',
        answer: 'If the active weights do not sum to 100% (for example, the final exam hasn\'t occurred yet), you divide the sum of your weighted scores by the sum of the active weights. Our calculator handles this calculation automatically.'
      }
    ],
    relatedSlugs: ['gpa-calculator', 'final-grade-calculator', 'grade-curve-calculator']
  },
  // --- HEALTH ---
  {
    slug: 'bmi-calculator',
    category: 'health',
    name: 'BMI Calculator',
    h1: 'BMI Calculator',
    seoTitle: 'BMI Calculator - Body Mass Index for Adults & Kids',
    seoDescription: 'Calculate your Body Mass Index (BMI) using metric or imperial units and learn your weight status category.',
    formulaDescription: 'BMI = weight (kg) / height² (m²). In imperial: BMI = 703 * weight (lbs) / height² (inches²).',
    explainerHtml: `
      <p>A Body Mass Index (BMI) calculator estimates a person's body fat based on their height and weight. While it does not measure body fat directly, it is a simple and widely accepted screening tool used by healthcare providers to classify body weight categories.</p>
      
      <h3>Standard BMI Categories for Adults</h3>
      <ul>
        <li><strong>Underweight:</strong> BMI below 18.5</li>
        <li><strong>Normal weight:</strong> BMI between 18.5 and 24.9</li>
        <li><strong>Overweight:</strong> BMI between 25.0 and 29.9</li>
        <li><strong>Obese:</strong> BMI of 30.0 or higher</li>
      </ul>
      
      <h3>Limitations of BMI</h3>
      <p>BMI is a general estimate and does not take muscle mass, bone density, or body composition into account. For instance, athletes and bodybuilders with high muscle mass may have a high BMI that classifies them as "overweight" or "obese" despite having very low body fat.</p>
    `,
    faqs: [
      {
        question: 'What is a healthy BMI range?',
        answer: 'For most adults, a healthy BMI range is between 18.5 and 24.9. BMIs below 18.5 indicate underweight, and BMIs above 25.0 indicate overweight.'
      },
      {
        question: 'Does BMI apply to kids and teenagers?',
        answer: 'While the same basic formula is used, children\'s BMI is evaluated using percentiles relative to other children of the same age and biological sex, as body fat composition changes rapidly during growth.'
      },
      {
        question: 'Is BMI accurate for active athletes?',
        answer: 'No. Muscle is denser than fat, so muscular individuals often have high BMIs despite having low body fat percentages. For athletes, body fat percentage or waist circumference are better health markers.'
      }
    ],
    relatedSlugs: ['calorie-calculator', 'body-fat-calculator', 'water-intake-calculator']
  },
  {
    slug: 'calorie-calculator',
    category: 'health',
    name: 'Calorie Calculator (TDEE)',
    h1: 'Calorie Calculator (TDEE)',
    seoTitle: 'Calorie Calculator - Calculate Daily TDEE & Goals',
    seoDescription: 'Find your Total Daily Energy Expenditure (TDEE) and calculate calories needed for weight loss, maintenance, or gain.',
    formulaDescription: 'BMR calculated via Mifflin-St Jeor equation, then multiplied by an activity multiplier (1.2 to 1.9) to find TDEE.',
    explainerHtml: `
      <p>A calorie calculator helps you determine your Total Daily Energy Expenditure (TDEE) — the total number of calories your body burns in a day. Knowing your TDEE is the starting point for any nutrition plan, whether you want to lose weight, maintain weight, or build muscle.</p>
      
      <h3>Basal Metabolic Rate (BMR) vs. TDEE</h3>
      <p>Your BMR is the number of calories your body burns at complete rest just to keep you alive (breathing, pumping blood, cell production). TDEE takes your BMR and adds the energy burned through daily activity and exercise.</p>
      
      <h3>Mifflin-St Jeor Equations</h3>
      <ul>
        <li><strong>Men:</strong> BMR = 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y) + 5</li>
        <li><strong>Women:</strong> BMR = 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y) - 161</li>
      </ul>
    `,
    faqs: [
      {
        question: 'How many calories should I eat to lose weight?',
        answer: 'To lose weight, you generally need to create a caloric deficit. Consuming 500 calories below your TDEE daily typically results in about 1 pound of fat loss per week.'
      },
      {
        question: 'What is TDEE?',
        answer: 'TDEE stands for Total Daily Energy Expenditure. It represents the total number of calories you burn per day based on your BMR and activity level (sedentary, light, moderate, heavy, or athlete).'
      }
    ],
    relatedSlugs: ['bmi-calculator', 'body-fat-calculator', 'water-intake-calculator']
  },
  // --- EVERYDAY ---
  {
    slug: 'age-calculator',
    category: 'everyday',
    name: 'Age Calculator',
    h1: 'Age Calculator',
    seoTitle: 'Age Calculator - Calculate Exact Age Online',
    seoDescription: 'Determine your exact age in years, months, weeks, days, hours, and minutes from your birthdate.',
    formulaDescription: 'Difference in calendar dates, adjusting for leap years and variable month lengths.',
    explainerHtml: `
      <p>An age calculator computes your exact age or the time elapsed between two specific dates. It provides a detailed breakdown of your age in years, months, days, weeks, and even down to the seconds, which is much more precise than just subtracting the birth year.</p>
      
      <h3>Adjusting for Leap Years</h3>
      <p>Our age calculator automatically accounts for leap years (which occur every four years and add an extra day, February 29th) as well as the varying lengths of the months (28, 30, or 31 days) to give you an exact calculation.</p>
    `,
    faqs: [
      {
        question: 'How is exact age in months and days calculated?',
        answer: 'We calculate the difference between the target date and the birthdate. If the target day of the month is less than the birth day of the month, we back out one month and add the number of days in the previous month to get the exact day difference.'
      },
      {
        question: 'How many leap years have I lived through?',
        answer: 'Since leap years occur every year divisible by 4 (except century years not divisible by 400), you will have lived through approximately one leap year for every four years of life. Our calculator counts the exact number for you.'
      }
    ],
    relatedSlugs: ['date-difference-calculator', 'percentage-calculator', 'discount-calculator']
  },
  {
    slug: 'percentage-calculator',
    category: 'everyday',
    name: 'Percentage Calculator',
    h1: 'Percentage Calculator',
    seoTitle: 'Percentage Calculator - Find Percentage Differences & Values',
    seoDescription: 'Solve percentage problems, including percentage of a value, percentage increase/decrease, and proportion calculations.',
    formulaDescription: 'Percentage = (Part / Whole) * 100. Percentage Increase = ((New Value - Original Value) / Original Value) * 100.',
    explainerHtml: `
      <p>A percentage calculator solves everyday math problems involving percentages. Percentages are fractions with a denominator of 100, which are used to describe parts of a whole, growth rates, discounts, taxes, and financial returns.</p>
      
      <h3>Common Percentage Formulas</h3>
      <ul>
        <li><strong>What is X% of Y?</strong> Formula: <code>Value = (X / 100) * Y</code></li>
        <li><strong>X is what percent of Y?</strong> Formula: <code>Percentage = (X / Y) * 100</code></li>
        <li><strong>Percentage change from X to Y:</strong> Formula: <code>((Y - X) / X) * 100</code></li>
      </ul>
    `,
    faqs: [
      {
        question: 'How do you calculate percentage increase?',
        answer: 'Subtract the original value from the new value, divide the result by the original value, and multiply by 100. For example, if a price goes from $20 to $25, the increase is ((25 - 20) / 20) * 100 = 25%.'
      },
      {
        question: 'How do you find what percent a number is of another?',
        answer: 'Divide the part by the whole and multiply by 100. For example, to find what percent 15 is of 60, calculate (15 / 60) * 100 = 25%.'
      }
    ],
    relatedSlugs: ['discount-calculator', 'sales-tax-calculator', 'tip-calculator']
  },
  {
    slug: 'discount-calculator',
    category: 'everyday',
    name: 'Discount / Sale Price Calculator',
    h1: 'Discount & Sale Calculator',
    seoTitle: 'Discount Calculator - Find Sale Price & Savings',
    seoDescription: 'Calculate the final sale price, total savings, and original price of discounted items during shopping.',
    formulaDescription: 'Sale Price = Original Price * (1 - Discount Percentage / 100). Savings = Original Price - Sale Price.',
    explainerHtml: `
      <p>A discount calculator helps shoppers quickly find out how much they will save on a sale item and what the final price will be after any percentage discount is applied. It is also useful for comparing deals and backing out original prices.</p>
      
      <h3>Double Discounts (Stacking Coupons)</h3>
      <p>When stacking a sale price with an additional coupon (e.g., 20% off an item already marked 30% off), the discounts are typically applied sequentially, not added together. A 30% off discount followed by a 20% off coupon results in an overall discount of 44%, not 50%.</p>
    `,
    faqs: [
      {
        question: 'How do you calculate a 20% discount?',
        answer: 'Multiply the original price by 0.20 to find the savings amount, then subtract that from the original price. Alternatively, multiply the original price by 0.80 to get the final sale price directly.'
      },
      {
        question: 'How do you calculate stacked discounts?',
        answer: 'Apply the first discount percentage to the original price to get an intermediate price, then apply the second discount percentage to that intermediate price. The final price is not the sum of the two percentages.'
      }
    ],
    relatedSlugs: ['percentage-calculator', 'sales-tax-calculator', 'tip-calculator']
  },
  // --- INACTIVE / COMING SOON ---
  {
    slug: 'auto-loan-calculator',
    category: 'finance',
    name: 'Auto Loan Calculator',
    h1: 'Auto Loan Calculator',
    seoTitle: 'Auto Loan Calculator - Estimate Monthly Car Payments',
    seoDescription: 'Calculate monthly car payments, interest costs, and amortization schedules for new or used auto loans.',
    formulaDescription: 'Standard auto loan payment formula using interest rate, down payment, trade-in, and loan term.',
    explainerHtml: '<p>Calculate your monthly car loan payment and total interest cost based on purchase price, down payment, trade-in, and interest rate.</p>',
    faqs: [],
    relatedSlugs: ['mortgage-calculator', 'personal-loan-calculator']
  },
  {
    slug: 'personal-loan-calculator',
    category: 'finance',
    name: 'Personal Loan Calculator',
    h1: 'Personal Loan Calculator',
    seoTitle: 'Personal Loan Calculator - Monthly Payments & Interest',
    seoDescription: 'Find your monthly personal loan payments and see a full interest payoff schedule.',
    formulaDescription: 'Standard loan calculation formula based on interest rate and loan term.',
    explainerHtml: '<p>Calculate monthly payments for unsecured or secured personal loans and view amortization schedules.</p>',
    faqs: [],
    relatedSlugs: ['mortgage-calculator', 'auto-loan-calculator']
  },
  {
    slug: 'sales-tax-calculator',
    category: 'finance',
    name: 'Sales Tax Calculator',
    h1: 'Sales Tax Calculator',
    seoTitle: 'Sales Tax Calculator - Add or Remove Sales Tax',
    seoDescription: 'Calculate sales tax added to a purchase or reverse-calculate the sales tax to find the pre-tax item price.',
    formulaDescription: 'Sales Tax = Price * (Tax Rate / 100). Pre-Tax Price = Post-Tax Price / (1 + Tax Rate / 100).',
    explainerHtml: '<p>Calculate sales tax and reverse sales tax to find pre-tax subtotals.</p>',
    faqs: [],
    relatedSlugs: ['percentage-calculator', 'discount-calculator', 'tip-calculator']
  },
  {
    slug: 'compound-interest-calculator',
    category: 'finance',
    name: 'Compound Interest Calculator',
    h1: 'Compound Interest Calculator',
    seoTitle: 'Compound Interest Calculator - Future Value of Savings',
    seoDescription: 'See how your savings grow over time with compound interest. Supports monthly/annual deposits and compounding frequencies.',
    formulaDescription: 'A = P(1 + r/n)^(nt) where A is future value, P is principal, r is annual rate, n is compounding frequency, t is time.',
    explainerHtml: '<p>Calculate the growth of your investments over time using compound interest with regular contributions.</p>',
    faqs: [],
    relatedSlugs: ['retirement-calculator', 'paycheck-calculator', 'mortgage-calculator']
  },
  {
    slug: 'retirement-calculator',
    category: 'finance',
    name: '401(k) / Retirement Savings Calculator',
    h1: '401(k) Retirement Calculator',
    seoTitle: '401(k) Calculator - Estimate Your Retirement Savings',
    seoDescription: 'Project your future 401(k) retirement balance based on annual salary, employer matching, and growth rates.',
    formulaDescription: 'Retirement projection using annual contribution, salary growth, matching formulas, and investment return.',
    explainerHtml: '<p>Estimate your future 401(k) balance at retirement and see the effect of employer matching.</p>',
    faqs: [],
    relatedSlugs: ['compound-interest-calculator', 'paycheck-calculator']
  },
  {
    slug: 'debt-payoff-calculator',
    category: 'finance',
    name: 'Debt Payoff Calculator',
    h1: 'Debt Payoff Calculator',
    seoTitle: 'Debt Payoff Calculator - Snowball vs. Avalanche Methods',
    seoDescription: 'Plan your debt-free timeline using the popular snowball or avalanche debt payoff strategies.',
    formulaDescription: 'Computes payoff timelines by ranking debts by interest rate (avalanche) or balance size (snowball).',
    explainerHtml: '<p>Compare the debt snowball and debt avalanche methods to see when you will be debt-free.</p>',
    faqs: [],
    relatedSlugs: ['credit-card-calculator', 'personal-loan-calculator']
  },
  {
    slug: 'credit-card-calculator',
    category: 'finance',
    name: 'Credit Card Interest Calculator',
    h1: 'Credit Card Payoff Calculator',
    seoTitle: 'Credit Card Interest Calculator - Monthly Payments & Savings',
    seoDescription: 'Find out how long it will take to pay off your credit card balance and how much interest you will accrue.',
    formulaDescription: 'Daily compound interest calculation based on APR and monthly payment size.',
    explainerHtml: '<p>Determine how monthly payments affect your credit card interest and payoff timeline.</p>',
    faqs: [],
    relatedSlugs: ['debt-payoff-calculator', 'personal-loan-calculator']
  },
  {
    slug: 'calorie-loss-calculator',
    category: 'health',
    name: 'Weight Loss Goal Calculator',
    h1: 'Weight Loss Goal Calculator',
    seoTitle: 'Weight Loss Goal Calculator - Hit Your Target Date',
    seoDescription: 'Find the daily calorie deficit required to reach your target weight by a specific date.',
    formulaDescription: 'Target Deficit = (Weight to Lose * 3500) / Days until Target Date. Daily calories = TDEE - Target Deficit.',
    explainerHtml: '<p>Calculate daily calorie goals to lose weight and meet a specific target date safely.</p>',
    faqs: [],
    relatedSlugs: ['calorie-calculator', 'bmi-calculator']
  },
  {
    slug: 'pregnancy-due-date',
    category: 'health',
    name: 'Pregnancy Due Date Calculator',
    h1: 'Pregnancy Due Date Calculator',
    seoTitle: 'Pregnancy Due Date Calculator - Conception & Milestones',
    seoDescription: 'Calculate your estimated due date, conception date, and current gestational week/milestones.',
    formulaDescription: 'Due Date = First Day of Last Menstrual Period (LMP) + 280 days (Naegele\'s Rule).',
    explainerHtml: '<p>Determine your pregnancy due date, estimated conception date, and track gestational progress.</p>',
    faqs: [],
    relatedSlugs: ['bmi-calculator', 'water-intake-calculator']
  },
  {
    slug: 'body-fat-calculator',
    category: 'health',
    name: 'Body Fat Percentage Calculator',
    h1: 'Body Fat Calculator',
    seoTitle: 'Body Fat Percentage Calculator - Navy Method',
    seoDescription: 'Estimate your body fat percentage using the US Navy body circumference method.',
    formulaDescription: 'Navy Body Fat formula using height, neck, waist, and hip circumferences.',
    explainerHtml: '<p>Estimate your body fat percentage using standard body measurement guidelines.</p>',
    faqs: [],
    relatedSlugs: ['bmi-calculator', 'calorie-calculator']
  },
  {
    slug: 'water-intake-calculator',
    category: 'health',
    name: 'Water Intake Calculator',
    h1: 'Water Intake Calculator',
    seoTitle: 'Water Intake Calculator - Daily Hydration Target',
    seoDescription: 'Calculate how much water you should drink daily based on your body weight and exercise activity.',
    formulaDescription: 'Hydration goal = weight (lbs) * 0.5 + activity adjustment (12oz per 30 mins of exercise).',
    explainerHtml: '<p>Find your recommended daily water consumption target based on weight and activity levels.</p>',
    faqs: [],
    relatedSlugs: ['bmi-calculator', 'calorie-calculator']
  },
  {
    slug: 'final-grade-calculator',
    category: 'school',
    name: 'Final Exam Grade Calculator',
    h1: 'Final Grade Calculator',
    seoTitle: 'Final Exam Grade Needed Calculator - Hit Your Target Grade',
    seoDescription: 'Find out what grade you need on your final exam to achieve a target overall grade in your class.',
    formulaDescription: 'Final Exam Grade = [Target Grade - Current Grade * (1 - Exam Weight)] / Exam Weight.',
    explainerHtml: '<p>Determine the score you need on your final exam to maintain or achieve your target class grade.</p>',
    faqs: [],
    relatedSlugs: ['grade-calculator', 'gpa-calculator']
  },
  {
    slug: 'grade-curve-calculator',
    category: 'school',
    name: 'Grade Curve Calculator',
    h1: 'Grade Curve Calculator',
    seoTitle: 'Grade Curve Calculator - Curve Test Scores Fast',
    seoDescription: 'Curve test grades and exam scores using common curving methods (Flat Scale, Linear, Root, or Bell Curve).',
    formulaDescription: 'Root Curve: Curved Grade = Sqrt(Original Grade) * 10. Flat Curve: Curved Grade = Original Grade + Flat Amount.',
    explainerHtml: '<p>Curving grades for teachers and students using standard curving algorithms.</p>',
    faqs: [],
    relatedSlugs: ['grade-calculator', 'gpa-calculator']
  },
  {
    slug: 'date-difference-calculator',
    category: 'everyday',
    name: 'Date Difference Calculator',
    h1: 'Date Difference Calculator',
    seoTitle: 'Date Difference Calculator - Days Between Dates',
    seoDescription: 'Calculate the total number of days, weeks, months, or years between two dates.',
    formulaDescription: 'Calendar difference between two dates, taking time zones and leap years into account.',
    explainerHtml: '<p>Find the exact number of days, weeks, months, or years between any two dates.</p>',
    faqs: [],
    relatedSlugs: ['age-calculator', 'time-zone-calculator']
  },
  {
    slug: 'unit-converter',
    category: 'everyday',
    name: 'Unit Conversion Calculator',
    h1: 'Unit Converter',
    seoTitle: 'Unit Conversion Calculator - Length, Weight & Temp',
    seoDescription: 'Convert between imperial and metric units for length, weight, area, volume, and temperature.',
    formulaDescription: 'Standard conversion formulas (e.g. °F = °C * 9/5 + 32, 1 inch = 2.54 cm).',
    explainerHtml: '<p>Quickly convert values between imperial and metric systems for temperature, weight, distance, and more.</p>',
    faqs: [],
    relatedSlugs: ['percentage-calculator', 'date-difference-calculator']
  },
  {
    slug: 'time-zone-calculator',
    category: 'everyday',
    name: 'Time Zone Calculator',
    h1: 'Time Zone Converter & Calculator',
    seoTitle: 'Time Zone Calculator - Convert Times Worldwide',
    seoDescription: 'Convert times between different global time zones and plan virtual meetings easily.',
    formulaDescription: 'Local offset subtraction and addition using global UTC standards.',
    explainerHtml: '<p>Find equivalent times across different international time zones and plan meetings.</p>',
    faqs: [],
    relatedSlugs: ['date-difference-calculator', 'age-calculator']
  }
];
