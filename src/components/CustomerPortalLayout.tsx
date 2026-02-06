import React from 'react';
import { Outlet } from 'react-router-dom';

const CustomerPortalLayout: React.FC = () => {
  return (
    <div className="customer-portal-container">
      <div className="customer-portal-content">
        <Outlet />
      </div>
    </div>
  );
};

export default CustomerPortalLayout;