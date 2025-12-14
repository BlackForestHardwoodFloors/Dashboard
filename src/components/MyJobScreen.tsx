import { Calendar, DollarSign, TrendingUp, Lightbulb, MapPin, Phone, Clock, MessageSquare, Navigation, FileText, Camera as CameraIcon, StickyNote, Edit3, ClipboardEdit, Timer } from 'lucide-react';
import { useState } from 'react';
import { EmployeeJobCard } from './EmployeeJobCard';
import { Camera } from 'lucide-react';
import { ResponsiveCameraModule } from './ResponsiveCameraModule';
import { PhotoGalleryScreen } from './PhotoGalleryScreen';
import { SubmitTimeButton } from './SubmitTimeButton';
import { JobBriefingModal } from './JobBriefingModal';

export function MyJobScreen() {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);
  const [briefingJobId, setBriefingJobId] = useState<number | null>(null);
  const [hoveredProgressJobId, setHoveredProgressJobId] = useState<number | null>(null);

  // Mock data - would come from API/props in real app
  const employeeData = {
    name: 'Mike Rodriguez',
    initials: 'MR',
    todaysDate: new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    })
  };

  // Week schedule with multiple jobs per day
  const weekSchedule = [
    {
      date: 'Monday, Nov 18',
      isToday: true,
      jobs: [
        {
          id: 1,
          clientName: 'Anderson, James',
          status: 'In Progress' as const,
          jobType: 'Install',
          sqft: 1250,
          address: '742 Maple Ridge Drive, Greenville, SC 29607',
          phoneNumber: '(864) 555-0142',
          startTime: '8:00 AM',
          startDate: 'Fri, Nov 15, 2024',
          completionDate: 'Wed, Nov 20, 2024',
          briefing: 'Install red oak hardwood in living room and hallway. Client prefers darker stain (Jacobean). Watch for uneven subfloor near fireplace - may need additional leveling compound. Client works from home, so minimize noise before 9 AM. Two cats in home - keep doors closed.',
          photoCount: 12,
          jobCompletePercent: 65,
          totalHours: 24,
          hoursUsed: 15.5,
          remainingHours: 8.5,
          foreman: 'Mike Rodriguez',
          crew: ['Carlos Martinez', 'James Wilson']
        }
      ]
    },
    {
      date: 'Tuesday, Nov 19',
      isToday: false,
      jobs: [
        {
          id: 3,
          clientName: 'Thompson Commercial',
          status: 'Scheduled' as const,
          jobType: 'Install',
          sqft: 3200,
          address: '1500 Oak Boulevard, Suite 200, Greenville, SC 29601',
          phoneNumber: '(864) 555-0223',
          startTime: '7:00 AM',
          startDate: 'Tue, Nov 19, 2024',
          completionDate: 'Fri, Nov 22, 2024',
          briefing: 'Large commercial space - office lobby and conference rooms. Premium wide-plank oak. Need scissor lift for high areas. Building manager arrives at 6:30 AM to unlock.',
          photoCount: 0,
          jobCompletePercent: 0,
          totalHours: 40,
          hoursUsed: 0,
          remainingHours: 40,
          foreman: 'Dave Thompson',
          crew: ['Mike Rodriguez', 'Carlos Martinez', 'James Wilson', 'Eric Johnson']
        }
      ]
    },
    {
      date: 'Wednesday, Nov 20',
      isToday: false,
      jobs: [
        {
          id: 4,
          clientName: 'Wilson Home',
          status: 'Scheduled' as const,
          jobType: 'Refinish',
          sqft: 1600,
          address: '234 Pine Street, Downtown, SC 29609',
          phoneNumber: '(864) 555-0167',
          startTime: '8:30 AM',
          startDate: 'Wed, Nov 20, 2024',
          completionDate: 'Fri, Nov 22, 2024',
          briefing: 'Sand and refinish existing oak floors. Client wants natural finish. Check for damaged boards that may need replacement. Pet-free home.',
          photoCount: 0,
          jobCompletePercent: 0,
          totalHours: 18,
          hoursUsed: 0,
          remainingHours: 18,
          foreman: 'Mike Rodriguez',
          crew: ['Carlos Martinez', 'Tommy Davis']
        }
      ]
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A0A',
      paddingBottom: '100px' // Space for bottom navigation
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
          {/* Welcome Message */}
          <div style={{
            marginBottom: '16px'
          }}>
            <h1 style={{
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: '700',
              margin: '0 0 4px 0'
            }}>
              Welcome back, {employeeData.name.split(' ')[0]}
            </h1>
            <div style={{
              color: '#D4A024',
              fontSize: '15px',
              fontWeight: '600'
            }}>
              {employeeData.todaysDate}
            </div>
          </div>

          {/* Quick Navigation Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '12px'
          }}>
            <button
              onClick={() => console.log('Navigate to Calendar')}
              style={{
                padding: '14px 12px',
                backgroundColor: '#4F6A41',
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Calendar size={22} />
              <span style={{
                fontSize: '12px',
                fontWeight: '700'
              }}>
                Calendar
              </span>
            </button>

            <button
              onClick={() => console.log('Navigate to P4P')}
              style={{
                padding: '14px 12px',
                backgroundColor: '#D4A024',
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <DollarSign size={22} />
              <span style={{
                fontSize: '12px',
                fontWeight: '700'
              }}>
                P4P
              </span>
            </button>

            <button
              onClick={() => console.log('Navigate to Growth')}
              style={{
                padding: '14px 12px',
                backgroundColor: '#0F7BFF',
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <TrendingUp size={22} />
              <span style={{
                fontSize: '12px',
                fontWeight: '700'
              }}>
                Growth
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        padding: '24px 20px'
      }}>
        {/* Week View */}
        <div style={{
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h2 style={{
            color: '#FFFFFF',
            fontSize: '22px',
            fontWeight: '700',
            margin: '0 0 20px 0'
          }}>
            Your Week ({weekSchedule.reduce((acc, day) => acc + day.jobs.length, 0)} Jobs)
          </h2>

          {/* Day-by-day schedule */}
          {weekSchedule.map((day, dayIndex) => (
            <div key={dayIndex} style={{ marginBottom: '32px' }}>
              {/* Date Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: day.isToday ? '3px solid #D4A024' : '2px solid #2A2A2A'
              }}>
                <h3 style={{
                  color: day.isToday ? '#D4A024' : '#FFFFFF',
                  fontSize: '18px',
                  fontWeight: '700',
                  margin: 0
                }}>
                  {day.date}
                </h3>
                {day.isToday && (
                  <span style={{
                    backgroundColor: '#D4A024',
                    color: '#000000',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>
                    TODAY
                  </span>
                )}
                <span style={{
                  color: '#666666',
                  fontSize: '14px',
                  marginLeft: 'auto'
                }}>
                  {day.jobs.length} {day.jobs.length === 1 ? 'job' : 'jobs'}
                </span>
              </div>

              {/* Jobs for this day */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {day.jobs.map((job) => {
                  const isExpanded = expandedJobId === job.id;
                  
                  return (
                  <div
                    key={job.id}
                    onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                    style={{
                      backgroundColor: '#1F1F1F',
                      borderRadius: '16px',
                      padding: '20px',
                      border: job.status === 'In Progress' ? '2px solid #4F6A41' : '1px solid #2A2A2A',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Client Name */}
                    <h3 style={{
                      color: '#FFFFFF',
                      fontSize: '20px',
                      fontWeight: '700',
                      margin: '0 0 8px 0'
                    }}>
                      {job.clientName}
                    </h3>

                    {/* Job Type & Square Footage */}
                    <div style={{
                      color: '#A0A0A0',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '12px'
                    }}>
                      {job.jobType} {job.sqft > 0 ? `• ${job.sqft} sq ft` : ''}
                    </div>

                    {/* Job Briefing Button - Only show when expanded */}
                    {isExpanded && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setBriefingJobId(job.id);
                        }}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          backgroundColor: '#2A74FF',
                          border: '1px solid #4A8AFF',
                          borderRadius: '12px',
                          color: '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          marginBottom: '12px',
                          position: 'relative',
                          overflow: 'hidden',
                          boxShadow: '0 6px 16px rgba(42, 116, 255, 0.4), 0 0 30px rgba(42, 116, 255, 0.2)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#4A8AFF';
                          e.currentTarget.style.borderColor = '#6A9FFF';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(42, 116, 255, 0.5), 0 0 40px rgba(42, 116, 255, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#2A74FF';
                          e.currentTarget.style.borderColor = '#4A8AFF';
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(42, 116, 255, 0.4), 0 0 30px rgba(42, 116, 255, 0.2)';
                        }}
                      >
                        {/* Gloss overlay */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '50%',
                          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, transparent 100%)',
                          pointerEvents: 'none',
                        }} />

                        {/* Subtle radial glow */}
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '100%',
                          height: '100%',
                          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                          pointerEvents: 'none',
                        }} />

                        {/* Red notification dot */}
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          width: '10px',
                          height: '10px',
                          backgroundColor: '#FF3B30',
                          borderRadius: '50%',
                          border: '2px solid #FFFFFF',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3), 0 0 8px rgba(255, 59, 48, 0.6)',
                          zIndex: 2,
                        }} />

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          zIndex: 1,
                        }}>
                          <Lightbulb size={18} color="#FFFFFF" strokeWidth={2.5} fill="#FFD700" style={{
                            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
                          }} />
                          <span style={{
                            fontWeight: '700',
                            fontSize: '15px',
                            letterSpacing: '0.3px',
                            textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                          }}>
                            Job Briefing
                          </span>
                        </div>
                        <div style={{
                          fontSize: '20px',
                          color: 'rgba(255, 255, 255, 0.9)',
                          transition: 'transform 0.2s',
                          zIndex: 1,
                        }}>
                          →
                        </div>
                      </button>
                    )}

                    {/* Job Started & Job Complete Dates - Only show when expanded */}
                    {isExpanded && (
                      <div style={{
                        display: 'flex',
                        gap: '16px',
                        marginBottom: '12px',
                        flexWrap: 'wrap'
                      }}>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px'
                        }}>
                          <span style={{
                            color: '#666666',
                            fontSize: '11px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            Job Started
                          </span>
                          <span style={{
                            color: '#4F6A41',
                            fontSize: '14px',
                            fontWeight: '700'
                          }}>
                            {job.startDate}
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px'
                        }}>
                          <span style={{
                            color: '#666666',
                            fontSize: '11px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            Job Complete
                          </span>
                          <span style={{
                            color: '#D4A024',
                            fontSize: '14px',
                            fontWeight: '700'
                          }}>
                            {job.completionDate}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Foreman & Crew - Only show when expanded */}
                    {isExpanded && (
                      <div style={{
                        backgroundColor: '#252525',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '12px',
                        border: '1px solid #2A2A2A'
                      }}>
                        {/* Foreman */}
                        <div style={{
                          marginBottom: job.crew.length > 0 ? '12px' : '0'
                        }}>
                          <div style={{
                            color: '#666666',
                            fontSize: '11px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: '6px'
                          }}>
                            Foreman
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: '#4F6A41',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFFFFF',
                              fontSize: '13px',
                              fontWeight: '700',
                              flexShrink: 0
                            }}>
                              {job.foreman.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span style={{
                              color: '#FFFFFF',
                              fontSize: '15px',
                              fontWeight: '700'
                            }}>
                              {job.foreman}
                            </span>
                          </div>
                        </div>

                        {/* Crew Members */}
                        {job.crew.length > 0 && (
                          <div>
                            <div style={{
                              color: '#666666',
                              fontSize: '11px',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              marginBottom: '8px'
                            }}>
                              Assigned Crew ({job.crew.length})
                            </div>
                            <div style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '8px'
                            }}>
                              {job.crew.map((crewMember, index) => (
                                <div
                                  key={index}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    backgroundColor: '#1A1A1A',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    border: '1px solid #333333'
                                  }}
                                >
                                  <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: '#3B9CAA',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#FFFFFF',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    flexShrink: 0
                                  }}>
                                    {crewMember.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <span style={{
                                    color: '#E0E0E0',
                                    fontSize: '13px',
                                    fontWeight: '600'
                                  }}>
                                    {crewMember}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Address - Clickable for Navigation */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://maps.google.com/?q=${encodeURIComponent(job.address)}`);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        marginBottom: isExpanded ? '16px' : '0',
                        cursor: 'pointer',
                        padding: '8px',
                        backgroundColor: 'rgba(66, 133, 244, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(66, 133, 244, 0.2)',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(66, 133, 244, 0.15)';
                        e.currentTarget.style.borderColor = 'rgba(66, 133, 244, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(66, 133, 244, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(66, 133, 244, 0.2)';
                      }}
                    >
                      <MapPin size={16} color="#4285F4" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span style={{
                        color: '#4285F4',
                        fontSize: '14px',
                        lineHeight: '1.4',
                        fontWeight: '600'
                      }}>
                        {job.address}
                      </span>
                    </div>

                    {/* Large Camera Button - Only show when expanded */}
                    {isExpanded && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(`Open camera for ${job.clientName}`);
                        }}
                        style={{
                          width: '100%',
                          padding: '24px',
                          backgroundColor: '#0F7BFF',
                          border: 'none',
                          borderRadius: '16px',
                          color: '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                          boxShadow: '0 8px 20px rgba(15, 123, 255, 0.4)',
                          position: 'relative',
                          overflow: 'hidden',
                          marginBottom: '16px',
                          marginTop: '16px',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 12px 28px rgba(15, 123, 255, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(15, 123, 255, 0.4)';
                        }}
                      >
                        {/* Gloss overlay */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '50%',
                          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%)',
                          pointerEvents: 'none',
                        }} />

                        <Camera size={56} strokeWidth={2.5} style={{ 
                          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
                          zIndex: 1 
                        }} />
                        
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          zIndex: 1
                        }}>
                          <span style={{
                            fontWeight: '700',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                            letterSpacing: '0.5px'
                          }}>
                            OPEN CAMERA
                          </span>
                          {job.photoCount > 0 && (
                            <span style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              opacity: 0.9,
                              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                            }}>
                              {job.photoCount} photo{job.photoCount !== 1 ? 's' : ''} captured
                            </span>
                          )}
                        </div>
                      </button>
                    )}

                    {/* Action Buttons - Only show when expanded */}
                    {isExpanded && (
                      <div onClick={(e) => e.stopPropagation()} style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <ResponsiveCameraModule
                          onCapturePhoto={() => {
                            console.log(`Capture photo for ${job.clientName}`);
                          }}
                          onWorkOrder={() => {
                            console.log(`Open Work Order for ${job.clientName}`);
                          }}
                          onChangeOrder={() => {
                            console.log(`Open Change Order for ${job.clientName}`);
                          }}
                          onStainSignOff={() => {
                            console.log(`Open Stain Sign-Off for ${job.clientName}`);
                          }}
                          onCall={() => {
                            window.location.href = `tel:${job.phoneNumber}`;
                          }}
                          onMessage={() => {
                            console.log(`Message ${job.clientName} at ${job.phoneNumber}`);
                          }}
                          onNotes={() => {
                            console.log(`Open notes for ${job.clientName}`);
                          }}
                        />

                        {/* Submit Time Button */}
                        <SubmitTimeButton 
                          onClick={() => {
                            console.log(`Submit time for ${job.clientName}`);
                          }}
                          disabled={false}
                        />
                      </div>
                    )}

                    {/* Progress Bar (if in progress) */}
                    {job.status === 'In Progress' && (
                      <div 
                        style={{ marginTop: '16px', position: 'relative' }}
                        onMouseEnter={(e) => {
                          e.stopPropagation();
                          setHoveredProgressJobId(job.id);
                        }}
                        onMouseLeave={(e) => {
                          e.stopPropagation();
                          setHoveredProgressJobId(null);
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '8px'
                        }}>
                          <span style={{
                            color: '#A0A0A0',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            Progress
                          </span>
                          <span style={{
                            color: '#4F6A41',
                            fontSize: '12px',
                            fontWeight: '700'
                          }}>
                            {job.jobCompletePercent}%
                          </span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '8px',
                          backgroundColor: '#2A2A2A',
                          borderRadius: '10px',
                          overflow: 'visible',
                          position: 'relative',
                          cursor: 'help'
                        }}>
                          <div style={{
                            width: `${job.jobCompletePercent}%`,
                            height: '100%',
                            backgroundColor: '#4F6A41',
                            transition: 'width 0.3s',
                            borderRadius: '10px'
                          }} />
                        </div>

                        {/* Hover Tooltip */}
                        {hoveredProgressJobId === job.id && (
                          <div style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            marginBottom: '12px',
                            backgroundColor: '#1A1A1A',
                            border: '2px solid #4F6A41',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                            zIndex: 1000,
                            minWidth: '220px',
                            pointerEvents: 'none'
                          }}>
                            {/* Triangle pointer */}
                            <div style={{
                              position: 'absolute',
                              bottom: '-10px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: 0,
                              height: 0,
                              borderLeft: '10px solid transparent',
                              borderRight: '10px solid transparent',
                              borderTop: '10px solid #4F6A41'
                            }} />

                            {/* Content */}
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px'
                            }}>
                              {/* Total Hours */}
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}>
                                <span style={{
                                  color: '#888888',
                                  fontSize: '13px',
                                  fontWeight: '600'
                                }}>
                                  Total Hours:
                                </span>
                                <span style={{
                                  color: '#FFFFFF',
                                  fontSize: '14px',
                                  fontWeight: '700'
                                }}>
                                  {job.totalHours} hrs
                                </span>
                              </div>

                              {/* Divider */}
                              <div style={{
                                height: '1px',
                                backgroundColor: '#333333'
                              }} />

                              {/* Hours Used */}
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}>
                                <span style={{
                                  color: '#888888',
                                  fontSize: '13px',
                                  fontWeight: '600'
                                }}>
                                  Hours Used:
                                </span>
                                <span style={{
                                  color: '#4F6A41',
                                  fontSize: '14px',
                                  fontWeight: '700'
                                }}>
                                  {job.hoursUsed} hrs
                                </span>
                              </div>

                              {/* Divider */}
                              <div style={{
                                height: '1px',
                                backgroundColor: '#333333'
                              }} />

                              {/* Hours Remaining */}
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}>
                                <span style={{
                                  color: '#888888',
                                  fontSize: '13px',
                                  fontWeight: '600'
                                }}>
                                  Hours Remaining:
                                </span>
                                <span style={{
                                  color: '#D4A024',
                                  fontSize: '14px',
                                  fontWeight: '700'
                                }}>
                                  {job.remainingHours} hrs
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Photo Gallery */}
      {isGalleryOpen && (
        <PhotoGalleryScreen
          photos={[]}
          clientName="Client"
          onClose={() => setIsGalleryOpen(false)}
        />
      )}

      {/* Job Briefing Modal */}
      {briefingJobId !== null && (() => {
        // Find the job with the matching ID
        const currentJob = weekSchedule.flatMap(day => day.jobs).find(job => job.id === briefingJobId);
        
        if (!currentJob) return null;
        
        return (
          <JobBriefingModal
            isOpen={true}
            onClose={() => setBriefingJobId(null)}
            clientName={currentJob.clientName}
            address={currentJob.address}
            jobType={currentJob.jobType}
            sqft={currentJob.sqft}
            startDate={currentJob.startDate}
            completionDate={currentJob.completionDate}
            briefing={currentJob.briefing}
          />
        );
      })()}
    </div>
  );
}

// Action Button Component
function ActionButton({ icon: Icon, label, color, onClick, badge }: { icon: any, label: string, color: string, onClick: () => void, badge?: number }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px',
        backgroundColor: color,
        border: 'none',
        borderRadius: '10px',
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
      <Icon size={16} />
      {label}
      {badge !== undefined && (
        <span style={{
          backgroundColor: '#FF4500',
          color: '#FFFFFF',
          padding: '2px 6px',
          borderRadius: '12px',
          fontSize: '10px',
          fontWeight: '700',
          marginLeft: 'auto'
        }}>
          {badge}
        </span>
      )}
    </button>
  );
}