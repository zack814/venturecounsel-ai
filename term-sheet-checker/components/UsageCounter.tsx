'use client';

import { useEffect, useState } from 'react';

interface UsageStats {
  safe_generator: number;
  term_sheet_analyzer: number;
  total: number;
}

interface UsageCounterProps {
  variant?: 'compact' | 'detailed';
  className?: string;
}

export default function UsageCounter({ variant = 'compact', className = '' }: UsageCounterProps) {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading || !stats || stats.total === 0) {
    return null; // Don't show anything if no stats yet
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toLocaleString();
  };

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-full ${className}`}>
        <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
        <span className="text-teal-800 text-sm font-medium">
          {formatNumber(stats.total)} documents analyzed
        </span>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-6 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Platform Usage
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-3xl font-bold text-navy-900">{formatNumber(stats.safe_generator)}</p>
          <p className="text-sm text-gray-600">SAFEs Generated</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-navy-900">{formatNumber(stats.term_sheet_analyzer)}</p>
          <p className="text-sm text-gray-600">Term Sheets Analyzed</p>
        </div>
      </div>
    </div>
  );
}

// Helper function to increment usage (call from tool completion)
export async function incrementUsage(tool: 'safe_generator' | 'term_sheet_analyzer' | 'contract_review' | 'comp_optimizer') {
  try {
    await fetch('/api/stats/increment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool }),
    });
  } catch (error) {
    console.error('Failed to increment usage:', error);
  }
}
