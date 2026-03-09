import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaClock, FaArrowLeft, FaDownload } from 'react-icons/fa';
import { CiBank } from 'react-icons/ci';

const BankTransferPending = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [copySuccess, setCopySuccess] = useState(null);

  const order = state?.order;
  const payment = state?.payment;
  const bankDetails = state?.bankDetails;

  useEffect(() => {
    if (!order || !payment || !bankDetails) {
      navigate('/student/cart');
    }
  }, [order, payment, bankDetails, navigate]);

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess('Copied!');
    setTimeout(() => setCopySuccess(null), 2000);
  };

  if (!order || !payment) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        {/* Success Alert */}
        <div className="mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-2xl text-center">
          <FaCheckCircle className="text-5xl text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-900 mb-2">Bank Slip Received</h1>
          <p className="text-green-700 text-lg">
            Your bank transfer has been recorded. We're verifying your payment.
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
                    <p className="text-lg font-semibold text-green-900">Bank Slip Uploaded</p>
                    <p className="text-sm text-green-700">Your bank slip has been successfully submitted</p>
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
                    <p className="text-lg font-semibold text-blue-900">Under Verification</p>
                    <p className="text-sm text-blue-700">Our team is verifying your payment (usually within 24 hours)</p>
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
                    <p className="text-lg font-semibold text-slate-600">Confirmed</p>
                    <p className="text-sm text-slate-500">Your courses will be active once payment is confirmed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Transfer Information */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CiBank className="text-green-600" /> Bank Transfer Details
              </h2>

              <div className="space-y-4 bg-green-50 rounded-xl p-4 border border-green-200 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Bank</label>
                  <p className="text-lg font-semibold text-slate-900">{bankDetails?.bankName}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Account Holder</label>
                  <p className="text-lg font-semibold text-slate-900">{bankDetails?.accountHolderName}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Transfer Date</label>
                  <p className="text-lg font-semibold text-slate-900">
                    {new Date(bankDetails?.transferDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> Please ensure you have transferred the exact amount to the bank account mentioned above. 
                  Once verified, your enrollment will be activated automatically.
                </p>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What's Next?</h2>
              <div className="space-y-3 text-slate-700">
                <div className="flex gap-3">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span>Our team will verify your bank transfer within 24 hours</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span>You'll receive a confirmation email once verified</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span>Your course access will be activated immediately</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span>Check your account dashboard to start learning</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-20">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>

              {/* Order Number */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">Order Number</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="font-bold text-slate-900">{order.number}</p>
                  <button
                    onClick={() => handleCopyToClipboard(order.number)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                  >
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Payment Number */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">Payment Reference</p>
                <p className="font-bold text-slate-900 mt-2">{payment.number}</p>
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

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-3xl font-bold text-blue-600">Rs. {order.total.toFixed(2)}</span>
              </div>

              {/* Status Badge */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-center">
                <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">Status</p>
                <p className="text-lg font-bold text-yellow-900 mt-1">Pending Verification</p>
              </div>

              {/* Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/student/dashboard')}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => navigate('/student/courses')}
                  className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 rounded-lg transition"
                >
                  Browse More Courses
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

export default BankTransferPending;
