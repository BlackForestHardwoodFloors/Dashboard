import React from 'react';
import { 
  createBrowserRouter, 
  RouterProvider, 
  Navigate 
} from 'react-router-dom';

// Import page components
import DashboardPage from '../features/dashboard/DashboardPage';
import ClientsPage from '../features/clients/ClientsPage';
import ProjectsPage from '../features/projects/ProjectsPage';
import SchedulePage from '../features/schedule/SchedulePage';
import SettingsPage from '../features/settings/SettingsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/clients',
    element: <ClientsPage />,
  },
  {
    path: '/projects',
    element: <ProjectsPage />,
  },
  {
    path: '/schedule',
    element: <SchedulePage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
]);

const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;