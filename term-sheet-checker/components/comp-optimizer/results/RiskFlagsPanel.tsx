'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { RiskFlag } from '@/lib/comp-schemas';

interface RiskFlagsPanelProps {
  flags: RiskFlag[];
}

export function RiskFlagsPanel({ flags }: RiskFlagsPanelProps) {
  if (flags.length === 0) {
    return null;
  }

  const criticalFlags = flags.filter((f) => f.severity === 'critical');
  const warningFlags = flags.filter((f) => f.severity === 'warning');
  const infoFlags = flags.filter((f) => f.severity === 'info');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Risk Flags & Compliance Notes</h3>

      {criticalFlags.length > 0 && (
        <div className="space-y-2">
          {criticalFlags.map((flag, index) => (
            <FlagItem key={`critical-${index}`} flag={flag} />
          ))}
        </div>
      )}

      {warningFlags.length > 0 && (
        <div className="space-y-2">
          {warningFlags.map((flag, index) => (
            <FlagItem key={`warning-${index}`} flag={flag} />
          ))}
        </div>
      )}

      {infoFlags.length > 0 && (
        <div className="space-y-2">
          {infoFlags.map((flag, index) => (
            <FlagItem key={`info-${index}`} flag={flag} />
          ))}
        </div>
      )}
    </div>
  );
}

function FlagItem({ flag }: { flag: RiskFlag }) {
  const severityStyles = {
    critical: {
      container: 'bg-red-50 border-red-200',
      icon: 'text-red-500',
      title: 'text-red-800',
      text: 'text-red-700',
    },
    warning: {
      container: 'bg-amber-50 border-amber-200',
      icon: 'text-amber-500',
      title: 'text-amber-800',
      text: 'text-amber-700',
    },
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-500',
      title: 'text-blue-800',
      text: 'text-blue-700',
    },
  };

  const styles = severityStyles[flag.severity];

  return (
    <div className={cn('p-4 rounded-lg border', styles.container)}>
      <div className="flex gap-3">
        <div className={cn('flex-shrink-0 mt-0.5', styles.icon)}>
          {flag.severity === 'critical' && (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {flag.severity === 'warning' && (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {flag.severity === 'info' && (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <h4 className={cn('font-medium', styles.title)}>{flag.title}</h4>
          <p className={cn('text-sm mt-1', styles.text)}>{flag.description}</p>
          {flag.actionRequired && (
            <p className={cn('text-sm mt-2 font-medium', styles.title)}>
              Action: {flag.actionRequired}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
