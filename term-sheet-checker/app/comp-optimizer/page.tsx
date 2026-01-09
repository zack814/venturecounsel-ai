'use client';

import { Wizard } from '@/components/comp-optimizer/wizard/Wizard';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function CompOptimizerPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <main className="pt-16 flex-grow">
        <Wizard />
      </main>
      <Footer />
    </div>
  );
}
