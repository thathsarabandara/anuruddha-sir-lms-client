import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaCheck, FaEye, FaIdCard, FaTimes, FaWallet } from 'react-icons/fa';

import DataTable from '../../components/common/DataTable';
import Notification from '../../components/common/Notification';
import StatCard from '../../components/common/StatCard';
import ButtonWithLoader from '../../components/common/ButtonWithLoader';
import paymentAPI from '../../api/payment';

const statsConfig = [
  {
    label: 'Total Payments',
    statsKey: 'total_payments',
    icon: FaWallet,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
    description: 'for your courses',
  },
  {
    label: 'Pending Approval',
    statsKey: 'pending_count',
    icon: FaEye,
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-600',
    description: 'need your action',
  },
  {
    label: 'Approved',
    statsKey: 'completed_count',
    icon: FaCheck,
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
    description: 'verified payments',
  },
  {
    label: 'Rejected',
    statsKey: 'rejected_count',
    icon: FaTimes,
    bgColor: 'bg-red-100',
    textColor: 'text-red-600',
    description: 'failed verification',
  },
];

const statusClass = {
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

const defaultStats = {
  total_payments: 0,
  pending_count: 0,
  completed_count: 0,
  rejected_count: 0,
};

const PaymentApprovals = () => {
  const [notification, setNotification] = useState(null);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [receiptPreviewPayment, setReceiptPreviewPayment] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type, duration: 4000 });
  };

  const fetchApprovals = useCallback(async () => {
    setLoading(true);
    try {
      const response = await paymentAPI.getTeacherApprovals({ status, search, page: 1, limit: 50 });
      const payload = response?.data?.data || {};
      setPayments(Array.isArray(payload.payments) ? payload.payments : []);
      setStats({ ...defaultStats, ...(payload.stats || {}) });
    } catch (error) {
      showNotification(error?.message || 'Failed to load payment approvals', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  const handleApprove = async (row) => {
    setActionLoading(true);
    try {
      await paymentAPI.approveTeacherPayment(row.transaction_id, 'Approved by class teacher');
      showNotification('Payment approved and student enrolled', 'success');
      setSelectedPayment(null);
      fetchApprovals();
    } catch (error) {
      showNotification(error?.message || 'Failed to approve payment', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (row) => {
    const reason = window.prompt('Enter rejection reason');
    if (!reason) return;

    setActionLoading(true);
    try {
      await paymentAPI.rejectTeacherPayment(row.transaction_id, reason);
      showNotification('Payment rejected', 'success');
      setSelectedPayment(null);
      fetchApprovals();
    } catch (error) {
      showNotification(error?.message || 'Failed to reject payment', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: 'student',
        label: 'Student',
        render: (_, row) => (
          <div>
            <p className="font-semibold text-gray-900">{row?.student?.name || 'N/A'}</p>
            <p className="text-xs text-gray-600">{row?.student?.email || 'No email'}</p>
          </div>
        ),
      },
      {
        key: 'course',
        label: 'Course',
        render: (_, row) => <span className="font-medium">{row?.course?.title || 'N/A'}</span>,
      },
      {
        key: 'amount',
        label: 'Amount',
        render: (value, row) => `Rs. ${Number(row?.total || value || 0).toLocaleString()}`,
      },
      {
        key: 'status',
        label: 'Status',
        render: (value) => (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass[value] || 'bg-gray-100 text-gray-700'}`}>
            {String(value || '').toUpperCase()}
          </span>
        ),
      },
      {
        key: 'receipt',
        label: 'Receipt',
        render: (_, row) => {
          const hasReceipt = row?.receipt?.has_receipt;
          if (!hasReceipt) return <span className="text-xs text-gray-500">No receipt</span>;

          return (
            <button
              type="button"
              onClick={() => setReceiptPreviewPayment(row)}
              className="text-primary-600 hover:underline text-sm font-medium"
            >
              View Receipt
            </button>
          );
        },
      },
      {
        key: 'actions',
        label: 'Actions',
        render: (_, row) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedPayment(row)}
              className="px-3 py-1.5 rounded-md border border-gray-300 text-xs font-semibold hover:bg-gray-50"
            >
              Details
            </button>
            <a
              href={`/teacher/courses/${row?.course?.course_id}`}
              className="px-3 py-1.5 rounded-md border border-blue-300 text-blue-700 text-xs font-semibold hover:bg-blue-50"
            >
              <span className="inline-flex items-center gap-1"><FaIdCard /> Student Profile</span>
            </a>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-8">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Approvals</h1>
        <p className="text-gray-600">Verify payment receipts for students enrolled in your courses.</p>
      </div>

      <StatCard stats={stats} metricsConfig={statsConfig} loading={loading} />

      <div className="card">
        <DataTable
          data={payments}
          columns={columns}
          loading={loading}
          config={{
            searchPlaceholder: 'Search by student, email, or course...',
            searchValue: search,
            onSearchChange: setSearch,
            statusFilterOptions: [
              { label: 'All Statuses', value: 'all' },
              { label: 'Pending', value: 'pending' },
              { label: 'Completed', value: 'completed' },
              { label: 'Failed', value: 'failed' },
            ],
            statusFilterValue: status,
            onStatusFilterChange: setStatus,
            emptyMessage: 'No payment records found',
            itemsPerPage: 10,
          }}
        />
      </div>

      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-500">Student</p>
                <p className="font-semibold">{selectedPayment?.student?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Course</p>
                <p className="font-semibold">{selectedPayment?.course?.title || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Amount</p>
                <p className="font-semibold">Rs. {Number(selectedPayment?.total || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Extracted Ref</p>
                <p className="font-semibold">{selectedPayment?.receipt?.extracted?.reference_number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Extracted Amount</p>
                <p className="font-semibold">{selectedPayment?.receipt?.extracted?.amount || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Extracted Date</p>
                <p className="font-semibold">{selectedPayment?.receipt?.extracted?.payment_date || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedPayment?.receipt?.has_receipt && (
                  <button
                    type="button"
                    onClick={() => setReceiptPreviewPayment(selectedPayment)}
                    className="px-4 py-2 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    View Receipt Image
                  </button>
                )}
              </div>

              {selectedPayment?.status === 'pending' && (
                <div className="flex items-center gap-2">
                  <ButtonWithLoader
                    label="Reject"
                    loadingLabel="Rejecting..."
                    isLoading={actionLoading}
                    onClick={() => handleReject(selectedPayment)}
                    variant="danger"
                    icon={<FaTimes />}
                  />
                  <ButtonWithLoader
                    label="Approve"
                    loadingLabel="Approving..."
                    isLoading={actionLoading}
                    onClick={() => handleApprove(selectedPayment)}
                    variant="success"
                    icon={<FaCheck />}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {receiptPreviewPayment && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold">Receipt Preview</h3>
                <p className="text-sm text-emerald-100">Hover the image to zoom</p>
              </div>
              <button
                type="button"
                onClick={() => setReceiptPreviewPayment(null)}
                className="text-white/90 hover:text-white text-sm px-3 py-1 rounded-md border border-white/40"
              >
                Close
              </button>
            </div>

            <div className="p-6 bg-slate-50">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Student</p>
                    <p className="font-semibold text-slate-900">{receiptPreviewPayment?.student?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Course</p>
                    <p className="font-semibold text-slate-900">{receiptPreviewPayment?.course?.title || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Transaction</p>
                    <p className="font-semibold text-slate-900 text-sm">{receiptPreviewPayment?.transaction_id || 'N/A'}</p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center">
                  <img
                    src={receiptPreviewPayment?.receipt?.url || paymentAPI.getReceiptFileUrl(receiptPreviewPayment.transaction_id)}
                    alt="Receipt preview"
                    className="max-h-[75vh] w-auto max-w-full object-contain transition-transform duration-300 ease-out hover:scale-125 hover:cursor-zoom-in"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentApprovals;
