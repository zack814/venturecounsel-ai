import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// GET - Fetch usage stats
export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      // Return default stats if Supabase not configured
      return NextResponse.json({
        safe_generator: 0,
        term_sheet_analyzer: 0,
        contract_review: 0,
        comp_optimizer: 0,
        total: 0,
      });
    }

    const { data, error } = await supabase
      .from('usage_stats')
      .select('tool_name, count');

    if (error) {
      console.error('Error fetching stats:', error);
      return NextResponse.json({
        safe_generator: 0,
        term_sheet_analyzer: 0,
        contract_review: 0,
        comp_optimizer: 0,
        total: 0,
      });
    }

    const stats: Record<string, number> = {};
    let total = 0;

    for (const row of data || []) {
      stats[row.tool_name] = row.count;
      total += row.count;
    }

    return NextResponse.json({
      ...stats,
      total,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({
      safe_generator: 0,
      term_sheet_analyzer: 0,
      contract_review: 0,
      comp_optimizer: 0,
      total: 0,
    });
  }
}
