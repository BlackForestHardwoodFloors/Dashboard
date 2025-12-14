/**
 * Jobs Page - Boardroom 360
 * 
 * Displays and manages jobs with filtering by status
 */

import { useState } from 'react';
import { 
  Search, 
  Plus,
  Filter,
  MoreVertical,
  ClipboardList,
  Play,
  Clock,
  CheckCircle,
  Pause,
  Calendar,
  User,
  MapPin,
  DollarSign,
  Camera,
  FileText,
  Users
} from 'lucide-react';
import { SidebarEnhanced } from './SidebarEnhanced';

interface Job {
  id: string;
  jobNumber: string;
  clientName: string;
  projectName: string;
  address: string;
  status: 'ready' | 'in-progress' | 'on-hold' | 'completed';
  startDate: string;
  endDate: string;
  assignedTo: string[];
  progress: number;
  contractValue: number;
  photosCount: number;
}

interface JobsPageProps {
  onNavigate?: (page: string) => void;
}

export default function JobsPage({ onNavigate }: JobsPageProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const bgColor = darkMode ? '#1E1E1E' : '#F5F5F5';
  const cardBg = darkMode ? '#2D2D2D' : '#FFFFFF';
  const textColor = darkMode ? '#FFFFFF' : '#1E1E1E';
  const textMuted = darkMode ? '#A0A0A0' : '#666666';
  const borderColor = darkMode ? '#3D3D3D' : '#E5E5E5';
  const accentColor = '#D4A024';

  // Mock jobs data
  const jobs: Job[] = [
    {
      id: '1',
      jobNumber: 'JOB-2024-001',
      clientName: 'Anderson Residence',
      projectName: 'Living Room Hardwood Installation',
      address: '742 Evergreen Terrace, Springfield',
      status: 'in-progress',
      startDate: '2024-11-15',
      endDate: '2024-11-22',
      assignedTo: ['Mike T.', 'John D.'],
      progress: 65,
      contractValue: 12500,
      photosCount: 24
    },
    {
      id: '2',
      jobNumber: 'JOB-2024-002',
      clientName: 'Thompson Commercial',
      projectName: 'Office Floor Renovation',
      address: '1500 Oak Boulevard, Suite 200',
      status: 'ready',
      startDate: '2024-11-20',
      endDate: '2024-12-05',
      assignedTo: ['Sarah W.', 'Mike T.', 'Tom B.'],
      progress: 0,
      contractValue: 45000,
      photosCount: 0
    },
    {
      id: '3',
      jobNumber: 'JOB-2024-003',
      clientName: 'Martinez Family',
      projectName: 'Kitchen & Dining Flooring',
      address: '88 Maple Drive, Riverside',
      status: 'completed',
      startDate: '2024-11-01',
      endDate: '2024-11-10',
      assignedTo: ['John D.'],
      progress: 100,
      contractValue: 8900,
      photosCount: 48
    },
    {
      id: '4',
      jobNumber: 'JOB-2024-004',
      clientName: 'Wilson Properties',
      projectName: 'Multi-Unit Flooring Project',
      address: '234 Pine Street, Downtown',
      status: 'on-hold',
      startDate: '2024-11-10',
      endDate: '2024-12-15',
      assignedTo: ['Mike T.', 'Sarah W.'],
      progress: 35,
      contractValue: 78500,
      photosCount: 15
    },
    {
      id: '5',
      jobNumber: 'JOB-2024-005',
      clientName: 'Garcia Restaurant',
      projectName: 'Commercial Floor Replacement',
      address: '456 Elm Avenue, Midtown',
      status: 'in-progress',
      startDate: '2024-11-12',
      endDate: '2024-11-25',
      assignedTo: ['Tom B.', 'John D.'],
      progress: 45,
      contractValue: 23000,
      photosCount: 18
    },
    {
      id: '6',
      jobNumber: 'JOB-2024-006',
      clientName: 'Brown Retail Store',
      projectName: 'Showroom Floor Installation',
      address: '789 Commerce Way',
      status: 'ready',
      startDate: '2024-11-25',
      endDate: '2024-12-02',
      assignedTo: ['Sarah W.'],
      progress: 0,
      contractValue: 15600,
      photosCount: 0
    }
  ];

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'ready': return '#42A5F5';
      case 'in-progress': return '#FF9800';
      case 'on-hold': return '#9E9E9E';
      case 'completed': return '#66BB6A';
      default: return textMuted;
    }
  };

  const getStatusIcon = (status: Job['status']) => {
    switch (status) {
      case 'ready': return Play;
      case 'in-progress': return Clock;
      case 'on-hold': return Pause;
      case 'completed': return CheckCircle;
      default: return ClipboardList;
    }
  };

  const getStatusLabel = (status: Job['status']) => {
    switch (status) {
      case 'ready': return 'Ready to Start';
      case 'in-progress': return 'In Progress';
      case 'on-hold': return 'On Hold';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (statusFilter !== 'all' && job.status !== statusFilter) return false;
    if (searchQuery && 
        !job.clientName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !job.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !job.projectName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: jobs.length,
    ready: jobs.filter(j => j.status === 'ready').length,
    inProgress: jobs.filter(j => j.status === 'in-progress').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    totalValue: jobs.reduce((sum, j) => sum + j.contractValue, 0)
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: bgColor }}>
      {/* Sidebar */}
      <SidebarEnhanced 
        activePage="Jobs" 
        darkMode={darkMode} 
        onNavigate={onNavigate}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Main Content */}
      <div style={{ marginLeft: '220px', flex: 1, padding: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', color: textColor, margin: '0 0 8px 0' }}>
              Jobs
            </h1>
            <p style={{ fontSize: '14px', color: textMuted, margin: 0 }}>
              Track and manage all your flooring projects
            </p>
          </div>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: accentColor,
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              color: '#FFFFFF'
            }}
          >
            <Plus style={{ width: '18px', height: '18px' }} />
            New Job
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '16px',
          marginBottom: '24px'
        }}>
          {[
            { label: 'Total Jobs', value: stats.total, icon: ClipboardList, color: accentColor },
            { label: 'Ready to Start', value: stats.ready, icon: Play, color: '#42A5F5' },
            { label: 'In Progress', value: stats.inProgress, icon: Clock, color: '#FF9800' },
            { label: 'Completed', value: stats.completed, icon: CheckCircle, color: '#66BB6A' }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                style={{
                  backgroundColor: cardBg,
                  borderRadius: '12px',
                  border: `1px solid ${borderColor}`,
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: `${stat.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon style={{ width: '24px', height: '24px', color: stat.color }} />
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: textMuted, margin: '0 0 4px 0' }}>
                    {stat.label}
                  </p>
                  <p style={{ fontSize: '24px', fontWeight: '700', color: textColor, margin: 0 }}>
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div style={{
          backgroundColor: cardBg,
          borderRadius: '12px',
          border: `1px solid ${borderColor}`,
          padding: '16px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'ready', 'in-progress', 'on-hold', 'completed'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: statusFilter === status ? accentColor : (darkMode ? '#3D3D3D' : '#F5F5F5'),
                  color: statusFilter === status ? '#FFFFFF' : textMuted,
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {status === 'all' ? 'All Jobs' : getStatusLabel(status as Job['status'])}
              </button>
            ))}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
            borderRadius: '8px',
            padding: '8px 12px',
            width: '280px'
          }}>
            <Search style={{ width: '18px', height: '18px', color: textMuted }} />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: textColor,
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        {/* Jobs Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '20px'
        }}>
          {filteredJobs.map(job => {
            const StatusIcon = getStatusIcon(job.status);
            return (
              <div
                key={job.id}
                style={{
                  backgroundColor: cardBg,
                  borderRadius: '16px',
                  border: `1px solid ${borderColor}`,
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Header */}
                <div style={{
                  padding: '16px 20px',
                  borderBottom: `1px solid ${borderColor}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: accentColor }}>
                      {job.jobNumber}
                    </span>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      backgroundColor: `${getStatusColor(job.status)}20`,
                      borderRadius: '20px'
                    }}>
                      <StatusIcon style={{ width: '12px', height: '12px', color: getStatusColor(job.status) }} />
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: '500', 
                        color: getStatusColor(job.status)
                      }}>
                        {getStatusLabel(job.status)}
                      </span>
                    </div>
                  </div>
                  <button style={{
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}>
                    <MoreVertical style={{ width: '18px', height: '18px', color: textMuted }} />
                  </button>
                </div>

                {/* Body */}
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: textColor, margin: '0 0 4px 0' }}>
                    {job.clientName}
                  </h3>
                  <p style={{ fontSize: '13px', color: textMuted, margin: '0 0 12px 0' }}>
                    {job.projectName}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                    <MapPin style={{ width: '14px', height: '14px', color: textMuted }} />
                    <span style={{ fontSize: '12px', color: textMuted }}>{job.address}</span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', color: textMuted }}>Progress</span>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: textColor }}>{job.progress}%</span>
                    </div>
                    <div style={{
                      height: '6px',
                      backgroundColor: darkMode ? '#3D3D3D' : '#E5E5E5',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${job.progress}%`,
                        backgroundColor: getStatusColor(job.status),
                        borderRadius: '3px',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    paddingTop: '16px',
                    borderTop: `1px solid ${borderColor}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar style={{ width: '14px', height: '14px', color: textMuted }} />
                      <span style={{ fontSize: '12px', color: textMuted }}>
                        {new Date(job.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <DollarSign style={{ width: '14px', height: '14px', color: '#66BB6A' }} />
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#66BB6A' }}>
                        ${job.contractValue.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users style={{ width: '14px', height: '14px', color: textMuted }} />
                      <span style={{ fontSize: '12px', color: textMuted }}>
                        {job.assignedTo.join(', ')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Camera style={{ width: '14px', height: '14px', color: textMuted }} />
                      <span style={{ fontSize: '12px', color: textMuted }}>
                        {job.photosCount} photos
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
