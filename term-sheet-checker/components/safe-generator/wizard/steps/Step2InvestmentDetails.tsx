'use client';

import React, { useState, useEffect } from 'react';
import { useSafeWizard } from '../SafeWizardContext';
import { Input } from '@/components/comp-optimizer/ui/Input';
import { cn } from '@/lib/utils';
import {
  SAFE_TYPE_INFO,
  VALUATION_CAP_BENCHMARKS,
  DISCOUNT_BENCHMARKS,
  calculateOwnership,
  formatValuation,
  formatUSD,
} from '@/lib/safe-types';

type Stage = 'pre-seed' | 'seed' | 'post-seed';

const stageOptions = [
  { value: 'pre-seed', label: 'Pre-Seed', description: 'Pre-product or early MVP' },
  { value: 'seed', label: 'Seed', description: 'Product launched, early traction' },
  { value: 'post-seed', label: 'Post-Seed / Bridge', description: 'Growing, preparing for Series A' },
];

function OwnershipCalculator({
  amount,
  cap,
  discount,
  safeType,
}: {
  amount: number;
  cap?: number;
  discount?: number;
  safeType: string;
}) {
  const isCapBased = safeType.includes('cap');
  const isPostMoney = safeType.includes('post-money');

  if (isCapBased && amount && cap) {
    const ownership = calculateOwnership(amount, cap, isPostMoney);
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <h4 className="font-semibold text-green-900">Ownership Preview</h4>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-green-600">Investment Amount</p>
            <p className="font-semibold text-green-900">{formatUSD(amount)}</p>
          </div>
          <div>
            <p className="text-green-600">Valuation Cap</p>
            <p className="font-semibold text-green-900">{formatValuation(cap)}</p>
          </div>
          <div className="col-span-2 pt-2 border-t border-green-200">
            <p className="text-green-600">Investor Ownership at Conversion</p>
            <p className="text-2xl font-bold text-green-900">{ownership.toFixed(2)}%</p>
            <p className="text-xs text-green-700 mt-1">
              {isPostMoney
                ? 'This is the guaranteed minimum ownership (post-money cap protects against dilution)'
                : 'This may change if additional SAFEs are issued (pre-money SAFEs dilute each other)'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isCapBased && amount && discount) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <h4 className="font-semibold text-amber-900">Conversion Preview</h4>
        </div>
        <div className="text-sm text-amber-800">
          <p>
            With a {discount}% discount, the investor will convert at {100 - discount}% of the Series A price.
          </p>
          <p className="mt-2">
            <strong>Example:</strong> If your Series A is at $10M post-money, the investor converts as if the valuation were ${((10 * (100 - discount)) / 100).toFixed(1)}M.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

function ValuationCapInput({
  value,
  onChange,
  stage,
}: {
  value?: number;
  onChange: (val: number | undefined) => void;
  stage: Stage;
}) {
  const benchmarks = VALUATION_CAP_BENCHMARKS[stage];
  const [showBenchmarks, setShowBenchmarks] = useState(false);

  const getCapAssessment = () => {
    if (!value) return null;
    if (value < benchmarks.low) {
      return { color: 'text-green-600', text: 'Below market — very founder-friendly' };
    }
    if (value <= benchmarks.high) {
      return { color: 'text-blue-600', text: 'Within market range' };
    }
    return { color: 'text-amber-600', text: 'Above typical range — may face pushback' };
  };

  const assessment = getCapAssessment();

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Valuation Cap
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
            placeholder="e.g., 10000000"
            className="block w-full rounded-lg border border-slate-300 pl-7 pr-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-amber-500 focus:ring-amber-500"
          />
        </div>
        {value && (
          <p className="mt-1 text-sm font-medium">
            {formatValuation(value)} {assessment && <span className={assessment.color}>— {assessment.text}</span>}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShowBenchmarks(!showBenchmarks)}
        className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
      >
        {showBenchmarks ? 'Hide' : 'Show'} market benchmarks
        <svg
          className={cn('w-4 h-4 transition-transform', showBenchmarks && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showBenchmarks && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <h4 className="font-semibold text-slate-900 text-sm mb-3">
            {stage.charAt(0).toUpperCase() + stage.slice(1)} Stage Benchmarks
          </h4>
          <p className="text-xs text-slate-600 mb-3">{benchmarks.description}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Lower end</span>
              <button
                type="button"
                onClick={() => onChange(benchmarks.low)}
                className="text-sm font-medium text-amber-600 hover:text-amber-700"
              >
                {formatValuation(benchmarks.low)}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Median</span>
              <button
                type="button"
                onClick={() => onChange(benchmarks.median)}
                className="text-sm font-medium text-amber-600 hover:text-amber-700"
              >
                {formatValuation(benchmarks.median)}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Higher end</span>
              <button
                type="button"
                onClick={() => onChange(benchmarks.high)}
                className="text-sm font-medium text-amber-600 hover:text-amber-700"
              >
                {formatValuation(benchmarks.high)}
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Click any value to use it. These are based on 2024 market data.
          </p>
        </div>
      )}
    </div>
  );
}

function DiscountInput({
  value,
  onChange,
}: {
  value?: number;
  onChange: (val: number | undefined) => void;
}) {
  const getDiscountAssessment = () => {
    if (!value) return null;
    if (value < DISCOUNT_BENCHMARKS.low) {
      return { color: 'text-amber-600', text: 'Below typical — investor may push back' };
    }
    if (value <= DISCOUNT_BENCHMARKS.standard) {
      return { color: 'text-green-600', text: 'Standard market rate' };
    }
    if (value <= DISCOUNT_BENCHMARKS.high) {
      return { color: 'text-blue-600', text: 'Investor-favorable but acceptable' };
    }
    return { color: 'text-red-600', text: 'Unusually high — may indicate aggressive investor' };
  };

  const assessment = getDiscountAssessment();

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Discount Rate
        </label>
        <div className="relative">
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
            placeholder="e.g., 20"
            min={0}
            max={50}
            className="block w-full rounded-lg border border-slate-300 pl-3 pr-7 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-amber-500 focus:ring-amber-500"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
        </div>
        {value && assessment && (
          <p className={cn('mt-1 text-sm font-medium', assessment.color)}>
            {assessment.text}
          </p>
        )}
      </div>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <h4 className="font-semibold text-slate-900 text-sm mb-2">Market Norms</h4>
        <p className="text-xs text-slate-600 mb-3">{DISCOUNT_BENCHMARKS.description}</p>
        <div className="flex gap-2">
          {[15, 20, 25].map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => onChange(rate)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                value === rate
                  ? 'bg-amber-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-amber-300'
              )}
            >
              {rate}%
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Step2InvestmentDetails() {
  const { state, updateSafeTerms } = useSafeWizard();
  const { safeType, safeTerms } = state;
  const [stage, setStage] = useState<Stage>('seed');

  const safeTypeInfo = SAFE_TYPE_INFO[safeType];
  const needsCap = safeType.includes('cap');
  const needsDiscount = safeType.includes('discount');
  const isMfn = safeType === 'post-money-mfn';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Investment Details</h2>
        <p className="mt-1 text-sm text-slate-600">
          Enter the terms of your SAFE investment. We&apos;ll show you how it compares to market norms.
        </p>
      </div>

      {/* Selected SAFE Type Reminder */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="font-medium text-amber-900">You selected: {safeTypeInfo.name}</span>
        </div>
      </div>

      {/* Stage Selection (for benchmarks) */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Company Stage (for benchmarks)
        </label>
        <div className="grid grid-cols-3 gap-3">
          {stageOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStage(opt.value as Stage)}
              className={cn(
                'p-3 rounded-lg border-2 text-left transition-all',
                stage === opt.value
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-slate-200 hover:border-slate-300'
              )}
            >
              <span className="block font-medium text-slate-900 text-sm">{opt.label}</span>
              <span className="block text-xs text-slate-500 mt-0.5">{opt.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Investment Amount */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Investment Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
          <input
            type="number"
            value={safeTerms.investmentAmount || ''}
            onChange={(e) => updateSafeTerms({
              investmentAmount: e.target.value ? Number(e.target.value) : undefined
            })}
            placeholder="e.g., 500000"
            className="block w-full rounded-lg border border-slate-300 pl-7 pr-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-amber-500 focus:ring-amber-500"
          />
        </div>
        {safeTerms.investmentAmount && (
          <p className="mt-1 text-sm text-slate-600">
            {formatUSD(safeTerms.investmentAmount)}
          </p>
        )}
        <p className="mt-1 text-xs text-slate-500">
          The dollar amount the investor is committing to invest.
        </p>
      </div>

      {/* Valuation Cap (if applicable) */}
      {needsCap && (
        <ValuationCapInput
          value={safeTerms.valuationCap}
          onChange={(val) => updateSafeTerms({ valuationCap: val })}
          stage={stage}
        />
      )}

      {/* Discount Rate (if applicable) */}
      {needsDiscount && (
        <DiscountInput
          value={safeTerms.discountRate}
          onChange={(val) => updateSafeTerms({ discountRate: val })}
        />
      )}

      {/* MFN Explanation */}
      {isMfn && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900 text-sm">About MFN SAFEs</h4>
              <p className="text-sm text-blue-800 mt-1">
                This SAFE has no cap or discount. Instead, it includes a Most Favored Nation clause.
                If you later issue SAFEs with better terms (a cap or discount), this investor can elect to receive those terms.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Date */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Purchase Date
        </label>
        <input
          type="date"
          value={safeTerms.purchaseDate || ''}
          onChange={(e) => updateSafeTerms({ purchaseDate: e.target.value })}
          className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-amber-500 focus:ring-amber-500"
        />
        <p className="mt-1 text-xs text-slate-500">
          The date the SAFE will be signed and the investment wired.
        </p>
      </div>

      {/* Ownership Calculator */}
      <OwnershipCalculator
        amount={safeTerms.investmentAmount || 0}
        cap={safeTerms.valuationCap}
        discount={safeTerms.discountRate}
        safeType={safeType}
      />
    </div>
  );
}
