/**
 * Integration utilities and helpers
 */

/**
 * Check if token needs refresh (within 5 minutes of expiry)
 */
export const shouldRefreshToken = (expiryTime) => {
  if (!expiryTime) return false;
  const expiryDate = new Date(expiryTime);
  const bufferTime = new Date(expiryDate.getTime() - 5 * 60 * 1000); // 5 minutes before
  return new Date() >= bufferTime;
};

/**
 * Format timestamp for display
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get integration status color
 */
export const getStatusColor = (isConnected) => {
  return isConnected ? 'text-green-600' : 'text-red-600';
};

/**
 * Get integration status badge text
 */
export const getStatusBadgeText = (isConnected) => {
  return isConnected ? 'Connected' : 'Not Connected';
};

/**
 * Validate Zoom OAuth state
 */
export const validateZoomOAuthState = (state, expectedTeacherId) => {
  if (!state) return false;
  const [prefix, teacherId] = state.split('_');
  return prefix === 'teacher' && teacherId === expectedTeacherId;
};

/**
 * Generate Zoom meeting details for display
 */
export const formatMeetingDetails = (meeting) => {
  return {
    topic: meeting.topic,
    scheduled: new Date(meeting.scheduled_at).toLocaleString(),
    duration: `${meeting.duration_minutes} minutes`,
    status: meeting.status,
    joinUrl: meeting.join_url,
  };
};

/**
 * Check if integration is properly configured
 */
export const isIntegrationConfigured = (integration) => {
  if (!integration) return false;
  return integration.configured === true || integration.is_connected === true;
};

/**
 * Get integration display name
 */
export const getIntegrationDisplayName = (serviceName) => {
  const names = {
    zoom: 'Zoom',
    whatsapp: 'WhatsApp',
    payhere: 'PayHere',
  };
  return names[serviceName] || serviceName;
};

/**
 * Build Zoom OAuth callback URL
 */
export const buildZoomCallbackURL = (code, state) => {
  const params = new URLSearchParams({
    code,
    state,
  });
  return `${window.location.origin}?${params.toString()}`;
};

/**
 * Parse OAuth error from URL
 */
export const parseOAuthError = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    error: params.get('error'),
    errorDescription: params.get('error_description'),
    state: params.get('state'),
  };
};

/**
 * Convert credentials object to form data
 */
export const credentialsToFormData = (credentials) => {
  const formData = new FormData();
  Object.entries(credentials).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });
  return formData;
};

/**
 * Mask sensitive data for display
 */
export const maskSensitiveData = (text, showChars = 4) => {
  if (!text || text.length <= showChars) return '***';
  return text.substring(0, showChars) + '*'.repeat(Math.max(0, text.length - showChars));
};

/**
 * Get integration health status
 */
export const getIntegrationHealth = (integration) => {
  if (!integration.is_connected) return 'disconnected';
  if (integration.needs_refresh) return 'expiring';
  return 'healthy';
};

/**
 * Format meeting date for Zoom API
 */
export const formatMeetingDateTime = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString();
};

/**
 * Validate meeting scheduling input
 */
export const validateMeetingInput = (data) => {
  const errors = [];

  if (!data.topic || data.topic.trim().length === 0) {
    errors.push('Meeting topic is required');
  }

  if (!data.scheduled_at) {
    errors.push('Meeting date/time is required');
  }

  if (!data.duration_minutes || data.duration_minutes < 15) {
    errors.push('Duration must be at least 15 minutes');
  }

  if (data.duration_minutes > 1440) {
    errors.push('Duration cannot exceed 24 hours');
  }

  return errors;
};

export default {
  shouldRefreshToken,
  formatDateTime,
  getStatusColor,
  getStatusBadgeText,
  validateZoomOAuthState,
  formatMeetingDetails,
  isIntegrationConfigured,
  getIntegrationDisplayName,
  buildZoomCallbackURL,
  parseOAuthError,
  credentialsToFormData,
  maskSensitiveData,
  getIntegrationHealth,
  formatMeetingDateTime,
  validateMeetingInput,
};
