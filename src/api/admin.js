import { API_ENDPOINTS } from "../utils/constants";
import axiosInstance from "./axios";

/**
 * Admin Management API
 * All endpoints for admin dashboard, statistics, and system management
 */
export const adminAPI = {
  // ──────────────────────────────────────────────────────────────────────────
  // Dashboard Statistics
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Get administrative dashboard data
   * @returns {Promise} Dashboard statistics and overview
   */
  getDashboardStats: () =>
    axiosInstance.get("/dashboards/admin"),

  /**
   * Get system health status and metrics
   * @returns {Promise} System health data (API uptime, database status, etc.)
   */
  getSystemHealth: () =>
    axiosInstance.get("/dashboards/admin/system-health"),

  /**
   * Get revenue analytics and financial data
   * @returns {Promise} Revenue statistics (monthly, yearly, by course, etc.)
   */
  getRevenueAnalytics: () =>
    axiosInstance.get("/dashboards/admin/revenue"),

  /**
   * Get user statistics and demographics
   * @returns {Promise} User breakdown (total, by role, active, banned, etc.)
   */
  getUserStatistics: () =>
    axiosInstance.get("/dashboards/admin/users"),

  /**
   * Get course statistics
   * @returns {Promise} Course data (total, published, in-review, etc.)
   */
  getCourseStatistics: () =>
    axiosInstance.get("/dashboards/admin/courses"),

  /**
   * Get activity logs and recent actions
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} type - Filter by activity type
   * @returns {Promise} Activity log entries
   */
  getActivityLogs: (page = 1, limit = 20, type = "") =>
    axiosInstance.get("/dashboards/admin/activity", {
      params: { page, limit, type },
    }),

  // ──────────────────────────────────────────────────────────────────────────
  // User Management
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Get all pending user approvals (teacher registrations, etc.)
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} userType - Filter by user type (teacher, student, etc.)
   * @returns {Promise} Pending approval list
   */
  getPendingApprovals: (page = 1, limit = 20, userType = "") =>
    axiosInstance.get("/dashboards/admin/pending-approvals", {
      params: { page, limit, user_type: userType },
    }),

  /**
   * Get a specific pending approval details
   * @param {string} approvalId - Approval request ID
   * @returns {Promise} Detailed approval request
   */
  getApprovalDetails: (approvalId) =>
    axiosInstance.get(`/dashboards/admin/pending-approvals/${approvalId}`),

  /**
   * Approve a pending user or request
   * @param {string} approvalId - Approval request ID
   * @param {Object} data - Approval data (notes, conditions, etc.)
   * @returns {Promise} Approval confirmation
   */
  approveRequest: (approvalId, data = {}) =>
    axiosInstance.post(`/dashboards/admin/pending-approvals/${approvalId}/approve`, data),

  /**
   * Reject a pending user or request
   * @param {string} approvalId - Approval request ID
   * @param {Object} data - Rejection data (reason, notes, etc.)
   * @returns {Promise} Rejection confirmation
   */
  rejectRequest: (approvalId, data = {}) =>
    axiosInstance.post(`/dashboards/admin/pending-approvals/${approvalId}/reject`, data),

  /**
   * Request additional documents/information for an approval
   * @param {string} approvalId - Approval request ID
   * @param {Object} data - Request data (required documents, deadline, etc.)
   * @returns {Promise} Request confirmation
   */
  requestAdditionalInfo: (approvalId, data = {}) =>
    axiosInstance.post(`/dashboards/admin/pending-approvals/${approvalId}/request-info`, data),

  // ──────────────────────────────────────────────────────────────────────────
  // Moderation & Content Control
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Get flagged/reported content for review
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} status - Filter by status (pending, reviewed, etc.)
   * @param {string} contentType - Filter by type (course, review, user, etc.)
   * @returns {Promise} List of flagged content
   */
  getFlaggedContent: (page = 1, limit = 20, status = "", contentType = "") =>
    axiosInstance.get("/dashboards/admin/flagged-content", {
      params: { page, limit, status, content_type: contentType },
    }),

  /**
   * Get details of flagged content
   * @param {string} flagId - Flag ID
   * @returns {Promise} Detailed flag information
   */
  getFlagDetails: (flagId) =>
    axiosInstance.get(`/dashboards/admin/flagged-content/${flagId}`),

  /**
   * Review and make decision on flagged content
   * @param {string} flagId - Flag ID
   * @param {Object} data - Decision data (action: 'approve', 'reject', 'remove', reason, etc.)
   * @returns {Promise} Review decision confirmation
   */
  reviewFlaggedContent: (flagId, data = {}) =>
    axiosInstance.post(`/dashboards/admin/flagged-content/${flagId}/review`, data),

  /**
   * Get course moderation queue
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} status - Filter by status (pending, approved, rejected)
   * @returns {Promise} Courses pending moderation
   */
  getCourseModeration: (page = 1, limit = 20, status = "") =>
    axiosInstance.get("/dashboards/admin/course-moderation", {
      params: { page, limit, status },
    }),

  /**
   * Approve a course for publication
   * @param {string} courseId - Course ID
   * @param {Object} data - Approval data (notes, conditions, etc.)
   * @returns {Promise} Course approval confirmation
   */
  approveCourse: (courseId, data = {}) =>
    axiosInstance.post(`/dashboards/admin/courses/${courseId}/approve`, data),

  /**
   * Reject a course from publication
   * @param {string} courseId - Course ID
   * @param {Object} data - Rejection reason and notes
   * @returns {Promise} Course rejection confirmation
   */
  rejectCourse: (courseId, data = {}) =>
    axiosInstance.post(`/dashboards/admin/courses/${courseId}/reject`, data),

  /**
   * Remove/delete inappropriate content
   * @param {string} contentId - Content ID
   * @param {string} contentType - Type of content (course, review, comment, etc.)
   * @param {Object} data - Removal details (reason, appeal_status, etc.)
   * @returns {Promise} Content removal confirmation
   */
  removeContent: (contentId, contentType, data = {}) =>
    axiosInstance.post(`/dashboards/admin/content/${contentType}/${contentId}/remove`, data),

  // ──────────────────────────────────────────────────────────────────────────
  // System Management & Configuration
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Get system configuration and settings
   * @returns {Promise} System settings
   */
  getSystemSettings: () =>
    axiosInstance.get("/dashboards/admin/settings"),

  /**
   * Update system configuration
   * @param {Object} settings - Settings to update
   * @returns {Promise} Updated settings
   */
  updateSystemSettings: (settings) =>
    axiosInstance.put("/dashboards/admin/settings", settings),

  /**
   * Get notification settings and templates
   * @returns {Promise} Notification configuration
   */
  getNotificationSettings: () =>
    axiosInstance.get("/dashboards/admin/notification-settings"),

  /**
   * Update notification settings
   * @param {Object} settings - Notification settings to update
   * @returns {Promise} Updated notification settings
   */
  updateNotificationSettings: (settings) =>
    axiosInstance.put("/dashboards/admin/notification-settings", settings),

  /**
   * Get payment/gateway settings
   * @returns {Promise} Payment configuration
   */
  getPaymentSettings: () =>
    axiosInstance.get("/dashboards/admin/payment-settings"),

  /**
   * Update payment settings
   * @param {Object} settings - Payment settings to update
   * @returns {Promise} Updated payment settings
   */
  updatePaymentSettings: (settings) =>
    axiosInstance.put("/dashboards/admin/payment-settings", settings),

  // ──────────────────────────────────────────────────────────────────────────
  // System Operations
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Trigger database backup
   * @returns {Promise} Backup status
   */
  triggerDatabaseBackup: () =>
    axiosInstance.post("/dashboards/admin/system/backup", {}),

  /**
   * Get backup history
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise} List of backups
   */
  getBackupHistory: (page = 1, limit = 10) =>
    axiosInstance.get("/dashboards/admin/system/backups", {
      params: { page, limit },
    }),

  /**
   * Trigger system optimization/cleanup
   * @returns {Promise} Optimization status
   */
  optimizeSystem: () =>
    axiosInstance.post("/dashboards/admin/system/optimize", {}),

  /**
   * Send system-wide notification to all users
   * @param {Object} data - Notification data (title, message, type, etc.)
   * @returns {Promise} Notification sent confirmation
   */
  sendSystemNotification: (data) =>
    axiosInstance.post("/dashboards/admin/system/notify", data),

  /**
   * Get system logs
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} level - Filter by log level (error, warning, info, debug)
   * @returns {Promise} System log entries
   */
  getSystemLogs: (page = 1, limit = 50, level = "") =>
    axiosInstance.get("/dashboards/admin/system/logs", {
      params: { page, limit, level },
    }),

  // ──────────────────────────────────────────────────────────────────────────
  // Reports & Analytics
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Generate admin report
   * @param {string} reportType - Type of report (users, revenue, courses, etc.)
   * @param {Object} filters - Report filters (date range, categories, etc.)
   * @returns {Promise} Report data
   */
  generateReport: (reportType, filters = {}) =>
    axiosInstance.post("/dashboards/admin/reports/generate", {
      report_type: reportType,
      filters,
    }),

  /**
   * Get system analytics
   * @param {string} metric - Metric to analyze (user_growth, revenue_trend, etc.)
   * @param {string} period - Period (daily, weekly, monthly, yearly)
   * @returns {Promise} Analytics data
   */
  getSystemAnalytics: (metric, period = "monthly") =>
    axiosInstance.get("/dashboards/admin/analytics", {
      params: { metric, period },
    }),

  /**
   * Export data in specified format
   * @param {string} dataType - Type of data to export (users, courses, payments, etc.)
   * @param {string} format - Export format (csv, xlsx, json, pdf)
   * @param {Object} filters - Data filters
   * @returns {Promise} Export file
   */
  exportData: (dataType, format = "csv", filters = {}) =>
    axiosInstance.post("/dashboards/admin/reports/export", {
      data_type: dataType,
      format,
      filters,
    }),

  // ──────────────────────────────────────────────────────────────────────────
  // Admin Audit & Access Control
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Get audit trail of admin actions
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} adminId - Filter by admin user
   * @returns {Promise} Audit log entries
   */
  getAuditTrail: (page = 1, limit = 50, adminId = "") =>
    axiosInstance.get("/dashboards/admin/audit-trail", {
      params: { page, limit, admin_id: adminId },
    }),

  /**
   * Get list of admin users and their permissions
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise} Admin users list
   */
  getAdminUsers: (page = 1, limit = 20) =>
    axiosInstance.get("/dashboards/admin/admin-users", {
      params: { page, limit },
    }),

  /**
   * Update admin user permissions
   * @param {string} adminId - Admin user ID
   * @param {Object} permissions - Permissions to update
   * @returns {Promise} Updated permissions
   */
  updateAdminPermissions: (adminId, permissions) =>
    axiosInstance.put(`/dashboards/admin/admin-users/${adminId}/permissions`, permissions),

  /**
   * Revoke admin access
   * @param {string} adminId - Admin user ID
   * @returns {Promise} Revocation confirmation
   */
  revokeAdminAccess: (adminId) =>
    axiosInstance.post(`/dashboards/admin/admin-users/${adminId}/revoke`, {}),

  // ──────────────────────────────────────────────────────────────────────────
  // Support & Feedback Management
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Get user support tickets/complaints
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} status - Filter by status (open, closed, pending)
   * @param {string} priority - Filter by priority (high, medium, low)
   * @returns {Promise} Support tickets
   */
  getSupportTickets: (page = 1, limit = 20, status = "", priority = "") =>
    axiosInstance.get("/dashboards/admin/support-tickets", {
      params: { page, limit, status, priority },
    }),

  /**
   * Get ticket details
   * @param {string} ticketId - Ticket ID
   * @returns {Promise} Detailed ticket information
   */
  getTicketDetails: (ticketId) =>
    axiosInstance.get(`/dashboards/admin/support-tickets/${ticketId}`),

  /**
   * Update ticket status
   * @param {string} ticketId - Ticket ID
   * @param {Object} data - Status update data (status, response, etc.)
   * @returns {Promise} Updated ticket
   */
  updateTicketStatus: (ticketId, data) =>
    axiosInstance.put(`/dashboards/admin/support-tickets/${ticketId}`, data),

  /**
   * Get user feedback/reviews for system
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise} User feedback
   */
  getUserFeedback: (page = 1, limit = 20) =>
    axiosInstance.get("/dashboards/admin/feedback", {
      params: { page, limit },
    }),
};

export default adminAPI;