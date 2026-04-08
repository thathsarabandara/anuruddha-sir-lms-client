import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaCheck, FaEye, FaIdCard, FaSearchMinus, FaSearchPlus, FaTimes, FaWallet } from 'react-icons/fa';

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
  const [actionLoading, setActionLoading] = useState(false);
  const [mediaZoom, setMediaZoom] = useState(1);

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

  useEffect(() => {
    setMediaZoom(1);
  }, [selectedPayment]);

  const getReceiptUrl = (payment) => payment?.receipt?.url || paymentAPI.getReceiptFileUrl(payment?.transaction_id);

  const isVideoReceipt = (url = '') => /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url);

  const handleZoomIn = () => setMediaZoom((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 2.5));

  const handleZoomOut = () => setMediaZoom((prev) => Math.max(Number((prev - 0.25).toFixed(2)), 1));

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

          const receiptUrl = row?.receipt?.url || paymentAPI.getReceiptFileUrl(row.transaction_id);
          return (
            <a href={receiptUrl} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline text-sm font-medium">
              View Receipt
            </a>
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
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Student Payment Details</h2>
                <p className="text-sm text-gray-500">Review student payment evidence and confirm enrollment.</p>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                aria-label="Close details popup"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-4">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Student</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{selectedPayment?.student?.name || 'N/A'}</p>
                <p className="text-sm text-gray-600">{selectedPayment?.student?.email || 'No email available'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Course</p>
                  <p className="font-semibold text-gray-900">{selectedPayment?.course?.title || 'N/A'}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="font-semibold text-gray-900">Rs. {Number(selectedPayment?.total || 0).toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Extracted Ref</p>
                  <p className="font-semibold text-gray-900">{selectedPayment?.receipt?.extracted?.reference_number || 'N/A'}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Extracted Amount</p>
                  <p className="font-semibold text-gray-900">{selectedPayment?.receipt?.extracted?.amount || 'N/A'}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 md:col-span-2">
                  <p className="text-xs text-gray-500">Extracted Date</p>
                  <p className="font-semibold text-gray-900">{selectedPayment?.receipt?.extracted?.payment_date || 'N/A'}</p>
                </div>
              </div>

              {selectedPayment?.receipt?.has_receipt && (
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <p className="text-sm font-semibold text-gray-900">Receipt Preview</p>
                    <div className="flex items-center gap-2">
                      {!isVideoReceipt(getReceiptUrl(selectedPayment)) && (
                        <>
                          <button
                            onClick={handleZoomOut}
                            className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                            disabled={mediaZoom <= 1}
                            title="Zoom out"
                          >
                            <FaSearchMinus />
                          </button>
                          <button
                            onClick={handleZoomIn}
                            className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                            disabled={mediaZoom >= 2.5}
                            title="Zoom in"
                          >
                            <FaSearchPlus />
                          </button>
                          <span className="text-xs text-gray-500 w-12 text-center">{Math.round(mediaZoom * 100)}%</span>
                        </>
                      )}
                      <a
                        href={getReceiptUrl(selectedPayment)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-lg border border-blue-300 text-blue-700 text-sm font-semibold hover:bg-blue-50"
                      >
                        Open in New Tab
                      </a>
                    </div>
                  </div>

                  <div className="bg-gray-900/5 border border-gray-200 rounded-lg overflow-auto max-h-[420px] p-3">
                    {isVideoReceipt(getReceiptUrl(selectedPayment)) ? (
                      <video
                        controls
                        className="w-full max-h-[380px] rounded-lg bg-black"
                        src={getReceiptUrl(selectedPayment)}
                      >
                        <track kind="captions" />
                      </video>
                    ) : (
                      <img
                        src={getReceiptUrl(selectedPayment)}
                        alt="Payment receipt"
                        className="rounded-lg mx-auto"
                        style={{
                          transform: `scale(${mediaZoom})`,
                          transformOrigin: 'top center',
                          transition: 'transform 150ms ease-out',
                          maxWidth: '100%',
                        }}
                      />
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>

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
        </div>
      )}
    </div>
  );
};

export default PaymentApprovals;
