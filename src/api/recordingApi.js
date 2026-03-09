import axiosInstance from './axios';

export const studentRecordingAPI = {
  // Get all recordings for enrolled courses
  getStudentRecordings: (searchTerm = '') => {
    return axiosInstance.get('/student/recordings/', {
      params: {
        search: searchTerm
      }
    });
  },

  // Get recordings filtered by course
  getRecordingsByCoursId: (courseId, searchTerm = '') => {
    return axiosInstance.get('/student/recordings/', {
      params: {
        course_id: courseId,
        search: searchTerm
      }
    });
  },

  // Get detailed information about a specific recording
  getRecordingDetail: (recordingId) => {
    return axiosInstance.get(`/student/recordings/${recordingId}/`);
  }
};

export const teacherRecordingAPI = {
  // Update recording link/URL for a zoom class
  updateRecordingLink: (zoomClassId, data) => {
    return axiosInstance.put(`/teacher/zoom-classes/${zoomClassId}/update-recording/`, data);
  },

  // Upload recording file
  uploadRecordingFile: (zoomClassId, formData) => {
    return axiosInstance.post(`/teacher/zoom-classes/${zoomClassId}/recording/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Update recording with both URL and file
  updateRecording: (zoomClassId, data, file = null) => {
    const formData = new FormData();
    
    if (data.recording_url) {
      formData.append('recording_url', data.recording_url);
    }
    
    if (file) {
      formData.append('recording_file', file);
    }
    
    return axiosInstance.put(`/teacher/zoom-classes/${zoomClassId}/update-recording/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default {
  student: studentRecordingAPI,
  teacher: teacherRecordingAPI
};
