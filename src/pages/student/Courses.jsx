import { useState, useMemo, useCallback } from 'react';
import { FaSearch, FaFilter, FaTimes, FaBook, FaBookOpen } from 'react-icons/fa';
import { MdOutlineWorkspacePremium } from 'react-icons/md';
import { GrCompliance } from 'react-icons/gr';
import Notification from '../../components/common/Notification';
import DataTable from '../../components/common/DataTable';
import {
  COURSE_SUBJECT_OPTIONS,
  COURSE_GRADE_LEVEL_OPTIONS,
  COURSE_TYPE_OPTIONS,
} from '../../utils/courseOptions';

const StudentCourses = () => {
  // Dummy data
  const dummyNewCourses = [
    { id: 1, title: 'Advanced Python', teacher_name: 'Dr. John', price: 49.99, rating: 4.8, students: 245 },
    { id: 2, title: 'Web Development 101', teacher_name: 'Mr. Davis', price: 39.99, rating: 4.6, students: 180 },
  ];
  
  const dummyEnrolledCourses = [
    { id: 1, title: 'JavaScript Basics', progress: 45, teacher_name: 'Jane Smith' },
    { id: 2, title: 'React Fundamentals', progress: 65, teacher_name: 'John Doe' },
  ];

  const dummyCompletedCourses = [
    { id: 1, title: 'HTML & CSS Basics', certificate: true, teacher_name: 'Tom Wilson' },
  ];

  const dummyGradeLevels = COURSE_GRADE_LEVEL_OPTIONS.map((grade) => ({
    id: grade.value,
    name: grade.label,
  }));
  const dummySubjects = COURSE_SUBJECT_OPTIONS.map((subject) => ({
    id: subject.value,
    name: subject.label,
  }));
  const dummyCourseTypes = COURSE_TYPE_OPTIONS.map((type) => ({
    id: type.value,
    name: type.label,
  }));

  const [activeTab, setActiveTab] = useState('enrolled');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const newCourses = dummyNewCourses;
  const enrolledCourses = dummyEnrolledCourses;
  const completedCourses = dummyCompletedCourses;
  const loading = false;
  const error = null;
  const gradeLevels = dummyGradeLevels;
  const subjects = dummySubjects;
  const courseTypes = dummyCourseTypes;
  const [filters, setFilters] = useState({
    grades: [],
    subjects: [],
    types: [],
    priceRange: [0, 15000],
    rating: 0
  });

  const [notification, setNotification] = useState(null);

  // Filter Application Function
  const applyFilters = useCallback((coursesToFilter) => {
    return coursesToFilter.filter(course => {
      const matchesSearch = 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        false;

      const matchesGrade = filters.grades.length === 0 || (course.grade && filters.grades.includes(course.grade));
      const matchesSubject = filters.subjects.length === 0 || (course.subject && filters.subjects.includes(course.subject));
      const matchesType = filters.types.length === 0 || !course.type || filters.types.includes(course.type);
      const matchesPrice = !course.price || (course.price >= filters.priceRange[0] && course.price <= filters.priceRange[1]);
      const matchesRating = !course.rating || course.rating >= filters.rating;

      return matchesSearch && matchesGrade && matchesSubject && matchesType && matchesPrice && matchesRating;
    });
  }, [searchQuery, filters]);

  // Apply filters
  const filteredNewCourses = useMemo(() => applyFilters(newCourses), [applyFilters, newCourses]);
  const filteredEnrolledCourses = useMemo(() => applyFilters(enrolledCourses), [applyFilters, enrolledCourses]);
  const filteredCompletedCourses = useMemo(() => applyFilters(completedCourses), [applyFilters, completedCourses]);

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

  const tableColumns = useMemo(() => {
    if (activeTab === 'new') {
      return [
        { key: 'title', label: 'Course Title' },
        { key: 'teacher_name', label: 'Teacher' },
        { key: 'subject', label: 'Subject', render: (value) => value || 'N/A' },
        {
          key: 'price',
          label: 'Price',
          render: (value) => (value ? `Rs. ${Number(value).toLocaleString()}` : 'Free'),
        },
        {
          key: 'rating',
          label: 'Rating',
          render: (value) => (value ? `${value} Stars` : 'N/A'),
        },
        {
          key: 'students',
          label: 'Students',
          render: (value) => (value ? Number(value).toLocaleString() : '0'),
        },
      ];
    }

    if (activeTab === 'enrolled') {
      return [
        { key: 'title', label: 'Course Title' },
        { key: 'teacher_name', label: 'Teacher' },
        { key: 'subject', label: 'Subject', render: (value) => value || 'N/A' },
        {
          key: 'progress',
          label: 'Progress',
          render: (value) => (
            <div className="min-w-28">
              <p className="text-xs text-slate-600 mb-1">{value || 0}%</p>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600"
                  style={{ width: `${value || 0}%` }}
                />
              </div>
            </div>
          ),
        },
      ];
    }

    return [
      { key: 'title', label: 'Course Title' },
      { key: 'teacher_name', label: 'Teacher' },
      { key: 'subject', label: 'Subject', render: (value) => value || 'N/A' },
      {
        key: 'certificate',
        label: 'Certificate',
        render: (value) => (
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              value ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {value ? 'Available' : 'Not Available'}
          </span>
        ),
      },
    ];
  }, [activeTab]);

  const tableConfig = useMemo(
    () => ({
      itemsPerPage: 9,
      hideSearch: true,
      emptyMessage:
        activeTab === 'new'
          ? 'No courses match your filters'
          : activeTab === 'enrolled'
          ? 'No enrolled courses. Start learning today!'
          : 'No completed courses yet. Keep learning!',
    }),
    [activeTab]
  );

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
                        checked={filters.grades.includes(grade.name)}
                        onChange={() => handleFilterChange('grades', grade.name)}
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
                        checked={filters.subjects.includes(subject.name)}
                        onChange={() => handleFilterChange('subjects', subject.name)}
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

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6">
            <DataTable
              data={currentFilteredCourses}
              columns={tableColumns}
              config={tableConfig}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourses;
