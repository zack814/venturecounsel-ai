'use client';

import { ResultsDashboard } from '@/components/comp-optimizer/results/ResultsDashboard';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function CompOptimizerResultsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />
      <main className="pt-16 flex-grow">
        <ResultsDashboard />
      </main>
      <Footer />
    </div>
  );
}
