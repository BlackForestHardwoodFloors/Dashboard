/**
 * Messages Page - Boardroom 360
 * 
 * Displays messages/inbox with conversation threads
 */

import { useState } from 'react';
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical,
  Star,
  Trash2,
  Archive,
  Mail,
  MailOpen,
  Circle,
  CheckCircle2
} from 'lucide-react';
import { SidebarEnhanced } from './SidebarEnhanced';

interface Message {
  id: string;
  sender: string;
  senderInitials: string;
  subject: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  type: 'client' | 'vendor' | 'employee' | 'system';
}

interface MessagesPageProps {
  onNavigate?: (page: string) => void;
}

export default function MessagesPage({ onNavigate }: MessagesPageProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all');

  const bgColor = darkMode ? '#1E1E1E' : '#F5F5F5';
  const cardBg = darkMode ? '#2D2D2D' : '#FFFFFF';
  const textColor = darkMode ? '#FFFFFF' : '#1E1E1E';
  const textMuted = darkMode ? '#A0A0A0' : '#666666';
  const borderColor = darkMode ? '#3D3D3D' : '#E5E5E5';
  const accentColor = '#D4A024';

  // Mock messages data
  const messages: Message[] = [
    {
      id: '1',
      sender: 'John Anderson',
      senderInitials: 'JA',
      subject: 'Re: Flooring Installation Quote',
      preview: 'Thank you for the detailed quote. We would like to proceed with the installation next week...',
      timestamp: '10:30 AM',
      isRead: false,
      isStarred: true,
      type: 'client'
    },
    {
      id: '2',
      sender: 'Oak Valley Supplies',
      senderInitials: 'OV',
      subject: 'Order Confirmation #45892',
      preview: 'Your order for 500 sq ft of Red Oak hardwood has been confirmed and will ship...',
      timestamp: '9:15 AM',
      isRead: false,
      isStarred: false,
      type: 'vendor'
    },
    {
      id: '3',
      sender: 'Mike Thompson',
      senderInitials: 'MT',
      subject: 'Job Complete - Martinez Residence',
      preview: 'Just finished the installation at Martinez residence. All photos uploaded to the system...',
      timestamp: 'Yesterday',
      isRead: true,
      isStarred: false,
      type: 'employee'
    },
    {
      id: '4',
      sender: 'Sarah Williams',
      senderInitials: 'SW',
      subject: 'Schedule Change Request',
      preview: 'Hi, I need to request a change in the installation date from Friday to Monday...',
      timestamp: 'Yesterday',
      isRead: true,
      isStarred: true,
      type: 'client'
    },
    {
      id: '5',
      sender: 'System Notification',
      senderInitials: 'SN',
      subject: 'Contract Signed - Thompson Commercial',
      preview: 'The contract for Thompson Commercial project has been signed and is ready for review...',
      timestamp: '2 days ago',
      isRead: true,
      isStarred: false,
      type: 'system'
    }
  ];

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread' && msg.isRead) return false;
    if (filter === 'starred' && !msg.isStarred) return false;
    if (searchQuery && !msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !msg.sender.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getTypeColor = (type: Message['type']) => {
    switch (type) {
      case 'client': return '#42A5F5';
      case 'vendor': return '#66BB6A';
      case 'employee': return '#9C27B0';
      case 'system': return '#FF9800';
      default: return textMuted;
    }
  };

  const selectedMessageData = messages.find(m => m.id === selectedMessage);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: bgColor }}>
      {/* Sidebar */}
      <SidebarEnhanced 
        activePage="Messages" 
        darkMode={darkMode} 
        onNavigate={onNavigate}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Main Content */}
      <div style={{ marginLeft: '200px', flex: 1, padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', color: textColor, margin: '0 0 8px 0' }}>
            Messages
          </h1>
          <p style={{ fontSize: '14px', color: textMuted, margin: 0 }}>
            Manage your conversations with clients, vendors, and team
          </p>
        </div>

        {/* Messages Container */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: selectedMessage ? '400px 1fr' : '1fr',
          gap: '24px',
          height: 'calc(100vh - 140px)'
        }}>
          {/* Messages List */}
          <div style={{
            backgroundColor: cardBg,
            borderRadius: '16px',
            border: `1px solid ${borderColor}`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Search & Filter */}
            <div style={{ padding: '16px', borderBottom: `1px solid ${borderColor}` }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
                borderRadius: '8px',
                padding: '8px 12px',
                marginBottom: '12px'
              }}>
                <Search style={{ width: '18px', height: '18px', color: textMuted }} />
                <input
                  type="text"
                  placeholder="Search messages..."
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
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['all', 'unread', 'starred'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: filter === f ? accentColor : (darkMode ? '#3D3D3D' : '#F5F5F5'),
                      color: filter === f ? '#FFFFFF' : textMuted,
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Message List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filteredMessages.map(message => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message.id)}
                  style={{
                    padding: '16px',
                    borderBottom: `1px solid ${borderColor}`,
                    cursor: 'pointer',
                    backgroundColor: selectedMessage === message.id 
                      ? (darkMode ? '#3D3D3D' : '#F0F0F0') 
                      : 'transparent',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    {/* Avatar */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: getTypeColor(message.type),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: '600',
                      fontSize: '14px',
                      flexShrink: 0
                    }}>
                      {message.senderInitials}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ 
                          fontSize: '14px', 
                          fontWeight: message.isRead ? '500' : '700',
                          color: textColor
                        }}>
                          {message.sender}
                        </span>
                        <span style={{ fontSize: '11px', color: textMuted }}>
                          {message.timestamp}
                        </span>
                      </div>
                      <div style={{ 
                        fontSize: '13px', 
                        fontWeight: message.isRead ? '400' : '600',
                        color: textColor,
                        marginBottom: '4px'
                      }}>
                        {message.subject}
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: textMuted,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {message.preview}
                      </div>
                    </div>

                    {/* Indicators */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      {!message.isRead && (
                        <Circle style={{ width: '8px', height: '8px', fill: accentColor, color: accentColor }} />
                      )}
                      {message.isStarred && (
                        <Star style={{ width: '14px', height: '14px', fill: '#FFD700', color: '#FFD700' }} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          {selectedMessage && selectedMessageData && (
            <div style={{
              backgroundColor: cardBg,
              borderRadius: '16px',
              border: `1px solid ${borderColor}`,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              {/* Message Header */}
              <div style={{ 
                padding: '20px', 
                borderBottom: `1px solid ${borderColor}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: getTypeColor(selectedMessageData.type),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}>
                    {selectedMessageData.senderInitials}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '18px', color: textColor, margin: '0 0 4px 0' }}>
                      {selectedMessageData.sender}
                    </h2>
                    <p style={{ fontSize: '14px', color: textMuted, margin: 0 }}>
                      {selectedMessageData.subject}
                    </p>
                    <span style={{ 
                      fontSize: '11px', 
                      color: getTypeColor(selectedMessageData.type),
                      textTransform: 'capitalize'
                    }}>
                      {selectedMessageData.type}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{
                    padding: '8px',
                    backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}>
                    <Star style={{ width: '18px', height: '18px', color: selectedMessageData.isStarred ? '#FFD700' : textMuted }} />
                  </button>
                  <button style={{
                    padding: '8px',
                    backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}>
                    <Archive style={{ width: '18px', height: '18px', color: textMuted }} />
                  </button>
                  <button style={{
                    padding: '8px',
                    backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}>
                    <Trash2 style={{ width: '18px', height: '18px', color: '#EF5350' }} />
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                <p style={{ fontSize: '14px', color: textColor, lineHeight: '1.6' }}>
                  {selectedMessageData.preview}
                </p>
                <p style={{ fontSize: '14px', color: textColor, lineHeight: '1.6', marginTop: '16px' }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </p>
                <p style={{ fontSize: '14px', color: textColor, lineHeight: '1.6', marginTop: '16px' }}>
                  Best regards,<br />
                  {selectedMessageData.sender}
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
                  <button style={{
                    padding: '8px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}>
                    <Paperclip style={{ width: '20px', height: '20px', color: textMuted }} />
                  </button>
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
      </div>
    </div>
  );
}
