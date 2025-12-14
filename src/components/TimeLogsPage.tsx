import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Columns, 
  Plus, 
  Eye, 
  Pencil, 
  Trash2, 
  Calendar,
  Image as ImageIcon,
  X,
  CheckCheck,
  Menu
} from 'lucide-react';
import { Sidebar } from './Sidebar';

// Types
type LogType = 'Regular' | 'Overtime' | 'Sick';
type ApprovalStatus = 'Pending' | 'Approved';
type WorkCategory = 'Project Logs' | 'General Logs';
type ViewMode = 'Week' | 'Month' | 'Year';

interface TimeLog {
  id: string;
  employeeName: string;
  employeeAvatar: string;
  employeeRole: string;
  photoCount: number;
  jobName: string;
  startTime: string;
  endTime: string;
  breakTime: string;
  totalHours: string;
  logType: LogType;
  approvalStatus: ApprovalStatus;
  workCategory: WorkCategory;
  date: string;
}

// Plastic Pill Component
const PlasticPill = ({ 
  text, 
  variant 
}: { 
  text: string; 
  variant: 'pending' | 'approved' | 'regular' | 'overtime' | 'sick' | 'project' | 'general' 
}) => {
  const styles: Record<typeof variant, { base: string; hover: string; active: string }> = {
    pending: { base: '#F4B400', hover: '#FFD75C', active: '#C89200' },
    approved: { base: '#4CAF50', hover: '#66BB6A', active: '#388E3C' },
    regular: { base: '#3E7BE0', hover: '#5596FF', active: '#2D5CAC' },
    overtime: { base: '#D9534F', hover: '#E5736F', active: '#B63F3A' },
    sick: { base: '#C5407E', hover: '#D9649A', active: '#A53566' },
    project: { base: '#3E6A50', hover: '#4F8563', active: '#2D5039' },
    general: { base: '#51405B', hover: '#685371', active: '#3D2F45' }
  };

  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const currentColor = pressed 
    ? styles[variant].active 
    : hovered 
    ? styles[variant].hover 
    : styles[variant].base;

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        color: '#FFFFFF',
        backgroundColor: currentColor,
        boxShadow: pressed 
          ? `inset 0 2px 4px rgba(0,0,0,0.3)` 
          : `0 3px 0 0 ${currentColor}CC, 0 4px 8px rgba(0,0,0,0.2)`,
        position: 'relative',
        top: pressed ? '2px' : '0',
        transition: 'all 0.15s',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      }}
    >
      {text}
    </span>
  );
};

// Add Time Log Button Component
const AddTimeLogButton = () => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 24px',
        backgroundColor: pressed ? '#B63F3A' : hovered ? '#E5736F' : '#D9534F',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: pressed 
          ? 'inset 0 2px 4px rgba(0,0,0,0.3)' 
          : '0 4px 0 0 #B63F3ACC, 0 6px 12px rgba(217,83,79,0.3)',
        position: 'relative',
        top: pressed ? '3px' : '0',
        transition: 'all 0.15s'
      }}
    >
      <Plus size={18} />
      <span>Add Time Log</span>
    </button>
  );
};

// Approve Selected Button Component
const ApproveSelectedButton = ({ count, onClick }: { count: number; onClick: () => void }) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 24px',
        backgroundColor: pressed ? '#B38A1C' : hovered ? '#E5C95C' : '#D4A024',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: pressed 
          ? 'inset 0 2px 4px rgba(0,0,0,0.3)' 
          : '0 4px 0 0 #B38A1CCC, 0 6px 12px rgba(212,160,36,0.3)',
        position: 'relative',
        top: pressed ? '3px' : '0',
        transition: 'all 0.15s'
      }}
    >
      <CheckCheck size={18} />
      <span>Approve Selected ({count})</span>
    </button>
  );
};

// Main Time Logs Page Component
export default function TimeLogsPage({
  darkMode = true,
  onNavigate
}: {
  darkMode?: boolean;
  onNavigate?: (page: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewingPhotos, setViewingPhotos] = useState<{ employeeName: string; photos: string[]; } | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('Week');
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [selectedLogs, setSelectedLogs] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Add refs for scroll synchronization
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync scroll between header and content
  const handleHeaderScroll = () => {
    if (headerScrollRef.current && contentScrollRef.current) {
      contentScrollRef.current.scrollLeft = headerScrollRef.current.scrollLeft;
    }
  };

  const handleContentScroll = () => {
    if (headerScrollRef.current && contentScrollRef.current) {
      headerScrollRef.current.scrollLeft = contentScrollRef.current.scrollLeft;
    }
  };

  // Sample data
  const timeLogs: TimeLog[] = [
    {
      id: '1',
      employeeName: 'Michael Rodriguez',
      employeeAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      employeeRole: 'Lead Installer',
      photoCount: 24,
      jobName: 'Oakwood Kitchen Remodel',
      startTime: '8:00 AM',
      endTime: '5:30 PM',
      breakTime: '30 min',
      totalHours: '9.0 hrs',
      logType: 'Regular',
      approvalStatus: 'Approved',
      workCategory: 'Project Logs',
      date: 'Friday, November 7, 2025'
    },
    {
      id: '2',
      employeeName: 'Sarah Chen',
      employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      employeeRole: 'Project Manager',
      photoCount: 18,
      jobName: 'Downtown Office Flooring',
      startTime: '7:30 AM',
      endTime: '6:00 PM',
      breakTime: '45 min',
      totalHours: '9.75 hrs',
      logType: 'Overtime',
      approvalStatus: 'Pending',
      workCategory: 'Project Logs',
      date: 'Friday, November 7, 2025'
    },
    {
      id: '3',
      employeeName: 'James Thompson',
      employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      employeeRole: 'Floor Technician',
      photoCount: 12,
      jobName: 'Maintenance & Repairs',
      startTime: '9:00 AM',
      endTime: '3:00 PM',
      breakTime: '0 min',
      totalHours: '6.0 hrs',
      logType: 'Sick',
      approvalStatus: 'Approved',
      workCategory: 'General Logs',
      date: 'Friday, November 7, 2025'
    },
    {
      id: '4',
      employeeName: 'Emily Davis',
      employeeAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      employeeRole: 'Senior Installer',
      photoCount: 31,
      jobName: 'Riverside Home Hardwood',
      startTime: '8:00 AM',
      endTime: '5:00 PM',
      breakTime: '30 min',
      totalHours: '8.5 hrs',
      logType: 'Regular',
      approvalStatus: 'Approved',
      workCategory: 'Project Logs',
      date: 'Thursday, November 6, 2025'
    },
    {
      id: '5',
      employeeName: 'Carlos Martinez',
      employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      employeeRole: 'Assistant',
      photoCount: 15,
      jobName: 'Hillside Luxury Vinyl',
      startTime: '7:00 AM',
      endTime: '7:00 PM',
      breakTime: '1 hr',
      totalHours: '11.0 hrs',
      logType: 'Overtime',
      approvalStatus: 'Pending',
      workCategory: 'Project Logs',
      date: 'Thursday, November 6, 2025'
    },
    {
      id: '6',
      employeeName: 'Lisa Anderson',
      employeeAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
      employeeRole: 'Quality Inspector',
      photoCount: 9,
      jobName: 'Equipment Inventory',
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      breakTime: '30 min',
      totalHours: '7.5 hrs',
      logType: 'Regular',
      approvalStatus: 'Approved',
      workCategory: 'General Logs',
      date: 'Thursday, November 6, 2025'
    },
    {
      id: '7',
      employeeName: 'David Kim',
      employeeAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
      employeeRole: 'Lead Installer',
      photoCount: 28,
      jobName: 'Maple Street Refinishing',
      startTime: '8:30 AM',
      endTime: '6:00 PM',
      breakTime: '45 min',
      totalHours: '8.75 hrs',
      logType: 'Regular',
      approvalStatus: 'Approved',
      workCategory: 'Project Logs',
      date: 'Wednesday, November 5, 2025'
    },
    {
      id: '8',
      employeeName: 'Jessica Wu',
      employeeAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      employeeRole: 'Senior Installer',
      photoCount: 22,
      jobName: 'Corporate Lobby Installation',
      startTime: '7:00 AM',
      endTime: '4:30 PM',
      breakTime: '30 min',
      totalHours: '9.0 hrs',
      logType: 'Regular',
      approvalStatus: 'Approved',
      workCategory: 'Project Logs',
      date: 'Wednesday, November 5, 2025'
    },
    {
      id: '9',
      employeeName: 'Robert Johnson',
      employeeAvatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop',
      employeeRole: 'Floor Technician',
      photoCount: 16,
      jobName: 'Sunset Plaza Repairs',
      startTime: '9:00 AM',
      endTime: '5:30 PM',
      breakTime: '30 min',
      totalHours: '8.0 hrs',
      logType: 'Regular',
      approvalStatus: 'Pending',
      workCategory: 'General Logs',
      date: 'Wednesday, November 5, 2025'
    },
    {
      id: '10',
      employeeName: 'Amanda Foster',
      employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      employeeRole: 'Project Manager',
      photoCount: 35,
      jobName: 'Luxury Condo Complex',
      startTime: '6:30 AM',
      endTime: '7:30 PM',
      breakTime: '1 hr',
      totalHours: '12.0 hrs',
      logType: 'Overtime',
      approvalStatus: 'Approved',
      workCategory: 'Project Logs',
      date: 'Tuesday, November 4, 2025'
    },
    {
      id: '11',
      employeeName: 'Marcus Brown',
      employeeAvatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&h=100&fit=crop',
      employeeRole: 'Assistant',
      photoCount: 19,
      jobName: 'Heritage House Restoration',
      startTime: '8:00 AM',
      endTime: '5:00 PM',
      breakTime: '30 min',
      totalHours: '8.5 hrs',
      logType: 'Regular',
      approvalStatus: 'Approved',
      workCategory: 'Project Logs',
      date: 'Tuesday, November 4, 2025'
    },
    {
      id: '12',
      employeeName: 'Nina Patel',
      employeeAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
      employeeRole: 'Quality Inspector',
      photoCount: 14,
      jobName: 'Quality Audits',
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      breakTime: '30 min',
      totalHours: '7.5 hrs',
      logType: 'Regular',
      approvalStatus: 'Approved',
      workCategory: 'General Logs',
      date: 'Tuesday, November 4, 2025'
    },
    {
      id: '13',
      employeeName: 'Kevin O\'Brien',
      employeeAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop',
      employeeRole: 'Lead Installer',
      photoCount: 27,
      jobName: 'Parkside Apartments',
      startTime: '7:30 AM',
      endTime: '5:30 PM',
      breakTime: '30 min',
      totalHours: '9.5 hrs',
      logType: 'Regular',
      approvalStatus: 'Pending',
      workCategory: 'Project Logs',
      date: 'Monday, November 3, 2025'
    },
    {
      id: '14',
      employeeName: 'Sophia Lee',
      employeeAvatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=100&h=100&fit=crop',
      employeeRole: 'Senior Installer',
      photoCount: 21,
      jobName: 'Beachside Villa Flooring',
      startTime: '8:00 AM',
      endTime: '4:30 PM',
      breakTime: '30 min',
      totalHours: '8.0 hrs',
      logType: 'Regular',
      approvalStatus: 'Approved',
      workCategory: 'Project Logs',
      date: 'Monday, November 3, 2025'
    },
    {
      id: '15',
      employeeName: 'Tyler Washington',
      employeeAvatar: 'https://images.unsplash.com/photo-1507081323647-4d250478b919?w=100&h=100&fit=crop',
      employeeRole: 'Floor Technician',
      photoCount: 11,
      jobName: 'Training & Development',
      startTime: '9:00 AM',
      endTime: '3:00 PM',
      breakTime: '0 min',
      totalHours: '6.0 hrs',
      logType: 'Regular',
      approvalStatus: 'Approved',
      workCategory: 'General Logs',
      date: 'Monday, November 3, 2025'
    },
    // Sunday, November 2, 2025
    {
      id: '16',
      employeeName: 'Michael Rodriguez',
      employeeAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      employeeRole: 'Lead Installer',
      photoCount: 8,
      jobName: 'Emergency Repair Call',
      startTime: '10:00 AM',
      endTime: '2:00 PM',
      breakTime: '0 min',
      totalHours: '4.0 hrs',
      logType: 'Overtime',
      approvalStatus: 'Approved',
      workCategory: 'General Logs',
      date: 'Sunday, November 2, 2025'
    },
    {
      id: '17',
      employeeName: 'Sarah Chen',
      employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      employeeRole: 'Project Manager',
      photoCount: 5,
      jobName: 'Site Inspection',
      startTime: '11:00 AM',
      endTime: '3:00 PM',
      breakTime: '0 min',
      totalHours: '4.0 hrs',
      logType: 'Overtime',
      approvalStatus: 'Approved',
      workCategory: 'General Logs',
      date: 'Sunday, November 2, 2025'
    },
    // Saturday, November 1, 2025
    {
      id: '18',
      employeeName: 'David Kim',
      employeeAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
      employeeRole: 'Lead Installer',
      photoCount: 33,
      jobName: 'Weekend Commercial Project',
      startTime: '7:00 AM',
      endTime: '7:00 PM',
      breakTime: '1 hr',
      totalHours: '11.0 hrs',
      logType: 'Overtime',
      approvalStatus: 'Approved',
      workCategory: 'Project Logs',
      date: 'Saturday, November 1, 2025'
    },
    {
      id: '19',
      employeeName: 'Emily Davis',
      employeeAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      employeeRole: 'Senior Installer',
      photoCount: 29,
      jobName: 'Weekend Commercial Project',
      startTime: '7:00 AM',
      endTime: '7:00 PM',
      breakTime: '1 hr',
      totalHours: '11.0 hrs',
      logType: 'Overtime',
      approvalStatus: 'Approved',
      workCategory: 'Project Logs',
      date: 'Saturday, November 1, 2025'
    },
    {
      id: '20',
      employeeName: 'Carlos Martinez',
      employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      employeeRole: 'Assistant',
      photoCount: 25,
      jobName: 'Weekend Commercial Project',
      startTime: '7:00 AM',
      endTime: '7:00 PM',
      breakTime: '1 hr',
      totalHours: '11.0 hrs',
      logType: 'Overtime',
      approvalStatus: 'Approved',
      workCategory: 'Project Logs',
      date: 'Saturday, November 1, 2025'
    },
    // Friday, October 31, 2025
    {
      id: '21',
      employeeName: 'Michael Rodriguez',
      employeeAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      employeeRole: 'Lead Installer',
      photoCount: 26,
      jobName: 'Historic Building Restoration',
      startTime: '8:00 AM',
      endTime: '5:00 PM',
      breakTime: '30 min',
      totalHours: '8.5 hrs',
      logType: 'Regular',
      approvalStatus: 'Approved',
      workCategory: 'Project Logs',
      date: 'Friday, October 31, 2025'
    },
    {
      id: '22',
      employeeName: 'Jessica Wu',
      employeeAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      employeeRole: 'Senior Installer',
      photoCount: 23,
      jobName: 'Medical Center Flooring',
      startTime: '7:30 AM',
      endTime: '5:30 PM',
      breakTime: '45 min',
      totalHours: '9.25 hrs',
      logType: 'Regular',
      approvalStatus: 'Approved',
      workCategory: 'Project Logs',
      date: 'Friday, October 31, 2025'
    },
    {
      id: '23',
      employeeName: 'Amanda Foster',
      employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      employeeRole: 'Project Manager',
      photoCount: 17,
      jobName: 'Client Consultations',
      startTime: '9:00 AM',
      endTime: '6:00 PM',
      breakTime: '1 hr',
      totalHours: '8.0 hrs',
      logType: 'Regular',
      approvalStatus: 'Approved',
      workCategory: 'General Logs',
      date: 'Friday, October 31, 2025'
    },
    {
      id: '24',
      employeeName: 'Lisa Anderson',
      employeeAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
      employeeRole: 'Quality Inspector',
      photoCount: 20,
      jobName: 'Final Inspections',
      startTime: '8:00 AM',
      endTime: '5:00 PM',
      breakTime: '30 min',
      totalHours: '8.5 hrs',
      logType: 'Regular',
      approvalStatus: 'Approved',
      workCategory: 'Project Logs',
      date: 'Friday, October 31, 2025'
    },
    // Thursday, October 30, 2025
    {
      id: '25',
      employeeName: 'James Thompson',
      employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      employeeRole: 'Floor Technician',
      photoCount: 15,
      jobName: 'School Gymnasium Floor',
      startTime: '6:00 AM',
      endTime: '2:00 PM',
      breakTime: '30 min',
      totalHours: '7.5 hrs',
      logType: 'Regular',
      approvalStatus: 'Approved',
      workCategory: 'Project Logs',
      date: 'Thursday, October 30, 2025'
    },
    {
      id: '26',
      employeeName: 'Robert Johnson',
      employeeAvatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop',
      employeeRole: 'Floor Technician',
      photoCount: 13,
      jobName: 'Church Hall Refinishing',
      startTime: '8:00 AM',
      endTime: '4:00 PM',
      breakTime: '30 min',
      totalHours: '7.5 hrs',
      logType: 'Regular',
      approvalStatus: 'Approved',
      workCategory: 'Project Logs',
      date: 'Thursday, October 30, 2025'
    },
    {
      id: '27',
      employeeName: 'Marcus Brown',
      employeeAvatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&h=100&fit=crop',
      employeeRole: 'Assistant',
      photoCount: 18,
      jobName: 'Residential Kitchen Install',
      startTime: '8:00 AM',
      endTime: '5:00 PM',
      breakTime: '30 min',
      totalHours: '8.5 hrs',
      logType: 'Regular',
      approvalStatus: 'Pending',
      workCategory: 'Project Logs',
      date: 'Thursday, October 30, 2025'
    },
    {
      id: '28',
      employeeName: 'Nina Patel',
      employeeAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
      employeeRole: 'Quality Inspector',
      photoCount: 11,
      jobName: 'Safety Compliance Check',
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      breakTime: '30 min',
      totalHours: '7.5 hrs',
      logType: 'Regular',
      approvalStatus: 'Approved',
      workCategory: 'General Logs',
      date: 'Thursday, October 30, 2025'
    },
    // Wednesday, October 29, 2025
    {
      id: '29',
      employeeName: 'Sophia Lee',
      employeeAvatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=100&h=100&fit=crop',
      employeeRole: 'Senior Installer',
      photoCount: 30,
      jobName: 'Hotel Lobby Renovation',
      startTime: '6:00 AM',
      endTime: '6:00 PM',
      breakTime: '1 hr',
      totalHours: '11.0 hrs',
      logType: 'Overtime',
      approvalStatus: 'Approved',
      workCategory: 'Project Logs',
      date: 'Wednesday, October 29, 2025'
    },
    {
      id: '30',
      employeeName: 'Kevin O\'Brien',
      employeeAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop',
      employeeRole: 'Lead Installer',
      photoCount: 28,
      jobName: 'Restaurant Chain Project',
      startTime: '7:00 AM',
      endTime: '5:00 PM',
      breakTime: '30 min',
      totalHours: '9.5 hrs',
      logType: 'Regular',
      approvalStatus: 'Approved',
      workCategory: 'Project Logs',
      date: 'Wednesday, October 29, 2025'
    },
    {
      id: '31',
      employeeName: 'Tyler Washington',
      employeeAvatar: 'https://images.unsplash.com/photo-1507081323647-4d250478b919?w=100&h=100&fit=crop',
      employeeRole: 'Floor Technician',
      photoCount: 16,
      jobName: 'Warehouse Floor Coating',
      startTime: '8:00 AM',
      endTime: '4:00 PM',
      breakTime: '30 min',
      totalHours: '7.5 hrs',
      logType: 'Regular',
      approvalStatus: 'Approved',
      workCategory: 'Project Logs',
      date: 'Wednesday, October 29, 2025'
    }
  ];

  // Group logs by date
  const groupedLogs = timeLogs.reduce((acc, log) => {
    if (!acc[log.date]) {
      acc[log.date] = [];
    }
    acc[log.date].push(log);
    return acc;
  }, {} as Record<string, TimeLog[]>);

  const gradients = [
    '#3B9CAA → #223447',
    '#4C3F56 → #2F5660',
    '#55624C → #233529'
  ];

  const totalHours = timeLogs.reduce((sum, log) => {
    return sum + parseFloat(log.totalHours);
  }, 0);

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
            <Sidebar 
              activePage="Time Sheet" 
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
        <Sidebar activePage="Time Sheet" darkMode={true} onNavigate={onNavigate} />
      )}

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        marginLeft: isMobile ? '0' : '160px', 
        backgroundColor: '#262626', 
        minWidth: 0, 
        minHeight: 0,
        overflow: 'hidden' 
      }}>
        {/* Page Header */}
        <div style={{
          padding: isMobile ? '16px' : '24px 32px',
          backgroundColor: '#262626',
          borderBottom: '1px solid #333'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? '16px' : '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '16px', flexWrap: 'wrap' }}>
              {/* Mobile Menu Button */}
              {isMobile && (
                <button
                  onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                  style={{
                    width: '44px',
                    height: '44px',
                    backgroundColor: '#D4A024',
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
              <h1 style={{ color: '#FFFFFF', fontSize: isMobile ? '20px' : '28px', fontWeight: 'bold', margin: 0 }}>
                Time Logs
              </h1>
              
              {/* View Mode Toggle */}
              <div style={{
                display: 'flex',
                backgroundColor: '#2D2D2D',
                borderRadius: '12px',
                padding: '4px',
                gap: '4px'
              }}>
                {(['Week', 'Month', 'Year'] as ViewMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: viewMode === mode ? '#D4A024' : 'transparent',
                      color: viewMode === mode ? '#FFFFFF' : '#A0A0A0',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Total Hours */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#3E6A50',
                borderRadius: '12px',
                boxShadow: '0 3px 0 0 #2D5039, 0 4px 8px rgba(0,0,0,0.2)'
              }}>
                <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '600' }}>
                  Total: {totalHours.toFixed(1)} hrs
                </span>
              </div>
            </div>

            {/* Add Time Log Button */}
            <AddTimeLogButton />
          </div>

          {/* Search and Filters Row */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Search Bar */}
            <div style={{
              flex: 1,
              maxWidth: '400px',
              position: 'relative'
            }}>
              <Search 
                size={18} 
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#A0A0A0'
                }}
              />
              <input
                type="text"
                placeholder="Search employees, jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  backgroundColor: '#2D2D2D',
                  border: '1px solid #444',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Clear Filters */}
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                backgroundColor: '#2D2D2D',
                color: '#A0A0A0',
                border: '1px solid #444',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#3D3D3D';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2D2D2D';
                e.currentTarget.style.color = '#A0A0A0';
              }}
            >
              <X size={16} />
              Clear Filters
            </button>

            {/* Columns Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowColumnPicker(!showColumnPicker)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  backgroundColor: showColumnPicker ? '#D4A024' : '#2D2D2D',
                  color: showColumnPicker ? '#FFFFFF' : '#A0A0A0',
                  border: '1px solid #444',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Columns size={16} />
                Columns
              </button>

              {showColumnPicker && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: '#2D2D2D',
                  border: '1px solid #444',
                  borderRadius: '12px',
                  padding: '12px',
                  minWidth: '200px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  zIndex: 30
                }}>
                  <div style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                    Toggle Columns
                  </div>
                  {['Images', 'Job Name', 'End Time', 'Break Time', 'Total Hours', 'Log Type', 'Approval', 'Category', 'Actions'].map((col) => (
                    <label
                      key={col}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px',
                        cursor: 'pointer',
                        color: '#E0E0E0',
                        fontSize: '13px'
                      }}
                    >
                      <input type="checkbox" defaultChecked />
                      {col}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table Container - DUAL COLUMN LAYOUT */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          backgroundColor: '#262626',
          overflow: 'hidden',
          minHeight: 0
        }}>
          <div 
            style={{
              flex: 1,
              backgroundColor: '#262626',
              borderRadius: '16px',
              border: '1px solid #333',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* UNIFIED STICKY HEADER - BOTH COLUMNS */}
            <div style={{
              display: 'flex',
              backgroundColor: 'rgba(45, 45, 45, 0.95)',
              borderBottom: '2px solid #D4A024',
              backdropFilter: 'blur(8px)',
              flexShrink: 0
            }}>
              {/* Employee Header */}
              <div style={{
                width: '280px',
                padding: '16px 24px',
                height: '54px',
                display: 'flex',
                alignItems: 'center',
                color: '#A0A0A0',
                fontSize: '12px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderRight: '2px solid #444',
                flexShrink: 0
              }}>
                Employee
              </div>

              {/* Other Column Headers - Scrollable */}
              <div 
                ref={headerScrollRef}
                onScroll={handleHeaderScroll}
                style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden' }} 
                className="horizontal-scroll"
              >
                <div style={{ display: 'flex', minWidth: 'max-content' }}>
                  {[
                    { label: 'Photos', width: '80px' },
                    { label: 'Job/Task', width: '200px' },
                    { label: 'Start', width: '100px' },
                    { label: 'End', width: '100px' },
                    { label: 'Break', width: '100px' },
                    { label: 'Total', width: '100px' },
                    { label: 'Type', width: '140px' }
                  ].map((col, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '16px 24px',
                        width: col.width,
                        minWidth: col.width,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        color: '#A0A0A0',
                        fontSize: '12px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {col.label}
                    </div>
                  ))}
                  
                  {/* Status Column with Checkbox and Dropdown */}
                  <div
                    style={{
                      padding: '16px 24px',
                      width: '200px',
                      minWidth: '200px',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: '#A0A0A0',
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    <input
                      type="checkbox"
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: '#D4A024',
                        cursor: 'pointer'
                      }}
                      onChange={(e) => {
                        if (e.target.checked) {
                          // Select all visible logs
                          const allIds = new Set(timeLogs.map(log => log.id));
                          setSelectedLogs(allIds);
                        } else {
                          // Deselect all
                          setSelectedLogs(new Set());
                        }
                      }}
                      checked={selectedLogs.size === timeLogs.length && timeLogs.length > 0}
                    />
                    <select
                      style={{
                        backgroundColor: '#F4B400',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                      defaultValue="Pending"
                    >
                      <option value="Pending" style={{ backgroundColor: '#2D2D2D' }}>Pending</option>
                      <option value="Approved" style={{ backgroundColor: '#2D2D2D' }}>Approved</option>
                      <option value="Rejected" style={{ backgroundColor: '#2D2D2D' }}>Rejected</option>
                    </select>
                  </div>

                  {/* Actions Header */}
                  <div
                    style={{
                      padding: '16px 24px',
                      width: '120px',
                      minWidth: '120px',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      color: '#A0A0A0',
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Actions
                  </div>
                </div>
              </div>
            </div>

            {/* SCROLLABLE CONTENT AREA */}
            <div 
              className="vertical-scroll"
              style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <div style={{ display: 'flex', minHeight: 'fit-content' }}>
                {/* LEFT COLUMN - Employee Data */}
                <div style={{
                  width: '280px',
                  flexShrink: 0,
                  backgroundColor: '#2D2D2D',
                  borderRight: '2px solid #444'
                }}>
                  {/* Employee Data */}
                  {Object.entries(groupedLogs).map(([date, logs]) => (
                    <div key={date}>
                      {/* Date Section */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '16px 24px',
                        height: '54px',
                        backgroundColor: '#2D2D2D',
                        borderBottom: '2px solid #D4A024'
                      }}>
                        <Calendar size={18} color="#D9534F" />
                        <span style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '15px' }}>
                          {date}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          color: '#A0A0A0',
                          backgroundColor: '#3D3D3D',
                          padding: '2px 8px',
                          borderRadius: '8px'
                        }}>
                          {logs.length} logs
                        </span>
                      </div>

                      {/* Employee Names */}
                      {logs.map((log, idx) => {
                        const gradient = gradients[idx % gradients.length];
                        const baseColor = gradient.split(' → ')[0];
                        return (
                          <div
                            key={log.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '12px 24px',
                              height: '72px',
                              background: `linear-gradient(90deg, ${baseColor}, ${baseColor}EE)`,
                              borderBottom: '1px solid #333',
                              transition: 'all 0.2s'
                            }}
                          >
                            <img 
                              src={log.employeeAvatar} 
                              alt={log.employeeName}
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid #D4A024'
                              }}
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '14px' }}>
                                {log.employeeName}
                              </div>
                              <div style={{ color: '#A0A0A0', fontSize: '12px' }}>
                                {log.employeeRole}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* RIGHT COLUMN - All Other Columns */}
                <div 
                  ref={contentScrollRef}
                  onScroll={handleContentScroll}
                  style={{
                    flex: 1,
                    overflowX: 'auto',
                    overflowY: 'visible',
                    position: 'relative'
                  }}
                  className="horizontal-scroll"
                >
                  <div style={{ minWidth: 'max-content' }}>
                    {/* Other Columns Data */}
                    {Object.entries(groupedLogs).map(([date, logs]) => (
                      <div key={date}>
                        {/* Date Section Spacer */}
                        <div style={{
                          height: '54px',
                          backgroundColor: '#2D2D2D',
                          borderBottom: '2px solid #D4A024'
                        }}></div>

                        {/* Data Rows */}
                        {logs.map((log, idx) => {
                          const gradient = gradients[idx % gradients.length];
                          const baseColor = gradient.split(' → ')[0];
                          const isHovered = hoveredRowId === log.id;
                          
                          return (
                            <div
                              key={log.id}
                              onMouseEnter={() => setHoveredRowId(log.id)}
                              onMouseLeave={() => setHoveredRowId(null)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                height: '72px',
                                background: isHovered 
                                  ? `linear-gradient(90deg, ${baseColor}DD, ${baseColor}DD)` 
                                  : `linear-gradient(90deg, ${baseColor}, ${baseColor}EE)`,
                                borderBottom: '1px solid #333',
                                transition: 'all 0.2s',
                                cursor: 'pointer',
                                filter: isHovered ? 'brightness(1.15)' : 'brightness(1)'
                              }}
                            >
                              {/* Images Badge */}
                              <div style={{ padding: '12px', width: '80px', minWidth: '80px' }}>
                                <div style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '4px 10px',
                                  backgroundColor: '#3E7BE0',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  color: '#FFFFFF'
                                }}>
                                  <ImageIcon size={14} />
                                  <span>{log.photoCount}</span>
                                </div>
                              </div>

                              {/* Job Name */}
                              <div style={{ padding: '12px', width: '200px', minWidth: '200px', color: '#E0E0E0', fontSize: '13px' }}>
                                {log.jobName}
                              </div>

                              {/* Start Time */}
                              <div style={{ padding: '12px', width: '100px', minWidth: '100px', color: '#B0B0B0', fontSize: '13px' }}>
                                {log.startTime}
                              </div>

                              {/* End Time */}
                              <div style={{ padding: '12px', width: '100px', minWidth: '100px', color: '#B0B0B0', fontSize: '13px' }}>
                                {log.endTime}
                              </div>

                              {/* Break Time */}
                              <div style={{ padding: '12px', width: '100px', minWidth: '100px', color: '#B0B0B0', fontSize: '13px' }}>
                                {log.breakTime}
                              </div>

                              {/* Total Hours */}
                              <div style={{ padding: '12px', width: '100px', minWidth: '100px', color: '#FFFFFF', fontWeight: '600', fontSize: '14px' }}>
                                {log.totalHours}
                              </div>

                              {/* Log Type */}
                              <div style={{ padding: '12px', width: '140px', minWidth: '140px' }}>
                                <PlasticPill 
                                  text={log.logType} 
                                  variant={log.logType === 'Regular' ? 'regular' : log.logType === 'Overtime' ? 'overtime' : 'sick'} 
                                />
                              </div>

                              {/* Status with Checkbox */}
                              <div style={{ 
                                padding: '12px', 
                                width: '200px', 
                                minWidth: '200px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                              }}>
                                <input
                                  type="checkbox"
                                  checked={selectedLogs.has(log.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      selectedLogs.add(log.id);
                                    } else {
                                      selectedLogs.delete(log.id);
                                    }
                                    setSelectedLogs(new Set(selectedLogs));
                                  }}
                                  style={{
                                    width: '18px',
                                    height: '18px',
                                    accentColor: '#D4A024',
                                    cursor: 'pointer'
                                  }}
                                />
                                <PlasticPill 
                                  text={log.approvalStatus} 
                                  variant={log.approvalStatus === 'Pending' ? 'pending' : 'approved'} 
                                />
                              </div>

                              {/* Actions */}
                              <div style={{ 
                                padding: '12px', 
                                width: '120px',
                                minWidth: '120px',
                                display: 'flex', 
                                gap: '8px', 
                                justifyContent: 'center' 
                              }}>
                                {[
                                  { icon: Eye, color: '#3B9CAA' },
                                  { icon: Pencil, color: '#D4A024' },
                                  { icon: Trash2, color: '#D9534F' }
                                ].map(({ icon: Icon, color }, idx) => (
                                  <button
                                    key={idx}
                                    style={{
                                      width: '32px',
                                      height: '32px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      backgroundColor: '#2D2D2D',
                                      border: 'none',
                                      borderRadius: '8px',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                      color: '#A0A0A0'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = color;
                                      e.currentTarget.style.color = '#FFFFFF';
                                      e.currentTarget.style.boxShadow = `0 0 12px ${color}66`;
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = '#2D2D2D';
                                      e.currentTarget.style.color = '#A0A0A0';
                                      e.currentTarget.style.boxShadow = 'none';
                                    }}
                                  >
                                    <Icon size={16} />
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {selectedLogs.size > 0 && (
            <ApproveSelectedButton 
              count={selectedLogs.size} 
              onClick={() => {
                // Approve logic here - in a real app would update the backend
                alert(`Approved ${selectedLogs.size} time log(s)`);
                setSelectedLogs(new Set());
              }}
            />
          )}
          <AddTimeLogButton />
        </div>
      </div>
    </div>
  );
}