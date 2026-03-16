import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {  FaCheck, FaGraduationCap, FaTrophy, FaSearch, FaClock, FaClipboardCheck, FaExclamationCircle, FaCheckCircle, FaHourglassHalf, FaTimes, FaCalendarTimes, FaFire, FaChartBar, FaEye } from 'react-icons/fa';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';

const StudentQuizzes = () => {
  const navigate = useNavigate();
  
  // Dummy data
  const dummyQuizzes = [
    { id: 1, title: 'Python Basics', course_title: 'Python 101', course_id: 1, status: 'available', quiz_type: 'GRADED', total_questions: 15, passing_score: 70, time_limit_minutes: 60, user_attempts: 0, max_attempts: 3, user_best_score: null, end_date: null },
    { id: 2, title: 'Advanced OOP', course_title: 'OOP Concepts', course_id: 2, status: 'completed', quiz_type: 'GRADED', total_questions: 20, passing_score: 70, time_limit_minutes: 90, user_attempts: 2, max_attempts: 3, user_best_score: 80, end_date: '2024-02-20', last_attempt_id: 1 },
    { id: 3, title: 'Data Structures', course_title: 'DSA Course', course_id: 1, status: 'available', quiz_type: 'FINAL_EXAM', total_questions: 18, passing_score: 75, time_limit_minutes: 120, user_attempts: 1, max_attempts: 2, user_best_score: 65, end_date: '2024-03-30' },
  ];
  
  const dummyStats = {
    completed: 5,
    avgScore: 78,
    bestScore: 95,
    totalAttempts: 8
  };
  
  const [filter, setFilter] = useState('available');
  const [searchTerm, setSearchTerm] = useState('');
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  
  const [availableQuizzes, _setAvailableQuizzes] = useState(dummyQuizzes.filter(q => q.status === 'available'));
  const [completedQuizzes, _setCompletedQuizzes] = useState(dummyQuizzes.filter(q => q.status === 'completed'));
  const [missedQuizzes, _setMissedQuizzes] = useState([]);
  const [upcomingQuizzes, _setUpcomingQuizzes] = useState([]);
  const [expiredQuizzes, _setExpiredQuizzes] = useState([]);
  
  const [courses, _setCourses] = useState([{ id: 1, title: 'Python 101' }, { id: 2, title: 'OOP Concepts' }]);
  const [stats, _setStats] = useState(dummyStats);

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
  const [loading, _setLoading] = useState(false);

  useEffect(() => {
    // Initialize with dummy data
  }, []);

  useEffect(() => {
    // Dummy search - quizzes already loaded
  }, [searchTerm, courseFilter, filter]);

  const handleStartQuiz = useCallback((quizId) => {
    navigate(`/student/quiz/${quizId}/take`);
  }, [navigate]);

  const handleViewResults = useCallback((quizId, attemptId) => {
    navigate(`/student/quiz/${quizId}/results/${attemptId}`);
  }, [navigate]);

  const getQuizStatus = (quiz) => {
    if (quiz.user_attempts >= quiz.max_attempts) {
      return { text: 'Completed', color: 'green', icon: FaCheckCircle };
    }
    if (quiz.end_date && new Date(quiz.end_date) < new Date()) {
      return { text: 'Expired', color: 'red', icon: FaExclamationCircle };
    }
    if (quiz.start_date && new Date(quiz.start_date) > new Date()) {
      return { text: 'Upcoming', color: 'blue', icon: FaHourglassHalf };
    }
    return { text: 'Available', color: 'green', icon: FaCheckCircle };
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
          <span className={`px-2 py-1 bg-${status.color}-100 text-${status.color}-700 text-xs font-semibold rounded-full flex items-center gap-1 w-fit`}>
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
      const matchesCourse = courseFilter === 'all' || quiz.course_id === courseFilter;
      return matchesCourse;
    });
  };

  // Filter courses for dropdown
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(courseSearchTerm.toLowerCase())
  );

  const getCourseCount = (courseId) => {
    let count = 0;
    if (filter === 'available') {
      count = availableQuizzes.filter(q => q.course_id === courseId).length;
    } else if (filter === 'completed') {
      count = completedQuizzes.filter(q => q.course_id === courseId).length;
    } else if (filter === 'expired') {
      count = expiredQuizzes.filter(q => q.course_id === courseId).length;
    } else if (filter === 'upcoming') {
      count = upcomingQuizzes.filter(q => q.course_id === courseId).length;
    } else if (filter === 'missed') {
      count = missedQuizzes.filter(q => q.course_id === courseId).length;
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
                        : courses.find(c => c.id === courseFilter)?.title || 'Select Course'
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
                          <span className="text-sm text-gray-500">{availableQuizzes.length + completedQuizzes.length}</span>
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
                  Course: {courses.find(c => c.id === courseFilter)?.title}
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
