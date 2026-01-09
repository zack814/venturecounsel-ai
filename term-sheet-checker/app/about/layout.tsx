import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About VentureCounsel.AI | AI Legal Tools for Founders',
  description: 'VentureCounsel.AI helps first-time founders understand term sheets, SAFEs, and contracts. Built to level the playing field against experienced investors.',
  keywords: ['about venturecounsel', 'legal tech startup', 'AI legal tools', 'founder tools', 'startup legal'],
  openGraph: {
    title: 'About VentureCounsel.AI',
    description: 'Built to level the playing field for first-time founders navigating fundraising.',
    type: 'website',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
