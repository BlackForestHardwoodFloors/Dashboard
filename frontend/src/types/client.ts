export interface Client {
  id?: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  email?: string;
  phone?: string;
  clientType: 'Homeowner' | 'Contractor' | 'Realtor' | 'Designer' | 'Property Manager' | 'Other';
  companyName?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateClientDTO extends Omit<Client, 'id' | 'createdAt' | 'updatedAt'> {}

export interface ClientResponse {
  data: Client[];
  total: number;
  page: number;
  limit: number;
}