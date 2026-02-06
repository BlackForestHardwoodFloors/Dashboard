import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { FullDashboard } from './components/FullDashboard';
import TimeLogsPage from './components/TimeLogsPage';
import ClientsPage from './components/ClientsPage';
import ClientDetailsPage from './components/ClientDetailsPage';
import CalendarPage from './components/CalendarPage';
import PhotosPage from './components/PhotosPage';
import MessagesPage from './components/MessagesPage';
import QuotesPage from './components/QuotesPage';
import ContractsPage from './components/ContractsPage';
import JobsPage from './components/JobsPage';
import JobCardDrawer from './components/JobCardDrawer';
import WorkOrdersPage from './components/WorkOrdersPage';
import ItemsPage from './components/ItemsPage';
import VendorsPage from './components/VendorsPage';
import SettingsPage from './components/SettingsPage';
import AdminLoginPage from './components/AdminLoginPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { EmployeePortal } from './components/employee-portal/EmployeePortal';
import CommunicationHubPage from './components/CommunicationHubPage';
import P4PGrowthPage from './components/P4PGrowthPage';
import AppRoutes from './components/AppRoutes';
import './styles/globals.css';

type ViewType =
  | 'dashboard'
  | 'messages'
  | 'clients'
  | 'client-details'
  | 'calendar'
  | 'communications'
  | 'quotes'
  | 'contracts'
  | 'work-orders'
  | 'jobs'
  | 'photos'
  | 'time-sheet'
  | 'items'
  | 'vendors'
  | 'reviews'
  | 'settings'
  | 'p4p-growth'
  | 'employee-portal';

type PortalType = 'admin' | 'employee' | 'customer';
type LoginPageType = 'admin-login' | 'employee-login' | 'customer-login' | null;

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  portalType?: PortalType;
}

function AppContent() {
  useTheme(); // keep theme hook active (even if not used directly)

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user] = useState<User | null>({
    id: 1,
    firstName: 'Dev',
    lastName: 'User',
    email: 'dev@test.com',
    role: 'Admin',
    portalType: 'admin'
  });

  const [currentPortal] = useState<PortalType>('admin');
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [loginPage] = useState<LoginPageType>(null);

  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [showJobDrawer, setShowJobDrawer] = useState(false);

  /* ---------------- Navigation ---------------- */

  const handleNavigate = (page: string) => {
    // ✅ CLIENT DETAILS NAVIGATION
    if (page.startsWith('Client/')) {
      const clientId = parseInt(page.split('/')[1]);
      if (!isNaN(clientId)) {
        setSelectedClientId(clientId);
        setCurrentView('client-details');
        return;
      }
    }

    // ✅ Job drawer
    if (page.startsWith('JobCard/')) {
      const jobId = parseInt(page.split('/')[1]);
      if (!isNaN(jobId)) {
        setSelectedJobId(jobId);
        setShowJobDrawer(true);
        return;
      }
    }

    // ✅ Main map
    // NOTE: includes aliases so existing buttons in other screens still work
    const pageMap: Record<string, ViewType> = {
      // Primary labels
      Dashboard: 'dashboard',
      Messages: 'messages',
      Clients: 'clients',
      Calendar: 'calendar',
      Quotes: 'quotes',
      Contracts: 'contracts',
      WorkOrders: 'work-orders',
      Jobs: 'jobs',
      Photos: 'photos',
      Items: 'items',
      Vendors: 'vendors',
      Settings: 'settings',
      Communications: 'communications',
      'P4P Growth': 'p4p-growth',
      'Employee Portal': 'employee-portal',

      // ✅ Aliases (safe / non-breaking)
      // MyJobScreen + other screens often call these
      P4P: 'p4p-growth',
      TimeSheet: 'time-sheet',
      'Time Sheet': 'time-sheet',
      'Time Logs': 'time-sheet',
      PhotoPage: 'photos',
      PhotosPage: 'photos'
    };

    setCurrentView(pageMap[page] || 'dashboard');
  };

  /* ---------------- Admin Content ---------------- */

  const renderAdminContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <FullDashboard onNavigate={handleNavigate} onLogout={() => {}} user={user} />;

      case 'clients':
        return <ClientsPage onNavigate={handleNavigate} />;

      case 'client-details':
        return <ClientDetailsPage clientId={selectedClientId} onNavigate={handleNavigate} />;

      case 'calendar':
        return <CalendarPage onNavigate={handleNavigate} />;

      case 'messages':
        return <MessagesPage onNavigate={handleNavigate} />;

      case 'communications':
        return <CommunicationHubPage onNavigate={handleNavigate} />;

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

      case 'p4p-growth':
        return <P4PGrowthPage />;

      case 'employee-portal':
        // ✅ KEY FIX: pass admin navigation into employee portal so MyJobScreen can jump to admin PhotosPage
        return <EmployeePortal onNavigate={handleNavigate} />;

      default:
        return <FullDashboard onNavigate={handleNavigate} onLogout={() => {}} user={user} />;
    }
  };

  /* ---------------- Render ---------------- */

  if (!isLoggedIn) {
    return <AdminLoginPage onLogin={() => {}} error="" isLoading={false} />;
  }

  return (
    <main>
      {currentPortal === 'customer' ? <AppRoutes /> : renderAdminContent()}

      <JobCardDrawer
        isOpen={showJobDrawer}
        appointmentId={selectedJobId}
        onClose={() => {
          setShowJobDrawer(false);
          setSelectedJobId(null);
        }}
        onNavigate={handleNavigate}
      />
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
