/**
 * Boardroom 360 Global Tooltip Component
 * 
 * A themed tooltip that can be used sitewide with consistent styling.
 * Features:
 * - Larger text for better readability
 * - Matches dark/light theme
 * - Gold accent styling
 * - Smooth animations
 * - Arrow pointer
 * 
 * Usage:
 * import { Tooltip } from './Tooltip';
 * 
 * <Tooltip content="This is a tooltip">
 *   <button>Hover me</button>
 * </Tooltip>
 */

import { useState, useRef, useEffect, ReactNode } from 'react';

interface TooltipProps {
  content: string | ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  darkMode?: boolean;
}

export function Tooltip({ 
  content, 
  children, 
  position = 'top',
  delay = 300,
  darkMode = true 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Theme colors
  const bgColor = darkMode ? '#1A1A1A' : '#FFFFFF';
  const textColor = darkMode ? '#FFFFFF' : '#1A1A1A';
  const borderColor = darkMode ? '#D4A024' : '#D4A024'; // Gold accent
  const shadowColor = darkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.15)';

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        let x = 0;
        let y = 0;

        switch (position) {
          case 'top':
            x = rect.left + rect.width / 2;
            y = rect.top - 10;
            break;
          case 'bottom':
            x = rect.left + rect.width / 2;
            y = rect.bottom + 10;
            break;
          case 'left':
            x = rect.left - 10;
            y = rect.top + rect.height / 2;
            break;
          case 'right':
            x = rect.right + 10;
            y = rect.top + rect.height / 2;
            break;
        }

        setCoords({ x, y });
        setIsVisible(true);
      }
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Calculate transform based on position
  const getTransform = () => {
    switch (position) {
      case 'top':
        return 'translateX(-50%) translateY(-100%)';
      case 'bottom':
        return 'translateX(-50%)';
      case 'left':
        return 'translateX(-100%) translateY(-50%)';
      case 'right':
        return 'translateY(-50%)';
    }
  };

  // Arrow styles based on position
  const getArrowStyles = (): React.CSSProperties => {
    const arrowSize = 8;
    const baseStyles: React.CSSProperties = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    };

    switch (position) {
      case 'top':
        return {
          ...baseStyles,
          bottom: -arrowSize,
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: `${arrowSize}px ${arrowSize}px 0 ${arrowSize}px`,
          borderColor: `${borderColor} transparent transparent transparent`,
        };
      case 'bottom':
        return {
          ...baseStyles,
          top: -arrowSize,
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: `0 ${arrowSize}px ${arrowSize}px ${arrowSize}px`,
          borderColor: `transparent transparent ${borderColor} transparent`,
        };
      case 'left':
        return {
          ...baseStyles,
          right: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: `${arrowSize}px 0 ${arrowSize}px ${arrowSize}px`,
          borderColor: `transparent transparent transparent ${borderColor}`,
        };
      case 'right':
        return {
          ...baseStyles,
          left: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: `${arrowSize}px ${arrowSize}px ${arrowSize}px 0`,
          borderColor: `transparent ${borderColor} transparent transparent`,
        };
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        style={{ display: 'inline-block' }}
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          style={{
            position: 'fixed',
            left: coords.x,
            top: coords.y,
            transform: getTransform(),
            zIndex: 10000,
            pointerEvents: 'none',
            animation: 'tooltipFadeIn 0.2s ease-out',
          }}
        >
          <style>{`
            @keyframes tooltipFadeIn {
              from {
                opacity: 0;
                transform: ${getTransform()} scale(0.95);
              }
              to {
                opacity: 1;
                transform: ${getTransform()} scale(1);
              }
            }
          `}</style>
          <div
            style={{
              backgroundColor: bgColor,
              color: textColor,
              padding: '10px 16px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: 1.4,
              maxWidth: '280px',
              textAlign: 'center',
              border: `2px solid ${borderColor}`,
              boxShadow: `0 8px 24px ${shadowColor}, 0 4px 8px ${shadowColor}`,
              whiteSpace: 'nowrap',
            }}
          >
            {content}
            <div style={getArrowStyles()} />
          </div>
        </div>
      )}
    </>
  );
}

/**
 * TooltipProvider - Wrap your app with this for global tooltip settings
 * (Optional - individual Tooltip components work without it)
 */
export function TooltipProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default Tooltip;
