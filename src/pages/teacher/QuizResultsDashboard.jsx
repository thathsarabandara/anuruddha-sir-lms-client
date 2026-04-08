import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaUser, FaCheck, FaTimes, FaClock, FaChartBar, FaSearch, FaEye, FaTrophy, FaFire, FaAward } from 'react-icons/fa';
import { quizAPI } from '../../api/quiz';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import Notification from '../../components/common/Notification';

const QuizResultsDashboard = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  // StatCard metrics configuration
  const statCardMetricsConfig = [
    {
      label: 'Average Score',
      statsKey: 'avg_score',
      icon: FaChartBar,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'class average',
      formatter: (value) => `${value.toFixed(1)}%`,
    },
    {
      label: 'Highest Score',
      statsKey: 'highest_score',
      icon: FaTrophy,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'top score',
      formatter: (value) => `${value}%`,
    },
    {
      label: 'Lowest Score',
      statsKey: 'lowest_score',
      icon: FaFire,
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      description: 'minimum score',
      formatter: (value) => `${value}%`,
    },
    {
      label: 'Completion Rate',
      statsKey: 'completion_rate',
      icon: FaAward,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'students completed',
      formatter: (value) => `${value}%`,
    },
  ];

  // DataTable columns configuration
  const dataTableColumns = [
    {
      key: 'student_name',
      label: 'Student Name',
      searchable: true,
      render: (_, row) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <FaUser className="text-primary-600" />
          </div>
          <div className="ml-3">
            <div className="font-medium text-gray-900">{row.student_name}</div>
            <div className="text-sm text-gray-500">{row.student_email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'attempt_number',
      label: 'Attempt',
      render: (_, row) => <span className="text-sm text-gray-900">#{row.attempt_number}</span>,
    },
    {
      key: 'score',
      label: 'Score',
      render: (_, row) => (
        <span className="text-sm font-medium text-gray-900">
          {row.score} / {row.max_score}
        </span>
      ),
    },
    {
      key: 'percentage',
      label: 'Percentage',
      render: (_, row) => {
        const percentage = Math.round(row.percentage || 0);
        return (
          <span className={`text-lg font-bold ${percentage >= 60 ? 'text-green-600' : 'text-red-600'}`}>
            {percentage}%
          </span>
        );
      },
    },
    {
      key: 'time_taken',
      label: 'Time Taken',
      render: (_, row) => {
        const minutes = Math.floor(row.time_taken / 60);
        const seconds = row.time_taken % 60;
        return (
          <div className="flex items-center gap-2 text-sm text-gray-900">
            <FaClock className="text-gray-400" />
            {minutes}m {seconds}s
          </div>
        );
      },
    },
    {
      key: 'submitted_at',
      label: 'Submitted',
      render: (_, row) => <span className="text-sm text-gray-500">{new Date(row.submitted_at).toLocaleDateString()}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <button
          onClick={() => handleViewAttempt(row.id)}
          className="text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1"
        >
          <FaEye /> View
        </button>
      ),
    },
  ];

  // Fetch quiz results and analytics
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setStatsLoading(true);
      try {
        // Get quiz results with attempts and analytics from the new endpoint
        const resultsResponse = await quizAPI.getQuizResultsForTeacher(quizId);
        const resultsData = resultsResponse.data?.data || {};
        
        setQuiz(resultsData.quiz || {});
        setAttempts(resultsData.attempts || []);
        setAnalytics(resultsData.analytics || {});
      } catch (err) {
        console.error('Error fetching quiz results:', err);
        showNotification('Failed to load quiz results', 'error');
      } finally {
        setLoading(false);
        setStatsLoading(false);
      }
    };

    if (quizId) {
      fetchResults();
    }
  }, [quizId]);

  const handleExportResults = () => {
    try {
      // Create CSV content
      const headers = ['Student Name', 'Student ID', 'Score', 'Max Score', 'Percentage', 'Status', 'Attempts', 'Completed At'];
      const rows = attempts.map(attempt => [
        attempt.student_name || 'N/A',
        attempt.student_id || 'N/A',
        attempt.score || 0,
        attempt.max_score || (quiz?.total_marks || 100),
        Math.round(attempt.percentage || 0),
        attempt.passed ? 'Passed' : 'Failed',
        attempt.attempt_number || 1,
        attempt.submitted_at || 'N/A',
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(',')),
      ].join('\n');

      // Download CSV
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
      element.setAttribute('download', `${quiz?.title || 'quiz'}_results.csv`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      showNotification('Results exported successfully!', 'success');
    } catch (err) {
      console.error('Export error:', err);
      showNotification('Failed to export results', 'error');
    }
  };

  const handleViewAttempt = (attemptId) => {
    navigate(`/teacher/quizzes/${quizId}/attempt/${attemptId}`);
  };

  const filteredAttempts = attempts.filter(attempt => {
    const matchesSearch = (attempt.student_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const passed = attempt.passed || false;
    
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
            <p className="text-gray-600">{quiz?.title || 'Loading...'}</p>
          </div>
          
          <button 
            onClick={handleExportResults}
            className="btn-primary px-6 flex items-center gap-2"
            disabled={attempts.length === 0}
          >
            <FaDownload /> Export Results
          </button>
        </div>
      </div>

      {/* Quiz Performance Metrics */}
      {analytics && Object.keys(analytics).length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quiz Performance Metrics</h2>
          <StatCard stats={analytics} metricsConfig={statCardMetricsConfig} loading={statsLoading} />
        </div>
      )}

      {/* Results Table */}
      <div className="card">
        <DataTable
          data={filteredAttempts}
          columns={dataTableColumns}
          config={{
            itemsPerPage: 10,
            searchPlaceholder: 'Search by student name...',
            hideSearch: false,
            searchValue: searchTerm,
            onSearchChange: (value) => setSearchTerm(value),
          }}
          loading={loading}
        />
      </div>

      {/* Empty State */}
      {attempts.length === 0 && !loading && (
        <div className="card text-center py-12">
          <FaChartBar className="mx-auto text-gray-400 text-5xl mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
          <p className="text-gray-600">
            No students have taken this quiz yet
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizResultsDashboard;
