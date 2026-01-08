'use client';

import React from 'react';
import { useWizard } from '../WizardContext';
import { Select, Input } from '@/components/comp-optimizer/ui/Input';
import type { CompanyStage, GeoMarket, HeadcountRange } from '@/lib/comp-schemas';

const stageOptions = [
  { value: 'pre-seed', label: 'Pre-Seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series-a', label: 'Series A' },
  { value: 'series-b', label: 'Series B' },
  { value: 'series-c+', label: 'Series C+' },
];

const geoOptions = [
  { value: 'sv', label: 'San Francisco / Silicon Valley' },
  { value: 'nyc', label: 'New York City' },
  { value: 'la', label: 'Los Angeles' },
  { value: 'seattle', label: 'Seattle' },
  { value: 'austin', label: 'Austin' },
  { value: 'boston', label: 'Boston' },
  { value: 'denver', label: 'Denver' },
  { value: 'chicago', label: 'Chicago' },
  { value: 'remote-us', label: 'Remote (US)' },
  { value: 'international', label: 'International' },
];

const headcountOptions = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-25', label: '11-25 employees' },
  { value: '26-50', label: '26-50 employees' },
  { value: '51-100', label: '51-100 employees' },
  { value: '101-250', label: '101-250 employees' },
  { value: '250+', label: '250+ employees' },
];

export function Step1Company() {
  const { state, updateCompanyContext } = useWizard();
  const { companyContext } = state;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Company Context</h2>
        <p className="mt-1 text-sm text-slate-600">
          Tell us about your company so we can calibrate compensation to your stage and market.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Select
          label="Company Stage"
          options={stageOptions}
          value={companyContext.stage}
          onChange={(e) => updateCompanyContext({ stage: e.target.value as CompanyStage })}
          hint="Select your current funding stage"
        />

        <Select
          label="Company Location / Market"
          options={geoOptions}
          value={companyContext.geoMarket}
          onChange={(e) => updateCompanyContext({ geoMarket: e.target.value as GeoMarket })}
          hint="Primary office location for salary benchmarking"
        />

        <Select
          label="Headcount Range"
          options={headcountOptions}
          value={companyContext.headcountRange}
          onChange={(e) => updateCompanyContext({ headcountRange: e.target.value as HeadcountRange })}
          hint="Current total employee count"
        />

        <Input
          label="Runway (months)"
          type="number"
          min={0}
          placeholder="e.g., 18"
          value={companyContext.runwayMonths ?? ''}
          onChange={(e) => updateCompanyContext({
            runwayMonths: e.target.value ? Number(e.target.value) : undefined
          })}
          hint="Optional - helps flag runway impact"
        />
      </div>

      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-lg font-medium text-slate-900 mb-2">Cap Table Information (Optional)</h3>
        <p className="text-sm text-slate-600 mb-4">
          Adding cap table details improves accuracy. If you skip this, we&apos;ll estimate based on your stage.
        </p>

        {/* Explainer Box */}
        <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <h4 className="text-sm font-semibold text-slate-800 mb-2">Where to find these numbers</h4>
          <p className="text-sm text-slate-600 mb-3">
            Your cap table management tool (Carta, Pulley, Angelist, etc.) or your attorney should have these.
            If you don&apos;t have exact numbers, skip this section—we&apos;ll use reasonable estimates.
          </p>
          <div className="text-xs text-slate-500 space-y-2">
            <div className="flex gap-2">
              <span className="font-medium text-slate-700 w-40 flex-shrink-0">Fully Diluted Shares:</span>
              <span>The total number of shares that <em>would</em> exist if every option, warrant, and convertible instrument converted into common stock. This is the denominator when calculating ownership percentages.</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-slate-700 w-40 flex-shrink-0">Option Pool (Total):</span>
              <span>The number of shares your board has reserved for employee equity grants. Typically 10-20% of fully diluted shares.</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-slate-700 w-40 flex-shrink-0">Option Pool (Available):</span>
              <span>Shares in the pool that haven&apos;t been granted yet. This is what you have left to give to new hires. (Total Pool minus Outstanding Grants = Available)</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Fully Diluted Shares */}
          <div>
            <Input
              label="Fully Diluted Share Count"
              type="number"
              min={0}
              placeholder="e.g., 10,000,000"
              value={companyContext.capTable?.fdShares ?? ''}
              onChange={(e) => updateCompanyContext({
                capTable: {
                  ...companyContext.capTable,
                  fdShares: e.target.value ? Number(e.target.value) : 0,
                  optionPoolSize: companyContext.capTable?.optionPoolSize ?? 0,
                  optionPoolRemaining: companyContext.capTable?.optionPoolRemaining ?? 0,
                },
              })}
            />
            <p className="mt-1.5 text-xs text-slate-500">
              <span className="font-medium">What this is:</span> All shares that exist or could exist — founder shares + investor shares + all options (granted and ungranted) + any convertible notes/SAFEs (as-converted).
              <br />
              <span className="font-medium">Typical ranges:</span> Pre-seed: 8-12M · Seed: 10-15M · Series A: 15-30M · Series B+: 30M+
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Option Pool Total */}
            <div>
              <Input
                label="Option Pool — Total Reserved"
                type="number"
                min={0}
                placeholder="e.g., 1,500,000"
                value={companyContext.capTable?.optionPoolSize ?? ''}
                onChange={(e) => updateCompanyContext({
                  capTable: {
                    ...companyContext.capTable,
                    fdShares: companyContext.capTable?.fdShares ?? 0,
                    optionPoolSize: e.target.value ? Number(e.target.value) : 0,
                    optionPoolRemaining: companyContext.capTable?.optionPoolRemaining ?? 0,
                  },
                })}
              />
              <p className="mt-1.5 text-xs text-slate-500">
                <span className="font-medium">What this is:</span> Total shares set aside for employee equity (the whole pool, not what&apos;s left).
              </p>
            </div>

            {/* Option Pool Available */}
            <div>
              <Input
                label="Option Pool — Available to Grant"
                type="number"
                min={0}
                placeholder="e.g., 1,000,000"
                value={companyContext.capTable?.optionPoolRemaining ?? ''}
                onChange={(e) => updateCompanyContext({
                  capTable: {
                    ...companyContext.capTable,
                    fdShares: companyContext.capTable?.fdShares ?? 0,
                    optionPoolSize: companyContext.capTable?.optionPoolSize ?? 0,
                    optionPoolRemaining: e.target.value ? Number(e.target.value) : 0,
                  },
                })}
              />
              <p className="mt-1.5 text-xs text-slate-500">
                <span className="font-medium">What this is:</span> Shares you can still grant to new hires. (Total pool minus options already promised to employees.)
              </p>
            </div>
          </div>

          {/* 409A Price */}
          <div>
            <Input
              label="Current 409A Fair Market Value (per share)"
              type="number"
              min={0}
              step={0.01}
              placeholder="e.g., $0.50"
              value={companyContext.capTable?.currentPricePerShare ?? ''}
              onChange={(e) => updateCompanyContext({
                capTable: {
                  ...companyContext.capTable,
                  fdShares: companyContext.capTable?.fdShares ?? 0,
                  optionPoolSize: companyContext.capTable?.optionPoolSize ?? 0,
                  optionPoolRemaining: companyContext.capTable?.optionPoolRemaining ?? 0,
                  currentPricePerShare: e.target.value ? Number(e.target.value) : undefined,
                },
              })}
            />
            <p className="mt-1.5 text-xs text-slate-500">
              <span className="font-medium">What this is:</span> The &quot;strike price&quot; for new option grants, set by an independent 409A valuation. This is usually much lower than your last funding round price.
              <br />
              <span className="font-medium">Don&apos;t have one?</span> You&apos;ll need a 409A valuation before issuing options. Companies like Carta, Eqvista, and others provide them.
            </p>
          </div>
        </div>

        {/* Visual Example */}
        {companyContext.capTable?.fdShares && companyContext.capTable?.optionPoolSize && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Your Numbers at a Glance</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-600">Option Pool:</span>{' '}
                <span className="font-medium text-blue-900">
                  {((companyContext.capTable.optionPoolSize / companyContext.capTable.fdShares) * 100).toFixed(1)}% of company
                </span>
              </div>
              {companyContext.capTable?.optionPoolRemaining !== undefined && (
                <div>
                  <span className="text-blue-600">Available to Grant:</span>{' '}
                  <span className="font-medium text-blue-900">
                    {((companyContext.capTable.optionPoolRemaining / companyContext.capTable.fdShares) * 100).toFixed(1)}% of company
                  </span>
                </div>
              )}
              {companyContext.capTable?.optionPoolRemaining !== undefined && companyContext.capTable?.optionPoolSize > 0 && (
                <div>
                  <span className="text-blue-600">Pool Used:</span>{' '}
                  <span className="font-medium text-blue-900">
                    {(((companyContext.capTable.optionPoolSize - companyContext.capTable.optionPoolRemaining) / companyContext.capTable.optionPoolSize) * 100).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
