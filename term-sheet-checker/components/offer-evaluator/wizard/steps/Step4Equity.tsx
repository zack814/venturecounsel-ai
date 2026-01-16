'use client';

import React, { useState } from 'react';
import { useOfferEvaluator } from '../OfferEvaluatorContext';
import { FormField, Select, Input } from '@/components/offer-evaluator/ui/FormField';
import {
  EQUITY_TYPE_LABELS,
  EXERCISE_PERIOD_LABELS,
  ACCELERATION_LABELS,
} from '@/lib/offer-evaluator-schemas';
import type {
  EquityType,
  ExercisePeriod,
  AccelerationProvision,
  YesNoUnknown,
  ConfidenceLevel,
} from '@/lib/offer-evaluator-schemas';
import { AlertCircle, HelpCircle, ChevronDown, ChevronUp, Calculator } from 'lucide-react';

const equityTypeOptions = Object.entries(EQUITY_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const exercisePeriodOptions = Object.entries(EXERCISE_PERIOD_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const accelerationOptions = Object.entries(ACCELERATION_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const yesNoUnknownOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'unknown', label: "I don't know" },
];

const confidenceOptions = [
  { value: 'known', label: 'I know this number' },
  { value: 'estimated', label: 'This is an estimate' },
  { value: 'unknown', label: "I don't know" },
];

interface TooltipModalProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

function TooltipModal({ title, content, isOpen, onClose }: TooltipModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-slate-900 mb-3">{title}</h3>
        <p className="text-sm text-slate-600 whitespace-pre-line">{content}</p>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-navy-700 text-white rounded-lg hover:bg-navy-800 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

export function Step4Equity() {
  const { state, updateEquityOffer } = useOfferEvaluator();
  const { equityOffer, companyDetails } = state;
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Calculate ownership percentage if possible
  const ownershipPercent = equityOffer.shareCount && equityOffer.totalSharesOutstanding
    ? (equityOffer.shareCount / equityOffer.totalSharesOutstanding * 100)
    : equityOffer.percentOfCompany;

  // Calculate paper value if possible
  const paperValue = ownershipPercent && equityOffer.latestValuation
    ? (ownershipPercent / 100) * equityOffer.latestValuation
    : equityOffer.shareCount && equityOffer.latestRoundPricePerShare
    ? equityOffer.shareCount * equityOffer.latestRoundPricePerShare
    : null;

  // Calculate exercise cost
  const exerciseCost = equityOffer.shareCount && equityOffer.strikePrice
    ? equityOffer.shareCount * equityOffer.strikePrice
    : null;

  const tooltips: Record<string, { title: string; content: string }> = {
    equityType: {
      title: 'Equity Type',
      content: `ISOs (Incentive Stock Options): Tax-advantaged options for employees. If you hold for 1 year after exercise and 2 years after grant, gains are taxed as long-term capital gains.

NSOs (Non-Qualified Stock Options): Standard options without special tax treatment. The spread at exercise is taxed as ordinary income.

RSUs (Restricted Stock Units): A promise to give you shares when they vest. No purchase required, but you pay income tax on the full value when they vest.`
    },
    strikePrice: {
      title: 'Strike Price (409A)',
      content: `The strike price is what you'll pay per share to exercise your options. It's usually set at the 409A fair market value when options are granted.

A lower strike price = more upside for you.

Ask your employer: "What is the current 409A fair market value per share?"`
    },
    totalShares: {
      title: 'Fully Diluted Shares',
      content: `This is the total number of shares if everyone exercised their options. It includes:
- Shares held by founders, employees, investors
- All outstanding options (vested and unvested)
- Unissued shares in the option pool
- Shares from convertible notes/SAFEs

Without this number, you can't calculate what percentage of the company you'll own.

Ask your employer: "How many fully diluted shares are outstanding?"`
    },
    exercisePeriod: {
      title: 'Post-Termination Exercise Period',
      content: `This is how long you have to exercise vested options after leaving the company.

Standard: 90 days (very employee-unfriendly)
Better: 5-10 years or until company exit

Short windows can force you to pay tens of thousands within months of leaving, or lose your options entirely.

This is one of the most important terms to negotiate!`
    },
    acceleration: {
      title: 'Vesting Acceleration',
      content: `Single-trigger: Your unvested equity accelerates immediately when the company is acquired.

Double-trigger: Your equity accelerates only if BOTH the company is acquired AND you're terminated within 12-24 months.

No acceleration: If acquired and laid off, you could lose all unvested equity.

Double-trigger is increasingly common and protects you from getting acquired and then let go.`
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Equity Details</h2>
        <p className="text-sm text-slate-600">
          Enter the equity components of your offer. Don&apos;t worry if you don&apos;t know everything - we&apos;ll show you what to ask.
        </p>
      </div>

      {/* Equity Type and Grant */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Equity Type"
            htmlFor="equityType"
            required
            tooltip="Click the info icon to learn about different equity types."
          >
            <div className="flex gap-2">
              <Select
                id="equityType"
                value={equityOffer.equityType || ''}
                onChange={(e) => updateEquityOffer({ equityType: e.target.value as EquityType })}
                options={equityTypeOptions}
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => setActiveTooltip('equityType')}
                className="px-3 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <HelpCircle className="h-5 w-5 text-slate-600" />
              </button>
            </div>
          </FormField>

          <FormField
            label="Number of Shares/Options"
            htmlFor="shareCount"
            required={!equityOffer.percentOfCompany}
            tooltip="The number of shares or options in your grant."
          >
            <Input
              id="shareCount"
              type="number"
              min={0}
              value={equityOffer.shareCount ?? ''}
              onChange={(e) => updateEquityOffer({ shareCount: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="e.g., 50000"
            />
          </FormField>
        </div>

        {/* Company Equity Info */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-4 flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Company Equity Information
            <span className="text-xs font-normal text-slate-500">(ask your employer if you don&apos;t know)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Strike Price (409A)"
              htmlFor="strikePrice"
            >
              <div className="flex gap-2">
                <Input
                  id="strikePrice"
                  type="number"
                  min={0}
                  step={0.01}
                  leftAddon="$"
                  value={equityOffer.strikePrice ?? ''}
                  onChange={(e) => updateEquityOffer({
                    strikePrice: e.target.value ? Number(e.target.value) : undefined,
                    strikePriceConfidence: e.target.value ? 'known' as ConfidenceLevel : 'unknown' as ConfidenceLevel
                  })}
                  placeholder="e.g., 0.50"
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => setActiveTooltip('strikePrice')}
                  className="px-3 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <HelpCircle className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </FormField>

            <FormField
              label="Total Shares Outstanding"
              htmlFor="totalSharesOutstanding"
            >
              <div className="flex gap-2">
                <Input
                  id="totalSharesOutstanding"
                  type="number"
                  min={0}
                  value={equityOffer.totalSharesOutstanding ?? ''}
                  onChange={(e) => updateEquityOffer({
                    totalSharesOutstanding: e.target.value ? Number(e.target.value) : undefined,
                    totalSharesConfidence: e.target.value ? 'known' as ConfidenceLevel : 'unknown' as ConfidenceLevel
                  })}
                  placeholder="e.g., 10000000"
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => setActiveTooltip('totalShares')}
                  className="px-3 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <HelpCircle className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </FormField>

            <FormField
              label="Last Round Valuation"
              htmlFor="latestValuation"
            >
              <Input
                id="latestValuation"
                type="number"
                min={0}
                leftAddon="$"
                value={equityOffer.latestValuation ?? ''}
                onChange={(e) => updateEquityOffer({
                  latestValuation: e.target.value ? Number(e.target.value) : undefined,
                  latestValuationConfidence: e.target.value ? 'known' as ConfidenceLevel : 'unknown' as ConfidenceLevel
                })}
                placeholder="e.g., 50000000"
              />
            </FormField>

            <FormField
              label="Last Round Price/Share"
              htmlFor="latestRoundPricePerShare"
            >
              <Input
                id="latestRoundPricePerShare"
                type="number"
                min={0}
                step={0.01}
                leftAddon="$"
                value={equityOffer.latestRoundPricePerShare ?? ''}
                onChange={(e) => updateEquityOffer({
                  latestRoundPricePerShare: e.target.value ? Number(e.target.value) : undefined,
                  latestRoundPriceConfidence: e.target.value ? 'known' as ConfidenceLevel : 'unknown' as ConfidenceLevel
                })}
                placeholder="e.g., 5.00"
              />
            </FormField>
          </div>

          {/* Calculated Values */}
          {(ownershipPercent || paperValue || exerciseCost) && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <h4 className="text-xs font-medium text-slate-500 uppercase mb-2">Calculated Values</h4>
              <div className="grid grid-cols-3 gap-4">
                {ownershipPercent && (
                  <div>
                    <p className="text-xs text-slate-500">Ownership %</p>
                    <p className="text-lg font-semibold text-slate-900">{ownershipPercent.toFixed(4)}%</p>
                  </div>
                )}
                {paperValue && (
                  <div>
                    <p className="text-xs text-slate-500">Paper Value</p>
                    <p className="text-lg font-semibold text-emerald-600">${paperValue.toLocaleString()}</p>
                  </div>
                )}
                {exerciseCost && (
                  <div>
                    <p className="text-xs text-slate-500">Exercise Cost</p>
                    <p className="text-lg font-semibold text-slate-900">${exerciseCost.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Vesting Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Total Vesting Period"
            htmlFor="vestingTotalMonths"
            tooltip="How long until all your equity is vested. Standard is 4 years (48 months)."
          >
            <Input
              id="vestingTotalMonths"
              type="number"
              min={0}
              max={120}
              rightAddon="months"
              value={equityOffer.vestingTotalMonths ?? ''}
              onChange={(e) => updateEquityOffer({ vestingTotalMonths: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="48"
            />
          </FormField>

          <FormField
            label="Cliff Period"
            htmlFor="vestingCliffMonths"
            tooltip="Minimum time before any equity vests. Standard is 1 year (12 months)."
          >
            <Input
              id="vestingCliffMonths"
              type="number"
              min={0}
              max={24}
              rightAddon="months"
              value={equityOffer.vestingCliffMonths ?? ''}
              onChange={(e) => updateEquityOffer({ vestingCliffMonths: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="12"
            />
          </FormField>

          <FormField
            label="Vesting Frequency"
            htmlFor="vestingFrequency"
          >
            <Select
              id="vestingFrequency"
              value={equityOffer.vestingFrequency || 'monthly'}
              onChange={(e) => updateEquityOffer({ vestingFrequency: e.target.value as 'monthly' | 'quarterly' | 'annually' })}
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'annually', label: 'Annually' },
              ]}
            />
          </FormField>
        </div>

        {/* Important Terms */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-700">Important Terms</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Post-Termination Exercise Period"
              htmlFor="exercisePeriod"
            >
              <div className="flex gap-2">
                <Select
                  id="exercisePeriod"
                  value={equityOffer.exercisePeriod || 'unknown'}
                  onChange={(e) => updateEquityOffer({ exercisePeriod: e.target.value as ExercisePeriod })}
                  options={exercisePeriodOptions}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => setActiveTooltip('exercisePeriod')}
                  className="px-3 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <HelpCircle className="h-5 w-5 text-slate-600" />
                </button>
              </div>
              {(equityOffer.exercisePeriod === '30-days' || equityOffer.exercisePeriod === '90-days') && (
                <p className="mt-1 text-xs text-red-600">
                  This short window could force you to pay ${exerciseCost?.toLocaleString() || 'significant costs'} within {equityOffer.exercisePeriod.replace('-', ' ')} of leaving, or lose your options.
                </p>
              )}
            </FormField>

            <FormField
              label="Acceleration on Change of Control"
              htmlFor="accelerationProvision"
            >
              <div className="flex gap-2">
                <Select
                  id="accelerationProvision"
                  value={equityOffer.accelerationProvision || 'unknown'}
                  onChange={(e) => updateEquityOffer({ accelerationProvision: e.target.value as AccelerationProvision })}
                  options={accelerationOptions}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => setActiveTooltip('acceleration')}
                  className="px-3 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <HelpCircle className="h-5 w-5 text-slate-600" />
                </button>
              </div>
            </FormField>

            <FormField
              label="Early Exercise Allowed?"
              htmlFor="earlyExerciseAllowed"
              tooltip="Can you exercise options before they vest? This enables 83(b) elections for tax benefits."
            >
              <Select
                id="earlyExerciseAllowed"
                value={equityOffer.earlyExerciseAllowed || 'unknown'}
                onChange={(e) => updateEquityOffer({ earlyExerciseAllowed: e.target.value as YesNoUnknown })}
                options={yesNoUnknownOptions}
              />
            </FormField>
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {showAdvanced ? 'Hide' : 'Show'} advanced options
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
            <FormField
              label="Company Repurchase Right"
              htmlFor="repurchaseRight"
              tooltip="Can the company buy back your vested shares if you leave?"
            >
              <Select
                id="repurchaseRight"
                value={equityOffer.repurchaseRight || 'unknown'}
                onChange={(e) => updateEquityOffer({ repurchaseRight: e.target.value as YesNoUnknown })}
                options={yesNoUnknownOptions}
              />
            </FormField>

            <FormField
              label="Right of First Refusal (ROFR)"
              htmlFor="rightOfFirstRefusal"
              tooltip="Does the company have the right to buy your shares before you sell them to someone else?"
            >
              <Select
                id="rightOfFirstRefusal"
                value={equityOffer.rightOfFirstRefusal || 'unknown'}
                onChange={(e) => updateEquityOffer({ rightOfFirstRefusal: e.target.value as YesNoUnknown })}
                options={yesNoUnknownOptions}
              />
            </FormField>

            <FormField
              label="Percentage of Company (if known)"
              htmlFor="percentOfCompany"
              helpText="If they told you a percentage instead of share count"
            >
              <Input
                id="percentOfCompany"
                type="number"
                min={0}
                max={100}
                step={0.001}
                rightAddon="%"
                value={equityOffer.percentOfCompany ?? ''}
                onChange={(e) => updateEquityOffer({ percentOfCompany: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="e.g., 0.25"
              />
            </FormField>

            <FormField
              label="Option Pool Size"
              htmlFor="optionPoolPercent"
              helpText="What % of the company is reserved for employees?"
            >
              <Input
                id="optionPoolPercent"
                type="number"
                min={0}
                max={100}
                rightAddon="%"
                value={equityOffer.optionPoolPercent ?? ''}
                onChange={(e) => updateEquityOffer({ optionPoolPercent: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="e.g., 15"
              />
            </FormField>
          </div>
        )}
      </div>

      {/* Questions to Ask */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Questions to Ask About Your Equity</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              {!equityOffer.strikePrice && (
                <li>- What is the current 409A fair market value per share?</li>
              )}
              {!equityOffer.totalSharesOutstanding && (
                <li>- How many fully diluted shares are outstanding?</li>
              )}
              {!equityOffer.latestValuation && (
                <li>- What was the company valuation in the last funding round?</li>
              )}
              {equityOffer.exercisePeriod === 'unknown' && (
                <li>- What is the post-termination exercise period?</li>
              )}
              {equityOffer.accelerationProvision === 'unknown' && (
                <li>- Is there acceleration on change of control?</li>
              )}
              {equityOffer.earlyExerciseAllowed === 'unknown' && (
                <li>- Is early exercise available?</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Tooltip Modals */}
      {Object.entries(tooltips).map(([key, { title, content }]) => (
        <TooltipModal
          key={key}
          title={title}
          content={content}
          isOpen={activeTooltip === key}
          onClose={() => setActiveTooltip(null)}
        />
      ))}
    </div>
  );
}
