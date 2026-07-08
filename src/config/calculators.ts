export interface CalculatorDef {
  slug: string;
  category: 'finance' | 'health' | 'school' | 'everyday' | 'conversion';
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
  conversion: {
    name: 'Conversion',
    description: 'Convert length, weight, temperature, volume, and more between units instantly.',
    color: 'teal',
    iconName: 'ArrowLeftRight',
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
    formulaDescription: 'GPA = Sum(Grade Points x Credit Hours) / Total Credit Hours. Grade points use the standard 4.0 scale (A = 4.0, A- = 3.7, B+ = 3.3, ... F = 0.0). Weighted GPA adds +0.5 per course for Honors and +1.0 for AP/IB before averaging.',
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
    formulaDescription: 'Monthly compound interest simulation: each month adds Balance * (APR / 12) in interest, then subtracts your fixed payment or the minimum payment (greater of 3% of balance or $25).',
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
    slug: 'bmr-calculator',
    category: 'health',
    name: 'BMR Calculator',
    h1: 'BMR Calculator (Basal Metabolic Rate)',
    seoTitle: 'BMR Calculator - Basal Metabolic Rate Estimator',
    seoDescription: 'Calculate your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation to find how many calories your body burns at rest.',
    formulaDescription: 'Men: BMR = 10 x weight(kg) + 6.25 x height(cm) - 5 x age + 5. Women: BMR = 10 x weight(kg) + 6.25 x height(cm) - 5 x age - 161.',
    explainerHtml: `
      <p>Your Basal Metabolic Rate (BMR) is the number of calories your body needs to maintain basic life functions - breathing, circulation, and cell production - while completely at rest. It does not include any calories burned through movement or digestion.</p>
      <h3>The Mifflin-St Jeor Equation</h3>
      <p>This calculator uses the Mifflin-St Jeor equation, widely considered the most accurate BMR formula for most adults. It factors in weight, height, age, and biological sex.</p>
      <h3>BMR vs. TDEE</h3>
      <p>BMR only measures calories burned at complete rest. Total Daily Energy Expenditure (TDEE) multiplies BMR by an activity factor to estimate your true daily calorie needs for weight maintenance, loss, or gain.</p>
    `,
    faqs: [
      { question: 'What is the difference between BMR and TDEE?', answer: 'BMR is the calories your body burns at total rest. TDEE adds in calories burned through daily activity and exercise, and is the number most people should use for calorie planning.' },
      { question: 'Which BMR formula is most accurate?', answer: 'The Mifflin-St Jeor equation, used here, is generally considered more accurate than the older Harris-Benedict formula for most modern populations.' },
      { question: 'Can I use my BMR to lose weight?', answer: 'BMR alone is not enough for weight loss planning. Use it as an input to a TDEE calculation, then create a moderate calorie deficit from your TDEE.' }
    ],
    relatedSlugs: ['calorie-calculator', 'ideal-weight-calculator', 'bmi-calculator']
  },
  {
    slug: 'ideal-weight-calculator',
    category: 'health',
    name: 'Ideal Weight Calculator',
    h1: 'Ideal Weight Calculator',
    seoTitle: 'Ideal Weight Calculator - Devine & Robinson Formulas',
    seoDescription: 'Estimate your ideal body weight based on height and sex using the Devine and Robinson clinical formulas.',
    formulaDescription: 'Devine (Men): 50kg + 2.3kg per inch over 5ft. Devine (Women): 45.5kg + 2.3kg per inch over 5ft.',
    explainerHtml: `
      <p>Ideal body weight (IBW) formulas were originally developed for clinical drug dosing, but are commonly used as a general reference point for a healthy weight range based on height.</p>
      <h3>Devine Formula</h3>
      <p>The most widely used clinical formula, developed in 1974 and still used today to estimate medication dosages based on lean body mass.</p>
      <h3>Robinson Formula</h3>
      <p>A 1983 refinement of the Devine formula shown here as a second reference point, since no single formula perfectly fits every body type.</p>
    `,
    faqs: [
      { question: 'Are ideal weight formulas accurate for everyone?', answer: 'No. These formulas were designed for general clinical reference and do not account for muscle mass, bone density, or frame size, so athletes and very muscular individuals may fall well outside the estimated range while still being healthy.' },
      { question: 'Why do the Devine and Robinson formulas give different results?', answer: 'They were derived from different population studies. Robinson generally produces a slightly higher estimate than Devine, so use the range between them as a rough guide rather than a precise target.' },
      { question: 'Should I try to hit my exact ideal weight?', answer: 'Not necessarily. These are population averages. A healthier approach is to consider body composition, waist-to-hip ratio, and how you feel rather than chasing one precise number.' }
    ],
    relatedSlugs: ['bmi-calculator', 'body-frame-size-calculator', 'waist-hip-ratio-calculator']
  },
  {
    slug: 'body-frame-size-calculator',
    category: 'health',
    name: 'Body Frame Size Calculator',
    h1: 'Body Frame Size Calculator',
    seoTitle: 'Body Frame Size Calculator - Small, Medium, or Large Frame',
    seoDescription: 'Determine whether you have a small, medium, or large body frame using the height-to-wrist-circumference ratio method.',
    formulaDescription: 'Frame Ratio = Height (in) / Wrist Circumference (in), classified against standard male/female thresholds.',
    explainerHtml: `
      <p>Body frame size is a rough proxy for bone structure, and is often used alongside ideal weight formulas since a "healthy weight" varies by frame size - a large-framed person naturally carries more bone and muscle mass than a small-framed person of the same height.</p>
      <h3>Wrist Circumference Method</h3>
      <p>This calculator uses the height-to-wrist-circumference ratio, one of the most common non-clinical methods for estimating frame size, since wrist bone size correlates loosely with overall skeletal size.</p>
    `,
    faqs: [
      { question: 'How do I measure my wrist circumference?', answer: 'Wrap a flexible tape measure snugly around your wrist, just below the wrist bone (where a watch would sit), and record the measurement in inches or centimeters.' },
      { question: 'Why does frame size matter for weight goals?', answer: 'Ideal weight charts and BMI both assume an average frame. A large-framed person may healthily weigh more than a small-framed person of the same height without carrying more body fat.' },
      { question: 'Is this an exact measurement?', answer: 'No, it is only a rough estimate based on bone structure proxies. It does not account for individual variation and should not replace a clinical body composition assessment.' }
    ],
    relatedSlugs: ['ideal-weight-calculator', 'bmi-calculator', 'waist-hip-ratio-calculator']
  },
  {
    slug: 'waist-hip-ratio-calculator',
    category: 'health',
    name: 'Waist-to-Hip Ratio Calculator',
    h1: 'Waist-to-Hip Ratio Calculator',
    seoTitle: 'Waist-to-Hip Ratio Calculator - WHO Risk Category',
    seoDescription: 'Calculate your waist-to-hip ratio (WHR) and see your World Health Organization cardiovascular risk category.',
    formulaDescription: 'WHR = Waist Circumference / Hip Circumference.',
    explainerHtml: `
      <p>Waist-to-hip ratio (WHR) compares the circumference of your waist to your hips, and is used by the World Health Organization as an indicator of abdominal fat distribution and associated cardiovascular risk.</p>
      <h3>Why Fat Distribution Matters</h3>
      <p>Fat stored around the abdomen (an "apple" shape) is more strongly linked to cardiovascular and metabolic risk than fat stored around the hips and thighs (a "pear" shape), even at the same overall body weight.</p>
      <h3>WHO Risk Thresholds</h3>
      <p>The World Health Organization classifies risk differently for men and women, since healthy fat distribution differs by sex.</p>
    `,
    faqs: [
      { question: 'How do I measure my waist and hips correctly?', answer: 'Measure your waist at the narrowest point, usually just above the belly button, and your hips at the widest point around your buttocks. Keep the tape measure snug but not compressing the skin.' },
      { question: 'What is a healthy waist-to-hip ratio?', answer: 'The WHO considers a WHR below 0.90 for men and below 0.80 for women to be low risk. Higher ratios indicate more abdominal fat and higher associated cardiovascular risk.' },
      { question: 'Is WHR better than BMI?', answer: 'WHR captures fat distribution, which BMI does not. Many researchers consider WHR a better predictor of cardiovascular risk than BMI alone, though using both together gives a fuller picture.' }
    ],
    relatedSlugs: ['bmi-calculator', 'body-fat-calculator', 'ideal-weight-calculator']
  },
  {
    slug: 'heart-rate-zone-calculator',
    category: 'health',
    name: 'Heart Rate Zone Calculator',
    h1: 'Heart Rate Zone Calculator',
    seoTitle: 'Heart Rate Zone Calculator - Target HR Training Zones',
    seoDescription: 'Find your target heart rate training zones for warm-up, fat burn, cardio, and max-effort workouts based on your age.',
    formulaDescription: 'Max Heart Rate = 220 - Age. Zones are calculated as percentage ranges of max heart rate.',
    explainerHtml: `
      <p>Training in specific heart rate zones helps you target different fitness goals, from easy recovery workouts to maximum-effort intervals. This calculator estimates your maximum heart rate and breaks it into five common training zones.</p>
      <h3>The Five Heart Rate Zones</h3>
      <ul>
        <li><strong>Zone 1 (50-60%):</strong> Very light activity, warm-up and recovery.</li>
        <li><strong>Zone 2 (60-70%):</strong> Light aerobic activity, primary fat-burning zone.</li>
        <li><strong>Zone 3 (70-80%):</strong> Moderate cardio, improves aerobic fitness.</li>
        <li><strong>Zone 4 (80-90%):</strong> Hard effort, improves speed and performance.</li>
        <li><strong>Zone 5 (90-100%):</strong> Maximum effort, short bursts only.</li>
      </ul>
    `,
    faqs: [
      { question: 'How accurate is the 220 minus age formula?', answer: 'It is a widely used population-average estimate, but individual maximum heart rate can vary by 10-20 beats per minute. A supervised fitness test gives a more precise number if you need one.' },
      { question: 'Which zone should I train in to lose weight?', answer: 'Zone 2 is often called the "fat-burning zone" because a higher percentage of calories burned come from fat, but total calories burned matters more for weight loss than which zone you train in.' },
      { question: 'Is it safe to train in Zone 5?', answer: 'Zone 5 is very demanding and generally recommended only in short intervals for people who are already fit. Consult a doctor before starting high-intensity training if you have any cardiovascular concerns.' }
    ],
    relatedSlugs: ['bmr-calculator', 'calorie-calculator', 'bmi-calculator']
  },
  {
    slug: 'ovulation-calculator',
    category: 'health',
    name: 'Ovulation Calculator',
    h1: 'Ovulation & Fertility Window Calculator',
    seoTitle: 'Ovulation Calculator - Fertility Window Estimator',
    seoDescription: 'Estimate your ovulation date and fertile window based on the first day of your last period and average cycle length.',
    formulaDescription: 'Ovulation date = Next period date - 14 days. Fertile window = 5 days before ovulation through ovulation day.',
    explainerHtml: `
      <p>This calculator estimates your ovulation date and fertile window using the standard luteal-phase method, where ovulation typically occurs about 14 days before your next period begins.</p>
      <h3>Understanding Your Fertile Window</h3>
      <p>Sperm can survive in the reproductive tract for up to 5 days, while an egg is typically viable for only 12-24 hours after ovulation. This creates a fertile window of about 6 days, ending on ovulation day.</p>
    `,
    faqs: [
      { question: 'How accurate is this ovulation estimate?', answer: 'It is based on average cycle statistics and works best for people with regular, predictable cycles. Actual ovulation timing can vary due to stress, illness, and other factors, so ovulation predictor kits or tracking basal body temperature give more precise results.' },
      { question: 'What if my cycle length varies month to month?', answer: 'Use your average cycle length over the past several months for the best estimate, and consider tracking symptoms like cervical mucus changes or basal body temperature for more accuracy.' },
      { question: 'Can I use this to avoid pregnancy?', answer: 'This calculator is intended for general fertility awareness and is not a reliable form of contraception. Consult a healthcare provider about effective birth control methods.' }
    ],
    relatedSlugs: ['menstrual-cycle-calculator', 'conception-date-calculator', 'pregnancy-due-date']
  },
  {
    slug: 'conception-date-calculator',
    category: 'health',
    name: 'Conception Date Calculator',
    h1: 'Conception Date Calculator',
    seoTitle: 'Conception Date Calculator - Estimate When You Conceived',
    seoDescription: 'Estimate your approximate conception date based on your last menstrual period or your estimated due date.',
    formulaDescription: 'From LMP: Conception date = Last period start date + 14 days. From due date: Conception date = Due date - 266 days.',
    explainerHtml: `
      <p>This calculator provides a rough estimate of when conception likely occurred, using either the first day of your last menstrual period (LMP) or your estimated due date as a starting point.</p>
      <h3>Why This Is an Estimate</h3>
      <p>Conception typically occurs around ovulation, roughly 14 days after the start of a period in an average 28-day cycle. Since actual ovulation timing varies by individual and cycle length, the true conception date can differ from this estimate by several days.</p>
    `,
    faqs: [
      { question: 'How is conception date different from due date?', answer: 'Due dates are typically calculated as 280 days (40 weeks) from the last menstrual period, while conception usually occurs about 2 weeks into that cycle, roughly 266 days before the due date.' },
      { question: 'Can this tell me the exact date I conceived?', answer: 'No. This is a statistical estimate based on average cycle timing. Only a fertility specialist tracking ovulation directly, such as through an IVF cycle, can pinpoint an exact conception date.' },
      { question: 'What if I have an irregular cycle?', answer: 'Irregular cycles make this estimate less reliable, since ovulation timing is harder to predict. An early ultrasound during pregnancy can give a more accurate gestational age estimate.' }
    ],
    relatedSlugs: ['pregnancy-due-date', 'ovulation-calculator', 'pregnancy-weight-gain-calculator']
  },
  {
    slug: 'child-growth-percentile-calculator',
    category: 'health',
    name: 'Child Growth Percentile Calculator',
    h1: 'Child Growth Percentile Calculator',
    seoTitle: 'Child Growth Calculator - Height & Weight Estimate by Age',
    seoDescription: 'Get a simplified estimate of whether your child\'s height and weight fall below, at, or above the typical average for their age.',
    formulaDescription: 'Compares child height/weight against simplified average-by-age reference bands (not clinical percentile curves).',
    explainerHtml: `
      <p>This tool gives a simplified, approximate comparison of your child's height and weight against typical average values for their age. It is designed as a quick, general reference only.</p>
      <h3>Not a Clinical Growth Chart</h3>
      <p>Pediatricians use detailed CDC or WHO growth percentile charts, which track a child's growth trajectory over time relative to thousands of data points. This calculator uses a simplified banding approach (below average, average, above average) and cannot replace those clinical tools.</p>
    `,
    faqs: [
      { question: 'Is this the same as the percentile chart my pediatrician uses?', answer: 'No. This is a simplified estimate for general reference only. Your pediatrician\'s growth chart tracks your child\'s specific growth trajectory over time using clinical CDC or WHO percentile data, which is far more precise.' },
      { question: 'My child is "below average" - should I be worried?', answer: 'Not necessarily. Height and weight vary widely between healthy children. A single measurement matters less than a consistent growth trend over time, which only your pediatrician can properly assess.' },
      { question: 'Does this account for premature birth?', answer: 'No, this simplified tool does not adjust for gestational age. Premature babies are typically measured against adjusted-age growth charts by their pediatrician.' }
    ],
    relatedSlugs: ['baby-weight-gain-calculator', 'bmi-calculator', 'pregnancy-due-date']
  },
  {
    slug: 'baby-weight-gain-calculator',
    category: 'health',
    name: 'Baby Weight Gain Calculator',
    h1: 'Baby Weight Gain Tracker',
    seoTitle: 'Baby Weight Gain Calculator - Newborn Growth Tracker',
    seoDescription: 'Track how much weight your newborn has gained since birth and compare it to typical newborn weight gain rates.',
    formulaDescription: 'Weight Gained = Current Weight - Birth Weight. Average Gain per Week = Weight Gained / Weeks Since Birth.',
    explainerHtml: `
      <p>Newborns typically lose a small amount of weight in their first days, then gain steadily. This calculator tracks total weight gained since birth and compares your baby's average weekly gain to a typical benchmark.</p>
      <h3>Typical Newborn Weight Gain</h3>
      <p>In the first few months, healthy newborns typically gain about 5 to 7 ounces (roughly 150 to 200 grams) per week, though this varies by feeding method, birth weight, and individual growth patterns.</p>
    `,
    faqs: [
      { question: 'Is it normal for a newborn to lose weight at first?', answer: 'Yes. Most newborns lose 5-10% of their birth weight in the first few days, then typically regain it by about two weeks of age. This calculator is most useful once your baby is past that initial regain period.' },
      { question: 'What if my baby\'s weight gain is below the typical range?', answer: 'Slower weight gain can be normal for some babies, but it can also signal a feeding issue. Contact your pediatrician if your baby is consistently gaining below the typical range.' },
      { question: 'Does feeding method affect weight gain rate?', answer: 'Yes, formula-fed and breastfed babies can have slightly different typical growth patterns, especially after the first few months. Your pediatrician can advise on what is normal for your baby.' }
    ],
    relatedSlugs: ['child-growth-percentile-calculator', 'pregnancy-due-date', 'pregnancy-weight-gain-calculator']
  },
  {
    slug: 'menstrual-cycle-calculator',
    category: 'health',
    name: 'Menstrual Cycle Calculator',
    h1: 'Menstrual Cycle Calculator',
    seoTitle: 'Period Calculator - Predict Your Next 3 Menstrual Cycles',
    seoDescription: 'Predict your next three period start dates and fertile windows based on your last period and average cycle length.',
    formulaDescription: 'Next Period = Last Period Start + (Cycle Length x N). Ovulation Window = Period Start - 14 days, minus a 5-day fertile window.',
    explainerHtml: `
      <p>This calculator predicts your next three menstrual cycles based on the first day of your last period and your average cycle length, giving you both period start dates and estimated fertile windows for planning.</p>
      <h3>How Cycle Prediction Works</h3>
      <p>Menstrual cycles are counted from the first day of one period to the first day of the next. By projecting forward using your average cycle length, this tool estimates your next few period dates.</p>
    `,
    faqs: [
      { question: 'How far in advance can I predict my period?', answer: 'This calculator projects three cycles ahead, but accuracy decreases the further out you go, especially if your cycle length varies naturally month to month.' },
      { question: 'What is a normal cycle length?', answer: 'A normal menstrual cycle typically ranges from 21 to 35 days, with 28 days being the commonly cited average. Consistently tracking your own cycles gives the most accurate personal average.' },
      { question: 'Why do my predictions seem off some months?', answer: 'Stress, illness, travel, and hormonal changes can all shift ovulation and period timing. This tool provides a statistical estimate, not a guarantee.' }
    ],
    relatedSlugs: ['ovulation-calculator', 'conception-date-calculator', 'pregnancy-due-date']
  },
  {
    slug: 'pregnancy-weight-gain-calculator',
    category: 'health',
    name: 'Pregnancy Weight Gain Calculator',
    h1: 'Pregnancy Weight Gain Calculator',
    seoTitle: 'Pregnancy Weight Gain Calculator - IOM Recommended Ranges',
    seoDescription: 'Find your recommended total pregnancy weight gain range based on your pre-pregnancy BMI, using Institute of Medicine guidelines.',
    formulaDescription: 'Recommended total gain by pre-pregnancy BMI category (IOM guidelines): Underweight 28-40 lbs, Normal 25-35 lbs, Overweight 15-25 lbs, Obese 11-20 lbs.',
    explainerHtml: `
      <p>The Institute of Medicine (IOM) publishes recommended total pregnancy weight gain ranges based on a person's BMI before pregnancy, since a healthy amount of weight gain differs depending on starting weight.</p>
      <h3>Why Pre-Pregnancy BMI Matters</h3>
      <p>Someone who starts pregnancy underweight is generally advised to gain more than someone who starts overweight, to support healthy fetal development while managing maternal health risks.</p>
    `,
    faqs: [
      { question: 'Does this apply to twin pregnancies?', answer: 'No, these ranges are for singleton pregnancies. Recommended weight gain for twin or multiple pregnancies is higher and should be discussed with your OB-GYN.' },
      { question: 'What if I am gaining faster or slower than recommended?', answer: 'Some variation is normal, especially early or late in pregnancy. Consistently gaining well above or below the recommended range is worth discussing with your healthcare provider.' },
      { question: 'Is the "gain so far" estimate exact?', answer: 'No, it uses a simplified linear pacing model. Actual healthy weight gain is typically slower in the first trimester and faster in the second and third, so use it as a rough guide only.' }
    ],
    relatedSlugs: ['pregnancy-due-date', 'bmi-calculator', 'conception-date-calculator']
  },
  {
    slug: 'menopause-age-calculator',
    category: 'health',
    name: 'Menopause Age Calculator',
    h1: 'Menopause Age Estimator',
    seoTitle: 'Menopause Age Calculator - Estimate Your Menopause Timing',
    seoDescription: 'Get a rough statistical estimate of when you might reach menopause based on average age, genetics, and smoking status.',
    formulaDescription: 'Estimate centers on the average menopause age of 51, weighted toward mother\'s age at menopause, adjusted down 1.5 years for smokers.',
    explainerHtml: `
      <p>This calculator gives a rough statistical estimate of when you might reach menopause, based on the average age of menopause and known risk factors like genetics and smoking.</p>
      <h3>Genetics Is the Strongest Predictor</h3>
      <p>Research consistently shows that the age your mother reached menopause is one of the strongest predictors of when you will, more so than lifestyle factors in most cases.</p>
      <h3>The Role of Smoking</h3>
      <p>Studies show smokers tend to reach menopause about 1 to 2 years earlier on average than non-smokers, likely due to the effect of smoking on ovarian function.</p>
    `,
    faqs: [
      { question: 'How accurate is this estimate?', answer: 'This is a rough statistical estimate based on population averages and known predictors, not a medical prediction. Individual timing can vary widely due to factors this calculator does not account for.' },
      { question: 'What is the average age of menopause?', answer: 'The average age of natural menopause in the United States is 51, though it commonly occurs anywhere between 45 and 55.' },
      { question: 'What is perimenopause?', answer: 'Perimenopause is the transitional period leading up to menopause, often starting several years earlier, during which hormone levels fluctuate and symptoms like irregular periods can begin.' }
    ],
    relatedSlugs: ['menstrual-cycle-calculator', 'bmi-calculator', 'waist-hip-ratio-calculator']
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
    formulaDescription: 'Total Days = |End Date - Start Date|. Calendar breakdown (years/months/days) accounts for variable month lengths and leap years. If the start date is after the end date, the absolute difference is shown.',
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
    relatedSlugs: ['percentage-calculator', 'date-difference-calculator', 'length-converter', 'weight-converter', 'temperature-converter']
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
  },
  {
    slug: 'online-ruler',
    category: 'everyday',
    name: 'Online Ruler',
    h1: 'Online Ruler - Measure On Screen',
    seoTitle: 'Online Ruler - Measure Real-World Size With Your Screen',
    seoDescription: 'Turn your phone or computer screen into a ruler. Measure objects in inches and centimeters directly on screen, with optional credit-card calibration for extra accuracy.',
    formulaDescription: 'Default scale uses the CSS specification of 96px = 1 logical inch. Calibration mode recalculates px-per-inch from a known 3.370in credit card width.',
    explainerHtml: `
      <p>This tool turns your phone, tablet, or computer screen into a ruler you can hold up to a real object, showing accurate inch and centimeter markings.</p>
      <h3>Why Calibration Matters</h3>
      <p>Browsers don't expose your screen's true physical size, so by default this ruler uses the CSS specification's assumption of 96 pixels per inch, which is reasonably accurate on many laptop and desktop monitors at 100% browser zoom, but can be noticeably off on phones, tablets, and high-resolution displays.</p>
      <h3>One-Tap Credit Card Calibration</h3>
      <p>For an exact match on your specific device, tap Calibrate and hold any standard credit or debit card (which are a standardized 3.370 inches wide worldwide) up to the on-screen rectangle. Use the +/- buttons to nudge it until it matches your card exactly, then save - your calibration is remembered on this device for next time.</p>
    `,
    faqs: [
      { question: 'Does this work on both phones and computers?', answer: 'Yes. The same credit-card calibration method works on any screen, since it measures your specific screen\'s actual pixel density rather than relying on the device type.' },
      { question: 'How accurate is it without calibrating?', answer: 'The default scale assumes 96 pixels per logical inch, the standard used by CSS. This is often close on desktop monitors at default zoom, but can be meaningfully off on phones and high-DPI screens, so calibrating with a card is recommended for precise measurements.' },
      { question: 'Why does zooming my browser affect accuracy?', answer: 'Zooming in or out changes how many physical pixels represent one logical CSS pixel, which shifts the ruler\'s real-world scale. Keep your browser at 100% zoom, or recalibrate after changing zoom level, for the most accurate results.' }
    ],
    relatedSlugs: ['length-converter', 'cm-to-inches-converter', 'unit-converter']
  },
  // --- CONVERSION ---
  {
    slug: 'length-converter',
    category: 'conversion',
    name: 'Length Converter',
    h1: 'Length Converter',
    seoTitle: 'Length Converter - Meters, Feet, Miles, Inches & More',
    seoDescription: 'Convert length and distance instantly between meters, kilometers, miles, feet, inches, yards, and centimeters.',
    formulaDescription: 'All lengths are converted through a common base unit (meters). 1 inch = 2.54 cm, 1 mile = 1.609344 km.',
    explainerHtml: `
      <p>A length converter lets you switch between metric and imperial distance units instantly, whether you are working on a construction project, following a recipe from another country, or converting a road trip distance.</p>
      <h3>Common Length Conversions</h3>
      <ul>
        <li><strong>1 inch</strong> = 2.54 centimeters</li>
        <li><strong>1 foot</strong> = 0.3048 meters</li>
        <li><strong>1 mile</strong> = 1.609344 kilometers</li>
        <li><strong>1 yard</strong> = 0.9144 meters</li>
      </ul>
      <h3>Metric vs. Imperial</h3>
      <p>Most of the world uses the metric system (meters, kilometers, centimeters), while the United States primarily uses imperial units (feet, inches, miles, yards). This converter bridges both systems in one tool.</p>
    `,
    faqs: [
      { question: 'How many centimeters are in an inch?', answer: 'There are exactly 2.54 centimeters in one inch. This is the internationally agreed definition of the inch.' },
      { question: 'How do I convert miles to kilometers?', answer: 'Multiply the number of miles by 1.609344 to get kilometers. For example, 10 miles equals 16.09 kilometers.' },
      { question: 'What is the base unit used for length conversions?', answer: 'This tool uses meters as the common base unit internally, converting your input to meters first and then to your target unit for maximum accuracy.' }
    ],
    relatedSlugs: ['cm-to-inches-converter', 'weight-converter', 'unit-converter']
  },
  {
    slug: 'cm-to-inches-converter',
    category: 'conversion',
    name: 'CM to Inches Converter',
    h1: 'CM to Inches Converter',
    seoTitle: 'CM to Inches Converter - Quick Centimeter Conversion',
    seoDescription: 'Convert centimeters to inches and inches to centimeters instantly with this simple two-way converter.',
    formulaDescription: 'Inches = Centimeters / 2.54. Centimeters = Inches * 2.54.',
    explainerHtml: `
      <p>Converting between centimeters and inches is one of the most common unit conversions, useful for height, screen sizes, fabric measurements, and international shopping.</p>
      <h3>The Conversion Factor</h3>
      <p>One inch is defined as exactly 2.54 centimeters. To convert centimeters to inches, divide by 2.54. To go the other way, multiply inches by 2.54.</p>
      <h3>Quick Reference</h3>
      <ul>
        <li>1 cm ≈ 0.3937 in</li>
        <li>1 in = 2.54 cm</li>
        <li>30 cm ≈ 11.81 in</li>
      </ul>
    `,
    faqs: [
      { question: 'How many inches is 1 cm?', answer: '1 centimeter is approximately 0.3937 inches.' },
      { question: 'How do I convert my height from cm to inches?', answer: 'Divide your height in centimeters by 2.54. For example, 170 cm divided by 2.54 equals about 66.9 inches.' },
      { question: 'Is this conversion exact?', answer: 'Yes, the inch-to-centimeter relationship (1 in = 2.54 cm) is an exact, internationally defined conversion, not an approximation.' }
    ],
    relatedSlugs: ['length-converter', 'weight-converter', 'unit-converter']
  },
  {
    slug: 'weight-converter',
    category: 'conversion',
    name: 'Weight Converter',
    h1: 'Weight Converter',
    seoTitle: 'Weight Converter - kg, lb, oz, g & Metric Tons',
    seoDescription: 'Convert weight and mass instantly between kilograms, pounds, ounces, grams, and metric tons.',
    formulaDescription: '1 kilogram = 2.20462 pounds. 1 pound = 0.45359237 kilograms.',
    explainerHtml: `
      <p>A weight converter helps you move between metric mass units (grams, kilograms, metric tons) and imperial/US units (ounces, pounds) commonly used in cooking, shipping, fitness, and science.</p>
      <h3>Key Conversion Factors</h3>
      <ul>
        <li><strong>1 kilogram</strong> = 2.20462 pounds</li>
        <li><strong>1 pound</strong> = 0.45359237 kilograms = 16 ounces</li>
        <li><strong>1 ounce</strong> = 28.3495 grams</li>
        <li><strong>1 metric ton</strong> = 1,000 kilograms</li>
      </ul>
    `,
    faqs: [
      { question: 'How many pounds are in a kilogram?', answer: 'One kilogram equals approximately 2.20462 pounds.' },
      { question: 'How do I convert grams to ounces?', answer: 'Divide the number of grams by 28.3495 to get ounces.' },
      { question: 'What is the difference between a metric ton and a US ton?', answer: 'A metric ton is 1,000 kilograms (about 2,204.6 lbs), while a US "short" ton is 2,000 pounds (about 907.18 kg). They are not the same unit.' }
    ],
    relatedSlugs: ['length-converter', 'density-converter', 'unit-converter']
  },
  {
    slug: 'temperature-converter',
    category: 'conversion',
    name: 'Temperature Converter',
    h1: 'Temperature Converter',
    seoTitle: 'Temperature Converter - Celsius, Fahrenheit & Kelvin',
    seoDescription: 'Convert temperatures instantly between Celsius, Fahrenheit, and Kelvin scales.',
    formulaDescription: '°F = °C * 9/5 + 32. °C = (°F - 32) * 5/9. K = °C + 273.15.',
    explainerHtml: `
      <p>A temperature converter switches values between the three most common temperature scales: Celsius (used by most of the world), Fahrenheit (used in the US), and Kelvin (used in science).</p>
      <h3>Conversion Formulas</h3>
      <ul>
        <li><strong>Celsius to Fahrenheit:</strong> °F = °C × 9/5 + 32</li>
        <li><strong>Fahrenheit to Celsius:</strong> °C = (°F − 32) × 5/9</li>
        <li><strong>Celsius to Kelvin:</strong> K = °C + 273.15</li>
      </ul>
      <h3>Reference Points</h3>
      <p>Water freezes at 0°C / 32°F / 273.15K and boils at 100°C / 212°F / 373.15K at standard atmospheric pressure.</p>
    `,
    faqs: [
      { question: 'What is 0°C in Fahrenheit?', answer: '0°C equals 32°F, the freezing point of water at sea level.' },
      { question: 'Why does Kelvin never go negative?', answer: 'Kelvin is an absolute temperature scale starting at absolute zero (0K = -273.15°C), the theoretical point where all molecular motion stops, so negative Kelvin values do not occur in classical physics.' },
      { question: 'How do I convert body temperature from Fahrenheit to Celsius?', answer: 'Subtract 32 from the Fahrenheit value, then multiply by 5/9. For example, 98.6°F becomes (98.6 - 32) × 5/9 = 37°C.' }
    ],
    relatedSlugs: ['weight-converter', 'length-converter', 'unit-converter']
  },
  {
    slug: 'volume-converter',
    category: 'conversion',
    name: 'Volume Converter',
    h1: 'Volume Converter',
    seoTitle: 'Volume Converter - Liters, Gallons, mL, Cups & More',
    seoDescription: 'Convert volume instantly between liters, gallons, milliliters, cups, fluid ounces, and cubic meters.',
    formulaDescription: '1 US gallon = 3.785411784 liters. 1 liter = 1,000 milliliters.',
    explainerHtml: `
      <p>A volume converter helps you switch between metric and US customary volume units — useful for cooking, fuel, and liquid measurements.</p>
      <h3>Common Volume Conversions</h3>
      <ul>
        <li><strong>1 US gallon</strong> = 3.785411784 liters</li>
        <li><strong>1 liter</strong> = 1,000 milliliters</li>
        <li><strong>1 US cup</strong> = 236.588 milliliters</li>
        <li><strong>1 fluid ounce</strong> = 29.5735 milliliters</li>
        <li><strong>1 cubic meter</strong> = 1,000 liters</li>
      </ul>
    `,
    faqs: [
      { question: 'How many liters are in a gallon?', answer: 'One US gallon equals approximately 3.785 liters. Note that a UK (imperial) gallon is larger, at about 4.546 liters.' },
      { question: 'How many mL are in a cup?', answer: 'One US cup equals approximately 236.588 milliliters.' },
      { question: 'Does this use US or UK gallons?', answer: 'This calculator uses the US liquid gallon (3.785411784 liters) by default, the standard used in American recipes and fuel measurements.' }
    ],
    relatedSlugs: ['cooking-converter', 'density-converter', 'unit-converter']
  },
  {
    slug: 'area-converter',
    category: 'conversion',
    name: 'Area Converter',
    h1: 'Area Converter',
    seoTitle: 'Area Converter - Square Meters, Feet, Acres & Hectares',
    seoDescription: 'Convert area instantly between square meters, square feet, acres, and hectares.',
    formulaDescription: '1 acre = 4046.8564224 square meters. 1 hectare = 10,000 square meters.',
    explainerHtml: `
      <p>An area converter is essential for real estate, farming, and construction, letting you translate land or floor space between metric and imperial units.</p>
      <h3>Key Conversion Factors</h3>
      <ul>
        <li><strong>1 acre</strong> = 4,046.8564224 square meters ≈ 43,560 square feet</li>
        <li><strong>1 hectare</strong> = 10,000 square meters ≈ 2.471 acres</li>
        <li><strong>1 square meter</strong> = 10.7639 square feet</li>
      </ul>
    `,
    faqs: [
      { question: 'How many square feet are in an acre?', answer: 'One acre equals exactly 43,560 square feet.' },
      { question: 'How many acres are in a hectare?', answer: 'One hectare equals approximately 2.471 acres.' },
      { question: 'What is the difference between an acre and a hectare?', answer: 'An acre is an imperial/US unit (43,560 sq ft), while a hectare is a metric unit (10,000 sq m). A hectare is roughly 2.47 times larger than an acre.' }
    ],
    relatedSlugs: ['acreage-calculator', 'length-converter', 'unit-converter']
  },
  {
    slug: 'speed-converter',
    category: 'conversion',
    name: 'Speed Converter',
    h1: 'Speed Converter',
    seoTitle: 'Speed Converter - MPH, KPH, m/s & Knots',
    seoDescription: 'Convert speed instantly between miles per hour, kilometers per hour, meters per second, and knots.',
    formulaDescription: '1 mph = 1.609344 kph. 1 knot = 1.852 kph.',
    explainerHtml: `
      <p>A speed converter translates velocity between the units used in driving, aviation, and maritime navigation.</p>
      <h3>Common Speed Conversions</h3>
      <ul>
        <li><strong>1 mph</strong> = 1.609344 km/h</li>
        <li><strong>1 knot</strong> = 1.852 km/h (used in aviation and shipping)</li>
        <li><strong>1 m/s</strong> = 3.6 km/h</li>
      </ul>
    `,
    faqs: [
      { question: 'How do I convert mph to km/h?', answer: 'Multiply the mph value by 1.609344 to get kilometers per hour.' },
      { question: 'What is a knot?', answer: 'A knot is a unit of speed equal to one nautical mile per hour, or 1.852 km/h. It is used primarily in maritime and aviation contexts.' },
      { question: 'How fast is 100 km/h in mph?', answer: '100 km/h divided by 1.609344 equals approximately 62.14 mph.' }
    ],
    relatedSlugs: ['length-converter', 'fuel-economy-converter', 'unit-converter']
  },
  {
    slug: 'pressure-converter',
    category: 'conversion',
    name: 'Pressure Converter',
    h1: 'Pressure Converter',
    seoTitle: 'Pressure Converter - PSI, Bar, Pascal & Atmospheres',
    seoDescription: 'Convert pressure instantly between PSI, bar, pascal, and standard atmospheres.',
    formulaDescription: '1 psi = 6894.75729 pascals. 1 bar = 100,000 pascals. 1 atm = 101,325 pascals.',
    explainerHtml: `
      <p>A pressure converter is useful for tire inflation, weather readings, and engineering, letting you switch between PSI, bar, pascal, and atmospheres.</p>
      <h3>Key Conversion Factors</h3>
      <ul>
        <li><strong>1 psi</strong> = 6,894.75729 pascals</li>
        <li><strong>1 bar</strong> = 100,000 pascals ≈ 14.5038 psi</li>
        <li><strong>1 atmosphere (atm)</strong> = 101,325 pascals</li>
      </ul>
    `,
    faqs: [
      { question: 'How many PSI is one bar?', answer: 'One bar is approximately 14.5038 PSI.' },
      { question: 'What pressure unit is standard atmospheric pressure?', answer: 'Standard atmospheric pressure is 1 atm, equal to 101,325 pascals or about 14.696 PSI.' },
      { question: 'Why does tire pressure use PSI?', answer: 'PSI (pounds per square inch) is the traditional imperial pressure unit used in the US automotive industry, while most of the world uses bar or kPa for tire pressure.' }
    ],
    relatedSlugs: ['force-converter', 'weight-converter', 'unit-converter']
  },
  {
    slug: 'force-converter',
    category: 'conversion',
    name: 'Force Converter',
    h1: 'Force Converter',
    seoTitle: 'Force Converter - Newtons, Pound-Force, Kgf & Dyne',
    seoDescription: 'Convert force instantly between newtons, pound-force, kilogram-force, and dyne.',
    formulaDescription: '1 newton = 0.224809 lbf. 1 kgf = 9.80665 newtons. 1 dyne = 0.00001 newtons.',
    explainerHtml: `
      <p>A force converter helps engineers, students, and hobbyists switch between the metric newton and other common force units.</p>
      <h3>Key Conversion Factors</h3>
      <ul>
        <li><strong>1 newton (N)</strong> = 0.224809 pound-force (lbf)</li>
        <li><strong>1 kilogram-force (kgf)</strong> = 9.80665 newtons</li>
        <li><strong>1 dyne</strong> = 0.00001 newtons</li>
      </ul>
    `,
    faqs: [
      { question: 'What is a newton?', answer: 'A newton is the SI unit of force, defined as the force needed to accelerate a 1 kg mass at 1 meter per second squared.' },
      { question: 'How do I convert newtons to pound-force?', answer: 'Multiply the newton value by 0.224809 to get pound-force (lbf).' },
      { question: 'What is kgf used for?', answer: 'Kilogram-force (kgf) is a legacy metric force unit still used in some engineering and consumer contexts, equal to the force exerted by gravity on a 1 kg mass.' }
    ],
    relatedSlugs: ['pressure-converter', 'torque-converter', 'unit-converter']
  },
  {
    slug: 'ppm-calculator',
    category: 'conversion',
    name: 'PPM Calculator',
    h1: 'PPM Calculator (Parts Per Million)',
    seoTitle: 'PPM Calculator - Convert Parts Per Million to Percent',
    seoDescription: 'Convert between parts per million (ppm), percent, and ratio concentration values instantly.',
    formulaDescription: 'Percent = PPM / 10,000. PPM = Percent * 10,000.',
    explainerHtml: `
      <p>Parts per million (ppm) is a common way to express very small concentrations, used in chemistry, water quality, and environmental science. This calculator converts ppm to percentage and ratio form and back.</p>
      <h3>Conversion Formulas</h3>
      <ul>
        <li><strong>PPM to Percent:</strong> Percent = PPM ÷ 10,000</li>
        <li><strong>Percent to PPM:</strong> PPM = Percent × 10,000</li>
        <li><strong>PPM as a ratio:</strong> 1 ppm = 1 part in 1,000,000 parts</li>
      </ul>
    `,
    faqs: [
      { question: 'What does 1 ppm mean?', answer: '1 ppm means one part of a substance per one million parts of the total solution or mixture — equivalent to 0.0001%.' },
      { question: 'How do I convert ppm to percent?', answer: 'Divide the ppm value by 10,000. For example, 500 ppm equals 0.05%.' },
      { question: 'Where is ppm commonly used?', answer: 'PPM is widely used for measuring water hardness, chlorine levels, air pollutants, and trace chemical concentrations.' }
    ],
    relatedSlugs: ['percentage-calculator', 'density-converter', 'unit-converter']
  },
  {
    slug: 'acreage-calculator',
    category: 'conversion',
    name: 'Acreage Calculator',
    h1: 'Acreage Calculator',
    seoTitle: 'Acreage Calculator - Acres to Sq Ft, Sq M & Hectares',
    seoDescription: 'Convert acreage between acres, square feet, square meters, and hectares, plus estimate land value per acre.',
    formulaDescription: '1 acre = 43,560 square feet = 4,046.8564224 square meters = 0.404686 hectares.',
    explainerHtml: `
      <p>An acreage calculator helps land buyers, farmers, and real estate professionals convert acres to other area units and estimate total land value based on a price-per-acre figure.</p>
      <h3>Acreage Conversions</h3>
      <ul>
        <li><strong>1 acre</strong> = 43,560 square feet</li>
        <li><strong>1 acre</strong> = 4,046.86 square meters</li>
        <li><strong>1 acre</strong> = 0.404686 hectares</li>
      </ul>
      <h3>Estimating Land Value</h3>
      <p>Multiply the number of acres by the price per acre to estimate total land price — a quick way to compare listings priced differently.</p>
    `,
    faqs: [
      { question: 'How many square feet are in an acre?', answer: 'One acre equals exactly 43,560 square feet.' },
      { question: 'How do I calculate total land price from price per acre?', answer: 'Multiply the number of acres by the price per acre. For example, 5 acres at $10,000/acre equals $50,000.' },
      { question: 'How many acres are in a hectare?', answer: 'One hectare equals approximately 2.471 acres.' }
    ],
    relatedSlugs: ['area-converter', 'length-converter', 'unit-converter']
  },
  {
    slug: 'currency-converter',
    category: 'conversion',
    name: 'Currency Converter',
    h1: 'Currency Converter',
    seoTitle: 'Currency Converter - Convert Money Using Your Own Rate',
    seoDescription: 'Convert between two currencies by entering the current exchange rate manually for an instant calculation.',
    formulaDescription: 'Converted Amount = Original Amount * Exchange Rate.',
    explainerHtml: `
      <p>This currency converter lets you calculate the value of money in another currency by entering the current exchange rate yourself, ensuring you always use the most up-to-date rate from your preferred source.</p>
      <h3>How to Use</h3>
      <p>Enter the amount you want to convert and the current exchange rate (found from your bank, a financial news site, or a live rate provider). The calculator instantly multiplies the amount by the rate.</p>
      <h3>Why Enter Your Own Rate?</h3>
      <p>Exchange rates fluctuate constantly throughout the trading day. Entering the rate manually ensures you are working with the exact figure relevant to your transaction, such as your bank's quoted rate or a real-time market rate.</p>
    `,
    faqs: [
      { question: 'Where do I find the current exchange rate?', answer: 'Check your bank, a currency exchange service, or a financial data provider for the live mid-market or bank-quoted rate, then enter it here.' },
      { question: 'Why doesn\'t this tool pull live rates automatically?', answer: 'This tool is designed to let you use the exact rate quoted by your bank or exchange provider, since actual transaction rates often differ from published market rates due to fees and spreads.' },
      { question: 'How do I convert back to the original currency?', answer: 'Divide the converted amount by the exchange rate, or enter the reciprocal (1 / rate) as your new exchange rate.' }
    ],
    relatedSlugs: ['percentage-calculator', 'ppm-calculator', 'unit-converter']
  },
  {
    slug: 'time-converter',
    category: 'conversion',
    name: 'Time Converter',
    h1: 'Time Converter',
    seoTitle: 'Time Converter - Seconds, Minutes, Hours, Days & Years',
    seoDescription: 'Convert time instantly between seconds, minutes, hours, days, weeks, and years.',
    formulaDescription: '1 minute = 60 seconds. 1 hour = 3,600 seconds. 1 day = 86,400 seconds.',
    explainerHtml: `
      <p>A time converter switches durations between seconds, minutes, hours, days, weeks, and years, handy for project planning, science, and everyday scheduling math.</p>
      <h3>Time Unit Conversions</h3>
      <ul>
        <li><strong>1 minute</strong> = 60 seconds</li>
        <li><strong>1 hour</strong> = 3,600 seconds = 60 minutes</li>
        <li><strong>1 day</strong> = 86,400 seconds = 24 hours</li>
        <li><strong>1 year</strong> ≈ 365.25 days (accounting for leap years)</li>
      </ul>
    `,
    faqs: [
      { question: 'How many seconds are in a day?', answer: 'There are 86,400 seconds in one 24-hour day (60 seconds × 60 minutes × 24 hours).' },
      { question: 'How many hours are in a week?', answer: 'There are 168 hours in one week (24 hours × 7 days).' },
      { question: 'Why use 365.25 days for a year?', answer: 'Using 365.25 days accounts for the extra day added roughly every 4 years in leap years, giving a more accurate average year length.' }
    ],
    relatedSlugs: ['date-difference-calculator', 'age-calculator', 'unit-converter']
  },
  {
    slug: 'data-storage-converter',
    category: 'conversion',
    name: 'Data Storage Converter',
    h1: 'Data Storage Converter',
    seoTitle: 'Data Storage Converter - Bytes, KB, MB, GB & TB',
    seoDescription: 'Convert digital storage instantly between bytes, kilobytes, megabytes, gigabytes, and terabytes, with binary and decimal options.',
    formulaDescription: 'Decimal: 1 KB = 1,000 bytes. Binary: 1 KiB = 1,024 bytes.',
    explainerHtml: `
      <p>A data storage converter translates file sizes and storage capacities between bytes, kilobytes, megabytes, gigabytes, and terabytes — useful for understanding hard drive specs, file sizes, and cloud storage plans.</p>
      <h3>Binary vs. Decimal Standards</h3>
      <p>Storage manufacturers typically use decimal (base-1000) units, where 1 KB = 1,000 bytes. Operating systems often use binary (base-1024) units, where 1 KiB = 1,024 bytes. This discrepancy is why a "1TB" drive shows less capacity in Windows.</p>
      <h3>Common Conversions (Decimal)</h3>
      <ul>
        <li>1 KB = 1,000 bytes</li>
        <li>1 MB = 1,000,000 bytes</li>
        <li>1 GB = 1,000,000,000 bytes</li>
      </ul>
    `,
    faqs: [
      { question: 'Why does my 1TB drive show less than 1,000GB in Windows?', answer: 'Windows uses binary (base-1024) calculations while drive manufacturers use decimal (base-1000), so a 1,000,000,000,000-byte "1TB" drive shows as roughly 931 GiB in the OS.' },
      { question: 'How many MB are in a GB?', answer: 'Using decimal standard, 1 GB equals 1,000 MB. Using binary standard, 1 GiB equals 1,024 MiB.' },
      { question: 'What is the difference between a bit and a byte?', answer: 'A byte consists of 8 bits. Data transfer speeds are often measured in bits (Mbps), while file sizes are measured in bytes (MB).' }
    ],
    relatedSlugs: ['unit-converter', 'time-converter', 'energy-converter']
  },
  {
    slug: 'energy-converter',
    category: 'conversion',
    name: 'Energy Converter',
    h1: 'Energy Converter',
    seoTitle: 'Energy Converter - Joules, Calories, kWh & BTU',
    seoDescription: 'Convert energy instantly between joules, calories, kilowatt-hours, and BTU.',
    formulaDescription: '1 calorie = 4.184 joules. 1 kWh = 3,600,000 joules. 1 BTU = 1,055.06 joules.',
    explainerHtml: `
      <p>An energy converter switches between scientific and everyday energy units — used in nutrition (calories), electricity billing (kWh), and heating/cooling (BTU).</p>
      <h3>Key Conversion Factors</h3>
      <ul>
        <li><strong>1 calorie</strong> = 4.184 joules</li>
        <li><strong>1 kilowatt-hour (kWh)</strong> = 3,600,000 joules</li>
        <li><strong>1 BTU</strong> = 1,055.06 joules</li>
      </ul>
    `,
    faqs: [
      { question: 'How many joules are in a food calorie?', answer: 'A food "Calorie" (kilocalorie) equals 4,184 joules. A small "calorie" equals 4.184 joules.' },
      { question: 'What is a kWh used for?', answer: 'A kilowatt-hour is the standard unit electricity companies use to bill energy consumption — the energy of using 1,000 watts for one hour.' },
      { question: 'What does BTU stand for?', answer: 'BTU stands for British Thermal Unit, commonly used to rate the heating or cooling capacity of appliances like air conditioners and furnaces.' }
    ],
    relatedSlugs: ['power-converter', 'calorie-calculator', 'unit-converter']
  },
  {
    slug: 'angle-converter',
    category: 'conversion',
    name: 'Angle Converter',
    h1: 'Angle Converter',
    seoTitle: 'Angle Converter - Degrees, Radians & Gradians',
    seoDescription: 'Convert angles instantly between degrees, radians, and gradians.',
    formulaDescription: 'Radians = Degrees * (π / 180). Gradians = Degrees * (10/9).',
    explainerHtml: `
      <p>An angle converter switches between degrees (the everyday unit), radians (used in mathematics and physics), and gradians (used in some surveying applications).</p>
      <h3>Conversion Formulas</h3>
      <ul>
        <li><strong>Degrees to Radians:</strong> Radians = Degrees × (π / 180)</li>
        <li><strong>Degrees to Gradians:</strong> Gradians = Degrees × (10 / 9)</li>
        <li><strong>Full circle:</strong> 360° = 2π radians = 400 gradians</li>
      </ul>
    `,
    faqs: [
      { question: 'How many radians are in a full circle?', answer: 'A full circle equals 2π radians, approximately 6.2832 radians.' },
      { question: 'What is a gradian?', answer: 'A gradian (or gon) divides a right angle into 100 units, so a full circle equals 400 gradians. It is mainly used in surveying and some European engineering contexts.' },
      { question: 'How do I convert 90 degrees to radians?', answer: '90 degrees × (π / 180) = π/2 radians, approximately 1.5708 radians.' }
    ],
    relatedSlugs: ['unit-converter', 'torque-converter', 'length-converter']
  },
  {
    slug: 'fuel-economy-converter',
    category: 'conversion',
    name: 'Fuel Economy Converter',
    h1: 'Fuel Economy Converter',
    seoTitle: 'Fuel Economy Converter - MPG to L/100km & km/L',
    seoDescription: 'Convert fuel economy instantly between miles per gallon (MPG), liters per 100km, and kilometers per liter.',
    formulaDescription: 'L/100km = 235.214583 / MPG (US). km/L = 100 / (L/100km).',
    explainerHtml: `
      <p>A fuel economy converter translates vehicle efficiency ratings between the US standard (miles per gallon) and the metric standards used elsewhere (liters per 100km, or km per liter).</p>
      <h3>Why the Conversion is Inverted</h3>
      <p>MPG and km/L measure distance per unit of fuel (higher is better), while L/100km measures fuel used per fixed distance (lower is better) — so the relationship between MPG and L/100km is inverse, not linear.</p>
      <h3>Key Formula</h3>
      <p><code>L/100km = 235.214583 / MPG</code> (using US gallons). This inverse relationship means doubling your MPG does not simply halve your L/100km in a linear sense at every point of the scale.</p>
    `,
    faqs: [
      { question: 'How do I convert MPG to L/100km?', answer: 'Divide 235.214583 by your MPG value (using US gallons) to get liters per 100 kilometers.' },
      { question: 'Is UK MPG different from US MPG?', answer: 'Yes. A UK (imperial) gallon is larger than a US gallon, so UK MPG figures are typically about 20% higher than the equivalent US MPG for the same fuel efficiency.' },
      { question: 'What does a lower L/100km number mean?', answer: 'A lower L/100km value means better fuel efficiency — the vehicle uses less fuel to travel the same distance.' }
    ],
    relatedSlugs: ['speed-converter', 'volume-converter', 'unit-converter']
  },
  {
    slug: 'cooking-converter',
    category: 'conversion',
    name: 'Cooking Measurement Converter',
    h1: 'Cooking Converter',
    seoTitle: 'Cooking Converter - Cups, Tablespoons, mL & Grams',
    seoDescription: 'Convert cooking measurements between cups, tablespoons, teaspoons, milliliters, and grams for common ingredients.',
    formulaDescription: '1 cup = 236.588 mL = 16 tablespoons = 48 teaspoons. Gram conversions vary by ingredient density.',
    explainerHtml: `
      <p>A cooking converter helps home bakers and chefs switch between volume measurements (cups, tablespoons, teaspoons, milliliters) and approximate weight in grams for common ingredients.</p>
      <h3>Volume Conversions</h3>
      <ul>
        <li><strong>1 cup</strong> = 236.588 mL = 16 tablespoons</li>
        <li><strong>1 tablespoon</strong> = 14.7868 mL = 3 teaspoons</li>
        <li><strong>1 teaspoon</strong> = 4.92892 mL</li>
      </ul>
      <h3>Note on Gram Conversions</h3>
      <p>Converting volume to grams is approximate because ingredient density varies — 1 cup of flour weighs roughly 120g, while 1 cup of sugar weighs roughly 200g. Always note that gram conversions are estimates.</p>
    `,
    faqs: [
      { question: 'How many tablespoons are in a cup?', answer: 'There are 16 tablespoons in one US cup.' },
      { question: 'Why are gram conversions approximate?', answer: 'Different ingredients have different densities — a cup of flour weighs less than a cup of sugar or water — so volume-to-weight conversions are estimates based on typical ingredient density.' },
      { question: 'How many mL are in a tablespoon?', answer: 'One US tablespoon equals approximately 14.79 milliliters.' }
    ],
    relatedSlugs: ['volume-converter', 'density-converter', 'unit-converter']
  },
  {
    slug: 'density-converter',
    category: 'conversion',
    name: 'Density Converter',
    h1: 'Density Converter',
    seoTitle: 'Density Converter - kg/m3, g/cm3 & lb/ft3',
    seoDescription: 'Convert density instantly between kilograms per cubic meter, grams per cubic centimeter, and pounds per cubic foot.',
    formulaDescription: '1 g/cm3 = 1,000 kg/m3. 1 lb/ft3 = 16.0185 kg/m3.',
    explainerHtml: `
      <p>A density converter translates mass-per-volume measurements between metric and imperial units, used in material science, cooking, and engineering.</p>
      <h3>Key Conversion Factors</h3>
      <ul>
        <li><strong>1 g/cm³</strong> = 1,000 kg/m³ (water has a density of 1 g/cm³)</li>
        <li><strong>1 lb/ft³</strong> = 16.0185 kg/m³</li>
      </ul>
    `,
    faqs: [
      { question: 'What is the density of water?', answer: 'Water has a density of approximately 1 g/cm³, or 1,000 kg/m³, at 4°C.' },
      { question: 'How do I convert g/cm3 to kg/m3?', answer: 'Multiply the g/cm³ value by 1,000 to get kg/m³.' },
      { question: 'Why does density matter for shipping?', answer: 'Density determines "dimensional weight" for shipping — low-density (bulky, lightweight) items are often billed by volume rather than actual weight.' }
    ],
    relatedSlugs: ['weight-converter', 'volume-converter', 'unit-converter']
  },
  {
    slug: 'power-converter',
    category: 'conversion',
    name: 'Power Converter',
    h1: 'Power Converter',
    seoTitle: 'Power Converter - Watts, Kilowatts, Horsepower & BTU/h',
    seoDescription: 'Convert power instantly between watts, kilowatts, horsepower, and BTU per hour.',
    formulaDescription: '1 horsepower = 745.699872 watts. 1 kW = 1,000 watts. 1 watt = 3.412142 BTU/h.',
    explainerHtml: `
      <p>A power converter translates rate-of-energy-use units between watts (electrical), horsepower (mechanical/automotive), and BTU per hour (HVAC).</p>
      <h3>Key Conversion Factors</h3>
      <ul>
        <li><strong>1 horsepower (hp)</strong> = 745.699872 watts</li>
        <li><strong>1 kilowatt (kW)</strong> = 1,000 watts ≈ 1.341 hp</li>
        <li><strong>1 watt</strong> = 3.412142 BTU per hour</li>
      </ul>
    `,
    faqs: [
      { question: 'How many watts is 1 horsepower?', answer: 'One mechanical horsepower equals approximately 745.7 watts.' },
      { question: 'How do I convert kW to horsepower?', answer: 'Multiply the kilowatt value by 1.34102 to get horsepower.' },
      { question: 'What is BTU/h used for?', answer: 'BTU per hour measures the heating or cooling power of HVAC equipment like air conditioners and furnaces.' }
    ],
    relatedSlugs: ['energy-converter', 'torque-converter', 'unit-converter']
  },
  {
    slug: 'torque-converter',
    category: 'conversion',
    name: 'Torque Converter',
    h1: 'Torque Converter',
    seoTitle: 'Torque Converter - Newton-Meters, Ft-lb & In-lb',
    seoDescription: 'Convert torque instantly between newton-meters, foot-pounds, and inch-pounds.',
    formulaDescription: '1 N·m = 0.737562 ft-lb. 1 ft-lb = 12 in-lb.',
    explainerHtml: `
      <p>A torque converter switches rotational force values between the metric newton-meter and the imperial foot-pound and inch-pound units used in automotive and mechanical work.</p>
      <h3>Key Conversion Factors</h3>
      <ul>
        <li><strong>1 newton-meter (N·m)</strong> = 0.737562 foot-pounds (ft-lb)</li>
        <li><strong>1 foot-pound</strong> = 12 inch-pounds (in-lb)</li>
      </ul>
    `,
    faqs: [
      { question: 'How do I convert N·m to ft-lb?', answer: 'Multiply the newton-meter value by 0.737562 to get foot-pounds.' },
      { question: 'Why does torque matter for bolts?', answer: 'Torque specifications ensure bolts and fasteners are tightened to the correct force — too little risks loosening, too much can strip threads or break the fastener.' },
      { question: 'How many inch-pounds are in a foot-pound?', answer: 'There are 12 inch-pounds in one foot-pound, since 1 foot equals 12 inches.' }
    ],
    relatedSlugs: ['force-converter', 'power-converter', 'unit-converter']
  },
  {
    slug: 'shoe-size-converter',
    category: 'conversion',
    name: 'Shoe Size Converter',
    h1: 'Shoe Size Converter',
    seoTitle: 'Shoe Size Converter - US, UK, EU & CM Sizing',
    seoDescription: 'Convert shoe sizes instantly between US, UK, EU, and centimeter sizing standards for men and women.',
    formulaDescription: 'Approximate conversions based on standard published international shoe size charts.',
    explainerHtml: `
      <p>A shoe size converter translates sizing between US, UK, EU, and centimeter foot-length standards, useful when shopping from international retailers.</p>
      <h3>How Sizing Systems Differ</h3>
      <p>US, UK, and EU shoe sizes each use different base scales and increments. EU sizing (Paris point system) is based on foot length in centimeters multiplied by 1.5, while US and UK systems use their own historical scales that differ between men's and women's sizing.</p>
      <h3>Note on Accuracy</h3>
      <p>Because brands sometimes vary slightly in their sizing, these conversions are approximate guides based on standard published international size charts — always check a brand's specific size chart when possible.</p>
    `,
    faqs: [
      { question: 'Is EU shoe size the same for men and women?', answer: 'EU sizing uses the same numeric scale for men and women, unlike US and UK sizing which have separate men\'s and women\'s scales.' },
      { question: 'How accurate are shoe size conversions?', answer: 'Shoe size conversions are approximate because sizing standards and brand-specific lasts vary. For a precise fit, measure your foot length in centimeters and compare against a specific brand\'s size chart.' },
      { question: 'What is the difference between US and UK shoe sizes?', answer: 'UK sizes are typically about 0.5 to 1 size number smaller than the equivalent US size for the same foot length.' }
    ],
    relatedSlugs: ['clothing-size-converter', 'length-converter', 'unit-converter']
  },
  {
    slug: 'clothing-size-converter',
    category: 'conversion',
    name: 'Clothing Size Converter',
    h1: 'Clothing Size Converter',
    seoTitle: 'Clothing Size Converter - US, UK & EU Sizing',
    seoDescription: 'Convert clothing sizes instantly between US, UK, and EU letter and number sizing standards.',
    formulaDescription: 'Approximate conversions based on standard published international clothing size charts.',
    explainerHtml: `
      <p>A clothing size converter helps you translate sizing between US, UK, and EU standards when shopping from international brands or retailers.</p>
      <h3>Why Sizes Differ by Region</h3>
      <p>US, UK, and EU clothing sizes each follow different numbering conventions. EU sizes are typically larger numbers than US sizes for the same fit (e.g., a US size 8 is often an EU size 38-40), and UK sizing frequently sits close to US numbering but not identically.</p>
      <h3>Note on Accuracy</h3>
      <p>Clothing size conversions are approximate guides, since actual fit varies significantly by brand, cut, and garment type. Always check the specific brand's size chart when available.</p>
    `,
    faqs: [
      { question: 'Is a US size 8 the same as a UK size 8?', answer: 'No. A US size 8 typically corresponds to roughly a UK size 10-12 for women\'s clothing, since UK sizing runs differently from US sizing.' },
      { question: 'Why do clothing sizes vary between brands?', answer: 'There is no single universal standard for clothing sizing, so brands use their own measurements and cuts, causing the same labeled size to fit differently across brands.' },
      { question: 'What is EU clothing sizing based on?', answer: 'EU sizing is generally based on body measurements in centimeters, resulting in larger numeric labels than US sizing for the same actual fit.' }
    ],
    relatedSlugs: ['shoe-size-converter', 'length-converter', 'unit-converter']
  }
];
