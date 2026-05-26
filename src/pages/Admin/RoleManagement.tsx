import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { getRoles, getUsers, getUsers as getUsersList } from '../../services/api';
import { Role, User } from '../../types';
import { FiShield, FiUsers, FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (): Promise<void> => {
    try {
      const [rolesData, usersData] = await Promise.all([
        getRoles(),
        getUsersList()
      ]);
      setRoles(rolesData);
      setUsers(usersData);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getUsersByRole = (roleId: number): User[] => {
    return users.filter(user => user.role_id === roleId);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-600 mt-1">Manage system roles and permissions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Roles List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FiShield className="h-5 w-5 mr-2 text-blue-600" />
              System Roles
            </h2>
            <div className="space-y-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedRole?.id === role.id
                      ? 'bg-blue-50 border-l-4 border-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{role.role_name}</p>
                      <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                    </div>
                    {role.is_active ? (
                      <FiCheck className="h-4 w-4 text-green-600" />
                    ) : (
                      <FiX className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Role Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedRole ? (
              <>
                {/* Role Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedRole.role_name}</h2>
                      <p className="text-gray-600 mt-1">{selectedRole.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedRole.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedRole.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2 flex items-center">
                      <FiUsers className="h-4 w-4 mr-2" />
                      Users with this role ({getUsersByRole(selectedRole.id).length})
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {getUsersByRole(selectedRole.id).map(user => (
                        <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                          <span className={`text-xs ${user.is_active ? 'text-green-600' : 'text-red-600'}`}>
                            {user.is_active ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                      ))}
                      {getUsersByRole(selectedRole.id).length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">No users assigned to this role</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Permissions Summary */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold mb-4">Permissions Summary</h3>
                  <div className="space-y-3">
                    {selectedRole.permissions?.slice(0, 10).map((perm) => (
                      <div key={perm.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{perm.permission_name}</span>
                        <div className="flex space-x-4">
                          {perm.can_read === 1 && <span className="text-green-600 text-xs">Read</span>}
                          {perm.can_write === 1 && <span className="text-blue-600 text-xs">Write</span>}
                          {perm.can_execute === 1 && <span className="text-purple-600 text-xs">Execute</span>}
                          {perm.can_delete === 1 && <span className="text-red-600 text-xs">Delete</span>}
                          {perm.can_read === 0 && perm.can_write === 0 && perm.can_execute === 0 && perm.can_delete === 0 && (
                            <span className="text-gray-400 text-xs">No permissions</span>
                          )}
                        </div>
                      </div>
                    ))}
                    {(selectedRole.permissions?.length || 0) > 10 && (
                      <p className="text-sm text-gray-500 text-center pt-2">
                        And {(selectedRole.permissions?.length || 0) - 10} more permissions...
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FiShield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Select a Role</h3>
                <p className="text-gray-600 mt-1">Choose a role from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RoleManagement;