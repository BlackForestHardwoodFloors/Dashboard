import { useState, ReactNode } from 'react';

/**
 * @deprecated Use './components/Button' instead for new code
 * This component is maintained for backward compatibility
 */

type ButtonVariant = 
  | 'dashboard'
  | 'calendar'
  | 'client'
  | 'quotes'
  | 'contracts'
  | 'jobs'
  | 'workOrders'
  | 'timeSheet'
  | 'messages'
  | 'photos'
  | 'items'
  | 'vendors'
  | 'reviews'
  | 'settings';

type ButtonSize = 'small' | 'medium' | 'large' | 'sidebar';

interface PlasticButtonProps {
  variant: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  isActive?: boolean;
}

const colorSets = {
  dashboard: {
    base: '#C9A049',
    highlight: '#EACB76',
    shadow: '#9C7C30',
    hover: '#D9B35A',
    active: '#A38234'
  },
  calendar: {
    base: '#3B9CAA',
    highlight: '#62C6D4',
    shadow: '#2A727D',
    hover: '#4FB6C3',
    active: '#26717A'
  },
  client: {
    base: '#7BAA8E',
    highlight: '#A7D2B8',
    shadow: '#5F846C',
    hover: '#8CC3A6',
    active: '#557A63'
  },
  quotes: {
    base: '#6E8B3D',
    highlight: '#9FBD63',
    shadow: '#4F6830',
    hover: '#82A64F',
    active: '#485E2C'
  },
  contracts: {
    base: '#4F6A41',
    highlight: '#7B9F6C',
    shadow: '#384D2F',
    hover: '#628053',
    active: '#324227'
  },
  jobs: {
    base: '#55624C',
    highlight: '#7B8F73',
    shadow: '#3D4737',
    hover: '#687C61',
    active: '#374133'
  },
  workOrders: {
    base: '#4A7268',
    highlight: '#6FA096',
    shadow: '#35554E',
    hover: '#5C8C7E',
    active: '#2F4B45'
  },
  timeSheet: {
    base: '#D76A6A',
    highlight: '#F1A3A3',
    shadow: '#A84C4C',
    hover: '#E57C7C',
    active: '#9A4545'
  },
  messages: {
    base: '#8A6E8C',
    highlight: '#B69DB8',
    shadow: '#6A536C',
    hover: '#9D80A0',
    active: '#5E4A5F'
  },
  photos: {
    base: '#0F7BFF',
    highlight: '#5BA7FF',
    shadow: '#0A4EB2',
    hover: '#2A8FFF',
    active: '#0A46A5'
  },
  items: {
    base: '#6B6D5E',
    highlight: '#93968A',
    shadow: '#52544A',
    hover: '#838671',
    active: '#565749'
  },
  vendors: {
    base: '#6B6456',
    highlight: '#938B7A',
    shadow: '#534D42',
    hover: '#83795C',
    active: '#565048'
  },
  reviews: {
    base: '#D4A024',
    highlight: '#EFCB5A',
    shadow: '#A8801C',
    hover: '#E2B542',
    active: '#AF861C'
  },
  settings: {
    base: '#78909C',
    highlight: '#A0BCC9',
    shadow: '#5E717C',
    hover: '#8FA8B3',
    active: '#61757F'
  }
};

const sizeConfig = {
  small: {
    height: 36,
    padding: '0 16px',
    fontSize: 13,
    borderRadius: 10,
    iconSize: 16,
    gap: 8
  },
  medium: {
    height: 48,
    padding: '0 24px',
    fontSize: 15,
    borderRadius: 12,
    iconSize: 20,
    gap: 10
  },
  large: {
    height: 56,
    padding: '0 32px',
    fontSize: 17,
    borderRadius: 16,
    iconSize: 24,
    gap: 12
  },
  sidebar: {
    height: 34,
    padding: '0 12px',
    fontSize: 13,
    borderRadius: 8,
    iconSize: 16,
    gap: 10
  }
};

export function PlasticButton({
  variant,
  size = 'medium',
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  icon,
  isActive = false
}: PlasticButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const colors = colorSets[variant];
  const sizeStyle = sizeConfig[size];

  // Determine current state colors
  let currentBase = colors.base;
  let currentHighlight = colors.highlight;
  let currentShadow = colors.shadow;

  if (isPressed && !disabled) {
    currentBase = colors.active;
    currentHighlight = colors.highlight;
    currentShadow = colors.shadow;
  } else if (isHovered && !disabled) {
    currentBase = colors.hover;
    currentHighlight = colors.highlight;
    currentShadow = colors.shadow;
  }

  // Create the plastic gradient effect
  const plasticGradient = isPressed
    ? `linear-gradient(to bottom, 
        ${currentShadow} 0%, 
        ${currentBase} 20%, 
        ${currentBase} 100%)`
    : `linear-gradient(to bottom, 
        ${currentHighlight} 0%, 
        ${currentBase} 30%, 
        ${currentBase} 70%, 
        ${currentShadow} 100%)`;

  // Glossy reflection overlay
  const glossIntensity = isPressed ? 0.15 : (isHovered ? 0.35 : 0.25);
  const glossOverlay = `linear-gradient(to bottom,
    rgba(255, 255, 255, ${glossIntensity}) 0%,
    rgba(255, 255, 255, ${glossIntensity * 0.6}) 25%,
    rgba(255, 255, 255, 0) 50%,
    rgba(0, 0, 0, 0) 100%)`;

  // Box shadows for depth and inner glow
  const outerShadow = isPressed
    ? `0 1px 2px rgba(0, 0, 0, 0.2)`
    : isHovered
    ? `0 6px 16px rgba(0, 0, 0, 0.25), 0 2px 4px rgba(0, 0, 0, 0.15)`
    : `0 4px 12px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.12)`;

  const innerShadow = isPressed
    ? `inset 0 3px 8px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(0, 0, 0, 0.3)`
    : `inset 0 -1px 1px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.3)`;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      disabled={disabled}
      style={{
        position: 'relative',
        height: sizeStyle.height,
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        fontWeight: 600,
        color: 'white',
        border: 'none',
        borderRadius: sizeStyle.borderRadius,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: sizeStyle.gap,
        width: fullWidth ? '100%' : 'auto',
        background: plasticGradient,
        boxShadow: `${outerShadow}, ${innerShadow}`,
        transition: 'all 0.15s ease-out',
        transform: isPressed ? 'translateY(2px) scale(0.98)' : 'translateY(0) scale(1)',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* Glossy overlay layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: glossOverlay,
          borderRadius: sizeStyle.borderRadius,
          pointerEvents: 'none',
          mixBlendMode: 'overlay'
        }}
      />

      {/* Content */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        gap: sizeStyle.gap 
      }}>
        {icon && (
          <div style={{ 
            width: sizeStyle.iconSize, 
            height: sizeStyle.iconSize, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            {icon}
          </div>
        )}
        <span>{children}</span>
      </div>
    </button>
  );
}