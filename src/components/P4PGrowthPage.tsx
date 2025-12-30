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
  status: string;
  totalHours: number;
  bonusPool: number;
  assignedEmployees: number[];
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Skill level multipliers
const SKILL_MULTIPLIERS: Record<number, number> = {
  1: 1.00, 2: 1.00, 3: 1.05, 4: 1.10, 5: 1.15, 6: 1.20, 7: 1.25,
  8: 1.30, 9: 1.35, 10: 1.35, 11: 1.40, 12: 1.45, 13: 1.50, 14: 1.50, 15: 1.53
};

// EVS multiplier calculation
const getEVSMultiplier = (score: number): number => {
  if (score >= 95) return 1.50;
  if (score >= 90) return 1.40;
  if (score >= 85) return 1.30;
  if (score >= 80) return 1.20;
  if (score >= 75) return 1.10;
  if (score >= 70) return 1.00;
  return 0.80;
};

// JVS multiplier
const getJVSMultiplier = (score: number): number => {
  return 0.60 + (score * 0.08);
};

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

const JOBS: Job[] = [
  { id: 1, name: 'Riverside Mansion - Hardwood Install', client: 'Johnson Family', status: 'Completed', totalHours: 320, bonusPool: 4800, assignedEmployees: [1, 2, 4, 8] },
  { id: 2, name: 'Downtown Office - Floor Refinishing', client: 'TechCorp Inc', status: 'Completed', totalHours: 180, bonusPool: 2700, assignedEmployees: [3, 6, 9] },
  { id: 3, name: 'Lakeside Villa - Custom Inlay', client: 'Smith Residence', status: 'In Progress', totalHours: 240, bonusPool: 5200, assignedEmployees: [1, 5, 7] },
  { id: 4, name: 'City Center Hotel - Lobby', client: 'Grand Hotels', status: 'Completed', totalHours: 280, bonusPool: 4200, assignedEmployees: [2, 3, 4, 5] },
  { id: 5, name: 'Suburban Home - Engineered Wood', client: 'Williams Family', status: 'Completed', totalHours: 120, bonusPool: 1800, assignedEmployees: [6, 7, 10] },
  { id: 6, name: 'Historic Building - Parquet Repair', client: 'Heritage Trust', status: 'In Progress', totalHours: 200, bonusPool: 3600, assignedEmployees: [8, 9, 10] },
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
  const foremanMult = employee.isForeman ? 1.25 : 1.00;
  const totalMult = skillMult * evsMult * jvsMult * foremanMult;
  const weightedHours = employee.hoursWorked * totalMult;
  
  const totalWeightedHours = allEmployees.reduce((sum, e) => {
    const sm = SKILL_MULTIPLIERS[e.level] || 1.00;
    const em = getEVSMultiplier(e.evsScore);
    const jm = getJVSMultiplier(e.jvsScore);
    const fm = e.isForeman ? 1.25 : 1.00;
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
      const job = JOBS.find(j => j.id === selectedJob);
      if (job) {
        result = result.filter(e => job.assignedEmployees.includes(e.id));
      }
    }
    return result;
  }, [selectedEmployee, selectedJob]);

  // Calculate total bonus pool based on job selection
  const currentBonusPool = useMemo(() => {
    if (selectedJob) {
      const job = JOBS.find(j => j.id === selectedJob);
      return job?.bonusPool || 0;
    }
    return JOBS.reduce((sum, j) => sum + j.bonusPool, 0);
  }, [selectedJob]);

  const handlePrevMonth = () => setSelectedMonth(prev => prev.month === 0 ? { month: 11, year: prev.year - 1 } : { month: prev.month - 1, year: prev.year });
  const handleNextMonth = () => setSelectedMonth(prev => prev.month === 11 ? { month: 0, year: prev.year + 1 } : { month: prev.month + 1, year: prev.year });
  const handleMonthSelect = (month: number, year: number) => { setSelectedMonth({ month, year }); setShowMonthPicker(false); };

  const currentYear = new Date().getFullYear();
  const availableYears = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
  const employeeOptions = EMPLOYEES.map(e => ({ value: e.id, label: e.name }));
  const jobOptions = JOBS.map(j => ({ value: j.id, label: `${j.name} (${formatCurrency(j.bonusPool)})` }));
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
      {activeTab === 'overview' && <OverviewTab selectedMonth={selectedMonth} employees={filteredEmployees} selectedJob={selectedJob} showGraphs={showGraphs} bonusPool={currentBonusPool} />}
      {activeTab === 'bonus-payout' && <BonusPayoutTab selectedMonth={selectedMonth} employees={filteredEmployees} selectedJob={selectedJob} selectedEmployee={selectedEmployee} bonusPool={currentBonusPool} />}
      {activeTab === 'skill-ladder' && <SkillLadderTab />}
      {activeTab === 'evs-scorecard' && <EVSTab selectedMonth={selectedMonth} employees={filteredEmployees} showGraphs={showGraphs} />}
      {activeTab === 'jvs-scorecard' && <JVSTab selectedMonth={selectedMonth} employees={filteredEmployees} selectedJob={selectedJob} showGraphs={showGraphs} />}
      {activeTab === 'training' && <TrainingTab />}
    </div>
    </>
  );
}

// BONUS PAYOUT TAB - The main focus for understanding bonus distribution
function BonusPayoutTab({ selectedMonth, employees, selectedJob, selectedEmployee, bonusPool }: { selectedMonth: MonthYear; employees: Employee[]; selectedJob: number | null; selectedEmployee: number | null; bonusPool: number; }) {
  const monthName = getMonthName(selectedMonth.month);
  
  // Calculate all employee bonuses
  const bonusBreakdown = employees.map(e => {
    const bonus = calculateEmployeeBonus(e, bonusPool, employees);
    return { employee: e, ...bonus };
  }).sort((a, b) => b.bonusAmount - a.bonusAmount);

  const totalWeightedHours = bonusBreakdown.reduce((sum, b) => sum + b.weightedHours, 0);
  const totalBonus = bonusBreakdown.reduce((sum, b) => sum + b.bonusAmount, 0);

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#10B98120', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><DollarSign size={20} color="#10B981" /></div>
            <span style={{ color: '#888', fontSize: '13px' }}>Total Bonus Pool</span>
          </div>
          <p style={{ color: '#10B981', fontSize: '28px', fontWeight: '700', margin: 0 }}>{formatCurrency(bonusPool)}</p>
          <p style={{ color: '#888', fontSize: '12px', margin: '4px 0 0 0' }}>{selectedJob ? JOBS.find(j => j.id === selectedJob)?.name : 'All Jobs Combined'}</p>
        </div>
        
        <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#3B82F620', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={20} color="#3B82F6" /></div>
            <span style={{ color: '#888', fontSize: '13px' }}>Employees</span>
          </div>
          <p style={{ color: '#3B82F6', fontSize: '28px', fontWeight: '700', margin: 0 }}>{employees.length}</p>
          <p style={{ color: '#888', fontSize: '12px', margin: '4px 0 0 0' }}>{employees.filter(e => e.isForeman).length} Foremen</p>
        </div>
        
        <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#F9731620', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={20} color="#F97316" /></div>
            <span style={{ color: '#888', fontSize: '13px' }}>Weighted Hours</span>
          </div>
          <p style={{ color: '#F97316', fontSize: '28px', fontWeight: '700', margin: 0 }}>{totalWeightedHours.toFixed(0)}</p>
          <p style={{ color: '#888', fontSize: '12px', margin: '4px 0 0 0' }}>From {employees.reduce((sum, e) => sum + e.hoursWorked, 0)} actual hours</p>
        </div>
        
        <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#14B8A620', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Percent size={20} color="#14B8A6" /></div>
            <span style={{ color: '#888', fontSize: '13px' }}>Avg Bonus/Employee</span>
          </div>
          <p style={{ color: '#14B8A6', fontSize: '28px', fontWeight: '700', margin: 0 }}>{formatCurrency(totalBonus / employees.length)}</p>
          <p style={{ color: '#888', fontSize: '12px', margin: '4px 0 0 0' }}>For {monthName} {selectedMonth.year}</p>
        </div>
      </div>

      {/* Pie Chart and Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <PieChart size={18} color="#14B8A6" />
            <h3 style={{ color: '#fff', fontSize: '16px', margin: 0 }}>Bonus Distribution</h3>
          </div>
          <BonusPieChart employees={employees} bonusPool={bonusPool} />
        </div>

        <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <TrendingUp size={18} color="#14B8A6" />
            <h3 style={{ color: '#fff', fontSize: '16px', margin: 0 }}>Monthly Bonus Trend</h3>
          </div>
          <BarChart data={HISTORICAL_DATA} dataKey="totalBonus" color="#10B981" maxValue={25000} label="Total Bonus Paid (6 Months)" />
        </div>
      </div>

      {/* How Bonus is Calculated - Info Box */}
      <div style={{ backgroundColor: '#14B8A610', border: '1px solid #14B8A640', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Info size={18} color="#14B8A6" />
          <h3 style={{ color: '#14B8A6', fontSize: '14px', margin: 0 }}>How Bonus is Calculated</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', textAlign: 'center' }}>
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '12px' }}>
            <p style={{ color: '#888', fontSize: '11px', margin: '0 0 4px 0' }}>Hours Worked</p>
            <p style={{ color: '#fff', fontSize: '14px', fontWeight: '600', margin: 0 }}>Base</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>×</div>
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '12px' }}>
            <p style={{ color: '#888', fontSize: '11px', margin: '0 0 4px 0' }}>Skill × EVS × JVS</p>
            <p style={{ color: '#F97316', fontSize: '14px', fontWeight: '600', margin: 0 }}>Multipliers</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>=</div>
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '12px' }}>
            <p style={{ color: '#888', fontSize: '11px', margin: '0 0 4px 0' }}>Your Share %</p>
            <p style={{ color: '#10B981', fontSize: '14px', fontWeight: '600', margin: 0 }}>of Pool</p>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown Table */}
      <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', margin: 0 }}>Detailed Bonus Breakdown</h2>
            <p style={{ color: '#888', fontSize: '13px', margin: '4px 0 0 0' }}>{monthName} {selectedMonth.year} • {selectedJob ? JOBS.find(j => j.id === selectedJob)?.name : 'All Jobs'}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ padding: '8px 16px', backgroundColor: '#3a3a3a', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>Export CSV</button>
            <button style={{ padding: '8px 16px', backgroundColor: '#14B8A6', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Print Report</button>
          </div>
        </div>

        {/* Table Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr 1fr', padding: '12px 20px', borderBottom: '1px solid #444', backgroundColor: '#252525' }}>
          <span style={{ color: '#888', fontSize: '12px', fontWeight: '600' }}>EMPLOYEE</span>
          <span style={{ color: '#888', fontSize: '12px', fontWeight: '600', textAlign: 'center' }}>HOURS</span>
          <span style={{ color: '#888', fontSize: '12px', fontWeight: '600', textAlign: 'center' }}>SKILL</span>
          <span style={{ color: '#888', fontSize: '12px', fontWeight: '600', textAlign: 'center' }}>EVS</span>
          <span style={{ color: '#888', fontSize: '12px', fontWeight: '600', textAlign: 'center' }}>JVS</span>
          <span style={{ color: '#888', fontSize: '12px', fontWeight: '600', textAlign: 'center' }}>TOTAL×</span>
          <span style={{ color: '#888', fontSize: '12px', fontWeight: '600', textAlign: 'center' }}>SHARE %</span>
          <span style={{ color: '#888', fontSize: '12px', fontWeight: '600', textAlign: 'right' }}>BONUS</span>
        </div>

        {/* Table Rows */}
        {bonusBreakdown.map((b, i) => (
          <div key={b.employee.id} style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr 1fr', padding: '16px 20px', alignItems: 'center', borderBottom: i < bonusBreakdown.length - 1 ? '1px solid #333' : 'none', backgroundColor: selectedEmployee === b.employee.id ? '#14B8A610' : 'transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: i < 3 ? '#FBBF24' : '#14B8A6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: i < 3 ? '#000' : '#fff', fontWeight: '600', fontSize: '13px' }}>{b.employee.name.split(' ').map(n => n[0]).join('')}</div>
                {b.employee.isForeman && <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Award size={10} color="#fff" /></div>}
              </div>
              <div>
                <p style={{ color: '#fff', fontWeight: '500', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>{b.employee.name}{b.employee.isForeman && <span style={{ fontSize: '10px', backgroundColor: '#8B5CF620', color: '#8B5CF6', padding: '2px 6px', borderRadius: '4px' }}>Foreman</span>}</p>
                <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>Level {b.employee.level} • {b.employee.department}</p>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}><span style={{ color: '#fff', fontSize: '14px' }}>{b.employee.hoursWorked}</span></div>
            <div style={{ textAlign: 'center' }}><span style={{ color: '#F97316', fontSize: '14px', fontWeight: '600' }}>{b.skillMult.toFixed(2)}×</span></div>
            <div style={{ textAlign: 'center' }}><span style={{ color: '#3B82F6', fontSize: '14px', fontWeight: '600' }}>{b.evsMult.toFixed(2)}×</span></div>
            <div style={{ textAlign: 'center' }}><span style={{ color: '#14B8A6', fontSize: '14px', fontWeight: '600' }}>{b.jvsMult.toFixed(2)}×</span></div>
            <div style={{ textAlign: 'center' }}><span style={{ color: '#FBBF24', fontSize: '14px', fontWeight: '700' }}>{b.totalMult.toFixed(2)}×</span></div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '60px', height: '6px', backgroundColor: '#333', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${b.sharePercent}%`, backgroundColor: '#10B981', borderRadius: '3px' }} />
                </div>
                <span style={{ color: '#fff', fontSize: '13px' }}>{b.sharePercent.toFixed(1)}%</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}><span style={{ color: '#10B981', fontSize: '18px', fontWeight: '700' }}>{formatCurrency(b.bonusAmount)}</span></div>
          </div>
        ))}

        {/* Total Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr 1fr', padding: '16px 20px', alignItems: 'center', backgroundColor: '#1a1a1a', borderTop: '2px solid #444' }}>
          <span style={{ color: '#fff', fontWeight: '600' }}>TOTAL</span>
          <span style={{ color: '#fff', fontSize: '14px', textAlign: 'center', fontWeight: '600' }}>{employees.reduce((sum, e) => sum + e.hoursWorked, 0)}</span>
          <span></span><span></span><span></span><span></span>
          <span style={{ color: '#fff', fontSize: '14px', textAlign: 'center', fontWeight: '600' }}>100%</span>
          <span style={{ color: '#10B981', fontSize: '20px', fontWeight: '700', textAlign: 'right' }}>{formatCurrency(totalBonus)}</span>
        </div>
      </div>
    </div>
  );
}

// Overview Tab
function OverviewTab({ selectedMonth, employees, selectedJob, showGraphs, bonusPool }: { selectedMonth: MonthYear; employees: Employee[]; selectedJob: number | null; showGraphs: boolean; bonusPool: number; }) {
  const monthName = getMonthName(selectedMonth.month);
  const avgEVS = employees.reduce((sum, e) => sum + e.evsScore, 0) / employees.length;
  const avgJVS = employees.reduce((sum, e) => sum + e.jvsScore, 0) / employees.length;
  const avgLevel = employees.reduce((sum, e) => sum + e.level, 0) / employees.length;

  return (
    <div>
      {/* Filter Badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ padding: '6px 14px', backgroundColor: '#14B8A620', border: '1px solid #14B8A6', borderRadius: '20px', color: '#14B8A6', fontSize: '13px', fontWeight: '500' }}>{monthName} {selectedMonth.year}</span>
          {employees.length < EMPLOYEES.length && <span style={{ padding: '6px 14px', backgroundColor: '#3B82F620', border: '1px solid #3B82F6', borderRadius: '20px', color: '#3B82F6', fontSize: '13px', fontWeight: '500' }}>{employees.length} Employee{employees.length !== 1 ? 's' : ''}</span>}
          {selectedJob && <span style={{ padding: '6px 14px', backgroundColor: '#F9731620', border: '1px solid #F97316', borderRadius: '20px', color: '#F97316', fontSize: '13px', fontWeight: '500' }}>Job: {JOBS.find(j => j.id === selectedJob)?.name.slice(0, 20)}...</span>}
          <span style={{ padding: '6px 14px', backgroundColor: '#10B98120', border: '1px solid #10B981', borderRadius: '20px', color: '#10B981', fontSize: '13px', fontWeight: '500' }}>Pool: {formatCurrency(bonusPool)}</span>
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

function JVSTab({ selectedMonth, employees, selectedJob, showGraphs }: { selectedMonth: MonthYear; employees: Employee[]; selectedJob: number | null; showGraphs: boolean; }) {
  const monthName = getMonthName(selectedMonth.month);
  const sortedEmployees = [...employees].sort((a, b) => b.jvsScore - a.jvsScore);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div><h2 style={{ color: '#fff', fontSize: '18px', margin: 0 }}>Job Value Scorecard</h2><p style={{ color: '#888', fontSize: '13px', margin: '4px 0 0 0' }}>Quality scores for {monthName} {selectedMonth.year}{selectedJob && ` - ${JOBS.find(j => j.id === selectedJob)?.name}`}</p></div>
        <button style={{ padding: '10px 16px', backgroundColor: '#14B8A6', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Update Scores</button>
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
