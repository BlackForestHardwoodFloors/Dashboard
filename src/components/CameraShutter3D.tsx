import { Camera } from 'lucide-react';
import { useState } from 'react';

interface CameraShutter3DProps {
  onClick: () => void;
  disabled?: boolean;
}

export function CameraShutter3D({ onClick, disabled = false }: CameraShutter3DProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    
    setIsPulsing(true);
    onClick();
    
    setTimeout(() => setIsPulsing(false), 600);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        position: 'relative',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        border: 'none',
        padding: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: 'transparent',
        zIndex: 20,
        flexShrink: 0,
        transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isPressed ? 'scale(0.96)' : 'scale(1)',
      }}
    >
      {/* Pulse ring animation */}
      <div style={{
        position: 'absolute',
        inset: '-12px',
        borderRadius: '50%',
        border: '3px solid #0F7BFF',
        opacity: isPulsing ? 0 : 0,
        transform: isPulsing ? 'scale(1.3)' : 'scale(1)',
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: 'none',
      }} />

      {/* Large soft shadow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        boxShadow: `
          0 32px 64px rgba(0, 0, 0, 0.28),
          0 16px 32px rgba(0, 0, 0, 0.2),
          0 8px 16px rgba(0, 0, 0, 0.15)
        `,
        transition: 'box-shadow 0.2s',
        ...(isHovered && !isPressed ? {
          boxShadow: `
            0 36px 72px rgba(0, 0, 0, 0.32),
            0 18px 36px rgba(0, 0, 0, 0.24),
            0 10px 20px rgba(0, 0, 0, 0.18)
          `,
        } : {}),
      }} />

      {/* Metallic outer ring */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: 'linear-gradient(145deg, #3B3B3D 0%, #1E1E20 100%)',
        boxShadow: isPressed 
          ? 'inset 0 4px 12px rgba(0, 0, 0, 0.5)'
          : 'none',
      }}>
        {/* Chrome-like edge reflection */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          right: '8px',
          height: '40%',
          borderRadius: '50% 50% 0 0',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Bottom rim highlight */}
        <div style={{
          position: 'absolute',
          bottom: '6px',
          left: '20%',
          right: '20%',
          height: '3px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Inner dish - concave */}
      <div style={{
        position: 'absolute',
        inset: '20px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, #141414 0%, #050505 60%)',
        boxShadow: `
          inset 0 8px 16px rgba(0, 0, 0, 0.6),
          inset 0 4px 8px rgba(0, 0, 0, 0.4)
        `,
      }}>
        {/* Center vignette */}
        <div style={{
          position: 'absolute',
          inset: '15%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Camera icon */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Camera 
            size={48} 
            color="#0F7BFF"
            strokeWidth={2}
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(15, 123, 255, 0.3))',
              transition: 'transform 0.15s',
              transform: isPressed ? 'scale(0.85)' : 'scale(1)',
            }}
          />
        </div>
      </div>

      {/* Gloss arc - camera glass effect */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        right: '16px',
        height: '45%',
        borderRadius: '50% 50% 30% 30%',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, transparent 80%)',
        pointerEvents: 'none',
        opacity: isPressed ? 0.22 : isHovered ? 0.18 : 0.14,
        transition: 'opacity 0.2s',
      }} />

      {/* Press depth shadow */}
      {isPressed && (
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          boxShadow: 'inset 0 6px 12px rgba(0, 0, 0, 0.5)',
          pointerEvents: 'none',
        }} />
      )}
    </button>
  );
}
