import React, { useState, useEffect } from 'react';
import { 
  FiPlus, FiEdit2, FiTrash2, FiUserCheck, FiUserX, FiSearch, 
  FiShield, FiSave, FiX, FiCheck 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

interface Permission {
  id: number;
  name: string;
  description: string;
  category: string;
}

interface UserPermission {
  userId: number;
  permissionId: number;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [savingPermissions, setSavingPermissions] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Mock users
    const mockUsers: User[] = [
      { id: 1, name: 'John Smith', email: 'john@company.com', role: 'Admin', department: 'IT', status: 'active', lastLogin: '2024-01-20 10:30', createdAt: '2024-01-01' },
      { id: 2, name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Manager', department: 'Sales', status: 'active', lastLogin: '2024-01-19 15:45', createdAt: '2024-01-02' },
      { id: 3, name: 'Mike Wilson', email: 'mike@company.com', role: 'Employee', department: 'Marketing', status: 'active', lastLogin: '2024-01-18 09:20', createdAt: '2024-01-03' },
      { id: 4, name: 'Emily Brown', email: 'emily@company.com', role: 'Employee', department: 'IT', status: 'active', lastLogin: '2024-01-20 14:15', createdAt: '2024-01-04' },
      { id: 5, name: 'David Lee', email: 'david@company.com', role: 'Warehouse', department: 'Operations', status: 'inactive', lastLogin: '2024-01-15 11:00', createdAt: '2024-01-05' },
      { id: 6, name: 'Lisa Anderson', email: 'lisa@company.com', role: 'Manager', department: 'HR', status: 'active', lastLogin: '2024-01-19 09:30', createdAt: '2024-01-06' },
    ];
    setUsers(mockUsers);

    // Mock permissions
    const mockPermissions: Permission[] = [
      { id: 1, name: 'Requisitions', description: 'Create and manage requisitions', category: 'Requisitions' },
      { id: 2, name: 'Requisitions - Approve', description: 'Approve or reject requisitions', category: 'Requisitions' },
      { id: 3, name: 'Inventory - View', description: 'View inventory levels', category: 'Inventory' },
      { id: 4, name: 'Inventory - Manage', description: 'Update inventory quantities', category: 'Inventory' },
      { id: 5, name: 'Assets - View', description: 'View company assets', category: 'Assets' },
      { id: 6, name: 'Assets - Assign', description: 'Assign assets to users', category: 'Assets' },
      { id: 7, name: 'Assets - Return', description: 'Process asset returns', category: 'Assets' },
      { id: 8, name: 'Users - View', description: 'View user list', category: 'Admin' },
      { id: 9, name: 'Users - Manage', description: 'Create/edit/delete users', category: 'Admin' },
      { id: 10, name: 'Reports - View', description: 'View reports', category: 'Reports' },
      { id: 11, name: 'Reports - Export', description: 'Export reports', category: 'Reports' },
      { id: 12, name: 'Settings - View', description: 'View system settings', category: 'Settings' },
      { id: 13, name: 'Settings - Manage', description: 'Modify system settings', category: 'Settings' },
    ];
    setPermissions(mockPermissions);

    // Initialize user permissions
    const initialPermissions: UserPermission[] = [];
    mockUsers.forEach(user => {
      mockPermissions.forEach(perm => {
        let canView = false;
        let canCreate = false;
        let canEdit = false;
        let canDelete = false;
        let canApprove = false;

        if (user.role === 'Admin') {
          canView = true;
          canCreate = true;
          canEdit = true;
          canDelete = true;
          canApprove = true;
        } else if (user.role === 'Manager') {
          if (perm.id === 1) { canView = true; canCreate = true; canEdit = true; }
          if (perm.id === 2) { canView = true; canApprove = true; }
          if (perm.id === 3) { canView = true; }
          if (perm.id === 5) { canView = true; }
          if (perm.id === 8) { canView = true; }
          if (perm.id === 10) { canView = true; }
          if (perm.id === 11) { canView = true; }
        } else if (user.role === 'Employee') {
          if (perm.id === 1) { canView = true; canCreate = true; }
          if (perm.id === 3) { canView = true; }
          if (perm.id === 5) { canView = true; }
        } else if (user.role === 'Warehouse') {
          if (perm.id === 1) { canView = true; }
          if (perm.id === 3) { canView = true; }
          if (perm.id === 4) { canView = true; canEdit = true; }
          if (perm.id === 5) { canView = true; }
          if (perm.id === 6) { canView = true; canEdit = true; }
          if (perm.id === 7) { canView = true; canEdit = true; }
        }

        initialPermissions.push({
          userId: user.id,
          permissionId: perm.id,
          canView,
          canCreate,
          canEdit,
          canDelete,
          canApprove,
        });
      });
    });

    setUserPermissions(initialPermissions);
    setLoading(false);
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      Admin: 'bg-purple-100 text-purple-700',
      Manager: 'bg-blue-100 text-blue-700',
      Employee: 'bg-green-100 text-green-700',
      Warehouse: 'bg-yellow-100 text-yellow-700',
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  const handleStatusToggle = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
    toast.success('User status updated');
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    }
  };

  const handleOpenPermissions = (user: User) => {
    setSelectedUser(user);
    setShowPermissionModal(true);
  };

  const getUserPermission = (userId: number, permissionId: number) => {
    return userPermissions.find(up => up.userId === userId && up.permissionId === permissionId);
  };

  const handlePermissionChange = (userId: number, permissionId: number, action: string, value: boolean) => {
    setUserPermissions(prev => prev.map(up => {
      if (up.userId === userId && up.permissionId === permissionId) {
        return { ...up, [action]: value };
      }
      return up;
    }));
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) return;
    setSavingPermissions(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success(`Permissions saved for ${selectedUser.name}`);
    setSavingPermissions(false);
    setShowPermissionModal(false);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">System Users</h2>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <FiPlus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.department}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleStatusToggle(user.id)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {user.status === 'active' ? <FiUserCheck className="h-3 w-3" /> : <FiUserX className="h-3 w-3" />}
                      <span>{user.status === 'active' ? 'Active' : 'Inactive'}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.lastLogin}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenPermissions(user)}
                        className="text-purple-600 hover:text-purple-800"
                        title="Manage Permissions"
                      >
                        <FiShield className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit User"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete User"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No users found
          </div>
        )}
      </div>

      {/* Permission Modal */}
      {showPermissionModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Permissions for {selectedUser.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedUser.role} • {selectedUser.department}
                  </p>
                </div>
                <button
                  onClick={() => setShowPermissionModal(false)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Permissions Matrix */}
            <div className="overflow-auto max-h-[calc(90vh-200px)] p-6">
              {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
                <div key={category} className="mb-6">
                  <h4 className="text-md font-semibold text-gray-700 mb-3 sticky top-0 bg-white py-2">
                    {category}
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="p-3 text-left text-sm font-medium text-gray-600 w-80">Permission</th>
                          <th className="p-3 text-center text-sm font-medium text-gray-600 w-20">View</th>
                          <th className="p-3 text-center text-sm font-medium text-gray-600 w-20">Create</th>
                          <th className="p-3 text-center text-sm font-medium text-gray-600 w-20">Edit</th>
                          <th className="p-3 text-center text-sm font-medium text-gray-600 w-20">Delete</th>
                          <th className="p-3 text-center text-sm font-medium text-gray-600 w-20">Approve</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryPermissions.map((permission) => {
                          const userPerm = getUserPermission(selectedUser.id, permission.id);
                          return (
                            <tr key={permission.id} className="border-b hover:bg-gray-50">
                              <td className="p-3">
                                <div className="font-medium text-gray-800">{permission.name}</div>
                                <div className="text-xs text-gray-500">{permission.description}</div>
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  onClick={() => handlePermissionChange(selectedUser.id, permission.id, 'canView', !userPerm?.canView)}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition mx-auto ${
                                    userPerm?.canView 
                                      ? 'bg-green-500 text-white hover:bg-green-600' 
                                      : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                                  }`}
                                >
                                  {userPerm?.canView ? <FiCheck className="h-4 w-4" /> : <FiX className="h-4 w-4" />}
                                </button>
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  onClick={() => handlePermissionChange(selectedUser.id, permission.id, 'canCreate', !userPerm?.canCreate)}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition mx-auto ${
                                    userPerm?.canCreate 
                                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                      : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                                  }`}
                                >
                                  {userPerm?.canCreate ? <FiCheck className="h-4 w-4" /> : <FiX className="h-4 w-4" />}
                                </button>
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  onClick={() => handlePermissionChange(selectedUser.id, permission.id, 'canEdit', !userPerm?.canEdit)}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition mx-auto ${
                                    userPerm?.canEdit 
                                      ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                                      : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                                  }`}
                                >
                                  {userPerm?.canEdit ? <FiCheck className="h-4 w-4" /> : <FiX className="h-4 w-4" />}
                                </button>
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  onClick={() => handlePermissionChange(selectedUser.id, permission.id, 'canDelete', !userPerm?.canDelete)}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition mx-auto ${
                                    userPerm?.canDelete 
                                      ? 'bg-red-500 text-white hover:bg-red-600' 
                                      : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                                  }`}
                                >
                                  {userPerm?.canDelete ? <FiCheck className="h-4 w-4" /> : <FiX className="h-4 w-4" />}
                                </button>
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  onClick={() => handlePermissionChange(selectedUser.id, permission.id, 'canApprove', !userPerm?.canApprove)}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition mx-auto ${
                                    userPerm?.canApprove 
                                      ? 'bg-purple-500 text-white hover:bg-purple-600' 
                                      : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                                  }`}
                                >
                                  {userPerm?.canApprove ? <FiCheck className="h-4 w-4" /> : <FiX className="h-4 w-4" />}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowPermissionModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePermissions}
                disabled={savingPermissions}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
              >
                <FiSave className="h-4 w-4" />
                <span>{savingPermissions ? 'Saving...' : 'Save Permissions'}</span>
              </button>
            </div>

            {/* Legend */}
            <div className="px-6 pb-4">
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div><span>View</span></div>
                <div className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div><span>Create</span></div>
                <div className="flex items-center"><div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div><span>Edit</span></div>
                <div className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div><span>Delete</span></div>
                <div className="flex items-center"><div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div><span>Approve</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserManagement;