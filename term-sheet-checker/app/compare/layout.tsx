import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VentureCounsel.AI vs ChatGPT vs Lawyers | Comparison',
  description: 'See how VentureCounsel.AI compares to ChatGPT and traditional lawyers for term sheet analysis. Market benchmarks, no hallucinations, specific redlines.',
  keywords: ['venturecounsel vs chatgpt', 'AI legal tools comparison', 'term sheet analysis comparison', 'legal AI'],
  openGraph: {
    title: 'VentureCounsel.AI vs Alternatives',
    description: 'Compare VentureCounsel.AI to ChatGPT and traditional lawyers for startup legal analysis.',
    type: 'website',
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
