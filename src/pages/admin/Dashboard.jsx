import { useEffect, useState } from 'react';
import { FaBook,  FaChartBar, FaCheckCircle, FaCreditCard, FaFilePdf, FaFileVideo, FaGraduationCap, FaTrophy, FaUserGraduate, FaSpinner } from 'react-icons/fa';
import { adminCourseAPI } from '../../api/courseApi';
import PulseLoader from '../../components/common/PulseLoader';

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-orange-100 text-orange-700',
      low: 'bg-green-100 text-green-700',
    };
    return colors[priority] || colors.low;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      high: 'border-l-red-500 bg-red-50',
      medium: 'border-l-orange-500 bg-orange-50',
      low: 'border-l-blue-500 bg-blue-50',
    };
    return colors[severity] || colors.low;
  };

  const getColorBg = (color) => {
    const colorMap = {
      blue: 'bg-blue-100',
      green: 'bg-green-100',
      purple: 'bg-purple-100',
      yellow: 'bg-yellow-100',
      indigo: 'bg-indigo-100',
      orange: 'bg-orange-100',
      teal: 'bg-teal-100',
      red: 'bg-red-100',
    };
    return colorMap[color] || 'bg-gray-100';
  };

  const getStatIcon = (label) => {
    const iconMap = {
      'Total Students': <FaUserGraduate className="text-blue-600" />,
      'Active Teachers': <FaBook className="text-green-600" />,
      'Total Courses': <FaBook className="text-purple-600" />,
      'Monthly Revenue': <span className="text-yellow-600 text-2xl">💰</span>,
      'Active Classes': <FaGraduationCap className="text-indigo-600" />,
      'Pending Approvals': <span className="text-orange-600 text-2xl">⏳</span>,
      'System Health': <span className="text-teal-600 text-2xl">🔧</span>,
    };
    return iconMap[label] || <FaCheckCircle />;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await adminCourseAPI.getDashboardStats();
        
        if (response.data?.success) {
          setStats(response.data.stats || []);
          setRecentActivities(response.data.recent_activities || []);
          setPendingApprovals(response.data.pending_approvals || []);
          setSystemAlerts(response.data.system_alerts || []);
        } else {
          setError('Failed to load dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Refresh dashboard data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Loading state
  if (loading) {
    return <PulseLoader />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Complete system overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.length > 0 ? (
          stats.map((stat, index) => (
            <div key={index} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} this month
                  </span>
                </div>
                <div className={`text-3xl ${getColorBg(stat.color)} p-3 rounded-lg flex items-center justify-center`}>
                  {getStatIcon(stat.label)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Loading stats...</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => {
                const getActivityIcon = (type) => {
                  const iconMap = {
                    enrollment: <FaCheckCircle className="text-blue-600" />,
                    payment: <FaCreditCard className="text-green-600" />,
                    teacher: <FaFileVideo className="text-purple-600" />,
                    quiz: <FaFilePdf className="text-orange-600" />,
                    certificate: <FaTrophy className="text-yellow-600" />,
                  };
                  return iconMap[type] || <FaCheckCircle className="text-blue-600" />;
                };

                return (
                  <div key={index} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <p className="text-gray-900">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-6">No recent activities</p>
            )}
          </div>
        </div>

        {/* System Alerts */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">System Alerts</h2>
          <div className="space-y-3">
            {systemAlerts.length > 0 ? (
              systemAlerts.map((alert, index) => (
                <div key={index} className={`p-3 border-l-4 rounded ${getSeverityColor(alert.severity)}`}>
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-600 mt-1">{alert.time}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-6">No system alerts</p>
            )}
          </div>
          <button className="w-full mt-4 btn-outline text-sm py-2">View All Alerts</button>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="card mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Pending Approvals</h2>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
            {pendingApprovals.length} pending
          </span>
        </div>
        {pendingApprovals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingApprovals.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.request}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.date}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs">
                          Approve
                        </button>
                        <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs">
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">No pending approvals</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <button className="btn-primary py-4">
          <FaUserGraduate className="text-2xl mb-2 block" />
          Manage Students
        </button>
        <button className="btn-primary py-4">
          <FaBook className="text-2xl mb-2 block" />
          Manage Teachers
        </button>
        <button className="btn-primary py-4">
          <FaChartBar className="text-2xl mb-2 block" />
          View Reports
        </button>
        <button className="btn-primary py-4">
          <span className="text-2xl mb-2 block">⚙️</span>
          System Settings
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
