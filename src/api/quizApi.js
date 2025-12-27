import axiosInstance from './axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const teacherQuizAPI = { 
    teacherStat: () => axiosInstance.get(`${API_BASE_URL}quiz/teacher/stats/`),
    getTeacherAllQuizzes: () => axiosInstance.get(`${API_BASE_URL}quiz/teacher/quizzes/`),
    getTeacherQuizDetail: (quizId) => axiosInstance.get(`${API_BASE_URL}quiz/teacher/quizzes/${quizId}/`),
    createQuiz: (quizData) => axiosInstance.post(`${API_BASE_URL}quiz/teacher/quizzes/create/`, quizData),
    updateQuiz: (quizId, quizData) => axiosInstance.put(`${API_BASE_URL}quiz/teacher/quizzes/${quizId}/`, quizData),
    deleteQuiz: (quizId) => axiosInstance.delete(`${API_BASE_URL}quiz/teacher/quizzes/${quizId}/`),
    getQuizQuestions: (quizId) => axiosInstance.get(`${API_BASE_URL}quiz/teacher/quizzes/${quizId}/questions/`),
    createQuestion: (quizId, questionData) => axiosInstance.post(`${API_BASE_URL}quiz/teacher/quizzes/${quizId}/questions/`, questionData),
    getQuestionDetail: (questionId) => axiosInstance.get(`${API_BASE_URL}quiz/teacher/questions/${questionId}/`),
    updateQuestion: (questionId, questionData) => axiosInstance.put(`${API_BASE_URL}quiz/teacher/questions/${questionId}/`, questionData),
    deleteQuestion: (questionId) => axiosInstance.delete(`${API_BASE_URL}quiz/teacher/questions/${questionId}/`),
    updateQuestionOptions: (questionId, options) => axiosInstance.post(`${API_BASE_URL}quiz/teacher/questions/${questionId}/options/`, { options }),
    addQuestionToBank: (bankId, questionData) => axiosInstance.post(`${API_BASE_URL}quiz/teacher/question-banks/${bankId}/questions/`, questionData),
    getPendingQuizReviews: (quizId) => axiosInstance.get(`${API_BASE_URL}quiz/teacher/quizzes/${quizId}/pending-reviews/`),
    getQuizAttemptForReview: (attemptId) => axiosInstance.get(`${API_BASE_URL}quiz/teacher/attempts/${attemptId}/review/`),
    publishReviewedResults: (attemptId) => axiosInstance.post(`${API_BASE_URL}quiz/teacher/attempts/${attemptId}/review/`),
    gradeAnswer: (answerId, marks_awarded, feedback) => axiosInstance.post(`${API_BASE_URL}quiz/teacher/answers/${answerId}/grade/`, {
        marks_awarded,
        feedback
    }),
    getQuizAnalytics: (quizId) => axiosInstance.get(`${API_BASE_URL}quiz/teacher/quizzes/${quizId}/analytics/`),
    getQuizAttempts: (quizId) => axiosInstance.get(`${API_BASE_URL}quiz/teacher/quizzes/${quizId}/attempts/`),
};

export const studentQuizAPI = {
    getStudentCourseQuizzes: (courseId) => axiosInstance.get(`${API_BASE_URL}quiz/student/courses/${courseId}/quizzes/`),
    getStudentAllQuizzes: () => axiosInstance.get(`${API_BASE_URL}quiz/student/quizzes/`),
    getStudentQuizDetail: (quizId) => axiosInstance.get(`${API_BASE_URL}quiz/student/quizzes/${quizId}/`),
    startQuizAttempt: (quizId) => axiosInstance.post(`${API_BASE_URL}quiz/student/quizzes/${quizId}/start/`),
    getQuizAttemptDetail: (attemptId) => axiosInstance.get(`${API_BASE_URL}quiz/student/attempts/${attemptId}/`),
    saveQuizAnswer: (attemptId, questionId, answerData) => axiosInstance.post(`${API_BASE_URL}quiz/student/attempts/${attemptId}/answer/`, {
        question_id: questionId,
        ...answerData
    }),
    submitQuizAttempt: (attemptId, tabSwitches = 0) => axiosInstance.post(`${API_BASE_URL}quiz/student/attempts/${attemptId}/submit/`, {
        tab_switches: tabSwitches
    }),
    getQuizAttemptResult: (attemptId) => axiosInstance.get(`${API_BASE_URL}quiz/student/attempts/${attemptId}/result/`),
    getStudentQuizHistory: (quizId) => axiosInstance.get(`${API_BASE_URL}quiz/student/quizzes/${quizId}/history/`),
    getStudentAllQuizResults: () => axiosInstance.get(`${API_BASE_URL}quiz/student/quiz-results/`),
};

export const adminQuizAPI = {
    getAdminAllQuizzes: () => axiosInstance.get(`${API_BASE_URL}quiz/admin/quizzes/`),
    adminDisableQuiz: (quizId, action = 'disable') => axiosInstance.post(`${API_BASE_URL}quiz/admin/quizzes/${quizId}/disable/`, { action }),
    getAdminQuizAnalytics: () => axiosInstance.get(`${API_BASE_URL}quiz/admin/quiz-analytics/`),

};

export default {
  studentQuizAPI,
  teacherQuizAPI,
  adminQuizAPI,
};
