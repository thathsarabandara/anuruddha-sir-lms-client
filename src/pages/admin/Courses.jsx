import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBook,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaTrash,
} from 'react-icons/fa';
import { CgSandClock } from 'react-icons/cg';

import Notification from '../../components/common/Notification';
import StatCard from '../../components/common/StatCard';
import ButtonWithLoader from '../../components/common/ButtonWithLoader';
import DataTable from '../../components/common/DataTable';
import { courseAPI } from '../../api/course';

const PAGE_SIZE = 12;

const formatStatus = (status) => String(status || '').toUpperCase();

const statusBadge = (status) => {
  const normalized = formatStatus(status);
  if (normalized === 'PUBLISHED') return 'bg-green-100 text-green-700';
  if (normalized === 'ARCHIVED') return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-700';
};

const AdminCourses = () => {
  const navigate = useNavigate();

  const [notification, setNotification] = useState(null);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [coursesLoading, setCoursesLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  const fetchCourses = useCallback(async () => {
    setCoursesLoading(true);
    try {
      const params = {
        page: 1,
        limit: PAGE_SIZE,
      };

      if (searchTerm.trim()) params.q = searchTerm.trim();
      if (filterStatus !== 'all') params.status = filterStatus.toLowerCase();

      const response = await courseAPI.getTeacherCourses(params);
      const rows = response?.data?.data || [];
      setCourses(Array.isArray(rows) ? rows : []);
    } catch (err) {
      showNotification(err?.data?.message || err?.message || 'Failed to load courses', 'error');
      setCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  }, [searchTerm, filterStatus]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const publishedCourses = courses.filter((c) => formatStatus(c.status) === 'PUBLISHED').length;
    const draftCourses = courses.filter((c) => formatStatus(c.status) === 'DRAFT').length;
    const archivedCourses = courses.filter((c) => formatStatus(c.status) === 'ARCHIVED').length;

    return {
      total_courses: totalCourses,
      published_courses: publishedCourses,
      draft_courses: draftCourses,
      archived_courses: archivedCourses,
    };
  }, [courses]);

  const metricsConfig = [
    {
      label: 'Total Courses',
      statsKey: 'total_courses',
      icon: FaBook,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'all courses',
    },
    {
      label: 'Published',
      statsKey: 'published_courses',
      icon: FaCheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'live courses',
    },
    {
      label: 'Draft',
      statsKey: 'draft_courses',
      icon: CgSandClock,
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      description: 'needs publish',
    },
    {
      label: 'Archived',
      statsKey: 'archived_courses',
      icon: FaExclamationTriangle,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      description: 'inactive',
    },
  ];

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setShowDetailsModal(true);
  };

  const handleChangeStatus = async (course, nextStatus) => {
    const courseId = course.course_id || course.id;
    if (!courseId) return;

    setActionLoading(true);
    try {
      if (nextStatus === 'published') await courseAPI.publishCourse(courseId);
      if (nextStatus === 'draft') await courseAPI.unpublishCourse(courseId);
      if (nextStatus === 'archived') await courseAPI.archiveCourse(courseId);

      showNotification('Course status updated successfully', 'success');
      await fetchCourses();
      setShowDetailsModal(false);
    } catch (err) {
      showNotification(err?.data?.message || err?.message || 'Failed to update course status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCourse = async (course) => {
    const courseId = course.course_id || course.id;
    if (!courseId) return;

    if (!window.confirm('Delete this course permanently? This cannot be undone.')) return;

    setActionLoading(true);
    try {
      await courseAPI.deleteCourse(courseId);
      showNotification('Course deleted successfully', 'success');
      await fetchCourses();
      setShowDetailsModal(false);
    } catch (err) {
      showNotification(
        err?.data?.message || err?.message || 'Failed to delete course. It may have enrollments.',
        'error'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const goToCourseContent = (course) => {
    const courseId = course.course_id || course.id;
    if (!courseId) return;
    navigate(`/admin/courses/${courseId}`);
  };

  const tableRows = useMemo(
    () =>
      courses.map((course) => ({
        id: course.course_id || course.id,
        title: course.title || 'Untitled',
        teacher_name: course.teacher_name || 'N/A',
        subject: course.subject || 'N/A',
        grade_level: course.grade_level || 'N/A',
        status: formatStatus(course.status),
        total_enrollments: course.total_enrollments || 0,
        total_revenue: Number(course.total_revenue || 0),
        raw: course,
      })),
    [courses]
  );

  const columns = [
      {
        key: 'title',
        label: 'Course',
        render: (value, row) => (
          <div>
            <p className="font-semibold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{row.subject} | Grade {row.grade_level}</p>
          </div>
        ),
      },
      {
        key: 'teacher_name',
        label: 'Teacher',
      },
      {
        key: 'status',
        label: 'Status',
        render: (value) => (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(value)}`}>
            {value}
          </span>
        ),
      },
      {
        key: 'total_enrollments',
        label: 'Enrollments',
      },
      {
        key: 'total_revenue',
        label: 'Revenue',
        render: (value) => `Rs. ${Number(value || 0).toLocaleString()}`,
      },
      {
        key: 'actions',
        label: 'Actions',
        searchable: false,
        render: (_, row) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium"
              onClick={() => handleViewDetails(row.raw)}
            >
              <span className="inline-flex items-center gap-1">
                <FaEye />
                Details
              </span>
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-xs font-medium"
              onClick={() => goToCourseContent(row.raw)}
            >
              Content
            </button>
          </div>
        ),
      },
    ];

  return (
    <div className="p-8">
      {notification && (
        <div className="fixed top-4 left-4 right-4 z-50 max-w-sm">
          <Notification {...notification} onClose={() => setNotification(null)} />
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
          <p className="text-gray-600">Manage courses using live backend data from course routes</p>
        </div>
      </div>

      <StatCard stats={stats} metricsConfig={metricsConfig} loading={coursesLoading} />

      <div className="card mb-6">
        <DataTable
          data={tableRows}
          columns={columns}
          loading={coursesLoading}
          config={{
            itemsPerPage: 10,
            searchPlaceholder: 'Search courses by title, teacher or subject...',
            searchValue: searchTerm,
            onSearchChange: setSearchTerm,
            emptyMessage: 'No courses found',
            statusFilterOptions: [
              { label: 'All Status', value: 'all' },
              { label: 'Published', value: 'published' },
              { label: 'Draft', value: 'draft' },
              { label: 'Archived', value: 'archived' },
            ],
            statusFilterValue: filterStatus,
            onStatusFilterChange: setFilterStatus,
          }}
        />
      </div>

      {showDetailsModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Course Details</h2>
              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                x
              </button>
            </div>

            <div className="space-y-3 mb-6 text-sm">
              <p><strong>Title:</strong> {selectedCourse.title}</p>
              <p><strong>Teacher:</strong> {selectedCourse.teacher_name || 'N/A'}</p>
              <p><strong>Status:</strong> {formatStatus(selectedCourse.status)}</p>
              <p><strong>Visibility:</strong> {String(selectedCourse.visibility || 'N/A')}</p>
              <p><strong>Price:</strong> {selectedCourse.is_paid ? `Rs. ${selectedCourse.price || 0}` : 'Free'}</p>
              <p><strong>Enrollments:</strong> {selectedCourse.total_enrollments || 0}</p>
              <p><strong>Average Rating:</strong> {Number(selectedCourse.average_rating || 0).toFixed(1)}</p>
              <p><strong>Description:</strong> {selectedCourse.description || 'N/A'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formatStatus(selectedCourse.status) !== 'PUBLISHED' && (
                <ButtonWithLoader
                  label="Publish"
                  loadingLabel="Publishing..."
                  isLoading={actionLoading}
                  onClick={() => handleChangeStatus(selectedCourse, 'published')}
                  variant="success"
                  fullWidth
                />
              )}

              {formatStatus(selectedCourse.status) === 'PUBLISHED' && (
                <ButtonWithLoader
                  label="Move To Draft"
                  loadingLabel="Updating..."
                  isLoading={actionLoading}
                  onClick={() => handleChangeStatus(selectedCourse, 'draft')}
                  variant="secondary"
                  fullWidth
                />
              )}

              {formatStatus(selectedCourse.status) !== 'ARCHIVED' && (
                <ButtonWithLoader
                  label="Archive"
                  loadingLabel="Archiving..."
                  isLoading={actionLoading}
                  onClick={() => handleChangeStatus(selectedCourse, 'archived')}
                  variant="warning"
                  fullWidth
                />
              )}

              <button
                type="button"
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                onClick={() => goToCourseContent(selectedCourse)}
              >
                View Course Content
              </button>

              <ButtonWithLoader
                label="Delete Course"
                loadingLabel="Deleting..."
                isLoading={actionLoading}
                onClick={() => handleDeleteCourse(selectedCourse)}
                icon={<FaTrash />}
                variant="danger"
                fullWidth
              />

              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="w-full btn-outline py-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
