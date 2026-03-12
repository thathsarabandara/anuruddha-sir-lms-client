import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaUser, FaCheck, FaTimes, FaClock, FaChartBar, FaSearch, FaEye } from 'react-icons/fa';

const QuizResultsDashboard = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  // Dummy quiz data
  const dummyQuiz = {
    id: quizId,
    title: 'Introduction to Python',
    total_marks: 100,
    passing_score: 60,
    total_questions: 20,
  };
  
  const dummyAttempts = [
    { id: 1, student_name: 'Rahul Kumar', student_id: 'STU001', score: 85, max_score: 100, attempts: 1, completed_at: '2024-01-15 10:30 AM' },
    { id: 2, student_name: 'Priya Singh', student_id: 'STU002', score: 92, max_score: 100, attempts: 1, completed_at: '2024-01-14 02:15 PM' },
    { id: 3, student_name: 'Amit Patel', student_id: 'STU003', score: 45, max_score: 100, attempts: 2, completed_at: '2024-01-13 11:45 AM' },
    { id: 4, student_name: 'Deepa Sharma', student_id: 'STU004', score: 78, max_score: 100, attempts: 1, completed_at: '2024-01-12 03:20 PM' },
    { id: 5, student_name: 'Vikram Das', student_id: 'STU005', score: 88, max_score: 100, attempts: 1, completed_at: '2024-01-11 09:00 AM' },
  ];
  
  const dummyAnalytics = {
    total_attempts: 5,
    average_score: 77.6,
    highest_score: 92,
    lowest_score: 45,
    pass_rate: 80,
    chart_data: {
      scores: [45, 78, 85, 88, 92],
      labels: ['Amit P.', 'Deepa S.', 'Rahul K.', 'Vikram D.', 'Priya S.'],
    },
  };
  
  const [quiz, setQuiz] = useState(dummyQuiz);
  const [attempts, setAttempts] = useState(dummyAttempts);
  const [analytics, setAnalytics] = useState(dummyAnalytics);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize with dummy data
    setLoading(false);
  }, [quizId]);

  const handleExportResults = () => {
    alert('Export functionality will download a CSV file with all results');
  };

  const handleViewAttempt = (attemptId) => {
    navigate(`/teacher/quizzes/${quizId}/attempt/${attemptId}`);
  };

  const getStatusBadge = (attempt) => {
    const percentage = (attempt.score / quiz.total_marks) * 100;
    if (percentage >= quiz.passing_score) {
      return <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded">Passed</span>;
    }
    return <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded">Failed</span>;
  };

  const filteredAttempts = attempts.filter(attempt => {
    const matchesSearch = attempt.student_name.toLowerCase().includes(searchTerm.toLowerCase());
    const percentage = (attempt.score / quiz.total_marks) * 100;
    const passed = percentage >= quiz.passing_score;
    
    if (filterStatus === 'passed') return matchesSearch && passed;
    if (filterStatus === 'failed') return matchesSearch && !passed;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-8">
        {/* Header Skeleton */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="h-10 w-56 bg-gray-200 rounded-lg animate-pulse mb-3"></div>
            <div className="h-4 w-80 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border rounded-lg p-6">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Filters Skeleton */}
        <div className="bg-white border rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Results Table Skeleton */}
        <div className="bg-white border rounded-lg">
          <div className="p-4 border-b">
            <div className="flex gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border-b">
              <div className="flex gap-4">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={() => navigate('/teacher/quizzes')} 
          className="btn-secondary mb-4 flex items-center gap-2"
        >
          <FaArrowLeft /> Back to Quizzes
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Results</h1>
            <p className="text-gray-600">{quiz?.title}</p>
          </div>
          
          <button 
            onClick={handleExportResults}
            className="btn-primary px-6 flex items-center gap-2"
          >
            <FaDownload /> Export Results
          </button>
        </div>
      </div>

      {/* Analytics */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="card">
            <div className="text-sm text-gray-600 mb-1">Total Attempts</div>
            <div className="text-2xl font-bold text-gray-900">{analytics.total_attempts}</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600 mb-1">Average Score</div>
            <div className="text-2xl font-bold text-primary-600">{analytics.average_score}%</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600 mb-1">Highest Score</div>
            <div className="text-2xl font-bold text-green-600">{analytics.highest_score}%</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600 mb-1">Pass Rate</div>
            <div className="text-2xl font-bold text-blue-600">{analytics.pass_rate}%</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600 mb-1">Avg Time</div>
            <div className="text-2xl font-bold text-yellow-600">
              {Math.floor(analytics.average_time / 60)}m
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All ({attempts.length})
            </button>
            <button
              onClick={() => setFilterStatus('passed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'passed'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Passed
            </button>
            <button
              onClick={() => setFilterStatus('failed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'failed'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Failed
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="card overflow-hidden">
        {filteredAttempts.length === 0 ? (
          <div className="text-center py-12">
            <FaChartBar className="mx-auto text-gray-400 text-5xl mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search' : 'No students have taken this quiz yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attempt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Taken
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttempts.map((attempt) => {
                  const percentage = Math.round((attempt.score / quiz.total_marks) * 100);
                  const passed = percentage >= quiz.passing_score;
                  
                  return (
                    <tr key={attempt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <FaUser className="text-primary-600" />
                          </div>
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">{attempt.student_name}</div>
                            <div className="text-sm text-gray-500">{attempt.student_email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">#{attempt.attempt_number}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {attempt.score} / {quiz.total_marks}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-lg font-bold ${
                          passed ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {percentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(attempt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <FaClock className="text-gray-400" />
                          {Math.floor(attempt.time_taken / 60)}m {attempt.time_taken % 60}s
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(attempt.submitted_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleViewAttempt(attempt.id)}
                          className="text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1"
                        >
                          <FaEye /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Question Statistics */}
      {analytics?.question_statistics && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Question Statistics</h2>
          <div className="space-y-4">
            {analytics.question_statistics.map((stat, index) => (
              <div key={index} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Q{index + 1}. {stat.question_text}
                    </h3>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>Correct: {stat.correct_count}/{stat.total_attempts}</span>
                      <span>Accuracy: {Math.round((stat.correct_count / stat.total_attempts) * 100)}%</span>
                      <span>Avg Score: {stat.average_score}/{stat.max_marks}</span>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      (stat.correct_count / stat.total_attempts) >= 0.7
                        ? 'bg-green-500'
                        : (stat.correct_count / stat.total_attempts) >= 0.5
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${(stat.correct_count / stat.total_attempts) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizResultsDashboard;
