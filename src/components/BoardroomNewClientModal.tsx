import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X,
  Home,
  Briefcase,
  Palette,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Plus,
  Calendar,
  ChevronDown
} from 'lucide-react';

// Google Maps API key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Declare google maps types
declare global {
  interface Window {
    google: typeof google;
  }
}

// ZIP to Region mapping for auto-fill
const ZIP_TO_REGION: { [key: string]: string } = {
  // Spokane
  '99201': 'Spokane', '99202': 'Spokane', '99203': 'Spokane', '99204': 'Spokane', '99205': 'Spokane',
  '99207': 'Spokane', '99208': 'Spokane', '99210': 'Spokane', '99211': 'Spokane', '99213': 'Spokane',
  '99214': 'Spokane', '99217': 'Spokane', '99218': 'Spokane', '99219': 'Spokane', '99220': 'Spokane',
  '99223': 'Spokane', '99224': 'Spokane', '99228': 'Spokane',
  // Spokane Valley
  '99206': 'Valley', '99212': 'Valley', '99216': 'Valley', '99037': 'Valley',
  // Liberty Lake
  '99019': 'Liberty Lake',
  // Cheney
  '99004': 'Cheney',
  // Airway Heights
  '99001': 'Airway Heights',
  // Medical Lake
  '99022': 'Medical Lake',
  // Deer Park
  '99006': 'Deer Park',
  // Mead
  '99021': 'Mead',
  // Nine Mile Falls
  '99026': 'Nine Mile Falls',
  // Post Falls
  '83854': 'Post Falls', '83877': 'Post Falls',
  // Coeur d'Alene
  '83814': 'CDA', '83815': 'CDA', '83816': 'CDA',
  // Hayden
  '83835': 'Hayden',
  // Rathdrum
  '83858': 'Rathdrum',
};

interface BoardroomNewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated?: (client: any) => void;
  onScheduleVisit?: (clientData: { firstName: string; lastName: string; displayName: string; address: string; region: string }) => void;
}


// --- Input helpers (phone formatting + email quick-complete) ---
const digitsOnly = (v: string) => (v || '').replace(/\D/g, '');

const formatPhone = (v: string) => {
  const d = digitsOnly(v).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
};

const normalizeEmailDomain = (email: string) => {
  const e = (email || '').trim();
  const at = e.indexOf('@');
  if (at === -1) return e;
  const local = e.slice(0, at);
  let domain = e.slice(at + 1);
  if (!domain) return e;
  const common = ['gmail', 'yahoo', 'outlook', 'hotmail', 'icloud', 'aol', 'protonmail', 'live', 'msn'];
  if (common.includes(domain.toLowerCase())) domain = `${domain}.com`;
  return `${local}@${domain}`;
};

export default function BoardroomNewClientModal({ isOpen, onClose, onClientCreated, onScheduleVisit }: BoardroomNewClientModalProps) {
  // Section 1: Client Type & Account Info
  const [clientType, setClientType] = useState<'Homeowner' | 'Contractor' | 'Realtor' | 'Designer' | 'Property Manager' | 'Other'>('Homeowner');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [secondHomeowner, setSecondHomeowner] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [otherClientTypeLabel, setOtherClientTypeLabel] = useState('');
  
  // Success message state
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [displayNameManuallyEdited, setDisplayNameManuallyEdited] = useState(false);
const [leadSource, setLeadSource] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // Auto-generate display name based on client type
  const generateDisplayName = (first: string, last: string, type: string, second?: string) => {
    const f = first.trim();
    const l = last.trim();
    const s = second?.trim();

    if (!f && !l) return '';

    // Homeowners: Last, First (& Second)
    if (type === 'Homeowner') {
      if (l && f) {
        if (s) return `${l}, ${f} & ${s}`;
        return `${l}, ${f}`;
      }
      return l || f;
    }

    // Everyone else (Contractor/Realtor/Designer/Property Manager/Other):
    // Use First Last (contact style)
    if (f && l) return `${f} ${l}`;
    return f || l;
  };

  // Update display name when first/last name changes (unless manually edited)
  const handleFirstNameChange = (value: string) => {
    setFirstName(value);
    if (!displayNameManuallyEdited) {
      setDisplayName(generateDisplayName(value, lastName, clientType, secondHomeowner));
    }
  };

  const handleLastNameChange = (value: string) => {
    setLastName(value);
    if (!displayNameManuallyEdited) {
      setDisplayName(generateDisplayName(firstName, value, clientType, secondHomeowner));
    }
  };

  const handleSecondHomeownerChange = (value: string) => {
    setSecondHomeowner(value);
    if (!displayNameManuallyEdited) {
      setDisplayName(generateDisplayName(firstName, lastName, clientType, value));
    }
  };

  const handleClientTypeChange = (type: 'Homeowner' | 'Contractor' | 'Realtor' | 'Designer' | 'Property Manager' | 'Other') => {
    setClientType(type);
    if (type === 'Homeowner') {
      setCompanyName('');
    }
    if (type !== 'Other') {
      setOtherClientTypeLabel('');
    }
    if (!displayNameManuallyEdited) {
      setDisplayName(generateDisplayName(firstName, lastName, type, secondHomeowner));
    }
  };

  const handleDisplayNameChange = (value: string) => {
    setDisplayName(value);
    setDisplayNameManuallyEdited(true);
  };

  // Section 2: Primary Contact
  const [contactFirstName, setContactFirstName] = useState('');
  const [contactLastName, setContactLastName] = useState('');

  // Auto-fill Primary Contact name from the "Client Name" at the top.
  // Only fills when the Primary Contact fields are empty, so the user can change them freely.
  useEffect(() => {
    if (!contactFirstName && firstName) setContactFirstName(firstName);
  }, [firstName, contactFirstName]);

  useEffect(() => {
    if (!contactLastName && lastName) setContactLastName(lastName);
  }, [lastName, contactLastName]);
  const [phoneNumbers, setPhoneNumbers] = useState<Array<{ number: string; type: string; name?: string }>>([{ number: '', type: 'Mobile', name: '' }]);
  const [emailAddresses, setEmailAddresses] = useState<Array<{ email: string; name?: string }>>([{ email: '', name: '' }]);
  const [role, setRole] = useState('Owner');
  const [preferredContactMethods, setPreferredContactMethods] = useState<string[]>(['Phone']);
  const [isPrimaryContact, setIsPrimaryContact] = useState(true);
  const [grantPortalAccess, setGrantPortalAccess] = useState(false);
  const [receiveSMS, setReceiveSMS] = useState(false);
  const [receiveEmail, setReceiveEmail] = useState(true);

  // Section 3: Project / Work Information
  const [typeOfWork, setTypeOfWork] = useState<string[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [projectNotes, setProjectNotes] = useState('');

  // Section 4: Primary Property / Jobsite
  const [propertyNickname, setPropertyNickname] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [region, setRegion] = useState('');
  const [billingAddressSame, setBillingAddressSame] = useState(true);
  const [billingStreetAddress, setBillingStreetAddress] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingZip, setBillingZip] = useState('');
  const [propertyNotes, setPropertyNotes] = useState('');

  // Google Maps Autocomplete refs
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  // Section refs for scrolling to errors
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // Initialize Google Maps Autocomplete
  const initAutocomplete = useCallback(() => {
    if (!addressInputRef.current) {
      console.log('Google Maps: Address input ref not ready');
      return;
    }
    if (!window.google?.maps?.places) {
      console.log('Google Maps: Places API not loaded yet');
      return;
    }
    
    console.log('Google Maps: Initializing autocomplete...');
    
    // Remove any existing autocomplete
    if (autocompleteRef.current) {
      google.maps.event.clearInstanceListeners(autocompleteRef.current);
    }
    
    try {
      autocompleteRef.current = new google.maps.places.Autocomplete(addressInputRef.current, {
        componentRestrictions: { country: 'us' },
        types: ['address'],
        fields: ['address_components', 'formatted_address', 'geometry']
      });
      
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (!place?.address_components) return;
        
        let streetNumber = '';
        let route = '';
        let cityValue = '';
        let stateValue = '';
        let zipValue = '';
        
        for (const component of place.address_components) {
          const type = component.types[0];
          switch (type) {
            case 'street_number':
              streetNumber = component.long_name;
              break;
            case 'route':
              route = component.long_name;
              break;
            case 'locality':
              cityValue = component.long_name;
              break;
            case 'administrative_area_level_1':
              stateValue = component.short_name;
              break;
            case 'postal_code':
              zipValue = component.long_name;
              break;
          }
        }
        
        // Set address fields
        setStreetAddress(`${streetNumber} ${route}`.trim());
        setCity(cityValue);
        setState(stateValue);
        setZip(zipValue);
        
        // Auto-fill region based on ZIP
        if (zipValue && ZIP_TO_REGION[zipValue]) {
          setRegion(ZIP_TO_REGION[zipValue]);
        }
      });
      
      console.log('Google Maps: Autocomplete initialized successfully');
    } catch (error) {
      console.error('Google Maps: Error initializing autocomplete:', error);
    }
  }, []);

  // Load Google Maps script and initialize autocomplete
  useEffect(() => {
    if (!isOpen) return;
    
    const loadGoogleMaps = () => {
      // Check if already loaded
      if (window.google?.maps?.places) {
        console.log('Google Maps: Already loaded, initializing...');
        initAutocomplete();
        return;
      }
      
      // Check for API key
      if (!GOOGLE_MAPS_API_KEY) {
        console.warn('Google Maps: No API key found. Set VITE_GOOGLE_MAPS_API_KEY in your .env file');
        return;
      }
      
      console.log('Google Maps: Loading script...');
      
      const existingScript = document.getElementById('google-maps-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log('Google Maps: Script loaded');
          initAutocomplete();
        };
        script.onerror = () => {
          console.error('Google Maps: Failed to load script. Check your API key and billing.');
        };
        document.head.appendChild(script);
      } else {
        // Script exists but not loaded yet, wait for it
        const checkLoaded = setInterval(() => {
          if (window.google?.maps?.places) {
            clearInterval(checkLoaded);
            initAutocomplete();
          }
        }, 100);
        // Clear after 10 seconds
        setTimeout(() => clearInterval(checkLoaded), 10000);
      }
    };
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(loadGoogleMaps, 100);
    return () => clearTimeout(timer);
  }, [isOpen, initAutocomplete]);

  // Re-initialize autocomplete when input ref changes
  useEffect(() => {
    if (isOpen && addressInputRef.current && window.google?.maps?.places) {
      initAutocomplete();
    }
  }, [isOpen, initAutocomplete]);

  const roomOptions = [
    'Entry',
    'Living Room',
    'Family Room',
    'Great Room',
    'Dining Room',
    'Hallway',
    'Kitchen',
    'Bathroom',
    'Master Bedroom',
    'One Bedroom',
    'Two Bedrooms',
    'Three Bedrooms',
    'Four Bedrooms',
    'Five Bedrooms',
    'Office',
    'Laundry Room'
  ];

  // Custom room area state
  const [customRoomInput, setCustomRoomInput] = useState('');
  const [customRooms, setCustomRooms] = useState<string[]>([]);

  // Available tag options (will grow as custom tags are added)
  const [availableTags, setAvailableTags] = useState<string[]>([    'High Priority',
    'Repeat Customer',
    'Large Project',
    'Quick Turnaround',
    'Needs Follow-up',
    'Commercial',
    'Residential',
    'Designer Client',
    'Yellow Checklist'
  ]);
  const [newTagInput, setNewTagInput] = useState('');

  // Validation state - now stores error objects with scroll targets
  const [validationErrors, setValidationErrors] = useState<Array<{ message: string; field: string; ref?: React.RefObject<HTMLElement> }>>([]);
  const [showValidationError, setShowValidationError] = useState(false);

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const addCustomTag = () => {
    const trimmedTag = newTagInput.trim();
    if (trimmedTag && !availableTags.includes(trimmedTag)) {
      setAvailableTags([...availableTags, trimmedTag]);
      setTags([...tags, trimmedTag]);
      setNewTagInput('');
    } else if (trimmedTag && availableTags.includes(trimmedTag)) {
      // Tag already exists, just select it
      if (!tags.includes(trimmedTag)) {
        setTags([...tags, trimmedTag]);
      }
      setNewTagInput('');
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomTag();
    }
  };

  // Validation error type with scroll target
  interface ValidationError {
    message: string;
    field: string;
    ref?: React.RefObject<HTMLElement>;
  }

  // Validation function - returns errors with scroll targets
  const validateForm = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    // Required fields - Section 1
    if (!firstName.trim()) errors.push({ message: 'First Name is required', field: 'firstName', ref: firstNameRef as React.RefObject<HTMLElement> });
    if (clientType === 'Homeowner' && !lastName.trim()) errors.push({ message: 'Last Name is required', field: 'lastName', ref: lastNameRef as React.RefObject<HTMLElement> });
    if (!displayName.trim()) errors.push({ message: 'Display Name is required', field: 'displayName', ref: section1Ref as React.RefObject<HTMLElement> });


    // Business types require Company Name (Section 1)
    const businessTypes: string[] = ['Contractor', 'Realtor', 'Designer', 'Property Manager', 'Other'];
    if (businessTypes.includes(clientType) && !companyName.trim()) {
      errors.push({ message: 'Company Name is required', field: 'companyName', ref: section1Ref as React.RefObject<HTMLElement> });
    }

    // If "Other" selected, require the "Other Type" label (Section 1)
    if (clientType === 'Other' && !otherClientTypeLabel.trim()) {
      errors.push({ message: 'Please specify the Other type', field: 'otherClientTypeLabel', ref: section1Ref as React.RefObject<HTMLElement> });
    }
    
    // Contact info - at least one phone or email (Section 2)
    const hasPhone = phoneNumbers.some(p => p.number.trim() !== '');
    const hasEmail = emailAddresses.some(e => e.email.trim() !== '');
    if (!hasPhone && !hasEmail) {
      errors.push({ message: 'At least one phone number or email is required', field: 'contact', ref: phoneRef as React.RefObject<HTMLElement> });
    }
    
    // Validate phone format if provided
    phoneNumbers.forEach((phone, index) => {
      if (phone.number.trim() && !/^[\d\s\-\(\)\+]{7,}$/.test(phone.number.trim())) {
        errors.push({ message: `Phone ${index + 1} has invalid format`, field: 'phone', ref: phoneRef as React.RefObject<HTMLElement> });
      }
    });
    
    // Validate email format if provided
    emailAddresses.forEach((email, index) => {
      if (email.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.email.trim())) {
        errors.push({ message: `Email ${index + 1} has invalid format`, field: 'email', ref: emailRef as React.RefObject<HTMLElement> });
      }
    });
    
    // Property info - Section 4
    if (!streetAddress.trim()) errors.push({ message: 'Street Address is required', field: 'streetAddress', ref: addressInputRef as React.RefObject<HTMLElement> });
    if (!city.trim()) errors.push({ message: 'City is required', field: 'city', ref: section4Ref as React.RefObject<HTMLElement> });
    if (!state.trim()) errors.push({ message: 'State is required', field: 'state', ref: section4Ref as React.RefObject<HTMLElement> });
    if (!zip.trim()) errors.push({ message: 'ZIP code is required', field: 'zip', ref: section4Ref as React.RefObject<HTMLElement> });
    
    return errors;
  };

  // Scroll to error field
  const scrollToError = (error: ValidationError) => {
    if (error.ref?.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const element = error.ref.current;
      
      // Calculate position relative to scroll container
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const scrollTop = container.scrollTop + (elementRect.top - containerRect.top) - 100; // 100px offset from top
      
      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
      
      // Focus the element if it's an input
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        setTimeout(() => element.focus(), 300);
      }
      
      // Flash highlight effect
      element.style.transition = 'box-shadow 0.3s ease';
      element.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.5)';
      setTimeout(() => {
        element.style.boxShadow = '';
      }, 2000);
    }
  };

  // Handle save with validation
  const handleSave = (action: 'save' | 'visit') => {
    const errors = validateForm();
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationError(true);
      // Auto-hide after 10 seconds
      setTimeout(() => setShowValidationError(false), 10000);
      // Scroll to first error
      if (errors[0]) {
        setTimeout(() => scrollToError(errors[0]), 100);
      }
      return false;
    }
    
    setShowValidationError(false);
    setValidationErrors([]);
    
    // TODO: Implement actual API save logic here
    console.log('Saving client...', { action, clientType, companyName, otherClientTypeLabel, firstName, lastName, displayName, preferredContactMethods });
    
    // Build full address
    const fullAddress = `${streetAddress}, ${city}, ${state} ${zip}`;
      const billingFullAddress = billingAddressSame
        ? fullAddress
        : `${billingStreetAddress}, ${billingCity}, ${billingState} ${billingZip}`;
    
    // Get primary phone and email for the client record
    const primaryPhone = phoneNumbers.find(p => p.number.trim())?.number || '';
    const primaryEmail = emailAddresses.find(e => e.email.trim())?.email || '';
    
    if (action === 'save') {
      // Show success message, stay on modal
      setSaveSuccess('Client saved successfully!');
      setTimeout(() => setSaveSuccess(null), 4000);
      
      // Call onClientCreated if provided
      if (onClientCreated) {
        onClientCreated({
          id: Date.now(), // Temporary ID until API returns real one
          firstName,
          lastName,
          displayName,
          phone: primaryPhone,
          email: primaryEmail,
          address: fullAddress,
          billingAddressSame,
          billingAddress: billingFullAddress,
          region,
          preferredContactMethods,
          clientType,
          companyName,
          otherClientTypeLabel
        });
      }
    } else if (action === 'visit') {
      // Close modal and open calendar with client data
      setSaveSuccess('Client saved! Opening scheduler...');
      setTimeout(() => {
        setSaveSuccess(null);

        // Notify the app we want to schedule a visit for this client (Calendar will handle date click + prefilled modal)
        window.dispatchEvent(new CustomEvent('boardroom:schedule-visit', {
          detail: {
            client: {
              firstName,
              lastName,
              displayName,
              address: fullAddress,
              region,
              phone: primaryPhone,
              email: primaryEmail,
              clientType,
              companyName,
              otherClientTypeLabel
            }
          }
        }));

        // Switch view to calendar (App.tsx should listen for this event)
        window.dispatchEvent(new CustomEvent('boardroom:navigate', { detail: { screen: 'calendar' } }));

        // Close modal after signaling
        onClose();

        // Back-compat: call onScheduleVisit prop if provided
        if (onScheduleVisit) {
          onScheduleVisit({
            firstName,
            lastName,
            displayName,
            address: fullAddress,
            region
          });
        }
      }, 1000);
    }

    return true;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Google Places Autocomplete Dark Theme Styles */}
      <style>{`
        .pac-container {
          background-color: #2C2D2E !important;
          border: 1px solid #3A3A3B !important;
          border-radius: 10px !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4) !important;
          margin-top: 4px !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        .pac-item {
          background-color: #2C2D2E !important;
          color: #FFFFFF !important;
          padding: 10px 14px !important;
          border-top: 1px solid #3A3A3B !important;
          cursor: pointer !important;
          font-size: 14px !important;
        }
        .pac-item:first-child {
          border-top: none !important;
        }
        .pac-item:hover {
          background-color: #3D4435 !important;
        }
        .pac-item-selected {
          background-color: #3D4435 !important;
        }
        .pac-item-query {
          color: #FFFFFF !important;
          font-size: 14px !important;
        }
        .pac-matched {
          color: #C9A049 !important;
          font-weight: 600 !important;
        }
        .pac-icon {
          filter: invert(1) !important;
        }
        .pac-icon-marker {
          filter: invert(1) brightness(0.8) sepia(1) hue-rotate(10deg) saturate(5) !important;
        }
        .hdpi.pac-logo::after {
          background-image: none !important;
          display: none !important;
        }
        .pac-logo::after {
          display: none !important;
        }
      `}</style>
    <style>{`
      @media (max-width: 640px) {
        .br-nc-overlay { padding: 10px !important; align-items: flex-start !important; }
        .br-nc-modal { max-width: 100% !important; width: 100% !important; border-radius: 12px !important; max-height: 100vh !important; }
        .br-nc-modal input, .br-nc-modal select, .br-nc-modal textarea { font-size: 16px !important; }
      }
    `}</style>
    <datalist id="brCommonEmailDomains">
      <option value="@gmail.com" />
      <option value="@yahoo.com" />
      <option value="@outlook.com" />
      <option value="@hotmail.com" />
      <option value="@icloud.com" />
      <option value="@aol.com" />
      <option value="@protonmail.com" />
    </datalist>

    <div className="br-nc-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        animation: 'fadeIn 0.15s ease-in-out'
      }}
      onClick={onClose}
    >
      <div className="br-nc-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '900px',
          backgroundColor: '#1B1C1D',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          animation: 'slideUp 0.15s ease-in-out'
        }}
      >
        {/* HEADER */}
        <div style={{
          padding: '32px',
          borderBottom: '1px solid #2C2D2E',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ 
              color: '#FFFFFF', 
              fontSize: '28px', 
              fontWeight: '700', 
              margin: '0 0 8px 0',
              letterSpacing: '-0.5px'
            }}>
              New Client
            </h2>
            <p style={{ 
              color: '#A5A5A5', 
              fontSize: '14px', 
              margin: 0,
              lineHeight: '1.5'
            }}>
              Create a new client account with contacts and a primary property.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              color: '#A5A5A5',
              transition: 'all 0.15s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2C2D2E';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#A5A5A5';
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div 
          ref={scrollContainerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '32px',
            gap: '32px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* SECTION 1: Client Type & Account Info */}
          <div ref={section1Ref} style={{
            backgroundColor: '#232425',
            borderRadius: '14px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{
              color: '#FFFFFF',
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 16px 0'
            }}>
              Client Type & Account Info
            </h3>

            {/* Client Type Pills */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#A5A5A5',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '10px'
              }}>
                Client Type <span style={{ color: '#C9A049' }}>*</span>
              </label>
              <div style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap'
              }}>
                {[
                  { value: 'Homeowner', icon: Home },
                  { value: 'Contractor', icon: Briefcase },
                  { value: 'Realtor', icon: Home },
                  { value: 'Designer', icon: Palette },
                  { value: 'Property Manager', label: 'Property Mgr', icon: Building2 },
                  { value: 'Other', icon: User }
                ].map((option) => {
                  const Icon = option.icon;
                  const isActive = clientType === option.value;
                  const label = 'label' in option ? option.label : option.value;
                  
                  return (
                    option.value === 'Other' ? (
                      <div
                        key={option.value}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                      >
                        <button
                          onClick={() => handleClientTypeChange(option.value as any)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 20px',
                            backgroundColor: isActive ? '#5EB77D' : 'transparent',
                            color: isActive ? '#FFFFFF' : '#A5A5A5',
                            border: `2px solid ${isActive ? '#5EB77D' : '#3A3A3B'}`,
                            borderRadius: '999px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease-in-out'
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.borderColor = '#5EB77D';
                              e.currentTarget.style.color = '#FFFFFF';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.borderColor = '#3A3A3B';
                              e.currentTarget.style.color = '#A5A5A5';
                            }
                          }}
                        >
                          <Icon size={16} />
                          {label}
                        </button>

                        {isActive && (
                          <input
                            type="text"
                            placeholder="Specify other…"
                            value={otherClientTypeLabel}
                            onChange={(e) => setOtherClientTypeLabel(e.target.value)}
                            style={{
                              width: '260px',
                              padding: '10px 12px',
                              backgroundColor: '#1B1C1D',
                              border: '1px solid #3A3A3B',
                              borderRadius: '10px',
                              color: '#FFFFFF',
                              fontSize: '14px',
                              outline: 'none'
                            }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = '#5EB77D'; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = '#3A3A3B'; }}
                          />
                        )}
                      </div>
                    ) : (
                      <button
                        key={option.value}
                        onClick={() => handleClientTypeChange(option.value as any)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 20px',
                          backgroundColor: isActive ? '#5EB77D' : 'transparent',
                          color: isActive ? '#FFFFFF' : '#A5A5A5',
                          border: `2px solid ${isActive ? '#5EB77D' : '#3A3A3B'}`,
                          borderRadius: '999px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease-in-out'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.borderColor = '#5EB77D';
                            e.currentTarget.style.color = '#FFFFFF';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.borderColor = '#3A3A3B';
                            e.currentTarget.style.color = '#A5A5A5';
                          }
                        }}
                      >
                        <Icon size={16} />
                        {label}
                      </button>
                    )
                  );
                })}
              </div>
            </div>

            
            {/* Company Name (for business-type clients) */}
            {(['Contractor', 'Realtor', 'Designer', 'Property Manager', 'Other'] as ClientType[]).includes(clientType) && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  color: '#A5A5A5',
                  fontSize: '13px',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>
                  Company Name <span style={{ color: '#C9A049' }}>*</span>
                  {!displayNameManuallyEdited && (
                    <span style={{ color: '#666', fontSize: '11px', marginLeft: '8px' }}>(auto-generated)</span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Company Name"
                  value={displayName}
                  onChange={(e) => handleDisplayNameChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    backgroundColor: '#2C2D2E',
                    border: '1px solid #3A3A3B',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.15s ease-in-out'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#5EB77D';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#3A3A3B';
                  }}
                />

                              </div>
            )}


            {/* Company Name (Business Types) */}
            {['Contractor', 'Realtor', 'Designer', 'Property Manager', 'Other'].includes(clientType) && (
              <div style={{ marginTop: '14px', marginBottom: '18px' }}>
                <label style={{
                  display: 'block',
                  color: '#A5A5A5',
                  fontSize: '13px',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>
                  Company Name <span style={{ color: '#C9A049' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: '#1B1C1D',
                    border: '1px solid #3A3A3B',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#5EB77D'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#3A3A3B'; }}
                />
              </div>
            )}

{/* Name Fields - 2 Column */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  color: '#A5A5A5',
                  fontSize: '13px',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>
                  First Name <span style={{ color: '#C9A049' }}>*</span>
                </label>
                <input
                  ref={firstNameRef}
                  type="text"
                  placeholder="Lisa"
                  value={firstName}
                  onChange={(e) => handleFirstNameChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    backgroundColor: '#2C2D2E',
                    border: '1px solid #3A3A3B',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.15s ease-in-out'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#5EB77D';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#3A3A3B';
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  color: '#A5A5A5',
                  fontSize: '13px',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>
                  Last Name <span style={{ color: '#C9A049' }}>*</span>
                </label>
                <input
                  ref={lastNameRef}
                  type="text"
                  placeholder="Anderson"
                  value={lastName}
                  onChange={(e) => handleLastNameChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    backgroundColor: '#2C2D2E',
                    border: '1px solid #3A3A3B',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.15s ease-in-out'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#5EB77D';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#3A3A3B';
                  }}
                />
              </div>
            </div>

            {/* Second Homeowner */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#A5A5A5',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                Second Homeowner <span style={{ color: '#7A7A7A', fontSize: '12px' }}>(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g., John"
                value={secondHomeowner}
                onChange={(e) => handleSecondHomeownerChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  backgroundColor: '#2C2D2E',
                  border: '1px solid #3A3A3B',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.15s ease-in-out'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#5EB77D';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3A3A3B';
                }}
              />
            </div>

            {/* Display Name */}
            {(!(['Contractor', 'Realtor', 'Designer', 'Property Manager', 'Other'] as ClientType[]).includes(clientType)) && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#A5A5A5',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                {clientType === 'Homeowner' ? 'Display Name' : 'Company Name'} <span style={{ color: '#C9A049' }}>*</span>
                {!displayNameManuallyEdited && (
                  <span style={{ color: '#666', fontSize: '11px', marginLeft: '8px' }}>(auto-generated)</span>
                )}
              </label>
              <input
                type="text"
                placeholder={clientType === 'Homeowner' ? 'Last, First' : 'Company Name'}
                value={displayName}
                onChange={(e) => handleDisplayNameChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  backgroundColor: '#2C2D2E',
                  border: '1px solid #3A3A3B',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.15s ease-in-out'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#5EB77D';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3A3A3B';
                }}
              />
            </div>
            )}

            {/* Lead Source (optional) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  color: '#A5A5A5',
                  fontSize: '13px',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>
                  Lead Source <span style={{ color: '#A5A5A5' }}>(optional)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={leadSource}
                    onChange={(e) => setLeadSource(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 36px 11px 14px',
                      backgroundColor: '#2C2D2E',
                      border: '1px solid #3A3A3B',
                      borderRadius: '10px',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease-in-out',
                      appearance: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#5EB77D';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#3A3A3B';
                    }}
                  >
                    <option value="">(optional)</option>
                    <option value="Google">Google</option>
                    <option value="Referral">Referral</option>
                    <option value="LSA">LSA</option>
                    <option value="Repeat">Repeat</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown 
                    size={16} 
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: '#7A7A7A'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label style={{
                display: 'block',
                color: '#A5A5A5',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '10px'
              }}>
                Tags <span style={{ color: '#7A7A7A', fontSize: '12px' }}>(optional)</span>
              </label>
              
              {/* Tag Chips */}
              <div style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                marginBottom: '12px'
              }}>
                {availableTags.map((tag) => {
                  const isSelected = tags.includes(tag);
                  
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: isSelected ? '#C9A049' : 'transparent',
                        color: isSelected ? '#1B1C1D' : '#A5A5A5',
                        border: `2px solid ${isSelected ? '#C9A049' : '#3A3A3B'}`,
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease-in-out'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#C9A049';
                          e.currentTarget.style.color = '#FFFFFF';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#3A3A3B';
                          e.currentTarget.style.color = '#A5A5A5';
                        }
                      }}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Tag Input */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Add custom tag..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  style={{
                    flex: 1,
                    padding: '11px 14px',
                    backgroundColor: '#2C2D2E',
                    border: '1px solid #3A3A3B',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.15s ease-in-out'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#5EB77D';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#3A3A3B';
                  }}
                />
                <button
                  onClick={addCustomTag}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '11px 20px',
                    backgroundColor: 'transparent',
                    border: '2px solid #5EB77D',
                    borderRadius: '10px',
                    color: '#5EB77D',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease-in-out',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#5EB77D15';
                    e.currentTarget.style.borderColor = '#6FB880';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#5EB77D';
                  }}
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
            </div>
          </div>


{/* SECTION 2: Primary Contact */}
          <div ref={section2Ref} style={{
            backgroundColor: '#232425',
            borderRadius: '14px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{
              color: '#FFFFFF',
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 16px 0'
            }}>
              Primary Contact
            </h3>

            {/* Name Fields - 2 Column */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  color: '#A5A5A5',
                  fontSize: '13px',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>
                  First Name <span style={{ color: '#C9A049' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Lisa"
                  value={contactFirstName}
                  onChange={(e) => setContactFirstName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    backgroundColor: '#2C2D2E',
                    border: '1px solid #3A3A3B',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.15s ease-in-out'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#5EB77D';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#3A3A3B';
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  color: '#A5A5A5',
                  fontSize: '13px',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>
                  Last Name <span style={{ color: '#C9A049' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Anderson"
                  value={contactLastName}
                  onChange={(e) => setContactLastName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    backgroundColor: '#2C2D2E',
                    border: '1px solid #3A3A3B',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.15s ease-in-out'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#5EB77D';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#3A3A3B';
                  }}
                />
              </div>
            </div>

            {/* Phone Numbers */}
            <div style={{ marginBottom: '16px' }}>
              {/* Show column headers only if multiple phone numbers */}
              {phoneNumbers.length > 1 ? (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <label style={{
                    width: '150px',
                    color: '#A5A5A5',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    Contact
                  </label>
                  <label style={{
                    flex: 1,
                    color: '#A5A5A5',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    Phone Numbers <span style={{ color: '#7A7A7A', fontSize: '12px' }}>(optional)</span>
                  </label>
                  <div style={{ width: '120px' }} /> {/* Spacer for type dropdown */}
                </div>
              ) : (
                <label style={{
                  display: 'block',
                  color: '#A5A5A5',
                  fontSize: '13px',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>
                  Phone Numbers <span style={{ color: '#7A7A7A', fontSize: '12px' }}>(optional)</span>
                </label>
              )}
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
                {phoneNumbers.map((phone, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {/* Contact name field - auto-filled from firstName for first entry */}
                    <input
                      type="text"
                      placeholder="Contact"
                      value={phone.name || (index === 0 ? firstName : '')}
                      onChange={(e) => {
                        const newPhoneNumbers = [...phoneNumbers];
                        newPhoneNumbers[index].name = e.target.value;
                        setPhoneNumbers(newPhoneNumbers);
                      }}
                      style={{
                        width: '150px',
                        padding: '11px 14px',
                        backgroundColor: phone.name || (index === 0 && firstName) ? '#3D4435' : '#2C2D2E',
                        border: phone.name || (index === 0 && firstName) ? '1px solid #5EB77D' : '1px solid #3A3A3B',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.15s ease-in-out'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#5EB77D';
                      }}
                      onBlur={(e) => {
                        const hasValue = phone.name || (index === 0 && firstName);
                        e.target.style.borderColor = hasValue ? '#5EB77D' : '#3A3A3B';
                      }}
                    />
                    <input
                      ref={index === 0 ? phoneRef : undefined}
                      type="text"
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="e.g., 123-456-7890"
                      value={formatPhone(phone.number)}
                      onChange={(e) => {
                        const newPhoneNumbers = [...phoneNumbers];
                        newPhoneNumbers[index].number = formatPhone(e.target.value);
                        setPhoneNumbers(newPhoneNumbers);
                      }}
                      onBlur={(e) => {
                        const newPhoneNumbers = [...phoneNumbers];
                        newPhoneNumbers[index].number = formatPhone(e.target.value);
                        setPhoneNumbers(newPhoneNumbers);
                      }}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        backgroundColor: '#2C2D2E',
                        border: '1px solid #3A3A3B',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.15s ease-in-out'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#5EB77D';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#3A3A3B';
                      }}
                    />
                    <div style={{ position: 'relative' }}>
                      <select
                        value={phone.type}
                        onChange={(e) => {
                          const newPhoneNumbers = [...phoneNumbers];
                          newPhoneNumbers[index].type = e.target.value;
                          setPhoneNumbers(newPhoneNumbers);
                        }}
                        style={{
                          width: '120px',
                          padding: '11px 36px 11px 14px',
                          backgroundColor: '#2C2D2E',
                          border: '1px solid #3A3A3B',
                          borderRadius: '10px',
                          color: '#FFFFFF',
                          fontSize: '14px',
                          outline: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease-in-out',
                          appearance: 'none'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#5EB77D';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#3A3A3B';
                        }}
                      >
                        <option value="Mobile">Mobile</option>
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                      </select>
                      <ChevronDown 
                        size={14} 
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                          color: '#7A7A7A'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setPhoneNumbers([...phoneNumbers, { number: '', type: 'Mobile', name: '' }])}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  border: '2px solid #5EB77D',
                  borderRadius: '12px',
                  color: '#5EB77D',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#5EB77D15';
                  e.currentTarget.style.borderColor = '#6FB880';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#5EB77D';
                }}
              >
                <Plus size={16} />
                Add Phone Number
              </button>
            </div>

            {/* Email Addresses */}
            <div style={{ marginBottom: '16px' }}>
              {/* Show column headers only if multiple emails */}
              {emailAddresses.length > 1 ? (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <label style={{
                    width: '150px',
                    color: '#A5A5A5',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    Contact
                  </label>
                  <label style={{
                    flex: 1,
                    color: '#A5A5A5',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    Email Addresses <span style={{ color: '#7A7A7A', fontSize: '12px' }}>(optional)</span>
                  </label>
                </div>
              ) : (
                <label style={{
                  display: 'block',
                  color: '#A5A5A5',
                  fontSize: '13px',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>
                  Email Addresses <span style={{ color: '#7A7A7A', fontSize: '12px' }}>(optional)</span>
                </label>
              )}
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
                {emailAddresses.map((email, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {/* Contact name field - auto-filled from firstName for first entry */}
                    <input
                      type="text"
                      placeholder="Contact"
                      value={email.name || (index === 0 ? firstName : '')}
                      onChange={(e) => {
                        const newEmailAddresses = [...emailAddresses];
                        newEmailAddresses[index].name = e.target.value;
                        setEmailAddresses(newEmailAddresses);
                      }}
                      style={{
                        width: '150px',
                        padding: '11px 14px',
                        backgroundColor: email.name || (index === 0 && firstName) ? '#3D4435' : '#2C2D2E',
                        border: email.name || (index === 0 && firstName) ? '1px solid #5EB77D' : '1px solid #3A3A3B',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.15s ease-in-out'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#5EB77D';
                      }}
                      onBlur={(e) => {
                        const hasValue = email.name || (index === 0 && firstName);
                        e.target.style.borderColor = hasValue ? '#5EB77D' : '#3A3A3B';
                      }}
                    />
                    <input
                      ref={index === 0 ? emailRef : undefined}
                      type="email"
                      autoComplete="email"
                      list="brCommonEmailDomains"
                      placeholder="e.g., example@example.com"
                      value={email.email}
                      onChange={(e) => {
                        const newEmailAddresses = [...emailAddresses];
                        newEmailAddresses[index].email = e.target.value;
                        setEmailAddresses(newEmailAddresses);
                      }}
                      onBlur={(e) => {
                        const newEmailAddresses = [...emailAddresses];
                        newEmailAddresses[index].email = normalizeEmailDomain(e.target.value);
                        setEmailAddresses(newEmailAddresses);
                      }}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        backgroundColor: '#2C2D2E',
                        border: '1px solid #3A3A3B',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.15s ease-in-out'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#5EB77D';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#3A3A3B';
                      }}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => setEmailAddresses([...emailAddresses, { email: '', name: '' }])}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  border: '2px solid #5EB77D',
                  borderRadius: '12px',
                  color: '#5EB77D',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#5EB77D15';
                  e.currentTarget.style.borderColor = '#6FB880';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#5EB77D';
                }}
              >
                <Plus size={16} />
                Add Email Address
              </button>
            </div>

            {/* Role */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#A5A5A5',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                Role <span style={{ color: '#C9A049' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 36px 11px 14px',
                    backgroundColor: '#2C2D2E',
                    border: '1px solid #3A3A3B',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease-in-out',
                    appearance: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#5EB77D';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#3A3A3B';
                  }}
                >
                  <option value="Owner">Owner</option>
                  <option value="Tenant">Tenant</option>
                  <option value="Manager">Manager</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown 
                  size={16} 
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: '#7A7A7A'
                  }}
                />
              </div>
            </div>

            {/* Preferred Contact Method */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#A5A5A5',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '12px'
              }}>
                Preferred Contact Method <span style={{ color: '#C9A049' }}>*</span>
                <span style={{ color: '#7A7A7A', fontWeight: '400', marginLeft: '8px', fontSize: '12px' }}>(select all that apply)</span>
              </label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[
                  { value: 'Phone', icon: Phone, label: 'Phone Call' },
                  { value: 'SMS', icon: Phone, label: 'Text / SMS' },
                  { value: 'Email', icon: Mail, label: 'Email' }
                ].map((option) => {
                  const isSelected = preferredContactMethods.includes(option.value);
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setPreferredContactMethods(prev => {
                          if (prev.includes(option.value)) {
                            // Remove if already selected (but keep at least one)
                            const newMethods = prev.filter(m => m !== option.value);
                            return newMethods.length > 0 ? newMethods : prev;
                          } else {
                            // Add if not selected
                            return [...prev, option.value];
                          }
                        });
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 20px',
                        backgroundColor: isSelected ? '#5EB77D' : 'transparent',
                        border: `2px solid ${isSelected ? '#5EB77D' : '#3A3A3B'}`,
                        borderRadius: '10px',
                        color: isSelected ? '#FFFFFF' : '#A5A5A5',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease-in-out'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#5EB77D';
                          e.currentTarget.style.color = '#FFFFFF';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#3A3A3B';
                          e.currentTarget.style.color = '#A5A5A5';
                        }
                      }}
                    >
                      <IconComponent size={18} />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Is Primary Contact */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#A5A5A5',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                Is Primary Contact <span style={{ color: '#C9A049' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={isPrimaryContact ? 'Yes' : 'No'}
                  onChange={(e) => setIsPrimaryContact(e.target.value === 'Yes')}
                  style={{
                    width: '100%',
                    padding: '11px 36px 11px 14px',
                    backgroundColor: '#2C2D2E',
                    border: '1px solid #3A3A3B',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease-in-out',
                    appearance: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#5EB77D';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#3A3A3B';
                  }}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <ChevronDown 
                  size={16} 
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: '#7A7A7A'
                  }}
                />
              </div>
            </div>

            {/* Grant Portal Access */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#A5A5A5',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                Grant Portal Access <span style={{ color: '#C9A049' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={grantPortalAccess ? 'Yes' : 'No'}
                  onChange={(e) => setGrantPortalAccess(e.target.value === 'Yes')}
                  style={{
                    width: '100%',
                    padding: '11px 36px 11px 14px',
                    backgroundColor: '#2C2D2E',
                    border: '1px solid #3A3A3B',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease-in-out',
                    appearance: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#5EB77D';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#3A3A3B';
                  }}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <ChevronDown 
                  size={16} 
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: '#7A7A7A'
                  }}
                />
              </div>
            </div>

            {/* Receive SMS */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#A5A5A5',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                Receive SMS <span style={{ color: '#C9A049' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={receiveSMS ? 'Yes' : 'No'}
                  onChange={(e) => setReceiveSMS(e.target.value === 'Yes')}
                  style={{
                    width: '100%',
                    padding: '11px 36px 11px 14px',
                    backgroundColor: '#2C2D2E',
                    border: '1px solid #3A3A3B',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease-in-out',
                    appearance: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#5EB77D';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#3A3A3B';
                  }}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <ChevronDown 
                  size={16} 
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: '#7A7A7A'
                  }}
                />
              </div>
            </div>

            {/* Receive Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#A5A5A5',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                Receive Email <span style={{ color: '#C9A049' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={receiveEmail ? 'Yes' : 'No'}
                  onChange={(e) => setReceiveEmail(e.target.value === 'Yes')}
                  style={{
                    width: '100%',
                    padding: '11px 36px 11px 14px',
                    backgroundColor: '#2C2D2E',
                    border: '1px solid #3A3A3B',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease-in-out',
                    appearance: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#5EB77D';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#3A3A3B';
                  }}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <ChevronDown 
                  size={16} 
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: '#7A7A7A'
                  }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Project / Work Information */}
          <div ref={section3Ref} style={{
            backgroundColor: '#232425',
            borderRadius: '14px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{
              color: '#FFFFFF',
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 16px 0'
            }}>
              Project / Work Information
            </h3>

            {/* Type of Work */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#A5A5A5',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '10px'
              }}>
                Type of Work <span style={{ color: '#C9A049' }}>*</span>
              </label>
              <div style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap'
              }}>
                {[
                  'Repairs',
                  'Touchup',
                  'Install',
                  'Sand and Finish',
                  'Buff and Recoat'
                ].map((workType) => {
                  const isSelected = typeOfWork.includes(workType);
                  
                  return (
                    <button
                      key={workType}
                      type="button"
                      onClick={() => {
                        setTypeOfWork((prev) =>
                          prev.includes(workType)
                            ? prev.filter((t) => t !== workType)
                            : [...prev, workType]
                        );
                      }}
                      style={{
                        padding: '10px 18px',
                        backgroundColor: isSelected ? '#5EB77D' : 'transparent',
                        border: `2px solid ${isSelected ? '#5EB77D' : '#3A3A3B'}`,
                        borderRadius: '10px',
                        color: isSelected ? '#FFFFFF' : '#A5A5A5',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease-in-out'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#5EB77D';
                          e.currentTarget.style.color = '#FFFFFF';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#3A3A3B';
                          e.currentTarget.style.color = '#A5A5A5';
                        }
                      }}
                    >
                      {workType}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rooms / Areas Chips */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#A5A5A5',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '10px'
              }}>
                Rooms / Areas <span style={{ color: '#7A7A7A', fontSize: '12px' }}>(optional)</span>
              </label>
              <div style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap'
              }}>
                {roomOptions.map((room) => {
                  const isSelected = selectedRooms.includes(room);
                  
                  return (
                    <button
                      key={room}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedRooms(selectedRooms.filter(r => r !== room));
                        } else {
                          setSelectedRooms([...selectedRooms, room]);
                        }
                      }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: isSelected ? '#C9A049' : 'transparent',
                        color: isSelected ? '#1B1C1D' : '#A5A5A5',
                        border: `2px solid ${isSelected ? '#C9A049' : '#3A3A3B'}`,
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease-in-out'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#C9A049';
                          e.currentTarget.style.color = '#FFFFFF';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#3A3A3B';
                          e.currentTarget.style.color = '#A5A5A5';
                        }
                      }}
                    >
                      {room}
                    </button>
                  );
                })}
                
                {/* Render custom rooms */}
                {customRooms.map((room) => {
                  const isSelected = selectedRooms.includes(room);
                  
                  return (
                    <button
                      key={room}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedRooms(selectedRooms.filter(r => r !== room));
                        } else {
                          setSelectedRooms([...selectedRooms, room]);
                        }
                      }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: isSelected ? '#C9A049' : 'transparent',
                        color: isSelected ? '#1B1C1D' : '#A5A5A5',
                        border: `2px solid ${isSelected ? '#C9A049' : '#3A3A3B'}`,
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease-in-out'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#C9A049';
                          e.currentTarget.style.color = '#FFFFFF';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#3A3A3B';
                          e.currentTarget.style.color = '#A5A5A5';
                        }
                      }}
                    >
                      {room}
                    </button>
                  );
                })}
              </div>
              
              {/* Add Custom Room Input */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '12px' }}>
                <input
                  type="text"
                  placeholder="Add custom area..."
                  value={customRoomInput}
                  onChange={(e) => setCustomRoomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const trimmedRoom = customRoomInput.trim();
                      if (trimmedRoom && !roomOptions.includes(trimmedRoom) && !customRooms.includes(trimmedRoom)) {
                        setCustomRooms([...customRooms, trimmedRoom]);
                        setSelectedRooms([...selectedRooms, trimmedRoom]);
                        setCustomRoomInput('');
                      } else if (trimmedRoom) {
                        setCustomRoomInput('');
                      }
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '11px 14px',
                    backgroundColor: '#2C2D2E',
                    border: '1px solid #3A3A3B',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.15s ease-in-out'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#5EB77D';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#3A3A3B';
                  }}
                />
                <button
                  onClick={() => {
                    const trimmedRoom = customRoomInput.trim();
                    if (trimmedRoom && !roomOptions.includes(trimmedRoom) && !customRooms.includes(trimmedRoom)) {
                      setCustomRooms([...customRooms, trimmedRoom]);
                      setSelectedRooms([...selectedRooms, trimmedRoom]);
                      setCustomRoomInput('');
                    } else if (trimmedRoom) {
                      setCustomRoomInput('');
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '11px 20px',
                    backgroundColor: 'transparent',
                    border: '2px solid #5EB77D',
                    borderRadius: '10px',
                    color: '#5EB77D',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease-in-out',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#5EB77D15';
                    e.currentTarget.style.borderColor = '#6FB880';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#5EB77D';
                  }}
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
            </div>

            {/* Project Notes */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#A5A5A5',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                Project Notes <span style={{ color: '#7A7A7A', fontSize: '12px' }}>(optional)</span>
              </label>
              <textarea
                placeholder="Add any additional notes about the project..."
                value={projectNotes}
                onChange={(e) => setProjectNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  backgroundColor: '#2C2D2E',
                  border: '1px solid #3A3A3B',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.15s ease-in-out',
                  resize: 'vertical'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#5EB77D';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3A3A3B';
                }}
              />
            </div>
          </div>

          {/* SECTION 4: Primary Property / Jobsite */}
          <div ref={section4Ref} style={{
            backgroundColor: '#232425',
            borderRadius: '14px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{
              color: '#FFFFFF',
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 16px 0'
            }}>
              Primary Property / Jobsite
            </h3>

            {/* Property Nickname */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#A5A5A5',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                Property Nickname <span style={{ color: '#7A7A7A', fontSize: '12px' }}>(auto-filled from last name)</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Main Home"
                value={propertyNickname || lastName}
                onChange={(e) => setPropertyNickname(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  backgroundColor: (propertyNickname || lastName) ? '#3D4435' : '#2C2D2E',
                  border: (propertyNickname || lastName) ? '1px solid #5EB77D' : '1px solid #3A3A3B',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.15s ease-in-out'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#5EB77D';
                }}
                onBlur={(e) => {
                  const hasValue = propertyNickname || lastName;
                  e.target.style.borderColor = hasValue ? '#5EB77D' : '#3A3A3B';
                }}
              />
            </div>

            {/* Street Address with Google Maps Autocomplete */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#A5A5A5',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                Street Address <span style={{ color: '#C9A049' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin 
                  size={18} 
                  color="#C9A049" 
                  style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }} 
                />
                <input
                  ref={addressInputRef}
                  type="text"
                  placeholder="Start typing address..."
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  autoComplete="off"
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 40px',
                    backgroundColor: '#2C2D2E',
                    border: '1px solid #3A3A3B',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.15s ease-in-out'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#5EB77D';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#3A3A3B';
                  }}
                />
              </div>
              {GOOGLE_MAPS_API_KEY && (
                <p style={{ fontSize: '11px', color: '#666', marginTop: '4px', marginBottom: 0 }}>
                  Powered by Google Maps - start typing for suggestions
                </p>
              )}
            </div>

                        {/* City / State / ZIP - Region below City */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.35fr 0.8fr 0.85fr',
              gap: '16px',
              marginBottom: '16px'
            }}>
              {/* City */}
                            <div>
                              <label style={{
                                display: 'block',
                                color: '#A5A5A5',
                                fontSize: '13px',
                                fontWeight: '500',
                                marginBottom: '8px'
                              }}>
                                City <span style={{ color: '#C9A049' }}>*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="Springfield"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '11px 14px',
                                  backgroundColor: '#2C2D2E',
                                  border: '1px solid #3A3A3B',
                                  borderRadius: '10px',
                                  color: '#FFFFFF',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.15s ease-in-out'
                                }}
                                onFocus={(e) => {
                                  e.target.style.borderColor = '#5EB77D';
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderColor = '#3A3A3B';
                                }}
                              />

                {/* Region */}
                              <div>
                                <label style={{
                                  display: 'block',
                                  color: '#A5A5A5',
                                  fontSize: '13px',
                                  fontWeight: '500',
                                  marginBottom: '8px'
                                }}>
                                  Region <span style={{ fontSize: '10px', color: '#666' }}>(auto-filled by ZIP)</span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                  <select
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                    style={{
                                      width: '100%',
                                      padding: '11px 36px 11px 14px',
                                      backgroundColor: region ? '#3D4435' : '#2C2D2E',
                                      border: region ? '1px solid #5EB77D' : '1px solid #3A3A3B',
                                      borderRadius: '10px',
                                      color: region ? '#FFFFFF' : '#7A7A7A',
                                      fontSize: '14px',
                                      outline: 'none',
                                      cursor: 'pointer',
                                      transition: 'all 0.15s ease-in-out',
                                      appearance: 'none'
                                    }}
                                    onFocus={(e) => {
                                      e.target.style.borderColor = '#5EB77D';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.borderColor = region ? '#5EB77D' : '#3A3A3B';
                                    }}
                                  >
                                    <option value="">Select region</option>
                                    <option value="Spokane">Spokane</option>
                                    <option value="Valley">Valley</option>
                                    <option value="Liberty Lake">Liberty Lake</option>
                                    <option value="Cheney">Cheney</option>
                                    <option value="Airway Heights">Airway Heights</option>
                                    <option value="Medical Lake">Medical Lake</option>
                                    <option value="Deer Park">Deer Park</option>
                                    <option value="Mead">Mead</option>
                                    <option value="Nine Mile Falls">Nine Mile Falls</option>
                                    <option value="Post Falls">Post Falls</option>
                                    <option value="CDA">CDA</option>
                                    <option value="Hayden">Hayden</option>
                                    <option value="Rathdrum">Rathdrum</option>
                                  </select>
                                  <ChevronDown 
                                    size={16} 
                                    style={{
                                      position: 'absolute',
                                      right: '12px',
                                      top: '50%',
                                      transform: 'translateY(-50%)',
                                      pointerEvents: 'none',
                                      color: '#7A7A7A'
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
              {/* State */}
                            <div>
                              <label style={{
                                display: 'block',
                                color: '#A5A5A5',
                                fontSize: '13px',
                                fontWeight: '500',
                                marginBottom: '8px'
                              }}>
                                State <span style={{ color: '#C9A049' }}>*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="IL"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '11px 14px',
                                  backgroundColor: '#2C2D2E',
                                  border: '1px solid #3A3A3B',
                                  borderRadius: '10px',
                                  color: '#FFFFFF',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.15s ease-in-out'
                                }}
                                onFocus={(e) => {
                                  e.target.style.borderColor = '#5EB77D';
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderColor = '#3A3A3B';
                                }}
                              />
                            </div>
              {/* ZIP */}
                            <div>
                              <label style={{
                                display: 'block',
                                color: '#A5A5A5',
                                fontSize: '13px',
                                fontWeight: '500',
                                marginBottom: '8px'
                              }}>
                                ZIP <span style={{ color: '#C9A049' }}>*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="99201"
                                value={zip}
                                onChange={(e) => {
                                  const newZip = e.target.value;
                                  setZip(newZip);
                                  // Auto-fill region based on ZIP
                                  if (newZip.length === 5 && ZIP_TO_REGION[newZip]) {
                                    setRegion(ZIP_TO_REGION[newZip]);
                                  }
                                }}
                                style={{
                                  width: '100%',
                                  padding: '11px 14px',
                                  backgroundColor: '#2C2D2E',
                                  border: '1px solid #3A3A3B',
                                  borderRadius: '10px',
                                  color: '#FFFFFF',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.15s ease-in-out'
                                }}
                                onFocus={(e) => {
                                  e.target.style.borderColor = '#5EB77D';
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderColor = '#3A3A3B';
                                }}
                              />
                            </div>
            </div>
{/* Billing Address Same */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#A5A5A5',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                Billing Address Same <span style={{ color: '#C9A049' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={billingAddressSame ? 'Yes' : 'No'}
                  onChange={(e) => setBillingAddressSame(e.target.value === 'Yes')}
                  style={{
                    width: '100%',
                    padding: '11px 36px 11px 14px',
                    backgroundColor: '#2C2D2E',
                    border: '1px solid #3A3A3B',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease-in-out',
                    appearance: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#5EB77D';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#3A3A3B';
                  }}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <ChevronDown 
                  size={16} 
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: '#7A7A7A'
                  }}
                />
              </div>
            </div>


            {/* Billing Address Fields (shown when Billing Address Same = No) */}
            {!billingAddressSame && (
              <div style={{
                backgroundColor: '#232425',
                border: '1px solid #2F3031',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#E8E8E8',
                  marginBottom: '12px'
                }}>
                  Billing Address
                </div>

                {/* Billing Street Address */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    color: '#A5A5A5',
                    fontSize: '13px',
                    fontWeight: '500',
                    marginBottom: '8px'
                  }}>
                    Billing Street Address <span style={{ color: '#C9A049' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="123 Main St"
                    value={billingStreetAddress}
                    onChange={(e) => setBillingStreetAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      backgroundColor: '#2C2D2E',
                      border: '1px solid #3A3A3B',
                      borderRadius: '10px',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.15s ease-in-out'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#5EB77D';
                      e.target.style.boxShadow = '0 0 0 3px rgba(94, 183, 125, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#3A3A3B';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Billing City / State / ZIP - 3 Column */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 0.9fr 1fr',
                  gap: '16px'
                }}>
                  {/* Billing City */}
                  <div>
                    <label style={{
                      display: 'block',
                      color: '#A5A5A5',
                      fontSize: '13px',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>
                      Billing City <span style={{ color: '#C9A049' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Spokane"
                      value={billingCity}
                      onChange={(e) => setBillingCity(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        backgroundColor: '#2C2D2E',
                        border: '1px solid #3A3A3B',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.15s ease-in-out'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#5EB77D';
                        e.target.style.boxShadow = '0 0 0 3px rgba(94, 183, 125, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#3A3A3B';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Billing State */}
                  <div>
                    <label style={{
                      display: 'block',
                      color: '#A5A5A5',
                      fontSize: '13px',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>
                      Billing State <span style={{ color: '#C9A049' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="WA"
                      value={billingState}
                      onChange={(e) => setBillingState(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        backgroundColor: '#2C2D2E',
                        border: '1px solid #3A3A3B',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.15s ease-in-out'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#5EB77D';
                        e.target.style.boxShadow = '0 0 0 3px rgba(94, 183, 125, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#3A3A3B';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Billing ZIP */}
                  <div>
                    <label style={{
                      display: 'block',
                      color: '#A5A5A5',
                      fontSize: '13px',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>
                      Billing ZIP <span style={{ color: '#C9A049' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="99201"
                      value={billingZip}
                      onChange={(e) => setBillingZip(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        backgroundColor: '#2C2D2E',
                        border: '1px solid #3A3A3B',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.15s ease-in-out'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#5EB77D';
                        e.target.style.boxShadow = '0 0 0 3px rgba(94, 183, 125, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#3A3A3B';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Property Notes */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#A5A5A5',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                Property Notes <span style={{ color: '#7A7A7A', fontSize: '12px' }}>(optional)</span>
              </label>
              <textarea
                placeholder="Floor species, pets, parking, access instructions, etc."
                value={propertyNotes}
                onChange={(e) => setPropertyNotes(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  backgroundColor: '#2C2D2E',
                  border: '1px solid #3A3A3B',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.15s ease-in-out',
                  resize: 'vertical',
                  minHeight: '80px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#5EB77D';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3A3A3B';
                }}
              />
              <p style={{
                color: '#7A7A7A',
                fontSize: '12px',
                margin: '6px 0 0 0',
                lineHeight: '1.4'
              }}>
                Floor species, pets, parking, access instructions, etc.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{
          padding: '24px 32px',
          borderTop: '1px solid #2C2D2E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          {/* Success Message Box */}
          {saveSuccess && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '12px',
              backgroundColor: '#203D20',
              border: '1px solid #5EB77D',
              borderRadius: '12px',
              padding: '16px 24px',
              minWidth: '280px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              animation: 'slideUp 0.2s ease-out',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#5EB77D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#FFF'
              }}>✓</div>
              <span style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '15px' }}>
                {saveSuccess}
              </span>
            </div>
          )}

          {/* Validation Error Box */}
          {showValidationError && validationErrors.length > 0 && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '12px',
              backgroundColor: '#3D2020',
              border: '1px solid #E74C3C',
              borderRadius: '12px',
              padding: '16px 20px',
              minWidth: '320px',
              maxWidth: '500px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              animation: 'slideUp 0.2s ease-out',
              zIndex: 10
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                marginBottom: '12px',
                paddingBottom: '10px',
                borderBottom: '1px solid #5D3030'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#E74C3C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#FFF'
                }}>!</div>
                <span style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '15px' }}>
                  Please fix the following:
                </span>
                <button 
                  onClick={() => setShowValidationError(false)}
                  style={{
                    marginLeft: 'auto',
                    background: 'none',
                    border: 'none',
                    color: '#888',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <X size={16} />
                </button>
              </div>
              <ul style={{ 
                margin: 0, 
                paddingLeft: '0', 
                listStyle: 'none',
                color: '#F5A5A5',
                fontSize: '13px',
                lineHeight: '1.6'
              }}>
                {validationErrors.map((error, index) => (
                  <li 
                    key={index} 
                    onClick={() => scrollToError(error)}
                    style={{ 
                      marginBottom: '6px', 
                      padding: '6px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#4D2525';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span style={{ color: '#E74C3C' }}>→</span>
                    {error.message}
                  </li>
                ))}
              </ul>
              <p style={{ 
                margin: '12px 0 0 0', 
                fontSize: '11px', 
                color: '#888',
                textAlign: 'center'
              }}>
                Click an error to jump to that field
              </p>
            </div>
          )}

          <button
            onClick={() => handleSave('save')}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              border: '2px solid #C9A049',
              borderRadius: '12px',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#C9A04915';
              e.currentTarget.style.borderColor = '#D9B563';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#C9A049';
            }}
          >
            Save Client
          </button>
          
          
          <button
            onClick={() => handleSave('visit')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#C9A049',
              border: '2px solid #C9A049',
              borderRadius: '12px',
              color: '#1B1C1D',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#D9B563';
              e.currentTarget.style.borderColor = '#D9B563';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#C9A049';
              e.currentTarget.style.borderColor = '#C9A049';
            }}
          >
            <Calendar size={16} />
            Save & Schedule Visit
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
    </>
  );
}