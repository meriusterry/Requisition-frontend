// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import apiService, { User, LoginCredentials, RegisterData } from '../services/api';

interface UseAuthReturn {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<boolean>;
    register: (userData: RegisterData) => Promise<boolean>;
    logout: () => void;
    updateUser: (user: User) => void;
    hasRole: (roles: string | string[]) => boolean;
    isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const checkAuth = useCallback(async () => {
        if (apiService.isAuthenticated()) {
            const storedUser = apiService.getUserFromStorage();
            if (storedUser) {
                setUser(storedUser);
            }
            
            // Verify token with backend
            const result = await apiService.getProfile();
            if (result.success && result.data) {
                setUser(result.data);
                apiService.setUserInStorage(result.data);
            } else {
                apiService.logout();
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (credentials: LoginCredentials): Promise<boolean> => {
        setError(null);
        const result = await apiService.login(credentials);
        
        if (result.success && result.data) {
            setUser(result.data);
            apiService.setUserInStorage(result.data);
            return true;
        } else {
            setError(result.message || 'Login failed');
            return false;
        }
    };

    const register = async (userData: RegisterData): Promise<boolean> => {
        setError(null);
        const result = await apiService.register(userData);
        
        if (result.success && result.data) {
            setUser(result.data);
            apiService.setUserInStorage(result.data);
            return true;
        } else {
            setError(result.message || 'Registration failed');
            return false;
        }
    };

    const logout = () => {
        apiService.logout();
        apiService.clearStorage();
        setUser(null);
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        apiService.setUserInStorage(updatedUser);
    };

    const hasRole = (roles: string | string[]): boolean => {
        if (!user) return false;
        if (typeof roles === 'string') {
            return user.role === roles;
        }
        return roles.includes(user.role);
    };

    return {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        hasRole,
        isAuthenticated: !!user,
    };
};