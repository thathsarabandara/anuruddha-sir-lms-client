import { useState, useCallback, useEffect } from 'react';
import cartAPI from '../api/cartApi';

/**
 * Custom hook for managing shopping cart
 */
export const useCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.getCart();
      if (response.data.success) {
        setCart(response.data.cart);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add to cart
  const addToCart = useCallback(async (courseId) => {
    try {
      setError(null);
      const response = await cartAPI.addToCart(courseId);
      if (response.data.success) {
        await fetchCart(); // Refresh cart
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add to cart';
      setError(message);
      return { success: false, message };
    }
  }, [fetchCart]);

  // Remove from cart
  const removeFromCart = useCallback(async (itemId) => {
    try {
      setError(null);
      const response = await cartAPI.removeFromCart(itemId);
      if (response.data.success) {
        await fetchCart(); // Refresh cart
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to remove from cart';
      setError(message);
      return { success: false, message };
    }
  }, [fetchCart]);

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      setError(null);
      const response = await cartAPI.clearCart();
      if (response.data.success) {
        await fetchCart(); // Refresh cart
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to clear cart';
      setError(message);
      return { success: false, message };
    }
  }, [fetchCart]);

  // Load cart on mount
  useEffect(() => {
    fetchCart();
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
  const checkout = useCallback(async (paymentMethod = 'payhere', couponCode = null, tax = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.checkout(paymentMethod, couponCode, tax);
      
      if (response.data.success) {
        setOrder(response.data.order);
        setPayment(response.data.payment);
        return {
          success: true,
          order: response.data.order,
          payment: response.data.payment,
          paymentGateway: response.data.payment_gateway,
          message: response.data.message
        };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Checkout failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Confirm payment
  const confirmPayment = useCallback(async (orderId, paymentId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.confirmPayment(orderId, paymentId);
      
      if (response.data.success) {
        return {
          success: true,
          enrollments: response.data.enrollments,
          message: response.data.message
        };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Payment confirmation failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
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
