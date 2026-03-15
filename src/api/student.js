import { API_ENDPOINTS } from "../utils/constants";
import axiosInstance from "./axios";

/**
 * Student Management API
 * All endpoints for student CRUD operations and admin management
 */
export const studentAPI = {
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
};