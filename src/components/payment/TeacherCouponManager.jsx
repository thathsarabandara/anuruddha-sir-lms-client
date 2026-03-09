import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * TeacherCouponManager Component
 * Teacher interface to manage coupons for their own courses
 * Create, edit, delete, and track usage of teacher-created coupons
 */
const TeacherCouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    max_uses: '',
    start_date: '',
    expiry_date: '',
    min_order_amount: '',
    course_ids: [],
  });

  useEffect(() => {
    fetchCoupons();
  }, [page]);

  const fetchCoupons = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `/api/v1/payments/teacher/coupons/?page=${page}`
      );

      if (response.data.success) {
        setCoupons(response.data.coupons);
        setTotalPages(response.data.total_pages);
      }
    } catch (err) {
      setError('Failed to load coupons');
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingId) {
        const response = await axios.put(
          `/api/v1/payments/teacher/coupons/${editingId}/`,
          formData
        );
        if (response.data.success) {
          setCoupons((prev) =>
            prev.map((c) => (c.id === editingId ? response.data.coupon : c))
          );
          setShowForm(false);
          setEditingId(null);
          setFormData(getEmptyForm());
        }
      } else {
        const response = await axios.post(
          '/api/v1/payments/teacher/coupons/',
          formData
        );
        if (response.data.success) {
          setCoupons((prev) => [response.data.coupon, ...prev]);
          setShowForm(false);
          setFormData(getEmptyForm());
          if (response.data.warning) {
            alert('⚠️ ' + response.data.warning);
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon.id);
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      max_uses: coupon.max_uses,
      start_date: coupon.start_date,
      expiry_date: coupon.expiry_date,
      min_order_amount: coupon.min_order_amount,
      course_ids: coupon.course_ids || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        const response = await axios.delete(
          `/api/v1/payments/teacher/coupons/${couponId}/`
        );
        if (response.data.success) {
          setCoupons((prev) => prev.filter((c) => c.id !== couponId));
        }
      } catch (err) {
        setError('Failed to delete coupon');
        console.log(err)
      }
    }
  };

  const handleViewDetails = async (coupon) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/v1/payments/teacher/coupons/${coupon.id}/usage/`
      );

      if (response.data.success) {
        setSelectedCoupon(response.data);
        setShowDetails(true);
      }
    } catch (err) {
      setError('Failed to load coupon details');
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(getEmptyForm());
  };

  const getEmptyForm = () => ({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    max_uses: '',
    start_date: '',
    expiry_date: '',
    min_order_amount: '',
    course_ids: [],
  });

  const getStatusBadge = (status) => {
    const colors = {
      active: '#28a745',
      inactive: '#dc3545',
      expired: '#6c757d',
    };
    return colors[status] || '#6c757d';
  };

  return (
    <div className="teacher-coupon-manager">
      <div className="manager-header">
        <h3>My Coupons</h3>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
        >
          {showForm ? 'Cancel' : '+ Create Coupon'}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <div className="coupon-form-container">
          <h4>{editingId ? 'Edit Coupon' : 'Create New Coupon'}</h4>
          <form onSubmit={handleSubmit} className="coupon-form">
            <div className="form-row">
              <div className="form-group">
                <label>Coupon Code *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleFormChange}
                  placeholder="e.g., TEACHER50"
                  disabled={loading || editingId}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="e.g., Special discount for students"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Discount Type *</label>
                <select
                  name="discount_type"
                  value={formData.discount_type}
                  onChange={handleFormChange}
                  required
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed_amount">Fixed Amount</option>
                </select>
              </div>
              <div className="form-group">
                <label>Discount Value *</label>
                <input
                  type="number"
                  name="discount_value"
                  value={formData.discount_value}
                  onChange={handleFormChange}
                  placeholder={formData.discount_type === 'percentage' ? '30' : '3000'}
                  required
                />
              </div>
              <div className="form-group">
                <label>Max Uses</label>
                <input
                  type="number"
                  name="max_uses"
                  value={formData.max_uses}
                  onChange={handleFormChange}
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label>Min Order Amount</label>
                <input
                  type="number"
                  name="min_order_amount"
                  value={formData.min_order_amount}
                  onChange={handleFormChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="info-box">
              <p>📝 <strong>Note:</strong> Discounts above 70% require admin approval before activation.</p>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'Saving...' : 'Save Coupon'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showDetails && selectedCoupon && (
        <div className="details-modal">
          <div className="modal-overlay" onClick={() => setShowDetails(false)} />
          <div className="modal-content">
            <div className="modal-header">
              <h4>{selectedCoupon.coupon.code} - Usage Details</h4>
              <button className="close-btn" onClick={() => setShowDetails(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">Total Students</span>
                  <span className="stat-value">{selectedCoupon.total_uses}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Total Discount Given</span>
                  <span className="stat-value">₹{selectedCoupon.total_discount_given.toFixed(2)}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Average Discount</span>
                  <span className="stat-value">₹{selectedCoupon.average_discount.toFixed(2)}</span>
                </div>
              </div>

              {selectedCoupon.usage_log && selectedCoupon.usage_log.length > 0 && (
                <div className="usage-log">
                  <h5>Student Usage</h5>
                  <div className="log-items">
                    {selectedCoupon.usage_log.map((log, idx) => (
                      <div key={idx} className="log-item">
                        <div className="log-left">
                          <span className="student-name">{log.student_name}</span>
                          <span className="course-name">{log.course_name}</span>
                        </div>
                        <div className="log-right">
                          <span className="discount">-₹{log.discount_amount.toFixed(2)}</span>
                          <span className="date">
                            {new Date(log.applied_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {loading && !showDetails ? (
        <div className="loading">Loading your coupons...</div>
      ) : (
        <div className="coupons-list">
          {coupons.length === 0 ? (
            <div className="no-data">
              <p>You haven't created any coupons yet.</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                Create Your First Coupon
              </button>
            </div>
          ) : (
            coupons.map((coupon) => (
              <div key={coupon.id} className="coupon-card">
                <div className="coupon-header">
                  <div>
                    <div className="coupon-code">{coupon.code}</div>
                    <p className="coupon-description">{coupon.description}</p>
                  </div>
                  <span className="coupon-status" style={{ background: getStatusBadge(coupon.status) }}>
                    {coupon.status}
                  </span>
                </div>

                <div className="coupon-body">
                  <div className="coupon-details">
                    <div className="detail">
                      <span className="label">Discount:</span>
                      <span className="value">
                        {coupon.discount_value}
                        {coupon.discount_type === 'percentage' ? '%' : ' ₹'}
                      </span>
                    </div>
                    <div className="detail">
                      <span className="label">Uses:</span>
                      <span className="value">
                        {coupon.current_uses}/{coupon.max_uses || '∞'}
                      </span>
                    </div>
                    <div className="detail">
                      <span className="label">Valid:</span>
                      <span className="value">
                        {coupon.start_date || 'Now'} to {coupon.expiry_date}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="coupon-actions">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => handleViewDetails(coupon)}
                    disabled={loading}
                  >
                    Analytics
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEdit(coupon)}
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(coupon.id)}
                    disabled={loading}
                  >
                    Delete
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
        .teacher-coupon-manager {
          padding: 2rem;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .manager-header h3 {
          margin: 0;
          font-size: 1.5rem;
          color: #333;
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
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
        }

        .btn-success:hover:not(:disabled) {
          background: #218838;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #5a6268;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn-danger:hover:not(:disabled) {
          background: #c82333;
        }

        .btn-info {
          background: #17a2b8;
          color: white;
        }

        .btn-info:hover:not(:disabled) {
          background: #138496;
        }

        .btn-sm {
          padding: 0.35rem 0.75rem;
          font-size: 0.8rem;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

        .coupon-form-container {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .coupon-form-container h4 {
          margin-top: 0;
          color: #333;
        }

        .coupon-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #555;
        }

        .form-group input,
        .form-group select {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.95rem;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
        }

        .info-box {
          background: #e7f3ff;
          border: 1px solid #b3d9ff;
          border-radius: 4px;
          padding: 1rem;
          color: #004085;
          font-size: 0.9rem;
        }

        .info-box p {
          margin: 0;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .coupons-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .coupon-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .coupon-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .coupon-header {
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .coupon-code {
          font-size: 1.25rem;
          font-weight: bold;
          font-family: 'Courier New', monospace;
          letter-spacing: 1px;
          margin-bottom: 0.25rem;
        }

        .coupon-description {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .coupon-status {
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .coupon-body {
          padding: 1rem;
        }

        .coupon-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }

        .detail {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .detail .label {
          font-size: 0.75rem;
          color: #999;
          font-weight: 500;
          text-transform: uppercase;
        }

        .detail .value {
          font-size: 0.9rem;
          font-weight: 600;
          color: #333;
        }

        .coupon-actions {
          padding: 1rem;
          display: flex;
          gap: 0.5rem;
          border-top: 1px solid #eee;
        }

        .coupon-actions .btn {
          flex: 1;
        }

        .details-modal {
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
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
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
        }

        .modal-body {
          padding: 1.5rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
        }

        .stat-label {
          display: block;
          font-size: 0.8rem;
          opacity: 0.9;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .usage-log {
          margin-top: 1.5rem;
        }

        .usage-log h5 {
          margin-top: 0;
          color: #333;
        }

        .log-items {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .log-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 4px;
          border-left: 3px solid #007bff;
        }

        .log-left {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .student-name {
          font-weight: 600;
          color: #333;
          font-size: 0.9rem;
        }

        .course-name {
          font-size: 0.8rem;
          color: #666;
        }

        .log-right {
          text-align: right;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .discount {
          font-weight: 600;
          color: #28a745;
          font-size: 0.9rem;
        }

        .date {
          font-size: 0.75rem;
          color: #999;
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .no-data {
          text-align: center;
          padding: 2rem;
          background: white;
          border-radius: 8px;
        }

        .no-data p {
          color: #999;
          margin-bottom: 1rem;
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

        @media (max-width: 768px) {
          .coupons-list {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .coupon-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherCouponManager;
