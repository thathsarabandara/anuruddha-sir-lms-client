import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaBook, FaUsers, FaDollarSign, FaVideo, FaCheckCircle, FaClock, FaChartLine } from 'react-icons/fa';
import { teacherCourseAPI, utilityAPI } from '../../api/courseApi';
import { toast } from 'react-toastify';
import { BiLoader } from 'react-icons/bi';

const TeacherCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [gradeLevels, setGradeLevels] = useState([]);
  const [categories, setCategories] = useState([]);
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
    fetchCourses();
    fetchUtilities();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await teacherCourseAPI.getCourses();
      if (response.data.success) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      toast.error('Failed to fetch courses');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUtilities = async () => {
    try {
      const [subjectsRes, gradesRes, categoriesRes] = await Promise.all([
        utilityAPI.getSubjects(),
        utilityAPI.getGradeLevels(),
        utilityAPI.getCategories(),
      ]);
      
      if (subjectsRes.data.success) setSubjects(subjectsRes.data.subjects);
      if (gradesRes.data.success) setGradeLevels(gradesRes.data.grade_levels);
      if (categoriesRes.data.success) setCategories(categoriesRes.data.categories);
    } catch (error) {
      console.error('Failed to fetch utilities', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required');
      return;
    }

    try {
      const response = await teacherCourseAPI.createCourse(formData);
      if (response.data.success) {
        toast.success('Course created successfully!');
        setShowCreateModal(false);
        resetForm();
        fetchCourses();
      }
    } catch (error) {
      setIsSubmitting(false); 
      toast.error(error.response?.data?.message || 'Failed to create course');
      console.error(error);
    }
  };

  const confirmDelete = (courseId) => {
    setCourseToDelete(courseId);
    setShowDeleteModal(true);
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      const response = await teacherCourseAPI.deleteCourse(courseToDelete);
      if (response.data.success) {
        toast.success('Course deleted successfully');
        fetchCourses();
      }
    } catch (error) {
      toast.error('Failed to delete course');
      console.error(error);
    } finally {
      setShowDeleteModal(false);
      setCourseToDelete(null);
    }
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
  const stats = {
    totalCourses: courses.length,
    activeCourses: courses.filter(c => c.status === 'PUBLISHED').length,
    totalStudents: courses.reduce((sum, c) => sum + c.total_enrollments, 0),
    totalRevenue: courses.reduce((sum, c) => {
      if (c.price_type === 'PAID') {
        return sum + (parseFloat(c.price) * c.total_enrollments);
      }
      return sum;
    }, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <BiLoader className="animate-spin text-4xl text-primary-600" />
        <span className="ml-3 text-gray-600">Loading courses...</span>
      </div>
    );
  }

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Courses</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCourses}</p>
            </div>
            <div className="bg-blue-100 text-blue-600 p-4 rounded-lg text-2xl">
              <FaBook />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Courses</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeCourses}</p>
            </div>
            <div className="bg-green-100 text-green-600 p-4 rounded-lg text-2xl">
              <FaCheckCircle />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
            <div className="bg-purple-100 text-purple-600 p-4 rounded-lg text-2xl">
              <FaUsers />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">Rs. {stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-100 text-yellow-600 p-4 rounded-lg text-2xl">
              <FaDollarSign />
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white hover:shadow-xl transition-shadow rounded-lg overflow-hidden border max-w-md">
            {/* Course Thumbnail */}
            <div className="relative h-48 w-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg mb-4">
              {course.thumbnail ? (
                <img 
                  src={course.thumbnail.startsWith('http') ? course.thumbnail : `http://localhost:8000${course.thumbnail}`} 
                  alt={course.title}
                  className="w-full h-full object-cover rounded-t-lg"
                  onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('flex', 'items-center', 'justify-center'); }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-white text-6xl">
                  <FaBook />
                </div>
              )}
              
              {/* Status Badge */}
              <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                course.status === 'PUBLISHED' ? 'bg-green-500 text-white' :
                course.status === 'DRAFT' ? 'bg-yellow-500 text-white' :
                'bg-gray-500 text-white'
              }`}>
                {course.status}
              </div>

              {/* Approval Badge */}
              {course.is_approved && (
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white flex items-center gap-1">
                  <FaCheckCircle /> Approved
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="px-4 pb-4">
              <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                {course.subject && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded">{course.subject}</span>
                )}
                {course.grade_level && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded">{course.grade_level}</span>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaUsers className="text-gray-400" />
                  <span className="text-gray-700">{course.total_enrollments} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaDollarSign className="text-gray-400" />
                  <span className="text-gray-700">
                    {course.price_type === 'FREE' ? 'Free' : `Rs. ${parseFloat(course.price).toLocaleString()}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaChartLine className="text-gray-400" />
                  <span className="text-gray-700">Rating: {parseFloat(course.average_rating).toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-gray-400" />
                  <span className="text-gray-700">{new Date(course.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/teacher/courses/${course.id}?mode=view`)}
                  className="flex-1 btn-primary py-2 text-sm flex items-center justify-center gap-2"
                >
                  <FaEye /> View
                </button>
                <button
                  onClick={() => navigate(`/teacher/courses/${course.id}?mode=edit`)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => confirmDelete(course.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  <FaTrash />
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

            <form onSubmit={handleCreateCourse} className="p-6">
              {/* Course Title */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Complete Mathematics for Grade 5"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your course..."
                  required
                />
              </div>

              {/* Subject, Grade, Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                  <select
                    name="subject_id"
                    value={formData.subject_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Grade Level</label>
                  <select
                    name="grade_level_id"
                    value={formData.grade_level_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Grade</option>
                    {gradeLevels.map(grade => (
                      <option key={grade.id} value={grade.id}>{grade.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Type and Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price Type</label>
                  <select
                    name="price_type"
                    value={formData.price_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="FREE">Free</option>
                    <option value="PAID">Paid</option>
                  </select>
                </div>

                {formData.price_type === 'PAID' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price (Rs.)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                )}
              </div>

              {/* Status and Visibility */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Visibility</label>
                  <select
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">Private</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); resetForm(); }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary py-3 font-semibold justify-center flex items-center gap-2"
                  onClick={() => setIsSubmitting(true)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <div className="flex items-center"><BiLoader className="inline-block mr-2 animate-spin" /><p>Creating...</p></div> : 'Create Course'}
                </button>
              </div>
            </form>
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
                onClick={() => { handleDeleteCourse(); setIsSubmitting(true); }}
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
