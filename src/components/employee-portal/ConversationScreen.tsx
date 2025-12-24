/**
 * Conversation Screen - Boardroom 360
 * 
 * Individual chat thread view between employee and customer/team member.
 * 
 * Theme: Matches sidebar colors
 * - Messages: Mauve/Purple #9B8AA3
 * - Comm Hub: Indigo/Blue #5C6BC0
 */

import { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider';

// ============ THEME COLORS (Matching Sidebar) ============

const MAUVE = '#9B8AA3';              // Messages button color
const MAUVE_LIGHT = 'rgba(155, 138, 163, 0.15)';
const MAUVE_GLOW = 'rgba(155, 138, 163, 0.4)';

const INDIGO = '#5C6BC0';             // Comm Hub button color
const INDIGO_LIGHT = 'rgba(92, 107, 192, 0.15)';
const INDIGO_GLOW = 'rgba(92, 107, 192, 0.4)';

// ============ TYPES ============

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isFromMe: boolean;
  status: 'sent' | 'delivered' | 'read';
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

interface LinkedJob {
  id: string;
  name: string;
}

interface ConversationScreenProps {
  conversationId: string;
  contact: Contact;
  linkedJob?: LinkedJob;
  onBack: () => void;
  onViewJob?: (jobId: string) => void;
}

// ============ SAMPLE MESSAGES ============

const getSampleMessages = (contactName: string): Message[] => [
  {
    id: 'msg-1',
    senderId: 'me',
    senderName: 'Mike Johnson',
    content: 'Hi! I wanted to follow up on the flooring installation scheduled for next week.',
    timestamp: '9:00 AM',
    isFromMe: true,
    status: 'read'
  },
  {
    id: 'msg-2',
    senderId: 'contact',
    senderName: contactName,
    content: 'Yes, we\'re still on for Tuesday. Will you be bringing the materials or should we have them delivered separately?',
    timestamp: '9:15 AM',
    isFromMe: false,
    status: 'read'
  },
  {
    id: 'msg-3',
    senderId: 'me',
    senderName: 'Mike Johnson',
    content: 'I\'ll bring everything we need. The hardwood and underlayment are already at our warehouse.',
    timestamp: '9:20 AM',
    isFromMe: true,
    status: 'read'
  },
  {
    id: 'msg-4',
    senderId: 'contact',
    senderName: contactName,
    content: 'Perfect! What time should we expect you?',
    timestamp: '9:22 AM',
    isFromMe: false,
    status: 'read'
  },
  {
    id: 'msg-5',
    senderId: 'me',
    senderName: 'Mike Johnson',
    content: 'I\'ll be there around 8:30 AM. The job should take about 6-7 hours depending on subfloor condition.',
    timestamp: '9:30 AM',
    isFromMe: true,
    status: 'read'
  },
  {
    id: 'msg-6',
    senderId: 'contact',
    senderName: contactName,
    content: 'Thank you for the detailed quote. We would like to proceed with the installation next week. Please let me know what dates work best for your team.',
    timestamp: '10:30 AM',
    isFromMe: false,
    status: 'read'
  }
];

// ============ MAIN COMPONENT ============

export function ConversationScreen({ 
  conversationId, 
  contact, 
  linkedJob, 
  onBack,
  onViewJob 
}: ConversationScreenProps) {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>(getSampleMessages(contact.name));
  const [newMessage, setNewMessage] = useState('');
  const [showContactInfo, setShowContactInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const msg: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: 'Mike Johnson',
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      isFromMe: true,
      status: 'sent'
    };

    setMessages(prev => [...prev, msg]);
    setNewMessage('');

    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === msg.id ? { ...m, status: 'delivered' } : m
      ));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === msg.id ? { ...m, status: 'read' } : m
      ));
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: colors.background
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        paddingTop: 'max(12px, env(safe-area-inset-top))',
        background: `linear-gradient(90deg, ${MAUVE_LIGHT} 0%, ${INDIGO_LIGHT} 100%)`,
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        {/* Back Button */}
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: INDIGO,
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          ←
        </button>

        {/* Contact Info */}
        <button
          onClick={() => setShowContactInfo(true)}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: contact.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <span style={{ color: '#fff', fontSize: '16px', fontWeight: '700' }}>
              {contact.initials}
            </span>
          </div>
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '2px'
            }}>
              <span style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: colors.text 
              }}>
                {contact.name}
              </span>
              <span style={{
                fontSize: '9px',
                fontWeight: '600',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: contact.type === 'employee' ? '#8B5CF6' : '#3B82F6',
                color: '#fff',
                textTransform: 'uppercase'
              }}>
                {contact.type === 'employee' ? 'Team' : 'Customer'}
              </span>
            </div>
            {linkedJob && (
              <span style={{ 
                fontSize: '12px', 
                color: MAUVE,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                📎 {linkedJob.name}
              </span>
            )}
          </div>
        </button>

        {/* More Options */}
        <button
          style={{
            background: 'none',
            border: 'none',
            color: colors.textSecondary,
            fontSize: '20px',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          ⋮
        </button>
      </div>

      {/* Linked Job Banner */}
      {linkedJob && (
        <button
          onClick={() => onViewJob?.(linkedJob.id)}
          style={{
            padding: '10px 16px',
            background: `linear-gradient(90deg, ${MAUVE_LIGHT} 0%, ${INDIGO_LIGHT} 100%)`,
            border: 'none',
            borderBottom: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <span style={{ 
            fontSize: '13px', 
            color: INDIGO,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🏠 Linked to: <strong>{linkedJob.name}</strong>
          </span>
          <span style={{ fontSize: '12px', color: INDIGO }}>View Job →</span>
        </button>
      )}

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* Date Separator */}
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <span style={{
            fontSize: '12px',
            color: colors.textTertiary,
            backgroundColor: colors.backgroundSecondary,
            padding: '4px 12px',
            borderRadius: '12px'
          }}>
            Today
          </span>
        </div>

        {/* Message Bubbles */}
        {messages.map(message => (
          <MessageBubble
            key={message.id}
            message={message}
            colors={colors}
            contactColor={contact.color}
            contactInitials={contact.initials}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div style={{
        padding: '12px 16px',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        backgroundColor: colors.backgroundSecondary,
        borderTop: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'flex-end',
        gap: '12px'
      }}>
        {/* Attachment Button */}
        <button
          style={{
            background: 'none',
            border: 'none',
            color: MAUVE,
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          📎
        </button>

        {/* Text Input */}
        <div style={{
          flex: 1,
          backgroundColor: colors.background,
          borderRadius: '20px',
          border: `1px solid ${colors.border}`,
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              color: colors.text,
              fontSize: '15px',
              resize: 'none',
              maxHeight: '100px',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!newMessage.trim()}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: 'none',
            background: newMessage.trim() ? `linear-gradient(135deg, ${MAUVE} 0%, ${INDIGO} 100%)` : colors.border,
            color: '#FFFFFF',
            fontSize: '18px',
            cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: newMessage.trim() ? `0 4px 12px ${INDIGO_GLOW}` : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          ➤
        </button>
      </div>

      {/* Contact Info Modal */}
      {showContactInfo && (
        <ContactInfoModal
          contact={contact}
          linkedJob={linkedJob}
          colors={colors}
          onClose={() => setShowContactInfo(false)}
          onViewJob={onViewJob}
        />
      )}
    </div>
  );
}

// ============ MESSAGE BUBBLE ============

function MessageBubble({ message, colors, contactColor, contactInitials }: {
  message: Message; colors: any; contactColor: string; contactInitials: string;
}) {
  const { content, timestamp, isFromMe, status } = message;

  return (
    <div style={{
      display: 'flex',
      flexDirection: isFromMe ? 'row-reverse' : 'row',
      alignItems: 'flex-end',
      gap: '8px'
    }}>
      {/* Avatar (only for received messages) */}
      {!isFromMe && (
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: contactColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <span style={{ color: '#fff', fontSize: '11px', fontWeight: '700' }}>
            {contactInitials}
          </span>
        </div>
      )}

      {/* Bubble */}
      <div style={{
        maxWidth: '75%',
        padding: '12px 16px',
        borderRadius: isFromMe 
          ? '18px 18px 4px 18px' 
          : '18px 18px 18px 4px',
        background: isFromMe ? `linear-gradient(135deg, ${MAUVE} 0%, ${INDIGO} 100%)` : colors.backgroundSecondary,
        border: isFromMe ? 'none' : `1px solid ${colors.border}`
      }}>
        <p style={{
          margin: 0,
          fontSize: '15px',
          color: isFromMe ? '#FFFFFF' : colors.text,
          lineHeight: '1.4',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          {content}
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '4px',
          marginTop: '4px'
        }}>
          <span style={{
            fontSize: '11px',
            color: isFromMe ? 'rgba(255,255,255,0.7)' : colors.textTertiary
          }}>
            {timestamp}
          </span>
          {isFromMe && (
            <span style={{
              fontSize: '12px',
              color: status === 'read' ? '#FFFFFF' : 'rgba(255,255,255,0.5)'
            }}>
              {status === 'sent' && '✓'}
              {status === 'delivered' && '✓✓'}
              {status === 'read' && '✓✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ CONTACT INFO MODAL ============

function ContactInfoModal({ contact, linkedJob, colors, onClose, onViewJob }: {
  contact: Contact; linkedJob?: LinkedJob; colors: any; onClose: () => void; onViewJob?: (jobId: string) => void;
}) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: colors.backgroundSecondary,
        borderRadius: '16px',
        width: '100%',
        maxWidth: '400px',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          textAlign: 'center',
          borderBottom: `1px solid ${colors.border}`,
          background: `linear-gradient(90deg, ${MAUVE_LIGHT} 0%, ${INDIGO_LIGHT} 100%)`
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: contact.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <span style={{ color: '#fff', fontSize: '28px', fontWeight: '700' }}>
              {contact.initials}
            </span>
          </div>
          <h2 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '20px', 
            color: colors.text 
          }}>
            {contact.name}
          </h2>
          <span style={{
            fontSize: '12px',
            fontWeight: '600',
            padding: '4px 12px',
            borderRadius: '12px',
            backgroundColor: contact.type === 'employee' ? '#8B5CF6' : '#3B82F6',
            color: '#fff',
            textTransform: 'uppercase'
          }}>
            {contact.type === 'employee' ? 'Team Member' : 'Customer'}
          </span>
        </div>

        {/* Contact Details */}
        <div style={{ padding: '16px 24px' }}>
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                backgroundColor: colors.background,
                borderRadius: '10px',
                marginBottom: '12px',
                textDecoration: 'none',
                color: colors.text,
                border: `1px solid ${colors.border}`
              }}
            >
              <span style={{ fontSize: '20px' }}>📞</span>
              <div>
                <div style={{ fontSize: '12px', color: colors.textTertiary }}>Phone</div>
                <div style={{ fontSize: '15px', fontWeight: '500', color: INDIGO }}>{contact.phone}</div>
              </div>
            </a>
          )}

          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                backgroundColor: colors.background,
                borderRadius: '10px',
                marginBottom: '12px',
                textDecoration: 'none',
                color: colors.text,
                border: `1px solid ${colors.border}`
              }}
            >
              <span style={{ fontSize: '20px' }}>✉️</span>
              <div>
                <div style={{ fontSize: '12px', color: colors.textTertiary }}>Email</div>
                <div style={{ fontSize: '15px', fontWeight: '500', color: INDIGO }}>{contact.email}</div>
              </div>
            </a>
          )}

          {linkedJob && (
            <button
              onClick={() => {
                onClose();
                onViewJob?.(linkedJob.id);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                backgroundColor: colors.background,
                borderRadius: '10px',
                width: '100%',
                border: `1px solid ${colors.border}`,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '20px' }}>🏠</span>
              <div>
                <div style={{ fontSize: '12px', color: colors.textTertiary }}>Linked Job</div>
                <div style={{ fontSize: '15px', fontWeight: '500', color: MAUVE }}>
                  {linkedJob.name}
                </div>
              </div>
            </button>
          )}
        </div>

        {/* Close Button */}
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${colors.border}` }}>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              background: `linear-gradient(135deg, ${MAUVE} 0%, ${INDIGO} 100%)`,
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: `0 4px 12px ${INDIGO_GLOW}`
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConversationScreen;
