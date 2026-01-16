import { z } from 'zod';

// Re-export shared enums from comp-schemas
export {
  CompanyStage,
  GeoMarket,
  HeadcountRange,
  JobFamily,
  JobLevel,
  LocationType,
  EquityType,
  VestingSchedule,
} from './comp-schemas';

import {
  CompanyStage,
  GeoMarket,
  HeadcountRange,
  JobFamily,
  JobLevel,
  LocationType,
  EquityType,
  VestingSchedule,
} from './comp-schemas';

// ============================================
// EMPLOYEE-SPECIFIC ENUMS
// ============================================

export const EmploymentStatus = z.enum(['employed', 'unemployed', 'student', 'contractor']);
export type EmploymentStatus = z.infer<typeof EmploymentStatus>;

export const FinancialSituation = z.enum(['need-stability', 'balanced', 'can-take-risk']);
export type FinancialSituation = z.infer<typeof FinancialSituation>;

export const EmployeeRiskTolerance = z.enum(['conservative', 'moderate', 'aggressive']);
export type EmployeeRiskTolerance = z.infer<typeof EmployeeRiskTolerance>;

export const IndustrySector = z.enum([
  'saas',
  'fintech',
  'healthtech',
  'biotech',
  'consumer',
  'enterprise',
  'devtools',
  'ai-ml',
  'crypto-web3',
  'ecommerce',
  'edtech',
  'cleantech',
  'other'
]);
export type IndustrySector = z.infer<typeof IndustrySector>;

export const ExercisePeriod = z.enum([
  '30-days',
  '60-days',
  '90-days',
  '180-days',
  '1-year',
  '5-years',
  '10-years',
  'unknown'
]);
export type ExercisePeriod = z.infer<typeof ExercisePeriod>;

export const AccelerationProvision = z.enum([
  'none',
  'single-trigger',
  'double-trigger',
  'partial-double-trigger',
  'unknown'
]);
export type AccelerationProvision = z.infer<typeof AccelerationProvision>;

export const CompetingOffers = z.enum(['none', 'one', 'multiple']);
export type CompetingOffers = z.infer<typeof CompetingOffers>;

export const ConfidenceLevel = z.enum(['known', 'estimated', 'unknown']);
export type ConfidenceLevel = z.infer<typeof ConfidenceLevel>;

export const YesNoUnknown = z.enum(['yes', 'no', 'unknown']);
export type YesNoUnknown = z.infer<typeof YesNoUnknown>;

// ============================================
// STEP 1: EMPLOYEE BACKGROUND
// ============================================

export const EmployeeBackground = z.object({
  jobFamily: JobFamily,
  jobLevel: JobLevel,
  yearsExperience: z.number().nonnegative().optional(),
  employmentStatus: EmploymentStatus,
  location: GeoMarket,
  riskTolerance: EmployeeRiskTolerance,
  financialSituation: FinancialSituation,
  currentBaseSalary: z.number().positive().optional(),
  currentTotalComp: z.number().positive().optional(),
});
export type EmployeeBackground = z.infer<typeof EmployeeBackground>;

// ============================================
// STEP 2: COMPANY DETAILS
// ============================================

export const CompanyDetails = z.object({
  companyName: z.string().optional(),
  stage: CompanyStage,
  industry: IndustrySector,
  location: GeoMarket,
  headcount: HeadcountRange,
  monthsSinceLastRound: z.number().nonnegative().optional(),
  isPublic: z.boolean().default(false),
});
export type CompanyDetails = z.infer<typeof CompanyDetails>;

// ============================================
// STEP 3: CASH OFFER
// ============================================

export const CashOffer = z.object({
  baseSalary: z.number().positive(),
  bonusTargetAmount: z.number().nonnegative().optional(),
  bonusTargetPercent: z.number().nonnegative().optional(),
  signingBonus: z.number().nonnegative().optional(),
  relocationBonus: z.number().nonnegative().optional(),
});
export type CashOffer = z.infer<typeof CashOffer>;

// ============================================
// STEP 4: EQUITY OFFER (with confidence tracking)
// ============================================

export const EquityOffer = z.object({
  equityType: EquityType,

  // Grant details
  shareCount: z.number().positive().optional(),
  percentOfCompany: z.number().min(0).max(100).optional(),

  // Pricing (with confidence)
  strikePrice: z.number().positive().optional(),
  strikePriceConfidence: ConfidenceLevel.default('unknown'),

  // Company equity details (with confidence)
  totalSharesOutstanding: z.number().positive().optional(),
  totalSharesConfidence: ConfidenceLevel.default('unknown'),

  latestValuation: z.number().positive().optional(),
  latestValuationConfidence: ConfidenceLevel.default('unknown'),

  latestRoundPricePerShare: z.number().positive().optional(),
  latestRoundPriceConfidence: ConfidenceLevel.default('unknown'),

  optionPoolPercent: z.number().min(0).max(100).optional(),

  // Vesting terms
  vestingTotalMonths: z.number().positive().default(48),
  vestingCliffMonths: z.number().nonnegative().default(12),
  vestingFrequency: z.enum(['monthly', 'quarterly', 'annually']).default('monthly'),

  // Important terms
  exercisePeriod: ExercisePeriod.default('unknown'),
  accelerationProvision: AccelerationProvision.default('unknown'),
  earlyExerciseAllowed: YesNoUnknown.default('unknown'),

  // Additional terms
  repurchaseRight: YesNoUnknown.default('unknown'),
  rightOfFirstRefusal: YesNoUnknown.default('unknown'),
});
export type EquityOffer = z.infer<typeof EquityOffer>;

// ============================================
// STEP 5: NEGOTIATION CONTEXT
// ============================================

export const NegotiationPriority = z.enum([
  'base-salary',
  'equity',
  'signing-bonus',
  'work-life-balance',
  'career-growth',
  'remote-flexibility',
  'title-level'
]);
export type NegotiationPriority = z.infer<typeof NegotiationPriority>;

export const NegotiationContext = z.object({
  competingOffers: CompetingOffers,
  excitementLevel: z.number().min(1).max(5),
  priorities: z.array(NegotiationPriority).min(1).max(5),
  isLevelNegotiable: z.boolean().default(false),
  isStartDateFlexible: z.boolean().default(true),
  noticePeriodWeeks: z.number().nonnegative().optional(),
  specificConcerns: z.string().optional(),
});
export type NegotiationContext = z.infer<typeof NegotiationContext>;

// ============================================
// ANALYSIS OUTPUT TYPES
// ============================================

export const OfferScoreCategory = z.enum([
  'excellent',
  'good',
  'fair',
  'below-market',
  'concerning'
]);
export type OfferScoreCategory = z.infer<typeof OfferScoreCategory>;

export const FlagSeverity = z.enum(['positive', 'neutral', 'warning', 'critical']);
export type FlagSeverity = z.infer<typeof FlagSeverity>;

export const FlagCategory = z.enum([
  'cash',
  'equity-value',
  'equity-terms',
  'vesting',
  'exercise',
  'acceleration',
  'tax',
  'risk',
  'opportunity'
]);
export type FlagCategory = z.infer<typeof FlagCategory>;

export const OfferFlag = z.object({
  id: z.string(),
  category: FlagCategory,
  severity: FlagSeverity,
  title: z.string(),
  description: z.string(),
  recommendation: z.string().optional(),
  educationalContent: z.string().optional(),
  learnMoreLink: z.string().optional(),
});
export type OfferFlag = z.infer<typeof OfferFlag>;

// ============================================
// EXIT SCENARIOS
// ============================================

export const ExitScenario = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  exitMultiple: z.number(),
  dilutionPercent: z.number().min(0).max(100),
  yearsToExit: z.number().positive(),
  probability: z.number().min(0).max(1),
  grossEquityValue: z.number(),
  exerciseCost: z.number().optional(),
  netEquityValue: z.number(),
  annualizedReturn: z.number().optional(),
});
export type ExitScenario = z.infer<typeof ExitScenario>;

// ============================================
// NEGOTIATION SUGGESTIONS
// ============================================

export const NegotiationDifficulty = z.enum(['easy', 'medium', 'hard']);
export type NegotiationDifficulty = z.infer<typeof NegotiationDifficulty>;

export const NegotiationSuccessLikelihood = z.enum(['high', 'medium', 'low']);
export type NegotiationSuccessLikelihood = z.infer<typeof NegotiationSuccessLikelihood>;

export const NegotiationItemCategory = z.enum(['standard', 'non-obvious', 'advanced']);
export type NegotiationItemCategory = z.infer<typeof NegotiationItemCategory>;

export const NegotiationSuggestion = z.object({
  id: z.string(),
  category: NegotiationItemCategory,
  title: z.string(),
  currentValue: z.string().optional(),
  suggestedValue: z.string(),
  rationale: z.string(),
  suggestedLanguage: z.string(),
  difficulty: NegotiationDifficulty,
  successLikelihood: NegotiationSuccessLikelihood,
  impactLevel: z.enum(['high', 'medium', 'low']),
  relevantWhen: z.string().optional(),
});
export type NegotiationSuggestion = z.infer<typeof NegotiationSuggestion>;

// ============================================
// COMPONENT SCORES
// ============================================

export const CashScore = z.object({
  score: z.number().min(0).max(100),
  percentile: z.number().min(0).max(100),
  verdict: z.string(),
  baseSalaryVsMedian: z.number(),
  totalCashVsMedian: z.number(),
  comparedToCurrentSalary: z.number().optional(),
});
export type CashScore = z.infer<typeof CashScore>;

export const EquityScore = z.object({
  score: z.number().min(0).max(100),
  percentile: z.number().min(0).max(100).optional(),
  verdict: z.string(),
  percentOfCompany: z.number().optional(),
  currentPaperValue: z.number().optional(),
  valueConfidence: ConfidenceLevel,
  equityVsMedian: z.number().optional(),
});
export type EquityScore = z.infer<typeof EquityScore>;

export const TermsScore = z.object({
  score: z.number().min(0).max(100),
  verdict: z.string(),
  vestingScore: z.number().min(0).max(100),
  exerciseScore: z.number().min(0).max(100),
  accelerationScore: z.number().min(0).max(100),
  detailBreakdown: z.array(z.object({
    term: z.string(),
    value: z.string(),
    assessment: z.string(),
    impact: z.number(),
  })),
});
export type TermsScore = z.infer<typeof TermsScore>;

// ============================================
// MISSING DATA WARNINGS
// ============================================

export const MissingDataWarning = z.object({
  field: z.string(),
  displayName: z.string(),
  impact: z.string(),
  howToGet: z.string(),
  questionToAsk: z.string(),
  importanceLevel: z.enum(['critical', 'important', 'helpful']),
});
export type MissingDataWarning = z.infer<typeof MissingDataWarning>;

// ============================================
// MARKET BENCHMARKS
// ============================================

export const MarketBenchmarks = z.object({
  salary: z.object({
    p25: z.number(),
    p50: z.number(),
    p75: z.number(),
  }),
  equityBps: z.object({
    p25: z.number(),
    p50: z.number(),
    p75: z.number(),
  }),
  equityPercent: z.object({
    p25: z.number(),
    p50: z.number(),
    p75: z.number(),
  }),
  source: z.string(),
  lastUpdated: z.string(),
  confidenceNote: z.string().optional(),
});
export type MarketBenchmarks = z.infer<typeof MarketBenchmarks>;

// ============================================
// OVERALL SCORE RESULT
// ============================================

export const OverallScore = z.object({
  score: z.number().min(0).max(100),
  category: OfferScoreCategory,
  headline: z.string(),
  paragraph: z.string(),
});
export type OverallScore = z.infer<typeof OverallScore>;

// ============================================
// FULL ANALYSIS REPORT
// ============================================

export const OfferAnalysis = z.object({
  id: z.string(),
  createdAt: z.string(),

  // Overall assessment
  overallScore: z.number().min(0).max(100),
  overallCategory: OfferScoreCategory,
  summaryHeadline: z.string(),
  summaryParagraph: z.string(),

  // Component scores
  cashScore: CashScore,
  equityScore: EquityScore,
  termsScore: TermsScore,

  // Market context
  benchmarks: MarketBenchmarks,

  // Flags
  flags: z.array(OfferFlag),
  positiveFlags: z.array(OfferFlag),
  warningFlags: z.array(OfferFlag),
  criticalFlags: z.array(OfferFlag),

  // Exit scenarios
  exitScenarios: z.array(ExitScenario),
  probabilityWeightedValue: z.number(),

  // Negotiation
  negotiationSuggestions: z.array(NegotiationSuggestion),
  standardSuggestions: z.array(NegotiationSuggestion),
  nonObviousSuggestions: z.array(NegotiationSuggestion),
  counterOfferEmailTemplate: z.string(),
  talkingPoints: z.array(z.string()),

  // Missing data
  missingDataWarnings: z.array(MissingDataWarning),

  // Confidence
  analysisConfidence: z.number().min(0).max(100),
  confidenceNotes: z.array(z.string()),
});
export type OfferAnalysis = z.infer<typeof OfferAnalysis>;

// ============================================
// WIZARD STATE
// ============================================

export const OfferEvaluatorState = z.object({
  currentStep: z.number().min(1).max(6),
  employeeBackground: EmployeeBackground.partial(),
  companyDetails: CompanyDetails.partial(),
  cashOffer: CashOffer.partial(),
  equityOffer: EquityOffer.partial(),
  negotiationContext: NegotiationContext.partial(),
});
export type OfferEvaluatorState = z.infer<typeof OfferEvaluatorState>;

// ============================================
// EDUCATIONAL CONTENT TYPES
// ============================================

export const TooltipContent = z.object({
  term: z.string(),
  simple: z.string(),
  detailed: z.string().optional(),
  example: z.string().optional(),
  learnMoreUrl: z.string().optional(),
});
export type TooltipContent = z.infer<typeof TooltipContent>;

export const AskEmployerQuestion = z.object({
  id: z.string(),
  question: z.string(),
  why: z.string(),
  ifTheyRefuse: z.string().optional(),
  relatedFields: z.array(z.string()),
  importance: z.enum(['critical', 'important', 'helpful']),
});
export type AskEmployerQuestion = z.infer<typeof AskEmployerQuestion>;

// ============================================
// DISPLAY HELPERS
// ============================================

export const STAGE_LABELS: Record<string, string> = {
  'pre-seed': 'Pre-Seed',
  'seed': 'Seed',
  'series-a': 'Series A',
  'series-b': 'Series B',
  'series-c+': 'Series C+',
};

export const GEO_LABELS: Record<string, string> = {
  'sv': 'San Francisco / Bay Area',
  'nyc': 'New York City',
  'la': 'Los Angeles',
  'seattle': 'Seattle',
  'austin': 'Austin',
  'boston': 'Boston',
  'denver': 'Denver',
  'chicago': 'Chicago',
  'remote-us': 'Remote (US)',
  'international': 'International',
};

export const JOB_FAMILY_LABELS: Record<string, string> = {
  'engineering': 'Engineering',
  'product': 'Product',
  'design': 'Design',
  'data-science': 'Data Science',
  'marketing': 'Marketing',
  'sales': 'Sales',
  'operations': 'Operations',
  'finance': 'Finance',
  'legal': 'Legal',
  'hr-people': 'HR / People',
  'customer-success': 'Customer Success',
  'executive': 'Executive',
};

export const JOB_LEVEL_LABELS: Record<string, string> = {
  'intern': 'Intern',
  'junior': 'Junior / Entry-Level',
  'mid': 'Mid-Level',
  'senior': 'Senior',
  'staff': 'Staff',
  'principal': 'Principal',
  'director': 'Director',
  'vp': 'VP',
  'c-level': 'C-Level',
};

export const INDUSTRY_LABELS: Record<string, string> = {
  'saas': 'SaaS',
  'fintech': 'Fintech',
  'healthtech': 'Healthtech',
  'biotech': 'Biotech',
  'consumer': 'Consumer',
  'enterprise': 'Enterprise',
  'devtools': 'Developer Tools',
  'ai-ml': 'AI / ML',
  'crypto-web3': 'Crypto / Web3',
  'ecommerce': 'E-Commerce',
  'edtech': 'Edtech',
  'cleantech': 'Cleantech',
  'other': 'Other',
};

export const EQUITY_TYPE_LABELS: Record<string, string> = {
  'iso': 'Incentive Stock Options (ISOs)',
  'nso': 'Non-Qualified Stock Options (NSOs)',
  'rsu': 'Restricted Stock Units (RSUs)',
  'restricted-stock': 'Restricted Stock',
};

export const EXERCISE_PERIOD_LABELS: Record<string, string> = {
  '30-days': '30 days',
  '60-days': '60 days',
  '90-days': '90 days (standard)',
  '180-days': '6 months',
  '1-year': '1 year',
  '5-years': '5 years',
  '10-years': '10 years',
  'unknown': "I don't know",
};

export const ACCELERATION_LABELS: Record<string, string> = {
  'none': 'No acceleration',
  'single-trigger': 'Single-trigger (on acquisition)',
  'double-trigger': 'Double-trigger (acquisition + termination)',
  'partial-double-trigger': 'Partial double-trigger',
  'unknown': "I don't know",
};

export const SCORE_CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'excellent': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'good': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  'fair': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  'below-market': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'concerning': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export const FLAG_SEVERITY_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  'positive': { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'text-emerald-500' },
  'neutral': { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-500' },
  'warning': { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'text-amber-500' },
  'critical': { bg: 'bg-red-50', text: 'text-red-700', icon: 'text-red-500' },
};
