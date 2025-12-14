import { X, AlertCircle, Clock, MapPin, Lightbulb } from 'lucide-react';

interface JobBriefingScreenProps {
  clientName: string;
  jobType: string;
  address: string;
  startTime: string;
  briefingNotes: string;
  onClose: () => void;
}

export function JobBriefingScreen({
  clientName,
  jobType,
  address,
  startTime,
  briefingNotes,
  onClose
}: JobBriefingScreenProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#0A0A0A',
      zIndex: 1000,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch'
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        backgroundColor: '#1A1A1A',
        borderBottom: '2px solid #2A74FF',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
        boxShadow: '0 4px 12px rgba(42, 116, 255, 0.2)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#2A74FF',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(42, 116, 255, 0.4)'
          }}>
            <Lightbulb size={24} color="#FFFFFF" fill="#FFD700" />
          </div>
          <div>
            <h1 style={{
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: '700',
              margin: 0,
              lineHeight: 1.2
            }}>
              Job Briefing
            </h1>
            <div style={{
              color: '#2A74FF',
              fontSize: '13px',
              fontWeight: '600',
              marginTop: '2px'
            }}>
              Read Before Starting
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '44px',
            height: '44px',
            backgroundColor: '#2A2A2A',
            border: 'none',
            borderRadius: '12px',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#3A3A3A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2A2A2A';
          }}
        >
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div style={{
        padding: '24px 20px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {/* Job Info Card */}
        <div style={{
          backgroundColor: '#1F1F1F',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          border: '1px solid #2A2A2A'
        }}>
          <h2 style={{
            color: '#FFFFFF',
            fontSize: '22px',
            fontWeight: '700',
            margin: '0 0 16px 0'
          }}>
            {clientName}
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {/* Job Type */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#4F6A41',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <AlertCircle size={18} color="#FFFFFF" />
              </div>
              <div>
                <div style={{
                  color: '#888888',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Job Type
                </div>
                <div style={{
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: '700'
                }}>
                  {jobType}
                </div>
              </div>
            </div>

            {/* Start Time */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#D4A024',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Clock size={18} color="#FFFFFF" />
              </div>
              <div>
                <div style={{
                  color: '#888888',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Start Time
                </div>
                <div style={{
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: '700'
                }}>
                  {startTime}
                </div>
              </div>
            </div>

            {/* Address */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#4285F4',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MapPin size={18} color="#FFFFFF" />
              </div>
              <div>
                <div style={{
                  color: '#888888',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  Address
                </div>
                <div style={{
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: '600',
                  lineHeight: 1.4
                }}>
                  {address}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes Section */}
        <div style={{
          backgroundColor: '#1F1F1F',
          borderRadius: '16px',
          padding: '20px',
          border: '2px solid #2A74FF',
          boxShadow: '0 4px 16px rgba(42, 116, 255, 0.2)'
        }}>
          {/* Section Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '2px solid #2A2A2A'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#2A74FF',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(42, 116, 255, 0.4)'
            }}>
              <AlertCircle size={20} color="#FFFFFF" />
            </div>
            <h3 style={{
              color: '#FFFFFF',
              fontSize: '18px',
              fontWeight: '700',
              margin: 0
            }}>
              Important Notes from Bid
            </h3>
          </div>

          {/* Briefing Content */}
          <div style={{
            backgroundColor: '#2A2A2A',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #3A3A3A'
          }}>
            <div style={{
              color: '#FFFFFF',
              fontSize: '16px',
              lineHeight: 1.7,
              fontWeight: '500',
              whiteSpace: 'pre-wrap'
            }}>
              {briefingNotes}
            </div>
          </div>

          {/* Alert Badge */}
          <div style={{
            marginTop: '16px',
            backgroundColor: 'rgba(255, 59, 48, 0.1)',
            border: '1px solid rgba(255, 59, 48, 0.3)',
            borderRadius: '10px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={20} color="#FF3B30" />
            <div style={{
              color: '#FF9090',
              fontSize: '14px',
              fontWeight: '600',
              lineHeight: 1.4
            }}>
              Please review these notes carefully before starting work on this job.
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '18px',
            backgroundColor: '#4F6A41',
            border: 'none',
            borderRadius: '14px',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: '24px',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(79, 106, 65, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#5A7A4C';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(79, 106, 65, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#4F6A41';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 106, 65, 0.3)';
          }}
        >
          Got It - I've Read the Notes
        </button>
      </div>
    </div>
  );
}
