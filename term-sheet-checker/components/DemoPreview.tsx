'use client';

import { useState } from 'react';
import Link from 'next/link';

const sampleOutputs = [
  {
    id: 'term-sheet-analysis',
    title: 'Term Sheet Analysis',
    description: 'See how we analyze a real Series Seed term sheet',
    category: 'Term Sheet Checker',
    color: 'blue',
    input: {
      type: 'Series Seed Term Sheet',
      investor: 'Tier 1 VC',
      stage: 'Seed',
      amount: '$2.5M'
    },
    output: {
      summary: {
        score: 72,
        verdict: 'Mostly Market',
        flags: 3,
        concerns: 1
      },
      terms: [
        { name: 'Valuation Cap', value: '$12M', assessment: 'Market', note: 'Typical for seed with $2.5M raise' },
        { name: 'Pro-Rata Rights', value: 'Yes (Major Investors)', assessment: 'Market', note: 'Standard for lead investors' },
        { name: 'Board Seat', value: 'Yes', assessment: 'Aggressive', note: 'Unusual at seed stage - consider observer seat instead' },
        { name: 'Information Rights', value: 'Quarterly + Annual', assessment: 'Market', note: 'Standard reporting cadence' },
        { name: 'Participation', value: '1x Non-Participating', assessment: 'Founder Favorable', note: 'Better than participating preferred' }
      ],
      negotiation: [
        { priority: 'High', item: 'Negotiate board seat to observer rights', rationale: 'Preserve control at seed stage' },
        { priority: 'Medium', item: 'Add pro-rata cap at 2x', rationale: 'Prevent over-concentration in future rounds' }
      ]
    }
  },
  {
    id: 'safe-generator',
    title: 'SAFE Generator',
    description: 'Generate market-standard SAFEs with side letters',
    category: 'SAFE Generator',
    color: 'amber',
    input: {
      type: 'Post-Money SAFE',
      cap: '$10M',
      investment: '$500K',
      sideLetters: 'Pro-rata, MFN'
    },
    output: {
      documents: [
        { name: 'SAFE Agreement', format: '.docx', status: 'Ready' },
        { name: 'Pro-Rata Side Letter', format: '.docx', status: 'Ready' },
        { name: 'MFN Side Letter', format: '.docx', status: 'Ready' }
      ],
      safeTerms: [
        { label: 'SAFE Type', value: 'Post-Money with Cap' },
        { label: 'Valuation Cap', value: '$10,000,000' },
        { label: 'Discount', value: 'None' },
        { label: 'Pro-Rata Rights', value: 'Included via side letter' }
      ],
      notes: [
        'Uses YC standard post-money SAFE template',
        'Pro-rata calculated on as-converted basis'
      ]
    }
  },
  {
    id: 'comp-package',
    title: 'Compensation Package',
    description: 'Sample output for a Senior Engineer hire',
    category: 'Comp Optimizer',
    color: 'green',
    input: {
      role: 'Senior Software Engineer',
      level: 'L5',
      location: 'San Francisco',
      stage: 'Series A'
    },
    output: {
      packages: [
        {
          name: 'Cash Heavy',
          salary: '$195,000',
          equity: '0.15%',
          totalComp: '$245,000',
          riskLevel: 'Low'
        },
        {
          name: 'Balanced',
          salary: '$175,000',
          equity: '0.25%',
          totalComp: '$275,000',
          riskLevel: 'Medium'
        },
        {
          name: 'Equity Heavy',
          salary: '$155,000',
          equity: '0.40%',
          totalComp: '$315,000',
          riskLevel: 'High'
        }
      ],
      riskFlags: [
        '409A valuation required before grant',
        'Consider 83(b) election timing'
      ]
    }
  },
  {
    id: 'contract-review',
    title: 'Contract Review',
    description: 'NDA analysis with risk flags',
    category: 'Contract Review',
    color: 'purple',
    input: {
      type: 'Mutual NDA',
      counterparty: 'Enterprise Customer',
      purpose: 'Pilot Discussion'
    },
    output: {
      risks: [
        { severity: 'High', clause: 'Non-Compete (Section 7)', issue: '2-year non-compete is excessive for NDA' },
        { severity: 'Medium', clause: 'Definition of Confidential Information', issue: 'Overly broad - includes "all information"' },
        { severity: 'Low', clause: 'Term (Section 12)', issue: '5-year term longer than typical 2-3 years' }
      ],
      suggestions: [
        'Strike non-compete clause entirely',
        'Add carve-outs for publicly available information',
        'Reduce term to 3 years or add annual renewal'
      ]
    }
  }
];

interface DemoPreviewProps {
  className?: string;
}

export default function DemoPreview({ className = '' }: DemoPreviewProps) {
  const [activeDemo, setActiveDemo] = useState(sampleOutputs[0]);

  return (
    <div className={`${className}`}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">See It in Action</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Explore sample outputs from our tools. Real analysis, anonymized data.
        </p>
      </div>

      {/* Demo Selector */}
      <div className="flex justify-start sm:justify-center gap-2 sm:gap-3 mb-8 overflow-x-auto pb-2 px-1 -mx-1 scrollbar-hide">
        {sampleOutputs.map((demo) => (
          <button
            key={demo.id}
            onClick={() => setActiveDemo(demo)}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
              activeDemo.id === demo.id
                ? demo.color === 'blue' ? 'bg-blue-600 text-white' :
                  demo.color === 'amber' ? 'bg-amber-500 text-white' :
                  demo.color === 'green' ? 'bg-green-600 text-white' :
                  'bg-purple-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {demo.category}
          </button>
        ))}
      </div>

      {/* Demo Content */}
      <div className="bg-slate-50 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className={`px-6 py-4 ${
          activeDemo.color === 'blue' ? 'bg-blue-600' :
          activeDemo.color === 'amber' ? 'bg-amber-500' :
          activeDemo.color === 'green' ? 'bg-green-600' :
          'bg-purple-600'
        } text-white`}>
          <h3 className="font-bold text-lg">{activeDemo.title}</h3>
          <p className="text-white/80 text-sm">{activeDemo.description}</p>
        </div>

        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Input Section */}
          <div className="p-6">
            <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold">1</span>
              Input
            </h4>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              {Object.entries(activeDemo.input).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-slate-500 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-slate-900 text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Output Section */}
          <div className="p-6">
            <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold">2</span>
              Analysis Output
            </h4>

            {/* Term Sheet Output */}
            {activeDemo.id === 'term-sheet-analysis' && (
              <div className="space-y-4">
                {/* Summary Card */}
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-500 text-sm">Overall Assessment</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        (activeDemo.output.summary?.score ?? 0) >= 70 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {activeDemo.output.summary?.verdict ?? 'Reviewing'}
                      </span>
                      <span className="text-2xl font-bold text-slate-900">{activeDemo.output.summary?.score ?? 0}</span>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-amber-600">{activeDemo.output.summary?.flags ?? 0} flags</span>
                    <span className="text-red-600">{activeDemo.output.summary?.concerns ?? 0} concern</span>
                  </div>
                </div>

                {/* Terms Preview */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Key Terms</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {(activeDemo.output.terms ?? []).slice(0, 3).map((term) => (
                      <div key={term.name} className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{term.name}</p>
                          <p className="text-slate-500 text-xs">{term.value}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          term.assessment === 'Market' ? 'bg-green-100 text-green-700' :
                          term.assessment === 'Founder Favorable' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {term.assessment}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-center">
                    <span className="text-xs text-slate-500">+ 2 more terms in full report</span>
                  </div>
                </div>
              </div>
            )}

            {/* Comp Package Output */}
            {activeDemo.id === 'comp-package' && (
              <div className="space-y-4">
                <div className="grid gap-3">
                  {(activeDemo.output.packages ?? []).map((pkg) => (
                    <div key={pkg.name} className="bg-white rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900">{pkg.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          pkg.riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
                          pkg.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {pkg.riskLevel} Risk
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-slate-500 text-xs">Salary</p>
                          <p className="font-medium text-slate-900">{pkg.salary}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs">Equity</p>
                          <p className="font-medium text-slate-900">{pkg.equity}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs">Total Comp</p>
                          <p className="font-medium text-green-600">{pkg.totalComp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-amber-800 text-xs font-medium mb-1">Risk Flags</p>
                  <ul className="text-amber-700 text-xs space-y-1">
                    {(activeDemo.output.riskFlags ?? []).map((flag, i) => (
                      <li key={i}>• {flag}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* SAFE Generator Output */}
            {activeDemo.id === 'safe-generator' && (
              <div className="space-y-4">
                {/* Documents Ready */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Generated Documents</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {(activeDemo.output.documents ?? []).map((doc, i) => (
                      <div key={i} className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="font-medium text-slate-900 text-sm">{doc.name}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Terms Summary */}
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  {(activeDemo.output.safeTerms ?? []).map((term, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                      <span className="text-slate-500 text-sm">{term.label}</span>
                      <span className="text-slate-900 text-sm font-medium">{term.value}</span>
                    </div>
                  ))}
                </div>
                {/* Notes */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-amber-800 text-xs font-medium mb-1">Notes</p>
                  <ul className="text-amber-700 text-xs space-y-1">
                    {(activeDemo.output.notes ?? []).map((note, i) => (
                      <li key={i}>• {note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Contract Review Output */}
            {activeDemo.id === 'contract-review' && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Risk Assessment</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {(activeDemo.output.risks ?? []).map((risk, i) => (
                      <div key={i} className="px-4 py-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${
                            risk.severity === 'High' ? 'bg-red-500' :
                            risk.severity === 'Medium' ? 'bg-amber-500' :
                            'bg-slate-400'
                          }`} />
                          <span className="font-medium text-slate-900 text-sm">{risk.clause}</span>
                        </div>
                        <p className="text-slate-600 text-xs ml-4">{risk.issue}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-xs font-medium mb-1">Suggested Revisions</p>
                  <ul className="text-blue-700 text-xs space-y-1">
                    {(activeDemo.output.suggestions ?? []).slice(0, 2).map((suggestion, i) => (
                      <li key={i}>• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 text-center">
          <Link
            href={
              activeDemo.color === 'blue' ? '/term-sheet' :
              activeDemo.color === 'amber' ? '/safe-generator' :
              activeDemo.color === 'green' ? '/comp-optimizer' :
              '/contract-review'
            }
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeDemo.color === 'blue' ? 'bg-blue-600 text-white hover:bg-blue-700' :
              activeDemo.color === 'amber' ? 'bg-amber-500 text-white hover:bg-amber-600' :
              activeDemo.color === 'green' ? 'bg-green-600 text-white hover:bg-green-700' :
              'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            Try {activeDemo.category} Now
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="text-slate-500 text-sm mt-2">Free to try. No signup required.</p>
        </div>
      </div>

      {/* Video Demo Link */}
      <div className="mt-8 text-center">
        <button className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="font-medium">Watch 2-minute video walkthrough</span>
        </button>
      </div>
    </div>
  );
}
