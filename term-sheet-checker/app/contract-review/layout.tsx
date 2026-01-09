import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Contract Review | Free Contract Analysis | VentureCounsel.AI',
  description: 'Get instant AI-powered analysis of any contract. Identify risks, understand complex clauses in plain English, and get specific redline suggestions. Free for founders.',
  keywords: ['contract review', 'AI contract analysis', 'contract review tool', 'NDA review', 'vendor agreement', 'contract risk'],
  openGraph: {
    title: 'AI Contract Review - Instant Analysis | VentureCounsel.AI',
    description: 'Upload any contract and get instant risk identification, plain-English explanations, and redline suggestions.',
    type: 'website',
  },
};

export default function ContractReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
