'use client';

import React from 'react';
import { useOfferEvaluator } from '../OfferEvaluatorContext';
import { FormField, Input } from '@/components/offer-evaluator/ui/FormField';
import { DollarSign, TrendingUp } from 'lucide-react';

export function Step3Cash() {
  const { state, updateCashOffer } = useOfferEvaluator();
  const { cashOffer, employeeBackground } = state;

  const totalCash = (cashOffer.baseSalary || 0) +
    (cashOffer.bonusTargetAmount || (cashOffer.baseSalary || 0) * (cashOffer.bonusTargetPercent || 0) / 100) +
    (cashOffer.signingBonus || 0);

  const salaryChange = employeeBackground.currentBaseSalary && cashOffer.baseSalary
    ? ((cashOffer.baseSalary - employeeBackground.currentBaseSalary) / employeeBackground.currentBaseSalary * 100)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Cash Compensation</h2>
        <p className="text-sm text-slate-600">
          Enter the cash components of your offer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Base Salary"
          htmlFor="baseSalary"
          required
          tooltip="Your annual base salary before bonuses or equity."
        >
          <Input
            id="baseSalary"
            type="number"
            min={0}
            leftAddon="$"
            rightAddon="/year"
            value={cashOffer.baseSalary ?? ''}
            onChange={(e) => updateCashOffer({ baseSalary: e.target.value ? Number(e.target.value) : undefined })}
            placeholder="e.g., 180000"
          />
          {salaryChange !== null && (
            <p className={`mt-1 text-xs ${salaryChange >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {salaryChange >= 0 ? '+' : ''}{salaryChange.toFixed(1)}% vs your current salary
            </p>
          )}
        </FormField>

        <FormField
          label="Target Bonus"
          htmlFor="bonusTarget"
          helpText="Enter either a dollar amount or percentage"
          tooltip="Annual target bonus, typically as a percentage of base salary."
        >
          <div className="grid grid-cols-2 gap-2">
            <Input
              id="bonusTargetAmount"
              type="number"
              min={0}
              leftAddon="$"
              value={cashOffer.bonusTargetAmount ?? ''}
              onChange={(e) => updateCashOffer({
                bonusTargetAmount: e.target.value ? Number(e.target.value) : undefined,
                bonusTargetPercent: undefined
              })}
              placeholder="Amount"
            />
            <Input
              id="bonusTargetPercent"
              type="number"
              min={0}
              max={100}
              rightAddon="%"
              value={cashOffer.bonusTargetPercent ?? ''}
              onChange={(e) => updateCashOffer({
                bonusTargetPercent: e.target.value ? Number(e.target.value) : undefined,
                bonusTargetAmount: undefined
              })}
              placeholder="Percent"
            />
          </div>
        </FormField>

        <FormField
          label="Signing Bonus"
          htmlFor="signingBonus"
          helpText="One-time payment upon starting"
          tooltip="A one-time bonus paid when you start. Often negotiable, especially to bridge gaps in other compensation."
        >
          <Input
            id="signingBonus"
            type="number"
            min={0}
            leftAddon="$"
            value={cashOffer.signingBonus ?? ''}
            onChange={(e) => updateCashOffer({ signingBonus: e.target.value ? Number(e.target.value) : undefined })}
            placeholder="e.g., 25000"
          />
        </FormField>

        <FormField
          label="Relocation Bonus"
          htmlFor="relocationBonus"
          helpText="If you're relocating for the role"
        >
          <Input
            id="relocationBonus"
            type="number"
            min={0}
            leftAddon="$"
            value={cashOffer.relocationBonus ?? ''}
            onChange={(e) => updateCashOffer({ relocationBonus: e.target.value ? Number(e.target.value) : undefined })}
            placeholder="e.g., 10000"
          />
        </FormField>
      </div>

      {/* Summary Card */}
      {cashOffer.baseSalary && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Cash Compensation Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-500">Base Salary</p>
              <p className="text-lg font-semibold text-slate-900">
                ${(cashOffer.baseSalary || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Target Bonus</p>
              <p className="text-lg font-semibold text-slate-900">
                ${(cashOffer.bonusTargetAmount || (cashOffer.baseSalary || 0) * (cashOffer.bonusTargetPercent || 0) / 100).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Signing Bonus</p>
              <p className="text-lg font-semibold text-slate-900">
                ${(cashOffer.signingBonus || 0).toLocaleString()}
              </p>
            </div>
            <div className="border-l border-slate-300 pl-4">
              <p className="text-xs text-slate-500">Year 1 Total Cash</p>
              <p className="text-lg font-bold text-emerald-600">
                ${totalCash.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tips Card */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-900 mb-1">Negotiation Tip</h3>
            <p className="text-sm text-amber-800">
              If base salary is at budget but the overall package feels light, a <strong>signing bonus</strong> is
              often easier to negotiate than a salary increase - it&apos;s a one-time cost that doesn&apos;t affect
              ongoing burn rate or create internal equity issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
