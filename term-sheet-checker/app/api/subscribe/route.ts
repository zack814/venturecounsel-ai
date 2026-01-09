import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';
import { getWelcomeEmailHtml, getWelcomeEmailText } from '@/lib/email-templates/welcome';

// Initialize Resend lazily to avoid build errors when env var is not set
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

interface SubscribeRequest {
  email: string;
  leadMagnet?: string;
  sourcePage?: string;
  sourceVariant?: string;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Lead magnet download URLs
const LEAD_MAGNET_URLS: Record<string, string> = {
  'term-sheet-checklist': 'https://venturecounsel.ai/downloads/term-sheet-checklist',
  'weekly-insights': 'https://venturecounsel.ai/blog',
  'safe-guide': 'https://venturecounsel.ai/downloads/safe-vs-convertible-note',
  'comp-benchmarks': 'https://venturecounsel.ai/downloads/comp-benchmarks.pdf',
  'founder-legal-toolkit': 'https://venturecounsel.ai/downloads/founder-legal-toolkit.pdf',
};

export async function POST(request: NextRequest) {
  try {
    const body: SubscribeRequest = await request.json();
    const { email, leadMagnet, sourcePage, sourceVariant } = body;

    // Validate email
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if Supabase is configured
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error('Supabase not configured');
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    // Check for duplicate email
    const { data: existing } = await supabase
      .from('email_subscribers')
      .select('id')
      .eq('email', normalizedEmail)
      .single();

    if (existing) {
      // Email already exists - still send the lead magnet but don't create duplicate
      await sendWelcomeEmail(normalizedEmail, leadMagnet || 'term-sheet-checklist');
      return NextResponse.json({
        success: true,
        message: 'Check your inbox for the download link!',
      });
    }

    // Insert new subscriber
    const { error: insertError } = await supabase
      .from('email_subscribers')
      .insert({
        email: normalizedEmail,
        lead_magnet: leadMagnet || null,
        source_page: sourcePage || null,
        source_variant: sourceVariant || null,
        confirmed: false,
        metadata: {
          user_agent: request.headers.get('user-agent') || null,
          timestamp: new Date().toISOString(),
        },
      });

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save your email. Please try again.' },
        { status: 500 }
      );
    }

    // Send welcome email with lead magnet
    await sendWelcomeEmail(normalizedEmail, leadMagnet || 'term-sheet-checklist');

    return NextResponse.json({
      success: true,
      message: 'Check your inbox for the download link!',
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

async function sendWelcomeEmail(email: string, leadMagnet: string): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn('Resend not configured, skipping email');
    return;
  }

  const downloadUrl = LEAD_MAGNET_URLS[leadMagnet] || LEAD_MAGNET_URLS['term-sheet-checklist'];

  try {
    await resend.emails.send({
      from: 'VentureCounsel.AI <hello@venturecounsel.ai>',
      to: email,
      subject: `Your ${getLeadMagnetTitle(leadMagnet)} is Ready!`,
      html: getWelcomeEmailHtml({ leadMagnet, downloadUrl }),
      text: getWelcomeEmailText({ leadMagnet, downloadUrl }),
    });
  } catch (error) {
    // Log but don't fail the request if email fails
    console.error('Failed to send welcome email:', error);
  }
}

function getLeadMagnetTitle(leadMagnet: string): string {
  const titles: Record<string, string> = {
    'term-sheet-checklist': 'Term Sheet Checklist',
    'safe-guide': 'SAFE Guide',
    'comp-benchmarks': 'Compensation Benchmarks',
    'founder-legal-toolkit': 'Founder Legal Toolkit',
  };
  return titles[leadMagnet] || 'Resource';
}
