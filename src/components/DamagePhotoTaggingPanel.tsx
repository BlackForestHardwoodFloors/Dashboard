import { useState } from 'react';
import { Save, RotateCcw, MapPin, AlertTriangle, Globe, Lock } from 'lucide-react';

interface DamagePhotoTaggingPanelProps {
  photoUrl: string;
  onSave: (tags: {
    location: string;
    damageType: string;
    notes: string;
    sharedWithClient: boolean;
  }) => void;
  onRetake: () => void;
}

const LOCATIONS = [
  'Kitchen',
  'Living Room',
  'Hallway',
  'Bedroom',
  'Bathroom',
  'Stairs',
  'Basement',
  'Other'
];

const DAMAGE_TYPES = [
  'Scratch/Gouge',
  'Water Damage',
  'Pet Damage',
  'Subfloor Issue',
  'Wall/Trim',
  'Stain/Discoloration',
  'Structural',
  'Other'
];

export function DamagePhotoTaggingPanel({
  photoUrl,
  onSave,
  onRetake
}: DamagePhotoTaggingPanelProps) {
  const [location, setLocation] = useState('');
  const [damageType, setDamageType] = useState('');
  const [notes, setNotes] = useState('');
  const [sharedWithClient, setSharedWithClient] = useState(false);

  const canSave = location && damageType;

  const handleSave = () => {
    if (canSave) {
      onSave({ location, damageType, notes, sharedWithClient });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#0A0A0A',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto'
    }}>
      {/* Photo Preview */}
      <div style={{
        width: '100%',
        height: '300px',
        backgroundColor: '#1A1A1A',
        position: 'relative',
        flexShrink: 0
      }}>
        <img
          src={photoUrl}
          alt="Damage photo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />

        {/* Retake button */}
        <button
          onClick={onRetake}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            border: '2px solid #D4A024',
            borderRadius: '12px',
            padding: '10px 16px',
            color: '#D4A024',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backdropFilter: 'blur(10px)'
          }}
        >
          <RotateCcw size={18} />
          Retake
        </button>
      </div>

      {/* Tagging Form */}
      <div style={{
        flex: 1,
        padding: '24px 20px',
        overflowY: 'auto'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h2 style={{
            color: '#FFFFFF',
            fontSize: '22px',
            fontWeight: '700',
            margin: '0 0 8px 0'
          }}>
            Tag Damage Photo
          </h2>
          <p style={{
            color: '#A0A0A0',
            fontSize: '14px',
            margin: '0 0 24px 0'
          }}>
            Add details to help track and reference this damage.
          </p>

          {/* Location Selection */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: '700',
              marginBottom: '12px'
            }}>
              <MapPin size={18} color="#4F6A41" />
              Location *
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px'
            }}>
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setLocation(loc)}
                  style={{
                    padding: '14px 16px',
                    backgroundColor: location === loc ? '#4F6A41' : '#252525',
                    border: location === loc ? '2px solid #4F6A41' : '2px solid #2A2A2A',
                    borderRadius: '10px',
                    color: location === loc ? '#FFFFFF' : '#C0C0C0',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Damage Type Selection */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: '700',
              marginBottom: '12px'
            }}>
              <AlertTriangle size={18} color="#DC2626" />
              Damage Type *
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px'
            }}>
              {DAMAGE_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setDamageType(type)}
                  style={{
                    padding: '14px 16px',
                    backgroundColor: damageType === type ? '#DC2626' : '#252525',
                    border: damageType === type ? '2px solid #DC2626' : '2px solid #2A2A2A',
                    borderRadius: '10px',
                    color: damageType === type ? '#FFFFFF' : '#C0C0C0',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: '700',
              marginBottom: '12px'
            }}>
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional details about the damage..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '14px',
                backgroundColor: '#252525',
                border: '2px solid #2A2A2A',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Client Sharing Toggle */}
          <div style={{
            padding: '20px',
            backgroundColor: '#1F1F1F',
            border: '2px solid #2A2A2A',
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                {sharedWithClient ? (
                  <Globe size={20} color="#0F7BFF" />
                ) : (
                  <Lock size={20} color="#808080" />
                )}
                <span style={{
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: '700'
                }}>
                  Share with Client
                </span>
              </div>

              <button
                onClick={() => setSharedWithClient(!sharedWithClient)}
                style={{
                  width: '56px',
                  height: '32px',
                  backgroundColor: sharedWithClient ? '#0F7BFF' : '#3A3A3A',
                  border: 'none',
                  borderRadius: '16px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  left: sharedWithClient ? '28px' : '4px',
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '50%',
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }} />
              </button>
            </div>

            <p style={{
              color: '#A0A0A0',
              fontSize: '13px',
              margin: 0,
              lineHeight: '1.5'
            }}>
              {sharedWithClient
                ? 'Client can see this photo in their portal'
                : 'Photo is internal only - client cannot see this'
              }
            </p>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!canSave}
            style={{
              width: '100%',
              padding: '18px',
              backgroundColor: canSave ? '#D4A024' : '#3A3A3A',
              border: 'none',
              borderRadius: '12px',
              color: canSave ? '#FFFFFF' : '#808080',
              fontSize: '16px',
              fontWeight: '700',
              cursor: canSave ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s',
              boxShadow: canSave ? '0 4px 12px rgba(212, 160, 36, 0.3)' : 'none',
              marginBottom: '40px'
            }}
          >
            <Save size={20} />
            Save to Damage Folder
          </button>
        </div>
      </div>
    </div>
  );
}
