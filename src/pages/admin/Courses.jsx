import { useState } from 'react';
import { FaBook, FaCalendar, FaCheck, FaCheckCircle, FaTimes } from 'react-icons/fa';

const AdminCourses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courses = [
    {
      id: 1,
      title: 'Complete Scholarship Package',
      teacher: 'Anuruddha Sir',
      subject: 'All Subjects',
      price: 'Rs. 12,000/month',
      enrolledStudents: 145,
      status: 'active',
      duration: '12 months',
      level: 'Grade 5',
      rating: 4.9,
      totalRevenue: 'Rs. 1.74M',
      createdDate: 'Jan 15, 2024',
    },
    {
      id: 2,
      title: 'Mathematics Excellence',
      teacher: 'Anuruddha Sir',
      subject: 'Mathematics',
      price: 'Rs. 5,000/month',
      enrolledStudents: 89,
      status: 'active',
      duration: '10 months',
      level: 'Grade 5',
      rating: 4.8,
      totalRevenue: 'Rs. 445K',
      createdDate: 'Feb 01, 2024',
    },
    {
      id: 3,
      title: 'Advanced English Grammar',
      teacher: 'Saman Fernando',
      subject: 'English',
      price: 'Rs. 4,500/month',
      enrolledStudents: 0,
      status: 'pending',
      duration: '8 months',
      level: 'Grade 5',
      rating: 0,
      totalRevenue: 'Rs. 0',
      createdDate: 'Dec 17, 2025',
    },
    {
      id: 4,
      title: 'Science Mastery',
      teacher: 'Saman Fernando',
      subject: 'Science',
      price: 'Rs. 4,000/month',
      enrolledStudents: 67,
      status: 'active',
      duration: '10 months',
      level: 'Grade 5',
      rating: 4.6,
      totalRevenue: 'Rs. 268K',
      createdDate: 'Mar 10, 2024',
    },
    {
      id: 5,
      title: 'Sinhala Language Basics',
      teacher: 'Anuruddha Sir',
      subject: 'Sinhala',
      price: 'Rs. 3,500/month',
      enrolledStudents: 0,
      status: 'inactive',
      duration: '6 months',
      level: 'Grade 5',
      rating: 3.8,
      totalRevenue: 'Rs. 105K',
      createdDate: 'Apr 20, 2024',
    },
  ];

  const stats = [
    { label: 'Total Courses', value: '45', icon: FaBook, color: 'bg-blue-100 text-blue-700' },
    { label: 'Active Courses', value: '38', icon: FaCheckCircle, color: 'bg-green-100 text-green-700' },
    { label: 'Pending Approval', value: '3', icon: '⏳', color: 'bg-orange-100 text-orange-700' },
    { label: 'Total Revenue', value: 'Rs. 3.2M', icon: '💰', color: 'bg-yellow-100 text-yellow-700' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-700',
      pending: 'bg-orange-100 text-orange-700',
      inactive: 'bg-gray-100 text-gray-700',
      suspended: 'bg-red-100 text-red-700',
    };
    return colors[status] || colors.active;
  };

  const getSubjectColor = (subject) => {
    const colors = {
      Mathematics: 'bg-blue-100 text-blue-700',
      Sinhala: 'bg-green-100 text-green-700',
      Science: 'bg-teal-100 text-teal-700',
      English: 'bg-purple-100 text-purple-700',
      'All Subjects': 'bg-gradient-to-r from-blue-500 to-purple-500 text-white',
    };
    return colors[subject] || 'bg-gray-100 text-gray-700';
  };

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setShowDetailsModal(true);
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
          <p className="text-gray-600">Review and manage all courses</p>
        </div>
        <button className="btn-primary px-6">+ Create Course</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`text-3xl ${stat.color} p-3 rounded-lg`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search courses by title, teacher, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="btn-outline px-4 py-2">Export</button>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getSubjectColor(course.subject)}`}>
                {course.subject}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                {course.status.toUpperCase()}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <FaBook className="mr-2" />
                {course.teacher}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">💰</span>
                {course.price}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FaCalendar className="mr-2" />
                {course.duration} • {course.level}
              </div>
            </div>

            {course.status === 'active' && (
              <>
                <div className="grid grid-cols-3 gap-3 mb-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{course.enrolledStudents}</p>
                    <p className="text-xs text-gray-500">Students</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">⭐ {course.rating}</p>
                    <p className="text-xs text-gray-500">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-green-600">{course.totalRevenue}</p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>
              </>
            )}

            <div className="flex space-x-2 mt-4">
              {course.status === 'pending' ? (
                <>
                  <button
                    onClick={() => handleViewDetails(course)}
                    className="flex-1 btn-primary py-2 text-sm"
                  >
                    Review
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleViewDetails(course)}
                    className="flex-1 btn-primary py-2 text-sm"
                  >
                    View Details
                  </button>
                  <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Course Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-start justify-between pb-6 border-b">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getSubjectColor(selectedCourse.subject)}`}>
                      {selectedCourse.subject}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCourse.status)}`}>
                      {selectedCourse.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedCourse.title}</h3>
                  <p className="text-gray-600">by {selectedCourse.teacher}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Price</label>
                  <p className="text-gray-900 font-medium">{selectedCourse.price}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Duration</label>
                  <p className="text-gray-900 font-medium">{selectedCourse.duration}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Level</label>
                  <p className="text-gray-900 font-medium">{selectedCourse.level}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-gray-900 font-medium">{selectedCourse.createdDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Enrolled Students</label>
                  <p className="text-gray-900 font-medium">{selectedCourse.enrolledStudents}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Revenue</label>
                  <p className="text-gray-900 font-medium">{selectedCourse.totalRevenue}</p>
                </div>
                {selectedCourse.status === 'active' && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rating</label>
                    <p className="text-gray-900 font-medium">⭐ {selectedCourse.rating} / 5.0</p>
                  </div>
                )}
              </div>

              {selectedCourse.status === 'pending' && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-gray-700">
                    <strong>Review Checklist:</strong>
                    <br />
                    ✓ Verify course content and curriculum
                    <br />
                    ✓ Check pricing and payment structure
                    <br />
                    ✓ Review teacher qualifications
                    <br />
                    ✓ Ensure compliance with platform guidelines
                  </p>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                {selectedCourse.status === 'pending' ? (
                  <>
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 font-medium">
                      ✓ Approve Course
                    </button>
                    <button className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 font-medium">
                      ✗ Reject Course
                    </button>
                  </>
                ) : selectedCourse.status === 'active' ? (
                  <>
                    <button className="flex-1 btn-primary">Edit Course</button>
                    <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg py-3 font-medium">
                      Suspend
                    </button>
                  </>
                ) : (
                  <>
                    <button className="flex-1 btn-primary">Edit Course</button>
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 font-medium">
                      Activate
                    </button>
                  </>
                )}
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

export default AdminCourses;
