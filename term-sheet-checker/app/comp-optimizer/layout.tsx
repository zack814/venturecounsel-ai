import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Startup Compensation Optimizer | Salary & Equity Calculator | VentureCounsel.AI',
  description: 'Build competitive startup compensation packages. Calculate salary vs equity tradeoffs, benchmark against market data, and create compelling offers for early hires.',
  keywords: ['startup compensation', 'equity calculator', 'startup salary', 'equity vs salary', 'startup hiring', 'compensation package'],
  openGraph: {
    title: 'Startup Compensation Optimizer | VentureCounsel.AI',
    description: 'Build competitive compensation packages with quantified salary/equity tradeoffs for startup hiring.',
    type: 'website',
  },
};

export default function CompOptimizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
