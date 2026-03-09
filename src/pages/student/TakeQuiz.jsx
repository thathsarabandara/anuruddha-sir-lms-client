import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClock, FaCheck, FaExclamationTriangle, FaSave, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import API from '../../api';
import { getAbsoluteImageUrl } from '../../utils/helpers';

const TakeQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  
  const timerRef = useRef(null);
  const autoSaveTimerRef = useRef(null);
  const lastSaveRef = useRef({});

  const startQuizAttempt = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.quiz.startQuizAttempt(quizId);
      const attemptData = response.data;
      
      setQuiz(attemptData.quiz);
      setAttempt(attemptData.attempt);
      setQuestions(attemptData.questions || []);
      setTimeRemaining(attemptData.time_remaining || attemptData.quiz.time_limit * 60);
      
      // Load existing answers if resuming
      if (attemptData.existing_answers) {
        setAnswers(attemptData.existing_answers);
        lastSaveRef.current = attemptData.existing_answers;
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
      alert(error.response?.data?.message || 'Failed to start quiz');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }, [quizId, navigate]);

  const saveAnswersToServer = useCallback(async () => {
    if (!attempt) return;
    
    // Check if there are new answers to save
    const hasNewAnswers = Object.keys(answers).some(
      key => answers[key] !== lastSaveRef.current[key]
    );
    
    if (!hasNewAnswers) return;
    
    setAutoSaving(true);
    try {
      await API.quiz.saveQuizAnswer({
        attempt_id: attempt.id,
        answers: answers
      });
      lastSaveRef.current = { ...answers };
    } catch (error) {
      console.error('Error auto-saving:', error);
    } finally {
      setAutoSaving(false);
    }
  }, [attempt, answers]);

  const handleSubmit = useCallback(async (autoSubmit = false) => {
    if (!autoSubmit) {
      const confirmed = confirm('Are you sure you want to submit your quiz? You cannot change your answers after submission.');
      if (!confirmed) return;
    }
    
    setSubmitting(true);
    try {
      // Save any unsaved answers first
      await saveAnswersToServer();
      
      // Submit the quiz
      const response = await API.quiz.submitQuizAttempt(attempt.id, {
        tab_switches: tabSwitchCount
      });
      
      // Navigate to results if available
      if (response.data.show_results) {
        navigate(`/student/quiz/${quizId}/results/${attempt.id}`);
      } else {
        alert('Quiz submitted successfully! Results will be available after review.');
        navigate('/student/quizzes');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert(error.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  }, [attempt, saveAnswersToServer, tabSwitchCount, quizId, navigate]);

  useEffect(() => {
    startQuizAttempt();
    
    // Detect tab/window visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden && attempt) {
        setTabSwitchCount(prev => prev + 1);
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Prevent page refresh
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current);
    };
  }, [startQuizAttempt, attempt]); // Now includes startQuizAttempt and attempt

  useEffect(() => {
    if (attempt && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmit(true); // Auto-submit when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [attempt, timeRemaining, handleSubmit]); // Now includes handleSubmit

  useEffect(() => {
    if (attempt) {
      // Auto-save every 30 seconds
      autoSaveTimerRef.current = setInterval(() => {
        saveAnswersToServer();
      }, 30000);
    }
    
    return () => {
      if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current);
    };
  }, [attempt, saveAnswersToServer]); // Now includes saveAnswersToServer

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleMultipleChoiceToggle = (questionId, optionId) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (current.includes(optionId)) {
        return { ...prev, [questionId]: current.filter(id => id !== optionId) };
      } else {
        return { ...prev, [questionId]: [...current, optionId] };
      }
    });
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).filter(qId => {
      const answer = answers[qId];
      if (Array.isArray(answer)) return answer.length > 0;
      return answer !== null && answer !== undefined && answer !== '';
    }).length;
  };

  if (loading) {
    return (
      <div className="p-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-72 bg-gray-200 rounded-lg animate-pulse mb-3"></div>
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Quiz Info Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="bg-white border rounded-lg p-6 mb-6">
              <div className="h-6 w-1/2 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="space-y-2">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-3 w-full bg-gray-100 rounded animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white border rounded-lg p-6 sticky top-6">
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz || !attempt || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md text-center">
          <FaExclamationTriangle className="mx-auto text-red-500 text-5xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Not Available</h2>
          <p className="text-gray-600 mb-4">Unable to load quiz. Please try again.</p>
          <button onClick={() => navigate('/student/quizzes')} className="btn-primary">
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Warning Toast */}
      {showWarning && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <FaExclamationTriangle />
          <span>Tab switch detected! ({tabSwitchCount})</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-sm text-gray-600">{quiz.course_title}</p>
            </div>
            
            <div className="flex items-center gap-4">
              {autoSaving && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaSave className="animate-pulse" />
                  <span>Saving...</span>
                </div>
              )}
              
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                <FaClock />
                <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
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
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{getAnsweredCount()} answered</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="card mb-6">
          {/* Question */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Q{currentQuestionIndex + 1}. {currentQuestion.question_text}
              </h2>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded">
                {currentQuestion.marks} marks
              </span>
            </div>
            
            {currentQuestion.image && (
              <img 
                src={getAbsoluteImageUrl(currentQuestion.image)} 
                alt="Question" 
                className="max-w-full h-auto rounded-lg mb-4 border border-gray-200"
              />
            )}
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.question_type === 'MCQ_SINGLE' && (
              currentQuestion.options.map((option) => (
                <label 
                  key={option.id}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    answers[currentQuestion.id] === option.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option.id}
                    checked={answers[currentQuestion.id] === option.id}
                    onChange={() => handleAnswerChange(currentQuestion.id, option.id)}
                    className="w-5 h-5 text-primary-600"
                  />
                  <span className="ml-3 flex-1">{option.option_text}</span>
                </label>
              ))
            )}

            {currentQuestion.question_type === 'MCQ_MULTIPLE' && (
              currentQuestion.options.map((option) => (
                <label 
                  key={option.id}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    (answers[currentQuestion.id] || []).includes(option.id)
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={(answers[currentQuestion.id] || []).includes(option.id)}
                    onChange={() => handleMultipleChoiceToggle(currentQuestion.id, option.id)}
                    className="w-5 h-5 text-primary-600 rounded"
                  />
                  <span className="ml-3 flex-1">{option.option_text}</span>
                </label>
              ))
            )}

            {currentQuestion.question_type === 'TRUE_FALSE' && (
              ['True', 'False'].map((option, index) => (
                <label 
                  key={index}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    answers[currentQuestion.id] === (index === 0)
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={index === 0}
                    checked={answers[currentQuestion.id] === (index === 0)}
                    onChange={() => handleAnswerChange(currentQuestion.id, index === 0)}
                    className="w-5 h-5 text-primary-600"
                  />
                  <span className="ml-3 flex-1 font-medium">{option}</span>
                </label>
              ))
            )}

            {currentQuestion.question_type === 'SHORT_ANSWER' && (
              <input
                type="text"
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="Enter your answer..."
                className="input w-full"
                maxLength={500}
              />
            )}

            {currentQuestion.question_type === 'LONG_ANSWER' && (
              <textarea
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="Enter your answer..."
                className="input w-full"
                rows="6"
                maxLength={2000}
              />
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="btn-secondary flex items-center gap-2"
          >
            <FaArrowLeft /> Previous
          </button>

          <div className="flex gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-primary-600 text-white'
                    : answers[questions[index].id]
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="btn-primary flex items-center gap-2 px-6"
            >
              <FaCheck /> {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
              className="btn-primary flex items-center gap-2"
            >
              Next <FaArrowRight />
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 card bg-yellow-50 border-yellow-200">
          <h3 className="font-semibold text-gray-900 mb-2">Important Notes:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Your answers are being auto-saved every 30 seconds</li>
            <li>• Don't refresh the page or switch tabs frequently</li>
            <li>• Tab switches are being monitored: {tabSwitchCount} detected</li>
            <li>• Quiz will auto-submit when time runs out</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
