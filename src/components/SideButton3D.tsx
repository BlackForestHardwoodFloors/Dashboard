import { LucideIcon } from 'lucide-react';
import { useState } from 'react';

type ButtonSize = 'small' | 'large' | 'underlap';

interface SideButton3DProps {
  icon: LucideIcon;
  label: string;
  accentColor: string;
  onClick: () => void;
  side: 'left' | 'right';
  size: ButtonSize;
}

export function SideButton3D({ 
  icon: Icon, 
  label, 
  accentColor, 
  onClick, 
  side,
  size,
}: SideButton3DProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Size configurations
  const dimensions = {
    small: { width: 100, height: 48 },
    large: { width: 128, height: 65 },
    underlap: { width: 128, height: 65 },
  };

  const { width, height } = dimensions[size];

  // 3D lighting adjustments based on size
  const brightness = size === 'underlap' ? 0.95 : 1;
  const zIndex = size === 'small' ? 10 : size === 'large' ? 8 : 5;
  
  // Shadow intensity based on size
  const shadowBlur = size === 'large' || size === 'underlap' ? 18 : 14;
  const shadowOpacity = size === 'underlap' ? 0.35 : 0.28;

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => {
        setIsPressed(false);
        setIsHovered(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        zIndex,
        background: isPressed
          ? 'linear-gradient(135deg, #1A1A1A 0%, #0F0F0F 100%)'
          : `linear-gradient(135deg, ${size === 'large' || size === 'underlap' ? '#2E2E2E' : '#272727'} 0%, ${size === 'large' || size === 'underlap' ? '#1E1E1E' : '#1F1F1F'} 100%)`,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: '14px',
        boxShadow: isPressed
          ? `inset 0 3px 12px rgba(0, 0, 0, 0.6), inset 0 -1px 3px rgba(255, 255, 255, 0.05)`
          : `
            0 ${shadowBlur}px ${shadowBlur * 1.5}px rgba(0, 0, 0, ${shadowOpacity}),
            0 6px 12px rgba(0, 0, 0, 0.15),
            inset 0 1px 2px rgba(255, 255, 255, ${size === 'large' || size === 'underlap' ? 0.14 : 0.10}),
            inset 0 -1px 1px rgba(0, 0, 0, 0.3)
          `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        transform: isPressed ? 'translateY(2px) scale(0.98)' : 'translateY(0) scale(1)',
        filter: `brightness(${brightness})`,
      }}
    >
      {/* Top-left highlight (key light) */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '40%',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%)',
        borderRadius: '14px 14px 0 0',
        pointerEvents: 'none',
        opacity: isPressed ? 0.5 : 1,
      }} />

      {/* Shutter shadow overlay (for underlap buttons) */}
      {size === 'underlap' && (
        <div style={{
          position: 'absolute',
          top: '0',
          [side === 'left' ? 'right' : 'left']: '0',
          width: '20px',
          height: '100%',
          background: side === 'left'
            ? 'linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.25) 100%)'
            : 'linear-gradient(270deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.25) 100%)',
          borderRadius: side === 'left' ? '0 14px 14px 0' : '14px 0 0 14px',
          pointerEvents: 'none',
        }} />
      )}

      {/* Hover accent glow */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          inset: '-2px',
          borderRadius: '16px',
          background: `linear-gradient(135deg, ${accentColor}40 0%, ${accentColor}20 100%)`,
          pointerEvents: 'none',
          boxShadow: `0 0 20px ${accentColor}60`,
        }} />
      )}

      <Icon 
        size={size === 'small' ? 18 : 22} 
        color={isHovered ? accentColor : '#E5E5E5'}
        strokeWidth={2.5}
        style={{
          transition: 'color 0.2s',
          position: 'relative',
          zIndex: 1,
          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))',
        }}
      />
      <span style={{
        color: isHovered ? accentColor : '#D0D0D0',
        fontSize: size === 'small' ? '11px' : '13px',
        fontWeight: '700',
        letterSpacing: '0.3px',
        transition: 'color 0.2s',
        position: 'relative',
        zIndex: 1,
        textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)',
      }}>
        {label}
      </span>

      {/* Bottom-right rim light */}
      <div style={{
        position: 'absolute',
        bottom: '0',
        right: '0',
        width: '60%',
        height: '30%',
        background: 'linear-gradient(225deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 100%)',
        borderRadius: '0 0 14px 0',
        pointerEvents: 'none',
      }} />
    </button>
  );
}
