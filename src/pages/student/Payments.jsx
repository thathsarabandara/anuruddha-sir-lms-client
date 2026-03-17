import { useState } from 'react';
import { FaCheck, FaClock, FaCreditCard, FaExclamationTriangle, FaGraduationCap, FaDollarSign, FaBook, FaCalendar } from 'react-icons/fa';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import Notification from '../../components/common/Notification';

const StudentPayments = () => {
  const [selectedTab, setSelectedTab] = useState('history');
  const [searchTerm, setSearchTerm] = useState('');

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

  const paymentHistory = [
    {
      id: 1,
      invoiceNo: 'INV-2025-001',
      course: 'Complete Scholarship Package',
      amount: 25000,
      date: 'Dec 1, 2025',
      status: 'paid',
      method: 'PayHere',
      transactionId: 'TXN-12345',
    },
    {
      id: 2,
      invoiceNo: 'INV-2025-002',
      course: 'Mathematics Excellence',
      amount: 8000,
      date: 'Nov 15, 2025',
      status: 'paid',
      method: 'Bank Deposit',
      transactionId: 'BANK-67890',
    },
    {
      id: 3,
      invoiceNo: 'INV-2025-003',
      course: 'Sinhala Language',
      amount: 8000,
      date: 'Oct 20, 2025',
      status: 'paid',
      method: 'PayHere',
      transactionId: 'TXN-54321',
    },
  ];

  const pendingPayments = [
    {
      id: 4,
      invoiceNo: 'INV-2025-004',
      course: 'Environment Studies',
      amount: 8000,
      dueDate: 'Dec 25, 2025',
      status: 'pending',
      daysLeft: 5,
    },
  ];

  const paymentMethods = [
    {
      id: 1,
      name: 'PayHere',
      logo: '💳',
      description: 'Pay with Credit/Debit Card or Online Banking',
      fee: 'No additional fee',
      recommended: true,
    },
    {
      id: 2,
      name: 'Bank Deposit',
      logo: '🏦',
      description: 'Direct bank transfer to our account',
      fee: 'Bank charges may apply',
      recommended: false,
    },
    {
      id: 3,
      name: 'Cash Payment',
      logo: '💵',
      description: 'Pay in cash at our office',
      fee: 'No additional fee',
      recommended: false,
    },
  ];

  const bankDetails = {
    bank: 'Bank of Ceylon',
    branch: 'Colombo Main Branch',
    accountName: 'Anuruddha Sir Education Center',
    accountNumber: '123456789',
    swiftCode: 'BCEYLKLX',
  };

  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
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
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Payments
                </h1>
                <p className="text-slate-600 mt-1">Manage your course payments and invoices</p>
              </div>
              <div className="text-5xl"><FaGraduationCap className="text-blue-600" /></div>
            </div>
          </div>
      </div>

      {/* Stats */}
      <StatCard 
        stats={{
          totalPaid: 'Rs. 41,000',
          pending: 'Rs. 8,000',
          nextPayment: 'Dec 25',
          totalCourses: '4',
        }}
        metricsConfig={paymentsMetricsConfig}
      />

      {/* Tabs */}
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

      {/* Payment History with DataTable */}
      {selectedTab === 'history' && (
        <DataTable
          data={paymentHistory}
          columns={[
            {
              key: 'invoiceNo',
              label: 'Invoice No.',
              searchable: true,
              render: (value) => <p className="text-sm font-medium text-gray-900">{value}</p>,
            },
            {
              key: 'course',
              label: 'Course',
              searchable: true,
              render: (value) => <p className="text-sm text-gray-900">{value}</p>,
            },
            {
              key: 'amount',
              label: 'Amount',
              render: (value) => <p className="text-sm font-medium text-gray-900">Rs. {value.toLocaleString()}</p>,
            },
            {
              key: 'date',
              label: 'Date',
              render: (value) => <p className="text-sm text-gray-600">{value}</p>,
            },
            {
              key: 'status',
              label: 'Status',
              filterable: true,
              filterOptions: [
                { label: 'All', value: 'all' },
                { label: 'Paid', value: 'paid' },
                { label: 'Pending', value: 'pending' },
              ],
              render: (value) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${value === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {value.toUpperCase()}
                </span>
              ),
            },
            {
              key: 'method',
              label: 'Payment Method',
              render: (value) => <p className="text-sm text-gray-600">{value}</p>,
            },
            {
              key: 'transactionId',
              label: 'Transaction ID',
              render: (value) => <p className="text-xs text-gray-600">{value}</p>,
            },
            {
              key: 'actions',
              label: 'Actions',
              render: (_, payment) => (
                <button onClick={() => console.log('Download receipt:', payment.invoiceNo)} className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs transition whitespace-nowrap">
                  Download
                </button>
              ),
            },
          ]}
          config={{
            itemsPerPage: 8,
            searchPlaceholder: 'Search by invoice or course...',
            hideSearch: false,
            emptyMessage: 'No payment history found',
            searchValue: searchTerm,
            onSearchChange: setSearchTerm,
            statusFilterOptions: [
              { label: 'All', value: 'all' },
              { label: 'Paid', value: 'paid' },
              { label: 'Pending', value: 'pending' },
            ],
            statusFilterValue: 'all',
            onStatusFilterChange: () => {},
          }}
          loading={false}
        />
      )}

      {/* Pending Payments */}
      {selectedTab === 'pending' && (
        <div className="space-y-4">
          {pendingPayments.map((payment) => (
            <div key={payment.id} className="card border-2 border-yellow-200 bg-yellow-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg">
                    <FaClock className="text-2xl" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{payment.course}</h3>
                      <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded">
                        PAYMENT DUE
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <div className="text-gray-600">Invoice No.</div>
                        <div className="font-medium text-gray-900">{payment.invoiceNo}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Amount</div>
                        <div className="font-bold text-yellow-700 text-lg">
                          Rs. {payment.amount.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Due Date</div>
                        <div className="font-medium text-gray-900">{payment.dueDate}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-yellow-700">
                      <FaExclamationTriangle className="mr-1" />
                      {payment.daysLeft} days remaining to make payment
                    </div>
                  </div>
                </div>
                <button className="btn-primary px-6">
                  Pay Now
                </button>
              </div>
            </div>
          ))}

          {pendingPayments.length === 0 && (
            <div className="text-center py-12">
              <FaCheck className="text-6xl mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Pending Payments</h3>
              <p className="text-gray-600">All your payments are up to date!</p>
            </div>
          )}
        </div>
      )}

      {/* Payment Methods */}
      {selectedTab === 'methods' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`card ${method.recommended ? 'border-2 border-primary-600 bg-primary-50' : ''}`}
              >
                {method.recommended && (
                  <div className="absolute -top-3 left-4 px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded">
                    RECOMMENDED
                  </div>
                )}
                <div className="text-center">
                  <div className="text-5xl mb-3">{method.logo}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{method.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                  <div className="text-xs text-gray-500 mb-4">{method.fee}</div>
                  <button className="w-full btn-outline text-sm py-2">
                    Select Method
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bank Details */}
          <div className="card bg-blue-50 border-2 border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">🏦</span>
              Bank Account Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Bank Name</div>
                <div className="font-medium text-gray-900">{bankDetails.bank}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Branch</div>
                <div className="font-medium text-gray-900">{bankDetails.branch}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Account Name</div>
                <div className="font-medium text-gray-900">{bankDetails.accountName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Account Number</div>
                <div className="font-bold text-gray-900 text-lg">{bankDetails.accountNumber}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">SWIFT Code</div>
                <div className="font-medium text-gray-900">{bankDetails.swiftCode}</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-sm text-yellow-800">
              <strong>Note:</strong> After making a bank deposit, please upload the bank slip for verification.
            </div>
          </div>

          {/* Help Section */}
          <div className="card bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Need Help?</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>📞 Contact us: <span className="font-medium text-gray-900">+94 77 123 4567</span></p>
              <p>📧 Email: <span className="font-medium text-gray-900">payments@anuruddhasir.lk</span></p>
              <p>💬 WhatsApp: <span className="font-medium text-gray-900">+94 77 123 4567</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPayments;
