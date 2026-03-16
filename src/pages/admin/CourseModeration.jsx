/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Dummy courses data
const DUMMY_COURSES = [
  {
    id: 1,
    title: 'Introduction to Python Programming',
    teacher_name: 'Dr. Amarasiri',
    category: { name: 'Programming' },
    subject: { name: 'Computer Science' },
    grade_level: { name: '11-12' },
    price: '5000',
    status: 'PUBLISHED',
    approval_status: 'APPROVED',
    is_featured: true,
    total_enrollments: 245,
    commission_rate: 15,
    thumbnail: 'https://via.placeholder.com/300x200?text=Python',
    description: 'A comprehensive introduction to Python programming for beginners.',
    average_rating: 4.5,
    rejection_reason: null
  },
  {
    id: 2,
    title: 'Web Development with React',
    teacher_name: 'Eng. Silva',
    category: { name: 'Web Development' },
    subject: { name: 'Information Technology' },
    grade_level: { name: '12' },
    price: '7500',
    status: 'PUBLISHED',
    approval_status: 'PENDING',
    is_featured: false,
    total_enrollments: 0,
    commission_rate: 20,
    thumbnail: 'https://via.placeholder.com/300x200?text=React',
    description: 'Learn modern web development using React and JavaScript.',
    average_rating: 0,
    rejection_reason: null
  },
  {
    id: 3,
    title: 'Advanced Mathematics',
    teacher_name: 'Prof. Jayakody',
    category: { name: 'Mathematics' },
    subject: { name: 'Mathematics' },
    grade_level: { name: 'A/L' },
    price: '3000',
    status: 'PUBLISHED',
    approval_status: 'APPROVED',
    is_featured: false,
    total_enrollments: 156,
    commission_rate: 10,
    thumbnail: 'https://via.placeholder.com/300x200?text=Math',
    description: 'Master advanced mathematical concepts for A-Level exams.',
    average_rating: 4.8,
    rejection_reason: null
  },
  {
    id: 4,
    title: 'English Literature',
    teacher_name: 'Mrs. Fernando',
    category: { name: 'Languages' },
    subject: { name: 'English' },
    grade_level: { name: '10-12' },
    price: '2500',
    status: 'PUBLISHED',
    approval_status: 'REJECTED',
    is_featured: false,
    total_enrollments: 0,
    commission_rate: 12,
    thumbnail: 'https://via.placeholder.com/300x200?text=Literature',
    description: 'Explore classic and contemporary English literature.',
    average_rating: 0,
    rejection_reason: 'Course content does not meet minimum standards. Please add more resources and improve course structure.'
  },
  {
    id: 5,
    title: 'Digital Marketing Fundamentals',
    teacher_name: 'Mr. Perera',
    category: { name: 'Business' },
    subject: { name: 'Marketing' },
    grade_level: { name: 'Professional' },
    price: '6000',
    status: 'PUBLISHED',
    approval_status: 'PENDING',
    is_featured: false,
    total_enrollments: 0,
    commission_rate: 25,
    thumbnail: 'https://via.placeholder.com/300x200?text=Marketing',
    description: 'Complete guide to digital marketing strategies and tools.',
    average_rating: 0,
    rejection_reason: null
  },
];

const AdminCourseModeration = () => {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected, all
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [commissionRate, setCommissionRate] = useState('');

  const fetchCourses = () => {
    let filteredCourses = DUMMY_COURSES;
    
    if (filter !== 'all') {
      filteredCourses = DUMMY_COURSES.filter(c => 
        c.approval_status.toLowerCase() === filter.toLowerCase()
      );
    }
    
    setCourses(filteredCourses);
  };

  useEffect(() => {
    fetchCourses();
  }, [filter]);

  const handleApproveCourse = (courseId) => {
    if (!window.confirm('Are you sure you want to approve this course?')) return;

    const updatedCourses = courses.map(c => 
      c.id === courseId ? { ...c, approval_status: 'APPROVED' } : c
    );
    setCourses(updatedCourses);
    toast.success('Course approved successfully');
  };

  const handleRejectCourse = (courseId) => {
    const reason = window.prompt('Enter rejection reason (optional):');
    if (reason === null) return;
    
    const updatedCourses = courses.map(c => 
      c.id === courseId 
        ? { ...c, approval_status: 'REJECTED', rejection_reason: reason || 'No reason provided' } 
        : c
    );
    setCourses(updatedCourses);
    toast.success('Course rejected successfully');
  };

  const handleFeatureCourse = (courseId, currentStatus) => {
    const updatedCourses = courses.map(c => 
      c.id === courseId ? { ...c, is_featured: !currentStatus } : c
    );
    setCourses(updatedCourses);
    toast.success(!currentStatus ? 'Course featured' : 'Course unfeatured');
  };

  const handleSetCommission = (e) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const newRate = parseFloat(commissionRate);
    if (isNaN(newRate) || newRate < 0 || newRate > 100) {
      toast.error('Please enter a valid commission rate between 0 and 100');
      return;
    }

    const updatedCourses = courses.map(c => 
      c.id === selectedCourse.id ? { ...c, commission_rate: newRate } : c
    );
    setCourses(updatedCourses);
    toast.success('Commission rate updated');
    setShowCommissionModal(false);
    setCommissionRate('');
    setSelectedCourse(null);
  };

  const openCommissionModal = (course) => {
    setSelectedCourse(course);
    setCommissionRate(course.commission_rate || '10');
    setShowCommissionModal(true);
  };

  const viewCourseDetails = (course) => {
    setSelectedCourse(course);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'DRAFT': 'bg-gray-100 text-gray-800',
      'PUBLISHED': 'bg-blue-100 text-blue-800',
      'ARCHIVED': 'bg-gray-100 text-gray-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };


  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Course Moderation</h1>
        <p className="text-gray-600 mt-1">Review and manage all courses on the platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Courses</div>
          <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Pending Approval</div>
          <div className="text-2xl font-bold text-yellow-600">
            {courses.filter(c => c.approval_status === 'PENDING').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Approved</div>
          <div className="text-2xl font-bold text-green-600">
            {courses.filter(c => c.approval_status === 'APPROVED').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Featured</div>
          <div className="text-2xl font-bold text-blue-600">
            {courses.filter(c => c.is_featured).length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Courses
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'approved'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'rejected'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Courses Table */}
      {courses.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No img
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{course.title}</div>
                        <div className="text-sm text-gray-500">
                          {course.subject?.name} • {course.grade_level?.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {course.teacher_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {course.category?.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {parseFloat(course.price) === 0 ? 'Free' : `Rs. ${course.price}`}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getStatusBadge(course.status)}`}>
                        {course.status}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getStatusBadge(course.approval_status)}`}>
                        {course.approval_status}
                      </span>
                      {course.is_featured && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium whitespace-nowrap">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {course.total_enrollments || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {course.commission_rate}%
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => viewCourseDetails(course)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    {course.approval_status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleApproveCourse(course.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectCourse(course.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {course.approval_status === 'APPROVED' && (
                      <>
                        <button
                          onClick={() => handleFeatureCourse(course.id, !course.is_featured)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          {course.is_featured ? 'Unfeature' : 'Feature'}
                        </button>
                        <button
                          onClick={() => openCommissionModal(course)}
                          className="text-orange-600 hover:text-orange-900"
                        >
                          Commission
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">No courses match the selected filter</p>
        </div>
      )}{}

      {/* Course Details Modal */}
      {showDetailsModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {selectedCourse.thumbnail && (
                  <img
                    src={selectedCourse.thumbnail}
                    alt={selectedCourse.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{selectedCourse.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Category:</span>
                    <span className="ml-2 font-medium">{selectedCourse.category.name}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Subject:</span>
                    <span className="ml-2 font-medium">{selectedCourse.subject.name}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Grade Level:</span>
                    <span className="ml-2 font-medium">{selectedCourse.grade_level.name}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Price:</span>
                    <span className="ml-2 font-medium">Rs. {selectedCourse.price}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Teacher:</span>
                    <span className="ml-2 font-medium">{selectedCourse.teacher_name}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Enrollments:</span>
                    <span className="ml-2 font-medium">{selectedCourse.total_enrollments || 0}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Rating:</span>
                    <span className="ml-2 font-medium">{selectedCourse.average_rating || 0} ⭐</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Commission:</span>
                    <span className="ml-2 font-medium">{selectedCourse.commission_rate}%</span>
                  </div>
                </div>

                {selectedCourse.rejection_reason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-1">Rejection Reason:</h4>
                    <p className="text-red-700">{selectedCourse.rejection_reason}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Commission Modal */}
      {showCommissionModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Set Commission Rate</h2>
              <p className="text-gray-600 mb-4">
                Set the platform commission rate for: <strong>{selectedCourse.title}</strong>
              </p>
              
              <form onSubmit={handleSetCommission} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                    step="0.01"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter a percentage between 0 and 100
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCommissionModal(false);
                      setSelectedCourse(null);
                      setCommissionRate('');
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Set Commission
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseModeration;
