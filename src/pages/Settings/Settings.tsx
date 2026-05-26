import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import UserManagement from './UserManagement';
import RoleManagement from './RoleManagement';
import UserPermissions from './UserPermissions';
import PermissionMatrix from './PermissionMatrix';
import SystemPreferences from './SystemPreferences';
import AuditLogs from './AuditLogs';
import { 
  FiUsers, 
  FiShield, 
  FiLock, 
  FiSettings, 
  FiFileText,
  FiUserCheck
} from 'react-icons/fi';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');

  const tabs = [
    { id: 'users', label: 'User Management', icon: FiUsers },
    { id: 'roles', label: 'Roles', icon: FiShield },
    { id: 'user-permissions', label: 'User Permissions', icon: FiUserCheck },
    //{ id: 'permissions', label: 'Role Permissions', icon: FiLock },
    { id: 'preferences', label: 'System Preferences', icon: FiSettings },
    { id: 'audit', label: 'Audit Logs', icon: FiFileText },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500 mt-1">Manage system configuration, users, and permissions</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'roles' && <RoleManagement />}
          {activeTab === 'user-permissions' && <UserPermissions />}
          {activeTab === 'permissions' && <PermissionMatrix />}
          {activeTab === 'preferences' && <SystemPreferences />}
          {activeTab === 'audit' && <AuditLogs />}
        </div>
      </div>
    </Layout>
  );
};

export default Settings;