import { useState } from 'react';
import { FaArrowRight, FaAward, FaFilePdf, FaPencilAlt, FaTimes } from 'react-icons/fa';

const TeacherQuizzes = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('published');

  const quizzes = [
    {
      id: 1,
      title: 'Mathematics Chapter 5 Quiz',
      course: 'Mathematics Excellence',
      questions: 20,
      duration: 30,
      submissions: 42,
      avgScore: 85,
      pending: 3,
      dueDate: 'Dec 20, 2025',
      status: 'published',
    },
    {
      id: 2,
      title: 'Sinhala Grammar Test',
      course: 'Sinhala Language',
      questions: 15,
      duration: 25,
      submissions: 35,
      avgScore: 78,
      pending: 8,
      dueDate: 'Dec 22, 2025',
      status: 'published',
    },
    {
      id: 3,
      title: 'Environment Unit 3 Assessment',
      course: 'Complete Scholarship Package',
      questions: 25,
      duration: 35,
      submissions: 0,
      avgScore: 0,
      pending: 0,
      dueDate: 'Dec 25, 2025',
      status: 'draft',
    },
  ];

  const recentSubmissions = [
    { id: 1, student: 'Kasun P.', quiz: 'Mathematics Chapter 5', score: 92, time: '2 hours ago' },
    { id: 2, student: 'Nimal S.', quiz: 'Sinhala Grammar', score: 88, time: '3 hours ago' },
    { id: 3, student: 'Saman W.', quiz: 'Mathematics Chapter 5', score: 85, time: '5 hours ago' },
  ];

  const publishedQuizzes = quizzes.filter((q) => q.status === 'published');
  const draftQuizzes = quizzes.filter((q) => q.status === 'draft');

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Management</h1>
          <p className="text-gray-600">Create and grade quizzes for your students</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary px-6">
          + Create New Quiz
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Total Quizzes</div>
          <div className="text-2xl font-bold text-gray-900">{quizzes.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Published</div>
          <div className="text-2xl font-bold text-green-600">{publishedQuizzes.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Pending Grading</div>
          <div className="text-2xl font-bold text-yellow-600">
            {quizzes.reduce((sum, q) => sum + q.pending, 0)}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Avg Score</div>
          <div className="text-2xl font-bold text-primary-600">
            {publishedQuizzes.length > 0
              ? Math.round(
                  publishedQuizzes.reduce((sum, q) => sum + q.avgScore, 0) / publishedQuizzes.length
                )
              : 0}
            %
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
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
              {publishedQuizzes.map((quiz) => (
                <div key={quiz.id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{quiz.title}</h3>
                        {quiz.pending > 0 && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded">
                            {quiz.pending} PENDING
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{quiz.course}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Questions:</span>{' '}
                          <span className="font-medium text-gray-900">{quiz.questions}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Duration:</span>{' '}
                          <span className="font-medium text-gray-900">{quiz.duration} min</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Submissions:</span>{' '}
                          <span className="font-medium text-gray-900">{quiz.submissions}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Avg Score:</span>{' '}
                          <span className="font-medium text-gray-900">{quiz.avgScore}%</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-2">Due: {quiz.dueDate}</div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium">
                        View Results
                      </button>
                      <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        Edit
                      </button>
                    </div>
                  </div>
                  {quiz.submissions > 0 && (
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-gray-600">Completion Rate:</div>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: '93%' }} />
                            </div>
                            <span className="text-sm font-medium text-gray-900">93%</span>
                          </div>
                        </div>
                        {quiz.pending > 0 && (
                          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                            Grade Pending →
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Draft Quizzes */}
          {selectedTab === 'drafts' && (
            <div className="space-y-4">
              {draftQuizzes.map((quiz) => (
                <div key={quiz.id} className="card bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{quiz.title}</h3>
                        <span className="px-2 py-1 bg-gray-300 text-gray-700 text-xs font-semibold rounded">
                          DRAFT
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{quiz.course}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Questions:</span>{' '}
                          <span className="font-medium text-gray-900">{quiz.questions}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Duration:</span>{' '}
                          <span className="font-medium text-gray-900">{quiz.duration} min</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">
                        Publish
                      </button>
                      <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Recent Submissions */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Submissions</h3>
            <div className="space-y-3">
              {recentSubmissions.map((submission) => (
                <div key={submission.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 text-sm">{submission.student}</span>
                    <span className="text-lg font-bold text-green-600">{submission.score}%</span>
                  </div>
                  <div className="text-xs text-gray-600">{submission.quiz}</div>
                  <div className="text-xs text-gray-500 mt-1">{submission.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz Templates */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Templates</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm transition-colors">
                📝 Multiple Choice Quiz
              </button>
              <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg text-sm transition-colors">
                ✍️ Short Answer Quiz
              </button>
              <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-sm transition-colors">
                🎯 Mixed Format Quiz
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Quiz</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
                <input type="text" className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                <select className="input-field">
                  <option>Mathematics Excellence</option>
                  <option>Sinhala Language</option>
                  <option>Complete Scholarship Package</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
                  <input type="number" className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <input type="number" className="input-field" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input type="date" className="input-field" required />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 btn-primary">
                  Create Quiz
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherQuizzes;
