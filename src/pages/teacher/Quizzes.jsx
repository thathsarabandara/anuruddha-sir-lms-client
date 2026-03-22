import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaCheckCircle, FaCalendar } from 'react-icons/fa';
import { MdQuiz } from 'react-icons/md';
import QuizFormModal from '../../components/teacher/QuizFormModal';
import TeacherDashboardStats from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import Notification from '../../components/common/Notification';
import { quizAPI } from '../../api/quiz';

const Quizzes = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [notification, setNotification] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [_copiedId, _setCopiedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  // Fetch dashboard stats and quizzes on initial load
  useEffect(() => {
    handleFetchDashboardStats();
    handleFetchQuizzes();
  }, []);

  // Fetch quizzes when filters change
  useEffect(() => {
    handleFetchQuizzes();
  }, [statusFilter, searchTerm, fromDate, toDate]);


  const handleFetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await quizAPI.getAllQuizzes();
      const quizzesData = response.data?.data || [];
      console.log('Fetched quizzes:', quizzesData);
      setQuizzes(quizzesData);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      showNotification('Failed to fetch quizzes', 'error');
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchDashboardStats = async () => {
    setStatsLoading(true);
    try {
      const response = await quizAPI.getTeacherDashboardStats();
      setDashboardStats(response.data?.data || null);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      showNotification('Failed to load dashboard statistics', 'error');
    } finally {
      setStatsLoading(false);
    }
  };


  const handleCreateQuiz = () => {
    setSelectedQuiz(null);
    setShowCreateModal(true);
  };

  const handleEditQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setShowEditModal(true);
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      return;
    }
    try {
      await quizAPI.deleteQuiz(quizId);
      const updatedQuizzes = quizzes.filter(q => q.quiz_id !== quizId);
      setQuizzes(updatedQuizzes);
      showNotification('Quiz deleted successfully', 'success');
      // Refresh stats
      handleFetchDashboardStats();
    } catch (err) {
      console.error('Error deleting quiz:', err);
      showNotification('Failed to delete quiz', 'error');
    }
  };

  const handleQuizSaved = () => {
    handleFetchQuizzes();
    handleFetchDashboardStats();
  };

  const handleManageQuestions = (quizId) => {
    navigate(`/teacher/quizzes/${quizId}/questions`);
  };

  const handleViewResults = (quizId) => {
    navigate(`/teacher/quizzes/${quizId}/results`);
  };

  const _handleCopyQuizId = (_quizId) => {
    navigator.clipboard.writeText(_quizId);
    _setCopiedId(_quizId);
    showNotification('Quiz ID copied to clipboard!', 'success');
    setTimeout(() => _setCopiedId(null), 2000);
  };

  const quizzesArray = Array.isArray(quizzes) ? quizzes : [];

  const filteredQuizzes = quizzesArray.filter((q) => {
    // Status filter
    if (statusFilter === 'published' && !q.is_published) return false;
    if (statusFilter === 'draft' && q.is_published) return false;
    
    // Date range filter
    if (fromDate && q.available_from) {
      const quizStartDate = new Date(q.available_from).toISOString().split('T')[0];
      if (quizStartDate < fromDate) return false;
    }
    
    if (toDate && q.available_until) {
      const quizEndDate = new Date(q.available_until).toISOString().split('T')[0];
      if (quizEndDate > toDate) return false;
    }
    
    return true;
  });

  const quizColumns = [
    {
      key: 'title',
      label: 'Title',
      searchable: true,
    },
    {
      key: 'is_published',
      label: 'Status',
      render: (_, row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          row.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {row.is_published ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'total_questions',
      label: 'Questions',
      render: (_, row) => <span>{row.total_questions || 0}</span>,
    },
    {
      key: 'duration_minutes',
      label: 'Duration',
      render: (_, row) => <span>{row.duration_minutes ? `${row.duration_minutes} min` : 'Unlimited'}</span>,
    },
    {
      key: 'available_from',
      label: 'Start Date',
      render: (_, row) => <span>{row.available_from ? new Date(row.available_from).toLocaleDateString() : '-'}</span>,
    },
    {
      key: 'available_until',
      label: 'End Date',
      render: (_, row) => <span>{row.available_until ? new Date(row.available_until).toLocaleDateString() : '-'}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => _handleCopyQuizId(row.quiz_id)}
            className={`px-2 py-1 border border-gray-300 rounded text-xs font-medium hover:bg-gray-50 ${
              _copiedId === row.quiz_id ? 'bg-green-100 text-green-700' : ''
            }`}
            title="Copy Quiz ID"
          >
            {_copiedId === row.quiz_id ? 'Copied!' : 'Copy ID'}
          </button>
          <button 
            onClick={() => handleEditQuiz(row)}
            className="px-2 py-1 border border-gray-300 rounded text-xs font-medium hover:bg-gray-50"
            title="Edit Quiz"
          >
            Edit
          </button>
          <button 
            onClick={() => handleDeleteQuiz(row.quiz_id)}
            className="px-2 py-1 border border-red-300 text-red-600 rounded text-xs font-medium hover:bg-red-50"
            title="Delete Quiz"
          >
            Delete
          </button>
          {row.is_published && (
            <>
              <button 
                onClick={() => handleManageQuestions(row.quiz_id)}
                className="px-2 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs font-medium"
                title="Manage Questions"
              >
                Manage
              </button>
              <button 
                onClick={() => handleViewResults(row.quiz_id)}
                className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium"
                title="View Results"
              >
                Results
              </button>
            </>
          )}
          {!row.is_published && (
            <button 
              onClick={() => handleManageQuestions(row.quiz_id)}
              className="px-2 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs font-medium"
              title="Add Questions"
            >
              Questions
            </button>
          )}
        </div>
      ),
    },
  ];

  const metricsConfig = [
    {
      label: 'Total Quizzes',
      statsKey: 'total_quizzes',
      icon: MdQuiz,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'all quizzes',
    },
    {
      label: 'Published',
      statsKey: 'published_quizzes',
      icon: FaCheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'approved quizzes',
    },
    {
      label: 'Drafts',
      statsKey: 'draft_quizzes',
      icon: FaEdit,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'unpublished quizzes',
    },
    {
      label: 'This Month',
      statsKey: 'quizzes_this_month',
      icon: FaCalendar,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      description: 'quizzes created',
    },
  ];

  const quizConfig = {
    itemsPerPage: 10,
    searchPlaceholder: 'Search quizzes...',
    hideSearch: false,
    searchValue: searchTerm,
    onSearchChange: (value) => setSearchTerm(value),
    statusFilterOptions: [
      { label: 'All', value: 'all' },
      { label: 'Published', value: 'published' },
      { label: 'Drafts', value: 'draft' },
    ],
    statusFilterValue: statusFilter,
    onStatusFilterChange: (value) => setStatusFilter(value),
    dateFilterEnabled: true,
    fromDate: fromDate,
    toDate: toDate,
    onFromDateChange: (value) => setFromDate(value),
    onToDateChange: (value) => setToDate(value),
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Management</h1>
          <p className="text-gray-600">Create and grade quizzes for your students</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleCreateQuiz} className="btn-primary px-6">
            <FaPlus className="inline mr-2" /> Create Quiz
          </button>
        </div>
      </div>
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

      <TeacherDashboardStats stats={dashboardStats} metricsConfig={metricsConfig} loading={statsLoading} />

      <div className="card">
        <DataTable
          data={filteredQuizzes}
          columns={quizColumns}
          config={quizConfig}
          loading={loading}
        />
      </div>

      {/* Modals */}
      {showCreateModal && (
        <QuizFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleQuizSaved}
          onNotification={showNotification}
        />
      )}

      {showEditModal && selectedQuiz && (
        <QuizFormModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedQuiz(null);
          }}
          onSave={handleQuizSaved}
          quiz={selectedQuiz}
          onNotification={showNotification}
        />
      )}
    </div>
  );
};

export default Quizzes;
                          