import { useState } from 'react';
import Notification from '../../components/common/Notification';
import { FaCalendar, FaCheck, FaClock, FaLink, FaTimes, FaUsers, FaVideo, FaBook, FaCheckCircle } from 'react-icons/fa';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';

const TeacherLiveClasses = () => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

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

  // Upcoming Classes DataTable columns
  const upcomingColumns = [
    {
      key: 'title',
      label: 'Title',
      searchable: true,
      width: 'w-1/4',
    },
    {
      key: 'course',
      label: 'Course',
      searchable: true,
      filterable: true,
      filterOptions: [
        { label: 'Mathematics Excellence', value: 'Mathematics Excellence' },
        { label: 'Sinhala Language', value: 'Sinhala Language' },
        { label: 'Complete Scholarship Package', value: 'Complete Scholarship Package' },
      ],
      width: 'w-1/5',
    },
    {
      key: 'date',
      label: 'Date',
      searchable: true,
      width: 'w-20',
    },
    {
      key: 'time',
      label: 'Time',
      searchable: true,
      width: 'w-28',
    },
    {
      key: 'students',
      label: 'Students',
      render: (value) => <span>{value} students</span>,
      width: 'w-24',
    },
    {
      key: 'status',
      label: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Starting Soon', value: 'starting-soon' },
        { label: 'Scheduled', value: 'scheduled' },
      ],
      render: (value) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            value === 'starting-soon'
              ? 'bg-red-100 text-red-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {value === 'starting-soon' ? 'STARTING SOON' : 'SCHEDULED'}
        </span>
      ),
      width: 'w-32',
    },
    {
      key: 'actions',
      label: 'Actions',
      searchable: false,
      render: (value, row) => (
        <div className="flex gap-2 flex-wrap">
          <button
            className={`px-3 py-1 text-xs rounded font-medium text-white ${
              row.status === 'starting-soon'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            {row.status === 'starting-soon' ? 'Start Now' : 'Manage'}
          </button>
          <button className="px-3 py-1 border border-gray-300 hover:bg-gray-50 text-xs rounded font-medium">
            Edit
          </button>
        </div>
      ),
      width: 'w-40',
    },
  ];

  const upcomingConfig = {
    itemsPerPage: 10,
    searchPlaceholder: 'Search classes...',
    emptyMessage: 'No upcoming classes',
  };

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
      attendance_percentage: 93,
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
      attendance_percentage: 92,
    },
  ];

  // Completed Classes DataTable columns
  const completedColumns = [
    {
      key: 'title',
      label: 'Title',
      searchable: true,
      width: 'w-1/4',
    },
    {
      key: 'course',
      label: 'Course',
      searchable: true,
      filterable: true,
      filterOptions: [
        { label: 'Mathematics Excellence', value: 'Mathematics Excellence' },
        { label: 'Sinhala Language', value: 'Sinhala Language' },
        { label: 'Complete Scholarship Package', value: 'Complete Scholarship Package' },
      ],
      width: 'w-1/5',
    },
    {
      key: 'date',
      label: 'Date',
      searchable: true,
      width: 'w-24',
    },
    {
      key: 'duration',
      label: 'Duration',
      width: 'w-24',
    },
    {
      key: 'attendees',
      label: 'Attendance',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{value}/{row.totalStudents}</span>
          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="bg-green-600 h-full"
              style={{ width: `${(value / row.totalStudents) * 100}%` }}
            />
          </div>
        </div>
      ),
      width: 'w-40',
    },
    {
      key: 'actions',
      label: 'Actions',
      searchable: false,
      render: (value, row) => (
        <div className="flex gap-2 flex-wrap">
          {row.recording && (
            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded font-medium">
              Recording
            </button>
          )}
          <button className="px-3 py-1 border border-gray-300 hover:bg-gray-50 text-xs rounded font-medium">
            Attendance
          </button>
        </div>
      ),
      width: 'w-40',
    },
  ];

  const completedConfig = {
    itemsPerPage: 10,
    searchPlaceholder: 'Search classes...',
    emptyMessage: 'No completed classes',
  };

  return (
    <div className="p-8">
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

      {/* Upcoming Classes DataTable */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Classes</h2>
        <DataTable
          data={upcomingClasses}
          columns={upcomingColumns}
          config={upcomingConfig}
        />
      </div>

      {/* Completed Classes DataTable */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Completed Classes</h2>
        <DataTable
          data={completedClasses}
          columns={completedColumns}
          config={completedConfig}
        />
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
