import { MapPin, Phone, FileText, Camera, MessageCircle, StickyNote, Clipboard, FileEdit, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface EmployeeJobCardProps {
  clientName: string;
  status: 'In Progress' | 'Pending' | 'Over Budget' | 'Completed';
  jobType: string;
  sqft: number;
  address: string;
  phoneNumber: string;
  briefing: string;
  photoCount: number;
  photos: Array<{ url: string; employeeInitials: string }>;
  jobCompletePercent: number;
  remainingHours: number;
  onWorkOrder: () => void;
  onPictures: () => void;
  onMessage: () => void;
  onNotes: () => void;
  onStainSignOff: () => void;
  onChangeOrders: () => void;
  onNavigate: () => void;
  onCall: () => void;
  onSubmitTime: () => void;
}

export function EmployeeJobCard({
  clientName,
  status,
  jobType,
  sqft,
  address,
  phoneNumber,
  briefing,
  photoCount,
  photos,
  jobCompletePercent,
  remainingHours,
  onWorkOrder,
  onPictures,
  onMessage,
  onNotes,
  onStainSignOff,
  onChangeOrders,
  onNavigate,
  onCall,
  onSubmitTime
}: EmployeeJobCardProps) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const FOREST_GREEN = '#4F6A41';
  const COMPANYCAM_BLUE = '#0F7BFF';
  const SOFT_TEAL = '#3B9CAA';
  const STICKY_YELLOW = '#FBBF24';
  const ALERT_ORANGE = '#E87722';
  const EARTH_BROWN = '#6B5D4F';
  const GOLD = '#D4A024';

  const statusColors = {
    'In Progress': '#4F6A41',
    'Pending': '#D4A024',
    'Over Budget': '#DC2626',
    'Completed': '#16A34A'
  };

  const getProgressColor = () => {
    if (jobCompletePercent >= 90) return '#DC2626'; // Red - nearly over budget
    if (jobCompletePercent >= 70) return '#D4A024'; // Yellow - caution
    return '#4F6A41'; // Green - on track
  };

  return (
    <div style={{
      width: '90%',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#1F1F1F',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
    }}>
      {/* Job Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #2A2A2A',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{
            color: '#FFFFFF',
            fontSize: '22px',
            fontWeight: '700',
            margin: '0 0 8px 0'
          }}>
            {clientName}
          </h2>
          <div style={{
            color: '#A0A0A0',
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>{jobType}</span>
            <span>•</span>
            <span>{sqft.toLocaleString()} sq ft</span>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {/* Camera Icon Badge */}
          <button
            onClick={onPictures}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: COMPANYCAM_BLUE,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              position: 'relative',
              boxShadow: hoveredButton === 'header-camera' 
                ? '0 6px 16px rgba(15, 123, 255, 0.4)' 
                : '0 4px 12px rgba(15, 123, 255, 0.3)',
              transform: hoveredButton === 'header-camera' ? 'scale(1.05)' : 'scale(1)',
            }}
            onMouseEnter={() => setHoveredButton('header-camera')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <Camera size={24} color="#FFFFFF" strokeWidth={2.5} />
            {photoCount > 0 && (
              <div style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                minWidth: '22px',
                height: '22px',
                borderRadius: '11px',
                backgroundColor: '#DC2626',
                border: '2px solid #1F1F1F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: '700',
                color: '#FFFFFF',
                padding: '0 6px'
              }}>
                {photoCount}
              </div>
            )}
          </button>

          {/* Status Badge */}
          <div style={{
            padding: '4px 10px',
            borderRadius: '20px',
            backgroundColor: statusColors[status],
            color: '#FFFFFF',
            fontSize: '10px',
            fontWeight: '700',
            whiteSpace: 'nowrap'
          }}>
            {status}
          </div>
        </div>
      </div>

      {/* Address & Contact Row */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #2A2A2A',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#E0E0E0',
          fontSize: '15px'
        }}>
          <MapPin size={18} color="#D4A024" />
          <span style={{ flex: 1 }}>{address}</span>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={onNavigate}
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: hoveredButton === 'navigate' ? '#2A2A2A' : '#252525',
              border: '1px solid #3A3A3A',
              borderRadius: '12px',
              color: '#D4A024',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={() => setHoveredButton('navigate')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <MapPin size={18} />
            Navigate
          </button>
          
          <button
            onClick={onCall}
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: hoveredButton === 'call' ? '#2A2A2A' : '#252525',
              border: '1px solid #3A3A3A',
              borderRadius: '12px',
              color: '#4F6A41',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={() => setHoveredButton('call')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <Phone size={18} />
            Call
          </button>
        </div>
      </div>

      {/* Photo Carousel */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #2A2A2A'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: '700',
            margin: 0
          }}>
            Recent Photos
          </h3>
          
          <button
            onClick={onPictures}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: COMPANYCAM_BLUE,
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            View All
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '8px'
        }}>
          {photos.map((photo, index) => (
            <div
              key={index}
              style={{
                minWidth: '120px',
                height: '120px',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0,
                border: '2px solid #2A2A2A'
              }}
            >
              <img
                src={photo.url}
                alt={`Photo ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              
              {/* Employee Initials Badge */}
              <div style={{
                position: 'absolute',
                bottom: '6px',
                left: '6px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: COMPANYCAM_BLUE,
                border: '2px solid rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: '700',
                color: '#FFFFFF'
              }}>
                {photo.employeeInitials}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Actions Row */}
      <div style={{
        padding: '20px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        borderBottom: '1px solid #2A2A2A'
      }}>
        <ActionButton
          icon={FileText}
          label="Work Order"
          color={FOREST_GREEN}
          onClick={onWorkOrder}
          onHover={setHoveredButton}
          isHovered={hoveredButton === 'work-order'}
          id="work-order"
        />
        
        <ActionButton
          icon={Camera}
          label="Pictures"
          color={COMPANYCAM_BLUE}
          onClick={onPictures}
          onHover={setHoveredButton}
          isHovered={hoveredButton === 'pictures'}
          id="pictures"
          badge={photoCount}
        />
        
        <ActionButton
          icon={MessageCircle}
          label="Message Client"
          color={SOFT_TEAL}
          onClick={onMessage}
          onHover={setHoveredButton}
          isHovered={hoveredButton === 'message'}
          id="message"
        />
        
        <ActionButton
          icon={StickyNote}
          label="Notes"
          color={STICKY_YELLOW}
          onClick={onNotes}
          onHover={setHoveredButton}
          isHovered={hoveredButton === 'notes'}
          id="notes"
        />
      </div>

      {/* Secondary Actions Row */}
      <div style={{
        padding: '20px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        borderBottom: '1px solid #2A2A2A'
      }}>
        <ActionButton
          icon={Clipboard}
          label="Stain Sign-Off"
          color={ALERT_ORANGE}
          onClick={onStainSignOff}
          onHover={setHoveredButton}
          isHovered={hoveredButton === 'stain'}
          id="stain"
        />
        
        <ActionButton
          icon={FileEdit}
          label="Change Orders"
          color={EARTH_BROWN}
          onClick={onChangeOrders}
          onHover={setHoveredButton}
          isHovered={hoveredButton === 'change'}
          id="change"
        />
      </div>

      {/* Time Submission Widget */}
      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(212,160,36,0.1) 0%, rgba(79,106,65,0.1) 100%)',
        borderTop: '1px solid rgba(212,160,36,0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px'
        }}>
          <div>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              color: getProgressColor(),
              marginBottom: '4px'
            }}>
              {jobCompletePercent}%
            </div>
            <div style={{
              fontSize: '13px',
              color: '#A0A0A0',
              fontWeight: '600'
            }}>
              Job Complete
            </div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '4px'
            }}>
              {remainingHours} hrs
            </div>
            <div style={{
              fontSize: '13px',
              color: '#A0A0A0',
              fontWeight: '600'
            }}>
              Remaining
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          height: '8px',
          backgroundColor: '#2A2A2A',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '16px'
        }}>
          <div style={{
            height: '100%',
            width: `${jobCompletePercent}%`,
            backgroundColor: getProgressColor(),
            transition: 'all 0.3s'
          }} />
        </div>

        {/* Submit Time Button */}
        <button
          onClick={onSubmitTime}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: hoveredButton === 'submit-time' ? '#C72626' : '#DC2626',
            border: 'none',
            borderRadius: '12px',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(220,38,38,0.3)'
          }}
          onMouseEnter={() => setHoveredButton('submit-time')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          Submit Time
        </button>
      </div>
    </div>
  );
}

interface ActionButtonProps {
  icon: any;
  label: string;
  color: string;
  onClick: () => void;
  onHover: (id: string | null) => void;
  isHovered: boolean;
  id: string;
  outlined?: boolean;
  badge?: number;
}

function ActionButton({ icon: Icon, label, color, onClick, onHover, isHovered, id, outlined, badge }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      style={{
        padding: '18px 16px',
        backgroundColor: outlined ? 'transparent' : color,
        border: outlined ? `2px solid ${color}` : 'none',
        borderRadius: '12px',
        color: '#FFFFFF',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        opacity: isHovered ? 0.9 : 1,
        transform: isHovered ? 'scale(0.98)' : 'scale(1)',
        position: 'relative',
        minHeight: '80px',
        justifyContent: 'center'
      }}
    >
      <Icon size={24} />
      <span>{label}</span>
      
      {badge !== undefined && badge > 0 && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          backgroundColor: '#DC2626',
          color: '#FFFFFF',
          fontSize: '11px',
          fontWeight: '700',
          padding: '2px 6px',
          borderRadius: '10px',
          minWidth: '20px',
          textAlign: 'center'
        }}>
          {badge}
        </div>
      )}
    </button>
  );
}