import React, { useState } from 'react';
import { 
  User,
  Star,
  TrendingUp,
  Award,
  Clock,
  Calendar,
  FileText,
  ChevronRight,
  Play,
  CheckCircle2,
  DollarSign,
  Settings,
  LogOut,
  AlertTriangle,
  BookOpen,
  Target,
  Gift
} from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import type { Employee, Job } from '../EmployeePortal';
import { TimeEntryScreen } from './TimeEntryScreen';

interface MeScreenProps {
  employee: Employee;
  jobs: Job[];
}

type SubScreen = 'main' | 'reviews' | 'growth' | 'training' | 'time' | 'calendar' | 'msds';

export function MeScreen({ employee, jobs }: MeScreenProps) {
  const { colors } = useTheme();
  const [subScreen, setSubScreen] = useState<SubScreen>('main');

  // Calculate stats
  const avgRating = employee.reviews.length > 0
    ? (employee.reviews.reduce((sum, r) => sum + r.rating, 0) / employee.reviews.length).toFixed(1)
    : '0.0';
  const totalBonuses = employee.bonuses.reduce((sum, b) => sum + b.amount, 0);
  const completedJobs = jobs.filter(j => j.status === 'Completed').length;

  // TimeEntryScreen has its own header, so render it directly
  if (subScreen === 'time') {
    return <TimeEntryScreen onBack={() => setSubScreen('main')} />;
  }

  if (subScreen !== 'main') {
    return (
      <SubScreenWrapper 
        title={getSubScreenTitle(subScreen)} 
        onBack={() => setSubScreen('main')}
        colors={colors}
      >
        {subScreen === 'reviews' && <ReviewsSubScreen employee={employee} colors={colors} />}
        {subScreen === 'growth' && <GrowthSubScreen employee={employee} colors={colors} />}
        {subScreen === 'training' && <TrainingSubScreen employee={employee} colors={colors} />}
        {subScreen === 'calendar' && <CalendarSubScreen colors={colors} />}
        {subScreen === 'msds' && <MSDSSubScreen colors={colors} />}
      </SubScreenWrapper>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      paddingBottom: '100px'
    }}>
      {/* Profile Header */}
      <div style={{
        padding: '24px 20px',
        paddingTop: 'max(24px, env(safe-area-inset-top))',
        background: `linear-gradient(180deg, ${colors.backgroundSecondary} 0%, ${colors.background} 100%)`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Avatar */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: colors.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: '700',
            color: '#FFFFFF',
            overflow: 'hidden'
          }}>
            {employee.avatar ? (
              <img 
                src={employee.avatar} 
                alt={employee.firstName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              `${employee.firstName[0]}${employee.lastName[0]}`
            )}
          </div>
          
          <div style={{ flex: 1 }}>
            <h1 style={{
              color: colors.text,
              fontSize: '24px',
              fontWeight: '700',
              margin: '0 0 4px 0'
            }}>
              {employee.firstName} {employee.lastName}
            </h1>
            <p style={{
              color: colors.accent,
              fontSize: '15px',
              fontWeight: '600',
              margin: '0 0 4px 0'
            }}>
              {employee.role}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star size={14} color="#D4A024" fill="#D4A024" />
              <span style={{ color: '#D4A024', fontSize: '14px', fontWeight: '700' }}>
                {avgRating}
              </span>
              <span style={{ color: colors.textSecondary, fontSize: '13px' }}>
                ({employee.reviews.length} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginTop: '20px'
        }}>
          <StatCard 
            label="Skill Level" 
            value={`Level ${employee.skillLevel}`} 
            icon={TrendingUp}
            color="#0F7BFF"
            colors={colors}
          />
          <StatCard 
            label="Jobs Done" 
            value={completedJobs.toString()} 
            icon={CheckCircle2}
            color="#4F6A41"
            colors={colors}
          />
          <StatCard 
            label="Bonuses" 
            value={`$${totalBonuses}`} 
            icon={Gift}
            color="#D4A024"
            colors={colors}
          />
        </div>
      </div>

      {/* Menu Items */}
      <div style={{ padding: '20px' }}>
        {/* Performance Section */}
        <SectionHeader title="Performance" colors={colors} />
        
        <MenuItem 
          icon={Star}
          label="Customer Reviews"
          subtitle={`${employee.reviews.length} reviews • ${avgRating} avg`}
          onClick={() => setSubScreen('reviews')}
          colors={colors}
        />
        <MenuItem 
          icon={Target}
          label="Growth Path"
          subtitle={`Level ${employee.skillLevel} → Level ${employee.skillLevel + 1}`}
          onClick={() => setSubScreen('growth')}
          colors={colors}
        />
        <MenuItem 
          icon={BookOpen}
          label="Training Videos"
          subtitle={`${employee.trainingCompleted.length} completed`}
          onClick={() => setSubScreen('training')}
          colors={colors}
        />

        {/* Time & Schedule Section */}
        <SectionHeader title="Time & Schedule" colors={colors} />
        
        <MenuItem 
          icon={Clock}
          label="Report Time"
          subtitle="Log hours, view time entries"
          onClick={() => setSubScreen('time')}
          colors={colors}
        />
        <MenuItem 
          icon={Calendar}
          label="Calendar & Time Off"
          subtitle="View schedule, request PTO"
          onClick={() => setSubScreen('calendar')}
          colors={colors}
        />

        {/* Resources Section */}
        <SectionHeader title="Resources" colors={colors} />
        
        <MenuItem 
          icon={AlertTriangle}
          label="MSDS Sheets"
          subtitle="Safety data sheets"
          onClick={() => setSubScreen('msds')}
          colors={colors}
          iconColor="#E74C3C"
        />

        {/* Settings Section */}
        <SectionHeader title="Account" colors={colors} />
        
        <MenuItem 
          icon={Settings}
          label="Settings"
          onClick={() => console.log('Settings')}
          colors={colors}
        />
        <MenuItem 
          icon={LogOut}
          label="Log Out"
          onClick={() => console.log('Logout')}
          colors={colors}
          iconColor="#E74C3C"
        />
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ label, value, icon: Icon, color, colors }: any) {
  return (
    <div style={{
      backgroundColor: colors.backgroundSecondary,
      borderRadius: '12px',
      padding: '14px 12px',
      textAlign: 'center',
      border: `1px solid ${colors.border}`
    }}>
      <Icon size={20} color={color} style={{ marginBottom: '6px' }} />
      <p style={{
        color: colors.text,
        fontSize: '16px',
        fontWeight: '700',
        margin: '0 0 2px 0'
      }}>
        {value}
      </p>
      <p style={{
        color: colors.textSecondary,
        fontSize: '11px',
        margin: 0
      }}>
        {label}
      </p>
    </div>
  );
}

function SectionHeader({ title, colors }: any) {
  return (
    <h3 style={{
      color: colors.textSecondary,
      fontSize: '12px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      margin: '24px 0 12px 0'
    }}>
      {title}
    </h3>
  );
}

function MenuItem({ icon: Icon, label, subtitle, onClick, colors, iconColor }: any) {
  return (
    <button
      onClick={onClick}
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
        marginBottom: '8px',
        textAlign: 'left'
      }}
    >
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        backgroundColor: colors.backgroundTertiary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={20} color={iconColor || colors.accent} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{
          color: colors.text,
          fontSize: '15px',
          fontWeight: '600',
          margin: 0
        }}>
          {label}
        </p>
        {subtitle && (
          <p style={{
            color: colors.textSecondary,
            fontSize: '13px',
            margin: '2px 0 0 0'
          }}>
            {subtitle}
          </p>
        )}
      </div>
      <ChevronRight size={20} color={colors.textTertiary} />
    </button>
  );
}

function SubScreenWrapper({ title, onBack, colors, children }: any) {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      paddingBottom: '40px'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        paddingTop: 'max(16px, env(safe-area-inset-top))',
        backgroundColor: colors.backgroundSecondary,
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <button
          onClick={onBack}
          style={{
            padding: '8px',
            backgroundColor: colors.backgroundTertiary,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            color: colors.text
          }}
        >
          ←
        </button>
        <h1 style={{
          color: colors.text,
          fontSize: '18px',
          fontWeight: '700',
          margin: 0
        }}>
          {title}
        </h1>
      </div>
      <div style={{ padding: '20px' }}>
        {children}
      </div>
    </div>
  );
}

function getSubScreenTitle(screen: SubScreen): string {
  const titles: Record<SubScreen, string> = {
    main: 'Me',
    reviews: 'Customer Reviews',
    growth: 'Growth Path',
    training: 'Training Videos',
    time: 'Report Time',
    calendar: 'Calendar & Time Off',
    msds: 'MSDS Sheets'
  };
  return titles[screen];
}

// Sub-screens
function ReviewsSubScreen({ employee, colors }: any) {
  return (
    <div>
      {employee.reviews.map((review: any) => (
        <div key={review.id} style={{
          backgroundColor: colors.backgroundSecondary,
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '12px',
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: colors.text, fontWeight: '600' }}>{review.clientName}</span>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1,2,3,4,5].map(star => (
                <Star 
                  key={star} 
                  size={14} 
                  color="#D4A024" 
                  fill={star <= review.rating ? "#D4A024" : "transparent"}
                />
              ))}
            </div>
          </div>
          <p style={{ color: colors.textSecondary, fontSize: '14px', margin: '0 0 8px 0' }}>
            "{review.feedback}"
          </p>
          <p style={{ color: colors.textTertiary, fontSize: '12px', margin: 0 }}>
            {review.date}
          </p>
        </div>
      ))}
    </div>
  );
}

function GrowthSubScreen({ employee, colors }: any) {
  const levels = [
    { level: 1, title: 'Apprentice', requirements: ['Complete Safety Training', 'Shadow 5 jobs'] },
    { level: 2, title: 'Installer', requirements: ['Complete Hardwood 101', 'Lead 10 jobs', 'Avg rating 4.0+'] },
    { level: 3, title: 'Lead Installer', requirements: ['Complete LVP Certification', 'Lead 50 jobs', 'Avg rating 4.5+'] },
    { level: 4, title: 'Senior Installer', requirements: ['Train 2 apprentices', 'Lead 100 jobs', 'Avg rating 4.8+'] },
    { level: 5, title: 'Master Installer', requirements: ['All certifications', 'Lead 200 jobs', 'Train 5 installers'] },
  ];

  return (
    <div>
      {levels.map((lvl, idx) => {
        const isCurrent = lvl.level === employee.skillLevel;
        const isCompleted = lvl.level < employee.skillLevel;
        const isNext = lvl.level === employee.skillLevel + 1;
        
        return (
          <div key={lvl.level} style={{
            backgroundColor: isCurrent ? colors.accentLight : colors.backgroundSecondary,
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '12px',
            border: `2px solid ${isCurrent ? colors.accent : colors.border}`,
            opacity: isCompleted ? 0.6 : 1
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isCompleted ? '#4F6A41' : isCurrent ? colors.accent : colors.backgroundTertiary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {isCompleted ? (
                  <CheckCircle2 size={18} color="#FFFFFF" />
                ) : (
                  <span style={{ color: isCurrent ? '#FFFFFF' : colors.textSecondary, fontWeight: '700' }}>
                    {lvl.level}
                  </span>
                )}
              </div>
              <div>
                <p style={{ color: colors.text, fontWeight: '700', margin: 0 }}>{lvl.title}</p>
                {isCurrent && <span style={{ color: colors.accent, fontSize: '12px' }}>Current Level</span>}
                {isNext && <span style={{ color: '#D4A024', fontSize: '12px' }}>Next Goal</span>}
              </div>
            </div>
            {(isCurrent || isNext) && (
              <ul style={{ margin: '8px 0 0 44px', padding: 0, listStyle: 'none' }}>
                {lvl.requirements.map((req, i) => (
                  <li key={i} style={{ color: colors.textSecondary, fontSize: '13px', marginBottom: '4px' }}>
                    • {req}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TrainingSubScreen({ employee, colors }: any) {
  const videos = [
    { id: '1', title: 'Safety Basics', duration: '15 min', completed: true },
    { id: '2', title: 'Hardwood 101', duration: '45 min', completed: true },
    { id: '3', title: 'Customer Service', duration: '20 min', completed: true },
    { id: '4', title: 'LVP Installation', duration: '60 min', completed: false },
    { id: '5', title: 'Stain Application', duration: '30 min', completed: false },
    { id: '6', title: 'Advanced Sanding', duration: '40 min', completed: false },
  ];

  return (
    <div>
      {videos.map(video => (
        <div key={video.id} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          backgroundColor: colors.backgroundSecondary,
          borderRadius: '12px',
          padding: '14px',
          marginBottom: '10px',
          border: `1px solid ${colors.border}`
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            backgroundColor: video.completed ? '#4F6A41' : colors.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {video.completed ? (
              <CheckCircle2 size={24} color="#FFFFFF" />
            ) : (
              <Play size={24} color="#FFFFFF" />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: colors.text, fontWeight: '600', margin: 0 }}>{video.title}</p>
            <p style={{ color: colors.textSecondary, fontSize: '13px', margin: '2px 0 0 0' }}>
              {video.duration}
            </p>
          </div>
          {video.completed && (
            <span style={{ color: '#4F6A41', fontSize: '12px', fontWeight: '600' }}>
              Completed
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function CalendarSubScreen({ colors }: any) {
  const [showRequestForm, setShowRequestForm] = useState(false);
  
  const timeOffRequests = [
    { id: '1', dates: 'Dec 25-26', type: 'PTO', status: 'Approved' },
    { id: '2', dates: 'Jan 1', type: 'PTO', status: 'Approved' },
    { id: '3', dates: 'Jan 15-17', type: 'Personal', status: 'Pending' },
  ];

  return (
    <div>
      {/* Request Time Off Button */}
      <button
        onClick={() => setShowRequestForm(!showRequestForm)}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: colors.accent,
          border: 'none',
          borderRadius: '12px',
          color: '#FFFFFF',
          fontSize: '16px',
          fontWeight: '700',
          cursor: 'pointer',
          marginBottom: '24px'
        }}
      >
        + Request Time Off
      </button>

      {/* Time Off Requests */}
      <h3 style={{ color: colors.text, fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
        My Requests
      </h3>
      {timeOffRequests.map(req => (
        <div key={req.id} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: colors.backgroundSecondary,
          borderRadius: '12px',
          padding: '14px 16px',
          marginBottom: '10px',
          border: `1px solid ${colors.border}`
        }}>
          <div>
            <p style={{ color: colors.text, fontWeight: '600', margin: 0 }}>{req.dates}</p>
            <p style={{ color: colors.textSecondary, fontSize: '13px', margin: '2px 0 0 0' }}>{req.type}</p>
          </div>
          <span style={{
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '700',
            backgroundColor: req.status === 'Approved' ? 'rgba(79, 106, 65, 0.2)' : 'rgba(212, 160, 36, 0.2)',
            color: req.status === 'Approved' ? '#4F6A41' : '#D4A024'
          }}>
            {req.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function MSDSSubScreen({ colors }: any) {
  const msdsSheets = [
    { id: '1', name: 'Bona Traffic HD', category: 'Finish' },
    { id: '2', name: 'DuraSeal Stain', category: 'Stain' },
    { id: '3', name: 'Bona DriFast Stain', category: 'Stain' },
    { id: '4', name: 'Pallmann Magic Oil', category: 'Finish' },
    { id: '5', name: 'Wood Floor Adhesive', category: 'Adhesive' },
    { id: '6', name: 'Floor Leveling Compound', category: 'Prep' },
  ];

  return (
    <div>
      <p style={{ color: colors.textSecondary, fontSize: '14px', marginBottom: '16px' }}>
        Material Safety Data Sheets for products we use. Tap to view PDF.
      </p>
      {msdsSheets.map(sheet => (
        <button
          key={sheet.id}
          onClick={() => console.log('Open MSDS:', sheet.name)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            backgroundColor: colors.backgroundSecondary,
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '10px',
            border: `1px solid ${colors.border}`,
            cursor: 'pointer',
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
              {sheet.category}
            </p>
          </div>
          <ChevronRight size={20} color={colors.textTertiary} />
        </button>
      ))}
    </div>
  );
}
