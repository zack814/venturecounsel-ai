import type { Metadata } from "next";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Term Sheet Reality Checker | VentureCounsel.AI",
  description: "Upload or paste a term sheet and get a market-calibrated, context-sensitive assessment of what's market vs aggressive vs deal-killing.",
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
