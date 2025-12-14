import { useState, useRef } from 'react';
import { Camera, X, ChevronLeft, FlipHorizontal, Zap } from 'lucide-react';
import { DamagePhotoTaggingPanel } from './DamagePhotoTaggingPanel';

interface DamageCameraScreenProps {
  jobName: string;
  onClose: () => void;
  onSavePhoto: (photo: {
    url: string;
    location: string;
    damageType: string;
    notes: string;
    timestamp: Date;
    sharedWithClient: boolean;
  }) => void;
}

export function DamageCameraScreen({ jobName, onClose, onSavePhoto }: DamageCameraScreenProps) {
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = () => {
    // Simulate photo capture - in production this would use actual camera
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  const handleSaveWithTags = (tags: {
    location: string;
    damageType: string;
    notes: string;
    sharedWithClient: boolean;
  }) => {
    if (capturedPhoto) {
      onSavePhoto({
        url: capturedPhoto,
        ...tags,
        timestamp: new Date()
      });
      setCapturedPhoto(null);
    }
  };

  if (capturedPhoto) {
    return (
      <DamagePhotoTaggingPanel
        photoUrl={capturedPhoto}
        onSave={handleSaveWithTags}
        onRetake={handleRetake}
      />
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#000000',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Hidden file input for photo capture simulation */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Header */}
      <div style={{
        padding: '20px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <button
          onClick={onClose}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}
        >
          <X size={24} color="#FFFFFF" />
        </button>

        <div style={{
          backgroundColor: 'rgba(212, 160, 36, 0.9)',
          padding: '8px 16px',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: '700',
            textAlign: 'center'
          }}>
            DAMAGE CAMERA
          </div>
          <div style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '12px',
            textAlign: 'center'
          }}>
            {jobName}
          </div>
        </div>

        <div style={{ width: '44px' }} /> {/* Spacer for centering */}
      </div>

      {/* Camera Viewfinder */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1A1A1A',
        position: 'relative'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#808080',
          fontSize: '16px'
        }}>
          <Camera size={64} color="#404040" />
        </div>

        {/* Grid overlay */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
        >
          <line x1="33.33%" y1="0" x2="33.33%" y2="100%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <line x1="66.66%" y1="0" x2="66.66%" y2="100%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <line x1="0" y1="33.33%" x2="100%" y2="33.33%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <line x1="0" y1="66.66%" x2="100%" y2="66.66%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        </svg>
      </div>

      {/* Bottom Controls */}
      <div style={{
        padding: '24px 20px 40px 20px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Flash Toggle */}
        <button
          onClick={() => setFlashEnabled(!flashEnabled)}
          style={{
            backgroundColor: flashEnabled ? '#D4A024' : 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s'
          }}
        >
          <Zap size={24} color="#FFFFFF" fill={flashEnabled ? '#FFFFFF' : 'none'} />
        </button>

        {/* Capture Button */}
        <button
          onClick={handleCapture}
          style={{
            backgroundColor: '#FFFFFF',
            border: '6px solid #D4A024',
            borderRadius: '50%',
            width: '80px',
            height: '80px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 20px rgba(212, 160, 36, 0.5)'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.9)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />

        {/* Flip Camera */}
        <button
          onClick={() => setFacingMode(facingMode === 'user' ? 'environment' : 'user')}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}
        >
          <FlipHorizontal size={24} color="#FFFFFF" />
        </button>
      </div>

      {/* Instructions */}
      <div style={{
        position: 'absolute',
        top: '100px',
        left: '20px',
        right: '20px',
        backgroundColor: 'rgba(212, 160, 36, 0.95)',
        padding: '16px',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{
          color: '#FFFFFF',
          fontSize: '14px',
          fontWeight: '700',
          marginBottom: '6px'
        }}>
          📸 Document Pre-Existing Damage
        </div>
        <div style={{
          color: 'rgba(255, 255, 255, 0.95)',
          fontSize: '13px',
          lineHeight: '1.5'
        }}>
          Capture clear photos of scratches, gouges, water damage, or any other issues.
          You'll tag each photo after capture.
        </div>
      </div>
    </div>
  );
}
