import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCheck,
  FaChartBar,
  FaFileAlt,
  FaEye,
  FaRotateRight,
  FaFilter,
  FaSearch,
  FaSpinner,
  FaTrophy,
  FaStar,
  FaCalendarAlt,
} from 'react-icons/fa';

const dummyCompletedQuizzes = [
  {
    id: 1,
    title: 'Basic Mathematics',
    quiz_type: 'PRACTICE',
    best_percentage: 85,
    best_is_passed: true,
    attempts_count: 2,
    completion_date: '2024-03-10T10:30:00',
  },
  {
    id: 2,
    title: 'JavaScript Basics',
    quiz_type: 'GRADED',
    best_percentage: 92,
    best_is_passed: true,
    attempts_count: 1,
    completion_date: '2024-03-09T14:15:00',
  },
];

const CompletedQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [quizTypeFilter, setQuizTypeFilter] = useState('all');
  const [stats, setStats] = useState({
    totalCompleted: 0,
    averageScore: 0,
    bestScore: 0,
    passed: 0,
    failed: 0,
  });

  useEffect(() => {
    fetchCompletedQuizzes();
  }, []);

  useEffect(() => {
    filterQuizzes();
  }, [quizzes, searchTerm, quizTypeFilter]);

  const fetchCompletedQuizzes = () => {
    setLoading(true);
    setTimeout(() => {
      setQuizzes(dummyCompletedQuizzes);

      // Calculate stats
      const scores = dummyCompletedQuizzes.map((q) => parseFloat(q.best_percentage));
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b) / scores.length : 0;
      const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
      const passed = dummyCompletedQuizzes.filter((q) => q.best_is_passed).length;
      const failed = dummyCompletedQuizzes.filter((q) => !q.best_is_passed).length;

      setStats({
        totalCompleted: dummyCompletedQuizzes.length,
        averageScore: Math.round(avgScore * 10) / 10,
        bestScore: Math.round(bestScore * 10) / 10,
        passed,
        failed,
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

  const handleViewResults = (quizId, attemptId) => {
    navigate(`/student/quiz/${quizId}/results/${attemptId}`);
  };

  const handleRetakeQuiz = (quizId) => {
    navigate(`/student/quiz/${quizId}/take`);
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

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-50 border-green-200';
    if (percentage >= 60) return 'bg-blue-50 border-blue-200';
    if (percentage >= 40) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-200">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Filter/Search Skeleton */}
          <div className="mb-8 h-10 w-full bg-white border rounded-lg p-4 animate-pulse"></div>

          {/* Results Table Skeleton */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b flex gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 border-b flex gap-4">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Completed Quizzes</h1>
          <p className="text-slate-600">
            Review your performance on {stats.totalCompleted} quiz{stats.totalCompleted !== 1 ? 'zes' : ''}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Completed</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalCompleted}</p>
              </div>
              <FaFileAlt className="text-3xl text-purple-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Average Score</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.averageScore}%</p>
              </div>
              <FaChartBar className="text-3xl text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Best Score</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.bestScore}%</p>
              </div>
              <FaTrophy className="text-3xl text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Passed</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.passed}</p>
              </div>
              <FaCheck className="text-3xl text-emerald-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Failed</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.failed}</p>
              </div>
              <FaStar className="text-3xl text-red-500 opacity-20" />
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

        {/* Quizzes List */}
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">No completed quizzes found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border ${getScoreBgColor(
                  parseFloat(quiz.best_percentage)
                )}`}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Quiz Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getQuizTypeColor(quiz.quiz_type)}`}>
                          {quiz.quiz_type === 'FINAL_EXAM' ? 'Final Exam' : quiz.quiz_type}
                        </span>
                        {quiz.best_is_passed && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 flex items-center gap-1">
                            <FaCheck className="text-sm" /> Passed
                          </span>
                        )}
                        {!quiz.best_is_passed && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            Not Passed
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{quiz.title}</h3>
                      {quiz.course && (
                        <p className="text-sm text-slate-600 mb-2">📚 {quiz.course.title}</p>
                      )}
                      <p className="text-sm text-slate-600 line-clamp-1">{quiz.description}</p>
                    </div>

                    {/* Score Display */}
                    <div className="flex flex-col items-center justify-center min-w-fit">
                      <div className="relative w-24 h-24 flex items-center justify-center mb-2">
                        <div className="absolute inset-0 bg-white rounded-full border-4 border-slate-200"></div>
                        <div className="relative text-center">
                          <p className={`text-3xl font-bold ${getScoreColor(parseFloat(quiz.best_percentage))}`}>
                            {Math.round(parseFloat(quiz.best_percentage))}
                          </p>
                          <p className="text-xs text-slate-600">out of 100</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">
                        {quiz.total_attempts} attempt{quiz.total_attempts !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Attempt Details */}
                    <div className="flex flex-col gap-2 min-w-fit">
                      {quiz.latest_attempt && (
                        <>
                          <div className="text-sm">
                            <p className="text-slate-600">Latest Attempt</p>
                            <p className="font-semibold text-slate-900">
                              {formatDate(quiz.latest_attempt.submitted_at)}
                            </p>
                          </div>
                          <div className="text-sm">
                            <p className="text-slate-600">Score</p>
                            <p className="font-semibold text-slate-900">
                              {Math.round(parseFloat(quiz.latest_attempt.percentage))}%
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 min-w-fit">
                      <button
                        onClick={() => handleViewResults(quiz.id, quiz.latest_attempt?.id)}
                        disabled={!quiz.latest_attempt}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
                      >
                        <FaEye className="text-sm" /> View Results
                      </button>
                      {quiz.total_attempts < quiz.max_attempts && (
                        <button
                          onClick={() => handleRetakeQuiz(quiz.id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors duration-300 flex items-center justify-center gap-2"
                        >
                          <FaRotateRight className="text-sm" /> Retake
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-slate-600">Attempts Progress</p>
                      <p className="text-xs font-semibold text-slate-900">
                        {quiz.total_attempts} / {quiz.max_attempts}
                      </p>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(quiz.total_attempts / quiz.max_attempts) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedQuizzes;
