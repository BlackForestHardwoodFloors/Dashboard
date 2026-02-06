// src/components/employee-portal/screens/MyJobScreen.tsx

import React, { useState } from 'react';
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Lightbulb,
  Phone,
  MessageSquare,
  Navigation,
  FileText,
  Camera as CameraIcon,
  StickyNote,
  Edit3,
  ClipboardEdit,
  Image as ImageIcon,
  ChevronRight,
  ChevronLeft,
  User,
  ExternalLink,
  Clock
} from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { ChangeOrderModal } from './ChangeOrderModal';
import StainSignOffModal, { StainSignOffPayload } from './StainSignOffModal';
import { MeScreen } from './MeScreen';

type Tab = 'jobs' | 'photos' | 'messages' | 'me';

interface MyJobScreenProps {
  onOpenCamera?: (jobId?: string) => void;
  onOpenPhotos?: (jobId?: string) => void;
  onTabChange?: (tab: Tab) => void;
  onNavigate?: (page: string) => void;
}

export function MyJobScreen({ onOpenCamera, onOpenPhotos, onTabChange, onNavigate }: MyJobScreenProps) {
  const { colors, employeeColor } = useTheme();

  // ✅ Local view switch so "Me" button opens MeScreen.tsx WITHOUT remounting the component
  const [activeView, setActiveView] = useState<'jobs' | 'me'>('jobs');

  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);
  const [briefingJobId, setBriefingJobId] = useState<number | null>(null);
  const [changeOrderJobId, setChangeOrderJobId] = useState<number | null>(null);
  const [stainSignOffJobId, setStainSignOffJobId] = useState<number | null>(null);
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

  // ✅ Hover overlay for quick buttons
  const [hoverQuickBtn, setHoverQuickBtn] = useState<string | null>(null);

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
          briefing:
            'Install red oak hardwood in living room and hallway. Client prefers darker stain (Jacobean). Watch for uneven subfloor near fireplace - may need additional leveling compound. Client works from home, so minimize noise before 9 AM. Two cats in home - keep doors closed.',
          photoCount: 6,
          photos: [
            { id: 'p1', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', timestamp: 'Today 2:30 PM', phase: 'Install', room: 'Living Room' },
            { id: 'p2', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400', timestamp: 'Today 11:15 AM', phase: 'Install', room: 'Living Room' },
            { id: 'p3', url: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=400', timestamp: 'Today 9:00 AM', phase: 'Install', room: 'Hallway' },
            { id: 'p4', url: 'https://images.unsplash.com/photo-1560185008-b033106af5c3?w=400', timestamp: 'Yesterday 4:30 PM', phase: 'Sanding', room: 'Living Room' },
            { id: 'p5', url: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400', timestamp: 'Yesterday 2:00 PM', phase: 'Before', room: 'Hallway' },
            { id: 'p6', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', timestamp: 'Mon 10:30 AM', phase: 'Before', room: 'Living Room' }
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
  const TIME_SHEET_RED = '#B42318';

  // ✅ Job Briefing Royal Blue
  const JOB_BRIEFING_BLUE = '#2A74FF';
  const JOB_BRIEFING_BLUE_HOVER = '#1F5FE0';

  // ✅ Top-row Messages button color
  const TOP_MESSAGES_BTN = '#5B7BB5';

  // ✅ Phone button bg (darker portion)
  const PHONE_BTN_BG = '#474350';

  // ✅ Accent (Boardroom-friendly teal)
  const BOARDROOM_TEAL = '#1F8A8A';
  const BOARDROOM_TEAL_BORDER = 'rgba(31, 138, 138, 0.55)';

  // Reusable hover darken handlers (for buttons + clickable rows)
  const hoverDarkenOn = (e: React.MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.filter = 'brightness(0.92)';
  };
  const hoverDarkenOff = (e: React.MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.filter = 'brightness(1)';
  };

  // ✅ If we're on the Me screen, render it and stop here
  if (activeView === 'me') {
    return <MeScreen onBack={() => setActiveView('jobs')} />;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors.background,
        paddingBottom: '100px' // Space for bottom navigation
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px',
          paddingTop: 'max(20px, env(safe-area-inset-top))',
          backgroundColor: colors.backgroundSecondary,
          borderBottom: `1px solid ${colors.border}`,
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* Welcome Message */}
          <div style={{ marginBottom: '16px' }}>
            <h1
              style={{
                color: colors.text,
                fontSize: '24px',
                fontWeight: '700',
                margin: '0 0 4px 0'
              }}
            >
              Welcome back, {employeeData.name.split(' ')[0]}
            </h1>

            <div style={{ color: employeeColor, fontSize: '15px', fontWeight: '600' }}>{employeeData.todaysDate}</div>
          </div>

          {/* ✅ Quick Navigation Buttons - Top Row (Me left, Messages middle, Photos right) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '10px',
              marginBottom: '10px'
            }}
          >
            {/* ✅ Me - left (LOCAL ONLY so it won't remount MyJobScreen) */}
            <button
              onClick={() => {
                setActiveView('me');
              }}
              onMouseEnter={() => setHoverQuickBtn('top-me')}
              onMouseLeave={() => setHoverQuickBtn(null)}
              style={{
                padding: '9px 8px',
                backgroundColor: BOARDROOM_TEAL,
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0,0,0,0.25)',
                  opacity: hoverQuickBtn === 'top-me' ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                  pointerEvents: 'none'
                }}
              />
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                <User size={20} />
                <span style={{ fontSize: '11px', fontWeight: '700' }}>Me</span>
              </div>
            </button>

            {/* Messages - middle */}
            <button
              onClick={() => onTabChange?.('messages')}
              onMouseEnter={() => setHoverQuickBtn('top-messages')}
              onMouseLeave={() => setHoverQuickBtn(null)}
              style={{
                padding: '9px 8px',
                backgroundColor: TOP_MESSAGES_BTN,
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0,0,0,0.25)',
                  opacity: hoverQuickBtn === 'top-messages' ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                  pointerEvents: 'none'
                }}
              />
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                <MessageSquare size={20} />
                <span style={{ fontSize: '11px', fontWeight: '700' }}>Messages</span>
              </div>

              {/* Notification dot */}
              <div
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '12px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#DC2626',
                  border: '2px solid #9C27B0',
                  zIndex: 2
                }}
              />
            </button>

            {/* ✅ Photos - right (GOES TO ADMIN PHOTOS PAGE) */}
            <button
              onClick={() => onNavigate?.('Photos')}
              onMouseEnter={() => setHoverQuickBtn('top-photos')}
              onMouseLeave={() => setHoverQuickBtn(null)}
              style={{
                padding: '9px 8px',
                backgroundColor: COMPANYCAM_BLUE,
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0,0,0,0.25)',
                  opacity: hoverQuickBtn === 'top-photos' ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                  pointerEvents: 'none'
                }}
              />
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                <ImageIcon size={20} />
                <span style={{ fontSize: '11px', fontWeight: '700' }}>Photos</span>
              </div>
            </button>
          </div>

          {/* ✅ Second Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <button
              onClick={() => onNavigate?.('P4P Growth')}
              onMouseEnter={() => setHoverQuickBtn('row2-p4p')}
              onMouseLeave={() => setHoverQuickBtn(null)}
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
                gap: '3px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0,0,0,0.25)',
                  opacity: hoverQuickBtn === 'row2-p4p' ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                  pointerEvents: 'none'
                }}
              />
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <DollarSign size={18} />
                  <TrendingUp size={14} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700' }}>P4P & Growth</span>
              </div>
            </button>

            <button
              onClick={() => onNavigate?.('Calendar')}
              onMouseEnter={() => setHoverQuickBtn('row2-calendar')}
              onMouseLeave={() => setHoverQuickBtn(null)}
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
                gap: '3px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0,0,0,0.25)',
                  opacity: hoverQuickBtn === 'row2-calendar' ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                  pointerEvents: 'none'
                }}
              />
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                <Calendar size={20} />
                <span style={{ fontSize: '11px', fontWeight: '700' }}>Calendar</span>
              </div>
            </button>

            <button
              onClick={() => onNavigate?.('Time Sheet')}
              onMouseEnter={() => setHoverQuickBtn('row2-timesheet')}
              onMouseLeave={() => setHoverQuickBtn(null)}
              style={{
                padding: '9px 8px',
                backgroundColor: TIME_SHEET_RED,
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(140, 12, 9, 0.28)',
                  opacity: hoverQuickBtn === 'row2-timesheet' ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                  pointerEvents: 'none'
                }}
              />
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                <Clock size={20} />
                <span style={{ fontSize: '11px', fontWeight: '700' }}>Time Sheet</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px 20px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2
            style={{
              color: colors.text,
              fontSize: '22px',
              fontWeight: '700',
              margin: '0 0 20px 0'
            }}
          >
            Your Week ({weekSchedule.reduce((acc, day) => acc + day.jobs.length, 0)} Jobs)
          </h2>

          {weekSchedule.map((day, dayIndex) => (
            <div key={dayIndex} style={{ marginBottom: '32px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                  paddingBottom: '8px',
                  borderBottom: day.isToday ? `3px solid ${BOARDROOM_TEAL}` : '2px solid #2A2A2A'
                }}
              >
                <h3 style={{ color: day.isToday ? BOARDROOM_TEAL : '#FFFFFF', fontSize: '18px', fontWeight: '700', margin: 0 }}>{day.date}</h3>
                {day.isToday && (
                  <span
                    style={{
                      backgroundColor: 'rgba(31,138,138,0.18)',
                      color: '#FFFFFF',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '700',
                      border: `1px solid ${BOARDROOM_TEAL_BORDER}`
                    }}
                  >
                    TODAY
                  </span>
                )}
                <span style={{ color: '#666666', fontSize: '14px', marginLeft: 'auto' }}>
                  {day.jobs.length} {day.jobs.length === 1 ? 'job' : 'jobs'}
                </span>
              </div>

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
                        border: job.status === 'In Progress' ? `2px solid ${BOARDROOM_TEAL_BORDER}` : '1px solid #2A2A2A',
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
                      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <h3 style={{ color: colors.text, fontSize: '22px', fontWeight: '700', margin: 0, flex: 1 }}>{job.clientName}</h3>

                            {/* ✅ CHANGE: Message button now matches TOP center Messages button color */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onTabChange?.('messages');
                              }}
                              onMouseEnter={hoverDarkenOn}
                              onMouseLeave={hoverDarkenOff}
                              style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '10px',
                                backgroundColor: TOP_MESSAGES_BTN, // ✅ MATCHED
                                border: 'none', // ✅ cleaner when using colored BG
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 2px 10px rgba(91, 123, 181, 0.35)',
                                flexShrink: 0,
                                transition: 'filter 0.2s ease'
                              }}
                            >
                              <MessageSquare size={20} color="#FFFFFF" /> {/* ✅ white icon on colored bg */}
                            </button>

                            {/* Phone button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `tel:${job.phoneNumber}`;
                              }}
                              onMouseEnter={hoverDarkenOn}
                              onMouseLeave={hoverDarkenOff}
                              style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '10px',
                                backgroundColor: PHONE_BTN_BG,
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 2px 10px rgba(71, 67, 80, 0.35)',
                                flexShrink: 0,
                                transition: 'filter 0.2s ease'
                              }}
                            >
                              <Phone size={20} color="#FFFFFF" />
                            </button>
                          </div>

                          {/* Address */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`https://maps.google.com/?q=${encodeURIComponent(job.address)}`, '_blank');
                            }}
                            onMouseEnter={hoverDarkenOn}
                            onMouseLeave={hoverDarkenOff}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer',
                              padding: '10px 12px',
                              backgroundColor: 'rgba(66, 133, 244, 0.1)',
                              borderRadius: '10px',
                              border: '1px solid rgba(66, 133, 244, 0.3)',
                              transition: 'filter 0.2s ease'
                            }}
                          >
                            <Navigation size={16} color="#4285F4" style={{ flexShrink: 0 }} />
                            <span style={{ color: '#4285F4', fontSize: '14px', fontWeight: '600', flex: 1, lineHeight: '1.3' }}>{job.address}</span>
                            <ExternalLink size={14} color="#4285F4" />
                          </div>
                        </div>

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
                            backgroundColor: '#1a3d1a'
                          }}
                        >
                          <img
                            src={`https://maps.googleapis.com/maps/api/streetview?size=220x200&location=${encodeURIComponent(job.address)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
                            alt="Property"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              target.parentElement!.innerHTML =
                                '<div style="width:100%;height:100%;background:linear-gradient(135deg, #2d5016 0%, #1a3d1a 50%, #0d2d0d 100%);display:flex;align-items:center;justify-content:center"><span style="font-size:24px">🏠</span></div>';
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <span style={{ backgroundColor: BOARDROOM_TEAL, color: '#fff', padding: '5px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '700' }}>
                          {job.jobType}
                        </span>
                        {job.sqft > 0 && <span style={{ color: colors.textSecondary, fontSize: '14px', fontWeight: '600' }}>{job.sqft.toLocaleString()} sq ft</span>}
                      </div>

                      {/* Expanded: Work Order + Timesheet button */}
                      {isExpanded && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Work Order');
                            }}
                            onMouseEnter={hoverDarkenOn}
                            onMouseLeave={hoverDarkenOff}
                            style={{
                              width: '100%',
                              padding: '14px',
                              backgroundColor: BOARDROOM_TEAL,
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
                              marginBottom: '10px',
                              boxShadow: '0 4px 12px rgba(31, 138, 138, 0.28)',
                              transition: 'filter 0.2s ease'
                            }}
                          >
                            <FileText size={20} />
                            Work Order
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate?.('Time Sheet');
                            }}
                            onMouseEnter={hoverDarkenOn}
                            onMouseLeave={hoverDarkenOff}
                            style={{
                              width: '100%',
                              padding: '14px',
                              backgroundColor: TIME_SHEET_RED,
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
                              boxShadow: '0 4px 12px rgba(200, 93, 93, 0.28)',
                              transition: 'filter 0.2s ease'
                            }}
                          >
                            <Clock size={20} />
                            Time Sheet
                          </button>
                        </>
                      )}

                      {/* Photo Carousel */}
                      {isExpanded && job.photos && job.photos.length > 0 && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: '100%',
                            marginBottom: '12px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            backgroundColor: '#1A1A1A'
                          }}
                        >
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
                                objectFit: 'cover'
                              }}
                            />

                            <div
                              style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '60px',
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                pointerEvents: 'none'
                              }}
                            />

                            <div
                              style={{
                                position: 'absolute',
                                bottom: '10px',
                                left: '12px',
                                right: '12px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end'
                              }}
                            >
                              <div>
                                <div style={{ fontSize: '11px', color: '#aaa' }}>
                                  {job.photos[carouselIndex[job.id] || 0]?.phase} • {(job.photos[carouselIndex[job.id] || 0] as any)?.room || ''}
                                </div>
                                <div style={{ fontSize: '13px', color: '#fff', fontWeight: '600' }}>{job.photos[carouselIndex[job.id] || 0]?.timestamp}</div>
                              </div>
                              <div
                                style={{
                                  backgroundColor: 'rgba(0,0,0,0.6)',
                                  padding: '4px 10px',
                                  borderRadius: '10px',
                                  fontSize: '12px',
                                  color: '#fff',
                                  fontWeight: '600'
                                }}
                              >
                                {(carouselIndex[job.id] || 0) + 1} / {job.photos.length}
                              </div>
                            </div>

                            {job.photos.length > 1 && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCarouselIndex((prev) => ({
                                      ...prev,
                                      [job.id]: (prev[job.id] || 0) === 0 ? job.photos!.length - 1 : (prev[job.id] || 0) - 1
                                    }));
                                  }}
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
                                    justifyContent: 'center'
                                  }}
                                >
                                  <ChevronLeft size={20} color="#fff" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCarouselIndex((prev) => ({
                                      ...prev,
                                      [job.id]: (prev[job.id] || 0) === job.photos!.length - 1 ? 0 : (prev[job.id] || 0) + 1
                                    }));
                                  }}
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
                                    justifyContent: 'center'
                                  }}
                                >
                                  <ChevronRight size={20} color="#fff" />
                                </button>
                              </>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: '6px', padding: '10px', overflowX: 'auto' }}>
                            {job.photos.map((photo, idx) => (
                              <button
                                key={photo.id}
                                onClick={() => setCarouselIndex((prev) => ({ ...prev, [job.id]: idx }))}
                                style={{
                                  width: '48px',
                                  height: '48px',
                                  borderRadius: '8px',
                                  overflow: 'hidden',
                                  border: (carouselIndex[job.id] || 0) === idx ? `2px solid ${COMPANYCAM_BLUE}` : '2px solid transparent',
                                  padding: 0,
                                  cursor: 'pointer',
                                  flexShrink: 0,
                                  opacity: (carouselIndex[job.id] || 0) === idx ? 1 : 0.5
                                }}
                              >
                                <img src={photo.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Take Photo */}
                      {isExpanded && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenCamera?.(job.jobId);
                          }}
                          onMouseEnter={hoverDarkenOn}
                          onMouseLeave={hoverDarkenOff}
                          style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: COMPANYCAM_BLUE,
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
                            transition: 'filter 0.2s ease'
                          }}
                        >
                          <CameraIcon size={20} />
                          <span style={{ fontWeight: '700', fontSize: '15px' }}>Take Photo</span>
                          {(job.photos?.length || job.photoCount) > 0 && (
                            <span
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                padding: '3px 10px',
                                borderRadius: '10px',
                                fontSize: '12px'
                              }}
                            >
                              {job.photos?.length || job.photoCount}
                            </span>
                          )}
                        </button>
                      )}

                      {/* Job Briefing */}
                      {isExpanded && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setBriefingJobId(job.id);
                          }}
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            backgroundColor: JOB_BRIEFING_BLUE,
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
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = JOB_BRIEFING_BLUE_HOVER;
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = JOB_BRIEFING_BLUE;
                          }}
                        >
                          <div
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              height: '50%',
                              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%)',
                              pointerEvents: 'none'
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              width: '8px',
                              height: '8px',
                              backgroundColor: '#FF3B30',
                              borderRadius: '50%',
                              border: '2px solid #fff'
                            }}
                          />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1 }}>
                            <Lightbulb size={18} fill="#FFD700" />
                            <span style={{ fontWeight: '700', fontSize: '15px' }}>Job Briefing</span>
                          </div>
                          <ChevronRight size={20} style={{ zIndex: 1 }} />
                        </button>
                      )}

                      {isExpanded && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            gap: '10px',
                            marginBottom: '16px'
                          }}
                        >
                          <ActionButton icon={ClipboardEdit} label="Change Order" color="#6B5D4F" onClick={() => setChangeOrderJobId(job.id)} />
                          <ActionButton icon={Edit3} label="Stain Sign Off" color="#8B5CF6" onClick={() => setStainSignOffJobId(job.id)} />
                          <ActionButton icon={StickyNote} label="Notes" color="#FBBF24" onClick={() => console.log('Notes')} />
                        </div>
                      )}

                      {job.status === 'In Progress' && (
                        <div
                          style={{ marginTop: isExpanded ? '0' : '12px', position: 'relative' }}
                          onMouseEnter={() => setHoveredProgressJobId(job.id)}
                          onMouseLeave={() => setHoveredProgressJobId(null)}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ color: '#888', fontSize: '12px', fontWeight: '600' }}>Progress</span>
                            <span style={{ color: BOARDROOM_TEAL, fontSize: '12px', fontWeight: '700' }}>{job.jobCompletePercent}%</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', backgroundColor: '#2A2A2A', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{ width: `${job.jobCompletePercent}%`, height: '100%', backgroundColor: BOARDROOM_TEAL, borderRadius: '10px' }} />
                          </div>

                          {hoveredProgressJobId === job.id && (
                            <div
                              style={{
                                position: 'absolute',
                                bottom: '100%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                marginBottom: '12px',
                                backgroundColor: colors.backgroundSecondary,
                                border: `2px solid ${BOARDROOM_TEAL}`,
                                borderRadius: '12px',
                                padding: '12px 16px',
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                                zIndex: 1000,
                                minWidth: '180px',
                                pointerEvents: 'none'
                              }}
                            >
                              <div
                                style={{
                                  position: 'absolute',
                                  bottom: '-10px',
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  width: 0,
                                  height: 0,
                                  borderLeft: '10px solid transparent',
                                  borderRight: '10px solid transparent',
                                  borderTop: `10px solid ${BOARDROOM_TEAL}`
                                }}
                              />
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ color: '#888', fontSize: '12px' }}>Total Hours:</span>
                                  <span style={{ color: colors.text, fontSize: '13px', fontWeight: '700' }}>{job.totalHours} hrs</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ color: '#888', fontSize: '12px' }}>Hours Used:</span>
                                  <span style={{ color: BOARDROOM_TEAL, fontSize: '13px', fontWeight: '700' }}>{job.hoursUsed} hrs</span>
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
      {briefingJobId !== null &&
        (() => {
          const currentJob = weekSchedule.flatMap((day) => day.jobs).find((job) => job.id === briefingJobId);
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
      {changeOrderJobId !== null &&
        (() => {
          const currentJob = weekSchedule.flatMap((day) => day.jobs).find((job) => job.id === changeOrderJobId);
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

      {/* Stain Sign Off Modal */}
      {stainSignOffJobId !== null &&
        (() => {
          const currentJob = weekSchedule.flatMap((day) => day.jobs).find((job) => job.id === stainSignOffJobId);
          if (!currentJob) return null;

          return (
            <StainSignOffModal
              isOpen={true}
              onClose={() => setStainSignOffJobId(null)}
              jobName={currentJob.clientName}
              colors={colors}
              onSend={(payload: StainSignOffPayload) => {
                console.log('✅ Stain Sign Off Submitted', {
                  jobId: currentJob.jobId,
                  clientName: currentJob.clientName,
                  payload
                });
              }}
            />
          );
        })()}

      {/* Full Screen Street View */}
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
            padding: '20px'
          }}
        >
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
              justifyContent: 'center'
            }}
          >
            ✕
          </button>

          <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: '700', marginBottom: '8px', textAlign: 'center' }}>{fullScreenStreetView.clientName}</h2>

          <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>{fullScreenStreetView.address}</p>

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
              position: 'relative'
            }}
          >
            <img
              src={`https://maps.googleapis.com/maps/api/streetview?size=600x600&location=${encodeURIComponent(fullScreenStreetView.address)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
              alt="Property Street View"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '16px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Navigation size={20} color="#4285F4" />
              <span style={{ color: '#fff', fontSize: '16px', fontWeight: '600' }}>Tap to navigate</span>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Photo */}
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
            flexDirection: 'column'
          }}
        >
          <div
            style={{
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(0,0,0,0.8)',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10
            }}
          >
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
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
              <div>
                <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: '700', margin: 0 }}>{fullScreenPhoto.clientName}</h3>
                <p style={{ color: '#888', fontSize: '12px', margin: '2px 0 0 0' }}>
                  {fullScreenPhoto.photo.phase} • {(fullScreenPhoto.photo as any).room || ''} • {fullScreenPhoto.photo.timestamp}
                </p>
              </div>
            </div>

            {canApproveForPortal && (
              <label
                title="Check to share with client"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  backgroundColor: approvedPhotos[fullScreenPhoto.photo.id] ? 'rgba(31, 138, 138, 0.25)' : 'rgba(255,255,255,0.1)',
                  padding: '8px 14px',
                  borderRadius: '20px',
                  border: approvedPhotos[fullScreenPhoto.photo.id] ? `2px solid ${BOARDROOM_TEAL}` : '2px solid transparent'
                }}
              >
                <input
                  type="checkbox"
                  checked={approvedPhotos[fullScreenPhoto.photo.id] || false}
                  onChange={() => {
                    setApprovedPhotos((prev) => ({
                      ...prev,
                      [fullScreenPhoto.photo.id]: !prev[fullScreenPhoto.photo.id]
                    }));
                  }}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: BOARDROOM_TEAL,
                    cursor: 'pointer'
                  }}
                />
                <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>Share with Client</span>
              </label>
            )}
          </div>

          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              cursor: photoZoom > 1 ? 'grab' : 'zoom-in'
            }}
            onClick={() => setPhotoZoom((z) => (z === 1 ? 2 : 1))}
            onWheel={(e) => {
              e.preventDefault();
              const delta = e.deltaY > 0 ? -0.2 : 0.2;
              setPhotoZoom((prev) => Math.max(1, Math.min(4, prev + delta)));
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
                transform: `scale(${photoZoom > 1 ? 1 : 1})`
              }}
            />

            {fullScreenPhoto.allPhotos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoZoom(1);
                    const newIndex = fullScreenPhoto.currentIndex === 0 ? fullScreenPhoto.allPhotos.length - 1 : fullScreenPhoto.currentIndex - 1;
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
                    justifyContent: 'center'
                  }}
                >
                  <ChevronLeft size={32} color="#fff" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoZoom(1);
                    const newIndex = fullScreenPhoto.currentIndex === fullScreenPhoto.allPhotos.length - 1 ? 0 : fullScreenPhoto.currentIndex + 1;
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
                    justifyContent: 'center'
                  }}
                >
                  <ChevronRight size={32} color="#fff" />
                </button>
              </>
            )}

            <div
              style={{
                position: 'absolute',
                bottom: '80px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0,0,0,0.6)',
                padding: '8px 16px',
                borderRadius: '20px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {fullScreenPhoto.currentIndex + 1} / {fullScreenPhoto.allPhotos.length}
            </div>

            {photoZoom > 1 && (
              <div
                style={{
                  position: 'absolute',
                  top: '80px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              >
                {Math.round(photoZoom * 100)}% - Click to reset
              </div>
            )}
          </div>

          <div
            style={{
              padding: '14px 20px',
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Open annotation tool for photo:', fullScreenPhoto.photo.id);
              }}
              style={{
                padding: '14px 28px',
                backgroundColor: COMPANYCAM_BLUE,
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <Edit3 size={20} />
              Annotate
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                const note = prompt('Add note for this photo:', photoNotes[fullScreenPhoto.photo.id] || '');
                if (note !== null) setPhotoNotes((prev) => ({ ...prev, [fullScreenPhoto.photo.id]: note }));
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
                position: 'relative'
              }}
            >
              <StickyNote size={20} />
              Notes
              {photoNotes[fullScreenPhoto.photo.id] && (
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#DC2626',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    border: '2px solid #FBBF24'
                  }}
                />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.backgroundSecondary,
          borderTop: `1px solid ${colors.border}`,
          padding: '10px 14px',
          paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
          zIndex: 200
        }}
      >
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          <BottomNavButton label="Jobs" icon={FileText} onClick={() => onTabChange?.('jobs')} />
          <BottomNavButton label="Photos" icon={ImageIcon} onClick={() => onNavigate?.('Photos')} />
          <BottomNavButton label="Messages" icon={MessageSquare} onClick={() => onTabChange?.('messages')} />
          <BottomNavButton label="Me" icon={User} onClick={() => setActiveView('me')} />
        </div>
      </div>
    </div>
  );
}

/** Minimal Job Briefing Modal so this file is truly complete */
function JobBriefingModal({
  isOpen,
  onClose,
  clientName,
  address,
  jobType,
  sqft,
  startDate,
  completionDate,
  briefing
}: {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  address: string;
  jobType: string;
  sqft: number;
  startDate: string;
  completionDate: string;
  briefing: string;
}) {
  const { colors } = useTheme();
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '620px',
          borderRadius: '16px',
          backgroundColor: colors.backgroundSecondary,
          border: `1px solid ${colors.border}`,
          boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '16px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: colors.text, fontSize: '18px', fontWeight: 800 }}>{clientName}</div>
            <div style={{ color: colors.textSecondary, fontSize: '13px', marginTop: '2px' }}>{address}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.background,
              color: colors.text,
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 800
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
            <span style={{ backgroundColor: '#1F8A8A', color: '#fff', padding: '6px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 800 }}>{jobType}</span>
            {sqft > 0 && (
              <span style={{ backgroundColor: '#1F1F1F', color: colors.text, padding: '6px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 800, border: `1px solid ${colors.border}` }}>
                {sqft.toLocaleString()} sq ft
              </span>
            )}
            <span style={{ backgroundColor: '#1F1F1F', color: colors.textSecondary, padding: '6px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, border: `1px solid ${colors.border}` }}>
              Start: {startDate}
            </span>
            <span style={{ backgroundColor: '#1F1F1F', color: colors.textSecondary, padding: '6px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, border: `1px solid ${colors.border}` }}>
              Finish: {completionDate}
            </span>
          </div>

          <div style={{ color: colors.text, fontWeight: 900, marginBottom: '8px' }}>Briefing</div>
          <div style={{ color: colors.textSecondary, lineHeight: 1.5, fontSize: '14px', whiteSpace: 'pre-wrap' }}>{briefing}</div>
        </div>
      </div>
    </div>
  );
}

// Action Button Component (with darken-on-hover)
function ActionButton({
  icon: Icon,
  label,
  color,
  onClick,
  badge
}: {
  icon: any;
  label: string;
  color: string;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(0.92)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)';
      }}
      style={{
        width: '100%',
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
        position: 'relative',
        transition: 'filter 0.2s ease'
      }}
    >
      <Icon size={22} color={label === 'Notes' ? '#000000' : '#FFFFFF'} />
      <span style={{ color: label === 'Notes' ? '#000000' : '#FFFFFF' }}>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            padding: '2px 6px',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: '700'
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function BottomNavButton({
  label,
  icon: Icon,
  onClick
}: {
  label: string;
  icon: any;
  onClick: () => void;
}) {
  const { colors } = useTheme();
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        backgroundColor: 'transparent',
        border: 'none',
        color: colors.text,
        cursor: 'pointer',
        padding: '8px 6px',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px'
      }}
    >
      <Icon size={20} />
      <span style={{ fontSize: '11px', fontWeight: 700, opacity: 0.9 }}>{label}</span>
    </button>
  );
}
