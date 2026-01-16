import { supabase, isSupabaseConfigured } from './supabase';
import type { Campaign, CollaboratorProfile, MerchantLeaderboardEntry, DailyWinner } from '../pages/Collaborators/types';

/**
 * Supabase queries for the Collaborators app
 * These queries fetch data from the "Snoonu Collaborators" schema
 */

// Test Supabase connection
export const testSupabaseConnection = async (): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    console.warn('[Supabase] Connection test failed - not configured');
    return false;
  }

  try {
    // Try a simple query to test connection
    // Schema name with spaces must be specified in each query
    const { error } = await supabase!
      .schema('Snoonu Collaborators')
      .from('announcments')
      .select('id')
      .limit(1);

    if (error) {
      console.error('[Supabase] Connection test error:', error);
      console.error('[Supabase] Error message:', error.message);
      console.error('[Supabase] Error code:', error.code);
      console.error('[Supabase] Error details:', error.details);
      console.error('[Supabase] Error hint:', error.hint);
      
      // Specific guidance for common errors
      if (error.code === 'PGRST116' || error.message?.includes('406') || error.message?.includes('not found')) {
        console.error('');
        console.error('🔴 SCHEMA EXPOSURE ISSUE DETECTED');
        console.error('The "Snoonu Collaborators" schema is not exposed in Supabase API Settings.');
        console.error('');
        console.error('📋 TO FIX:');
        console.error('1. Go to: https://app.supabase.com/project/purjgxyslufptvruhuoe/settings/api');
        console.error('2. Scroll to "Exposed Schemas" section');
        console.error('3. Add "Snoonu Collaborators" (exact name with space)');
        console.error('4. Save and refresh this page');
        console.error('');
      }
      
      return false;
    }

    console.log('[Supabase] Connection test successful');
    return true;
  } catch (error) {
    console.error('[Supabase] Connection test failed:', error);
    return false;
  }
};

// Fetch campaigns from Supabase announcments table
export const fetchCampaigns = async (): Promise<Campaign[]> => {
  if (!isSupabaseConfigured()) {
    console.warn('[Supabase] Not configured - check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
    return [];
  }

  try {
    console.log('[Supabase] Fetching campaigns from "Snoonu Collaborators".announcments...');
    
    // Schema name with spaces must be specified in each query
    const { data, error } = await supabase!
      .schema('Snoonu Collaborators')
      .from('announcments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase] Query error:', error);
      console.error('[Supabase] Error message:', error.message);
      console.error('[Supabase] Error code:', error.code);
      console.error('[Supabase] Error details:', error.details);
      console.error('[Supabase] Error hint:', error.hint);
      
      // If it's a 406 error, it's likely a schema exposure issue
      if (error.code === 'PGRST116' || error.message?.includes('406') || error.message?.includes('not found')) {
        console.error('');
        console.error('🔴 SCHEMA EXPOSURE ISSUE DETECTED');
        console.error('The "Snoonu Collaborators" schema is not exposed in Supabase API Settings.');
        console.error('');
        console.error('📋 TO FIX:');
        console.error('1. Go to: https://app.supabase.com/project/purjgxyslufptvruhuoe/settings/api');
        console.error('2. Scroll to "Exposed Schemas" section');
        console.error('3. Add "Snoonu Collaborators" (exact name with space)');
        console.error('4. Save and refresh this page');
        console.error('');
      }
      
      throw error;
    }
    
    console.log(`[Supabase] Successfully fetched ${data?.length || 0} campaigns`);
    
    if (!data || data.length === 0) {
      console.warn('[Supabase] No campaigns found in database');
      return [];
    }
    
    // Map database columns (snake_case) to Campaign type (camelCase)
    const mappedCampaigns = (data || []).map((row: any): Campaign => ({
      id: row.id,
      merchant: row.merchant,
      logo: row.logo || '',
      vertical: row.vertical || '',
      category: row.category || '',
      discount: row.discount || '',
      reward: row.reward || '',
      rewardExample: row.reward_example || '',
      minOrder: row.min_order || '',
      videoReq: row.video_req || '',
      requirements: Array.isArray(row.requirements) 
        ? row.requirements 
        : (row.requirements ? [row.requirements] : []),
      budget: row.budget || '',
      timeline: row.timeline || '',
      reviewNotes: row.review_notes || '',
      productImage: row.product_image || undefined,
      productName: row.product_name || undefined,
    }));
    
    console.log('[Supabase] Mapped campaigns:', mappedCampaigns.length);
    return mappedCampaigns;
  } catch (error: any) {
    console.error('[Supabase] Error fetching campaigns:', error);
    console.error('[Supabase] Error details:', {
      message: error?.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
    });
    return [];
  }
};

// Example: Fetch collaborator profiles
export const fetchCollaborators = async (): Promise<CollaboratorProfile[]> => {
  if (!isSupabaseConfigured()) {
    console.log('Supabase not configured, returning empty array');
    return [];
  }

  try {
    const { data, error } = await supabase!
      .schema('Snoonu Collaborators')
      .from('collaborators')
      .select('*')
      .order('total_earnings', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching collaborators:', error);
    return [];
  }
};

// Example: Fetch merchant leaderboard
export const fetchMerchantLeaderboard = async (): Promise<MerchantLeaderboardEntry[]> => {
  if (!isSupabaseConfigured()) {
    console.log('Supabase not configured, returning empty array');
    return [];
  }

  try {
    const { data, error } = await supabase!
      .schema('Snoonu Collaborators')
      .from('merchant_leaderboard')
      .select('*')
      .order('commissions_given', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching merchant leaderboard:', error);
    return [];
  }
};

// Example: Fetch daily winners
export const fetchDailyWinners = async (): Promise<DailyWinner[]> => {
  if (!isSupabaseConfigured()) {
    console.log('Supabase not configured, returning empty array');
    return [];
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase!
      .schema('Snoonu Collaborators')
      .from('daily_winners')
      .select('*')
      .eq('date', today)
      .order('earnings', { ascending: false })
      .limit(3);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching daily winners:', error);
    return [];
  }
};

// Example: Real-time subscription for campaigns (optional)
export const subscribeToCampaigns = (callback: (campaigns: Campaign[]) => void) => {
  if (!isSupabaseConfigured()) {
    console.log('Supabase not configured, subscription not available');
    return null;
  }

  const channel = supabase!
    .channel('campaigns-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'Snoonu Collaborators',
        table: 'announcments',
      },
      async () => {
        const campaigns = await fetchCampaigns();
        callback(campaigns);
      }
    )
    .subscribe();

  return () => {
    supabase!.removeChannel(channel);
  };
};

