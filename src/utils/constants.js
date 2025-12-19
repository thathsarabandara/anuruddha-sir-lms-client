// Role constants
export const ROLES = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  DEVELOPER: 'DEVELOPER',
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_OTP: '/auth/verify-otp',
    RESEND_OTP: '/auth/resend-otp',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  COURSES: '/courses',
  STUDENTS: '/students',
  TEACHERS: '/teachers',
  QUIZZES: '/quizzes',
  PAYMENTS: '/payments',
  RECORDINGS: '/recordings',
  REWARDS: '/rewards',
  NOTIFICATIONS: '/notifications',
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'lms_token',
  USER: 'lms_user',
  REFRESH_TOKEN: 'lms_refresh_token',
};

// Route paths
export const ROUTES = {
  // Public routes
  HOME: '/',
  ABOUT: '/about',
  COURSES: '/courses',
  SERVICES: '/services',
  CONTACT: '/contact',
  TESTIMONIALS: '/testimonials',
  FAQ: '/faq',
  GALLERY: '/gallery',
  
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_OTP: '/verify-otp',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Student routes
  STUDENT_DASHBOARD: '/student/dashboard',
  STUDENT_COURSES: '/student/courses',
  STUDENT_LIVE_CLASSES: '/student/live-classes',
  STUDENT_QUIZZES: '/student/quizzes',
  STUDENT_PROGRESS: '/student/progress',
  STUDENT_RECORDINGS: '/student/recordings',
  STUDENT_CERTIFICATES: '/student/certificates',
  STUDENT_PAYMENTS: '/student/payments',
  STUDENT_REWARDS: '/student/rewards',
  STUDENT_PROFILE: '/student/profile',
  
  // Teacher routes
  TEACHER_DASHBOARD: '/teacher/dashboard',
  TEACHER_COURSES: '/teacher/courses',
  TEACHER_LIVE_CLASSES: '/teacher/live-classes',
  TEACHER_STUDENTS: '/teacher/students',
  TEACHER_QUIZZES: '/teacher/quizzes',
  TEACHER_RECORDINGS: '/teacher/recordings',
  TEACHER_REVENUE: '/teacher/revenue',
  TEACHER_REWARDS: '/teacher/rewards',
  TEACHER_ANNOUNCEMENTS: '/teacher/announcements',
  TEACHER_PROFILE: '/teacher/profile',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_TEACHERS: '/admin/teachers',
  ADMIN_COURSES: '/admin/courses',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_QUIZZES: '/admin/quizzes',
  ADMIN_CERTIFICATES: '/admin/certificates',
  ADMIN_MANAGEMENT: '/admin/management',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_SETTINGS: '/admin/settings',
  
  // Developer routes
  DEVELOPER_DASHBOARD: '/developer/dashboard',
  DEVELOPER_SYSTEM_HEALTH: '/developer/system-health',
  DEVELOPER_API_LOGS: '/developer/api-logs',
  DEVELOPER_ERROR_MONITORING: '/developer/error-monitoring',
  DEVELOPER_FEATURE_FLAGS: '/developer/feature-flags',
  DEVELOPER_INTEGRATION_STATUS: '/developer/integration-status',
};

// Social media links
export const SOCIAL_LINKS = {
  WHATSAPP: 'https://wa.me/94702656024',
  FACEBOOK: 'https://www.facebook.com/share/1A7d9qiRst/',
  YOUTUBE: 'https://www.youtube.com/@anuruddhasirgrade5150',
  CHATBOT: 'https://your-chatbot-url.com',
};
