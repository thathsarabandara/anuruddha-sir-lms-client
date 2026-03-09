import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';
import quizAPI from './quizApi';

// Auth API calls
export const authAPI = {
  // Core authentication
  register: (userData) => axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, userData),
  login: (credentials) => axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  logout: () => axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT),
  
  // OTP verification for registration
  verifyOTP: (data) => axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY_OTP, data),
  resendOTP: () => axiosInstance.post(API_ENDPOINTS.AUTH.RESEND_OTP),
  
  // Token management
  verifyToken: () => axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY_TOKEN),
  refresh: () => axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH),
  
  // Password reset flow
  forgotPassword: (email) => axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),
  verifyResetToken: (token) => axiosInstance.get(API_ENDPOINTS.AUTH.VERIFY_RESET_TOKEN, { params: { token } }),
  resetPassword: (data) => axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data),
  
  // Password management (authenticated)
  changePassword: (data) => axiosInstance.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data),
  
  // User data & security
  getProfile: () => axiosInstance.get(API_ENDPOINTS.AUTH.ME),
  getLoginHistory: (params) => axiosInstance.get(API_ENDPOINTS.AUTH.LOGIN_HISTORY, { params }),
  verifyEmail: (data) => axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, data),
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
  getStats: () => axiosInstance.get(`${API_ENDPOINTS.STUDENTS}/stats`),
  getById: (id) => axiosInstance.get(`${API_ENDPOINTS.STUDENTS}/${id}`),
  getProgress: (id) => axiosInstance.get(`${API_ENDPOINTS.STUDENTS}/${id}/progress`),
  create: (data) => axiosInstance.post(`${API_ENDPOINTS.STUDENTS}/create`, data),
  update: (id, data) => axiosInstance.put(`${API_ENDPOINTS.STUDENTS}/${id}/update`, data),
  approve: (id) => axiosInstance.post(`${API_ENDPOINTS.STUDENTS}/${id}/approve`),
  reject: (id, data) => axiosInstance.post(`${API_ENDPOINTS.STUDENTS}/${id}/reject`, data),
  suspend: (id, data) => axiosInstance.post(`${API_ENDPOINTS.STUDENTS}/${id}/suspend`, data),
  activate: (id) => axiosInstance.post(`${API_ENDPOINTS.STUDENTS}/${id}/activate`),
  resetPassword: (id) => axiosInstance.post(`${API_ENDPOINTS.STUDENTS}/${id}/reset-password`),
};

// Teachers API
export const teachersAPI = {
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.TEACHERS, { params }),
  getStats: () => axiosInstance.get(`${API_ENDPOINTS.TEACHERS}/stats`),
  getById: (id) => axiosInstance.get(`${API_ENDPOINTS.TEACHERS}/${id}`),
  create: (data) => axiosInstance.post(`${API_ENDPOINTS.TEACHERS}/create`, data),
  update: (id, data) => axiosInstance.put(`${API_ENDPOINTS.TEACHERS}/${id}/update`, data),
  approve: (id) => axiosInstance.post(`${API_ENDPOINTS.TEACHERS}/${id}/approve`),
  reject: (id, data) => axiosInstance.post(`${API_ENDPOINTS.TEACHERS}/${id}/reject`, data),
  suspend: (id, data) => axiosInstance.post(`${API_ENDPOINTS.TEACHERS}/${id}/suspend`, data),
  activate: (id) => axiosInstance.post(`${API_ENDPOINTS.TEACHERS}/${id}/activate`),
  resetPassword: (id) => axiosInstance.post(`${API_ENDPOINTS.TEACHERS}/${id}/reset-password`),
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

// Admin Payments API
export const adminPaymentsAPI = {
  getStats: () => axiosInstance.get('/payments/admin/payments/stats/'),
  getAll: (params) => axiosInstance.get('/payments/admin/payments/', { params }),
  getById: (id) => axiosInstance.get(`/payments/admin/payments/${id}/`),
  approve: (id, notes = '') => axiosInstance.post(`/payments/admin/payments/${id}/approve/`, { notes }),
  reject: (id, reason) => axiosInstance.post(`/payments/admin/payments/${id}/reject/`, { reason }),
  getBankSlips: (params) => axiosInstance.get('/payments/admin/bank-slips/', { params }),
  getAnalytics: (days = 30) => axiosInstance.get('/payments/admin/payments/analytics/', { params: { days } }),
};

// Recordings API
export const recordingsAPI = {
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.RECORDINGS, { params }),
  getById: (id) => axiosInstance.get(`${API_ENDPOINTS.RECORDINGS}/${id}`),
  requestAccess: (id) => axiosInstance.post(`${API_ENDPOINTS.RECORDINGS}/${id}/request-access`),
  approveAccess: (id, studentId) => axiosInstance.post(`${API_ENDPOINTS.RECORDINGS}/${id}/approve`, { studentId }),
};

// Rewards API
export const studentRewardsAPI = {
  getGems: () => axiosInstance.get(API_ENDPOINTS.REWARDS_ENDPOINTS.STUDENT.GEMS),
  getTransactions: (params) => axiosInstance.get(API_ENDPOINTS.REWARDS_ENDPOINTS.STUDENT.TRANSACTIONS, { params }),
  getStudentCoupons: () => axiosInstance.get(API_ENDPOINTS.REWARDS_ENDPOINTS.STUDENT.COUPONS),
};

// Rewards API
export const teacherRewardsAPI = {
  getPendingRewards: (params) => axiosInstance.get(API_ENDPOINTS.REWARDS_ENDPOINTS.TEACHER.PENDING, { params }),
  approveReward: (data) => axiosInstance.post(API_ENDPOINTS.REWARDS_ENDPOINTS.TEACHER.APPROVE, data),
  rejectReward: (data) => axiosInstance.post(API_ENDPOINTS.REWARDS_ENDPOINTS.TEACHER.REJECT, data),
};

// Rewards API
export const adminRewardsAPI = {
  sendReward: (data) => axiosInstance.post(API_ENDPOINTS.REWARDS_ENDPOINTS.ADMIN.SEND_REWARD, data),
  createCoupon: (data) => axiosInstance.post(API_ENDPOINTS.REWARDS_ENDPOINTS.ADMIN.CREATE_COUPON, data),
  deductGems: (data) => axiosInstance.post(API_ENDPOINTS.REWARDS_ENDPOINTS.ADMIN.DEDUCT_GEMS, data),
};

// Rewards API - Coupon endpoints
export const couponAPI = {
  createCoupon: (data) => axiosInstance.post(API_ENDPOINTS.REWARDS_ENDPOINTS.COUPON.CREATE, data),
  useCoupon: (data) => axiosInstance.post(API_ENDPOINTS.REWARDS_ENDPOINTS.COUPON.USE, data),
  getAllCoupons: (params) => axiosInstance.get(API_ENDPOINTS.REWARDS_ENDPOINTS.COUPON.ALL, { params }),
};

// Rewards API - Approval endpoints
export const rewardApprovalAPI = {
  requestReward: (data) => axiosInstance.post(API_ENDPOINTS.REWARDS_ENDPOINTS.REQUEST, data),
};

// Rewards API - Public endpoints
export const leaderboardAPI = {
  getLeaderboard: (params) => axiosInstance.get(API_ENDPOINTS.REWARDS_ENDPOINTS.PUBLIC.LEADERBOARD, { params }),
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
  teachers: teachersAPI,
  quizzes: quizzesAPI,
  payments: paymentsAPI,
  adminPayments: adminPaymentsAPI,
  recordings: recordingsAPI,
  studentRewards: studentRewardsAPI,
  teacherRewards: teacherRewardsAPI,
  adminRewards: adminRewardsAPI,
  coupon: couponAPI,
  rewardApproval: rewardApprovalAPI,
  leaderboard: leaderboardAPI,
  notifications: notificationsAPI,
  quiz: quizAPI,
};
