import { z } from 'zod';

// ============================================
// CORE ENUMS
// ============================================

export const TokenCategory = z.enum([
  'utility',
  'governance',
  'payment',
  'security-token',
  'wrapped-asset',
  'nft',
  'defi',
  'lst-lrt',
  'stablecoin',
  'rwa',
  'meme',
  'depin',
  'gaming',
  'hybrid',
  'other',
]);

export const BlockchainNetwork = z.enum([
  'ethereum',
  'solana',
  'polygon',
  'arbitrum',
  'optimism',
  'base',
  'avalanche',
  'binance-smart-chain',
  'sui',
  'aptos',
  'cosmos',
  'other-evm',
  'other-non-evm',
]);

export const TokenStandard = z.enum([
  'erc20',
  'erc721',
  'erc1155',
  'spl',
  'custom',
  'unknown',
]);

export const ProjectStage = z.enum([
  'concept',
  'development',
  'testnet',
  'mainnet-recent',
  'mainnet-established',
]);

export const YesNoUnknown = z.enum(['yes', 'no', 'unknown']);

export const RiskLevel = z.enum(['low', 'medium', 'high', 'critical']);

export const LifecycleStage = z.enum(['T0', 'T1', 'T2']);

export const ProfitMechanism = z.enum([
  'none',
  'staking-rewards',
  'fee-sharing',
  'buyback-burn',
  'revenue-distribution',
  'yield-farming',
  'rebasing',
  'dividends',
  'appreciation-only',
  'other',
]);

export const VotingScope = z.enum([
  'protocol-parameters',
  'treasury',
  'upgrades',
  'full-governance',
  'signaling-only',
  'none',
  'unknown',
]);

export const SaleMethod = z.enum([
  'public-sale',
  'private-sale',
  'ico-ido',
  'airdrop',
  'mining-staking-rewards',
  'liquidity-mining',
  'team-allocation',
  'treasury',
  'foundation',
  'grants',
  'no-sale',
]);

export const PurchaserRestrictions = z.enum([
  'none',
  'kyc-only',
  'accredited-only',
  'us-excluded',
  'us-accredited-only',
  'non-us-only',
  'whitelist-only',
]);

export const EntityType = z.enum([
  'us-corporation',
  'us-llc',
  'delaware-foundation',
  'cayman-foundation',
  'swiss-foundation',
  'singapore-foundation',
  'bvi-company',
  'dao-only',
  'no-entity',
  'other',
  'unknown',
]);

export const DecentralizationLevel = z.enum([
  'fully-centralized',
  'partially-decentralized',
  'sufficiently-decentralized',
  'fully-decentralized',
  'unknown',
]);

export const GovernanceModel = z.enum([
  'team-controlled',
  'multi-sig',
  'dao',
  'hybrid',
  'none',
  'unknown',
]);

export const RegPath = z.enum([
  'none',
  'reg-d-506b',
  'reg-d-506c',
  'reg-s',
  'reg-a',
  'reg-cf',
  'full-registration',
  'unknown',
]);

// ============================================
// STEP 1: TOKEN BASICS
// ============================================

export const TokenBasicsSchema = z.object({
  tokenName: z.string().optional(),
  tokenSymbol: z.string().optional(),
  category: TokenCategory,
  blockchain: BlockchainNetwork,
  tokenStandard: TokenStandard,
  projectStage: ProjectStage,
  hasLaunched: z.boolean(),
  launchDate: z.string().optional(),
  projectDescription: z.string().optional(),
  totalSupply: z.number().positive().optional(),
  isSupplyFixed: z.boolean().optional(),
});

// ============================================
// STEP 2: TOKEN RIGHTS & ECONOMIC DESIGN
// ============================================

export const TokenRightsSchema = z.object({
  // Economic Rights (critical for Howey)
  entitlesToProfits: YesNoUnknown,
  profitMechanisms: z.array(ProfitMechanism),
  profitMechanismDetails: z.string().optional(),

  // Voting/Governance Rights
  hasVotingRights: YesNoUnknown,
  votingScope: VotingScope.optional(),
  votingPowerProportional: z.boolean().optional(),

  // Utility Rights
  hasUtility: YesNoUnknown,
  utilityDescription: z.string().optional(),
  utilityAvailableNow: z.boolean().optional(),
  utilityRequiresToken: z.boolean().optional(),

  // Redemption/Convertibility
  isRedeemable: YesNoUnknown,
  redemptionDetails: z.string().optional(),

  // Note-like characteristics (Reves triggers)
  hasFixedReturn: YesNoUnknown,
  hasMaturityDate: YesNoUnknown,
  isDebtInstrument: YesNoUnknown,
  promisesRepayment: YesNoUnknown,
});

// ============================================
// STEP 3: DISTRIBUTION PLAN
// ============================================

export const DistributionPlanSchema = z.object({
  // Sale Details
  saleMethods: z.array(SaleMethod),
  hasConductedSale: z.boolean(),
  saleDescription: z.string().optional(),
  totalRaiseAmount: z.number().nonnegative().optional(),

  // US Exposure (critical)
  usPersonsTargeted: YesNoUnknown,
  usMarketingEfforts: YesNoUnknown,
  usResidentsCanPurchase: YesNoUnknown,
  purchaserRestrictions: PurchaserRestrictions,

  // KYC/AML
  hasKYC: YesNoUnknown,

  // Lockups
  hasLockup: YesNoUnknown,
  lockupDurationMonths: z.number().nonnegative().optional(),
  vestingSchedule: z.string().optional(),

  // Secondary Trading
  listedOnExchanges: YesNoUnknown,
  exchangeNames: z.string().optional(),
  seekingCexListing: z.boolean().optional(),

  // Allocation Breakdown
  teamAllocationPercent: z.number().min(0).max(100).optional(),
  investorAllocationPercent: z.number().min(0).max(100).optional(),
  publicAllocationPercent: z.number().min(0).max(100).optional(),
  treasuryAllocationPercent: z.number().min(0).max(100).optional(),
  communityAllocationPercent: z.number().min(0).max(100).optional(),
});

// ============================================
// STEP 4: CONTROL & DECENTRALIZATION
// ============================================

export const ControlAndDecentralizationSchema = z.object({
  // Entity Structure
  entityType: EntityType,
  entityJurisdiction: z.string().optional(),

  // Team/Promoter Activity
  identifiableTeam: YesNoUnknown,
  teamActivelyPromoting: YesNoUnknown,
  teamMakingEfforts: YesNoUnknown,
  teamControlsProtocol: YesNoUnknown,

  // Decentralization Status
  decentralizationLevel: DecentralizationLevel,
  decentralizationJustification: z.string().optional(),

  // Governance
  governanceModel: GovernanceModel,
  multiSigSignerCount: z.number().nonnegative().optional(),
  daoVoterCount: z.number().nonnegative().optional(),

  // Technical Control
  canMintNewTokens: YesNoUnknown,
  canPauseTransfers: YesNoUnknown,
  canBlacklistAddresses: YesNoUnknown,
  hasUpgradeability: YesNoUnknown,
  hasTimelock: YesNoUnknown,
  timelockDuration: z.string().optional(),

  // Open Source
  openSourceCode: YesNoUnknown,

  // Marketing/Communications Risk Factors
  pricePromises: YesNoUnknown,
  returnPromises: YesNoUnknown,
  investmentLanguage: YesNoUnknown,
});

// ============================================
// STEP 5: NON-NEGOTIABLES
// ============================================

export const NonNegotiablesSchema = z.object({
  mustAllowUSInvestors: z.boolean(),
  mustAvoidRegistration: z.boolean(),
  preferredRegPath: RegPath.optional(),
  existingLegalOpinion: z.boolean(),
  priorSECContact: z.boolean(),
  additionalContext: z.string().optional(),
});

// ============================================
// WIZARD STATE
// ============================================

export const TokenRiskWizardStateSchema = z.object({
  currentStep: z.number().min(1).max(5),
  tokenBasics: TokenBasicsSchema.partial(),
  tokenRights: TokenRightsSchema.partial(),
  distributionPlan: DistributionPlanSchema.partial(),
  controlAndDecentralization: ControlAndDecentralizationSchema.partial(),
  nonNegotiables: NonNegotiablesSchema.partial(),
});

// ============================================
// ANALYSIS OUTPUT TYPES
// ============================================

export const HoweyProngSchema = z.enum([
  'investment-of-money',
  'common-enterprise',
  'expectation-of-profits',
  'efforts-of-others',
]);

export const HoweyProngResultSchema = z.object({
  prong: HoweyProngSchema,
  riskScore: z.number().min(0).max(100),
  isSatisfied: z.boolean(),
  confidence: z.number().min(0).max(1),
  redTeamArgument: z.string(),
  blueTeamArgument: z.string(),
  blueTeamStrength: z.enum(['strong', 'medium', 'weak']),
  keyFactors: z.array(z.string()),
  riskLevel: RiskLevel,
});

export const RevesFactorSchema = z.enum([
  'motivation',
  'plan-of-distribution',
  'public-expectations',
  'risk-reducing-factors',
]);

export const RevesFactorResultSchema = z.object({
  factor: RevesFactorSchema,
  weighsToward: z.enum(['security', 'not-security', 'neutral']),
  explanation: z.string(),
  riskLevel: RiskLevel,
});

export const RevesAnalysisSchema = z.object({
  applicable: z.boolean(),
  factors: z.array(RevesFactorResultSchema),
  conclusion: z.string(),
  riskLevel: RiskLevel,
});

export const SecurityCheckResultSchema = z.object({
  testName: z.enum(['stock-test', 'note-test', 'profit-sharing-test']),
  applicable: z.boolean(),
  looksLikeSecurity: z.boolean(),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
});

export const RiskHeatmapCellSchema = z.object({
  stage: LifecycleStage,
  category: z.string(),
  riskLevel: RiskLevel,
  keyIssues: z.array(z.string()),
  mitigations: z.array(z.string()),
});

export const ActionItemSchema = z.object({
  id: z.string(),
  category: z.enum(['token-design', 'distribution', 'governance', 'marketing', 'legal']),
  priority: z.number().min(1).max(10),
  title: z.string(),
  description: z.string(),
  rationale: z.string(),
  effortLevel: z.enum(['low', 'medium', 'high']),
  impactLevel: z.enum(['low', 'medium', 'high']),
  exampleLanguage: z.string().optional(),
  blockedByNonNegotiable: z.boolean().optional(),
});

export const MarketingRewriteSchema = z.object({
  id: z.string(),
  problematicLanguage: z.string(),
  suggestedLanguage: z.string(),
  explanation: z.string(),
  severity: RiskLevel,
});

export const CompliancePathOptionSchema = z.object({
  pathName: RegPath,
  applicable: z.boolean(),
  requirements: z.array(z.string()),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  estimatedCost: z.string().optional(),
  estimatedTimeline: z.string().optional(),
});

export const WhatWouldChangeItemSchema = z.object({
  change: z.string(),
  impact: z.string(),
  scoreImpact: z.number().optional(),
});

export const OverallRiskAssessmentSchema = z.object({
  overallRiskLevel: RiskLevel,
  overallScore: z.number().min(0).max(100),
  headline: z.string(),
  bottomLine: z.string(),
  topDrivers: z.array(z.string()),
  topMitigations: z.array(z.string()),
});

export const HoweyAnalysisSchema = z.object({
  prongs: z.array(HoweyProngResultSchema),
  prongsSatisfied: z.number().min(0).max(4),
  overallConclusion: z.string(),
  riskLevel: RiskLevel,
});

export const IntegrationAnalysisSchema = z.object({
  summary: z.string(),
  relatedTransactions: z.array(z.string()),
  aggregatedRisk: RiskLevel,
});

export const LifecycleAnalysisSchema = z.object({
  currentStage: LifecycleStage,
  morphingRisks: z.array(z.string()),
  decentralizationMilestones: z.array(z.string()),
  futureConsiderations: z.array(z.string()),
});

// ============================================
// COMPLETE ANALYSIS RESULT
// ============================================

export const TokenRiskAnalysisSchema = z.object({
  id: z.string(),
  createdAt: z.string(),

  // Section I: Disclaimer
  disclaimer: z.string(),

  // Section II: Executive Summary
  executiveSummary: OverallRiskAssessmentSchema,

  // Section III: Input Snapshot
  inputSnapshot: z.object({
    tokenCategory: z.string(),
    projectStage: z.string(),
    usExposure: z.string(),
    decentralizationLevel: z.string(),
    keyRights: z.array(z.string()),
  }),

  // Section IV: Risk Heatmap
  riskHeatmap: z.array(RiskHeatmapCellSchema),

  // Section V: Enumerated Security Check
  securityChecks: z.array(SecurityCheckResultSchema),

  // Section VI: Reves Analysis
  revesAnalysis: RevesAnalysisSchema,

  // Section VII: Howey Analysis
  howeyAnalysis: HoweyAnalysisSchema,

  // Section VIII: Scheme/Integration Check
  integrationAnalysis: IntegrationAnalysisSchema,

  // Section IX: Lifecycle/Morphing
  lifecycleAnalysis: LifecycleAnalysisSchema,

  // Section X: Token Design Action Plan
  tokenDesignActions: z.array(ActionItemSchema),

  // Section XI: Marketing Action Plan
  marketingActions: z.array(ActionItemSchema),
  marketingRewrites: z.array(MarketingRewriteSchema),

  // Section XII: Compliance Paths
  compliancePaths: z.array(CompliancePathOptionSchema),

  // Section XIII: What Would Change
  whatWouldChange: z.array(WhatWouldChangeItemSchema),

  // Section XIV: Counsel Next Steps
  counselNextSteps: z.array(z.string()),

  // Metadata
  analysisConfidence: z.number().min(0).max(1),
  aiEnhanced: z.boolean(),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type TokenCategory = z.infer<typeof TokenCategory>;
export type BlockchainNetwork = z.infer<typeof BlockchainNetwork>;
export type TokenStandard = z.infer<typeof TokenStandard>;
export type ProjectStage = z.infer<typeof ProjectStage>;
export type YesNoUnknown = z.infer<typeof YesNoUnknown>;
export type RiskLevel = z.infer<typeof RiskLevel>;
export type LifecycleStage = z.infer<typeof LifecycleStage>;
export type ProfitMechanism = z.infer<typeof ProfitMechanism>;
export type VotingScope = z.infer<typeof VotingScope>;
export type SaleMethod = z.infer<typeof SaleMethod>;
export type PurchaserRestrictions = z.infer<typeof PurchaserRestrictions>;
export type EntityType = z.infer<typeof EntityType>;
export type DecentralizationLevel = z.infer<typeof DecentralizationLevel>;
export type GovernanceModel = z.infer<typeof GovernanceModel>;
export type RegPath = z.infer<typeof RegPath>;

export type TokenBasics = z.infer<typeof TokenBasicsSchema>;
export type TokenRights = z.infer<typeof TokenRightsSchema>;
export type DistributionPlan = z.infer<typeof DistributionPlanSchema>;
export type ControlAndDecentralization = z.infer<typeof ControlAndDecentralizationSchema>;
export type NonNegotiables = z.infer<typeof NonNegotiablesSchema>;
export type TokenRiskWizardState = z.infer<typeof TokenRiskWizardStateSchema>;

export type HoweyProng = z.infer<typeof HoweyProngSchema>;
export type HoweyProngResult = z.infer<typeof HoweyProngResultSchema>;
export type RevesFactor = z.infer<typeof RevesFactorSchema>;
export type RevesFactorResult = z.infer<typeof RevesFactorResultSchema>;
export type RevesAnalysis = z.infer<typeof RevesAnalysisSchema>;
export type SecurityCheckResult = z.infer<typeof SecurityCheckResultSchema>;
export type RiskHeatmapCell = z.infer<typeof RiskHeatmapCellSchema>;
export type ActionItem = z.infer<typeof ActionItemSchema>;
export type MarketingRewrite = z.infer<typeof MarketingRewriteSchema>;
export type CompliancePathOption = z.infer<typeof CompliancePathOptionSchema>;
export type WhatWouldChangeItem = z.infer<typeof WhatWouldChangeItemSchema>;
export type OverallRiskAssessment = z.infer<typeof OverallRiskAssessmentSchema>;
export type HoweyAnalysis = z.infer<typeof HoweyAnalysisSchema>;
export type IntegrationAnalysis = z.infer<typeof IntegrationAnalysisSchema>;
export type LifecycleAnalysis = z.infer<typeof LifecycleAnalysisSchema>;
export type TokenRiskAnalysis = z.infer<typeof TokenRiskAnalysisSchema>;

// ============================================
// LABEL CONSTANTS
// ============================================

export const TOKEN_CATEGORY_LABELS: Record<TokenCategory, string> = {
  utility: 'Utility / Access Token',
  governance: 'Governance Token',
  payment: 'Payment / Currency Token',
  'security-token': 'Security Token (Intentional)',
  'wrapped-asset': 'Wrapped Asset',
  nft: 'NFT / Semi-Fungible',
  defi: 'DeFi / Protocol Token',
  'lst-lrt': 'LST / LRT / Staking Derivative',
  stablecoin: 'Stablecoin',
  rwa: 'RWA Token',
  meme: 'Memecoin / Community Token',
  depin: 'DePIN Token',
  gaming: 'Gaming Token',
  hybrid: 'Hybrid / Multiple Categories',
  other: 'Other',
};

export const BLOCKCHAIN_LABELS: Record<BlockchainNetwork, string> = {
  ethereum: 'Ethereum',
  solana: 'Solana',
  polygon: 'Polygon',
  arbitrum: 'Arbitrum',
  optimism: 'Optimism',
  base: 'Base',
  avalanche: 'Avalanche',
  'binance-smart-chain': 'BNB Chain',
  sui: 'Sui',
  aptos: 'Aptos',
  cosmos: 'Cosmos',
  'other-evm': 'Other EVM',
  'other-non-evm': 'Other Non-EVM',
};

export const TOKEN_STANDARD_LABELS: Record<TokenStandard, string> = {
  erc20: 'ERC-20',
  erc721: 'ERC-721 (NFT)',
  erc1155: 'ERC-1155 (Multi-Token)',
  spl: 'SPL (Solana)',
  custom: 'Custom Standard',
  unknown: 'Unknown',
};

export const PROJECT_STAGE_LABELS: Record<ProjectStage, string> = {
  concept: 'Concept / Pre-Development',
  development: 'In Development',
  testnet: 'Testnet / Beta',
  'mainnet-recent': 'Mainnet (< 6 months)',
  'mainnet-established': 'Mainnet (> 6 months)',
};

export const PROFIT_MECHANISM_LABELS: Record<ProfitMechanism, string> = {
  none: 'None',
  'staking-rewards': 'Staking Rewards',
  'fee-sharing': 'Fee Sharing / Revenue Share',
  'buyback-burn': 'Buyback & Burn',
  'revenue-distribution': 'Revenue Distribution',
  'yield-farming': 'Yield Farming / LP Rewards',
  rebasing: 'Rebasing',
  dividends: 'Dividends',
  'appreciation-only': 'Appreciation Only (No Direct Profit)',
  other: 'Other',
};

export const VOTING_SCOPE_LABELS: Record<VotingScope, string> = {
  'protocol-parameters': 'Protocol Parameters Only',
  treasury: 'Treasury / Budget',
  upgrades: 'Contract Upgrades',
  'full-governance': 'Full Protocol Governance',
  'signaling-only': 'Signaling / Advisory Only',
  none: 'None',
  unknown: 'Unknown',
};

export const SALE_METHOD_LABELS: Record<SaleMethod, string> = {
  'public-sale': 'Public Sale (Retail Accessible)',
  'private-sale': 'Private Sale (VCs / Accredited)',
  'ico-ido': 'ICO / IDO / Launchpad',
  airdrop: 'Airdrop',
  'mining-staking-rewards': 'Mining / Staking Rewards',
  'liquidity-mining': 'Liquidity Mining',
  'team-allocation': 'Team Allocation',
  treasury: 'Treasury',
  foundation: 'Foundation',
  grants: 'Grants / Ecosystem Fund',
  'no-sale': 'No Sale',
};

export const PURCHASER_RESTRICTIONS_LABELS: Record<PurchaserRestrictions, string> = {
  none: 'No Restrictions',
  'kyc-only': 'KYC Required',
  'accredited-only': 'Accredited Investors Only',
  'us-excluded': 'US Persons Excluded',
  'us-accredited-only': 'US Accredited Only',
  'non-us-only': 'Non-US Only',
  'whitelist-only': 'Whitelist Only',
};

export const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  'us-corporation': 'US Corporation',
  'us-llc': 'US LLC',
  'delaware-foundation': 'Delaware Foundation',
  'cayman-foundation': 'Cayman Foundation',
  'swiss-foundation': 'Swiss Foundation',
  'singapore-foundation': 'Singapore Foundation',
  'bvi-company': 'BVI Company',
  'dao-only': 'DAO Only (No Entity)',
  'no-entity': 'No Legal Entity',
  other: 'Other',
  unknown: 'Unknown',
};

export const DECENTRALIZATION_LEVEL_LABELS: Record<DecentralizationLevel, string> = {
  'fully-centralized': 'Fully Centralized',
  'partially-decentralized': 'Partially Decentralized',
  'sufficiently-decentralized': 'Sufficiently Decentralized',
  'fully-decentralized': 'Fully Decentralized',
  unknown: 'Unknown',
};

export const GOVERNANCE_MODEL_LABELS: Record<GovernanceModel, string> = {
  'team-controlled': 'Team Controlled',
  'multi-sig': 'Multi-Signature',
  dao: 'DAO Governance',
  hybrid: 'Hybrid',
  none: 'None',
  unknown: 'Unknown',
};

export const REG_PATH_LABELS: Record<RegPath, string> = {
  none: 'None / Not Applicable',
  'reg-d-506b': 'Reg D 506(b)',
  'reg-d-506c': 'Reg D 506(c)',
  'reg-s': 'Reg S (Offshore)',
  'reg-a': 'Reg A / A+',
  'reg-cf': 'Reg CF (Crowdfunding)',
  'full-registration': 'Full SEC Registration',
  unknown: 'Unknown',
};

export const YES_NO_UNKNOWN_LABELS: Record<YesNoUnknown, string> = {
  yes: 'Yes',
  no: 'No',
  unknown: "Don't Know / Unsure",
};

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk',
  critical: 'Critical Risk',
};

export const LIFECYCLE_STAGE_LABELS: Record<LifecycleStage, string> = {
  T0: 'T0: Launch / Distribution',
  T1: 'T1: Early Network',
  T2: 'T2: Mature Network',
};

// ============================================
// COLOR CONSTANTS
// ============================================

export const RISK_LEVEL_COLORS: Record<RiskLevel, { bg: string; text: string; border: string }> = {
  low: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  medium: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  high: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
  },
  critical: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
};

export const HOWEY_PRONG_LABELS: Record<HoweyProng, string> = {
  'investment-of-money': 'Investment of Money',
  'common-enterprise': 'Common Enterprise',
  'expectation-of-profits': 'Expectation of Profits',
  'efforts-of-others': 'Efforts of Others',
};

// ============================================
// DISCLAIMER TEXT
// ============================================

export const LEGAL_DISCLAIMER = `This tool is not legal advice; it is an informational risk analysis and design/communications planning aid. Token classification under securities law is highly fact-intensive, and the same token can have different risk profiles at different points in its lifecycle. This analysis reflects a conservative, SEC-enforcement-minded assessment based on the information provided.

If the risk level is Medium or higher, or if your project will touch U.S. retail users in any meaningful way, you should consult with specialized crypto securities counsel before launching.

If you need counsel, consider consulting a qualified crypto securities law firm (e.g., Rains LLP).`;

export const SHORT_DISCLAIMER =
  'This tool provides informational analysis only and does not constitute legal advice. Consult qualified counsel before making decisions.';
