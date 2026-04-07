import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaClock, FaCheck, FaExclamationTriangle, FaSave, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Notification from '../../components/common/Notification';
import ButtonWithLoader from '../../components/common/ButtonWithLoader';
import { quizAPI } from '../../api/quiz';

const QUESTION_TYPES = {
  SINGLE: 'multiple_choice',
  MULTIPLE: 'multiple_answer',
  SHORT: 'short_answer',
  LONG: 'essay',
};

const normalizeQuestionType = (rawType) => {
  if (!rawType) return '';
  const type = String(rawType).toLowerCase();

  if (type === 'mcq_single' || type === 'true_false') return QUESTION_TYPES.SINGLE;
  if (type === 'mcq_multiple') return QUESTION_TYPES.MULTIPLE;
  if (type === 'long_answer') return QUESTION_TYPES.LONG;
  if (type === 'short_answer') return QUESTION_TYPES.SHORT;

  return type;
};

const serializeAnswer = (value) => {
  if (Array.isArray(value)) {
    return [...value].map(String).sort().join(',');
  }
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const buildAnswerPayload = (question, value) => {
  const questionId = question?.question_id || question?.id;
  if (!questionId) return null;

  const questionType = normalizeQuestionType(question?.question_type);
  if (questionType === QUESTION_TYPES.MULTIPLE) {
    const normalized = Array.isArray(value) ? value : [];
    if (normalized.length === 0) return null;
    return {
      question_id: questionId,
      answer: normalized.map(String).join(','),
    };
  }

  if (questionType === QUESTION_TYPES.SINGLE) {
    if (value === null || value === undefined || value === '') return null;
    return {
      question_id: questionId,
      answer: String(value),
    };
  }

  const textValue = serializeAnswer(value);
  if (!textValue) return null;

  return {
    question_id: questionId,
    answer: textValue,
  };
};

const parseSavedAnswer = (questionType, savedValue) => {
  if (questionType === QUESTION_TYPES.MULTIPLE) {
    if (Array.isArray(savedValue)) return savedValue.map(String);
    if (!savedValue) return [];
    return String(savedValue)
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
  }

  if (savedValue === null || savedValue === undefined) {
    return '';
  }

  return String(savedValue);
};

const TakeQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = new URLSearchParams(location.search).get('course_id');
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
  const timerDeadlineRef = useRef(null);
  const submitHandlerRef = useRef(null);
  const autoSaveTimerRef = useRef(null);
  const lastSaveRef = useRef({});
  const dirtyAnswersRef = useRef(new Set());
  const autoSubmittedRef = useRef(false);

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  const startQuizAttempt = useCallback(async () => {
    setLoading(true);

    try {
      const quizResponse = await quizAPI.getQuizDetails(quizId);
      let attemptResponse = null;

      try {
        // Required flow: always attempt to create/validate an attempt first.
        attemptResponse = await quizAPI.startQuizAttempt(quizId, courseId);
      } catch (startError) {
        // If an attempt already exists, resume it instead of failing.
        if (startError?.status === 409) {
          attemptResponse = await quizAPI.getActiveAttempt(quizId);
          showNotification('Resumed your in-progress quiz attempt.', 'info', 3000);
        } else {
          throw startError;
        }
      }

      const quizData = quizResponse?.data?.data || {};
      const attemptData = attemptResponse?.data?.data || {};
      const quizQuestions = Array.isArray(attemptData?.questions) ? attemptData.questions : [];
      const savedAnswers = attemptData?.saved_answers || {};

      setQuiz({
        id: quizData.quiz_id || quizData.id || quizId,
        title: quizData.title || 'Quiz',
        description: quizData.description || '',
        duration_minutes: Number(quizData.duration_minutes || quizData.time_limit_minutes || 0),
        passing_score: Number(quizData.passing_score || 0),
      });
      setAttempt(attemptData);
      setQuestions(quizQuestions);
      setCurrentQuestionIndex(0);

      const expiresAt = attemptData?.expires_at ? new Date(attemptData.expires_at).getTime() : null;
      const durationSeconds = Number(quizData.duration_minutes || quizData.time_limit_minutes || 0) * 60;
      const now = Date.now();
      const computedRemaining = expiresAt
        ? Math.max(0, Math.floor((expiresAt - now) / 1000))
        : Math.max(0, durationSeconds);

      timerDeadlineRef.current = now + (computedRemaining * 1000);
      setTimeRemaining(computedRemaining);

      const initialAnswers = {};
      quizQuestions.forEach((question) => {
        const questionId = question?.question_id || question?.id;
        if (!questionId) return;
        const type = normalizeQuestionType(question?.question_type);
        initialAnswers[questionId] = parseSavedAnswer(type, savedAnswers[questionId]);
      });

      setAnswers(initialAnswers);
      dirtyAnswersRef.current = new Set();
      lastSaveRef.current = Object.fromEntries(
        Object.entries(initialAnswers).map(([key, value]) => [key, serializeAnswer(value)])
      );

      if (quizQuestions.length === 0) {
        showNotification('This quiz has no questions yet.', 'warning');
      }
    } catch (error) {
      showNotification(error?.message || 'Failed to start quiz attempt', 'error');
      setQuiz(null);
    } finally {
      setLoading(false);
    }
  }, [quizId, courseId]);

  const saveSingleAnswer = useCallback(async (questionId) => {
    if (!attempt?.attempt_id) return false;

    const question = questions.find((q) => (q.question_id || q.id) === questionId);
    if (!question) return false;

    const value = answers[questionId];
    const payload = buildAnswerPayload(question, value);
    if (!payload) {
      dirtyAnswersRef.current.delete(questionId);
      return false;
    }

    await quizAPI.saveAnswer(attempt.attempt_id, payload);

    const serialized = serializeAnswer(value);
    lastSaveRef.current[questionId] = serialized;
    dirtyAnswersRef.current.delete(questionId);
    return true;
  }, [attempt, answers, questions]);

  const saveAnswersToServer = useCallback(async (showSavedToast = true) => {
    if (!attempt?.attempt_id) return;

    const dirtyIds = [...dirtyAnswersRef.current];
    if (dirtyIds.length === 0) {
      if (showSavedToast) showNotification('No new answers to save.', 'info', 2500);
      return;
    }

    setAutoSaving(true);

    try {
      for (const questionId of dirtyIds) {
        await saveSingleAnswer(questionId);
      }

      if (showSavedToast) {
        showNotification('Answers saved successfully.', 'success', 2500);
      }
    } catch (error) {
      showNotification(error?.message || 'Failed to save answers', 'error');
    } finally {
      setAutoSaving(false);
    }
  }, [attempt, saveSingleAnswer]);

  const handleSubmit = useCallback(async (autoSubmit = false) => {
    if (!attempt?.attempt_id || submitting) return;

    if (!autoSubmit) {
      const confirmed = confirm('Are you sure you want to submit your quiz?');
      if (!confirmed) return;
    }

    setSubmitting(true);

    try {
      await saveAnswersToServer(false);
      await quizAPI.submitQuiz(attempt.attempt_id);

      showNotification(
        autoSubmit ? 'Time is up. Quiz submitted automatically.' : 'Quiz submitted successfully!',
        'success'
      );
      autoSubmittedRef.current = true;

      navigate(`/student/quiz/${quizId}/results/${attempt.attempt_id}`);
    } catch (error) {
      showNotification(error?.message || 'Failed to submit quiz', 'error');
    } finally {
      setSubmitting(false);
    }
  }, [attempt, submitting, saveAnswersToServer, navigate, quizId]);

  useEffect(() => {
    submitHandlerRef.current = handleSubmit;
  }, [handleSubmit]);

  useEffect(() => {
    startQuizAttempt();
  }, [startQuizAttempt]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && attempt?.attempt_id && !autoSubmittedRef.current) {
        _setTabSwitchCount(prev => prev + 1);
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleBeforeUnload = (e) => {
      if (!attempt?.attempt_id || autoSubmittedRef.current) return;
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [attempt]);

  useEffect(() => {
    if (!attempt?.attempt_id || !timerDeadlineRef.current) return;

    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.floor((timerDeadlineRef.current - Date.now()) / 1000));
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(timerRef.current);
        if (!autoSubmittedRef.current) {
          autoSubmittedRef.current = true;
          submitHandlerRef.current?.(true);
        }
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [attempt?.attempt_id]);

  useEffect(() => {
    if (attempt?.attempt_id) {
      autoSaveTimerRef.current = setInterval(() => {
        saveAnswersToServer(false);
      }, 30000);
    }

    return () => {
      if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current);
    };
  }, [attempt, saveAnswersToServer]);

  const handleAnswerChange = (questionId, value) => {
    const question = questions.find((q) => (q.question_id || q.id) === questionId);
    if (!question) return;

    const serialized = serializeAnswer(value);
    if (serialized !== (lastSaveRef.current[questionId] || '')) {
      dirtyAnswersRef.current.add(questionId);
    } else {
      dirtyAnswersRef.current.delete(questionId);
    }

    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleMultipleChoiceToggle = (questionId, optionId) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      let next = [];

      if (current.includes(optionId)) {
        next = current.filter(id => id !== optionId);
      } else {
        next = [...current, optionId];
      }

      const serialized = serializeAnswer(next);
      if (serialized !== (lastSaveRef.current[questionId] || '')) {
        dirtyAnswersRef.current.add(questionId);
      } else {
        dirtyAnswersRef.current.delete(questionId);
      }

      return { ...prev, [questionId]: next };
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
  const currentQuestionId = currentQuestion?.question_id || currentQuestion?.id;
  const currentQuestionType = normalizeQuestionType(currentQuestion?.question_type);

  const currentOptions = Array.isArray(currentQuestion?.options) ? currentQuestion.options : [];
  const currentAnswer = answers[currentQuestionId];

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
          <h2 className="text-xl font-semibold mb-6">{currentQuestion?.question_text || 'No question available'}</h2>

          {currentQuestionType === QUESTION_TYPES.SINGLE && (
            <div className="space-y-3">
              {currentOptions.map((option) => {
                const optionId = option.option_id || option.id;
                return (
                  <label key={optionId} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name={`answer-${currentQuestionId}`}
                      value={optionId}
                      checked={String(currentAnswer || '') === String(optionId)}
                      onChange={() => handleAnswerChange(currentQuestionId, optionId)}
                      className="w-4 h-4"
                    />
                    <span className="ml-3">{option.option_text}</span>
                  </label>
                );
              })}
            </div>
          )}

          {currentQuestionType === QUESTION_TYPES.MULTIPLE && (
            <div className="space-y-3">
              {currentOptions.map((option) => {
                const optionId = option.option_id || option.id;
                return (
                  <label key={optionId} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={(currentAnswer || []).map(String).includes(String(optionId))}
                      onChange={() => handleMultipleChoiceToggle(currentQuestionId, optionId)}
                      className="w-4 h-4"
                    />
                    <span className="ml-3">{option.option_text}</span>
                  </label>
                );
              })}
            </div>
          )}

          {(currentQuestionType === QUESTION_TYPES.SHORT || currentQuestionType === QUESTION_TYPES.LONG) && (
            <textarea
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(currentQuestionId, e.target.value)}
              placeholder="Type your answer..."
              rows={currentQuestionType === QUESTION_TYPES.LONG ? 8 : 3}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          {!currentQuestion && (
            <p className="text-gray-600">No questions available for this quiz.</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button onClick={() => currentQuestionIndex > 0 && setCurrentQuestionIndex(currentQuestionIndex - 1)} disabled={currentQuestionIndex === 0} className="flex items-center gap-2 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"><FaArrowLeft /> Previous</button>
          <ButtonWithLoader 
            label="Save"
            loadingLabel="Saving..."
            isLoading={autoSaving}
            onClick={() => saveAnswersToServer(true)}
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
                disabled={questions.length === 0}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
