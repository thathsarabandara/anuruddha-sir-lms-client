import { useState, useMemo, useCallback, useEffect } from 'react';
import { FaBook, FaCalendar, FaCheck, FaClock, FaFileVideo, FaUsers, FaVideo, FaSearch, FaFilter, FaTimes, FaGraduationCap, FaCheckCircle, FaEye } from 'react-icons/fa';
import { GoDotFill } from 'react-icons/go';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import Notification from '../../components/common/Notification';

// Dummy Live Classes Data
const getDummyZoomClasses = () => {
  const now = new Date();
  return [
    {
      id: 'class-1',
      title: 'Python Advanced Concepts',
      subject: 'Programming',
      instructor: 'John Smith',
      date: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      time: '2:00 PM',
      duration: 60,
      zoom_link: 'https://zoom.us/j/123456789',
      meeting_id: '123456789',
      passcode: '123456',
      description: 'Deep dive into decorators, generators, and async programming',
      enrolled_students: 45,
      status: 'scheduled'
    },
    {
      id: 'class-2',
      title: 'Web Development Fundamentals',
      subject: 'Web Development',
      instructor: 'Sarah Lee',
      date: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      time: '3:30 PM',
      duration: 90,
      zoom_link: 'https://zoom.us/j/987654321',
      meeting_id: '987654321',
      passcode: '654321',
      description: 'Learn HTML, CSS, JavaScript basics for web development',
      enrolled_students: 67,
      status: 'scheduled'
    },
    {
      id: 'class-3',
      title: 'Data Science Bootcamp',
      subject: 'Data Science',
      instructor: 'Mike Johnson',
      date: new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(),
      time: '1:00 PM',
      duration: 120,
      zoom_link: 'https://zoom.us/j/456789123',
      meeting_id: '456789123',
      passcode: '789123',
      description: 'Pandas, NumPy, and data visualization techniques',
      enrolled_students: 32,
      status: 'scheduled'
    },
    {
      id: 'class-4',
      title: 'JavaScript ES6+ Features',
      subject: 'Programming',
      instructor: 'Emma Brown',
      date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      time: '4:00 PM',
      duration: 75,
      zoom_link: 'https://zoom.us/j/789123456',
      meeting_id: '789123456',
      passcode: '456789',
      description: 'Arrow functions, promises, async/await patterns',
      enrolled_students: 55,
      status: 'scheduled'
    },
    {
      id: 'class-5',
      title: 'Database Design & SQL',
      subject: 'Databases',
      instructor: 'Alex Brown',
      date: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      time: '10:00 AM',
      duration: 90,
      zoom_link: 'https://zoom.us/j/321654987',
      meeting_id: '321654987',
      passcode: '654987',
      description: 'Relational databases, normalization, and query optimization',
      enrolled_students: 41,
      status: 'completed',
      recording_link: 'https://example.com/recording/class-5'
    },
    {
      id: 'class-6',
      title: 'Cloud Computing with AWS',
      subject: 'Cloud',
      instructor: 'David Wilson',
      date: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      time: '2:30 PM',
      duration: 120,
      zoom_link: 'https://zoom.us/j/654987321',
      meeting_id: '654987321',
      passcode: '987654',
      description: 'EC2, S3, Lambda, and serverless architecture',
      enrolled_students: 38,
      status: 'completed',
      recording_link: 'https://example.com/recording/class-6'
    },
    {
      id: 'class-7',
      title: 'React Hooks Deep Dive',
      subject: 'Web Development',
      instructor: 'Sarah Lee',
      date: new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString(),
      time: '3:00 PM',
      duration: 60,
      zoom_link: 'https://zoom.us/j/987321654',
      meeting_id: '987321654',
      passcode: '321987',
      description: 'useState, useEffect, useContext, custom hooks',
      enrolled_students: 72,
      status: 'completed',
      recording_link: 'https://example.com/recording/class-7'
    },
    {
      id: 'class-8',
      title: 'Machine Learning Basics',
      subject: 'Data Science',
      instructor: 'Mike Johnson',
      date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      time: '1:30 PM',
      duration: 90,
      zoom_link: 'https://zoom.us/j/123987654',
      meeting_id: '123987654',
      passcode: '987123',
      description: 'Supervised learning, classification, regression algorithms',
      enrolled_students: 28,
      status: 'scheduled'
    }
  ];
};

const StudentLiveClasses = () => {
  const liveClassesMetricsConfig = [
    {
      label: 'Total Classes',
      statsKey: 'totalClasses',
      icon: FaBook,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'Enrolled classes',
    },
    {
      label: 'Attended',
      statsKey: 'attended',
      icon: FaCheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'Classes completed',
    },
    {
      label: 'Attendance Rate',
      statsKey: 'attendanceRate',
      icon: FaEye,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'Overall percentage',
    },
    {
      label: 'Upcoming',
      statsKey: 'upcomingCount',
      icon: FaClock,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'Scheduled classes',
    },
  ];
  const [filter, setFilter] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  
  // Data loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [completedClasses, setCompletedClasses] = useState([]);

  // Fetch zoom classes when component mounts
  useEffect(() => {
    const fetchZoomClasses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use dummy data instead of API call
        const zoomClasses = getDummyZoomClasses();
        
        // Separate upcoming and completed classes
        const upcoming = zoomClasses.filter(cls => {
          const classDate = new Date(cls.date);
          return classDate > new Date();
        });
        
        const completed = zoomClasses.filter(cls => {
          const classDate = new Date(cls.date);
          return classDate <= new Date();
        });
        
        setUpcomingClasses(upcoming);
        setCompletedClasses(completed);
      } catch (err) {
        console.error('Error loading live classes:', err);
        setError('Failed to load live classes');
      } finally {
        setLoading(false);
      }
    };
    
    fetchZoomClasses();
  }, []);

  // Filter logic
  const applyFilters = useCallback((classes) => {
    return classes.filter(classItem => {
      // Search filter
      const matchesSearch = 
        classItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        classItem.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        classItem.instructor.toLowerCase().includes(searchQuery.toLowerCase());

      // Subject filter
      const matchesSubject = selectedSubjects.length === 0 || selectedSubjects.includes(classItem.subject);

      return matchesSearch && matchesSubject;
    });
  }, [searchQuery, selectedSubjects]);

  const filteredUpcomingClasses = useMemo(() => applyFilters(upcomingClasses), [applyFilters, upcomingClasses]);
  const filteredCompletedClasses = useMemo(() => applyFilters(completedClasses), [applyFilters, completedClasses]);

  const displayClasses = filter === 'upcoming' ? filteredUpcomingClasses : filteredCompletedClasses;


  // Define table columns based on current filter
  const tableColumns = useMemo(() => [
    { 
      key: 'title', 
      label: 'Class',
      render: (_, row) => (
        <div>
          <p className="font-semibold text-gray-900">{row.title}</p>
          <p className="text-xs text-gray-500">{row.subject}</p>
        </div>
      )
    },
    { 
      key: 'instructor', 
      label: 'Instructor',
      width: 'w-32'
    },
    { 
      key: 'date', 
      label: 'Date',
      render: (_, row) => new Date(row.date).toLocaleDateString()
    },
    { 
      key: 'time', 
      label: 'Time',
      render: (_, row) => `${row.time} (${row.duration} min)`
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (_, row) => filter === 'upcoming' ? (
        <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">
          SCHEDULED
        </span>
      ) : (
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${row.attended ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
          {row.attended ? '✓ ATTENDED' : '✗ MISSED'}
        </span>
      )
    },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          {filter === 'upcoming' && row.zoom_link && (
            <a 
              href={row.zoom_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-bold transition-all"
            >
              Join
            </a>
          )}
          {filter === 'completed' && row.recording_link && (
            <a 
              href={row.recording_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition-all"
            >
              Recording
            </a>
          )}
          <button className="px-3 py-1 border border-slate-300 hover:bg-slate-50 rounded text-xs font-semibold transition-all">
            Details
          </button>
        </div>
      )
    }
  ], [filter]);

  const [notificationState, setNotificationState] = useState(null);

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotificationState({ message, type, duration });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
        {notificationState && (
          <div className="fixed top-4 right-4 z-50 max-w-md">
            <Notification
              message={notificationState.message}
              type={notificationState.type}
              duration={notificationState.duration}
              onClose={() => setNotificationState(null)}
            />
          </div>
        )}
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10 mb-5">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Live Classes
                </h1>
                <p className="text-slate-600 mt-1">Join live interactive sessions with Anuruddha Sir</p>
              </div>
              <div className="text-5xl"><FaGraduationCap className="text-blue-600" /></div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-slate-600 font-semibold">Loading live classes...</p>
          </div>
        )}

        {!loading && (
          <div className="max-w-7xl mx-auto">
            {/* Stats */}
            <StatCard 
              stats={{
                totalClasses: (upcomingClasses.length + completedClasses.length).toString(),
                attended: completedClasses.filter(c => c.attended).length.toString(),
                attendanceRate: completedClasses.length > 0 ? `${Math.round((completedClasses.filter(c => c.attended).length / completedClasses.length) * 100)}%` : '0%',
                upcomingCount: upcomingClasses.length.toString(),
              }}
              metricsConfig={liveClassesMetricsConfig}
            />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 mb-6">
        <button
          onClick={() => setFilter('upcoming')}
          className={`pb-3 px-4 font-semibold transition-all ${
            filter === 'upcoming'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Upcoming ({filteredUpcomingClasses.length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`pb-3 px-4 font-semibold transition-all ${
            filter === 'completed'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Completed ({filteredCompletedClasses.length})
        </button>
      </div>

      {/* Data Table with Search, Filter and Pagination */}
      <div className="bg-white rounded-xl border border-slate-200 shadow mb-6">
        <DataTable
          columns={tableColumns}
          data={displayClasses}
          config={{
            itemsPerPage: 10,
            searchPlaceholder: 'Search by title, subject, or instructor...',
            hideSearch: false,
            emptyMessage: 'No classes found',
            searchValue: searchQuery,
            onSearchChange: (value) => setSearchQuery(value),
          }}
          loading={loading}
        />
      </div>

      
          </div>
        )}
    </div>
  );
}

export default StudentLiveClasses;