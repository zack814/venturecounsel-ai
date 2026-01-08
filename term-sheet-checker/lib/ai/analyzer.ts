// =============================================================================
// TERM SHEET ANALYZER - Core analysis engine using Claude
// =============================================================================

import Anthropic from '@anthropic-ai/sdk';
import {
  IntakeContext,
  ExtractedTermSheet,
  ExtractedTerm,
  ScoredTerm,
  AnalysisReport,
  ExecutiveSummary,
  ClauseSuggestion,
  NegotiationPlan,
  AssumptionsAndConfidence
} from '../types';
import {
  getExtractionPrompt,
  getScoringPrompt,
  getExecutiveSummaryPrompt,
  getDraftingPrompt,
  getNegotiationPlanPrompt
} from './prompts';
import { loadMarketNorms, loadClauseLibrary, getClause } from '../utils/loaders';

const MODEL = 'claude-3-5-haiku-20241022'; // Using Claude 3.5 Haiku - fastest and cheapest option

// Initialize Anthropic client at runtime, not at module load time
function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }
  return new Anthropic({ apiKey });
}

/**
 * Main analysis function - orchestrates the entire pipeline
 */
export async function analyzeTermSheet(
  termSheetText: string,
  context: IntakeContext
): Promise<AnalysisReport> {
  const startTime = Date.now();

  try {
    // STAGE 1+2: Extract and score terms in a single call (faster)
    console.log('Stage 1-2: Extracting and scoring terms...');
    const { extractedTermSheet, scoredTerms } = await extractAndScoreTerms(termSheetText, context);

    // STAGE 3-5: Generate all outputs in parallel (much faster)
    console.log('Stage 3-5: Generating analysis outputs...');
    const [executiveSummary, clauseSuggestions, negotiationPlan] = await Promise.all([
      generateExecutiveSummary(scoredTerms, context),
      generateClauseSuggestions(scoredTerms, extractedTermSheet, context),
      generateNegotiationPlan(scoredTerms, context)
    ]);

    // STAGE 6: Generate assumptions and confidence assessment
    const assumptionsAndConfidence = generateAssumptions(scoredTerms, context);

    const processingTimeMs = Date.now() - startTime;

    return {
      analyzedAt: new Date().toISOString(),
      context,
      executiveSummary,
      scoredTerms,
      negotiationPlan,
      clauseSuggestions,
      assumptionsAndConfidence,
      modelUsed: MODEL,
      processingTimeMs
    };
  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * STAGE 1+2 COMBINED: Extract and score terms in one API call (faster)
 */
async function extractAndScoreTerms(
  termSheetText: string,
  context: IntakeContext
): Promise<{ extractedTermSheet: ExtractedTermSheet; scoredTerms: ScoredTerm[] }> {
  const marketNorms = loadMarketNorms(context);

  // Combined prompt that does both extraction and scoring
  const prompt = `You are an expert venture capital attorney. Analyze this term sheet and:
1. Extract all material terms
2. Score each term against market norms for ${context.stage} stage, ${context.geography} market

Context:
- Stage: ${context.stage}
- Investor Type: ${context.investorType}
- Geography: ${context.geography}
- Deal Type: ${context.dealType}
- Competitive Process: ${context.competitiveProcess || 'unknown'}
- Has Lead Investor: ${context.hasLeadInvestor ? 'yes' : 'no'}

Market Norms Reference:
${marketNorms}

Term Sheet:
${termSheetText}

Return a JSON object with this exact structure:
{
  "extractedTerms": [
    {
      "termType": "string (e.g., 'liquidation-preference', 'board-composition')",
      "sourceText": "exact text from term sheet",
      "sectionReference": "section name or number",
      "keyValues": {}
    }
  ],
  "scoredTerms": [
    {
      "marketStatus": "market-standard|founder-friendly|aggressive|red-flag",
      "marketStatusScore": number 0-100,
      "severityScore": number 0-100,
      "riskClass": "low|medium|high|critical",
      "negotiationPosture": "accept|negotiate|hard-push-back|walk-away",
      "isDealKiller": boolean,
      "explanation": "string",
      "practicalImpact": "string",
      "marketComparison": "string",
      "confidence": number 0-1
    }
  ]
}`;

  const anthropic = getAnthropicClient();

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 8192,
    temperature: 0,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error('Failed to extract JSON from combined response');
  }

  const result = JSON.parse(jsonMatch[0]);

  const extractedTermSheet: ExtractedTermSheet = {
    rawText: termSheetText,
    extractedAt: new Date().toISOString(),
    terms: result.extractedTerms || []
  };

  const scoredTerms: ScoredTerm[] = result.scoredTerms.map((scored: any, index: number) => ({
    term: result.extractedTerms[index],
    marketStatus: scored.marketStatus,
    marketStatusScore: scored.marketStatusScore,
    severityScore: scored.severityScore,
    riskClass: scored.riskClass,
    negotiationPosture: scored.negotiationPosture,
    isDealKiller: scored.isDealKiller,
    explanation: scored.explanation,
    practicalImpact: scored.practicalImpact,
    marketComparison: scored.marketComparison,
    confidence: scored.confidence
  }));

  return { extractedTermSheet, scoredTerms };
}

/**
 * STAGE 1: Extract terms from raw text (DEPRECATED - use extractAndScoreTerms instead)
 */
async function extractTerms(
  termSheetText: string,
  context: IntakeContext
): Promise<ExtractedTermSheet> {
  const prompt = getExtractionPrompt(termSheetText, context);
  const anthropic = getAnthropicClient();

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    temperature: 0,
    messages: [{
      role: 'user',
      content: prompt
    }],
    // Enable prompt caching for better performance on repeated requests
    system: [{
      type: 'text' as const,
      text: 'You are an expert venture capital attorney analyzing term sheets.',
      cache_control: { type: 'ephemeral' as const }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }] as any
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

  // Parse JSON response
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to extract JSON from response');
  }

  const extracted = JSON.parse(jsonMatch[0]);

  return {
    rawText: termSheetText,
    extractedAt: new Date().toISOString(),
    terms: extracted.terms || []
  };
}

/**
 * STAGE 2: Score each term
 */
async function scoreTerms(
  extractedTermSheet: ExtractedTermSheet,
  context: IntakeContext
): Promise<ScoredTerm[]> {
  const marketNorms = loadMarketNorms(context);
  const prompt = getScoringPrompt(
    JSON.stringify(extractedTermSheet.terms, null, 2),
    marketNorms,
    context
  );
  const anthropic = getAnthropicClient();

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 8192,
    temperature: 0.3,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

  // Parse JSON array
  const jsonMatch = responseText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('Failed to extract JSON array from scoring response');
  }

  const scoredTermsData = JSON.parse(jsonMatch[0]);

  // Map to ScoredTerm objects
  return scoredTermsData.map((scored: any, index: number) => ({
    term: extractedTermSheet.terms[index] || scored.term,
    marketStatus: scored.marketStatus,
    marketStatusScore: scored.marketStatusScore,
    severityScore: scored.severityScore,
    riskClass: scored.riskClass,
    negotiationPosture: scored.negotiationPosture,
    isDealKiller: scored.isDealKiller,
    explanation: scored.explanation,
    practicalImpact: scored.practicalImpact,
    marketComparison: scored.marketComparison,
    confidence: scored.confidence
  }));
}

/**
 * STAGE 3: Generate executive summary
 */
async function generateExecutiveSummary(
  scoredTerms: ScoredTerm[],
  context: IntakeContext
): Promise<ExecutiveSummary> {
  const prompt = getExecutiveSummaryPrompt(
    JSON.stringify(scoredTerms, null, 2),
    context
  );
  const anthropic = getAnthropicClient();

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    temperature: 0.3,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to extract JSON from executive summary response');
  }

  return JSON.parse(jsonMatch[0]);
}

/**
 * STAGE 4: Generate clause suggestions
 */
async function generateClauseSuggestions(
  scoredTerms: ScoredTerm[],
  extractedTermSheet: ExtractedTermSheet,
  context: IntakeContext
): Promise<ClauseSuggestion[]> {
  // Only generate suggestions for problematic terms (severity > 50 or red-flag/aggressive)
  const problematicTerms = scoredTerms.filter(
    st => st.severityScore > 50 || st.marketStatus === 'red-flag' || st.marketStatus === 'aggressive'
  );

  const suggestions: ClauseSuggestion[] = [];

  // Generate suggestions for top 10 most severe issues
  const topIssues = problematicTerms
    .sort((a, b) => b.severityScore - a.severityScore)
    .slice(0, 10);

  for (const scoredTerm of topIssues) {
    try {
      // Check if we have a pre-built clause in library
      const libraryClause = getClause(scoredTerm.term.termType) as {
        founderFriendly: { language: string; rationale: string; negotiationTip?: string };
        marketStandard?: { language: string; rationale: string; negotiationTip?: string };
      } | null;

      if (libraryClause) {
        // Use library clause
        suggestions.push({
          termType: scoredTerm.term.termType,
          sectionReference: scoredTerm.term.sectionReference,
          originalClause: scoredTerm.term.sourceText,
          issue: scoredTerm.explanation,
          primarySuggestion: {
            ...libraryClause.founderFriendly,
            founderFriendliness: 'highly-favorable' as const
          },
          fallbackSuggestion: libraryClause.marketStandard ? {
            language: libraryClause.marketStandard.language,
            rationale: libraryClause.marketStandard.rationale,
            founderFriendliness: 'balanced' as const
          } : undefined,
          negotiationTips: [libraryClause.founderFriendly.negotiationTip || libraryClause.marketStandard?.negotiationTip || ''],
          redFlags: []
        });
      } else {
        // Generate custom suggestion using AI
        const clauseLibraryContext = loadClauseLibrary([scoredTerm.term.termType]);
        const prompt = getDraftingPrompt(
          scoredTerm.term.termType,
          scoredTerm.term.sourceText,
          scoredTerm.explanation,
          clauseLibraryContext,
          context
        );
        const anthropic = getAnthropicClient();

        const message = await anthropic.messages.create({
          model: MODEL,
          max_tokens: 2048,
          temperature: 0.3,
          messages: [{
            role: 'user',
            content: prompt
          }]
        });

        const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
          const drafted = JSON.parse(jsonMatch[0]);
          suggestions.push({
            termType: scoredTerm.term.termType,
            sectionReference: scoredTerm.term.sectionReference,
            originalClause: scoredTerm.term.sourceText,
            issue: scoredTerm.explanation,
            ...drafted
          });
        }
      }
    } catch (error) {
      console.error(`Failed to generate suggestion for ${scoredTerm.term.termType}:`, error);
      // Continue with other terms
    }
  }

  return suggestions;
}

/**
 * STAGE 5: Generate negotiation plan
 */
async function generateNegotiationPlan(
  scoredTerms: ScoredTerm[],
  context: IntakeContext
): Promise<NegotiationPlan> {
  const prompt = getNegotiationPlanPrompt(
    JSON.stringify(scoredTerms, null, 2),
    context
  );
  const anthropic = getAnthropicClient();

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 3072,
    temperature: 0.3,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to extract JSON from negotiation plan response');
  }

  return JSON.parse(jsonMatch[0]);
}

/**
 * Generate assumptions and confidence assessment
 */
function generateAssumptions(
  scoredTerms: ScoredTerm[],
  context: IntakeContext
): AssumptionsAndConfidence {
  const assumptions: Array<{ assumption: string; impact: 'low' | 'medium' | 'high' }> = [];
  const lowConfidenceAreas: Array<{ area: string; reason: string; recommendation: string }> = [];

  // Identify assumptions based on missing context
  if (!context.competitiveProcess || context.competitiveProcess === 'none') {
    assumptions.push({
      assumption: 'Assumed no competitive fundraising process. Leverage may be lower than in competitive situations.',
      impact: 'medium'
    });
  }

  if (!context.companyProfile) {
    assumptions.push({
      assumption: 'No company profile provided. Industry-specific norms may differ (e.g., crypto, deep tech).',
      impact: 'low'
    });
  }

  if (context.geography === 'other') {
    assumptions.push({
      assumption: 'Used Silicon Valley norms as proxy for "other" geography. Regional variations may apply.',
      impact: 'medium'
    });
  }

  // Identify low confidence areas
  const lowConfidenceTerms = scoredTerms.filter(st => st.confidence < 0.7);
  for (const term of lowConfidenceTerms.slice(0, 5)) {
    lowConfidenceAreas.push({
      area: term.term.termType,
      reason: `Limited market data or unusual term structure (confidence: ${Math.round(term.confidence * 100)}%)`,
      recommendation: 'Consult with counsel to verify market positioning and practical implications'
    });
  }

  // Calculate overall confidence
  const avgConfidence = scoredTerms.reduce((sum, st) => sum + st.confidence, 0) / scoredTerms.length;

  return {
    assumptions,
    lowConfidenceAreas,
    overallConfidence: avgConfidence
  };
}
