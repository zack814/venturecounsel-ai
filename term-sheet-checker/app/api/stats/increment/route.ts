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

    // Use atomic RPC function to increment count
    // This eliminates race conditions and reduces to a single database call
    // See: supabase/migrations/001_performance_optimizations.sql
    const { error: rpcError } = await supabase.rpc('increment_usage_stat', {
      p_tool_name: tool,
    });

    if (rpcError) {
      // Fallback to manual upsert if RPC not available (migration not run yet)
      console.warn('RPC not available, using fallback:', rpcError.message);
      const { data: currentData } = await supabase
        .from('usage_stats')
        .select('count')
        .eq('tool_name', tool)
        .maybeSingle();

      const newCount = (currentData?.count || 0) + 1;

      await supabase
        .from('usage_stats')
        .upsert({
          tool_name: tool,
          count: newCount,
          last_updated: new Date().toISOString(),
        }, {
          onConflict: 'tool_name',
        });

      return NextResponse.json({ success: true, count: newCount });
    }

    // Get updated count after increment
    const { data: updated } = await supabase
      .from('usage_stats')
      .select('count')
      .eq('tool_name', tool)
      .maybeSingle();

    return NextResponse.json({ success: true, count: updated?.count || 1 });
  } catch (error) {
    console.error('Increment error:', error);
    return NextResponse.json({ success: true, count: 0 });
  }
}
