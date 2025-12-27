import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaTimes, FaUser, FaClock, FaClipboardCheck, FaSave } from 'react-icons/fa';
import API from '../../api';

const GradeQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [grades, setGrades] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchPendingReviews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.quiz.getPendingReviews(quizId);
      setQuiz(response.data.quiz);
      setPendingReviews(response.data.pending_reviews || []);
      
      // Initialize grades and feedback
      const initialGrades = {};
      const initialFeedback = {};
      response.data.pending_reviews?.forEach(review => {
        initialGrades[review.answer_id] = review.earned_marks || 0;
        initialFeedback[review.answer_id] = review.feedback || '';
      });
      setGrades(initialGrades);
      setFeedback(initialFeedback);
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
      alert('Failed to load pending reviews');
      navigate('/teacher/quizzes');
    } finally {
      setLoading(false);
    }
  }, [quizId, navigate]);

  useEffect(() => {
    fetchPendingReviews();
  }, [fetchPendingReviews]);

  const handleGradeChange = (answerId, value) => {
    const currentReview = pendingReviews[currentReviewIndex];
    const maxMarks = currentReview.question_marks;
    const numValue = parseFloat(value);
    
    if (isNaN(numValue) || numValue < 0 || numValue > maxMarks) {
      return;
    }
    
    setGrades(prev => ({
      ...prev,
      [answerId]: numValue
    }));
  };

  const handleFeedbackChange = (answerId, value) => {
    setFeedback(prev => ({
      ...prev,
      [answerId]: value
    }));
  };

  const handleSaveGrade = async (answerId) => {
    setSaving(true);
    try {
      await API.quiz.gradeAnswer(answerId, {
        earned_marks: grades[answerId],
        teacher_feedback: feedback[answerId]
      });
      
      alert('Grade saved successfully!');
      
      // Move to next review or go back if this was the last one
      if (currentReviewIndex < pendingReviews.length - 1) {
        setCurrentReviewIndex(prev => prev + 1);
      } else {
        // Refresh to get updated list
        fetchPendingReviews();
        setCurrentReviewIndex(0);
      }
    } catch (error) {
      console.error('Error saving grade:', error);
      alert(error.response?.data?.message || 'Failed to save grade');
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    if (currentReviewIndex < pendingReviews.length - 1) {
      setCurrentReviewIndex(prev => prev + 1);
    } else {
      setCurrentReviewIndex(0);
    }
  };

  const handleQuickGrade = (answerId, percentage) => {
    const currentReview = pendingReviews[currentReviewIndex];
    const maxMarks = currentReview.question_marks;
    const grade = Math.round((maxMarks * percentage) / 100);
    setGrades(prev => ({
      ...prev,
      [answerId]: grade
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (!quiz || pendingReviews.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md text-center">
          <FaClipboardCheck className="mx-auto text-green-500 text-5xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h2>
          <p className="text-gray-600 mb-4">No pending reviews for this quiz.</p>
          <button onClick={() => navigate('/teacher/quizzes')} className="btn-primary">
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const currentReview = pendingReviews[currentReviewIndex];
  const progress = ((currentReviewIndex + 1) / pendingReviews.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <button 
          onClick={() => navigate('/teacher/quizzes')} 
          className="btn-secondary mb-6 flex items-center gap-2"
        >
          <FaArrowLeft /> Back to Quizzes
        </button>

        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-gray-600">Manual Grading</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Progress</div>
              <div className="text-2xl font-bold text-primary-600">
                {currentReviewIndex + 1} / {pendingReviews.length}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Student Info */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <FaUser className="text-primary-600 text-xl" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Student</div>
                <div className="font-semibold text-gray-900">{currentReview.student_name}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaClock className="text-blue-600 text-xl" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Submitted</div>
                <div className="font-semibold text-gray-900">
                  {new Date(currentReview.submitted_at).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaClipboardCheck className="text-green-600 text-xl" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Attempt</div>
                <div className="font-semibold text-gray-900">
                  #{currentReview.attempt_number}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question and Answer */}
        <div className="card mb-6">
          {/* Question */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {currentReview.question_text}
              </h2>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded">
                Max: {currentReview.question_marks} marks
              </span>
            </div>
            
            {currentReview.question_image && (
              <img 
                src={currentReview.question_image} 
                alt="Question" 
                className="max-w-full h-auto rounded-lg mb-4"
              />
            )}

            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="text-sm font-medium text-blue-900 mb-2">
                Student's Answer:
              </div>
              <div className="text-gray-900 whitespace-pre-wrap">
                {currentReview.text_answer || 'No answer provided'}
              </div>
            </div>

            {currentReview.question_explanation && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Expected Answer / Explanation:
                </div>
                <div className="text-gray-700">{currentReview.question_explanation}</div>
              </div>
            )}
          </div>

          {/* Grading Section */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade This Answer</h3>
            
            {/* Quick Grade Buttons */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Grade:
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleQuickGrade(currentReview.answer_id, 0)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium"
                >
                  0% (Incorrect)
                </button>
                <button
                  onClick={() => handleQuickGrade(currentReview.answer_id, 50)}
                  className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 font-medium"
                >
                  50% (Partial)
                </button>
                <button
                  onClick={() => handleQuickGrade(currentReview.answer_id, 75)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium"
                >
                  75% (Good)
                </button>
                <button
                  onClick={() => handleQuickGrade(currentReview.answer_id, 100)}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium"
                >
                  100% (Perfect)
                </button>
              </div>
            </div>

            {/* Manual Grade Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marks Awarded: *
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="0"
                  max={currentReview.question_marks}
                  step="0.5"
                  value={grades[currentReview.answer_id] || 0}
                  onChange={(e) => handleGradeChange(currentReview.answer_id, e.target.value)}
                  className="input w-32"
                />
                <span className="text-gray-600">
                  out of {currentReview.question_marks} marks
                </span>
                <span className={`ml-auto px-4 py-2 rounded-lg font-bold ${
                  (grades[currentReview.answer_id] / currentReview.question_marks) >= 0.75
                    ? 'bg-green-100 text-green-700'
                    : (grades[currentReview.answer_id] / currentReview.question_marks) >= 0.5
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {Math.round((grades[currentReview.answer_id] / currentReview.question_marks) * 100)}%
                </span>
              </div>
            </div>

            {/* Feedback */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback for Student: (Optional)
              </label>
              <textarea
                value={feedback[currentReview.answer_id] || ''}
                onChange={(e) => handleFeedbackChange(currentReview.answer_id, e.target.value)}
                placeholder="Provide constructive feedback to help the student improve..."
                className="input w-full"
                rows="4"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <button
                onClick={handleSkip}
                className="btn-secondary px-6"
              >
                Skip for Now
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setGrades(prev => ({ ...prev, [currentReview.answer_id]: 0 }));
                    setFeedback(prev => ({ ...prev, [currentReview.answer_id]: 'Answer does not meet requirements.' }));
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2"
                >
                  <FaTimes /> Mark Wrong
                </button>
                <button
                  onClick={() => handleSaveGrade(currentReview.answer_id)}
                  disabled={saving}
                  className="btn-primary px-8 flex items-center gap-2"
                >
                  <FaSave /> {saving ? 'Saving...' : 'Save & Next'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Help */}
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-2">Grading Tips:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Use quick grade buttons for faster grading</li>
            <li>• Provide constructive feedback to help students learn</li>
            <li>• You can skip answers and come back to them later</li>
            <li>• Grades are saved immediately and students will be notified</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GradeQuiz;
