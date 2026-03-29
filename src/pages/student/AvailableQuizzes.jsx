import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaClock,
  FaBookmark,
  FaChartLine,
  FaArrowRight,
  FaFilter,
  FaSearch,
  FaSpinner,
  FaCalendarAlt,
} from 'react-icons/fa';
import Notification from '../../components/common/Notification';
import ButtonWithLoader from '../../components/common/ButtonWithLoader';

const dummyAvailableQuizzes = [
  { id: 1, title: 'Basic Math Quiz', quiz_type: 'PRACTICE', duration: 30, total_marks: 100, attempts_used: 0, max_attempts: 3 },
  { id: 2, title: 'JavaScript Basics', quiz_type: 'GRADED', duration: 45, total_marks: 100, attempts_used: 1, max_attempts: 2 },
];

const AvailableQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [quizTypeFilter, setQuizTypeFilter] = useState('all');
  const [startingQuizId, setStartingQuizId] = useState(null);
  const [stats, setStats] = useState({
    totalAvailable: 0,
    totalAttempts: 0,
  });

  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  useEffect(() => {
    fetchAvailableQuizzes();
  }, []);

  useEffect(() => {
    filterQuizzes();
  }, [quizzes, searchTerm, quizTypeFilter]);

  const fetchAvailableQuizzes = () => {
    setLoading(true);
    setTimeout(() => {
      setQuizzes(dummyAvailableQuizzes);
      setStats({
        totalAvailable: dummyAvailableQuizzes.length,
        totalAttempts: dummyAvailableQuizzes.reduce((sum, q) => sum + q.attempts_used, 0),
      });
      setLoading(false);
    }, 500);
  };

  const filterQuizzes = () => {
    let filtered = quizzes;

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quiz.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (quizTypeFilter !== 'all') {
      filtered = filtered.filter((quiz) => quiz.quiz_type === quizTypeFilter);
    }

    setFilteredQuizzes(filtered);
  };

  const handleStartQuiz = (quizId) => {
    setStartingQuizId(quizId);
    setTimeout(() => navigate(`/student/quiz/${quizId}/take`), 300);
  };

  const getQuizTypeColor = (type) => {
    switch (type) {
      case 'PRACTICE':
        return 'bg-blue-100 text-blue-800';
      case 'GRADED':
        return 'bg-orange-100 text-orange-800';
      case 'FINAL_EXAM':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isQuizExpired = (quiz) => {
    if (!quiz.end_date) return false;
    return new Date(quiz.end_date) < new Date();
  };

  const isQuizUpcoming = (quiz) => {
    if (!quiz.start_date) return false;
    return new Date(quiz.start_date) > new Date();
  };

  const getDaysRemaining = (quiz) => {
    if (!quiz.end_date) return null;
    const endDate = new Date(quiz.end_date);
    const now = new Date();
    const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-10 w-56 bg-gray-200 rounded-lg animate-pulse mb-3"></div>
            <div className="h-4 w-72 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-200">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Filter/Search Skeleton */}
          <div className="mb-8 h-10 w-full bg-white border rounded-lg p-3 animate-pulse"></div>

          {/* Quizzes Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden border">
                {/* Quiz Header */}
                <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-32 animate-pulse"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                  <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Available Quizzes</h1>
          <p className="text-slate-600">
            Choose from {stats.totalAvailable} quiz{stats.totalAvailable !== 1 ? 'zes' : ''} and test your knowledge
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Available Quizzes</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalAvailable}</p>
              </div>
              <FaBookmark className="text-4xl text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Attempts Used</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalAttempts}</p>
              </div>
              <FaChartLine className="text-4xl text-orange-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Ready to Start</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {quizzes.filter((q) => !isQuizExpired(q) && !isQuizUpcoming(q)).length}
                </p>
              </div>
              <FaClock className="text-4xl text-green-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by quiz name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <FaFilter className="absolute left-3 top-3 text-slate-400" />
              <select
                value={quizTypeFilter}
                onChange={(e) => setQuizTypeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="all">All Quiz Types</option>
                <option value="PRACTICE">Practice Quiz</option>
                <option value="GRADED">Graded Quiz</option>
                <option value="FINAL_EXAM">Final Exam</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quizzes Grid */}
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">No quizzes found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getQuizTypeColor(quiz.quiz_type)}`}>
                      {quiz.quiz_type === 'FINAL_EXAM' ? 'Final Exam' : quiz.quiz_type}
                    </span>
                    {isQuizExpired(quiz) ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">
                        Expired
                      </span>
                    ) : isQuizUpcoming(quiz) ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500 text-white">
                        Upcoming
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
                        Available
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold">{quiz.title}</h3>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  {quiz.course && (
                    <p className="text-sm text-slate-600 mb-3 font-medium">📚 {quiz.course.title}</p>
                  )}

                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{quiz.description}</p>

                  {/* Quiz Stats */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Total Marks:</span>
                      <span className="font-semibold text-slate-900">{quiz.total_marks}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Passing Score:</span>
                      <span className="font-semibold text-slate-900">{quiz.passing_score}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Time Limit:</span>
                      <span className="font-semibold text-slate-900">{quiz.time_limit_minutes} mins</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Attempts:</span>
                      <span className="font-semibold text-slate-900">
                        {quiz.attempts_used}/{quiz.max_attempts}
                      </span>
                    </div>
                  </div>

                  {/* Deadline Info */}
                  {quiz.end_date && (
                    <div className="mb-4 p-3 bg-slate-50 rounded-lg flex items-center gap-2 text-sm text-slate-600">
                      <FaCalendarAlt className="text-blue-500" />
                      <span>
                        {getDaysRemaining(quiz) === 0
                          ? 'Expires today'
                          : `${getDaysRemaining(quiz)} day${getDaysRemaining(quiz) !== 1 ? 's' : ''} remaining`}
                      </span>
                    </div>
                  )}

                  {/* Action Button */}
                  {quiz.attempts_used >= quiz.max_attempts ? (
                    <button
                      disabled
                      className="w-full py-2 rounded-lg font-semibold bg-slate-200 text-slate-400 cursor-not-allowed"
                    >
                      All Attempts Used
                    </button>
                  ) : isQuizExpired(quiz) ? (
                    <button
                      disabled
                      className="w-full py-2 rounded-lg font-semibold bg-slate-200 text-slate-400 cursor-not-allowed"
                    >
                      Quiz Expired
                    </button>
                  ) : isQuizUpcoming(quiz) ? (
                    <button
                      disabled
                      className="w-full py-2 rounded-lg font-semibold bg-slate-200 text-slate-400 cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  ) : (
                    <ButtonWithLoader
                      label="Start Quiz"
                      loadingLabel="Loading..."
                      isLoading={startingQuizId === quiz.id}
                      onClick={() => handleStartQuiz(quiz.id)}
                      variant="primary"
                      fullWidth
                      size="sm"
                      icon={<FaArrowRight className="text-sm" />}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableQuizzes;
