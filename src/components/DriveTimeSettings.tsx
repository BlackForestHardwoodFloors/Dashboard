/**
 * Drive Time Settings Component - Boardroom 360
 * 
 * Reusable component for managing drive-time reminder settings.
 * Can be embedded in:
 * - Communication Hub → Automations
 * - Settings page
 * - Standalone modal
 */

import React, { useState, useEffect } from 'react';
import {
  Car,
  Clock,
  MapPin,
  Bell,
  Mail,
  Smartphone,
  Users,
  Settings,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Info,
  Navigation,
  Zap
} from 'lucide-react';
import {
  getGlobalSettings,
  saveGlobalSettings,
  getEmployeeSettings,
  saveEmployeeSettings,
  getAllEmployeeSettings,
  GlobalReminderSettings,
  EmployeeReminderSettings
} from './DriveTimeService';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
}

interface DriveTimeSettingsProps {
  employees: Employee[];
  darkMode?: boolean;
  compact?: boolean; // Compact mode for embedding in cards
  onSettingsChange?: (settings: GlobalReminderSettings) => void;
}

export default function DriveTimeSettings({
  employees,
  darkMode = true,
  compact = false,
  onSettingsChange
}: DriveTimeSettingsProps) {
  const [globalSettings, setGlobalSettings] = useState<GlobalReminderSettings>(getGlobalSettings());
  const [employeeSettings, setEmployeeSettings] = useState<Record<number, EmployeeReminderSettings>>({});
  const [expandedEmployee, setExpandedEmployee] = useState<number | null>(null);
  const [showEmployeeList, setShowEmployeeList] = useState(false);

  // Theme colors
  const bgColor = darkMode ? '#2D2D2D' : '#FFFFFF';
  const cardBg = darkMode ? '#3D3D3D' : '#F5F5F5';
  const textColor = darkMode ? '#FFFFFF' : '#1E1E1E';
  const textMuted = darkMode ? '#A0A0A0' : '#666666';
  const borderColor = darkMode ? '#4D4D4D' : '#E5E5E5';
  const accentColor = '#D4A024';
  const successColor = '#66BB6A';
  const warningColor = '#FF9800';

  // Load employee settings
  useEffect(() => {
    const settings: Record<number, EmployeeReminderSettings> = {};
    employees.forEach(emp => {
      settings[emp.id] = getEmployeeSettings(emp.id);
    });
    setEmployeeSettings(settings);
  }, [employees]);

  const updateGlobalSettings = (newSettings: Partial<GlobalReminderSettings>) => {
    const updated = { ...globalSettings, ...newSettings };
    setGlobalSettings(updated);
    saveGlobalSettings(updated);
    onSettingsChange?.(updated);
  };

  const updateEmployeeSettingsLocal = (empId: number, newSettings: Partial<EmployeeReminderSettings>) => {
    const currentSettings = employeeSettings[empId] || getEmployeeSettings(empId);
    const updated = { ...currentSettings, ...newSettings };
    setEmployeeSettings(prev => ({ ...prev, [empId]: updated }));
    saveEmployeeSettings(empId, updated);
  };

  const enabledEmployeeCount = Object.values(employeeSettings).filter(s => s.enabled).length;

  if (compact) {
    // Compact card view for embedding
    return (
      <div style={{
        backgroundColor: cardBg,
        borderRadius: '12px',
        border: `1px solid ${globalSettings.featureEnabled ? successColor : borderColor}`,
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: globalSettings.featureEnabled ? `${accentColor}20` : (darkMode ? '#3D3D3D' : '#E5E5E5'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Car style={{ width: '24px', height: '24px', color: globalSettings.featureEnabled ? accentColor : textMuted }} />
          </div>
          <div>
            <h4 style={{ fontSize: '15px', color: textColor, margin: '0 0 4px 0', fontWeight: '600' }}>
              Drive-Time Reminders
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: textMuted }}>
                GPS-based travel notifications
              </span>
              {globalSettings.featureEnabled && (
                <span style={{
                  fontSize: '11px',
                  color: successColor,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Users style={{ width: '12px', height: '12px' }} />
                  {enabledEmployeeCount} employee{enabledEmployeeCount !== 1 ? 's' : ''} enabled
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontSize: '11px',
            padding: '4px 10px',
            borderRadius: '12px',
            backgroundColor: globalSettings.featureEnabled ? '#66BB6A20' : (darkMode ? '#3D3D3D' : '#E5E5E5'),
            color: globalSettings.featureEnabled ? successColor : textMuted
          }}>
            {globalSettings.featureEnabled ? 'Active' : 'Disabled'}
          </span>
          <button
            onClick={() => updateGlobalSettings({ featureEnabled: !globalSettings.featureEnabled })}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
          >
            {globalSettings.featureEnabled ? (
              <ToggleRight style={{ width: '32px', height: '32px', color: successColor }} />
            ) : (
              <ToggleLeft style={{ width: '32px', height: '32px', color: textMuted }} />
            )}
          </button>
        </div>
      </div>
    );
  }

  // Full settings panel
  return (
    <div style={{
      backgroundColor: cardBg,
      borderRadius: '16px',
      border: `1px solid ${borderColor}`,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: `1px solid ${borderColor}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: globalSettings.featureEnabled ? `${successColor}08` : 'transparent'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: globalSettings.featureEnabled ? `${accentColor}20` : (darkMode ? '#4D4D4D' : '#E5E5E5'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Car style={{ width: '24px', height: '24px', color: globalSettings.featureEnabled ? accentColor : textMuted }} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', color: textColor, margin: '0 0 4px 0', fontWeight: '600' }}>
              Drive-Time Reminders
            </h3>
            <p style={{ fontSize: '13px', color: textMuted, margin: 0 }}>
              Automatically remind employees when to leave for appointments based on GPS location
            </p>
          </div>
        </div>
        <button
          onClick={() => updateGlobalSettings({ featureEnabled: !globalSettings.featureEnabled })}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}
        >
          {globalSettings.featureEnabled ? (
            <ToggleRight style={{ width: '40px', height: '40px', color: successColor }} />
          ) : (
            <ToggleLeft style={{ width: '40px', height: '40px', color: textMuted }} />
          )}
        </button>
      </div>

      {globalSettings.featureEnabled && (
        <div style={{ padding: '20px' }}>
          {/* How It Works */}
          <div style={{
            backgroundColor: darkMode ? '#252525' : '#FAFAFA',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Info style={{ width: '16px', height: '16px', color: accentColor }} />
              <span style={{ fontSize: '13px', color: textColor, fontWeight: '600' }}>How It Works</span>
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: textMuted }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin style={{ width: '14px', height: '14px', color: accentColor }} />
                <span>Gets employee GPS</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Navigation style={{ width: '14px', height: '14px', color: accentColor }} />
                <span>Calculates drive time</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Bell style={{ width: '14px', height: '14px', color: accentColor }} />
                <span>Sends reminder to leave</span>
              </div>
            </div>
          </div>

          {/* Default Settings */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '13px', color: textMuted, margin: '0 0 12px 0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Default Settings
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px' }}>
                  Buffer Time
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    value={globalSettings.defaultBufferMinutes}
                    onChange={(e) => updateGlobalSettings({ defaultBufferMinutes: parseInt(e.target.value) || 10 })}
                    min={0}
                    max={60}
                    style={{
                      width: '80px',
                      padding: '10px',
                      backgroundColor: darkMode ? '#252525' : '#FFF',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '8px',
                      color: textColor,
                      fontSize: '14px',
                      textAlign: 'center'
                    }}
                  />
                  <span style={{ fontSize: '13px', color: textMuted }}>minutes extra</span>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px' }}>
                  Reminder Before Leaving
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    value={globalSettings.defaultReminderBeforeLeave}
                    onChange={(e) => updateGlobalSettings({ defaultReminderBeforeLeave: parseInt(e.target.value) || 15 })}
                    min={0}
                    max={60}
                    style={{
                      width: '80px',
                      padding: '10px',
                      backgroundColor: darkMode ? '#252525' : '#FFF',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '8px',
                      color: textColor,
                      fontSize: '14px',
                      textAlign: 'center'
                    }}
                  />
                  <span style={{ fontSize: '13px', color: textMuted }}>minutes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quiet Hours */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '13px', color: textMuted, margin: '0 0 12px 0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Quiet Hours (No Notifications)
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="time"
                value={globalSettings.defaultQuietHoursStart}
                onChange={(e) => updateGlobalSettings({ defaultQuietHoursStart: e.target.value })}
                style={{
                  padding: '10px',
                  backgroundColor: darkMode ? '#252525' : '#FFF',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '8px',
                  color: textColor,
                  fontSize: '14px'
                }}
              />
              <span style={{ color: textMuted }}>to</span>
              <input
                type="time"
                value={globalSettings.defaultQuietHoursEnd}
                onChange={(e) => updateGlobalSettings({ defaultQuietHoursEnd: e.target.value })}
                style={{
                  padding: '10px',
                  backgroundColor: darkMode ? '#252525' : '#FFF',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '8px',
                  color: textColor,
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          {/* Employee Settings */}
          <div>
            <button
              onClick={() => setShowEmployeeList(!showEmployeeList)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 16px',
                backgroundColor: darkMode ? '#252525' : '#FFF',
                border: `1px solid ${borderColor}`,
                borderRadius: '10px',
                cursor: 'pointer',
                marginBottom: showEmployeeList ? '12px' : 0
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users style={{ width: '18px', height: '18px', color: accentColor }} />
                <span style={{ color: textColor, fontWeight: '500', fontSize: '14px' }}>Employee Settings</span>
                <span style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  backgroundColor: `${successColor}20`,
                  color: successColor
                }}>
                  {enabledEmployeeCount} of {employees.length} enabled
                </span>
              </div>
              {showEmployeeList ? (
                <ChevronDown style={{ width: '18px', height: '18px', color: textMuted }} />
              ) : (
                <ChevronRight style={{ width: '18px', height: '18px', color: textMuted }} />
              )}
            </button>

            {showEmployeeList && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {employees.map(emp => {
                  const settings = employeeSettings[emp.id] || getEmployeeSettings(emp.id);
                  const isExpanded = expandedEmployee === emp.id;

                  return (
                    <div
                      key={emp.id}
                      style={{
                        backgroundColor: darkMode ? '#252525' : '#FFF',
                        borderRadius: '10px',
                        border: `1px solid ${settings.enabled ? `${successColor}40` : borderColor}`,
                        overflow: 'hidden'
                      }}
                    >
                      {/* Employee Row */}
                      <div
                        style={{
                          padding: '12px 16px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer'
                        }}
                        onClick={() => setExpandedEmployee(isExpanded ? null : emp.id)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: settings.enabled ? accentColor : (darkMode ? '#3D3D3D' : '#E5E5E5'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: settings.enabled ? '#FFF' : textMuted,
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {emp.firstName[0]}{emp.lastName[0]}
                          </div>
                          <div>
                            <div style={{ color: textColor, fontSize: '14px', fontWeight: '500' }}>
                              {emp.firstName} {emp.lastName}
                            </div>
                            <div style={{ fontSize: '11px', color: settings.enabled ? successColor : textMuted }}>
                              {settings.enabled ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <CheckCircle style={{ width: '10px', height: '10px' }} />
                                  Reminders enabled
                                  {settings.enableSMS && <Smartphone style={{ width: '10px', height: '10px' }} />}
                                  {settings.enableEmail && <Mail style={{ width: '10px', height: '10px' }} />}
                                  {settings.enableInApp && <Bell style={{ width: '10px', height: '10px' }} />}
                                </span>
                              ) : (
                                'Reminders disabled'
                              )}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateEmployeeSettingsLocal(emp.id, { enabled: !settings.enabled });
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: 0
                            }}
                          >
                            {settings.enabled ? (
                              <ToggleRight style={{ width: '28px', height: '28px', color: successColor }} />
                            ) : (
                              <ToggleLeft style={{ width: '28px', height: '28px', color: textMuted }} />
                            )}
                          </button>
                          {isExpanded ? (
                            <ChevronDown style={{ width: '16px', height: '16px', color: textMuted }} />
                          ) : (
                            <ChevronRight style={{ width: '16px', height: '16px', color: textMuted }} />
                          )}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div style={{
                          padding: '16px',
                          borderTop: `1px solid ${borderColor}`,
                          backgroundColor: darkMode ? '#1E1E1E' : '#FAFAFA'
                        }}>
                          {/* Notification Channels */}
                          <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '11px', color: textMuted, marginBottom: '8px', fontWeight: '600' }}>
                              NOTIFICATION CHANNELS
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {[
                                { key: 'enableInApp', icon: Bell, label: 'In-App', desc: 'Browser notifications' },
                                { key: 'enableSMS', icon: Smartphone, label: 'SMS', desc: emp.phone || 'No phone' },
                                { key: 'enableEmail', icon: Mail, label: 'Email', desc: emp.email || 'No email' }
                              ].map(({ key, icon: Icon, label, desc }) => {
                                const isActive = settings[key as keyof EmployeeReminderSettings] as boolean;
                                const hasContact = key === 'enableInApp' || (key === 'enableSMS' && emp.phone) || (key === 'enableEmail' && emp.email);
                                
                                return (
                                  <button
                                    key={key}
                                    onClick={() => updateEmployeeSettingsLocal(emp.id, { [key]: !isActive })}
                                    disabled={!hasContact && key !== 'enableInApp'}
                                    style={{
                                      flex: 1,
                                      padding: '12px',
                                      backgroundColor: isActive ? `${accentColor}15` : 'transparent',
                                      border: `1px solid ${isActive ? accentColor : borderColor}`,
                                      borderRadius: '8px',
                                      cursor: hasContact || key === 'enableInApp' ? 'pointer' : 'not-allowed',
                                      opacity: hasContact || key === 'enableInApp' ? 1 : 0.5,
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      gap: '6px'
                                    }}
                                  >
                                    <Icon style={{
                                      width: '20px',
                                      height: '20px',
                                      color: isActive ? accentColor : textMuted
                                    }} />
                                    <span style={{
                                      fontSize: '12px',
                                      fontWeight: '500',
                                      color: isActive ? accentColor : textColor
                                    }}>
                                      {label}
                                    </span>
                                    <span style={{
                                      fontSize: '10px',
                                      color: textMuted,
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      maxWidth: '100%'
                                    }}>
                                      {desc}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Custom Timing (Optional) */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                              <label style={{ fontSize: '11px', color: textMuted, display: 'block', marginBottom: '4px' }}>
                                Buffer (min)
                              </label>
                              <input
                                type="number"
                                value={settings.bufferMinutes}
                                onChange={(e) => updateEmployeeSettingsLocal(emp.id, { bufferMinutes: parseInt(e.target.value) || 10 })}
                                min={0}
                                max={60}
                                style={{
                                  width: '100%',
                                  padding: '8px',
                                  backgroundColor: darkMode ? '#252525' : '#FFF',
                                  border: `1px solid ${borderColor}`,
                                  borderRadius: '6px',
                                  color: textColor,
                                  fontSize: '13px'
                                }}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '11px', color: textMuted, display: 'block', marginBottom: '4px' }}>
                                Remind Before (min)
                              </label>
                              <input
                                type="number"
                                value={settings.reminderBeforeLeave}
                                onChange={(e) => updateEmployeeSettingsLocal(emp.id, { reminderBeforeLeave: parseInt(e.target.value) || 15 })}
                                min={0}
                                max={60}
                                style={{
                                  width: '100%',
                                  padding: '8px',
                                  backgroundColor: darkMode ? '#252525' : '#FFF',
                                  border: `1px solid ${borderColor}`,
                                  borderRadius: '6px',
                                  color: textColor,
                                  fontSize: '13px'
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
