import { LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface ContouredActionButtonProps {
  icon: LucideIcon;
  label: string;
  x: number;
  y: number;
  side: 'left' | 'right';
  baseColor: string;
  hoverColor: string;
  activeColor: string;
  onClick: () => void;
  disabled?: boolean;
}

export function ContouredActionButton({
  icon: Icon,
  label,
  x,
  y,
  side,
  baseColor,
  hoverColor,
  activeColor,
  onClick,
  disabled = false,
}: ContouredActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const currentColor = isPressed ? activeColor : isHovered ? hoverColor : baseColor;

  // Create contoured edge using clip-path
  const clipPath = side === 'left'
    ? 'polygon(0 0, calc(100% - 34px) 0, 100% 50%, calc(100% - 34px) 100%, 0 100%, 0 0)'
    : 'polygon(34px 0, 100% 0, 100% 100%, 34px 100%, 0 50%, 34px 0)';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: '250px',
        height: '70px',
        borderRadius: '20px',
        border: 'none',
        background: currentColor,
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: side === 'left' ? 'flex-start' : 'flex-end',
        gap: '12px',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isPressed 
          ? 'scale(0.97)' 
          : isHovered 
          ? 'translateY(-2px)' 
          : 'translateY(0)',
        boxShadow: isPressed 
          ? 'inset 0 3px 8px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)'
          : isHovered
          ? '0 8px 16px rgba(0, 0, 0, 0.35), 0 4px 8px rgba(0, 0, 0, 0.25)'
          : '0 4px 8px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)',
        filter: disabled ? 'saturate(0.5) brightness(0.7)' : 'none',
        opacity: disabled ? 0.6 : 1,
        clipPath: clipPath,
        zIndex: 6,
        outline: isFocused ? '3px solid rgba(255, 255, 255, 0.12)' : 'none',
        outlineOffset: '2px',
      }}
    >
      {/* Gloss overlay strip */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        borderRadius: '20px 20px 0 0',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, transparent 100%)',
        pointerEvents: 'none',
        opacity: isHovered ? 1.2 : 1,
        transition: 'opacity 0.2s',
        clipPath: clipPath,
      }} />

      {/* Metallic shine on hover */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '120%',
        height: '120%',
        borderRadius: '20px',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.3s',
      }} />

      {/* Content */}
      {side === 'left' ? (
        <>
          <Icon 
            size={24} 
            color="#FFFFFF" 
            style={{
              transition: 'transform 0.08s ease-out',
              transform: isPressed ? 'scale(0.9)' : 'scale(1)',
            }}
          />
          <span style={{
            color: '#FFFFFF',
            fontSize: '15px',
            fontWeight: '700',
            transition: 'transform 0.08s ease-out',
            transform: isPressed ? 'translateX(-2px)' : 'translateX(0)',
          }}>
            {label}
          </span>
        </>
      ) : (
        <>
          <span style={{
            color: '#FFFFFF',
            fontSize: '15px',
            fontWeight: '700',
            transition: 'transform 0.08s ease-out',
            transform: isPressed ? 'translateX(2px)' : 'translateX(0)',
          }}>
            {label}
          </span>
          <Icon 
            size={24} 
            color="#FFFFFF"
            style={{
              transition: 'transform 0.08s ease-out',
              transform: isPressed ? 'scale(0.9)' : 'scale(1)',
            }}
          />
        </>
      )}
    </button>
  );
}
