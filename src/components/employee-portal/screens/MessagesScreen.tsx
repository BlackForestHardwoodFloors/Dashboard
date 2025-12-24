import React, { useState, useRef, useEffect } from 'react';
import { 
  Send,
  Users,
  User,
  Phone,
  Mail,
  ChevronLeft,
  Search,
  Plus,
  Check,
  CheckCheck,
  Image as ImageIcon,
  Paperclip,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import type { Message, Job, Employee } from '../EmployeePortal';

interface MessagesScreenProps {
  messages: Message[];
  jobs: Job[];
  employee: Employee;
  onSendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
}

type Tab = 'clients' | 'team';

export function MessagesScreen({ messages, jobs, employee, onSendMessage }: MessagesScreenProps) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('clients');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Separate messages by type
  const clientMessages = messages.filter(m => m.type === 'client');
  const teamMessages = messages.filter(m => m.type === 'team');

  // Get unique conversations
  const clientConversations = jobs.map(job => ({
    id: job.id,
    name: job.clientName,
    phone: job.clientPhone,
    email: job.clientEmail,
    lastMessage: clientMessages
      .filter(m => m.jobId === job.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0],
    unread: clientMessages.filter(m => m.jobId === job.id && !m.read).length
  }));

  const teamMembers = [
    { id: 'team-all', name: 'Team Chat', isGroup: true },
    { id: 'carlos', name: 'Carlos Martinez', role: 'Installer' },
    { id: 'james', name: 'James Wilson', role: 'Installer' },
    { id: 'sarah', name: 'Sarah (Office)', role: 'Admin' },
  ];

  // Get current conversation messages
  const currentMessages = selectedConversation
    ? messages.filter(m => 
        activeTab === 'clients' 
          ? m.jobId === selectedConversation
          : m.type === 'team'
      )
    : [];

  // If conversation is selected, show chat view
  if (selectedConversation) {
    const conversation = activeTab === 'clients'
      ? clientConversations.find(c => c.id === selectedConversation)
      : teamMembers.find(t => t.id === selectedConversation);

    return (
      <ChatView
        conversationName={conversation?.name || 'Chat'}
        messages={currentMessages}
        employee={employee}
        onBack={() => setSelectedConversation(null)}
        onSendMessage={(content) => {
          onSendMessage({
            type: activeTab === 'clients' ? 'client' : 'team',
            from: `${employee.firstName} ${employee.lastName}`,
            to: conversation?.name || '',
            content,
            read: true,
            jobId: activeTab === 'clients' ? selectedConversation : undefined
          });
        }}
        colors={colors}
        isClientChat={activeTab === 'clients'}
      />
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      paddingBottom: '100px'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        paddingTop: 'max(16px, env(safe-area-inset-top))',
        backgroundColor: colors.backgroundSecondary,
        borderBottom: `1px solid ${colors.border}`
      }}>
        <h1 style={{
          color: colors.text,
          fontSize: '24px',
          fontWeight: '700',
          margin: '0 0 16px 0'
        }}>
          Messages
        </h1>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: colors.backgroundTertiary,
          borderRadius: '12px',
          padding: '4px'
        }}>
          <TabButton 
            label="Clients" 
            icon={User}
            active={activeTab === 'clients'}
            onClick={() => setActiveTab('clients')}
            badge={clientMessages.filter(m => !m.read).length}
            colors={colors}
          />
          <TabButton 
            label="Team" 
            icon={Users}
            active={activeTab === 'team'}
            onClick={() => setActiveTab('team')}
            badge={teamMessages.filter(m => !m.read).length}
            colors={colors}
          />
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '16px 20px 8px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 14px',
          backgroundColor: colors.backgroundSecondary,
          borderRadius: '10px',
          border: `1px solid ${colors.border}`
        }}>
          <Search size={18} color={colors.textTertiary} />
          <input
            type="text"
            placeholder={activeTab === 'clients' ? 'Search clients...' : 'Search team...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: colors.text,
              fontSize: '15px'
            }}
          />
        </div>
      </div>

      {/* Conversation List */}
      <div style={{ padding: '8px 20px' }}>
        {activeTab === 'clients' ? (
          <>
            {/* Admin Notice */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              backgroundColor: 'rgba(15, 123, 255, 0.1)',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <AlertCircle size={16} color={colors.accent} />
              <span style={{ color: colors.accent, fontSize: '12px' }}>
                Admin can see all client messages
              </span>
            </div>

            {clientConversations.map(conv => (
              <ConversationItem
                key={conv.id}
                name={conv.name}
                subtitle={conv.lastMessage?.content || 'No messages yet'}
                time={conv.lastMessage ? formatTime(conv.lastMessage.timestamp) : ''}
                unread={conv.unread}
                onClick={() => setSelectedConversation(conv.id)}
                colors={colors}
              />
            ))}
          </>
        ) : (
          <>
            {teamMembers.map(member => (
              <ConversationItem
                key={member.id}
                name={member.name}
                subtitle={member.isGroup ? 'Group chat' : member.role}
                time=""
                unread={0}
                onClick={() => setSelectedConversation(member.id)}
                colors={colors}
                isGroup={member.isGroup}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// Tab Button
function TabButton({ label, icon: Icon, active, onClick, badge, colors }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '10px',
        backgroundColor: active ? colors.accent : 'transparent',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      <Icon size={18} color={active ? '#FFFFFF' : colors.textSecondary} />
      <span style={{
        color: active ? '#FFFFFF' : colors.textSecondary,
        fontSize: '14px',
        fontWeight: '600'
      }}>
        {label}
      </span>
      {badge > 0 && (
        <span style={{
          minWidth: '18px',
          height: '18px',
          borderRadius: '9px',
          backgroundColor: active ? '#FFFFFF' : colors.error,
          color: active ? colors.accent : '#FFFFFF',
          fontSize: '11px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 5px'
        }}>
          {badge}
        </span>
      )}
    </button>
  );
}

// Conversation Item
function ConversationItem({ name, subtitle, time, unread, onClick, colors, isGroup }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '14px 16px',
        backgroundColor: colors.backgroundSecondary,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        cursor: 'pointer',
        marginBottom: '8px',
        textAlign: 'left'
      }}
    >
      {/* Avatar */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: isGroup ? '12px' : '50%',
        backgroundColor: isGroup ? colors.accent : colors.backgroundTertiary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {isGroup ? (
          <Users size={24} color="#FFFFFF" />
        ) : (
          <span style={{ color: colors.text, fontSize: '18px', fontWeight: '700' }}>
            {name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            color: colors.text,
            fontSize: '15px',
            fontWeight: unread > 0 ? '700' : '600'
          }}>
            {name}
          </span>
          {time && (
            <span style={{
              color: unread > 0 ? colors.accent : colors.textTertiary,
              fontSize: '12px'
            }}>
              {time}
            </span>
          )}
        </div>
        <p style={{
          color: unread > 0 ? colors.text : colors.textSecondary,
          fontSize: '13px',
          fontWeight: unread > 0 ? '600' : '400',
          margin: '2px 0 0 0',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {subtitle}
        </p>
      </div>

      {/* Unread Badge */}
      {unread > 0 && (
        <div style={{
          minWidth: '22px',
          height: '22px',
          borderRadius: '11px',
          backgroundColor: colors.accent,
          color: '#FFFFFF',
          fontSize: '12px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {unread}
        </div>
      )}
    </button>
  );
}

// Chat View
function ChatView({ conversationName, messages, employee, onBack, onSendMessage, colors, isClientChat }: any) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        paddingTop: 'max(12px, env(safe-area-inset-top))',
        backgroundColor: colors.backgroundSecondary,
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <button
          onClick={onBack}
          style={{
            padding: '8px',
            backgroundColor: colors.backgroundTertiary,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          <ChevronLeft size={20} color={colors.text} />
        </button>
        
        <div style={{ flex: 1 }}>
          <h2 style={{ color: colors.text, fontSize: '16px', fontWeight: '700', margin: 0 }}>
            {conversationName}
          </h2>
          {isClientChat && (
            <p style={{ color: colors.textSecondary, fontSize: '12px', margin: '2px 0 0 0' }}>
              Admin will see these messages
            </p>
          )}
        </div>

        {isClientChat && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{
              padding: '8px',
              backgroundColor: colors.backgroundTertiary,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              <Phone size={18} color={colors.accent} />
            </button>
            <button style={{
              padding: '8px',
              backgroundColor: colors.backgroundTertiary,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              <Mail size={18} color={colors.accent} />
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto'
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ color: colors.textSecondary }}>No messages yet</p>
            <p style={{ color: colors.textTertiary, fontSize: '14px' }}>
              Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg: Message) => {
            const isMe = msg.from === `${employee.firstName} ${employee.lastName}`;
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isMe ? 'flex-end' : 'flex-start',
                  marginBottom: '12px'
                }}
              >
                <div style={{
                  maxWidth: '80%',
                  padding: '12px 16px',
                  backgroundColor: isMe ? colors.accent : colors.backgroundSecondary,
                  borderRadius: '16px',
                  borderBottomRightRadius: isMe ? '4px' : '16px',
                  borderBottomLeftRadius: isMe ? '16px' : '4px'
                }}>
                  {!isMe && (
                    <p style={{
                      color: colors.accent,
                      fontSize: '12px',
                      fontWeight: '600',
                      margin: '0 0 4px 0'
                    }}>
                      {msg.from}
                    </p>
                  )}
                  <p style={{
                    color: isMe ? '#FFFFFF' : colors.text,
                    fontSize: '15px',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {msg.content}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '4px',
                    marginTop: '4px'
                  }}>
                    <span style={{
                      color: isMe ? 'rgba(255,255,255,0.7)' : colors.textTertiary,
                      fontSize: '11px'
                    }}>
                      {formatTime(msg.timestamp)}
                    </span>
                    {isMe && (
                      msg.read ? (
                        <CheckCheck size={14} color="rgba(255,255,255,0.7)" />
                      ) : (
                        <Check size={14} color="rgba(255,255,255,0.7)" />
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 16px',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        backgroundColor: colors.backgroundSecondary,
        borderTop: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <button style={{
          padding: '10px',
          backgroundColor: colors.backgroundTertiary,
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer'
        }}>
          <Paperclip size={20} color={colors.textSecondary} />
        </button>
        
        <input
          type="text"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          style={{
            flex: 1,
            padding: '12px 16px',
            backgroundColor: colors.backgroundTertiary,
            border: 'none',
            borderRadius: '20px',
            color: colors.text,
            fontSize: '15px',
            outline: 'none'
          }}
        />
        
        <button
          onClick={handleSend}
          disabled={!inputValue.trim()}
          style={{
            padding: '12px',
            backgroundColor: inputValue.trim() ? colors.accent : colors.backgroundTertiary,
            border: 'none',
            borderRadius: '50%',
            cursor: inputValue.trim() ? 'pointer' : 'default'
          }}
        >
          <Send size={20} color={inputValue.trim() ? '#FFFFFF' : colors.textTertiary} />
        </button>
      </div>
    </div>
  );
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) return 'now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
