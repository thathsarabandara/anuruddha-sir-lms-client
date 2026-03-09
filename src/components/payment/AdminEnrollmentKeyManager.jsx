import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * AdminEnrollmentKeyManager Component
 * Admin interface to create, manage, and track enrollment keys system-wide
 * Can generate bulk keys and monitor usage analytics
 */
const AdminEnrollmentKeyManager = () => {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedKey, setSelectedKey] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [formData, setFormData] = useState({
    course_id: '',
    discount_type: 'free',
    discount_value: '',
    quantity: '1',
    expiry_days: '30',
    max_uses_per_key: '1',
  });

  useEffect(() => {
    fetchKeys();
  }, [page]);

  const fetchKeys = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `/api/v1/payments/admin/enrollment-keys/?page=${page}`
      );

      if (response.data.success) {
        setKeys(response.data.keys);
        setTotalPages(response.data.total_pages);
      }
    } catch (err) {
      setError('Failed to load enrollment keys');
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
      const response = await axios.post(
        '/api/v1/payments/admin/enrollment-keys/',
        formData
      );

      if (response.data.success) {
        // Refresh list
        setFormData({
          course_id: '',
          discount_type: 'free',
          discount_value: '',
          quantity: '1',
          expiry_days: '30',
          max_uses_per_key: '1',
        });
        setShowForm(false);
        fetchKeys();
        alert(
          `${response.data.keys_generated} enrollment keys created successfully!`
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create enrollment keys');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (key) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/v1/payments/admin/enrollment-keys/${key.id}/`
      );

      if (response.data.success) {
        setSelectedKey(response.data.key_details);
        setShowDetails(true);
      }
    } catch (err) {
      setError('Failed to load key details');
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: '#28a745',
      used: '#007bff',
      expired: '#6c757d',
      revoked: '#dc3545',
    };
    return colors[status] || '#6c757d';
  };

  return (
    <div className="admin-enrollment-key-manager">
      <div className="manager-header">
        <h3>Enrollment Key Management</h3>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
        >
          {showForm ? 'Cancel' : '+ Generate Keys'}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <div className="key-form-container">
          <h4>Generate Enrollment Keys</h4>
          <form onSubmit={handleSubmit} className="key-form">
            <div className="form-row">
              <div className="form-group">
                <label>Course *</label>
                <select
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select a course...</option>
                  <option value="course-1">Course 1</option>
                  <option value="course-2">Course 2</option>
                </select>
              </div>
              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleFormChange}
                  min="1"
                  max="1000"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Type *</label>
                <select
                  name="discount_type"
                  value={formData.discount_type}
                  onChange={handleFormChange}
                  required
                >
                  <option value="free">Free Enrollment</option>
                  <option value="discount">Discount</option>
                </select>
              </div>
              {formData.discount_type === 'discount' && (
                <div className="form-group">
                  <label>Discount Value *</label>
                  <input
                    type="number"
                    name="discount_value"
                    value={formData.discount_value}
                    onChange={handleFormChange}
                    placeholder="e.g., 500"
                    required
                  />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiry (Days) *</label>
                <input
                  type="number"
                  name="expiry_days"
                  value={formData.expiry_days}
                  onChange={handleFormChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Max Uses Per Key *</label>
                <input
                  type="number"
                  name="max_uses_per_key"
                  value={formData.max_uses_per_key}
                  onChange={handleFormChange}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'Generating...' : 'Generate Keys'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showDetails && selectedKey && (
        <div className="key-details-modal">
          <div className="modal-overlay" onClick={() => setShowDetails(false)} />
          <div className="modal-content">
            <div className="modal-header">
              <h4>Key Details</h4>
              <button
                className="close-btn"
                onClick={() => setShowDetails(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-group">
                <span className="label">Key Code:</span>
                <code className="key-code">{selectedKey.key_code}</code>
              </div>
              <div className="detail-group">
                <span className="label">Course:</span>
                <span className="value">{selectedKey.course_name}</span>
              </div>
              <div className="detail-group">
                <span className="label">Status:</span>
                <span
                  className="status-badge"
                  style={{ background: getStatusColor(selectedKey.status) }}
                >
                  {selectedKey.status}
                </span>
              </div>
              <div className="detail-group">
                <span className="label">Created:</span>
                <span className="value">
                  {new Date(selectedKey.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-group">
                <span className="label">Expires:</span>
                <span className="value">
                  {new Date(selectedKey.expiry_date).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-group">
                <span className="label">Usage:</span>
                <span className="value">
                  {selectedKey.used_by_count}/{selectedKey.max_uses} times
                </span>
              </div>

              {selectedKey.used_by && selectedKey.used_by.length > 0 && (
                <div className="usage-history">
                  <h5>Used By:</h5>
                  <div className="usage-list">
                    {selectedKey.used_by.map((student, idx) => (
                      <div key={idx} className="usage-item">
                        <span>{student.name}</span>
                        <span className="date">
                          {new Date(student.redeemed_at).toLocaleDateString()}
                        </span>
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
        <div className="loading">Loading enrollment keys...</div>
      ) : (
        <div className="keys-table">
          <div className="table-header">
            <div className="col-code">Key Code</div>
            <div className="col-course">Course</div>
            <div className="col-status">Status</div>
            <div className="col-usage">Usage</div>
            <div className="col-expiry">Expiry Date</div>
            <div className="col-actions">Actions</div>
          </div>

          <div className="table-body">
            {keys.length === 0 ? (
              <div className="no-data">No enrollment keys generated yet</div>
            ) : (
              keys.map((key) => (
                <div key={key.id} className="table-row">
                  <div className="col-code">
                    <code>{key.key_code}</code>
                  </div>
                  <div className="col-course">{key.course_name}</div>
                  <div className="col-status">
                    <span
                      className="status-badge"
                      style={{ background: getStatusColor(key.status) }}
                    >
                      {key.status}
                    </span>
                  </div>
                  <div className="col-usage">
                    {key.used_by_count}/{key.max_uses}
                  </div>
                  <div className="col-expiry">
                    {new Date(key.expiry_date).toLocaleDateString()}
                  </div>
                  <div className="col-actions">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleViewDetails(key)}
                      disabled={loading}
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
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
        .admin-enrollment-key-manager {
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

        .key-form-container {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .key-form-container h4 {
          margin-top: 0;
          color: #333;
        }

        .key-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .keys-table {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .table-header,
        .table-row {
          display: grid;
          grid-template-columns: 150px 150px 120px 80px 150px 100px;
          gap: 1rem;
          padding: 1rem;
          align-items: center;
          border-bottom: 1px solid #eee;
        }

        .table-header {
          background: #f8f9fa;
          font-weight: 600;
          color: #555;
          border-bottom: 2px solid #dee2e6;
        }

        .table-row:hover {
          background: #f5f5f5;
        }

        .col-code code {
          background: #f0f0f0;
          padding: 0.25rem 0.5rem;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 0.85rem;
        }

        .status-badge {
          display: inline-block;
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
        }

        .key-details-modal {
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
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          color: #333;
        }

        .modal-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .detail-group {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 4px;
        }

        .detail-group .label {
          font-weight: 600;
          color: #555;
        }

        .detail-group .value {
          color: #333;
        }

        .key-code {
          background: #fff3cd;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 1rem;
          font-weight: bold;
        }

        .usage-history {
          margin-top: 1rem;
          padding: 1rem;
          background: #e8f5e9;
          border-radius: 4px;
        }

        .usage-history h5 {
          margin-top: 0;
          color: #333;
        }

        .usage-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .usage-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem;
          background: white;
          border-radius: 3px;
          font-size: 0.9rem;
        }

        .usage-item .date {
          color: #999;
          font-size: 0.85rem;
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
          .table-header,
          .table-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminEnrollmentKeyManager;
