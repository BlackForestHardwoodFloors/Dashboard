import { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  User,
  CheckCircle2,
  AlertTriangle,
  Camera,
  ChevronRight,
  ChevronDown,
  Droplets,
  Footprints,
  Dog,
  Volume2,
  Palette,
  Shield,
  X,
  Sparkles,
  ClipboardCheck,
  MessageSquare,
  Hammer,
  Layers,
  Star,
  ThumbsUp,
  Check,
  FileText
} from 'lucide-react';
import { useTheme } from '../ThemeProvider';

interface JobBriefingProps {
  onClose?: () => void;
  jobId?: string;
}

export function JobBriefingScreen({ onClose, jobId }: JobBriefingProps) {
  const { colors, isDark } = useTheme();
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [foremanNote, setForemanNote] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview', 'attention', 'scope']);

  // Job Briefing uses darker blue color (darker than Take Photo button)
  const BRIEFING_BLUE = '#1E5FC2';
  const BRIEFING_BLUE_LIGHT = isDark ? '#1A3A6E' : '#E8F0FC';
  
  const COLORS = {
    background: colors.background,
    card: colors.backgroundSecondary,
    text: colors.text,
    textSecondary: colors.textSecondary,
    border: colors.border,
    accent: BRIEFING_BLUE,
    accentLight: BRIEFING_BLUE_LIGHT,
    headerBg: BRIEFING_BLUE,
    warning: '#F59E0B',
    warningLight: isDark ? '#3D3520' : '#FEF3C7',
    danger: '#EF4444',
    dangerLight: isDark ? '#3D2020' : '#FEE2E2',
    success: '#10B981',
    successLight: isDark ? '#1D3D2D' : '#D1FAE5',
    aiPurple: '#8B5CF6',
    aiPurpleLight: isDark ? '#2D2640' : '#EDE9FE',
  };

  // Sample job data
  const jobData = {
    clientName: 'Anderson, James',
    jobName: 'Anderson Residence',
    address: '742 Maple Ridge Drive, Greenville, SC 29607',
    jobType: 'Install',
    duration: '5 days',
    startDate: 'Monday, Jan 6, 2025',
    foreman: 'Mike Rodriguez',
    crew: ['Carlos Martinez', 'James Wilson', 'Tommy Davis'],
    sqft: 1250,
    complexity: 'Medium' as const
  };

  const aiSummary = `This installation involves 1,250 sq ft of quarter-sawn red oak hardwood in the living room, dining room, and hallway. The client has selected a Jacobean stain with gloss oil-based polyurethane finish. Special attention should be given to the subfloor irregularity near the fireplace and the height transition at the kitchen threshold.`;

  const scopeItems = [
    { id: '1', label: 'Flooring Type', value: '4" x 3/4" Quarter Sawn Red Oak', status: 'confirmed' as const },
    { id: '2', label: 'Square Footage', value: '1,250 sq ft', status: 'confirmed' as const },
    { id: '3', label: 'Pattern', value: 'Running bond, parallel to front windows', status: 'confirmed' as const },
    { id: '4', label: 'Sanding', value: '36 → 60 → 80 → 100 grit sequence', status: 'confirmed' as const },
    { id: '5', label: 'Finish', value: 'Oil-based polyurethane, 3 coats', status: 'confirmed' as const },
    { id: '6', label: 'Stain', value: 'Jacobean (DuraSeal)', status: 'attention' as const, note: 'Client wants to see sample on-site first' },
    { id: '7', label: 'Transitions', value: '3 metal T-moldings', status: 'attention' as const, note: 'Height varies 1/8" to 1/4"' },
  ];

  const attentionItems = [
    { id: '1', title: 'Subfloor Irregularity', description: 'Uneven subfloor near fireplace hearth. May need additional leveling compound. Budget 2 extra hours.', severity: 'high' as const, icon: Layers },
    { id: '2', title: 'Height Transitions', description: 'Kitchen threshold has 1/4" height difference. Reducer molding approved but verify fit on day 1.', severity: 'medium' as const, icon: Footprints },
    { id: '3', title: 'Moisture Reading', description: 'Initial reading was 8.5% near exterior wall. Re-check before installation begins.', severity: 'medium' as const, icon: Droplets },
    { id: '4', title: 'Two Cats in Home', description: 'Cats will be confined to master bedroom during work hours. Keep hallway door closed.', severity: 'low' as const, icon: Dog },
    { id: '5', title: 'Client Works From Home', description: 'Home office on second floor. Minimize noise before 9 AM when possible.', severity: 'low' as const, icon: Volume2 },
  ];

  const executionNotes = {
    sequence: [
      'Day 1: Furniture move, baseboard removal, subfloor prep',
      'Day 2: Acclimation check, begin installation from living room',
      'Day 3: Complete installation, transitions, floor vent cuts',
      'Day 4: Sanding sequence, stain application (client approval first)',
      'Day 5: Finish coats, baseboard reinstall, final walkthrough'
    ],
    protection: 'Full plastic sheeting on stairway and kitchen entry. Zip walls at hallway to bedrooms.',
    dustControl: 'Dustless sanding system required. Client has respiratory sensitivity.',
    accessTimes: '8:00 AM – 5:00 PM. Ring doorbell on arrival.',
  };

  const clientConcerns = [
    { id: '1', concern: 'Dust Sensitivity', detail: 'Wife has asthma. Dustless sanding is mandatory.', icon: Shield },
    { id: '2', concern: 'Stain Color Match', detail: 'Previous floors came out too light. Wants to see sample before committing.', icon: Palette },
    { id: '3', concern: 'Previous Contractor Issues', detail: 'Last contractor left without completing trim. Values communication.', icon: MessageSquare },
    { id: '4', concern: 'Living Room Priority', detail: 'Most visible from entry. Extra attention to board selection here.', icon: Star },
  ];

  const photos = [
    { id: '1', url: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=400', tag: 'Subfloor concern' },
    { id: '2', url: 'https://images.unsplash.com/photo-1560185008-b033106af5c3?w=400', tag: 'Transition point' },
    { id: '3', url: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400', tag: 'Floor vent' },
    { id: '4', url: 'https://images.unsplash.com/photo-1560185127-6a8c1f1d9e2b?w=400', tag: 'Entry view' },
  ];

  const risks = ['Subfloor leveling may extend timeline', 'Stain approval could delay finish', 'Moisture levels need verification'];
  const priorities = ['Dustless sanding execution', 'Stain sample approval first', 'Clear daily communication'];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const getSeverityStyles = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high': return { bg: COLORS.dangerLight, border: COLORS.danger, text: COLORS.danger };
      case 'medium': return { bg: COLORS.warningLight, border: COLORS.warning, text: '#B45309' };
      case 'low': return { bg: COLORS.accentLight, border: COLORS.accent, text: COLORS.accent };
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: COLORS.background, paddingBottom: '100px' }}>
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
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)'
            }}
          >
            ← Back
          </button>
        )}

        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Sparkles size={22} color="#FFD700" />
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: '600', letterSpacing: '0.5px' }}>
              AI JOB BRIEFING
            </span>
          </div>
          
          <h1 style={{ color: '#FFFFFF', fontSize: '26px', fontWeight: '700', margin: '0 0 10px 0', lineHeight: '1.3' }}>
            {jobData.clientName}
          </h1>
          
          <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: '1.4' }}>
            <MapPin size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{jobData.address}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ backgroundColor: COLORS.card, borderBottom: `1px solid ${COLORS.border}`, padding: '20px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <StatCard icon={<Hammer size={18} color={COLORS.accent} />} label="Job Type" value={jobData.jobType} colors={COLORS} />
          <StatCard icon={<Clock size={18} color={COLORS.accent} />} label="Duration" value={jobData.duration} colors={COLORS} />
          <StatCard icon={<Calendar size={18} color={COLORS.accent} />} label="Start Date" value={jobData.startDate} colors={COLORS} />
          <StatCard icon={<User size={18} color={COLORS.accent} />} label="Foreman" value={jobData.foreman} colors={COLORS} />
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '16px' }}>
        
        {/* Crew */}
        <div style={{
          backgroundColor: COLORS.card,
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '12px',
          border: `1px solid ${COLORS.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: COLORS.accentLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={20} color={COLORS.accent} />
          </div>
          <div>
            <p style={{ color: COLORS.textSecondary, fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600' }}>Crew</p>
            <p style={{ color: COLORS.text, fontSize: '15px', margin: 0, fontWeight: '600' }}>{jobData.crew.join(', ')}</p>
          </div>
        </div>

        {/* AI Summary */}
        <div style={{
          backgroundColor: COLORS.aiPurpleLight,
          borderRadius: '16px',
          padding: '18px',
          marginBottom: '16px',
          borderLeft: `4px solid ${COLORS.aiPurple}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Sparkles size={18} color={COLORS.aiPurple} />
            <span style={{ fontSize: '14px', fontWeight: '700', color: COLORS.aiPurple }}>AI Summary</span>
          </div>
          <p style={{ fontSize: '15px', lineHeight: '1.7', color: COLORS.text, margin: 0 }}>
            {aiSummary}
          </p>
        </div>

        {/* AREAS OF SPECIAL ATTENTION */}
        <SectionHeader
          title="Areas of Special Attention"
          icon={<AlertTriangle size={20} color={COLORS.warning} />}
          isExpanded={expandedSections.includes('attention')}
          onToggle={() => toggleSection('attention')}
          colors={COLORS}
          badge={attentionItems.length}
          badgeColor={COLORS.warning}
          headerBg={COLORS.warningLight}
        >
          {attentionItems.map((item, index) => {
            const styles = getSeverityStyles(item.severity);
            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: styles.bg,
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: index < attentionItems.length - 1 ? '10px' : 0,
                  borderLeft: `4px solid ${styles.border}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: COLORS.card,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <item.icon size={18} color={styles.text} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '700', color: COLORS.text }}>{item.title}</span>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: styles.text, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {item.severity}
                      </span>
                    </div>
                    <p style={{ fontSize: '14px', color: COLORS.textSecondary, margin: 0, lineHeight: '1.6' }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </SectionHeader>

        {/* SCOPE OF WORK */}
        <SectionHeader
          title="Scope of Work"
          icon={<ClipboardCheck size={20} color={COLORS.accent} />}
          isExpanded={expandedSections.includes('scope')}
          onToggle={() => toggleSection('scope')}
          colors={COLORS}
        >
          {scopeItems.map((item, index) => (
            <div
              key={item.id}
              style={{
                padding: '14px 0',
                borderBottom: index < scopeItems.length - 1 ? `1px solid ${COLORS.border}` : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ color: COLORS.textSecondary, fontSize: '13px', display: 'block', marginBottom: '4px' }}>{item.label}</span>
                  <span style={{ color: COLORS.text, fontSize: '15px', fontWeight: '600' }}>{item.value}</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  backgroundColor: item.status === 'confirmed' ? COLORS.successLight : COLORS.warningLight
                }}>
                  {item.status === 'confirmed' 
                    ? <CheckCircle2 size={14} color={COLORS.success} />
                    : <AlertTriangle size={14} color={COLORS.warning} />
                  }
                  <span style={{ fontSize: '12px', fontWeight: '600', color: item.status === 'confirmed' ? COLORS.success : COLORS.warning }}>
                    {item.status === 'confirmed' ? 'Confirmed' : 'Attention'}
                  </span>
                </div>
              </div>
              {item.note && (
                <p style={{
                  fontSize: '13px',
                  color: COLORS.textSecondary,
                  margin: '8px 0 0 0',
                  padding: '10px 12px',
                  backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
                  borderRadius: '8px',
                  fontStyle: 'italic'
                }}>
                  📝 {item.note}
                </p>
              )}
            </div>
          ))}
        </SectionHeader>

        {/* WORK EXECUTION */}
        <SectionHeader
          title="Work Execution"
          icon={<Hammer size={20} color={COLORS.accent} />}
          isExpanded={expandedSections.includes('execution')}
          onToggle={() => toggleSection('execution')}
          colors={COLORS}
        >
          <div style={{
            backgroundColor: COLORS.accentLight,
            borderRadius: '12px',
            padding: '14px',
            marginBottom: '14px'
          }}>
            <p style={{ fontSize: '14px', color: COLORS.text, margin: 0, fontStyle: 'italic', lineHeight: '1.6' }}>
              💡 "Here's what I'd tell the crew if we were all standing together..."
            </p>
          </div>

          <h4 style={{ fontSize: '14px', fontWeight: '700', color: COLORS.text, margin: '0 0 12px 0' }}>Daily Sequence</h4>
          {executionNotes.sequence.map((step, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '8px',
                backgroundColor: COLORS.accent,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: '700',
                flexShrink: 0
              }}>
                {index + 1}
              </div>
              <p style={{ fontSize: '15px', color: COLORS.text, margin: 0, lineHeight: '1.6' }}>{step}</p>
            </div>
          ))}

          <div style={{ marginTop: '16px', display: 'grid', gap: '10px' }}>
            <NoteCard icon={<Shield size={16} />} title="Protection" text={executionNotes.protection} colors={COLORS} />
            <NoteCard icon={<Droplets size={16} />} title="Dust Control" text={executionNotes.dustControl} colors={COLORS} />
            <NoteCard icon={<Clock size={16} />} title="Access Times" text={executionNotes.accessTimes} colors={COLORS} />
          </div>
        </SectionHeader>

        {/* CLIENT CONCERNS */}
        <SectionHeader
          title="Client Concerns"
          icon={<MessageSquare size={20} color={COLORS.accent} />}
          isExpanded={expandedSections.includes('client')}
          onToggle={() => toggleSection('client')}
          colors={COLORS}
        >
          {clientConcerns.map((item, index) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '14px 0',
                borderBottom: index < clientConcerns.length - 1 ? `1px solid ${COLORS.border}` : 'none'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: COLORS.accentLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <item.icon size={18} color={COLORS.accent} />
              </div>
              <div>
                <span style={{ fontSize: '15px', fontWeight: '700', color: COLORS.text, display: 'block', marginBottom: '4px' }}>{item.concern}</span>
                <p style={{ fontSize: '14px', color: COLORS.textSecondary, margin: 0, lineHeight: '1.6' }}>{item.detail}</p>
              </div>
            </div>
          ))}
        </SectionHeader>

        {/* PHOTOS */}
        <SectionHeader
          title="Photos"
          icon={<Camera size={20} color={COLORS.accent} />}
          isExpanded={expandedSections.includes('photos')}
          onToggle={() => toggleSection('photos')}
          colors={COLORS}
          badge={photos.length}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {photos.map((photo) => (
              <div key={photo.id} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '4/3' }}>
                <img src={photo.url} alt={photo.tag} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  padding: '10px',
                }}>
                  <span style={{ fontSize: '12px', color: '#FFD700', fontWeight: '600' }}>{photo.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionHeader>

        {/* RISK SUMMARY */}
        <SectionHeader
          title="Risk & Success Summary"
          icon={<Sparkles size={20} color={COLORS.aiPurple} />}
          isExpanded={expandedSections.includes('risk')}
          onToggle={() => toggleSection('risk')}
          colors={COLORS}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={{ backgroundColor: COLORS.dangerLight, borderRadius: '12px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <AlertTriangle size={16} color={COLORS.danger} />
                <span style={{ fontSize: '13px', fontWeight: '700', color: COLORS.danger }}>Top Risks</span>
              </div>
              {risks.map((risk, i) => (
                <p key={i} style={{ fontSize: '13px', color: COLORS.text, margin: '0 0 6px 0', lineHeight: '1.5' }}>• {risk}</p>
              ))}
            </div>
            <div style={{ backgroundColor: COLORS.successLight, borderRadius: '12px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <ThumbsUp size={16} color={COLORS.success} />
                <span style={{ fontSize: '13px', fontWeight: '700', color: COLORS.success }}>Priorities</span>
              </div>
              {priorities.map((p, i) => (
                <p key={i} style={{ fontSize: '13px', color: COLORS.text, margin: '0 0 6px 0', lineHeight: '1.5' }}>• {p}</p>
              ))}
            </div>
          </div>

          {/* Complexity */}
          <div style={{
            backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '15px', fontWeight: '600', color: COLORS.text }}>Job Complexity</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['Low', 'Medium', 'High'].map((level, i) => (
                  <div key={level} style={{
                    width: '28px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: i <= ['Low', 'Medium', 'High'].indexOf(jobData.complexity) ? COLORS.warning : COLORS.border
                  }} />
                ))}
              </div>
              <span style={{ fontSize: '15px', fontWeight: '700', color: COLORS.warning }}>{jobData.complexity}</span>
            </div>
          </div>
        </SectionHeader>

        {/* ACKNOWLEDGMENT */}
        <div style={{
          backgroundColor: COLORS.card,
          borderRadius: '16px',
          padding: '20px',
          marginTop: '16px',
          border: acknowledged ? `2px solid ${COLORS.success}` : `1px solid ${COLORS.border}`
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: COLORS.text, margin: '0 0 16px 0' }}>Ready to Start?</h3>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', cursor: 'pointer', marginBottom: '16px' }}>
            <div
              onClick={() => setAcknowledged(!acknowledged)}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '8px',
                border: `2px solid ${acknowledged ? COLORS.success : COLORS.border}`,
                backgroundColor: acknowledged ? COLORS.success : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                cursor: 'pointer'
              }}
            >
              {acknowledged && <Check size={16} color="#FFFFFF" />}
            </div>
            <div>
              <span style={{ fontSize: '15px', fontWeight: '600', color: COLORS.text }}>Reviewed & Understood</span>
              <p style={{ fontSize: '13px', color: COLORS.textSecondary, margin: '4px 0 0 0', lineHeight: '1.5' }}>
                I have reviewed this briefing and understand the scope, risks, and client expectations.
              </p>
            </div>
          </label>

          <textarea
            value={foremanNote}
            onChange={(e) => setForemanNote(e.target.value)}
            placeholder="Anything the crew should know? (Optional)"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: `1px solid ${COLORS.border}`,
              backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
              color: COLORS.text,
              fontSize: '15px',
              minHeight: '80px',
              resize: 'vertical',
              fontFamily: 'inherit',
              marginBottom: '16px'
            }}
          />

          <button
            disabled={!acknowledged}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: acknowledged ? COLORS.accent : COLORS.border,
              color: acknowledged ? '#FFFFFF' : COLORS.textSecondary,
              fontSize: '16px',
              fontWeight: '700',
              cursor: acknowledged ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <Check size={20} />
            Confirm & Begin Job
          </button>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, colors }: { icon: React.ReactNode; label: string; value: string; colors: any }) {
  return (
    <div style={{
      backgroundColor: colors.accentLight,
      borderRadius: '12px',
      padding: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <div style={{
        width: '38px',
        height: '38px',
        borderRadius: '10px',
        backgroundColor: colors.card,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {icon}
      </div>
      <div>
        <p style={{ color: colors.textSecondary, fontSize: '12px', margin: '0 0 2px 0', fontWeight: '600' }}>{label}</p>
        <p style={{ color: colors.text, fontSize: '15px', margin: 0, fontWeight: '700' }}>{value}</p>
      </div>
    </div>
  );
}

// Section Header Component
function SectionHeader({ title, icon, isExpanded, onToggle, colors, badge, badgeColor, headerBg, children }: {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  colors: any;
  badge?: number;
  badgeColor?: string;
  headerBg?: string;
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
          padding: '18px',
          backgroundColor: headerBg || 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {icon}
          <span style={{ fontSize: '17px', fontWeight: '700', color: colors.text }}>{title}</span>
          {badge && (
            <span style={{
              backgroundColor: badgeColor || colors.accent,
              color: '#FFFFFF',
              padding: '4px 10px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              {badge}
            </span>
          )}
        </div>
        {isExpanded ? <ChevronDown size={22} color={colors.textSecondary} /> : <ChevronRight size={22} color={colors.textSecondary} />}
      </button>
      {isExpanded && <div style={{ padding: '0 18px 18px' }}>{children}</div>}
    </div>
  );
}

// Note Card Component
function NoteCard({ icon, title, text, colors }: { icon: React.ReactNode; title: string; text: string; colors: any }) {
  return (
    <div style={{ backgroundColor: colors.accentLight, borderRadius: '10px', padding: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: colors.accent }}>
        {icon}
        <span style={{ fontSize: '14px', fontWeight: '600' }}>{title}</span>
      </div>
      <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0, lineHeight: '1.6' }}>{text}</p>
    </div>
  );
}

export default JobBriefingScreen;
