// SAFE Generator Types

export type SafeType =
  | 'post-money-cap'
  | 'post-money-discount'
  | 'post-money-mfn'
  | 'pre-money-cap'
  | 'pre-money-discount';

export type SafeRecommendation = 'strongly-recommended' | 'acceptable' | 'not-recommended';

export interface SafeTypeInfo {
  type: SafeType;
  name: string;
  shortDescription: string;
  longDescription: string;
  recommendation: SafeRecommendation;
  recommendationReason: string;
  marketData: string;
  pros: string[];
  cons: string[];
  whenToUse: string;
}

export const SAFE_TYPE_INFO: Record<SafeType, SafeTypeInfo> = {
  'post-money-cap': {
    type: 'post-money-cap',
    name: 'Post-Money SAFE with Valuation Cap',
    shortDescription: 'The industry standard. Clean, simple, investor-friendly.',
    longDescription: 'A post-money SAFE with a valuation cap means the investor\'s ownership percentage is calculated based on the post-money valuation cap, giving both parties clear expectations about dilution. The "post-money" designation means the cap already accounts for all SAFE holders and the option pool.',
    recommendation: 'strongly-recommended',
    recommendationReason: 'This is the YC-recommended standard. 61% of all SAFEs in 2024 used this structure, and 85%+ of early-stage rounds use post-money SAFEs.',
    marketData: '61% of SAFEs use valuation cap only (Carta 2024)',
    pros: [
      'Simple to understand and calculate ownership',
      'Clear dilution expectations for both parties',
      'Industry standard — investors expect it',
      'No negotiations over discount percentage',
      'Founders maintain control over the cap table math'
    ],
    cons: [
      'All dilution from future SAFEs affects founders, not investors',
      'Cap locks in a maximum valuation regardless of market conditions'
    ],
    whenToUse: 'Use this for nearly all SAFE raises. It\'s the default choice unless you have a specific reason to deviate.'
  },
  'post-money-discount': {
    type: 'post-money-discount',
    name: 'Post-Money SAFE with Discount Only',
    shortDescription: 'Investor gets a percentage discount on Series A price.',
    longDescription: 'A discount-only SAFE gives the investor a fixed percentage discount (typically 15-25%) on whatever price is set in the next priced round. There\'s no cap on valuation, so if your Series A is at a high valuation, the investor converts at that high price minus the discount.',
    recommendation: 'acceptable',
    recommendationReason: 'Less common but acceptable when you\'re confident about near-term fundraising and don\'t want to set a cap.',
    marketData: '8% of SAFEs use discount only (Carta 2024)',
    pros: [
      'No cap means unlimited upside for founders if valuation skyrockets',
      'Avoids setting a valuation number early',
      'Simpler than cap — just one number to negotiate'
    ],
    cons: [
      'Investors bear more risk, so they may push for larger discount',
      'Ownership uncertainty until priced round',
      'Less common, may signal inexperience to some investors'
    ],
    whenToUse: 'Consider when you\'re pre-product and uncomfortable setting any valuation, or when raising from friends/family who don\'t need downside protection.'
  },
  'post-money-mfn': {
    type: 'post-money-mfn',
    name: 'Post-Money SAFE with MFN (Uncapped)',
    shortDescription: 'No cap or discount — just a promise of equal treatment.',
    longDescription: 'An MFN (Most Favored Nation) SAFE has no cap and no discount. Instead, it promises the investor they\'ll receive terms at least as favorable as any future SAFE investors. If you later issue a SAFE with a $10M cap, the MFN holder can elect to convert using that cap.',
    recommendation: 'acceptable',
    recommendationReason: 'Useful for very early checks or bridge financing, but creates complexity if you issue capped SAFEs later.',
    marketData: 'Rarely used as a standalone structure',
    pros: [
      'Maximum flexibility for founders',
      'Good for very early, small checks',
      'Avoids all valuation discussions'
    ],
    cons: [
      'Creates complexity when you issue future SAFEs',
      'Investor has no downside protection',
      'Sophisticated investors may decline'
    ],
    whenToUse: 'Use for very early angel checks when you genuinely don\'t know what valuation to set and expect to raise more SAFEs soon.'
  },
  'pre-money-cap': {
    type: 'pre-money-cap',
    name: 'Pre-Money SAFE with Valuation Cap',
    shortDescription: 'The original YC SAFE format (now deprecated).',
    longDescription: 'Pre-money SAFEs calculate ownership based on the pre-money valuation, which can create confusion about actual dilution. Each new SAFE investor dilutes existing SAFE holders, making cap table math complex.',
    recommendation: 'not-recommended',
    recommendationReason: 'YC deprecated pre-money SAFEs in 2018 specifically because they caused cap table confusion. Post-money is now the standard.',
    marketData: 'Deprecated by YC in 2018; <15% of SAFEs today',
    pros: [
      'Some investors may be familiar with the older format'
    ],
    cons: [
      'Complex dilution math — even lawyers get it wrong',
      'Founders and investors often have different expectations',
      'Creates cap table confusion',
      'Signals you\'re using outdated documents'
    ],
    whenToUse: 'Only if an existing investor specifically requires it for portfolio consistency. Otherwise, always use post-money.'
  },
  'pre-money-discount': {
    type: 'pre-money-discount',
    name: 'Pre-Money SAFE with Discount Only',
    shortDescription: 'Outdated discount structure.',
    longDescription: 'Combines the complexity of pre-money math with discount-only pricing. Rarely used today.',
    recommendation: 'not-recommended',
    recommendationReason: 'Combines the downsides of pre-money complexity with discount-only uncertainty. No reason to use this.',
    marketData: 'Very rare',
    pros: [],
    cons: [
      'All the downsides of both pre-money and discount-only',
      'Complex and confusing',
      'Not industry standard'
    ],
    whenToUse: 'Don\'t use this. If you need a discount, use post-money discount instead.'
  }
};

export interface SideLetterOption {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  marketNorm: string;
  recommendation: 'standard' | 'negotiable' | 'unusual';
  typicalThreshold?: string;
  defaultEnabled: boolean;
  fields?: SideLetterField[];
}

export interface SideLetterField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox';
  placeholder?: string;
  defaultValue?: string | number | boolean;
  options?: { value: string; label: string }[];
  hint?: string;
}

export const SIDE_LETTER_OPTIONS: SideLetterOption[] = [
  {
    id: 'pro-rata',
    name: 'Pro-Rata Rights',
    description: 'Right to invest in future rounds to maintain ownership percentage.',
    longDescription: 'Pro-rata rights allow the investor to participate in future financing rounds to maintain their percentage ownership. This is one of the most commonly requested investor rights for SAFEs.',
    marketNorm: 'Standard for checks above $100K. Very common for checks above $250K.',
    recommendation: 'standard',
    typicalThreshold: '$100,000+',
    defaultEnabled: true,
    fields: [
      {
        id: 'pro-rata-threshold',
        label: 'Minimum Investment for Pro-Rata',
        type: 'number',
        placeholder: '100000',
        defaultValue: 100000,
        hint: 'Investors must invest at least this amount to receive pro-rata rights'
      }
    ]
  },
  {
    id: 'info-rights',
    name: 'Information Rights',
    description: 'Right to receive periodic financial and business updates.',
    longDescription: 'Information rights entitle the investor to receive regular updates about the company\'s financial performance, typically including annual financial statements and quarterly updates.',
    marketNorm: 'Standard for lead investors or major checks. Often granted to all SAFE investors informally.',
    recommendation: 'standard',
    typicalThreshold: '$250,000+',
    defaultEnabled: true,
    fields: [
      {
        id: 'info-rights-threshold',
        label: 'Minimum Investment for Info Rights',
        type: 'number',
        placeholder: '250000',
        defaultValue: 250000,
        hint: 'Investors must invest at least this amount to receive formal information rights'
      },
      {
        id: 'info-rights-frequency',
        label: 'Update Frequency',
        type: 'select',
        defaultValue: 'quarterly',
        options: [
          { value: 'monthly', label: 'Monthly' },
          { value: 'quarterly', label: 'Quarterly (Standard)' },
          { value: 'annually', label: 'Annually' }
        ],
        hint: 'How often the company will provide formal updates'
      }
    ]
  },
  {
    id: 'mfn',
    name: 'Most Favored Nation (MFN)',
    description: 'Promise to receive terms as favorable as any future SAFE investor.',
    longDescription: 'An MFN clause guarantees that if you issue SAFEs with better terms (lower cap, higher discount) to future investors, this investor can elect to receive those better terms. This protects early investors from being disadvantaged by later deals.',
    marketNorm: 'Common for early investors, especially when using higher caps. Less relevant for your last SAFE before a priced round.',
    recommendation: 'negotiable',
    defaultEnabled: false,
    fields: []
  },
  {
    id: 'board-observer',
    name: 'Board Observer Rights',
    description: 'Right to attend board meetings as a non-voting observer.',
    longDescription: 'Board observer rights allow the investor (or their designee) to attend board meetings and receive board materials, but without voting power. This is typically reserved for lead investors or those writing very large checks.',
    marketNorm: 'Unusual for SAFE investors. More common in priced rounds. Reserve for lead investors or strategic partners.',
    recommendation: 'unusual',
    typicalThreshold: '$500,000+ or Lead Investor',
    defaultEnabled: false,
    fields: []
  },
  {
    id: 'major-investor',
    name: 'Major Investor Status',
    description: 'Designation as a "Major Investor" with enhanced rights.',
    longDescription: 'Major Investor status is typically defined in your future priced round documents and grants enhanced rights (info rights, pro-rata, etc.). This side letter pre-commits to granting that status when the priced round occurs.',
    marketNorm: 'Standard for large SAFE investments ($250K+) from institutional investors.',
    recommendation: 'standard',
    typicalThreshold: '$250,000+',
    defaultEnabled: true,
    fields: [
      {
        id: 'major-investor-threshold',
        label: 'Major Investor Threshold',
        type: 'number',
        placeholder: '250000',
        defaultValue: 250000,
        hint: 'Investment amount required to be designated a Major Investor'
      }
    ]
  }
];

export interface CompanyInfo {
  legalName: string;
  stateOfIncorporation: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  founderName: string;
  founderTitle: string;
  founderEmail: string;
}

export interface InvestorInfo {
  type: 'individual' | 'entity';
  legalName: string;
  entityName?: string;
  entityType?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  email: string;
  isAccredited: boolean;
}

export interface SafeTerms {
  safeType: SafeType;
  investmentAmount: number;
  valuationCap?: number;
  discountRate?: number;
  purchaseDate: string;
}

export interface SideLetterSelections {
  [optionId: string]: {
    enabled: boolean;
    fields?: Record<string, string | number | boolean>;
  };
}

export interface SafeWizardState {
  currentStep: number;
  safeType: SafeType;
  safeTerms: Partial<SafeTerms>;
  companyInfo: Partial<CompanyInfo>;
  investorInfo: Partial<InvestorInfo>;
  sideLetters: SideLetterSelections;
  generatedDocuments?: GeneratedDocuments;
}

export interface GeneratedDocuments {
  safe: string;
  sideLetter?: string;
  summary: DocumentSummary;
}

export interface DocumentSummary {
  investorOwnership: string;
  dilutionScenario: string;
  keyTerms: { label: string; value: string }[];
  warnings: string[];
  nextSteps: string[];
}

// Valuation cap benchmarks by stage
export const VALUATION_CAP_BENCHMARKS = {
  'pre-seed': {
    low: 4000000,
    median: 6000000,
    high: 10000000,
    description: 'Pre-seed caps typically range from $4M-$10M depending on team and traction'
  },
  'seed': {
    low: 8000000,
    median: 12000000,
    high: 20000000,
    description: 'Seed stage caps typically range from $8M-$20M depending on progress'
  },
  'post-seed': {
    low: 15000000,
    median: 25000000,
    high: 40000000,
    description: 'Post-seed/bridge caps typically range from $15M-$40M'
  }
};

// Discount rate benchmarks
export const DISCOUNT_BENCHMARKS = {
  low: 10,
  standard: 20,
  high: 25,
  description: 'The standard discount is 20%. Discounts below 15% or above 25% are unusual.'
};

// Helper function to calculate ownership
export function calculateOwnership(
  investmentAmount: number,
  valuationCap: number,
  isPostMoney: boolean = true
): number {
  if (isPostMoney) {
    return (investmentAmount / valuationCap) * 100;
  }
  // Pre-money calculation (simplified)
  return (investmentAmount / (valuationCap + investmentAmount)) * 100;
}

// Helper to format currency
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Helper to format large numbers
export function formatValuation(amount: number): string {
  if (amount >= 1000000000) {
    return `$${(amount / 1000000000).toFixed(1)}B`;
  }
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return formatUSD(amount);
}

// US States for incorporation
export const US_STATES = [
  { value: 'DE', label: 'Delaware' },
  { value: 'CA', label: 'California' },
  { value: 'NY', label: 'New York' },
  { value: 'TX', label: 'Texas' },
  { value: 'WA', label: 'Washington' },
  { value: 'FL', label: 'Florida' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'CO', label: 'Colorado' },
  { value: 'IL', label: 'Illinois' },
  { value: 'GA', label: 'Georgia' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'NV', label: 'Nevada' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DC', label: 'District of Columbia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
];
