import { useState, useEffect } from 'react';
import { CiCircleAlert } from 'react-icons/ci';
import {
  FaServer, FaDatabase, FaCode, FaSpinner,
  FaCheckCircle, FaClock, FaExclamationTriangle, FaHeartbeat,
  FaNetworkWired, FaGitAlt, FaPlug, FaToggleOn
} from 'react-icons/fa';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DeveloperDashboardModern = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/dashboards/api/developer/', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const result = await response.json();
        setDashboardData(result.data);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-5xl text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-300">Loading developer dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/30 border-l-4 border-red-500 p-6 rounded-lg">
            <div className="flex items-center">
              <CiCircleAlert className="text-red-400 text-2xl mr-4" />
              <div>
                <h3 className="text-red-200 font-bold text-lg">{error || 'Error Loading Dashboard'}</h3>
                <p className="text-red-300">Please try refreshing the page.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { system_metrics, api_stats, database_stats, integrations_status, feature_flags } = dashboardData;

  const apiPerformanceData = [
    { time: '00:00', requests: 1200, errors: 20 },
    { time: '04:00', requests: 1800, errors: 15 },
    { time: '08:00', requests: 2400, errors: 25 },
    { time: '12:00', requests: 3200, errors: 35 },
    { time: '16:00', requests: 2800, errors: 28 },
    { time: '20:00', requests: 2000, errors: 18 },
  ];

  const systemHealthCards = [
    {
      label: 'CPU Usage',
      value: `${system_metrics.cpu_usage}%`,
      icon: FaServer,
      bgColor: 'bg-blue-900/20',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-600'
    },
    {
      label: 'Memory Usage',
      value: `${system_metrics.memory_usage}%`,
      icon: FaDatabase,
      bgColor: 'bg-green-900/20',
      textColor: 'text-green-400',
      borderColor: 'border-green-600'
    },
    {
      label: 'Disk Usage',
      value: `${system_metrics.disk_usage}%`,
      icon: FaCode,
      bgColor: 'bg-yellow-900/20',
      textColor: 'text-yellow-400',
      borderColor: 'border-yellow-600'
    },
    {
      label: 'Active Users',
      value: system_metrics.active_users,
      icon: FaNetworkWired,
      bgColor: 'bg-purple-900/20',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-600'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800/80 border-b border-slate-700 sticky top-0 z-20 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-3">
            <FaServer className="text-blue-400" />
            Developer System Dashboard
          </h1>
          <p className="text-slate-400 mt-2">Monitor system health, API performance, and integrations</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* System Health Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemHealthCards.map((card, idx) => (
            <div key={idx} className={`${card.bgColor} border ${card.borderColor} rounded-xl p-6 backdrop-blur`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-slate-800/50`}>
                  <card.icon className={`${card.textColor} text-xl`} />
                </div>
              </div>
              <p className="text-slate-400 text-sm font-medium">{card.label}</p>
              <p className={`text-3xl font-bold ${card.textColor} mt-2`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* API Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 backdrop-blur">
            <h3 className="text-cyan-400 font-semibold mb-4 flex items-center gap-2">
              <FaHeartbeat className="text-red-400" />
              API Health
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Total Requests (24h)</span>
                <span className="text-cyan-400 font-mono font-bold">{api_stats.total_requests.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Success Rate</span>
                <span className="text-green-400 font-mono font-bold">
                  {((api_stats.successful_requests / api_stats.total_requests) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Failed Requests</span>
                <span className="text-red-400 font-mono font-bold">{api_stats.failed_requests}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Avg Response Time</span>
                <span className="text-yellow-400 font-mono font-bold">{api_stats.avg_response_time}ms</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 backdrop-blur">
            <h3 className="text-cyan-400 font-semibold mb-4 flex items-center gap-2">
              <FaDatabase className="text-blue-400" />
              Database Stats
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Users</span>
                <span className="text-blue-400 font-mono font-bold">{database_stats.users.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Courses</span>
                <span className="text-blue-400 font-mono font-bold">{database_stats.courses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Enrollments</span>
                <span className="text-blue-400 font-mono font-bold">{database_stats.enrollments.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Quiz Attempts</span>
                <span className="text-blue-400 font-mono font-bold">{database_stats.quiz_attempts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payments</span>
                <span className="text-blue-400 font-mono font-bold">{database_stats.payments.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 backdrop-blur">
            <h3 className="text-cyan-400 font-semibold mb-4 flex items-center gap-2">
              <FaCode className="text-green-400" />
              Build & Deploy
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg">
                <p className="text-green-400 text-sm font-semibold">✓ Frontend Build</p>
                <p className="text-slate-400 text-xs mt-1">Last: 2 hours ago</p>
              </div>
              <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg">
                <p className="text-green-400 text-sm font-semibold">✓ Backend Build</p>
                <p className="text-slate-400 text-xs mt-1">Last: 1 hour ago</p>
              </div>
              <div className="p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
                <p className="text-blue-400 text-sm font-semibold">⟳ CI/CD Pipeline</p>
                <p className="text-slate-400 text-xs mt-1">Running tests...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-700">
          {['overview', 'integrations', 'features'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'integrations' && 'Integrations'}
              {tab === 'features' && 'Feature Flags'}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* API Performance Chart */}
              <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 backdrop-blur mb-8">
                <h2 className="text-xl font-bold text-cyan-400 mb-6">API Request Volume & Errors</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={apiPerformanceData}>
                    <defs>
                      <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="time" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Area type="monotone" dataKey="requests" stroke="#06b6d4" fillOpacity={1} fill="url(#colorRequests)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Error Logs */}
              <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 backdrop-blur">
                <h2 className="text-xl font-bold text-cyan-400 mb-6">Recent System Events</h2>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg flex items-start gap-3">
                    <FaClock className="text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-yellow-400 text-sm font-semibold">Database Backup</p>
                      <p className="text-slate-400 text-xs">Completed at 02:00 UTC - 234 GB</p>
                    </div>
                  </div>
                  <div className="p-3 bg-green-900/20 border border-green-700 rounded-lg flex items-start gap-3">
                    <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-green-400 text-sm font-semibold">SSL Certificate Renewed</p>
                      <p className="text-slate-400 text-xs">All domains updated - Valid for 1 year</p>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-lg flex items-start gap-3">
                    <FaClock className="text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-blue-400 text-sm font-semibold">Cache Cleared</p>
                      <p className="text-slate-400 text-xs">Redis cache invalidated at 01:30 UTC</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div>
              <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 backdrop-blur">
                <h2 className="text-lg font-bold text-cyan-400 mb-6">Quick Stats</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                    <p className="text-slate-400 text-sm mb-1">Uptime</p>
                    <p className="text-2xl font-bold text-green-400">99.98%</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                    <p className="text-slate-400 text-sm mb-1">Response Time</p>
                    <p className="text-2xl font-bold text-blue-400">{api_stats.avg_response_time}ms</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                    <p className="text-slate-400 text-sm mb-1">Requests/sec</p>
                    <p className="text-2xl font-bold text-cyan-400">{(api_stats.total_requests / 86400).toFixed(1)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(integrations_status).map(([name, data]) => (
              <div key={name} className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 backdrop-blur">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-cyan-400 font-semibold capitalize">{name.replace(/_/g, ' ')}</h3>
                  {data.status === 'connected' ? (
                    <FaCheckCircle className="text-green-400 text-xl" />
                  ) : (
                    <FaExclamationTriangle className="text-red-400 text-xl" />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Status</span>
                    <span className={`text-sm font-bold ${
                      data.status === 'connected' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {data.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Last Sync</span>
                    <span className="text-slate-400 text-xs">Just now</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 backdrop-blur">
            <h2 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
              <FaToggleOn className="text-purple-400" />
              Feature Flags
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(feature_flags).map(([name, enabled]) => (
                <div key={name} className="p-4 border border-slate-600 rounded-lg flex items-center justify-between">
                  <div>
                    <h3 className="text-slate-200 font-semibold capitalize">{name.replace(/_/g, ' ')}</h3>
                    <p className="text-slate-400 text-sm mt-1">{enabled ? 'Enabled' : 'Disabled'}</p>
                  </div>
                  <div className={`w-12 h-7 rounded-full transition-colors flex items-center ${
                    enabled ? 'bg-green-600' : 'bg-slate-600'
                  }`}>
                    <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                      enabled ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperDashboardModern;
