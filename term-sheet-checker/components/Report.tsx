'use client';

import { AnalysisResponse } from '@/lib/types';
import ExecutiveSummary from './ExecutiveSummary';
import TermsTable from './TermsTable';
import NegotiationPlan from './NegotiationPlan';
import ClauseSuggestions from './ClauseSuggestions';
import AssumptionsSection from './AssumptionsSection';

interface ReportProps {
  response: AnalysisResponse;
  onReset: () => void;
}

export default function Report({ response, onReset }: ReportProps) {
  if (!response.success || !response.report) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-900 mb-2">Analysis Failed</h2>
          <p className="text-red-800">{response.error || 'An unknown error occurred'}</p>
          <button
            onClick={onReset}
            className="mt-4 px-6 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { report } = response;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-8 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Term Sheet Analysis Report</h1>
            <p className="text-slate-600">
              Analyzed: {new Date(report.analyzedAt).toLocaleString()} •
              Processing time: {(report.processingTimeMs / 1000).toFixed(1)}s
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Context: {report.context.stage} • {report.context.investorType} • {report.context.geography}
            </p>
          </div>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
          >
            Analyze Another
          </button>
        </div>
      </div>

      {/* Executive Summary */}
      <ExecutiveSummary summary={report.executiveSummary} />

      {/* Terms Table */}
      <TermsTable scoredTerms={report.scoredTerms} />

      {/* Negotiation Plan */}
      <NegotiationPlan plan={report.negotiationPlan} />

      {/* Clause Suggestions */}
      <ClauseSuggestions suggestions={report.clauseSuggestions} />

      {/* Assumptions & Confidence */}
      <AssumptionsSection data={report.assumptionsAndConfidence} />

      {/* Footer Action */}
      <div className="mt-8 text-center">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors shadow-lg"
        >
          Analyze Another Term Sheet
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
}
