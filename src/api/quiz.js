import { API_ENDPOINTS } from "../utils/constants";
import axiosInstance from "./axios";

/**
 * Quiz Management API
 * All endpoints for quiz CRUD operations, questions, attempts, and grading
 */
export const quizAPI = {
  /**
   * Create a new quiz
   * @param {Object} quizData - Quiz details (title, description, duration_minutes, etc.)
   * @returns {Promise} Created quiz data
   */
  createQuiz: (quizData) =>
    axiosInstance.post("/quiz/", quizData),

  /**
   * Get all quizzes for the current user (teacher)
   * @returns {Promise} List of quizzes
   */
  getAllQuizzes: (params = {}) =>
    axiosInstance.get("/quiz/", { params }),

  /**
   * Get quizzes for a specific course
   * @param {string} courseId - Course ID
   * @returns {Promise} List of quizzes for the course
   */
  getQuizzesForCourse: (courseId) =>
    axiosInstance.get("/quiz/", { params: { course_id: courseId } }),

  /**
   * Get detailed information for a specific quiz
   * @param {string} quizId - Quiz ID
   * @returns {Promise} Quiz details with questions and settings
   */
  getQuizDetails: (quizId) =>
    axiosInstance.get("/quiz/details", { params: { quiz_id: quizId } }),

  /**
   * Update a quiz
   * @param {string} quizId - Quiz ID
   * @param {Object} updateData - Fields to update
   * @returns {Promise} Updated quiz data
   */
  updateQuiz: (quizId, updateData) =>
    axiosInstance.put("/quiz/update", updateData, { params: { quiz_id: quizId } }),

  /**
   * Delete a quiz
   * @param {string} quizId - Quiz ID
   * @returns {Promise} Deletion confirmation
   */
  deleteQuiz: (quizId) =>
    axiosInstance.delete("/quiz/delete", { params: { quiz_id: quizId } }),

  /**
   * Assign courses to a quiz
   * @param {string} quizId - Quiz ID
   * @param {Array|string} courseIds - Single course ID or array of course IDs
   * @returns {Promise} Updated quiz with assigned courses
   */
  assignCoursesToQuiz: (quizId, courseIds) =>
    axiosInstance.post("/quiz/courses/assign", {
      quiz_id: quizId,
      course_ids: courseIds,
    }),

  /**
   * Remove courses from a quiz
   * @param {string} quizId - Quiz ID
   * @param {Array|string} courseIds - Single course ID or array of course IDs to remove
   * @returns {Promise} Updated quiz with remaining courses
   */
  removeCoursesFromQuiz: (quizId, courseIds) =>
    axiosInstance.post("/quiz/courses/remove", {
      quiz_id: quizId,
      course_ids: courseIds,
    }),

  // ──────────────────────────────────────────────────────────────────────────
  // Question Management
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Create one or multiple questions for a quiz
   * @param {string} quizId - Quiz ID
   * @param {Object|Array} questionData - Single question or array of questions
   * @returns {Promise} Created question(s)
   */
  createQuestions: (quizId, questionData) => {
    // Filter out frontend-only fields and convert types
    const cleanData = { ...questionData };
    const imageFile = cleanData.image;
    delete cleanData.image;
    delete cleanData.existing_image;
    delete cleanData.remove_image;
    
    // Convert points to integer
    if (cleanData.points !== undefined && cleanData.points !== null) {
      cleanData.points = parseInt(cleanData.points, 10);
    }
    
    // If there's an image file, use FormData
    if (imageFile) {
      const formData = new FormData();
      formData.append('quiz_id', quizId);
      
      // Append all other fields
      Object.entries(cleanData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      
      // Append the image file
      formData.append('image', imageFile);
      
      return axiosInstance.post("/quiz/questions", formData);
    }
    
    // Normal JSON request without image
    return axiosInstance.post("/quiz/questions", {
      quiz_id: quizId,
      ...cleanData,
    });
  },

  /**
   * Get all questions for a quiz
   * @param {string} quizId - Quiz ID
   * @returns {Promise} List of quiz questions
   */
  getQuizQuestions: (quizId) =>
    axiosInstance.get("/quiz/questions", { params: { quiz_id: quizId } }),

  /**
   * Update a question
   * @param {string} questionId - Question ID
   * @param {Object} updateData - Fields to update
   * @returns {Promise} Updated question data
   */
  updateQuestion: (questionId, updateData) => {
    // Handle image file if present
    const cleanData = { ...updateData };
    const imageFile = cleanData.image;
    delete cleanData.image;
    delete cleanData.existing_image;
    delete cleanData.remove_image;
    
    // Convert points to integer if present
    if (cleanData.points !== undefined && cleanData.points !== null) {
      cleanData.points = parseInt(cleanData.points, 10);
    }
    
    // If there's an image file or explicit remove_image flag, use FormData
    if (imageFile || updateData.remove_image) {
      const formData = new FormData();
      
      // Append all fields
      Object.entries(cleanData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      
      // Append the image file if present
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      // Append remove_image flag if true
      if (updateData.remove_image) {
        formData.append('remove_image', 'true');
      }
      
      return axiosInstance.put("/quiz/update/questions", formData, { params: { question_id: questionId } });
    }
    
    // Normal JSON request without file operations
    return axiosInstance.put("/quiz/update/questions", cleanData, { params: { question_id: questionId } });
  },

  /**
   * Update question order (single or batch)
   * @param {string} quizId - Quiz ID
   * @param {Array} orderData - Array of {question_id, question_order}
   * @returns {Promise} Updated questions
   */
  updateQuestionOrder: (quizId, orderData) =>
    axiosInstance.put("/quiz/questions/order", orderData),

  /**
   * Delete a question
   * @param {string} questionId - Question ID
   * @returns {Promise} Deletion confirmation
   */
  deleteQuestion: (questionId) =>
    axiosInstance.delete("/quiz/delete/questions", { params: { question_id: questionId } }),

  // ──────────────────────────────────────────────────────────────────────────
  // Quiz Attempt & Submission
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Start a quiz attempt
   * @param {string} quizId - Quiz ID
   * @returns {Promise} Created attempt with attempt_id
   */
  startQuizAttempt: (quizId, courseId = null) =>
    axiosInstance.post("/quiz/attempts", null, {
      params: {
        quiz_id: quizId,
        ...(courseId ? { course_id: courseId } : {}),
      },
    }),

  /**
   * Get an active in-progress attempt for a quiz (resume support)
   * @param {string} quizId - Quiz ID
   * @returns {Promise} Active attempt with questions and saved answers
   */
  getActiveAttempt: (quizId) =>
    axiosInstance.get("/quiz/attempts/active", {
      params: { quiz_id: quizId },
    }),

  /**
   * Save/update an answer for a quiz attempt
   * @param {string} attemptId - Attempt ID
   * @param {Object} answerData - Answer details with question_id, answer, etc.
   * @returns {Promise} Saved answer confirmation
   */
  saveAnswer: (attemptId, answerData) =>
    axiosInstance.post(`/quiz/submit/answers/${attemptId}`, answerData),

  /**
   * Submit a quiz attempt
   * @param {string} attemptId - Attempt ID
   * @returns {Promise} Submitted quiz result
   */
  submitQuiz: (attemptId) =>
    axiosInstance.post(`/quiz/attempts/${attemptId}/submit`),

  /**
   * Get all quiz results for a student (student dashboard)
   * @returns {Promise} List of completed quizzes with scores
   */
  getStudentQuizResults: () =>
    axiosInstance.get("/quiz/results"),

  /**
   * Get results for a specific quiz (all student attempts)
   * @param {string} quizId - Quiz ID
   * @returns {Promise} Quiz results for all students
   */
  getQuizResults: (quizId) =>
    axiosInstance.get(`/quiz/${quizId}/results`),

  /**
   * Get detailed data for a specific quiz attempt
   * @param {string} attemptId - Attempt ID
   * @returns {Promise} Attempt, quiz, question answers, and statistics
   */
  getAttemptDetails: (attemptId) =>
    axiosInstance.get(`/quiz/attempts/${attemptId}`),

  // ──────────────────────────────────────────────────────────────────────────
  // Grading Endpoints
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Get submission for grading (essay/manual review)
   * @param {string} quizId - Quiz ID
   * @param {string} userId - Student user ID
   * @returns {Promise} Student submission details
   */
  getSubmissionForGrading: (quizId, userId) =>
    axiosInstance.get(`/quiz/${quizId}/submissions/${userId}`),

  /**
   * Grade an essay/manual review answer
   * @param {string} answerId - Answer ID
   * @param {Object} gradeData - Grade and feedback details
   * @returns {Promise} Graded answer confirmation
   */
  gradeAnswer: (answerId, gradeData) =>
    axiosInstance.post(`/quiz/answers/${answerId}/grade`, gradeData),

  // ──────────────────────────────────────────────────────────────────────────
  // Analytics Endpoints
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Get teacher dashboard statistics
   * @returns {Promise} Dashboard stats (total, published, draft, this month)
   */
  getTeacherDashboardStats: () =>
    axiosInstance.get("/quiz/teacher/stats"),

  /**
   * Get quiz statistics (instructor view)
   * @param {string} quizId - Quiz ID
   * @returns {Promise} Quiz statistics (avg score, participation, etc.)
   */
  getQuizStatistics: (quizId) =>
    axiosInstance.get(`/quiz/${quizId}/statistics`),

  /**
   * Get question analytics (difficulty, answer distribution, etc.)
   * @param {string} questionId - Question ID
   * @returns {Promise} Question analytics data
   */
  getQuestionAnalytics: (questionId) =>
    axiosInstance.get(`/quiz/questions/${questionId}/analytics`),

  /**
   * Get question statistics for manage questions page
   * @param {string} quizId - Quiz ID
   * @returns {Promise} Stats including total_questions, total_marks, auto_graded, manual_review
   */
  getQuizQuestionStats: (quizId) =>
    axiosInstance.get(`/quiz/${quizId}/questions/stats`),

  /**
   * Get quiz results for teacher with all student attempts
   * @param {string} quizId - Quiz ID
   * @returns {Promise} Quiz details, analytics, and list of student attempts
   */
  getQuizResultsForTeacher: (quizId) =>
    axiosInstance.get(`/quiz/${quizId}/teacher/results`),
};
