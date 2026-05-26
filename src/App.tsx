import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RequisitionList from './pages/Requisitions/RequisitionList';
import CreateRequisition from './pages/Requisitions/CreateRequisition';
import RequisitionDetail from './pages/Requisitions/RequisitionDetail';
import InventoryList from './pages/Inventory/InventoryList';
import MyAssets from './pages/Assets/MyAssets';
import AllAssets from './pages/Assets/AllAssets';
import AssignAssets from './pages/Assets/AssignAssets';  // Fixed path - under Assets folder
import ReportDashboard from './pages/Reports/ReportDashboard';
import Settings from './pages/Settings/Settings';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/requisitions" element={
        <ProtectedRoute>
          <RequisitionList />
        </ProtectedRoute>
      } />
      
      <Route path="/requisitions/create" element={
        <ProtectedRoute>
          <CreateRequisition />
        </ProtectedRoute>
      } />
      
      <Route path="/requisitions/:id" element={
        <ProtectedRoute>
          <RequisitionDetail />
        </ProtectedRoute>
      } />
      
      <Route path="/requisitions/:id/assign" element={
        <ProtectedRoute>
          <AssignAssets />
        </ProtectedRoute>
      } />
      
      <Route path="/inventory" element={
        <ProtectedRoute>
          <InventoryList />
        </ProtectedRoute>
      } />
      
      <Route path="/my-assets" element={
        <ProtectedRoute>
          <MyAssets />
        </ProtectedRoute>
      } />
      
      <Route path="/all-assets" element={
        <ProtectedRoute>
          <AllAssets />
        </ProtectedRoute>
      } />
      
      <Route path="/reports" element={
        <ProtectedRoute>
          <ReportDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
            },
            error: {
              duration: 4000,
            },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;