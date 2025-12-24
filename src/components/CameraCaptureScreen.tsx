import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  X,
  RotateCcw,
  Zap,
  ZapOff,
  SwitchCamera,
  MapPin,
  Check,
  ChevronDown,
  ChevronUp,
  Mic,
  MicOff,
  Image as ImageIcon,
  Send,
  Trash2,
  AlertCircle,
  Loader2,
  Plus,
  Clock,
  User,
  Home,
  Layers
} from 'lucide-react';

interface Job {
  id: string;
  name: string;
  clientName: string;
  address: string;
  latitude?: number;
  longitude?: number;
  rooms?: string[]; // Custom rooms for this job
}

interface CameraCaptureScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoTaken: (photoData: {
    imageData: string;
    jobId: string;
    room: string;
    phase: string;
    notes: string;
    latitude?: number;
    longitude?: number;
    timestamp: string;
    gpsVerified: boolean;
    distanceFromSite?: number;
    gpsSuggestedJobId?: string; // If GPS suggested a different job
  }) => void;
  jobs: Job[];
  currentJobId?: string;
  onAddRoom?: (jobId: string, roomName: string) => void; // Callback to persist new room
}

const ACCENT_COLOR = '#0F7BFF';

// Default room options (can be customized per job)
const DEFAULT_ROOM_OPTIONS = [
  'Living Room',
  'Kitchen',
  'Dining Room',
  'Master Bedroom',
  'Bedroom 2',
  'Bedroom 3',
  'Master Bathroom',
  'Bathroom 2',
  'Half Bath',
  'Hallway',
  'Stairs',
  'Landing',
  'Foyer',
  'Entryway',
  'Office',
  'Den',
  'Family Room',
  'Bonus Room',
  'Laundry Room',
  'Mudroom',
  'Basement',
  'Garage',
  'Porch',
  'Deck',
  'Exterior Front',
  'Exterior Back',
  'Exterior Side'
];

// Calculate distance between two GPS coordinates (in feet)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 20902231; // Earth's radius in feet
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// GPS verification threshold (in feet) - 500 feet = roughly on property
const GPS_VERIFICATION_THRESHOLD = 500;

// Phase options
const PHASE_OPTIONS = [
  'Before',
  'Demo',
  'Prep',
  'Install',
  'Sand',
  'Stain',
  'Finish',
  'After',
  'Problem Area'
];

export default function CameraCaptureScreen({
  isOpen,
  onClose,
  onPhotoTaken,
  jobs,
  currentJobId,
  onAddRoom
}: CameraCaptureScreenProps) {
  // Camera refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Camera state
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [hasFlash, setHasFlash] = useState(false);

  // Captured photo state
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Location state
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [gpsVerified, setGpsVerified] = useState(false);
  const [distanceFromSite, setDistanceFromSite] = useState<number | null>(null);

  // Form state
  const [selectedJobId, setSelectedJobId] = useState(currentJobId || '');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [customRoom, setCustomRoom] = useState('');
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('Before');
  const [notes, setNotes] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  // Voice notes
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Confirmation for saving to non-GPS-verified job
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  // Voice room detection
  const [isListeningForRoom, setIsListeningForRoom] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'processing' | 'success' | 'error'>('idle');
  const roomRecognitionRef = useRef<any>(null);
  
  // Tooltips
  const [showVoiceTip, setShowVoiceTip] = useState(true); // Show on first load
  const [showRoomTip, setShowRoomTip] = useState(false);
  const [showCaptureTip, setShowCaptureTip] = useState(false);
  const [showGpsTip, setShowGpsTip] = useState(false);
  const [showFlashTip, setShowFlashTip] = useState(false);
  const [showSwitchTip, setShowSwitchTip] = useState(false);

  // Get selected job (needed for roomOptions)
  const selectedJob = jobs.find(j => j.id === selectedJobId);

  // Get room options for selected job (default + custom)
  const roomOptions = React.useMemo(() => {
    const customRooms = selectedJob?.rooms || [];
    const allRooms = [...DEFAULT_ROOM_OPTIONS, ...customRooms];
    // Remove duplicates and sort
    return [...new Set(allRooms)].sort();
  }, [selectedJob]);
  
  // Auto-hide voice tip after delay
  useEffect(() => {
    if (showVoiceTip && cameraReady && selectedJobId) {
      const timer = setTimeout(() => setShowVoiceTip(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showVoiceTip, cameraReady, selectedJobId]);

  // Match voice input to room options
  const matchVoiceToRoom = (transcript: string): string | null => {
    const normalizedTranscript = transcript.toLowerCase().trim();
    
    // Direct match
    const directMatch = roomOptions.find(
      room => room.toLowerCase() === normalizedTranscript
    );
    if (directMatch) return directMatch;

    // Partial match (transcript contains room name or vice versa)
    const partialMatch = roomOptions.find(room => {
      const normalizedRoom = room.toLowerCase();
      return normalizedRoom.includes(normalizedTranscript) || 
             normalizedTranscript.includes(normalizedRoom);
    });
    if (partialMatch) return partialMatch;

    // Fuzzy matching for common variations
    const variations: Record<string, string[]> = {
      'Living Room': ['living', 'front room', 'lounge', 'family room', 'main room'],
      'Kitchen': ['kitchen', 'cook', 'cooking'],
      'Dining Room': ['dining', 'dinner', 'eat', 'eating room'],
      'Master Bedroom': ['master', 'main bedroom', 'primary', 'primary bedroom', 'master bed'],
      'Bedroom 2': ['bedroom 2', 'second bedroom', 'guest room', 'guest bedroom', 'bedroom two'],
      'Bedroom 3': ['bedroom 3', 'third bedroom', 'bedroom three', 'kids room'],
      'Master Bathroom': ['master bath', 'main bath', 'primary bath', 'master bathroom', 'en suite'],
      'Bathroom 2': ['bathroom 2', 'second bath', 'guest bath', 'hall bath', 'bathroom two'],
      'Half Bath': ['half bath', 'powder room', 'half bathroom', 'powder'],
      'Hallway': ['hallway', 'hall', 'corridor', 'passage'],
      'Stairs': ['stairs', 'stairway', 'staircase', 'steps'],
      'Landing': ['landing', 'upstairs landing', 'stair landing'],
      'Foyer': ['foyer', 'entry', 'entrance', 'entryway', 'front entry'],
      'Entryway': ['entryway', 'entry way', 'entrance'],
      'Office': ['office', 'study', 'home office', 'work room', 'den'],
      'Den': ['den', 'tv room', 'media room'],
      'Family Room': ['family', 'family room', 'rec room'],
      'Bonus Room': ['bonus', 'bonus room', 'flex room', 'extra room'],
      'Laundry Room': ['laundry', 'laundry room', 'wash room', 'utility'],
      'Mudroom': ['mudroom', 'mud room', 'back entry'],
      'Basement': ['basement', 'downstairs', 'cellar', 'lower level'],
      'Garage': ['garage', 'car port', 'carport'],
      'Porch': ['porch', 'front porch', 'back porch', 'veranda'],
      'Deck': ['deck', 'patio', 'back deck'],
      'Exterior Front': ['exterior front', 'front yard', 'front of house', 'front exterior', 'outside front'],
      'Exterior Back': ['exterior back', 'backyard', 'back yard', 'back of house', 'outside back'],
      'Exterior Side': ['exterior side', 'side yard', 'side of house', 'outside side']
    };

    for (const [room, aliases] of Object.entries(variations)) {
      if (aliases.some(alias => normalizedTranscript.includes(alias))) {
        // Check if this room exists in options
        if (roomOptions.includes(room)) {
          return room;
        }
      }
    }

    return null;
  };

  // Start listening for room voice input
  const startRoomVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser. Please use Chrome or Safari.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setIsListeningForRoom(true);
      setVoiceStatus('listening');
      setVoiceTranscript('');
    };

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript = event.results[i][0].transcript;
      }
      setVoiceTranscript(transcript);

      // If this is a final result, try to match room
      if (event.results[0].isFinal) {
        setVoiceStatus('processing');
        
        setTimeout(() => {
          const matchedRoom = matchVoiceToRoom(transcript);
          
          if (matchedRoom) {
            setSelectedRoom(matchedRoom);
            setVoiceStatus('success');
            setTimeout(() => {
              setVoiceStatus('idle');
              setVoiceTranscript('');
            }, 2000);
          } else {
            // No match - offer to add as new room
            setVoiceStatus('error');
          }
          
          setIsListeningForRoom(false);
        }, 500);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListeningForRoom(false);
      setVoiceStatus('error');
      setTimeout(() => setVoiceStatus('idle'), 2000);
    };

    recognition.onend = () => {
      setIsListeningForRoom(false);
    };

    roomRecognitionRef.current = recognition;
    recognition.start();
  };

  // Stop voice input
  const stopRoomVoiceInput = () => {
    if (roomRecognitionRef.current) {
      roomRecognitionRef.current.stop();
    }
    setIsListeningForRoom(false);
  };

  // Add voice transcript as new room
  const addVoiceAsNewRoom = () => {
    if (voiceTranscript.trim() && selectedJobId) {
      const formattedRoom = voiceTranscript.trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      onAddRoom?.(selectedJobId, formattedRoom);
      setSelectedRoom(formattedRoom);
      setVoiceStatus('success');
      setTimeout(() => {
        setVoiceStatus('idle');
        setVoiceTranscript('');
      }, 2000);
    }
  };

  // Get job distances for dropdown
  const jobsWithDistance = React.useMemo(() => {
    if (!location) return jobs.map(j => ({ ...j, distance: null }));
    
    return jobs.map(job => {
      if (job.latitude && job.longitude) {
        const distance = calculateDistance(
          location.latitude, location.longitude,
          job.latitude, job.longitude
        );
        return { ...job, distance };
      }
      return { ...job, distance: null };
    }).sort((a, b) => {
      // Sort by distance (closest first), null distances last
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });
  }, [jobs, location]);

  // Find nearest job based on GPS
  const [nearestJob, setNearestJob] = useState<{ job: Job; distance: number } | null>(null);
  const [jobMismatchWarning, setJobMismatchWarning] = useState(false);

  // Calculate nearest job when location changes
  useEffect(() => {
    if (!location) {
      setNearestJob(null);
      return;
    }

    let closest: { job: Job; distance: number } | null = null;

    jobs.forEach(job => {
      if (job.latitude && job.longitude) {
        const distance = calculateDistance(
          location.latitude, location.longitude,
          job.latitude, job.longitude
        );
        
        if (!closest || distance < closest.distance) {
          closest = { job, distance };
        }
      }
    });

    setNearestJob(closest);

    // Auto-select job if within threshold and no job selected yet
    if (closest && closest.distance <= GPS_VERIFICATION_THRESHOLD && !selectedJobId) {
      setSelectedJobId(closest.job.id);
    }
  }, [location, jobs, selectedJobId]);

  // Check for job mismatch when selection changes
  useEffect(() => {
    if (nearestJob && selectedJobId && nearestJob.job.id !== selectedJobId) {
      // Selected job is different from GPS-detected job
      const selectedJobDistance = (() => {
        const job = jobs.find(j => j.id === selectedJobId);
        if (job?.latitude && job?.longitude && location) {
          return calculateDistance(
            location.latitude, location.longitude,
            job.latitude, job.longitude
          );
        }
        return null;
      })();
      
      // Show warning if they're closer to a different job
      setJobMismatchWarning(
        nearestJob.distance <= GPS_VERIFICATION_THRESHOLD && 
        (selectedJobDistance === null || selectedJobDistance > GPS_VERIFICATION_THRESHOLD)
      );
    } else {
      setJobMismatchWarning(false);
    }
  }, [nearestJob, selectedJobId, jobs, location]);

  // Initialize camera
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      setCameraReady(false);

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraReady(true);

        // Check for flash/torch capability
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities?.() as any;
        setHasFlash(capabilities?.torch === true);
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError') {
        setCameraError('Camera access denied. Please allow camera access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else {
        setCameraError('Unable to access camera. Please try again.');
      }
    }
  }, [facingMode]);

  // Get GPS location and verify distance from job
  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLat = position.coords.latitude;
        const currentLon = position.coords.longitude;
        
        setLocation({
          latitude: currentLat,
          longitude: currentLon
        });
        setIsGettingLocation(false);

        // Check distance from selected job if it has coordinates
        if (selectedJob?.latitude && selectedJob?.longitude) {
          const distance = calculateDistance(
            currentLat, currentLon,
            selectedJob.latitude, selectedJob.longitude
          );
          setDistanceFromSite(distance);
          setGpsVerified(distance <= GPS_VERIFICATION_THRESHOLD);
        }
      },
      (error) => {
        console.error('Location error:', error);
        setLocationError('Unable to get location');
        setIsGettingLocation(false);
        setGpsVerified(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, [selectedJob]);

  // Re-check GPS when job changes
  useEffect(() => {
    if (location && selectedJob?.latitude && selectedJob?.longitude) {
      const distance = calculateDistance(
        location.latitude, location.longitude,
        selectedJob.latitude, selectedJob.longitude
      );
      setDistanceFromSite(distance);
      setGpsVerified(distance <= GPS_VERIFICATION_THRESHOLD);
    } else {
      setDistanceFromSite(null);
      setGpsVerified(false);
    }
  }, [selectedJobId, location, selectedJob]);

  // Initialize on open
  useEffect(() => {
    if (isOpen) {
      startCamera();
      getLocation();
      setSelectedJobId(currentJobId || '');
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, startCamera, getLocation, currentJobId]);

  // Toggle flash
  const toggleFlash = async () => {
    if (!streamRef.current || !hasFlash) return;

    const track = streamRef.current.getVideoTracks()[0];
    try {
      await track.applyConstraints({
        advanced: [{ torch: !flashEnabled } as any]
      });
      setFlashEnabled(!flashEnabled);
    } catch (err) {
      console.error('Flash toggle error:', err);
    }
  };

  // Switch camera
  const switchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0);

    // Get image data
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageData);
    setShowDetails(true);

    // Stop camera to save battery
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
    setShowDetails(false);
    startCamera();
  };

  // Submit photo
  const submitPhoto = () => {
    if (!capturedImage || !selectedJobId) return;

    setIsProcessing(true);

    const now = new Date();
    const timestamp = now.toISOString();

    const photoData = {
      imageData: capturedImage,
      jobId: selectedJobId,
      room: selectedRoom === 'Other' ? customRoom : selectedRoom,
      phase: selectedPhase,
      notes: notes,
      latitude: location?.latitude,
      longitude: location?.longitude,
      timestamp,
      gpsVerified: gpsVerified,
      distanceFromSite: distanceFromSite || undefined,
      // If GPS suggested a different job, record it for audit trail
      gpsSuggestedJobId: (jobMismatchWarning && nearestJob) ? nearestJob.job.id : undefined
    };

    // Simulate upload delay
    setTimeout(() => {
      onPhotoTaken(photoData);
      setIsProcessing(false);
      setShowSaveConfirmation(false);
      
      // Reset for next photo
      setCapturedImage(null);
      setNotes('');
      setShowDetails(false);
      startCamera();
    }, 1000);
  };

  // Add new room to job's room list
  const handleAddRoom = () => {
    if (!newRoomName.trim() || !selectedJobId) return;
    
    const trimmedName = newRoomName.trim();
    
    // Call parent callback to persist the new room
    onAddRoom?.(selectedJobId, trimmedName);
    
    // Select the new room
    setSelectedRoom(trimmedName);
    setNewRoomName('');
    setShowAddRoom(false);
  };

  // Voice recording
  const startVoiceNote = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice notes not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setNotes(prev => prev + ' ' + transcript);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopVoiceNote = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#000000',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Header */}
      <div style={{
        padding: '12px 16px',
        paddingTop: 'max(12px, env(safe-area-inset-top))',
        backgroundColor: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10
      }}>
        <button
          onClick={onClose}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={24} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600', margin: 0 }}>
            {capturedImage ? 'Review Photo' : 'Take Photo'}
          </p>
          {selectedJob && (
            <p style={{ color: '#A0A0A0', fontSize: '12px', margin: '2px 0 0 0' }}>
              {selectedJob.name}
            </p>
          )}
        </div>

        {/* Location indicator */}
        <div 
          onClick={getLocation}
          onMouseEnter={() => setShowGpsTip(true)}
          onMouseLeave={() => setShowGpsTip(false)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            padding: '6px 10px',
            backgroundColor: gpsVerified 
              ? 'rgba(123, 170, 142, 0.3)' 
              : location 
                ? 'rgba(231, 76, 60, 0.3)'
                : 'rgba(255,255,255,0.1)',
            borderRadius: '10px',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          {/* GPS Tooltip */}
          {showGpsTip && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              backgroundColor: 'rgba(0,0,0,0.9)',
              padding: '10px 14px',
              borderRadius: '10px',
              maxWidth: '220px',
              zIndex: 100,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}>
              <div style={{
                position: 'absolute',
                top: '-6px',
                right: '20px',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: '6px solid rgba(0,0,0,0.9)'
              }} />
              <p style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: '600', margin: '0 0 4px 0' }}>
                {gpsVerified ? '✓ GPS Verified' : location ? '⚠ Not at Job Site' : '📍 GPS Location'}
              </p>
              <p style={{ color: '#A0A0A0', fontSize: '11px', margin: 0, lineHeight: '1.4' }}>
                {gpsVerified 
                  ? 'Your location matches the job address. Photo will be verified.'
                  : location 
                    ? 'You appear to be away from the job site. Tap to refresh.'
                    : 'Tap to get your current location and verify job site.'
                }
              </p>
            </div>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {isGettingLocation ? (
              <Loader2 size={14} color="#A0A0A0" style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <MapPin size={14} color={gpsVerified ? '#7BAA8E' : location ? '#E74C3C' : '#666'} />
            )}
            <span style={{ 
              color: gpsVerified ? '#7BAA8E' : location ? '#E74C3C' : '#666', 
              fontSize: '11px', 
              fontWeight: '600' 
            }}>
              {gpsVerified ? 'On Site' : location ? 'Off Site' : 'No GPS'}
            </span>
          </div>
          {distanceFromSite !== null && location && (
            <span style={{
              color: gpsVerified ? '#7BAA8E' : '#E74C3C',
              fontSize: '9px',
              fontWeight: '500'
            }}>
              {distanceFromSite < 1000 
                ? `${Math.round(distanceFromSite)} ft away`
                : `${(distanceFromSite / 5280).toFixed(1)} mi away`
              }
            </span>
          )}
        </div>
      </div>

      {/* Camera View / Captured Image */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {cameraError ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center'
          }}>
            <AlertCircle size={48} color="#E74C3C" style={{ marginBottom: '16px' }} />
            <p style={{ color: '#FFFFFF', fontSize: '16px', marginBottom: '8px' }}>
              Camera Error
            </p>
            <p style={{ color: '#A0A0A0', fontSize: '14px', marginBottom: '20px' }}>
              {cameraError}
            </p>
            <button
              onClick={startCamera}
              style={{
                padding: '12px 24px',
                backgroundColor: ACCENT_COLOR,
                border: 'none',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        ) : capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain'
            }}
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        )}

        {/* Camera loading indicator */}
        {!cameraError && !cameraReady && !capturedImage && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000'
          }}>
            <Loader2 size={48} color={ACCENT_COLOR} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        )}

        {/* GPS Job Detection Banner - Shows which job GPS thinks you're at */}
        {!capturedImage && cameraReady && nearestJob && nearestJob.distance <= GPS_VERIFICATION_THRESHOLD && (
          <div style={{
            position: 'absolute',
            top: '80px',
            left: '16px',
            right: '16px',
            padding: '12px 16px',
            backgroundColor: 'rgba(123, 170, 142, 0.95)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <MapPin size={20} color="#FFFFFF" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '700', margin: '0 0 2px 0' }}>
                📍 GPS Detected: {nearestJob.job.name}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', margin: 0 }}>
                {Math.round(nearestJob.distance)} ft away • Auto-selected
              </p>
            </div>
            <Check size={20} color="#FFFFFF" />
          </div>
        )}

        {/* GPS Not At Any Job Site Warning */}
        {!capturedImage && cameraReady && location && (!nearestJob || nearestJob.distance > GPS_VERIFICATION_THRESHOLD) && (
          <div style={{
            position: 'absolute',
            top: '80px',
            left: '16px',
            right: '16px',
            padding: '12px 16px',
            backgroundColor: 'rgba(231, 76, 60, 0.95)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <AlertCircle size={20} color="#FFFFFF" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '700', margin: '0 0 2px 0' }}>
                ⚠️ Not at a known job site
              </p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', margin: 0 }}>
                {nearestJob 
                  ? `Nearest: ${nearestJob.job.name} (${(nearestJob.distance / 5280).toFixed(1)} mi)`
                  : 'No job locations available'
                }
              </p>
            </div>
          </div>
        )}

        {/* Job Mismatch Warning - Selected job different from GPS location */}
        {!capturedImage && cameraReady && jobMismatchWarning && nearestJob && (
          <div style={{
            position: 'absolute',
            bottom: '180px',
            left: '16px',
            right: '16px',
            padding: '12px 16px',
            backgroundColor: 'rgba(212, 160, 36, 0.95)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <AlertCircle size={20} color="#FFFFFF" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '700', margin: '0 0 4px 0' }}>
                  Wrong Job Selected?
                </p>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', margin: '0 0 8px 0' }}>
                  GPS shows you're at <strong>{nearestJob.job.name}</strong>, but you selected <strong>{selectedJob?.name}</strong>
                </p>
                <button
                  onClick={() => setSelectedJobId(nearestJob.job.id)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.4)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Switch to {nearestJob.job.name}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Viewfinder guides */}
        {!capturedImage && cameraReady && (
          <div style={{
            position: 'absolute',
            inset: '15%',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '12px',
            pointerEvents: 'none'
          }}>
            {/* Corner markers */}
            <div style={{ position: 'absolute', top: -2, left: -2, width: '20px', height: '20px', borderTop: '3px solid #FFF', borderLeft: '3px solid #FFF', borderRadius: '4px 0 0 0' }} />
            <div style={{ position: 'absolute', top: -2, right: -2, width: '20px', height: '20px', borderTop: '3px solid #FFF', borderRight: '3px solid #FFF', borderRadius: '0 4px 0 0' }} />
            <div style={{ position: 'absolute', bottom: -2, left: -2, width: '20px', height: '20px', borderBottom: '3px solid #FFF', borderLeft: '3px solid #FFF', borderRadius: '0 0 0 4px' }} />
            <div style={{ position: 'absolute', bottom: -2, right: -2, width: '20px', height: '20px', borderBottom: '3px solid #FFF', borderRight: '3px solid #FFF', borderRadius: '0 0 4px 0' }} />
          </div>
        )}

        {/* Voice Room Input Button - Floating on camera view */}
        {!capturedImage && cameraReady && selectedJobId && (
          <div style={{
            position: 'absolute',
            left: '16px',
            bottom: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            {/* Tooltip for voice button */}
            {showVoiceTip && voiceStatus === 'idle' && !isListeningForRoom && (
              <div style={{
                position: 'absolute',
                left: '70px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0,0,0,0.9)',
                padding: '12px 16px',
                borderRadius: '12px',
                maxWidth: '200px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                zIndex: 100
              }}>
                {/* Arrow pointing left */}
                <div style={{
                  position: 'absolute',
                  left: '-8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 0,
                  height: 0,
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid transparent',
                  borderRight: '8px solid rgba(0,0,0,0.9)'
                }} />
                
                <p style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '600', margin: '0 0 4px 0' }}>
                  🎤 Say the Room!
                </p>
                <p style={{ color: '#A0A0A0', fontSize: '11px', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                  Tap the mic and say "Living Room", "Kitchen", etc. to tag your photo.
                </p>
                <button
                  onClick={() => setShowVoiceTip(false)}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: ACCENT_COLOR,
                    border: 'none',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Got it
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setShowVoiceTip(false);
                isListeningForRoom ? stopRoomVoiceInput() : startRoomVoiceInput();
              }}
              onMouseEnter={() => !showVoiceTip && setShowRoomTip(true)}
              onMouseLeave={() => setShowRoomTip(false)}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: isListeningForRoom 
                  ? '#E74C3C' 
                  : voiceStatus === 'success' 
                    ? '#7BAA8E' 
                    : 'rgba(255,255,255,0.2)',
                border: isListeningForRoom ? '3px solid #FF6B6B' : '2px solid rgba(255,255,255,0.4)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: isListeningForRoom 
                  ? '0 0 20px rgba(231, 76, 60, 0.6)' 
                  : '0 4px 12px rgba(0,0,0,0.3)',
                animation: isListeningForRoom ? 'pulse 1.5s infinite' : 'none'
              }}
            >
              {voiceStatus === 'processing' ? (
                <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
              ) : voiceStatus === 'success' ? (
                <Check size={24} />
              ) : isListeningForRoom ? (
                <MicOff size={24} />
              ) : (
                <Mic size={24} />
              )}
            </button>
            
            {/* Hover tooltip */}
            {showRoomTip && !showVoiceTip && voiceStatus === 'idle' && (
              <div style={{
                position: 'absolute',
                left: '70px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0,0,0,0.85)',
                padding: '8px 12px',
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                zIndex: 100
              }}>
                <div style={{
                  position: 'absolute',
                  left: '-6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 0,
                  height: 0,
                  borderTop: '6px solid transparent',
                  borderBottom: '6px solid transparent',
                  borderRight: '6px solid rgba(0,0,0,0.85)'
                }} />
                <p style={{ color: '#FFFFFF', fontSize: '12px', margin: 0 }}>
                  Tap to say room name
                </p>
              </div>
            )}
            
            <span style={{
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: '600',
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              textAlign: 'center',
              maxWidth: '80px'
            }}>
              {isListeningForRoom ? 'Listening...' : 'Say Room'}
            </span>
          </div>
        )}

        {/* Voice Transcript Overlay */}
        {(isListeningForRoom || voiceStatus !== 'idle') && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px 30px',
            backgroundColor: voiceStatus === 'success' 
              ? 'rgba(123, 170, 142, 0.95)' 
              : voiceStatus === 'error'
                ? 'rgba(231, 76, 60, 0.95)'
                : 'rgba(0, 0, 0, 0.9)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
            minWidth: '200px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
          }}>
            {/* Microphone animation */}
            {isListeningForRoom && (
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(231, 76, 60, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                animation: 'pulse 1.5s infinite'
              }}>
                <Mic size={28} color="#E74C3C" />
              </div>
            )}
            
            {voiceStatus === 'success' && (
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <Check size={32} color="#FFFFFF" />
              </div>
            )}

            <p style={{ 
              color: '#FFFFFF', 
              fontSize: isListeningForRoom ? '14px' : '16px',
              fontWeight: '600',
              margin: '0 0 4px 0'
            }}>
              {voiceStatus === 'listening' && 'Say the room name...'}
              {voiceStatus === 'processing' && 'Processing...'}
              {voiceStatus === 'success' && `Room: ${selectedRoom}`}
              {voiceStatus === 'error' && 'Room not recognized'}
            </p>
            
            {voiceTranscript && voiceStatus !== 'success' && (
              <p style={{ 
                color: voiceStatus === 'error' ? '#FFB3B3' : '#A0A0A0', 
                fontSize: '20px',
                fontWeight: '700',
                margin: '8px 0 0 0'
              }}>
                "{voiceTranscript}"
              </p>
            )}

            {voiceStatus === 'error' && voiceTranscript && (
              <div style={{ marginTop: '16px' }}>
                <p style={{ color: '#FFB3B3', fontSize: '12px', margin: '0 0 12px 0' }}>
                  Would you like to add this as a new room?
                </p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button
                    onClick={addVoiceAsNewRoom}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#7BAA8E',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Add "{voiceTranscript}"
                  </button>
                  <button
                    onClick={() => {
                      setVoiceStatus('idle');
                      setVoiceTranscript('');
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Current Room Indicator - Shows selected room on camera view */}
        {!capturedImage && cameraReady && selectedRoom && voiceStatus === 'idle' && (
          <div 
            style={{
              position: 'absolute',
              bottom: '180px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <div style={{
              padding: '8px 16px',
              backgroundColor: 'rgba(123, 170, 142, 0.9)',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Layers size={14} color="#FFFFFF" />
              <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '600' }}>
                {selectedRoom}
              </span>
              <button
                onClick={() => setSelectedRoom('')}
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <X size={10} />
              </button>
            </div>
            <span style={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: '10px',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)'
            }}>
              Room will be tagged to photo
            </span>
          </div>
        )}
      </div>

      {/* Details Panel (shown after capture) */}
      {capturedImage && showDetails && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#1A1A1A',
          borderRadius: '20px 20px 0 0',
          maxHeight: '60%',
          overflowY: 'auto',
          paddingBottom: 'max(20px, env(safe-area-inset-bottom))'
        }}>
          {/* Drag handle */}
          <div style={{
            padding: '12px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '4px',
              backgroundColor: '#3D3D3D',
              borderRadius: '2px'
            }} />
          </div>

          <div style={{ padding: '0 16px 16px' }}>
            {/* Job Selection */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#A0A0A0', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                <Home size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                JOB
                {nearestJob && nearestJob.distance <= GPS_VERIFICATION_THRESHOLD && (
                  <span style={{ 
                    marginLeft: '8px', 
                    color: '#7BAA8E', 
                    fontSize: '10px',
                    backgroundColor: 'rgba(123, 170, 142, 0.2)',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    📍 GPS: {nearestJob.job.name}
                  </span>
                )}
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#2D2D2D',
                  border: `1px solid ${
                    selectedJobId && gpsVerified 
                      ? '#7BAA8E' 
                      : selectedJobId && jobMismatchWarning 
                        ? '#D4A024' 
                        : selectedJobId 
                          ? ACCENT_COLOR 
                          : '#3D3D3D'
                  }`,
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '15px'
                }}
              >
                <option value="">Select Job...</option>
                {jobsWithDistance.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.distance !== null && job.distance <= GPS_VERIFICATION_THRESHOLD && '📍 '}
                    {job.name} - {job.clientName}
                    {job.distance !== null && (
                      job.distance <= GPS_VERIFICATION_THRESHOLD
                        ? ` (${Math.round(job.distance)} ft)`
                        : job.distance < 5280
                          ? ` (${Math.round(job.distance)} ft away)`
                          : ` (${(job.distance / 5280).toFixed(1)} mi away)`
                    )}
                  </option>
                ))}
              </select>
              
              {/* GPS Mismatch Warning in form */}
              {jobMismatchWarning && nearestJob && (
                <div style={{
                  marginTop: '8px',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(212, 160, 36, 0.15)',
                  border: '1px solid #D4A024',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={16} color="#D4A024" />
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#D4A024', fontSize: '12px', fontWeight: '600', margin: 0 }}>
                      GPS shows you're at {nearestJob.job.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedJobId(nearestJob.job.id)}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: '#D4A024',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#000',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Switch
                  </button>
                </div>
              )}
            </div>

            {/* Room & Phase Row */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              {/* Room */}
              <div style={{ flex: 1 }}>
                <label style={{ color: '#A0A0A0', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  <Layers size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  ROOM / AREA
                </label>
                <select
                  value={selectedRoom}
                  onChange={(e) => {
                    if (e.target.value === '__add_new__') {
                      setShowAddRoom(true);
                    } else {
                      setSelectedRoom(e.target.value);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#2D2D2D',
                    border: '1px solid #3D3D3D',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select Room...</option>
                  {roomOptions.map(room => (
                    <option key={room} value={room}>{room}</option>
                  ))}
                  <option value="__add_new__">➕ Add New Room...</option>
                </select>
              </div>

              {/* Phase */}
              <div style={{ flex: 1 }}>
                <label style={{ color: '#A0A0A0', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  <Clock size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  PHASE
                </label>
                <select
                  value={selectedPhase}
                  onChange={(e) => setSelectedPhase(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#2D2D2D',
                    border: '1px solid #3D3D3D',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '14px'
                  }}
                >
                  {PHASE_OPTIONS.map(phase => (
                    <option key={phase} value={phase}>{phase}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Add New Room Modal */}
            {showAddRoom && (
              <div style={{
                marginBottom: '16px',
                padding: '16px',
                backgroundColor: '#252525',
                borderRadius: '12px',
                border: `1px solid ${ACCENT_COLOR}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <label style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}>
                    <Plus size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    Add New Room/Area
                  </label>
                  <button
                    onClick={() => {
                      setShowAddRoom(false);
                      setNewRoomName('');
                    }}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: 'transparent',
                      border: '1px solid #3D3D3D',
                      color: '#A0A0A0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="e.g., Sunroom, Game Room, Closet..."
                    autoFocus
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      backgroundColor: '#1A1A1A',
                      border: '1px solid #3D3D3D',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '14px'
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddRoom();
                      if (e.key === 'Escape') {
                        setShowAddRoom(false);
                        setNewRoomName('');
                      }
                    }}
                  />
                  <button
                    onClick={handleAddRoom}
                    disabled={!newRoomName.trim()}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: newRoomName.trim() ? ACCENT_COLOR : '#3D3D3D',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: newRoomName.trim() ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Add
                  </button>
                </div>
                <p style={{ color: '#666', fontSize: '11px', margin: '8px 0 0 0' }}>
                  This room will be saved for future photos at {selectedJob?.name || 'this job'}
                </p>
              </div>
            )}

            {/* GPS Verification Banner */}
            {location && selectedJob?.latitude && (
              <div style={{
                marginBottom: '16px',
                padding: '12px',
                backgroundColor: gpsVerified ? 'rgba(123, 170, 142, 0.15)' : 'rgba(231, 76, 60, 0.15)',
                border: `1px solid ${gpsVerified ? '#7BAA8E' : '#E74C3C'}`,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: gpsVerified ? '#7BAA8E' : '#E74C3C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <MapPin size={18} color="#FFFFFF" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ 
                    color: gpsVerified ? '#7BAA8E' : '#E74C3C', 
                    fontSize: '13px', 
                    fontWeight: '700', 
                    margin: '0 0 2px 0' 
                  }}>
                    {gpsVerified ? '✓ GPS Verified - On Job Site' : '⚠ GPS Warning - Not On Site'}
                  </p>
                  <p style={{ color: '#A0A0A0', fontSize: '11px', margin: 0 }}>
                    {distanceFromSite !== null && (
                      distanceFromSite < 1000 
                        ? `${Math.round(distanceFromSite)} feet from job location`
                        : `${(distanceFromSite / 5280).toFixed(1)} miles from job location`
                    )}
                  </p>
                </div>
                {!gpsVerified && (
                  <button
                    onClick={getLocation}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'transparent',
                      border: '1px solid #E74C3C',
                      borderRadius: '6px',
                      color: '#E74C3C',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Retry
                  </button>
                )}
              </div>
            )}

            {/* Notes */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ color: '#A0A0A0', fontSize: '12px', fontWeight: '600' }}>
                  NOTES (OPTIONAL)
                </label>
                <button
                  onClick={isRecording ? stopVoiceNote : startVoiceNote}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: isRecording ? '#E74C3C' : '#2D2D2D',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {isRecording ? <MicOff size={12} /> : <Mic size={12} />}
                  {isRecording ? 'Stop' : 'Voice'}
                </button>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this photo..."
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#2D2D2D',
                  border: '1px solid #3D3D3D',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  minHeight: '80px',
                  resize: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={retakePhoto}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: '#2D2D2D',
                  border: '1px solid #3D3D3D',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <RotateCcw size={18} />
                Retake
              </button>
              <button
                onClick={() => {
                  // If GPS mismatch, show confirmation first
                  if (jobMismatchWarning && !gpsVerified) {
                    setShowSaveConfirmation(true);
                  } else {
                    submitPhoto();
                  }
                }}
                disabled={!selectedJobId || isProcessing}
                style={{
                  flex: 2,
                  padding: '14px',
                  backgroundColor: selectedJobId 
                    ? (jobMismatchWarning ? '#D4A024' : ACCENT_COLOR) 
                    : '#3D3D3D',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: selectedJobId ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: isProcessing ? 0.7 : 1
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    Saving...
                  </>
                ) : jobMismatchWarning ? (
                  <>
                    <AlertCircle size={18} />
                    Save Anyway
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Save Photo
                  </>
                )}
              </button>
            </div>
          </div>

          {/* GPS Mismatch Confirmation Modal */}
          {showSaveConfirmation && nearestJob && (
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              zIndex: 100
            }}>
              <div style={{
                backgroundColor: '#1A1A1A',
                borderRadius: '16px',
                padding: '24px',
                maxWidth: '340px',
                width: '100%',
                border: '2px solid #D4A024'
              }}>
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(212, 160, 36, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <AlertCircle size={28} color="#D4A024" />
                </div>
                
                <h3 style={{ 
                  color: '#FFFFFF', 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  textAlign: 'center',
                  margin: '0 0 8px 0'
                }}>
                  Wrong Job Site?
                </h3>
                
                <p style={{ 
                  color: '#A0A0A0', 
                  fontSize: '14px', 
                  textAlign: 'center',
                  margin: '0 0 20px 0',
                  lineHeight: '1.5'
                }}>
                  GPS shows you're at <strong style={{ color: '#7BAA8E' }}>{nearestJob.job.name}</strong>, 
                  but you're saving to <strong style={{ color: '#D4A024' }}>{selectedJob?.name}</strong>.
                </p>

                <div style={{ 
                  backgroundColor: '#252525', 
                  borderRadius: '10px', 
                  padding: '12px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#666', fontSize: '12px' }}>Your location:</span>
                    <span style={{ color: '#7BAA8E', fontSize: '12px', fontWeight: '600' }}>
                      {nearestJob.job.name} ({Math.round(nearestJob.distance)} ft)
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#666', fontSize: '12px' }}>Saving to:</span>
                    <span style={{ color: '#D4A024', fontSize: '12px', fontWeight: '600' }}>
                      {selectedJob?.name}
                      {selectedJob?.latitude && location && (
                        ` (${(calculateDistance(
                          location.latitude, location.longitude,
                          selectedJob.latitude!, selectedJob.longitude!
                        ) / 5280).toFixed(1)} mi)`
                      )}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => {
                      setSelectedJobId(nearestJob.job.id);
                      setShowSaveConfirmation(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '14px',
                      backgroundColor: '#7BAA8E',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#FFFFFF',
                      fontSize: '15px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <MapPin size={18} />
                    Switch to {nearestJob.job.name}
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowSaveConfirmation(false);
                      submitPhoto();
                    }}
                    style={{
                      width: '100%',
                      padding: '14px',
                      backgroundColor: 'transparent',
                      border: '1px solid #D4A024',
                      borderRadius: '10px',
                      color: '#D4A024',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Save to {selectedJob?.name} Anyway
                  </button>
                  
                  <button
                    onClick={() => setShowSaveConfirmation(false)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#666',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Camera Controls (shown when camera is active) */}
      {!capturedImage && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px',
          paddingBottom: 'max(30px, env(safe-area-inset-bottom))',
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Quick job select */}
          <div style={{ marginBottom: '20px' }}>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: `2px solid ${
                  selectedJobId && gpsVerified 
                    ? '#7BAA8E' 
                    : selectedJobId && jobMismatchWarning 
                      ? '#D4A024' 
                      : selectedJobId 
                        ? ACCENT_COLOR 
                        : 'rgba(255,255,255,0.2)'
                }`,
                borderRadius: '12px',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: '500'
              }}
            >
              <option value="">
                {nearestJob && nearestJob.distance <= GPS_VERIFICATION_THRESHOLD 
                  ? `📍 Select Job (GPS: ${nearestJob.job.name})`
                  : 'Select Job...'}
              </option>
              {jobsWithDistance.map(job => (
                <option key={job.id} value={job.id}>
                  {job.distance !== null && job.distance <= GPS_VERIFICATION_THRESHOLD && '📍 '}
                  {job.name}
                  {job.distance !== null && (
                    job.distance <= GPS_VERIFICATION_THRESHOLD
                      ? ` ✓`
                      : job.distance < 5280
                        ? ` (${Math.round(job.distance)} ft)`
                        : ` (${(job.distance / 5280).toFixed(1)} mi)`
                  )}
                </option>
              ))}
            </select>
          </div>

          {/* Camera buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around'
          }}>
            {/* Flash toggle */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={toggleFlash}
                disabled={!hasFlash}
                onMouseEnter={() => setShowFlashTip(true)}
                onMouseLeave={() => setShowFlashTip(false)}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: flashEnabled ? '#FFD700' : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: flashEnabled ? '#000' : '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: hasFlash ? 'pointer' : 'not-allowed',
                  opacity: hasFlash ? 1 : 0.3
                }}
              >
                {flashEnabled ? <Zap size={24} /> : <ZapOff size={24} />}
              </button>
              
              {/* Flash tooltip */}
              {showFlashTip && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginBottom: '8px',
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  whiteSpace: 'nowrap',
                  zIndex: 100
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: '-5px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '5px solid transparent',
                    borderRight: '5px solid transparent',
                    borderTop: '5px solid rgba(0,0,0,0.9)'
                  }} />
                  <p style={{ color: '#FFFFFF', fontSize: '11px', margin: 0 }}>
                    {hasFlash 
                      ? (flashEnabled ? 'Flash On' : 'Flash Off')
                      : 'Flash not available'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Capture button */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={capturePhoto}
                disabled={!cameraReady || !selectedJobId}
                onMouseEnter={() => !selectedJobId && setShowCaptureTip(true)}
                onMouseLeave={() => setShowCaptureTip(false)}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: selectedJobId ? '#FFFFFF' : '#666',
                  border: `4px solid ${selectedJobId ? ACCENT_COLOR : '#444'}`,
                  cursor: cameraReady && selectedJobId ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.1s',
                  transform: 'scale(1)'
                }}
                onTouchStart={(e) => {
                  if (cameraReady && selectedJobId) {
                    e.currentTarget.style.transform = 'scale(0.95)';
                  }
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: selectedJobId ? ACCENT_COLOR : '#555'
                }} />
              </button>
              
              {/* Capture tooltip when disabled */}
              {showCaptureTip && !selectedJobId && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginBottom: '12px',
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  maxWidth: '180px',
                  textAlign: 'center',
                  zIndex: 100
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid rgba(0,0,0,0.9)'
                  }} />
                  <p style={{ color: '#FFD700', fontSize: '12px', fontWeight: '600', margin: 0 }}>
                    Select a job first to enable capture
                  </p>
                </div>
              )}
            </div>

            {/* Switch camera */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={switchCamera}
                onMouseEnter={() => setShowSwitchTip(true)}
                onMouseLeave={() => setShowSwitchTip(false)}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <SwitchCamera size={24} />
              </button>
              
              {/* Switch camera tooltip */}
              {showSwitchTip && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginBottom: '8px',
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  whiteSpace: 'nowrap',
                  zIndex: 100
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: '-5px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '5px solid transparent',
                    borderRight: '5px solid transparent',
                    borderTop: '5px solid rgba(0,0,0,0.9)'
                  }} />
                  <p style={{ color: '#FFFFFF', fontSize: '11px', margin: 0 }}>
                    {facingMode === 'environment' ? 'Switch to front camera' : 'Switch to back camera'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Help text */}
          {!selectedJobId && nearestJob && nearestJob.distance <= GPS_VERIFICATION_THRESHOLD && (
            <p style={{
              color: '#7BAA8E',
              fontSize: '13px',
              textAlign: 'center',
              marginTop: '16px'
            }}>
              📍 You're at {nearestJob.job.name} - select it above to take photos
            </p>
          )}
          {!selectedJobId && (!nearestJob || nearestJob.distance > GPS_VERIFICATION_THRESHOLD) && (
            <p style={{
              color: '#FFD700',
              fontSize: '13px',
              textAlign: 'center',
              marginTop: '16px'
            }}>
              ⚠️ Select a job to enable capture
            </p>
          )}
          {selectedJobId && jobMismatchWarning && nearestJob && (
            <p style={{
              color: '#D4A024',
              fontSize: '13px',
              textAlign: 'center',
              marginTop: '16px'
            }}>
              ⚠️ GPS shows you're at {nearestJob.job.name}, not {selectedJob?.name}
            </p>
          )}
          {selectedJobId && gpsVerified && (
            <p style={{
              color: '#7BAA8E',
              fontSize: '13px',
              textAlign: 'center',
              marginTop: '16px'
            }}>
              ✓ GPS verified at {selectedJob?.name}
            </p>
          )}
        </div>
      )}

      {/* CSS for animations and mobile optimizations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7); }
          50% { transform: scale(1.05); }
          70% { box-shadow: 0 0 0 15px rgba(231, 76, 60, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
        }
        
        /* Prevent zoom on input focus (iOS Safari) */
        input, select, textarea {
          font-size: 16px !important;
        }
        
        /* Touch feedback for buttons */
        button:active {
          opacity: 0.8;
          transform: scale(0.98);
        }
        
        /* Smooth scrolling */
        * {
          -webkit-overflow-scrolling: touch;
        }
        
        /* Disable text selection on buttons */
        button {
          -webkit-user-select: none;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
}
