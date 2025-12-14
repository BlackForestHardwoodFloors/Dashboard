import React from 'react';

type CalendarView = '1-week' | '2-week' | '3-week' | '1-month';

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

const P4P_COLORS = {
  ahead: '#4CAF50',
  'on-track': '#FFC107',
  behind: '#F44336'
};

export default function CalendarJobCard({ 
  job, 
  view, 
  onClick 
}: { 
  job: Job;
  view: CalendarView;
  onClick: () => void;
}) {
  const foremanColor = FOREMAN_COLORS[job.foreman];
  const p4pColor = P4P_COLORS[job.p4pStatus];
  const isCompact = view === '1-month' || view === '3-week';

  // Calculate avatar position based on progress
  const avatarPosition = `${job.progress}%`;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{
        position: 'relative',
        backgroundColor: '#262626',
        border: '1px solid #3D3D3D',
        borderRadius: isCompact ? '8px' : '12px',
        padding: isCompact ? '6px' : '10px',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'all 0.2s',
        minHeight: isCompact ? '50px' : '70px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 4px 12px ${foremanColor}33`;
        e.currentTarget.style.borderColor = foremanColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#3D3D3D';
      }}
    >
      {/* Left Foreman Color Strip with Fade */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: isCompact ? '4px' : '6px',
          background: `linear-gradient(to right, ${foremanColor} 0%, ${foremanColor}88 50%, transparent 100%)`,
          zIndex: 1
        }}
      />

      {/* Top Progress Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: isCompact ? '3px' : '4px',
          background: `linear-gradient(to right, ${foremanColor} 0%, ${foremanColor} ${job.progress}%, #2D2D2D ${job.progress}%, #2D2D2D 100%)`,
          zIndex: 2
        }}
      >
        {/* Foreman Avatar on Progress Bar */}
        {!isCompact && (
          <div
            style={{
              position: 'absolute',
              top: '-6px',
              left: avatarPosition,
              transform: 'translateX(-50%)',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: foremanColor,
              border: '2px solid #262626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              transition: 'left 0.3s ease',
              zIndex: 3
            }}
          >
            {job.foreman.charAt(0)}
          </div>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          paddingLeft: isCompact ? '8px' : '12px',
          paddingTop: isCompact ? '6px' : '12px',
          paddingBottom: isCompact ? '6px' : '8px'
        }}
      >
        {/* Job Title */}
        <div
          style={{
            color: '#FFFFFF',
            fontSize: isCompact ? '11px' : '13px',
            fontWeight: '600',
            marginBottom: isCompact ? '2px' : '4px',
            lineHeight: '1.3',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: isCompact ? 'nowrap' : 'normal',
            display: '-webkit-box',
            WebkitLineClamp: isCompact ? 1 : 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {job.title}
        </div>

        {/* Client Name (only show in larger views) */}
        {!isCompact && (
          <div
            style={{
              color: '#A0A0A0',
              fontSize: '11px',
              marginBottom: '2px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {job.clientName}
          </div>
        )}

        {/* Foreman Badge (only in compact views) */}
        {isCompact && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 6px',
              backgroundColor: foremanColor + '22',
              borderRadius: '4px',
              fontSize: '9px',
              fontWeight: '600',
              color: foremanColor
            }}
          >
            {job.foreman}
          </div>
        )}
      </div>

      {/* Bottom P4P Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: isCompact ? '3px' : '4px',
          backgroundColor: p4pColor,
          zIndex: 1
        }}
      />
    </div>
  );
}
