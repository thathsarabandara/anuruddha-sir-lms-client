import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCreditCard, FaFileInvoice, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useCart, useCheckout } from '../../hooks/useCart';
import { cartAPI } from '../../api/cartApi';
import { CiBank } from 'react-icons/ci';

const CheckoutPage = () => {
  const navigate = useNavigate();
  useLocation();
  const { cart, loading: cartLoading } = useCart();
  const { checkout, loading: checkoutLoading, error } = useCheckout();
  
  const [paymentMethod, setPaymentMethod] = useState('payhere');
  const [tax] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [processing, setProcessing] = useState(false);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);
  const [bankSlipData, setBankSlipData] = useState({
    bankName: '',
    accountHolderName: '',
    transferDate: '',
    bankSlip: null
  });
  const [checkoutResult, setCheckoutResult] = useState(null);
  const [countdownTimer, setCountdownTimer] = useState(7);

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
      const response = await cartAPI.enrollFree(couponCode || null);
      if (response.data.success) {
        setCheckoutResult({
          type: 'success',
          title: 'Enrollment Successful! 🎉',
          message: response.data.message,
          enrollments: response.data.enrollments,
          order: response.data.order
        });
        setCountdownTimer(7);
        setProcessing(false);
      } else {
        setCheckoutResult({
          type: 'error',
          title: 'Enrollment Failed',
          message: response.data.message || 'Failed to complete free enrollment'
        });
        setCountdownTimer(7);
        setProcessing(false);
      }
    } catch (err) {
      setCheckoutResult({
        type: 'error',
        title: 'Enrollment Failed',
        message: err.response?.data?.message || 'An error occurred'
      });
      setCountdownTimer(7);
      setProcessing(false);
    }
  };

  // Handle coupon validation
  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      setCheckoutError('Please enter a coupon code');
      return;
    }

    setValidatingCoupon(true);
    try {
      const response = await cartAPI.validateCoupon(couponCode, cart.subtotal);
      if (response.data.success && response.data.valid) {
        setDiscountApplied({
          code: response.data.coupon.code,
          discount: parseFloat(response.data.discount_amount),
          message: response.data.message
        });
        setCheckoutError(null);
      } else {
        setCheckoutError(response.data.reason || 'Invalid coupon code');
        setDiscountApplied(null);
      }
    } catch (err) {
      setCheckoutError(err.response?.data?.reason || 'Failed to validate coupon');
      setDiscountApplied(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  // Handle PayHere payment
  const handlePayHerePayment = async () => {
    setProcessing(true);
    setCheckoutError(null);

    const result = await checkout(paymentMethod, couponCode || null, parseFloat(tax) || 0);

    if (result.success) {
      // Redirect to PayHere gateway
      if (result.paymentGateway) {
        // Store order data for reference
        sessionStorage.setItem('pendingOrder', JSON.stringify(result.order));
        sessionStorage.setItem('pendingPayment', JSON.stringify(result.payment));
        
        setCheckoutResult({
          type: 'success',
          title: 'Redirecting to PayHere',
          message: 'Please complete your payment on the PayHere gateway. You will be redirected shortly...',
          isPayHere: true
        });
        setCountdownTimer(7);
        
        // Redirect to PayHere after 2 seconds
        setTimeout(() => {
          window.location.href = result.paymentGateway.redirect_url;
        }, 2000);
      }
    } else {
      setCheckoutResult({
        type: 'error',
        title: 'Payment Initiation Failed',
        message: result.message || 'Failed to initiate PayHere payment'
      });
      setCountdownTimer(7);
      setProcessing(false);
    }
  };

  // Handle Bank Slip payment
  const handleBankSlipSubmit = async () => {
    if (!bankSlipData.bankName || !bankSlipData.accountHolderName || !bankSlipData.transferDate || !bankSlipData.bankSlip) {
      setCheckoutError('Please fill all bank slip fields');
      return;
    }

    setProcessing(true);
    setCheckoutError(null);

    try {
      const result = await checkout(paymentMethod, couponCode || null, parseFloat(tax) || 0);

      if (result.success) {
        // Upload bank slip
        const formData = new FormData();
        formData.append('order_id', result.order.id);
        formData.append('payment_id', result.payment.id);
        formData.append('bank_name', bankSlipData.bankName);
        formData.append('account_holder_name', bankSlipData.accountHolderName);
        formData.append('transfer_date', bankSlipData.transferDate);
        formData.append('bank_slip', bankSlipData.bankSlip);

        const uploadResponse = await cartAPI.uploadBankSlip(formData);

        if (uploadResponse.data.success) {
          setCheckoutResult({
            type: 'success',
            title: 'Bank Slip Uploaded Successfully! ✓',
            message: 'Your bank slip has been submitted for verification. You will be notified once it is verified. Your course access will be granted immediately upon verification.',
            order: result.order,
            payment: result.payment
          });
          setCountdownTimer(7);
          setProcessing(false);
        } else {
          setCheckoutResult({
            type: 'error',
            title: 'Upload Failed',
            message: uploadResponse.data.message || 'Failed to upload bank slip'
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
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
                onClick={() => setPaymentMethod('payhere')}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="radio"
                    value="payhere"
                    checked={paymentMethod === 'payhere'}
                    onChange={() => setPaymentMethod('payhere')}
                    className="mt-1 h-4 w-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCreditCard className="text-blue-600 text-lg" />
                      <h3 className="text-lg font-bold text-slate-900">PayHere (Card Payment)</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      Pay securely using your credit or debit card. Instant confirmation.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Visa</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Mastercard</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Mobile Money</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Transfer Option */}
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
                      <h3 className="text-lg font-bold text-slate-900">Bank Transfer</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      Transfer funds directly from your bank account. Upload the bank slip for verification.
                    </p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded inline-block">
                      Requires verification
                    </span>
                  </div>
                </div>
              </div>

              {/* Bank Slip Form */}
              {paymentMethod === 'bank' && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 mb-4 border border-green-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FaFileInvoice className="text-green-600" /> Bank Transfer Details
                  </h3>

                  <div className="space-y-4">
                    {/* Bank Name */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Bank Name *</label>
                      <input
                        type="text"
                        placeholder="e.g., Commercial Bank, Sampath Bank"
                        value={bankSlipData.bankName}
                        onChange={(e) => setBankSlipData({ ...bankSlipData, bankName: e.target.value })}
                        className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    {/* Account Holder Name */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Account Holder Name *</label>
                      <input
                        type="text"
                        placeholder="Name on your bank account"
                        value={bankSlipData.accountHolderName}
                        onChange={(e) => setBankSlipData({ ...bankSlipData, accountHolderName: e.target.value })}
                        className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    {/* Transfer Date */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Transfer Date *</label>
                      <input
                        type="date"
                        value={bankSlipData.transferDate}
                        onChange={(e) => setBankSlipData({ ...bankSlipData, transferDate: e.target.value })}
                        className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    {/* Bank Slip Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Bank Slip *</label>
                      <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-500 transition cursor-pointer">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => setBankSlipData({ ...bankSlipData, bankSlip: e.target.files[0] })}
                          className="hidden"
                          id="bank-slip-input"
                        />
                        <label htmlFor="bank-slip-input" className="cursor-pointer">
                          <FaFileInvoice className="text-4xl text-green-300 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-slate-700">
                            {bankSlipData.bankSlip ? bankSlipData.bankSlip.name : 'Click to upload bank slip'}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">PNG, JPG, PDF up to 10MB</p>
                        </label>
                      </div>
                    </div>
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
                <button
                  onClick={handleValidateCoupon}
                  disabled={validatingCoupon || !couponCode.trim()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold flex items-center gap-2"
                >
                  {validatingCoupon ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Validating...
                    </>
                  ) : (
                    'Apply'
                  )}
                </button>
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
              <button
                onClick={handleCheckout}
                disabled={processing || checkoutLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
              >
                {processing || checkoutLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Processing...
                  </>
                ) : isFreeCheckout ? (
                  <>
                    ✓ Enroll Free
                  </>
                ) : paymentMethod === 'payhere' ? (
                  <>
                    <FaCreditCard /> Pay with PayHere
                  </>
                ) : paymentMethod === 'bank' ? (
                  <>
                    <CiBank /> Complete Transfer
                  </>
                ) : null}
              </button>

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
