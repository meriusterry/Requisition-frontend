import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Permission {
  id: number;
  name: string;
  category: string;
  description: string;
}

interface RolePermission {
  roleId: number;
  roleName: string;
  permissions: {
    permissionId: number;
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  }[];
}

const PermissionMatrix: React.FC = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Mock data
    const mockRoles = [
      { id: 1, name: 'Admin' },
      { id: 2, name: 'Manager' },
      { id: 3, name: 'Employee' },
      { id: 4, name: 'Warehouse' },
    ];

    const mockPermissions: Permission[] = [
      { id: 1, name: 'Requisitions', category: 'Requisitions', description: 'Manage purchase requests' },
      { id: 2, name: 'Approvals', category: 'Requisitions', description: 'Approve/reject requests' },
      { id: 3, name: 'Inventory', category: 'Inventory', description: 'View and manage stock' },
      { id: 4, name: 'Assets', category: 'Assets', description: 'Manage company assets' },
      { id: 5, name: 'Users', category: 'Admin', description: 'Manage system users' },
      { id: 6, name: 'Roles', category: 'Admin', description: 'Configure roles' },
      { id: 7, name: 'Reports', category: 'Reports', description: 'View analytics' },
      { id: 8, name: 'Settings', category: 'Admin', description: 'System configuration' },
    ];

    setRoles(mockRoles);
    setPermissions(mockPermissions);

    // Initialize role permissions
    const mockRolePermissions: RolePermission[] = mockRoles.map(role => ({
      roleId: role.id,
      roleName: role.name,
      permissions: mockPermissions.map(perm => ({
        permissionId: perm.id,
        canView: role.name === 'Admin' ? true : false,
        canCreate: role.name === 'Admin' ? true : false,
        canEdit: role.name === 'Admin' ? true : false,
        canDelete: role.name === 'Admin' ? true : false,
      }))
    }));

    // Set specific permissions for different roles
    const managerPerms = mockRolePermissions.find(rp => rp.roleName === 'Manager');
    if (managerPerms) {
      managerPerms.permissions.forEach(p => {
        if ([1, 2, 3, 4, 7].includes(p.permissionId)) {
          p.canView = true;
          if (p.permissionId === 2) p.canEdit = true;
        }
      });
    }

    const employeePerms = mockRolePermissions.find(rp => rp.roleName === 'Employee');
    if (employeePerms) {
      employeePerms.permissions.forEach(p => {
        if (p.permissionId === 1) {
          p.canView = true;
          p.canCreate = true;
        }
        if (p.permissionId === 4) p.canView = true;
      });
    }

    const warehousePerms = mockRolePermissions.find(rp => rp.roleName === 'Warehouse');
    if (warehousePerms) {
      warehousePerms.permissions.forEach(p => {
        if (p.permissionId === 3) {
          p.canView = true;
          p.canEdit = true;
        }
        if (p.permissionId === 1) p.canView = true;
        if (p.permissionId === 4) p.canView = true;
      });
    }

    setRolePermissions(mockRolePermissions);
    setLoading(false);
  };

  const handlePermissionChange = (roleId: number, permissionId: number, action: string, value: boolean) => {
    setRolePermissions(prev => prev.map(rp => {
      if (rp.roleId === roleId) {
        return {
          ...rp,
          permissions: rp.permissions.map(p => {
            if (p.permissionId === permissionId) {
              return { ...p, [action]: value };
            }
            return p;
          })
        };
      }
      return rp;
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Permissions saved successfully!');
    setSaving(false);
  };

  // Group permissions by category
  const permissionsByCategory = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Permission Matrix</h2>
          <p className="text-sm text-gray-500 mt-1">Configure role-based access controls</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
        >
          <FiSave className="h-4 w-4" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="overflow-x-auto p-6">
        {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
          <div key={category} className="mb-8">
            <h3 className="text-md font-semibold text-gray-700 mb-4">{category}</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left text-sm font-medium text-gray-600">Permission</th>
                  {roles.map(role => (
                    <th key={role.id} colSpan={4} className="p-3 text-center text-sm font-medium text-gray-600 border-x">
                      {role.name}
                    </th>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <th className="p-2"></th>
                  {roles.map(role => (
                    <React.Fragment key={role.id}>
                      <th className="p-2 text-center text-xs text-gray-500">View</th>
                      <th className="p-2 text-center text-xs text-gray-500">Create</th>
                      <th className="p-2 text-center text-xs text-gray-500">Edit</th>
                      <th className="p-2 text-center text-xs text-gray-500">Delete</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categoryPermissions.map(permission => {
                  const rolePerms = rolePermissions;
                  return (
                    <tr key={permission.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-medium text-gray-800">{permission.name}</div>
                        <div className="text-xs text-gray-500">{permission.description}</div>
                      </td>
                      {roles.map(role => {
                        const rolePerm = rolePerms.find(rp => rp.roleId === role.id);
                        const perm = rolePerm?.permissions.find(p => p.permissionId === permission.id);
                        return (
                          <React.Fragment key={role.id}>
                            <td className="p-2 text-center">
                              <button
                                onClick={() => handlePermissionChange(role.id, permission.id, 'canView', !perm?.canView)}
                                className={`w-6 h-6 rounded-full flex items-center justify-center transition ${
                                  perm?.canView ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                                }`}
                              >
                                {perm?.canView ? <FiCheck className="h-3 w-3" /> : <FiX className="h-3 w-3" />}
                              </button>
                            </td>
                            <td className="p-2 text-center">
                              <button
                                onClick={() => handlePermissionChange(role.id, permission.id, 'canCreate', !perm?.canCreate)}
                                className={`w-6 h-6 rounded-full flex items-center justify-center transition ${
                                  perm?.canCreate ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                                }`}
                              >
                                {perm?.canCreate ? <FiCheck className="h-3 w-3" /> : <FiX className="h-3 w-3" />}
                              </button>
                            </td>
                            <td className="p-2 text-center">
                              <button
                                onClick={() => handlePermissionChange(role.id, permission.id, 'canEdit', !perm?.canEdit)}
                                className={`w-6 h-6 rounded-full flex items-center justify-center transition ${
                                  perm?.canEdit ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                                }`}
                              >
                                {perm?.canEdit ? <FiCheck className="h-3 w-3" /> : <FiX className="h-3 w-3" />}
                              </button>
                            </td>
                            <td className="p-2 text-center">
                              <button
                                onClick={() => handlePermissionChange(role.id, permission.id, 'canDelete', !perm?.canDelete)}
                                className={`w-6 h-6 rounded-full flex items-center justify-center transition ${
                                  perm?.canDelete ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'
                                }`}
                              >
                                {perm?.canDelete ? <FiCheck className="h-3 w-3" /> : <FiX className="h-3 w-3" />}
                              </button>
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermissionMatrix;