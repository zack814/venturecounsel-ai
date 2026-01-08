'use client';

import React, { useState } from 'react';
import { useSafeWizard } from '../SafeWizardContext';
import { cn } from '@/lib/utils';
import { SAFE_TYPE_INFO, SafeType, SafeTypeInfo } from '@/lib/safe-types';

const safeTypeOrder: SafeType[] = [
  'post-money-cap',
  'post-money-discount',
  'post-money-mfn',
  'pre-money-cap',
  'pre-money-discount',
];

function RecommendationBadge({ recommendation }: { recommendation: SafeTypeInfo['recommendation'] }) {
  const styles = {
    'strongly-recommended': 'bg-green-100 text-green-800 border-green-200',
    'acceptable': 'bg-amber-100 text-amber-800 border-amber-200',
    'not-recommended': 'bg-red-100 text-red-800 border-red-200',
  };

  const labels = {
    'strongly-recommended': 'Recommended',
    'acceptable': 'Acceptable',
    'not-recommended': 'Not Recommended',
  };

  return (
    <span className={cn('px-2 py-0.5 text-xs font-semibold rounded-full border', styles[recommendation])}>
      {labels[recommendation]}
    </span>
  );
}

function SafeTypeCard({
  info,
  isSelected,
  onSelect,
  onLearnMore,
}: {
  info: SafeTypeInfo;
  isSelected: boolean;
  onSelect: () => void;
  onLearnMore: () => void;
}) {
  const borderColor = {
    'strongly-recommended': isSelected ? 'border-green-500 ring-2 ring-green-100' : 'border-slate-200 hover:border-green-300',
    'acceptable': isSelected ? 'border-amber-500 ring-2 ring-amber-100' : 'border-slate-200 hover:border-amber-300',
    'not-recommended': isSelected ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200 hover:border-red-200',
  };

  return (
    <div
      className={cn(
        'relative rounded-xl border-2 p-5 cursor-pointer transition-all bg-white',
        borderColor[info.recommendation],
        isSelected && 'shadow-lg'
      )}
      onClick={onSelect}
    >
      {info.recommendation === 'strongly-recommended' && (
        <div className="absolute -top-3 left-4 px-2 py-0.5 bg-green-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          YC Standard
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className={cn(
          'w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center',
          isSelected ? 'border-amber-600 bg-amber-600' : 'border-slate-300'
        )}>
          {isSelected && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-slate-900">{info.name}</h3>
            <RecommendationBadge recommendation={info.recommendation} />
          </div>

          <p className="text-sm text-slate-600 mb-2">{info.shortDescription}</p>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500">{info.marketData}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onLearnMore();
              }}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Learn more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailModal({
  info,
  onClose,
}: {
  info: SafeTypeInfo;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900">{info.name}</h2>
            <RecommendationBadge recommendation={info.recommendation} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">What is this?</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{info.longDescription}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-1">Our Recommendation</h3>
            <p className="text-sm text-slate-600">{info.recommendationReason}</p>
          </div>

          {info.pros.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Pros</h3>
              <ul className="space-y-2">
                {info.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {info.cons.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Cons</h3>
              <ul className="space-y-2">
                {info.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h3 className="font-semibold text-amber-900 mb-1">When to use this</h3>
            <p className="text-sm text-amber-800">{info.whenToUse}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Step1SafeType() {
  const { state, setSafeType } = useSafeWizard();
  const [detailModal, setDetailModal] = useState<SafeTypeInfo | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Choose Your SAFE Type</h2>
        <p className="mt-1 text-sm text-slate-600">
          The type of SAFE determines how your investor&apos;s ownership is calculated when the SAFE converts.
          We strongly recommend the post-money SAFE with valuation cap.
        </p>
      </div>

      {/* Market Context */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="font-semibold text-blue-900 text-sm">Market Context (2024-2025)</h4>
            <p className="text-sm text-blue-800 mt-1">
              85% of early-stage rounds now use SAFEs. Of those, 61% use a valuation cap only, 30% use both cap and discount,
              and only 8% use discount alone. Post-money SAFEs are the standard — pre-money was deprecated by YC in 2018.
            </p>
          </div>
        </div>
      </div>

      {/* Post-Money Options (Recommended) */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">Post-Money SAFEs (Recommended)</h3>
        <div className="space-y-3">
          {safeTypeOrder.slice(0, 3).map((type) => (
            <SafeTypeCard
              key={type}
              info={SAFE_TYPE_INFO[type]}
              isSelected={state.safeType === type}
              onSelect={() => setSafeType(type)}
              onLearnMore={() => setDetailModal(SAFE_TYPE_INFO[type])}
            />
          ))}
        </div>
      </div>

      {/* Pre-Money Options (Not Recommended) */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
          Pre-Money SAFEs (Not Recommended)
          <span className="text-xs font-normal normal-case text-slate-400">— Deprecated by YC</span>
        </h3>
        <div className="space-y-3 opacity-75">
          {safeTypeOrder.slice(3).map((type) => (
            <SafeTypeCard
              key={type}
              info={SAFE_TYPE_INFO[type]}
              isSelected={state.safeType === type}
              onSelect={() => setSafeType(type)}
              onLearnMore={() => setDetailModal(SAFE_TYPE_INFO[type])}
            />
          ))}
        </div>
      </div>

      {/* Warning for non-recommended selections */}
      {(state.safeType === 'pre-money-cap' || state.safeType === 'pre-money-discount') && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-semibold text-red-900 text-sm">Are you sure?</h4>
              <p className="text-sm text-red-800 mt-1">
                Pre-money SAFEs were deprecated by YC in 2018 because they cause cap table confusion.
                Unless an existing investor specifically requires this format, we recommend using a post-money SAFE instead.
              </p>
            </div>
          </div>
        </div>
      )}

      {detailModal && (
        <DetailModal info={detailModal} onClose={() => setDetailModal(null)} />
      )}
    </div>
  );
}
