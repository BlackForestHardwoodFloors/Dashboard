import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  FileText,
  Home,
  MessageSquare,
  Bell
} from 'lucide-react';

export default function AppointmentModal({ 
  isOpen, 
  onClose, 
  onSave 
}: { 
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  const [appointmentType, setAppointmentType] = useState('Onsite Visit');
  const [clientName, setClientName] = useState('');
  const [homeownerFirstName, setHomeownerFirstName] = useState('');
  const [homeownerLastName, setHomeownerLastName] = useState('');
  const [primaryContactSameAsHomeowner, setPrimaryContactSameAsHomeowner] = useState(true);
  const [primaryContactFirstName, setPrimaryContactFirstName] = useState('');
  const [primaryContactLastName, setPrimaryContactLastName] = useState('');
  const [primaryContactPhone, setPrimaryContactPhone] = useState('');
  const [address, setAddress] = useState('');
  const [assignedTo, setAssignedTo] = useState('Chase');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('9:00 AM');
  const [endTime, setEndTime] = useState('10:00 AM');
  const [completionDate, setCompletionDate] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [description, setDescription] = useState('');
  const [rooms, setRooms] = useState<string[]>([]);
  const [stainSamples, setStainSamples] = useState(false);
  const [notes, setNotes] = useState('');
  const [sendReminder, setSendReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState('30');
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [duration, setDuration] = useState(1);
  const [durationType, setDurationType] = useState<'hours' | 'days'>('hours');

  // Auto-populate primary contact when same as homeowner
  React.useEffect(() => {
    if (primaryContactSameAsHomeowner) {
      setPrimaryContactFirstName(homeownerFirstName);
      setPrimaryContactLastName(homeownerLastName);
    }
  }, [primaryContactSameAsHomeowner, homeownerFirstName, homeownerLastName]);

  // Generate display name (Last, First)
  const getDisplayName = (firstName: string, lastName: string) => {
    if (!firstName && !lastName) return '';
    if (!firstName) return lastName;
    if (!lastName) return firstName;
    return `${lastName}, ${firstName}`;
  };

  const homeownerDisplayName = getDisplayName(homeownerFirstName, homeownerLastName);
  const primaryContactDisplayName = getDisplayName(primaryContactFirstName, primaryContactLastName);

  // Generate time options (15-minute intervals)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 15) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const displayMin = min.toString().padStart(2, '0');
        times.push(`${displayHour}:${displayMin} ${period}`);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  // Update duration and type based on appointment type
  React.useEffect(() => {
    if (appointmentType === 'Onsite Visit' || appointmentType === 'Reminder' || appointmentType === 'Warranty' || appointmentType === 'Stain Appointment' || appointmentType === 'Materials Delivery') {
      setDuration(1);
      setDurationType('hours');
      setAllDay(false);
    } else if (appointmentType === 'Job') {
      setDuration(1);
      setDurationType('days');
      setAllDay(true);
    }
  }, [appointmentType]);

  // Check if appointment is multi-day
  const isMultiDay = durationType === 'days' && duration > 0;

  const roomOptions = [
    'Entry',
    'Living Room',
    'Dining Room',
    'Kitchen',
    'Master Bedroom',
    'Bedroom 2',
    'Bedroom 3',
    'Bedroom 4',
    'Hallway',
    'Stairs',
    'Basement',
    'Office',
    'Family Room',
    'Laundry Room',
    'Bathroom'
  ];

  const toggleRoom = (room: string) => {
    if (rooms.includes(room)) {
      setRooms(rooms.filter(r => r !== room));
    } else {
      setRooms([...rooms, room]);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '800px',
          backgroundColor: '#2D2D2D',
          borderRadius: '16px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #3D3D3D'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid #3D3D3D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#3B9CAA22',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calendar size={22} color="#3B9CAA" />
            </div>
            <div>
              <h2 style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                New Appointment
              </h2>
              <p style={{ color: '#A0A0A0', fontSize: '13px', margin: 0 }}>
                Schedule an estimate, job start, or site visit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#A0A0A0',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3D3D3D';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#A0A0A0';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '32px'
        }}>
          {/* Appointment Type */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#E0E0E0', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
              Appointment Type
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Onsite Visit', 'Job', 'Reminder', 'Warranty', 'Stain Appointment', 'Materials Delivery'].map((type) => (
                <button
                  key={type}
                  onClick={() => setAppointmentType(type)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: appointmentType === type ? '#3B9CAA' : '#1A1A1A',
                    color: appointmentType === type ? '#FFFFFF' : '#A0A0A0',
                    border: `1px solid ${appointmentType === type ? '#3B9CAA' : '#444'}`,
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (appointmentType !== type) {
                      e.currentTarget.style.borderColor = '#3B9CAA';
                      e.currentTarget.style.color = '#E0E0E0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (appointmentType !== type) {
                      e.currentTarget.style.borderColor = '#444';
                      e.currentTarget.style.color = '#A0A0A0';
                    }
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Client & Location */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', color: '#E0E0E0', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                <User size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                Client Name
              </label>
              <input
                type="text"
                placeholder="Select or type client name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#E0E0E0', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                <MapPin size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                Property Address
              </label>
              <input
                type="text"
                placeholder="Auto-filled from client"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Homeowner Information */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', color: '#E0E0E0', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                Homeowner First Name
              </label>
              <input
                type="text"
                placeholder="Enter homeowner's first name"
                value={homeownerFirstName}
                onChange={(e) => setHomeownerFirstName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#E0E0E0', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                Homeowner Last Name
              </label>
              <input
                type="text"
                placeholder="Enter homeowner's last name"
                value={homeownerLastName}
                onChange={(e) => setHomeownerLastName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Homeowner Display Name */}
          {homeownerDisplayName && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#E0E0E0', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                Homeowner Display Name
              </label>
              <div style={{
                width: '100%',
                padding: '10px 14px',
                backgroundColor: '#1A1A1A',
                border: '1px solid #3B9CAA',
                borderRadius: '8px',
                color: '#3B9CAA',
                fontSize: '13px',
                fontWeight: '600'
              }}>
                {homeownerDisplayName}
              </div>
            </div>
          )}

          {/* Primary Contact Information */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', color: '#E0E0E0', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                <User size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                Primary Contact Same as Homeowner
              </label>
              <input
                type="checkbox"
                checked={primaryContactSameAsHomeowner}
                onChange={(e) => setPrimaryContactSameAsHomeowner(e.target.checked)}
                style={{
                  cursor: 'pointer'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#E0E0E0', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                Primary Contact First Name
              </label>
              <input
                type="text"
                placeholder="Enter primary contact's first name"
                value={primaryContactFirstName}
                onChange={(e) => setPrimaryContactFirstName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#E0E0E0', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                Primary Contact Last Name
              </label>
              <input
                type="text"
                placeholder="Enter primary contact's last name"
                value={primaryContactLastName}
                onChange={(e) => setPrimaryContactLastName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#E0E0E0', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                Primary Contact Phone
              </label>
              <input
                type="text"
                placeholder="Enter primary contact's phone number"
                value={primaryContactPhone}
                onChange={(e) => setPrimaryContactPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Date & Time */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#E0E0E0', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
              <Clock size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              {appointmentType === 'Job' ? 'Start Date & Duration' : 'Date & Time'}
            </label>
            
            {/* Start Date Picker */}
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Duration & Time Controls */}
            {appointmentType === 'Job' ? (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#A0A0A0', fontSize: '11px', marginBottom: '6px' }}>
                      Duration
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: '#1A1A1A',
                        border: '1px solid #444',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#A0A0A0', fontSize: '11px', marginBottom: '6px' }}>
                      Unit
                    </label>
                    <select
                      value={durationType}
                      onChange={(e) => setDurationType(e.target.value as 'hours' | 'days')}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: '#1A1A1A',
                        border: '1px solid #444',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '13px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>
                
                {/* Completion Date for Multi-day Jobs */}
                {isMultiDay && (
                  <div style={{ marginTop: '12px' }}>
                    <label style={{ display: 'block', color: '#A0A0A0', fontSize: '11px', marginBottom: '6px' }}>
                      Completion Date
                    </label>
                    <input
                      type="date"
                      value={completionDate}
                      onChange={(e) => setCompletionDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: '#1A1A1A',
                        border: '1px solid #444',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '13px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#A0A0A0', fontSize: '11px', marginBottom: '6px' }}>
                      Start Time
                    </label>
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      disabled={allDay}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: '#1A1A1A',
                        border: '1px solid #444',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '13px',
                        outline: 'none',
                        cursor: 'pointer',
                        opacity: allDay ? 0.5 : 1
                      }}
                    >
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#A0A0A0', fontSize: '11px', marginBottom: '6px' }}>
                      End Time
                    </label>
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      disabled={allDay}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: '#1A1A1A',
                        border: '1px solid #444',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '13px',
                        outline: 'none',
                        cursor: 'pointer',
                        opacity: allDay ? 0.5 : 1
                      }}
                    >
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#A0A0A0', fontSize: '12px' }}>
                    <input
                      type="checkbox"
                      checked={allDay}
                      onChange={(e) => setAllDay(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    All-day appointment
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Assigned To */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#E0E0E0', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
              Assigned To
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                backgroundColor: '#1A1A1A',
                border: '1px solid #444',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="Chase">Chase</option>
              <option value="Tony">Tony</option>
              <option value="Alex">Alex</option>
              <option value="Anthony">Anthony</option>
              <option value="Jerry">Jerry</option>
            </select>
          </div>

          {/* Room Checklist */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#E0E0E0', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
              <Home size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Rooms / Areas
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {roomOptions.map((room) => (
                <label
                  key={room}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    backgroundColor: rooms.includes(room) ? '#7BAA8E22' : '#1A1A1A',
                    border: `1px solid ${rooms.includes(room) ? '#7BAA8E' : '#444'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: rooms.includes(room) ? '#7BAA8E' : '#A0A0A0',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={rooms.includes(room)}
                    onChange={() => toggleRoom(room)}
                    style={{ cursor: 'pointer' }}
                  />
                  {room}
                </label>
              ))}
            </div>
            <div style={{ marginTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#A0A0A0', fontSize: '12px' }}>
                <input
                  type="checkbox"
                  checked={stainSamples}
                  onChange={(e) => setStainSamples(e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                Bring stain samples
              </label>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#E0E0E0', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
              <FileText size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Description
            </label>
            <textarea
              placeholder="Additional details about this appointment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '10px 14px',
                backgroundColor: '#1A1A1A',
                border: '1px solid #444',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '13px',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#E0E0E0', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
              <MessageSquare size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Notes (Pets, Parking, Access, etc.)
            </label>
            <textarea
              placeholder="Two dogs - please close gates. Park in driveway."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              style={{
                width: '100%',
                padding: '10px 14px',
                backgroundColor: '#1A1A1A',
                border: '1px solid #444',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '13px',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Text Reminder */}
          <div style={{
            padding: '16px',
            backgroundColor: '#C9A04911',
            borderRadius: '10px',
            borderLeft: '4px solid #C9A049'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <input
                type="checkbox"
                checked={sendReminder}
                onChange={(e) => setSendReminder(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <Bell size={16} color="#C9A049" />
              <span style={{ color: '#C9A049', fontSize: '13px', fontWeight: '600' }}>
                Send text reminder before appointment
              </span>
            </label>
            {sendReminder && (
              <div style={{ marginLeft: '32px' }}>
                <select
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="15">15 minutes before</option>
                  <option value="30">30 minutes before</option>
                  <option value="45">45 minutes before</option>
                  <option value="60">1 hour before</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 32px',
          borderTop: '1px solid #3D3D3D',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '11px 22px',
              backgroundColor: 'transparent',
              color: '#A0A0A0',
              border: '1px solid #444',
              borderRadius: '999px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#C9A049';
              e.currentTarget.style.color = '#C9A049';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#444';
              e.currentTarget.style.color = '#A0A0A0';
            }}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            style={{
              padding: '11px 22px',
              backgroundColor: '#C9A049',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '999px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 0 0 #A88438CC, 0 6px 12px rgba(201,160,73,0.3)',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#D9B563';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#C9A049';
            }}
          >
            Save Appointment
          </button>
        </div>
      </div>
    </div>
  );
}