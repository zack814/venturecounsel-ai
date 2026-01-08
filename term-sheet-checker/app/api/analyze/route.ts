// =============================================================================
// API ROUTE - POST /api/analyze
// Accepts term sheet text + context, returns analysis report
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { analyzeTermSheet } from '@/lib/ai/analyzer';
import { checkRateLimit, getClientIp } from '@/lib/utils/rate-limit';
import { AnalysisRequest, AnalysisResponse, IntakeContext } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request);

    // Check rate limit
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      const resetDate = new Date(rateLimit.resetAt);
      return NextResponse.json(
        {
          success: false,
          error: `Rate limit exceeded. You've used your 5 analyses for today. Resets at ${resetDate.toLocaleString()}.`
        } as AnalysisResponse,
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetAt.toString()
          }
        }
      );
    }

    // Parse request body
    const body: AnalysisRequest = await request.json();

    // Validate inputs
    if (!body.termSheetText || body.termSheetText.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Term sheet text is required'
        } as AnalysisResponse,
        { status: 400 }
      );
    }

    if (body.termSheetText.length > 50000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Term sheet text is too long (max 50,000 characters)'
        } as AnalysisResponse,
        { status: 400 }
      );
    }

    if (!body.context) {
      return NextResponse.json(
        {
          success: false,
          error: 'Context information is required'
        } as AnalysisResponse,
        { status: 400 }
      );
    }

    // Validate context fields
    const validStages = ['pre-seed', 'seed', 'series-a', 'series-b-plus'];
    const validInvestorTypes = ['institutional-vc', 'angel', 'strategic', 'crypto-native', 'other'];
    const validGeographies = ['silicon-valley', 'nyc', 'europe', 'other'];
    const validDealTypes = ['safe', 'convertible-note', 'priced-equity', 'token-warrant', 'hybrid'];

    if (!validStages.includes(body.context.stage)) {
      return NextResponse.json(
        { success: false, error: 'Invalid stage' } as AnalysisResponse,
        { status: 400 }
      );
    }

    if (!validInvestorTypes.includes(body.context.investorType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid investor type' } as AnalysisResponse,
        { status: 400 }
      );
    }

    if (!validGeographies.includes(body.context.geography)) {
      return NextResponse.json(
        { success: false, error: 'Invalid geography' } as AnalysisResponse,
        { status: 400 }
      );
    }

    if (!validDealTypes.includes(body.context.dealType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid deal type' } as AnalysisResponse,
        { status: 400 }
      );
    }

    // Run analysis
    console.log('Starting analysis for IP:', clientIp);
    const report = await analyzeTermSheet(body.termSheetText, body.context);

    // Return success response with rate limit headers
    return NextResponse.json(
      {
        success: true,
        report
      } as AnalysisResponse,
      {
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetAt.toString()
        }
      }
    );

  } catch (error) {
    console.error('Analysis API error:', error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      } as AnalysisResponse,
      { status: 500 }
    );
  }
}

// Return 405 for non-POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
