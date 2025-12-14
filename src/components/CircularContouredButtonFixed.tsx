import { LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface CircularContouredButtonFixedProps {
  icon: LucideIcon;
  label: string;
  x: number; // Fixed pixel position
  y: number; // Fixed pixel position
  side: 'left' | 'right';
  baseColor: string;
  hoverColor: string;
  activeColor: string;
  onClick: () => void;
  disabled?: boolean;
}

export function CircularContouredButtonFixed({
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
}: CircularContouredButtonFixedProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const currentColor = isPressed ? activeColor : isHovered ? hoverColor : baseColor;

  // ContourCircle is at x: 280, y: 60, diameter: 260
  // Circle center in global coords: (280 + 130, 60 + 130) = (410, 190)
  const circleCenterX = 410 - x;
  const circleCenterY = 190 - y;
  const circleRadius = 130;

  // Button dimensions - FIXED, NO RESIZING
  const buttonWidth = 250;
  const buttonHeight = 70;

  // Generate SVG clip path with circular arc subtraction
  const clipPathId = `circular-clip-fixed-${side}-${x}-${y}`;
  
  const createClipPath = () => {
    if (side === 'left') {
      // For left buttons, subtract circle from right edge
      const dx = circleCenterX - buttonWidth;
      const distSq = circleRadius * circleRadius - dx * dx;
      
      if (distSq > 0) {
        const dy = Math.sqrt(distSq);
        const y1 = circleCenterY - dy;
        const y2 = circleCenterY + dy;
        
        return `
          <clipPath id="${clipPathId}">
            <path d="
              M 20,0
              L ${buttonWidth},0
              L ${buttonWidth},${Math.max(0, y1)}
              A ${circleRadius} ${circleRadius} 0 0 0 ${buttonWidth},${Math.min(buttonHeight, y2)}
              L ${buttonWidth},${buttonHeight}
              L 20,${buttonHeight}
              A 20 20 0 0 1 0,${buttonHeight - 20}
              L 0,20
              A 20 20 0 0 1 20,0
              Z
            " />
          </clipPath>
        `;
      }
    } else {
      // For right buttons, subtract circle from left edge
      const dx = circleCenterX;
      const distSq = circleRadius * circleRadius - dx * dx;
      
      if (distSq > 0) {
        const dy = Math.sqrt(distSq);
        const y1 = circleCenterY - dy;
        const y2 = circleCenterY + dy;
        
        return `
          <clipPath id="${clipPathId}">
            <path d="
              M 0,0
              L 0,${Math.max(0, y1)}
              A ${circleRadius} ${circleRadius} 0 0 1 0,${Math.min(buttonHeight, y2)}
              L 0,${buttonHeight}
              L ${buttonWidth - 20},${buttonHeight}
              A 20 20 0 0 0 ${buttonWidth},${buttonHeight - 20}
              L ${buttonWidth},20
              A 20 20 0 0 0 ${buttonWidth - 20},0
              L 0,0
              Z
            " />
          </clipPath>
        `;
      }
    }
    
    // Fallback: just rounded corners if no intersection
    return `
      <clipPath id="${clipPathId}">
        <rect x="0" y="0" width="${buttonWidth}" height="${buttonHeight}" rx="20" ry="20" />
      </clipPath>
    `;
  };

  return (
    <>
      {/* SVG definition for clip path */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs dangerouslySetInnerHTML={{ __html: createClipPath() }} />
      </svg>

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
          left: `${x}px`, // FIXED pixels
          top: `${y}px`, // FIXED pixels
          width: '250px', // FIXED - NO SHRINKING
          height: '70px', // FIXED - NO SHRINKING
          minWidth: '250px', // Enforce minimum
          maxWidth: '250px', // Enforce maximum
          minHeight: '70px',
          maxHeight: '70px',
          flexShrink: 0, // Never shrink
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
          clipPath: `url(#${clipPathId})`,
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
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, transparent 100%)',
          pointerEvents: 'none',
          opacity: isHovered ? 1.2 : 1,
          transition: 'opacity 0.2s',
        }} />

        {/* Metallic shine on hover */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '120%',
          height: '120%',
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
                flexShrink: 0,
              }}
            />
            <span style={{
              color: '#FFFFFF',
              fontSize: '15px', // FIXED size
              fontWeight: '700',
              transition: 'transform 0.08s ease-out',
              transform: isPressed ? 'translateX(-2px)' : 'translateX(0)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {label}
            </span>
          </>
        ) : (
          <>
            <span style={{
              color: '#FFFFFF',
              fontSize: '15px', // FIXED size
              fontWeight: '700',
              transition: 'transform 0.08s ease-out',
              transform: isPressed ? 'translateX(2px)' : 'translateX(0)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {label}
            </span>
            <Icon 
              size={24} 
              color="#FFFFFF"
              style={{
                transition: 'transform 0.08s ease-out',
                transform: isPressed ? 'scale(0.9)' : 'scale(1)',
                flexShrink: 0,
              }}
            />
          </>
        )}
      </button>
    </>
  );
}
