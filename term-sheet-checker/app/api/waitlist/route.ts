import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST - Join premium waitlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, featureInterest, companyName, companyStage } = body;

    // Validate email
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
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

    const normalizedEmail = email.toLowerCase().trim();

    // Check for existing signup
    const { data: existing } = await supabase
      .from('premium_waitlist')
      .select('id')
      .eq('email', normalizedEmail)
      .single();

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "You're already on the waitlist! We'll be in touch soon.",
        alreadySignedUp: true,
      });
    }

    // Insert new waitlist signup
    const { error } = await supabase
      .from('premium_waitlist')
      .insert({
        email: normalizedEmail,
        feature_interest: featureInterest || null,
        company_name: companyName || null,
        company_stage: companyStage || null,
        metadata: {
          user_agent: request.headers.get('user-agent') || null,
          timestamp: new Date().toISOString(),
        },
      });

    if (error) {
      console.error('Waitlist insert error:', error);
      return NextResponse.json(
        { error: 'Failed to join waitlist. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "You're on the list! We'll notify you when premium features launch.",
    });
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

// GET - Get waitlist count (public) or full list (admin)
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ count: 0 });
    }

    const authHeader = request.headers.get('x-admin-password');
    const isAdmin = authHeader === process.env.ADMIN_PASSWORD;

    if (isAdmin) {
      // Return full list for admin
      const { data, error } = await supabase
        .from('premium_waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return NextResponse.json({ error: 'Failed to fetch waitlist' }, { status: 500 });
      }

      return NextResponse.json({ waitlist: data, count: data?.length || 0 });
    }

    // Public: just return count
    const { count, error } = await supabase
      .from('premium_waitlist')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json({ count: 0 });
    }

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error('Waitlist fetch error:', error);
    return NextResponse.json({ count: 0 });
  }
}
