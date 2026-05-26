import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { fetchRequisitionById, fetchInventory, updateInventory } from '../../services/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiArrowLeft, 
  FiPackage, 
  FiCheckCircle, 
  FiUser, 
  FiCalendar, 
  FiX, 
  FiPlus, 
  FiSearch,
  FiFilter,
  FiCheck,
  FiAlertCircle,
  FiHardDrive,
  FiMonitor,
  FiMousePointer,
  FiPrinter,
  FiSmartphone,
  FiTablet,
  FiShoppingCart,
  FiLoader,
  FiMinus,
  FiMapPin
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

const AssignAssets: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [requisition, setRequisition] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseItem, setPurchaseItem] = useState<any>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [assignedItems, setAssignedItems] = useState<Record<number, { inventoryId: number; quantity: number; name: string }[]>>({});

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      const [reqData, inventoryData] = await Promise.all([
        fetchRequisitionById(parseInt(id!)),
        fetchInventory()
      ]);
      
      setRequisition(reqData);
      setInventoryItems(inventoryData);
      
      // Initialize assigned items
      const initialAssigned: Record<number, { inventoryId: number; quantity: number; name: string }[]> = {};
      reqData?.items?.forEach((item: any) => {
        initialAssigned[item.id] = [];
      });
      setAssignedItems(initialAssigned);
      
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load requisition');
      navigate('/requisitions');
    } finally {
      setLoading(false);
    }
  };

  // Filter inventory items by type
  const getFilteredInventoryByType = (type: string): InventoryItem[] => {
    if (!inventoryItems.length) return [];
    
    const requestedType = type.trim().toLowerCase();
    let filtered = inventoryItems.filter(item => 
      item.type?.toLowerCase() === requestedType
    );
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleQuantityChange = (inventoryId: number, delta: number, inventoryItem: InventoryItem) => {
    const key = `${inventoryId}`;
    const currentQty = selectedQuantities[key] || 0;
    const newQty = currentQty + delta;
    
    if (newQty < 0) return;
    if (newQty > inventoryItem.available) {
      toast.error(`Only ${inventoryItem.available} items available in stock`);
      return;
    }
    
    setSelectedQuantities(prev => ({
      ...prev,
      [key]: newQty
    }));
  };

  const handleAssignFromInventory = (itemId: number, inventoryItem: InventoryItem) => {
    const key = `${inventoryItem.id}`;
    const quantityToAssign = selectedQuantities[key] || 0;
    
    if (quantityToAssign === 0) {
      toast.error('Please select a quantity to assign');
      return;
    }
    
    if (quantityToAssign > inventoryItem.available) {
      toast.error(`Only ${inventoryItem.available} items available`);
      return;
    }
    
    // Update inventory
    const newAvailable = inventoryItem.available - quantityToAssign;
    updateInventory(inventoryItem.id, newAvailable);
    
    // Update local inventory state
    setInventoryItems(prev => prev.map(item =>
      item.id === inventoryItem.id
        ? { ...item, available: newAvailable }
        : item
    ));
    
    // Add to assigned items
    setAssignedItems(prev => {
      const existing = prev[itemId] || [];
      const existingIndex = existing.findIndex(a => a.inventoryId === inventoryItem.id);
      
      if (existingIndex !== -1) {
        const updated = [...existing];
        updated[existingIndex] = { 
          ...updated[existingIndex], 
          quantity: updated[existingIndex].quantity + quantityToAssign 
        };
        return { ...prev, [itemId]: updated };
      } else {
        return { 
          ...prev, 
          [itemId]: [...existing, { 
            inventoryId: inventoryItem.id, 
            quantity: quantityToAssign,
            name: inventoryItem.name
          }] 
        };
      }
    });
    
    // Reset quantity selector
    setSelectedQuantities(prev => ({
      ...prev,
      [key]: 0
    }));
    
    toast.success(`Assigned ${quantityToAssign}x ${inventoryItem.name}`);
  };

  const handleRemoveAssignment = (itemId: number, inventoryId: number) => {
    const assignment = assignedItems[itemId]?.find(a => a.inventoryId === inventoryId);
    if (!assignment) return;
    
    // Return to inventory
    setInventoryItems(prev => prev.map(item =>
      item.id === inventoryId
        ? { ...item, available: item.available + assignment.quantity }
        : item
    ));
    
    // Remove from assigned items
    setAssignedItems(prev => ({
      ...prev,
      [itemId]: prev[itemId].filter(a => a.inventoryId !== inventoryId)
    }));
    
    toast.success('Assignment removed');
  };

  const handleUpdateAssignedQuantity = (itemId: number, inventoryId: number, newQuantity: number, availableStock: number) => {
    const currentAssignment = assignedItems[itemId]?.find(a => a.inventoryId === inventoryId);
    if (!currentAssignment) return;
    
    const requestedItem = requisition?.items?.find((i: any) => i.id === itemId);
    const totalAssigned = getTotalAssignedForItem(itemId) - currentAssignment.quantity;
    
    if (totalAssigned + newQuantity > requestedItem?.quantity) {
      toast.error(`Total assigned cannot exceed ${requestedItem?.quantity}`);
      return;
    }
    
    const quantityDiff = newQuantity - currentAssignment.quantity;
    
    if (quantityDiff > 0 && quantityDiff > availableStock) {
      toast.error(`Only ${availableStock} additional items available`);
      return;
    }
    
    // Update inventory
    setInventoryItems(prev => prev.map(item =>
      item.id === inventoryId
        ? { ...item, available: item.available - quantityDiff }
        : item
    ));
    
    // Update assigned items
    setAssignedItems(prev => ({
      ...prev,
      [itemId]: prev[itemId].map(a =>
        a.inventoryId === inventoryId ? { ...a, quantity: newQuantity } : a
      )
    }));
  };

  const getTotalAssignedForItem = (itemId: number): number => {
    return (assignedItems[itemId] || []).reduce((sum, a) => sum + a.quantity, 0);
  };

  const getTotalAvailableForType = (type: string): number => {
    return inventoryItems
      .filter(item => item.type?.toLowerCase() === type.toLowerCase())
      .reduce((sum, item) => sum + item.available, 0);
  };

  const handlePurchaseClick = (item: any) => {
    const totalAvailable = getTotalAvailableForType(item.item_type || item.type);
    const totalAssigned = getTotalAssignedForItem(item.id);
    const remainingNeeded = item.quantity - totalAssigned;
    const toPurchase = Math.max(0, remainingNeeded - totalAvailable);
    
    setPurchaseItem({ ...item, remainingNeeded, toPurchase });
    setPurchaseQuantity(toPurchase || 1);
    setShowPurchaseModal(true);
  };

  const handlePurchaseSubmit = async () => {
    setIsPurchasing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Find existing inventory or create new
      const existingInventory = inventoryItems.find(i => i.type === purchaseItem.item_type);
      
      if (existingInventory) {
        const newAvailable = existingInventory.available + purchaseQuantity;
        await updateInventory(existingInventory.id, newAvailable);
        
        setInventoryItems(prev => prev.map(item =>
          item.id === existingInventory.id
            ? { ...item, available: newAvailable }
            : item
        ));
      }
      
      toast.success(`Successfully purchased ${purchaseQuantity} ${purchaseItem.item_name}(s)`);
      setShowPurchaseModal(false);
      setPurchaseItem(null);
      setPurchaseQuantity(1);
    } catch (error) {
      console.error('Purchase failed:', error);
      toast.error('Failed to purchase items');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleSubmitAssignments = async () => {
    setAssigning(true);
    try {
      // Check if all requested quantities are assigned
      let allFulfilled = true;
      for (const reqItem of requisition.items) {
        const totalAssigned = getTotalAssignedForItem(reqItem.id);
        if (totalAssigned < reqItem.quantity) {
          allFulfilled = false;
          break;
        }
      }
      
      if (!allFulfilled) {
        toast.error('Please assign all requested quantities before submitting');
        setAssigning(false);
        return;
      }
      
      toast.success('All assets assigned successfully!');
      navigate(`/requisitions/${id}`);
    } catch (error) {
      console.error('Failed to assign assets:', error);
      toast.error('Failed to assign assets');
    } finally {
      setAssigning(false);
    }
  };

  const getFulfillmentStats = () => {
    if (!requisition?.items) return { total: 0, assigned: 0, percentage: 0 };
    
    let totalRequested = 0;
    let totalAssigned = 0;
    
    requisition.items.forEach((item: any) => {
      totalRequested += item.quantity;
      totalAssigned += getTotalAssignedForItem(item.id);
    });
    
    return {
      total: totalRequested,
      assigned: totalAssigned,
      percentage: totalRequested > 0 ? (totalAssigned / totalRequested) * 100 : 0
    };
  };

  const getAssetIcon = (name: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('laptop')) return FiHardDrive;
    if (nameLower.includes('desktop')) return FiHardDrive;
    if (nameLower.includes('monitor')) return FiMonitor;
    if (nameLower.includes('mouse')) return FiMousePointer;
    if (nameLower.includes('printer')) return FiPrinter;
    if (nameLower.includes('phone')) return FiSmartphone;
    if (nameLower.includes('tablet')) return FiTablet;
    return FiPackage;
  };

  const fulfillment = getFulfillmentStats();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!requisition) return null;

  return (
    <Layout>
      <div className="max-w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/requisitions/${id}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FiArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Assign Assets - {requisition.req_number}
              </h1>
              <p className="text-gray-500 mt-1">
                Select specific products and quantities to assign from inventory
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <div className="px-4 py-2 bg-gray-100 rounded-lg">
              <span className="text-sm text-gray-600">Fulfillment:</span>
              <span className={`ml-2 font-semibold ${
                fulfillment.percentage === 100 ? 'text-green-600' :
                fulfillment.percentage > 0 ? 'text-yellow-600' : 'text-gray-600'
              }`}>
                {fulfillment.assigned}/{fulfillment.total} ({Math.round(fulfillment.percentage)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Requisition Summary Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-blue-100">Requester</p>
              <p className="font-semibold flex items-center gap-2">
                <FiUser className="h-4 w-4" />
                {requisition.requester_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-blue-100">Department</p>
              <p className="font-semibold">{requisition.department || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-blue-100">Created</p>
              <p className="font-semibold flex items-center gap-2">
                <FiCalendar className="h-4 w-4" />
                {new Date(requisition.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-blue-100">Justification</p>
              <p className="font-semibold truncate">{requisition.justification}</p>
            </div>
          </div>
        </div>

        {/* Items to Assign Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">Items to Assign</h2>
            <p className="text-sm text-gray-500">Click on any item row to expand and assign specific products</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Requested</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Assigned</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requisition.items?.map((item: any) => {
                  const itemType = item.item_type || item.type || '';
                  const totalAssigned = getTotalAssignedForItem(item.id);
                  const isFullyAssigned = totalAssigned >= item.quantity;
                  const isExpanded = expandedItem === item.id;
                  
                  return (
                    <React.Fragment key={item.id}>
                      <tr 
                        className={`hover:bg-gray-50 cursor-pointer transition ${isExpanded ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          setExpandedItem(isExpanded ? null : item.id);
                          setSearchTerm('');
                        }}
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{item.item_name}</div>
                          {item.specifications && (
                            <div className="text-xs text-gray-500 mt-1">Specs: {item.specifications}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <FiFilter className="h-3 w-3 mr-1" />
                            {itemType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-sm font-semibold ${isFullyAssigned ? 'text-green-600' : totalAssigned > 0 ? 'text-yellow-600' : 'text-gray-500'}`}>
                            {totalAssigned}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {isFullyAssigned ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <FiCheckCircle className="h-3 w-3 mr-1" />
                              Complete
                            </span>
                          ) : totalAssigned > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <FiAlertCircle className="h-3 w-3 mr-1" />
                              Partial
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedItem(isExpanded ? null : item.id);
                              setSearchTerm('');
                            }}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            {isExpanded ? 'Collapse' : 'Assign Products'}
                          </button>
                        </td>
                      </tr>
                      
                      {/* Expanded Row - Product Selection */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 bg-gray-50">
                            <div className="space-y-4">
                              {/* Stock Summary */}
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <FiPackage className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium text-gray-700">Stock Summary:</span>
                                    <span className="text-sm text-gray-600">
                                      Total available: <strong>{getTotalAvailableForType(itemType)}</strong> units
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Need: {item.quantity - totalAssigned} more units
                                  </div>
                                </div>
                              </div>
                              
                              {/* Insufficient Stock Warning */}
                              {getTotalAvailableForType(itemType) < (item.quantity - totalAssigned) && !isFullyAssigned && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <FiAlertCircle className="h-5 w-5 text-yellow-600" />
                                      <div>
                                        <p className="text-sm font-medium text-yellow-800">
                                          Insufficient stock
                                        </p>
                                        <p className="text-xs text-yellow-600">
                                          Only {getTotalAvailableForType(itemType)} units available. Need {item.quantity - totalAssigned} more.
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => handlePurchaseClick(item)}
                                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-2"
                                    >
                                      <FiShoppingCart className="h-4 w-4" />
                                      Purchase {(item.quantity - totalAssigned) - getTotalAvailableForType(itemType)}
                                    </button>
                                  </div>
                                </div>
                              )}
                              
                              {/* Assigned Products Section */}
                              {(assignedItems[item.id] || []).length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Products:</h4>
                                  <div className="grid grid-cols-1 gap-2 mb-4">
                                    {assignedItems[item.id].map((assignment) => {
                                      const inventoryItem = inventoryItems.find(i => i.id === assignment.inventoryId);
                                      const maxAvailable = inventoryItem?.available || 0;
                                      const maxQuantity = Math.min(assignment.quantity + maxAvailable, item.quantity);
                                      
                                      return (
                                        <div key={assignment.inventoryId} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                                          <div className="flex-1">
                                            <p className="font-medium text-gray-800">{assignment.name}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                              <span className="text-xs text-gray-500">Quantity:</span>
                                              <select
                                                value={assignment.quantity}
                                                onChange={(e) => handleUpdateAssignedQuantity(
                                                  item.id, 
                                                  assignment.inventoryId, 
                                                  parseInt(e.target.value),
                                                  maxAvailable
                                                )}
                                                className="text-sm border rounded px-2 py-1 bg-white"
                                              >
                                                {[...Array(maxQuantity)].map((_, i) => i + 1).map(q => (
                                                  <option key={q} value={q}>{q}</option>
                                                ))}
                                              </select>
                                            </div>
                                          </div>
                                          <button
                                            onClick={() => handleRemoveAssignment(item.id, assignment.inventoryId)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                          >
                                            <FiX className="h-5 w-5" />
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                              
                              {/* Search Input */}
                              <div className="mb-3">
                                <div className="relative">
                                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                  <input
                                    type="text"
                                    placeholder={`Search ${itemType} products...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              </div>
                              
                              {/* Products Table */}
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product Name</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Code</th>
                                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Available</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Location</th>
                                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Quantity</th>
                                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {getFilteredInventoryByType(itemType).length === 0 ? (
                                      <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center">
                                          <div className="text-gray-500">
                                            <FiPackage className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                            <p>No products found matching type: <strong>"{itemType}"</strong></p>
                                            <p className="text-xs mt-1 text-gray-400">
                                              Try adjusting your search or purchase new stock
                                            </p>
                                          </div>
                                        </td>
                                      </tr>
                                    ) : (
                                      getFilteredInventoryByType(itemType).map(inv => {
                                        const Icon = getAssetIcon(inv.name);
                                        const key = `${inv.id}`;
                                        const currentQty = selectedQuantities[key] || 0;
                                        
                                        return (
                                          <tr key={inv.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2">
                                              <div className="flex items-center gap-2">
                                                <Icon className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm font-medium text-gray-800">{inv.name}</span>
                                              </div>
                                            </td>
                                            <td className="px-4 py-2">
                                              <span className="text-sm font-mono text-gray-600">{inv.code}</span>
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                {inv.available} in stock
                                              </span>
                                            </td>
                                            <td className="px-4 py-2">
                                              <div className="flex items-center gap-1">
                                                <FiMapPin className="h-3 w-3 text-gray-400" />
                                                <span className="text-xs text-gray-500">{inv.location}</span>
                                              </div>
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                              <div className="flex items-center justify-center space-x-2">
                                                <button
                                                  onClick={() => handleQuantityChange(inv.id, -1, inv)}
                                                  disabled={currentQty <= 0}
                                                  className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                                                >
                                                  <FiMinus className="h-3 w-3" />
                                                </button>
                                                <input
                                                  type="number"
                                                  min="0"
                                                  max={inv.available}
                                                  value={currentQty}
                                                  onChange={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    if (!isNaN(val) && val >= 0 && val <= inv.available) {
                                                      setSelectedQuantities(prev => ({
                                                        ...prev,
                                                        [key]: val
                                                      }));
                                                    }
                                                  }}
                                                  className="w-16 text-center border rounded px-2 py-1 text-sm"
                                                />
                                                <button
                                                  onClick={() => handleQuantityChange(inv.id, 1, inv)}
                                                  disabled={currentQty >= inv.available}
                                                  className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                                                >
                                                  <FiPlus className="h-3 w-3" />
                                                </button>
                                              </div>
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                              <button
                                                onClick={() => handleAssignFromInventory(item.id, inv)}
                                                disabled={currentQty === 0}
                                                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 mx-auto"
                                              >
                                                <FiPlus className="h-3 w-3" />
                                                Assign {currentQty}
                                              </button>
                                            </td>
                                          </tr>
                                        );
                                      })
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submit Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Fully Assigned</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Partially Assigned</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-600">Pending</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate(`/requisitions/${id}`)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAssignments}
                disabled={assigning || fulfillment.percentage !== 100}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FiCheck className="h-4 w-4" />
                {assigning ? 'Submitting...' : `Submit Assignments (${fulfillment.assigned}/${fulfillment.total})`}
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Fulfillment Progress</span>
              <span>{Math.round(fulfillment.percentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  fulfillment.percentage === 100 ? 'bg-green-500' :
                  fulfillment.percentage > 0 ? 'bg-yellow-500' : 'bg-gray-400'
                }`}
                style={{ width: `${fulfillment.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && purchaseItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="border-b px-6 py-4">
              <h2 className="text-xl font-bold text-gray-800">Purchase Items</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Item:</p>
                <p className="font-medium text-gray-900">{purchaseItem.item_name}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Type:</p>
                <p className="font-medium text-gray-900">{purchaseItem.item_type}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Current Stock:</p>
                <p className="font-medium text-gray-900">{getTotalAvailableForType(purchaseItem.item_type)} units</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Still Needed:</p>
                <p className="font-medium text-yellow-600">{purchaseItem.remainingNeeded - getTotalAvailableForType(purchaseItem.item_type)} units</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity to Purchase
                </label>
                <input
                  type="number"
                  min="1"
                  max={purchaseItem.remainingNeeded}
                  value={purchaseQuantity}
                  onChange={(e) => setPurchaseQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, purchaseItem.remainingNeeded)))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  After purchase, these items will be added to inventory and available for assignment.
                </p>
              </div>
            </div>
            
            <div className="border-t px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowPurchaseModal(false);
                  setPurchaseItem(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchaseSubmit}
                disabled={isPurchasing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isPurchasing ? (
                  <>
                    <FiLoader className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FiShoppingCart className="h-4 w-4" />
                    Confirm Purchase
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AssignAssets;