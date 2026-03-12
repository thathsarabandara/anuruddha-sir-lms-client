import axios from 'axios';
import { clearAuthData } from '../utils/helpers';
import { API_ENDPOINTS } from '../utils/constants';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - handle FormData
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Debug logging
    console.log(`API Response: ${response.status}`, {
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    // Debug logging for errors
    console.error(`API Error: ${error.response?.status || 'Unknown'}`, {
      url: error.config?.url,
      message: error.message,
      responseData: error.response?.data,
    });

    // Handle 401 Unauthorized - auto logout
    if (error.response?.status === 401) {
      console.warn('401 Unauthorized - clearing auth data and redirecting to login');
      clearAuthData();
      window.location.href = '/login';
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('403 Forbidden - Access denied');
    }

    // Normalize error response
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default axiosInstance;
