import React, { useMemo, useState } from 'react';
import {
  Star,
  TrendingUp,
  ChevronRight,
  Play,
  CheckCircle2,
  BookOpen,
  Target,
  FileText,
  Quote,
  ArrowLeft
} from 'lucide-react';
import { useTheme } from '../ThemeProvider';

type SubScreen = 'main' | 'growth' | 'training' | 'manual';

// Public assets
const EMPLOYEE_IMAGE_SRC = '/mike-thompson.png';
const EMPLOYEE_MANUAL_PDF =
  '/Black_Forest_Hardwood_Floors_Employee_Manual_Modernized_Expanded.pdf';

export function MeScreen({ onBack }: { onBack?: () => void }) {
  const { colors } = useTheme();
  const [subScreen, setSubScreen] = useState<SubScreen>('main');

  const employee = useMemo(
    () => ({
      firstName: 'Mike',
      lastName: 'Thompson',
      role: 'Lead Installer',
      skillLevel: 3,
      avatar: EMPLOYEE_IMAGE_SRC,
      bio: {
        yearsExperience: 8,
        trainingClasses: ['Hardwood 101', 'LVP Certified'],
        certifications: ['Lead Installer', 'OSHA 30'],
        phone: '(864) 432-5678',
        email: 'mike.thompson@flooringpro.com'
      },
      personalQuote:
        'I want you to feel confident, informed, and proud of the finished result.'
    }),
    []
  );

  const latestReview = {
    clientName: 'Anderson Family',
    date: 'Jan 22, 2026',
    rating: 5,
    feedback:
      'Mike was professional, on time, and the craftsmanship was outstanding. The house stayed clean and the final result looks incredible.'
  };

  const reviewStats = {
    ytd: 18,
    tenureTotal: 18,
    avgRating: 4.6
  };

  // Sub-screens
  if (subScreen !== 'main') {
    return (
      <SubScreenWrapper
        title={getSubScreenTitle(subScreen)}
        onBack={() => setSubScreen('main')}
      >
        {subScreen === 'growth' && <GrowthSubScreen skillLevel={employee.skillLevel} />}
        {subScreen === 'training' && <TrainingSubScreen />}
        {subScreen === 'manual' && <EmployeeManualSubScreen />}
      </SubScreenWrapper>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background }}>
      {/* ================= HEADER ================= */}
      <div
        style={{
          position: 'relative',
          minHeight: 220,
          padding: '24px 18px',
          paddingTop: 'max(24px, env(safe-area-inset-top))',
          borderBottom: `1px solid ${colors.border}`,
          overflow: 'hidden'
        }}
      >
        {/* Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${employee.avatar})`,
            backgroundSize: 'cover',
            backgroundPosition: 'right center',
            filter: 'brightness(0.75)',
            transform: 'scale(1.05)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.85) 100%)'
          }}
        />

        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(0.92)')}
            onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
            style={{
              position: 'relative',
              zIndex: 2,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: 'rgba(0,0,0,0.45)',
              border: `1px solid ${colors.border}`,
              color: '#fff',
              padding: '8px 12px',
              borderRadius: 10,
              cursor: 'pointer',
              fontWeight: 800,
              transition: 'filter 0.2s ease'
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
        )}

        {/* Header content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ color: '#fff', fontSize: 38, fontWeight: 900, margin: 0 }}>
            {employee.firstName} {employee.lastName}
          </h1>
          <div style={{ color: '#9BE17C', fontSize: 18, fontWeight: 800 }}>
            {employee.role}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
            <Pill label={`Skill Level ${employee.skillLevel}`} icon={<TrendingUp size={16} />} />
            <Pill
              label={`${reviewStats.avgRating.toFixed(1)} ★ (${reviewStats.tenureTotal})`}
              icon={<Star size={16} />}
              accent="#D4A024"
            />
          </div>
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div style={{ padding: 16, maxWidth: 900, margin: '0 auto' }}>
        <Card title="Bio">
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>{employee.bio.yearsExperience} years experience</li>
            <li>{employee.bio.trainingClasses.join(', ')}</li>
            <li>Certs: {employee.bio.certifications.join(', ')}</li>
          </ul>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10, marginTop: 14 }}>
            <ContactPill icon="phone" value={employee.bio.phone} />
            <ContactPill icon="email" value={employee.bio.email} />
          </div>
        </Card>

        {/* Quote */}
        <div style={{ marginTop: 14 }}>
          <Card>
            <div style={{ display: 'flex', gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  backgroundColor: 'rgba(155, 225, 124, 0.16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(155, 225, 124, 0.18)'
                }}
              >
                <Quote size={20} color="#9BE17C" />
              </div>

              <div style={{ color: '#fff', fontStyle: 'italic', fontSize: 16, lineHeight: 1.35 }}>
                “{employee.personalQuote}”
              </div>
            </div>
          </Card>
        </div>

        {/* Review */}
        <div style={{ marginTop: 14 }}>
          <Card title="Latest Review" right={<Stars rating={latestReview.rating} />}>
            <div style={{ fontSize: 13, opacity: 0.8, color: '#CFCFCF' }}>
              {latestReview.clientName} • {latestReview.date}
            </div>
            <div style={{ marginTop: 8, color: '#FFFFFF', lineHeight: 1.55 }}>
              “{latestReview.feedback}”
            </div>

            <div style={{ marginTop: 12, color: '#AFAFAF', fontSize: 13 }}>
              YTD reviews: <span style={{ color: '#FFFFFF', fontWeight: 800 }}>{reviewStats.ytd}</span> • Total:{' '}
              <span style={{ color: '#FFFFFF', fontWeight: 800 }}>{reviewStats.tenureTotal}</span>
            </div>
          </Card>
        </div>

        {/* Performance */}
        <SectionHeader title="Performance" />

        <MenuItem
          label="Growth Path"
          subtitle={`Level ${employee.skillLevel} → ${employee.skillLevel + 1}`}
          onClick={() => setSubScreen('growth')}
          icon={Target}
        />
        <MenuItem
          label="Training Videos"
          subtitle="12 completed"
          onClick={() => setSubScreen('training')}
          icon={BookOpen}
        />
        <MenuItem
          label="Employee Manual"
          subtitle="Reference guide"
          onClick={() => setSubScreen('manual')}
          icon={FileText}
        />
      </div>
    </div>
  );
}

/* ================= Helpers ================= */

function getSubScreenTitle(s: SubScreen) {
  return {
    main: 'Me',
    growth: 'Growth Path',
    training: 'Training',
    manual: 'Employee Manual'
  }[s];
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h3
      style={{
        color: 'rgba(255,255,255,0.55)',
        fontSize: 12,
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
        margin: '18px 0 10px 2px'
      }}
    >
      {title}
    </h3>
  );
}

function SubScreenWrapper({ title, onBack, children }: any) {
  const { colors } = useTheme();
  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: 16,
          paddingTop: 'max(16px, env(safe-area-inset-top))',
          backgroundColor: colors.backgroundSecondary,
          borderBottom: `1px solid ${colors.border}`
        }}
      >
        <button
          onClick={onBack}
          onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(0.92)')}
          onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
          style={{
            padding: 10,
            borderRadius: 10,
            border: `1px solid ${colors.border}`,
            backgroundColor: colors.backgroundTertiary,
            color: '#fff',
            cursor: 'pointer',
            transition: 'filter 0.2s ease'
          }}
        >
          <ArrowLeft size={16} />
        </button>
        <h2 style={{ margin: 0, color: '#fff', fontWeight: 900, fontSize: 18 }}>{title}</h2>
      </div>

      <div style={{ padding: 16, maxWidth: 900, margin: '0 auto' }}>{children}</div>
    </div>
  );
}

function Card({ title, right, children }: any) {
  const { colors } = useTheme();
  return (
    <div
      style={{
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 14,
        border: `1px solid rgba(255,255,255,0.10)`,
        padding: 14,
        marginBottom: 12,
        boxShadow: '0 10px 26px rgba(0,0,0,0.35)'
      }}
    >
      {(title || right) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
          <strong style={{ color: '#fff', fontSize: 16, fontWeight: 900 }}>{title}</strong>
          {right}
        </div>
      )}
      <div style={{ color: '#EDEDED', lineHeight: 1.55 }}>{children}</div>
    </div>
  );
}

function Pill({ label, icon, accent }: any) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        borderRadius: 999,
        backgroundColor: 'rgba(0,0,0,0.45)',
        border: '1px solid rgba(255,255,255,0.14)',
        color: '#fff',
        fontWeight: 900
      }}
    >
      <span style={{ color: accent || '#9BE17C', display: 'flex', alignItems: 'center' }}>{icon}</span>
      {label}
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={16} fill={s <= rating ? '#D4A024' : 'transparent'} color="#D4A024" />
      ))}
    </div>
  );
}

function MenuItem({ icon: Icon, label, subtitle, onClick }: any) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(0.92)')}
      onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: 14,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        marginBottom: 10,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'filter 0.2s ease',
        boxShadow: '0 10px 26px rgba(0,0,0,0.35)'
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 12,
          backgroundColor: 'rgba(155, 225, 124, 0.10)',
          border: '1px solid rgba(155, 225, 124, 0.16)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '0 0 auto'
        }}
      >
        <Icon size={22} color="#9BE17C" />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: '#fff', fontSize: 16, fontWeight: 900 }}>{label}</div>
        {subtitle ? <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 2 }}>{subtitle}</div> : null}
      </div>

      <ChevronRight size={22} color="rgba(255,255,255,0.55)" />
    </button>
  );
}

function ContactPill({ icon, value }: { icon: 'phone' | 'email'; value: string }) {
  const emoji = icon === 'phone' ? '📞' : '✉️';
  return (
    <div
      style={{
        borderRadius: 12,
        border: `1px solid rgba(255,255,255,0.14)`,
        backgroundColor: 'rgba(0,0,0,0.25)',
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        color: '#FFFFFF',
        fontWeight: 900
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          backgroundColor: 'rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <span style={{ fontSize: 18 }}>{emoji}</span>
      </div>
      <div style={{ fontSize: 14, wordBreak: 'break-word' }}>{value}</div>
    </div>
  );
}

/* ================= Sub-screens ================= */

function GrowthSubScreen({ skillLevel }: any) {
  return (
    <div style={{ color: '#fff' }}>
      Growth path (example). Current skill level: <b>{skillLevel}</b>
    </div>
  );
}

function TrainingSubScreen() {
  return <div style={{ color: '#fff' }}>Training videos list (example).</div>;
}

function EmployeeManualSubScreen() {
  return (
    <div>
      <button
        onClick={() => window.open(EMPLOYEE_MANUAL_PDF, '_blank', 'noopener,noreferrer')}
        style={{
          width: '100%',
          padding: 14,
          borderRadius: 12,
          backgroundColor: 'rgba(155,225,124,0.18)',
          border: '1px solid rgba(155,225,124,0.22)',
          color: '#fff',
          fontWeight: 900,
          cursor: 'pointer'
        }}
      >
        Open Employee Manual (PDF)
      </button>
    </div>
  );
}
