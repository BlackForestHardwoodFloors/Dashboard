import React, { useState } from 'react';
import { 
  ArrowLeft,
  Camera,
  Upload,
  Grid3x3,
  List,
  Clock,
  MapPin,
  Filter,
  Search,
  Calendar,
  Download,
  Share2,
  Trash2,
  Star,
  ChevronDown,
  User,
  Tag,
  Image as ImageIcon,
  Layers
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import PhotoCard from './PhotoCard';
import PhotoDetailModal from './PhotoDetailModal';

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
  employeeInitials: string;
  employeeColor: string;
  timeAgo: string;
}

interface JobInfo {
  id: string;
  clientName: string;
  address: string;
  totalPhotos: number;
  employeeInitials: string;
  employeeColor: string;
  startDate: string;
  status: string;
}

const COMPANYCAM_BLUE = '#0F7BFF';
const GOLD_CTA = '#C9A049';

type ViewMode = 'Grid' | 'List';
type FilterType = 'All' | 'Before' | 'Progress' | 'After' | 'Problems';

export default function JobPhotoGallery({ 
  jobId, 
  onBack,
  onNavigate 
}: { 
  jobId: string;
  onBack: () => void;
  onNavigate?: (page: string) => void;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>('Grid');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Job information
  const jobInfo: JobInfo = {
    id: jobId,
    clientName: 'Anderson, Sarah',
    address: '742 Evergreen Terrace',
    totalPhotos: 47,
    employeeInitials: 'MJ',
    employeeColor: '#FF5722',
    startDate: 'Nov 10, 2024',
    status: 'In Progress'
  };

  // All photos for this job
  const allPhotos: Photo[] = [
    {
      id: 'j1-p1',
      url: 'https://images.unsplash.com/photo-1615875221248-cd6de5422865?w=600',
      jobId: jobId,
      jobName: 'Anderson Living Room',
      employeeName: 'Mike Johnson',
      employeeAvatar: 'https://i.pravatar.cc/150?img=12',
      timestamp: '2024-11-17T14:30:00',
      room: 'Living Room',
      phase: 'Installation',
      type: 'Progress',
      tags: ['oak', 'progress', 'living-room'],
      notes: 'First coat applied, looking great',
      aiSummary: 'Oak hardwood installation in progress. Floor appears level with even stain application.',
      showInClientPortal: true,
      isProblemArea: false,
      gpsVerified: true,
      latitude: 47.6588,
      longitude: -117.4260,
      isFavorite: false,
      employeeInitials: 'MJ',
      employeeColor: '#FF5722',
      timeAgo: '2 hours ago'
    },
    {
      id: 'j1-p2',
      url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600',
      jobId: jobId,
      jobName: 'Anderson Living Room',
      employeeName: 'Mike Johnson',
      employeeAvatar: 'https://i.pravatar.cc/150?img=12',
      timestamp: '2024-11-17T13:00:00',
      room: 'Living Room',
      phase: 'Installation',
      type: 'Progress',
      tags: ['oak', 'progress'],
      notes: 'Second area completed',
      aiSummary: 'Continued installation showing consistent quality.',
      showInClientPortal: true,
      isProblemArea: false,
      gpsVerified: true,
      latitude: 47.6588,
      longitude: -117.4260,
      isFavorite: true,
      employeeInitials: 'MJ',
      employeeColor: '#FF5722',
      timeAgo: '3 hours ago'
    },
    {
      id: 'j1-p3',
      url: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600',
      jobId: jobId,
      jobName: 'Anderson Hallway',
      employeeName: 'Mike Johnson',
      employeeAvatar: 'https://i.pravatar.cc/150?img=12',
      timestamp: '2024-11-17T11:30:00',
      room: 'Hallway',
      phase: 'Installation',
      type: 'Progress',
      tags: ['oak', 'hallway', 'progress'],
      notes: 'Hallway connection point',
      aiSummary: 'Hallway installation with seamless transitions.',
      showInClientPortal: true,
      isProblemArea: false,
      gpsVerified: true,
      latitude: 47.6588,
      longitude: -117.4260,
      isFavorite: false,
      employeeInitials: 'MJ',
      employeeColor: '#FF5722',
      timeAgo: '5 hours ago'
    },
    {
      id: 'j1-p4',
      url: 'https://images.unsplash.com/photo-1601063936640-a0e4e4ed081c?w=600',
      jobId: jobId,
      jobName: 'Anderson Kitchen',
      employeeName: 'Mike Johnson',
      employeeAvatar: 'https://i.pravatar.cc/150?img=12',
      timestamp: '2024-11-16T15:00:00',
      room: 'Kitchen',
      phase: 'Installation',
      type: 'Progress',
      tags: ['kitchen', 'progress'],
      notes: 'Kitchen area prep complete',
      aiSummary: 'Kitchen flooring preparation completed successfully.',
      showInClientPortal: true,
      isProblemArea: false,
      gpsVerified: true,
      latitude: 47.6588,
      longitude: -117.4260,
      isFavorite: false,
      employeeInitials: 'MJ',
      employeeColor: '#FF5722',
      timeAgo: '1 day ago'
    },
    {
      id: 'j1-p5',
      url: 'https://images.unsplash.com/photo-1666871525829-a71efce76005?w=600',
      jobId: jobId,
      jobName: 'Anderson Dining Room',
      employeeName: 'Mike Johnson',
      employeeAvatar: 'https://i.pravatar.cc/150?img=12',
      timestamp: '2024-11-16T14:00:00',
      room: 'Dining Room',
      phase: 'Installation',
      type: 'Progress',
      tags: ['dining-room', 'progress'],
      notes: 'Dining room looking fantastic',
      aiSummary: 'Dining room installation progressing well.',
      showInClientPortal: true,
      isProblemArea: false,
      gpsVerified: true,
      latitude: 47.6588,
      longitude: -117.4260,
      isFavorite: true,
      employeeInitials: 'MJ',
      employeeColor: '#FF5722',
      timeAgo: '1 day ago'
    },
    {
      id: 'j1-p6',
      url: 'https://images.unsplash.com/photo-1711915442858-2a5bb7ba67d8?w=600',
      jobId: jobId,
      jobName: 'Anderson Master Bedroom',
      employeeName: 'Sarah Chen',
      employeeAvatar: 'https://i.pravatar.cc/150?img=45',
      timestamp: '2024-11-16T10:00:00',
      room: 'Master Bedroom',
      phase: 'Installation',
      type: 'Progress',
      tags: ['bedroom', 'progress'],
      notes: 'Master bedroom installation started',
      aiSummary: 'Master bedroom flooring installation begun.',
      showInClientPortal: true,
      isProblemArea: false,
      gpsVerified: true,
      latitude: 47.6588,
      longitude: -117.4260,
      isFavorite: false,
      employeeInitials: 'SC',
      employeeColor: '#9C27B0',
      timeAgo: '1 day ago'
    },
    {
      id: 'j1-p7',
      url: 'https://images.unsplash.com/photo-1690310588789-8fcee016f619?w=600',
      jobId: jobId,
      jobName: 'Anderson Living Room Before',
      employeeName: 'Mike Johnson',
      employeeAvatar: 'https://i.pravatar.cc/150?img=12',
      timestamp: '2024-11-10T09:00:00',
      room: 'Living Room',
      phase: 'Before',
      type: 'Before',
      tags: ['before', 'living-room'],
      notes: 'Original condition - carpet removal needed',
      aiSummary: 'Pre-existing carpet condition documented.',
      showInClientPortal: false,
      isProblemArea: false,
      gpsVerified: true,
      latitude: 47.6588,
      longitude: -117.4260,
      isFavorite: false,
      employeeInitials: 'MJ',
      employeeColor: '#FF5722',
      timeAgo: '7 days ago'
    },
    {
      id: 'j1-p8',
      url: 'https://images.unsplash.com/photo-1680637301521-13652448f0e5?w=600',
      jobId: jobId,
      jobName: 'Anderson Kitchen Before',
      employeeName: 'Mike Johnson',
      employeeAvatar: 'https://i.pravatar.cc/150?img=12',
      timestamp: '2024-11-10T09:30:00',
      room: 'Kitchen',
      phase: 'Before',
      type: 'Before',
      tags: ['before', 'kitchen'],
      notes: 'Old vinyl flooring to be removed',
      aiSummary: 'Pre-existing vinyl flooring documented.',
      showInClientPortal: false,
      isProblemArea: false,
      gpsVerified: true,
      latitude: 47.6588,
      longitude: -117.4260,
      isFavorite: false,
      employeeInitials: 'MJ',
      employeeColor: '#FF5722',
      timeAgo: '7 days ago'
    },
    {
      id: 'j1-p9',
      url: 'https://images.unsplash.com/photo-1622193736115-9032b599ef61?w=600',
      jobId: jobId,
      jobName: 'Anderson Subfloor Repair',
      employeeName: 'Carlos Rodriguez',
      employeeAvatar: 'https://i.pravatar.cc/150?img=33',
      timestamp: '2024-11-11T10:00:00',
      room: 'Living Room',
      phase: 'Before',
      type: 'Before',
      tags: ['problem', 'repair', 'subfloor'],
      notes: 'Water damage found - subfloor repair required',
      aiSummary: 'Subfloor water damage requiring repair.',
      showInClientPortal: false,
      isProblemArea: true,
      problemType: 'Water Damage',
      gpsVerified: true,
      latitude: 47.6588,
      longitude: -117.4260,
      isFavorite: false,
      employeeInitials: 'CR',
      employeeColor: '#4CAF50',
      timeAgo: '6 days ago'
    },
    {
      id: 'j1-p10',
      url: 'https://images.unsplash.com/photo-1693948568453-a3564f179a84?w=600',
      jobId: jobId,
      jobName: 'Anderson Subfloor Fixed',
      employeeName: 'Carlos Rodriguez',
      employeeAvatar: 'https://i.pravatar.cc/150?img=33',
      timestamp: '2024-11-12T14:00:00',
      room: 'Living Room',
      phase: 'Installation',
      type: 'Progress',
      tags: ['repair-complete', 'subfloor'],
      notes: 'Subfloor repair completed, ready for installation',
      aiSummary: 'Subfloor repair successfully completed.',
      showInClientPortal: false,
      isProblemArea: false,
      gpsVerified: true,
      latitude: 47.6588,
      longitude: -117.4260,
      isFavorite: false,
      employeeInitials: 'CR',
      employeeColor: '#4CAF50',
      timeAgo: '5 days ago'
    },
    {
      id: 'j1-p11',
      url: 'https://images.unsplash.com/photo-1666871525829-a71efce76005?w=600',
      jobId: jobId,
      jobName: 'Anderson Staircase',
      employeeName: 'Mike Johnson',
      employeeAvatar: 'https://i.pravatar.cc/150?img=12',
      timestamp: '2024-11-15T11:00:00',
      room: 'Staircase',
      phase: 'Installation',
      type: 'Progress',
      tags: ['stairs', 'progress'],
      notes: 'Staircase installation in progress',
      aiSummary: 'Staircase flooring installation underway.',
      showInClientPortal: true,
      isProblemArea: false,
      gpsVerified: true,
      latitude: 47.6588,
      longitude: -117.4260,
      isFavorite: false,
      employeeInitials: 'MJ',
      employeeColor: '#FF5722',
      timeAgo: '2 days ago'
    },
    {
      id: 'j1-p12',
      url: 'https://images.unsplash.com/photo-1615875221248-cd6de5422865?w=600',
      jobId: jobId,
      jobName: 'Anderson Guest Bedroom',
      employeeName: 'Sarah Chen',
      employeeAvatar: 'https://i.pravatar.cc/150?img=45',
      timestamp: '2024-11-15T15:00:00',
      room: 'Guest Bedroom',
      phase: 'Installation',
      type: 'Progress',
      tags: ['bedroom', 'progress'],
      notes: 'Guest bedroom nearly complete',
      aiSummary: 'Guest bedroom flooring nearing completion.',
      showInClientPortal: true,
      isProblemArea: false,
      gpsVerified: true,
      latitude: 47.6588,
      longitude: -117.4260,
      isFavorite: true,
      employeeInitials: 'SC',
      employeeColor: '#9C27B0',
      timeAgo: '2 days ago'
    }
  ];

  // Filter photos based on active filter
  const filteredPhotos = allPhotos.filter(photo => {
    // Apply type filter
    if (activeFilter !== 'All') {
      if (activeFilter === 'Before' && photo.type !== 'Before') return false;
      if (activeFilter === 'Progress' && photo.type !== 'Progress') return false;
      if (activeFilter === 'After' && photo.type !== 'After') return false;
      if (activeFilter === 'Problems' && !photo.isProblemArea) return false;
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        photo.room.toLowerCase().includes(search) ||
        photo.employeeName.toLowerCase().includes(search) ||
        photo.tags.some(tag => tag.toLowerCase().includes(search)) ||
        photo.notes.toLowerCase().includes(search)
      );
    }

    return true;
  });

  const handlePhotoClick = (photo: Photo) => {
    const index = filteredPhotos.findIndex(p => p.id === photo.id);
    setSelectedPhoto(photo);
    setSelectedPhotoIndex(index);
    setShowDetailModal(true);
  };

  const handleNextPhoto = () => {
    if (selectedPhotoIndex < filteredPhotos.length - 1) {
      const newIndex = selectedPhotoIndex + 1;
      setSelectedPhotoIndex(newIndex);
      setSelectedPhoto(filteredPhotos[newIndex]);
    }
  };

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex > 0) {
      const newIndex = selectedPhotoIndex - 1;
      setSelectedPhotoIndex(newIndex);
      setSelectedPhoto(filteredPhotos[newIndex]);
    }
  };

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  // Get photo counts by type
  const beforeCount = allPhotos.filter(p => p.type === 'Before').length;
  const progressCount = allPhotos.filter(p => p.type === 'Progress').length;
  const afterCount = allPhotos.filter(p => p.type === 'After').length;
  const problemCount = allPhotos.filter(p => p.isProblemArea).length;

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0D0D0D', overflow: 'hidden' }}>
      <Sidebar activePage="Photos" darkMode={true} onNavigate={onNavigate} />

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        marginLeft: '160px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid #262626',
          backgroundColor: '#0D0D0D'
        }}>
          {/* Back Button & Job Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <button
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: '#1A1A1A',
                border: '1px solid #3D3D3D',
                borderRadius: '10px',
                color: '#E0E0E0',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#262626';
                e.currentTarget.style.borderColor = COMPANYCAM_BLUE;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1A1A1A';
                e.currentTarget.style.borderColor = '#3D3D3D';
              }}
            >
              <ArrowLeft size={18} />
              Back to Photos
            </button>

            {/* Employee Color Indicator */}
            <div style={{
              width: '4px',
              height: '40px',
              backgroundColor: jobInfo.employeeColor,
              borderRadius: '2px'
            }} />

            <div style={{ flex: 1 }}>
              <h1 style={{ 
                color: '#FFFFFF', 
                fontSize: '28px', 
                fontWeight: '700', 
                margin: '0 0 6px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                {jobInfo.clientName.split(',')[0]}
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  backgroundColor: '#FFA726',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: '700'
                }}>
                  {jobInfo.status}
                </span>
              </h1>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                color: '#A0A0A0',
                fontSize: '14px'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} />
                  {jobInfo.address}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} />
                  Started {jobInfo.startDate}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ImageIcon size={14} />
                  {jobInfo.totalPhotos} photos
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {/* TODO: Open camera for this job */}}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  backgroundColor: COMPANYCAM_BLUE,
                  border: 'none',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(15,123,255,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(15,123,255,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(15,123,255,0.3)';
                }}
              >
                <Camera size={18} />
                Take Photo
              </button>

              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  backgroundColor: '#262626',
                  border: '1px solid #3D3D3D',
                  borderRadius: '10px',
                  color: '#E0E0E0',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#3D3D3D';
                  e.currentTarget.style.borderColor = COMPANYCAM_BLUE;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#262626';
                  e.currentTarget.style.borderColor = '#3D3D3D';
                }}
              >
                <Upload size={18} />
                Upload
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <span style={{ color: '#888', fontSize: '13px', fontWeight: '600' }}>Filter:</span>
            {(['All', 'Before', 'Progress', 'After', 'Problems'] as FilterType[]).map((filter) => {
              const isActive = activeFilter === filter;
              let count = allPhotos.length;
              if (filter === 'Before') count = beforeCount;
              if (filter === 'Progress') count = progressCount;
              if (filter === 'After') count = afterCount;
              if (filter === 'Problems') count = problemCount;

              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: isActive ? COMPANYCAM_BLUE : '#1A1A1A',
                    border: `1px solid ${isActive ? COMPANYCAM_BLUE : '#3D3D3D'}`,
                    borderRadius: '10px',
                    color: isActive ? '#FFFFFF' : '#A0A0A0',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#262626';
                      e.currentTarget.style.borderColor = COMPANYCAM_BLUE;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#1A1A1A';
                      e.currentTarget.style.borderColor = '#3D3D3D';
                    }
                  }}
                >
                  {filter}
                  <span style={{
                    padding: '2px 6px',
                    borderRadius: '6px',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                    fontSize: '11px',
                    fontWeight: '700'
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Controls */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* View Mode Toggle */}
            <div style={{
              display: 'flex',
              backgroundColor: '#1A1A1A',
              border: '1px solid #3D3D3D',
              borderRadius: '10px',
              padding: '4px'
            }}>
              {(['Grid', 'List'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: viewMode === mode ? COMPANYCAM_BLUE : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: viewMode === mode ? '#FFFFFF' : '#A0A0A0',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {mode === 'Grid' ? <Grid3x3 size={16} /> : <List size={16} />}
                  {mode}
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{
              flex: 1,
              maxWidth: '400px',
              position: 'relative'
            }}>
              <Search size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#888'
              }} />
              <input
                type="text"
                placeholder="Search by room, employee, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 44px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #3D3D3D',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = COMPANYCAM_BLUE;
                  e.target.style.backgroundColor = '#262626';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3D3D3D';
                  e.target.style.backgroundColor = '#1A1A1A';
                }}
              />
            </div>

            {/* Results Count */}
            <span style={{ color: '#888', fontSize: '13px', whiteSpace: 'nowrap' }}>
              {filteredPhotos.length} {filteredPhotos.length === 1 ? 'photo' : 'photos'}
            </span>
          </div>
        </div>

        {/* Photo Grid */}
        <div style={{ 
          flex: 1,
          overflowY: 'auto',
          padding: '24px 32px'
        }}>
          {viewMode === 'Grid' ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {filteredPhotos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  isSelected={selectedPhotos.includes(photo.id)}
                  onToggleSelect={() => togglePhotoSelection(photo.id)}
                  onClick={() => handlePhotoClick(photo)}
                />
              ))}
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => handlePhotoClick(photo)}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    padding: '16px',
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #3D3D3D',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#262626';
                    e.currentTarget.style.borderColor = COMPANYCAM_BLUE;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1A1A1A';
                    e.currentTarget.style.borderColor = '#3D3D3D';
                  }}
                >
                  {/* Thumbnail */}
                  <img
                    src={photo.url}
                    alt={photo.room}
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />

                  {/* Info */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '700', margin: 0 }}>
                        {photo.room}
                      </h4>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        backgroundColor: photo.type === 'Before' ? '#888' : photo.type === 'Progress' ? COMPANYCAM_BLUE : '#66BB6A',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        fontWeight: '700'
                      }}>
                        {photo.type}
                      </span>
                      {photo.isProblemArea && (
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          backgroundColor: '#EF5350',
                          color: '#FFFFFF',
                          fontSize: '11px',
                          fontWeight: '700'
                        }}>
                          Problem
                        </span>
                      )}
                    </div>
                    <p style={{ color: '#A0A0A0', fontSize: '14px', margin: 0 }}>
                      {photo.notes}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#888' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={12} />
                        {photo.employeeName}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        {photo.timeAgo}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Tag size={12} />
                        {photo.tags.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredPhotos.length === 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px',
              color: '#888'
            }}>
              <ImageIcon size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                No photos found
              </h3>
              <p style={{ fontSize: '14px', textAlign: 'center' }}>
                {searchTerm 
                  ? `No photos match "${searchTerm}"`
                  : `No ${activeFilter.toLowerCase()} photos for this job yet`
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Photo Detail Modal */}
      {showDetailModal && selectedPhoto && (
        <PhotoDetailModal
          photo={selectedPhoto}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedPhoto(null);
          }}
          onNext={handleNextPhoto}
          onPrev={handlePrevPhoto}
          canGoNext={selectedPhotoIndex < filteredPhotos.length - 1}
          canGoPrev={selectedPhotoIndex > 0}
        />
      )}
    </div>
  );
}
