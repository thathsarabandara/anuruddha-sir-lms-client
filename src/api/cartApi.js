import axiosInstance from './axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const cartAPI = {
  getCart: () => axiosInstance.get(`${API_BASE_URL}payments/cart/`),
  addToCart: (courseId) =>  axiosInstance.post(`${API_BASE_URL}payments/cart/add/`, { course_id: courseId  }),
  removeFromCart: (itemId) =>  axiosInstance.delete(`${API_BASE_URL}payments/cart/items/${itemId}/`), 
  clearCart: () => axiosInstance.post(`${API_BASE_URL}payments/cart/clear/`),
  checkout: (paymentMethod = 'payhere', couponCode = null, tax = 0) => axiosInstance.post(`${API_BASE_URL}payments/checkout/`, {
      payment_method: paymentMethod,
      coupon_code: couponCode,
      tax: tax
    }),
  confirmPayment: (orderId, paymentId) => axiosInstance.post(`${API_BASE_URL}payments/payment-success/`, {
      order_id: orderId,
      payment_id: paymentId
    }),
  validateCoupon: (couponCode, subtotal) => axiosInstance.post(`${API_BASE_URL}payments/student/coupons/validate/`, {
      coupon_code: couponCode,
      subtotal: subtotal
    }),
  uploadBankSlip: (formData) => axiosInstance.post(`${API_BASE_URL}payments/upload-bank-slip/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
  enrollFree: (couponCode = null) => axiosInstance.post(`${API_BASE_URL}payments/enroll-free/`, {
      coupon_code: couponCode
    })
};

export default cartAPI;
