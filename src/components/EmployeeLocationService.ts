/**
 * Employee Location Service - Boardroom 360
 * 
 * Handles GPS location tracking for employees:
 * - Employees opt-in to share location from their portal
 * - Location updates every 5 minutes when portal is open
 * - Locations stored in database with timestamps
 * - Used by Drive-Time Reminders to calculate travel from employee's actual location
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://35.92.33.215:3001';

export interface EmployeeLocation {
  employeeId: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
  address?: string; // Reverse geocoded address (optional)
  source: 'gps' | 'manual' | 'checkin';
}

export interface LocationSettings {
  enabled: boolean;
  updateIntervalMinutes: number;
  shareWhilePortalOpen: boolean;
  lastUpdated?: string;
}

const DEFAULT_LOCATION_SETTINGS: LocationSettings = {
  enabled: false,
  updateIntervalMinutes: 5,
  shareWhilePortalOpen: true
};

// ============ LOCAL SETTINGS ============

/**
 * Get location sharing settings for current employee
 */
export function getLocationSettings(): LocationSettings {
  try {
    const stored = localStorage.getItem('employeeLocationSettings');
    if (stored) {
      return { ...DEFAULT_LOCATION_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Error loading location settings:', e);
  }
  return DEFAULT_LOCATION_SETTINGS;
}

/**
 * Save location sharing settings
 */
export function saveLocationSettings(settings: Partial<LocationSettings>): void {
  try {
    const current = getLocationSettings();
    const updated = { ...current, ...settings, lastUpdated: new Date().toISOString() };
    localStorage.setItem('employeeLocationSettings', JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving location settings:', e);
  }
}

// ============ GEOLOCATION ============

/**
 * Get current GPS position
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
            reject(new Error('Location permission denied. Please enable location access in your browser settings.'));
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
        timeout: 15000,
        maximumAge: 60000 // Cache for 1 minute
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
      timeout: 15000,
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

// ============ API CALLS ============

/**
 * Send current location to server
 */
export async function updateEmployeeLocation(
  employeeId: number,
  position: GeolocationPosition,
  source: 'gps' | 'manual' | 'checkin' = 'gps'
): Promise<boolean> {
  try {
    const token = localStorage.getItem('token');
    
    const locationData: EmployeeLocation = {
      employeeId,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: new Date().toISOString(),
      source
    };

    const response = await fetch(`${API_URL}/employee/location`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(locationData)
    });

    if (!response.ok) {
      console.error('Failed to update location:', response.statusText);
      return false;
    }

    // Store locally as backup
    localStorage.setItem('lastKnownLocation', JSON.stringify(locationData));
    
    return true;
  } catch (error) {
    console.error('Error updating employee location:', error);
    return false;
  }
}

/**
 * Get employee's last known location from server
 */
export async function getEmployeeLocation(employeeId: number): Promise<EmployeeLocation | null> {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/employee/${employeeId}/location`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.location || null;
  } catch (error) {
    console.error('Error fetching employee location:', error);
    return null;
  }
}

/**
 * Get locations for multiple employees
 */
export async function getEmployeeLocations(employeeIds: number[]): Promise<Record<number, EmployeeLocation>> {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/employee/locations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ employeeIds })
    });

    if (!response.ok) {
      return {};
    }

    const data = await response.json();
    return data.locations || {};
  } catch (error) {
    console.error('Error fetching employee locations:', error);
    return {};
  }
}

/**
 * Check if an employee's location is fresh (within last 30 minutes)
 */
export function isLocationFresh(location: EmployeeLocation, maxAgeMinutes: number = 30): boolean {
  const locationTime = new Date(location.timestamp).getTime();
  const now = Date.now();
  const ageMinutes = (now - locationTime) / (1000 * 60);
  return ageMinutes <= maxAgeMinutes;
}

/**
 * Format location age for display
 */
export function formatLocationAge(location: EmployeeLocation): string {
  const locationTime = new Date(location.timestamp).getTime();
  const now = Date.now();
  const ageMinutes = Math.floor((now - locationTime) / (1000 * 60));
  
  if (ageMinutes < 1) return 'Just now';
  if (ageMinutes < 60) return `${ageMinutes} min ago`;
  
  const ageHours = Math.floor(ageMinutes / 60);
  if (ageHours < 24) return `${ageHours} hour${ageHours > 1 ? 's' : ''} ago`;
  
  const ageDays = Math.floor(ageHours / 24);
  return `${ageDays} day${ageDays > 1 ? 's' : ''} ago`;
}

// ============ LOCATION TRACKING MANAGER ============

let trackingInterval: NodeJS.Timeout | null = null;
let currentEmployeeId: number | null = null;

/**
 * Start automatic location tracking
 */
export function startLocationTracking(employeeId: number): void {
  const settings = getLocationSettings();
  
  if (!settings.enabled) {
    console.log('Location tracking is disabled');
    return;
  }

  currentEmployeeId = employeeId;
  
  // Initial update
  updateLocation();
  
  // Set up interval
  const intervalMs = settings.updateIntervalMinutes * 60 * 1000;
  trackingInterval = setInterval(updateLocation, intervalMs);
  
  console.log(`Location tracking started (every ${settings.updateIntervalMinutes} min)`);
}

/**
 * Stop automatic location tracking
 */
export function stopLocationTracking(): void {
  if (trackingInterval) {
    clearInterval(trackingInterval);
    trackingInterval = null;
  }
  currentEmployeeId = null;
  console.log('Location tracking stopped');
}

/**
 * Update location (called by interval)
 */
async function updateLocation(): Promise<void> {
  if (!currentEmployeeId) return;
  
  try {
    const position = await getCurrentPosition();
    await updateEmployeeLocation(currentEmployeeId, position, 'gps');
    console.log('Location updated successfully');
  } catch (error) {
    console.error('Failed to update location:', error);
  }
}

/**
 * Check if tracking is active
 */
export function isTrackingActive(): boolean {
  return trackingInterval !== null;
}

// ============ MANUAL CHECK-IN ============

export interface CheckInLocation {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

// Common check-in locations (can be customized)
export const DEFAULT_CHECKIN_LOCATIONS: CheckInLocation[] = [
  {
    name: 'Office',
    address: '123 Main St, Spokane, WA 99201',
    latitude: 47.6588,
    longitude: -117.4260
  },
  {
    name: 'Warehouse',
    address: '456 Industrial Way, Spokane, WA 99202',
    latitude: 47.6500,
    longitude: -117.4100
  }
];

/**
 * Get saved check-in locations
 */
export function getCheckInLocations(): CheckInLocation[] {
  try {
    const stored = localStorage.getItem('checkInLocations');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading check-in locations:', e);
  }
  return DEFAULT_CHECKIN_LOCATIONS;
}

/**
 * Save check-in locations
 */
export function saveCheckInLocations(locations: CheckInLocation[]): void {
  try {
    localStorage.setItem('checkInLocations', JSON.stringify(locations));
  } catch (e) {
    console.error('Error saving check-in locations:', e);
  }
}

/**
 * Manual check-in at a location
 */
export async function checkInAtLocation(
  employeeId: number,
  location: CheckInLocation
): Promise<boolean> {
  try {
    const token = localStorage.getItem('token');
    
    const locationData: EmployeeLocation = {
      employeeId,
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: 100, // Manual check-in has lower accuracy
      timestamp: new Date().toISOString(),
      address: location.address,
      source: 'checkin'
    };

    const response = await fetch(`${API_URL}/employee/location`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(locationData)
    });

    if (!response.ok) {
      return false;
    }

    localStorage.setItem('lastKnownLocation', JSON.stringify(locationData));
    localStorage.setItem('lastCheckIn', JSON.stringify({
      location: location.name,
      timestamp: new Date().toISOString()
    }));
    
    return true;
  } catch (error) {
    console.error('Error checking in:', error);
    return false;
  }
}

export default {
  // Settings
  getLocationSettings,
  saveLocationSettings,
  
  // Geolocation
  getCurrentPosition,
  watchPosition,
  clearWatch,
  
  // API
  updateEmployeeLocation,
  getEmployeeLocation,
  getEmployeeLocations,
  
  // Utilities
  isLocationFresh,
  formatLocationAge,
  
  // Tracking
  startLocationTracking,
  stopLocationTracking,
  isTrackingActive,
  
  // Check-in
  getCheckInLocations,
  saveCheckInLocations,
  checkInAtLocation
};
