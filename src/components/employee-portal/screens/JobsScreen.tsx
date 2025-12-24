import React, { useState } from 'react';
import { 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  Phone, 
  Camera,
  ChevronRight,
  Clock,
  Users,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import type { Job, Employee } from '../EmployeePortal';

interface JobsScreenProps {
  employee: Employee;
  jobs: Job[];
  onOpenJob: (jobId: string) => void;
  onOpenCamera: (jobId?: string) => void;
}

export function JobsScreen({ employee, jobs, onOpenJob, onOpenCamera }: JobsScreenProps) {
  const { colors } = useTheme();
  
  // Get today's date
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  // Group jobs by date (simplified - in production, parse scheduledDate properly)
  const todayJobs = jobs.filter(j => j.status === 'In Progress');
  const upcomingJobs = jobs.filter(j => j.status === 'Scheduled');
  const totalJobs = jobs.length;

  // Quick action tiles
  const quickActions = [
    { 
      id: 'calendar', 
      label: 'Calendar', 
      icon: Calendar, 
      color: '#4F6A41',
      bgColor: 'rgba(79, 106, 65, 0.9)'
    },
    { 
      id: 'p4p', 
      label: 'P4P', 
      icon: DollarSign, 
      color: '#D4A024',
      bgColor: 'rgba(212, 160, 36, 0.9)'
    },
    { 
      id: 'growth', 
      label: 'Growth', 
      icon: TrendingUp, 
      color: '#0F7BFF',
      bgColor: 'rgba(15, 123, 255, 0.9)'
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      paddingBottom: '100px'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        paddingTop: 'max(20px, env(safe-area-inset-top))'
      }}>
        {/* Welcome */}
        <h1 style={{
          color: colors.text,
          fontSize: '28px',
          fontWeight: '700',
          margin: '0 0 4px 0'
        }}>
          Welcome back, {employee.firstName}
        </h1>
        <p style={{
          color: '#D4A024',
          fontSize: '15px',
          fontWeight: '500',
          margin: '0 0 20px 0'
        }}>
          {dateString}
        </p>

        {/* Quick Action Tiles */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '24px'
        }}>
          {quickActions.map(action => (
            <button
              key={action.id}
              onClick={() => console.log(`Open ${action.id}`)}
              style={{
                padding: '20px 12px',
                backgroundColor: action.bgColor,
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.2s, opacity 0.2s'
              }}
            >
              <action.icon size={28} color="#FFFFFF" />
              <span style={{
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Your Week Section */}
      <div style={{ padding: '0 20px' }}>
        <h2 style={{
          color: colors.text,
          fontSize: '22px',
          fontWeight: '700',
          margin: '0 0 16px 0'
        }}>
          Your Week ({totalJobs} Jobs)
        </h2>

        {/* Today's Jobs */}
        {todayJobs.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#D4A024', fontSize: '16px', fontWeight: '600' }}>
                  Today
                </span>
                <span style={{
                  padding: '4px 10px',
                  backgroundColor: '#D4A024',
                  borderRadius: '12px',
                  color: '#000',
                  fontSize: '11px',
                  fontWeight: '700'
                }}>
                  IN PROGRESS
                </span>
              </div>
              <span style={{ color: colors.textSecondary, fontSize: '13px' }}>
                {todayJobs.length} job{todayJobs.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div style={{
              height: '3px',
              backgroundColor: '#D4A024',
              borderRadius: '2px',
              marginBottom: '16px'
            }} />

            {todayJobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                onOpen={() => onOpenJob(job.id)}
                onCamera={() => onOpenCamera(job.id)}
                colors={colors}
              />
            ))}
          </div>
        )}

        {/* Upcoming Jobs */}
        {upcomingJobs.length > 0 && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <span style={{ color: colors.textSecondary, fontSize: '16px', fontWeight: '600' }}>
                Upcoming
              </span>
              <span style={{ color: colors.textSecondary, fontSize: '13px' }}>
                {upcomingJobs.length} job{upcomingJobs.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div style={{
              height: '2px',
              backgroundColor: colors.border,
              borderRadius: '1px',
              marginBottom: '16px'
            }} />

            {upcomingJobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                onOpen={() => onOpenJob(job.id)}
                onCamera={() => onOpenCamera(job.id)}
                colors={colors}
                isUpcoming
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {jobs.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px'
          }}>
            <Calendar size={48} color={colors.textTertiary} style={{ marginBottom: '16px' }} />
            <p style={{ color: colors.textSecondary, fontSize: '16px' }}>
              No jobs scheduled this week
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Job Card Component
interface JobCardProps {
  job: Job;
  onOpen: () => void;
  onCamera: () => void;
  colors: any;
  isUpcoming?: boolean;
}

function JobCard({ job, onOpen, onCamera, colors, isUpcoming }: JobCardProps) {
  const statusColor = job.status === 'In Progress' ? '#4F6A41' : colors.textTertiary;
  
  return (
    <div
      onClick={onOpen}
      style={{
        backgroundColor: colors.backgroundSecondary,
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '12px',
        border: `2px solid ${job.status === 'In Progress' ? '#4F6A41' : colors.border}`,
        cursor: 'pointer',
        transition: 'transform 0.2s, border-color 0.2s'
      }}
    >
      {/* Header Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '8px'
      }}>
        <div>
          <h3 style={{
            color: colors.text,
            fontSize: '18px',
            fontWeight: '700',
            margin: '0 0 4px 0'
          }}>
            {job.clientName}
          </h3>
          <p style={{
            color: colors.textSecondary,
            fontSize: '14px',
            margin: 0
          }}>
            {job.jobType} • {job.sqft.toLocaleString()} sq ft
          </p>
        </div>
        
        {/* Camera Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCamera();
          }}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: colors.accent,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <Camera size={24} color="#FFFFFF" />
          {job.photoCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              minWidth: '20px',
              height: '20px',
              borderRadius: '10px',
              backgroundColor: '#E74C3C',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {job.photoCount}
            </span>
          )}
        </button>
      </div>

      {/* Address */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 12px',
        backgroundColor: colors.backgroundTertiary,
        borderRadius: '10px',
        marginBottom: '12px'
      }}>
        <MapPin size={16} color={colors.accent} />
        <span style={{
          color: colors.text,
          fontSize: '13px',
          flex: 1
        }}>
          {job.address}
        </span>
      </div>

      {/* Time Info (for upcoming) */}
      {isUpcoming && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color={colors.textSecondary} />
            <span style={{ color: colors.textSecondary, fontSize: '13px' }}>
              {job.scheduledDate}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} color={colors.textSecondary} />
            <span style={{ color: colors.textSecondary, fontSize: '13px' }}>
              {job.startTime}
            </span>
          </div>
        </div>
      )}

      {/* Progress Bar (for in-progress) */}
      {job.status === 'In Progress' && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '6px'
          }}>
            <span style={{ color: colors.textSecondary, fontSize: '12px' }}>
              Progress
            </span>
            <span style={{ color: statusColor, fontSize: '12px', fontWeight: '700' }}>
              {job.progress}%
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: colors.backgroundTertiary,
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${job.progress}%`,
              height: '100%',
              backgroundColor: statusColor,
              borderRadius: '4px',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      )}

      {/* Tap to view hint */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '4px',
        marginTop: '12px'
      }}>
        <span style={{ color: colors.textTertiary, fontSize: '12px' }}>
          Tap for details
        </span>
        <ChevronRight size={14} color={colors.textTertiary} />
      </div>
    </div>
  );
}
