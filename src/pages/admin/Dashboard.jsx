import { FaBook,  FaChartBar, FaCheckCircle, FaCreditCard, FaFilePdf, FaFileVideo, FaGraduationCap, FaTrophy, FaUserGraduate } from 'react-icons/fa';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Students', value: '1,247', change: '+12%', icon: FaUserGraduate, color: 'blue' },
    { label: 'Active Teachers', value: '18', change: '+2', icon: FaBook, color: 'green' },
    { label: 'Total Courses', value: '45', change: '+5', icon: FaBook, color: 'purple' },
    { label: 'Monthly Revenue', value: 'Rs. 2.4M', change: '+18%', icon: '💰', color: 'yellow' },
    { label: 'Active Classes', value: '156', change: '+23', icon: FaGraduationCap, color: 'indigo' },
    { label: 'Pending Approvals', value: '8', change: '-3', icon: '⏳', color: 'orange' },
    { label: 'System Health', value: '98%', change: '+2%', icon: '🔧', color: 'teal' },
    { label: 'Support Tickets', value: '12', change: '-5', icon: '🎫', color: 'red' },
  ];

  const recentActivities = [
    { type: 'enrollment', user: 'Kamal Perera', action: 'enrolled in Mathematics Excellence', time: '5 mins ago', icon: FaCheckCircle },
    { type: 'payment', user: 'Nimal Silva', action: 'paid Rs. 12,000 via PayHere', time: '12 mins ago', icon: FaCreditCard },
    { type: 'teacher', user: 'Saman Fernando', action: 'uploaded new recording', time: '25 mins ago', icon: FaFileVideo },
    { type: 'quiz', user: 'Dilshan Mendis', action: 'completed Mathematics Quiz #5', time: '35 mins ago', icon: FaFilePdf },
    { type: 'certificate', user: 'Kasun Jayawardena', action: 'earned a new certificate', time: '1 hour ago', icon: FaTrophy },
  ];

  const pendingApprovals = [
    { type: 'teacher', name: 'Chaminda Wickramasinghe', request: 'Teacher Registration', date: 'Dec 17, 2025', priority: 'high' },
    { type: 'course', name: 'Advanced English Grammar', request: 'Course Approval', date: 'Dec 17, 2025', priority: 'medium' },
    { type: 'payment', name: 'Bank Slip Verification', request: 'Payment Verification', date: 'Dec 16, 2025', priority: 'high' },
    { type: 'quiz', name: 'Science Chapter 10 Quiz', request: 'Quiz Moderation', date: 'Dec 16, 2025', priority: 'low' },
  ];

  const systemAlerts = [
    { type: 'warning', message: 'Server CPU usage at 85%', time: '2 hours ago', severity: 'medium' },
    { type: 'info', message: 'Scheduled maintenance on Dec 20', time: '1 day ago', severity: 'low' },
    { type: 'error', message: '2 failed payment transactions', time: '3 hours ago', severity: 'high' },
  ];

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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Complete system overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} this month
                </span>
              </div>
              <div className={`text-3xl bg-${stat.color}-100 p-3 rounded-lg`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="text-2xl">{activity.icon}</div>
                <div className="flex-1">
                  <p className="text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">System Alerts</h2>
          <div className="space-y-3">
            {systemAlerts.map((alert, index) => (
              <div key={index} className={`p-3 border-l-4 rounded ${getSeverityColor(alert.severity)}`}>
                <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                <p className="text-xs text-gray-600 mt-1">{alert.time}</p>
              </div>
            ))}
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
