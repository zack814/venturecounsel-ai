import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET - Get approved testimonials (public) or all (admin)
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ testimonials: [] });
    }

    const authHeader = request.headers.get('x-admin-password');
    const isAdmin = authHeader === process.env.ADMIN_PASSWORD;

    let query = supabase
      .from('user_testimonials')
      .select('id, name, company, role, testimonial_text, tool_used, rating, created_at, approved, featured');

    if (!isAdmin) {
      query = query.eq('approved', true);
    }

    const { data, error } = await query.order('featured', { ascending: false }).order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching testimonials:', error);
      return NextResponse.json({ testimonials: [] });
    }

    return NextResponse.json({
      testimonials: data || [],
      isAdmin,
    });
  } catch (error) {
    console.error('Testimonials fetch error:', error);
    return NextResponse.json({ testimonials: [] });
  }
}

// POST - Submit a new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, company, role, testimonialText, toolUsed, rating, email } = body;

    // Validate required fields
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please provide your name' },
        { status: 400 }
      );
    }

    if (!testimonialText || testimonialText.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please provide feedback (at least 10 characters)' },
        { status: 400 }
      );
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
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
      .from('user_testimonials')
      .insert({
        name: name.trim(),
        company: company?.trim() || null,
        role: role?.trim() || null,
        testimonial_text: testimonialText.trim(),
        tool_used: toolUsed || null,
        rating: rating || null,
        email: email.toLowerCase().trim(),
        approved: false, // Requires admin approval
      });

    if (error) {
      console.error('Testimonial insert error:', error);
      return NextResponse.json(
        { error: 'Failed to submit testimonial. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your testimonial will appear after review.',
    });
  } catch (error) {
    console.error('Testimonial submit error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

// PATCH - Approve/feature testimonial (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('x-admin-password');
    if (authHeader !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, approved, featured } = body;

    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID required' }, { status: 400 });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const updates: Record<string, unknown> = {};
    if (typeof approved === 'boolean') {
      updates.approved = approved;
      if (approved) {
        updates.approved_at = new Date().toISOString();
      }
    }
    if (typeof featured === 'boolean') {
      updates.featured = featured;
    }

    const { error } = await supabase
      .from('user_testimonials')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Testimonial update error:', error);
      return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Testimonial patch error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
