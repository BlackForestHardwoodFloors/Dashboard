import { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  User, 
  Users, 
  FileText, 
  ChevronDown,
  ChevronRight,
  Clipboard,
  Layers,
  Download,
  Camera
} from 'lucide-react';
import { useTheme } from '../ThemeProvider';

interface WorkOrderScreenProps {
  onClose?: () => void;
  jobId?: string;
  colors?: any;
}

export function WorkOrderScreen({ onClose, jobId }: WorkOrderScreenProps) {
  const { colors, isDark } = useTheme();
  const [expandedSections, setExpandedSections] = useState<string[]>(['info', 'flooring', 'work']);

  // Work Order uses muted greenish-gray color matching sidebar button
  const COLORS = {
    background: colors.background,
    card: colors.backgroundSecondary,
    text: isDark ? '#FFFFFF' : '#1A1A1A',
    textBold: isDark ? '#FFFFFF' : '#000000',
    textSecondary: isDark ? '#B0B0B0' : '#555555',
    textMuted: isDark ? '#888888' : '#777777',
    border: colors.border,
    accent: '#5C6B5A',
    accentLight: isDark ? '#3D4A3B' : '#E8EDE7',
    headerBg: '#5C6B5A',
    gold: '#D4A024',
  };

  // Sample work order data
  const workOrder = {
    clientName: 'Anderson, James',
    address: '14318 East 32nd Avenue, Spokane Valley, WA 99037',
    jobForeman: 'Mike Rodriguez',
    crew: ['Carlos Martinez', 'James Wilson'],
    scheduled: 'Monday, Jan 6, 2025',
    cell: '509-951-6001',
    notes: 'Customer prefers communication via text. Two dogs on property - please keep gates closed.',
    sqft: 1250,
    
    // Flooring
    woodSpecies: 'Red Oak',
    grade: 'Quarter Sawn',
    widthThickness: '4" x 3/4"',
    
    // Finishing
    finishType: 'Oil Based Polyurethane',
    finishSheen: 'Gloss',
    stain: 'Jacobean',
    coats: 3,
    
    // Work Items
    workItems: [
      { id: '1', description: 'Installation of 4" x 3/4" Quarter Sawn Red Oak in Dining room and Hallway', hours: 39, minutes: 30 },
      { id: '2', description: 'Finish with 4 coats of commercial grade water based finish, Natural - No Stain (OPTION 3 - BEST)', hours: 29, minutes: 30 },
      { id: '3', description: 'Carpet Removal in Dining room, Hallway and Great room', hours: 6, minutes: 30 },
      { id: '4', description: 'Flush Mount Vents in Dining room, Hallway and Great room', hours: 6, minutes: 30 },
      { id: '5', description: 'Custom Stain in Dining room, Hallway and Great room', hours: 6, minutes: 30 },
    ]
  };

  const jobImages = [
    'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=400',
    'https://images.unsplash.com/photo-1560185008-b033106af5c3?w=400',
    'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400',
    'https://images.unsplash.com/photo-1560185127-6a8c1f1d9e2b?w=400',
  ];

  const totalHours = workOrder.workItems.reduce((acc, item) => acc + item.hours + (item.minutes / 60), 0);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: COLORS.background,
      paddingBottom: '100px'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: COLORS.headerBg,
        padding: '60px 20px 28px',
        position: 'relative'
      }}>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              padding: '10px 16px',
              backgroundColor: 'rgba(255,255,255,0.25)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              fontSize: '15px'
            }}
          >
            ← Back
          </button>
        )}

        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Clipboard size={22} color="#FFFFFF" />
            <span style={{ 
              color: 'rgba(255,255,255,0.95)', 
              fontSize: '14px', 
              fontWeight: '700', 
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              Work Order
            </span>
          </div>
          
          <h1 style={{ 
            color: '#FFFFFF', 
            fontSize: '28px', 
            fontWeight: '800', 
            margin: '0 0 12px 0',
            lineHeight: '1.2',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            {workOrder.clientName}
          </h1>
          
          <div style={{ 
            color: 'rgba(255,255,255,0.95)', 
            fontSize: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            lineHeight: '1.4',
            fontWeight: '500'
          }}>
            <MapPin size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{workOrder.address}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{
        backgroundColor: COLORS.card,
        borderBottom: `1px solid ${COLORS.border}`,
        padding: '24px 20px',
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          textAlign: 'center'
        }}>
          <div>
            <p style={{ 
              color: COLORS.textMuted, 
              fontSize: '12px', 
              margin: '0 0 8px 0', 
              textTransform: 'uppercase', 
              letterSpacing: '1px', 
              fontWeight: '700' 
            }}>
              Square Feet
            </p>
            <p style={{ 
              color: COLORS.textBold, 
              fontSize: '28px', 
              fontWeight: '800', 
              margin: 0 
            }}>
              {workOrder.sqft.toLocaleString()}
            </p>
          </div>
          <div>
            <p style={{ 
              color: COLORS.textMuted, 
              fontSize: '12px', 
              margin: '0 0 8px 0', 
              textTransform: 'uppercase', 
              letterSpacing: '1px', 
              fontWeight: '700' 
            }}>
              Est. Hours
            </p>
            <p style={{ 
              color: COLORS.accent, 
              fontSize: '28px', 
              fontWeight: '800', 
              margin: 0 
            }}>
              {Math.round(totalHours)}
            </p>
          </div>
          <div>
            <p style={{ 
              color: COLORS.textMuted, 
              fontSize: '12px', 
              margin: '0 0 8px 0', 
              textTransform: 'uppercase', 
              letterSpacing: '1px', 
              fontWeight: '700' 
            }}>
              Start Date
            </p>
            <p style={{ 
              color: COLORS.textBold, 
              fontSize: '18px', 
              fontWeight: '700', 
              margin: 0 
            }}>
              Jan 6
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '16px' }}>
        
        {/* JOB INFORMATION */}
        <SectionCard
          title="Job Information"
          icon={<User size={20} color={COLORS.accent} />}
          isExpanded={expandedSections.includes('info')}
          onToggle={() => toggleSection('info')}
          colors={COLORS}
        >
          <InfoRow label="Foreman" value={workOrder.jobForeman} colors={COLORS} />
          <InfoRow label="Crew" value={workOrder.crew.join(', ')} colors={COLORS} />
          <InfoRow label="Scheduled" value={workOrder.scheduled} colors={COLORS} />
          
          {/* Phone */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 0',
            borderBottom: `1px solid ${COLORS.border}`
          }}>
            <span style={{ color: COLORS.textSecondary, fontSize: '15px', fontWeight: '600' }}>Phone</span>
            <a 
              href={`tel:${workOrder.cell}`}
              style={{ 
                color: COLORS.accent, 
                fontSize: '16px', 
                fontWeight: '700',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Phone size={16} />
              {workOrder.cell}
            </a>
          </div>

          {/* Notes */}
          {workOrder.notes && (
            <div style={{ paddingTop: '16px' }}>
              <span style={{ 
                color: COLORS.textSecondary, 
                fontSize: '13px', 
                fontWeight: '700', 
                display: 'block', 
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Notes
              </span>
              <div style={{
                backgroundColor: isDark ? '#2D2A26' : '#FFFBF5',
                borderRadius: '12px',
                padding: '16px',
                borderLeft: `4px solid ${COLORS.gold}`
              }}>
                <p style={{ 
                  color: COLORS.textBold, 
                  fontSize: '15px', 
                  margin: 0, 
                  lineHeight: '1.7',
                  fontWeight: '500'
                }}>
                  {workOrder.notes}
                </p>
              </div>
            </div>
          )}
        </SectionCard>

        {/* FLOORING & FINISH */}
        <SectionCard
          title="Flooring & Finish"
          icon={<Layers size={20} color={COLORS.accent} />}
          isExpanded={expandedSections.includes('flooring')}
          onToggle={() => toggleSection('flooring')}
          colors={COLORS}
        >
          {/* Flooring Type */}
          <div style={{
            backgroundColor: COLORS.accentLight,
            borderRadius: '12px',
            padding: '18px',
            marginBottom: '12px'
          }}>
            <h4 style={{ 
              color: COLORS.accent, 
              fontSize: '13px', 
              fontWeight: '800', 
              margin: '0 0 16px 0',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Flooring Type
            </h4>
            <SpecRow label="Species" value={workOrder.woodSpecies} colors={COLORS} />
            <SpecRow label="Grade" value={workOrder.grade} colors={COLORS} />
            <SpecRow label="Size" value={workOrder.widthThickness} colors={COLORS} isLast />
          </div>

          {/* Finish */}
          <div style={{
            backgroundColor: isDark ? '#2D2A26' : '#FDF8F3',
            borderRadius: '12px',
            padding: '18px'
          }}>
            <h4 style={{ 
              color: '#8B7355', 
              fontSize: '13px', 
              fontWeight: '800', 
              margin: '0 0 16px 0',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Finish System
            </h4>
            <SpecRow label="Type" value={workOrder.finishType} colors={COLORS} />
            <SpecRow label="Sheen" value={workOrder.finishSheen} colors={COLORS} />
            <SpecRow label="Stain" value={workOrder.stain} colors={COLORS} />
            <SpecRow label="Coats" value={`${workOrder.coats} coats`} colors={COLORS} isLast />
          </div>
        </SectionCard>

        {/* PHOTOS */}
        <SectionCard
          title="Photos"
          icon={<Camera size={20} color={COLORS.accent} />}
          isExpanded={expandedSections.includes('images')}
          onToggle={() => toggleSection('images')}
          colors={COLORS}
          badge={jobImages.length}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            {jobImages.map((img, index) => (
              <div
                key={index}
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  aspectRatio: '4/3'
                }}
              >
                <img 
                  src={img}
                  alt={`Job photo ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* WORK DESCRIPTION */}
        <SectionCard
          title="Work Description"
          icon={<Clipboard size={20} color={COLORS.accent} />}
          isExpanded={expandedSections.includes('work')}
          onToggle={() => toggleSection('work')}
          colors={COLORS}
        >
          {workOrder.workItems.map((item, index) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '18px 0',
                borderBottom: index < workOrder.workItems.length - 1 ? `1px solid ${COLORS.border}` : 'none'
              }}
            >
              {/* Number + Description */}
              <div style={{ display: 'flex', gap: '14px', flex: 1 }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: COLORS.accent,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '800',
                  flexShrink: 0
                }}>
                  {index + 1}
                </div>
                <p style={{ 
                  color: COLORS.textBold, 
                  fontSize: '15px', 
                  margin: 0,
                  lineHeight: '1.6',
                  flex: 1,
                  fontWeight: '500'
                }}>
                  {item.description}
                </p>
              </div>
              
              {/* Hours Badge */}
              <div style={{
                backgroundColor: COLORS.accentLight,
                padding: '10px 14px',
                borderRadius: '10px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Clock size={15} color={COLORS.accent} />
                <span style={{ 
                  color: COLORS.accent, 
                  fontSize: '15px', 
                  fontWeight: '800',
                  whiteSpace: 'nowrap'
                }}>
                  {item.hours}h {item.minutes}m
                </span>
              </div>
            </div>
          ))}

          {/* Total */}
          <div style={{
            backgroundColor: COLORS.accent,
            borderRadius: '12px',
            padding: '20px',
            marginTop: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: '#FFFFFF', fontSize: '17px', fontWeight: '700' }}>
              Total Estimated
            </span>
            <span style={{ color: '#FFFFFF', fontSize: '26px', fontWeight: '800' }}>
              {Math.floor(totalHours)}h {Math.round((totalHours % 1) * 60)}m
            </span>
          </div>
        </SectionCard>

        {/* Export Button */}
        <button
          style={{
            width: '100%',
            padding: '18px',
            marginTop: '20px',
            backgroundColor: 'transparent',
            border: `2px solid ${COLORS.accent}`,
            borderRadius: '12px',
            color: COLORS.accent,
            fontSize: '17px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          <Download size={20} />
          Export PDF
        </button>
      </div>
    </div>
  );
}

// Section Card Component
function SectionCard({ 
  title, 
  icon, 
  isExpanded, 
  onToggle, 
  colors, 
  badge,
  children 
}: { 
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  colors: any;
  badge?: number;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      backgroundColor: colors.card,
      borderRadius: '16px',
      overflow: 'hidden',
      marginBottom: '12px',
      border: `1px solid ${colors.border}`
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '20px',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: colors.accentLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </div>
          <span style={{ fontSize: '18px', fontWeight: '800', color: colors.textBold }}>
            {title}
          </span>
          {badge && (
            <span style={{
              backgroundColor: colors.accent,
              color: '#FFFFFF',
              padding: '4px 12px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700'
            }}>
              {badge}
            </span>
          )}
        </div>
        {isExpanded 
          ? <ChevronDown size={24} color={colors.textSecondary} />
          : <ChevronRight size={24} color={colors.textSecondary} />
        }
      </button>

      {isExpanded && (
        <div style={{ padding: '0 20px 20px' }}>
          {children}
        </div>
      )}
    </div>
  );
}

// Info Row Component
function InfoRow({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 0',
      borderBottom: `1px solid ${colors.border}`
    }}>
      <span style={{ color: colors.textSecondary, fontSize: '15px', fontWeight: '600' }}>{label}</span>
      <span style={{ 
        color: colors.textBold, 
        fontSize: '16px', 
        fontWeight: '700', 
        textAlign: 'right', 
        maxWidth: '60%' 
      }}>
        {value}
      </span>
    </div>
  );
}

// Spec Row Component
function SpecRow({ label, value, colors, isLast }: { label: string; value: string; colors: any; isLast?: boolean }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: isLast ? 0 : '12px',
      marginBottom: isLast ? 0 : '12px',
      borderBottom: isLast ? 'none' : `1px solid ${colors.border}40`
    }}>
      <span style={{ color: colors.textSecondary, fontSize: '14px', fontWeight: '600' }}>{label}</span>
      <span style={{ color: colors.textBold, fontSize: '16px', fontWeight: '700' }}>{value}</span>
    </div>
  );
}

export default WorkOrderScreen;
