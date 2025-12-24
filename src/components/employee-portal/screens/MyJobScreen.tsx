import { Calendar, DollarSign, TrendingUp, Lightbulb, MapPin, Phone, Clock, MessageSquare, Navigation, FileText, Camera as CameraIcon, StickyNote, Edit3, ClipboardEdit, Timer, Image as ImageIcon, ChevronRight, Briefcase, User } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../ThemeProvider';

type Tab = 'jobs' | 'photos' | 'messages' | 'me';

interface MyJobScreenProps {
  onOpenCamera?: (jobId?: string) => void;
  onOpenPhotos?: (jobId?: string) => void;
  onTabChange?: (tab: Tab) => void;
}

export function MyJobScreen({ onOpenCamera, onOpenPhotos, onTabChange, onNavigate }: MyJobScreenProps & { onNavigate?: (page: string) => void }) {
  const { colors, employeeColor } = useTheme();
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
          jobId: 'job-001', // String ID for photo system
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
          jobId: 'job-002',
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
          jobId: 'job-003',
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

  const COMPANYCAM_BLUE = '#0F7BFF';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      paddingBottom: '100px' // Space for bottom navigation
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        paddingTop: 'max(20px, env(safe-area-inset-top))',
        backgroundColor: colors.backgroundSecondary,
        borderBottom: `1px solid ${colors.border}`,
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
              color: colors.text,
              fontSize: '24px',
              fontWeight: '700',
              margin: '0 0 4px 0'
            }}>
              Welcome back, {employeeData.name.split(' ')[0]}
            </h1>
            <div style={{
              color: employeeColor,
              fontSize: '15px',
              fontWeight: '600'
            }}>
              {employeeData.todaysDate}
            </div>
          </div>

          {/* Quick Navigation Buttons - Top Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: '10px',
            marginBottom: '10px'
          }}>
            <button
              onClick={() => onTabChange?.('jobs')}
              style={{
                padding: '12px 8px',
                backgroundColor: '#6B7B4A',
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Briefcase size={20} />
              <span style={{ fontSize: '11px', fontWeight: '700' }}>Jobs</span>
            </button>

            <button
              onClick={() => onNavigate?.('Photos')}
              style={{
                padding: '12px 8px',
                backgroundColor: '#0F7BFF',
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ImageIcon size={20} />
              <span style={{ fontSize: '11px', fontWeight: '700' }}>Photos</span>
            </button>

            <button
              onClick={() => onTabChange?.('messages')}
              style={{
                padding: '12px 8px',
                backgroundColor: '#5B7BB5',
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                position: 'relative'
              }}
            >
              <MessageSquare size={20} />
              <span style={{ fontSize: '11px', fontWeight: '700' }}>Messages</span>
              {/* Notification dot */}
              <div style={{
                position: 'absolute',
                top: '6px',
                right: '12px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#DC2626',
                border: '2px solid #9C27B0'
              }} />
            </button>

            <button
              onClick={() => onTabChange?.('me')}
              style={{
                padding: '12px 8px',
                backgroundColor: '#4F6A41',
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <User size={20} />
              <span style={{ fontSize: '11px', fontWeight: '700' }}>Me</span>
            </button>
          </div>

          {/* Second Row - Calendar, P4P & Growth */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px'
          }}>
            <button
              onClick={() => onNavigate?.('Calendar')}
              style={{
                padding: '12px 8px',
                backgroundColor: '#3B9CAA',
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Calendar size={20} />
              <span style={{ fontSize: '11px', fontWeight: '700' }}>Calendar</span>
            </button>

            <button
              onClick={() => console.log('Navigate to P4P & Growth')}
              style={{
                padding: '12px 8px',
                backgroundColor: '#D4A024',
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <DollarSign size={18} />
                <TrendingUp size={14} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '700' }}>P4P & Growth</span>
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
            color: colors.text,
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
                borderBottom: day.isToday ? `3px solid ${employeeColor}` : '2px solid #2A2A2A'
              }}>
                <h3 style={{
                  color: day.isToday ? employeeColor : '#FFFFFF',
                  fontSize: '18px',
                  fontWeight: '700',
                  margin: 0
                }}>
                  {day.date}
                </h3>
                {day.isToday && (
                  <span style={{
                    backgroundColor: '#6B7B4A',
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
                    {/* Client Name & Camera Badge */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}>
                      <h3 style={{
                        color: colors.text,
                        fontSize: '20px',
                        fontWeight: '700',
                        margin: 0
                      }}>
                        {job.clientName}
                      </h3>
                      
                      {/* Camera Badge - Opens Camera */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenCamera?.(job.jobId);
                        }}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          backgroundColor: COMPANYCAM_BLUE,
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          position: 'relative',
                          boxShadow: '0 4px 12px rgba(15, 123, 255, 0.3)'
                        }}
                      >
                        <CameraIcon size={20} color="#FFFFFF" strokeWidth={2.5} />
                        {job.photoCount > 0 && (
                          <div style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '-6px',
                            minWidth: '20px',
                            height: '20px',
                            borderRadius: '10px',
                            backgroundColor: '#DC2626',
                            border: '2px solid #1F1F1F',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            fontWeight: '700',
                            color: colors.text,
                            padding: '0 4px'
                          }}>
                            {job.photoCount}
                          </div>
                        )}
                      </button>
                    </div>

                    {/* Job Type & Square Footage */}
                    <div style={{
                      color: colors.textSecondary,
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
                          color: colors.text,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          marginBottom: '12px',
                          position: 'relative',
                          overflow: 'hidden',
                          boxShadow: '0 6px 16px rgba(42, 116, 255, 0.4)',
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
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                          zIndex: 2,
                        }} />

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          zIndex: 1,
                        }}>
                          <Lightbulb size={18} color="#FFFFFF" strokeWidth={2.5} fill="#FFD700" />
                          <span style={{
                            fontWeight: '700',
                            fontSize: '15px',
                          }}>
                            Job Briefing
                          </span>
                        </div>
                        <div style={{ fontSize: '20px', zIndex: 1 }}>→</div>
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
                          gap: '4px',
                          flex: '1 1 140px',
                          backgroundColor: colors.backgroundTertiary,
                          padding: '12px',
                          borderRadius: '10px'
                        }}>
                          <span style={{
                            color: '#666666',
                            fontSize: '11px',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}>
                            Job Started
                          </span>
                          <span style={{
                            color: colors.text,
                            fontSize: '14px',
                            fontWeight: '700'
                          }}>
                            {job.startDate}
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          flex: '1 1 140px',
                          backgroundColor: colors.backgroundTertiary,
                          padding: '12px',
                          borderRadius: '10px'
                        }}>
                          <span style={{
                            color: '#666666',
                            fontSize: '11px',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}>
                            Complete By
                          </span>
                          <span style={{
                            color: employeeColor,
                            fontSize: '14px',
                            fontWeight: '700'
                          }}>
                            {job.completionDate}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Crew Info - Only show when expanded */}
                    {isExpanded && job.crew && job.crew.length > 0 && (
                      <div style={{
                        backgroundColor: colors.backgroundTertiary,
                        padding: '12px',
                        borderRadius: '10px',
                        marginBottom: '12px'
                      }}>
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
                                backgroundColor: colors.backgroundSecondary,
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
                                color: colors.text,
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
                          onOpenCamera?.(job.jobId);
                        }}
                        style={{
                          width: '100%',
                          padding: '24px',
                          backgroundColor: '#0F7BFF',
                          border: 'none',
                          borderRadius: '16px',
                          color: colors.text,
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

                        <CameraIcon size={56} strokeWidth={2.5} style={{ 
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
                            TAKE PHOTO
                          </span>
                          {job.photoCount > 0 && (
                            <span style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              opacity: 0.9,
                            }}>
                              {job.photoCount} photo{job.photoCount !== 1 ? 's' : ''} captured
                            </span>
                          )}
                        </div>
                      </button>
                    )}

                    {/* View Photos Button - Only show when expanded and has photos */}
                    {isExpanded && job.photoCount > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenPhotos?.(job.jobId);
                        }}
                        style={{
                          width: '100%',
                          padding: '14px',
                          backgroundColor: colors.backgroundTertiary,
                          border: '1px solid #3D3D3D',
                          borderRadius: '12px',
                          color: colors.text,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          marginBottom: '16px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <ImageIcon size={20} color={COMPANYCAM_BLUE} />
                          <span style={{ fontWeight: '600', fontSize: '15px' }}>
                            View All Photos
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            backgroundColor: COMPANYCAM_BLUE,
                            color: colors.text,
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '700'
                          }}>
                            {job.photoCount}
                          </span>
                          <ChevronRight size={18} color="#666" />
                        </div>
                      </button>
                    )}

                    {/* Action Buttons Grid - Only show when expanded */}
                    {isExpanded && (
                      <div onClick={(e) => e.stopPropagation()} style={{ marginTop: '4px' }}>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '12px',
                          marginBottom: '16px'
                        }}>
                          <ActionButton
                            icon={FileText}
                            label="Work Order"
                            color="#4F6A41"
                            onClick={() => console.log('Work Order')}
                          />
                          <ActionButton
                            icon={MessageSquare}
                            label="Message"
                            color="#3B9CAA"
                            onClick={() => console.log('Message')}
                          />
                          <ActionButton
                            icon={StickyNote}
                            label="Notes"
                            color="#FBBF24"
                            onClick={() => console.log('Notes')}
                          />
                          <ActionButton
                            icon={ClipboardEdit}
                            label="Change Order"
                            color="#6B5D4F"
                            onClick={() => console.log('Change Order')}
                          />
                        </div>

                        {/* Call Button */}
                        <button
                          onClick={() => window.location.href = `tel:${job.phoneNumber}`}
                          style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: colors.backgroundTertiary,
                            border: '1px solid #4F6A41',
                            borderRadius: '12px',
                            color: '#4F6A41',
                            fontSize: '15px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            marginBottom: '12px'
                          }}
                        >
                          <Phone size={18} />
                          Call Client
                        </button>
                      </div>
                    )}

                    {/* Progress Bar - Always visible */}
                    {job.status === 'In Progress' && (
                      <div 
                        style={{ 
                          marginTop: isExpanded ? '0' : '12px',
                          position: 'relative' 
                        }}
                        onMouseEnter={() => setHoveredProgressJobId(job.id)}
                        onMouseLeave={() => setHoveredProgressJobId(null)}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px'
                        }}>
                          <span style={{
                            color: '#888888',
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
                            backgroundColor: colors.backgroundSecondary,
                            border: '2px solid #4F6A41',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                            zIndex: 1000,
                            minWidth: '200px',
                            pointerEvents: 'none'
                          }}>
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

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#888888', fontSize: '13px' }}>Total Hours:</span>
                                <span style={{ color: colors.text, fontSize: '14px', fontWeight: '700' }}>{job.totalHours} hrs</span>
                              </div>
                              <div style={{ height: '1px', backgroundColor: '#333333' }} />
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#888888', fontSize: '13px' }}>Hours Used:</span>
                                <span style={{ color: '#4F6A41', fontSize: '14px', fontWeight: '700' }}>{job.hoursUsed} hrs</span>
                              </div>
                              <div style={{ height: '1px', backgroundColor: '#333333' }} />
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#888888', fontSize: '13px' }}>Remaining:</span>
                                <span style={{ color: employeeColor, fontSize: '14px', fontWeight: '700' }}>{job.remainingHours} hrs</span>
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

      {/* Job Briefing Modal */}
      {briefingJobId !== null && (() => {
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
        padding: '16px 12px',
        backgroundColor: color,
        border: 'none',
        borderRadius: '12px',
        color: colors.text,
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        minHeight: '80px',
        position: 'relative'
      }}
    >
      <Icon size={22} />
      {label}
      {badge !== undefined && badge > 0 && (
        <span style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          backgroundColor: '#DC2626',
          color: colors.text,
          padding: '2px 6px',
          borderRadius: '12px',
          fontSize: '10px',
          fontWeight: '700'
        }}>
          {badge}
        </span>
      )}
    </button>
  );
}
