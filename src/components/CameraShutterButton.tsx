import { Camera } from 'lucide-react';
import { useState } from 'react';

interface CameraShutterButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function CameraShutterButton({ onClick, disabled = false }: CameraShutterButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => {
        setIsPressed(false);
        setIsHovered(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
      style={{
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative',
        flexShrink: 0,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: disabled ? 0.5 : 1,
        // Outer ring
        backgroundColor: '#1A1A1C',
        // Drop shadow - stronger for larger button
        boxShadow: isPressed 
          ? '0 12px 24px rgba(0, 0, 0, 0.5), inset 0 3px 10px rgba(0, 0, 0, 0.7)'
          : isHovered
            ? '0 30px 60px rgba(0, 0, 0, 0.4), 0 0 0 4px rgba(15, 123, 255, 0.6)'
            : '0 30px 50px rgba(0, 0, 0, 0.35)',
        transform: isPressed ? 'scale(0.95)' : isHovered ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      {/* Middle ring */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        bottom: '12px',
        borderRadius: '50%',
        backgroundColor: '#2C2C2E',
        // Deepened concave inner shadow
        boxShadow: 'inset 0 4px 12px rgba(0, 0, 0, 0.5)',
      }}>
        {/* Inner disc */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          bottom: '12px',
          borderRadius: '50%',
          backgroundColor: '#0F0F10',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // Inner glow
          boxShadow: isPressed
            ? 'inset 0 3px 10px rgba(0, 0, 0, 0.9)'
            : 'inset 0 2px 6px rgba(0, 0, 0, 0.6)',
        }}>
          <Camera 
            size={72} 
            color="#FFFFFF" 
            strokeWidth={2}
            style={{
              filter: 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4))',
            }}
          />
        </div>
      </div>

      {/* Top gloss arc - larger highlight */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '20%',
        right: '20%',
        height: '45px',
        borderRadius: '50% 50% 0 0',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Electric blue pulse ring (active state) - thicker */}
      {isPressed && (
        <div style={{
          position: 'absolute',
          top: '-6px',
          left: '-6px',
          right: '-6px',
          bottom: '-6px',
          borderRadius: '50%',
          border: '3px solid #0F7BFF',
          animation: 'pulse 0.5s ease-out',
          pointerEvents: 'none',
        }} />
      )}
    </button>
  );
}