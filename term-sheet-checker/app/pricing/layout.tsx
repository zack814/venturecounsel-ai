import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | Free & Pro Plans | VentureCounsel.AI',
  description: 'Start free with 3 analyses per month. Pro plan includes unlimited analyses, PDF exports, negotiation scripts, and priority support for $49/month.',
  keywords: ['venturecounsel pricing', 'legal AI pricing', 'startup tools pricing', 'term sheet checker cost'],
  openGraph: {
    title: 'VentureCounsel.AI Pricing - Start Free',
    description: 'Free plan includes 3 analyses per month. Pro plan at $49/month for unlimited access.',
    type: 'website',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
