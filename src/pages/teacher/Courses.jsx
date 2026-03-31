import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaBook, FaUsers, FaDollarSign, FaCheckCircle } from 'react-icons/fa';
import { BiLoader } from 'react-icons/bi';
import StatCard from '../../components/common/StatCard';
import CourseCard from '../../components/common/CourseCard';
import CreateCourseForm from '../../components/teacher/CreateCourseForm';
import Notification from '../../components/common/Notification';
import { courseAPI } from '../../api/course';
import {
  COURSE_SUBJECT_OPTIONS,
  COURSE_GRADE_LEVEL_OPTIONS,
  COURSE_TYPE_OPTIONS,
} from '../../utils/courseOptions';

const getErrorMessage = (err, fallback = 'Something went wrong') =>
  err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;

const TeacherCourses = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const subjects = COURSE_SUBJECT_OPTIONS;
  const gradeLevels = COURSE_GRADE_LEVEL_OPTIONS;
  const courseTypes = COURSE_TYPE_OPTIONS;
  const [courseStats, setCourseStats] = useState({
    total_courses: 0,
    active_courses: 0,
    total_students: 0,
    total_revenue: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    grade_level: '',
    course_type: 'monthly',
    price_type: 'FREE',
    price: 0,
    status: 'DRAFT',
    visibility: 'PUBLIC',
  });

  const mapCourse = (course) => ({
    ...course,
    id: course?.course_id || course?.id,
    subject: course?.subject,
    grade_level: course?.grade_level?.name || course?.grade_level_name || course?.grade_level,
  });

  const loadCourses = useCallback(async () => {
    const coursesResponse = await courseAPI.getCourses({ page: 1, limit: 100 });
    const rows = coursesResponse?.data?.data || [];
    setCourses(Array.isArray(rows) ? rows.map(mapCourse) : []);
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const statsResponse = await courseAPI.getTeacherDashboardStats();
      const stats = statsResponse?.data?.data || {};
      setCourseStats({
        total_courses: stats?.total_courses || 0,
        active_courses: stats?.active_courses || 0,
        total_students: stats?.total_students || 0,
        total_revenue: stats?.total_revenue || 0,
      });
    } catch {
      setCourseStats({
        total_courses: 0,
        active_courses: 0,
        total_students: 0,
        total_revenue: 0,
      });
    }
  }, []);

  const loadPageData = useCallback(async () => {
    try {
      setLoading(true);
      await loadCourses();
      await loadStats();
    } catch (err) {
      showNotification(getErrorMessage(err, 'Failed to load courses'), 'error');
    } finally {
      setLoading(false);
    }
  }, [loadCourses, loadStats]);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

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
      showNotification('Title and description are required', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const createPayload = {
        title: formData.title,
        description: formData.description,
        subject: formData.subject || undefined,
        grade_level: formData.grade_level || undefined,
        course_type: formData.course_type || undefined,
        is_paid: formData.price_type === 'PAID',
        price: formData.price_type === 'PAID' ? Number(formData.price || 0) : 0,
        visibility: String(formData.visibility || 'PUBLIC').toLowerCase(),
      };

      const createdResponse = await courseAPI.createCourse(createPayload);
      const createdCourse = createdResponse?.data?.data;
      const createdId = createdCourse?.course_id || createdCourse?.id;

      if (createdId && String(formData.status).toUpperCase() === 'PUBLISHED') {
        await courseAPI.publishCourse(createdId);
      }
      if (createdId && String(formData.visibility).toUpperCase() === 'PRIVATE') {
        await courseAPI.setCoursePrivate(createdId);
      }

      await loadCourses();
      await loadStats();
      showNotification('Course created successfully', 'success');
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      showNotification(getErrorMessage(err, 'Failed to create course'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (courseId) => {
    setCourseToDelete(courseId);
    setShowDeleteModal(true);
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      setIsSubmitting(true);
      await courseAPI.deleteCourse(courseToDelete);
      await loadCourses();
      await loadStats();
      showNotification('Course deleted successfully', 'success');
      setShowDeleteModal(false);
      setCourseToDelete(null);
    } catch (err) {
      showNotification(getErrorMessage(err, 'Failed to delete course'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      grade_level: '',
      course_type: 'monthly',
      price_type: 'FREE',
      price: 0,
      status: 'DRAFT',
      visibility: 'PUBLIC',
    });
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
              courseTypes={courseTypes}
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
