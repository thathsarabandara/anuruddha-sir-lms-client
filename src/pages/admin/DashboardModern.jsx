import { useState, useEffect } from 'react';
import { CiCircleAlert } from 'react-icons/ci';
import { FaArrowTrendUp } from "react-icons/fa6"
import {
  FaUsers, FaBook, FaDollarSign, FaSpinner,
  FaCheckCircle, FaClock, FaChartBar, FaGraduationCap, FaTrophy,
  FaExclamationTriangle
} from 'react-icons/fa';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PulseLoader from '../../components/common/PulseLoader';

const AdminDashboardModern = () => {
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
      const response = await fetch('/api/v1/dashboards/api/admin/', {
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
    return <PulseLoader />;
  }
  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
            <div className="flex items-center">
              <CiCircleAlert className="text-red-600 text-2xl mr-4" />
              <div>
                <h3 className="text-red-900 font-bold text-lg">{error || 'Error Loading Dashboard'}</h3>
                <p className="text-red-700">Please try refreshing the page.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { stats, recent_courses, pending_teachers, recent_students, system_alerts } = dashboardData;

  const revenueChartData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
  ];

  const statCards = [
    {
      label: 'Total Users',
      value: stats.total_users,
      icon: FaUsers,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Active Courses',
      value: stats.published_courses,
      icon: FaBook,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Total Revenue',
      value: `₨${(stats.total_revenue / 100000).toFixed(1)}L`,
      icon: FaDollarSign,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Monthly Revenue',
      value: `₨${(stats.monthly_revenue / 100000).toFixed(2)}L`,
      icon: FaArrowTrendUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Control Panel
          </h1>
          <p className="text-slate-600 mt-2">Manage platform, users, and monitor system health</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* System Alerts */}
        {system_alerts.length > 0 && (
          <div className="mb-8 space-y-3">
            {system_alerts.map((alert, idx) => (
              <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'high' ? 'bg-red-50 border-red-500' :
                alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                'bg-blue-50 border-blue-500'
              }`}>
                <div className="flex items-center">
                  {alert.severity === 'high' ? (
                    <FaExclamationTriangle className="text-red-600 mr-3" />
                  ) : (
                    <FaClock className="text-yellow-600 mr-3" />
                  )}
                  <span className={`font-medium ${
                    alert.severity === 'high' ? 'text-red-700' :
                    alert.severity === 'medium' ? 'text-yellow-700' :
                    'text-blue-700'
                  }`}>
                    {alert.message}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, idx) => (
            <div key={idx} className="group">
              <div className={`${card.bgColor} rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all h-full`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`${card.color} bg-gradient-to-br p-3 rounded-lg`}>
                    <card.icon className="text-white text-xl" />
                  </div>
                </div>
                <p className="text-slate-600 text-sm font-medium">{card.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-600 mb-4">User Demographics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Total Students</span>
                <span className="font-bold text-blue-600">{stats.total_students}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Total Teachers</span>
                <span className="font-bold text-green-600">{stats.total_teachers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Total Users</span>
                <span className="font-bold text-purple-600">{stats.total_users}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-600 mb-4">Course Analytics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Published</span>
                <span className="font-bold text-green-600">{stats.published_courses}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Draft</span>
                <span className="font-bold text-slate-600">{stats.draft_courses}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Pending Approval</span>
                <span className="font-bold text-orange-600">{stats.pending_approval}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-600 mb-4">Engagement Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Enrollments</span>
                <span className="font-bold text-blue-600">{stats.total_enrollments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Quizzes</span>
                <span className="font-bold text-purple-600">{stats.total_quizzes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Certificates Issued</span>
                <span className="font-bold text-yellow-600">{stats.certificates_issued}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          {['overview', 'approvals', 'users'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'approvals' && 'Approvals'}
              {tab === 'users' && 'Recent Users'}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Revenue Chart */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Revenue Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              {/* Today's Revenue */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Daily Revenue</h2>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-slate-700 mb-1">Today</p>
                  <p className="text-3xl font-bold text-green-600">₨{(stats.today_revenue / 1000).toFixed(1)}K</p>
                </div>
              </div>

              {/* Pending Payments */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mt-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Pending Payments</h2>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{stats.pending_payments}</p>
                  <p className="text-sm text-slate-600 mt-1">Awaiting processing</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Approvals Tab */}
        {activeTab === 'approvals' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pending Teachers */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Teachers Pending Approval</h2>
              <div className="space-y-4">
                {pending_teachers.length > 0 ? (
                  pending_teachers.map(teacher => (
                    <div key={teacher.id} className="p-4 border border-slate-200 rounded-lg hover:bg-blue-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-slate-900">{teacher.name}</h3>
                          <p className="text-sm text-slate-600">{teacher.email}</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 bg-orange-100 text-orange-700 rounded">
                          Pending
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{teacher.qualifications}</p>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 px-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded text-sm transition-colors">
                          Approve
                        </button>
                        <button className="flex-1 py-2 px-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded text-sm transition-colors">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-600 text-center py-8">No pending teacher applications</p>
                )}
              </div>
            </div>

            {/* Recent Courses */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Courses</h2>
              <div className="space-y-4">
                {recent_courses.map(course => (
                  <div key={course.id} className="p-4 border border-slate-200 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-slate-900 line-clamp-1">{course.title}</h3>
                        <p className="text-sm text-slate-600">{course.teacher}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        course.is_approved
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {course.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {new Date(course.created_at).toLocaleDateString()}
                    </p>
                    {!course.is_approved && (
                      <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Review & Approve →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Student Registrations</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recent_students.map(student => (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">{student.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{student.email}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          student.status === 'APPROVED'
                            ? 'bg-green-100 text-green-700'
                            : student.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(student.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardModern;
