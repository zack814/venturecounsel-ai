'use client';

import { useState } from 'react';
import { ClauseSuggestion } from '@/lib/types';

interface ClauseSuggestionsProps {
  suggestions: ClauseSuggestion[];
}

export default function ClauseSuggestions({ suggestions }: ClauseSuggestionsProps) {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-8 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Alternative Clause Language</h2>
        <p className="text-slate-600">No problematic clauses requiring alternative language. Your term sheet terms are generally acceptable!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-8 mb-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">4. Alternative Clause Language</h2>
      <p className="text-slate-600 mb-6">Copy-paste ready alternatives for problematic clauses:</p>

      <div className="space-y-6">
        {suggestions.map((suggestion, idx) => (
          <div key={idx} className="border border-slate-200 rounded-lg p-5 bg-slate-50">
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900 mb-1">{suggestion.termType}</h3>
              {suggestion.sectionReference && (
                <p className="text-sm text-slate-600">Section: {suggestion.sectionReference}</p>
              )}
            </div>

            {/* Issue */}
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r">
              <p className="font-semibold text-red-900 text-sm mb-1">Issue:</p>
              <p className="text-red-800 text-sm">{suggestion.issue}</p>
            </div>

            {/* Original Clause */}
            {suggestion.originalClause && (
              <details className="mb-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-700 hover:text-slate-900">
                  View Original Clause
                </summary>
                <div className="mt-2 p-3 bg-white rounded border border-slate-200 text-xs font-mono text-slate-700">
                  {suggestion.originalClause}
                </div>
              </details>
            )}

            {/* Primary Suggestion */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">Primary Suggestion</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    suggestion.primarySuggestion.founderFriendliness === 'highly-favorable' ? 'bg-green-100 text-green-900' :
                    suggestion.primarySuggestion.founderFriendliness === 'balanced' ? 'bg-blue-100 text-blue-900' :
                    'bg-yellow-100 text-yellow-900'
                  }`}>
                    {suggestion.primarySuggestion.founderFriendliness.replace('-', ' ')}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(suggestion.primarySuggestion.language, `primary-${idx}`)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded transition-colors"
                >
                  {copiedIndex === `primary-${idx}` ? (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="p-3 bg-white rounded border border-slate-300 text-sm font-mono text-slate-800 whitespace-pre-wrap mb-2">
                {suggestion.primarySuggestion.language}
              </div>
              <p className="text-sm text-slate-700 italic">{suggestion.primarySuggestion.rationale}</p>
            </div>

            {/* Fallback Suggestion */}
            {suggestion.fallbackSuggestion && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Fallback (if investor pushes back)</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      suggestion.fallbackSuggestion.founderFriendliness === 'highly-favorable' ? 'bg-green-100 text-green-900' :
                      suggestion.fallbackSuggestion.founderFriendliness === 'balanced' ? 'bg-blue-100 text-blue-900' :
                      'bg-yellow-100 text-yellow-900'
                    }`}>
                      {suggestion.fallbackSuggestion.founderFriendliness.replace('-', ' ')}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(suggestion.fallbackSuggestion!.language, `fallback-${idx}`)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white text-xs font-semibold rounded transition-colors"
                  >
                    {copiedIndex === `fallback-${idx}` ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 bg-white rounded border border-slate-300 text-sm font-mono text-slate-800 whitespace-pre-wrap mb-2">
                  {suggestion.fallbackSuggestion.language}
                </div>
                <p className="text-sm text-slate-700 italic">{suggestion.fallbackSuggestion.rationale}</p>
              </div>
            )}

            {/* Negotiation Tips */}
            {suggestion.negotiationTips && suggestion.negotiationTips.length > 0 && (
              <div className="mb-3">
                <p className="font-semibold text-slate-900 text-sm mb-2">Negotiation Tips:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                  {suggestion.negotiationTips.filter(tip => tip).map((tip, tipIdx) => (
                    <li key={tipIdx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Red Flags */}
            {suggestion.redFlags && suggestion.redFlags.length > 0 && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r">
                <p className="font-semibold text-red-900 text-sm mb-1">Watch for in investor's counter:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-800">
                  {suggestion.redFlags.map((flag, flagIdx) => (
                    <li key={flagIdx}>{flag}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
