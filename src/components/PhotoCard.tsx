import React, { useState } from 'react';
import { 
  MapPin, 
  CheckCircle2, 
  Star, 
  AlertCircle,
  Eye,
  User,
  Clock,
  MessageCircle
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
  hasNewNotes?: boolean;
  notesUpdatedAt?: string;
  notesUpdatedBy?: string;
}

interface PhotoCardProps {
  photo: Photo;
  isSelected: boolean;
  onSelect: () => void;
  onClick: () => void;
}

const COMPANYCAM_BLUE = '#0F7BFF';

export default function PhotoCard({ photo, isSelected, onSelect, onClick }: PhotoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

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
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#1A1A1A',
        borderRadius: '12px',
        overflow: 'hidden',
        border: isSelected ? `2px solid ${COMPANYCAM_BLUE}` : '1px solid #2D2D2D',
        cursor: 'pointer',
        transition: 'all 0.2s',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? `0 8px 20px rgba(59, 156, 170, 0.3)` 
          : '0 2px 8px rgba(0,0,0,0.2)',
        position: 'relative'
      }}
    >
      {/* Image Container */}
      <div style={{ 
        position: 'relative',
        paddingTop: '75%',
        overflow: 'hidden',
        backgroundColor: '#0D0D0D'
      }}>
        <img
          src={photo.url}
          alt={`${photo.room} - ${photo.phase}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.3s'
          }}
        />
        
        {/* Checkbox Overlay */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            backgroundColor: isSelected ? COMPANYCAM_BLUE : 'rgba(0,0,0,0.6)',
            border: isSelected ? 'none' : '2px solid #FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            backdropFilter: 'blur(8px)'
          }}
        >
          {isSelected && <CheckCircle2 size={16} color="#FFFFFF" />}
        </div>

        {/* Badges */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          display: 'flex',
          gap: '6px'
        }}>
          {photo.hasNewNotes && (
            <div style={{
              padding: '4px 8px',
              borderRadius: '6px',
              backgroundColor: 'rgba(231, 76, 60, 0.95)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <MessageCircle size={12} color="#FFFFFF" />
              <span style={{ color: '#FFFFFF', fontSize: '9px', fontWeight: '700' }}>NEW</span>
            </div>
          )}
          {photo.gpsVerified && (
            <div style={{
              padding: '4px 6px',
              borderRadius: '6px',
              backgroundColor: 'rgba(123, 170, 142, 0.9)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}>
              <MapPin size={10} color="#FFFFFF" />
              <CheckCircle2 size={10} color="#FFFFFF" />
            </div>
          )}
          {!photo.gpsVerified && photo.latitude && (
            <div style={{
              padding: '4px 6px',
              borderRadius: '6px',
              backgroundColor: 'rgba(231, 76, 60, 0.9)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}>
              <MapPin size={10} color="#FFFFFF" />
              <AlertCircle size={10} color="#FFFFFF" />
            </div>
          )}
          {photo.isFavorite && (
            <div style={{
              padding: '4px 6px',
              borderRadius: '6px',
              backgroundColor: 'rgba(201, 160, 73, 0.9)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Star size={12} color="#FFFFFF" fill="#FFFFFF" />
            </div>
          )}
          {photo.isProblemArea && (
            <div style={{
              padding: '4px 6px',
              borderRadius: '6px',
              backgroundColor: 'rgba(231, 76, 60, 0.9)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <AlertCircle size={12} color="#FFFFFF" />
            </div>
          )}
          {photo.showInClientPortal && (
            <div style={{
              padding: '4px 6px',
              borderRadius: '6px',
              backgroundColor: 'rgba(123, 170, 142, 0.9)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Eye size={12} color="#FFFFFF" />
            </div>
          )}
        </div>

        {/* GPS Badge */}
        {photo.gpsVerified && (
          <div style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            padding: '4px 8px',
            borderRadius: '6px',
            backgroundColor: `${COMPANYCAM_BLUE}DD`,
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <MapPin size={10} color="#FFFFFF" />
            <span style={{ color: '#FFFFFF', fontSize: '9px', fontWeight: '600' }}>
              GPS
            </span>
          </div>
        )}

        {/* Phase Badge */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          padding: '4px 10px',
          borderRadius: '6px',
          backgroundColor: `${getPhaseColor(photo.phase)}DD`,
          backdropFilter: 'blur(8px)'
        }}>
          <span style={{ color: '#FFFFFF', fontSize: '10px', fontWeight: '700' }}>
            {photo.phase.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div style={{ padding: '12px' }}>
        {/* Room & Type */}
        <div style={{ marginBottom: '8px' }}>
          <h4 style={{ 
            color: '#FFFFFF', 
            fontSize: '14px', 
            fontWeight: '600', 
            margin: '0 0 4px 0',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {photo.room}
          </h4>
          <p style={{ 
            color: '#A0A0A0', 
            fontSize: '11px', 
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {photo.type}
          </p>
        </div>

        {/* Employee & Time */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginBottom: '8px',
          paddingBottom: '8px',
          borderBottom: '1px solid #2D2D2D'
        }}>
          <img
            src={photo.employeeAvatar}
            alt={photo.employeeName}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <span style={{ 
              color: '#E0E0E0', 
              fontSize: '11px',
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {photo.employeeName}
            </span>
          </div>
          <Clock size={10} color="#666" />
          <span style={{ color: '#666', fontSize: '10px' }}>
            {photo.timestamp.split(' ').slice(-2).join(' ')}
          </span>
        </div>

        {/* Tags */}
        {photo.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {photo.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                style={{
                  padding: '3px 8px',
                  backgroundColor: '#2D2D2D',
                  borderRadius: '4px',
                  color: '#A0A0A0',
                  fontSize: '9px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px'
                }}
              >
                {tag}
              </span>
            ))}
            {photo.tags.length > 2 && (
              <span style={{
                padding: '3px 8px',
                color: COMPANYCAM_BLUE,
                fontSize: '9px',
                fontWeight: '600'
              }}>
                +{photo.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}