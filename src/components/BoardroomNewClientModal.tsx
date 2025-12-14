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
}

export default function BoardroomNewClientModal({ isOpen, onClose }: BoardroomNewClientModalProps) {
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
  const [preferredContactMethod, setPreferredContactMethod] = useState('Phone');
  const [isPrimaryContact, setIsPrimaryContact] = useState(true);
  const [grantPortalAccess, setGrantPortalAccess] = useState(false);
  const [receiveSMS, setReceiveSMS] = useState(false);
  const [receiveEmail, setReceiveEmail] = useState(true);

  // Section 3: Project / Work Information
  const [typeOfWork, setTypeOfWork] = useState('');
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
  const [propertyNotes, setPropertyNotes] = useState('');

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

            {/* Preferred Contact Method */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#A5A5A5',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                Preferred Contact Method <span style={{ color: '#C9A049' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={preferredContactMethod}
                  onChange={(e) => setPreferredContactMethod(e.target.value)}
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
                  <option value="Phone">Phone</option>
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
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

            {/* Type of Work */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#A5A5A5',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                Type of Work <span style={{ color: '#C9A049' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Home Renovation"
                value={typeOfWork}
                onChange={(e) => setTypeOfWork(e.target.value)}
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
                  placeholder="62701"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
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
                  Region
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 36px 11px 14px',
                      backgroundColor: '#2C2D2E',
                      border: '1px solid #3A3A3B',
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
                      e.target.style.borderColor = '#3A3A3B';
                    }}
                  >
                    <option value="">Select region</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="Central">Central</option>
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
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              border: '2px solid #C9A049',
              borderRadius: '12px',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
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
            <FileText size={16} />
            Save & Create Quote
          </button>
          
          <button
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
  );
}