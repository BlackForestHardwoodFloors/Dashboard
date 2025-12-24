import React, { useState } from 'react';
import { 
  X,
  Download,
  Share2,
  Star,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  User,
  Clock,
  Home,
  Tag,
  FileText,
  Eye,
  EyeOff,
  Zap,
  Edit,
  CheckCircle2,
  AlertCircle,
  Maximize2,
  Minimize2
} from 'lucide-react';

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
}

interface PhotoDetailModalProps {
  photo: Photo;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const COMPANYCAM_BLUE = '#0F7BFF';
const GOLD_CTA = '#C9A049';

export default function PhotoDetailModal({ 
  photo, 
  isOpen, 
  onClose, 
  onNext, 
  onPrevious,
  hasNext = false,
  hasPrevious = false
}: PhotoDetailModalProps) {
  const [showClientPortal, setShowClientPortal] = useState(photo.showInClientPortal);
  const [isFavorite, setIsFavorite] = useState(photo.isFavorite);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && hasPrevious) onPrevious?.();
    if (e.key === 'ArrowRight' && hasNext) onNext?.();
    if (e.key === 'Escape') {
      if (isFullscreen) {
        setIsFullscreen(false);
      } else {
        onClose();
      }
    }
    if (e.key === 'f' || e.key === 'F') setIsFullscreen(!isFullscreen);
  };

  const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      'Before': '#F4B400',
      'Demo': '#E74C3C',
      'Prep': '#9B59B6',
      'Install': '#3498DB',
      'Sand': '#95A5A6',
      'Sanding': '#95A5A6',
      'Stain': '#8B4513',
      'Finish': '#27AE60',
      'After': '#4CAF50',
      'Cleanup': '#34495E',
      'During': '#3B9CAA'
    };
    return colors[phase] || '#6E8B3D';
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Fullscreen Mode */}
      {isFullscreen ? (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          {/* Fullscreen Image */}
          <img
            src={photo.url}
            alt={`${photo.room} - ${photo.phase}`}
            onClick={() => setIsFullscreen(false)}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              cursor: 'zoom-out'
            }}
          />
          
          {/* Fullscreen Navigation */}
          {hasPrevious && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrevious?.();
              }}
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <ChevronLeft size={32} />
            </button>
          )}
          
          {hasNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext?.();
              }}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <ChevronRight size={32} />
            </button>
          )}
          
          {/* Fullscreen Header */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '20px 24px',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            <div>
              <h2 style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: '600', margin: '0 0 4px 0' }}>
                {photo.jobName}
              </h2>
              <p style={{ color: '#A0A0A0', fontSize: '13px', margin: 0 }}>
                {photo.room} • {photo.phase} • {photo.timestamp}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
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
                  fontWeight: '600'
                }}
              >
                <Minimize2 size={16} />
                Exit Fullscreen
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
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
          
          {/* Fullscreen Footer Hint */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(10px)',
            color: '#A0A0A0',
            fontSize: '12px'
          }}>
            Press <kbd style={{ backgroundColor: '#333', padding: '2px 6px', borderRadius: '4px', margin: '0 4px' }}>ESC</kbd> or click image to exit • 
            <kbd style={{ backgroundColor: '#333', padding: '2px 6px', borderRadius: '4px', margin: '0 4px' }}>←</kbd>
            <kbd style={{ backgroundColor: '#333', padding: '2px 6px', borderRadius: '4px', margin: '0 4px' }}>→</kbd> to navigate
          </div>
        </div>
      ) : (
        <>
      {/* Navigation Arrows */}
      {hasPrevious && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrevious?.();
          }}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            zIndex: 10001
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = COMPANYCAM_BLUE;
            e.currentTarget.style.borderColor = COMPANYCAM_BLUE;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext?.();
          }}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            zIndex: 10001
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = COMPANYCAM_BLUE;
            e.currentTarget.style.borderColor = COMPANYCAM_BLUE;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <ChevronRight size={28} />
        </button>
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '95%',
          maxWidth: '1400px',
          height: '90vh',
          display: 'flex',
          backgroundColor: '#1A1A1A',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid #2D2D2D'
        }}
      >
        {/* Left Side - Image */}
        <div style={{
          flex: '1 1 70%',
          backgroundColor: '#0D0D0D',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {/* Header */}
          <div style={{
            padding: '20px 24px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid #2D2D2D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10
          }}>
            <div>
              <h2 style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: '600', margin: '0 0 4px 0' }}>
                {photo.jobName}
              </h2>
              <p style={{ color: '#A0A0A0', fontSize: '13px', margin: 0 }}>
                {photo.room} • {photo.timestamp}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: isFavorite ? GOLD_CTA : 'transparent',
                  border: `1px solid ${isFavorite ? GOLD_CTA : '#3D3D3D'}`,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Star size={18} fill={isFavorite ? '#FFFFFF' : 'none'} />
              </button>
              <button
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  border: '1px solid #3D3D3D',
                  color: '#E0E0E0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COMPANYCAM_BLUE;
                  e.currentTarget.style.backgroundColor = `${COMPANYCAM_BLUE}22`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#3D3D3D';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Download size={18} />
              </button>
              <button
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  border: '1px solid #3D3D3D',
                  color: '#E0E0E0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COMPANYCAM_BLUE;
                  e.currentTarget.style.backgroundColor = `${COMPANYCAM_BLUE}22`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#3D3D3D';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Share2 size={18} />
              </button>
              <button
                onClick={onClose}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  border: '1px solid #3D3D3D',
                  color: '#E0E0E0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#E74C3C';
                  e.currentTarget.style.backgroundColor = '#E74C3C22';
                  e.currentTarget.style.color = '#E74C3C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#3D3D3D';
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#E0E0E0';
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Image */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 40px 40px 40px',
            position: 'relative'
          }}>
            <img
              src={photo.url}
              alt={`${photo.room} - ${photo.phase}`}
              onClick={() => setIsFullscreen(true)}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '8px',
                cursor: 'zoom-in'
              }}
            />
            
            {/* Fullscreen Button */}
            <button
              onClick={() => setIsFullscreen(true)}
              style={{
                position: 'absolute',
                bottom: '50px',
                right: '50px',
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COMPANYCAM_BLUE;
                e.currentTarget.style.borderColor = COMPANYCAM_BLUE;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <Maximize2 size={14} />
              Fullscreen
            </button>
          </div>
        </div>

        {/* Right Side - Details Panel */}
        <div style={{
          flex: '0 0 400px',
          backgroundColor: '#1A1A1A',
          borderLeft: '1px solid #2D2D2D',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '24px' }}>
            {/* Phase Badge */}
            <div style={{
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: getPhaseColor(photo.phase),
              marginBottom: '20px'
            }}>
              <span style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: '700' }}>
                {photo.phase.toUpperCase()}
              </span>
            </div>

            {/* Employee Info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              backgroundColor: '#2D2D2D',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <img
                src={photo.employeeAvatar}
                alt={photo.employeeName}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>
                  {photo.employeeName}
                </div>
                <div style={{ color: '#A0A0A0', fontSize: '12px' }}>
                  {photo.timestamp}
                </div>
              </div>
            </div>

            {/* AI Summary */}
            {photo.aiSummary && (
              <div style={{
                padding: '16px',
                backgroundColor: '#2D2D2D',
                borderRadius: '10px',
                borderLeft: `4px solid ${COMPANYCAM_BLUE}`,
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Zap size={16} color={COMPANYCAM_BLUE} />
                  <span style={{ color: COMPANYCAM_BLUE, fontSize: '12px', fontWeight: '700' }}>
                    AI SUMMARY
                  </span>
                </div>
                <p style={{ color: '#E0E0E0', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                  {photo.aiSummary}
                </p>
              </div>
            )}

            {/* Details */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                Details
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Home size={16} color="#A0A0A0" />
                  <span style={{ color: '#E0E0E0', fontSize: '13px' }}>
                    <span style={{ color: '#A0A0A0' }}>Room:</span> {photo.room}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={16} color="#A0A0A0" />
                  <span style={{ color: '#E0E0E0', fontSize: '13px' }}>
                    <span style={{ color: '#A0A0A0' }}>Type:</span> {photo.type}
                  </span>
                </div>
                {photo.gpsVerified && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin size={16} color={COMPANYCAM_BLUE} />
                    <span style={{ color: COMPANYCAM_BLUE, fontSize: '13px', fontWeight: '600' }}>
                      GPS Verified
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {photo.tags.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                  Tags
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {photo.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#2D2D2D',
                        border: `1px solid ${COMPANYCAM_BLUE}`,
                        borderRadius: '6px',
                        color: COMPANYCAM_BLUE,
                        fontSize: '11px',
                        fontWeight: '600'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {photo.notes && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                  Notes
                </h3>
                <p style={{
                  color: '#E0E0E0',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  margin: 0,
                  padding: '12px',
                  backgroundColor: '#2D2D2D',
                  borderRadius: '8px'
                }}>
                  {photo.notes}
                </p>
              </div>
            )}

            {/* Client Portal Toggle */}
            <div style={{
              padding: '16px',
              backgroundColor: showClientPortal ? '#7BAA8E22' : '#2D2D2D',
              border: `1px solid ${showClientPortal ? '#7BAA8E' : '#3D3D3D'}`,
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showClientPortal}
                  onChange={(e) => setShowClientPortal(e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#7BAA8E'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    {showClientPortal ? <Eye size={16} color="#7BAA8E" /> : <EyeOff size={16} color="#666" />}
                    <span style={{ color: showClientPortal ? '#7BAA8E' : '#E0E0E0', fontSize: '13px', fontWeight: '600' }}>
                      Show in Client Portal
                    </span>
                  </div>
                  <p style={{ color: '#A0A0A0', fontSize: '11px', margin: 0 }}>
                    Client can view this photo in their portal
                  </p>
                </div>
              </label>
            </div>

            {/* Problem Area */}
            {photo.isProblemArea && photo.problemType && (
              <div style={{
                padding: '16px',
                backgroundColor: '#E74C3C22',
                border: '1px solid #E74C3C',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <AlertCircle size={20} color="#E74C3C" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ color: '#E74C3C', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>
                    PROBLEM AREA
                  </div>
                  <div style={{ color: '#E0E0E0', fontSize: '12px' }}>
                    {photo.problemType}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}