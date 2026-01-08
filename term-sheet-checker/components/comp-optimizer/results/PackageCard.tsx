'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatPercent } from '@/lib/utils';
import type { CompPackage } from '@/lib/comp-schemas';

interface PackageCardProps {
  package: CompPackage;
  isSelected?: boolean;
  onClick?: () => void;
}

export function PackageCard({ package: pkg, isSelected, onClick }: PackageCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'relative rounded-xl border-2 p-5 cursor-pointer transition-all',
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm',
        pkg.isRecommended && 'ring-2 ring-green-500 ring-offset-2'
      )}
    >
      {pkg.isRecommended && (
        <div className="absolute -top-3 left-4 px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded-full">
          Recommended
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{pkg.name}</h3>
          <p className="text-sm text-slate-500">
            Overall Score: {pkg.scores.overallScore}/100
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-900">
            {formatCurrency(pkg.baseSalary)}
          </div>
          <div className="text-sm text-slate-500">base salary</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-slate-500">Bonus Target</div>
          <div className="font-medium text-slate-900">{formatCurrency(pkg.bonusTarget)}</div>
        </div>
        <div>
          <div className="text-sm text-slate-500">Equity (%FD)</div>
          <div className="font-medium text-slate-900">{formatPercent(pkg.equityPercentFD, 3)}</div>
        </div>
        <div>
          <div className="text-sm text-slate-500">Options</div>
          <div className="font-medium text-slate-900">{pkg.equityOptionCount.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-sm text-slate-500">Monthly Burn</div>
          <div className="font-medium text-slate-900">{formatCurrency(pkg.burnDeltaMonthly)}</div>
        </div>
      </div>

      {pkg.tokenAmount && pkg.tokenPercentSupply && (
        <div className="border-t border-slate-200 pt-3 mb-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate-500">Token Grant</div>
              <div className="font-medium text-slate-900">{pkg.tokenAmount.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Token (%Supply)</div>
              <div className="font-medium text-slate-900">{formatPercent(pkg.tokenPercentSupply, 4)}</div>
            </div>
          </div>
        </div>
      )}

      {pkg.expectedValueBand && (
        <div className="border-t border-slate-200 pt-3">
          <div className="text-sm text-slate-500 mb-1">Expected Value Range</div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-600">{formatCurrency(pkg.expectedValueBand.low)}</span>
            <span className="text-slate-400">→</span>
            <span className="font-medium text-slate-900">{formatCurrency(pkg.expectedValueBand.base)}</span>
            <span className="text-slate-400">→</span>
            <span className="text-slate-600">{formatCurrency(pkg.expectedValueBand.high)}</span>
          </div>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-slate-200">
        <div className="flex gap-2 flex-wrap">
          <ScoreBadge label="Market" score={pkg.scores.marketCompetitiveness} />
          <ScoreBadge label="Cash" score={pkg.scores.cashFeasibility} />
          <ScoreBadge label="Dilution" score={pkg.scores.dilutionScore} />
          <ScoreBadge label="Retention" score={pkg.scores.retentionScore} />
        </div>
      </div>
    </div>
  );
}

function ScoreBadge({ label, score }: { label: string; score: number }) {
  const getColor = () => {
    if (score >= 70) return 'bg-green-100 text-green-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full', getColor())}>
      {label}: {score}
    </span>
  );
}
