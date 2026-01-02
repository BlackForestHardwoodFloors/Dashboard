import React from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { clientService } from '../../services/api';
import { Client } from '../../types/client';

const ClientsPage: React.FC = () => {
  const { data: clientsData, isLoading, isError } = useQuery({
    queryKey: ['clients', 1, 10],
    queryFn: () => clientService.getClients(1, 10),
  });

  const renderClientRow = (client: Client) => (
    <tr key={client.id} className="border-b border-gray-700">
      <td className="px-4 py-3">{client.displayName || `${client.firstName} ${client.lastName}`}</td>
      <td className="px-4 py-3">{client.email || 'N/A'}</td>
      <td className="px-4 py-3">{client.phone || 'N/A'}</td>
      <td className="px-4 py-3">{client.clientType}</td>
      <td className="px-4 py-3">
        <button 
          className="bg-boardroom-accent text-black px-3 py-1 rounded-lg hover:bg-opacity-80"
        >
          View Details
        </button>
      </td>
    </tr>
  );

  return (
    <DashboardLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-boardroom-accent">
            Clients
          </h1>
          <button className="bg-boardroom-accent text-black px-4 py-2 rounded-lg">
            Add New Client
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-center text-gray-400">
              Loading clients...
            </div>
          ) : isError ? (
            <div className="p-6 text-center text-red-400">
              Error loading clients
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clientsData?.data.map(renderClientRow)}
              </tbody>
            </table>
          )}
          
          {!isLoading && clientsData?.total === 0 && (
            <div className="p-6 text-center text-gray-400">
              No clients found. Add a new client to get started.
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-gray-400">
            Total Clients: {clientsData?.total || 0}
          </span>
          <div className="space-x-2">
            <button 
              disabled 
              className="bg-gray-700 text-gray-400 px-3 py-1 rounded-lg"
            >
              Previous
            </button>
            <button 
              disabled 
              className="bg-gray-700 text-gray-400 px-3 py-1 rounded-lg"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientsPage;