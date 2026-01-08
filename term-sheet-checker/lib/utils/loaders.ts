// =============================================================================
// DATA LOADERS - Load market norms and clause library
// =============================================================================

import { IntakeContext } from '../types';
import normsData from '@/data/norms/v1-2025-q1.json';
import clauseLibrary from '@/data/clauses/library-v1.json';

/**
 * Load relevant market norms based on context
 */
export function loadMarketNorms(context: IntakeContext): string {
  const { stage, geography } = context;

  // Filter norms relevant to this context
  const relevantNorms: any = {};

  for (const [termType, stageData] of Object.entries(normsData.norms)) {
    const stageRecord = stageData as Record<string, Record<string, unknown>>;
    if (stageRecord[stage] && stageRecord[stage][geography]) {
      relevantNorms[termType] = {
        ...stageRecord[stage][geography],
        termType
      };
    } else if (stageRecord['all-stages'] && stageRecord['all-stages'][geography]) {
      relevantNorms[termType] = {
        ...stageRecord['all-stages'][geography],
        termType
      };
    } else if (stageRecord[stage] && stageRecord[stage]['silicon-valley']) {
      // Fallback to Silicon Valley if specific geography not available
      relevantNorms[termType] = {
        ...stageRecord[stage]['silicon-valley'],
        termType,
        note: 'Using Silicon Valley norms as proxy'
      };
    }
  }

  return JSON.stringify({
    context: {
      stage,
      geography,
      dataVersion: normsData.version,
      effectiveDate: normsData.effectiveDate,
      sources: normsData.sources
    },
    norms: relevantNorms
  }, null, 2);
}

/**
 * Load clause library for specific term types
 */
export function loadClauseLibrary(termTypes?: string[]): string {
  if (!termTypes || termTypes.length === 0) {
    return JSON.stringify(clauseLibrary, null, 2);
  }

  // Filter to specific term types
  const filtered: any = {
    version: clauseLibrary.version,
    lastUpdated: clauseLibrary.lastUpdated,
    clauses: {}
  };

  const clauses = clauseLibrary.clauses as Record<string, unknown>;
  for (const termType of termTypes) {
    if (clauses[termType]) {
      filtered.clauses[termType] = clauses[termType];
    }
  }

  return JSON.stringify(filtered, null, 2);
}

/**
 * Get clause for specific term type
 */
export function getClause(termType: string) {
  return (clauseLibrary.clauses as Record<string, unknown>)[termType] || null;
}

/**
 * Get all market norms data (for reference)
 */
export function getAllNorms() {
  return normsData;
}
