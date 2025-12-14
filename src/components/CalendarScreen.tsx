import { useState } from 'react';
import { MapPin, Phone, ChevronRight, Map, Navigation } from 'lucide-react';

type ViewMode = 'day' | 'week' | 'month';

interface CalendarJob {
  id: string;
  clientName: string;
  jobType: 'Install' | 'Sand/Finish' | 'Repairs' | 'Stairs/Inlays';
  startDate: string;
  endDate: string;
  progress: number;
  foremanColor: string;
  foremanInitials: string;
  address: string;
  phoneNumber: string;
  driveTime?: string;
  distance?: string;
}

export function CalendarScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [showRouteModal, setShowRouteModal] = useState(false);

  const GOLD = '#D4A024';
  
  const jobTypeColors = {
    'Install': '#4F6A41',
    'Sand/Finish': '#55624C',
    'Repairs': '#6B8E65',
    'Stairs/Inlays': '#3D5235'
  };

  // Mock jobs data
  const todaysJobs: CalendarJob[] = [
    {
      id: '1',
      clientName: 'Anderson, James',
      jobType: 'Install',
      startDate: '9:00 AM',
      endDate: '5:00 PM',
      progress: 65,
      foremanColor: '#E87722',
      foremanInitials: 'TC',
      address: '742 Maple Ridge Drive, Greenville, SC',
      phoneNumber: '(864) 555-0142',
      driveTime: '12 min',
      distance: '5.2 mi'
    },
    {
      id: '2',
      clientName: 'Martinez, Sarah',
      jobType: 'Sand/Finish',
      startDate: '8:00 AM',
      endDate: '12:00 PM',
      progress: 90,
      foremanColor: '#E87722',
      foremanInitials: 'TC',
      address: '128 Oak Valley Road, Greenville, SC',
      phoneNumber: '(864) 555-0198',
      driveTime: '8 min',
      distance: '3.1 mi'
    }
  ];

  const weekJobs: CalendarJob[] = [
    ...todaysJobs,
    {
      id: '3',
      clientName: 'Thompson, Robert',
      jobType: 'Repairs',
      startDate: 'Tomorrow',
      endDate: 'Tomorrow',
      progress: 0,
      foremanColor: '#0F7BFF',
      foremanInitials: 'JS',
      address: '456 Pine Street, Greenville, SC',
      phoneNumber: '(864) 555-0234'
    },
    {
      id: '4',
      clientName: 'Davis, Jennifer',
      jobType: 'Stairs/Inlays',
      startDate: 'Friday',
      endDate: 'Friday',
      progress: 0,
      foremanColor: '#E87722',
      foremanInitials: 'TC',
      address: '890 Cedar Lane, Greenville, SC',
      phoneNumber: '(864) 555-0287'
    }
  ];

  const handleNavigate = (address: string) => {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleJobClick = (jobId: string) => {
    console.log('Open job details:', jobId);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A0A',
      paddingBottom: '100px'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        backgroundColor: '#1A1A1A',
        borderBottom: '1px solid #2A2A2A',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h1 style={{
            color: '#FFFFFF',
            fontSize: '24px',
            fontWeight: '700',
            margin: '0 0 16px 0'
          }}>
            Calendar
          </h1>

          {/* View Mode Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '16px'
          }}>
            {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: viewMode === mode ? GOLD : '#252525',
                  border: `2px solid ${viewMode === mode ? GOLD : '#3A3A3A'}`,
                  borderRadius: '10px',
                  color: viewMode === mode ? '#1A1A1A' : '#A0A0A0',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textTransform: 'capitalize'
                }}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* View Route Button */}
          <button
            onClick={() => setShowRouteModal(true)}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#252525',
              border: '2px solid #4F6A41',
              borderRadius: '10px',
              color: '#4F6A41',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Map size={20} />
            View Today's Route
          </button>
        </div>
      </div>

      {/* Jobs List */}
      <div style={{
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <div style={{
          color: '#A0A0A0',
          fontSize: '13px',
          fontWeight: '700',
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {viewMode === 'day' ? "Today's Jobs" : viewMode === 'week' ? 'This Week' : 'This Month'}
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {(viewMode === 'day' ? todaysJobs : weekJobs).map((job) => (
            <CalendarJobBlock
              key={job.id}
              job={job}
              jobTypeColor={jobTypeColors[job.jobType]}
              onNavigate={() => handleNavigate(job.address)}
              onCall={() => handleCall(job.phoneNumber)}
              onJobClick={() => handleJobClick(job.id)}
            />
          ))}
        </div>
      </div>

      {/* Route Modal */}
      {showRouteModal && (
        <div
          onClick={() => setShowRouteModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#1A1A1A',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              border: '1px solid #2A2A2A'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <Map size={24} color={GOLD} />
              <h2 style={{
                color: '#FFFFFF',
                fontSize: '20px',
                fontWeight: '700',
                margin: 0,
                flex: 1
              }}>
                Today's Route
              </h2>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {todaysJobs.map((job, index) => (
                <div
                  key={job.id}
                  style={{
                    backgroundColor: '#252525',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid #2A2A2A'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: GOLD,
                      color: '#1A1A1A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: '700',
                      flexShrink: 0
                    }}>
                      {index + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{
                        color: '#FFFFFF',
                        fontSize: '16px',
                        fontWeight: '700',
                        marginBottom: '4px'
                      }}>
                        {job.clientName}
                      </div>
                      
                      <div style={{
                        color: '#A0A0A0',
                        fontSize: '13px',
                        marginBottom: '8px'
                      }}>
                        {job.address}
                      </div>

                      {job.driveTime && (
                        <div style={{
                          display: 'flex',
                          gap: '12px',
                          fontSize: '13px',
                          color: '#4F6A41'
                        }}>
                          <span>🕐 {job.driveTime}</span>
                          <span>📍 {job.distance}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleNavigate(job.address);
                      setShowRouteModal(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#4F6A41',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Navigation size={16} />
                    Navigate
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowRouteModal(false)}
              style={{
                width: '100%',
                padding: '14px',
                marginTop: '16px',
                backgroundColor: 'transparent',
                border: '2px solid #3A3A3A',
                borderRadius: '10px',
                color: '#A0A0A0',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface CalendarJobBlockProps {
  job: CalendarJob;
  jobTypeColor: string;
  onNavigate: () => void;
  onCall: () => void;
  onJobClick: () => void;
}

function CalendarJobBlock({ job, jobTypeColor, onNavigate, onCall, onJobClick }: CalendarJobBlockProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onJobClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#1F1F1F',
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid ${isHovered ? '#3A3A3A' : '#2A2A2A'}`,
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative'
      }}
    >
      {/* Foreman Color Indicator */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '4px',
        backgroundColor: job.foremanColor
      }} />

      {/* Content */}
      <div style={{
        padding: '16px 16px 16px 20px'
      }}>
        {/* Header Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '12px'
        }}>
          <div style={{ flex: 1 }}>
            <h3 style={{
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: '700',
              margin: '0 0 6px 0'
            }}>
              {job.clientName}
            </h3>
            
            <div style={{
              color: '#A0A0A0',
              fontSize: '13px',
              marginBottom: '4px'
            }}>
              {job.jobType}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#808080',
              fontSize: '12px'
            }}>
              <MapPin size={12} />
              <span>{job.address}</span>
            </div>
          </div>

          {/* Foreman Badge */}
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: job.foremanColor,
            border: '2px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: '700',
            color: '#FFFFFF',
            flexShrink: 0
          }}>
            {job.foremanInitials}
          </div>
        </div>

        {/* Time */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
          color: '#D4A024',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          <span>🕐</span>
          <span>{job.startDate} - {job.endDate}</span>
        </div>

        {/* Progress Bar */}
        <div style={{
          marginBottom: '12px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
            fontSize: '12px'
          }}>
            <span style={{ color: '#808080', fontWeight: '600' }}>Progress</span>
            <span style={{ color: jobTypeColor, fontWeight: '700' }}>{job.progress}%</span>
          </div>
          
          <div style={{
            height: '6px',
            backgroundColor: '#2A2A2A',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${job.progress}%`,
              backgroundColor: jobTypeColor,
              transition: 'width 0.3s'
            }} />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate();
            }}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#252525',
              border: '1px solid #3A3A3A',
              borderRadius: '8px',
              color: '#D4A024',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <MapPin size={14} />
            Navigate
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCall();
            }}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#252525',
              border: '1px solid #3A3A3A',
              borderRadius: '8px',
              color: '#4F6A41',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Phone size={14} />
            Call
          </button>
        </div>
      </div>
    </div>
  );
}
