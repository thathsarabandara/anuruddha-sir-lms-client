import React from 'react';
import { useCart, useCheckout } from '../../hooks/useCart';
import { useNavigate, useLocation } from 'react-router-dom';

export const ShoppingCart = () => {
  const navigate = useNavigate();
  const { cart, loading, error, removeFromCart, clearCart } = useCart();
  const [showCoupon, setShowCoupon] = React.useState(false);
  const [couponCode, setCouponCode] = React.useState('');

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="mb-6">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some courses to get started</p>
          <button
            onClick={() => navigate('/courses')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
          
          <div className="space-y-4">
            {cart.items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onRemove={() => removeFromCart(item.id)}
              />
            ))}
          </div>

          <div className="mt-8 pt-8 border-t">
            <button
              onClick={() => clearCart()}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Items ({cart.item_count})</span>
                <span>Rs. {cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax</span>
                <span>Rs. 0.00</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">Rs. {cart.subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="mb-6 p-4 bg-white rounded border">
              {!showCoupon ? (
                <button
                  onClick={() => setShowCoupon(true)}
                  className="text-blue-600 text-sm font-medium"
                >
                  + Have a coupon code?
                </button>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded text-sm"
                  />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                    Apply
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/checkout', { state: { cart } })}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate('/courses')}
              className="w-full mt-3 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Individual Cart Item Card
 */
const CartItemCard = ({ item, onRemove }) => {
  return (
    <div className="bg-white border rounded-lg p-4 flex gap-4 hover:shadow-lg transition">
      {item.course.thumbnail && (
        <img
          src={item.course.thumbnail}
          alt={item.course.title}
          className="w-24 h-24 object-cover rounded"
        />
      )}
      
      <div className="flex-1">
        <h3 className="font-bold text-lg text-gray-900">{item.course.title}</h3>
        <p className="text-gray-600 text-sm">By {item.course.teacher}</p>
        <p className="text-gray-700 text-sm mt-2 line-clamp-2">{item.course.description}</p>
        
        <div className="flex justify-between items-end mt-4">
          <div>
            {item.course.price_type === 'PAID' ? (
              <span className="text-2xl font-bold text-blue-600">Rs. {item.price_at_addition.toFixed(2)}</span>
            ) : (
              <span className="text-2xl font-bold text-green-600">Free</span>
            )}
          </div>
          <button
            onClick={onRemove}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Checkout Page Component
 */
export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { checkout, loading, error } = useCheckout();
  const [paymentMethod, setPaymentMethod] = React.useState('payhere');
  const [tax, setTax] = React.useState(0);
  const [couponCode, setCouponCode] = React.useState('');
  const [processing, setProcessing] = React.useState(false);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 mb-4">Your cart is empty</p>
        <button
          onClick={() => navigate('/courses')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const handleCheckout = async () => {
    setProcessing(true);
    const result = await checkout(paymentMethod, couponCode || null, parseFloat(tax) || 0);
    
    if (result.success) {
      if (paymentMethod === 'payhere') {
        // Redirect to PayHere
        window.location.href = result.paymentGateway.redirect_url;
      } else {
        // For other methods, show order details
        navigate('/payment-pending', { 
          state: { 
            order: result.order,
            payment: result.payment 
          } 
        });
      }
    }
    setProcessing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div>
          <div className="bg-white rounded-lg p-6 border">
            <h2 className="text-2xl font-bold mb-6">Payment Details</h2>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">Payment Method</label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="payhere"
                    checked={paymentMethod === 'payhere'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4"
                  />
                  <span className="ml-3 text-gray-700">PayHere (Credit Card / Debit Card)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4"
                  />
                  <span className="ml-3 text-gray-700">Bank Transfer</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4"
                  />
                  <span className="ml-3 text-gray-700">Cash Payment</span>
                </label>
              </div>
            </div>

            {/* Coupon */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code (Optional)</label>
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Tax */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tax (Optional)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={tax}
                onChange={(e) => setTax(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleCheckout}
              disabled={processing || loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              {processing || loading ? 'Processing...' : `Complete Payment - Rs. ${(cart.subtotal + parseFloat(tax || 0)).toFixed(2)}`}
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-gray-900">Courses ({cart.item_count})</h3>
              <div className="space-y-2">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-700 text-sm">
                    <span>{item.course.title}</span>
                    <span>Rs. {item.price_at_addition.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>Rs. {cart.subtotal.toFixed(2)}</span>
              </div>
              {parseFloat(tax) > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>Rs. {parseFloat(tax).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-3">
                <span>Total</span>
                <span className="text-blue-600">Rs. {(cart.subtotal + parseFloat(tax || 0)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Payment Pending Page
 */
export const PaymentPendingPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { confirmPayment } = useCheckout();
  const [confirming, setConfirming] = React.useState(false);

  if (!state?.order || !state?.payment) {
    return <div className="text-center py-12">Order not found</div>;
  }

  const handleConfirmPayment = async () => {
    setConfirming(true);
    const result = await confirmPayment(state.order.id, state.payment.id);
    
    if (result.success) {
      navigate('/payment-success', { 
        state: { 
          order: state.order,
          enrollments: result.enrollments 
        } 
      });
    }
    setConfirming(false);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg border p-8 text-center">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Payment Pending</h2>
        <p className="text-gray-600 mb-6">Order #{state.order.number}</p>
        
        <button
          onClick={handleConfirmPayment}
          disabled={confirming}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {confirming ? 'Confirming...' : 'Confirm Payment'}
        </button>
      </div>
    </div>
  );
};

/**
 * Payment Success Page
 */
export const PaymentSuccessPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.order || !state?.enrollments) {
    return <div className="text-center py-12">Payment not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg border p-8 text-center mb-8">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Order #{state.order.number}</p>
          <p className="text-lg font-semibold mb-6">Rs. {state.order.total.toFixed(2)}</p>
        </div>

        {/* Enrollments */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">You're enrolled in:</h3>
          <div className="space-y-3">
            {state.enrollments.map((enrollment) => (
              <div key={enrollment.id} className="bg-white p-4 rounded border-l-4 border-green-500">
                <h4 className="font-semibold text-gray-900">{enrollment.course_title}</h4>
                <p className="text-sm text-gray-600">Enrolled on {new Date(enrollment.enrolled_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/my-courses')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            View My Courses
          </button>
          <button
            onClick={() => navigate('/courses')}
            className="text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default {
  ShoppingCart,
  CheckoutPage,
  PaymentPendingPage,
  PaymentSuccessPage
};
