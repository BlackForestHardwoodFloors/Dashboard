import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Camera,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Clock,
  User,
  AlertCircle,
  Eye,
  Image as ImageIcon,
  MessageCircle,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useTheme } from './ThemeProvider';

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
  showInClientPortal: boolean;
  isProblemArea: boolean;
  gpsVerified: boolean;
  isFavorite: boolean;
  hasNewNotes?: boolean;
}

interface EmployeePhotosScreenProps {
  photos: Photo[];
  jobs: Array<{ id: string; name: string }>;
  onTakePhoto: () => void;
  filterJobId?: string;
  onClose?: () => void;
}

export function EmployeePhotosScreen({
  photos,
  jobs,
  onTakePhoto,
  filterJobId,
  onClose
}: EmployeePhotosScreenProps) {
  const { colors } = useTheme();

  const [selectedJobId, setSelectedJobId] = useState<string>(filterJobId || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);

  // swipe state
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const minSwipeDistance = 50;

  // pull to refresh
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // image loading
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // ✅ compute first
  const filteredPhotos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return photos.filter((photo) => {
      const matchesJob = selectedJobId === 'all' || photo.jobId === selectedJobId;

      const matchesSearch =
        q === '' ||
        photo.jobName.toLowerCase().includes(q) ||
        photo.room.toLowerCase().includes(q) ||
        photo.phase.toLowerCase().includes(q) ||
        photo.employeeName.toLowerCase().includes(q);

      return matchesJob && matchesSearch;
    });
  }, [photos, selectedJobId, searchQuery]);

  const groupedPhotos = useMemo(() => {
    return filteredPhotos.reduce((groups, photo) => {
      const date = photo.timestamp.split(',')[0];
      if (!groups[date]) groups[date] = [];
      groups[date].push(photo);
      return groups;
    }, {} as Record<string, Photo[]>);
  }, [filteredPhotos]);

  const handleImageLoad = useCallback((photoId: string) => {
    setLoadedImages((prev) => new Set(prev).add(photoId));
  }, []);

  const openFullscreen = (photo: Photo) => {
    const index = filteredPhotos.findIndex((p) => p.id === photo.id);
    setFullscreenIndex(index >= 0 ? index : 0);
    setSelectedPhoto(photo);
  };

  const goToPrevious = () => {
    if (filteredPhotos.length === 0) return;
    const newIndex = fullscreenIndex > 0 ? fullscreenIndex - 1 : filteredPhotos.length - 1;
    setFullscreenIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex] ?? null);
  };

  const goToNext = () => {
    if (filteredPhotos.length === 0) return;
    const newIndex = fullscreenIndex < filteredPhotos.length - 1 ? fullscreenIndex + 1 : 0;
    setFullscreenIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex] ?? null);
  };

  // swipe handlers (fullscreen)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setSwipeOffset(0);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart) return;

      const currentX = e.targetTouches[0].clientX;
      const currentY = e.targetTouches[0].clientY;
      const diffX = touchStart.x - currentX;
      const diffY = Math.abs(touchStart.y - currentY);

      if (Math.abs(diffX) > diffY) {
        setSwipeOffset(-diffX * 0.3);
        setTouchEnd({ x: currentX, y: currentY });
      }
    },
    [touchStart]
  );

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) {
      setSwipeOffset(0);
      return;
    }

    const distanceX = touchStart.x - touchEnd.x;

    if (Math.abs(distanceX) > minSwipeDistance) {
      if (distanceX > 0 && fullscreenIndex < filteredPhotos.length - 1) {
        const nextIndex = fullscreenIndex + 1;
        setFullscreenIndex(nextIndex);
        setSelectedPhoto(filteredPhotos[nextIndex] ?? null);
      } else if (distanceX < 0 && fullscreenIndex > 0) {
        const prevIndex = fullscreenIndex - 1;
        setFullscreenIndex(prevIndex);
        setSelectedPhoto(filteredPhotos[prevIndex] ?? null);
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
    setSwipeOffset(0);
  }, [touchStart, touchEnd, fullscreenIndex, filteredPhotos]);

  // pull-to-refresh handlers
  const handlePullStart = (e: React.TouchEvent) => {
    const scrollTop = scrollContainerRef.current?.scrollTop || 0;
    if (scrollTop <= 0) {
      setTouchStart({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY
      });
    }
  };

  const handlePullMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const scrollTop = scrollContainerRef.current?.scrollTop || 0;
    if (scrollTop > 0) return;

    const distance = e.targetTouches[0].clientY - touchStart.y;
    if (distance > 0 && !isRefreshing) {
      e.preventDefault();
      setPullDistance(Math.min(distance * 0.4, 80));
    }
  };

  const handlePullEnd = () => {
    if (pullDistance > 50 && !isRefreshing) {
      setIsRefreshing(true);
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      }, 1500);
    } else {
      setPullDistance(0);
    }
    setTouchStart(null);
  };

  // keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') setSelectedPhoto(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPhoto, fullscreenIndex, filteredPhotos.length]);

  const getPhaseColor = (phase: string) => {
    const phaseColors: Record<string, string> = {
      Before: '#F4B400',
      Demo: '#E74C3C',
      Prep: '#9B59B6',
      Install: '#3498DB',
      Sand: '#95A5A6',
      Stain: '#8B4513',
      Finish: '#27AE60',
      After: '#4CAF50',
      'Problem Area': '#E74C3C'
    };
    return phaseColors[phase] || '#6E8B3D';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background, paddingBottom: '100px' }}>
      {/* Header */}
      <div
        style={{
          padding: '16px',
          paddingTop: 'max(16px, env(safe-area-inset-top))',
          backgroundColor: colors.backgroundSecondary,
          borderBottom: `1px solid ${colors.border}`,
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          {onClose ? (
            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: colors.backgroundTertiary,
                border: 'none',
                color: colors.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={20} />
            </button>
          ) : (
            <div style={{ width: 36 }} />
          )}

          <h1
            style={{
              color: colors.text,
              fontSize: '20px',
              fontWeight: '700',
              margin: 0,
              flex: 1,
              textAlign: onClose ? 'center' : 'left'
            }}
          >
            Job Photos
          </h1>

          <button
            onClick={onTakePhoto}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: colors.accent,
              border: 'none',
              color: colors.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Camera size={20} />
          </button>
        </div>

        {/* Search + Job filter */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} color="#666" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search photos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 10px 10px 36px',
                backgroundColor: colors.backgroundTertiary,
                border: `1px solid ${colors.borderLight}`,
                borderRadius: '10px',
                color: colors.text,
                fontSize: '14px'
              }}
            />
          </div>

          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            style={{
              padding: '10px 12px',
              backgroundColor: colors.backgroundTertiary,
              border: `1px solid ${colors.borderLight}`,
              borderRadius: '10px',
              color: colors.text,
              fontSize: '14px',
              minWidth: '120px'
            }}
          >
            <option value="all">All Jobs</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Photo count */}
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.border}` }}>
        <p style={{ color: colors.textSecondary, fontSize: '13px', margin: 0 }}>
          {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? 's' : ''}
          {selectedJobId !== 'all' && ` • ${jobs.find((j) => j.id === selectedJobId)?.name ?? ''}`}
        </p>
      </div>

      {/* Pull to refresh indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: `${Math.max(pullDistance, isRefreshing ? 40 : 0)}px 0`,
            transition: isRefreshing ? 'padding 0.3s' : 'none'
          }}
        >
          {isRefreshing ? (
            <Loader2 size={24} color={colors.accent} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <RefreshCw
              size={24}
              color={pullDistance > 50 ? colors.accent : '#666'}
              style={{ transform: `rotate(${pullDistance * 3}deg)`, transition: 'color 0.2s' }}
            />
          )}
        </div>
      )}

      {/* Scrollable list */}
      <div
        ref={scrollContainerRef}
        onTouchStart={handlePullStart}
        onTouchMove={handlePullMove}
        onTouchEnd={handlePullEnd}
        style={{ WebkitOverflowScrolling: 'touch' as any, overscrollBehavior: 'contain' }}
      >
        {Object.entries(groupedPhotos).length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <ImageIcon size={48} color="#3D3D3D" style={{ marginBottom: '16px' }} />
            <p style={{ color: '#666', fontSize: '16px', margin: '0 0 8px 0' }}>No photos yet</p>
            <p style={{ color: '#4D4D4D', fontSize: '14px', margin: '0 0 20px 0' }}>Take a photo to get started</p>
            <button
              onClick={onTakePhoto}
              style={{
                padding: '12px 24px',
                backgroundColor: colors.accent,
                border: 'none',
                borderRadius: '10px',
                color: colors.text,
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Camera size={18} />
              Take Photo
            </button>
          </div>
        ) : (
          Object.entries(groupedPhotos).map(([date, datePhotos]) => (
            <div key={date} style={{ marginBottom: '8px' }}>
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: colors.backgroundSecondary,
                  position: 'sticky',
                  top: '120px',
                  zIndex: 50
                }}
              >
                <p style={{ color: colors.textSecondary, fontSize: '13px', fontWeight: '600', margin: 0 }}>{date}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', padding: '0 2px' }}>
                {datePhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => openFullscreen(photo)}
                    style={{
                      aspectRatio: '1',
                      position: 'relative',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      backgroundColor: colors.backgroundSecondary
                    }}
                  >
                    {!loadedImages.has(photo.id) && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: '#2A2A2A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <ImageIcon size={24} color="#3D3D3D" />
                      </div>
                    )}

                    <img
                      src={photo.url}
                      alt={photo.room}
                      loading="lazy"
                      onLoad={() => handleImageLoad(photo.id)}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: loadedImages.has(photo.id) ? 1 : 0,
                        transition: 'opacity 0.3s ease'
                      }}
                    />

                    <div
                      style={{
                        position: 'absolute',
                        bottom: '4px',
                        left: '4px',
                        padding: '2px 6px',
                        backgroundColor: getPhaseColor(photo.phase),
                        borderRadius: '4px',
                        fontSize: '9px',
                        fontWeight: '700',
                        color: colors.text
                      }}
                    >
                      {photo.phase}
                    </div>

                    <div style={{ position: 'absolute', top: '4px', right: '4px', display: 'flex', gap: '4px' }}>
                      {photo.isProblemArea && (
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(231, 76, 60, 0.9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <AlertCircle size={12} color="#FFFFFF" />
                        </div>
                      )}
                      {photo.showInClientPortal && (
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(123, 170, 142, 0.9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Eye size={12} color="#FFFFFF" />
                        </div>
                      )}
                      {photo.hasNewNotes && (
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(231, 76, 60, 0.9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <MessageCircle size={12} color="#FFFFFF" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating camera */}
      <button
        onClick={onTakePhoto}
        style={{
          position: 'fixed',
          bottom: 'max(90px, calc(70px + env(safe-area-inset-bottom)))',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: colors.accent,
          border: 'none',
          color: colors.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(15, 123, 255, 0.4)',
          zIndex: 90
        }}
      >
        <Camera size={28} />
      </button>

      {/* Fullscreen */}
      {selectedPhoto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ padding: '16px', paddingTop: 'max(16px, env(safe-area-inset-top))', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: colors.text, fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>{selectedPhoto.jobName}</p>
              <p style={{ color: colors.textSecondary, fontSize: '13px', margin: 0 }}>
                {selectedPhoto.room} • {selectedPhoto.phase}
              </p>
            </div>
            <button
              onClick={() => setSelectedPhoto(null)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: colors.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={24} />
            </button>
          </div>

          <div
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '0 60px', touchAction: 'pan-y', overflow: 'hidden' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {fullscreenIndex > 0 && (
              <div style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', opacity: swipeOffset > 20 ? 0.8 : 0.3, transition: 'opacity 0.2s' }}>
                <ChevronLeft size={40} color="#FFFFFF" />
              </div>
            )}
            {fullscreenIndex < filteredPhotos.length - 1 && (
              <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', opacity: swipeOffset < -20 ? 0.8 : 0.3, transition: 'opacity 0.2s' }}>
                <ChevronRight size={40} color="#FFFFFF" />
              </div>
            )}

            <button
              onClick={goToPrevious}
              style={{
                position: 'absolute',
                left: '10px',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: colors.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={24} />
            </button>

            <img src={selectedPhoto.url} alt={selectedPhoto.room} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px' }} />

            <button
              onClick={goToNext}
              style={{
                position: 'absolute',
                right: '10px',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: colors.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div style={{ padding: '16px', paddingBottom: 'max(16px, env(safe-area-inset-bottom))', backgroundColor: 'rgba(0,0,0,0.8)' }}>
            <p style={{ color: colors.textSecondary, fontSize: '12px', textAlign: 'center', margin: '0 0 12px 0' }}>
              {fullscreenIndex + 1} of {filteredPhotos.length}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} color="#A0A0A0" />
                <span style={{ color: colors.textSecondary, fontSize: '12px' }}>{selectedPhoto.employeeName}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="#A0A0A0" />
                <span style={{ color: colors.textSecondary, fontSize: '12px' }}>{selectedPhoto.timestamp}</span>
              </div>
              {selectedPhoto.gpsVerified && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="#7BAA8E" />
                  <span style={{ color: '#7BAA8E', fontSize: '12px' }}>GPS Verified</span>
                </div>
              )}
            </div>

            {selectedPhoto.notes && (
              <div style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                <p style={{ color: '#E0E0E0', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>{selectedPhoto.notes}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
              {selectedPhoto.showInClientPortal && (
                <div style={{ padding: '6px 12px', backgroundColor: 'rgba(123, 170, 142, 0.2)', border: '1px solid #7BAA8E', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Eye size={14} color="#7BAA8E" />
                  <span style={{ color: '#7BAA8E', fontSize: '12px', fontWeight: '600' }}>In Customer Portal</span>
                </div>
              )}
              {selectedPhoto.isProblemArea && (
                <div style={{ padding: '6px 12px', backgroundColor: 'rgba(231, 76, 60, 0.2)', border: '1px solid #E74C3C', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={14} color="#E74C3C" />
                  <span style={{ color: '#E74C3C', fontSize: '12px', fontWeight: '600' }}>Problem Area</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ padding: '12px', backgroundColor: colors.backgroundSecondary, overflowX: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {filteredPhotos
                .slice(Math.max(0, fullscreenIndex - 4), Math.min(filteredPhotos.length, fullscreenIndex + 5))
                .map((photo, i) => {
                  const start = Math.max(0, fullscreenIndex - 4);
                  const actualIndex = start + i;
                  return (
                    <div
                      key={photo.id}
                      onClick={() => {
                        setFullscreenIndex(actualIndex);
                        setSelectedPhoto(photo);
                      }}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        border: actualIndex === fullscreenIndex ? `2px solid ${colors.accent}` : '2px solid transparent',
                        cursor: 'pointer',
                        flexShrink: 0,
                        opacity: actualIndex === fullscreenIndex ? 1 : 0.6
                      }}
                    >
                      <img src={photo.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
