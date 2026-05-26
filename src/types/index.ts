// User types with permissions
export interface User {
  id: number;
  email: string;
  name: string;
  role_id: number;
  role_name: string;
  department: string;
  is_active: boolean;
  last_login?: string;
  created_at?: string;
  permissions?: UserPermission[];
}

export interface UserPermission {
  id: number;
  user_id: number;  // Changed from userId to user_id for consistency
  permission_name: string;  // Changed from permissionName to permission_name
  category: string;
  can_view: boolean;  // Changed from canView to can_view
  can_create: boolean;  // Changed from canCreate to can_create
  can_edit: boolean;  // Changed from canEdit to can_edit
  can_delete: boolean;  // Changed from canDelete to can_delete
  can_approve: boolean;  // Changed from canApprove to can_approve
}

export interface PermissionTemplate {
  id: number;
  name: string;
  category: string;
  description: string;
  default_view: boolean;  // Changed from defaultView
  default_create: boolean;  // Changed from defaultCreate
  default_edit: boolean;  // Changed from defaultEdit
  default_delete: boolean;  // Changed from defaultDelete
  default_approve: boolean;  // Changed from defaultApprove
}

// Role types
export interface Role {
  id: number;
  name: string;
  description: string;
  user_count: number;  // Changed from userCount
  created_at: string;  // Changed from createdAt
  is_system: boolean;  // Changed from isSystem
}

export interface RolePermission {
  role_id: number;  // Changed from roleId
  permission_id: number;  // Changed from permissionId
  can_view: boolean;  // Changed from canView
  can_create: boolean;  // Changed from canCreate
  can_edit: boolean;  // Changed from canEdit
  can_delete: boolean;  // Changed from canDelete
  can_approve: boolean;  // Changed from canApprove
}

// Requisition types
export interface Requisition {
  id: number;
  req_number: string;
  requester_id: number;
  requester_name: string;
  department?: string;  // Added department field
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'COMPLETED' | 'REJECTED';
  total_cost: number;
  justification: string;
  created_at: string;
  approved_at?: string;
  approved_by?: number;
  approved_by_name?: string;
  items?: RequisitionItem[];
}

export interface RequisitionItem {
  id: number;
  item_name: string;
  item_type?: string;  // Added item_type field
  quantity: number;
  unit_cost: number;
  total: number;
}

export interface CreateRequisitionData {
  justification: string;
  department?: string;  // Added department field
  items: {
    name: string;
    type?: string;  // Added type field
    quantity: number;
    unit_cost: number;
  }[];
}

// Catalog types
export interface CatalogItem {
  id: number;
  code: string;
  name: string;
  category: string;  // This serves as the item type (Laptop, Mouse, Pen, Sugar, etc.)
  unit_cost: number;
  in_stock: boolean;
  is_asset: boolean;
  description?: string;
}

// Inventory types
export interface InventoryItem {
  id: number;
  name: string;
  code: string;
  type?: string;  // Added type field for item categorization
  quantity: number;
  reserved: number;
  available: number;
  location: string;
}

// Asset types
export interface Asset {
  id: number;
  asset_tag: string;
  name: string;
  type?: string; // Add this
  category?: string; // Add this
  serial_number: string;
  assigned_to: string | null;
  department: string | null;
  assigned_date: string;
  status: string;
  purchase_cost?: number;
  requisition_id?: number;
  requisition_item_id?: number;
}

// Dashboard Stats
export interface DashboardStats {
  totalRequisitions: number;
  pendingApproval: number;
  approvedRequisitions: number;
  completedRequisitions: number;
  totalAssets: number;
  lowStockItems: number;
}

// API Response types
export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
}

// Audit Log
export interface AuditLog {
  id: number;
  user_id: number;  // Changed from userId
  user_name: string;  // Changed from userName
  action: string;
  details: string;
  timestamp: string;
  ip_address: string;  // Changed from ipAddress
}