import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { fetchAllAssets } from '../../services/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  FiPackage, 
  FiSearch, 
  FiUser, 
  FiCalendar, 
  FiInfo, 
  FiAlertCircle,
  FiFilter,
  FiDownload,
  FiUsers,
  FiHardDrive,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiX,
  FiDollarSign,
  FiMonitor,
  FiMousePointer,
  FiPrinter,
  FiSmartphone,
  FiTablet,
  FiPenTool,
  FiCoffee,
  FiKey,
  FiDatabase,
  FiCpu,
  FiHeadphones,
  FiBookOpen,
  FiGrid,
  FiList
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const AllAssets: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [assets, setAssets] = useState<any[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [viewMode, setViewMode] = useState<'employees' | 'assets'>('employees');
  const [assetViewMode, setAssetViewMode] = useState<'table' | 'grid'>('table');

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const data = await fetchAllAssets();
      setAssets(data);
      setFilteredAssets(data);
    } catch (error) {
      console.error('Failed to load assets:', error);
      toast.error('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filters
  const departments = ['all', ...new Set(assets.map(asset => asset.department).filter(Boolean))];
  const assetTypes = ['all', ...new Set(assets.map(asset => asset.type).filter(Boolean))];

  useEffect(() => {
    let filtered = assets;
    
    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.asset_tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (asset.assigned_to && asset.assigned_to.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (asset.type && asset.type.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(asset => asset.status === statusFilter);
    }
    
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(asset => asset.department === departmentFilter);
    }
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(asset => asset.type === typeFilter);
    }
    
    setFilteredAssets(filtered);
  }, [searchTerm, statusFilter, departmentFilter, typeFilter, assets]);

  // Group assets by employee
  const getEmployeesWithAssets = () => {
    const employeeMap = new Map();
    
    filteredAssets.forEach(asset => {
      if (asset.assigned_to && asset.status === 'Assigned') {
        if (!employeeMap.has(asset.assigned_to)) {
          employeeMap.set(asset.assigned_to, {
            name: asset.assigned_to,
            department: asset.department,
            assets: [],
            totalAssets: 0,
            totalValue: 0
          });
        }
        const employee = employeeMap.get(asset.assigned_to);
        employee.assets.push(asset);
        employee.totalAssets++;
        employee.totalValue += asset.purchase_cost || 0;
      }
    });
    
    return Array.from(employeeMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  };

  // Get unassigned assets
  const getUnassignedAssets = () => {
    return filteredAssets.filter(asset => !asset.assigned_to || asset.status !== 'Assigned');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Assigned': 'bg-green-100 text-green-700',
      'Available': 'bg-blue-100 text-blue-700',
      'Under Repair': 'bg-yellow-100 text-yellow-700',
      'Retired': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Assigned': return FiCheckCircle;
      case 'Available': return FiPackage;
      case 'Under Repair': return FiClock;
      default: return FiInfo;
    }
  };

  const getAssetTypeIcon = (type: string) => {
    const iconMap: Record<string, any> = {
      'Laptop': FiHardDrive,
      'Screen/Monitor': FiMonitor,
      'Mouse': FiMousePointer,
      'Pen': FiPenTool,
      'Sugar': FiCoffee,
      'Keyboard': FiKey,
      'Storage': FiDatabase,
      'Accessories': FiCpu,
      'Electronics': FiSmartphone,
      'Coffee': FiCoffee,
      'Stationery': FiBookOpen,
      'Audio': FiHeadphones,
      'Printer': FiPrinter,
      'Tablet': FiTablet
    };
    return iconMap[type] || FiPackage;
  };

  const handleExportReport = () => {
    const employees = getEmployeesWithAssets();
    const csvData = [
      ['Employee Name', 'Department', 'Total Assets', 'Total Value', 'Assets List'],
      ...employees.map(emp => [
        emp.name,
        emp.department || 'N/A',
        emp.totalAssets,
        `$${emp.totalValue.toLocaleString()}`,
        emp.assets.map((a: any) => `${a.name} (${a.type || 'N/A'}) - ${a.status}`).join('; ')
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employee-assets-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Employee assets exported successfully');
  };

  const getStats = () => {
    const employees = getEmployeesWithAssets();
    const assignedAssets = filteredAssets.filter(a => a.status === 'Assigned');
    const availableAssets = filteredAssets.filter(a => a.status === 'Available');
    
    // Group by type
    const typeStats: Record<string, number> = {};
    filteredAssets.forEach(asset => {
      if (asset.type) {
        typeStats[asset.type] = (typeStats[asset.type] || 0) + 1;
      }
    });
    
    return {
      totalEmployees: employees.length,
      totalAssets: filteredAssets.length,
      assignedAssets: assignedAssets.length,
      availableAssets: availableAssets.length,
      underRepair: filteredAssets.filter(a => a.status === 'Under Repair').length,
      totalValue: employees.reduce((sum, emp) => sum + emp.totalValue, 0),
      typeStats
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  // Check if user has admin permissions
  const isAdmin = user?.role_name === 'Admin' || hasPermission('assets', 'view_all');

  if (!isAdmin) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 rounded-xl p-12 text-center">
          <FiAlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800">Access Denied</h3>
          <p className="text-red-600 mt-1">You don't have permission to view all assets.</p>
          <Link to="/dashboard" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
            Return to Dashboard →
          </Link>
        </div>
      </Layout>
    );
  }

  const employees = getEmployeesWithAssets();
  const unassignedAssets = getUnassignedAssets();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Asset Management</h1>
            <p className="text-gray-500 mt-1">View all employees and their assigned assets</p>
          </div>
          <div className="flex space-x-3">
            <div className="flex rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('employees')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  viewMode === 'employees' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FiUsers className="h-4 w-4 inline mr-2" />
                Employees ({employees.length})
              </button>
              <button
                onClick={() => setViewMode('assets')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  viewMode === 'assets' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FiPackage className="h-4 w-4 inline mr-2" />
                All Assets ({filteredAssets.length})
              </button>
            </div>
            <button
              onClick={handleExportReport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 transition"
            >
              <FiDownload className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Employees</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalEmployees}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <FiUsers className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Assets</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalAssets}</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <FiHardDrive className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Assigned</p>
                <p className="text-2xl font-bold text-green-600">{stats.assignedAssets}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <FiCheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Available</p>
                <p className="text-2xl font-bold text-blue-600">{stats.availableAssets}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <FiPackage className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Under Repair</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.underRepair}</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-lg">
                <FiClock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Value</p>
                <p className="text-2xl font-bold text-yellow-600">${stats.totalValue.toLocaleString()}</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-lg">
                <FiDollarSign className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={viewMode === 'employees' ? "Search by employee name..." : "Search by asset, tag, type, or employee..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="Assigned">Assigned</option>
                <option value="Available">Available</option>
                <option value="Under Repair">Under Repair</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
            
            <div className="relative">
              <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
            
            <div className="relative">
              <FiPackage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                {assetTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {viewMode === 'employees' ? (
          /* Employees Table View */
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Assets
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assets
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <tr key={employee.name} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <FiUser className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {employee.department || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-semibold text-gray-900">{employee.totalAssets}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-semibold text-green-600">
                          ${employee.totalValue.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {employee.assets.slice(0, 3).map((asset: any) => {
                            const AssetIcon = getAssetTypeIcon(asset.type);
                            return (
                              <span key={asset.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                <AssetIcon className="h-3 w-3 mr-1" />
                                {asset.name}
                              </span>
                            );
                          })}
                          {employee.assets.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                              +{employee.assets.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowEmployeeModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center space-x-1"
                        >
                          <FiEye className="h-4 w-4" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {employees.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FiUsers className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p>No employees found</p>
                <p className="text-sm mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        ) : (
          /* Assets View */
          <>
            {/* View Toggle */}
            <div className="flex justify-end">
              <div className="flex rounded-lg border border-gray-200 p-1 bg-white">
                <button
                  onClick={() => setAssetViewMode('table')}
                  className={`px-3 py-1.5 rounded-md text-sm transition ${
                    assetViewMode === 'table' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FiList className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setAssetViewMode('grid')}
                  className={`px-3 py-1.5 rounded-md text-sm transition ${
                    assetViewMode === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FiGrid className="h-4 w-4" />
                </button>
              </div>
            </div>

            {assetViewMode === 'table' ? (
              /* Table View */
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Date</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Value</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAssets.map((asset) => {
                        const StatusIcon = getStatusIcon(asset.status);
                        const AssetIcon = getAssetTypeIcon(asset.type);
                        return (
                          <tr key={asset.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <AssetIcon className="h-5 w-5 text-gray-400" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                                  <div className="text-xs text-gray-500">Tag: {asset.asset_tag}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                {asset.type || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {asset.assigned_to ? (
                                <div className="flex items-center space-x-2">
                                  <FiUser className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-700">{asset.assigned_to}</span>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">Unassigned</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {asset.department || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {asset.status}
                              </div>
                             </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <FiCalendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {new Date(asset.assigned_date).toLocaleDateString()}
                                </span>
                              </div>
                             </td>
                            <td className="px-6 py-4 text-right">
                              <span className="text-sm font-semibold text-gray-900">
                                ${(asset.purchase_cost || 0).toLocaleString()}
                              </span>
                             </td>
                           </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredAssets.map((asset) => {
                  const StatusIcon = getStatusIcon(asset.status);
                  const AssetIcon = getAssetTypeIcon(asset.type);
                  return (
                    <div key={asset.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 border border-gray-100">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="bg-blue-50 p-2 rounded-lg">
                            <AssetIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{asset.name}</h3>
                            <p className="text-xs text-gray-500">{asset.asset_tag}</p>
                          </div>
                        </div>
                        <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {asset.status}
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Type:</span>
                          <span className="font-medium text-gray-700">{asset.type || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Serial:</span>
                          <span className="font-mono text-xs text-gray-600">{asset.serial_number}</span>
                        </div>
                        {asset.assigned_to && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Assigned to:</span>
                            <span className="font-medium text-gray-700">{asset.assigned_to}</span>
                          </div>
                        )}
                        {asset.department && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Department:</span>
                            <span className="font-medium text-gray-700">{asset.department}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-500">Value:</span>
                          <span className="font-semibold text-green-600">${(asset.purchase_cost || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Unassigned Assets Section */}
            {unassignedAssets.length > 0 && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-800">Unassigned Assets</h2>
                  <p className="text-sm text-gray-500">Assets available for assignment</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Value</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {unassignedAssets.map((asset) => {
                        const AssetIcon = getAssetTypeIcon(asset.type);
                        return (
                          <tr key={asset.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <AssetIcon className="h-5 w-5 text-gray-400" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                                  <div className="text-xs text-gray-500">Tag: {asset.asset_tag}</div>
                                </div>
                              </div>
                             </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                {asset.type || 'N/A'}
                              </span>
                             </td>
                            <td className="px-6 py-4">
                              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                                {asset.status}
                              </div>
                             </td>
                            <td className="px-6 py-4 text-right">
                              <span className="text-sm font-semibold text-gray-900">
                                ${(asset.purchase_cost || 0).toLocaleString()}
                              </span>
                             </td>
                           </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {filteredAssets.length === 0 && (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <FiPackage className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No assets found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Employee Assets Modal */}
      {showEmployeeModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedEmployee.name}</h2>
                <p className="text-sm text-gray-500">{selectedEmployee.department || 'No Department'}</p>
              </div>
              <button
                onClick={() => setShowEmployeeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedEmployee.totalAssets}</p>
                  <p className="text-sm text-gray-600">Total Assets</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">${selectedEmployee.totalValue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Value</p>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Assigned Assets</h3>
              <div className="space-y-3">
                {selectedEmployee.assets.map((asset: any) => {
                  const StatusIcon = getStatusIcon(asset.status);
                  const AssetIcon = getAssetTypeIcon(asset.type);
                  return (
                    <div key={asset.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <AssetIcon className="h-5 w-5 text-blue-600" />
                            <h4 className="font-semibold text-gray-800">{asset.name}</h4>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              {asset.type || 'N/A'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">Tag: {asset.asset_tag}</p>
                          <p className="text-xs text-gray-500">Serial: {asset.serial_number}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {asset.status}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <FiCalendar className="h-3 w-3 mr-1" />
                              Assigned: {new Date(asset.assigned_date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-green-600">
                            ${(asset.purchase_cost || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end">
              <button
                onClick={() => setShowEmployeeModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AllAssets;