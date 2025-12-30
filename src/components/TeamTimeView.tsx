import React, { useState, useEffect } from 'react';

interface SharedPhoto {
  url: string;
  notes: string;
}

interface TeamEntry {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  jobName: string;
  workProgress: string[];
  startTime: string;
  endTime: string;
  hours: number;
  notes?: string;
  sharedPhotos?: SharedPhoto[];
  timestamp: string;
}

interface JobTotal {
  job: string;
  entries: TeamEntry[];
  totalHours: number;
  employeeCount: number;
}

export default function TeamTimeView() {
  const [viewMode, setViewMode] = useState<'feed' | 'job'>('feed');
  const [dateFilter, setDateFilter] = useState<'today' | 'week'>('today');
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [teamEntries, setTeamEntries] = useState<TeamEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const darkMode = true;
  const accentColor = '#D4A024';
  const cardBg = darkMode ? '#2D2D2D' : '#FFFFFF';
  const textColor = darkMode ? '#FFFFFF' : '#1E1E1E';
  const textMuted = darkMode ? '#A0A0A0' : '#666666';
  const borderColor = darkMode ? '#3D3D3D' : '#E5E5E5';
  const bgColor = darkMode ? '#1E1E1E' : '#F5F5F5';

  // Fetch team entries from API
  useEffect(() => {
    const fetchTeamEntries = async () => {
      try {
        setLoading(true);
        // In real app, fetch from your API
        // const response = await fetch('http://35.92.33.215:3001/api/time-entries/team');
        // const data = await response.json();
        // setTeamEntries(data);
        
        // Sample data for now
        setTeamEntries([
          {
            id: '1',
            date: new Date().toISOString().split('T')[0],
            employeeId: 'emp1',
            employeeName: 'Mike Johnson',
            jobName: 'Glover Mansion',
            workProgress: ['Sanding started', 'Sanding completed'],
            startTime: '07:00',
            endTime: '14:00',
            hours: 6.5,
            notes: 'Finished main floor',
            sharedPhotos: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', notes: 'Main floor complete' }],
            timestamp: new Date(Date.now() - 2 * 60000).toISOString()
          },
          {
            id: '2',
            date: new Date().toISOString().split('T')[0],
            employeeId: 'emp2',
            employeeName: 'Sarah Williams',
            jobName: 'Johnson Residence',
            workProgress: ['Final Coat'],
            startTime: '07:30',
            endTime: '12:00',
            hours: 4.5,
            timestamp: new Date(Date.now() - 15 * 60000).toISOString()
          },
          {
            id: '3',
            date: new Date().toISOString().split('T')[0],
            employeeId: 'emp3',
            employeeName: 'Carlos Rodriguez',
            jobName: 'Glover Mansion',
            workProgress: ['Installation', 'Installation completed'],
            startTime: '06:00',
            endTime: '14:30',
            hours: 8.0,
            notes: 'Kitchen and hallway done',
            timestamp: new Date(Date.now() - 35 * 60000).toISOString()
          },
          {
            id: '4',
            date: new Date().toISOString().split('T')[0],
            employeeId: 'emp4',
            employeeName: 'Tom Bradley',
            jobName: 'Glover Mansion',
            workProgress: ['Floor Prep'],
            startTime: '07:00',
            endTime: '12:00',
            hours: 5.0,
            timestamp: new Date(Date.now() - 120 * 60000).toISOString()
          },
          {
            id: '5',
            date: new Date().toISOString().split('T')[0],
            employeeId: 'emp5',
            employeeName: 'Alex Martinez',
            jobName: 'Johnson Residence',
            workProgress: ['Finish Coats'],
            startTime: '08:00',
            endTime: '12:30',
            hours: 4.5,
            timestamp: new Date(Date.now() - 90 * 60000).toISOString()
          },
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching team entries:', error);
        setLoading(false);
      }
    };

    fetchTeamEntries();
    
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchTeamEntries, 30000);
    return () => clearInterval(interval);
  }, [dateFilter]);

  const formatTime = (time: string): string => {
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const getTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarColor = (name: string): string => {
    const colors = ['#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#E91E63', '#00BCD4'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Filter entries by date
  const filterByDate = (entries: TeamEntry[]): TeamEntry[] => {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (dateFilter === 'today') {
      return entries.filter(e => e.date === today);
    } else if (dateFilter === 'week') {
      return entries.filter(e => e.date >= weekAgo);
    }
    return entries;
  };

  const filteredEntries = filterByDate(teamEntries);

  const sortedEntries = [...filteredEntries].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Group by job
  const entriesByJob: { [key: string]: TeamEntry[] } = {};
  filteredEntries.forEach(entry => {
    if (!entriesByJob[entry.jobName]) {
      entriesByJob[entry.jobName] = [];
    }
    entriesByJob[entry.jobName].push(entry);
  });

  const jobTotals: JobTotal[] = Object.entries(entriesByJob)
    .map(([job, entries]) => ({
      job,
      entries,
      totalHours: entries.reduce((sum, e) => sum + e.hours, 0),
      employeeCount: new Set(entries.map(e => e.employeeId)).size
    }))
    .sort((a, b) => b.totalHours - a.totalHours);

  const teamTotalHours = filteredEntries.reduce((sum, e) => sum + e.hours, 0);
  const activeEmployees = new Set(filteredEntries.map(e => e.employeeId)).size;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: bgColor, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: textMuted }}>Loading team activity...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: bgColor, padding: 20, fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ color: textColor, margin: '0 0 8px', fontSize: 28, fontWeight: 700 }}>
          👷 Team Activity
        </h1>
        <p style={{ color: textMuted, margin: 0, fontSize: 14 }}>
          <span style={{ color: accentColor, fontWeight: 600 }}>{teamTotalHours.toFixed(1)} hrs</span> by {activeEmployees} employee{activeEmployees !== 1 ? 's' : ''}
        </p>
      </div>

      {/* View Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => setViewMode('feed')}
          style={{
            flex: 1,
            padding: '12px 16px',
            background: viewMode === 'feed' ? accentColor : darkMode ? '#353535' : '#E8E8E8',
            color: viewMode === 'feed' ? '#000' : textColor,
            border: 'none',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          📋 Team Feed
        </button>
        <button
          onClick={() => setViewMode('job')}
          style={{
            flex: 1,
            padding: '12px 16px',
            background: viewMode === 'job' ? accentColor : darkMode ? '#353535' : '#E8E8E8',
            color: viewMode === 'job' ? '#000' : textColor,
            border: 'none',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          🏠 By Job
        </button>
      </div>

      {/* Date Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['today', 'week'] as const).map(filter => (
          <button
            key={filter}
            onClick={() => setDateFilter(filter)}
            style={{
              padding: '8px 16px',
              background: dateFilter === filter ? `${accentColor}30` : 'transparent',
              color: dateFilter === filter ? accentColor : textMuted,
              border: `1px solid ${dateFilter === filter ? accentColor : borderColor}`,
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            {filter === 'today' ? 'Today' : 'This Week'}
          </button>
        ))}
      </div>

      {/* Team Feed View */}
      {viewMode === 'feed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sortedEntries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: textMuted }}>
              <p style={{ fontSize: 48, margin: '0 0 16px' }}>📭</p>
              <p style={{ margin: 0 }}>No entries {dateFilter === 'today' ? 'today' : 'this week'} yet</p>
            </div>
          ) : (
            sortedEntries.map(entry => (
              <div
                key={entry.id}
                style={{
                  background: cardBg,
                  borderRadius: 12,
                  padding: 16,
                  border: `1px solid ${borderColor}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: getAvatarColor(entry.employeeName),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      color: '#FFF',
                      fontSize: 14
                    }}>
                      {getInitials(entry.employeeName)}
                    </div>
                    <div>
                      <p style={{ margin: 0, color: textColor, fontWeight: 600, fontSize: 15 }}>
                        {entry.employeeName}
                      </p>
                      <p style={{ margin: '2px 0 0', color: textMuted, fontSize: 12 }}>
                        {getTimeAgo(entry.timestamp)}
                      </p>
                    </div>
                  </div>
                  <span style={{ color: accentColor, fontWeight: 700, fontSize: 18 }}>
                    {entry.hours.toFixed(1)}h
                  </span>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <p style={{ margin: '0 0 6px', color: textColor, fontWeight: 600, fontSize: 14 }}>
                    🏠 {entry.jobName}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {entry.workProgress.map(w => (
                      <span key={w} style={{
                        padding: '3px 8px',
                        background: `${accentColor}20`,
                        color: accentColor,
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 500
                      }}>
                        {w}
                      </span>
                    ))}
                  </div>
                </div>

                <p style={{ margin: '0 0 8px', color: textMuted, fontSize: 12 }}>
                  🕐 {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                </p>

                {entry.notes && (
                  <p style={{ margin: '8px 0 0', color: textMuted, fontSize: 13, fontStyle: 'italic' }}>
                    "{entry.notes}"
                  </p>
                )}

                {entry.sharedPhotos && entry.sharedPhotos.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
                      {entry.sharedPhotos.map((photo, idx) => (
                        <img
                          key={idx}
                          src={photo.url}
                          alt=""
                          style={{
                            width: 80,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: 8
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Job View */}
      {viewMode === 'job' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {jobTotals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: textMuted }}>
              <p style={{ fontSize: 48, margin: '0 0 16px' }}>📭</p>
              <p style={{ margin: 0 }}>No entries {dateFilter === 'today' ? 'today' : 'this week'} yet</p>
            </div>
          ) : (
            jobTotals.map(({ job, entries, totalHours, employeeCount }) => (
              <div
                key={job}
                style={{
                  background: cardBg,
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: `1px solid ${borderColor}`
                }}
              >
                <div
                  onClick={() => setSelectedJob(selectedJob === job ? null : job)}
                  style={{
                    padding: 16,
                    background: darkMode ? '#252525' : '#E8E8E8',
                    borderLeft: `4px solid ${accentColor}`,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <p style={{ margin: 0, color: textColor, fontWeight: 600, fontSize: 16 }}>
                      🏠 {job}
                    </p>
                    <p style={{ margin: '4px 0 0', color: textMuted, fontSize: 12 }}>
                      {employeeCount} employee{employeeCount > 1 ? 's' : ''} • {entries.length} entr{entries.length > 1 ? 'ies' : 'y'}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, color: accentColor, fontWeight: 700, fontSize: 20 }}>
                      {totalHours.toFixed(1)}h
                    </p>
                    <span style={{ color: textMuted, fontSize: 14 }}>
                      {selectedJob === job ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {selectedJob === job && (
                  <div style={{ padding: '0 16px 16px' }}>
                    {entries.map((entry, idx) => (
                      <div
                        key={entry.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 0',
                          borderBottom: idx < entries.length - 1 ? `1px dashed ${borderColor}` : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: getAvatarColor(entry.employeeName),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,
                            color: '#FFF',
                            fontSize: 11
                          }}>
                            {getInitials(entry.employeeName)}
                          </div>
                          <div>
                            <p style={{ margin: 0, color: textColor, fontWeight: 500, fontSize: 14 }}>
                              {entry.employeeName}
                            </p>
                            <p style={{ margin: '2px 0 0', color: textMuted, fontSize: 11 }}>
                              {entry.workProgress.join(', ')}
                            </p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: 0, color: accentColor, fontWeight: 600, fontSize: 15 }}>
                            {entry.hours.toFixed(1)}h
                          </p>
                          <p style={{ margin: '2px 0 0', color: textMuted, fontSize: 11 }}>
                            {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <div style={{ height: 100 }} />
    </div>
  );
}
