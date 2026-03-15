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
    axiosInstance.post("/quiz", quizData),

  /**
   * Get all quizzes for the current user (teacher)
   * @returns {Promise} List of quizzes
   */
  getAllQuizzes: () =>
    axiosInstance.get("/quiz"),

  /**
   * Get quizzes for a specific course
   * @param {string} courseId - Course ID
   * @returns {Promise} List of quizzes for the course
   */
  getQuizzesForCourse: (courseId) =>
    axiosInstance.get("/quiz", { params: { course_id: courseId } }),

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
  createQuestions: (quizId, questionData) =>
    axiosInstance.post("/quiz/questions", {
      quiz_id: quizId,
      ...questionData,
    }),

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
  updateQuestion: (questionId, updateData) =>
    axiosInstance.put("/quiz/update/questions", updateData, { params: { question_id: questionId } }),

  /**
   * Update question order (single or batch)
   * @param {string} quizId - Quiz ID
   * @param {Array} orderData - Array of {question_id, new_order}
   * @returns {Promise} Updated questions
   */
  updateQuestionOrder: (quizId, orderData) =>
    axiosInstance.put("/quiz/questions/order", {
      quiz_id: quizId,
      questions: orderData,
    }),

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
  startQuizAttempt: (quizId) =>
    axiosInstance.post("/quiz/attempts", {
      quiz_id: quizId,
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
};
