/**
 * Broadcast Message Modal - Boardroom 360
 * 
 * Allows sending SMS or In-App messages to multiple employees and/or clients
 */

import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Theme colors matching the app
const MAUVE = '#9B8AA3';
const INDIGO = '#5C6BC0';
const MAUVE_LIGHT = 'rgba(155, 138, 163, 0.15)';
const INDIGO_GLOW = 'rgba(92, 107, 192, 0.4)';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
}

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
}

interface Recipient {
  id: number;
  type: 'employee' | 'contact';
  name: string;
  phone: string;
  email: string;
}

interface BroadcastMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  colors: any;
}

export function BroadcastMessageModal({ isOpen, onClose, colors }: BroadcastMessageModalProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'sms' | 'inapp'>('sms');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'employees' | 'clients'>('employees');
  const [searchQuery, setSearchQuery] = useState('');
  const [sendResult, setSendResult] = useState<{ success: number; failed: number } | null>(null);

  // Fetch employees and contacts on mount
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      // Fetch employees
      const empResponse = await fetch(`${API_URL}/messaging/employees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const empData = await empResponse.json();
      if (empData.data?.employees) {
        setEmployees(empData.data.employees);
      }

      // Fetch contacts
      const contactResponse = await fetch(`${API_URL}/messaging/contacts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const contactData = await contactResponse.json();
      if (contactData.data?.contacts) {
        setContacts(contactData.data.contacts);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecipient = (recipient: Recipient) => {
    setSelectedRecipients(prev => {
      const exists = prev.find(r => r.id === recipient.id && r.type === recipient.type);
      if (exists) {
        return prev.filter(r => !(r.id === recipient.id && r.type === recipient.type));
      }
      return [...prev, recipient];
    });
  };

  const isSelected = (id: number, type: 'employee' | 'contact') => {
    return selectedRecipients.some(r => r.id === id && r.type === type);
  };

  const selectAllEmployees = () => {
    const allEmployees: Recipient[] = employees.map(emp => ({
      id: emp.id,
      type: 'employee',
      name: `${emp.firstName} ${emp.lastName}`,
      phone: emp.phone,
      email: emp.email
    }));
    setSelectedRecipients(prev => {
      const withoutEmployees = prev.filter(r => r.type !== 'employee');
      return [...withoutEmployees, ...allEmployees];
    });
  };

  const selectAllClients = () => {
    const allClients: Recipient[] = contacts.map(contact => ({
      id: contact.id,
      type: 'contact',
      name: contact.companyName || `${contact.firstName} ${contact.lastName}`,
      phone: contact.phone,
      email: contact.email
    }));
    setSelectedRecipients(prev => {
      const withoutClients = prev.filter(r => r.type !== 'contact');
      return [...withoutClients, ...allClients];
    });
  };

  const clearSelection = () => {
    setSelectedRecipients([]);
  };

  const handleSend = async () => {
    if (selectedRecipients.length === 0 || !message.trim()) return;

    setIsSending(true);
    setSendResult(null);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/messaging/broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipients: selectedRecipients,
          message: message.trim(),
          messageType
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setSendResult({
          success: data.data?.success?.length || 0,
          failed: data.data?.failed?.length || 0
        });
        
        // Clear form after short delay
        setTimeout(() => {
          setMessage('');
          setSelectedRecipients([]);
          setSendResult(null);
          onClose();
        }, 2000);
      } else {
        alert(data.message || 'Failed to send messages');
      }
    } catch (error) {
      console.error('Failed to send:', error);
      alert('Failed to send messages. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // Filter based on search
  const filteredEmployees = employees.filter(emp => 
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.phone?.includes(searchQuery)
  );

  const filteredContacts = contacts.filter(contact =>
    `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone?.includes(searchQuery)
  );

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        backgroundColor: colors.backgroundSecondary || '#2D2D2D',
        borderRadius: '16px',
        width: '100%', maxWidth: '600px', maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: `1px solid ${colors.border || '#3D3D3D'}`,
          background: `linear-gradient(90deg, ${MAUVE_LIGHT} 0%, rgba(92, 107, 192, 0.15) 100%)`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '20px', color: colors.text || '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              📨 Broadcast Message
            </h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', color: colors.textSecondary || '#999', cursor: 'pointer' }}>✕</button>
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '14px', color: colors.textSecondary || '#999' }}>
            Send SMS or in-app message to employees and clients
          </p>
        </div>

        {/* Message Type Toggle */}
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${colors.border || '#3D3D3D'}` }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setMessageType('sms')}
              style={{
                flex: 1, padding: '12px', borderRadius: '10px',
                border: messageType === 'sms' ? `2px solid ${MAUVE}` : `1px solid ${colors.border || '#3D3D3D'}`,
                backgroundColor: messageType === 'sms' ? MAUVE_LIGHT : 'transparent',
                color: messageType === 'sms' ? MAUVE : colors.textSecondary || '#999',
                cursor: 'pointer', fontWeight: '600', fontSize: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              📱 SMS Text
            </button>
            <button
              onClick={() => setMessageType('inapp')}
              style={{
                flex: 1, padding: '12px', borderRadius: '10px',
                border: messageType === 'inapp' ? `2px solid ${INDIGO}` : `1px solid ${colors.border || '#3D3D3D'}`,
                backgroundColor: messageType === 'inapp' ? 'rgba(92, 107, 192, 0.15)' : 'transparent',
                color: messageType === 'inapp' ? INDIGO : colors.textSecondary || '#999',
                cursor: 'pointer', fontWeight: '600', fontSize: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              💬 In-App
            </button>
          </div>
        </div>

        {/* Recipients Section */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${colors.border || '#3D3D3D'}` }}>
            <button
              onClick={() => setActiveTab('employees')}
              style={{
                flex: 1, padding: '12px', border: 'none',
                backgroundColor: activeTab === 'employees' ? MAUVE_LIGHT : 'transparent',
                borderBottom: activeTab === 'employees' ? `3px solid ${MAUVE}` : '3px solid transparent',
                color: activeTab === 'employees' ? MAUVE : colors.textSecondary || '#999',
                cursor: 'pointer', fontWeight: '600', fontSize: '14px'
              }}
            >
              👷 Employees ({employees.length})
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              style={{
                flex: 1, padding: '12px', border: 'none',
                backgroundColor: activeTab === 'clients' ? MAUVE_LIGHT : 'transparent',
                borderBottom: activeTab === 'clients' ? `3px solid ${MAUVE}` : '3px solid transparent',
                color: activeTab === 'clients' ? MAUVE : colors.textSecondary || '#999',
                cursor: 'pointer', fontWeight: '600', fontSize: '14px'
              }}
            >
              👤 Clients ({contacts.length})
            </button>
          </div>

          {/* Search & Actions */}
          <div style={{ padding: '12px 20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: '8px',
                border: `1px solid ${colors.border || '#3D3D3D'}`,
                backgroundColor: colors.background || '#1A1A1A',
                color: colors.text || '#fff', fontSize: '14px', outline: 'none'
              }}
            />
            <button
              onClick={activeTab === 'employees' ? selectAllEmployees : selectAllClients}
              style={{
                padding: '10px 14px', borderRadius: '8px', border: 'none',
                backgroundColor: MAUVE, color: '#fff', fontSize: '12px',
                fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap'
              }}
            >
              Select All
            </button>
            {selectedRecipients.length > 0 && (
              <button
                onClick={clearSelection}
                style={{
                  padding: '10px 14px', borderRadius: '8px',
                  border: `1px solid ${colors.border || '#3D3D3D'}`,
                  backgroundColor: 'transparent', color: colors.textSecondary || '#999',
                  fontSize: '12px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap'
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Selected Count */}
          {selectedRecipients.length > 0 && (
            <div style={{ padding: '0 20px 12px', fontSize: '13px', color: MAUVE, fontWeight: '600' }}>
              ✓ {selectedRecipients.length} recipient{selectedRecipients.length > 1 ? 's' : ''} selected
            </div>
          )}

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
            {isLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: colors.textSecondary || '#999' }}>
                Loading...
              </div>
            ) : activeTab === 'employees' ? (
              filteredEmployees.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: colors.textSecondary || '#999' }}>
                  No employees found
                </div>
              ) : (
                filteredEmployees.map(emp => (
                  <button
                    key={emp.id}
                    onClick={() => toggleRecipient({
                      id: emp.id,
                      type: 'employee',
                      name: `${emp.firstName} ${emp.lastName}`,
                      phone: emp.phone,
                      email: emp.email
                    })}
                    style={{
                      width: '100%', padding: '12px', marginBottom: '8px',
                      borderRadius: '10px', border: 'none',
                      backgroundColor: isSelected(emp.id, 'employee') ? MAUVE_LIGHT : colors.background || '#1A1A1A',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '6px',
                      border: isSelected(emp.id, 'employee') ? `2px solid ${MAUVE}` : `2px solid ${colors.border || '#3D3D3D'}`,
                      backgroundColor: isSelected(emp.id, 'employee') ? MAUVE : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {isSelected(emp.id, 'employee') && <span style={{ color: '#fff', fontSize: '14px' }}>✓</span>}
                    </div>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      backgroundColor: '#8B5CF6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: '700', fontSize: '14px'
                    }}>
                      {emp.firstName?.[0]}{emp.lastName?.[0]}
                    </div>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: colors.text || '#fff' }}>
                        {emp.firstName} {emp.lastName}
                      </div>
                      <div style={{ fontSize: '12px', color: colors.textSecondary || '#999' }}>
                        {emp.phone || 'No phone'}
                      </div>
                    </div>
                  </button>
                ))
              )
            ) : (
              filteredContacts.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: colors.textSecondary || '#999' }}>
                  No clients found
                </div>
              ) : (
                filteredContacts.map(contact => (
                  <button
                    key={contact.id}
                    onClick={() => toggleRecipient({
                      id: contact.id,
                      type: 'contact',
                      name: contact.companyName || `${contact.firstName} ${contact.lastName}`,
                      phone: contact.phone,
                      email: contact.email
                    })}
                    style={{
                      width: '100%', padding: '12px', marginBottom: '8px',
                      borderRadius: '10px', border: 'none',
                      backgroundColor: isSelected(contact.id, 'contact') ? MAUVE_LIGHT : colors.background || '#1A1A1A',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '6px',
                      border: isSelected(contact.id, 'contact') ? `2px solid ${MAUVE}` : `2px solid ${colors.border || '#3D3D3D'}`,
                      backgroundColor: isSelected(contact.id, 'contact') ? MAUVE : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {isSelected(contact.id, 'contact') && <span style={{ color: '#fff', fontSize: '14px' }}>✓</span>}
                    </div>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      backgroundColor: '#10B981',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: '700', fontSize: '14px'
                    }}>
                      {contact.firstName?.[0]}{contact.lastName?.[0]}
                    </div>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: colors.text || '#fff' }}>
                        {contact.companyName || `${contact.firstName} ${contact.lastName}`}
                      </div>
                      <div style={{ fontSize: '12px', color: colors.textSecondary || '#999' }}>
                        {contact.phone || 'No phone'} • {contact.firstName} {contact.lastName}
                      </div>
                    </div>
                  </button>
                ))
              )
            )}
          </div>
        </div>

        {/* Message Input */}
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${colors.border || '#3D3D3D'}` }}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={messageType === 'sms' ? "Type your SMS message..." : "Type your in-app message..."}
            style={{
              width: '100%', minHeight: '80px', padding: '14px',
              borderRadius: '10px', border: `1px solid ${colors.border || '#3D3D3D'}`,
              backgroundColor: colors.background || '#1A1A1A',
              color: colors.text || '#fff', fontSize: '14px',
              resize: 'vertical', outline: 'none', boxSizing: 'border-box',
              fontFamily: 'inherit'
            }}
          />
          {messageType === 'sms' && (
            <div style={{ marginTop: '8px', fontSize: '12px', color: colors.textSecondary || '#999' }}>
              📱 SMS will be sent to {selectedRecipients.filter(r => r.phone).length} phone number(s)
            </div>
          )}
        </div>

        {/* Success Message */}
        {sendResult && (
          <div style={{
            padding: '12px 20px',
            backgroundColor: sendResult.failed === 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            color: sendResult.failed === 0 ? '#10B981' : '#F59E0B',
            fontSize: '14px', fontWeight: '600', textAlign: 'center'
          }}>
            ✓ Sent to {sendResult.success} recipient(s){sendResult.failed > 0 ? `, ${sendResult.failed} failed` : ''}
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${colors.border || '#3D3D3D'}`, display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '14px', borderRadius: '10px',
              border: `1px solid ${colors.border || '#3D3D3D'}`,
              backgroundColor: 'transparent', color: colors.textSecondary || '#999',
              fontSize: '15px', fontWeight: '600', cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={selectedRecipients.length === 0 || !message.trim() || isSending}
            style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: (selectedRecipients.length === 0 || !message.trim() || isSending)
                ? '#4B5563'
                : `linear-gradient(135deg, ${MAUVE} 0%, ${INDIGO} 100%)`,
              color: '#FFFFFF', fontSize: '15px', fontWeight: '600',
              cursor: (selectedRecipients.length === 0 || !message.trim() || isSending) ? 'not-allowed' : 'pointer',
              opacity: (selectedRecipients.length === 0 || !message.trim() || isSending) ? 0.6 : 1,
              boxShadow: (selectedRecipients.length === 0 || !message.trim() || isSending) ? 'none' : `0 4px 12px ${INDIGO_GLOW}`
            }}
          >
            {isSending ? 'Sending...' : `Send ${messageType === 'sms' ? 'SMS' : 'Message'}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BroadcastMessageModal;