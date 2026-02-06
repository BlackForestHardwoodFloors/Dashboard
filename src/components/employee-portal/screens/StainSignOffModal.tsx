import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Send,
  Save,
  Check,
  PenTool,
  MessageSquare,
  Mail,
  Monitor,
} from 'lucide-react';
import { useTheme } from '../ThemeProvider';

export interface StainSignOffPayload {
  approvedDate: string;
  stainChoices: { color: string; sheen: string }[];
  typedSignature: string;
  agreedToTerms: boolean;
  sendVia?: {
    text: boolean;
    email: boolean;
    portal: boolean;
  };
}

interface StainSignOffModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobName: string;
  colors?: any; // you pass `colors={colors}` from parent already in your screens
  // Optional callbacks if you want to wire this to API later
  onSave?: (payload: StainSignOffPayload) => void;
  onSend?: (payload: StainSignOffPayload) => void;
}

type SignatureMethod = 'draw' | 'type';

export function StainSignOffModal({
  isOpen,
  onClose,
  jobName,
  colors: passedColors,
  onSave,
  onSend,
}: StainSignOffModalProps) {
  const theme = useTheme();
  const colors = passedColors || theme.colors;

  // ✅ Force Stain Sign Off to match the purple Stain Sign Off button tile
  // (Theme primary is green in your app, so we do NOT use theme.primary here.)
  const PRIMARY_ACTION = '#8B5CF6';

  const hexToRgba = (hex: string, alpha: number) => {
    try {
      const clean = hex.replace('#', '').trim();
      const full =
        clean.length === 3
          ? clean
              .split('')
              .map((c) => c + c)
              .join('')
          : clean;

      const r = parseInt(full.slice(0, 2), 16);
      const g = parseInt(full.slice(2, 4), 16);
      const b = parseInt(full.slice(4, 6), 16);

      if ([r, g, b].some((n) => Number.isNaN(n))) return `rgba(0,0,0,${alpha})`;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } catch {
      return `rgba(0,0,0,${alpha})`;
    }
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Form state
  const [approvedDate, setApprovedDate] = useState(new Date().toISOString().split('T')[0]);
  const [stainChoices, setStainChoices] = useState<{ id: string; color: string; sheen: string }[]>([
    { id: '1', color: '', sheen: '' },
  ]);

  const [signatureMethod, setSignatureMethod] = useState<SignatureMethod>('draw');
  const [typedSignature, setTypedSignature] = useState('');
  const [hasSignature, setHasSignature] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // ✅ Send options checkboxes
  const [sendViaText, setSendViaText] = useState(false);
  const [sendViaEmail, setSendViaEmail] = useState(false);
  const [sendViaPortal, setSendViaPortal] = useState(true);
  const hasAnySendVia = sendViaText || sendViaEmail || sendViaPortal;

  const isSignatureComplete = () => {
    if (signatureMethod === 'type') return typedSignature.trim().length > 0;
    return hasSignature;
  };

  // Init canvas when opened + draw method
  useEffect(() => {
    if (!isOpen) return;

    if (canvasRef.current && signatureMethod === 'draw') {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // clear
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // signature line
      ctx.strokeStyle = '#D1D5DB';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, canvas.height - 30);
      ctx.lineTo(canvas.width - 20, canvas.height - 30);
      ctx.stroke();

      // ink settings
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
    }
  }, [isOpen, signatureMethod]);

  if (!isOpen) return null;

  const addChoice = () => {
    setStainChoices((prev) => [
      ...prev,
      { id: Date.now().toString(), color: '', sheen: '' },
    ]);
  };

  const removeChoice = (id: string) => {
    setStainChoices((prev) => (prev.length > 1 ? prev.filter((c) => c.id !== id) : prev));
  };

  const updateChoice = (id: string, field: 'color' | 'sheen', value: string) => {
    setStainChoices((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  // Canvas draw handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearSignature = () => {
    if (signatureMethod === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#D1D5DB';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, canvas.height - 30);
      ctx.lineTo(canvas.width - 20, canvas.height - 30);
      ctx.stroke();

      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
    } else {
      setTypedSignature('');
    }
    setHasSignature(false);
  };

  const buildPayload = (): StainSignOffPayload => ({
    approvedDate,
    stainChoices: stainChoices.map(({ color, sheen }) => ({ color, sheen })),
    typedSignature: signatureMethod === 'type' ? typedSignature : '',
    agreedToTerms,
    sendVia: { text: sendViaText, email: sendViaEmail, portal: sendViaPortal },
  });

  const handleSave = () => {
    const payload = buildPayload();
    console.log('Stain Sign Off Saved:', payload);
    onSave?.(payload);
    onClose();
  };

  const handleSend = () => {
    if (!hasAnySendVia) return;

    const payload = buildPayload();
    console.log('Sending Stain Sign Off via:', payload.sendVia, payload);

    onSend?.(payload);
    // Keep your existing behavior: typically you’d save + close
    onSave?.(payload);
    onClose();
  };

  const SendOption = ({
    checked,
    onChange,
    label,
    icon,
    hint,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
    icon: React.ReactNode;
    hint: string;
  }) => (
    <label
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '12px',
        borderRadius: '10px',
        cursor: 'pointer',
        backgroundColor: checked ? hexToRgba(PRIMARY_ACTION, 0.08) : colors.background,
        border: `1px solid ${checked ? PRIMARY_ACTION : colors.border}`,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: '20px',
          height: '20px',
          accentColor: PRIMARY_ACTION,
          cursor: 'pointer',
          marginTop: '2px',
        }}
      />
      <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            backgroundColor: checked ? PRIMARY_ACTION : 'rgba(255,255,255,0.06)',
            border: checked ? 'none' : `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: colors.text, fontSize: '14px', fontWeight: 900, lineHeight: 1.2 }}>
            {label}
          </div>
          <div style={{ color: colors.textSecondary, fontSize: '12px', marginTop: '4px', lineHeight: 1.3 }}>
            {hint}
          </div>
        </div>
      </div>
    </label>
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: colors.backgroundSecondary,
          borderRadius: '16px',
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: PRIMARY_ACTION,
          }}
        >
          <div>
            <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 950, margin: 0 }}>
              Stain Sign Off Form
            </h2>

            {/* ✅ Client name under the header */}
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', margin: '4px 0 0 0', fontWeight: 700 }}>
              {jobName}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '999px',
              backgroundColor: 'rgba(255,255,255,0.22)',
              border: '1px solid rgba(255,255,255,0.25)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} color="#fff" />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
          {/* Important Stain Color Notice */}
          <div
            style={{
              backgroundColor: colors.background,
              borderRadius: '14px',
              border: `1px solid ${colors.border}`,
              padding: '16px',
              marginBottom: '18px',
            }}
          >
            <div style={{ color: colors.text, fontWeight: 950, fontSize: '14px' }}>
              Important Stain Color Notice
            </div>
            <div style={{ color: colors.text, fontSize: '13px', marginTop: '10px', lineHeight: 1.45, fontWeight: 650 }}>
              Stain applied to a hardwood floor is permanent. Hardwood is a natural product, and variations in wood species and
              grain patterns will affect how stain color appears.
            </div>
            <div style={{ color: colors.text, fontSize: '13px', marginTop: '10px', lineHeight: 1.45, fontWeight: 650 }}>
              Please be absolutely sure of the stain color you have selected. Once stain has been applied, the color cannot be
              changed without re-sanding the floor. Re-sanding requires starting over and will result in additional cost.
            </div>
            <div style={{ color: colors.text, fontSize: '13px', marginTop: '10px', lineHeight: 1.45, fontWeight: 650 }}>
              Our stain experts are happy to work with you to select the right color.
              <br />
              Up to 45 minutes of stain consultation time is included.
              <br />
              If additional time is needed, it is billed at $75 per half hour (time is billed in half-hour increments, although less time may be required).
            </div>
          </div>

          {/* Approved Date */}
          <div style={{ marginBottom: '18px' }}>
            <label
              style={{
                color: colors.textSecondary,
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Approval Date
            </label>
            <input
              type="date"
              value={approvedDate}
              onChange={(e) => setApprovedDate(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.background,
                color: colors.text,
                fontSize: '15px',
                fontWeight: 800,
              }}
            />
          </div>

          {/* Stain Choices */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ color: colors.text, fontSize: '14px', fontWeight: 950, marginBottom: '10px' }}>
              Selected Stain(s)
            </div>

            {stainChoices.map((choice) => (
              <div
                key={choice.id}
                style={{
                  backgroundColor: colors.background,
                  borderRadius: '14px',
                  border: `1px solid ${colors.border}`,
                  padding: '12px',
                  marginBottom: '10px',
                }}
              >
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ color: colors.textSecondary, fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                      Color
                    </label>
                    <input
                      value={choice.color}
                      onChange={(e) => updateChoice(choice.id, 'color', e.target.value)}
                      placeholder="e.g., Jacobean"
                      style={{
                        width: '100%',
                        marginTop: '6px',
                        padding: '12px',
                        borderRadius: '12px',
                        border: `1px solid ${colors.border}`,
                        backgroundColor: colors.backgroundSecondary,
                        color: colors.text,
                        fontSize: '14px',
                        fontWeight: 800,
                      }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={{ color: colors.textSecondary, fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                      Sheen
                    </label>
                    <input
                      value={choice.sheen}
                      onChange={(e) => updateChoice(choice.id, 'sheen', e.target.value)}
                      placeholder="e.g., Satin"
                      style={{
                        width: '100%',
                        marginTop: '6px',
                        padding: '12px',
                        borderRadius: '12px',
                        border: `1px solid ${colors.border}`,
                        backgroundColor: colors.backgroundSecondary,
                        color: colors.text,
                        fontSize: '14px',
                        fontWeight: 800,
                      }}
                    />
                  </div>

                  {stainChoices.length > 1 && (
                    <button
                      onClick={() => removeChoice(choice.id)}
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '14px',
                        backgroundColor: 'rgba(220, 38, 38, 0.18)',
                        border: '1px solid rgba(220, 38, 38, 0.35)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '18px',
                      }}
                      aria-label="Remove stain choice"
                      title="Remove stain choice"
                    >
                      <Trash2 size={20} color="#DC2626" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={addChoice}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: `1px dashed ${colors.border}`,
                backgroundColor: 'transparent',
                color: colors.text,
                fontSize: '14px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Plus size={18} />
              Add another stain
            </button>
          </div>

          {/* Send Options */}
          <div
            style={{
              marginBottom: '18px',
              backgroundColor: colors.background,
              borderRadius: '14px',
              padding: '16px',
              border: `1px solid ${colors.border}`,
            }}
          >
            <div style={{ color: colors.text, fontSize: '14px', fontWeight: 950 }}>
              Send to client via
            </div>
            <div style={{ color: colors.textSecondary, fontSize: '12px', marginTop: '6px' }}>
              Choose how the client will receive the sign off request.
            </div>

            <div style={{ display: 'grid', gap: '10px', marginTop: '12px' }}>
              <SendOption
                checked={sendViaText}
                onChange={setSendViaText}
                label="Text (SMS)"
                hint="Send a link by text message."
                icon={<MessageSquare size={18} color={sendViaText ? '#fff' : colors.text} />}
              />
              <SendOption
                checked={sendViaEmail}
                onChange={setSendViaEmail}
                label="Email"
                hint="Email the sign off for approval."
                icon={<Mail size={18} color={sendViaEmail ? '#fff' : colors.text} />}
              />
              <SendOption
                checked={sendViaPortal}
                onChange={setSendViaPortal}
                label="Client Portal"
                hint="Publish in the portal for approval."
                icon={<Monitor size={18} color={sendViaPortal ? '#fff' : colors.text} />}
              />
            </div>

            {!hasAnySendVia && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(220, 38, 38, 0.12)',
                  border: '1px solid rgba(220, 38, 38, 0.25)',
                  color: '#DC2626',
                  fontSize: '12px',
                  fontWeight: 900,
                }}
              >
                Select at least one delivery method to enable “Send to Client”.
              </div>
            )}
          </div>

          {/* Signature section */}
          <div
            style={{
              marginBottom: '18px',
              backgroundColor: '#F7F9FC',
              borderRadius: '14px',
              padding: '18px',
              border: '1px solid #E1E5EB',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '14px',
                paddingBottom: '12px',
                borderBottom: '1px solid #E1E5EB',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: PRIMARY_ACTION,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PenTool size={18} color="#fff" />
              </div>
              <div>
                <div style={{ color: '#111827', fontSize: '16px', fontWeight: 950 }}>
                  Sign Document
                </div>
                <div style={{ color: '#374151', fontSize: '12px', marginTop: '2px', fontWeight: 650 }}>
                  Please sign below to confirm your stain selection
                </div>
              </div>
            </div>

            {/* Method tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <button
                onClick={() => setSignatureMethod('draw')}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: signatureMethod === 'draw' ? PRIMARY_ACTION : '#fff',
                  border: `1px solid ${signatureMethod === 'draw' ? PRIMARY_ACTION : '#D1D5DB'}`,
                  borderRadius: '12px',
                  color: signatureMethod === 'draw' ? '#fff' : '#111827',
                  fontSize: '14px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <PenTool size={16} />
                Draw
              </button>
              <button
                onClick={() => setSignatureMethod('type')}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: signatureMethod === 'type' ? PRIMARY_ACTION : '#fff',
                  border: `1px solid ${signatureMethod === 'type' ? PRIMARY_ACTION : '#D1D5DB'}`,
                  borderRadius: '12px',
                  color: signatureMethod === 'type' ? '#fff' : '#111827',
                  fontSize: '14px',
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                ✎ Type
              </button>
            </div>

            {/* Draw */}
            {signatureMethod === 'draw' && (
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    border: '2px solid #D1D5DB',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#FFFFFF',
                    position: 'relative',
                  }}
                >
                  {!hasSignature && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '18px',
                        bottom: '34px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#6B7280',
                        fontSize: '14px',
                        pointerEvents: 'none',
                        zIndex: 1,
                        fontWeight: 800,
                      }}
                    >
                      <span style={{ fontSize: '18px', color: PRIMARY_ACTION }}>✕</span>
                      <span>Sign here</span>
                    </div>
                  )}

                  <canvas
                    ref={canvasRef}
                    width={520}
                    height={150}
                    style={{
                      width: '100%',
                      height: '150px',
                      cursor: 'crosshair',
                      touchAction: 'none',
                    }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                </div>

                {hasSignature && (
                  <button
                    onClick={clearSignature}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      padding: '6px 12px',
                      backgroundColor: '#fff',
                      border: '1px solid #D1D5DB',
                      borderRadius: '10px',
                      color: '#111827',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: 900,
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            )}

            {/* Type */}
            {signatureMethod === 'type' && (
              <div>
                <input
                  type="text"
                  value={typedSignature}
                  onChange={(e) => {
                    setTypedSignature(e.target.value);
                    setHasSignature(e.target.value.trim().length > 0);
                  }}
                  placeholder="Type your full name"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    border: '2px solid #D1D5DB',
                    backgroundColor: '#fff',
                    color: '#111827',
                    fontSize: '16px',
                    fontWeight: 900,
                    marginBottom: '12px',
                  }}
                />

                {typedSignature && (
                  <div
                    style={{
                      padding: '18px',
                      backgroundColor: '#fff',
                      border: '2px solid #D1D5DB',
                      borderRadius: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        color: '#111827',
                        fontSize: '28px',
                        fontFamily: "'Brush Script MT', 'Dancing Script', cursive",
                        fontStyle: 'italic',
                        margin: 0,
                        borderBottom: '1px solid #9CA3AF',
                        paddingBottom: '8px',
                        display: 'inline-block',
                      }}
                    >
                      {typedSignature}
                    </div>
                    <div style={{ color: '#6B7280', fontSize: '11px', marginTop: '8px', fontWeight: 800 }}>
                      Signature preview
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Agreement */}
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginTop: '14px',
                cursor: 'pointer',
                padding: '12px',
                backgroundColor: agreedToTerms ? hexToRgba(PRIMARY_ACTION, 0.08) : '#fff',
                borderRadius: '12px',
                border: `1px solid ${agreedToTerms ? PRIMARY_ACTION : '#E1E5EB'}`,
              }}
            >
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                style={{
                  width: '20px',
                  height: '20px',
                  accentColor: PRIMARY_ACTION,
                  cursor: 'pointer',
                  marginTop: '2px',
                }}
              />
              <span style={{ color: '#111827', fontSize: '13px', lineHeight: 1.45, fontWeight: 700 }}>
                I confirm the stain color(s) listed above are correct. I understand stain is permanent and changing color
                after application requires re-sanding and may incur additional cost.
              </span>
            </label>

            {/* ✅ This used to be GREEN; now it matches PRIMARY_ACTION (purple) */}
            {isSignatureComplete() && agreedToTerms && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '12px',
                  padding: '10px 12px',
                  backgroundColor: hexToRgba(PRIMARY_ACTION, 0.12),
                  borderRadius: '12px',
                  border: `1px solid ${hexToRgba(PRIMARY_ACTION, 0.35)}`,
                }}
              >
                <Check size={18} color={PRIMARY_ACTION} />
                <span style={{ color: PRIMARY_ACTION, fontSize: '13px', fontWeight: 950 }}>
                  Signature complete — ready to submit
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: `1px solid ${colors.border}`,
            display: 'flex',
            gap: '12px',
          }}
        >
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: 'transparent',
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              color: colors.text,
              fontSize: '15px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Save size={18} />
            Save
          </button>

          <button
            onClick={handleSend}
            disabled={!hasAnySendVia}
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: !hasAnySendVia ? 'rgba(0,0,0,0.15)' : PRIMARY_ACTION,
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 950,
              cursor: !hasAnySendVia ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: !hasAnySendVia ? 0.7 : 1,
            }}
          >
            <Send size={18} />
            Send to Client
          </button>
        </div>
      </div>
    </div>
  );
}

export default StainSignOffModal;
