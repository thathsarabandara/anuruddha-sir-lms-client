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
    VERIFY_RESET_TOKEN: '/auth/verify-reset-token',
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
  TOKEN_EXPIRY: 'lms_token_expiry',
  LOGIN_TIME: 'lms_login_time',
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
  
  // Auth routes (role-based)
  LOGIN: '/login',
  LOGIN_STUDENT: '/login?role=student',
  LOGIN_TEACHER: '/login?role=teacher',
  LOGIN_ADMIN: '/login?role=admin',
  LOGIN_DEVELOPER: '/login?role=developer',
  
  REGISTER: '/register',
  REGISTER_STUDENT: '/register?role=student',
  REGISTER_TEACHER: '/register?role=teacher',
  
  VERIFY_OTP: '/verify-otp',
  
  FORGOT_PASSWORD: '/forgot-password',
  FORGOT_PASSWORD_STUDENT: '/forgot-password?role=student',
  FORGOT_PASSWORD_TEACHER: '/forgot-password?role=teacher',
  FORGOT_PASSWORD_ADMIN: '/forgot-password?role=admin',
  FORGOT_PASSWORD_DEVELOPER: '/forgot-password?role=developer',
  
  RESET_PASSWORD: '/reset-password',
  
  // Student routes
  STUDENT_DASHBOARD: '/student/dashboard',
  STUDENT_COURSES: '/student/courses',
  STUDENT_LIVE_CLASSES: '/student/live-classes',
  STUDENT_QUIZZES: '/student/quizzes',
  STUDENT_QUIZ_DETAILS: '/student/quiz/:quizId/details',
  STUDENT_PROGRESS: '/student/progress',
  STUDENT_RECORDINGS: '/student/recordings',
  STUDENT_CERTIFICATES: '/student/certificates',
  STUDENT_PAYMENTS: '/student/payments',
  STUDENT_REWARDS: '/student/rewards',
  STUDENT_PROFILE: '/student/profile',
  STUDENT_CART: '/student/cart',
  STUDENT_CHECKOUT: '/student/checkout',
  STUDENT_ORDER_CONFIRMATION: '/student/order-confirmation',
  STUDENT_COURSE_VIEW: '/student/course/:courseId',
  
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

// Helper function to get role-specific auth routes
export const getAuthRoute = (authType, role) => {
  switch (authType) {
    case 'login':
      return `${ROUTES.LOGIN}?role=${role?.toLowerCase() || 'student'}`;
    case 'register':
      return `${ROUTES.REGISTER}?role=${role?.toLowerCase() || 'student'}`;
    case 'verify-otp':
      return `${ROUTES.VERIFY_OTP}?role=${role?.toLowerCase() || 'student'}`;
    case 'forgot-password':
      return `${ROUTES.FORGOT_PASSWORD}?role=${role?.toLowerCase() || 'student'}`;
    case 'reset-password':
      return ROUTES.RESET_PASSWORD;
    default:
      return ROUTES.LOGIN;
  }
};

// Helper function to get dashboard route by role
export const getDashboardRoute = (role) => {
  const roleUpperCase = role?.toUpperCase();
  
  switch (roleUpperCase) {
    case ROLES.STUDENT:
      return ROUTES.STUDENT_DASHBOARD;
    case ROLES.TEACHER:
      return ROUTES.TEACHER_DASHBOARD;
    case ROLES.ADMIN:
    case ROLES.SUPER_ADMIN:
      return ROUTES.ADMIN_DASHBOARD;
    case ROLES.DEVELOPER:
      return ROUTES.DEVELOPER_DASHBOARD;
    default:
      return ROUTES.HOME;
  }
};

// Social media links
export const SOCIAL_LINKS = {
  WHATSAPP: 'https://wa.me/94702656024',
  FACEBOOK: 'https://www.facebook.com/share/1A7d9qiRst/',
  YOUTUBE: 'https://www.youtube.com/@anuruddhasirgrade5150',
  CHATBOT: 'https://your-chatbot-url.com',
};
