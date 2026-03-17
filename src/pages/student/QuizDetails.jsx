import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrophy, FaCheckCircle, FaTimesCircle, FaClock, FaStar } from 'react-icons/fa';
import Notification from '../../components/common/Notification';

const QuizDetails = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('questions');

  // Sample data - would come from API based on quizId
  const quizData = {
    id: quizId,
    title: 'Mathematics Chapter 4 Quiz',
    subject: 'Mathematics',
    completedDate: 'Dec 15, 2025',
    score: 85,
    maxScore: 100,
    timeTaken: 28,
    totalTime: 30,
    totalParticipants: 45,
    userRank: 5,
  };

  const questions = [
    {
      id: 1,
      question: 'What is the derivative of x^3?',
      type: 'mcq',
      userAnswer: '3x^2',
      correctAnswer: '3x^2',
      isCorrect: true,
      explanation: 'Using the power rule, d/dx(x^n) = n*x^(n-1), so d/dx(x^3) = 3x^2',
      options: ['2x^3', '3x^2', 'x^3', '6x']
    },
    {
      id: 2,
      question: 'Solve: 2x + 5 = 15',
      type: 'mcq',
      userAnswer: 'x = 5',
      correctAnswer: 'x = 5',
      isCorrect: true,
      explanation: '2x + 5 = 15 → 2x = 10 → x = 5',
      options: ['x = 10', 'x = 5', 'x = 7.5', 'x = 20']
    },
    {
      id: 3,
      question: 'What is the area of a circle with radius 5?',
      type: 'mcq',
      userAnswer: '75.5',
      correctAnswer: '78.54',
      isCorrect: false,
      explanation: 'Area = πr² = π(5)² = 25π ≈ 78.54',
      options: ['25π', '50π', '100π', '10π']
    },
    {
      id: 4,
      question: 'If f(x) = 2x + 1, what is f(3)?',
      type: 'mcq',
      userAnswer: '7',
      correctAnswer: '7',
      isCorrect: true,
      explanation: 'f(3) = 2(3) + 1 = 6 + 1 = 7',
      options: ['5', '7', '9', '11']
    },
    {
      id: 5,
      question: 'What is the square root of 144?',
      type: 'mcq',
      userAnswer: '12',
      correctAnswer: '12',
      isCorrect: true,
      explanation: '√144 = 12, since 12 × 12 = 144',
      options: ['10', '12', '14', '16']
    },
  ];

  const leaderboard = [
    { rank: 1, name: 'Kasun P.', score: 95, time: 22, badge: '🥇' },
    { rank: 2, name: 'Nimal S.', score: 92, time: 24, badge: '🥈' },
    { rank: 3, name: 'Saman W.', score: 88, time: 26, badge: '🥉' },
    { rank: 4, name: 'Ruwan K.', score: 87, time: 27, badge: '' },
    { rank: 5, name: 'You', score: 85, time: 28, badge: '', isCurrentUser: true },
    { rank: 6, name: 'Anura M.', score: 82, time: 29, badge: '' },
    { rank: 7, name: 'Chaminda L.', score: 78, time: 30, badge: '' },
  ];

  const correctCount = questions.filter(q => q.isCorrect).length;
  const accuracy = Math.round((correctCount / questions.length) * 100);

  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  return (
    <div className="p-8">
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Notification
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-4 font-medium"
        >
          <FaArrowLeft className="mr-2" />
          Back to Quizzes
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{quizData.title}</h1>
        <p className="text-gray-600">Subject: {quizData.subject}</p>
      </div>

      {/* Score Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Your Score</div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-primary-600">{quizData.score}</span>
            <span className="text-gray-600 ml-2">/ {quizData.maxScore}</span>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {quizData.score >= 90 ? '🌟 Excellent' : quizData.score >= 75 ? '⭐ Good' : '✓ Fair'}
          </div>
        </div>

        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Accuracy</div>
          <div className="text-3xl font-bold text-blue-600">{accuracy}%</div>
          <div className="text-xs text-gray-600 mt-1">{correctCount} of {questions.length} correct</div>
        </div>

        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Time Taken</div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-green-600">{quizData.timeTaken}</span>
            <span className="text-gray-600 ml-2">mins</span>
          </div>
          <div className="text-xs text-gray-600 mt-1">of {quizData.totalTime} mins</div>
        </div>

        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Your Rank</div>
          <div className="text-3xl font-bold text-yellow-600">#{quizData.userRank}</div>
          <div className="text-xs text-gray-600 mt-1">of {quizData.totalParticipants} participants</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b">
            <button
              onClick={() => setActiveTab('questions')}
              className={`pb-3 px-4 font-medium transition-colors ${
                activeTab === 'questions'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Questions & Answers ({questions.length})
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`pb-3 px-4 font-medium transition-colors ${
                activeTab === 'review'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Performance
            </button>
          </div>

          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-white ${
                        question.isCorrect ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {question.isCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                          Question {index + 1}: {question.question}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Options for MCQ */}
                  {question.type === 'mcq' && (
                    <div className="mb-4 space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            option === question.correctAnswer
                              ? 'border-green-500 bg-green-50'
                              : option === question.userAnswer && !question.isCorrect
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                              option === question.correctAnswer
                                ? 'border-green-500 bg-green-500'
                                : option === question.userAnswer && !question.isCorrect
                                ? 'border-red-500 bg-red-500'
                                : 'border-gray-300'
                            }`}>
                              {option === question.correctAnswer && (
                                <div className="text-white text-xs">✓</div>
                              )}
                              {option === question.userAnswer && !question.isCorrect && (
                                <div className="text-white text-xs">✗</div>
                              )}
                            </div>
                            <span className={`font-medium ${
                              option === question.correctAnswer
                                ? 'text-green-700'
                                : option === question.userAnswer && !question.isCorrect
                                ? 'text-red-700'
                                : 'text-gray-700'
                            }`}>
                              {option}
                            </span>
                            {option === question.correctAnswer && (
                              <span className="ml-2 text-green-600 text-sm font-medium">Correct Answer</span>
                            )}
                            {option === question.userAnswer && !question.isCorrect && (
                              <span className="ml-2 text-red-600 text-sm font-medium">Your Answer</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Explanation */}
                  <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <h4 className="font-bold text-blue-900 mb-2">Explanation</h4>
                    <p className="text-blue-800">{question.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'review' && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Analysis</h3>
                
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-900">Score Distribution</span>
                    <span className="text-gray-600">{quizData.score} / {quizData.maxScore}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all"
                      style={{ width: `${(quizData.score / quizData.maxScore) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">{correctCount}</div>
                    <div className="text-sm text-gray-600">Correct</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600 mb-1">{questions.length - correctCount}</div>
                    <div className="text-sm text-gray-600">Incorrect</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{accuracy}%</div>
                    <div className="text-sm text-gray-600">Accuracy</div>
                  </div>
                </div>

                {/* Time Analysis */}
                <div className="mt-6">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                    <FaClock className="mr-2 text-blue-600" />
                    Time Analysis
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Time Allowed</span>
                      <span className="font-medium text-gray-900">{quizData.totalTime} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Taken</span>
                      <span className="font-medium text-gray-900">{quizData.timeTaken} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Saved</span>
                      <span className="font-medium text-green-600">{quizData.totalTime - quizData.timeTaken} minutes</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recommendations</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                    <p className="text-yellow-900">
                      You answered 2 questions incorrectly. Review the topics related to these questions to improve your score.
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <p className="text-blue-900">
                      Your accuracy ({accuracy}%) is good. Focus on speed without compromising accuracy in the next attempt.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Leaderboard Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FaTrophy className="mr-2 text-yellow-600" />
              Quiz Leaderboard
            </h3>
            <p className="text-xs text-gray-600 mb-4">Top performers in this quiz</p>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`p-3 rounded-lg transition-colors ${
                    entry.isCurrentUser 
                      ? 'bg-primary-50 border-2 border-primary-600' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1">
                      <div className="text-xl w-6">{entry.badge || entry.rank}</div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium truncate ${
                          entry.isCurrentUser ? 'text-primary-600' : 'text-gray-900'
                        }`}>
                          {entry.name}
                        </div>
                        <div className="text-xs text-gray-600 flex items-center">
                          <FaClock className="mr-1" /> {entry.time} mins
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{entry.score}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-900">
                <FaStar className="inline mr-1" />
                You ranked <span className="font-bold">#{quizData.userRank}</span> with <span className="font-bold">{accuracy}% accuracy</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDetails;
