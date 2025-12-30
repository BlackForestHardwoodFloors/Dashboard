import { Calendar, DollarSign, TrendingUp, Lightbulb, MapPin, Phone, Clock, MessageSquare, Navigation, FileText, Camera as CameraIcon, StickyNote, Edit3, ClipboardEdit, Timer, Image as ImageIcon, ChevronRight, User, X, ExternalLink, Plus, Trash2, Check, Palette } from 'lucide-react';
import { useState, useRef } from 'react';
import { useTheme } from '../ThemeProvider';

type Tab = 'jobs' | 'photos' | 'messages' | 'me';

interface StainColor {
  color: string;
  percentage: number;
}

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
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<{[key: number]: number}>({});
  const [stainSignOffJobId, setStainSignOffJobId] = useState<number | null>(null);

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
          photos: [
            { id: 1, url: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400', room: 'Living Room', phase: 'Install', timestamp: 'Today 2:30 PM' },
            { id: 2, url: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=400', room: 'Living Room', phase: 'Before', timestamp: 'Today 10:15 AM' },
            { id: 3, url: 'https://images.unsplash.com/photo-1560185008-b033106af5c3?w=400', room: 'Kitchen', phase: 'Install', timestamp: 'Today 9:45 AM' },
            { id: 4, url: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400', room: 'Hallway', phase: 'Before', timestamp: 'Yesterday 4:30 PM' },
            { id: 5, url: 'https://images.unsplash.com/photo-1560185127-6a8c1f1d9e2b?w=400', room: 'Living Room', phase: 'Progress', timestamp: 'Yesterday 2:15 PM' },
            { id: 6, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', room: 'Entryway', phase: 'Before', timestamp: 'Yesterday 11:00 AM' },
            { id: 7, url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400', room: 'Living Room', phase: 'Progress', timestamp: 'Mon 3:45 PM' },
            { id: 8, url: 'https://images.unsplash.com/photo-1560449752-3fd4bdbe7df0?w=400', room: 'Dining Room', phase: 'Before', timestamp: 'Mon 1:30 PM' },
            { id: 9, url: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400', room: 'Kitchen', phase: 'Before', timestamp: 'Mon 10:00 AM' },
            { id: 10, url: 'https://images.unsplash.com/photo-1560448075-cbc16bb4af8e?w=400', room: 'Hallway', phase: 'Progress', timestamp: 'Fri 4:00 PM' },
            { id: 11, url: 'https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?w=400', room: 'Living Room', phase: 'Before', timestamp: 'Fri 2:30 PM' },
            { id: 12, url: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=400', room: 'Entryway', phase: 'Before', timestamp: 'Fri 9:00 AM' }
          ],
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
        borderBottom: `1px solid ${colors.border}`
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

          {/* Quick Navigation Buttons - Row 1: Calendar, Photos, Messages, Me */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: '10px',
            marginBottom: '10px'
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
                border: '2px solid #5B7BB5'
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

          {/* Row 2: P4P/Growth, Time Sheet */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px'
          }}>
            <button
              onClick={() => onNavigate?.('P4P Growth')}
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

            <button
              onClick={() => onNavigate?.('Time Sheet')}
              style={{
                padding: '12px 8px',
                backgroundColor: '#D76A6A',
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
              <Clock size={20} />
              <span style={{ fontSize: '11px', fontWeight: '700' }}>Time Sheet</span>
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
                    {/* Two Column Layout: Info Left, Street View Right */}
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      marginBottom: isExpanded ? '16px' : '0'
                    }}>
                      {/* Left Column - Job Info */}
                      <div style={{ flex: 1 }}>
                        {/* Client Name */}
                        <h3 style={{
                          color: colors.text,
                          fontSize: '20px',
                          fontWeight: '700',
                          margin: '0 0 8px 0'
                        }}>
                          {job.clientName}
                        </h3>
                        
                        {/* Job Type & Square Footage */}
                        <div style={{
                          color: colors.textSecondary,
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '8px'
                        }}>
                          {job.jobType} {job.sqft > 0 ? `• ${job.sqft} sq ft` : ''}
                        </div>

                        {/* Address Row */}
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://maps.google.com/?q=${encodeURIComponent(job.address)}`);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '6px',
                            cursor: 'pointer',
                          }}
                        >
                          <MapPin size={14} color="#4285F4" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <span style={{
                            color: '#4285F4',
                            fontSize: '13px',
                            lineHeight: '1.3',
                            fontWeight: '500'
                          }}>
                            {job.address}
                          </span>
                        </div>
                      </div>

                      {/* Right Column - Message, Call buttons and Street View */}
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        flexShrink: 0,
                      }}>
                        {/* Message Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Message customer');
                          }}
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '10px',
                            backgroundColor: '#3B9CAA',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <MessageSquare size={22} color="#FFFFFF" />
                        </button>

                        {/* Call Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `tel:${job.phoneNumber}`;
                          }}
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '10px',
                            backgroundColor: '#4F6A41',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Phone size={22} color="#FFFFFF" />
                        </button>

                        {/* Google Street View */}
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://maps.google.com/?q=${encodeURIComponent(job.address)}`);
                          }}
                          style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            position: 'relative',
                            backgroundColor: '#2A2A2A',
                            border: '2px solid #0F7BFF',
                          }}
                        >
                          <img 
                            src={`https://maps.googleapis.com/maps/api/streetview?size=200x200&location=${encodeURIComponent(job.address)}&key=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}
                            alt="Street View"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                            onError={(e) => {
                              // Fallback to a placeholder if Street View fails
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          {/* Fallback/Overlay with house icon */}
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #3a5a3a 0%, #2a4a2a 100%)',
                          }}>
                            <div style={{
                              fontSize: '36px',
                            }}>
                              🏠
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Work Order Button - At top when expanded */}
                    {isExpanded && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Work Order');
                        }}
                        style={{
                          width: '100%',
                          padding: '16px',
                          backgroundColor: '#4F6A41',
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
                          marginBottom: '16px',
                        }}
                      >
                        <FileText size={20} />
                        <span>Work Order</span>
                      </button>
                    )}

                    {/* Photo Carousel with actual images - Only show when expanded and has photos */}
                    {isExpanded && job.photoCount > 0 && job.photos && (
                      <div style={{ marginBottom: '12px' }}>
                        {/* Main Photo Display */}
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenPhotos?.(job.jobId);
                          }}
                          style={{
                            position: 'relative',
                            width: '100%',
                            height: '220px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            backgroundColor: '#2D2D2D',
                            cursor: 'pointer',
                            marginBottom: '8px',
                          }}
                        >
                          {/* Actual photo image */}
                          <img 
                            src={job.photos[currentPhotoIndex[job.id] || 0]?.url}
                            alt={`${job.photos[currentPhotoIndex[job.id] || 0]?.room} - ${job.photos[currentPhotoIndex[job.id] || 0]?.phase}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />

                          {/* Navigation arrows */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const current = currentPhotoIndex[job.id] || 0;
                              const newIndex = current > 0 ? current - 1 : job.photos.length - 1;
                              setCurrentPhotoIndex(prev => ({ ...prev, [job.id]: newIndex }));
                            }}
                            style={{
                              position: 'absolute',
                              left: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(0,0,0,0.5)',
                              border: '2px solid rgba(255,255,255,0.3)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFFFFF',
                              fontSize: '20px',
                            }}
                          >
                            ‹
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const current = currentPhotoIndex[job.id] || 0;
                              const newIndex = current < job.photos.length - 1 ? current + 1 : 0;
                              setCurrentPhotoIndex(prev => ({ ...prev, [job.id]: newIndex }));
                            }}
                            style={{
                              position: 'absolute',
                              right: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(0,0,0,0.5)',
                              border: '2px solid rgba(255,255,255,0.3)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFFFFF',
                              fontSize: '20px',
                            }}
                          >
                            ›
                          </button>

                          {/* Photo info overlay */}
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: '12px',
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                          }}>
                            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
                              {job.photos[currentPhotoIndex[job.id] || 0]?.phase} • {job.photos[currentPhotoIndex[job.id] || 0]?.room}
                            </div>
                            <div style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}>
                              {job.photos[currentPhotoIndex[job.id] || 0]?.timestamp}
                            </div>
                          </div>

                          {/* Photo counter */}
                          <div style={{
                            position: 'absolute',
                            bottom: '12px',
                            right: '12px',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            color: '#FFFFFF',
                            fontSize: '13px',
                            fontWeight: '600',
                          }}>
                            {(currentPhotoIndex[job.id] || 0) + 1} / {job.photoCount}
                          </div>
                        </div>

                        {/* Thumbnail strip */}
                        <div style={{
                          display: 'flex',
                          gap: '8px',
                          overflowX: 'auto',
                          paddingBottom: '4px',
                        }}>
                          {job.photos.slice(0, 6).map((photo: any, i: number) => (
                            <div
                              key={photo.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentPhotoIndex(prev => ({ ...prev, [job.id]: i }));
                              }}
                              style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: (currentPhotoIndex[job.id] || 0) === i ? '2px solid #0F7BFF' : '2px solid transparent',
                                flexShrink: 0,
                                cursor: 'pointer',
                              }}
                            >
                              <img 
                                src={photo.url} 
                                alt={photo.room}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Take Photo Button - Blue filled */}
                    {isExpanded && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenCamera?.(job.jobId);
                        }}
                        style={{
                          width: '100%',
                          padding: '16px',
                          backgroundColor: '#0F7BFF',
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
                          marginBottom: '12px',
                        }}
                      >
                        <CameraIcon size={22} />
                        <span>Take Photo</span>
                        {job.photoCount > 0 && (
                          <span style={{
                            backgroundColor: 'rgba(255,255,255,0.25)',
                            padding: '2px 10px',
                            borderRadius: '10px',
                            fontSize: '14px',
                            marginLeft: '4px',
                          }}>
                            {job.photoCount}
                          </span>
                        )}
                      </button>
                    )}

                    {/* Job Briefing Button */}
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

                    {/* Action Buttons Grid - 3 columns: Change Order, Stain Sign Off, Notes */}
                    {isExpanded && (
                      <div onClick={(e) => e.stopPropagation()} style={{ marginTop: '4px' }}>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr',
                          gap: '12px',
                          marginBottom: '16px'
                        }}>
                          <ActionButton
                            icon={ClipboardEdit}
                            label="Change Order"
                            color="#6B5D4F"
                            onClick={() => console.log('Change Order')}
                          />
                          <ActionButton
                            icon={Edit3}
                            label="Stain Sign Off"
                            color="#9C27B0"
                            onClick={() => setStainSignOffJobId(job.id)}
                          />
                          <ActionButton
                            icon={StickyNote}
                            label="Notes"
                            color="#FBBF24"
                            onClick={() => console.log('Notes')}
                          />
                        </div>
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

                    {/* Timesheet Button - At bottom of expanded card */}
                    {isExpanded && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate?.('Time Sheet');
                        }}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          backgroundColor: '#D76A6A',
                          border: 'none',
                          borderRadius: '12px',
                          color: '#FFFFFF',
                          fontSize: '15px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          marginTop: '16px',
                        }}
                      >
                        <Clock size={20} />
                        <span>Time Sheet</span>
                        <span style={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          padding: '2px 10px',
                          borderRadius: '10px',
                          fontSize: '13px',
                          marginLeft: '4px',
                        }}>
                          {job.hoursUsed} / {job.totalHours} hrs
                        </span>
                      </button>
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

      {/* Stain Sign Off Modal */}
      {stainSignOffJobId !== null && (() => {
        const currentJob = weekSchedule.flatMap(day => day.jobs).find(job => job.id === stainSignOffJobId);
        
        if (!currentJob) return null;
        
        return (
          <StainSignOffModal
            isOpen={true}
            onClose={() => setStainSignOffJobId(null)}
            jobName={currentJob.clientName}
            colors={colors}
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
        color: '#FFFFFF',
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
          color: '#FFFFFF',
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

// Stain Sign Off Modal Component
function StainSignOffModal({ isOpen, onClose, jobName, colors }: { 
  isOpen: boolean; 
  onClose: () => void; 
  jobName: string;
  colors: any;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stainColors, setStainColors] = useState<StainColor[]>([{ color: '', percentage: 100 }]);
  const [hasSignature, setHasSignature] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [signDate, setSignDate] = useState(new Date().toISOString().split('T')[0]);
  const [sendMethod, setSendMethod] = useState<'none' | 'email' | 'text' | 'portal'>('none');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // DuraSeal stain color options
  const duraSealColors = [
    'Natural',
    'Golden Oak',
    'Golden Brown',
    'Golden Pecan',
    'Fruitwood',
    'Early American',
    'Provincial',
    'Special Walnut',
    'Dark Walnut',
    'Jacobean',
    'Ebony',
    'True Black',
    'Country White',
    'Neutral',
    'Weathered Oak',
    'Classic Gray',
    'Silvered Gray',
    'Antique Brown',
    'English Chestnut',
    'Red Mahogany',
    'Sedona Red',
    'Colonial Maple',
    'Puritan Pine',
    'Rosewood',
    'Coffee Brown',
    'Chestnut'
  ];

  const addStainColor = () => {
    if (stainColors.length < 4) {
      setStainColors([...stainColors, { color: '', percentage: 0 }]);
    }
  };

  const removeStainColor = (index: number) => {
    if (stainColors.length > 1) {
      const newColors = stainColors.filter((_, i) => i !== index);
      setStainColors(newColors);
    }
  };

  const updateStainColor = (index: number, field: 'color' | 'percentage', value: string | number) => {
    const newColors = [...stainColors];
    newColors[index] = { ...newColors[index], [field]: value };
    setStainColors(newColors);
  };

  const totalPercentage = stainColors.reduce((sum, sc) => sum + (sc.percentage || 0), 0);

  // Signature pad functions
  const startDrawing = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(true);
    setHasSignature(true);
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSubmit = () => {
    if (!hasSignature || stainColors.some(sc => !sc.color)) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #E0E0E0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#4F6A41'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Palette size={24} color="#FFFFFF" />
            <div>
              <h2 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '700', margin: 0 }}>
                Customer Stain Approval
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', margin: '2px 0 0 0' }}>
                {jobName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} color="#FFFFFF" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px'
        }}>
          {/* Main Document Text */}
          <div style={{
            backgroundColor: '#FFFDF5',
            border: '2px solid #8B7355',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#1a1a1a', fontSize: '15px', margin: '0 0 16px 0', lineHeight: '1.8', fontWeight: '500' }}>
              Stain applied to a hardwood floor is <strong style={{ fontWeight: '700', fontStyle: 'italic' }}>permanent</strong>. Hardwood is a natural product; 
              species and grain patterns will cause variation in the stain color. Please be{' '}
              <strong style={{ fontWeight: '700', fontStyle: 'italic', textDecoration: 'underline' }}>absolutely sure</strong> on the stain color you have chosen. 
              Once stain has been applied, stain color can no longer be changed without re-sanding the floor. 
              Starting completely over, re-sanding a floor, incurs additional cost.
            </p>
            <p style={{ color: '#1a1a1a', fontSize: '15px', margin: 0, lineHeight: '1.8', fontWeight: '500' }}>
              Our stain experts are happy to work with you, in choosing that special color. Up to{' '}
              <strong style={{ fontWeight: '700', fontStyle: 'italic' }}>45 minutes is included</strong> for working on stain color. Should additional time be needed, 
              the rate is <strong style={{ fontWeight: '700' }}>$75.00 per half hour</strong> (time is billed in half hour increments, although less time may be needed).
            </p>
          </div>

          {/* DuraSeal Link */}
          <a 
            href="https://www.duraseal.com/stain-gallery/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              backgroundColor: '#E3F2FD',
              borderRadius: '10px',
              color: '#1976D2',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '20px'
            }}
          >
            <ExternalLink size={18} />
            View DuraSeal Stain Gallery
          </a>

          {/* Stain Color Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              color: '#333', 
              fontSize: '14px', 
              fontWeight: '700', 
              display: 'block', 
              marginBottom: '12px' 
            }}>
              The stain color I have chosen is:
            </label>

            {stainColors.map((stainColor, index) => (
              <div key={index} style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                {/* Color Dropdown */}
                <select
                  value={stainColor.color}
                  onChange={(e) => updateStainColor(index, 'color', e.target.value)}
                  style={{
                    flex: 2,
                    padding: '12px',
                    backgroundColor: '#F5F5F5',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    color: '#333',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select stain color...</option>
                  {duraSealColors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                  <option value="custom">Custom Mix</option>
                </select>

                {/* Percentage Input */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#F5F5F5',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  padding: '0 12px',
                  flex: 1
                }}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={stainColor.percentage}
                    onChange={(e) => updateStainColor(index, 'percentage', parseInt(e.target.value) || 0)}
                    style={{
                      width: '50px',
                      padding: '12px 0',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#333',
                      fontSize: '14px',
                      textAlign: 'center'
                    }}
                  />
                  <span style={{ color: '#666', fontSize: '14px' }}>%</span>
                </div>

                {/* Remove Button */}
                {stainColors.length > 1 && (
                  <button
                    onClick={() => removeStainColor(index)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: '#FFEBEE',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Trash2 size={18} color="#D32F2F" />
                  </button>
                )}
              </div>
            ))}

            {/* Total Percentage Indicator */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '8px',
              padding: '8px 12px',
              backgroundColor: totalPercentage === 100 ? '#E8F5E9' : '#FFF3E0',
              borderRadius: '8px'
            }}>
              <span style={{ 
                color: totalPercentage === 100 ? '#2E7D32' : '#E65100', 
                fontSize: '13px',
                fontWeight: '600'
              }}>
                Total: {totalPercentage}%
              </span>
              {totalPercentage !== 100 && (
                <span style={{ color: '#E65100', fontSize: '12px' }}>
                  Must equal 100%
                </span>
              )}
            </div>

            {/* Add Color Button */}
            {stainColors.length < 4 && (
              <button
                onClick={addStainColor}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  backgroundColor: 'transparent',
                  border: '1px dashed #9E9E9E',
                  borderRadius: '8px',
                  color: '#666',
                  fontSize: '13px',
                  cursor: 'pointer',
                  marginTop: '10px',
                  width: '100%',
                  justifyContent: 'center'
                }}
              >
                <Plus size={16} />
                Add Another Color
              </button>
            )}
          </div>

          {/* Approval Statement */}
          <div style={{
            backgroundColor: '#F5F5F5',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <p style={{ 
              color: '#333', 
              fontSize: '14px', 
              margin: 0, 
              lineHeight: '1.6'
            }}>
              I have approved the stain color listed above.
            </p>
          </div>

          {/* Date */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              color: '#333', 
              fontSize: '13px', 
              fontWeight: '600', 
              display: 'block', 
              marginBottom: '6px' 
            }}>
              Date
            </label>
            <input
              type="date"
              value={signDate}
              onChange={(e) => setSignDate(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#F5F5F5',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                color: '#333',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Signature Pad */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '8px' 
            }}>
              <label style={{ color: '#333', fontSize: '13px', fontWeight: '600' }}>
                Customer Signature
              </label>
              {hasSignature && (
                <button
                  onClick={clearSignature}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#F5F5F5',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#666',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Clear
                </button>
              )}
            </div>
            <canvas
              ref={canvasRef}
              width={400}
              height={120}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              style={{
                width: '100%',
                height: '120px',
                backgroundColor: '#FFFFFF',
                border: '2px solid #E0E0E0',
                borderRadius: '10px',
                cursor: 'crosshair',
                touchAction: 'none'
              }}
            />
            {!hasSignature && (
              <p style={{ 
                color: '#9E9E9E', 
                fontSize: '12px', 
                textAlign: 'center', 
                margin: '8px 0 0 0' 
              }}>
                Sign above with your finger or mouse
              </p>
            )}
          </div>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '24px 0',
            gap: '12px'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E0E0E0' }} />
            <span style={{ color: '#666', fontSize: '12px', fontWeight: '600' }}>OR SEND TO CUSTOMER</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E0E0E0' }} />
          </div>

          {/* Send Options */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              color: '#333', 
              fontSize: '14px', 
              fontWeight: '700', 
              display: 'block', 
              marginBottom: '12px' 
            }}>
              Send for Customer Signature
            </label>

            {/* Send Method Buttons */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '10px',
              marginBottom: '16px'
            }}>
              <button
                onClick={() => setSendMethod(sendMethod === 'email' ? 'none' : 'email')}
                style={{
                  padding: '14px 12px',
                  backgroundColor: sendMethod === 'email' ? '#1976D2' : '#F5F5F5',
                  border: sendMethod === 'email' ? '2px solid #1976D2' : '2px solid #E0E0E0',
                  borderRadius: '10px',
                  color: sendMethod === 'email' ? '#FFFFFF' : '#333',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ fontSize: '20px' }}>📧</span>
                Email
              </button>

              <button
                onClick={() => setSendMethod(sendMethod === 'text' ? 'none' : 'text')}
                style={{
                  padding: '14px 12px',
                  backgroundColor: sendMethod === 'text' ? '#4CAF50' : '#F5F5F5',
                  border: sendMethod === 'text' ? '2px solid #4CAF50' : '2px solid #E0E0E0',
                  borderRadius: '10px',
                  color: sendMethod === 'text' ? '#FFFFFF' : '#333',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ fontSize: '20px' }}>💬</span>
                Text
              </button>

              <button
                onClick={() => setSendMethod(sendMethod === 'portal' ? 'none' : 'portal')}
                style={{
                  padding: '14px 12px',
                  backgroundColor: sendMethod === 'portal' ? '#9C27B0' : '#F5F5F5',
                  border: sendMethod === 'portal' ? '2px solid #9C27B0' : '2px solid #E0E0E0',
                  borderRadius: '10px',
                  color: sendMethod === 'portal' ? '#FFFFFF' : '#333',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ fontSize: '20px' }}>🌐</span>
                Portal
              </button>
            </div>

            {/* Email Input */}
            {sendMethod === 'email' && (
              <div style={{ marginBottom: '12px' }}>
                <label style={{ color: '#666', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                  Customer Email Address
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="customer@email.com"
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #1976D2',
                    borderRadius: '8px',
                    color: '#333',
                    fontSize: '14px'
                  }}
                />
              </div>
            )}

            {/* Phone Input */}
            {sendMethod === 'text' && (
              <div style={{ marginBottom: '12px' }}>
                <label style={{ color: '#666', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                  Customer Phone Number
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #4CAF50',
                    borderRadius: '8px',
                    color: '#333',
                    fontSize: '14px'
                  }}
                />
              </div>
            )}

            {/* Portal Info */}
            {sendMethod === 'portal' && (
              <div style={{
                padding: '12px',
                backgroundColor: '#F3E5F5',
                borderRadius: '8px',
                border: '1px solid #CE93D8'
              }}>
                <p style={{ color: '#7B1FA2', fontSize: '13px', margin: 0 }}>
                  A link will be sent to the customer's portal where they can review and sign the stain approval form.
                </p>
              </div>
            )}

            {/* Send Button */}
            {sendMethod !== 'none' && (
              <button
                onClick={() => {
                  if (stainColors.some(sc => !sc.color) || totalPercentage !== 100) return;
                  if (sendMethod === 'email' && !customerEmail) return;
                  if (sendMethod === 'text' && !customerPhone) return;
                  
                  setIsSending(true);
                  setTimeout(() => {
                    setIsSending(false);
                    setSentSuccess(true);
                    setTimeout(() => setSentSuccess(false), 3000);
                  }, 1500);
                }}
                disabled={
                  stainColors.some(sc => !sc.color) || 
                  totalPercentage !== 100 || 
                  isSending ||
                  (sendMethod === 'email' && !customerEmail) ||
                  (sendMethod === 'text' && !customerPhone)
                }
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: isSending ? '#9E9E9E' : sentSuccess ? '#4CAF50' : 
                    sendMethod === 'email' ? '#1976D2' : 
                    sendMethod === 'text' ? '#4CAF50' : '#9C27B0',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: isSending ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '12px'
                }}
              >
                {isSending ? (
                  'Sending...'
                ) : sentSuccess ? (
                  <>
                    <Check size={18} />
                    Sent Successfully!
                  </>
                ) : (
                  <>
                    {sendMethod === 'email' && '📧 Send via Email'}
                    {sendMethod === 'text' && '💬 Send via Text'}
                    {sendMethod === 'portal' && '🌐 Send to Portal'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #E0E0E0',
          backgroundColor: '#FAFAFA'
        }}>
          <button
            onClick={handleSubmit}
            disabled={!hasSignature || stainColors.some(sc => !sc.color) || totalPercentage !== 100 || isSubmitting}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: (hasSignature && !stainColors.some(sc => !sc.color) && totalPercentage === 100 && !isSubmitting) 
                ? '#4F6A41' 
                : '#E0E0E0',
              border: 'none',
              borderRadius: '12px',
              color: (hasSignature && !stainColors.some(sc => !sc.color) && totalPercentage === 100 && !isSubmitting) 
                ? '#FFFFFF' 
                : '#9E9E9E',
              fontSize: '16px',
              fontWeight: '700',
              cursor: (hasSignature && !stainColors.some(sc => !sc.color) && totalPercentage === 100 && !isSubmitting) 
                ? 'pointer' 
                : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {isSubmitting ? (
              'Submitting...'
            ) : (
              <>
                <Check size={20} />
                Submit Stain Approval
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
