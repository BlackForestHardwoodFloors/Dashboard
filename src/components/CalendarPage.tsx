import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Home, 
  Plus,
  Menu
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { SidebarEnhanced } from './SidebarEnhanced';
import AppointmentModal from './AppointmentModal';
import CalendarJobCard from './CalendarJobCard';
import JobDetailDrawer from './JobDetailDrawer';

type CalendarView = '1-week' | '2-week' | '3-week' | '1-month';

interface Job {
  id: string;
  title: string;
  clientName: string;
  address: string;
  startDate: Date;
  endDate: Date;
  foreman: 'Chase' | 'Tony' | 'Alex' | 'Anthony' | 'Jerry';
  progress: number;
  p4pStatus: 'ahead' | 'on-track' | 'behind';
  jobType: 'Install' | 'Sand/Finish' | 'Recoat' | 'Repair' | 'Estimate';
}

const FOREMAN_COLORS = {
  Chase: '#9B59B6',
  Tony: '#6E8B3D',
  Alex: '#3B9CAA',
  Anthony: '#4F6A41',
  Jerry: '#E67E22'
};

const JOB_TYPE_COLORS = {
  Install: '#6E8B3D',
  'Sand/Finish': '#4F6A41',
  Recoat: '#7BAA8E',
  Repair: '#8F6E59',
  Estimate: '#C9A049'
};

// Mock data
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Anderson Residence - Main Floor Refinish',
    clientName: 'Anderson, Lisa & John',
    address: '1234 Sunset Blvd, Spokane, WA',
    startDate: new Date(2025, 10, 18),
    endDate: new Date(2025, 10, 20),
    foreman: 'Chase',
    progress: 65,
    p4pStatus: 'ahead',
    jobType: 'Sand/Finish'
  },
  {
    id: '2',
    title: 'Summit Builders - Lot 14 Install',
    clientName: 'Summit Builders, Inc.',
    address: '789 River View Dr, Spokane Valley, WA',
    startDate: new Date(2025, 10, 19),
    endDate: new Date(2025, 10, 21),
    foreman: 'Tony',
    progress: 40,
    p4pStatus: 'on-track',
    jobType: 'Install'
  },
  {
    id: '3',
    title: 'Johnson Home - Kitchen Recoat',
    clientName: 'Johnson, Sarah',
    address: '456 Oak Street, Spokane, WA',
    startDate: new Date(2025, 10, 17),
    endDate: new Date(2025, 10, 17),
    foreman: 'Alex',
    progress: 100,
    p4pStatus: 'ahead',
    jobType: 'Recoat'
  },
  {
    id: '4',
    title: 'Martinez Estate - 5-Day Full Install',
    clientName: 'Martinez, Carlos & Maria',
    address: '2345 Pine Ridge Court, Spokane, WA',
    startDate: new Date(2025, 10, 24),
    endDate: new Date(2025, 10, 28),
    foreman: 'Anthony',
    progress: 0,
    p4pStatus: 'on-track',
    jobType: 'Install'
  },
  {
    id: '5',
    title: 'Thompson Residence - Stair Repair',
    clientName: 'Thompson, Jennifer',
    address: '678 Maple Avenue, Spokane, WA',
    startDate: new Date(2025, 10, 21),
    endDate: new Date(2025, 10, 21),
    foreman: 'Jerry',
    progress: 0,
    p4pStatus: 'on-track',
    jobType: 'Repair'
  },
  {
    id: '6',
    title: 'Riverside Plaza - Commercial Install',
    clientName: 'Riverside Development LLC',
    address: '1500 Riverside Dr, Spokane, WA',
    startDate: new Date(2025, 10, 25),
    endDate: new Date(2025, 10, 29),
    foreman: 'Chase',
    progress: 15,
    p4pStatus: 'on-track',
    jobType: 'Install'
  },
  {
    id: '7',
    title: 'Williams Home - Living Room Sand/Finish',
    clientName: 'Williams, Robert',
    address: '890 Cedar Lane, Spokane Valley, WA',
    startDate: new Date(2025, 10, 22),
    endDate: new Date(2025, 10, 23),
    foreman: 'Tony',
    progress: 0,
    p4pStatus: 'on-track',
    jobType: 'Sand/Finish'
  },
  {
    id: '8',
    title: 'Davis Estimate - New Construction',
    clientName: 'Davis, Michael',
    address: '3421 Oak Hill Drive, Spokane, WA',
    startDate: new Date(2025, 10, 20),
    endDate: new Date(2025, 10, 20),
    foreman: 'Alex',
    progress: 0,
    p4pStatus: 'on-track',
    jobType: 'Estimate'
  }
];

export default function CalendarPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [view, setView] = useState<CalendarView>('2-week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [jobs] = useState<Job[]>(mockJobs);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate dates to display based on view
  const getDisplayDates = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay()); // Start on Sunday

    const days = view === '1-week' ? 7 : view === '2-week' ? 14 : view === '3-week' ? 21 : 35;
    const dates = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const displayDates = getDisplayDates();
  const weeksToShow = view === '1-week' ? 1 : view === '2-week' ? 2 : view === '3-week' ? 3 : 5;

  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === '1-month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (view === '1-month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  const formatMonthYear = () => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getJobsForDate = (date: Date) => {
    return jobs.filter(job => {
      const jobStart = new Date(job.startDate);
      const jobEnd = new Date(job.endDate);
      jobStart.setHours(0, 0, 0, 0);
      jobEnd.setHours(0, 0, 0, 0);
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      
      return checkDate >= jobStart && checkDate <= jobEnd;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsDrawerOpen(true);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#1A1A1A', overflow: 'hidden' }}>
      {/* Mobile Sidebar Overlay */}
      {isMobile && showMobileSidebar && (
        <>
          {/* Backdrop */}
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 999,
              backdropFilter: 'blur(4px)'
            }}
            onClick={() => setShowMobileSidebar(false)}
          />
          {/* Sidebar Drawer */}
          <div style={{
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            width: '280px',
            zIndex: 1000,
            transform: showMobileSidebar ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease'
          }}>
            <SidebarEnhanced 
              activePage="Calendar" 
              darkMode={true} 
              onNavigate={(page) => {
                setShowMobileSidebar(false);
                onNavigate?.(page);
              }} 
            />
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <SidebarEnhanced activePage="Calendar" darkMode={true} onNavigate={onNavigate} />
      )}

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: isMobile ? '0' : '160px',
        backgroundColor: '#0D0D0D',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: isMobile ? '16px' : '24px 32px',
          borderBottom: '1px solid #2D2D2D',
          backgroundColor: '#1A1A1A'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: isMobile ? '16px' : '20px',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              {/* Mobile Menu Button */}
              {isMobile && (
                <button
                  onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                  style={{
                    width: '44px',
                    height: '44px',
                    backgroundColor: '#C9A049',
                    border: 'none',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  <Menu style={{ width: '24px', height: '24px', color: 'white' }} />
                </button>
              )}
              <div>
                <h1 style={{ color: '#FFFFFF', fontSize: isMobile ? '20px' : '28px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                  Calendar
                </h1>
                {!isMobile && (
                  <p style={{ color: '#A0A0A0', fontSize: '14px', margin: 0 }}>
                    Schedule appointments, manage jobs, and track crew assignments
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: '#C9A049',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 0 0 #A88438CC, 0 6px 12px rgba(201,160,73,0.3)',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#D9B563';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#C9A049';
              }}
            >
              <Plus size={18} />
              New Appointment
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px',
          padding: '32px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#3B9CAA22',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CalendarIcon size={40} color="#3B9CAA" />
          </div>
          <h2 style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            Calendar View Coming Soon
          </h2>
          <p style={{ color: '#A0A0A0', fontSize: '14px', margin: 0, textAlign: 'center', maxWidth: '400px' }}>
            The calendar grid is being redesigned. Click "New Appointment" to schedule jobs and appointments.
          </p>
        </div>

        {/* Appointment Modal */}
        <AppointmentModal
          isOpen={isAppointmentModalOpen}
          onClose={() => setIsAppointmentModalOpen(false)}
          onSave={() => {
            setIsAppointmentModalOpen(false);
            // Handle save
          }}
        />

        {/* Job Detail Drawer */}
        <JobDetailDrawer
          isOpen={isDrawerOpen}
          job={selectedJob}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedJob(null);
          }}
        />
      </div>
    </div>
  );
}