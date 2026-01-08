# Term Sheet Reality Checker - Build Status

## ✅ COMPLETED COMPONENTS

### 1. Research & Data Foundation
- ✅ Comprehensive market norms research (50+ authoritative sources)
- ✅ Market norms database (v1-2025-q1.json) with:
  - Liquidation preferences, anti-dilution, board composition, vesting terms
  - Pro-rata rights, protective provisions, valuation ranges
  - All major term types across pre-seed through Series B+
  - Silicon Valley and Europe geography coverage
  - Data from NVCA, Cooley GO Q1-Q2 2025, Carta 2025, Wilson Sonsini, YC, a16z

### 2. Clause Library
- ✅ Comprehensive clause library (library-v1.json) with:
  - 11 major term types with founder-friendly, market-standard, and fallback language
  - Detailed rationales and negotiation tips for each
  - Production-ready clause language that can be copy-pasted
  - Covers: liquidation prefs, anti-dilution, board composition, vesting, pro-rata, protective provisions, drag-along, no-shop, redemption rights, information rights

### 3. Project Infrastructure
- ✅ Next.js 15 project structure with TypeScript
- ✅ Tailwind CSS configuration (matching venturecounsel.ai design)
- ✅ Comprehensive type definitions for entire analysis pipeline
- ✅ Anthropic Claude SDK integration setup
- ✅ Environment configuration

### 4. Type System
- ✅ Complete TypeScript interfaces:
  - `IntakeContext` - founder input form
  - `ExtractedTerm` & `ExtractedTermSheet` - extraction pipeline
  - `MarketNorm` - norms database schema
  - `ScoredTerm` - scoring engine output
  - `ClauseSuggestion` - drafting engine output
  - `ExecutiveSummary` - top-level analysis
  - `NegotiationPlan` - strategic guidance
  - `AnalysisReport` - complete output
  - API request/response types

### 5. AI Prompts (Multi-Stage Pipeline)
- ✅ 5-stage analysis pipeline prompts:
  - Stage 1: Extraction (structured JSON extraction from term sheet)
  - Stage 2: Scoring (market calibration + severity assessment)
  - Stage 3: Executive Summary (top issues + fake issues + overall posture)
  - Stage 4: Drafting (alternative clause language generation)
  - Stage 5: Negotiation Plan (sequencing + trades + leverage analysis)

---

## 🚧 REMAINING TO BUILD

### 6. AI Analysis Engine (lib/ai/analyzer.ts)
- Orchestrate the 5-stage pipeline
- Call Claude API for each stage
- Combine results into AnalysisReport
- Handle errors and retries
- Load market norms and clause library
- **Estimated: 2-3 hours**

### 7. API Route (app/api/analyze/route.ts)
- Accept POST request with term sheet + context
- Call analyzer
- Return AnalysisReport
- Rate limiting logic (5 per IP per day)
- **Estimated: 1 hour**

### 8. Frontend UI Components

#### Main Page (app/page.tsx)
- Hero section with value prop
- Input form (text paste + context dropdowns)
- Submit button → triggers analysis
- Loading state
- **Estimated: 2 hours**

#### Report Component (components/Report.tsx)
- Display all 5 sections:
  1. Executive Summary (posture score, top issues, priorities, fake issues)
  2. Term-by-Term Table (sortable, filterable)
  3. Negotiation Plan (sequencing, trades, leverage)
  4. Clause Suggestions (copy buttons, primary/fallback)
  5. Assumptions & Confidence
- Professional design matching venturecounsel.ai
- Copy-to-clipboard functionality
- **Estimated: 4-5 hours**

#### Components directory structure:
```
components/
  ├── IntakeForm.tsx (context input form)
  ├── Report.tsx (main report wrapper)
  ├── ExecutiveSummary.tsx
  ├── TermsTable.tsx
  ├── NegotiationPlan.tsx
  ├── ClauseSuggestions.tsx
  └── AssumptionsSection.tsx
```

### 9. Rate Limiting
- Simple file-based or in-memory IP tracking
- 5 analyses per IP per day
- Clear error message when limit hit
- **Estimated: 30 min**

### 10. Update Main Website
- Add "Term Sheet Checker" to navigation in index.html
- Add prominent CTA in hero section
- Update footer links
- **Estimated: 15 min**

### 11. Deployment Setup
- vercel.json configuration
- Environment variable setup instructions
- README with setup guide
- **Estimated: 30 min**

### 12. Testing & Refinement
- Test with 3-5 sample term sheets
- Refine prompts based on output quality
- Fix any UI issues
- Performance optimization
- **Estimated: 2-3 hours**

---

## TOTAL ESTIMATED REMAINING TIME
**~12-15 hours of focused development work**

This breaks down to:
- Backend (analyzer + API): ~3-4 hours
- Frontend (all UI components): ~6-7 hours
- Integration (rate limiting, website updates, deployment): ~1-2 hours
- Testing & refinement: ~2-3 hours

---

## CURRENT FILE STRUCTURE

```
term-sheet-checker/
├── app/
│   ├── globals.css ✅
│   └── layout.tsx ✅
├── data/
│   ├── norms/
│   │   └── v1-2025-q1.json ✅ (comprehensive market norms)
│   └── clauses/
│       └── library-v1.json ✅ (clause alternatives)
├── lib/
│   ├── types/
│   │   └── index.ts ✅ (all TypeScript interfaces)
│   └── ai/
│       └── prompts.ts ✅ (5-stage pipeline prompts)
├── package.json ✅
├── tsconfig.json ✅
├── tailwind.config.ts ✅
├── next.config.ts ✅
└── .env.local.example ✅

STILL TO CREATE:
├── lib/ai/analyzer.ts (core analysis engine)
├── lib/utils/rate-limit.ts
├── lib/utils/norms-loader.ts
├── lib/utils/clause-loader.ts
├── app/api/analyze/route.ts
├── app/page.tsx (main checker UI)
├── components/ (all UI components)
└── README.md
```

---

## KEY DECISIONS MADE

1. **LLM**: Using Claude (Anthropic) for superior structured output and document analysis
2. **Architecture**: Multi-stage pipeline (not monolithic prompt) for quality and debuggability
3. **Norms Data**: Manually curated from authoritative 2024-2025 sources (NVCA, Cooley, Carta)
4. **Design**: Matching venturecounsel.ai aesthetic (blue-900, Inter font, clean cards)
5. **Rate Limiting**: Simple IP-based, 5/day, no auth required for MVP
6. **Deployment**: Vercel (simplest for Next.js)

---

## NEXT STEPS

**Option A: Continue Building (Recommended)**
I can continue implementing the remaining components sequentially:
1. Build the analyzer engine (core logic)
2. Create the API route
3. Build the UI components
4. Add rate limiting
5. Update main website
6. Deploy

**Option B: Review & Adjust**
If you'd like to review what's been built so far or make adjustments to the approach before continuing.

**Option C: Pause & Deploy What We Have**
We could create a simple "Coming Soon" page and deploy the infrastructure, then iterate.

---

## WHAT YOU NEED TO PROVIDE

Before final deployment, you'll need:
1. **Anthropic API Key** - Get from https://console.anthropic.com/
2. **Vercel Account** (free tier works) - If not already set up
3. **Domain/Subdomain Decision** - Where should this live?
   - venturecounsel.ai/term-sheet-checker (subpath)
   - checker.venturecounsel.ai (subdomain)
   - Other?

---

## NOTES

- All prompts are designed to be **opinionated and normative** as requested
- Market norms are **data-backed** with specific sources and percentages
- Clause library provides **production-ready language**, not just templates
- Type system is **comprehensive** to prevent runtime errors
- Design will **match existing site** for brand consistency

The foundation is solid. The remaining work is primarily integration and UI polish.
