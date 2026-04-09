import axiosInstance from './axios';

export const paymentAPI = {
  // Student: payment history/pending transactions.
  getStudentPayments: (params = {}) =>
    axiosInstance.get('/payments/student/transactions', { params }),

  // Student: continue an existing pending payment.
  continueStudentPayment: (transactionId, payload = {}) =>
    axiosInstance.post(`/payments/student/transactions/${transactionId}/continue`, payload),

  // Student: upload bank receipt for a pending transaction.
  uploadStudentReceipt: (formData) =>
    axiosInstance.post('/payments/student/receipts/upload', formData),

  // Teacher: list payment approvals for own courses.
  getTeacherApprovals: (params = {}) =>
    axiosInstance.get('/payments/teacher/approvals', { params }),

  // Teacher: approve or reject payment.
  approveTeacherPayment: (transactionId, notes = '') =>
    axiosInstance.post(`/payments/teacher/approvals/${transactionId}/approve`, { notes }),

  rejectTeacherPayment: (transactionId, reason) =>
    axiosInstance.post(`/payments/teacher/approvals/${transactionId}/reject`, { reason }),

  // Shared: resolved receipt file endpoint for inline viewing.
  getReceiptFileUrl: (transactionId) =>
    `${axiosInstance.defaults.baseURL}/payments/receipts/${transactionId}/file`,
};

export default paymentAPI;
