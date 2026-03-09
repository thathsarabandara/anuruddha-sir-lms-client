import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * AdminCouponManager Component
 * Admin interface to create, list, edit, and delete coupons
 * Can apply to any courses and manage system-wide discounts
 */
const AdminCouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
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
    applicable_to: 'all_courses',
    course_ids: [],
  });

  // Fetch coupons
  useEffect(() => {
    fetchCoupons();
  }, [filterStatus, page]);

  const fetchCoupons = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      params.append('page', page);

      const response = await axios.get(
        `/api/v1/payments/admin/coupons/?${params.toString()}`
      );

      if (response.data.success) {
        setCoupons(response.data.coupons);
        setTotalPages(response.data.total_pages);
      }
    } catch (err) {
      setError('Failed to load coupons');
      console.log(err);
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
        // Update coupon
        const response = await axios.put(
          `/api/v1/payments/admin/coupons/${editingId}/`,
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
        // Create coupon
        const response = await axios.post('/api/v1/payments/admin/coupons/', formData);
        if (response.data.success) {
          setCoupons((prev) => [response.data.coupon, ...prev]);
          setShowForm(false);
          setFormData(getEmptyForm());
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
      applicable_to: coupon.applicable_to,
      course_ids: coupon.course_ids || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        const response = await axios.delete(
          `/api/v1/payments/admin/coupons/${couponId}/`
        );
        if (response.data.success) {
          setCoupons((prev) => prev.filter((c) => c.id !== couponId));
        }
      } catch (err) {
        setError('Failed to delete coupon');
        console.log(err);
      }
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
    applicable_to: 'all_courses',
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
    <div className="admin-coupon-manager">
      <div className="manager-header">
        <h3>Coupon Management</h3>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
        >
          {showForm ? 'Cancel' : '+ New Coupon'}
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
                  placeholder="e.g., SAVE50"
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
                  placeholder="e.g., 50% off all courses"
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
                  placeholder={formData.discount_type === 'percentage' ? '50' : '5000'}
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

            <div className="form-group">
              <label>Applicable To *</label>
              <select
                name="applicable_to"
                value={formData.applicable_to}
                onChange={handleFormChange}
                required
              >
                <option value="all_courses">All Courses</option>
                <option value="specific_courses">Specific Courses</option>
              </select>
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

      <div className="filters">
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading coupons...</div>
      ) : (
        <div className="coupons-list">
          {coupons.length === 0 ? (
            <div className="no-data">No coupons found</div>
          ) : (
            coupons.map((coupon) => (
              <div key={coupon.id} className="coupon-card">
                <div className="coupon-header">
                  <div className="coupon-code">{coupon.code}</div>
                  <span className="coupon-status" style={{ background: getStatusBadge(coupon.status) }}>
                    {coupon.status}
                  </span>
                </div>

                <div className="coupon-body">
                  <p className="coupon-description">{coupon.description}</p>
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
                        {coupon.start_date} to {coupon.expiry_date}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="coupon-actions">
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
        .admin-coupon-manager {
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
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .filters {
          margin-bottom: 1.5rem;
        }

        .filter-select {
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
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
          align-items: center;
        }

        .coupon-code {
          font-size: 1.25rem;
          font-weight: bold;
          font-family: 'Courier New', monospace;
          letter-spacing: 1px;
        }

        .coupon-status {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
        }

        .coupon-body {
          padding: 1rem;
        }

        .coupon-description {
          margin: 0 0 1rem 0;
          color: #666;
          font-size: 0.9rem;
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

        .loading {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .no-data {
          text-align: center;
          padding: 2rem;
          color: #999;
          background: white;
          border-radius: 8px;
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
        }
      `}</style>
    </div>
  );
};

export default AdminCouponManager;
