import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

const VALID_TOOLS = ['safe_generator', 'term_sheet_analyzer', 'contract_review', 'comp_optimizer'];

// POST - Submit tool feedback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolName, rating, feedbackText, wouldRecommend, email } = body;

    // Validate required fields
    if (!toolName || !VALID_TOOLS.includes(toolName)) {
      return NextResponse.json(
        { error: 'Invalid tool name' },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    const { error } = await supabase
      .from('tool_feedback')
      .insert({
        tool_name: toolName,
        rating,
        feedback_text: feedbackText || null,
        would_recommend: wouldRecommend ?? null,
        email: email?.toLowerCase().trim() || null,
        metadata: {
          user_agent: request.headers.get('user-agent') || null,
          timestamp: new Date().toISOString(),
        },
      });

    if (error) {
      console.error('Feedback insert error:', error);
      return NextResponse.json(
        { error: 'Failed to submit feedback. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback!',
    });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

// GET - Get feedback summary (admin only)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('x-admin-password');
    if (authHeader !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const { data, error } = await supabase
      .from('tool_feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
    }

    // Calculate summary stats
    const summary: Record<string, { count: number; avgRating: number; recommendations: number }> = {};

    for (const feedback of data || []) {
      if (!summary[feedback.tool_name]) {
        summary[feedback.tool_name] = { count: 0, avgRating: 0, recommendations: 0 };
      }
      summary[feedback.tool_name].count++;
      summary[feedback.tool_name].avgRating += feedback.rating;
      if (feedback.would_recommend) {
        summary[feedback.tool_name].recommendations++;
      }
    }

    // Calculate averages
    for (const tool in summary) {
      if (summary[tool].count > 0) {
        summary[tool].avgRating = Math.round((summary[tool].avgRating / summary[tool].count) * 10) / 10;
      }
    }

    return NextResponse.json({
      feedback: data,
      summary,
      totalCount: data?.length || 0,
    });
  } catch (error) {
    console.error('Feedback fetch error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
