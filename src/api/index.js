import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';

// Auth API calls
export const authAPI = {
  login: (credentials) => axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  register: (userData) => axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, userData),
  verifyOTP: (data) => axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY_OTP, data),
  resendOTP: (data) => axiosInstance.post(API_ENDPOINTS.AUTH.RESEND_OTP, data),
  forgotPassword: (email) => axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),
  verifyResetToken: (params) => axiosInstance.get(API_ENDPOINTS.AUTH.VERIFY_RESET_TOKEN, { params }),
  resetPassword: (data) => axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data),
  logout: () => axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT),
  me: () => axiosInstance.get(API_ENDPOINTS.AUTH.ME),
};

// Courses API
export const coursesAPI = {
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.COURSES, { params }),
  getById: (id) => axiosInstance.get(`${API_ENDPOINTS.COURSES}/${id}`),
  create: (data) => axiosInstance.post(API_ENDPOINTS.COURSES, data),
  update: (id, data) => axiosInstance.put(`${API_ENDPOINTS.COURSES}/${id}`, data),
  delete: (id) => axiosInstance.delete(`${API_ENDPOINTS.COURSES}/${id}`),
  enroll: (id) => axiosInstance.post(`${API_ENDPOINTS.COURSES}/${id}/enroll`),
};

// Students API
export const studentsAPI = {
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.STUDENTS, { params }),
  getById: (id) => axiosInstance.get(`${API_ENDPOINTS.STUDENTS}/${id}`),
  getProgress: (id) => axiosInstance.get(`${API_ENDPOINTS.STUDENTS}/${id}/progress`),
  update: (id, data) => axiosInstance.put(`${API_ENDPOINTS.STUDENTS}/${id}`, data),
};

// Quizzes API
export const quizzesAPI = {
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.QUIZZES, { params }),
  getById: (id) => axiosInstance.get(`${API_ENDPOINTS.QUIZZES}/${id}`),
  create: (data) => axiosInstance.post(API_ENDPOINTS.QUIZZES, data),
  submit: (id, answers) => axiosInstance.post(`${API_ENDPOINTS.QUIZZES}/${id}/submit`, answers),
  getLeaderboard: (id) => axiosInstance.get(`${API_ENDPOINTS.QUIZZES}/${id}/leaderboard`),
};

// Payments API
export const paymentsAPI = {
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.PAYMENTS, { params }),
  getById: (id) => axiosInstance.get(`${API_ENDPOINTS.PAYMENTS}/${id}`),
  create: (data) => axiosInstance.post(API_ENDPOINTS.PAYMENTS, data),
  verify: (id) => axiosInstance.post(`${API_ENDPOINTS.PAYMENTS}/${id}/verify`),
};

// Recordings API
export const recordingsAPI = {
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.RECORDINGS, { params }),
  getById: (id) => axiosInstance.get(`${API_ENDPOINTS.RECORDINGS}/${id}`),
  requestAccess: (id) => axiosInstance.post(`${API_ENDPOINTS.RECORDINGS}/${id}/request-access`),
  approveAccess: (id, studentId) => axiosInstance.post(`${API_ENDPOINTS.RECORDINGS}/${id}/approve`, { studentId }),
};

// Rewards API
export const rewardsAPI = {
  getBalance: () => axiosInstance.get(`${API_ENDPOINTS.REWARDS}/balance`),
  getHistory: (params) => axiosInstance.get(`${API_ENDPOINTS.REWARDS}/history`, { params }),
  assign: (data) => axiosInstance.post(`${API_ENDPOINTS.REWARDS}/assign`, data),
};

// Notifications API
export const notificationsAPI = {
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.NOTIFICATIONS, { params }),
  markAsRead: (id) => axiosInstance.put(`${API_ENDPOINTS.NOTIFICATIONS}/${id}/read`),
  markAllAsRead: () => axiosInstance.put(`${API_ENDPOINTS.NOTIFICATIONS}/read-all`),
};

export default {
  auth: authAPI,
  courses: coursesAPI,
  students: studentsAPI,
  quizzes: quizzesAPI,
  payments: paymentsAPI,
  recordings: recordingsAPI,
  rewards: rewardsAPI,
  notifications: notificationsAPI,
};
