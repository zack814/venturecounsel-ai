'use client';

import React from 'react';
import { useWizard } from '../WizardContext';
import { Card, CardContent } from '@/components/comp-optimizer/ui/Card';
import { formatCurrency } from '@/lib/utils';

export function Step6Generate() {
  const { state } = useWizard();
  const { companyContext, roleProfile, candidateContext, tokenProgram, constraints, preferences } = state;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Review & Generate</h2>
        <p className="mt-1 text-sm text-slate-600">
          Review your inputs before generating compensation packages.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-4">
            <h3 className="font-medium text-slate-900 mb-3">Company Context</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Stage</dt>
                <dd className="text-slate-900 font-medium">{companyContext.stage}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Market</dt>
                <dd className="text-slate-900 font-medium">{companyContext.geoMarket}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Headcount</dt>
                <dd className="text-slate-900 font-medium">{companyContext.headcountRange}</dd>
              </div>
              {companyContext.runwayMonths && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Runway</dt>
                  <dd className="text-slate-900 font-medium">{companyContext.runwayMonths} months</dd>
                </div>
              )}
              {companyContext.capTable?.fdShares && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">FD Shares</dt>
                  <dd className="text-slate-900 font-medium">{companyContext.capTable.fdShares.toLocaleString()}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <h3 className="font-medium text-slate-900 mb-3">Role Details</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Title</dt>
                <dd className="text-slate-900 font-medium">{roleProfile.title || 'Not specified'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Family</dt>
                <dd className="text-slate-900 font-medium">{roleProfile.jobFamily}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Level</dt>
                <dd className="text-slate-900 font-medium">{roleProfile.jobLevel}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Location</dt>
                <dd className="text-slate-900 font-medium">{roleProfile.locationType} ({roleProfile.geo})</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <h3 className="font-medium text-slate-900 mb-3">Candidate Context</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Competing Offers</dt>
                <dd className="text-slate-900 font-medium">{candidateContext.competingOffersLevel}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Risk Tolerance</dt>
                <dd className="text-slate-900 font-medium">{candidateContext.riskTolerance}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Start Urgency</dt>
                <dd className="text-slate-900 font-medium">{candidateContext.startUrgency}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <h3 className="font-medium text-slate-900 mb-3">Constraints & Preferences</h3>
            <dl className="space-y-2 text-sm">
              {constraints.cashBudgetCeiling && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Cash Budget</dt>
                  <dd className="text-slate-900 font-medium">{formatCurrency(constraints.cashBudgetCeiling)}</dd>
                </div>
              )}
              {constraints.maxEquityPercent && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Max Equity</dt>
                  <dd className="text-slate-900 font-medium">{constraints.maxEquityPercent}% FD</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-slate-500">Token Program</dt>
                <dd className="text-slate-900 font-medium">{tokenProgram.enabled ? 'Enabled' : 'Disabled'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Retention Priority</dt>
                <dd className="text-slate-900 font-medium">{preferences.retentionPriority}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Cash Preservation</dt>
                <dd className="text-slate-900 font-medium">{preferences.cashPreservationPriority}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Dilution Control</dt>
                <dd className="text-slate-900 font-medium">{preferences.dilutionControlPriority}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          Click &quot;Generate Packages&quot; to create 3-5 recommended compensation packages based on your inputs.
          Results will include cash, equity, and optional token allocations with market benchmarking.
        </p>
      </div>
    </div>
  );
}
