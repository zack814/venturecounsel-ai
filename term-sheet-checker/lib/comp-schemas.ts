import { z } from 'zod';

// ============================================
// ENUMS AND CONSTANTS
// ============================================

export const CompanyStage = z.enum(['pre-seed', 'seed', 'series-a', 'series-b', 'series-c+']);
export type CompanyStage = z.infer<typeof CompanyStage>;

export const GeoMarket = z.enum(['sv', 'nyc', 'la', 'seattle', 'austin', 'boston', 'denver', 'chicago', 'remote-us', 'international']);
export type GeoMarket = z.infer<typeof GeoMarket>;

export const HeadcountRange = z.enum(['1-10', '11-25', '26-50', '51-100', '101-250', '250+']);
export type HeadcountRange = z.infer<typeof HeadcountRange>;

export const JobFamily = z.enum([
  'engineering',
  'product',
  'design',
  'data-science',
  'marketing',
  'sales',
  'operations',
  'finance',
  'legal',
  'hr-people',
  'customer-success',
  'executive'
]);
export type JobFamily = z.infer<typeof JobFamily>;

export const JobLevel = z.enum([
  'intern',
  'junior',
  'mid',
  'senior',
  'staff',
  'principal',
  'director',
  'vp',
  'c-level'
]);
export type JobLevel = z.infer<typeof JobLevel>;

export const LocationType = z.enum(['onsite', 'remote', 'hybrid']);
export type LocationType = z.infer<typeof LocationType>;

export const CompetingOffersLevel = z.enum(['none', 'some', 'high']);
export type CompetingOffersLevel = z.infer<typeof CompetingOffersLevel>;

export const RiskTolerance = z.enum(['low', 'medium', 'high']);
export type RiskTolerance = z.infer<typeof RiskTolerance>;

export const StartUrgency = z.enum(['immediate', 'standard', 'flexible']);
export type StartUrgency = z.infer<typeof StartUrgency>;

export const PriorityLevel = z.enum(['high', 'normal']);
export type PriorityLevel = z.infer<typeof PriorityLevel>;

export const EquityType = z.enum(['iso', 'nso', 'rsu', 'restricted-stock']);
export type EquityType = z.infer<typeof EquityType>;

// ============================================
// CORE DATA MODELS
// ============================================

export const CapTableSnapshot = z.object({
  fdShares: z.number().positive().describe('Fully diluted shares outstanding'),
  optionPoolSize: z.number().nonnegative().describe('Total option pool size in shares'),
  optionPoolRemaining: z.number().nonnegative().describe('Remaining shares in option pool'),
  currentPricePerShare: z.number().positive().optional().describe('Current price per share (from 409A or last round)'),
  last409ADate: z.string().optional().describe('Date of last 409A valuation (ISO format)'),
  lastRoundValuation: z.number().positive().optional().describe('Post-money valuation from last round'),
});
export type CapTableSnapshot = z.infer<typeof CapTableSnapshot>;

export const CompanyContext = z.object({
  stage: CompanyStage,
  geoMarket: GeoMarket.default('sv'),
  headcountRange: HeadcountRange,
  runwayMonths: z.number().positive().optional().describe('Current runway in months'),
  cashBudgetCeiling: z.number().positive().optional().describe('Maximum annual cash comp budget for this role'),
  capTable: CapTableSnapshot.optional(),
});
export type CompanyContext = z.infer<typeof CompanyContext>;

export const RoleProfile = z.object({
  jobFamily: JobFamily,
  jobLevel: JobLevel,
  department: z.string().optional(),
  title: z.string().describe('Original title input by user'),
  normalizedTitle: z.string().describe('Standardized title'),
  locationType: LocationType.default('onsite'),
  geo: GeoMarket.default('sv'),
});
export type RoleProfile = z.infer<typeof RoleProfile>;

export const CandidateContext = z.object({
  competingOffersLevel: CompetingOffersLevel.default('none'),
  riskTolerance: RiskTolerance.default('medium'),
  startUrgency: StartUrgency.default('standard'),
});
export type CandidateContext = z.infer<typeof CandidateContext>;

export const VestingSchedule = z.object({
  totalMonths: z.number().positive().default(48),
  cliffMonths: z.number().nonnegative().default(12),
  vestingFrequency: z.enum(['monthly', 'quarterly', 'annually']).default('monthly'),
});
export type VestingSchedule = z.infer<typeof VestingSchedule>;

export const TokenProgram = z.object({
  enabled: z.boolean().default(false),
  totalSupply: z.number().positive().optional(),
  incentivePoolSize: z.number().positive().optional(),
  remainingPool: z.number().nonnegative().optional(),
  tokenVestingDefault: VestingSchedule.optional(),
  lockupMonths: z.number().nonnegative().optional(),
  currentTokenPrice: z.number().positive().optional().describe('Current estimated token price for scenario modeling'),
});
export type TokenProgram = z.infer<typeof TokenProgram>;

export const Constraints = z.object({
  cashBudgetCeiling: z.number().positive().optional(),
  equityPoolAvailable: z.number().nonnegative().optional().describe('Shares available in equity pool'),
  maxEquityPercent: z.number().min(0).max(100).optional().describe('Max FD% willing to grant'),
  tokenPoolAvailable: z.number().nonnegative().optional(),
});
export type Constraints = z.infer<typeof Constraints>;

export const Preferences = z.object({
  retentionPriority: PriorityLevel.default('normal'),
  cashPreservationPriority: PriorityLevel.default('normal'),
  dilutionControlPriority: PriorityLevel.default('normal'),
});
export type Preferences = z.infer<typeof Preferences>;

// ============================================
// EXPECTED VALUE MODELING
// ============================================

export const ScenarioAssumptions = z.object({
  exitMultiple: z.number().positive().describe('Exit multiple on last valuation'),
  dilutionFactor: z.number().min(0).max(1).describe('Expected dilution factor (1 = no dilution, 0.5 = 50% diluted)'),
  timeToLiquidityYears: z.number().positive().describe('Years until liquidity event'),
  probabilityWeight: z.number().min(0).max(1).describe('Probability weight for this scenario'),
});
export type ScenarioAssumptions = z.infer<typeof ScenarioAssumptions>;

export const ExpectedValueBand = z.object({
  low: z.number().describe('Low case expected value'),
  base: z.number().describe('Base case expected value'),
  high: z.number().describe('High case expected value'),
  assumptions: z.object({
    lowCase: ScenarioAssumptions,
    baseCase: ScenarioAssumptions,
    highCase: ScenarioAssumptions,
  }),
});
export type ExpectedValueBand = z.infer<typeof ExpectedValueBand>;

// ============================================
// COMPENSATION PACKAGE
// ============================================

export const CompPackage = z.object({
  id: z.string(),
  name: z.string().describe('Package type name (e.g., "Cash-Heavy", "Balanced")'),

  // Cash components
  baseSalary: z.number().nonnegative(),
  bonusTarget: z.number().nonnegative().default(0).describe('Target bonus as annual dollar amount'),
  signingBonus: z.number().nonnegative().optional(),

  // Equity components
  equityType: EquityType,
  equityPercentFD: z.number().min(0).max(100).describe('Equity grant as % of fully diluted shares'),
  equityOptionCount: z.number().nonnegative().describe('Number of options/shares'),
  vestingSchedule: VestingSchedule,
  strikePrice: z.number().positive().optional().describe('Strike price (for options)'),

  // Token components (optional)
  tokenAmount: z.number().nonnegative().optional(),
  tokenPercentSupply: z.number().min(0).max(100).optional(),
  tokenVestingSchedule: VestingSchedule.optional(),

  // Computed metrics
  employerCostAnnual: z.number().describe('Total annual employer cost including benefits/taxes'),
  burnDeltaMonthly: z.number().describe('Monthly cash burn impact'),
  poolImpactPercent: z.number().describe('Percentage of remaining pool consumed'),
  poolRemainingAfter: z.number().describe('Pool remaining after this grant'),

  // Expected value
  expectedValueBand: ExpectedValueBand.optional(),

  // Scoring
  scores: z.object({
    marketCompetitiveness: z.number().min(0).max(100),
    cashFeasibility: z.number().min(0).max(100),
    dilutionScore: z.number().min(0).max(100),
    retentionScore: z.number().min(0).max(100),
    overallScore: z.number().min(0).max(100),
  }),

  // Recommendation metadata
  isRecommended: z.boolean().default(false),
  recommendationRationale: z.string().optional(),
});
export type CompPackage = z.infer<typeof CompPackage>;

// ============================================
// RISK FLAGS
// ============================================

export const RiskFlagType = z.enum([
  '409a-dependency',
  'iso-limit',
  'iso-nso-selection',
  '83b-election',
  'token-tax-withholding',
  'token-transfer-restriction',
  'pool-exhaustion',
  'runway-impact',
  'non-us-jurisdiction',
  'board-approval-required'
]);
export type RiskFlagType = z.infer<typeof RiskFlagType>;

export const RiskFlag = z.object({
  type: RiskFlagType,
  severity: z.enum(['info', 'warning', 'critical']),
  title: z.string(),
  description: z.string(),
  actionRequired: z.string().optional(),
});
export type RiskFlag = z.infer<typeof RiskFlag>;

// ============================================
// OFFER LANGUAGE BLOCKS
// ============================================

export const OfferLanguageBlock = z.object({
  id: z.string(),
  category: z.enum(['equity-grant', 'vesting', 'token-grant', 'negotiation', 'general']),
  title: z.string(),
  content: z.string(),
  variables: z.record(z.string(), z.string()).optional().describe('Variables substituted in content'),
});
export type OfferLanguageBlock = z.infer<typeof OfferLanguageBlock>;

// ============================================
// NEGOTIATION GUIDANCE
// ============================================

export const NegotiationLever = z.object({
  lever: z.string().describe('What can be adjusted'),
  direction: z.enum(['increase', 'decrease']),
  impact: z.string().describe('Impact on the offer'),
  suggestedTrade: z.string().describe('What to trade for this adjustment'),
});
export type NegotiationLever = z.infer<typeof NegotiationLever>;

// ============================================
// FULL RECOMMENDATION REPORT
// ============================================

export const RecommendationReport = z.object({
  id: z.string(),
  createdAt: z.string().describe('ISO timestamp'),

  // Input context
  companyContext: CompanyContext,
  roleProfile: RoleProfile,
  candidateContext: CandidateContext,
  tokenProgram: TokenProgram.optional(),
  constraints: Constraints,
  preferences: Preferences,

  // Outputs
  recommendedPackages: z.array(CompPackage).min(3).max(5),
  bestFitPackage: CompPackage,

  // Guidance
  negotiationLevers: z.array(NegotiationLever),
  riskFlags: z.array(RiskFlag),
  offerLanguageBlocks: z.array(OfferLanguageBlock),

  // Market context
  marketBenchmarks: z.object({
    salaryPercentiles: z.object({
      p25: z.number(),
      p50: z.number(),
      p75: z.number(),
    }),
    equityPercentiles: z.object({
      p25: z.number().describe('% FD at 25th percentile'),
      p50: z.number(),
      p75: z.number(),
    }),
  }),

  // Confidence
  confidenceScore: z.number().min(0).max(100),
  confidenceNotes: z.array(z.string()),
});
export type RecommendationReport = z.infer<typeof RecommendationReport>;

// ============================================
// WIZARD STATE
// ============================================

export const WizardState = z.object({
  currentStep: z.number().min(1).max(6),
  companyContext: CompanyContext.partial(),
  roleProfile: RoleProfile.partial(),
  candidateContext: CandidateContext.partial(),
  tokenProgram: TokenProgram.partial(),
  constraints: Constraints.partial(),
  preferences: Preferences.partial(),
});
export type WizardState = z.infer<typeof WizardState>;

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export const NormalizeRoleRequest = z.object({
  title: z.string(),
  context: z.string().optional().describe('Additional context about the role'),
});
export type NormalizeRoleRequest = z.infer<typeof NormalizeRoleRequest>;

export const NormalizeRoleResponse = z.object({
  roleProfile: RoleProfile,
  confidence: z.number().min(0).max(100),
  alternativeMappings: z.array(z.object({
    jobFamily: JobFamily,
    jobLevel: JobLevel,
    confidence: z.number(),
  })).optional(),
});
export type NormalizeRoleResponse = z.infer<typeof NormalizeRoleResponse>;

export const RecommendCompRequest = z.object({
  companyContext: CompanyContext,
  roleProfile: RoleProfile,
  candidateContext: CandidateContext,
  tokenProgram: TokenProgram.optional(),
  constraints: Constraints,
  preferences: Preferences,
});
export type RecommendCompRequest = z.infer<typeof RecommendCompRequest>;

export const GenerateDraftRequest = z.object({
  package: CompPackage,
  companyContext: CompanyContext,
  roleProfile: RoleProfile,
});
export type GenerateDraftRequest = z.infer<typeof GenerateDraftRequest>;

export const GenerateDraftResponse = z.object({
  offerLanguageBlocks: z.array(OfferLanguageBlock),
  negotiationTalkingPoints: z.array(z.string()),
});
export type GenerateDraftResponse = z.infer<typeof GenerateDraftResponse>;
