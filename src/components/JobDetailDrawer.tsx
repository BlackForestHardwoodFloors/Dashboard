import React, { useState } from 'react';
import { 
  X, 
  User, 
  MapPin, 
  Calendar,
  FileText,
  Clock,
  Image,
  TrendingUp,
  MessageSquare,
  DollarSign
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  clientName: string;
  address: string;
  startDate: Date;
  endDate: Date;
  foreman: 'Chase' | 'Tony' | 'Alex' | 'Anthony' | 'Jerry';
  progress: number;
  p4pStatus: 'ahead' | 'on-track' | 'behind';
  jobType: 'Install' | 'Sand/Finish' | 'Recoat' | 'Repair' | 'Estimate';
}

const FOREMAN_COLORS = {
  Chase: '#9B59B6',
  Tony: '#6E8B3D',
  Alex: '#3B9CAA',
  Anthony: '#4F6A41',
  Jerry: '#E67E22'
};

export default function JobDetailDrawer({ 
  isOpen, 
  job, 
  onClose 
}: { 
  isOpen: boolean;
  job: Job | null;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !job) return null;

  const foremanColor = FOREMAN_COLORS[job.foreman];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'workorder', label: 'Work Order', icon: FileText },
    { id: 'timelogs', label: 'Time Logs', icon: Clock },
    { id: 'photos', label: 'Photos', icon: Image },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'p4p', label: 'P4P', icon: DollarSign },
    { id: 'communication', label: 'Communication', icon: MessageSquare }
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9998,
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '600px',
          maxWidth: '90vw',
          backgroundColor: '#2D2D2D',
          borderLeft: '1px solid #3D3D3D',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.4)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid #3D3D3D',
            backgroundColor: '#262626'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                {/* Foreman Avatar */}
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: foremanColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    border: '3px solid #2D2D2D'
                  }}
                >
                  {job.foreman.charAt(0)}
                </div>
                <div>
                  <h2 style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                    {job.title}
                  </h2>
                  <p style={{ color: '#A0A0A0', fontSize: '13px', margin: '2px 0 0 0' }}>
                    {job.foreman} • {job.jobType}
                  </p>
                </div>
              </div>

              {/* Client & Address */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A0A0A0', fontSize: '13px' }}>
                  <User size={14} />
                  <span>{job.clientName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A0A0A0', fontSize: '13px' }}>
                  <MapPin size={14} />
                  <span>{job.address}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A0A0A0', fontSize: '13px' }}>
                  <Calendar size={14} />
                  <span>
                    {job.startDate.toLocaleDateString()} - {job.endDate.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#A0A0A0',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#3D3D3D';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#A0A0A0';
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Status Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div
              style={{
                padding: '6px 12px',
                backgroundColor: foremanColor + '22',
                color: foremanColor,
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600'
              }}
            >
              Progress: {job.progress}%
            </div>
            <div
              style={{
                padding: '6px 12px',
                backgroundColor: job.p4pStatus === 'ahead' ? '#4CAF5022' : job.p4pStatus === 'on-track' ? '#FFC10722' : '#F4433622',
                color: job.p4pStatus === 'ahead' ? '#4CAF50' : job.p4pStatus === 'on-track' ? '#FFC107' : '#F44336',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}
            >
              P4P: {job.p4pStatus.replace('-', ' ')}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            padding: '12px 24px',
            backgroundColor: '#1A1A1A',
            borderBottom: '1px solid #3D3D3D',
            overflowX: 'auto'
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  backgroundColor: activeTab === tab.id ? '#3B9CAA' : 'transparent',
                  color: activeTab === tab.id ? '#FFFFFF' : '#A0A0A0',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = '#2D2D2D';
                    e.currentTarget.style.color = '#E0E0E0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#A0A0A0';
                  }
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px'
          }}
        >
          {activeTab === 'overview' && (
            <div>
              <h3 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                Job Overview
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ color: '#A0A0A0', fontSize: '12px', marginBottom: '4px' }}>Job Type</div>
                <div style={{ color: '#FFFFFF', fontSize: '14px' }}>{job.jobType}</div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ color: '#A0A0A0', fontSize: '12px', marginBottom: '4px' }}>Foreman</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: foremanColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    {job.foreman.charAt(0)}
                  </div>
                  <span style={{ color: '#FFFFFF', fontSize: '14px' }}>{job.foreman}</span>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ color: '#A0A0A0', fontSize: '12px', marginBottom: '8px' }}>Progress</div>
                <div style={{ 
                  width: '100%', 
                  height: '12px', 
                  backgroundColor: '#1A1A1A', 
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid #3D3D3D'
                }}>
                  <div
                    style={{
                      width: `${job.progress}%`,
                      height: '100%',
                      background: `linear-gradient(to right, ${foremanColor}, #4CAF50)`,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
                <div style={{ color: '#FFFFFF', fontSize: '14px', marginTop: '6px' }}>
                  {job.progress}% Complete
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ color: '#A0A0A0', fontSize: '12px', marginBottom: '4px' }}>P4P Status</div>
                <div style={{ 
                  color: job.p4pStatus === 'ahead' ? '#4CAF50' : job.p4pStatus === 'on-track' ? '#FFC107' : '#F44336',
                  fontSize: '14px',
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {job.p4pStatus.replace('-', ' ')}
                </div>
              </div>

              <div style={{
                padding: '16px',
                backgroundColor: '#1A1A1A',
                borderRadius: '10px',
                border: '1px solid #3D3D3D'
              }}>
                <div style={{ color: '#A0A0A0', fontSize: '12px', marginBottom: '8px' }}>Job Summary</div>
                <p style={{ color: '#E0E0E0', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                  This is a {job.jobType.toLowerCase()} job for {job.clientName}. The project is currently {job.progress}% complete 
                  and is {job.p4pStatus.replace('-', ' ')} on the P4P schedule.
                </p>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#A0A0A0'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <h3 style={{ color: '#E0E0E0', fontSize: '16px', marginBottom: '8px' }}>
                {tabs.find(t => t.id === activeTab)?.label}
              </h3>
              <p style={{ fontSize: '13px' }}>
                This tab content is coming soon
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { 
            transform: translateX(100%);
            opacity: 0;
          }
          to { 
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
