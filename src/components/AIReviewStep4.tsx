import React, { useState, useEffect } from 'react';
import { RefreshCw, Check, Upload, Sparkles } from 'lucide-react';

interface AIReviewStep4Props {
  onNext: (review: string, photos: string[]) => void;
  onBack: () => void;
  tone?: string;
  features?: string[];
}

// Mock photo data
const SUGGESTED_PHOTOS = [
  'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400',
  'https://images.unsplash.com/photo-1615873968403-89e068629265?w=400',
  'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400',
];

const ALL_JOB_PHOTOS = [
  'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400',
  'https://images.unsplash.com/photo-1615873968403-89e068629265?w=400',
  'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
];

const SHORT_REVIEW = "Amazing work! The team was professional, on time, and the craftsmanship exceeded our expectations. Our new floors look stunning and they left everything spotless. Highly recommend!";

const FULL_REVIEW = "I couldn't be happier with the flooring installation completed by this team. From start to finish, the experience was exceptional. The crew arrived on time each day, communicated clearly about the process, and showed incredible attention to detail in their craftsmanship.\n\nWhat really impressed me was how they respected our home - they used dust barriers, cleaned up thoroughly each evening, and were mindful of our daily routines. The quality of the installation is outstanding, and our new hardwood floors have completely transformed our living space.\n\nI highly recommend this company to anyone looking for professional, high-quality flooring work. They delivered exactly what they promised and more!";

export default function AIReviewStep4({ onNext, onBack, tone, features }: AIReviewStep4Props) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [reviewTab, setReviewTab] = useState<'short' | 'full'>('short');
  const [photoTab, setPhotoTab] = useState<'suggested' | 'all' | 'upload'>('suggested');
  const [reviewText, setReviewText] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  useEffect(() => {
    // Simulate AI generation with typing animation
    setTimeout(() => {
      setIsGenerating(false);
      setReviewText(SHORT_REVIEW);
    }, 800);
  }, []);

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // In real implementation, this would call AI to regenerate
    }, 800);
  };

  const togglePhoto = (photo: string) => {
    if (selectedPhotos.includes(photo)) {
      setSelectedPhotos(selectedPhotos.filter(p => p !== photo));
    } else {
      setSelectedPhotos([...selectedPhotos, photo]);
    }
  };

  const handleTabChange = (tab: 'short' | 'full') => {
    setReviewTab(tab);
    setReviewText(tab === 'short' ? SHORT_REVIEW : FULL_REVIEW);
  };

  const currentPhotos = photoTab === 'suggested' ? SUGGESTED_PHOTOS : ALL_JOB_PHOTOS;

  return (
    <div className="max-w-[900px] mx-auto" style={{ 
      marginTop: '60px',
      animation: 'slideUp 300ms ease-out' 
    }}>
      {/* Progress Bar */}
      <div className="progress-bar mb-6 h-1 rounded overflow-hidden" style={{
        backgroundColor: 'var(--color-review-border-light)'
      }}>
        <div className="h-full transition-all duration-400" style={{
          width: '80%',
          backgroundColor: 'var(--color-review-primary-base)'
        }} />
      </div>

      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="mb-2" style={{ color: 'var(--color-review-text-primary)' }}>
          Your AI-Generated Review
        </h2>
        <p style={{ color: 'var(--color-review-text-secondary)' }}>
          Edit the text or choose photos to include
        </p>
      </div>

      {/* Main Content - Stacked on mobile, side-by-side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT SECTION: Review Text */}
        <div className="card-base bg-white p-6 shadow-lg" style={{ borderRadius: '20px' }}>
          {/* Review Tabs */}
          <div className="flex gap-2 mb-4 p-1 rounded-lg" style={{
            backgroundColor: 'var(--color-review-bg-soft)'
          }}>
            <button
              onClick={() => handleTabChange('short')}
              className="flex-1 py-2 px-4 rounded-lg transition-all duration-200 font-semibold"
              style={{
                backgroundColor: reviewTab === 'short' 
                  ? 'var(--color-review-primary-base)' 
                  : 'transparent',
                color: reviewTab === 'short' 
                  ? 'white' 
                  : 'var(--color-review-text-secondary)',
              }}
            >
              Short Version
            </button>
            <button
              onClick={() => handleTabChange('full')}
              className="flex-1 py-2 px-4 rounded-lg transition-all duration-200 font-semibold"
              style={{
                backgroundColor: reviewTab === 'full' 
                  ? 'var(--color-review-primary-base)' 
                  : 'transparent',
                color: reviewTab === 'full' 
                  ? 'white' 
                  : 'var(--color-review-text-secondary)',
              }}
            >
              Full Version
            </button>
          </div>

          {/* Review Text Box */}
          {isGenerating ? (
            <div className="draft-textbox p-6 rounded-xl flex items-center justify-center" style={{
              backgroundColor: 'var(--color-review-bg-soft)',
              minHeight: '200px'
            }}>
              <div className="flex items-center gap-3" style={{
                color: 'var(--color-review-primary-base)'
              }}>
                <Sparkles className="animate-pulse" size={24} />
                <div className="flex gap-1">
                  <span className="animate-bounce" style={{ animationDelay: '0ms' }}>●</span>
                  <span className="animate-bounce" style={{ animationDelay: '150ms' }}>●</span>
                  <span className="animate-bounce" style={{ animationDelay: '300ms' }}>●</span>
                </div>
                <span className="font-semibold">Generating your review...</span>
              </div>
            </div>
          ) : (
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="draft-textbox w-full p-4 rounded-xl border-2 transition-all duration-200 resize-none"
              style={{
                borderColor: 'var(--color-review-border-light)',
                color: 'var(--color-review-text-primary)',
                minHeight: reviewTab === 'short' ? '150px' : '300px',
                fontFamily: 'inherit',
                fontSize: '14px',
                lineHeight: '1.6'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-review-primary-base)';
                e.currentTarget.style.backgroundColor = 'var(--color-review-bg-soft)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-review-border-light)';
                e.currentTarget.style.backgroundColor = 'white';
              }}
            />
          )}

          {/* Regenerate Button */}
          <button
            onClick={handleRegenerate}
            className="secondary-btn w-full mt-4 py-3 px-6 border-2 rounded-xl cursor-pointer transition-all duration-180 flex items-center justify-center gap-2"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'var(--color-review-secondary-base)',
              color: 'var(--color-review-secondary-base)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-review-secondary-base)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-review-secondary-base)';
            }}
          >
            <RefreshCw size={18} />
            Regenerate
          </button>
        </div>

        {/* RIGHT SECTION: Photo Picker */}
        <div className="card-base bg-white p-6 shadow-lg" style={{ borderRadius: '20px' }}>
          <h3 className="mb-4 font-semibold" style={{ color: 'var(--color-review-text-primary)' }}>
            Select Photos
          </h3>

          {/* Photo Tabs */}
          <div className="photo-picker flex gap-2 mb-4 p-1 rounded-lg overflow-x-auto" style={{
            backgroundColor: 'var(--color-review-bg-soft)'
          }}>
            <button
              onClick={() => setPhotoTab('suggested')}
              className="py-2 px-4 rounded-lg transition-all duration-200 font-semibold whitespace-nowrap"
              style={{
                backgroundColor: photoTab === 'suggested' 
                  ? 'var(--color-review-secondary-base)' 
                  : 'transparent',
                color: photoTab === 'suggested' 
                  ? 'white' 
                  : 'var(--color-review-text-secondary)',
                fontSize: '13px'
              }}
            >
              Suggested
            </button>
            <button
              onClick={() => setPhotoTab('all')}
              className="py-2 px-4 rounded-lg transition-all duration-200 font-semibold whitespace-nowrap"
              style={{
                backgroundColor: photoTab === 'all' 
                  ? 'var(--color-review-secondary-base)' 
                  : 'transparent',
                color: photoTab === 'all' 
                  ? 'white' 
                  : 'var(--color-review-text-secondary)',
                fontSize: '13px'
              }}
            >
              All Photos
            </button>
            <button
              onClick={() => setPhotoTab('upload')}
              className="py-2 px-4 rounded-lg transition-all duration-200 font-semibold whitespace-nowrap flex items-center gap-2"
              style={{
                backgroundColor: photoTab === 'upload' 
                  ? 'var(--color-review-secondary-base)' 
                  : 'transparent',
                color: photoTab === 'upload' 
                  ? 'white' 
                  : 'var(--color-review-text-secondary)',
                fontSize: '13px'
              }}
            >
              <Upload size={14} />
              Upload
            </button>
          </div>

          {/* Photo Grid */}
          {photoTab !== 'upload' ? (
            <div className="grid grid-cols-2 gap-3 overflow-y-auto" style={{ maxHeight: '400px' }}>
              {currentPhotos.map((photo, index) => {
                const isSelected = selectedPhotos.includes(photo);
                return (
                  <button
                    key={index}
                    onClick={() => togglePhoto(photo)}
                    className="relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200"
                    style={{
                      aspectRatio: '1',
                      border: isSelected 
                        ? '3px solid var(--color-review-secondary-base)' 
                        : '2px solid var(--color-review-border-light)',
                      transform: isSelected ? 'scale(0.95)' : 'scale(1)'
                    }}
                  >
                    <img 
                      src={photo} 
                      alt={`Job photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{
                        backgroundColor: 'rgba(94, 183, 125, 0.8)',
                        animation: 'fadeIn 150ms ease-out'
                      }}>
                        <div className="rounded-full p-2" style={{
                          backgroundColor: 'white'
                        }}>
                          <Check size={24} style={{ color: 'var(--color-review-secondary-base)' }} />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200" style={{
              borderColor: 'var(--color-review-border-light)',
              minHeight: '300px',
              backgroundColor: 'var(--color-review-bg-soft)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-review-secondary-base)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-review-border-light)';
            }}
            >
              <div className="text-center p-6">
                <Upload size={48} className="mx-auto mb-3" style={{ color: 'var(--color-review-text-secondary)' }} />
                <p className="font-semibold mb-1" style={{ color: 'var(--color-review-text-primary)' }}>
                  Upload your own photos
                </p>
                <p style={{ color: 'var(--color-review-text-secondary)', fontSize: '13px' }}>
                  Click to browse or drag and drop
                </p>
              </div>
            </div>
          )}

          {selectedPhotos.length > 0 && (
            <p className="mt-3 text-center" style={{ 
              color: 'var(--color-review-secondary-base)',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              {selectedPhotos.length} photo{selectedPhotos.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={() => onNext(reviewText, selectedPhotos)}
          className="primary-btn w-full py-4 px-8 text-white border-none rounded-xl cursor-pointer transition-all duration-180"
          style={{
            backgroundColor: 'var(--color-review-primary-base)',
            boxShadow: '0px 2px 8px rgba(74, 144, 226, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-review-primary-hover)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-review-primary-base)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Use This Review →
        </button>

        <button
          onClick={onBack}
          className="w-full py-3 bg-transparent border-none rounded-xl cursor-pointer transition-all duration-150"
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
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
