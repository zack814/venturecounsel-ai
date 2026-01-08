'use client';

import { useState } from 'react';
import { ScoredTerm } from '@/lib/types';

interface TermsTableProps {
  scoredTerms: ScoredTerm[];
}

export default function TermsTable({ scoredTerms }: TermsTableProps) {
  const [sortBy, setSortBy] = useState<'severity' | 'type'>('severity');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const sorted = [...scoredTerms].sort((a, b) => {
    if (sortBy === 'severity') {
      return b.severityScore - a.severityScore;
    }
    return a.term.termType.localeCompare(b.term.termType);
  });

  const filtered = filterStatus === 'all'
    ? sorted
    : sorted.filter(t => t.marketStatus === filterStatus);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'market-standard':
        return 'bg-green-100 text-green-900 border-green-300';
      case 'acceptable':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'aggressive':
        return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      case 'red-flag':
        return 'bg-red-100 text-red-900 border-red-300';
      default:
        return 'bg-slate-100 text-slate-900 border-slate-300';
    }
  };

  const getPostureBadge = (posture: string) => {
    switch (posture) {
      case 'push-hard':
        return 'bg-red-500 text-white';
      case 'push-soft':
        return 'bg-yellow-500 text-white';
      case 'concede':
        return 'bg-blue-500 text-white';
      case 'ignore':
        return 'bg-slate-400 text-white';
      default:
        return 'bg-slate-300 text-slate-900';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-8 mb-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">2. Term-by-Term Analysis</h2>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="text-sm font-semibold text-slate-700 mr-2">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
          >
            <option value="severity">Severity (High to Low)</option>
            <option value="type">Term Type (A-Z)</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700 mr-2">Filter:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
          >
            <option value="all">All Terms</option>
            <option value="red-flag">Red Flags Only</option>
            <option value="aggressive">Aggressive Only</option>
            <option value="acceptable">Acceptable Only</option>
            <option value="market-standard">Market Standard Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="space-y-4">
          {filtered.map((scoredTerm, idx) => (
            <div key={idx} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900">{scoredTerm.term.termType}</h3>
                  {scoredTerm.term.sectionReference && (
                    <p className="text-sm text-slate-600">Section: {scoredTerm.term.sectionReference}</p>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(scoredTerm.marketStatus)}`}>
                    {scoredTerm.marketStatus.toUpperCase().replace('-', ' ')}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPostureBadge(scoredTerm.negotiationPosture)}`}>
                    {scoredTerm.negotiationPosture.toUpperCase().replace('-', ' ')}
                  </span>
                  {scoredTerm.isDealKiller && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-600 text-white">
                      DEAL KILLER
                    </span>
                  )}
                </div>
              </div>

              {/* Severity Bar */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-700">Severity:</span>
                  <span className="text-sm text-slate-600">{scoredTerm.severityScore}/100</span>
                </div>
                <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${
                      scoredTerm.severityScore < 25 ? 'bg-green-500' :
                      scoredTerm.severityScore < 50 ? 'bg-blue-500' :
                      scoredTerm.severityScore < 75 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${scoredTerm.severityScore}%` }}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-semibold text-slate-900">What This Is:</p>
                  <p className="text-slate-700">{scoredTerm.explanation}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Practical Impact:</p>
                  <p className="text-slate-700">{scoredTerm.practicalImpact}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Market Comparison:</p>
                  <p className="text-slate-700">{scoredTerm.marketComparison}</p>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <p className="font-semibold text-slate-900">Risk Class: <span className="font-normal text-slate-700">{scoredTerm.riskClass}</span></p>
                  <p className="text-xs text-slate-500 mt-1">Confidence: {Math.round(scoredTerm.confidence * 100)}%</p>
                </div>
              </div>

              {/* Original Clause (if available) */}
              {scoredTerm.term.sourceText && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-semibold text-blue-900 hover:text-blue-700">
                    View Original Clause Text
                  </summary>
                  <div className="mt-2 p-3 bg-slate-50 rounded border border-slate-200 text-xs font-mono text-slate-700">
                    {scoredTerm.term.sourceText}
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-slate-500 py-8">No terms match the current filter.</p>
      )}
    </div>
  );
}
