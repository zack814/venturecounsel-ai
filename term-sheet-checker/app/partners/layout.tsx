import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partner Programs | Accelerators, VCs & Law Firms | VentureCounsel.AI',
  description: 'Partner with VentureCounsel.AI. We offer free Pro access for accelerator cohorts, portfolio company support for VCs, and white-label solutions for law firms.',
  keywords: ['venturecounsel partners', 'accelerator partnership', 'VC partnership', 'law firm partnership', 'startup ecosystem'],
  openGraph: {
    title: 'Partner Programs | VentureCounsel.AI',
    description: 'Partnership programs for accelerators, VCs, law firms, and founder communities.',
    type: 'website',
  },
};

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
