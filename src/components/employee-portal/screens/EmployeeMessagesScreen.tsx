/**
 * Employee Messages Screen - Boardroom 360
 * 
 * Messages between employees and customers, plus team chat.
 * Displays in the Employee Portal "messages" tab.
 */

import { useState } from 'react';
import { useTheme } from './ThemeProvider';

// ============ TYPES ============

type MessageFilter = 'all' | 'customers' | 'team' | 'starred';

interface Conversation {
  id: string;
  contactType: 'customer' | 'employee';
  contactId: string;
  contactName: string;
  contactInitials: string;
  contactColor: string;
  lastMessage: string;
  lastMessageTime: string;
  isUnread: boolean;
  isStarred: boolean;
  linkedJob?: {
    id: string;
    name: string;
  };
  messageCount: number;
}

interface EmployeeMessagesScreenProps {
  onOpenConversation?: (conversationId: string) => void;
}

// ============ SAMPLE DATA (Replace with API call) ============

const sampleConversations: Conversation[] = [
  {
    id: 'conv-001',
    contactType: 'customer',
    contactId: 'C-1052',
    contactName: 'John Anderson',
    contactInitials: 'JA',
    contactColor: '#F59E0B',
    lastMessage: 'Thank you for the detailed quote. We would like to proceed with the installation next week...',
    lastMessageTime: '10:30 AM',
    isUnread: true,
    isStarred: true,
    linkedJob: { id: 'job-001', name: 'Anderson Residence' },
    messageCount: 5
  },
  {
    id: 'conv-002',
    contactType: 'customer',
    contactId: 'C-1048',
    contactName: 'Oak Valley Supplies',
    contactInitials: 'OV',
    contactColor: '#10B981',
    lastMessage: 'Your order for 500 sq ft of Red Oak hardwood has been confirmed and will ship...',
    lastMessageTime: '9:15 AM',
    isUnread: true,
    isStarred: false,
    messageCount: 3
  },
  {
    id: 'conv-003',
    contactType: 'employee',
    contactId: 'E-104',
    contactName: 'Mike Thompson',
    contactInitials: 'MT',
    contactColor: '#8B5CF6',
    lastMessage: 'Just finished the installation at Martinez residence. All photos uploaded to the system...',
    lastMessageTime: 'Yesterday',
    isUnread: false,
    isStarred: false,
    linkedJob: { id: 'job-003', name: 'Martinez Residence' },
    messageCount: 12
  },
  {
    id: 'conv-004',
    contactType: 'employee',
    contactId: 'E-108',
    contactName: 'Sarah Williams',
    contactInitials: 'SW',
    contactColor: '#EC4899',
    lastMessage: 'Hi, I need to request a change in the installation date from Friday to Monday...',
    lastMessageTime: 'Yesterday',
    isUnread: false,
    isStarred: true,
    messageCount: 8
  },
  {
    id: 'conv-005',
    contactType: 'customer',
    contactId: 'C-1055',
    contactName: 'David Chen',
    contactInitials: 'DC',
    contactColor: '#3B82F6',
    lastMessage: 'Can you send me an updated invoice for the additional materials?',
    lastMessageTime: 'Dec 20',
    isUnread: false,
    isStarred: false,
    linkedJob: { id: 'job-005', name: 'Chen Office Renovation' },
    messageCount: 7
  },
  {
    id: 'conv-006',
    contactType: 'employee',
    contactId: 'E-112',
    contactName: 'Carlos Martinez',
    contactInitials: 'CM',
    contactColor: '#F97316',
    lastMessage: 'Hey, can you cover my shift tomorrow morning? I have a doctor appointment.',
    lastMessageTime: 'Dec 19',
    isUnread: false,
    isStarred: false,
    messageCount: 4
  }
];

// ============ MAIN COMPONENT ============

export function EmployeeMessagesScreen({ onOpenConversation }: EmployeeMessagesScreenProps) {
  const { colors } = useTheme();
  const [activeFilter, setActiveFilter] = useState<MessageFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState(sampleConversations);

  // Filter conversations based on active filter and search
  const filteredConversations = conversations.filter(conv => {
    // Apply filter
    if (activeFilter === 'customers' && conv.contactType !== 'customer') return false;
    if (activeFilter === 'team' && conv.contactType !== 'employee') return false;
    if (activeFilter === 'starred' && !conv.isStarred) return false;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        conv.contactName.toLowerCase().includes(query) ||
        conv.lastMessage.toLowerCase().includes(query) ||
        conv.linkedJob?.name.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Toggle starred status
  const toggleStar = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(prev => 
      prev.map(conv => 
        conv.id === convId ? { ...conv, isStarred: !conv.isStarred } : conv
      )
    );
  };

  // Count unread messages
  const unreadCount = conversations.filter(c => c.isUnread).length;
  const customerUnread = conversations.filter(c => c.isUnread && c.contactType === 'customer').length;
  const teamUnread = conversations.filter(c => c.isUnread && c.contactType === 'employee').length;

  return (
    <div style={{ 
      padding: '60px 0 100px',
      minHeight: '100vh',
      backgroundColor: colors.background
    }}>
      {/* Header */}
      <div style={{
        padding: '0 20px 16px 100px',
        borderBottom: `1px solid ${colors.border}`
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '700', 
          color: colors.text,
          margin: '0 0 4px 0'
        }}>
          Messages
        </h1>
        <p style={{ 
          fontSize: '14px', 
          color: colors.textSecondary,
          margin: 0
        }}>
                    {conversations.filter(c => c.contactType === 'employee').length} teams • {conversations.filter(c => c.contactType === 'customer').length} customers
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 16px',
          backgroundColor: colors.backgroundSecondary,
          borderRadius: '12px',
          border: `1px solid ${colors.border}`
        }}>
          <span style={{ fontSize: '18px', opacity: 0.5 }}>🔍</span>
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              color: colors.text,
              fontSize: '15px'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                background: 'none',
                border: 'none',
                color: colors.textSecondary,
                cursor: 'pointer',
                padding: '4px',
                fontSize: '16px'
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '0 20px 16px',
        overflowX: 'auto'
      }}>
        <FilterTab
          label="All"
          count={unreadCount}
          isActive={activeFilter === 'all'}
          onClick={() => setActiveFilter('all')}
          colors={colors}
        />
        <FilterTab
          label="Customers"
          count={customerUnread}
          isActive={activeFilter === 'customers'}
          onClick={() => setActiveFilter('customers')}
          colors={colors}
        />
        <FilterTab
          label="Team"
          count={teamUnread}
          isActive={activeFilter === 'team'}
          onClick={() => setActiveFilter('team')}
          colors={colors}
        />
        <FilterTab
          label="Starred"
          isActive={activeFilter === 'starred'}
          onClick={() => setActiveFilter('starred')}
          colors={colors}
        />
      </div>

      {/* Conversations List */}
      <div style={{ padding: '0 20px' }}>
        {filteredConversations.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: colors.textSecondary
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
            <p style={{ fontSize: '16px', margin: 0 }}>
              {searchQuery ? 'No messages found' : 'No messages yet'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredConversations.map(conversation => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                colors={colors}
                onPress={() => onOpenConversation?.(conversation.id)}
                onToggleStar={(e) => toggleStar(conversation.id, e)}
              />
            ))}
          </div>
        )}
      </div>

      {/* New Message FAB */}
      <button
        onClick={() => console.log('New message')}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '28px',
          backgroundColor: '#5C6BC0',
          border: 'none',
          boxShadow: '0 4px 12px rgba(92, 107, 192, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          color: '#FFFFFF',
          zIndex: 100
        }}
      >
        ✏️
      </button>
    </div>
  );
}

// ============ SUB-COMPONENTS ============

interface FilterTabProps {
  label: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
  colors: any;
}

function FilterTab({ label, count, isActive, onClick, colors }: FilterTabProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        borderRadius: '20px',
        border: 'none',
        backgroundColor: isActive ? '#5C6BC0' : colors.backgroundSecondary,
        color: isActive ? '#FFFFFF' : colors.textSecondary,
        fontSize: '14px',
        fontWeight: isActive ? '600' : '500',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s ease'
      }}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span style={{
          backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : '#EF4444',
          color: '#FFFFFF',
          fontSize: '11px',
          fontWeight: '600',
          padding: '2px 6px',
          borderRadius: '10px',
          minWidth: '18px',
          textAlign: 'center'
        }}>
          {count}
        </span>
      )}
    </button>
  );
}

interface ConversationItemProps {
  conversation: Conversation;
  colors: any;
  onPress: () => void;
  onToggleStar: (e: React.MouseEvent) => void;
}

function ConversationItem({ conversation, colors, onPress, onToggleStar }: ConversationItemProps) {
  const {
    contactName,
    contactInitials,
    contactColor,
    contactType,
    lastMessage,
    lastMessageTime,
    isUnread,
    isStarred,
    linkedJob
  } = conversation;

  return (
    <button
      onClick={onPress}
      style={{
        width: '100%',
        padding: '16px',
        backgroundColor: isUnread ? colors.backgroundSecondary : 'transparent',
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ display: 'flex', gap: '12px' }}>
        {/* Avatar */}
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: contactColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <span style={{
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: '700'
          }}>
            {contactInitials}
          </span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Top Row: Name + Time */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '15px',
                fontWeight: isUnread ? '700' : '600',
                color: colors.text
              }}>
                {contactName}
              </span>
              {/* Contact Type Badge */}
              <span style={{
                fontSize: '10px',
                fontWeight: '600',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: contactType === 'customer' ? '#3B82F6' : '#8B5CF6',
                color: '#FFFFFF',
                textTransform: 'uppercase'
              }}>
                {contactType === 'customer' ? 'Customer' : 'Team'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '12px',
                color: isUnread ? '#5C6BC0' : colors.textTertiary
              }}>
                {lastMessageTime}
              </span>
              {isUnread && (
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#5C6BC0'
                }} />
              )}
            </div>
          </div>

          {/* Message Preview */}
          <p style={{
            fontSize: '14px',
            color: colors.textSecondary,
            margin: '0 0 8px 0',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontWeight: isUnread ? '500' : '400'
          }}>
            {lastMessage}
          </p>

          {/* Bottom Row: Job Link + Star */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {linkedJob ? (
              <span style={{
                fontSize: '12px',
                color: colors.textTertiary,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                📎 {linkedJob.name}
              </span>
            ) : (
              <span />
            )}
            <button
              onClick={onToggleStar}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                fontSize: '18px',
                opacity: isStarred ? 1 : 0.3,
                transition: 'opacity 0.2s ease'
              }}
            >
              ⭐
            </button>
          </div>
        </div>
      </div>
    </button>
  );
}

export default EmployeeMessagesScreen;
