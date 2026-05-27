// src/services/mockData.ts - Direct MySQL Database Connection
// This file connects directly to your backend API which connects to MySQL
import apiService from './api';
import toast from 'react-hot-toast';

// ============================================
// REQUISITION FUNCTIONS - Direct to MySQL
// ============================================

export const fetchRequisitions = async (params?: any) => {
    try {
        console.log('📋 Fetching requisitions from MySQL...');
        const response = await apiService.getRequisitions(params);
        
        if (response.success && response.data) {
            // Transform database response to match frontend expected format
            return response.data.requisitions.map((req: any) => ({
                id: req.id,
                req_number: req.requisition_number,
                requester_name: req.requester_name,
                department: req.department_name,
                created_at: req.created_at,
                total_cost: req.estimated_total || 0,
                status: req.status?.toUpperCase() || 'DRAFT',
                justification: req.description,
                items: req.items || [],
                approved_at: req.approved_date
            }));
        }
        return [];
    } catch (error) {
        console.error('❌ Failed to fetch requisitions from MySQL:', error);
        return [];
    }
};

export const fetchRequisitionById = async (id: number) => {
    try {
        console.log(`📋 Fetching requisition ${id} from MySQL...`);
        const response = await apiService.getRequisitionById(id);
        
        if (response.success && response.data) {
            const req = response.data;
            return {
                id: req.id,
                req_number: req.requisition_number,
                requester_name: req.requester_name,
                department: req.department_name,
                created_at: req.created_at,
                total_cost: req.estimated_total || 0,
                status: req.status?.toUpperCase() || 'DRAFT',
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
        throw new Error('Requisition not found in MySQL');
    } catch (error) {
        console.error('❌ Failed to fetch requisition from MySQL:', error);
        toast.error('Failed to load requisition');
        throw error;
    }
};

export const createRequisition = async (data: any) => {
    try {
        console.log('📝 Creating requisition in MySQL...', data);
        
        // First, get catalog items to map item names to catalog_ids
        const catalogResponse = await apiService.getCatalog({ limit: 100 });
        const catalogItems = catalogResponse.success ? catalogResponse.data.items : [];
        
        // Map frontend items to database format
        const items = data.items.map((item: any) => {
            // Try to find matching catalog item by name or type
            let catalogItem = catalogItems.find((c: any) => 
                c.name?.toLowerCase().includes(item.name?.toLowerCase()) ||
                c.category?.toLowerCase().includes(item.type?.toLowerCase())
            );
            
            // If no match found, use first catalog item or default
            if (!catalogItem && catalogItems.length > 0) {
                catalogItem = catalogItems[0];
            }
            
            return {
                catalog_id: catalogItem?.id || 1,
                quantity: item.quantity,
                estimated_price: 0,
                description: item.specifications || item.name
            };
        });
        
        const requisitionData = {
            title: data.justification.substring(0, 100),
            description: data.justification,
            department_id: null, // Will be set based on user's department
            priority: 'medium',
            items: items
        };
        
        const response = await apiService.createRequisition(requisitionData);
        
        if (response.success && response.data) {
            toast.success('Requisition created successfully in MySQL!');
            return { id: response.data.id };
        }
        throw new Error(response.message || 'Failed to create requisition');
    } catch (error) {
        console.error('❌ Failed to create requisition in MySQL:', error);
        toast.error('Failed to create requisition');
        throw error;
    }
};

export const approveRequisition = async (id: number) => {
    try {
        console.log(`✅ Approving requisition ${id} in MySQL...`);
        const response = await apiService.approveRequisition(id);
        
        if (response.success) {
            toast.success('Requisition approved in MySQL!');
            return response;
        }
        throw new Error(response.message || 'Failed to approve');
    } catch (error) {
        console.error('❌ Failed to approve requisition in MySQL:', error);
        toast.error('Failed to approve requisition');
        throw error;
    }
};

export const rejectRequisition = async (id: number, reason?: string) => {
    try {
        console.log(`❌ Rejecting requisition ${id} in MySQL...`);
        const response = await apiService.rejectRequisition(id, reason || 'Rejected by approver');
        
        if (response.success) {
            toast.success('Requisition rejected in MySQL');
            return response;
        }
        throw new Error(response.message || 'Failed to reject');
    } catch (error) {
        console.error('❌ Failed to reject requisition in MySQL:', error);
        toast.error('Failed to reject requisition');
        throw error;
    }
};

// ============================================
// INVENTORY FUNCTIONS - Direct to MySQL
// ============================================

export const fetchInventory = async () => {
    try {
        console.log('📦 Fetching inventory from MySQL...');
        const response = await apiService.getInventory({ limit: 100 });
        
        if (response.success && response.data && response.data.inventory) {
            // Transform database response to match frontend expected format
            return response.data.inventory.map((item: any) => ({
                id: item.catalog_id,
                name: item.catalog_name || 'Unknown Item',
                code: item.catalog_code || 'N/A',
                type: item.category || 'Uncategorized',
                quantity: (item.quantity_on_hand || 0) + (item.quantity_reserved || 0),
                reserved: item.quantity_reserved || 0,
                available: item.quantity_available || 0,
                location: item.location || 'Warehouse'
            }));
        }
        return [];
    } catch (error) {
        console.error('❌ Failed to fetch inventory from MySQL:', error);
        toast.error('Failed to load inventory');
        return [];
    }
};

export const updateInventory = async (id: number, newAvailable: number) => {
    try {
        console.log(`📦 Updating inventory ${id} in MySQL to ${newAvailable}...`);
        const response = await apiService.updateInventoryQuantity(id, newAvailable, 'set');
        
        if (response.success) {
            toast.success('Inventory updated in MySQL!');
            return response;
        }
        throw new Error('Failed to update inventory');
    } catch (error) {
        console.error('❌ Failed to update inventory in MySQL:', error);
        toast.error('Failed to update inventory');
        throw error;
    }
};

// ============================================
// ASSET FUNCTIONS - Direct to MySQL
// ============================================

export const fetchMyAssets = async () => {
    try {
        console.log('🔧 Fetching my assets from MySQL...');
        const response = await apiService.getMyAssets();
        
        if (response.success && response.data) {
            // Transform database response to match frontend expected format
            return response.data.assets?.map((asset: any) => ({
                id: asset.id,
                asset_tag: asset.asset_tag,
                name: asset.catalog_name,
                type: asset.model || 'Asset',
                serial_number: asset.serial_number || 'N/A',
                status: asset.status?.charAt(0).toUpperCase() + asset.status?.slice(1) || 'Available',
                assigned_to: asset.assigned_to_name,
                department: null,
                assigned_date: asset.created_at,
                purchase_cost: asset.purchase_cost || 0
            })) || [];
        }
        return [];
    } catch (error) {
        console.error('❌ Failed to fetch my assets from MySQL:', error);
        return [];
    }
};

export const fetchAllAssets = async () => {
    try {
        console.log('🔧 Fetching all assets from MySQL...');
        const response = await apiService.getAllAssets({ limit: 100 });
        
        if (response.success && response.data) {
            return response.data.assets?.map((asset: any) => ({
                id: asset.id,
                asset_tag: asset.asset_tag,
                name: asset.catalog_name,
                type: asset.model || 'Asset',
                serial_number: asset.serial_number || 'N/A',
                status: asset.status?.charAt(0).toUpperCase() + asset.status?.slice(1) || 'Available',
                assigned_to: asset.assigned_to_name,
                department: null,
                assigned_date: asset.created_at,
                purchase_cost: asset.purchase_cost || 0
            })) || [];
        }
        return [];
    } catch (error) {
        console.error('❌ Failed to fetch all assets from MySQL:', error);
        return [];
    }
};

// ============================================
// CATALOG FUNCTIONS - Direct to MySQL
// ============================================

export const fetchCatalog = async () => {
    try {
        console.log('📚 Fetching catalog from MySQL...');
        const response = await apiService.getCatalog({ limit: 100 });
        
        if (response.success && response.data) {
            return response.data.items;
        }
        return [];
    } catch (error) {
        console.error('❌ Failed to fetch catalog from MySQL:', error);
        return [];
    }
};

// ============================================
// DASHBOARD STATS - Direct from MySQL
// ============================================

export const getDashboardStats = async () => {
    try {
        console.log('📊 Fetching dashboard stats from MySQL...');
        const [reqStats, assetStats] = await Promise.all([
            apiService.getRequisitionStats(),
            apiService.getAssetStats()
        ]);
        
        return {
            totalRequisitions: reqStats.success ? reqStats.data?.total || 0 : 0,
            pendingApprovals: reqStats.success ? reqStats.data?.pending || 0 : 0,
            totalAssets: assetStats.success ? assetStats.data?.total_assets || 0 : 0
        };
    } catch (error) {
        console.error('❌ Failed to fetch dashboard stats from MySQL:', error);
        return {
            totalRequisitions: 0,
            pendingApprovals: 0,
            totalAssets: 0
        };
    }
};

// ============================================
// REPORTING FUNCTIONS - Direct from MySQL
// ============================================

export const getStatusCount = (status: string, requisitions: any[]) => {
    return requisitions.filter(r => r.status === status).length;
};

export const getTotalSpending = (requisitions: any[]) => {
    return requisitions.reduce((sum, r) => sum + (r.total_cost || 0), 0);
};

export const getAverageRequestValue = (requisitions: any[]) => {
    if (requisitions.length === 0) return 0;
    return getTotalSpending(requisitions) / requisitions.length;
};

// ============================================
// HELPER FUNCTIONS - Direct from MySQL
// ============================================

export const getLowStockItems = async () => {
    try {
        console.log('⚠️ Fetching low stock items from MySQL...');
        const response = await apiService.getLowStock();
        if (response.success && response.data) {
            return response.data;
        }
        return [];
    } catch (error) {
        console.error('❌ Failed to fetch low stock items from MySQL:', error);
        return [];
    }
};

export const getInventoryValue = async () => {
    try {
        console.log('💰 Fetching inventory value from MySQL...');
        const response = await apiService.getInventoryValue();
        if (response.success && response.data) {
            return response.data;
        }
        return { total_value: 0, reserved_value: 0, available_value: 0 };
    } catch (error) {
        console.error('❌ Failed to fetch inventory value from MySQL:', error);
        return { total_value: 0, reserved_value: 0, available_value: 0 };
    }
};