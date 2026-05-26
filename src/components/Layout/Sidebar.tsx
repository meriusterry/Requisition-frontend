// In Sidebar.tsx, update the menuItems to include All Assets for admin
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiHome, 
  FiFileText, 
  FiPackage, 
  FiHardDrive,
  FiShoppingCart,
  FiBarChart2,
  FiSettings,
  FiUsers
} from 'react-icons/fi';

interface SidebarProps {
  sidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen }) => {
  const { user, hasPermission } = useAuth();
  const isAdmin = user?.role_name === 'Admin' || hasPermission('assets', 'view_all');

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/requisitions', icon: FiFileText, label: 'Requisitions' },
    { path: '/requisitions/create', icon: FiShoppingCart, label: 'Create Request' },
    { path: '/inventory', icon: FiPackage, label: 'Inventory' },
    { path: '/my-assets', icon: FiHardDrive, label: 'My Assets' },
  ];

  // Add All Assets link for admin users
  if (isAdmin) {
    menuItems.push({ path: '/all-assets', icon: FiUsers, label: 'All Assets' });
  }

  menuItems.push(
    { path: '/reports', icon: FiBarChart2, label: 'Reports' },
    { path: '/settings', icon: FiSettings, label: 'Settings' }
  );

  return (
    <aside className={`fixed left-0 top-16 h-full bg-white shadow-lg transition-all duration-300 z-20 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
      <nav className="h-full overflow-y-auto py-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;