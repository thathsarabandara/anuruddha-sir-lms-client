import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaZoom, FaWhatsapp, FaCC, FaCog, FaSave, FaSync } from 'react-icons/fa';
import {
  CredentialsForm,
  LoadingSpinner,
  IntegrationStatusCard,
} from '../components/IntegrationComponents';
import Notification from '../../components/common/Notification';


const AdminIntegrationSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('zoom');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  const handleError = (errorMsg) => {
    setError(errorMsg);
    showNotification(errorMsg, 'error');
  };

  const handleSuccess = (successMsg) => {
    setSuccess(successMsg);
    showNotification(successMsg, 'success');
  };

  const dummyIntegrationStatus = {
    zoom: { 
      configured: true, 
      client_id: 'zoom_demo_client_123',
      updated_at: new Date().toISOString(),
    },
    whatsapp: { 
      configured: false,
      updated_at: new Date().toISOString(),
    },
    payhere: { 
      configured: true, 
      merchant_id: 'DEMO_MERCHANT',
      updated_at: new Date().toISOString(),
    },
  };

  const [integrationStatus, setIntegrationStatus] = useState(dummyIntegrationStatus);

  useEffect(() => {
    // Initialize with dummy data
    setIsLoading(false);
  }, []);

  const handleSaveZoomCredentials = async (formData) => {
    try {
      setIsLoading(true);
      // Simulate API call with dummy data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedStatus = {
        ...integrationStatus,
        zoom: {
          configured: true,
          client_id: formData.client_id,
          updated_at: new Date().toISOString(),
        }
      };
      setIntegrationStatus(updatedStatus);
      handleSuccess('Zoom credentials saved successfully!');
    } catch (err) {
      handleError('Failed to save Zoom credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWhatsAppCredentials = async (formData) => {
    try {
      setIsLoading(true);
      // Simulate API call with dummy data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedStatus = {
        ...integrationStatus,
        whatsapp: {
          configured: true,
          app_id: formData.app_id,
          updated_at: new Date().toISOString(),
        }
      };
      setIntegrationStatus(updatedStatus);
      handleSuccess('WhatsApp credentials saved successfully!');
    } catch (err) {
      handleError('Failed to save WhatsApp credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePayHereCredentials = async (formData) => {
    try {
      setIsLoading(true);
      // Simulate API call with dummy data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedStatus = {
        ...integrationStatus,
        payhere: {
          configured: true,
          merchant_id: formData.merchant_id,
          updated_at: new Date().toISOString(),
        }
      };
      setIntegrationStatus(updatedStatus);
      handleSuccess('PayHere credentials saved successfully!');
    } catch (err) {
      handleError('Failed to save PayHere credentials');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !integrationStatus) {
    return <LoadingSpinner text="Loading integration settings..." />;
  }

  const zoomFields = [
    {
      name: 'client_id',
      label: 'Zoom OAuth Client ID',
      type: 'text',
      placeholder: 'Your Zoom Client ID',
      required: true,
      help: 'Get this from Zoom Marketplace -> Your App -> App Credentials',
    },
    {
      name: 'client_secret',
      label: 'Zoom OAuth Client Secret',
      type: 'password',
      placeholder: 'Your Zoom Client Secret',
      required: true,
      help: 'Keep this secret! Never share publicly.',
    },
    {
      name: 'redirect_uri',
      label: 'Redirect URI',
      type: 'url',
      placeholder: 'https://your-domain.com/api/integrations/zoom/oauth/callback',
      required: true,
      help: 'This must match the Redirect URI configured in your Zoom app',
    },
    {
      name: 'account_id',
      label: 'Zoom Account ID (Optional)',
      type: 'text',
      placeholder: 'Your Zoom Account ID',
      required: false,
      help: 'Optional: Used to link to your specific Zoom account',
    },
  ];

  const whatsappFields = [
    {
      name: 'app_id',
      label: 'WhatsApp App ID',
      type: 'text',
      placeholder: 'Your App ID',
      required: true,
      help: 'From Meta Business Platform -> Apps -> Your App',
    },
    {
      name: 'app_secret',
      label: 'WhatsApp App Secret',
      type: 'password',
      placeholder: 'Your App Secret',
      required: true,
      help: 'Keep this confidential',
    },
    {
      name: 'business_account_id',
      label: 'WhatsApp Business Account ID',
      type: 'text',
      placeholder: 'Your Business Account ID',
      required: true,
      help: 'From WhatsApp Business Settings',
    },
    {
      name: 'phone_number_id',
      label: 'Phone Number ID',
      type: 'text',
      placeholder: 'Your Phone Number ID',
      required: true,
      help: 'The registered WhatsApp Business phone number ID',
    },
    {
      name: 'access_token',
      label: 'Permanent Access Token',
      type: 'password',
      placeholder: 'Your Permanent Access Token',
      required: true,
      help: 'Generate from Meta Business Platform',
    },
  ];

  const payhereFields = [
    {
      name: 'merchant_id',
      label: 'Merchant ID',
      type: 'text',
      placeholder: 'Your PayHere Merchant ID',
      required: true,
      help: 'From PayHere Merchant Dashboard',
    },
    {
      name: 'merchant_secret',
      label: 'Merchant Secret',
      type: 'password',
      placeholder: 'Your Merchant Secret',
      required: true,
      help: 'Keep this secure',
    },
    {
      name: 'notify_url',
      label: 'Notify URL',
      type: 'url',
      placeholder: 'https://your-domain.com/api/payments/payhere/notify/',
      required: true,
      help: 'Webhook endpoint for payment notifications',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Notification Component */}
      {notification && (
        <div className="fixed top-4 left-4 right-4 z-50 max-w-sm">
          <Notification 
            {...notification} 
            onClose={() => setNotification(null)} 
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b-2 border-slate-200 pb-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl text-blue-600">
                <FaCog />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Integration Settings</h1>
                <p className="text-gray-600 mt-1">Manage API credentials for all integrations</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="px-4 py-2 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        </div>

        {/* Status Overview */}
        {integrationStatus && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Zoom Status */}
            <div className="bg-white rounded-lg border-2 border-slate-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-lg">Zoom</h3>
                <FaZoom className="text-3xl text-blue-600" />
              </div>
              {integrationStatus.zoom.configured ? (
                <>
                  <p className="text-sm text-green-600 font-semibold mb-2">✅ Configured</p>
                  <p className="text-xs text-gray-600 mb-1">Client ID: {integrationStatus.zoom.client_id}</p>
                  <p className="text-xs text-gray-600">Updated: {integrationStatus.zoom.updated_at?.split('T')[0]}</p>
                </>
              ) : (
                <p className="text-sm text-red-600 font-semibold">❌ Not Configured</p>
              )}
            </div>

            {/* WhatsApp Status */}
            <div className="bg-white rounded-lg border-2 border-slate-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-lg">WhatsApp</h3>
                <FaWhatsapp className="text-3xl text-green-600" />
              </div>
              {integrationStatus.whatsapp.configured ? (
                <>
                  <p className="text-sm text-green-600 font-semibold mb-2">✅ Configured</p>
                  <p className="text-xs text-gray-600 mb-1">App ID: {integrationStatus.whatsapp.app_id}</p>
                  <p className="text-xs text-gray-600">Updated: {integrationStatus.whatsapp.updated_at?.split('T')[0]}</p>
                </>
              ) : (
                <p className="text-sm text-red-600 font-semibold">❌ Not Configured</p>
              )}
            </div>

            {/* PayHere Status */}
            <div className="bg-white rounded-lg border-2 border-slate-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-lg">PayHere</h3>
                <FaCC className="text-3xl text-orange-600" />
              </div>
              {integrationStatus.payhere.configured ? (
                <>
                  <p className="text-sm text-green-600 font-semibold mb-2">✅ Configured</p>
                  <p className="text-xs text-gray-600 mb-1">Merchant: {integrationStatus.payhere.merchant_id}</p>
                  <p className="text-xs text-gray-600">Updated: {integrationStatus.payhere.updated_at?.split('T')[0]}</p>
                </>
              ) : (
                <p className="text-sm text-red-600 font-semibold">❌ Not Configured</p>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg border-2 border-slate-200 overflow-hidden">
          <div className="flex border-b-2 border-slate-200">
            <button
              onClick={() => setActiveTab('zoom')}
              className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'zoom'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'bg-white text-gray-600 hover:bg-slate-50'
              }`}
            >
              <FaZoom /> Zoom OAuth
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'whatsapp'
                  ? 'bg-green-50 text-green-600 border-b-2 border-green-600'
                  : 'bg-white text-gray-600 hover:bg-slate-50'
              }`}
            >
              <FaWhatsapp /> WhatsApp API
            </button>
            <button
              onClick={() => setActiveTab('payhere')}
              className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'payhere'
                  ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-600'
                  : 'bg-white text-gray-600 hover:bg-slate-50'
              }`}
            >
              <FaCC /> PayHere
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'zoom' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Zoom OAuth Configuration</h2>
                <p className="text-gray-600 mb-6">
                  Configure Zoom OAuth credentials to allow teachers to authorize their Zoom accounts.
                </p>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>How to get credentials:</strong>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>Go to Zoom Marketplace</li>
                      <li>Create a new OAuth App</li>
                      <li>Copy Client ID and Client Secret</li>
                      <li>Set Redirect URI to: {window.location.origin}/api/integrations/zoom/oauth/callback</li>
                    </ol>
                  </p>
                </div>
                <CredentialsForm
                  title="Zoom OAuth Credentials"
                  fields={zoomFields}
                  onSubmit={handleSaveZoomCredentials}
                  isLoading={isLoading}
                  submitText="Save Zoom Credentials"
                />
              </div>
            )}

            {activeTab === 'whatsapp' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">WhatsApp Cloud API Configuration</h2>
                <p className="text-gray-600 mb-6">
                  Configure WhatsApp credentials to send automated notifications to students.
                </p>
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-green-800">
                    <strong>How to get credentials:</strong>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>Go to Meta Business Platform</li>
                      <li>Create a WhatsApp Business Account</li>
                      <li>Get App ID, App Secret, and Access Token</li>
                      <li>Link your WhatsApp Business phone number</li>
                    </ol>
                  </p>
                </div>
                <CredentialsForm
                  title="WhatsApp Credentials"
                  fields={whatsappFields}
                  onSubmit={handleSaveWhatsAppCredentials}
                  isLoading={isLoading}
                  submitText="Save WhatsApp Credentials"
                />
              </div>
            )}

            {activeTab === 'payhere' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">PayHere Payment Gateway Configuration</h2>
                <p className="text-gray-600 mb-6">
                  Configure PayHere to enable course payment processing in Sri Lanka.
                </p>
                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-orange-800">
                    <strong>How to get credentials:</strong>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>Create a PayHere account at payhere.lk</li>
                      <li>Complete merchant setup and verification</li>
                      <li>Get Merchant ID and Merchant Secret</li>
                      <li>Set Notify URL for payment callbacks</li>
                    </ol>
                  </p>
                </div>
                <CredentialsForm
                  title="PayHere Credentials"
                  fields={payhereFields}
                  onSubmit={handleSavePayHereCredentials}
                  isLoading={isLoading}
                  submitText="Save PayHere Credentials"
                />
              </div>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <h3 className="font-bold text-red-900 mb-3">🔒 Security Notice</h3>
          <ul className="text-sm text-red-800 space-y-2">
            <li>✓ Never share API secrets with anyone</li>
            <li>✓ Rotate credentials regularly</li>
            <li>✓ Use strong, unique secrets</li>
            <li>✓ Only set up credentials from a secure, private network</li>
            <li>✓ Monitor API usage and billing</li>
            <li>✓ Review logs for suspicious activity</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminIntegrationSettings;
