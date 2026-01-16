import { useCollaborators } from './hooks/useCollaborators';
import {
  TabSwitcher,
  Toast,
  AnnouncementsTab,
  EnrollmentsTab,
  AnalyticsTab,
  LeaderboardTab,
  DemoControls,
} from './components';

export const Collaborators = () => {
  const {
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
    isDemoExpanded,
    setDemoExpanded,
    enrollSampleCampaign,
    toast,
  } = useCollaborators();

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Collaborators</h1>
          <p className="text-gray-500 mt-1">Earn by promoting merchant campaigns</p>
        </div>
        
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <TabSwitcher
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        {activeTab === 'announcements' && (
          <AnnouncementsTab
            enrollments={enrollments}
            onEnroll={enrollInCampaign}
          />
        )}

        {activeTab === 'enrollments' && (
          <EnrollmentsTab
            enrollments={enrollments}
            onUpload={uploadFile}
            onSubmit={submitForReview}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab enrollments={enrollments} />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardTab
            enrollments={enrollments}
            collaborators={collaborators}
            merchantLeaderboard={merchantLeaderboard}
          />
        )}
      </div>

      {/* Demo Controls */}
      <DemoControls
        enrollments={enrollments}
        onEnrollSample={enrollSampleCampaign}
        onAdvanceEnrollment={advanceEnrollment}
        onAdvanceToApproved={advanceToApproved}
        onRejectEnrollment={rejectEnrollment}
        isExpanded={isDemoExpanded}
        onToggle={() => setDemoExpanded(!isDemoExpanded)}
      />

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default Collaborators;
