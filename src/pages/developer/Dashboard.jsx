import { FaCheck, FaClipboardList, FaClock, FaCreditCard, FaExclamationTriangle, FaFileVideo } from 'react-icons/fa';

const DeveloperDashboard = () => {
  const systemStats = [
    { label: 'API Health', value: '98%', status: 'healthy', icon: '🔌', color: 'bg-green-100 text-green-700' },
    { label: 'Server Uptime', value: '99.9%', status: 'healthy', icon: '⚡', color: 'bg-blue-100 text-blue-700' },
    { label: 'Response Time', value: '245ms', status: 'good', icon: FaClock, color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Error Rate', value: '0.02%', status: 'low', icon: FaExclamationTriangle, color: 'bg-green-100 text-green-700' },
  ];

  const serviceStatus = [
    { name: 'Database', status: 'online', latency: '12ms', uptime: '99.9%', icon: '🗄️' },
    { name: 'API Server', status: 'online', latency: '45ms', uptime: '99.8%', icon: '🖥️' },
    { name: 'PayHere Gateway', status: 'online', latency: '230ms', uptime: '99.5%', icon: FaCreditCard },
    { name: 'Zoom API', status: 'online', latency: '180ms', uptime: '99.7%', icon: FaFileVideo },
    { name: 'Email Service', status: 'online', latency: '350ms', uptime: '98.9%', icon: '📧' },
    { name: 'File Storage', status: 'online', latency: '95ms', uptime: '99.6%', icon: '💾' },
  ];

  const recentErrors = [
    { 
      type: 'Database Connection', 
      message: 'Connection timeout after 30s', 
      time: '2 hours ago',
      severity: 'medium',
      resolved: true 
    },
    { 
      type: 'Payment Gateway', 
      message: 'PayHere API rate limit exceeded', 
      time: '5 hours ago',
      severity: 'low',
      resolved: true 
    },
    { 
      type: 'Authentication', 
      message: 'JWT token validation failed', 
      time: '1 day ago',
      severity: 'high',
      resolved: true 
    },
  ];

  const apiMetrics = {
    totalRequests: '1.2M',
    successRate: '99.98%',
    avgResponseTime: '245ms',
    peakRequests: '3,450/min',
  };

  const getStatusColor = (status) => {
    const colors = {
      online: 'bg-green-100 text-green-700',
      offline: 'bg-red-100 text-red-700',
      degraded: 'bg-yellow-100 text-yellow-700',
    };
    return colors[status] || colors.offline;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      high: 'border-l-red-500 bg-red-50',
      medium: 'border-l-orange-500 bg-orange-50',
      low: 'border-l-blue-500 bg-blue-50',
    };
    return colors[severity] || colors.low;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Developer Dashboard</h1>
        <p className="text-gray-600">System health monitoring and technical insights</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {systemStats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between mb-2">
              <div className={`text-3xl ${stat.color} p-3 rounded-lg`}>{stat.icon}</div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${stat.color}`}>
                {stat.status.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Service Status */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Service Status</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">Refresh</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceStatus.map((service, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{service.icon}</span>
                    <span className="font-medium text-gray-900">{service.name}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                    {service.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Latency:</span>
                    <span className="font-medium">{service.latency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uptime:</span>
                    <span className="font-medium">{service.uptime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Errors */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Errors</h2>
          <div className="space-y-3">
            {recentErrors.map((error, index) => (
              <div key={index} className={`p-3 border-l-4 rounded ${getSeverityColor(error.severity)}`}>
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900">{error.type}</p>
                  {error.resolved && (
                    <span className="text-xs text-green-600 font-medium">✓ Resolved</span>
                  )}
                </div>
                <p className="text-xs text-gray-700 mb-2">{error.message}</p>
                <p className="text-xs text-gray-500">{error.time}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 btn-outline text-sm py-2">View All Errors</button>
        </div>
      </div>

      {/* API Metrics */}
      <div className="card mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">API Performance Metrics (Last 24h)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{apiMetrics.totalRequests}</p>
            <p className="text-sm text-gray-600 mt-1">Total Requests</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">{apiMetrics.successRate}</p>
            <p className="text-sm text-gray-600 mt-1">Success Rate</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-3xl font-bold text-yellow-600">{apiMetrics.avgResponseTime}</p>
            <p className="text-sm text-gray-600 mt-1">Avg Response Time</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">{apiMetrics.peakRequests}</p>
            <p className="text-sm text-gray-600 mt-1">Peak Load</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <button className="btn-primary py-4">
          <span className="text-2xl mb-2 block">🔧</span>
          System Health
        </button>
        <button className="btn-primary py-4">
          <FaClipboardList className="text-2xl mb-2 block" />
          API Logs
        </button>
        <button className="btn-primary py-4">
          <FaExclamationTriangle className="text-2xl mb-2 block" />
          Error Monitor
        </button>
        <button className="btn-primary py-4">
          <span className="text-2xl mb-2 block">🔌</span>
          Integrations
        </button>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
