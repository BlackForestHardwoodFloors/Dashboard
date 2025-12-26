import { Calendar, DollarSign, TrendingUp, Lightbulb, MapPin, Phone, Clock, MessageSquare, Navigation, FileText, Camera as CameraIcon, StickyNote, Edit3, ClipboardEdit, Timer, Image as ImageIcon, ChevronRight, ChevronLeft, Briefcase, User, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../ThemeProvider';
import { ChangeOrderModal } from './ChangeOrderModal';

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
  const [changeOrderJobId, setChangeOrderJobId] = useState<number | null>(null);
  const [hoveredProgressJobId, setHoveredProgressJobId] = useState<number | null>(null);
  const [carouselIndex, setCarouselIndex] = useState<{ [jobId: number]: number }>({});
  const [fullScreenStreetView, setFullScreenStreetView] = useState<{ address: string; clientName: string } | null>(null);
  const [fullScreenPhoto, setFullScreenPhoto] = useState<{ 
    photo: { id: string; url: string; timestamp: string; phase: string; room?: string };
    jobId: string;
    clientName: string;
    allPhotos: any[];
    currentIndex: number;
  } | null>(null);
  const [photoNotes, setPhotoNotes] = useState<{ [photoId: string]: string }>({});
  const [approvedPhotos, setApprovedPhotos] = useState<{ [photoId: string]: boolean }>({});
  const [photoZoom, setPhotoZoom] = useState(1);
  
  // Employee setting - would come from user settings in real app
  const canApproveForPortal = true; // Set to false to hide approval option

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
          jobId: 'job-001',
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
          photoCount: 6,
          photos: [
            { id: 'p1', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', timestamp: 'Today 2:30 PM', phase: 'Install', room: 'Living Room' },
            { id: 'p2', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400', timestamp: 'Today 11:15 AM', phase: 'Install', room: 'Living Room' },
            { id: 'p3', url: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=400', timestamp: 'Today 9:00 AM', phase: 'Install', room: 'Hallway' },
            { id: 'p4', url: 'https://images.unsplash.com/photo-1560185008-b033106af5c3?w=400', timestamp: 'Yesterday 4:30 PM', phase: 'Sanding', room: 'Living Room' },
            { id: 'p5', url: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400', timestamp: 'Yesterday 2:00 PM', phase: 'Before', room: 'Hallway' },
            { id: 'p6', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', timestamp: 'Mon 10:30 AM', phase: 'Before', room: 'Living Room' },
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
                padding: '9px 8px',
                backgroundColor: '#6B7B4A',
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <Briefcase size={20} />
              <span style={{ fontSize: '11px', fontWeight: '700' }}>Jobs</span>
            </button>

            <button
              onClick={() => onNavigate?.('Photos')}
              style={{
                padding: '9px 8px',
                backgroundColor: '#0F7BFF',
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <ImageIcon size={20} />
              <span style={{ fontSize: '11px', fontWeight: '700' }}>Photos</span>
            </button>

            <button
              onClick={() => onTabChange?.('messages')}
              style={{
                padding: '9px 8px',
                backgroundColor: '#5B7BB5',
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
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
                padding: '9px 8px',
                backgroundColor: '#4F6A41',
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px'
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
                padding: '9px 8px',
                backgroundColor: '#3B9CAA',
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <Calendar size={20} />
              <span style={{ fontSize: '11px', fontWeight: '700' }}>Calendar</span>
            </button>

            <button
              onClick={() => onNavigate?.('P4P')}
              style={{
                padding: '9px 8px',
                backgroundColor: '#D4A024',
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
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
                    {/* Header with Map spanning both rows */}
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      marginBottom: '12px',
                    }}>
                      {/* Left side: Name + Phone, then Address */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {/* Row 1: Client Name + Phone */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <h3 style={{
                            color: colors.text,
                            fontSize: '22px',
                            fontWeight: '700',
                            margin: 0,
                            flex: 1
                          }}>
                            {job.clientName}
                          </h3>
                          
                          {/* Message Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Message');
                            }}
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '10px',
                              backgroundColor: '#3B9CAA',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(59, 156, 170, 0.3)',
                              flexShrink: 0
                            }}
                          >
                            <MessageSquare size={20} color="#FFFFFF" />
                          </button>

                          {/* Call Client Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `tel:${job.phoneNumber}`;
                            }}
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '10px',
                              backgroundColor: '#4F6A41',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(79, 106, 65, 0.3)',
                              flexShrink: 0
                            }}
                          >
                            <Phone size={20} color="#FFFFFF" />
                          </button>
                        </div>

                        {/* Row 2: Address */}
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://maps.google.com/?q=${encodeURIComponent(job.address)}`, '_blank');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            padding: '10px 12px',
                            backgroundColor: 'rgba(66, 133, 244, 0.1)',
                            borderRadius: '10px',
                            border: '1px solid rgba(66, 133, 244, 0.3)',
                          }}
                        >
                          <Navigation size={16} color="#4285F4" style={{ flexShrink: 0 }} />
                          <span style={{
                            color: '#4285F4',
                            fontSize: '14px',
                            fontWeight: '600',
                            flex: 1,
                            lineHeight: '1.3'
                          }}>
                            {job.address}
                          </span>
                          <ExternalLink size={14} color="#4285F4" />
                        </div>
                      </div>
                      
                      {/* Right side: Google Street View Thumbnail - spans both rows */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setFullScreenStreetView({ address: job.address, clientName: job.clientName });
                        }}
                        style={{
                          width: '110px',
                          alignSelf: 'stretch',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: '2px solid #4285F4',
                          flexShrink: 0,
                          backgroundColor: '#1a3d1a',
                        }}
                      >
                        <img 
                          src={`https://maps.googleapis.com/maps/api/streetview?size=220x200&location=${encodeURIComponent(job.address)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
                          alt="Property"
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover' 
                          }}
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = '<div style="width:100%;height:100%;background:linear-gradient(135deg, #2d5016 0%, #1a3d1a 50%, #0d2d0d 100%);display:flex;align-items:center;justify-content:center"><span style="font-size:24px">🏠</span></div>';
                          }}
                        />
                      </div>
                    </div>

                    {/* Row 3: Job Type & Square Footage */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '12px'
                    }}>
                      <span style={{
                        backgroundColor: '#4F6A41',
                        color: '#fff',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '700'
                      }}>
                        {job.jobType}
                      </span>
                      {job.sqft > 0 && (
                        <span style={{
                          color: colors.textSecondary,
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>
                          {job.sqft.toLocaleString()} sq ft
                        </span>
                      )}
                    </div>

                    {/* Row 4: Work Order Button - Only when expanded */}
                    {isExpanded && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Work Order');
                        }}
                        style={{
                          width: '100%',
                          padding: '14px',
                          backgroundColor: '#4F6A41',
                          border: 'none',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '15px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          marginBottom: '16px',
                          boxShadow: '0 4px 12px rgba(79, 106, 65, 0.3)'
                        }}
                      >
                        <FileText size={20} />
                        Work Order
                      </button>
                    )}

                    {/* Row 5: Photo Carousel - Only when expanded and has photos */}
                    {isExpanded && job.photos && job.photos.length > 0 && (
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: '100%',
                          marginBottom: '12px',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          backgroundColor: '#1A1A1A',
                        }}
                      >
                        {/* Main Photo */}
                        <div 
                          style={{ position: 'relative', width: '100%', height: '180px', cursor: 'pointer' }}
                          onClick={() => {
                            const currentIdx = carouselIndex[job.id] || 0;
                            setFullScreenPhoto({
                              photo: job.photos[currentIdx],
                              jobId: job.jobId,
                              clientName: job.clientName,
                              allPhotos: job.photos,
                              currentIndex: currentIdx
                            });
                          }}
                        >
                          <img
                            src={job.photos[carouselIndex[job.id] || 0]?.url}
                            alt="Job photo"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          
                          {/* Gradient overlay */}
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '60px',
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                            pointerEvents: 'none',
                          }} />
                          
                          {/* Photo info */}
                          <div style={{
                            position: 'absolute',
                            bottom: '10px',
                            left: '12px',
                            right: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                          }}>
                            <div>
                              <div style={{ fontSize: '11px', color: '#aaa' }}>
                                {job.photos[carouselIndex[job.id] || 0]?.phase} • {(job.photos[carouselIndex[job.id] || 0] as any)?.room || ''}
                              </div>
                              <div style={{ fontSize: '13px', color: '#fff', fontWeight: '600' }}>
                                {job.photos[carouselIndex[job.id] || 0]?.timestamp}
                              </div>
                            </div>
                            <div style={{
                              backgroundColor: 'rgba(0,0,0,0.6)',
                              padding: '4px 10px',
                              borderRadius: '10px',
                              fontSize: '12px',
                              color: '#fff',
                              fontWeight: '600',
                            }}>
                              {(carouselIndex[job.id] || 0) + 1} / {job.photos.length}
                            </div>
                          </div>
                          
                          {/* Navigation Arrows */}
                          {job.photos.length > 1 && (
                            <>
                              <button
                                onClick={() => setCarouselIndex(prev => ({
                                  ...prev,
                                  [job.id]: (prev[job.id] || 0) === 0 ? job.photos!.length - 1 : (prev[job.id] || 0) - 1
                                }))}
                                style={{
                                  position: 'absolute',
                                  left: '8px',
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  width: '34px',
                                  height: '34px',
                                  borderRadius: '50%',
                                  backgroundColor: 'rgba(0,0,0,0.5)',
                                  border: 'none',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <ChevronLeft size={20} color="#fff" />
                              </button>
                              <button
                                onClick={() => setCarouselIndex(prev => ({
                                  ...prev,
                                  [job.id]: (prev[job.id] || 0) === job.photos!.length - 1 ? 0 : (prev[job.id] || 0) + 1
                                }))}
                                style={{
                                  position: 'absolute',
                                  right: '8px',
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  width: '34px',
                                  height: '34px',
                                  borderRadius: '50%',
                                  backgroundColor: 'rgba(0,0,0,0.5)',
                                  border: 'none',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <ChevronRight size={20} color="#fff" />
                              </button>
                            </>
                          )}
                        </div>
                        
                        {/* Thumbnail strip */}
                        <div style={{
                          display: 'flex',
                          gap: '6px',
                          padding: '10px',
                          overflowX: 'auto',
                        }}>
                          {job.photos.map((photo, idx) => (
                            <button
                              key={photo.id}
                              onClick={() => setCarouselIndex(prev => ({ ...prev, [job.id]: idx }))}
                              style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: (carouselIndex[job.id] || 0) === idx ? '2px solid #0F7BFF' : '2px solid transparent',
                                padding: 0,
                                cursor: 'pointer',
                                flexShrink: 0,
                                opacity: (carouselIndex[job.id] || 0) === idx ? 1 : 0.5,
                              }}
                            >
                              <img
                                src={photo.url}
                                alt=""
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Take Photo Button - Only when expanded */}
                    {isExpanded && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenCamera?.(job.jobId);
                        }}
                        style={{
                          width: '100%',
                          padding: '14px',
                          backgroundColor: '#0F7BFF',
                          border: 'none',
                          borderRadius: '12px',
                          color: '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          marginBottom: '16px',
                          boxShadow: '0 4px 12px rgba(15, 123, 255, 0.3)',
                        }}
                      >
                        <CameraIcon size={20} />
                        <span style={{ fontWeight: '700', fontSize: '15px' }}>Take Photo</span>
                        {(job.photos?.length || job.photoCount) > 0 && (
                          <span style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            padding: '3px 10px',
                            borderRadius: '10px',
                            fontSize: '12px',
                          }}>
                            {job.photos?.length || job.photoCount}
                          </span>
                        )}
                      </button>
                    )}

                    {/* Job Briefing - Only when expanded */}
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
                          border: 'none',
                          borderRadius: '12px',
                          color: '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '16px',
                          position: 'relative',
                          overflow: 'hidden',
                          boxShadow: '0 4px 12px rgba(42, 116, 255, 0.3)',
                        }}
                      >
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '50%',
                          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%)',
                          pointerEvents: 'none',
                        }} />
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#FF3B30',
                          borderRadius: '50%',
                          border: '2px solid #fff',
                        }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1 }}>
                          <Lightbulb size={18} fill="#FFD700" />
                          <span style={{ fontWeight: '700', fontSize: '15px' }}>Job Briefing</span>
                        </div>
                        <ChevronRight size={20} style={{ zIndex: 1 }} />
                      </button>
                    )}

                    {/* Action Buttons - 3 buttons - Only when expanded */}
                    {isExpanded && (
                      <div onClick={(e) => e.stopPropagation()} style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '10px',
                        marginBottom: '16px'
                      }}>
                        <ActionButton
                          icon={ClipboardEdit}
                          label="Change Order"
                          color="#6B5D4F"
                          onClick={() => setChangeOrderJobId(job.id)}
                        />
                        <ActionButton
                          icon={Edit3}
                          label="Stain Sign Off"
                          color="#8B5CF6"
                          onClick={() => console.log('Stain Sign Off')}
                        />
                        <ActionButton
                          icon={StickyNote}
                          label="Notes"
                          color="#FBBF24"
                          onClick={() => console.log('Notes')}
                        />
                      </div>
                    )}

                    {/* Progress Bar - Always visible for In Progress jobs */}
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
                          marginBottom: '6px'
                        }}>
                          <span style={{ color: '#888', fontSize: '12px', fontWeight: '600' }}>
                            Progress
                          </span>
                          <span style={{ color: '#4F6A41', fontSize: '12px', fontWeight: '700' }}>
                            {job.jobCompletePercent}%
                          </span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '8px',
                          backgroundColor: '#2A2A2A',
                          borderRadius: '10px',
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${job.jobCompletePercent}%`,
                            height: '100%',
                            backgroundColor: '#4F6A41',
                            borderRadius: '10px',
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
                            minWidth: '180px',
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
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#888', fontSize: '12px' }}>Total Hours:</span>
                                <span style={{ color: colors.text, fontSize: '13px', fontWeight: '700' }}>{job.totalHours} hrs</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#888', fontSize: '12px' }}>Hours Used:</span>
                                <span style={{ color: '#4F6A41', fontSize: '13px', fontWeight: '700' }}>{job.hoursUsed} hrs</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#888', fontSize: '12px' }}>Remaining:</span>
                                <span style={{ color: employeeColor, fontSize: '13px', fontWeight: '700' }}>{job.remainingHours} hrs</span>
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

      {/* Change Order Modal */}
      {changeOrderJobId !== null && (() => {
        const currentJob = weekSchedule.flatMap(day => day.jobs).find(job => job.id === changeOrderJobId);
        
        if (!currentJob) return null;
        
        return (
          <ChangeOrderModal
            isOpen={true}
            onClose={() => setChangeOrderJobId(null)}
            jobName={currentJob.clientName}
            clientName={currentJob.clientName}
            clientPhone={currentJob.phoneNumber}
            address={currentJob.address}
            city="Spokane Valley"
            state="WA"
            zip="99037"
            scheduledDate={currentJob.startDate}
          />
        );
      })()}

      {/* Fullscreen Street View Modal */}
      {fullScreenStreetView && (
        <div
          onClick={() => setFullScreenStreetView(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFullScreenStreetView(null);
            }}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: '#fff',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>

          {/* Client name */}
          <h2 style={{
            color: '#fff',
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '8px',
            textAlign: 'center',
          }}>
            {fullScreenStreetView.clientName}
          </h2>

          {/* Address */}
          <p style={{
            color: '#aaa',
            fontSize: '14px',
            marginBottom: '20px',
            textAlign: 'center',
          }}>
            {fullScreenStreetView.address}
          </p>

          {/* Large Street View Image - clickable to route */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://maps.google.com/?q=${encodeURIComponent(fullScreenStreetView.address)}`, '_blank');
            }}
            style={{
              width: '100%',
              maxWidth: '600px',
              height: '60vh',
              borderRadius: '16px',
              overflow: 'hidden',
              cursor: 'pointer',
              border: '3px solid #4285F4',
              position: 'relative',
            }}
          >
            <img
              src={`https://maps.googleapis.com/maps/api/streetview?size=600x600&location=${encodeURIComponent(fullScreenStreetView.address)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
              alt="Property Street View"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            
            {/* Tap to navigate overlay */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}>
              <Navigation size={20} color="#4285F4" />
              <span style={{ color: '#fff', fontSize: '16px', fontWeight: '600' }}>
                Tap to navigate
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Photo Modal */}
      {fullScreenPhoto && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#000',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(0,0,0,0.8)',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => {
                  setFullScreenPhoto(null);
                  setPhotoZoom(1);
                }}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
              <div>
                <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: '700', margin: 0 }}>
                  {fullScreenPhoto.clientName}
                </h3>
                <p style={{ color: '#888', fontSize: '12px', margin: '2px 0 0 0' }}>
                  {fullScreenPhoto.photo.phase} • {(fullScreenPhoto.photo as any).room || ''} • {fullScreenPhoto.photo.timestamp}
                </p>
              </div>
            </div>

            {/* Share with Client Checkbox */}
            {canApproveForPortal && (
              <label
                title="Check to share with client"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  backgroundColor: approvedPhotos[fullScreenPhoto.photo.id] ? 'rgba(79, 106, 65, 0.3)' : 'rgba(255,255,255,0.1)',
                  padding: '8px 14px',
                  borderRadius: '20px',
                  border: approvedPhotos[fullScreenPhoto.photo.id] ? '2px solid #4F6A41' : '2px solid transparent',
                }}
              >
                <input
                  type="checkbox"
                  checked={approvedPhotos[fullScreenPhoto.photo.id] || false}
                  onChange={() => {
                    setApprovedPhotos(prev => ({
                      ...prev,
                      [fullScreenPhoto.photo.id]: !prev[fullScreenPhoto.photo.id]
                    }));
                  }}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: '#4F6A41',
                    cursor: 'pointer',
                  }}
                />
                <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>
                  Share with Client
                </span>
              </label>
            )}
          </div>

          {/* Main Photo Area - Full Screen */}
          <div 
            style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              overflow: 'hidden',
              cursor: photoZoom > 1 ? 'grab' : 'zoom-in',
            }}
            onClick={() => {
              if (photoZoom === 1) {
                setPhotoZoom(2);
              } else {
                setPhotoZoom(1);
              }
            }}
            onWheel={(e) => {
              e.preventDefault();
              const delta = e.deltaY > 0 ? -0.2 : 0.2;
              setPhotoZoom(prev => Math.max(1, Math.min(4, prev + delta)));
            }}
          >
            <img
              src={fullScreenPhoto.photo.url}
              alt="Photo"
              style={{
                maxWidth: photoZoom === 1 ? '95%' : 'none',
                maxHeight: photoZoom === 1 ? '85vh' : 'none',
                width: photoZoom > 1 ? `${photoZoom * 100}%` : 'auto',
                objectFit: 'contain',
                transition: 'transform 0.2s ease',
                transform: `scale(${photoZoom > 1 ? 1 : 1})`,
              }}
            />

            {/* Navigation arrows */}
            {fullScreenPhoto.allPhotos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoZoom(1);
                    const newIndex = fullScreenPhoto.currentIndex === 0 
                      ? fullScreenPhoto.allPhotos.length - 1 
                      : fullScreenPhoto.currentIndex - 1;
                    setFullScreenPhoto({
                      ...fullScreenPhoto,
                      photo: fullScreenPhoto.allPhotos[newIndex],
                      currentIndex: newIndex
                    });
                  }}
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ChevronLeft size={32} color="#fff" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoZoom(1);
                    const newIndex = fullScreenPhoto.currentIndex === fullScreenPhoto.allPhotos.length - 1 
                      ? 0 
                      : fullScreenPhoto.currentIndex + 1;
                    setFullScreenPhoto({
                      ...fullScreenPhoto,
                      photo: fullScreenPhoto.allPhotos[newIndex],
                      currentIndex: newIndex
                    });
                  }}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ChevronRight size={32} color="#fff" />
                </button>
              </>
            )}

            {/* Photo counter */}
            <div style={{
              position: 'absolute',
              bottom: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: '8px 16px',
              borderRadius: '20px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
            }}>
              {fullScreenPhoto.currentIndex + 1} / {fullScreenPhoto.allPhotos.length}
            </div>

            {/* Zoom indicator */}
            {photoZoom > 1 && (
              <div style={{
                position: 'absolute',
                top: '80px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0,0,0,0.6)',
                padding: '6px 12px',
                borderRadius: '20px',
                color: '#fff',
                fontSize: '12px',
              }}>
                {Math.round(photoZoom * 100)}% - Click to reset
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div style={{
            padding: '14px 20px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}>
            {/* Annotate Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Open annotation tool for photo:', fullScreenPhoto.photo.id);
              }}
              style={{
                padding: '14px 28px',
                backgroundColor: '#0F7BFF',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <Edit3 size={20} />
              Annotate
            </button>

            {/* Notes Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const note = prompt('Add note for this photo:', photoNotes[fullScreenPhoto.photo.id] || '');
                if (note !== null) {
                  setPhotoNotes(prev => ({ ...prev, [fullScreenPhoto.photo.id]: note }));
                }
              }}
              style={{
                padding: '14px 28px',
                backgroundColor: '#FBBF24',
                border: 'none',
                borderRadius: '12px',
                color: '#000',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                position: 'relative',
              }}
            >
              <StickyNote size={20} />
              Notes
              {photoNotes[fullScreenPhoto.photo.id] && (
                <span style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#DC2626',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  border: '2px solid #FBBF24',
                }} />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Action Button Component
function ActionButton({ icon: Icon, label, color, onClick, badge }: { icon: any, label: string, color: string, onClick: () => void, badge?: number }) {
  const { colors } = useTheme();
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
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
