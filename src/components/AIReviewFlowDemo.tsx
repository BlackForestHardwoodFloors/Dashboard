import React, { useState } from 'react';
import AIReviewFlow from './AIReviewFlow';
import { Star, Sparkles } from 'lucide-react';

export default function AIReviewFlowDemo() {
  const [showReviewFlow, setShowReviewFlow] = useState(false);

  if (showReviewFlow) {
    return (
      <AIReviewFlow 
        mode="customer" 
        onClose={() => setShowReviewFlow(false)} 
      />
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '60px 40px',
        maxWidth: '500px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Icon */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#FEF3C7',
          marginBottom: '24px'
        }}>
          <Sparkles size={40} color="#F59E0B" strokeWidth={2} />
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1F2937',
          marginBottom: '12px'
        }}>
          AI Review Flow
        </h1>

        {/* Description */}
        <p style={{
          fontSize: '16px',
          color: '#6B7280',
          lineHeight: '1.6',
          marginBottom: '32px'
        }}>
          Complete 5-step review system with satisfaction check, tone selection, feature highlights, draft review with photo picker, and submit & share with confetti celebration.
        </p>

        {/* Features */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '32px',
          textAlign: 'left'
        }}>
          {[
            'Step 1: Emoji satisfaction sliders',
            'Step 2: Tone selection with pills',
            'Step 3: Feature selection toggles',
            'Step 4: AI draft review + photo picker',
            'Step 5: Submit with confetti 🎉'
          ].map((feature, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              backgroundColor: '#F9FAFB',
              borderRadius: '12px'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#4A90E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: '700',
                flexShrink: 0
              }}>
                {index + 1}
              </div>
              <span style={{
                fontSize: '14px',
                color: '#374151'
              }}>
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Launch Button */}
        <button
          onClick={() => setShowReviewFlow(true)}
          style={{
            width: '100%',
            padding: '16px 32px',
            backgroundColor: '#4A90E2',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 14px rgba(74, 144, 226, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#357ABD';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(74, 144, 226, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#4A90E2';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(74, 144, 226, 0.4)';
          }}
        >
          Launch AI Review Flow
        </button>

        {/* Note */}
        <p style={{
          fontSize: '12px',
          color: '#9CA3AF',
          marginTop: '20px'
        }}>
          Complete all 5 steps to see the confetti celebration 🎊
        </p>
      </div>
    </div>
  );
}
