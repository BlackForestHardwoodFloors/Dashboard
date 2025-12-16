import React, { useState } from 'react';
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

    // Handle mode switching
    if (page === 'Mode/Admin') {
      setAppMode('admin');
      return;
    } else if (page === 'Mode/Employee') {
      setAppMode('employee');
      return;
    } else if (page === 'Mode/Customer') {
      setAppMode('customer');
      return;
    }

    const view = pageMap[page] || 'dashboard';
    setCurrentView(view);
  };

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
          <div style={{ marginLeft: '200px', padding: '24px', minHeight: '100vh', backgroundColor: '#1E1E1E' }}>
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
