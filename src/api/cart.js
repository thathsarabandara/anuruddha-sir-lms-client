import axiosInstance from './axios';

const CART_BASE = '/cart';

export const cartAPI = {
  getMyCart: () => axiosInstance.get(`${CART_BASE}/`),

  getMyCartCount: () => axiosInstance.get(`${CART_BASE}/count`),

  addCourseToCart: (courseId) =>
    axiosInstance.post(`${CART_BASE}/items/course`, {
      course_id: courseId,
    }),

  addProductToCart: ({ productSku, quantity = 1, metadata = {} }) =>
    axiosInstance.post(`${CART_BASE}/items/product`, {
      product_sku: productSku,
      quantity,
      metadata,
    }),

  removeCartItem: (itemId) => axiosInstance.delete(`${CART_BASE}/items/${itemId}`),

  clearCart: () => axiosInstance.delete(`${CART_BASE}/clear`),

  checkout: ({ paymentMethod = 'payhere', couponCode = null, tax = 0 } = {}) =>
    axiosInstance.post(`${CART_BASE}/checkout`, {
      payment_method: paymentMethod,
      coupon_code: couponCode,
      tax,
    }),
};
