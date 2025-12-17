import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { FullDashboard } from './components/FullDashboard';
import TimeLogsPage from './components/TimeLogsPage';
import ClientsPage from './components/ClientsPage';
import CalendarPage from './components/CalendarPage';
import PhotosPage from './components/PhotosPage';
import MessagesPage from './components/MessagesPage';
import QuotesPage from './components/QuotesPage';
import ContractsPage from './components/ContractsPage';
import JobsPage from './components/JobsPage';
import { JobCard } from './components/JobCard';
import WorkOrdersPage from './components/WorkOrdersPage';
import ItemsPage from './components/ItemsPage';
import VendorsPage from './components/VendorsPage';
import SettingsPage from './components/SettingsPage';
import AdminLoginPage from './components/AdminLoginPage';
import EmployeeLoginPage from './components/EmployeeLoginPage';
import CustomerLoginPage from './components/CustomerLoginPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { EmployeePortal } from './components/EmployeePortal';
import './styles/globals.css';

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
  | 'job-card'
  | 'photos'
  | 'time-sheet' 
  | 'items'
  | 'vendors'
  | 'reviews'
  | 'settings';

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
  const { theme, toggleTheme, colors } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPortal, setCurrentPortal] = useState<PortalType>('admin');
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [loginPage, setLoginPage] = useState<LoginPageType>(null);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  // Detect which login page to show based on URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin/login' || path === '/admin/login/') {
      setLoginPage('admin-login');
    } else if (path === '/employee/login' || path === '/employee/login/') {
      setLoginPage('employee-login');
    } else if (path === '/customer/login' || path === '/customer/login/') {
      setLoginPage('customer-login');
    } else if (path === '/' || path === '') {
      // Default to admin login
      setLoginPage('admin-login');
    }

    // Check for existing session
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
      setCurrentPortal(parsedUser.portalType || 'admin');
    }
  }, []);

  // Handle login
  const handleLogin = async (email: string, password: string, portalType: PortalType) => {
    setIsLoading(true);
    setLoginError('');

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Add portal type to user data
        const userData = { ...data.user, portalType };
        
        // Store token and user
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        setCurrentPortal(portalType);
        setIsLoggedIn(true);
        setLoginError('');
        
        // Update URL without reload
        window.history.pushState({}, '', '/');
      } else {
        setLoginError(data.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Network error. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    setCurrentView('dashboard');
    
    // Redirect based on portal type
    if (currentPortal === 'employee') {
      window.location.href = '/employee/login';
    } else if (currentPortal === 'customer') {
      window.location.href = '/customer/login';
    } else {
      window.location.href = '/admin/login';
    }
  };

  // Enhanced navigation handler that maps page names to views
  const handleNavigate = (page: string) => {
    // Handle JobCard navigation with ID (e.g., "JobCard/123")
    if (page.startsWith('JobCard/')) {
      const jobId = parseInt(page.split('/')[1]);
      if (!isNaN(jobId)) {
        setSelectedJobId(jobId);
        setCurrentView('job-card');
        return;
      }
    }

    const pageMap: Record<string, ViewType> = {
      'Dashboard': 'dashboard',
      'Messages': 'messages',
      'Clients': 'clients',
      'Clients/Contractors': 'clients',
      'Clients/Locations': 'clients',
      'Clients/Company': 'clients',
      'Calendar': 'calendar',
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
      'Client': 'clients',
    };

    // Handle mode switching
    if (page === 'Mode/Admin') {
      setCurrentPortal('admin');
      return;
    } else if (page === 'Mode/Employee') {
      setCurrentPortal('employee');
      return;
    } else if (page === 'Mode/Customer') {
      setCurrentPortal('customer');
      return;
    }

    // Handle logout
    if (page === 'Logout') {
      handleLogout();
      return;
    }

    const view = pageMap[page] || 'dashboard';
    setCurrentView(view);
  };

  // Render the appropriate page based on currentView
  const renderAdminContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <FullDashboard onNavigate={handleNavigate} onLogout={handleLogout} user={user} />;
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
      case 'job-card':
        return <JobCard jobId={selectedJobId} onNavigate={handleNavigate} onBack={() => setCurrentView('jobs')} />;
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
        return (
          <div style={{ marginLeft: '200px', padding: '24px', minHeight: '100vh', backgroundColor: colors.bgPrimary }}>
            <h1 style={{ color: colors.textPrimary, fontSize: '28px', marginBottom: '8px' }}>Reviews</h1>
            <p style={{ color: colors.textSecondary }}>Reviews page coming soon...</p>
          </div>
        );
      default:
        return <FullDashboard onNavigate={handleNavigate} onLogout={handleLogout} user={user} />;
    }
  };

  // Customer Portal Content
  const renderCustomerContent = () => {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#F5F7FA',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#333', marginBottom: '16px' }}>Welcome, {user?.firstName}!</h1>
        <p style={{ color: '#666', fontSize: '16px', marginBottom: '24px' }}>
          Your Customer Portal is being set up.
        </p>
        <button
          onClick={handleLogout}
          style={{
            padding: '12px 24px',
            backgroundColor: '#2196F3',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Log Out
        </button>
      </div>
    );
  };

  // If not logged in, show appropriate login page
  if (!isLoggedIn) {
    if (loginPage === 'employee-login') {
      return (
        <EmployeeLoginPage 
          onLogin={(email, password) => handleLogin(email, password, 'employee')} 
          error={loginError}
          isLoading={isLoading}
        />
      );
    }
    
    if (loginPage === 'customer-login') {
      return (
        <CustomerLoginPage 
          onLogin={(email, password) => handleLogin(email, password, 'customer')} 
          error={loginError}
          isLoading={isLoading}
        />
      );
    }
    
    // Default to admin login
    return (
      <AdminLoginPage 
        onLogin={(email, password) => handleLogin(email, password, 'admin')} 
        error={loginError}
        isLoading={isLoading}
      />
    );
  }

  return (
    <main role="main" aria-label={`${currentPortal} Portal content`}>
      {currentPortal === 'customer' ? (
        renderCustomerContent()
      ) : currentPortal === 'employee' ? (
        <EmployeePortal />
      ) : (
        renderAdminContent()
      )}
    </main>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
