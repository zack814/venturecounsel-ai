'use client';

import React from 'react';
import { useOfferEvaluator } from '../OfferEvaluatorContext';
import { FormField, Select, Checkbox, Textarea, Input } from '@/components/offer-evaluator/ui/FormField';
import type { CompetingOffers, NegotiationPriority } from '@/lib/offer-evaluator-schemas';
import { Sparkles, GripVertical } from 'lucide-react';

const competingOffersOptions = [
  { value: 'none', label: 'No other offers' },
  { value: 'one', label: 'One other offer' },
  { value: 'multiple', label: 'Multiple other offers' },
];

const priorityOptions: { value: NegotiationPriority; label: string; description: string }[] = [
  { value: 'base-salary', label: 'Base Salary', description: 'Guaranteed cash compensation' },
  { value: 'equity', label: 'Equity', description: 'Ownership stake and upside potential' },
  { value: 'signing-bonus', label: 'Signing Bonus', description: 'One-time cash payment' },
  { value: 'work-life-balance', label: 'Work-Life Balance', description: 'Hours, flexibility, PTO' },
  { value: 'career-growth', label: 'Career Growth', description: 'Title, scope, learning' },
  { value: 'remote-flexibility', label: 'Remote Flexibility', description: 'Location flexibility' },
  { value: 'title-level', label: 'Title / Level', description: 'Seniority and scope' },
];

export function Step5Negotiation() {
  const { state, updateNegotiationContext } = useOfferEvaluator();
  const { negotiationContext } = state;

  const selectedPriorities = negotiationContext.priorities || [];

  const togglePriority = (priority: NegotiationPriority) => {
    if (selectedPriorities.includes(priority)) {
      updateNegotiationContext({
        priorities: selectedPriorities.filter(p => p !== priority)
      });
    } else if (selectedPriorities.length < 5) {
      updateNegotiationContext({
        priorities: [...selectedPriorities, priority]
      });
    }
  };

  const movePriority = (index: number, direction: 'up' | 'down') => {
    const newPriorities = [...selectedPriorities];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newPriorities.length) {
      [newPriorities[index], newPriorities[targetIndex]] = [newPriorities[targetIndex], newPriorities[index]];
      updateNegotiationContext({ priorities: newPriorities });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Negotiation Context</h2>
        <p className="text-sm text-slate-600">
          Help us understand your negotiating position so we can give you tailored advice.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Do you have competing offers?"
          htmlFor="competingOffers"
          required
          tooltip="Having other offers significantly increases your negotiating leverage."
        >
          <Select
            id="competingOffers"
            value={negotiationContext.competingOffers || 'none'}
            onChange={(e) => updateNegotiationContext({ competingOffers: e.target.value as CompetingOffers })}
            options={competingOffersOptions}
          />
        </FormField>

        <FormField
          label="How excited are you about this opportunity?"
          htmlFor="excitementLevel"
          required
          tooltip="This helps us calibrate our negotiation advice. Higher excitement = more willing to accept reasonable offers."
        >
          <div className="flex items-center gap-4">
            <input
              type="range"
              id="excitementLevel"
              min={1}
              max={5}
              value={negotiationContext.excitementLevel || 3}
              onChange={(e) => updateNegotiationContext({ excitementLevel: Number(e.target.value) })}
              className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-navy-700"
            />
            <span className="text-sm font-medium text-slate-700 w-20 text-center">
              {negotiationContext.excitementLevel === 1 && 'Not very'}
              {negotiationContext.excitementLevel === 2 && 'Somewhat'}
              {negotiationContext.excitementLevel === 3 && 'Interested'}
              {negotiationContext.excitementLevel === 4 && 'Very'}
              {negotiationContext.excitementLevel === 5 && 'Extremely'}
            </span>
          </div>
        </FormField>
      </div>

      {/* Priority Selection */}
      <div className="space-y-4">
        <FormField
          label="What matters most to you?"
          required
          helpText="Select up to 5 priorities and rank them in order of importance"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {priorityOptions.map((option) => {
              const isSelected = selectedPriorities.includes(option.value);
              const rank = selectedPriorities.indexOf(option.value) + 1;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => togglePriority(option.value)}
                  className={`flex items-center gap-3 p-3 border rounded-lg text-left transition-colors ${
                    isSelected
                      ? 'border-navy-500 bg-navy-50'
                      : 'border-slate-200 hover:border-slate-300'
                  } ${!isSelected && selectedPriorities.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!isSelected && selectedPriorities.length >= 5}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isSelected ? 'bg-navy-700 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isSelected ? rank : ''}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{option.label}</p>
                    <p className="text-xs text-slate-500">{option.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </FormField>

        {/* Selected Priorities Ranking */}
        {selectedPriorities.length > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Your Priorities (drag to reorder)</h4>
            <div className="space-y-2">
              {selectedPriorities.map((priority, index) => {
                const option = priorityOptions.find(o => o.value === priority);
                return (
                  <div
                    key={priority}
                    className="flex items-center gap-3 p-2 bg-white border border-slate-200 rounded-lg"
                  >
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => movePriority(index, 'up')}
                        disabled={index === 0}
                        className="text-slate-400 hover:text-slate-600 disabled:opacity-30"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => movePriority(index, 'down')}
                        disabled={index === selectedPriorities.length - 1}
                        className="text-slate-400 hover:text-slate-600 disabled:opacity-30"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-navy-700 text-white flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-sm text-slate-700">{option?.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Additional Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Checkbox
            label="The role level/title is negotiable"
            checked={negotiationContext.isLevelNegotiable || false}
            onChange={(e) => updateNegotiationContext({ isLevelNegotiable: e.target.checked })}
          />
          <Checkbox
            label="My start date is flexible"
            checked={negotiationContext.isStartDateFlexible ?? true}
            onChange={(e) => updateNegotiationContext({ isStartDateFlexible: e.target.checked })}
          />
        </div>

        <FormField
          label="Current Notice Period"
          htmlFor="noticePeriodWeeks"
          helpText="How long before you can start? (if employed)"
        >
          <Input
            id="noticePeriodWeeks"
            type="number"
            min={0}
            rightAddon="weeks"
            value={negotiationContext.noticePeriodWeeks ?? ''}
            onChange={(e) => updateNegotiationContext({ noticePeriodWeeks: e.target.value ? Number(e.target.value) : undefined })}
            placeholder="e.g., 2"
          />
        </FormField>
      </div>

      <FormField
        label="Any specific concerns about the offer?"
        htmlFor="specificConcerns"
        helpText="Optional - helps us give more targeted advice"
      >
        <Textarea
          id="specificConcerns"
          value={negotiationContext.specificConcerns || ''}
          onChange={(e) => updateNegotiationContext({ specificConcerns: e.target.value })}
          placeholder="e.g., The equity seems low compared to other offers I've seen, or I'm concerned about the short exercise window..."
          rows={3}
        />
      </FormField>

      {/* Tips */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-emerald-900 mb-1">Negotiation Leverage Tips</h3>
            <ul className="text-sm text-emerald-800 space-y-1">
              {negotiationContext.competingOffers === 'multiple' && (
                <li>- Multiple offers give you significant leverage. Mention them (professionally) in negotiations.</li>
              )}
              {negotiationContext.competingOffers === 'one' && (
                <li>- Having another offer is valuable leverage. You can mention you&apos;re considering another opportunity.</li>
              )}
              {negotiationContext.competingOffers === 'none' && (
                <li>- Without competing offers, focus on your unique value and market data rather than ultimatums.</li>
              )}
              {(negotiationContext.excitementLevel || 3) >= 4 && (
                <li>- Being genuinely excited is good! But don&apos;t let it prevent you from negotiating fairly.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
