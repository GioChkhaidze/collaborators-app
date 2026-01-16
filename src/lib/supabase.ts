import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
} else {
  console.log('[Supabase] Client initialized successfully');
  console.log('[Supabase] URL:', supabaseUrl);
  console.log('[Supabase] Anon Key:', supabaseAnonKey.substring(0, 20) + '...');
  
  // Verify URL format
  if (!supabaseUrl.includes('supabase.co')) {
    console.warn('[Supabase] ⚠️ URL format might be incorrect. Expected: https://xxxxx.supabase.co');
  }
}

// Create Supabase client
// Note: Schema with spaces needs to be specified in each query using .schema() method
// This will work even if credentials are missing (for development with mock data)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabase !== null;
};

