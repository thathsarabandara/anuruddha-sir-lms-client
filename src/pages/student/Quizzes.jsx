import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaCheck, FaGraduationCap, FaTrophy, FaSearch, FaClock, FaClipboardCheck, FaExclamationCircle, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';
import API from '../../api';

const StudentQuizzes = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('available');
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [stats, setStats] = useState({
    completed: 0,
    avgScore: 0,
    bestScore: 0,
    totalAttempts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      // Fetch enrolled courses
      const coursesRes = await API.quiz.getStudentCourses();
      setCourses(coursesRes.data.courses || []);
      
      // Fetch all quizzes
      const quizzesRes = await API.quiz.getStudentQuizzes();
      setQuizzes(quizzesRes.data.quizzes || []);
      
      // Calculate stats
      const completedQuizzes = quizzesRes.data.quizzes.filter(q => q.user_best_score !== null);
      const scores = completedQuizzes.map(q => q.user_best_score || 0);
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
      const totalAttempts = quizzesRes.data.quizzes.reduce((sum, q) => sum + (q.user_attempts || 0), 0);
      
      setStats({
        completed: completedQuizzes.length,
        avgScore: Math.round(avgScore),
        bestScore: Math.round(bestScore),
        totalAttempts
      });
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  // Filter quizzes
  const filterQuizzes = (quizzesList) => {
    return quizzesList.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse = courseFilter === 'all' || quiz.course_id === courseFilter;
      return matchesSearch && matchesCourse;
    });
  };

  const availableQuizzes = filterQuizzes(
    quizzes.filter(q => q.user_attempts < q.max_attempts && q.visibility === 'PUBLISHED')
  );
  
  const completedQuizzes = filterQuizzes(
    quizzes.filter(q => q.user_best_score !== null)
  );

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
          <div className="flex space-x-4 mb-6 border-b">
            <button
              onClick={() => setFilter('available')}
              className={`pb-3 px-4 font-medium transition-colors ${
                filter === 'available'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Available ({availableQuizzes.length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`pb-3 px-4 font-medium transition-colors ${
                filter === 'completed'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Completed ({completedQuizzes.length})
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search quizzes by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>

            {/* Course Filter */}
            {courses.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCourseFilter('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    courseFilter === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All Courses
                </button>
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => setCourseFilter(course.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      courseFilter === course.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {course.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Available Quizzes */}
          {filter === 'available' && (
            <div className="space-y-4">
              {availableQuizzes.length > 0 ? (
                availableQuizzes.map((quiz) => {
                  const status = getQuizStatus(quiz);
                  const StatusIcon = status.icon;
                  
                  return (
                    <div key={quiz.id} className="card hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{quiz.title}</h3>
                            <span className={`px-2 py-1 bg-${status.color}-100 text-${status.color}-700 text-xs font-semibold rounded flex items-center gap-1`}>
                              <StatusIcon className="text-xs" /> {status.text}
                            </span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded ${
                              quiz.quiz_type === 'FINAL_EXAM' ? 'bg-red-100 text-red-700' :
                              quiz.quiz_type === 'GRADED' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {quiz.quiz_type.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{quiz.course_title}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-3">
                            <div className="flex items-center gap-2">
                              <FaClipboardCheck className="text-gray-400" />
                              <span className="text-gray-600">Questions:</span>
                              <span className="font-medium text-gray-900">{quiz.total_questions || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaClock className="text-gray-400" />
                              <span className="text-gray-600">Duration:</span>
                              <span className="font-medium text-gray-900">{quiz.time_limit_minutes} min</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaCheck className="text-gray-400" />
                              <span className="text-gray-600">Passing:</span>
                              <span className="font-medium text-gray-900">{quiz.passing_score}%</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-gray-600">
                              Attempts: <span className="font-medium text-gray-900">{quiz.user_attempts}/{quiz.max_attempts}</span>
                            </span>
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
                          {quiz.user_attempts < quiz.max_attempts && status.text === 'Available' ? (
                            <button 
                              onClick={() => handleStartQuiz(quiz.id)}
                              className="btn-primary px-6"
                            >
                              {quiz.user_attempts > 0 ? 'Retry Quiz' : 'Start Quiz'}
                            </button>
                          ) : (
                            <button className="btn-secondary px-6" disabled>
                              {status.text}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
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
              {completedQuizzes.length > 0 ? (
                completedQuizzes.map((quiz) => (
                  <div key={quiz.id} className="card hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{quiz.title}</h3>
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded flex items-center gap-1">
                            <FaCheckCircle /> Completed
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{quiz.course_title}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                          <div>
                            <span className="text-gray-600">Best Score:</span>
                            <span className={`ml-2 font-bold ${
                              quiz.user_best_score >= quiz.passing_score ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {Math.round(quiz.user_best_score)}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Attempts:</span>
                            <span className="ml-2 font-medium text-gray-900">{quiz.user_attempts}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Questions:</span>
                            <span className="ml-2 font-medium text-gray-900">{quiz.total_questions || 0}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Status:</span>
                            <span className={`ml-2 font-medium ${
                              quiz.user_best_score >= quiz.passing_score ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {quiz.user_best_score >= quiz.passing_score ? 'Passed' : 'Failed'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex flex-col gap-2">
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
                    </div>
                  </div>
                ))
              ) : (
                <div className="card text-center py-12">
                  <FaTrophy className="mx-auto text-gray-400 text-5xl mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Completed Quizzes</h3>
                  <p className="text-gray-600">Start taking quizzes to see your results here</p>
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
