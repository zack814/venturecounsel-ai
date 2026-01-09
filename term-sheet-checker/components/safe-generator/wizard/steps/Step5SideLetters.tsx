'use client';

import React, { useState } from 'react';
import { useSafeWizard } from '../SafeWizardContext';
import { cn } from '@/lib/utils';
import { SIDE_LETTER_OPTIONS, SideLetterOption, formatUSD } from '@/lib/safe-types';

function RecommendationBadge({ recommendation }: { recommendation: SideLetterOption['recommendation'] }) {
  const styles = {
    'standard': 'bg-green-100 text-green-800 border-green-200',
    'negotiable': 'bg-amber-100 text-amber-800 border-amber-200',
    'unusual': 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const labels = {
    'standard': 'Standard',
    'negotiable': 'Negotiable',
    'unusual': 'Unusual',
  };

  return (
    <span className={cn('px-2 py-0.5 text-xs font-semibold rounded-full border', styles[recommendation])}>
      {labels[recommendation]}
    </span>
  );
}

function SideLetterCard({
  option,
  isEnabled,
  fields,
  investmentAmount,
  onToggle,
  onFieldChange,
}: {
  option: SideLetterOption;
  isEnabled: boolean;
  fields: Record<string, string | number | boolean>;
  investmentAmount: number;
  onToggle: () => void;
  onFieldChange: (fieldId: string, value: string | number | boolean) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if this option is relevant based on investment amount
  const meetsThreshold = () => {
    if (!option.fields) return true;
    const thresholdField = option.fields.find(f => f.id.includes('threshold'));
    if (!thresholdField) return true;
    const threshold = fields[thresholdField.id] as number || thresholdField.defaultValue as number;
    return investmentAmount >= threshold;
  };

  const isRelevant = meetsThreshold();

  return (
    <div
      className={cn(
        'rounded-xl border-2 transition-all',
        isEnabled
          ? 'border-amber-500 bg-amber-50/50'
          : 'border-slate-200',
        !isRelevant && 'opacity-60'
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <label className="flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={onToggle}
              className="h-5 w-5 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
            />
          </label>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3
                className={cn(
                  'font-semibold cursor-pointer',
                  isEnabled ? 'text-amber-900' : 'text-slate-900'
                )}
                onClick={onToggle}
              >
                {option.name}
              </h3>
              <RecommendationBadge recommendation={option.recommendation} />
              {option.typicalThreshold && (
                <span className="text-xs text-slate-500">Typical: {option.typicalThreshold}</span>
              )}
            </div>

            <p className="text-sm text-slate-600 mb-2">{option.description}</p>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
            >
              {isExpanded ? 'Hide' : 'Learn more'}
              <svg
                className={cn('w-3 h-3 transition-transform', isExpanded && 'rotate-180')}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 ml-8 p-3 bg-white border border-slate-200 rounded-lg">
            <p className="text-sm text-slate-600 mb-3">{option.longDescription}</p>
            <div className="p-2 bg-slate-50 rounded text-xs text-slate-500">
              <strong>Market Norm:</strong> {option.marketNorm}
            </div>
          </div>
        )}

        {/* Fields (if enabled) */}
        {isEnabled && option.fields && option.fields.length > 0 && (
          <div className="mt-4 ml-8 p-4 bg-white border border-amber-200 rounded-lg space-y-4">
            {option.fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {field.label}
                </label>
                {field.type === 'number' && (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      value={(fields[field.id] as number) ?? (field.defaultValue as number) ?? ''}
                      onChange={(e) => onFieldChange(field.id, Number(e.target.value))}
                      placeholder={field.placeholder}
                      className="block w-full rounded-lg border border-slate-300 pl-7 pr-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                )}
                {field.type === 'select' && field.options && (
                  <select
                    value={(fields[field.id] as string) ?? (field.defaultValue as string) ?? ''}
                    onChange={(e) => onFieldChange(field.id, e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-amber-500 focus:ring-amber-500"
                  >
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                )}
                {field.type === 'text' && (
                  <input
                    type="text"
                    value={(fields[field.id] as string) ?? (field.defaultValue as string) ?? ''}
                    onChange={(e) => onFieldChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-amber-500 focus:ring-amber-500"
                  />
                )}
                {field.hint && (
                  <p className="mt-1 text-xs text-slate-500">{field.hint}</p>
                )}
              </div>
            ))}

            {/* Show relevance warning */}
            {!isRelevant && (
              <div className="p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
                <strong>Note:</strong> The investment amount ({formatUSD(investmentAmount)}) is below the typical threshold for this right.
                Consider whether this investor should receive it.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function Step5SideLetters() {
  const { state, updateSideLetters } = useSafeWizard();
  const { sideLetters, safeTerms } = state;
  const investmentAmount = safeTerms.investmentAmount || 0;

  const handleToggle = (optionId: string) => {
    const current = sideLetters[optionId] || { enabled: false, fields: {} };
    updateSideLetters({
      ...sideLetters,
      [optionId]: {
        ...current,
        enabled: !current.enabled,
      },
    });
  };

  const handleFieldChange = (optionId: string, fieldId: string, value: string | number | boolean) => {
    const current = sideLetters[optionId] || { enabled: true, fields: {} };
    updateSideLetters({
      ...sideLetters,
      [optionId]: {
        ...current,
        fields: {
          ...current.fields,
          [fieldId]: value,
        },
      },
    });
  };

  const enabledCount = Object.values(sideLetters).filter((s) => s.enabled).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Side Letter Options</h2>
        <p className="mt-1 text-sm text-slate-600">
          Side letters grant additional rights beyond the standard SAFE. Select which rights to include.
        </p>
      </div>

      {/* Context Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="font-semibold text-blue-900 text-sm">What are Side Letters?</h4>
            <p className="text-sm text-blue-800 mt-1">
              A side letter is a separate agreement that supplements the SAFE with additional investor rights.
              The standard YC SAFE intentionally excludes these rights to keep the document simple,
              but they&apos;re commonly negotiated, especially for larger checks or lead investors.
            </p>
          </div>
        </div>
      </div>

      {/* Investment Amount Context */}
      {investmentAmount > 0 && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-sm text-slate-600">
            Investment amount: <strong>{formatUSD(investmentAmount)}</strong> —
            we&apos;ve pre-selected rights that are standard for this check size.
          </p>
        </div>
      )}

      {/* Side Letter Options */}
      <div className="space-y-4">
        {SIDE_LETTER_OPTIONS.map((option) => {
          const selection = sideLetters[option.id] || { enabled: option.defaultEnabled, fields: {} };
          return (
            <SideLetterCard
              key={option.id}
              option={option}
              isEnabled={selection.enabled}
              fields={selection.fields || {}}
              investmentAmount={investmentAmount}
              onToggle={() => handleToggle(option.id)}
              onFieldChange={(fieldId, value) => handleFieldChange(option.id, fieldId, value)}
            />
          );
        })}
      </div>

      {/* Summary */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <h4 className="font-semibold text-slate-900 text-sm mb-2">Summary</h4>
        <p className="text-sm text-slate-600">
          You&apos;ve selected <strong>{enabledCount}</strong> side letter provision{enabledCount !== 1 ? 's' : ''}.
          {enabledCount === 0 && ' The investor will receive only the standard SAFE rights.'}
          {enabledCount > 0 && ' A side letter will be generated along with your SAFE.'}
        </p>
      </div>

      {/* Founder Tip */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div>
            <h4 className="font-semibold text-amber-900 text-sm">Founder Tip</h4>
            <p className="text-sm text-amber-800 mt-1">
              Be thoughtful about side letters. Every right you grant sets a precedent.
              Future investors may demand the same or better terms. It&apos;s usually easier
              to be consistent across all SAFE investors in a round.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
