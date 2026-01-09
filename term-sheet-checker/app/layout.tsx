import type { Metadata } from "next";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "VentureCounsel.AI | AI Legal Tools for Startup Founders",
  description: "Free AI-powered legal tools for founders. Analyze term sheets, generate SAFEs, optimize compensation, and review contracts. Used by 2,500+ founders backed by YC, a16z, and Techstars.",
  keywords: ['startup legal tools', 'term sheet checker', 'SAFE generator', 'AI legal', 'founder tools', 'venture capital', 'fundraising'],
  authors: [{ name: 'VentureCounsel.AI' }],
  openGraph: {
    title: 'VentureCounsel.AI | AI Legal Tools for Startup Founders',
    description: 'Free AI-powered legal tools for founders. Analyze term sheets, generate SAFEs, optimize compensation, and review contracts.',
    url: 'https://venturecounsel.ai',
    siteName: 'VentureCounsel.AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VentureCounsel.AI | AI Legal Tools for Startup Founders',
    description: 'Free AI-powered legal tools for founders. Analyze term sheets, generate SAFEs, and review contracts.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-slate-900">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ErrorBoundary>
          <main id="main-content">
            {children}
          </main>
        </ErrorBoundary>
      </body>
    </html>
  );
}
