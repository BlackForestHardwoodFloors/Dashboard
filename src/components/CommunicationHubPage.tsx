/**
 * Communication Hub - Boardroom 360
 * 
 * Unified communication center for emails, SMS, and all messaging
 * with templates, scheduling, automations, and CRM integration.
 */

import { useState, useEffect } from 'react';
import {
  Inbox,
  PenSquare,
  FileText,
  Calendar,
  Repeat,
  Users,
  BarChart3,
  Settings,
  Search,
  Filter,
  Mail,
  MessageSquare,
  Phone,
  Star,
  Trash2,
  Archive,
  MoreVertical,
  ChevronDown,
  Paperclip,
  Send,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Info,
  Sparkles,
  Link,
  Eye,
  MousePointer,
  Building2,
  User,
  UserPlus,
  Truck,
  X,
  Plus,
  Zap,
  Bell,
  HelpCircle,
  Car
} from 'lucide-react';
import { SidebarEnhanced } from './SidebarEnhanced';
import DriveTimeSettings from './DriveTimeSettings';

// ============ TYPES ============

type Section = 'inbox' | 'compose' | 'templates' | 'scheduled' | 'automations' | 'segments' | 'analytics' | 'settings';
type Channel = 'email' | 'sms' | 'all';
type Audience = 'employees' | 'customers' | 'leads' | 'vendors' | 'all';
type MessageStatus = 'sent' | 'delivered' | 'read' | 'clicked' | 'failed' | 'pending' | 'scheduled';

interface Message {
  id: string;
  channel: 'email' | 'sms';
  direction: 'inbound' | 'outbound';
  audience: 'employees' | 'customers' | 'leads' | 'vendors';
  contactId: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  subject?: string;
  preview: string;
  fullContent: string;
  timestamp: string;
  status: MessageStatus;
  isRead: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
  linkedTo?: {
    type: 'job' | 'invoice' | 'quote';
    id: string;
    name: string;
  };
}

interface Template {
  id: string;
  name: string;
  channel: 'email' | 'sms';
  audience: Audience;
  category: string;
  subject?: string;
  content: string;
  mergeTags: string[];
  isDefault: boolean;
}

interface CommunicationHubPageProps {
  onNavigate?: (page: string) => void;
}

// ============ TOOLTIP COMPONENT ============

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'right' | 'top' | 'bottom';
}

function Tooltip({ text, children, position = 'right' }: TooltipProps) {
  const [show, setShow] = useState(false);

  const positionStyles: Record<string, React.CSSProperties> = {
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' },
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px' }
  };

  return (
    <div 
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div style={{
          position: 'absolute',
          ...positionStyles[position],
          backgroundColor: '#1E1E1E',
          color: '#FFFFFF',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          border: '1px solid #3D3D3D'
        }}>
          {text}
        </div>
      )}
    </div>
  );
}

// ============ MAIN COMPONENT ============

export default function CommunicationHubPage({ onNavigate }: CommunicationHubPageProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState<Section>('inbox');
  const [channelFilter, setChannelFilter] = useState<Channel>('all');
  const [audienceFilter, setAudienceFilter] = useState<Audience>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showComposeModal, setShowComposeModal] = useState(false);
  
  // Employees for Drive-Time Settings
  const [employees, setEmployees] = useState<Array<{
    id: number;
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
  }>>([]);

  // Fetch employees for Drive-Time Settings
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_URL}/employee/get-employee`, {
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json' 
          }
        });
        if (response.ok) {
          const data = await response.json();
          const employeesList = data.data?.employee || data.employee || data || [];
          if (Array.isArray(employeesList)) {
            setEmployees(employeesList.filter((e: any) => 
              e.portalStatus === 'Active' || !e.portalStatus
            ));
          }
        }
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };
    fetchEmployees();
  }, []);

  // Theme colors
  const bgColor = darkMode ? '#1E1E1E' : '#F5F5F5';
  const cardBg = darkMode ? '#2D2D2D' : '#FFFFFF';
  const sidebarBg = darkMode ? '#252525' : '#FAFAFA';
  const textColor = darkMode ? '#FFFFFF' : '#1E1E1E';
  const textMuted = darkMode ? '#A0A0A0' : '#666666';
  const borderColor = darkMode ? '#3D3D3D' : '#E5E5E5';
  const accentColor = '#5C6BC0';
  const hoverBg = darkMode ? '#3D3D3D' : '#F0F0F0';

  // Channel & Audience colors
  const channelColors = {
    email: '#42A5F5',
    sms: '#66BB6A'
  };

  const audienceColors = {
    employees: '#9C27B0',
    customers: '#42A5F5',
    leads: '#FF9800',
    vendors: '#66BB6A'
  };

  const statusColors: Record<MessageStatus, string> = {
    sent: '#42A5F5',
    delivered: '#66BB6A',
    read: '#9C27B0',
    clicked: accentColor,
    failed: '#EF5350',
    pending: '#FF9800',
    scheduled: '#78909C'
  };

  // Mock data
  const messages: Message[] = [
    {
      id: '1',
      channel: 'email',
      direction: 'inbound',
      audience: 'customers',
      contactId: 'C-1052',
      contactName: 'John Anderson',
      contactEmail: 'john@anderson.com',
      subject: 'Re: Flooring Installation Quote',
      preview: 'Thank you for the detailed quote. We would like to proceed with the installation next week...',
      fullContent: 'Thank you for the detailed quote. We would like to proceed with the installation next week. Please let me know what dates work best for your team.',
      timestamp: '10:30 AM',
      status: 'read',
      isRead: false,
      isStarred: true,
      hasAttachment: false,
      linkedTo: { type: 'quote', id: 'Q-2341', name: 'Quote #2341' }
    },
    {
      id: '2',
      channel: 'sms',
      direction: 'outbound',
      audience: 'employees',
      contactId: 'E-104',
      contactName: 'Mike Thompson',
      contactPhone: '+1 (555) 234-5678',
      preview: 'Daily reminder: Check in when you arrive at the Martinez job site. Address: 1234 Oak Street.',
      fullContent: 'Daily reminder: Check in when you arrive at the Martinez job site. Address: 1234 Oak Street. Expected completion: 5 PM.',
      timestamp: '8:00 AM',
      status: 'delivered',
      isRead: true,
      isStarred: false,
      hasAttachment: false
    },
    {
      id: '3',
      channel: 'email',
      direction: 'outbound',
      audience: 'vendors',
      contactId: 'V-089',
      contactName: 'Oak Valley Supplies',
      contactEmail: 'orders@oakvalley.com',
      subject: 'Order Confirmation Request - PO #45892',
      preview: 'Please confirm receipt of our order for 500 sq ft of Red Oak hardwood flooring...',
      fullContent: 'Please confirm receipt of our order for 500 sq ft of Red Oak hardwood flooring. We need delivery by Friday.',
      timestamp: '9:15 AM',
      status: 'sent',
      isRead: true,
      isStarred: false,
      hasAttachment: true
    },
    {
      id: '4',
      channel: 'sms',
      direction: 'inbound',
      audience: 'leads',
      contactId: 'L-203',
      contactName: 'Sarah Williams',
      contactPhone: '+1 (555) 345-6789',
      preview: 'Hi, I found your company online and would like to get a quote for my kitchen flooring...',
      fullContent: 'Hi, I found your company online and would like to get a quote for my kitchen flooring. Can someone call me?',
      timestamp: 'Yesterday',
      status: 'delivered',
      isRead: false,
      isStarred: false,
      hasAttachment: false
    },
    {
      id: '5',
      channel: 'email',
      direction: 'outbound',
      audience: 'customers',
      contactId: 'C-1048',
      contactName: 'Robert Chen',
      contactEmail: 'rchen@email.com',
      subject: 'Job Complete - Please Leave Us a Review! ⭐',
      preview: 'Thank you for choosing us! Your flooring installation is complete. We\'d love to hear your feedback...',
      fullContent: 'Thank you for choosing us! Your flooring installation is complete. We\'d love to hear your feedback. Click here to leave a Google review.',
      timestamp: '2 days ago',
      status: 'clicked',
      isRead: true,
      isStarred: false,
      hasAttachment: false,
      linkedTo: { type: 'job', id: 'J-5621', name: 'Job #5621' }
    }
  ];

  const templates: Template[] = [
    { id: 't1', name: 'Welcome New Customer', channel: 'email', audience: 'customers', category: 'Onboarding', subject: 'Welcome to {{company_name}}!', content: 'Hi {{first_name}}, welcome!', mergeTags: ['first_name', 'company_name'], isDefault: true },
    { id: 't2', name: 'Appointment Reminder', channel: 'sms', audience: 'customers', category: 'Reminders', content: 'Hi {{first_name}}, reminder: your appointment is {{appointment_date}} at {{appointment_time}}.', mergeTags: ['first_name', 'appointment_date', 'appointment_time'], isDefault: true },
    { id: 't3', name: 'Daily Check-In', channel: 'sms', audience: 'employees', category: 'Daily', content: 'Good morning! Please check in when you arrive at {{job_address}}.', mergeTags: ['job_address'], isDefault: true },
    { id: 't4', name: 'Review Request', channel: 'email', audience: 'customers', category: 'Follow-up', subject: 'How did we do? ⭐', content: 'Hi {{first_name}}, we hope you love your new floors! Please leave us a review.', mergeTags: ['first_name'], isDefault: true },
    { id: 't5', name: 'Quote Follow-Up', channel: 'email', audience: 'leads', category: 'Sales', subject: 'Following up on your quote', content: 'Hi {{first_name}}, just checking in on the quote we sent...', mergeTags: ['first_name'], isDefault: true },
    { id: 't6', name: 'Payment Reminder', channel: 'email', audience: 'customers', category: 'Billing', subject: 'Payment Reminder - Invoice #{{invoice_number}}', content: 'Hi {{first_name}}, this is a friendly reminder...', mergeTags: ['first_name', 'invoice_number', 'amount_due'], isDefault: true },
  ];

  // Navigation items with tooltips
  const navItems: { id: Section; icon: typeof Inbox; label: string; tooltip: string; badge?: number }[] = [
    { id: 'inbox', icon: Inbox, label: 'Inbox', tooltip: 'View all incoming and outgoing messages', badge: 3 },
    { id: 'compose', icon: PenSquare, label: 'Compose', tooltip: 'Create a new email or text message' },
    { id: 'templates', icon: FileText, label: 'Templates', tooltip: 'Manage message templates for quick sending' },
    { id: 'scheduled', icon: Calendar, label: 'Scheduled', tooltip: 'View and manage scheduled messages', badge: 2 },
    { id: 'automations', icon: Repeat, label: 'Automations', tooltip: 'Set up recurring and triggered messages' },
    { id: 'segments', icon: Users, label: 'Segments', tooltip: 'Create and manage contact groups' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', tooltip: 'View message performance and stats' },
    { id: 'settings', icon: Settings, label: 'Settings', tooltip: 'Configure email accounts, quiet hours, and more' },
  ];

  // Filter messages
  const filteredMessages = messages.filter(msg => {
    if (channelFilter !== 'all' && msg.channel !== channelFilter) return false;
    if (audienceFilter !== 'all' && msg.audience !== audienceFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        msg.contactName.toLowerCase().includes(query) ||
        msg.preview.toLowerCase().includes(query) ||
        msg.subject?.toLowerCase().includes(query) ||
        msg.contactId.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const unreadCount = messages.filter(m => !m.isRead).length;
  const selectedMessageData = messages.find(m => m.id === selectedMessage);

  // Get audience icon
  const getAudienceIcon = (audience: Audience) => {
    switch (audience) {
      case 'employees': return Building2;
      case 'customers': return User;
      case 'leads': return UserPlus;
      case 'vendors': return Truck;
      default: return User;
    }
  };

  // ============ RENDER SECTIONS ============

  const renderInbox = () => (
    <div style={{ display: 'flex', height: '100%', gap: '16px' }}>
      {/* Message List */}
      <div style={{
        width: selectedMessage ? '400px' : '100%',
        backgroundColor: cardBg,
        borderRadius: '12px',
        border: `1px solid ${borderColor}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.3s ease'
      }}>
        {/* Filters Bar */}
        <div style={{ padding: '16px', borderBottom: `1px solid ${borderColor}` }}>
          {/* Search */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
            borderRadius: '8px',
            padding: '10px 12px',
            marginBottom: '12px'
          }}>
            <Search style={{ width: '18px', height: '18px', color: textMuted }} />
            <input
              type="text"
              placeholder="Search by name, ID, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: textColor,
                fontSize: '14px'
              }}
            />
            <Tooltip text="Search across all messages, contacts, and linked records" position="bottom">
              <HelpCircle style={{ width: '16px', height: '16px', color: textMuted, cursor: 'help' }} />
            </Tooltip>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {/* Channel Filter */}
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <Tooltip text="Filter by message type" position="bottom">
                <span style={{ fontSize: '11px', color: textMuted, marginRight: '4px' }}>Channel:</span>
              </Tooltip>
              {(['all', 'email', 'sms'] as Channel[]).map(ch => (
                <button
                  key={ch}
                  onClick={() => setChannelFilter(ch)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: channelFilter === ch ? accentColor : (darkMode ? '#3D3D3D' : '#E5E5E5'),
                    color: channelFilter === ch ? '#FFF' : textMuted,
                    fontSize: '11px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    textTransform: 'capitalize'
                  }}
                >
                  {ch === 'email' && <Mail style={{ width: '12px', height: '12px' }} />}
                  {ch === 'sms' && <MessageSquare style={{ width: '12px', height: '12px' }} />}
                  {ch}
                </button>
              ))}
            </div>

            {/* Audience Filter */}
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginLeft: '8px' }}>
              <Tooltip text="Filter by contact type" position="bottom">
                <span style={{ fontSize: '11px', color: textMuted, marginRight: '4px' }}>Audience:</span>
              </Tooltip>
              {(['all', 'customers', 'employees', 'leads', 'vendors'] as Audience[]).map(aud => (
                <button
                  key={aud}
                  onClick={() => setAudienceFilter(aud)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: audienceFilter === aud ? (aud === 'all' ? accentColor : audienceColors[aud]) : (darkMode ? '#3D3D3D' : '#E5E5E5'),
                    color: audienceFilter === aud ? '#FFF' : textMuted,
                    fontSize: '11px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {aud}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Message List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredMessages.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <Inbox style={{ width: '48px', height: '48px', color: textMuted, margin: '0 auto 16px' }} />
              <p style={{ color: textMuted, margin: '0 0 8px 0' }}>No messages found</p>
              <p style={{ color: textMuted, fontSize: '12px', margin: 0 }}>
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            filteredMessages.map(message => (
              <div
                key={message.id}
                onClick={() => setSelectedMessage(message.id)}
                style={{
                  padding: '16px',
                  borderBottom: `1px solid ${borderColor}`,
                  cursor: 'pointer',
                  backgroundColor: selectedMessage === message.id ? (darkMode ? '#3D3D3D' : '#F0F0F0') : 'transparent',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (selectedMessage !== message.id) {
                    e.currentTarget.style.backgroundColor = hoverBg;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedMessage !== message.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', gap: '12px' }}>
                  {/* Avatar with audience color */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: audienceColors[message.audience],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    position: 'relative'
                  }}>
                    {(() => {
                      const AudienceIcon = getAudienceIcon(message.audience);
                      return <AudienceIcon style={{ width: '20px', height: '20px', color: '#FFF' }} />;
                    })()}
                    {/* Channel indicator */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: channelColors[message.channel],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${cardBg}`
                    }}>
                      {message.channel === 'email' ? 
                        <Mail style={{ width: '8px', height: '8px', color: '#FFF' }} /> :
                        <MessageSquare style={{ width: '8px', height: '8px', color: '#FFF' }} />
                      }
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: message.isRead ? '400' : '600',
                          color: textColor
                        }}>
                          {message.contactName}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          color: textMuted,
                          backgroundColor: darkMode ? '#3D3D3D' : '#E5E5E5',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          {message.contactId}
                        </span>
                        {message.direction === 'outbound' && (
                          <span style={{ fontSize: '10px', color: statusColors[message.status] }}>
                            {message.status === 'sent' && '✓ Sent'}
                            {message.status === 'delivered' && '✓✓ Delivered'}
                            {message.status === 'read' && <><Eye style={{ width: '10px', height: '10px', display: 'inline' }} /> Read</>}
                            {message.status === 'clicked' && <><MousePointer style={{ width: '10px', height: '10px', display: 'inline' }} /> Clicked</>}
                            {message.status === 'failed' && '✗ Failed'}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '11px', color: textMuted }}>{message.timestamp}</span>
                    </div>
                    {message.subject && (
                      <div style={{
                        fontSize: '13px',
                        fontWeight: message.isRead ? '400' : '600',
                        color: textColor,
                        marginBottom: '4px'
                      }}>
                        {message.subject}
                      </div>
                    )}
                    <div style={{
                      fontSize: '12px',
                      color: textMuted,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {message.direction === 'outbound' && <span style={{ color: accentColor }}>You: </span>}
                      {message.preview}
                    </div>
                    {/* Linked record & indicators */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      {message.linkedTo && (
                        <span style={{
                          fontSize: '10px',
                          color: accentColor,
                          backgroundColor: `${accentColor}20`,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Link style={{ width: '10px', height: '10px' }} />
                          {message.linkedTo.name}
                        </span>
                      )}
                      {message.hasAttachment && (
                        <Paperclip style={{ width: '12px', height: '12px', color: textMuted }} />
                      )}
                      {message.isStarred && (
                        <Star style={{ width: '12px', height: '12px', fill: '#FFD700', color: '#FFD700' }} />
                      )}
                      {!message.isRead && (
                        <Circle style={{ width: '8px', height: '8px', fill: accentColor, color: accentColor }} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Detail Panel */}
      {selectedMessage && selectedMessageData && (
        <div style={{
          flex: 1,
          backgroundColor: cardBg,
          borderRadius: '12px',
          border: `1px solid ${borderColor}`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '20px',
            borderBottom: `1px solid ${borderColor}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: audienceColors[selectedMessageData.audience],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {(() => {
                  const AudienceIcon = getAudienceIcon(selectedMessageData.audience);
                  return <AudienceIcon style={{ width: '24px', height: '24px', color: '#FFF' }} />;
                })()}
              </div>
              <div>
                <h2 style={{ fontSize: '18px', color: textColor, margin: '0 0 4px 0' }}>
                  {selectedMessageData.contactName}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '12px',
                    color: textMuted,
                    backgroundColor: darkMode ? '#3D3D3D' : '#E5E5E5',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {selectedMessageData.contactId}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: audienceColors[selectedMessageData.audience],
                    textTransform: 'capitalize'
                  }}>
                    {selectedMessageData.audience.slice(0, -1)}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: textMuted, margin: 0 }}>
                  {selectedMessageData.contactEmail || selectedMessageData.contactPhone}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <Tooltip text="Star this message">
                <button style={{
                  padding: '8px',
                  backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  <Star style={{ width: '18px', height: '18px', color: selectedMessageData.isStarred ? '#FFD700' : textMuted, fill: selectedMessageData.isStarred ? '#FFD700' : 'none' }} />
                </button>
              </Tooltip>
              <Tooltip text="Archive message">
                <button style={{
                  padding: '8px',
                  backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  <Archive style={{ width: '18px', height: '18px', color: textMuted }} />
                </button>
              </Tooltip>
              <Tooltip text="Delete message">
                <button style={{
                  padding: '8px',
                  backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  <Trash2 style={{ width: '18px', height: '18px', color: '#EF5350' }} />
                </button>
              </Tooltip>
              <Tooltip text="Close panel">
                <button 
                  onClick={() => setSelectedMessage(null)}
                  style={{
                    padding: '8px',
                    backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}>
                  <X style={{ width: '18px', height: '18px', color: textMuted }} />
                </button>
              </Tooltip>
            </div>
          </div>

          {/* Subject line for emails */}
          {selectedMessageData.subject && (
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${borderColor}` }}>
              <h3 style={{ fontSize: '16px', color: textColor, margin: 0, fontWeight: '600' }}>
                {selectedMessageData.subject}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <span style={{
                  fontSize: '11px',
                  color: channelColors[selectedMessageData.channel],
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {selectedMessageData.channel === 'email' ? <Mail style={{ width: '12px', height: '12px' }} /> : <MessageSquare style={{ width: '12px', height: '12px' }} />}
                  {selectedMessageData.channel.toUpperCase()}
                </span>
                <span style={{ fontSize: '11px', color: textMuted }}>{selectedMessageData.timestamp}</span>
                {selectedMessageData.linkedTo && (
                  <span style={{
                    fontSize: '11px',
                    color: accentColor,
                    backgroundColor: `${accentColor}20`,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}>
                    <Link style={{ width: '10px', height: '10px' }} />
                    {selectedMessageData.linkedTo.name}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Message Body */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            <p style={{ fontSize: '14px', color: textColor, lineHeight: '1.7', margin: 0 }}>
              {selectedMessageData.fullContent}
            </p>
          </div>

          {/* Reply Box */}
          <div style={{
            padding: '16px',
            borderTop: `1px solid ${borderColor}`,
            backgroundColor: darkMode ? '#252525' : '#FAFAFA'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '12px',
              backgroundColor: darkMode ? '#3D3D3D' : '#FFFFFF',
              borderRadius: '12px',
              padding: '12px',
              border: `1px solid ${borderColor}`
            }}>
              <Tooltip text="Attach a file">
                <button style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                  <Paperclip style={{ width: '20px', height: '20px', color: textMuted }} />
                </button>
              </Tooltip>
              <Tooltip text="Use AI to help write your reply">
                <button style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                  <Sparkles style={{ width: '20px', height: '20px', color: accentColor }} />
                </button>
              </Tooltip>
              <textarea
                placeholder="Type your reply..."
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: textColor,
                  fontSize: '14px',
                  resize: 'none',
                  minHeight: '40px',
                  maxHeight: '120px'
                }}
              />
              <Tooltip text="Schedule this reply for later">
                <button style={{
                  padding: '10px',
                  backgroundColor: darkMode ? '#4D4D4D' : '#E5E5E5',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  <Clock style={{ width: '18px', height: '18px', color: textMuted }} />
                </button>
              </Tooltip>
              <button style={{
                padding: '10px 20px',
                backgroundColor: accentColor,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Send style={{ width: '16px', height: '16px', color: '#FFFFFF' }} />
                <span style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '14px' }}>Send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCompose = () => (
    <div style={{
      backgroundColor: cardBg,
      borderRadius: '12px',
      border: `1px solid ${borderColor}`,
      padding: '24px',
      maxWidth: '800px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <PenSquare style={{ width: '24px', height: '24px', color: accentColor }} />
        <h2 style={{ fontSize: '20px', color: textColor, margin: 0 }}>New Message</h2>
        <Tooltip text="Create and send a new email or text message to any contact" position="right">
          <HelpCircle style={{ width: '16px', height: '16px', color: textMuted, cursor: 'help' }} />
        </Tooltip>
      </div>

      {/* Step 1: Channel Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '13px', color: textMuted, display: 'block', marginBottom: '8px' }}>
          Channel <Tooltip text="Choose how to send your message" position="right"><Info style={{ width: '12px', height: '12px', display: 'inline', marginLeft: '4px' }} /></Tooltip>
        </label>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            flex: 1,
            padding: '16px',
            borderRadius: '8px',
            border: `2px solid ${channelColors.email}`,
            backgroundColor: `${channelColors.email}20`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <Mail style={{ width: '20px', height: '20px', color: channelColors.email }} />
            <span style={{ color: channelColors.email, fontWeight: '600' }}>Email</span>
          </button>
          <button style={{
            flex: 1,
            padding: '16px',
            borderRadius: '8px',
            border: `2px solid ${borderColor}`,
            backgroundColor: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <MessageSquare style={{ width: '20px', height: '20px', color: textMuted }} />
            <span style={{ color: textMuted, fontWeight: '600' }}>SMS</span>
          </button>
        </div>
      </div>

      {/* Step 2: Audience Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '13px', color: textMuted, display: 'block', marginBottom: '8px' }}>
          Audience <Tooltip text="Select the type of recipient" position="right"><Info style={{ width: '12px', height: '12px', display: 'inline', marginLeft: '4px' }} /></Tooltip>
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(['customers', 'employees', 'leads', 'vendors'] as const).map(aud => (
            <button key={aud} style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: `1px solid ${borderColor}`,
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textTransform: 'capitalize'
            }}>
              {(() => {
                const Icon = getAudienceIcon(aud);
                return <Icon style={{ width: '16px', height: '16px', color: audienceColors[aud] }} />;
              })()}
              <span style={{ color: textColor, fontSize: '13px' }}>{aud}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 3: Recipient */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '13px', color: textMuted, display: 'block', marginBottom: '8px' }}>
          To <Tooltip text="Search by name, email, phone, or customer ID" position="right"><Info style={{ width: '12px', height: '12px', display: 'inline', marginLeft: '4px' }} /></Tooltip>
        </label>
        <input
          type="text"
          placeholder="Search contacts or enter email/phone..."
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${borderColor}`,
            backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
            color: textColor,
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Template Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '13px', color: textMuted, display: 'block', marginBottom: '8px' }}>
          Template (Optional) <Tooltip text="Start with a pre-written template to save time" position="right"><Info style={{ width: '12px', height: '12px', display: 'inline', marginLeft: '4px' }} /></Tooltip>
        </label>
        <select style={{
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          border: `1px solid ${borderColor}`,
          backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
          color: textColor,
          fontSize: '14px',
          outline: 'none'
        }}>
          <option value="">Choose a template...</option>
          <option value="t1">Welcome New Customer</option>
          <option value="t4">Review Request</option>
          <option value="t5">Quote Follow-Up</option>
          <option value="t6">Payment Reminder</option>
        </select>
      </div>

      {/* Subject (for email) */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '13px', color: textMuted, display: 'block', marginBottom: '8px' }}>
          Subject
        </label>
        <input
          type="text"
          placeholder="Enter email subject..."
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${borderColor}`,
            backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
            color: textColor,
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Message Body */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label style={{ fontSize: '13px', color: textMuted }}>
            Message
          </label>
          <Tooltip text="Let AI help you write or improve your message" position="left">
            <button style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: `${accentColor}20`,
              color: accentColor,
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Sparkles style={{ width: '14px', height: '14px' }} />
              AI Assist
            </button>
          </Tooltip>
        </div>
        <div style={{
          border: `1px solid ${borderColor}`,
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          {/* Merge Tags Bar */}
          <div style={{
            padding: '8px 12px',
            backgroundColor: darkMode ? '#252525' : '#FAFAFA',
            borderBottom: `1px solid ${borderColor}`,
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <Tooltip text="Insert personalization tags that auto-fill with contact info" position="bottom">
              <span style={{ fontSize: '11px', color: textMuted }}>Merge Tags:</span>
            </Tooltip>
            {['first_name', 'company_name', 'appointment_date'].map(tag => (
              <button key={tag} style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: `1px solid ${borderColor}`,
                backgroundColor: 'transparent',
                color: accentColor,
                fontSize: '11px',
                cursor: 'pointer'
              }}>
                {`{{${tag}}}`}
              </button>
            ))}
          </div>
          <textarea
            placeholder="Write your message here..."
            style={{
              width: '100%',
              minHeight: '150px',
              padding: '12px',
              border: 'none',
              backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
              color: textColor,
              fontSize: '14px',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <Tooltip text="Attach files like quotes, invoices, or photos" position="top">
          <button style={{
            padding: '12px 16px',
            borderRadius: '8px',
            border: `1px solid ${borderColor}`,
            backgroundColor: 'transparent',
            color: textMuted,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Paperclip style={{ width: '16px', height: '16px' }} />
            Attach
          </button>
        </Tooltip>
        <Tooltip text="Schedule this message for a specific date and time" position="top">
          <button style={{
            padding: '12px 16px',
            borderRadius: '8px',
            border: `1px solid ${borderColor}`,
            backgroundColor: 'transparent',
            color: textMuted,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Clock style={{ width: '16px', height: '16px' }} />
            Schedule
          </button>
        </Tooltip>
        <button style={{
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: accentColor,
          color: '#FFFFFF',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Send style={{ width: '16px', height: '16px' }} />
          Send Now
        </button>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FileText style={{ width: '24px', height: '24px', color: accentColor }} />
          <h2 style={{ fontSize: '20px', color: textColor, margin: 0 }}>Message Templates</h2>
          <Tooltip text="Pre-written messages you can customize and reuse" position="right">
            <HelpCircle style={{ width: '16px', height: '16px', color: textMuted, cursor: 'help' }} />
          </Tooltip>
        </div>
        <button style={{
          padding: '10px 16px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: accentColor,
          color: '#FFFFFF',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Plus style={{ width: '16px', height: '16px' }} />
          New Template
        </button>
      </div>

      {/* Template Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {templates.map(template => (
          <div key={template.id} style={{
            backgroundColor: cardBg,
            borderRadius: '12px',
            border: `1px solid ${borderColor}`,
            padding: '20px',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '15px', color: textColor, margin: '0 0 4px 0' }}>{template.name}</h3>
                <span style={{
                  fontSize: '11px',
                  color: textMuted,
                  backgroundColor: darkMode ? '#3D3D3D' : '#E5E5E5',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  {template.category}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: `${channelColors[template.channel]}20`,
                  color: channelColors[template.channel],
                  fontSize: '10px',
                  fontWeight: '600'
                }}>
                  {template.channel.toUpperCase()}
                </span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: textMuted, margin: '0 0 12px 0', lineHeight: '1.5' }}>
              {template.content.substring(0, 100)}...
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {template.mergeTags.slice(0, 2).map(tag => (
                  <span key={tag} style={{
                    fontSize: '10px',
                    color: accentColor,
                    backgroundColor: `${accentColor}15`,
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {`{{${tag}}}`}
                  </span>
                ))}
                {template.mergeTags.length > 2 && (
                  <span style={{ fontSize: '10px', color: textMuted }}>+{template.mergeTags.length - 2}</span>
                )}
              </div>
              <span style={{
                fontSize: '10px',
                color: audienceColors[template.audience as keyof typeof audienceColors] || textMuted,
                textTransform: 'capitalize'
              }}>
                {template.audience}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderScheduled = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <Calendar style={{ width: '24px', height: '24px', color: accentColor }} />
        <h2 style={{ fontSize: '20px', color: textColor, margin: 0 }}>Scheduled Messages</h2>
        <Tooltip text="Messages waiting to be sent at a specific date and time" position="right">
          <HelpCircle style={{ width: '16px', height: '16px', color: textMuted, cursor: 'help' }} />
        </Tooltip>
      </div>

      <div style={{
        backgroundColor: cardBg,
        borderRadius: '12px',
        border: `1px solid ${borderColor}`,
        padding: '40px',
        textAlign: 'center'
      }}>
        <Calendar style={{ width: '48px', height: '48px', color: textMuted, margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '16px', color: textColor, margin: '0 0 8px 0' }}>No scheduled messages</h3>
        <p style={{ fontSize: '14px', color: textMuted, margin: '0 0 16px 0' }}>
          When you schedule a message for later, it will appear here
        </p>
        <button
          onClick={() => setActiveSection('compose')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: accentColor,
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Compose Message
        </button>
      </div>
    </div>
  );

  const renderAutomations = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Repeat style={{ width: '24px', height: '24px', color: accentColor }} />
          <h2 style={{ fontSize: '20px', color: textColor, margin: 0 }}>Automations</h2>
          <Tooltip text="Set up recurring messages and event-triggered communications" position="right">
            <HelpCircle style={{ width: '16px', height: '16px', color: textMuted, cursor: 'help' }} />
          </Tooltip>
        </div>
        <button style={{
          padding: '10px 16px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: accentColor,
          color: '#FFFFFF',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Plus style={{ width: '16px', height: '16px' }} />
          New Automation
        </button>
      </div>

      {/* Drive-Time Reminders - GPS-Based Section */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          marginBottom: '12px',
          paddingBottom: '8px',
          borderBottom: `1px solid ${borderColor}`
        }}>
          <Car style={{ width: '18px', height: '18px', color: accentColor }} />
          <h3 style={{ fontSize: '14px', color: textColor, margin: 0, fontWeight: '600' }}>
            GPS-Based Reminders
          </h3>
        </div>
        
        {/* Drive-Time Settings Panel */}
        <DriveTimeSettings
          employees={employees}
          darkMode={darkMode}
          compact={false}
        />
      </div>

      {/* Message Automations Divider */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        marginBottom: '12px',
        paddingBottom: '8px',
        borderBottom: `1px solid ${borderColor}`
      }}>
        <Zap style={{ width: '18px', height: '18px', color: accentColor }} />
        <h3 style={{ fontSize: '14px', color: textColor, margin: 0, fontWeight: '600' }}>
          Message Automations
        </h3>
      </div>

      {/* Sample Automations */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { name: 'Daily Job Site Check-In', trigger: 'Every day at 7:00 AM', audience: 'employees', channel: 'sms', active: true },
          { name: 'New Customer Welcome', trigger: 'When customer is created', audience: 'customers', channel: 'email', active: true },
          { name: 'Job Completion Review Request', trigger: '2 days after job completed', audience: 'customers', channel: 'email', active: false },
          { name: 'Weekly Schedule Summary', trigger: 'Every Monday at 6:00 AM', audience: 'employees', channel: 'sms', active: true },
        ].map((auto, idx) => (
          <div key={idx} style={{
            backgroundColor: cardBg,
            borderRadius: '12px',
            border: `1px solid ${borderColor}`,
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: auto.active ? `${accentColor}20` : (darkMode ? '#3D3D3D' : '#E5E5E5'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Zap style={{ width: '20px', height: '20px', color: auto.active ? accentColor : textMuted }} />
              </div>
              <div>
                <h4 style={{ fontSize: '14px', color: textColor, margin: '0 0 4px 0' }}>{auto.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: textMuted }}>{auto.trigger}</span>
                  <span style={{
                    fontSize: '10px',
                    color: audienceColors[auto.audience as keyof typeof audienceColors],
                    textTransform: 'capitalize'
                  }}>
                    • {auto.audience}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    color: channelColors[auto.channel as keyof typeof channelColors],
                    textTransform: 'uppercase'
                  }}>
                    • {auto.channel}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '12px',
                backgroundColor: auto.active ? '#66BB6A20' : (darkMode ? '#3D3D3D' : '#E5E5E5'),
                color: auto.active ? '#66BB6A' : textMuted
              }}>
                {auto.active ? 'Active' : 'Paused'}
              </span>
              <button style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}>
                <MoreVertical style={{ width: '18px', height: '18px', color: textMuted }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSegments = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Users style={{ width: '24px', height: '24px', color: accentColor }} />
          <h2 style={{ fontSize: '20px', color: textColor, margin: 0 }}>Segments</h2>
          <Tooltip text="Create contact groups for targeted messaging" position="right">
            <HelpCircle style={{ width: '16px', height: '16px', color: textMuted, cursor: 'help' }} />
          </Tooltip>
        </div>
        <button style={{
          padding: '10px 16px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: accentColor,
          color: '#FFFFFF',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Plus style={{ width: '16px', height: '16px' }} />
          New Segment
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        {[
          { name: 'VIP Customers', count: 24, audience: 'customers' },
          { name: 'Crew A - Installations', count: 8, audience: 'employees' },
          { name: 'Past Due Invoices', count: 12, audience: 'customers' },
          { name: 'New Leads This Month', count: 47, audience: 'leads' },
          { name: 'Preferred Vendors', count: 6, audience: 'vendors' },
        ].map((seg, idx) => (
          <div key={idx} style={{
            backgroundColor: cardBg,
            borderRadius: '12px',
            border: `1px solid ${borderColor}`,
            padding: '20px',
            cursor: 'pointer'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '14px', color: textColor, margin: 0 }}>{seg.name}</h4>
              <span style={{
                fontSize: '10px',
                color: audienceColors[seg.audience as keyof typeof audienceColors],
                textTransform: 'capitalize'
              }}>
                {seg.audience}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', color: accentColor, fontWeight: '700' }}>{seg.count}</span>
              <span style={{ fontSize: '12px', color: textMuted }}>contacts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <BarChart3 style={{ width: '24px', height: '24px', color: accentColor }} />
        <h2 style={{ fontSize: '20px', color: textColor, margin: 0 }}>Analytics</h2>
        <Tooltip text="Track message performance, delivery rates, and engagement" position="right">
          <HelpCircle style={{ width: '16px', height: '16px', color: textMuted, cursor: 'help' }} />
        </Tooltip>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Sent Today', value: '47', change: '+12%', icon: Send },
          { label: 'Delivery Rate', value: '98.2%', change: '+0.5%', icon: CheckCircle2 },
          { label: 'Open Rate', value: '64.8%', change: '+3.2%', icon: Eye },
          { label: 'Response Rate', value: '23.4%', change: '-1.1%', icon: MessageSquare },
        ].map((stat, idx) => (
          <div key={idx} style={{
            backgroundColor: cardBg,
            borderRadius: '12px',
            border: `1px solid ${borderColor}`,
            padding: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', color: textMuted }}>{stat.label}</span>
              <stat.icon style={{ width: '18px', height: '18px', color: accentColor }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '28px', color: textColor, fontWeight: '700' }}>{stat.value}</span>
              <span style={{
                fontSize: '12px',
                color: stat.change.startsWith('+') ? '#66BB6A' : '#EF5350'
              }}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        backgroundColor: cardBg,
        borderRadius: '12px',
        border: `1px solid ${borderColor}`,
        padding: '24px',
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <BarChart3 style={{ width: '48px', height: '48px', color: textMuted, margin: '0 auto 16px' }} />
          <p style={{ color: textMuted, margin: 0 }}>Charts and detailed analytics coming soon</p>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <Settings style={{ width: '24px', height: '24px', color: accentColor }} />
        <h2 style={{ fontSize: '20px', color: textColor, margin: 0 }}>Settings</h2>
        <Tooltip text="Configure your communication preferences and integrations" position="right">
          <HelpCircle style={{ width: '16px', height: '16px', color: textMuted, cursor: 'help' }} />
        </Tooltip>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
        {/* Email Accounts */}
        <div style={{
          backgroundColor: cardBg,
          borderRadius: '12px',
          border: `1px solid ${borderColor}`,
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '15px', color: textColor, margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail style={{ width: '18px', height: '18px', color: channelColors.email }} />
            Connected Email Accounts
          </h3>
          <div style={{
            padding: '12px',
            backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
            borderRadius: '8px',
            marginBottom: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <p style={{ fontSize: '14px', color: textColor, margin: '0 0 4px 0' }}>info@yourcompany.com</p>
              <span style={{ fontSize: '11px', color: '#66BB6A' }}>● Connected</span>
            </div>
            <button style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: `1px solid ${borderColor}`,
              backgroundColor: 'transparent',
              color: textMuted,
              fontSize: '12px',
              cursor: 'pointer'
            }}>
              Manage
            </button>
          </div>
          <button style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: `1px dashed ${borderColor}`,
            backgroundColor: 'transparent',
            color: textMuted,
            fontSize: '13px',
            cursor: 'pointer',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <Plus style={{ width: '16px', height: '16px' }} />
            Connect Another Email
          </button>
        </div>

        {/* Quiet Hours */}
        <div style={{
          backgroundColor: cardBg,
          borderRadius: '12px',
          border: `1px solid ${borderColor}`,
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '15px', color: textColor, margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell style={{ width: '18px', height: '18px', color: accentColor }} />
            Quiet Hours
            <Tooltip text="Messages won't be sent during these hours" position="right">
              <HelpCircle style={{ width: '14px', height: '14px', color: textMuted, cursor: 'help' }} />
            </Tooltip>
          </h3>
          <p style={{ fontSize: '12px', color: textMuted, margin: '0 0 12px 0' }}>
            Prevent messages from being sent outside business hours
          </p>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input type="time" defaultValue="21:00" style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: `1px solid ${borderColor}`,
              backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
              color: textColor,
              fontSize: '13px'
            }} />
            <span style={{ color: textMuted }}>to</span>
            <input type="time" defaultValue="08:00" style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: `1px solid ${borderColor}`,
              backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
              color: textColor,
              fontSize: '13px'
            }} />
          </div>
        </div>

        {/* Default Signature */}
        <div style={{
          backgroundColor: cardBg,
          borderRadius: '12px',
          border: `1px solid ${borderColor}`,
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '15px', color: textColor, margin: '0 0 12px 0' }}>
            Default Email Signature
          </h3>
          <textarea
            defaultValue="Best regards,\nYour Company Name\n(555) 123-4567"
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${borderColor}`,
              backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
              color: textColor,
              fontSize: '13px',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>
    </div>
  );

  // Render active section
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'inbox': return renderInbox();
      case 'compose': return renderCompose();
      case 'templates': return renderTemplates();
      case 'scheduled': return renderScheduled();
      case 'automations': return renderAutomations();
      case 'segments': return renderSegments();
      case 'analytics': return renderAnalytics();
      case 'settings': return renderSettings();
      default: return renderInbox();
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: bgColor }}>
      {/* Main App Sidebar */}
      <SidebarEnhanced
        activePage="Communication Hub"
        darkMode={darkMode}
        onNavigate={onNavigate}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Communication Hub Content */}
      <div style={{ marginLeft: '200px', flex: 1, display: 'flex' }}>
        {/* Inner Navigation Sidebar (Gmail-style) */}
        <div style={{
          width: '220px',
          backgroundColor: sidebarBg,
          borderRight: `1px solid ${borderColor}`,
          padding: '20px 12px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{ marginBottom: '20px', padding: '0 8px' }}>
            <h1 style={{ fontSize: '20px', color: textColor, margin: '0 0 4px 0' }}>
              Comm Hub
            </h1>
            <p style={{ fontSize: '11px', color: textMuted, margin: 0 }}>
              Unified messaging center
            </p>
          </div>

          {/* Quick Compose Button */}
          <button
            onClick={() => setActiveSection('compose')}
            style={{
              padding: '12px 16px',
              borderRadius: '24px',
              border: 'none',
              backgroundColor: accentColor,
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(212, 160, 36, 0.3)'
            }}
          >
            <PenSquare style={{ width: '18px', height: '18px' }} />
            Compose
          </button>

          {/* Navigation Items */}
          <nav style={{ flex: 1 }}>
            {navItems.map(item => (
              <Tooltip key={item.id} text={item.tooltip} position="right">
                <button
                  onClick={() => setActiveSection(item.id)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeSection === item.id ? (darkMode ? '#3D3D3D' : '#E5E5E5') : 'transparent',
                    color: activeSection === item.id ? textColor : textMuted,
                    fontSize: '13px',
                    fontWeight: activeSection === item.id ? '600' : '400',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '4px',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <item.icon style={{
                    width: '18px',
                    height: '18px',
                    color: activeSection === item.id ? accentColor : textMuted
                  }} />
                  {item.label}
                  {item.badge && (
                    <span style={{
                      marginLeft: 'auto',
                      backgroundColor: accentColor,
                      color: '#FFFFFF',
                      fontSize: '10px',
                      fontWeight: '600',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      minWidth: '18px',
                      textAlign: 'center'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </Tooltip>
            ))}
          </nav>

          {/* Help Link */}
          <div style={{ padding: '12px', borderTop: `1px solid ${borderColor}`, marginTop: '12px' }}>
            <Tooltip text="Get help using the Communication Hub" position="right">
              <button style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'transparent',
                color: textMuted,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <HelpCircle style={{ width: '16px', height: '16px' }} />
                Help & Tips
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', height: '100vh', boxSizing: 'border-box' }}>
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
}
