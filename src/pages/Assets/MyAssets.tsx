import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { fetchMyAssets } from '../../services/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiPackage, 
  FiCalendar, 
  FiInfo, 
  FiAlertCircle, 
  FiUsers,
  FiHardDrive,
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
  FiTool,
  FiRotateCcw,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiMessageSquare,
  FiX,
  FiRefreshCw
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Asset {
  id: number;
  asset_tag: string;
  name: string;
  type: string;
  serial_number: string;
  status: string;
  assigned_to: string | null;
  department: string | null;
  assigned_date: string;
  purchase_cost?: number;
  notes?: string;
}

const MyAssets: React.FC = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showRepairModal, setShowRepairModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [repairRequests, setRepairRequests] = useState<any[]>([]);
  const [returnRequests, setReturnRequests] = useState<any[]>([]);
  const [reportedIssues, setReportedIssues] = useState<any[]>([]);
  
  // Repair form state
  const [repairIssue, setRepairIssue] = useState('');
  const [repairPriority, setRepairPriority] = useState<'low' | 'medium' | 'high'>('medium');
  
  // Return form state
  const [returnReason, setReturnReason] = useState('');
  const [returnCondition, setReturnCondition] = useState<'good' | 'fair' | 'poor' | 'damaged'>('good');
  
  // Report issue form state
  const [reportType, setReportType] = useState<'damaged' | 'malfunctioning' | 'lost' | 'stolen' | 'other'>('malfunctioning');
  const [reportDescription, setReportDescription] = useState('');

  useEffect(() => {
    loadAssets();
    loadMockRequests();
  }, [user]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const data = await fetchMyAssets();
      console.log('Fetched assets:', data);
      console.log('Current user:', user);
      
      // Filter assets by current user
      const userAssets = data.filter(asset => {
        if (!user?.full_name && !user?.name) return false;
        const userName = user?.full_name || user?.name;
        return asset.assigned_to === userName;
      });
      
      console.log('Filtered user assets:', userAssets);
      setAssets(userAssets);
      
      if (userAssets.length === 0) {
        console.log('No assets found for user:', user?.full_name || user?.name);
      }
    } catch (error) {
      console.error('Failed to load assets:', error);
      toast.error('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  const loadMockRequests = () => {
    // Sample repair requests
    setRepairRequests([
      {
        id: 1,
        asset_name: 'Dell XPS Laptop',
        issue_description: 'Screen flickering and random shutdowns',
        priority: 'high',
        status: 'in_progress',
        requested_date: '2024-01-15'
      }
    ]);
    
    // Sample return requests
    setReturnRequests([
      {
        id: 1,
        asset_name: 'Dell 27" Monitor',
        reason: 'Upgraded to ultrawide monitor',
        condition: 'good',
        status: 'approved',
        requested_date: '2024-01-10'
      }
    ]);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Assigned': 'bg-green-100 text-green-700',
      'Available': 'bg-blue-100 text-blue-700',
      'Under Repair': 'bg-yellow-100 text-yellow-700',
      'Retired': 'bg-red-100 text-red-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'approved': 'bg-blue-100 text-blue-700',
      'in_progress': 'bg-purple-100 text-purple-700',
      'completed': 'bg-green-100 text-green-700',
      'rejected': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-blue-100 text-blue-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700'
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const getConditionColor = (condition: string) => {
    const colors: Record<string, string> = {
      good: 'bg-green-100 text-green-700',
      fair: 'bg-yellow-100 text-yellow-700',
      poor: 'bg-orange-100 text-orange-700',
      damaged: 'bg-red-100 text-red-700'
    };
    return colors[condition] || 'bg-gray-100 text-gray-700';
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

  const handleRequestRepair = () => {
    if (!selectedAsset) return;
    if (!repairIssue.trim()) {
      toast.error('Please describe the issue');
      return;
    }
    
    const newRepair = {
      id: repairRequests.length + 1,
      asset_name: selectedAsset.name,
      issue_description: repairIssue,
      priority: repairPriority,
      status: 'pending',
      requested_date: new Date().toISOString().split('T')[0]
    };
    
    setRepairRequests([...repairRequests, newRepair]);
    toast.success(`Repair request submitted for ${selectedAsset.name}`);
    setShowRepairModal(false);
    setRepairIssue('');
    setRepairPriority('medium');
    setSelectedAsset(null);
  };

  const handleRequestReturn = () => {
    if (!selectedAsset) return;
    if (!returnReason.trim()) {
      toast.error('Please provide a reason for return');
      return;
    }
    
    const newReturn = {
      id: returnRequests.length + 1,
      asset_name: selectedAsset.name,
      reason: returnReason,
      condition: returnCondition,
      status: 'pending',
      requested_date: new Date().toISOString().split('T')[0]
    };
    
    setReturnRequests([...returnRequests, newReturn]);
    toast.success(`Return request submitted for ${selectedAsset.name}`);
    setShowReturnModal(false);
    setReturnReason('');
    setReturnCondition('good');
    setSelectedAsset(null);
  };

  const handleReportIssue = () => {
    if (!selectedAsset) return;
    if (!reportDescription.trim()) {
      toast.error('Please describe the issue');
      return;
    }
    
    const newReport = {
      id: reportedIssues.length + 1,
      asset_name: selectedAsset.name,
      issue_type: reportType,
      description: reportDescription,
      reported_date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    
    setReportedIssues([...reportedIssues, newReport]);
    
    const issueMessages = {
      damaged: 'damaged',
      malfunctioning: 'malfunctioning',
      lost: 'lost',
      stolen: 'stolen',
      other: 'issue'
    };
    
    toast.warning(`${selectedAsset.name} reported as ${issueMessages[reportType]}`);
    setShowReportModal(false);
    setReportDescription('');
    setReportType('malfunctioning');
    setSelectedAsset(null);
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
            <h1 className="text-2xl font-bold text-gray-800">My Assets</h1>
            <p className="text-gray-500 mt-1">
              Equipment assigned to {user?.full_name || user?.name || 'you'}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={loadAssets}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
              title="Refresh"
            >
              <FiRefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowRequestsModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <FiClock className="h-4 w-4" />
              <span>My Requests</span>
            </button>
          </div>
        </div>

        {assets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FiPackage className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No assets assigned</h3>
            <p className="text-gray-500 mt-1">
              You don't have any assets assigned to you yet.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Logged in as: {user?.full_name || user?.name || user?.email || 'Unknown'}
            </p>
            <Link to="/requisitions/create" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
              Request an asset →
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assets.map((asset) => {
                const AssetIcon = getAssetTypeIcon(asset.type);
                return (
                  <div key={asset.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-50 p-2 rounded-lg">
                            <AssetIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{asset.name}</h3>
                            <p className="text-sm font-mono text-gray-500">{asset.asset_tag}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(asset.status)}`}>
                          {asset.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {asset.type && (
                          <div className="flex items-center text-sm text-gray-600">
                            <FiInfo className="h-4 w-4 mr-2" />
                            <span>Type: {asset.type}</span>
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                          <FiInfo className="h-4 w-4 mr-2" />
                          <span>Serial: {asset.serial_number}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiCalendar className="h-4 w-4 mr-2" />
                          <span>Assigned: {new Date(asset.assigned_date).toLocaleDateString()}</span>
                        </div>
                        {asset.department && (
                          <div className="flex items-center text-sm text-gray-600">
                            <FiUsers className="h-4 w-4 mr-2" />
                            <span>Department: {asset.department}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-2">
                        <button
                          onClick={() => {
                            setSelectedAsset(asset);
                            setShowRepairModal(true);
                          }}
                          className="text-sm bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1"
                        >
                          <FiTool className="h-3 w-3" />
                          <span>Repair</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAsset(asset);
                            setShowReturnModal(true);
                          }}
                          className="text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 transition py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1"
                        >
                          <FiRotateCcw className="h-3 w-3" />
                          <span>Return</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAsset(asset);
                            setShowReportModal(true);
                          }}
                          className="text-sm bg-red-50 text-red-700 hover:bg-red-100 transition py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1"
                        >
                          <FiAlertTriangle className="h-3 w-3" />
                          <span>Report</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Asset Summary */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-md font-semibold text-gray-800 mb-3">Asset Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Assets</p>
                  <p className="text-2xl font-bold text-gray-800">{assets.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Assigned</p>
                  <p className="text-2xl font-bold text-green-600">
                    {assets.filter(a => a.status === 'Assigned').length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Under Repair</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {assets.filter(a => a.status === 'Under Repair').length}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Repair Request Modal */}
      {showRepairModal && selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Request Repair</h2>
              <button onClick={() => setShowRepairModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Asset:</p>
                <p className="font-medium text-gray-900">{selectedAsset.name} ({selectedAsset.asset_tag})</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={repairPriority}
                  onChange={(e) => setRepairPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Description</label>
                <textarea
                  value={repairIssue}
                  onChange={(e) => setRepairIssue(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the issue with the asset..."
                />
              </div>
            </div>
            <div className="border-t px-6 py-4 flex justify-end space-x-3">
              <button onClick={() => setShowRepairModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                Cancel
              </button>
              <button onClick={handleRequestRepair} className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                Submit Repair Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Request Modal */}
      {showReturnModal && selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Request Return</h2>
              <button onClick={() => setShowReturnModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Asset:</p>
                <p className="font-medium text-gray-900">{selectedAsset.name} ({selectedAsset.asset_tag})</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <select
                  value={returnCondition}
                  onChange={(e) => setReturnCondition(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="good">Good - No visible wear</option>
                  <option value="fair">Fair - Normal wear and tear</option>
                  <option value="poor">Poor - Significant wear</option>
                  <option value="damaged">Damaged - Needs repair</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Return</label>
                <textarea
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Why are you returning this asset?"
                />
              </div>
            </div>
            <div className="border-t px-6 py-4 flex justify-end space-x-3">
              <button onClick={() => setShowReturnModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                Cancel
              </button>
              <button onClick={handleRequestReturn} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Submit Return Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Issue Modal */}
      {showReportModal && selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Report Issue</h2>
              <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Asset:</p>
                <p className="font-medium text-gray-900">{selectedAsset.name} ({selectedAsset.asset_tag})</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="malfunctioning">Malfunctioning</option>
                  <option value="damaged">Damaged</option>
                  <option value="lost">Lost</option>
                  <option value="stolen">Stolen</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe what happened..."
                />
              </div>
            </div>
            <div className="border-t px-6 py-4 flex justify-end space-x-3">
              <button onClick={() => setShowReportModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                Cancel
              </button>
              <button onClick={handleReportIssue} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Report Issue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* My Requests Modal */}
      {showRequestsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">My Requests</h2>
              <button onClick={() => setShowRequestsModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Repair Requests */}
              {repairRequests.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <FiTool className="h-5 w-5 mr-2 text-yellow-600" />
                    Repair Requests
                  </h3>
                  <div className="space-y-3">
                    {repairRequests.map((req) => (
                      <div key={req.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{req.asset_name}</p>
                            <p className="text-sm text-gray-500 mt-1">{req.issue_description}</p>
                          </div>
                          <div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(req.priority)}`}>
                              {req.priority.toUpperCase()} Priority
                            </span>
                            <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                              {req.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Requested: {new Date(req.requested_date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Return Requests */}
              {returnRequests.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <FiRotateCcw className="h-5 w-5 mr-2 text-blue-600" />
                    Return Requests
                  </h3>
                  <div className="space-y-3">
                    {returnRequests.map((req) => (
                      <div key={req.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{req.asset_name}</p>
                            <p className="text-sm text-gray-500 mt-1">{req.reason}</p>
                          </div>
                          <div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(req.condition)}`}>
                              Condition: {req.condition.toUpperCase()}
                            </span>
                            <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                              {req.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Requested: {new Date(req.requested_date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reported Issues */}
              {reportedIssues.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <FiAlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                    Reported Issues
                  </h3>
                  <div className="space-y-3">
                    {reportedIssues.map((issue) => (
                      <div key={issue.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{issue.asset_name}</p>
                            <p className="text-sm text-gray-500 mt-1">{issue.description}</p>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                            {issue.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Reported: {new Date(issue.reported_date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {repairRequests.length === 0 && returnRequests.length === 0 && reportedIssues.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FiPackage className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p>No requests yet</p>
                  <p className="text-sm mt-1">Submit repair, return, or report requests from your assets</p>
                </div>
              )}
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end">
              <button onClick={() => setShowRequestsModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
    </Layout>
  );
};

export default MyAssets;