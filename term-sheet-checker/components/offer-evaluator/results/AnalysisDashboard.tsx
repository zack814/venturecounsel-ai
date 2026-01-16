'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { OfferEvaluatorState } from '@/lib/offer-evaluator-schemas';
import {
  scoreCashOffer,
  scoreEquityOffer,
  scoreOfferTerms,
  calculateOverallScore,
  getMarketBenchmarks,
} from '@/services/offerScorer';
import { generateOfferFlags, generateMissingDataWarnings, categorizeFlags } from '@/services/offerFlags';
import { calculateExitScenarios, calculateProbabilityWeightedValue } from '@/services/exitScenarios';
import { generateNegotiationSuggestions, generateCounterOfferEmail, generateTalkingPoints } from '@/services/negotiationGenerator';
import { printReport } from '@/services/pdfExport';
import {
  JOB_FAMILY_LABELS,
  JOB_LEVEL_LABELS,
  STAGE_LABELS,
  SCORE_CATEGORY_COLORS,
  FLAG_SEVERITY_COLORS,
} from '@/lib/offer-evaluator-schemas';
import type {
  EmployeeBackground,
  CompanyDetails,
  CashOffer,
  EquityOffer,
  NegotiationContext as NegotiationContextType,
} from '@/lib/offer-evaluator-schemas';
import {
  BarChart3,
  MessageSquare,
  TrendingUp,
  FileText,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Info,
  Copy,
  Download,
  Pencil,
  ExternalLink,
} from 'lucide-react';

interface AnalysisDashboardProps {
  state: OfferEvaluatorState;
}

export function AnalysisDashboard({ state }: AnalysisDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'analysis' | 'negotiation' | 'scenarios' | 'documents'>('analysis');
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Extract state
  const employeeBackground = state.employeeBackground as EmployeeBackground;
  const companyDetails = state.companyDetails as CompanyDetails;
  const cashOffer = state.cashOffer as CashOffer;
  const equityOffer = state.equityOffer as EquityOffer;
  const negotiationContext = state.negotiationContext as NegotiationContextType;

  // Calculate scores
  const cashScore = useMemo(() =>
    scoreCashOffer(cashOffer, employeeBackground, companyDetails),
    [cashOffer, employeeBackground, companyDetails]
  );

  const equityScore = useMemo(() =>
    scoreEquityOffer(equityOffer, companyDetails, employeeBackground),
    [equityOffer, companyDetails, employeeBackground]
  );

  const termsScore = useMemo(() =>
    scoreOfferTerms(equityOffer),
    [equityOffer]
  );

  const overallScore = useMemo(() =>
    calculateOverallScore(cashScore, equityScore, termsScore, employeeBackground),
    [cashScore, equityScore, termsScore, employeeBackground]
  );

  const benchmarks = useMemo(() =>
    getMarketBenchmarks(employeeBackground, companyDetails),
    [employeeBackground, companyDetails]
  );

  // Generate flags
  const flags = useMemo(() =>
    generateOfferFlags(equityOffer, cashOffer, companyDetails, employeeBackground, cashScore, equityScore, termsScore),
    [equityOffer, cashOffer, companyDetails, employeeBackground, cashScore, equityScore, termsScore]
  );

  const { positiveFlags, warningFlags, criticalFlags } = useMemo(() =>
    categorizeFlags(flags),
    [flags]
  );

  const missingDataWarnings = useMemo(() =>
    generateMissingDataWarnings(equityOffer),
    [equityOffer]
  );

  // Exit scenarios
  const exitScenarios = useMemo(() =>
    calculateExitScenarios(equityOffer, companyDetails),
    [equityOffer, companyDetails]
  );

  const probabilityWeightedValue = useMemo(() =>
    calculateProbabilityWeightedValue(exitScenarios),
    [exitScenarios]
  );

  // Negotiation suggestions
  const suggestions = useMemo(() =>
    generateNegotiationSuggestions(equityOffer, cashOffer, companyDetails, employeeBackground, negotiationContext, cashScore, equityScore, termsScore),
    [equityOffer, cashOffer, companyDetails, employeeBackground, negotiationContext, cashScore, equityScore, termsScore]
  );

  const counterOfferEmail = useMemo(() =>
    generateCounterOfferEmail(suggestions, companyDetails, employeeBackground, negotiationContext),
    [suggestions, companyDetails, employeeBackground, negotiationContext]
  );

  const talkingPoints = useMemo(() =>
    generateTalkingPoints(suggestions, negotiationContext, cashScore, equityScore),
    [suggestions, negotiationContext, cashScore, equityScore]
  );

  const categoryColors = SCORE_CATEGORY_COLORS[overallScore.category];

  const copyEmail = () => {
    navigator.clipboard.writeText(counterOfferEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const tabs = [
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'negotiation', label: 'Negotiation', icon: MessageSquare },
    { id: 'scenarios', label: 'Scenarios', icon: TrendingUp },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Offer Analysis</h1>
            <p className="text-slate-600">
              {JOB_LEVEL_LABELS[employeeBackground.jobLevel || ''] || 'Role'} {JOB_FAMILY_LABELS[employeeBackground.jobFamily || ''] || ''} at {companyDetails.companyName || 'a'} {STAGE_LABELS[companyDetails.stage || ''] || 'startup'}
            </p>
          </div>
          <button
            onClick={() => router.push('/offer-evaluator')}
            className="flex items-center gap-2 text-sm text-navy-600 hover:text-navy-700"
          >
            <Pencil className="h-4 w-4" />
            Edit Inputs
          </button>
        </div>

        {/* Overall Score Card */}
        <div className={`${categoryColors.bg} ${categoryColors.border} border rounded-xl p-6 mb-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className={`text-5xl font-bold ${categoryColors.text}`}>
                  {overallScore.score}
                </div>
                <div className="text-sm text-slate-500 mt-1">out of 100</div>
              </div>
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${categoryColors.bg} ${categoryColors.text} ${categoryColors.border} border`}>
                  {overallScore.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <h2 className="text-xl font-semibold text-slate-900 mt-2">{overallScore.headline}</h2>
                <p className="text-slate-600 mt-1">{overallScore.paragraph}</p>
              </div>
            </div>
            <div className="hidden md:flex gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{cashScore.score}</div>
                <div className="text-xs text-slate-500">Cash</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{equityScore.score}</div>
                <div className="text-xs text-slate-500">Equity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{termsScore.score}</div>
                <div className="text-xs text-slate-500">Terms</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 uppercase">Year 1 Cash</p>
            <p className="text-xl font-bold text-slate-900">
              ${((cashOffer.baseSalary || 0) + (cashOffer.bonusTargetAmount || 0) + (cashOffer.signingBonus || 0)).toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">{cashScore.baseSalaryVsMedian >= 0 ? '+' : ''}{cashScore.baseSalaryVsMedian}% vs median</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 uppercase">Ownership</p>
            <p className="text-xl font-bold text-slate-900">
              {equityScore.percentOfCompany ? `${equityScore.percentOfCompany.toFixed(3)}%` : 'Unknown'}
            </p>
            <p className="text-xs text-slate-500">{equityOffer.shareCount?.toLocaleString() || '?'} shares</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 uppercase">Paper Value</p>
            <p className="text-xl font-bold text-emerald-600">
              {equityScore.currentPaperValue ? `$${equityScore.currentPaperValue.toLocaleString()}` : 'Unknown'}
            </p>
            <p className="text-xs text-slate-500">at last round</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 uppercase">Expected Value</p>
            <p className="text-xl font-bold text-slate-900">
              ${probabilityWeightedValue.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">probability-weighted</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-6">
          <nav className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 py-3 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-navy-700 text-navy-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {/* Score Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cash Score */}
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">Cash Compensation</h3>
                  <span className="text-2xl font-bold text-slate-900">{cashScore.score}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                  <div className="bg-navy-600 h-2 rounded-full" style={{ width: `${cashScore.score}%` }} />
                </div>
                <p className="text-sm text-slate-600">{cashScore.verdict}</p>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    {cashScore.percentile}th percentile • {cashScore.baseSalaryVsMedian >= 0 ? '+' : ''}{cashScore.baseSalaryVsMedian}% vs median
                  </p>
                </div>
              </div>

              {/* Equity Score */}
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">Equity Grant</h3>
                  <span className="text-2xl font-bold text-slate-900">{equityScore.score}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                  <div className="bg-navy-600 h-2 rounded-full" style={{ width: `${equityScore.score}%` }} />
                </div>
                <p className="text-sm text-slate-600">{equityScore.verdict}</p>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    {equityScore.percentile !== undefined ? `${equityScore.percentile}th percentile` : 'Percentile unknown'}
                    {equityScore.equityVsMedian !== undefined && ` • ${equityScore.equityVsMedian >= 0 ? '+' : ''}${equityScore.equityVsMedian}% vs median`}
                  </p>
                </div>
              </div>

              {/* Terms Score */}
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">Equity Terms</h3>
                  <span className="text-2xl font-bold text-slate-900">{termsScore.score}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                  <div className="bg-navy-600 h-2 rounded-full" style={{ width: `${termsScore.score}%` }} />
                </div>
                <p className="text-sm text-slate-600">{termsScore.verdict}</p>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    Vesting: {termsScore.vestingScore} • Exercise: {termsScore.exerciseScore} • Accel: {termsScore.accelerationScore}
                  </p>
                </div>
              </div>
            </div>

            {/* Benchmark Comparison */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Market Benchmarks</h3>
              <div className="space-y-4">
                {/* Salary Benchmark */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Base Salary</span>
                    <span className="font-medium">${(cashOffer.baseSalary || 0).toLocaleString()}</span>
                  </div>
                  <div className="relative h-6 bg-slate-100 rounded">
                    <div className="absolute left-1/4 top-0 h-full w-px bg-slate-300" />
                    <div className="absolute left-1/2 top-0 h-full w-px bg-slate-400" />
                    <div className="absolute left-3/4 top-0 h-full w-px bg-slate-300" />
                    <div
                      className="absolute top-1 h-4 w-4 -ml-2 bg-navy-600 rounded-full border-2 border-white shadow"
                      style={{ left: `${Math.min(100, Math.max(0, cashScore.percentile))}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>P25: ${benchmarks.salary.p25.toLocaleString()}</span>
                    <span>P50: ${benchmarks.salary.p50.toLocaleString()}</span>
                    <span>P75: ${benchmarks.salary.p75.toLocaleString()}</span>
                  </div>
                </div>

                {/* Equity Benchmark */}
                {benchmarks.equityBps.p50 > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Equity Grant</span>
                      <span className="font-medium">{equityScore.percentOfCompany?.toFixed(3) || '?'}%</span>
                    </div>
                    <div className="relative h-6 bg-slate-100 rounded">
                      <div className="absolute left-1/4 top-0 h-full w-px bg-slate-300" />
                      <div className="absolute left-1/2 top-0 h-full w-px bg-slate-400" />
                      <div className="absolute left-3/4 top-0 h-full w-px bg-slate-300" />
                      {equityScore.percentile !== undefined && (
                        <div
                          className="absolute top-1 h-4 w-4 -ml-2 bg-navy-600 rounded-full border-2 border-white shadow"
                          style={{ left: `${Math.min(100, Math.max(0, equityScore.percentile))}%` }}
                        />
                      )}
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>P25: {benchmarks.equityPercent.p25.toFixed(3)}%</span>
                      <span>P50: {benchmarks.equityPercent.p50.toFixed(3)}%</span>
                      <span>P75: {benchmarks.equityPercent.p75.toFixed(3)}%</span>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-4">Source: {benchmarks.source}</p>
            </div>

            {/* Flags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Positive Flags */}
              {positiveFlags.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    Positive Findings
                  </h3>
                  <div className="space-y-3">
                    {positiveFlags.map((flag) => (
                      <div key={flag.id} className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                        <p className="font-medium text-emerald-800">{flag.title}</p>
                        <p className="text-sm text-emerald-700 mt-1">{flag.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warning/Critical Flags */}
              {(warningFlags.length > 0 || criticalFlags.length > 0) && (
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Areas of Concern
                  </h3>
                  <div className="space-y-3">
                    {criticalFlags.map((flag) => (
                      <div key={flag.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="font-medium text-red-800">{flag.title}</p>
                        <p className="text-sm text-red-700 mt-1">{flag.description}</p>
                        {flag.recommendation && (
                          <p className="text-sm text-red-600 mt-2 font-medium">
                            Recommendation: {flag.recommendation}
                          </p>
                        )}
                      </div>
                    ))}
                    {warningFlags.map((flag) => (
                      <div key={flag.id} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="font-medium text-amber-800">{flag.title}</p>
                        <p className="text-sm text-amber-700 mt-1">{flag.description}</p>
                        {flag.recommendation && (
                          <p className="text-sm text-amber-600 mt-2">
                            {flag.recommendation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Missing Data */}
            {missingDataWarnings.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  Information to Request From Employer
                </h3>
                <div className="space-y-3">
                  {missingDataWarnings.map((warning) => (
                    <div key={warning.field} className="bg-white rounded-lg p-3 border border-blue-200">
                      <p className="font-medium text-blue-900">{warning.displayName}</p>
                      <p className="text-sm text-blue-700 mt-1">{warning.impact}</p>
                      <p className="text-sm text-blue-800 mt-2 font-medium">
                        Ask: &quot;{warning.questionToAsk}&quot;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'negotiation' && (
          <div className="space-y-6">
            {/* Top Suggestions */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Negotiation Suggestions</h3>
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion.id}
                    className={`border rounded-lg p-4 ${
                      suggestion.category === 'non-obvious'
                        ? 'border-purple-200 bg-purple-50'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy-100 text-navy-700 text-sm font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-slate-900">{suggestion.title}</h4>
                            {suggestion.category === 'non-obvious' && (
                              <span className="text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full">
                                Non-obvious
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 mt-0.5">
                            {suggestion.currentValue} → <span className="font-medium text-slate-700">{suggestion.suggestedValue}</span>
                          </p>
                          <p className="text-sm text-slate-600 mt-2">{suggestion.rationale}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className={`px-2 py-1 rounded ${
                          suggestion.successLikelihood === 'high' ? 'bg-emerald-100 text-emerald-700' :
                          suggestion.successLikelihood === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {suggestion.successLikelihood} success
                        </span>
                        <span className={`px-2 py-1 rounded ${
                          suggestion.impactLevel === 'high' ? 'bg-blue-100 text-blue-700' :
                          suggestion.impactLevel === 'medium' ? 'bg-slate-100 text-slate-700' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {suggestion.impactLevel} impact
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <p className="text-sm text-slate-700 italic">&quot;{suggestion.suggestedLanguage}&quot;</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Counter-Offer Email */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Counter-Offer Email Template</h3>
                <button
                  onClick={copyEmail}
                  className="flex items-center gap-2 text-sm text-navy-600 hover:text-navy-700"
                >
                  <Copy className="h-4 w-4" />
                  {copiedEmail ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700 whitespace-pre-wrap font-mono overflow-x-auto">
                {counterOfferEmail}
              </pre>
            </div>

            {/* Talking Points */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Talking Points for Negotiation Call</h3>
              <ul className="space-y-2">
                {talkingPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                    <ChevronRight className="h-4 w-4 text-navy-500 mt-0.5 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'scenarios' && (
          <div className="space-y-6">
            {/* Exit Scenarios */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Exit Scenarios</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 px-3 font-medium text-slate-700">Scenario</th>
                      <th className="text-right py-2 px-3 font-medium text-slate-700">Exit Multiple</th>
                      <th className="text-right py-2 px-3 font-medium text-slate-700">Dilution</th>
                      <th className="text-right py-2 px-3 font-medium text-slate-700">Years</th>
                      <th className="text-right py-2 px-3 font-medium text-slate-700">Probability</th>
                      <th className="text-right py-2 px-3 font-medium text-slate-700">Net Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exitScenarios.map((scenario) => (
                      <tr key={scenario.id} className="border-b border-slate-100">
                        <td className="py-3 px-3">
                          <p className="font-medium text-slate-900">{scenario.name}</p>
                          <p className="text-xs text-slate-500">{scenario.description}</p>
                        </td>
                        <td className="text-right py-3 px-3 text-slate-700">{scenario.exitMultiple}x</td>
                        <td className="text-right py-3 px-3 text-slate-700">{scenario.dilutionPercent}%</td>
                        <td className="text-right py-3 px-3 text-slate-700">{scenario.yearsToExit} yrs</td>
                        <td className="text-right py-3 px-3 text-slate-700">{Math.round(scenario.probability * 100)}%</td>
                        <td className="text-right py-3 px-3 font-medium text-slate-900">
                          ${scenario.netEquityValue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50">
                      <td colSpan={5} className="py-3 px-3 font-medium text-slate-900">
                        Probability-Weighted Expected Value
                      </td>
                      <td className="text-right py-3 px-3 font-bold text-emerald-600">
                        ${probabilityWeightedValue.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                Note: These are illustrative scenarios based on historical startup outcomes. Actual results will vary significantly.
              </p>
            </div>

            {/* Tax Considerations */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Tax Considerations
              </h3>
              <ul className="text-sm text-amber-800 space-y-2">
                {equityOffer.equityType === 'iso' && (
                  <>
                    <li>- ISOs can trigger Alternative Minimum Tax (AMT) on the spread at exercise</li>
                    <li>- Hold for 1 year after exercise + 2 years after grant for long-term capital gains</li>
                    <li>- Consider exercising in tranches to manage AMT exposure</li>
                  </>
                )}
                {equityOffer.equityType === 'nso' && (
                  <>
                    <li>- NSOs are taxed as ordinary income on the spread at exercise</li>
                    <li>- Tax withholding is required at exercise</li>
                    <li>- Additional gains after exercise are capital gains</li>
                  </>
                )}
                {equityOffer.earlyExerciseAllowed === 'yes' && (
                  <li>- File 83(b) election within 30 days of early exercise to start capital gains clock</li>
                )}
                <li className="font-medium">- Consult a tax advisor before exercising options</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            {/* Contract Review CTA */}
            <div className="bg-gradient-to-r from-navy-700 to-navy-800 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Review Your Offer Documents</h3>
              <p className="text-navy-100 mb-4">
                Upload your stock option agreement, CIAA, or employment agreement to check for red flags and off-market terms.
              </p>
              <Link
                href="/contract-review"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-navy-700 rounded-lg font-medium hover:bg-navy-50 transition-colors"
              >
                Review Documents
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>

            {/* What to Look For */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-4">What to Look For in Your Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2">Stock Option Agreement</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>- Exercise period after termination</li>
                    <li>- Acceleration provisions</li>
                    <li>- Early exercise rights</li>
                    <li>- Repurchase rights</li>
                    <li>- Change of control provisions</li>
                  </ul>
                </div>
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2">CIAA / IP Agreement</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>- Scope of IP assignment</li>
                    <li>- Non-compete clauses</li>
                    <li>- Non-solicitation terms</li>
                    <li>- Pre-existing IP carve-outs</li>
                    <li>- Confidentiality obligations</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Download Report */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-medium text-slate-700">Download Analysis Report</p>
                    <p className="text-sm text-slate-500">Export your full analysis to share with advisors</p>
                  </div>
                </div>
                <button
                  onClick={() => printReport({
                    employeeBackground,
                    companyDetails,
                    cashOffer,
                    equityOffer,
                    negotiationContext,
                    cashScore,
                    equityScore,
                    termsScore,
                    overallScore,
                    flags,
                    exitScenarios,
                    probabilityWeightedValue,
                    suggestions,
                    missingDataWarnings,
                    benchmarks,
                  })}
                  className="px-4 py-2 bg-navy-700 text-white rounded-lg text-sm font-medium hover:bg-navy-800 transition-colors flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 text-center text-xs text-slate-500">
          <p>
            This analysis is for informational purposes only and does not constitute legal, tax, or financial advice.
            Consult with qualified professionals before making decisions about employment offers.
          </p>
        </div>
      </div>
    </div>
  );
}
