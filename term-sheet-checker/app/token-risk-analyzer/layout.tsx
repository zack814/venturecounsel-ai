import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Token Securities Risk Analyzer | VentureCounsel.AI',
  description:
    'Analyze your crypto token against the Howey test and U.S. securities law frameworks. Get a comprehensive risk assessment with actionable mitigations before launch.',
  openGraph: {
    title: 'Token Securities Risk Analyzer | VentureCounsel.AI',
    description:
      'Free tool to analyze token projects for securities law compliance risk under the Howey test.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Token Securities Risk Analyzer',
    description:
      'Analyze your crypto token against the Howey test and U.S. securities frameworks.',
  },
};

export default function TokenRiskAnalyzerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
