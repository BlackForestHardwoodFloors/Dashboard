import React, { useState } from 'react';
import { 
  Camera,
  Search,
  Filter,
  Share2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  Users,
  Building,
  MapPin,
  Clock,
  Star,
  Download
} from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import type { Photo, Job } from '../EmployeePortal';

interface PhotosScreenProps {
  photos: Photo[];
  jobs: Job[];
  employeeId: string;
  onTakePhoto: () => void;
  onSharePhoto: (photoId: string, target: 'admin' | 'customer', shared: boolean) => void;
}

type FilterType = 'all' | 'my-jobs' | 'job';

export function PhotosScreen({ 
  photos, 
  jobs, 
  employeeId, 
  onTakePhoto,
  onSharePhoto 
}: PhotosScreenProps) {
  const { colors } = useTheme();
  
  // State
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter photos
  let filteredPhotos = photos;
  
  if (filterType === 'my-jobs') {
    filteredPhotos = photos.filter(p => p.employeeId === employeeId);
  } else if (filterType === 'job' && selectedJobId) {
    filteredPhotos = photos.filter(p => p.jobId === selectedJobId);
  }
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredPhotos = filteredPhotos.filter(p => 
      p.room.toLowerCase().includes(query) ||
      p.phase.toLowerCase().includes(query) ||
      p.jobName.toLowerCase().includes(query) ||
      p.notes.toLowerCase().includes(query)
    );
  }

  // Group by date
  const groupedPhotos = filteredPhotos.reduce((acc, photo) => {
    const date = photo.timestamp.split(',')[0]; // Get date part
    if (!acc[date]) acc[date] = [];
    acc[date].push(photo);
    return acc;
  }, {} as Record<string, Photo[]>);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      paddingBottom: '100px'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        paddingTop: 'max(16px, env(safe-area-inset-top))',
        backgroundColor: colors.backgroundSecondary,
        borderBottom: `1px solid ${colors.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <h1 style={{
            color: colors.text,
            fontSize: '24px',
            fontWeight: '700',
            margin: 0
          }}>
            Photos
          </h1>
          <button
            onClick={onTakePhoto}
            style={{
              padding: '10px 16px',
              backgroundColor: colors.accent,
              border: 'none',
              borderRadius: '10px',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Camera size={18} />
            Take Photo
          </button>
        </div>

        {/* Search Bar */}
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            backgroundColor: colors.backgroundTertiary,
            borderRadius: '10px'
          }}>
            <Search size={18} color={colors.textTertiary} />
            <input
              type="text"
              placeholder="Search rooms, phases, jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: colors.text,
                fontSize: '15px'
              }}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: '10px 14px',
              backgroundColor: showFilters ? colors.accent : colors.backgroundTertiary,
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Filter size={18} color={showFilters ? '#FFFFFF' : colors.textSecondary} />
          </button>
        </div>

        {/* Filter Pills */}
        {showFilters && (
          <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: '12px',
            flexWrap: 'wrap'
          }}>
            <FilterPill 
              label="All Photos" 
              active={filterType === 'all'}
              onClick={() => { setFilterType('all'); setSelectedJobId(null); }}
              colors={colors}
            />
            <FilterPill 
              label="My Jobs Only" 
              active={filterType === 'my-jobs'}
              onClick={() => { setFilterType('my-jobs'); setSelectedJobId(null); }}
              colors={colors}
            />
            {jobs.map(job => (
              <FilterPill 
                key={job.id}
                label={job.clientName}
                active={filterType === 'job' && selectedJobId === job.id}
                onClick={() => { setFilterType('job'); setSelectedJobId(job.id); }}
                colors={colors}
              />
            ))}
          </div>
        )}
      </div>

      {/* Photo Grid */}
      <div style={{ padding: '16px 20px' }}>
        {Object.entries(groupedPhotos).map(([date, datePhotos]) => (
          <div key={date} style={{ marginBottom: '24px' }}>
            <h3 style={{
              color: colors.textSecondary,
              fontSize: '13px',
              fontWeight: '600',
              margin: '0 0 12px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {date}
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '4px'
            }}>
              {datePhotos.map(photo => (
                <PhotoThumbnail
                  key={photo.id}
                  photo={photo}
                  onClick={() => setSelectedPhoto(photo)}
                  colors={colors}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px'
          }}>
            <Camera size={48} color={colors.textTertiary} style={{ marginBottom: '16px' }} />
            <p style={{ color: colors.textSecondary, fontSize: '16px', marginBottom: '8px' }}>
              No photos found
            </p>
            <p style={{ color: colors.textTertiary, fontSize: '14px' }}>
              {searchQuery ? 'Try a different search' : 'Take your first photo!'}
            </p>
          </div>
        )}
      </div>

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <PhotoDetailModal
          photo={selectedPhoto}
          photos={filteredPhotos}
          onClose={() => setSelectedPhoto(null)}
          onShare={onSharePhoto}
          onNavigate={(photo) => setSelectedPhoto(photo)}
          colors={colors}
        />
      )}
    </div>
  );
}

// Filter Pill Component
function FilterPill({ label, active, onClick, colors }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 14px',
        backgroundColor: active ? colors.accent : colors.backgroundTertiary,
        border: 'none',
        borderRadius: '20px',
        color: active ? '#FFFFFF' : colors.textSecondary,
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      }}
    >
      {label}
    </button>
  );
}

// Photo Thumbnail Component
function PhotoThumbnail({ photo, onClick, colors }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        aspectRatio: '1',
        backgroundColor: colors.backgroundSecondary,
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        overflow: 'hidden',
        borderRadius: '4px'
      }}
    >
      <img
        src={photo.url}
        alt={photo.room}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      
      {/* Indicators */}
      <div style={{
        position: 'absolute',
        bottom: '4px',
        left: '4px',
        display: 'flex',
        gap: '2px'
      }}>
        {photo.gpsVerified && (
          <div style={{
            width: '18px',
            height: '18px',
            borderRadius: '4px',
            backgroundColor: 'rgba(79, 106, 65, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MapPin size={10} color="#FFFFFF" />
          </div>
        )}
        {photo.sharedWithCustomer && (
          <div style={{
            width: '18px',
            height: '18px',
            borderRadius: '4px',
            backgroundColor: 'rgba(15, 123, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Eye size={10} color="#FFFFFF" />
          </div>
        )}
      </div>

      {/* Phase Badge */}
      <div style={{
        position: 'absolute',
        top: '4px',
        right: '4px',
        padding: '2px 6px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: '4px'
      }}>
        <span style={{ color: '#FFFFFF', fontSize: '9px', fontWeight: '600' }}>
          {photo.phase}
        </span>
      </div>
    </button>
  );
}

// Photo Detail Modal
function PhotoDetailModal({ photo, photos, onClose, onShare, onNavigate, colors }: any) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  const currentIndex = photos.findIndex((p: Photo) => p.id === photo.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const handlePrev = () => {
    if (hasPrev) onNavigate(photos[currentIndex - 1]);
  };

  const handleNext = () => {
    if (hasNext) onNavigate(photos[currentIndex + 1]);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.95)',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        paddingTop: 'max(16px, env(safe-area-inset-top))',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={onClose}
          style={{
            padding: '10px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
        >
          <X size={24} color="#FFFFFF" />
        </button>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            style={{
              padding: '10px 16px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Share2 size={18} color="#FFFFFF" />
            <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}>Share</span>
          </button>
          <button
            onClick={() => console.log('Annotate')}
            style={{
              padding: '10px 16px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Edit3 size={18} color="#FFFFFF" />
            <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}>Annotate</span>
          </button>
        </div>
      </div>

      {/* Share Menu */}
      {showShareMenu && (
        <div style={{
          position: 'absolute',
          top: '70px',
          right: '20px',
          backgroundColor: colors.backgroundSecondary,
          borderRadius: '12px',
          padding: '8px',
          zIndex: 10,
          minWidth: '200px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          <ShareOption
            icon={Building}
            label="Share with Admin"
            checked={photo.sharedWithAdmin}
            onChange={(checked) => onShare(photo.id, 'admin', checked)}
            colors={colors}
          />
          <ShareOption
            icon={Users}
            label="Share with Customer"
            checked={photo.sharedWithCustomer}
            onChange={(checked) => onShare(photo.id, 'customer', checked)}
            colors={colors}
          />
        </div>
      )}

      {/* Image */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '20px'
      }}>
        {/* Prev Button */}
        {hasPrev && (
          <button
            onClick={handlePrev}
            style={{
              position: 'absolute',
              left: '10px',
              padding: '16px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={24} color="#FFFFFF" />
          </button>
        )}

        <img
          src={photo.url}
          alt={photo.room}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: '8px'
          }}
        />

        {/* Next Button */}
        {hasNext && (
          <button
            onClick={handleNext}
            style={{
              position: 'absolute',
              right: '10px',
              padding: '16px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer'
            }}
          >
            <ChevronRight size={24} color="#FFFFFF" />
          </button>
        )}
      </div>

      {/* Photo Info */}
      <div style={{
        padding: '20px',
        paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
        backgroundColor: 'rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '700' }}>
            {photo.room}
          </span>
          <span style={{
            padding: '4px 12px',
            backgroundColor: getPhaseColor(photo.phase),
            borderRadius: '12px',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: '700'
          }}>
            {photo.phase}
          </span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: '0 0 4px 0' }}>
          {photo.jobName}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} color="rgba(255,255,255,0.5)" />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
              {photo.timestamp}
            </span>
          </div>
          {photo.gpsVerified && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} color="#4F6A41" />
              <span style={{ color: '#4F6A41', fontSize: '12px' }}>GPS Verified</span>
            </div>
          )}
        </div>
        {photo.notes && (
          <p style={{ 
            color: 'rgba(255,255,255,0.8)', 
            fontSize: '14px', 
            margin: '12px 0 0 0',
            padding: '12px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '8px'
          }}>
            {photo.notes}
          </p>
        )}
      </div>
    </div>
  );
}

// Share Option Component
function ShareOption({ icon: Icon, label, checked, onChange, colors }: any) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        textAlign: 'left'
      }}
    >
      <Icon size={20} color={colors.textSecondary} />
      <span style={{ flex: 1, color: colors.text, fontSize: '14px' }}>{label}</span>
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '6px',
        backgroundColor: checked ? colors.accent : colors.backgroundTertiary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {checked && <Check size={14} color="#FFFFFF" />}
      </div>
    </button>
  );
}

function getPhaseColor(phase: string): string {
  const phaseColors: Record<string, string> = {
    'Before': '#F4B400',
    'Demo': '#E74C3C',
    'Prep': '#9B59B6',
    'Install': '#3498DB',
    'Sand': '#95A5A6',
    'Stain': '#8B4513',
    'Finish': '#27AE60',
    'After': '#4CAF50',
    'Problem Area': '#E74C3C'
  };
  return phaseColors[phase] || '#6E8B3D';
}
