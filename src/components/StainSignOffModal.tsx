import React, { useMemo, useState } from 'react';
import { X, Plus, Trash2, Send, Save, Check } from 'lucide-react';
import { useTheme } from '../ThemeProvider';

export interface StainSignOffPayload {
  approvedDate: string;
  stainChoices: { color: string; sheen: string }[];
  typedSignature: string;
  agreedToTerms: boolean;
  notes: string;
}

interface StainSignOffModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  initialStainColor?: string;
  onSubmit: (payload: StainSignOffPayload) => void;
}

const DURASEAL_STAIN_COLORS = [
  'Aged Barrel',
  'Antique Brown',
  'Briar Smoke',
  'Chestnut',
  'Classic Gray',
  'Coffee Brown',
  'Country White',
  'Dark Walnut',
  'Ebony',
  'English Chestnut',
  'Espresso',
  'Early American',
  'Fruitwood',
  'Golden Brown',
  'Graphite',
  'Gunstock',
  'Heritage Brown',
  'Ipswich Pine',
  'Jacobean',
  'Medium Brown',
  'Neutral',
  'Nutmeg',
  'Provincial',
  'Red Mahogany',
  'Rosewood',
  'Sedona Red',
  'Silvered Gray',
  'Special Walnut',
  'Spice Brown',
  'True Black',
  'Warm Gray',
  'Weathered Oak',
];

const SHEEN_OPTIONS = [
  '10%',
  '25%',
  '30%',
  '40%',
  '50%',
  '60%',
  '75%',
  '90%',
  '100%',
];

export function StainSignOffModal({
  isOpen,
  onClose,
  clientName,
  initialStainColor,
  onSubmit,
}: StainSignOffModalProps) {
  const { colors } = useTheme();

  const defaultColor = initialStainColor || '';

  const [stainChoices, setStainChoices] = useState([
    { color: defaultColor, sheen: '25%' },
  ]);
  const [typedSignature, setTypedSignature] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [notes, setNotes] = useState('');
  const [approvedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sendViaText, setSendViaText] = useState(false);
  const [sendViaEmail, setSendViaEmail] = useState(false);
  const [sendViaPortal, setSendViaPortal] = useState(true);

  const stainColorOptions = useMemo(() => {
    if (!defaultColor || DURASEAL_STAIN_COLORS.includes(defaultColor)) {
      return DURASEAL_STAIN_COLORS;
    }

    return [defaultColor, ...DURASEAL_STAIN_COLORS];
  }, [defaultColor]);

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    minHeight: 48,
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    color: '#F5F7FB',
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 8,
    display: 'block',
  };

  const helperTextStyle: React.CSSProperties = {
    fontSize: 13,
    color: 'rgba(255,255,255,0.60)',
    marginTop: 6,
  };

  if (!isOpen) return null;

  const addStainChoice = () => {
    setStainChoices([...stainChoices, { color: '', sheen: '25%' }]);
  };

  const removeStainChoice = (index: number) => {
    if (stainChoices.length === 1) return;

    const copy = [...stainChoices];
    copy.splice(index, 1);
    setStainChoices(copy);
  };

  const updateStainChoice = (
    index: number,
    field: 'color' | 'sheen',
    value: string
  ) => {
    const copy = [...stainChoices];
    copy[index] = {
      ...copy[index],
      [field]: value,
    };
    setStainChoices(copy);
  };

  const hasValidStainChoices = stainChoices.every(
    (choice) => choice.color.trim().length > 0 && choice.sheen.trim().length > 0
  );

  const canSubmit =
    typedSignature.trim().length > 0 &&
    agreedToTerms &&
    hasValidStainChoices;

  const handleSubmit = () => {
    if (!canSubmit) return;

    onSubmit({
      approvedDate,
      stainChoices,
      typedSignature: typedSignature.trim(),
      agreedToTerms,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 620,
          maxHeight: '90vh',
          background:
            colors.backgroundSecondary ||
            'linear-gradient(180deg, #1C1C1F 0%, #17171A 100%)',
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
          border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(90deg, #8B2BC7 0%, #8F56FF 100%)',
            color: '#fff',
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexShrink: 0,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 800,
                lineHeight: 1.2,
              }}
            >
              Stain Sign Off Form
            </h2>
            <p
              style={{
                margin: '6px 0 0 0',
                opacity: 0.9,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {clientName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '50%',
              width: 40,
              height: 40,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <X color="#fff" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          style={{
            padding: 20,
            overflowY: 'auto',
          }}
        >
          {/* Notice Card */}
          <div
            style={{
              background: 'rgba(0,0,0,0.28)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: 18,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: 800,
                marginBottom: 12,
              }}
            >
              Important Stain Color Notice
            </div>

            <div
              style={{
                color: 'rgba(255,255,255,0.88)',
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              <p style={{ margin: '0 0 12px 0' }}>
                Stain applied to a hardwood floor is permanent. Hardwood is a
                natural product, and variations in wood species and grain
                patterns will affect how stain color appears.
              </p>

              <p style={{ margin: '0 0 12px 0' }}>
                Please be absolutely sure of the stain color you have selected.
                Once stain has been applied, the color cannot be changed without
                re-sanding the floor. Re-sanding requires starting over and will
                result in additional cost.
              </p>

              <p style={{ margin: 0 }}>
                Our stain experts are happy to work with you to select the right
                color. Up to 45 minutes of stain consultation time is included.
                If additional time is needed, it is billed at $75 per half hour
                (time is billed in half-hour increments, although less time may
                be required).
              </p>
            </div>
          </div>

          {/* Approval Date */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Approval Date</label>
            <input
              type="date"
              value={approvedDate}
              readOnly
              style={fieldStyle}
            />
          </div>

          {/* Stain Choices */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Selected Stain(s)</label>

            {stainChoices.map((choice, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 10,
                  marginBottom: 10,
                  alignItems: 'stretch',
                }}
              >
                <div style={{ flex: 2 }}>
                  <div style={{ ...labelStyle, marginBottom: 6 }}>Color</div>
                  <input
                    list={`duraseal-colors-${i}`}
                    value={choice.color}
                    onChange={(e) =>
                      updateStainChoice(i, 'color', e.target.value)
                    }
                    placeholder="e.g., Jacobean"
                    style={{
                      ...fieldStyle,
                      width: '100%',
                    }}
                  />
                  <datalist id={`duraseal-colors-${i}`}>
                    {stainColorOptions.map((color) => (
                      <option key={color} value={color} />
                    ))}
                  </datalist>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ ...labelStyle, marginBottom: 6 }}>Sheen</div>
                  <select
                    value={choice.sheen}
                    onChange={(e) =>
                      updateStainChoice(i, 'sheen', e.target.value)
                    }
                    style={{
                      ...fieldStyle,
                      width: '100%',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.75)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 14px center',
                      paddingRight: 42,
                    }}
                  >
                    {SHEEN_OPTIONS.map((sheen) => (
                      <option key={sheen} value={sheen} style={{ color: '#111' }}>
                        {sheen}
                      </option>
                    ))}
                  </select>
                </div>

                {stainChoices.length > 1 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => removeStainChoice(i)}
                      style={{
                        border: '1px solid rgba(255,255,255,0.10)',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: 12,
                        width: 48,
                        height: 48,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#F5F7FB',
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addStainChoice}
              style={{
                width: '100%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginTop: 6,
                padding: '12px 14px',
                borderRadius: 12,
                border: '1px dashed rgba(255,255,255,0.10)',
                background: 'transparent',
                color: '#F5F7FB',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              <Plus size={16} /> Add another stain
            </button>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ ...labelStyle, marginTop: 24 }}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any stain notes, sample board notes, room notes, or special instructions..."
              rows={4}
              style={{
                ...fieldStyle,
                minHeight: 120,
                resize: 'vertical',
              }}
            />
          </div>

          {/* Delivery Options */}
          <div
            style={{
              background: 'rgba(0,0,0,0.22)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: 16,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: 800,
                marginBottom: 4,
              }}
            >
              Send to client via
            </div>
            <div style={helperTextStyle}>
              Choose how the client will receive the sign off request.
            </div>

            <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
              <label
                style={{
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 14,
                  padding: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  color: '#F5F7FB',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={sendViaText}
                  onChange={(e) => setSendViaText(e.target.checked)}
                />
                <div>
                  <div style={{ fontWeight: 700 }}>Text (SMS)</div>
                  <div style={helperTextStyle}>Send a link by text message.</div>
                </div>
              </label>

              <label
                style={{
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 14,
                  padding: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  color: '#F5F7FB',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={sendViaEmail}
                  onChange={(e) => setSendViaEmail(e.target.checked)}
                />
                <div>
                  <div style={{ fontWeight: 700 }}>Email</div>
                  <div style={helperTextStyle}>Email the sign off for approval.</div>
                </div>
              </label>

              <label
                style={{
                  border: '1px solid #8F56FF',
                  background: 'rgba(143,86,255,0.12)',
                  borderRadius: 14,
                  padding: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  color: '#F5F7FB',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={sendViaPortal}
                  onChange={(e) => setSendViaPortal(e.target.checked)}
                />
                <div>
                  <div style={{ fontWeight: 700 }}>Client Portal</div>
                  <div style={helperTextStyle}>
                    Publish in the portal for approval.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Signature Card */}
          <div
            style={{
              background: 'rgba(255,255,255,0.96)',
              borderRadius: 16,
              padding: 18,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                color: '#16181D',
                fontSize: 20,
                fontWeight: 800,
                marginBottom: 4,
              }}
            >
              Sign Document
            </div>
            <div
              style={{
                color: 'rgba(22,24,29,0.70)',
                fontSize: 14,
                marginBottom: 16,
              }}
            >
              Please sign below to confirm your stain selection
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                marginBottom: 14,
              }}
            >
              <button
                type="button"
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'linear-gradient(90deg, #8B2BC7 0%, #8F56FF 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Draw
              </button>

              <button
                type="button"
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: '1px solid rgba(22,24,29,0.15)',
                  background: '#F5F5F7',
                  color: '#16181D',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Type
              </button>
            </div>

            <label
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'rgba(22,24,29,0.55)',
                marginBottom: 8,
                display: 'block',
              }}
            >
              Type Full Name as Signature
            </label>

            <input
              type="text"
              value={typedSignature}
              onChange={(e) => setTypedSignature(e.target.value)}
              placeholder="Type your full name here..."
              style={{
                width: '100%',
                padding: '14px 16px',
                minHeight: 48,
                borderRadius: 12,
                border: '1px solid rgba(22,24,29,0.12)',
                backgroundColor: '#FFFFFF',
                color: '#16181D',
                fontSize: 15,
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: 12,
              }}
            />

            {typedSignature && (
              <div
                style={{
                  padding: 20,
                  border: '1px solid rgba(22,24,29,0.12)',
                  borderRadius: 12,
                  textAlign: 'center',
                  fontFamily: "'Brush Script MT', 'Dancing Script', cursive",
                  fontSize: 28,
                  color: '#16181D',
                  background: '#FAFAFB',
                  marginBottom: 14,
                }}
              >
                {typedSignature}
              </div>
            )}

            <label
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
                color: '#16181D',
                fontSize: 15,
              }}
            >
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                style={{ marginTop: 4 }}
              />
              <span>
                I confirm the stain color(s) listed above are approved.
              </span>
            </label>

            {canSubmit && (
              <div
                style={{
                  marginTop: 12,
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontWeight: 600,
                }}
              >
                <Check size={18} /> Signature complete
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            padding: 20,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(23,23,26,0.94)',
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              flex: 1,
              padding: '14px 16px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(255,255,255,0.03)',
              color: '#F5F7FB',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              opacity: canSubmit ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontWeight: 700,
            }}
          >
            <Save size={18} /> Save
          </button>

          <button
            type="button"
            style={{
              flex: 1,
              padding: '14px 16px',
              borderRadius: 12,
              border: 'none',
              backgroundColor: '#756554',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontWeight: 700,
            }}
          >
            <Send size={18} /> Send to Customer
          </button>
        </div>
      </div>
    </div>
  );
}

export default StainSignOffModal;