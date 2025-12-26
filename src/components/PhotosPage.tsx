import React, { useState, useEffect } from 'react';
import { 
  Camera,
  Search,
  Filter,
  Grid,
  List,
  Upload,
  Download,
  Trash2,
  Star,
  Eye,
  EyeOff,
  MapPin,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Minimize2,
  Check,
  AlertCircle,
  FolderOpen,
  Image as ImageIcon,
  Menu,
  Edit3,
  Pencil,
  MessageCircle,
  Bell,
  CheckCheck
} from 'lucide-react';
import { SidebarEnhanced } from './SidebarEnhanced';
import PhotoCard from './PhotoCard';
import PhotoDetailModal from './PhotoDetailModal';
import PhotoAnnotationEditor from './PhotoAnnotationEditor';
import CameraCaptureScreen from './CameraCaptureScreen';

// Photos page accent color (matches sidebar)
const PHOTOS_ACCENT = '#0F7BFF';

interface Photo {
  id: string;
  url: string;
  jobId: string;
  jobName: string;
  employeeName: string;
  employeeAvatar: string;
  timestamp: string;
  room: string;
  phase: string;
  type: string;
  tags: string[];
  notes: string;
  aiSummary: string;
  showInClientPortal: boolean;
  isProblemArea: boolean;
  problemType?: string;
  gpsVerified: boolean;
  latitude?: number;
  longitude?: number;
  isFavorite: boolean;
  hasNewNotes?: boolean;
  notesUpdatedAt?: string;
  notesUpdatedBy?: string;
}

// Sample photos data
const samplePhotos: Photo[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    jobId: 'job-001',
    jobName: 'Anderson Residence',
    employeeName: 'Mike Johnson',
    employeeAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    timestamp: 'Dec 20, 2025 9:30 AM',
    room: 'Living Room',
    phase: 'Before',
    type: 'Progress Shot',
    tags: ['hardwood', 'oak', 'refinish'],
    notes: 'Initial condition before sanding',
    aiSummary: 'Oak hardwood flooring showing wear patterns and scratches. Approximately 800 sq ft of coverage.',
    showInClientPortal: true,
    isProblemArea: false,
    gpsVerified: true,
    latitude: 47.6588,
    longitude: -117.4260,
    isFavorite: true,
    hasNewNotes: true,
    notesUpdatedAt: 'Dec 20, 2025 10:15 AM',
    notesUpdatedBy: 'Mike Johnson'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    jobId: 'job-001',
    jobName: 'Anderson Residence',
    employeeName: 'Mike Johnson',
    employeeAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    timestamp: 'Dec 20, 2025 11:15 AM',
    room: 'Living Room',
    phase: 'Sanding',
    type: 'Progress Shot',
    tags: ['sanding', 'dust-free'],
    notes: 'First pass complete with 60 grit',
    aiSummary: 'Sanding in progress. Surface showing consistent removal of old finish.',
    showInClientPortal: false,
    isProblemArea: false,
    gpsVerified: true,
    latitude: 47.6588,
    longitude: -117.4260,
    isFavorite: false,
    hasNewNotes: false
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    jobId: 'job-002',
    jobName: 'Thompson Office',
    employeeName: 'Sarah Davis',
    employeeAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    timestamp: 'Dec 19, 2025 2:00 PM',
    room: 'Main Hall',
    phase: 'Install',
    type: 'Progress Shot',
    tags: ['vinyl', 'commercial', 'lvp'],
    notes: 'New LVP installation starting',
    aiSummary: 'Commercial vinyl plank being installed in main hallway. Pattern aligned correctly.',
    showInClientPortal: true,
    isProblemArea: false,
    gpsVerified: true,
    latitude: 47.6739,
    longitude: -117.4186,
    isFavorite: false,
    hasNewNotes: false
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    jobId: 'job-001',
    jobName: 'Anderson Residence',
    employeeName: 'Mike Johnson',
    employeeAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    timestamp: 'Dec 20, 2025 3:45 PM',
    room: 'Kitchen',
    phase: 'Before',
    type: 'Problem Area',
    tags: ['water-damage', 'repair-needed'],
    notes: 'Water damage found near dishwasher. Subfloor is soft and needs replacement before proceeding.',
    aiSummary: 'Water damage detected. Subfloor may need replacement in 3x4 ft area.',
    showInClientPortal: false,
    isProblemArea: true,
    problemType: 'Water Damage - Subfloor affected',
    gpsVerified: true,
    latitude: 47.6588,
    longitude: -117.4260,
    isFavorite: false,
    hasNewNotes: true,
    notesUpdatedAt: 'Dec 20, 2025 4:00 PM',
    notesUpdatedBy: 'Mike Johnson'
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    jobId: 'job-003',
    jobName: 'Wilson Home',
    employeeName: 'Tom Martinez',
    employeeAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    timestamp: 'Dec 18, 2025 10:00 AM',
    room: 'Master Bedroom',
    phase: 'After',
    type: 'Final Shot',
    tags: ['complete', 'stain', 'ebony'],
    notes: 'Job complete - ebony stain with satin finish',
    aiSummary: 'Completed refinish with ebony stain. Excellent coverage and consistent sheen.',
    showInClientPortal: true,
    isProblemArea: false,
    gpsVerified: true,
    latitude: 47.6901,
    longitude: -117.3963,
    isFavorite: true,
    hasNewNotes: false
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
    jobId: 'job-002',
    jobName: 'Thompson Office',
    employeeName: 'Sarah Davis',
    employeeAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    timestamp: 'Dec 19, 2025 4:30 PM',
    room: 'Conference Room',
    phase: 'After',
    type: 'Final Shot',
    tags: ['vinyl', 'complete'],
    notes: 'Conference room complete',
    aiSummary: 'LVP installation complete in conference room. Transitions properly installed.',
    showInClientPortal: true,
    isProblemArea: false,
    gpsVerified: true,
    latitude: 47.6739,
    longitude: -117.4186,
    isFavorite: false,
    hasNewNotes: false
  }
];

export default function PhotosPage({ onNavigate, hideSidebar = false }: { onNavigate?: (page: string) => void; hideSidebar?: boolean }) {
  // State
  const [photos, setPhotos] = useState<Photo[]>(samplePhotos);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterPhase, setFilterPhase] = useState<string>('all');
  const [filterJob, setFilterJob] = useState<string>('all');
  const [filterPortal, setFilterPortal] = useState<'all' | 'shared' | 'not-shared'>('all');
  const [filterNotes, setFilterNotes] = useState<'all' | 'new' | 'reviewed'>('all');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Modal states
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  
  // Annotation editor state
  const [showAnnotationEditor, setShowAnnotationEditor] = useState(false);
  const [annotationPhoto, setAnnotationPhoto] = useState<Photo | null>(null);
  
  // Camera state
  const [showCamera, setShowCamera] = useState(false);
  
  // Sample jobs for camera (in production, fetch from API)
  const sampleJobs = [
    { id: 'job-001', name: 'Anderson Residence', clientName: 'John Anderson', address: '5678 E Appleway Blvd' },
    { id: 'job-002', name: 'Thompson Office', clientName: 'Sarah Thompson', address: '9012 W Seltice Way' },
    { id: 'job-003', name: 'Wilson Home', clientName: 'Mike Wilson', address: '1122 W Northwest Blvd' },
  ];

  // Theme colors
  const bgColor = '#1E1E1E';
  const cardBg = '#2D2D2D';
  const borderColor = '#3D3D3D';
  const textColor = '#FFFFFF';
  const textMuted = '#A0A0A0';
  const accent = PHOTOS_ACCENT;

  // Check mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Share photos to customer portal
  const shareToPortal = (photoIds: string[]) => {
    setPhotos(prev => prev.map(p => 
      photoIds.includes(p.id) ? { ...p, showInClientPortal: true } : p
    ));
    setSelectedPhotos(new Set());
  };

  // Remove photos from customer portal
  const removeFromPortal = (photoIds: string[]) => {
    setPhotos(prev => prev.map(p => 
      photoIds.includes(p.id) ? { ...p, showInClientPortal: false } : p
    ));
    setSelectedPhotos(new Set());
  };

  // Toggle single photo portal status
  const togglePortalStatus = (photoId: string) => {
    setPhotos(prev => prev.map(p => 
      p.id === photoId ? { ...p, showInClientPortal: !p.showInClientPortal } : p
    ));
  };

  // Get selected photos that are/aren't in portal
  const selectedInPortal = Array.from(selectedPhotos).filter(id => 
    photos.find(p => p.id === id)?.showInClientPortal
  );
  const selectedNotInPortal = Array.from(selectedPhotos).filter(id => 
    !photos.find(p => p.id === id)?.showInClientPortal
  );

  // Filter photos
  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = searchQuery === '' || 
      photo.jobName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesPhase = filterPhase === 'all' || photo.phase === filterPhase;
    const matchesJob = filterJob === 'all' || photo.jobId === filterJob;
    const matchesPortal = filterPortal === 'all' || 
      (filterPortal === 'shared' && photo.showInClientPortal) ||
      (filterPortal === 'not-shared' && !photo.showInClientPortal);
    const matchesNotes = filterNotes === 'all' ||
      (filterNotes === 'new' && photo.hasNewNotes) ||
      (filterNotes === 'reviewed' && !photo.hasNewNotes);
    
    return matchesSearch && matchesPhase && matchesJob && matchesPortal && matchesNotes;
  });

  // Count photos with new notes
  const photosWithNewNotes = photos.filter(p => p.hasNewNotes).length;

  // Mark notes as reviewed
  const markNotesAsReviewed = (photoIds: string[]) => {
    setPhotos(prev => prev.map(p => 
      photoIds.includes(p.id) ? { ...p, hasNewNotes: false } : p
    ));
  };

  // Mark all notes as reviewed
  const markAllNotesAsReviewed = () => {
    setPhotos(prev => prev.map(p => ({ ...p, hasNewNotes: false })));
  };

  // Handle new photo from camera
  const handlePhotoTaken = (photoData: {
    imageData: string;
    jobId: string;
    room: string;
    phase: string;
    notes: string;
    latitude?: number;
    longitude?: number;
    timestamp: string;
  }) => {
    const job = sampleJobs.find(j => j.id === photoData.jobId);
    const now = new Date();
    
    const newPhoto: Photo = {
      id: `photo-${Date.now()}`,
      url: photoData.imageData,
      jobId: photoData.jobId,
      jobName: job?.name || 'Unknown Job',
      employeeName: 'Current User', // In production, use logged-in user
      employeeAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
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
      tags: [],
      notes: photoData.notes,
      aiSummary: '',
      showInClientPortal: false,
      isProblemArea: photoData.phase === 'Problem Area',
      gpsVerified: !!(photoData.latitude && photoData.longitude),
      latitude: photoData.latitude,
      longitude: photoData.longitude,
      isFavorite: false,
      hasNewNotes: photoData.notes ? true : false,
      notesUpdatedAt: photoData.notes ? now.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }) : undefined,
      notesUpdatedBy: photoData.notes ? 'Current User' : undefined
    };
    
    setPhotos(prev => [newPhoto, ...prev]);
  };

  // Get unique jobs for filter
  const uniqueJobs = Array.from(new Set(photos.map(p => p.jobId))).map(jobId => {
    const photo = photos.find(p => p.jobId === jobId);
    return { id: jobId, name: photo?.jobName || jobId };
  });

  // Phases for filter
  const phases = ['Before', 'Demo', 'Prep', 'Install', 'Sand', 'Stain', 'Finish', 'After'];

  // Handle photo click - open fullscreen
  const handlePhotoClick = (photo: Photo) => {
    const index = filteredPhotos.findIndex(p => p.id === photo.id);
    setFullscreenIndex(index >= 0 ? index : 0);
    setIsFullscreen(true);
  };

  // Handle photo select (checkbox)
  const handlePhotoSelect = (photoId: string) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
  };

  // Fullscreen navigation
  const goToPrevious = () => {
    setFullscreenIndex(prev => (prev > 0 ? prev - 1 : filteredPhotos.length - 1));
  };

  const goToNext = () => {
    setFullscreenIndex(prev => (prev < filteredPhotos.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') setIsFullscreen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, filteredPhotos.length]);

  const currentFullscreenPhoto = filteredPhotos[fullscreenIndex];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: bgColor }}>
      {/* Sidebar */}
      {!isMobile && !hideSidebar && (
        <SidebarEnhanced 
          activePage="Photos" 
          onNavigate={(page) => onNavigate?.(page)}
          darkMode={true}
        />
      )}

      {/* Mobile Sidebar */}
      {isMobile && showMobileSidebar && !hideSidebar && (
        <div 
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 }}
          onClick={() => setShowMobileSidebar(false)}
        >
          <div style={{ width: '280px', height: '100%' }} onClick={e => e.stopPropagation()}>
            <SidebarEnhanced 
              activePage="Photos" 
              onNavigate={(page) => { setShowMobileSidebar(false); onNavigate?.(page); }}
              darkMode={true}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: (isMobile || hideSidebar) ? 0 : '200px', padding: isMobile ? '16px' : '24px', paddingTop: hideSidebar ? '70px' : (isMobile ? '16px' : '24px'), overflow: 'auto' }}>
        {/* Mobile Header */}
        {isMobile && !hideSidebar && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <button 
              onClick={() => setShowMobileSidebar(true)} 
              style={{ padding: '8px', backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderRadius: '8px', cursor: 'pointer' }}
            >
              <Menu size={24} color={textColor} />
            </button>
            <h1 style={{ fontSize: '24px', color: textColor, margin: 0, fontWeight: 'bold' }}>Photos</h1>
          </div>
        )}

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h1 style={{ fontSize: '28px', color: textColor, margin: '0 0 4px 0', fontWeight: 'bold' }}>Photos</h1>
            <p style={{ fontSize: '14px', color: textMuted, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {filteredPhotos.length} photos • {photos.filter(p => p.showInClientPortal).length} shared to portal • {selectedPhotos.size} selected
              {photosWithNewNotes > 0 && (
                <span style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  padding: '2px 8px',
                  backgroundColor: '#E74C3C',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  <Bell size={12} />
                  {photosWithNewNotes} new notes
                </span>
              )}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            {/* Camera Button - prominent on mobile */}
            <button 
              onClick={() => setShowCamera(true)}
              style={{ 
                padding: isMobile ? '12px 16px' : '12px 20px', 
                backgroundColor: accent, 
                color: '#FFFFFF', 
                border: 'none', 
                borderRadius: '10px', 
                fontSize: '14px', 
                fontWeight: '600', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px'
              }}
            >
              <Camera size={18} />
              {isMobile ? 'Camera' : 'Take Photo'}
            </button>
            
            {/* Upload Button - hide on mobile */}
            {!isMobile && !hideSidebar && (
              <button 
                style={{ 
                  padding: '12px 20px', 
                  backgroundColor: cardBg, 
                  color: textColor, 
                  border: `1px solid ${borderColor}`, 
                  borderRadius: '10px', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px'
                }}
              >
                <Upload size={18} />
                Upload
              </button>
            )}
          </div>
        </div>

        {/* Filters Bar */}
        <div style={{ 
          display: 'flex', 
          gap: isMobile ? '8px' : '12px', 
          marginBottom: isMobile ? '16px' : '24px', 
          flexWrap: isMobile ? 'nowrap' : 'wrap',
          alignItems: 'center',
          overflowX: isMobile ? 'auto' : 'visible',
          paddingBottom: isMobile ? '8px' : '0',
          WebkitOverflowScrolling: 'touch' as any
        }}>
          {/* Search */}
          <div style={{ 
            flex: isMobile ? '0 0 160px' : '1 1 300px',
            position: 'relative',
            minWidth: isMobile ? '160px' : 'auto'
          }}>
            <Search size={16} color={textMuted} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: isMobile ? '8px 8px 8px 32px' : '10px 12px 10px 40px',
                backgroundColor: cardBg,
                border: `1px solid ${borderColor}`,
                borderRadius: '8px',
                color: textColor,
                fontSize: isMobile ? '13px' : '14px'
              }}
            />
          </div>

          {/* Phase Filter */}
          <select
            value={filterPhase}
            onChange={(e) => setFilterPhase(e.target.value)}
            style={{
              padding: isMobile ? '8px' : '10px 12px',
              backgroundColor: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: '8px',
              color: textColor,
              fontSize: isMobile ? '12px' : '14px',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <option value="all">{isMobile ? 'Phase' : 'All Phases'}</option>
            {phases.map(phase => (
              <option key={phase} value={phase}>{phase}</option>
            ))}
          </select>

          {/* Job Filter - hide on mobile */}
          {!isMobile && !hideSidebar && (
            <select
              value={filterJob}
              onChange={(e) => setFilterJob(e.target.value)}
              style={{
                padding: '10px 12px',
                backgroundColor: cardBg,
                border: `1px solid ${borderColor}`,
                borderRadius: '8px',
                color: textColor,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Jobs</option>
              {uniqueJobs.map(job => (
                <option key={job.id} value={job.id}>{job.name}</option>
              ))}
            </select>
          )}

          {/* Portal Filter */}
          <select
            value={filterPortal}
            onChange={(e) => setFilterPortal(e.target.value as 'all' | 'shared' | 'not-shared')}
            style={{
              padding: isMobile ? '8px' : '10px 12px',
              backgroundColor: filterPortal === 'shared' ? '#7BAA8E22' : cardBg,
              border: `1px solid ${filterPortal === 'shared' ? '#7BAA8E' : borderColor}`,
              borderRadius: '8px',
              color: filterPortal === 'shared' ? '#7BAA8E' : textColor,
              fontSize: isMobile ? '12px' : '14px',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <option value="all">{isMobile ? 'Portal' : 'All Photos'}</option>
            <option value="shared">✓ Shared</option>
            <option value="not-shared">Not Shared</option>
          </select>

          {/* New Notes Filter */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <select
              value={filterNotes}
              onChange={(e) => setFilterNotes(e.target.value as 'all' | 'new' | 'reviewed')}
              style={{
                padding: isMobile ? '8px' : '10px 12px',
                paddingRight: isMobile ? '8px' : '36px',
                backgroundColor: filterNotes === 'new' ? '#E74C3C22' : cardBg,
                border: `1px solid ${filterNotes === 'new' ? '#E74C3C' : borderColor}`,
                borderRadius: '8px',
                color: filterNotes === 'new' ? '#E74C3C' : textColor,
                fontSize: isMobile ? '12px' : '14px',
                cursor: 'pointer'
              }}
            >
              <option value="all">{isMobile ? 'Notes' : 'All Notes'}</option>
              <option value="new">🔴 New ({photosWithNewNotes})</option>
              <option value="reviewed">Reviewed</option>
            </select>
            {photosWithNewNotes > 0 && filterNotes !== 'new' && (
              <div style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                width: isMobile ? '16px' : '20px',
                height: isMobile ? '16px' : '20px',
                borderRadius: '50%',
                backgroundColor: '#E74C3C',
                color: '#FFFFFF',
                fontSize: isMobile ? '9px' : '11px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {photosWithNewNotes}
              </div>
            )}
          </div>

          {/* Select All Button */}
          <button
            onClick={() => {
              if (selectedPhotos.size === filteredPhotos.length) {
                setSelectedPhotos(new Set());
              } else {
                setSelectedPhotos(new Set(filteredPhotos.map(p => p.id)));
              }
            }}
            style={{
              padding: isMobile ? '8px' : '10px 12px',
              backgroundColor: selectedPhotos.size === filteredPhotos.length && filteredPhotos.length > 0 ? accent : cardBg,
              border: `1px solid ${selectedPhotos.size === filteredPhotos.length && filteredPhotos.length > 0 ? accent : borderColor}`,
              borderRadius: '8px',
              color: textColor,
              fontSize: isMobile ? '12px' : '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              flexShrink: 0
            }}
          >
            <Check size={isMobile ? 14 : 16} />
            {isMobile ? '' : (selectedPhotos.size === filteredPhotos.length && filteredPhotos.length > 0 ? 'Deselect' : 'Select All')}
          </button>

          {/* View Toggle - hide on mobile */}
          {!isMobile && !hideSidebar && (
            <div style={{ display: 'flex', backgroundColor: cardBg, borderRadius: '8px', border: `1px solid ${borderColor}` }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '8px 12px',
                  backgroundColor: viewMode === 'grid' ? accent : 'transparent',
                  border: 'none',
                  borderRadius: '8px 0 0 8px',
                  color: textColor,
                  cursor: 'pointer'
                }}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '8px 12px',
                  backgroundColor: viewMode === 'list' ? accent : 'transparent',
                  border: 'none',
                  borderRadius: '0 8px 8px 0',
                  color: textColor,
                  cursor: 'pointer'
                }}
              >
                <List size={18} />
              </button>
            </div>
          )}
        </div>

        {/* New Notes Alert Banner */}
        {photosWithNewNotes > 0 && filterNotes !== 'new' && (
          <div style={{
            display: 'flex',
            alignItems: isMobile ? 'flex-start' : 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '12px',
            padding: isMobile ? '12px' : '12px 16px',
            backgroundColor: '#E74C3C22',
            border: '1px solid #E74C3C',
            borderRadius: '10px',
            marginBottom: isMobile ? '16px' : '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: isMobile ? '100%' : 'auto' }}>
              <div style={{
                width: isMobile ? '32px' : '40px',
                height: isMobile ? '32px' : '40px',
                borderRadius: '50%',
                backgroundColor: '#E74C3C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MessageCircle size={isMobile ? 16 : 20} color="#FFFFFF" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: textColor, fontSize: isMobile ? '13px' : '14px', fontWeight: '600', margin: 0 }}>
                  {photosWithNewNotes} new note{photosWithNewNotes > 1 ? 's' : ''} to review
                </p>
                {!isMobile && !hideSidebar && (
                  <p style={{ color: textMuted, fontSize: '12px', margin: '2px 0 0 0' }}>
                    Field employees have added notes that need admin review
                  </p>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', width: isMobile ? '100%' : 'auto' }}>
              <button
                onClick={() => setFilterNotes('new')}
                style={{
                  flex: isMobile ? 1 : 'none',
                  padding: isMobile ? '8px 12px' : '8px 16px',
                  backgroundColor: '#E74C3C',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: isMobile ? '12px' : '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Eye size={14} />
                View
              </button>
              <button
                onClick={markAllNotesAsReviewed}
                style={{
                  flex: isMobile ? 1 : 'none',
                  padding: isMobile ? '8px 12px' : '8px 16px',
                  backgroundColor: 'transparent',
                  border: '1px solid #E74C3C',
                  borderRadius: '8px',
                  color: '#E74C3C',
                  fontSize: isMobile ? '12px' : '13px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {isMobile ? 'Clear All' : 'Mark All Reviewed'}
              </button>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedPhotos.size > 0 && (
          <div style={{
            display: 'flex',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: `${accent}22`,
            border: `1px solid ${accent}`,
            borderRadius: '10px',
            marginBottom: '24px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <span style={{ color: textColor, fontSize: '14px', fontWeight: '600' }}>
              {selectedPhotos.size} selected
            </span>
            <div style={{ width: '1px', height: '24px', backgroundColor: borderColor }} />
            
            <button 
              onClick={() => {/* Download logic */}}
              style={{ padding: '6px 12px', backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderRadius: '6px', color: textColor, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
            >
              <Download size={14} /> Download
            </button>
            
            {/* Share to Portal - only show if some selected are NOT in portal */}
            {selectedNotInPortal.length > 0 && (
              <button 
                onClick={() => shareToPortal(Array.from(selectedPhotos))}
                style={{ 
                  padding: '6px 12px', 
                  backgroundColor: '#7BAA8E22', 
                  border: '1px solid #7BAA8E', 
                  borderRadius: '6px', 
                  color: '#7BAA8E', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                <Eye size={14} /> Share to Customer Portal
                {selectedNotInPortal.length < selectedPhotos.size && (
                  <span style={{ 
                    backgroundColor: '#7BAA8E', 
                    color: '#FFF', 
                    padding: '1px 6px', 
                    borderRadius: '10px', 
                    fontSize: '10px' 
                  }}>
                    {selectedNotInPortal.length}
                  </span>
                )}
              </button>
            )}
            
            {/* Remove from Portal - only show if some selected ARE in portal */}
            {selectedInPortal.length > 0 && (
              <button 
                onClick={() => removeFromPortal(Array.from(selectedPhotos))}
                style={{ 
                  padding: '6px 12px', 
                  backgroundColor: cardBg, 
                  border: `1px solid ${borderColor}`, 
                  borderRadius: '6px', 
                  color: textMuted, 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  fontSize: '12px' 
                }}
              >
                <EyeOff size={14} /> Remove from Portal
                {selectedInPortal.length < selectedPhotos.size && (
                  <span style={{ 
                    backgroundColor: textMuted, 
                    color: '#1E1E1E', 
                    padding: '1px 6px', 
                    borderRadius: '10px', 
                    fontSize: '10px' 
                  }}>
                    {selectedInPortal.length}
                  </span>
                )}
              </button>
            )}
            
            {/* Mark as Reviewed - only show if some selected have new notes */}
            {Array.from(selectedPhotos).some(id => photos.find(p => p.id === id)?.hasNewNotes) && (
              <button 
                onClick={() => markNotesAsReviewed(Array.from(selectedPhotos))}
                style={{ 
                  padding: '6px 12px', 
                  backgroundColor: '#3B9CAA22', 
                  border: '1px solid #3B9CAA', 
                  borderRadius: '6px', 
                  color: '#3B9CAA', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                <CheckCheck size={14} /> Mark as Reviewed
              </button>
            )}
            
            <button 
              onClick={() => {/* Delete logic */}}
              style={{ padding: '6px 12px', backgroundColor: cardBg, border: '1px solid #E74C3C', borderRadius: '6px', color: '#E74C3C', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
            >
              <Trash2 size={14} /> Delete
            </button>
            
            <button 
              onClick={() => setSelectedPhotos(new Set())}
              style={{ marginLeft: 'auto', padding: '6px 12px', backgroundColor: 'transparent', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '12px' }}
            >
              Clear Selection
            </button>
          </div>
        )}

        {/* Photo Grid */}
        {filteredPhotos.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 20px',
            color: textMuted
          }}>
            <ImageIcon size={64} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <h3 style={{ color: textColor, marginBottom: '8px' }}>No photos found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile 
              ? 'repeat(2, 1fr)' 
              : (viewMode === 'grid' 
                ? 'repeat(auto-fill, minmax(280px, 1fr))' 
                : '1fr'),
            gap: isMobile ? '12px' : '20px'
          }}>
            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isSelected={selectedPhotos.has(photo.id)}
                onSelect={() => handlePhotoSelect(photo.id)}
                onClick={() => handlePhotoClick(photo)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Photo Viewer */}
      {isFullscreen && currentFullscreenPhoto && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#000000',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px 24px',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10
          }}>
            <div>
              <h2 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '600', margin: '0 0 4px 0' }}>
                {currentFullscreenPhoto.jobName}
              </h2>
              <p style={{ color: '#A0A0A0', fontSize: '13px', margin: 0 }}>
                {currentFullscreenPhoto.room} • {currentFullscreenPhoto.phase} • {currentFullscreenPhoto.timestamp}
              </p>
              <p style={{ color: '#666', fontSize: '12px', margin: '4px 0 0 0' }}>
                {fullscreenIndex + 1} of {filteredPhotos.length}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {/* Portal Status Toggle */}
              <button
                onClick={() => togglePortalStatus(currentFullscreenPhoto.id)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  backgroundColor: currentFullscreenPhoto.showInClientPortal 
                    ? 'rgba(123, 170, 142, 0.3)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${currentFullscreenPhoto.showInClientPortal ? '#7BAA8E' : 'rgba(255, 255, 255, 0.2)'}`,
                  color: currentFullscreenPhoto.showInClientPortal ? '#7BAA8E' : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                {currentFullscreenPhoto.showInClientPortal ? (
                  <>
                    <Eye size={16} />
                    In Customer Portal
                  </>
                ) : (
                  <>
                    <EyeOff size={16} />
                    Share to Portal
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setAnnotationPhoto(currentFullscreenPhoto);
                  setShowAnnotationEditor(true);
                  setIsFullscreen(false);
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                <Pencil size={16} />
                Annotate
              </button>
              <button
                onClick={() => {
                  setSelectedPhoto(currentFullscreenPhoto);
                  setShowDetailModal(true);
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                <Eye size={16} />
                Details
              </button>
              <button
                onClick={() => setIsFullscreen(false)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Main Photo */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 80px 100px 80px',
            position: 'relative'
          }}>
            <img
              src={currentFullscreenPhoto.url}
              alt={`${currentFullscreenPhoto.room} - ${currentFullscreenPhoto.phase}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '4px'
              }}
            />
            
            {/* Portal Status Badge on Photo */}
            {currentFullscreenPhoto.showInClientPortal && (
              <div style={{
                position: 'absolute',
                bottom: '110px',
                left: '90px',
                padding: '8px 14px',
                backgroundColor: 'rgba(123, 170, 142, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                <Eye size={14} />
                Visible in Customer Portal
              </div>
            )}
            
            {/* New Notes Badge */}
            {currentFullscreenPhoto.hasNewNotes && (
              <div style={{
                position: 'absolute',
                top: '90px',
                right: '90px',
                padding: '10px 16px',
                backgroundColor: 'rgba(231, 76, 60, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxWidth: '280px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bell size={16} color="#FFFFFF" />
                  <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '700' }}>
                    New Note Added
                  </span>
                </div>
                {currentFullscreenPhoto.notesUpdatedBy && (
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', margin: 0 }}>
                    By {currentFullscreenPhoto.notesUpdatedBy} • {currentFullscreenPhoto.notesUpdatedAt}
                  </p>
                )}
                <button
                  onClick={() => markNotesAsReviewed([currentFullscreenPhoto.id])}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckCheck size={12} />
                  Mark as Reviewed
                </button>
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          {filteredPhotos.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = accent;
                  e.currentTarget.style.borderColor = accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <ChevronLeft size={28} />
              </button>

              <button
                onClick={goToNext}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = accent;
                  e.currentTarget.style.borderColor = accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          {/* Thumbnail Strip */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 24px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            overflowX: 'auto'
          }}>
            {filteredPhotos.slice(Math.max(0, fullscreenIndex - 5), Math.min(filteredPhotos.length, fullscreenIndex + 6)).map((photo, idx) => {
              const actualIndex = Math.max(0, fullscreenIndex - 5) + idx;
              return (
                <button
                  key={photo.id}
                  onClick={() => setFullscreenIndex(actualIndex)}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: actualIndex === fullscreenIndex ? `3px solid ${accent}` : '2px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    padding: 0,
                    backgroundColor: 'transparent',
                    flexShrink: 0,
                    opacity: actualIndex === fullscreenIndex ? 1 : 0.6,
                    transition: 'all 0.2s'
                  }}
                >
                  <img
                    src={photo.url}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Keyboard Hint */}
          <div style={{
            position: 'absolute',
            bottom: '90px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: '#666',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <kbd style={{ backgroundColor: '#333', padding: '2px 6px', borderRadius: '3px' }}>←</kbd>
            <kbd style={{ backgroundColor: '#333', padding: '2px 6px', borderRadius: '3px' }}>→</kbd>
            Navigate
            <span style={{ margin: '0 4px' }}>•</span>
            <kbd style={{ backgroundColor: '#333', padding: '2px 6px', borderRadius: '3px' }}>ESC</kbd>
            Close
          </div>
        </div>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <PhotoDetailModal
          photo={selectedPhoto}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedPhoto(null);
          }}
          onNext={() => {
            const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
            if (currentIndex < filteredPhotos.length - 1) {
              setSelectedPhoto(filteredPhotos[currentIndex + 1]);
            }
          }}
          onPrevious={() => {
            const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
            if (currentIndex > 0) {
              setSelectedPhoto(filteredPhotos[currentIndex - 1]);
            }
          }}
          hasNext={filteredPhotos.findIndex(p => p.id === selectedPhoto.id) < filteredPhotos.length - 1}
          hasPrevious={filteredPhotos.findIndex(p => p.id === selectedPhoto.id) > 0}
        />
      )}

      {/* Photo Annotation Editor */}
      {annotationPhoto && (
        <PhotoAnnotationEditor
          photo={annotationPhoto}
          isOpen={showAnnotationEditor}
          onClose={() => {
            setShowAnnotationEditor(false);
            setAnnotationPhoto(null);
          }}
          onSave={(annotations, notes) => {
            // Update photo with annotations and notes
            const now = new Date();
            const timestamp = now.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            });
            
            setPhotos(prev => prev.map(p => 
              p.id === annotationPhoto.id 
                ? { 
                    ...p, 
                    notes,
                    hasNewNotes: true,
                    notesUpdatedAt: timestamp,
                    notesUpdatedBy: 'Current User' // In production, use actual logged-in user
                  } 
                : p
            ));
            console.log('Saved annotations:', annotations);
            console.log('Saved notes:', notes);
          }}
        />
      )}

      {/* Camera Capture Screen */}
      <CameraCaptureScreen
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onPhotoTaken={handlePhotoTaken}
        jobs={sampleJobs}
        currentJobId={filterJob !== 'all' ? filterJob : undefined}
      />
    </div>
  );
}
