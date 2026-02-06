// CalendarPage.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Phone,
  MapPin,
  Trash2,
  Edit,
  X,
  Check
} from 'lucide-react';
import CalendarJobCard from './CalendarJobCard';
import { useTheme } from './ThemeProvider';

const API_URL = 'http://35.92.33.215:3001/api';

type ViewMode = 'month' | 'week' | 'day';

interface Appointment {
  id: number;
  contact?: string;
  firstName?: string;
  lastName?: string;
  location?: string;
  region?: string;
  purpose?: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  description?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  contact: string;
  location: string;
  region: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  purpose: string;
  employeeName: string;
  description: string;
  allDay: boolean;
  sendDriveTimeReminder: boolean;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  contact: '',
  location: '',
  region: '',
  startDate: '',
  startTime: '08:00',
  endDate: '',
  endTime: '09:00',
  purpose: 'Onsite Visit',
  employeeName: '2',
  description: '',
  allDay: false,
  sendDriveTimeReminder: true
};

export default function CalendarPage() {
  const { colors } = useTheme();
  const calendarGridRef = useRef<HTMLDivElement | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showBookModal, setShowBookModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  /* ---------------------------------------------
     Fetch Appointments
  --------------------------------------------- */
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/appointments/get-all-appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAppointments(data || []);
    } catch (err) {
      console.error('Failed to fetch appointments', err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  /* ---------------------------------------------
     Calendar Navigation
  --------------------------------------------- */
  const goPrev = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  const goNext = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  const goToday = () => setCurrentDate(new Date());

  const monthLabel = useMemo(
    () =>
      currentDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      }),
    [currentDate]
  );

  /* ---------------------------------------------
     RENDER
  --------------------------------------------- */
  return (
    <div
      style={{
        padding: '24px',
        color: colors.text
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>Appointments</h1>
          <p style={{ margin: '4px 0 0', color: colors.textMuted }}>
            Schedule appointments, manage jobs, and track crew assignments
          </p>
        </div>

        <button
          onClick={() => {
            setEditingAppointment(null);
            setFormData(initialFormData);
            setShowBookModal(true);
          }}
          style={{
            backgroundColor: '#3B9CAA',
            color: '#fff',
            border: 'none',
            padding: '12px 18px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <Plus size={18} /> New Appointment
        </button>
      </div>

      {/* Calendar Card */}
      <div
        style={{
          backgroundColor: '#262626',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={goPrev} style={navBtnStyle}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={goNext} style={navBtnStyle}>
              <ChevronRight size={18} />
            </button>
            <button onClick={goToday} style={navBtnStyle}>
              Today
            </button>
          </div>

          <h2 style={{ margin: 0 }}>{monthLabel}</h2>

          <div style={{ display: 'flex' }}>
            {(['month', 'week', 'day'] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                style={{
                  ...navBtnStyle,
                  backgroundColor: viewMode === v ? '#3B9CAA' : 'transparent'
                }}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar Grid */}
        {viewMode === 'month' && (
          <div
            ref={calendarGridRef}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 'calc(100vh - 150px)', // ✅ EXTENDED HEIGHT
              overflow: 'hidden'
            }}
          >
            {/* Month grid content lives here (unchanged) */}
            {/* Your existing month rendering logic stays intact */}
          </div>
        )}
      </div>

      {/* Modals, drawers, etc remain unchanged */}
    </div>
  );
}

/* ---------------------------------------------
   Styles
--------------------------------------------- */
const navBtnStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: '8px',
  backgroundColor: 'transparent',
  border: '1px solid #3A3A3A',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 600
};
