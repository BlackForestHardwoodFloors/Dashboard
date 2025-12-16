/**
 * Contracts Page - Boardroom 360
 * 
 * Displays and manages contracts with filtering by status
 */

import { useState } from 'react';
import { 
  Search, 
  Plus,
  FileSignature,
  Send,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  User,
  Eye,
  Edit,
  Download,
  MoreVertical
} from 'lucide-react';
import { SidebarEnhanced } from './SidebarEnhanced';

interface Contract {
  id: string;
  contractNumber: string;
  clientName: string;
  projectName: string;
  amount: number;
  status: 'draft' | 'sent' | 'signed';
  createdDate: string;
  signedDate: string | null;
}

interface ContractsPageProps {
  onNavigate?: (page: string) => void;
}

export default function ContractsPage({ onNavigate }: ContractsPageProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const bgColor = darkMode ? '#1E1E1E' : '#F5F5F5';
  const cardBg = darkMode ? '#2D2D2D' : '#FFFFFF';
  const textColor = darkMode ? '#FFFFFF' : '#1E1E1E';
  const textMuted = darkMode ? '#A0A0A0' : '#666666';
  const borderColor = darkMode ? '#3D3D3D' : '#E5E5E5';
  const accentColor = '#D4A024';

  const contracts: Contract[] = [
    { id: '1', contractNumber: 'CT-2024-001', clientName: 'Anderson Residence', projectName: 'Living Room Hardwood', amount: 12500, status: 'signed', createdDate: '2024-11-01', signedDate: '2024-11-05' },
    { id: '2', contractNumber: 'CT-2024-002', clientName: 'Thompson Commercial', projectName: 'Office Renovation', amount: 45000, status: 'sent', createdDate: '2024-11-10', signedDate: null },
    { id: '3', contractNumber: 'CT-2024-003', clientName: 'Martinez Family', projectName: 'Kitchen Flooring', amount: 8900, status: 'signed', createdDate: '2024-10-28', signedDate: '2024-10-30' },
    { id: '4', contractNumber: 'CT-2024-004', clientName: 'Wilson Properties', projectName: 'Multi-Unit Project', amount: 78500, status: 'draft', createdDate: '2024-11-14', signedDate: null },
  ];

  const getStatusColor = (status: Contract['status']) => {
    switch (status) {
      case 'draft': return '#9E9E9E';
      case 'sent': return '#42A5F5';
      case 'signed': return '#66BB6A';
      default: return textMuted;
    }
  };

  const filteredContracts = contracts.filter(contract => {
    if (statusFilter !== 'all' && contract.status !== statusFilter) return false;
    if (searchQuery && 
        !contract.clientName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !contract.contractNumber.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: bgColor }}>
      <SidebarEnhanced 
        activePage="Contracts" 
        darkMode={darkMode} 
        onNavigate={onNavigate}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      <div style={{ marginLeft: '200px', flex: 1, padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', color: textColor, margin: '0 0 8px 0' }}>Contracts</h1>
            <p style={{ fontSize: '14px', color: textMuted, margin: 0 }}>Manage project contracts and agreements</p>
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
            backgroundColor: accentColor, border: 'none', borderRadius: '10px',
            cursor: 'pointer', fontWeight: '600', fontSize: '14px', color: '#FFFFFF'
          }}>
            <Plus style={{ width: '18px', height: '18px' }} />
            New Contract
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Contracts', value: contracts.length, icon: FileSignature, color: accentColor },
            { label: 'Draft', value: contracts.filter(c => c.status === 'draft').length, icon: Clock, color: '#9E9E9E' },
            { label: 'Sent', value: contracts.filter(c => c.status === 'sent').length, icon: Send, color: '#42A5F5' },
            { label: 'Signed', value: contracts.filter(c => c.status === 'signed').length, icon: CheckCircle, color: '#66BB6A' }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} style={{
                backgroundColor: cardBg, borderRadius: '12px', border: `1px solid ${borderColor}`,
                padding: '20px', display: 'flex', alignItems: 'center', gap: '16px'
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  backgroundColor: `${stat.color}20`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon style={{ width: '24px', height: '24px', color: stat.color }} />
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: textMuted, margin: '0 0 4px 0' }}>{stat.label}</p>
                  <p style={{ fontSize: '24px', fontWeight: '700', color: textColor, margin: 0 }}>{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters & Search */}
        <div style={{
          backgroundColor: cardBg, borderRadius: '12px', border: `1px solid ${borderColor}`,
          padding: '16px', marginBottom: '16px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'draft', 'sent', 'signed'].map(status => (
              <button key={status} onClick={() => setStatusFilter(status)} style={{
                padding: '8px 16px', borderRadius: '8px', border: 'none',
                backgroundColor: statusFilter === status ? accentColor : (darkMode ? '#3D3D3D' : '#F5F5F5'),
                color: statusFilter === status ? '#FFFFFF' : textMuted,
                fontSize: '13px', fontWeight: '500', cursor: 'pointer', textTransform: 'capitalize'
              }}>
                {status}
              </button>
            ))}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
            borderRadius: '8px', padding: '8px 12px', width: '280px'
          }}>
            <Search style={{ width: '18px', height: '18px', color: textMuted }} />
            <input type="text" placeholder="Search contracts..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, backgroundColor: 'transparent', border: 'none',
                outline: 'none', color: textColor, fontSize: '14px' }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ backgroundColor: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}`, overflow: 'hidden' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '120px 1fr 1fr 140px 120px 120px 80px',
            padding: '16px 20px', backgroundColor: darkMode ? '#252525' : '#FAFAFA',
            borderBottom: `1px solid ${borderColor}`, gap: '16px'
          }}>
            {['Contract #', 'Client', 'Project', 'Amount', 'Status', 'Date', 'Actions'].map(header => (
              <span key={header} style={{ fontSize: '12px', fontWeight: '600', color: textMuted, textTransform: 'uppercase' }}>
                {header}
              </span>
            ))}
          </div>
          {filteredContracts.map((contract, index) => (
            <div key={contract.id} style={{
              display: 'grid', gridTemplateColumns: '120px 1fr 1fr 140px 120px 120px 80px',
              padding: '16px 20px', borderBottom: index < filteredContracts.length - 1 ? `1px solid ${borderColor}` : 'none',
              alignItems: 'center', gap: '16px'
            }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: accentColor }}>{contract.contractNumber}</span>
              <span style={{ fontSize: '14px', color: textColor }}>{contract.clientName}</span>
              <span style={{ fontSize: '13px', color: textMuted }}>{contract.projectName}</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#66BB6A' }}>${contract.amount.toLocaleString()}</span>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px',
                backgroundColor: `${getStatusColor(contract.status)}20`, borderRadius: '20px', width: 'fit-content'
              }}>
                <span style={{ fontSize: '12px', fontWeight: '500', color: getStatusColor(contract.status), textTransform: 'capitalize' }}>
                  {contract.status}
                </span>
              </div>
              <span style={{ fontSize: '13px', color: textMuted }}>{new Date(contract.createdDate).toLocaleDateString()}</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button style={{ padding: '6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <Eye style={{ width: '16px', height: '16px', color: textMuted }} />
                </button>
                <button style={{ padding: '6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <Download style={{ width: '16px', height: '16px', color: textMuted }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
