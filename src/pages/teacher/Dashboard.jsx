import { FaBook, FaClock, FaDollarSign, FaGraduationCap, FaUserGraduate, FaUsers, FaVideo } from 'react-icons/fa';

const TeacherDashboard = () => {
  const stats = [
    { label: 'Total Students', value: '245', icon: FaUserGraduate, color: 'bg-blue-600' },
    { label: 'Active Courses', value: '8', icon: FaBook, color: 'bg-green-600' },
    { label: 'Today\'s Classes', value: '4', icon: FaVideo, color: 'bg-purple-600' },
    { label: 'Monthly Revenue', value: 'Rs. 1.2M', icon: FaDollarSign , color: 'bg-yellow-600' },
  ];

  const todayClasses = [
    {
      id: 1,
      title: 'Mathematics - Chapter 5',
      time: '4:00 PM - 5:30 PM',
      students: 45,
      zoomLink: 'https://zoom.us/j/12345',
      status: 'upcoming',
    },
    {
      id: 2,
      title: 'Sinhala Language - Grammar',
      time: '6:00 PM - 7:30 PM',
      students: 38,
      zoomLink: 'https://zoom.us/j/12346',
      status: 'upcoming',
    },
  ];

  const recentQuizzes = [
    { id: 1, title: 'Mathematics Chapter 4 Quiz', submissions: 42, avgScore: 85, pending: 3 },
    { id: 2, title: 'Sinhala Essay Assessment', submissions: 35, avgScore: 78, pending: 8 },
    { id: 3, title: 'Environment Unit 2 Quiz', submissions: 40, avgScore: 82, pending: 5 },
  ];

  const pendingTasks = [
    { id: 1, task: 'Grade Mathematics Quiz', count: 3, priority: 'high' },
    { id: 2, task: 'Upload Class Recording', count: 2, priority: 'medium' },
    { id: 3, task: 'Review Student Queries', count: 7, priority: 'medium' },
    { id: 4, task: 'Approve Payment Slips', count: 5, priority: 'low' },
  ];

  return (
    <div className="p-8">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Teacher Dashbaord
              </h1>
              <p className="text-slate-600 mt-1">Welcome back, Anuruddha Sir! Here is your overview</p>
            </div>
            <div className="text-5xl"><FaGraduationCap className="text-blue-600" /></div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} text-white p-4 rounded-lg text-3xl`}>
               <stat.icon />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Classes */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Today's Classes</h2>
            <div className="space-y-4">
              {todayClasses.map((class_) => (
                <div key={class_.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{class_.title}</h3>
                      <p className="text-sm text-gray-600">⏰ {class_.time}</p>
                      <p className="text-sm text-gray-600">👥 {class_.students} students enrolled</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                      UPCOMING
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 btn-primary text-sm py-2">Start Class</button>
                    <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Quizzes */}
          <div className="card mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Quiz Results</h2>
            <div className="space-y-3">
              {recentQuizzes.map((quiz) => (
                <div key={quiz.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{quiz.title}</h4>
                    <p className="text-sm text-gray-600">
                      {quiz.submissions} submissions • Avg: {quiz.avgScore}%
                    </p>
                  </div>
                  {quiz.pending > 0 && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded">
                      {quiz.pending} Pending
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Pending Tasks */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Pending Tasks</h3>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-medium text-gray-900 text-sm">{task.task}</span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        task.priority === 'high'
                          ? 'bg-red-100 text-red-600'
                          : task.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{task.count} items</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full btn-primary text-sm py-2">Create New Quiz</button>
              <button className="w-full btn-outline text-sm py-2">Upload Recording</button>
              <button className="w-full btn-outline text-sm py-2">Send Announcement</button>
              <button className="w-full btn-outline text-sm py-2">View All Students</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
