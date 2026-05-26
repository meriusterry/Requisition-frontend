import React, { useState, useEffect } from 'react';
import { 
  FiSave, 
  FiUser, 
  FiShield, 
  FiCheck, 
  FiX, 
  FiRefreshCw,
  FiSearch,
  FiEye,
  FiEdit2,
  FiPlusCircle,
  FiTrash2,
  FiCheckCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { 
  permissionTemplates, 
  getUserPermissions, 
  updateAllUserPermissions,
  resetUserPermissionsToRole,
  hasPermission 
} from '../../services/permissionService';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
}

interface UserPermission {
  id: number;
  userId: number;
  permissionName: string;
  category: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
}

const UserPermissions: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    // Mock users data
    const mockUsers: User[] = [
      { id: 1, name: 'John Smith', email: 'john@company.com', role: 'Admin', department: 'IT', status: 'active' },
      { id: 2, name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Manager', department: 'Sales', status: 'active' },
      { id: 3, name: 'Mike Wilson', email: 'mike@company.com', role: 'Employee', department: 'Marketing', status: 'active' },
      { id: 4, name: 'Emily Brown', email: 'emily@company.com', role: 'Warehouse', department: 'Operations', status: 'active' },
      { id: 5, name: 'David Lee', email: 'david@company.com', role: 'Employee', department: 'IT', status: 'inactive' },
    ];
    setUsers(mockUsers);
    setLoading(false);
  };

  const loadUserPermissions = (userId: number) => {
    const perms = getUserPermissions(userId);
    if (perms.length === 0) {
      // Initialize permissions if not exist
      const user = users.find(u => u.id === userId);
      if (user) {
        const initializedPerms = permissionTemplates.map((template, idx) => ({
          id: idx + 1,
          userId: userId,
          permissionName: template.name,
          category: template.category,
          canView: user.role === 'Admin' ? true : template.defaultView,
          canCreate: user.role === 'Admin' ? true : template.defaultCreate,
          canEdit: user.role === 'Admin' ? true : template.defaultEdit,
          canDelete: user.role === 'Admin' ? true : template.defaultDelete,
          canApprove: user.role === 'Admin' ? true : template.defaultApprove,
        }));
        setUserPermissions(initializedPerms);
      }
    } else {
      setUserPermissions(perms);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    loadUserPermissions(user.id);
  };

  const handlePermissionChange = (permissionName: string, action: string, value: boolean) => {
    setUserPermissions(prev => prev.map(perm => {
      if (perm.permissionName === permissionName) {
        return { ...perm, [action]: value };
      }
      return perm;
    }));
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) return;
    setSaving(true);
    
    try {
      const success = updateAllUserPermissions(selectedUser.id, userPermissions);
      if (success) {
        toast.success(`Permissions updated for ${selectedUser.name}`);
      } else {
        toast.error('Failed to update permissions');
      }
    } catch (error) {
      toast.error('Error saving permissions');
    } finally {
      setSaving(false);
    }
  };

  const handleResetToRole = () => {
    if (!selectedUser) return;
    if (confirm(`Reset permissions for ${selectedUser.name} to role default?`)) {
      const resetPerms = resetUserPermissionsToRole(selectedUser.id, selectedUser.role);
      setUserPermissions(resetPerms);
      toast.success(`Permissions reset to ${selectedUser.role} defaults`);
    }
  };

  // Group permissions by category
  const permissionsByCategory = userPermissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, UserPermission[]>);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(userPermissions.map(p => p.category))];
  const filteredPermissions = filterCategory
    ? { [filterCategory]: permissionsByCategory[filterCategory] }
    : permissionsByCategory;

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FiShield className="h-5 w-5 mr-2 text-blue-600" />
            User Permission Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">Assign granular permissions to individual users</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Users List */}
          <div className="lg:col-span-1 border rounded-lg p-4">
            <div className="mb-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedUser?.id === user.id
                      ? 'bg-blue-50 border-l-4 border-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{user.role}</span>
                        <span className={`text-xs ${user.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                          {user.status}
                        </span>
                      </div>
                    </div>
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Permissions Matrix */}
          <div className="lg:col-span-2">
            {selectedUser ? (
              <>
                {/* User Info Header */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">{selectedUser.name}</h3>
                    <p className="text-sm text-gray-600">{selectedUser.role} • {selectedUser.department}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleResetToRole}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-1"
                    >
                      <FiRefreshCw className="h-3 w-3" />
                      <span>Reset to Role</span>
                    </button>
                    <button
                      onClick={handleSavePermissions}
                      disabled={saving}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-1 disabled:opacity-50"
                    >
                      <FiSave className="h-3 w-3" />
                      <span>{saving ? 'Saving...' : 'Save'}</span>
                    </button>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-4">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Permissions Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto max-h-96 overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="p-3 text-left text-sm font-medium text-gray-600">Permission</th>
                          <th className="p-3 text-center text-sm font-medium text-gray-600 w-20">View</th>
                          <th className="p-3 text-center text-sm font-medium text-gray-600 w-20">Create</th>
                          <th className="p-3 text-center text-sm font-medium text-gray-600 w-20">Edit</th>
                          <th className="p-3 text-center text-sm font-medium text-gray-600 w-20">Delete</th>
                          <th className="p-3 text-center text-sm font-medium text-gray-600 w-20">Approve</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
  {Object.entries(filteredPermissions).map(([category, perms]) => (
    <React.Fragment key={category}>
      {/* Category Header Row */}
      <tr className="bg-gray-100">
        <td colSpan={6} className="p-2 text-sm font-semibold text-gray-700">
          {category}
        </td>
      </tr>
      
      {/* Permission Rows - Each permission has all 5 actions in one row */}
      {perms.map((perm) => (
        <tr key={perm.permissionName} className="hover:bg-gray-50">
          {/* Permission Name Column */}
          <td className="p-3">
            <div className="text-sm font-medium text-gray-800">{perm.permissionName}</div>
          </td>
          
          {/* View Action */}
          <td className="p-3 text-center">
            <button
              onClick={() => handlePermissionChange(perm.permissionName, 'canView', !perm.canView)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                perm.canView ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
              }`}
              title="View Permission"
            >
              {perm.canView ? <FiCheck className="h-4 w-4" /> : <FiX className="h-4 w-4" />}
            </button>
          </td>
          
          {/* Create Action */}
          <td className="p-3 text-center">
            <button
              onClick={() => handlePermissionChange(perm.permissionName, 'canCreate', !perm.canCreate)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                perm.canCreate ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
              }`}
              title="Create Permission"
            >
              {perm.canCreate ? <FiCheck className="h-4 w-4" /> : <FiX className="h-4 w-4" />}
            </button>
          </td>
          
          {/* Edit Action */}
          <td className="p-3 text-center">
            <button
              onClick={() => handlePermissionChange(perm.permissionName, 'canEdit', !perm.canEdit)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                perm.canEdit ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
              }`}
              title="Edit Permission"
            >
              {perm.canEdit ? <FiCheck className="h-4 w-4" /> : <FiX className="h-4 w-4" />}
            </button>
          </td>
          
          {/* Delete Action */}
          <td className="p-3 text-center">
            <button
              onClick={() => handlePermissionChange(perm.permissionName, 'canDelete', !perm.canDelete)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                perm.canDelete ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
              }`}
              title="Delete Permission"
            >
              {perm.canDelete ? <FiCheck className="h-4 w-4" /> : <FiX className="h-4 w-4" />}
            </button>
          </td>
          
          {/* Approve Action */}
          <td className="p-3 text-center">
            <button
              onClick={() => handlePermissionChange(perm.permissionName, 'canApprove', !perm.canApprove)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                perm.canApprove ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
              }`}
              title="Approve Permission"
            >
              {perm.canApprove ? <FiCheck className="h-4 w-4" /> : <FiX className="h-4 w-4" />}
            </button>
          </td>
        </tr>
      ))}
    </React.Fragment>
  ))}
</tbody>
                    </table>
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center"><div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div><span>View</span></div>
                  <div className="flex items-center"><div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div><span>Create</span></div>
                  <div className="flex items-center"><div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div><span>Edit</span></div>
                  <div className="flex items-center"><div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div><span>Delete</span></div>
                  <div className="flex items-center"><div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div><span>Approve</span></div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500 border rounded-lg">
                <FiUser className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>Select a user to manage permissions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPermissions;