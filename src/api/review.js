import axiosInstance from './axios';

const REVIEW_BASE = '/reviews';

export const reviewAPI = {
	createReview: (courseId, reviewData) =>
		axiosInstance.post(REVIEW_BASE, reviewData, {
			params: { course_id: courseId },
		}),

	getReviews: (courseId, queryParams = {}) =>
		axiosInstance.get(REVIEW_BASE, {
			params: { course_id: courseId, ...queryParams },
		}),
};

export default reviewAPI;
