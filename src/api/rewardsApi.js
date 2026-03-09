import axiosInstance from './axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const studentRewardsAPI = {
  getGems: () => axiosInstance.get(`${API_BASE_URL}/rewards/student/gems/`),
  
  // Get transaction history
  getTransactions: (status = '', type = '') => {
    let url = `${API_BASE_URL}/rewards/student/transactions/`;
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (type) params.append('type', type);
    if (params.toString()) url += `?${params.toString()}`;
    return axiosInstance.get(url);
  },
  
  // Get coupons created by student
  getCoupons: () => axiosInstance.get(`${API_BASE_URL}/rewards/student/coupons/`),
  
  // Create coupon code
  createCoupon: (couponData) => axiosInstance.post(`${API_BASE_URL}/rewards/coupon/create/`, couponData),
  
  // Use coupon code
  useCoupon: (code) => axiosInstance.post(`${API_BASE_URL}/rewards/coupon/use/`, { code }),
  
  // Get all active coupons
  getAllCoupons: () => axiosInstance.get(`${API_BASE_URL}/rewards/coupon/all/`),
};

// Reward Approval System
export const rewardApprovalAPI = {
  // Request reward approval from teacher
  requestReward: (quizAttemptId, gemsRequested, teacherId) => 
    axiosInstance.post(`${API_BASE_URL}/rewards/reward/request/`, {
      quiz_attempt_id: quizAttemptId,
      gems_requested: gemsRequested,
      teacher_id: teacherId
    }),
};

// Teacher Reward Management
export const teacherRewardsAPI = {
  // Get pending reward requests
  getPendingRewards: () => axiosInstance.get(`${API_BASE_URL}/rewards/teacher/pending-rewards/`),
  
  // Approve student reward
  approveReward: (requestId, approvalMessage = '') =>
    axiosInstance.post(`${API_BASE_URL}/rewards/reward/approve/`, {
      request_id: requestId,
      approval_message: approvalMessage
    }),
  
  // Reject student reward
  rejectReward: (requestId, rejectionReason = '') =>
    axiosInstance.post(`${API_BASE_URL}/rewards/reward/reject/`, {
      request_id: requestId,
      rejection_reason: rejectionReason
    }),
};

// Admin Reward Management
export const adminRewardsAPI = {
  // Send reward to student
  sendReward: (studentId, gems, reason = '') =>
    axiosInstance.post(`${API_BASE_URL}/rewards/admin/send-reward/`, {
      student_id: studentId,
      gems,
      reason
    }),
  
  // Create admin coupon
  createCoupon: (couponData) =>
    axiosInstance.post(`${API_BASE_URL}/rewards/admin/create-coupon/`, couponData),
  
  // Deduct gems from student
  deductGems: (studentId, gems, reason = '') =>
    axiosInstance.post(`${API_BASE_URL}/rewards/admin/deduct-gems/`, {
      student_id: studentId,
      gems,
      reason
    }),
};

// Leaderboard
export const leaderboardAPI = {
  getLeaderboard: (limit = 100) => {
    let url = `${API_BASE_URL}/rewards/leaderboard/`;
    if (limit) url += `?limit=${limit}`;
    return axiosInstance.get(url);
  },
};

export default {
  studentRewardsAPI,
  rewardApprovalAPI,
  teacherRewardsAPI,
  adminRewardsAPI,
  leaderboardAPI,
};
