/**
 * Settings Page - Boardroom 360
 */

import { useState } from 'react';
import { Settings, Users, Building, Shield, Receipt, ChevronRight, User, Mail, Phone, Edit, Save, Plus } from 'lucide-react';
import { SidebarEnhanced } from './SidebarEnhanced';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
}

export default function SettingsPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('employees');

  const bgColor = darkMode ? '#1E1E1E' : '#F5F5F5';
  const cardBg = darkMode ? '#2D2D2D' : '#FFFFFF';
  const textColor = darkMode ? '#FFFFFF' : '#1E1E1E';
  const textMuted = darkMode ? '#A0A0A0' : '#666666';
  const borderColor = darkMode ? '#3D3D3D' : '#E5E5E5';
  const accentColor = '#D4A024';

  const tabs = [
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'departments', label: 'Departments', icon: Building },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
    { id: 'taxes', label: 'Taxes', icon: Receipt },
  ];

  const employees: Employee[] = [
    { id: '1', name: 'Mike Thompson', email: 'mike@blackforestfloors.com', role: 'Lead Installer', department: 'Installation', status: 'active' },
    { id: '2', name: 'Sarah Wilson', email: 'sarah@blackforestfloors.com', role: 'Project Manager', department: 'Management', status: 'active' },
    { id: '3', name: 'John Davis', email: 'john@blackforestfloors.com', role: 'Installer', department: 'Installation', status: 'active' },
    { id: '4', name: 'Tom Brown', email: 'tom@blackforestfloors.com', role: 'Installer', department: 'Installation', status: 'inactive' },
    { id: '5', name: 'Lisa Chen', email: 'lisa@blackforestfloors.com', role: 'Sales Rep', department: 'Sales', status: 'active' },
  ];

  const departments = [
    { id: '1', name: 'Installation', employees: 8, manager: 'Mike Thompson' },
    { id: '2', name: 'Sales', employees: 4, manager: 'Lisa Chen' },
    { id: '3', name: 'Management', employees: 3, manager: 'Sarah Wilson' },
    { id: '4', name: 'Administration', employees: 2, manager: 'Steve Osborn' },
  ];

  const roles = [
    { id: '1', name: 'Admin', permissions: 'Full Access', users: 2 },
    { id: '2', name: 'Team Manager', permissions: 'Manage Team, View Reports', users: 3 },
    { id: '3', name: 'Team Member', permissions: 'View Assigned Jobs, Log Time', users: 12 },
    { id: '4', name: 'Client', permissions: 'View Projects, Approve Quotes', users: 45 },
  ];

  const taxes = [
    { id: '1', name: 'State Sales Tax', rate: 6.5, applies: 'Materials' },
    { id: '2', name: 'City Tax', rate: 2.0, applies: 'All Services' },
    { id: '3', name: 'Labor Tax Exempt', rate: 0, applies: 'Labor' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: bgColor }}>
      <SidebarEnhanced activePage="Settings" darkMode={darkMode} onNavigate={onNavigate} onToggleDarkMode={() => setDarkMode(!darkMode)} />
      <div style={{ marginLeft: '200px', flex: 1, padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', color: textColor, margin: '0 0 8px 0' }}>Settings</h1>
          <p style={{ fontSize: '14px', color: textMuted, margin: 0 }}>Manage your company settings and configurations</p>
        </div>

        <div style={{ display: 'flex', gap: '24px' }}>
          {/* Sidebar Tabs */}
          <div style={{ width: '240px', backgroundColor: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}`, padding: '12px', height: 'fit-content' }}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', marginBottom: '4px', backgroundColor: activeTab === tab.id ? `${accentColor}20` : 'transparent',
                  border: 'none', borderRadius: '10px', cursor: 'pointer', borderLeft: activeTab === tab.id ? `3px solid ${accentColor}` : '3px solid transparent'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon style={{ width: '18px', height: '18px', color: activeTab === tab.id ? accentColor : textMuted }} />
                    <span style={{ fontSize: '14px', fontWeight: activeTab === tab.id ? '600' : '500', color: activeTab === tab.id ? textColor : textMuted }}>{tab.label}</span>
                  </div>
                  <ChevronRight style={{ width: '16px', height: '16px', color: textMuted }} />
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div style={{ flex: 1, backgroundColor: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}`, padding: '24px' }}>
            {activeTab === 'employees' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '20px', color: textColor, margin: 0 }}>Employees</h2>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: accentColor, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', color: '#FFFFFF' }}>
                    <Plus style={{ width: '16px', height: '16px' }} /> Add Employee
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {employees.map(emp => (
                    <div key={emp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: darkMode ? '#353535' : '#FAFAFA', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: '600', fontSize: '14px' }}>
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: textColor, margin: 0 }}>{emp.name}</p>
                          <p style={{ fontSize: '12px', color: textMuted, margin: '2px 0 0 0' }}>{emp.email}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '13px', color: textMuted }}>{emp.role}</span>
                        <span style={{ fontSize: '13px', color: textMuted }}>{emp.department}</span>
                        <div style={{ padding: '4px 10px', backgroundColor: emp.status === 'active' ? '#66BB6A20' : '#9E9E9E20', borderRadius: '12px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '500', color: emp.status === 'active' ? '#66BB6A' : '#9E9E9E', textTransform: 'capitalize' }}>{emp.status}</span>
                        </div>
                        <button style={{ padding: '6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                          <Edit style={{ width: '16px', height: '16px', color: textMuted }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'departments' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '20px', color: textColor, margin: 0 }}>Departments</h2>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: accentColor, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', color: '#FFFFFF' }}>
                    <Plus style={{ width: '16px', height: '16px' }} /> Add Department
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {departments.map(dept => (
                    <div key={dept.id} style={{ padding: '20px', backgroundColor: darkMode ? '#353535' : '#FAFAFA', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: textColor, margin: 0 }}>{dept.name}</h3>
                        <button style={{ padding: '6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                          <Edit style={{ width: '16px', height: '16px', color: textMuted }} />
                        </button>
                      </div>
                      <p style={{ fontSize: '13px', color: textMuted, margin: '0 0 8px 0' }}>Manager: {dept.manager}</p>
                      <p style={{ fontSize: '13px', color: accentColor, margin: 0 }}>{dept.employees} employees</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'roles' && (
              <>
                <h2 style={{ fontSize: '20px', color: textColor, margin: '0 0 20px 0' }}>Roles & Permissions</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {roles.map(role => (
                    <div key={role.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: darkMode ? '#353535' : '#FAFAFA', borderRadius: '12px' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: textColor, margin: 0 }}>{role.name}</p>
                        <p style={{ fontSize: '12px', color: textMuted, margin: '4px 0 0 0' }}>{role.permissions}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '13px', color: accentColor }}>{role.users} users</span>
                        <button style={{ padding: '6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                          <Edit style={{ width: '16px', height: '16px', color: textMuted }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'taxes' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '20px', color: textColor, margin: 0 }}>Tax Rates</h2>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: accentColor, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', color: '#FFFFFF' }}>
                    <Plus style={{ width: '16px', height: '16px' }} /> Add Tax
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {taxes.map(tax => (
                    <div key={tax.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: darkMode ? '#353535' : '#FAFAFA', borderRadius: '12px' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: textColor, margin: 0 }}>{tax.name}</p>
                        <p style={{ fontSize: '12px', color: textMuted, margin: '4px 0 0 0' }}>Applies to: {tax.applies}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '18px', fontWeight: '700', color: accentColor }}>{tax.rate}%</span>
                        <button style={{ padding: '6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                          <Edit style={{ width: '16px', height: '16px', color: textMuted }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
