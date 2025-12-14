import { Camera, X, AlertCircle } from 'lucide-react';

interface DamageReminderPopupProps {
  onTakePhotos: () => void;
  onSkip: () => void;
  onClose: () => void;
  isSecondReminder?: boolean;
}

export function DamageReminderPopup({ 
  onTakePhotos, 
  onSkip, 
  onClose,
  isSecondReminder = false 
}: DamageReminderPopupProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#1F1F1F',
        borderRadius: '20px',
        maxWidth: '440px',
        width: '100%',
        overflow: 'hidden',
        border: '2px solid #D4A024',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 24px 20px 24px',
          borderBottom: '1px solid #2A2A2A',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#A0A0A0',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#A0A0A0'}
          >
            <X size={24} />
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: isSecondReminder ? '#DC2626' : '#D4A024',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isSecondReminder ? (
                <AlertCircle size={28} color="#FFFFFF" />
              ) : (
                <Camera size={28} color="#FFFFFF" />
              )}
            </div>
            
            <h2 style={{
              color: '#FFFFFF',
              fontSize: '22px',
              fontWeight: '700',
              margin: 0
            }}>
              Document Existing Damage
            </h2>
          </div>

          <p style={{
            color: '#C0C0C0',
            fontSize: '15px',
            lineHeight: '1.6',
            margin: 0
          }}>
            {isSecondReminder 
              ? "Reminder: It's important to document any pre-existing damage before starting work to protect yourself and the company."
              : "Take a few quick photos of any damage before beginning work."
            }
          </p>
        </div>

        {/* Content */}
        <div style={{
          padding: '24px'
        }}>
          <div style={{
            backgroundColor: '#252525',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #2A2A2A',
            marginBottom: '20px'
          }}>
            <h4 style={{
              color: '#D4A024',
              fontSize: '14px',
              fontWeight: '700',
              margin: '0 0 12px 0'
            }}>
              What to Document:
            </h4>
            <ul style={{
              color: '#E0E0E0',
              fontSize: '14px',
              lineHeight: '1.8',
              margin: 0,
              paddingLeft: '20px'
            }}>
              <li>Scratches, gouges, or dents</li>
              <li>Water damage or stains</li>
              <li>Pet damage</li>
              <li>Subfloor issues</li>
              <li>Wall or trim damage</li>
            </ul>
          </div>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <button
              onClick={onTakePhotos}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#D4A024',
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(212, 160, 36, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#C69020';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#D4A024';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Camera size={20} />
              Take Damage Photos
            </button>

            <button
              onClick={onSkip}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: 'transparent',
                border: '2px solid #3A3A3A',
                borderRadius: '12px',
                color: '#A0A0A0',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#505050';
                e.currentTarget.style.color = '#C0C0C0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#3A3A3A';
                e.currentTarget.style.color = '#A0A0A0';
              }}
            >
              Skip for Now
            </button>
          </div>

          {!isSecondReminder && (
            <p style={{
              color: '#808080',
              fontSize: '13px',
              textAlign: 'center',
              margin: '12px 0 0 0'
            }}>
              You'll be reminded again in 10 minutes
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
