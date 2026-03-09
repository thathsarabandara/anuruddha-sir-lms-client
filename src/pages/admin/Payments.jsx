import { useState, useEffect, useCallback } from 'react';
import {
  FaCheck,
  FaTimes,
  FaTimesCircle,
  FaEye,
  FaDownload,
  FaImage,
  FaSpinner,
  FaChartBar,
  FaExclamationTriangle,
  FaCalendarAlt,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { adminPaymentsAPI } from '../../api';
import PulseLoader from '../../components/common/PulseLoader';

// eslint-disable-next-line no-unused-vars
const StatsCard = ({ label, value, icon: Icon, color, subtext }) => (
  <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderLeftColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
      </div>
      <div className="text-4xl" style={{ color }}>
        <Icon />
      </div>
    </div>
  </div>
);

// ==================== PAYMENT DETAILS MODAL ====================
const PaymentDetailsModal = ({ payment, onClose, onAction, actionLoading }) => {
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  const handleApprove = () => {
    if (onAction) {
      onAction('approve', payment.id, notes);
    }
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    if (onAction) {
      onAction('reject', payment.id, rejectionReason);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Payment Details</h2>
            <p className="text-primary-100 text-sm">{payment.payment_number}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-primary-800 rounded-full p-2 transition"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex space-x-8">
            {['details', 'bank', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-medium text-sm border-b-2 transition ${
                  activeTab === tab
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Status Alert */}
              <div
                className={`p-4 rounded-lg border-l-4 ${
                  payment.status === 'completed'
                    ? 'bg-green-50 border-green-500'
                    : payment.status === 'rejected'
                    ? 'bg-red-50 border-red-500'
                    : 'bg-yellow-50 border-yellow-500'
                }`}
              >
                <p
                  className={`font-medium ${
                    payment.status === 'completed'
                      ? 'text-green-900'
                      : payment.status === 'rejected'
                      ? 'text-red-900'
                      : 'text-yellow-900'
                  }`}
                >
                  Status: <span className="capitalize">{payment.status.replace('_', ' ')}</span>
                </p>
              </div>

              {/* Student Information */}
              <div className="grid grid-cols-2 gap-6 pb-6 border-b">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Student Name</label>
                  <p className="text-lg font-semibold text-gray-900">{payment.student?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Email</label>
                  <p className="text-sm text-gray-900">{payment.student?.email}</p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pb-6 border-b">
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-2">Amount</label>
                  <p className="text-2xl font-bold text-gray-900">Rs. {payment.amount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-2">Discount</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {payment.discount_amount > 0 ? `-Rs. ${payment.discount_amount.toLocaleString()}` : 'None'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-2">Method</label>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {payment.payment_method.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-2">Created</label>
                  <p className="text-sm text-gray-900">
                    {new Date(payment.created_at).toLocaleString()}
                  </p>
                </div>
                {payment.completed_at && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-2">Completed</label>
                    <p className="text-sm text-gray-900">
                      {new Date(payment.completed_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bank Details Tab */}
          {activeTab === 'bank' && payment.payment_method === 'bank' && (
            <div className="space-y-6">
              {payment.bank_details ? (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Bank Transfer Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-2">Bank Name</label>
                        <p className="text-sm font-medium text-gray-900">{payment.bank_details.bank_name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-2">Branch</label>
                        <p className="text-sm font-medium text-gray-900">{payment.bank_details.branch || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-2">Account Holder</label>
                        <p className="text-sm font-medium text-gray-900">{payment.bank_details.account_holder || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-2">Transfer Date</label>
                        <p className="text-sm font-medium text-gray-900">
                          {payment.bank_details.transfer_date
                            ? new Date(payment.bank_details.transfer_date).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bank Slip */}
                  {payment.bank_details.bank_slip_url && (
                    <div>
                      <label className="text-sm font-medium text-gray-900 block mb-3">Bank Slip</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                        <FaImage className="text-4xl text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-3">Bank slip uploaded</p>
                        <a
                          href={payment.bank_details.bank_slip_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                        >
                          <FaDownload /> View Full Image
                        </a>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-600">No bank details available</p>
                </div>
              )}
            </div>
          )}

          {/* PayHere Details */}
          {activeTab === 'bank' && payment.payment_method === 'payhere' && (
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-4">PayHere Transaction</h3>
              {payment.payhere_details ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600">Transaction ID</label>
                    <p className="text-sm font-mono text-gray-900 mt-1">{payment.payhere_details.transaction_id}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-green-700 text-sm">
                    <FaCheck /> Automatically verified by PayHere
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No PayHere details available</p>
              )}
            </div>
          )}

          {/* History/Actions Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {payment.verification?.verified_by && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Verified by:</strong> {payment.verification.verified_by}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Verification Date:</strong> {new Date(payment.verification.verification_date).toLocaleString()}
                  </p>
                </div>
              )}

              {payment.verification?.rejection_reason && (
                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                  <p className="text-sm font-medium text-red-900 mb-2">Rejection Reason:</p>
                  <p className="text-sm text-red-700">{payment.verification.rejection_reason}</p>
                </div>
              )}

              {!payment.verification?.verified_by && payment.status !== 'completed' && (
                <p className="text-gray-600 text-sm">This payment hasn't been verified yet.</p>
              )}
            </div>
          )}

          {/* Action Section for Pending Payments */}
          {payment.status !== 'completed' && payment.status !== 'rejected' && (
            <div className="space-y-4 pt-6 border-t">
              {payment.status === 'pending' || payment.status === 'bank_transfer_pending' ? (
                <>
                  {payment.payment_method === 'bank' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Verification Notes</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows="3"
                        placeholder="Add any notes about this payment verification..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleApprove}
                      disabled={actionLoading}
                      className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg py-3 font-medium transition"
                    >
                      {actionLoading ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <>
                          <FaCheck /> Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Enter rejection reason:');
                        if (reason) {
                          setRejectionReason(reason);
                          handleReject();
                        }
                      }}
                      disabled={actionLoading}
                      className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg py-3 font-medium transition"
                    >
                      {actionLoading ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <>
                          <FaTimes /> Reject
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const AdminPayments = () => {
  // State Management
  const [activeView, setActiveView] = useState('overview'); // overview, payments, bankslips, analytics
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [bankSlips, setBankSlips] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [analyticsRange, setAnalyticsRange] = useState('30');

  // Modal & Loading State
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, per_page: 10 });

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await adminPaymentsAPI.getStats();
      if (response.data?.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load payment statistics');
    }
  }, []);

  // Fetch Payments
  const fetchPayments = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const params = {
          page,
          per_page: pagination.per_page,
        };
        if (filterStatus !== 'all') params.status = filterStatus;
        if (filterMethod !== 'all') params.method = filterMethod;
        if (searchTerm) params.search = searchTerm;

        const response = await adminPaymentsAPI.getAll(params);
        if (response.data?.success) {
          setPayments(response.data.payments);
          setPagination({
            page: response.data.page,
            per_page: response.data.per_page,
            total: response.data.total,
            total_pages: response.data.total_pages,
          });
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
        toast.error('Failed to load payments');
      } finally {
        setLoading(false);
      }
    },
    [filterStatus, filterMethod, searchTerm, pagination.per_page]
  );

  // Fetch Bank Slips
  const fetchBankSlips = useCallback(async () => {
    try {
      const response = await adminPaymentsAPI.getBankSlips({ page: 1, per_page: 20 });
      if (response.data?.success) {
        setBankSlips(response.data.bank_slips);
      }
    } catch (error) {
      console.error('Error fetching bank slips:', error);
      toast.error('Failed to load bank slips');
    }
  }, []);

  // Fetch Analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await adminPaymentsAPI.getAnalytics(parseInt(analyticsRange));
      if (response.data?.success) {
        setAnalytics(response.data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    }
  }, [analyticsRange]);

  // Initial Load
  useEffect(() => {
    fetchStats();
    fetchPayments(1);
    fetchBankSlips();
    fetchAnalytics();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    fetchPayments(1);
  }, [filterStatus, filterMethod]);

  // Handle Payment Action
  const handlePaymentAction = async (action, paymentId, data) => {
    try {
      setActionLoading(true);
      let response;

      if (action === 'approve') {
        response = await adminPaymentsAPI.approve(paymentId, data);
      } else if (action === 'reject') {
        response = await adminPaymentsAPI.reject(paymentId, data);
      }

      if (response.data?.success) {
        toast.success(
          action === 'approve'
            ? 'Payment approved successfully!'
            : 'Payment rejected successfully!'
        );
        setShowDetailsModal(false);
        fetchStats();
        fetchPayments(pagination.page);
        fetchBankSlips();
      } else {
        toast.error(response.data?.message || 'Action failed');
      }
    } catch (error) {
      console.error('Error performing action:', error);
      toast.error('Failed to perform action');
    } finally {
      setActionLoading(false);
    }
  };

  // View Payment Details
  const handleViewDetails = async (paymentId) => {
    try {
      const response = await adminPaymentsAPI.getById(paymentId);
      if (response.data?.success) {
        setSelectedPayment(response.data.payment);
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
      toast.error('Failed to load payment details');
    }
  };

  // Status Badge Color
  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      bank_transfer_pending: 'bg-orange-100 text-orange-800',
      rejected: 'bg-red-100 text-red-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Method Badge
  const getMethodBadge = (method) => {
    const badges = {
      payhere: { label: 'PayHere', bg: 'bg-purple-100', text: 'text-purple-800' },
      bank: { label: 'Bank Transfer', bg: 'bg-blue-100', text: 'text-blue-800' },
      cash: { label: 'Cash', bg: 'bg-green-100', text: 'text-green-800' },
    };
    const badge = badges[method] || badges.cash;
    return `${badge.bg} ${badge.text}`;
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <PulseLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8">
        <h1 className="text-4xl font-bold mb-2">Payment Management</h1>
        <p className="text-primary-100">Monitor and manage all payment transactions</p>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200 pb-0">
          {['overview', 'payments', 'bankslips', 'analytics'].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition ${
                activeView === view
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>

        {/* OVERVIEW VIEW */}
        {activeView === 'overview' && stats && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                label="Total Revenue"
                value={`Rs. ${(stats.total_revenue / 1000).toFixed(1)}K`}
                icon={FaChartBar}
                color="#3b82f6"
                subtext="All time"
              />
              <StatsCard
                label="Completed Payments"
                value={stats.completed_count}
                icon={FaCheck}
                color="#10b981"
                subtext={`Rs. ${(stats.completed_revenue / 1000).toFixed(1)}K`}
              />
              <StatsCard
                label="Pending Review"
                value={stats.pending_count + stats.bank_transfer_pending}
                icon={FaExclamationTriangle}
                color="#f59e0b"
                subtext="Need verification"
              />
              <StatsCard
                label="This Month"
                value={`Rs. ${(stats.this_month / 1000).toFixed(1)}K`}
                icon={FaCalendarAlt}
                color="#8b5cf6"
              />
            </div>

            {/* Payment Method Breakdown */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Methods</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">PayHere</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">{stats.payhere_count}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Bank Transfer</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">{stats.bank_count}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Cash</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">{stats.cash_count}</p>
                </div>
              </div>
            </div>

            {/* Recent Payments */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Recent Payments</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats.recent_payments && stats.recent_payments.slice(0, 5).map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{payment.payment_number}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{payment.student_name}</p>
                            <p className="text-xs text-gray-500">{payment.student_email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          Rs. {payment.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                            {payment.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PAYMENTS VIEW */}
        {activeView === 'payments' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <input
                  type="text"
                  placeholder="Search by payment ID, student email, or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="bank_transfer_pending">Bank Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  value={filterMethod}
                  onChange={(e) => setFilterMethod(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Methods</option>
                  <option value="payhere">PayHere</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
            </div>

            {/* Payments Table */}
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <PulseLoader />
              </div>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Method</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {payments.map((payment) => (
                          <tr key={payment.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{payment.payment_number}</td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{payment.student_name}</p>
                                <p className="text-xs text-gray-500">{payment.student_email}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                              Rs. {payment.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getMethodBadge(payment.payment_method)}`}>
                                {payment.payment_method.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                                {payment.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date(payment.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleViewDetails(payment.id)}
                                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium transition"
                              >
                                <FaEye /> View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                {pagination.total_pages > 1 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Showing {pagination.page} of {pagination.total_pages} pages
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => fetchPayments(Math.max(1, pagination.page - 1))}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => fetchPayments(Math.min(pagination.total_pages, pagination.page + 1))}
                        disabled={pagination.page === pagination.total_pages}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* BANK SLIPS VIEW */}
        {activeView === 'bankslips' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">
                  Pending Bank Slip Submissions ({bankSlips.length})
                </h3>
              </div>
              {bankSlips.length === 0 ? (
                <div className="p-12 text-center">
                  <FaCheck className="text-4xl text-green-500 mx-auto mb-3" />
                  <p className="text-gray-600">No pending bank slips for verification</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Bank</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Pending</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bankSlips.map((slip) => (
                        <tr key={slip.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{slip.payment_number}</td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{slip.student_name}</p>
                              <p className="text-xs text-gray-500">{slip.student_email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            Rs. {slip.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{slip.bank_name}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              slip.days_pending > 7 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {slip.days_pending} days
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleViewDetails(slip.id)}
                              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium transition"
                            >
                              <FaEye /> Verify
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ANALYTICS VIEW */}
        {activeView === 'analytics' && analytics && (
          <div className="space-y-8">
            {/* Date Range Selector */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Analytics Period</label>
              <select
                value={analyticsRange}
                onChange={(e) => {
                  setAnalyticsRange(e.target.value);
                  fetchAnalytics();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last 365 days</option>
              </select>
            </div>

            {/* Method Breakdown */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Method Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analytics.method_breakdown?.map((method, idx) => (
                  <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">{method.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{method.count}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Rs. {(method.amount / 1000).toFixed(1)}K
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Status Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analytics.status_breakdown?.slice(0, 4).map((status, idx) => (
                  <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600 capitalize mb-2">{status.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{status.count}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Students */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Top Paying Students</h3>
              <div className="space-y-3">
                {analytics.top_students?.slice(0, 10).map((student, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    <div>
                      <p className="font-medium text-gray-900">{idx + 1}. {student.student_name}</p>
                      <p className="text-xs text-gray-500">{student.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">Rs. {student.total_spent.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{student.transaction_count} transactions</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => setShowDetailsModal(false)}
          onAction={handlePaymentAction}
          actionLoading={actionLoading}
        />
      )}
    </div>
  );
};

export default AdminPayments;
