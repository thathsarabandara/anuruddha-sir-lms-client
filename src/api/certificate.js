import axiosInstance from './axios';

/**
 * Certificate Management API
 * Endpoints used by admin certificate pages.
 */
export const certificateAPI = {
  getAdminStats: () => axiosInstance.get('/certificates/admin/stats'),

  getAdminCertificates: (params = {}) =>
    axiosInstance.get('/certificates/admin/list', { params }),

  issuePendingCertificates: (payload = {}) =>
    axiosInstance.post('/certificates/admin/issue', payload),

  getCertificateDetails: (certificateId) =>
    axiosInstance.get(`/certificates/${certificateId}`),
};
