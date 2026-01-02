import { useState } from 'react';
import { 
  ArrowLeft, Zap, ZapOff, Camera, Video, Image, 
  TrendingUp, CloudOff, Check 
} from 'lucide-react';
import { Job, MediaItem } from '../App';
import { MediaCarousel } from './MediaCarousel';
import { PhotoReminderBanner } from './PhotoReminderBanner';
import { RoomSelectionModal, Room } from './RoomSelectionModal';

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
  const [showRoomSelection, setShowRoomSelection] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Mock GPS coordinates
  const [gpsCoords] = useState({ lat: 40.7128, lng: -74.0060 });

  const handleRoomSelection = (room: Room) => {
    setSelectedRoom(room);
    setShowRoomSelection(false);
    // Trigger the actual capture with room information
    performCapture();
  };

  const performCapture = () => {
    if (mode === 'photo') {
      setIsCapturing(true);
      
      // Mock photo capture
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
            room: selectedRoom, // Add room information
            reverseGeocode: job.address,
            aiRoomDetection: selectedRoom || detectRoom(),
            tags: [],
          },
        });
        setIsCapturing(false);
        setSelectedRoom(null);
      }, 200);
    } else {
      // Video capture logic remains the same
      // ... existing video capture code
    }
  };

  const handleCapture = () => {
    if (mode === 'video') {
      // Existing video capture logic
      // ... 
    } else {
      // For photos, show room selection first
      setShowRoomSelection(true);
    }
  };

  // Existing helper methods remain the same
  const generateMockPhoto = () => { /* ... */ };
  const detectRoom = () => { /* ... */ };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Existing Viewfinder UI */}
      {/* ... other components ... */}

      {/* Room Selection Modal */}
      <RoomSelectionModal 
        isVisible={showRoomSelection}
        onRoomSelect={handleRoomSelection}
        onClose={() => setShowRoomSelection(false)}
      />
    </div>
  );
}
