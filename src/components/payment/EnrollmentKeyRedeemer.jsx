import React, { useState } from 'react';
import axios from 'axios';

/**
 * EnrollmentKeyRedeemer Component
 * Allows students to redeem enrollment keys to enroll in courses
 * Can be free or with discount
 */
const EnrollmentKeyRedeemer = ({ onSuccess, onError }) => {
  const [keyCode, setKeyCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [enrollmentData, setEnrollmentData] = useState(null);

  const handleRedeemKey = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    setEnrollmentData(null);

    try {
      const response = await axios.post('/api/v1/payments/student/enrollment-keys/redeem/', {
        key_code: keyCode.trim().toUpperCase(),
      });

      if (response.data.success) {
        setEnrollmentData(response.data.enrollment);
        setSuccessMessage(response.data.message);
        setKeyCode('');
        
        if (onSuccess) {
          onSuccess(response.data.enrollment);
        }

        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to redeem enrollment key';
      setError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="enrollment-key-redeemer">
      <div className="redeemer-card">
        <h4 className="redeemer-title">
          <span className="icon">🔑</span>
          Have an Enrollment Key?
        </h4>
        <p className="redeemer-subtitle">
          Enter your enrollment key to enroll in a course for free or with a discount
        </p>

        <form onSubmit={handleRedeemKey} className="redeemer-form">
          <div className="form-group">
            <input
              type="text"
              value={keyCode}
              onChange={(e) => setKeyCode(e.target.value)}
              placeholder="Enter enrollment key (e.g., ENROLL-ABCD123XYZ)"
              className="form-control key-input"
              disabled={loading}
              maxLength="50"
            />
            <button
              type="submit"
              className="btn btn-success"
              disabled={!keyCode.trim() || loading}
            >
              {loading ? 'Redeeming...' : 'Redeem Key'}
            </button>
          </div>
        </form>

        {error && (
          <div className="alert alert-danger">
            <span className="error-icon">✕</span>
            {error}
          </div>
        )}

        {successMessage && enrollmentData && (
          <div className="alert alert-success">
            <div className="success-header">
              <span className="success-icon">✓</span>
              <strong>Enrollment Successful!</strong>
            </div>
            <div className="enrollment-details">
              <div className="detail-item">
                <span className="label">Course:</span>
                <span className="value">{enrollmentData.course_name}</span>
              </div>
              <div className="detail-item">
                <span className="label">Enrolled Date:</span>
                <span className="value">
                  {new Date(enrollmentData.enrolled_at).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Status:</span>
                <span className="badge badge-success">{enrollmentData.status}</span>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm btn-block"
              onClick={() => {
                window.location.href = `/courses/${enrollmentData.course_id}`;
              }}
            >
              Go to Course
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .enrollment-key-redeemer {
          width: 100%;
        }

        .redeemer-card {
          padding: 1.5rem;
          border: 2px solid #f0f0f0;
          border-radius: 8px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .redeemer-title {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
          color: #333;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .icon {
          font-size: 1.5rem;
        }

        .redeemer-subtitle {
          margin: 0 0 1.5rem 0;
          color: #666;
          font-size: 0.9rem;
        }

        .redeemer-form {
          width: 100%;
        }

        .form-group {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .key-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 2px solid #ddd;
          border-radius: 4px;
          font-size: 0.95rem;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.5px;
          transition: border-color 0.3s ease;
        }

        .key-input:focus {
          outline: none;
          border-color: #28a745;
          box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.25);
        }

        .key-input:disabled {
          background: #e9ecef;
          cursor: not-allowed;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-success {
          background: #28a745;
          color: white;
        }

        .btn-success:hover:not(:disabled) {
          background: #218838;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
        }

        .btn-primary {
          background: #007bff;
          color: white;
          width: 100%;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
        }

        .btn-block {
          width: 100%;
          display: block;
        }

        .alert {
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .alert-danger {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .error-icon {
          font-weight: bold;
          font-size: 1.2rem;
        }

        .alert-success {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
        }

        .success-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          font-size: 1rem;
        }

        .success-icon {
          font-size: 1.5rem;
          color: #28a745;
        }

        .enrollment-details {
          background: rgba(255, 255, 255, 0.7);
          padding: 1rem;
          border-radius: 4px;
          margin: 0.75rem 0;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          font-size: 0.9rem;
        }

        .detail-item .label {
          font-weight: 500;
          color: #555;
        }

        .detail-item .value {
          color: #333;
          font-weight: 500;
        }

        .badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .badge-success {
          background: #28a745;
          color: white;
        }

        @media (max-width: 640px) {
          .form-group {
            flex-direction: column;
          }

          .redeemer-card {
            padding: 1rem;
          }

          .redeemer-title {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default EnrollmentKeyRedeemer;
