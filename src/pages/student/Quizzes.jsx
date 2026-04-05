import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaGraduationCap,
  FaTrophy,
  FaSearch,
  FaClock,
  FaExclamationCircle,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimes,
  FaCalendarTimes,
  FaFire,
  FaChartBar,
} from 'react-icons/fa';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import Notification from '../../components/common/Notification';
import { courseAPI } from '../../api/course';
import { quizAPI } from '../../api/quiz';

const DEFAULT_QUIZ = {
  quiz_type: 'GRADED',
  total_questions: 0,
  passing_score: 0,
  time_limit_minutes: 0,
  user_attempts: 0,
  max_attempts: 1,
  user_best_score: null,
  last_attempt_id: null,
  start_date: null,
  end_date: null,
  status: 'available',
};

const normalizeEnrollmentStatus = (course) => {
  const rawStatus = String(course?.status || '').toLowerCase();
  const progress = Number(course?.progress || 0);

  if (rawStatus === 'dropped') return 'dropped';
  if (rawStatus === 'completed' || Boolean(course?.completed_at) || progress >= 100) {
    return 'completed';
  }
  if (rawStatus === 'in_progress' || progress > 0) {
    return 'in_progress';
  }
  return 'enrolled';
};

const getAttemptScore = (attempt) => {
  const raw = attempt?.percentage ?? attempt?.score_percentage ?? attempt?.score ?? null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeQuizDetails = (details) => {
  if (!details) return {};

  return {
    quiz_type: details.quiz_type || details.type || 'GRADED',
    total_questions: Number(details.total_questions || 0),
    passing_score: Number(details.passing_score || 0),
    time_limit_minutes: Number(details.duration_minutes || details.time_limit_minutes || 0),
    max_attempts: Number(details.max_attempts || 1),
    start_date: details.available_from || details.start_date || null,
    end_date: details.available_until || details.end_date || null,
    title: details.title,
  };
};

const categorizeQuizStatus = (quiz) => {
  const now = new Date();
  const hasEnded = quiz.end_date && new Date(quiz.end_date) < now;
  const hasNotStarted = quiz.start_date && new Date(quiz.start_date) > now;

  if (hasEnded && quiz.user_attempts === 0) return 'missed';
  if (hasEnded) return 'expired';
  if (quiz.user_attempts >= quiz.max_attempts) return 'completed';
  if (hasNotStarted) return 'upcoming';
  if (quiz.user_attempts > 0) return 'completed';
  return 'available';
};

const quizStatusStyles = {
  available: { text: 'Available', className: 'bg-emerald-100 text-emerald-700', icon: FaCheckCircle },
  completed: { text: 'Completed', className: 'bg-green-100 text-green-700', icon: FaCheckCircle },
  expired: { text: 'Expired', className: 'bg-red-100 text-red-700', icon: FaExclamationCircle },
  upcoming: { text: 'Upcoming', className: 'bg-blue-100 text-blue-700', icon: FaHourglassHalf },
  missed: { text: 'Missed', className: 'bg-orange-100 text-orange-700', icon: FaCalendarTimes },
};

const StudentQuizzes = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState('available');
  const [searchTerm, setSearchTerm] = useState('');
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);

  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [missedQuizzes, setMissedQuizzes] = useState([]);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState([]);
  const [expiredQuizzes, setExpiredQuizzes] = useState([]);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const allQuizzes = useMemo(
    () => [
      ...availableQuizzes,
      ...completedQuizzes,
      ...missedQuizzes,
      ...upcomingQuizzes,
      ...expiredQuizzes,
    ],
    [availableQuizzes, completedQuizzes, missedQuizzes, upcomingQuizzes, expiredQuizzes]
  );

  const stats = useMemo(() => {
    const scores = allQuizzes
      .map((quiz) => Number(quiz.user_best_score))
      .filter((value) => Number.isFinite(value));

    const totalAttempts = allQuizzes.reduce((sum, quiz) => sum + Number(quiz.user_attempts || 0), 0);
    const avgScore = scores.length > 0
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : 0;
    const bestScore = scores.length > 0 ? Math.round(Math.max(...scores)) : 0;

    return {
      completed: completedQuizzes.length,
      avgScore,
      bestScore,
      totalAttempts,
    };
  }, [allQuizzes, completedQuizzes.length]);

  const quizzesMetricsConfig = [
    {
      label: 'Completed',
      statsKey: 'completed',
      icon: FaCheckCircle,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'Total quizzes taken',
    },
    {
      label: 'Average Score',
      statsKey: 'avgScore',
      icon: FaChartBar,
      bgColor: 'bg-cyan-100',
      textColor: 'text-cyan-600',
      description: 'Overall average',
      formatter: (value) => `${value}%`,
    },
    {
      label: 'Best Score',
      statsKey: 'bestScore',
      icon: FaTrophy,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'Highest performance',
      formatter: (value) => `${value}%`,
    },
    {
      label: 'Total Attempts',
      statsKey: 'totalAttempts',
      icon: FaFire,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      description: 'Number of attempts',
    },
  ];

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  const loadStudentQuizzes = useCallback(async () => {
    setLoading(true);

    try {
      const pageSize = 100;
      let page = 1;
      let totalPages = 1;
      const enrolledRows = [];

      do {
        const response = await courseAPI.getMyCourses({ page, limit: pageSize });
        const rows = response?.data?.data || [];
        const pagination = response?.data?.pagination || {};
        totalPages = Number(pagination.total_pages || 1);

        if (Array.isArray(rows)) {
          enrolledRows.push(...rows);
        }

        page += 1;
      } while (page <= totalPages && page <= 20);

      const activeCourses = enrolledRows
        .filter((course) => {
          const status = normalizeEnrollmentStatus(course);
          return status === 'enrolled' || status === 'in_progress' || status === 'completed';
        })
        .map((course) => ({
          id: course.course_id || course.id,
          title: course.title || 'Untitled Course',
        }))
        .filter((course) => Boolean(course.id));

      setCourses(activeCourses);

      if (activeCourses.length === 0) {
        setAvailableQuizzes([]);
        setCompletedQuizzes([]);
        setMissedQuizzes([]);
        setUpcomingQuizzes([]);
        setExpiredQuizzes([]);
        setLoading(false);
        return;
      }

      const contentResponses = await Promise.allSettled(
        activeCourses.map((course) => courseAPI.getCourseContent(course.id))
      );

      const quizMap = new Map();

      contentResponses.forEach((response, index) => {
        if (response.status !== 'fulfilled') {
          return;
        }

        const course = activeCourses[index];
        const sections = response?.value?.data?.data?.sections || [];

        sections.forEach((section) => {
          const lessons = Array.isArray(section?.lessons) ? section.lessons : [];

          lessons.forEach((lesson) => {
            if (!lesson?.quiz_id) return;
            if (quizMap.has(lesson.quiz_id)) return;

            quizMap.set(lesson.quiz_id, {
              ...DEFAULT_QUIZ,
              id: lesson.quiz_id,
              title: lesson.quiz_title || lesson.quiz_content_title || lesson.title || 'Untitled Quiz',
              course_id: course.id,
              course_title: course.title,
            });
          });
        });
      });

      const baseQuizzes = Array.from(quizMap.values());

      const enrichedQuizzes = await Promise.all(
        baseQuizzes.map(async (quiz) => {
          const [detailsRes, resultsRes] = await Promise.allSettled([
            quizAPI.getQuizDetails(quiz.id),
            quizAPI.getQuizResults(quiz.id),
          ]);

          const details = detailsRes.status === 'fulfilled' ? detailsRes?.value?.data?.data : null;
          const attempts = resultsRes.status === 'fulfilled'
            ? resultsRes?.value?.data?.data?.attempts || []
            : [];

          const detailFields = normalizeQuizDetails(details);
          const scores = attempts
            .map((attempt) => getAttemptScore(attempt))
            .filter((score) => Number.isFinite(score));

          const sortedAttempts = [...attempts].sort((a, b) => {
            const aDate = new Date(a?.submitted_at || a?.created_at || 0).getTime();
            const bDate = new Date(b?.submitted_at || b?.created_at || 0).getTime();
            return bDate - aDate;
          });

          const lastAttempt = sortedAttempts[0] || null;

          const mergedQuiz = {
            ...quiz,
            ...detailFields,
            title: detailFields.title || quiz.title,
            user_attempts: attempts.length,
            user_best_score: scores.length ? Math.max(...scores) : null,
            last_attempt_id: lastAttempt?.attempt_id || lastAttempt?.id || null,
          };

          return {
            ...mergedQuiz,
            status: categorizeQuizStatus(mergedQuiz),
          };
        })
      );

      setAvailableQuizzes(enrichedQuizzes.filter((quiz) => quiz.status === 'available'));
      setCompletedQuizzes(enrichedQuizzes.filter((quiz) => quiz.status === 'completed'));
      setMissedQuizzes(enrichedQuizzes.filter((quiz) => quiz.status === 'missed'));
      setUpcomingQuizzes(enrichedQuizzes.filter((quiz) => quiz.status === 'upcoming'));
      setExpiredQuizzes(enrichedQuizzes.filter((quiz) => quiz.status === 'expired'));
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Failed to load quizzes';
      showNotification(message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudentQuizzes();
  }, [loadStudentQuizzes]);

  const handleStartQuiz = useCallback((quizId) => {
    navigate(`/student/quiz/${quizId}/take`);
  }, [navigate]);

  const handleViewResults = useCallback((quizId, attemptId) => {
    if (!attemptId) {
      showNotification('No completed attempt found for this quiz yet.', 'warning');
      return;
    }
    navigate(`/student/quiz/${quizId}/results/${attemptId}`);
  }, [navigate]);

  const getQuizStatus = (quiz) => {
    const statusKey = quiz.status || categorizeQuizStatus(quiz);
    return quizStatusStyles[statusKey] || quizStatusStyles.available;
  };

  // Define table columns
  const tableColumns = useMemo(() => [
    { 
      key: 'title', 
      label: 'Quiz',
      render: (_, row) => (
        <div>
          <p className="font-semibold text-gray-900">{row.title}</p>
          <p className="text-xs text-gray-500">{row.course_title}</p>
        </div>
      )
    },
    { 
      key: 'quiz_type', 
      label: 'Type',
      render: (_, row) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          row.quiz_type === 'FINAL_EXAM' ? 'bg-red-100 text-red-700' :
          row.quiz_type === 'GRADED' ? 'bg-blue-100 text-blue-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {row.quiz_type.replace('_', ' ')}
        </span>
      )
    },
    { 
      key: 'total_questions', 
      label: 'Questions',
      render: (_, row) => `${row.total_questions || 0} Q`
    },
    { 
      key: 'time_limit_minutes', 
      label: 'Duration',
      render: (_, row) => `${row.time_limit_minutes} min`
    },
    { 
      key: 'passing_score', 
      label: 'Passing Score',
      render: (_, row) => `${row.passing_score}%`
    },
    { 
      key: 'user_attempts', 
      label: 'Attempts',
      render: (_, row) => `${row.user_attempts}/${row.max_attempts}`
    },
    { 
      key: 'user_best_score', 
      label: 'Best Score',
      render: (_, row) => row.user_best_score !== null ? `${Math.round(row.user_best_score)}%` : '-'
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (_, row) => {
        const status = getQuizStatus(row);
        const StatusIcon = status.icon;
        return (
          <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1 w-fit ${status.className}`}>
            <StatusIcon className="text-xs" /> {status.text}
          </span>
        );
      }
    },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (_, row) => {
        const status = getQuizStatus(row);
        return (
          <div className="flex gap-2">
            {(status.text === 'Available' || status.text === 'Upcoming') && row.user_attempts < row.max_attempts ? (
              <button 
                onClick={() => handleStartQuiz(row.id)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition-all"
              >
                {row.user_attempts > 0 ? 'Retry' : 'Start'}
              </button>
            ) : status.text === 'Completed' ? (
              <div className="flex gap-2 flex-wrap">
                <button 
                  onClick={() => handleViewResults(row.id, row.last_attempt_id)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-bold transition-all"
                >
                  Results
                </button>
                {row.user_attempts < row.max_attempts && (
                  <button 
                    onClick={() => handleStartQuiz(row.id)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition-all"
                  >
                    Retry
                  </button>
                )}
              </div>
            ) : (
              <span className="text-xs text-gray-500 font-medium">-</span>
            )}
          </div>
        );
      }
    }
  ], [handleStartQuiz, handleViewResults]);

  // Filter quizzes based on course filter
  const getFilteredQuizzes = (quizzesList) => {
    return quizzesList.filter(quiz => {
      const matchesCourse = courseFilter === 'all' || String(quiz.course_id) === String(courseFilter);
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        String(quiz.title || '').toLowerCase().includes(term) ||
        String(quiz.course_title || '').toLowerCase().includes(term);

      return matchesCourse && matchesSearch;
    });
  };

  // Filter courses for dropdown
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(courseSearchTerm.toLowerCase())
  );

  const getCourseCount = (courseId) => {
    let count = 0;
    if (filter === 'available') {
      count = availableQuizzes.filter(q => String(q.course_id) === String(courseId)).length;
    } else if (filter === 'completed') {
      count = completedQuizzes.filter(q => String(q.course_id) === String(courseId)).length;
    } else if (filter === 'expired') {
      count = expiredQuizzes.filter(q => String(q.course_id) === String(courseId)).length;
    } else if (filter === 'upcoming') {
      count = upcomingQuizzes.filter(q => String(q.course_id) === String(courseId)).length;
    } else if (filter === 'missed') {
      count = missedQuizzes.filter(q => String(q.course_id) === String(courseId)).length;
    }
    return count;
  };

  const filteredAvailable = getFilteredQuizzes(availableQuizzes);
  const filteredCompleted = getFilteredQuizzes(completedQuizzes);
  const filteredExpired = getFilteredQuizzes(expiredQuizzes);
  const filteredUpcoming = getFilteredQuizzes(upcomingQuizzes);
  const filteredMissed = getFilteredQuizzes(missedQuizzes);

  // Get current filtered data based on active tab
  const getDisplayData = () => {
    switch(filter) {
      case 'completed':
        return filteredCompleted;
      case 'missed':
        return filteredMissed;
      case 'upcoming':
        return filteredUpcoming;
      case 'expired':
        return filteredExpired;
      default:
        return filteredAvailable;
    }
  };

  const displayData = getDisplayData();

  return (
    <div className="p-8">
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
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 mb-6">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Quizzes & Assessments
              </h1>
              <p className="text-slate-600 mt-1">Test your knowledge and track your performance</p>
            </div>
            <div className="text-5xl"><FaGraduationCap className="text-blue-600" /></div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <StatCard stats={stats} metricsConfig={quizzesMetricsConfig} />

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading quizzes...</p>
        </div>
      ) : (
        <div>
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-4">
            {[
              { id: 'available', label: 'Available', icon: FaHourglassHalf, count: filteredAvailable.length },
              { id: 'completed', label: 'Completed', icon: FaCheckCircle, count: filteredCompleted.length },
              { id: 'missed', label: 'Missed', icon: FaCalendarTimes, count: filteredMissed.length },
              { id: 'upcoming', label: 'Upcoming', icon: FaClock, count: filteredUpcoming.length },
              { id: 'expired', label: 'Expired', icon: FaExclamationCircle, count: filteredExpired.length },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`pb-3 px-4 font-semibold transition-all flex items-center gap-2 ${
                    filter === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <TabIcon className="text-sm" />
                  {tab.label} ({tab.count})
                </button>
              );
            })}
          </div>

          {/* Course Filter Dropdown */}
          {courses.length > 0 && (
            <div className="mb-6">
              <div className="relative w-full md:w-64">
                <div 
                  onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-blue-600 transition-colors font-medium text-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <span>
                      {courseFilter === 'all' 
                        ? 'All Courses' 
                        : courses.find(c => String(c.id) === String(courseFilter))?.title || 'Select Course'
                      }
                    </span>
                    <FaSearch className="text-gray-400 text-sm" />
                  </div>
                </div>

                {showCourseDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                    {/* Course Search Input */}
                    <div className="p-3 border-b border-gray-200">
                      <input
                        type="text"
                        placeholder="Search courses..."
                        value={courseSearchTerm}
                        onChange={(e) => setCourseSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Course Options */}
                    <div className="max-h-48 overflow-y-auto">
                      <button
                        onClick={() => {
                          setCourseFilter('all');
                          setShowCourseDropdown(false);
                          setCourseSearchTerm('');
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                          courseFilter === 'all' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>All Courses</span>
                          <span className="text-sm text-gray-500">{allQuizzes.length}</span>
                        </div>
                      </button>

                      {filteredCourses.map((course) => (
                        <button
                          key={course.id}
                          onClick={() => {
                            setCourseFilter(course.id);
                            setShowCourseDropdown(false);
                            setCourseSearchTerm('');
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors border-b border-gray-100 ${
                            courseFilter === course.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{course.title}</span>
                            <span className="text-sm text-gray-500">{getCourseCount(course.id)}</span>
                          </div>
                        </button>
                      ))}

                      {filteredCourses.length === 0 && courseSearchTerm && (
                        <div className="px-4 py-3 text-center text-gray-500">
                          No courses found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Data Table with Search and Pagination */}
          <div className="bg-white rounded-xl border border-slate-200 shadow">
            <DataTable
              columns={tableColumns}
              data={displayData}
              config={{
                itemsPerPage: 10,
                searchPlaceholder: 'Search quizzes by title or course...',
                hideSearch: false,
                emptyMessage: 'No quizzes found',
                searchValue: searchTerm,
                onSearchChange: (value) => setSearchTerm(value),
              }}
              loading={loading}
            />
          </div>

          {/* Active Filters Display */}
          {(searchTerm || courseFilter !== 'all') && (
            <div className="flex flex-wrap gap-2 items-center mt-4">
              {searchTerm && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm('')} className="hover:text-blue-900">
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
              {courseFilter !== 'all' && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">
                  Course: {courses.find(c => String(c.id) === String(courseFilter))?.title}
                  <button onClick={() => setCourseFilter('all')} className="hover:text-green-900">
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentQuizzes;
