import axiosInstance from './axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const zoomIntegrationAPI = {
  getOAuthRedirectURL: () =>axiosInstance.get(`${API_BASE_URL}/integrations/zoom/oauth/redirect`),
  handleOAuthCallback: (code, state) =>    axiosInstance.post(`${API_BASE_URL}/integrations/zoom/oauth/callback`, { code, state,}),
  getStatus: () => axiosInstance.get(`${API_BASE_URL}/integrations/zoom/status`),
  getTeacherConfig: () => axiosInstance.get(`${API_BASE_URL}/integrations/zoom/teacher-config`),
  disconnect: () => axiosInstance.post(`${API_BASE_URL}/integrations/zoom/disconnect`),
  testConnection: () => axiosInstance.post(`${API_BASE_URL}/integrations/zoom/test-connection`),
  scheduleMeeting: (meetingData) => axiosInstance.post(`${API_BASE_URL}/integrations/zoom/schedule-meeting`, meetingData),
};

export const adminIntegrationAPI = {
  getIntegrationStatus: () => axiosInstance.get(`${API_BASE_URL}/integrations/admin/status`),
  zoomCredentials: { get: () =>
      axiosInstance.get(`${API_BASE_URL}/integrations/admin/zoom-credentials`),
    update: (credentials) =>
      axiosInstance.post(`${API_BASE_URL}/integrations/admin/zoom-credentials`, credentials),
  },

  /**
   * WhatsApp Credentials Management
   */
  whatsappCredentials: {
    get: () =>
      axiosInstance.get(`${API_BASE_URL}/integrations/admin/whatsapp-credentials`),
    update: (credentials) =>
      axiosInstance.post(`${API_BASE_URL}/integrations/admin/whatsapp-credentials`, credentials),
  },

  /**
   * PayHere Credentials Management
   */
  payhereCredentials: {
    get: () =>
      axiosInstance.get(`${API_BASE_URL}/integrations/admin/payhere-credentials`),
    update: (credentials) =>
      axiosInstance.post(`${API_BASE_URL}/integrations/admin/payhere-credentials`, credentials),
  },
};

export default {
  zoom: zoomIntegrationAPI,
  admin: adminIntegrationAPI,
};
