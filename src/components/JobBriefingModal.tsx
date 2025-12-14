import { X, Lightbulb, MapPin, Calendar, User, Layers } from 'lucide-react';

interface JobBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  address: string;
  jobType: string;
  sqft: number;
  startDate: string;
  completionDate: string;
  briefing: string;
}

export function JobBriefingModal({
  isOpen,
  onClose,
  clientName,
  address,
  jobType,
  sqft,
  startDate,
  completionDate,
  briefing
}: JobBriefingModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-end',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxHeight: '90vh',
          backgroundColor: '#1A1A1A',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        <style>{`
          @keyframes slideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
        `}</style>

        {/* Header */}
        <div style={{
          padding: '20px',
          backgroundColor: '#2A74FF',
          borderBottom: '2px solid #4A8AFF',
          position: 'relative',
          boxShadow: '0 4px 12px rgba(42, 116, 255, 0.3)',
        }}>
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            <X size={24} />
          </button>

          {/* Title */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
            paddingRight: '50px',
          }}>
            <Lightbulb size={28} color="#FFFFFF" strokeWidth={2.5} fill="#FFD700" style={{
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
            }} />
            <h2 style={{
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: '700',
              margin: 0,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}>
              Job Briefing
            </h2>
          </div>

          {/* Subtitle */}
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '14px',
            fontWeight: '600',
            margin: 0,
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
          }}>
            Transcribed notes from original bid
          </p>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 20px',
        }}>
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            {/* Job Info Card */}
            <div style={{
              backgroundColor: '#252525',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px',
              border: '1px solid #333333',
            }}>
              {/* Client Name */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '16px',
              }}>
                <User size={20} color="#4F6A41" />
                <div>
                  <div style={{
                    color: '#888888',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '4px',
                  }}>
                    Client
                  </div>
                  <div style={{
                    color: '#FFFFFF',
                    fontSize: '18px',
                    fontWeight: '700',
                  }}>
                    {clientName}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                marginBottom: '16px',
              }}>
                <MapPin size={20} color="#4285F4" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{
                    color: '#888888',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '4px',
                  }}>
                    Location
                  </div>
                  <div style={{
                    color: '#4285F4',
                    fontSize: '14px',
                    fontWeight: '600',
                    lineHeight: '1.4',
                  }}>
                    {address}
                  </div>
                </div>
              </div>

              {/* Job Type & Size */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                marginBottom: '16px',
              }}>
                <Layers size={20} color="#D4A024" />
                <div>
                  <div style={{
                    color: '#888888',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '4px',
                  }}>
                    Scope
                  </div>
                  <div style={{
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}>
                    {jobType} {sqft > 0 ? `• ${sqft.toLocaleString()} sq ft` : ''}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}>
                <Calendar size={20} color="#4F6A41" />
                <div>
                  <div style={{
                    color: '#888888',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '4px',
                  }}>
                    Timeline
                  </div>
                  <div style={{
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}>
                    {startDate} → {completionDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Briefing Notes Section */}
            <div style={{
              backgroundColor: '#252525',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #333333',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: '2px solid #2A74FF',
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#FF3B30',
                  borderRadius: '50%',
                  boxShadow: '0 0 8px rgba(255, 59, 48, 0.6)',
                }} />
                <h3 style={{
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '700',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Important Notes
                </h3>
              </div>

              {/* Parse and display briefing notes */}
              <div style={{
                color: '#E0E0E0',
                fontSize: '15px',
                lineHeight: '1.7',
                fontWeight: '500',
              }}>
                {briefing.split('. ').map((sentence, index) => {
                  if (!sentence.trim()) return null;
                  
                  // Add period back if it was removed by split
                  const displaySentence = sentence.endsWith('.') ? sentence : sentence + '.';
                  
                  return (
                    <div
                      key={index}
                      style={{
                        marginBottom: '16px',
                        paddingLeft: '16px',
                        borderLeft: '3px solid #2A74FF',
                        paddingTop: '8px',
                        paddingBottom: '8px',
                      }}
                    >
                      {displaySentence}
                    </div>
                  );
                })}
              </div>

              {/* Important Reminder */}
              <div style={{
                marginTop: '24px',
                padding: '16px',
                backgroundColor: 'rgba(42, 116, 255, 0.1)',
                border: '1px solid rgba(42, 116, 255, 0.3)',
                borderRadius: '12px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <Lightbulb size={18} color="#2A74FF" fill="#2A74FF" />
                  <span style={{
                    color: '#2A74FF',
                    fontSize: '13px',
                    fontWeight: '700',
                  }}>
                    Review these notes before starting work
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Action Button */}
        <div style={{
          padding: '20px',
          backgroundColor: '#1F1F1F',
          borderTop: '1px solid #333333',
          boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.3)',
        }}>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '18px',
              backgroundColor: '#4F6A41',
              border: 'none',
              borderRadius: '12px',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#5F7A51';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4F6A41';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Got It - Ready to Work
          </button>
        </div>
      </div>
    </div>
  );
}
