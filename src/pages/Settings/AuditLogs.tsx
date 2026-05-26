import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface AuditEntry {
  id: number;
  userId: number;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    // Mock audit logs
    const mockLogs: AuditEntry[] = [
      { id: 1, userId: 1, userName: 'John Smith', action: 'Login', details: 'User logged in successfully', timestamp: '2024-01-20 09:15:23', ipAddress: '192.168.1.1' },
      { id: 2, userId: 1, userName: 'John Smith', action: 'Create Requisition', details: 'Created requisition REQ-2024-001', timestamp: '2024-01-20 10:30:45', ipAddress: '192.168.1.1' },
      { id: 3, userId: 2, userName: 'Sarah Johnson', action: 'Approve Requisition', details: 'Approved requisition REQ-2024-001', timestamp: '2024-01-20 11:20:12', ipAddress: '192.168.1.2' },
      { id: 4, userId: 3, userName: 'Mike Wilson', action: 'Update Profile', details: 'Updated user profile information', timestamp: '2024-01-19 14:45:33', ipAddress: '192.168.1.3' },
      { id: 5, userId: 1, userName: 'John Smith', action: 'Delete Asset', details: 'Deleted asset AST-2024-005', timestamp: '2024-01-19 16:10:22', ipAddress: '192.168.1.1' },
      { id: 6, userId: 4, userName: 'Emily Brown', action: 'Inventory Update', details: 'Updated stock for Dell Laptops', timestamp: '2024-01-18 13:25:11', ipAddress: '192.168.1.4' },
      { id: 7, userId: 2, userName: 'Sarah Johnson', action: 'Reject Requisition', details: 'Rejected requisition REQ-2024-002', timestamp: '2024-01-18 15:40:55', ipAddress: '192.168.1.2' },
      { id: 8, userId: 1, userName: 'John Smith', action: 'Role Change', details: 'Changed user role from Employee to Manager', timestamp: '2024-01-17 11:05:44', ipAddress: '192.168.1.1' },
    ];
    setLogs(mockLogs);
    setLoading(false);
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      Login: 'bg-green-100 text-green-700',
      'Create Requisition': 'bg-blue-100 text-blue-700',
      'Approve Requisition': 'bg-green-100 text-green-700',
      'Reject Requisition': 'bg-red-100 text-red-700',
      'Update Profile': 'bg-yellow-100 text-yellow-700',
      'Delete Asset': 'bg-red-100 text-red-700',
      'Inventory Update': 'bg-purple-100 text-purple-700',
      'Role Change': 'bg-orange-100 text-orange-700',
    };
    return colors[action] || 'bg-gray-100 text-gray-700';
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = !filterAction || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  const uniqueActions = [...new Set(logs.map(log => log.action))];

  const handleExport = () => {
    // Export to CSV
    const csv = [
      ['User', 'Action', 'Details', 'Timestamp', 'IP Address'],
      ...filteredLogs.map(log => [log.userName, log.action, log.details, log.timestamp, log.ipAddress])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Export started');
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Audit Logs</h2>
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <FiDownload className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Actions</option>
            {uniqueActions.map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.userName}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{log.details}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{log.timestamp}</td>
                <td className="px-6 py-4 text-sm text-gray-600 font-mono">{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No audit logs found
        </div>
      )}
    </div>
  );
};

export default AuditLogs;