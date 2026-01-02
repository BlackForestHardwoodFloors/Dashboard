import React, { useState, useMemo } from 'react';
import {
  Users, GraduationCap, Target, Briefcase, BookOpen, Star,
  ChevronDown, Edit2, Plus, Info, CheckCircle, ChevronLeft,
  ChevronRight, Calendar, X, TrendingUp, BarChart3, User, Hammer,
  DollarSign, PieChart, Award, Clock, Percent
} from 'lucide-react';
import { SidebarEnhanced } from './SidebarEnhanced';

type TabType = 'overview' | 'bonus-payout' | 'skill-ladder' | 'evs-scorecard' | 'jvs-scorecard' | 'training';

interface P4PGrowthPageProps {
  onNavigate?: (page: string) => void;
}

interface MonthYear { month: number; year: number; }

interface Employee { 
  id: number; 
  name: string; 
  email: string; 
  level: number; 
  evsScore: number; 
  jvsScore: number; 
  department: string;
  hoursWorked: number;
  isForeman: boolean;
}

interface Job { 
  id: number; 
  name: string; 
  client: string; 
  status: 'Completed' | 'In Progress' | 'Pending';
  totalHours: number;
  bonusPool: number; // Can be positive or negative
  assignedEmployees: number[];
  completedDate?: string;
  isPaid: boolean;
  paidDate?: string;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Skill level multipliers (Technician Level)
// Based on P4P document: Level 3=1.0, Level 5=1.2, Level 7=1.4
const SKILL_MULTIPLIERS: Record<number, number> = {
  1: 0.90, 2: 0.95, 3: 1.00, 4: 1.10, 5: 1.20, 6: 1.30, 7: 1.40,
  8: 1.45, 9: 1.50, 10: 1.55, 11: 1.60, 12: 1.65, 13: 1.70, 14: 1.75, 15: 1.80
};

// EVS (Quarterly Employee Value Scorecard) multiplier calculation
// Based on P4P document: 90+=1.3, 85+=1.2, 70+=1.0
const getEVSMultiplier = (score: number): number => {
  if (score >= 95) return 1.40;
  if (score >= 90) return 1.30;
  if (score >= 85) return 1.20;
  if (score >= 80) return 1.10;
  if (score >= 75) return 1.05;
  if (score >= 70) return 1.00;
  return 0.90;
};

// JVS (Job Performance Review / Foreman Checklist) multiplier
// Based on P4P document: 4/4=1.25, 3/4=1.15, 2/4=1.0
const getJVSMultiplier = (score: number): number => {
  if (score >= 5) return 1.30;  // 5/5 or higher
  if (score >= 4) return 1.25;  // 4/4 or 4/5
  if (score >= 3) return 1.15;  // 3/4
  if (score >= 2) return 1.00;  // 2/4
  return 0.85;                  // Below 2
};

// Foreman multiplier constant (from document)
const FOREMAN_MULTIPLIER = 1.25;

const EMPLOYEES: Employee[] = [
  { id: 1, name: 'Mahesh Dev', email: 'mahesh.dev@example.com', level: 15, evsScore: 100, jvsScore: 5, department: 'Installation', hoursWorked: 168, isForeman: true },
  { id: 2, name: 'Alex Olmos', email: 'alex.olmos@example.com', level: 14, evsScore: 96, jvsScore: 4, department: 'Installation', hoursWorked: 160, isForeman: false },
  { id: 3, name: 'Anthony Abosida', email: 'anthony.abosida@example.com', level: 13, evsScore: 95, jvsScore: 5, department: 'Finishing', hoursWorked: 152, isForeman: true },
  { id: 4, name: 'Amit K', email: 'amit.k@example.com', level: 14, evsScore: 92, jvsScore: 4, department: 'Installation', hoursWorked: 164, isForeman: false },
  { id: 5, name: 'Hamza Khan', email: 'hamza.khan@example.com', level: 12, evsScore: 88, jvsScore: 5, department: 'Sanding', hoursWorked: 156, isForeman: false },
  { id: 6, name: 'Ronald Lajkan', email: 'ronald.lajkan@example.com', level: 11, evsScore: 85, jvsScore: 4, department: 'Finishing', hoursWorked: 148, isForeman: false },
  { id: 7, name: 'Chase Reedy', email: 'chase.reedy@example.com', level: 10, evsScore: 82, jvsScore: 5, department: 'Sanding', hoursWorked: 160, isForeman: false },
  { id: 8, name: 'John Anderson', email: 'john.anderson@example.com', level: 12, evsScore: 92, jvsScore: 4, department: 'Installation', hoursWorked: 144, isForeman: false },
  { id: 9, name: 'Sarah Mitchell', email: 'sarah.mitchell@example.com', level: 11, evsScore: 87, jvsScore: 4, department: 'Finishing', hoursWorked: 152, isForeman: false },
  { id: 10, name: 'Michael Chen', email: 'michael.chen@example.com', level: 10, evsScore: 84, jvsScore: 4, department: 'Sanding', hoursWorked: 140, isForeman: false },
];

const INITIAL_JOBS: Job[] = [
  { id: 1, name: 'Riverside Mansion - Hardwood Install', client: 'Johnson Family', status: 'Completed', totalHours: 320, bonusPool: 4800, assignedEmployees: [1, 2, 4, 8], completedDate: '2025-12-15', isPaid: true, paidDate: '2025-12-31' },
  { id: 2, name: 'Downtown Office - Floor Refinishing', client: 'TechCorp Inc', status: 'Completed', totalHours: 180, bonusPool: 2700, assignedEmployees: [3, 6, 9], completedDate: '2025-12-18', isPaid: false },
  { id: 3, name: 'Lakeside Villa - Custom Inlay', client: 'Smith Residence', status: 'Completed', totalHours: 240, bonusPool: -1200, assignedEmployees: [1, 5, 7], completedDate: '2025-12-20', isPaid: false }, // Negative - over budget
  { id: 4, name: 'City Center Hotel - Lobby', client: 'Grand Hotels', status: 'Completed', totalHours: 280, bonusPool: 4200, assignedEmployees: [2, 3, 4, 5], completedDate: '2025-12-22', isPaid: false },
  { id: 5, name: 'Suburban Home - Engineered Wood', client: 'Williams Family', status: 'Completed', totalHours: 120, bonusPool: -500, assignedEmployees: [6, 7, 10], completedDate: '2025-12-25', isPaid: false }, // Negative - over budget
  { id: 6, name: 'Historic Building - Parquet Repair', client: 'Heritage Trust', status: 'In Progress', totalHours: 200, bonusPool: 3600, assignedEmployees: [8, 9, 10], isPaid: false },
  { id: 7, name: 'Mountain View Estate', client: 'Roberts Family', status: 'Completed', totalHours: 150, bonusPool: 2100, assignedEmployees: [1, 3, 5], completedDate: '2025-12-28', isPaid: false },
  { id: 8, name: 'Corporate HQ Renovation', client: 'Apex Industries', status: 'Pending', totalHours: 0, bonusPool: 0, assignedEmployees: [2, 4, 6], isPaid: false },
];

const HISTORICAL_DATA = [
  { month: 'Jul', avgEVS: 82, avgJVS: 4.1, avgSkill: 10.2, totalBonus: 18500 },
  { month: 'Aug', avgEVS: 84, avgJVS: 4.2, avgSkill: 10.5, totalBonus: 19200 },
  { month: 'Sep', avgEVS: 86, avgJVS: 4.3, avgSkill: 10.8, totalBonus: 20100 },
  { month: 'Oct', avgEVS: 88, avgJVS: 4.4, avgSkill: 11.2, totalBonus: 21500 },
  { month: 'Nov', avgEVS: 90, avgJVS: 4.5, avgSkill: 11.5, totalBonus: 22300 },
  { month: 'Dec', avgEVS: 91, avgJVS: 4.6, avgSkill: 11.8, totalBonus: 22300 },
];

function getMonthName(month: number): string { return MONTHS[month]; }
function formatMonthYear(monthYear: MonthYear): string { return `${getMonthName(monthYear.month)} ${monthYear.year}`; }
function formatCurrency(amount: number): string { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount); }

// Calculate employee bonus
function calculateEmployeeBonus(employee: Employee, bonusPool: number, allEmployees: Employee[]): { 
  weightedHours: number; 
  skillMult: number; 
  evsMult: number; 
  jvsMult: number; 
  foremanMult: number;
  totalMult: number; 
  sharePercent: number; 
  bonusAmount: number;
} {
  const skillMult = SKILL_MULTIPLIERS[employee.level] || 1.00;
  const evsMult = getEVSMultiplier(employee.evsScore);
  const jvsMult = getJVSMultiplier(employee.jvsScore);
  const foremanMult = employee.isForeman ? FOREMAN_MULTIPLIER : 1.00;
  const totalMult = skillMult * evsMult * jvsMult * foremanMult;
  const weightedHours = employee.hoursWorked * totalMult;
  
  const totalWeightedHours = allEmployees.reduce((sum, e) => {
    const sm = SKILL_MULTIPLIERS[e.level] || 1.00;
    const em = getEVSMultiplier(e.evsScore);
    const jm = getJVSMultiplier(e.jvsScore);
    const fm = e.isForeman ? FOREMAN_MULTIPLIER : 1.00;
    return sum + (e.hoursWorked * sm * em * jm * fm);
  }, 0);
  
  const sharePercent = (weightedHours / totalWeightedHours) * 100;
  const bonusAmount = (weightedHours / totalWeightedHours) * bonusPool;
  
  return { weightedHours, skillMult, evsMult, jvsMult, foremanMult, totalMult, sharePercent, bonusAmount };
}

// Bar Chart Component
function BarChart({ data, dataKey, color, maxValue, label }: { data: typeof HISTORICAL_DATA; dataKey: 'avgEVS' | 'avgJVS' | 'avgSkill' | 'totalBonus'; color: string; maxValue: number; label: string; }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <p style={{ color: '#888', fontSize: '13px', marginBottom: '12px' }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
        {data.map((item, index) => {
          const value = item[dataKey];
          const height = (value / maxValue) * 100;
          return (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#fff', fontSize: '10px', fontWeight: '600' }}>
                {dataKey === 'totalBonus' ? `$${(value/1000).toFixed(1)}k` : dataKey === 'avgJVS' ? value.toFixed(1) : Math.round(value)}
              </span>
              <div style={{ width: '100%', height: `${height}%`, backgroundColor: color, borderRadius: '4px 4px 0 0', minHeight: '4px' }} />
              <span style={{ color: '#888', fontSize: '11px' }}>{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Line Chart Component
function LineChart({ data, lines }: { data: typeof HISTORICAL_DATA; lines: { key: 'avgEVS' | 'avgJVS' | 'avgSkill' | 'totalBonus'; color: string; label: string; maxValue: number }[]; }) {
  const width = 100, height = 100, padding = 10;
  return (
    <div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
        {lines.map(line => (
          <div key={line.key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '3px', backgroundColor: line.color, borderRadius: '2px' }} />
            <span style={{ color: '#888', fontSize: '12px' }}>{line.label}</span>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '150px' }}>
        {[0, 25, 50, 75, 100].map(y => (
          <line key={y} x1={padding} y1={height - padding - (y / 100) * (height - 2 * padding)} x2={width - padding} y2={height - padding - (y / 100) * (height - 2 * padding)} stroke="#333" strokeWidth="0.5" />
        ))}
        {lines.map(line => {
          const points = data.map((item, index) => {
            const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
            const normalizedValue = (item[line.key] / line.maxValue) * 100;
            const y = height - padding - (normalizedValue / 100) * (height - 2 * padding);
            return `${x},${y}`;
          }).join(' ');
          return (
            <g key={line.key}>
              <polyline points={points} fill="none" stroke={line.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {data.map((item, index) => {
                const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
                const normalizedValue = (item[line.key] / line.maxValue) * 100;
                const y = height - padding - (normalizedValue / 100) * (height - 2 * padding);
                return <circle key={index} cx={x} cy={y} r="3" fill={line.color} />;
              })}
            </g>
          );
        })}
        {data.map((item, index) => {
          const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
          return <text key={index} x={x} y={height - 2} textAnchor="middle" fill="#888" fontSize="4">{item.month}</text>;
        })}
      </svg>
    </div>
  );
}

// Bonus Pie Chart (simple donut)
function BonusPieChart({ employees, bonusPool }: { employees: Employee[]; bonusPool: number }) {
  const bonusData = employees.map(e => {
    const bonus = calculateEmployeeBonus(e, bonusPool, employees);
    return { name: e.name, amount: bonus.bonusAmount, percent: bonus.sharePercent };
  }).sort((a, b) => b.amount - a.amount);

  const colors = ['#14B8A6', '#3B82F6', '#F97316', '#FBBF24', '#10B981', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F43F5E'];
  
  // Calculate pie segments
  let currentAngle = 0;
  const segments = bonusData.map((item, index) => {
    const angle = (item.percent / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    return { ...item, startAngle, angle, color: colors[index % colors.length] };
  });

  const createArc = (startAngle: number, angle: number, radius: number, innerRadius: number) => {
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (startAngle + angle - 90) * Math.PI / 180;
    const largeArc = angle > 180 ? 1 : 0;
    
    const x1 = 50 + radius * Math.cos(startRad);
    const y1 = 50 + radius * Math.sin(startRad);
    const x2 = 50 + radius * Math.cos(endRad);
    const y2 = 50 + radius * Math.sin(endRad);
    const x3 = 50 + innerRadius * Math.cos(endRad);
    const y3 = 50 + innerRadius * Math.sin(endRad);
    const x4 = 50 + innerRadius * Math.cos(startRad);
    const y4 = 50 + innerRadius * Math.sin(startRad);
    
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  return (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <svg viewBox="0 0 100 100" style={{ width: '160px', height: '160px' }}>
        {segments.map((seg, i) => (
          <path key={i} d={createArc(seg.startAngle, seg.angle, 45, 28)} fill={seg.color} />
        ))}
        <text x="50" y="46" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">{formatCurrency(bonusPool)}</text>
        <text x="50" y="56" textAnchor="middle" fill="#888" fontSize="4">Total Pool</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {segments.slice(0, 5).map((seg, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: seg.color }} />
            <span style={{ color: '#ccc', fontSize: '12px', flex: 1 }}>{seg.name}</span>
            <span style={{ color: '#fff', fontSize: '12px', fontWeight: '600' }}>{formatCurrency(seg.amount)}</span>
            <span style={{ color: '#888', fontSize: '11px' }}>({seg.percent.toFixed(1)}%)</span>
          </div>
        ))}
        {segments.length > 5 && (
          <span style={{ color: '#888', fontSize: '11px' }}>+{segments.length - 5} more employees</span>
        )}
      </div>
    </div>
  );
}

// Score Distribution
function ScoreDistribution({ employees, type }: { employees: Employee[]; type: 'evs' | 'jvs' }) {
  const ranges = type === 'evs' 
    ? [{ label: '90-100', min: 90, max: 100, color: '#10B981' }, { label: '80-89', min: 80, max: 89, color: '#14B8A6' }, { label: '70-79', min: 70, max: 79, color: '#FBBF24' }, { label: '60-69', min: 60, max: 69, color: '#F97316' }, { label: '<60', min: 0, max: 59, color: '#EF4444' }]
    : [{ label: '5', min: 5, max: 5, color: '#10B981' }, { label: '4', min: 4, max: 4, color: '#14B8A6' }, { label: '3', min: 3, max: 3, color: '#FBBF24' }, { label: '2', min: 2, max: 2, color: '#F97316' }, { label: '1', min: 1, max: 1, color: '#EF4444' }];
  const distribution = ranges.map(range => ({ ...range, count: employees.filter(e => { const score = type === 'evs' ? e.evsScore : e.jvsScore; return score >= range.min && score <= range.max; }).length }));
  const maxCount = Math.max(...distribution.map(d => d.count), 1);
  return (
    <div>
      <p style={{ color: '#888', fontSize: '13px', marginBottom: '12px' }}>{type === 'evs' ? 'EVS Score Distribution' : 'JVS Score Distribution'}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {distribution.map((range, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#888', fontSize: '12px', width: '50px', textAlign: 'right' }}>{range.label}</span>
            <div style={{ flex: 1, height: '24px', backgroundColor: '#333', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(range.count / maxCount) * 100}%`, backgroundColor: range.color, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px', minWidth: range.count > 0 ? '30px' : '0' }}>
                {range.count > 0 && <span style={{ color: '#fff', fontSize: '11px', fontWeight: '600' }}>{range.count}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Filter Dropdown
function FilterDropdown({ icon: Icon, options, value, onChange, placeholder }: { icon: any; options: { value: string | number; label: string }[]; value: string | number | null; onChange: (value: string | number | null) => void; placeholder: string; }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setIsOpen(!isOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: value ? '#14B8A620' : '#2a2a2a', border: value ? '1px solid #14B8A6' : '1px solid #444', borderRadius: '8px', color: value ? '#14B8A6' : '#888', fontSize: '14px', cursor: 'pointer', minWidth: '180px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Icon size={16} /><span>{selectedOption ? selectedOption.label : placeholder}</span></div>
        <ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>
      {isOpen && (
        <>
          <div onClick={() => setIsOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }} />
          <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '8px', padding: '8px', zIndex: 100, minWidth: '220px', maxHeight: '300px', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            {value && (
              <button onClick={() => { onChange(null); setIsOpen(false); }} style={{ width: '100%', padding: '10px 12px', backgroundColor: 'transparent', border: 'none', borderRadius: '6px', color: '#EF4444', fontSize: '13px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', borderBottom: '1px solid #333', paddingBottom: '12px' }}>
                <X size={14} />Clear Filter
              </button>
            )}
            {options.map((option, index) => (
              <button key={index} onClick={() => { onChange(option.value); setIsOpen(false); }} style={{ width: '100%', padding: '10px 12px', backgroundColor: value === option.value ? '#14B8A620' : 'transparent', border: 'none', borderRadius: '6px', color: value === option.value ? '#14B8A6' : '#ccc', fontSize: '13px', textAlign: 'left', cursor: 'pointer' }}>
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Main Component
export default function P4PGrowthPage({ onNavigate }: P4PGrowthPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState<MonthYear>({ month: now.getMonth(), year: now.getFullYear() });
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [showGraphs, setShowGraphs] = useState(true);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);

  // Mark job as paid
  const markJobPaid = (jobId: number) => {
    setJobs(prev => prev.map(j => 
      j.id === jobId 
        ? { ...j, isPaid: true, paidDate: new Date().toISOString().split('T')[0] }
        : j
    ));
  };

  // Mark job as unpaid
  const markJobUnpaid = (jobId: number) => {
    setJobs(prev => prev.map(j => 
      j.id === jobId 
        ? { ...j, isPaid: false, paidDate: undefined }
        : j
    ));
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: <Users size={16} /> },
    { id: 'bonus-payout' as TabType, label: 'Bonus Payout', icon: <DollarSign size={16} /> },
    { id: 'skill-ladder' as TabType, label: 'Skill Ladder', icon: <GraduationCap size={16} /> },
    { id: 'evs-scorecard' as TabType, label: 'EVS Scorecard', icon: <Target size={16} /> },
    { id: 'jvs-scorecard' as TabType, label: 'JVS Scorecard', icon: <Briefcase size={16} /> },
    { id: 'training' as TabType, label: 'Training', icon: <BookOpen size={16} /> },
  ];

  // Filter employees based on selection AND job assignment
  const filteredEmployees = useMemo(() => {
    let result = EMPLOYEES;
    if (selectedEmployee) {
      result = result.filter(e => e.id === selectedEmployee);
    }
    if (selectedJob) {
      const job = jobs.find(j => j.id === selectedJob);
      if (job) {
        result = result.filter(e => job.assignedEmployees.includes(e.id));
      }
    }
    return result;
  }, [selectedEmployee, selectedJob, jobs]);

  // Calculate total bonus pool based on job selection
  const currentBonusPool = useMemo(() => {
    if (selectedJob) {
      const job = jobs.find(j => j.id === selectedJob);
      return job?.bonusPool || 0;
    }
    return jobs.filter(j => j.status === 'Completed').reduce((sum, j) => sum + j.bonusPool, 0);
  }, [selectedJob, jobs]);

  // Calculate eligible (completed, unpaid) bonus total
  const eligibleBonusTotal = useMemo(() => {
    return jobs.filter(j => j.status === 'Completed' && !j.isPaid).reduce((sum, j) => sum + j.bonusPool, 0);
  }, [jobs]);

  // Calculate paid bonus total
  const paidBonusTotal = useMemo(() => {
    return jobs.filter(j => j.isPaid).reduce((sum, j) => sum + j.bonusPool, 0);
  }, [jobs]);

  const handlePrevMonth = () => setSelectedMonth(prev => prev.month === 0 ? { month: 11, year: prev.year - 1 } : { month: prev.month - 1, year: prev.year });
  const handleNextMonth = () => setSelectedMonth(prev => prev.month === 11 ? { month: 0, year: prev.year + 1 } : { month: prev.month + 1, year: prev.year });
  const handleMonthSelect = (month: number, year: number) => { setSelectedMonth({ month, year }); setShowMonthPicker(false); };

  const currentYear = new Date().getFullYear();
  const availableYears = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
  const employeeOptions = EMPLOYEES.map(e => ({ value: e.id, label: e.name }));
  const jobOptions = jobs.map(j => ({ 
    value: j.id, 
    label: `${j.name} (${j.bonusPool >= 0 ? '+' : ''}${formatCurrency(j.bonusPool)})` 
  }));
  const activeFilterCount = [selectedEmployee, selectedJob].filter(Boolean).length;

  return (
    <>
      {/* Sidebar */}
      <SidebarEnhanced 
        activePage="P4P Growth" 
        onNavigate={onNavigate}
        darkMode={true}
      />
      
      <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', padding: '24px', paddingTop: '70px', marginLeft: '200px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '600', color: '#FFFFFF', margin: '0 0 8px 0' }}>Professional Growth & Development</h1>
          <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>Track performance, calculate bonuses, and manage team growth</p>
        </div>

      {/* Filters Row */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {/* Month Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={handlePrevMonth} style={{ width: '36px', height: '36px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '8px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={18} /></button>
          <button onClick={() => setShowMonthPicker(!showMonthPicker)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', backgroundColor: '#14B8A6', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', minWidth: '180px', justifyContent: 'center' }}>
            <Calendar size={16} />{formatMonthYear(selectedMonth)}<ChevronDown size={14} style={{ transform: showMonthPicker ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>
          <button onClick={handleNextMonth} style={{ width: '36px', height: '36px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '8px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={18} /></button>
        </div>
        <div style={{ width: '1px', height: '32px', backgroundColor: '#444' }} />
        <FilterDropdown icon={User} options={employeeOptions} value={selectedEmployee} onChange={(v) => setSelectedEmployee(v as number | null)} placeholder="All Employees" />
        <FilterDropdown icon={Hammer} options={jobOptions} value={selectedJob} onChange={(v) => setSelectedJob(v as number | null)} placeholder="All Jobs" />
        <button onClick={() => setShowGraphs(!showGraphs)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: showGraphs ? '#14B8A620' : '#2a2a2a', border: showGraphs ? '1px solid #14B8A6' : '1px solid #444', borderRadius: '8px', color: showGraphs ? '#14B8A6' : '#888', fontSize: '14px', cursor: 'pointer' }}>
          <BarChart3 size={16} />{showGraphs ? 'Hide Graphs' : 'Show Graphs'}
        </button>
        {activeFilterCount > 0 && (
          <button onClick={() => { setSelectedEmployee(null); setSelectedJob(null); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', backgroundColor: '#EF444420', border: '1px solid #EF4444', borderRadius: '8px', color: '#EF4444', fontSize: '14px', cursor: 'pointer' }}>
            <X size={14} />Clear Filters ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Month Picker Modal */}
      {showMonthPicker && (
        <>
          <div onClick={() => setShowMonthPicker(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '12px', padding: '20px', zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', minWidth: '320px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', justifyContent: 'center' }}>
              {availableYears.map(year => (
                <button key={year} onClick={() => setSelectedMonth(prev => ({ ...prev, year }))} style={{ padding: '8px 16px', backgroundColor: selectedMonth.year === year ? '#14B8A6' : '#3a3a3a', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '14px', fontWeight: selectedMonth.year === year ? '600' : '400', cursor: 'pointer' }}>{year}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {MONTHS.map((month, index) => (
                <button key={month} onClick={() => handleMonthSelect(index, selectedMonth.year)} style={{ padding: '10px 8px', backgroundColor: selectedMonth.month === index ? '#14B8A6' : 'transparent', border: index === now.getMonth() && selectedMonth.year === now.getFullYear() && selectedMonth.month !== index ? '1px solid #14B8A6' : '1px solid transparent', borderRadius: '8px', color: selectedMonth.month === index ? '#fff' : '#ccc', fontSize: '13px', fontWeight: selectedMonth.month === index ? '600' : '400', cursor: 'pointer' }}>{month.slice(0, 3)}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #444' }}>
              <button onClick={() => handleMonthSelect(now.getMonth(), now.getFullYear())} style={{ flex: 1, padding: '10px', backgroundColor: '#3a3a3a', border: 'none', borderRadius: '6px', color: '#14B8A6', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Current Month</button>
              <button onClick={() => setShowMonthPicker(false)} style={{ flex: 1, padding: '10px', backgroundColor: '#444', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: activeTab === tab.id ? '#14B8A6' : 'transparent', border: activeTab === tab.id ? 'none' : '1px solid #444', borderRadius: '8px', color: activeTab === tab.id ? '#fff' : '#888', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && <OverviewTab selectedMonth={selectedMonth} employees={filteredEmployees} selectedJob={selectedJob} showGraphs={showGraphs} bonusPool={currentBonusPool} jobs={jobs} eligibleBonusTotal={eligibleBonusTotal} paidBonusTotal={paidBonusTotal} />}
      {activeTab === 'bonus-payout' && <BonusPayoutTab selectedMonth={selectedMonth} employees={filteredEmployees} selectedJob={selectedJob} selectedEmployee={selectedEmployee} bonusPool={currentBonusPool} jobs={jobs} markJobPaid={markJobPaid} markJobUnpaid={markJobUnpaid} />}
      {activeTab === 'skill-ladder' && <SkillLadderTab />}
      {activeTab === 'evs-scorecard' && <EVSTab selectedMonth={selectedMonth} employees={filteredEmployees} showGraphs={showGraphs} />}
      {activeTab === 'jvs-scorecard' && <JVSTab selectedMonth={selectedMonth} employees={filteredEmployees} selectedJob={selectedJob} showGraphs={showGraphs} jobs={jobs} />}
      {activeTab === 'training' && <TrainingTab />}
    </div>
    </>
  );
}


// Calculate employee's bonus for a specific job
function calculateEmployeeBonusForJob(employee: Employee, job: Job, allEmployeesOnJob: Employee[]): number {
  if (!job.assignedEmployees.includes(employee.id)) return 0;
  
  const skillMult = SKILL_MULTIPLIERS[employee.level] || 1.00;
  const evsMult = getEVSMultiplier(employee.evsScore);
  const jvsMult = getJVSMultiplier(employee.jvsScore);
  const foremanMult = employee.isForeman ? FOREMAN_MULTIPLIER : 1.00;
  const totalMult = skillMult * evsMult * jvsMult * foremanMult;
  const weightedHours = employee.hoursWorked * totalMult;
  
  const totalWeightedHours = allEmployeesOnJob.reduce((sum, e) => {
    const sm = SKILL_MULTIPLIERS[e.level] || 1.00;
    const em = getEVSMultiplier(e.evsScore);
    const jm = getJVSMultiplier(e.jvsScore);
    const fm = e.isForeman ? FOREMAN_MULTIPLIER : 1.00;
    return sum + (e.hoursWorked * sm * em * jm * fm);
  }, 0);
  
  return (weightedHours / totalWeightedHours) * job.bonusPool;
}

// BONUS PAYOUT TAB - Enhanced with employee bonus pool tracking
function BonusPayoutTab({ selectedMonth, employees, selectedJob, selectedEmployee, bonusPool, jobs, markJobPaid, markJobUnpaid }: { 
  selectedMonth: MonthYear; 
  employees: Employee[]; 
  selectedJob: number | null; 
  selectedEmployee: number | null; 
  bonusPool: number;
  jobs: Job[];
  markJobPaid: (jobId: number) => void;
  markJobUnpaid: (jobId: number) => void;
}) {
  const monthName = getMonthName(selectedMonth.month);
  const [showJobsPanel, setShowJobsPanel] = useState(true);
  const [expandedEmployee, setExpandedEmployee] = useState<number | null>(null);
  
  // Calculate each employee's bonus pool from all their jobs
  const employeeBonusPools = useMemo(() => {
    return EMPLOYEES.map(emp => {
      const employeeJobs = jobs.filter(j => j.assignedEmployees.includes(emp.id) && j.status === 'Completed');
      
      const jobBreakdown = employeeJobs.map(job => {
        const jobEmployees = EMPLOYEES.filter(e => job.assignedEmployees.includes(e.id));
        const bonusAmount = calculateEmployeeBonusForJob(emp, job, jobEmployees);
        return { job, bonusAmount, isPaid: job.isPaid };
      });
      
      const eligibleAmount = jobBreakdown.filter(jb => !jb.isPaid).reduce((sum, jb) => sum + jb.bonusAmount, 0);
      const paidAmount = jobBreakdown.filter(jb => jb.isPaid).reduce((sum, jb) => sum + jb.bonusAmount, 0);
      
      const skillMult = SKILL_MULTIPLIERS[emp.level] || 1.00;
      const evsMult = getEVSMultiplier(emp.evsScore);
      const jvsMult = getJVSMultiplier(emp.jvsScore);
      const foremanMult = emp.isForeman ? FOREMAN_MULTIPLIER : 1.00;
      const totalMult = skillMult * evsMult * jvsMult * foremanMult;
      
      return { employee: emp, jobBreakdown, eligibleAmount, paidAmount, totalPool: eligibleAmount + paidAmount, skillMult, evsMult, jvsMult, foremanMult, totalMult };
    }).filter(ep => ep.jobBreakdown.length > 0).sort((a, b) => b.eligibleAmount - a.eligibleAmount);
  }, [jobs]);

  const completedJobs = jobs.filter(j => j.status === 'Completed');
  const eligibleJobs = completedJobs.filter(j => !j.isPaid);
  const paidJobs = completedJobs.filter(j => j.isPaid);
  const eligibleTotal = eligibleJobs.reduce((sum, j) => sum + j.bonusPool, 0);
  const paidTotal = paidJobs.reduce((sum, j) => sum + j.bonusPool, 0);
  const totalEligibleEmployeeBonus = employeeBonusPools.reduce((sum, ep) => sum + ep.eligibleAmount, 0);
  const totalPaidEmployeeBonus = employeeBonusPools.reduce((sum, ep) => sum + ep.paidAmount, 0);

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#1a2e1a', border: '1px solid #4F6A41', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#4F6A4120', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><DollarSign size={20} color="#4F6A41" /></div>
            <span style={{ color: '#a5d6a7', fontSize: '13px' }}>Eligible to Pay</span>
          </div>
          <p style={{ color: eligibleTotal >= 0 ? '#4F6A41' : '#EF4444', fontSize: '28px', fontWeight: '700', margin: 0 }}>{eligibleTotal >= 0 ? '+' : ''}{formatCurrency(eligibleTotal)}</p>
          <p style={{ color: '#888', fontSize: '12px', margin: '4px 0 0 0' }}>{eligibleJobs.length} jobs ready</p>
        </div>
        <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#3B82F620', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle size={20} color="#3B82F6" /></div>
            <span style={{ color: '#888', fontSize: '13px' }}>Already Paid</span>
          </div>
          <p style={{ color: '#3B82F6', fontSize: '28px', fontWeight: '700', margin: 0 }}>{formatCurrency(paidTotal)}</p>
          <p style={{ color: '#888', fontSize: '12px', margin: '4px 0 0 0' }}>{paidJobs.length} jobs paid</p>
        </div>
        <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#F9731620', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={20} color="#F97316" /></div>
            <span style={{ color: '#888', fontSize: '13px' }}>Employees</span>
          </div>
          <p style={{ color: '#F97316', fontSize: '28px', fontWeight: '700', margin: 0 }}>{employeeBonusPools.length}</p>
          <p style={{ color: '#888', fontSize: '12px', margin: '4px 0 0 0' }}>{EMPLOYEES.filter(e => e.isForeman).length} Foremen</p>
        </div>
        <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#8B5CF620', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Briefcase size={20} color="#8B5CF6" /></div>
            <span style={{ color: '#888', fontSize: '13px' }}>Completed Jobs</span>
          </div>
          <p style={{ color: '#8B5CF6', fontSize: '28px', fontWeight: '700', margin: 0 }}>{completedJobs.length}</p>
          <p style={{ color: '#888', fontSize: '12px', margin: '4px 0 0 0' }}>{jobs.filter(j => j.status === 'In Progress').length} in progress</p>
        </div>
      </div>

      {/* Jobs Panel */}
      <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', marginBottom: '24px', overflow: 'hidden' }}>
        <div onClick={() => setShowJobsPanel(!showJobsPanel)} style={{ padding: '16px 20px', borderBottom: showJobsPanel ? '1px solid #444' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Briefcase size={20} color="#4F6A41" />
            <h2 style={{ color: '#fff', fontSize: '16px', fontWeight: '600', margin: 0 }}>Job Bonus Management</h2>
            <span style={{ backgroundColor: '#4F6A4120', color: '#4F6A41', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>{eligibleJobs.length} eligible</span>
          </div>
          <ChevronDown size={20} color="#888" style={{ transform: showJobsPanel ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
        </div>
        {showJobsPanel && (
          <div style={{ padding: '16px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1.2fr', padding: '12px 0', borderBottom: '1px solid #444' }}>
              <span style={{ color: '#888', fontSize: '12px', fontWeight: '600' }}>JOB</span>
              <span style={{ color: '#888', fontSize: '12px', fontWeight: '600', textAlign: 'center' }}>STATUS</span>
              <span style={{ color: '#888', fontSize: '12px', fontWeight: '600', textAlign: 'center' }}>CREW</span>
              <span style={{ color: '#888', fontSize: '12px', fontWeight: '600', textAlign: 'right' }}>BONUS POOL</span>
              <span style={{ color: '#888', fontSize: '12px', fontWeight: '600', textAlign: 'center' }}>ACTION</span>
            </div>
            {jobs.filter(j => j.status !== 'Pending').map((job) => (
              <div key={job.id} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1.2fr', padding: '14px 0', alignItems: 'center', borderBottom: '1px solid #333' }}>
                <div>
                  <p style={{ color: '#fff', fontWeight: '500', margin: 0, fontSize: '14px' }}>{job.name}</p>
                  <p style={{ color: '#888', fontSize: '12px', margin: '2px 0 0 0' }}>{job.client} {job.completedDate && `• ${job.completedDate}`}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', backgroundColor: job.status === 'Completed' ? '#10B98120' : '#F9731620', color: job.status === 'Completed' ? '#10B981' : '#F97316' }}>{job.status}</span>
                </div>
                <div style={{ textAlign: 'center', color: '#888', fontSize: '13px' }}>{job.assignedEmployees.length}</div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: job.bonusPool > 0 ? '#10B981' : job.bonusPool < 0 ? '#EF4444' : '#888', fontSize: '16px', fontWeight: '700' }}>{job.bonusPool > 0 ? '+' : ''}{formatCurrency(job.bonusPool)}</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  {job.status === 'Completed' && (job.isPaid ? (
                    <button onClick={() => markJobUnpaid(job.id)} style={{ padding: '8px 16px', backgroundColor: '#3B82F620', border: '1px solid #3B82F6', borderRadius: '6px', color: '#3B82F6', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14} />Paid</button>
                  ) : (
                    <button onClick={() => markJobPaid(job.id)} style={{ padding: '8px 16px', backgroundColor: job.bonusPool >= 0 ? '#4F6A41' : '#EF4444', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><DollarSign size={14} />Mark Paid</button>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', marginTop: '12px', backgroundColor: '#1a1a1a', borderRadius: '8px', paddingLeft: '12px', paddingRight: '12px' }}>
              <span style={{ color: '#fff', fontWeight: '600' }}>TOTAL ELIGIBLE</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ color: eligibleTotal >= 0 ? '#10B981' : '#EF4444', fontSize: '18px', fontWeight: '700' }}>{eligibleTotal >= 0 ? '+' : ''}{formatCurrency(eligibleTotal)}</span>
                <button onClick={() => eligibleJobs.forEach(j => markJobPaid(j.id))} disabled={eligibleJobs.length === 0} style={{ padding: '10px 20px', backgroundColor: eligibleJobs.length > 0 ? '#4F6A41' : '#333', border: 'none', borderRadius: '6px', color: eligibleJobs.length > 0 ? '#fff' : '#666', fontSize: '13px', fontWeight: '700', cursor: eligibleJobs.length > 0 ? 'pointer' : 'default' }}>Pay All Eligible</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Employee Bonus Pools */}
      <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', margin: 0 }}>Employee Bonus Pools</h2>
            <p style={{ color: '#888', fontSize: '13px', margin: '4px 0 0 0' }}>Click employee to see job breakdown • Eligible amounts removed when paid</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ padding: '8px 16px', backgroundColor: '#3a3a3a', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>Export CSV</button>
            <button style={{ padding: '8px 16px', backgroundColor: '#4F6A41', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Print Report</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.6fr 0.6fr 0.6fr 0.6fr 0.6fr 1fr 1fr 1fr', padding: '12px 20px', borderBottom: '1px solid #444', backgroundColor: '#252525' }}>
          <span style={{ color: '#888', fontSize: '12px', fontWeight: '600' }}>EMPLOYEE</span>
          <span style={{ color: '#888', fontSize: '12px', fontWeight: '600', textAlign: 'center' }}>HOURS</span>
          <span style={{ color: '#888', fontSize: '12px', fontWeight: '600', textAlign: 'center' }}>SKILL</span>
          <span style={{ color: '#888', fontSize: '12px', fontWeight: '600', textAlign: 'center' }}>EVS</span>
          <span style={{ color: '#888', fontSize: '12px', fontWeight: '600', textAlign: 'center' }}>JVS</span>
          <span style={{ color: '#888', fontSize: '12px', fontWeight: '600', textAlign: 'center' }}>TOTAL×</span>
          <span style={{ color: '#888', fontSize: '12px', fontWeight: '600', textAlign: 'right' }}>ELIGIBLE</span>
          <span style={{ color: '#888', fontSize: '12px', fontWeight: '600', textAlign: 'right' }}>PAID</span>
          <span style={{ color: '#888', fontSize: '12px', fontWeight: '600', textAlign: 'right' }}>TOTAL POOL</span>
        </div>

        {employeeBonusPools.map((ep, i) => (
          <div key={ep.employee.id}>
            <div onClick={() => setExpandedEmployee(expandedEmployee === ep.employee.id ? null : ep.employee.id)} style={{ display: 'grid', gridTemplateColumns: '2fr 0.6fr 0.6fr 0.6fr 0.6fr 0.6fr 1fr 1fr 1fr', padding: '16px 20px', alignItems: 'center', borderBottom: expandedEmployee === ep.employee.id ? 'none' : '1px solid #333', backgroundColor: expandedEmployee === ep.employee.id ? '#3a3a3a' : 'transparent', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: i < 3 ? '#FBBF24' : '#4F6A41', display: 'flex', alignItems: 'center', justifyContent: 'center', color: i < 3 ? '#000' : '#fff', fontWeight: '600', fontSize: '13px' }}>{ep.employee.name.split(' ').map(n => n[0]).join('')}</div>
                  {ep.employee.isForeman && <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Award size={10} color="#fff" /></div>}
                </div>
                <div>
                  <p style={{ color: '#fff', fontWeight: '500', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>{ep.employee.name}{ep.employee.isForeman && <span style={{ fontSize: '10px', backgroundColor: '#8B5CF620', color: '#8B5CF6', padding: '2px 6px', borderRadius: '4px' }}>Foreman</span>}<ChevronDown size={14} color="#888" style={{ transform: expandedEmployee === ep.employee.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} /></p>
                  <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>Level {ep.employee.level} • {ep.jobBreakdown.length} jobs</p>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}><span style={{ color: '#fff', fontSize: '14px' }}>{ep.employee.hoursWorked}</span></div>
              <div style={{ textAlign: 'center' }}><span style={{ color: '#F97316', fontSize: '14px', fontWeight: '600' }}>{ep.skillMult.toFixed(2)}×</span></div>
              <div style={{ textAlign: 'center' }}><span style={{ color: '#3B82F6', fontSize: '14px', fontWeight: '600' }}>{ep.evsMult.toFixed(2)}×</span></div>
              <div style={{ textAlign: 'center' }}><span style={{ color: '#14B8A6', fontSize: '14px', fontWeight: '600' }}>{ep.jvsMult.toFixed(2)}×</span></div>
              <div style={{ textAlign: 'center' }}><span style={{ color: '#FBBF24', fontSize: '14px', fontWeight: '700' }}>{ep.totalMult.toFixed(2)}×</span></div>
              <div style={{ textAlign: 'right' }}><span style={{ color: ep.eligibleAmount >= 0 ? '#4F6A41' : '#EF4444', fontSize: '16px', fontWeight: '700' }}>{ep.eligibleAmount >= 0 ? '+' : ''}{formatCurrency(ep.eligibleAmount)}</span></div>
              <div style={{ textAlign: 'right' }}><span style={{ color: '#3B82F6', fontSize: '16px', fontWeight: '700' }}>{formatCurrency(ep.paidAmount)}</span></div>
              <div style={{ textAlign: 'right' }}><span style={{ color: ep.totalPool >= 0 ? '#fff' : '#EF4444', fontSize: '18px', fontWeight: '700' }}>{ep.totalPool >= 0 ? '+' : ''}{formatCurrency(ep.totalPool)}</span></div>
            </div>
            {expandedEmployee === ep.employee.id && (
              <div style={{ backgroundColor: '#1a1a1a', padding: '16px 20px 16px 72px', borderBottom: '1px solid #333' }}>
                <p style={{ color: '#888', fontSize: '12px', fontWeight: '600', marginBottom: '12px' }}>JOB BREAKDOWN</p>
                {ep.jobBreakdown.map(jb => (
                  <div key={jb.job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #333' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '600', backgroundColor: jb.isPaid ? '#3B82F620' : jb.bonusAmount >= 0 ? '#4F6A4120' : '#EF444420', color: jb.isPaid ? '#3B82F6' : jb.bonusAmount >= 0 ? '#4F6A41' : '#EF4444' }}>{jb.isPaid ? 'PAID' : 'ELIGIBLE'}</span>
                      <div>
                        <p style={{ color: '#fff', fontSize: '13px', margin: 0 }}>{jb.job.name}</p>
                        <p style={{ color: '#888', fontSize: '11px', margin: 0 }}>{jb.job.client}</p>
                      </div>
                    </div>
                    <span style={{ color: jb.bonusAmount >= 0 ? '#4F6A41' : '#EF4444', fontSize: '15px', fontWeight: '700' }}>{jb.bonusAmount >= 0 ? '+' : ''}{formatCurrency(jb.bonusAmount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.6fr 0.6fr 0.6fr 0.6fr 0.6fr 1fr 1fr 1fr', padding: '16px 20px', alignItems: 'center', backgroundColor: '#1a1a1a', borderTop: '2px solid #444' }}>
          <span style={{ color: '#fff', fontWeight: '600' }}>TOTAL</span>
          <span></span><span></span><span></span><span></span><span></span>
          <span style={{ color: totalEligibleEmployeeBonus >= 0 ? '#4F6A41' : '#EF4444', fontSize: '18px', fontWeight: '700', textAlign: 'right' }}>{totalEligibleEmployeeBonus >= 0 ? '+' : ''}{formatCurrency(totalEligibleEmployeeBonus)}</span>
          <span style={{ color: '#3B82F6', fontSize: '18px', fontWeight: '700', textAlign: 'right' }}>{formatCurrency(totalPaidEmployeeBonus)}</span>
          <span style={{ color: '#fff', fontSize: '20px', fontWeight: '700', textAlign: 'right' }}>{formatCurrency(totalEligibleEmployeeBonus + totalPaidEmployeeBonus)}</span>
        </div>
      </div>
    </div>
  );
}

// Overview Tab
function OverviewTab({ selectedMonth, employees, selectedJob, showGraphs, bonusPool, jobs, eligibleBonusTotal, paidBonusTotal }: { 
  selectedMonth: MonthYear; 
  employees: Employee[]; 
  selectedJob: number | null; 
  showGraphs: boolean; 
  bonusPool: number;
  jobs: Job[];
  eligibleBonusTotal: number;
  paidBonusTotal: number;
}) {
  const monthName = getMonthName(selectedMonth.month);
  const avgEVS = employees.reduce((sum, e) => sum + e.evsScore, 0) / employees.length;
  const avgJVS = employees.reduce((sum, e) => sum + e.jvsScore, 0) / employees.length;
  const avgLevel = employees.reduce((sum, e) => sum + e.level, 0) / employees.length;

  return (
    <div>
      {/* Filter Badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ padding: '6px 14px', backgroundColor: '#4F6A4120', border: '1px solid #4F6A41', borderRadius: '20px', color: '#4F6A41', fontSize: '13px', fontWeight: '500' }}>{monthName} {selectedMonth.year}</span>
          {employees.length < EMPLOYEES.length && <span style={{ padding: '6px 14px', backgroundColor: '#3B82F620', border: '1px solid #3B82F6', borderRadius: '20px', color: '#3B82F6', fontSize: '13px', fontWeight: '500' }}>{employees.length} Employee{employees.length !== 1 ? 's' : ''}</span>}
          {selectedJob && <span style={{ padding: '6px 14px', backgroundColor: '#F9731620', border: '1px solid #F97316', borderRadius: '20px', color: '#F97316', fontSize: '13px', fontWeight: '500' }}>Job: {jobs.find(j => j.id === selectedJob)?.name.slice(0, 20)}...</span>}
          <span style={{ padding: '6px 14px', backgroundColor: eligibleBonusTotal >= 0 ? '#10B98120' : '#EF444420', border: `1px solid ${eligibleBonusTotal >= 0 ? '#10B981' : '#EF4444'}`, borderRadius: '20px', color: eligibleBonusTotal >= 0 ? '#10B981' : '#EF4444', fontSize: '13px', fontWeight: '500' }}>
            Eligible: {eligibleBonusTotal >= 0 ? '+' : ''}{formatCurrency(eligibleBonusTotal)}
          </span>
          <span style={{ padding: '6px 14px', backgroundColor: '#3B82F620', border: '1px solid #3B82F6', borderRadius: '20px', color: '#3B82F6', fontSize: '13px', fontWeight: '500' }}>
            Paid: {formatCurrency(paidBonusTotal)}
          </span>
        </div>
      </div>

      {/* Graphs */}
      {showGraphs && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}><TrendingUp size={18} color="#14B8A6" /><h3 style={{ color: '#fff', fontSize: '16px', margin: 0 }}>Performance Trends (6 Months)</h3></div>
            <LineChart data={HISTORICAL_DATA} lines={[{ key: 'avgEVS', color: '#3B82F6', label: 'EVS Score', maxValue: 100 }, { key: 'avgSkill', color: '#F97316', label: 'Skill Level', maxValue: 15 }]} />
          </div>
          <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}><BarChart3 size={18} color="#14B8A6" /><h3 style={{ color: '#fff', fontSize: '16px', margin: 0 }}>Current Averages</h3></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#333', borderRadius: '10px' }}><p style={{ color: '#888', fontSize: '12px', margin: '0 0 8px 0' }}>Avg EVS</p><p style={{ color: '#3B82F6', fontSize: '28px', fontWeight: '700', margin: 0 }}>{avgEVS.toFixed(1)}</p></div>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#333', borderRadius: '10px' }}><p style={{ color: '#888', fontSize: '12px', margin: '0 0 8px 0' }}>Avg JVS</p><p style={{ color: '#14B8A6', fontSize: '28px', fontWeight: '700', margin: 0 }}>{avgJVS.toFixed(1)}</p></div>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#333', borderRadius: '10px' }}><p style={{ color: '#888', fontSize: '12px', margin: '0 0 8px 0' }}>Avg Level</p><p style={{ color: '#F97316', fontSize: '28px', fontWeight: '700', margin: 0 }}>{avgLevel.toFixed(1)}</p></div>
            </div>
            <div style={{ marginTop: '20px' }}><ScoreDistribution employees={employees} type="evs" /></div>
          </div>
        </div>
      )}

      {/* Score Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <ScoreCard title="EVS Score" subtitle="Out of 100" icon={<Target size={22} color="#fff" />} iconBg="#3B82F6" employees={employees.slice(0, 3)} scoreKey="evsScore" maxScore={100} />
        <ScoreCard title="Skill Level" subtitle="Out of 15" icon={<GraduationCap size={22} color="#fff" />} iconBg="#F97316" employees={employees.slice(0, 3)} scoreKey="level" maxScore={15} showLevel />
        <ScoreCard title="JVS Score" subtitle="Out of 5" icon={<Briefcase size={22} color="#fff" />} iconBg="#14B8A6" employees={employees.slice(0, 3)} scoreKey="jvsScore" maxScore={5} noUpdate />
      </div>

      {/* Top Performers */}
      <TopPerformersTable selectedMonth={selectedMonth} employees={employees} bonusPool={bonusPool} />
    </div>
  );
}

// Score Card Component
function ScoreCard({ title, subtitle, icon, iconBg, employees, scoreKey, maxScore, showLevel, noUpdate }: { title: string; subtitle: string; icon: React.ReactNode; iconBg: string; employees: Employee[]; scoreKey: 'evsScore' | 'jvsScore' | 'level'; maxScore: number; showLevel?: boolean; noUpdate?: boolean; }) {
  return (
    <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
          <div><h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', margin: 0 }}>{title}</h3><p style={{ color: '#888', fontSize: '13px', margin: 0 }}>{subtitle}</p></div>
        </div>
        {!noUpdate && <button style={{ padding: '8px 20px', backgroundColor: '#14B8A6', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Update</button>}
      </div>
      {employees.map((emp, index) => (
        <EmployeeRow key={emp.id} name={emp.name} subtitle={showLevel ? `Level ${emp.level}` : undefined} multiplier={scoreKey === 'jvsScore' ? getJVSMultiplier(emp.jvsScore) : (scoreKey === 'level' ? SKILL_MULTIPLIERS[emp.level] : getEVSMultiplier(emp.evsScore))} score={emp[scoreKey]} maxScore={maxScore} hasStar={index === 0} isLast={index === employees.length - 1} />
      ))}
    </div>
  );
}

// Employee Row
function EmployeeRow({ name, subtitle, multiplier, score, maxScore, hasStar, isLast = false }: { name: string; subtitle?: string; multiplier: number; score: number; maxScore: number; hasStar: boolean; isLast?: boolean; }) {
  const percentage = (score / maxScore) * 100;
  const isGreen = multiplier >= 1.00;
  const initials = name.split(' ').map(n => n[0]).join('');
  return (
    <div style={{ marginBottom: isLast ? 0 : '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#14B8A6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '600', fontSize: '13px' }}>{initials}</div>
            {hasStar && <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#FBBF24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Star size={10} color="#fff" fill="#fff" /></div>}
          </div>
          <div><p style={{ color: '#fff', fontSize: '15px', fontWeight: '500', margin: 0 }}>{name}</p>{subtitle && <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>{subtitle}</p>}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ padding: '5px 14px', backgroundColor: isGreen ? '#10B981' : '#F97316', borderRadius: '20px', color: '#fff', fontSize: '13px', fontWeight: '700' }}>{multiplier.toFixed(2)}x</span>
          <span style={{ color: '#fff', fontWeight: '600', fontSize: '15px' }}>{score}/{maxScore}</span>
        </div>
      </div>
      <div style={{ height: '10px', backgroundColor: '#444', borderRadius: '5px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${percentage}%`, backgroundColor: '#10B981', borderRadius: '5px' }} /></div>
    </div>
  );
}

// Top Performers Table
function TopPerformersTable({ selectedMonth, employees, bonusPool }: { selectedMonth: MonthYear; employees: Employee[]; bonusPool: number; }) {
  const monthName = getMonthName(selectedMonth.month);
  const sortedEmployees = [...employees].map(e => {
    const bonus = calculateEmployeeBonus(e, bonusPool, employees);
    return { ...e, total: bonus.totalMult, bonusAmount: bonus.bonusAmount };
  }).sort((a, b) => b.bonusAmount - a.bonusAmount);
  
  return (
    <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #444' }}><h2 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', margin: 0 }}>Top Performers of {monthName} {selectedMonth.year}</h2></div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', padding: '12px 20px', borderBottom: '1px solid #444' }}>
        <span style={{ color: '#888', fontSize: '13px' }}>Employee</span>
        <span style={{ color: '#888', fontSize: '13px', textAlign: 'center' }}>Skill Level</span>
        <span style={{ color: '#888', fontSize: '13px', textAlign: 'center' }}>EVS Score</span>
        <span style={{ color: '#888', fontSize: '13px', textAlign: 'center' }}>JVS Score</span>
        <span style={{ color: '#888', fontSize: '13px', textAlign: 'center' }}>Multiplier</span>
        <span style={{ color: '#888', fontSize: '13px', textAlign: 'right' }}>Bonus</span>
      </div>
      {sortedEmployees.map((p, i) => (
        <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', padding: '16px 20px', alignItems: 'center', borderBottom: i < sortedEmployees.length - 1 ? '1px solid #333' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: i < 3 ? '#FBBF24' : '#14B8A6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: i < 3 ? '#000' : '#fff', fontWeight: '600', fontSize: '14px' }}>{p.name.split(' ').map(n => n[0]).join('')}</div>
            <div><p style={{ color: '#fff', fontWeight: '500', margin: 0 }}>{p.name}</p><p style={{ color: '#888', fontSize: '12px', margin: 0 }}>{p.email}</p></div>
          </div>
          <div style={{ textAlign: 'center' }}><span style={{ color: '#14B8A6', fontWeight: '700', fontSize: '18px' }}>{p.level}</span></div>
          <div style={{ textAlign: 'center' }}><span style={{ color: '#14B8A6', fontWeight: '700', fontSize: '18px' }}>{p.evsScore}</span><span style={{ color: '#888', fontSize: '14px' }}>/100</span></div>
          <div style={{ textAlign: 'center' }}><span style={{ color: '#14B8A6', fontWeight: '700', fontSize: '18px' }}>{p.jvsScore}</span><span style={{ color: '#888', fontSize: '14px' }}>/5</span></div>
          <div style={{ textAlign: 'center' }}><span style={{ color: '#FBBF24', fontWeight: '700', fontSize: '18px' }}>{p.total.toFixed(2)}×</span></div>
          <div style={{ textAlign: 'right' }}><span style={{ color: '#10B981', fontWeight: '700', fontSize: '18px' }}>{formatCurrency(p.bonusAmount)}</span></div>
        </div>
      ))}
    </div>
  );
}

// Skill Ladder Tab
function SkillLadderTab() {
  const levels = [
    { level: 1, title: 'Helper / Entry Level', desc: 'Safety & Jobsite Basics', mult: 1.00, eligible: false },
    { level: 2, title: 'Floor Prep Assistant', desc: 'Surface Prep, Repair, and Finishing Prep', mult: 1.00, eligible: false },
    { level: 3, title: 'Junior Installer', desc: 'Basic Install & Sanding Skills', mult: 1.05, eligible: true },
    { level: 4, title: 'Intermediate Installer', desc: 'Advanced Equipment', mult: 1.10, eligible: true },
    { level: 5, title: 'Technician I', desc: 'NWFA Intermediate Training', mult: 1.15, eligible: true },
    { level: 6, title: 'Technician II', desc: 'NWFA Advanced Training', mult: 1.20, eligible: true },
    { level: 7, title: 'Advanced Technician', desc: 'All Install Patterns', mult: 1.25, eligible: true },
    { level: 8, title: 'Lead Technician', desc: 'Lead small teams', mult: 1.30, eligible: true },
    { level: 9, title: 'Lead Installer', desc: 'Technical projects', mult: 1.35, eligible: true },
    { level: 10, title: 'Technician III', desc: 'Train apprentices', mult: 1.35, eligible: true },
    { level: 11, title: 'Senior Technician', desc: '', mult: 1.40, eligible: true },
    { level: 12, title: 'Craftsperson', desc: '', mult: 1.45, eligible: true },
    { level: 13, title: 'Master Technician', desc: '', mult: 1.50, eligible: true },
    { level: 14, title: 'Master Tech & Mentor', desc: 'Develops talent', mult: 1.50, eligible: true },
    { level: 15, title: 'Master Craftsman', desc: 'Top-tier', mult: 1.53, eligible: true },
  ];
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#fff', fontSize: '18px', margin: 0 }}>Skill Levels</h2>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#14B8A6', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}><Plus size={16} />Create New Skill Ladder</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {levels.map(l => (
          <div key={l.level} style={{ backgroundColor: '#2a2a2a', borderRadius: '10px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ padding: '4px 10px', backgroundColor: '#444', borderRadius: '4px', color: '#888', fontSize: '12px', fontWeight: '600' }}>Level {l.level}</span>
              {l.eligible && <span style={{ padding: '4px 10px', backgroundColor: '#14B8A6', borderRadius: '4px', color: '#fff', fontSize: '12px', fontWeight: '600' }}>Eligible</span>}
              <div><h3 style={{ color: '#fff', fontSize: '15px', margin: 0 }}>{l.title}</h3>{l.desc && <p style={{ color: '#F97316', fontSize: '12px', margin: 0 }}>{l.desc}</p>}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ padding: '6px 14px', backgroundColor: l.eligible ? '#14B8A6' : '#444', borderRadius: '6px', color: '#fff', fontSize: '12px', fontWeight: '700' }}>{l.mult.toFixed(2)}x</span>
              <button style={{ padding: '8px', backgroundColor: 'transparent', border: '1px solid #444', borderRadius: '6px', color: '#888', cursor: 'pointer' }}><Edit2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', padding: '24px', marginTop: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}><Info size={18} color="#14B8A6" /><h3 style={{ color: '#fff', fontSize: '16px', margin: 0 }}>How the Multiplier Works</h3></div>
        <div style={{ backgroundColor: '#333', borderRadius: '8px', padding: '16px' }}><p style={{ color: '#fff', fontSize: '14px', fontWeight: '600', margin: 0 }}>Your Share = (Your Weighted Hours ÷ Total Weighted Hours) × Bonus Pool</p></div>
      </div>
    </div>
  );
}

function EVSTab({ selectedMonth, employees, showGraphs }: { selectedMonth: MonthYear; employees: Employee[]; showGraphs: boolean; }) {
  const monthName = getMonthName(selectedMonth.month);
  const sortedEmployees = [...employees].sort((a, b) => b.evsScore - a.evsScore);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div><h2 style={{ color: '#fff', fontSize: '18px', margin: 0 }}>Employee Value Scorecard</h2><p style={{ color: '#888', fontSize: '13px', margin: '4px 0 0 0' }}>Performance for {monthName} {selectedMonth.year}</p></div>
        <button style={{ padding: '10px 16px', backgroundColor: '#14B8A6', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Update Scores</button>
      </div>
      {showGraphs && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', padding: '20px' }}><BarChart data={HISTORICAL_DATA} dataKey="avgEVS" color="#3B82F6" maxValue={100} label="EVS Score Trend" /></div>
          <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', padding: '20px' }}><ScoreDistribution employees={employees} type="evs" /></div>
        </div>
      )}
      <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', overflow: 'hidden' }}>
        {sortedEmployees.map((e, i) => (
          <div key={e.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: i < sortedEmployees.length - 1 ? '1px solid #333' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: i < 3 ? '#FBBF24' : '#444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: i < 3 ? '#000' : '#888', fontWeight: '700', fontSize: '12px' }}>{i + 1}</span>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#14B8A6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '600', fontSize: '13px' }}>{e.name.split(' ').map(n => n[0]).join('')}</div>
              <div><p style={{ color: '#fff', fontWeight: '500', margin: 0 }}>{e.name}</p><p style={{ color: '#888', fontSize: '12px', margin: 0 }}>Level {e.level} • {getEVSMultiplier(e.evsScore).toFixed(2)}×</p></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '200px', height: '8px', backgroundColor: '#444', borderRadius: '4px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${e.evsScore}%`, backgroundColor: '#10B981', borderRadius: '4px' }} /></div>
              <span style={{ color: '#14B8A6', fontWeight: '700', fontSize: '18px', minWidth: '80px', textAlign: 'right' }}>{e.evsScore}/100</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function JVSTab({ selectedMonth, employees, selectedJob, showGraphs, jobs }: { selectedMonth: MonthYear; employees: Employee[]; selectedJob: number | null; showGraphs: boolean; jobs: Job[]; }) {
  const monthName = getMonthName(selectedMonth.month);
  const sortedEmployees = [...employees].sort((a, b) => b.jvsScore - a.jvsScore);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div><h2 style={{ color: '#fff', fontSize: '18px', margin: 0 }}>Job Value Scorecard</h2><p style={{ color: '#888', fontSize: '13px', margin: '4px 0 0 0' }}>Quality scores for {monthName} {selectedMonth.year}{selectedJob && ` - ${jobs.find(j => j.id === selectedJob)?.name}`}</p></div>
        <button style={{ padding: '10px 16px', backgroundColor: '#4F6A41', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Update Scores</button>
      </div>
      {showGraphs && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', padding: '20px' }}><BarChart data={HISTORICAL_DATA} dataKey="avgJVS" color="#14B8A6" maxValue={5} label="JVS Score Trend" /></div>
          <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', padding: '20px' }}><ScoreDistribution employees={employees} type="jvs" /></div>
        </div>
      )}
      <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', overflow: 'hidden' }}>
        {sortedEmployees.map((e, i) => (
          <div key={e.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: i < sortedEmployees.length - 1 ? '1px solid #333' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: i < 3 ? '#FBBF24' : '#444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: i < 3 ? '#000' : '#888', fontWeight: '700', fontSize: '12px' }}>{i + 1}</span>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '600', fontSize: '13px' }}>{e.name.split(' ').map(n => n[0]).join('')}</div>
              <div><p style={{ color: '#fff', fontWeight: '500', margin: 0 }}>{e.name}</p><p style={{ color: '#888', fontSize: '12px', margin: 0 }}>Level {e.level} • {getJVSMultiplier(e.jvsScore).toFixed(2)}×</p></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '4px' }}>{[1,2,3,4,5].map(s => <Star key={s} size={18} color={s <= e.jvsScore ? '#FBBF24' : '#444'} fill={s <= e.jvsScore ? '#FBBF24' : 'transparent'} />)}</div>
              <span style={{ color: '#14B8A6', fontWeight: '700', fontSize: '18px', minWidth: '50px', textAlign: 'right' }}>{e.jvsScore}/5</span>
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
      <div style={{ marginBottom: '20px' }}><h2 style={{ color: '#fff', fontSize: '18px', margin: 0 }}>Training & Certifications</h2></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {trainings.map((t, i) => (
          <div key={i} style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', padding: '20px', opacity: t.status === 'locked' ? 0.6 : 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: t.status === 'completed' ? 'rgba(16,185,129,0.2)' : t.status === 'in-progress' ? 'rgba(59,130,246,0.2)' : t.status === 'locked' ? '#444' : 'rgba(20,184,166,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {t.status === 'completed' ? <CheckCircle size={24} color="#10B981" /> : <BookOpen size={24} color={t.status === 'locked' ? '#888' : '#14B8A6'} />}
              </div>
              <div>
                <h3 style={{ color: '#fff', fontSize: '15px', margin: 0 }}>{t.title}</h3>
                <p style={{ color: '#888', fontSize: '12px', margin: '4px 0 0 0' }}>{t.category} • {t.duration}{t.req && ` • Requires Level ${t.req}`}</p>
                {t.progress && <div style={{ marginTop: '8px', width: '200px' }}><div style={{ height: '6px', backgroundColor: '#444', borderRadius: '3px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${t.progress}%`, backgroundColor: '#3B82F6', borderRadius: '3px' }} /></div></div>}
              </div>
            </div>
            <button style={{ padding: '10px 20px', backgroundColor: t.status === 'completed' ? '#10B981' : t.status === 'in-progress' ? '#3B82F6' : t.status === 'locked' ? '#444' : '#14B8A6', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: t.status === 'locked' || t.status === 'completed' ? 'not-allowed' : 'pointer' }}>
              {t.status === 'completed' ? 'Completed' : t.status === 'in-progress' ? 'Continue' : t.status === 'locked' ? 'Locked' : 'Start'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
