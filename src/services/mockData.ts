// src/services/mockData.ts - Real API integration
import apiService from './api';
import toast from 'react-hot-toast';

// ============================================
// REQUISITION FUNCTIONS
// ============================================

export const fetchRequisitions = async (params?: any) => {
    try {
        const response = await apiService.getRequisitions(params);
        if (response.success && response.data) {
            return response.data.requisitions.map((req: any) => ({
                id: req.id,
                req_number: req.requisition_number,
                requester_name: req.requester_name,
                department: req.department_name,
                created_at: req.created_at,
                total_cost: req.estimated_total,
                status: req.status.toUpperCase(),
                justification: req.description,
                items: req.items || [],
                approved_at: req.approved_date
            }));
        }
        return [];
    } catch (error) {
        console.error('Failed to fetch requisitions:', error);
        toast.error('Failed to load requisitions');
        return [];
    }
};

export const fetchRequisitionById = async (id: number) => {
    try {
        const response = await apiService.getRequisitionById(id);
        if (response.success && response.data) {
            const req = response.data;
            return {
                id: req.id,
                req_number: req.requisition_number,
                requester_name: req.requester_name,
                department: req.department_name,
                created_at: req.created_at,
                total_cost: req.estimated_total,
                status: req.status.toUpperCase(),
                justification: req.description,
                items: req.items?.map((item: any) => ({
                    id: item.id,
                    item_name: item.catalog_name,
                    item_type: item.unit || 'item',
                    quantity: item.quantity,
                    specifications: item.description,
                    assigned_assets: []
                })) || [],
                approved_at: req.approved_date
            };
        }
        throw new Error('Requisition not found');
    } catch (error) {
        console.error('Failed to fetch requisition:', error);
        toast.error('Failed to load requisition');
        throw error;
    }
};

export const createRequisition = async (data: any) => {
    try {
        // First, get catalog items to map item types to catalog_ids
        const catalogResponse = await apiService.getCatalog({ limit: 100 });
        const catalogItems = catalogResponse.success ? catalogResponse.data.items : [];
        
        // Map items to catalog_ids
        const items = await Promise.all(data.items.map(async (item: any) => {
            // Try to find matching catalog item by name or type
            let catalogItem = catalogItems.find((c: any) => 
                c.name.toLowerCase().includes(item.name.toLowerCase()) ||
                c.category?.toLowerCase().includes(item.type.toLowerCase())
            );
            
            // If not found, create a temporary one (in production, you'd want to create it properly)
            if (!catalogItem) {
                // Use a default catalog item (you should have at least one in your DB)
                catalogItem = catalogItems[0];
            }
            
            return {
                catalog_id: catalogItem?.id || 1,
                quantity: item.quantity,
                estimated_price: 0,
                description: item.specifications || item.name
            };
        }));
        
        const requisitionData = {
            title: data.justification.substring(0, 100),
            description: data.justification,
            department_id: null,
            priority: 'medium',
            items: items
        };
        
        const response = await apiService.createRequisition(requisitionData);
        if (response.success && response.data) {
            toast.success('Requisition created successfully!');
            return { id: response.data.id };
        }
        throw new Error(response.message || 'Failed to create requisition');
    } catch (error) {
        console.error('Failed to create requisition:', error);
        toast.error('Failed to create requisition');
        throw error;
    }
};

export const approveRequisition = async (id: number) => {
    try {
        const response = await apiService.approveRequisition(id);
        if (response.success) {
            toast.success('Requisition approved successfully!');
            return response;
        }
        throw new Error(response.message || 'Failed to approve');
    } catch (error) {
        console.error('Failed to approve requisition:', error);
        toast.error('Failed to approve requisition');
        throw error;
    }
};

export const rejectRequisition = async (id: number, reason?: string) => {
    try {
        const response = await apiService.rejectRequisition(id, reason || 'Rejected by approver');
        if (response.success) {
            toast.success('Requisition rejected');
            return response;
        }
        throw new Error(response.message || 'Failed to reject');
    } catch (error) {
        console.error('Failed to reject requisition:', error);
        toast.error('Failed to reject requisition');
        throw error;
    }
};

// ============================================
// INVENTORY FUNCTIONS
// ============================================

export const fetchInventory = async () => {
    try {
        const response = await apiService.getInventory({ limit: 100 });
        if (response.success && response.data) {
            return response.data.inventory.map((item: any) => ({
                id: item.catalog_id,
                name: item.catalog_name,
                code: item.catalog_code,
                type: item.category || 'Other',
                quantity: item.quantity_on_hand + item.quantity_reserved,
                reserved: item.quantity_reserved,
                available: item.quantity_available,
                location: item.location || 'Warehouse'
            }));
        }
        return [];
    } catch (error) {
        console.error('Failed to fetch inventory:', error);
        toast.error('Failed to load inventory');
        return [];
    }
};

export const updateInventory = async (id: number, newAvailable: number) => {
    try {
        // Find the catalog_id for this inventory item
        const inventory = await fetchInventory();
        const item = inventory.find(i => i.id === id);
        if (item) {
            const response = await apiService.updateInventoryQuantity(item.id, newAvailable, 'set');
            if (response.success) {
                return response;
            }
        }
        throw new Error('Failed to update inventory');
    } catch (error) {
        console.error('Failed to update inventory:', error);
        toast.error('Failed to update inventory');
        throw error;
    }
};

// ============================================
// ASSET FUNCTIONS
// ============================================

export const fetchMyAssets = async () => {
    try {
        const response = await apiService.getMyAssets();
        if (response.success && response.data) {
            return response.data.assets?.map((asset: any) => ({
                id: asset.id,
                asset_tag: asset.asset_tag,
                name: asset.catalog_name,
                type: asset.model || 'Asset',
                serial_number: asset.serial_number || 'N/A',
                status: asset.status,
                assigned_to: asset.assigned_to_name,
                department: null,
                assigned_date: asset.created_at,
                purchase_cost: asset.purchase_cost
            })) || [];
        }
        return [];
    } catch (error) {
        console.error('Failed to fetch my assets:', error);
        toast.error('Failed to load assets');
        return [];
    }
};

export const fetchAllAssets = async () => {
    try {
        const response = await apiService.getAllAssets({ limit: 100 });
        if (response.success && response.data) {
            return response.data.assets?.map((asset: any) => ({
                id: asset.id,
                asset_tag: asset.asset_tag,
                name: asset.catalog_name,
                type: asset.model || 'Asset',
                serial_number: asset.serial_number || 'N/A',
                status: asset.status,
                assigned_to: asset.assigned_to_name,
                department: null,
                assigned_date: asset.created_at,
                purchase_cost: asset.purchase_cost
            })) || [];
        }
        return [];
    } catch (error) {
        console.error('Failed to fetch all assets:', error);
        toast.error('Failed to load assets');
        return [];
    }
};

// ============================================
// CATALOG FUNCTIONS
// ============================================

export const fetchCatalog = async () => {
    try {
        const response = await apiService.getCatalog({ limit: 100 });
        if (response.success && response.data) {
            return response.data.items;
        }
        return [];
    } catch (error) {
        console.error('Failed to fetch catalog:', error);
        return [];
    }
};

// ============================================
// DASHBOARD STATS
// ============================================

export const getDashboardStats = async () => {
    try {
        const [reqStats, assetStats, inventoryValue] = await Promise.all([
            apiService.getRequisitionStats(),
            apiService.getAssetStats(),
            apiService.getInventoryValue()
        ]);
        
        return {
            totalRequisitions: reqStats.success ? reqStats.data?.total || 0 : 0,
            pendingApprovals: reqStats.success ? reqStats.data?.pending || 0 : 0,
            totalAssets: assetStats.success ? assetStats.data?.total_assets || 0 : 0
        };
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        return {
            totalRequisitions: 0,
            pendingApprovals: 0,
            totalAssets: 0
        };
    }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getLowStockItems = async () => {
    try {
        const response = await apiService.getLowStock();
        if (response.success && response.data) {
            return response.data;
        }
        return [];
    } catch (error) {
        console.error('Failed to fetch low stock items:', error);
        return [];
    }
};

export const getInventoryValue = async () => {
    try {
        const response = await apiService.getInventoryValue();
        if (response.success && response.data) {
            return response.data;
        }
        return { total_value: 0, reserved_value: 0, available_value: 0 };
    } catch (error) {
        console.error('Failed to fetch inventory value:', error);
        return { total_value: 0, reserved_value: 0, available_value: 0 };
    }
};