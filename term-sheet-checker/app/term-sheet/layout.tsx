import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Term Sheet Checker | Free AI Analysis | VentureCounsel.AI',
  description: 'Get instant AI analysis of your startup term sheet. Identify aggressive terms, get market benchmarks, and receive specific negotiation language. Free for founders.',
  keywords: ['term sheet checker', 'term sheet analysis', 'startup term sheet', 'VC term sheet', 'term sheet review', 'founder tools'],
  openGraph: {
    title: 'Term Sheet Checker - AI-Powered Analysis | VentureCounsel.AI',
    description: 'Upload your term sheet and get instant market-calibrated analysis. Know what\'s standard vs aggressive before you sign.',
    type: 'website',
  },
};

export default function TermSheetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
