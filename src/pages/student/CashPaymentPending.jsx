import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCreditCard, FaCheckCircle, FaClock, FaArrowLeft } from 'react-icons/fa';
import Notification from '../../components/common/Notification';

const CashPaymentPending = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const order = state?.order;
  const payment = state?.payment;

  useEffect(() => {
    if (!order || !payment) {
      navigate('/student/cart');
    }
  }, [order, payment, navigate]);

  if (!order || !payment) {
    return null;
  }

  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Notification
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        {/* Success Alert */}
        <div className="mb-8 p-6 bg-purple-50 border-2 border-purple-200 rounded-2xl text-center">
          <FaCheckCircle className="text-5xl text-purple-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-purple-900 mb-2">Cash Payment Order Created</h1>
          <p className="text-purple-700 text-lg">
            Your order has been created. Please complete the payment as instructed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Payment Status</h2>

              <div className="space-y-4">
                {/* Step 1 - Complete */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-600">
                      <FaCheckCircle className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-green-900">Order Created</p>
                    <p className="text-sm text-green-700">Your order has been registered in the system</p>
                  </div>
                </div>

                {/* Step 2 - In Progress */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600">
                      <FaClock className="text-white animate-spin" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-blue-900">Awaiting Payment</p>
                    <p className="text-sm text-blue-700">Please complete the cash payment as per the instructions below</p>
                  </div>
                </div>

                {/* Step 3 - Pending */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-300">
                      <span className="text-sm font-bold text-slate-600">3</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-slate-600">Verified & Activated</p>
                    <p className="text-sm text-slate-500">Your courses will be active once payment is verified</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span>💵</span> Payment Instructions
              </h2>

              <div className="space-y-6">
                {/* Location 1 */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Location 1: Main Office</h3>
                  <div className="space-y-2 text-slate-700">
                    <p><strong>Address:</strong> 123 Main Street, Colombo, Sri Lanka</p>
                    <p><strong>Phone:</strong> +94 11 234 5678</p>
                    <p><strong>Hours:</strong> 9:00 AM - 6:00 PM (Monday - Saturday)</p>
                    <p><strong>Person:</strong> Anuruddha Sir or Staff Members</p>
                  </div>
                </div>

                {/* Location 2 */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Location 2: Branch Office</h3>
                  <div className="space-y-2 text-slate-700">
                    <p><strong>Address:</strong> 456 Branch Lane, Kandy, Sri Lanka</p>
                    <p><strong>Phone:</strong> +94 81 123 4567</p>
                    <p><strong>Hours:</strong> 10:00 AM - 5:00 PM (Monday - Friday)</p>
                    <p><strong>Person:</strong> Available Staff Members</p>
                  </div>
                </div>

                {/* Payment Details Box */}
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-yellow-900 mb-2">Important Notes:</p>
                  <ul className="text-sm text-yellow-900 space-y-1 ml-4 list-disc">
                    <li>Keep your order number {order.number} for reference</li>
                    <li>Payment must match the total amount exactly</li>
                    <li>Request a receipt after payment</li>
                    <li>Your courses will be activated within 2-4 hours of payment</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What to Do Next</h2>
              <div className="space-y-3 text-slate-700">
                <div className="flex gap-3">
                  <span className="text-purple-600 font-bold">1.</span>
                  <span>Visit one of our offices and pay the total amount in cash</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-purple-600 font-bold">2.</span>
                  <span>Provide your order number: <strong>{order.number}</strong></span>
                </div>
                <div className="flex gap-3">
                  <span className="text-purple-600 font-bold">3.</span>
                  <span>Request a receipt and keep it for your records</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-purple-600 font-bold">4.</span>
                  <span>Your courses will be activated within 2-4 hours</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-purple-600 font-bold">5.</span>
                  <span>Check your dashboard to start learning</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-20">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>

              {/* Order Details */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">Order Number</p>
                <p className="font-bold text-slate-900 mt-2 break-all">{order.number}</p>
              </div>

              {/* Payment Status */}
              <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-600 font-semibold uppercase">Payment Method</p>
                <p className="font-bold text-purple-900 mt-2">💵 Cash Payment</p>
              </div>

              {/* Pricing */}
              <div className="space-y-3 border-b border-slate-200 pb-4 mb-4">
                <div className="flex justify-between text-slate-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">Rs. {order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-700 bg-green-50 p-2 rounded">
                    <span>Discount</span>
                    <span className="font-semibold">-Rs. {order.discount.toFixed(2)}</span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between text-slate-700">
                    <span>Tax</span>
                    <span className="font-semibold">Rs. {order.tax.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Total - Highlighted */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 mb-6 border border-purple-200">
                <p className="text-sm text-purple-600 font-semibold">Amount to Pay</p>
                <p className="text-4xl font-bold text-purple-900 mt-2">
                  Rs. {order.total.toFixed(2)}
                </p>
              </div>

              {/* Status Badge */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-center">
                <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">Status</p>
                <p className="text-lg font-bold text-yellow-900 mt-1">Awaiting Payment</p>
              </div>

              {/* Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/student/dashboard')}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => navigate('/student/courses')}
                  className="w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-bold py-3 rounded-lg transition"
                >
                  Browse Courses
                </button>
              </div>

              {/* Support */}
              <div className="mt-6 p-4 bg-slate-50 rounded-lg text-center">
                <p className="text-sm text-slate-600 mb-2">Need help?</p>
                <a href="mailto:support@anuruddhasir.lk" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashPaymentPending;
