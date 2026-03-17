import axios from 'axios';
import { getToken } from '../utils/helpers';
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

// Request interceptor - add access token if available
axiosInstance.interceptors.request.use(
  (config) => {
    // Add access token to Authorization header if available
    // Token will be read from cookies first (Set-Cookie headers), fallback to localStorage
    const access_token = getToken('access_token');
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    
    // withCredentials: true ensures cookies are automatically sent with every request
    
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
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.warn('401 Unauthorized - backend rejected token');
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
