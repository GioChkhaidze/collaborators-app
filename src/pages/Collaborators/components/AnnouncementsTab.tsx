import { useState, useEffect } from 'react';
import type { Campaign, Enrollment } from '../types';
import { campaigns } from '../constants';
import { fetchCampaigns, testSupabaseConnection } from '../../../lib/supabaseQueries';
import { CampaignCard } from './CampaignCard';
import { CampaignDetailModal } from './CampaignDetailModal';

interface AnnouncementsTabProps {
  enrollments: Enrollment[];
  onEnroll: (campaign: Campaign) => void;
}

export const AnnouncementsTab = ({ enrollments, onEnroll }: AnnouncementsTabProps) => {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaignsList, setCampaignsList] = useState<Campaign[]>(campaigns);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCampaigns = async () => {
      console.log('[AnnouncementsTab] Component mounted - loading campaigns...');
      setIsLoading(true);
      
      try {
        // Test connection first
        const isConnected = await testSupabaseConnection();
        console.log('[AnnouncementsTab] Supabase connection test:', isConnected ? 'PASSED' : 'FAILED');
        
        // Fetch campaigns - ONLY from Supabase, no mock data fallback
        const supabaseCampaigns = await fetchCampaigns();
        console.log('[AnnouncementsTab] Fetched campaigns:', supabaseCampaigns.length);
        
        if (supabaseCampaigns.length > 0) {
          console.log('[AnnouncementsTab] ✅ Using Supabase campaigns');
          setCampaignsList(supabaseCampaigns);
        } else {
          console.warn('[AnnouncementsTab] ⚠️ No campaigns found in database');
          setCampaignsList([]); // Empty array instead of mock data
        }
      } catch (error) {
        console.error('[AnnouncementsTab] ❌ Failed to load campaigns from Supabase:', error);
        setCampaignsList([]); // Empty array instead of mock data
      } finally {
        setIsLoading(false);
      }
    };

    // Load campaigns on mount and when the component is recreated (page refresh)
    loadCampaigns();
  }, []); // Empty dependency array - runs on every mount/refresh

  const isEnrolled = (campaignId: string) => 
    enrollments.some(e => e.campaign.id === campaignId);

  const handleEnroll = () => {
    if (selectedCampaign) {
      onEnroll(selectedCampaign);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading campaigns from database...</div>
      </div>
    );
  }

  if (campaignsList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="text-gray-500 text-lg">No campaigns found</div>
        <div className="text-sm text-gray-400">
          Please check:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Supabase API Settings → Exposed Schemas → "Snoonu Collaborators" is enabled</li>
            <li>Database permissions are set correctly</li>
            <li>The announcments table exists in the "Snoonu Collaborators" schema</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {campaignsList.map(campaign => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            isEnrolled={isEnrolled(campaign.id)}
            onClick={() => setSelectedCampaign(campaign)}
          />
        ))}
      </div>

      {selectedCampaign && (
        <CampaignDetailModal
          campaign={selectedCampaign}
          isEnrolled={isEnrolled(selectedCampaign.id)}
          onClose={() => setSelectedCampaign(null)}
          onEnroll={handleEnroll}
        />
      )}
    </div>
  );
};
