import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// GET - Get all approved feature requests
export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ features: [] });
    }

    const { data, error } = await supabase
      .from('feature_requests')
      .select('id, title, description, vote_count, status, created_at')
      .in('status', ['approved', 'in_progress', 'completed'])
      .order('vote_count', { ascending: false });

    if (error) {
      console.error('Error fetching features:', error);
      return NextResponse.json({ features: [] });
    }

    return NextResponse.json({ features: data || [] });
  } catch (error) {
    console.error('Features fetch error:', error);
    return NextResponse.json({ features: [] });
  }
}

// POST - Submit a new feature request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, email } = body;

    if (!title || title.trim().length < 5) {
      return NextResponse.json(
        { error: 'Please provide a title (at least 5 characters)' },
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

    const { data, error } = await supabase
      .from('feature_requests')
      .insert({
        title: title.trim(),
        description: description?.trim() || null,
        submitted_by_email: email?.toLowerCase().trim() || null,
        vote_count: 1,
        status: 'pending', // Requires admin approval
      })
      .select('id')
      .single();

    if (error) {
      console.error('Feature insert error:', error);
      return NextResponse.json(
        { error: 'Failed to submit feature request. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Feature request submitted! It will appear after review.',
      featureId: data?.id,
    });
  } catch (error) {
    console.error('Feature submit error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
