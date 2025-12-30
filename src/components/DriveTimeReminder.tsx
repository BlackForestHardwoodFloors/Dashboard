/**
 * Drive Time Reminder Component - Boardroom 360
 * 
 * Manages drive-time reminders for appointments:
 * - Fetches the ASSIGNED EMPLOYEE's GPS location (not the viewer's)
 * - Only notifies the assigned employee
 * - Admin can enable/disable the feature globally
 * - Each employee can configure their own preferences
 * - Shows in-app notifications
 * - Triggers SMS/Email reminders via Communication Hub
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Car,
  Clock,
  MapPin,
  Navigation,
  Bell,
  BellOff,
  X,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Settings,
  User,
  Calendar,
  ToggleLeft,
  ToggleRight,
  Users,
  Mail,
  MessageSquare,
  Smartphone
} from 'lucide-react';
import {
  calculateDriveTime,
  calculateLeaveTime,
  calculateReminderTime,
  formatReminderMessage,
  isQuietHours,
  getGlobalSettings,
  saveGlobalSettings,
  getEmployeeSettings,
  saveEmployeeSettings,
  isFeatureEnabled,
  isEnabledForEmployee,
  markReminderSent,
  wasReminderSentToday,
  cleanupOldReminders,
  DriveTimeResult,
  AppointmentReminder,
  GlobalReminderSettings,
  EmployeeReminderSettings
} from './DriveTimeService';
import {
  getEmployeeLocation,
  getEmployeeLocations,
  isLocationFresh,
  formatLocationAge,
  EmployeeLocation
} from './EmployeeLocationService';

interface Appointment {
  id: number;
  contactName?: string;
  firstName?: string;
  lastName?: string;
  contact?: string;
  location?: string;
  address?: string;
  purpose: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  employeeName?: number;
  employee?: { firstName: string; lastName: string; };
  Employee?: { id: number; firstName: string; lastName: string; phone?: string; email?: string };
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
}

interface DriveTimeReminderProps {
  appointments: Appointment[];
  employees: Employee[];
  currentUserId?: number; // The currently logged-in user's employee ID
  isAdmin?: boolean; // Whether the current user is an admin
  onSendSMS?: (phone: string, message: string) => Promise<void>;
  onSendEmail?: (email: string, subject: string, body: string) => Promise<void>;
  darkMode?: boolean;
}

interface ReminderNotification {
  id: string;
  appointment: Appointment;
  employeeId: number;
  driveTime: DriveTimeResult;
  leaveTime: Date;
  type: 'upcoming' | 'leave-now' | 'late';
  dismissed: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://35.92.33.215:3001';

export default function DriveTimeReminder({
  appointments,
  employees,
  currentUserId,
  isAdmin = false,
  onSendSMS,
  onSendEmail,
  darkMode = true
}: DriveTimeReminderProps) {
  const [notifications, setNotifications] = useState<ReminderNotification[]>([]);
  const [employeeLocations, setEmployeeLocations] = useState<Record<number, EmployeeLocation>>({});
  const [locationErrors, setLocationErrors] = useState<Record<number, string>>({});
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [globalSettings, setGlobalSettings] = useState<GlobalReminderSettings>(getGlobalSettings());
  const [showSettings, setShowSettings] = useState(false);
  const [showEmployeeSettings, setShowEmployeeSettings] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [employeeSettings, setEmployeeSettings] = useState<Record<number, EmployeeReminderSettings>>({});
  const [calculatingDriveTime, setCalculatingDriveTime] = useState<number | null>(null);

  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Theme colors
  const bgColor = darkMode ? '#2D2D2D' : '#FFFFFF';
  const cardBg = darkMode ? '#3D3D3D' : '#F5F5F5';
  const textColor = darkMode ? '#FFFFFF' : '#1E1E1E';
  const textMuted = darkMode ? '#A0A0A0' : '#666666';
  const borderColor = darkMode ? '#4D4D4D' : '#E5E5E5';
  const accentColor = '#D4A024';
  const warningColor = '#FF9800';
  const dangerColor = '#EF5350';
  const successColor = '#66BB6A';

  // Load employee settings on mount
  useEffect(() => {
    const settings: Record<number, EmployeeReminderSettings> = {};
    employees.forEach(emp => {
      settings[emp.id] = getEmployeeSettings(emp.id);
    });
    setEmployeeSettings(settings);
  }, [employees]);

  // Fetch employee locations on mount and periodically
  useEffect(() => {
    if (!globalSettings.featureEnabled) return;
    
    fetchEmployeeLocations();
    cleanupOldReminders();

    // Refresh locations every 2 minutes
    const locationInterval = setInterval(fetchEmployeeLocations, 2 * 60 * 1000);
    return () => clearInterval(locationInterval);
  }, [globalSettings.featureEnabled, employees]);

  // Check appointments periodically
  useEffect(() => {
    if (!globalSettings.featureEnabled) return;
    
    checkUpcomingAppointments();
    checkIntervalRef.current = setInterval(checkUpcomingAppointments, 60 * 1000);
    
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [appointments, employeeLocations, globalSettings, employeeSettings, currentUserId]);

  /**
   * Fetch locations for all employees who have upcoming appointments
   */
  const fetchEmployeeLocations = async () => {
    setIsLoadingLocations(true);
    
    try {
      // Get unique employee IDs from upcoming appointments
      const employeeIds = [...new Set(
        appointments
          .filter(apt => apt.employeeName || apt.Employee?.id)
          .map(apt => apt.employeeName || apt.Employee?.id)
          .filter((id): id is number => id !== undefined)
      )];

      if (employeeIds.length === 0) {
        setIsLoadingLocations(false);
        return;
      }

      // Fetch all locations in one API call
      const locations = await getEmployeeLocations(employeeIds);
      setEmployeeLocations(locations);

      // Track which employees don't have locations
      const errors: Record<number, string> = {};
      employeeIds.forEach(id => {
        if (!locations[id]) {
          errors[id] = 'No location shared';
        } else if (!isLocationFresh(locations[id], 60)) { // 60 minutes
          errors[id] = `Location outdated (${formatLocationAge(locations[id])})`;
        }
      });
      setLocationErrors(errors);

    } catch (error) {
      console.error('Error fetching employee locations:', error);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const checkUpcomingAppointments = useCallback(async () => {
    if (!appointments.length) return;

    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    // Filter appointments:
    // 1. In the next 2 hours
    // 2. Have a location
    // 3. Are assigned to an employee
    const upcomingAppointments = appointments.filter(apt => {
      const aptDateTime = new Date(`${apt.startDate}T${apt.startTime}`);
      const assignedEmployeeId = apt.employeeName || apt.Employee?.id;
      
      // Must be upcoming and have location
      if (aptDateTime <= now || aptDateTime > twoHoursFromNow || !apt.location) {
        return false;
      }

      // Must have an assigned employee
      if (!assignedEmployeeId) {
        return false;
      }

      // For non-admin users, only show their own appointments
      if (!isAdmin && assignedEmployeeId !== currentUserId) {
        return false;
      }

      return true;
    });

    for (const apt of upcomingAppointments) {
      const assignedEmployeeId = apt.employeeName || apt.Employee?.id;
      if (!assignedEmployeeId) continue;

      // Check if reminders are enabled for this employee
      if (!isEnabledForEmployee(assignedEmployeeId)) continue;

      // Skip if already notified today
      if (wasReminderSentToday(apt.id, assignedEmployeeId)) continue;

      // Get the ASSIGNED EMPLOYEE's location (not the viewer's)
      const employeeLocation = employeeLocations[assignedEmployeeId];
      if (!employeeLocation) {
        console.log(`No location for employee ${assignedEmployeeId}, skipping drive time calculation`);
        continue;
      }

      // Check if location is fresh enough (within 60 minutes)
      if (!isLocationFresh(employeeLocation, 60)) {
        console.log(`Location for employee ${assignedEmployeeId} is outdated, skipping`);
        continue;
      }

      const empSettings = employeeSettings[assignedEmployeeId] || getEmployeeSettings(assignedEmployeeId);

      try {
        setCalculatingDriveTime(apt.id);

        // Calculate drive time FROM THE EMPLOYEE'S LOCATION
        const driveTime = await calculateDriveTime(
          {
            lat: employeeLocation.latitude,
            lng: employeeLocation.longitude
          },
          apt.location
        );

        const aptDateTime = new Date(`${apt.startDate}T${apt.startTime}`);
        const leaveTime = calculateLeaveTime(
          aptDateTime,
          driveTime.trafficDurationSeconds || driveTime.durationSeconds,
          empSettings.bufferMinutes
        );

        const reminderTime = calculateReminderTime(leaveTime, empSettings.reminderBeforeLeave);

        // Determine notification type
        let notificationType: 'upcoming' | 'leave-now' | 'late' = 'upcoming';
        if (now >= leaveTime) {
          notificationType = 'late';
        } else if (now >= reminderTime) {
          notificationType = 'leave-now';
        }

        // Only show if it's time to remind
        if (now >= reminderTime) {
          const existingNotification = notifications.find(
            n => n.appointment.id === apt.id && n.employeeId === assignedEmployeeId
          );
          
          if (!existingNotification) {
            // Show in-app notification if enabled
            if (empSettings.enableInApp) {
              const newNotification: ReminderNotification = {
                id: `${apt.id}-${assignedEmployeeId}-${Date.now()}`,
                appointment: apt,
                employeeId: assignedEmployeeId,
                driveTime,
                leaveTime,
                type: notificationType,
                dismissed: false
              };
              setNotifications(prev => [...prev, newNotification]);

              // Play sound for urgent notifications
              if (notificationType !== 'upcoming' && audioRef.current) {
                audioRef.current.play().catch(() => {});
              }
            }

            // Send SMS/Email if enabled and not in quiet hours
            if (!isQuietHours(empSettings.quietHoursStart, empSettings.quietHoursEnd)) {
              await sendReminders(apt, driveTime, leaveTime, assignedEmployeeId, empSettings);
            }

            markReminderSent(apt.id, assignedEmployeeId);
          }
        }
      } catch (error) {
        console.error(`Error calculating drive time for appointment ${apt.id}:`, error);
      } finally {
        setCalculatingDriveTime(null);
      }
    }
  }, [employeeLocations, appointments, employeeSettings, notifications, currentUserId, isAdmin]);

  const sendReminders = async (
    apt: Appointment,
    driveTime: DriveTimeResult,
    leaveTime: Date,
    employeeId: number,
    settings: EmployeeReminderSettings
  ) => {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return;

    const reminder: AppointmentReminder = {
      appointmentId: apt.id,
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      employeePhone: employee.phone || apt.Employee?.phone,
      employeeEmail: employee.email || apt.Employee?.email,
      appointmentTime: new Date(`${apt.startDate}T${apt.startTime}`),
      location: apt.location || '',
      contactName: apt.contactName || apt.contact || `${apt.firstName} ${apt.lastName}`,
      purpose: apt.purpose,
      driveTime,
      leaveByTime: leaveTime,
      reminderSent: false
    };

    const messages = formatReminderMessage(reminder);

    // Send SMS
    if (settings.enableSMS && reminder.employeePhone) {
      try {
        if (onSendSMS) {
          await onSendSMS(reminder.employeePhone, messages.sms);
        } else {
          await sendSMSViaAPI(reminder.employeePhone, messages.sms);
        }
      } catch (error) {
        console.error('Failed to send SMS reminder:', error);
      }
    }

    // Send Email
    if (settings.enableEmail && reminder.employeeEmail) {
      try {
        if (onSendEmail) {
          await onSendEmail(reminder.employeeEmail, messages.email.subject, messages.email.body);
        } else {
          await sendEmailViaAPI(reminder.employeeEmail, messages.email.subject, messages.email.body);
        }
      } catch (error) {
        console.error('Failed to send email reminder:', error);
      }
    }
  };

  const sendSMSViaAPI = async (phone: string, message: string) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/communications/send-sms`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone, message, type: 'drive-time-reminder' })
    });
  };

  const sendEmailViaAPI = async (email: string, subject: string, body: string) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/communications/send-email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, subject, body, type: 'drive-time-reminder' })
    });
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const dismissAll = () => {
    setNotifications([]);
  };

  const updateGlobalSettings = (newSettings: Partial<GlobalReminderSettings>) => {
    const updated = { ...globalSettings, ...newSettings };
    setGlobalSettings(updated);
    saveGlobalSettings(updated);
  };

  const updateEmployeeSettingsLocal = (empId: number, newSettings: Partial<EmployeeReminderSettings>) => {
    const currentSettings = employeeSettings[empId] || getEmployeeSettings(empId);
    const updated = { ...currentSettings, ...newSettings };
    setEmployeeSettings(prev => ({ ...prev, [empId]: updated }));
    saveEmployeeSettings(empId, updated);
  };

  const getNotificationColor = (type: ReminderNotification['type']) => {
    switch (type) {
      case 'late': return dangerColor;
      case 'leave-now': return warningColor;
      default: return accentColor;
    }
  };

  const getNotificationIcon = (type: ReminderNotification['type']) => {
    switch (type) {
      case 'late': return AlertTriangle;
      case 'leave-now': return Car;
      default: return Clock;
    }
  };

  const activeNotifications = notifications.filter(n => !n.dismissed);

  // Don't render if feature is disabled and not admin
  if (!globalSettings.featureEnabled && !isAdmin) {
    return null;
  }

  return (
    <>
      {/* Notification Sound */}
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/notification.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Panel */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '420px',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        
        {/* Admin Settings Panel */}
        {showSettings && isAdmin && (
          <div style={{
            backgroundColor: bgColor,
            borderRadius: '16px',
            border: `1px solid ${borderColor}`,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              padding: '16px',
              borderBottom: `1px solid ${borderColor}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings style={{ width: '20px', height: '20px', color: accentColor }} />
                <span style={{ color: textColor, fontWeight: '600' }}>Drive-Time Reminders</span>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X style={{ width: '20px', height: '20px', color: textMuted }} />
              </button>
            </div>

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Master Toggle */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: globalSettings.featureEnabled ? `${successColor}15` : cardBg,
                borderRadius: '10px',
                border: `1px solid ${globalSettings.featureEnabled ? successColor : borderColor}`
              }}>
                <div>
                  <div style={{ color: textColor, fontWeight: '600', fontSize: '14px' }}>
                    Feature Enabled
                  </div>
                  <div style={{ color: textMuted, fontSize: '12px' }}>
                    {globalSettings.featureEnabled ? 'Reminders are active' : 'Reminders are disabled'}
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
                    <ToggleRight style={{ width: '36px', height: '36px', color: successColor }} />
                  ) : (
                    <ToggleLeft style={{ width: '36px', height: '36px', color: textMuted }} />
                  )}
                </button>
              </div>

              {/* Default Settings */}
              <div>
                <div style={{ fontSize: '12px', color: textMuted, marginBottom: '8px', fontWeight: '600' }}>
                  DEFAULT SETTINGS
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: textMuted, display: 'block', marginBottom: '4px' }}>
                      Buffer Time (min)
                    </label>
                    <input
                      type="number"
                      value={globalSettings.defaultBufferMinutes}
                      onChange={(e) => updateGlobalSettings({ defaultBufferMinutes: parseInt(e.target.value) || 10 })}
                      min={0}
                      max={60}
                      style={{
                        width: '100%',
                        padding: '8px',
                        backgroundColor: cardBg,
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
                      value={globalSettings.defaultReminderBeforeLeave}
                      onChange={(e) => updateGlobalSettings({ defaultReminderBeforeLeave: parseInt(e.target.value) || 15 })}
                      min={0}
                      max={60}
                      style={{
                        width: '100%',
                        padding: '8px',
                        backgroundColor: cardBg,
                        border: `1px solid ${borderColor}`,
                        borderRadius: '6px',
                        color: textColor,
                        fontSize: '13px'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Employee Settings */}
              <div>
                <button
                  onClick={() => setShowEmployeeSettings(!showEmployeeSettings)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: cardBg,
                    border: `1px solid ${borderColor}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: textColor
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users style={{ width: '18px', height: '18px', color: accentColor }} />
                    <span style={{ fontWeight: '500' }}>Employee Settings</span>
                  </div>
                  {showEmployeeSettings ? (
                    <ChevronDown style={{ width: '18px', height: '18px', color: textMuted }} />
                  ) : (
                    <ChevronRight style={{ width: '18px', height: '18px', color: textMuted }} />
                  )}
                </button>

                {showEmployeeSettings && (
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {employees.map(emp => {
                      const settings = employeeSettings[emp.id] || getEmployeeSettings(emp.id);
                      const isExpanded = selectedEmployeeId === emp.id;

                      return (
                        <div
                          key={emp.id}
                          style={{
                            backgroundColor: cardBg,
                            borderRadius: '8px',
                            border: `1px solid ${borderColor}`,
                            overflow: 'hidden'
                          }}
                        >
                          {/* Employee Header */}
                          <div
                            onClick={() => setSelectedEmployeeId(isExpanded ? null : emp.id)}
                            style={{
                              padding: '10px 12px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: accentColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#FFF',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}>
                                {emp.firstName[0]}{emp.lastName[0]}
                              </div>
                              <div>
                                <div style={{ color: textColor, fontSize: '13px', fontWeight: '500' }}>
                                  {emp.firstName} {emp.lastName}
                                </div>
                                <div style={{ color: settings.enabled ? successColor : textMuted, fontSize: '11px' }}>
                                  {settings.enabled ? '● Enabled' : '○ Disabled'}
                                </div>
                              </div>
                            </div>
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
                          </div>

                          {/* Employee Details */}
                          {isExpanded && (
                            <div style={{
                              padding: '12px',
                              borderTop: `1px solid ${borderColor}`,
                              backgroundColor: darkMode ? '#252525' : '#FAFAFA'
                            }}>
                              {/* Notification Channels */}
                              <div style={{ marginBottom: '12px' }}>
                                <div style={{ fontSize: '11px', color: textMuted, marginBottom: '8px' }}>
                                  Notification Channels
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  {[
                                    { key: 'enableInApp', icon: Bell, label: 'In-App' },
                                    { key: 'enableSMS', icon: Smartphone, label: 'SMS' },
                                    { key: 'enableEmail', icon: Mail, label: 'Email' }
                                  ].map(({ key, icon: Icon, label }) => (
                                    <button
                                      key={key}
                                      onClick={() => updateEmployeeSettingsLocal(emp.id, { [key]: !settings[key as keyof EmployeeReminderSettings] })}
                                      style={{
                                        flex: 1,
                                        padding: '8px',
                                        backgroundColor: settings[key as keyof EmployeeReminderSettings] ? `${accentColor}20` : 'transparent',
                                        border: `1px solid ${settings[key as keyof EmployeeReminderSettings] ? accentColor : borderColor}`,
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '4px'
                                      }}
                                    >
                                      <Icon style={{
                                        width: '16px',
                                        height: '16px',
                                        color: settings[key as keyof EmployeeReminderSettings] ? accentColor : textMuted
                                      }} />
                                      <span style={{
                                        fontSize: '10px',
                                        color: settings[key as keyof EmployeeReminderSettings] ? accentColor : textMuted
                                      }}>
                                        {label}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Contact Info */}
                              {(emp.phone || emp.email) && (
                                <div style={{ fontSize: '11px', color: textMuted }}>
                                  {emp.phone && <div>📱 {emp.phone}</div>}
                                  {emp.email && <div>✉️ {emp.email}</div>}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Location Status */}
              <div style={{
                padding: '12px',
                backgroundColor: cardBg,
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '11px', color: textMuted, marginBottom: '8px', fontWeight: '600' }}>
                  EMPLOYEE LOCATIONS
                </div>
                {isLoadingLocations ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Loader2 style={{ width: '16px', height: '16px', color: accentColor, animation: 'spin 1s linear infinite' }} />
                    <span style={{ color: textMuted, fontSize: '12px' }}>Loading locations...</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {employees.slice(0, 5).map(emp => {
                      const location = employeeLocations[emp.id];
                      const error = locationErrors[emp.id];
                      const hasLocation = location && isLocationFresh(location, 60);
                      
                      return (
                        <div key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {hasLocation ? (
                            <CheckCircle style={{ width: '14px', height: '14px', color: successColor }} />
                          ) : (
                            <AlertTriangle style={{ width: '14px', height: '14px', color: error ? warningColor : textMuted }} />
                          )}
                          <span style={{ fontSize: '12px', color: textColor, flex: 1 }}>
                            {emp.firstName} {emp.lastName}
                          </span>
                          <span style={{ fontSize: '10px', color: hasLocation ? successColor : textMuted }}>
                            {hasLocation 
                              ? formatLocationAge(location)
                              : (error || 'No location')}
                          </span>
                        </div>
                      );
                    })}
                    {employees.length > 5 && (
                      <span style={{ fontSize: '11px', color: textMuted }}>
                        +{employees.length - 5} more employees
                      </span>
                    )}
                  </div>
                )}
                <button
                  onClick={fetchEmployeeLocations}
                  disabled={isLoadingLocations}
                  style={{
                    marginTop: '10px',
                    padding: '8px 12px',
                    backgroundColor: accentColor,
                    border: 'none',
                    borderRadius: '6px',
                    color: '#FFF',
                    fontSize: '11px',
                    cursor: isLoadingLocations ? 'not-allowed' : 'pointer',
                    opacity: isLoadingLocations ? 0.7 : 1,
                    width: '100%'
                  }}
                >
                  Refresh Locations
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeNotifications.map(notification => {
          const Icon = getNotificationIcon(notification.type);
          const color = getNotificationColor(notification.type);
          const apt = notification.appointment;
          const contactName = apt.contactName || apt.contact || `${apt.firstName} ${apt.lastName}`;
          const employee = employees.find(e => e.id === notification.employeeId);

          return (
            <div
              key={notification.id}
              style={{
                backgroundColor: bgColor,
                borderRadius: '16px',
                border: `2px solid ${color}`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                overflow: 'hidden',
                animation: 'slideIn 0.3s ease-out'
              }}
            >
              <style>{`
                @keyframes slideIn {
                  from { transform: translateX(100%); opacity: 0; }
                  to { transform: translateX(0); opacity: 1; }
                }
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}</style>

              {/* Header */}
              <div style={{
                padding: '12px 16px',
                backgroundColor: `${color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon style={{ width: '20px', height: '20px', color }} />
                  <span style={{ color, fontWeight: '600', fontSize: '14px' }}>
                    {notification.type === 'late' && '⚠️ Running Late!'}
                    {notification.type === 'leave-now' && '🚗 Time to Leave!'}
                    {notification.type === 'upcoming' && '📅 Upcoming Appointment'}
                  </span>
                </div>
                <button
                  onClick={() => dismissNotification(notification.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                >
                  <X style={{ width: '18px', height: '18px', color: textMuted }} />
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: '16px' }}>
                {/* Employee Badge (for admin view) */}
                {isAdmin && employee && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    backgroundColor: `${accentColor}20`,
                    borderRadius: '12px',
                    marginBottom: '10px'
                  }}>
                    <User style={{ width: '12px', height: '12px', color: accentColor }} />
                    <span style={{ fontSize: '11px', color: accentColor, fontWeight: '500' }}>
                      {employee.firstName} {employee.lastName}
                    </span>
                  </div>
                )}

                {/* Contact & Time */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ color: textColor, fontWeight: '600' }}>{contactName}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar style={{ width: '14px', height: '14px', color: textMuted }} />
                    <span style={{ color: textMuted, fontSize: '13px' }}>
                      {new Date(`${apt.startDate}T${apt.startTime}`).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                      {' • '}{apt.purpose}
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <MapPin style={{ width: '14px', height: '14px', color: textMuted, flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ color: textMuted, fontSize: '12px', lineHeight: '1.4' }}>
                    {apt.location}
                  </span>
                </div>

                {/* Drive Time Info */}
                <div style={{
                  backgroundColor: cardBg,
                  borderRadius: '10px',
                  padding: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ color: textMuted, fontSize: '10px', marginBottom: '2px' }}>Drive Time</div>
                    <div style={{ color: textColor, fontWeight: '700', fontSize: '16px' }}>
                      {notification.driveTime.trafficDurationText || notification.driveTime.durationText}
                    </div>
                    <div style={{ color: textMuted, fontSize: '10px' }}>
                      {notification.driveTime.distanceText}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: textMuted, fontSize: '10px', marginBottom: '2px' }}>Leave By</div>
                    <div style={{ color, fontWeight: '700', fontSize: '16px' }}>
                      {notification.leaveTime.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    onClick={() => {
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(apt.location || '')}`;
                      window.open(url, '_blank');
                    }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: accentColor,
                      border: 'none',
                      borderRadius: '8px',
                      color: '#FFF',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Navigation style={{ width: '16px', height: '16px' }} />
                    Navigate
                  </button>
                  <button
                    onClick={() => dismissNotification(notification.id)}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: cardBg,
                      border: `1px solid ${borderColor}`,
                      borderRadius: '8px',
                      color: textMuted,
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Control Buttons */}
        {(activeNotifications.length > 0 || isAdmin) && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            {activeNotifications.length > 1 && (
              <button
                onClick={dismissAll}
                style={{
                  padding: '8px 16px',
                  backgroundColor: cardBg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '8px',
                  color: textMuted,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Dismiss All
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: showSettings ? accentColor : cardBg,
                  border: `1px solid ${showSettings ? accentColor : borderColor}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Settings style={{ width: '16px', height: '16px', color: showSettings ? '#FFF' : textMuted }} />
                <span style={{ fontSize: '12px', color: showSettings ? '#FFF' : textMuted }}>
                  {globalSettings.featureEnabled ? 'On' : 'Off'}
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
