import { useState, useMemo, useCallback, useEffect } from 'react';
import { FaBook, FaClock, FaGraduationCap, FaCheckCircle, FaEye } from 'react-icons/fa';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import Notification from '../../components/common/Notification';
import { courseAPI } from '../../api/course';
import { getUser } from '../../utils/helpers';

const getStudentDisplayName = () => {
  const user = getUser();
  const candidate =
    user?.full_name ||
    user?.name ||
    user?.username ||
    [user?.first_name, user?.last_name].filter(Boolean).join(' ');

  return String(candidate || 'Student').trim().replace(/\s+/g, ' ');
};

const buildZoomJoinLink = (zoomLink, displayName = getStudentDisplayName()) => {
  if (!zoomLink) return null;

  const trimmed = String(zoomLink).trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    url.searchParams.set('uname', displayName);
    return url.toString();
  } catch {
    const separator = trimmed.includes('?') ? '&' : '?';
    return `${trimmed}${separator}uname=${encodeURIComponent(displayName)}`;
  }
};

const formatTimeFromISO = (isoDate) => {
  if (!isoDate) return '-';
  const dateObj = new Date(isoDate);
  if (Number.isNaN(dateObj.getTime())) return '-';
  return dateObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const formatDateSafe = (isoDate) => {
  if (!isoDate) return 'Not scheduled';
  const dateObj = new Date(isoDate);
  if (Number.isNaN(dateObj.getTime())) return 'Not scheduled';
  return dateObj.toLocaleDateString();
};

const toLiveClassRows = (enrolledCourses = [], contentByCourse = {}) => {
  const now = new Date();
  const rows = [];

  enrolledCourses.forEach((course) => {
    const courseId = course.course_id || course.id;
    if (!courseId) return;

    const content = contentByCourse[courseId];
    const sections = Array.isArray(content?.sections) ? content.sections : [];

    sections.forEach((section) => {
      const lessons = Array.isArray(section.lessons) ? section.lessons : [];

      lessons.forEach((lesson) => {
        if (!lesson.zoom_meeting_link) return;

        const scheduledAt = lesson.zoom_scheduled_date || null;
        const scheduledDate = scheduledAt ? new Date(scheduledAt) : null;
        const hasValidDate = scheduledDate && !Number.isNaN(scheduledDate.getTime());
        const isCompleted = hasValidDate ? scheduledDate <= now : false;

        rows.push({
          id: lesson.lesson_id || `${courseId}-${lesson.title || 'live-class'}`,
          course_id: courseId,
          course_title: course.title || 'Untitled Course',
          title: lesson.title || 'Live Class',
          subject: course.subject || 'General',
          instructor: course.teacher_name || course.instructor_name || 'Instructor',
          date: scheduledAt,
          time: formatTimeFromISO(scheduledAt),
          duration: Number(lesson.zoom_duration_minutes || lesson.duration_minutes || 0),
          zoom_link: buildZoomJoinLink(lesson.zoom_meeting_link),
          meeting_id: lesson.zoom_meeting_id || null,
          passcode: lesson.zoom_passcode || null,
          description: lesson.description || section.description || '',
          status: isCompleted ? 'completed' : 'scheduled',
          attended: isCompleted,
          recording_link: lesson.recording_url || null,
        });
      });
    });
  });

  return rows;
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
      label: 'Completed',
      statsKey: 'attended',
      icon: FaCheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'Past classes',
    },
    {
      label: 'Completion Rate',
      statsKey: 'attendanceRate',
      icon: FaEye,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'Completed classes',
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
  
  // Data loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [completedClasses, setCompletedClasses] = useState([]);

  // Fetch zoom classes from enrolled courses when component mounts
  useEffect(() => {
    const fetchZoomClasses = async () => {
      try {
        setLoading(true);
        setError(null);

        const myCoursesResponse = await courseAPI.getMyCourses({
          page: 1,
          limit: 500,
          status: 'active',
        });

        const enrolledCourses = Array.isArray(myCoursesResponse?.data?.data)
          ? myCoursesResponse.data.data
          : [];

        if (enrolledCourses.length === 0) {
          setUpcomingClasses([]);
          setCompletedClasses([]);
          return;
        }

        const contentResponses = await Promise.allSettled(
          enrolledCourses.map((course) => courseAPI.getCourseContent(course.course_id || course.id))
        );

        const contentByCourse = {};
        let failedContentRequests = 0;

        contentResponses.forEach((result, index) => {
          const courseId = enrolledCourses[index]?.course_id || enrolledCourses[index]?.id;
          if (!courseId) return;

          if (result.status === 'fulfilled') {
            contentByCourse[courseId] = result.value?.data?.data;
            return;
          }

          failedContentRequests += 1;
        });

        if (failedContentRequests > 0) {
          showNotification('Some course live class details could not be loaded.', 'warning');
        }

        const zoomClasses = toLiveClassRows(enrolledCourses, contentByCourse);

        const upcoming = zoomClasses
          .filter((cls) => cls.status === 'scheduled')
          .sort((a, b) => {
            const aTime = a.date ? new Date(a.date).getTime() : Number.MAX_SAFE_INTEGER;
            const bTime = b.date ? new Date(b.date).getTime() : Number.MAX_SAFE_INTEGER;
            return aTime - bTime;
          });

        const completed = zoomClasses
          .filter((cls) => cls.status === 'completed')
          .sort((a, b) => {
            const aTime = a.date ? new Date(a.date).getTime() : 0;
            const bTime = b.date ? new Date(b.date).getTime() : 0;
            return bTime - aTime;
          });
        
        setUpcomingClasses(upcoming);
        setCompletedClasses(completed);
      } catch (err) {
        console.error('Error loading live classes:', err);
        setError(err?.message || 'Failed to load live classes');
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

      return matchesSearch;
    });
  }, [searchQuery]);

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
      render: (_, row) => formatDateSafe(row.date)
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
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-600">
          COMPLETED
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
                attended: completedClasses.length.toString(),
                attendanceRate: (upcomingClasses.length + completedClasses.length) > 0
                  ? `${Math.round((completedClasses.length / (upcomingClasses.length + completedClasses.length)) * 100)}%`
                  : '0%',
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