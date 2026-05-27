// src/pages/Dashboard.tsx - Fix the user display
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { fetchRequisitions, fetchMyAssets } from '../services/mockData';
import { Link } from 'react-router-dom';
import { 
  FiFileText, FiClock, FiCheckCircle, FiPackage, 
  FiTrendingUp, FiPlus, FiAlertCircle, FiHardDrive 
} from 'react-icons/fi';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRequisitions: 0,
    pendingApproval: 0,
    approvedRequisitions: 0,
    completedRequisitions: 0,
    totalAssets: 0,
    lowStockItems: 0
  });
  const [recentRequisitions, setRecentRequisitions] = useState<any[]>([]);
  const [departmentStats, setDepartmentStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Get user's full name
  const getFullName = () => {
    if (!user) return 'Guest';
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.username || user.email || 'User';
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [requisitions, assets] = await Promise.all([
        fetchRequisitions(),
        fetchMyAssets()
      ]);
      
      const deptStats: Record<string, number> = {};
      requisitions.forEach(req => {
        const dept = req.department || 'Unassigned';
        deptStats[dept] = (deptStats[dept] || 0) + 1;
      });
      
      setStats({
        totalRequisitions: requisitions.length,
        pendingApproval: requisitions.filter(r => r.status === 'PENDING').length,
        approvedRequisitions: requisitions.filter(r => r.status === 'APPROVED').length,
        completedRequisitions: requisitions.filter(r => r.status === 'COMPLETED').length,
        totalAssets: assets.length,
        lowStockItems: requisitions.filter(r => r.status === 'PENDING').length > 5 ? 5 : 3
      });
      
      setDepartmentStats(deptStats);
      setRecentRequisitions(requisitions.slice(0, 5));
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Requisitions', value: stats.totalRequisitions, icon: FiFileText, color: 'bg-blue-500', change: '+12%' },
    { title: 'Pending Approval', value: stats.pendingApproval, icon: FiClock, color: 'bg-yellow-500', change: '+3' },
    { title: 'Approved', value: stats.approvedRequisitions, icon: FiCheckCircle, color: 'bg-green-500', change: '+8' },
    { title: 'My Assets', value: stats.totalAssets, icon: FiHardDrive, color: 'bg-purple-500', change: '0' },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: 'bg-gray-100 text-gray-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      APPROVED: 'bg-green-100 text-green-700',
      COMPLETED: 'bg-blue-100 text-blue-700',
      REJECTED: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Banner - FIXED: Use getFullName() instead of user?.name */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
          <h1 className="text-2xl font-bold">Welcome back, {getFullName()}!</h1>
          <p className="mt-2 text-blue-100">
            Role: {user?.role || 'Not Assigned'} | 
            Department: {user?.department_name || 'Not Assigned'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-xs text-green-600 mt-1">{stat.change} from last month</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-xl`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/requisitions/create"
                className="flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition group"
              >
                <div>
                  <p className="font-medium text-blue-900">Create Requisition</p>
                  <p className="text-sm text-blue-600">Request new items</p>
                </div>
                <FiPlus className="h-6 w-6 text-blue-600 group-hover:scale-110 transition" />
              </Link>
              
              <Link
                to="/requisitions"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition group"
              >
                <div>
                  <p className="font-medium text-gray-800">View All Requisitions</p>
                  <p className="text-sm text-gray-500">Track your requests</p>
                </div>
                <FiFileText className="h-6 w-6 text-gray-500 group-hover:scale-110 transition" />
              </Link>
              
              <Link
                to="/my-assets"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition group"
              >
                <div>
                  <p className="font-medium text-gray-800">My Assets</p>
                  <p className="text-sm text-gray-500">View assigned equipment</p>
                </div>
                <FiPackage className="h-6 w-6 text-gray-500 group-hover:scale-110 transition" />
              </Link>
            </div>

            {/* Department Stats */}
            {Object.keys(departmentStats).length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Requests by Department</h3>
                <div className="space-y-2">
                  {Object.entries(departmentStats).slice(0, 3).map(([dept, count]) => (
                    <div key={dept} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{dept}</span>
                      <span className="font-semibold text-gray-800">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Requisitions */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">Recent Requisitions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Req #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentRequisitions.map((req) => (
                    <tr 
                      key={req.id} 
                      className="hover:bg-gray-50 cursor-pointer transition"
                      onClick={() => window.location.href = `/requisitions/${req.id}`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{req.req_number}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {req.department || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(req.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ${req.total_cost?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {recentRequisitions.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No requisitions found
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        {stats.lowStockItems > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FiAlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Low Stock Alert</p>
                <p className="text-xs text-yellow-700">{stats.lowStockItems} items are running low on stock</p>
              </div>
            </div>
            <Link to="/inventory" className="text-sm text-yellow-700 hover:text-yellow-900 font-medium">
              View Inventory →
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;