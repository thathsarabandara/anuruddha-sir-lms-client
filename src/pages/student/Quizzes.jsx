import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaCheck, FaGraduationCap, FaTrophy, FaSearch, FaClock, FaClipboardCheck, FaExclamationCircle, FaCheckCircle, FaHourglassHalf, FaTimes, FaCalendarTimes } from 'react-icons/fa';
// Removed: API and studentQuizAPI imports - using dummy data instead

const StudentQuizzes = () => {
  const navigate = useNavigate();
  
  // Dummy data
  const dummyQuizzes = [
    { id: 1, title: 'Python Basics', course: 'Python 101', status: 'available', questions: 15, passingScore: 10, timeLimit: 60 },
    { id: 2, title: 'Advanced OOP', course: 'OOP Concepts', status: 'completed', questions: 20, passingScore: 14, score: 16, completionDate: '2024-01-20' },
    { id: 3, title: 'Data Structures', course: 'DSA Course', status: 'available', questions: 18, passingScore: 13, timeLimit: 90 },
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
  
  const [courses, _setCourses] = useState([{ id: 1, name: 'Python 101' }, { id: 2, name: 'OOP Concepts' }]);
  const [stats, _setStats] = useState(dummyStats);
  const [loading, _setLoading] = useState(false);

  useEffect(() => {
    // Initialize with dummy data
  }, []);

  useEffect(() => {
    // Dummy search - quizzes already loaded
  }, [searchTerm, courseFilter, filter]);

  const handleStartQuiz = (quizId) => {
    navigate(`/student/quiz/${quizId}/take`);
  };

  const handleViewResults = (quizId, attemptId) => {
    navigate(`/student/quiz/${quizId}/results/${attemptId}`);
  };

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

  const renderQuizCard = (quiz, type = 'available') => {
    const status = getQuizStatus(quiz);
    const StatusIcon = status.icon;
    
    return (
      <div key={quiz.id} className="card hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2 flex-wrap gap-2">
              <h3 className="text-lg font-bold text-gray-900">{quiz.title}</h3>
              <span className={`px-3 py-1 bg-${status.color}-100 text-${status.color}-700 text-xs font-semibold rounded-full flex items-center gap-1`}>
                <StatusIcon className="text-xs" /> {status.text}
              </span>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                quiz.quiz_type === 'FINAL_EXAM' ? 'bg-red-100 text-red-700' :
                quiz.quiz_type === 'GRADED' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {quiz.quiz_type.replace('_', ' ')}
              </span>
            </div>
            <p className="text-sm text-primary-600 font-medium mb-3">{quiz.course_title}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
              <div className="flex items-center gap-2">
                <FaClipboardCheck className="text-blue-500" />
                <div>
                  <span className="text-gray-600">Questions:</span>
                  <span className="ml-1 font-medium text-gray-900">{quiz.total_questions || 0}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-orange-500" />
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <span className="ml-1 font-medium text-gray-900">{quiz.time_limit_minutes} min</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-green-500" />
                <div>
                  <span className="text-gray-600">Passing:</span>
                  <span className="ml-1 font-medium text-gray-900">{quiz.passing_score}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaTrophy className="text-yellow-500" />
                <div>
                  <span className="text-gray-600">Attempts:</span>
                  <span className="ml-1 font-medium text-gray-900">{quiz.user_attempts}/{quiz.max_attempts}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm flex-wrap gap-3">
              {quiz.user_best_score !== null && (
                <span className="text-gray-600">
                  Best Score: <span className="font-medium text-green-600">{Math.round(quiz.user_best_score)}%</span>
                </span>
              )}
              {quiz.end_date && (
                <span className="text-gray-600">
                  Due: <span className="font-medium text-gray-900">{new Date(quiz.end_date).toLocaleDateString()}</span>
                </span>
              )}
            </div>
          </div>
          
          <div className="ml-4">
            {type === 'available' && quiz.user_attempts < quiz.max_attempts && status.text === 'Available' ? (
              <button 
                onClick={() => handleStartQuiz(quiz.id)}
                className="btn-primary px-6"
              >
                {quiz.user_attempts > 0 ? 'Retry Quiz' : 'Start Quiz'}
              </button>
            ) : type === 'completed' ? (
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleViewResults(quiz.id, quiz.last_attempt_id)}
                  className="btn-primary px-6"
                >
                  View Results
                </button>
                {quiz.user_attempts < quiz.max_attempts && (
                  <button 
                    onClick={() => handleStartQuiz(quiz.id)}
                    className="btn-secondary px-6"
                  >
                    Retry
                  </button>
                )}
              </div>
            ) : (
              <button className="btn-secondary px-6" disabled>
                {status.text}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Completed</div>
          <div className="text-2xl font-bold text-gray-900">{stats.completed} Quizzes</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Average Score</div>
          <div className="text-2xl font-bold text-primary-600">{stats.avgScore}%</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Best Score</div>
          <div className="text-2xl font-bold text-green-600">{stats.bestScore}%</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Total Attempts</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.totalAttempts}</div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading quizzes...</p>
        </div>
      ) : (
        <div>
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b">
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
                  className={`pb-3 px-4 font-medium transition-colors flex items-center gap-2 ${
                    filter === tab.id
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <TabIcon />
                  {tab.label} ({tab.count})
                </button>
              );
            })}
          </div>

          {/* Search and Filter Section */}
          <div className="mb-6 space-y-4">
            {/* Search Bar - Search by title, course, or ID */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search quizzes by title, course, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Course Filter Dropdown */}
            {courses.length > 0 && (
              <div className="relative">
                <div 
                  onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-primary-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">
                      {courseFilter === 'all' 
                        ? 'All Courses' 
                        : courses.find(c => c.id === courseFilter)?.title || 'Select Course'
                      }
                    </span>
                    <FaSearch className="text-gray-400" />
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
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-600"
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
                          courseFilter === 'all' ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700'
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
                            courseFilter === course.id ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700'
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
            )}

            {/* Active Filters Display */}
            <div className="flex flex-wrap gap-2 items-center">
              {searchTerm && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm('')} className="hover:text-blue-900">
                    <FaTimes />
                  </button>
                </span>
              )}
              {courseFilter !== 'all' && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">
                  Course: {courses.find(c => c.id === courseFilter)?.title}
                  <button onClick={() => setCourseFilter('all')} className="hover:text-green-900">
                    <FaTimes />
                  </button>
                </span>
              )}
            </div>
          </div>

          {/* Available Quizzes */}
          {filter === 'available' && (
            <div className="space-y-4">
              {filteredAvailable.length > 0 ? (
                <div>
                  <p className="text-sm text-gray-600 mb-3 font-medium">
                    Showing {filteredAvailable.length} available {filteredAvailable.length === 1 ? 'quiz' : 'quizzes'}
                  </p>
                  {filteredAvailable.map((quiz) => renderQuizCard(quiz, 'available'))}
                </div>
              ) : (
                <div className="card text-center py-12">
                  <FaClipboardCheck className="mx-auto text-gray-400 text-5xl mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Available Quizzes</h3>
                  <p className="text-gray-600">Check back later for new quizzes</p>
                </div>
              )}
            </div>
          )}

          {/* Completed Quizzes */}
          {filter === 'completed' && (
            <div className="space-y-4">
              {filteredCompleted.length > 0 ? (
                <div>
                  <p className="text-sm text-gray-600 mb-3 font-medium">
                    Showing {filteredCompleted.length} completed {filteredCompleted.length === 1 ? 'quiz' : 'quizzes'}
                  </p>
                  {filteredCompleted.map((quiz) => renderQuizCard(quiz, 'completed'))}
                </div>
              ) : (
                <div className="card text-center py-12">
                  <FaTrophy className="mx-auto text-gray-400 text-5xl mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Completed Quizzes</h3>
                  <p className="text-gray-600">Start taking quizzes to see your results here</p>
                </div>
              )}
            </div>
          )}

          {/* Missed Quizzes */}
          {filter === 'missed' && (
            <div className="space-y-4">
              {filteredMissed.length > 0 ? (
                <div>
                  <p className="text-sm text-gray-600 mb-3 font-medium">
                    Showing {filteredMissed.length} missed {filteredMissed.length === 1 ? 'quiz' : 'quizzes'}
                  </p>
                  {filteredMissed.map((quiz) => renderQuizCard(quiz, 'missed'))}
                </div>
              ) : (
                <div className="card text-center py-12">
                  <FaCalendarTimes className="mx-auto text-gray-400 text-5xl mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Missed Quizzes</h3>
                  <p className="text-gray-600">Great! You haven't missed any quizzes</p>
                </div>
              )}
            </div>
          )}

          {/* Upcoming Quizzes */}
          {filter === 'upcoming' && (
            <div className="space-y-4">
              {filteredUpcoming.length > 0 ? (
                <div>
                  <p className="text-sm text-gray-600 mb-3 font-medium">
                    Showing {filteredUpcoming.length} upcoming {filteredUpcoming.length === 1 ? 'quiz' : 'quizzes'}
                  </p>
                  {filteredUpcoming.map((quiz) => renderQuizCard(quiz, 'upcoming'))}
                </div>
              ) : (
                <div className="card text-center py-12">
                  <FaClock className="mx-auto text-gray-400 text-5xl mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Quizzes</h3>
                  <p className="text-gray-600">All scheduled quizzes have started</p>
                </div>
              )}
            </div>
          )}

          {/* Expired Quizzes */}
          {filter === 'expired' && (
            <div className="space-y-4">
              {filteredExpired.length > 0 ? (
                <div>
                  <p className="text-sm text-gray-600 mb-3 font-medium">
                    Showing {filteredExpired.length} expired {filteredExpired.length === 1 ? 'quiz' : 'quizzes'}
                  </p>
                  {filteredExpired.map((quiz) => renderQuizCard(quiz, 'expired'))}
                </div>
              ) : (
                <div className="card text-center py-12">
                  <FaExclamationCircle className="mx-auto text-gray-400 text-5xl mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Expired Quizzes</h3>
                  <p className="text-gray-600">All your quizzes are still active</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentQuizzes;
