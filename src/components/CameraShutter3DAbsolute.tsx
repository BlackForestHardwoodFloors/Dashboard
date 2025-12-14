import { Camera } from 'lucide-react';
import { useState } from 'react';

interface CameraShutter3DAbsoluteProps {
  onClick: () => void;
  disabled?: boolean;
}

export function CameraShutter3DAbsolute({ onClick, disabled = false }: CameraShutter3DAbsoluteProps) {
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
        position: 'absolute',
        left: '39.02%', // 320/820
        top: '26.32%', // 100/380
        width: '21.95%', // 180/820
        aspectRatio: '1 / 1',
        borderRadius: '50%',
        border: 'none',
        padding: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: 'transparent',
        zIndex: 20,
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
          0 32px 64px rgba(0, 0, 0, 0.3),
          0 16px 32px rgba(0, 0, 0, 0.22),
          0 8px 16px rgba(0, 0, 0, 0.15)
        `,
        transition: 'box-shadow 0.2s',
        ...(isHovered && !isPressed ? {
          boxShadow: `
            0 36px 72px rgba(0, 0, 0, 0.35),
            0 18px 36px rgba(0, 0, 0, 0.26),
            0 10px 20px rgba(0, 0, 0, 0.18)
          `,
        } : {}),
      }} />

      {/* Metallic outer ring - Dark steel gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: 'linear-gradient(145deg, #2A2A2D 0%, #0E0E0F 100%)',
        boxShadow: isPressed 
          ? 'inset 0 4px 12px rgba(0, 0, 0, 0.5)'
          : 'none',
      }}>
        {/* Chrome highlight arc - 10% white */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          right: '8px',
          height: '40%',
          borderRadius: '50% 50% 0 0',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.10) 0%, transparent 100%)',
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

      {/* Inner concave dish - Radial gradient */}
      <div style={{
        position: 'absolute',
        inset: '20px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, #181818 0%, #050505 60%)',
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

        {/* Camera icon - Manually placed 5px upward */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: '5px', // Manual upward placement
        }}>
          <Camera 
            size={48} 
            color="#FFFFFF"
            strokeWidth={2}
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(255, 255, 255, 0.2))',
              transition: 'transform 0.08s ease-out',
              transform: isPressed ? 'scale(0.85)' : 'scale(1)',
              width: 'clamp(32px, 5.85vw, 48px)',
              height: 'clamp(32px, 5.85vw, 48px)',
            }}
          />
        </div>
      </div>

      {/* Gloss streak - Curved highlight across upper-left quadrant */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        right: '16px',
        height: '45%',
        borderRadius: '50% 50% 30% 30%',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, transparent 80%)',
        pointerEvents: 'none',
        opacity: isPressed ? 0.24 : isHovered ? 0.20 : 0.16,
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