'use client';

import { OfferWizard } from '@/components/offer-evaluator/wizard/OfferWizard';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function OfferEvaluatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <main className="pt-16 flex-grow">
        <OfferWizard />
      </main>
      <Footer />
    </div>
  );
}
