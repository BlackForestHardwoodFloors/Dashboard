import React, { useState } from 'react';
import { Smile, Briefcase, Zap, BookOpen, Star } from 'lucide-react';

interface AIReviewStep2Props {
  onNext: (tone: string) => void;
  onBack: () => void;
}

interface ToneOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  example: string;
}

export default function AIReviewStep2({ onNext, onBack }: AIReviewStep2Props) {
  const [selectedTone, setSelectedTone] = useState<string>('');

  const tones: ToneOption[] = [
    {
      id: 'friendly',
      name: 'Friendly',
      icon: <Smile size={24} />,
      example: '"The team made us feel right at home during the whole process!"'
    },
    {
      id: 'professional',
      name: 'Professional',
      icon: <Briefcase size={24} />,
      example: '"Excellent service with attention to detail and timely completion."'
    },
    {
      id: 'short',
      name: 'Short & Simple',
      icon: <Zap size={24} />,
      example: '"Great work, highly recommend!"'
    },
    {
      id: 'detailed',
      name: 'Story / Detailed',
      icon: <BookOpen size={24} />,
      example: '"From our first meeting to final walkthrough, every step was handled with care..."'
    },
    {
      id: 'enthusiastic',
      name: 'Enthusiastic / High-End',
      icon: <Star size={24} />,
      example: '"Absolutely exceptional craftsmanship! This exceeded all our expectations!"'
    }
  ];

  const handleToneSelect = (toneId: string) => {
    setSelectedTone(toneId);
  };

  const handleContinue = () => {
    if (selectedTone) {
      onNext(selectedTone);
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
          width: '40%',
          backgroundColor: 'var(--color-review-primary-base)'
        }} />
      </div>

      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="mb-2" style={{ color: 'var(--color-review-text-primary)' }}>
          Choose your tone
        </h2>
        <p style={{ color: 'var(--color-review-text-secondary)' }}>
          How would you like your review to sound?
        </p>
      </div>

      {/* Tone Cards */}
      <div className="space-y-4 mb-6">
        {tones.map((tone) => (
          <div
            key={tone.id}
            onClick={() => handleToneSelect(tone.id)}
            className="tone-card bg-white p-5 rounded-2xl cursor-pointer transition-all duration-200"
            style={{
              border: selectedTone === tone.id 
                ? `3px solid var(--color-review-secondary-base)` 
                : '3px solid transparent',
              boxShadow: selectedTone === tone.id
                ? '0px 4px 14px rgba(94, 183, 125, 0.2)'
                : '0px 2px 8px rgba(0,0,0,0.08)',
              transform: selectedTone === tone.id ? 'translateY(-4px)' : 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              if (selectedTone !== tone.id) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0px 4px 12px rgba(0,0,0,0.12)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedTone !== tone.id) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0px 2px 8px rgba(0,0,0,0.08)';
              }
            }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{
                backgroundColor: selectedTone === tone.id 
                  ? 'var(--color-review-secondary-base)' 
                  : 'var(--color-review-bg-soft)',
                color: selectedTone === tone.id ? '#FFFFFF' : 'var(--color-review-text-primary)',
                transition: 'all 200ms ease'
              }}>
                {tone.icon}
              </div>
              
              <div className="flex-1">
                <h3 className="mb-2" style={{ 
                  color: 'var(--color-review-text-primary)',
                  fontWeight: '600'
                }}>
                  {tone.name}
                </h3>
                <p style={{ 
                  color: 'var(--color-review-text-secondary)',
                  fontSize: '14px',
                  fontStyle: 'italic',
                  lineHeight: '1.5'
                }}>
                  {tone.example}
                </p>
              </div>

              {/* Radio Indicator */}
              <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center" style={{
                borderColor: selectedTone === tone.id 
                  ? 'var(--color-review-secondary-base)' 
                  : 'var(--color-review-border-light)',
                transition: 'all 200ms ease'
              }}>
                {selectedTone === tone.id && (
                  <div className="w-3 h-3 rounded-full" style={{
                    backgroundColor: 'var(--color-review-secondary-base)'
                  }} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={!selectedTone}
        className="primary-btn w-full py-4 px-8 text-white border-none rounded-xl cursor-pointer transition-all duration-180"
        style={{
          backgroundColor: selectedTone 
            ? 'var(--color-review-primary-base)' 
            : 'var(--color-review-border-light)',
          boxShadow: selectedTone 
            ? '0px 2px 8px rgba(74, 144, 226, 0.3)' 
            : 'none',
          opacity: selectedTone ? 1 : 0.5,
          cursor: selectedTone ? 'pointer' : 'not-allowed'
        }}
        onMouseEnter={(e) => {
          if (selectedTone) {
            e.currentTarget.style.backgroundColor = 'var(--color-review-primary-hover)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (selectedTone) {
            e.currentTarget.style.backgroundColor = 'var(--color-review-primary-base)';
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        Continue →
      </button>

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
      `}</style>
    </div>
  );
}
