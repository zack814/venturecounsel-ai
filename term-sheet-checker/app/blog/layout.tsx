import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Founder Knowledge Base | Startup Legal Guides | VentureCounsel.AI',
  description: 'Practical guides on term sheets, SAFEs, fundraising, and startup legal matters. No fluff, no legalese. Written for first-time founders.',
  keywords: ['startup legal guide', 'term sheet guide', 'SAFE guide', 'fundraising guide', 'founder resources', 'startup advice'],
  openGraph: {
    title: 'Founder Knowledge Base | VentureCounsel.AI',
    description: 'Practical guides on term sheets, SAFEs, fundraising, and startup legal matters for founders.',
    type: 'website',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
