/**
 * Employee Messages Screen - Boardroom 360
 * 
 * Features:
 * - Team Feed: Multi-select teams AND employees to broadcast
 * - Groups: Tap to open chat
 * - Direct: Tap to open chat
 * - Attachments, Emojis, GIFs
 */

import { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider';

// ============ THEME COLORS ============
const MAUVE = '#9B8AA3';
const MAUVE_LIGHT = 'rgba(155, 138, 163, 0.15)';
const INDIGO = '#5C6BC0';
const INDIGO_LIGHT = 'rgba(92, 107, 192, 0.15)';
const INDIGO_GLOW = 'rgba(92, 107, 192, 0.4)';
const TEAL = '#14B8A6';
const TEAL_LIGHT = 'rgba(20, 184, 166, 0.15)';

// ============ TYPES ============
type MainTab = 'feed' | 'groups' | 'direct';

interface Employee {
  id: string;
  name: string;
  initials: string;
  color: string;
  role: string;
  isOnline: boolean;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderInitials: string;
  senderColor: string;
  content: string;
  timestamp: string;
  isFromMe: boolean;
  attachments?: Attachment[];
}

interface Attachment {
  id: string;
  type: 'image' | 'file' | 'gif';
  url: string;
  name: string;
  thumbnail?: string;
}

interface Group {
  id: string;
  name: string;
  members: Employee[];
  linkedJob?: string;
  messages: Message[];
}

interface DirectConversation {
  id: string;
  contactName: string;
  contactInitials: string;
  contactColor: string;
  contactType: 'customer' | 'employee';
  lastMessage: string;
  lastMessageTime: string;
  isUnread: boolean;
  messages: Message[];
}

interface FeedPost {
  id: string;
  senderName: string;
  senderInitials: string;
  senderColor: string;
  content: string;
  timestamp: string;
  recipients: string;
}

// ============ EMOJI DATA ============
const EMOJI_CATEGORIES = {
  'Smileys': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😋', '😛', '😜', '🤪', '😝', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕'],
  'Gestures': ['👍', '👎', '👌', '🤌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪', '🦾', '🦿'],
  'Objects': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '⭐', '🌟', '✨', '💫', '🔥', '💯', '✅', '❌', '⚠️', '📌', '📎', '🔗'],
  'Work': ['💼', '📁', '📂', '🗂️', '📅', '📆', '🗓️', '📇', '📈', '📉', '📊', '📋', '📌', '📍', '📎', '🖇️', '📏', '📐', '✂️', '🗃️', '🗄️', '🗑️', '🔒', '🔓', '🔑', '🔨', '🪓', '⛏️', '🔧', '🔩']
};

// ============ SAMPLE GIFS ============
const SAMPLE_GIFS = [
  { id: 'gif1', url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif', name: 'Thumbs Up' },
  { id: 'gif2', url: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif', name: 'Celebration' },
  { id: 'gif3', url: 'https://media.giphy.com/media/l4q8cJzGdR9J8w3hS/giphy.gif', name: 'Good Job' },
  { id: 'gif4', url: 'https://media.giphy.com/media/XreQmk7ETCak0/giphy.gif', name: 'Clapping' },
  { id: 'gif5', url: 'https://media.giphy.com/media/3oz8xIsloV7zOmt81G/giphy.gif', name: 'Thank You' },
  { id: 'gif6', url: 'https://media.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif', name: 'High Five' },
];

// ============ CURRENT USER ============
const currentUser = {
  id: 'E-100',
  name: 'Mike Johnson',
  initials: 'MJ',
  color: '#10B981'
};

// ============ SAMPLE DATA ============
const employees: Employee[] = [
  { id: 'E-101', name: 'Mike Thompson', initials: 'MT', color: '#8B5CF6', role: 'Lead Installer', isOnline: true },
  { id: 'E-102', name: 'Sarah Williams', initials: 'SW', color: '#EC4899', role: 'Installer', isOnline: true },
  { id: 'E-103', name: 'Carlos Martinez', initials: 'CM', color: '#F97316', role: 'Installer', isOnline: false },
  { id: 'E-104', name: 'Jessica Lee', initials: 'JL', color: '#14B8A6', role: 'Apprentice', isOnline: true },
  { id: 'E-105', name: 'David Brown', initials: 'DB', color: '#6366F1', role: 'Warehouse', isOnline: false },
];

const initialGroups: Group[] = [
  {
    id: 'grp-001',
    name: 'Anderson Job Crew',
    members: [employees[0], employees[1]],
    linkedJob: 'Anderson Residence',
    messages: [
      { id: 'm1', senderId: 'E-101', senderName: 'Mike Thompson', senderInitials: 'MT', senderColor: '#8B5CF6', content: 'All materials loaded and ready for tomorrow', timestamp: '10:30 AM', isFromMe: false },
      { id: 'm2', senderId: 'E-102', senderName: 'Sarah Williams', senderInitials: 'SW', senderColor: '#EC4899', content: 'Great! I\'ll pick up the extra trim pieces on my way.', timestamp: '10:35 AM', isFromMe: false },
      { id: 'm3', senderId: 'E-100', senderName: 'Mike Johnson', senderInitials: 'MJ', senderColor: '#10B981', content: 'Perfect. Let\'s meet at the job site at 7:30 AM.', timestamp: '10:40 AM', isFromMe: true },
    ]
  },
  {
    id: 'grp-002',
    name: 'Installers',
    members: [employees[0], employees[1], employees[2]],
    messages: [
      { id: 'm10', senderId: 'E-102', senderName: 'Sarah Williams', senderInitials: 'SW', senderColor: '#EC4899', content: 'Schedule updated for next week', timestamp: 'Yesterday', isFromMe: false },
    ]
  },
  {
    id: 'grp-003',
    name: 'Morning Crew',
    members: [employees[1], employees[3]],
    messages: [
      { id: 'm20', senderId: 'E-104', senderName: 'Jessica Lee', senderInitials: 'JL', senderColor: '#14B8A6', content: 'See everyone at 7am!', timestamp: 'Dec 19', isFromMe: false },
    ]
  },
];

const initialFeedPosts: FeedPost[] = [
  { id: 'fp-1', senderName: 'Mike Johnson', senderInitials: 'MJ', senderColor: '#10B981', content: 'Meeting at 3pm today. Please confirm attendance.', timestamp: '10:30 AM', recipients: 'All Team' },
  { id: 'fp-2', senderName: 'Sarah Williams', senderInitials: 'SW', senderColor: '#EC4899', content: 'New safety protocols start Monday. Check your email!', timestamp: 'Yesterday', recipients: 'Installers' },
];

const initialDirectConversations: DirectConversation[] = [
  {
    id: 'dm-001',
    contactName: 'John Anderson',
    contactInitials: 'JA',
    contactColor: '#F59E0B',
    contactType: 'customer',
    lastMessage: 'Thank you for the quote!',
    lastMessageTime: '10:30 AM',
    isUnread: true,
    messages: [
      { id: 'dm1', senderId: 'C-001', senderName: 'John Anderson', senderInitials: 'JA', senderColor: '#F59E0B', content: 'Thank you for the quote!', timestamp: '10:30 AM', isFromMe: false },
    ]
  },
  {
    id: 'dm-002',
    contactName: 'Sarah Williams',
    contactInitials: 'SW',
    contactColor: '#EC4899',
    contactType: 'employee',
    lastMessage: 'Can you cover my shift?',
    lastMessageTime: 'Yesterday',
    isUnread: false,
    messages: [
      { id: 'dm2', senderId: 'E-102', senderName: 'Sarah Williams', senderInitials: 'SW', senderColor: '#EC4899', content: 'Can you cover my shift?', timestamp: 'Yesterday', isFromMe: false },
    ]
  },
];

// ============ MAIN COMPONENT ============
export function EmployeeMessagesScreen() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<MainTab>('feed');
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [directConversations, setDirectConversations] = useState<DirectConversation[]>(initialDirectConversations);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(initialFeedPosts);
  
  // Navigation state
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const [openDirectId, setOpenDirectId] = useState<string | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showNewDM, setShowNewDM] = useState(false);

  // Find open group/DM
  const openGroup = groups.find(g => g.id === openGroupId);
  const openDirect = directConversations.find(d => d.id === openDirectId);

  // ========== RENDER GROUP CHAT ==========
  if (openGroup) {
    return (
      <ChatScreen
        title={openGroup.name}
        subtitle={`${openGroup.members.length} members${openGroup.linkedJob ? ` • 📎 ${openGroup.linkedJob}` : ''}`}
        avatars={openGroup.members.slice(0, 2)}
        messages={openGroup.messages}
        colors={colors}
        onBack={() => setOpenGroupId(null)}
        onSendMessage={(content, attachments) => {
          const newMsg: Message = {
            id: `m-${Date.now()}`,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderInitials: currentUser.initials,
            senderColor: currentUser.color,
            content,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            isFromMe: true,
            attachments
          };
          setGroups(prev => prev.map(g =>
            g.id === openGroup.id ? { ...g, messages: [...g.messages, newMsg] } : g
          ));
        }}
      />
    );
  }

  // ========== RENDER DIRECT CHAT ==========
  if (openDirect) {
    return (
      <ChatScreen
        title={openDirect.contactName}
        subtitle={openDirect.contactType === 'customer' ? 'Customer' : 'Team Member'}
        avatars={[{ initials: openDirect.contactInitials, color: openDirect.contactColor }]}
        messages={openDirect.messages}
        colors={colors}
        onBack={() => setOpenDirectId(null)}
        onSendMessage={(content, attachments) => {
          const newMsg: Message = {
            id: `dm-${Date.now()}`,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderInitials: currentUser.initials,
            senderColor: currentUser.color,
            content,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            isFromMe: true,
            attachments
          };
          setDirectConversations(prev => prev.map(d =>
            d.id === openDirect.id ? { ...d, messages: [...d.messages, newMsg], lastMessage: content, lastMessageTime: 'Just now' } : d
          ));
        }}
      />
    );
  }

  // ========== RENDER CREATE GROUP ==========
  if (showCreateGroup) {
    return (
      <CreateGroupScreen
        colors={colors}
        onBack={() => setShowCreateGroup(false)}
        onCreate={(name, memberIds, linkedJob) => {
          const members = employees.filter(e => memberIds.includes(e.id));
          const newGroup: Group = {
            id: `grp-${Date.now()}`,
            name,
            members,
            linkedJob,
            messages: []
          };
          setGroups(prev => [newGroup, ...prev]);
          setShowCreateGroup(false);
        }}
      />
    );
  }

  // ========== RENDER NEW DM ==========
  if (showNewDM) {
    return (
      <NewDirectMessageScreen
        colors={colors}
        employees={employees}
        onBack={() => setShowNewDM(false)}
        onSelectContact={(emp) => {
          const existing = directConversations.find(d => d.contactName === emp.name);
          if (existing) {
            setOpenDirectId(existing.id);
          } else {
            const newConv: DirectConversation = {
              id: `dm-${Date.now()}`,
              contactName: emp.name,
              contactInitials: emp.initials,
              contactColor: emp.color,
              contactType: 'employee',
              lastMessage: '',
              lastMessageTime: 'New',
              isUnread: false,
              messages: []
            };
            setDirectConversations(prev => [newConv, ...prev]);
            setOpenDirectId(newConv.id);
          }
          setShowNewDM(false);
        }}
      />
    );
  }

  // ========== MAIN LIST VIEW ==========
  const totalUnread = directConversations.filter(d => d.isUnread).length;

  return (
    <div style={{
      padding: '20px',
      paddingTop: '60px',
      paddingBottom: '120px',
      minHeight: '100vh',
      backgroundColor: colors.background
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: `linear-gradient(135deg, ${MAUVE} 0%, ${INDIGO} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ fontSize: '22px' }}>💬</span>
          </div>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '700', color: colors.text, margin: 0 }}>Messages</h1>
            <p style={{ fontSize: '13px', color: colors.textSecondary, margin: 0 }}>
              {groups.length} teams • {employees.filter(e => e.isOnline).length} online
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        backgroundColor: colors.backgroundSecondary,
        borderRadius: '12px',
        padding: '4px',
        marginBottom: '20px'
      }}>
        <TabButton label="Team Feed" icon="📢" isActive={activeTab === 'feed'} onClick={() => setActiveTab('feed')} colors={colors} />
        <TabButton label="Groups" icon="👥" isActive={activeTab === 'groups'} onClick={() => setActiveTab('groups')} badge={groups.length} colors={colors} />
        <TabButton label="Direct" icon="💬" isActive={activeTab === 'direct'} onClick={() => setActiveTab('direct')} badge={totalUnread} colors={colors} />
      </div>

      {/* ========== TEAM FEED TAB ========== */}
      {activeTab === 'feed' && (
        <TeamFeedTab
          groups={groups}
          employees={employees}
          feedPosts={feedPosts}
          colors={colors}
          onCreateTeam={() => setShowCreateGroup(true)}
          onSendBroadcast={(content, selectedGroupIds, selectedEmployeeIds) => {
            let recipients = '';
            if (selectedGroupIds.length > 0) {
              const groupNames = groups.filter(g => selectedGroupIds.includes(g.id)).map(g => g.name);
              recipients = groupNames.join(', ');
            }
            if (selectedEmployeeIds.length > 0) {
              const empNames = employees.filter(e => selectedEmployeeIds.includes(e.id)).map(e => e.name.split(' ')[0]);
              if (recipients) recipients += ', ';
              recipients += empNames.join(', ');
            }
            
            const newPost: FeedPost = {
              id: `fp-${Date.now()}`,
              senderName: currentUser.name,
              senderInitials: currentUser.initials,
              senderColor: currentUser.color,
              content,
              timestamp: 'Just now',
              recipients
            };
            setFeedPosts(prev => [newPost, ...prev]);
          }}
        />
      )}

      {/* ========== GROUPS TAB ========== */}
      {activeTab === 'groups' && (
        <div>
          <button
            onClick={() => setShowCreateGroup(true)}
            style={{
              width: '100%', padding: '16px', marginBottom: '16px',
              background: `linear-gradient(135deg, ${MAUVE} 0%, ${INDIGO} 100%)`,
              border: 'none', borderRadius: '12px', color: '#fff',
              fontSize: '15px', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: `0 4px 12px ${INDIGO_GLOW}`
            }}
          >
            ➕ Create New Group
          </button>

          <div style={{
            backgroundColor: colors.backgroundSecondary,
            borderRadius: '16px',
            border: `1px solid ${colors.border}`,
            overflow: 'hidden'
          }}>
            {groups.map((group, index) => {
              const lastMsg = group.messages[group.messages.length - 1];
              return (
                <button
                  key={group.id}
                  onClick={() => setOpenGroupId(group.id)}
                  style={{
                    width: '100%', padding: '16px',
                    backgroundColor: 'transparent', border: 'none',
                    borderBottom: index < groups.length - 1 ? `1px solid ${colors.border}` : 'none',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    cursor: 'pointer', textAlign: 'left'
                  }}
                >
                  <div style={{ position: 'relative', width: '50px', height: '44px', flexShrink: 0 }}>
                    {group.members.slice(0, 3).map((member, i) => (
                      <div key={member.id} style={{
                        position: 'absolute', left: i * 12, top: i * 4,
                        width: '36px', height: '36px', borderRadius: '50%',
                        backgroundColor: member.color, border: `2px solid ${colors.backgroundSecondary}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 - i
                      }}>
                        <span style={{ color: '#fff', fontSize: '11px', fontWeight: '700' }}>{member.initials}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: colors.text, marginBottom: '4px' }}>
                      {group.name}
                    </div>
                    {lastMsg && (
                      <p style={{
                        margin: '0 0 4px 0', fontSize: '14px', color: colors.textSecondary,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}>
                        <strong>{lastMsg.isFromMe ? 'You' : lastMsg.senderName.split(' ')[0]}:</strong> {lastMsg.content}
                      </p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '12px', color: colors.textTertiary }}>👥 {group.members.length} members</span>
                      {group.linkedJob && (
                        <span style={{ fontSize: '12px', color: MAUVE }}>📎 {group.linkedJob}</span>
                      )}
                    </div>
                  </div>

                  <span style={{ color: colors.textTertiary, fontSize: '20px' }}>›</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========== DIRECT MESSAGES TAB ========== */}
      {activeTab === 'direct' && (
        <div>
          <button
            onClick={() => setShowNewDM(true)}
            style={{
              width: '100%', padding: '16px', marginBottom: '16px',
              background: `linear-gradient(135deg, ${MAUVE} 0%, ${INDIGO} 100%)`,
              border: 'none', borderRadius: '12px', color: '#fff',
              fontSize: '15px', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: `0 4px 12px ${INDIGO_GLOW}`
            }}
          >
            ✏️ New Direct Message
          </button>

          <div style={{
            backgroundColor: colors.backgroundSecondary,
            borderRadius: '16px',
            border: `1px solid ${colors.border}`,
            overflow: 'hidden'
          }}>
            {directConversations.map((conv, index) => (
              <button
                key={conv.id}
                onClick={() => setOpenDirectId(conv.id)}
                style={{
                  width: '100%', padding: '16px',
                  backgroundColor: conv.isUnread ? INDIGO_LIGHT : 'transparent',
                  border: 'none',
                  borderBottom: index < directConversations.length - 1 ? `1px solid ${colors.border}` : 'none',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  cursor: 'pointer', textAlign: 'left'
                }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  backgroundColor: conv.contactColor, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <span style={{ color: '#fff', fontSize: '16px', fontWeight: '700' }}>{conv.contactInitials}</span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '15px', fontWeight: conv.isUnread ? '700' : '600', color: colors.text }}>
                      {conv.contactName}
                    </span>
                    <span style={{ fontSize: '12px', color: colors.textTertiary }}>{conv.lastMessageTime}</span>
                  </div>
                  <p style={{
                    margin: 0, fontSize: '14px', color: colors.textSecondary,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {conv.lastMessage || 'No messages yet'}
                  </p>
                </div>

                <span style={{ color: colors.textTertiary, fontSize: '20px' }}>›</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============ CHAT SCREEN COMPONENT ============
function ChatScreen({ title, subtitle, avatars, messages, colors, onBack, onSendMessage }: {
  title: string;
  subtitle: string;
  avatars: { initials: string; color: string }[];
  messages: Message[];
  colors: any;
  onBack: () => void;
  onSendMessage: (content: string, attachments?: Attachment[]) => void;
}) {
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState('Smileys');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!messageText.trim() && pendingAttachments.length === 0) return;
    onSendMessage(messageText.trim(), pendingAttachments.length > 0 ? pendingAttachments : undefined);
    setMessageText('');
    setPendingAttachments([]);
    setShowEmojiPicker(false);
    setShowGifPicker(false);
  };

  const addEmoji = (emoji: string) => {
    setMessageText(prev => prev + emoji);
  };

  const addGif = (gif: typeof SAMPLE_GIFS[0]) => {
    const attachment: Attachment = {
      id: `att-${Date.now()}`,
      type: 'gif',
      url: gif.url,
      name: gif.name
    };
    setPendingAttachments(prev => [...prev, attachment]);
    setShowGifPicker(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const isImage = file.type.startsWith('image/');
        const attachment: Attachment = {
          id: `att-${Date.now()}-${Math.random()}`,
          type: isImage ? 'image' : 'file',
          url: URL.createObjectURL(file),
          name: file.name
        };
        setPendingAttachments(prev => [...prev, attachment]);
      });
    }
    setShowAttachmentMenu(false);
  };

  const removeAttachment = (id: string) => {
    setPendingAttachments(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: colors.background }}>
      {/* Header */}
      <div style={{
        padding: '16px', paddingTop: '60px',
        backgroundColor: colors.backgroundSecondary,
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: INDIGO, fontSize: '28px', cursor: 'pointer', padding: '0' }}>←</button>

        <div style={{ position: 'relative', width: '44px', height: '36px' }}>
          {avatars.slice(0, 2).map((a, i) => (
            <div key={i} style={{
              position: 'absolute', left: i * 14, top: 0,
              width: '32px', height: '32px', borderRadius: '50%',
              backgroundColor: a.color, border: `2px solid ${colors.backgroundSecondary}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 - i
            }}>
              <span style={{ color: '#fff', fontSize: '10px', fontWeight: '700' }}>{a.initials}</span>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '17px', fontWeight: '600', color: colors.text }}>{title}</div>
          <div style={{ fontSize: '12px', color: colors.textTertiary }}>{subtitle}</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: colors.textSecondary }}>
            <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>💬</span>
            <p>No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} style={{
              display: 'flex', gap: '10px', marginBottom: '16px',
              flexDirection: msg.isFromMe ? 'row-reverse' : 'row'
            }}>
              {!msg.isFromMe && (
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  backgroundColor: msg.senderColor, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <span style={{ color: '#fff', fontSize: '12px', fontWeight: '700' }}>{msg.senderInitials}</span>
                </div>
              )}
              <div style={{ maxWidth: '75%' }}>
                {!msg.isFromMe && (
                  <div style={{ fontSize: '12px', color: colors.textTertiary, marginBottom: '4px' }}>{msg.senderName}</div>
                )}
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: msg.isFromMe ? INDIGO : colors.backgroundSecondary,
                  borderRadius: msg.isFromMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  border: msg.isFromMe ? 'none' : `1px solid ${colors.border}`
                }}>
                  {msg.content && (
                    <p style={{ margin: 0, fontSize: '15px', color: msg.isFromMe ? '#fff' : colors.text, lineHeight: '1.4' }}>
                      {msg.content}
                    </p>
                  )}
                  {msg.attachments && msg.attachments.map(att => (
                    <div key={att.id} style={{ marginTop: msg.content ? '8px' : 0 }}>
                      {att.type === 'image' || att.type === 'gif' ? (
                        <img src={att.url} alt={att.name} style={{ maxWidth: '200px', borderRadius: '8px' }} />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                          <span>📄</span>
                          <span style={{ fontSize: '13px', color: msg.isFromMe ? '#fff' : colors.text }}>{att.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: '11px', color: colors.textTertiary, marginTop: '4px', textAlign: msg.isFromMe ? 'right' : 'left' }}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Pending Attachments Preview */}
      {pendingAttachments.length > 0 && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: colors.backgroundSecondary,
          borderTop: `1px solid ${colors.border}`,
          display: 'flex', gap: '8px', flexWrap: 'wrap'
        }}>
          {pendingAttachments.map(att => (
            <div key={att.id} style={{ position: 'relative' }}>
              {att.type === 'image' || att.type === 'gif' ? (
                <img src={att.url} alt={att.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
              ) : (
                <div style={{ width: '60px', height: '60px', backgroundColor: colors.border, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '24px' }}>📄</span>
                </div>
              )}
              <button
                onClick={() => removeAttachment(att.id)}
                style={{
                  position: 'absolute', top: '-6px', right: '-6px',
                  width: '20px', height: '20px', borderRadius: '50%',
                  backgroundColor: '#EF4444', color: '#fff', border: 'none',
                  fontSize: '12px', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}
              >×</button>
            </div>
          ))}
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div style={{
          padding: '12px',
          backgroundColor: colors.backgroundSecondary,
          borderTop: `1px solid ${colors.border}`,
          maxHeight: '250px',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
            {Object.keys(EMOJI_CATEGORIES).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveEmojiCategory(cat)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '16px',
                  border: 'none',
                  backgroundColor: activeEmojiCategory === cat ? INDIGO : colors.border,
                  color: activeEmojiCategory === cat ? '#fff' : colors.text,
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >{cat}</button>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {EMOJI_CATEGORIES[activeEmojiCategory as keyof typeof EMOJI_CATEGORIES].map((emoji, i) => (
              <button
                key={i}
                onClick={() => addEmoji(emoji)}
                style={{
                  width: '36px', height: '36px',
                  border: 'none', backgroundColor: 'transparent',
                  fontSize: '22px', cursor: 'pointer',
                  borderRadius: '8px'
                }}
              >{emoji}</button>
            ))}
          </div>
        </div>
      )}

      {/* GIF Picker */}
      {showGifPicker && (
        <div style={{
          padding: '12px',
          backgroundColor: colors.backgroundSecondary,
          borderTop: `1px solid ${colors.border}`,
          maxHeight: '250px',
          overflowY: 'auto'
        }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: colors.textSecondary, marginBottom: '12px' }}>
            Popular GIFs
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {SAMPLE_GIFS.map(gif => (
              <button
                key={gif.id}
                onClick={() => addGif(gif)}
                style={{
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: 'transparent'
                }}
              >
                <img src={gif.url} alt={gif.name} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Attachment Menu */}
      {showAttachmentMenu && (
        <div style={{
          padding: '16px',
          backgroundColor: colors.backgroundSecondary,
          borderTop: `1px solid ${colors.border}`,
          display: 'flex', gap: '16px', justifyContent: 'center'
        }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
              padding: '16px 24px', backgroundColor: MAUVE_LIGHT, border: 'none',
              borderRadius: '12px', cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '28px' }}>🖼️</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: MAUVE }}>Photo</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
              padding: '16px 24px', backgroundColor: INDIGO_LIGHT, border: 'none',
              borderRadius: '12px', cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '28px' }}>📄</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: INDIGO }}>File</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {/* Input Area */}
      <div style={{
        padding: '12px 16px', paddingBottom: '30px',
        backgroundColor: colors.backgroundSecondary,
        borderTop: `1px solid ${colors.border}`,
        display: 'flex', alignItems: 'center', gap: '8px'
      }}>
        {/* Attachment Button */}
        <button
          onClick={() => { setShowAttachmentMenu(!showAttachmentMenu); setShowEmojiPicker(false); setShowGifPicker(false); }}
          style={{
            width: '40px', height: '40px', borderRadius: '50%',
            border: `2px solid ${showAttachmentMenu ? INDIGO : colors.border}`,
            backgroundColor: showAttachmentMenu ? INDIGO_LIGHT : 'transparent',
            color: showAttachmentMenu ? INDIGO : colors.textSecondary,
            fontSize: '18px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >📎</button>

        {/* Emoji Button */}
        <button
          onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowGifPicker(false); setShowAttachmentMenu(false); }}
          style={{
            width: '40px', height: '40px', borderRadius: '50%',
            border: `2px solid ${showEmojiPicker ? INDIGO : colors.border}`,
            backgroundColor: showEmojiPicker ? INDIGO_LIGHT : 'transparent',
            color: showEmojiPicker ? INDIGO : colors.textSecondary,
            fontSize: '18px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >😊</button>

        {/* GIF Button */}
        <button
          onClick={() => { setShowGifPicker(!showGifPicker); setShowEmojiPicker(false); setShowAttachmentMenu(false); }}
          style={{
            width: '40px', height: '40px', borderRadius: '50%',
            border: `2px solid ${showGifPicker ? INDIGO : colors.border}`,
            backgroundColor: showGifPicker ? INDIGO_LIGHT : 'transparent',
            color: showGifPicker ? INDIGO : colors.textSecondary,
            fontSize: '11px', fontWeight: '800', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >GIF</button>

        {/* Text Input */}
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          onFocus={() => { setShowEmojiPicker(false); setShowGifPicker(false); setShowAttachmentMenu(false); }}
          placeholder="Type a message..."
          style={{
            flex: 1, padding: '12px 16px', borderRadius: '24px',
            border: `1px solid ${colors.border}`, backgroundColor: colors.background,
            color: colors.text, fontSize: '15px', outline: 'none'
          }}
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!messageText.trim() && pendingAttachments.length === 0}
          style={{
            width: '44px', height: '44px', borderRadius: '50%', border: 'none',
            background: (messageText.trim() || pendingAttachments.length > 0)
              ? `linear-gradient(135deg, ${MAUVE} 0%, ${INDIGO} 100%)`
              : colors.border,
            color: '#fff', fontSize: '18px',
            cursor: (messageText.trim() || pendingAttachments.length > 0) ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >➤</button>
      </div>
    </div>
  );
}

// ============ TEAM FEED TAB COMPONENT ============
function TeamFeedTab({ groups, employees, feedPosts, colors, onCreateTeam, onSendBroadcast }: {
  groups: Group[];
  employees: Employee[];
  feedPosts: FeedPost[];
  colors: any;
  onCreateTeam: () => void;
  onSendBroadcast: (content: string, groupIds: string[], employeeIds: string[]) => void;
}) {
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [messageText, setMessageText] = useState('');
  const [showTeamPicker, setShowTeamPicker] = useState(false);
  const [showEmployeePicker, setShowEmployeePicker] = useState(false);

  const totalSelected = selectedGroupIds.length + selectedEmployeeIds.length;

  const toggleGroup = (id: string) => {
    setSelectedGroupIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleEmployee = (id: string) => {
    setSelectedEmployeeIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAllEmployees = () => {
    setSelectedEmployeeIds(employees.map(e => e.id));
  };

  const clearAll = () => {
    setSelectedGroupIds([]);
    setSelectedEmployeeIds([]);
  };

  const handleSend = () => {
    if (!messageText.trim() || totalSelected === 0) return;
    onSendBroadcast(messageText.trim(), selectedGroupIds, selectedEmployeeIds);
    setMessageText('');
    setSelectedGroupIds([]);
    setSelectedEmployeeIds([]);
  };

  return (
    <div>
      {/* Compose Section */}
      <div style={{
        backgroundColor: colors.backgroundSecondary,
        borderRadius: '16px',
        border: `1px solid ${colors.border}`,
        overflow: 'hidden',
        marginBottom: '20px'
      }}>
        <div style={{
          padding: '14px 16px',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '15px', fontWeight: '600', color: colors.text }}>📢 Broadcast Message</span>
          {totalSelected > 0 && (
            <button onClick={clearAll} style={{ background: 'none', border: 'none', color: INDIGO, fontSize: '13px', cursor: 'pointer' }}>
              Clear All
            </button>
          )}
        </div>

        {/* Selection Buttons */}
        <div style={{ padding: '16px', borderBottom: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <button
              onClick={() => setShowTeamPicker(!showTeamPicker)}
              style={{
                padding: '10px 16px', borderRadius: '10px',
                border: `2px solid ${selectedGroupIds.length > 0 ? TEAL : colors.border}`,
                backgroundColor: selectedGroupIds.length > 0 ? TEAL_LIGHT : 'transparent',
                color: selectedGroupIds.length > 0 ? TEAL : colors.text,
                fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              👥 Select Teams {selectedGroupIds.length > 0 && `(${selectedGroupIds.length})`}
            </button>

            <button
              onClick={() => setShowEmployeePicker(!showEmployeePicker)}
              style={{
                padding: '10px 16px', borderRadius: '10px',
                border: `2px solid ${selectedEmployeeIds.length > 0 ? MAUVE : colors.border}`,
                backgroundColor: selectedEmployeeIds.length > 0 ? MAUVE_LIGHT : 'transparent',
                color: selectedEmployeeIds.length > 0 ? MAUVE : colors.text,
                fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              👤 Select Employees {selectedEmployeeIds.length > 0 && `(${selectedEmployeeIds.length})`}
            </button>

            <button
              onClick={onCreateTeam}
              style={{
                padding: '10px 16px', borderRadius: '10px',
                border: `2px solid ${INDIGO}`,
                backgroundColor: INDIGO_LIGHT,
                color: INDIGO,
                fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              ➕ Create Team
            </button>
          </div>

          {/* Selected Summary */}
          {totalSelected > 0 && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: colors.background,
              borderRadius: '8px',
              fontSize: '13px',
              color: colors.textSecondary
            }}>
              <strong style={{ color: INDIGO }}>{totalSelected} recipients:</strong>{' '}
              {selectedGroupIds.map(id => groups.find(g => g.id === id)?.name).filter(Boolean).join(', ')}
              {selectedGroupIds.length > 0 && selectedEmployeeIds.length > 0 && ', '}
              {selectedEmployeeIds.map(id => employees.find(e => e.id === id)?.name.split(' ')[0]).filter(Boolean).join(', ')}
            </div>
          )}
        </div>

        {/* Team Picker */}
        {showTeamPicker && (
          <div style={{ borderBottom: `1px solid ${colors.border}` }}>
            <div style={{ padding: '10px 16px', backgroundColor: colors.background, borderBottom: `1px solid ${colors.border}` }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: TEAL }}>👥 Select Teams</span>
            </div>
            {groups.map(group => (
              <button
                key={group.id}
                onClick={() => toggleGroup(group.id)}
                style={{
                  width: '100%', padding: '12px 16px',
                  backgroundColor: selectedGroupIds.includes(group.id) ? TEAL_LIGHT : 'transparent',
                  border: 'none', borderBottom: `1px solid ${colors.border}`,
                  display: 'flex', alignItems: 'center', gap: '12px',
                  cursor: 'pointer', textAlign: 'left'
                }}
              >
                <Checkbox checked={selectedGroupIds.includes(group.id)} color={TEAL} />
                <span style={{ fontSize: '15px', fontWeight: '500', color: colors.text }}>{group.name}</span>
                <span style={{ fontSize: '12px', color: colors.textTertiary }}>({group.members.length})</span>
              </button>
            ))}
          </div>
        )}

        {/* Employee Picker */}
        {showEmployeePicker && (
          <div style={{ borderBottom: `1px solid ${colors.border}` }}>
            <div style={{ padding: '10px 16px', backgroundColor: colors.background, borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: MAUVE }}>👤 Select Employees</span>
              <button onClick={selectAllEmployees} style={{ background: 'none', border: 'none', color: MAUVE, fontSize: '12px', cursor: 'pointer' }}>Select All</button>
            </div>
            {employees.map(emp => (
              <button
                key={emp.id}
                onClick={() => toggleEmployee(emp.id)}
                style={{
                  width: '100%', padding: '12px 16px',
                  backgroundColor: selectedEmployeeIds.includes(emp.id) ? MAUVE_LIGHT : 'transparent',
                  border: 'none', borderBottom: `1px solid ${colors.border}`,
                  display: 'flex', alignItems: 'center', gap: '12px',
                  cursor: 'pointer', textAlign: 'left'
                }}
              >
                <Checkbox checked={selectedEmployeeIds.includes(emp.id)} color={MAUVE} />
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  backgroundColor: emp.color, display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  <span style={{ color: '#fff', fontSize: '12px', fontWeight: '700' }}>{emp.initials}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: colors.text }}>{emp.name}</div>
                  <div style={{ fontSize: '11px', color: colors.textTertiary }}>{emp.role}</div>
                </div>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  backgroundColor: emp.isOnline ? '#10B981' : '#6B7280'
                }} />
              </button>
            ))}
          </div>
        )}

        {/* Message Input */}
        <div style={{ padding: '16px' }}>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your broadcast message..."
            style={{
              width: '100%', minHeight: '80px', padding: '12px',
              backgroundColor: colors.background, border: `1px solid ${colors.border}`,
              borderRadius: '10px', color: colors.text, fontSize: '15px',
              resize: 'vertical', outline: 'none', boxSizing: 'border-box',
              fontFamily: 'inherit', marginBottom: '12px'
            }}
          />
          <button
            onClick={handleSend}
            disabled={!messageText.trim() || totalSelected === 0}
            style={{
              width: '100%', padding: '14px',
              background: (messageText.trim() && totalSelected > 0)
                ? `linear-gradient(135deg, ${MAUVE} 0%, ${INDIGO} 100%)`
                : colors.border,
              border: 'none', borderRadius: '12px', color: '#fff',
              fontSize: '15px', fontWeight: '600',
              cursor: (messageText.trim() && totalSelected > 0) ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            📤 Send to {totalSelected} {totalSelected === 1 ? 'recipient' : 'recipients'}
          </button>
        </div>
      </div>

      {/* Recent Broadcasts */}
      <div style={{
        backgroundColor: colors.backgroundSecondary,
        borderRadius: '16px',
        border: `1px solid ${colors.border}`,
        overflow: 'hidden'
      }}>
        <div style={{ padding: '14px 16px', borderBottom: `1px solid ${colors.border}` }}>
          <span style={{ fontSize: '15px', fontWeight: '600', color: colors.text }}>Recent Broadcasts</span>
        </div>
        {feedPosts.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: colors.textSecondary }}>
            <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>📢</span>
            <p style={{ margin: 0 }}>No broadcasts yet</p>
          </div>
        ) : (
          feedPosts.map((post, index) => (
            <div key={post.id} style={{ padding: '14px 16px', borderBottom: index < feedPosts.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  backgroundColor: post.senderColor, display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  <span style={{ color: '#fff', fontSize: '12px', fontWeight: '700' }}>{post.senderInitials}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: colors.text }}>{post.senderName}</div>
                  <div style={{ fontSize: '11px', color: colors.textTertiary }}>To: {post.recipients} • {post.timestamp}</div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: colors.text, lineHeight: '1.4' }}>{post.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============ CHECKBOX COMPONENT ============
function Checkbox({ checked, color }: { checked: boolean; color: string }) {
  return (
    <div style={{
      width: '22px', height: '22px', borderRadius: '6px',
      border: `2px solid ${checked ? color : '#6B7280'}`,
      backgroundColor: checked ? color : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0
    }}>
      {checked && <span style={{ color: '#fff', fontSize: '12px', fontWeight: '700' }}>✓</span>}
    </div>
  );
}

// ============ CREATE GROUP SCREEN ============
function CreateGroupScreen({ colors, onBack, onCreate }: {
  colors: any;
  onBack: () => void;
  onCreate: (name: string, memberIds: string[], linkedJob?: string) => void;
}) {
  const [groupName, setGroupName] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleMember = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background }}>
      <div style={{
        padding: '16px', paddingTop: '60px',
        backgroundColor: colors.backgroundSecondary,
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: INDIGO, fontSize: '28px', cursor: 'pointer' }}>←</button>
        <h2 style={{ margin: 0, fontSize: '18px', color: colors.text }}>Create New Team</h2>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.textSecondary, marginBottom: '8px' }}>Team Name</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g., Anderson Job Crew"
            style={{
              width: '100%', padding: '14px 16px', borderRadius: '10px',
              border: `1px solid ${colors.border}`, backgroundColor: colors.backgroundSecondary,
              color: colors.text, fontSize: '15px', outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.textSecondary, marginBottom: '8px' }}>
            Select Members ({selectedIds.length})
          </label>
          <div style={{ backgroundColor: colors.backgroundSecondary, borderRadius: '12px', border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
            {employees.map((emp, index) => (
              <button
                key={emp.id}
                onClick={() => toggleMember(emp.id)}
                style={{
                  width: '100%', padding: '14px 16px',
                  backgroundColor: selectedIds.includes(emp.id) ? INDIGO_LIGHT : 'transparent',
                  border: 'none',
                  borderBottom: index < employees.length - 1 ? `1px solid ${colors.border}` : 'none',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  cursor: 'pointer', textAlign: 'left'
                }}
              >
                <Checkbox checked={selectedIds.includes(emp.id)} color={INDIGO} />
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  backgroundColor: emp.color, display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  <span style={{ color: '#fff', fontSize: '14px', fontWeight: '700' }}>{emp.initials}</span>
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '500', color: colors.text }}>{emp.name}</div>
                  <div style={{ fontSize: '12px', color: colors.textTertiary }}>{emp.role}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onCreate(groupName, selectedIds)}
          disabled={!groupName.trim() || selectedIds.length === 0}
          style={{
            width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
            background: (!groupName.trim() || selectedIds.length === 0) ? colors.border : `linear-gradient(135deg, ${MAUVE} 0%, ${INDIGO} 100%)`,
            color: '#fff', fontSize: '16px', fontWeight: '600',
            cursor: (!groupName.trim() || selectedIds.length === 0) ? 'not-allowed' : 'pointer',
            opacity: (!groupName.trim() || selectedIds.length === 0) ? 0.5 : 1
          }}
        >
          Create Team
        </button>
      </div>
    </div>
  );
}

// ============ NEW DIRECT MESSAGE SCREEN ============
function NewDirectMessageScreen({ colors, employees, onBack, onSelectContact }: {
  colors: any;
  employees: Employee[];
  onBack: () => void;
  onSelectContact: (emp: Employee) => void;
}) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background }}>
      <div style={{
        padding: '16px', paddingTop: '60px',
        backgroundColor: colors.backgroundSecondary,
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: INDIGO, fontSize: '28px', cursor: 'pointer' }}>←</button>
        <h2 style={{ margin: 0, fontSize: '18px', color: colors.text }}>New Direct Message</h2>
      </div>

      <div style={{ padding: '20px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.textSecondary, marginBottom: '12px' }}>
          Select recipient...
        </label>
        <div style={{ backgroundColor: colors.backgroundSecondary, borderRadius: '12px', border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
          {employees.map((emp, index) => (
            <button
              key={emp.id}
              onClick={() => onSelectContact(emp)}
              style={{
                width: '100%', padding: '14px 16px',
                backgroundColor: 'transparent', border: 'none',
                borderBottom: index < employees.length - 1 ? `1px solid ${colors.border}` : 'none',
                display: 'flex', alignItems: 'center', gap: '12px',
                cursor: 'pointer', textAlign: 'left'
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                backgroundColor: emp.color, display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: '700' }}>{emp.initials}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: '500', color: colors.text }}>{emp.name}</div>
                <div style={{ fontSize: '12px', color: colors.textTertiary }}>{emp.role}</div>
              </div>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                backgroundColor: emp.isOnline ? '#10B981' : '#6B7280'
              }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ TAB BUTTON COMPONENT ============
function TabButton({ label, icon, isActive, onClick, badge, colors }: {
  label: string; icon: string; isActive: boolean; onClick: () => void; badge?: number; colors: any;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '12px', borderRadius: '8px', border: 'none',
        backgroundColor: isActive ? INDIGO : 'transparent',
        color: isActive ? '#fff' : colors.textSecondary,
        fontSize: '13px', fontWeight: '600', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
      }}
    >
      {icon} {label}
      {badge !== undefined && badge > 0 && (
        <span style={{
          backgroundColor: isActive ? '#fff' : INDIGO,
          color: isActive ? INDIGO : '#fff',
          fontSize: '10px', fontWeight: '700',
          padding: '2px 6px', borderRadius: '10px'
        }}>
          {badge}
        </span>
      )}
    </button>
  );
}

export default EmployeeMessagesScreen;
