import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiShield, FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Role {
  id: number;
  name: string;
  description: string;
  userCount: number;
  createdAt: string;
}

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    const mockRoles: Role[] = [
      { id: 1, name: 'Admin', description: 'Full system access', userCount: 2, createdAt: '2024-01-01' },
      { id: 2, name: 'Manager', description: 'Can approve requests and manage team', userCount: 5, createdAt: '2024-01-01' },
      { id: 3, name: 'Employee', description: 'Can create requisitions', userCount: 25, createdAt: '2024-01-01' },
      { id: 4, name: 'Warehouse', description: 'Manage inventory and fulfill orders', userCount: 3, createdAt: '2024-01-01' },
      { id: 5, name: 'Finance', description: 'View financial reports', userCount: 2, createdAt: '2024-01-01' },
    ];
    setRoles(mockRoles);
    setLoading(false);
  };

  const handleDeleteRole = (roleId: number) => {
    if (confirm('Are you sure you want to delete this role? This will affect all users with this role.')) {
      setRoles(roles.filter(role => role.id !== roleId));
      toast.success('Role deleted successfully');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">System Roles</h2>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <FiPlus className="h-4 w-4" />
              <span>Create Role</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {roles.map((role) => (
            <div key={role.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiShield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{role.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setEditingRole(role)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Users:</span>
                  <span className="font-medium text-gray-800">{role.userCount}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-600">{role.createdAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permissions Overview Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Role Capabilities</h3>
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900">Admin</p>
            <p className="text-xs text-blue-700 mt-1">Full access to all features including user management, role configuration, and system settings</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-900">Manager</p>
            <p className="text-xs text-green-700 mt-1">Can approve requisitions, view team reports, and manage department inventory</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">Employee</p>
            <p className="text-xs text-gray-700 mt-1">Can create requisitions and view own request history and assigned assets</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;