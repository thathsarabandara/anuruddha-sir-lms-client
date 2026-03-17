import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaAward, FaPencilAlt, FaPlus, FaEye, FaTrash, FaEdit, FaClock, FaUsers, FaClipboardCheck, FaBook, FaCheckCircle, FaCopy, FaCalendar } from 'react-icons/fa';
import { MdQuiz } from 'react-icons/md';
import QuizFormModal from '../../components/teacher/QuizFormModal';
import TeacherDashboardStats from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import Notification from '../../components/common/Notification';
import { BiLoader } from 'react-icons/bi';

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

  // Fetch quizzes on initial load
  useEffect(() => {
    handleFetchDashboardStats();
    // Fetch quizzes with current filters
    handleFetchQuizzes(statusFilter, searchTerm, fromDate, toDate);
  }, []);

  // Fetch quizzes when filters change
  useEffect(() => {
    handleFetchQuizzes(statusFilter, searchTerm, fromDate, toDate);
  }, [statusFilter, searchTerm, fromDate, toDate]);


  const dummyQuizzes = [
    {
      id: 'quiz-001',
      title: 'JavaScript Basics',
      description: 'Test your knowledge on JavaScript fundamentals',
      is_published: true,
      total_questions: 10,
      time_limit_minutes: 30,
      total_attempts: 25,
      start_date: '2024-01-15',
      end_date: '2024-02-15',
    },
    {
      id: 'quiz-002',
      title: 'React Advanced Patterns',
      description: 'Advanced React concepts including hooks and state management',
      is_published: true,
      total_questions: 15,
      time_limit_minutes: 45,
      total_attempts: 18,
      start_date: '2024-02-01',
      end_date: '2024-03-01',
    },
    {
      id: 'quiz-003',
      title: 'Midterm Exam',
      description: 'Comprehensive midterm examination',
      is_published: true,
      total_questions: 30,
      time_limit_minutes: 120,
      total_attempts: 45,
      start_date: '2024-03-15',
      end_date: '2024-04-15',
    },
    {
      id: 'quiz-004',
      title: 'CSS Flexbox & Grid',
      description: 'Master CSS layout techniques',
      is_published: false,
      total_questions: 8,
      time_limit_minutes: 25,
      total_attempts: 0,
      start_date: null,
      end_date: null,
    },
  ];
  const dummyStats = {
    total_quizzes: 4,
    published_quizzes: 3,
    draft_quizzes: 1,
    quizzes_this_month: 2,
  };

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

  const handleFetchQuizzes = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setQuizzes(dummyQuizzes);
    } catch (err) {
      showNotification('Failed to fetch quizzes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchDashboardStats = async () => {
    setStatsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setDashboardStats(dummyStats);
    } catch (err) {
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
      await new Promise(resolve => setTimeout(resolve, 300));
      const updatedQuizzes = quizzes.filter(q => q.id !== quizId);
      setQuizzes(updatedQuizzes);
      showNotification('Quiz deleted successfully', 'success');
    } catch (err) {
      showNotification('Failed to delete quiz', 'error');
    }
  };

  const handleQuizSaved = () => {
    handleFetchQuizzes();
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
    if (fromDate && q.start_date) {
      const quizStartDate = new Date(q.start_date).toISOString().split('T')[0];
      if (quizStartDate < fromDate) return false;
    }
    
    if (toDate && q.end_date) {
      const quizEndDate = new Date(q.end_date).toISOString().split('T')[0];
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
      key: 'time_limit_minutes',
      label: 'Duration',
      render: (_, row) => <span>{row.time_limit_minutes} min</span>,
    },
    {
      key: 'total_attempts',
      label: 'Attempts',
      render: (_, row) => <span>{row.is_published ? row.total_attempts || 0 : '-'}</span>,
    },
    {
      key: 'start_date',
      label: 'Start Date',
      render: (_, row) => <span>{row.start_date ? new Date(row.start_date).toLocaleDateString() : '-'}</span>,
    },
    {
      key: 'end_date',
      label: 'End Date',
      render: (_, row) => <span>{row.end_date ? new Date(row.end_date).toLocaleDateString() : '-'}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-1 flex-wrap">
          <button 
            onClick={() => handleEditQuiz(row)}
            className="px-2 py-1 border border-gray-300 rounded text-xs font-medium hover:bg-gray-50"
            title="Edit Quiz"
          >
            Edit
          </button>
          <button 
            onClick={() => handleDeleteQuiz(row.id)}
            className="px-2 py-1 border border-red-300 text-red-600 rounded text-xs font-medium hover:bg-red-50"
            title="Delete Quiz"
          >
            Delete
          </button>
          {row.is_published && (
            <>
              <button 
                onClick={() => handleManageQuestions(row.id)}
                className="px-2 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs font-medium"
                title="Manage Questions"
              >
                Manage
              </button>
              <button 
                onClick={() => handleViewResults(row.id)}
                className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium"
                title="View Results"
              >
                Results
              </button>
            </>
          )}
          {!row.is_published && (
            <button 
              onClick={() => handleManageQuestions(row.id)}
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
                          