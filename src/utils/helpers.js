import { STORAGE_KEYS } from './constants';

// Token management
export const getToken = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  return token && token !== 'undefined' ? token : null;
};
export const setToken = (token) => localStorage.setItem(STORAGE_KEYS.TOKEN, token);
export const removeToken = () => localStorage.removeItem(STORAGE_KEYS.TOKEN);

// User management
export const getUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    if (!user || user === 'undefined') {
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
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Clear all auth data
export const clearAuthData = () => {
  removeToken();
  removeUser();
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format currency (LKR)
export const formatCurrency = (amount) => {
  return `Rs. ${parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Debounce function
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

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Sri Lankan format)
export const isValidPhone = (phone) => {
  const phoneRegex = /^(?:0|94|\+94)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\d)\d{6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Truncate text
export const truncate = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// Get role display name
export const getRoleDisplayName = (role) => {
  const roleNames = {
    STUDENT: 'Student',
    TEACHER: 'Teacher',
    ADMIN: 'Admin',
    SUPER_ADMIN: 'Super Admin',
    DEVELOPER: 'Developer',
  };
  return roleNames[role] || role;
};
