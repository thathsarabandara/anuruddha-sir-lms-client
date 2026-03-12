import { useState, useEffect } from 'react';
import { CiCircleAlert } from 'react-icons/ci';
import { 
  FaBook, FaUsers, FaDollarSign, FaVideo, FaSpinner,
  FaChartBar, FaFire, FaAward, FaClock, FaCheckCircle, FaArrowUp
} from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TeacherDashboardModern = () => {
  // Dummy data
  const dummyDashboardData = {
    stats: {
      total_courses: 5,
      active_students: 245,
      total_revenue: 12450.50,
      pending_reviews: 8,
    },
    todays_classes: [
      { id: 1, title: 'Advanced Python', time: '10:00 AM', status: 'upcoming' },
      { id: 2, title: 'Web Development', time: '2:00 PM', status: 'upcoming' },
    ],
    revenue_trend: [
      { month: 'Jan', revenue: 2400 },
      { month: 'Feb', revenue: 3200 },
      { month: 'Mar', revenue: 2800 },
      { month: 'Apr', revenue: 3900 },
      { month: 'May', revenue: 4500 },
      { month: 'Jun', revenue: 5200 },
    ],
    recent_submissions: [
      { id: 1, student: 'Alex Johnson', quiz: 'Python Basics', score: 85, date: '2024-03-10' },
      { id: 2, student: 'Maria Garcia', quiz: 'Web Dev Quiz', score: 92, date: '2024-03-10' },
    ],
  };

  const [dashboardData, _setDashboardData] = useState(dummyDashboardData);
  const [loading, _setLoading] = useState(false);
  const [_error, _setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Dummy data already loaded
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse mb-3"></div>
          <div className="h-5 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-3"></div>
                  <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
              </div>
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 pb-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>

        {/* Content Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="h-6 w-48 bg-gray-200 rounded-lg animate-pulse mb-6"></div>
              <div className="h-80 bg-gray-100 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="h-6 w-40 bg-gray-200 rounded-lg animate-pulse mb-6"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, itemIdx) => (
                  <div key={itemIdx} className="flex items-center gap-4 pb-3 border-b border-gray-100 last:border-0">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { stats, today_classes, courses, recent_quiz_attempts } = dashboardData;

  const revenueChartData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 5200 },
    { month: 'Apr', revenue: 4500 },
  ];

  const statCards = [
    {
      label: 'Total Courses',
      value: stats.total_courses,
      icon: FaBook,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Active Students',
      value: stats.total_students,
      icon: FaUsers,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Total Revenue',
      value: `₨${(stats.total_revenue / 1000).toFixed(1)}K`,
      icon: FaDollarSign,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Your Earnings',
      value: `₨${(stats.teacher_revenue / 1000).toFixed(1)}K`,
      icon: FaAward,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, {dashboardData.teacher_name}!
              </h1>
              <p className="text-slate-600 mt-2">Manage your courses and track student progress</p>
            </div>
            <div className="hidden sm:block">
              <img 
                src={dashboardData.profile_picture || 'https://via.placeholder.com/80'} 
                alt="Profile" 
                className="w-20 h-20 rounded-full border-4 border-blue-200 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, idx) => (
            <div key={idx} className="group">
              <div className={`${card.bgColor} rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition-all hover:shadow-lg h-full`}>
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

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          {['overview', 'courses', 'students'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Classes */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Today's Classes</h2>
                <div className="space-y-4">
                  {today_classes.length > 0 ? (
                    today_classes.map(cls => (
                      <div key={cls.id} className="p-4 border border-slate-200 rounded-lg hover:bg-blue-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-slate-900">{cls.topic}</h3>
                            <p className="text-sm text-slate-600 mt-1">{cls.course}</p>
                          </div>
                          <span className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-700 rounded-full">
                            {cls.attendance_count} attended
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <FaClock className="text-orange-600" />
                            {new Date(cls.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaVideo className="text-blue-600" />
                            {cls.duration} min
                          </span>
                        </div>
                        <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
                          View Details →
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-600 text-center py-8">No classes scheduled for today</p>
                  )}
                </div>
              </div>

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

            {/* Pending Tasks */}
            <div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Pending Tasks</h2>
                <div className="space-y-3">
                  {stats.pending_submissions > 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-slate-700 mb-1">Quiz Submissions to Grade</p>
                      <p className="text-2xl font-bold text-red-600">{stats.pending_submissions}</p>
                    </div>
                  )}
                  {stats.total_students > 0 && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-slate-700 mb-1">Active Students</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.total_students}</p>
                    </div>
                  )}
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-slate-700 mb-1">Published Courses</p>
                    <p className="text-2xl font-bold text-green-600">{stats.published_courses}</p>
                  </div>
                </div>
              </div>

              {/* Quiz Statistics */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mt-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Quiz Stats</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Total Quizzes</span>
                    <span className="font-bold text-slate-900">{stats.total_quizzes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Submissions</span>
                    <span className="font-bold text-slate-900">{stats.quiz_submissions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Avg Score</span>
                    <span className="font-bold text-blue-600">{stats.average_quiz_score.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-32 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaBook className="text-white text-3xl opacity-30" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-slate-900 line-clamp-2 mb-2">{course.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Students</span>
                      <span className="font-bold text-slate-900">{course.total_students}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Rating</span>
                      <span className="font-bold text-yellow-600">⭐ {course.average_rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <button className="w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-lg transition-colors">
                    Manage Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Quiz Submissions</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Student</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Quiz</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Score</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recent_quiz_attempts.map(attempt => (
                    <tr key={attempt.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">{attempt.student_name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{attempt.quiz_title}</td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold px-2 py-1 rounded ${
                          attempt.percentage >= 80 ? 'bg-green-100 text-green-700' :
                          attempt.percentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {attempt.percentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(attempt.submitted_at).toLocaleDateString()}
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
export default TeacherDashboardModern;
