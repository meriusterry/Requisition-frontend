import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { fetchRequisitionById, approveRequisition, rejectRequisition } from '../../services/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiArrowLeft, 
  FiCheckCircle, 
  FiXCircle, 
  FiDownload, 
  FiPrinter, 
  FiPackage, 
  FiEdit,
  FiUser,
  FiCalendar,
  FiHash,
  FiClipboard,
  FiHome,
  FiGrid
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const RequisitionDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const [requisition, setRequisition] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  useEffect(() => {
    if (id) {
      loadRequisition();
    }
  }, [id]);

  const loadRequisition = async () => {
    try {
      const data = await fetchRequisitionById(parseInt(id!));
      setRequisition(data);
    } catch (error) {
      toast.error('Failed to load requisition');
      navigate('/requisitions');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm('Are you sure you want to approve this requisition?')) return;
    
    setApproving(true);
    try {
      await approveRequisition(parseInt(id!));
      toast.success('Requisition approved successfully!');
      loadRequisition();
    } catch (error) {
      toast.error('Failed to approve requisition');
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!confirm('Are you sure you want to reject this requisition?')) return;
    
    setRejecting(true);
    try {
      await rejectRequisition(parseInt(id!));
      toast.success('Requisition rejected');
      loadRequisition();
    } catch (error) {
      toast.error('Failed to reject requisition');
    } finally {
      setRejecting(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      DRAFT: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
      PENDING: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
      APPROVED: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
      COMPLETED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      REJECTED: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
    };
    return colors[status] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: 'bg-gray-100 text-gray-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      APPROVED: 'bg-green-100 text-green-700',
      COMPLETED: 'bg-blue-100 text-blue-700',
      REJECTED: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
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

  if (!requisition) return null;

  const canApprove = hasPermission('requisitions', 'approve') && requisition.status === 'PENDING';
  const canAssign = requisition.status === 'APPROVED';

  const totalItems = requisition.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
  const assignedItems = requisition.items?.reduce((sum: number, item: any) => {
    return sum + (item.assigned_assets?.length || 0);
  }, 0) || 0;
  const statusStyle = getStatusColor(requisition.status);

  return (
    <Layout>
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/requisitions')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Requisition {requisition.req_number}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Created on {new Date(requisition.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <FiPrinter className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <FiDownload className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`rounded-xl border ${statusStyle.bg} ${statusStyle.border} p-6`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(requisition.status)}`}>
                  {requisition.status}
                </span>
                {requisition.department && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    <FiHome className="h-3 w-3 mr-1" />
                    {requisition.department}
                  </span>
                )}
                {assignedItems > 0 && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <FiPackage className="h-3 w-3 mr-1" />
                    {assignedItems}/{totalItems} Assigned
                  </span>
                )}
              </div>
              <p className="text-gray-700">{requisition.justification}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {canApprove && (
                <>
                  <button
                    onClick={handleReject}
                    disabled={rejecting}
                    className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 flex items-center space-x-2 shadow-sm"
                  >
                    <FiXCircle className="h-4 w-4" />
                    <span>{rejecting ? 'Rejecting...' : 'Reject'}</span>
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={approving}
                    className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 flex items-center space-x-2 shadow-sm"
                  >
                    <FiCheckCircle className="h-4 w-4" />
                    <span>{approving ? 'Approving...' : 'Approve'}</span>
                  </button>
                </>
              )}
              {canAssign && (
                <Link
                  to={`/requisitions/${requisition.id}/assign`}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2 shadow-sm"
                >
                  <FiPackage className="h-4 w-4" />
                  <span>Assign Assets</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Details Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b bg-gray-50">
                <h2 className="text-base font-semibold text-gray-800">Request Details</h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-start space-x-3">
                  <FiUser className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Requester</p>
                    <p className="text-sm font-medium text-gray-900">{requisition.requester_name}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FiHome className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Department</p>
                    <p className="text-sm font-medium text-gray-900">{requisition.department || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FiCalendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Created Date</p>
                    <p className="text-sm font-medium text-gray-900">{new Date(requisition.created_at).toLocaleString()}</p>
                  </div>
                </div>
                
                {requisition.approved_at && (
                  <div className="flex items-start space-x-3">
                    <FiCheckCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Approved Date</p>
                      <p className="text-sm font-medium text-gray-900">{new Date(requisition.approved_at).toLocaleString()}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start space-x-3">
                  <FiHash className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Total Items Requested</p>
                    <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FiPackage className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Items Assigned</p>
                    <p className="text-2xl font-bold text-green-600">{assignedItems}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b bg-gray-50">
                <h2 className="text-base font-semibold text-gray-800">Items Requested</h2>
              </div>
              
              {(!requisition.items || requisition.items.length === 0) ? (
                <div className="text-center py-12">
                  <FiClipboard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No items in this requisition</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specifications</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {requisition.items?.map((item: any, idx: number) => {
                        const assignedCount = item.assigned_assets?.length || 0;
                        const isFullyAssigned = assignedCount >= item.quantity;
                        return (
                          <tr key={idx} className="hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-3">
                              <div className="flex items-center space-x-2">
                                <FiGrid className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900">{item.item_name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                {item.item_type || item.type || 'N/A'}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-center text-sm text-gray-600">{item.quantity}</td>
                            <td className="px-5 py-3 text-center">
                              <span className={`text-sm font-semibold ${isFullyAssigned ? 'text-green-600' : assignedCount > 0 ? 'text-yellow-600' : 'text-gray-500'}`}>
                                {assignedCount}/{item.quantity}
                              </span>
                            </td>
                            <td className="px-5 py-3">
                              <p className="text-sm text-gray-500 max-w-md">
                                {item.specifications || '—'}
                              </p>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RequisitionDetail;