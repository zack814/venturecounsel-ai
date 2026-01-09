import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free SAFE Generator | Create YC SAFEs with Side Letters | VentureCounsel.AI',
  description: 'Generate market-standard SAFE agreements based on YC templates. Create post-money SAFEs with optional side letters, pro-rata rights, and MFN clauses. Free for founders.',
  keywords: ['SAFE generator', 'YC SAFE', 'SAFE agreement', 'simple agreement future equity', 'startup fundraising', 'SAFE template'],
  openGraph: {
    title: 'Free SAFE Generator - Create YC SAFEs | VentureCounsel.AI',
    description: 'Generate market-standard SAFE agreements with side letters in minutes. Based on official YC templates.',
    type: 'website',
  },
};

export default function SafeGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
