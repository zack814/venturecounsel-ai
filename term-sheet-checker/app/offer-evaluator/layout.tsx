import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offer Evaluator - Evaluate Your Startup Compensation | VentureCounsel.AI',
  description: 'Evaluate your startup job offer against market benchmarks. Get personalized analysis of salary, equity, and terms with negotiation guidance.',
  openGraph: {
    title: 'Offer Evaluator - Evaluate Your Startup Compensation',
    description: 'Evaluate your startup job offer against market benchmarks. Get personalized analysis of salary, equity, and terms with negotiation guidance.',
  },
};

export default function OfferEvaluatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
