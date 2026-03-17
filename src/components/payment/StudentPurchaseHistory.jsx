import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * StudentPurchaseHistory Component
 * View purchase history and download invoices
 */
const StudentPurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    fetchPurchases();
  }, [page]);

  const fetchPurchases = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `/api/v1/payments/student/purchase-history/?page=${page}`
      );

      if (response.data.success) {
        setPurchases(response.data.purchases);
        setTotalPages(response.data.total_pages);
      }
    } catch (err) {
      setError('Failed to load purchase history');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = async (purchaseId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/v1/payments/student/invoices/${purchaseId}/`
      );

      if (response.data.success) {
        setSelectedInvoice(response.data.invoice);
        setShowInvoice(true);
      }
    } catch (err) {
      setError('Failed to load invoice');
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (purchaseId) => {
    try {
      const response = await axios.get(
        `/api/v1/payments/student/invoices/${purchaseId}/download/`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${purchaseId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('Failed to download invoice');
      console.log(err)
    }
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      completed: '#28a745',
      pending: '#ffc107',
      failed: '#dc3545',
      refunded: '#6c757d',
    };
    return colors[status] || '#6c757d';
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      payhere: '💳',
      bank: '🏦',
      cash: '💵',
      free: '🎁',
    };
    return icons[method] || '💰';
  };

  return (
    <div className="student-purchase-history">
      <div className="history-header">
        <h3>Purchase History</h3>
        <p>View and download your course purchase receipts and invoices</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showInvoice && selectedInvoice && (
        <div className="invoice-modal">
          <div className="modal-overlay" onClick={() => setShowInvoice(false)} />
          <div className="modal-content">
            <div className="modal-header">
              <h4>Invoice #{selectedInvoice.invoice_number}</h4>
              <button className="close-btn" onClick={() => setShowInvoice(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="invoice-section">
                <div className="invoice-header">
                  <div>
                    <h5>INVOICE</h5>
                    <p className="invoice-id">#{selectedInvoice.invoice_number}</p>
                  </div>
                  <div className="invoice-date">
                    <p className="label">Invoice Date</p>
                    <p className="value">
                      {new Date(selectedInvoice.invoice_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="invoice-parties">
                  <div className="party">
                    <p className="label">Bill To</p>
                    <p className="name">{selectedInvoice.student_name}</p>
                    <p className="email">{selectedInvoice.student_email}</p>
                  </div>
                </div>

                <table className="invoice-items">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th className="text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.course_name}</td>
                        <td className="text-right">₹{item.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="invoice-totals">
                  <div className="total-row">
                    <span>Subtotal</span>
                    <span>₹{selectedInvoice.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedInvoice.discount_amount > 0 && (
                    <div className="total-row discount">
                      <span>Discount ({selectedInvoice.coupon_code})</span>
                      <span>-₹{selectedInvoice.discount_amount.toFixed(2)}</span>
                    </div>
                  )}
                  {selectedInvoice.tax_amount > 0 && (
                    <div className="total-row">
                      <span>Tax ({selectedInvoice.tax_percentage}%)</span>
                      <span>₹{selectedInvoice.tax_amount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="total-row final">
                    <span>Total Amount</span>
                    <span>₹{selectedInvoice.total_amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="payment-info">
                  <p>
                    <strong>Payment Method:</strong> {selectedInvoice.payment_method}
                  </p>
                  <p>
                    <strong>Payment Status:</strong>{' '}
                    <span className="status-badge" style={{ background: getPaymentStatusColor(selectedInvoice.payment_status) }}>
                      {selectedInvoice.payment_status}
                    </span>
                  </p>
                </div>
              </div>

              <div className="invoice-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => window.print()}
                >
                  🖨️ Print
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => handleDownloadInvoice(selectedInvoice.order_id)}
                >
                  ⬇️ Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading purchase history...</div>
      ) : (
        <div className="purchases-list">
          {purchases.length === 0 ? (
            <div className="no-data">
              <p>📦 No purchases yet</p>
              <p>Start learning by purchasing a course today!</p>
            </div>
          ) : (
            purchases.map((purchase) => (
              <div key={purchase.id} className="purchase-card">
                <div className="card-header">
                  <div className="purchase-info">
                    <h4>{purchase.course_name}</h4>
                    <p className="purchase-date">
                      {new Date(purchase.purchase_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="purchase-amount">
                    <span className="amount">₹{purchase.total_amount.toFixed(2)}</span>
                    <span
                      className="payment-status"
                      style={{ background: getPaymentStatusColor(purchase.payment_status) }}
                    >
                      {purchase.payment_status}
                    </span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="detail">
                    <span className="label">Payment Method:</span>
                    <span className="value">
                      {getPaymentMethodIcon(purchase.payment_method)} {purchase.payment_method}
                    </span>
                  </div>

                  {purchase.coupon_code && (
                    <div className="detail">
                      <span className="label">Coupon Applied:</span>
                      <span className="value">
                        {purchase.coupon_code} (-₹{purchase.discount_amount.toFixed(2)})
                      </span>
                    </div>
                  )}

                  <div className="detail">
                    <span className="label">Order ID:</span>
                    <span className="value order-id">{purchase.order_id}</span>
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleViewInvoice(purchase.id)}
                    disabled={loading}
                  >
                    👁️ View Invoice
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => handleDownloadInvoice(purchase.id)}
                    disabled={loading}
                  >
                    ⬇️ Download
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1 || loading}
            className="btn btn-sm"
          >
            Previous
          </button>
          <span className="page-info">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages || loading}
            className="btn btn-sm"
          >
            Next
          </button>
        </div>
      )}

      <style jsx>{`
        .student-purchase-history {
          padding: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .history-header {
          margin-bottom: 2rem;
        }

        .history-header h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
          color: #333;
        }

        .history-header p {
          margin: 0;
          color: #666;
          font-size: 0.95rem;
        }

        .alert {
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 4px;
          border: 1px solid #ddd;
        }

        .alert-danger {
          background: #f8d7da;
          border-color: #f5c6cb;
          color: #721c24;
        }

        .purchases-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .purchase-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }

        .purchase-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .card-header {
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .purchase-info h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1.1rem;
        }

        .purchase-date {
          margin: 0;
          font-size: 0.85rem;
          opacity: 0.9;
        }

        .purchase-amount {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }

        .amount {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .payment-status {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
        }

        .card-body {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .detail {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          padding: 0.5rem;
          background: #f8f9fa;
          border-radius: 4px;
        }

        .detail .label {
          font-weight: 500;
          color: #666;
        }

        .detail .value {
          color: #333;
          font-weight: 500;
        }

        .order-id {
          font-family: 'Courier New', monospace;
          font-size: 0.85rem;
          background: #e0e0e0;
          padding: 0.25rem 0.5rem;
          border-radius: 3px;
        }

        .card-actions {
          padding: 1rem;
          display: flex;
          gap: 0.75rem;
          border-top: 1px solid #eee;
        }

        .card-actions .btn {
          flex: 1;
        }

        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
        }

        .btn-success {
          background: #28a745;
          color: white;
        }

        .btn-success:hover:not(:disabled) {
          background: #218838;
        }

        .btn-sm {
          padding: 0.35rem 0.75rem;
          font-size: 0.8rem;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .invoice-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
        }

        .modal-content {
          position: relative;
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          max-width: 700px;
          width: 95%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #eee;
        }

        .modal-header h4 {
          margin: 0;
          color: #333;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
          padding: 0;
        }

        .modal-body {
          padding: 2rem;
        }

        .invoice-section {
          margin-bottom: 2rem;
        }

        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #eee;
        }

        .invoice-header h5 {
          margin: 0;
          font-size: 2rem;
          color: #333;
        }

        .invoice-id {
          margin: 0;
          font-size: 1.5rem;
          font-weight: bold;
          color: #667eea;
        }

        .invoice-date {
          text-align: right;
        }

        .invoice-date .label {
          color: #666;
          font-size: 0.9rem;
          margin: 0;
        }

        .invoice-date .value {
          margin: 0;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .invoice-parties {
          margin-bottom: 2rem;
        }

        .party {
          margin-bottom: 1rem;
        }

        .party .label {
          color: #666;
          font-size: 0.85rem;
          text-transform: uppercase;
          font-weight: 600;
          margin: 0;
        }

        .party .name {
          margin: 0.5rem 0 0 0;
          font-weight: 600;
          color: #333;
        }

        .party .email {
          margin: 0.25rem 0 0 0;
          color: #666;
          font-size: 0.9rem;
        }

        .invoice-items {
          width: 100%;
          margin-bottom: 2rem;
          border-collapse: collapse;
        }

        .invoice-items th {
          text-align: left;
          padding: 0.75rem;
          background: #f8f9fa;
          border-bottom: 2px solid #ddd;
          font-weight: 600;
          color: #333;
        }

        .invoice-items td {
          padding: 0.75rem;
          border-bottom: 1px solid #eee;
        }

        .text-right {
          text-align: right;
        }

        .invoice-totals {
          margin-bottom: 2rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 4px;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          color: #333;
        }

        .total-row.discount {
          color: #28a745;
        }

        .total-row.final {
          font-size: 1.2rem;
          font-weight: bold;
          padding: 1rem 0;
          border-top: 2px solid #ddd;
          border-bottom: 2px solid #ddd;
          color: #333;
        }

        .payment-info {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #e8f5e9;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .payment-info p {
          margin: 0.5rem 0;
        }

        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
        }

        .invoice-actions {
          display: flex;
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #eee;
        }

        .invoice-actions .btn {
          flex: 1;
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .no-data {
          text-align: center;
          padding: 3rem 2rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .no-data p {
          margin: 0.5rem 0;
          color: #666;
        }

        .no-data p:first-child {
          font-size: 2rem;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        .page-info {
          color: #666;
          font-size: 0.9rem;
        }

        @media print {
          .modal-header button,
          .invoice-actions,
          .card-actions,
          .pagination {
            display: none;
          }

          .modal-content {
            box-shadow: none;
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentPurchaseHistory;
