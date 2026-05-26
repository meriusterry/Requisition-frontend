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
  FiBookOpen
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const MyAssets: React.FC = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const data = await fetchMyAssets();
      // Filter assets by user's department if needed
      const userAssets = data.filter(asset => 
        !user?.department || asset.department === user?.department || !asset.department
      );
      setAssets(userAssets);
    } catch (error) {
      console.error('Failed to load assets:', error);
    } finally {
      setLoading(false);
    }
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
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Assets</h1>
          <p className="text-gray-500 mt-1">Equipment assigned to {user?.department ? `${user.department} department` : 'you'}</p>
        </div>

        {assets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FiPackage className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No assets assigned</h3>
            <p className="text-gray-500 mt-1">You don't have any assets assigned to you yet.</p>
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
                      
                      <div className="mt-4 pt-4 border-t">
                        <button className="text-sm text-blue-600 hover:text-blue-700 transition">
                          Report Issue →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Asset Summary - Removed Total Value */}
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

            {/* Assets by Type Summary */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-md font-semibold text-gray-800 mb-3">Assets by Type</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(
                  assets.reduce((acc: Record<string, number>, asset) => {
                    const type = asset.type || 'Other';
                    acc[type] = (acc[type] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([type, count]) => {
                  const TypeIcon = getAssetTypeIcon(type);
                  return (
                    <div key={type} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <TypeIcon className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{type}</p>
                        <p className="text-lg font-bold text-gray-600">{count} {count === 1 ? 'asset' : 'assets'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default MyAssets;