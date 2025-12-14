import { useState } from 'react';
import { CameraControlCluster } from './CameraControlCluster';
import { Camera, X } from 'lucide-react';

export function CameraControlClusterDemo() {
  const [timeSubmitted, setTimeSubmitted] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [photoCount, setPhotoCount] = useState(0);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2000);
  };

  const handleCapturePhoto = () => {
    setPhotoCount(prev => prev + 1);
    showNotification(`Photo ${photoCount + 1} captured!`);
    // Simulate camera shutter animation
  };

  const handleWorkOrder = () => {
    showNotification('Opening Work Order...');
  };

  const handleChangeOrder = () => {
    showNotification('Opening Change Order...');
  };

  const handleStainSignOff = () => {
    showNotification('Opening Stain Sign-Off...');
  };

  const handleCall = () => {
    showNotification('Calling client...');
  };

  const handleMessage = () => {
    showNotification('Opening message composer...');
  };

  const handleNotes = () => {
    showNotification('Opening notes...');
  };

  const handleSubmitTime = () => {
    if (!timeSubmitted) {
      setTimeSubmitted(true);
      showNotification('Time submitted successfully!');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A0A',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        backgroundColor: '#1A1A1A',
        borderBottom: '1px solid #2A2A2A',
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          <h1 style={{
            color: '#FFFFFF',
            fontSize: '24px',
            fontWeight: '700',
            margin: '0 0 8px 0',
          }}>
            Camera Control Cluster
          </h1>
          <p style={{
            color: '#A0A0A0',
            fontSize: '14px',
            margin: 0,
          }}>
            Jobsite camera controls for Boardroom 360
          </p>
        </div>
      </div>

      {/* Camera Viewfinder Simulation */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
      }}>
        <div style={{
          maxWidth: '600px',
          width: '100%',
          aspectRatio: '4/3',
          backgroundColor: '#1F1F1F',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px',
          border: '2px solid #2A2A2A',
        }}>
          <Camera size={64} color="#4A4A4A" strokeWidth={1.5} />
          <div style={{
            textAlign: 'center',
          }}>
            <div style={{
              color: '#666666',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '8px',
            }}>
              Camera Viewfinder
            </div>
            <div style={{
              color: '#4A4A4A',
              fontSize: '14px',
            }}>
              Photos captured: {photoCount}
            </div>
          </div>
        </div>
      </div>

      {/* Control Cluster - Fixed at Bottom */}
      <div style={{
        padding: '20px',
        backgroundColor: '#0A0A0A',
        borderTop: '1px solid #1A1A1A',
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          <CameraControlCluster
            onCapturePhoto={handleCapturePhoto}
            onWorkOrder={handleWorkOrder}
            onChangeOrder={handleChangeOrder}
            onStainSignOff={handleStainSignOff}
            onCall={handleCall}
            onMessage={handleMessage}
            onNotes={handleNotes}
            onSubmitTime={handleSubmitTime}
            timeSubmitted={timeSubmitted}
          />
        </div>
      </div>

      {/* Info Panel */}
      <div style={{
        padding: '20px',
        backgroundColor: '#1A1A1A',
        borderTop: '1px solid #2A2A2A',
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          <h2 style={{
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: '700',
            margin: '0 0 12px 0',
          }}>
            Features
          </h2>
          <ul style={{
            color: '#A0A0A0',
            fontSize: '13px',
            lineHeight: '1.6',
            margin: 0,
            paddingLeft: '20px',
          }}>
            <li>Large center shutter button (120px) with concentric ring design</li>
            <li>6 side buttons with contoured edges that curve around shutter</li>
            <li>Left: Work Order, Change Order, Stain Sign-Off</li>
            <li>Right: Call, Message, Notes</li>
            <li>Full-width Submit Time button with red gradient</li>
            <li>Glove-friendly tap targets for jobsite use</li>
            <li>Hover states, press animations, and accent colors</li>
            <li>Dark mode optimized for outdoor visibility</li>
          </ul>

          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#0F7BFF20',
            borderRadius: '8px',
            border: '1px solid #0F7BFF40',
          }}>
            <div style={{
              color: '#0F7BFF',
              fontSize: '12px',
              fontWeight: '700',
              marginBottom: '4px',
            }}>
              💡 TIP
            </div>
            <div style={{
              color: '#A0A0A0',
              fontSize: '12px',
              lineHeight: '1.4',
            }}>
              All buttons provide tactile feedback with hover effects, press animations, and visual state changes for optimal field usability.
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#1F1F1F',
          color: '#FFFFFF',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          border: '1px solid #0F7BFF',
          fontSize: '14px',
          fontWeight: '600',
          zIndex: 1000,
          animation: 'slideDown 0.3s ease-out',
        }}>
          {notification}
        </div>
      )}

      {/* CSS for animation */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes pulse {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}
