import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaGripVertical, FaClipboardList, FaBook, FaSearch } from 'react-icons/fa';
import API from '../../api';
import QuestionModal from '../../components/teacher/QuestionModal';
import Notification from '../../components/common/Notification';
import { BiLoader } from 'react-icons/bi';
import { getAbsoluteImageUrl } from '../../utils/helpers';

const ManageQuestions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [bankQuestions, setBankQuestions] = useState([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasAttempts, setHasAttempts] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const fetchQuizData = useCallback(async () => {
    setLoading(true);
    try {
      const [questionsResponse] = await Promise.all([
        API.quiz.teacherQuizAPI.getQuizQuestions(quizId),
      ]);
      setQuestions(questionsResponse.data.questions || []);
      setHasAttempts(questionsResponse.data.has_attempts || false);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      setNotification({
        type: 'error',
        message: 'Failed to load quiz questions',
      });
    } finally {
      setLoading(false);
    }
  }, [quizId]);


  useEffect(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  const handleAddQuestion = () => {
    if (hasAttempts) {
      setNotification({
        type: 'warning',
        message: 'Cannot add questions after students have started taking the quiz.',
      });
      return;
    }
    setEditingQuestion(null);
    setShowQuestionModal(true);
  };

  const handleEditQuestion = (question) => {
    if (hasAttempts) {
      setNotification({
        type: 'warning',
        message: 'Cannot edit questions after students have started taking the quiz.',
      });
      return;
    }
    setEditingQuestion(question);
    setShowQuestionModal(true);
  };

  const handleDeleteQuestion = async (questionId) => {
    if (hasAttempts) {
      setNotification({
        type: 'warning',
        message: 'Cannot delete questions after students have started taking the quiz.',
      });
      return;
    }

    setShowDeleteConfirm(questionId);
  };

  const confirmDeleteQuestion = async () => {
    if (!showDeleteConfirm) return;

    try {
      await API.quiz.teacherQuizAPI.deleteQuestion(showDeleteConfirm);
      setNotification({
        type: 'success',
        message: 'Question deleted successfully',
      });
      fetchQuizData();
    } catch (error) {
      console.error('Error deleting question:', error);
      setNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to delete question',
      });
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const handleQuestionSaved = () => {
    fetchQuizData();
    setShowQuestionModal(false);
    setEditingQuestion(null);
    setNotification({
      type: 'success',
      message: 'Question saved successfully',
    });
  };

  const handleAddFromBank = async (bankQuestionId) => {
    try {
      await API.quiz.teacherQuizAPI.addQuestionToQuiz(quizId, { question_bank_question_id: bankQuestionId });
      fetchQuizData();
      setNotification({
        type: 'success',
        message: 'Question added successfully!',
      });
    } catch (error) {
      console.error('Error adding question:', error);
      setNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to add question',
      });
    }
  };

  const getQuestionTypeLabel = (type) => {
    const labels = {
      'MCQ_SINGLE': 'Single Choice',
      'MCQ_MULTIPLE': 'Multiple Choice',
      'TRUE_FALSE': 'True/False',
      'SHORT_ANSWER': 'Short Answer',
      'LONG_ANSWER': 'Long Answer'
    };
    return labels[type] || type;
  };

  const filteredBankQuestions = bankQuestions.filter(q =>
    q.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.tags?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse mb-3"></div>
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 pb-4">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>

        {/* Questions List Skeleton */}
        <div className="space-y-4">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="h-6 w-3/4 bg-gray-200 rounded-lg animate-pulse mb-3"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-3"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
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
      {/* Notifications */}
      {notification && (
        <div className="mb-6">
          <Notification
            message={notification.message}
            type={notification.type}
            duration={notification.type === 'error' ? 0 : 5000}
            onClose={() => setNotification(null)}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Question?</h3>
            <p className="text-gray-600 text-sm mb-6">
              This action cannot be undone. The question will be permanently removed from the quiz.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteQuestion}
                className="px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Questions</h1>
            {hasAttempts && (
              <div className="mt-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg inline-flex items-center gap-2">
                <FaClipboardList />
                <span className="text-sm font-medium">
                  Students have started this quiz. Questions cannot be modified.
                </span>
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setShowBankModal(true)} 
              className="btn-secondary px-6 flex items-center gap-2"
            >
              <FaBook /> Add from Bank
            </button>
            <button 
              onClick={handleAddQuestion} 
              className="btn-primary px-6 flex items-center gap-2"
              disabled={hasAttempts}
            >
              <FaPlus /> Add Question
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Total Questions</div>
          <div className="text-2xl font-bold text-gray-900">{questions.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Total Marks</div>
          <div className="text-2xl font-bold text-primary-600">
            {questions.reduce((sum, q) => sum + parseFloat(q.marks || 0), 0)}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Auto-Graded</div>
          <div className="text-2xl font-bold text-green-600">
            {questions.filter(q => ['MCQ_SINGLE', 'MCQ_MULTIPLE', 'TRUE_FALSE'].includes(q.question_type)).length}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Manual Review</div>
          <div className="text-2xl font-bold text-yellow-600">
            {questions.filter(q => ['SHORT_ANSWER', 'LONG_ANSWER'].includes(q.question_type)).length}
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="card text-center py-12">
            <FaClipboardList className="mx-auto text-gray-400 text-5xl mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Questions Yet</h3>
            <p className="text-gray-600 mb-4">Add questions to your quiz to get started</p>
            <div className="flex justify-center gap-3">
              <button onClick={handleAddQuestion} className="btn-primary">
                <FaPlus className="inline mr-2" /> Add Question
              </button>
              <button onClick={() => setShowBankModal(true)} className="btn-secondary">
                <FaBook className="inline mr-2" /> Add from Bank
              </button>
            </div>
          </div>
        ) : (
          questions.map((question, index) => (
            <div key={question.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                {/* Drag Handle */}
                {!hasAttempts && (
                  <button 
                    className="text-gray-400 hover:text-gray-600 cursor-move mt-2"
                    title="Drag to reorder"
                  >
                    <FaGripVertical size={20} />
                  </button>
                )}
                
                {/* Question Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold text-gray-900">Q{index + 1}.</span>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {question.question_text}
                        </h3>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded">
                          {getQuestionTypeLabel(question.question_type)}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded">
                          {question.marks} marks
                        </span>
                        {question.difficulty && (
                          <span className={`px-3 py-1 text-sm font-medium rounded ${
                            question.difficulty === 'HARD' ? 'bg-red-100 text-red-700' :
                            question.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {question.difficulty}
                          </span>
                        )}
                        {question.tags && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                            {question.tags}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditQuestion(question)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                        disabled={hasAttempts}
                        title="Edit Question"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        disabled={hasAttempts}
                        title="Delete Question"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Question Image */}
                  {question.image && (
                    <img 
                      src={getAbsoluteImageUrl(question.image)} 
                      alt="Question" 
                      className="max-w-md h-auto rounded-lg mb-3 border border-gray-200"
                    />
                  )}

                  {/* Options Preview for MCQ */}
                  {(question.question_type === 'MCQ_SINGLE' || 
                    question.question_type === 'MCQ_MULTIPLE' ||
                    question.question_type === 'TRUE_FALSE') && (
                    <div className="space-y-2">
                      {question.options?.map((option) => (
                        <div 
                          key={option.id}
                          className={`p-2 rounded border ${
                            option.is_correct 
                              ? 'bg-green-50 border-green-300' 
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {option.is_correct && <span className="text-green-600">✓</span>}
                            <span className="text-sm">{option.option_text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Explanation */}
                  {question.explanation && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-blue-900">Explanation: </span>
                      <span className="text-sm text-blue-800">{question.explanation}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Question Modal */}
      {showQuestionModal && (
        <QuestionModal
          isOpen={showQuestionModal}
          onClose={() => {
            setShowQuestionModal(false);
            setEditingQuestion(null);
          }}
          onSave={handleQuestionSaved}
          question={editingQuestion}
          quizId={quizId}
        />
      )}

      {/* Question Bank Modal */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold">Add from Question Bank</h2>
              <button 
                onClick={() => {
                  setShowBankModal(false);
                  setSelectedBank(null);
                  setBankQuestions([]);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">

                <div>
                  {/* Back Button */}
                  <button 
                    onClick={() => {
                      setSelectedBank(null);
                      setBankQuestions([]);
                      setSearchTerm('');
                    }}
                    className="btn-secondary mb-4 flex items-center gap-2"
                  >
                    <FaArrowLeft /> Back to Banks
                  </button>

                  <h3 className="font-semibold text-gray-900 mb-4">{selectedBank.title}</h3>

                  {/* Search */}
                  <div className="relative mb-4">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search questions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* Questions */}
                  <div className="space-y-3">
                    {filteredBankQuestions.length === 0 ? (
                      <div className="text-center py-8 text-gray-600">
                        No questions found
                      </div>
                    ) : (
                      filteredBankQuestions.map((question) => (
                        <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 mb-2">
                                {question.question_text}
                              </p>
                              <div className="flex gap-2 mb-2">
                                <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                                  {getQuestionTypeLabel(question.question_type)}
                                </span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  {question.marks} marks
                                </span>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleAddFromBank(question.id)}
                              className="btn-primary px-4 py-2 text-sm"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuestions;
