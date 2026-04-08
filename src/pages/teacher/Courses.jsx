import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaBook, FaUsers, FaDollarSign, FaCheckCircle } from 'react-icons/fa';
import { BiLoader } from 'react-icons/bi';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import CreateCourseForm from '../../components/teacher/CreateCourseForm';
import Notification from '../../components/common/Notification';
import { courseAPI } from '../../api/course';
import { COURSE_SUBJECT_OPTIONS, COURSE_GRADE_LEVEL_OPTIONS, COURSE_TYPE_OPTIONS } from '../../utils/courseOptions';

const getErrorMessage = (err, fallback = 'Something went wrong') =>
  err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;

const TeacherCourses = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    grade_level: '',
    course_type: '',
    subject: '',
    status: '',
    visibility: '',
    price_type: '',
  });
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
    price_type: course?.is_paid ? 'paid' : 'free',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadCourses = useCallback(async () => {
    const queryParams = {
      page: 1,
      limit: 200,
      ...(debouncedSearchTerm ? { q: debouncedSearchTerm } : {}),
      ...(filters.grade_level ? { grade_level: filters.grade_level } : {}),
      ...(filters.course_type ? { course_type: filters.course_type } : {}),
      ...(filters.subject ? { subject: filters.subject } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.visibility ? { visibility: filters.visibility } : {}),
      ...(filters.price_type
        ? { is_paid: filters.price_type === 'paid' }
        : {}),
    };

    const coursesResponse = await courseAPI.getTeacherCourses(queryParams);
    const rows = coursesResponse?.data?.data || [];
    setCourses(Array.isArray(rows) ? rows.map(mapCourse) : []);
  }, [
    debouncedSearchTerm,
    filters.grade_level,
    filters.course_type,
    filters.subject,
    filters.status,
    filters.visibility,
    filters.price_type,
  ]);

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

  const loadStatsData = useCallback(async () => {
    try {
      await loadStats();
    } catch (err) {
      showNotification(getErrorMessage(err, 'Failed to load course stats'), 'error');
    }
  }, [loadStats]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        await loadCourses();
      } catch (err) {
        showNotification(getErrorMessage(err, 'Failed to load courses'), 'error');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [loadCourses]);

  useEffect(() => {
    loadStatsData();
  }, [loadStatsData]);

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
        language: "en",
        course_type: formData.course_type || "monthly",
        status: String(formData.status || 'DRAFT').toLowerCase(),
        visibility: String(formData.visibility || 'PUBLIC').toLowerCase(),
        is_paid: formData.price_type === 'PAID',
        price: formData.price_type === 'PAID' ? Number(formData.price || 0) : null,
      };

      await courseAPI.createCourse(createPayload);

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

  const subjectLabelMap = useMemo(() => {
    return COURSE_SUBJECT_OPTIONS.reduce((acc, option) => {
      acc[option.value] = option.label;
      return acc;
    }, {});
  }, []);

  const typeLabelMap = useMemo(() => {
    return COURSE_TYPE_OPTIONS.reduce((acc, option) => {
      acc[option.value] = option.label;
      return acc;
    }, {});
  }, []);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({
      grade_level: '',
      course_type: '',
      subject: '',
      status: '',
      visibility: '',
      price_type: '',
    });
  };

  const hasActiveFilters =
    !!searchTerm || Object.values(filters).some((value) => Boolean(value));

  const tableColumns = [
    {
      key: 'title',
      label: 'Course',
      searchable: true,
      render: (_, row) => (
        <div>
          <p className="font-semibold text-gray-900">{row.title}</p>
          <p className="text-xs text-gray-500 line-clamp-1">{row.description || 'No description'}</p>
        </div>
      ),
    },
    {
      key: 'grade_level',
      label: 'Grade',
      render: (value) => <span className="text-sm text-gray-700">{value ? `Grade ${value}` : '-'}</span>,
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (value) => <span className="text-sm text-gray-700">{subjectLabelMap[value] || value || '-'}</span>,
    },
    {
      key: 'course_type',
      label: 'Type',
      render: (value) => <span className="text-sm text-gray-700">{typeLabelMap[value] || value || '-'}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
          value === 'published'
            ? 'bg-green-100 text-green-700'
            : value === 'archived'
              ? 'bg-gray-200 text-gray-700'
              : 'bg-yellow-100 text-yellow-700'
        }`}>
          {String(value || 'draft').toUpperCase()}
        </span>
      ),
    },
    {
      key: 'visibility',
      label: 'Visibility',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
          value === 'private' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {String(value || 'public').toUpperCase()}
        </span>
      ),
    },
    {
      key: 'price_type',
      label: 'Price Type',
      render: (_, row) => (
        <span className="text-sm text-gray-700">{row.is_paid ? 'PAID' : 'FREE'}</span>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      render: (_, row) => (
        <span className="text-sm font-medium text-gray-900">
          {row.is_paid ? `Rs. ${Number(row.price || 0).toLocaleString()}` : 'Free'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-3 whitespace-nowrap">
          <button
            onClick={() => navigate(`/teacher/courses/${row.id}?mode=view`)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View
          </button>
          <button
            onClick={() => navigate(`/teacher/courses/${row.id}?mode=edit`)}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => confirmDelete(row.id)}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

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

      <div className="card mt-6">
        <div className="mb-4 flex flex-col lg:flex-row lg:items-center gap-3">
          <select
            value={filters.grade_level}
            onChange={(e) => updateFilter('grade_level', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700"
          >
            <option value="">All Grades</option>
            {gradeLevels.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            value={filters.course_type}
            onChange={(e) => updateFilter('course_type', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700"
          >
            <option value="">All Course Types</option>
            {courseTypes.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            value={filters.subject}
            onChange={(e) => updateFilter('subject', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700"
          >
            <option value="">All Subjects</option>
            {subjects.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={filters.visibility}
            onChange={(e) => updateFilter('visibility', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700"
          >
            <option value="">All Visibility</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          <select
            value={filters.price_type}
            onChange={(e) => updateFilter('price_type', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700"
          >
            <option value="">All Price Types</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
            >
              Clear Filters
            </button>
          )}
        </div>

        <DataTable
          data={courses}
          columns={tableColumns}
          config={{
            itemsPerPage: 10,
            searchPlaceholder: 'Search by course name...',
            hideSearch: false,
            searchValue: searchTerm,
            onSearchChange: (value) => setSearchTerm(value),
            emptyMessage: 'No courses found for the selected filters',
          }}
          loading={loading}
        />
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
