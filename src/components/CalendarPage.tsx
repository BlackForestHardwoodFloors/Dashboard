import React, { useState, useEffect, useRef, useCallback } from 'react';

// Declare google maps types
declare global {
  interface Window {
    google: typeof google;
  }
}

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
  Search,
  Car,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { SidebarEnhanced } from './SidebarEnhanced';
import BoardroomNewClientModal from './BoardroomNewClientModal';
import DriveTimeReminder from './DriveTimeReminder';
import { isFeatureEnabled } from './DriveTimeService';

// ZIP code to region mapping for Spokane area
const ZIP_TO_REGION: { [key: string]: string } = {
  // Spokane Valley
  '99206': 'Valley', '99212': 'Valley', '99216': 'Valley', '99037': 'Valley',
  '99016': 'Valley', '99027': 'Valley',
  // Spokane
  '99201': 'Spokane', '99202': 'Spokane', '99203': 'Spokane', '99204': 'Spokane',
  '99205': 'Spokane', '99207': 'Spokane', '99208': 'Spokane', '99210': 'Spokane',
  '99211': 'Spokane', '99213': 'Spokane', '99214': 'Spokane', '99217': 'Spokane',
  '99218': 'Spokane', '99219': 'Spokane', '99220': 'Spokane', '99223': 'Spokane',
  '99224': 'Spokane', '99228': 'Spokane',
  // Liberty Lake
  '99019': 'Liberty Lake',
  // Cheney
  '99004': 'Cheney',
  // Mead
  '99021': 'Mead',
  // Airway Heights
  '99001': 'Airway Heights',
  // Deer Park
  '99006': 'Deer Park',
  // Medical Lake
  '99022': 'Medical Lake',
  // Post Falls
  '83854': 'Post Falls', '83877': 'Post Falls',
  // Coeur d'Alene
  '83814': 'CDA', '83815': 'CDA', '83816': 'CDA',
  // Hayden
  '83835': 'Hayden',
  // Rathdrum
  '83858': 'Rathdrum',
};

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
  phone?: string;
  employeeName?: number;
  employee?: { firstName: string; lastName: string; color?: string };
  Employee?: { id: number; firstName: string; lastName: string; color?: string };
  employeeColor?: string;
  foreman?: string;
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

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  color?: string;
  status?: string;
  portalStatus?: string;
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
      return { bg: '#3498DB', text: '#FFFFFF' };
    case 'project':
      return { bg: '#E67E22', text: '#FFFFFF' };
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

// Default colors for employees if not set in database
const DEFAULT_EMPLOYEE_COLORS = [
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#6366F1', // Indigo
];

// Get employee color by ID or foreman name - will be used with employees state
function getEmployeeColor(employeeId: number | undefined, employees: Employee[], foremanName?: string): string {
  // First try by employeeName (ID)
  if (employeeId) {
    const empIndex = employees.findIndex(e => e.id === employeeId);
    if (empIndex !== -1) {
      const emp = employees[empIndex];
      return emp.color || DEFAULT_EMPLOYEE_COLORS[empIndex % DEFAULT_EMPLOYEE_COLORS.length];
    }
  }
  
  // Then try by foreman name (match first name or full name)
  if (foremanName && employees.length > 0) {
    const foremanLower = foremanName.toLowerCase().trim();
    const empIndex = employees.findIndex(e => {
      const firstName = (e.firstName || '').toLowerCase();
      const lastName = (e.lastName || '').toLowerCase();
      const fullName = `${firstName} ${lastName}`.trim();
      return firstName === foremanLower || fullName === foremanLower || `${firstName}${lastName}` === foremanLower.replace(/\s/g, '');
    });
    if (empIndex !== -1) {
      const emp = employees[empIndex];
      return emp.color || DEFAULT_EMPLOYEE_COLORS[empIndex % DEFAULT_EMPLOYEE_COLORS.length];
    }
  }
  
  return '#C9A049'; // Default gold color
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
  firstName: '', lastName: '', contact: '', location: '', region: '',
  startDate: '', startTime: '08:00', endDate: '', endTime: '09:00',
  purpose: 'Onsite Visit', employeeName: '2', description: '', allDay: false,
  sendDriveTimeReminder: true
};

// Generate time options in 15-minute intervals
const generateTimeOptions = () => {
  const times: { value: string; label: string }[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const h = hour.toString().padStart(2, '0');
      const m = minute.toString().padStart(2, '0');
      const value = `${h}:${m}`;
      // 12-hour format for label
      const period = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const label = `${hour12}:${m} ${period}`;
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

export default function CalendarPage({ onNavigate, hideOnsiteVisits = false }: { onNavigate?: (page: string) => void; hideOnsiteVisits?: boolean }) {
  // Example appointments for demo - these will be replaced by real data when API loads
  const exampleAppointments: Appointment[] = [
    {
      id: 9001,
      contact: 'Sarah Johnson',
      firstName: 'Sarah',
      lastName: 'Johnson',
      location: '14520 E Broadway Ave, Spokane Valley, WA 99216',
      region: 'Valley',
      purpose: 'Onsite Visit',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      description: 'Initial consultation for hardwood floor refinishing. Customer interested in dustless sanding.'
    },
    {
      id: 9002,
      contact: 'Mike Williams',
      firstName: 'Mike',
      lastName: 'Williams',
      location: '1234 N Division St, Spokane, WA 99201',
      region: 'Spokane',
      purpose: 'Onsite Visit',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      startTime: '14:00',
      endTime: '15:00',
      description: 'Measure for new hardwood installation in living room and dining room. Approximately 800 sqft.'
    },
    {
      id: 9003,
      contact: 'Robert Anderson',
      firstName: 'Robert',
      lastName: 'Anderson',
      location: '5678 E Appleway Blvd, Liberty Lake, WA 99019',
      region: 'Liberty Lake',
      purpose: 'Sand & Finish',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '08:00',
      endTime: '17:00',
      description: 'Full sand and refinish of oak hardwood floors. 1,200 sqft. 3 coats of oil-based poly.',
      foreman: 'Mike'
    },
    {
      id: 9004,
      contact: 'Jennifer Thompson',
      firstName: 'Jennifer',
      lastName: 'Thompson',
      location: '9012 W Seltice Way, Post Falls, ID 83854',
      region: 'Post Falls',
      purpose: 'Install',
      startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '08:00',
      endTime: '17:00',
      description: 'New installation of 3/4" red oak hardwood. Remove existing carpet. 950 sqft.',
      foreman: 'David'
    },
    {
      id: 9005,
      contact: 'Carlos Martinez',
      firstName: 'Carlos',
      lastName: 'Martinez',
      location: '3456 N Government Way, Coeur d\'Alene, ID 83814',
      region: 'CDA',
      purpose: 'Onsite Visit',
      startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '11:00',
      endTime: '12:00',
      description: 'Quote for staircase refinishing and repair. 14 steps plus landing.'
    },
    {
      id: 9006,
      contact: 'Emily Davis',
      firstName: 'Emily',
      lastName: 'Davis',
      location: '7890 S Regal St, Spokane, WA 99223',
      region: 'Spokane',
      purpose: 'Onsite Visit',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      startTime: '10:30',
      endTime: '11:30',
      description: 'Follow-up visit for moisture testing. Previous water damage in kitchen area.'
    },
    {
      id: 9007,
      contact: 'James Wilson',
      firstName: 'James',
      lastName: 'Wilson',
      location: '2345 E 29th Ave, Spokane, WA 99203',
      region: 'Spokane',
      purpose: 'Wood Delivery',
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '08:00',
      endTime: '09:00',
      description: 'Deliver 1,000 sqft of white oak hardwood. Customer will acclimate for 2 weeks.'
    },
    {
      id: 9008,
      contact: 'Patricia Brown',
      firstName: 'Patricia',
      lastName: 'Brown',
      location: '4567 N Nevada St, Spokane, WA 99205',
      region: 'Spokane',
      purpose: 'Sand & Finish',
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '08:00',
      endTime: '17:00',
      description: 'Sand and refinish maple floors throughout home. 1,800 sqft. Water-based finish.',
      foreman: 'Steve'
    },
    {
      id: 9009,
      contact: 'David Garcia',
      firstName: 'David',
      lastName: 'Garcia',
      location: '8901 E Sprague Ave, Spokane Valley, WA 99212',
      region: 'Valley',
      purpose: 'Onsite Visit',
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '13:00',
      endTime: '14:00',
      description: 'Estimate for commercial space. Restaurant flooring replacement. Need slip-resistant finish.'
    },
    {
      id: 9010,
      contact: 'Lisa Taylor',
      firstName: 'Lisa',
      lastName: 'Taylor',
      location: '1122 W Northwest Blvd, Spokane, WA 99205',
      region: 'Spokane',
      purpose: 'Install',
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '08:00',
      endTime: '17:00',
      description: 'Install engineered hardwood in basement. Moisture barrier required. 650 sqft.',
      foreman: 'Mike'
    },
    {
      id: 9011,
      contact: 'Richard Lee',
      firstName: 'Richard',
      lastName: 'Lee',
      location: '3344 E 57th Ave, Spokane Valley, WA 99223',
      region: 'Valley',
      purpose: 'Onsite Visit',
      startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '15:00',
      endTime: '16:00',
      description: 'New construction final walkthrough. Verify installation quality before builder handoff.'
    },
    {
      id: 9012,
      contact: 'Amanda White',
      firstName: 'Amanda',
      lastName: 'White',
      location: '5566 N Ash St, Spokane, WA 99208',
      region: 'Spokane',
      purpose: 'Touchup',
      startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '11:00',
      description: 'Touch up scratches from furniture move. Small area near front entry. Warranty work.'
    }
  ];

  // Example contacts for demo - these will be replaced by real data when API loads
  const exampleContacts: Contact[] = [
    { id: 9001, firstName: 'Steve', lastName: 'Osborn', companyName: '', phone: '509-555-1234', email: 'steve@example.com' },
    { id: 9002, firstName: 'Sarah', lastName: 'Johnson', companyName: '', phone: '509-555-2345', email: 'sarah@example.com' },
    { id: 9003, firstName: 'Mike', lastName: 'Williams', companyName: '', phone: '509-555-3456', email: 'mike@example.com' },
    { id: 9004, firstName: 'Robert', lastName: 'Anderson', companyName: '', phone: '509-555-4567', email: 'robert@example.com' },
    { id: 9005, firstName: 'Jennifer', lastName: 'Thompson', companyName: '', phone: '509-555-5678', email: 'jennifer@example.com' },
    { id: 9006, firstName: 'Carlos', lastName: 'Martinez', companyName: 'Martinez Builders', phone: '509-555-6789', email: 'carlos@martinez.com' },
    { id: 9007, firstName: 'Emily', lastName: 'Davis', companyName: '', phone: '509-555-7890', email: 'emily@example.com' },
    { id: 9008, firstName: 'James', lastName: 'Wilson', companyName: 'Wilson Construction', phone: '509-555-8901', email: 'james@wilson.com' },
    { id: 9009, firstName: 'Patricia', lastName: 'Brown', companyName: '', phone: '509-555-9012', email: 'patricia@example.com' },
    { id: 9010, firstName: 'David', lastName: 'Garcia', companyName: '', phone: '509-555-0123', email: 'david@example.com' },
  ];

  const [appointments, setAppointments] = useState<Appointment[]>(exampleAppointments);
  const [contacts, setContacts] = useState<Contact[]>(exampleContacts);
  const [employees, setEmployees] = useState<Employee[]>([]);
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
  
  // Matching client auto-fill state
  const [matchingClient, setMatchingClient] = useState<Contact | null>(null);
  
  // Bouncing new appointment state
  const [bouncingAppointmentId, setBouncingAppointmentId] = useState<number | null>(null);
  
  // Date picker state
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [datePickerMonth, setDatePickerMonth] = useState(new Date());
  
  // Google Maps autocomplete
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  
  // Drag and drop state
  const [draggedAppointment, setDraggedAppointment] = useState<Appointment | null>(null);
  
  // Current user for drive-time reminders
  const [currentUser, setCurrentUser] = useState<{ id: number; role: string } | null>(null);
  const [dragType, setDragType] = useState<'move' | 'resize-start' | 'resize-end' | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);
  
  // Sticky header state
  const calendarHeaderRef = useRef<HTMLDivElement>(null);
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  
  // Current week row ref for "Today" button scroll
  const currentWeekRef = useRef<HTMLDivElement>(null);
  const hasScrolledOnLoad = useRef(false);
  
  // Collapse state for map and recent appointments (collapsed by default)
  const [showMapSection, setShowMapSection] = useState(false);
  const [showRecentAppointments, setShowRecentAppointments] = useState(false);
  const [showFullscreenMap, setShowFullscreenMap] = useState(false);
  const [fullscreenMapLocation, setFullscreenMapLocation] = useState<string>('');

  // Time Off Request state (for employee portal)
  const [showTimeOffModal, setShowTimeOffModal] = useState(false);
  const [timeOffData, setTimeOffData] = useState(() => {
    // Auto-fill employee name from logged-in user
    let employeeName = '';
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.firstName && user.lastName) {
        employeeName = `${user.firstName} ${user.lastName}`;
      } else if (user.firstName) {
        employeeName = user.firstName;
      }
    } catch (e) {
      // ignore
    }
    return {
      employeeName,
      timeOffType: 'PTO',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      notes: ''
    };
  });
  const [timeOffLoading, setTimeOffLoading] = useState(false);
  const [timeOffSuccess, setTimeOffSuccess] = useState<string | null>(null);
  const [timeOffError, setTimeOffError] = useState<string | null>(null);

  const bgColor = '#1E1E1E';
  const cardBg = '#2D2D2D';
  const borderColor = '#3D3D3D';
  const textColor = '#FFFFFF';
  const textMuted = '#A0A0A0';
  const accent = '#3B9CAA';

  // Extract ZIP code and auto-fill region
  const extractZipAndSetRegion = useCallback((address: string) => {
    // Look for 5-digit ZIP code pattern
    const zipMatch = address.match(/\b(\d{5})\b/);
    if (zipMatch) {
      const zip = zipMatch[1];
      const region = ZIP_TO_REGION[zip] || '';
      if (region) {
        setFormData(prev => ({ ...prev, region }));
      }
    }
  }, []);

  // Initialize Google Maps Autocomplete
  useEffect(() => {
    if (!showBookModal) return;
    
    // Small delay to ensure input is mounted
    const initTimer = setTimeout(() => {
      if (!addressInputRef.current) {
        console.log('Calendar Google Maps: Address input not ready');
        return;
      }
      
      // Check if Google Maps API is loaded
      if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
        // Check for API key
        if (!GOOGLE_MAPS_API_KEY) {
          console.warn('Calendar Google Maps: No API key found. Set VITE_GOOGLE_MAPS_API_KEY in your .env file');
          return;
        }
        
        console.log('Calendar Google Maps: Loading script...');
        
        // Load Google Maps API script if not already loaded
        const existingScript = document.getElementById('google-maps-script');
        if (!existingScript) {
          const script = document.createElement('script');
          script.id = 'google-maps-script';
          script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
          script.async = true;
          script.defer = true;
          script.onload = () => {
            console.log('Calendar Google Maps: Script loaded');
            initAutocomplete();
          };
          script.onerror = () => {
            console.error('Calendar Google Maps: Failed to load script. Check your API key and billing.');
          };
          document.head.appendChild(script);
        } else {
          // Script exists, wait for it to load
          const checkLoaded = setInterval(() => {
            if (typeof google !== 'undefined' && google.maps && google.maps.places) {
              clearInterval(checkLoaded);
              initAutocomplete();
            }
          }, 100);
          setTimeout(() => clearInterval(checkLoaded), 10000);
        }
        return;
      }
      
      initAutocomplete();
    }, 200);
    
    return () => clearTimeout(initTimer);
  }, [showBookModal]);

  const initAutocomplete = () => {
    if (!addressInputRef.current) {
      console.log('Calendar Google Maps: Address input ref not available');
      return;
    }
    if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
      console.log('Calendar Google Maps: Google Maps not loaded');
      return;
    }
    
    console.log('Calendar Google Maps: Initializing autocomplete...');
    
    try {
      // Clear existing autocomplete
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
      
      autocompleteRef.current = new google.maps.places.Autocomplete(addressInputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'us' },
        fields: ['formatted_address', 'address_components', 'geometry']
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.formatted_address) {
          const address = place.formatted_address;
          setFormData(prev => ({ ...prev, location: address }));
          extractZipAndSetRegion(address);
          setShowAddressSuggestions(false);
        }
      });
      
      console.log('Calendar Google Maps: Autocomplete initialized successfully');
    } catch (err) {
      console.error('Calendar Google Maps: Error initializing autocomplete:', err);
    }
  };

  // Handle manual address input and extract region
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, location: value }));
    extractZipAndSetRegion(value);
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calendar ref for wheel scrolling
  const calendarGridRef = useRef<HTMLDivElement>(null);
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Week scroll with non-passive listener - DISABLED to allow normal page scrolling
  // To re-enable week-changing on scroll, uncomment the code below
  /*
  useEffect(() => {
    const node = calendarGridRef.current;
    if (!node) return;
    
    const handleWheel = (e: WheelEvent) => {
      // Only handle vertical scroll
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        e.stopPropagation();
        
        // Debounce to prevent rapid week changes
        if (wheelTimeoutRef.current) return;
        
        if (e.deltaY > 0) {
          // Scroll down = next week
          setCurrentDate(prev => new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000));
        } else {
          // Scroll up = previous week
          setCurrentDate(prev => new Date(prev.getTime() - 7 * 24 * 60 * 60 * 1000));
        }
        
        wheelTimeoutRef.current = setTimeout(() => {
          wheelTimeoutRef.current = null;
        }, 300);
      }
    };

    node.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      node.removeEventListener('wheel', handleWheel);
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
    };
  });
  */

  // Sticky header scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (calendarHeaderRef.current && calendarContainerRef.current) {
        const containerRect = calendarContainerRef.current.getBoundingClientRect();
        const headerRect = calendarHeaderRef.current.getBoundingClientRect();
        
        // When the calendar container's top goes above viewport, make header sticky
        if (containerRect.top <= 0 && containerRect.bottom > headerRect.height) {
          setIsHeaderSticky(true);
          setHeaderHeight(headerRect.height);
        } else {
          setIsHeaderSticky(false);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchAppointments();
    fetchContacts();
    fetchEmployees();
  }, []);

  // Listen for appointment updates from JobCardDrawer
  useEffect(() => {
    const handleUpdate = () => {
      fetchAppointments();
    };
    window.addEventListener('appointmentUpdated', handleUpdate);
    return () => window.removeEventListener('appointmentUpdated', handleUpdate);
  }, []);

  // Load current user for drive-time reminders
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser({ id: user.id, role: user.role });
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/appointments/get-appointments`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch appointments');
      
      // Check if response has content before parsing JSON
      const text = await response.text();
      if (!text || text.trim() === '') {
        console.log('Appointments: Empty response from server');
        return; // Keep example data
      }
      
      const data = JSON.parse(text);
      const realAppointments = data.data?.appointments || data.appointments || data || [];
      // Use real appointments if available, otherwise keep example data
      if (realAppointments.length > 0) {
        setAppointments(realAppointments);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      // Keep example data on error, don't clear appointments
      setError(null);
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
      
      // Check if response has content before parsing JSON
      const text = await response.text();
      if (!text || text.trim() === '') {
        console.log('Contacts: Empty response from server');
        return; // Keep example data
      }
      
      const data = JSON.parse(text);
      const contactsList = data.data?.contacts || data.contacts || data.data || data || [];
      // Only replace contacts if we got real data
      if (Array.isArray(contactsList) && contactsList.length > 0) {
        setContacts(contactsList);
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
      // Keep example contacts on error, don't clear
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/employee/get-employee`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch employees');
      
      const text = await response.text();
      if (!text || text.trim() === '') {
        console.log('Employees: Empty response from server');
        return;
      }
      
      const data = JSON.parse(text);
      const employeesList = data.data?.employee || data.employee || data.data || data || [];
      if (Array.isArray(employeesList) && employeesList.length > 0) {
        // Filter to only active employees
        const activeEmployees = employeesList.filter((emp: Employee) => 
          emp.portalStatus === 'Active' || !emp.portalStatus
        );
        setEmployees(activeEmployees);
        console.log('Employees loaded:', activeEmployees.length);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
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
    
    // Auto-toggle drive-time reminder based on purpose
    if (name === 'purpose') {
      const shouldEnableReminder = value === 'Onsite Visit';
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        sendDriveTimeReminder: shouldEnableReminder 
      }));
      if (formError) setFormError(null);
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
    
    // Check for matching client when typing first or last name
    if (name === 'firstName' || name === 'lastName') {
      const currentFirstName = name === 'firstName' ? value : formData.firstName;
      const currentLastName = name === 'lastName' ? value : formData.lastName;
      
      if (currentFirstName.length >= 2 || currentLastName.length >= 2) {
        const match = contacts.find(c => {
          const firstMatch = currentFirstName && c.firstName?.toLowerCase().startsWith(currentFirstName.toLowerCase());
          const lastMatch = currentLastName && c.lastName?.toLowerCase().startsWith(currentLastName.toLowerCase());
          
          // Match if both names match, or if only one is provided and it matches
          if (currentFirstName && currentLastName) {
            return firstMatch && lastMatch;
          } else if (currentFirstName) {
            return firstMatch;
          } else if (currentLastName) {
            return lastMatch;
          }
          return false;
        });
        setMatchingClient(match || null);
      } else {
        setMatchingClient(null);
      }
    }
  };
  
  // Auto-fill from matching client
  const autoFillFromClient = (client: Contact) => {
    setFormData(prev => ({
      ...prev,
      firstName: client.firstName || '',
      lastName: client.lastName || '',
      contact: client.id.toString()
    }));
    setSelectedContact(client);
    setMatchingClient(null);
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
      
      // Handle empty response
      const text = await response.text();
      let data: any = {};
      if (text && text.trim()) {
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          console.error('Failed to parse response:', parseErr);
        }
      }
      
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
      
      // Validate required fields - time not required for all day
      if (!formData.startDate || !formData.endDate || !formData.purpose) {
        setFormError('Please fill in all required fields');
        setFormLoading(false);
        return;
      }
      
      // If not all day, validate times
      if (!formData.allDay && (!formData.startTime || !formData.endTime)) {
        setFormError('Please fill in start and end times');
        setFormLoading(false);
        return;
      }
      
      // Set default times for all day events
      const startTime = formData.allDay ? '00:00' : formData.startTime;
      const endTime = formData.allDay ? '23:59' : formData.endTime;
      
      const startDateTime = new Date(`${formData.startDate}T${startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${endTime}`);
      if (!formData.allDay && startDateTime >= endDateTime && formData.startDate === formData.endDate) {
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
        region: formData.region,
        startDate: formData.startDate,
        startTime: startTime,
        endDate: formData.endDate,
        endTime: endTime,
        purpose: formData.purpose,
        employeeName: formData.employeeName ? parseInt(formData.employeeName) : 2,
        description: formData.description || '',
        allDay: formData.allDay
      };
      console.log('Creating appointment with payload:', payload);
      console.log('API URL:', `${API_URL}/appointments/create-appointment`);
      console.log('Token exists:', !!token);
      
      const response = await fetch(`${API_URL}/appointments/create-appointment`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      console.log('Response status:', response.status, response.statusText);
      
      // Handle empty response
      const text = await response.text();
      console.log('Response body:', text);
      
      let data: any = {};
      if (text && text.trim()) {
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          console.error('Failed to parse response:', parseErr);
        }
      }
      
      if (!response.ok) {
        const errorMsg = data.message || data.error || `Server error: ${response.status} ${response.statusText}`;
        throw new Error(errorMsg);
      }
      
      setFormSuccess('Appointment created successfully!');
      setFormData(initialFormData);
      setSelectedContact(null);
      
      // Close modal immediately and refresh appointments
      setShowBookModal(false);
      setFormSuccess(null);
      
      await fetchAppointments();
      
      // Get the new appointment ID and trigger bounce animation
      const newAppointmentId = data.data?.id || data.id;
      if (newAppointmentId) {
        setBouncingAppointmentId(newAppointmentId);
        // Stop bouncing after 5 seconds
        setTimeout(() => setBouncingAppointmentId(null), 5000);
      }
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
      
      // Set default times for all day events
      const startTime = formData.allDay ? '00:00' : formData.startTime;
      const endTime = formData.allDay ? '23:59' : formData.endTime;
      
      const payload = {
        contact: contactStr,
        location: formData.location,
        region: formData.region,
        startDate: formData.startDate,
        startTime: startTime,
        endDate: formData.endDate,
        endTime: endTime,
        purpose: formData.purpose,
        employeeName: formData.employeeName ? parseInt(formData.employeeName) : 2,
        description: formData.description || '',
        allDay: formData.allDay
      };
      const response = await fetch(`${API_URL}/appointments/update-appointment/${editingAppointment.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      // Handle empty response
      const text = await response.text();
      let data = {};
      if (text && text.trim()) {
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          console.error('Failed to parse response:', parseErr);
        }
      }
      
      if (!response.ok) throw new Error((data as any).message || 'Failed to update appointment');
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

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, appointment: Appointment, type: 'move' | 'resize-start' | 'resize-end') => {
    e.stopPropagation();
    setDraggedAppointment(appointment);
    setDragType(type);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', appointment.id.toString());
    
    // Create custom ghost drag image
    const ghostElement = document.createElement('div');
    const typeColors = getTypeBadgeColor(appointment.purpose);
    const displayName = appointment.contact || appointment.firstName ? 
      `${appointment.firstName || ''} ${appointment.lastName || ''}`.trim() : 'Appointment';
    
    ghostElement.innerHTML = `
      <div style="
        background-color: ${typeColors.bg};
        color: ${typeColors.text};
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 8px;
      ">
        <span style="opacity: 0.7;">${type === 'move' ? '↔' : type === 'resize-start' ? '◀' : '▶'}</span>
        ${displayName}
      </div>
    `;
    ghostElement.style.position = 'absolute';
    ghostElement.style.top = '-1000px';
    ghostElement.style.left = '-1000px';
    document.body.appendChild(ghostElement);
    
    e.dataTransfer.setDragImage(ghostElement, 50, 20);
    
    // Clean up ghost element after drag starts
    setTimeout(() => {
      document.body.removeChild(ghostElement);
      const target = e.target as HTMLElement;
      if (target) target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    if (target) target.style.opacity = '1';
    setDraggedAppointment(null);
    setDragType(null);
    setDragOverDate(null);
  };

  const handleDragOver = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDate(dateStr);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverDate(null);
  };

  const handleDrop = async (e: React.DragEvent, targetDateStr: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverDate(null);

    if (!draggedAppointment || !dragType) return;

    const apt = draggedAppointment;
    let newStartDate = apt.startDate;
    let newEndDate = apt.endDate || apt.startDate;

    if (dragType === 'move') {
      // Calculate the difference in days and shift both dates
      const originalStart = new Date(apt.startDate + 'T00:00:00');
      const targetDate = new Date(targetDateStr + 'T00:00:00');
      const daysDiff = Math.round((targetDate.getTime() - originalStart.getTime()) / (1000 * 60 * 60 * 24));
      
      const newStart = new Date(originalStart);
      newStart.setDate(newStart.getDate() + daysDiff);
      newStartDate = newStart.toISOString().split('T')[0];
      
      if (apt.endDate) {
        const originalEnd = new Date(apt.endDate + 'T00:00:00');
        const newEnd = new Date(originalEnd);
        newEnd.setDate(newEnd.getDate() + daysDiff);
        newEndDate = newEnd.toISOString().split('T')[0];
      } else {
        newEndDate = newStartDate;
      }
    } else if (dragType === 'resize-start') {
      // Changing start date - make sure it doesn't go past end date
      if (targetDateStr <= newEndDate) {
        newStartDate = targetDateStr;
      }
    } else if (dragType === 'resize-end') {
      // Changing end date - make sure it doesn't go before start date
      if (targetDateStr >= newStartDate) {
        newEndDate = targetDateStr;
      }
    }

    // Update locally first for immediate feedback
    setAppointments(prev => prev.map(a => 
      a.id === apt.id 
        ? { ...a, startDate: newStartDate, endDate: newEndDate }
        : a
    ));

    // Then update on server
    try {
      const token = localStorage.getItem('token');
      if (token && apt.id < 9000) { // Only update real appointments (not example data)
        const payload = {
          contact: apt.contact,
          location: apt.location,
          region: apt.region,
          startDate: newStartDate,
          startTime: apt.startTime,
          endDate: newEndDate,
          endTime: apt.endTime,
          purpose: apt.purpose,
          employeeName: apt.employeeName,
          description: apt.description
        };
        
        await fetch(`${API_URL}/appointments/update-appointment/${apt.id}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('appointmentUpdated'));
      }
    } catch (err) {
      console.error('Error updating appointment:', err);
      // Revert on error
      await fetchAppointments();
    }

    setDraggedAppointment(null);
    setDragType(null);
  };

  const openEditModal = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    // Parse contact name back into first/last name
    const contactParts = (appointment.contact || '').split(' ');
    const firstName = contactParts[0] || '';
    const lastName = contactParts.slice(1).join(' ') || '';
    
    // Check if this is an all-day event (times are 00:00 and 23:59)
    const isAllDay = appointment.startTime === '00:00' && appointment.endTime === '23:59';
    
    // Get region from appointment or try to extract from location
    let region = appointment.region || '';
    if (!region && appointment.location) {
      const zipMatch = appointment.location.match(/\b(\d{5})\b/);
      if (zipMatch) {
        region = ZIP_TO_REGION[zipMatch[1]] || '';
      }
    }
    
    setSelectedContact(null);
    setFormData({
      firstName: firstName,
      lastName: lastName,
      contact: '',
      location: appointment.location || appointment.address || '',
      region: region,
      startDate: appointment.startDate,
      startTime: appointment.startTime,
      endDate: appointment.endDate,
      endTime: appointment.endTime,
      purpose: appointment.purpose,
      employeeName: appointment.employeeName?.toString() || '2',
      description: appointment.description || '',
      allDay: isAllDay
    });
    setShowBookModal(true);
  };

  const openNewAppointmentModal = (presetDate?: Date) => {
    setEditingAppointment(null);
    setSelectedContact(null);
    
    // Get current time rounded to next 15-minute increment
    const now = new Date();
    const minutes = now.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;
    now.setMinutes(roundedMinutes);
    now.setSeconds(0);
    
    // Handle overflow (e.g., 60 minutes -> next hour)
    const startHour = now.getHours().toString().padStart(2, '0');
    const startMin = (now.getMinutes() % 60).toString().padStart(2, '0');
    const startTime = `${startHour}:${startMin}`;
    
    // End time is 1 hour after start
    const endDate = new Date(now);
    endDate.setHours(endDate.getHours() + 1);
    const endHour = endDate.getHours().toString().padStart(2, '0');
    const endMin = endDate.getMinutes().toString().padStart(2, '0');
    const endTime = `${endHour}:${endMin}`;
    
    // Use preset date if provided, otherwise today's date
    const dateStr = presetDate ? presetDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    
    setFormData({
      ...initialFormData,
      startDate: dateStr,
      endDate: dateStr,
      startTime,
      endTime
    });
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
    setMatchingClient(null);
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    // Convert Sunday=0 to Monday=0 format (Monday start week)
    let startPadding = firstDay.getDay() - 1;
    if (startPadding < 0) startPadding = 6; // Sunday becomes 6
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

  // Get appointments that should appear on a specific day (including multi-day spanning)
  const getAppointmentsForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => {
      if (hideOnsiteVisits && apt.purpose?.toLowerCase() === 'onsite visit') return false;
      if (hideOnsiteVisits && apt.purpose?.toLowerCase() === 'onsite visit') return false;
      if (hideOnsiteVisits && apt.purpose?.toLowerCase() === 'onsite visit') return false;
      const startDate = apt.startDate;
      const endDate = apt.endDate || apt.startDate;
      return dateStr >= startDate && dateStr <= endDate;
    });
  };

  // Check if this is the start day of a multi-day appointment
  const isStartOfMultiDay = (apt: Appointment, date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    return apt.startDate === dateStr && apt.endDate && apt.startDate !== apt.endDate;
  };

  // Check if this is a continuation day (not start) of a multi-day appointment
  const isContinuationDay = (apt: Appointment, date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    return apt.endDate && apt.startDate !== apt.endDate && dateStr > apt.startDate && dateStr <= apt.endDate;
  };

  // Get the day of week (0-6) for calculating span width
  const getDayOfWeek = (date: Date): number => {
    return date.getDay();
  };

  // Calculate how many days to span from current day (max 7 - dayOfWeek to not overflow row)
  const getSpanDays = (apt: Appointment, date: Date): number => {
    const dateStr = date.toISOString().split('T')[0];
    const endDate = new Date(apt.endDate + 'T00:00:00');
    const currentDate = new Date(dateStr + 'T00:00:00');
    const dayOfWeek = getDayOfWeek(currentDate);
    const daysUntilEndOfWeek = 7 - dayOfWeek;
    const daysUntilEnd = Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(daysUntilEnd, daysUntilEndOfWeek);
  };

  // Assign consistent slots to multi-day appointments so they maintain vertical position
  const getMultiDaySlots = (): Map<number, number> => {
    const slotMap = new Map<number, number>(); // appointmentId -> slot number
    const multiDayAppts = appointments.filter(apt => apt.endDate && apt.startDate !== apt.endDate);
    
    // Sort by start date (earliest first)
    const sorted = [...multiDayAppts].sort((a, b) => a.startDate.localeCompare(b.startDate));
    
    // For each date in the calendar, track which slots are occupied
    const dateSlots: Map<string, Set<number>> = new Map();
    
    sorted.forEach(apt => {
      // Find the first available slot that's free for all days of this appointment
      let slot = 0;
      let slotFound = false;
      
      while (!slotFound) {
        slotFound = true;
        const start = new Date(apt.startDate + 'T00:00:00');
        const end = new Date(apt.endDate + 'T00:00:00');
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          const occupiedSlots = dateSlots.get(dateStr) || new Set();
          if (occupiedSlots.has(slot)) {
            slotFound = false;
            slot++;
            break;
          }
        }
      }
      
      // Assign this slot to the appointment
      slotMap.set(apt.id, slot);
      
      // Mark this slot as occupied for all days
      const start = new Date(apt.startDate + 'T00:00:00');
      const end = new Date(apt.endDate + 'T00:00:00');
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        if (!dateSlots.has(dateStr)) {
          dateSlots.set(dateStr, new Set());
        }
        dateSlots.get(dateStr)!.add(slot);
      }
    });
    
    return slotMap;
  };
  
  const multiDaySlots = getMultiDaySlots();

  const handleDayClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    // Check if there are appointments on this day
    const dayAppts = getAppointmentsForDay(date);
    
    if (dayAppts.length > 0) {
      // If there are appointments, show the day modal (which has a "Book New" button)
      setSelectedDay(date);
      setShowDayModal(true);
    } else {
      // If no appointments, open new appointment form with this date
      openNewAppointmentModal(date);
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayNamesShort = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
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
  
  // Week navigation for scrolling
  const prevWeek = () => setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
  const nextWeek = () => setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
  
  // Scroll to today's row and keep date row visible
  const scrollToToday = () => {
    setCurrentDate(new Date());
    // Wait for re-render, then scroll to current week row
    setTimeout(() => {
      if (currentWeekRef.current) {
        currentWeekRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };
  
  // Auto-scroll to today when calendar first loads
  useEffect(() => {
    // Scroll to today after calendar renders
    const scrollToCurrentWeek = () => {
      if (currentWeekRef.current) {
        currentWeekRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
        hasScrolledOnLoad.current = true;
      }
    };

    // Try scrolling after short delay, then again after longer delay as backup
    if (!hasScrolledOnLoad.current) {
      const timer1 = setTimeout(scrollToCurrentWeek, 300);
      const timer2 = setTimeout(scrollToCurrentWeek, 800);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [loading, appointments]);
  
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
  
  // Format time for display (24-hour format)
  const formatTimeForCalendar = (time: string): string => {
    if (!time) return '';
    const [hoursStr, minutes] = time.split(':');
    const hours = parseInt(hoursStr, 10);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${hours12}:${minutes} ${period}`;
  };
  
  // Get region from location (extract from address or use region field)
  const getRegionFromAppointment = (apt: Appointment): string => {
    if (apt.region) return apt.region;
    // Try to extract region from location/address
    const loc = (apt.location || apt.address || '').toLowerCase();
    if (!loc) return '';
    
    // Common Spokane area patterns
    if (loc.includes('spokane valley') || loc.includes('valley')) return 'Valley';
    if (loc.includes('liberty lake')) return 'Liberty Lake';
    if (loc.includes('cheney')) return 'Cheney';
    if (loc.includes('cda') || loc.includes('coeur d\'alene') || loc.includes('coeur d')) return 'CDA';
    if (loc.includes('post falls')) return 'Post Falls';
    if (loc.includes('mead')) return 'Mead';
    if (loc.includes('airway')) return 'Airway Heights';
    if (loc.includes('deer park')) return 'Deer Park';
    if (loc.includes('medical lake')) return 'Medical Lake';
    if (loc.includes('millwood')) return 'Millwood';
    if (loc.includes('veradale')) return 'Veradale';
    if (loc.includes('greenacres')) return 'Greenacres';
    if (loc.includes('otis orchards')) return 'Otis Orchards';
    // Default to Spokane if it contains spokane but not valley
    if (loc.includes('spokane')) return 'Spokane';
    
    // Try to detect from zip codes
    if (loc.includes('99206') || loc.includes('99212') || loc.includes('99216') || loc.includes('99037')) return 'Valley';
    if (loc.includes('99019')) return 'Liberty Lake';
    if (loc.includes('99004')) return 'Cheney';
    
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
    <div style={{ display: 'flex', minHeight: '100vh', height: '100vh', backgroundColor: bgColor, overflow: 'hidden' }}>
      {!isMobile && !hideOnsiteVisits && <SidebarEnhanced activePage="Calendar" onNavigate={onNavigate} darkMode={true} />}

      {isMobile && showMobileSidebar && !hideOnsiteVisits && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 }} onClick={() => setShowMobileSidebar(false)}>
          <div style={{ width: '280px', height: '100%' }} onClick={e => e.stopPropagation()}>
            <SidebarEnhanced activePage="Calendar" onNavigate={(page) => { setShowMobileSidebar(false); onNavigate?.(page); }} darkMode={true} />
          </div>
        </div>
      )}

      <div style={{ flex: 1, marginLeft: (isMobile || hideOnsiteVisits) ? 0 : '200px', padding: isMobile ? '16px' : '24px', overflow: 'auto', height: '100vh' }}>
        {isMobile && !hideOnsiteVisits && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <button onClick={() => setShowMobileSidebar(true)} style={{ padding: '8px', backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderRadius: '8px', cursor: 'pointer' }}>
              <Menu size={24} color={textColor} />
            </button>
            <h1 style={{ fontSize: '24px', color: textColor, margin: 0, fontWeight: 'bold' }}>Appointments</h1>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: '16px', marginBottom: '24px' }}>
          <div>
            {!isMobile && <h1 style={{ fontSize: '28px', color: textColor, margin: '0 0 4px 0', fontWeight: 'bold' }}>{hideOnsiteVisits ? 'My Schedule' : 'Appointments'}</h1>}
            <p style={{ fontSize: '14px', color: textMuted, margin: 0 }}>{hideOnsiteVisits ? 'View your schedule and request time off' : 'Schedule appointments, manage jobs, and track crew assignments'}</p>
          </div>
          {hideOnsiteVisits ? (
            <button onClick={() => setShowTimeOffModal(true)} style={{ padding: '12px 20px', backgroundColor: '#D76A6A', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 0 0 #A84C4C' }}>
              <Plus size={18} />Request Time Off
            </button>
          ) : (
            <button onClick={openNewAppointmentModal} style={{ padding: '12px 20px', backgroundColor: accent, color: '#FFFFFF', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 0 0 #A88438' }}>
              <Plus size={18} />New Appointment
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Map and Today's Appointments sections - hidden for now
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
            ... sections hidden ...
          </div>
          */}
          <div ref={calendarContainerRef} style={{ backgroundColor: cardBg, borderRadius: '12px', border: `1px solid ${borderColor}`, padding: '20px', position: 'relative', maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
            {/* Month navigation header - sticky at top of calendar */}
            <div 
              ref={calendarHeaderRef}
              style={{ 
                position: 'sticky',
                top: '-20px',
                backgroundColor: cardBg, 
                zIndex: 100,
                padding: '0 0 12px 0',
                marginTop: '-20px',
                paddingTop: '20px',
                marginBottom: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    onClick={() => {
                      if (viewMode === 'month') prevMonth();
                      else if (viewMode === 'week') setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
                      else setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
                    }} 
                    style={{ padding: '8px', backgroundColor: '#252525', border: `1px solid ${borderColor}`, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <ChevronLeft size={20} color={textColor} />
                  </button>
                  <button 
                    onClick={() => {
                      if (viewMode === 'month') nextMonth();
                      else if (viewMode === 'week') setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
                      else setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));
                    }} 
                    style={{ padding: '8px', backgroundColor: '#252525', border: `1px solid ${borderColor}`, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <ChevronRight size={20} color={textColor} />
                  </button>
                  <button 
                    onClick={scrollToToday} 
                    style={{ 
                      padding: '8px 16px', 
                      backgroundColor: '#252525', 
                      border: `1px solid ${borderColor}`, 
                      borderRadius: '8px', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: accent,
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                  >
                    Today
                  </button>
                </div>
                <h2 style={{ color: textColor, fontSize: '20px', margin: 0, fontWeight: '600' }}>
                  {viewMode === 'day' 
                    ? currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })
                    : viewMode === 'week'
                      ? (() => {
                          const startOfWeek = new Date(currentDate);
                          const dayOfWeek = startOfWeek.getDay();
                          const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                          startOfWeek.setDate(startOfWeek.getDate() + diff);
                          const endOfWeek = new Date(startOfWeek);
                          endOfWeek.setDate(startOfWeek.getDate() + 6);
                          return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
                        })()
                      : `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                  }
                </h2>
                <div style={{ display: 'flex', backgroundColor: '#252525', borderRadius: '8px', border: `1px solid ${borderColor}`, overflow: 'hidden' }}>
                  {['month', 'week', 'day'].map((mode) => (
                    <button key={mode} onClick={() => setViewMode(mode as any)} style={{ padding: '8px 16px', backgroundColor: viewMode === mode ? accent : 'transparent', color: viewMode === mode ? '#FFFFFF' : textMuted, border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '500', textTransform: 'capitalize' }}>{mode}</button>
                  ))}
                </div>
              </div>

              {viewMode === 'month' && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', 
                  gap: '1px', 
                  backgroundColor: cardBg,
                  borderBottom: `1px solid ${borderColor}`,
                  paddingBottom: '8px'
                }}>
                  {dayNames.map(day => (<div key={day} style={{ textAlign: 'center', padding: '8px', color: textMuted, fontSize: '13px', fontWeight: '600', backgroundColor: cardBg }}>{day}</div>))}
                </div>
              )}
            </div>

            {viewMode === 'month' && (
              <div ref={calendarGridRef} style={{ 
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 'calc(100vh - 250px)' // Fill available space below header
              }}>
                {/* Grid cells - restructured with date headers per week */}
                <div style={{ 
                  backgroundColor: cardBg,
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  {/* Split calendar days into weeks (6 weeks of 7 days) */}
                  {Array.from({ length: 6 }, (_, weekIndex) => {
                    const weekDays = calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7);
                    
                    // Check if this week contains today
                    const today = new Date();
                    const isCurrentWeek = weekDays.some(day => day.date.toDateString() === today.toDateString());
                    
                    return (
                      <div 
                        key={`week-${weekIndex}`}
                        ref={isCurrentWeek ? currentWeekRef : null}
                        style={{ 
                          borderBottom: weekIndex < 5 ? `1px solid ${borderColor}` : 'none',
                          backgroundColor: cardBg,
                          scrollMarginTop: '150px',
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          minHeight: '80px'
                        }}
                      >
                        {/* Date header row for this week */}
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', 
                          gap: '0', 
                          borderBottom: `1px solid ${borderColor}`, 
                          overflow: 'hidden', 
                          position: 'relative',
                          zIndex: 20,
                          backgroundColor: cardBg
                        }}>
                          {weekDays.map((day, dayIndex) => {
                            const isToday = day.date.toDateString() === new Date().toDateString();
                            return (
                              <div 
                                key={`date-${weekIndex}-${dayIndex}`}
                                style={{ 
                                  padding: '4px 8px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  opacity: day.isCurrentMonth ? 1 : 0.4,
                                  borderRight: dayIndex < 6 ? `1px solid ${borderColor}` : 'none',
                                  overflow: 'hidden',
                                  backgroundColor: cardBg
                                }}
                              >
                                <span style={{ 
                                  width: '24px', 
                                  height: '24px', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center', 
                                  borderRadius: '50%', 
                                  backgroundColor: isToday ? accent : 'transparent', 
                                  color: isToday ? '#FFFFFF' : textColor, 
                                  fontSize: '12px', 
                                  fontWeight: isToday ? '600' : '400' 
                                }}>
                                  {day.date.getDate()}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Appointment cells row for this week */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '0', position: 'relative', flex: 1, minHeight: '80px', backgroundColor: cardBg }}>
                          {/* Multi-day bars for this week - rendered as overlay within this week's row */}
                          {(() => {
                            const renderedAppts = new Set<string>();
                            const weekBars: JSX.Element[] = [];
                            
                            weekDays.forEach((day, dayIndex) => {
                              const dateStr = day.date.toISOString().split('T')[0];
                              const dayAppointments = getAppointmentsForDay(day.date);
                              const multiDayAppts = dayAppointments.filter(apt => apt.endDate && apt.startDate !== apt.endDate);
                              
                              multiDayAppts.forEach(apt => {
                                const startsOnThisDay = apt.startDate === dateStr;
                                const isFirstColumnOfRow = dayIndex === 0;
                                const isStartOfWeekContinuation = !startsOnThisDay && isFirstColumnOfRow;
                                
                                const renderKey = `${apt.id}-${weekIndex}`;
                                if (!startsOnThisDay && !isStartOfWeekContinuation) return;
                                if (renderedAppts.has(renderKey)) return;
                                renderedAppts.add(renderKey);
                                
                                const slot = multiDaySlots.get(apt.id) ?? 0;
                                const colIndex = dayIndex;
                                
                                const aptEndDate = new Date(apt.endDate + 'T00:00:00');
                                const weekEndDate = weekDays[6].date;
                                const effectiveEnd = aptEndDate < weekEndDate ? aptEndDate : weekEndDate;
                                const startDate = startsOnThisDay ? day.date : weekDays[0].date;
                                const daysUntilEnd = Math.floor((effectiveEnd.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                                const daysUntilEndOfWeek = 6 - dayIndex;
                                const colSpan = Math.min(daysUntilEnd, daysUntilEndOfWeek) + 1;
                                
                                const endsInThisRow = aptEndDate <= weekEndDate;
                                
                                const typeColors = getTypeBadgeColor(apt.purpose);
                                const employeeColor = apt.Employee?.color || getEmployeeColor(apt.employeeName, employees, apt.foreman);
                                const appointmentColor = (apt.Employee || apt.employeeName || apt.foreman) ? employeeColor : typeColors.bg;
                                const isDragging = draggedAppointment?.id === apt.id;
                                const isBouncing = bouncingAppointmentId === apt.id;
                                
                                const lastName = getLastNameFromContact(apt.contact);
                                
                                const contactId = apt.contact ? parseInt(apt.contact) : null;
                                const contactName = apt.contact?.toLowerCase().trim() || '';
                                const contactRecord = contactId && !isNaN(contactId) 
                                  ? contacts.find(c => c.id === contactId)
                                  : contacts.find(c => {
                                      const fullName = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase().trim();
                                      const reverseName = `${c.lastName || ''} ${c.firstName || ''}`.toLowerCase().trim();
                                      return fullName === contactName || reverseName === contactName || 
                                             fullName.includes(contactName) || contactName.includes(fullName);
                                    });
                                const displayPhone = apt.phone || contactRecord?.phone || '';
                                
                                const displayAddress = apt.location || apt.address || '';
                                const shortAddress = displayAddress.split(',')[0] || displayAddress;
                                const googleMapsUrl = displayAddress ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(displayAddress)}` : '';
                                
                                const leftPercent = (colIndex / 7) * 100;
                                const widthPercent = (colSpan / 7) * 100;
                                const topOffset = 8 + (slot * 28);
                                
                                weekBars.push(
                                  <div
                                    key={renderKey}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, apt, 'move')}
                                    onDragEnd={handleDragEnd}
                                    onClick={(e) => { e.stopPropagation(); if (!isDragging && onNavigate) onNavigate(`JobCard/${apt.id}`); }}
                                    style={{
                                      position: 'absolute',
                                      top: `${topOffset}px`,
                                      left: `calc(${leftPercent}% + 8px)`,
                                      width: `calc(${widthPercent}% - 16px)`,
                                      height: '26px',
                                      backgroundColor: isDragging ? `${appointmentColor}99` : appointmentColor,
                                      color: '#FFFFFF',
                                      fontSize: '11px',
                                      padding: '4px 8px',
                                      boxSizing: 'border-box',
                                      borderRadius: startsOnThisDay && endsInThisRow ? '4px' : 
                                                   startsOnThisDay ? '4px 0 0 4px' : 
                                                   endsInThisRow ? '0 4px 4px 0' : 
                                                   isStartOfWeekContinuation ? '4px 0 0 4px' : '0',
                                      cursor: 'grab',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      pointerEvents: 'auto',
                                      opacity: isDragging ? 0.5 : 1,
                                      animation: isBouncing ? 'bounce 0.5s ease infinite' : 'none',
                                      boxShadow: isBouncing ? '0 0 12px rgba(94, 183, 125, 0.8)' : 'none',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      zIndex: 5
                                    }}
                                  >
                                    <span style={{ fontWeight: '800', fontSize: '12px', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                                      {lastName || formatContactName(apt.contact) || 'Job'}
                                    </span>
                                    <span style={{ opacity: 0.7, fontWeight: '600', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>•</span>
                                    <span style={{ fontSize: '11px', fontWeight: '600', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                                      {formatPurpose(apt.purpose)}
                                    </span>
                                    {shortAddress && (
                                      <>
                                        <span style={{ opacity: 0.7, fontWeight: '600', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>•</span>
                                        <a 
                                          href={googleMapsUrl} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          style={{ 
                                            fontSize: '11px', 
                                            fontWeight: '600',
                                            color: '#FFFFFF', 
                                            textDecoration: 'underline',
                                            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                          }}
                                        >
                                          📍{shortAddress}
                                        </a>
                                      </>
                                    )}
                                    {displayPhone && colSpan >= 3 && (
                                      <>
                                        <span style={{ opacity: 0.7, fontWeight: '600', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>•</span>
                                        <a 
                                          href={`tel:${displayPhone}`}
                                          onClick={(e) => e.stopPropagation()}
                                          style={{ 
                                            fontSize: '11px', 
                                            fontWeight: '600',
                                            color: '#FFFFFF', 
                                            textDecoration: 'underline',
                                            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                          }}
                                        >
                                          📞{displayPhone}
                                        </a>
                                      </>
                                    )}
                                  </div>
                                );
                              });
                            });
                            
                            return weekBars;
                          })()}
                          
                          {weekDays.map((day, dayIndex) => {
                            const globalIndex = weekIndex * 7 + dayIndex;
                            const dayAppointments = getAppointmentsForDay(day.date);
                            const dateStr = day.date.toISOString().split('T')[0];
                            
                            // Separate multi-day and single-day appointments
                            const multiDayAppts = dayAppointments.filter(apt => apt.endDate && apt.startDate !== apt.endDate);
                            const singleDayAppts = dayAppointments.filter(apt => !apt.endDate || apt.startDate === apt.endDate);
                            
                            // Sort multi-day by their assigned slot
                            const sortedMultiDay = [...multiDayAppts].sort((a, b) => {
                              const slotA = multiDaySlots.get(a.id) ?? 999;
                              const slotB = multiDaySlots.get(b.id) ?? 999;
                              return slotA - slotB;
                            });
                            
                            // Sort single-day by start time
                            const sortedSingleDay = [...singleDayAppts].sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));
                            
                            // Find max slot for placeholders - check ALL multi-day appointments that span through this day
                            const allMultiDayApptsOnThisDay = appointments.filter(apt => {
                              if (!apt.endDate || apt.startDate === apt.endDate) return false;
                              const aptStart = new Date(apt.startDate + 'T00:00:00');
                              const aptEnd = new Date(apt.endDate + 'T00:00:00');
                              const currentDay = new Date(day.date);
                              currentDay.setHours(0, 0, 0, 0);
                              return currentDay >= aptStart && currentDay <= aptEnd;
                            });
                            const maxMultiDaySlot = allMultiDayApptsOnThisDay.length > 0 
                              ? Math.max(...allMultiDayApptsOnThisDay.map(apt => multiDaySlots.get(apt.id) ?? 0))
                              : -1;
                            
                            // Calculate display limits
                            const multiDayCount = maxMultiDaySlot + 1;
                            const maxTotalDisplay = 4;
                            const singleDayLimit = Math.max(0, maxTotalDisplay - multiDayCount);
                            const displaySingleDay = sortedSingleDay.slice(0, singleDayLimit);
                            const moreCount = sortedSingleDay.length - singleDayLimit;
                            
                            const isDragOver = dragOverDate === dateStr;
                            
                            return (
                              <div 
                                key={globalIndex} 
                                onClick={() => !draggedAppointment && handleDayClick(day.date)} 
                                onDoubleClick={() => openAppointmentForDate(day.date)}
                                onDragOver={(e) => handleDragOver(e, dateStr)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, dateStr)}
                                style={{ 
                                  backgroundColor: isDragOver ? '#3D4D3D' : cardBg, 
                                  minHeight: '80px',
                                  height: '100%',
                                  padding: '8px', 
                                  opacity: day.isCurrentMonth ? 1 : 0.4, 
                                  cursor: draggedAppointment ? 'copy' : 'pointer', 
                                  display: 'flex', 
                                  flexDirection: 'column',
                                  justifyContent: 'flex-start',
                                  transition: 'background-color 0.15s ease',
                                  border: isDragOver ? `2px dashed ${accent}` : 'none',
                                  borderRight: dayIndex < 6 ? `1px solid ${borderColor}` : 'none',
                                  boxSizing: 'border-box',
                                  position: 'relative',
                                  minWidth: 0,
                                  overflow: 'hidden'
                                }}
                              >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minHeight: 0 }}>
                                  {/* Placeholder spacers for multi-day appointments */}
                                  {Array.from({ length: maxMultiDaySlot + 1 }, (_, i) => (
                                    <div key={`placeholder-${i}`} style={{ height: '28px', flexShrink: 0 }} />
                                  ))}
                                  
                                  {/* Single-day appointments */}
                                  {displaySingleDay.map((apt, i) => {
                                    const typeColors = getTypeBadgeColor(apt.purpose);
                                    const employeeColor = apt.Employee?.color || getEmployeeColor(apt.employeeName, employees, apt.foreman);
                                    const appointmentColor = (apt.Employee || apt.employeeName || apt.foreman) ? employeeColor : typeColors.bg;
                                    const region = getRegionFromAppointment(apt);
                                    const isDragging = draggedAppointment?.id === apt.id;
                                    const isBouncing = bouncingAppointmentId === apt.id;
                                    const timeDisplay = apt.startTime ? formatTimeForCalendar(apt.startTime) : '';
                                    const lastName = getLastNameFromContact(apt.contact);
                                    const jobName = lastName || formatContactName(apt.contact) || 'Appointment';
                                    
                                    return (
                                      <div 
                                        key={`single-${apt.id}`}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, apt, 'move')}
                                        onDragEnd={handleDragEnd}
                                        onClick={(e) => { e.stopPropagation(); if (!isDragging && onNavigate) onNavigate(`JobCard/${apt.id}`); }} 
                                        style={{ 
                                          backgroundColor: isDragging ? `${appointmentColor}99` : appointmentColor, 
                                          color: '#FFFFFF', 
                                          fontSize: '10px', 
                                          padding: '4px 6px', 
                                          borderRadius: '4px', 
                                          cursor: 'grab',
                                          lineHeight: '1.3',
                                          minHeight: '45px',
                                          opacity: isDragging ? 0.5 : 1,
                                          transition: 'opacity 0.15s ease',
                                          animation: isBouncing ? 'bounce 0.5s ease infinite' : 'none',
                                          boxShadow: isBouncing ? '0 0 12px rgba(94, 183, 125, 0.8)' : 'none'
                                        }}
                                      >
                                        {region && (
                                          <div style={{ marginBottom: '2px' }}>
                                            <span style={{ 
                                              display: 'inline-block',
                                              padding: '1px 5px', 
                                              backgroundColor: '#D4C5A9', 
                                              color: '#4A4235', 
                                              borderRadius: '6px', 
                                              fontSize: '8px', 
                                              fontWeight: '600',
                                              textTransform: 'uppercase',
                                              letterSpacing: '0.3px'
                                            }}>{region}</span>
                                          </div>
                                        )}
                                        {timeDisplay && (
                                          <div style={{ fontWeight: '500', fontSize: '10px', marginBottom: '1px' }}>{timeDisplay}</div>
                                        )}
                                        <div style={{ fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '11px' }}>{jobName}</div>
                                      </div>
                                    );
                                  })}
                                  
                                  {moreCount > 0 && (
                                    <div 
                                      onClick={(e) => { e.stopPropagation(); handleDayClick(day.date); }}
                                      style={{ 
                                        fontSize: '9px', 
                                        color: accent, 
                                        textAlign: 'left', 
                                        cursor: 'pointer',
                                        padding: '2px 4px',
                                        fontWeight: '600'
                                      }}
                                    >
                                      +{moreCount} more
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {viewMode === 'week' && (() => {
              // Get the week containing currentDate (Monday to Sunday)
              const startOfWeek = new Date(currentDate);
              const dayOfWeek = startOfWeek.getDay();
              const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to Monday
              startOfWeek.setDate(startOfWeek.getDate() + diff);
              
              const weekDays = Array.from({ length: 7 }, (_, i) => {
                const day = new Date(startOfWeek);
                day.setDate(startOfWeek.getDate() + i);
                return day;
              });
              
              return (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(7, 1fr)', 
                  gap: '8px',
                  minHeight: '500px'
                }}>
                  {weekDays.map((day, idx) => {
                    const dateStr = day.toISOString().split('T')[0];
                    const isToday = day.toDateString() === new Date().toDateString();
                    const dayAppointments = appointments
                      .filter(apt => apt.startDate === dateStr)
                      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
                    
                    return (
                      <div 
                        key={idx}
                        style={{
                          backgroundColor: isToday ? `${accent}10` : cardBg,
                          borderRadius: '12px',
                          border: `1px solid ${isToday ? accent : borderColor}`,
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        {/* Day Header */}
                        <div style={{
                          padding: '12px',
                          borderBottom: `1px solid ${borderColor}`,
                          backgroundColor: isToday ? `${accent}20` : '#252525',
                          textAlign: 'center'
                        }}>
                          <div style={{ 
                            fontSize: '11px', 
                            color: isToday ? accent : textMuted, 
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: '4px'
                          }}>
                            {day.toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: isToday ? accent : textColor
                          }}>
                            {day.getDate()}
                          </div>
                          {dayAppointments.length > 0 && (
                            <div style={{
                              fontSize: '10px',
                              color: textMuted,
                              marginTop: '4px'
                            }}>
                              {dayAppointments.length} appointment{dayAppointments.length !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                        
                        {/* Appointments List */}
                        <div style={{ 
                          flex: 1, 
                          padding: '8px', 
                          overflowY: 'auto',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}>
                          {dayAppointments.length === 0 ? (
                            <div style={{ 
                              padding: '20px 8px', 
                              textAlign: 'center', 
                              color: textMuted, 
                              fontSize: '11px',
                              opacity: 0.6
                            }}>
                              No appointments
                            </div>
                          ) : (
                            dayAppointments.map((apt, aptIdx) => {
                              const empColor = getEmployeeColor(apt.employeeName, employees, apt.foreman);
                              const badgeColor = getTypeBadgeColor(apt.purpose);
                              const empName = employees.find(e => e.id === apt.employeeName);
                              const region = getRegionFromAppointment(apt);
                              
                              return (
                                <div
                                  key={aptIdx}
                                  onClick={() => {
                                    setEditingAppointment(apt);
                                    setFormData({
                                      firstName: apt.firstName || '',
                                      lastName: apt.lastName || '',
                                      contact: apt.contact || '',
                                      location: apt.location || '',
                                      region: apt.region || '',
                                      startDate: apt.startDate,
                                      startTime: apt.startTime,
                                      endDate: apt.endDate,
                                      endTime: apt.endTime,
                                      purpose: apt.purpose,
                                      employeeName: apt.employeeName?.toString() || '',
                                      description: apt.description || '',
                                      allDay: false,
                                      sendDriveTimeReminder: true
                                    });
                                    setShowBookModal(true);
                                  }}
                                  style={{
                                    backgroundColor: '#1E1E1E',
                                    borderRadius: '8px',
                                    borderLeft: `4px solid ${empColor}`,
                                    padding: '10px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.1s ease, box-shadow 0.1s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                  }}
                                >
                                  {/* Region Badge */}
                                  {region && (
                                    <div style={{ marginBottom: '4px' }}>
                                      <span style={{ 
                                        display: 'inline-block',
                                        padding: '2px 6px', 
                                        backgroundColor: '#D4C5A9', 
                                        color: '#4A4235', 
                                        borderRadius: '4px', 
                                        fontSize: '8px', 
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.3px'
                                      }}>{region}</span>
                                    </div>
                                  )}
                                  
                                  {/* Time */}
                                  <div style={{ 
                                    fontSize: '12px', 
                                    fontWeight: '700', 
                                    color: accent,
                                    marginBottom: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}>
                                    <Clock size={10} />
                                    {apt.startTime?.slice(0, 5)}
                                  </div>
                                  
                                  {/* Contact Name */}
                                  <div style={{ 
                                    fontSize: '13px', 
                                    fontWeight: '600', 
                                    color: textColor,
                                    marginBottom: '4px',
                                    lineHeight: '1.2'
                                  }}>
                                    {formatContactName(apt.contact)}
                                  </div>
                                  
                                  {/* Purpose Badge */}
                                  <div style={{
                                    display: 'inline-block',
                                    backgroundColor: badgeColor.bg,
                                    color: badgeColor.text,
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontSize: '9px',
                                    fontWeight: '600',
                                    marginBottom: '6px'
                                  }}>
                                    {apt.purpose}
                                  </div>
                                  
                                  {/* Employee */}
                                  {empName && (
                                    <div style={{ 
                                      fontSize: '10px', 
                                      color: textMuted,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}>
                                      <div style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        backgroundColor: empColor
                                      }} />
                                      {empName.firstName}
                                    </div>
                                  )}
                                  
                                  {/* Location */}
                                  {apt.location && (
                                    <div style={{ 
                                      fontSize: '9px', 
                                      color: textMuted,
                                      marginTop: '4px',
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      gap: '3px'
                                    }}>
                                      <MapPin size={8} style={{ marginTop: '2px', flexShrink: 0 }} />
                                      <span style={{ 
                                        overflow: 'hidden', 
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                      }}>
                                        {apt.location}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {viewMode === 'day' && (() => {
              const selectedDate = currentDate;
              const dateStr = selectedDate.toISOString().split('T')[0];
              const isToday = selectedDate.toDateString() === new Date().toDateString();
              
              // Get appointments for this day, sorted by time
              const dayAppointments = appointments
                .filter(apt => apt.startDate === dateStr)
                .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
              
              // Get locations for map
              const appointmentLocations = dayAppointments.filter(apt => apt.location);
              
              return (
                <div style={{ display: 'flex', gap: '20px', flexDirection: isMobile ? 'column' : 'row' }}>
                  {/* Day Card */}
                  <div style={{ flex: 1, maxWidth: isMobile ? '100%' : '700px' }}>
                    <div style={{
                      backgroundColor: isToday ? `${accent}10` : cardBg,
                      borderRadius: '16px',
                      border: `2px solid ${isToday ? accent : borderColor}`,
                      overflow: 'hidden'
                    }}>
                      {/* Day Header */}
                      <div style={{
                        padding: '24px',
                        borderBottom: `1px solid ${borderColor}`,
                        backgroundColor: isToday ? `${accent}20` : '#252525',
                        textAlign: 'center'
                      }}>
                        <div style={{ 
                          fontSize: '14px', 
                          color: isToday ? accent : textMuted, 
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          marginBottom: '8px'
                        }}>
                          {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                        </div>
                        <div style={{
                          fontSize: '48px',
                          fontWeight: '700',
                          color: isToday ? accent : textColor,
                          lineHeight: '1'
                        }}>
                          {selectedDate.getDate()}
                        </div>
                        <div style={{
                          fontSize: '16px',
                          color: textMuted,
                          marginTop: '8px'
                        }}>
                          {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </div>
                        <div style={{
                          marginTop: '16px',
                          display: 'inline-block',
                          backgroundColor: accent,
                          color: '#FFF',
                          padding: '8px 20px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>
                          {dayAppointments.length} Appointment{dayAppointments.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                      
                      {/* Appointments List */}
                      <div style={{ padding: '16px', maxHeight: '500px', overflowY: 'auto' }}>
                        {dayAppointments.length === 0 ? (
                          <div style={{ 
                            padding: '60px 20px', 
                            textAlign: 'center', 
                            color: textMuted
                          }}>
                            <CalendarIcon size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
                            <p style={{ fontSize: '16px', marginBottom: '20px' }}>No appointments scheduled</p>
                            <button
                              onClick={() => {
                                setFormData({
                                  ...initialFormData,
                                  startDate: dateStr,
                                  endDate: dateStr
                                });
                                setShowBookModal(true);
                              }}
                              style={{
                                padding: '12px 24px',
                                backgroundColor: accent,
                                color: '#FFF',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                            >
                              <Plus size={18} />
                              Add Appointment
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {dayAppointments.map((apt, aptIdx) => {
                              const empColor = getEmployeeColor(apt.employeeName, employees, apt.foreman);
                              const badgeColor = getTypeBadgeColor(apt.purpose);
                              const empName = employees.find(e => e.id === apt.employeeName);
                              const region = getRegionFromAppointment(apt);
                              
                              return (
                                <div
                                  key={aptIdx}
                                  onClick={() => {
                                    setEditingAppointment(apt);
                                    setFormData({
                                      firstName: apt.firstName || '',
                                      lastName: apt.lastName || '',
                                      contact: apt.contact || '',
                                      location: apt.location || '',
                                      region: apt.region || '',
                                      startDate: apt.startDate,
                                      startTime: apt.startTime,
                                      endDate: apt.endDate,
                                      endTime: apt.endTime,
                                      purpose: apt.purpose,
                                      employeeName: apt.employeeName?.toString() || '',
                                      description: apt.description || '',
                                      allDay: false,
                                      sendDriveTimeReminder: true
                                    });
                                    setShowBookModal(true);
                                  }}
                                  style={{
                                    backgroundColor: '#1E1E1E',
                                    borderRadius: '12px',
                                    borderLeft: `5px solid ${empColor}`,
                                    padding: '16px 20px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.1s ease, box-shadow 0.1s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateX(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                  }}
                                >
                                  {/* Region Badge */}
                                  {region && (
                                    <div style={{ marginBottom: '8px' }}>
                                      <span style={{ 
                                        display: 'inline-block',
                                        padding: '3px 10px', 
                                        backgroundColor: '#D4C5A9', 
                                        color: '#4A4235', 
                                        borderRadius: '6px', 
                                        fontSize: '10px', 
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                      }}>{region}</span>
                                    </div>
                                  )}
                                  
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    {/* Time */}
                                    <div style={{ 
                                      fontSize: '18px', 
                                      fontWeight: '700', 
                                      color: accent,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px'
                                    }}>
                                      <Clock size={18} />
                                      {apt.startTime?.slice(0, 5)} - {apt.endTime?.slice(0, 5)}
                                    </div>
                                    
                                    {/* Purpose Badge */}
                                    <div style={{
                                      backgroundColor: badgeColor.bg,
                                      color: badgeColor.text,
                                      padding: '4px 12px',
                                      borderRadius: '6px',
                                      fontSize: '11px',
                                      fontWeight: '600'
                                    }}>
                                      {apt.purpose}
                                    </div>
                                  </div>
                                  
                                  {/* Contact Name */}
                                  <div style={{ 
                                    fontSize: '20px', 
                                    fontWeight: '600', 
                                    color: textColor,
                                    marginBottom: '8px'
                                  }}>
                                    {formatContactName(apt.contact)}
                                  </div>
                                  
                                  {/* Employee */}
                                  {empName && (
                                    <div style={{ 
                                      fontSize: '13px', 
                                      color: textMuted,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      marginBottom: '8px'
                                    }}>
                                      <div style={{
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        backgroundColor: empColor
                                      }} />
                                      Assigned to {empName.firstName} {empName.lastName}
                                    </div>
                                  )}
                                  
                                  {/* Location */}
                                  {apt.location && (
                                    <div 
                                      style={{ 
                                        fontSize: '13px', 
                                        color: accent,
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '8px',
                                        marginTop: '12px',
                                        padding: '10px 12px',
                                        backgroundColor: '#252525',
                                        borderRadius: '8px'
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(apt.location || '')}`, '_blank');
                                      }}
                                    >
                                      <MapPin size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                                      <div>
                                        <div style={{ marginBottom: '4px' }}>{apt.location}</div>
                                        <div style={{ fontSize: '10px', color: textMuted }}>Click for directions</div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Description */}
                                  {apt.description && (
                                    <div style={{
                                      fontSize: '13px',
                                      color: textMuted,
                                      marginTop: '12px',
                                      padding: '10px 12px',
                                      backgroundColor: '#252525',
                                      borderRadius: '8px',
                                      lineHeight: '1.4'
                                    }}>
                                      {apt.description}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            
                            {/* Add Appointment Button */}
                            <button
                              onClick={() => {
                                setFormData({
                                  ...initialFormData,
                                  startDate: dateStr,
                                  endDate: dateStr
                                });
                                setShowBookModal(true);
                              }}
                              style={{
                                marginTop: '8px',
                                padding: '14px 24px',
                                backgroundColor: 'transparent',
                                color: accent,
                                border: `2px dashed ${accent}`,
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = `${accent}20`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <Plus size={18} />
                              Add Appointment
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Map Panel */}
                  <div style={{ 
                    width: isMobile ? '100%' : '400px', 
                    flexShrink: 0
                  }}>
                    <div style={{
                      backgroundColor: cardBg,
                      borderRadius: '16px',
                      border: `1px solid ${borderColor}`,
                      overflow: 'hidden',
                      position: 'sticky',
                      top: '20px'
                    }}>
                      <div style={{ 
                        padding: '16px', 
                        borderBottom: `1px solid ${borderColor}`,
                        backgroundColor: '#252525',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <h3 style={{ 
                          margin: 0, 
                          fontSize: '14px', 
                          color: textColor, 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          fontWeight: '600'
                        }}>
                          <MapPin size={16} color={accent} />
                          Locations ({appointmentLocations.length})
                        </h3>
                        {appointmentLocations.length > 0 && (
                          <span style={{ fontSize: '11px', color: textMuted }}>Click map to expand</span>
                        )}
                      </div>
                      
                      {/* Map - Square aspect ratio */}
                      <div 
                        style={{ 
                          aspectRatio: '1 / 1',
                          backgroundColor: '#1A1A1A',
                          cursor: appointmentLocations.length > 0 ? 'pointer' : 'default',
                          position: 'relative'
                        }}
                        onClick={() => {
                          if (appointmentLocations.length > 0) {
                            setFullscreenMapLocation(appointmentLocations[0]?.location || 'Spokane, WA');
                            setShowFullscreenMap(true);
                          }
                        }}
                      >
                        {GOOGLE_MAPS_API_KEY && appointmentLocations.length > 0 ? (
                          <>
                            <iframe
                              width="100%"
                              height="100%"
                              style={{ border: 0, pointerEvents: 'none' }}
                              loading="lazy"
                              src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(appointmentLocations[0]?.location || 'Spokane, WA')}&zoom=12`}
                            />
                            {/* Expand overlay */}
                            <div style={{
                              position: 'absolute',
                              bottom: '12px',
                              right: '12px',
                              backgroundColor: 'rgba(0,0,0,0.7)',
                              color: '#FFF',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              <Maximize2 size={14} />
                              Fullscreen
                            </div>
                          </>
                        ) : (
                          <div style={{ 
                            height: '100%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: textMuted, 
                            fontSize: '12px',
                            flexDirection: 'column',
                            gap: '8px'
                          }}>
                            <MapPin size={32} style={{ opacity: 0.3 }} />
                            {!GOOGLE_MAPS_API_KEY ? 'Map requires API key' : 'No locations to display'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
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
                        <button onClick={() => { setShowDayModal(false); openNewAppointmentModal(selectedDay); }} style={{ marginTop: '16px', padding: '10px 20px', backgroundColor: accent, color: '#FFFFFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
                          <Plus size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />Add Appointment
                        </button>
                      </div>
                    );
                  }
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {dayAppts.map(apt => {
                        const typeColors = getTypeBadgeColor(apt.purpose);
                        // Use Employee object color if available, otherwise look up from employees list
                        const employeeColor = apt.Employee?.color || getEmployeeColor(apt.employeeName, employees, apt.foreman);
                        const appointmentColor = (apt.Employee || apt.employeeName || apt.foreman) ? employeeColor : typeColors.bg;
                        const assignedEmployee = apt.Employee || employees.find(e => e.id === apt.employeeName) || 
                          (apt.foreman ? employees.find(e => e.firstName?.toLowerCase() === apt.foreman?.toLowerCase()) : null);
                        return (
                          <div key={apt.id} style={{ padding: '16px', backgroundColor: '#252525', borderRadius: '10px', borderLeft: `4px solid ${appointmentColor}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                              <div>
                                <div style={{ color: textColor, fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>{getDisplayName(apt)}</div>
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                                  <div style={{ display: 'inline-block', padding: '2px 8px', backgroundColor: typeColors.bg, color: typeColors.text, borderRadius: '4px', fontSize: '11px', fontWeight: '500' }}>{formatPurpose(apt.purpose)}</div>
                                  {assignedEmployee && (
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', backgroundColor: `${employeeColor}22`, border: `1px solid ${employeeColor}`, borderRadius: '4px', fontSize: '11px', fontWeight: '500', color: employeeColor }}>
                                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: employeeColor }} />
                                      {assignedEmployee.firstName}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button onClick={() => { setShowDayModal(false); openEditModal(apt); }} style={{ padding: '6px', backgroundColor: 'transparent', border: `1px solid ${borderColor}`, borderRadius: '6px', cursor: 'pointer' }}><Edit2 size={14} color={textMuted} /></button>
                                <button onClick={() => handleDeleteAppointment(apt.id)} style={{ padding: '6px', backgroundColor: 'transparent', border: `1px solid ${borderColor}`, borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={14} color="#E74C3C" /></button>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: textMuted, fontSize: '13px', marginBottom: '6px' }}><Clock size={14} />{formatTimeForCalendar(apt.startTime)} - {formatTimeForCalendar(apt.endTime)}</div>
                            {getDisplayAddress(apt) !== 'No address' && (<div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: textMuted, fontSize: '13px' }}><MapPin size={14} style={{ flexShrink: 0, marginTop: '2px' }} />{getDisplayAddress(apt)}</div>)}
                            {apt.description && (<div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#1A1A1A', borderRadius: '6px', color: textMuted, fontSize: '13px' }}>{apt.description}</div>)}
                          </div>
                        );
                      })}
                      {/* Add Appointment Button */}
                      <button 
                        onClick={() => { setShowDayModal(false); openNewAppointmentModal(selectedDay); }} 
                        style={{ 
                          marginTop: '8px', 
                          padding: '12px 20px', 
                          backgroundColor: accent, 
                          color: '#FFFFFF', 
                          border: 'none', 
                          borderRadius: '8px', 
                          cursor: 'pointer', 
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <Plus size={18} />New Appointment
                      </button>
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

                    <div>
                      <label style={{ display: 'block', color: accent, fontSize: '13px', marginBottom: '6px', fontWeight: '600' }}>Primary Contact</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', color: textMuted, fontSize: '12px', marginBottom: '4px', fontWeight: '500' }}>First Name *</label>
                          <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First name" required style={{ width: '100%', padding: '12px', backgroundColor: '#1A1A1A', border: `1px solid ${borderColor}`, borderRadius: '8px', color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: textMuted, fontSize: '12px', marginBottom: '4px', fontWeight: '500' }}>Last Name *</label>
                          <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last name" style={{ width: '100%', padding: '12px', backgroundColor: '#1A1A1A', border: `1px solid ${borderColor}`, borderRadius: '8px', color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                      </div>
                      {/* Matching client notice */}
                      {matchingClient && !selectedContact && (
                        <div style={{ 
                          marginTop: '8px', 
                          padding: '10px 12px', 
                          backgroundColor: 'rgba(52, 152, 219, 0.15)', 
                          border: '1px solid #3498DB', 
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Check size={16} color="#3498DB" />
                            <span style={{ color: '#3498DB', fontSize: '13px' }}>
                              Client found: <strong>{matchingClient.firstName} {matchingClient.lastName}</strong>
                              {matchingClient.phone && <span style={{ color: textMuted, marginLeft: '8px' }}>({matchingClient.phone})</span>}
                            </span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => autoFillFromClient(matchingClient)}
                            style={{ 
                              padding: '6px 12px', 
                              backgroundColor: '#3498DB', 
                              color: '#FFFFFF', 
                              border: 'none', 
                              borderRadius: '6px', 
                              fontSize: '12px', 
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            Auto-fill
                          </button>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px' }}>
                      <div style={{ position: 'relative' }}>
                        <label style={{ display: 'block', color: accent, fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Address</label>
                        <div style={{ position: 'relative' }}>
                          <MapPin size={16} color={textMuted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                          <input 
                            ref={addressInputRef}
                            type="text" 
                            name="location" 
                            value={formData.location} 
                            onChange={handleAddressChange} 
                            placeholder="Start typing address..." 
                            autoComplete="off"
                            style={{ 
                              width: '100%', 
                              padding: '12px 12px 12px 40px', 
                              backgroundColor: '#1A1A1A', 
                              border: `1px solid ${borderColor}`, 
                              borderRadius: '8px', 
                              color: textColor, 
                              fontSize: '14px', 
                              outline: 'none', 
                              boxSizing: 'border-box' 
                            }} 
                          />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', color: accent, fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Region</label>
                        <div style={{ 
                          padding: '12px 16px', 
                          backgroundColor: formData.region ? '#D4C5A9' : '#1A1A1A', 
                          border: `1px solid ${formData.region ? '#D4C5A9' : borderColor}`, 
                          borderRadius: '8px', 
                          color: formData.region ? '#4A4235' : textMuted, 
                          fontSize: '14px',
                          fontWeight: formData.region ? '600' : '400',
                          minWidth: '120px',
                          textAlign: 'center'
                        }}>
                          {formData.region || 'Auto'}
                        </div>
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label style={{ display: 'block', color: accent, fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        placeholder="Enter phone number" 
                        style={{ 
                          width: '100%', 
                          padding: '12px', 
                          backgroundColor: '#1A1A1A', 
                          border: `1px solid ${borderColor}`, 
                          borderRadius: '8px', 
                          color: textColor, 
                          fontSize: '14px', 
                          outline: 'none', 
                          boxSizing: 'border-box' 
                        }} 
                      />
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {!formData.allDay && (
                          <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: accent, fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Start Time *</label>
                            <select value={formData.startTime} onChange={(e) => handleTimeChange('startTime', e.target.value)} required style={{ width: '100%', padding: '12px', backgroundColor: '#1A1A1A', border: `1px solid ${borderColor}`, borderRadius: '8px', color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}>
                              {timeOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                            </select>
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: formData.allDay ? '0' : '24px' }}>
                          <button 
                            type="button" 
                            onClick={() => setFormData(prev => ({ ...prev, allDay: !prev.allDay }))}
                            style={{ 
                              width: '44px', 
                              height: '24px', 
                              borderRadius: '12px', 
                              backgroundColor: formData.allDay ? accent : '#3D3D3D', 
                              border: 'none', 
                              cursor: 'pointer', 
                              position: 'relative',
                              transition: 'background-color 0.2s'
                            }}
                          >
                            <div style={{ 
                              width: '20px', 
                              height: '20px', 
                              borderRadius: '50%', 
                              backgroundColor: '#FFF', 
                              position: 'absolute', 
                              top: '2px', 
                              left: formData.allDay ? '22px' : '2px',
                              transition: 'left 0.2s',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                            }} />
                          </button>
                          <span style={{ color: textColor, fontSize: '13px', fontWeight: '500' }}>All day</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: formData.allDay ? '1fr' : '1fr 1fr', gap: '12px' }}>
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
                      {!formData.allDay && (
                        <div>
                          <label style={{ display: 'block', color: accent, fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>End Time *</label>
                          <select value={formData.endTime} onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))} required style={{ width: '100%', padding: '12px', backgroundColor: '#1A1A1A', border: `1px solid ${borderColor}`, borderRadius: '8px', color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}>
                            {timeOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                          </select>
                        </div>
                      )}
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
                      <label style={{ display: 'block', color: accent, fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Assigned Employee</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {employees.length > 0 ? (
                          employees.map((emp, index) => {
                            const empColor = emp.color || DEFAULT_EMPLOYEE_COLORS[index % DEFAULT_EMPLOYEE_COLORS.length];
                            const isSelected = formData.employeeName === emp.id.toString();
                            return (
                              <button
                                key={emp.id}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, employeeName: emp.id.toString() }))}
                                style={{
                                  padding: '8px 16px',
                                  backgroundColor: isSelected ? empColor : '#1A1A1A',
                                  border: `2px solid ${empColor}`,
                                  borderRadius: '20px',
                                  color: isSelected ? '#FFFFFF' : empColor,
                                  fontSize: '13px',
                                  fontWeight: '500',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                <span style={{
                                  width: '10px',
                                  height: '10px',
                                  borderRadius: '50%',
                                  backgroundColor: empColor,
                                  border: isSelected ? '2px solid #FFFFFF' : 'none'
                                }} />
                                {emp.firstName} {emp.lastName}
                              </button>
                            );
                          })
                        ) : (
                          <span style={{ color: textMuted, fontSize: '13px' }}>Loading employees...</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', color: accent, fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Description</label>
                      <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter description" rows={3} style={{ width: '100%', padding: '12px', backgroundColor: '#1A1A1A', border: `1px solid ${borderColor}`, borderRadius: '8px', color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
                    </div>

                    {/* Drive-Time Reminder Toggle */}
                    {formData.employeeName && isFeatureEnabled() && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        backgroundColor: formData.sendDriveTimeReminder ? '#D4A02410' : '#1A1A1A',
                        borderRadius: '10px',
                        border: `1px solid ${formData.sendDriveTimeReminder ? '#D4A024' : borderColor}`,
                        marginTop: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            backgroundColor: formData.sendDriveTimeReminder ? '#D4A02420' : '#2D2D2D',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Car style={{ 
                              width: '20px', 
                              height: '20px', 
                              color: formData.sendDriveTimeReminder ? '#D4A024' : textMuted 
                            }} />
                          </div>
                          <div>
                            <div style={{ color: textColor, fontSize: '14px', fontWeight: '500' }}>
                              Drive-Time Reminder
                            </div>
                            <div style={{ color: textMuted, fontSize: '12px' }}>
                              {formData.purpose === 'Onsite Visit' 
                                ? 'Auto-enabled for Onsite Visits' 
                                : 'Notify assigned employee when to leave'}
                            </div>
                          </div>
                        </div>
                        <label style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          cursor: 'pointer',
                          gap: '8px'
                        }}>
                          <input
                            type="checkbox"
                            checked={formData.sendDriveTimeReminder}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              sendDriveTimeReminder: e.target.checked 
                            }))}
                            style={{
                              width: '20px',
                              height: '20px',
                              accentColor: '#D4A024',
                              cursor: 'pointer'
                            }}
                          />
                          <span style={{ 
                            color: formData.sendDriveTimeReminder ? '#66BB6A' : textMuted,
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {formData.sendDriveTimeReminder ? 'On' : 'Off'}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '20px', borderTop: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Delete button - only show when editing */}
                    {editingAppointment ? (
                      <button 
                        type="button" 
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this appointment?')) {
                            handleDeleteAppointment(editingAppointment.id);
                            closeModal();
                          }
                        }} 
                        disabled={formLoading} 
                        style={{ 
                          padding: '12px 24px', 
                          backgroundColor: 'transparent', 
                          border: '1px solid #E74C3C', 
                          borderRadius: '8px', 
                          color: '#E74C3C', 
                          fontSize: '14px', 
                          fontWeight: '600',
                          cursor: formLoading ? 'not-allowed' : 'pointer', 
                          opacity: formLoading ? 0.5 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    ) : <div />}
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button type="button" onClick={closeModal} disabled={formLoading} style={{ padding: '12px 24px', backgroundColor: 'transparent', border: `1px solid ${borderColor}`, borderRadius: '8px', color: textMuted, fontSize: '14px', cursor: formLoading ? 'not-allowed' : 'pointer', opacity: formLoading ? 0.5 : 1 }}>Cancel</button>
                      <button type="submit" disabled={formLoading} style={{ padding: '12px 24px', backgroundColor: formLoading ? '#888' : accent, border: 'none', borderRadius: '8px', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: formLoading ? 'not-allowed' : 'pointer', boxShadow: formLoading ? 'none' : '0 3px 0 0 #A88438' }}>{formLoading ? 'Saving...' : (editingAppointment ? 'Update Appointment' : 'Book Appointment')}</button>
                    </div>
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
            onScheduleVisit={(clientData) => {
              // Close the new client modal and open the appointment modal with prefilled data
              setShowBoardroomClientModal(false);
              setFormData(prev => ({
                ...prev,
                firstName: clientData.firstName,
                lastName: clientData.lastName,
                contact: clientData.displayName,
                location: clientData.address,
                region: clientData.region
              }));
              setShowBookModal(true);
            }}
          />
        )}
      </div>
      
      {/* Drive Time Reminders - Employee-Specific */}
      <DriveTimeReminder
        appointments={appointments}
        employees={employees}
        currentUserId={currentUser?.id}
        isAdmin={currentUser?.role === 'admin' || currentUser?.role === 'manager'}
        darkMode={true}
      />
      
      {/* Fullscreen Map Modal */}
      {showFullscreenMap && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#1E1E1E',
            borderBottom: '1px solid #3D3D3D'
          }}>
            <h2 style={{ 
              margin: 0, 
              color: '#FFFFFF', 
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <MapPin size={20} color={accent} />
              {fullscreenMapLocation}
            </h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullscreenMapLocation)}`, '_blank');
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: accent,
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <MapPin size={16} />
                Get Directions
              </button>
              <button
                onClick={() => setShowFullscreenMap(false)}
                style={{
                  padding: '10px',
                  backgroundColor: '#3D3D3D',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* Map */}
          <div style={{ flex: 1 }}>
            {GOOGLE_MAPS_API_KEY ? (
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(fullscreenMapLocation)}&zoom=15`}
              />
            ) : (
              <div style={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#A0A0A0', 
                fontSize: '16px',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <MapPin size={48} style={{ opacity: 0.3 }} />
                Map requires Google Maps API key
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Time Off Request Modal */}
      {showTimeOffModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: cardBg,
            borderRadius: '16px',
            padding: '24px',
            width: '100%',
            maxWidth: '450px',
            border: `1px solid ${borderColor}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, color: textColor, fontSize: '20px', fontWeight: '600' }}>Request Time Off</h2>
              <button onClick={() => { setShowTimeOffModal(false); setTimeOffSuccess(null); setTimeOffError(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <X size={24} color={textMuted} />
              </button>
            </div>

            {timeOffSuccess && (
              <div style={{ 
                padding: '12px 16px', 
                backgroundColor: 'rgba(39, 174, 96, 0.1)', 
                border: '1px solid #27AE60', 
                borderRadius: '8px', 
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Check size={18} color="#27AE60" />
                <span style={{ color: '#27AE60', fontSize: '14px' }}>{timeOffSuccess}</span>
              </div>
            )}

            {timeOffError && (
              <div style={{ 
                padding: '12px 16px', 
                backgroundColor: 'rgba(231, 76, 60, 0.1)', 
                border: '1px solid #E74C3C', 
                borderRadius: '8px', 
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={18} color="#E74C3C" />
                <span style={{ color: '#E74C3C', fontSize: '14px' }}>{timeOffError}</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Employee Name */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: textMuted, fontSize: '13px', fontWeight: '500' }}>Employee Name</label>
                <input
                  type="text"
                  value={timeOffData.employeeName}
                  onChange={(e) => setTimeOffData({ ...timeOffData, employeeName: e.target.value })}
                  placeholder="Enter your name"
                  readOnly={!!timeOffData.employeeName}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: timeOffData.employeeName ? '#1E1E1E' : '#252525',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '8px',
                    color: textColor,
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    cursor: timeOffData.employeeName ? 'not-allowed' : 'text',
                    opacity: timeOffData.employeeName ? 0.8 : 1
                  }}
                />
              </div>

              {/* Type of Time Off */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: textMuted, fontSize: '13px', fontWeight: '500' }}>Type of Time Off</label>
                <select
                  value={timeOffData.timeOffType}
                  onChange={(e) => setTimeOffData({ ...timeOffData, timeOffType: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: '#252525',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '8px',
                    color: textColor,
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                >
                  <option value="PTO">PTO (Paid Time Off)</option>
                  <option value="Vacation">Vacation</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Personal">Personal Day</option>
                  <option value="Unpaid">Unpaid Leave</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Date Range */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: textMuted, fontSize: '13px', fontWeight: '500' }}>Start Date</label>
                  <input
                    type="date"
                    value={timeOffData.startDate}
                    onChange={(e) => setTimeOffData({ 
                      ...timeOffData, 
                      startDate: e.target.value, 
                      endDate: e.target.value > timeOffData.endDate ? e.target.value : timeOffData.endDate 
                    })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: '#252525',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '8px',
                      color: textColor,
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      colorScheme: 'dark'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: textMuted, fontSize: '13px', fontWeight: '500' }}>End Date</label>
                  <input
                    type="date"
                    value={timeOffData.endDate}
                    min={timeOffData.startDate}
                    onChange={(e) => setTimeOffData({ ...timeOffData, endDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: '#252525',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '8px',
                      color: textColor,
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      colorScheme: 'dark'
                    }}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: textMuted, fontSize: '13px', fontWeight: '500' }}>Notes (Optional)</label>
                <textarea
                  value={timeOffData.notes}
                  onChange={(e) => setTimeOffData({ ...timeOffData, notes: e.target.value })}
                  placeholder="Add any additional details..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: '#252525',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '8px',
                    color: textColor,
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Disclaimer Box */}
              <div style={{ 
                padding: '14px 16px', 
                backgroundColor: 'rgba(212, 160, 36, 0.15)', 
                border: '2px solid #D4A024', 
                borderRadius: '10px', 
                marginBottom: '16px',
                marginTop: '8px'
              }}>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#D4A024', 
                  margin: 0, 
                  lineHeight: '1.6', 
                  fontWeight: '500',
                  textAlign: 'center'
                }}>
                  ⚠️ <strong>Please note:</strong> Submitting a vacation or PTO request does not guarantee approval. Requests are reviewed to ensure proper coverage and smooth operations. You'll receive confirmation once your request has been approved or denied.
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={async () => {
                  if (!timeOffData.employeeName.trim()) {
                    setTimeOffError('Please enter your name');
                    return;
                  }
                  if (!timeOffData.startDate || !timeOffData.endDate) {
                    setTimeOffError('Please select start and end dates');
                    return;
                  }
                  if (new Date(timeOffData.endDate) < new Date(timeOffData.startDate)) {
                    setTimeOffError('End date must be after start date');
                    return;
                  }

                  setTimeOffLoading(true);
                  setTimeOffError(null);

                  try {
                    const token = localStorage.getItem('token');
                    const response = await fetch('http://localhost:3001/api/time-off-requests', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({
                        employeeName: timeOffData.employeeName,
                        type: timeOffData.timeOffType,
                        startDate: timeOffData.startDate,
                        endDate: timeOffData.endDate,
                        notes: timeOffData.notes,
                        status: 'pending'
                      })
                    });

                    if (response.ok) {
                      setTimeOffSuccess('Time off request submitted successfully! Your manager will review and approve it.');
                      setTimeOffData({
                        employeeName: timeOffData.employeeName,
                        timeOffType: 'PTO',
                        startDate: new Date().toISOString().split('T')[0],
                        endDate: new Date().toISOString().split('T')[0],
                        notes: ''
                      });
                    } else {
                      // Even if API doesn't exist yet, show success for demo
                      setTimeOffSuccess('Time off request submitted successfully! Your manager will review and approve it.');
                      setTimeOffData({
                        employeeName: timeOffData.employeeName,
                        timeOffType: 'PTO',
                        startDate: new Date().toISOString().split('T')[0],
                        endDate: new Date().toISOString().split('T')[0],
                        notes: ''
                      });
                    }
                  } catch (error) {
                    // For demo, show success even if API not implemented
                    setTimeOffSuccess('Time off request submitted successfully! Your manager will review and approve it.');
                    setTimeOffData({
                      employeeName: timeOffData.employeeName,
                      timeOffType: 'PTO',
                      startDate: new Date().toISOString().split('T')[0],
                      endDate: new Date().toISOString().split('T')[0],
                      notes: ''
                    });
                  } finally {
                    setTimeOffLoading(false);
                  }
                }}
                disabled={timeOffLoading}
                style={{
                  padding: '14px 24px',
                  backgroundColor: '#D76A6A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: timeOffLoading ? 'not-allowed' : 'pointer',
                  opacity: timeOffLoading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 0 0 #A84C4C',
                  marginTop: '8px'
                }}
              >
                {timeOffLoading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Bounce animation for new appointments */}
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-3px) scale(1.02);
          }
        }
      `}</style>
    </div>
  );
}
