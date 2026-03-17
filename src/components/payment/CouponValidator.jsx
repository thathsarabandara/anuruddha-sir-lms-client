import React, { useState } from 'react';
import axios from 'axios';

/**
 * CouponValidator Component
 * Allows students to validate and apply coupon codes before checkout
 * Supports percentage and fixed amount discounts
 */
const CouponValidator = ({ cartSubtotal, courseIds, onCouponApplied, onError }) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [error, setError] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(cartSubtotal);

  const handleValidateCoupon = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/v1/payments/student/coupons/validate/', {
        coupon_code: couponCode,
        cart_subtotal: cartSubtotal,
        course_ids: courseIds,
      });

      if (response.data.valid) {
        setAppliedCoupon(response.data.coupon);
        setDiscountAmount(response.data.discount_amount);
        setFinalTotal(response.data.final_total);
        
        // Call parent component callback
        if (onCouponApplied) {
          onCouponApplied({
            coupon_id: response.data.coupon.id,
            discount_amount: response.data.discount_amount,
            final_total: response.data.final_total,
          });
        }
      } else {
        setError(response.data.reason || 'Invalid coupon code');
        if (onError) onError(response.data.reason);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to validate coupon';
      setError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setDiscountAmount(0);
    setFinalTotal(cartSubtotal);
    setError('');
    
    if (onCouponApplied) {
      onCouponApplied(null);
    }
  };

  return (
    <div className="coupon-validator">
      {!appliedCoupon ? (
        <form onSubmit={handleValidateCoupon} className="coupon-form">
          <div className="form-group">
            <label htmlFor="couponCode">Have a coupon code?</label>
            <div className="input-group">
              <input
                type="text"
                id="couponCode"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code (e.g., WELCOME10)"
                className="form-control"
                disabled={loading}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!couponCode || loading}
              >
                {loading ? 'Validating...' : 'Apply'}
              </button>
            </div>
          </div>
          {error && <div className="alert alert-danger mt-2">{error}</div>}
        </form>
      ) : (
        <div className="coupon-applied">
          <div className="coupon-success">
            <div className="coupon-badge">✓</div>
            <div className="coupon-details">
              <h5>Coupon Applied!</h5>
              <p className="coupon-code">{appliedCoupon.code}</p>
              <p className="coupon-description">{appliedCoupon.description}</p>
            </div>
            <button
              type="button"
              className="btn btn-link text-danger"
              onClick={handleRemoveCoupon}
            >
              Remove
            </button>
          </div>

          <div className="discount-breakdown">
            <div className="row">
              <div className="col-6">
                <span>Subtotal:</span>
              </div>
              <div className="col-6 text-end">
                <span className="amount">Rs. {cartSubtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="row discount-row">
              <div className="col-6">
                <span className="discount-label">
                  Discount ({appliedCoupon.discount_type === 'percentage' ? `${appliedCoupon.discount_value}%` : 'Fixed'})
                </span>
              </div>
              <div className="col-6 text-end">
                <span className="discount-amount">
                  -Rs. {discountAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="row total-row">
              <div className="col-6">
                <strong>Total Amount:</strong>
              </div>
              <div className="col-6 text-end">
                <strong className="total-amount">Rs. {finalTotal.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .coupon-validator {
          padding: 1rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: #f9f9f9;
        }

        .coupon-form {
          width: 100%;
        }

        .form-group {
          margin-bottom: 0;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }

        .input-group {
          display: flex;
          gap: 0.5rem;
        }

        .form-control {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        .form-control:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
        }

        .form-control:disabled {
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
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
        }

        .alert {
          padding: 0.75rem;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .alert-danger {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
        }

        .coupon-applied {
          width: 100%;
        }

        .coupon-success {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 4px;
          margin-bottom: 1rem;
        }

        .coupon-badge {
          width: 40px;
          height: 40px;
          min-width: 40px;
          background: #28a745;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.5rem;
        }

        .coupon-details {
          flex: 1;
        }

        .coupon-details h5 {
          margin: 0;
          font-size: 1rem;
          color: #155724;
        }

        .coupon-code {
          margin: 0.25rem 0;
          font-weight: 600;
          color: #155724;
        }

        .coupon-description {
          margin: 0;
          font-size: 0.85rem;
          color: #155724;
        }

        .btn-link {
          background: none;
          border: none;
          padding: 0;
          font-size: 0.9rem;
          text-decoration: underline;
        }

        .btn-link:hover {
          text-decoration: none;
        }

        .discount-breakdown {
          padding: 1rem;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
        }

        .row {
          display: flex;
          margin-bottom: 0.75rem;
          align-items: center;
        }

        .row:last-child {
          margin-bottom: 0;
        }

        .col-6 {
          flex: 1;
        }

        .text-end {
          text-align: right;
        }

        .amount {
          color: #555;
          font-weight: 500;
        }

        .discount-row {
          color: #28a745;
          border-top: 1px solid #e0e0e0;
          border-bottom: 1px solid #e0e0e0;
          padding: 0.75rem 0;
          margin: 0.75rem 0;
        }

        .discount-label {
          font-weight: 500;
        }

        .discount-amount {
          font-weight: 600;
          color: #28a745;
        }

        .total-row {
          font-size: 1.1rem;
          color: #333;
          padding-top: 0.75rem;
        }

        .total-amount {
          color: #007bff;
          font-size: 1.25rem;
        }
      `}</style>
    </div>
  );
};

export default CouponValidator;
