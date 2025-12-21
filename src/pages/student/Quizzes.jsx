import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaCheck, FaFilePdf, FaGraduationCap, FaTrophy, FaSearch } from 'react-icons/fa';

const StudentQuizzes = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('available');
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');

  const availableQuizzes = [
    {
      id: 1,
      title: 'Mathematics Chapter 5 Quiz',
      subject: 'Mathematics',
      questions: 20,
      duration: 30,
      difficulty: 'Medium',
      dueDate: 'Dec 20, 2025',
      attempts: 0,
      maxAttempts: 2,
      color: 'bg-green-600',
    },
    {
      id: 2,
      title: 'Sinhala Grammar Test',
      subject: 'Sinhala',
      questions: 15,
      duration: 25,
      difficulty: 'Easy',
      dueDate: 'Dec 22, 2025',
      attempts: 0,
      maxAttempts: 2,
      color: 'bg-purple-600',
    },
    {
      id: 3,
      title: 'Environment Unit 3 Assessment',
      subject: 'Environment',
      questions: 25,
      duration: 35,
      difficulty: 'Hard',
      dueDate: 'Dec 25, 2025',
      attempts: 1,
      maxAttempts: 2,
      color: 'bg-yellow-600',
    },
  ];

  const completedQuizzes = [
    {
      id: 4,
      title: 'Mathematics Chapter 4 Quiz',
      subject: 'Mathematics',
      questions: 20,
      score: 85,
      maxScore: 100,
      completedDate: 'Dec 15, 2025',
      timeTaken: 28,
      rank: 5,
      totalParticipants: 45,
      color: 'bg-green-600',
    },
    {
      id: 5,
      title: 'Sinhala Essay Assessment',
      subject: 'Sinhala',
      questions: 15,
      score: 92,
      maxScore: 100,
      completedDate: 'Dec 13, 2025',
      timeTaken: 23,
      rank: 2,
      totalParticipants: 38,
      color: 'bg-purple-600',
    },
    {
      id: 6,
      title: 'Mathematics Chapter 3 Quiz',
      subject: 'Mathematics',
      questions: 18,
      score: 78,
      maxScore: 100,
      completedDate: 'Dec 10, 2025',
      timeTaken: 25,
      rank: 12,
      totalParticipants: 42,
      color: 'bg-green-600',
    },
  ];

  const leaderboard = [
    { rank: 1, name: 'Kasun P.', score: 485, quizzes: 12, badge: '🥇' },
    { rank: 2, name: 'You', score: 452, quizzes: 11, badge: '🥈', isCurrentUser: true },
    { rank: 3, name: 'Nimal S.', score: 438, quizzes: 12, badge: '🥉' },
    { rank: 4, name: 'Saman W.', score: 425, quizzes: 11, badge: '' },
    { rank: 5, name: 'Ruwan K.', score: 412, quizzes: 10, badge: '' },
  ];

  // Get unique subjects for filter
  const allSubjects = ['all', ...new Set([...availableQuizzes, ...completedQuizzes].map(q => q.subject))];

  // Filter quizzes based on search and subject
  const filterQuizzes = (quizzes) => {
    return quizzes.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           quiz.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = subjectFilter === 'all' || quiz.subject === subjectFilter;
      return matchesSearch && matchesSubject;
    });
  };

  const filteredAvailableQuizzes = filterQuizzes(availableQuizzes);
  const filteredCompletedQuizzes = filterQuizzes(completedQuizzes);

  return (
    <div className="p-8">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Quizzes & Assessments
                </h1>
                <p className="text-slate-600 mt-1">Test your knowledge and track your performance</p>
              </div>
              <div className="text-5xl"><FaGraduationCap className="text-blue-600" /></div>
            </div>
          </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Completed</div>
          <div className="text-2xl font-bold text-gray-900">11 Quizzes</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Average Score</div>
          <div className="text-2xl font-bold text-primary-600">85%</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Best Score</div>
          <div className="text-2xl font-bold text-green-600">95%</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Leaderboard Rank</div>
          <div className="text-2xl font-bold text-yellow-600">#2</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Filter Tabs */}
          <div className="flex space-x-4 mb-6 border-b pb-4">
            <button
              onClick={() => setFilter('available')}
              className={`pb-3 px-4 font-medium transition-colors ${
                filter === 'available'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Available ({filteredAvailableQuizzes.length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`pb-3 px-4 font-medium transition-colors ${
                filter === 'completed'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Completed ({filteredCompletedQuizzes.length})
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search quizzes by title or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>

            {/* Subject Filter */}
            <div className="flex flex-wrap gap-2">
              {allSubjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSubjectFilter(subject)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    subjectFilter === subject
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {subject.charAt(0).toUpperCase() + subject.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Available Quizzes */}
          {filter === 'available' && (
            <div className="space-y-4">
              {filteredAvailableQuizzes.length > 0 ? (
                filteredAvailableQuizzes.map((quiz) => (
                  <div key={quiz.id} className="card">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`${quiz.color} text-white p-3 rounded-lg`}>
                          <FaFilePdf className="text-2xl" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{quiz.title}</h3>
                          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                            <div className="text-gray-600">
                              <span className="font-medium text-gray-900">{quiz.questions}</span> Questions
                            </div>
                            <div className="text-gray-600">
                              <span className="font-medium text-gray-900">{quiz.duration}</span> Minutes
                            </div>
                            <div className="text-gray-600">
                              Difficulty: <span className="font-medium text-gray-900">{quiz.difficulty}</span>
                            </div>
                            <div className="text-gray-600">
                              Due: <span className="font-medium text-gray-900">{quiz.dueDate}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-gray-600">
                              Attempts: {quiz.attempts}/{quiz.maxAttempts}
                            </span>
                            {quiz.attempts > 0 && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                                Retry Available
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button className="btn-primary px-6">
                        Start Quiz
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card text-center py-8">
                  <p className="text-gray-600">No quizzes found matching your search.</p>
                </div>
              )}
            </div>
          )}

          {/* Completed Quizzes */}
          {filter === 'completed' && (
            <div className="space-y-4">
              {filteredCompletedQuizzes.length > 0 ? (
                filteredCompletedQuizzes.map((quiz) => (
                  <div key={quiz.id} className="card">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`${quiz.color} text-white p-3 rounded-lg`}>
                          <FaCheck className="text-2xl" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{quiz.title}</h3>
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center">
                              <span className="text-3xl font-bold text-primary-600 mr-2">
                                {quiz.score}%
                              </span>
                              <div className="text-sm text-gray-600">
                                {quiz.score}/{quiz.maxScore} points
                              </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              quiz.score >= 90 ? 'bg-green-100 text-green-700' :
                              quiz.score >= 75 ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {quiz.score >= 90 ? 'Excellent' :
                               quiz.score >= 75 ? 'Good' : 'Fair'}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                            <div>Completed: {quiz.completedDate}</div>
                            <div>Time: {quiz.timeTaken} mins</div>
                            <div>Rank: #{quiz.rank} of {quiz.totalParticipants}</div>
                            <div>{quiz.questions} Questions</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button 
                          onClick={() => navigate(`/student/quiz/${quiz.id}/details`)}
                          className="px-4 py-2 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 text-sm font-medium"
                        >
                          View Results
                        </button>
                        <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                          Retake
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card text-center py-8">
                  <p className="text-gray-600">No completed quizzes found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Leaderboard Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FaTrophy className="mr-2" />
              Overall Leaderboard
            </h3>
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    entry.isCurrentUser ? 'bg-primary-50 border-2 border-primary-600' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{entry.badge || entry.rank}</div>
                    <div>
                      <div className={`font-medium ${entry.isCurrentUser ? 'text-primary-600' : 'text-gray-900'}`}>
                        {entry.name}
                      </div>
                      <div className="text-xs text-gray-600">{entry.quizzes} quizzes</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{entry.score}</div>
                    <div className="text-xs text-gray-600">points</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
              View Full Leaderboard →
            </button>
            <p className="text-xs text-gray-600 mt-3 text-center">
              View quiz-specific leaderboards from the quiz details page
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentQuizzes;
