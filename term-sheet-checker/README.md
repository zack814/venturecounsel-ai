# Term Sheet Reality Checker

A sophisticated AI-powered tool that provides market-calibrated, context-sensitive analysis of startup term sheets. Built for VentureCounsel.AI.

## Features

- **Comprehensive Analysis**: 5-stage AI pipeline analyzing term sheets against current market norms
- **Market Data-Driven**: Built on 2024-2025 data from NVCA, Cooley GO, Carta, and top law firms
- **Production-Ready Clauses**: Copy-paste alternative language for problematic terms
- **Negotiation Guidance**: Strategic sequencing, trades, and leverage analysis
- **Beautiful UI**: Matches VentureCounsel.AI design system

## Quick Start

### Prerequisites

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **Anthropic API Key** - [Get from console.anthropic.com](https://console.anthropic.com/)

### Installation

```bash
cd term-sheet-checker

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local

# Edit .env.local and add your Anthropic API key:
# ANTHROPIC_API_KEY=your_key_here
```

### Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Build
npm run build

# Test production build locally
npm start
```

## Deployment to Vercel

### Option A: Deploy from GitHub

1. Push this folder to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Set the **Root Directory** to `term-sheet-checker`
6. Add environment variable: `ANTHROPIC_API_KEY`
7. Deploy!

### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd term-sheet-checker
vercel

# Add environment variable when prompted:
# ANTHROPIC_API_KEY
```

## Project Structure

```
term-sheet-checker/
├── app/
│   ├── api/analyze/route.ts    # Analysis API endpoint
│   ├── page.tsx                # Main UI page
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/
│   ├── IntakeForm.tsx          # Input form
│   ├── Report.tsx              # Report wrapper
│   ├── ExecutiveSummary.tsx    # Section 1
│   ├── TermsTable.tsx          # Section 2
│   ├── NegotiationPlan.tsx     # Section 3
│   ├── ClauseSuggestions.tsx   # Section 4
│   └── AssumptionsSection.tsx  # Section 5
├── lib/
│   ├── ai/
│   │   ├── analyzer.ts         # Core analysis engine
│   │   └── prompts.ts          # 5-stage prompts
│   ├── types/
│   │   └── index.ts            # TypeScript definitions
│   └── utils/
│       ├── loaders.ts          # Data loading
│       └── rate-limit.ts       # IP-based rate limiting
├── data/
│   ├── norms/
│   │   └── v1-2025-q1.json     # Market norms database
│   └── clauses/
│       └── library-v1.json     # Clause alternatives
└── package.json
```

## How It Works

### 5-Stage Analysis Pipeline

1. **Extraction**: Structured extraction of terms from raw text
2. **Scoring**: Each term scored against market norms with severity assessment
3. **Executive Summary**: Overall posture, top issues, fake issues
4. **Drafting**: Alternative clause language generation
5. **Negotiation Plan**: Strategic sequencing and leverage analysis

### Data Sources

Market norms compiled from:
- NVCA Model Documents
- Cooley GO Quarterly Reports (Q1-Q2 2025)
- Carta State of Private Markets 2025
- Wilson Sonsini, Fenwick & West guidance
- YC Series A Term Sheet
- a16z published guidance

### Rate Limiting

- 5 analyses per IP address per 24 hours
- In-memory storage (resets on server restart)
- Upgrade to persistent storage (Redis/DB) for production scale

## Configuration

### Environment Variables

```bash
# Required
ANTHROPIC_API_KEY=your_anthropic_api_key

# Optional (for future enhancements)
# DATABASE_URL=postgresql://...
# REDIS_URL=redis://...
```

### Customization

**Update Market Norms:**
- Edit `data/norms/v1-2025-q1.json`
- Create new version files as market changes

**Update Clause Library:**
- Edit `data/clauses/library-v1.json`
- Add new term types and alternatives

**Adjust Rate Limits:**
- Modify `lib/utils/rate-limit.ts`
- Change `RATE_LIMIT` constant

## Integration with Main Site

The main VentureCounsel.AI site (`index.html`) has been updated with:
- Navigation link to `/term-sheet-checker`
- Mobile menu support

For deployment, you'll need to:
1. Deploy the Next.js app to Vercel (or similar)
2. Configure your domain to route `/term-sheet-checker` to the deployed app
3. Or deploy as subdomain: `checker.venturecounsel.ai`

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Anthropic Claude Opus 4
- **Deployment**: Vercel (recommended)

## API Usage

### POST /api/analyze

**Request:**
```json
{
  "termSheetText": "full term sheet text...",
  "context": {
    "stage": "seed",
    "investorType": "institutional-vc",
    "geography": "silicon-valley",
    "dealType": "priced-equity",
    "competitiveProcess": "some",
    "hasLeadInvestor": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "report": {
    "analyzedAt": "2025-01-08T...",
    "executiveSummary": { ... },
    "scoredTerms": [ ... ],
    "negotiationPlan": { ... },
    "clauseSuggestions": [ ... ],
    "assumptionsAndConfidence": { ... },
    "processingTimeMs": 45000
  }
}
```

## Cost Estimates

Using Claude Opus 4:
- Input: $3 per million tokens
- Output: $15 per million tokens
- Typical analysis: ~10K input + ~8K output tokens
- **Cost per analysis: ~$0.15**

For 1000 analyses/month: ~$150

Consider:
- Using Claude Sonnet for lower cost (~$0.02/analysis)
- Caching common prompts
- Rate limiting to control costs

## Troubleshooting

**Analysis fails:**
- Check `ANTHROPIC_API_KEY` is set correctly
- Check API key has sufficient credits
- Check term sheet isn't too long (max 50K characters)

**Build errors:**
- Run `npm install` to ensure dependencies installed
- Check Node.js version (18+ required)
- Delete `.next` folder and rebuild

**Rate limit issues:**
- Server restart resets in-memory limits
- Consider persistent storage for production

## License

Proprietary - VentureCounsel.AI

## Support

For issues or questions, contact the VentureCounsel.AI team.
