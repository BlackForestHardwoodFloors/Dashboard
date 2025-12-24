/**
 * Employee Location Tracker Component - Boardroom 360
 * 
 * Allows employees to:
 * - Enable/disable location sharing
 * - See their current tracked location
 * - Manually check in at common locations
 * - View location sharing status
 * 
 * Place this in the Employee Portal for employees to manage their location.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  Navigation,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Building2,
  Home,
  Truck,
  Loader2,
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  Edit2
} from 'lucide-react';
import {
  getLocationSettings,
  saveLocationSettings,
  getCurrentPosition,
  updateEmployeeLocation,
  startLocationTracking,
  stopLocationTracking,
  isTrackingActive,
  getCheckInLocations,
  saveCheckInLocations,
  checkInAtLocation,
  formatLocationAge,
  LocationSettings,
  CheckInLocation,
  EmployeeLocation
} from './EmployeeLocationService';

interface EmployeeLocationTrackerProps {
  employeeId: number;
  employeeName: string;
  darkMode?: boolean;
  compact?: boolean;
}

export default function EmployeeLocationTracker({
  employeeId,
  employeeName,
  darkMode = true,
  compact = false
}: EmployeeLocationTrackerProps) {
  const [settings, setSettings] = useState<LocationSettings>(getLocationSettings());
  const [currentLocation, setCurrentLocation] = useState<EmployeeLocation | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showCheckInLocations, setShowCheckInLocations] = useState(false);
  const [checkInLocations, setCheckInLocations] = useState<CheckInLocation[]>(getCheckInLocations());
  const [lastCheckIn, setLastCheckIn] = useState<{ location: string; timestamp: string } | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: '', address: '' });

  // Theme colors
  const bgColor = darkMode ? '#2D2D2D' : '#FFFFFF';
  const cardBg = darkMode ? '#3D3D3D' : '#F5F5F5';
  const textColor = darkMode ? '#FFFFFF' : '#1E1E1E';
  const textMuted = darkMode ? '#A0A0A0' : '#666666';
  const borderColor = darkMode ? '#4D4D4D' : '#E5E5E5';
  const accentColor = '#D4A024';
  const successColor = '#66BB6A';
  const warningColor = '#FF9800';
  const dangerColor = '#EF5350';

  // Load last check-in on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('lastCheckIn');
      if (stored) {
        setLastCheckIn(JSON.parse(stored));
      }
      
      const lastLocation = localStorage.getItem('lastKnownLocation');
      if (lastLocation) {
        setCurrentLocation(JSON.parse(lastLocation));
      }
    } catch (e) {
      console.error('Error loading stored location:', e);
    }
  }, []);

  // Start/stop tracking based on settings
  useEffect(() => {
    if (settings.enabled) {
      startLocationTracking(employeeId);
    } else {
      stopLocationTracking();
    }

    return () => {
      stopLocationTracking();
    };
  }, [settings.enabled, employeeId]);

  const updateSettings = (newSettings: Partial<LocationSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveLocationSettings(updated);
  };

  const handleUpdateLocation = async () => {
    setIsUpdating(true);
    setError(null);

    try {
      const position = await getCurrentPosition();
      const success = await updateEmployeeLocation(employeeId, position, 'gps');
      
      if (success) {
        const location: EmployeeLocation = {
          employeeId,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString(),
          source: 'gps'
        };
        setCurrentLocation(location);
      } else {
        setError('Failed to save location to server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCheckIn = async (location: CheckInLocation) => {
    setIsCheckingIn(true);
    setError(null);

    try {
      const success = await checkInAtLocation(employeeId, location);
      
      if (success) {
        setLastCheckIn({
          location: location.name,
          timestamp: new Date().toISOString()
        });
        setCurrentLocation({
          employeeId,
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: 100,
          timestamp: new Date().toISOString(),
          address: location.address,
          source: 'checkin'
        });
        setShowCheckInLocations(false);
      } else {
        setError('Failed to check in');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check in');
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleAddLocation = async () => {
    if (!newLocation.name || !newLocation.address) return;

    // Use geocoding to get coordinates (simplified - in production use Google Geocoding API)
    // For now, we'll get current GPS as the location
    try {
      const position = await getCurrentPosition();
      const location: CheckInLocation = {
        name: newLocation.name,
        address: newLocation.address,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      
      const updated = [...checkInLocations, location];
      setCheckInLocations(updated);
      saveCheckInLocations(updated);
      setNewLocation({ name: '', address: '' });
      setShowAddLocation(false);
    } catch (err) {
      setError('Failed to get location for new check-in point');
    }
  };

  const removeCheckInLocation = (index: number) => {
    const updated = checkInLocations.filter((_, i) => i !== index);
    setCheckInLocations(updated);
    saveCheckInLocations(updated);
  };

  const getLocationIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('office')) return Building2;
    if (lower.includes('home')) return Home;
    if (lower.includes('warehouse') || lower.includes('shop')) return Truck;
    return MapPin;
  };

  // Compact view for embedding
  if (compact) {
    return (
      <div style={{
        backgroundColor: cardBg,
        borderRadius: '12px',
        border: `1px solid ${settings.enabled ? successColor : borderColor}`,
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: settings.enabled ? `${successColor}20` : cardBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MapPin style={{ 
              width: '20px', 
              height: '20px', 
              color: settings.enabled ? successColor : textMuted 
            }} />
          </div>
          <div>
            <div style={{ color: textColor, fontSize: '14px', fontWeight: '500' }}>
              Location Sharing
            </div>
            <div style={{ color: textMuted, fontSize: '12px' }}>
              {settings.enabled 
                ? (currentLocation ? `Updated ${formatLocationAge(currentLocation)}` : 'Enabled')
                : 'Disabled'}
            </div>
          </div>
        </div>
        <button
          onClick={() => updateSettings({ enabled: !settings.enabled })}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          {settings.enabled ? (
            <ToggleRight style={{ width: '32px', height: '32px', color: successColor }} />
          ) : (
            <ToggleLeft style={{ width: '32px', height: '32px', color: textMuted }} />
          )}
        </button>
      </div>
    );
  }

  // Full view
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
        backgroundColor: settings.enabled ? `${successColor}08` : 'transparent'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: settings.enabled ? `${successColor}20` : (darkMode ? '#4D4D4D' : '#E5E5E5'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MapPin style={{ 
              width: '24px', 
              height: '24px', 
              color: settings.enabled ? successColor : textMuted 
            }} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', color: textColor, margin: '0 0 4px 0', fontWeight: '600' }}>
              Location Sharing
            </h3>
            <p style={{ fontSize: '13px', color: textMuted, margin: 0 }}>
              Share your location for accurate drive-time reminders
            </p>
          </div>
        </div>
        <button
          onClick={() => updateSettings({ enabled: !settings.enabled })}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          {settings.enabled ? (
            <ToggleRight style={{ width: '40px', height: '40px', color: successColor }} />
          ) : (
            <ToggleLeft style={{ width: '40px', height: '40px', color: textMuted }} />
          )}
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {/* Error Display */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px',
            backgroundColor: `${dangerColor}15`,
            borderRadius: '8px',
            marginBottom: '16px',
            border: `1px solid ${dangerColor}40`
          }}>
            <AlertTriangle style={{ width: '18px', height: '18px', color: dangerColor }} />
            <span style={{ color: dangerColor, fontSize: '13px', flex: 1 }}>{error}</span>
            <button 
              onClick={() => setError(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <X style={{ width: '16px', height: '16px', color: dangerColor }} />
            </button>
          </div>
        )}

        {settings.enabled ? (
          <>
            {/* Current Location Status */}
            <div style={{
              backgroundColor: darkMode ? '#252525' : '#FFF',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
              border: `1px solid ${borderColor}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: textMuted, marginBottom: '4px' }}>
                    Current Location
                  </div>
                  {currentLocation ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle style={{ width: '16px', height: '16px', color: successColor }} />
                        <span style={{ color: successColor, fontSize: '14px', fontWeight: '500' }}>
                          Location tracked
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: textMuted, marginTop: '4px' }}>
                        {currentLocation.source === 'checkin' && currentLocation.address
                          ? currentLocation.address
                          : `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`}
                      </div>
                      <div style={{ fontSize: '11px', color: textMuted, marginTop: '2px' }}>
                        Updated {formatLocationAge(currentLocation)}
                        {currentLocation.source === 'checkin' && ' (Check-in)'}
                        {currentLocation.source === 'gps' && ' (GPS)'}
                      </div>
                    </>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertTriangle style={{ width: '16px', height: '16px', color: warningColor }} />
                      <span style={{ color: warningColor, fontSize: '14px' }}>
                        No location yet
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleUpdateLocation}
                  disabled={isUpdating}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: accentColor,
                    border: 'none',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: isUpdating ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: isUpdating ? 0.7 : 1
                  }}
                >
                  {isUpdating ? (
                    <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <RefreshCw style={{ width: '16px', height: '16px' }} />
                  )}
                  {isUpdating ? 'Updating...' : 'Update Now'}
                </button>
              </div>

              {/* Auto-update indicator */}
              {isTrackingActive() && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  backgroundColor: `${successColor}10`,
                  borderRadius: '6px',
                  marginTop: '8px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: successColor,
                    animation: 'pulse 2s infinite'
                  }} />
                  <span style={{ fontSize: '12px', color: successColor }}>
                    Auto-updating every {settings.updateIntervalMinutes} minutes
                  </span>
                </div>
              )}
            </div>

            {/* Quick Check-In */}
            <div style={{ marginBottom: '16px' }}>
              <button
                onClick={() => setShowCheckInLocations(!showCheckInLocations)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 16px',
                  backgroundColor: darkMode ? '#252525' : '#FFF',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Navigation style={{ width: '18px', height: '18px', color: accentColor }} />
                  <span style={{ color: textColor, fontWeight: '500', fontSize: '14px' }}>
                    Quick Check-In
                  </span>
                  {lastCheckIn && (
                    <span style={{ fontSize: '11px', color: textMuted }}>
                      Last: {lastCheckIn.location}
                    </span>
                  )}
                </div>
                {showCheckInLocations ? (
                  <ChevronDown style={{ width: '18px', height: '18px', color: textMuted }} />
                ) : (
                  <ChevronRight style={{ width: '18px', height: '18px', color: textMuted }} />
                )}
              </button>

              {showCheckInLocations && (
                <div style={{
                  marginTop: '8px',
                  backgroundColor: darkMode ? '#252525' : '#FFF',
                  borderRadius: '10px',
                  border: `1px solid ${borderColor}`,
                  overflow: 'hidden'
                }}>
                  {checkInLocations.map((location, idx) => {
                    const Icon = getLocationIcon(location.name);
                    return (
                      <div
                        key={idx}
                        style={{
                          padding: '12px 16px',
                          borderBottom: idx < checkInLocations.length - 1 ? `1px solid ${borderColor}` : 'none',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Icon style={{ width: '18px', height: '18px', color: accentColor }} />
                          <div>
                            <div style={{ color: textColor, fontSize: '14px', fontWeight: '500' }}>
                              {location.name}
                            </div>
                            <div style={{ color: textMuted, fontSize: '11px' }}>
                              {location.address}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleCheckIn(location)}
                            disabled={isCheckingIn}
                            style={{
                              padding: '6px 14px',
                              backgroundColor: accentColor,
                              border: 'none',
                              borderRadius: '6px',
                              color: '#FFF',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: isCheckingIn ? 'not-allowed' : 'pointer'
                            }}
                          >
                            Check In
                          </button>
                          <button
                            onClick={() => removeCheckInLocation(idx)}
                            style={{
                              padding: '6px',
                              backgroundColor: 'transparent',
                              border: `1px solid ${borderColor}`,
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            <X style={{ width: '14px', height: '14px', color: textMuted }} />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add New Location */}
                  {showAddLocation ? (
                    <div style={{ padding: '12px 16px', borderTop: `1px solid ${borderColor}` }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="Location name (e.g., Home)"
                          value={newLocation.name}
                          onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                          style={{
                            padding: '10px',
                            backgroundColor: darkMode ? '#1A1A1A' : '#FFF',
                            border: `1px solid ${borderColor}`,
                            borderRadius: '6px',
                            color: textColor,
                            fontSize: '13px'
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Address"
                          value={newLocation.address}
                          onChange={(e) => setNewLocation(prev => ({ ...prev, address: e.target.value }))}
                          style={{
                            padding: '10px',
                            backgroundColor: darkMode ? '#1A1A1A' : '#FFF',
                            border: `1px solid ${borderColor}`,
                            borderRadius: '6px',
                            color: textColor,
                            fontSize: '13px'
                          }}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={handleAddLocation}
                            style={{
                              flex: 1,
                              padding: '10px',
                              backgroundColor: accentColor,
                              border: 'none',
                              borderRadius: '6px',
                              color: '#FFF',
                              fontSize: '13px',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}
                          >
                            Add (Use Current GPS)
                          </button>
                          <button
                            onClick={() => {
                              setShowAddLocation(false);
                              setNewLocation({ name: '', address: '' });
                            }}
                            style={{
                              padding: '10px',
                              backgroundColor: 'transparent',
                              border: `1px solid ${borderColor}`,
                              borderRadius: '6px',
                              color: textMuted,
                              fontSize: '13px',
                              cursor: 'pointer'
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddLocation(true)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderTop: `1px solid ${borderColor}`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        color: accentColor,
                        fontSize: '13px',
                        fontWeight: '500'
                      }}
                    >
                      <Plus style={{ width: '16px', height: '16px' }} />
                      Add Check-In Location
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Settings */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 16px',
                backgroundColor: darkMode ? '#252525' : '#FFF',
                border: `1px solid ${borderColor}`,
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Settings style={{ width: '18px', height: '18px', color: textMuted }} />
                <span style={{ color: textColor, fontWeight: '500', fontSize: '14px' }}>Settings</span>
              </div>
              {showSettings ? (
                <ChevronDown style={{ width: '18px', height: '18px', color: textMuted }} />
              ) : (
                <ChevronRight style={{ width: '18px', height: '18px', color: textMuted }} />
              )}
            </button>

            {showSettings && (
              <div style={{
                marginTop: '8px',
                padding: '16px',
                backgroundColor: darkMode ? '#252525' : '#FFF',
                borderRadius: '10px',
                border: `1px solid ${borderColor}`
              }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px' }}>
                    Update Interval
                  </label>
                  <select
                    value={settings.updateIntervalMinutes}
                    onChange={(e) => updateSettings({ updateIntervalMinutes: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: darkMode ? '#1A1A1A' : '#FFF',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '8px',
                      color: textColor,
                      fontSize: '14px'
                    }}
                  >
                    <option value="1">Every 1 minute</option>
                    <option value="5">Every 5 minutes</option>
                    <option value="10">Every 10 minutes</option>
                    <option value="15">Every 15 minutes</option>
                    <option value="30">Every 30 minutes</option>
                  </select>
                </div>

                <div style={{
                  padding: '12px',
                  backgroundColor: darkMode ? '#1A1A1A' : '#F5F5F5',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: textMuted,
                  lineHeight: '1.5'
                }}>
                  <strong style={{ color: textColor }}>Privacy Note:</strong> Your location is only used to calculate 
                  drive-time reminders. Location data is stored securely and only accessible by admins 
                  for scheduling purposes.
                </div>
              </div>
            )}
          </>
        ) : (
          /* Disabled State */
          <div style={{
            textAlign: 'center',
            padding: '32px 20px',
            backgroundColor: darkMode ? '#252525' : '#FFF',
            borderRadius: '12px'
          }}>
            <MapPin style={{ width: '48px', height: '48px', color: textMuted, margin: '0 auto 16px' }} />
            <h4 style={{ fontSize: '16px', color: textColor, margin: '0 0 8px 0' }}>
              Location Sharing Disabled
            </h4>
            <p style={{ fontSize: '13px', color: textMuted, margin: '0 0 20px 0', lineHeight: '1.5' }}>
              Enable location sharing to receive accurate drive-time reminders 
              based on your current location.
            </p>
            <button
              onClick={() => updateSettings({ enabled: true })}
              style={{
                padding: '12px 24px',
                backgroundColor: accentColor,
                border: 'none',
                borderRadius: '8px',
                color: '#FFF',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Enable Location Sharing
            </button>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
