import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variable extraction (VITE_ prefix required for browser bundles)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 20
);

/**
 * Singleton Supabase Client for client-side queries.
 * In production, Row Level Security guarantees that all queries are scoped
 * to the authenticated tenant JWT claims.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Diagnostic helper to verify Supabase connection state.
 */
export function getSupabaseConnectionStatus(): {
  configured: boolean;
  url: string | null;
  mode: 'LIVE_SUPABASE_RLS' | 'ISOLATED_IN_MEMORY_STORE';
} {
  return {
    configured: isSupabaseConfigured,
    url: supabaseUrl || null,
    mode: isSupabaseConfigured ? 'LIVE_SUPABASE_RLS' : 'ISOLATED_IN_MEMORY_STORE',
  };
}
