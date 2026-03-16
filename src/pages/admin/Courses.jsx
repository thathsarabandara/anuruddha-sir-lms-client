import { useState, useEffect } from 'react';
import { FaBook, FaCalendar, FaCheck, FaCheckCircle, FaTimes, FaEye, FaTrash, FaToggleOn, FaToggleOff, FaStar, FaExclamationTriangle } from 'react-icons/fa';
import { CgSandClock } from 'react-icons/cg';
import StatCard from '../../components/common/StatCard';
import CourseCard from '../../components/common/CourseCard';
import { getAbsoluteImageUrl } from '../../utils/helpers';

const AdminCourses = () => {
  // Dummy data
  const dummyCourses = [
    { id: 1, title: 'Advanced Python Programming', teacher_name: 'Dr. John Smith', category: 'Programming', grade_level: '10-12', status: 'PUBLISHED', total_enrollments: 245, average_rating: 4.8, price: 49.99, price_type: 'PAID', total_revenue: 12247.5, is_featured: true, enrollments_enabled: true, created_at: '2024-01-15' },
    { id: 2, title: 'Mathematics for Beginners', teacher_name: 'Ms. Sarah Johnson', category: 'Mathematics', grade_level: '8-9', status: 'PUBLISHED', total_enrollments: 180, average_rating: 4.6, price: 39.99, price_type: 'PAID', total_revenue: 7198.2, is_featured: false, enrollments_enabled: true, created_at: '2024-01-20' },
    { id: 3, title: 'Introduction to Web Development', teacher_name: 'Mr. Patrick Davis', category: 'Programming', grade_level: '10-12', status: 'DRAFT', total_enrollments: 0, average_rating: 0, price: 59.99, price_type: 'PAID', total_revenue: 0, is_featured: false, enrollments_enabled: false, created_at: '2024-02-01' },
    { id: 4, title: 'English Literature Essentials', teacher_name: 'Dr. Emma Wilson', category: 'English', grade_level: '9-10', status: 'PUBLISHED', total_enrollments: 320, average_rating: 4.7, price: 44.99, price_type: 'PAID', total_revenue: 14396.8, is_featured: true, enrollments_enabled: true, created_at: '2024-01-10' },
    { id: 5, title: 'Science Fundamentals', teacher_name: 'Mr. Robert Lee', category: 'Science', grade_level: '8-9', status: 'PUBLISHED', total_enrollments: 210, average_rating: 4.5, price: 49.99, price_type: 'PAID', total_revenue: 10497.9, is_featured: false, enrollments_enabled: true, created_at: '2024-01-25' },
  ];

  const dummyStats = {
    total_courses: 156,
    published_courses: 142,
    draft_courses: 10,
    archived_courses: 4,
    total_students: 12540,
    total_revenue: 245320,
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState(dummyCourses);
  const [stats, setStats] = useState(dummyStats);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [commissionValue, setCommissionValue] = useState('');

  // Use dummy data without API calls
  useEffect(() => {
    setStats(dummyStats);
    setStatsLoading(false);
  }, []);

  useEffect(() => {
    setCourses(dummyCourses);
    setCoursesLoading(false);
  }, [filterStatus, searchTerm]);

  const getStatusColor = (status) => {
    const colors = {
      PUBLISHED: 'bg-green-100 text-green-700',
      DRAFT: 'bg-gray-100 text-gray-700',
      ARCHIVED: 'bg-red-100 text-red-700',
    };
    return colors[status] || colors.PUBLISHED;
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

  const handleApproveCourse = (courseId) => {
    if (!window.confirm('Are you sure you want to approve this course?')) return;
    setActionLoading(true);
    setTimeout(() => {
      setShowDetailsModal(false);
      setActionLoading(false);
    }, 300);
  };

  const handleRejectCourse = (courseId) => {
    if (!window.confirm('Are you sure you want to reject this course?')) return;
    setActionLoading(true);
    setTimeout(() => {
      setShowDetailsModal(false);
      setActionLoading(false);
    }, 300);
  };

  const handleFeatureCourse = (courseId, currentStatus) => {
    setActionLoading(true);
    setTimeout(() => {
      setActionLoading(false);
    }, 300);
  };

  const handleToggleEnrollments = (courseId, currentStatus) => {
    setActionLoading(true);
    setTimeout(() => {
      setSelectedCourse(null);
      setActionLoading(false);
    }, 300);
  };

  const handleSetCommission = (e) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const commission = parseFloat(commissionValue);
    if (isNaN(commission) || commission < 0 || commission > 100) {
      return;
    }

    setActionLoading(true);
    setTimeout(() => {
      setShowCommissionModal(false);
      setCommissionValue('');
      setSelectedCourse(null);
      setActionLoading(false);
    }, 300);
  };

  const handleDeleteCourse = (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;
    setActionLoading(true);
    setTimeout(() => {
      setShowDetailsModal(false);
      setActionLoading(false);
    }, 300);
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.subject && course.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Stats metrics configuration for StatCard
  const adminCoursesMetricsConfig = [
    { 
      label: 'Total Courses', 
      statsKey: 'total_courses', 
      icon: FaBook, 
      bgColor: 'bg-blue-100', 
      textColor: 'text-blue-600', 
      description: 'all courses' 
    },
    { 
      label: 'Published', 
      statsKey: 'published_courses', 
      icon: FaCheckCircle, 
      bgColor: 'bg-green-100', 
      textColor: 'text-green-600', 
      description: 'active courses' 
    },
    { 
      label: 'Draft', 
      statsKey: 'draft_courses', 
      icon: CgSandClock, 
      bgColor: 'bg-orange-100', 
      textColor: 'text-orange-600', 
      description: 'pending review' 
    },
    { 
      label: 'Archived', 
      statsKey: 'archived_courses', 
      icon: FaExclamationTriangle, 
      bgColor: 'bg-yellow-100', 
      textColor: 'text-yellow-600', 
      description: 'inactive courses' 
    },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
          <p className="text-gray-600">Review and manage all courses</p>
        </div>
      </div>

      {/* Stats Section */}
      <StatCard stats={stats} metricsConfig={adminCoursesMetricsConfig} loading={statsLoading} />

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
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {coursesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="card">
              <div className="mb-4 h-40 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="flex items-start justify-between mb-4">
                <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              userType="admin"
              loading={actionLoading}
              onViewDetails={handleViewDetails}
              onFeature={handleFeatureCourse}
              onToggleEnrollments={handleToggleEnrollments}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No courses found</p>
        </div>
      )}

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
              {selectedCourse.thumbnail && (
                <div className="h-40 bg-gray-200 rounded-lg overflow-hidden">
                  <img src={selectedCourse.thumbnail} alt={selectedCourse.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex items-start justify-between pb-6 border-b">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getSubjectColor(selectedCourse.subject)}`}>
                      {selectedCourse.subject || 'N/A'}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCourse.status)}`}>
                      {selectedCourse.status.toUpperCase()}
                    </span>
                    {selectedCourse.is_approved && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center">
                        <FaCheck className="mr-1" /> Approved
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedCourse.title}</h3>
                  <p className="text-gray-600">by {selectedCourse.teacher_name}</p>
                </div>
              </div>

              {selectedCourse.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-900 mt-2">{selectedCourse.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Price Type</label>
                  <p className="text-gray-900 font-medium mt-1">{selectedCourse.price_type}</p>
                </div>
                {selectedCourse.price_type === 'PAID' && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Price</label>
                    <p className="text-gray-900 font-medium mt-1">Rs. {selectedCourse.price}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Level</label>
                  <p className="text-gray-900 font-medium mt-1">{selectedCourse.grade_level}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Commission</label>
                  <p className="text-gray-900 font-medium mt-1">{selectedCourse.commission_percentage}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Enrolled Students</label>
                  <p className="text-gray-900 font-medium mt-1">{selectedCourse.total_enrollments}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Revenue</label>
                  <p className="text-gray-900 font-medium mt-1">Rs. {selectedCourse.total_revenue.toLocaleString()}</p>
                </div>
                {selectedCourse.average_rating > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rating</label>
                    <p className="text-gray-900 font-medium mt-1">
                      <FaStar className="inline mr-1 text-yellow-500" />
                      {selectedCourse.average_rating.toFixed(1)} / 5.0
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Enrollments</label>
                  <p className="text-gray-900 font-medium mt-1">
                    {selectedCourse.enrollments_enabled ? (
                      <span className="text-green-600">Enabled</span>
                    ) : (
                      <span className="text-red-600">Disabled</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Featured</label>
                  <p className="text-gray-900 font-medium mt-1">
                    {selectedCourse.is_featured ? (
                      <span className="text-yellow-600">Yes</span>
                    ) : (
                      <span className="text-gray-600">No</span>
                    )}
                  </p>
                </div>
              </div>

              {!selectedCourse.is_approved && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-gray-700">
                    <strong>Action Required:</strong> This course is pending approval.
                  </p>
                </div>
              )}

              <div className="flex flex-col space-y-3 pt-4">
                {!selectedCourse.is_approved ? (
                  <>
                    <button
                      onClick={() => handleApproveCourse(selectedCourse.id)}
                      disabled={actionLoading}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg py-3 font-medium flex items-center justify-center"
                    >
                      <FaCheck className="mr-2" />
                      Approve Course
                    </button>
                    <button
                      onClick={() => handleRejectCourse(selectedCourse.id)}
                      disabled={actionLoading}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg py-3 font-medium flex items-center justify-center"
                    >
                      <FaTimes className="mr-2" />
                      Reject Course
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setCommissionValue(selectedCourse.commission_percentage);
                          setShowCommissionModal(true);
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-medium"
                      >
                        Set Commission
                      </button>
                      <button
                        onClick={() => handleToggleEnrollments(selectedCourse.id, selectedCourse.enrollments_enabled)}
                        disabled={actionLoading}
                        className={`flex-1 rounded-lg py-3 font-medium ${
                          selectedCourse.enrollments_enabled
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {selectedCourse.enrollments_enabled ? 'Disable Enrollments' : 'Enable Enrollments'}
                      </button>
                    </div>
                    <button
                      onClick={() => handleFeatureCourse(selectedCourse.id, selectedCourse.is_featured)}
                      disabled={actionLoading}
                      className={`w-full rounded-lg py-3 font-medium ${
                        selectedCourse.is_featured
                          ? 'bg-gray-600 hover:bg-gray-700 text-white'
                          : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      }`}
                    >
                      {selectedCourse.is_featured ? 'Unfeature Course' : 'Feature Course'}
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(selectedCourse.id)}
                      disabled={actionLoading}
                      className="w-full bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white rounded-lg py-3 font-medium flex items-center justify-center"
                    >
                      <FaTrash className="mr-2" />
                      Delete Course
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-full px-6 btn-outline py-3"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Commission Modal */}
      {showCommissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Set Commission Percentage</h2>
            <form onSubmit={handleSetCommission} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commission (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={commissionValue}
                  onChange={(e) => setCommissionValue(e.target.value)}
                  className="input-field"
                  placeholder="Enter commission percentage"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Enter a value between 0 and 100</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 btn-primary py-2 disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCommissionModal(false);
                    setCommissionValue('');
                  }}
                  className="flex-1 btn-outline py-2"
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

export default AdminCourses;
