import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  Target,
  Briefcase,
  BookOpen,
  Star,
  ChevronDown,
  Edit2,
  Plus,
  Info,
  CheckCircle
} from 'lucide-react';

type TabType = 'overview' | 'skill-ladder' | 'evs-scorecard' | 'jvs-scorecard' | 'training';

export default function P4PGrowthPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: <Users size={16} /> },
    { id: 'skill-ladder' as TabType, label: 'Skill Ladder', icon: <GraduationCap size={16} /> },
    { id: 'evs-scorecard' as TabType, label: 'EVS Scorecard', icon: <Target size={16} /> },
    { id: 'jvs-scorecard' as TabType, label: 'JVS Scorecard', icon: <Briefcase size={16} /> },
    { id: 'training' as TabType, label: 'Training', icon: <BookOpen size={16} /> },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      padding: '24px',
      paddingTop: '70px',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '26px',
          fontWeight: '600',
          color: '#FFFFFF',
          margin: '0 0 8px 0',
        }}>
          Professional Growth & Development
        </h1>
        <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>
          Team members' career progress and skill development
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '24px',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: activeTab === tab.id ? '#14B8A6' : 'transparent',
              border: activeTab === tab.id ? 'none' : '1px solid #444',
              borderRadius: '8px',
              color: activeTab === tab.id ? '#fff' : '#888',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'skill-ladder' && <SkillLadderTab />}
      {activeTab === 'evs-scorecard' && <EVSTab />}
      {activeTab === 'jvs-scorecard' && <JVSTab />}
      {activeTab === 'training' && <TrainingTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div>
      {/* Three Score Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginBottom: '32px',
      }}>
        {/* EVS Score Card */}
        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '12px',
          padding: '20px',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: '#3B82F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Target size={22} color="#fff" />
              </div>
              <div>
                <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', margin: 0 }}>EVS Score</h3>
                <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>Out of 100</p>
              </div>
            </div>
            <button style={{
              padding: '8px 20px',
              backgroundColor: '#14B8A6',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}>
              Update
            </button>
          </div>

          {/* Mahesh Dev */}
          <EmployeeRow name="Mahesh Dev" multiplier={1.50} score={100} maxScore={100} hasStar={true} />
          {/* Alex Olmos */}
          <EmployeeRow name="Alex Olmos" multiplier={1.50} score={96} maxScore={100} hasStar={false} />
          {/* Anthony Abosida */}
          <EmployeeRow name="Anthony Abosida" multiplier={1.50} score={95} maxScore={100} hasStar={false} isLast={true} />
        </div>

        {/* Skill Level Card */}
        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '12px',
          padding: '20px',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: '#F97316',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <GraduationCap size={22} color="#fff" />
              </div>
              <div>
                <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', margin: 0 }}>Skill Level</h3>
                <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>Out of 15</p>
              </div>
            </div>
            <button style={{
              padding: '8px 20px',
              backgroundColor: '#14B8A6',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}>
              Update
            </button>
          </div>

          {/* Mahesh Dev */}
          <EmployeeRow name="Mahesh Dev" subtitle="Level 15" multiplier={1.53} score={15} maxScore={15} hasStar={true} />
          {/* Amit K */}
          <EmployeeRow name="Amit K" subtitle="Level 14" multiplier={1.40} score={14} maxScore={15} hasStar={false} />
          {/* Hamza Khan */}
          <EmployeeRow name="Hamza Khan" subtitle="Level 12" multiplier={1.30} score={12} maxScore={15} hasStar={false} isLast={true} />
        </div>

        {/* JVS Score Card */}
        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '12px',
          padding: '20px',
        }}>
          {/* Header - No Update button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: '#14B8A6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Briefcase size={22} color="#fff" />
              </div>
              <div>
                <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', margin: 0 }}>JVS Score</h3>
                <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>Out of 5</p>
              </div>
            </div>
          </div>

          {/* Ronald Lajkan - 0.80x orange */}
          <EmployeeRow name="Ronald Lajkan" multiplier={0.80} score={4} maxScore={5} hasStar={true} />
          {/* Anthony Abosida */}
          <EmployeeRow name="Anthony Abosida" multiplier={1.00} score={5} maxScore={5} hasStar={false} />
          {/* Chase Reedy */}
          <EmployeeRow name="Chase Reedy" multiplier={1.00} score={5} maxScore={5} hasStar={false} isLast={true} />
        </div>
      </div>

      {/* Top Performers Table */}
      <TopPerformersTable />
    </div>
  );
}

function EmployeeRow({ 
  name, 
  subtitle, 
  multiplier, 
  score, 
  maxScore, 
  hasStar,
  isLast = false
}: {
  name: string;
  subtitle?: string;
  multiplier: number;
  score: number;
  maxScore: number;
  hasStar: boolean;
  isLast?: boolean;
}) {
  const percentage = (score / maxScore) * 100;
  const isGreen = multiplier >= 1.00;
  const initials = name.split(' ').map(n => n[0]).join('');

  return (
    <div style={{ marginBottom: isLast ? 0 : '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        {/* Left side - Avatar and name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#14B8A6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: '600',
              fontSize: '13px',
            }}>
              {initials}
            </div>
            {hasStar && (
              <div style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#FBBF24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Star size={10} color="#fff" fill="#fff" />
              </div>
            )}
          </div>
          <div>
            <p style={{ color: '#fff', fontSize: '15px', fontWeight: '500', margin: 0 }}>{name}</p>
            {subtitle && (
              <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right side - Multiplier badge and score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            padding: '5px 14px',
            backgroundColor: isGreen ? '#10B981' : '#F97316',
            borderRadius: '20px',
            color: '#fff',
            fontSize: '13px',
            fontWeight: '700',
          }}>
            {multiplier.toFixed(2)}x
          </span>
          <span style={{ color: '#fff', fontWeight: '600', fontSize: '15px' }}>
            {score}/{maxScore}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        height: '10px',
        backgroundColor: '#444',
        borderRadius: '5px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          backgroundColor: '#10B981',
          borderRadius: '5px',
        }} />
      </div>
    </div>
  );
}

function TopPerformersTable() {
  const performers = [
    { name: 'John Anderson', email: 'john.anderson@example.com', skillLevel: 12, evs: 92, jvs: 88, total: 9.72 },
    { name: 'Sarah Mitchell', email: 'sarah.mitchell@example.com', skillLevel: 11, evs: 87, jvs: 85, total: 8.13 },
    { name: 'Michael Chen', email: 'michael.chen@example.com', skillLevel: 10, evs: 84, jvs: 82, total: 6.89 },
    { name: 'David Wilson', email: 'david.wilson@example.com', skillLevel: 13, evs: 89, jvs: 90, total: 10.41 },
    { name: 'Emily Rodriguez', email: 'emily.rodriguez@example.com', skillLevel: 11, evs: 86, jvs: 84, total: 7.95 },
    { name: 'James Thompson', email: 'james.thompson@example.com', skillLevel: 10, evs: 83, jvs: 81, total: 6.72 },
    { name: 'Lisa Martinez', email: 'lisa.martinez@example.com', skillLevel: 12, evs: 88, jvs: 87, total: 9.19 },
  ];

  const month = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div style={{
      backgroundColor: '#2a2a2a',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #444' }}>
        <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', margin: 0 }}>
          Top Performers of {month}
        </h2>
      </div>

      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
        padding: '12px 20px',
        borderBottom: '1px solid #444',
      }}>
        <span style={{ color: '#888', fontSize: '13px' }}>Employee</span>
        <span style={{ color: '#888', fontSize: '13px', textAlign: 'center' }}>Skill Level</span>
        <span style={{ color: '#888', fontSize: '13px', textAlign: 'center' }}>EVS Score</span>
        <span style={{ color: '#888', fontSize: '13px', textAlign: 'center' }}>JVS Score</span>
        <span style={{ color: '#888', fontSize: '13px', textAlign: 'center' }}>Total</span>
      </div>

      {/* Rows */}
      {performers.map((p, i) => (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
            padding: '16px 20px',
            alignItems: 'center',
            borderBottom: i < performers.length - 1 ? '1px solid #333' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#14B8A6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: '600',
              fontSize: '14px',
            }}>
              {p.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: '500', margin: 0 }}>{p.name}</p>
              <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>{p.email}</p>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#14B8A6', fontWeight: '700', fontSize: '18px' }}>{p.skillLevel}</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#14B8A6', fontWeight: '700', fontSize: '18px' }}>{p.evs}</span>
            <span style={{ color: '#888', fontSize: '14px' }}> / 100</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#14B8A6', fontWeight: '700', fontSize: '18px' }}>{p.jvs}</span>
            <span style={{ color: '#888', fontSize: '14px' }}> / 100</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#14B8A6', fontWeight: '700', fontSize: '18px' }}>{p.total}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillLadderTab() {
  const levels = [
    { level: 1, title: 'Helper / Entry Level', desc: 'Safety & Jobsite Basics', mult: 1.00, eligible: false },
    { level: 2, title: 'Floor Prep Assistant', desc: 'Surface Prep, Repair, and Finishing Prep', mult: 1.00, eligible: false },
    { level: 3, title: 'Junior Installer / Sanding Assistant', desc: 'Basic Install & Sanding Skills', mult: 1.05, eligible: true },
    { level: 4, title: 'Intermediate Installer / Sander', desc: 'Advanced Equipment & Water Bubbling', mult: 1.10, eligible: true },
    { level: 5, title: 'Technician I', desc: 'Eligible for NWFA Intermediate Training Classes, Eligible for increasing base helpers', mult: 1.15, eligible: true },
    { level: 6, title: 'Technician II', desc: 'Eligible for NWFA Advanced Training Classes', mult: 1.20, eligible: true },
    { level: 7, title: 'Advanced Technician', desc: 'All Install Patterns/ATP', mult: 1.25, eligible: true },
    { level: 8, title: 'Lead Technician', desc: 'Lead small teams on standard jobs', mult: 1.30, eligible: true },
    { level: 9, title: 'Lead Installer / S&F Specialist', desc: 'Act as job lead on technical projects', mult: 1.35, eligible: true },
    { level: 10, title: 'Technician III', desc: 'Qualified to train apprentices and assistants', mult: 1.35, eligible: true },
    { level: 11, title: 'Senior Technician', desc: '', mult: 1.40, eligible: true },
    { level: 12, title: 'Craftsperson', desc: '', mult: 1.45, eligible: true },
    { level: 13, title: 'Master Technician', desc: '', mult: 1.50, eligible: true },
    { level: 14, title: 'Master Tech & Mentor', desc: 'Develops future talent + leads a top program', mult: 1.50, eligible: true },
    { level: 15, title: 'Master Craftsman', desc: 'Top-tier brand and craftsmanship representative', mult: 1.53, eligible: true },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#fff', fontSize: '18px', margin: 0 }}>Skill Levels</h2>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          backgroundColor: '#14B8A6',
          border: 'none',
          borderRadius: '8px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
        }}>
          <Plus size={16} />
          Create New Skill Ladder
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {levels.map(l => (
          <div key={l.level} style={{
            backgroundColor: '#2a2a2a',
            borderRadius: '10px',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                padding: '4px 10px',
                backgroundColor: '#444',
                borderRadius: '4px',
                color: '#888',
                fontSize: '12px',
                fontWeight: '600',
              }}>
                Level {l.level}
              </span>
              {l.eligible && (
                <span style={{
                  padding: '4px 10px',
                  backgroundColor: '#14B8A6',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: '600',
                }}>
                  Eligible
                </span>
              )}
              <div>
                <h3 style={{ color: '#fff', fontSize: '15px', margin: 0 }}>{l.title}</h3>
                {l.desc && <p style={{ color: '#F97316', fontSize: '12px', margin: 0 }}>{l.desc}</p>}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                padding: '6px 14px',
                backgroundColor: l.eligible ? '#14B8A6' : '#444',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '700',
              }}>
                {l.mult.toFixed(2)}x multiplier
              </span>
              <button style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: '1px solid #444',
                borderRadius: '6px',
                color: '#888',
                cursor: 'pointer',
              }}>
                <Edit2 size={14} />
              </button>
              <button style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: '1px solid #444',
                borderRadius: '6px',
                color: '#888',
                cursor: 'pointer',
              }}>
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* How Multiplier Works */}
      <div style={{
        backgroundColor: '#2a2a2a',
        borderRadius: '12px',
        padding: '24px',
        marginTop: '32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Info size={18} color="#14B8A6" />
          <h3 style={{ color: '#fff', fontSize: '16px', margin: 0 }}>How the Multiplier Works</h3>
        </div>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '16px' }}>
          These multipliers are applied to your weighted hours in the bonus pool calculation.
        </p>
        <div style={{ backgroundColor: '#333', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
          <p style={{ color: '#fff', fontSize: '14px', fontWeight: '600', margin: 0 }}>
            Your Share = (Your Weighted Hours ÷ Total Weighted Hours) × Bonus Pool
          </p>
        </div>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '12px' }}>Combined with other multipliers:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={14} color="#14B8A6" />
            <span style={{ color: '#888', fontSize: '13px' }}><strong style={{ color: '#fff' }}>Skill Ladder Level:</strong> Adds 0.% (ex: Level 7 to 9)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={14} color="#14B8A6" />
            <span style={{ color: '#888', fontSize: '13px' }}><strong style={{ color: '#fff' }}>Employee Value Scorecard (EVS):</strong> 0.0% to 1.0% (0-100 points, true/untrue)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={14} color="#14B8A6" />
            <span style={{ color: '#888', fontSize: '13px' }}><strong style={{ color: '#fff' }}>Job Value Scorecard (JVS):</strong> 0.0% to 1.0% (0-5 points per job)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={14} color="#14B8A6" />
            <span style={{ color: '#888', fontSize: '13px' }}><strong style={{ color: '#fff' }}>Foreman Leadership Bonus:</strong> Add 5pts or *1.25*</span>
          </div>
        </div>
        <div style={{ backgroundColor: '#333', borderRadius: '8px', padding: '16px', marginTop: '20px' }}>
          <p style={{ color: '#FBBF24', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Example:</p>
          <p style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>
            An employee at Level 10 (1.35x), with EVS 85 (1.30x), JVS 5/5 (1.00x), and Foreman status (1.25x):
          </p>
          <p style={{ color: '#14B8A6', fontSize: '14px', fontWeight: '600', margin: 0 }}>
            Weighted Hours = 1 Hour × 1.35 × 1.30 × 1.25 = <span style={{ color: '#FBBF24' }}>2.19 hrs</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function EVSTab() {
  const employees = [
    { name: 'Mahesh Dev', level: 15, score: 100 },
    { name: 'Alex Olmos', level: 14, score: 96 },
    { name: 'Anthony Abosida', level: 13, score: 95 },
    { name: 'Amit K', level: 14, score: 92 },
    { name: 'Hamza Khan', level: 12, score: 88 },
    { name: 'Ronald Lajkan', level: 11, score: 85 },
    { name: 'Chase Reedy', level: 10, score: 82 },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '18px', margin: 0 }}>Employee Value Scorecard</h2>
          <p style={{ color: '#888', fontSize: '13px', margin: '4px 0 0 0' }}>Measuring employee value contribution and performance</p>
        </div>
        <button style={{
          padding: '10px 16px',
          backgroundColor: '#14B8A6',
          border: 'none',
          borderRadius: '8px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
        }}>
          Update Scores
        </button>
      </div>

      <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', overflow: 'hidden' }}>
        {employees.map((e, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: i < employees.length - 1 ? '1px solid #333' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: i < 3 ? '#FBBF24' : '#444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: i < 3 ? '#000' : '#888',
                fontWeight: '700',
                fontSize: '12px',
              }}>
                {i + 1}
              </span>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#14B8A6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: '600',
                fontSize: '13px',
              }}>
                {e.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p style={{ color: '#fff', fontWeight: '500', margin: 0 }}>{e.name}</p>
                <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>Level {e.level}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '200px', height: '8px', backgroundColor: '#444', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${e.score}%`, backgroundColor: '#10B981', borderRadius: '4px' }} />
              </div>
              <span style={{ color: '#14B8A6', fontWeight: '700', fontSize: '18px', minWidth: '80px', textAlign: 'right' }}>
                {e.score}/100
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function JVSTab() {
  const employees = [
    { name: 'Anthony Abosida', level: 13, score: 5 },
    { name: 'Chase Reedy', level: 10, score: 5 },
    { name: 'Hamza Khan', level: 12, score: 5 },
    { name: 'Mahesh Dev', level: 15, score: 5 },
    { name: 'Alex Olmos', level: 14, score: 4 },
    { name: 'Ronald Lajkan', level: 11, score: 4 },
    { name: 'Amit K', level: 14, score: 4 },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '18px', margin: 0 }}>Job Value Scorecard</h2>
          <p style={{ color: '#888', fontSize: '13px', margin: '4px 0 0 0' }}>Quality and performance scores per job</p>
        </div>
        <button style={{
          padding: '10px 16px',
          backgroundColor: '#14B8A6',
          border: 'none',
          borderRadius: '8px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
        }}>
          Update Scores
        </button>
      </div>

      <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', overflow: 'hidden' }}>
        {employees.map((e, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: i < employees.length - 1 ? '1px solid #333' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: i < 3 ? '#FBBF24' : '#444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: i < 3 ? '#000' : '#888',
                fontWeight: '700',
                fontSize: '12px',
              }}>
                {i + 1}
              </span>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#3B82F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: '600',
                fontSize: '13px',
              }}>
                {e.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p style={{ color: '#fff', fontWeight: '500', margin: 0 }}>{e.name}</p>
                <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>Level {e.level}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={18} color={s <= e.score ? '#FBBF24' : '#444'} fill={s <= e.score ? '#FBBF24' : 'transparent'} />
                ))}
              </div>
              <span style={{ color: '#14B8A6', fontWeight: '700', fontSize: '18px', minWidth: '50px', textAlign: 'right' }}>
                {e.score}/5
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrainingTab() {
  const trainings = [
    { title: 'NWFA Basic Training', status: 'available', duration: '8 hours', category: 'Foundation' },
    { title: 'NWFA Intermediate Training', status: 'available', duration: '16 hours', category: 'Advanced' },
    { title: 'NWFA Advanced Training', status: 'locked', duration: '24 hours', category: 'Expert', req: 6 },
    { title: 'Safety Certification', status: 'completed', duration: '4 hours', category: 'Safety' },
    { title: 'Equipment Operation', status: 'in-progress', duration: '12 hours', category: 'Technical', progress: 65 },
  ];

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#fff', fontSize: '18px', margin: 0 }}>Training & Certifications</h2>
        <p style={{ color: '#888', fontSize: '13px', margin: '4px 0 0 0' }}>Available courses and certification programs</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {trainings.map((t, i) => (
          <div key={i} style={{
            backgroundColor: '#2a2a2a',
            borderRadius: '12px',
            padding: '20px',
            opacity: t.status === 'locked' ? 0.6 : 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: t.status === 'completed' ? 'rgba(16,185,129,0.2)' : t.status === 'in-progress' ? 'rgba(59,130,246,0.2)' : t.status === 'locked' ? '#444' : 'rgba(20,184,166,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {t.status === 'completed' ? <CheckCircle size={24} color="#10B981" /> : <BookOpen size={24} color={t.status === 'locked' ? '#888' : '#14B8A6'} />}
              </div>
              <div>
                <h3 style={{ color: '#fff', fontSize: '15px', margin: 0 }}>{t.title}</h3>
                <p style={{ color: '#888', fontSize: '12px', margin: '4px 0 0 0' }}>
                  {t.category} • {t.duration}{t.req && ` • Requires Level ${t.req}`}
                </p>
                {t.progress && (
                  <div style={{ marginTop: '8px', width: '200px' }}>
                    <div style={{ height: '6px', backgroundColor: '#444', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${t.progress}%`, backgroundColor: '#3B82F6', borderRadius: '3px' }} />
                    </div>
                    <p style={{ color: '#888', fontSize: '11px', margin: '4px 0 0 0' }}>{t.progress}% complete</p>
                  </div>
                )}
              </div>
            </div>
            <button style={{
              padding: '10px 20px',
              backgroundColor: t.status === 'completed' ? '#10B981' : t.status === 'in-progress' ? '#3B82F6' : t.status === 'locked' ? '#444' : '#14B8A6',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: '600',
              cursor: t.status === 'locked' || t.status === 'completed' ? 'not-allowed' : 'pointer',
            }}>
              {t.status === 'completed' ? 'Completed' : t.status === 'in-progress' ? 'Continue' : t.status === 'locked' ? 'Locked' : 'Start'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
