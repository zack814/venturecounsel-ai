'use client';

import React from 'react';
import { useWizard } from '../WizardContext';
import { Input } from '@/components/comp-optimizer/ui/Input';

export function Step4Constraints() {
  const { state, updateConstraints, updateTokenProgram } = useWizard();
  const { constraints, tokenProgram } = state;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Constraints</h2>
        <p className="mt-1 text-sm text-slate-600">
          Set budget constraints to ensure packages stay within your limits.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Cash Budget Ceiling (Annual)"
            type="number"
            min={0}
            step={5000}
            placeholder="e.g., 200000"
            value={constraints.cashBudgetCeiling ?? ''}
            onChange={(e) => updateConstraints({
              cashBudgetCeiling: e.target.value ? Number(e.target.value) : undefined
            })}
            hint="Maximum annual cash comp (base + bonus)"
          />

          <Input
            label="Max Equity Grant (% FD)"
            type="number"
            min={0}
            max={100}
            step={0.01}
            placeholder="e.g., 1.0"
            value={constraints.maxEquityPercent ?? ''}
            onChange={(e) => updateConstraints({
              maxEquityPercent: e.target.value ? Number(e.target.value) : undefined
            })}
            hint="Maximum % of fully diluted shares"
          />
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            id="enableTokens"
            checked={tokenProgram.enabled ?? false}
            onChange={(e) => updateTokenProgram({ enabled: e.target.checked })}
            className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="enableTokens" className="text-lg font-medium text-slate-900">
            Include Token Compensation
          </label>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Enable this if your company has a token program and wants to include token grants in packages.
        </p>

        {tokenProgram.enabled && (
          <div className="grid gap-6 md:grid-cols-2 p-4 bg-slate-50 rounded-lg">
            <Input
              label="Total Token Supply"
              type="number"
              min={0}
              placeholder="e.g., 1000000000"
              value={tokenProgram.totalSupply ?? ''}
              onChange={(e) => updateTokenProgram({
                totalSupply: e.target.value ? Number(e.target.value) : undefined
              })}
              hint="Total tokens in existence"
            />

            <Input
              label="Incentive Pool Size"
              type="number"
              min={0}
              placeholder="e.g., 100000000"
              value={tokenProgram.incentivePoolSize ?? ''}
              onChange={(e) => updateTokenProgram({
                incentivePoolSize: e.target.value ? Number(e.target.value) : undefined
              })}
              hint="Tokens reserved for team incentives"
            />

            <Input
              label="Remaining Pool"
              type="number"
              min={0}
              placeholder="e.g., 80000000"
              value={tokenProgram.remainingPool ?? ''}
              onChange={(e) => updateTokenProgram({
                remainingPool: e.target.value ? Number(e.target.value) : undefined
              })}
              hint="Unallocated tokens in pool"
            />

            <Input
              label="Lockup Period (months)"
              type="number"
              min={0}
              placeholder="e.g., 12"
              value={tokenProgram.lockupMonths ?? ''}
              onChange={(e) => updateTokenProgram({
                lockupMonths: e.target.value ? Number(e.target.value) : undefined
              })}
              hint="Post-vest transfer restriction"
            />

            <Input
              label="Current Token Price ($)"
              type="number"
              min={0}
              step={0.0001}
              placeholder="e.g., 0.05"
              value={tokenProgram.currentTokenPrice ?? ''}
              onChange={(e) => updateTokenProgram({
                currentTokenPrice: e.target.value ? Number(e.target.value) : undefined
              })}
              hint="For expected value modeling (optional)"
            />
          </div>
        )}
      </div>
    </div>
  );
}
