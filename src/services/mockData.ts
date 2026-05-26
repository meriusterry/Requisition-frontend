import { Requisition, CatalogItem, InventoryItem, Asset, DashboardStats, RequisitionItem } from '../types';

// Department types
export type Department = 'ICT' | 'Finance' | 'HR' | 'Operations' | 'Marketing' | 'Procurement' | 'Administration';

// Mock Requisitions with department links
export const mockRequisitions: Requisition[] = [
  {
    id: 1,
    req_number: 'REQ-2024-001',
    requester_id: 1,
    requester_name: 'John Smith',
    department: 'ICT',
    status: 'PENDING',
    total_cost: 1850.00,
    justification: 'New laptop for developer joining next week',
    created_at: '2024-01-15T10:30:00Z',
    items: [
      { id: 1, item_name: 'Dell XPS Laptop', item_type: 'Laptop', quantity: 1, unit_cost: 1500, total: 1500 },
      { id: 2, item_name: 'Dell 27" Monitor', item_type: 'Screen/Monitor', quantity: 1, unit_cost: 350, total: 350 }
    ]
  },
  {
    id: 2,
    req_number: 'REQ-2024-002',
    requester_id: 2,
    requester_name: 'Sarah Johnson',
    department: 'Finance',
    status: 'APPROVED',
    total_cost: 125.00,
    justification: 'Office supplies for new finance analyst',
    created_at: '2024-01-16T14:20:00Z',
    approved_at: '2024-01-17T09:00:00Z',
    items: [
      { id: 3, item_name: 'Wireless Mouse', item_type: 'Mouse', quantity: 2, unit_cost: 25, total: 50 },
      { id: 4, item_name: 'Pilot Pen Pack', item_type: 'Pen', quantity: 5, unit_cost: 3, total: 15 },
      { id: 5, item_name: 'Sugar Packets (50ct)', item_type: 'Sugar', quantity: 2, unit_cost: 5, total: 10 },
      { id: 6, item_name: 'Coffee Beans', item_type: 'Coffee', quantity: 1, unit_cost: 50, total: 50 }
    ]
  },
  {
    id: 3,
    req_number: 'REQ-2024-003',
    requester_id: 1,
    requester_name: 'John Smith',
    department: 'ICT',
    status: 'COMPLETED',
    total_cost: 1200.00,
    justification: 'Upgrade to ultrawide monitor for design work',
    created_at: '2024-01-10T11:00:00Z',
    approved_at: '2024-01-11T10:00:00Z',
    items: [
      { id: 7, item_name: 'Ultrawide Monitor', item_type: 'Screen/Monitor', quantity: 1, unit_cost: 1200, total: 1200 }
    ]
  },
  {
    id: 4,
    req_number: 'REQ-2024-004',
    requester_id: 3,
    requester_name: 'Mike Wilson',
    department: 'HR',
    status: 'PENDING',
    total_cost: 1245.00,
    justification: 'HR workstation setup for new staff',
    created_at: '2024-01-18T08:45:00Z',
    items: [
      { id: 8, item_name: 'Lenovo ThinkPad Laptop', item_type: 'Laptop', quantity: 1, unit_cost: 1200, total: 1200 },
      { id: 9, item_name: 'Wireless Keyboard', item_type: 'Keyboard', quantity: 1, unit_cost: 45, total: 45 }
    ]
  },
  {
    id: 5,
    req_number: 'REQ-2024-005',
    requester_id: 2,
    requester_name: 'Sarah Johnson',
    department: 'Finance',
    status: 'APPROVED',
    total_cost: 350.00,
    justification: 'External storage for backup',
    created_at: '2024-01-17T13:15:00Z',
    approved_at: '2024-01-18T11:30:00Z',
    items: [
      { id: 10, item_name: '1TB External SSD', item_type: 'Storage', quantity: 2, unit_cost: 175, total: 350 }
    ]
  },
  {
    id: 6,
    req_number: 'REQ-2024-006',
    requester_id: 1,
    requester_name: 'John Smith',
    department: 'ICT',
    status: 'REJECTED',
    total_cost: 500.00,
    justification: 'Premium headphones',
    created_at: '2024-01-14T09:00:00Z',
    approved_at: '2024-01-15T14:00:00Z',
    items: [
      { id: 11, item_name: 'Noise Cancelling Headphones', item_type: 'Audio', quantity: 1, unit_cost: 500, total: 500 }
    ]
  },
  {
    id: 7,
    req_number: 'REQ-2024-007',
    requester_id: 4,
    requester_name: 'Emily Brown',
    department: 'Operations',
    status: 'PENDING',
    total_cost: 250.00,
    justification: 'Kitchen supplies for break room',
    created_at: '2024-01-19T10:00:00Z',
    items: [
      { id: 12, item_name: 'Sugar Dispenser Set', item_type: 'Sugar', quantity: 3, unit_cost: 15, total: 45 },
      { id: 13, item_name: 'Premium Pens (Box of 12)', item_type: 'Pen', quantity: 2, unit_cost: 25, total: 50 },
      { id: 14, item_name: 'Ergonomic Mouse', item_type: 'Mouse', quantity: 2, unit_cost: 40, total: 80 },
      { id: 15, item_name: 'Notebooks (Pack of 5)', item_type: 'Stationery', quantity: 3, unit_cost: 15, total: 45 }
    ]
  },
  {
    id: 8,
    req_number: 'REQ-2024-008',
    requester_id: 5,
    requester_name: 'David Chen',
    department: 'Marketing',
    status: 'APPROVED',
    total_cost: 6320.00,
    justification: 'Creative workstations for design team',
    created_at: '2024-01-16T15:30:00Z',
    approved_at: '2024-01-18T14:00:00Z',
    items: [
      { id: 16, item_name: 'MacBook Pro Laptop', item_type: 'Laptop', quantity: 2, unit_cost: 2300, total: 4600 },
      { id: 17, item_name: 'Graphics Monitor 32"', item_type: 'Screen/Monitor', quantity: 2, unit_cost: 800, total: 1600 },
      { id: 18, item_name: 'Designer Mouse', item_type: 'Mouse', quantity: 2, unit_cost: 60, total: 120 }
    ]
  },
  {
    id: 9,
    req_number: 'REQ-2024-009',
    requester_id: 6,
    requester_name: 'Patricia Lee',
    department: 'Procurement',
    status: 'DRAFT',
    total_cost: 100.00,
    justification: 'Office renovation supplies',
    created_at: '2024-01-20T09:00:00Z',
    items: [
      { id: 19, item_name: 'Whiteboard Markers (Pack)', item_type: 'Pen', quantity: 5, unit_cost: 10, total: 50 },
      { id: 20, item_name: 'Sticky Notes (Pack)', item_type: 'Stationery', quantity: 10, unit_cost: 5, total: 50 }
    ]
  }
];

// Mock Catalog Items with types
export const mockCatalog: CatalogItem[] = [
  // Laptops
  { id: 1, code: 'LAP-001', name: 'Dell XPS Laptop', category: 'Laptop', unit_cost: 1500, in_stock: true, is_asset: true },
  { id: 2, code: 'LAP-002', name: 'Lenovo ThinkPad Laptop', category: 'Laptop', unit_cost: 1200, in_stock: true, is_asset: true },
  { id: 3, code: 'LAP-003', name: 'MacBook Pro Laptop', category: 'Laptop', unit_cost: 2300, in_stock: true, is_asset: true },
  { id: 4, code: 'LAP-004', name: 'HP EliteBook Laptop', category: 'Laptop', unit_cost: 1350, in_stock: true, is_asset: true },
  { id: 5, code: 'LAP-005', name: 'Microsoft Surface Laptop', category: 'Laptop', unit_cost: 1800, in_stock: true, is_asset: true },
  
  // Screens/Monitors
  { id: 6, code: 'MON-001', name: 'Dell 27" Monitor', category: 'Screen/Monitor', unit_cost: 350, in_stock: true, is_asset: true },
  { id: 7, code: 'MON-002', name: 'Ultrawide Monitor', category: 'Screen/Monitor', unit_cost: 1000, in_stock: true, is_asset: true },
  { id: 8, code: 'MON-003', name: 'Graphics Monitor 32"', category: 'Screen/Monitor', unit_cost: 800, in_stock: true, is_asset: true },
  { id: 9, code: 'MON-004', name: 'Portable Monitor', category: 'Screen/Monitor', unit_cost: 250, in_stock: true, is_asset: true },
  { id: 10, code: 'MON-005', name: 'Dual Monitor Stand', category: 'Screen/Monitor', unit_cost: 120, in_stock: true, is_asset: true },
  
  // Mice
  { id: 11, code: 'MOU-001', name: 'Wireless Mouse', category: 'Mouse', unit_cost: 25, in_stock: true, is_asset: false },
  { id: 12, code: 'MOU-002', name: 'Ergonomic Mouse', category: 'Mouse', unit_cost: 40, in_stock: true, is_asset: false },
  { id: 13, code: 'MOU-003', name: 'Designer Mouse', category: 'Mouse', unit_cost: 60, in_stock: true, is_asset: false },
  { id: 14, code: 'MOU-004', name: 'Gaming Mouse', category: 'Mouse', unit_cost: 80, in_stock: true, is_asset: false },
  { id: 15, code: 'MOU-005', name: 'Vertical Mouse', category: 'Mouse', unit_cost: 55, in_stock: true, is_asset: false },
  
  // Pens
  { id: 16, code: 'PEN-001', name: 'Pilot Pen Pack', category: 'Pen', unit_cost: 3, in_stock: true, is_asset: false },
  { id: 17, code: 'PEN-002', name: 'Premium Pens (Box of 12)', category: 'Pen', unit_cost: 25, in_stock: true, is_asset: false },
  { id: 18, code: 'PEN-003', name: 'Whiteboard Markers (Pack)', category: 'Pen', unit_cost: 10, in_stock: true, is_asset: false },
  { id: 19, code: 'PEN-004', name: 'Fountain Pen', category: 'Pen', unit_cost: 50, in_stock: true, is_asset: false },
  { id: 20, code: 'PEN-005', name: 'Highlighters (Pack)', category: 'Pen', unit_cost: 8, in_stock: true, is_asset: false },
  
  // Sugar & Kitchen
  { id: 21, code: 'SUG-001', name: 'Sugar Packets (50ct)', category: 'Sugar', unit_cost: 5, in_stock: true, is_asset: false },
  { id: 22, code: 'SUG-002', name: 'Sugar Dispenser Set', category: 'Sugar', unit_cost: 15, in_stock: true, is_asset: false },
  { id: 23, code: 'SUG-003', name: 'Brown Sugar (2lb)', category: 'Sugar', unit_cost: 8, in_stock: true, is_asset: false },
  { id: 24, code: 'SUG-004', name: 'Stevia Packets', category: 'Sugar', unit_cost: 10, in_stock: true, is_asset: false },
  
  // Other Items
  { id: 25, code: 'KEY-001', name: 'Wireless Keyboard', category: 'Keyboard', unit_cost: 45, in_stock: true, is_asset: false },
  { id: 26, code: 'KEY-002', name: 'Mechanical Keyboard', category: 'Keyboard', unit_cost: 120, in_stock: true, is_asset: true },
  { id: 27, code: 'STO-001', name: '1TB External SSD', category: 'Storage', unit_cost: 175, in_stock: true, is_asset: false },
  { id: 28, code: 'STO-002', name: '2TB External SSD', category: 'Storage', unit_cost: 280, in_stock: true, is_asset: false },
  { id: 29, code: 'SOF-001', name: 'Microsoft Office', category: 'Software', unit_cost: 150, in_stock: true, is_asset: false },
  { id: 30, code: 'SOF-002', name: 'Adobe Creative Cloud', category: 'Software', unit_cost: 600, in_stock: true, is_asset: false },
  { id: 31, code: 'HD-001', name: 'External Hard Drive 2TB', category: 'Storage', unit_cost: 120, in_stock: true, is_asset: false },
  { id: 32, code: 'HD-002', name: 'External Hard Drive 4TB', category: 'Storage', unit_cost: 180, in_stock: true, is_asset: false },
  { id: 33, code: 'DOC-001', name: 'Laptop Docking Station', category: 'Accessories', unit_cost: 200, in_stock: true, is_asset: true },
  { id: 34, code: 'DOC-002', name: 'USB-C Hub', category: 'Accessories', unit_cost: 80, in_stock: true, is_asset: false },
  { id: 35, code: 'CAM-001', name: 'Webcam 4K', category: 'Electronics', unit_cost: 150, in_stock: true, is_asset: true },
  { id: 36, code: 'CAM-002', name: 'Conference Camera', category: 'Electronics', unit_cost: 400, in_stock: true, is_asset: true },
  { id: 37, code: 'COF-001', name: 'Coffee Beans (2lb)', category: 'Coffee', unit_cost: 50, in_stock: true, is_asset: false },
  { id: 38, code: 'COF-002', name: 'K-Cup Pods (48ct)', category: 'Coffee', unit_cost: 35, in_stock: true, is_asset: false },
  { id: 39, code: 'STA-001', name: 'Notebooks (Pack of 5)', category: 'Stationery', unit_cost: 15, in_stock: true, is_asset: false },
  { id: 40, code: 'STA-002', name: 'Sticky Notes (Pack)', category: 'Stationery', unit_cost: 5, in_stock: true, is_asset: false },
  { id: 41, code: 'STA-003', name: 'Binder Clips Set', category: 'Stationery', unit_cost: 8, in_stock: true, is_asset: false },
  { id: 42, code: 'AUD-001', name: 'Noise Cancelling Headphones', category: 'Audio', unit_cost: 500, in_stock: true, is_asset: true },
  { id: 43, code: 'AUD-002', name: 'Conference Speaker', category: 'Audio', unit_cost: 200, in_stock: true, is_asset: true },
  { id: 44, code: 'PRI-001', name: 'Laser Printer', category: 'Printers', unit_cost: 450, in_stock: true, is_asset: true },
  { id: 45, code: 'PRI-002', name: 'All-in-One Printer', category: 'Printers', unit_cost: 350, in_stock: true, is_asset: true }
];

// Mock Inventory with diversified items
export const mockInventory: InventoryItem[] = [
  // Laptops
  { id: 1, name: 'Dell XPS Laptop', code: 'LAP-001', type: 'Laptop', quantity: 15, reserved: 5, available: 10, location: 'ICT Store, Aisle 1, Shelf B' },
  { id: 2, name: 'Lenovo ThinkPad Laptop', code: 'LAP-002', type: 'Laptop', quantity: 12, reserved: 3, available: 9, location: 'ICT Store, Aisle 1, Shelf A' },
  { id: 3, name: 'MacBook Pro Laptop', code: 'LAP-003', type: 'Laptop', quantity: 8, reserved: 2, available: 6, location: 'ICT Store, Aisle 1, Shelf C' },
  { id: 4, name: 'HP EliteBook Laptop', code: 'LAP-004', type: 'Laptop', quantity: 6, reserved: 1, available: 5, location: 'ICT Store, Aisle 1, Shelf D' },
  { id: 5, name: 'Microsoft Surface Laptop', code: 'LAP-005', type: 'Laptop', quantity: 4, reserved: 1, available: 3, location: 'ICT Store, Aisle 1, Shelf E' },
  
  // Monitors
  { id: 6, name: 'Dell 27" Monitor', code: 'MON-001', type: 'Screen/Monitor', quantity: 20, reserved: 4, available: 16, location: 'ICT Store, Aisle 2, Shelf A' },
  { id: 7, name: 'Ultrawide Monitor', code: 'MON-002', type: 'Screen/Monitor', quantity: 8, reserved: 2, available: 6, location: 'ICT Store, Aisle 2, Shelf B' },
  { id: 8, name: 'Graphics Monitor 32"', code: 'MON-003', type: 'Screen/Monitor', quantity: 5, reserved: 1, available: 4, location: 'ICT Store, Aisle 2, Shelf C' },
  { id: 9, name: 'Portable Monitor', code: 'MON-004', type: 'Screen/Monitor', quantity: 10, reserved: 2, available: 8, location: 'ICT Store, Aisle 2, Shelf D' },
  
  // Mice
  { id: 10, name: 'Wireless Mouse', code: 'MOU-001', type: 'Mouse', quantity: 50, reserved: 10, available: 40, location: 'Accessories, Shelf A' },
  { id: 11, name: 'Ergonomic Mouse', code: 'MOU-002', type: 'Mouse', quantity: 25, reserved: 5, available: 20, location: 'Accessories, Shelf B' },
  { id: 12, name: 'Designer Mouse', code: 'MOU-003', type: 'Mouse', quantity: 12, reserved: 2, available: 10, location: 'Accessories, Shelf C' },
  { id: 13, name: 'Gaming Mouse', code: 'MOU-004', type: 'Mouse', quantity: 8, reserved: 1, available: 7, location: 'Accessories, Shelf D' },
  
  // Pens
  { id: 14, name: 'Pilot Pen Pack', code: 'PEN-001', type: 'Pen', quantity: 200, reserved: 30, available: 170, location: 'Stationery, Drawer 1' },
  { id: 15, name: 'Premium Pens (Box of 12)', code: 'PEN-002', type: 'Pen', quantity: 40, reserved: 5, available: 35, location: 'Stationery, Drawer 2' },
  { id: 16, name: 'Whiteboard Markers', code: 'PEN-003', type: 'Pen', quantity: 30, reserved: 4, available: 26, location: 'Stationery, Drawer 3' },
  { id: 17, name: 'Fountain Pen', code: 'PEN-004', type: 'Pen', quantity: 15, reserved: 2, available: 13, location: 'Stationery, Drawer 4' },
  
  // Sugar & Kitchen
  { id: 18, name: 'Sugar Packets (50ct)', code: 'SUG-001', type: 'Sugar', quantity: 60, reserved: 10, available: 50, location: 'Kitchen, Cabinet 1' },
  { id: 19, name: 'Sugar Dispenser Set', code: 'SUG-002', type: 'Sugar', quantity: 15, reserved: 2, available: 13, location: 'Kitchen, Cabinet 2' },
  { id: 20, name: 'Brown Sugar (2lb)', code: 'SUG-003', type: 'Sugar', quantity: 25, reserved: 3, available: 22, location: 'Kitchen, Pantry' },
  
  // Other items
  { id: 21, name: 'Wireless Keyboard', code: 'KEY-001', type: 'Keyboard', quantity: 20, reserved: 4, available: 16, location: 'Accessories, Shelf E' },
  { id: 22, name: 'Mechanical Keyboard', code: 'KEY-002', type: 'Keyboard', quantity: 8, reserved: 1, available: 7, location: 'Accessories, Shelf F' },
  { id: 23, name: '1TB External SSD', code: 'STO-001', type: 'Storage', quantity: 30, reserved: 6, available: 24, location: 'Storage Room, Shelf A' },
  { id: 24, name: 'External Hard Drive 2TB', code: 'HD-001', type: 'Storage', quantity: 20, reserved: 3, available: 17, location: 'Storage Room, Shelf B' },
  { id: 25, name: 'Laptop Docking Station', code: 'DOC-001', type: 'Accessories', quantity: 12, reserved: 2, available: 10, location: 'ICT Store, Aisle 3' },
  { id: 26, name: 'Webcam 4K', code: 'CAM-001', type: 'Electronics', quantity: 15, reserved: 3, available: 12, location: 'ICT Store, Aisle 4' },
  { id: 27, name: 'Coffee Beans (2lb)', code: 'COF-001', type: 'Coffee', quantity: 20, reserved: 5, available: 15, location: 'Kitchen, Coffee Station' },
  { id: 28, name: 'Notebooks (Pack of 5)', code: 'STA-001', type: 'Stationery', quantity: 50, reserved: 8, available: 42, location: 'Stationery, Drawer 5' },
  { id: 29, name: 'Sticky Notes (Pack)', code: 'STA-002', type: 'Stationery', quantity: 80, reserved: 12, available: 68, location: 'Stationery, Drawer 6' },
  { id: 30, name: 'Noise Cancelling Headphones', code: 'AUD-001', type: 'Audio', quantity: 10, reserved: 2, available: 8, location: 'ICT Store, Aisle 5' }
];

// Mock Assets - Complete with all types
export const mockAssets: Asset[] = [
  // ========== JOHN SMITH'S ASSETS (For MyAssets page - assigned_to: 'John Smith') ==========
  { id: 1, asset_tag: 'AST-2024-001', name: 'Dell XPS Laptop', type: 'Laptop', category: 'Laptop', serial_number: 'SN123001', assigned_to: 'John Smith', department: 'ICT', assigned_date: '2024-01-10', status: 'Assigned', purchase_cost: 1500 },
  { id: 2, asset_tag: 'AST-2024-002', name: 'Dell 27" Monitor', type: 'Screen/Monitor', category: 'Monitor', serial_number: 'SN123002', assigned_to: 'John Smith', department: 'ICT', assigned_date: '2024-01-10', status: 'Assigned', purchase_cost: 350 },
  { id: 3, asset_tag: 'AST-2024-003', name: 'Lenovo ThinkPad', type: 'Laptop', category: 'Laptop', serial_number: 'SN123003', assigned_to: 'John Smith', department: 'ICT', assigned_date: '2024-01-12', status: 'Under Repair', purchase_cost: 1200 },
  { id: 4, asset_tag: 'AST-2024-004', name: 'Wireless Mouse', type: 'Mouse', category: 'Mouse', serial_number: 'SN123004', assigned_to: 'John Smith', department: 'ICT', assigned_date: '2024-01-15', status: 'Assigned', purchase_cost: 25 },
  { id: 5, asset_tag: 'AST-2024-005', name: 'HP EliteBook', type: 'Laptop', category: 'Laptop', serial_number: 'SN123005', assigned_to: 'John Smith', department: 'ICT', assigned_date: '2024-01-18', status: 'Assigned', purchase_cost: 1350 },
  { id: 6, asset_tag: 'AST-2024-006', name: 'Mechanical Keyboard', type: 'Keyboard', category: 'Keyboard', serial_number: 'SN123006', assigned_to: 'John Smith', department: 'ICT', assigned_date: '2024-01-20', status: 'Assigned', purchase_cost: 120 },
  { id: 7, asset_tag: 'AST-2024-007', name: 'Webcam 4K', type: 'Electronics', category: 'Webcam', serial_number: 'SN123007', assigned_to: 'John Smith', department: 'ICT', assigned_date: '2024-01-22', status: 'Assigned', purchase_cost: 150 },
  
  // ========== OTHER EMPLOYEES' ASSETS ==========
  { id: 8, asset_tag: 'AST-2024-008', name: 'MacBook Pro', type: 'Laptop', category: 'Laptop', serial_number: 'SN123008', assigned_to: 'Sarah Johnson', department: 'Finance', assigned_date: '2024-01-08', status: 'Assigned', purchase_cost: 2300 },
  { id: 9, asset_tag: 'AST-2024-009', name: 'Ultrawide Monitor', type: 'Screen/Monitor', category: 'Monitor', serial_number: 'SN123009', assigned_to: 'Mike Wilson', department: 'ICT', assigned_date: '2024-01-12', status: 'Assigned', purchase_cost: 1000 },
  { id: 10, asset_tag: 'AST-2024-010', name: 'Designer Mouse', type: 'Mouse', category: 'Mouse', serial_number: 'SN123010', assigned_to: 'David Chen', department: 'Marketing', assigned_date: '2024-01-16', status: 'Assigned', purchase_cost: 60 },
  { id: 11, asset_tag: 'AST-2024-011', name: 'Laptop Docking Station', type: 'Accessories', category: 'Docking Station', serial_number: 'SN123011', assigned_to: 'Lisa Wong', department: 'ICT', assigned_date: '2024-01-20', status: 'Assigned', purchase_cost: 200 },
  { id: 12, asset_tag: 'AST-2024-012', name: 'Graphics Monitor 32"', type: 'Screen/Monitor', category: 'Monitor', serial_number: 'SN123012', assigned_to: 'Robert Chen', department: 'ICT', assigned_date: '2024-01-18', status: 'Assigned', purchase_cost: 800 },
  
  // ========== AVAILABLE ASSETS ==========
  { id: 13, asset_tag: 'AST-2024-013', name: 'Dell XPS Laptop', type: 'Laptop', category: 'Laptop', serial_number: 'SN123013', assigned_to: null, department: null, assigned_date: '2024-01-25', status: 'Available', purchase_cost: 1500 },
  { id: 14, asset_tag: 'AST-2024-014', name: 'Lenovo ThinkPad', type: 'Laptop', category: 'Laptop', serial_number: 'SN123014', assigned_to: null, department: null, assigned_date: '2024-01-25', status: 'Available', purchase_cost: 1200 },
  { id: 15, asset_tag: 'AST-2024-015', name: 'Dell 27" Monitor', type: 'Screen/Monitor', category: 'Monitor', serial_number: 'SN123015', assigned_to: null, department: null, assigned_date: '2024-01-25', status: 'Available', purchase_cost: 350 },
  { id: 16, asset_tag: 'AST-2024-016', name: 'Wireless Mouse', type: 'Mouse', category: 'Mouse', serial_number: 'SN123016', assigned_to: null, department: null, assigned_date: '2024-01-25', status: 'Available', purchase_cost: 25 },
  { id: 17, asset_tag: 'AST-2024-017', name: 'Wireless Keyboard', type: 'Keyboard', category: 'Keyboard', serial_number: 'SN123017', assigned_to: null, department: null, assigned_date: '2024-01-25', status: 'Available', purchase_cost: 45 },
  { id: 18, asset_tag: 'AST-2024-018', name: 'Pilot Pen Pack', type: 'Pen', category: 'Pen', serial_number: 'SN123018', assigned_to: null, department: null, assigned_date: '2024-01-25', status: 'Available', purchase_cost: 3 },
  { id: 19, asset_tag: 'AST-2024-019', name: 'Sugar Packets (50ct)', type: 'Sugar', category: 'Sugar', serial_number: 'SN123019', assigned_to: null, department: null, assigned_date: '2024-01-25', status: 'Available', purchase_cost: 5 },
  { id: 20, asset_tag: 'AST-2024-020', name: 'Coffee Beans (2lb)', type: 'Coffee', category: 'Coffee', serial_number: 'SN123020', assigned_to: null, department: null, assigned_date: '2024-01-25', status: 'Available', purchase_cost: 50 },
  
  // ========== UNDER REPAIR ASSETS ==========
  { id: 21, asset_tag: 'AST-2024-021', name: 'MacBook Pro', type: 'Laptop', category: 'Laptop', serial_number: 'SN123021', assigned_to: 'John Smith', department: 'ICT', assigned_date: '2024-01-10', status: 'Under Repair', purchase_cost: 2300 },
  { id: 22, asset_tag: 'AST-2024-022', name: 'Dell 27" Monitor', type: 'Screen/Monitor', category: 'Monitor', serial_number: 'SN123022', assigned_to: 'Mike Wilson', department: 'ICT', assigned_date: '2024-01-12', status: 'Under Repair', purchase_cost: 350 },
  
  // ========== RETIRED ASSETS ==========
  { id: 23, asset_tag: 'AST-2023-001', name: 'Old Dell Laptop', type: 'Laptop', category: 'Laptop', serial_number: 'SN123023', assigned_to: null, department: null, assigned_date: '2023-12-01', status: 'Retired', purchase_cost: 800 },
  { id: 24, asset_tag: 'AST-2023-002', name: 'Old Monitor', type: 'Screen/Monitor', category: 'Monitor', serial_number: 'SN123024', assigned_to: null, department: null, assigned_date: '2023-12-01', status: 'Retired', purchase_cost: 200 }
];

// Dashboard Stats
export const getDashboardStats = (): DashboardStats => {
  return {
    totalRequisitions: mockRequisitions.length,
    pendingApproval: mockRequisitions.filter(r => r.status === 'PENDING').length,
    approvedRequisitions: mockRequisitions.filter(r => r.status === 'APPROVED').length,
    completedRequisitions: mockRequisitions.filter(r => r.status === 'COMPLETED').length,
    totalAssets: mockAssets.filter(a => a.status === 'Assigned').length,
    lowStockItems: mockInventory.filter(i => i.available <= 5).length
  };
};

// Department-specific functions
export const getRequisitionsByDepartment = (department: Department): Requisition[] => {
  return mockRequisitions.filter(r => r.department === department);
};

export const getAssetsByDepartment = (department: Department): Asset[] => {
  return mockAssets.filter(a => a.department === department);
};

export const getAssetsByEmployee = (employeeName: string): Asset[] => {
  return mockAssets.filter(a => a.assigned_to === employeeName);
};

export const getInventoryByType = (type: string): InventoryItem[] => {
  return mockInventory.filter(i => i.type === type);
};

// API Functions
export const fetchRequisitions = (): Promise<Requisition[]> => {
  return Promise.resolve([...mockRequisitions]);
};

export const fetchRequisitionById = (id: number): Promise<Requisition | undefined> => {
  return Promise.resolve(mockRequisitions.find(r => r.id === id));
};

export const createRequisition = (data: any): Promise<Requisition> => {
  const newRequisition: Requisition = {
    id: mockRequisitions.length + 1,
    req_number: `REQ-2024-${String(mockRequisitions.length + 1).padStart(3, '0')}`,
    requester_id: 1,
    requester_name: 'Current User',
    department: data.department || 'ICT',
    status: 'PENDING',
    total_cost: data.items.reduce((sum: number, item: any) => sum + (item.unit_cost * item.quantity), 0),
    justification: data.justification,
    created_at: new Date().toISOString(),
    items: data.items.map((item: any, idx: number) => ({
      id: idx + 1,
      item_name: item.name,
      item_type: item.type,
      quantity: item.quantity,
      unit_cost: item.unit_cost,
      total: item.unit_cost * item.quantity
    }))
  };
  mockRequisitions.unshift(newRequisition);
  return Promise.resolve(newRequisition);
};

export const approveRequisition = (id: number): Promise<Requisition> => {
  const req = mockRequisitions.find(r => r.id === id);
  if (req) {
    req.status = 'APPROVED';
    req.approved_at = new Date().toISOString();
  }
  return Promise.resolve(req!);
};

export const rejectRequisition = (id: number): Promise<Requisition> => {
  const req = mockRequisitions.find(r => r.id === id);
  if (req) {
    req.status = 'REJECTED';
    req.approved_at = new Date().toISOString();
  }
  return Promise.resolve(req!);
};

export const fetchCatalog = (): Promise<CatalogItem[]> => {
  return Promise.resolve([...mockCatalog]);
};

export const fetchInventory = (): Promise<InventoryItem[]> => {
  return Promise.resolve([...mockInventory]);
};

// Update the fetchMyAssets function in mockData.ts
export const fetchMyAssets = (userId?: number): Promise<Asset[]> => {
  // Get the current user from localStorage
  const storedUser = localStorage.getItem('user');
  let currentUserName = 'John Smith'; // Default
  
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      currentUserName = user.full_name || user.name || 'John Smith';
    } catch (e) {
      console.error('Failed to parse user', e);
    }
  }
  
  // Return assets assigned to the current user
  return Promise.resolve(mockAssets.filter(a => a.assigned_to === currentUserName && a.status === 'Assigned'));
};

export const fetchAllAssets = (): Promise<Asset[]> => {
  return Promise.resolve([...mockAssets]);
};

export const updateInventory = (id: number, quantity: number): Promise<InventoryItem> => {
  const item = mockInventory.find(i => i.id === id);
  if (item) {
    item.quantity = quantity;
    item.available = quantity - item.reserved;
  }
  return Promise.resolve(item!);
};

// Additional utility functions
export const getAssetStats = () => {
  return {
    total: mockAssets.length,
    assigned: mockAssets.filter(a => a.status === 'Assigned').length,
    available: mockAssets.filter(a => a.status === 'Available').length,
    underRepair: mockAssets.filter(a => a.status === 'Under Repair').length,
    retired: mockAssets.filter(a => a.status === 'Retired').length,
    totalValue: mockAssets.reduce((sum, a) => sum + (a.purchase_cost || 0), 0),
    departmentsWithAssets: new Set(mockAssets.map(a => a.department).filter(Boolean)).size
  };
};

export const getTopRequestedItems = (limit: number = 5) => {
  const itemCount: Record<string, number> = {};
  mockRequisitions.forEach(req => {
    req.items?.forEach(item => {
      itemCount[item.item_name] = (itemCount[item.item_name] || 0) + item.quantity;
    });
  });
  return Object.entries(itemCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
};

// Asset assignment functions
export const updateAssetAssignment = (assetId: number, assignmentData: any): Promise<Asset> => {
  const asset = mockAssets.find(a => a.id === assetId);
  if (asset) {
    asset.assigned_to = assignmentData.assigned_to;
    asset.department = assignmentData.department;
    asset.status = assignmentData.status;
    asset.assigned_date = new Date().toISOString();
  }
  return Promise.resolve(asset!);
};

export const getAvailableAssetsByType = (type: string): Promise<Asset[]> => {
  const availableAssets = mockAssets.filter(asset => 
    asset.status === 'Available' && 
    asset.type?.toLowerCase() === type.toLowerCase()
  );
  return Promise.resolve(availableAssets);
};

export const getAssignedAssetsForRequisition = (requisitionId: number): Promise<Asset[]> => {
  return Promise.resolve(mockAssets.filter(asset => 
    (asset as any).requisition_id === requisitionId
  ));
};