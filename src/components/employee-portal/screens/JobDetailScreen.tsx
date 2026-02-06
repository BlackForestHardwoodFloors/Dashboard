import React, { useState } from 'react';
import { ChevronLeft, MapPin, Phone, Mail, Calendar, Users, Camera, Send, DollarSign, Palette, Check, Plus, Trash2, ExternalLink, X, PenTool, Loader2 } from 'lucide-react';

import { useTheme } from '../ThemeProvider';
import type { Job, Photo, ChangeOrder, Message } from '../EmployeePortal';
import { StainSignOffModal } from '../StainSignOffModal';

interface JobDetailScreenProps {
  job: Job;
  photos: Photo[];
  onClose: () => void;
  onOpenCamera: () => void;
  onCreateChangeOrder: (changeOrder: Omit<ChangeOrder, 'id' | 'createdAt' | 'status'>) => void;

  // Existing callback
  onStainSignOff: (signatureData: string) => void;

  onSendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  onNavigate?: (page: string) => void;
}

type ActiveSection = 'details' | 'photos' | 'change-order' | 'msds' | 'message';

export function JobDetailScreen({
  job,
  photos,
  onClose,
  onOpenCamera,
  onCreateChangeOrder,
  onStainSignOff,
  onSendMessage,
  onNavigate
}: JobDetailScreenProps) {
  const { colors } = useTheme();
  const [activeSection, setActiveSection] = useState<ActiveSection>('details');

  // ✅ NEW
  const [showStainModal, setShowStainModal] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'details':
        return (
          <DetailsSection
            job={job}
            photos={photos}
            onOpenCamera={onOpenCamera}
            colors={colors}
            onNavigate={onNavigate}
          />
        );
      case 'photos':
        return <PhotosSection photos={photos} onOpenCamera={onOpenCamera} colors={colors} />;
      case 'change-order':
        return (
          <ChangeOrderSection
            job={job}
            onCreate={onCreateChangeOrder}
            onBack={() => setActiveSection('details')}
            colors={colors}
          />
        );
      case 'msds':
        return <MSDSSection job={job} onBack={() => setActiveSection('details')} colors={colors} />;
      case 'message':
        return (
          <MessageSection
            job={job}
            onSend={onSendMessage}
            onBack={() => setActiveSection('details')}
            colors={colors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background }}>
      <div
        style={{
          padding: '16px 20px',
          paddingTop: 'max(16px, env(safe-area-inset-top))',
          backgroundColor: colors.backgroundSecondary,
          borderBottom: `1px solid ${colors.border}`,
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
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
              {job.jobType} • {job.sqft?.toLocaleString?.() ?? job.sqft} sq ft
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
            <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '600' }}>{photos.length}</span>
          </button>
        </div>
      </div>

      {renderContent()}

      {activeSection === 'details' && (
        <div
          style={{
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
          }}
        >
          <ActionButton icon={Plus} label="Change Order" onClick={() => setActiveSection('change-order')} colors={colors} />
          <ActionButton
            icon={Palette}
            label="Stain Sign Off"
            onClick={() => setShowStainModal(true)}
            colors={colors}
            highlight={!job.stainSignedOff && !!job.stainColor}
          />
          <ActionButton icon={Send} label="Message" onClick={() => setActiveSection('message')} colors={colors} />
        </div>
      )}

      <StainSignOffModal
        isOpen={showStainModal}
        onClose={() => setShowStainModal(false)}
        clientName={job.clientName}
        initialStainColor={job.stainColor || ''}
        onSubmit={(payload) => {
          const signatureData =
            payload.signatureMethod === 'draw' ? (payload.signatureDataUrl || '') : payload.typedSignature;
          onStainSignOff(signatureData);
        }}
      />
    </div>
  );
}

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
      <span style={{ color: highlight ? '#FFFFFF' : colors.textSecondary, fontSize: '11px', fontWeight: '600' }}>
        {label}
      </span>
    </button>
  );
}

// Minimal safe stubs for sections (keep your existing sections if you already have them)
function DetailsSection({ job, photos, onOpenCamera, colors, onNavigate }: any) {
  return (
    <div style={{ padding: '20px', paddingBottom: '120px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        <NavTile icon={Calendar} label="Calendar" onClick={() => onNavigate?.('calendar')} colors={colors} />
        <NavTile icon={Camera} label="Photos" onClick={() => onNavigate?.('photos')} colors={colors} />
        <NavTile icon={Send} label="Messages" onClick={() => onNavigate?.('messages')} colors={colors} />
        <NavTile icon={Users} label="Me" onClick={() => onNavigate?.('me')} colors={colors} />
      </div>

      <div
        style={{
          padding: '18px',
          backgroundColor: colors.backgroundSecondary,
          border: `1px solid ${colors.border}`,
          borderRadius: '14px'
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: 800, color: colors.text, marginBottom: '10px' }}>Job Summary</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MapPin size={18} color={colors.textSecondary} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: colors.text }}>{job.address}</div>
            <div style={{ fontSize: '12px', color: colors.textSecondary }}>
              {job.city}, {job.state} {job.zip}
            </div>
          </div>
        </div>

        <div style={{ height: '12px' }} />

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => window.open(`tel:${job.phone || ''}`)}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: colors.backgroundTertiary,
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Phone size={18} color={colors.textSecondary} />
            <span style={{ color: colors.textSecondary, fontWeight: 800, fontSize: '13px' }}>Call</span>
          </button>

          <button
            onClick={() => window.open(`sms:${job.phone || ''}`)}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: colors.backgroundTertiary,
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Mail size={18} color={colors.textSecondary} />
            <span style={{ color: colors.textSecondary, fontWeight: 800, fontSize: '13px' }}>Text</span>
          </button>
        </div>
      </div>

      <div style={{ height: '18px' }} />

      <button
        onClick={onOpenCamera}
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: colors.accent,
          border: 'none',
          borderRadius: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}
      >
        <Camera size={20} color="#FFFFFF" />
        <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 900 }}>Add Photos</span>
      </button>
    </div>
  );
}

function NavTile({ icon: Icon, label, onClick, colors }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '14px 10px',
        backgroundColor: colors.backgroundSecondary,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <Icon size={22} color={colors.textSecondary} />
      <span style={{ color: colors.textSecondary, fontSize: '12px', fontWeight: '700' }}>{label}</span>
    </button>
  );
}

function PhotosSection({ photos, onOpenCamera, colors }: any) {
  return <div style={{ padding: '20px', paddingBottom: '120px', color: colors.text }}>Photos</div>;
}
function MSDSSection({ job, onBack, colors }: any) {
  return (
    <div style={{ padding: '20px', paddingBottom: '120px', color: colors.text }}>
      <button
        onClick={onBack}
        style={{
          padding: '10px 12px',
          backgroundColor: colors.backgroundSecondary,
          border: `1px solid ${colors.border}`,
          borderRadius: '10px',
          cursor: 'pointer',
          color: colors.textSecondary,
          fontWeight: '700',
          marginBottom: '12px'
        }}
      >
        Back
      </button>
      MSDS
    </div>
  );
}
function MessageSection({ job, onSend, onBack, colors }: any) {
  return (
    <div style={{ padding: '20px', paddingBottom: '120px', color: colors.text }}>
      <button
        onClick={onBack}
        style={{
          padding: '10px 12px',
          backgroundColor: colors.backgroundSecondary,
          border: `1px solid ${colors.border}`,
          borderRadius: '10px',
          cursor: 'pointer',
          color: colors.textSecondary,
          fontWeight: '700',
          marginBottom: '12px'
        }}
      >
        Back
      </button>
      Message
    </div>
  );
}

function ChangeOrderSection({ job, onCreate, onBack, colors }: any) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      onCreate({ jobId: job.id, description, amount: parseFloat(amount || '0') });
      onBack();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '120px' }}>
      <button
        onClick={onBack}
        style={{
          padding: '10px 12px',
          backgroundColor: colors.backgroundSecondary,
          border: `1px solid ${colors.border}`,
          borderRadius: '10px',
          cursor: 'pointer',
          color: colors.textSecondary,
          fontWeight: '700',
          marginBottom: '12px'
        }}
      >
        Back
      </button>

      <div style={{ color: colors.text, fontWeight: 800, marginBottom: '12px' }}>New Change Order</div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', color: colors.textSecondary, fontSize: '13px', marginBottom: '6px' }}>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
            backgroundColor: colors.backgroundSecondary,
            color: colors.text,
            outline: 'none',
            resize: 'vertical',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', color: colors.textSecondary, fontSize: '13px', marginBottom: '6px' }}>
          Amount
        </label>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: colors.backgroundSecondary,
            border: `1px solid ${colors.border}`,
            borderRadius: '10px',
            padding: '0 12px'
          }}
        >
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
          backgroundColor: description.trim() && amount && !isSubmitting ? colors.accent : colors.backgroundTertiary,
          border: 'none',
          borderRadius: '12px',
          color: description.trim() && amount && !isSubmitting ? '#FFFFFF' : colors.textTertiary,
          fontSize: '16px',
          fontWeight: '700',
          cursor: description.trim() && amount && !isSubmitting ? 'pointer' : 'default',
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
          <>
            <Check size={18} />
            Submit Change Order
          </>
        )}
      </button>
    </div>
  );
}
