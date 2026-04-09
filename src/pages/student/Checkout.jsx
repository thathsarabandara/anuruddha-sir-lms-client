import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCreditCard, FaFileInvoice, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useCart, useCheckout } from '../../hooks/useCart';
import paymentAPI from '../../api/payment';
import { CiBank } from 'react-icons/ci';
import Notification from '../../components/common/Notification';
import ButtonWithLoader from '../../components/common/ButtonWithLoader';

const CheckoutPage = () => {
  const navigate = useNavigate();
  useLocation();
  const { cart, loading: cartLoading } = useCart();
  const { checkout, loading: checkoutLoading, error } = useCheckout();
  
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [tax] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [processing, setProcessing] = useState(false);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);
  const [bankSlipData, setBankSlipData] = useState({
    bankSlip: null
  });
  const [checkoutResult, setCheckoutResult] = useState(null);
  const [countdownTimer, setCountdownTimer] = useState(7);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  // Handle countdown and auto-navigate after success/failure
  useEffect(() => {
    if (!checkoutResult) return;

    const timer = setInterval(() => {
      setCountdownTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/student/courses');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [checkoutResult, navigate]);

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/student/cart')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8"
          >
            <FaArrowLeft /> Back to Cart
          </button>
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <p className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</p>
            <p className="text-slate-600 mb-6">Add courses to proceed with checkout</p>
            <button
              onClick={() => navigate('/student/courses')}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
            >
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalAmount = (cart.subtotal + parseFloat(tax || 0) - (discountApplied?.discount || 0)).toFixed(2);
  const isFreeCheckout = parseFloat(totalAmount) === 0;

  // Handle free course enrollment
  const handleFreeEnrollment = async () => {
    setProcessing(true);
    setCheckoutError(null);

    try {
      const result = await checkout('free', couponCode || null, parseFloat(tax) || 0);

      if (result.success) {
        showNotification('Enrolled successfully!', 'success');
        setCheckoutResult({
          type: 'success',
          title: 'Enrollment Successful! 🎉',
          message: result.message || 'You have been enrolled in the course(s)',
          enrollments: result.enrollments || [],
          order: result.order,
          payment: result.payment,
        });
        setCountdownTimer(7);
      } else {
        setCheckoutResult({
          type: 'error',
          title: 'Enrollment Failed',
          message: result.message || 'Unable to complete checkout',
        });
        setCountdownTimer(7);
      }
    } finally {
      setProcessing(false);
    }
  };

  // Handle coupon validation
  const handleValidateCoupon = () => {
    if (!couponCode.trim()) {
      setCheckoutError('Please enter a coupon code');
      return;
    }

    setValidatingCoupon(true);
    // Simulate coupon validation with dummy data
    setTimeout(() => {
      setDiscountApplied({
        code: couponCode,
        discount: 10,
        message: 'Coupon applied successfully!'
      });
      showNotification('Coupon applied successfully!', 'success');
      setCheckoutError(null);
      setValidatingCoupon(false);
    }, 500);
  };

  // Handle PayHere payment
  const handlePayHerePayment = async () => {
    setCheckoutError('PayHere is coming soon. Please use Bank Deposit.');
  };

  // Handle Bank Deposit payment
  const handleBankSlipSubmit = async () => {
    if (!bankSlipData.bankSlip) {
      setCheckoutError('Please upload a bank deposit receipt');
      return;
    }

    setProcessing(true);
    setCheckoutError(null);

    try {
      const result = await checkout(paymentMethod, couponCode || null, parseFloat(tax) || 0);

      if (result.success) {
        // Upload deposit receipt via payment API
        const formData = new FormData();
        formData.append('transaction_id', result.payment.id);
        formData.append('receipt_image', bankSlipData.bankSlip);

        const uploadResponse = await paymentAPI.uploadStudentReceipt(formData);

        if (uploadResponse?.data?.status === 'success') {
          showNotification('Bank deposit uploaded successfully!', 'success');
          setCheckoutResult({
            type: 'success',
            title: 'Bank Deposit Uploaded',
            message: 'Your deposit receipt has been submitted for verification.',
            order: result.order,
            payment: result.payment
          });
          setCountdownTimer(7);
          setProcessing(false);
        } else {
          setCheckoutResult({
            type: 'error',
            title: 'Upload Failed',
            message: uploadResponse?.data?.message || 'Failed to upload deposit receipt'
          });
          setCountdownTimer(7);
          setProcessing(false);
        }
      } else {
        setCheckoutResult({
          type: 'error',
          title: 'Checkout Failed',
          message: result.message || 'Checkout failed'
        });
        setCountdownTimer(7);
        setProcessing(false);
      }
    } catch (err) {
      setCheckoutResult({
        type: 'error',
        title: 'An Error Occurred',
        message: err.response?.data?.message || 'An error occurred'
      });
      setCountdownTimer(7);
      setProcessing(false);
    }
  };

  const handleCheckout = async () => {
    if (isFreeCheckout) {
      await handleFreeEnrollment();
    } else if (paymentMethod === 'payhere') {
      await handlePayHerePayment();
    } else if (paymentMethod === 'bank') {
      await handleBankSlipSubmit();
    }
  };

  // Result Modal Component
  const ResultModal = () => {
    if (!checkoutResult) return null;

    const isSuccess = checkoutResult.type === 'success';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all ${
          isSuccess ? 'border-t-4 border-green-500' : 'border-t-4 border-red-500'
        }`}>
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {isSuccess ? (
              <FaCheckCircle className="text-6xl text-green-500 animate-bounce" />
            ) : (
              <FaTimesCircle className="text-6xl text-red-500 animate-pulse" />
            )}
          </div>

          {/* Title */}
          <h2 className={`text-2xl font-bold text-center mb-3 ${
            isSuccess ? 'text-green-700' : 'text-red-700'
          }`}>
            {checkoutResult.title}
          </h2>

          {/* Message */}
          <p className="text-slate-600 text-center mb-6 leading-relaxed">
            {checkoutResult.message}
          </p>

          {/* Enrollments List (for free enrollment) */}
          {isSuccess && checkoutResult.enrollments && checkoutResult.enrollments.length > 0 && (
            <div className="mb-6 bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-green-900 mb-3">Enrolled Courses:</h3>
              <ul className="space-y-2">
                {checkoutResult.enrollments.map((enrollment) => (
                  <li key={enrollment.id} className="flex items-start gap-2 text-sm text-green-800">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>{enrollment.course_title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Countdown */}
          <div className={`text-center mb-6 p-4 rounded-lg ${
            isSuccess ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <p className="font-semibold">
              Redirecting to Courses in <span className="text-2xl font-bold">{countdownTimer}</span> seconds
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/student/courses')}
              className={`flex-1 py-3 rounded-lg font-bold transition ${
                isSuccess
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              Go to Courses Now
            </button>
            {!isSuccess && (
              <button
                onClick={() => setCheckoutResult(null)}
                className="flex-1 py-3 rounded-lg font-bold border-2 border-slate-300 text-slate-700 hover:bg-slate-50 transition"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
      {notification && (
        <div className="mb-4">
          <Notification
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
      {/* Result Modal */}
      <ResultModal />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/student/cart')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8"
        >
          <FaArrowLeft /> Back to Cart
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Checkout</h1>
          <p className="text-slate-600 mt-2">Complete your purchase securely</p>
        </div>

        {/* Error Alert */}
        {(checkoutError || error) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex justify-between items-center">
            <span className="font-semibold">{checkoutError || error}</span>
            <button
              onClick={() => {
                setCheckoutError(null);
              }}
              className="text-red-600 hover:text-red-700 text-xl"
            >
              ✕
            </button>
          </div>
        )}

        {/* Success Alert */}
        {discountApplied && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            ✓ {discountApplied.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            {!isFreeCheckout && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Select Payment Method</h2>

              {/* PayHere Option */}
              <div
                className={`p-6 rounded-xl border-2 mb-4 cursor-pointer transition ${
                  paymentMethod === 'payhere'
                    ? 'border-slate-300 bg-slate-50'
                    : 'border-slate-200 bg-slate-50'
                }`}
                onClick={() => setCheckoutError('PayHere is coming soon. Please use Bank Deposit.')}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="radio"
                    value="payhere"
                    checked={paymentMethod === 'payhere'}
                    onChange={() => setCheckoutError('PayHere is coming soon. Please use Bank Deposit.')}
                    disabled
                    className="mt-1 h-4 w-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCreditCard className="text-slate-400 text-lg" />
                      <h3 className="text-lg font-bold text-slate-700">PayHere (Coming Soon)</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      Card payments will be available soon.
                    </p>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded inline-block">Coming soon</span>
                  </div>
                </div>
              </div>

              {/* Bank Deposit Option */}
              <div
                className={`p-6 rounded-xl border-2 mb-4 cursor-pointer transition ${
                  paymentMethod === 'bank'
                    ? 'border-green-600 bg-green-50'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
                onClick={() => setPaymentMethod('bank')}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="radio"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={() => setPaymentMethod('bank')}
                    className="mt-1 h-4 w-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CiBank className="text-green-600 text-lg" />
                      <h3 className="text-lg font-bold text-slate-900">Bank Deposit</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      Upload a clear deposit receipt image for verification.
                    </p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded inline-block">
                      Requires verification
                    </span>
                  </div>
                </div>
              </div>

              {/* Deposit Slip Upload */}
              {paymentMethod === 'bank' && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 mb-4 border border-green-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FaFileInvoice className="text-green-600" /> Upload Deposit Receipt
                  </h3>

                  <div className="border-2 border-dashed border-green-300 rounded-xl p-5 text-center bg-white/70">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setBankSlipData({ bankSlip: e.target.files[0] || null })}
                      className="hidden"
                      id="bank-slip-input"
                    />
                    <label htmlFor="bank-slip-input" className="cursor-pointer block">
                      <FaFileInvoice className="text-4xl text-green-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-800">
                        {bankSlipData.bankSlip ? bankSlipData.bankSlip.name : 'Click to upload receipt image'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Images only</p>
                    </label>
                  </div>
                </div>
              )}
            </div>
            )}

            {/* Coupon Section */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Apply Coupon Code (Optional)</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <ButtonWithLoader
                  label="Apply"
                  loadingLabel="Validating..."
                  isLoading={validatingCoupon}
                  onClick={handleValidateCoupon}
                  disabled={!couponCode.trim()}
                  variant="primary"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-20">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto border-b border-slate-200 pb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-sm line-clamp-2">{item.course.title}</p>
                      <p className="text-xs text-slate-500">{item.course.teacher}</p>
                    </div>
                    <p className="font-bold text-slate-900 whitespace-nowrap">Rs. {item.price_at_addition.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="space-y-3 border-b border-slate-200 pb-4 mb-4">
                <div className="flex justify-between text-slate-700">
                  <span>Subtotal ({cart.item_count} items)</span>
                  <span className="font-semibold">Rs. {cart.subtotal.toFixed(2)}</span>
                </div>

                {discountApplied && (
                  <div className="flex justify-between text-green-700 bg-green-50 p-2 rounded">
                    <span>Discount ({discountApplied.code})</span>
                    <span className="font-semibold">-Rs. {discountApplied.discount.toFixed(2)}</span>
                  </div>
                )}

                {parseFloat(tax) > 0 && (
                  <div className="flex justify-between text-slate-700">
                    <span>Tax</span>
                    <span className="font-semibold">Rs. {parseFloat(tax).toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6 pb-4">
                <span className="text-lg font-bold text-slate-900">Total Amount</span>
                <span className="text-3xl font-bold text-blue-600">Rs. {totalAmount}</span>
              </div>

              {/* Payment Button */}
              <ButtonWithLoader
                label={isFreeCheckout ? "✓ Enroll Free" : paymentMethod === 'payhere' ? "Pay with PayHere" : "Complete Transfer"}
                loadingLabel="Processing..."
                isLoading={processing || checkoutLoading}
                onClick={handleCheckout}
                variant="primary"
                fullWidth
                size="lg"
              />

              {/* Info */}
              <p className="text-xs text-slate-500 text-center mt-4">
                Your payment is secure and encrypted. No card details are stored on our server.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
