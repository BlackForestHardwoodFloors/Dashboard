import React, { useState } from 'react';
import { 
  DollarSign, 
  Briefcase, 
  Search,
  Download,
  ChevronUp,
  ChevronDown,
  Info,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  ChevronRight,
  Clock,
  Star,
  ArrowLeft,
  Check,
  Circle
} from 'lucide-react';

// Boardroom Theme Colors
const colors = {
  primary: '#8B7355',
  accent: '#C9A227',
  success: '#4F6A41',
  danger: '#DC2626',
  background: '#1A1A1A',
  backgroundSecondary: '#2D2D2D',
  backgroundTertiary: '#3D3D3D',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  border: '#404040',
  teal: '#14B8A6',
  foreman: '#F59E0B',
};

interface EmployeeHours {
  name: string;
  hours: number;
  hourlyRate: number;
  isForeman: boolean;
}

interface JobPool {
  id: number;
  jobName: string;
  clientName: string;
  fullyPaidDate: string;
  createdTime: string;
  jobType: string;
  sqft: number;
  totalJobValue: number;
  materials: number;
  actualLaborCost: number;
  poolAmount: number;
  employees: EmployeeHours[];
}

interface EmployeeScores {
  skillLevel: number;
  jvs: number;
  evs: number;
}

interface EmployeeBonus {
  name: string;
  initials: string;
  skillLevel: number;
  jvs: number;
  evs: number;
  avgMultiplier: number;
  totalHours: number;
  totalWeightedHours: number;
  foremanJobs: number;
  jobsWorked: { 
    jobId: number; 
    jobName: string; 
    hours: number;
    isForeman: boolean;
    effectiveMultiplier: number;
    weightedHours: number;
    jobPoolAmount: number;
    earnedAmount: number;
  }[];
  totalBonus: number;
  paidBonus: number;
  unpaidBonus: number;
}

const employeeScores: Record<string, EmployeeScores> = {
  'Mahesh Dev': { skillLevel: 1.53, jvs: 1.20, evs: 1.15 },
  'Alex Olmos': { skillLevel: 1.30, jvs: 1.10, evs: 1.05 },
  'Anthony Abosida': { skillLevel: 1.40, jvs: 1.15, evs: 1.20 },
  'Hamza Khan': { skillLevel: 1.30, jvs: 1.05, evs: 1.10 },
  'Amit K': { skillLevel: 1.40, jvs: 1.10, evs: 1.15 },
  'Ronald Lajkan': { skillLevel: 1.20, jvs: 1.00, evs: 0.95 },
  'Chase Reedy': { skillLevel: 1.10, jvs: 0.95, evs: 1.00 },
};

const mockJobPools: JobPool[] = [
  { 
    id: 116, jobName: 'Ramala Mahesh', clientName: 'Ramala Mahesh', 
    fullyPaidDate: '2025-12-24', createdTime: '2025-12-25', jobType: 'Install', sqft: 850,
    totalJobValue: 4500, materials: 1200, actualLaborCost: 590,
    poolAmount: (4500 - 1200) * 0.3 - 590,
    employees: [
      { name: 'Mahesh Dev', hours: 4, hourlyRate: 85, isForeman: true },
      { name: 'Alex Olmos', hours: 3, hourlyRate: 75, isForeman: false },
    ]
  },
  { 
    id: 117, jobName: 'Osborn Steven', clientName: 'Osborn Steven', 
    fullyPaidDate: '2025-12-24', createdTime: '2025-12-25', jobType: 'Sand & Finish', sqft: 1200,
    totalJobValue: 6800, materials: 800, actualLaborCost: 620,
    poolAmount: (6800 - 800) * 0.3 - 620,
    employees: [
      { name: 'Anthony Abosida', hours: 3, hourlyRate: 80, isForeman: true },
      { name: 'Hamza Khan', hours: 4, hourlyRate: 70, isForeman: false },
      { name: 'Amit K', hours: 2, hourlyRate: 75, isForeman: false },
    ]
  },
  { 
    id: 114, jobName: 'Osborn Steve', clientName: 'Osborn Steve', 
    fullyPaidDate: '2025-12-24', createdTime: '2025-12-24', jobType: 'Install', sqft: 2400,
    totalJobValue: 28000, materials: 5500, actualLaborCost: 1872,
    poolAmount: (28000 - 5500) * 0.3 - 1872,
    employees: [
      { name: 'Mahesh Dev', hours: 8, hourlyRate: 85, isForeman: true },
      { name: 'Ronald Lajkan', hours: 6, hourlyRate: 72, isForeman: false },
      { name: 'Chase Reedy', hours: 10, hourlyRate: 65, isForeman: false },
    ]
  },
  { 
    id: 113, jobName: 'Ramala Mahesh', clientName: 'Ramala Mahesh', 
    fullyPaidDate: '2025-12-24', createdTime: '2025-12-24', jobType: 'Repair', sqft: 150,
    totalJobValue: 800, materials: 350, actualLaborCost: 146,
    poolAmount: (800 - 350) * 0.3 - 146,
    employees: [
      { name: 'Alex Olmos', hours: 2, hourlyRate: 73, isForeman: true },
    ]
  },
  { 
    id: 111, jobName: 'Mitchell Raymond', clientName: 'Mitchell Raymond', 
    fullyPaidDate: '2025-12-18', createdTime: '2025-12-18', jobType: 'Sand & Finish', sqft: 1800,
    totalJobValue: 22000, materials: 3500, actualLaborCost: 1050,
    poolAmount: (22000 - 3500) * 0.3 - 1050,
    employees: [
      { name: 'Mahesh Dev', hours: 5, hourlyRate: 85, isForeman: true },
      { name: 'Anthony Abosida', hours: 4, hourlyRate: 80, isForeman: false },
      { name: 'Amit K', hours: 5, hourlyRate: 75, isForeman: false },
    ]
  },
  { 
    id: 110, jobName: 'Hilderbrand Russell', clientName: 'Hilderbrand Russell', 
    fullyPaidDate: '2025-12-18', createdTime: '2025-12-19', jobType: 'Install', sqft: 1600,
    totalJobValue: 18000, materials: 3200, actualLaborCost: 1040,
    poolAmount: (18000 - 3200) * 0.3 - 1040,
    employees: [
      { name: 'Hamza Khan', hours: 8, hourlyRate: 70, isForeman: true },
      { name: 'Ronald Lajkan', hours: 6, hourlyRate: 72, isForeman: false },
    ]
  },
  { 
    id: 108, jobName: 'Test Mahesh', clientName: 'Test Mahesh', 
    fullyPaidDate: '2025-12-17', createdTime: '2025-12-17', jobType: 'Repair', sqft: 200,
    totalJobValue: 600, materials: 280, actualLaborCost: 432,
    poolAmount: (600 - 280) * 0.3 - 432,
    employees: [
      { name: 'Chase Reedy', hours: 6, hourlyRate: 72, isForeman: true },
    ]
  },
  { 
    id: 107, jobName: 'Mitchell Raymond', clientName: 'Mitchell Raymond', 
    fullyPaidDate: '2025-12-09', createdTime: '2025-12-09', jobType: 'Stain', sqft: 400,
    totalJobValue: 3200, materials: 700, actualLaborCost: 250,
    poolAmount: (3200 - 700) * 0.3 - 250,
    employees: [
      { name: 'Alex Olmos', hours: 2, hourlyRate: 75, isForeman: true },
      { name: 'Amit K', hours: 2, hourlyRate: 75, isForeman: false },
    ]
  },
  { 
    id: 105, jobName: 'Mitchell Raymond', clientName: 'Mitchell Raymond', 
    fullyPaidDate: '2025-12-08', createdTime: '2025-12-09', jobType: 'Install', sqft: 1400,
    totalJobValue: 17500, materials: 3200, actualLaborCost: 700,
    poolAmount: (17500 - 3200) * 0.3 - 700,
    employees: [
      { name: 'Mahesh Dev', hours: 3, hourlyRate: 85, isForeman: false },
      { name: 'Anthony Abosida', hours: 4, hourlyRate: 80, isForeman: true },
      { name: 'Hamza Khan', hours: 3, hourlyRate: 70, isForeman: false },
    ]
  },
];

// Mock initial paid status - some bonuses already paid
const initialPaidBonuses: Record<string, boolean> = {
  'Mahesh Dev-105': true,
  'Anthony Abosida-105': true,
  'Hamza Khan-105': true,
  'Alex Olmos-107': true,
  'Amit K-107': true,
};

type SortField = 'id' | 'jobName' | 'fullyPaidDate' | 'poolAmount' | 'createdTime';
type SortDirection = 'asc' | 'desc';
type ViewTab = 'jobs' | 'employees';

interface JobPoolsPageProps {
  onBack?: () => void;
}

export default function JobPoolsPage({ onBack }: JobPoolsPageProps) {
  const [jobPools] = useState<JobPool[]>(mockJobPools);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdTime');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterType, setFilterType] = useState<'all' | 'positive' | 'negative'>('all');
  const [selectedJob, setSelectedJob] = useState<JobPool | null>(null);
  const [activeTab, setActiveTab] = useState<ViewTab>('jobs');
  const [expandedEmployee, setExpandedEmployee] = useState<string | null>(null);
  const [paidBonuses, setPaidBonuses] = useState<Record<string, boolean>>(initialPaidBonuses);

  // Toggle paid status
  const togglePaid = (employeeName: string, jobId: number) => {
    const key = `${employeeName}-${jobId}`;
    setPaidBonuses(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isPaid = (employeeName: string, jobId: number) => {
    return paidBonuses[`${employeeName}-${jobId}`] || false;
  };

  // Calculate summary stats
  const totalPoolAmount = jobPools.reduce((sum, job) => sum + job.poolAmount, 0);
  const positiveJobs = jobPools.filter(job => job.poolAmount > 0);
  const negativeJobs = jobPools.filter(job => job.poolAmount < 0);
  const totalPositive = positiveJobs.reduce((sum, job) => sum + job.poolAmount, 0);
  const totalNegative = negativeJobs.reduce((sum, job) => sum + job.poolAmount, 0);

  // Calculate employee bonuses with foreman bonus and paid status
  const calculateEmployeeBonuses = (): EmployeeBonus[] => {
    const employeeMap: Record<string, EmployeeBonus> = {};
    
    Object.keys(employeeScores).forEach(name => {
      const scores = employeeScores[name];
      const initials = name.split(' ').map(n => n[0]).join('');
      const avgMultiplier = (scores.skillLevel + scores.jvs + scores.evs) / 3;
      
      employeeMap[name] = {
        name,
        initials,
        skillLevel: scores.skillLevel,
        jvs: scores.jvs,
        evs: scores.evs,
        avgMultiplier,
        totalHours: 0,
        totalWeightedHours: 0,
        foremanJobs: 0,
        jobsWorked: [],
        totalBonus: 0,
        paidBonus: 0,
        unpaidBonus: 0,
      };
    });

    jobPools.forEach(job => {
      if (job.poolAmount > 0 && job.employees.length > 0) {
        let totalWeightedHoursForJob = 0;
        const employeeWeights: { name: string; hours: number; isForeman: boolean; effectiveMultiplier: number; weightedHours: number }[] = [];
        
        job.employees.forEach(emp => {
          if (employeeMap[emp.name]) {
            const baseMultiplier = employeeMap[emp.name].avgMultiplier;
            const effectiveMultiplier = emp.isForeman ? baseMultiplier + 2 : baseMultiplier;
            const weightedHours = emp.hours * effectiveMultiplier;
            totalWeightedHoursForJob += weightedHours;
            employeeWeights.push({ 
              name: emp.name, 
              hours: emp.hours, 
              isForeman: emp.isForeman,
              effectiveMultiplier,
              weightedHours 
            });
          }
        });

        employeeWeights.forEach(ew => {
          const shareOfPool = (ew.weightedHours / totalWeightedHoursForJob) * job.poolAmount;
          const paid = isPaid(ew.name, job.id);
          
          employeeMap[ew.name].jobsWorked.push({
            jobId: job.id,
            jobName: job.jobName,
            hours: ew.hours,
            isForeman: ew.isForeman,
            effectiveMultiplier: ew.effectiveMultiplier,
            weightedHours: ew.weightedHours,
            jobPoolAmount: job.poolAmount,
            earnedAmount: shareOfPool,
          });
          
          employeeMap[ew.name].totalHours += ew.hours;
          employeeMap[ew.name].totalWeightedHours += ew.weightedHours;
          employeeMap[ew.name].totalBonus += shareOfPool;
          
          if (paid) {
            employeeMap[ew.name].paidBonus += shareOfPool;
          } else {
            employeeMap[ew.name].unpaidBonus += shareOfPool;
          }
          
          if (ew.isForeman) {
            employeeMap[ew.name].foremanJobs += 1;
          }
        });
      }
    });

    return Object.values(employeeMap).sort((a, b) => b.totalBonus - a.totalBonus);
  };

  const employeeBonuses = calculateEmployeeBonuses();
  const totalBonusPayout = employeeBonuses.reduce((sum, emp) => sum + emp.totalBonus, 0);
  const totalPaid = employeeBonuses.reduce((sum, emp) => sum + emp.paidBonus, 0);
  const totalUnpaid = employeeBonuses.reduce((sum, emp) => sum + emp.unpaidBonus, 0);

  // Filter and sort jobs
  const filteredJobs = jobPools
    .filter(job => {
      const matchesSearch = job.jobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.id.toString().includes(searchTerm);
      const matchesFilter = filterType === 'all' ||
                           (filterType === 'positive' && job.poolAmount > 0) ||
                           (filterType === 'negative' && job.poolAmount < 0);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'id': comparison = a.id - b.id; break;
        case 'jobName': comparison = a.jobName.localeCompare(b.jobName); break;
        case 'fullyPaidDate':
        case 'createdTime':
          comparison = new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime(); break;
        case 'poolAmount': comparison = a.poolAmount - b.poolAmount; break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatCurrency = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return amount < 0 ? `-${formatted}` : formatted;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp size={14} style={{ opacity: 0.3 }} />;
    return sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const ForemanBadge = ({ size = 'normal' }: { size?: 'normal' | 'small' }) => (
    <span style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '4px', 
      padding: size === 'small' ? '2px 6px' : '3px 8px', 
      backgroundColor: 'rgba(245, 158, 11, 0.2)', 
      borderRadius: '12px', 
      fontSize: size === 'small' ? '10px' : '11px', 
      fontWeight: '600', 
      color: colors.foreman 
    }}>
      <Star size={size === 'small' ? 10 : 12} fill={colors.foreman} />
      Foreman
    </span>
  );

  const PaidStatus = ({ paid, onClick }: { paid: boolean; onClick: () => void }) => (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 10px',
        backgroundColor: paid ? 'rgba(79, 106, 65, 0.2)' : 'rgba(160, 160, 160, 0.2)',
        border: `1px solid ${paid ? colors.success : colors.border}`,
        borderRadius: '16px',
        fontSize: '11px',
        fontWeight: '600',
        color: paid ? colors.success : colors.textSecondary,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {paid ? <Check size={12} /> : <Circle size={12} />}
      {paid ? 'Paid' : 'Unpaid'}
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background, padding: '24px', paddingTop: '24px' }}>
      {/* Back Button */}
      <button
        onClick={handleBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: colors.backgroundSecondary,
          border: `1px solid ${colors.border}`,
          borderRadius: '8px',
          color: colors.text,
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: colors.text, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: colors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={24} color="#fff" />
            </div>
            P4P Bonus Pool
          </h1>
          <p style={{ color: colors.textSecondary, margin: 0, fontSize: '14px' }}>
            Foreman receives +2 multiplier bonus • Click status to toggle paid
          </p>
        </div>
        <button onClick={() => console.log('Export')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: colors.primary, border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
          <Download size={18} /> Export
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {/* Total Pool */}
        <div style={{ backgroundColor: colors.backgroundSecondary, borderRadius: '16px', padding: '20px', border: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: colors.textSecondary, fontSize: '12px', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Pool</p>
              <p style={{ color: totalPoolAmount >= 0 ? colors.success : colors.danger, fontSize: '24px', fontWeight: '700', margin: 0 }}>{formatCurrency(totalPoolAmount)}</p>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(79, 106, 65, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} color={colors.success} />
            </div>
          </div>
          <p style={{ color: colors.textSecondary, fontSize: '11px', margin: '10px 0 0 0' }}>{jobPools.length} jobs</p>
        </div>

        {/* Contributing */}
        <div style={{ backgroundColor: colors.backgroundSecondary, borderRadius: '16px', padding: '20px', border: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: colors.textSecondary, fontSize: '12px', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contributing</p>
              <p style={{ color: colors.success, fontSize: '24px', fontWeight: '700', margin: 0 }}>{positiveJobs.length}</p>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(79, 106, 65, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpRight size={20} color={colors.success} />
            </div>
          </div>
          <p style={{ color: colors.success, fontSize: '11px', margin: '10px 0 0 0' }}>+{formatCurrency(totalPositive)}</p>
        </div>

        {/* Not Contributing */}
        <div style={{ backgroundColor: colors.backgroundSecondary, borderRadius: '16px', padding: '20px', border: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: colors.textSecondary, fontSize: '12px', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Not Contributing</p>
              <p style={{ color: colors.danger, fontSize: '24px', fontWeight: '700', margin: 0 }}>{negativeJobs.length}</p>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(220, 38, 38, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowDownRight size={20} color={colors.danger} />
            </div>
          </div>
          <p style={{ color: colors.danger, fontSize: '11px', margin: '10px 0 0 0' }}>{formatCurrency(totalNegative)}</p>
        </div>

        {/* Paid Out */}
        <div style={{ backgroundColor: colors.backgroundSecondary, borderRadius: '16px', padding: '20px', border: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: colors.textSecondary, fontSize: '12px', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Paid Out</p>
              <p style={{ color: colors.teal, fontSize: '24px', fontWeight: '700', margin: 0 }}>{formatCurrency(totalPaid)}</p>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(20, 184, 166, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={20} color={colors.teal} />
            </div>
          </div>
          <p style={{ color: colors.textSecondary, fontSize: '11px', margin: '10px 0 0 0' }}>Completed</p>
        </div>

        {/* Unpaid */}
        <div style={{ backgroundColor: colors.backgroundSecondary, borderRadius: '16px', padding: '20px', border: `1px solid ${colors.accent}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: colors.textSecondary, fontSize: '12px', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Unpaid</p>
              <p style={{ color: colors.accent, fontSize: '24px', fontWeight: '700', margin: 0 }}>{formatCurrency(totalUnpaid)}</p>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(201, 162, 39, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Circle size={20} color={colors.accent} />
            </div>
          </div>
          <p style={{ color: colors.accent, fontSize: '11px', margin: '10px 0 0 0' }}>Pending</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button onClick={() => setActiveTab('jobs')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: activeTab === 'jobs' ? colors.teal : colors.backgroundSecondary, border: `1px solid ${activeTab === 'jobs' ? colors.teal : colors.border}`, borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
          <Briefcase size={18} /> Jobs ({jobPools.length})
        </button>
        <button onClick={() => setActiveTab('employees')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: activeTab === 'employees' ? colors.teal : colors.backgroundSecondary, border: `1px solid ${activeTab === 'employees' ? colors.teal : colors.border}`, borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
          <Users size={18} /> Employee Breakdown ({employeeBonuses.length})
        </button>
      </div>

      {/* JOBS TAB */}
      {activeTab === 'jobs' && (
        <>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
              <Search size={18} color={colors.textSecondary} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" placeholder="Search by job name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '10px 12px 10px 40px', backgroundColor: colors.backgroundSecondary, border: `1px solid ${colors.border}`, borderRadius: '8px', color: colors.text, fontSize: '14px', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['all', 'positive', 'negative'] as const).map((type) => (
                <button key={type} onClick={() => setFilterType(type)} style={{ padding: '10px 16px', backgroundColor: filterType === type ? colors.teal : colors.backgroundSecondary, border: `1px solid ${filterType === type ? colors.teal : colors.border}`, borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {type === 'positive' && <ArrowUpRight size={16} />}
                  {type === 'negative' && <ArrowDownRight size={16} />}
                  {type === 'all' ? 'All Jobs' : type === 'positive' ? 'Contributing' : 'Not Contributing'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: colors.backgroundSecondary, borderRadius: '16px', border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 100px 120px 140px 50px', padding: '14px 16px', backgroundColor: colors.backgroundTertiary, borderBottom: `1px solid ${colors.border}`, fontSize: '12px', fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => handleSort('id')}># <SortIcon field="id" /></div>
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => handleSort('jobName')}>Job Name <SortIcon field="jobName" /></div>
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => handleSort('poolAmount')}>Pool <SortIcon field="poolAmount" /></div>
              <div>Foreman</div>
              <div>Crew</div>
              <div></div>
            </div>

            {filteredJobs.map((job) => {
              const foreman = job.employees.find(e => e.isForeman);
              const crew = job.employees.filter(e => !e.isForeman);
              
              return (
                <div key={job.id} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 100px 120px 140px 50px', padding: '14px 16px', borderBottom: `1px solid ${colors.border}`, fontSize: '14px', color: colors.text, alignItems: 'center' }}>
                  <div style={{ fontWeight: '500' }}>#{job.id}</div>
                  <div>
                    <p style={{ margin: 0, fontWeight: '500' }}>{job.jobName}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: colors.textSecondary }}>{job.jobType} • {job.sqft.toLocaleString()} sq ft</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: job.poolAmount > 0 ? colors.success : colors.danger, fontWeight: '600', fontSize: '13px' }}>
                    {job.poolAmount > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {formatCurrency(job.poolAmount)}
                  </div>
                  <div>
                    {foreman && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: colors.foreman, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '600', color: '#000' }}>
                          {foreman.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span style={{ fontSize: '12px', color: colors.text }}>{foreman.name.split(' ')[0]}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '-6px' }}>
                    {crew.slice(0, 3).map((emp, i) => (
                      <div key={emp.name} style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: colors.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '600', color: '#fff', border: `2px solid ${colors.backgroundSecondary}`, marginLeft: i > 0 ? '-6px' : 0 }}>
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                    {crew.length > 3 && (
                      <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: colors.backgroundTertiary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '600', color: colors.textSecondary, border: `2px solid ${colors.backgroundSecondary}`, marginLeft: '-6px' }}>
                        +{crew.length - 3}
                      </div>
                    )}
                  </div>
                  <div>
                    <button onClick={() => setSelectedJob(job)} style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: colors.backgroundTertiary, border: 'none', color: colors.textSecondary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Info size={16} />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredJobs.length === 0 && (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <Briefcase size={48} color={colors.textSecondary} style={{ opacity: 0.5, marginBottom: '16px' }} />
                <p style={{ color: colors.textSecondary, fontSize: '16px', margin: 0 }}>No jobs found</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* EMPLOYEE BREAKDOWN TAB */}
      {activeTab === 'employees' && (
        <div style={{ backgroundColor: colors.backgroundSecondary, borderRadius: '16px', border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 90px 70px 70px 100px 100px 40px', padding: '14px 16px', backgroundColor: colors.backgroundTertiary, borderBottom: `1px solid ${colors.border}`, fontSize: '11px', fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <div>Employee</div>
            <div>Base Multi</div>
            <div>Hours</div>
            <div>Foreman</div>
            <div>Unpaid</div>
            <div>Total</div>
            <div></div>
          </div>

          {employeeBonuses.map((emp, index) => (
            <div key={emp.name}>
              <div onClick={() => setExpandedEmployee(expandedEmployee === emp.name ? null : emp.name)} style={{ display: 'grid', gridTemplateColumns: '200px 90px 70px 70px 100px 100px 40px', padding: '14px 16px', borderBottom: `1px solid ${colors.border}`, fontSize: '14px', color: colors.text, alignItems: 'center', cursor: 'pointer', backgroundColor: expandedEmployee === emp.name ? colors.backgroundTertiary : 'transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {index < 3 && (
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#000' }}>{index + 1}</div>
                  )}
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: colors.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', color: '#fff' }}>{emp.initials}</div>
                  <div>
                    <p style={{ margin: 0, fontWeight: '500', fontSize: '13px' }}>{emp.name}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: colors.textSecondary }}>{emp.jobsWorked.length} jobs</p>
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: colors.success }}>{emp.avgMultiplier.toFixed(2)}x</span>
                </div>
                <div style={{ fontSize: '13px', color: colors.textSecondary, display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {emp.totalHours}h</div>
                <div>
                  {emp.foremanJobs > 0 ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', backgroundColor: 'rgba(245, 158, 11, 0.2)', borderRadius: '12px', fontSize: '11px', fontWeight: '600', color: colors.foreman }}>
                      <Star size={10} fill={colors.foreman} /> {emp.foremanJobs}
                    </span>
                  ) : (
                    <span style={{ fontSize: '12px', color: colors.textSecondary }}>—</span>
                  )}
                </div>
                <div style={{ fontWeight: '600', color: emp.unpaidBonus > 0 ? colors.accent : colors.textSecondary, fontSize: '13px' }}>
                  {emp.unpaidBonus > 0 ? formatCurrency(emp.unpaidBonus) : '—'}
                </div>
                <div style={{ fontWeight: '700', color: colors.teal, fontSize: '15px' }}>{formatCurrency(emp.totalBonus)}</div>
                <div><ChevronRight size={16} color={colors.textSecondary} style={{ transform: expandedEmployee === emp.name ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} /></div>
              </div>

              {expandedEmployee === emp.name && emp.jobsWorked.length > 0 && (
                <div style={{ backgroundColor: colors.background, padding: '16px 16px 16px 50px', borderBottom: `1px solid ${colors.border}` }}>
                  <p style={{ color: colors.textSecondary, fontSize: '11px', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Jobs Breakdown</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {emp.jobsWorked.map((job) => {
                      const paid = isPaid(emp.name, job.jobId);
                      return (
                        <div key={job.jobId} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 90px 90px', alignItems: 'center', padding: '10px 14px', backgroundColor: colors.backgroundSecondary, borderRadius: '8px', fontSize: '13px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Briefcase size={14} color={colors.textSecondary} />
                            <span style={{ color: colors.text }}>#{job.jobId} - {job.jobName}</span>
                            {job.isForeman && <ForemanBadge size="small" />}
                          </div>
                          <div style={{ color: colors.textSecondary }}>{job.hours}h</div>
                          <div style={{ color: job.isForeman ? colors.foreman : colors.success, fontWeight: '500' }}>
                            {job.effectiveMultiplier.toFixed(2)}x
                          </div>
                          <div style={{ color: colors.teal, fontWeight: '600' }}>{formatCurrency(job.earnedAmount)}</div>
                          <div>
                            <PaidStatus paid={paid} onClick={() => togglePaid(emp.name, job.jobId)} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: '16px', padding: '12px 14px', backgroundColor: colors.backgroundTertiary, borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: colors.textSecondary }}>Summary</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: colors.success }}>
                          Paid: {formatCurrency(emp.paidBonus)}
                        </p>
                        <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: colors.accent }}>
                          Unpaid: {formatCurrency(emp.unpaidBonus)}
                        </p>
                      </div>
                      <div style={{ padding: '8px 16px', backgroundColor: colors.teal, borderRadius: '8px', fontWeight: '700', fontSize: '16px', color: '#fff' }}>{formatCurrency(emp.totalBonus)}</div>
                    </div>
                  </div>
                </div>
              )}

              {expandedEmployee === emp.name && emp.jobsWorked.length === 0 && (
                <div style={{ backgroundColor: colors.background, padding: '20px 16px 20px 50px', borderBottom: `1px solid ${colors.border}`, color: colors.textSecondary, fontSize: '14px' }}>No contributing jobs this period</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Job Detail Modal */}
      {selectedJob && (
        <div onClick={() => setSelectedJob(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: colors.backgroundSecondary, borderRadius: '16px', width: '100%', maxWidth: '550px', overflow: 'hidden' }}>
            <div style={{ padding: '20px', backgroundColor: selectedJob.poolAmount > 0 ? colors.success : colors.danger, display: 'flex', alignItems: 'center', gap: '12px' }}>
              {selectedJob.poolAmount > 0 ? <CheckCircle size={28} color="#fff" /> : <XCircle size={28} color="#fff" />}
              <div>
                <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', margin: 0 }}>Job #{selectedJob.id} - {selectedJob.jobName}</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', margin: '2px 0 0 0' }}>{selectedJob.poolAmount > 0 ? 'Contributing to Pool' : 'Not Contributing'}</p>
              </div>
            </div>
            <div style={{ padding: '20px', maxHeight: '60vh', overflowY: 'auto' }}>
              {/* Pool Calculation */}
              <div style={{ backgroundColor: colors.background, borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                <p style={{ color: colors.textSecondary, fontSize: '11px', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pool Calculation</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: colors.textSecondary }}>Job Value</span>
                    <span style={{ color: colors.text }}>{formatCurrency(selectedJob.totalJobValue)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: colors.textSecondary }}>Materials</span>
                    <span style={{ color: colors.danger }}>-{formatCurrency(selectedJob.materials)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${colors.border}`, paddingTop: '8px' }}>
                    <span style={{ color: colors.textSecondary }}>Potential Pool (×0.3)</span>
                    <span style={{ color: colors.accent }}>{formatCurrency((selectedJob.totalJobValue - selectedJob.materials) * 0.3)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: colors.textSecondary }}>Labor Cost</span>
                    <span style={{ color: colors.danger }}>-{formatCurrency(selectedJob.actualLaborCost)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${colors.border}`, paddingTop: '8px' }}>
                    <span style={{ color: colors.text, fontWeight: '600' }}>Real Pool</span>
                    <span style={{ color: selectedJob.poolAmount > 0 ? colors.success : colors.danger, fontWeight: '700' }}>{formatCurrency(selectedJob.poolAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Employees */}
              <div>
                <p style={{ color: colors.textSecondary, fontSize: '11px', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Crew Assignment & Bonus Breakdown</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(() => {
                    // Calculate weighted hours for this job
                    let totalWeightedHours = 0;
                    const empDetails = selectedJob.employees.map(emp => {
                      const scores = employeeScores[emp.name] || { skillLevel: 1, jvs: 1, evs: 1 };
                      const baseMultiplier = (scores.skillLevel + scores.jvs + scores.evs) / 3;
                      const effectiveMultiplier = emp.isForeman ? baseMultiplier + 2 : baseMultiplier;
                      const weightedHours = emp.hours * effectiveMultiplier;
                      totalWeightedHours += weightedHours;
                      return { ...emp, scores, baseMultiplier, effectiveMultiplier, weightedHours };
                    });
                    
                    return empDetails.map(emp => {
                      const paid = isPaid(emp.name, selectedJob.id);
                      const shareOfPool = selectedJob.poolAmount > 0 
                        ? (emp.weightedHours / totalWeightedHours) * selectedJob.poolAmount 
                        : 0;
                      
                      return (
                        <div key={emp.name} style={{ backgroundColor: colors.background, borderRadius: '10px', padding: '14px', border: `1px solid ${colors.border}` }}>
                          {/* Header row */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: emp.isForeman ? colors.foreman : colors.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', color: emp.isForeman ? '#000' : '#fff' }}>
                                {emp.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ color: colors.text, fontSize: '15px', fontWeight: '600' }}>{emp.name}</span>
                                  {emp.isForeman && <ForemanBadge size="small" />}
                                </div>
                                <span style={{ fontSize: '12px', color: colors.textSecondary }}>{emp.hours}h @ ${emp.hourlyRate}/hr</span>
                              </div>
                            </div>
                            <PaidStatus paid={paid} onClick={() => togglePaid(emp.name, selectedJob.id)} />
                          </div>
                          
                          {/* Multiplier breakdown */}
                          <div style={{ backgroundColor: colors.backgroundTertiary, borderRadius: '8px', padding: '10px 12px', marginBottom: '10px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                              <div style={{ textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: '10px', color: colors.textSecondary, textTransform: 'uppercase' }}>Skill</p>
                                <p style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: '600', color: colors.teal }}>{emp.scores.skillLevel.toFixed(2)}x</p>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: '10px', color: colors.textSecondary, textTransform: 'uppercase' }}>JVS</p>
                                <p style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: '600', color: colors.accent }}>{emp.scores.jvs.toFixed(2)}x</p>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: '10px', color: colors.textSecondary, textTransform: 'uppercase' }}>EVS</p>
                                <p style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: '600', color: '#3B82F6' }}>{emp.scores.evs.toFixed(2)}x</p>
                              </div>
                            </div>
                            <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '11px', color: colors.textSecondary }}>
                                Base: ({emp.scores.skillLevel.toFixed(2)} + {emp.scores.jvs.toFixed(2)} + {emp.scores.evs.toFixed(2)}) ÷ 3 = {emp.baseMultiplier.toFixed(2)}x
                                {emp.isForeman && <span style={{ color: colors.foreman }}> + 2 (Foreman)</span>}
                              </span>
                              <span style={{ fontSize: '13px', fontWeight: '700', color: emp.isForeman ? colors.foreman : colors.success }}>
                                {emp.effectiveMultiplier.toFixed(2)}x
                              </span>
                            </div>
                          </div>
                          
                          {/* Calculation */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                            <div style={{ color: colors.textSecondary }}>
                              <span>{emp.hours}h × {emp.effectiveMultiplier.toFixed(2)}x = </span>
                              <span style={{ color: colors.text, fontWeight: '500' }}>{emp.weightedHours.toFixed(1)} weighted hrs</span>
                              <span> ({((emp.weightedHours / totalWeightedHours) * 100).toFixed(1)}% of total)</span>
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: '700', color: colors.teal }}>
                              {formatCurrency(shareOfPool)}
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
            <div style={{ padding: '16px 20px', borderTop: `1px solid ${colors.border}` }}>
              <button onClick={() => setSelectedJob(null)} style={{ width: '100%', padding: '12px', backgroundColor: colors.primary, border: 'none', borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
