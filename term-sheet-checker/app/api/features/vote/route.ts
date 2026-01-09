import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// POST - Vote for a feature
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { featureId, voterIdentifier } = body;

    if (!featureId) {
      return NextResponse.json(
        { error: 'Feature ID is required' },
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

    // Generate voter identifier from IP or provided identifier
    const identifier = voterIdentifier ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'anonymous';

    // Check if already voted
    const { data: existingVote } = await supabase
      .from('feature_votes')
      .select('id')
      .eq('feature_id', featureId)
      .eq('voter_identifier', identifier)
      .single();

    if (existingVote) {
      return NextResponse.json({
        success: false,
        message: 'You have already voted for this feature',
        alreadyVoted: true,
      });
    }

    // Add vote record
    const { error: voteError } = await supabase
      .from('feature_votes')
      .insert({
        feature_id: featureId,
        voter_identifier: identifier,
      });

    if (voteError) {
      // Likely duplicate vote due to race condition
      if (voteError.code === '23505') {
        return NextResponse.json({
          success: false,
          message: 'You have already voted for this feature',
          alreadyVoted: true,
        });
      }
      console.error('Vote insert error:', voteError);
      return NextResponse.json(
        { error: 'Failed to record vote' },
        { status: 500 }
      );
    }

    // Increment vote count
    const { data: feature } = await supabase
      .from('feature_requests')
      .select('vote_count')
      .eq('id', featureId)
      .single();

    const newCount = (feature?.vote_count || 0) + 1;

    await supabase
      .from('feature_requests')
      .update({ vote_count: newCount, updated_at: new Date().toISOString() })
      .eq('id', featureId);

    return NextResponse.json({
      success: true,
      message: 'Vote recorded!',
      newVoteCount: newCount,
    });
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
