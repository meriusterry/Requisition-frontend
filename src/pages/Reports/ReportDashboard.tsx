import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { fetchRequisitions, fetchInventory, fetchAllAssets, getDashboardStats } from '../../services/mockData';
import { 
  FiBarChart2, 
  FiTrendingUp, 
  FiDollarSign, 
  FiPackage, 
  FiCheckCircle, 
  FiClock,
  FiDownload,
  FiUsers
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const ReportDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requisitions, setRequisitions] = useState<any[]>([]);
  const [departmentSpending, setDepartmentSpending] = useState<Record<string, number>>({});
  const [itemTypeStats, setItemTypeStats] = useState<Record<string, number>>({});

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const [reqData, statsData] = await Promise.all([
        fetchRequisitions(),
        getDashboardStats()
      ]);
      setRequisitions(reqData);
      setStats(statsData);
      
      // Calculate department spending
      const deptSpending: Record<string, number> = {};
      const typeStats: Record<string, number> = {};
      
      reqData.forEach(req => {
        const dept = req.department || 'Unassigned';
        deptSpending[dept] = (deptSpending[dept] || 0) + req.total_cost;
        
        // Count item types
        req.items?.forEach((item: any) => {
          const type = item.item_type || 'Other';
          typeStats[type] = (typeStats[type] || 0) + item.quantity;
        });
      });
      
      setDepartmentSpending(deptSpending);
      setItemTypeStats(typeStats);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusCount = (status: string) => {
    return requisitions.filter(r => r.status === status).length;
  };

  const getTotalSpending = () => {
    return requisitions.reduce((sum, r) => sum + r.total_cost, 0);
  };

  const getAverageRequestValue = () => {
    if (requisitions.length === 0) return 0;
    return getTotalSpending() / requisitions.length;
  };

  const handleExportReport = () => {
    // Create CSV data
    const csvData = [
      ['Requisition #', 'Requester', 'Department', 'Date', 'Total', 'Status'],
      ...requisitions.map(r => [
        r.req_number,
        r.requester_name,
        r.department || 'N/A',
        new Date(r.created_at).toLocaleDateString(),
        `$${r.total_cost.toFixed(2)}`,
        r.status
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `requisition-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported successfully');
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
            <p className="text-gray-500 mt-1">View system statistics and insights</p>
          </div>
          <button
            onClick={handleExportReport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <FiDownload className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Spending</p>
                <p className="text-2xl font-bold text-gray-800">${getTotalSpending().toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">Year to date</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <FiDollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Requisitions</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.totalRequisitions || 0}</p>
                <p className="text-xs text-green-600 mt-1">All time</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <FiBarChart2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Request</p>
                <p className="text-2xl font-bold text-gray-800">${getAverageRequestValue().toFixed(0)}</p>
                <p className="text-xs text-green-600 mt-1">Per requisition</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <FiTrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Items</p>
                <p className="text-2xl font-bold text-gray-800">{getStatusCount('PENDING')}</p>
                <p className="text-xs text-yellow-600 mt-1">Awaiting approval</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-xl">
                <FiClock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Requisition Status Distribution</h2>
            <div className="space-y-3">
              {['PENDING', 'APPROVED', 'COMPLETED', 'REJECTED', 'DRAFT'].map(status => {
                const count = getStatusCount(status);
                const percentage = requisitions.length > 0 ? (count / requisitions.length) * 100 : 0;
                const colors: Record<string, string> = {
                  PENDING: 'bg-yellow-500',
                  APPROVED: 'bg-green-500',
                  COMPLETED: 'bg-blue-500',
                  REJECTED: 'bg-red-500',
                  DRAFT: 'bg-gray-500'
                };
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{status}</span>
                      <span className="text-gray-800 font-medium">{count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${colors[status]} h-2 rounded-full transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Department Spending</h2>
            <div className="space-y-3">
              {Object.entries(departmentSpending).slice(0, 5).map(([dept, amount]) => {
                const percentage = (amount / getTotalSpending()) * 100;
                return (
                  <div key={dept}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{dept}</span>
                      <span className="text-gray-800 font-medium">${amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Item Type Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Most Requested Item Types</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(itemTypeStats).slice(0, 8).map(([type, count]) => (
              <div key={type} className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{count}</p>
                <p className="text-sm text-gray-600 mt-1">{type}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Requisitions Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">Recent Requisitions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requisition #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requester</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requisitions.slice(0, 10).map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{req.req_number}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{req.requester_name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {req.department || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(req.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ${req.total_cost.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        req.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        req.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                        req.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {requisitions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No requisitions found
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ReportDashboard;