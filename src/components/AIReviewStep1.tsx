import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface AIReviewStep1Props {
  onNext: (satisfaction: { overall: number; communication: number; craftsmanship: number }) => void;
  onBack?: () => void;  // Optional since it's the first step
}

export default function AIReviewStep1({ onNext, onBack }: AIReviewStep1Props) {
  const [overall, setOverall] = useState(3);
  const [communication, setCommunication] = useState(3);
  const [craftsmanship, setCraftsmanship] = useState(3);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const hasLowRating = overall < 3 || communication < 3 || craftsmanship < 3;

  const handleContinue = () => {
    if (hasLowRating) {
      setShowFeedbackModal(true);
    } else {
      onNext({ overall, communication, craftsmanship });
    }
  };

  const getEmoji = (value: number) => {
    if (value === 1) return '😞';
    if (value === 2) return '😐';
    if (value === 3) return '🙂';
    if (value === 4) return '😊';
    return '😃';
  };

  const SliderRow = ({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string; 
    value: number; 
    onChange: (v: number) => void;
  }) => (
    <div className="slider-emoji mb-8">
      <div className="flex justify-between items-center mb-3">
        <label className="font-semibold" style={{ color: 'var(--color-review-text-primary)' }}>
          {label}
        </label>
        <span style={{ fontSize: '32px' }}>
          {getEmoji(value)}
        </span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min="1"
          max="5"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-lg outline-none appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--color-review-secondary-base) 0%, var(--color-review-secondary-base) ${(value - 1) * 25}%, var(--color-review-border-light) ${(value - 1) * 25}%, var(--color-review-border-light) 100%)`
          }}
        />
        
        <div className="flex justify-between mt-2 select-none" style={{ fontSize: '24px' }}>
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              onClick={() => onChange(num)}
              className="cursor-pointer transition-opacity duration-200"
              style={{ opacity: value === num ? 1 : 0.3 }}
            >
              {getEmoji(num)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

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
          width: '20%',
          backgroundColor: 'var(--color-review-primary-base)'
        }} />
      </div>

      {/* Card */}
      <div className="card-base bg-white p-10 shadow-lg" style={{ borderRadius: '20px' }}>
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="mb-2" style={{ 
            color: 'var(--color-review-text-primary)'
          }}>
            How did everything go?
          </h2>
          <p style={{ color: 'var(--color-review-text-secondary)' }}>
            Your answers help tailor your review.
          </p>
        </div>

        {/* Sliders */}
        <SliderRow label="Overall Experience" value={overall} onChange={setOverall} />
        <SliderRow label="Communication" value={communication} onChange={setCommunication} />
        <SliderRow label="Craftsmanship" value={craftsmanship} onChange={setCraftsmanship} />

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="primary-btn w-full py-4 px-8 text-white border-none rounded-xl cursor-pointer transition-all duration-180 mt-4"
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
          Continue →
        </button>
      </div>

      {/* Low Rating Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 flex items-end justify-center z-[1000]" style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          animation: 'fadeIn 200ms ease-out'
        }}>
          <div className="bg-white max-w-[600px] w-full p-8" style={{
            borderRadius: '20px 20px 0 0',
            animation: 'slideUp 300ms ease-out'
          }}>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle size={32} style={{ color: 'var(--color-review-secondary-base)' }} />
              <h3 style={{ color: 'var(--color-review-text-primary)' }}>
                We'd like to make things right first.
              </h3>
            </div>
            
            <p className="mb-6 leading-relaxed" style={{ color: 'var(--color-review-text-secondary)' }}>
              Thank you for your honest feedback. Before posting a public review, we'd love the chance to address your concerns directly.
            </p>

            <button
              onClick={() => {
                alert('Feedback sent to office');
                setShowFeedbackModal(false);
              }}
              className="secondary-btn w-full py-4 px-8 text-white border-none rounded-xl cursor-pointer transition-all duration-180 mb-3"
              style={{
                backgroundColor: 'var(--color-review-secondary-base)',
                boxShadow: '0px 2px 8px rgba(94, 183, 125, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-review-secondary-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-review-secondary-base)';
              }}
            >
              Send feedback to office
            </button>

            <button
              onClick={() => setShowFeedbackModal(false)}
              className="w-full py-3 px-6 bg-transparent border-none rounded-xl cursor-pointer transition-all duration-150"
              style={{ color: 'var(--color-review-text-secondary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F0F0F0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Continue anyway
            </button>
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
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--color-review-secondary-base);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(94, 183, 125, 0.4);
          transition: transform 150ms ease;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }

        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--color-review-secondary-base);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(94, 183, 125, 0.4);
        }
      `}</style>
    </div>
  );
}