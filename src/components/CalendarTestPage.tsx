import React from 'react';
import { Calendar } from './ui/calendar';
import { CalendarScreen } from './CalendarScreen';
import CalendarJobCard from './CalendarJobCard';

export function CalendarTestPage({ onLogout }: { onLogout: () => void }) {
  // Sample job data for CalendarJobCard
  const sampleJob = {
    id: '1',
    title: 'Flooring Installation',
    clientName: 'John Doe',
    address: '123 Main St',
    startDate: new Date(),
    endDate: new Date(),
    foreman: 'Chase',
    progress: 50,
    p4pStatus: 'on-track',
    jobType: 'Install'
  };

  return (
    <div className="p-4">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <h1 className="text-2xl font-bold">Calendar Test Page</h1>
        <button 
          onClick={onLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl mb-2">Calendar Screen</h2>
        <CalendarScreen />
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl mb-2">Day Picker Calendar</h2>
        <Calendar />
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl mb-2">Calendar Job Card</h2>
        <CalendarJobCard 
          job={sampleJob}
          view="1-week"
          onClick={() => console.log('Job card clicked')}
        />
      </div>
    </div>
  );
}