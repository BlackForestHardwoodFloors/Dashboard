import axios from 'axios';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example service for clients
export const clientService = {
  async getClients() {
    const response = await api.get('/clients');
    return response.data;
  },

  async createClient(clientData: any) {
    const response = await api.post('/clients', clientData);
    return response.data;
  },
};

// Example service for projects
export const projectService = {
  async getProjects() {
    const response = await api.get('/projects');
    return response.data;
  },

  async createProject(projectData: any) {
    const response = await api.post('/projects', projectData);
    return response.data;
  },
};

export default api;