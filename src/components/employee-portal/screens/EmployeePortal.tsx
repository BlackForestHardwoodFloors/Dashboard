import { useState } from 'react';
import { MyJobScreen } from './screens/MyJobScreen';
import { SafetyGrowthScreen } from '../SafetyGrowthScreen';
import CameraCaptureScreen from './screens/CameraCaptureScreen';
import { EmployeePhotosScreen } from '../EmployeePhotosScreen';
import { EmployeeMessagesScreen } from './EmployeeMessagesScreen';
import { WorkOrderScreen } from './screens/WorkOrderScreen';
import { JobBriefingScreen } from './screens/JobBriefingScreen';
import { ThemeProvider, useTheme, ThemeToggleButton } from './ThemeProvider';

type Tab = 'jobs' | 'photos' | 'messages' | 'me' | 'p4p' | 'timesheet' | 'workorder' | 'briefing';

// CompanyCam Blue Color
const CAMERA_BLUE = '#00A3FF';

// Sample jobs (in production, fetch from API)
const initialJobs = [
  { 
    id: 'job-001', 
    name: 'Anderson Residence', 
    clientName: 'John Anderson', 
    address: '5678 E Appleway Blvd',
    latitude: 47.6588,
    longitude: -117.4260,
    rooms: ['Living Room', 'Kitchen', 'Master Bedroom', 'Hallway']
  },
  { 
    id: 'job-002', 
    name: 'Thompson Office', 
    clientName: 'Sarah Thompson', 
    address: '9012 W Seltice Way',
    latitude: 47.6739,
    longitude: -117.4186,
    rooms: ['Main Lobby', 'Conference Room A', 'Conference Room B', 'Executive Office', 'Break Room']
  },
  { 
    id: 'job-003', 
    name: 'Wilson Home', 
    clientName: 'Mike Wilson', 
    address: '1122 W Northwest Blvd',
    latitude: 47.6901,
    longitude: -117.3963,
    rooms: []
  },
];

// Sample photos (in production, fetch from API)
const initialPhotos = [
  {
    id: 'photo-1',
    url: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=400',
    jobId: 'job-001',
    jobName: 'Anderson Residence',
    employeeName: 'Mike Johnson',
    employeeAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    timestamp: 'Dec 20, 2024, 2:30 PM',
    room: 'Living Room',
    phase: 'Before',
    type: 'Progress Shot',
    tags: [],
    notes: 'Starting point for living room installation',
    showInClientPortal: true,
    isProblemArea: false,
    gpsVerified: true,
    isFavorite: false,
    hasNewNotes: false
  },
  {
    id: 'photo-2',
    url: 'https://images.unsplash.com/photo-1560185008-b033106af5c3?w=400',
    jobId: 'job-001',
    jobName: 'Anderson Residence',
    employeeName: 'Mike Johnson',
    employeeAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    timestamp: 'Dec 20, 2024, 3:15 PM',
    room: 'Kitchen',
    phase: 'Install',
    type: 'Progress Shot',
    tags: [],
    notes: '',
    showInClientPortal: false,
    isProblemArea: false,
    gpsVerified: true,
    isFavorite: true,
    hasNewNotes: false
  },
  {
    id: 'photo-3',
    url: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400',
    jobId: 'job-002',
    jobName: 'Thompson Office',
    employeeName: 'Carlos Martinez',
    employeeAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    timestamp: 'Dec 19, 2024, 10:00 AM',
    room: 'Main Lobby',
    phase: 'Before',
    type: 'Progress Shot',
    tags: [],
    notes: 'Lobby area before work begins',
    showInClientPortal: true,
    isProblemArea: false,
    gpsVerified: true,
    isFavorite: false,
    hasNewNotes: true
  },
  {
    id: 'photo-4',
    url: 'https://images.unsplash.com/photo-1560185127-6a8c1f1d9e2b?w=400',
    jobId: 'job-001',
    jobName: 'Anderson Residence',
    employeeName: 'Mike Johnson',
    employeeAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    timestamp: 'Dec 18, 2024, 4:45 PM',
    room: 'Hallway',
    phase: 'Problem Area',
    type: 'Problem Area',
    tags: ['subfloor', 'repair needed'],
    notes: 'Found damaged subfloor near bathroom entrance. Needs repair before installation.',
    showInClientPortal: false,
    isProblemArea: true,
    gpsVerified: false,
    isFavorite: false,
    hasNewNotes: true
  }
];

// Inner component that uses theme
function EmployeePortalInner({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { colors, employeeColor } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('jobs');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photos, setPhotos] = useState(initialPhotos);
  const [jobs, setJobs] = useState(initialJobs);
  const [filterJobId, setFilterJobId] = useState<string | undefined>(undefined);
  const [workOrderJobId, setWorkOrderJobId] = useState<string | undefined>(undefined);
  const [briefingJobId, setBriefingJobId] = useState<string | undefined>(undefined);

  const currentEmployee = {
    name: 'Mike Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  const handleAddRoom = (jobId: string, roomName: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, rooms: [...(job.rooms || []), roomName] }
        : job
    ));
    console.log(`Added room "${roomName}" to job ${jobId}`);
  };

  const handlePhotoTaken = (photoData: {
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
    gpsSuggestedJobId?: string;
  }) => {
    const job = jobs.find(j => j.id === photoData.jobId);
    const gpsSuggestedJob = photoData.gpsSuggestedJobId 
      ? jobs.find(j => j.id === photoData.gpsSuggestedJobId) 
      : null;
    const now = new Date();

    const newPhoto = {
      id: `photo-${Date.now()}`,
      url: photoData.imageData,
      jobId: photoData.jobId,
      jobName: job?.name || 'Unknown Job',
      employeeName: currentEmployee.name,
      employeeAvatar: currentEmployee.avatar,
      timestamp: now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      room: photoData.room || 'Unspecified',
      phase: photoData.phase,
      type: photoData.phase === 'Problem Area' ? 'Problem Area' : 'Progress Shot',
      tags: [] as string[],
      notes: photoData.notes,
      showInClientPortal: false,
      isProblemArea: photoData.phase === 'Problem Area',
      gpsVerified: photoData.gpsVerified,
      latitude: photoData.latitude,
      longitude: photoData.longitude,
      distanceFromSite: photoData.distanceFromSite,
      gpsMismatch: !!photoData.gpsSuggestedJobId,
      gpsSuggestedJobName: gpsSuggestedJob?.name,
      isFavorite: false,
      hasNewNotes: !!photoData.notes
    };

    setPhotos(prev => [newPhoto, ...prev]);
    
    if (photoData.gpsSuggestedJobId) {
      console.warn(`GPS Mismatch: Photo saved to ${job?.name} but GPS suggested ${gpsSuggestedJob?.name}`);
    }
  };

  const openCamera = (jobId?: string) => {
    if (jobId) setFilterJobId(jobId);
    setIsCameraOpen(true);
  };

  const openPhotos = (jobId?: string) => {
    if (jobId) setFilterJobId(jobId);
    setActiveTab('photos');
  };

  const openWorkOrder = (jobId?: string) => {
    if (jobId) setWorkOrderJobId(jobId);
    setActiveTab('workorder');
  };

  const openBriefing = (jobId?: string) => {
    if (jobId) setBriefingJobId(jobId);
    setActiveTab('briefing');
  };

  // Handle internal navigation for employee portal screens
  const handleInternalNavigate = (page: string, jobId?: string) => {
    if (page === 'P4P Growth') {
      setActiveTab('p4p');
    } else if (page === 'Photos') {
      setActiveTab('photos');
    } else if (page === 'Time Sheet') {
      setActiveTab('timesheet');
    } else if (page === 'Work Order') {
      if (jobId) setWorkOrderJobId(jobId);
      setActiveTab('workorder');
    } else if (page === 'Job Briefing') {
      if (jobId) setBriefingJobId(jobId);
      setActiveTab('briefing');
    } else {
      // Pass other navigation to parent
      onNavigate?.(page);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: colors.background,
      transition: 'background-color 0.3s ease'
    }}>
      {/* Theme Toggle in corner */}
      <div style={{
        position: 'fixed',
        top: 'max(12px, env(safe-area-inset-top))',
        right: '12px',
        zIndex: 1000
      }}>
        <ThemeToggleButton />
      </div>

      {/* Tab Content */}
      {activeTab === 'jobs' && (
        <MyJobScreen
          onOpenCamera={openCamera}
          onOpenPhotos={openPhotos}
          onOpenWorkOrder={openWorkOrder}
          onOpenBriefing={openBriefing}
          onTabChange={handleTabChange}
          onNavigate={handleInternalNavigate}
        />
      )}

      {activeTab === 'photos' && (
        <div style={{ position: 'relative' }}>
          {/* Back to Portal button */}
          <button
            onClick={() => {
              setActiveTab('jobs');
              setFilterJobId(undefined);
            }}
            style={{
              position: 'fixed',
              top: '12px',
              left: '12px',
              zIndex: 1000,
              padding: '10px 16px',
              backgroundColor: '#4F6A41',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            ← Back
          </button>
          <EmployeePhotosScreen
            photos={photos}
            jobs={jobs.map(j => ({ id: j.id, name: j.name }))}
            onTakePhoto={() => setIsCameraOpen(true)}
            filterJobId={filterJobId}
          />
        </div>
      )}

      {activeTab === 'messages' && (
        <div style={{ position: 'relative' }}>
          {/* Back to Portal button */}
          <button
            onClick={() => setActiveTab('jobs')}
            style={{
              position: 'fixed',
              top: '12px',
              left: '12px',
              zIndex: 1000,
              padding: '10px 16px',
              backgroundColor: '#4F6A41',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            ← Back
          </button>
          <EmployeeMessagesScreen 
            onOpenConversation={(id) => console.log('Open conversation:', id)}
          />
        </div>
      )}

      {activeTab === 'me' && (
        <div style={{ position: 'relative' }}>
          {/* Back to Portal button */}
          <button
            onClick={() => setActiveTab('jobs')}
            style={{
              position: 'fixed',
              top: '12px',
              left: '12px',
              zIndex: 1000,
              padding: '10px 16px',
              backgroundColor: '#4F6A41',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            ← Back
          </button>
          <div style={{ padding: '80px 20px 120px', textAlign: 'center' }}>
            {/* Profile Avatar */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: employeeColor,
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: '700',
              color: '#FFFFFF'
            }}>
              MJ
            </div>
            <h2 style={{ color: colors.text, marginBottom: '4px' }}>Mike Johnson</h2>
            <p style={{ color: colors.textSecondary, marginBottom: '32px' }}>Technician</p>
            
            {/* Profile Menu Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
              <ProfileMenuItem 
                icon="⏱️" 
                label="Time Tracking" 
                colors={colors}
                onClick={() => console.log('Time Tracking')}
              />
              <ProfileMenuItem 
                icon="👷" 
                label="Team Activity" 
                colors={colors}
                onClick={() => console.log('Team Activity')}
              />
              <ProfileMenuItem 
                icon="🛡️" 
                label="Safety & Growth" 
                colors={colors}
                onClick={() => console.log('Safety')}
              />
              <ProfileMenuItem 
                icon="⚙️" 
                label="Settings" 
                colors={colors}
                onClick={() => console.log('Settings')}
              />
            </div>
          </div>
        </div>
      )}

      {/* P4P & Growth Screen */}
      {activeTab === 'p4p' && (
        <div style={{ position: 'relative' }}>
          {/* Back to Portal button */}
          <button
            onClick={() => setActiveTab('jobs')}
            style={{
              position: 'fixed',
              top: '12px',
              left: '12px',
              zIndex: 1000,
              padding: '10px 16px',
              backgroundColor: '#2E7D32',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            ← Back
          </button>
          <SafetyGrowthScreen />
        </div>
      )}

      {/* Time Sheet Screen */}
      {activeTab === 'timesheet' && (
        <div style={{ position: 'relative' }}>
          {/* Back to Portal button */}
          <button
            onClick={() => setActiveTab('jobs')}
            style={{
              position: 'fixed',
              top: '12px',
              left: '12px',
              zIndex: 1000,
              padding: '10px 16px',
              backgroundColor: '#D76A6A',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            ← Back
          </button>
          <div style={{ 
            padding: '80px 20px 120px', 
            minHeight: '100vh',
            backgroundColor: colors.background 
          }}>
            <h2 style={{ 
              color: colors.text, 
              fontSize: '24px', 
              fontWeight: '700',
              marginBottom: '24px'
            }}>
              Time Sheet
            </h2>
            
            {/* Current Week Summary */}
            <div style={{
              backgroundColor: colors.backgroundSecondary,
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px',
              border: `1px solid ${colors.border}`
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <span style={{ color: colors.textSecondary, fontSize: '14px' }}>This Week</span>
                <span style={{ color: '#D76A6A', fontSize: '14px', fontWeight: '600' }}>Dec 30 - Jan 5</span>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr 1fr', 
                gap: '16px',
                textAlign: 'center'
              }}>
                <div>
                  <p style={{ color: colors.text, fontSize: '28px', fontWeight: '700', margin: 0 }}>32.5</p>
                  <p style={{ color: colors.textSecondary, fontSize: '12px', margin: '4px 0 0 0' }}>Hours Logged</p>
                </div>
                <div>
                  <p style={{ color: colors.text, fontSize: '28px', fontWeight: '700', margin: 0 }}>4</p>
                  <p style={{ color: colors.textSecondary, fontSize: '12px', margin: '4px 0 0 0' }}>Jobs Worked</p>
                </div>
                <div>
                  <p style={{ color: '#4F6A41', fontSize: '28px', fontWeight: '700', margin: 0 }}>7.5</p>
                  <p style={{ color: colors.textSecondary, fontSize: '12px', margin: '4px 0 0 0' }}>Remaining</p>
                </div>
              </div>
            </div>

            {/* Today's Entry */}
            <div style={{
              backgroundColor: colors.backgroundSecondary,
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px',
              border: `2px solid #D76A6A`
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <span style={{ color: colors.text, fontSize: '16px', fontWeight: '600' }}>Today</span>
                <span style={{ 
                  backgroundColor: '#D76A6A', 
                  color: '#fff', 
                  padding: '4px 12px', 
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Active
                </span>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <p style={{ color: colors.textSecondary, fontSize: '12px', margin: '0 0 4px 0' }}>Current Job</p>
                <p style={{ color: colors.text, fontSize: '16px', fontWeight: '600', margin: 0 }}>Anderson Residence</p>
              </div>
              
              <div style={{ display: 'flex', gap: '20px' }}>
                <div>
                  <p style={{ color: colors.textSecondary, fontSize: '12px', margin: '0 0 4px 0' }}>Clock In</p>
                  <p style={{ color: colors.text, fontSize: '14px', fontWeight: '600', margin: 0 }}>8:00 AM</p>
                </div>
                <div>
                  <p style={{ color: colors.textSecondary, fontSize: '12px', margin: '0 0 4px 0' }}>Duration</p>
                  <p style={{ color: '#D76A6A', fontSize: '14px', fontWeight: '600', margin: 0 }}>4h 32m</p>
                </div>
              </div>
            </div>

            {/* Clock Out Button */}
            <button
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#D76A6A',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              ⏱️ Clock Out
            </button>
          </div>
        </div>
      )}

      {/* Work Order Screen */}
      {activeTab === 'workorder' && (
        <WorkOrderScreen
          onClose={() => {
            setActiveTab('jobs');
            setWorkOrderJobId(undefined);
          }}
          jobId={workOrderJobId}
          colors={colors}
        />
      )}

      {/* Job Briefing Screen */}
      {activeTab === 'briefing' && (
        <JobBriefingScreen
          onClose={() => {
            setActiveTab('jobs');
            setBriefingJobId(undefined);
          }}
          jobId={briefingJobId}
        />
      )}

      {/* Camera Screen */}
      <CameraCaptureScreen
        isOpen={isCameraOpen}
        onClose={() => {
          setIsCameraOpen(false);
          setFilterJobId(undefined);
        }}
        onPhotoTaken={handlePhotoTaken}
        jobs={jobs}
        currentJobId={filterJobId}
        onAddRoom={handleAddRoom}
      />
    </div>
  );
}

// Profile Menu Item Component
function ProfileMenuItem({ icon, label, colors, onClick }: { 
  icon: string; 
  label: string; 
  colors: any;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '16px',
        backgroundColor: colors.backgroundSecondary,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        color: colors.text,
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '20px' }}>{icon}</span>
        {label}
      </span>
      <span style={{ color: colors.textTertiary }}>→</span>
    </button>
  );
}

// Main export with ThemeProvider wrapper
export function EmployeePortal({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return (
    <ThemeProvider defaultTheme="dark">
      <EmployeePortalInner onNavigate={onNavigate} />
    </ThemeProvider>
  );
}
