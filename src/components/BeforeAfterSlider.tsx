import React, { useState, useRef } from 'react';
import { MoveHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'BEFORE',
  afterLabel = 'AFTER'
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    // Clamp between 0 and 100
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    setSliderPosition(clampedPercentage);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: '12px',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none'
      }}
    >
      {/* After Image (Background) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${afterImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        {/* After Label */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          padding: '6px 12px',
          backgroundColor: '#4CAF50',
          borderRadius: '6px',
          color: '#FFFFFF',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '0.5px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          {afterLabel}
        </div>
      </div>

      {/* Before Image (Clipped) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        backgroundImage: `url(${beforeImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: isDragging ? 'none' : 'clip-path 0.1s'
      }}>
        {/* Before Label */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          padding: '6px 12px',
          backgroundColor: '#F4B400',
          borderRadius: '6px',
          color: '#FFFFFF',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '0.5px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          {beforeLabel}
        </div>
      </div>

      {/* Slider Control */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${sliderPosition}%`,
          width: '4px',
          backgroundColor: '#FFFFFF',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          transition: isDragging ? 'none' : 'left 0.1s'
        }}
      />

      {/* Slider Handle */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        style={{
          position: 'absolute',
          top: '50%',
          left: `${sliderPosition}%`,
          width: '48px',
          height: '48px',
          backgroundColor: '#FFFFFF',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          cursor: isDragging ? 'grabbing' : 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          transition: isDragging ? 'none' : 'left 0.1s, transform 0.15s',
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          if (!isDragging) {
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isDragging) {
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
          }
        }}
      >
        <MoveHorizontal size={24} color="#0F7BFF" />
      </div>

      {/* Left Arrow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: `${sliderPosition}%`,
          width: '0',
          height: '0',
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderRight: '10px solid #FFFFFF',
          transform: 'translate(calc(-50% - 30px), -50%)',
          pointerEvents: 'none',
          transition: isDragging ? 'none' : 'left 0.1s'
        }}
      />

      {/* Right Arrow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: `${sliderPosition}%`,
          width: '0',
          height: '0',
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderLeft: '10px solid #FFFFFF',
          transform: 'translate(calc(-50% + 30px), -50%)',
          pointerEvents: 'none',
          transition: isDragging ? 'none' : 'left 0.1s'
        }}
      />
    </div>
  );
}
