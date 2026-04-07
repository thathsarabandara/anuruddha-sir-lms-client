import { API_ENDPOINTS } from "../utils/constants";
import axiosInstance from "./axios";

/**
 * Teacher Management API
 * All endpoints for teacher CRUD operations and admin management
 */
export const teacherAPI = {
  /**
   * Get authenticated teacher profile
   * @returns {Promise} Teacher profile data
   */
  getMyProfile: () => axiosInstance.get("/teachers/profile"),

  /**
   * Update authenticated teacher profile
   * @param {Object|FormData} profileData - Updated profile payload
   * @returns {Promise} Updated teacher profile
   */
  updateMyProfile: (profileData) => axiosInstance.put("/teachers/profile", profileData),

  /**
   * Get teacher statistics
   * @returns {Promise} Teacher statistics
   */
  getTeacherStats: () => axiosInstance.get("/teachers/stats"),

  /**
   * Get authenticated teacher's personal dashboard stats
   * @returns {Promise} Teacher personal stats (courses, students, reviews, experience)
   */
  getMyStats: () => axiosInstance.get("/teachers/my-stats"),

  /**
   * Get list of teachers with filtering and pagination
   * @param {string} search - Search query for teacher names or emails
   * @param {string} status - Filter by status (active, pending, banned)
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 10)
   * @returns {Promise} List of teachers
   */
  getTeachers: (search = "", status = "all", page = 1, limit = 10) =>
    axiosInstance.get("/teachers/list", { params: { search, status, page, limit } }),

  /**
   * Activate a teacher account
   * @param {string} teacherId - Teacher user ID
   * @returns {Promise} Activated teacher data
   */
  activateTeacher: (teacherId) =>
    axiosInstance.post("/teachers/activate", {}, { params: { teacher: teacherId } }),

  /**
   * Ban a teacher account
   * @param {string} teacherId - Teacher user ID
   * @param {Object} banData - Ban details (reason, ban_duration_hours)
   * @returns {Promise} Banned teacher data
   */
  banTeacher: (teacherId, banData = {}) =>
    axiosInstance.post("/teachers/ban", banData, { params: { teacher: teacherId } }),

  /**
   * Create a new verified teacher account (admin only)
   * @param {Object} teacherData - Teacher details
   * @returns {Promise} Created teacher with temporary password
   */
  createTeacher: (teacherData) => axiosInstance.post("/teachers/create", teacherData),

  /**
   * Reset teacher password
   * @param {string} teacherId - Teacher user ID
   * @param {boolean} sendNotification - Whether to send notification (default: true)
   * @returns {Promise} Password reset confirmation
   */
  resetTeacherPassword: (teacherId, sendNotification = true) =>
    axiosInstance.post("/teachers/reset-password", {}, { params: { teacher: teacherId, send_notification: sendNotification } }),

  /**
   * Edit teacher profile details (admin only)
   * @param {string} teacherId - Teacher user ID
   * @param {Object} teacherData - Teacher details to update
   * @returns {Promise} Updated teacher data
   */
  editTeacherDetails: (teacherId, teacherData) =>
    axiosInstance.put("/teachers/details", teacherData, { params: { teacher: teacherId } }),
};