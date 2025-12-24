import React, { useState, useRef } from 'react';
import { 
  ChevronLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  Users,
  Camera,
  FileText,
  Edit3,
  AlertTriangle,
  Check,
  Plus,
  Send,
  DollarSign,
  Palette,
  CheckCircle2,
  XCircle,
  Loader2,
  Navigation,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import type { Job, Photo, ChangeOrder, Message } from '../EmployeePortal';

interface JobDetailScreenProps {
  job: Job;
  photos: Photo[];
  onClose: () => void;
  onOpenCamera: () => void;
  onCreateChangeOrder: (changeOrder: Omit<ChangeOrder, 'id' | 'createdAt' | 'status'>) => void;
  onStainSignOff: (signatureData: string) => void;
  onSendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
}

type ActiveSection = 'details' | 'photos' | 'change-order' | 'stain-signoff' | 'msds' | 'message';

export function JobDetailScreen({ 
  job, 
  photos, 
  onClose, 
  onOpenCamera,
  onCreateChangeOrder,
  onStainSignOff,
  onSendMessage
}: JobDetailScreenProps) {
  const { colors } = useTheme();
  const [activeSection, setActiveSection] = useState<ActiveSection>('details');

  const renderContent = () => {
    switch (activeSection) {
      case 'details':
        return <DetailsSection job={job} photos={photos} onOpenCamera={onOpenCamera} colors={colors} />;
      case 'photos':
        return <PhotosSection photos={photos} onOpenCamera={onOpenCamera} colors={colors} />;
      case 'change-order':
        return <ChangeOrderSection job={job} onCreate={onCreateChangeOrder} onBack={() => setActiveSection('details')} colors={colors} />;
      case 'stain-signoff':
        return <StainSignOffSection job={job} onSignOff={onStainSignOff} onBack={() => setActiveSection('details')} colors={colors} />;
      case 'msds':
        return <MSDSSection job={job} onBack={() => setActiveSection('details')} colors={colors} />;
      case 'message':
        return <MessageSection job={job} onSend={onSendMessage} onBack={() => setActiveSection('details')} colors={colors} />;
      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={activeSection === 'details' ? onClose : () => setActiveSection('details')}
            style={{
              padding: '8px',
              backgroundColor: colors.backgroundTertiary,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={20} color={colors.text} />
          </button>
          
          <div style={{ flex: 1 }}>
            <h1 style={{ color: colors.text, fontSize: '18px', fontWeight: '700', margin: 0 }}>
              {job.clientName}
            </h1>
            <p style={{ color: colors.textSecondary, fontSize: '13px', margin: '2px 0 0 0' }}>
              {job.jobType} • {job.sqft.toLocaleString()} sq ft
            </p>
          </div>

          <button
            onClick={onOpenCamera}
            style={{
              padding: '10px 14px',
              backgroundColor: colors.accent,
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Camera size={18} color="#FFFFFF" />
            <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '600' }}>
              {photos.length}
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      {renderContent()}

      {/* Bottom Action Bar (only on details view) */}
      {activeSection === 'details' && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px 20px',
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
          backgroundColor: colors.backgroundSecondary,
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          gap: '10px'
        }}>
          <ActionButton 
            icon={Plus} 
            label="Change Order" 
            onClick={() => setActiveSection('change-order')}
            colors={colors}
          />
          <ActionButton 
            icon={Palette} 
            label="Stain Sign Off" 
            onClick={() => setActiveSection('stain-signoff')}
            colors={colors}
            highlight={!job.stainSignedOff && job.stainColor}
          />
          <ActionButton 
            icon={Send} 
            label="Message" 
            onClick={() => setActiveSection('message')}
            colors={colors}
          />
        </div>
      )}
    </div>
  );
}

// Action Button
function ActionButton({ icon: Icon, label, onClick, colors, highlight }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '12px 8px',
        backgroundColor: highlight ? colors.accent : colors.backgroundTertiary,
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px'
      }}
    >
      <Icon size={20} color={highlight ? '#FFFFFF' : colors.textSecondary} />
      <span style={{ 
        color: highlight ? '#FFFFFF' : colors.textSecondary, 
        fontSize: '11px', 
        fontWeight: '600' 
      }}>
        {label}
      </span>
    </button>
  );
}

// Details Section
function DetailsSection({ job, photos, onOpenCamera, colors }: any) {
  return (
    <div style={{ padding: '20px', paddingBottom: '120px' }}>
      {/* Progress */}
      <div style={{
        backgroundColor: colors.backgroundSecondary,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
        border: `1px solid ${colors.border}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: colors.textSecondary, fontSize: '14px' }}>Progress</span>
          <span style={{ color: '#4F6A41', fontSize: '14px', fontWeight: '700' }}>{job.progress}%</span>
        </div>
        <div style={{
          height: '10px',
          backgroundColor: colors.backgroundTertiary,
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${job.progress}%`,
            height: '100%',
            backgroundColor: '#4F6A41',
            borderRadius: '5px'
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <span style={{ color: colors.textTertiary, fontSize: '12px' }}>
            {job.hoursWorked}h / {job.estimatedHours}h estimated
          </span>
          <span style={{ color: colors.textTertiary, fontSize: '12px' }}>
            {photos.length} photos
          </span>
        </div>
      </div>

      {/* Address & Contact */}
      <div style={{
        backgroundColor: colors.backgroundSecondary,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
        border: `1px solid ${colors.border}`
      }}>
        <button
          onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(job.address)}`, '_blank')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            backgroundColor: colors.backgroundTertiary,
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            marginBottom: '12px',
            textAlign: 'left'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: colors.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Navigation size={20} color="#FFFFFF" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: colors.text, fontSize: '14px', fontWeight: '600', margin: 0 }}>
              {job.address}
            </p>
            <p style={{ color: colors.accent, fontSize: '12px', margin: '2px 0 0 0' }}>
              Tap to navigate
            </p>
          </div>
          <ChevronRight size={20} color={colors.textTertiary} />
        </button>

        <div style={{ display: 'flex', gap: '10px' }}>
          <a
            href={`tel:${job.clientPhone}`}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              backgroundColor: colors.backgroundTertiary,
              borderRadius: '10px',
              textDecoration: 'none'
            }}
          >
            <Phone size={18} color={colors.accent} />
            <span style={{ color: colors.text, fontSize: '13px', fontWeight: '600' }}>Call</span>
          </a>
          <a
            href={`mailto:${job.clientEmail}`}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              backgroundColor: colors.backgroundTertiary,
              borderRadius: '10px',
              textDecoration: 'none'
            }}
          >
            <Mail size={18} color={colors.accent} />
            <span style={{ color: colors.text, fontSize: '13px', fontWeight: '600' }}>Email</span>
          </a>
        </div>
      </div>

      {/* Job Briefing */}
      <div style={{
        backgroundColor: colors.backgroundSecondary,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
        border: `1px solid ${colors.border}`
      }}>
        <h3 style={{ color: colors.text, fontSize: '14px', fontWeight: '700', margin: '0 0 10px 0' }}>
          Job Briefing
        </h3>
        <p style={{ color: colors.textSecondary, fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
          {job.briefing}
        </p>
      </div>

      {/* Crew */}
      <div style={{
        backgroundColor: colors.backgroundSecondary,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
        border: `1px solid ${colors.border}`
      }}>
        <h3 style={{ color: colors.text, fontSize: '14px', fontWeight: '700', margin: '0 0 10px 0' }}>
          Crew
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <CrewBadge name={job.foreman} role="Foreman" colors={colors} />
          {job.crew.map((member: string, idx: number) => (
            <CrewBadge key={idx} name={member} colors={colors} />
          ))}
        </div>
      </div>

      {/* Materials */}
      <div style={{
        backgroundColor: colors.backgroundSecondary,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
        border: `1px solid ${colors.border}`
      }}>
        <h3 style={{ color: colors.text, fontSize: '14px', fontWeight: '700', margin: '0 0 10px 0' }}>
          Materials
        </h3>
        {job.materials.map((material: string, idx: number) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 0',
            borderBottom: idx < job.materials.length - 1 ? `1px solid ${colors.border}` : 'none'
          }}>
            <Check size={16} color="#4F6A41" />
            <span style={{ color: colors.text, fontSize: '14px' }}>{material}</span>
          </div>
        ))}
      </div>

      {/* Change Orders */}
      {job.changeOrders.length > 0 && (
        <div style={{
          backgroundColor: colors.backgroundSecondary,
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
          border: `1px solid ${colors.border}`
        }}>
          <h3 style={{ color: colors.text, fontSize: '14px', fontWeight: '700', margin: '0 0 10px 0' }}>
            Change Orders ({job.changeOrders.length})
          </h3>
          {job.changeOrders.map((co: ChangeOrder) => (
            <div key={co.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: `1px solid ${colors.border}`
            }}>
              <div>
                <p style={{ color: colors.text, fontSize: '14px', margin: 0 }}>{co.description}</p>
                <p style={{ color: colors.textSecondary, fontSize: '12px', margin: '2px 0 0 0' }}>
                  ${co.amount.toFixed(2)}
                </p>
              </div>
              <StatusBadge status={co.status} colors={colors} />
            </div>
          ))}
        </div>
      )}

      {/* Notes */}
      {job.notes && (
        <div style={{
          backgroundColor: 'rgba(212, 160, 36, 0.1)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(212, 160, 36, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <AlertTriangle size={16} color="#D4A024" />
            <span style={{ color: '#D4A024', fontSize: '13px', fontWeight: '700' }}>Notes</span>
          </div>
          <p style={{ color: colors.text, fontSize: '14px', margin: 0 }}>
            {job.notes}
          </p>
        </div>
      )}
    </div>
  );
}

// Photos Section
function PhotosSection({ photos, onOpenCamera, colors }: any) {
  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '4px'
      }}>
        {photos.map((photo: Photo) => (
          <div key={photo.id} style={{
            aspectRatio: '1',
            backgroundColor: colors.backgroundSecondary,
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <img
              src={photo.url}
              alt={photo.room}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
        
        {/* Add Photo Button */}
        <button
          onClick={onOpenCamera}
          style={{
            aspectRatio: '1',
            backgroundColor: colors.backgroundSecondary,
            border: `2px dashed ${colors.border}`,
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <Plus size={24} color={colors.textTertiary} />
          <span style={{ color: colors.textTertiary, fontSize: '11px' }}>Add</span>
        </button>
      </div>
    </div>
  );
}

// Change Order Section
function ChangeOrderSection({ job, onCreate, onBack, colors }: any) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!description.trim() || !amount) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      onCreate({
        description: description.trim(),
        amount: parseFloat(amount),
        photos: []
      });
      setIsSubmitting(false);
      onBack();
    }, 500);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: colors.text, fontSize: '18px', fontWeight: '700', margin: '0 0 20px 0' }}>
        Create Change Order
      </h2>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ color: colors.textSecondary, fontSize: '13px', display: 'block', marginBottom: '6px' }}>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the additional work..."
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: colors.backgroundSecondary,
            border: `1px solid ${colors.border}`,
            borderRadius: '10px',
            color: colors.text,
            fontSize: '15px',
            minHeight: '100px',
            resize: 'vertical',
            outline: 'none'
          }}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ color: colors.textSecondary, fontSize: '13px', display: 'block', marginBottom: '6px' }}>
          Amount
        </label>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: colors.backgroundSecondary,
          border: `1px solid ${colors.border}`,
          borderRadius: '10px',
          padding: '0 12px'
        }}>
          <DollarSign size={18} color={colors.textSecondary} />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: 'transparent',
              border: 'none',
              color: colors.text,
              fontSize: '15px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!description.trim() || !amount || isSubmitting}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: (description.trim() && amount && !isSubmitting) ? colors.accent : colors.backgroundTertiary,
          border: 'none',
          borderRadius: '12px',
          color: (description.trim() && amount && !isSubmitting) ? '#FFFFFF' : colors.textTertiary,
          fontSize: '16px',
          fontWeight: '700',
          cursor: (description.trim() && amount && !isSubmitting) ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Change Order'
        )}
      </button>
    </div>
  );
}

// Stain Sign Off Section
function StainSignOffSection({ job, onSignOff, onBack, colors }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(true);
    setHasSignature(true);
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = colors.text;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSubmit = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;
    
    const signatureData = canvas.toDataURL();
    onSignOff(signatureData);
    onBack();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: colors.text, fontSize: '18px', fontWeight: '700', margin: '0 0 20px 0' }}>
        Stain Sign Off
      </h2>

      {/* Stain Color Display */}
      <div style={{
        backgroundColor: colors.backgroundSecondary,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '20px',
        border: `1px solid ${colors.border}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '8px',
            backgroundColor: '#5D4037',
            border: `2px solid ${colors.border}`
          }} />
          <div>
            <p style={{ color: colors.textSecondary, fontSize: '12px', margin: '0 0 4px 0' }}>Stain Color</p>
            <p style={{ color: colors.text, fontSize: '16px', fontWeight: '700', margin: 0 }}>
              {job.stainColor || 'Not specified'}
            </p>
          </div>
        </div>
      </div>

      {/* Already Signed */}
      {job.stainSignedOff ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '20px',
          backgroundColor: 'rgba(79, 106, 65, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(79, 106, 65, 0.3)'
        }}>
          <CheckCircle2 size={24} color="#4F6A41" />
          <div>
            <p style={{ color: '#4F6A41', fontSize: '16px', fontWeight: '700', margin: 0 }}>
              Already Signed Off
            </p>
            <p style={{ color: colors.textSecondary, fontSize: '13px', margin: '4px 0 0 0' }}>
              Client approved the stain color
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Signature Pad */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ color: colors.textSecondary, fontSize: '13px' }}>
                Client Signature
              </label>
              {hasSignature && (
                <button
                  onClick={clearSignature}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: colors.backgroundTertiary,
                    border: 'none',
                    borderRadius: '6px',
                    color: colors.textSecondary,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Clear
                </button>
              )}
            </div>
            <div style={{
              backgroundColor: colors.backgroundSecondary,
              border: `2px dashed ${colors.border}`,
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <canvas
                ref={canvasRef}
                width={350}
                height={150}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                style={{
                  width: '100%',
                  height: '150px',
                  cursor: 'crosshair',
                  touchAction: 'none'
                }}
              />
            </div>
            <p style={{ color: colors.textTertiary, fontSize: '12px', textAlign: 'center', marginTop: '8px' }}>
              Sign above to approve stain color
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!hasSignature}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: hasSignature ? '#4F6A41' : colors.backgroundTertiary,
              border: 'none',
              borderRadius: '12px',
              color: hasSignature ? '#FFFFFF' : colors.textTertiary,
              fontSize: '16px',
              fontWeight: '700',
              cursor: hasSignature ? 'pointer' : 'default'
            }}
          >
            Confirm Stain Approval
          </button>
        </>
      )}
    </div>
  );
}

// MSDS Section
function MSDSSection({ job, onBack, colors }: any) {
  // Map materials to MSDS sheets
  const msdsSheets = job.materials.map((material: string, idx: number) => ({
    id: idx,
    name: material,
    hasSheet: true
  }));

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: colors.text, fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0' }}>
        MSDS Sheets
      </h2>
      <p style={{ color: colors.textSecondary, fontSize: '14px', marginBottom: '20px' }}>
        Safety data sheets for materials on this job
      </p>

      {msdsSheets.map((sheet: any) => (
        <button
          key={sheet.id}
          onClick={() => console.log('Open MSDS:', sheet.name)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '14px 16px',
            backgroundColor: colors.backgroundSecondary,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            cursor: 'pointer',
            marginBottom: '10px',
            textAlign: 'left'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'rgba(231, 76, 60, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={20} color="#E74C3C" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: colors.text, fontWeight: '600', margin: 0 }}>{sheet.name}</p>
            <p style={{ color: colors.textSecondary, fontSize: '13px', margin: '2px 0 0 0' }}>
              Tap to view PDF
            </p>
          </div>
          <ChevronRight size={20} color={colors.textTertiary} />
        </button>
      ))}
    </div>
  );
}

// Message Section
function MessageSection({ job, onSend, onBack, colors }: any) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    
    onSend({
      type: 'client',
      from: 'Employee',
      to: job.clientName,
      content: message.trim(),
      read: true,
      jobId: job.id
    });
    
    setMessage('');
    onBack();
  };

  const quickMessages = [
    "On my way, will arrive in about 15 minutes.",
    "Taking lunch break, will resume in 1 hour.",
    "Finished for the day, will return tomorrow at 8 AM.",
    "Need to discuss something with you. Please call when available."
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: colors.text, fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0' }}>
        Message {job.clientName}
      </h2>
      <p style={{ color: colors.textSecondary, fontSize: '13px', marginBottom: '20px' }}>
        Admin will see this message
      </p>

      {/* Quick Messages */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ color: colors.textSecondary, fontSize: '12px', marginBottom: '8px' }}>
          Quick messages:
        </p>
        {quickMessages.map((qm, idx) => (
          <button
            key={idx}
            onClick={() => setMessage(qm)}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: colors.backgroundSecondary,
              border: `1px solid ${colors.border}`,
              borderRadius: '10px',
              color: colors.text,
              fontSize: '14px',
              textAlign: 'left',
              cursor: 'pointer',
              marginBottom: '8px'
            }}
          >
            {qm}
          </button>
        ))}
      </div>

      {/* Custom Message */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Or type a custom message..."
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: colors.backgroundSecondary,
          border: `1px solid ${colors.border}`,
          borderRadius: '10px',
          color: colors.text,
          fontSize: '15px',
          minHeight: '100px',
          resize: 'vertical',
          outline: 'none',
          marginBottom: '16px'
        }}
      />

      <button
        onClick={handleSend}
        disabled={!message.trim()}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: message.trim() ? colors.accent : colors.backgroundTertiary,
          border: 'none',
          borderRadius: '12px',
          color: message.trim() ? '#FFFFFF' : colors.textTertiary,
          fontSize: '16px',
          fontWeight: '700',
          cursor: message.trim() ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <Send size={20} />
        Send Message
      </button>
    </div>
  );
}

// Helper Components
function CrewBadge({ name, role, colors }: any) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      backgroundColor: colors.backgroundTertiary,
      borderRadius: '20px'
    }}>
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: role ? colors.accent : colors.textTertiary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span style={{ color: '#FFFFFF', fontSize: '10px', fontWeight: '700' }}>
          {name.split(' ').map((n: string) => n[0]).join('')}
        </span>
      </div>
      <span style={{ color: colors.text, fontSize: '13px', fontWeight: '500' }}>{name}</span>
      {role && (
        <span style={{
          padding: '2px 6px',
          backgroundColor: colors.accent,
          borderRadius: '4px',
          color: '#FFFFFF',
          fontSize: '10px',
          fontWeight: '700'
        }}>
          {role}
        </span>
      )}
    </div>
  );
}

function StatusBadge({ status, colors }: any) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    'Pending': { bg: 'rgba(212, 160, 36, 0.2)', text: '#D4A024' },
    'Approved': { bg: 'rgba(79, 106, 65, 0.2)', text: '#4F6A41' },
    'Rejected': { bg: 'rgba(231, 76, 60, 0.2)', text: '#E74C3C' }
  };
  
  const style = statusColors[status] || statusColors['Pending'];
  
  return (
    <span style={{
      padding: '4px 10px',
      backgroundColor: style.bg,
      borderRadius: '12px',
      color: style.text,
      fontSize: '12px',
      fontWeight: '700'
    }}>
      {status}
    </span>
  );
}
