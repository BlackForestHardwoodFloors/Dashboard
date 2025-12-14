import React, { useState, useEffect } from 'react';
import { Globe, Save, Copy, CheckCircle2, X } from 'lucide-react';

interface AIReviewStep5Props {
  onClose?: () => void;
  onBack: () => void;
  review: string;
  photos: string[];
}

export default function AIReviewStep5({ onClose, onBack, review, photos }: AIReviewStep5Props) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  // Confetti animation effect
  useEffect(() => {
    if (showSuccessModal) {
      const cleanup = triggerConfetti();
      return cleanup;
    }
  }, [showSuccessModal]);

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const colors = ['#4A90E2', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 3;
      
      // Create confetti particles
      for (let i = 0; i < particleCount; i++) {
        try {
          const confetti = document.createElement('div');
          confetti.className = 'confetti-particle';
          confetti.style.left = Math.random() * 100 + '%';
          confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          confetti.style.animationDelay = Math.random() * 0.3 + 's';
          confetti.style.animationDuration = randomInRange(2, 4) + 's';
          
          if (document.body) {
            document.body.appendChild(confetti);

            setTimeout(() => {
              if (confetti && confetti.parentNode) {
                confetti.remove();
              }
            }, 4000);
          }
        } catch (err) {
          console.error('Confetti error:', err);
        }
      }
    }, 50);

    // Return cleanup function
    return () => clearInterval(interval);
  };

  const handlePostToGoogle = () => {
    // Simulate posting to Google
    setShowSuccessModal(true);
  };

  const handleSaveDraft = () => {
    // Simulate saving draft
    alert('Review saved as draft!');
    if (onClose) onClose();
  };

  const handleCopyReview = async () => {
    try {
      // Check if Clipboard API is available
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        // Fallback for browsers that don't support Clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = review;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          textArea.remove();
          setCopiedToClipboard(true);
          setTimeout(() => setCopiedToClipboard(false), 2000);
        } catch (err) {
          textArea.remove();
          alert('Failed to copy review - clipboard not supported');
        }
        return;
      }
      
      await navigator.clipboard.writeText(review);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (err) {
      console.error('Copy error:', err);
      alert('Failed to copy review');
    }
  };

  return (
    <div className="max-w-[600px] mx-auto" style={{ 
      marginTop: '60px',
      animation: 'slideUp 300ms ease-out' 
    }}>
      {/* Progress Bar */}
      <div className="progress-bar mb-6 h-1 rounded overflow-hidden" style={{
        backgroundColor: 'var(--color-review-border-light)'
      }}>
        <div className="h-full transition-all duration-400" style={{
          width: '100%',
          backgroundColor: 'var(--color-review-success)'
        }} />
      </div>

      {/* Card */}
      <div className="card-base bg-white p-10 shadow-lg" style={{ borderRadius: '20px' }}>
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="mb-2" style={{ 
            color: 'var(--color-review-text-primary)'
          }}>
            Last step — Post your review
          </h2>
          <p style={{ color: 'var(--color-review-text-secondary)' }}>
            Share your experience with others
          </p>
        </div>

        {/* Preview Section - Shows review summary */}
        <div className="mb-8 p-4 rounded-xl" style={{
          backgroundColor: 'var(--color-review-bg-soft)',
          borderLeft: '4px solid var(--color-review-primary-base)'
        }}>
          <p className="line-clamp-3" style={{ 
            color: 'var(--color-review-text-primary)',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            {review}
          </p>
          {photos.length > 0 && (
            <p className="mt-2" style={{ 
              color: 'var(--color-review-text-secondary)',
              fontSize: '13px'
            }}>
              + {photos.length} photo{photos.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Buttons will be added in next phases */}
        <div className="space-y-4">
          {/* Primary Button - Post to Google */}
          <button
            onClick={handlePostToGoogle}
            className="primary-btn w-full py-5 px-8 text-white border-none rounded-xl cursor-pointer transition-all duration-180 flex items-center justify-center gap-3"
            style={{
              backgroundColor: 'var(--color-review-primary-base)',
              boxShadow: '0px 4px 14px rgba(74, 144, 226, 0.4)',
              fontSize: '18px',
              fontWeight: '700'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-review-primary-hover)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0px 6px 20px rgba(74, 144, 226, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-review-primary-base)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0px 4px 14px rgba(74, 144, 226, 0.4)';
            }}
          >
            <Globe size={24} strokeWidth={2.5} />
            Post to Google
          </button>

          {/* Secondary Buttons - Save Draft & Copy Review */}
          <div className="grid grid-cols-2 gap-3">
            {/* Save as Draft Button */}
            <button
              onClick={handleSaveDraft}
              className="secondary-btn py-4 px-5 bg-white rounded-xl cursor-pointer transition-all duration-150 flex items-center justify-center gap-2"
              style={{
                border: '2px solid var(--color-review-border-medium)',
                color: 'var(--color-review-text-primary)',
                fontSize: '15px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-review-primary-base)';
                e.currentTarget.style.backgroundColor = 'var(--color-review-bg-soft)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-review-border-medium)';
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Save size={20} strokeWidth={2} />
              Save Draft
            </button>

            {/* Copy Review Button */}
            <button
              onClick={handleCopyReview}
              className="secondary-btn py-4 px-5 bg-white rounded-xl cursor-pointer transition-all duration-150 flex items-center justify-center gap-2"
              style={{
                border: '2px solid var(--color-review-border-medium)',
                color: copiedToClipboard ? 'var(--color-review-success)' : 'var(--color-review-text-primary)',
                fontSize: '15px'
              }}
              onMouseEnter={(e) => {
                if (!copiedToClipboard) {
                  e.currentTarget.style.borderColor = 'var(--color-review-primary-base)';
                  e.currentTarget.style.backgroundColor = 'var(--color-review-bg-soft)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!copiedToClipboard) {
                  e.currentTarget.style.borderColor = 'var(--color-review-border-medium)';
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <Copy size={20} strokeWidth={2} />
              {copiedToClipboard ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-full py-3 mt-6 bg-transparent border-none rounded-xl cursor-pointer transition-all duration-150"
          style={{ color: 'var(--color-review-text-secondary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-review-bg-soft)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          ← Back
        </button>
      </div>

      {/* Success Modal placeholder - Phase 5.4 */}
      {showSuccessModal && (
        <div 
          className="success-modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            animation: 'fadeIn 250ms ease-out'
          }}
          onClick={() => setShowSuccessModal(false)}
        >
          <div 
            className="success-modal-card"
            style={{
              backgroundColor: 'white',
              padding: '50px 60px',
              borderRadius: '24px',
              textAlign: 'center',
              maxWidth: '500px',
              boxShadow: '0px 20px 60px rgba(0,0,0,0.3)',
              animation: 'modalBounce 500ms ease-out',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Icon with Pulse */}
            <div style={{
              display: 'inline-flex',
              padding: '20px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              marginBottom: '24px',
              animation: 'iconPulse 1s ease-in-out infinite'
            }}>
              <CheckCircle2 
                size={64} 
                strokeWidth={2.5} 
                style={{ color: 'var(--color-review-success)' }}
              />
            </div>

            {/* Success Message */}
            <h2 style={{ 
              color: 'var(--color-review-text-primary)',
              marginBottom: '12px'
            }}>
              Review Posted Successfully!
            </h2>
            <p style={{ 
              color: 'var(--color-review-text-secondary)',
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '32px'
            }}>
              Your review has been posted to Google and will help others make informed decisions.
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  if (onClose) onClose();
                }}
                className="py-3 px-6 text-white border-none rounded-xl cursor-pointer transition-all duration-150"
                style={{
                  backgroundColor: 'var(--color-review-primary-base)',
                  fontSize: '15px',
                  fontWeight: '600'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-review-primary-hover)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-review-primary-base)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Done
              </button>
              
              <button
                onClick={() => setShowSuccessModal(false)}
                className="py-3 px-6 bg-white rounded-xl cursor-pointer transition-all duration-150 flex items-center gap-2"
                style={{
                  border: '2px solid var(--color-review-border-medium)',
                  color: 'var(--color-review-text-primary)',
                  fontSize: '15px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-review-primary-base)';
                  e.currentTarget.style.backgroundColor = 'var(--color-review-bg-soft)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-review-border-medium)';
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <X size={18} strokeWidth={2} />
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .confetti-particle {
          position: fixed;
          top: 100%;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          animation: confettiFall 3s ease-in-out;
        }

        @keyframes confettiFall {
          0% {
            top: 100%;
            transform: translateY(0);
          }
          100% {
            top: 0;
            transform: translateY(-100vh);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modalBounce {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          60% {
            transform: scale(1.05) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes iconPulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}