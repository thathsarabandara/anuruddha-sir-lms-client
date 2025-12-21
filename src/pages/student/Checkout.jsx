import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaArrowLeft, FaTag, FaCheck, FaTrash } from 'react-icons/fa';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [orderStep, setOrderStep] = useState(1); // 1: Review, 2: Payment

  // Sample cart data
  const cartItems = [
    {
      id: 1,
      title: 'Advanced Algebra Mastery',
      price: 8500,
      quantity: 1
    },
    {
      id: 3,
      title: 'English Grammar Pro',
      price: 8000,
      quantity: 1
    }
  ];

  // Sample coupons
  const validCoupons = {
    'WELCOME10': { discount: 0.10, description: '10% Off on all courses' },
    'STUDENT15': { discount: 0.15, description: '15% Student Discount' },
    'SAVE20': { discount: 0.20, description: '20% Off on minimum Rs. 15,000' },
    'NEWYEAR50': { discount: 0.50, description: '50% off on one course' }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const couponDiscount = appliedCoupon ? subtotal * appliedCoupon.discount : 0;
  const tax = (subtotal - couponDiscount) * 0.1;
  const total = (subtotal - couponDiscount + tax);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() in validCoupons) {
      setAppliedCoupon({
        code: couponCode.toUpperCase(),
        ...validCoupons[couponCode.toUpperCase()]
      });
      setCouponCode('');
    } else {
      alert('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/student/cart')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4"
          >
            <FaArrowLeft /> Back to Cart
          </button>
          <h1 className="text-4xl font-bold text-slate-900">Checkout</h1>
          <p className="text-slate-600 mt-1">Complete your purchase</p>
        </div>

        {/* Checkout Steps */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setOrderStep(1)}
            className={`flex-1 py-3 rounded-lg font-bold transition-all ${
              orderStep === 1
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                : 'bg-white border-2 border-slate-200 text-slate-600'
            }`}
          >
            📋 Review Order
          </button>
          <button
            onClick={() => setOrderStep(2)}
            className={`flex-1 py-3 rounded-lg font-bold transition-all ${
              orderStep === 2
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                : 'bg-white border-2 border-slate-200 text-slate-600'
            }`}
          >
            💳 Payment
          </button>
        </div>

        {orderStep === 1 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Review Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Items</h2>
                
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">{item.title}</p>
                        <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-slate-900">Rs. {item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon Section */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <FaTag /> Apply Coupon Code
                </h2>

                {!appliedCoupon ? (
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg transition-all"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3">
                      <FaCheck className="text-green-600 text-xl" />
                      <div>
                        <p className="font-bold text-green-900">Coupon Applied!</p>
                        <p className="text-sm text-green-700">{appliedCoupon.code} - {appliedCoupon.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="p-2 hover:bg-green-100 rounded-lg transition-all"
                    >
                      <FaTrash className="text-green-600" />
                    </button>
                  </div>
                )}

                {/* Coupon Suggestions */}
                {!appliedCoupon && (
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <p className="text-sm font-semibold text-slate-600 mb-3">Available Coupons:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(validCoupons).map(([code, details]) => (
                        <button
                          key={code}
                          onClick={() => {
                            setCouponCode(code);
                            setAppliedCoupon({
                              code,
                              ...details
                            });
                          }}
                          className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-left transition-all text-sm"
                        >
                          <p className="font-bold text-slate-900">{code}</p>
                          <p className="text-xs text-slate-600">{details.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-20">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold text-slate-900">Rs. {subtotal}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                    <span className="text-slate-600">Discount ({(appliedCoupon.discount * 100).toFixed(0)}%)</span>
                    <span className="font-semibold text-green-600">-Rs. {couponDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                  <span className="text-slate-600">Tax (10%)</span>
                  <span className="font-semibold text-slate-900">Rs. {tax.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">Rs. {total.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => setOrderStep(2)}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg transition-all transform hover:scale-105"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <FaCreditCard /> Payment Details
                </h2>

                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Card Details */}
                  <div className="pt-6 border-t border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-4">Card Information</h3>

                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="pt-6 border-t border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-4">Payment Method</h3>
                    <div className="space-y-3">
                      {['Credit Card', 'Debit Card', 'Online Banking', 'Mobile Payment'].map(method => (
                        <label key={method} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-blue-50 cursor-pointer">
                          <input type="radio" name="payment" defaultChecked={method === 'Credit Card'} />
                          <span className="font-semibold text-slate-900">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-20">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-600">{item.title}</span>
                      <span className="font-semibold text-slate-900">Rs. {item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold text-slate-900">Rs. {subtotal}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200">
                    <span className="text-slate-600">Discount</span>
                    <span className="font-semibold text-green-600">-Rs. {couponDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                  <span className="text-slate-600">Tax</span>
                  <span className="font-semibold text-slate-900">Rs. {tax.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between mb-8">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">Rs. {total.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => navigate('/student/dashboard')}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 mb-3"
                >
                  ✓ Complete Payment
                </button>

                <button
                  onClick={() => setOrderStep(1)}
                  className="w-full py-3 border-2 border-slate-300 text-slate-600 hover:bg-slate-50 font-bold rounded-lg transition-all"
                >
                  Back to Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
