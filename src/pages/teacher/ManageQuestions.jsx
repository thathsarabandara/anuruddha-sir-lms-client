import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaGripVertical, FaClipboardList, FaBook, FaSearch, FaCheckDouble, FaPencilAlt, FaBrain } from 'react-icons/fa';
import QuestionModal from '../../components/teacher/QuestionModal';
import Notification from '../../components/common/Notification';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import { quizAPI } from '../../api/quiz';

const ManageQuestions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  // Actual state from API
  const [questionsStats, setQuestionsStats] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [hasAttempts, setHasAttempts] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  
  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };
  
  const fetchQuizData = useCallback(async () => {
    try {
      setLoading(true);
      setStatsLoading(true);

      // Fetch questions
      const questionsResponse = await quizAPI.getQuizQuestions(quizId);
      const questionsData = questionsResponse.data?.data || [];
      setQuestions(questionsData);

      // Fetch question stats
      const statsResponse = await quizAPI.getQuizQuestionStats(quizId);
      const statsData = statsResponse.data?.data || null;
      setQuestionsStats(statsData);

      // Check if quiz has attempts (would prevent modifications)
      // This could be added to the stats endpoint if needed
      setHasAttempts(false);
    } catch (err) {
      console.error('Error fetching quiz data:', err);
      showNotification('Failed to load quiz questions', 'error');
    } finally {
      setLoading(false);
      setStatsLoading(false);
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
      await quizAPI.deleteQuestion(showDeleteConfirm);
      setQuestions(questions.filter(q => q.question_id !== showDeleteConfirm));
      setNotification({
        type: 'success',
        message: 'Question deleted successfully',
      });
      // Refresh stats after deletion
      fetchQuizData();
    } catch (err) {
      console.error('Error deleting question:', err);
      setNotification({
        type: 'error',
        message: 'Failed to delete question',
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

  // Drag and Drop Handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Create new array with reordered questions
    const newQuestions = [...questions];
    const draggedQuestion = newQuestions[draggedIndex];
    
    // Remove from old position
    newQuestions.splice(draggedIndex, 1);
    // Insert at new position
    newQuestions.splice(dropIndex, 0, draggedQuestion);
    
    // Update state locally first
    setQuestions(newQuestions);

    try {
      // Send reorder to backend API
      const reorderedData = newQuestions.map((q, idx) => ({
        question_id: q.question_id,
        question_order: idx + 1,
      }));
      
      await quizAPI.updateQuestionOrder(quizId, reorderedData);
      
      setNotification({
        type: 'success',
        message: 'Questions reordered successfully',
      });
    } catch (err) {
      console.error('Error reordering questions:', err);
      setNotification({
        type: 'error',
        message: 'Failed to reorder questions',
      });
      // Refresh to get correct order from backend
      fetchQuizData();
    } finally {
      setDraggedIndex(null);
      setDragOverIndex(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const questionsStatsConfig = [
    {
      label: 'Total Questions',
      statsKey: 'total_questions',
      icon: FaClipboardList,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'questions in quiz',
    },
    {
      label: 'Total Marks',
      statsKey: 'total_marks',
      icon: FaBrain,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'maximum marks',
    },
    {
      label: 'Auto-Graded',
      statsKey: 'auto_graded',
      icon: FaCheckDouble,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'auto-grading',
    },
    {
      label: 'Manual Review',
      statsKey: 'manual_review',
      icon: FaPencilAlt,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      description: 'needs review',
    },
  ];

  // DataTable columns for questions
  const questionsColumns = [
    {
      key: 'question_text',
      label: 'Question',
      searchable: true,
      render: (_, row) => (
        <div>
          <p className="font-medium text-gray-900">Q{row.question_order || '?'}. {row.question_text}</p>
        </div>
      ),
    },
    {
      key: 'question_type',
      label: 'Type',
      render: (_, row) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded">
          {row.question_type?.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'points',
      label: 'Marks',
      render: (_, row) => <span className="text-sm font-medium text-gray-900">{row.points || 1}</span>,
    },
    {
      key: 'difficulty',
      label: 'Difficulty',
      render: (_, row) => (
        <span className={`px-3 py-1 text-sm font-medium rounded ${
          row.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
          row.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-green-100 text-green-700'
        }`}>
          {row.difficulty || 'medium'}
        </span>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (_, row) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded">
          {row.category || '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditQuestion(row)}
            className="text-blue-600 hover:text-blue-800 font-medium"
            title="Edit question"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDeleteQuestion(row.question_id)}
            className="text-red-600 hover:text-red-800 font-medium"
            title="Delete question"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

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
            {!isEditingOrder && (
              <button 
                onClick={() => setIsEditingOrder(true)} 
                className="btn-secondary px-6 flex items-center gap-2"
                disabled={hasAttempts || questions.length === 0}
              >
                <FaGripVertical /> Edit Order
              </button>
            )}
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
      {questionsStats && (
        <div className="mb-8">
          <StatCard stats={questionsStats} metricsConfig={questionsStatsConfig} loading={statsLoading} />
        </div>
      )}

      {/* Questions DataTable */}
      {!isEditingOrder && (
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Questions List</h2>
          <DataTable
            data={questions}
            columns={questionsColumns}
            config={{
              itemsPerPage: 10,
              searchPlaceholder: 'Search by question text...',
              hideSearch: false,
            }}
            loading={loading}
          />
        </div>
      )}

      {/* Draggable Questions List - Edit Order Mode */}
      {isEditingOrder && (
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Reorder Questions (Drag & Drop)</h2>
          <button 
            onClick={() => {
              setIsEditingOrder(false);
              setDraggedIndex(null);
              setDragOverIndex(null);
              setNotification({
                type: 'success',
                message: 'Question order updated successfully',
              });
            }} 
            className="btn-primary px-6 flex items-center gap-2"
          >
            <FaCheckDouble /> Save Order
          </button>
        </div>
        {questions.length === 0 ? (
          <div className="card text-center py-12">
            <FaClipboardList className="mx-auto text-gray-400 text-5xl mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Questions Yet</h3>
            <p className="text-gray-600 mb-4">Add questions to your quiz to get started</p>
            <div className="flex justify-center gap-3">
              <button onClick={handleAddQuestion} className="btn-primary">
                <FaPlus className="inline mr-2" /> Add Question
              </button>
            </div>
          </div>
        ) : (
          questions.map((question, index) => (
            <div 
              key={question.question_id} 
              draggable={true}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`card hover:shadow-lg transition-all cursor-move ${
                draggedIndex === index ? 'opacity-50 bg-gray-50' : ''
              } ${
                dragOverIndex === index && draggedIndex !== null ? 'border-2 border-blue-400 bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Drag Handle */}
                <div 
                  className="text-gray-400 hover:text-gray-600 cursor-move flex-shrink-0"
                  title="Drag to reorder questions"
                >
                  <FaGripVertical size={24} />
                </div>
                
                {/* Question Content - Simplified */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-900 min-w-fit">Q{index + 1}.</span>
                    <h3 className="text-base font-semibold text-gray-900">
                      {question.question_text}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 mt-2 ml-12">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                      {question.points || 1} marks
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      )}

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
          onNotification={showNotification}
        />
      )}
    </div>
  );
};

export default ManageQuestions;
