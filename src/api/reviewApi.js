import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const reviewApi = {
  // Student APIs
  addOrUpdateReview: (courseId, reviewData) =>
    axios.post(`${API_BASE_URL}/v1/reviews/student/courses/${courseId}/review/`, reviewData, {
      withCredentials: true,
    }),

  getMyReview: (courseId) =>
    axios.get(`${API_BASE_URL}/v1/reviews/student/courses/${courseId}/my-review/`, {
      withCredentials: true,
    }),

  // Public APIs
  getCourseReviews: (courseId, page = 1, perPage = 10) =>
    axios.get(`${API_BASE_URL}/v1/reviews/courses/${courseId}/`, {
      params: { page, per_page: perPage },
      withCredentials: true,
    }),

  // Teacher APIs
  getTeacherCourseReviews: (courseId, page = 1, perPage = 10, approved = null) => {
    const params = { page, per_page: perPage };
    if (approved !== null) {
      params.approved = approved ? 'true' : 'false';
    }
    return axios.get(
      `${API_BASE_URL}/v1/reviews/teacher/courses/${courseId}/reviews/`,
      { params, withCredentials: true }
    );
  },

  // Admin APIs
  getAllReviews: (page = 1, perPage = 10, approved = null, courseId = null) => {
    const params = { page, per_page: perPage };
    if (approved !== null) {
      params.approved = approved ? 'true' : 'false';
    }
    if (courseId) {
      params.course_id = courseId;
    }
    return axios.get(`${API_BASE_URL}/v1/reviews/admin/reviews/`, {
      params,
      withCredentials: true,
    });
  },

  approveReview: (reviewId) =>
    axios.post(
      `${API_BASE_URL}/v1/reviews/admin/reviews/${reviewId}/approve/`,
      {},
      { withCredentials: true }
    ),

  rejectReview: (reviewId) =>
    axios.post(
      `${API_BASE_URL}/v1/reviews/admin/reviews/${reviewId}/reject/`,
      {},
      { withCredentials: true }
    ),

  deleteReview: (reviewId) =>
    axios.post(
      `${API_BASE_URL}/v1/reviews/admin/reviews/${reviewId}/delete/`,
      {},
      { withCredentials: true }
    ),
};

export default reviewApi;
