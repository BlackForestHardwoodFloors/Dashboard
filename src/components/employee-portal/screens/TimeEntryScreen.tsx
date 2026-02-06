import React, { useState, useEffect } from 'react';
import {
  Clock,
  Plus,
  ChevronLeft,
  ChevronDown,
  Calendar,
  Briefcase,
  ClipboardList,
  X,
  Trash2,
  Edit3,
  Camera,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../ThemeProvider';

// ✅ TimeSheet Primary Red (less pink, more true red)
const TIMESHEET_RED = '#E74C3C';

// Types
interface TimeLog {
  id: string;
  dateOfWork: string;
  logType: 'Project Logs' | 'General Time Logs';
  jobName?: string;
  jobId?: string;
  taskName?: string;
  taskId?: string;
  typeOfWork: string;
  startTime: string;
  endTime: string;
  breakTime: string;
  totalHours: string;
  note: string;
  images: string[];
  approval: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
}

interface Job {
  id: string;
  name: string;
  address: string;
}

interface GeneralTask {
  id: string;
  name: string;
}

// Sample Data
const sampleTimeLogs: TimeLog[] = [
  {
    id: 'tl-001',
    dateOfWork: '2024-12-23',
    logType: 'Project Logs',
    jobName: 'Anderson Residence - 742 Maple Ridge Dr',
    jobId: 'job-001',
    typeOfWork: 'Installation',
    startTime: '08:00 AM',
    endTime: '12:30 PM',
    breakTime: '30 min',
    totalHours: '4 hr',
    note: 'Completed living room installation',
    images: [],
    approval: 'Pending'
  },
  {
    id: 'tl-002',
    dateOfWork: '2024-12-23',
    logType: 'Project Logs',
    jobName: 'Anderson Residence - 742 Maple Ridge Dr',
    jobId: 'job-001',
    typeOfWork: 'Sanding',
    startTime: '01:00 PM',
    endTime: '05:00 PM',
    breakTime: '0 min',
    totalHours: '4 hr',
    note: '',
    images: [],
    approval: 'Pending'
  },
  {
    id: 'tl-003',
    dateOfWork: '2024-12-20',
    logType: 'Project Logs',
    jobName: 'Thompson Office - 1856 Oak Valley Ct',
    jobId: 'job-002',
    typeOfWork: '1st Coat',
    startTime: '07:30 AM',
    endTime: '04:00 PM',
    breakTime: '45 min',
    totalHours: '7 hr 45 min',
    note: 'Applied first coat of finish',
    images: ['https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=100'],
    approval: 'Approved'
  },
  {
    id: 'tl-004',
    dateOfWork: '2024-12-19',
    logType: 'General Time Logs',
    taskName: 'Shop Maintenance',
    taskId: 'task-001',
    typeOfWork: 'Others',
    startTime: '08:00 AM',
    endTime: '10:00 AM',
    breakTime: '0 min',
    totalHours: '2 hr',
    note: 'Cleaned and organized equipment',
    images: [],
    approval: 'Approved'
  },
  {
    id: 'tl-005',
    dateOfWork: '2024-12-18',
    logType: 'Project Logs',
    jobName: 'Wilson Home - 423 Riverside Dr',
    jobId: 'job-003',
    typeOfWork: 'Installation',
    startTime: '08:00 AM',
    endTime: '05:30 PM',
    breakTime: '1 hr',
    totalHours: '8 hr 30 min',
    note: '',
    images: [],
    approval: 'Rejected',
    rejectionReason: 'Hours exceed scheduled time. Please verify and resubmit.'
  }
];

const sampleJobs: Job[] = [
  { id: 'job-001', name: 'Anderson Residence', address: '742 Maple Ridge Dr' },
  { id: 'job-002', name: 'Thompson Office', address: '1856 Oak Valley Ct' },
  { id: 'job-003', name: 'Wilson Home', address: '423 Riverside Dr' }
];

const sampleTasks: GeneralTask[] = [
  { id: 'task-001', name: 'Shop Maintenance' },
  { id: 'task-002', name: 'Training' },
  { id: 'task-003', name: 'Equipment Repair' },
  { id: 'task-004', name: 'Travel Time' }
];

const typeOfWorkOptions = ['Installation', 'Sanding', '1st Coat', '2nd Coat', 'Final Coat', 'Repairs', 'Others'];

const breakTimeOptions = ['0 min', '15 min', '30 min', '45 min', '1 hr', '1 hr 15 min', '1 hr 30 min', '2 hr'];

// Helper to generate time options (5:00 AM to 9:00 PM in 15-min intervals)
const generateTimeOptions = () => {
  const times: string[] = [];
  for (let hour = 5; hour <= 21; hour++) {
    for (let min = 0; min < 60; min += 15) {
      const h = hour % 12 || 12;
      const ampm = hour < 12 ? 'AM' : 'PM';
      const m = min.toString().padStart(2, '0');
      times.push(`${h.toString().padStart(2, '0')}:${m} ${ampm}`);
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

// Calculate total hours from start, end, and break
const calculateTotalHours = (startTime: string, endTime: string, breakTime: string): string => {
  if (!startTime || !endTime) return '';

  const parseTime = (timeStr: string) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const startMinutes = parseTime(startTime);
  const endMinutes = parseTime(endTime);

  let duration = endMinutes - startMinutes;
  if (duration < 0) return '0 min';

  // Parse break time
  let breakMinutes = 0;
  const breakMatch = breakTime.match(/(\d+)\s*hr/);
  const breakMinMatch = breakTime.match(/(\d+)\s*min/);
  if (breakMatch) breakMinutes += parseInt(breakMatch[1]) * 60;
  if (breakMinMatch) breakMinutes += parseInt(breakMinMatch[1]);

  duration -= breakMinutes;
  if (duration <= 0) return '0 min';

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  if (hours > 0 && minutes > 0) return `${hours} hr ${minutes} min`;
  if (hours > 0) return `${hours} hr`;
  return `${minutes} min`;
};

// Format date for display
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Group logs by date
const groupLogsByDate = (logs: TimeLog[]) => {
  const grouped: Record<string, TimeLog[]> = {};
  logs.forEach(log => {
    if (!grouped[log.dateOfWork]) grouped[log.dateOfWork] = [];
    grouped[log.dateOfWork].push(log);
  });
  return Object.entries(grouped).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
};

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles: Record<string, { bg: string; text: string }> = {
    Pending: { bg: 'rgba(244, 180, 0, 0.2)', text: '#F4B400' },
    Approved: { bg: 'rgba(76, 175, 80, 0.2)', text: '#4CAF50' },
    Rejected: { bg: 'rgba(231, 76, 60, 0.2)', text: TIMESHEET_RED }
  };

  const style = statusStyles[status] || statusStyles.Pending;

  return (
    <span
      style={{
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '700',
        backgroundColor: style.bg,
        color: style.text
      }}
    >
      {status}
    </span>
  );
};

// Dropdown Component
const Dropdown = ({
  label,
  value,
  options,
  onChange,
  placeholder,
  required,
  disabled,
  error,
  colors
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  colors: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ marginBottom: '16px' }}>
      <label
        style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          color: colors.text,
          marginBottom: '6px'
        }}
      >
        {label} {required && <span style={{ color: TIMESHEET_RED }}>*</span>}
      </label>

      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: disabled ? colors.backgroundTertiary : colors.backgroundSecondary,
            border: `1px solid ${error ? TIMESHEET_RED : colors.border}`,
            borderRadius: '10px',
            fontSize: '14px',
            color: value ? colors.text : colors.textTertiary,
            textAlign: 'left',
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>{value || placeholder}</span>
          <ChevronDown size={18} color={colors.textSecondary} />
        </button>

        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: colors.backgroundElevated,
              border: `1px solid ${colors.border}`,
              borderRadius: '10px',
              marginTop: '4px',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 100,
              boxShadow: `0 4px 16px ${colors.shadow}`
            }}
          >
            {options.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: `1px solid ${colors.border}`,
                  fontSize: '14px',
                  color: colors.text,
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p style={{ color: TIMESHEET_RED, fontSize: '12px', marginTop: '4px' }}>{error}</p>}
    </div>
  );
};

// Time Entry Form Component
interface TimeEntryFormProps {
  onClose: () => void;
  onSubmit: (log: Omit<TimeLog, 'id' | 'approval'>) => void;
  initialData?: TimeLog;
  jobs: Job[];
  tasks: GeneralTask[];
  colors: any;
}

const TimeEntryForm = ({ onClose, onSubmit, initialData, jobs, tasks, colors }: TimeEntryFormProps) => {
  const [logType, setLogType] = useState<'Project Logs' | 'General Time Logs'>(initialData?.logType || 'Project Logs');
  const [dateOfWork, setDateOfWork] = useState(initialData?.dateOfWork || new Date().toISOString().split('T')[0]);
  const [selectedJob, setSelectedJob] = useState(initialData?.jobId || '');
  const [selectedTask, setSelectedTask] = useState(initialData?.taskId || '');
  const [typeOfWork, setTypeOfWork] = useState(initialData?.typeOfWork || '');
  const [startTime, setStartTime] = useState(initialData?.startTime || '08:00 AM');
  const [endTime, setEndTime] = useState(initialData?.endTime || '05:00 PM');
  const [breakTime, setBreakTime] = useState(initialData?.breakTime || '30 min');
  const [note, setNote] = useState(initialData?.note || '');
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalHours = calculateTotalHours(startTime, endTime, breakTime);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (logType === 'Project Logs' && !selectedJob) newErrors.jobName = 'Job Name is required';
    if (logType === 'General Time Logs' && !selectedTask) newErrors.taskName = 'Task Name is required';
    if (!typeOfWork) newErrors.typeOfWork = 'Type of Work is required';
    if (!startTime) newErrors.startTime = 'Start Time is required';
    if (!endTime) newErrors.endTime = 'End Time is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const job = jobs.find(j => j.id === selectedJob);
    const task = tasks.find(t => t.id === selectedTask);

    onSubmit({
      dateOfWork,
      logType,
      jobName: job ? `${job.name} - ${job.address}` : undefined,
      jobId: selectedJob || undefined,
      taskName: task?.name,
      taskId: selectedTask || undefined,
      typeOfWork,
      startTime,
      endTime,
      breakTime,
      totalHours,
      note,
      images
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.background,
        zIndex: 1000,
        overflowY: 'auto'
      }}
    >
      {/* Header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: colors.backgroundSecondary,
          padding: '16px 20px',
          paddingTop: 'max(16px, env(safe-area-inset-top))',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10
        }}
      >
        <button
          onClick={onClose}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: TIMESHEET_RED
          }}
        >
          <ChevronLeft size={24} />
          <span style={{ fontSize: '16px', fontWeight: '600' }}>Cancel</span>
        </button>

        <h1 style={{ color: colors.text, fontSize: '18px', fontWeight: '700', margin: 0 }}>
          {initialData ? 'Edit Time Log' : 'Log Time'}
        </h1>

        <div style={{ width: '80px' }} />
      </div>

      {/* Form Content */}
      <div style={{ padding: '20px', paddingBottom: '120px' }}>
        {/* Log Type Selection */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.text, marginBottom: '10px' }}>
            Log Type <span style={{ color: TIMESHEET_RED }}>*</span>
          </label>

          <div style={{ display: 'flex', gap: '12px' }}>
            {['Project Logs', 'General Time Logs'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setLogType(type as any)}
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  backgroundColor: logType === type ? TIMESHEET_RED : colors.backgroundSecondary,
                  border: `1px solid ${logType === type ? TIMESHEET_RED : colors.border}`,
                  borderRadius: '12px',
                  color: logType === type ? '#FFFFFF' : colors.text,
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {type === 'Project Logs' ? <Briefcase size={18} /> : <ClipboardList size={18} />}
                {type === 'Project Logs' ? 'Project' : 'General'}
              </button>
            ))}
          </div>
        </div>

        {/* Date of Work */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.text, marginBottom: '6px' }}>
            Date of Work <span style={{ color: TIMESHEET_RED }}>*</span>
          </label>

          <div style={{ position: 'relative' }}>
            <input
              type="date"
              value={dateOfWork}
              onChange={e => setDateOfWork(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: colors.backgroundSecondary,
                border: `1px solid ${colors.border}`,
                borderRadius: '10px',
                fontSize: '14px',
                color: colors.text,
                outline: 'none'
              }}
            />
            <Calendar
              size={18}
              color={colors.textSecondary}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}
            />
          </div>
        </div>

        {/* Job Name or Task Name */}
        {logType === 'Project Logs' ? (
          <Dropdown
            label="Job Name"
            value={jobs.find(j => j.id === selectedJob)?.name || ''}
            options={jobs.map(j => ({ value: j.id, label: `${j.name} - ${j.address}` }))}
            onChange={setSelectedJob}
            placeholder="Select a job"
            required
            error={errors.jobName}
            colors={colors}
          />
        ) : (
          <Dropdown
            label="Task Name"
            value={tasks.find(t => t.id === selectedTask)?.name || ''}
            options={tasks.map(t => ({ value: t.id, label: t.name }))}
            onChange={setSelectedTask}
            placeholder="Select a task"
            required
            error={errors.taskName}
            colors={colors}
          />
        )}

        {/* Type of Work */}
        <Dropdown
          label="Type of Work"
          value={typeOfWork}
          options={typeOfWorkOptions.map(t => ({ value: t, label: t }))}
          onChange={setTypeOfWork}
          placeholder="Select type of work"
          required
          error={errors.typeOfWork}
          colors={colors}
        />

        {/* Time Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <Dropdown
            label="Start Time"
            value={startTime}
            options={timeOptions.map(t => ({ value: t, label: t }))}
            onChange={setStartTime}
            placeholder="Start"
            required
            error={errors.startTime}
            colors={colors}
          />

          <Dropdown
            label="End Time"
            value={endTime}
            options={timeOptions.map(t => ({ value: t, label: t }))}
            onChange={setEndTime}
            placeholder="End"
            required
            error={errors.endTime}
            colors={colors}
          />
        </div>

        {/* Break Time & Total Hours */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <Dropdown
            label="Break Time"
            value={breakTime}
            options={breakTimeOptions.map(t => ({ value: t, label: t }))}
            onChange={setBreakTime}
            placeholder="Break"
            colors={colors}
          />

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.text, marginBottom: '6px' }}>
              Total Hours
            </label>
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: colors.backgroundTertiary,
                border: `1px solid ${colors.border}`,
                borderRadius: '10px',
                fontSize: '14px',
                color: TIMESHEET_RED,
                fontWeight: '700'
              }}
            >
              {totalHours || '0 min'}
            </div>
          </div>
        </div>

        {/* Note */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.text, marginBottom: '6px' }}>
            Note
          </label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Add a note (optional)"
            rows={3}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: colors.backgroundSecondary,
              border: `1px solid ${colors.border}`,
              borderRadius: '10px',
              fontSize: '14px',
              color: colors.text,
              outline: 'none',
              resize: 'none',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Images */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.text, marginBottom: '6px' }}>
            Photos
          </label>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {images.map((img, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  width: '80px',
                  height: '80px',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={14} color="#FFFFFF" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => console.log('Add photo')}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '10px',
                border: `2px dashed ${colors.border}`,
                backgroundColor: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <Camera size={24} color={colors.textTertiary} />
              <span style={{ fontSize: '11px', color: colors.textTertiary }}>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 20px',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          backgroundColor: colors.backgroundSecondary,
          borderTop: `1px solid ${colors.border}`
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ color: colors.textSecondary, fontSize: '14px' }}>Total Hours</span>
          <span style={{ color: TIMESHEET_RED, fontSize: '18px', fontWeight: '700' }}>{totalHours || '0 min'}</span>
        </div>

        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: TIMESHEET_RED,
            border: 'none',
            borderRadius: '12px',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          {initialData ? 'Update Time Log' : 'Submit Time Log'}
        </button>
      </div>
    </div>
  );
};

// Main Time Entry Screen Component
interface TimeEntryScreenProps {
  onBack: () => void;
}

export function TimeEntryScreen({ onBack }: TimeEntryScreenProps) {
  const { colors } = useTheme();
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>(sampleTimeLogs);
  const [showForm, setShowForm] = useState(false);
  const [editingLog, setEditingLog] = useState<TimeLog | null>(null);
  const [expandedDates, setExpandedDates] = useState<string[]>([]);

  // Calculate this week's total
  const thisWeekTotal = timeLogs.reduce((total, log) => {
    const logDate = new Date(log.dateOfWork);
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    weekStart.setHours(0, 0, 0, 0);

    if (logDate >= weekStart) {
      const match = log.totalHours.match(/(\d+)\s*hr/);
      const minMatch = log.totalHours.match(/(\d+)\s*min/);
      const hours = match ? parseInt(match[1]) : 0;
      const mins = minMatch ? parseInt(minMatch[1]) : 0;
      return total + hours + mins / 60;
    }
    return total;
  }, 0);

  const handleClockIn = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    setClockInTime(timeStr);
    setClockedIn(true);
  };

  const handleClockOut = () => {
    setClockedIn(false);
    setClockInTime(null);
  };

  const handleAddLog = (logData: Omit<TimeLog, 'id' | 'approval'>) => {
    const newLog: TimeLog = {
      ...logData,
      id: `tl-${Date.now()}`,
      approval: 'Pending'
    };
    setTimeLogs([newLog, ...timeLogs]);
    setShowForm(false);
  };

  const handleEditLog = (logData: Omit<TimeLog, 'id' | 'approval'>) => {
    if (!editingLog) return;
    setTimeLogs(
      timeLogs.map(log => (log.id === editingLog.id ? { ...log, ...logData, approval: 'Pending' } : log))
    );
    setEditingLog(null);
    setShowForm(false);
  };

  const handleDeleteLog = (logId: string) => {
    setTimeLogs(timeLogs.filter(log => log.id !== logId));
  };

  const toggleDateExpanded = (date: string) => {
    setExpandedDates(prev => (prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]));
  };

  const groupedLogs = groupLogsByDate(timeLogs);

  // Initialize first date as expanded
  useEffect(() => {
    if (groupedLogs.length > 0 && expandedDates.length === 0) {
      setExpandedDates([groupedLogs[0][0]]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (showForm) {
    return (
      <TimeEntryForm
        onClose={() => {
          setShowForm(false);
          setEditingLog(null);
        }}
        onSubmit={editingLog ? handleEditLog : handleAddLog}
        initialData={editingLog || undefined}
        jobs={sampleJobs}
        tasks={sampleTasks}
        colors={colors}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background, paddingBottom: '100px' }}>
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          paddingTop: 'max(16px, env(safe-area-inset-top))',
          backgroundColor: colors.backgroundSecondary,
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <button
          onClick={onBack}
          style={{ backgroundColor: 'transparent', border: 'none', padding: '8px', cursor: 'pointer' }}
        >
          <ChevronLeft size={24} color={colors.text} />
        </button>
        <h1 style={{ color: colors.text, fontSize: '20px', fontWeight: '700', margin: 0 }}>Report Time</h1>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Clock In/Out Button */}
        <button
          onClick={clockedIn ? handleClockOut : handleClockIn}
          style={{
            width: '100%',
            padding: '24px',
            backgroundColor: clockedIn ? TIMESHEET_RED : '#4F6A41',
            border: 'none',
            borderRadius: '16px',
            cursor: 'pointer',
            marginBottom: '20px',
            boxShadow: `0 4px 16px ${clockedIn ? 'rgba(231,76,60,0.3)' : 'rgba(79,106,65,0.3)'}`
          }}
        >
          <Clock size={32} color="#FFFFFF" style={{ marginBottom: '8px' }} />
          <p style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: '700', margin: 0 }}>
            {clockedIn ? 'Clock Out' : 'Clock In'}
          </p>
          {clockedIn && clockInTime && (
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: '4px 0 0 0' }}>
              Started at {clockInTime}
            </p>
          )}
        </button>

        {/* This Week Summary */}
        <div
          style={{
            backgroundColor: colors.backgroundSecondary,
            borderRadius: '12px',
            padding: '16px',
            border: `1px solid ${colors.border}`,
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: colors.textSecondary, fontSize: '14px' }}>This Week</span>
            <span style={{ color: TIMESHEET_RED, fontSize: '24px', fontWeight: '700' }}>
              {thisWeekTotal.toFixed(1)} hrs
            </span>
          </div>
        </div>

        {/* Add Time Log Button (✅ now red) */}
        <button
          onClick={() => setShowForm(true)}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: TIMESHEET_RED,
            border: 'none',
            borderRadius: '12px',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Plus size={20} />
          Add Time Log
        </button>

        {/* Time Logs List */}
        <h3 style={{ color: colors.text, fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>My Time Logs</h3>

        {groupedLogs.map(([date, logs]) => {
          const isExpanded = expandedDates.includes(date);
          const dayTotal = logs.reduce((total, log) => {
            const match = log.totalHours.match(/(\d+)\s*hr/);
            const minMatch = log.totalHours.match(/(\d+)\s*min/);
            const hours = match ? parseInt(match[1]) : 0;
            const mins = minMatch ? parseInt(minMatch[1]) : 0;
            return total + hours + mins / 60;
          }, 0);

          return (
            <div key={date} style={{ marginBottom: '12px' }}>
              {/* Date Header */}
              <button
                onClick={() => toggleDateExpanded(date)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  backgroundColor: colors.backgroundSecondary,
                  border: `1px solid ${colors.border}`,
                  borderRadius: isExpanded ? '12px 12px 0 0' : '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={18} color={TIMESHEET_RED} />
                  <span style={{ color: colors.text, fontWeight: '600', fontSize: '14px' }}>{formatDate(date)}</span>
                  <span
                    style={{
                      backgroundColor: colors.backgroundTertiary,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      color: colors.textSecondary
                    }}
                  >
                    {logs.length} {logs.length === 1 ? 'entry' : 'entries'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: TIMESHEET_RED, fontWeight: '700', fontSize: '14px' }}>{dayTotal.toFixed(1)} hrs</span>
                  <ChevronDown
                    size={18}
                    color={colors.textSecondary}
                    style={{
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  />
                </div>
              </button>

              {/* Log Entries */}
              {isExpanded && (
                <div
                  style={{
                    backgroundColor: colors.backgroundSecondary,
                    borderRadius: '0 0 12px 12px',
                    border: `1px solid ${colors.border}`,
                    borderTop: 'none',
                    overflow: 'hidden'
                  }}
                >
                  {logs.map((log, idx) => (
                    <div
                      key={log.id}
                      style={{
                        padding: '14px 16px',
                        borderBottom: idx < logs.length - 1 ? `1px solid ${colors.border}` : 'none'
                      }}
                    >
                      {/* Log Header */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '8px'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <p style={{ color: colors.text, fontWeight: '600', fontSize: '14px', margin: '0 0 4px 0' }}>
                            {log.logType === 'Project Logs' ? log.jobName : log.taskName}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span
                              style={{
                                backgroundColor: colors.backgroundTertiary,
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                color: colors.textSecondary
                              }}
                            >
                              {log.typeOfWork}
                            </span>
                            <StatusBadge status={log.approval} />
                          </div>
                        </div>
                        <span style={{ color: TIMESHEET_RED, fontWeight: '700', fontSize: '15px' }}>{log.totalHours}</span>
                      </div>

                      {/* Time Details */}
                      <div style={{ display: 'flex', gap: '16px', color: colors.textSecondary, fontSize: '13px', marginBottom: '8px' }}>
                        <span>
                          {log.startTime} - {log.endTime}
                        </span>
                        {log.breakTime !== '0 min' && <span>Break: {log.breakTime}</span>}
                      </div>

                      {/* Note */}
                      {log.note && (
                        <p style={{ color: colors.textSecondary, fontSize: '13px', margin: '0 0 8px 0', fontStyle: 'italic' }}>
                          "{log.note}"
                        </p>
                      )}

                      {/* Rejection Reason */}
                      {log.approval === 'Rejected' && log.rejectionReason && (
                        <div
                          style={{
                            backgroundColor: 'rgba(231, 76, 60, 0.1)',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px'
                          }}
                        >
                          <AlertCircle size={16} color={TIMESHEET_RED} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <p style={{ color: TIMESHEET_RED, fontSize: '12px', margin: 0 }}>{log.rejectionReason}</p>
                        </div>
                      )}

                      {/* Actions (only for Pending entries) */}
                      {log.approval === 'Pending' && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                          <button
                            onClick={() => {
                              setEditingLog(log);
                              setShowForm(true);
                            }}
                            style={{
                              flex: 1,
                              padding: '10px',
                              backgroundColor: colors.backgroundTertiary,
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              color: colors.text,
                              fontSize: '13px',
                              fontWeight: '600'
                            }}
                          >
                            <Edit3 size={14} />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteLog(log.id)}
                            style={{
                              flex: 1,
                              padding: '10px',
                              backgroundColor: 'rgba(231, 76, 60, 0.1)',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              color: TIMESHEET_RED,
                              fontSize: '13px',
                              fontWeight: '600'
                            }}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {timeLogs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: colors.textSecondary }}>
            <Clock size={48} color={colors.textTertiary} style={{ marginBottom: '12px' }} />
            <p style={{ margin: 0 }}>No time logs yet</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>Tap "Add Time Log" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TimeEntryScreen;
