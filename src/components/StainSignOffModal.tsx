import React, { useState } from 'react';
import { X, Plus, Trash2, Send, Save, Check } from 'lucide-react';
import { useTheme } from '../ThemeProvider';

export interface StainSignOffPayload {
  approvedDate: string;
  stainChoices: { color: string; sheen: string }[];
  typedSignature: string;
  agreedToTerms: boolean;
}

interface StainSignOffModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  initialStainColor?: string;
  onSubmit: (payload: StainSignOffPayload) => void;
}

export function StainSignOffModal({
  isOpen,
  onClose,
  clientName,
  initialStainColor,
  onSubmit,
}: StainSignOffModalProps) {
  const { colors } = useTheme();

  const [stainChoices, setStainChoices] = useState([
    { color: initialStainColor || '', sheen: '100%' },
  ]);

  const [typedSignature, setTypedSignature] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [approvedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  if (!isOpen) return null;

  const addStainChoice = () => {
    setStainChoices([...stainChoices, { color: '', sheen: '100%' }]);
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
    copy[index][field] = value;
    setStainChoices(copy);
  };

  const canSubmit =
    typedSignature.trim().length > 0 && agreedToTerms;

  const handleSubmit = () => {
    if (!canSubmit) return;

    onSubmit({
      approvedDate,
      stainChoices,
      typedSignature,
      agreedToTerms,
    });

    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.75)',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 620,
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 18,
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#8E2BAE',
          color: '#fff',
          padding: '18px 20px',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ margin: 0 }}>Customer Stain Approval</h2>
            <p style={{ margin: 0, opacity: 0.9 }}>{clientName}</p>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: 40,
            height: 40,
            cursor: 'pointer',
          }}>
            <X color="#fff" />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 20 }}>
          {/* Stain Choices */}
          <h3>Stain Color Selection</h3>

          {stainChoices.map((choice, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <input
                value={choice.color}
                placeholder="Stain Color"
                onChange={(e) =>
                  updateStainChoice(i, 'color', e.target.value)
                }
                style={{ flex: 2, padding: 12 }}
              />
              <select
                value={choice.sheen}
                onChange={(e) =>
                  updateStainChoice(i, 'sheen', e.target.value)
                }
                style={{ flex: 1, padding: 12 }}
              >
                <option>100%</option>
                <option>75%</option>
                <option>50%</option>
                <option>25%</option>
              </select>
              {stainChoices.length > 1 && (
                <button onClick={() => removeStainChoice(i)}>
                  <Trash2 />
                </button>
              )}
            </div>
          ))}

          <button onClick={addStainChoice}>
            <Plus /> Add Color
          </button>

          {/* Typed Signature */}
          <h3 style={{ marginTop: 24 }}>Type Full Name as Signature</h3>

          <input
            type="text"
            value={typedSignature}
            onChange={(e) => setTypedSignature(e.target.value)}
            placeholder="Type your full name here..."
            style={{
              width: '100%',
              padding: 16,
              fontSize: 16,
              marginBottom: 12,
            }}
          />

          {typedSignature && (
            <div style={{
              padding: 20,
              border: '1px solid #ccc',
              borderRadius: 8,
              textAlign: 'center',
              fontFamily: "'Brush Script MT', 'Dancing Script', cursive",
              fontSize: 28,
            }}>
              {typedSignature}
            </div>
          )}

          {/* Agreement */}
          <label style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            I confirm the stain color(s) listed above are approved.
          </label>

          {canSubmit && (
            <div style={{
              marginTop: 12,
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <Check /> Signature complete
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 12, padding: 20 }}>
          <button onClick={handleSubmit} disabled={!canSubmit}>
            <Save /> Save
          </button>
          <button style={{ backgroundColor: '#6B5D4F', color: '#fff' }}>
            <Send /> Send to Customer
          </button>
        </div>
      </div>
    </div>
  );
}

export default StainSignOffModal;
