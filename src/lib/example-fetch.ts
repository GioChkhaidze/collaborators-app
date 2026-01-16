/**
 * Simple example: Fetching data from Supabase
 * 
 * This demonstrates how to fetch all rows from the "announcments" table
 * in the "Snoonu Collaborators" schema
 */

import { supabase } from './supabase';

// Example 1: Fetch all rows from announcments table
export async function fetchAllAnnouncements() {
  try {
    const { data, error } = await supabase!
      .schema('Snoonu Collaborators')
      .from('announcments')
      .select('*');

    if (error) {
      console.error('Error fetching announcements:', error);
      return null;
    }

    console.log('Fetched announcements:', data);
    return data;
  } catch (error) {
    console.error('Exception while fetching:', error);
    return null;
  }
}

// Example 2: Fetch with ordering
export async function fetchAnnouncementsOrdered() {
  try {
    const { data, error } = await supabase!
      .schema('Snoonu Collaborators')
      .from('announcments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception:', error);
    return null;
  }
}

// Example 3: Fetch specific columns only
export async function fetchAnnouncementsBasic() {
  try {
    const { data, error } = await supabase!
      .schema('Snoonu Collaborators')
      .from('announcments')
      .select('id, merchant, discount, reward');

    if (error) {
      console.error('Error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception:', error);
    return null;
  }
}

// Example 4: Fetch with filtering
export async function fetchAnnouncementsByMerchant(merchantName: string) {
  try {
    const { data, error } = await supabase!
      .schema('Snoonu Collaborators')
      .from('announcments')
      .select('*')
      .eq('merchant', merchantName);

    if (error) {
      console.error('Error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception:', error);
    return null;
  }
}

// Example 5: Fetch single row by ID
export async function fetchAnnouncementById(id: string) {
  try {
    const { data, error } = await supabase!
      .schema('Snoonu Collaborators')
      .from('announcments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception:', error);
    return null;
  }
}

