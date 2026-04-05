import { useState, useCallback, useEffect } from 'react';
import { cartAPI } from '../api/cart';

const emptyCart = {
  cart_id: null,
  items: [],
  item_count: 0,
  subtotal: 0,
  currency: 'LKR',
};

const normalizeCart = (payload) => {
  const data = payload || {};
  const items = Array.isArray(data.items) ? data.items : [];
  const subtotal = Number(data.subtotal || 0);

  return {
    cart_id: data.cart_id || null,
    items,
    item_count: Number(data.item_count ?? items.length ?? 0),
    subtotal,
    currency: data.currency || 'LKR',
  };
};

const toResultMessage = (response, fallback) =>
  response?.data?.message || response?.message || fallback;

export const useCart = () => {
  const [cart, setCart] = useState(emptyCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const response = await cartAPI.getMyCart();
      const nextCart = normalizeCart(response?.data?.data);
      setCart(nextCart);
      setError(null);
      return nextCart;
    } catch (err) {
      const message = err?.message || 'Failed to fetch cart';
      setError(message);
      return emptyCart;
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (course) => {
    const courseId = course?.course_id || course?.id;
    if (!courseId) {
      const message = 'Course information is missing';
      setError(message);
      return { success: false, message };
    }

    setLoading(true);
    try {
      const response = await cartAPI.addCourseToCart(courseId);
      const nextCart = normalizeCart(response?.data?.data);
      setCart(nextCart);
      setError(null);
      return { success: true, message: toResultMessage(response, 'Course added to cart') };
    } catch (err) {
      const message = err?.message || 'Failed to add course to cart';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromCart = useCallback(async (itemId) => {
    setLoading(true);
    try {
      const response = await cartAPI.removeCartItem(itemId);
      const nextCart = normalizeCart(response?.data?.data);
      setCart(nextCart);
      setError(null);
      return { success: true, message: toResultMessage(response, 'Removed from cart') };
    } catch (err) {
      const message = err?.message || 'Failed to remove item from cart';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCart = useCallback(async () => {
    setLoading(true);
    try {
      const response = await cartAPI.clearCart();
      const nextCart = normalizeCart(response?.data?.data);
      setCart(nextCart);
      setError(null);
      return { success: true, message: toResultMessage(response, 'Cart cleared') };
    } catch (err) {
      const message = err?.message || 'Failed to clear cart';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const isInCart = useCallback(
    (courseId) => cart.items.some((item) => String(item.course_id) === String(courseId)),
    [cart.items],
  );

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
    itemCount: cart.item_count,
    subtotal: cart.subtotal,
    isInCart,
  };
};

export const useCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);

  const checkout = useCallback(async (paymentMethod = 'payhere', couponCode = null, tax = 0) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cartAPI.checkout({ paymentMethod, couponCode, tax });
      const result = response?.data?.data || {};

      setOrder(result.order || null);
      setPayment(result.payment || null);

      return {
        success: Boolean(result.success),
        partial: Boolean(result.partial),
        message: result.message || toResultMessage(response, 'Checkout processed'),
        order: result.order || null,
        payment: result.payment || null,
        enrollments: result.enrollments || [],
        failedItems: result.failed_items || [],
        paymentGuidance: result.payment_guidance || null,
        paymentGateway: result.payment_guidance?.gateway || null,
      };
    } catch (err) {
      const message = err?.message || 'Checkout failed';
      setError(message);
      return {
        success: false,
        partial: false,
        message,
        order: null,
        payment: null,
        enrollments: [],
        failedItems: [],
        paymentGuidance: null,
        paymentGateway: null,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmPayment = useCallback(async () => {
    return {
      success: true,
      enrollments: [],
      message: 'Payment confirmation pending integration',
    };
  }, []);

  return {
    loading,
    error,
    order,
    payment,
    checkout,
    confirmPayment,
  };
};
