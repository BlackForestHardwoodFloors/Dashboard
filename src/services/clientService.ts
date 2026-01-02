import axios from 'axios';

// Define an interface for the client data structure
export interface ClientSaveRequest {
  // Fields matching the backend Contact model
  clientSource: 'Direct' | 'Contractor' | 'Homeowner' | 'Realtor' | 'Designer' | 'Property Manager' | 'Other';
  firstName: string;
  lastName?: string;
  displayName: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;

  // Optional fields from BoardroomNewClientModal
  secondHomeowner?: string;
  companyName?: string;
  otherClientTypeLabel?: string;
  email?: string;
  
  // Additional fields you want to include
  leadSource?: string;
  tags?: string[];
  
  // More detailed contact information
  phoneNumbers?: Array<{ 
    number: string; 
    type: string; 
    name?: string 
  }>;
  emailAddresses?: Array<{ 
    email: string; 
    name?: string 
  }>;
}

export const clientService = {
  async saveClient(clientData: ClientSaveRequest): Promise<any> {
    try {
      // Validate required fields
      if (!clientData.firstName) {
        throw new Error('First Name is required');
      }
      if (!clientData.phone) {
        throw new Error('Phone number is required');
      }
      if (!clientData.streetAddress || !clientData.city || !clientData.state || !clientData.zip) {
        throw new Error('Complete address is required');
      }

      // Make API call to save client
      const response = await axios.post('/api/contacts', clientData, {
        headers: {
          'Content-Type': 'application/json',
          // Add authentication token if required
          // 'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      return response.data;
    } catch (error) {
      // Handle different types of errors
      if (axios.isAxiosError(error)) {
        // Backend specific error
        if (error.response) {
          throw new Error(
            error.response.data.message || 
            'Failed to save client. Please try again.'
          );
        }
        // Network error
        throw new Error('Network error. Please check your connection.');
      }
      
      // Generic error
      throw error;
    }
  },

  // Additional methods can be added here
  async getClient(id: string) {
    try {
      const response = await axios.get(`/api/contacts/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateClient(id: string, clientData: ClientSaveRequest) {
    try {
      const response = await axios.put(`/api/contacts/${id}`, clientData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};