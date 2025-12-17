import React, { useState } from 'react';
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
  FileText,
  ChevronDown
} from 'lucide-react';

interface BoardroomNewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string, clientData?: any) => void;
}

export default function BoardroomNewClientModal({ isOpen, onClose, onNavigate }: BoardroomNewClientModalProps) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  
  // Section 1: Client Type & Account Info
  const [clientType, setClientType] = useState<'Homeowner' | 'Contractor' | 'Designer' | 'Property Manager' | 'Other'>('Homeowner');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [secondHomeowner, setSecondHomeowner] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [status, setStatus] = useState('Lead');
  const [leadSource, setLeadSource] = useState('Referral');
  const [tags, setTags] = useState<string[]>([]);

  // Section 2: Primary Contact
  const [contactFirstName, setContactFirstName] = useState('');
  const [contactLastName, setContactLastName] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState<Array<{ number: string; type: string; name?: string }>>([{ number: '', type: 'Mobile', name: '' }]);
  const [emailAddresses, setEmailAddresses] = useState<Array<{ email: string; name?: string }>>([{ email: '', name: '' }]);
  const [role, setRole] = useState('Owner');
  
  // Preferred Contact Method - Toggle sliders
  const [preferPhone, setPreferPhone] = useState(true);
  const [preferEmail, setPreferEmail] = useState(false);
  const [preferText, setPreferText] = useState(false);
  
  const [isPrimaryContact, setIsPrimaryContact] = useState(true);
  const [grantPortalAccess, setGrantPortalAccess] = useState(false);
  const [receiveSMS, setReceiveSMS] = useState(false);
  const [receiveEmail, setReceiveEmail] = useState(true);

  // Section 3: Project / Work Information
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const [availableWorkTypes, setAvailableWorkTypes] = useState<string[]>([
    'Installation',
    'Repairs', 
    'Sand and Finish',
    'Buff and Recoat'
  ]);
  const [customWorkTypeInput, setCustomWorkTypeInput] = useState('');
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  
  // Notes - Internal and Client-shareable
  const [internalNotes, setInternalNotes] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [shareNotesWithClient, setShareNotesWithClient] = useState(false);

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
  
  // Zip code to region mapping
  const zipToRegion: Record<string, string> = {
    '99201': 'Central',
    '99202': 'Central',
    '99203': 'South',
    '99204': 'South West',
    '99205': 'North West',
    '99206': 'South East',
    '99207': 'North East',
    '99208': 'North',
    '99212': 'North East',
    '99216': 'South East',
    '99217': 'North East',
    '99218': 'North',
    '99223': 'South',
    '99224': 'South West',
    '99016': 'Spokane Valley',
    '99027': 'Spokane Valley',
    '99037': 'Spokane Valley',
    '99001': 'Airway Heights',
    '99003': 'Chattaroy',
    '99004': 'Cheney',
    '99005': 'Colbert',
    '99006': 'Deer Park',
    '99009': 'Elk',
    '99011': 'Fairchild AFB',
    '99012': 'Fairfield',
    '99014': 'Four Lakes',
    '99018': 'Latah',
    '99019': 'Liberty Lake',
    '99020': 'Marshall',
    '99021': 'Mead',
    '99022': 'Medical Lake',
    '99023': 'Mica',
    '99025': 'Newman Lake',
    '99026': 'Nine Mile Falls',
    '99030': 'Rockford',
    '99031': 'Spangle',
    '99036': 'Valleyford',
    '99039': 'Waverly',
    '83814': 'Coeur d\'Alene, ID',
    '83815': 'Coeur d\'Alene, ID',
    '83854': 'Post Falls, ID',
    '83858': 'Rathdrum, ID'
  };

  // Get unique regions for dropdown
  const availableRegions = [...new Set(Object.values(zipToRegion))].sort();

  // Auto-fill region when zip code changes
  const handleZipChange = (newZip: string) => {
    setZip(newZip);
    const cleanZip = newZip.trim();
    if (zipToRegion[cleanZip]) {
      setRegion(zipToRegion[cleanZip]);
    }
  };
  
  // Saving state
  const [saving, setSaving] = useState(false);

  // Auto-generate display name based on client type
  const generateDisplayName = () => {
    if (clientType === 'Contractor' || clientType === 'Designer' || clientType === 'Property Manager') {
      // For business types, could use company name if available, otherwise last name first
      return lastName ? `${lastName}${firstName ? ', ' + firstName : ''}` : firstName;
    } else {
      // For homeowners: "Last, First" or "Last, First & Second"
      if (lastName) {
        let name = lastName;
        if (firstName) {
          name += `, ${firstName}`;
          if (secondHomeowner) {
            name += ` & ${secondHomeowner}`;
          }
        }
        return name;
      }
      return firstName || '';
    }
  };

  // Auto-sync Primary Contact name with Client Account Info (always sync)
  React.useEffect(() => {
    setContactFirstName(firstName);
  }, [firstName]);

  React.useEffect(() => {
    setContactLastName(lastName);
  }, [lastName]);

  // Update display name when relevant fields change
  React.useEffect(() => {
    const autoName = generateDisplayName();
    if (autoName) {
      setDisplayName(autoName);
    }
  }, [firstName, lastName, secondHomeowner, clientType]);

  // Toggle work type selection
  const toggleWorkType = (workType: string) => {
    if (selectedWorkTypes.includes(workType)) {
      setSelectedWorkTypes(selectedWorkTypes.filter(t => t !== workType));
    } else {
      setSelectedWorkTypes([...selectedWorkTypes, workType]);
    }
  };

  // Add custom work type
  const addCustomWorkType = () => {
    const trimmed = customWorkTypeInput.trim();
    if (trimmed && !availableWorkTypes.includes(trimmed)) {
      setAvailableWorkTypes([...availableWorkTypes, trimmed]);
      setSelectedWorkTypes([...selectedWorkTypes, trimmed]);
      setCustomWorkTypeInput('');
    } else if (trimmed && !selectedWorkTypes.includes(trimmed)) {
      setSelectedWorkTypes([...selectedWorkTypes, trimmed]);
      setCustomWorkTypeInput('');
    }
  };

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
  const [availableTags, setAvailableTags] = useState<string[]>([
    'VIP',
    'High Priority',
    'Repeat Customer',
    'Large Project',
    'Quick Turnaround',
    'Needs Follow-up',
    'Commercial',
    'Residential',
    'Designer Client',
    'YELLOW CHECKLIST'
  ]);
  const [newTagInput, setNewTagInput] = useState('');

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

  // Build client data object matching Contact model
  const buildClientData = () => {
    return {
      // Required fields
      firstName: firstName || contactFirstName,
      phone: phoneNumbers[0]?.number || '',
      operationsManager: 2, // Default to Admin User
      createdBy: 'Admin',
      modifiedBy: 'Admin',
      
      // Optional fields
      lastName: lastName || contactLastName || '',
      email: emailAddresses[0]?.email || '',
      companyName: clientType === 'Contractor' ? displayName : '',
      additionalPhone: phoneNumbers[1]?.number || '',
      message: internalNotes || '',
      clientSource: clientType === 'Contractor' ? 'Contractor' : 'Direct',
      clientDetailsAvailability: 'Yes',
      doNotSendEmail: !receiveEmail,
      
      // Extra data for future use (stored in message or separate table)
      // These won't cause errors but may not be saved unless backend supports them
      displayName: displayName || generateDisplayName(),
      clientType,
      secondHomeowner,
      status,
      leadSource,
      tags,
      preferPhone,
      preferEmail,
      preferText,
      workTypes: selectedWorkTypes,
      rooms: selectedRooms,
      clientNotes: shareNotesWithClient ? clientNotes : '',
      propertyNickname,
      address: streetAddress,
      city,
      state,
      zipCode: zip,
      region,
      billingAddressSame,
      billingStreetAddress: billingAddressSame ? streetAddress : billingStreetAddress,
      billingCity: billingAddressSame ? city : billingCity,
      billingState: billingAddressSame ? state : billingState,
      billingZip: billingAddressSame ? zip : billingZip,
      propertyNotes
    };
  };

  // Save client to database
  const saveClient = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const clientData = buildClientData();
      
      console.log('Sending client data:', clientData);
      
      // Step 1: Create the contact
      const response = await fetch(`${API_URL}/contact/create-contact`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(clientData)
      });
      
      const data = await response.json();
      console.log('API Response:', response.status, data);
      
      if (response.ok) {
        const contactId = data.data?.id || data.id;
        
        // Step 2: Save additional phone numbers
        const validPhones = phoneNumbers.filter(p => p.number && p.number.trim());
        if (validPhones.length > 0 && contactId) {
          try {
            await fetch(`${API_URL}/contact-phone/create-bulk`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                contactId,
                phones: validPhones.map((p, index) => ({
                  name: p.name || null,
                  number: p.number,
                  type: p.type || 'Mobile',
                  isPrimary: index === 0,
                  receiveSMS: true
                }))
              })
            });
            console.log('Phone numbers saved');
          } catch (phoneError) {
            console.warn('Could not save additional phones:', phoneError);
          }
        }
        
        // Step 3: Save additional email addresses
        const validEmails = emailAddresses.filter(e => e.email && e.email.trim());
        if (validEmails.length > 0 && contactId) {
          try {
            await fetch(`${API_URL}/contact-email/create-bulk`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                contactId,
                emails: validEmails.map((e, index) => ({
                  name: e.name || null,
                  email: e.email,
                  isPrimary: index === 0,
                  receiveNotifications: true
                }))
              })
            });
            console.log('Email addresses saved');
          } catch (emailError) {
            console.warn('Could not save additional emails:', emailError);
          }
        }
        
        return { success: true, client: data, contactId };
      } else {
        console.error('Failed to save client:', data);
        alert(`Error: ${data.message || data.error || 'Failed to save client'}`);
        return { success: false };
      }
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Network error - please try again');
      return { success: false };
    } finally {
      setSaving(false);
    }
  };

  // Handle Save Client button
  const handleSaveClient = async () => {
    // Validation
    const clientFirstName = firstName || contactFirstName;
    const clientPhone = phoneNumbers[0]?.number || '';
    
    if (!clientFirstName.trim()) {
      alert('Please enter a First Name');
      return;
    }
    if (!clientPhone.trim()) {
      alert('Please enter a Phone Number');
      return;
    }
    
    const result = await saveClient();
    if (result.success) {
      onClose();
    }
  };

  // Handle Save & Create Quote button
  const handleSaveAndCreateQuote = async () => {
    // Validation
    const clientFirstName = firstName || contactFirstName;
    const clientPhone = phoneNumbers[0]?.number || '';
    
    if (!clientFirstName.trim()) {
      alert('Please enter a First Name');
      return;
    }
    if (!clientPhone.trim()) {
      alert('Please enter a Phone Number');
      return;
    }
    
    const result = await saveClient();
    if (result.success && onNavigate) {
      onClose();
      onNavigate('Quotes', buildClientData());
    }
  };

  // Handle Save & Schedule Visit button
  const handleSaveAndScheduleVisit = async () => {
    // Validation
    const clientFirstName = firstName || contactFirstName;
    const clientPhone = phoneNumbers[0]?.number || '';
    
    if (!clientFirstName.trim()) {
      alert('Please enter a First Name');
      return;
    }
    if (!clientPhone.trim()) {
      alert('Please enter a Phone Number');
      return;
    }
    
    const result = await saveClient();
    if (result.success && onNavigate) {
      onClose();
      onNavigate('Calendar', buildClientData());
    }
  };

  if (!isOpen) return null;

  return (
    <div 
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
      <div 
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
          <div style={{
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
                  { value: 'Designer', icon: Palette },
                  { value: 'Property Manager', label: 'Property Mgr', icon: Building2 },
                  { value: 'Other', icon: User }
                ].map((option) => {
                  const Icon = option.icon;
                  const isActive = clientType === option.value;
                  const label = 'label' in option ? option.label : option.value;
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => setClientType(option.value as any)}
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
                  );
                })}
              </div>
            </div>

            {/* Name Fields - 2 Column */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
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
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
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
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
                onChange={(e) => setSecondHomeowner(e.target.value)}
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
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#A5A5A5',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                Display Name <span style={{ color: '#C9A049' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Lisa & John Anderson"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
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

            {/* Status & Lead Source - 2 Column */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
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
                  Status <span style={{ color: '#C9A049' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
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
                    <option value="Lead">Lead</option>
                    <option value="Active">Active</option>
                    <option value="Past">Past</option>
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

              <div>
                <label style={{
                  display: 'block',
                  color: '#A5A5A5',
                  fontSize: '13px',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>
                  Lead Source <span style={{ color: '#C9A049' }}>*</span>
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
          <div style={{
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
              gridTemplateColumns: '1fr 1fr',
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
                    {/* Show name field only for 2nd+ phone numbers */}
                    {phoneNumbers.length > 1 && (
                      <input
                        type="text"
                        placeholder="Name"
                        value={phone.name || ''}
                        onChange={(e) => {
                          const newPhoneNumbers = [...phoneNumbers];
                          newPhoneNumbers[index].name = e.target.value;
                          setPhoneNumbers(newPhoneNumbers);
                        }}
                        style={{
                          width: '150px',
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
                    )}
                    <input
                      type="text"
                      placeholder="e.g., 123-456-7890"
                      value={phone.number}
                      onChange={(e) => {
                        const newPhoneNumbers = [...phoneNumbers];
                        newPhoneNumbers[index].number = e.target.value;
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
                    {/* Show name field only for 2nd+ emails */}
                    {emailAddresses.length > 1 && (
                      <input
                        type="text"
                        placeholder="Name"
                        value={email.name || ''}
                        onChange={(e) => {
                          const newEmailAddresses = [...emailAddresses];
                          newEmailAddresses[index].name = e.target.value;
                          setEmailAddresses(newEmailAddresses);
                        }}
                        style={{
                          width: '150px',
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
                    )}
                    <input
                      type="email"
                      placeholder="e.g., example@example.com"
                      value={email.email}
                      onChange={(e) => {
                        const newEmailAddresses = [...emailAddresses];
                        newEmailAddresses[index].email = e.target.value;
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

            {/* Preferred Contact Method - Toggle Sliders */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#A5A5A5',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '12px'
              }}>
                Preferred Contact Method <span style={{ color: '#C9A049' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {/* Phone Toggle */}
                <div 
                  onClick={() => setPreferPhone(!preferPhone)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    cursor: 'pointer',
                    padding: '10px 16px',
                    backgroundColor: preferPhone ? 'rgba(94, 183, 125, 0.15)' : '#2C2D2E',
                    border: `2px solid ${preferPhone ? '#5EB77D' : '#3A3A3B'}`,
                    borderRadius: '10px',
                    transition: 'all 0.15s ease-in-out'
                  }}
                >
                  <Phone size={18} color={preferPhone ? '#5EB77D' : '#7A7A7A'} />
                  <span style={{ color: preferPhone ? '#FFFFFF' : '#A5A5A5', fontSize: '14px', fontWeight: '500' }}>Phone</span>
                  <div style={{
                    width: '44px',
                    height: '24px',
                    backgroundColor: preferPhone ? '#5EB77D' : '#3A3A3B',
                    borderRadius: '12px',
                    position: 'relative',
                    transition: 'all 0.2s ease-in-out'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '2px',
                      left: preferPhone ? '22px' : '2px',
                      transition: 'all 0.2s ease-in-out',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }} />
                  </div>
                </div>

                {/* Email Toggle */}
                <div 
                  onClick={() => setPreferEmail(!preferEmail)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    cursor: 'pointer',
                    padding: '10px 16px',
                    backgroundColor: preferEmail ? 'rgba(94, 183, 125, 0.15)' : '#2C2D2E',
                    border: `2px solid ${preferEmail ? '#5EB77D' : '#3A3A3B'}`,
                    borderRadius: '10px',
                    transition: 'all 0.15s ease-in-out'
                  }}
                >
                  <Mail size={18} color={preferEmail ? '#5EB77D' : '#7A7A7A'} />
                  <span style={{ color: preferEmail ? '#FFFFFF' : '#A5A5A5', fontSize: '14px', fontWeight: '500' }}>Email</span>
                  <div style={{
                    width: '44px',
                    height: '24px',
                    backgroundColor: preferEmail ? '#5EB77D' : '#3A3A3B',
                    borderRadius: '12px',
                    position: 'relative',
                    transition: 'all 0.2s ease-in-out'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '2px',
                      left: preferEmail ? '22px' : '2px',
                      transition: 'all 0.2s ease-in-out',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }} />
                  </div>
                </div>

                {/* Text Toggle */}
                <div 
                  onClick={() => setPreferText(!preferText)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    cursor: 'pointer',
                    padding: '10px 16px',
                    backgroundColor: preferText ? 'rgba(94, 183, 125, 0.15)' : '#2C2D2E',
                    border: `2px solid ${preferText ? '#5EB77D' : '#3A3A3B'}`,
                    borderRadius: '10px',
                    transition: 'all 0.15s ease-in-out'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={preferText ? '#5EB77D' : '#7A7A7A'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span style={{ color: preferText ? '#FFFFFF' : '#A5A5A5', fontSize: '14px', fontWeight: '500' }}>Text</span>
                  <div style={{
                    width: '44px',
                    height: '24px',
                    backgroundColor: preferText ? '#5EB77D' : '#3A3A3B',
                    borderRadius: '12px',
                    position: 'relative',
                    transition: 'all 0.2s ease-in-out'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '2px',
                      left: preferText ? '22px' : '2px',
                      transition: 'all 0.2s ease-in-out',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }} />
                  </div>
                </div>
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
          <div style={{
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

            {/* Type of Work - Multi-select chips */}
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
                flexWrap: 'wrap',
                marginBottom: '12px'
              }}>
                {availableWorkTypes.map((workType) => {
                  const isSelected = selectedWorkTypes.includes(workType);
                  return (
                    <button
                      key={workType}
                      onClick={() => toggleWorkType(workType)}
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
                      {workType}
                    </button>
                  );
                })}
              </div>
              
              {/* Add Custom Work Type */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Add custom work type..."
                  value={customWorkTypeInput}
                  onChange={(e) => setCustomWorkTypeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomWorkType();
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
                  onClick={addCustomWorkType}
                  style={{
                    padding: '11px 16px',
                    backgroundColor: 'transparent',
                    border: '2px solid #5EB77D',
                    borderRadius: '10px',
                    color: '#5EB77D',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease-in-out',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#5EB77D';
                    e.currentTarget.style.color = '#1B1C1D';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#5EB77D';
                  }}
                >
                  <Plus size={16} />
                  Add
                </button>
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

            {/* Internal Notes */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#A5A5A5',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                Internal Notes <span style={{ color: '#7A7A7A', fontSize: '12px' }}>(staff only - visible sitewide)</span>
              </label>
              <textarea
                placeholder="Add internal notes about this client..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
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
                color: '#E67E22',
                fontSize: '12px',
                margin: '6px 0 0 0',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                These notes are for internal use only and will NOT be shared with the client.
              </p>
            </div>

            {/* Client-Shareable Notes */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{
                  color: '#A5A5A5',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>
                  Client Notes <span style={{ color: '#7A7A7A', fontSize: '12px' }}>(can be shared to portal)</span>
                </label>
                <div 
                  onClick={() => setShareNotesWithClient(!shareNotesWithClient)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ color: shareNotesWithClient ? '#5EB77D' : '#7A7A7A', fontSize: '12px' }}>
                    {shareNotesWithClient ? 'Sharing to portal' : 'Not shared'}
                  </span>
                  <div style={{
                    width: '36px',
                    height: '20px',
                    backgroundColor: shareNotesWithClient ? '#5EB77D' : '#3A3A3B',
                    borderRadius: '10px',
                    position: 'relative',
                    transition: 'all 0.2s ease-in-out'
                  }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '2px',
                      left: shareNotesWithClient ? '18px' : '2px',
                      transition: 'all 0.2s ease-in-out',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }} />
                  </div>
                </div>
              </div>
              <textarea
                placeholder="Add notes to share with the client through their portal..."
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  backgroundColor: '#2C2D2E',
                  border: `1px solid ${shareNotesWithClient ? '#5EB77D' : '#3A3A3B'}`,
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
                  e.target.style.borderColor = shareNotesWithClient ? '#5EB77D' : '#3A3A3B';
                }}
              />
              {shareNotesWithClient && (
                <p style={{
                  color: '#5EB77D',
                  fontSize: '12px',
                  margin: '6px 0 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  These notes will be visible to the client in their portal.
                </p>
              )}
            </div>
          </div>

          {/* SECTION 4: Primary Property / Jobsite */}
          <div style={{
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
                Property Nickname <span style={{ color: '#7A7A7A', fontSize: '12px' }}>(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Main Home"
                value={propertyNickname}
                onChange={(e) => setPropertyNickname(e.target.value)}
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

            {/* Street Address */}
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
              <input
                type="text"
                placeholder="e.g., 123 Main St"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
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

            {/* City / State / ZIP / Region - 4 Column Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
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
                  onChange={(e) => handleZipChange(e.target.value)}
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

              {/* Region */}
              <div>
                <label style={{
                  display: 'block',
                  color: '#A5A5A5',
                  fontSize: '13px',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>
                  Region <span style={{ color: '#7A7A7A', fontSize: '11px' }}>(auto-filled by ZIP)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 36px 11px 14px',
                      backgroundColor: region && zipToRegion[zip] === region ? 'rgba(94, 183, 125, 0.1)' : '#2C2D2E',
                      border: `1px solid ${region && zipToRegion[zip] === region ? '#5EB77D' : '#3A3A3B'}`,
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
                      e.target.style.borderColor = region && zipToRegion[zip] === region ? '#5EB77D' : '#3A3A3B';
                    }}
                  >
                    <option value="">Select region</option>
                    {availableRegions.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <ChevronDown 
                    size={16} 
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: region && zipToRegion[zip] === region ? '#5EB77D' : '#7A7A7A'
                    }}
                  />
                </div>
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

            {/* Billing Address Fields - Only show when billingAddressSame is false */}
            {!billingAddressSame && (
              <div style={{ 
                padding: '20px', 
                backgroundColor: '#1B1C1D', 
                borderRadius: '12px', 
                marginBottom: '16px',
                border: '1px solid #3A3A3B'
              }}>
                <h4 style={{ 
                  color: '#C9A049', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <MapPin size={16} />
                  Billing Address
                </h4>

                {/* Billing Street Address */}
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
                  <input
                    type="text"
                    placeholder="e.g., 456 Billing St"
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
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#3A3A3B';
                    }}
                  />
                </div>

                {/* Billing City / State / ZIP */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr',
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
                      City <span style={{ color: '#C9A049' }}>*</span>
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
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#3A3A3B';
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
                      State <span style={{ color: '#C9A049' }}>*</span>
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
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#3A3A3B';
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
                      ZIP <span style={{ color: '#C9A049' }}>*</span>
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
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#3A3A3B';
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
          <button
            onClick={handleSaveClient}
            disabled={saving}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3498DB',
              border: 'none',
              borderRadius: '12px',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease-in-out',
              opacity: saving ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!saving) e.currentTarget.style.backgroundColor = '#2980B9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3498DB';
            }}
          >
            {saving ? 'Saving...' : 'Save Client'}
          </button>
          
          <button
            onClick={handleSaveAndCreateQuote}
            disabled={saving}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              border: '2px solid #C9A049',
              borderRadius: '12px',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: saving ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!saving) {
                e.currentTarget.style.backgroundColor = '#C9A04915';
                e.currentTarget.style.borderColor = '#D9B563';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#C9A049';
            }}
          >
            <FileText size={16} />
            Save & Create Quote
          </button>
          
          <button
            onClick={handleSaveAndScheduleVisit}
            disabled={saving}
            style={{
              padding: '12px 24px',
              backgroundColor: '#C9A049',
              border: '2px solid #C9A049',
              borderRadius: '12px',
              color: '#1B1C1D',
              fontSize: '14px',
              fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: saving ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!saving) {
                e.currentTarget.style.backgroundColor = '#D9B563';
                e.currentTarget.style.borderColor = '#D9B563';
              }
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
  );
}