'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SafeWizard } from '@/components/safe-generator/wizard/SafeWizard';

export default function SafeGeneratorPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navigation />

      <main className="pt-24 pb-16 px-4 sm:px-6 flex-grow">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full mb-4">
              <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
              <span className="text-amber-900 font-semibold text-xs uppercase tracking-wide">SAFE Generator</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Generate Your SAFE Agreement
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Create market-standard SAFE documents based on Y Combinator templates.
              We&apos;ll guide you through each decision with market context and best practices.
            </p>
          </div>

          {/* Wizard */}
          <SafeWizard />
        </div>
      </main>

      <Footer />
    </div>
  );
}
