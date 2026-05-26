import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { createRequisition, fetchCatalog } from '../../services/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiTrash2, 
  FiShoppingCart, 
  FiPackage, 
  FiMonitor, 
  FiMousePointer, 
  FiPrinter, 
  FiHardDrive, 
  FiPlus, 
  FiX,
  FiUser,
  FiFileText,
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
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  name: string;
  type: string;
  category: string;
  quantity: number;
  specifications?: string;
}

interface CatalogItem {
  id: number;
  code: string;
  name: string;
  category: string;
  unit_cost: number;
  in_stock: boolean;
  is_asset: boolean;
}

// All inventory types from mockData with their icons
const itemTypes = [
  // Computer Hardware
  { id: 'Laptop', name: 'Laptop', category: 'Computer Hardware', icon: FiHardDrive, description: 'Portable computer for work' },
  { id: 'Desktop', name: 'Desktop Computer', category: 'Computer Hardware', icon: FiHardDrive, description: 'Desktop workstation' },
  
  // Displays
  { id: 'Screen/Monitor', name: 'Monitor', category: 'Displays', icon: FiMonitor, description: 'External display monitor' },
  { id: 'Ultrawide Monitor', name: 'Ultrawide Monitor', category: 'Displays', icon: FiMonitor, description: 'Ultrawide curved monitor' },
  { id: 'Graphics Monitor', name: 'Graphics Monitor', category: 'Displays', icon: FiMonitor, description: 'High-resolution monitor for design' },
  
  // Accessories
  { id: 'Mouse', name: 'Mouse', category: 'Accessories', icon: FiMousePointer, description: 'Wired or wireless mouse' },
  { id: 'Keyboard', name: 'Keyboard', category: 'Accessories', icon: FiKey, description: 'Standard or mechanical keyboard' },
  { id: 'Webcam', name: 'Webcam', category: 'Accessories', icon: FiSmartphone, description: 'HD webcam for meetings' },
  { id: 'Headset', name: 'Headset', category: 'Accessories', icon: FiHeadphones, description: 'Noise-cancelling headset' },
  
  // Printers
  { id: 'Printer', name: 'Printer', category: 'Printers', icon: FiPrinter, description: 'Office printer' },
  { id: 'Laser Printer', name: 'Laser Printer', category: 'Printers', icon: FiPrinter, description: 'High-speed laser printer' },
  { id: 'All-in-One Printer', name: 'All-in-One Printer', category: 'Printers', icon: FiPrinter, description: 'Print, scan, copy, fax' },
  
  // Storage
  { id: 'Storage', name: 'External Storage', category: 'Storage', icon: FiDatabase, description: 'External hard drive or SSD' },
  { id: 'External SSD', name: 'External SSD', category: 'Storage', icon: FiDatabase, description: 'Fast portable SSD storage' },
  
  // Electronics
  { id: 'Electronics', name: 'Electronics', category: 'Electronics', icon: FiSmartphone, description: 'Various electronic devices' },
  { id: 'Tablet', name: 'Tablet', category: 'Electronics', icon: FiTablet, description: 'Tablet device' },
  { id: 'iPad', name: 'iPad', category: 'Electronics', icon: FiTablet, description: 'Apple iPad' },
  
  // Office Supplies
  { id: 'Pen', name: 'Pen', category: 'Office Supplies', icon: FiPenTool, description: 'Pens, markers, highlighters' },
  { id: 'Stationery', name: 'Stationery', category: 'Office Supplies', icon: FiBookOpen, description: 'Notebooks, sticky notes, binders' },
  
  // Kitchen Supplies
  { id: 'Sugar', name: 'Sugar', category: 'Kitchen Supplies', icon: FiCoffee, description: 'Sugar packets and dispensers' },
  { id: 'Coffee', name: 'Coffee', category: 'Kitchen Supplies', icon: FiCoffee, description: 'Coffee beans and pods' },
  
  // Furniture
  { id: 'Desk Chair', name: 'Desk Chair', category: 'Furniture', icon: FiPackage, description: 'Ergonomic office chair' },
  { id: 'Standing Desk', name: 'Standing Desk', category: 'Furniture', icon: FiPackage, description: 'Adjustable standing desk' },
  
  // Docking & Accessories
  { id: 'Accessories', name: 'Docking Station', category: 'Accessories', icon: FiCpu, description: 'Laptop docking station' },
  { id: 'USB-C Hub', name: 'USB-C Hub', category: 'Accessories', icon: FiCpu, description: 'Multi-port USB-C hub' },
  
  // Software
  { id: 'Software', name: 'Software License', category: 'Software', icon: FiPackage, description: 'Software licenses and subscriptions' },
  
  // Audio
  { id: 'Audio', name: 'Audio Equipment', category: 'Audio', icon: FiHeadphones, description: 'Speakers, conference equipment' },
  
  // Telecommunications
  { id: 'Phone', name: 'Office Phone', category: 'Telecommunications', icon: FiSmartphone, description: 'Desk phone for calls' }
];

const CreateRequisition: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [justification, setJustification] = useState('');
  const [department, setDepartment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [specifications, setSpecifications] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const departments = ['ICT', 'Finance', 'HR', 'Operations', 'Marketing', 'Procurement', 'Administration'];

  // Get unique categories for filter
  const categories = ['all', ...new Set(itemTypes.map(item => item.category))];

  // Filter items based on search and category
  const filteredItems = itemTypes.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = () => {
    if (!selectedType) {
      toast.error('Please select an item type');
      return;
    }

    const item = itemTypes.find(i => i.id === selectedType);
    if (!item) return;

    const existingItemIndex = cart.findIndex(i => i.type === selectedType);
    
    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
      toast.success(`Updated ${item.name} quantity`);
    } else {
      const newItem: CartItem = {
        id: Date.now().toString(),
        name: item.name,
        type: selectedType,
        category: item.category,
        quantity: quantity,
        specifications: specifications || undefined
      };
      setCart([...cart, newItem]);
      toast.success(`Added ${item.name} to cart`);
    }

    setSelectedType(null);
    setQuantity(1);
    setSpecifications('');
    setShowAddForm(false);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(cart.map(item => 
      item.id === id 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const handleSubmit = async () => {
    if (cart.length === 0) {
      toast.error('Please add at least one item');
      return;
    }
    
    if (!justification.trim()) {
      toast.error('Please provide a justification');
      return;
    }

    if (!department) {
      toast.error('Please select a department');
      return;
    }

    setSubmitting(true);
    try {
      const requisitionData = {
        justification,
        department,
        items: cart.map(item => ({
          name: item.name,
          type: item.type,
          quantity: item.quantity,
          specifications: item.specifications
        }))
      };
      const result = await createRequisition(requisitionData);
      toast.success('Requisition created successfully!');
      navigate(`/requisitions/${result.id}`);
    } catch (error) {
      toast.error('Failed to create requisition');
    } finally {
      setSubmitting(false);
    }
  };

  const getItemIcon = (typeId: string) => {
    const item = itemTypes.find(i => i.id === typeId);
    return item?.icon || FiPackage;
  };

  // Get cart total items
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Layout>
      <div className="w-full space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Create New Requisition</h1>
          <p className="text-gray-500 mt-1">Request items from inventory by selecting types and specifying quantities</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Item Types Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Select Item Type</h2>
                <div className="flex gap-3">
                  {/* Search Input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FiPackage className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  
                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                  
                  {!showAddForm && (
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2 text-sm"
                    >
                      <FiPlus className="h-4 w-4" />
                      <span>Add Item</span>
                    </button>
                  )}
                </div>
              </div>

              {!showAddForm ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
                  {filteredItems.map((item) => {
                    const Icon = item.icon;
                    const isInCart = cart.some(cartItem => cartItem.type === item.id);
                    return (
                      <div
                        key={item.id}
                        className={`border rounded-lg p-4 hover:shadow-md transition cursor-pointer ${
                          isInCart ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          setSelectedType(item.id);
                          setShowAddForm(true);
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${isInCart ? 'bg-blue-100' : 'bg-gray-100'}`}>
                            <Icon className={`h-5 w-5 ${isInCart ? 'text-blue-600' : 'text-gray-600'}`} />
                          </div>
                          <div className="flex-1">
                            <div>
                              <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
                              <p className="text-xs text-gray-500">{item.category}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                            {isInCart && (
                              <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                In Cart ({cart.find(c => c.type === item.id)?.quantity || 0})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {filteredItems.length === 0 && (
                    <div className="col-span-2 text-center py-8 text-gray-500">
                      <FiPackage className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p>No items found matching your search</p>
                    </div>
                  )}
                </div>
              ) : (
                /* Add Item Form */
                <div className="border rounded-lg p-6 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-semibold text-gray-800">
                      {selectedType ? itemTypes.find(i => i.id === selectedType)?.name : 'Add New Item'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setSelectedType(null);
                        setQuantity(1);
                        setSpecifications('');
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Item Type
                      </label>
                      <select
                        value={selectedType || ''}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select item type</option>
                        {itemTypes.map(item => (
                          <option key={item.id} value={item.id}>{item.name} ({item.category})</option>
                        ))}
                      </select>
                    </div>

                    {selectedType && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Specifications / Requirements (Optional)
                          </label>
                          <textarea
                            value={specifications}
                            onChange={(e) => setSpecifications(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Preferred brand, color, size, memory capacity, or any specific requirements..."
                          />
                        </div>

                        <button
                          onClick={handleAddToCart}
                          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
                        >
                          <FiShoppingCart className="h-4 w-4" />
                          <span>Add to Cart</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Justification and Department */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Justification
                </label>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Explain why you need these items (e.g., project requirements, replacement, new hire, etc.)"
                />
              </div>
            </div>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-20">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FiShoppingCart className="h-5 w-5 mr-2" />
                Request Cart ({cart.length} items)
              </h2>
              
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FiPackage className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm">Your request cart is empty</p>
                  <p className="text-xs mt-1">Click on any item type above to add</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                    {cart.map((item) => {
                      const Icon = getItemIcon(item.type);
                      return (
                        <div key={item.id} className="border-b pb-3 last:border-0">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-2 flex-1">
                              <Icon className="h-4 w-4 text-gray-400 mt-0.5" />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.name}</p>
                                <p className="text-xs text-gray-400">{item.category}</p>
                                {item.specifications && (
                                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.specifications}</p>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 bg-gray-100 rounded hover:bg-gray-200 flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 bg-gray-100 rounded hover:bg-gray-200 flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="border-t pt-4 mt-2">
                    <div className="flex justify-between mb-4">
                      <span className="font-semibold text-gray-700">Total Items:</span>
                      <span className="text-xl font-bold text-blue-600">{totalItems}</span>
                    </div>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting || cart.length === 0 || !department || !justification}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Submitting...' : 'Submit Requisition'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateRequisition;