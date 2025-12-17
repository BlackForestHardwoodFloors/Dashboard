import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus,
  Menu,
  MapPin,
  Clock,
  X,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  Search
} from 'lucide-react';
import { SidebarEnhanced } from './SidebarEnhanced';
import BoardroomNewClientModal from './BoardroomNewClientModal';

interface Appointment {
  id: number;
  contactName?: string;
  firstName?: string;
  lastName?: string;
  contact?: string;
  location?: string;
  address?: string;
  region?: string;
  purpose: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  description?: string;
  employeeName?: number;
  employee?: { firstName: string; lastName: string };
  createdAt?: string;
  createdTime?: string;
}

interface Contact {
  id: number;
  firstName: string;
  lastName?: string;
  companyName?: string;
  email?: string;
  phone: string;
  additionalPhone?: string;
  message?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  contact: string;
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  purpose: string;
  employeeName: string;
  description: string;
}

interface NewClientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  additionalPhone: string;
  companyName: string;
  message: string;
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function getDaysAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 Day Ago';
  if (diffDays < 0) return `In ${Math.abs(diffDays)} days`;
  return `${diffDays} Days Ago`;
}

function getTypeBadgeColor(type: string): { bg: string; text: string } {
  switch (type?.toLowerCase()) {
    case 'onsite visit':
      return { bg: '#E67E22', text: '#FFFFFF' };
    case 'project':
      return { bg: '#3498DB', text: '#FFFFFF' };
    case 'general':
      return { bg: '#27AE60', text: '#FFFFFF' };
    case 'wood delivery':
      return { bg: '#8E44AD', text: '#FFFFFF' };
    default:
      return { bg: '#C9A049', text: '#FFFFFF' };
  }
}

function formatPurpose(purpose: string): string {
  return purpose.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Extract last name from contact string like "STEVE OSBORN" -> "Osborn"
function getLastNameFromContact(contact?: string): string {
  if (!contact) return '';
  const parts = contact.trim().split(' ');
  if (parts.length > 1) {
    const lastName = parts[parts.length - 1];
    return lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
  }
  return contact.charAt(0).toUpperCase() + contact.slice(1).toLowerCase();
}

// Format contact name properly (e.g., "STEVE OSBORN" -> "Steve Osborn")
function formatContactName(contact?: string): string {
  if (!contact) return 'No Name';
  return contact.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

const initialFormData: FormData = {
  firstName: '', lastName: '', contact: '', location: '',
  startDate: '', startTime: '08:00', endDate: '', endTime: '09:00',
  purpose: 'Onsite Visit', employeeName: '2', description: ''
};

// Generate time options in 15-minute intervals
const generateTimeOptions = () => {
  const times: { value: string; label: string }[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const h = hour.toString().padStart(2, '0');
      const m = minute.toString().padStart(2, '0');
      const value = `${h}:${m}`;
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const ampm = hour < 12 ? 'AM' : 'PM';
      const label = `${hour12}:${m.padStart(2, '0')} ${ampm}`;
      times.push({ value, label });
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

const initialNewClientFormData: NewClientFormData = {
  firstName: '', lastName: '', email: '', phone: '',
  additionalPhone: '', companyName: '', message: ''
};

export default function CalendarPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showBookModal, setShowBookModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [showBoardroomClientModal, setShowBoardroomClientModal] = useState(false);
  const [newClientFormData, setNewClientFormData] = useState<NewClientFormData>(initialNewClientFormData);
  const [newClientLoading, setNewClientLoading] = useState(false);
  const [newClientError, setNewClientError] = useState<string | null>(null);
  
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);
  
  // Date picker state
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [datePickerMonth, setDatePickerMonth] = useState(new Date());

  const bgColor = '#1E1E1E';
  const cardBg = '#2D2D2D';
  const borderColor = '#3D3D3D';
  const textColor = '#FFFFFF';
  const textMuted = '#A0A0A0';
  const accent = '#C9A049';

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchAppointments();
    fetchContacts();
  }, []);

  // Listen for appointment updates from JobCardDrawer
  useEffect(() => {
    const handleUpdate = () => {
      fetchAppointments();
    };
    window.addEventListener('appointmentUpdated', handleUpdate);
    return () => window.removeEventListener('appointmentUpdated', handleUpdate);
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/appointments/get-appointments`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      setAppointments(data.data?.appointments || data.appointments || data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/contact/get-contact`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch contacts');
      const data = await response.json();
      const contactsList = data.data?.contacts || data.contacts || data.data || data || [];
      setContacts(Array.isArray(contactsList) ? contactsList : []);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setContacts([]);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const searchLower = clientSearchTerm.toLowerCase();
    const fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.toLowerCase();
    const company = (contact.companyName || '').toLowerCase();
    const phone = (contact.phone || '').toLowerCase();
    const email = (contact.email || '').toLowerCase();
    return fullName.includes(searchLower) || company.includes(searchLower) || phone.includes(searchLower) || email.includes(searchLower);
  });

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setFormData(prev => ({
      ...prev,
      contact: contact.id.toString(),
      firstName: contact.firstName || '',
      lastName: contact.lastName || ''
    }));
    setShowClientDropdown(false);
    setClientSearchTerm('');
  };

  const handleClearContact = () => {
    setSelectedContact(null);
    setFormData(prev => ({ ...prev, contact: '', firstName: '', lastName: '' }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
  };

  const handleNewClientInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewClientFormData(prev => ({ ...prev, [name]: value }));
    if (newClientError) setNewClientError(null);
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewClientLoading(true);
    setNewClientError(null);
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!newClientFormData.firstName || !newClientFormData.phone) {
        setNewClientError('First name and phone are required');
        setNewClientLoading(false);
        return;
      }
      const payload = {
        firstName: newClientFormData.firstName,
        lastName: newClientFormData.lastName,
        email: newClientFormData.email || null,
        phone: newClientFormData.phone,
        additionalPhone: newClientFormData.additionalPhone || null,
        companyName: newClientFormData.companyName || null,
        message: newClientFormData.message || null,
        clientSource: 'Direct',
        operationsManager: user.id || 2,
        createdBy: `${user.firstName || 'System'} ${user.lastName || ''}`.trim(),
        modifiedBy: `${user.firstName || 'System'} ${user.lastName || ''}`.trim()
      };
      const response = await fetch(`${API_URL}/contact/create-contact`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create client');
      const newClient = data.data || data;
      await fetchContacts();
      if (newClient && newClient.id) {
        setSelectedContact(newClient);
        setFormData(prev => ({
          ...prev,
          contact: newClient.id.toString(),
          firstName: newClient.firstName || '',
          lastName: newClient.lastName || ''
        }));
      }
      setShowNewClientForm(false);
      setNewClientFormData(initialNewClientFormData);
    } catch (err: any) {
      console.error('Error creating client:', err);
      setNewClientError(err.message || 'Failed to create client');
    } finally {
      setNewClientLoading(false);
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(null);
    try {
      const token = localStorage.getItem('token');
      if (!formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime || !formData.purpose) {
        setFormError('Please fill in all required fields');
        setFormLoading(false);
        return;
      }
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      if (startDateTime >= endDateTime) {
        setFormError('End time must be after start time');
        setFormLoading(false);
        return;
      }
      
      // Validate required fields for database
      if (!formData.location) {
        setFormError('Address is required');
        setFormLoading(false);
        return;
      }
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Build contact string from name or selected contact
      const contactStr = selectedContact 
        ? `${selectedContact.firstName || ''} ${selectedContact.lastName || ''}`.trim()
        : `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'Walk-in';
      
      const payload = {
        contact: contactStr,
        location: formData.location,
        startDate: formData.startDate,
        startTime: formData.startTime,
        endDate: formData.endDate,
        endTime: formData.endTime,
        purpose: formData.purpose,
        employeeName: formData.employeeName ? parseInt(formData.employeeName) : 2,
        description: formData.description || ''
      };
      console.log('Creating appointment with payload:', payload);
      const response = await fetch(`${API_URL}/appointments/create-appointment`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create appointment');
      setFormSuccess('Appointment created successfully!');
      setFormData(initialFormData);
      setSelectedContact(null);
      await fetchAppointments();
      setTimeout(() => { setShowBookModal(false); setFormSuccess(null); }, 1500);
    } catch (err: any) {
      console.error('Error creating appointment:', err);
      setFormError(err.message || 'Failed to create appointment');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAppointment) return;
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(null);
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Build contact string from name or selected contact
      const contactStr = selectedContact 
        ? `${selectedContact.firstName || ''} ${selectedContact.lastName || ''}`.trim()
        : `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'Walk-in';
      
      const payload = {
        contact: contactStr,
        location: formData.location,
        startDate: formData.startDate,
        startTime: formData.startTime,
        endDate: formData.endDate,
        endTime: formData.endTime,
        purpose: formData.purpose,
        employeeName: formData.employeeName ? parseInt(formData.employeeName) : 2,
        description: formData.description || ''
      };
      const response = await fetch(`${API_URL}/appointments/update-appointment/${editingAppointment.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update appointment');
      setFormSuccess('Appointment updated successfully!');
      await fetchAppointments();
      setTimeout(() => {
        setShowBookModal(false);
        setEditingAppointment(null);
        setFormData(initialFormData);
        setSelectedContact(null);
        setFormSuccess(null);
      }, 1500);
    } catch (err: any) {
      console.error('Error updating appointment:', err);
      setFormError(err.message || 'Failed to update appointment');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteAppointment = async (appointmentId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/appointments/delete-appointment/${appointmentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to delete appointment');
      await fetchAppointments();
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting appointment:', err);
      alert('Failed to delete appointment');
    }
  };

  const openEditModal = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    // Parse contact name back into first/last name
    const contactParts = (appointment.contact || '').split(' ');
    const firstName = contactParts[0] || '';
    const lastName = contactParts.slice(1).join(' ') || '';
    
    setSelectedContact(null);
    setFormData({
      firstName: firstName,
      lastName: lastName,
      contact: '',
      location: appointment.location || appointment.address || '',
      startDate: appointment.startDate,
      startTime: appointment.startTime,
      endDate: appointment.endDate,
      endTime: appointment.endTime,
      purpose: appointment.purpose,
      employeeName: appointment.employeeName?.toString() || '2',
      description: appointment.description || ''
    });
    setShowBookModal(true);
  };

  const openNewAppointmentModal = () => {
    setEditingAppointment(null);
    setSelectedContact(null);
    setFormData(initialFormData);
    setFormError(null);
    setFormSuccess(null);
    setShowNewClientForm(false);
    setShowBookModal(true);
  };

  const closeModal = () => {
    setShowBookModal(false);
    setEditingAppointment(null);
    setSelectedContact(null);
    setFormData(initialFormData);
    setFormError(null);
    setFormSuccess(null);
    setShowNewClientForm(false);
    setNewClientFormData(initialNewClientFormData);
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const days = [];
    for (let i = 0; i < startPadding; i++) {
      days.push({ date: new Date(year, month, -startPadding + i + 1), isCurrentMonth: false });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.startDate);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  const handleDayClick = (date: Date) => {
    setSelectedDay(date);
    setShowDayModal(true);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNamesShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Generate mini calendar for date picker
  const generateMiniCalendarDays = (month: Date) => {
    const year = month.getFullYear();
    const m = month.getMonth();
    const firstDay = new Date(year, m, 1);
    const lastDay = new Date(year, m + 1, 0);
    const startPadding = firstDay.getDay();
    const days: { date: Date; isCurrentMonth: boolean }[] = [];
    for (let i = 0; i < startPadding; i++) {
      days.push({ date: new Date(year, m, -startPadding + i + 1), isCurrentMonth: false });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, m, i), isCurrentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, m + 1, i), isCurrentMonth: false });
    }
    return days;
  };
  
  // Format date for display
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'Select date';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Handle date selection from picker
  const handleDateSelect = (date: Date, field: 'startDate' | 'endDate') => {
    const dateStr = date.toISOString().split('T')[0];
    setFormData(prev => {
      const updated = { ...prev, [field]: dateStr };
      // If setting start date and end date is empty or before start, set end date same as start
      if (field === 'startDate' && (!prev.endDate || prev.endDate < dateStr)) {
        updated.endDate = dateStr;
      }
      return updated;
    });
    if (field === 'startDate') {
      setShowStartDatePicker(false);
    } else {
      setShowEndDatePicker(false);
    }
  };
  
  // Handle time change and auto-adjust end time
  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // If changing start time, auto-set end time to 1 hour later
      if (field === 'startTime') {
        const [hours, minutes] = value.split(':').map(Number);
        const endHour = (hours + 1) % 24;
        updated.endTime = `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
      return updated;
    });
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  
  // Get display name for appointments - shows formatted contact name
  const getDisplayName = (apt: Appointment) => formatContactName(apt.contact);
  
  // Check if appointment should show time (not a multi-day job)
  const shouldShowTimeInCalendar = (apt: Appointment): boolean => {
    const p = apt.purpose?.toLowerCase() || '';
    // These are timed appointments - always show time
    if (p.includes('onsite') || p.includes('visit') || p.includes('touchup') || p.includes('touch-up') || p.includes('delivery') || p.includes('pickup') || p.includes('meeting')) {
      return true;
    }
    // For jobs/projects, check if multi-day
    if (p.includes('job') || p.includes('project') || p.includes('install') || p.includes('sand') || p.includes('finish')) {
      // If dates are same or no end date, it's single day - could show time
      if (!apt.endDate || apt.startDate === apt.endDate) {
        return true;
      }
      // Multi-day job - don't show time
      return false;
    }
    return true; // Default: show time
  };
  
  // Check if it's a multi-day job
  const isMultiDayJob = (apt: Appointment): boolean => {
    const p = apt.purpose?.toLowerCase() || '';
    if (p.includes('job') || p.includes('project') || p.includes('install') || p.includes('sand') || p.includes('finish')) {
      if (apt.endDate && apt.startDate !== apt.endDate) {
        return true;
      }
    }
    return false;
  };
  
  // Format time for display (e.g., "8:00 AM")
  const formatTimeForCalendar = (time: string): string => {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')}${period}`;
  };
  
  // Get region from location (extract from address or use region field)
  const getRegionFromAppointment = (apt: Appointment): string => {
    if (apt.region) return apt.region;
    // Try to extract region from location/address
    const loc = apt.location || apt.address || '';
    // Common Spokane area patterns
    if (loc.toLowerCase().includes('spokane valley')) return 'Spokane Valley';
    if (loc.toLowerCase().includes('liberty lake')) return 'Liberty Lake';
    if (loc.toLowerCase().includes('cheney')) return 'Cheney';
    if (loc.toLowerCase().includes('cda') || loc.toLowerCase().includes('coeur d')) return 'CDA';
    if (loc.toLowerCase().includes('post falls')) return 'Post Falls';
    return '';
  };
  
  // Get calendar entry data - returns object with line1 (time), line2 (name), and whether to show multi-line
  const getCalendarEntry = (apt: Appointment): { line1: string; line2: string; showTwoLines: boolean } => {
    const showTime = shouldShowTimeInCalendar(apt);
    const multiDay = isMultiDayJob(apt);
    const lastName = getLastNameFromContact(apt.contact);
    
    if (multiDay) {
      // Multi-day jobs: Just show name, single line
      return {
        line1: '',
        line2: lastName || formatContactName(apt.contact) || 'Job',
        showTwoLines: false
      };
    }
    
    // Timed appointments: 3 lines (time, name, region pill)
    // Line 1: Time only
    let line1 = '';
    if (showTime && apt.startTime) {
      line1 = formatTimeForCalendar(apt.startTime);
    }
    
    const line2 = lastName || formatContactName(apt.contact) || 'Appointment';
    
    return {
      line1,
      line2,
      showTwoLines: true
    };
  };
  
  // Legacy function for backwards compatibility
  const getCalendarLabel = (apt: Appointment) => {
    const entry = getCalendarEntry(apt);
    if (entry.showTwoLines && entry.line1) {
      return `${entry.line1} - ${entry.line2}`;
    }
    return entry.line2 || entry.line1;
  };
  
  const getDisplayAddress = (apt: Appointment) => apt.location || apt.address || 'No address';
  const getContactDisplayName = (contact: Contact) => `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Unnamed Contact';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: bgColor }}>
      {!isMobile && <SidebarEnhanced activePage="Calendar" onNavigate={onNavigate} darkMode={true} />}

      {isMobile && showMobileSidebar && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 }} onClick={() => setShowMobileSidebar(false)}>
          <div style={{ width: '280px', height: '100%' }} onClick={e => e.stopPropagation()}>
            <SidebarEnhanced activePage="Calendar" onNavigate={(page) => { setShowMobileSidebar(false); onNavigate?.(page); }} darkMode={true} />
          </div>
        </div>
      )}

      <div style={{ flex: 1, marginLeft: isMobile ? 0 : '200px', padding: isMobile ? '16px' : '24px', overflow: 'auto' }}>
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <button onClick={() => setShowMobileSidebar(true)} style={{ padding: '8px', backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderRadius: '8px', cursor: 'pointer' }}>
              <Menu size={24} color={textColor} />
            </button>
            <h1 style={{ fontSize: '24px', color: textColor, margin: 0, fontWeight: 'bold' }}>Appointments</h1>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: '16px', marginBottom: '24px' }}>
          <div>
            {!isMobile && <h1 style={{ fontSize: '28px', color: textColor, margin: '0 0 4px 0', fontWeight: 'bold' }}>Appointments</h1>}
            <p style={{ fontSize: '14px', color: textMuted, margin: 0 }}>Schedule appointments, manage jobs, and track crew assignments</p>
          </div>
          <button onClick={openNewAppointmentModal} style={{ padding: '12px 20px', backgroundColor: accent, color: '#FFFFFF', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 0 0 #A88438' }}>
            <Plus size={18} />New Appointment
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
            <div style={{ backgroundColor: cardBg, borderRadius: '12px', border: `1px solid ${borderColor}`, overflow: 'hidden', height: '400px' }}>
              {GOOGLE_MAPS_API_KEY ? (
                <iframe title="Appointments Map" width="100%" height="100%" frameBorder="0" src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=Spokane,WA&zoom=11`} allowFullScreen />
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', color: textMuted }}>
                  <MapPin size={48} /><p>Map requires Google Maps API key</p>
                </div>
              )}
            </div>

            <div style={{ backgroundColor: cardBg, borderRadius: '12px', border: `1px solid ${borderColor}`, padding: '16px', maxHeight: '400px', overflowY: 'auto' }}>
              <h3 style={{ color: textColor, fontSize: '16px', margin: '0 0 16px 0', fontWeight: '600' }}>Recent Appointments</h3>
              {loading ? (
                <div style={{ color: textMuted, textAlign: 'center', padding: '20px' }}>Loading appointments...</div>
              ) : appointments.length === 0 ? (
                <div style={{ color: textMuted, textAlign: 'center', padding: '20px' }}>No appointments found</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {appointments.slice(0, 10).map(apt => {
                    const typeColors = getTypeBadgeColor(apt.purpose);
                    return (
                      <div key={apt.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', backgroundColor: '#252525', borderRadius: '8px', cursor: 'pointer', position: 'relative' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: typeColors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '14px', fontWeight: 'bold', color: typeColors.text }}>
                          {apt.purpose?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                            <span style={{ color: textColor, fontWeight: '600', fontSize: '14px' }}>{getDisplayName(apt)}</span>
                            <span style={{ color: textMuted, fontSize: '12px', flexShrink: 0, marginLeft: '8px' }}>{getDaysAgo(apt.startDate)}</span>
                          </div>
                          <div style={{ color: textMuted, fontSize: '12px', marginBottom: '4px' }}>{formatPurpose(apt.purpose)}</div>
                          <div style={{ color: textMuted, fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getDisplayAddress(apt)}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                          <button onClick={(e) => { e.stopPropagation(); openEditModal(apt); }} style={{ padding: '6px', backgroundColor: 'transparent', border: `1px solid ${borderColor}`, borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Edit">
                            <Edit2 size={14} color={textMuted} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(apt.id); }} style={{ padding: '6px', backgroundColor: 'transparent', border: `1px solid ${borderColor}`, borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete">
                            <Trash2 size={14} color="#E74C3C" />
                          </button>
                        </div>
                        {showDeleteConfirm === apt.id && (
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}>
                            <span style={{ color: textColor, fontSize: '13px' }}>Delete?</span>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteAppointment(apt.id); }} style={{ padding: '6px 12px', backgroundColor: '#E74C3C', border: 'none', borderRadius: '6px', color: '#FFFFFF', fontSize: '12px', cursor: 'pointer' }}>Yes</button>
                            <button onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(null); }} style={{ padding: '6px 12px', backgroundColor: borderColor, border: 'none', borderRadius: '6px', color: textColor, fontSize: '12px', cursor: 'pointer' }}>No</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div style={{ backgroundColor: cardBg, borderRadius: '12px', border: `1px solid ${borderColor}`, padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button onClick={prevMonth} style={{ padding: '8px', backgroundColor: '#252525', border: `1px solid ${borderColor}`, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronLeft size={20} color={textColor} />
                </button>
                <button onClick={nextMonth} style={{ padding: '8px', backgroundColor: '#252525', border: `1px solid ${borderColor}`, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronRight size={20} color={textColor} />
                </button>
              </div>
              <h2 style={{ color: textColor, fontSize: '20px', margin: 0, fontWeight: '600' }}>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
              <div style={{ display: 'flex', backgroundColor: '#252525', borderRadius: '8px', border: `1px solid ${borderColor}`, overflow: 'hidden' }}>
                {['month', 'week', 'day'].map((mode) => (
                  <button key={mode} onClick={() => setViewMode(mode as any)} style={{ padding: '8px 16px', backgroundColor: viewMode === mode ? accent : 'transparent', color: viewMode === mode ? '#FFFFFF' : textMuted, border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '500', textTransform: 'capitalize' }}>{mode}</button>
                ))}
              </div>
            </div>

            {viewMode === 'month' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', marginBottom: '8px' }}>
                  {dayNames.map(day => (<div key={day} style={{ textAlign: 'center', padding: '8px', color: textMuted, fontSize: '13px', fontWeight: '600' }}>{day}</div>))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: borderColor }}>
                  {calendarDays.map((day, index) => {
                    const dayAppointments = getAppointmentsForDay(day.date);
                    const isToday = day.date.toDateString() === new Date().toDateString();
                    return (
                      <div key={index} onClick={() => handleDayClick(day.date)} style={{ backgroundColor: cardBg, minHeight: '100px', padding: '8px', opacity: day.isCurrentMonth ? 1 : 0.4, cursor: 'pointer' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
                          <span style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: isToday ? accent : 'transparent', color: isToday ? '#FFFFFF' : textColor, fontSize: '13px', fontWeight: isToday ? '600' : '400' }}>{day.date.getDate()}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          {dayAppointments.slice(0, 2).map((apt, i) => {
                            const typeColors = getTypeBadgeColor(apt.purpose);
                            const entry = getCalendarEntry(apt);
                            const region = getRegionFromAppointment(apt);
                            return (
                              <div 
                                key={i} 
                                onClick={(e) => { e.stopPropagation(); if (onNavigate) onNavigate(`JobCard/${apt.id}`); }} 
                                style={{ 
                                  backgroundColor: typeColors.bg, 
                                  color: typeColors.text, 
                                  fontSize: '9px', 
                                  padding: entry.showTwoLines ? '3px 4px' : '2px 4px', 
                                  borderRadius: '3px', 
                                  cursor: 'pointer',
                                  lineHeight: '1.2'
                                }}
                              >
                                {entry.showTwoLines ? (
                                  <>
                                    {/* Line 1: Region pill (small, above time) */}
                                    {region && (
                                      <div style={{ marginBottom: '1px' }}>
                                        <span style={{ 
                                          display: 'inline-block',
                                          padding: '0px 4px', 
                                          backgroundColor: '#D4C5A9', 
                                          color: '#4A4235', 
                                          borderRadius: '6px', 
                                          fontSize: '6px', 
                                          fontWeight: '600',
                                          textTransform: 'uppercase',
                                          letterSpacing: '0.2px'
                                        }}>{region}</span>
                                      </div>
                                    )}
                                    {/* Line 2: Time */}
                                    {entry.line1 && <div style={{ fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.line1}</div>}
                                    {/* Line 3: Name */}
                                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.line2}</div>
                                  </>
                                ) : (
                                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500' }}>{entry.line2 || entry.line1}</div>
                                )}
                              </div>
                            );
                          })}
                          {dayAppointments.length > 2 && (<div style={{ fontSize: '9px', color: textMuted, textAlign: 'center' }}>+{dayAppointments.length - 2} more</div>)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {viewMode === 'week' && (<div style={{ padding: '40px', textAlign: 'center', color: textMuted }}><CalendarIcon size={48} style={{ marginBottom: '16px', opacity: 0.5 }} /><p>Week view coming soon...</p></div>)}
            {viewMode === 'day' && (<div style={{ padding: '40px', textAlign: 'center', color: textMuted }}><CalendarIcon size={48} style={{ marginBottom: '16px', opacity: 0.5 }} /><p>Day view coming soon...</p></div>)}
          </div>
        </div>

        {showDayModal && selectedDay && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div style={{ backgroundColor: cardBg, borderRadius: '16px', width: '100%', maxWidth: '500px', maxHeight: '80vh', overflow: 'auto', border: `1px solid ${borderColor}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: `1px solid ${borderColor}` }}>
                <h2 style={{ color: textColor, margin: 0, fontSize: '18px' }}>{selectedDay.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h2>
                <button onClick={() => setShowDayModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><X size={24} color={textMuted} /></button>
              </div>
              <div style={{ padding: '20px' }}>
                {(() => {
                  const dayAppts = getAppointmentsForDay(selectedDay);
                  if (dayAppts.length === 0) {
                    return (
                      <div style={{ textAlign: 'center', color: textMuted, padding: '40px 20px' }}>
                        <CalendarIcon size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                        <p>No appointments for this day</p>
                        <button onClick={() => { setShowDayModal(false); setFormData(prev => ({ ...prev, startDate: selectedDay.toISOString().split('T')[0], endDate: selectedDay.toISOString().split('T')[0] })); openNewAppointmentModal(); }} style={{ marginTop: '16px', padding: '10px 20px', backgroundColor: accent, color: '#FFFFFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
                          <Plus size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />Add Appointment
                        </button>
                      </div>
                    );
                  }
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {dayAppts.map(apt => {
                        const typeColors = getTypeBadgeColor(apt.purpose);
                        return (
                          <div key={apt.id} style={{ padding: '16px', backgroundColor: '#252525', borderRadius: '10px', borderLeft: `4px solid ${typeColors.bg}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                              <div>
                                <div style={{ color: textColor, fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>{getDisplayName(apt)}</div>
                                <div style={{ display: 'inline-block', padding: '2px 8px', backgroundColor: typeColors.bg, color: typeColors.text, borderRadius: '4px', fontSize: '11px', fontWeight: '500' }}>{formatPurpose(apt.purpose)}</div>
                              </div>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button onClick={() => { setShowDayModal(false); openEditModal(apt); }} style={{ padding: '6px', backgroundColor: 'transparent', border: `1px solid ${borderColor}`, borderRadius: '6px', cursor: 'pointer' }}><Edit2 size={14} color={textMuted} /></button>
                                <button onClick={() => handleDeleteAppointment(apt.id)} style={{ padding: '6px', backgroundColor: 'transparent', border: `1px solid ${borderColor}`, borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={14} color="#E74C3C" /></button>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: textMuted, fontSize: '13px', marginBottom: '6px' }}><Clock size={14} />{apt.startTime} - {apt.endTime}</div>
                            {getDisplayAddress(apt) !== 'No address' && (<div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: textMuted, fontSize: '13px' }}><MapPin size={14} style={{ flexShrink: 0, marginTop: '2px' }} />{getDisplayAddress(apt)}</div>)}
                            {apt.description && (<div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#1A1A1A', borderRadius: '6px', color: textMuted, fontSize: '13px' }}>{apt.description}</div>)}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {showBookModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div style={{ backgroundColor: cardBg, borderRadius: '16px', width: '100%', maxWidth: '550px', maxHeight: '90vh', overflow: 'auto', border: `1px solid ${borderColor}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: `1px solid ${borderColor}` }}>
                <h2 style={{ color: textColor, margin: 0, fontSize: '20px' }}>{showNewClientForm ? 'Add New Client' : (editingAppointment ? 'Edit Appointment' : 'Book Appointment')}</h2>
                <button onClick={showNewClientForm ? () => setShowNewClientForm(false) : closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><X size={24} color={textMuted} /></button>
              </div>

              {showNewClientForm ? (
                <form onSubmit={handleCreateClient}>
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {newClientError && (<div style={{ padding: '12px', backgroundColor: 'rgba(231, 76, 60, 0.2)', border: '1px solid #E74C3C', borderRadius: '8px', color: '#E74C3C', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertCircle size={18} />{newClientError}</div>)}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', color: accent, fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>First Name *</label>
                        <input type="text" name="firstName" value={newClientFormData.firstName} onChange={handleNewClientInputChange} placeholder="Enter first name" required style={{ width: '100%', padding: '12px', backgroundColor: '#1A1A1A', border: `1px solid ${borderColor}`, borderRadius: '8px', color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', color: accent, fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Last Name</label>
                        <input type="text" name="lastName" value={newClientFormData.lastName} onChange={handleNewClientInputChange} placeholder="Enter last name" style={{ width: '100%', padding: '12px', backgroundColor: '#1A1A1A', border: `1px solid ${borderColor}`, borderRadius: '8px', color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', color: accent, fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Phone *</label>
                      <input type="tel" name="phone" value={newClientFormData.phone} onChange={handleNewClientInputChange} placeholder="Enter phone number" required style={{ width: '100%', padding: '12px', backgroundColor: '#1A1A1A', border: `1px solid ${borderColor}`, borderRadius: '8px', color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: accent, fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Email</label>
                      <input type="email" name="email" value={newClientFormData.email} onChange={handleNewClientInputChange} placeholder="Enter email address" style={{ width: '100%', padding: '12px', backgroundColor: '#1A1A1A', border: `1px solid ${borderColor}`, borderRadius: '8px', color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: accent, fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Company Name</label>
                      <input type="text" name="companyName" value={newClientFormData.companyName} onChange={handleNewClientInputChange} placeholder="Enter company name (optional)" style={{ width: '100%', padding: '12px', backgroundColor: '#1A1A1A', border: `1px solid ${borderColor}`, borderRadius: '8px', color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: accent, fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Notes</label>
                      <textarea name="message" value={newClientFormData.message} onChange={handleNewClientInputChange} placeholder="Add notes about this client" rows={3} style={{ width: '100%', padding: '12px', backgroundColor: '#1A1A1A', border: `1px solid ${borderColor}`, borderRadius: '8px', color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
                    </div>
                  </div>
                  <div style={{ padding: '20px', borderTop: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button type="button" onClick={() => setShowNewClientForm(false)} disabled={newClientLoading} style={{ padding: '12px 24px', backgroundColor: 'transparent', border: `1px solid ${borderColor}`, borderRadius: '8px', color: textMuted, fontSize: '14px', cursor: newClientLoading ? 'not-allowed' : 'pointer', opacity: newClientLoading ? 0.5 : 1 }}>Back</button>
                    <button type="submit" disabled={newClientLoading} style={{ padding: '12px 24px', backgroundColor: newClientLoading ? '#888' : '#27AE60', border: 'none', borderRadius: '8px', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: newClientLoading ? 'not-allowed' : 'pointer', boxShadow: newClientLoading ? 'none' : '0 3px 0 0 #1E8449' }}>{newClientLoading ? 'Creating...' : 'Create Client'}</button>
                  </div>
                </form>
              ) : (
                <form onSubmit={editingAppointment ? handleUpdateAppointment : handleCreateAppointment}>
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {formSuccess && (<div style={{ padding: '12px', backgroundColor: 'rgba(39, 174, 96, 0.2)', border: '1px solid #27AE60', borderRadius: '8px', color: '#27AE60', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={18} />{formSuccess}</div>)}
                    {formError && (<div style={{ padding: '12px', backgroundColor: 'rgba(231, 76, 60, 0.2)', border: '1px solid #E74C3C', borderRadius: '8px', color: '#E74C3C', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertCircle size={18} />{formError}</div>)}

                    <div>
                      <label style={{ display: 'block', color: accent, fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Client</label>
                      {selectedContact ? (
                        <div style={{ padding: '12px', backgroundColor: '#1A1A1A', border: `1px solid ${accent}`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: '600', fontSize: '16px' }}>{selectedContact.firstName?.charAt(0).toUpperCase() || 'C'}</div>
                            <div>
                              <div style={{ color: textColor, fontWeight: '500', fontSize: '14px' }}>{getContactDisplayName(selectedContact)}</div>
                              <div style={{ color: textMuted, fontSize: '12px' }}>{selectedContact.phone}{selectedContact.email && ` • ${selectedContact.email}`}</div>
                            </div>
                          </div>
                          <button type="button" onClick={handleClearContact} style={{ padding: '6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}><X size={18} color={textMuted} /></button>
                        </div>
                      ) : (
                        <div style={{ position: 'relative' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                              <Search size={18} color={textMuted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                              <input type="text" value={clientSearchTerm} onChange={(e) => { setClientSearchTerm(e.target.value); setShowClientDropdown(true); }} onFocus={() => setShowClientDropdown(true)} placeholder="Search clients..." style={{ width: '100%', padding: '12px 12px 12px 40px', backgroundColor: '#1A1A1A', border: `1px solid ${borderColor}`, borderRadius: '8px', color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <button type="button" onClick={() => setShowBoardroomClientModal(true)} style={{ padding: '12px 16px', backgroundColor: '#27AE60', border: 'none', borderRadius: '8px', color: '#FFFFFF', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}><Plus size={16} />New</button>
                          </div>
                          {showClientDropdown && (
                            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', backgroundColor: '#1A1A1A', border: `1px solid ${borderColor}`, borderRadius: '8px', maxHeight: '200px', overflowY: 'auto', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                              {filteredContacts.length === 0 ? (
                                <div style={{ padding: '16px', textAlign: 'center', color: textMuted, fontSize: '13px' }}>{clientSearchTerm ? 'No clients found' : 'Start typing to search'}</div>
                              ) : (
                                filteredContacts.slice(0, 10).map(contact => (
                                  <div key={contact.id} onClick={() => handleSelectContact(contact)} style={{ padding: '12px', cursor: 'pointer', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#3498DB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: '600', fontSize: '14px', flexShrink: 0 }}>{contact.firstName?.charAt(0).toUpperCase() || 'C'}</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ color: textColor, fontWeight: '500', fontSize: '14px' }}>{getContactDisplayName(contact)}</div>
                                      <div style={{ color: textMuted, fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contact.phone}{contact.companyName && ` • ${contact.companyName}`}</div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {showClientDropdown && (<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }} onClick={() => setShowClientDropdown(false)} />)}

                    {!selectedContact && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', color: textMuted, fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Or enter name manually:</label>
                          <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First name" style={{ width: '100%', padding: '12px', backgroundColor: '#1A1A1A', border: `1px solid ${borderColor}`, borderRadius: '8px', color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: textMuted, fontSize: '13px', marginBottom: '6px', fontWeight: '500', opacity: 0 }}>Last</label>
                          <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last name" style={{ width: '100%', padding: '12px', backgroundColor: '#1A1A1A', border: `1px solid ${borderColor}`, borderRadius: '8px', color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                      </div>
                    )}

                    <div>
                      <label style={{ display: 'block', color: accent, fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Address</label>
                      <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Enter address" style={{ width: '100%', padding: '12px', backgroundColor: '#1A1A1A', border: `1px solid ${borderColor}`, borderRadius: '8px', color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ position: 'relative' }}>
                        <label style={{ display: 'block', color: accent, fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Start Date *</label>
                        <button type="button" onClick={() => { setShowStartDatePicker(!showStartDatePicker); setShowEndDatePicker(false); setDatePickerMonth(formData.startDate ? new Date(formData.startDate + 'T00:00:00') : new Date()); }} style={{ width: '100%', padding: '12px', backgroundColor: '#1A1A1A', border: `1px solid ${showStartDatePicker ? accent : borderColor}`, borderRadius: '8px', color: formData.startDate ? textColor : textMuted, fontSize: '14px', outline: 'none', boxSizing: 'border-box', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{formatDateDisplay(formData.startDate)}</span>
                          <CalendarIcon size={18} color={textMuted} />
                        </button>
                        {showStartDatePicker && (
                          <>
                            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 15 }} onClick={() => setShowStartDatePicker(false)} />
                            <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px', backgroundColor: '#1A1A1A', border: `1px solid ${borderColor}`, borderRadius: '12px', padding: '12px', zIndex: 20, boxShadow: '0 8px 24px rgba(0,0,0,0.4)', width: '280px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <button type="button" onClick={() => setDatePickerMonth(new Date(datePickerMonth.getFullYear(), datePickerMonth.getMonth() - 1))} style={{ padding: '6px', backgroundColor: '#252525', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><ChevronLeft size={16} color={textColor} /></button>
                                <span style={{ color: textColor, fontWeight: '600', fontSize: '14px' }}>{monthNames[datePickerMonth.getMonth()]} {datePickerMonth.getFullYear()}</span>
                                <button type="button" onClick={() => setDatePickerMonth(new Date(datePickerMonth.getFullYear(), datePickerMonth.getMonth() + 1))} style={{ padding: '6px', backgroundColor: '#252525', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><ChevronRight size={16} color={textColor} /></button>
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
                                {dayNamesShort.map((d, i) => (<div key={i} style={{ textAlign: 'center', padding: '4px', color: textMuted, fontSize: '11px', fontWeight: '600' }}>{d}</div>))}
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                                {generateMiniCalendarDays(datePickerMonth).map((day, i) => {
                                  const isSelected = formData.startDate === day.date.toISOString().split('T')[0];
                                  const isToday = day.date.toDateString() === new Date().toDateString();
                                  return (
                                    <button type="button" key={i} onClick={() => handleDateSelect(day.date, 'startDate')} style={{ padding: '8px 4px', backgroundColor: isSelected ? accent : 'transparent', border: isToday && !isSelected ? `1px solid ${accent}` : 'none', borderRadius: '6px', color: isSelected ? '#FFF' : day.isCurrentMonth ? textColor : textMuted, fontSize: '13px', cursor: 'pointer', opacity: day.isCurrentMonth ? 1 : 0.4 }}>{day.date.getDate()}</button>
                                  );
                                })}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div>
                        <label style={{ display: 'block', color: accent, fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Start Time *</label>
                        <select value={formData.startTime} onChange={(e) => handleTimeChange('startTime', e.target.value)} required style={{ width: '100%', padding: '12px', backgroundColor: '#1A1A1A', border: `1px solid ${borderColor}`, borderRadius: '8px', color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}>
                          {timeOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ position: 'relative' }}>
                        <label style={{ display: 'block', color: accent, fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>End Date *</label>
                        <button type="button" onClick={() => { setShowEndDatePicker(!showEndDatePicker); setShowStartDatePicker(false); setDatePickerMonth(formData.endDate ? new Date(formData.endDate + 'T00:00:00') : new Date()); }} style={{ width: '100%', padding: '12px', backgroundColor: '#1A1A1A', border: `1px solid ${showEndDatePicker ? accent : borderColor}`, borderRadius: '8px', color: formData.endDate ? textColor : textMuted, fontSize: '14px', outline: 'none', boxSizing: 'border-box', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{formatDateDisplay(formData.endDate)}</span>
                          <CalendarIcon size={18} color={textMuted} />
                        </button>
                        {showEndDatePicker && (
                          <>
                            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 15 }} onClick={() => setShowEndDatePicker(false)} />
                            <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px', backgroundColor: '#1A1A1A', border: `1px solid ${borderColor}`, borderRadius: '12px', padding: '12px', zIndex: 20, boxShadow: '0 8px 24px rgba(0,0,0,0.4)', width: '280px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <button type="button" onClick={() => setDatePickerMonth(new Date(datePickerMonth.getFullYear(), datePickerMonth.getMonth() - 1))} style={{ padding: '6px', backgroundColor: '#252525', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><ChevronLeft size={16} color={textColor} /></button>
                                <span style={{ color: textColor, fontWeight: '600', fontSize: '14px' }}>{monthNames[datePickerMonth.getMonth()]} {datePickerMonth.getFullYear()}</span>
                                <button type="button" onClick={() => setDatePickerMonth(new Date(datePickerMonth.getFullYear(), datePickerMonth.getMonth() + 1))} style={{ padding: '6px', backgroundColor: '#252525', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><ChevronRight size={16} color={textColor} /></button>
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
                                {dayNamesShort.map((d, i) => (<div key={i} style={{ textAlign: 'center', padding: '4px', color: textMuted, fontSize: '11px', fontWeight: '600' }}>{d}</div>))}
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                                {generateMiniCalendarDays(datePickerMonth).map((day, i) => {
                                  const isSelected = formData.endDate === day.date.toISOString().split('T')[0];
                                  const isToday = day.date.toDateString() === new Date().toDateString();
                                  const isBeforeStart = formData.startDate && day.date.toISOString().split('T')[0] < formData.startDate;
                                  return (
                                    <button type="button" key={i} onClick={() => !isBeforeStart && handleDateSelect(day.date, 'endDate')} disabled={isBeforeStart} style={{ padding: '8px 4px', backgroundColor: isSelected ? accent : 'transparent', border: isToday && !isSelected ? `1px solid ${accent}` : 'none', borderRadius: '6px', color: isSelected ? '#FFF' : isBeforeStart ? '#555' : day.isCurrentMonth ? textColor : textMuted, fontSize: '13px', cursor: isBeforeStart ? 'not-allowed' : 'pointer', opacity: day.isCurrentMonth ? 1 : 0.4 }}>{day.date.getDate()}</button>
                                  );
                                })}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div>
                        <label style={{ display: 'block', color: accent, fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>End Time *</label>
                        <select value={formData.endTime} onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))} required style={{ width: '100%', padding: '12px', backgroundColor: '#1A1A1A', border: `1px solid ${borderColor}`, borderRadius: '8px', color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}>
                          {timeOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', color: accent, fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Purpose *</label>
                      <select name="purpose" value={formData.purpose} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', backgroundColor: '#1A1A1A', border: `1px solid ${borderColor}`, borderRadius: '8px', color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}>
                        <option value="Onsite Visit">Onsite Visit</option>
                        <option value="Project">Project</option>
                        <option value="General">General</option>
                        <option value="Wood Delivery">Wood Delivery</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', color: accent, fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Description</label>
                      <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter description" rows={3} style={{ width: '100%', padding: '12px', backgroundColor: '#1A1A1A', border: `1px solid ${borderColor}`, borderRadius: '8px', color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
                    </div>
                  </div>

                  <div style={{ padding: '20px', borderTop: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button type="button" onClick={closeModal} disabled={formLoading} style={{ padding: '12px 24px', backgroundColor: 'transparent', border: `1px solid ${borderColor}`, borderRadius: '8px', color: textMuted, fontSize: '14px', cursor: formLoading ? 'not-allowed' : 'pointer', opacity: formLoading ? 0.5 : 1 }}>Cancel</button>
                    <button type="submit" disabled={formLoading} style={{ padding: '12px 24px', backgroundColor: formLoading ? '#888' : accent, border: 'none', borderRadius: '8px', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: formLoading ? 'not-allowed' : 'pointer', boxShadow: formLoading ? 'none' : '0 3px 0 0 #A88438' }}>{formLoading ? 'Saving...' : (editingAppointment ? 'Update Appointment' : 'Book Appointment')}</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Boardroom New Client Modal */}
        {showBoardroomClientModal && (
          <BoardroomNewClientModal
            isOpen={showBoardroomClientModal}
            onClose={() => setShowBoardroomClientModal(false)}
            onClientCreated={(client: any) => {
              // Select the new client in the form
              if (client && client.id) {
                setSelectedContact(client);
                setFormData(prev => ({
                  ...prev,
                  contact: client.id.toString(),
                  firstName: client.firstName || '',
                  lastName: client.lastName || ''
                }));
              }
              setShowBoardroomClientModal(false);
              // Refresh contacts list
              fetchContacts();
            }}
          />
        )}
      </div>
    </div>
  );
}
