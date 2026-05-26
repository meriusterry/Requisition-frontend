import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { fetchRequisitions } from '../../services/mockData';
import { FiPlus, FiSearch, FiEye, FiFilter } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const RequisitionList: React.FC = () => {
  const [requisitions, setRequisitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadRequisitions();
  }, []);

  const loadRequisitions = async () => {
    try {
      const data = await fetchRequisitions();
      setRequisitions(data);
    } catch (error) {
      console.error('Failed to load requisitions:', error);
    } finally {
      setLoading(false);
    }
  };

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

  // Get unique departments for filter
  const departments = ['all', ...new Set(requisitions.map(req => req.department).filter(Boolean))];

  const filteredRequisitions = requisitions.filter(req => {
    const matchSearch = req.req_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       req.requester_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !statusFilter || req.status === statusFilter;
    const matchDepartment = !departmentFilter || departmentFilter === 'all' || req.department === departmentFilter;
    return matchSearch && matchStatus && matchDepartment;
  });

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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Requisitions</h1>
            <p className="text-gray-500 mt-1">View and manage all item requests</p>
          </div>
          <Link
            to="/requisitions/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FiPlus className="h-4 w-4 mr-2" />
            New Requisition
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by requisition number or requester..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="COMPLETED">Completed</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Requisitions Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requisition #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requester</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequisitions.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{req.req_number}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{req.requester_name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {req.department || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(req.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-600">
                          {req.items?.length || 0} item(s)
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {req.items?.slice(0, 2).map((item: any, idx: number) => (
                            <span key={idx} className="text-xs text-gray-500">
                              {item.item_name}
                              {idx < req.items.length - 1 && idx < 1 ? ', ' : ''}
                            </span>
                          ))}
                          {req.items?.length > 2 && (
                            <span className="text-xs text-gray-400">
                              +{req.items.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/requisitions/${req.id}`} className="text-blue-600 hover:text-blue-800">
                        <FiEye className="h-5 w-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredRequisitions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No requisitions found
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RequisitionList;