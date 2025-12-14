import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Zap, ZapOff, Camera, Video, Image, TrendingUp, CloudOff, Check } from 'lucide-react';
import { Job, MediaItem } from '../App';
import { MediaCarousel } from './MediaCarousel';
import { PhotoReminderBanner } from './PhotoReminderBanner';

type CameraMode = 'photo' | 'video';

type CameraViewfinderProps = {
  job: Job;
  recentMedia: MediaItem[];
  isOffline: boolean;
  onCapture: (media: Partial<MediaItem>) => void;
  onBack: () => void;
  onViewProgressStory: () => void;
  onViewCollections: () => void;
};

export function CameraViewfinder({
  job,
  recentMedia,
  isOffline,
  onCapture,
  onBack,
  onViewProgressStory,
  onViewCollections,
}: CameraViewfinderProps) {
  const [mode, setMode] = useState<CameraMode>('photo');
  const [flash, setFlash] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock GPS coordinates
  const [gpsCoords] = useState({ lat: 40.7128, lng: -74.0060 });

  // Simulated camera stream
  useEffect(() => {
    if (videoRef.current) {
      // In a real app, this would use navigator.mediaDevices.getUserMedia()
      // For now, we'll show a placeholder
    }
  }, []);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleCapture = () => {
    if (mode === 'video') {
      if (isRecording) {
        // Stop recording
        setIsRecording(false);
        // Mock video capture
        const mockVideoUrl = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80';
        onCapture({
          type: 'video',
          url: mockVideoUrl,
          thumbnail: mockVideoUrl,
          metadata: {
            clientName: job.clientName,
            jobName: job.jobName,
            address: job.address,
            gps: gpsCoords,
            reverseGeocode: job.address,
            aiRoomDetection: detectRoom(),
            tags: [],
          },
        });
      } else {
        // Start recording
        setIsRecording(true);
      }
    } else {
      // Photo capture with animation
      setIsCapturing(true);
      
      // Mock photo capture - simulate AI room detection
      setTimeout(() => {
        const mockPhotoUrl = generateMockPhoto();
        onCapture({
          type: 'photo',
          url: mockPhotoUrl,
          thumbnail: mockPhotoUrl,
          metadata: {
            clientName: job.clientName,
            jobName: job.jobName,
            address: job.address,
            gps: gpsCoords,
            reverseGeocode: job.address,
            aiRoomDetection: detectRoom(),
            tags: [],
          },
        });
        setIsCapturing(false);
      }, 200);
    }
  };

  const generateMockPhoto = () => {
    const floorPhotos = [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      'https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    ];
    return floorPhotos[Math.floor(Math.random() * floorPhotos.length)];
  };

  const detectRoom = () => {
    const rooms = ['Living Room', 'Kitchen', 'Hallway', 'Bedroom', 'Stairs', 'Exterior'];
    return rooms[Math.floor(Math.random() * rooms.length)];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const needsPhotoToday = recentMedia.filter(m => {
    const today = new Date().toDateString();
    return m.timestamp.toDateString() === today;
  }).length === 0;

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Top Bar */}
      <div className="relative z-10 bg-gradient-to-b from-black/60 to-transparent">
        {/* Controls Row */}
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white active:bg-black/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {/* Flash Toggle */}
            <button
              onClick={() => setFlash(!flash)}
              className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center text-white ${
                flash ? 'bg-[#3B9CAA]' : 'bg-black/30'
              }`}
            >
              {flash ? <Zap className="w-5 h-5" /> : <ZapOff className="w-5 h-5" />}
            </button>

            {/* Photo/Video Toggle */}
            <div className="flex bg-black/30 backdrop-blur-sm rounded-full p-1">
              <button
                onClick={() => setMode('photo')}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  mode === 'photo' ? 'bg-[#3B9CAA] text-white' : 'text-white/70'
                }`}
              >
                Photo
              </button>
              <button
                onClick={() => setMode('video')}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  mode === 'video' ? 'bg-[#3B9CAA] text-white' : 'text-white/70'
                }`}
              >
                Video
              </button>
            </div>
          </div>
        </div>

        {/* Job Info */}
        <div className="px-4 pb-3">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2">
            <p className="text-white text-sm">
              {job.clientName} → {job.jobName}
            </p>
            <p className="text-white/70 text-xs mt-0.5">{job.address}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1 text-xs text-white/60">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                GPS Active
              </div>
              {isOffline && (
                <div className="flex items-center gap-1 text-xs text-amber-400">
                  <CloudOff className="w-3 h-3" />
                  Offline
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Camera Viewfinder */}
      <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
        {/* Mock Camera View */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <Camera className="w-24 h-24 text-gray-600" />
        </div>
        
        {/* Flash Effect */}
        {isCapturing && (
          <div className="absolute inset-0 bg-white animate-pulse"></div>
        )}

        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm">{formatTime(recordingTime)}</span>
          </div>
        )}

        {/* Calibration Info */}
        {job.calibration && (
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1">
            <Check className="w-3 h-3 text-green-400" />
            {job.calibration.method === 'ar' && 'AR Calibrated'}
            {job.calibration.method === 'ai-board' && 'AI Calibrated'}
            {job.calibration.method === 'manual' && 'Manual Scale'}
          </div>
        )}
      </div>

      {/* Photo Reminder Banner */}
      {needsPhotoToday && (
        <PhotoReminderBanner clientName={job.clientName} />
      )}

      {/* Bottom Controls */}
      <div className="relative z-10 bg-gradient-to-t from-black/60 to-transparent pb-8">
        {/* Recent Media Carousel */}
        {recentMedia.length > 0 && (
          <div className="px-4 py-3">
            <MediaCarousel
              mediaItems={recentMedia.slice(-7)}
              onMediaClick={(item) => {
                // In real app, would open media viewer
                console.log('Media clicked:', item);
              }}
            />
          </div>
        )}

        {/* Shutter Button */}
        <div className="flex items-center justify-center gap-8 px-4 py-4">
          <button
            onClick={onViewCollections}
            className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white"
          >
            <Image className="w-5 h-5" />
          </button>

          {/* Main Shutter */}
          <button
            onClick={handleCapture}
            disabled={isCapturing}
            className={`w-20 h-20 rounded-full relative active:scale-95 transition-transform disabled:opacity-50 ${
              isRecording ? 'bg-red-500' : 'bg-[#3B9CAA]'
            }`}
            style={{
              boxShadow: '0 0 0 4px rgba(255,255,255,0.3), 0 8px 16px rgba(0,0,0,0.3)',
            }}
          >
            {mode === 'video' ? (
              isRecording ? (
                <div className="w-8 h-8 bg-white rounded-sm m-auto"></div>
              ) : (
                <Video className="w-8 h-8 text-white m-auto" />
              )
            ) : (
              <Camera className="w-8 h-8 text-white m-auto" />
            )}
            
            {/* Glossy effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent"></div>
          </button>

          <button
            onClick={onViewProgressStory}
            className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white"
          >
            <TrendingUp className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hidden elements for real camera implementation */}
      <video ref={videoRef} className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
