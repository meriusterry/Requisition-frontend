// src/hooks/useRequisitions.ts
import { useState, useCallback } from 'react';
import apiService, { Requisition } from '../services/api';

interface UseRequisitionsReturn {
    requisitions: Requisition[];
    loading: boolean;
    error: string | null;
    total: number;
    page: number;
    totalPages: number;
    fetchRequisitions: (page?: number, filters?: any) => Promise<void>;
    createRequisition: (data: any) => Promise<boolean>;
    updateRequisition: (id: number, data: any) => Promise<boolean>;
    submitRequisition: (id: number) => Promise<boolean>;
    approveRequisition: (id: number) => Promise<boolean>;
    rejectRequisition: (id: number, reason: string) => Promise<boolean>;
}

export const useRequisitions = (initialFilters?: any): UseRequisitionsReturn => {
    const [requisitions, setRequisitions] = useState<Requisition[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);

    const fetchRequisitions = useCallback(async (newPage?: number, filters?: any) => {
        setLoading(true);
        setError(null);
        
        const params = {
            page: newPage || page,
            limit: 10,
            ...initialFilters,
            ...filters,
        };
        
        const result = await apiService.getRequisitions(params);
        
        if (result.success && result.data) {
            setRequisitions(result.data.requisitions);
            setTotal(result.data.total);
            setPage(result.data.page);
            setTotalPages(result.data.totalPages);
        } else {
            setError(result.message || 'Failed to fetch requisitions');
        }
        
        setLoading(false);
    }, [page, initialFilters]);

    const createRequisition = async (data: any): Promise<boolean> => {
        setLoading(true);
        const result = await apiService.createRequisition(data);
        setLoading(false);
        
        if (result.success) {
            await fetchRequisitions();
            return true;
        } else {
            setError(result.message || 'Failed to create requisition');
            return false;
        }
    };

    const updateRequisition = async (id: number, data: any): Promise<boolean> => {
        setLoading(true);
        const result = await apiService.updateRequisition(id, data);
        setLoading(false);
        
        if (result.success) {
            await fetchRequisitions();
            return true;
        } else {
            setError(result.message || 'Failed to update requisition');
            return false;
        }
    };

    const submitRequisition = async (id: number): Promise<boolean> => {
        setLoading(true);
        const result = await apiService.submitRequisition(id);
        setLoading(false);
        
        if (result.success) {
            await fetchRequisitions();
            return true;
        } else {
            setError(result.message || 'Failed to submit requisition');
            return false;
        }
    };

    const approveRequisition = async (id: number): Promise<boolean> => {
        setLoading(true);
        const result = await apiService.approveRequisition(id);
        setLoading(false);
        
        if (result.success) {
            await fetchRequisitions();
            return true;
        } else {
            setError(result.message || 'Failed to approve requisition');
            return false;
        }
    };

    const rejectRequisition = async (id: number, reason: string): Promise<boolean> => {
        setLoading(true);
        const result = await apiService.rejectRequisition(id, reason);
        setLoading(false);
        
        if (result.success) {
            await fetchRequisitions();
            return true;
        } else {
            setError(result.message || 'Failed to reject requisition');
            return false;
        }
    };

    return {
        requisitions,
        loading,
        error,
        total,
        page,
        totalPages,
        fetchRequisitions,
        createRequisition,
        updateRequisition,
        submitRequisition,
        approveRequisition,
        rejectRequisition,
    };
};