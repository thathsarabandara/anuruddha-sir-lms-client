// Role constants
export const ROLES = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN',
  SUPERADMIN: 'SUPERADMIN',
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
    CHANGE_PASSWORD: '/auth/change-password',
    REFRESH: '/auth/refresh',
    LOGIN_HISTORY: '/auth/login-history',
    LOGOUT: '/auth/logout',
    ME: '/auth/verify-token',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  COURSES: '/courses',
  STUDENTS: '/students',
  TEACHERS: '/teachers',
  QUIZZES: '/quizzes',
  PAYMENTS: '/payments',
  RECORDINGS: '/recordings',
  REWARDS: '/rewards',
  NOTIFICATIONS: '/notifications',
  REWARDS_ENDPOINTS: {
    STUDENT: {
      GEMS: '/rewards/student/gems',
      TRANSACTIONS: '/rewards/student/transactions',
      COUPONS: '/rewards/student/coupons',
    },
    TEACHER: {
      PENDING: '/rewards/teacher/pending-rewards',
      APPROVE: '/rewards/reward/approve',
      REJECT: '/rewards/reward/reject',
    },
    ADMIN: {
      SEND_REWARD: '/rewards/admin/send-reward',
      CREATE_COUPON: '/rewards/admin/create-coupon',
      DEDUCT_GEMS: '/rewards/admin/deduct-gems',
    },
    COUPON: {
      CREATE: '/rewards/coupon/create',
      USE: '/rewards/coupon/use',
      ALL: '/rewards/coupon/all',
    },
    PUBLIC: {
      LEADERBOARD: '/rewards/leaderboard',
    },
    REQUEST: '/rewards/reward/request',
  },
};

// Local storage keys
export const STORAGE_KEYS = {
  ACCESSTOKEN: 'access_token',
  REFRESHTOKEN: 'refresh_token',
  VERIFICATIONTOKEN: 'verification_token',
  USER: 'lms_user',
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
  REGISTER: '/register',
  VERIFY_OTP: '/verify-otp',
  RESEND_OTP: '/resend-otp',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/password-reset',
  VERIFY_TOKEN: '/verify-reset-token',
  LOGOUT: '/logout',
  LOGIN_HISTORY: '/login-history',
  VERIFY_EMAIL: '/verify-email',
  STUDENT_REGISTER: '/register?role=student',
  STUDENT_LOGIN: '/login?role=student',
  TEACHER_LOGIN: '/login?role=teacher',
  TEACHER_REGISTER: '/register?role=teacher',
  
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
  STUDENT_REWARDS_LEADERBOARD: '/student/rewards/leaderboard',
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
  TEACHER_REWARD_APPROVALS: '/teacher/rewards/approvals',
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
  ADMIN_REWARDS: '/admin/rewards',
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

export const normalizeRole = (backendRole) => {
  if (!backendRole) return 'STUDENT';
  
  const normalizedRole = backendRole.toUpperCase();
  
  if (normalizedRole === 'SUPERADMIN') {
    return 'SUPERADMIN';
  }
  
  return normalizedRole;
};

// Helper function to get dashboard route by role
export const getDashboardRoute = (role) => {
  const normalizedRole = normalizeRole(role);
  
  switch (normalizedRole) {
    case ROLES.STUDENT:
      return ROUTES.STUDENT_DASHBOARD;
    case ROLES.TEACHER:
      return ROUTES.TEACHER_DASHBOARD;
    case ROLES.ADMIN:
    case ROLES.SUPERADMIN:
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
