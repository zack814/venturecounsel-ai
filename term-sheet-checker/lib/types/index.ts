// ============================================================================
// TYPE DEFINITIONS FOR TERM SHEET REALITY CHECKER
// ============================================================================

/**
 * Input Context - Information provided by the founder
 */
export interface IntakeContext {
  stage: 'pre-seed' | 'seed' | 'series-a' | 'series-b-plus';
  investorType: 'institutional-vc' | 'angel' | 'strategic' | 'crypto-native' | 'other';
  geography: 'silicon-valley' | 'nyc' | 'europe' | 'other';
  dealType: 'safe' | 'convertible-note' | 'priced-equity' | 'token-warrant' | 'hybrid';
  competitiveProcess?: 'none' | 'some' | 'hot';
  hasLeadInvestor?: boolean;
  companyProfile?: 'b2b-saas' | 'consumer' | 'crypto' | 'deep-tech' | 'other';
}

/**
 * Extracted Term from Term Sheet
 */
export interface ExtractedTerm {
  termType: string; // e.g., "liquidation_preference", "board_composition"
  category: 'economics' | 'control-governance' | 'exit-transfer' | 'legal-structural';
  value: string | number | object;
  sourceText: string; // Quote from the term sheet
  confidence: number; // 0-1
  sectionReference?: string; // e.g., "Section 3.1"
}

/**
 * Complete Extracted Term Sheet
 */
export interface ExtractedTermSheet {
  rawText: string;
  extractedAt: string; // ISO timestamp
  terms: ExtractedTerm[];
  detectedStage?: IntakeContext['stage'];
  detectedDealType?: IntakeContext['dealType'];
}

/**
 * Market Norm for a specific term
 */
export interface MarketNorm {
  termType: string;
  stage: IntakeContext['stage'];
  geography: IntakeContext['geography'];
  investorType?: IntakeContext['investorType'];

  // Market data
  marketStandard: string | number | object;
  acceptableRange?: {
    min?: number;
    max?: number;
    values?: string[];
  };
  prevalence: number; // Percentage of deals (0-100)

  // Metadata
  confidence: number; // 0-1
  lastUpdated: string; // ISO date
  sources: string[];
  notes?: string;
}

/**
 * Scored Term with normative assessment
 */
export interface ScoredTerm {
  term: ExtractedTerm;

  // Scoring dimensions
  marketStatus: 'market-standard' | 'acceptable' | 'aggressive' | 'red-flag';
  marketStatusScore: number; // 0-1 (probability it's market)
  severityScore: number; // 0-100

  // Classification
  riskClass: 'immediate' | 'financing-sensitive' | 'exit-sensitive' | 'downside-only';
  negotiationPosture: 'push-hard' | 'push-soft' | 'concede' | 'ignore';
  isDealKiller: boolean;

  // Context
  explanation: string;
  practicalImpact: string; // What this means in practice
  marketComparison: string; // How this compares to market
  confidence: number; // 0-1
}

/**
 * Clause Suggestion for redlining
 */
export interface ClauseSuggestion {
  termType: string;
  sectionReference?: string;

  // The problematic clause
  originalClause: string;
  issue: string;

  // Suggested alternatives
  primarySuggestion: {
    language: string;
    rationale: string;
    founderFriendliness: 'highly-favorable' | 'balanced' | 'acceptable';
  };

  fallbackSuggestion?: {
    language: string;
    rationale: string;
    founderFriendliness: 'highly-favorable' | 'balanced' | 'acceptable';
  };

  // Negotiation guidance
  negotiationTips: string[];
  redFlags?: string[];
}

/**
 * Executive Summary of Analysis
 */
export interface ExecutiveSummary {
  overallPosture: 'founder-favorable' | 'balanced' | 'investor-leaning' | 'investor-heavy';
  overallPostureScore: number; // 0-100, where 0 is founder-favorable, 100 is investor-heavy

  topIssues: Array<{
    termType: string;
    severity: number;
    summary: string;
  }>;

  negotiationPriorities: string[]; // Top 3 things to negotiate
  fakeIssues: string[]; // Top 3 things founders worry about but don't matter

  dealKillerPresent: boolean;
  dealKillerTerms?: string[];
}

/**
 * Negotiation Plan
 */
export interface NegotiationPlan {
  sequencing: Array<{
    priority: number;
    termType: string;
    timing: 'raise-immediately' | 'raise-early' | 'raise-late' | 'hold-for-leverage';
    rationale: string;
  }>;

  suggestedTrades: Array<{
    giveTerm: string;
    getTerm: string;
    rationale: string;
  }>;

  leverageAnalysis: {
    estimatedLeverage: 'low' | 'medium' | 'high';
    leverageFactors: string[];
    tacticalRecommendations: string[];
  };
}

/**
 * Assumptions & Confidence
 */
export interface AssumptionsAndConfidence {
  assumptions: Array<{
    assumption: string;
    impact: 'low' | 'medium' | 'high';
  }>;

  lowConfidenceAreas: Array<{
    area: string;
    reason: string;
    recommendation: string;
  }>;

  overallConfidence: number; // 0-1
}

/**
 * Complete Analysis Report
 */
export interface AnalysisReport {
  analyzedAt: string; // ISO timestamp
  context: IntakeContext;

  // The 5 sections
  executiveSummary: ExecutiveSummary;
  scoredTerms: ScoredTerm[];
  negotiationPlan: NegotiationPlan;
  clauseSuggestions: ClauseSuggestion[];
  assumptionsAndConfidence: AssumptionsAndConfidence;

  // Metadata
  modelUsed: string;
  processingTimeMs: number;
}

/**
 * API Request for Analysis
 */
export interface AnalysisRequest {
  termSheetText: string;
  context: IntakeContext;
}

/**
 * API Response
 */
export interface AnalysisResponse {
  success: boolean;
  report?: AnalysisReport;
  error?: string;
}

/**
 * Raw AI-generated scored term (before mapping to ScoredTerm)
 */
export interface RawScoredTermResponse {
  marketStatus: ScoredTerm['marketStatus'];
  marketStatusScore: number;
  severityScore: number;
  riskClass: ScoredTerm['riskClass'];
  negotiationPosture: ScoredTerm['negotiationPosture'];
  isDealKiller: boolean;
  explanation: string;
  practicalImpact: string;
  marketComparison: string;
  confidence: number;
}

/**
 * Combined extraction and scoring response from AI
 */
export interface ExtractAndScoreResponse {
  extractedTerms: ExtractedTerm[];
  scoredTerms: RawScoredTermResponse[];
}
