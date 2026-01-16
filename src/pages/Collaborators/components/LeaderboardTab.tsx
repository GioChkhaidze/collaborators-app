import { useState, useEffect, useRef, useMemo } from 'react';
import type { Enrollment, CollaboratorProfile, MerchantLeaderboardEntry } from '../types';
import { tierConfig } from '../constants';
import { computeTier, getNextTier, getProgressToNextTier } from '../utils';
import { TierBadge } from './TierBadge';
import { CollaboratorProfileModal } from './CollaboratorProfileModal';

// Featured TikTok videos data
const FEATURED_VIDEOS = [
  {
    id: '7591454592806718728',
    url: 'https://www.tiktok.com/@snoonu/video/7591454592806718728',
    creator: '@snoonu',
    title: 'Official Snoonu Promo',
    views: '125K',
    likes: '8.2K',
    gradient: 'from-snoonu-red to-pink-500',
    badge: 'Official',
  },
  {
    id: '7412444735962434847',
    url: 'https://www.tiktok.com/@thatfoodielyss/video/7412444735962434847',
    creator: '@thatfoodielyss',
    title: 'Food Review Style',
    views: '89K',
    likes: '5.1K',
    gradient: 'from-orange-400 to-red-500',
    badge: 'Top Performer',
  },
  {
    id: '7435616173066112289',
    url: 'https://www.tiktok.com/@eatingwithtod/video/7435616173066112289',
    creator: '@eatingwithtod',
    title: 'Unboxing Experience',
    views: '67K',
    likes: '3.8K',
    gradient: 'from-snoonu-purple to-indigo-500',
    badge: 'Trending',
  },
];

// TikTok Video Card Component with actual embed preview
const TikTokVideoCard = ({ video, index, onPlay }: { 
  video: typeof FEATURED_VIDEOS[0]; 
  index: number;
  onPlay: (video: typeof FEATURED_VIDEOS[0]) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Use TikTok's oEmbed iframe directly (no autoplay, just thumbnail)
  const embedUrl = `https://www.tiktok.com/embed/v2/${video.id}?autoplay=0`;
  
  useEffect(() => {
    const timer = setTimeout(() => setEmbedLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div
      className="group relative flex-shrink-0 w-[200px] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPlay(video)}
      style={{
        animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`,
      }}
    >
      {/* Video Thumbnail Container */}
      <div className={`relative aspect-[9/16] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${isHovered ? 'scale-[1.02] shadow-xl' : ''}`}>
        {/* Gradient Background (fallback) */}
        <div className={`absolute inset-0 bg-gradient-to-br ${video.gradient}`} />
        
        {/* TikTok iframe embed - cropped to show only video */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ pointerEvents: 'none' }}
        >
          <iframe
            ref={iframeRef}
            src={embedUrl}
            className="absolute border-0"
            style={{ 
              top: '-60px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '325px',
              height: '760px',
              opacity: embedLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
            allow="encrypted-media;"
            sandbox="allow-scripts allow-same-origin"
            loading="lazy"
          />
          {/* Mask to hide bottom text portion */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black via-black to-transparent"
            style={{ pointerEvents: 'none' }}
          />
        </div>
        
        {/* Loading state */}
        {!embedLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
        
        {/* Dark Overlay for interaction */}
        <div className={`absolute inset-0 transition-all duration-300 ${isHovered ? 'bg-black/30' : 'bg-transparent'}`} />
        
        {/* TikTok Logo Watermark */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
        </div>
        
        {/* Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wide bg-white/95 text-gray-900 rounded-full shadow-sm">
            {video.badge}
          </span>
        </div>
        
        {/* Bottom Info - Our custom labels */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent z-10">
          <div className="text-white font-semibold text-sm truncate drop-shadow-lg">{video.creator}</div>
          <div className="text-white/90 text-xs truncate drop-shadow-md">{video.title}</div>
        </div>
      </div>
      
      {/* Stats Below Card */}
      <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {video.views}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          {video.likes}
        </span>
      </div>
    </div>
  );
};

// TikTok Embed Modal
const TikTokEmbedModal = ({ video, onClose }: { 
  video: typeof FEATURED_VIDEOS[0] | null;
  onClose: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state when video changes
  useEffect(() => {
    if (video) {
      setIsLoading(true);
    }
  }, [video]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (video) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [video, onClose]);

  if (!video) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md w-full"
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${video.gradient} flex items-center justify-center text-white font-bold`}>
              {video.creator.replace('@', '').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{video.creator}</div>
              <div className="text-xs text-gray-500">{video.title}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* TikTok Embed - Using iframe for reliable loading */}
        <div className="relative overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#f5f5f5' }}>
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 bg-gray-100">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-snoonu-red rounded-full animate-spin" />
              <span className="text-sm text-gray-500">Loading TikTok...</span>
            </div>
          )}
          <iframe
            src={`https://www.tiktok.com/embed/v2/${video.id}?lang=en-US&autoplay=0`}
            style={{ 
              width: '325px',
              height: '580px',
              border: 'none'
            }}
            scrolling="no"
            allow="encrypted-media"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            title={`TikTok video by ${video.creator}`}
          />
        </div>
        
        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {video.views} views
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {video.likes} likes
            </span>
          </div>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
            style={{ color: '#ffffff' }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#ffffff">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
            Open in TikTok
          </a>
        </div>
      </div>
      
      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

interface LeaderboardTabProps {
  enrollments: Enrollment[];
  collaborators: CollaboratorProfile[];
  merchantLeaderboard: MerchantLeaderboardEntry[];
}

type LeaderboardTimeFilter = 'monthly' | 'allTime';

export const LeaderboardTab = ({
  enrollments,
  collaborators,
  merchantLeaderboard,
}: LeaderboardTabProps) => {
  const [selectedCollaborator, setSelectedCollaborator] = useState<CollaboratorProfile | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<typeof FEATURED_VIDEOS[0] | null>(null);
  const [timeFilter, setTimeFilter] = useState<LeaderboardTimeFilter>('monthly');
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Helper function to get image URL with base path
  // In Vite, public folder assets are accessible at BASE_URL + path
  const getImageUrl = (avatar: string) => {
    if (!avatar || !avatar.startsWith('/')) return null;
    const baseUrl = import.meta.env.BASE_URL || '/';
    // BASE_URL already ends with /, so we need to remove leading / from avatar if baseUrl ends with /
    if (baseUrl.endsWith('/') && avatar.startsWith('/')) {
      return baseUrl + avatar.slice(1);
    }
    return baseUrl + avatar;
  };

  // Handle image load errors
  const handleImageError = (avatar: string, e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Failed to load avatar image:', avatar, e);
    setImageErrors(prev => new Set(prev).add(avatar));
  };

  const approvedCount = enrollments.filter(e => e.status === 'approved').length;

  // Calculate time-based XP and sort collaborators
  // In production, this would come from an API with proper time-based filtering
  const filteredCollaborators = useMemo(() => {
    // Helper function to generate deterministic "random" value from string
    const hashString = (str: string): number => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash) % 100 / 100; // Return value between 0 and 1
    };
    
    // Map collaborators with time-based XP and approvals
    const collaboratorsWithTimeXP = collaborators.map(collab => {
      // Parse joinedDate to determine activity period
      const joinedDateStr = collab.joinedDate || '';
      const joinedRecently = joinedDateStr.includes('Dec') || joinedDateStr.includes('Jan');
      
      // Use deterministic hash based on collaborator ID for consistent values
      const hashValue = hashString(collab.id);
      
      if (timeFilter === 'monthly') {
        // For monthly view: calculate XP and approvals earned in the current month
        // Estimate monthly values based on:
        // - If joined this month: use smaller fraction (they're new)
        // - If joined earlier: use higher fraction (active user)
        // - Base it on a percentage of total values, but scale it realistically
        
        let monthlyXP: number;
        let monthlyApprovals: number;
        
        if (joinedRecently) {
          // Joined recently (Dec/Jan) - estimate 20-30% of total XP as monthly
          monthlyXP = Math.floor(collab.totalXP * (0.20 + hashValue * 0.10));
          // Approvals: estimate 25-35% of total approvals as monthly
          monthlyApprovals = Math.floor(collab.approvedCount * (0.25 + hashValue * 0.10));
        } else {
          // Joined earlier - estimate 15-25% of total XP as monthly
          // More established users might have earned more total XP, but monthly is still a fraction
          monthlyXP = Math.floor(collab.totalXP * (0.15 + hashValue * 0.10));
          // Approvals: estimate 20-30% of total approvals as monthly
          monthlyApprovals = Math.floor(collab.approvedCount * (0.20 + hashValue * 0.10));
        }
        
        // Ensure monthly values are at least 1 if user has any approvals
        if (collab.approvedCount > 0) {
          monthlyApprovals = Math.max(monthlyApprovals, 1);
        }
        
        // Ensure monthly XP is at least a minimum based on monthly approvals
        // More active users should have more monthly XP
        const minMonthlyXP = Math.floor(monthlyApprovals * 50); // Base XP per approval
        monthlyXP = Math.max(monthlyXP, minMonthlyXP);
        
        // Don't exceed total values
        monthlyXP = Math.min(monthlyXP, collab.totalXP);
        monthlyApprovals = Math.min(monthlyApprovals, collab.approvedCount);
        
        return {
          ...collab,
          displayXP: monthlyXP,
          displayApprovals: monthlyApprovals,
        };
      } else {
        // All time view: use full totalXP and approvedCount
        return {
          ...collab,
          displayXP: collab.totalXP,
          displayApprovals: collab.approvedCount,
        };
      }
    });
    
    // Sort by display XP (descending order - highest XP first)
    return collaboratorsWithTimeXP.sort((a, b) => b.displayXP - a.displayXP);
  }, [collaborators, timeFilter]);
  const currentTier = computeTier(approvedCount);
  const nextTier = getNextTier(currentTier);
  const progress = getProgressToNextTier(approvedCount);
  const tierInfo = tierConfig[currentTier];

  const hasData = collaborators.length > 0 || merchantLeaderboard.length > 0;

  if (!hasData) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Leaderboards coming soon</h3>
        <p className="text-gray-500 mb-4">Use Demo Mode to seed leaderboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Your Rank Card */}
      <div className={`bg-gradient-to-r ${tierInfo.gradient} rounded-2xl p-6 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium opacity-80">Your Rank</h3>
            <div className="text-2xl font-bold flex items-center gap-2">
              <span>{tierInfo.icon}</span>
              <span>{tierInfo.label}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{approvedCount}</div>
            <div className="text-sm opacity-80">Approvals</div>
          </div>
        </div>

        {nextTier && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress to {tierConfig[nextTier].label}</span>
              <span>{progress.percentage.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Collaborator Leaderboard with Podium */}
      {collaborators.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-snoonu-red/5 to-transparent flex items-center justify-between">
            <div>
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-snoonu-red/10 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🏆</span>
                </span>
                Top Collaborators
              </h4>
              <p className="text-xs text-gray-500 mt-1">Content creators with highest XP</p>
            </div>
            <div className="flex items-center bg-gray-100/80 rounded-xl p-1 shadow-inner">
              <button 
                onClick={() => setTimeFilter('monthly')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  timeFilter === 'monthly' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setTimeFilter('allTime')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  timeFilter === 'allTime' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All Time
              </button>
            </div>
          </div>

          {/* Podium Section */}
          <div className="px-6 py-6 pt-12">
            <div className="relative flex items-end justify-center gap-4" style={{ minHeight: 'calc(260px * 0.95)' }}>
              {/* 2nd Place - Left */}
              {filteredCollaborators[1] && (
                <button
                  onClick={() => setSelectedCollaborator(filteredCollaborators[1])}
                  className="relative flex flex-col items-center group cursor-pointer transition-transform hover:scale-105"
                >
                  {/* XP Badge */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                    {(filteredCollaborators[1] as any).displayXP?.toLocaleString() || filteredCollaborators[1].totalXP.toLocaleString()}
                    <span className="ml-1 opacity-90">XP</span>
                  </div>
                  
                  {/* Avatar Ring */}
                  <div className="relative mb-2 mt-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 p-1 shadow-lg overflow-hidden">
                      {filteredCollaborators[1].avatar && filteredCollaborators[1].avatar.startsWith('/') && !imageErrors.has(filteredCollaborators[1].avatar) ? (
                        <img
                          src={getImageUrl(filteredCollaborators[1].avatar) || filteredCollaborators[1].avatar}
                          alt={filteredCollaborators[1].handle}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => handleImageError(filteredCollaborators[1].avatar, e)}
                          loading="lazy"
                        />
                      ) : (
                        <div className={`w-full h-full rounded-full bg-gradient-to-br ${tierConfig[filteredCollaborators[1].tier].gradient} flex items-center justify-center text-white font-bold text-xl`}>
                          {filteredCollaborators[1].handle.replace('@', '').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-white">
                      2
                    </div>
                  </div>
                  
                  {/* Name & Stats */}
                  <div className="text-center mt-2">
                    <div className="text-gray-900 font-semibold text-sm truncate max-w-[100px]">{filteredCollaborators[1].handle}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{(filteredCollaborators[1] as any).displayApprovals?.toLocaleString() || filteredCollaborators[1].approvedCount} approvals</div>
                  </div>

                  {/* Podium Stand */}
                  <div className="w-28 h-20 bg-gradient-to-t from-gray-400 to-gray-300 rounded-t-xl mt-3 flex items-center justify-center shadow-inner">
                    <span className="text-4xl font-bold text-white/80">2</span>
                  </div>
                </button>
              )}

              {/* 1st Place - Center (Elevated) */}
              {filteredCollaborators[0] && (
                <button
                  onClick={() => setSelectedCollaborator(filteredCollaborators[0])}
                  className="relative flex flex-col items-center group cursor-pointer transition-transform hover:scale-105 z-10"
                >
                  {/* Crown */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-4xl animate-bounce z-20">
                    👑
                  </div>
                  
                  {/* XP Badge */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                    {(filteredCollaborators[0] as any).displayXP?.toLocaleString() || filteredCollaborators[0].totalXP.toLocaleString()}
                    <span className="ml-1 opacity-90">XP</span>
                  </div>
                  
                  {/* Avatar Ring - Larger for 1st */}
                  <div className="relative mb-2 mt-12">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 p-1 shadow-xl ring-4 ring-yellow-400/30 overflow-hidden">
                      {filteredCollaborators[0].avatar && filteredCollaborators[0].avatar.startsWith('/') && !imageErrors.has(filteredCollaborators[0].avatar) ? (
                        <img
                          src={getImageUrl(filteredCollaborators[0].avatar) || filteredCollaborators[0].avatar}
                          alt={filteredCollaborators[0].handle}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => handleImageError(filteredCollaborators[0].avatar, e)}
                          loading="lazy"
                        />
                      ) : (
                        <div className={`w-full h-full rounded-full bg-gradient-to-br ${tierConfig[filteredCollaborators[0].tier].gradient} flex items-center justify-center text-white font-bold text-2xl`}>
                          {filteredCollaborators[0].handle.replace('@', '').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white font-bold shadow-lg border-2 border-white">
                      1
                    </div>
                  </div>
                  
                  {/* Name & Stats */}
                  <div className="text-center mt-2">
                    <div className="text-gray-900 font-bold text-base truncate max-w-[120px]">{filteredCollaborators[0].handle}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{(filteredCollaborators[0] as any).displayApprovals?.toLocaleString() || filteredCollaborators[0].approvedCount} approvals</div>
                  </div>

                  {/* Podium Stand - Tallest */}
                  <div className="w-32 bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t-xl mt-3 flex items-center justify-center shadow-inner relative overflow-hidden" style={{ height: 'calc(8rem * 0.95)' }}>
                    <span className="text-5xl font-bold text-white/80">1</span>
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                  </div>
                </button>
              )}

              {/* 3rd Place - Right */}
              {filteredCollaborators[2] && (
                <button
                  onClick={() => setSelectedCollaborator(filteredCollaborators[2])}
                  className="relative flex flex-col items-center group cursor-pointer transition-transform hover:scale-105"
                >
                  {/* XP Badge */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                    {(filteredCollaborators[2] as any).displayXP?.toLocaleString() || filteredCollaborators[2].totalXP.toLocaleString()}
                    <span className="ml-1 opacity-90">XP</span>
                  </div>
                  
                  {/* Avatar Ring */}
                  <div className="relative mb-2 mt-6">
                    <div className="w-18 h-18 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 p-1 shadow-lg overflow-hidden" style={{ width: '72px', height: '72px' }}>
                      {filteredCollaborators[2].avatar && filteredCollaborators[2].avatar.startsWith('/') && !imageErrors.has(filteredCollaborators[2].avatar) ? (
                        <img
                          src={getImageUrl(filteredCollaborators[2].avatar) || filteredCollaborators[2].avatar}
                          alt={filteredCollaborators[2].handle}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => handleImageError(filteredCollaborators[2].avatar, e)}
                          loading="lazy"
                        />
                      ) : (
                        <div className={`w-full h-full rounded-full bg-gradient-to-br ${tierConfig[filteredCollaborators[2].tier].gradient} flex items-center justify-center text-white font-bold text-lg`}>
                          {filteredCollaborators[2].handle.replace('@', '').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-white">
                      3
                    </div>
                  </div>
                  
                  {/* Name & Stats */}
                  <div className="text-center mt-2">
                    <div className="text-gray-900 font-semibold text-sm truncate max-w-[100px]">{filteredCollaborators[2].handle}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{(filteredCollaborators[2] as any).displayApprovals?.toLocaleString() || filteredCollaborators[2].approvedCount} approvals</div>
                  </div>

                  {/* Podium Stand */}
                  <div className="w-28 h-14 bg-gradient-to-t from-amber-700 to-amber-600 rounded-t-xl mt-3 flex items-center justify-center shadow-inner">
                    <span className="text-3xl font-bold text-white/80">3</span>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Remaining Leaderboard (4-10) - Same style as merchants */}
          {filteredCollaborators.length > 3 && (
            <div className="divide-y divide-gray-50">
              {filteredCollaborators.slice(3, 10).map((collab, i) => (
                <button
                  key={collab.id}
                  onClick={() => setSelectedCollaborator(collab)}
                  className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                    {i + 4}
                  </div>
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${tierConfig[collab.tier].gradient} flex items-center justify-center text-white font-bold shadow-sm overflow-hidden`}>
                    {collab.avatar && collab.avatar.startsWith('/') && !imageErrors.has(collab.avatar) ? (
                      <img
                        src={getImageUrl(collab.avatar) || collab.avatar}
                        alt={collab.handle}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => handleImageError(collab.avatar, e)}
                        loading="lazy"
                      />
                    ) : (
                      <span>{collab.handle.replace('@', '').charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{collab.handle}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <TierBadge tier={collab.tier} size="sm" />
                      <span className="text-gray-300">•</span>
                      <span>{(collab as any).displayApprovals?.toLocaleString() || collab.approvedCount} approvals</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-500">{(collab as any).displayXP?.toLocaleString() || collab.totalXP.toLocaleString()} XP</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Merchant Leaderboard */}
      {merchantLeaderboard.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-snoonu-purple/5 to-transparent">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-snoonu-purple/10 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-snoonu-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
              Top Merchants
            </h4>
            <p className="text-xs text-gray-500 mt-1">Brands with highest collaborator engagement</p>
          </div>
          <div className="divide-y divide-gray-50">
            {merchantLeaderboard.map((merchant, i) => (
              <div key={merchant.merchantId} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white' :
                  i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                  i === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {i + 1}
                </div>
                <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden p-1.5 shadow-sm">
                  {merchant.logo.startsWith('http') ? (
                    <img
                      src={merchant.logo}
                      alt={merchant.merchant}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : (
                    <span className="text-xl">{merchant.logo}</span>
                  )}
                  <span className="text-sm font-bold text-snoonu-purple hidden">{merchant.merchant.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{merchant.merchant}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    {merchant.collabsEnrolled} collaborators enrolled
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-500">{merchant.totalXPAwarded.toLocaleString()} XP</div>
                  {merchant.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-end mt-1">
                      {merchant.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-snoonu-purple/10 text-snoonu-purple rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Videos Section - Light Theme */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-snoonu-red/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-snoonu-purple/5 rounded-full blur-3xl" />
        
        <div className="relative">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🎬</span>
                <h3 className="text-xl font-bold text-gray-900">Featured Videos</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-gradient-to-r from-snoonu-red to-pink-500 text-white rounded-full">
                  Inspiration
                </span>
              </div>
              <p className="text-gray-500 text-sm">Learn from top-performing collaborator content</p>
            </div>
            <a 
              href="https://www.tiktok.com/@snoonu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-sm font-medium rounded-full transition-colors"
              style={{ color: '#ffffff' }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#ffffff">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
              Follow @snoonu
            </a>
          </div>
          
          {/* Video Cards Carousel */}
          <div className="flex gap-5 overflow-x-auto pb-4 -mx-2 px-2 sm:mx-0 sm:px-0 scrollbar-hide">
            {FEATURED_VIDEOS.map((video, index) => (
              <TikTokVideoCard 
                key={video.id} 
                video={video} 
                index={index}
                onPlay={setSelectedVideo}
              />
            ))}
            
            {/* CTA Card */}
            <div 
              className="flex-shrink-0 w-[200px]"
              style={{ animation: `slideInUp 0.5s ease-out ${FEATURED_VIDEOS.length * 0.1}s both` }}
            >
              <a
                href="https://www.tiktok.com/@snoonu"
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-[9/16] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition-all duration-300 group"
              >
                <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-gray-300 transition-all duration-300">
                    <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-semibold text-sm mb-1">Discover More</span>
                  <span className="text-gray-400 text-xs">View all videos on TikTok</span>
                </div>
              </a>
              <div className="h-[44px]" /> {/* Spacer to align with other cards */}
            </div>
          </div>
        </div>
        
        {/* Animation styles */}
        <style>{`
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>

      {/* Collaborator Profile Modal */}
      {selectedCollaborator && (
        <CollaboratorProfileModal
          collaborator={selectedCollaborator}
          onClose={() => setSelectedCollaborator(null)}
        />
      )}
      
      {/* TikTok Video Modal */}
      <TikTokEmbedModal 
        video={selectedVideo} 
        onClose={() => setSelectedVideo(null)} 
      />
    </div>
  );
};
