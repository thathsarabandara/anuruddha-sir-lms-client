import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaBook, FaUsers, FaDollarSign, FaVideo, FaCheckCircle, FaClock, FaChartLine } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import { BiLoader } from 'react-icons/bi';
import StatCard from '../../components/common/StatCard';
import CreateCourseForm from '../../components/teacher/CreateCourseForm';

const TeacherCourses = () => {
  const navigate = useNavigate();
  // Dummy data
  const dummyCourses = [
    { id: 1, title: 'Advanced Python', description: 'Learn advanced Python', subject_id: 1, status: 'PUBLISHED', students: 45, revenue: 2250, price: 49.99 },
    { id: 2, title: 'Web Development 101', description: 'Introduction to web dev', subject_id: 2, status: 'PUBLISHED', students: 32, revenue: 1280, price: 39.99 },
    { id: 3, title: 'Mobile Apps with Flutter', description: 'Flutter development', subject_id: 3, status: 'DRAFT', students: 0, revenue: 0, price: 59.99 },
  ];

  const dummySubjects = [
    { id: 1, name: 'Programming' },
    { id: 2, name: 'Web Development' },
    { id: 3, name: 'Mobile Apps' },
  ];

  const dummyGradeLevels = [
    { id: 1, name: '9-10' },
    { id: 2, name: '10-12' },
  ];

  const dummyCategories = [
    { id: 1, name: 'Technology' },
    { id: 2, name: 'Business' },
  ];

  const [courses, setCourses] = useState(dummyCourses);
  const [loading, _setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [subjects, _setSubjects] = useState(dummySubjects);
  const [gradeLevels, _setGradeLevels] = useState(dummyGradeLevels);
  const [categories, _setCategories] = useState(dummyCategories);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject_id: '',
    grade_level_id: '',
    category_id: '',
    price_type: 'FREE',
    price: 0,
    status: 'DRAFT',
    visibility: 'PUBLIC',
  });

  useEffect(() => {
    // Dummy data already loaded
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCreateCourse = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required');
      return;
    }

    setIsSubmitting(true);
    // Simulate creation
    setTimeout(() => {
      const newCourse = { ...formData, id: Math.random() };
      setCourses([...courses, newCourse]);
      toast.success('Course created successfully');
      setShowCreateModal(false);
      resetForm();
      setIsSubmitting(false);
    }, 300);
  };

  const confirmDelete = (courseId) => {
    setCourseToDelete(courseId);
    setShowDeleteModal(true);
  };

  const handleDeleteCourse = () => {
    if (!courseToDelete) return;

    setIsSubmitting(true);
    // Simulate deletion
    setTimeout(() => {
      toast.success('Course deleted successfully');
      setCourses(courses.filter(c => c.id !== courseToDelete));
      setIsSubmitting(false);
      setShowDeleteModal(false);
      setCourseToDelete(null);
    }, 300);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject_id: '',
      grade_level_id: '',
      category_id: '',
      price_type: 'FREE',
      price: 0,
      status: 'DRAFT',
      visibility: 'PUBLIC',
    });
  };

  // Calculate statistics
  const courseStats = {
    total_courses: courses.length,
    active_courses: courses.filter(c => c.status === 'PUBLISHED').length,
    total_students: courses.reduce((sum, c) => sum + (c.total_enrollments || c.students || 0), 0),
    total_revenue: courses.reduce((sum, c) => {
      if (c.price_type === 'PAID') {
        return sum + (parseFloat(c.price) * (c.total_enrollments || c.students || 0));
      }
      return sum;
    }, 0),
  };

  // Stats metrics configuration
  const coursesMetricsConfig = [
    {
      label: 'Total Courses',
      statsKey: 'total_courses',
      icon: FaBook,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'all courses',
    },
    {
      label: 'Active Courses',
      statsKey: 'active_courses',
      icon: FaCheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'published courses',
    },
    {
      label: 'Total Students',
      statsKey: 'total_students',
      icon: FaUsers,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'enrolled students',
    },
    {
      label: 'Total Revenue',
      statsKey: 'total_revenue',
      icon: FaDollarSign,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      description: 'total revenue',
      formatter: (value) => `Rs. ${value.toLocaleString()}`,
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
          <p className="text-gray-600">Create and manage your courses</p>
        </div>
        <button 
          onClick={() => { setShowCreateModal(true); }} 
          className="btn-primary px-6 flex items-center gap-2"
        >
          <FaPlus /> Create New Course
        </button>
      </div>

      {/* Stats */}
      <StatCard stats={courseStats} metricsConfig={coursesMetricsConfig} loading={loading} />

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            {/* Course Thumbnail */}
            <div className="relative h-48 w-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
              {course.thumbnail ? (
                <>
                  <img 
                    src={course.thumbnail.startsWith('http') ? course.thumbnail : `http://localhost:8000${course.thumbnail}`} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('flex', 'items-center', 'justify-center'); }}
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-white text-6xl group-hover:scale-110 transition-transform duration-300">
                  <FaBook />
                </div>
              )}
              
              {/* Status Badge */}
              <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${
                course.status === 'PUBLISHED' ? 'bg-green-500/90 text-white' :
                course.status === 'DRAFT' ? 'bg-yellow-500/90 text-white' :
                'bg-gray-500/90 text-white'
              }`}>
                {course.status}
              </div>

              {/* Approval Badge */}
              {course.is_approved && (
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500/90 text-white flex items-center gap-1 shadow-lg backdrop-blur-sm">
                  <FaCheckCircle className="text-xs" /> Approved
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="px-5 py-5">
              <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
              
              {/* Subject & Grade Badges */}
              <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
                {course.subject && (
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full font-medium text-xs border border-blue-200">{course.subject}</span>
                )}
                {course.grade_level && (
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full font-medium text-xs border border-purple-200">{course.grade_level}</span>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{course.description}</p>

              {/* Stats - Enhanced */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 mb-4 border border-gray-200">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Students</span>
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-blue-500 text-sm" />
                      <span className="font-bold text-gray-900">{course.total_enrollments}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Price</span>
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="text-green-500 text-sm" />
                      <span className="font-bold text-gray-900">
                        {course.price_type === 'FREE' ? 'Free' : `Rs. ${parseFloat(course.price).toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Rating</span>
                    <div className="flex items-center gap-2">
                      <FaChartLine className="text-yellow-500 text-sm" />
                      <span className="font-bold text-gray-900">{parseFloat(course.average_rating).toFixed(1)} ⭐</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Date</span>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-purple-500 text-sm" />
                      <span className="font-bold text-gray-900 text-xs">{new Date(course.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/teacher/courses/${course.id}?mode=view`)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <FaEye className="text-xs" /> View
                </button>
                <button
                  onClick={() => navigate(`/teacher/courses/${course.id}?mode=edit`)}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <FaEdit className="text-xs" /> Edit
                </button>
                <button
                  onClick={() => confirmDelete(course.id)}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                  title="Delete course"
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {courses.length === 0 && (
          <div className="col-span-3 text-center py-12">
            <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">No courses yet</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Your First Course
            </button>
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Create New Course</h2>
              <button 
                onClick={() => { setShowCreateModal(false); resetForm(); setIsSubmitting(false); }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <CreateCourseForm
              subjects={subjects}
              gradeLevels={gradeLevels}
              categories={categories}
              formData={formData}
              handleInputChange={handleInputChange}
              handleCreateCourse={handleCreateCourse}
              isSubmitting={isSubmitting}
              setShowCreateModal={setShowCreateModal}
              resetForm={resetForm}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this course? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCourseToDelete(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                No, Cancel
              </button>
              <button
                onClick={() => handleDeleteCourse()}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? <div className="flex items-center"><BiLoader className="inline-block mr-2 animate-spin" /><p>Deleting...</p></div> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TeacherCourses;
