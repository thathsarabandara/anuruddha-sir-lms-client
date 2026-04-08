import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FaBook,
  FaChartBar,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaFilePdf,
  FaSpinner,
  FaUser,
} from 'react-icons/fa';
import Notification from '../../components/common/Notification';
import ButtonWithLoader from '../../components/common/ButtonWithLoader';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import { quizAPI } from '../../api/quiz';

const AdminQuizzes = () => {
  const [notification, setNotification] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [teacherFilter, setTeacherFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);

  const quizzesMetricsConfig = [
    {
      label: 'Total Quizzes',
      statsKey: 'total',
      icon: FaFilePdf,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'All quizzes in system',
    },
    {
      label: 'Published',
      statsKey: 'published',
      icon: FaCheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'Live quizzes',
    },
    {
      label: 'Draft',
      statsKey: 'draft',
      icon: FaClock,
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      description: 'Unpublished quizzes',
    },
    {
      label: 'Questions',
      statsKey: 'questions',
      icon: FaChartBar,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'Total question count',
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      published: 'bg-green-100 text-green-700',
      draft: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || colors.draft;
  };

  const stats = useMemo(() => {
    const total = quizzes.length;
    const published = quizzes.filter((quiz) => quiz.is_published).length;
    const draft = total - published;
    const questions = quizzes.reduce((sum, quiz) => sum + (quiz.total_questions || 0), 0);

    return {
      total: String(total),
      published: String(published),
      draft: String(draft),
      questions: String(questions),
    };
  }, [quizzes]);

  const teacherOptions = useMemo(() => {
    const map = new Map();
    quizzes.forEach((quiz) => {
      if (quiz.teacher_id) {
        map.set(quiz.teacher_id, quiz.teacher_name || 'Unknown');
      }
    });

    return [
      { value: 'all', label: 'All Teachers' },
      ...Array.from(map.entries()).map(([id, name]) => ({ value: id, label: name })),
    ];
  }, [quizzes]);

  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        ...(filterStatus !== 'all' ? { status: filterStatus } : {}),
        ...(teacherFilter !== 'all' ? { teacher_id: teacherFilter } : {}),
        ...(searchTerm.trim() ? { search: searchTerm.trim() } : {}),
      };

      const response = await quizAPI.getAllQuizzes(params);
      const list = Array.isArray(response.data?.data) ? response.data.data : [];
      setQuizzes(list);
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to fetch quizzes',
      });
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, teacherFilter, searchTerm]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const handleViewDetails = async (quiz) => {
    setSelectedQuiz(quiz);
    setShowDetailsModal(true);
    setQuestionLoading(true);

    try {
      const response = await quizAPI.getQuizQuestions(quiz.quiz_id);
      const questions = Array.isArray(response.data?.data) ? response.data.data : [];
      setQuizQuestions(questions);
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to load quiz questions',
      });
      setQuizQuestions([]);
    } finally {
      setQuestionLoading(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!selectedQuiz) return;

    setActionLoading(true);
    try {
      const nextPublishedState = !selectedQuiz.is_published;
      await quizAPI.updateQuiz(selectedQuiz.quiz_id, { is_published: nextPublishedState });

      const successMessage = nextPublishedState
        ? 'Quiz published successfully'
        : 'Quiz moved to draft successfully';

      setNotification({
        type: 'success',
        message: successMessage,
      });

      setSelectedQuiz((prev) =>
        prev ? { ...prev, is_published: nextPublishedState, status: nextPublishedState ? 'published' : 'draft' } : prev
      );

      await fetchQuizzes();
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update quiz status',
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-8">
      {notification && (
        <div className="fixed top-4 left-4 right-4 z-50 max-w-sm">
          <Notification
            {...notification}
            onClose={() => setNotification(null)}
          />
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Management</h1>
        <p className="text-gray-600">Filter by teacher and status, review quizzes, and inspect questions</p>
      </div>

      <StatCard stats={stats} metricsConfig={quizzesMetricsConfig} />

      <DataTable
        data={quizzes}
        columns={[
          {
            key: 'title',
            label: 'Quiz Title',
            searchable: true,
            render: (value, quiz) => (
              <div>
                <p className="text-sm font-medium text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{quiz.created_at ? new Date(quiz.created_at).toLocaleDateString() : '-'}</p>
              </div>
            ),
          },
          {
            key: 'teacher_name',
            label: 'Teacher',
            searchable: true,
            filterable: true,
            filterOptions: teacherOptions.filter((option) => option.value !== 'all').map((option) => ({
              label: option.label,
              value: option.label,
            })),
            render: (value) => (
              <p className="text-sm text-gray-700 flex items-center gap-2"><FaUser className="text-gray-400" />{value || 'Unknown'}</p>
            ),
          },
          {
            key: 'total_questions',
            label: 'Questions',
            render: (value) => <p className="text-sm text-gray-900">{value || 0}</p>,
          },
          {
            key: 'duration_minutes',
            label: 'Duration',
            render: (value) => <p className="text-sm text-gray-900">{value ? `${value} mins` : 'Unlimited'}</p>,
          },
          {
            key: 'status',
            label: 'Status',
            filterable: true,
            filterOptions: [
              { label: 'Published', value: 'published' },
              { label: 'Draft', value: 'draft' },
            ],
            render: (value, quiz) => {
              const status = value || (quiz.is_published ? 'published' : 'draft');
              return (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                  {status.toUpperCase()}
                </span>
              );
            },
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (_, quiz) => (
              <button
                onClick={() => handleViewDetails(quiz)}
                className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs flex items-center gap-1 transition whitespace-nowrap"
              >
                <FaEye /> View
              </button>
            ),
          },
        ]}
        config={{
          itemsPerPage: 10,
          searchPlaceholder: 'Search by title, description, or teacher...',
          hideSearch: false,
          emptyMessage: 'No quizzes found',
          searchValue: searchTerm,
          onSearchChange: (value) => setSearchTerm(value),
          statusFilterValue: filterStatus,
          onStatusFilterChange: (value) => setFilterStatus(value),
          teacherFilterValue: teacherFilter,
          onTeacherFilterChange: (value) => setTeacherFilter(value),
        }}
        loading={loading}
      />

      {showDetailsModal && selectedQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Quiz Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                x
              </button>
            </div>

            <div className="space-y-6">
              <div className="pb-6 border-b">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{selectedQuiz.title}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedQuiz.status || (selectedQuiz.is_published ? 'published' : 'draft'))}`}>
                    {(selectedQuiz.status || (selectedQuiz.is_published ? 'published' : 'draft')).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2"><FaBook /> {selectedQuiz.description || 'No description'}</span>
                  <span className="flex items-center gap-2"><FaUser /> {selectedQuiz.teacher_name || 'Unknown'}</span>
                  <span className="flex items-center gap-2"><FaClock /> {selectedQuiz.duration_minutes ? `${selectedQuiz.duration_minutes} mins` : 'Unlimited'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card bg-blue-50">
                  <p className="text-sm text-gray-600 mb-1">Questions</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedQuiz.total_questions || 0}</p>
                </div>
                <div className="card bg-green-50">
                  <p className="text-sm text-gray-600 mb-1">Total Marks</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedQuiz.total_marks || 0}</p>
                </div>
                <div className="card bg-purple-50">
                  <p className="text-sm text-gray-600 mb-1">Pass Score</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedQuiz.passing_score || 0}%</p>
                </div>
                <div className="card bg-orange-50">
                  <p className="text-sm text-gray-600 mb-1">Attempts</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedQuiz.max_attempts || 1}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-3">Questions</h4>

                {questionLoading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaSpinner className="animate-spin" /> Loading questions...
                  </div>
                ) : quizQuestions.length === 0 ? (
                  <p className="text-sm text-gray-600">No questions have been added to this quiz yet.</p>
                ) : (
                  <div className="space-y-4">
                    {quizQuestions.map((question, index) => (
                      <div key={question.question_id || index} className="p-3 bg-white border border-gray-200 rounded-lg">
                        <p className="text-sm font-semibold text-gray-900 mb-2">
                          {index + 1}. {question.question_text}
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                          Type: {question.question_type || '-'} | Points: {question.points ?? 0}
                        </p>
                        {Array.isArray(question.options) && question.options.length > 0 && (
                          <ul className="space-y-1">
                            {question.options.map((option) => (
                              <li
                                key={option.option_id}
                                className={`text-sm px-2 py-1 rounded ${option.is_correct ? 'bg-green-50 text-green-700' : 'text-gray-700'}`}
                              >
                                {option.option_text}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <ButtonWithLoader
                  label={selectedQuiz.is_published ? 'Move To Draft' : 'Publish Quiz'}
                  loadingLabel={selectedQuiz.is_published ? 'Updating...' : 'Publishing...'}
                  isLoading={actionLoading}
                  onClick={handleTogglePublish}
                  icon={<FaCheckCircle />}
                  variant={selectedQuiz.is_published ? 'warning' : 'success'}
                  fullWidth
                />
                <button onClick={() => setShowDetailsModal(false)} className="px-6 btn-outline">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuizzes;
