import { FaBook, FaChartLine, FaFire, FaTrophy, FaClock, FaCheckCircle, FaGraduationCap, FaAward, FaFileAlt, FaCheckCircle as FaCheck, FaStar, FaShare, FaDownload, FaArrowRight, FaBolt } from 'react-icons/fa';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler } from 'chart.js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/common/StatCard';
import ProgressStat from '../../components/student/PorgressStat';
import QuizCard from '../../components/student/QuizCard';
import Notification from '../../components/common/Notification';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

const StudentDashboard = () => {
  const navigate = useNavigate();

  // Recent Courses Progress
  const recentCourses = [
    {
      id: 'recent-course-1',
      name: 'Advanced Python Programming',
      sinhala: 'Completed recently',
      progress: 96,
      score: 92,
      color: 'from-blue-500 to-blue-600',
      icon: FaAward,
      totalLessons: 24,
      completedLessons: 23,
      avgQuizScore: 92,
      nextClass: 'Review Session: Today, 4:00 PM'
    },
    {
      id: 'recent-course-2',
      name: 'JavaScript Fundamentals',
      sinhala: 'In progress',
      progress: 84,
      score: 88,
      color: 'from-purple-500 to-purple-600',
      icon: FaBook,
      totalLessons: 22,
      completedLessons: 18,
      avgQuizScore: 88,
      nextClass: 'Live Class: Tomorrow, 3:00 PM'
    },
    {
      id: 'recent-course-3',
      name: 'Web Development Basics',
      sinhala: 'Last viewed yesterday',
      progress: 78,
      score: 85,
      color: 'from-green-500 to-green-600',
      icon: FaFileAlt,
      totalLessons: 20,
      completedLessons: 16,
      avgQuizScore: 85,
      nextClass: 'Mentor Hour: Dec 23, 5:00 PM'
    },
    {
      id: 'recent-course-4',
      name: 'Data Structures',
      sinhala: 'Started this week',
      progress: 72,
      score: 79,
      color: 'from-red-500 to-red-600',
      icon: FaChartLine,
      totalLessons: 21,
      completedLessons: 15,
      avgQuizScore: 79,
      nextClass: 'Practice Lab: Dec 22, 2:00 PM'
    },
    {
      id: 'recent-course-5',
      name: 'Cloud Computing Essentials',
      sinhala: 'Added recently',
      progress: 63,
      score: 74,
      color: 'from-orange-500 to-orange-600',
      icon: FaCheck,
      totalLessons: 20,
      completedLessons: 12,
      avgQuizScore: 74,
      nextClass: 'Q&A Session: Dec 24, 4:00 PM'
    }
  ];

  const topEnrolledCourses = recentCourses.slice(0, 3);

  const studentMetricsConfig = [
    {
      label: 'Courses Enrolled',
      statsKey: 'coursesEnrolled',
      icon: FaChartLine,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'Total courses enrolled',
    },
    {
      label: 'Quizzes Completed',
      statsKey: 'quizzesCompleted',
      icon: FaFire,
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      description: 'Total quizzes completed',
    },
    {
      label: 'Certificates Earned',
      statsKey: 'certificatesEarned',
      icon: FaCheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'Total certificates earned',
    },
    {
      label: 'Avg Quiz Score',
      statsKey: 'avgQuizScore',
      icon: FaTrophy,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'Across all assessments',
    },
  ];

  const studentStats = {
    coursesEnrolled: 10,
    quizzesCompleted: 15,
    certificatesEarned: 5,
    avgQuizScore: 85,
  };

  const upcomingClasses = [
    { subject: 'Mathematics', time: 'Today, 4:00 PM', status: 'upcoming' },
    { subject: 'English', time: 'Dec 22, 2:00 PM', status: 'upcoming' },
    { subject: 'Sinhala', time: 'Tomorrow, 3:00 PM', status: 'upcoming' }
  ];

  // Upcoming Quizzes
  const upcomingQuizzes = [
    {
      id: 1,
      subject: 'Mathematics',
      title: 'Chapter 5: Algebra & Equations',
      date: 'Dec 22, 2025',
      time: '2:00 PM',
      difficulty: 'Medium',
      questions: 40,
      duration: 90,
      icon: '📐'
    },
    {
      id: 2,
      subject: 'Sinhala',
      title: 'Literature & Comprehension',
      date: 'Dec 23, 2025',
      time: '3:30 PM',
      difficulty: 'Medium',
      questions: 35,
      duration: 75,
      icon: '📖'
    },
    {
      id: 3,
      subject: 'English',
      title: 'Grammar & Composition',
      date: 'Dec 24, 2025',
      time: '1:00 PM',
      difficulty: 'Medium',
      questions: 40,
      duration: 90,
      icon: '🗣️'
    },
    {
      id: 4,
      subject: 'Parisaraya',
      title: 'Environmental Studies',
      date: 'Dec 25, 2025',
      time: '4:00 PM',
      difficulty: 'Hard',
      questions: 38,
      duration: 80,
      icon: '🌿'
    }
  ];

  // Quiz Attempts (Recent)
  const quizAttempts = [
    {
      attemptId: 'qa1',
      quizTitle: 'Python Basics - Unit 1',
      score: 85,
      totalQuestions: 10,
      percentage: 85,
      status: 'passed',
      attemptNumber: 1,
      timeTaken: 25,
      submittedAt: 'Mar 8, 2:45 PM',
      passingScore: 70
    },
    {
      attemptId: 'qa2',
      quizTitle: 'Math Quiz - Algebra',
      score: 92,
      totalQuestions: 10,
      percentage: 92,
      status: 'passed',
      attemptNumber: 1,
      timeTaken: 30,
      submittedAt: 'Mar 7, 4:15 PM',
      passingScore: 70
    },
    {
      attemptId: 'qa3',
      quizTitle: 'JS Coding Challenge',
      score: 78,
      totalQuestions: 10,
      percentage: 78,
      status: 'passed',
      attemptNumber: 2,
      timeTaken: 35,
      submittedAt: 'Mar 6, 1:30 PM',
      passingScore: 70
    },
    {
      attemptId: 'qa4',
      quizTitle: 'Data Structures',
      score: 88,
      totalQuestions: 10,
      percentage: 88,
      status: 'passed',
      attemptNumber: 1,
      timeTaken: 28,
      submittedAt: 'Mar 5, 3:45 PM',
      passingScore: 70
    },
    {
      attemptId: 'qa5',
      quizTitle: 'Web Development',
      score: 82,
      totalQuestions: 10,
      percentage: 82,
      status: 'passed',
      attemptNumber: 1,
      timeTaken: 32,
      submittedAt: 'Mar 4, 2:20 PM',
      passingScore: 70
    }
  ];

  // Quiz Statistics
  const quizStatistics = {
    totalAttempted: 15,
    totalPassed: 13,
    averageScore: 82.3,
    passRate: 86.7,
    bestScore: 95,
    worstScore: 68
  };

  // Certificates
  const certificates = [
    {
      certificateId: 'cert1',
      courseTitle: 'Advanced Python Programming',
      studentName: 'John Doe',
      certificateCode: 'CERT-2024-ABC123',
      earnedScore: 92,
      issuedDate: 'Feb 28, 2024',
      expiresDate: null,
      certificateUrl: '🎓',
      isShared: false,
      sharedPlatforms: []
    },
    {
      certificateId: 'cert2',
      courseTitle: 'JavaScript Fundamentals',
      studentName: 'John Doe',
      certificateCode: 'CERT-2024-XYZ789',
      earnedScore: 88,
      issuedDate: 'Jan 15, 2024',
      expiresDate: null,
      certificateUrl: '📜',
      isShared: true,
      sharedPlatforms: ['linkedin']
    },
    {
      certificateId: 'cert3',
      courseTitle: 'Web Development Basics',
      studentName: 'John Doe',
      certificateCode: 'CERT-2023-DEF456',
      earnedScore: 85,
      issuedDate: 'Dec 1, 2023',
      expiresDate: null,
      certificateUrl: '🏆',
      isShared: false,
      sharedPlatforms: []
    }
  ];

  // Recommended Courses
  const recommendedCourses = [
    {
      courseId: 'rc1',
      title: 'Web Development Bootcamp',
      difficulty: 'intermediate',
      instructorName: 'Jane Smith',
      rating: 4.7,
      totalReviews: 156,
      totalEnrollments: 2340,
      price: 29.99,
      recommendationReason: 'similar_to_completed',
      isEnrolled: false
    },
    {
      courseId: 'rc2',
      title: 'React Advanced Patterns',
      difficulty: 'advanced',
      instructorName: 'Mike Johnson',
      totalReviews: 248,
      totalEnrollments: 3120,
      price: 39.99,
      durationHours: 50,
      recommendationReason: 'high_rated',
      isEnrolled: false
    },
    {
      title: 'Database Design & SQL',
      difficulty: 'intermediate',
      instructorName: 'Sarah Lee',
      rating: 4.6,
      totalReviews: 189,
      totalEnrollments: 1890,
      price: 34.99,
      durationHours: 45,
      isEnrolled: false
    },
    {
      courseId: 'rc4',
      title: 'Cloud Computing Essentials',
      difficulty: 'intermediate',
      instructorName: 'Alex Brown',
      rating: 4.5,
      totalReviews: 134,
      totalEnrollments: 1620,
      price: 24.99,
      durationHours: 35,
      recommendationReason: 'trending',
      isEnrolled: false
    }
  ];


  // Chart Data - Subject Distribution
  const subjectScoresData = {
    labels: recentCourses.map(course => course.name),
    datasets: [
      {
        label: 'Average Score (%)',
        data: recentCourses.map(course => course.avgQuizScore),
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(168, 85, 247, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(249, 115, 22, 0.7)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(249, 115, 22)'
        ],
        borderWidth: 2
      }
    ]
  };

  // Chart Data - Progress Distribution
  const progressDistributionData = {
    labels: recentCourses.map(course => course.name),
    datasets: [
      {
        label: 'Lessons Completed (%)',
        data: recentCourses.map(course => Math.round((course.completedLessons / course.totalLessons) * 100)),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      }
    ]
  };

  // Chart Data - Quiz Performance Over Time
  const quizPerformanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'This Week'],
    datasets: [
      {
        label: 'Average Score (%)',
        data: [78, 81, 79, 85, 84, 82.3],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 7
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 12 },
          padding: 15,
          usePointStyle: true
        }
      }
    }
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 12 },
          padding: 15,
          usePointStyle: true
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  const [notification, setNotification] = useState(null);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Notification
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Learning Dashboard
              </h1>
              <p className="text-slate-600 mt-1">Grade 5 Scholarship Exam Preparation</p>
            </div>
            <div className="text-5xl"><FaGraduationCap className="text-blue-600" /></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Stats Grid */}
        <StatCard stats={studentStats} metricsConfig={studentMetricsConfig} />

        {/* Top Enrolled Courses */}
        <div className="mb-10 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Top 3 Enrolled Courses</h2>
            <div className="text-sm text-slate-600">Continue where you left off</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topEnrolledCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{course.name}</h3>
                    <p className="text-sm text-slate-500">{course.sinhala}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{course.progress}%</span>
                </div>

                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
                  <div className={`h-full bg-gradient-to-r ${course.color}`} style={{ width: `${course.progress}%` }}></div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 mb-5">
                  <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                  <span>Avg: {course.avgQuizScore}%</span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/student/courses')}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  Continue
                  <FaArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Progress Cards */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Recent Courses</h2>
            <div className="text-sm text-slate-600">5 Recent Courses | Activity Snapshot</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCourses.map((course) => (
              <ProgressStat key={course.id} name={course.name} sinhala={course.sinhala} progress={course.progress} color={course.color} icon={course.icon} totalLessons={course.totalLessons} completedLessons={course.completedLessons} avgQuizScore={course.avgQuizScore} nextClass={course.nextClass} />
            ))}
          </div>
        </div>
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10 mb-10">
          {/* Subject Scores Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Course Scores</h2>
            <div className="flex items-center justify-center h-80">
              <Pie data={subjectScoresData} options={chartOptions} />
            </div>
          </div>

          {/* Progress Distribution Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Lessons Completed by Course</h2>
            <div className="flex items-center justify-centerh-80">
              <Bar data={progressDistributionData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Upcoming Classes & Quick Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Classes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Upcoming Classes</h2>
                <FaClock className="text-slate-400" />
              </div>

              <div className="space-y-3">
                {upcomingClasses.map((cls, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl border border-blue-100 hover:border-blue-200 transition-all"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{cls.subject}</p>
                      <p className="text-sm text-slate-600">{cls.time}</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                      Join Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Study Tips</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-lg">✓</span>
                <span className="text-slate-700">Focus on mixed paper format practice</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">✓</span>
                <span className="text-slate-700">Review your 5 most recent courses regularly</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">✓</span>
                <span className="text-slate-700">Maintain consistent attendance</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">✓</span>
                <span className="text-slate-700">Review weakest subject areas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Quizzes Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Upcoming Quizzes</h2>
            <FaCheckCircle className="text-slate-400 text-xl" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} subject={quiz.subject} title={quiz.title} difficulty={quiz.difficulty} date={quiz.date} time={quiz.time} questions={quiz.questions} duration={quiz.duration} />
            ))}
          </div>
        </div>

        {/* Quiz Performance Analytics Section */}
        <div className="mt-10 mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quiz Performance Analytics</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quiz Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-slate-600 font-medium">Total Attempted</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{quizStatistics.totalAttempted}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <p className="text-sm text-slate-600 font-medium">Passed</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{quizStatistics.totalPassed}/{quizStatistics.totalAttempted}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <p className="text-sm text-slate-600 font-medium">Pass Rate</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{quizStatistics.passRate}%</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                <p className="text-sm text-slate-600 font-medium">Avg Score</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{quizStatistics.averageScore}%</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                <p className="text-sm text-slate-600 font-medium">Best Score</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{quizStatistics.bestScore}%</p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                <p className="text-sm text-slate-600 font-medium">Worst Score</p>
                <p className="text-3xl font-bold text-slate-600 mt-2">{quizStatistics.worstScore}%</p>
              </div>
            </div>

            {/* Quiz Performance Trend */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Performance Trend</h3>
              <div className="h-80">
                <Line data={quizPerformanceData} options={lineChartOptions} />
              </div>
            </div>
          </div>

          {/* Recent Quiz Attempts */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Attempts</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Quiz Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Score</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Time Taken</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {quizAttempts.slice(0, 5).map((attempt) => (
                    <tr key={attempt.attemptId} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-slate-900 font-medium">{attempt.quizTitle}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                          {attempt.score}/{attempt.totalQuestions * 10}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full font-semibold ${
                          attempt.status === 'passed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {attempt.status === 'passed' ? '✓ Passed' : '✗ Failed'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{attempt.timeTaken} min</td>
                      <td className="py-3 px-4 text-slate-600">{attempt.submittedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Certificates Section */}
        <div className="mt-10 mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Certificates & Credentials</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div key={cert.certificateId} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{cert.certificateUrl}</div>
                  <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                    Earned
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2">{cert.courseTitle}</h3>
                <p className="text-xs text-slate-600 mb-3">Code: {cert.certificateCode}</p>
                
                <div className="bg-slate-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-slate-600 mb-1">Score Achieved</p>
                  <p className="text-2xl font-bold text-slate-900">{cert.earnedScore}%</p>
                </div>

                <p className="text-xs text-slate-600 mb-4">Issued: {cert.issuedDate}</p>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-sm font-medium">
                    <FaDownload size={14} />
                    Download
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors text-sm font-medium">
                    <FaShare size={14} />
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Courses Section */}
        <div className="mt-10 mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Recommended for You</h2>
            <p className="text-sm text-slate-600">Based on your learning history</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedCourses.map((course) => (
              <div key={course.courseId} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <FaBolt className="text-amber-500" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-slate-600 mb-3">by {course.instructorName}</p>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={14} className={i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-slate-300'} />
                  ))}
                  <span className="text-xs text-slate-600 ml-1">({course.totalReviews})</span>
                </div>

                <div className="space-y-2 mb-4 text-xs text-slate-600">
                  <p>⏱️ {course.durationHours} hours</p>
                  <p>👥 {course.totalEnrollments.toLocaleString()} students</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <span className="text-xl font-bold text-slate-900">${course.price}</span>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 group-hover:gap-3 group-hover:pr-3">
                    Enroll
                    <FaArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
