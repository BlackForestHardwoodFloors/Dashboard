import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface PhotoGalleryScreenProps {
  photos: Array<{ url: string; employeeInitials: string }>;
  clientName: string;
  onClose: () => void;
  initialPhotoIndex?: number;
}

export function PhotoGalleryScreen({ 
  photos, 
  clientName, 
  onClose,
  initialPhotoIndex = 0 
}: PhotoGalleryScreenProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(initialPhotoIndex);

  const goToPrevious = () => {
    setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const goToNext = () => {
    setCurrentPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000000',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: '#1F1F1F',
        borderBottom: '1px solid #2A2A2A',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{
            color: '#FFFFFF',
            fontSize: '18px',
            fontWeight: '700',
            margin: '0 0 4px 0'
          }}>
            {clientName}
          </h2>
          <div style={{
            color: '#A0A0A0',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            {currentPhotoIndex + 1} of {photos.length} photos
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: '#252525',
            border: '1px solid #3A3A3A',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Photo Display */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '20px'
      }}>
        {/* Current Photo */}
        <div style={{
          maxWidth: '100%',
          maxHeight: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <img
            src={photos[currentPhotoIndex].url}
            alt={`Photo ${currentPhotoIndex + 1}`}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: '8px'
            }}
          />

          {/* Employee Initials Badge */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            padding: '8px 12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(15, 123, 255, 0.9)',
            border: '2px solid rgba(255,255,255,0.3)',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: '700'
          }}>
            {photos[currentPhotoIndex].employeeInitials}
          </div>
        </div>

        {/* Navigation Arrows */}
        {photos.length > 1 && (
          <>
            {/* Left Arrow */}
            <button
              onClick={goToPrevious}
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(37, 37, 37, 0.9)',
                border: '2px solid #3A3A3A',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                backdropFilter: 'blur(10px)'
              }}
            >
              <ChevronLeft size={28} />
            </button>

            {/* Right Arrow */}
            <button
              onClick={goToNext}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(37, 37, 37, 0.9)',
                border: '2px solid #3A3A3A',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                backdropFilter: 'blur(10px)'
              }}
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: '#1F1F1F',
        borderTop: '1px solid #2A2A2A',
        overflowX: 'auto',
        display: 'flex',
        gap: '12px',
        justifyContent: 'center'
      }}>
        {photos.map((photo, index) => (
          <button
            key={index}
            onClick={() => setCurrentPhotoIndex(index)}
            style={{
              minWidth: '80px',
              height: '80px',
              borderRadius: '8px',
              overflow: 'hidden',
              border: currentPhotoIndex === index 
                ? '3px solid #0F7BFF' 
                : '2px solid #2A2A2A',
              cursor: 'pointer',
              padding: 0,
              backgroundColor: 'transparent',
              flexShrink: 0,
              opacity: currentPhotoIndex === index ? 1 : 0.6,
              transition: 'all 0.2s'
            }}
          >
            <img
              src={photo.url}
              alt={`Thumbnail ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
