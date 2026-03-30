import axiosInstance from "./axios";

/**
 * Course Management API
 * All endpoints for courses, enrollments, content, analytics, and reviews
 */
export const courseAPI = {
  // --------------------------------------------------------------------------
  // Course CRUD
  // --------------------------------------------------------------------------

  createCourse: (courseData) => axiosInstance.post("/courses", courseData),

  getCourses: (queryParams = {}) =>
    axiosInstance.get("/courses", { params: queryParams }),

  getCourseDetails: (courseId) =>
    axiosInstance.get("/courses/details", { params: { course_id: courseId } }),

  updateCourse: (courseId, updateData) =>
    axiosInstance.put("/courses/update", updateData, {
      params: { course_id: courseId },
    }),

  deleteCourse: (courseId) =>
    axiosInstance.delete("/courses/delete", { params: { course_id: courseId } }),

  // --------------------------------------------------------------------------
  // Course Status & Visibility
  // --------------------------------------------------------------------------

  publishCourse: (courseId, data = {}) =>
    axiosInstance.put("/courses/publish", data, { params: { course_id: courseId } }),

  unpublishCourse: (courseId, data = {}) =>
    axiosInstance.put("/courses/unpublish", data, { params: { course_id: courseId } }),

  archiveCourse: (courseId, data = {}) =>
    axiosInstance.put("/courses/archive", data, { params: { course_id: courseId } }),

  unarchiveCourse: (courseId, data = {}) =>
    axiosInstance.put("/courses/unarchive", data, { params: { course_id: courseId } }),

  setCoursePrivate: (courseId, data = {}) =>
    axiosInstance.put("/courses/private", data, { params: { course_id: courseId } }),

  setCoursePublic: (courseId, data = {}) =>
    axiosInstance.put("/courses/public", data, { params: { course_id: courseId } }),

  // --------------------------------------------------------------------------
  // Enrollment & Stats
  // --------------------------------------------------------------------------

  enrollInCourse: (courseId, enrollmentData = {}) =>
    axiosInstance.post("/courses/enroll", enrollmentData, {
      params: { course_id: courseId },
    }),

  unenrollFromCourse: (courseId, userId) =>
    axiosInstance.delete("/courses/enroll", {
      params: { course_id: courseId, ...(userId ? { user_id: userId } : {}) },
    }),

  getMyCourses: (queryParams = {}) =>
    axiosInstance.get("/users/my-courses", { params: queryParams }),

  getTeacherDashboardStats: () => axiosInstance.get("/stats"),

  getCourseStats: (courseId) =>
    axiosInstance.get("/course/stats", { params: { course_id: courseId } }),

  getCourseEnrollments: (courseId, queryParams = {}) =>
    axiosInstance.get("/courses/enrollments", {
      params: { course_id: courseId, ...queryParams },
    }),

  // --------------------------------------------------------------------------
  // Enrollment Keys
  // --------------------------------------------------------------------------

  createEnrollmentKey: (courseId, keyData) =>
    axiosInstance.post("/courses/enrollment-keys", keyData, {
      params: { course_id: courseId },
    }),

  getEnrollmentKeys: (courseId, queryParams = {}) =>
    axiosInstance.get("/courses/enrollment-keys", {
      params: { course_id: courseId, ...queryParams },
    }),

  deactivateEnrollmentKey: (courseId, keyId) =>
    axiosInstance.put(
      "/courses/enrollment-keys/deactivate",
      {},
      { params: { course_id: courseId, key_id: keyId } }
    ),

  getEnrollmentKeyAnalytics: (courseId, keyId) =>
    axiosInstance.get("/courses/enrollment-keys/analytics", {
      params: { course_id: courseId, key_id: keyId },
    }),

  // --------------------------------------------------------------------------
  // Sections
  // --------------------------------------------------------------------------

  createSection: (courseId, sectionData) =>
    axiosInstance.post("/courses/sections", sectionData, {
      params: { course_id: courseId },
    }),

  updateSection: (courseId, sectionId, sectionData) =>
    axiosInstance.put("/courses/sections", sectionData, {
      params: { course_id: courseId, section_id: sectionId },
    }),

  deleteSection: (courseId, sectionId) =>
    axiosInstance.delete("/courses/sections", {
      params: { course_id: courseId, section_id: sectionId },
    }),

  reorderSections: (courseId, sections) =>
    axiosInstance.put(
      "/courses/sections/reorder",
      { sections },
      { params: { course_id: courseId } }
    ),

  // --------------------------------------------------------------------------
  // Lessons
  // --------------------------------------------------------------------------

  createLesson: (courseId, sectionId, lessonData) =>
    axiosInstance.post("/courses/sections/lessons", lessonData, {
      params: { course_id: courseId, section_id: sectionId },
    }),

  updateLesson: (courseId, lessonId, lessonData) =>
    axiosInstance.put("/courses/sections/lessons", lessonData, {
      params: { course_id: courseId, lesson_id: lessonId },
    }),

  deleteLesson: (courseId, lessonId) =>
    axiosInstance.delete("/courses/sections/lessons", {
      params: { course_id: courseId, lesson_id: lessonId },
    }),

  reorderLessons: (courseId, sectionId, lessons) =>
    axiosInstance.put(
      "/courses/sections/lessons/reorder",
      { lessons },
      { params: { course_id: courseId, section_id: sectionId } }
    ),

  completeLesson: (courseId, lessonId) =>
    axiosInstance.post(
      "/courses/lessons/complete",
      {},
      { params: { course_id: courseId, lesson_id: lessonId } }
    ),

  // --------------------------------------------------------------------------
  // Content (Video, Zoom, Text, PDF, Quiz)
  // --------------------------------------------------------------------------

  addVideoContent: (courseId, lessonId, contentData) =>
    axiosInstance.post("/courses/contents/video", contentData, {
      params: { course_id: courseId, lesson_id: lessonId },
    }),

  updateVideoContent: (courseId, lessonId, contentId, contentData) =>
    axiosInstance.put("/courses/contents/video", contentData, {
      params: { course_id: courseId, lesson_id: lessonId, content_id: contentId },
    }),

  streamVideoContent: (courseId, lessonId, contentId) =>
    axiosInstance.get("/courses/contents/stream", {
      params: { course_id: courseId, lesson_id: lessonId, content_id: contentId },
    }),

  addZoomContent: (courseId, lessonId, contentData) =>
    axiosInstance.post("/courses/contents/zoom", contentData, {
      params: { course_id: courseId, lesson_id: lessonId },
    }),

  updateZoomContent: (courseId, lessonId, contentId, contentData) =>
    axiosInstance.put("/courses/contents/zoom", contentData, {
      params: { course_id: courseId, lesson_id: lessonId, content_id: contentId },
    }),

  addTextContent: (courseId, lessonId, contentData) =>
    axiosInstance.post("/courses/contents/text", contentData, {
      params: { course_id: courseId, lesson_id: lessonId },
    }),

  updateTextContent: (courseId, lessonId, contentId, contentData) =>
    axiosInstance.put("/courses/contents/text", contentData, {
      params: { course_id: courseId, lesson_id: lessonId, content_id: contentId },
    }),

  getTextContent: (courseId, lessonId, contentId) =>
    axiosInstance.get("/courses/contents/text", {
      params: { course_id: courseId, lesson_id: lessonId, content_id: contentId },
    }),

  addPdfContent: (courseId, lessonId, contentData) =>
    axiosInstance.post("/courses/contents/pdf", contentData, {
      params: { course_id: courseId, lesson_id: lessonId },
    }),

  updatePdfContent: (courseId, lessonId, contentId, contentData) =>
    axiosInstance.put("/courses/contents/pdf", contentData, {
      params: { course_id: courseId, lesson_id: lessonId, content_id: contentId },
    }),

  downloadPdfContent: (courseId, lessonId, contentId) =>
    axiosInstance.get("/courses/contents/download", {
      params: { course_id: courseId, lesson_id: lessonId, content_id: contentId },
    }),

  addQuizContent: (courseId, lessonId, contentData) =>
    axiosInstance.post("/courses/contents/quiz", contentData, {
      params: { course_id: courseId, lesson_id: lessonId },
    }),

  updateQuizContent: (courseId, lessonId, contentId, contentData) =>
    axiosInstance.put("/courses/contents/quiz", contentData, {
      params: { course_id: courseId, lesson_id: lessonId, content_id: contentId },
    }),

  deleteContent: (courseId, lessonId, contentId) =>
    axiosInstance.delete("/courses/contents", {
      params: { course_id: courseId, lesson_id: lessonId, content_id: contentId },
    }),

  notifyContentUpdate: (courseId, lessonId, payload = {}) =>
    axiosInstance.post("/courses/contents/notify-update", payload, {
      params: { course_id: courseId, lesson_id: lessonId },
    }),

  getCourseContent: (courseId) =>
    axiosInstance.get("/courses/content", { params: { course_id: courseId } }),

  // --------------------------------------------------------------------------
  // Attendance, Recordings, and Progress Tracking
  // --------------------------------------------------------------------------

  getLessonAttendance: (courseId, lessonId) =>
    axiosInstance.get("/courses/attendance", {
      params: { course_id: courseId, lesson_id: lessonId },
    }),

  exportLessonAttendance: (courseId, lessonId) =>
    axiosInstance.get("/courses/attendance/export", {
      params: { course_id: courseId, lesson_id: lessonId },
    }),

  addRecording: (courseId, lessonId, recordingData) =>
    axiosInstance.post("/courses/recordings", recordingData, {
      params: { course_id: courseId, lesson_id: lessonId },
    }),

  distributeRecording: (courseId, lessonId, recordingId) =>
    axiosInstance.post(
      "/courses/recordings/distribute",
      {},
      { params: { course_id: courseId, lesson_id: lessonId, recording_id: recordingId } }
    ),

  getRecordingViews: (courseId, lessonId, recordingId) =>
    axiosInstance.get("/courses/recordings/views", {
      params: { course_id: courseId, lesson_id: lessonId, recording_id: recordingId },
    }),

  sendRecordingReminder: (courseId, lessonId, recordingId) =>
    axiosInstance.post(
      "/courses/recordings/reminder",
      {},
      { params: { course_id: courseId, lesson_id: lessonId, recording_id: recordingId } }
    ),

  updateWatchProgress: (courseId, lessonId, contentId, progressData) =>
    axiosInstance.post("/courses/contents/watch-progress", progressData, {
      params: { course_id: courseId, lesson_id: lessonId, content_id: contentId },
    }),

  recordZoomAttendance: (courseId, lessonId, contentId, attendanceData = {}) =>
    axiosInstance.post("/courses/contents/zoom-attendance", attendanceData, {
      params: { course_id: courseId, lesson_id: lessonId, content_id: contentId },
    }),

  getCourseProgress: (courseId) =>
    axiosInstance.get("/courses/progress", { params: { course_id: courseId } }),

  getActivityLog: (courseId, queryParams = {}) =>
    axiosInstance.get("/courses/activity-log", {
      params: { course_id: courseId, ...queryParams },
    }),

  trackActivity: (courseId, activityData) =>
    axiosInstance.post("/courses/track-activity", activityData, {
      params: { course_id: courseId },
    }),

  // --------------------------------------------------------------------------
  // Analytics & Reviews
  // --------------------------------------------------------------------------

  getCourseAnalytics: (courseId) =>
    axiosInstance.get("/courses/analytics", { params: { course_id: courseId } }),

  createReview: (courseId, reviewData) =>
    axiosInstance.post("/courses/reviews", reviewData, {
      params: { course_id: courseId },
    }),

  getReviews: (courseId, queryParams = {}) =>
    axiosInstance.get("/courses/reviews", {
      params: { course_id: courseId, ...queryParams },
    }),
};
