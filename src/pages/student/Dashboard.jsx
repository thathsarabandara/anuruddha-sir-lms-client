import { FaBook, FaChartLine, FaFire, FaTrophy, FaClock, FaCheckCircle, FaGraduationCap, FaAward, FaFileAlt, FaTimesCircle, FaCheckCircle as FaCheck, FaRulerCombined, FaLeaf } from 'react-icons/fa';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { RiEnglishInput } from 'react-icons/ri';
import { MdOutlineLanguage } from 'react-icons/md';
import DashStat from '../../components/student/DashStat';
import ProgressStat from '../../components/student/PorgressStat';
import QuizCard from '../../components/student/QuizCard';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const StudentDashboard = () => {
  // Grade 5 Scholarship Subjects
  const subjects = [
    {
      id: 1,
      name: 'Mathematics',
      sinhala: 'ගණිතය',
      progress: 82,
      score: 85,
      color: 'from-blue-500 to-blue-600',
      icon: FaRulerCombined,
      totalLessons: 24,
      completedLessons: 20,
      avgQuizScore: 85,
      nextClass: 'Today, 4:00 PM'
    },
    {
      id: 2,
      name: 'Sinhala',
      sinhala: 'සිංහල',
      progress: 75,
      score: 78,
      color: 'from-purple-500 to-purple-600',
      icon: FaBook,
      totalLessons: 22,
      completedLessons: 17,
      avgQuizScore: 78,
      nextClass: 'Tomorrow, 3:00 PM'
    },
    {
      id: 3,
      name: 'Environmental',
      sinhala: 'පරිසරය',
      progress: 68,
      score: 72,
      color: 'from-green-500 to-green-600',
      icon: FaLeaf,
      totalLessons: 20,
      completedLessons: 14,
      avgQuizScore: 72,
      nextClass: 'Dec 23, 5:00 PM'
    },
    {
      id: 4,
      name: 'English',
      sinhala: 'ඉංග්‍රීසි',
      progress: 70,
      score: 75,
      color: 'from-red-500 to-red-600',
      icon: RiEnglishInput,
      totalLessons: 21,
      completedLessons: 15,
      avgQuizScore: 75,
      nextClass: 'Dec 22, 2:00 PM'
    },
    {
      id: 5,
      name: 'Tamil',
      sinhala: 'දෙමළ',
      progress: 60,
      score: 68,
      color: 'from-orange-500 to-orange-600',
      icon: MdOutlineLanguage,
      totalLessons: 20,
      completedLessons: 12,
      avgQuizScore: 68,
      nextClass: 'Dec 24, 4:00 PM'
    }
  ];

  const overallStats = [
    {
      label: 'Overall Progress',
      value: '73%',
      subtext: 'Average across all subjects',
      icon: FaChartLine,
      color: 'bg-gradient-to-br from-blue-50 to-blue-100'
    },
    {
      label: 'Study Streak',
      value: '18',
      subtext: 'Days in a row',
      icon: FaFire,
      color: 'bg-gradient-to-br from-orange-50 to-orange-100'
    },
    {
      label: 'Quizzes Completed',
      value: '34',
      subtext: 'Total quizzes taken',
      icon: FaCheckCircle,
      color: 'bg-gradient-to-br from-green-50 to-green-100'
    },
    {
      label: 'Avg Score',
      value: '76%',
      subtext: 'Across all assessments',
      icon: FaTrophy,
      color: 'bg-gradient-to-br from-purple-50 to-purple-100'
    }
  ];

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

  // Record Requests
  const recordRequests = [
    {
      id: 1,
      type: 'Certificate',
      subject: 'Overall Performance',
      status: 'pending',
      requestDate: 'Dec 18, 2025',
      expectedDate: 'Dec 20, 2025'
    },
    {
      id: 2,
      type: 'Transcript',
      subject: 'Mathematics',
      status: 'approved',
      requestDate: 'Dec 15, 2025',
      expectedDate: 'Dec 20, 2025'
    },
    {
      id: 3,
      type: 'Progress Report',
      subject: 'All Subjects',
      status: 'approved',
      requestDate: 'Dec 10, 2025',
      expectedDate: 'Dec 15, 2025'
    }
  ];

  // Rewards & Badges
  const rewards = [
    { id: 1, name: 'Quick Learner', icon: '⚡', unlocked: true, description: 'Complete 5 lessons in a day' },
    { id: 2, name: 'Quiz Master', icon: '🏆', unlocked: true, description: 'Score 90%+ on 3 quizzes' },
    { id: 3, name: 'Consistent Performer', icon: '🔥', unlocked: true, description: 'Maintain 18 day streak' },
    { id: 4, name: 'All Subject Expert', icon: '⭐', unlocked: false, description: 'Complete all 5 subjects' },
    { id: 5, name: 'Perfect Attendance', icon: '✅', unlocked: false, description: 'Attend all live classes' },
    { id: 6, name: 'Grade 5 Champion', icon: '👑', unlocked: false, description: 'Top score in mixed paper' }
  ];

  // Chart Data - Subject Distribution
  const subjectScoresData = {
    labels: subjects.map(s => s.name),
    datasets: [
      {
        label: 'Average Score (%)',
        data: subjects.map(s => s.avgQuizScore),
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
    labels: subjects.map(s => s.name),
    datasets: [
      {
        label: 'Lessons Completed (%)',
        data: subjects.map(s => Math.round((s.completedLessons / s.totalLessons) * 100)),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {overallStats.map((stat, index) => (
            <DashStat  key={index} title={stat.label} value={stat.value} icon={stat.icon} colorClass={stat.color} subtext={stat.subtext} />
          ))}
        </div>

        {/* Subject Progress Cards */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Subject Progress</h2>
            <div className="text-sm text-slate-600">5 Subjects | Mixed Paper Format</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject , index) => (
              <ProgressStat key={index} name={subject.name} sinhala={subject.sinhala} progress={subject.progress} color={subject.color} icon={subject.icon} totalLessons={subject.totalLessons} completedLessons={subject.completedLessons} avgQuizScore={subject.avgQuizScore} nextClass={subject.nextClass} />
            ))}
          </div>
        </div>
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10 mb-10">
          {/* Subject Scores Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Subject Scores Distribution</h2>
            <div className="flex items-center justify-center h-80">
              <Pie data={subjectScoresData} options={chartOptions} />
            </div>
          </div>

          {/* Progress Distribution Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Lessons Completed by Subject</h2>
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
                <span className="text-slate-700">Complete all 5 subjects regularly</span>
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

        {/* Record Requests & Rewards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10 mb-10">
          {/* Record Requests */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Record Requests</h2>
              <FaFileAlt className="text-slate-400 text-xl" />
            </div>

            <div className="space-y-3">
              {recordRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-all"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-slate-900">{request.type}</p>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{request.subject}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Requested: {request.requestDate} • Expected: {request.expectedDate}
                    </p>
                  </div>
                  {request.status === 'approved' ? (
                    <FaCheck className="text-green-500 text-lg ml-2" />
                  ) : (
                    <FaClock className="text-yellow-500 text-lg ml-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Rewards & Badges */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Your Achievements</h2>
              <FaAward className="text-slate-400 text-xl" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className={`p-4 rounded-xl border transition-all text-center ${
                    reward.unlocked
                      ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 hover:border-amber-300'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="text-3xl mb-2">{reward.icon}</div>
                  <p className="text-xs font-bold text-slate-900">{reward.name}</p>
                  <p className="text-xs text-slate-600 mt-1">{reward.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
