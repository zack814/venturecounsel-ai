'use client';

import React from 'react';
import { useWizard } from '../WizardContext';
import { RadioGroup } from '@/components/comp-optimizer/ui/Input';
import type { CompetingOffersLevel, RiskTolerance, StartUrgency } from '@/lib/comp-schemas';

const competingOffersOptions = [
  {
    value: 'none',
    label: 'No competing offers',
    description: 'Candidate is not actively interviewing elsewhere',
  },
  {
    value: 'some',
    label: 'Some competing interest',
    description: 'Candidate has other interviews or early-stage offers',
  },
  {
    value: 'high',
    label: 'Strong competing offers',
    description: 'Candidate has one or more competitive offers in hand',
  },
];

const riskToleranceOptions = [
  {
    value: 'low',
    label: 'Risk-averse',
    description: 'Prefers stable cash compensation over equity upside',
  },
  {
    value: 'medium',
    label: 'Balanced',
    description: 'Open to typical startup equity/cash tradeoffs',
  },
  {
    value: 'high',
    label: 'Risk-tolerant',
    description: 'Willing to take lower cash for higher equity stake',
  },
];

const urgencyOptions = [
  {
    value: 'immediate',
    label: 'Immediate',
    description: 'Candidate needs to start within 2 weeks',
  },
  {
    value: 'standard',
    label: 'Standard',
    description: 'Typical 2-4 week notice period',
  },
  {
    value: 'flexible',
    label: 'Flexible',
    description: 'Candidate has flexibility on start date',
  },
];

export function Step3Candidate() {
  const { state, updateCandidateContext } = useWizard();
  const { candidateContext } = state;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Candidate Context</h2>
        <p className="mt-1 text-sm text-slate-600">
          Understanding the candidate&apos;s situation helps us tailor package recommendations.
        </p>
      </div>

      <div className="space-y-8">
        <RadioGroup
          label="Competing Offers"
          name="competingOffers"
          options={competingOffersOptions}
          value={candidateContext.competingOffersLevel}
          onChange={(value) =>
            updateCandidateContext({ competingOffersLevel: value as CompetingOffersLevel })
          }
        />

        <RadioGroup
          label="Candidate Risk Tolerance"
          name="riskTolerance"
          options={riskToleranceOptions}
          value={candidateContext.riskTolerance}
          onChange={(value) =>
            updateCandidateContext({ riskTolerance: value as RiskTolerance })
          }
        />

        <RadioGroup
          label="Start Date Urgency"
          name="urgency"
          options={urgencyOptions}
          value={candidateContext.startUrgency}
          onChange={(value) =>
            updateCandidateContext({ startUrgency: value as StartUrgency })
          }
        />
      </div>
    </div>
  );
}
