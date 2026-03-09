import { useState, useCallback } from 'react';
import { zoomIntegrationAPI, adminIntegrationAPI } from '../api/integrationApi';

/**
 * Custom hook for managing Zoom integration
 */
export const useZoomIntegration = () => {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await zoomIntegrationAPI.getStatus();
      setStatus(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch Zoom status';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const connect = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await zoomIntegrationAPI.getOAuthRedirectURL();
      if (response.data.success) {
        // Redirect to Zoom OAuth will happen in the component
        return response.data.oauth_url;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to initiate connection';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await zoomIntegrationAPI.disconnect();
      if (response.data.success) {
        setStatus({ is_connected: false });
        return true;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to disconnect';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const testConnection = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await zoomIntegrationAPI.testConnection();
      return response.data.success;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Connection test failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const scheduleMeeting = useCallback(async (meetingData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await zoomIntegrationAPI.scheduleMeeting(meetingData);
      if (response.data.success) {
        return response.data.meeting;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to schedule meeting';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleOAuthCallback = useCallback(async (code, state) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await zoomIntegrationAPI.handleOAuthCallback(code, state);
      if (response.data.success) {
        setStatus(response.data);
        return response.data;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to complete connection';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    status,
    isLoading,
    error,
    fetchStatus,
    connect,
    disconnect,
    testConnection,
    scheduleMeeting,
    handleOAuthCallback,
  };
};

/**
 * Custom hook for managing admin integration credentials
 */
export const useAdminIntegrations = () => {
  const [integrationStatus, setIntegrationStatus] = useState(null);
  const [credentials, setCredentials] = useState({
    zoom: null,
    whatsapp: null,
    payhere: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIntegrationStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminIntegrationAPI.getIntegrationStatus();
      setIntegrationStatus(response.data.integrations);
      return response.data.integrations;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch integration status';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchZoomCredentials = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminIntegrationAPI.zoomCredentials.get();
      setCredentials((prev) => ({ ...prev, zoom: response.data }));
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch Zoom credentials';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveZoomCredentials = useCallback(async (credentialData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminIntegrationAPI.zoomCredentials.update(credentialData);
      setCredentials((prev) => ({ ...prev, zoom: response.data }));
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to save Zoom credentials';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchWhatsAppCredentials = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminIntegrationAPI.whatsappCredentials.get();
      setCredentials((prev) => ({ ...prev, whatsapp: response.data }));
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch WhatsApp credentials';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveWhatsAppCredentials = useCallback(async (credentialData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminIntegrationAPI.whatsappCredentials.update(credentialData);
      setCredentials((prev) => ({ ...prev, whatsapp: response.data }));
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to save WhatsApp credentials';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPayHereCredentials = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminIntegrationAPI.payhereCredentials.get();
      setCredentials((prev) => ({ ...prev, payhere: response.data }));
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch PayHere credentials';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const savePayHereCredentials = useCallback(async (credentialData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminIntegrationAPI.payhereCredentials.update(credentialData);
      setCredentials((prev) => ({ ...prev, payhere: response.data }));
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to save PayHere credentials';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    integrationStatus,
    credentials,
    isLoading,
    error,
    fetchIntegrationStatus,
    fetchZoomCredentials,
    saveZoomCredentials,
    fetchWhatsAppCredentials,
    saveWhatsAppCredentials,
    fetchPayHereCredentials,
    savePayHereCredentials,
  };
};

export default {
  useZoomIntegration,
  useAdminIntegrations,
};
