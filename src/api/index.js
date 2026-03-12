import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';

export const authAPI = {
  register: (userData) => axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, userData),
  login: (credentials) => axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  logout: () => axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT),
  verifyOTP: (data) => axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY_OTP, data),
  resendOTP: () => axiosInstance.post(API_ENDPOINTS.AUTH.RESEND_OTP),
  verifyToken: () => axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY_TOKEN),
  refresh: () => axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH),
  forgotPassword: (email) => axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),
  verifyResetToken: (token) => axiosInstance.get(API_ENDPOINTS.AUTH.VERIFY_RESET_TOKEN, { params: { token } }),
  resetPassword: (data) => axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data),
  changePassword: (data) => axiosInstance.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data),
  getProfile: () => axiosInstance.get(API_ENDPOINTS.AUTH.ME),
  getLoginHistory: (params) => axiosInstance.get(API_ENDPOINTS.AUTH.LOGIN_HISTORY, { params }),
  verifyEmail: (data) => axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, data),
};


export default {
  auth: authAPI,
};
