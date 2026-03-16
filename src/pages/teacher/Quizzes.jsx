import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaAward, FaPencilAlt, FaPlus, FaEye, FaTrash, FaEdit, FaClock, FaUsers, FaClipboardCheck, FaBook, FaCheckCircle, FaCopy, FaCalendar } from 'react-icons/fa';
import { MdQuiz } from 'react-icons/md';
import { toast } from 'react-toastify';
import QuizFormModal from '../../components/teacher/QuizFormModal';
import TeacherDashboardStats from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import { BiLoader } from 'react-icons/bi';

const TeacherQuizzes = () => {
  const navigate = useNavigate();

  // Dummy quiz data
  const dummyQuizzes = [
    {
      id: 'quiz-001',
      title: 'JavaScript Basics',
      description: 'Test your knowledge on JavaScript fundamentals',
      is_published: true,
      total_questions: 10,
      time_limit_minutes: 30,
      total_attempts: 25,
      average_score: 78,
      quiz_type: 'GRADED',
      pending_manual_reviews: 0,
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
      average_score: 82,
      quiz_type: 'GRADED',
      pending_manual_reviews: 2,
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
      average_score: 75,
      quiz_type: 'FINAL_EXAM',
      pending_manual_reviews: 5,
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
      average_score: 0,
      quiz_type: 'GRADED',
      pending_manual_reviews: 0,
      start_date: null,
      end_date: null,
    },
  ];

  // Dummy dashboard stats
  const dummyStats = {
    total_quizzes: 4,
    published_quizzes: 3,
    draft_quizzes: 1,
    quizzes_this_month: 2,
  };

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('published');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [error, setError] = useState('');

  // Dashboard stats metrics configuration
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

  // Fetch quizzes from dummy data
  const fetchQuizzes = async () => {
    setLoading(true);
    setError('');
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setQuizzes(dummyQuizzes);
    } catch (err) {
      setError('Failed to fetch quizzes',err);
      toast.error('Failed to fetch quizzes',err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard statistics from dummy data
  const fetchDashboardStats = async () => {
    setStatsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setDashboardStats(dummyStats);
    } catch (err) {
      setError('Failed to load dashboard statistics',err);
      toast.error('Failed to load dashboard statistics',err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
    fetchDashboardStats();
  }, [quizzes]);

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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const updatedQuizzes = quizzes.filter(q => q.id !== quizId);
      setQuizzes(updatedQuizzes);
      toast.success('Quiz deleted successfully');
      setSuccessMessage('Quiz deleted successfully');
    } catch (err) {
      toast.error('Failed to delete quiz',err);
      setSuccessMessage('');
    }
  };

  const handleQuizSaved = () => {
    fetchQuizzes();
  };

  const handleManageQuestions = (quizId) => {
    navigate(`/teacher/quizzes/${quizId}/questions`);
  };

  const handleViewResults = (quizId) => {
    navigate(`/teacher/quizzes/${quizId}/results`);
  };

  const handleGradePending = (quizId) => {
    navigate(`/teacher/quizzes/${quizId}/grade`);
  };

  const handleCopyQuizId = (quizId) => {
    navigator.clipboard.writeText(quizId);
    setCopiedId(quizId);
    toast.success('Quiz ID copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Ensure quizzes is an array before filtering
  const quizzesArray = Array.isArray(quizzes) ? quizzes : [];
  const publishedQuizzes = quizzesArray.filter((q) => q.is_published);
  const draftQuizzes = quizzesArray.filter((q) => !q.is_published);

  // Published Quizzes DataTable columns
  const publishedColumns = [
    {
      key: 'title',
      label: 'Title',
      searchable: true,
      width: 'w-1/4',
    },
    {
      key: 'quiz_type',
      label: 'Type',
      filterable: true,
      filterOptions: [
        { label: 'Graded', value: 'GRADED' },
        { label: 'Final Exam', value: 'FINAL_EXAM' },
        { label: 'Practice', value: 'PRACTICE' },
      ],
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded ${
          value === 'FINAL_EXAM' ? 'bg-red-100 text-red-700' :
          value === 'GRADED' ? 'bg-blue-100 text-blue-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {value.replace('_', ' ')}
        </span>
      ),
      width: 'w-24',
    },
    {
      key: 'total_questions',
      label: 'Questions',
      render: (value) => <span>{value || 0} Qs</span>,
      width: 'w-20',
    },
    {
      key: 'time_limit_minutes',
      label: 'Duration',
      render: (value) => <span>{value} min</span>,
      width: 'w-20',
    },
    {
      key: 'total_attempts',
      label: 'Attempts',
      render: (value) => <span>{value || 0}</span>,
      width: 'w-20',
    },
    {
      key: 'average_score',
      label: 'Avg Score',
      render: (value) => <span>{Math.round(value || 0)}%</span>,
      width: 'w-20',
    },
    {
      key: 'pending_manual_reviews',
      label: 'Pending Review',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded ${
          value > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
        }`}>
          {value > 0 ? `${value} Pending` : 'None'}
        </span>
      ),
      width: 'w-32',
    },
    {
      key: 'actions',
      label: 'Actions',
      searchable: false,
      render: (value, row) => (
        <div className="flex gap-1 flex-wrap">
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
          {row.pending_manual_reviews > 0 && (
            <button 
              onClick={() => handleGradePending(row.id)}
              className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-xs font-medium"
              title="Grade Pending"
            >
              Grade
            </button>
          )}
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
        </div>
      ),
      width: 'w-56',
    },
  ];

  const publishedConfig = {
    itemsPerPage: 10,
    searchPlaceholder: 'Search quizzes...',
    emptyMessage: 'No published quizzes. Create one to get started.',
  };

  // Draft Quizzes DataTable columns
  const draftColumns = [
    {
      key: 'title',
      label: 'Title',
      searchable: true,
      width: 'w-1/3',
    },
    {
      key: 'total_questions',
      label: 'Questions',
      render: (value) => <span>{value || 0} Qs</span>,
      width: 'w-24',
    },
    {
      key: 'time_limit_minutes',
      label: 'Duration',
      render: (value) => <span>{value} min</span>,
      width: 'w-24',
    },
    {
      key: 'description',
      label: 'Description',
      searchable: true,
      render: (value) => <span className="line-clamp-2">{value || '-'}</span>,
      width: 'w-1/3',
    },
    {
      key: 'actions',
      label: 'Actions',
      searchable: false,
      render: (value, row) => (
        <div className="flex gap-1 flex-wrap">
          <button 
            onClick={() => handleManageQuestions(row.id)}
            className="px-2 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs font-medium"
            title="Add Questions"
          >
            Questions
          </button>
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
        </div>
      ),
      width: 'w-48',
    },
  ];

  const draftConfig = {
    itemsPerPage: 10,
    searchPlaceholder: 'Search drafts...',
    emptyMessage: 'No draft quizzes',
  };
  if (loading) {
    return (
      <div className="p-8">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="h-10 bg-gray-200 rounded-lg w-1/3 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-1/4 animate-pulse"></div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded-lg w-1/2 mb-3 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded-lg w-2/3 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded-lg w-1/3 animate-pulse"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
          ))}
        </div>

        {/* Quiz Cards Skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {/* Title */}
                  <div className="h-6 bg-gray-200 rounded-lg w-1/2 mb-3 animate-pulse"></div>
                  {/* Description */}
                  <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-3 animate-pulse"></div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {[...Array(4)].map((_, statIdx) => (
                      <div key={statIdx}>
                        <div className="h-4 bg-gray-200 rounded-lg w-2/3 mb-2 animate-pulse"></div>
                        <div className="h-5 bg-gray-200 rounded-lg w-1/2 animate-pulse"></div>
                      </div>
                    ))}
                  </div>

                  {/* Date info */}
                  <div className="h-3 bg-gray-200 rounded-lg w-1/3 animate-pulse"></div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 ml-4">
                  {[...Array(5)].map((_, btnIdx) => (
                    <div key={btnIdx} className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
      <span className="text-red-600 mb-4 block">{error}</span>
      <span className="text-green-600 mb-4 block">{successMessage}</span>

      {/* Dashboard Stats */}
      <TeacherDashboardStats stats={dashboardStats} metricsConfig={metricsConfig} loading={statsLoading} />

      <div>
          <div className="flex space-x-4 mb-6 border-b">
            <button
              onClick={() => setSelectedTab('published')}
              className={`pb-3 px-4 font-medium transition-colors ${
                selectedTab === 'published'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Published ({publishedQuizzes.length})
            </button>
            <button
              onClick={() => setSelectedTab('drafts')}
              className={`pb-3 px-4 font-medium transition-colors ${
                selectedTab === 'drafts'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Drafts ({draftQuizzes.length})
            </button>
          </div>

          {/* Published Quizzes */}
          {selectedTab === 'published' && (
            <DataTable
              data={publishedQuizzes}
              columns={publishedColumns}
              config={publishedConfig}
            />
          )}

          {/* Draft Quizzes */}
          {selectedTab === 'drafts' && (
            <DataTable
              data={draftQuizzes}
              columns={draftColumns}
              config={draftConfig}
            />
          )}
        </div>

      {/* Modals */}
      {showCreateModal && (
        <QuizFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleQuizSaved}
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
        />
      )}
    </div>
  );
};

export default TeacherQuizzes;
                          