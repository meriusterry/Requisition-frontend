import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiMenu, FiBell, FiUser, FiLogOut } from 'react-icons/fi';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-30">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            <FiMenu className="h-5 w-5 text-gray-600" />
          </button>
          <div className="ml-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Requisition System
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-md hover:bg-gray-100 relative">
            <FiBell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition"
            >
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <FiUser className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:block">
                {user?.name || 'User'}
              </span>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Role: {user?.role_name}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2 transition"
                >
                  <FiLogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;