/**
 * Quotes Page - Boardroom 360
 * 
 * Displays and manages quotes with filtering by status
 */

import { useState } from 'react';
import { 
  Search, 
  Plus,
  Filter,
  MoreVertical,
  FileText,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Calendar,
  User,
  Building,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';
import { SidebarEnhanced } from './SidebarEnhanced';

interface Quote {
  id: string;
  quoteNumber: string;
  clientName: string;
  projectName: string;
  amount: number;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected';
  createdDate: string;
  expiryDate: string;
  items: number;
}

interface QuotesPageProps {
  onNavigate?: (page: string) => void;
}

export default function QuotesPage({ onNavigate }: QuotesPageProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false);

  const bgColor = darkMode ? '#1E1E1E' : '#F5F5F5';
  const cardBg = darkMode ? '#2D2D2D' : '#FFFFFF';
  const textColor = darkMode ? '#FFFFFF' : '#1E1E1E';
  const textMuted = darkMode ? '#A0A0A0' : '#666666';
  const borderColor = darkMode ? '#3D3D3D' : '#E5E5E5';
  const accentColor = '#D4A024';

  // Mock quotes data
  const quotes: Quote[] = [
    {
      id: '1',
      quoteNumber: 'QT-2024-001',
      clientName: 'Anderson Residence',
      projectName: 'Living Room Hardwood Installation',
      amount: 12500,
      status: 'accepted',
      createdDate: '2024-11-10',
      expiryDate: '2024-12-10',
      items: 5
    },
    {
      id: '2',
      quoteNumber: 'QT-2024-002',
      clientName: 'Thompson Commercial',
      projectName: 'Office Floor Renovation',
      amount: 45000,
      status: 'sent',
      createdDate: '2024-11-12',
      expiryDate: '2024-12-12',
      items: 8
    },
    {
      id: '3',
      quoteNumber: 'QT-2024-003',
      clientName: 'Martinez Family',
      projectName: 'Kitchen & Dining Flooring',
      amount: 8900,
      status: 'viewed',
      createdDate: '2024-11-14',
      expiryDate: '2024-12-14',
      items: 3
    },
    {
      id: '4',
      quoteNumber: 'QT-2024-004',
      clientName: 'Wilson Properties',
      projectName: 'Multi-Unit Flooring Project',
      amount: 78500,
      status: 'draft',
      createdDate: '2024-11-15',
      expiryDate: '2024-12-15',
      items: 12
    },
    {
      id: '5',
      quoteNumber: 'QT-2024-005',
      clientName: 'Garcia Restaurant',
      projectName: 'Commercial Floor Replacement',
      amount: 23000,
      status: 'rejected',
      createdDate: '2024-11-08',
      expiryDate: '2024-12-08',
      items: 6
    }
  ];

  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'draft': return '#9E9E9E';
      case 'sent': return '#42A5F5';
      case 'viewed': return '#9C27B0';
      case 'accepted': return '#66BB6A';
      case 'rejected': return '#EF5350';
      default: return textMuted;
    }
  };

  const getStatusIcon = (status: Quote['status']) => {
    switch (status) {
      case 'draft': return Clock;
      case 'sent': return Send;
      case 'viewed': return Eye;
      case 'accepted': return CheckCircle;
      case 'rejected': return XCircle;
      default: return FileText;
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    if (statusFilter !== 'all' && quote.status !== statusFilter) return false;
    if (searchQuery && 
        !quote.clientName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !quote.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !quote.projectName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: quotes.length,
    draft: quotes.filter(q => q.status === 'draft').length,
    sent: quotes.filter(q => q.status === 'sent').length,
    accepted: quotes.filter(q => q.status === 'accepted').length,
    rejected: quotes.filter(q => q.status === 'rejected').length,
    totalValue: quotes.reduce((sum, q) => sum + q.amount, 0)
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: bgColor }}>
      {/* Sidebar */}
      <SidebarEnhanced 
        activePage="Quotes" 
        darkMode={darkMode} 
        onNavigate={onNavigate}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Main Content */}
      <div style={{ marginLeft: '220px', flex: 1, padding: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', color: textColor, margin: '0 0 8px 0' }}>
              Quotes
            </h1>
            <p style={{ fontSize: '14px', color: textMuted, margin: 0 }}>
              Create and manage project quotes
            </p>
          </div>
          <button
            onClick={() => setShowNewQuoteModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: accentColor,
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              color: '#FFFFFF'
            }}
          >
            <Plus style={{ width: '18px', height: '18px' }} />
            New Quote
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)', 
          gap: '16px',
          marginBottom: '24px'
        }}>
          {[
            { label: 'Total Quotes', value: stats.total, icon: FileText, color: accentColor },
            { label: 'Draft', value: stats.draft, icon: Clock, color: '#9E9E9E' },
            { label: 'Sent', value: stats.sent, icon: Send, color: '#42A5F5' },
            { label: 'Accepted', value: stats.accepted, icon: CheckCircle, color: '#66BB6A' },
            { label: 'Rejected', value: stats.rejected, icon: XCircle, color: '#EF5350' }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                style={{
                  backgroundColor: cardBg,
                  borderRadius: '12px',
                  border: `1px solid ${borderColor}`,
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: `${stat.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon style={{ width: '24px', height: '24px', color: stat.color }} />
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: textMuted, margin: '0 0 4px 0' }}>
                    {stat.label}
                  </p>
                  <p style={{ fontSize: '24px', fontWeight: '700', color: textColor, margin: 0 }}>
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div style={{
          backgroundColor: cardBg,
          borderRadius: '12px',
          border: `1px solid ${borderColor}`,
          padding: '16px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'draft', 'sent', 'viewed', 'accepted', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: statusFilter === status ? accentColor : (darkMode ? '#3D3D3D' : '#F5F5F5'),
                  color: statusFilter === status ? '#FFFFFF' : textMuted,
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {status}
              </button>
            ))}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
            borderRadius: '8px',
            padding: '8px 12px',
            width: '280px'
          }}>
            <Search style={{ width: '18px', height: '18px', color: textMuted }} />
            <input
              type="text"
              placeholder="Search quotes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: textColor,
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        {/* Quotes Table */}
        <div style={{
          backgroundColor: cardBg,
          borderRadius: '16px',
          border: `1px solid ${borderColor}`,
          overflow: 'hidden'
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr 1fr 140px 120px 100px 80px',
            padding: '16px 20px',
            backgroundColor: darkMode ? '#252525' : '#FAFAFA',
            borderBottom: `1px solid ${borderColor}`,
            gap: '16px'
          }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: textMuted, textTransform: 'uppercase' }}>Quote #</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: textMuted, textTransform: 'uppercase' }}>Client</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: textMuted, textTransform: 'uppercase' }}>Project</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: textMuted, textTransform: 'uppercase' }}>Amount</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: textMuted, textTransform: 'uppercase' }}>Status</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: textMuted, textTransform: 'uppercase' }}>Expiry</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: textMuted, textTransform: 'uppercase' }}>Actions</span>
          </div>

          {/* Table Rows */}
          {filteredQuotes.map((quote, index) => {
            const StatusIcon = getStatusIcon(quote.status);
            return (
              <div
                key={quote.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 1fr 140px 120px 100px 80px',
                  padding: '16px 20px',
                  borderBottom: index < filteredQuotes.length - 1 ? `1px solid ${borderColor}` : 'none',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#353535' : '#F9F9F9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span style={{ fontSize: '14px', fontWeight: '600', color: accentColor }}>
                  {quote.quoteNumber}
                </span>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: textColor, margin: 0 }}>
                    {quote.clientName}
                  </p>
                </div>
                <p style={{ fontSize: '13px', color: textMuted, margin: 0 }}>
                  {quote.projectName}
                </p>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#66BB6A' }}>
                  ${quote.amount.toLocaleString()}
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  backgroundColor: `${getStatusColor(quote.status)}20`,
                  borderRadius: '20px',
                  width: 'fit-content'
                }}>
                  <StatusIcon style={{ width: '12px', height: '12px', color: getStatusColor(quote.status) }} />
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: '500', 
                    color: getStatusColor(quote.status),
                    textTransform: 'capitalize'
                  }}>
                    {quote.status}
                  </span>
                </div>
                <span style={{ fontSize: '13px', color: textMuted }}>
                  {new Date(quote.expiryDate).toLocaleDateString()}
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button style={{
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '6px'
                  }}>
                    <Eye style={{ width: '16px', height: '16px', color: textMuted }} />
                  </button>
                  <button style={{
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '6px'
                  }}>
                    <Edit style={{ width: '16px', height: '16px', color: textMuted }} />
                  </button>
                  <button style={{
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '6px'
                  }}>
                    <MoreVertical style={{ width: '16px', height: '16px', color: textMuted }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
