import React from 'react';
import { Plus, Trash2, ChevronDown } from 'lucide-react';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumbers: Array<{ number: string; type: string; name?: string }>;
  emailAddresses: Array<{ email: string; name?: string }>;
  role: string;
  preferredContactMethod: string;
  isPrimaryContact: boolean;
  grantPortalAccess: boolean;
  receiveSMS: boolean;
  receiveEmail: boolean;
}

interface ContactCardProps {
  contact: Contact;
  isPrimary: boolean;
  onUpdate: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
  showRemove: boolean;
}

export default function ContactCard({ contact, isPrimary, onUpdate, onRemove, showRemove }: ContactCardProps) {
  const addPhoneNumber = () => {
    onUpdate(contact.id, 'phoneNumbers', [...contact.phoneNumbers, { number: '', type: 'Mobile', name: '' }]);
  };

  const updatePhoneNumber = (index: number, field: 'number' | 'type' | 'name', value: string) => {
    const updated = [...contact.phoneNumbers];
    updated[index][field] = value;
    onUpdate(contact.id, 'phoneNumbers', updated);
  };

  const addEmail = () => {
    onUpdate(contact.id, 'emailAddresses', [...contact.emailAddresses, { email: '', name: '' }]);
  };

  const updateEmail = (index: number, field: 'email' | 'name', value: string) => {
    const updated = [...contact.emailAddresses];
    updated[index][field] = value;
    onUpdate(contact.id, 'emailAddresses', updated);
  };

  return (
    <div style={{
      backgroundColor: '#232425',
      borderRadius: '14px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <h3 style={{
          color: '#FFFFFF',
          fontSize: '18px',
          fontWeight: '600',
          margin: 0
        }}>
          {isPrimary ? 'Primary Contact' : 'Additional Contact'}
        </h3>
        {showRemove && (
          <button
            onClick={() => onRemove(contact.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: 'transparent',
              border: '2px solid #E57373',
              borderRadius: '10px',
              color: '#E57373',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E5737320';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Trash2 size={14} />
            Remove
          </button>
        )}
      </div>

      {/* Name Fields - 2 Column */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '16px'
      }}>
        <div>
          <label style={{
            display: 'block',
            color: '#A5A5A5',
            fontSize: '13px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            First Name <span style={{ color: '#C9A049' }}>*</span>
          </label>
          <input
            type="text"
            placeholder="Lisa"
            value={contact.firstName}
            onChange={(e) => onUpdate(contact.id, 'firstName', e.target.value)}
            style={{
              width: '100%',
              padding: '11px 14px',
              backgroundColor: '#2C2D2E',
              border: '1px solid #3A3A3B',
              borderRadius: '10px',
              color: '#FFFFFF',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.15s ease-in-out'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#5EB77D';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#3A3A3B';
            }}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            color: '#A5A5A5',
            fontSize: '13px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Last Name <span style={{ color: '#C9A049' }}>*</span>
          </label>
          <input
            type="text"
            placeholder="Anderson"
            value={contact.lastName}
            onChange={(e) => onUpdate(contact.id, 'lastName', e.target.value)}
            style={{
              width: '100%',
              padding: '11px 14px',
              backgroundColor: '#2C2D2E',
              border: '1px solid #3A3A3B',
              borderRadius: '10px',
              color: '#FFFFFF',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.15s ease-in-out'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#5EB77D';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#3A3A3B';
            }}
          />
        </div>
      </div>

      {/* Phone Numbers */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          color: '#A5A5A5',
          fontSize: '13px',
          fontWeight: '500',
          marginBottom: '8px'
        }}>
          Phone Numbers <span style={{ color: '#7A7A7A', fontSize: '12px' }}>(optional)</span>
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
          {contact.phoneNumbers.map((phone, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Name"
                value={phone.name || ''}
                onChange={(e) => updatePhoneNumber(index, 'name', e.target.value)}
                style={{
                  width: '150px',
                  padding: '11px 14px',
                  backgroundColor: '#2C2D2E',
                  border: '1px solid #3A3A3B',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.15s ease-in-out'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#5EB77D';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3A3A3B';
                }}
              />
              <input
                type="text"
                placeholder="e.g., 123-456-7890"
                value={phone.number}
                onChange={(e) => updatePhoneNumber(index, 'number', e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  backgroundColor: '#2C2D2E',
                  border: '1px solid #3A3A3B',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.15s ease-in-out'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#5EB77D';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3A3A3B';
                }}
              />
              <div style={{ position: 'relative' }}>
                <select
                  value={phone.type}
                  onChange={(e) => updatePhoneNumber(index, 'type', e.target.value)}
                  style={{
                    width: '120px',
                    padding: '11px 36px 11px 14px',
                    backgroundColor: '#2C2D2E',
                    border: '1px solid #3A3A3B',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease-in-out',
                    appearance: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#5EB77D';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#3A3A3B';
                  }}
                >
                  <option value="Mobile">Mobile</option>
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                </select>
                <ChevronDown 
                  size={14} 
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: '#7A7A7A'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addPhoneNumber}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            backgroundColor: 'transparent',
            border: '2px solid #5EB77D',
            borderRadius: '12px',
            color: '#5EB77D',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.15s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#5EB77D15';
            e.currentTarget.style.borderColor = '#6FB880';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = '#5EB77D';
          }}
        >
          <Plus size={16} />
          Add Phone Number
        </button>
      </div>

      {/* Email Addresses */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          color: '#A5A5A5',
          fontSize: '13px',
          fontWeight: '500',
          marginBottom: '8px'
        }}>
          Email Addresses <span style={{ color: '#7A7A7A', fontSize: '12px' }}>(optional)</span>
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
          {contact.emailAddresses.map((email, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Name"
                value={email.name || ''}
                onChange={(e) => updateEmail(index, 'name', e.target.value)}
                style={{
                  width: '150px',
                  padding: '11px 14px',
                  backgroundColor: '#2C2D2E',
                  border: '1px solid #3A3A3B',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.15s ease-in-out'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#5EB77D';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3A3A3B';
                }}
              />
              <input
                type="email"
                placeholder="e.g., example@example.com"
                value={email.email}
                onChange={(e) => updateEmail(index, 'email', e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  backgroundColor: '#2C2D2E',
                  border: '1px solid #3A3A3B',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.15s ease-in-out'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#5EB77D';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3A3A3B';
                }}
              />
            </div>
          ))}
        </div>
        <button
          onClick={addEmail}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            backgroundColor: 'transparent',
            border: '2px solid #5EB77D',
            borderRadius: '12px',
            color: '#5EB77D',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.15s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#5EB77D15';
            e.currentTarget.style.borderColor = '#6FB880';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = '#5EB77D';
          }}
        >
          <Plus size={16} />
          Add Email Address
        </button>
      </div>

      {/* Role */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          color: '#A5A5A5',
          fontSize: '13px',
          fontWeight: '500',
          marginBottom: '8px'
        }}>
          Role <span style={{ color: '#C9A049' }}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <select
            value={contact.role}
            onChange={(e) => onUpdate(contact.id, 'role', e.target.value)}
            style={{
              width: '100%',
              padding: '11px 36px 11px 14px',
              backgroundColor: '#2C2D2E',
              border: '1px solid #3A3A3B',
              borderRadius: '10px',
              color: '#FFFFFF',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease-in-out',
              appearance: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#5EB77D';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#3A3A3B';
            }}
          >
            <option value="Owner">Owner</option>
            <option value="Tenant">Tenant</option>
            <option value="Manager">Manager</option>
            <option value="Other">Other</option>
          </select>
          <ChevronDown 
            size={16} 
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: '#7A7A7A'
            }}
          />
        </div>
      </div>

      {/* Preferred Contact Method */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          color: '#A5A5A5',
          fontSize: '13px',
          fontWeight: '500',
          marginBottom: '8px'
        }}>
          Preferred Contact Method <span style={{ color: '#C9A049' }}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <select
            value={contact.preferredContactMethod}
            onChange={(e) => onUpdate(contact.id, 'preferredContactMethod', e.target.value)}
            style={{
              width: '100%',
              padding: '11px 36px 11px 14px',
              backgroundColor: '#2C2D2E',
              border: '1px solid #3A3A3B',
              borderRadius: '10px',
              color: '#FFFFFF',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease-in-out',
              appearance: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#5EB77D';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#3A3A3B';
            }}
          >
            <option value="Phone">Phone</option>
            <option value="Email">Email</option>
            <option value="SMS">SMS</option>
          </select>
          <ChevronDown 
            size={16} 
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: '#7A7A7A'
            }}
          />
        </div>
      </div>

      {/* Toggles in 2 columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
      }}>
        {/* Grant Portal Access */}
        <div>
          <label style={{
            display: 'block',
            color: '#A5A5A5',
            fontSize: '13px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Portal Access
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={contact.grantPortalAccess ? 'Yes' : 'No'}
              onChange={(e) => onUpdate(contact.id, 'grantPortalAccess', e.target.value === 'Yes')}
              style={{
                width: '100%',
                padding: '11px 36px 11px 14px',
                backgroundColor: '#2C2D2E',
                border: '1px solid #3A3A3B',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease-in-out',
                appearance: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#5EB77D';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#3A3A3B';
              }}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <ChevronDown 
              size={16} 
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#7A7A7A'
              }}
            />
          </div>
        </div>

        {/* Receive SMS */}
        <div>
          <label style={{
            display: 'block',
            color: '#A5A5A5',
            fontSize: '13px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Receive SMS
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={contact.receiveSMS ? 'Yes' : 'No'}
              onChange={(e) => onUpdate(contact.id, 'receiveSMS', e.target.value === 'Yes')}
              style={{
                width: '100%',
                padding: '11px 36px 11px 14px',
                backgroundColor: '#2C2D2E',
                border: '1px solid #3A3A3B',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease-in-out',
                appearance: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#5EB77D';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#3A3A3B';
              }}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <ChevronDown 
              size={16} 
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#7A7A7A'
              }}
            />
          </div>
        </div>

        {/* Receive Email - Full width on second row */}
      </div>
      
      <div style={{ marginTop: '16px' }}>
        <label style={{
          display: 'block',
          color: '#A5A5A5',
          fontSize: '13px',
          fontWeight: '500',
          marginBottom: '8px'
        }}>
          Receive Email
        </label>
        <div style={{ position: 'relative' }}>
          <select
            value={contact.receiveEmail ? 'Yes' : 'No'}
            onChange={(e) => onUpdate(contact.id, 'receiveEmail', e.target.value === 'Yes')}
            style={{
              width: '100%',
              padding: '11px 36px 11px 14px',
              backgroundColor: '#2C2D2E',
              border: '1px solid #3A3A3B',
              borderRadius: '10px',
              color: '#FFFFFF',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease-in-out',
              appearance: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#5EB77D';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#3A3A3B';
            }}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <ChevronDown 
            size={16} 
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: '#7A7A7A'
            }}
          />
        </div>
      </div>
    </div>
  );
}