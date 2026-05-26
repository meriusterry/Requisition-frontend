import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { fetchInventory, updateInventory } from '../../services/mockData';
import { 
  FiPackage, 
  FiSearch, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiFilter, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiX,
  FiSave,
  FiMapPin,
  FiHash,
  FiBox
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface InventoryItem {
  id: number;
  name: string;
  code: string;
  type: string;
  quantity: number;
  reserved: number;
  available: number;
  location: string;
}

const InventoryList: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: '',
    code: '',
    type: '',
    quantity: 0,
    reserved: 0,
    available: 0,
    location: ''
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const data = await fetchInventory();
      setInventory(data);
    } catch (error) {
      console.error('Failed to load inventory:', error);
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.available <= 0) {
      return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100', icon: FiAlertCircle };
    } else if (item.available <= 3) {
      return { text: 'Low Stock', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: FiAlertCircle };
    } else {
      return { text: 'In Stock', color: 'text-green-600', bg: 'bg-green-100', icon: FiCheckCircle };
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      code: '',
      type: '',
      quantity: 0,
      reserved: 0,
      available: 0,
      location: ''
    });
    setShowAddModal(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      code: item.code,
      type: item.type,
      quantity: item.quantity,
      reserved: item.reserved,
      available: item.available,
      location: item.location
    });
    setShowAddModal(true);
  };

  const handleDeleteItem = async (item: InventoryItem) => {
    if (!confirm(`Are you sure you want to delete ${item.name}?`)) return;
    
    try {
      setInventory(prev => prev.filter(i => i.id !== item.id));
      toast.success(`${item.name} deleted successfully`);
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleSaveItem = async () => {
    if (!formData.name || !formData.code || !formData.type || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingItem) {
        const updatedItem = { ...editingItem, ...formData };
        await updateInventory(editingItem.id, updatedItem.available);
        setInventory(prev => prev.map(i => i.id === editingItem.id ? updatedItem : i));
        toast.success(`${formData.name} updated successfully`);
      } else {
        const newItem: InventoryItem = {
          id: Math.max(...inventory.map(i => i.id), 0) + 1,
          name: formData.name!,
          code: formData.code!,
          type: formData.type!,
          quantity: formData.quantity!,
          reserved: formData.reserved!,
          available: formData.available!,
          location: formData.location!
        };
        setInventory(prev => [...prev, newItem]);
        toast.success(`${formData.name} added successfully`);
      }
      setShowAddModal(false);
      loadInventory();
    } catch (error) {
      console.error('Failed to save item:', error);
      toast.error('Failed to save item');
    }
  };

  // Get unique item types for filter
  const itemTypes = ['all', ...new Set(inventory.map(item => item.type || 'Uncategorized'))];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.type && item.type.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesType;
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
            <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
            <p className="text-gray-500 mt-1">Track and manage stock levels across all departments</p>
          </div>
          <button
            onClick={handleAddItem}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
          >
            <FiPlus className="h-4 w-4" />
            <span>Add Item</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Items</p>
                <p className="text-2xl font-bold text-gray-800">{filteredInventory.length}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <FiBox className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Stock Units</p>
                <p className="text-2xl font-bold text-gray-800">
                  {filteredInventory.reduce((sum, i) => sum + i.quantity + i.reserved, 0)}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <FiPackage className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Low Stock Items</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredInventory.filter(i => i.available <= 3 && i.available > 0).length}
                </p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-lg">
                <FiAlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">
                  {filteredInventory.filter(i => i.available === 0).length}
                </p>
              </div>
              <div className="bg-red-100 p-2 rounded-lg">
                <FiAlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by item name, code, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:w-64">
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                >
                  {itemTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Stock
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reserved
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Level
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInventory.map((item) => {
                  const status = getStockStatus(item);
                  const StatusIcon = status.icon;
                  const stockPercentage = (item.available / (item.quantity + item.reserved)) * 100;
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.code}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.type || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`${status.bg} inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.text}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-gray-800">
                        {item.quantity + item.reserved}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-yellow-600">
                        {item.reserved}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-sm font-bold ${item.available <= 3 ? 'text-red-600' : 'text-green-600'}`}>
                          {item.available}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.location}
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-32">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="p-1 text-blue-600 hover:text-blue-800 transition"
                            title="Edit"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item)}
                            className="p-1 text-red-600 hover:text-red-800 transition"
                            title="Delete"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredInventory.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FiPackage className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No items found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or filter</p>
            <button
              onClick={handleAddItem}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center space-x-2"
            >
              <FiPlus className="h-4 w-4" />
              <span>Add New Item</span>
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter item name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., LAP-001"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Laptop, Monitor, Mouse"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Warehouse A, Shelf 1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => {
                      const qty = parseInt(e.target.value) || 0;
                      setFormData({ 
                        ...formData, 
                        quantity: qty,
                        available: qty - (formData.reserved || 0)
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reserved
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reserved}
                    onChange={(e) => {
                      const reserved = parseInt(e.target.value) || 0;
                      setFormData({ 
                        ...formData, 
                        reserved,
                        available: (formData.quantity || 0) - reserved
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Stock
                </label>
                <input
                  type="number"
                  value={formData.available}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">Auto-calculated: Total - Reserved</p>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
              >
                <FiSave className="h-4 w-4" />
                <span>{editingItem ? 'Update' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default InventoryList;