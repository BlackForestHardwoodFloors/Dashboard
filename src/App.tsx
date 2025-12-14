import React, { useState, useEffect, useCallback } from 'react';
import { FullDashboard } from './components/FullDashboard';
import TimeLogsPage from './components/TimeLogsPage';
import ClientsPage from './components/ClientsPage';
import CalendarPage from './components/CalendarPage';
import PhotosPage from './components/PhotosPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { EmployeePortal } from './components/EmployeePortal';

export default function App() {
  const [appMode, setAppMode] = useState<'admin' | 'employee' | 'customer'>('admin');
  const [currentView, setCurrentView] = useState<'dashboard' | 'time-sheet' | 'clients' | 'calendar' | 'photos'>('dashboard');
  const [switcherPosition, setSwitcherPosition] = useState({ x: 20, y: window.innerHeight - 180 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleNavigate = (page: string) => {
    if (page === 'Dashboard') {
      setCurrentView('dashboard');
    } else if (page === 'Time Sheet') {
      setCurrentView('time-sheet');
    } else if (page === 'Client') {
      setCurrentView('clients');
    } else if (page === 'Calendar') {
      setCurrentView('calendar');
    } else if (page === 'Photos') {
      setCurrentView('photos');
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setSwitcherPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  }, [dragOffset.x, dragOffset.y]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <ErrorBoundary>
      {/* Mode Switcher - Draggable */}
      <nav 
        role="navigation"
        aria-label="Application mode switcher"
        onMouseDown={handleMouseDown}
        style={{
          position: 'fixed',
          top: switcherPosition.y,
          left: switcherPosition.x,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          padding: '10px',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.1)',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none'
        }}>
        <button
          onClick={() => setAppMode('customer')}
          aria-label="Switch to Customer Portal"
          aria-pressed={appMode === 'customer'}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: appMode === 'customer' ? '#6BA3C8' : 'rgba(255,255,255,0.15)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: '600',
            transition: 'all 0.2s',
            outline: 'none',
            whiteSpace: 'nowrap'
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(107, 163, 200, 0.4)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Customer Portal
        </button>
        <button
          onClick={() => setAppMode('employee')}
          aria-label="Switch to Employee Portal"
          aria-pressed={appMode === 'employee'}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: appMode === 'employee' ? '#4F6A41' : 'rgba(255,255,255,0.15)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: '600',
            transition: 'all 0.2s',
            outline: 'none',
            whiteSpace: 'nowrap'
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 106, 65, 0.4)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Employee Portal
        </button>
        <button
          onClick={() => setAppMode('admin')}
          aria-label="Switch to Admin Dashboard"
          aria-pressed={appMode === 'admin'}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: appMode === 'admin' ? '#2E6F75' : 'rgba(255,255,255,0.15)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: '600',
            transition: 'all 0.2s',
            outline: 'none',
            whiteSpace: 'nowrap'
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(46, 111, 117, 0.4)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Admin Dashboard
        </button>
      </nav>

      {/* Render Based on Mode */}
      <main role="main" aria-label={`${appMode === 'customer' ? 'Customer Portal' : appMode === 'employee' ? 'Employee Portal' : 'Admin Dashboard'} content`}>
        {appMode === 'customer' ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#F5F3F0',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h1 style={{ color: '#333', marginBottom: '16px' }}>Customer Portal</h1>
            <p style={{ color: '#666', fontSize: '16px' }}>The Customer Portal component has been removed.</p>
          </div>
        ) : appMode === 'employee' ? (
          <EmployeePortal />
        ) : (
          <>
            {currentView === 'dashboard' ? (
              <FullDashboard onNavigate={handleNavigate} />
            ) : currentView === 'time-sheet' ? (
              <TimeLogsPage onNavigate={handleNavigate} />
            ) : currentView === 'clients' ? (
              <ClientsPage onNavigate={handleNavigate} />
            ) : currentView === 'calendar' ? (
              <CalendarPage onNavigate={handleNavigate} />
            ) : (
              <PhotosPage onNavigate={handleNavigate} />
            )}
          </>
        )}
      </main>
    </ErrorBoundary>
  );
}