import { STORAGE_KEYS } from './constants';

export const getToken = (type) => {
  try {
    if (type === 'access_token') {
      return localStorage.getItem(STORAGE_KEYS.ACCESSTOKEN);
    } else if (type === 'refresh_token') {
      return localStorage.getItem(STORAGE_KEYS.REFRESHTOKEN);
    } else if (type === 'verification_token') {
      return localStorage.getItem(STORAGE_KEYS.VERIFICATIONTOKEN);
    } else {
      console.warn('Unknown token type:', type);
      return null;
    }  
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const setToken = (type,token) => {
  try {
    if (type === 'access_token') {
      localStorage.setItem(STORAGE_KEYS.ACCESSTOKEN, token);
    } else if (type === 'refresh_token') {
      localStorage.setItem(STORAGE_KEYS.REFRESHTOKEN, token);
    } else if (type === 'verification_token') {
      localStorage.setItem(STORAGE_KEYS.VERIFICATIONTOKEN, token);
    } else {
      console.warn('Unknown token type:', type);
    }
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

export const removeToken = (type) => {
  try {
    if (type === 'access_token') {
      localStorage.removeItem(STORAGE_KEYS.ACCESSTOKEN);
    } else if (type === 'refresh_token') {
      localStorage.removeItem(STORAGE_KEYS.REFRESHTOKEN);
    } else if (type === 'verification_token') {
      localStorage.removeItem(STORAGE_KEYS.VERIFICATIONTOKEN);
    } else {
      console.warn('Unknown token type:', type);
    }
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

export const getUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    if (!user || user === 'undefined' || user === 'null') {
      return null;
    }
    return JSON.parse(user);
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    localStorage.removeItem(STORAGE_KEYS.USER);
    return null;
  }
};

export const setUser = (user) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error setting user:', error);
  }
};

export const removeUser = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Error removing user:', error);
  }
};

export const clearAuthData = () => {
  try {
    removeToken('access_token');
    removeToken('refresh_token');
    removeToken('verification_token');
    removeUser();
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
    localStorage.removeItem(STORAGE_KEYS.LOGIN_TIME);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatCurrency = (amount) => {
  return `Rs. ${parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^(?:0|94|\+94)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\d)\d{6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const truncate = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const getRoleDisplayName = (role) => {
  const roleNames = {
    STUDENT: 'Student',
    TEACHER: 'Teacher',
    ADMIN: 'Admin',
    SUPER_ADMIN: 'SuperAdmin',
    DEVELOPER: 'Developer',
  };
  return roleNames[role] || role;
};

export const getAbsoluteImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const domain = apiBaseUrl.split('/api')[0];
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  return `${domain}/${cleanPath}`;
};

