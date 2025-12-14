import React, { useState } from 'react';
import AIReviewStep1 from './AIReviewStep1';
import AIReviewStep2 from './AIReviewStep2';
import AIReviewStep3 from './AIReviewStep3';
import AIReviewStep4 from './AIReviewStep4';
import AIReviewStep5 from './AIReviewStep5';

export type AIReviewStep = 
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'step5';

interface AIReviewFlowProps {
  mode?: 'customer' | 'admin';
  onClose?: () => void;
}

export interface ReviewData {
  satisfaction?: {
    overall: number;
    communication: number;
    craftsmanship: number;
  };
  selectedTone?: string;
  selectedFeatures?: string[];
  selectedDraft?: string;
  editedReview?: string;
  selectedPhotos?: string[];
}

export default function AIReviewFlow({ mode = 'customer', onClose }: AIReviewFlowProps) {
  const [currentStep, setCurrentStep] = useState<AIReviewStep>('step1');
  const [reviewData, setReviewData] = useState<ReviewData>({});

  const handleNext = (step: AIReviewStep, data?: Partial<ReviewData>) => {
    if (data) {
      setReviewData({ ...reviewData, ...data });
    }
    setCurrentStep(step);
  };

  const handleBack = () => {
    const stepOrder: AIReviewStep[] = ['step1', 'step2', 'step3', 'step4', 'step5'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F6F6F6',
      padding: '24px'
    }}>
      {/* Step 1: Satisfaction Check with Emoji Sliders */}
      {currentStep === 'step1' && (
        <AIReviewStep1 
          onNext={(satisfaction) => handleNext('step2', { satisfaction })}
          onBack={handleBack}
        />
      )}
      
      {/* Step 2: Tone Selection */}
      {currentStep === 'step2' && (
        <AIReviewStep2 
          onNext={(tone) => handleNext('step3', { selectedTone: tone })}
          onBack={handleBack}
        />
      )}
      
      {/* Step 3: Feature Selection */}
      {currentStep === 'step3' && (
        <AIReviewStep3
          onNext={(features) => handleNext('step4', { selectedFeatures: features })}
          onBack={handleBack}
        />
      )}
      
      {/* Step 4: Draft Review + Photo Picker */}
      {currentStep === 'step4' && (
        <AIReviewStep4
          tone={reviewData.selectedTone || 'Warm & Friendly'}
          features={reviewData.selectedFeatures || []}
          onNext={(review, photos) => handleNext('step5', { editedReview: review, selectedPhotos: photos })}
          onBack={handleBack}
        />
      )}
      
      {/* Step 5: Submit with Success Modal */}
      {currentStep === 'step5' && (
        <AIReviewStep5
          review={reviewData.editedReview || ''}
          photos={reviewData.selectedPhotos || []}
          onClose={onClose}
          onBack={handleBack}
        />
      )}
    </div>
  );
}