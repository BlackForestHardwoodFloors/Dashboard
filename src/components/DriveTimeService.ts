/**
 * Drive Time Service - Boardroom 360
 * 
 * Calculates drive time between locations using Google Maps Directions API
 * and manages drive-time reminders for appointments.
 * 
 * Features:
 * - Employee-specific reminders (only assigned employee gets notified)
 * - Per-employee notification preferences
 * - Admin enable/disable control
 */

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const API_URL = import.meta.env.VITE_API_URL || 'http://35.92.33.215:3001';

export interface DriveTimeResult {
  durationSeconds: number;
  durationText: string;
  distanceMeters: number;
  distanceText: string;
  origin: string;
  destination: string;
  trafficDurationSeconds?: number;
  trafficDurationText?: string;
}

export interface EmployeeReminderSettings {
  employeeId: number;
  enabled: boolean;
  enableSMS: boolean;
  enableEmail: boolean;
  enableInApp: boolean;
  bufferMinutes: number;
  reminderBeforeLeave: number;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface GlobalReminderSettings {
  featureEnabled: boolean; // Master toggle for the entire feature
  defaultBufferMinutes: number;
  defaultReminderBeforeLeave: number;
  defaultQuietHoursStart: string;
  defaultQuietHoursEnd: string;
}

export interface AppointmentReminder {
  appointmentId: number;
  employeeId: number;
  employeeName: string;
  employeePhone?: string;
  employeeEmail?: string;
  appointmentTime: Date;
  location: string;
  contactName: string;
  purpose: string;
  driveTime?: DriveTimeResult;
  reminderTime?: Date;
  reminderSent: boolean;
  leaveByTime?: Date;
}

const DEFAULT_GLOBAL_SETTINGS: GlobalReminderSettings = {
  featureEnabled: true,
  defaultBufferMinutes: 10,
  defaultReminderBeforeLeave: 15,
  defaultQuietHoursStart: '21:00',
  defaultQuietHoursEnd: '07:00'
};

const DEFAULT_EMPLOYEE_SETTINGS: Omit<EmployeeReminderSettings, 'employeeId'> = {
  enabled: true,
  enableSMS: true,
  enableEmail: true,
  enableInApp: true,
  bufferMinutes: 10,
  reminderBeforeLeave: 15,
  quietHoursStart: '21:00',
  quietHoursEnd: '07:00'
};

// ============ GLOBAL SETTINGS ============

/**
 * Get global reminder settings (admin-level)
 */
export function getGlobalSettings(): GlobalReminderSettings {
  try {
    const stored = localStorage.getItem('driveTimeGlobalSettings');
    if (stored) {
      return { ...DEFAULT_GLOBAL_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Error loading global settings:', e);
  }
  return DEFAULT_GLOBAL_SETTINGS;
}

/**
 * Save global reminder settings
 */
export function saveGlobalSettings(settings: Partial<GlobalReminderSettings>): void {
  try {
    const current = getGlobalSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem('driveTimeGlobalSettings', JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving global settings:', e);
  }
}

/**
 * Check if the feature is enabled globally
 */
export function isFeatureEnabled(): boolean {
  return getGlobalSettings().featureEnabled;
}

/**
 * Toggle the feature on/off
 */
export function toggleFeature(enabled: boolean): void {
  saveGlobalSettings({ featureEnabled: enabled });
}

// ============ EMPLOYEE SETTINGS ============

/**
 * Get reminder settings for a specific employee
 */
export function getEmployeeSettings(employeeId: number): EmployeeReminderSettings {
  try {
    const allSettings = JSON.parse(localStorage.getItem('driveTimeEmployeeSettings') || '{}');
    if (allSettings[employeeId]) {
      return { ...DEFAULT_EMPLOYEE_SETTINGS, employeeId, ...allSettings[employeeId] };
    }
  } catch (e) {
    console.error('Error loading employee settings:', e);
  }
  return { ...DEFAULT_EMPLOYEE_SETTINGS, employeeId };
}

/**
 * Save reminder settings for a specific employee
 */
export function saveEmployeeSettings(employeeId: number, settings: Partial<EmployeeReminderSettings>): void {
  try {
    const allSettings = JSON.parse(localStorage.getItem('driveTimeEmployeeSettings') || '{}');
    allSettings[employeeId] = { ...getEmployeeSettings(employeeId), ...settings };
    localStorage.setItem('driveTimeEmployeeSettings', JSON.stringify(allSettings));
  } catch (e) {
    console.error('Error saving employee settings:', e);
  }
}

/**
 * Get all employee settings
 */
export function getAllEmployeeSettings(): Record<number, EmployeeReminderSettings> {
  try {
    return JSON.parse(localStorage.getItem('driveTimeEmployeeSettings') || '{}');
  } catch (e) {
    console.error('Error loading all employee settings:', e);
    return {};
  }
}

/**
 * Check if reminders are enabled for an employee
 */
export function isEnabledForEmployee(employeeId: number): boolean {
  if (!isFeatureEnabled()) return false;
  return getEmployeeSettings(employeeId).enabled;
}

// ============ GEOLOCATION ============

/**
 * Get current position using browser geolocation
 */
export async function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location permission denied. Please enable location access.'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location information unavailable.'));
            break;
          case error.TIMEOUT:
            reject(new Error('Location request timed out.'));
            break;
          default:
            reject(new Error('An unknown error occurred getting location.'));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}

/**
 * Watch position for continuous updates
 */
export function watchPosition(
  onSuccess: (position: GeolocationPosition) => void,
  onError: (error: string) => void
): number | null {
  if (!navigator.geolocation) {
    onError('Geolocation is not supported');
    return null;
  }

  return navigator.geolocation.watchPosition(
    onSuccess,
    (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          onError('Location permission denied');
          break;
        case error.POSITION_UNAVAILABLE:
          onError('Location unavailable');
          break;
        case error.TIMEOUT:
          onError('Location request timed out');
          break;
        default:
          onError('Unknown location error');
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000
    }
  );
}

/**
 * Stop watching position
 */
export function clearWatch(watchId: number): void {
  navigator.geolocation.clearWatch(watchId);
}

// ============ DRIVE TIME CALCULATION ============

/**
 * Calculate drive time using Google Maps JavaScript API (client-side)
 */
export async function calculateDriveTime(
  origin: string | { lat: number; lng: number },
  destination: string,
  departureTime?: Date
): Promise<DriveTimeResult> {
  return new Promise((resolve, reject) => {
    if (typeof google === 'undefined' || !google.maps) {
      reject(new Error('Google Maps JavaScript API not loaded'));
      return;
    }

    const directionsService = new google.maps.DirectionsService();

    const request: google.maps.DirectionsRequest = {
      origin: typeof origin === 'string' ? origin : new google.maps.LatLng(origin.lat, origin.lng),
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
      drivingOptions: {
        departureTime: departureTime || new Date(),
        trafficModel: google.maps.TrafficModel.BEST_GUESS
      },
      unitSystem: google.maps.UnitSystem.IMPERIAL
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        const route = result.routes[0];
        const leg = route.legs[0];

        const driveTimeResult: DriveTimeResult = {
          durationSeconds: leg.duration?.value || 0,
          durationText: leg.duration?.text || 'Unknown',
          distanceMeters: leg.distance?.value || 0,
          distanceText: leg.distance?.text || 'Unknown',
          origin: leg.start_address || '',
          destination: leg.end_address || ''
        };

        if (leg.duration_in_traffic) {
          driveTimeResult.trafficDurationSeconds = leg.duration_in_traffic.value;
          driveTimeResult.trafficDurationText = leg.duration_in_traffic.text;
        }

        resolve(driveTimeResult);
      } else {
        reject(new Error(`Directions request failed: ${status}`));
      }
    });
  });
}

// ============ TIME CALCULATIONS ============

/**
 * Calculate when an employee should leave to arrive on time
 */
export function calculateLeaveTime(
  appointmentTime: Date,
  driveTimeSeconds: number,
  bufferMinutes: number = 10
): Date {
  const totalSeconds = driveTimeSeconds + (bufferMinutes * 60);
  return new Date(appointmentTime.getTime() - (totalSeconds * 1000));
}

/**
 * Calculate when to send the reminder
 */
export function calculateReminderTime(
  leaveTime: Date,
  reminderBeforeMinutes: number = 15
): Date {
  return new Date(leaveTime.getTime() - (reminderBeforeMinutes * 60 * 1000));
}

// ============ MESSAGE FORMATTING ============

/**
 * Format a drive time reminder message
 */
export function formatReminderMessage(
  reminder: AppointmentReminder
): { sms: string; email: { subject: string; body: string } } {
  const driveTime = reminder.driveTime?.trafficDurationText || reminder.driveTime?.durationText || 'Unknown';
  const distance = reminder.driveTime?.distanceText || 'Unknown';
  
  const appointmentTimeStr = reminder.appointmentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const leaveTimeStr = reminder.leaveByTime?.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }) || 'soon';

  // SMS message (keep it short)
  const sms = `🚗 Leave by ${leaveTimeStr} for your ${appointmentTimeStr} appointment with ${reminder.contactName}. Drive time: ${driveTime} (${distance}). Address: ${reminder.location}`;

  // Email message
  const email = {
    subject: `⏰ Time to Leave - ${reminder.contactName} Appointment at ${appointmentTimeStr}`,
    body: `
Hi ${reminder.employeeName},

This is a reminder to leave for your upcoming appointment:

📅 Appointment Details:
• Client: ${reminder.contactName}
• Time: ${appointmentTimeStr}
• Purpose: ${reminder.purpose}
• Address: ${reminder.location}

🚗 Drive Information:
• Estimated drive time: ${driveTime}
• Distance: ${distance}
• Leave by: ${leaveTimeStr}

Safe travels!

- Boardroom 360
    `.trim()
  };

  return { sms, email };
}

// ============ QUIET HOURS ============

/**
 * Check if current time is within quiet hours
 */
export function isQuietHours(
  quietHoursStart: string = '21:00',
  quietHoursEnd: string = '07:00'
): boolean {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const [startHour, startMin] = quietHoursStart.split(':').map(Number);
  const [endHour, endMin] = quietHoursEnd.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  if (startMinutes > endMinutes) {
    return currentTime >= startMinutes || currentTime < endMinutes;
  }
  
  return currentTime >= startMinutes && currentTime < endMinutes;
}

// ============ REMINDER TRACKING ============

/**
 * Store sent reminders to avoid duplicates
 */
export function markReminderSent(appointmentId: number, employeeId: number): void {
  try {
    const sent = JSON.parse(localStorage.getItem('sentDriveTimeReminders') || '{}');
    const key = `${appointmentId}-${employeeId}`;
    sent[key] = new Date().toISOString();
    localStorage.setItem('sentDriveTimeReminders', JSON.stringify(sent));
  } catch (e) {
    console.error('Error marking reminder as sent:', e);
  }
}

/**
 * Check if a reminder was already sent today for this appointment/employee
 */
export function wasReminderSentToday(appointmentId: number, employeeId: number): boolean {
  try {
    const sent = JSON.parse(localStorage.getItem('sentDriveTimeReminders') || '{}');
    const key = `${appointmentId}-${employeeId}`;
    if (sent[key]) {
      const sentDate = new Date(sent[key]);
      const today = new Date();
      return sentDate.toDateString() === today.toDateString();
    }
  } catch (e) {
    console.error('Error checking sent reminders:', e);
  }
  return false;
}

/**
 * Clean up old sent reminder records
 */
export function cleanupOldReminders(): void {
  try {
    const sent = JSON.parse(localStorage.getItem('sentDriveTimeReminders') || '{}');
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const cleaned: Record<string, string> = {};
    for (const [id, dateStr] of Object.entries(sent)) {
      if (new Date(dateStr as string) > sevenDaysAgo) {
        cleaned[id] = dateStr as string;
      }
    }
    
    localStorage.setItem('sentDriveTimeReminders', JSON.stringify(cleaned));
  } catch (e) {
    console.error('Error cleaning up old reminders:', e);
  }
}

// ============ API CALLS ============

/**
 * Save employee settings to backend (for persistence across devices)
 */
export async function syncEmployeeSettingsToBackend(
  employeeId: number, 
  settings: EmployeeReminderSettings
): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/employee/${employeeId}/reminder-settings`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings)
    });
  } catch (e) {
    console.error('Error syncing employee settings to backend:', e);
  }
}

/**
 * Load employee settings from backend
 */
export async function loadEmployeeSettingsFromBackend(
  employeeId: number
): Promise<EmployeeReminderSettings | null> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/employee/${employeeId}/reminder-settings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.settings;
    }
  } catch (e) {
    console.error('Error loading employee settings from backend:', e);
  }
  return null;
}

export default {
  // Global settings
  getGlobalSettings,
  saveGlobalSettings,
  isFeatureEnabled,
  toggleFeature,
  
  // Employee settings
  getEmployeeSettings,
  saveEmployeeSettings,
  getAllEmployeeSettings,
  isEnabledForEmployee,
  
  // Geolocation
  getCurrentPosition,
  watchPosition,
  clearWatch,
  
  // Drive time
  calculateDriveTime,
  calculateLeaveTime,
  calculateReminderTime,
  
  // Messages
  formatReminderMessage,
  
  // Utilities
  isQuietHours,
  markReminderSent,
  wasReminderSentToday,
  cleanupOldReminders,
  
  // API
  syncEmployeeSettingsToBackend,
  loadEmployeeSettingsFromBackend
};
