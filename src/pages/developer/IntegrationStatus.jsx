import { FaCreditCard, FaFileVideo } from 'react-icons/fa';

const IntegrationStatus = () => {
  const integrations = [
    {
      name: 'PayHere Payment Gateway',
      status: 'connected',
      lastSync: '2 mins ago',
      apiVersion: 'v2.1',
      config: { merchantId: 'XXXXXXXXX', environment: 'production' },
      icon: FaCreditCard,
    },
    {
      name: 'Zoom Video API',
      status: 'connected',
      lastSync: '5 mins ago',
      apiVersion: 'v2',
      config: { appKey: 'XXXXXXXXX', region: 'Asia' },
      icon: FaFileVideo,
    },
    {
      name: 'Email Service (SMTP)',
      status: 'connected',
      lastSync: '1 min ago',
      apiVersion: 'SMTP',
      config: { host: 'smtp.gmail.com', port: '587' },
      icon: '📧',
    },
    {
      name: 'Cloud Storage (AWS S3)',
      status: 'disconnected',
      lastSync: 'Never',
      apiVersion: 'v1',
      config: { bucket: 'lms-storage', region: 'ap-south-1' },
      icon: '☁️',
    },
    {
      name: 'SMS Gateway',
      status: 'connected',
      lastSync: '10 mins ago',
      apiVersion: 'v1.5',
      config: { provider: 'Dialog Axiata', region: 'LK' },
      icon: '📱',
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      connected: 'bg-green-100 text-green-700',
      disconnected: 'bg-red-100 text-red-700',
      error: 'bg-orange-100 text-orange-700',
    };
    return colors[status] || colors.error;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Integration Status</h1>
        <p className="text-gray-600">Monitor third-party service connections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Total Integrations</p>
          <p className="text-3xl font-bold text-gray-900">{integrations.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Connected</p>
          <p className="text-3xl font-bold text-green-600">{integrations.filter(i => i.status === 'connected').length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Issues</p>
          <p className="text-3xl font-bold text-red-600">{integrations.filter(i => i.status !== 'connected').length}</p>
        </div>
      </div>

      <div className="space-y-4">
        {integrations.map((integration, index) => (
          <div key={index} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4 flex-1">
                <div className="text-4xl">{integration.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{integration.name}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                      {integration.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">API Version:</span> {integration.apiVersion}
                    </div>
                    <div>
                      <span className="font-medium">Last Sync:</span> {integration.lastSync}
                    </div>
                  </div>
                  <details className="bg-gray-50 p-3 rounded-lg">
                    <summary className="cursor-pointer font-medium text-sm text-gray-900">Configuration</summary>
                    <div className="mt-2 space-y-1">
                      {Object.entries(integration.config).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-gray-600">{key}:</span>
                          <span className="text-gray-900 font-mono">{value}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              </div>
              <div className="flex flex-col space-y-2 ml-4">
                {integration.status === 'connected' ? (
                  <>
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm">
                      Test Connection
                    </button>
                    <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded text-sm">
                      Configure
                    </button>
                  </>
                ) : (
                  <>
                    <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded text-sm">
                      Reconnect
                    </button>
                    <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded text-sm">
                      Configure
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationStatus;
