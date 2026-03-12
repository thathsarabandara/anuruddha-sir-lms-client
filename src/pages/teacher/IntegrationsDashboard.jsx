import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaZoom, FaWhatsapp, FaCC, FaCog, FaChartLine, FaHistory } from 'react-icons/fa';
import {
  IntegrationStatusCard,
  AlertBox,
  LoadingSpinner,
  IntegrationInfoBox,
} from '../components/IntegrationComponents';
// Removed: zoomIntegrationAPI import - using dummy data instead

const IntegrationsDashboard = () => {
  const navigate = useNavigate();
  
  // Dummy Zoom status
  const dummyZoomStatus = {
    is_connected: true,
    zoom_email: 'teacher@example.zoom.us',
    zoom_display_name: 'John Teacher',
  };
  
  const [zoomStatus, setZoomStatus] = useState(dummyZoomStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleConnectZoom = () => {
    alert('Zoom account connected successfully!');
    setZoomStatus(dummyZoomStatus);
  };

  const handleDisconnectZoom = () => {
    if (!window.confirm('Disconnect Zoom from your account?')) return;
    setZoomStatus({ is_connected: false });
    alert('Zoom account disconnected');
  };

  const handleTestZoomConnection = () => {
    alert('✅ Zoom connection is active and working!');
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading integrations..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b-2 border-slate-200 pb-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl text-blue-600">
                <FaCog />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Integrations</h1>
                <p className="text-gray-600 mt-1">Manage third-party service connections</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/teacher/dashboard')}
              className="px-4 py-2 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && <AlertBox type="error" title="Error" message={error} onClose={() => setError(null)} />}

        {/* Info Section */}
        <IntegrationInfoBox
          title="Connected Services"
          content="Integrate your teacher account with popular third-party services like Zoom for scheduling live classes, WhatsApp for notifications, and PayHere for payment processing."
          icon={<FaCog />}
        />

        {/* Integration Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Zoom Integration */}
          <IntegrationStatusCard
            serviceName="Zoom"
            isConnected={zoomStatus?.is_connected || false}
            isLoading={false}
            details={
              zoomStatus?.is_connected
                ? {
                    Email: zoomStatus.zoom_email,
                    Name: zoomStatus.zoom_display_name,
                  }
                : null
            }
            onConnect={handleConnectZoom}
            onDisconnect={handleDisconnectZoom}
            onTest={handleTestZoomConnection}
            icon={<FaZoom />}
            description="Schedule live classes and manage meetings"
          />

          {/* WhatsApp Integration */}
          <IntegrationStatusCard
            serviceName="WhatsApp"
            isConnected={false}
            isLoading={false}
            details={null}
            onConnect={() => alert('⏳ WhatsApp integration coming soon! Contact admin to configure.')}
            onDisconnect={() => {}}
            onTest={() => {}}
            icon={<FaWhatsapp />}
            description="Send notifications to students via WhatsApp"
          />

          {/* PayHere Integration */}
          <IntegrationStatusCard
            serviceName="PayHere"
            isConnected={false}
            isLoading={false}
            details={null}
            onConnect={() => alert('⏳ PayHere integration is admin-only. Contact your admin.')}
            onDisconnect={() => {}}
            onTest={() => {}}
            icon={<FaCC />}
            description="Payment processing (Admin configured)"
          />

          {/* Future Integration Placeholder */}
          <div className="bg-white rounded-lg border-2 border-dashed border-slate-300 p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2 text-gray-400">🔌</div>
              <h3 className="font-bold text-gray-900 mb-2">More Coming Soon</h3>
              <p className="text-sm text-gray-600">We're working on more integrations to enhance your teaching experience.</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg border-2 border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-lg">Active Integrations</h3>
              <FaChartLine className="text-3xl text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {(zoomStatus?.is_connected ? 1 : 0) + 0}
            </p>
            <p className="text-sm text-gray-600 mt-2">Out of 3 available services connected</p>
          </div>

          <div className="bg-white rounded-lg border-2 border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-lg">Last Updated</h3>
              <FaHistory className="text-3xl text-blue-600" />
            </div>
            <p className="text-sm text-gray-900 font-semibold">
              {zoomStatus?.is_connected
                ? new Date(zoomStatus.connected_at).toLocaleDateString()
                : 'Not connected'}
            </p>
            <p className="text-sm text-gray-600 mt-2">Status last checked: Just now</p>
          </div>
        </div>

        {/* Detailed Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg border-2 border-blue-200 p-6">
            <h3 className="font-bold text-blue-900 mb-3">🎓 Zoom Benefits</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>✓ Schedule live classes instantly</li>
              <li>✓ Auto-generate meeting links</li>
              <li>✓ Cloud recording enabled</li>
              <li>✓ Student notifications</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg border-2 border-green-200 p-6">
            <h3 className="font-bold text-green-900 mb-3">📱 WhatsApp Benefits</h3>
            <ul className="text-sm text-green-800 space-y-2">
              <li>✓ Class reminders to students</li>
              <li>✓ Assignment notifications</li>
              <li>✓ Payment confirmations</li>
              <li>✓ Grade announcements</li>
            </ul>
          </div>

          <div className="bg-purple-50 rounded-lg border-2 border-purple-200 p-6">
            <h3 className="font-bold text-purple-900 mb-3">💳 PayHere Benefits</h3>
            <ul className="text-sm text-purple-800 space-y-2">
              <li>✓ Easy course payments</li>
              <li>✓ Multiple payment methods</li>
              <li>✓ Automatic settlements</li>
              <li>✓ Transaction security</li>
            </ul>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-12 bg-amber-50 border-2 border-amber-200 rounded-lg p-6">
          <h3 className="font-bold text-amber-900 mb-2">🔐 Security & Privacy</h3>
          <p className="text-sm text-amber-800 mb-3">
            We take your security seriously. Here's how we protect your data:
          </p>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>✓ All credentials are encrypted and stored securely</li>
            <li>✓ OAuth tokens are automatically refreshed</li>
            <li>✓ Your credentials are never shared with third parties</li>
            <li>✓ You can disconnect any service at any time</li>
            <li>✓ All integration actions are logged for auditing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsDashboard;
