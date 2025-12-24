import axiosInstance from './axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';


export const teacherCourseAPI = {
  getCourses: () => axiosInstance.get(`${API_BASE_URL}courses/teacher/courses/`),
  getCourseDetails: (courseId) => axiosInstance.get(`${API_BASE_URL}courses/teacher/courses/${courseId}/`),
  createCourse: (courseData) => axiosInstance.post(`${API_BASE_URL}courses/teacher/courses/`, courseData),
  updateCourse: (courseId, courseData) => axiosInstance.put(`${API_BASE_URL}courses/teacher/courses/${courseId}/`, courseData),
  deleteCourse: (courseId) => axiosInstance.delete(`${API_BASE_URL}courses/teacher/courses/${courseId}/`),
  uploadThumbnail: (courseId, formData, config) => axiosInstance.post(`${API_BASE_URL}courses/teacher/courses/${courseId}/thumbnail/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    ...config
  }),
  deleteThumbnail: (courseId) => axiosInstance.delete(`${API_BASE_URL}courses/teacher/courses/${courseId}/thumbnail/`),
  createSection: (courseId, sectionData) => axiosInstance.post(`${API_BASE_URL}courses/teacher/courses/${courseId}/sections/`, sectionData),
  updateSection: (sectionId, sectionData) => axiosInstance.put(`${API_BASE_URL}courses/teacher/sections/${sectionId}/`, sectionData),
  deleteSection: (sectionId) => axiosInstance.delete(`${API_BASE_URL}courses/teacher/sections/${sectionId}/`),
  createLesson: (sectionId, lessonData) => axiosInstance.post(`${API_BASE_URL}courses/teacher/sections/${sectionId}/lessons/`, lessonData),
  updateLesson: (lessonId, lessonData) => axiosInstance.put(`${API_BASE_URL}courses/teacher/lessons/${lessonId}/`, lessonData),
  deleteLesson: (lessonId) => axiosInstance.delete(`${API_BASE_URL}courses/teacher/lessons/${lessonId}/`),
  uploadLessonFile: (lessonId, formData, config) => axiosInstance.post(`${API_BASE_URL}courses/teacher/lessons/${lessonId}/upload/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    ...config
  }),
  getZoomClasses: (courseId) => axiosInstance.get(`${API_BASE_URL}courses/teacher/courses/${courseId}/zoom-classes/`),
  createZoomClass: (courseId, zoomData) => axiosInstance.post(`${API_BASE_URL}courses/teacher/courses/${courseId}/zoom-classes/`, zoomData),
  getZoomClassDetails: (zoomClassId) => axiosInstance.get(`${API_BASE_URL}courses/teacher/zoom-classes/${zoomClassId}/`),
  updateZoomClass: (zoomClassId, zoomData) => axiosInstance.put(`${API_BASE_URL}courses/teacher/zoom-classes/${zoomClassId}/`, zoomData),
  deleteZoomClass: (zoomClassId) => axiosInstance.delete(`${API_BASE_URL}courses/teacher/zoom-classes/${zoomClassId}/`),
  uploadRecording: (zoomClassId, formData) => axiosInstance.post(`${API_BASE_URL}courses/teacher/zoom-classes/${zoomClassId}/recording/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getQuizzes: (courseId) => axiosInstance.get(`${API_BASE_URL}courses/teacher/courses/${courseId}/quizzes/`),
  createQuiz: (courseId, quizData) => axiosInstance.post(`${API_BASE_URL}courses/teacher/courses/${courseId}/quizzes/`, quizData),
  getQuizDetails: (quizId) => axiosInstance.get(`${API_BASE_URL}courses/teacher/quizzes/${quizId}/`),
  updateQuiz: (quizId, quizData) => axiosInstance.put(`${API_BASE_URL}courses/teacher/quizzes/${quizId}/`, quizData),
  deleteQuiz: (quizId) => axiosInstance.delete(`${API_BASE_URL}courses/teacher/quizzes/${quizId}/`),
  addQuestion: (quizId, questionData) => axiosInstance.post(`${API_BASE_URL}courses/teacher/quizzes/${quizId}/questions/`, questionData),
  updateQuestion: (questionId, questionData) => axiosInstance.put(`${API_BASE_URL}courses/teacher/questions/${questionId}/`, questionData),
  deleteQuestion: (questionId) => axiosInstance.delete(`${API_BASE_URL}courses/teacher/questions/${questionId}/`),
  getEnrolledStudents: (courseId) => axiosInstance.get(`${API_BASE_URL}courses/teacher/courses/${courseId}/students/`),
  getRevenueOverview: (params) => axiosInstance.get(`${API_BASE_URL}courses/teacher/revenue/`, { params }),
  getPayoutHistory: () => axiosInstance.get(`${API_BASE_URL}courses/teacher/payouts/`),
};

export const studentCourseAPI = {
  discoverCourses: (params) => axiosInstance.get(`${API_BASE_URL}courses/student/courses/`, { params }),
  getCourseDetails: (courseId) => axiosInstance.get(`${API_BASE_URL}courses/student/courses/${courseId}/`),
  enrollCourse: (courseId) => axiosInstance.post(`${API_BASE_URL}courses/student/courses/${courseId}/enroll/`),
  getEnrolledCourses: (params) => axiosInstance.get(`${API_BASE_URL}courses/student/enrolled-courses/`, { params }),
  getLesson: (lessonId) => axiosInstance.get(`${API_BASE_URL}courses/student/lessons/${lessonId}/`),
  updateLessonProgress: (lessonId, progressData) => axiosInstance.post(`${API_BASE_URL}courses/student/lessons/${lessonId}/`, progressData),
  getQuiz: (quizId) => axiosInstance.get(`${API_BASE_URL}courses/student/quizzes/${quizId}/attempt/`),
  submitQuiz: (quizId, answers) => axiosInstance.post(`${API_BASE_URL}courses/student/quizzes/${quizId}/attempt/`, { answers }),
};

export const adminCourseAPI = {
  getAllCourses: (params) => axiosInstance.get(`${API_BASE_URL}courses/admin/courses/`, { params }),
  approveCourse: (courseId, action) => axiosInstance.post(`${API_BASE_URL}courses/admin/courses/${courseId}/approve/`, { action }),
  featureCourse: (courseId, isFeatured) => axiosInstance.post(`${API_BASE_URL}courses/admin/courses/${courseId}/feature/`, { is_featured: isFeatured }),
  setCommission: (courseId, commissionPercentage) => axiosInstance.put(`${API_BASE_URL}courses/admin/courses/${courseId}/commission/`, { commission_percentage: commissionPercentage }),
  getDashboardStats: () => axiosInstance.get(`${API_BASE_URL}courses/admin/dashboard/`),
};

export const utilityAPI = {
  getCategories: () => axiosInstance.get(`${API_BASE_URL}courses/categories/`),
  getSubjects: () => axiosInstance.get(`${API_BASE_URL}courses/subjects/`),
  getGradeLevels: () => axiosInstance.get(`${API_BASE_URL}courses/grade-levels/`),
};

export default {
  teacher: teacherCourseAPI,
  student: studentCourseAPI,
  admin: adminCourseAPI,
  utility: utilityAPI,
};
