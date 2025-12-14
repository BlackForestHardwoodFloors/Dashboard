import { Clock, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface SubmitTimeButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function SubmitTimeButton({ onClick, disabled = false }: SubmitTimeButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => {
        setIsPressed(false);
        setIsHovered(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
      style={{
        width: '100%',
        height: '76px',
        border: 'none',
        borderRadius: '16px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: disabled
          ? 'linear-gradient(135deg, #4A4A4A 0%, #3A3A3A 100%)'
          : isPressed
            ? 'linear-gradient(135deg, #B91C1C 0%, #991B1B 100%)'
            : isHovered
              ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
              : 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
        boxShadow: isPressed
          ? 'inset 0 4px 12px rgba(0, 0, 0, 0.4)'
          : disabled
            ? '0 4px 12px rgba(0, 0, 0, 0.2)'
            : '0 8px 20px rgba(220, 38, 38, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isPressed ? 'translateY(2px)' : 'translateY(0)',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {disabled ? (
        <CheckCircle size={32} color="#FFFFFF" strokeWidth={2.5} />
      ) : (
        <Clock size={32} color="#FFFFFF" strokeWidth={2.5} />
      )}
      <span style={{
        color: '#FFFFFF',
        fontSize: '20px',
        fontWeight: '700',
        letterSpacing: '0.5px',
      }}>
        {disabled ? 'Time Submitted' : 'Submit Time'}
      </span>
    </button>
  );
}