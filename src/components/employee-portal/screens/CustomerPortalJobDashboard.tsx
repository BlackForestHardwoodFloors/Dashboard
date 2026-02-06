import React from 'react';
import { useParams } from 'react-router-dom';

const CustomerPortalJobDashboard: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();

  return (
    <div className="customer-portal-job-dashboard">
      <h1>Job Dashboard for Job {jobId}</h1>
      {/* Placeholder content */}
    </div>
  );
};

export default CustomerPortalJobDashboard;