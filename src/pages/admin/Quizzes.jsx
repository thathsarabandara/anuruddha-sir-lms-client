import { useState } from 'react';
import { FaBook, FaCalendar,  FaChartBar, FaCheck, FaCheckCircle, FaFilePdf, FaTimes, FaHourglassHalf, FaEye } from 'react-icons/fa';
import Notification from '../../components/common/Notification';

import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';

const AdminQuizzes = () => {
  const [notification, setNotification] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const quizzes = [
    {
      id: 1,
      title: 'Mathematics - Chapter 5 Final Quiz',
      course: 'Mathematics Excellence',
      teacher: 'Anuruddha Sir',
      totalQuestions: 25,
      duration: '45 mins',
      totalMarks: 50,
      submissions: 78,
      avgScore: 42,
      status: 'published',
      createdDate: 'Dec 10, 2025',
    },
    {
      id: 2,
      title: 'Science - Living Organisms Assessment',
      course: 'Science Mastery',
      teacher: 'Saman Fernando',
      totalQuestions: 20,
      duration: '30 mins',
      totalMarks: 40,
      submissions: 54,
      avgScore: 35,
      status: 'published',
      createdDate: 'Dec 12, 2025',
    },
    {
      id: 3,
      title: 'Advanced Grammar Test',
      course: 'English Grammar',
      teacher: 'Saman Fernando',
      totalQuestions: 30,
      duration: '60 mins',
      totalMarks: 60,
      submissions: 0,
      avgScore: 0,
      status: 'pending',
      createdDate: 'Dec 17, 2025',
    },
    {
      id: 4,
      title: 'Sinhala Language - Mid Term',
      course: 'Sinhala Language',
      teacher: 'Anuruddha Sir',
      totalQuestions: 35,
      duration: '60 mins',
      totalMarks: 70,
      submissions: 45,
      avgScore: 58,
      status: 'published',
      createdDate: 'Nov 28, 2025',
    },
  ];

  const quizzesMetricsConfig = [
    {
      label: 'Total Quizzes',
      statsKey: 'total',
      icon: FaFilePdf,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'All quizzes in system',
    },
    {
      label: 'Published',
      statsKey: 'published',
      icon: FaCheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'Active quizzes',
    },
    {
      label: 'Pending Review',
      statsKey: 'pending',
      icon: FaHourglassHalf,
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      description: 'Awaiting approval',
    },
    {
      label: 'Total Submissions',
      statsKey: 'submissions',
      icon: FaChartBar,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'All attempts',
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      published: 'bg-green-100 text-green-700',
      pending: 'bg-orange-100 text-orange-700',
      draft: 'bg-gray-100 text-gray-700',
      suspended: 'bg-red-100 text-red-700',
    };
    return colors[status] || colors.draft;
  };

  const handleViewDetails = (quiz) => {
    setSelectedQuiz(quiz);
    setShowDetailsModal(true);
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    return filterStatus === 'all' || quiz.status === filterStatus;
  });

  return (
    <div className="p-8">
      {notification && (
        <div className="fixed top-4 left-4 right-4 z-50 max-w-sm">
          <Notification 
            {...notification} 
            onClose={() => setNotification(null)} 
          />
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Management</h1>
        <p className="text-gray-600">Review and moderate quiz content</p>
      </div>

      {/* Stats */}
      <StatCard 
        stats={{
          total: '156',
          published: '142',
          pending: '8',
          submissions: '4,567',
        }}
        metricsConfig={quizzesMetricsConfig}
      />

      {/* Quizzes DataTable */}
      <DataTable
        data={filteredQuizzes}
        columns={[
          {
            key: 'title',
            label: 'Quiz Title',
            searchable: true,
            render: (value, quiz) => (
              <div>
                <p className="text-sm font-medium text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{quiz.createdDate}</p>
              </div>
            ),
          },
          {
            key: 'course',
            label: 'Course',
            searchable: true,
            render: (value) => <p className="text-sm text-gray-900">{value}</p>,
          },
          {
            key: 'teacher',
            label: 'Teacher',
            searchable: true,
            render: (value) => <p className="text-sm text-gray-600">{value}</p>,
          },
          {
            key: 'totalQuestions',
            label: 'Questions',
            render: (value) => <p className="text-sm text-gray-900">{value}</p>,
          },
          {
            key: 'duration',
            label: 'Duration',
            render: (value) => <p className="text-sm text-gray-900">{value}</p>,
          },
          {
            key: 'submissions',
            label: 'Submissions',
            render: (value) => <p className="text-sm font-medium text-gray-900">{value}</p>,
          },
          {
            key: 'avgScore',
            label: 'Avg Score',
            render: (value, quiz) => {
              if (value > 0) {
                const color = value >= (quiz.totalMarks * 0.75) ? 'text-green-600' : value >= (quiz.totalMarks * 0.5) ? 'text-yellow-600' : 'text-red-600';
                return <span className={`font-medium ${color}`}>{value}/{quiz.totalMarks}</span>;
              }
              return <span className="text-gray-400">N/A</span>;
            },
          },
          {
            key: 'status',
            label: 'Status',
            filterable: true,
            filterOptions: [
              { label: 'Published', value: 'published' },
              { label: 'Pending', value: 'pending' },
              { label: 'Draft', value: 'draft' },
              { label: 'Suspended', value: 'suspended' },
            ],
            render: (value) => (
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
                {value.toUpperCase()}
              </span>
            ),
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (_, quiz) => (
              <button
                onClick={() => handleViewDetails(quiz)}
                className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs flex items-center gap-1 transition whitespace-nowrap"
              >
                <FaEye /> View
              </button>
            ),
          },
        ]}
        config={{
          itemsPerPage: 10,
          searchPlaceholder: 'Search by title, course, teacher...',
          hideSearch: false,
          emptyMessage: 'No quizzes found',
          searchValue: searchTerm,
          onSearchChange: (value) => {
            setSearchTerm(value);
          },
          statusFilterOptions: [
            { label: 'All Status', value: 'all' },
            { label: 'Published', value: 'published' },
            { label: 'Pending', value: 'pending' },
            { label: 'Draft', value: 'draft' },
          ],
          statusFilterValue: filterStatus,
          onStatusFilterChange: (value) => setFilterStatus(value),
        }}
        loading={false}
      />

      {/* Details Modal */}
      {showDetailsModal && selectedQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Quiz Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="pb-6 border-b">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{selectedQuiz.title}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedQuiz.status)}`}>
                    {selectedQuiz.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>📚 {selectedQuiz.course}</span>
                  <span>👨‍🏫 {selectedQuiz.teacher}</span>
                  <span>📅 {selectedQuiz.createdDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card bg-blue-50">
                  <p className="text-sm text-gray-600 mb-1">Questions</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedQuiz.totalQuestions}</p>
                </div>
                <div className="card bg-green-50">
                  <p className="text-sm text-gray-600 mb-1">Duration</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedQuiz.duration}</p>
                </div>
                <div className="card bg-purple-50">
                  <p className="text-sm text-gray-600 mb-1">Total Marks</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedQuiz.totalMarks}</p>
                </div>
                <div className="card bg-orange-50">
                  <p className="text-sm text-gray-600 mb-1">Submissions</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedQuiz.submissions}</p>
                </div>
              </div>

              {selectedQuiz.submissions > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-3">Performance Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Average Score</span>
                      <span className="font-medium text-gray-900">{selectedQuiz.avgScore} / {selectedQuiz.totalMarks}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Pass Rate</span>
                      <span className="font-medium text-green-600">82%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Completion Rate</span>
                      <span className="font-medium text-blue-600">94%</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedQuiz.status === 'pending' && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-gray-700">
                    <strong>Review Checklist:</strong>
                    <br />
                    ✓ Check question clarity and correctness
                    <br />
                    ✓ Verify answer options and correct answers
                    <br />
                    ✓ Ensure appropriate difficulty level
                    <br />
                    ✓ Review time allocation
                    <br />
                    ✓ Verify alignment with course content
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Moderator Notes</label>
                <textarea
                  rows="3"
                  className="input-field"
                  placeholder="Add review notes or feedback for the teacher..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                {selectedQuiz.status === 'pending' ? (
                  <>
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 font-medium">
                      ✓ Approve Quiz
                    </button>
                    <button className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 font-medium">
                      ✗ Request Changes
                    </button>
                  </>
                ) : selectedQuiz.status === 'published' ? (
                  <>
                    <button className="flex-1 btn-primary">View All Questions</button>
                    <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg py-3 font-medium">
                      Suspend Quiz
                    </button>
                  </>
                ) : null}
                <button onClick={() => setShowDetailsModal(false)} className="px-6 btn-outline">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuizzes;
