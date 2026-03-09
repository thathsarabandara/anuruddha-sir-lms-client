import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';
import { getAbsoluteImageUrl } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, loading, error, removeFromCart, clearCart } = useCart();
  const [removingItemId, setRemovingItemId] = useState(null);
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [cartError, setCartError] = useState(null);

  // Handle remove item
  const handleRemoveItem = async (itemId) => {
    setRemovingItemId(itemId);
    const result = await removeFromCart(itemId);
    setRemovingItemId(null);
    
    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setCartError(result.message);
    }
  };

  // Handle clear cart
  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      const result = await clearCart();
      if (result.success) {
        setSuccessMessage(result.message);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setCartError(result.message);
      }
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse mb-3"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((i) => (
                <div key={i} className="bg-white border rounded-lg p-4 overflow-hidden">
                  <div className="flex gap-4">
                    <div className="w-32 h-32 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-6 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white border rounded-lg p-6 sticky top-6 space-y-4">
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
                <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse mt-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/student/courses')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4"
          >
            <FaArrowLeft /> Back to Courses
          </button>
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <FaShoppingCart className="text-6xl text-slate-300 mx-auto mb-4" />
            <p className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</p>
            <p className="text-slate-600 mb-6">Add some courses to get started!</p>
            <button
              onClick={() => navigate('/student/courses')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/student/courses')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4"
            >
              <FaArrowLeft /> Back to Courses
            </button>
            <h1 className="text-4xl font-bold text-slate-900">Shopping Cart</h1>
            <p className="text-slate-600 mt-1">{cart.item_count} course{cart.item_count !== 1 ? 's' : ''} in your cart</p>
          </div>
          <div className="text-5xl text-blue-600">
            <FaShoppingCart />
          </div>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => {}} className="text-red-600 hover:text-red-700">
              ✕
            </button>
          </div>
        )}

        {cartError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex justify-between items-center">
            <span>{cartError}</span>
            <button onClick={() => setCartError(null)} className="text-red-600 hover:text-red-700">
              ✕
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 flex justify-between items-center">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="text-green-600 hover:text-green-700">
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.items.map(item => (
                <div 
                  key={item.id} 
                  className={`bg-white rounded-2xl border border-slate-200 hover:shadow-lg transition-all overflow-hidden p-6 ${
                    removingItemId === item.id ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-6">
                    {/* Course Image */}
                    {item.course.thumbnail && (
                      <img
                        src={getAbsoluteImageUrl(item.course.thumbnail)}
                        alt={item.course.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    {!item.course.thumbnail && (
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {item.course.title.charAt(0)}
                      </div>
                    )}

                    {/* Course Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{item.course.title}</h3>
                      <p className="text-sm text-slate-600 mb-2">{item.course.teacher}</p>
                      <p className="text-xs text-slate-500 line-clamp-2">{item.course.description}</p>
                    </div>

                    {/* Price & Action */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900 mb-4">
                        Rs. {item.price_at_addition.toFixed(2)}
                      </p>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={removingItemId === item.id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaTrash className="text-sm" /> 
                        {removingItemId === item.id ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t">
              <button
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 font-medium transition"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-20">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>

              {/* Item Breakdown */}
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto border-b border-slate-200 pb-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-slate-700">
                    <span className="truncate">{item.course.title}</span>
                    <span className="font-medium">Rs. {item.price_at_addition.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Summary Totals */}
              <div className="space-y-4 mb-6">
                {/* Subtotal */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <span className="text-slate-600">Subtotal ({cart.item_count} items)</span>
                  <span className="font-semibold text-slate-900">Rs. {cart.subtotal.toFixed(2)}</span>
                </div>

                {/* Tax */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <span className="text-slate-600">Tax</span>
                  <span className="font-semibold text-slate-900">Rs. 0.00</span>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">Rs. {cart.subtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                {!showCoupon ? (
                  <button
                    onClick={() => setShowCoupon(true)}
                    className="text-blue-600 text-sm font-medium hover:text-blue-700 transition"
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
                      className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition font-semibold">
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate(ROUTES.STUDENT_CHECKOUT, { state: { cart } })}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 mb-3"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <button
                onClick={() => navigate('/student/courses')}
                className="w-full py-3 border-2 border-slate-300 text-slate-600 hover:bg-slate-50 font-bold rounded-lg transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
