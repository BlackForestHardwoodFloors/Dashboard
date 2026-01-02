import React from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { clientService, projectService } from '../../services/api';

const DashboardPage: React.FC = () => {
  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: clientService.getClients,
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectService.getProjects,
  });

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-boardroom-accent mb-6">
          Dashboard
        </h1>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Clients</h2>
            <p className="text-gray-400">
              {clientsLoading 
                ? 'Loading...' 
                : `Total Clients: ${clients?.length || 0}`
              }
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Projects</h2>
            <p className="text-gray-400">
              {projectsLoading 
                ? 'Loading...' 
                : `Active Projects: ${projects?.length || 0}`
              }
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Upcoming</h2>
            <p className="text-gray-400">No upcoming events</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;