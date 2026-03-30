import { API_ENDPOINTS } from "../utils/constants";
import axiosInstance from "./axios";

/**
 * Course Management API
 * All endpoints for course CRUD, enrollment, and management
 */
export const courseAPI = {
  // ──────────────────────────────────────────────────────────────────────────
  // Course CRUD Operations
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Create a new course
   * @param {Object} courseData - Course details (title, description, category_id, etc.)
   * @returns {Promise} Created course data
   */
  createCourse: (courseData) =>
    axiosInstance.post("/courses", courseData),

  /**
   * Search/list published courses
   * @param {string} query - Search query
   * @param {string} categoryId - Filter by category
   * @param {string} courseType - Filter by course type
   * @param {string} difficulty - Filter by difficulty level
   * @param {string} language - Filter by language
   * @param {boolean} isPaid - Filter by paid/free
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 20)
   * @returns {Promise} Paginated course list
   */
  searchCourses: (query = "", categoryId = "", courseType = "", difficulty = "", language = "", isPaid = null, page = 1, limit = 20) =>
    axiosInstance.get("/courses", {
      params: {
        q: query,
        category_id: categoryId,
        course_type: courseType,
        difficulty,
        language,
        is_paid: isPaid,
        page,
        limit,
      },
    }),

  /**
   * Get all course categories
   * @returns {Promise} List of categories
   */
  getCategories: () =>
    axiosInstance.get("/courses/categories"),

  /**
   * Get detailed information about a specific course
   * @param {string} courseId - Course ID
   * @returns {Promise} Course details
   */
  getCourse: (courseId) =>
    axiosInstance.get(`/courses/${courseId}`),

  /**
   * Update course details
   * @param {string} courseId - Course ID
   * @param {Object} updateData - Fields to update
   * @returns {Promise} Updated course data
   */
  updateCourse: (courseId, updateData) =>
    axiosInstance.put(`/courses/${courseId}`, updateData),

  /**
   * Delete a course
   * @param {string} courseId - Course ID
   * @returns {Promise} Deletion confirmation
   */
  deleteCourse: (courseId) =>
    axiosInstance.delete(`/courses/${courseId}`),

  // ──────────────────────────────────────────────────────────────────────────
  // Course Status & Visibility
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Publish a draft course
   * @param {string} courseId - Course ID
   * @param {Object} data - Publish details (reason, etc.)
   * @returns {Promise} Published course data
   */
  publishCourse: (courseId, data = {}) =>
    axiosInstance.put(`/courses/${courseId}/publish`, data),

  /**
   * Unpublish a published course
   * @param {string} courseId - Course ID
   * @param {Object} data - Unpublish details (reason, etc.)
   * @returns {Promise} Unpublished course data
   */
  unpublishCourse: (courseId, data = {}) =>
    axiosInstance.put(`/courses/${courseId}/unpublish`, data),

  /**
   * Archive a course
   * @param {string} courseId - Course ID
   * @returns {Promise} Archived course data
   */
  archiveCourse: (courseId) =>
    axiosInstance.put(`/courses/${courseId}/archive`, {}),

  /**
   * Unarchive a course
   * @param {string} courseId - Course ID
   * @returns {Promise} Unarchived course data
   */
  unarchiveCourse: (courseId) =>
    axiosInstance.put(`/courses/${courseId}/unarchive`, {}),

  // ──────────────────────────────────────────────────────────────────────────
  // Enrollment Management
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Get course enrollment key
   * @param {string} courseId - Course ID
   * @returns {Promise} Enrollment key details
   */
  getCourseEnrollmentKey: (courseId) =>
    axiosInstance.get(`/courses/${courseId}/enrollment-key`),

  /**
   * Generate new enrollment key
   * @param {string} courseId - Course ID
   * @returns {Promise} New enrollment key
   */
  generateEnrollmentKey: (courseId) =>
    axiosInstance.post(`/courses/${courseId}/enrollment-key/generate`, {}),

  /**
   * Enroll in a course
   * @param {string} courseId - Course ID
   * @param {Object} enrollmentData - Enrollment details (enrollment_key, etc.)
   * @returns {Promise} Enrollment confirmation
   */
  enrollCourse: (courseId, enrollmentData = {}) =>
    axiosInstance.post(`/courses/${courseId}/enroll`, enrollmentData),

  /**
   * Unenroll from a course
   * @param {string} courseId - Course ID
   * @returns {Promise} Unenrollment confirmation
   */
  unenrollCourse: (courseId) =>
    axiosInstance.post(`/courses/${courseId}/unenroll`, {}),

  /**
   * Get enrolled students in a course
   * @param {string} courseId - Course ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise} List of enrolled students
   */
  getEnrolledStudents: (courseId, page = 1, limit = 20) =>
    axiosInstance.get(`/courses/${courseId}/students`, {
      params: { page, limit },
    }),

  // ──────────────────────────────────────────────────────────────────────────
  // Course Content (Sections and Lessons)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Get course sections
   * @param {string} courseId - Course ID
   * @returns {Promise} List of course sections
   */
  getCourseSections: (courseId) =>
    axiosInstance.get(`/courses/${courseId}/sections`),

  /**
   * Create a new section in a course
   * @param {string} courseId - Course ID
   * @param {Object} sectionData - Section details (title, description, etc.)
   * @returns {Promise} Created section
   */
  createSection: (courseId, sectionData) =>
    axiosInstance.post(`/courses/${courseId}/sections`, sectionData),

  /**
   * Update a course section
   * @param {string} courseId - Course ID
   * @param {string} sectionId - Section ID
   * @param {Object} updateData - Fields to update
   * @returns {Promise} Updated section
   */
  updateSection: (courseId, sectionId, updateData) =>
    axiosInstance.put(`/courses/${courseId}/sections/${sectionId}`, updateData),

  /**
   * Delete a course section
   * @param {string} courseId - Course ID
   * @param {string} sectionId - Section ID
   * @returns {Promise} Deletion confirmation
   */
  deleteSection: (courseId, sectionId) =>
    axiosInstance.delete(`/courses/${courseId}/sections/${sectionId}`),

  /**
   * Get lessons in a section
   * @param {string} courseId - Course ID
   * @param {string} sectionId - Section ID
   * @returns {Promise} List of lessons
   */
  getSectionLessons: (courseId, sectionId) =>
    axiosInstance.get(`/courses/${courseId}/sections/${sectionId}/lessons`),

  /**
   * Create a new lesson in a section
   * @param {string} courseId - Course ID
   * @param {string} sectionId - Section ID
   * @param {Object} lessonData - Lesson details (title, content, type, etc.)
   * @returns {Promise} Created lesson
   */
  createLesson: (courseId, sectionId, lessonData) =>
    axiosInstance.post(`/courses/${courseId}/sections/${sectionId}/lessons`, lessonData),

  /**
   * Update a lesson
   * @param {string} courseId - Course ID
   * @param {string} sectionId - Section ID
   * @param {string} lessonId - Lesson ID
   * @param {Object} updateData - Fields to update
   * @returns {Promise} Updated lesson
   */
  updateLesson: (courseId, sectionId, lessonId, updateData) =>
    axiosInstance.put(`/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`, updateData),

  /**
   * Delete a lesson
   * @param {string} courseId - Course ID
   * @param {string} sectionId - Section ID
   * @param {string} lessonId - Lesson ID
   * @returns {Promise} Deletion confirmation
   */
  deleteLesson: (courseId, sectionId, lessonId) =>
    axiosInstance.delete(`/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`),

  // ──────────────────────────────────────────────────────────────────────────
  // Course Progress & Completion
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Get student progress in a course
   * @param {string} courseId - Course ID
   * @returns {Promise} Progress details
   */
  getCourseProgress: (courseId) =>
    axiosInstance.get(`/courses/${courseId}/progress`),

  /**
   * Mark lesson as complete
   * @param {string} courseId - Course ID
   * @param {string} lessonId - Lesson ID
   * @returns {Promise} Completion confirmation
   */
  markLessonComplete: (courseId, lessonId) =>
    axiosInstance.post(`/courses/${courseId}/lessons/${lessonId}/complete`, {}),

  /**
   * Mark lesson as incomplete
   * @param {string} courseId - Course ID
   * @param {string} lessonId - Lesson ID
   * @returns {Promise} Completion removal confirmation
   */
  markLessonIncomplete: (courseId, lessonId) =>
    axiosInstance.post(`/courses/${courseId}/lessons/${lessonId}/incomplete`, {}),

  /**
   * Get course completion status
   * @param {string} courseId - Course ID
   * @returns {Promise} Completion status
   */
  getCourseCompletion: (courseId) =>
    axiosInstance.get(`/courses/${courseId}/completion`),

  // ──────────────────────────────────────────────────────────────────────────
  // Course Reviews & Ratings
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Get course reviews
   * @param {string} courseId - Course ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise} List of reviews
   */
  getCourseReviews: (courseId, page = 1, limit = 10) =>
    axiosInstance.get(`/courses/${courseId}/reviews`, {
      params: { page, limit },
    }),

  /**
   * Submit a review for a course
   * @param {string} courseId - Course ID
   * @param {Object} reviewData - Review details (rating, comment, etc.)
   * @returns {Promise} Submitted review
   */
  submitCourseReview: (courseId, reviewData) =>
    axiosInstance.post(`/courses/${courseId}/reviews`, reviewData),

  /**
   * Update a review
   * @param {string} courseId - Course ID
   * @param {string} reviewId - Review ID
   * @param {Object} updateData - Updated review data
   * @returns {Promise} Updated review
   */
  updateCourseReview: (courseId, reviewId, updateData) =>
    axiosInstance.put(`/courses/${courseId}/reviews/${reviewId}`, updateData),

  /**
   * Delete a review
   * @param {string} courseId - Course ID
   * @param {string} reviewId - Review ID
   * @returns {Promise} Deletion confirmation
   */
  deleteCourseReview: (courseId, reviewId) =>
    axiosInstance.delete(`/courses/${courseId}/reviews/${reviewId}`),

  // ──────────────────────────────────────────────────────────────────────────
  // Course Analytics
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Get course analytics (instructor view)
   * @param {string} courseId - Course ID
   * @returns {Promise} Analytics data (enrollments, completion rate, etc.)
   */
  getCourseAnalytics: (courseId) =>
    axiosInstance.get(`/courses/${courseId}/analytics`),

  /**
   * Get course statistics (sections, lessons, students, rating)
   * @param {string} courseId - Course ID
   * @returns {Promise} Course statistics data
   */
  getCourseStats: (courseId) =>
    axiosInstance.get(`/courses/${courseId}/stats`),

  /**
   * Get teacher dashboard statistics
   * @returns {Promise} Dashboard statistics (total courses, active courses, students, revenue)
   */
  getTeacherDashboardStats: () =>
    axiosInstance.get(`/users/teacher-dashboard/stats`),

  /**
   * Get student progress analytics
   * @param {string} courseId - Course ID
   * @returns {Promise} Student progress data
   */
  getStudentProgressAnalytics: (courseId) =>
    axiosInstance.get(`/courses/${courseId}/student-progress-analytics`),

  // ──────────────────────────────────────────────────────────────────────────
  // Course Activity
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Get course activity log
   * @param {string} courseId - Course ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise} Activity log entries
   */
  getCourseActivity: (courseId, page = 1, limit = 20) =>
    axiosInstance.get(`/courses/${courseId}/activity`, {
      params: { page, limit },
    }),
};
