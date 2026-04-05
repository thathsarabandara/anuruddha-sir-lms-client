import axiosInstance from './axios';

const COURSE_BASE = '/course';

/**
 * Course Management API
 * All endpoints for courses, enrollment, content, analytics, and reviews
 */
export const courseAPI = {
	// ---------------------------------------------------------------------------
	// Course CRUD
	// ---------------------------------------------------------------------------

	createCourse: (courseData) => axiosInstance.post(`${COURSE_BASE}/`, courseData),

	getCourses: (queryParams = {}) => axiosInstance.get(`${COURSE_BASE}/`, { params: queryParams }),

	getTeacherCourses: (queryParams = {}) =>
		axiosInstance.get(`${COURSE_BASE}/teacher/courses`, { params: queryParams }),

	getCourseDetails: (courseId) =>
		axiosInstance.get(`${COURSE_BASE}/details`, { params: { course_id: courseId } }),

	updateCourse: (courseId, updateData) =>
		axiosInstance.put(`${COURSE_BASE}/update`, updateData, {
			params: { course_id: courseId },
		}),

	uploadCourseThumbnail: (courseId, file, onUploadProgress) => {
		const formData = new FormData();
		formData.append('thumbnail', file);

		return axiosInstance.post(`${COURSE_BASE}/thumbnail/upload`, formData, {
			params: { course_id: courseId },
			headers: { 'Content-Type': 'multipart/form-data' },
			...(onUploadProgress ? { onUploadProgress } : {}),
		});
	},

	deleteCourseThumbnail: (courseId) =>
		axiosInstance.delete(`${COURSE_BASE}/thumbnail`, {
			params: { course_id: courseId },
		}),

	deleteCourse: (courseId) =>
		axiosInstance.delete(`${COURSE_BASE}/delete`, { params: { course_id: courseId } }),

	// ---------------------------------------------------------------------------
	// Course Status & Visibility
	// ---------------------------------------------------------------------------

	publishCourse: (courseId, data = {}) =>
		axiosInstance.put(`${COURSE_BASE}/publish`, data, {
			params: { course_id: courseId },
		}),

	unpublishCourse: (courseId, data = {}) =>
		axiosInstance.put(`${COURSE_BASE}/unpublish`, data, {
			params: { course_id: courseId },
		}),

	archiveCourse: (courseId, data = {}) =>
		axiosInstance.put(`${COURSE_BASE}/archive`, data, {
			params: { course_id: courseId },
		}),

	unarchiveCourse: (courseId, data = {}) =>
		axiosInstance.put(`${COURSE_BASE}/unarchive`, data, {
			params: { course_id: courseId },
		}),

	setCoursePrivate: (courseId, data = {}) =>
		axiosInstance.put(`${COURSE_BASE}/private`, data, {
			params: { course_id: courseId },
		}),

	setCoursePublic: (courseId, data = {}) =>
		axiosInstance.put(`${COURSE_BASE}/public`, data, {
			params: { course_id: courseId },
		}),

	// ---------------------------------------------------------------------------
	// Enrollment & Dashboard Stats
	// ---------------------------------------------------------------------------

	enrollInCourse: (courseId, enrollmentData = {}) =>
		axiosInstance.post(`${COURSE_BASE}/enroll`, enrollmentData, {
			params: { course_id: courseId },
		}),

	unenrollFromCourse: (courseId, userId) =>
		axiosInstance.delete(`${COURSE_BASE}/enroll`, {
			params: { course_id: courseId, ...(userId ? { user_id: userId } : {}) },
		}),

	getMyCourses: (queryParams = {}) =>
		axiosInstance.get(`${COURSE_BASE}/users/my-courses`, { params: queryParams }),

	getTeacherDashboardStats: () => axiosInstance.get(`${COURSE_BASE}/stats`),

	getCourseStats: (courseId) =>
		axiosInstance.get(`${COURSE_BASE}/stats`, {
			params: { course_id: courseId },
		}),

	getCourseEnrollments: (courseId, queryParams = {}) =>
		axiosInstance.get(`${COURSE_BASE}/courses/enrollments`, {
			params: { course_id: courseId, ...queryParams },
		}),

	// ---------------------------------------------------------------------------
	// Enrollment Keys
	// ---------------------------------------------------------------------------

	createEnrollmentKey: (courseId, keyData) =>
		axiosInstance.post(`${COURSE_BASE}/enrollment-keys`, keyData, {
			params: { course_id: courseId },
		}),

	getEnrollmentKeys: (courseId, queryParams = {}) =>
		axiosInstance.get(`${COURSE_BASE}/enrollment-keys`, {
			params: { course_id: courseId, ...queryParams },
		}),

	deactivateEnrollmentKey: (courseId, keyId) =>
		axiosInstance.put(
			`${COURSE_BASE}/enrollment-keys/deactivate`,
			{},
			{ params: { course_id: courseId, key_id: keyId } }
		),

	getEnrollmentKeyAnalytics: (courseId, keyId) =>
		axiosInstance.get(`${COURSE_BASE}/enrollment-keys/analytics`, {
			params: { course_id: courseId, key_id: keyId },
		}),

	// ---------------------------------------------------------------------------
	// Sections
	// ---------------------------------------------------------------------------

	createSection: (courseId, sectionData) =>
		axiosInstance.post(`${COURSE_BASE}/sections`, sectionData, {
			params: { course_id: courseId },
		}),

	updateSection: (courseId, sectionId, sectionData) =>
		axiosInstance.put(`${COURSE_BASE}/sections`, sectionData, {
			params: { course_id: courseId, section_id: sectionId },
		}),

	deleteSection: (courseId, sectionId) =>
		axiosInstance.delete(`${COURSE_BASE}/sections`, {
			params: { course_id: courseId, section_id: sectionId },
		}),

	reorderSections: (courseId, sections) =>
		axiosInstance.put(
			`${COURSE_BASE}/sections/reorder`,
			{ sections },
			{ params: { course_id: courseId } }
		),

	// ---------------------------------------------------------------------------
	// Lessons
	// ---------------------------------------------------------------------------

	createLesson: (courseId, sectionId, lessonData) =>
		axiosInstance.post(`${COURSE_BASE}/sections/lessons`, lessonData, {
			params: { course_id: courseId, section_id: sectionId },
		}),

	updateLesson: (courseId, lessonId, lessonData) =>
		axiosInstance.put(`${COURSE_BASE}/sections/lessons`, lessonData, {
			params: { course_id: courseId, lesson_id: lessonId },
		}),

	deleteLesson: (courseId, lessonId) =>
		axiosInstance.delete(`${COURSE_BASE}/sections/lessons`, {
			params: { course_id: courseId, lesson_id: lessonId },
		}),

	reorderLessons: (courseId, sectionId, lessons) =>
		axiosInstance.put(
			`${COURSE_BASE}/sections/lessons/reorder`,
			{ lessons },
			{ params: { course_id: courseId, section_id: sectionId } }
		),

	completeLesson: (courseId, lessonId) =>
		axiosInstance.post(
			`${COURSE_BASE}/lessons/complete`,
			{},
			{ params: { course_id: courseId, lesson_id: lessonId } }
		),

	// ---------------------------------------------------------------------------
	// Content Management (Video, Zoom, Text, PDF, Quiz)
	// ---------------------------------------------------------------------------

	addVideoContent: (courseId, lessonId, contentData) =>
		axiosInstance.post(`${COURSE_BASE}/contents/video`, contentData, {
			params: { course_id: courseId, lesson_id: lessonId },
		}),

	uploadVideoContentFile: (courseId, lessonId, file, extraData = {}) => {
		const formData = new FormData();
		formData.append('video_file', file);

		Object.entries(extraData).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== '') {
				formData.append(key, value);
			}
		});

		return axiosInstance.post(`${COURSE_BASE}/contents/video/upload`, formData, {
			params: { course_id: courseId, lesson_id: lessonId },
		});
	},

	uploadPdfContentFile: (courseId, lessonId, file, extraData = {}) => {
		const formData = new FormData();
		formData.append('pdf_file', file);

		Object.entries(extraData).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== '') {
				formData.append(key, value);
			}
		});

		return axiosInstance.post(`${COURSE_BASE}/contents/pdf/upload`, formData, {
			params: { course_id: courseId, lesson_id: lessonId },
		});
	},

	updateVideoContent: (courseId, lessonId, contentId, contentData) =>
		axiosInstance.put(`${COURSE_BASE}/contents/video`, contentData, {
			params: { course_id: courseId, lesson_id: lessonId, content_id: contentId },
		}),

	addZoomContent: (courseId, lessonId, contentData) =>
		axiosInstance.post(`${COURSE_BASE}/contents/zoom`, contentData, {
			params: { course_id: courseId, lesson_id: lessonId },
		}),

	updateZoomContent: (courseId, lessonId, contentId, contentData) =>
		axiosInstance.put(`${COURSE_BASE}/contents/zoom`, contentData, {
			params: { course_id: courseId, lesson_id: lessonId, content_id: contentId },
		}),

	addTextContent: (courseId, lessonId, contentData) =>
		axiosInstance.post(`${COURSE_BASE}/contents/text`, contentData, {
			params: { course_id: courseId, lesson_id: lessonId },
		}),

	updateTextContent: (courseId, lessonId, contentId, contentData) =>
		axiosInstance.put(`${COURSE_BASE}/contents/text`, contentData, {
			params: { course_id: courseId, lesson_id: lessonId, content_id: contentId },
		}),

	getTextContent: (courseId, lessonId, contentId) =>
		axiosInstance.get(`${COURSE_BASE}/contents/text`, {
			params: { course_id: courseId, lesson_id: lessonId, content_id: contentId },
		}),

	addPdfContent: (courseId, lessonId, contentData) =>
		axiosInstance.post(`${COURSE_BASE}/contents/pdf`, contentData, {
			params: { course_id: courseId, lesson_id: lessonId },
		}),

	updatePdfContent: (courseId, lessonId, contentId, contentData) =>
		axiosInstance.put(`${COURSE_BASE}/contents/pdf`, contentData, {
			params: { course_id: courseId, lesson_id: lessonId, content_id: contentId },
		}),

	downloadPdfContent: (courseId, lessonId, contentId) =>
		axiosInstance.get(`${COURSE_BASE}/contents/pdf/download`, {
			params: { course_id: courseId, lesson_id: lessonId, content_id: contentId },
		}),

	addQuizContent: (courseId, lessonId, contentData) =>
		axiosInstance.post(`${COURSE_BASE}/contents/quiz`, contentData, {
			params: { course_id: courseId, lesson_id: lessonId },
		}),

	updateQuizContent: (courseId, lessonId, contentId, contentData) =>
		axiosInstance.put(`${COURSE_BASE}/contents/quiz`, contentData, {
			params: { course_id: courseId, lesson_id: lessonId, content_id: contentId },
		}),

	deleteContent: (courseId, lessonId, contentId) =>
		axiosInstance.delete(`${COURSE_BASE}/contents`, {
			params: { course_id: courseId, lesson_id: lessonId, content_id: contentId },
		}),

	notifyContentUpdate: (courseId, lessonId, payload = {}) =>
		axiosInstance.post(`${COURSE_BASE}/contents/notify-update`, payload, {
			params: { course_id: courseId, lesson_id: lessonId },
		}),

	getCourseContent: (courseId) =>
		axiosInstance.get(`${COURSE_BASE}/content`, { params: { course_id: courseId } }),

	getCourseContentPreview: (courseId) =>
		axiosInstance.get(`${COURSE_BASE}/content/preview`, { params: { course_id: courseId } }),

	getCourseContentDetails: (courseId, lessonId) =>
		axiosInstance.get(`${COURSE_BASE}/content/details`, {
			params: { course_id: courseId, lesson_id: lessonId },
		}),

	streamVideoContent: (courseId, lessonId, contentId) =>
		axiosInstance.get(`${COURSE_BASE}/contents/stream`, {
			params: { course_id: courseId, lesson_id: lessonId, content_id: contentId },
		}),

	updateWatchProgress: (courseId, lessonId, contentId, progressData) =>
		axiosInstance.post(`${COURSE_BASE}/contents/watch-progress`, progressData, {
			params: { course_id: courseId, lesson_id: lessonId, content_id: contentId },
		}),

	recordZoomAttendance: (courseId, lessonId, contentId, attendanceData = {}) =>
		axiosInstance.post(`${COURSE_BASE}/contents/zoom-attendance`, attendanceData, {
			params: { course_id: courseId, lesson_id: lessonId, content_id: contentId },
		}),

	// ---------------------------------------------------------------------------
	// Attendance & Recordings
	// ---------------------------------------------------------------------------

	getLessonAttendance: (courseId, lessonId, queryParams = {}) =>
		axiosInstance.get(`${COURSE_BASE}/attendance`, {
			params: { course_id: courseId, lesson_id: lessonId, ...queryParams },
		}),

	exportLessonAttendance: (courseId, lessonId, queryParams = {}) =>
		axiosInstance.get(`${COURSE_BASE}/attendance/export`, {
			params: { course_id: courseId, lesson_id: lessonId, ...queryParams },
		}),

	addRecording: (courseId, lessonId, recordingData) =>
		axiosInstance.post(`${COURSE_BASE}/recordings`, recordingData, {
			params: { course_id: courseId, lesson_id: lessonId },
		}),

	distributeRecording: (courseId, lessonId, contentId, recordingId, payload = {}) =>
		axiosInstance.post(`${COURSE_BASE}/recordings/distribute`, payload, {
			params: {
				course_id: courseId,
				lesson_id: lessonId,
				content_id: contentId,
				recording_id: recordingId,
			},
		}),

	getRecordingViews: (courseId, lessonId, contentId, recordingId, queryParams = {}) =>
		axiosInstance.get(`${COURSE_BASE}/recordings/views`, {
			params: {
				course_id: courseId,
				lesson_id: lessonId,
				content_id: contentId,
				recording_id: recordingId,
				...queryParams,
			},
		}),

	sendRecordingReminder: (
		courseId,
		lessonId,
		contentId,
		recordingId,
		payload = {}
	) =>
		axiosInstance.post(`${COURSE_BASE}/recordings/reminder`, payload, {
			params: {
				course_id: courseId,
				lesson_id: lessonId,
				content_id: contentId,
				recording_id: recordingId,
			},
		}),

	// ---------------------------------------------------------------------------
	// Progress, Activity, Analytics
	// ---------------------------------------------------------------------------

	getCourseProgress: (courseId) =>
		axiosInstance.get(`${COURSE_BASE}/progress`, { params: { course_id: courseId } }),

	getActivityLog: (courseId, queryParams = {}) =>
		axiosInstance.get(`${COURSE_BASE}/activity-log`, {
			params: { course_id: courseId, ...queryParams },
		}),

	trackActivity: (courseId, activityData) =>
		axiosInstance.post(`${COURSE_BASE}/track-activity`, activityData, {
			params: { course_id: courseId },
		}),

	getCourseAnalytics: (courseId) =>
		axiosInstance.get(`${COURSE_BASE}/analytics`, { params: { course_id: courseId } }),

	// ---------------------------------------------------------------------------
	// Reviews
	// ---------------------------------------------------------------------------

	createReview: (courseId, reviewData) =>
		axiosInstance.post(`${COURSE_BASE}/reviews`, reviewData, {
			params: { course_id: courseId },
		}),

	getReviews: (courseId, queryParams = {}) =>
		axiosInstance.get(`${COURSE_BASE}/reviews`, {
			params: { course_id: courseId, ...queryParams },
		}),
};

export default courseAPI;
