import { useState, useMemo, useRef, useEffect } from 'react';
import type { Enrollment } from '../types';
import { EnrollmentCard } from './EnrollmentCard';
import { EnrollmentDetailModal } from './EnrollmentDetailModal';

interface EnrollmentsTabProps {
  enrollments: Enrollment[];
  onUpload: (enrollmentId: string, file: File) => void;
  onSubmit: (enrollmentId: string) => void;
}

// Status priority for sorting: higher number = higher position (top)
const statusPriority: Record<string, number> = {
  approved: 6,        // Top
  'under-review': 5,  // Step 4
  processing: 4,      // Step 3
  uploaded: 3,        // Step 2
  enrolled: 2,        // Step 1
  rejected: 1,        // Bottom
};

// Animation duration in milliseconds
const ANIMATION_DURATION = 700; // 0.7s for smoother transitions

export const EnrollmentsTab = ({ enrollments, onUpload, onSubmit }: EnrollmentsTabProps) => {
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [animatingCardIds, setAnimatingCardIds] = useState<Set<string>>(new Set());
  const prevPositionsRef = useRef<Map<string, number>>(new Map());
  const cardRefsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  // Sort enrollments by status priority (approved at top, rejected at bottom)
  // Then by enrolledAt date (newer first within same status)
  const sortedEnrollments = useMemo(() => {
    return [...enrollments].sort((a, b) => {
      const priorityDiff = statusPriority[b.status] - statusPriority[a.status];
      if (priorityDiff !== 0) return priorityDiff;
      // If same status, sort by enrolledAt (newer first)
      return b.enrolledAt.getTime() - a.enrolledAt.getTime();
    });
  }, [enrollments]);

  // Store previous DOM positions for FLIP animation
  const prevDomPositionsRef = useRef<Map<string, number>>(new Map());

  // Detect position changes and trigger animation AFTER render
  useEffect(() => {
    // Skip animation on initial mount
    if (prevPositionsRef.current.size === 0) {
      sortedEnrollments.forEach((enrollment, index) => {
        prevPositionsRef.current.set(enrollment.id, index);
      });
      // Store initial DOM positions after a brief delay to ensure DOM is ready
      setTimeout(() => {
        sortedEnrollments.forEach((enrollment) => {
          const cardElement = cardRefsRef.current.get(enrollment.id);
          if (cardElement) {
            const rect = cardElement.getBoundingClientRect();
            prevDomPositionsRef.current.set(enrollment.id, rect.top + window.scrollY);
          }
        });
      }, 0);
      return;
    }

    const newPositions = new Map<string, number>();
    sortedEnrollments.forEach((enrollment, index) => {
      newPositions.set(enrollment.id, index);
    });

    // Find all cards that changed position
    const cardsToAnimate = new Map<string, { prevIndex: number; newIndex: number }>();
    let hasPositionChange = false;

    sortedEnrollments.forEach((enrollment) => {
      const prevIndex = prevPositionsRef.current.get(enrollment.id);
      const newIndex = newPositions.get(enrollment.id);
      
      if (prevIndex !== undefined && newIndex !== undefined && prevIndex !== newIndex) {
        cardsToAnimate.set(enrollment.id, { prevIndex, newIndex });
        hasPositionChange = true;
      }
    });

    // Only animate if there are position changes
    if (hasPositionChange && cardsToAnimate.size > 0) {
      const animatingIds = new Set(cardsToAnimate.keys());
      setAnimatingCardIds(animatingIds);
      
      // Use stored positions from PREVIOUS render (before this change)
      // These are the positions cards were at before React re-rendered with new sort

      // Use requestAnimationFrame to ensure DOM has updated with new sort order
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Capture NEW positions from DOM after re-render (LAST in FLIP)
          const newDomPositions = new Map<string, number>();
          cardsToAnimate.forEach((_, cardId) => {
            const cardElement = cardRefsRef.current.get(cardId);
            if (cardElement) {
              const rect = cardElement.getBoundingClientRect();
              newDomPositions.set(cardId, rect.top + window.scrollY);
            }
          });

          // Animate all affected cards using FLIP technique
          cardsToAnimate.forEach((_, cardId) => {
            const cardElement = cardRefsRef.current.get(cardId);
            if (!cardElement) return;

            // Use stored position from previous render (before change)
            const prevTop = prevDomPositionsRef.current.get(cardId);
            const newTop = newDomPositions.get(cardId);

            if (prevTop !== undefined && newTop !== undefined) {
              // Calculate the difference between old and new positions (INVERT in FLIP)
              const deltaY = prevTop - newTop;

              // Set initial position (where it was before) - INVERT
              cardElement.style.transform = `translateY(${deltaY}px)`;
              cardElement.style.opacity = '0.9';
              cardElement.style.transition = 'none';
              cardElement.style.zIndex = cardId === sortedEnrollments[0]?.id ? '10' : '5';
              
              // Force reflow to apply transform
              cardElement.offsetHeight;

              // Animate to final position (0) - PLAY
              requestAnimationFrame(() => {
                cardElement.style.transform = 'translateY(0)';
                cardElement.style.opacity = '1';
                cardElement.style.transition = `transform ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${ANIMATION_DURATION}ms ease-out`;
              });
            }
          });

          // Clear animation state and store final positions after transition completes
          const timeoutId = setTimeout(() => {
            cardsToAnimate.forEach((_, cardId) => {
              const cardElement = cardRefsRef.current.get(cardId);
              if (cardElement) {
                cardElement.style.transition = '';
                cardElement.style.zIndex = '';
                cardElement.style.opacity = '';
                cardElement.style.transform = '';
                
                // Store final position for next animation cycle
                const rect = cardElement.getBoundingClientRect();
                prevDomPositionsRef.current.set(cardId, rect.top + window.scrollY);
              }
            });
            setAnimatingCardIds(new Set());
          }, ANIMATION_DURATION);

          return () => clearTimeout(timeoutId);
        });
      });
    } else {
      // No animation - update stored DOM positions for next animation cycle
      // Use setTimeout to ensure DOM has settled
      setTimeout(() => {
        sortedEnrollments.forEach((enrollment) => {
          const cardElement = cardRefsRef.current.get(enrollment.id);
          if (cardElement) {
            const rect = cardElement.getBoundingClientRect();
            prevDomPositionsRef.current.set(enrollment.id, rect.top + window.scrollY);
          }
        });
      }, 0);
    }

    // Update previous positions AFTER animation is set up
    prevPositionsRef.current = newPositions;
  }, [sortedEnrollments]);

  // Keep selected enrollment in sync with state changes
  const currentEnrollment = selectedEnrollment 
    ? sortedEnrollments.find(e => e.id === selectedEnrollment.id) || null
    : null;

  if (enrollments.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No enrollments yet</h3>
        <p className="text-gray-500 mb-4">Start by enrolling in a campaign from the Announcements tab</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {sortedEnrollments.map((enrollment) => (
          <div
            key={enrollment.id}
            ref={(el) => {
              if (el) {
                cardRefsRef.current.set(enrollment.id, el);
              } else {
                cardRefsRef.current.delete(enrollment.id);
              }
            }}
            className={`${
              animatingCardIds.has(enrollment.id) ? 'relative' : ''
            }`}
          >
            <EnrollmentCard
              enrollment={enrollment}
              onClick={() => setSelectedEnrollment(enrollment)}
            />
          </div>
        ))}
      </div>

      {currentEnrollment && (
        <EnrollmentDetailModal
          enrollment={currentEnrollment}
          onClose={() => setSelectedEnrollment(null)}
          onUpload={(file) => onUpload(currentEnrollment.id, file)}
          onSubmit={() => onSubmit(currentEnrollment.id)}
        />
      )}
    </div>
  );
};
