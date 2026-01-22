// ============================================
// SHARED DISPLAY LABELS
// ============================================
// This file contains shared display labels used across multiple tools.
//
// For Zod schemas, import directly from:
//   - @/lib/comp-schemas (compensation-related types)
//   - @/lib/offer-evaluator-schemas (offer evaluation types)
//   - @/lib/token-risk-schemas (token risk analysis types)
//   - @/lib/safe-types (SAFE document types)
//   - @/lib/types/index (term sheet types)

export const STAGE_LABELS: Record<string, string> = {
  'pre-seed': 'Pre-Seed',
  'seed': 'Seed',
  'series-a': 'Series A',
  'series-b': 'Series B',
  'series-c+': 'Series C+',
};

export const GEO_LABELS: Record<string, string> = {
  sv: 'San Francisco / Bay Area',
  nyc: 'New York City',
  la: 'Los Angeles',
  seattle: 'Seattle',
  austin: 'Austin',
  boston: 'Boston',
  denver: 'Denver',
  chicago: 'Chicago',
  'remote-us': 'Remote (US)',
  international: 'International',
};

export const HEADCOUNT_LABELS: Record<string, string> = {
  '1-10': '1-10 employees',
  '11-25': '11-25 employees',
  '26-50': '26-50 employees',
  '51-100': '51-100 employees',
  '101-250': '101-250 employees',
  '250+': '250+ employees',
};

export const JOB_FAMILY_LABELS: Record<string, string> = {
  engineering: 'Engineering',
  product: 'Product',
  design: 'Design',
  'data-science': 'Data Science',
  marketing: 'Marketing',
  sales: 'Sales',
  operations: 'Operations',
  finance: 'Finance',
  legal: 'Legal',
  'hr-people': 'HR / People',
  'customer-success': 'Customer Success',
  executive: 'Executive',
};

export const JOB_LEVEL_LABELS: Record<string, string> = {
  intern: 'Intern',
  junior: 'Junior / Entry-Level',
  mid: 'Mid-Level',
  senior: 'Senior',
  staff: 'Staff',
  principal: 'Principal',
  director: 'Director',
  vp: 'VP',
  'c-level': 'C-Level',
};

export const EQUITY_TYPE_LABELS: Record<string, string> = {
  iso: 'Incentive Stock Options (ISOs)',
  nso: 'Non-Qualified Stock Options (NSOs)',
  rsu: 'Restricted Stock Units (RSUs)',
  'restricted-stock': 'Restricted Stock',
};
