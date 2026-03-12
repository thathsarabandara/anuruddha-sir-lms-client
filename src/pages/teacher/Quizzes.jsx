import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaAward, FaPencilAlt, FaPlus, FaEye, FaTrash, FaEdit, FaClock, FaUsers, FaClipboardCheck, FaBook, FaCheckCircle, FaCopy } from 'react-icons/fa';
import { MdQuiz } from 'react-icons/md';
import { toast } from 'react-toastify';
import QuizFormModal from '../../components/teacher/QuizFormModal';
import { BiLoader } from 'react-icons/bi';

const TeacherQuizzes = () => {
  const navigate = useNavigate();
  // Dummy data
  const dummyQuizzes = [
    { id: 1, title: 'Python Basics', description: 'Basic Python concepts', status: 'published', questions: 20, attempts: 45, created_date: '2024-02-15' },
    { id: 2, title: 'Web Dev Quiz', description: 'HTML, CSS, JS', status: 'published', questions: 15, attempts: 32, created_date: '2024-02-20' },
    { id: 3, title: 'Advanced Python', description: 'Advanced concepts', status: 'draft', questions: 10, attempts: 0, created_date: '2024-03-05' },
  ];

  const dummyStats = {
    total: 3,
    published: 2,
    draft: 1,
    attempts: 77,
  };

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('published');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  
  const [quizzes, setQuizzes] = useState(dummyQuizzes);
  const [stats, _setStats] = useState(dummyStats);
  const [loading, _setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    // Dummy data already loaded
  }, []);

  const fetchQuizzes = () => {
    // Dummy data already set
  };

  const handleCreateQuiz = () => {
    setSelectedQuiz(null);
    setShowCreateModal(true);
  };

  const handleEditQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setShowEditModal(true);
  };

  const handleDeleteQuiz = (quizId) => {
    if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      return;
    }
    setQuizzes(quizzes.filter(q => q.id !== quizId));
    toast.success('Quiz deleted successfully');
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
  const publishedQuizzes = quizzesArray.filter((q) => q.visibility === 'PUBLISHED');
  const draftQuizzes = quizzesArray.filter((q) => q.visibility === 'DRAFT');
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

      {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Quizzes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500 mt-2">all quizzes</p>
              </div>
              <div className="bg-blue-100 text-blue-600 p-3 rounded-lg text-2xl">
                <MdQuiz />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Published</p>
                <p className="text-3xl font-bold text-gray-900">{stats.published}</p>
                <p className="text-xs text-gray-500 mt-2">approved quizzes</p>
              </div>
              <div className="bg-green-100 text-green-600 p-3 rounded-lg text-2xl">
                <FaCheckCircle />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Pending Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-xs text-gray-500 mt-2">manual grading</p>
              </div>
              <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg text-2xl">
                <FaPencilAlt />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Drafts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.draft}</p>
                <p className="text-xs text-gray-500 mt-2">unpublished quizzes</p>
              </div>
              <div className="bg-purple-100 text-purple-600 p-3 rounded-lg text-2xl">
                <FaEdit />
              </div>
            </div>
          </div>
        </div>

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
            <div className="space-y-4">
              {publishedQuizzes.length === 0 ? (
                <div className="card text-center py-12">
                  <FaClipboardCheck className="mx-auto text-gray-400 text-5xl mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Published Quizzes</h3>
                  <p className="text-gray-600 mb-4">Create your first quiz to get started</p>
                  <button onClick={handleCreateQuiz} className="btn-primary">
                    Create Quiz
                  </button>
                </div>
              ) : (
                publishedQuizzes.map((quiz) => (
                  <div key={quiz.id} className="card hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{quiz.title}</h3>
                          {quiz.pending_manual_reviews > 0 && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded">
                              {quiz.pending_manual_reviews} PENDING
                            </span>
                          )}
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${
                            quiz.quiz_type === 'FINAL_EXAM' ? 'bg-red-100 text-red-700' :
                            quiz.quiz_type === 'GRADED' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {quiz.quiz_type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{quiz.description || 'No description'}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
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
                            <FaUsers className="text-gray-400" />
                            <span className="text-gray-600">Attempts:</span>
                            <span className="font-medium text-gray-900">{quiz.total_attempts || 0}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaAward className="text-gray-400" />
                            <span className="text-gray-600">Avg Score:</span>
                            <span className="font-medium text-gray-900">{Math.round(quiz.average_score || 0)}%</span>
                          </div>
                        </div>
                        
                        {(quiz.start_date || quiz.end_date) && (
                          <div className="text-sm text-gray-600">
                            {quiz.start_date && <span>Starts: {new Date(quiz.start_date).toLocaleDateString()}</span>}
                            {quiz.start_date && quiz.end_date && <span className="mx-2">•</span>}
                            {quiz.end_date && <span>Ends: {new Date(quiz.end_date).toLocaleDateString()}</span>}
                          </div>
                        )}
                        
                        {/* Quiz ID for copying */}
                        <div className="mt-3 p-2 bg-gray-100 rounded-lg flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Quiz ID:</p>
                            <code className="text-xs font-mono text-gray-700 break-all">{quiz.id}</code>
                          </div>
                          <button
                            onClick={() => handleCopyQuizId(quiz.id)}
                            className={`ml-2 p-2 rounded transition-colors ${
                              copiedId === quiz.id
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                            }`}
                            title="Copy Quiz ID"
                          >
                            <FaCopy size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <button 
                          onClick={() => handleManageQuestions(quiz.id)}
                          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <FaEdit /> Manage Questions
                        </button>
                        <button 
                          onClick={() => handleViewResults(quiz.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <FaEye /> View Results
                        </button>
                        {quiz.pending_manual_reviews > 0 && (
                          <button 
                            onClick={() => handleGradePending(quiz.id)}
                            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                          >
                            <FaPencilAlt /> Grade ({quiz.pending_manual_reviews})
                          </button>
                        )}
                        <button 
                          onClick={() => handleEditQuiz(quiz)}
                          className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center justify-center gap-2"
                        >
                          <FaEdit /> Edit Quiz
                        </button>
                        <button 
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm flex items-center justify-center gap-2"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Draft Quizzes */}
          {selectedTab === 'drafts' && (
            <div className="space-y-4">
              {draftQuizzes.length === 0 ? (
                <div className="card text-center py-12">
                  <FaEdit className="mx-auto text-gray-400 text-5xl mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Draft Quizzes</h3>
                  <p className="text-gray-600">All your quizzes are published</p>
                </div>
              ) : (
                draftQuizzes.map((quiz) => (
                  <div key={quiz.id} className="card hover:shadow-lg transition-shadow opacity-75">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{quiz.title}</h3>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                            DRAFT
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{quiz.description || 'No description'}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
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
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <button 
                          onClick={() => handleManageQuestions(quiz.id)}
                          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <FaEdit /> Add Questions
                        </button>
                        <button 
                          onClick={() => handleEditQuiz(quiz)}
                          className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center justify-center gap-2"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm flex items-center justify-center gap-2"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
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
                          