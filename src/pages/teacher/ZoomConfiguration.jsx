import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaZoom, FaCheckCircle, FaTimesCircle, FaSpinner, FaClock, FaUser } from 'react-icons/fa';
import {
  IntegrationStatusCard,
  AlertBox,
  LoadingSpinner,
  IntegrationInfoBox,
  StatusBadge,
} from '../components/IntegrationComponents';
import { zoomIntegrationAPI } from '../api/integrationApi';

const ZoomConfiguration = () => {
  const navigate = useNavigate();
  const [zoomStatus, setZoomStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [testing, setTesting] = useState(false);

  // Fetch Zoom status on mount
  useEffect(() => {
    fetchZoomStatus();
  }, []);

  // Handle OAuth callback if redirected from Zoom
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code) {
      handleOAuthCallback(code, state);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fetchZoomStatus = async () => {
    try {
      setIsLoading(true);
      const response = await zoomIntegrationAPI.getStatus();
      setZoomStatus(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch Zoom status');
      console.error('Error fetching Zoom status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthCallback = async (code, state) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await zoomIntegrationAPI.handleOAuthCallback(code, state);

      if (response.data.success) {
        setSuccess('Zoom account connected successfully! 🎉');
        setZoomStatus(response.data);
        setTimeout(() => setSuccess(null), 5000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect Zoom account');
      console.error('OAuth callback error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectZoom = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await zoomIntegrationAPI.getOAuthRedirectURL();

      if (response.data.success) {
        // Redirect to Zoom OAuth
        window.location.href = response.data.oauth_url;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate Zoom connection');
      console.error('Error connecting to Zoom:', err);
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setTesting(true);
      setError(null);
      const response = await zoomIntegrationAPI.testConnection();

      if (response.data.success) {
        setSuccess('Zoom connection is active and working! ✅');
        setTimeout(() => setSuccess(null), 5000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Connection test failed');
      console.error('Error testing connection:', err);
    } finally {
      setTesting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Are you sure you want to disconnect Zoom? You will need to reconnect to schedule classes.')) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await zoomIntegrationAPI.disconnect();

      if (response.data.success) {
        setSuccess('Zoom account disconnected');
        setZoomStatus({ is_connected: false });
        setTimeout(() => setSuccess(null), 5000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to disconnect Zoom');
      console.error('Error disconnecting Zoom:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !zoomStatus) {
    return <LoadingSpinner text="Loading Zoom configuration..." />;
  }

  const isConnected = zoomStatus?.is_connected;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b-2 border-slate-200 pb-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl text-blue-600">
              <FaZoom />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Zoom Configuration</h1>
              <p className="text-gray-600 mt-1">Connect your Zoom account to schedule live classes</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && <AlertBox type="error" title="Error" message={error} onClose={() => setError(null)} />}
        {success && <AlertBox type="success" title="Success" message={success} onClose={() => setSuccess(null)} />}

        {/* Info Box */}
        <IntegrationInfoBox
          title="Why Connect Zoom?"
          content="Connecting your Zoom account allows the LMS to schedule meetings on your behalf. You maintain full control over your Zoom account, and students will receive meeting links automatically when you schedule classes."
          icon={<FaZoom />}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status Card */}
          <div className="lg:col-span-2">
            <IntegrationStatusCard
              serviceName="Zoom"
              isConnected={isConnected}
              isLoading={testing}
              details={
                isConnected && zoomStatus
                  ? {
                      Email: zoomStatus.zoom_email,
                      Name: zoomStatus.zoom_display_name,
                      'Connected Since': new Date(zoomStatus.connected_at).toLocaleDateString(),
                      'Token Expires': new Date(zoomStatus.token_expiry).toLocaleDateString(),
                    }
                  : null
              }
              onConnect={handleConnectZoom}
              onDisconnect={handleDisconnect}
              onTest={handleTestConnection}
              icon={<FaZoom />}
              description="Connect your Zoom account for scheduling live classes"
            />
          </div>

          {/* Quick Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border-2 border-slate-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Connection Status</h3>

              <div className="space-y-4">
                {/* Connection Status */}
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Status</p>
                  {isConnected ? (
                    <StatusBadge status="connected" text="Connected" />
                  ) : (
                    <StatusBadge status="disconnected" text="Not Connected" />
                  )}
                </div>

                {/* Connection Info */}
                {isConnected && zoomStatus && (
                  <>
                    <div className="border-t-2 border-slate-200 pt-4">
                      <p className="text-xs text-gray-600 font-semibold uppercase mb-2 flex items-center gap-2">
                        <FaUser className="text-blue-600" /> Account
                      </p>
                      <p className="text-sm font-semibold text-gray-900">{zoomStatus.zoom_display_name}</p>
                      <p className="text-xs text-gray-600">{zoomStatus.zoom_email}</p>
                    </div>

                    <div className="border-t-2 border-slate-200 pt-4">
                      <p className="text-xs text-gray-600 font-semibold uppercase mb-2 flex items-center gap-2">
                        <FaClock className="text-blue-600" /> Token Expiry
                      </p>
                      <p className="text-sm text-gray-900">
                        {zoomStatus.needs_refresh ? (
                          <>
                            <span className="text-red-600 font-semibold">Expiring Soon</span>
                            <p className="text-xs text-gray-600">Auto-refresh enabled</p>
                          </>
                        ) : (
                          <>
                            <span className="text-green-600 font-semibold">Active</span>
                            <p className="text-xs text-gray-600">
                              {new Date(zoomStatus.token_expiry).toLocaleDateString()}
                            </p>
                          </>
                        )}
                      </p>
                    </div>
                  </>
                )}

                {/* Help Text */}
                <div className="border-t-2 border-slate-200 pt-4">
                  <p className="text-xs text-gray-600">
                    {isConnected
                      ? 'Your Zoom account is securely connected. You can now schedule live classes.'
                      : 'Click "Connect" above to authorize your Zoom account.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border-2 border-slate-200 p-6">
            <div className="text-3xl text-blue-600 mb-3">📅</div>
            <h3 className="font-bold text-gray-900 mb-2">Schedule Classes</h3>
            <p className="text-sm text-gray-600">
              Automatically schedule Zoom meetings from your course syllabus. Students get meeting links instantly.
            </p>
          </div>

          <div className="bg-white rounded-lg border-2 border-slate-200 p-6">
            <div className="text-3xl text-blue-600 mb-3">🔔</div>
            <h3 className="font-bold text-gray-900 mb-2">Auto Notifications</h3>
            <p className="text-sm text-gray-600">
              Students receive WhatsApp and email notifications with Zoom meeting links before class starts.
            </p>
          </div>

          <div className="bg-white rounded-lg border-2 border-slate-200 p-6">
            <div className="text-3xl text-blue-600 mb-3">🔒</div>
            <h3 className="font-bold text-gray-900 mb-2">Secure & Safe</h3>
            <p className="text-sm text-gray-600">
              Your Zoom credentials are encrypted and stored securely. Only the LMS can schedule meetings.
            </p>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="mt-12 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
          <h3 className="font-bold text-yellow-900 mb-3">Need Help?</h3>
          <ul className="text-sm text-yellow-800 space-y-2">
            <li>
              <strong>Connection Failed?</strong> Make sure you have an active Zoom account and are using the correct
              credentials.
            </li>
            <li>
              <strong>Token Expired?</strong> The system automatically refreshes your token. If issues persist, try
              disconnecting and reconnecting.
            </li>
            <li>
              <strong>Questions?</strong> Contact the admin team or refer to the Zoom integration guide.
            </li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate('/teacher/dashboard')}
            className="px-6 py-2 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Dashboard
          </button>
          {isConnected && (
            <button
              onClick={() => navigate('/teacher/live-classes')}
              className="px-6 py-2 btn-primary font-semibold"
            >
              Schedule a Class
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZoomConfiguration;
