import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';

/**
 * Custom hook for managing shopping cart
 */
const dummyCart = {
  items: [
    { id: 1, course_id: 1, course_title: 'React Basics', price: 49.99 },
    { id: 2, course_id: 2, course_title: 'JavaScript Advanced', price: 59.99 },
  ],
  subtotal: 109.98,
  item_count: 2,
};

export const useCart = () => {
  const [cart, setCart] = useState(dummyCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart
  const fetchCart = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setCart(dummyCart);
      setError(null);
      setLoading(false);
    }, 300);
  }, []);

  // Add to cart
  // eslint-disable-next-line no-unused-vars
  const addToCart = useCallback((_courseId) => {
    setError(null);
    toast.success('Course added to cart');
    return { success: true, message: 'Added to cart' };
  }, []);

  // Remove from cart
  // eslint-disable-next-line no-unused-vars
  const removeFromCart = useCallback((_itemId) => {
    setError(null);
    toast.success('Item removed from cart');
    return { success: true, message: 'Removed from cart' };
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setError(null);
    toast.success('Cart cleared');
    return { success: true, message: 'Cart cleared' };
  }, []);

  // Load cart on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCart();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchCart]);

  return {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    removeFromCart,
    clearCart,
    itemCount: cart?.item_count || 0,
    subtotal: cart?.subtotal || 0
  };
};

/**
 * Custom hook for checkout process
 */
export const useCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);

  // Checkout
  // eslint-disable-next-line no-unused-vars
  const checkout = useCallback((_paymentMethod = 'payhere', _couponCode = null, _tax = 0) => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      const dummyOrder = {
        id: 'order-001',
        total: 100,
        status: 'PENDING',
      };
      setOrder(dummyOrder);
      setPayment(dummyOrder);
      setLoading(false);
      toast.success('Checkout initiated');
      return {
        success: true,
        order: dummyOrder,
        payment: dummyOrder,
        paymentGateway: 'payhere',
        message: 'Ready for payment'
      };
    }, 500);
  }, []);

  // Confirm payment
  // eslint-disable-next-line no-unused-vars
  const confirmPayment = useCallback((_orderId, _paymentId) => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      toast.success('Payment confirmed');
      return {
        success: true,
        enrollments: [],
        message: 'Payment successful'
      };
    }, 500);
  }, []);

  return {
    loading,
    error,
    order,
    payment,
    checkout,
    confirmPayment
  };
};
