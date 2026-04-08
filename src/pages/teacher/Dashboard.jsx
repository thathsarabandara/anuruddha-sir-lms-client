import { useState } from 'react';
import Notification from '../../components/common/Notification';
import { FaBook, FaClock, FaDollarSign, FaGraduationCap, FaUsers, FaVideo, FaChartLine, FaAward, FaFire, FaLightbulb, FaCheckCircle, FaCertificate } from 'react-icons/fa';
import { IoIosTrendingUp } from 'react-icons/io';
import { PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';

const TeacherDashboard = () => {

  const [statLoading, setStatLoading] = useState(false);
  const [error, setEror] = useState(null);
  const [success, setSuccess] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };
  const [revenueTrendLoading, setRevenueTrendLoading] = useState(false);
  const [revenueByCoursesLoading, setRevenueByCoursesLoading] = useState(false);
  const [coursePerformanceLoading, setCoursePerformanceLoading] = useState(false);
  const [studentAnalyticsLoading, setStudentAnalyticsLoading] = useState(false);
  const [quizManagementLoading, setQuizManagementLoading] = useState(false);
  const [topPerformersLoading, setTopPerformersLoading] = useState(false);
  const [todayClassesLoading, setodayClassesLoading] = useState(false);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [courseHealthLoading, setCourseHealthLoading] = useState(false);
  
  // Core Statistics - Object format for StatCard
  const dashboardStats = {
    total_students: 890,
    active_courses: 12,
    monthly_revenue: 1250,
    avg_rating: 4.6,
  };

  const statsMetricsConfig = [
    {
      label: 'Total Students',
      statsKey: 'total_students',
      icon: FaUsers,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'enrolled students',
    },
    {
      label: 'Active Courses',
      statsKey: 'active_courses',
      icon: FaBook,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'running courses',
    },
    {
      label: 'Monthly Revenue',
      statsKey: 'monthly_revenue',
      icon: FaDollarSign,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      description: 'total revenue',
      formatter: (value) => `$${value.toLocaleString()}`,
    },
    {
      label: 'Avg Rating',
      statsKey: 'avg_rating',
      icon: FaAward,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'average rating',
      formatter: (value) => `${value}/5`,
    },
  ];

  // Revenue Chart Data
  const revenueChartData = [
    { month: 'Sep', revenue: 800 },
    { month: 'Oct', revenue: 920 },
    { month: 'Nov', revenue: 1050 },
    { month: 'Dec', revenue: 1200 },
    { month: 'Jan', revenue: 980 },
    { month: 'Feb', revenue: 1100 },
    { month: 'Mar', revenue: 1250 },
  ];

  // Course Revenue Breakdown
  const courseRevenueBreakdown = [
    { name: 'Python Basics', value: 680, percentage: 54.4 },
    { name: 'Web Development', value: 320, percentage: 25.6 },
    { name: 'Advanced JS', value: 150, percentage: 12 },
    { name: 'Data Science', value: 100, percentage: 8 },
  ];

  // Courses Performance Data
  const coursesPerformance = [
    { id: 1, name: 'Python for Beginners', enrollments: 234, revenue: 680, rating: 4.7, completion: 78, status: 'excellent', trend: 'up' },
    { id: 2, name: 'Web Development', enrollments: 189, revenue: 320, rating: 4.5, completion: 82, status: 'excellent', trend: 'up' },
    { id: 3, name: 'Advanced JavaScript', enrollments: 145, revenue: 150, rating: 3.8, completion: 38, status: 'needs-improvement', trend: 'down' },
    { id: 4, name: 'React Mastery', enrollments: 156, revenue: 95, rating: 4.6, completion: 85, status: 'excellent', trend: 'up' },
  ];

  // Top Students
  const topStudents = [
    { id: 1, name: 'Alice Johnson', score: 95, courses: 3, lastActive: 'Today', avatar: '👩‍🎓' },
    { id: 2, name: 'Bob Smith', score: 90, courses: 2, lastActive: '2 hours ago', avatar: '👨‍🎓' },
    { id: 3, name: 'Carol White', score: 88, courses: 4, lastActive: 'Yesterday', avatar: '👩‍🎓' },
    { id: 4, name: 'David Brown', score: 86, courses: 2, lastActive: '3 days ago', avatar: '👨‍🎓' },
  ];

  // Quiz Statistics
  const quizStats = [
    { id: 1, title: 'Python Unit 1 Test', attempts: 120, avgScore: 85.5, passRate: 92 },
    { id: 2, title: 'Web Dev Assessment', attempts: 98, avgScore: 82.3, passRate: 88 },
    { id: 3, title: 'JS Fundamentals', attempts: 112, avgScore: 80.1, passRate: 85 },
  ];

  // Content Activity
  const recentContent = [
    { id: 1, title: 'Python Functions - Advanced', type: 'video', course: 'Advanced Python', views: 67, duration: 45 },
    { id: 2, title: 'Web Design Principles', type: 'document', course: 'Web Development', views: 54, duration: 20 },
    { id: 3, title: 'React Hooks Deep Dive', type: 'video', course: 'React Mastery', views: 89, duration: 60 },
  ];

  // Student Performance Distribution
  const studentDistribution = [
    { category: 'Excellent', students: 245, percentage: 28 },
    { category: 'Good', students: 320, percentage: 36 },
    { category: 'Fair', students: 215, percentage: 24 },
    { category: 'At Risk', students: 110, percentage: 12 },
  ];

  // Course Health Issues
  const courseHealthIssues = [
    { course: 'Advanced JavaScript', issue: 'Low completion rate', severity: 'high', impact: '38% completion' },
    { course: 'Data Structures', issue: 'Declining enrollments', severity: 'medium', impact: '-32% vs last month' },
  ];

  // Recommendations
  const recommendations = [
    { priority: 'high', type: 'content', title: 'Review Lesson 5 Content', description: '30% of students drop out at Module 2' },
    { priority: 'medium', type: 'engagement', title: 'Increase Discussion Activity', description: 'Post 2-3 discussions per week' },
  ];

  // Pending Tasks
  const todayClasses = [
    {
      id: 1,
      title: 'Mathematics - Chapter 5',
      time: '4:00 PM - 5:30 PM',
      students: 45,
      status: 'upcoming',
    },
    {
      id: 2,
      title: 'Sinhala Language - Grammar',
      time: '6:00 PM - 7:30 PM',
      students: 38,
      status: 'upcoming',
    },
  ];

  const pendingQuizReviews = [
    { id: 1, studentName: 'John Doe', quizName: 'Python Unit 1', course: 'Python Fundamentals', submitted: '10:30 AM' },
    { id: 2, studentName: 'Jane Smith', quizName: 'Web Dev Quiz', course: 'Web Development', submitted: '2:15 PM' },
  ];

  // Courses Performance Table Configuration
  const coursesPerformanceColumns = [
    {
      key: 'name',
      label: 'Course Name',
      searchable: true,
    },
    {
      key: 'enrollments',
      label: 'Enrollments',
      searchable: false,
    },
    {
      key: 'revenue',
      label: 'Revenue',
      render: (value) => `$${value}`,
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (value) => (
        <span className="inline-flex items-center">
          <span className="text-yellow-400">★</span>
          <span className="ml-1 font-semibold text-slate-700">{value}</span>
        </span>
      ),
    },
    {
      key: 'completion',
      label: 'Completion',
      render: (value) => (
        <div className="flex items-center justify-center gap-2">
          <div className="w-16 bg-slate-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${value}%` }}></div>
          </div>
          <span className="text-sm font-semibold text-slate-700 min-w-max">{value}%</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Excellent', value: 'excellent' },
        { label: 'Needs Improvement', value: 'needs-improvement' },
      ],
      render: (value) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            value === 'excellent'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {value === 'excellent' ? '✓ Excellent' : '⚠ Needs Work'}
        </span>
      ),
    },
  ];

  const coursesTableConfig = {
    itemsPerPage: 5,
    searchPlaceholder: 'Search courses...',
    emptyMessage: 'No courses found',
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {notification && (
        <div className="mb-4">
          <Notification
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Teacher Dashboard
              </h1>
              <p className="text-slate-600 mt-1 text-sm md:text-base">Welcome back! Here's your teaching overview</p>
            </div>
            <div className="text-4xl md:text-5xl hidden sm:block"><FaGraduationCap className="text-blue-600" /></div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-6">
        
        {/* Core Stats */}
        <StatCard stats={dashboardStats} metricsConfig={statsMetricsConfig} loading={statLoading}/>

        {/* Revenue & Course Performance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Revenue Trend</h2>
                <p className="text-sm text-slate-600 mt-1">Last 7 months revenue</p>
              </div>
              <FaChartLine className="text-blue-600 text-2xl" />
            </div>
            <div className="w-full h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Course Revenue Breakdown */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue by Course</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={courseRevenueBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {courseRevenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {courseRevenueBreakdown.map((course, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][idx % 4] }}></div>
                    <span className="text-slate-700 font-medium">{course.name}</span>
                  </div>
                  <span className="text-slate-600 font-semibold">${course.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Courses Performance Grid */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Courses Performance</h2>
              <p className="text-sm text-slate-600 mt-1">Detailed metrics for each course</p>
            </div>
            <FaBook className="text-green-600 text-2xl" />
          </div>
          <DataTable
            data={coursesPerformance}
            columns={coursesPerformanceColumns}
            config={coursesTableConfig}
            loading={coursePerformanceLoading}
          />
        </div>

        {/* Student Management & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Metrics */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Student Analytics</h2>
                <p className="text-sm text-slate-600 mt-1">Overall engagement & performance</p>
              </div>
              <FaUsers className="text-blue-600 text-2xl" />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-600 font-medium">Total Students</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">890</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-600 font-medium">Active This Month</p>
                <p className="text-2xl font-bold text-green-600 mt-1">245</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-600 font-medium">Avg Progress</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">68.5%</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-600 font-medium">At Risk</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">45</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-3">Performance Distribution</h4>
              <div className="space-y-2">
                {studentDistribution.map((dist, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-700 font-medium">{dist.category}</span>
                      <span className="text-slate-600">{dist.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className={`h-2 rounded-full`} style={{ 
                        width: `${dist.percentage}%`,
                        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'][idx]
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Students */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Top Performers</h2>
                <p className="text-sm text-slate-600 mt-1">Most active & engaged students</p>
              </div>
              <IoIosTrendingUp className="text-green-600 text-2xl" />
            </div>
            <div className="space-y-3">
              {topStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                  <div className="flex items-center flex-1">
                    <span className="text-2xl mr-3">{student.avatar}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{student.name}</p>
                      <p className="text-xs text-slate-600">Last active: {student.lastActive}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-blue-600">{student.score}%</p>
                    <p className="text-xs text-slate-600">{student.courses} courses</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quiz & Content Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quiz Statistics */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Quiz Management</h2>
                <p className="text-sm text-slate-600 mt-1">Assessment performance</p>
              </div>
              <FaAward className="text-purple-600 text-2xl" />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-600 font-medium">Total Quizzes</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">24</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-600 font-medium">Total Attempts</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">456</p>
              </div>
            </div>
            <div className="space-y-3">
              {quizStats.map((quiz) => (
                <div key={quiz.id} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{quiz.title}</h4>
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">{quiz.passRate}% pass</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>{quiz.attempts} attempts</span>
                    <span className="font-semibold">Avg: {quiz.avgScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recent Content</h2>
                <p className="text-sm text-slate-600 mt-1">Most viewed lessons & materials</p>
              </div>
              <FaVideo className="text-orange-600 text-2xl" />
            </div>
            <div className="space-y-3">
              {recentContent.map((content) => (
                <div key={content.id} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                          {content.type === 'video' ? '🎬 Video' : '📄 Document'}
                        </span>
                      </div>
                      <p className="font-medium text-gray-900 text-sm">{content.title}</p>
                      <p className="text-xs text-slate-600 mt-1">{content.course}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-slate-900">{content.views}</p>
                      <p className="text-xs text-slate-600">views</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Classes & Pending Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Classes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Today's Classes</h2>
                <p className="text-sm text-slate-600 mt-1">Upcoming sessions</p>
              </div>
              <FaClock className="text-blue-600 text-2xl" />
            </div>
            <div className="space-y-4">
              {todayClasses.map((class_) => (
                <div key={class_.id} className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{class_.title}</h3>
                      <p className="text-sm text-slate-700 mt-1">⏰ {class_.time}</p>
                      <p className="text-sm text-slate-700">👥 {class_.students} students</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      UPCOMING
                    </span>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition">
                    Start Class
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Quiz Reviews */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Pending Reviews</h2>
                <p className="text-sm text-slate-600 mt-1">Submissions to grade</p>
              </div>
              <FaCheckCircle className="text-yellow-600 text-2xl" />
            </div>
            <div className="space-y-3">
              {pendingQuizReviews.map((review) => (
                <div key={review.id} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{review.studentName}</p>
                      <p className="text-sm text-slate-700 mt-1">{review.quizName}</p>
                      <p className="text-xs text-slate-600">{review.course}</p>
                    </div>
                    <span className="text-xs text-yellow-700 font-semibold">{review.submitted}</span>
                  </div>
                  <button className="w-full mt-3 border border-yellow-600 text-yellow-600 hover:bg-yellow-100 font-medium py-2 rounded-lg text-sm transition">
                    Review & Grade
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Course Health & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Health Issues */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Course Health</h2>
                <p className="text-sm text-slate-600 mt-1">Issues needing attention</p>
              </div>
              <FaFire className="text-red-600 text-2xl" />
            </div>
            <div className="space-y-3">
              {courseHealthIssues.map((health, idx) => (
                <div key={idx} className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{health.course}</p>
                      <p className="text-sm text-slate-700 mt-1">{health.issue}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      health.severity === 'high' ? 'bg-red-200 text-red-700' : 'bg-yellow-200 text-yellow-700'
                    }`}>
                      {health.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-red-700 font-medium mt-2">{health.impact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recommendations</h2>
                <p className="text-sm text-slate-600 mt-1">AI-powered improvement suggestions</p>
              </div>
              <FaLightbulb className="text-amber-600 text-2xl" />
            </div>
            <div className="space-y-3">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-3">
                    <span className={`text-lg mt-0.5 ${
                      rec.priority === 'high' ? '🔴' : '🟡'
                    }`}></span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{rec.title}</p>
                      <p className="text-xs text-slate-700 mt-1">{rec.description}</p>
                      <button className="text-xs text-blue-600 font-semibold hover:underline mt-2">
                        Take Action →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Growth Opportunities */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-sm p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Growth Opportunities</h2>
              <p className="text-sm text-slate-600 mt-1">Expand your courses & reach</p>
            </div>
            <FaCertificate className="text-green-600 text-2xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Create New Course</h3>
              <p className="text-sm text-slate-600 mb-3">120+ students eligible for certification</p>
              <button className="text-sm text-green-600 font-semibold hover:underline">Create Course →</button>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Cross-sell Opportunity</h3>
              <p className="text-sm text-slate-600 mb-3">90% of Python students take data courses</p>
              <button className="text-sm text-green-600 font-semibold hover:underline">View Details →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
