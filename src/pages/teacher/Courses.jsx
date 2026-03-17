import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaBook, FaUsers, FaDollarSign, FaVideo, FaCheckCircle, FaClock, FaChartLine } from 'react-icons/fa';
import { BiLoader } from 'react-icons/bi';
import StatCard from '../../components/common/StatCard';
import CourseCard from '../../components/common/CourseCard';
import CreateCourseForm from '../../components/teacher/CreateCourseForm';
import Notification from '../../components/common/Notification';

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
  const [notification, setNotification] = useState(null);
  
  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };
  
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
      showNotification('Title and description are required', 'error');
      return;
    }

    setIsSubmitting(true);
    // Simulate creation
    setTimeout(() => {
      const newCourse = { ...formData, id: Math.random() };
      setCourses([...courses, newCourse]);
      showNotification('Course created successfully', 'success');
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
      showNotification('Course deleted successfully', 'success');
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
          <CourseCard
            key={course.id}
            course={course}
            userType="teacher"
            onViewDetails={() => navigate(`/teacher/courses/${course.id}?mode=view`)}
            onEdit={() => navigate(`/teacher/courses/${course.id}?mode=edit`)}
            onDelete={confirmDelete}
          />
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
