import React, { useState, useEffect } from 'react';
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
  Tag as TagIcon,
  ChevronDown,
  Hammer,
  Square
} from 'lucide-react';

// ========================================
// TYPES
// ========================================

type ClientType = 'Homeowner' | 'Contractor' | 'Designer' | 'Property Manager' | 'Other';
type ClientStatus = 'Lead' | 'Active' | 'Past';
type LeadSource = 'Google' | 'Referral' | 'LSA' | 'Repeat' | 'Other';
type PricingTier = 'Standard' | 'Contractor' | 'VIP';
type ContactRole = 'Homeowner' | 'Spouse' | 'GC PM' | 'Office/AP' | 'Designer' | 'Tenant' | 'Other';
type PhoneLabel = 'Mobile' | 'Home' | 'Work';
type PreferredContact = 'Call' | 'Text' | 'Email';

interface PhoneEntry {
  number: string;
  label: PhoneLabel;
}

interface EmailEntry {
  email: string;
}

// ========================================
// REUSABLE COMPONENTS
// ========================================

const SegmentedControl = ({ 
  options, 
  value, 
  onChange 
}: { 
  options: { value: ClientType; label: string; icon: any }[];
  value: ClientType;
  onChange: (value: ClientType) => void;
}) => {
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap'
    }}>
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = value === option.value;
        
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              backgroundColor: isActive ? '#7BAA8E' : 'transparent',
              color: isActive ? '#FFFFFF' : '#A0A0A0',
              border: `2px solid ${isActive ? '#7BAA8E' : '#444'}`,
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: isActive ? '0 0 12px rgba(123,170,142,0.3)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = '#7BAA8E';
                e.currentTarget.style.color = '#E0E0E0';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = '#444';
                e.currentTarget.style.color = '#A0A0A0';
              }
            }}
          >
            <Icon size={16} />
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

const FormField = ({ 
  label, 
  required = false,
  children,
  hint
}: { 
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{
      display: 'block',
      color: '#E0E0E0',
      fontSize: '13px',
      fontWeight: '600',
      marginBottom: '6px'
    }}>
      {label} {required && <span style={{ color: '#F44336' }}>*</span>}
    </label>
    {children}
    {hint && (
      <div style={{ color: '#888', fontSize: '11px', marginTop: '4px' }}>
        {hint}
      </div>
    )}
  </div>
);

const TextInput = ({ 
  placeholder, 
  value, 
  onChange,
  type = 'text',
  fullWidth = true,
  autoFocus = false
}: { 
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  fullWidth?: boolean;
  autoFocus?: boolean;
}) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    autoFocus={autoFocus}
    style={{
      width: fullWidth ? '100%' : 'auto',
      padding: '10px 14px',
      backgroundColor: '#1A1A1A',
      border: '1px solid #444',
      borderRadius: '8px',
      color: '#FFFFFF',
      fontSize: '13px',
      outline: 'none',
      transition: 'all 0.2s'
    }}
    onFocus={(e) => {
      e.target.style.borderColor = '#7BAA8E';
      e.target.style.boxShadow = '0 0 0 3px rgba(123,170,142,0.15)';
    }}
    onBlur={(e) => {
      e.target.style.borderColor = '#444';
      e.target.style.boxShadow = 'none';
    }}
  />
);

const TextArea = ({ 
  placeholder, 
  value, 
  onChange,
  rows = 3
}: { 
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    rows={rows}
    style={{
      width: '100%',
      padding: '10px 14px',
      backgroundColor: '#1A1A1A',
      border: '1px solid #444',
      borderRadius: '8px',
      color: '#FFFFFF',
      fontSize: '13px',
      outline: 'none',
      transition: 'all 0.2s',
      fontFamily: 'inherit',
      resize: 'vertical'
    }}
    onFocus={(e) => {
      e.target.style.borderColor = '#7BAA8E';
      e.target.style.boxShadow = '0 0 0 3px rgba(123,170,142,0.15)';
    }}
    onBlur={(e) => {
      e.target.style.borderColor = '#444';
      e.target.style.boxShadow = 'none';
    }}
  />
);

const Select = ({ 
  value, 
  onChange,
  options,
  fullWidth = true,
  placeholder
}: { 
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  fullWidth?: boolean;
  placeholder?: string;
}) => (
  <div style={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }}>
    <select
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        padding: '10px 36px 10px 14px',
        backgroundColor: '#1A1A1A',
        border: '1px solid #444',
        borderRadius: '8px',
        color: value ? '#FFFFFF' : '#888',
        fontSize: '13px',
        outline: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s',
        appearance: 'none'
      }}
      onFocus={(e) => {
        e.target.style.borderColor = '#7BAA8E';
        e.target.style.boxShadow = '0 0 0 3px rgba(123,170,142,0.15)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = '#444';
        e.target.style.boxShadow = 'none';
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
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
        color: '#888'
      }}
    />
  </div>
);

const Toggle = ({ 
  checked, 
  onChange,
  label,
  disabled = false
}: { 
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}) => {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      userSelect: 'none',
      opacity: disabled ? 0.5 : 1
    }}>
      <div
        onClick={() => !disabled && onChange(!checked)}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          backgroundColor: checked ? '#7BAA8E' : '#444',
          position: 'relative',
          transition: 'all 0.2s',
          boxShadow: checked ? '0 0 8px rgba(123,170,142,0.4)' : 'none'
        }}
      >
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          position: 'absolute',
          top: '2px',
          left: checked ? '22px' : '2px',
          transition: 'all 0.2s',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }} />
      </div>
      <span style={{ color: '#E0E0E0', fontSize: '13px' }}>{label}</span>
    </label>
  );
};

const TagInput = ({ 
  tags, 
  onChange,
  suggestions 
}: { 
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions: string[];
}) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(t => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    }
  };

  return (
    <div>
      {/* Custom tag input */}
      <div style={{ marginBottom: '12px' }}>
        <input
          type="text"
          placeholder="Type a custom room/area and press Enter..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            padding: '10px 14px',
            backgroundColor: '#1A1A1A',
            border: '1px solid #444',
            borderRadius: '8px',
            color: '#FFFFFF',
            fontSize: '13px',
            outline: 'none',
            transition: 'all 0.2s'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#7BAA8E';
            e.target.style.boxShadow = '0 0 0 3px rgba(123,170,142,0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#444';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Selected tags */}
      {tags.length > 0 && (
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '6px',
          marginBottom: '12px'
        }}>
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '500',
                color: '#FFFFFF',
                backgroundColor: '#7BAA8E',
                boxShadow: '0 2px 0 0 #5D8A6E'
              }}
            >
              {tag}
              <span
                style={{ 
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}
                onClick={() => removeTag(tag)}
              >
                ×
              </span>
            </span>
          ))}
        </div>
      )}
      
      {/* Suggestions */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {suggestions.filter(s => !tags.includes(s)).map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => addTag(suggestion)}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: '500',
              color: '#A0A0A0',
              backgroundColor: '#2D2D2D',
              border: '1px solid #444',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3D3D3D';
              e.currentTarget.style.color = '#E0E0E0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2D2D2D';
              e.currentTarget.style.color = '#A0A0A0';
            }}
          >
            + {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

const GoldButton = ({ 
  children, 
  icon: Icon, 
  onClick, 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type = 'button'
}: { 
  children: React.ReactNode; 
  icon?: any;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  type?: 'button' | 'submit';
}) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const getPadding = () => {
    if (size === 'sm') return '8px 16px';
    if (size === 'lg') return '14px 28px';
    return '11px 22px';
  };

  const getFontSize = () => {
    if (size === 'sm') return '12px';
    if (size === 'lg') return '15px';
    return '14px';
  };

  const getStyles = () => {
    if (variant === 'ghost') {
      return {
        backgroundColor: hovered ? '#2D2D2D' : 'transparent',
        color: hovered ? '#C9A049' : '#A0A0A0',
        border: '1px solid ' + (hovered ? '#C9A049' : '#444'),
        boxShadow: 'none'
      };
    }
    
    if (variant === 'secondary') {
      return {
        backgroundColor: pressed ? '#2D2D2D' : hovered ? '#3D3D3D' : 'transparent',
        color: '#C9A049',
        border: '2px solid #C9A049',
        boxShadow: hovered ? '0 0 12px rgba(201,160,73,0.3)' : 'none'
      };
    }

    return {
      backgroundColor: pressed ? '#A88438' : hovered ? '#D9B563' : '#C9A049',
      color: '#FFFFFF',
      border: 'none',
      boxShadow: pressed 
        ? 'inset 0 2px 4px rgba(0,0,0,0.3)' 
        : '0 4px 0 0 #A88438CC, 0 6px 12px rgba(201,160,73,0.3)'
    };
  };

  return (
    <button
      type={type}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: getPadding(),
        fontSize: getFontSize(),
        fontWeight: '600',
        borderRadius: '999px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        position: 'relative',
        top: pressed && variant === 'primary' ? '3px' : '0',
        width: fullWidth ? '100%' : 'auto',
        whiteSpace: 'nowrap',
        ...getStyles()
      }}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
      {children}
    </button>
  );
};

const SectionHeader = ({ 
  icon: Icon, 
  title, 
  subtitle 
}: { 
  icon: any;
  title: string;
  subtitle?: string;
}) => (
  <div style={{ marginBottom: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        backgroundColor: '#7BAA8E22',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={18} color="#7BAA8E" />
      </div>
      <h3 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600', margin: 0 }}>
        {title}
      </h3>
    </div>
    {subtitle && (
      <p style={{ color: '#A0A0A0', fontSize: '12px', margin: '0 0 0 42px' }}>
        {subtitle}
      </p>
    )}
  </div>
);

// ========================================
// MAIN MODAL COMPONENT
// ========================================

export default function NewClientModal({ 
  isOpen, 
  onClose,
  onSave,
  onSaveAndSchedule,
  onSaveAndQuote
}: { 
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  onSaveAndSchedule?: () => void;
  onSaveAndQuote?: () => void;
}) {
  // Client Type & Account Info
  const [clientType, setClientType] = useState<ClientType>('Homeowner');
  const [primaryFirstName, setPrimaryFirstName] = useState('');
  const [primaryLastName, setPrimaryLastName] = useState('');
  const [secondHomeowner, setSecondHomeowner] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [status, setStatus] = useState<ClientStatus>('Lead');
  const [leadSource, setLeadSource] = useState<LeadSource>('Referral');
  const [pricingTier, setPricingTier] = useState<PricingTier>('Standard');
  const [poRequired, setPoRequired] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  // Primary Contact
  const [contactFirstName, setContactFirstName] = useState('');
  const [contactLastName, setContactLastName] = useState('');
  const [contactRole, setContactRole] = useState<ContactRole>('Homeowner');
  const [phones, setPhones] = useState<PhoneEntry[]>([{ number: '', label: 'Mobile' }]);
  const [emails, setEmails] = useState<EmailEntry[]>([{ email: '' }]);
  const [preferredContact, setPreferredContact] = useState<PreferredContact>('Call');
  const [isPrimaryContact, setIsPrimaryContact] = useState(true);
  const [receiveSMS, setReceiveSMS] = useState(true);
  const [receiveEmail, setReceiveEmail] = useState(true);
  const [portalAccess, setPortalAccess] = useState(false);

  // Primary Property
  const [propertyNickname, setPropertyNickname] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('WA');
  const [zip, setZip] = useState('');
  const [region, setRegion] = useState('');
  const [billingAddressSame, setBillingAddressSame] = useState(true);
  const [propertyNotes, setPropertyNotes] = useState('');

  // Project Information (captured during initial call)
  const [workType, setWorkType] = useState('');
  const [rooms, setRooms] = useState<string[]>([]);
  const [projectNotes, setProjectNotes] = useState('');

  // Auto-update display name for homeowners
  useEffect(() => {
    if (clientType === 'Homeowner') {
      setContactFirstName(primaryFirstName);
      setContactLastName(primaryLastName);
      setContactRole('Homeowner');
      
      if (primaryFirstName && primaryLastName) {
        if (secondHomeowner) {
          setDisplayName(`${primaryFirstName} & ${secondHomeowner} ${primaryLastName}`);
        } else {
          setDisplayName(`${primaryFirstName} ${primaryLastName}`);
        }
      }
    }
  }, [clientType, primaryFirstName, primaryLastName, secondHomeowner]);

  // Reset contact role when client type changes
  useEffect(() => {
    if (clientType === 'Contractor') {
      setContactRole('GC PM');
    } else if (clientType === 'Designer') {
      setContactRole('Designer');
    } else if (clientType === 'Property Manager') {
      setContactRole('Other');
    }
  }, [clientType]);

  const handleAddPhone = () => {
    setPhones([...phones, { number: '', label: 'Mobile' }]);
  };

  const handleAddEmail = () => {
    setEmails([...emails, { email: '' }]);
  };

  const handleSave = () => {
    console.log('Saving client...');
    onSave?.();
    onClose();
  };

  const handleSaveAndSchedule = () => {
    console.log('Saving client and scheduling visit...');
    onSaveAndSchedule?.();
    onClose();
  };

  const handleSaveAndQuote = () => {
    console.log('Saving client and creating quote...');
    onSaveAndQuote?.();
    onClose();
  };

  if (!isOpen) return null;

  const clientTypeOptions = [
    { value: 'Homeowner' as ClientType, label: 'Homeowner', icon: Home },
    { value: 'Contractor' as ClientType, label: 'Contractor', icon: Briefcase },
    { value: 'Designer' as ClientType, label: 'Designer', icon: Palette },
    { value: 'Property Manager' as ClientType, label: 'Property Mgr', icon: Building2 },
    { value: 'Other' as ClientType, label: 'Other', icon: User }
  ];

  const homeownerTagSuggestions = ['VIP', 'High-End', 'Recoat Only', 'Repeat Customer'];
  const contractorTagSuggestions = ['High Volume', 'Custom Homes', 'Commercial', 'Preferred Partner'];

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        animation: 'fadeIn 0.24s ease-out',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '960px',
          backgroundColor: '#2D2D2D',
          borderRadius: '16px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          animation: 'slideUp 0.24s ease-out',
          border: '1px solid #3D3D3D'
        }}
      >
        {/* Fixed Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid #3D3D3D',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#2D2D2D',
          borderRadius: '16px 16px 0 0'
        }}>
          <div>
            <h2 style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 'bold', margin: '0 0 6px 0' }}>
              New Client
            </h2>
            <p style={{ color: '#A0A0A0', fontSize: '13px', margin: 0 }}>
              Create a new client account with contacts and a primary property.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#A0A0A0',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3D3D3D';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#A0A0A0';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div 
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '32px'
          }}
          className="vertical-scroll"
        >
          {/* SECTION 1: Client Type & Account Info */}
          <div style={{
            backgroundColor: '#262626',
            border: '2px solid #7BAA8E33',
            borderRadius: '14px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <SectionHeader 
              icon={clientType === 'Homeowner' ? Home : Briefcase}
              title="Client Type & Account Info"
              subtitle="Select the type of client and enter their basic information"
            />

            <FormField label="Client Type" required>
              <SegmentedControl 
                options={clientTypeOptions}
                value={clientType}
                onChange={setClientType}
              />
            </FormField>

            {/* Homeowner Fields */}
            {clientType === 'Homeowner' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <FormField label="First Name" required>
                    <TextInput 
                      placeholder="Lisa"
                      value={primaryFirstName}
                      onChange={(e) => setPrimaryFirstName(e.target.value)}
                      autoFocus
                    />
                  </FormField>
                  <FormField label="Last Name" required>
                    <TextInput 
                      placeholder="Anderson"
                      value={primaryLastName}
                      onChange={(e) => setPrimaryLastName(e.target.value)}
                    />
                  </FormField>
                </div>

                <FormField label="Second Homeowner" hint="Optional - spouse or partner name">
                  <TextInput 
                    placeholder="e.g., John"
                    value={secondHomeowner}
                    onChange={(e) => setSecondHomeowner(e.target.value)}
                  />
                </FormField>

                <FormField label="Display Name" required hint="How this account appears in your system">
                  <TextInput 
                    placeholder="Lisa & John Anderson"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </FormField>
              </>
            )}

            {/* Contractor/Designer/Property Manager Fields */}
            {(clientType === 'Contractor' || clientType === 'Designer' || clientType === 'Property Manager') && (
              <>
                <FormField label="Company Name" required>
                  <TextInput 
                    placeholder="Summit Builders, Inc."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    autoFocus
                  />
                </FormField>

                <FormField label="Primary Contact Name" required>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <TextInput 
                      placeholder="First name"
                      value={contactFirstName}
                      onChange={(e) => setContactFirstName(e.target.value)}
                    />
                    <TextInput 
                      placeholder="Last name"
                      value={contactLastName}
                      onChange={(e) => setContactLastName(e.target.value)}
                    />
                  </div>
                </FormField>

                {clientType === 'Contractor' && (
                  <>
                    <FormField label="Pricing Tier">
                      <Select 
                        value={pricingTier}
                        onChange={(e) => setPricingTier(e.target.value as PricingTier)}
                        options={[
                          { value: 'Standard', label: 'Standard' },
                          { value: 'Contractor', label: 'Contractor Pricing' },
                          { value: 'VIP', label: 'VIP Pricing' }
                        ]}
                      />
                    </FormField>

                    <div style={{ marginBottom: '16px' }}>
                      <Toggle 
                        checked={poRequired}
                        onChange={setPoRequired}
                        label="Purchase Order Required"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {/* Common Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <FormField label="Status" required>
                <Select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ClientStatus)}
                  options={[
                    { value: 'Lead', label: 'Lead' },
                    { value: 'Active', label: 'Active' },
                    { value: 'Past', label: 'Past' }
                  ]}
                />
              </FormField>

              <FormField label="Lead Source" required>
                <Select 
                  value={leadSource}
                  onChange={(e) => setLeadSource(e.target.value as LeadSource)}
                  options={[
                    { value: 'Google', label: 'Google' },
                    { value: 'Referral', label: 'Referral' },
                    { value: 'LSA', label: 'LSA' },
                    { value: 'Repeat', label: 'Repeat Customer' },
                    { value: 'Other', label: 'Other' }
                  ]}
                />
              </FormField>
            </div>

            <FormField label="Tags" hint="Add tags to organize and filter clients">
              <TagInput 
                tags={tags}
                onChange={setTags}
                suggestions={clientType === 'Homeowner' ? homeownerTagSuggestions : contractorTagSuggestions}
              />
            </FormField>
          </div>

          {/* SECTION 2: Primary Contact */}
          <div style={{
            backgroundColor: '#262626',
            border: '2px solid #7BAA8E33',
            borderRadius: '14px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <SectionHeader 
              icon={User}
              title="Primary Contact"
              subtitle="Main point of contact for this client"
            />

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '20px',
              marginBottom: '20px'
            }}>
              {/* Left Column */}
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <FormField label="First Name" required>
                    <TextInput 
                      placeholder="First name"
                      value={contactFirstName}
                      onChange={(e) => setContactFirstName(e.target.value)}
                      disabled={clientType === 'Homeowner'}
                    />
                  </FormField>
                  <FormField label="Last Name" required>
                    <TextInput 
                      placeholder="Last name"
                      value={contactLastName}
                      onChange={(e) => setContactLastName(e.target.value)}
                      disabled={clientType === 'Homeowner'}
                    />
                  </FormField>
                </div>

                <FormField label="Role" required>
                  <Select 
                    value={contactRole}
                    onChange={(e) => setContactRole(e.target.value as ContactRole)}
                    options={[
                      { value: 'Homeowner', label: 'Homeowner' },
                      { value: 'Spouse', label: 'Spouse' },
                      { value: 'GC PM', label: 'GC / Project Manager' },
                      { value: 'Office/AP', label: 'Office / AP' },
                      { value: 'Designer', label: 'Designer' },
                      { value: 'Tenant', label: 'Tenant' },
                      { value: 'Other', label: 'Other' }
                    ]}
                  />
                </FormField>

                <FormField label="Preferred Contact Method" required>
                  <Select 
                    value={preferredContact}
                    onChange={(e) => setPreferredContact(e.target.value as PreferredContact)}
                    options={[
                      { value: 'Call', label: 'Phone Call' },
                      { value: 'Text', label: 'Text / SMS' },
                      { value: 'Email', label: 'Email' }
                    ]}
                  />
                </FormField>
              </div>

              {/* Right Column */}
              <div>
                <FormField label="Phone Number(s)" required>
                  {phones.map((phone, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <TextInput 
                          placeholder="(555) 555-5555"
                          value={phone.number}
                          onChange={(e) => {
                            const newPhones = [...phones];
                            newPhones[idx].number = e.target.value;
                            setPhones(newPhones);
                          }}
                        />
                      </div>
                      <Select 
                        value={phone.label}
                        onChange={(e) => {
                          const newPhones = [...phones];
                          newPhones[idx].label = e.target.value as PhoneLabel;
                          setPhones(newPhones);
                        }}
                        options={[
                          { value: 'Mobile', label: 'Mobile' },
                          { value: 'Home', label: 'Home' },
                          { value: 'Work', label: 'Work' }
                        ]}
                        fullWidth={false}
                      />
                    </div>
                  ))}
                  <button
                    onClick={handleAddPhone}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      backgroundColor: 'transparent',
                      border: '1px dashed #444',
                      borderRadius: '6px',
                      color: '#7BAA8E',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#7BAA8E';
                      e.currentTarget.style.backgroundColor = '#7BAA8E11';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#444';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Plus size={14} />
                    Add another phone
                  </button>
                </FormField>

                <FormField label="Email Address(es)" required>
                  {emails.map((email, idx) => (
                    <div key={idx} style={{ marginBottom: '8px' }}>
                      <TextInput 
                        placeholder="email@example.com"
                        value={email.email}
                        onChange={(e) => {
                          const newEmails = [...emails];
                          newEmails[idx].email = e.target.value;
                          setEmails(newEmails);
                        }}
                        type="email"
                      />
                    </div>
                  ))}
                  <button
                    onClick={handleAddEmail}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      backgroundColor: 'transparent',
                      border: '1px dashed #444',
                      borderRadius: '6px',
                      color: '#7BAA8E',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#7BAA8E';
                      e.currentTarget.style.backgroundColor = '#7BAA8E11';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#444';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Plus size={14} />
                    Add another email
                  </button>
                </FormField>
              </div>
            </div>

            {/* Toggles */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '16px',
              padding: '16px',
              backgroundColor: '#1A1A1A',
              borderRadius: '10px'
            }}>
              <Toggle 
                checked={isPrimaryContact}
                onChange={setIsPrimaryContact}
                label="Primary Contact"
                disabled={true}
              />
              <Toggle 
                checked={receiveSMS}
                onChange={setReceiveSMS}
                label="Receive SMS Notifications"
              />
              <Toggle 
                checked={receiveEmail}
                onChange={setReceiveEmail}
                label="Receive Email Updates"
              />
              <Toggle 
                checked={portalAccess}
                onChange={setPortalAccess}
                label="Grant Client Portal Access"
              />
            </div>
          </div>

          {/* SECTION 3: Project/Work Information */}
          <div style={{
            backgroundColor: '#262626',
            border: '2px solid #C9A04933',
            borderRadius: '14px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <SectionHeader 
              icon={Hammer}
              title="Project / Work Information"
              subtitle="Quick capture: What type of work and which rooms/areas?"
            />

            {/* Work Type */}
            <FormField label="Type of Work" hint="e.g., Refinish, New Installation, Repair, Stairs, Recoat">
              <TextInput 
                placeholder="Refinish oak floors"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
              />
            </FormField>

            <FormField label="Rooms / Areas" hint="Click suggestions or type custom areas">
              <TagInput 
                tags={rooms}
                onChange={setRooms}
                suggestions={[
                  'Living Room',
                  'Kitchen',
                  'Master Bedroom',
                  'All Bedrooms',
                  'Dining Room',
                  'Hallways',
                  'Stairs',
                  'Entry',
                  'Family Room',
                  'Office',
                  'Basement',
                  'Entire Main Floor'
                ]}
              />
            </FormField>

            <FormField label="Project Notes" hint="Square footage estimate, wood species, condition, timeline, budget, etc.">
              <TextArea 
                placeholder="~1,200 sq ft of oak hardwood. Floors need refinish, moderate wear. Client wants natural finish. Flexible timeline, targeting late spring."
                value={projectNotes}
                onChange={(e) => setProjectNotes(e.target.value)}
                rows={3}
              />
            </FormField>
          </div>

          {/* SECTION 4: Primary Property */}
          <div style={{
            backgroundColor: '#262626',
            border: '2px solid #7BAA8E33',
            borderRadius: '14px',
            padding: '24px'
          }}>
            <SectionHeader 
              icon={MapPin}
              title="Primary Property / Jobsite"
              subtitle="Where you'll normally work for this client"
            />

            <FormField label="Property Nickname" hint="Optional - e.g., 'Primary Home', 'Lot 14 - RiverView'">
              <TextInput 
                placeholder="Primary Residence"
                value={propertyNickname}
                onChange={(e) => setPropertyNickname(e.target.value)}
              />
            </FormField>

            <FormField label="Street Address" required>
              <TextInput 
                placeholder="123 Main Street"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
              />
            </FormField>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
              <FormField label="City" required>
                <TextInput 
                  placeholder="Spokane"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </FormField>
              <FormField label="State" required>
                <TextInput 
                  placeholder="WA"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </FormField>
              <FormField label="ZIP" required>
                <TextInput 
                  placeholder="99201"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Region" required>
              <Select 
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                options={[
                  { value: 'north', label: 'North Spokane' },
                  { value: 'south', label: 'South Hill' },
                  { value: 'valley', label: 'Spokane Valley' },
                  { value: 'downtown', label: 'Downtown' },
                  { value: 'out-of-town', label: 'Out of Town' }
                ]}
                placeholder="Select region"
              />
            </FormField>

            <div style={{ marginBottom: '16px' }}>
              <Toggle 
                checked={billingAddressSame}
                onChange={setBillingAddressSame}
                label="Billing address is the same as this property"
              />
            </div>

            <FormField label="Property Notes" hint="Floor species, pets, parking, access instructions, etc.">
              <TextArea 
                placeholder="Two golden retrievers - please close gates. Oak hardwood throughout main floor. Park in driveway on left side."
                value={propertyNotes}
                onChange={(e) => setPropertyNotes(e.target.value)}
                rows={4}
              />
            </FormField>

            <div style={{ 
              color: '#888', 
              fontSize: '12px', 
              fontStyle: 'italic',
              marginTop: '12px',
              padding: '12px',
              backgroundColor: '#1A1A1A',
              borderRadius: '8px',
              borderLeft: '3px solid #7BAA8E'
            }}>
              💡 You can add more properties later from the Properties tab.
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div style={{
          padding: '20px 32px',
          borderTop: '1px solid #3D3D3D',
          backgroundColor: '#2D2D2D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '0 0 16px 16px'
        }}>
          <div style={{ color: '#888', fontSize: '12px', fontStyle: 'italic' }}>
            * You can add more contacts and properties after saving.
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <GoldButton 
              variant="ghost" 
              onClick={handleSave}
            >
              Save Client
            </GoldButton>
            <GoldButton 
              icon={FileText}
              variant="secondary" 
              onClick={handleSaveAndQuote}
            >
              Save & Create Quote
            </GoldButton>
            <GoldButton 
              icon={Calendar}
              onClick={handleSaveAndSchedule}
            >
              Save & Schedule Visit
            </GoldButton>
          </div>
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
            transform: translateY(30px) scale(0.98);
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