import { useState, useMemo, useCallback, useEffect } from 'react';
import { FaSearch, FaFilter, FaTimes, FaBook, FaBookOpen } from 'react-icons/fa';
import { MdOutlineWorkspacePremium } from 'react-icons/md';
import { GrCompliance } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';
import Notification from '../../components/common/Notification';
import CourseCard from '../../components/common/CourseCard';
import { courseAPI } from '../../api/course';
import {
  COURSE_SUBJECT_OPTIONS,
  COURSE_GRADE_LEVEL_OPTIONS,
  COURSE_TYPE_OPTIONS,
} from '../../utils/courseOptions';

const StudentCourses = () => {
  const navigate = useNavigate();
  const gradeLevels = COURSE_GRADE_LEVEL_OPTIONS.map((grade) => ({
    id: grade.value,
    name: grade.label,
  }));
  const subjects = COURSE_SUBJECT_OPTIONS.map((subject) => ({
    id: subject.value,
    name: subject.label,
  }));
  const courseTypes = COURSE_TYPE_OPTIONS.map((type) => ({
    id: type.value,
    name: type.label,
  }));

  const [activeTab, setActiveTab] = useState('enrolled');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [newCourses, setNewCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loadingDiscover, setLoadingDiscover] = useState(false);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    grades: [],
    subjects: [],
    types: [],
    priceRange: [0, 15000],
    rating: 0
  });

  const [notification, setNotification] = useState(null);
  const loading = loadingDiscover || loadingEnrollments;

  const subjectLabelMap = useMemo(
    () => COURSE_SUBJECT_OPTIONS.reduce((acc, option) => ({ ...acc, [option.value]: option.label }), {}),
    []
  );

  const mapCourse = useCallback(
    (course, extra = {}) => {
      const rawRating = course?.average_rating ?? course?.rating;
      const parsedRating = Number.parseFloat(rawRating);

      return {
        ...course,
        ...extra,
        id: course?.course_id || course?.id,
        title: course?.title || 'Untitled Course',
        teacher_name: course?.teacher_name || course?.instructor_name || 'N/A',
        thumbnail: course?.thumbnail || course?.thumbnail_url || null,
        subject: subjectLabelMap[course?.subject] || course?.subject || 'N/A',
        subject_value: course?.subject,
        grade: course?.grade_level || '',
        type: course?.course_type || '',
        price: Number(course?.price || 0),
        rating: Number.isFinite(parsedRating) ? parsedRating : null,
        students: Number(course?.total_enrollments || 0),
        progress: Number(course?.progress || 0),
        certificate: extra.certificate ?? Boolean(course?.completed_at),
        description: course?.description || '',
      };
    },
    [subjectLabelMap]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadNewCourses = useCallback(async () => {
    const params = {
      page: 1,
      limit: 200,
      ...(debouncedSearchQuery ? { q: debouncedSearchQuery } : {}),
      ...(filters.subjects.length === 1 ? { subject: filters.subjects[0] } : {}),
      ...(filters.grades.length === 1 ? { grade_level: filters.grades[0] } : {}),
      ...(filters.types.length === 1 ? { course_type: filters.types[0] } : {}),
    };

    const response = await courseAPI.getCourses(params);
    const rows = response?.data?.data || [];
    setNewCourses(Array.isArray(rows) ? rows.map((row) => mapCourse(row)) : []);
  }, [debouncedSearchQuery, filters.subjects, filters.grades, filters.types, mapCourse]);

  const loadMyCourses = useCallback(async () => {
    const [enrolledRes, inProgressRes, completedRes] = await Promise.all([
      courseAPI.getMyCourses({ status: 'enrolled', page: 1, limit: 200 }),
      courseAPI.getMyCourses({ status: 'in_progress', page: 1, limit: 200 }),
      courseAPI.getMyCourses({ status: 'completed', page: 1, limit: 200 }),
    ]);

    const enrolledRows = enrolledRes?.data?.data || [];
    const inProgressRows = inProgressRes?.data?.data || [];
    const completedRows = completedRes?.data?.data || [];

    const allEnrolled = [...enrolledRows, ...inProgressRows];

    setEnrolledCourses(Array.isArray(allEnrolled) ? allEnrolled.map((row) => mapCourse(row)) : []);
    setCompletedCourses(
      Array.isArray(completedRows)
        ? completedRows.map((row) =>
            mapCourse(row, {
              certificate: true,
            })
          )
        : []
    );
  }, [mapCourse]);

  useEffect(() => {
    const loadDiscoverCourses = async () => {
      try {
        setLoadingDiscover(true);
        setError(null);
        await loadNewCourses();
      } catch (err) {
        const message = err?.message || 'Failed to load courses';
        setError(message);
        setNotification({ message, type: 'error', duration: 5000 });
      } finally {
        setLoadingDiscover(false);
      }
    };

    loadDiscoverCourses();
  }, [loadNewCourses]);

  useEffect(() => {
    const loadStudentEnrollments = async () => {
      try {
        setLoadingEnrollments(true);
        setError(null);
        await loadMyCourses();
      } catch (err) {
        const message = err?.message || 'Failed to load my courses';
        setError(message);
        setNotification({ message, type: 'error', duration: 5000 });
      } finally {
        setLoadingEnrollments(false);
      }
    };

    loadStudentEnrollments();
  }, [loadMyCourses]);

  // Filter Application Function
  const applyFilters = useCallback((coursesToFilter) => {
    return coursesToFilter.filter(course => {
      const matchesSearch = 
        course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        false;

      const matchesGrade = filters.grades.length === 0 || (course.grade && filters.grades.includes(course.grade));
      const matchesSubject = filters.subjects.length === 0 || (course.subject_value && filters.subjects.includes(course.subject_value));
      const matchesType = filters.types.length === 0 || !course.type || filters.types.includes(course.type);
      const matchesPrice = course.price >= filters.priceRange[0] && course.price <= filters.priceRange[1];
      const matchesRating = filters.rating === 0 || course.rating >= filters.rating;

      return matchesSearch && matchesGrade && matchesSubject && matchesType && matchesPrice && matchesRating;
    });
  }, [searchQuery, filters]);

  // Apply filters
  const filteredNewCourses = useMemo(() => applyFilters(newCourses), [applyFilters, newCourses]);
  const filteredEnrolledCourses = useMemo(() => applyFilters(enrolledCourses), [applyFilters, enrolledCourses]);
  const filteredCompletedCourses = useMemo(() => applyFilters(completedCourses), [applyFilters, completedCourses]);

  const enrolledCourseIds = useMemo(
    () => new Set(enrolledCourses.map((course) => String(course.id)).filter(Boolean)),
    [enrolledCourses]
  );

  const completedCourseIds = useMemo(
    () => new Set(completedCourses.map((course) => String(course.id)).filter(Boolean)),
    [completedCourses]
  );

  const currentFilteredCount = 
    activeTab === 'new' ? filteredNewCourses.length :
    activeTab === 'enrolled' ? filteredEnrolledCourses.length :
    filteredCompletedCourses.length;

  const currentFilteredCourses =
    activeTab === 'new'
      ? filteredNewCourses
      : activeTab === 'enrolled'
      ? filteredEnrolledCourses
      : filteredCompletedCourses;

  // Event handlers for CourseCard buttons
  const handleAddToCart = useCallback((course) => {
    setNotification({ message: `${course.title} added to cart!`, type: 'success', duration: 3000 });
  }, []);

  const handleContinueLearning = useCallback((course) => {
    navigate(`/student/course/${course.id}/learn`);
  }, [navigate]);

  const handleViewStats = useCallback((course) => {
    navigate(`/student/course/${course.id}/stats`);
  }, [navigate]);

  const handleDownloadCertificate = useCallback((courseId) => {
    // TODO: Implement certificate download API call
    console.log('Downloading certificate for course:', courseId);
    setNotification({ message: 'Downloading certificate...', type: 'success', duration: 3000 });
  }, []);

  const handleViewReport = useCallback((courseId) => {
    navigate(`/student/course/${courseId}/report`);
  }, [navigate]);

  const getEmptyMessage = () => {
    if (activeTab === 'new') return 'No courses match your filters';
    if (activeTab === 'enrolled') return 'No enrolled courses. Start learning today!';
    return 'No completed courses yet. Keep learning!';
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const updated = { ...prev };
      if (updated[filterType].includes(value)) {
        updated[filterType] = updated[filterType].filter(v => v !== value);
      } else {
        updated[filterType] = [...updated[filterType], value];
      }
      return updated;
    });
  };

  const handleResetFilters = () => {
    setFilters({
      grades: [],
      subjects: [],
      types: [],
      priceRange: [0, 15000],
      rating: 0
    });
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse mb-3"></div>
                <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Filters Skeleton */}
          <div className="bg-white rounded-lg p-4 mb-8 border flex gap-3">
            <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Courses Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border overflow-hidden">
                <div className="h-40 w-full bg-gray-200 animate-pulse mb-4"></div>
                <div className="px-4 pb-4 space-y-3">
                  <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse"></div>
                  <div className="flex gap-2 pt-2">
                    <div className="flex-1 h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex-1 h-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Notification
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Courses
            </h1>
            <p className="text-slate-600 mt-1">Browse, learn, and track your progress</p>
          </div>
          <div className="text-5xl"><FaBook className="text-blue-600" /></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <FaSearch className="absolute left-4 top-4 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search courses by title, subject, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 bg-white rounded-xl p-2 border border-slate-200 shadow-sm">
          <button
            onClick={() => {
              setActiveTab('new');
            }}
            className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-all ${
              activeTab === 'new'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            New Courses ({filteredNewCourses.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('enrolled');
            }}
            className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-all ${
              activeTab === 'enrolled'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Enrolled ({filteredEnrolledCourses.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('completed');
            }}
            className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-all ${
              activeTab === 'completed'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Completed ({filteredCompletedCourses.length})
          </button>
        </div>

        {/* Filter Toggle Button */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all font-semibold text-slate-900"
          >
            <FaFilter className="text-blue-600" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          {(filters.grades.length > 0 ||
            filters.subjects.length > 0 ||
            filters.types.length > 0 ||
            filters.priceRange[0] > 0 ||
            filters.priceRange[1] < 15000 ||
            filters.rating > 0 ||
            searchQuery) && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all font-semibold"
            >
              <FaTimes /> Clear All Filters
            </button>
          )}
        </div>

        {/* Filter Section */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-8 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            {/* Grade Filter */}
            <div>
              <h6 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                 Grade Level
              </h6>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {gradeLevels.length > 0 ? (
                  gradeLevels.map(grade => (
                    <label key={grade.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded text-sm">
                      <input
                        type="checkbox"
                        checked={filters.grades.includes(grade.id)}
                        onChange={() => handleFilterChange('grades', grade.id)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-slate-700">{grade.name}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm">Loading grades...</p>
                )}
              </div>
            </div>

            {/* Subject Filter */}
            <div>
              <h6 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                 Subject
              </h6>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {subjects.length > 0 ? (
                  subjects.map(subject => (
                    <label key={subject.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded text-sm">
                      <input
                        type="checkbox"
                        checked={filters.subjects.includes(subject.id)}
                        onChange={() => handleFilterChange('subjects', subject.id)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-slate-700">{subject.name}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm">Loading subjects...</p>
                )}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h6 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                 Course Type
              </h6>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {courseTypes.length > 0 ? (
                  courseTypes.map((type) => (
                    <label key={type.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded text-sm">
                      <input
                        type="checkbox"
                        checked={filters.types.includes(type.id)}
                        onChange={() => handleFilterChange('types', type.id)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-slate-700">{type.name}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm">Loading course types...</p>
                )}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h6 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                 Price Range
              </h6>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-600">Min: Rs. {filters.priceRange[0]}</label>
                  <input
                    type="range"
                    min="0"
                    max="15000"
                    step="500"
                    value={filters.priceRange[0]}
                    onChange={(e) => {
                      const newMin = parseInt(e.target.value);
                      if (newMin <= filters.priceRange[1]) {
                        setFilters(prev => ({ ...prev, priceRange: [newMin, prev.priceRange[1]] }));
                      }
                    }}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600">Max: Rs. {filters.priceRange[1]}</label>
                  <input
                    type="range"
                    min="0"
                    max="15000"
                    step="500"
                    value={filters.priceRange[1]}
                    onChange={(e) => {
                      const newMax = parseInt(e.target.value);
                      if (newMax >= filters.priceRange[0]) {
                        setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], newMax] }));
                      }
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h6 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                 Minimum Rating
              </h6>
              <div className="space-y-2">
                {[0, 4, 4.5, 4.7].map(rating => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === rating}
                      onChange={() => setFilters(prev => ({ ...prev, rating }))}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-slate-700 text-sm">
                      {rating === 0 ? 'All Ratings' : `${rating}+ Stars`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            {activeTab === 'new' && (
              <>
                <MdOutlineWorkspacePremium /> New Courses Available
              </>
            )}
            {activeTab === 'enrolled' && (
              <>
                <FaBookOpen /> Currently Enrolled Courses
              </>
            )}
            {activeTab === 'completed' && (
              <>
                <GrCompliance /> Completed Courses
              </>
            )}
          </h2>
          <p className="text-slate-600 mb-6">Showing {currentFilteredCount} course(s)</p>

          {currentFilteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentFilteredCourses.map((course) => {
                  const courseId = String(course.id);
                  const derivedStatus = activeTab === 'new'
                    ? completedCourseIds.has(courseId)
                      ? 'completed'
                      : enrolledCourseIds.has(courseId)
                      ? 'enrolled'
                      : 'new'
                    : activeTab;

                  return (
                <CourseCard
                  key={course.id}
                  course={course}
                  userType="student"
                  courseStatus={derivedStatus}
                  onAddToCart={handleAddToCart}
                  onContinueLearning={handleContinueLearning}
                  onViewStats={handleViewStats}
                  onDownloadCertificate={handleDownloadCertificate}
                  onViewReport={handleViewReport}
                  loading={loading}
                />
                  );
                })}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
              <FaBook className="mx-auto text-5xl text-slate-300 mb-4" />
              <p className="text-slate-600 text-lg font-medium">{getEmptyMessage()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCourses;
