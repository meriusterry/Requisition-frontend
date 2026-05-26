// Status constants
export const REQUISITION_STATUS = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED'
} as const;

export const ASSET_STATUS = {
  IN_STOCK: 'IN_STOCK',
  ASSIGNED: 'ASSIGNED',
  UNDER_REPAIR: 'UNDER_REPAIR',
  DISPOSED: 'DISPOSED'
} as const;

// Permission constants
export const PERMISSIONS = {
  REQUISITION: {
    CREATE: 'requisition.create',
    VIEW: 'requisition.view',
    APPROVE: 'requisition.approve',
    DELETE: 'requisition.delete'
  },
  INVENTORY: {
    VIEW: 'inventory.view',
    EDIT: 'inventory.edit',
    MANAGE: 'inventory.manage'
  },
  ASSET: {
    VIEW: 'asset.view',
    ASSIGN: 'asset.assign',
    RETURN: 'asset.return'
  },
  USER: {
    VIEW: 'user.view',
    EDIT: 'user.edit',
    CREATE: 'user.create'
  },
  ROLE: {
    VIEW: 'role.view',
    EDIT: 'role.edit'
  }
} as const;

// Helper functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};