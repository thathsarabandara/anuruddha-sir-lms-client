import { useEffect, useState } from 'react';
import { 
  FaBook, FaChartBar, FaCheckCircle, 
  FaServer, 
  FaUsers, FaEye, FaClock, FaMoneyBillWave,
  FaExclamationTriangle, FaInfoCircle, FaDownload, FaFilter,
  FaSearch, FaBell, FaShieldAlt,
} from 'react-icons/fa';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler } from 'chart.js';
import PulseLoader from '../../components/common/PulseLoader';
import { IoIosTrendingUp } from 'react-icons/io';
import { MdLocalActivity } from 'react-icons/md';
import { CiCircleAlert } from 'react-icons/ci';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

const AdminDashboard = () => {
  // Dummy data
  const dummyStats = [
    { label: 'Total Users', value: 2345, change: '+8.2%', color: 'blue', icon: FaUsers, detail: 'Across all roles' },
    { label: 'Active This Month', value: 1450, change: '+12%', color: 'green', icon: FaEye, detail: 'User engagement' },
    { label: 'Total Revenue', value: '$125.4K', change: '+24%', color: 'purple', icon: FaMoneyBillWave, detail: 'Lifetime revenue' },
    { label: 'Monthly Revenue', value: '$12.3K', change: '+9.7%', color: 'yellow', icon: FaChartBar, detail: 'Last 30 days' },
    { label: 'Total Courses', value: 156, change: '+5%', color: 'indigo', icon: FaBook, detail: '142 published' },
    { label: 'System Health', value: '99.98%', change: 'optimal', color: 'teal', icon: FaServer, detail: 'Uptime' },
  ];

  const dummyRecentActivities = [
    { user: 'Dr. James Wilson', action: 'User account approved', type: 'approval', time: '14:30', severity: 'success' },
    { user: 'Sarah Moore', action: 'Course published - Python 101', type: 'course', time: '14:15', severity: 'success' },
    { user: 'Payment System', action: 'Transaction completed - $29.99', type: 'payment', time: '14:05', severity: 'success' },
    { user: 'Admin', action: 'User banned for TOS violation', type: 'moderation', time: '13:45', severity: 'warning' },
    { user: 'System', action: 'Database backup completed', type: 'system', time: '10:00', severity: 'info' },
    { user: 'John Smith', action: 'Teacher registration pending documents', type: 'pending', time: 'Yesterday', severity: 'warning' },
    { user: 'Course Review', action: 'Low rating course flagged (3.2⭐)', type: 'alert', time: 'Yesterday', severity: 'warning' },
    { user: 'System', action: 'SSL certificate expiring in 30 days', type: 'alert', time: '2 days ago', severity: 'warning' },
  ];

  const dummyPendingApprovals = [
    { type: 'Teacher', name: 'Dr. Robert Brown', request: 'Teacher Registration', date: '2024-03-09', priority: 'high', documents: 3 },
    { type: 'Course', name: 'Advanced Python', request: 'Course Approval', date: '2024-03-10', priority: 'high', instructor: 'Prof. Smith' },
    { type: 'Teacher', name: 'Jennifer Lee', request: 'Credential Verification', date: '2024-03-08', priority: 'medium', documents: 2 },
  ];

  const dummySystemAlerts = [
    { message: 'High server CPU usage (85%)', severity: 'high', time: '15 min ago', icon: FaExclamationTriangle },
    { message: 'Database cleanup scheduled for March 15, 2024', severity: 'info', time: '2 hours ago', icon: FaInfoCircle },
    { message: 'SSL certificate expiring in 30 days', severity: 'medium', time: '1 day ago', icon: CiCircleAlert },
    { message: 'Backup completed successfully - 1.2 GB', severity: 'success', time: '2 days ago', icon: FaCheckCircle },
  ];

  // User Statistics
  const userStats = {
    total: 2345,
    students: { count: 1890, percent: 80.6 },
    teachers: { count: 410, percent: 17.5 },
    admins: { count: 45, percent: 1.9 },
    activeThisMonth: 1450,
    newThisMonth: 234,
    pendingApproval: 12,
    banned: 8,
    online: 156
  };

  // System Health Metrics
  const systemHealth = {
    status: 'operational',
    api: { response_time: 125, uptime: 99.98 },
    database: { connections: 45, max: 100, response_time: 45 },
    storage: { used: 156.5, total: 500, percent: 31.3 },
    server: { cpu: 42, memory: 68, disk: 78 },
    activeSessions: 234,
    pendingJobs: 12
  };

  // Revenue Data
  const revenueData = {
    lifetime: 125450.75,
    thisMonth: 12340.50,
    lastMonth: 11250.25,
    transactions: { successful: 553, failed: 15, rate: 97.4 },
    payouts: { pending: 2340.75, teachers: 34, avgAmount: 68.85 },
    refunds: { total: 450, count: 8, chargebacks: 1 },
    subscriptions: 8500,
    courses: 3200,
    certificates: 400
  };

  // Monthly Revenue Chart Data
  const monthlyRevenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Monthly Revenue',
      data: [8200, 9500, 12340.50, 11200, 13450, 14200, 12800, 15500, 16200, 14500, 13800, 12340],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: '#3B82F6',
      pointBorderColor: '#fff',
      pointBorderWidth: 2
    }]
  };

  // User Distribution Chart
  const userDistributionData = {
    labels: ['Students (80.6%)', 'Teachers (17.5%)', 'Admins (1.9%)'],
    datasets: [{
      data: [1890, 410, 45],
      backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6'],
      borderColor: '#fff',
      borderWidth: 2
    }]
  };

  // Course Status
  const courseStats = {
    published: 142,
    draft: 10,
    archived: 4,
    totalEnrollments: 8924,
    avgRating: 4.52,
    avgCompletion: 71.4
  };

  // Low Rating Courses
  const lowRatingCourses = [
    { id: 1, title: 'Outdated Course', rating: 3.2, enrollments: 45, complaints: 8 },
    { id: 2, title: 'Web Dev Basics v1', rating: 3.5, enrollments: 32, complaints: 5 }
  ];

  // Reported Content
  const reportedContent = [
    { id: 1, title: 'Inappropriate Content', type: 'course', reporter: 'User Report', date: '2024-03-09', status: 'reviewing' },
    { id: 2, title: 'Copyright Issue', type: 'lesson', reporter: 'Legal Team', date: '2024-03-08', status: 'new' }
  ];

  const [stats, setStats] = useState(dummyStats);
  const [recentActivities, setRecentActivities] = useState(dummyRecentActivities);
  const [pendingApprovals, setPendingApprovals] = useState(dummyPendingApprovals);
  const [systemAlerts, setSystemAlerts] = useState(dummySystemAlerts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-700 border-red-300',
      medium: 'bg-orange-100 text-orange-700 border-orange-300',
      low: 'bg-green-100 text-green-700 border-green-300',
    };
    return colors[priority] || colors.low;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      high: 'border-l-4 border-l-red-500 bg-red-50',
      medium: 'border-l-4 border-l-orange-500 bg-orange-50',
      low: 'border-l-4 border-l-blue-500 bg-blue-50',
      success: 'border-l-4 border-l-green-500 bg-green-50',
      info: 'border-l-4 border-l-cyan-500 bg-cyan-50',
      warning: 'border-l-4 border-l-yellow-500 bg-yellow-50'
    };
    return colors[severity] || colors.info;
  };

  const getSeverityTextColor = (severity) => {
    const colors = {
      high: 'text-red-700',
      medium: 'text-orange-700',
      low: 'text-blue-700',
      success: 'text-green-700',
      info: 'text-cyan-700',
      warning: 'text-yellow-700'
    };
    return colors[severity] || colors.info;
  };

  const getColorBg = (color) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      purple: 'bg-purple-50 border-purple-200',
      yellow: 'bg-yellow-50 border-yellow-200',
      indigo: 'bg-indigo-50 border-indigo-200',
      orange: 'bg-orange-50 border-orange-200',
      teal: 'bg-teal-50 border-teal-200',
      red: 'bg-red-50 border-red-200',
    };
    return colorMap[color] || 'bg-gray-50 border-gray-200';
  };

  const getColorIcon = (color) => {
    const colorMap = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      yellow: 'text-yellow-600',
      indigo: 'text-indigo-600',
      orange: 'text-orange-600',
      teal: 'text-teal-600',
      red: 'text-red-600',
    };
    return colorMap[color] || 'text-gray-600';
  };

  useEffect(() => {
    // Simulate loading of dummy data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">SuperAdmin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">Platform overview and management console</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FaSearch className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FaBell className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FaFilter className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid - Mobile First */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`group rounded-lg p-4 bg-white border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-300 ${getColorBg(stat.color)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">{stat.label}</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-2">{stat.detail}</p>
                  </div>
                  <div className={`ml-2 p-2 rounded-lg bg-white bg-opacity-50 group-hover:bg-opacity-100 transition-all ${getColorIcon(stat.color)}`}>
                    <Icon className="text-lg" />
                  </div>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <span className={`text-xs font-semibold ${stat.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${stat.change.includes('+') ? 'bg-green-500' : 'bg-red-500'}`} style={{width: `${Math.abs(parseInt(stat.change))}%`}}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Revenue Trends</h2>
                <p className="text-sm text-gray-600 mt-1">Last 12 months</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <FaDownload className="text-gray-600" />
              </button>
            </div>
            <div className="h-64 sm:h-80">
              <Line
                data={monthlyRevenueData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    y: { beginAtZero: true, ticks: { callback: value => '$' + value.toLocaleString() } }
                  }
                }}
              />
            </div>
          </div>

          {/* User Distribution */}
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">User Distribution</h2>
                <p className="text-sm text-gray-600 mt-1">Total: {userStats.total.toLocaleString()}</p>
              </div>
            </div>
            <div className="h-64 sm:h-80">
              <Doughnut
                data={userDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom' }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* System Health & User Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* System Health */}
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-teal-50 rounded-lg">
                <FaServer className="text-teal-600 text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">System Health</h2>
                <p className="text-sm text-green-600 mt-1">✓ All systems operational</p>
              </div>
            </div>
            <div className="space-y-4">
              {/* API Health */}
              <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900">API Response</span>
                  <span className="text-sm font-bold text-blue-600">{systemHealth.api.response_time}ms</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>

              {/* Database */}
              <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-50 rounded-lg border border-purple-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900">Database</span>
                  <span className="text-sm font-bold text-purple-600">{systemHealth.database.connections}/{systemHealth.database.max}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
              </div>

              {/* Storage */}
              <div className="p-3 bg-gradient-to-r from-orange-50 to-orange-50 rounded-lg border border-orange-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900">Storage</span>
                  <span className="text-sm font-bold text-orange-600">{systemHealth.storage.percent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{width: `${systemHealth.storage.percent}%`}}></div>
                </div>
              </div>

              {/* Server */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">CPU</p>
                  <p className="text-lg font-bold text-gray-900">{systemHealth.server.cpu}%</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Memory</p>
                  <p className="text-lg font-bold text-gray-900">{systemHealth.server.memory}%</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Disk</p>
                  <p className="text-lg font-bold text-gray-900">{systemHealth.server.disk}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Management Overview */}
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 rounded-lg">
                <FaUsers className="text-blue-600 text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">User Management</h2>
                <p className="text-sm text-gray-600 mt-1">Active this month: {userStats.activeThisMonth.toLocaleString()}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Active Users</span>
                <span className="text-lg font-bold text-green-600">{userStats.online}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Pending Approvals</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-orange-100 text-orange-700">{userStats.pendingApproval}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Banned Users</span>
                <span className="text-lg font-bold text-red-600">{userStats.banned}</span>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <FaInfoCircle className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">New Users This Month</p>
                    <p className="text-blue-700 mt-1">{userStats.newThisMonth} new registrations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Overview & Course Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Financial Overview */}
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-50 rounded-lg">
                <FaMoneyBillWave className="text-green-600 text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Financial Overview</h2>
                <p className="text-sm text-gray-600 mt-1">Revenue & Transactions</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <p className="text-xs text-gray-600 font-medium">Lifetime Revenue</p>
                <p className="text-2xl font-bold text-green-600 mt-2">${revenueData.lifetime.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-gray-600">This Month</p>
                  <p className="text-lg font-bold text-blue-600 mt-1">${revenueData.thisMonth.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="text-xs text-gray-600">Success Rate</p>
                  <p className="text-lg font-bold text-purple-600 mt-1">{revenueData.transactions.rate}%</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <p className="text-xs text-gray-600">Pending Payouts</p>
                  <p className="text-lg font-bold text-orange-600 mt-1">${revenueData.payouts.pending.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <p className="text-xs text-gray-600">Refunds</p>
                  <p className="text-lg font-bold text-red-600 mt-1">${revenueData.refunds.total.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Course Status */}
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <FaBook className="text-indigo-600 text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Content Status</h2>
                <p className="text-sm text-gray-600 mt-1">Course management</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-50 rounded-lg border border-indigo-200">
                <p className="text-xs text-gray-600 font-medium">Total Courses</p>
                <p className="text-2xl font-bold text-indigo-600 mt-2">{courseStats.published + courseStats.draft + courseStats.archived}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-xs text-gray-600">Published</p>
                  <p className="text-lg font-bold text-green-600 mt-1">{courseStats.published}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <p className="text-xs text-gray-600">Draft</p>
                  <p className="text-lg font-bold text-yellow-600 mt-1">{courseStats.draft}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-600">Archived</p>
                  <p className="text-lg font-bold text-gray-600 mt-1">{courseStats.archived}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-100">
                  <p className="text-xs text-gray-600">Avg Rating</p>
                  <p className="text-lg font-bold text-cyan-600 mt-1">⭐ {courseStats.avgRating}</p>
                </div>
                <div className="p-3 bg-pink-50 rounded-lg border border-pink-100">
                  <p className="text-xs text-gray-600">Completions</p>
                  <p className="text-lg font-bold text-pink-600 mt-1">{courseStats.avgCompletion}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity & Alerts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-50 rounded-lg">
                  <MdLocalActivity className="text-cyan-600 text-lg" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Recent Activities</h2>
                  <p className="text-sm text-gray-600 mt-1">Latest {recentActivities.length} events</p>
                </div>
              </div>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">View All →</button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentActivities.map((activity, index) => (
                <div key={index} className={`p-4 rounded-lg border transition-all ${getSeverityColor(activity.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${getSeverityTextColor(activity.severity)}`}>{activity.user}</p>
                      <p className="text-sm text-gray-700 mt-1">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${activity.severity === 'success' ? 'bg-green-100 text-green-700' : activity.severity === 'warning' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                      {activity.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-50 rounded-lg">
                <FaBell className="text-red-600 text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">System Alerts</h2>
                <p className="text-sm text-gray-600 mt-1">Critical notifications</p>
              </div>
            </div>
            <div className="space-y-3">
              {systemAlerts.map((alert, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                  <div className="flex gap-3">
                    <alert.icon className={`flex-shrink-0 mt-0.5 ${getSeverityTextColor(alert.severity)}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium leading-tight ${getSeverityTextColor(alert.severity)}`}>{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-50 rounded-lg">
                <FaClock className="text-orange-600 text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Pending Approvals</h2>
                <p className="text-sm text-gray-600 mt-1">Awaiting admin review</p>
              </div>
            </div>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-orange-100 text-orange-700">
              {pendingApprovals.length} pending
            </span>
          </div>
          {pendingApprovals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 hidden sm:table-cell">Request</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 hidden md:table-cell">Date</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-700">Priority</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pendingApprovals.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary-100 text-primary-700">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{item.request}</td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{item.date}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors">
                            Approve
                          </button>
                          <button className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors">
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
            <p className="text-gray-500 text-center py-8">No pending approvals</p>
          )}
        </div>

        {/* Content Moderation & Low Ratings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Low Rating Courses */}
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <IoIosTrendingUp className="text-yellow-600 text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Low Rating Courses</h2>
                <p className="text-sm text-gray-600 mt-1">Quality considerations</p>
              </div>
            </div>
            <div className="space-y-3">
              {lowRatingCourses.map((course, index) => (
                <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{course.title}</p>
                      <p className="text-sm text-gray-600 mt-1">⭐ {course.rating} • {course.enrollments} enrollments</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                      {course.complaints} complaints
                    </span>
                  </div>
                  <button className="w-full text-sm font-medium text-yellow-700 hover:bg-yellow-100 py-2 rounded transition-colors mt-2">
                    Review Course
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Reported Content */}
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-50 rounded-lg">
                <CiCircleAlert className="text-red-600 text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Reported Content</h2>
                <p className="text-sm text-gray-600 mt-1">User reports & flags</p>
              </div>
            </div>
            <div className="space-y-3">
              {reportedContent.map((report, index) => (
                <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{report.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{report.type} • {report.reporter}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${report.status === 'new' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{report.date}</p>
                  <button className="w-full text-sm font-medium text-red-700 hover:bg-red-100 py-2 rounded transition-colors">
                    Review Report
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button className="p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md hover:border-slate-300 transition-all group">
            <div className="p-3 bg-blue-50 rounded-lg mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
              <FaUsers className="text-blue-600 text-xl mx-auto" />
            </div>
            <p className="text-sm font-medium text-gray-900">Manage Users</p>
          </button>
          <button className="p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md hover:border-slate-300 transition-all group">
            <div className="p-3 bg-green-50 rounded-lg mx-auto mb-3 group-hover:bg-green-100 transition-colors">
              <FaBook className="text-green-600 text-xl mx-auto" />
            </div>
            <p className="text-sm font-medium text-gray-900">Content</p>
          </button>
          <button className="p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md hover:border-slate-300 transition-all group">
            <div className="p-3 bg-purple-50 rounded-lg mx-auto mb-3 group-hover:bg-purple-100 transition-colors">
              <FaChartBar className="text-purple-600 text-xl mx-auto" />
            </div>
            <p className="text-sm font-medium text-gray-900">Reports</p>
          </button>
          <button className="p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md hover:border-slate-300 transition-all group">
            <div className="p-3 bg-orange-50 rounded-lg mx-auto mb-3 group-hover:bg-orange-100 transition-colors">
              <FaShieldAlt className="text-orange-600 text-xl mx-auto" />
            </div>
            <p className="text-sm font-medium text-gray-900">Settings</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
