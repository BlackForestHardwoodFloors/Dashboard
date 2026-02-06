import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CustomerPortalLayout from './CustomerPortalLayout';
import CustomerPortalJobDashboard from './CustomerPortalJobDashboard';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/Mode/Customer" element={<CustomerPortalLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<div>Customer Dashboard</div>} />
        <Route path="jobs/:jobId" element={<CustomerPortalJobDashboard />} />
        <Route path="faq" element={<div>Customer FAQs</div>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;