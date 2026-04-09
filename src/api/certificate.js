import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';

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
    axiosInstance.get(API_ENDPOINTS.CERTIFICATES.DETAILS(certificateId)),

  getMyCertificates: (params = {}) =>
    axiosInstance.get(API_ENDPOINTS.CERTIFICATES.USER, { params }),

  downloadCertificate: (certificateId) =>
    axiosInstance.get(API_ENDPOINTS.CERTIFICATES.DOWNLOAD(certificateId), {
      responseType: 'blob',
    }),

  shareCertificate: (certificateId, payload = {}) =>
    axiosInstance.post(API_ENDPOINTS.CERTIFICATES.SHARE(certificateId), payload),

  verifyCertificate: (certificateCode) =>
    axiosInstance.get(API_ENDPOINTS.CERTIFICATES.VERIFY(certificateCode)),
};
