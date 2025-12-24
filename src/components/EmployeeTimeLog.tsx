import React, { useState } from 'react';
import { Clock, Plus, Check, ChevronLeft, ChevronRight, Calendar, X, Camera, Image as ImageIcon } from 'lucide-react';

interface Job {
  id: string;
  name: string;
}

interface JobPhoto {
  id: string;
  url: string;
  timestamp: string;
  shareWithClient: boolean;
  clientNotes: string;
}

interface TimeEntry {
  id: string;
  date: string;
  jobName: string;
  workProgress: string[]; // Multiple selections
  otherExplanation?: string;
  miscDescription?: string;
  startTime: string;
  endTime: string;
  breakTime: number;
  hours: number;
  notes: string;
  status: 'pending' | 'approved';
  sharedPhotos?: JobPhoto[]; // Photos marked to share with client
}

export default function EmployeeTimeLog() {
  const [darkMode] = useState(true);
  const [step, setStep] = useState(1); // 1: Job, 2: Work Progress, 3: Time
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedWorkProgress, setSelectedWorkProgress] = useState<string[]>([]); // Multiple selections
  const [otherExplanation, setOtherExplanation] = useState(''); // Required when "Other" is selected
  const [miscDescription, setMiscDescription] = useState(''); // Required when MISC job is selected
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('07:15');

  // Handle start time change - auto-update endTime if needed
  const handleStartTimeChange = (newStartTime: string) => {
    setStartTime(newStartTime);
    const [startH, startM] = newStartTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;
    
    if (endMins <= startMins) {
      const newEndMins = startMins + 15;
      const newH = Math.floor(newEndMins / 60).toString().padStart(2, '0');
      const newM = (newEndMins % 60).toString().padStart(2, '0');
      setEndTime(`${newH}:${newM}`);
    }
  };
  const [breakTime, setBreakTime] = useState(0); // minutes - default to 0 for multi-entry
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Entries being added for the current day (before final submit)
  const [todaysEntries, setTodaysEntries] = useState<TimeEntry[]>([]);
  
  const [recentEntries, setRecentEntries] = useState<TimeEntry[]>([
    { id: '1', date: '2025-12-22', jobName: 'Glover Mansion', workProgress: ['Sanding started', 'Sanding completed'], startTime: '07:00', endTime: '14:00', breakTime: 30, hours: 6.5, notes: '', status: 'approved' },
    { id: '2', date: '2025-12-22', jobName: 'Johnson Residence', workProgress: ['Water conditioning', 'Staining'], startTime: '14:00', endTime: '16:30', breakTime: 0, hours: 2.5, notes: 'Touch ups', status: 'approved' },
    { id: '3', date: '2025-12-21', jobName: 'Downtown Office', workProgress: ['Installation started', 'Installation'], startTime: '07:00', endTime: '12:00', breakTime: 0, hours: 5, notes: '', status: 'pending' },
    { id: '4', date: '2025-12-21', jobName: 'EDM', workProgress: ['Floor Prep'], startTime: '12:30', endTime: '15:30', breakTime: 0, hours: 3, notes: '', status: 'pending' },
    { id: '5', date: '2025-12-21', jobName: 'Employee Meeting', workProgress: ['Other'], otherExplanation: 'Weekly team sync', startTime: '15:30', endTime: '16:30', breakTime: 0, hours: 1, notes: '', status: 'pending' },
    { id: '6', date: '2025-12-20', jobName: 'Riverside Home', workProgress: ['Installation completed', 'Repairs started'], startTime: '08:00', endTime: '16:00', breakTime: 30, hours: 7.5, notes: '', status: 'approved' },
  ]);

  // Photos for current job (would be fetched from API based on selectedJob)
  const [jobPhotos, setJobPhotos] = useState<JobPhoto[]>([]);
  const [photoCarouselIndex, setPhotoCarouselIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  // Sample photos data by job (in real app, fetch from API)
  const getJobPhotos = (jobName: string): JobPhoto[] => {
    const samplePhotos: { [key: string]: JobPhoto[] } = {
      'Glover Mansion': [
        { id: 'p1', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', timestamp: '2025-12-23 09:30 AM', shareWithClient: false, clientNotes: '' },
        { id: 'p2', url: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=400&h=300&fit=crop', timestamp: '2025-12-23 11:15 AM', shareWithClient: false, clientNotes: '' },
        { id: 'p3', url: 'https://images.unsplash.com/photo-1560185008-b033106af5c3?w=400&h=300&fit=crop', timestamp: '2025-12-23 02:00 PM', shareWithClient: false, clientNotes: '' },
      ],
      'Johnson Residence': [
        { id: 'p4', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop', timestamp: '2025-12-22 10:00 AM', shareWithClient: false, clientNotes: '' },
        { id: 'p5', url: 'https://images.unsplash.com/photo-1560449752-3fd4bdbe7df0?w=400&h=300&fit=crop', timestamp: '2025-12-22 03:30 PM', shareWithClient: false, clientNotes: '' },
      ],
      'Downtown Office': [
        { id: 'p6', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', timestamp: '2025-12-21 08:45 AM', shareWithClient: false, clientNotes: '' },
      ],
    };
    return samplePhotos[jobName] || [];
  };

  // Update photos when job is selected
  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    const photos = getJobPhotos(job.name);
    setJobPhotos(photos);
    setPhotoCarouselIndex(0);
    if (job.name !== 'MISC. (Describe)') {
      setMiscDescription('');
      setStep(2);
    }
  };

  // Toggle share with client
  const toggleShareWithClient = (photoId: string) => {
    setJobPhotos(jobPhotos.map(p => 
      p.id === photoId ? { ...p, shareWithClient: !p.shareWithClient } : p
    ));
  };

  // Update client notes for a photo
  const updateClientNotes = (photoId: string, notes: string) => {
    setJobPhotos(jobPhotos.map(p => 
      p.id === photoId ? { ...p, clientNotes: notes } : p
    ));
  };

  // Voice transcription for client notes
  const startTranscription = (photoId: string) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser. Try Chrome.');
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    setIsRecording(true);
    
    let finalTranscript = jobPhotos.find(p => p.id === photoId)?.clientNotes || '';
    
    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
          updateClientNotes(photoId, finalTranscript.trim());
        }
      }
    };
    
    recognition.onerror = () => {
      setIsRecording(false);
    };
    
    recognition.onend = () => {
      setIsRecording(false);
    };
    
    recognition.start();
    
    // Auto-stop after 30 seconds
    setTimeout(() => {
      recognition.stop();
    }, 30000);
  };

  // Generate time options in 15-minute increments
  const generateTimeOptions = () => {
    const options: string[] = [];
    for (let hour = 5; hour <= 21; hour++) {
      for (let min = 0; min < 60; min += 15) {
        const h = hour.toString().padStart(2, '0');
        const m = min.toString().padStart(2, '0');
        options.push(`${h}:${m}`);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // Format time for display (24h to 12h)
  const formatTimeDisplay = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  // Calculate total hours from start/end time minus break
  const calculateHours = () => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const totalMinutes = endMinutes - startMinutes - breakTime;
    return Math.max(0, totalMinutes / 60);
  };

  // Sample jobs - in real app, fetch from API
  const jobs: Job[] = [
    { id: '1', name: 'Glover Mansion' },
    { id: '2', name: 'Johnson Residence' },
    { id: '3', name: 'Downtown Office' },
    { id: '4', name: 'Riverside Home' },
    { id: '5', name: 'EDM' },
    { id: '6', name: 'MISC. (Describe)' },
    { id: '7', name: 'Employee Meeting' },
    { id: '8', name: 'OFF' },
  ];

  const workProgressOptions = [
    'Floor Prep',
    'Installation started',
    'Installation',
    'Installation completed',
    'Repairs started',
    'Repairs completed',
    'Sanding started',
    'Sanding completed',
    'Water conditioning',
    'Staining',
    'Finish Coats',
    'Final Coat',
    'Other'
  ];

  // Colors
  const bgColor = darkMode ? '#1E1E1E' : '#F5F5F5';
  const cardBg = darkMode ? '#2D2D2D' : '#FFFFFF';
  const textColor = darkMode ? '#FFFFFF' : '#1E1E1E';
  const textMuted = darkMode ? '#A0A0A0' : '#666666';
  const borderColor = darkMode ? '#3D3D3D' : '#E5E5E5';
  const accentColor = '#D4A024';

  const resetForm = () => {
    setStep(1);
    setSelectedJob(null);
    setSelectedWorkProgress([]);
    setOtherExplanation('');
    setMiscDescription('');
    setStartTime('07:00');
    setEndTime('07:15');
    setBreakTime(0);
    setNotes('');
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setShowForm(false);
    setTodaysEntries([]);
    setJobPhotos([]);
    setPhotoCarouselIndex(0);
  };

  const resetForNextEntry = (lastEndTime: string) => {
    setStep(1);
    setSelectedJob(null);
    setSelectedWorkProgress([]);
    setOtherExplanation('');
    setMiscDescription('');
    setStartTime(lastEndTime); // Start where last one ended
    // Set end time to start + 15 min
    const [h, m] = lastEndTime.split(':').map(Number);
    const totalMins = h * 60 + m + 15;
    const newH = Math.floor(totalMins / 60).toString().padStart(2, '0');
    const newM = (totalMins % 60).toString().padStart(2, '0');
    setEndTime(`${newH}:${newM}`);
    setBreakTime(0);
    setNotes('');
    setJobPhotos([]);
    setPhotoCarouselIndex(0);
  };

  // Add entry to today's list (not final submit yet)
  const handleAddEntry = () => {
    if (!selectedJob || selectedWorkProgress.length === 0) return;
    
    // Validation: Other requires explanation
    if (selectedWorkProgress.includes('Other') && !otherExplanation.trim()) {
      alert('Please explain the "Other" work progress');
      return;
    }

    // Get photos marked for sharing
    const sharedPhotos = jobPhotos.filter(p => p.shareWithClient);

    const newEntry: TimeEntry = {
      id: String(Date.now()),
      date: selectedDate,
      jobName: selectedJob.name === 'MISC. (Describe)' ? `MISC: ${miscDescription}` : selectedJob.name,
      workProgress: selectedWorkProgress,
      otherExplanation: selectedWorkProgress.includes('Other') ? otherExplanation : undefined,
      miscDescription: selectedJob.name === 'MISC. (Describe)' ? miscDescription : undefined,
      startTime,
      endTime,
      breakTime,
      hours: calculateHours(),
      notes,
      status: 'pending',
      sharedPhotos: sharedPhotos.length > 0 ? sharedPhotos : undefined
    };

    setTodaysEntries([...todaysEntries, newEntry]);
    resetForNextEntry(endTime);
  };

  // Submit all entries for the day
  const handleSubmitAll = () => {
    if (todaysEntries.length === 0) return;
    
    setRecentEntries([...todaysEntries, ...recentEntries]);
    resetForm();
    // TODO: API call to save all entries
  };

  // Remove an entry from today's list
  const handleRemoveEntry = (id: string) => {
    setTodaysEntries(todaysEntries.filter(e => e.id !== id));
  };

  // Get total hours for today's entries
  const getTodaysTotalHours = () => {
    return todaysEntries.reduce((sum, entry) => sum + entry.hours, 0);
  };

  const getTotalHoursThisWeek = () => {
    return recentEntries.reduce((sum, entry) => sum + entry.hours, 0);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: bgColor,
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: textColor, margin: '0 0 8px 0' }}>
          My Time
        </h1>
        <p style={{ fontSize: '14px', color: textMuted, margin: 0 }}>
          This Week: <span style={{ color: accentColor, fontWeight: '600' }}>{getTotalHoursThisWeek()} hours</span>
        </p>
      </div>

      {/* Add Time Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            width: '100%',
            padding: '20px',
            backgroundColor: accentColor,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '16px',
            fontSize: '18px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(212, 160, 36, 0.3)'
          }}
        >
          <Plus size={24} />
          Log Time
        </button>
      )}

      {/* Time Entry Form */}
      {showForm && (
        <div style={{
          backgroundColor: cardBg,
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: `1px solid ${borderColor}`
        }}>
          {/* Date Selector at Top */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: textMuted, marginBottom: '6px', textTransform: 'uppercase' }}>
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: darkMode ? '#353535' : '#F5F5F5',
                border: `1px solid ${borderColor}`,
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                color: textColor,
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Form Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  style={{
                    padding: '8px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: textMuted
                  }}
                >
                  <ChevronLeft size={24} />
                </button>
              )}
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: textColor, margin: 0 }}>
                {step === 1 && 'Select Job'}
                {step === 2 && 'Work Progress'}
                {step === 3 && 'Set Time'}
              </h2>
            </div>
            <button
              onClick={resetForm}
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: textMuted
              }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Progress Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
            {[1, 2, 3].map(num => (
              <div
                key={num}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: step >= num ? accentColor : borderColor,
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>

          {/* Step 1: Select Job */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {jobs.map(job => (
                <div key={job.id}>
                  <button
                    onClick={() => handleJobSelect(job)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      backgroundColor: darkMode ? '#353535' : '#F5F5F5',
                      border: `2px solid ${selectedJob?.id === job.id ? accentColor : 'transparent'}`,
                      borderRadius: selectedJob?.id === job.id && job.name === 'MISC. (Describe)' ? '12px 12px 0 0' : '12px',
                      fontSize: '16px',
                      fontWeight: '500',
                      color: textColor,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                  >
                    {job.name}
                  </button>

                  {/* MISC Description - show directly below MISC button when selected */}
                  {selectedJob?.id === job.id && job.name === 'MISC. (Describe)' && (
                    <div style={{
                      padding: '16px',
                      backgroundColor: darkMode ? '#404040' : '#EEEEEE',
                      borderRadius: '0 0 12px 12px',
                      border: `2px solid ${accentColor}`,
                      borderTop: 'none'
                    }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: textColor, marginBottom: '8px' }}>
                        Describe the work <span style={{ color: '#D9534F' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={miscDescription}
                        onChange={(e) => setMiscDescription(e.target.value)}
                        placeholder="What work was done?"
                        autoFocus
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          backgroundColor: darkMode ? '#2D2D2D' : '#FFFFFF',
                          border: `1px solid ${miscDescription.trim() ? accentColor : borderColor}`,
                          borderRadius: '10px',
                          fontSize: '16px',
                          color: textColor,
                          boxSizing: 'border-box'
                        }}
                      />
                      <button
                        onClick={() => {
                          if (miscDescription.trim()) {
                            setStep(2);
                          } else {
                            alert('Please describe the work');
                          }
                        }}
                        disabled={!miscDescription.trim()}
                        style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: miscDescription.trim() ? accentColor : '#666',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '15px',
                          fontWeight: '600',
                          cursor: miscDescription.trim() ? 'pointer' : 'not-allowed',
                          marginTop: '12px'
                        }}
                      >
                        Continue
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Work Progress (multi-select) */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Show selected job */}
              <div style={{
                padding: '10px 14px',
                backgroundColor: darkMode ? '#252525' : '#E8E8E8',
                borderRadius: '8px',
                borderLeft: `4px solid ${accentColor}`
              }}>
                <p style={{ margin: 0, fontSize: '12px', color: textMuted }}>Job</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '15px', fontWeight: '600', color: textColor }}>
                  {selectedJob?.name === 'MISC. (Describe)' ? `MISC: ${miscDescription}` : selectedJob?.name}
                </p>
              </div>

              <p style={{ margin: 0, fontSize: '13px', color: textMuted }}>
                Select all that apply:
              </p>

              {/* Show selected work progress items */}
              {selectedWorkProgress.length > 0 && (
                <div style={{
                  padding: '10px 14px',
                  backgroundColor: `${accentColor}15`,
                  borderRadius: '8px',
                  border: `1px solid ${accentColor}40`
                }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: textMuted }}>Selected ({selectedWorkProgress.length}):</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedWorkProgress.map(progress => (
                      <span
                        key={progress}
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          backgroundColor: accentColor,
                          color: '#FFFFFF',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        {progress}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {workProgressOptions.map(progress => {
                  const isSelected = selectedWorkProgress.includes(progress);
                  return (
                    <button
                      key={progress}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedWorkProgress(selectedWorkProgress.filter(p => p !== progress));
                        } else {
                          setSelectedWorkProgress([...selectedWorkProgress, progress]);
                        }
                      }}
                      style={{
                        padding: '14px 12px',
                        backgroundColor: isSelected ? `${accentColor}20` : darkMode ? '#353535' : '#F5F5F5',
                        border: `2px solid ${isSelected ? accentColor : 'transparent'}`,
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: isSelected ? '600' : '500',
                        color: isSelected ? accentColor : textColor,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'center'
                      }}
                    >
                      {isSelected && '✓ '}{progress}
                    </button>
                  );
                })}
              </div>

              {/* Other Explanation - only show if "Other" is selected */}
              {selectedWorkProgress.includes('Other') && (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: textColor, marginBottom: '8px' }}>
                    Explain "Other" <span style={{ color: '#D9534F' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={otherExplanation}
                    onChange={(e) => setOtherExplanation(e.target.value)}
                    placeholder="What other work was done?"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      backgroundColor: darkMode ? '#353535' : '#F5F5F5',
                      border: `1px solid ${otherExplanation.trim() ? accentColor : borderColor}`,
                      borderRadius: '12px',
                      fontSize: '16px',
                      color: textColor,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}

              {/* Continue Button */}
              <button
                onClick={() => {
                  if (selectedWorkProgress.length === 0) {
                    alert('Please select at least one work progress');
                    return;
                  }
                  if (selectedWorkProgress.includes('Other') && !otherExplanation.trim()) {
                    alert('Please explain the "Other" work');
                    return;
                  }
                  setStep(3);
                }}
                disabled={selectedWorkProgress.length === 0}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: selectedWorkProgress.length > 0 ? accentColor : '#666',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: selectedWorkProgress.length > 0 ? 'pointer' : 'not-allowed',
                  marginTop: '8px'
                }}
              >
                Continue ({selectedWorkProgress.length} selected)
              </button>
            </div>
          )}

          {/* Step 3: Time & Details */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Summary */}
              <div style={{ 
                padding: '16px', 
                backgroundColor: darkMode ? '#353535' : '#F5F5F5', 
                borderRadius: '12px' 
              }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: textMuted }}>Job</p>
                <p style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: textColor }}>
                  {selectedJob?.name === 'MISC. (Describe)' ? `MISC: ${miscDescription}` : selectedJob?.name}
                </p>
                <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: textMuted }}>Work Progress</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedWorkProgress.map(progress => (
                    <span
                      key={progress}
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        backgroundColor: `${accentColor}20`,
                        color: accentColor,
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}
                    >
                      {progress === 'Other' && otherExplanation ? `Other: ${otherExplanation}` : progress}
                    </span>
                  ))}
                </div>
              </div>

              {/* Start Time & End Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: textColor, marginBottom: '8px' }}>
                    Start Time
                  </label>
                  <select
                    value={startTime}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 12px',
                      backgroundColor: darkMode ? '#353535' : '#F5F5F5',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: textColor,
                      cursor: 'pointer',
                      boxSizing: 'border-box'
                    }}
                  >
                    {timeOptions.map(time => (
                      <option key={`start-${time}`} value={time}>
                        {formatTimeDisplay(time)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: textColor, marginBottom: '8px' }}>
                    End Time
                  </label>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 12px',
                      backgroundColor: darkMode ? '#353535' : '#F5F5F5',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: textColor,
                      cursor: 'pointer',
                      boxSizing: 'border-box'
                    }}
                  >
                    {timeOptions.map(time => (
                      <option key={`end-${time}`} value={time}>
                        {formatTimeDisplay(time)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Break Time */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: textColor, marginBottom: '8px' }}>
                  Break Time
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[0, 15, 30, 45, 60].map(mins => (
                    <button
                      key={mins}
                      onClick={() => setBreakTime(mins)}
                      style={{
                        padding: '12px 20px',
                        borderRadius: '10px',
                        border: breakTime === mins ? `2px solid ${accentColor}` : `1px solid ${borderColor}`,
                        backgroundColor: breakTime === mins ? `${accentColor}20` : darkMode ? '#353535' : '#F5F5F5',
                        color: breakTime === mins ? accentColor : textColor,
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {mins === 0 ? 'None' : `${mins} min`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Hours Display */}
              <div style={{
                padding: '16px',
                backgroundColor: `${accentColor}15`,
                borderRadius: '12px',
                border: `2px solid ${accentColor}`,
                textAlign: 'center'
              }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: textMuted }}>Total Hours</p>
                <p style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: accentColor }}>
                  {calculateHours().toFixed(2)} hrs
                </p>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: textColor, marginBottom: '8px' }}>
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    backgroundColor: darkMode ? '#353535' : '#F5F5F5',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '12px',
                    fontSize: '16px',
                    color: textColor,
                    resize: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Photo Carousel */}
              {jobPhotos.length > 0 && (
                <div style={{
                  backgroundColor: darkMode ? '#252525' : '#E8E8E8',
                  borderRadius: '12px',
                  padding: '16px',
                  marginTop: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Camera size={18} color={accentColor} />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: textColor }}>
                        Job Photos ({jobPhotos.length})
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: textMuted }}>
                      {photoCarouselIndex + 1} of {jobPhotos.length}
                    </span>
                  </div>

                  {/* Photo Display */}
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: '100%',
                      height: '200px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      backgroundColor: '#1A1A1A'
                    }}>
                      <img
                        src={jobPhotos[photoCarouselIndex]?.url}
                        alt={`Job photo ${photoCarouselIndex + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>

                    {/* Navigation Arrows */}
                    {jobPhotos.length > 1 && (
                      <>
                        <button
                          onClick={() => setPhotoCarouselIndex(Math.max(0, photoCarouselIndex - 1))}
                          disabled={photoCarouselIndex === 0}
                          style={{
                            position: 'absolute',
                            left: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: photoCarouselIndex === 0 ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.6)',
                            border: 'none',
                            cursor: photoCarouselIndex === 0 ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF'
                          }}
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={() => setPhotoCarouselIndex(Math.min(jobPhotos.length - 1, photoCarouselIndex + 1))}
                          disabled={photoCarouselIndex === jobPhotos.length - 1}
                          style={{
                            position: 'absolute',
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: photoCarouselIndex === jobPhotos.length - 1 ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.6)',
                            border: 'none',
                            cursor: photoCarouselIndex === jobPhotos.length - 1 ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF'
                          }}
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Photo Timestamp */}
                  <p style={{ margin: '8px 0', fontSize: '12px', color: textMuted, textAlign: 'center' }}>
                    {jobPhotos[photoCarouselIndex]?.timestamp}
                  </p>

                  {/* Dot Indicators */}
                  {jobPhotos.length > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '12px' }}>
                      {jobPhotos.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setPhotoCarouselIndex(idx)}
                          style={{
                            width: idx === photoCarouselIndex ? '20px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            backgroundColor: idx === photoCarouselIndex ? accentColor : borderColor,
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Share with Client Checkbox */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px',
                    backgroundColor: darkMode ? '#353535' : '#F5F5F5',
                    borderRadius: '10px',
                    marginBottom: '10px'
                  }}>
                    <input
                      type="checkbox"
                      id={`share-${jobPhotos[photoCarouselIndex]?.id}`}
                      checked={jobPhotos[photoCarouselIndex]?.shareWithClient || false}
                      onChange={() => toggleShareWithClient(jobPhotos[photoCarouselIndex]?.id)}
                      style={{
                        width: '20px',
                        height: '20px',
                        accentColor: accentColor,
                        cursor: 'pointer'
                      }}
                    />
                    <label
                      htmlFor={`share-${jobPhotos[photoCarouselIndex]?.id}`}
                      style={{ fontSize: '14px', fontWeight: '500', color: textColor, cursor: 'pointer' }}
                    >
                      Share in Client Portal
                    </label>
                  </div>

                  {/* Client Notes (show when share is checked) */}
                  {jobPhotos[photoCarouselIndex]?.shareWithClient && (
                    <div style={{ marginTop: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: textMuted }}>
                          Notes for Client
                        </label>
                        <button 
                          onClick={() => startTranscription(jobPhotos[photoCarouselIndex]?.id)}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px',
                            padding: '6px 12px', 
                            backgroundColor: isRecording ? '#D9534F' : darkMode ? '#353535' : '#E8E8E8', 
                            border: `1px solid ${isRecording ? '#D9534F' : borderColor}`, 
                            borderRadius: '8px', 
                            color: isRecording ? '#FFFFFF' : textColor, 
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          {isRecording ? '🔴 Recording...' : '🎤 Voice Input'}
                        </button>
                      </div>
                      <textarea
                        value={jobPhotos[photoCarouselIndex]?.clientNotes || ''}
                        onChange={(e) => updateClientNotes(jobPhotos[photoCarouselIndex]?.id, e.target.value)}
                        placeholder="Tap mic to dictate or type notes..."
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          backgroundColor: darkMode ? '#404040' : '#FFFFFF',
                          border: `1px solid ${borderColor}`,
                          borderRadius: '8px',
                          fontSize: '14px',
                          color: textColor,
                          resize: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                      {isRecording && (
                        <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#D9534F', textAlign: 'center' }}>
                          🎙️ Listening... speak now (auto-stops in 30s)
                        </p>
                      )}
                    </div>
                  )}

                  {/* Photos marked for sharing count */}
                  {jobPhotos.filter(p => p.shareWithClient).length > 0 && (
                    <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: accentColor, textAlign: 'center' }}>
                      {jobPhotos.filter(p => p.shareWithClient).length} photo(s) will be shared with client
                    </p>
                  )}
                </div>
              )}

              {/* No Photos Message */}
              {jobPhotos.length === 0 && selectedJob && !['MISC. (Describe)', 'Employee Meeting', 'OFF'].includes(selectedJob.name) && (
                <div style={{
                  padding: '20px',
                  backgroundColor: darkMode ? '#252525' : '#E8E8E8',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <ImageIcon size={32} color={textMuted} style={{ marginBottom: '8px' }} />
                  <p style={{ margin: 0, fontSize: '14px', color: textMuted }}>
                    No photos for this job yet
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleAddEntry}
                style={{
                  width: '100%',
                  padding: '18px',
                  backgroundColor: '#4CAF50',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  marginTop: '8px'
                }}
              >
                <Plus size={22} />
                Add Entry
              </button>
            </div>
          )}
        </div>
      )}

      {/* Today's Entries (entries being added before final submit) */}
      {showForm && todaysEntries.length > 0 && (
        <div style={{
          backgroundColor: cardBg,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          border: `2px solid ${accentColor}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: textColor, margin: 0 }}>
              Today's Entries ({todaysEntries.length})
            </h3>
            <span style={{ fontSize: '16px', fontWeight: '700', color: accentColor }}>
              {getTodaysTotalHours().toFixed(1)} hrs
            </span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {todaysEntries.map(entry => (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: darkMode ? '#353535' : '#F5F5F5',
                  borderRadius: '10px'
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: '600', color: textColor }}>
                    {entry.jobName}
                    {entry.sharedPhotos && entry.sharedPhotos.length > 0 && (
                      <span style={{ 
                        marginLeft: '8px', 
                        fontSize: '11px', 
                        color: '#3B9CAA',
                        backgroundColor: '#3B9CAA20',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        📷 {entry.sharedPhotos.length}
                      </span>
                    )}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: textMuted }}>
                    {entry.workProgress.join(', ')} • {formatTimeDisplay(entry.startTime)} - {formatTimeDisplay(entry.endTime)}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: accentColor }}>
                    {entry.hours.toFixed(1)}h
                  </span>
                  <button
                    onClick={() => handleRemoveEntry(entry.id)}
                    style={{
                      padding: '6px',
                      backgroundColor: '#D9534F20',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: '#D9534F'
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmitAll}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: accentColor,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <Check size={20} />
            Submit All ({todaysEntries.length} entries)
          </button>
        </div>
      )}

      {/* Recent Entries */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: textColor, margin: '0 0 16px 0' }}>
          Recent Entries
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(() => {
            // Group entries by date
            const groupedByDate: { [date: string]: TimeEntry[] } = {};
            recentEntries.forEach(entry => {
              if (!groupedByDate[entry.date]) {
                groupedByDate[entry.date] = [];
              }
              groupedByDate[entry.date].push(entry);
            });

            // Alternate colors for different days
            const dayColors = [
              { bg: darkMode ? '#2D2D2D' : '#FFFFFF', border: borderColor },
              { bg: darkMode ? '#353535' : '#F5F5F5', border: darkMode ? '#454545' : '#E0E0E0' }
            ];

            let dayIndex = 0;
            return Object.entries(groupedByDate).map(([date, entries]) => {
              const color = dayColors[dayIndex % 2];
              dayIndex++;
              const dayTotal = entries.reduce((sum, e) => sum + e.hours, 0);

              return (
                <div key={date} style={{ marginBottom: '8px' }}>
                  {/* Date Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    backgroundColor: darkMode ? '#252525' : '#E8E8E8',
                    borderRadius: '8px 8px 0 0',
                    borderLeft: `4px solid ${accentColor}`
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: textColor }}>
                      {formatDate(date)}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: accentColor }}>
                      {dayTotal.toFixed(1)} hrs total
                    </span>
                  </div>

                  {/* Entries for this date */}
                  <div style={{
                    backgroundColor: color.bg,
                    borderRadius: entries.length > 1 ? '0 0 12px 12px' : '0 0 12px 12px',
                    border: `1px solid ${color.border}`,
                    borderTop: 'none',
                    overflow: 'hidden'
                  }}>
                    {entries.map((entry, idx) => (
                      <div
                        key={entry.id}
                        style={{
                          padding: '14px 16px',
                          borderBottom: idx < entries.length - 1 ? `1px dashed ${darkMode ? '#404040' : '#D0D0D0'}` : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600', color: textColor }}>
                              {entry.jobName}
                            </p>
                            <p style={{ margin: 0, fontSize: '12px', color: textMuted }}>
                              {entry.workProgress.join(', ')} • {formatTimeDisplay(entry.startTime)} - {formatTimeDisplay(entry.endTime)}
                              {entry.breakTime > 0 && ` (${entry.breakTime}min break)`}
                            </p>
                            {entry.otherExplanation && (
                              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: accentColor }}>
                                Other: {entry.otherExplanation}
                              </p>
                            )}
                            {entry.notes && (
                              <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: textMuted, fontStyle: 'italic' }}>
                                "{entry.notes}"
                              </p>
                            )}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: accentColor }}>
                              {entry.hours.toFixed(1)}h
                            </p>
                            <span style={{
                              display: 'inline-block',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '10px',
                              fontWeight: '600',
                              backgroundColor: entry.status === 'approved' ? '#4CAF5020' : '#F4B40020',
                              color: entry.status === 'approved' ? '#4CAF50' : '#F4B400'
                            }}>
                              {entry.status === 'approved' ? 'Approved' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>
      
      {/* Bottom spacer for scrolling */}
      <div style={{ height: '100px' }}></div>
    </div>
  );
}
