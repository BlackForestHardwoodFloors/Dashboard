/**
 * Team Messages Screen - Boardroom 360
 * TAP ON A GROUP TO OPEN CHAT AND CONTINUE CONVERSATION
 */

import { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider';

// Theme Colors
const MAUVE = '#9B8AA3';
const MAUVE_LIGHT = 'rgba(155, 138, 163, 0.15)';
const INDIGO = '#5C6BC0';
const INDIGO_LIGHT = 'rgba(92, 107, 192, 0.15)';
const INDIGO_GLOW = 'rgba(92, 107, 192, 0.4)';

// Types
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
}

interface Group {
  id: string;
  name: string;
  members: Employee[];
  linkedJob?: string;
  messages: Message[];
}

// Current User
const currentUser = { id: 'E-100', name: 'Mike Johnson', initials: 'MJ', color: '#10B981' };

// Sample Employees
const employees: Employee[] = [
  { id: 'E-101', name: 'Mike Thompson', initials: 'MT', color: '#8B5CF6', role: 'Lead Installer', isOnline: true },
  { id: 'E-102', name: 'Sarah Williams', initials: 'SW', color: '#EC4899', role: 'Installer', isOnline: true },
  { id: 'E-103', name: 'Carlos Martinez', initials: 'CM', color: '#F97316', role: 'Installer', isOnline: false },
  { id: 'E-104', name: 'Jessica Lee', initials: 'JL', color: '#14B8A6', role: 'Apprentice', isOnline: true },
  { id: 'E-105', name: 'David Brown', initials: 'DB', color: '#6366F1', role: 'Warehouse', isOnline: false },
];

// Sample Groups with Messages
const initialGroups: Group[] = [
  {
    id: 'grp-001',
    name: 'Anderson Job Crew',
    members: [employees[0], employees[1]],
    linkedJob: 'Anderson Residence',
    messages: [
      { id: 'm1', senderId: 'E-101', senderName: 'Mike Thompson', senderInitials: 'MT', senderColor: '#8B5CF6', content: 'All materials loaded and ready for tomorrow', timestamp: '10:30 AM', isFromMe: false },
      { id: 'm2', senderId: 'E-102', senderName: 'Sarah Williams', senderInitials: 'SW', senderColor: '#EC4899', content: 'Great! I\'ll pick up the extra trim pieces.', timestamp: '10:35 AM', isFromMe: false },
      { id: 'm3', senderId: 'E-100', senderName: 'Mike Johnson', senderInitials: 'MJ', senderColor: '#10B981', content: 'Perfect. Let\'s meet at 7:30 AM.', timestamp: '10:40 AM', isFromMe: true },
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

// ==================== MAIN COMPONENT ====================

export function TeamMessagesScreen() {
  const { colors } = useTheme();
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  // Find the open group
  const openGroup = groups.find(g => g.id === openGroupId);

  // If a group is open, show the chat
  if (openGroup) {
    return (
      <GroupChat
        group={openGroup}
        colors={colors}
        onBack={() => setOpenGroupId(null)}
        onSendMessage={(content) => {
          const newMsg: Message = {
            id: `m-${Date.now()}`,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderInitials: currentUser.initials,
            senderColor: currentUser.color,
            content,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            isFromMe: true
          };
          setGroups(prev => prev.map(g =>
            g.id === openGroup.id ? { ...g, messages: [...g.messages, newMsg] } : g
          ));
        }}
      />
    );
  }

  // If creating a group
  if (showCreateGroup) {
    return (
      <CreateGroup
        colors={colors}
        onBack={() => setShowCreateGroup(false)}
        onCreate={(name, memberIds) => {
          const members = employees.filter(e => memberIds.includes(e.id));
          const newGroup: Group = {
            id: `grp-${Date.now()}`,
            name,
            members,
            messages: []
          };
          setGroups(prev => [newGroup, ...prev]);
          setShowCreateGroup(false);
        }}
      />
    );
  }

  // Main Groups List
  return (
    <div style={{ padding: '20px', paddingBottom: '120px', minHeight: '100vh', backgroundColor: colors.background }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: `linear-gradient(135deg, ${MAUVE} 0%, ${INDIGO} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontSize: '22px' }}>💬</span>
        </div>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: colors.text, margin: 0 }}>Messages</h1>
          <p style={{ fontSize: '13px', color: colors.textSecondary, margin: 0 }}>{groups.length} groups</p>
        </div>
      </div>

      {/* Create New Group Button */}
      <button
        onClick={() => setShowCreateGroup(true)}
        style={{
          width: '100%', padding: '16px', marginBottom: '20px',
          background: `linear-gradient(135deg, ${MAUVE} 0%, ${INDIGO} 100%)`,
          border: 'none', borderRadius: '12px', color: '#fff',
          fontSize: '15px', fontWeight: '600', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          boxShadow: `0 4px 12px ${INDIGO_GLOW}`
        }}
      >
        ➕ Create New Group
      </button>

      {/* Groups List */}
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
              {/* Stacked Avatars */}
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

              {/* Group Info */}
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

              {/* Arrow indicator */}
              <span style={{ color: colors.textTertiary, fontSize: '20px' }}>›</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ==================== GROUP CHAT SCREEN ====================

function GroupChat({ group, colors, onBack, onSendMessage }: {
  group: Group;
  colors: any;
  onBack: () => void;
  onSendMessage: (content: string) => void;
}) {
  const [messageText, setMessageText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcribedText, setTranscribedText] = useState('');
  const [showTranscription, setShowTranscription] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [group.messages]);

  // Cleanup timer
  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    // Simulate AI transcription
    setTimeout(() => {
      setTranscribedText("Hey team, just checking in on the progress for today.");
      setShowTranscription(true);
    }, 1500);
  };

  const cancelRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setRecordingTime(0);
    setTranscribedText('');
    setShowTranscription(false);
  };

  const handleSend = () => {
    const text = showTranscription ? transcribedText : messageText;
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setMessageText('');
    setTranscribedText('');
    setShowTranscription(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: colors.background }}>
      {/* Header */}
      <div style={{
        padding: '16px', backgroundColor: colors.backgroundSecondary,
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: INDIGO,
          fontSize: '28px', cursor: 'pointer', padding: '0'
        }}>←</button>
        
        <div style={{ position: 'relative', width: '44px', height: '36px' }}>
          {group.members.slice(0, 2).map((m, i) => (
            <div key={m.id} style={{
              position: 'absolute', left: i * 14, top: 0,
              width: '32px', height: '32px', borderRadius: '50%',
              backgroundColor: m.color, border: `2px solid ${colors.backgroundSecondary}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 - i
            }}>
              <span style={{ color: '#fff', fontSize: '10px', fontWeight: '700' }}>{m.initials}</span>
            </div>
          ))}
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '17px', fontWeight: '600', color: colors.text }}>{group.name}</div>
          <div style={{ fontSize: '12px', color: colors.textTertiary }}>
            {group.members.length} members
            {group.linkedJob && <span style={{ color: MAUVE, marginLeft: '8px' }}>📎 {group.linkedJob}</span>}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {group.messages.map(msg => (
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
                <p style={{ margin: 0, fontSize: '15px', color: msg.isFromMe ? '#fff' : colors.text, lineHeight: '1.4' }}>
                  {msg.content}
                </p>
              </div>
              <div style={{ fontSize: '11px', color: colors.textTertiary, marginTop: '4px', textAlign: msg.isFromMe ? 'right' : 'left' }}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Recording UI */}
      {isRecording && (
        <div style={{
          padding: '20px', textAlign: 'center',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderTop: `1px solid ${colors.border}`
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎤</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#EF4444', marginBottom: '12px' }}>{formatTime(recordingTime)}</div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={cancelRecording} style={{
              padding: '10px 24px', borderRadius: '20px',
              border: `1px solid ${colors.border}`, backgroundColor: 'transparent',
              color: colors.textSecondary, fontSize: '14px', cursor: 'pointer'
            }}>Cancel</button>
            <button onClick={stopRecording} style={{
              padding: '10px 24px', borderRadius: '20px', border: 'none',
              backgroundColor: '#EF4444', color: '#fff',
              fontSize: '14px', fontWeight: '600', cursor: 'pointer'
            }}>⏹️ Stop & Transcribe</button>
          </div>
        </div>
      )}

      {/* Transcription Result */}
      {showTranscription && (
        <div style={{ padding: '16px', borderTop: `1px solid ${colors.border}`, backgroundColor: colors.backgroundSecondary }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span>✨</span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: INDIGO }}>AI Transcription</span>
          </div>
          <div style={{
            padding: '12px', backgroundColor: colors.background,
            borderRadius: '10px', border: `1px solid ${colors.border}`, marginBottom: '12px'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: colors.text }}>{transcribedText}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={cancelRecording} style={{
              padding: '10px 16px', borderRadius: '10px',
              border: `1px solid ${colors.border}`, backgroundColor: 'transparent',
              color: colors.textSecondary, fontSize: '13px', cursor: 'pointer'
            }}>🔄 Re-record</button>
            <button onClick={() => { setMessageText(transcribedText); setShowTranscription(false); }} style={{
              padding: '10px 16px', borderRadius: '10px',
              border: `1px solid ${colors.border}`, backgroundColor: 'transparent',
              color: colors.text, fontSize: '13px', cursor: 'pointer'
            }}>✏️ Edit</button>
            <button onClick={handleSend} style={{
              padding: '10px 16px', borderRadius: '10px', border: 'none',
              background: `linear-gradient(135deg, ${MAUVE} 0%, ${INDIGO} 100%)`,
              color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer'
            }}>📤 Send</button>
          </div>
        </div>
      )}

      {/* Message Input */}
      {!isRecording && !showTranscription && (
        <div style={{
          padding: '12px 16px', backgroundColor: colors.backgroundSecondary,
          borderTop: `1px solid ${colors.border}`,
          display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <button onClick={startRecording} style={{
            width: '44px', height: '44px', borderRadius: '50%',
            border: `2px solid ${MAUVE}`, backgroundColor: MAUVE_LIGHT,
            color: MAUVE, fontSize: '18px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>🎤</button>
          
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            style={{
              flex: 1, padding: '12px 16px', borderRadius: '24px',
              border: `1px solid ${colors.border}`, backgroundColor: colors.background,
              color: colors.text, fontSize: '15px', outline: 'none'
            }}
          />
          
          <button
            onClick={handleSend}
            disabled={!messageText.trim()}
            style={{
              width: '44px', height: '44px', borderRadius: '50%', border: 'none',
              background: messageText.trim() ? `linear-gradient(135deg, ${MAUVE} 0%, ${INDIGO} 100%)` : colors.border,
              color: '#fff', fontSize: '18px',
              cursor: messageText.trim() ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >➤</button>
        </div>
      )}
    </div>
  );
}

// ==================== CREATE GROUP SCREEN ====================

function CreateGroup({ colors, onBack, onCreate }: {
  colors: any;
  onBack: () => void;
  onCreate: (name: string, memberIds: string[]) => void;
}) {
  const [groupName, setGroupName] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleMember = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background }}>
      <div style={{
        padding: '16px', backgroundColor: colors.backgroundSecondary,
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: INDIGO,
          fontSize: '28px', cursor: 'pointer'
        }}>←</button>
        <h2 style={{ margin: 0, fontSize: '18px', color: colors.text }}>Create New Group</h2>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.textSecondary, marginBottom: '8px' }}>
            Group Name
          </label>
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
          <div style={{
            backgroundColor: colors.backgroundSecondary, borderRadius: '12px',
            border: `1px solid ${colors.border}`, overflow: 'hidden'
          }}>
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
                <div style={{
                  width: '22px', height: '22px', borderRadius: '6px',
                  border: `2px solid ${selectedIds.includes(emp.id) ? INDIGO : '#6B7280'}`,
                  backgroundColor: selectedIds.includes(emp.id) ? INDIGO : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {selectedIds.includes(emp.id) && <span style={{ color: '#fff', fontSize: '12px' }}>✓</span>}
                </div>
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
            background: (!groupName.trim() || selectedIds.length === 0) 
              ? colors.border 
              : `linear-gradient(135deg, ${MAUVE} 0%, ${INDIGO} 100%)`,
            color: '#fff', fontSize: '16px', fontWeight: '600',
            cursor: (!groupName.trim() || selectedIds.length === 0) ? 'not-allowed' : 'pointer',
            opacity: (!groupName.trim() || selectedIds.length === 0) ? 0.5 : 1
          }}
        >
          Create Group
        </button>
      </div>
    </div>
  );
}

export default TeamMessagesScreen;
