import { useState, useEffect } from 'react';
import { CiCircleAlert } from 'react-icons/ci';
import { 
  FaBook, FaChartLine, FaFire, FaTrophy, FaClock, FaCheckCircle, 
  FaGraduationCap, FaAward, FaSpinner, FaCalendarAlt,
  FaUsers,
  FaChartBar
} from 'react-icons/fa';
import { TbTarget } from 'react-icons/tb';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StudentDashboardModern = () => {
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
      const response = await fetch('/api/v1/dashboards/api/student/', {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-10 w-56 bg-gray-200 rounded-lg animate-pulse mb-3"></div>
            <div className="h-4 w-80 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border p-6">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Content Sections Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border p-6">
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-lg border p-6">
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
                <p className="text-red-700">Please try refreshing the page or contact support.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { stats, courses, upcoming_classes, recent_quizzes } = dashboardData;

  // Mock chart data
  const progressChartData = [
    { week: 'W1', progress: 65, target: 70 },
    { week: 'W2', progress: 72, target: 75 },
    { week: 'W3', progress: 78, target: 80 },
    { week: 'W4', progress: 82, target: 85 },
  ];

  const statCards = [
    {
      label: 'Active Courses',
      value: stats.total_enrollments,
      icon: FaBook,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      lightColor: 'text-blue-600'
    },
    {
      label: 'Completed',
      value: stats.completed_courses,
      icon: FaCheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      lightColor: 'text-green-600'
    },
    {
      label: 'Study Streak',
      value: `${stats.study_streak} days`,
      icon: FaFire,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      lightColor: 'text-orange-600'
    },
    {
      label: 'Certificates',
      value: stats.certificates_earned,
      icon: FaTrophy,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      lightColor: 'text-purple-600'
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
                Welcome back, {dashboardData.student_name}!
              </h1>
              <p className="text-slate-600 mt-2">Track your learning progress and achieve your goals</p>
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
              <div className={`${card.bgColor} rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-lg cursor-pointer h-full`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`${card.color} bg-gradient-to-br p-3 rounded-lg`}>
                    <card.icon className="text-white text-xl" />
                  </div>
                  <span className={`text-xs font-semibold ${card.lightColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    ↗
                  </span>
                </div>
                <p className="text-slate-600 text-sm font-medium">{card.label}</p>
                <p className={`text-3xl font-bold ${card.lightColor} mt-2`}>
                  {typeof card.value === 'number' ? card.value : card.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          {['overview', 'courses', 'schedule'].map(tab => (
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
            {/* Progress Chart */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Learning Progress</h2>
                  <FaChartBar className="text-slate-400" />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="progress" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                    <Line type="monotone" dataKey="target" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Performance</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <span className="text-slate-700 font-medium">Avg. Quiz Score</span>
                  <span className="text-2xl font-bold text-blue-600">{Math.round(stats.average_quiz_score)}%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <span className="text-slate-700 font-medium">Quizzes Taken</span>
                  <span className="text-2xl font-bold text-green-600">{stats.total_quizzes_attempted}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <span className="text-slate-700 font-medium">Certificates</span>
                  <span className="text-2xl font-bold text-purple-600">{stats.certificates_earned}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Course Thumbnail */}
                <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaBook className="text-white text-4xl opacity-30" />
                    </div>
                  )}
                </div>

                {/* Course Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-600 mb-4">{course.subject}</p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-slate-600">Progress</span>
                      <span className="text-sm font-bold text-blue-600">{course.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {course.completed_lessons} of {course.total_lessons} lessons
                    </p>
                  </div>

                  {/* Teacher Info */}
                  <p className="text-xs text-slate-500 mb-4">by {course.teacher_name}</p>

                  {/* Quiz Score */}
                  {course.latest_quiz_score && (
                    <div className="p-3 bg-green-50 rounded-lg mb-4 border border-green-100">
                      <p className="text-xs text-slate-600">Latest Quiz Score</p>
                      <p className="text-lg font-bold text-green-600">{course.latest_quiz_score.toFixed(0)}%</p>
                    </div>
                  )}

                  <button className="w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-lg transition-colors">
                    Continue Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming Classes */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-600" />
                Upcoming Classes
              </h2>
              <div className="space-y-4">
                {upcoming_classes.length > 0 ? (
                  upcoming_classes.map(cls => (
                    <div key={cls.id} className="p-4 border border-slate-200 rounded-lg hover:bg-blue-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-slate-900">{cls.title}</h3>
                        <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {cls.duration}m
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{cls.course}</p>
                      <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <FaClock className="text-orange-600" />
                        {new Date(cls.scheduled_at).toLocaleString()}
                      </p>
                      <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Join Class →
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-600 text-center py-8">No upcoming classes scheduled</p>
                )}
              </div>
            </div>

            {/* Recent Quiz Attempts */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <TbTarget className="text-purple-600" />
                Recent Quiz Results
              </h2>
              <div className="space-y-4">
                {recent_quizzes.length > 0 ? (
                  recent_quizzes.map(quiz => (
                    <div key={quiz.id} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-slate-900">{quiz.title}</h3>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                          quiz.percentage >= 80 ? 'bg-green-100 text-green-700' :
                          quiz.percentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {quiz.percentage}%
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 mb-2">
                        Score: {quiz.score.toFixed(1)} / {quiz.total_marks.toFixed(1)}
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all ${
                            quiz.percentage >= 80 ? 'bg-green-500' :
                            quiz.percentage >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${quiz.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-600 text-center py-8">No quiz attempts yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboardModern;
