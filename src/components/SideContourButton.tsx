import { LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface SideContourButtonProps {
  icon: LucideIcon;
  label: string;
  accentColor: string;
  onClick: () => void;
  side: 'left' | 'right';
}

export function SideContourButton({ 
  icon: Icon, 
  label, 
  accentColor, 
  onClick, 
  side 
}: SideContourButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
        width: '120px',
        height: '60px',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        backgroundColor: isPressed ? '#1F1F21' : isHovered ? '#353537' : '#2B2B2D',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: '14px',
        boxShadow: isPressed
          ? 'inset 0 2px 8px rgba(0, 0, 0, 0.5)'
          : isHovered
            ? `0 6px 16px rgba(0, 0, 0, 0.35), 0 0 0 2px ${accentColor}50`
            : '0 4px 10px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transform: isPressed ? 'scale(0.95)' : 'scale(1)',
      }}
    >
      <Icon 
        size={22} 
        color={isHovered ? accentColor : '#FFFFFF'}
        strokeWidth={2.5}
        style={{
          transition: 'color 0.2s',
        }}
      />
      <span style={{
        color: isHovered ? accentColor : '#CCCCCC',
        fontSize: '13px',
        fontWeight: '700',
        letterSpacing: '0.3px',
        transition: 'color 0.2s',
      }}>
        {label}
      </span>

      {/* Accent indicator on left or right edge */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          [side === 'left' ? 'left' : 'right']: '0',
          top: '12px',
          bottom: '12px',
          width: '3px',
          backgroundColor: accentColor,
          borderRadius: side === 'left' ? '0 4px 4px 0' : '4px 0 0 4px',
        }} />
      )}
    </button>
  );
}