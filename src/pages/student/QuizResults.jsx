import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaTimes, FaTrophy, FaClock, FaClipboardCheck, FaExclamationCircle } from 'react-icons/fa';
import API from '../../api';
import { getAbsoluteImageUrl } from '../../utils/helpers';

const QuizResults = () => {
  const { quizId, attemptId } = useParams();
  const navigate = useNavigate();
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.quiz.getQuizResults(attemptId);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching results:', error);
      alert(error.response?.data?.message || 'Failed to load results');
      navigate('/student/quizzes');
    } finally {
      setLoading(false);
    }
  }, [attemptId, navigate]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  if (loading) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header Skeleton */}
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse mb-3"></div>
            <div className="h-4 w-80 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Results Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border rounded-lg p-6">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Questions Skeleton */}
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border rounded-lg p-6">
                <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md text-center">
          <FaExclamationCircle className="mx-auto text-red-500 text-5xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Results Not Available</h2>
          <p className="text-gray-600 mb-4">Unable to load quiz results.</p>
          <button onClick={() => navigate('/student/quizzes')} className="btn-primary">
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const { attempt, quiz, questions_with_answers, statistics } = results;
  const scorePercentage = (attempt.score / quiz.total_marks) * 100;
  const passed = scorePercentage >= quiz.passing_score;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <button 
          onClick={() => navigate('/student/quizzes')} 
          className="btn-secondary mb-6 flex items-center gap-2"
        >
          <FaArrowLeft /> Back to Quizzes
        </button>

        {/* Score Card */}
        <div className="card mb-8">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 ${
              passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {passed ? (
                <FaTrophy className="text-6xl text-green-600" />
              ) : (
                <FaExclamationCircle className="text-6xl text-red-600" />
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className={`text-5xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                {Math.round(scorePercentage)}%
              </span>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900">{attempt.score}/{quiz.total_marks}</div>
                <div className="text-sm text-gray-600">points</div>
              </div>
            </div>
            
            <span className={`inline-block px-6 py-2 rounded-full text-lg font-semibold ${
              passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {passed ? '✓ Passed' : '✗ Failed'} (Passing: {quiz.passing_score}%)
            </span>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Correct Answers</div>
              <div className="text-2xl font-bold text-green-600">
                {statistics.correct_answers}/{statistics.total_questions}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Time Taken</div>
              <div className="text-2xl font-bold text-primary-600">
                {Math.floor(attempt.time_taken / 60)}:{(attempt.time_taken % 60).toString().padStart(2, '0')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Accuracy</div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round((statistics.correct_answers / statistics.total_questions) * 100)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Attempt</div>
              <div className="text-2xl font-bold text-gray-900">
                {attempt.attempt_number}/{quiz.max_attempts}
              </div>
            </div>
          </div>

          {attempt.teacher_feedback && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="font-semibold text-gray-900 mb-2">Teacher Feedback:</h3>
              <p className="text-gray-700">{attempt.teacher_feedback}</p>
            </div>
          )}
        </div>

        {/* Question-by-Question Results */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Detailed Results</h2>
          
          {questions_with_answers.map((item, index) => {
            const { question, user_answer, is_correct, earned_marks } = item;
            
            return (
              <div key={question.id} className="card">
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-semibold text-gray-900">
                        Q{index + 1}.
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {question.question_text}
                      </h3>
                    </div>
                    {question.image && (
                      <img 
                        src={getAbsoluteImageUrl(question.image)} 
                        alt="Question" 
                        className="max-w-md h-auto rounded-lg mt-2 border border-gray-200"
                      />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      is_correct 
                        ? 'bg-green-100 text-green-700' 
                        : earned_marks > 0
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {earned_marks}/{question.marks} marks
                    </span>
                    {is_correct ? (
                      <FaCheck className="text-2xl text-green-600" />
                    ) : (
                      <FaTimes className="text-2xl text-red-600" />
                    )}
                  </div>
                </div>

                {/* MCQ/True-False Options */}
                {(question.question_type === 'MCQ_SINGLE' || 
                  question.question_type === 'MCQ_MULTIPLE' || 
                  question.question_type === 'TRUE_FALSE') && (
                  <div className="space-y-2">
                    {question.options?.map((option) => {
                      const isUserAnswer = question.question_type === 'MCQ_MULTIPLE'
                        ? user_answer?.selected_options?.includes(option.id)
                        : user_answer?.selected_option_id === option.id;
                      const isCorrect = option.is_correct;
                      
                      return (
                        <div
                          key={option.id}
                          className={`p-3 rounded-lg border-2 ${
                            isCorrect && isUserAnswer
                              ? 'bg-green-50 border-green-500'
                              : isCorrect
                              ? 'bg-green-50 border-green-300'
                              : isUserAnswer
                              ? 'bg-red-50 border-red-500'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="flex-1">{option.option_text}</span>
                            <div className="flex items-center gap-2">
                              {isUserAnswer && (
                                <span className="text-xs font-medium text-gray-600">Your Answer</span>
                              )}
                              {isCorrect && (
                                <FaCheck className="text-green-600" />
                              )}
                              {isUserAnswer && !isCorrect && (
                                <FaTimes className="text-red-600" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Text Answers */}
                {(question.question_type === 'SHORT_ANSWER' || 
                  question.question_type === 'LONG_ANSWER') && (
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-1">Your Answer:</div>
                      <p className="text-gray-900">{user_answer?.text_answer || 'No answer provided'}</p>
                    </div>
                    
                    {user_answer?.teacher_feedback && (
                      <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                        <div className="text-sm font-medium text-gray-700 mb-1">Teacher Feedback:</div>
                        <p className="text-gray-900">{user_answer.teacher_feedback}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Explanation */}
                {question.explanation && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-start gap-2">
                      <FaClipboardCheck className="text-primary-600 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900 mb-1">Explanation:</div>
                        <p className="text-gray-700">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button 
            onClick={() => navigate('/student/quizzes')} 
            className="btn-secondary px-8"
          >
            Back to Quizzes
          </button>
          {attempt.attempt_number < quiz.max_attempts && !passed && (
            <button 
              onClick={() => navigate(`/student/quiz/${quizId}/take`)} 
              className="btn-primary px-8"
            >
              Retry Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
