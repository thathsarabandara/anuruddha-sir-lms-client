import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCheck,
  FaClock,
  FaCreditCard,
  FaDownload,
  FaEye,
  FaExclamationTriangle,
  FaFileInvoice,
  FaGraduationCap,
  FaDollarSign,
  FaBook,
  FaCalendar,
  FaUpload,
} from 'react-icons/fa';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import Notification from '../../components/common/Notification';
import ButtonWithLoader from '../../components/common/ButtonWithLoader';
import paymentAPI from '../../api/payment';

const StudentPayments = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('history');
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const [payingId, setPayingId] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [invoicePreviewPayment, setInvoicePreviewPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    total_paid: 0,
    pending_amount: 0,
    next_payment_date: null,
    total_courses: 0,
    pending_count: 0,
  });

  const paymentsMetricsConfig = [
    {
      label: 'Total Paid',
      statsKey: 'totalPaid',
      icon: FaDollarSign,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'Paid amount',
    },
    {
      label: 'Pending',
      statsKey: 'pending',
      icon: FaClock,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      description: 'Outstanding balance',
    },
    {
      label: 'Next Payment',
      statsKey: 'nextPayment',
      icon: FaCalendar,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'Due date',
    },
    {
      label: 'Total Courses',
      statsKey: 'totalCourses',
      icon: FaBook,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600',
      description: 'Enrolled courses',
    },
  ];

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

  const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '-');

  const isReceiptUploaded = (payment) => Boolean(payment?.receipt_uploaded || payment?.receipt?.url);

  const isApprovedPayment = (payment) => String(payment?.status || '').toLowerCase() === 'completed';

  const getVerificationStatus = (payment) =>
    String(payment?.receipt?.verification?.status || '').toLowerCase();

  const buildInvoiceMarkup = (payment) => {
    const verification = getVerificationStatus(payment);
    const isApproved = verification === 'approved';
    const invoiceDate = formatDate(payment?.created_at);
    const paymentDate = formatDate(payment?.created_at);
    const approvedDate = isApproved ? formatDate(payment?.updated_at || payment?.created_at) : '-';
    const courseName = payment?.course?.title || 'Course enrollment';
    const paymentMethod = payment?.payment_method_label || 'Bank Deposit';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${payment?.invoice_no || 'Invoice'}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Tahoma, sans-serif;
              padding: 20px;
              color: #0f172a;
              background: #ffffff;
            }
            .invoice {
              max-width: 840px;
              margin: 0 auto;
              background: #ffffff;
              border: 1px solid #e2e8f0;
            }
            .header {
              padding: 24px;
              background: linear-gradient(135deg, #0ea5e9, #2563eb);
              color: #ffffff;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .title { font-size: 28px; font-weight: 800; margin: 0 0 4px; letter-spacing: 0.5px; }
            .subtitle { margin: 0; font-size: 13px; opacity: 0.9; }
            .status-pill {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 999px;
              background: rgba(255, 255, 255, 0.2);
              font-size: 11px;
              letter-spacing: 0.4px;
              font-weight: 700;
              white-space: nowrap;
            }
            .section { padding: 24px; }
            .section-title { font-size: 13px; font-weight: 800; color: #0f172a; margin: 16px 0 12px; text-transform: uppercase; letter-spacing: 0.3px; }
            .meta-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 12px;
              margin-bottom: 20px;
            }
            .meta-card {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              padding: 12px;
            }
            .meta-label { font-size: 10px; color: #64748b; margin-bottom: 5px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.3px; }
            .meta-value { font-size: 14px; font-weight: 700; color: #0f172a; word-break: break-word; }
            .divider { height: 1px; background: #e2e8f0; margin: 16px 0; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 12px;
              border: 1px solid #e2e8f0;
            }
            th, td { padding: 11px 12px; border-bottom: 1px solid #e2e8f0; text-align: left; }
            th { background: #f1f5f9; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px; color: #475569; font-weight: 700; }
            tr:last-child td { border-bottom: 1px solid #e2e8f0; }
            .right { text-align: right; }
            .total-row td { font-weight: 800; background: #f8fafc; color: #0f172a; }
            .footer {
              padding: 16px 24px;
              color: #64748b;
              font-size: 11px;
              border-top: 1px solid #e2e8f0;
              line-height: 1.5;
            }
            @media print {
              body { padding: 0; background: white; }
              .invoice { border: none; box-shadow: none; }
              .header { background: linear-gradient(135deg, #0ea5e9, #2563eb) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              table, th, td { border-color: #d1d5db; }
              @page { margin: 0; size: A4; }
            }
          </style>
        </head>
        <body>
          <div class="invoice">
            <div class="header">
              <div>
                <h1 class="title">INVOICE</h1>
                <p class="subtitle">LMS Learning Platform</p>
              </div>
              <div class="status-pill">${isApproved ? 'PAYMENT VERIFIED' : 'PAID'}</div>
            </div>

            <div class="section">
              <div class="section-title">Invoice Details</div>
              <div class="meta-grid">
                <div class="meta-card">
                  <div class="meta-label">Invoice Number</div>
                  <div class="meta-value">${payment?.invoice_no || '-'}</div>
                </div>
                <div class="meta-card">
                  <div class="meta-label">Transaction ID</div>
                  <div class="meta-value" style="font-size: 12px;">${payment?.transaction_id || '-'}</div>
                </div>
                <div class="meta-card">
                  <div class="meta-label">Invoice Date</div>
                  <div class="meta-value">${invoiceDate}</div>
                </div>
              </div>

              <div class="section-title">Payment Information</div>
              <div class="meta-grid">
                <div class="meta-card">
                  <div class="meta-label">Payment Date</div>
                  <div class="meta-value">${paymentDate}</div>
                </div>
                <div class="meta-card">
                  <div class="meta-label">Approved Date</div>
                  <div class="meta-value">${approvedDate}</div>
                </div>
                <div class="meta-card">
                  <div class="meta-label">Payment Method</div>
                  <div class="meta-value">${paymentMethod}</div>
                </div>
              </div>

              <div class="section-title">Course Details</div>
              <div class="meta-grid" style="grid-template-columns: repeat(2, 1fr);">
                <div class="meta-card">
                  <div class="meta-label">Course Name</div>
                  <div class="meta-value">${courseName}</div>
                </div>
                <div class="meta-card">
                  <div class="meta-label">Course Status</div>
                  <div class="meta-value" style="color: #10b981;">${isApproved ? 'Active' : 'Pending'}</div>
                </div>
              </div>

              <div class="divider"></div>
              <div class="section-title">Payment Summary</div>
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th class="right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${courseName}</td>
                    <td class="right">${formatCurrency(payment?.amount)}</td>
                  </tr>
                  ${Number(payment?.discount || 0) > 0 ? `
                  <tr>
                    <td>Discount</td>
                    <td class="right">-${formatCurrency(payment?.discount)}</td>
                  </tr>
                  ` : ''}
                  ${Number(payment?.tax || 0) > 0 ? `
                  <tr>
                    <td>Tax (${((payment?.tax / payment?.amount) * 100).toFixed(1)}%)</td>
                    <td class="right">+${formatCurrency(payment?.tax)}</td>
                  </tr>
                  ` : ''}
                  <tr class="total-row">
                    <td style="font-size: 12px; text-transform: uppercase;">Total Paid</td>
                    <td class="right" style="font-size: 16px;">${formatCurrency(payment?.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="footer">
              <strong>This is a system-generated invoice.</strong> Keep this invoice for your records and future reference. For any queries regarding this payment, please contact the LMS support team.
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const handleDownloadInvoice = (payment) => {
    setDownloadingId(payment.transaction_id);

    try {
      const invoiceWindow = window.open('', '_blank', 'width=900,height=1200');
      if (!invoiceWindow) {
        showNotification('Please allow popups to download invoice', 'error');
        setDownloadingId(null);
        return;
      }

      // Write HTML to the new window
      invoiceWindow.document.write(buildInvoiceMarkup(payment));
      invoiceWindow.document.close();
      invoiceWindow.focus();

      // Wait for document to load before printing
      invoiceWindow.onload = () => {
        setTimeout(() => {
          invoiceWindow.print();
          // Close window after print dialog closes (optional)
          invoiceWindow.onafterprint = () => {
            invoiceWindow.close();
          };
        }, 500);
      };

      // Fallback timeout in case onload doesn't fire
      setTimeout(() => {
        if (invoiceWindow && !invoiceWindow.closed) {
          invoiceWindow.print();
        }
        setDownloadingId(null);
      }, 2000);
    } catch (error) {
      console.error('Failed to download invoice:', error);
      showNotification('Failed to download invoice', 'error');
      setDownloadingId(null);
    }
  };

  const handleViewSlip = (payment) => {
    const receiptUrl = paymentAPI.getReceiptFileUrl(payment.transaction_id);
    window.open(receiptUrl, '_blank', 'noopener,noreferrer');
  };

  const loadPayments = async () => {
    setLoading(true);
    try {
      const response = await paymentAPI.getStudentPayments({
        status: 'all',
        search: searchTerm || undefined,
        page: 1,
        limit: 100,
      });
      const payload = response?.data?.data || {};
      setPayments(Array.isArray(payload.payments) ? payload.payments : []);
      setStats(payload.stats || {});
    } catch (error) {
      showNotification(error?.message || 'Failed to load payments', 'error');
      setPayments([]);
      setStats({
        total_paid: 0,
        pending_amount: 0,
        next_payment_date: null,
        total_courses: 0,
        pending_count: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const paymentHistory = useMemo(
    () => payments.filter((payment) => payment.status !== 'pending'),
    [payments],
  );

  const pendingPayments = useMemo(
    () => payments.filter((payment) => payment.status === 'pending'),
    [payments],
  );

  const uiStats = {
    totalPaid: formatCurrency(stats.total_paid),
    pending: formatCurrency(stats.pending_amount),
    nextPayment: stats.next_payment_date || '-',
    totalCourses: String(stats.total_courses || 0),
  };

  const paymentMethods = [
    {
      id: 1,
      name: 'PayHere',
      logo: '💳',
      description: 'Online card payment gateway',
      fee: 'Coming soon',
      recommended: false,
      disabled: true,
    },
    {
      id: 2,
      name: 'Bank Deposit',
      logo: '🏦',
      description: 'Deposit and upload payment slip for verification',
      fee: 'Bank charges may apply',
      recommended: true,
      disabled: false,
    },
  ];

  const handleContinuePayment = async (payment) => {
    setPayingId(payment.transaction_id);
    try {
      const response = await paymentAPI.continueStudentPayment(payment.transaction_id, {
        payment_method: 'bank',
      });
      const data = response?.data?.data;
      showNotification(data?.next_step || 'Continue with bank deposit from checkout', 'info');
      navigate('/student/checkout');
    } catch (error) {
      showNotification(error?.message || 'Failed to continue payment', 'error');
    } finally {
      setPayingId(null);
    }
  };

  const handleUploadReceipt = async (payment, file) => {
    if (!file) return;

    setUploadingId(payment.transaction_id);
    try {
      const formData = new FormData();
      formData.append('transaction_id', payment.transaction_id);
      formData.append('bank_name', 'N/A');
      formData.append('account_holder_name', 'N/A');
      formData.append('transfer_date', new Date().toISOString().split('T')[0]);
      formData.append('receipt_image', file);

      await paymentAPI.uploadStudentReceipt(formData);
      showNotification('Payment slip uploaded successfully', 'success');
      loadPayments();
    } catch (error) {
      showNotification(error?.message || 'Failed to upload slip', 'error');
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="p-8">
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Notification
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Payments
              </h1>
              <p className="text-slate-600 mt-1">Manage your course payments and invoices</p>
            </div>
            <div className="text-5xl"><FaGraduationCap className="text-blue-600" /></div>
          </div>
        </div>
      </div>

      <StatCard stats={uiStats} metricsConfig={paymentsMetricsConfig} loading={loading} />

      <div className="flex space-x-4 mb-8 border-b">
        <button
          onClick={() => setSelectedTab('history')}
          className={`pb-3 px-4 font-medium transition-colors ${
            selectedTab === 'history'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Payment History ({paymentHistory.length})
        </button>
        <button
          onClick={() => setSelectedTab('pending')}
          className={`pb-3 px-4 font-medium transition-colors ${
            selectedTab === 'pending'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending ({pendingPayments.length})
        </button>
        <button
          onClick={() => setSelectedTab('methods')}
          className={`pb-3 px-4 font-medium transition-colors ${
            selectedTab === 'methods'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Payment Methods
        </button>
      </div>

      {selectedTab === 'history' && (
        <DataTable
          data={paymentHistory}
          columns={[
            {
              key: 'invoice_no',
              label: 'Invoice No.',
              searchable: true,
              render: (value) => <p className="text-sm font-medium text-gray-900">{value}</p>,
            },
            {
              key: 'course',
              label: 'Course',
              searchable: true,
              render: (_, payment) => <p className="text-sm text-gray-900">{payment?.course?.title || 'N/A'}</p>,
            },
            {
              key: 'total',
              label: 'Amount',
              render: (value) => <p className="text-sm font-medium text-gray-900">{formatCurrency(value)}</p>,
            },
            {
              key: 'created_at',
              label: 'Date',
              render: (value) => <p className="text-sm text-gray-600">{formatDate(value)}</p>,
            },
            {
              key: 'status',
              label: 'Status',
              render: (value) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${value === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {String(value || '').toUpperCase()}
                </span>
              ),
            },
            {
              key: 'payment_method_label',
              label: 'Payment Method',
              render: (value) => <p className="text-sm text-gray-600">{value}</p>,
            },
            {
              key: 'transaction_id',
              label: 'Transaction ID',
              render: (value) => <p className="text-xs text-gray-600">{value}</p>,
            },
            {
              key: 'actions',
              label: 'Actions',
              render: (_, payment) => (
                isApprovedPayment(payment) ? (
                  <div className="flex items-center gap-2">
                    <ButtonWithLoader
                      label="Show Invoice"
                      isLoading={false}
                      onClick={() => setInvoicePreviewPayment(payment)}
                      variant="secondary"
                      size="sm"
                      icon={<FaEye />}
                    />
                    <ButtonWithLoader
                      label="Download"
                      loadingLabel="Preparing..."
                      isLoading={downloadingId === payment.transaction_id}
                      onClick={() => handleDownloadInvoice(payment)}
                      variant="primary"
                      size="sm"
                      icon={<FaDownload />}
                    />
                  </div>
                ) : (
                  <span className="text-xs text-gray-500">Unavailable</span>
                )
              ),
            },
          ]}
          config={{
            itemsPerPage: 8,
            searchPlaceholder: 'Search by invoice, transaction or course...',
            hideSearch: false,
            emptyMessage: 'No payment history found',
            searchValue: searchTerm,
            onSearchChange: setSearchTerm,
          }}
          loading={loading}
        />
      )}

      {selectedTab === 'pending' && (
        <div className="space-y-4">
          {pendingPayments.map((payment) => (
            <div key={payment.transaction_id} className="card border-2 border-yellow-200 bg-yellow-50">
              {isReceiptUploaded(payment) && (
                <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                  <FaCheck />
                  Slip uploaded. Awaiting teacher approval.
                </div>
              )}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start space-x-4 flex-1 min-w-[280px]">
                  <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg">
                    <FaClock className="text-2xl" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{payment?.course?.title || 'Course Payment'}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${isReceiptUploaded(payment) ? 'bg-blue-200 text-blue-800' : 'bg-yellow-200 text-yellow-800'}`}>
                        {isReceiptUploaded(payment) ? 'AWAITING APPROVAL' : 'PAYMENT DUE'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <div className="text-gray-600">Invoice No.</div>
                        <div className="font-medium text-gray-900">{payment.invoice_no}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Amount</div>
                        <div className="font-bold text-yellow-700 text-lg">
                          {formatCurrency(payment.total)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Due Date</div>
                        <div className="font-medium text-gray-900">
                          {formatDate(payment.due_date)}
                        </div>
                      </div>
                    </div>
                    <div className={`flex items-center text-sm ${isReceiptUploaded(payment) ? 'text-blue-700' : 'text-yellow-700'}`}>
                      <FaExclamationTriangle className="mr-1" />
                      {isReceiptUploaded(payment)
                        ? 'Your slip is submitted. Verification is in progress.'
                        : 'Upload your bank deposit slip and continue payment verification'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <input
                    id={`payment-slip-${payment.transaction_id}`}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(event) => handleUploadReceipt(payment, event.target.files?.[0])}
                  />
                  <ButtonWithLoader
                    label={isReceiptUploaded(payment) ? 'Slip Uploaded' : 'Upload Slip'}
                    loadingLabel="Uploading..."
                    isLoading={uploadingId === payment.transaction_id}
                    onClick={() => {
                      if (isReceiptUploaded(payment)) return;
                      const el = document.getElementById(`payment-slip-${payment.transaction_id}`);
                      if (el) {
                        el.click();
                      }
                    }}
                    variant="secondary"
                    size="md"
                    icon={<FaUpload />}
                    disabled={isReceiptUploaded(payment)}
                  />
                  {isReceiptUploaded(payment) && (
                    <ButtonWithLoader
                      label="View Slip"
                      isLoading={false}
                      onClick={() => handleViewSlip(payment)}
                      variant="light"
                      size="md"
                      icon={<FaEye />}
                    />
                  )}
                  <ButtonWithLoader
                    label={isReceiptUploaded(payment) ? 'Awaiting Approval' : 'Continue'}
                    loadingLabel="Preparing..."
                    isLoading={payingId === payment.transaction_id}
                    onClick={() => handleContinuePayment(payment)}
                    variant="primary"
                    size="md"
                    disabled={isReceiptUploaded(payment)}
                  />
                </div>
              </div>
            </div>
          ))}

          {pendingPayments.length === 0 && (
            <div className="text-center py-12">
              <FaCheck className="text-6xl mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Pending Payments</h3>
              <p className="text-gray-600">All your payments are up to date.</p>
            </div>
          )}
        </div>
      )}

      {selectedTab === 'methods' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`card relative ${method.recommended ? 'border-2 border-primary-600 bg-primary-50' : ''}`}
              >
                {method.recommended && (
                  <div className="absolute -top-3 left-4 px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded">
                    ACTIVE
                  </div>
                )}
                <div className="text-center">
                  <div className="text-5xl mb-3">{method.logo}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{method.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                  <div className="text-xs text-gray-500 mb-4">{method.fee}</div>
                  <button
                    className={`w-full text-sm py-2 rounded-lg border ${method.disabled ? 'opacity-60 cursor-not-allowed border-gray-300 text-gray-500' : 'border-primary-600 text-primary-700 hover:bg-primary-50'}`}
                    disabled={method.disabled}
                  >
                    {method.disabled ? 'Coming Soon' : 'Use in Checkout'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="card bg-yellow-50 border-2 border-yellow-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <FaCreditCard className="mr-2 text-yellow-700" />
              Bank Deposit Flow
            </h3>
            <div className="space-y-2 text-sm text-yellow-900">
              <p>1. Continue pending payment</p>
              <p>2. Make your bank deposit</p>
              <p>3. Upload payment slip</p>
              <p>4. Wait for verification and enrollment activation</p>
            </div>
          </div>
        </div>
      )}

      {invoicePreviewPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 bg-gradient-to-r from-sky-600 to-blue-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaFileInvoice />
                <h3 className="text-xl font-bold">Invoice Preview</h3>
              </div>
              <button
                type="button"
                className="text-white/90 hover:text-white text-sm px-3 py-1 rounded-md border border-white/40"
                onClick={() => setInvoicePreviewPayment(null)}
              >
                Close
              </button>
            </div>

            <div className="p-6 md:p-8 bg-slate-50">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-6 bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h4 className="text-3xl font-bold tracking-wide">INVOICE</h4>
                    <p className="text-sm text-blue-100">LMS Learning Platform</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold">
                    {getVerificationStatus(invoicePreviewPayment) === 'approved' ? 'PAYMENT VERIFIED' : 'PAID'}
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <h5 className="text-sm font-bold uppercase text-slate-700 mb-3 tracking-wide">Invoice Details</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                        <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Invoice Number</div>
                        <div className="font-bold text-slate-900">{invoicePreviewPayment.invoice_no}</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                        <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Transaction ID</div>
                        <div className="font-bold text-slate-900 text-sm">{invoicePreviewPayment.transaction_id}</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                        <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Invoice Date</div>
                        <div className="font-bold text-slate-900">{formatDate(invoicePreviewPayment.created_at)}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-bold uppercase text-slate-700 mb-3 tracking-wide">Payment Information</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                        <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Payment Date</div>
                        <div className="font-bold text-slate-900">{formatDate(invoicePreviewPayment.created_at)}</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                        <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Approved Date</div>
                        <div className="font-bold text-slate-900">
                          {getVerificationStatus(invoicePreviewPayment) === 'approved' 
                            ? formatDate(invoicePreviewPayment.updated_at || invoicePreviewPayment.created_at)
                            : '-'}
                        </div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                        <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Payment Method</div>
                        <div className="font-bold text-slate-900">{invoicePreviewPayment.payment_method_label || 'Bank Deposit'}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-bold uppercase text-slate-700 mb-3 tracking-wide">Course Details</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                        <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Course Name</div>
                        <div className="font-bold text-slate-900">{invoicePreviewPayment?.course?.title || 'Course enrollment'}</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                        <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Course Status</div>
                        <div className={`font-bold ${isApprovedPayment(invoicePreviewPayment) ? 'text-green-600' : 'text-yellow-600'}`}>
                          {isApprovedPayment(invoicePreviewPayment) ? 'Active' : 'Pending'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-6">
                    <h5 className="text-sm font-bold uppercase text-slate-700 mb-3 tracking-wide">Payment Summary</h5>
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wide">
                          <tr>
                            <th className="text-left px-4 py-3">Description</th>
                            <th className="text-right px-4 py-3">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          <tr className="border-t border-slate-200">
                            <td className="px-4 py-3 text-slate-700">{invoicePreviewPayment?.course?.title || 'Course enrollment'}</td>
                            <td className="px-4 py-3 text-right font-medium text-slate-900">{formatCurrency(invoicePreviewPayment.amount)}</td>
                          </tr>
                          {Number(invoicePreviewPayment.discount || 0) > 0 && (
                            <tr className="border-t border-slate-200">
                              <td className="px-4 py-3 text-slate-700">Discount</td>
                              <td className="px-4 py-3 text-right font-medium text-slate-900">-{formatCurrency(invoicePreviewPayment.discount)}</td>
                            </tr>
                          )}
                          {Number(invoicePreviewPayment.tax || 0) > 0 && (
                            <tr className="border-t border-slate-200">
                              <td className="px-4 py-3 text-slate-700">Tax</td>
                              <td className="px-4 py-3 text-right font-medium text-slate-900">{formatCurrency(invoicePreviewPayment.tax)}</td>
                            </tr>
                          )}
                          <tr className="border-t border-slate-200 bg-slate-50">
                            <td className="px-4 py-3 font-bold text-slate-900 uppercase">Total Paid</td>
                            <td className="px-4 py-3 text-right font-extrabold text-lg text-slate-900">
                              {formatCurrency(invoicePreviewPayment.total)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 border-t border-slate-200 pt-4">
                    <strong>This is a system-generated invoice.</strong> Keep this invoice for your records and future reference. For any queries regarding this payment, please contact the LMS support team.
                  </div>

                  <div className="flex flex-wrap gap-2 justify-end">
                    <ButtonWithLoader
                      label="Download Invoice"
                      loadingLabel="Preparing..."
                      isLoading={downloadingId === invoicePreviewPayment.transaction_id}
                      onClick={() => handleDownloadInvoice(invoicePreviewPayment)}
                      variant="primary"
                      size="sm"
                      icon={<FaDownload />}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPayments;
