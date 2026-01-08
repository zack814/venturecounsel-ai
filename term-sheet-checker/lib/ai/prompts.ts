// =============================================================================
// TERM SHEET ANALYSIS PROMPTS
// =============================================================================
// Multi-stage pipeline approach for high-quality analysis

import { IntakeContext } from '../types';

/**
 * STAGE 1: EXTRACTION PROMPT
 * Extract structured data from raw term sheet text
 */
export function getExtractionPrompt(termSheetText: string, context: IntakeContext): string {
  return `You are a senior venture capital lawyer analyzing a term sheet. Your task is to extract all key terms into a structured format.

TERM SHEET TEXT:
${termSheetText}

CONTEXT:
- Stage: ${context.stage}
- Investor Type: ${context.investorType}
- Geography: ${context.geography}
- Deal Type: ${context.dealType}

Extract the following information as a JSON object. Be precise and quote exact language from the term sheet.

REQUIRED JSON STRUCTURE:
{
  "terms": [
    {
      "termType": "string (e.g., 'liquidation_preference', 'board_composition', 'anti_dilution')",
      "category": "economics | control-governance | exit-transfer | legal-structural",
      "value": "exact value or description from term sheet",
      "sourceText": "exact quote from document",
      "confidence": number (0-1),
      "sectionReference": "Section number if provided"
    }
  ]
}

KEY TERMS TO EXTRACT:
**Economics:**
- Valuation / price / post-money valuation / valuation cap
- Liquidation preference (1x, participating, non-participating, cap)
- Anti-dilution (weighted average, full ratchet, none)
- Dividends (rate, cumulative vs non-cumulative)
- Option pool size
- Pay-to-play provisions
- Redemption rights (RED FLAG if present)

**Control & Governance:**
- Board composition (number of seats, who elects)
- Protective provisions / veto rights (what requires approval, voting threshold)
- Founder vesting (years, cliff, acceleration)
- Voting rights / vote thresholds
- Observer rights
- Information rights

**Exit & Transfer:**
- Pro-rata rights (major investor threshold, how many rounds)
- Super pro-rata provisions
- ROFR (right of first refusal)
- Co-sale / tag-along rights
- Drag-along rights
- Registration rights

**Legal/Structural:**
- No-shop / exclusivity period (days)
- Conditions to closing
- Expenses
- Employee stock option grants
- Key person provisions
- Non-compete / non-solicit

Return ONLY the JSON object, no additional commentary.`;
}

/**
 * STAGE 2: SCORING PROMPT
 * Score each term against market norms and assess severity
 */
export function getScoringPrompt(
  extractedTerms: string,
  marketNorms: string,
  context: IntakeContext
): string {
  return `You are a senior venture capital lawyer providing market-calibrated assessments of term sheet provisions.

CONTEXT:
- Stage: ${context.stage}
- Investor Type: ${context.investorType}
- Geography: ${context.geography}
- Deal Type: ${context.dealType}
- Competitive Process: ${context.competitiveProcess || 'unknown'}
- Has Lead Investor: ${context.hasLeadInvestor ? 'Yes' : 'No'}

EXTRACTED TERMS:
${extractedTerms}

MARKET NORMS (2025 data from NVCA, Cooley GO, Carta):
${marketNorms}

For each term, provide a normative assessment following this framework:

1. **Market Status**: Is this market-standard, acceptable, aggressive, or a red flag?
2. **Severity Score (0-100)**: How harmful if accepted as-is? Consider realistic scenarios.
3. **Risk Class**: When does this matter? (immediate, financing-sensitive, exit-sensitive, downside-only)
4. **Negotiation Posture**: Should founder push hard, push soft, concede, or ignore?
5. **Deal Killer?**: Would this term kill future financings or create fundamental misalignment?

CRITICAL GUIDANCE:
- **Be opinionated**. Say "Do not sign without fixing X" when warranted.
- **Reference market data** specifically (e.g., "98% of Q2 2025 deals use 1x non-participating per Cooley GO")
- **Explain practical impact**, not just definitions (e.g., "This means if you sell for $10M...")
- **Flag time-bombs**: Terms that seem OK now but cause problems later
- **Identify fake issues**: Terms founders worry about but don't actually matter

Return JSON array of scored terms:
[
  {
    "termType": "string",
    "marketStatus": "market-standard | acceptable | aggressive | red-flag",
    "marketStatusScore": number (0-1),
    "severityScore": number (0-100),
    "riskClass": "immediate | financing-sensitive | exit-sensitive | downside-only",
    "negotiationPosture": "push-hard | push-soft | concede | ignore",
    "isDealKiller": boolean,
    "explanation": "2-3 sentences on what this is and why it matters",
    "practicalImpact": "What this means in realistic scenarios",
    "marketComparison": "How this compares to ${context.geography} ${context.stage} norms with specific data",
    "confidence": number (0-1)
  }
]`;
}

/**
 * STAGE 3: EXECUTIVE SUMMARY PROMPT
 */
export function getExecutiveSummaryPrompt(
  scoredTerms: string,
  context: IntakeContext
): string {
  return `Based on the scored terms below, create an executive summary for a founder.

SCORED TERMS:
${scoredTerms}

CONTEXT: ${context.stage} ${context.dealType} from ${context.investorType}

Create a JSON object with:

{
  "overallPosture": "founder-favorable | balanced | investor-leaning | investor-heavy",
  "overallPostureScore": number (0-100, where 0=founder-favorable, 100=investor-heavy),
  "topIssues": [
    {
      "termType": "string",
      "severity": number,
      "summary": "one sentence"
    }
  ],
  "negotiationPriorities": ["Top 3 things to negotiate, in order"],
  "fakeIssues": ["Top 3 things founders worry about but don't actually matter"],
  "dealKillerPresent": boolean,
  "dealKillerTerms": ["term names"] or null
}

Top issues should be ranked by severity AND importance (not just severity). Focus on what will matter most to this founder's future.

Fake issues should be terms that seem important but are actually standard/harmless or that founders commonly over-index on.`;
}

/**
 * STAGE 4: DRAFTING PROMPT
 * Generate alternative clause language
 */
export function getDraftingPrompt(
  termType: string,
  originalClause: string,
  issue: string,
  clauseLibrary: string,
  context: IntakeContext
): string {
  return `You are drafting alternative language for a problematic term sheet clause.

TERM TYPE: ${termType}
ORIGINAL CLAUSE: ${originalClause}
ISSUE: ${issue}
CONTEXT: ${context.stage} ${context.dealType}

CLAUSE LIBRARY (for reference):
${clauseLibrary}

Provide TWO alternatives:

1. **PRIMARY SUGGESTION** (founder-friendly but within realm of possibility)
2. **FALLBACK SUGGESTION** (balanced compromise if investor pushes back)

For each, provide:
- Complete clause language (production-ready, can be copy-pasted)
- Rationale (why this protects the founder)
- Negotiation tips (how to position this with investor)

Also provide:
- 3-5 negotiation talking points (short bullets founder can use)
- Any red flags to watch for in investor's counter

Return JSON:
{
  "primarySuggestion": {
    "language": "complete clause text",
    "rationale": "why this is better",
    "founderFriendliness": "highly-favorable | balanced | acceptable"
  },
  "fallbackSuggestion": {
    "language": "complete clause text",
    "rationale": "why this is acceptable compromise",
    "founderFriendliness": "highly-favorable | balanced | acceptable"
  },
  "negotiationTips": ["tip 1", "tip 2", "tip 3"],
  "redFlags": ["red flag 1", "red flag 2"]
}`;
}

/**
 * STAGE 5: NEGOTIATION PLAN PROMPT
 */
export function getNegotiationPlanPrompt(
  scoredTerms: string,
  context: IntakeContext
): string {
  return `Create a negotiation plan for this term sheet.

SCORED TERMS:
${scoredTerms}

CONTEXT:
- Stage: ${context.stage}
- Competitive Process: ${context.competitiveProcess || 'unknown'}
- Has Lead: ${context.hasLeadInvestor}

Provide strategic guidance on:

1. **Sequencing**: What to raise first vs later vs save for leverage
2. **Trades**: If you concede X, ask for Y
3. **Leverage Analysis**: How much leverage does founder have?

Return JSON:
{
  "sequencing": [
    {
      "priority": number (1=highest),
      "termType": "string",
      "timing": "raise-immediately | raise-early | raise-late | hold-for-leverage",
      "rationale": "why this timing"
    }
  ],
  "suggestedTrades": [
    {
      "giveTerm": "what to concede",
      "getTerm": "what to ask for in return",
      "rationale": "why this trade works"
    }
  ],
  "leverageAnalysis": {
    "estimatedLeverage": "low | medium | high",
    "leverageFactors": ["factor 1", "factor 2"],
    "tacticalRecommendations": ["recommendation 1", "recommendation 2"]
  }
}

Consider:
- What are deal-killers vs nice-to-haves?
- What should be addressed immediately vs in definitive docs?
- What can be traded (e.g., accept slightly higher valuation for better terms)?
- How does competitive situation affect negotiating position?`;
}
