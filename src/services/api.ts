// src/services/api.ts
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add interceptor to add token to every request
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                console.log('Interceptor - Token from localStorage:', token ? token.substring(0, 50) + '...' : 'No token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                    console.log('Interceptor - Added Authorization header');
                } else {
                    console.log('Interceptor - No token found');
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor for handling 401
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    console.log('Interceptor - 401 Unauthorized, clearing token');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    async request(endpoint: string, options?: any) {
        try {
            console.log(`Making request to: ${endpoint}`);
            const response = await this.axiosInstance.request({
                url: endpoint,
                ...options,
            });
            console.log(`Response from ${endpoint}:`, response.status);
            return response.data;
        } catch (error: any) {
            console.error(`Error in request to ${endpoint}:`, error.response?.status, error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || 'Request failed',
            };
        }
    }

    // ============================================
    // AUTH ENDPOINTS
    // ============================================
    
    async login(email: string, password: string) {
        console.log('Login attempt:', email);
        const response = await this.request('/auth/login', {
            method: 'POST',
            data: { email, password },
        });
        
        console.log('Login response success:', response.success);
        
        if (response.success && response.data?.token) {
            console.log('Storing token in localStorage');
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
            console.log('Token stored successfully');
        }
        
        return response;
    }

    async getProfile() {
        console.log('Getting profile...');
        return this.request('/auth/me');
    }

    async logout() {
        console.log('Logging out - clearing storage');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    // ============================================
    // REQUISITION ENDPOINTS
    // ============================================
    
    async getRequisitions(params?: any) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/requisitions${queryString ? `?${queryString}` : ''}`);
    }

    async getRequisitionById(id: number) {
        return this.request(`/requisitions/${id}`);
    }

    async createRequisition(data: any) {
        return this.request('/requisitions', {
            method: 'POST',
            data,
        });
    }

    async updateRequisition(id: number, data: any) {
        return this.request(`/requisitions/${id}`, {
            method: 'PUT',
            data,
        });
    }

    async submitRequisition(id: number) {
        return this.request(`/requisitions/${id}/submit`, {
            method: 'POST',
        });
    }

    async approveRequisition(id: number) {
        return this.request(`/requisitions/${id}/approve`, {
            method: 'PUT',
        });
    }

    async rejectRequisition(id: number, reason: string) {
        return this.request(`/requisitions/${id}/reject`, {
            method: 'PUT',
            data: { reason },
        });
    }

    async fulfillRequisition(id: number) {
        return this.request(`/requisitions/${id}/fulfill`, {
            method: 'PUT',
        });
    }

    async cancelRequisition(id: number) {
        return this.request(`/requisitions/${id}/cancel`, {
            method: 'PUT',
        });
    }

    async deleteRequisition(id: number) {
        return this.request(`/requisitions/${id}`, {
            method: 'DELETE',
        });
    }

    async getRequisitionStats() {
        return this.request('/requisitions/stats/summary');
    }

    // ============================================
    // CATALOG ENDPOINTS
    // ============================================
    
    async getCatalog(params?: any) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/catalog${queryString ? `?${queryString}` : ''}`);
    }

    async getCatalogItemById(id: number) {
        return this.request(`/catalog/${id}`);
    }

    async createCatalogItem(data: any) {
        return this.request('/catalog', {
            method: 'POST',
            data,
        });
    }

    async updateCatalogItem(id: number, data: any) {
        return this.request(`/catalog/${id}`, {
            method: 'PUT',
            data,
        });
    }

    async deleteCatalogItem(id: number) {
        return this.request(`/catalog/${id}`, {
            method: 'DELETE',
        });
    }

    async getCatalogStats() {
        return this.request('/catalog/stats/summary');
    }

    // ============================================
    // INVENTORY ENDPOINTS
    // ============================================
    
    async getInventory(params?: any) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/inventory${queryString ? `?${queryString}` : ''}`);
    }

    async getInventoryByCatalog(catalogId: number) {
        return this.request(`/inventory/catalog/${catalogId}`);
    }

    async getLowStock() {
        return this.request('/inventory/low-stock');
    }

    async getInventoryValue() {
        return this.request('/inventory/value');
    }

    async updateInventoryQuantity(catalogId: number, quantity: number, operation: string = 'set') {
        return this.request(`/inventory/${catalogId}/quantity`, {
            method: 'PUT',
            data: { quantity, operation },
        });
    }

    async createOrUpdateInventory(data: any) {
        return this.request('/inventory', {
            method: 'POST',
            data,
        });
    }

    async reserveInventory(catalogId: number, quantity: number, requisitionId?: number) {
        return this.request(`/inventory/${catalogId}/reserve`, {
            method: 'POST',
            data: { quantity, requisition_id: requisitionId },
        });
    }

    async releaseInventory(catalogId: number, quantity: number, requisitionId?: number) {
        return this.request(`/inventory/${catalogId}/release`, {
            method: 'POST',
            data: { quantity, requisition_id: requisitionId },
        });
    }

    // ============================================
    // ASSET ENDPOINTS
    // ============================================
    
    async getAssets(params?: any) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/assets${queryString ? `?${queryString}` : ''}`);
    }

    async getMyAssets() {
        return this.request('/assets?assigned_to=me');
    }

    async getAllAssets(params?: any) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/assets${queryString ? `?${queryString}` : ''}`);
    }

    async getAssetById(id: number) {
        return this.request(`/assets/${id}`);
    }

    async createAsset(data: any) {
        return this.request('/assets', {
            method: 'POST',
            data,
        });
    }

    async updateAsset(id: number, data: any) {
        return this.request(`/assets/${id}`, {
            method: 'PUT',
            data,
        });
    }

    async assignAsset(assetId: number, userId: number, requisitionId?: number, notes?: string) {
        return this.request(`/assets/${assetId}/assign`, {
            method: 'POST',
            data: { user_id: userId, requisition_id: requisitionId, notes },
        });
    }

    async returnAsset(assetId: number, condition?: string, notes?: string) {
        return this.request(`/assets/${assetId}/return`, {
            method: 'POST',
            data: { condition, notes },
        });
    }

    async deleteAsset(id: number) {
        return this.request(`/assets/${id}`, {
            method: 'DELETE',
        });
    }

    async getAssetStats() {
        return this.request('/assets/stats/summary');
    }

    async getAssetsByUser(userId: number) {
        return this.request(`/assets/user/${userId}`);
    }

    // ============================================
    // USER & DEPARTMENT ENDPOINTS
    // ============================================
    
    async getUsers(params?: any) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/users${queryString ? `?${queryString}` : ''}`);
    }

    async getUserById(id: number) {
        return this.request(`/users/${id}`);
    }

    async createUser(userData: any) {
        return this.request('/users', {
            method: 'POST',
            data: userData,
        });
    }

    async updateUser(id: number, data: any) {
        return this.request(`/users/${id}`, {
            method: 'PUT',
            data,
        });
    }

    async deleteUser(id: number) {
        return this.request(`/users/${id}`, {
            method: 'DELETE',
        });
    }

    async resetUserPassword(id: number) {
        return this.request(`/users/${id}/reset-password`, {
            method: 'POST',
        });
    }

    async getDepartments() {
        return this.request('/users/departments');
    }

    async createDepartment(data: any) {
        return this.request('/users/departments', {
            method: 'POST',
            data,
        });
    }

    async updateDepartment(id: number, data: any) {
        return this.request(`/users/departments/${id}`, {
            method: 'PUT',
            data,
        });
    }

    async deleteDepartment(id: number) {
        return this.request(`/users/departments/${id}`, {
            method: 'DELETE',
        });
    }

    async getDepartmentBudget(id: number) {
        return this.request(`/users/departments/${id}/budget`);
    }
}

export default new ApiService();