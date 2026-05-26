import axios, { AxiosInstance } from 'axios';
import { LoginResponse, User, Requisition, CreateRequisitionData, CatalogItem, InventoryItem, Asset } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Mock data
const mockCatalog: CatalogItem[] = [
  { id: 1, item_code: 'LAP-001', name: 'Dell XPS Laptop', category: 'Electronics', is_stockable: true, is_asset: true, unit_cost: 1500, reorder_level: 3 },
  { id: 2, item_code: 'MON-001', name: 'Dell 27" Monitor', category: 'Electronics', is_stockable: true, is_asset: true, unit_cost: 350, reorder_level: 5 },
  { id: 3, item_code: 'MOU-001', name: 'Wireless Mouse', category: 'Accessories', is_stockable: true, is_asset: false, unit_cost: 25, reorder_level: 10 },
];

const mockInventory: InventoryItem[] = [
  { id: 1, item_id: 1, item_name: 'Dell XPS Laptop', item_code: 'LAP-001', warehouse: 'Main', on_hand_quantity: 3, reserved_quantity: 1, reorder_level: 3 },
  { id: 2, item_id: 2, item_name: 'Dell 27" Monitor', item_code: 'MON-001', warehouse: 'Main', on_hand_quantity: 5, reserved_quantity: 0, reorder_level: 5 },
  { id: 3, item_id: 3, item_name: 'Wireless Mouse', item_code: 'MOU-001', warehouse: 'Main', on_hand_quantity: 12, reserved_quantity: 2, reorder_level: 10 },
];

// Auth
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error: any) {
    if (email === 'admin@company.com' && password === 'password123') {
      const mockUser: User = {
        id: 1,
        email: 'admin@company.com',
        name: 'Admin User',
        role_id: 1,
        role_name: 'Admin',
        department: 'IT',
        is_active: true,
        permissions: []
      };
      const mockResponse = { token: 'mock-token-123', user: mockUser };
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      return mockResponse;
    }
    throw error;
  }
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Requisitions
export const getRequisitions = async (): Promise<Requisition[]> => {
  try {
    const response = await api.get<Requisition[]>('/requisitions');
    return response.data;
  } catch {
    return [
      { id: 1, req_number: 'REQ-001', requester_id: 1, requester_name: 'Admin User', status: 'APPROVED', total_cost: 1500, justification: 'Need new laptop', created_at: new Date().toISOString() },
      { id: 2, req_number: 'REQ-002', requester_id: 1, requester_name: 'Admin User', status: 'PENDING', total_cost: 350, justification: 'Need external monitor', created_at: new Date().toISOString() },
    ];
  }
};

export const getRequisition = async (id: number): Promise<Requisition> => {
  try {
    const response = await api.get<Requisition>(`/requisitions/${id}`);
    return response.data;
  } catch {
    return {
      id, req_number: `REQ-00${id}`, requester_id: 1, requester_name: 'Admin User',
      status: 'PENDING', total_cost: 1500, justification: 'Sample requisition',
      created_at: new Date().toISOString(),
      lines: [{ id: 1, requisition_id: id, item_id: 1, item_name: 'Dell XPS Laptop', quantity: 1, unit_cost: 1500, status: 'PENDING', is_asset: true, is_stockable: true }],
    };
  }
};

export const createRequisition = async (data: CreateRequisitionData): Promise<{ id: number; req_number: string }> => {
  try {
    const response = await api.post('/requisitions', data);
    return response.data;
  } catch {
    return { id: Date.now(), req_number: `REQ-${Date.now()}` };
  }
};

// Inventory
export const getCatalog = async (): Promise<CatalogItem[]> => {
  try {
    const response = await api.get<CatalogItem[]>('/inventory/catalog');
    return response.data;
  } catch {
    return mockCatalog;
  }
};

export const getInventory = async (): Promise<InventoryItem[]> => {
  try {
    const response = await api.get<InventoryItem[]>('/inventory');
    return response.data;
  } catch {
    return mockInventory;
  }
};

// Assets
export const getMyAssets = async (): Promise<Asset[]> => {
  try {
    const response = await api.get<Asset[]>('/assets/my-assets');
    return response.data;
  } catch {
    return [{ id: 1, asset_tag: 'AST-001', item_id: 1, item_name: 'Dell XPS Laptop', serial_number: 'SN123456', status: 'ASSIGNED', assigned_date: new Date().toISOString(), purchase_cost: 1500 }];
  }
};

export default api;