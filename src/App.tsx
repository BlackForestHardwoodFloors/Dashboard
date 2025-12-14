import React, { useState, useEffect, useCallback } from 'react';
import { FullDashboard } from './components/FullDashboard';
import TimeLogsPage from './components/TimeLogsPage';
import ClientsPage from './components/ClientsPage';
import CalendarPage from './components/CalendarPage';
import PhotosPage from './components/PhotosPage';
import MessagesPage from './components/MessagesPage';
import QuotesPage from './components/QuotesPage';
import ContractsPage from './components/ContractsPage';
import JobsPage from './components/JobsPage';
import WorkOrdersPage from './components/WorkOrdersPage';
import ItemsPage from './components/ItemsPage';
import VendorsPage from './components/VendorsPage';
import SettingsPage from './components/SettingsPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { EmployeePortal } from './components/EmployeePortal';

// Define all possible views
type ViewType = 
  | 'dashboard' 
  | 'messages'
  | 'clients' 
  | 'calendar' 
  | 'quotes'
  | 'contracts'
  | 'work-orders'
  | 'jobs'
  | 'photos'
  | 'time-sheet' 
  | 'items'
  | 'vendors'
  | 'reviews'
  | 'settings';

export default function App() {
  const [appMode, setAppMode] = useState<'admin' | 'employee' | 'customer'>('admin');
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [switcherPosition, setSwitcherPosition] = useState({ x: 20, y: window.innerHeight - 180 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Enhanced navigation handler that maps page names to views
  const handleNavigate = (page: string) => {
    const pageMap: Record<string, ViewType> = {
      'Dashboard': 'dashboard',
      'Messages': 'messages',
      'Clients': 'clients',
      'Clients/Contractors': 'clients',
      'Clients/Locations': 'clients',
      'Clients/Company': 'clients',
      'Calendar': 'calendar',
      'Calendar/SiteVisits': 'calendar',
      'Calendar/ScheduledJobs': 'calendar',
      'Calendar/WoodDelivery': 'calendar',
      'Calendar/Attachments': 'calendar',
      'Appointments': 'calendar',
      'Quotes': 'quotes',
      'Quotes/Draft': 'quotes',
      'Quotes/Sent': 'quotes',
      'Quotes/Accepted': 'quotes',
      'Quotes/Rejected': 'quotes',
      'Contracts': 'contracts',
      'Contracts/Sent': 'contracts',
      'Contracts/Signed': 'contracts',
      'WorkOrders': 'work-orders',
      'Work Orders': 'work-orders',
      'Jobs': 'jobs',
      'Jobs/ReadyToStart': 'jobs',
      'Jobs/InProgress': 'jobs',
      'Jobs/Completed': 'jobs',
      'Photos': 'photos',
      'Time Sheet': 'time-sheet',
      'Time Sheet/WageRate': 'time-sheet',
      'Time Sheet/GeneralTasks': 'time-sheet',
      'Time Sheet/WeeklyReport': 'time-sheet',
      'Time Sheet/Payroll': 'time-sheet',
      'Timesheet': 'time-sheet',
      'Items': 'items',
      'Vendors': 'vendors',
      'Vendors/Contacts': 'vendors',
      'Vendors/PriceList': 'vendors',
      'Reviews': 'reviews',
      'Settings': 'settings',
      'Settings/Employees': 'settings',
      'Settings/Departments': 'settings',
      'Settings/Roles': 'settings',
      'Settings/Taxes': 'settings',
      // Legacy mappings
      'Client': 'clients',
    };

    const view = pageMap[page] || 'dashboard';
    setCurrentView(view);
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

  // Render the appropriate page based on currentView
  const renderAdminContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <FullDashboard onNavigate={handleNavigate} />;
      case 'messages':
        return <MessagesPage onNavigate={handleNavigate} />;
      case 'clients':
        return <ClientsPage onNavigate={handleNavigate} />;
      case 'calendar':
        return <CalendarPage onNavigate={handleNavigate} />;
      case 'quotes':
        return <QuotesPage onNavigate={handleNavigate} />;
      case 'contracts':
        return <ContractsPage onNavigate={handleNavigate} />;
      case 'work-orders':
        return <WorkOrdersPage onNavigate={handleNavigate} />;
      case 'jobs':
        return <JobsPage onNavigate={handleNavigate} />;
      case 'photos':
        return <PhotosPage onNavigate={handleNavigate} />;
      case 'time-sheet':
        return <TimeLogsPage onNavigate={handleNavigate} />;
      case 'items':
        return <ItemsPage onNavigate={handleNavigate} />;
      case 'vendors':
        return <VendorsPage onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsPage onNavigate={handleNavigate} />;
      case 'reviews':
        // Placeholder for reviews page
        return (
          <div style={{ marginLeft: '220px', padding: '24px', minHeight: '100vh', backgroundColor: '#1E1E1E' }}>
            <h1 style={{ color: '#FFFFFF', fontSize: '28px', marginBottom: '8px' }}>Reviews</h1>
            <p style={{ color: '#A0A0A0' }}>Reviews page coming soon...</p>
          </div>
        );
      default:
        return <FullDashboard onNavigate={handleNavigate} />;
    }
  };

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
            <p style={{ color: '#666', fontSize: '16px' }}>The Customer Portal component is coming soon.</p>
          </div>
        ) : appMode === 'employee' ? (
          <EmployeePortal />
        ) : (
          renderAdminContent()
        )}
      </main>
    </ErrorBoundary>
  );
}
