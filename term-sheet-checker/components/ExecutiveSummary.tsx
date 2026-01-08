'use client';

import { ExecutiveSummary as ExecutiveSummaryType } from '@/lib/types';

interface ExecutiveSummaryProps {
  summary: ExecutiveSummaryType;
}

export default function ExecutiveSummary({ summary }: ExecutiveSummaryProps) {
  const getPostureColor = (posture: string) => {
    switch (posture) {
      case 'founder-favorable':
        return 'bg-green-100 text-green-900 border-green-300';
      case 'balanced':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'investor-leaning':
        return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      case 'investor-heavy':
        return 'bg-red-100 text-red-900 border-red-300';
      default:
        return 'bg-slate-100 text-slate-900 border-slate-300';
    }
  };

  const getPostureLabel = (posture: string) => {
    return posture.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-8 mb-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">1. Executive Summary</h2>

      {/* Overall Posture */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Overall Posture</h3>
        <div className="flex items-center gap-4 flex-wrap">
          <span className={`px-4 py-2 rounded-lg border-2 font-semibold ${getPostureColor(summary.overallPosture)}`}>
            {getPostureLabel(summary.overallPosture)}
          </span>
          <div className="flex-1 min-w-[200px]">
            <div className="bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  summary.overallPostureScore < 25 ? 'bg-green-500' :
                  summary.overallPostureScore < 50 ? 'bg-blue-500' :
                  summary.overallPostureScore < 75 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${summary.overallPostureScore}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Score: {summary.overallPostureScore}/100 (0 = founder-favorable, 100 = investor-heavy)
            </p>
          </div>
        </div>
      </div>

      {/* Deal Killer Alert */}
      {summary.dealKillerPresent && (
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-bold text-red-900 text-lg mb-1">DEAL KILLER DETECTED</p>
              <p className="text-red-800 font-semibold">Do not sign without addressing these terms:</p>
              <ul className="list-disc list-inside text-red-800 mt-2 space-y-1">
                {summary.dealKillerTerms?.map((term, idx) => (
                  <li key={idx}>{term}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Top Issues */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Top Issues (by severity)</h3>
        <div className="space-y-3">
          {summary.topIssues.map((issue, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {idx + 1}
              </span>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{issue.termType}</p>
                <p className="text-sm text-slate-700 mt-1">{issue.summary}</p>
                <div className="mt-2 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${issue.severity}%` }}
                  />
                </div>
                <p className="text-xs text-slate-600 mt-1">Severity: {issue.severity}/100</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* If You Only Negotiate 3 Things */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">If You Only Negotiate 3 Things:</h3>
        <div className="bg-blue-50 border-l-4 border-blue-900 p-4 rounded-r-lg">
          <ol className="list-decimal list-inside space-y-2 text-slate-900">
            {summary.negotiationPriorities.map((priority, idx) => (
              <li key={idx} className="font-medium">{priority}</li>
            ))}
          </ol>
        </div>
      </div>

      {/* Fake Issues (Don't Waste Time On) */}
      {summary.fakeIssues.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Biggest Fake Issues (Don't waste time negotiating):</h3>
          <div className="bg-slate-50 border-l-4 border-slate-400 p-4 rounded-r-lg">
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              {summary.fakeIssues.map((issue, idx) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
