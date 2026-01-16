'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadFromSession } from '@/components/offer-evaluator/wizard/OfferEvaluatorContext';
import { AnalysisDashboard } from '@/components/offer-evaluator/results/AnalysisDashboard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import type { OfferEvaluatorState } from '@/lib/offer-evaluator-schemas';

export default function OfferEvaluatorResultsPage() {
  const router = useRouter();
  const [state, setState] = useState<OfferEvaluatorState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedState = loadFromSession();
    if (savedState) {
      setState(savedState as OfferEvaluatorState);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navigation />
        <main className="pt-16 flex-grow flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-slate-600">Analyzing your offer...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navigation />
        <main className="pt-16 flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <h1 className="text-xl font-semibold text-slate-900 mb-4">No Offer Data Found</h1>
            <p className="text-slate-600 mb-6">
              It looks like you haven&apos;t entered your offer details yet. Please complete the wizard first.
            </p>
            <button
              onClick={() => router.push('/offer-evaluator')}
              className="px-6 py-3 bg-navy-700 text-white rounded-lg hover:bg-navy-800 transition-colors"
            >
              Start Offer Evaluation
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />
      <main className="pt-16 flex-grow">
        <AnalysisDashboard state={state} />
      </main>
      <Footer />
    </div>
  );
}
