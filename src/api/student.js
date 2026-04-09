import { API_ENDPOINTS } from "../utils/constants";
import axiosInstance from "./axios";

/**
 * Student Management API
 * All endpoints for student CRUD operations and admin management
 */
export const studentAPI = {
  /**
   * Get authenticated student profile
   * @returns {Promise} Student profile data
   */
  getMyProfile: () => axiosInstance.get("/students/profile"),

  /**
   * Update authenticated student profile
   * @param {Object|FormData} profileData - Updated profile payload
   * @returns {Promise} Updated student profile
   */
  updateMyProfile: (profileData) => axiosInstance.put("/students/profile", profileData),

  /**
   * Get student statistics
   * @returns {Promise} Student statistics
   */
  getStudentStats: () => axiosInstance.get("/students/stats"),

  /**
   * Get list of students with filtering and pagination
   * @param {string} search - Search query for student names or emails
   * @param {string} status - Filter by status (all, active, pending, banned)
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 10)
   * @returns {Promise} List of students
   */
  getStudents: (search = "", status = "all", page = 1, limit = 10) =>
    axiosInstance.get("/students/list", { params: { search, status, page, limit } }),

  /**
   * Activate a student account
   * @param {string} studentId - Student user ID
   * @returns {Promise} Activated student data
   */
  activateStudent: (studentId) =>
    axiosInstance.post("/students/activate", {}, { params: { student: studentId } }),

  /**
   * Ban a student account
   * @param {string} studentId - Student user ID
   * @param {Object} banData - Ban details (reason, ban_duration_hours)
   * @returns {Promise} Banned student data
   */
  banStudent: (studentId, banData = {}) =>
    axiosInstance.post("/students/ban", banData, { params: { student: studentId } }),

  /**
   * Create a new verified student account (admin only)
   * @param {Object} studentData - Student details
   * @returns {Promise} Created student with temporary password
   */
  createStudent: (studentData) => axiosInstance.post("/students/create", studentData),

  /**
   * Reset student password
   * @param {string} studentId - Student user ID
   * @param {boolean} sendNotification - Whether to send notification (default: true)
   * @returns {Promise} Password reset confirmation
   */
  resetStudentPassword: (studentId, sendNotification = true) =>
    axiosInstance.post("/students/reset-password", {}, { params: { student: studentId, send_notification: sendNotification } }),

  /**
   * Edit student profile details (admin only)
   * @param {string} studentId - Student user ID
   * @param {Object} studentData - Student details to update
   * @returns {Promise} Updated student data
   */
  editStudentDetails: (studentId, studentData) =>
    axiosInstance.put("/students/details", studentData, { params: { student: studentId } }),

  /**
   * Get notifications for current student.
   * @param {Object} params - Query params (limit, offset, filter, sort)
   * @returns {Promise} Notification list with pagination
   */
  getNotifications: (params = {}) =>
    axiosInstance.get(API_ENDPOINTS.NOTIFICATIONS, { params }),

  /**
   * Get single notification details.
   * @param {string} notificationId - Notification ID
   * @returns {Promise} Notification details
   */
  getNotificationDetail: (notificationId) =>
    axiosInstance.get(`${API_ENDPOINTS.NOTIFICATIONS}/${notificationId}`),

  /**
   * Mark a notification as read.
   * @param {string} notificationId - Notification ID
   * @returns {Promise} Updated notification
   */
  markNotificationAsRead: (notificationId) =>
    axiosInstance.put(`${API_ENDPOINTS.NOTIFICATIONS}/${notificationId}/read`),

  /**
   * Mark all notifications as read.
   * @returns {Promise} Updated count
   */
  markAllNotificationsAsRead: () =>
    axiosInstance.put(`${API_ENDPOINTS.NOTIFICATIONS}/read-all`),

  /**
   * Delete a notification.
   * @param {string} notificationId - Notification ID
   * @returns {Promise} Deletion result
   */
  deleteNotification: (notificationId) =>
    axiosInstance.delete(`${API_ENDPOINTS.NOTIFICATIONS}/${notificationId}`),

  /**
   * Get unread notification count.
   * @returns {Promise} Unread count details
   */
  getUnreadNotificationCount: () =>
    axiosInstance.get(`${API_ENDPOINTS.NOTIFICATIONS}/unread-count`),

  /**
   * Get top bar notification summary (unread count + first notifications).
   * @param {number} limit - Number of latest notifications to return (default: 3)
   * @returns {Promise} Top bar notification summary
   */
  getTopbarNotificationSummary: (limit = 3) =>
    axiosInstance.get(`${API_ENDPOINTS.NOTIFICATIONS}/topbar-summary`, {
      params: { limit },
    }),
};