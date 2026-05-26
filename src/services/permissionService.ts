import { User, UserPermission, PermissionTemplate } from '../types';

// Permission Templates (available permissions in the system)
export const permissionTemplates: PermissionTemplate[] = [
  { id: 1, name: 'Requisitions - View', category: 'Requisitions', description: 'View all requisitions', defaultView: true, defaultCreate: false, defaultEdit: false, defaultDelete: false, defaultApprove: false },
  { id: 2, name: 'Requisitions - Create', category: 'Requisitions', description: 'Create new requisitions', defaultView: false, defaultCreate: true, defaultEdit: false, defaultDelete: false, defaultApprove: false },
  { id: 3, name: 'Requisitions - Edit', category: 'Requisitions', description: 'Edit own requisitions', defaultView: false, defaultCreate: false, defaultEdit: true, defaultDelete: false, defaultApprove: false },
  { id: 4, name: 'Requisitions - Delete', category: 'Requisitions', description: 'Delete requisitions', defaultView: false, defaultCreate: false, defaultEdit: false, defaultDelete: true, defaultApprove: false },
  { id: 5, name: 'Requisitions - Approve', category: 'Requisitions', description: 'Approve/reject requisitions', defaultView: false, defaultCreate: false, defaultEdit: false, defaultDelete: false, defaultApprove: true },
  
  { id: 6, name: 'Inventory - View', category: 'Inventory', description: 'View inventory levels', defaultView: true, defaultCreate: false, defaultEdit: false, defaultDelete: false, defaultApprove: false },
  { id: 7, name: 'Inventory - Manage', category: 'Inventory', description: 'Update inventory quantities', defaultView: false, defaultCreate: false, defaultEdit: true, defaultDelete: false, defaultApprove: false },
  
  { id: 8, name: 'Assets - View', category: 'Assets', description: 'View assets', defaultView: true, defaultCreate: false, defaultEdit: false, defaultDelete: false, defaultApprove: false },
  { id: 9, name: 'Assets - Assign', category: 'Assets', description: 'Assign assets to users', defaultView: false, defaultCreate: false, defaultEdit: true, defaultDelete: false, defaultApprove: false },
  { id: 10, name: 'Assets - Return', category: 'Assets', description: 'Process asset returns', defaultView: false, defaultCreate: false, defaultEdit: true, defaultDelete: false, defaultApprove: false },
  
  { id: 11, name: 'Users - View', category: 'Admin', description: 'View user list', defaultView: true, defaultCreate: false, defaultEdit: false, defaultDelete: false, defaultApprove: false },
  { id: 12, name: 'Users - Manage', category: 'Admin', description: 'Create/edit/delete users', defaultView: false, defaultCreate: true, defaultEdit: true, defaultDelete: true, defaultApprove: false },
  { id: 13, name: 'Users - Assign Roles', category: 'Admin', description: 'Assign roles to users', defaultView: false, defaultCreate: false, defaultEdit: true, defaultDelete: false, defaultApprove: false },
  
  { id: 14, name: 'Reports - View', category: 'Reports', description: 'View reports', defaultView: true, defaultCreate: false, defaultEdit: false, defaultDelete: false, defaultApprove: false },
  { id: 15, name: 'Reports - Export', category: 'Reports', description: 'Export reports', defaultView: false, defaultCreate: false, defaultEdit: false, defaultDelete: false, defaultApprove: false },
  
  { id: 16, name: 'Settings - View', category: 'Settings', description: 'View system settings', defaultView: true, defaultCreate: false, defaultEdit: false, defaultDelete: false, defaultApprove: false },
  { id: 17, name: 'Settings - Manage', category: 'Settings', description: 'Modify system settings', defaultView: false, defaultCreate: false, defaultEdit: true, defaultDelete: false, defaultApprove: false },
  { id: 18, name: 'Settings - Permissions', category: 'Settings', description: 'Manage user permissions', defaultView: false, defaultCreate: false, defaultEdit: true, defaultDelete: false, defaultApprove: false },
];

// Mock user permissions storage
let userPermissionsStore: Map<number, UserPermission[]> = new Map();

// Initialize default permissions for users
export const initializeUserPermissions = (userId: number, roleName: string): UserPermission[] => {
  const permissions: UserPermission[] = [];
  
  // Assign permissions based on role
  permissionTemplates.forEach((template, index) => {
    let canView = false;
    let canCreate = false;
    let canEdit = false;
    let canDelete = false;
    let canApprove = false;
    
    if (roleName === 'Admin') {
      // Admin gets all permissions
      canView = true;
      canCreate = true;
      canEdit = true;
      canDelete = true;
      canApprove = true;
    } else if (roleName === 'Manager') {
      // Manager gets specific permissions
      if (template.category === 'Requisitions') {
        canView = true;
        if (template.name.includes('Approve')) canApprove = true;
      }
      if (template.category === 'Inventory') canView = true;
      if (template.category === 'Assets') canView = true;
      if (template.category === 'Reports') canView = true;
    } else if (roleName === 'Employee') {
      // Employee gets basic permissions
      if (template.name === 'Requisitions - View') canView = true;
      if (template.name === 'Requisitions - Create') canCreate = true;
      if (template.name === 'Assets - View') canView = true;
    } else if (roleName === 'Warehouse') {
      // Warehouse staff gets inventory permissions
      if (template.name === 'Requisitions - View') canView = true;
      if (template.name === 'Inventory - View') canView = true;
      if (template.name === 'Inventory - Manage') canEdit = true;
      if (template.name === 'Assets - View') canView = true;
      if (template.name === 'Assets - Assign') canEdit = true;
    }
    
    permissions.push({
      id: index + 1,
      userId: userId,
      permissionName: template.name,
      category: template.category,
      canView,
      canCreate,
      canEdit,
      canDelete,
      canApprove,
    });
  });
  
  userPermissionsStore.set(userId, permissions);
  return permissions;
};

// Get user permissions
export const getUserPermissions = (userId: number): UserPermission[] => {
  return userPermissionsStore.get(userId) || [];
};

// Update user permission
export const updateUserPermission = (
  userId: number, 
  permissionName: string, 
  action: 'canView' | 'canCreate' | 'canEdit' | 'canDelete' | 'canApprove',
  value: boolean
): boolean => {
  const userPerms = userPermissionsStore.get(userId);
  if (!userPerms) return false;
  
  const updatedPerms = userPerms.map(perm => {
    if (perm.permissionName === permissionName) {
      return { ...perm, [action]: value };
    }
    return perm;
  });
  
  userPermissionsStore.set(userId, updatedPerms);
  return true;
};

// Update all permissions for a user
export const updateAllUserPermissions = (userId: number, permissions: UserPermission[]): boolean => {
  userPermissionsStore.set(userId, permissions);
  return true;
};

// Check if user has specific permission
export const hasPermission = (
  userId: number, 
  permissionName: string, 
  action: 'view' | 'create' | 'edit' | 'delete' | 'approve'
): boolean => {
  const userPerms = userPermissionsStore.get(userId);
  if (!userPerms) return false;
  
  const permission = userPerms.find(p => p.permissionName === permissionName);
  if (!permission) return false;
  
  switch(action) {
    case 'view': return permission.canView;
    case 'create': return permission.canCreate;
    case 'edit': return permission.canEdit;
    case 'delete': return permission.canDelete;
    case 'approve': return permission.canApprove;
    default: return false;
  }
};

// Get all users with their permissions
export const getAllUsersWithPermissions = (users: User[]): (User & { permissions: UserPermission[] })[] => {
  return users.map(user => ({
    ...user,
    permissions: getUserPermissions(user.id)
  }));
};

// Reset user permissions to role default
export const resetUserPermissionsToRole = (userId: number, roleName: string): UserPermission[] => {
  const newPermissions = initializeUserPermissions(userId, roleName);
  userPermissionsStore.set(userId, newPermissions);
  return newPermissions;
};