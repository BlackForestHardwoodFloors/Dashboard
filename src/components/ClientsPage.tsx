import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Pencil, 
  Trash2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
  X,
  Calendar,
  FileText,
  MessageSquare,
  Camera,
  CreditCard,
  Home,
  Building2,
  User,
  Users,
  Star,
  Tag,
  Sparkles,
  Hash,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Globe,
  Bell,
  Video,
  Mic,
  FileImage,
  Download,
  Upload,
  Edit,
  Trash,
  Send,
  MoreVertical
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { SidebarEnhanced } from './SidebarEnhanced';
import NewClientModal from './NewClientModal';
import BoardroomNewClientModal from './BoardroomNewClientModal';

// ========================================
// TYPES
// ========================================

type ClientType = 'Homeowner' | 'Contractor' | 'Designer' | 'Property Manager';
type ClientStatus = 'Active' | 'Inactive' | 'Lead';
type PropertyType = 'Primary' | 'Rental' | 'Commercial';
type JobStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
type QuoteStatus = 'Draft' | 'Sent' | 'Accepted' | 'Declined';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  phones: string[];
  emails: string[];
  isPrimary: boolean;
  receiveSMS: boolean;
  receiveEmail: boolean;
  portalAccess: boolean;
  preferredContact: 'Phone' | 'Email' | 'SMS';
}

interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  region: string;
  nickname?: string;
  notes?: string;
  tags: string[];
  propertyType: PropertyType;
}

interface Job {
  id: string;
  jobNumber: string;
  status: JobStatus;
  propertyId: string;
  assignedForeman: string;
  startDate: string;
  endDate: string;
  revenue: number;
  progress: number;
}

interface Quote {
  id: string;
  quoteNumber: string;
  status: QuoteStatus;
  propertyId: string;
  amount: number;
  date: string;
}

interface Client {
  id: string;
  accountName: string;
  clientType: ClientType;
  status: ClientStatus;
  primaryContact: Contact;
  contacts: Contact[];
  properties: Property[];
  jobs: Job[];
  quotes: Quote[];
  tags: string[];
  lastActivity: string;
  leadSource: string;
  assignedManager: string;
  lifetimeValue: number;
  avatar: string;
  pricingTier?: string;
  photos?: string[];
}

type TabType = 'Overview' | 'Contacts' | 'Properties' | 'Jobs & Quotes' | 'Communication' | 'Files & Photos' | 'Billing';

// ========================================
// REUSABLE COMPONENTS
// ========================================

const AccountTypeChip = ({ type, size = 'md' }: { type: ClientType; size?: 'sm' | 'md' }) => {
  const colors: Record<ClientType, string> = {
    'Homeowner': '#7BAA8E',
    'Contractor': '#4F6A41',
    'Designer': '#6E8B3D',
    'Property Manager': '#4A7268'
  };

  const baseColor = colors[type];
  
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: size === 'sm' ? '3px 10px' : '5px 14px',
      borderRadius: '10px',
      fontSize: size === 'sm' ? '11px' : '12px',
      fontWeight: '600',
      color: '#FFFFFF',
      backgroundColor: baseColor,
      boxShadow: `0 2px 0 0 ${baseColor}CC, 0 3px 6px rgba(0,0,0,0.2)`,
      whiteSpace: 'nowrap'
    }}>
      {type}
    </span>
  );
};

const StatusChip = ({ status, size = 'md' }: { status: ClientStatus | JobStatus | QuoteStatus; size?: 'sm' | 'md' }) => {
  const getColor = () => {
    switch (status) {
      case 'Active':
      case 'Completed':
      case 'Accepted':
        return '#4CAF50';
      case 'Inactive':
      case 'Cancelled':
      case 'Declined':
        return '#A0A0A0';
      case 'Lead':
      case 'Draft':
        return '#F4B400';
      case 'Scheduled':
        return '#3B9CAA';
      case 'In Progress':
      case 'Sent':
        return '#C9A049';
      default:
        return '#A0A0A0';
    }
  };

  const baseColor = getColor();
  
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: size === 'sm' ? '3px 10px' : '5px 14px',
      borderRadius: '10px',
      fontSize: size === 'sm' ? '11px' : '12px',
      fontWeight: '600',
      color: '#FFFFFF',
      backgroundColor: baseColor,
      boxShadow: `0 2px 0 0 ${baseColor}CC, 0 3px 6px rgba(0,0,0,0.2)`,
      whiteSpace: 'nowrap'
    }}>
      {status}
    </span>
  );
};

const TagChip = ({ label, onRemove }: { label: string; onRemove?: () => void }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '8px',
        fontSize: '11px',
        fontWeight: '500',
        color: '#E0E0E0',
        backgroundColor: hovered ? '#3D3D3D' : '#2D2D2D',
        border: '1px solid #444',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap'
      }}
    >
      <Hash size={12} />
      {label}
      {onRemove && (
        <X 
          size={12} 
          style={{ cursor: 'pointer', opacity: hovered ? 1 : 0.6 }}
          onClick={onRemove}
        />
      )}
    </span>
  );
};

const GoldButton = ({ 
  children, 
  icon: Icon, 
  onClick, 
  variant = 'primary',
  size = 'md',
  fullWidth = false
}: { 
  children: React.ReactNode; 
  icon?: any;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const getPadding = () => {
    if (size === 'sm') return '6px 14px';
    if (size === 'lg') return '14px 28px';
    return '10px 20px';
  };

  const getFontSize = () => {
    if (size === 'sm') return '12px';
    if (size === 'lg') return '15px';
    return '13px';
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
        backgroundColor: pressed ? '#2D2D2D' : hovered ? '#3D3D3D' : '#2D2D2D',
        color: '#C9A049',
        border: '1px solid #C9A049',
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
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        position: 'relative',
        top: pressed && variant === 'primary' ? '3px' : '0',
        width: fullWidth ? '100%' : 'auto',
        ...getStyles()
      }}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
      {children}
    </button>
  );
};

const IconButton = ({ 
  icon: Icon, 
  onClick, 
  color = '#A0A0A0',
  tooltip
}: { 
  icon: any; 
  onClick?: () => void;
  color?: string;
  tooltip?: string;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      title={tooltip}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: hovered ? color : '#2D2D2D',
        color: hovered ? '#FFFFFF' : '#A0A0A0',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: hovered ? `0 0 12px ${color}66` : 'none'
      }}
    >
      <Icon size={16} />
    </button>
  );
};

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  width = '600px'
}: { 
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}) => {
  if (!isOpen) return null;

  return (
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
      padding: '20px',
      animation: 'fadeIn 0.24s ease-out'
    }}
    onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: width,
          maxHeight: '90vh',
          backgroundColor: '#2D2D2D',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.24s ease-out'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #3D3D3D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '600', margin: 0 }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '6px',
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

        {/* Modal Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px'
        }}
        className="vertical-scroll"
        >
          {children}
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
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const FormField = ({ 
  label, 
  required = false,
  children 
}: { 
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div style={{ marginBottom: '20px' }}>
    <label style={{
      display: 'block',
      color: '#E0E0E0',
      fontSize: '13px',
      fontWeight: '600',
      marginBottom: '8px'
    }}>
      {label} {required && <span style={{ color: '#F44336' }}>*</span>}
    </label>
    {children}
  </div>
);

const TextInput = ({ 
  placeholder, 
  value, 
  onChange,
  type = 'text',
  fullWidth = true
}: { 
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  fullWidth?: boolean;
}) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
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
      e.target.style.borderColor = '#C9A049';
      e.target.style.boxShadow = '0 0 0 3px rgba(201,160,73,0.1)';
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
  rows = 4
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
      e.target.style.borderColor = '#C9A049';
      e.target.style.boxShadow = '0 0 0 3px rgba(201,160,73,0.1)';
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
  fullWidth = true
}: { 
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  fullWidth?: boolean;
}) => (
  <select
    value={value}
    onChange={onChange}
    style={{
      width: fullWidth ? '100%' : 'auto',
      padding: '10px 14px',
      backgroundColor: '#1A1A1A',
      border: '1px solid #444',
      borderRadius: '8px',
      color: '#FFFFFF',
      fontSize: '13px',
      outline: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }}
    onFocus={(e) => {
      e.target.style.borderColor = '#C9A049';
      e.target.style.boxShadow = '0 0 0 3px rgba(201,160,73,0.1)';
    }}
    onBlur={(e) => {
      e.target.style.borderColor = '#444';
      e.target.style.boxShadow = 'none';
    }}
  >
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

// Photo Carousel Component
const PhotoCarousel = ({ photos, clientName }: { photos: string[]; clientName: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Main Photo Display */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '320px',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#1A1A1A'
      }}>
        <img
          src={photos[currentIndex]}
          alt={`${clientName} project photo ${currentIndex + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />

        {/* Navigation Arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                border: '2px solid #C9A049',
                color: '#C9A049',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(201, 160, 73, 0.9)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                e.currentTarget.style.color = '#C9A049';
              }}
            >
              <ChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
            </button>
            <button
              onClick={nextPhoto}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                border: '2px solid #C9A049',
                color: '#C9A049',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(201, 160, 73, 0.9)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                e.currentTarget.style.color = '#C9A049';
              }}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Photo Counter */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#FFFFFF',
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '600',
          backdropFilter: 'blur(8px)'
        }}>
          {currentIndex + 1} / {photos.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {photos.length > 1 && (
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '12px',
          overflowX: 'auto',
          padding: '4px 0'
        }} className="horizontal-scroll">
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              style={{
                width: '80px',
                height: '60px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: index === currentIndex ? '3px solid #C9A049' : '3px solid transparent',
                cursor: 'pointer',
                flexShrink: 0,
                padding: 0,
                backgroundColor: 'transparent',
                opacity: index === currentIndex ? 1 : 0.6,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                if (index !== currentIndex) {
                  e.currentTarget.style.opacity = '0.6';
                }
              }}
            >
              <img
                src={photo}
                alt={`Thumbnail ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Toggle = ({ 
  checked, 
  onChange,
  label 
}: { 
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) => {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
      userSelect: 'none'
    }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          backgroundColor: checked ? '#C9A049' : '#444',
          position: 'relative',
          transition: 'all 0.2s',
          boxShadow: checked ? '0 0 8px rgba(201,160,73,0.4)' : 'none'
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

// ========================================
// SAMPLE DATA
// ========================================

const sampleClients: Client[] = [
  {
    id: '1',
    accountName: 'Lisa & John Anderson',
    clientType: 'Homeowner',
    status: 'Active',
    primaryContact: {
      id: 'c1',
      firstName: 'Lisa',
      lastName: 'Anderson',
      role: 'Homeowner',
      phones: ['(509) 555-0123'],
      emails: ['lisa.anderson@email.com'],
      isPrimary: true,
      receiveSMS: true,
      receiveEmail: true,
      portalAccess: true,
      preferredContact: 'Phone'
    },
    contacts: [
      {
        id: 'c1',
        firstName: 'Lisa',
        lastName: 'Anderson',
        role: 'Homeowner',
        phones: ['(509) 555-0123'],
        emails: ['lisa.anderson@email.com'],
        isPrimary: true,
        receiveSMS: true,
        receiveEmail: true,
        portalAccess: true,
        preferredContact: 'Phone'
      },
      {
        id: 'c2',
        firstName: 'John',
        lastName: 'Anderson',
        role: 'Spouse',
        phones: ['(509) 555-0124'],
        emails: ['john.anderson@email.com'],
        isPrimary: false,
        receiveSMS: true,
        receiveEmail: false,
        portalAccess: false,
        preferredContact: 'SMS'
      }
    ],
    properties: [
      {
        id: 'p1',
        address: '123 Main Street',
        city: 'Spokane',
        state: 'WA',
        zip: '99201',
        region: 'North Spokane',
        nickname: 'Primary Residence',
        notes: 'Two dogs, please close gates. Hardwood in living areas.',
        tags: ['High-End', 'Pet Friendly'],
        propertyType: 'Primary'
      }
    ],
    jobs: [
      {
        id: 'j1',
        jobNumber: 'JOB-2024-001',
        status: 'Completed',
        propertyId: 'p1',
        assignedForeman: 'Mike Rodriguez',
        startDate: '2024-01-15',
        endDate: '2024-01-18',
        revenue: 12500,
        progress: 100
      }
    ],
    quotes: [
      {
        id: 'q1',
        quoteNumber: 'QT-2024-045',
        status: 'Accepted',
        propertyId: 'p1',
        amount: 12500,
        date: '2024-01-10'
      }
    ],
    tags: ['VIP', 'Repeat Customer', 'High-End'],
    lastActivity: 'Job completed - 2 weeks ago',
    leadSource: 'Referral',
    assignedManager: 'Sarah Williams',
    lifetimeValue: 28750,
    avatar: 'https://images.unsplash.com/photo-1755914305030-bfc5c0196d76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    photos: [
      'https://images.unsplash.com/photo-1693948568453-a3564f179a84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXJkd29vZCUyMGZsb29yaW5nJTIwaW5zdGFsbGF0aW9ufGVufDF8fHx8MTc2MzQ0MzA4N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1758548157126-e4c0477f796e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmbG9vciUyMHRpbGVzfGVufDF8fHx8MTc2MzQ0MzA4N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1512324725833-abbc95d06090?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmbG9vcmluZyUyMGhvbWV8ZW58MXx8fHwxNzYzNDQzMDg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1611072337226-1140ab367200?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYWslMjB3b29kJTIwZmxvb3J8ZW58MXx8fHwxNzYzNDQzMDg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1759503167282-20525a9a5b80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGZsb29yaW5nJTIwcHJvamVjdHxlbnwxfHx8fDE3NjM0NDMwODh8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ]
  },
  {
    id: '2',
    accountName: 'Summit Builders, Inc.',
    clientType: 'Contractor',
    status: 'Active',
    pricingTier: 'Preferred',
    primaryContact: {
      id: 'c3',
      firstName: 'David',
      lastName: 'Chen',
      role: 'General Contractor',
      phones: ['(509) 555-0234'],
      emails: ['david@summitbuilders.com'],
      isPrimary: true,
      receiveSMS: true,
      receiveEmail: true,
      portalAccess: true,
      preferredContact: 'Email'
    },
    contacts: [
      {
        id: 'c3',
        firstName: 'David',
        lastName: 'Chen',
        role: 'General Contractor',
        phones: ['(509) 555-0234'],
        emails: ['david@summitbuilders.com'],
        isPrimary: true,
        receiveSMS: true,
        receiveEmail: true,
        portalAccess: true,
        preferredContact: 'Email'
      }
    ],
    properties: [
      {
        id: 'p2',
        address: '456 Oak Avenue',
        city: 'Spokane',
        state: 'WA',
        zip: '99202',
        region: 'Downtown',
        nickname: 'Oak Development',
        notes: 'Multi-unit development project',
        tags: ['Commercial', 'Multi-Unit'],
        propertyType: 'Commercial'
      }
    ],
    jobs: [
      {
        id: 'j2',
        jobNumber: 'JOB-2024-012',
        status: 'In Progress',
        propertyId: 'p2',
        assignedForeman: 'James Cooper',
        startDate: '2024-02-01',
        endDate: '2024-02-15',
        revenue: 45000,
        progress: 65
      }
    ],
    quotes: [
      {
        id: 'q2',
        quoteNumber: 'QT-2024-087',
        status: 'Sent',
        propertyId: 'p2',
        amount: 35000,
        date: '2024-02-10'
      }
    ],
    tags: ['Preferred Partner', 'Volume Discount'],
    lastActivity: 'Quote sent - 3 days ago',
    leadSource: 'Website',
    assignedManager: 'Tom Johnson',
    lifetimeValue: 185000,
    avatar: 'https://images.unsplash.com/photo-1763046472163-32c74523903e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: '3',
    accountName: 'Maria Garcia - Interior Design',
    clientType: 'Designer',
    status: 'Active',
    primaryContact: {
      id: 'c4',
      firstName: 'Maria',
      lastName: 'Garcia',
      role: 'Interior Designer',
      phones: ['(509) 555-0345'],
      emails: ['maria@garciadesign.com'],
      isPrimary: true,
      receiveSMS: true,
      receiveEmail: true,
      portalAccess: true,
      preferredContact: 'Email'
    },
    contacts: [
      {
        id: 'c4',
        firstName: 'Maria',
        lastName: 'Garcia',
        role: 'Interior Designer',
        phones: ['(509) 555-0345'],
        emails: ['maria@garciadesign.com'],
        isPrimary: true,
        receiveSMS: true,
        receiveEmail: true,
        portalAccess: true,
        preferredContact: 'Email'
      }
    ],
    properties: [],
    jobs: [],
    quotes: [
      {
        id: 'q3',
        quoteNumber: 'QT-2024-098',
        status: 'Draft',
        propertyId: 'p3',
        amount: 18500,
        date: '2024-02-14'
      }
    ],
    tags: ['Designer Network', 'Showroom Partner'],
    lastActivity: 'Draft quote created - 1 day ago',
    leadSource: 'Trade Show',
    assignedManager: 'Sarah Williams',
    lifetimeValue: 52000,
    avatar: 'https://images.unsplash.com/photo-1685514823717-7e1ff6ee0563?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: '4',
    accountName: 'Thompson Property Management',
    clientType: 'Property Manager',
    status: 'Active',
    primaryContact: {
      id: 'c5',
      firstName: 'Robert',
      lastName: 'Thompson',
      role: 'Property Manager',
      phones: ['(509) 555-0456'],
      emails: ['robert@thompsonpm.com'],
      isPrimary: true,
      receiveSMS: false,
      receiveEmail: true,
      portalAccess: true,
      preferredContact: 'Email'
    },
    contacts: [
      {
        id: 'c5',
        firstName: 'Robert',
        lastName: 'Thompson',
        role: 'Property Manager',
        phones: ['(509) 555-0456'],
        emails: ['robert@thompsonpm.com'],
        isPrimary: true,
        receiveSMS: false,
        receiveEmail: true,
        portalAccess: true,
        preferredContact: 'Email'
      }
    ],
    properties: [
      {
        id: 'p4',
        address: '789 Pine Street',
        city: 'Spokane',
        state: 'WA',
        zip: '99203',
        region: 'South Hill',
        nickname: 'Pine Apartments',
        notes: 'Multi-family rental units',
        tags: ['Rental', 'Multi-Family'],
        propertyType: 'Rental'
      }
    ],
    jobs: [
      {
        id: 'j3',
        jobNumber: 'JOB-2024-008',
        status: 'Scheduled',
        propertyId: 'p4',
        assignedForeman: 'Carlos Martinez',
        startDate: '2024-03-01',
        endDate: '2024-03-05',
        revenue: 22000,
        progress: 0
      }
    ],
    quotes: [],
    tags: ['Volume Customer', 'Monthly Service'],
    lastActivity: 'Job scheduled - 5 days ago',
    leadSource: 'Google Ads',
    assignedManager: 'Tom Johnson',
    lifetimeValue: 95000,
    avatar: 'https://images.unsplash.com/photo-1651752523215-9bf678c29355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: '5',
    accountName: 'Jennifer Martinez',
    clientType: 'Homeowner',
    status: 'Lead',
    primaryContact: {
      id: 'c6',
      firstName: 'Jennifer',
      lastName: 'Martinez',
      role: 'Homeowner',
      phones: ['(509) 555-0567'],
      emails: ['jennifer.martinez@email.com'],
      isPrimary: true,
      receiveSMS: true,
      receiveEmail: true,
      portalAccess: false,
      preferredContact: 'Email'
    },
    contacts: [
      {
        id: 'c6',
        firstName: 'Jennifer',
        lastName: 'Martinez',
        role: 'Homeowner',
        phones: ['(509) 555-0567'],
        emails: ['jennifer.martinez@email.com'],
        isPrimary: true,
        receiveSMS: true,
        receiveEmail: true,
        portalAccess: false,
        preferredContact: 'Email'
      }
    ],
    properties: [
      {
        id: 'p5',
        address: '321 Elm Street',
        city: 'Spokane',
        state: 'WA',
        zip: '99204',
        region: 'West Spokane',
        nickname: 'Martinez Residence',
        notes: 'Kitchen remodel project',
        tags: ['New Lead'],
        propertyType: 'Primary'
      }
    ],
    jobs: [],
    quotes: [
      {
        id: 'q4',
        quoteNumber: 'QT-2024-102',
        status: 'Draft',
        propertyId: 'p5',
        amount: 15000,
        date: '2024-02-15'
      }
    ],
    tags: ['New Lead'],
    lastActivity: 'Draft quote - Today',
    leadSource: 'Website',
    assignedManager: 'Sarah Williams',
    lifetimeValue: 0,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: '6',
    accountName: 'Pacific Construction LLC',
    clientType: 'Contractor',
    status: 'Active',
    primaryContact: {
      id: 'c7',
      firstName: 'Michael',
      lastName: 'Wong',
      role: 'Project Manager',
      phones: ['(509) 555-0678'],
      emails: ['michael@pacificconstruction.com'],
      isPrimary: true,
      receiveSMS: true,
      receiveEmail: true,
      portalAccess: true,
      preferredContact: 'Phone'
    },
    contacts: [
      {
        id: 'c7',
        firstName: 'Michael',
        lastName: 'Wong',
        role: 'Project Manager',
        phones: ['(509) 555-0678'],
        emails: ['michael@pacificconstruction.com'],
        isPrimary: true,
        receiveSMS: true,
        receiveEmail: true,
        portalAccess: true,
        preferredContact: 'Phone'
      }
    ],
    properties: [
      {
        id: 'p6',
        address: '555 Riverside Ave',
        city: 'Spokane',
        state: 'WA',
        zip: '99201',
        region: 'Downtown',
        nickname: 'Riverside Tower',
        notes: 'Commercial high-rise project',
        tags: ['Commercial', 'High-Rise'],
        propertyType: 'Commercial'
      }
    ],
    jobs: [],
    quotes: [
      {
        id: 'q5',
        quoteNumber: 'QT-2024-095',
        status: 'Sent',
        propertyId: 'p6',
        amount: 125000,
        date: '2024-02-12'
      }
    ],
    tags: ['Commercial Partner'],
    lastActivity: 'Quote sent - 3 days ago',
    leadSource: 'Referral',
    assignedManager: 'Tom Johnson',
    lifetimeValue: 320000,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: '7',
    accountName: 'Sarah & Tom Williams',
    clientType: 'Homeowner',
    status: 'Lead',
    primaryContact: {
      id: 'c8',
      firstName: 'Sarah',
      lastName: 'Williams',
      role: 'Homeowner',
      phones: ['(509) 555-0789'],
      emails: ['sarah.williams@email.com'],
      isPrimary: true,
      receiveSMS: true,
      receiveEmail: true,
      portalAccess: false,
      preferredContact: 'Email'
    },
    contacts: [
      {
        id: 'c8',
        firstName: 'Sarah',
        lastName: 'Williams',
        role: 'Homeowner',
        phones: ['(509) 555-0789'],
        emails: ['sarah.williams@email.com'],
        isPrimary: true,
        receiveSMS: true,
        receiveEmail: true,
        portalAccess: false,
        preferredContact: 'Email'
      }
    ],
    properties: [
      {
        id: 'p7',
        address: '888 Maple Drive',
        city: 'Spokane',
        state: 'WA',
        zip: '99205',
        region: 'North Spokane',
        nickname: 'Williams Home',
        notes: 'Basement renovation',
        tags: ['Renovation'],
        propertyType: 'Primary'
      }
    ],
    jobs: [],
    quotes: [
      {
        id: 'q6',
        quoteNumber: 'QT-2024-089',
        status: 'Declined',
        propertyId: 'p7',
        amount: 28000,
        date: '2024-02-08'
      }
    ],
    tags: ['Price Sensitive'],
    lastActivity: 'Quote declined - 1 week ago',
    leadSource: 'Google Ads',
    assignedManager: 'Sarah Williams',
    lifetimeValue: 0,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  }
];

// ========================================
// MAIN COMPONENT
// ========================================

export default function ClientsPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('Overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | ClientType>('All');
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  
  // New filters for Quote/Contract/Job/Work Order
  const [filterHasQuote, setFilterHasQuote] = useState(false);
  const [filterHasContract, setFilterHasContract] = useState(false);
  const [filterHasJob, setFilterHasJob] = useState(false);
  const [filterHasWorkOrder, setFilterHasWorkOrder] = useState(false);
  const [filterDraft, setFilterDraft] = useState(false);
  const [filterSent, setFilterSent] = useState(false);
  const [filterReceived, setFilterReceived] = useState(false);
  const [filterAccepted, setFilterAccepted] = useState(false);
  const [filterRejected, setFilterRejected] = useState(false);
  const [filterSigned, setFilterSigned] = useState(false);

  // Helper function to format client name based on type
  const formatClientName = (client: Client): string => {
    // Keep company names as-is for Contractors and Designers
    if (client.clientType === 'Contractor' || client.clientType === 'Designer') {
      return client.accountName;
    }
    
    // For Homeowners and Property Managers, format as "Last, First"
    const contact = client.primaryContact;
    if (contact && contact.firstName && contact.lastName) {
      // Check if there's a second homeowner in the account name
      if (client.accountName.includes('&')) {
        // Extract names from pattern like "Lisa & John Anderson"
        const parts = client.accountName.split(' ');
        const lastName = parts[parts.length - 1];
        const firstNames = parts.slice(0, parts.length - 1).join(' ');
        return `${lastName}, ${firstNames}`;
      }
      return `${contact.lastName}, ${contact.firstName}`;
    }
    
    return client.accountName;
  };

  const filteredClients = sampleClients.filter(client => {
    // Enhanced search: searches across name, email, phone, address, tags
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      client.accountName.toLowerCase().includes(searchLower) ||
      client.primaryContact.firstName?.toLowerCase().includes(searchLower) ||
      client.primaryContact.lastName?.toLowerCase().includes(searchLower) ||
      client.primaryContact.emails.some(email => email.toLowerCase().includes(searchLower)) ||
      client.primaryContact.phones.some(phone => phone.toLowerCase().includes(searchLower)) ||
      client.properties.some(prop => 
        prop.address.toLowerCase().includes(searchLower) ||
        prop.city.toLowerCase().includes(searchLower) ||
        prop.zip.toLowerCase().includes(searchLower)
      ) ||
      client.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      client.contacts.some(contact => 
        contact.firstName.toLowerCase().includes(searchLower) ||
        contact.lastName.toLowerCase().includes(searchLower) ||
        contact.emails.some(email => email.toLowerCase().includes(searchLower)) ||
        contact.phones.some(phone => phone.toLowerCase().includes(searchLower))
      );
    const matchesFilter = filterType === 'All' || client.clientType === filterType;
    
    // Apply Quote/Contract/Job/Work Order filters
    let matchesQuoteFilter = true;
    let matchesContractFilter = true;
    let matchesJobFilter = true;
    let matchesWorkOrderFilter = true;
    let matchesDraftFilter = true;
    let matchesSentFilter = true;
    let matchesReceivedFilter = true;
    let matchesAcceptedFilter = true;
    let matchesRejectedFilter = true;
    let matchesSignedFilter = true;
    
    if (filterHasQuote) {
      matchesQuoteFilter = client.quotes && client.quotes.length > 0;
    }
    
    if (filterHasContract) {
      // A contract is a quote that has been accepted
      matchesContractFilter = client.quotes && client.quotes.some(q => q.status === 'Accepted');
    }
    
    if (filterHasJob) {
      matchesJobFilter = client.jobs && client.jobs.length > 0;
    }
    
    if (filterHasWorkOrder) {
      // Work orders would be tracked separately - for now we'll assume any job could have work orders
      // You can modify this logic based on how work orders are tracked in your actual data
      matchesWorkOrderFilter = client.jobs && client.jobs.length > 0;
    }
    
    if (filterDraft) {
      matchesDraftFilter = client.quotes && client.quotes.some(q => q.status === 'Draft');
    }
    
    if (filterSent) {
      matchesSentFilter = client.quotes && client.quotes.some(q => q.status === 'Sent');
    }
    
    if (filterReceived) {
      // Received could be mapped to a specific status if you track it
      matchesReceivedFilter = client.quotes && client.quotes.some(q => q.status === 'Sent');
    }
    
    if (filterAccepted) {
      matchesAcceptedFilter = client.quotes && client.quotes.some(q => q.status === 'Accepted');
    }
    
    if (filterRejected) {
      matchesRejectedFilter = client.quotes && client.quotes.some(q => q.status === 'Declined');
    }
    
    if (filterSigned) {
      // Signed would typically be contracts (accepted quotes)
      matchesSignedFilter = client.quotes && client.quotes.some(q => q.status === 'Accepted');
    }
    
    return matchesSearch && matchesFilter && matchesQuoteFilter && matchesContractFilter && matchesJobFilter && matchesWorkOrderFilter && matchesDraftFilter && matchesSentFilter && matchesReceivedFilter && matchesAcceptedFilter && matchesRejectedFilter && matchesSignedFilter;
  });

  const tabs: TabType[] = ['Overview', 'Contacts', 'Properties', 'Jobs & Quotes', 'Communication', 'Files & Photos', 'Billing'];

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#1A1A1A', overflow: 'hidden' }}>
      <SidebarEnhanced activePage="Clients" darkMode={true} onNavigate={onNavigate} />

      {/* Main Content - Two Column Layout */}
      <div style={{ 
        flex: 1, 
        display: 'flex',
        marginLeft: '200px', 
        backgroundColor: '#262626',
        overflow: 'auto'
      }}>
        
        {/* LEFT COLUMN - Clients List */}
        <div style={{
          width: '400px',
          minWidth: '400px',
          backgroundColor: '#2D2D2D',
          borderRight: '1px solid #3D3D3D',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #3D3D3D',
            backgroundColor: '#2D2D2D'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ color: '#FFFFFF', fontSize: '22px', fontWeight: 'bold', margin: 0 }}>
                Clients
              </h2>
              <GoldButton icon={Plus} size="sm" onClick={() => setShowNewClientModal(true)}>
                New Client
              </GoldButton>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <Search 
                size={16} 
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
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 38px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #444',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Filter Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '6px',
              flexWrap: 'wrap',
              marginBottom: '12px'
            }}>
              {(['All', 'Homeowner', 'Contractor', 'Designer', 'Property Manager'] as const).map((type) => {
                const isActive = filterType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: isActive ? '#C9A049' : '#1A1A1A',
                      color: isActive ? '#FFFFFF' : '#A0A0A0',
                      transition: 'all 0.15s',
                      boxShadow: isActive ? '0 2px 8px rgba(201,160,73,0.3)' : 'none'
                    }}
                  >
                    {type}
                  </button>
                );
              })}
            </div>

            {/* Checkbox Filters */}
            <div style={{
              backgroundColor: '#1A1A1A',
              border: '1px solid #444',
              borderRadius: '10px',
              padding: '12px'
            }}>
              <div style={{ 
                color: '#C9A049', 
                fontSize: '11px', 
                fontWeight: '600', 
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Filter by Stage
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: '#E0E0E0',
                  fontSize: '12px',
                  userSelect: 'none'
                }}>
                  <input
                    type="checkbox"
                    checked={filterHasQuote}
                    onChange={(e) => setFilterHasQuote(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                      accentColor: '#C9A049'
                    }}
                  />
                  Quote
                </label>
                
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: '#E0E0E0',
                  fontSize: '12px',
                  userSelect: 'none'
                }}>
                  <input
                    type="checkbox"
                    checked={filterHasContract}
                    onChange={(e) => setFilterHasContract(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                      accentColor: '#C9A049'
                    }}
                  />
                  Contract
                </label>
                
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: '#E0E0E0',
                  fontSize: '12px',
                  userSelect: 'none'
                }}>
                  <input
                    type="checkbox"
                    checked={filterHasJob}
                    onChange={(e) => setFilterHasJob(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                      accentColor: '#C9A049'
                    }}
                  />
                  Job
                </label>
                
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: '#E0E0E0',
                  fontSize: '12px',
                  userSelect: 'none'
                }}>
                  <input
                    type="checkbox"
                    checked={filterHasWorkOrder}
                    onChange={(e) => setFilterHasWorkOrder(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                      accentColor: '#C9A049'
                    }}
                  />
                  Work Order
                </label>
                
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: '#E0E0E0',
                  fontSize: '12px',
                  userSelect: 'none'
                }}>
                  <input
                    type="checkbox"
                    checked={filterDraft}
                    onChange={(e) => setFilterDraft(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                      accentColor: '#C9A049'
                    }}
                  />
                  Draft
                </label>
                
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: '#E0E0E0',
                  fontSize: '12px',
                  userSelect: 'none'
                }}>
                  <input
                    type="checkbox"
                    checked={filterSent}
                    onChange={(e) => setFilterSent(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                      accentColor: '#C9A049'
                    }}
                  />
                  Sent
                </label>
                
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: '#E0E0E0',
                  fontSize: '12px',
                  userSelect: 'none'
                }}>
                  <input
                    type="checkbox"
                    checked={filterReceived}
                    onChange={(e) => setFilterReceived(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                      accentColor: '#C9A049'
                    }}
                  />
                  Received
                </label>
                
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: '#E0E0E0',
                  fontSize: '12px',
                  userSelect: 'none'
                }}>
                  <input
                    type="checkbox"
                    checked={filterAccepted}
                    onChange={(e) => setFilterAccepted(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                      accentColor: '#C9A049'
                    }}
                  />
                  Accepted
                </label>
                
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: '#E0E0E0',
                  fontSize: '12px',
                  userSelect: 'none'
                }}>
                  <input
                    type="checkbox"
                    checked={filterRejected}
                    onChange={(e) => setFilterRejected(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                      accentColor: '#C9A049'
                    }}
                  />
                  Rejected
                </label>
                
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: '#E0E0E0',
                  fontSize: '12px',
                  userSelect: 'none'
                }}>
                  <input
                    type="checkbox"
                    checked={filterSigned}
                    onChange={(e) => setFilterSigned(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                      accentColor: '#C9A049'
                    }}
                  />
                  Signed
                </label>
              </div>
            </div>
          </div>

          {/* Clients List */}
          <div style={{ flex: 1, overflowY: 'auto' }} className="vertical-scroll">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => {
                  setSelectedClient(client);
                  setActiveTab('Overview');
                }}
                style={{
                  padding: '16px 20px',
                  margin: '8px 12px',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  backgroundColor: selectedClient?.id === client.id ? '#3D3D3D' : 'transparent',
                  border: selectedClient?.id === client.id ? '2px solid #C9A049' : '2px solid #2D2D2D',
                  transition: 'all 0.15s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (selectedClient?.id !== client.id) {
                    e.currentTarget.style.backgroundColor = '#353535';
                    e.currentTarget.style.borderColor = '#3D3D3D';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedClient?.id !== client.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#2D2D2D';
                  }
                }}
              >
                {/* Region Badge - Upper Right */}
                {client.properties.length > 0 && client.properties[0].region && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: '#4F6A41',
                    color: '#FFFFFF',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '10px',
                    fontWeight: '600',
                    boxShadow: '0 2px 0 0 #3D5531, 0 2px 6px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <MapPin size={10} />
                    {client.properties[0].region}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <img 
                    src={client.avatar}
                    alt={`Property for ${formatClientName(client)}`}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '2px solid #C9A049'
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      color: '#FFFFFF', 
                      fontSize: '14px', 
                      fontWeight: '600',
                      marginBottom: '6px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {formatClientName(client)}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <AccountTypeChip type={client.clientType} size="sm" />
                      <StatusChip status={client.status} size="sm" />
                    </div>

                    <div style={{ 
                      color: '#A0A0A0', 
                      fontSize: '12px',
                      marginBottom: '4px'
                    }}>
                      {client.primaryContact.firstName} {client.primaryContact.lastName} — {client.primaryContact.phones[0]}
                    </div>

                    {client.properties.length > 0 && (
                      <div style={{ 
                        color: '#888', 
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <MapPin size={11} />
                        {client.properties[0].city} – {client.properties[0].address}
                      </div>
                    )}

                    {client.tags.length > 0 && (
                      <div style={{ 
                        display: 'flex', 
                        gap: '4px', 
                        marginTop: '8px',
                        flexWrap: 'wrap'
                      }}>
                        {client.tags.slice(0, 2).map((tag) => (
                          <TagChip key={tag} label={tag} />
                        ))}
                      </div>
                    )}

                    <div style={{ 
                      color: '#666', 
                      fontSize: '11px',
                      marginTop: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Clock size={10} />
                      {client.lastActivity}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN - Client Detail View */}
        <div style={{
          flex: 1,
          backgroundColor: '#262626',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {selectedClient ? (
            <>
              {/* Client Header */}
              <div style={{
                padding: '24px 32px',
                borderBottom: '1px solid #3D3D3D',
                backgroundColor: '#2D2D2D'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <h1 style={{ color: '#FFFFFF', fontSize: '26px', fontWeight: 'bold', margin: '0 0 12px 0' }}>
                      {formatClientName(selectedClient)}
                    </h1>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <AccountTypeChip type={selectedClient.clientType} />
                      <StatusChip status={selectedClient.status} />
                      {selectedClient.pricingTier && (
                        <span style={{
                          padding: '5px 14px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#FFFFFF',
                          backgroundColor: '#6E8B3D',
                          boxShadow: '0 2px 0 0 #6E8B3DCC'
                        }}>
                          {selectedClient.pricingTier}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {selectedClient.tags.map((tag) => (
                        <TagChip key={tag} label={tag} />
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: '#C9A049',
                        color: '#FFFFFF',
                        border: 'none',
                        transition: 'all 0.15s'
                      }}
                    >
                      <FileText size={14} />
                      New Quote
                    </button>
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                        color: '#C9A049',
                        border: '1px solid #C9A049',
                        transition: 'all 0.15s'
                      }}
                    >
                      <Calendar size={14} />
                      Schedule
                    </button>
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                        color: '#C9A049',
                        border: '1px solid #C9A049',
                        transition: 'all 0.15s'
                      }}
                    >
                      <Briefcase size={14} />
                      New Job
                    </button>
                    <IconButton icon={ExternalLink} color="#3B9CAA" tooltip="Client Portal" />
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div style={{
                display: 'flex',
                gap: '0',
                borderBottom: '2px solid #3D3D3D',
                backgroundColor: '#2D2D2D',
                paddingLeft: '32px',
                paddingRight: '32px',
                position: 'sticky',
                top: 0,
                zIndex: 100
              }}>
                {tabs.map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: '14px 20px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: isActive ? '2px solid #C9A049' : '2px solid transparent',
                        color: isActive ? '#C9A049' : '#A0A0A0',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.24s ease-out',
                        position: 'relative',
                        marginBottom: '-2px'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.color = '#E0E0E0';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.color = '#A0A0A0';
                      }}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }} className="vertical-scroll">
                {/* OVERVIEW TAB */}
                {activeTab === 'Overview' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    {/* Account Summary Card */}
                    <div style={{
                      backgroundColor: '#2D2D2D',
                      borderRadius: '14px',
                      padding: '20px',
                      border: '1px solid #3D3D3D'
                    }}>
                      <h3 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                        Account Summary
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#A0A0A0', fontSize: '13px' }}>Account Type</span>
                          <AccountTypeChip type={selectedClient.clientType} size="sm" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#A0A0A0', fontSize: '13px' }}>Status</span>
                          <StatusChip status={selectedClient.status} size="sm" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#A0A0A0', fontSize: '13px' }}>Lead Source</span>
                          <span style={{ color: '#FFFFFF', fontSize: '13px' }}>{selectedClient.leadSource}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#A0A0A0', fontSize: '13px' }}>Assigned Manager</span>
                          <span style={{ color: '#FFFFFF', fontSize: '13px' }}>{selectedClient.assignedManager}</span>
                        </div>
                        {selectedClient.pricingTier && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#A0A0A0', fontSize: '13px' }}>Pricing Tier</span>
                            <span style={{ color: '#C9A049', fontSize: '13px', fontWeight: '600' }}>{selectedClient.pricingTier}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Primary Contact Card */}
                    <div style={{
                      backgroundColor: '#2D2D2D',
                      borderRadius: '14px',
                      padding: '20px',
                      border: '1px solid #3D3D3D'
                    }}>
                      <h3 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                        Primary Contact
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <div style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
                            {selectedClient.primaryContact.firstName} {selectedClient.primaryContact.lastName}
                          </div>
                          <div style={{ color: '#A0A0A0', fontSize: '12px' }}>
                            {selectedClient.primaryContact.role}
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Phone size={14} color="#7BAA8E" />
                          <span style={{ color: '#E0E0E0', fontSize: '13px' }}>
                            {selectedClient.primaryContact.phones[0]}
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Mail size={14} color="#7BAA8E" />
                          <span style={{ color: '#E0E0E0', fontSize: '13px' }}>
                            {selectedClient.primaryContact.emails[0]}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                          {selectedClient.primaryContact.receiveSMS && (
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              backgroundColor: '#3D3D3D',
                              color: '#7BAA8E'
                            }}>
                              SMS Enabled
                            </span>
                          )}
                          {selectedClient.primaryContact.portalAccess && (
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              backgroundColor: '#3D3D3D',
                              color: '#C9A049'
                            }}>
                              Portal Access
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats Card */}
                    <div style={{
                      backgroundColor: '#2D2D2D',
                      borderRadius: '14px',
                      padding: '20px',
                      border: '1px solid #3D3D3D',
                      gridColumn: 'span 2'
                    }}>
                      <h3 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
                        Quick Stats
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: '#A0A0A0', fontSize: '12px', marginBottom: '6px' }}>Properties</div>
                          <div style={{ color: '#FFFFFF', fontSize: '28px', fontWeight: 'bold' }}>
                            {selectedClient.properties.length}
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: '#A0A0A0', fontSize: '12px', marginBottom: '6px' }}>Jobs</div>
                          <div style={{ color: '#FFFFFF', fontSize: '28px', fontWeight: 'bold' }}>
                            {selectedClient.jobs.length}
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: '#A0A0A0', fontSize: '12px', marginBottom: '6px' }}>Quotes</div>
                          <div style={{ color: '#FFFFFF', fontSize: '28px', fontWeight: 'bold' }}>
                            {selectedClient.quotes.length}
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: '#A0A0A0', fontSize: '12px', marginBottom: '6px' }}>Lifetime Value</div>
                          <div style={{ color: '#4CAF50', fontSize: '28px', fontWeight: 'bold' }}>
                            ${(selectedClient.lifetimeValue / 1000).toFixed(0)}K
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Photo Carousel Card */}
                    {selectedClient.photos && selectedClient.photos.length > 0 && (
                      <div style={{
                        backgroundColor: '#2D2D2D',
                        borderRadius: '14px',
                        padding: '20px',
                        border: '1px solid #3D3D3D',
                        gridColumn: 'span 2'
                      }}>
                        <h3 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                          Project Photos ({selectedClient.photos.length})
                        </h3>
                        <PhotoCarousel photos={selectedClient.photos} clientName={formatClientName(selectedClient)} />
                      </div>
                    )}
                  </div>
                )}

                {/* CONTACTS TAB */}
                {activeTab === 'Contacts' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                        All Contacts ({selectedClient.contacts.length})
                      </h3>
                      <GoldButton icon={Plus} onClick={() => setShowAddContactModal(true)}>
                        Add Contact
                      </GoldButton>
                    </div>

                    <div style={{ backgroundColor: '#2D2D2D', borderRadius: '14px', overflow: 'hidden', border: '1px solid #3D3D3D' }}>
                      {/* Table Header */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1.5fr 2fr 2fr 1fr 140px 100px',
                        padding: '14px 20px',
                        backgroundColor: '#1A1A1A',
                        borderBottom: '1px solid #3D3D3D'
                      }}>
                        <div style={{ color: '#A0A0A0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Name</div>
                        <div style={{ color: '#A0A0A0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Role</div>
                        <div style={{ color: '#A0A0A0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Phone</div>
                        <div style={{ color: '#A0A0A0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Email</div>
                        <div style={{ color: '#A0A0A0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Primary</div>
                        <div style={{ color: '#A0A0A0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Access</div>
                        <div style={{ color: '#A0A0A0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Actions</div>
                      </div>

                      {/* Table Rows */}
                      {selectedClient.contacts.map((contact) => (
                        <div 
                          key={contact.id}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1.5fr 2fr 2fr 1fr 140px 100px',
                            padding: '16px 20px',
                            borderBottom: '1px solid #3D3D3D',
                            alignItems: 'center'
                          }}
                        >
                          <div style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '500' }}>
                            {contact.firstName} {contact.lastName}
                          </div>
                          <div style={{ color: '#A0A0A0', fontSize: '12px' }}>{contact.role}</div>
                          <div style={{ color: '#E0E0E0', fontSize: '12px' }}>{contact.phones[0]}</div>
                          <div style={{ color: '#E0E0E0', fontSize: '12px' }}>{contact.emails[0]}</div>
                          <div>
                            {contact.isPrimary && (
                              <CheckCircle2 size={16} color="#4CAF50" />
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
                            {contact.receiveSMS && (
                              <span style={{ color: '#7BAA8E' }}>SMS</span>
                            )}
                            {contact.portalAccess && (
                              <span style={{ color: '#C9A049' }}>Portal</span>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <IconButton icon={Pencil} color="#C9A049" tooltip="Edit" />
                            <IconButton icon={Trash2} color="#D9534F" tooltip="Delete" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PROPERTIES TAB */}
                {activeTab === 'Properties' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                        Properties ({selectedClient.properties.length})
                      </h3>
                      <GoldButton icon={Plus} onClick={() => setShowAddPropertyModal(true)}>
                        Add Property
                      </GoldButton>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
                      {selectedClient.properties.map((property) => (
                        <div
                          key={property.id}
                          style={{
                            backgroundColor: '#2D2D2D',
                            border: '1px solid #3D3D3D',
                            borderRadius: '14px',
                            padding: '20px',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#C9A049';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(201,160,73,0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#3D3D3D';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div>
                              {property.nickname && (
                                <div style={{ color: '#C9A049', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                                  {property.nickname}
                                </div>
                              )}
                              <div style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: '600' }}>
                                {property.address}
                              </div>
                              <div style={{ color: '#A0A0A0', fontSize: '13px' }}>
                                {property.city}, {property.state} {property.zip}
                              </div>
                            </div>
                            <Home size={20} color="#7BAA8E" />
                          </div>

                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ color: '#A0A0A0', fontSize: '12px', marginBottom: '4px' }}>Region</div>
                            <div style={{ color: '#E0E0E0', fontSize: '13px' }}>{property.region}</div>
                          </div>

                          {property.notes && (
                            <div style={{ marginBottom: '12px' }}>
                              <div style={{ color: '#A0A0A0', fontSize: '12px', marginBottom: '4px' }}>Notes</div>
                              <div style={{ color: '#E0E0E0', fontSize: '12px', lineHeight: '1.5' }}>{property.notes}</div>
                            </div>
                          )}

                          {property.tags.length > 0 && (
                            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
                              {property.tags.map((tag) => (
                                <TagChip key={tag} label={tag} />
                              ))}
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid #3D3D3D' }}>
                            <GoldButton icon={Calendar} size="sm" variant="secondary" fullWidth>
                              Schedule Visit
                            </GoldButton>
                            <GoldButton icon={FileText} size="sm" variant="secondary" fullWidth>
                              New Quote
                            </GoldButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* JOBS & QUOTES TAB */}
                {activeTab === 'Jobs & Quotes' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Jobs Section */}
                    <div>
                      <h3 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                        Jobs ({selectedClient.jobs.length})
                      </h3>
                      <div style={{ backgroundColor: '#2D2D2D', borderRadius: '14px', border: '1px solid #3D3D3D', maxHeight: '400px', overflowX: 'auto', overflowY: 'auto' }}>
                        {/* Header */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '120px 1fr 140px 140px 140px 100px 120px 100px',
                          padding: '14px 20px',
                          backgroundColor: '#1A1A1A',
                          borderBottom: '1px solid #3D3D3D',
                          minWidth: '1000px'
                        }}>
                          <div style={{ color: '#A0A0A0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Job #</div>
                          <div style={{ color: '#A0A0A0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Property</div>
                          <div style={{ color: '#A0A0A0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Status</div>
                          <div style={{ color: '#A0A0A0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Foreman</div>
                          <div style={{ color: '#A0A0A0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Dates</div>
                          <div style={{ color: '#A0A0A0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Revenue</div>
                          <div style={{ color: '#A0A0A0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Progress</div>
                          <div style={{ color: '#A0A0A0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Actions</div>
                        </div>

                        {/* Rows */}
                        {selectedClient.jobs.map((job) => {
                          const property = selectedClient.properties.find(p => p.id === job.propertyId);
                          return (
                            <div 
                              key={job.id}
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '120px 1fr 140px 140px 140px 100px 120px 100px',
                                padding: '16px 20px',
                                borderBottom: '1px solid #3D3D3D',
                                alignItems: 'center',
                                minWidth: '1000px'
                              }}
                            >
                              <div style={{ color: '#C9A049', fontSize: '13px', fontWeight: '600' }}>{job.jobNumber}</div>
                              <div style={{ color: '#E0E0E0', fontSize: '12px' }}>{property?.address}</div>
                              <div><StatusChip status={job.status} size="sm" /></div>
                              <div style={{ color: '#A0A0A0', fontSize: '12px' }}>{job.assignedForeman}</div>
                              <div style={{ color: '#E0E0E0', fontSize: '11px' }}>
                                {new Date(job.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(job.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                              <div style={{ color: '#4CAF50', fontSize: '13px', fontWeight: '600' }}>
                                ${(job.revenue / 1000).toFixed(1)}K
                              </div>
                              <div>
                                <div style={{ 
                                  height: '6px', 
                                  backgroundColor: '#3D3D3D', 
                                  borderRadius: '3px',
                                  overflow: 'hidden',
                                  marginBottom: '4px'
                                }}>
                                  <div style={{
                                    height: '100%',
                                    width: `${job.progress}%`,
                                    backgroundColor: '#C9A049',
                                    transition: 'width 0.3s'
                                  }} />
                                </div>
                                <div style={{ color: '#A0A0A0', fontSize: '10px', textAlign: 'center' }}>{job.progress}%</div>
                              </div>
                              <div>
                                <IconButton icon={Eye} color="#3B9CAA" tooltip="View Job" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quotes Section */}
                    <div>
                      <h3 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                        Quotes ({selectedClient.quotes.length})
                      </h3>
                      <div style={{ backgroundColor: '#2D2D2D', borderRadius: '14px', border: '1px solid #3D3D3D', maxHeight: '400px', overflowX: 'auto', overflowY: 'auto' }}>
                        {/* Header */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '120px 1fr 140px 120px 140px 100px',
                          padding: '14px 20px',
                          backgroundColor: '#1A1A1A',
                          borderBottom: '1px solid #3D3D3D',
                          minWidth: '800px'
                        }}>
                          <div style={{ color: '#A0A0A0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Quote #</div>
                          <div style={{ color: '#A0A0A0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Property</div>
                          <div style={{ color: '#A0A0A0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Status</div>
                          <div style={{ color: '#A0A0A0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Amount</div>
                          <div style={{ color: '#A0A0A0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Date</div>
                          <div style={{ color: '#A0A0A0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Actions</div>
                        </div>

                        {/* Rows */}
                        {selectedClient.quotes.map((quote) => {
                          const property = selectedClient.properties.find(p => p.id === quote.propertyId);
                          return (
                            <div 
                              key={quote.id}
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '120px 1fr 140px 120px 140px 100px',
                                padding: '16px 20px',
                                borderBottom: '1px solid #3D3D3D',
                                alignItems: 'center',
                                minWidth: '800px'
                              }}
                            >
                              <div style={{ color: '#6E8B3D', fontSize: '13px', fontWeight: '600' }}>{quote.quoteNumber}</div>
                              <div style={{ color: '#E0E0E0', fontSize: '12px' }}>{property?.address || 'N/A'}</div>
                              <div><StatusChip status={quote.status} size="sm" /></div>
                              <div style={{ color: '#4CAF50', fontSize: '13px', fontWeight: '600' }}>
                                ${(quote.amount / 1000).toFixed(1)}K
                              </div>
                              <div style={{ color: '#E0E0E0', fontSize: '12px' }}>
                                {new Date(quote.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                              <div>
                                <IconButton icon={Eye} color="#6E8B3D" tooltip="View Quote" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* COMMUNICATION TAB */}
                {activeTab === 'Communication' && (
                  <div style={{ textAlign: 'center', paddingTop: '60px' }}>
                    <MessageSquare size={48} color="#A0A0A0" style={{ marginBottom: '16px', marginLeft: 'auto', marginRight: 'auto' }} />
                    <h3 style={{ color: '#FFFFFF', fontSize: '18px', marginBottom: '8px' }}>Communication Hub</h3>
                    <p style={{ color: '#A0A0A0', fontSize: '14px', marginBottom: '24px' }}>
                      View all calls, texts, emails, and notes related to this client.
                    </p>
                    <div style={{ color: '#666', fontSize: '13px' }}>
                      Integrates with AI receptionist + call recording system (Coming soon)
                    </div>
                  </div>
                )}

                {/* FILES & PHOTOS TAB */}
                {activeTab === 'Files & Photos' && (
                  <div style={{ textAlign: 'center', paddingTop: '60px' }}>
                    <Camera size={48} color="#3B9CAA" style={{ marginBottom: '16px', marginLeft: 'auto', marginRight: 'auto' }} />
                    <h3 style={{ color: '#FFFFFF', fontSize: '18px', marginBottom: '8px' }}>Files & Photos</h3>
                    <p style={{ color: '#A0A0A0', fontSize: '14px', marginBottom: '24px' }}>
                      Connected to your Boardroom Camera System
                    </p>
                    <GoldButton icon={Camera}>View Photo Library</GoldButton>
                  </div>
                )}

                {/* BILLING TAB */}
                {activeTab === 'Billing' && (
                  <div style={{ textAlign: 'center', paddingTop: '60px' }}>
                    <CreditCard size={48} color="#C9A049" style={{ marginBottom: '16px', marginLeft: 'auto', marginRight: 'auto' }} />
                    <h3 style={{ color: '#FFFFFF', fontSize: '18px', marginBottom: '8px' }}>Billing & Payments</h3>
                    <p style={{ color: '#A0A0A0', fontSize: '14px', marginBottom: '24px' }}>
                      View invoices, payments, credits, and aging summary
                    </p>
                    <div style={{ color: '#666', fontSize: '13px' }}>
                      Billing integration coming soon
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Empty State
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#A0A0A0'
            }}>
              <Users size={64} color="#444" style={{ marginBottom: '20px' }} />
              <h3 style={{ fontSize: '20px', marginBottom: '8px', color: '#E0E0E0' }}>
                Select a Client
              </h3>
              <p style={{ fontSize: '14px' }}>
                Choose a client from the list to view their details
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Contact Modal */}
      <Modal 
        isOpen={showAddContactModal} 
        onClose={() => setShowAddContactModal(false)}
        title="Add Contact"
        width="600px"
      >
        <FormField label="First Name" required>
          <TextInput placeholder="Enter first name" />
        </FormField>
        <FormField label="Last Name" required>
          <TextInput placeholder="Enter last name" />
        </FormField>
        <FormField label="Role" required>
          <Select options={[
            { value: 'homeowner', label: 'Homeowner' },
            { value: 'spouse', label: 'Spouse' },
            { value: 'gc', label: 'General Contractor' },
            { value: 'pm', label: 'Project Manager' },
            { value: 'designer', label: 'Designer' }
          ]} />
        </FormField>
        <FormField label="Phone">
          <TextInput placeholder="(555) 555-5555" type="tel" />
        </FormField>
        <FormField label="Email">
          <TextInput placeholder="email@example.com" type="email" />
        </FormField>
        <FormField label="Preferred Contact Method">
          <Select options={[
            { value: 'phone', label: 'Phone' },
            { value: 'email', label: 'Email' },
            { value: 'sms', label: 'SMS' }
          ]} />
        </FormField>
        
        <div style={{ marginBottom: '20px' }}>
          <Toggle checked={false} onChange={() => {}} label="Primary Contact" />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <Toggle checked={true} onChange={() => {}} label="Receive SMS Notifications" />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <Toggle checked={true} onChange={() => {}} label="Receive Email Updates" />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <Toggle checked={false} onChange={() => {}} label="Client Portal Access" />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <GoldButton variant="ghost" onClick={() => setShowAddContactModal(false)}>
            Cancel
          </GoldButton>
          <GoldButton onClick={() => setShowAddContactModal(false)}>
            Add Contact
          </GoldButton>
        </div>
      </Modal>

      {/* Add Property Modal */}
      <Modal 
        isOpen={showAddPropertyModal} 
        onClose={() => setShowAddPropertyModal(false)}
        title="Add Property"
        width="600px"
      >
        <FormField label="Address" required>
          <TextInput placeholder="123 Main Street" />
        </FormField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', color: '#E0E0E0', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
              City <span style={{ color: '#F44336' }}>*</span>
            </label>
            <TextInput placeholder="City" fullWidth />
          </div>
          <div>
            <label style={{ display: 'block', color: '#E0E0E0', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
              State <span style={{ color: '#F44336' }}>*</span>
            </label>
            <TextInput placeholder="WA" fullWidth />
          </div>
          <div>
            <label style={{ display: 'block', color: '#E0E0E0', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
              ZIP <span style={{ color: '#F44336' }}>*</span>
            </label>
            <TextInput placeholder="99201" fullWidth />
          </div>
        </div>
        <FormField label="Region">
          <Select options={[
            { value: 'north', label: 'North Spokane' },
            { value: 'south', label: 'South Hill' },
            { value: 'downtown', label: 'Downtown' },
            { value: 'valley', label: 'Spokane Valley' }
          ]} />
        </FormField>
        <FormField label="Nickname (Optional)">
          <TextInput placeholder="e.g., Primary Residence, Lake House" />
        </FormField>
        <FormField label="Property Type">
          <Select options={[
            { value: 'primary', label: 'Primary' },
            { value: 'rental', label: 'Rental' },
            { value: 'commercial', label: 'Commercial' }
          ]} />
        </FormField>
        <FormField label="Notes">
          <TextArea placeholder="Floor type, obstacles, pets, HOA rules, access instructions..." rows={3} />
        </FormField>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <GoldButton variant="ghost" onClick={() => setShowAddPropertyModal(false)}>
            Cancel
          </GoldButton>
          <GoldButton onClick={() => setShowAddPropertyModal(false)}>
            Add Property
          </GoldButton>
        </div>
      </Modal>

      {/* New Client Modal */}
      <BoardroomNewClientModal 
        isOpen={showNewClientModal}
        onClose={() => setShowNewClientModal(false)}
        onSave={() => {
          console.log('Client saved');
          setShowNewClientModal(false);
        }}
        onSaveAndSchedule={() => {
          console.log('Client saved, opening schedule modal');
          setShowNewClientModal(false);
          // TODO: Open schedule modal
        }}
        onSaveAndQuote={() => {
          console.log('Client saved, opening quote page');
          setShowNewClientModal(false);
          // TODO: Navigate to quotes page
        }}
      />

      {/* Custom Scrollbar Styles */}
      <style>{`
        .vertical-scroll::-webkit-scrollbar {
          width: 10px;
        }
        
        .vertical-scroll::-webkit-scrollbar-track {
          background: #1A1A1A;
          border-radius: 5px;
        }
        
        .vertical-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #C9A049 0%, #A88438 100%);
          border-radius: 5px;
          border: 2px solid #1A1A1A;
        }
        
        .vertical-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #D9B563 0%, #C9A049 100%);
        }
      `}</style>
    </div>
  );
}
