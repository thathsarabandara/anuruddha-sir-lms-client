import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: 'Advanced Algebra Mastery',
      subject: 'Mathematics',
      instructor: 'Anuruddha Sir',
      price: 8500,
      quantity: 1,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 3,
      title: 'English Grammar Pro',
      subject: 'English',
      instructor: 'Anuruddha Sir',
      price: 8000,
      quantity: 1,
      color: 'from-red-500 to-red-600'
    }
  ]);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

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
            <p className="text-slate-600 mt-1">{cartItems.length} course{cartItems.length !== 1 ? 's' : ''} in your cart</p>
          </div>
          <div className="text-5xl text-blue-600">
            <FaShoppingCart />
          </div>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl border border-slate-200 hover:shadow-lg transition-all overflow-hidden p-6">
                    <div className="flex items-start gap-6">
                      {/* Course Info */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-slate-600 mb-2">{item.subject}</p>
                        <p className="text-xs text-slate-500">Instructor: {item.instructor}</p>
                      </div>

                      {/* Price & Quantity */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900 mb-4">Rs. {item.price * item.quantity}</p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 bg-slate-100 rounded-lg p-2 mb-4 justify-center">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-slate-200 rounded"
                          >
                            <FaMinus className="text-sm" />
                          </button>
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-slate-200 rounded"
                          >
                            <FaPlus className="text-sm" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all font-semibold"
                        >
                          <FaTrash className="text-sm" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-20">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>

                {/* Subtotal */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold text-slate-900">Rs. {subtotal}</span>
                </div>

                {/* Tax */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                  <span className="text-slate-600">Tax (10%)</span>
                  <span className="font-semibold text-slate-900">Rs. {tax.toFixed(2)}</span>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">Rs. {total.toFixed(2)}</span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => navigate('/student/checkout')}
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
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default CartPage;
