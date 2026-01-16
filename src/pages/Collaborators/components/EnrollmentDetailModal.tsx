import { useState, useEffect, useRef } from 'react';
import type { Enrollment } from '../types';
import { statusConfig } from '../constants';
import { CloseIcon, UploadIcon, CopyIcon, CheckIcon } from './Icons';
import { ProcessingSteps } from './ProcessingSteps';

// Default status info in case of undefined status
const defaultStatusInfo = { label: 'Unknown', bg: 'bg-gray-100', text: 'text-gray-700', color: 'text-gray-700', bgColor: 'bg-gray-100' };

interface EnrollmentDetailModalProps {
  enrollment: Enrollment;
  onClose: () => void;
  onUpload: (file: File) => void;
  onSubmit: () => void;
}

export const EnrollmentDetailModal = ({
  enrollment,
  onClose,
  onUpload,
  onSubmit,
}: EnrollmentDetailModalProps) => {
  const [copied, setCopied] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [productImageError, setProductImageError] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    modalRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  const handleCopyLink = async () => {
    if (enrollment.referralUrl) {
      await navigator.clipboard.writeText(enrollment.referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statusInfo = statusConfig[enrollment.status] || defaultStatusInfo;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enrollment-title"
        tabIndex={-1}
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up motion-reduce:animate-none flex flex-col"
      >
        {/* Hero Header with Product Image */}
        <div className="relative h-40 flex-shrink-0">
          {enrollment.campaign.productImage && !productImageError ? (
            <img
              src={enrollment.campaign.productImage}
              alt={enrollment.campaign.productName || enrollment.campaign.merchant}
              className="w-full h-full object-cover"
              onError={() => setProductImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-snoonu-red via-pink-500 to-snoonu-purple flex items-center justify-center">
              <span className="text-6xl opacity-50">📦</span>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <CloseIcon className="w-5 h-5 text-white" />
          </button>
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <div className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${statusInfo.bg} ${statusInfo.text}`}>
              {statusInfo.label}
            </div>
          </div>
          
          {/* Merchant Info */}
          <div className="absolute bottom-4 left-4 flex items-end gap-3">
            <div className="w-14 h-14 bg-white rounded-xl shadow-xl flex items-center justify-center overflow-hidden p-1.5">
              {!logoError && enrollment.campaign.logo.startsWith('http') ? (
                <img
                  src={enrollment.campaign.logo}
                  alt={enrollment.campaign.merchant}
                  className="w-full h-full object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="text-2xl">{logoError ? '🏪' : enrollment.campaign.logo}</span>
              )}
            </div>
            <div className="pb-0.5">
              <h2 id="enrollment-title" className="text-lg font-bold text-white drop-shadow-lg">
                {enrollment.campaign.merchant}
              </h2>
              {enrollment.campaign.productName && (
                <p className="text-sm text-white/80 truncate max-w-[200px]">{enrollment.campaign.productName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          {/* Processing Steps */}
          <div className="bg-gray-50 rounded-xl p-4">
            <ProcessingSteps currentStatus={enrollment.status} />
          </div>

          {/* Requirements Checklist */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 bg-snoonu-red rounded-full flex items-center justify-center text-white text-xs">✓</span>
              Content Guidelines
            </h4>
            <ul className="space-y-2">
              {enrollment.campaign.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  <div className="w-5 h-5 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-gray-400">{i + 1}</span>
                  </div>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Status-specific content */}
          {enrollment.status === 'enrolled' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                  <UploadIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-700 font-medium mb-2">Upload your promotional video</p>
                <p className="text-sm text-gray-500 mb-4">{enrollment.campaign.videoReq}</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{ backgroundColor: '#E31837' }}
                  className="px-8 py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
                >
                  Select Video
                </button>
              </div>
            </div>
          )}

          {enrollment.status === 'uploaded' && enrollment.uploadedFile && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <CheckIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-700">Video uploaded!</p>
                    <p className="text-sm text-green-600">
                      {enrollment.uploadedFile.name} ({(enrollment.uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={onSubmit}
                style={{ backgroundColor: '#E31837' }}
                className="w-full py-4 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all"
              >
                Submit for Review
              </button>
            </div>
          )}

          {(enrollment.status === 'processing' || enrollment.status === 'under-review') && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 text-center">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
                <p className="font-semibold text-blue-700 text-lg">
                  {enrollment.status === 'processing' ? 'Processing your video...' : 'Under review by our team...'}
                </p>
                <p className="text-sm text-blue-600 mt-2">This usually takes 6-7 minutes</p>
              </div>
            </div>
          )}

          {enrollment.status === 'approved' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                  <CheckIcon className="w-8 h-8 text-white animate-check-pop motion-reduce:animate-none" />
                </div>
                <p className="font-bold text-green-700 text-lg">Approved! 🎉</p>
                <p className="text-sm text-green-600">Start sharing your link to earn commissions</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Your Referral Link</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={enrollment.referralUrl || ''}
                    className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 font-mono"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-md ${
                      copied
                        ? 'bg-green-500 text-white shadow-green-200'
                        : 'bg-snoonu-red text-white shadow-red-200 hover:shadow-lg hover:scale-[1.02]'
                    }`}
                    style={!copied ? { backgroundColor: '#E31837' } : undefined}
                  >
                    {copied ? (
                      <>
                        <CheckIcon className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <CopyIcon className="w-4 h-4" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>

              {enrollment.stats && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-gray-900">{enrollment.stats.clicks}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Clicks</div>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-gray-900">{enrollment.stats.orders}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Orders</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{enrollment.stats.earnings}</div>
                    <div className="text-xs text-green-600 uppercase tracking-wide">QAR Earned</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {enrollment.status === 'rejected' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CloseIcon className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-red-700">Content Rejected</p>
                    <p className="text-sm text-red-600 mt-1">
                      {enrollment.rejectionReason || 'Video did not meet the campaign requirements. Please review the guidelines and try again.'}
                    </p>
                  </div>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 bg-snoonu-red text-white rounded-xl font-semibold text-lg hover:bg-red-600 transition-colors shadow-lg"
              >
                Re-upload Video
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
