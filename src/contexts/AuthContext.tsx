import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, UserPermission } from '../types';
import { getUserPermissions, hasPermission as checkPermission } from '../services/permissionService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permissionName: string, action: 'view' | 'create' | 'edit' | 'delete' | 'approve') => boolean;
  userPermissions: UserPermission[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      const perms = getUserPermissions(parsedUser.id);
      setUserPermissions(perms);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in real app, call API
    const mockUser: User = {
      id: email.includes('admin') ? 1 : email.includes('manager') ? 2 : 3,
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      email: email,
      role_id: email.includes('admin') ? 1 : email.includes('manager') ? 2 : 3,
      role_name: email.includes('admin') ? 'Admin' : email.includes('manager') ? 'Manager' : 'Employee',
      department: 'IT',
      is_active: true,
    };
    
    setUser(mockUser);
    const perms = getUserPermissions(mockUser.id);
    setUserPermissions(perms);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    setUserPermissions([]);
    localStorage.removeItem('user');
  };

  const hasPermission = (permissionName: string, action: 'view' | 'create' | 'edit' | 'delete' | 'approve'): boolean => {
    if (!user) return false;
    if (user.role_name === 'Admin') return true;
    return checkPermission(user.id, permissionName, action);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!user,
      hasPermission,
      userPermissions
    }}>
      {children}
    </AuthContext.Provider>
  );
};