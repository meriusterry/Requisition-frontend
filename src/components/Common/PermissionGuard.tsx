import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission: string;
  action?: 'view' | 'create' | 'edit' | 'delete' | 'approve';
  fallback?: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  children, 
  permission, 
  action = 'view',
  fallback 
}) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission, action)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

export default PermissionGuard;