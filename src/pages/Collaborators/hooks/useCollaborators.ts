import { useState, useCallback } from 'react';
import type { 
  Tab, 
  Enrollment, 
  Campaign, 
  CollaboratorProfile, 
  MerchantLeaderboardEntry, 
  EnrollmentStatus 
} from '../types';
import { campaigns, mockCollaborators, mockMerchantLeaderboard } from '../constants';
import { nextEnrollmentState, isTerminalState } from '../utils';

interface UseCollaboratorsReturn {
  // Tab state
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  
  // Enrollments
  enrollments: Enrollment[];
  enrollInCampaign: (campaign: Campaign) => void;
  uploadFile: (enrollmentId: string, file: File) => void;
  submitForReview: (enrollmentId: string) => void;
  advanceEnrollment: (enrollmentId: string) => void;
  advanceToApproved: (enrollmentId: string) => void;
  rejectEnrollment: (enrollmentId: string) => void;
  
  // Leaderboard data
  collaborators: CollaboratorProfile[];
  merchantLeaderboard: MerchantLeaderboardEntry[];
  
  // Seed data
  seedData: (data: {
    collaborators: CollaboratorProfile[];
    merchantLeaderboard: MerchantLeaderboardEntry[];
  }) => void;
  
  // Demo controls
  isDemoExpanded: boolean;
  setDemoExpanded: (expanded: boolean) => void;
  enrollSampleCampaign: () => void;
  
  // Toast
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useCollaborators = (): UseCollaboratorsReturn => {
  const [activeTab, setActiveTab] = useState<Tab>('announcements');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [collaborators, setCollaborators] = useState<CollaboratorProfile[]>(mockCollaborators);
  const [merchantLeaderboard, setMerchantLeaderboard] = useState<MerchantLeaderboardEntry[]>(mockMerchantLeaderboard);
  const [isDemoExpanded, setDemoExpanded] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  const enrollInCampaign = useCallback((campaign: Campaign) => {
    const newEnrollment: Enrollment = {
      id: `enrollment-${Date.now()}`,
      campaign,
      status: 'enrolled',
      enrolledAt: new Date(),
      clicks: 0,
      orders: 0,
      earnings: 0,
    };
    setEnrollments(prev => [...prev, newEnrollment]);
    showToast(`Enrolled in ${campaign.merchant}!`);
  }, [showToast]);

  const uploadFile = useCallback((enrollmentId: string, file: File) => {
    setEnrollments(prev => prev.map(e => 
      e.id === enrollmentId 
        ? { ...e, uploadedFile: { name: file.name, size: file.size }, status: 'uploaded' as EnrollmentStatus }
        : e
    ));
    showToast('Video uploaded successfully!');
  }, [showToast]);

  const submitForReview = useCallback((enrollmentId: string) => {
    setEnrollments(prev => prev.map(e => 
      e.id === enrollmentId ? { ...e, status: 'processing' as EnrollmentStatus } : e
    ));
    showToast('Submitted for review!');
    
    // Auto-advance through states every 4 seconds
    // processing -> under-review (4s) -> approved (8s)
    setTimeout(() => {
      setEnrollments(prev => prev.map(e => 
        e.id === enrollmentId && e.status === 'processing' 
          ? { ...e, status: 'under-review' as EnrollmentStatus }
          : e
      ));
    }, 4000);
    
    setTimeout(() => {
      setEnrollments(prev => prev.map(e => {
        if (e.id !== enrollmentId || e.status !== 'under-review') return e;
        const clicks = Math.floor(Math.random() * 400) + 100;
        const orders = Math.floor(Math.random() * 40) + 10;
        const earnings = Math.floor(Math.random() * 150) + 50;
        return {
          ...e,
          status: 'approved' as EnrollmentStatus,
          referralUrl: `https://snoonu.com/ref/${e.campaign.id}?c=${Date.now()}`,
          clicks,
          orders,
          earnings,
          stats: { clicks, orders, earnings },
        };
      }));
    }, 8000);
  }, [showToast]);

  const advanceEnrollment = useCallback((enrollmentId: string) => {
    setEnrollments(prev => prev.map(e => {
      if (e.id !== enrollmentId || isTerminalState(e.status)) return e;
      
      const nextStatus = nextEnrollmentState(e.status);
      if (!nextStatus) return e;
      
      const updated: Enrollment = { ...e, status: nextStatus };
      
      // Add mock data when approved - generate meaningful stats
      if (nextStatus === 'approved') {
        const clicks = Math.floor(Math.random() * 400) + 100;
        const orders = Math.floor(Math.random() * 40) + 10;
        const earnings = Math.floor(Math.random() * 150) + 50;
        updated.referralUrl = `https://snoonu.com/ref/${e.campaign.id}?c=${Date.now()}`;
        updated.clicks = clicks;
        updated.orders = orders;
        updated.earnings = earnings;
        updated.stats = { clicks, orders, earnings };
      }
      
      return updated;
    }));
  }, []);

  const advanceToApproved = useCallback((enrollmentId: string) => {
    setEnrollments(prev => prev.map(e => {
      if (e.id !== enrollmentId) return e;
      const clicks = Math.floor(Math.random() * 500) + 100;
      const orders = Math.floor(Math.random() * 50) + 10;
      const earnings = Math.floor(Math.random() * 200) + 50;
      return {
        ...e,
        status: 'approved' as EnrollmentStatus,
        referralUrl: `https://snoonu.com/ref/${e.campaign.id}?c=${Date.now()}`,
        clicks,
        orders,
        earnings,
        stats: { clicks, orders, earnings },
      };
    }));
    showToast('Enrollment approved!');
  }, [showToast]);

  const rejectEnrollment = useCallback((enrollmentId: string) => {
    setEnrollments(prev => prev.map(e => 
      e.id === enrollmentId 
        ? { ...e, status: 'rejected' as EnrollmentStatus, rejectionReason: 'Video did not meet the campaign guidelines. Please ensure you mention the discount code clearly.' }
        : e
    ));
    showToast('Enrollment rejected', 'error');
  }, [showToast]);

  const seedData = useCallback((data: {
    collaborators: CollaboratorProfile[];
    merchantLeaderboard: MerchantLeaderboardEntry[];
  }) => {
    setCollaborators(data.collaborators);
    setMerchantLeaderboard(data.merchantLeaderboard);
    showToast('Leaderboard data seeded!', 'info');
  }, [showToast]);

  const enrollSampleCampaign = useCallback(() => {
    const unenrolledCampaigns = campaigns.filter(
      c => !enrollments.some(e => e.campaign.id === c.id)
    );
    if (unenrolledCampaigns.length > 0) {
      enrollInCampaign(unenrolledCampaigns[0]);
    } else {
      showToast('All campaigns already enrolled!', 'info');
    }
  }, [campaigns, enrollments, enrollInCampaign, showToast]);

  return {
    activeTab,
    setActiveTab,
    enrollments,
    enrollInCampaign,
    uploadFile,
    submitForReview,
    advanceEnrollment,
    advanceToApproved,
    rejectEnrollment,
    collaborators,
    merchantLeaderboard,
    seedData,
    isDemoExpanded,
    setDemoExpanded,
    enrollSampleCampaign,
    toast,
    showToast,
    hideToast,
  };
};
