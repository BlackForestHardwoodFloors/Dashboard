import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'danger' | 'primary' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'danger',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const colorStyles = {
    danger: {
      bg: '#E74C3C',
      hover: '#C0392B',
      shadow: '#A93226',
      iconBg: 'rgba(231, 76, 60, 0.15)',
      iconColor: '#E74C3C'
    },
    primary: {
      bg: '#C9A049',
      hover: '#B8923F',
      shadow: '#A88438',
      iconBg: 'rgba(201, 160, 73, 0.15)',
      iconColor: '#C9A049'
    },
    warning: {
      bg: '#F39C12',
      hover: '#E67E22',
      shadow: '#D35400',
      iconBg: 'rgba(243, 156, 18, 0.15)',
      iconColor: '#F39C12'
    }
  };

  const colors = colorStyles[confirmColor];

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={onCancel}
    >
      <div 
        style={{
          backgroundColor: '#1E1E1E',
          borderRadius: '16px',
          padding: '0',
          width: '100%',
          maxWidth: '400px',
          border: '1px solid #3D3D3D',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          animation: 'slideUp 0.2s ease'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid #3D3D3D'
        }}>
          <h3 style={{
            margin: 0,
            color: '#FFFFFF',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            {title}
          </h3>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#3D3D3D'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={20} color="#A0A0A0" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: colors.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <AlertTriangle size={24} color={colors.iconColor} />
            </div>
            <p style={{
              margin: 0,
              color: '#E0E0E0',
              fontSize: '15px',
              lineHeight: '1.6'
            }}>
              {message}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          padding: '16px 24px',
          borderTop: '1px solid #3D3D3D',
          backgroundColor: '#242424',
          borderRadius: '0 0 16px 16px'
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              border: '1px solid #3D3D3D',
              borderRadius: '10px',
              color: '#A0A0A0',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = '#3D3D3D';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#A0A0A0';
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '12px 24px',
              backgroundColor: colors.bg,
              border: 'none',
              borderRadius: '10px',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: `0 3px 0 0 ${colors.shadow}`,
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = colors.hover}
            onMouseOut={e => e.currentTarget.style.backgroundColor = colors.bg}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ConfirmModal;
