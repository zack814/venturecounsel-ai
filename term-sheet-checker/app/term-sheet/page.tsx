'use client';

import { useState } from 'react';
import { IntakeContext, AnalysisResponse } from '@/lib/types';
import IntakeForm from '@/components/IntakeForm';
import Report from '@/components/Report';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function TermSheetPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (termSheetText: string, context: IntakeContext) => {
    setIsAnalyzing(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          termSheetText,
          context,
        }),
      });

      const data: AnalysisResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      if (data.success && data.report) {
        setReport(data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4 sm:px-6">
        {!report ? (
          <>
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full mb-6">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="text-blue-900 font-semibold text-xs uppercase tracking-wide">Term Sheet Reality Checker</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                Get a market-calibrated reality check on your term sheet
              </h1>

              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Upload or paste your term sheet and get an instant assessment of what&apos;s market vs aggressive vs deal-killing&mdash;with specific alternative language and negotiation guidance.
              </p>

              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 max-w-3xl mx-auto">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="text-left text-sm text-amber-900">
                    <p className="font-semibold mb-1">Important Privacy Notice</p>
                    <p className="text-amber-800 leading-relaxed">
                      Do not paste confidential or proprietary information without proper authorization. This tool is for informational analysis only and does not create an attorney-client relationship. VentureCounsel.AI is not liable for any unauthorized disclosure of confidential information. For sensitive term sheets, consult with your legal counsel directly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Intake Form */}
            <IntakeForm onSubmit={handleAnalyze} isLoading={isAnalyzing} />

            {/* Error Display */}
            {error && (
              <div className="max-w-4xl mx-auto mt-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-red-900 mb-1">Analysis Error</p>
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <Report response={report} onReset={handleReset} />
        )}
      </main>

      <Footer />
    </div>
  );
}
