import React, { useState } from 'react';
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
  X
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

// Main Time Logs Page Component
export default function TimeLogsPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [viewMode, setViewMode] = useState<ViewMode>('Week');
  const [searchQuery, setSearchQuery] = useState('');
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [allSelected, setAllSelected] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>('');
  const [showBulkMenu, setShowBulkMenu] = useState(false);

  // Sample data (truncated for brevity - add all your data here)
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
    }
    // Add rest of your data...
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
      {/* Sidebar */}
      <Sidebar activePage="Time Sheet" darkMode={true} onNavigate={onNavigate} />

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        marginLeft: '160px', 
        backgroundColor: '#262626', 
        minWidth: 0, 
        minHeight: 0,
        overflow: 'hidden' 
      }}>
        {/* Page Header */}
        <div style={{
          padding: '24px 32px',
          backgroundColor: '#262626',
          borderBottom: '1px solid #333'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h1 style={{ color: '#FFFFFF', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                onClick={() => setShowColumnMenu(!showColumnMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  backgroundColor: showColumnMenu ? '#D4A024' : '#2D2D2D',
                  color: showColumnMenu ? '#FFFFFF' : '#A0A0A0',
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

              {showColumnMenu && (
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

        {/* Table Container - FIXED STRUCTURE */}
        <div style={{
          flex: 1,
          padding: '24px',
          backgroundColor: '#262626',
          overflow: 'hidden',
          minHeight: 0
        }}>
          <div style={{
            height: '100%',
            backgroundColor: '#262626',
            borderRadius: '16px',
            border: '1px solid #333',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* UNIFIED STICKY HEADER - BOTH COLUMNS */}
            <div style={{
              display: 'flex',
              backgroundColor: 'rgba(45, 45, 45, 0.95)',
              borderBottom: '2px solid #D4A024',
              position: 'sticky',
              top: 0,
              zIndex: 30,
              backdropFilter: 'blur(8px)'
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
              <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden' }} className="horizontal-scroll">
                <div style={{ display: 'flex', minWidth: 'max-content' }}>
                  {[
                    { label: 'Photos', width: '80px' },
                    { label: 'Job/Task', width: '200px' },
                    { label: 'End', width: '100px' },
                    { label: 'Break', width: '100px' },
                    { label: 'Total', width: '100px' },
                    { label: 'Type', width: '140px' },
                    { label: 'Status', width: '140px' },
                    { label: 'Actions', width: '120px' }
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
                </div>
              </div>
            </div>

            {/* UNIFIED STICKY BULK ACTIONS ROW */}
            <div style={{
              display: 'flex',
              backgroundColor: '#1F1F1F',
              borderBottom: '1px solid #444',
              position: 'sticky',
              top: '54px',
              zIndex: 25
            }}>
              {/* Employee Column Spacer */}
              <div style={{
                width: '280px',
                height: '48px',
                borderRight: '2px solid #444',
                flexShrink: 0
              }}></div>

              {/* Bulk Actions - Scrollable */}
              <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden' }} className="horizontal-scroll">
                <div style={{
                  display: 'flex',
                  height: '48px',
                  alignItems: 'center',
                  gap: '12px',
                  paddingLeft: 'calc(80px + 200px + 100px + 100px + 100px + 140px + 12px)',
                  minWidth: 'max-content'
                }}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => setAllSelected(e.target.checked)}
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                      accentColor: '#D4A024'
                    }}
                  />
                  
                  {/* Custom Dropdown with Badge Options */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setShowBulkMenu(!showBulkMenu)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#2D2D2D',
                        color: bulkAction === '' ? '#A0A0A0' : '#FFFFFF',
                        border: `1px solid ${bulkAction === '' ? '#444' : bulkAction === 'approve' ? '#4CAF50' : bulkAction === 'deny' ? '#D9534F' : '#F4B400'}`,
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        outline: 'none',
                        minWidth: '140px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        boxShadow: bulkAction !== '' ? `0 2px 8px ${bulkAction === 'approve' ? 'rgba(76,175,80,0.3)' : bulkAction === 'deny' ? 'rgba(217,83,79,0.3)' : 'rgba(244,180,0,0.3)'}` : 'none',
                        transition: 'all 0.2s'
                      }}
                    >
                      <span>{bulkAction === '' ? 'Select Action' : bulkAction === 'approve' ? '✓ Approve' : bulkAction === 'deny' ? '✗ Deny' : '⏳ Pending'}</span>
                      <span style={{ fontSize: '10px' }}>▼</span>
                    </button>

                    {showBulkMenu && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: '4px',
                        backgroundColor: '#2D2D2D',
                        border: '1px solid #444',
                        borderRadius: '12px',
                        padding: '8px',
                        minWidth: '160px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                        zIndex: 50
                      }}>
                        {[
                          { value: 'approve', label: 'Approve', color: '#4CAF50', icon: '✓' },
                          { value: 'deny', label: 'Deny', color: '#D9534F', icon: '✗' },
                          { value: 'pending', label: 'Pending', color: '#F4B400', icon: '⏳' }
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setBulkAction(option.value);
                              setShowBulkMenu(false);
                            }}
                            style={{
                              width: '100%',
                              padding: '8px',
                              marginBottom: '4px',
                              backgroundColor: 'transparent',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              textAlign: 'left'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#3D3D3D';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <div style={{
                              display: 'inline-block',
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#FFFFFF',
                              backgroundColor: option.color,
                              boxShadow: `0 3px 0 0 ${option.color}CC, 0 4px 8px rgba(0,0,0,0.2)`,
                              whiteSpace: 'nowrap'
                            }}>
                              {option.icon} {option.label}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
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

                {/* RIGHT COLUMN - Other Data - Horizontally Scrollable */}
                <div style={{ flex: 1, overflowX: 'auto' }} className="horizontal-scroll">
                  <div style={{ minWidth: 'max-content' }}>
                    {Object.entries(groupedLogs).map(([date, logs]) => (
                      <div key={date}>
                        {/* Date Spacer */}
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

                              {/* Approval Status */}
                              <div style={{ padding: '12px', width: '140px', minWidth: '140px' }}>
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
      </div>
    </div>
  );
}
