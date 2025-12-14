import React, { useState } from 'react';
import { Sparkles, Broom, MessageCircle, Clock, Lightbulb, Home } from 'lucide-react';

interface AIReviewStep3Props {
  onNext: (features: string[]) => void;
  onBack: () => void;
}

const FEATURES = [
  { id: 'craftsmanship', label: 'Craftsmanship', icon: Sparkles },
  { id: 'cleanliness', label: 'Cleanliness & Dust Control', icon: Broom },
  { id: 'communication', label: 'Communication', icon: MessageCircle },
  { id: 'timeliness', label: 'Timeliness', icon: Clock },
  { id: 'problem-solving', label: 'Problem Solving', icon: Lightbulb },
  { id: 'respect', label: 'Respect for Home', icon: Home }
];

export default function AIReviewStep3({ onNext, onBack }: AIReviewStep3Props) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const toggleFeature = (featureId: string) => {
    if (selectedFeatures.includes(featureId)) {
      setSelectedFeatures(selectedFeatures.filter(id => id !== featureId));
    } else {
      // Limit to 4 selections
      if (selectedFeatures.length < 4) {
        setSelectedFeatures([...selectedFeatures, featureId]);
      }
    }
  };

  const canContinue = selectedFeatures.length >= 2 && selectedFeatures.length <= 4;

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
          width: '60%',
          backgroundColor: 'var(--color-review-primary-base)'
        }} />
      </div>

      {/* Card */}
      <div className="card-base bg-white p-10 shadow-lg" style={{ borderRadius: '20px' }}>
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="mb-2" style={{ 
            color: 'var(--color-review-text-primary)'
          }}>
            What stood out most?
          </h2>
          <p style={{ color: 'var(--color-review-text-secondary)' }}>
            Choose a few highlights.
          </p>
        </div>

        {/* Tooltip - Show when approaching limits */}
        {selectedFeatures.length >= 4 && (
          <div className="mb-6 p-3 rounded-lg text-center" style={{
            backgroundColor: 'var(--color-review-bg-soft)',
            color: 'var(--color-review-text-secondary)',
            fontSize: '14px',
            animation: 'fadeIn 200ms ease-out'
          }}>
            Maximum of 4 highlights selected
          </div>
        )}

        {selectedFeatures.length > 0 && selectedFeatures.length < 2 && (
          <div className="mb-6 p-3 rounded-lg text-center" style={{
            backgroundColor: 'var(--color-review-bg-soft)',
            color: 'var(--color-review-text-secondary)',
            fontSize: '14px',
            animation: 'fadeIn 200ms ease-out'
          }}>
            Select at least 2 highlights to continue
          </div>
        )}

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {FEATURES.map((feature) => {
            const isSelected = selectedFeatures.includes(feature.id);
            const Icon = feature.icon;
            
            return (
              <button
                key={feature.id}
                onClick={() => toggleFeature(feature.id)}
                className="feature-pill p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: isSelected 
                    ? 'var(--color-review-secondary-base)' 
                    : 'white',
                  borderColor: isSelected 
                    ? 'var(--color-review-secondary-base)' 
                    : 'var(--color-review-border-light)',
                  color: isSelected 
                    ? 'white' 
                    : 'var(--color-review-text-primary)',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isSelected 
                    ? '0 4px 12px rgba(94, 183, 125, 0.3)' 
                    : '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--color-review-secondary-base)';
                    e.currentTarget.style.backgroundColor = 'var(--color-review-bg-soft)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--color-review-border-light)';
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <Icon size={24} strokeWidth={2} />
                  <span className="font-semibold" style={{ fontSize: '14px' }}>
                    {feature.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <button
          onClick={() => onNext(selectedFeatures)}
          disabled={!canContinue}
          className="primary-btn w-full py-4 px-8 text-white border-none rounded-xl cursor-pointer transition-all duration-180"
          style={{
            backgroundColor: canContinue 
              ? 'var(--color-review-primary-base)' 
              : 'var(--color-review-border-light)',
            boxShadow: canContinue 
              ? '0px 2px 8px rgba(74, 144, 226, 0.3)' 
              : 'none',
            opacity: canContinue ? 1 : 0.5,
            cursor: canContinue ? 'pointer' : 'not-allowed'
          }}
          onMouseEnter={(e) => {
            if (canContinue) {
              e.currentTarget.style.backgroundColor = 'var(--color-review-primary-hover)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (canContinue) {
              e.currentTarget.style.backgroundColor = 'var(--color-review-primary-base)';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          Continue →
        </button>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-full py-3 mt-3 bg-transparent border-none rounded-xl cursor-pointer transition-all duration-150"
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
