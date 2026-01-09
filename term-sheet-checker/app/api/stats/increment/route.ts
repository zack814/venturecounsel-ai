import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

const VALID_TOOLS = ['safe_generator', 'term_sheet_analyzer', 'contract_review', 'comp_optimizer'];

// POST - Increment usage count for a tool
export async function POST(request: NextRequest) {
  try {
    const { tool } = await request.json();

    if (!tool || !VALID_TOOLS.includes(tool)) {
      return NextResponse.json(
        { error: 'Invalid tool name' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    if (!supabase) {
      // Silently succeed if Supabase not configured
      return NextResponse.json({ success: true, count: 0 });
    }

    // Increment the count using RPC or update
    const { data: currentData } = await supabase
      .from('usage_stats')
      .select('count')
      .eq('tool_name', tool)
      .single();

    const newCount = (currentData?.count || 0) + 1;

    const { error } = await supabase
      .from('usage_stats')
      .upsert({
        tool_name: tool,
        count: newCount,
        last_updated: new Date().toISOString(),
      }, {
        onConflict: 'tool_name',
      });

    if (error) {
      console.error('Error incrementing stat:', error);
      return NextResponse.json({ success: true, count: newCount });
    }

    return NextResponse.json({ success: true, count: newCount });
  } catch (error) {
    console.error('Increment error:', error);
    return NextResponse.json({ success: true, count: 0 });
  }
}
