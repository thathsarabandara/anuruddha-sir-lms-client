import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClock, FaCheck, FaExclamationTriangle, FaSave, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Notification from '../../components/common/Notification';
import ButtonWithLoader from '../../components/common/ButtonWithLoader';

const dummyQuizData = {
  quiz: {
    id: 1,
    title: 'Sample Quiz',
    description: 'Test your knowledge',
    time_limit: 30,
    total_marks: 100,
    passing_score: 60,
  },
  attempt: { id: 'attempt-001', student_id: 1, quiz_id: 1 },
  questions: [
    { id: 1, question_text: 'What is 2+2?', question_type: 'MCQ_SINGLE', marks: 10, options: [{ id: 1, option_text: '4' }, { id: 2, option_text: '5' }] },
    { id: 2, question_text: 'True or False: JS is a language', question_type: 'TRUE_FALSE', marks: 10, options: [{ id: 3, option_text: 'True' }, { id: 4, option_text: 'False' }] },
  ],
  existing_answers: {},
  time_remaining: 1800,
};

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
  const [_tabSwitchCount, _setTabSwitchCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [notification, setNotification] = useState(null);
  const timerRef = useRef(null);
  const autoSaveTimerRef = useRef(null);
  const lastSaveRef = useRef({});

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  const startQuizAttempt = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const attemptData = dummyQuizData;
      setQuiz(attemptData.quiz);
      setAttempt(attemptData.attempt);
      setQuestions(attemptData.questions || []);
      setTimeRemaining(attemptData.time_remaining || attemptData.quiz.time_limit * 60);
      if (attemptData.existing_answers) {
        setAnswers(attemptData.existing_answers);
        lastSaveRef.current = attemptData.existing_answers;
      }
      setLoading(false);
    }, 500);
  }, []);

  const saveAnswersToServer = useCallback(() => {
    if (!attempt) return;
    const hasNewAnswers = Object.keys(answers).some(key => answers[key] !== lastSaveRef.current[key]);
    if (!hasNewAnswers) return;
    setAutoSaving(true);
    setTimeout(() => {
      lastSaveRef.current = { ...answers };
      setAutoSaving(false);
    }, 300);
  }, [attempt, answers]);

  const handleSubmit = useCallback((autoSubmit = false) => {
    if (!autoSubmit) {
      const confirmed = confirm('Are you sure you want to submit your quiz?');
      if (!confirmed) return;
    }
    setSubmitting(true);
    setTimeout(() => {
      showNotification('Quiz submitted successfully!', 'success');
      setSubmitting(false);
      navigate(`/student/quiz/${quizId}/results/${attempt.id}`);
    }, 500);
  }, [attempt, quizId, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      startQuizAttempt();
    }, 0);
    
    const handleVisibilityChange = () => {
      if (document.hidden && attempt) {
        _setTabSwitchCount(prev => prev + 1);
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current);
    };
  }, [startQuizAttempt, attempt]);

  useEffect(() => {
    if (attempt && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [attempt, timeRemaining, handleSubmit]);

  useEffect(() => {
    if (attempt) {
      autoSaveTimerRef.current = setInterval(() => {
        saveAnswersToServer();
      }, 30000);
    }
    return () => {
      if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current);
    };
  }, [attempt, saveAnswersToServer]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div></div>;
  }

  if (!quiz) {
    return <div className="flex flex-col items-center justify-center min-h-screen"><h1 className="text-2xl font-bold mb-4">Quiz not found</h1><button onClick={() => navigate('/student/quizzes')} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Back to Quizzes</button></div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div><h1 className="text-2xl font-bold">{quiz.title}</h1><p className="text-sm text-gray-600 mt-1">{currentQuestionIndex + 1} of {questions.length}</p></div>
            <div className="flex items-center gap-2 text-lg font-semibold text-red-600"><FaClock /> {formatTime(timeRemaining)}</div>
          </div>
        </div>

        {showWarning && (<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center gap-3"><FaExclamationTriangle className="text-yellow-600" /><span>Tab switch detected.</span></div>)}

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-xl font-semibold mb-6">{currentQuestion?.question_text}</h2>

          {currentQuestion?.question_type === 'MCQ_SINGLE' && (<div className="space-y-3">{currentQuestion?.options?.map(option => (<label key={option.id} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"><input type="radio" name="answer" value={option.id} checked={answers[currentQuestion?.id] === option.id} onChange={() => handleAnswerChange(currentQuestion?.id, option.id)} className="w-4 h-4" /><span className="ml-3">{option.option_text}</span></label>))}</div>)}

          {currentQuestion?.question_type === 'TRUE_FALSE' && (<div className="space-y-3">{currentQuestion?.options?.map(option => (<label key={option.id} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"><input type="radio" name="answer" value={option.id} checked={answers[currentQuestion?.id] === option.id} onChange={() => handleAnswerChange(currentQuestion?.id, option.id)} className="w-4 h-4" /><span className="ml-3">{option.option_text}</span></label>))}</div>)}

          {currentQuestion?.question_type === 'MCQ_MULTIPLE' && (<div className="space-y-3">{currentQuestion?.options?.map(option => (<label key={option.id} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"><input type="checkbox" checked={(answers[currentQuestion?.id] || []).includes(option.id)} onChange={() => handleMultipleChoiceToggle(currentQuestion?.id, option.id)} className="w-4 h-4" /><span className="ml-3">{option.option_text}</span></label>))}</div>)}

          {(['SHORT_ANSWER', 'LONG_ANSWER'].includes(currentQuestion?.question_type)) && (<textarea value={answers[currentQuestion?.id] || ''} onChange={(e) => handleAnswerChange(currentQuestion?.id, e.target.value)} placeholder="Type your answer..." rows={currentQuestion?.question_type === 'LONG_ANSWER' ? 8 : 3} className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />)}
        </div>

        <div className="flex items-center justify-between">
          <button onClick={() => currentQuestionIndex > 0 && setCurrentQuestionIndex(currentQuestionIndex - 1)} disabled={currentQuestionIndex === 0} className="flex items-center gap-2 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"><FaArrowLeft /> Previous</button>
          <ButtonWithLoader 
            label="Save"
            loadingLabel="Saving..."
            isLoading={autoSaving}
            onClick={() => saveAnswersToServer()}
            icon={<FaSave />}
            variant="success"
          />
          <div className="space-x-2">
            {currentQuestionIndex < questions.length - 1 && (<button onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)} className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Next <FaArrowRight /></button>)}
            {currentQuestionIndex === questions.length - 1 && (
              <ButtonWithLoader 
                label="Submit"
                loadingLabel="Submitting..."
                isLoading={submitting}
                onClick={() => handleSubmit()}
                icon={<FaCheck />}
                variant="secondary"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
