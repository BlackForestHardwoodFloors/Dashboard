/**
 * Employee Messages Screen - Boardroom 360
 * 
 * Three communication modes:
 * 1. Team Feed - Company-wide chat everyone can see
 * 2. Groups - Multi-person group chats
 * 3. Direct - 1-on-1 messages with customers or team
 * 
 * Theme: Matches sidebar colors
 * - Messages: Mauve/Purple #9B8AA3
 * - Comm Hub: Indigo/Blue #5C6BC0
 */

import { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { ConversationScreen } from './ConversationScreen';

// ============ THEME COLORS (Matching Sidebar) ============

const MAUVE = '#9B8AA3';              // Messages button color
const MAUVE_LIGHT = 'rgba(155, 138, 163, 0.15)';
const MAUVE_GLOW = 'rgba(155, 138, 163, 0.4)';

const INDIGO = '#5C6BC0';             // Comm Hub button color
const INDIGO_LIGHT = 'rgba(92, 107, 192, 0.15)';
const INDIGO_GLOW = 'rgba(92, 107, 192, 0.4)';

// ============ TYPES ============

type MessageTab = 'feed' | 'groups' | 'direct';
type DirectFilter = 'all' | 'customers' | 'team' | 'starred';

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  color: string;
  role: string;
  phone?: string;
  email?: string;
  isOnline?: boolean;
}

interface Contact {
  id: string;
  type: 'customer' | 'employee';
  name: string;
  initials: string;
  color: string;
  phone?: string;
  email?: string;
}

interface Job {
  id: string;
  name: string;
}

interface FeedMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderInitials: string;
  senderColor: string;
  content: string;
  timestamp: string;
  isFromMe: boolean;
}

interface GroupChat {
  id: string;
  name: string;
  members: TeamMember[];
  lastMessage: string;
  lastMessageTime: string;
  lastMessageSender: string;
  unreadCount: number;
  linkedJob?: { id: string; name: string };
}

interface Conversation {
  id: string;
  contactType: 'customer' | 'employee';
  contactId: string;
  contactName: string;
  contactInitials: string;
  contactColor: string;
  contactPhone?: string;
  contactEmail?: string;
  lastMessage: string;
  lastMessageTime: string;
  isUnread: boolean;
  isStarred: boolean;
  linkedJob?: { id: string; name: string };
  messageCount: number;
}

interface EmployeeMessagesScreenProps {
  onOpenConversation?: (conversationId: string) => void;
}

// ============ SAMPLE DATA ============

const currentUser: TeamMember = {
  id: 'E-100',
  name: 'Mike Johnson',
  initials: 'MJ',
  color: '#10B981',
  role: 'Technician',
  isOnline: true
};

const sampleTeamMembers: TeamMember[] = [
  { id: 'E-101', name: 'Mike Thompson', initials: 'MT', color: '#8B5CF6', role: 'Lead Installer', phone: '+1 (555) 234-5678', email: 'mike.t@company.com', isOnline: true },
  { id: 'E-102', name: 'Sarah Williams', initials: 'SW', color: '#EC4899', role: 'Installer', phone: '+1 (555) 345-6789', email: 'sarah.w@company.com', isOnline: true },
  { id: 'E-103', name: 'Carlos Martinez', initials: 'CM', color: '#F97316', role: 'Installer', phone: '+1 (555) 456-7890', email: 'carlos.m@company.com', isOnline: false },
  { id: 'E-104', name: 'Jessica Lee', initials: 'JL', color: '#14B8A6', role: 'Apprentice', phone: '+1 (555) 567-8901', email: 'jessica.l@company.com', isOnline: true },
  { id: 'E-105', name: 'David Brown', initials: 'DB', color: '#6366F1', role: 'Warehouse', phone: '+1 (555) 678-9012', email: 'david.b@company.com', isOnline: false },
];

const sampleContacts: Contact[] = [
  ...sampleTeamMembers.map(t => ({ ...t, type: 'employee' as const })),
  { id: 'C-1052', type: 'customer', name: 'John Anderson', initials: 'JA', color: '#F59E0B', phone: '+1 (555) 111-2222', email: 'john@anderson.com' },
  { id: 'C-1048', type: 'customer', name: 'Oak Valley Supplies', initials: 'OV', color: '#10B981', phone: '+1 (555) 222-3333', email: 'orders@oakvalley.com' },
  { id: 'C-1055', type: 'customer', name: 'David Chen', initials: 'DC', color: '#3B82F6', phone: '+1 (555) 333-4444', email: 'david.chen@email.com' },
];

const sampleJobs: Job[] = [
  { id: 'job-001', name: 'Anderson Residence' },
  { id: 'job-002', name: 'Thompson Office' },
  { id: 'job-003', name: 'Martinez Residence' },
  { id: 'job-004', name: 'Chen Office Renovation' },
];

const sampleFeedMessages: FeedMessage[] = [
  { id: 'feed-1', senderId: 'E-101', senderName: 'Mike Thompson', senderInitials: 'MT', senderColor: '#8B5CF6', content: 'Just finished the Anderson job! Heading to Wilson next.', timestamp: '10:30 AM', isFromMe: false },
  { id: 'feed-2', senderId: 'E-102', senderName: 'Sarah Williams', senderInitials: 'SW', senderColor: '#EC4899', content: 'Running about 15 min late to Thompson Office. Traffic on I-90.', timestamp: '10:15 AM', isFromMe: false },
  { id: 'feed-3', senderId: 'E-100', senderName: 'Mike Johnson', senderInitials: 'MJ', senderColor: '#10B981', content: 'Anyone have extra underlayment? I\'m short about 50 sq ft.', timestamp: '9:45 AM', isFromMe: true },
  { id: 'feed-4', senderId: 'E-103', senderName: 'Carlos Martinez', senderInitials: 'CM', senderColor: '#F97316', content: 'I\'ve got extra at the warehouse. Can drop it off after lunch.', timestamp: '9:50 AM', isFromMe: false },
  { id: 'feed-5', senderId: 'E-100', senderName: 'Mike Johnson', senderInitials: 'MJ', senderColor: '#10B981', content: 'Perfect, thanks Carlos! 🙏', timestamp: '9:52 AM', isFromMe: true },
  { id: 'feed-6', senderId: 'E-104', senderName: 'Jessica Lee', senderInitials: 'JL', senderColor: '#14B8A6', content: 'Good morning everyone! Ready for a great day 💪', timestamp: '8:00 AM', isFromMe: false },
];

const sampleGroups: GroupChat[] = [
  {
    id: 'grp-001',
    name: 'Anderson Job Crew',
    members: [sampleTeamMembers[0], sampleTeamMembers[1]],
    lastMessage: 'All materials loaded and ready for tomorrow',
    lastMessageTime: 'Yesterday',
    lastMessageSender: 'Mike T.',
    unreadCount: 0,
    linkedJob: { id: 'job-001', name: 'Anderson Residence' }
  },
  {
    id: 'grp-002',
    name: 'Installers',
    members: [sampleTeamMembers[0], sampleTeamMembers[1], sampleTeamMembers[2]],
    lastMessage: 'Schedule updated for next week',
    lastMessageTime: 'Dec 20',
    lastMessageSender: 'Sarah W.',
    unreadCount: 3,
  },
  {
    id: 'grp-003',
    name: 'Morning Crew',
    members: [sampleTeamMembers[1], sampleTeamMembers[3]],
    lastMessage: 'See everyone at 7am!',
    lastMessageTime: 'Dec 19',
    lastMessageSender: 'Jessica L.',
    unreadCount: 0,
  },
];

const sampleConversations: Conversation[] = [
  {
    id: 'conv-001', contactType: 'customer', contactId: 'C-1052', contactName: 'John Anderson',
    contactInitials: 'JA', contactColor: '#F59E0B', contactPhone: '+1 (555) 111-2222', contactEmail: 'john@anderson.com',
    lastMessage: 'Thank you for the detailed quote. We would like to proceed with the installation next week...',
    lastMessageTime: '10:30 AM', isUnread: true, isStarred: true,
    linkedJob: { id: 'job-001', name: 'Anderson Residence' }, messageCount: 5
  },
  {
    id: 'conv-002', contactType: 'customer', contactId: 'C-1048', contactName: 'Oak Valley Supplies',
    contactInitials: 'OV', contactColor: '#10B981', contactPhone: '+1 (555) 222-3333', contactEmail: 'orders@oakvalley.com',
    lastMessage: 'Your order for 500 sq ft of Red Oak hardwood has been confirmed and will ship...',
    lastMessageTime: '9:15 AM', isUnread: true, isStarred: false, messageCount: 3
  },
];

// ============ MAIN COMPONENT ============

export function EmployeeMessagesScreen({ onOpenConversation }: EmployeeMessagesScreenProps) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<MessageTab>('feed');
  const [directFilter, setDirectFilter] = useState<DirectFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedMessages, setFeedMessages] = useState(sampleFeedMessages);
  const [groups, setGroups] = useState(sampleGroups);
  const [conversations, setConversations] = useState(sampleConversations);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [newFeedMessage, setNewFeedMessage] = useState('');
  const feedEndRef = useRef<HTMLDivElement>(null);

  // Scroll feed to bottom
  useEffect(() => {
    if (activeTab === 'feed') {
      feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [feedMessages, activeTab]);

  // Send feed message
  const handleSendFeedMessage = () => {
    if (!newFeedMessage.trim()) return;
    const msg: FeedMessage = {
      id: `feed-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderInitials: currentUser.initials,
      senderColor: currentUser.color,
      content: newFeedMessage.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      isFromMe: true
    };
    setFeedMessages(prev => [...prev, msg]);
    setNewFeedMessage('');
  };

  // Create new group
  const handleCreateGroup = (name: string, memberIds: string[], jobId?: string) => {
    const members = sampleTeamMembers.filter(m => memberIds.includes(m.id));
    const job = jobId ? sampleJobs.find(j => j.id === jobId) : undefined;
    const newGroup: GroupChat = {
      id: `grp-${Date.now()}`,
      name,
      members,
      lastMessage: 'Group created',
      lastMessageTime: 'Just now',
      lastMessageSender: currentUser.name,
      unreadCount: 0,
      linkedJob: job ? { id: job.id, name: job.name } : undefined
    };
    setGroups(prev => [newGroup, ...prev]);
    setShowGroupModal(false);
  };

  // Get active conversation for ConversationScreen
  const activeConversation = conversations.find(c => c.id === activeConversationId);

  // If viewing a direct conversation
  if (activeConversation) {
    const contact: Contact = {
      id: activeConversation.contactId,
      type: activeConversation.contactType,
      name: activeConversation.contactName,
      initials: activeConversation.contactInitials,
      color: activeConversation.contactColor,
      phone: activeConversation.contactPhone,
      email: activeConversation.contactEmail
    };
    return (
      <ConversationScreen
        conversationId={activeConversation.id}
        contact={contact}
        linkedJob={activeConversation.linkedJob}
        onBack={() => setActiveConversationId(null)}
        onViewJob={(jobId) => console.log('View job:', jobId)}
      />
    );
  }

  return (
    <div style={{ 
      padding: '60px 0 100px',
      minHeight: '100vh',
      backgroundColor: colors.background
    }}>
      {/* Header */}
      <div style={{ padding: '0 20px 16px', borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: `linear-gradient(135deg, ${MAUVE} 0%, ${INDIGO} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '20px' }}>💬</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: colors.text, margin: 0 }}>
            Messages
          </h1>
        </div>
        <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0, marginLeft: '52px' }}>
          Team feed, groups, and direct messages
        </p>
      </div>

      {/* Main Tabs: Feed / Groups / Direct */}
      <div style={{
        display: 'flex',
        borderBottom: `1px solid ${colors.border}`,
        backgroundColor: colors.backgroundSecondary
      }}>
        <TabButton label="Team Feed" icon="📢" isActive={activeTab === 'feed'} onClick={() => setActiveTab('feed')} colors={colors} />
        <TabButton label="Groups" icon="👥" isActive={activeTab === 'groups'} onClick={() => setActiveTab('groups')} badge={groups.reduce((acc, g) => acc + g.unreadCount, 0)} colors={colors} />
        <TabButton label="Direct" icon="💬" isActive={activeTab === 'direct'} onClick={() => setActiveTab('direct')} badge={conversations.filter(c => c.isUnread).length} colors={colors} />
      </div>

      {/* Tab Content */}
      {activeTab === 'feed' && (
        <TeamFeedView
          messages={feedMessages}
          newMessage={newFeedMessage}
          onNewMessageChange={setNewFeedMessage}
          onSend={handleSendFeedMessage}
          feedEndRef={feedEndRef}
          colors={colors}
          teamMembers={sampleTeamMembers}
        />
      )}

      {activeTab === 'groups' && (
        <GroupsView
          groups={groups}
          colors={colors}
          onCreateGroup={() => setShowGroupModal(true)}
          onOpenGroup={(id) => setActiveGroupId(id)}
        />
      )}

      {activeTab === 'direct' && (
        <DirectView
          conversations={conversations}
          filter={directFilter}
          onFilterChange={setDirectFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          colors={colors}
          onOpenConversation={(id) => {
            setConversations(prev => prev.map(c => c.id === id ? { ...c, isUnread: false } : c));
            setActiveConversationId(id);
          }}
          onToggleStar={(id) => setConversations(prev => prev.map(c => c.id === id ? { ...c, isStarred: !c.isStarred } : c))}
          onCompose={() => setShowComposeModal(true)}
        />
      )}

      {/* Create Group Modal */}
      {showGroupModal && (
        <CreateGroupModal
          colors={colors}
          teamMembers={sampleTeamMembers}
          jobs={sampleJobs}
          onClose={() => setShowGroupModal(false)}
          onCreate={handleCreateGroup}
        />
      )}

      {/* Compose Direct Message Modal */}
      {showComposeModal && (
        <ComposeModal
          colors={colors}
          contacts={sampleContacts}
          jobs={sampleJobs}
          onClose={() => setShowComposeModal(false)}
          onSend={(contactId, message, jobId) => {
            console.log('Send to:', contactId, message, jobId);
            setShowComposeModal(false);
          }}
        />
      )}
    </div>
  );
}

// ============ TAB BUTTON ============

function TabButton({ label, icon, isActive, onClick, badge, colors }: {
  label: string; icon: string; isActive: boolean; onClick: () => void; badge?: number; colors: any;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '14px 12px',
        backgroundColor: isActive ? MAUVE_LIGHT : 'transparent',
        border: 'none',
        borderBottom: isActive ? `3px solid ${MAUVE}` : '3px solid transparent',
        color: isActive ? MAUVE : colors.textSecondary,
        fontSize: '14px',
        fontWeight: isActive ? '600' : '500',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        transition: 'all 0.2s ease'
      }}
    >
      <span>{icon}</span>
      {label}
      {badge !== undefined && badge > 0 && (
        <span style={{
          backgroundColor: INDIGO,
          color: '#FFFFFF',
          fontSize: '10px',
          fontWeight: '700',
          padding: '2px 6px',
          borderRadius: '10px',
          minWidth: '18px'
        }}>
          {badge}
        </span>
      )}
    </button>
  );
}

// ============ TEAM FEED VIEW ============

function TeamFeedView({ messages, newMessage, onNewMessageChange, onSend, feedEndRef, colors, teamMembers }: {
  messages: FeedMessage[]; newMessage: string; onNewMessageChange: (val: string) => void;
  onSend: () => void; feedEndRef: React.RefObject<HTMLDivElement>; colors: any; teamMembers: TeamMember[];
}) {
  const onlineCount = teamMembers.filter(m => m.isOnline).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)' }}>
      {/* Online indicator */}
      <div style={{
        padding: '12px 20px',
        background: `linear-gradient(90deg, ${MAUVE_LIGHT} 0%, ${INDIGO_LIGHT} 100%)`,
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
        <span style={{ fontSize: '13px', color: colors.text, fontWeight: '500' }}>
          {onlineCount} team members online
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '-8px' }}>
          {teamMembers.filter(m => m.isOnline).slice(0, 4).map((m, i) => (
            <div key={m.id} style={{
              width: '28px', height: '28px', borderRadius: '50%', backgroundColor: m.color,
              border: `2px solid ${colors.background}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginLeft: i > 0 ? '-8px' : 0, zIndex: 4 - i
            }}>
              <span style={{ color: '#fff', fontSize: '10px', fontWeight: '700' }}>{m.initials}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '16px',
            flexDirection: msg.isFromMe ? 'row-reverse' : 'row'
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%', backgroundColor: msg.senderColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <span style={{ color: '#fff', fontSize: '14px', fontWeight: '700' }}>{msg.senderInitials}</span>
            </div>
            <div style={{ maxWidth: '70%' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px',
                flexDirection: msg.isFromMe ? 'row-reverse' : 'row'
              }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: colors.text }}>{msg.senderName}</span>
                <span style={{ fontSize: '11px', color: colors.textTertiary }}>{msg.timestamp}</span>
              </div>
              <div style={{
                padding: '12px 16px',
                backgroundColor: msg.isFromMe ? INDIGO : colors.backgroundSecondary,
                borderRadius: msg.isFromMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                border: msg.isFromMe ? 'none' : `1px solid ${colors.border}`
              }}>
                <p style={{ margin: 0, fontSize: '14px', color: msg.isFromMe ? '#FFFFFF' : colors.text, lineHeight: '1.4' }}>
                  {msg.content}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={feedEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 20px',
        backgroundColor: colors.backgroundSecondary,
        borderTop: `1px solid ${colors.border}`,
        display: 'flex', gap: '12px', alignItems: 'center'
      }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => onNewMessageChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSend()}
          placeholder="Message the team..."
          style={{
            flex: 1, padding: '12px 16px', borderRadius: '24px',
            border: `1px solid ${colors.border}`, backgroundColor: colors.background,
            color: colors.text, fontSize: '14px', outline: 'none'
          }}
        />
        <button
          onClick={onSend}
          disabled={!newMessage.trim()}
          style={{
            width: '44px', height: '44px', borderRadius: '50%', border: 'none',
            background: newMessage.trim() ? `linear-gradient(135deg, ${MAUVE} 0%, ${INDIGO} 100%)` : colors.border,
            color: '#FFFFFF',
            fontSize: '18px', cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
            boxShadow: newMessage.trim() ? `0 4px 12px ${INDIGO_GLOW}` : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

// ============ GROUPS VIEW ============

function GroupsView({ groups, colors, onCreateGroup, onOpenGroup }: {
  groups: GroupChat[]; colors: any; onCreateGroup: () => void; onOpenGroup: (id: string) => void;
}) {
  return (
    <div style={{ padding: '16px 20px' }}>
      {/* Create Group Button */}
      <button
        onClick={onCreateGroup}
        style={{
          width: '100%', padding: '14px', marginBottom: '16px',
          background: `linear-gradient(135deg, ${MAUVE} 0%, ${INDIGO} 100%)`,
          border: 'none', borderRadius: '12px',
          color: '#FFFFFF', fontSize: '15px', fontWeight: '600', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          boxShadow: `0 4px 12px ${INDIGO_GLOW}`,
          transition: 'all 0.2s ease'
        }}
      >
        ➕ Create New Group
      </button>

      {/* Groups List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {groups.map(group => (
          <button
            key={group.id}
            onClick={() => onOpenGroup(group.id)}
            style={{
              width: '100%', padding: '16px', backgroundColor: colors.backgroundSecondary,
              border: `1px solid ${colors.border}`, borderRadius: '12px',
              cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* Member Avatars Stack */}
              <div style={{ position: 'relative', width: '48px', height: '48px' }}>
                {group.members.slice(0, 3).map((m, i) => (
                  <div key={m.id} style={{
                    position: 'absolute',
                    top: i * 8, left: i * 8,
                    width: '32px', height: '32px', borderRadius: '50%',
                    backgroundColor: m.color, border: `2px solid ${colors.backgroundSecondary}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 3 - i
                  }}>
                    <span style={{ color: '#fff', fontSize: '10px', fontWeight: '700' }}>{m.initials}</span>
                  </div>
                ))}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '15px', fontWeight: '600', color: colors.text }}>{group.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: colors.textTertiary }}>{group.lastMessageTime}</span>
                    {group.unreadCount > 0 && (
                      <span style={{
                        backgroundColor: INDIGO, color: '#FFFFFF', fontSize: '10px', fontWeight: '700',
                        padding: '2px 6px', borderRadius: '10px', minWidth: '18px', textAlign: 'center'
                      }}>
                        {group.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
                <p style={{
                  margin: 0, fontSize: '13px', color: colors.textSecondary,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                  <strong>{group.lastMessageSender}:</strong> {group.lastMessage}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <span style={{ fontSize: '11px', color: colors.textTertiary }}>
                    👥 {group.members.length} members
                  </span>
                  {group.linkedJob && (
                    <span style={{ fontSize: '11px', color: MAUVE }}>
                      📎 {group.linkedJob.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ DIRECT VIEW ============

function DirectView({ conversations, filter, onFilterChange, searchQuery, onSearchChange, colors, onOpenConversation, onToggleStar, onCompose }: {
  conversations: Conversation[]; filter: DirectFilter; onFilterChange: (f: DirectFilter) => void;
  searchQuery: string; onSearchChange: (q: string) => void; colors: any;
  onOpenConversation: (id: string) => void; onToggleStar: (id: string) => void; onCompose: () => void;
}) {
  const filtered = conversations.filter(conv => {
    if (filter === 'customers' && conv.contactType !== 'customer') return false;
    if (filter === 'team' && conv.contactType !== 'employee') return false;
    if (filter === 'starred' && !conv.isStarred) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return conv.contactName.toLowerCase().includes(q) || conv.lastMessage.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      {/* Search */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px',
          backgroundColor: colors.backgroundSecondary, borderRadius: '12px', border: `1px solid ${colors.border}`
        }}>
          <span style={{ fontSize: '18px', opacity: 0.5 }}>🔍</span>
          <input
            type="text" placeholder="Search messages..." value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent', color: colors.text, fontSize: '15px' }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', padding: '0 20px 16px', overflowX: 'auto' }}>
        {(['all', 'customers', 'team', 'starred'] as DirectFilter[]).map(f => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            style={{
              padding: '8px 16px', borderRadius: '20px', border: 'none',
              background: filter === f ? `linear-gradient(135deg, ${MAUVE} 0%, ${INDIGO} 100%)` : colors.backgroundSecondary,
              color: filter === f ? '#FFFFFF' : colors.textSecondary,
              fontSize: '14px', fontWeight: filter === f ? '600' : '500', cursor: 'pointer',
              textTransform: 'capitalize', whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Conversations */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map(conv => (
          <button
            key={conv.id}
            onClick={() => onOpenConversation(conv.id)}
            style={{
              width: '100%', padding: '16px',
              backgroundColor: conv.isUnread ? MAUVE_LIGHT : 'transparent',
              border: `1px solid ${conv.isUnread ? MAUVE : colors.border}`, borderRadius: '12px',
              cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%', backgroundColor: conv.contactColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <span style={{ color: '#fff', fontSize: '16px', fontWeight: '700' }}>{conv.contactInitials}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: conv.isUnread ? '700' : '600', color: colors.text }}>{conv.contactName}</span>
                    <span style={{
                      fontSize: '10px', fontWeight: '600', padding: '2px 6px', borderRadius: '4px',
                      backgroundColor: conv.contactType === 'customer' ? '#3B82F6' : '#8B5CF6', color: '#fff', textTransform: 'uppercase'
                    }}>
                      {conv.contactType === 'customer' ? 'Customer' : 'Team'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: conv.isUnread ? INDIGO : colors.textTertiary }}>{conv.lastMessageTime}</span>
                    {conv.isUnread && (
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: INDIGO }} />
                    )}
                  </div>
                </div>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: colors.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {conv.lastMessage}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {conv.linkedJob ? (
                    <span style={{ fontSize: '12px', color: MAUVE }}>📎 {conv.linkedJob.name}</span>
                  ) : <span />}
                  <span
                    onClick={(e) => { e.stopPropagation(); onToggleStar(conv.id); }}
                    style={{ fontSize: '18px', opacity: conv.isStarred ? 1 : 0.3, cursor: 'pointer' }}
                  >⭐</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={onCompose}
        style={{
          position: 'fixed', bottom: '100px', right: '20px',
          width: '56px', height: '56px', borderRadius: '28px',
          background: `linear-gradient(135deg, ${MAUVE} 0%, ${INDIGO} 100%)`,
          border: 'none', 
          boxShadow: `0 4px 16px ${INDIGO_GLOW}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', color: '#FFFFFF', zIndex: 100,
          transition: 'all 0.2s ease'
        }}
      >
        ✏️
      </button>
    </div>
  );
}

// ============ CREATE GROUP MODAL ============

function CreateGroupModal({ colors, teamMembers, jobs, onClose, onCreate }: {
  colors: any; teamMembers: TeamMember[]; jobs: Job[];
  onClose: () => void; onCreate: (name: string, memberIds: string[], jobId?: string) => void;
}) {
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState('');

  const toggleMember = (id: string) => {
    setSelectedMembers(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        backgroundColor: colors.backgroundSecondary, borderRadius: '16px',
        width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'hidden',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '20px', 
          borderBottom: `1px solid ${colors.border}`, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: `linear-gradient(90deg, ${MAUVE_LIGHT} 0%, ${INDIGO_LIGHT} 100%)`
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: colors.text, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>👥</span> Create Group
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', color: colors.textSecondary, cursor: 'pointer' }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
          {/* Group Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.textSecondary, marginBottom: '8px' }}>Group Name</label>
            <input
              type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., Anderson Job Crew"
              style={{
                width: '100%', padding: '14px 16px', backgroundColor: colors.background,
                border: `1px solid ${colors.border}`, borderRadius: '10px', color: colors.text,
                fontSize: '15px', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Select Members */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.textSecondary, marginBottom: '8px' }}>
              Select Team Members ({selectedMembers.length} selected)
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {teamMembers.map(member => (
                <button
                  key={member.id}
                  onClick={() => toggleMember(member.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                    backgroundColor: selectedMembers.includes(member.id) ? INDIGO_LIGHT : colors.background,
                    border: `2px solid ${selectedMembers.includes(member.id) ? INDIGO : colors.border}`,
                    borderRadius: '10px', cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '4px',
                    backgroundColor: selectedMembers.includes(member.id) ? INDIGO : 'transparent',
                    border: `2px solid ${selectedMembers.includes(member.id) ? INDIGO : colors.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {selectedMembers.includes(member.id) && <span style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: '700' }}>✓</span>}
                  </div>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', backgroundColor: member.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <span style={{ color: '#fff', fontSize: '12px', fontWeight: '700' }}>{member.initials}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: colors.text }}>{member.name}</div>
                    <div style={{ fontSize: '12px', color: colors.textTertiary }}>{member.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Link to Job */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.textSecondary, marginBottom: '8px' }}>
              Link to Job (optional)
            </label>
            <select
              value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)}
              style={{
                width: '100%', padding: '14px 16px', backgroundColor: colors.background,
                border: `1px solid ${colors.border}`, borderRadius: '10px',
                color: selectedJob ? colors.text : colors.textTertiary, fontSize: '15px', cursor: 'pointer', outline: 'none'
              }}
            >
              <option value="">No job linked</option>
              {jobs.map(job => <option key={job.id} value={job.id}>{job.name}</option>)}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${colors.border}`, display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '14px', borderRadius: '10px', border: `1px solid ${colors.border}`,
            backgroundColor: 'transparent', color: colors.textSecondary, fontSize: '15px', fontWeight: '600', cursor: 'pointer'
          }}>Cancel</button>
          <button
            onClick={() => onCreate(groupName, selectedMembers, selectedJob || undefined)}
            disabled={!groupName.trim() || selectedMembers.length < 1}
            style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: (!groupName.trim() || selectedMembers.length < 1) ? '#4B5563' : `linear-gradient(135deg, ${MAUVE} 0%, ${INDIGO} 100%)`,
              color: '#FFFFFF',
              fontSize: '15px', fontWeight: '600',
              cursor: (!groupName.trim() || selectedMembers.length < 1) ? 'not-allowed' : 'pointer',
              opacity: (!groupName.trim() || selectedMembers.length < 1) ? 0.6 : 1,
              boxShadow: (!groupName.trim() || selectedMembers.length < 1) ? 'none' : `0 4px 12px ${INDIGO_GLOW}`
            }}
          >Create Group</button>
        </div>
      </div>
    </div>
  );
}

// ============ COMPOSE MODAL ============

function ComposeModal({ colors, contacts, jobs, onClose, onSend }: {
  colors: any; contacts: Contact[]; jobs: Job[];
  onClose: () => void; onSend: (contactId: string, message: string, jobId?: string) => void;
}) {
  const [selectedContactId, setSelectedContactId] = useState('');
  const [message, setMessage] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');

  const employees = contacts.filter(c => c.type === 'employee');
  const customers = contacts.filter(c => c.type === 'customer');

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        backgroundColor: colors.backgroundSecondary, borderRadius: '16px',
        width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'hidden',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ 
          padding: '20px', 
          borderBottom: `1px solid ${colors.border}`, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: `linear-gradient(90deg, ${MAUVE_LIGHT} 0%, ${INDIGO_LIGHT} 100%)`
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: colors.text, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>💬</span> New Direct Message
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', color: colors.textSecondary, cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.textSecondary, marginBottom: '8px' }}>To:</label>
            <select
              value={selectedContactId} onChange={(e) => setSelectedContactId(e.target.value)}
              style={{
                width: '100%', padding: '14px 16px', backgroundColor: colors.background,
                border: `1px solid ${colors.border}`, borderRadius: '10px',
                color: selectedContactId ? colors.text : colors.textTertiary, fontSize: '15px', outline: 'none'
              }}
            >
              <option value="">Select recipient...</option>
              <optgroup label="👷 Team Members">
                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </optgroup>
              <optgroup label="👤 Customers">
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </optgroup>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.textSecondary, marginBottom: '8px' }}>Link to Job (optional):</label>
            <select
              value={selectedJobId} onChange={(e) => setSelectedJobId(e.target.value)}
              style={{
                width: '100%', padding: '14px 16px', backgroundColor: colors.background,
                border: `1px solid ${colors.border}`, borderRadius: '10px',
                color: selectedJobId ? colors.text : colors.textTertiary, fontSize: '15px', outline: 'none'
              }}
            >
              <option value="">No job linked</option>
              {jobs.map(job => <option key={job.id} value={job.id}>{job.name}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.textSecondary, marginBottom: '8px' }}>Message:</label>
            <textarea
              value={message} onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              style={{
                width: '100%', minHeight: '100px', padding: '14px 16px', backgroundColor: colors.background,
                border: `1px solid ${colors.border}`, borderRadius: '10px', color: colors.text,
                fontSize: '15px', resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit'
              }}
            />
          </div>
        </div>

        <div style={{ padding: '16px 20px', borderTop: `1px solid ${colors.border}`, display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '14px', borderRadius: '10px', border: `1px solid ${colors.border}`,
            backgroundColor: 'transparent', color: colors.textSecondary, fontSize: '15px', fontWeight: '600', cursor: 'pointer'
          }}>Cancel</button>
          <button
            onClick={() => onSend(selectedContactId, message.trim(), selectedJobId || undefined)}
            disabled={!selectedContactId || !message.trim()}
            style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: (!selectedContactId || !message.trim()) ? '#4B5563' : `linear-gradient(135deg, ${MAUVE} 0%, ${INDIGO} 100%)`,
              color: '#FFFFFF',
              fontSize: '15px', fontWeight: '600',
              cursor: (!selectedContactId || !message.trim()) ? 'not-allowed' : 'pointer',
              opacity: (!selectedContactId || !message.trim()) ? 0.6 : 1,
              boxShadow: (!selectedContactId || !message.trim()) ? 'none' : `0 4px 12px ${INDIGO_GLOW}`
            }}
          >Send</button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeMessagesScreen;
