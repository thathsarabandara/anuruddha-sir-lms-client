import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';

export const notificationAPI = {
  getInAppNotifications: (params = {}) =>
    axiosInstance.get(API_ENDPOINTS.NOTIFICATIONS, { params }),

  markInAppNotificationAsRead: (notificationId) =>
    axiosInstance.put(`${API_ENDPOINTS.NOTIFICATIONS}/${notificationId}/read`),

  markAllInAppNotificationsAsRead: () =>
    axiosInstance.put(`${API_ENDPOINTS.NOTIFICATIONS}/read-all`),

  deleteInAppNotification: (notificationId) =>
    axiosInstance.delete(`${API_ENDPOINTS.NOTIFICATIONS}/${notificationId}`),

  sendBulkNotification: (payload) =>
    axiosInstance.post(`${API_ENDPOINTS.NOTIFICATIONS}/send-bulk`, payload),

  getBatchHistory: (params = {}) =>
    axiosInstance.get(`${API_ENDPOINTS.NOTIFICATIONS}/batch-history`, { params }),

  getBatchStatus: (batchId) =>
    axiosInstance.get(`${API_ENDPOINTS.NOTIFICATIONS}/${batchId}/status`),

  getBatchDetail: (batchId) =>
    axiosInstance.get(`${API_ENDPOINTS.NOTIFICATIONS}/batch/${batchId}`),

  updateBatch: (batchId, payload) =>
    axiosInstance.put(`${API_ENDPOINTS.NOTIFICATIONS}/batch/${batchId}`, payload),

  previewRecipients: (recipients) =>
    axiosInstance.post(`${API_ENDPOINTS.NOTIFICATIONS}/preview-recipients`, { recipients }),
};
