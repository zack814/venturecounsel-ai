import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Create a placeholder client that will be replaced with actual client when env vars are available
let supabaseClient: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

// Export a getter function to safely access the client
export function getSupabase(): SupabaseClient | null {
  return supabaseClient;
}

// For backwards compatibility, but will throw if not configured
export const supabase = {
  from: (table: string) => {
    if (!supabaseClient) {
      throw new Error('Supabase not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
    }
    return supabaseClient.from(table);
  },
};

export interface EmailSubscriber {
  id: string;
  email: string;
  lead_magnet: string | null;
  source_page: string | null;
  source_variant: string | null;
  created_at: string;
  confirmed: boolean;
  metadata: Record<string, unknown>;
}
