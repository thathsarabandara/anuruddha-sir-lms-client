import { useState } from 'react';
import { FaCalendar, FaCheck, FaClock, FaLink, FaTimes, FaUsers, FaVideo, FaBook, FaCheckCircle } from 'react-icons/fa';
import StatCard from '../../components/common/StatCard';

const TeacherLiveClasses = () => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const liveClassesMetricsConfig = [
    {
      label: 'This Week',
      statsKey: 'thisWeek',
      icon: FaBook,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'Total classes',
    },
    {
      label: 'Upcoming',
      statsKey: 'upcoming',
      icon: FaUsers,
      bgColor: 'bg-cyan-100',
      textColor: 'text-cyan-600',
      description: 'Scheduled sessions',
    },
    {
      label: 'Avg Attendance',
      statsKey: 'avgAttendance',
      icon: FaCheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'Average percentage',
    },
    {
      label: 'Total Hours',
      statsKey: 'totalHours',
      icon: FaClock,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'Teaching hours',
    },
  ];

  const liveClassesStats = {
    thisWeek: '12',
    upcoming: '5',
    avgAttendance: '92%',
    totalHours: '48.5h',
  };

  const upcomingClasses = [
    {
      id: 1,
      title: 'Mathematics - Chapter 5',
      course: 'Mathematics Excellence',
      date: 'Today',
      time: '4:00 PM - 5:30 PM',
      students: 45,
      zoomLink: 'https://zoom.us/j/12345',
      status: 'starting-soon',
    },
    {
      id: 2,
      title: 'Sinhala Language - Grammar',
      course: 'Sinhala Language',
      date: 'Tomorrow',
      time: '3:00 PM - 4:30 PM',
      students: 38,
      zoomLink: 'https://zoom.us/j/12346',
      status: 'scheduled',
    },
    {
      id: 3,
      title: 'Complete Revision Session',
      course: 'Complete Scholarship Package',
      date: 'Friday, Dec 20',
      time: '2:00 PM - 4:00 PM',
      students: 156,
      zoomLink: 'https://zoom.us/j/12347',
      status: 'scheduled',
    },
  ];

  const completedClasses = [
    {
      id: 4,
      title: 'Mathematics - Chapter 4',
      course: 'Mathematics Excellence',
      date: 'Dec 15, 2025',
      time: '4:00 PM - 5:30 PM',
      attendees: 42,
      totalStudents: 45,
      recording: true,
      duration: '1:28:45',
    },
    {
      id: 5,
      title: 'Sinhala - Essay Writing',
      course: 'Sinhala Language',
      date: 'Dec 13, 2025',
      time: '3:00 PM - 4:30 PM',
      attendees: 35,
      totalStudents: 38,
      recording: true,
      duration: '1:25:30',
    },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Classes</h1>
          <p className="text-gray-600">Manage your live class sessions</p>
        </div>
        <button onClick={() => setShowScheduleModal(true)} className="btn-primary px-6">
          + Schedule New Class
        </button>
      </div>

      {/* Stats */}
      <StatCard stats={liveClassesStats} metricsConfig={liveClassesMetricsConfig} />

      {/* Upcoming Classes */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Classes</h2>
        <div className="space-y-4">
          {upcomingClasses.map((class_) => (
            <div key={class_.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="bg-blue-600 text-white p-4 rounded-lg">
                    <FaVideo className="text-3xl" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{class_.title}</h3>
                      {class_.status === 'starting-soon' && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded">
                          STARTING SOON
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{class_.course}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <FaCalendar className="mr-2" />
                        {class_.date}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaClock className="mr-2" />
                        {class_.time}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaUsers className="mr-2" />
                        {class_.students} students
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaLink className="mr-2" />
                        Zoom Ready
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    className={`px-6 py-2 rounded-lg font-medium ${
                      class_.status === 'starting-soon'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                  >
                    {class_.status === 'starting-soon' ? 'Start Now' : 'Manage'}
                  </button>
                  <button className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Classes */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Completed Classes</h2>
        <div className="space-y-4">
          {completedClasses.map((class_) => (
            <div key={class_.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="bg-green-100 text-green-600 p-4 rounded-lg">
                    <FaCheck className="text-3xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{class_.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{class_.course}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <FaCalendar className="mr-2"   />
                        {class_.date}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaClock className="mr-2" />
                        {class_.time}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaUsers className="mr-2" />
                        {class_.attendees}/{class_.totalStudents} attended
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaClock className="mr-2" />
                        {class_.duration}
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${(class_.attendees / class_.totalStudents) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {Math.round((class_.attendees / class_.totalStudents) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  {class_.recording && (
                    <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm">
                      View Recording
                    </button>
                  )}
                  <button className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    Attendance
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Schedule New Class</h2>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class Title</label>
                <input type="text" className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                <select className="input-field">
                  <option>Mathematics Excellence</option>
                  <option>Sinhala Language</option>
                  <option>Complete Scholarship Package</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input type="date" className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input type="time" className="input-field" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <input type="number" className="input-field" placeholder="90" required />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 btn-primary">
                  Schedule Class
                </button>
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherLiveClasses;
