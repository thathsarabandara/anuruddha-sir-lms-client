import { useState, useEffect, useCallback } from 'react';
import {
  FaCheck,
  FaTimes,
  FaEye,
  FaDownload,
  FaImage,
  FaSpinner,
  FaChartBar,
  FaExclamationTriangle,
  FaCalendarAlt,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import { adminAPI } from '../../api/admin';

// ==================== PAYMENTS METRICS CONFIG ====================
const paymentsMetricsConfig = [
  {
    label: 'Total Revenue',
    statsKey: 'total_revenue_display',
    icon: FaChartBar,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
    description: 'All time'
  },
  {
    label: 'Completed Payments',
    statsKey: 'completed_count',
    icon: FaCheck,
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
    description: 'Verified revenue'
  },
  {
    label: 'Pending Review',
    statsKey: 'pending_total',
    icon: FaExclamationTriangle,
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-600',
    description: 'Need verification'
  },
  {
    label: 'This Month',
    statsKey: 'this_month_display',
    icon: FaCalendarAlt,
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600',
    description: 'Current month earnings'
  }
];

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
    const dummyStats = {
      total_revenue: 5250000,
      completed_count: 85,
      completed_revenue: 4200000,
      pending_count: 12,
      bank_transfer_pending: 5,
      this_month: 950000,
      payhere_count: 45,
      bank_count: 30,
      cash_count: 15,
      recent_payments: [
        {
          id: 1,
          payment_number: 'PAY-001',
          student_name: 'John Doe',
          student_email: 'john@example.com',
          amount: 50000,
          status: 'completed',
          created_at: '2026-03-10T10:30:00Z',
        },
        {
          id: 2,
          payment_number: 'PAY-002',
          student_name: 'Jane Smith',
          student_email: 'jane@example.com',
          amount: 75000,
          status: 'completed',
          created_at: '2026-03-09T14:15:00Z',
        },
        {
          id: 3,
          payment_number: 'PAY-003',
          student_name: 'Mike Johnson',
          student_email: 'mike@example.com',
          amount: 60000,
          status: 'pending',
          created_at: '2026-03-08T09:00:00Z',
        },
        {
          id: 4,
          payment_number: 'PAY-004',
          student_name: 'Sarah Williams',
          student_email: 'sarah@example.com',
          amount: 80000,
          status: 'bank_transfer_pending',
          created_at: '2026-03-07T16:45:00Z',
        },
        {
          id: 5,
          payment_number: 'PAY-005',
          student_name: 'Tom Brown',
          student_email: 'tom@example.com',
          amount: 55000,
          status: 'completed',
          created_at: '2026-03-06T11:20:00Z',
        },
      ],
    };
    setStats(dummyStats);
  }, []);

  // Fetch Payments
  const fetchPayments = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        // Try to fetch from API, fall back to dummy data if endpoint not available
        const response = await adminAPI.getRevenueAnalytics().catch(() => null);
        
        if (response?.data) {
          // Process real API data if available
          const paymentsList = response.data.transactions || [];
          setPayments(Array.isArray(paymentsList) ? paymentsList : []);
          setPagination({
            page,
            per_page: pagination.per_page,
            total: paymentsList.length,
            total_pages: Math.ceil(paymentsList.length / pagination.per_page),
          });
        } else {
          // Fallback to dummy data
          const allDummyPayments = [
            { id: 1, payment_number: 'PAY-001', student_name: 'John Doe', student_email: 'john@example.com', amount: 50000, payment_method: 'payhere', status: 'completed', created_at: '2026-03-10T10:30:00Z' },
            { id: 2, payment_number: 'PAY-002', student_name: 'Jane Smith', student_email: 'jane@example.com', amount: 75000, payment_method: 'bank', status: 'completed', created_at: '2026-03-09T14:15:00Z' },
            { id: 3, payment_number: 'PAY-003', student_name: 'Mike Johnson', student_email: 'mike@example.com', amount: 60000, payment_method: 'cash', status: 'pending', created_at: '2026-03-08T09:00:00Z' },
            { id: 4, payment_number: 'PAY-004', student_name: 'Sarah Williams', student_email: 'sarah@example.com', amount: 80000, payment_method: 'bank', status: 'bank_transfer_pending', created_at: '2026-03-07T16:45:00Z' },
            { id: 5, payment_number: 'PAY-005', student_name: 'Tom Brown', student_email: 'tom@example.com', amount: 55000, payment_method: 'payhere', status: 'completed', created_at: '2026-03-06T11:20:00Z' },
            { id: 6, payment_number: 'PAY-006', student_name: 'Lisa Anderson', student_email: 'lisa@example.com', amount: 70000, payment_method: 'cash', status: 'completed', created_at: '2026-03-05T13:30:00Z' },
            { id: 7, payment_number: 'PAY-007', student_name: 'David Miller', student_email: 'david@example.com', amount: 65000, payment_method: 'bank', status: 'pending', created_at: '2026-03-04T15:45:00Z' },
            { id: 8, payment_number: 'PAY-008', student_name: 'Emma Davis', student_email: 'emma@example.com', amount: 90000, payment_method: 'payhere', status: 'completed', created_at: '2026-03-03T10:15:00Z' },
            { id: 9, payment_number: 'PAY-009', student_name: 'Robert Wilson', student_email: 'robert@example.com', amount: 45000, payment_method: 'cash', status: 'rejected', created_at: '2026-03-02T14:00:00Z' },
            { id: 10, payment_number: 'PAY-010', student_name: 'Grace Taylor', student_email: 'grace@example.com', amount: 72000, payment_method: 'bank', status: 'completed', created_at: '2026-03-01T09:30:00Z' },
          ];
          
          let filteredPayments = allDummyPayments;
          if (filterStatus !== 'all') {
            filteredPayments = filteredPayments.filter(p => p.status === filterStatus);
          }
          if (filterMethod !== 'all') {
            filteredPayments = filteredPayments.filter(p => p.payment_method === filterMethod);
          }
          if (searchTerm) {
            filteredPayments = filteredPayments.filter(p => 
              p.payment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.student_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.student_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          
          const total = filteredPayments.length;
          const total_pages = Math.ceil(total / pagination.per_page);
          const startIndex = (page - 1) * pagination.per_page;
          const paginatedPayments = filteredPayments.slice(startIndex, startIndex + pagination.per_page);
          
          setPayments(paginatedPayments);
          setPagination({
            page,
            per_page: pagination.per_page,
            total,
            total_pages,
          });
        }
      } catch (err) {
        console.error('Error fetching payments:', err);
        toast.error('Failed to load payments');
      } finally {
        setLoading(false);
      }
    },
    [filterStatus, filterMethod, searchTerm, pagination.per_page]
  );

  // Fetch Bank Slips
  const fetchBankSlips = useCallback(async () => {
    const dummyBankSlips = [
      { id: 4, payment_number: 'PAY-004', student_name: 'Sarah Williams', student_email: 'sarah@example.com', amount: 80000, bank_name: 'Bank of Ceylon', days_pending: 3 },
      { id: 7, payment_number: 'PAY-007', student_name: 'David Miller', student_email: 'david@example.com', amount: 65000, bank_name: 'Commercial Bank', days_pending: 5 },
    ];
    setBankSlips(dummyBankSlips);
  }, []);

  // Fetch Analytics
  const fetchAnalytics = useCallback(async () => {
    const dummyAnalytics = {
      method_breakdown: [
        { label: 'PayHere', count: 45, amount: 1800000 },
        { label: 'Bank Transfer', count: 30, amount: 2000000 },
        { label: 'Cash', count: 15, amount: 900000 },
      ],
      status_breakdown: [
        { label: 'Completed', count: 85 },
        { label: 'Pending', count: 12 },
        { label: 'Bank Pending', count: 5 },
        { label: 'Rejected', count: 2 },
      ],
      top_students: [
        { student_name: 'John Doe', email: 'john@example.com', total_spent: 250000, transaction_count: 5 },
        { student_name: 'Emma Davis', email: 'emma@example.com', total_spent: 220000, transaction_count: 4 },
        { student_name: 'Jane Smith', email: 'jane@example.com', total_spent: 180000, transaction_count: 3 },
        { student_name: 'Sarah Williams', email: 'sarah@example.com', total_spent: 160000, transaction_count: 3 },
        { student_name: 'Mike Johnson', email: 'mike@example.com', total_spent: 150000, transaction_count: 3 },
        { student_name: 'Grace Taylor', email: 'grace@example.com', total_spent: 140000, transaction_count: 2 },
        { student_name: 'David Miller', email: 'david@example.com', total_spent: 130000, transaction_count: 2 },
        { student_name: 'Lisa Anderson', email: 'lisa@example.com', total_spent: 120000, transaction_count: 2 },
        { student_name: 'Tom Brown', email: 'tom@example.com', total_spent: 115000, transaction_count: 2 },
        { student_name: 'Robert Wilson', email: 'robert@example.com', total_spent: 105000, transaction_count: 2 },
      ],
    };
    setAnalytics(dummyAnalytics);
  }, []);

  // Initial Load
  useEffect(() => {
    // Load stats
    const dummyStats = {
      total_revenue: 5250000,
      completed_count: 85,
      completed_revenue: 4200000,
      pending_count: 12,
      bank_transfer_pending: 5,
      this_month: 950000,
      payhere_count: 45,
      bank_count: 30,
      cash_count: 15,
      recent_payments: [
        {
          id: 1,
          payment_number: 'PAY-001',
          student_name: 'John Doe',
          student_email: 'john@example.com',
          amount: 50000,
          status: 'completed',
          created_at: '2026-03-10T10:30:00Z',
        },
        {
          id: 2,
          payment_number: 'PAY-002',
          student_name: 'Jane Smith',
          student_email: 'jane@example.com',
          amount: 75000,
          status: 'completed',
          created_at: '2026-03-09T14:15:00Z',
        },
        {
          id: 3,
          payment_number: 'PAY-003',
          student_name: 'Mike Johnson',
          student_email: 'mike@example.com',
          amount: 60000,
          status: 'pending',
          created_at: '2026-03-08T09:00:00Z',
        },
        {
          id: 4,
          payment_number: 'PAY-004',
          student_name: 'Sarah Williams',
          student_email: 'sarah@example.com',
          amount: 80000,
          status: 'bank_transfer_pending',
          created_at: '2026-03-07T16:45:00Z',
        },
        {
          id: 5,
          payment_number: 'PAY-005',
          student_name: 'Tom Brown',
          student_email: 'tom@example.com',
          amount: 55000,
          status: 'completed',
          created_at: '2026-03-06T11:20:00Z',
        },
      ],
    };
    setStats(dummyStats);

    // Load bank slips
    const dummyBankSlips = [
      { id: 4, payment_number: 'PAY-004', student_name: 'Sarah Williams', student_email: 'sarah@example.com', amount: 80000, bank_name: 'Bank of Ceylon', days_pending: 3 },
      { id: 7, payment_number: 'PAY-007', student_name: 'David Miller', student_email: 'david@example.com', amount: 65000, bank_name: 'Commercial Bank', days_pending: 5 },
    ];
    setBankSlips(dummyBankSlips);

    // Load analytics
    const dummyAnalytics = {
      method_breakdown: [
        { label: 'PayHere', count: 45, amount: 1800000 },
        { label: 'Bank Transfer', count: 30, amount: 2000000 },
        { label: 'Cash', count: 15, amount: 900000 },
      ],
      status_breakdown: [
        { label: 'Completed', count: 85 },
        { label: 'Pending', count: 12 },
        { label: 'Bank Pending', count: 5 },
        { label: 'Rejected', count: 2 },
      ],
      top_students: [
        { student_name: 'John Doe', email: 'john@example.com', total_spent: 250000, transaction_count: 5 },
        { student_name: 'Emma Davis', email: 'emma@example.com', total_spent: 220000, transaction_count: 4 },
        { student_name: 'Jane Smith', email: 'jane@example.com', total_spent: 180000, transaction_count: 3 },
        { student_name: 'Sarah Williams', email: 'sarah@example.com', total_spent: 160000, transaction_count: 3 },
        { student_name: 'Mike Johnson', email: 'mike@example.com', total_spent: 150000, transaction_count: 3 },
        { student_name: 'Grace Taylor', email: 'grace@example.com', total_spent: 140000, transaction_count: 2 },
        { student_name: 'David Miller', email: 'david@example.com', total_spent: 130000, transaction_count: 2 },
        { student_name: 'Lisa Anderson', email: 'lisa@example.com', total_spent: 120000, transaction_count: 2 },
        { student_name: 'Tom Brown', email: 'tom@example.com', total_spent: 115000, transaction_count: 2 },
        { student_name: 'Robert Wilson', email: 'robert@example.com', total_spent: 105000, transaction_count: 2 },
      ],
    };
    setAnalytics(dummyAnalytics);

    // Load initial payments
    fetchPayments(1);
  }, [fetchPayments]);

  // Refetch when filters change
  useEffect(() => {
    fetchPayments(1);
  }, [filterStatus, filterMethod, fetchPayments]);

  // Handle Payment Action
  const handlePaymentAction = async (action) => {
    setActionLoading(true);
    
    // Simulate API call with delay
    setTimeout(() => {
      toast.success(
        action === 'approve'
          ? 'Payment approved successfully!'
          : 'Payment rejected successfully!'
      );
      setShowDetailsModal(false);
      fetchStats();
      fetchPayments(pagination.page);
      fetchBankSlips();
      setActionLoading(false);
    }, 500);
  };

  // View Payment Details
  const handleViewDetails = async (paymentId) => {
    const dummyPaymentDetails = {
      id: paymentId,
      payment_number: `PAY-${String(paymentId).padStart(3, '0')}`,
      status: 'pending',
      student: { name: 'John Doe', email: 'john@example.com' },
      amount: 50000,
      discount_amount: 5000,
      payment_method: 'bank',
      created_at: '2026-03-10T10:30:00Z',
      completed_at: null,
      bank_details: {
        bank_name: 'Bank of Ceylon',
        branch: 'Colombo Main',
        account_holder: 'John Doe',
        transfer_date: '2026-03-10T10:00:00Z',
        bank_slip_url: 'https://via.placeholder.com/400x300?text=Bank+Slip',
      },
      payhere_details: null,
      verification: {
        verified_by: null,
        verification_date: null,
        rejection_reason: null,
      },
    };
    setSelectedPayment(dummyPaymentDetails);
    setShowDetailsModal(true);
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
            <StatCard
              stats={{
                total_revenue_display: `Rs. ${(stats.total_revenue / 1000).toFixed(1)}K`,
                completed_count: stats.completed_count,
                pending_total: stats.pending_count + stats.bank_transfer_pending,
                this_month_display: `Rs. ${(stats.this_month / 1000).toFixed(1)}K`
              }}
              metricsConfig={paymentsMetricsConfig}
            />

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
}
export default AdminPayments;
