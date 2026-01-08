'use client';

import React from 'react';
import { useWizard } from '../WizardContext';
import { RadioGroup } from '@/components/comp-optimizer/ui/Input';
import type { PriorityLevel } from '@/lib/comp-schemas';

const priorityOptions = [
  {
    value: 'normal',
    label: 'Normal',
    description: 'Standard weighting in package optimization',
  },
  {
    value: 'high',
    label: 'High Priority',
    description: 'Emphasize this factor in package recommendations',
  },
];

export function Step5Preferences() {
  const { state, updatePreferences } = useWizard();
  const { preferences } = state;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Preferences</h2>
        <p className="mt-1 text-sm text-slate-600">
          Tell us what&apos;s most important to you when structuring this offer.
        </p>
      </div>

      <div className="space-y-8">
        <RadioGroup
          label="Retention Priority"
          name="retention"
          options={[
            {
              value: 'normal',
              label: 'Normal',
              description: 'Standard retention-focused structuring',
            },
            {
              value: 'high',
              label: 'High Priority',
              description: 'Emphasize long-term retention through vesting and competitive total comp',
            },
          ]}
          value={preferences.retentionPriority}
          onChange={(value) =>
            updatePreferences({ retentionPriority: value as PriorityLevel })
          }
        />

        <RadioGroup
          label="Cash Preservation Priority"
          name="cashPreservation"
          options={[
            {
              value: 'normal',
              label: 'Normal',
              description: 'Balance cash and equity normally',
            },
            {
              value: 'high',
              label: 'High Priority',
              description: 'Minimize cash burn, shift compensation toward equity',
            },
          ]}
          value={preferences.cashPreservationPriority}
          onChange={(value) =>
            updatePreferences({ cashPreservationPriority: value as PriorityLevel })
          }
        />

        <RadioGroup
          label="Dilution Control Priority"
          name="dilutionControl"
          options={[
            {
              value: 'normal',
              label: 'Normal',
              description: 'Standard equity allocation',
            },
            {
              value: 'high',
              label: 'High Priority',
              description: 'Minimize equity grants, preserve option pool',
            },
          ]}
          value={preferences.dilutionControlPriority}
          onChange={(value) =>
            updatePreferences({ dilutionControlPriority: value as PriorityLevel })
          }
        />
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h3 className="text-sm font-medium text-amber-800 mb-2">How Preferences Work</h3>
        <p className="text-sm text-amber-700">
          Setting a preference to &quot;High Priority&quot; will weight the optimizer toward that goal
          when generating packages. For example, high cash preservation will generate packages
          with lower base salaries but higher equity grants. You can&apos;t optimize everything
          at once - tradeoffs are inevitable.
        </p>
      </div>
    </div>
  );
}
