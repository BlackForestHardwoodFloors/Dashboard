/**
 * Work Orders Page - Boardroom 360
 */

import { useState } from 'react';
import { Search, Plus, Briefcase, Clock, CheckCircle, User, Calendar, MoreVertical } from 'lucide-react';
import { SidebarEnhanced } from './SidebarEnhanced';

interface WorkOrder {
  id: string;
  orderNumber: string;
  title: string;
  jobName: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
}

export default function WorkOrdersPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const bgColor = darkMode ? '#1E1E1E' : '#F5F5F5';
  const cardBg = darkMode ? '#2D2D2D' : '#FFFFFF';
  const textColor = darkMode ? '#FFFFFF' : '#1E1E1E';
  const textMuted = darkMode ? '#A0A0A0' : '#666666';
  const borderColor = darkMode ? '#3D3D3D' : '#E5E5E5';
  const accentColor = '#D4A024';

  const workOrders: WorkOrder[] = [
    { id: '1', orderNumber: 'WO-001', title: 'Sand and refinish living room', jobName: 'Anderson Residence', assignedTo: 'Mike Thompson', priority: 'high', status: 'in-progress', dueDate: '2024-11-18' },
    { id: '2', orderNumber: 'WO-002', title: 'Install baseboards', jobName: 'Anderson Residence', assignedTo: 'John Davis', priority: 'medium', status: 'pending', dueDate: '2024-11-20' },
    { id: '3', orderNumber: 'WO-003', title: 'Floor preparation', jobName: 'Thompson Commercial', assignedTo: 'Sarah Wilson', priority: 'urgent', status: 'pending', dueDate: '2024-11-16' },
    { id: '4', orderNumber: 'WO-004', title: 'Apply finish coat', jobName: 'Martinez Family', assignedTo: 'Tom Brown', priority: 'low', status: 'completed', dueDate: '2024-11-10' },
  ];

  const getPriorityColor = (p: string) => ({ low: '#66BB6A', medium: '#42A5F5', high: '#FF9800', urgent: '#EF5350' }[p] || textMuted);
  const getStatusColor = (s: string) => ({ pending: '#9E9E9E', 'in-progress': '#FF9800', completed: '#66BB6A' }[s] || textMuted);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: bgColor }}>
      <SidebarEnhanced activePage="WorkOrders" darkMode={darkMode} onNavigate={onNavigate} onToggleDarkMode={() => setDarkMode(!darkMode)} />
      <div style={{ marginLeft: '220px', flex: 1, padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', color: textColor, margin: '0 0 8px 0' }}>Work Orders</h1>
            <p style={{ fontSize: '14px', color: textMuted, margin: 0 }}>Manage and track work orders</p>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: accentColor, border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', color: '#FFFFFF' }}>
            <Plus style={{ width: '18px', height: '18px' }} /> New Work Order
          </button>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          {workOrders.map(wo => (
            <div key={wo.id} style={{ backgroundColor: cardBg, borderRadius: '12px', border: `1px solid ${borderColor}`, padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${getPriorityColor(wo.priority)}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase style={{ width: '24px', height: '24px', color: getPriorityColor(wo.priority) }} />
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: accentColor, margin: '0 0 4px 0', fontWeight: '600' }}>{wo.orderNumber}</p>
                  <h3 style={{ fontSize: '16px', color: textColor, margin: '0 0 4px 0' }}>{wo.title}</h3>
                  <p style={{ fontSize: '13px', color: textMuted, margin: 0 }}>{wo.jobName}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User style={{ width: '14px', height: '14px', color: textMuted }} />
                  <span style={{ fontSize: '13px', color: textMuted }}>{wo.assignedTo}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar style={{ width: '14px', height: '14px', color: textMuted }} />
                  <span style={{ fontSize: '13px', color: textMuted }}>{new Date(wo.dueDate).toLocaleDateString()}</span>
                </div>
                <div style={{ padding: '4px 12px', backgroundColor: `${getStatusColor(wo.status)}20`, borderRadius: '20px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: getStatusColor(wo.status), textTransform: 'capitalize' }}>{wo.status.replace('-', ' ')}</span>
                </div>
                <button style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <MoreVertical style={{ width: '18px', height: '18px', color: textMuted }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
