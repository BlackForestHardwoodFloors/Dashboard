import { FileText, FilePlus, Droplet, Phone, MessageSquare, StickyNote } from 'lucide-react';
import { useState } from 'react';

interface MobileCameraActionsProps {
  onWorkOrder: () => void;
  onChangeOrder: () => void;
  onStainSignOff: () => void;
  onCall: () => void;
  onMessage: () => void;
  onNotes: () => void;
}

interface ActionButtonProps {
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  label: string;
  baseColor: string;
  hoverColor: string;
  activeColor: string;
  onClick: () => void;
}

function ActionButton({ icon: Icon, label, baseColor, hoverColor, activeColor, onClick }: ActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const currentColor = isPressed ? activeColor : isHovered ? hoverColor : baseColor;

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
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      style={{
        background: currentColor,
        border: 'none',
        borderRadius: '16px',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isPressed 
          ? 'scale(0.96)' 
          : isHovered 
          ? 'translateY(-3px) scale(1.02)' 
          : 'scale(1)',
        boxShadow: isPressed 
          ? 'inset 0 6px 16px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.2)'
          : isHovered
          ? '0 16px 32px rgba(0, 0, 0, 0.45), 0 8px 16px rgba(0, 0, 0, 0.35)'
          : '0 8px 16px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '110px',
        width: '100%',
      }}
    >
      {/* Gloss overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, transparent 100%)',
        pointerEvents: 'none',
        opacity: isHovered ? 1.4 : 1,
        transition: 'opacity 0.2s',
      }} />

      {/* Metallic shine on hover */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '150%',
        height: '150%',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.3s',
      }} />

      {/* Icon */}
      <Icon 
        size={36} 
        color="#FFFFFF"
        strokeWidth={2.5}
        style={{
          transition: 'transform 0.1s ease-out',
          transform: isPressed ? 'scale(0.9)' : 'scale(1)',
          filter: 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4))',
          flexShrink: 0,
        }}
      />

      {/* Label */}
      <span style={{
        color: '#FFFFFF',
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: '1.3',
        transition: 'transform 0.1s ease-out',
        transform: isPressed ? 'scale(0.96)' : 'scale(1)',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
        fontSize: 'clamp(13px, 3.2vw, 16px)',
        padding: '0 6px',
      }}>
        {label}
      </span>
    </button>
  );
}

export function MobileCameraActions({
  onWorkOrder,
  onChangeOrder,
  onStainSignOff,
  onCall,
  onMessage,
  onNotes,
}: MobileCameraActionsProps) {
  return (
    <div style={{
      width: '100%',
      maxWidth: '100%',
      padding: '0',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
    }}>
      {/* Row 1 */}
      <ActionButton
        icon={FileText}
        label="Work Order"
        baseColor="#4F6A41"
        hoverColor="#628053"
        activeColor="#435A36"
        onClick={onWorkOrder}
      />

      <ActionButton
        icon={Phone}
        label="Call"
        baseColor="#3B9CAA"
        hoverColor="#4AB8C3"
        activeColor="#318690"
        onClick={onCall}
      />

      {/* Row 2 */}
      <ActionButton
        icon={FilePlus}
        label="Change Order"
        baseColor="#A37C4A"
        hoverColor="#B6955C"
        activeColor="#8D6537"
        onClick={onChangeOrder}
      />

      <ActionButton
        icon={MessageSquare}
        label="Message"
        baseColor="#7A4CC2"
        hoverColor="#8E62D1"
        activeColor="#693FAA"
        onClick={onMessage}
      />

      {/* Row 3 */}
      <ActionButton
        icon={Droplet}
        label="Stain Sign-Off"
        baseColor="#8B2E3E"
        hoverColor="#A23C4F"
        activeColor="#752633"
        onClick={onStainSignOff}
      />

      <ActionButton
        icon={StickyNote}
        label="Notes"
        baseColor="#D4A024"
        hoverColor="#E5B435"
        activeColor="#BF8F1A"
        onClick={onNotes}
      />
    </div>
  );
}