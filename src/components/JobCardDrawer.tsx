import React, { useState, useEffect } from 'react';
import { X, User, MapPin, Calendar, FileText, Clock, MessageSquare, Phone, Mail, Home, Briefcase, ChevronRight, AlertCircle, Send, Camera, Clipboard, ExternalLink, Building2, Loader, Check, Pencil, Users, UserCheck, Truck } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Foreman colors for job assignments
const FOREMAN_COLORS: Record<string, string> = {
  'Chase': '#9B59B6',
  'Tony': '#6E8B3D', 
  'Alex': '#3B9CAA',
  'Anthony': '#4F6A41',
  'Jerry': '#E67E22',
  'Unassigned': '#666666'
};

// Get color based on purpose and foreman
const getJobColor = (purpose?: string, foreman?: string): string => {
  const p = purpose?.toLowerCase() || '';
  if (p.includes('onsite') || p.includes('visit')) return '#3498DB'; // Blue
  if (p.includes('wood') || p.includes('delivery')) return '#E74C3C'; // Red
  if (p.includes('project') || p.includes('job') || p.includes('install') || p.includes('sand') || p.includes('finish')) {
    return FOREMAN_COLORS[foreman || 'Unassigned'] || '#C9A049';
  }
  return '#C9A049'; // Default gold
};

interface JobCardDrawerProps { isOpen: boolean; appointmentId: number | null; onClose: () => void; onNavigate?: (page: string) => void; onDataUpdate?: () => void; }
interface Appointment { id: number; contact?: string; location?: string; startDate: string; endDate: string; startTime: string; endTime: string; purpose: string; description?: string; employeeName?: number; foreman?: string; teamMembers?: string[]; employee?: { id: number; firstName: string; lastName: string }; }
interface Contact { id: number; firstName: string; lastName?: string; email?: string; phone?: string; additionalPhone?: string; companyName?: string; clientType?: string; clientSource?: string; message?: string; }
interface Photo { id: number; url: string; caption?: string; createdAt: string; }
interface Message { id: number; body: string; direction: 'inbound' | 'outbound'; createdAt: string; }
interface Job { id: number; jobNumber?: string; status?: string; jobType?: string; startDate?: string; foreman?: string; }
interface Employee { id: number; firstName: string; lastName: string; }
type TabType = 'overview' | 'briefing' | 'photos' | 'messages' | 'jobs' | 'files';

function EditableField({ label, value, onSave, type = 'text', options, color = '#FFF' }: { label: string; value: string; onSave: (val: string) => void; type?: 'text' | 'select' | 'textarea' | 'date' | 'time'; options?: { value: string; label: string }[]; color?: string }) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [saving, setSaving] = useState(false);
  useEffect(() => { setTempValue(value); }, [value]);
  const handleSave = async () => { if (tempValue !== value) { setSaving(true); await onSave(tempValue); setSaving(false); } setEditing(false); };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && type !== 'textarea') handleSave(); if (e.key === 'Escape') { setTempValue(value); setEditing(false); } };
  if (editing) {
    return (<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {type === 'select' ? (<select value={tempValue} onChange={(e) => setTempValue(e.target.value)} onBlur={handleSave} autoFocus style={{ flex: 1, padding: '8px 12px', backgroundColor: '#1A1A1A', border: '2px solid #C9A049', borderRadius: '6px', color: '#FFF', fontSize: '14px', outline: 'none' }}>{options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select>)
      : type === 'textarea' ? (<textarea value={tempValue} onChange={(e) => setTempValue(e.target.value)} onKeyDown={handleKeyDown} autoFocus rows={3} style={{ flex: 1, padding: '8px 12px', backgroundColor: '#1A1A1A', border: '2px solid #C9A049', borderRadius: '6px', color: '#FFF', fontSize: '14px', outline: 'none', resize: 'vertical' }} />)
      : (<input type={type} value={tempValue} onChange={(e) => setTempValue(e.target.value)} onKeyDown={handleKeyDown} autoFocus style={{ flex: 1, padding: '8px 12px', backgroundColor: '#1A1A1A', border: '2px solid #C9A049', borderRadius: '6px', color: '#FFF', fontSize: '14px', outline: 'none' }} />)}
      <button onClick={handleSave} disabled={saving} style={{ padding: '8px', backgroundColor: '#27AE60', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{saving ? <Loader size={16} color="#FFF" style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={16} color="#FFF" />}</button>
      <button onClick={() => { setTempValue(value); setEditing(false); }} style={{ padding: '8px', backgroundColor: '#E74C3C', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} color="#FFF" /></button>
    </div>);
  }
  return (<div onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', cursor: 'pointer', padding: '4px 8px', margin: '-4px -8px', borderRadius: '6px', transition: 'background 0.15s', width: '100%' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}><span style={{ color, fontSize: '14px', fontWeight: '500' }}>{value || 'Click to add...'}</span><Pencil size={12} color="#666" style={{ flexShrink: 0 }} /></div>);
}

// Multi-select for team members
function TeamSelector({ selected, employees, onSave }: { selected: string[]; employees: Employee[]; onSave: (members: string[]) => void }) {
  const [editing, setEditing] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>(selected);
  
  useEffect(() => { setTempSelected(selected); }, [selected]);
  
  const toggleMember = (name: string) => {
    setTempSelected(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };
  
  const handleSave = () => { onSave(tempSelected); setEditing(false); };
  
  if (editing) {
    return (<div style={{ backgroundColor: '#1A1A1A', borderRadius: '8px', padding: '12px', border: '2px solid #C9A049' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
        {employees.map(emp => {
          const name = `${emp.firstName} ${emp.lastName}`;
          const isSelected = tempSelected.includes(name);
          return (<button key={emp.id} onClick={() => toggleMember(name)} style={{ padding: '6px 12px', backgroundColor: isSelected ? '#4F6A41' : '#2D2D2D', border: '1px solid ' + (isSelected ? '#6E8B3D' : '#3D3D3D'), borderRadius: '6px', color: '#FFF', fontSize: '13px', cursor: 'pointer' }}>{name}</button>);
        })}
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button onClick={() => setEditing(false)} style={{ padding: '6px 12px', backgroundColor: '#2D2D2D', border: '1px solid #3D3D3D', borderRadius: '6px', color: '#A0A0A0', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
        <button onClick={handleSave} style={{ padding: '6px 12px', backgroundColor: '#27AE60', border: 'none', borderRadius: '6px', color: '#FFF', fontSize: '13px', cursor: 'pointer' }}>Save</button>
      </div>
    </div>);
  }
  
  return (<div onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '8px', backgroundColor: '#1A1A1A', borderRadius: '8px', border: '1px solid #3D3D3D' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#252525'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1A1A1A'}>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {selected.length === 0 ? <span style={{ color: '#666', fontSize: '13px' }}>Click to assign team members...</span> : selected.map(name => (
        <span key={name} style={{ padding: '4px 8px', backgroundColor: '#4F6A41', borderRadius: '4px', color: '#FFF', fontSize: '12px' }}>{name}</span>
      ))}
    </div>
    <Pencil size={12} color="#666" style={{ flexShrink: 0 }} />
  </div>);
}

export default function JobCardDrawer({ isOpen, appointmentId, onClose, onNavigate, onDataUpdate }: JobCardDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [contact, setContact] = useState<Contact | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => { if (isOpen && appointmentId) fetchAllData(); }, [isOpen, appointmentId]);
  const getHeaders = () => ({ 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' });

  const fetchAllData = async () => {
    setLoading(true); setError(null);
    try {
      const headers = getHeaders();
      const aptRes = await fetch(`${API_URL}/appointments/get-appointments`, { headers });
      const aptData = await aptRes.json();
      const apts = aptData.data?.appointments || aptData.appointments || aptData || [];
      const apt = apts.find((a: Appointment) => a.id === appointmentId);
      setAppointment(apt || null);
      
      // Fetch employees
      try {
        const empRes = await fetch(`${API_URL}/employee/get-employee`, { headers });
        if (empRes.ok) { const empData = await empRes.json(); setEmployees(empData.data?.employee || empData.employee || []); }
      } catch {}
      
      if (apt?.contact) {
        const cRes = await fetch(`${API_URL}/contact/get-contact`, { headers });
        const cData = await cRes.json();
        const contacts = cData.data?.contacts || cData.contacts || cData.data || [];
        const contactName = apt.contact.toLowerCase().trim();
        // Try multiple matching strategies
        const match = contacts.find((c: Contact) => {
          const fullName = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase().trim();
          const reverseName = `${c.lastName || ''} ${c.firstName || ''}`.toLowerCase().trim();
          const firstOnly = (c.firstName || '').toLowerCase().trim();
          const lastOnly = (c.lastName || '').toLowerCase().trim();
          return fullName === contactName || reverseName === contactName || firstOnly === contactName || lastOnly === contactName || contactName.includes(firstOnly) || contactName.includes(lastOnly);
        });
        
        // If no match found, create a temporary contact from appointment data
        if (match) {
          setContact(match);
        } else if (apt.contact) {
          // Parse name from appointment contact field
          const nameParts = apt.contact.trim().split(' ');
          const tempContact: Contact = {
            id: 0,
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
          };
          setContact(tempContact);
        }
        
        if (match?.phone) { try { const mRes = await fetch(`${API_URL}/sms/messages/${match.phone}`, { headers }); if (mRes.ok) { const mData = await mRes.json(); setMessages(mData.messages || []); } } catch {} }
      }
      try { const pRes = await fetch(`${API_URL}/photo/all`, { headers }); if (pRes.ok) { const pData = await pRes.json(); setPhotos(pData.photos || []); } } catch {}
      try { const jRes = await fetch(`${API_URL}/jobs/get-jobs`, { headers }); if (jRes.ok) { const jData = await jRes.json(); setJobs(jData.data?.jobs || jData.jobs || []); } } catch {}
    } catch { setError('Failed to load'); } finally { setLoading(false); }
  };

  const updateAppointment = async (field: string, value: any) => {
    if (!appointment) return;
    try {
      const res = await fetch(`${API_URL}/appointments/update-appointment/${appointment.id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ ...appointment, [field]: value }) });
      if (res.ok) { setAppointment(p => p ? { ...p, [field]: value } : null); setSaveStatus('Saved!'); setTimeout(() => setSaveStatus(null), 2000); if (onDataUpdate) onDataUpdate(); }
    } catch {}
  };

  const updateContact = async (field: string, value: string) => {
    if (!contact) return;
    try {
      const res = await fetch(`${API_URL}/contact/update-contact/${contact.id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ ...contact, [field]: value }) });
      if (res.ok) {
        setContact(p => p ? { ...p, [field]: value } : null);
        if ((field === 'firstName' || field === 'lastName') && appointment) {
          const newName = field === 'firstName' ? `${value} ${contact.lastName || ''}`.trim() : `${contact.firstName} ${value}`.trim();
          await updateAppointment('contact', newName);
        }
        setSaveStatus('Saved!'); setTimeout(() => setSaveStatus(null), 2000); if (onDataUpdate) onDataUpdate();
      }
    } catch {}
  };

  const sendSMS = async () => {
    if (!contact?.phone || !newMessage.trim()) return;
    try {
      const res = await fetch(`${API_URL}/sms/send-message`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ to: contact.phone, message: newMessage }) });
      if (res.ok) { setNewMessage(''); setMessages(prev => [...prev, { id: Date.now(), body: newMessage, direction: 'outbound', createdAt: new Date().toISOString() }]); setSaveStatus('Sent!'); setTimeout(() => setSaveStatus(null), 2000); }
    } catch {}
  };

  if (!isOpen) return null;
  
  const jobColor = getJobColor(appointment?.purpose, appointment?.foreman);
  const tabs = [{ id: 'overview' as TabType, label: 'Overview', icon: User }, { id: 'briefing' as TabType, label: 'Briefing', icon: Clipboard }, { id: 'photos' as TabType, label: 'Photos', icon: Camera }, { id: 'messages' as TabType, label: 'Messages', icon: MessageSquare }, { id: 'jobs' as TabType, label: 'Jobs & Quotes', icon: Briefcase }, { id: 'files' as TabType, label: 'Files', icon: FileText }];
  const fmtDate = (d: string) => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
  const fmtTime = (t: string) => { if (!t) return 'N/A'; const [h, m] = t.split(':').map(Number); return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${m.toString().padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };
  const fmtName = (n?: string) => n ? n.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : 'Unknown';
  const purposeOpts = [{ value: 'Onsite Visit', label: 'Onsite Visit' }, { value: 'Project', label: 'Project' }, { value: 'Job', label: 'Job' }, { value: 'Wood Delivery', label: 'Wood Delivery' }, { value: 'Install', label: 'Install' }, { value: 'Sand & Finish', label: 'Sand & Finish' }];
  const timeOpts = Array.from({ length: 96 }, (_, i) => { const h = Math.floor(i / 4), m = (i % 4) * 15; const v = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`; return { value: v, label: `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${m.toString().padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}` }; });
  const foremanOpts = [{ value: '', label: 'Unassigned' }, ...Object.keys(FOREMAN_COLORS).filter(k => k !== 'Unassigned').map(f => ({ value: f, label: f }))];

  return (<>
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9998 }} />
    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '900px', maxWidth: '95vw', backgroundColor: '#1A1A1A', borderLeft: `3px solid ${jobColor}`, boxShadow: '-8px 0 32px rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.3s ease-out' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #3D3D3D', backgroundColor: '#242424' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: jobColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: '20px', fontWeight: 'bold', border: '3px solid #3D3D3D' }}>{appointment?.contact?.charAt(0)?.toUpperCase() || 'A'}</div>
              <div><h2 style={{ color: '#FFF', fontSize: '22px', fontWeight: 'bold', margin: 0 }}>{fmtName(appointment?.contact)}</h2>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                  <span style={{ padding: '4px 10px', backgroundColor: jobColor, color: '#FFF', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>{appointment?.purpose}</span>
                  {appointment?.foreman && <span style={{ padding: '4px 10px', backgroundColor: FOREMAN_COLORS[appointment.foreman] || '#666', color: '#FFF', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>Foreman: {appointment.foreman}</span>}
                  {contact?.clientType && <span style={{ padding: '4px 10px', backgroundColor: '#4F6A41', color: '#FFF', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>{contact.clientType}</span>}
                  {saveStatus && <span style={{ padding: '4px 10px', backgroundColor: '#27AE60', color: '#FFF', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>{saveStatus}</span>}
                </div></div></div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#A0A0A0', fontSize: '13px' }}><Calendar size={14} color="#C9A049" />{fmtDate(appointment?.startDate || '')}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#A0A0A0', fontSize: '13px' }}><Clock size={14} color="#3B9CAA" />{fmtTime(appointment?.startTime || '')} - {fmtTime(appointment?.endTime || '')}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#A0A0A0', fontSize: '13px' }}><MapPin size={14} color="#E67E22" />{appointment?.location || 'No address'}</div>
            </div></div>
          <button onClick={onClose} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2D2D2D', border: '1px solid #3D3D3D', borderRadius: '10px', cursor: 'pointer', color: '#A0A0A0' }}><X size={20} /></button>
        </div></div>
      <div style={{ display: 'flex', gap: '4px', padding: '12px 24px', backgroundColor: '#1F1F1F', borderBottom: '1px solid #3D3D3D', overflowX: 'auto' }}>
        {tabs.map(t => { const I = t.icon; return <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: activeTab === t.id ? '#C9A049' : 'transparent', color: activeTab === t.id ? '#FFF' : '#A0A0A0', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}><I size={16} />{t.label}</button>; })}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {loading ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#A0A0A0' }}><Loader size={40} style={{ animation: 'spin 1s linear infinite' }} /><p>Loading...</p></div>
        : error ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#E74C3C' }}><AlertCircle size={40} /><p>{error}</p></div>
        : <>
          {activeTab === 'overview' && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ backgroundColor: '#242424', borderRadius: '12px', padding: '20px', border: '1px solid #3D3D3D' }}>
              <h3 style={{ color: '#C9A049', fontSize: '14px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><User size={16} /> Client Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div><div style={{ color: '#666', fontSize: '11px', marginBottom: '4px' }}>First Name</div><EditableField label="" value={contact?.firstName || ''} onSave={v => updateContact('firstName', v)} /></div>
                <div><div style={{ color: '#666', fontSize: '11px', marginBottom: '4px' }}>Last Name</div><EditableField label="" value={contact?.lastName || ''} onSave={v => updateContact('lastName', v)} /></div>
                <div><div style={{ color: '#666', fontSize: '11px', marginBottom: '4px' }}>Phone</div><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} color="#27AE60" /><EditableField label="" value={contact?.phone || ''} onSave={v => updateContact('phone', v)} /></div></div>
                <div><div style={{ color: '#666', fontSize: '11px', marginBottom: '4px' }}>Email</div><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14} color="#3498DB" /><EditableField label="" value={contact?.email || ''} onSave={v => updateContact('email', v)} /></div></div>
                <div><div style={{ color: '#666', fontSize: '11px', marginBottom: '4px' }}>Company</div><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Building2 size={14} color="#9B59B6" /><EditableField label="" value={contact?.companyName || ''} onSave={v => updateContact('companyName', v)} /></div></div>
              </div></div>
            <div style={{ backgroundColor: '#242424', borderRadius: '12px', padding: '20px', border: '1px solid #3D3D3D' }}>
              <h3 style={{ color: '#3B9CAA', fontSize: '14px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} /> Appointment</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div><div style={{ color: '#666', fontSize: '11px', marginBottom: '4px' }}>Date</div><EditableField label="" value={appointment?.startDate || ''} type="date" onSave={v => { updateAppointment('startDate', v); updateAppointment('endDate', v); }} /></div>
                <div><div style={{ color: '#666', fontSize: '11px', marginBottom: '4px' }}>Start Time</div><EditableField label="" value={appointment?.startTime || ''} type="select" options={timeOpts} onSave={v => updateAppointment('startTime', v)} /></div>
                <div><div style={{ color: '#666', fontSize: '11px', marginBottom: '4px' }}>End Time</div><EditableField label="" value={appointment?.endTime || ''} type="select" options={timeOpts} onSave={v => updateAppointment('endTime', v)} /></div>
                <div><div style={{ color: '#666', fontSize: '11px', marginBottom: '4px' }}>Purpose</div><EditableField label="" value={appointment?.purpose || ''} type="select" options={purposeOpts} onSave={v => updateAppointment('purpose', v)} /></div>
              </div></div>
            
            {/* Team Assignment Section */}
            <div style={{ backgroundColor: '#242424', borderRadius: '12px', padding: '20px', border: `1px solid ${jobColor}`, gridColumn: 'span 2' }}>
              <h3 style={{ color: jobColor, fontSize: '14px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={16} /> Team Assignment</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ color: '#666', fontSize: '11px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><UserCheck size={12} /> Foreman</div>
                  <EditableField label="" value={appointment?.foreman || ''} type="select" options={foremanOpts} onSave={v => updateAppointment('foreman', v)} />
                  {appointment?.foreman && <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: FOREMAN_COLORS[appointment.foreman] || '#666' }} /><span style={{ color: '#A0A0A0', fontSize: '12px' }}>Color: {appointment.foreman}</span></div>}
                </div>
                <div>
                  <div style={{ color: '#666', fontSize: '11px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={12} /> Team Members</div>
                  <TeamSelector selected={appointment?.teamMembers || []} employees={employees} onSave={members => updateAppointment('teamMembers', members)} />
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#242424', borderRadius: '12px', padding: '20px', border: '1px solid #3D3D3D', gridColumn: 'span 2' }}>
              <h3 style={{ color: '#E67E22', fontSize: '14px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} /> Location</h3>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ width: '120px', height: '80px', backgroundColor: '#1A1A1A', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #3D3D3D' }}><Home size={32} color="#3D3D3D" /></div>
                <div style={{ flex: 1 }}><EditableField label="" value={appointment?.location || ''} onSave={v => updateAppointment('location', v)} /><button onClick={() => appointment?.location && window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(appointment.location)}`, '_blank')} style={{ marginTop: '12px', padding: '8px 16px', backgroundColor: '#2D2D2D', border: '1px solid #3D3D3D', borderRadius: '8px', color: '#A0A0A0', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><ExternalLink size={14} /> Open in Maps</button></div>
              </div></div>
            <div style={{ backgroundColor: '#242424', borderRadius: '12px', padding: '20px', border: '1px solid #3D3D3D', gridColumn: 'span 2' }}>
              <h3 style={{ color: '#9B59B6', fontSize: '14px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={16} /> Notes</h3>
              <EditableField label="" value={appointment?.description || ''} type="textarea" onSave={v => updateAppointment('description', v)} />
            </div>
          </div>}
          
          {activeTab === 'briefing' && <div style={{ backgroundColor: '#242424', borderRadius: '12px', padding: '24px', border: `2px solid ${jobColor}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}><div style={{ width: '40px', height: '40px', backgroundColor: jobColor, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clipboard size={24} color="#FFF" /></div><div><h3 style={{ color: '#FFF', fontSize: '18px', fontWeight: '600', margin: 0 }}>Job Briefing</h3><p style={{ color: jobColor, fontSize: '13px', margin: '2px 0 0 0' }}>Read before starting</p></div></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ padding: '16px', backgroundColor: '#1A1A1A', borderRadius: '10px' }}><div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>Job Type</div><EditableField label="" value={appointment?.purpose || ''} type="select" options={purposeOpts} onSave={v => updateAppointment('purpose', v)} /></div>
              <div style={{ padding: '16px', backgroundColor: '#1A1A1A', borderRadius: '10px' }}><div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>Start Time</div><EditableField label="" value={appointment?.startTime || ''} type="select" options={timeOpts} onSave={v => updateAppointment('startTime', v)} /></div>
              <div style={{ padding: '16px', backgroundColor: '#1A1A1A', borderRadius: '10px' }}><div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>Foreman</div><EditableField label="" value={appointment?.foreman || ''} type="select" options={foremanOpts} onSave={v => updateAppointment('foreman', v)} /></div>
            </div>
            {appointment?.teamMembers && appointment.teamMembers.length > 0 && <div style={{ padding: '16px', backgroundColor: '#1A1A1A', borderRadius: '10px', marginBottom: '20px' }}><div style={{ color: '#666', fontSize: '12px', marginBottom: '8px' }}>Team Members</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{appointment.teamMembers.map(m => <span key={m} style={{ padding: '6px 12px', backgroundColor: '#4F6A41', borderRadius: '6px', color: '#FFF', fontSize: '13px' }}>{m}</span>)}</div></div>}
            <div style={{ padding: '16px', backgroundColor: '#1A1A1A', borderRadius: '10px', marginBottom: '20px' }}><div style={{ color: '#666', fontSize: '12px', marginBottom: '8px' }}>Special Instructions</div><EditableField label="" value={appointment?.description || ''} type="textarea" onSave={v => updateAppointment('description', v)} /></div>
            <div style={{ padding: '12px 16px', backgroundColor: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}><AlertCircle size={20} color="#E74C3C" /><span style={{ color: '#FF9090', fontSize: '13px', fontWeight: '500' }}>Review all notes before starting.</span></div>
          </div>}
          
          {activeTab === 'photos' && <div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h3 style={{ color: '#FFF', fontSize: '16px', fontWeight: '600', margin: 0 }}>Photos ({photos.length})</h3><button style={{ padding: '10px 16px', backgroundColor: '#C9A049', border: 'none', borderRadius: '8px', color: '#FFF', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Camera size={16} /> Upload</button></div>{photos.length === 0 ? <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#242424', borderRadius: '12px', border: '1px solid #3D3D3D' }}><Camera size={48} color="#3D3D3D" style={{ marginBottom: '16px' }} /><h4 style={{ color: '#E0E0E0', fontSize: '16px', marginBottom: '8px' }}>No Photos</h4></div> : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>{photos.slice(0, 9).map(p => <div key={p.id} style={{ aspectRatio: '1', backgroundColor: '#242424', borderRadius: '10px', overflow: 'hidden', border: '1px solid #3D3D3D' }}><img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>)}</div>}</div>}
          
          {activeTab === 'messages' && <div>
            {/* Phone number display */}
            {contact?.phone && <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#242424', borderRadius: '12px', border: '1px solid #3D3D3D' }}>
              <div style={{ color: '#666', fontSize: '11px', marginBottom: '4px' }}>Sending SMS to:</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="#27AE60" />
                <span style={{ color: '#FFF', fontSize: '18px', fontWeight: '600' }}>{contact.phone}</span>
                <span style={{ color: '#A0A0A0', fontSize: '13px' }}>({contact.firstName} {contact.lastName})</span>
              </div>
            </div>}
            {!contact?.phone && <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#3D2424', borderRadius: '12px', border: '1px solid #E74C3C' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E74C3C' }}>
                <AlertCircle size={18} />
                <span>No phone number on file. Add a phone number in Overview tab to send SMS.</span>
              </div>
            </div>}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h3 style={{ color: '#FFF', fontSize: '16px', fontWeight: '600', margin: 0 }}>Messages</h3></div>
            {contact && <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>{contact.phone && <button onClick={() => window.open(`tel:${contact.phone}`)} style={{ flex: 1, padding: '12px', backgroundColor: '#242424', border: '1px solid #3D3D3D', borderRadius: '10px', color: '#FFF', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Phone size={16} color="#27AE60" /> Call</button>}{contact.email && <button onClick={() => window.open(`mailto:${contact.email}`)} style={{ flex: 1, padding: '12px', backgroundColor: '#242424', border: '1px solid #3D3D3D', borderRadius: '10px', color: '#FFF', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Mail size={16} color="#3498DB" /> Email</button>}</div>}
            
            {/* Message input */}
            {contact?.phone && <div style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
              <input value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendSMS()} placeholder="Type a message..." style={{ flex: 1, padding: '12px 16px', backgroundColor: '#1A1A1A', border: '1px solid #3D3D3D', borderRadius: '10px', color: '#FFF', fontSize: '14px', outline: 'none' }} />
              <button onClick={sendSMS} disabled={!newMessage.trim()} style={{ padding: '12px 20px', backgroundColor: newMessage.trim() ? '#27AE60' : '#2D2D2D', border: 'none', borderRadius: '10px', color: '#FFF', fontSize: '14px', fontWeight: '600', cursor: newMessage.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px' }}><Send size={16} /> Send</button>
            </div>}
            
            {messages.length === 0 ? <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#242424', borderRadius: '12px', border: '1px solid #3D3D3D' }}><MessageSquare size={48} color="#3D3D3D" style={{ marginBottom: '16px' }} /><h4 style={{ color: '#E0E0E0', fontSize: '16px', marginBottom: '8px' }}>No Messages</h4></div> : <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{messages.map((m, i) => <div key={i} style={{ padding: '12px 16px', backgroundColor: m.direction === 'outbound' ? '#1E3A5F' : '#242424', borderRadius: '12px', border: '1px solid #3D3D3D', marginLeft: m.direction === 'outbound' ? '40px' : '0', marginRight: m.direction === 'inbound' ? '40px' : '0' }}><p style={{ color: '#E0E0E0', fontSize: '14px', margin: '0 0 8px 0' }}>{m.body}</p><div style={{ color: '#666', fontSize: '11px' }}>{new Date(m.createdAt).toLocaleString()}</div></div>)}</div>}
          </div>}
          
          {activeTab === 'jobs' && <div><h3 style={{ color: '#FFF', fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Briefcase size={18} color="#4F6A41" /> Jobs</h3>{jobs.length === 0 ? <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: '#242424', borderRadius: '12px', border: '1px solid #3D3D3D' }}><Briefcase size={40} color="#3D3D3D" style={{ marginBottom: '12px' }} /><p style={{ color: '#666', fontSize: '14px', margin: 0 }}>No jobs</p></div> : <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{jobs.slice(0, 5).map(j => <div key={j.id} style={{ padding: '16px', backgroundColor: '#242424', borderRadius: '10px', border: '1px solid #3D3D3D', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}><div><div style={{ color: '#FFF', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{j.jobNumber || `Job #${j.id}`}</div><div style={{ color: '#A0A0A0', fontSize: '12px' }}>{j.jobType || 'General'}</div></div><div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ padding: '4px 10px', backgroundColor: j.status === 'Completed' ? '#27AE60' : '#C9A049', color: '#FFF', borderRadius: '6px', fontSize: '11px', fontWeight: '600' }}>{j.status || 'Scheduled'}</span><ChevronRight size={18} color="#666" /></div></div>)}</div>}</div>}
          
          {activeTab === 'files' && <div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h3 style={{ color: '#FFF', fontSize: '16px', fontWeight: '600', margin: 0 }}>Files</h3><button style={{ padding: '10px 16px', backgroundColor: '#3498DB', border: 'none', borderRadius: '8px', color: '#FFF', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={16} /> Upload</button></div><div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#242424', borderRadius: '12px', border: '1px solid #3D3D3D' }}><FileText size={48} color="#3D3D3D" style={{ marginBottom: '16px' }} /><h4 style={{ color: '#E0E0E0', fontSize: '16px', marginBottom: '8px' }}>No Files</h4></div></div>}
        </>}
      </div>
      <div style={{ padding: '16px 24px', borderTop: '1px solid #3D3D3D', backgroundColor: '#242424', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => { if (onNavigate) onNavigate(`ClientIntake/${contact?.id || ''}`); onClose(); }} style={{ padding: '12px 20px', backgroundColor: '#2D2D2D', border: '1px solid #3D3D3D', borderRadius: '10px', color: '#A0A0A0', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><User size={16} /> Full Profile</button>
        <button onClick={onClose} style={{ padding: '12px 24px', backgroundColor: '#C9A049', border: 'none', borderRadius: '10px', color: '#FFF', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 3px 0 0 #A88438' }}>Done</button>
      </div>
    </div>
    <style>{`@keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
  </>);
}
