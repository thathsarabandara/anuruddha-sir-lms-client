import { useState } from 'react';
import { FaCheck, FaTimes, FaTimesCircle } from 'react-icons/fa';

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const payments = [
    {
      id: 'PAY-2025-001',
      student: 'Kamal Perera',
      course: 'Complete Scholarship Package',
      amount: 'Rs. 12,000',
      method: 'payhere',
      status: 'completed',
      date: 'Dec 17, 2025',
      transactionId: 'PH-ABC123456',
      teacher: 'Anuruddha Sir',
    },
    {
      id: 'PAY-2025-002',
      student: 'Nimal Silva',
      course: 'Mathematics Excellence',
      amount: 'Rs. 5,000',
      method: 'bank',
      status: 'pending',
      date: 'Dec 16, 2025',
      transactionId: null,
      teacher: 'Anuruddha Sir',
      bankSlip: '/uploads/bank_slip_002.jpg',
      bankDetails: { bank: 'Bank of Ceylon', branch: 'Colombo', date: 'Dec 16, 2025' },
    },
    {
      id: 'PAY-2025-003',
      student: 'Dilshan Mendis',
      course: 'Science Mastery',
      amount: 'Rs. 4,000',
      method: 'payhere',
      status: 'completed',
      date: 'Dec 15, 2025',
      transactionId: 'PH-DEF789012',
      teacher: 'Saman Fernando',
    },
    {
      id: 'PAY-2025-004',
      student: 'Sanduni Fernando',
      course: 'Mathematics Excellence',
      amount: 'Rs. 5,000',
      method: 'bank',
      status: 'pending',
      date: 'Dec 15, 2025',
      transactionId: null,
      teacher: 'Anuruddha Sir',
      bankSlip: '/uploads/bank_slip_004.jpg',
      bankDetails: { bank: 'Commercial Bank', branch: 'Kandy', date: 'Dec 14, 2025' },
    },
    {
      id: 'PAY-2025-005',
      student: 'Kasun Jayawardena',
      course: 'Complete Scholarship Package',
      amount: 'Rs. 12,000',
      method: 'cash',
      status: 'completed',
      date: 'Dec 14, 2025',
      transactionId: 'CASH-001',
      teacher: 'Anuruddha Sir',
    },
    {
      id: 'PAY-2025-006',
      student: 'Tharindu Perera',
      course: 'English Grammar',
      amount: 'Rs. 4,500',
      method: 'bank',
      status: 'rejected',
      date: 'Dec 13, 2025',
      transactionId: null,
      teacher: 'Saman Fernando',
      rejectionReason: 'Invalid bank slip - amount mismatch',
    },
  ];

  const stats = [
    { label: 'Total Payments', value: 'Rs. 3.2M', icon: '💰', color: 'bg-blue-100 text-blue-700' },
    { label: 'This Month', value: 'Rs. 450K', icon: '📈', color: 'bg-green-100 text-green-700' },
    { label: 'Pending Verification', value: '8', icon: '⏳', color: 'bg-orange-100 text-orange-700' },
    { label: 'Rejected', value: '3', icon: FaTimesCircle, color: 'bg-red-100 text-red-700' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-orange-100 text-orange-700',
      rejected: 'bg-red-100 text-red-700',
      processing: 'bg-blue-100 text-blue-700',
    };
    return colors[status] || colors.pending;
  };

  const getMethodBadge = (method) => {
    const badges = {
      payhere: { label: 'PayHere', color: 'bg-purple-100 text-purple-700' },
      bank: { label: 'Bank Transfer', color: 'bg-blue-100 text-blue-700' },
      cash: { label: 'Cash', color: 'bg-green-100 text-green-700' },
    };
    return badges[method] || badges.cash;
  };

  const handleVerify = (payment) => {
    setSelectedPayment(payment);
    setShowVerifyModal(true);
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = filterMethod === 'all' || payment.method === filterMethod;
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesMethod && matchesStatus;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
        <p className="text-gray-600">Verify and manage all payment transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`text-3xl ${stat.color} p-3 rounded-lg`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 gap-4">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by student, course, or payment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)} className="input-field">
              <option value="all">All Methods</option>
              <option value="payhere">PayHere</option>
              <option value="bank">Bank Transfer</option>
              <option value="cash">Cash</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field">
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="btn-outline px-4 py-2">Export</button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{payment.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{payment.student}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-900">{payment.course}</p>
                    <p className="text-xs text-gray-500">by {payment.teacher}</p>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-900">{payment.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getMethodBadge(payment.method).color}`}>
                      {getMethodBadge(payment.method).label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{payment.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      {payment.status === 'pending' && payment.method === 'bank' ? (
                        <button
                          onClick={() => handleVerify(payment)}
                          className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs"
                        >
                          Verify
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVerify(payment)}
                          className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs"
                        >
                          View
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verify Modal */}
      {showVerifyModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedPayment.status === 'pending' ? 'Verify Payment' : 'Payment Details'}
              </h2>
              <button onClick={() => setShowVerifyModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 pb-6 border-b">
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment ID</label>
                  <p className="text-gray-900 font-medium">{selectedPayment.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPayment.status)}`}>
                    {selectedPayment.status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Student</label>
                  <p className="text-gray-900 font-medium">{selectedPayment.student}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Course</label>
                  <p className="text-gray-900 font-medium">{selectedPayment.course}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Amount</label>
                  <p className="text-gray-900 font-bold text-lg">{selectedPayment.amount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Method</label>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getMethodBadge(selectedPayment.method).color}`}>
                    {getMethodBadge(selectedPayment.method).label}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date</label>
                  <p className="text-gray-900 font-medium">{selectedPayment.date}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Teacher</label>
                  <p className="text-gray-900 font-medium">{selectedPayment.teacher}</p>
                </div>
              </div>

              {selectedPayment.method === 'bank' && selectedPayment.bankDetails && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-3">Bank Transfer Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Bank</label>
                      <p className="text-sm text-gray-900 font-medium">{selectedPayment.bankDetails.bank}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Branch</label>
                      <p className="text-sm text-gray-900 font-medium">{selectedPayment.bankDetails.branch}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Transfer Date</label>
                      <p className="text-sm text-gray-900 font-medium">{selectedPayment.bankDetails.date}</p>
                    </div>
                  </div>

                  {selectedPayment.bankSlip && (
                    <div className="mt-4">
                      <label className="text-xs font-medium text-gray-500 mb-2 block">Bank Slip</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <div className="text-4xl mb-2">🖼️</div>
                        <p className="text-sm text-gray-600 mb-2">Bank slip uploaded</p>
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          View Full Image
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedPayment.method === 'payhere' && selectedPayment.transactionId && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">PayHere Transaction</h3>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Transaction ID</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedPayment.transactionId}</p>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">✓ Automatically verified by PayHere</p>
                </div>
              )}

              {selectedPayment.status === 'rejected' && selectedPayment.rejectionReason && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-sm font-medium text-red-900">Rejection Reason:</p>
                  <p className="text-sm text-red-700">{selectedPayment.rejectionReason}</p>
                </div>
              )}

              {selectedPayment.status === 'pending' && selectedPayment.method === 'bank' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                  <textarea
                    rows="3"
                    className="input-field"
                    placeholder="Add verification notes or rejection reason..."
                  />
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                {selectedPayment.status === 'pending' ? (
                  <>
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 font-medium">
                      ✓ Approve Payment
                    </button>
                    <button className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 font-medium">
                      ✗ Reject Payment
                    </button>
                  </>
                ) : (
                  <button className="flex-1 btn-primary">Download Receipt</button>
                )}
                <button onClick={() => setShowVerifyModal(false)} className="px-6 btn-outline">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
