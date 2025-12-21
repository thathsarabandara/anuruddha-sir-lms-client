import { useState, useMemo, useCallback } from 'react';
import { FaSearch, FaCheckCircle, FaChevronLeft, FaChevronRight, FaFilter, FaTimes, FaBook, FaBookOpen } from 'react-icons/fa';
import NewCourseCard from '../../components/student/NewCourseCard';
import EnrolledCourseCard from '../../components/student/EnrolledCourseCard';
import { MdOutlineWorkspacePremium } from 'react-icons/md';
import { GrCompliance } from 'react-icons/gr';
import CompletedCourseCard from '../../components/student/CompletedCourseCard';

const StudentCourses = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);
  const itemsPerPage = 9;

  // Filter States
  const [filters, setFilters] = useState({
    grades: [],
    subjects: [],
    types: [],
    priceRange: [0, 15000],
    rating: 0
  });

  // Newly Created Courses
  const newCourses = useMemo(() => [
    {
      id: 1,
      title: 'Advanced Algebra Mastery',
      subject: 'Mathematics',
      grade: 5,
      type: 'Theory Class',
      instructor: 'Anuruddha Sir',
      rating: 4.8,
      students: 234,
      price: 8500,
      priceText: 'Rs. 8,500',
      duration: '4 Weeks',
      lessons: 32,
      color: 'from-blue-500 to-blue-600',
      badge: 'New',
      description: 'Master advanced algebra concepts for competitive exams'
    },
    {
      id: 2,
      title: 'Literature & Comprehension',
      subject: 'Sinhala',
      grade: 5,
      type: 'Paper Classes',
      instructor: 'Anuruddha Sir',
      rating: 4.7,
      students: 156,
      price: 7500,
      priceText: 'Rs. 7,500',
      duration: '3 Weeks',
      lessons: 28,
      color: 'from-purple-500 to-purple-600',
      badge: 'New',
      description: 'Comprehensive guide to Sinhala literature and text analysis'
    },
    {
      id: 3,
      title: 'English Grammar Pro',
      subject: 'English',
      grade: 5,
      type: 'Quiz Classes',
      instructor: 'Anuruddha Sir',
      rating: 4.9,
      students: 312,
      price: 8000,
      priceText: 'Rs. 8,000',
      duration: '4 Weeks',
      lessons: 35,
      color: 'from-red-500 to-red-600',
      badge: 'New',
      description: 'Perfect your English grammar skills with practical exercises'
    },
    {
      id: 4,
      title: 'Environmental Science Essentials',
      subject: 'Parisaraya',
      grade: 5,
      type: 'Theory Class',
      instructor: 'Anuruddha Sir',
      rating: 4.6,
      students: 198,
      price: 7800,
      priceText: 'Rs. 7,800',
      duration: '3.5 Weeks',
      lessons: 30,
      color: 'from-green-500 to-green-600',
      badge: 'New',
      description: 'Essential environmental science concepts explained simply'
    },
    {
      id: 5,
      title: 'Tamil Language Foundation',
      subject: 'Tamil',
      grade: 5,
      type: 'Seminars',
      instructor: 'Anuruddha Sir',
      rating: 4.5,
      students: 89,
      price: 7200,
      priceText: 'Rs. 7,200',
      duration: '3 Weeks',
      lessons: 26,
      color: 'from-orange-500 to-orange-600',
      badge: 'New',
      description: 'Build strong foundation in Tamil language and grammar'
    },
    {
      id: 6,
      title: 'Mathematics Grade 4 Basics',
      subject: 'Mathematics',
      grade: 4,
      type: 'Theory Class',
      instructor: 'Anuruddha Sir',
      rating: 4.7,
      students: 145,
      price: 6500,
      priceText: 'Rs. 6,500',
      duration: '3 Weeks',
      lessons: 24,
      color: 'from-blue-500 to-blue-600',
      badge: 'New',
      description: 'Foundation concepts for Grade 4 mathematics'
    },
    {
      id: 7,
      title: 'Science Paper Practice',
      subject: 'Parisaraya',
      grade: 4,
      type: 'Paper Classes',
      instructor: 'Anuruddha Sir',
      rating: 4.4,
      students: 98,
      price: 6800,
      priceText: 'Rs. 6,800',
      duration: '2.5 Weeks',
      lessons: 20,
      color: 'from-green-500 to-green-600',
      badge: 'New',
      description: 'Intensive paper solving for Grade 4 science'
    },
    {
      id: 8,
      title: 'Grade 3 English Introduction',
      subject: 'English',
      grade: 3,
      type: 'Theory Class',
      instructor: 'Anuruddha Sir',
      rating: 4.6,
      students: 220,
      price: 5500,
      priceText: 'Rs. 5,500',
      duration: '2 Weeks',
      lessons: 16,
      color: 'from-red-500 to-red-600',
      badge: 'New',
      description: 'Basic English concepts for Grade 3 students'
    },
    {
      id: 9,
      title: 'Quiz Master Series',
      subject: 'Mathematics',
      grade: 5,
      type: 'Quiz Classes',
      instructor: 'Anuruddha Sir',
      rating: 4.8,
      students: 267,
      price: 8200,
      priceText: 'Rs. 8,200',
      duration: '4 Weeks',
      lessons: 40,
      color: 'from-blue-500 to-blue-600',
      badge: 'New',
      description: 'Daily quiz practice for mathematics mastery'
    },
    {
      id: 10,
      title: 'Science Seminar Series',
      subject: 'Parisaraya',
      grade: 4,
      type: 'Seminars',
      instructor: 'Anuruddha Sir',
      rating: 4.5,
      students: 134,
      price: 7000,
      priceText: 'Rs. 7,000',
      duration: '3 Weeks',
      lessons: 12,
      color: 'from-green-500 to-green-600',
      badge: 'New',
      description: 'Interactive seminar series on science topics'
    },
    {
      id: 11,
      title: 'Advanced Tamil Literature',
      subject: 'Tamil',
      grade: 5,
      type: 'Paper Classes',
      instructor: 'Anuruddha Sir',
      rating: 4.7,
      students: 76,
      price: 7800,
      priceText: 'Rs. 7,800',
      duration: '3.5 Weeks',
      lessons: 28,
      color: 'from-orange-500 to-orange-600',
      badge: 'New',
      description: 'Deep dive into Tamil literature and composition'
    },
    {
      id: 12,
      title: 'Sinhala Vocabulary Boost',
      subject: 'Sinhala',
      grade: 4,
      type: 'Theory Class',
      instructor: 'Anuruddha Sir',
      rating: 4.6,
      students: 112,
      price: 6200,
      priceText: 'Rs. 6,200',
      duration: '2.5 Weeks',
      lessons: 22,
      color: 'from-purple-500 to-purple-600',
      badge: 'New',
      description: 'Enhance Sinhala vocabulary and grammar skills'
    }
  ], []);

  // Enrolled Courses
  const enrolledCourses = useMemo(() => [
    {
      id: 20,
      title: 'Complete Scholarship Package',
      subject: 'All Subjects',
      grade: 5,
      type: 'Theory Class',
      progress: 65,
      nextClass: 'Today, 4:00 PM',
      instructor: 'Anuruddha Sir',
      lessonsCompleted: 26,
      totalLessons: 40,
      color: 'from-blue-500 to-blue-600',
      enrolledDate: 'Oct 15, 2025',
      rating: 4.8
    },
    {
      id: 21,
      title: 'Mathematics Excellence',
      subject: 'Mathematics',
      grade: 5,
      type: 'Paper Classes',
      progress: 80,
      nextClass: 'Tomorrow, 3:00 PM',
      instructor: 'Anuruddha Sir',
      lessonsCompleted: 16,
      totalLessons: 20,
      color: 'from-green-500 to-green-600',
      enrolledDate: 'Sep 20, 2025',
      rating: 4.9
    },
    {
      id: 22,
      title: 'Sinhala Language',
      subject: 'Sinhala',
      grade: 5,
      type: 'Quiz Classes',
      progress: 45,
      nextClass: 'Friday, 2:00 PM',
      instructor: 'Anuruddha Sir',
      lessonsCompleted: 9,
      totalLessons: 20,
      color: 'from-purple-500 to-purple-600',
      enrolledDate: 'Oct 01, 2025',
      rating: 4.7
    },
    {
      id: 23,
      title: 'English Language Basics',
      subject: 'English',
      grade: 4,
      type: 'Theory Class',
      progress: 55,
      nextClass: 'Wednesday, 5:00 PM',
      instructor: 'Anuruddha Sir',
      lessonsCompleted: 11,
      totalLessons: 20,
      color: 'from-red-500 to-red-600',
      enrolledDate: 'Oct 10, 2025',
      rating: 4.6
    }
  ], []);

  // Completed Courses
  const completedCourses = useMemo(() => [
    {
      id: 30,
      title: 'Grade 4 Mathematics Foundation',
      subject: 'Mathematics',
      grade: 4,
      type: 'Theory Class',
      completionDate: 'Aug 30, 2025',
      instructor: 'Anuruddha Sir',
      totalLessons: 20,
      finalScore: 92,
      certificate: true,
      color: 'from-green-500 to-green-600',
      feedback: 'Excellent performance',
      rating: 4.8,
      price: 6500,
      description: 'Foundation concepts for Grade 4 mathematics'
    },
    {
      id: 31,
      title: 'Basic Sinhala Grammar',
      subject: 'Sinhala',
      grade: 3,
      type: 'Paper Classes',
      completionDate: 'Jul 15, 2025',
      instructor: 'Anuruddha Sir',
      totalLessons: 18,
      finalScore: 88,
      certificate: true,
      color: 'from-purple-500 to-purple-600',
      feedback: 'Very good progress',
      rating: 4.7,
      price: 5500,
      description: 'Basic Sinhala grammar for Grade 3 students'
    },
    {
      id: 32,
      title: 'English Reading Skills',
      subject: 'English',
      grade: 4,
      type: 'Quiz Classes',
      completionDate: 'Sep 05, 2025',
      instructor: 'Anuruddha Sir',
      totalLessons: 22,
      finalScore: 85,
      certificate: true,
      color: 'from-red-500 to-red-600',
      feedback: 'Good effort',
      rating: 4.6,
      price: 6200,
      description: 'English reading comprehension skills'
    }
  ], []);

  // Filter Application Function
  const applyFilters = useCallback((coursesToFilter) => {
    return coursesToFilter.filter(course => {
      const matchesSearch = 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.description?.toLowerCase().includes(searchQuery.toLowerCase()) || true);

      const matchesGrade = filters.grades.length === 0 || filters.grades.includes(course.grade);
      const matchesSubject = filters.subjects.length === 0 || filters.subjects.includes(course.subject);
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

  // Pagination Logic
  const getDisplayCourses = useCallback((courses) => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    return courses.slice(startIdx, endIdx);
  }, [currentPage]);

  const getTotalPages = (courses) => Math.ceil(courses.length / itemsPerPage);

  const currentDisplayCourses = useMemo(() => {
    if (activeTab === 'new') return getDisplayCourses(filteredNewCourses);
    if (activeTab === 'enrolled') return getDisplayCourses(filteredEnrolledCourses);
    return getDisplayCourses(filteredCompletedCourses);
  }, [activeTab, filteredNewCourses, filteredEnrolledCourses, filteredCompletedCourses, getDisplayCourses]);

  const totalPages = getTotalPages(
    activeTab === 'new' ? filteredNewCourses :
    activeTab === 'enrolled' ? filteredEnrolledCourses :
    filteredCompletedCourses
  );

  const currentFilteredCount = 
    activeTab === 'new' ? filteredNewCourses.length :
    activeTab === 'enrolled' ? filteredEnrolledCourses.length :
    filteredCompletedCourses.length;

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
    setCurrentPage(1);
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
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
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
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <FaSearch className="absolute left-4 top-4 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search courses by title, subject, or description..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 bg-white rounded-xl p-2 border border-slate-200 shadow-sm">
          <button
            onClick={() => {
              setActiveTab('new');
              setCurrentPage(1);
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
              setCurrentPage(1);
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
              setCurrentPage(1);
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
          {(filters.grades.length > 0 || filters.subjects.length > 0 || filters.types.length > 0 || 
            filters.priceRange[0] > 0 || filters.priceRange[1] < 15000 || filters.rating > 0 || searchQuery) && (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            {/* Grade Filter */}
            <div>
              <h6 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                 Grade Level
              </h6>
              <div className="space-y-2">
                {[3, 4, 5].map(grade => (
                  <label key={grade} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={filters.grades.includes(grade)}
                      onChange={() => handleFilterChange('grades', grade)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-slate-700">Grade {grade}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Subject Filter */}
            <div>
              <h6 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                 Subject
              </h6>
              <div className="space-y-2">
                {['Mathematics', 'Sinhala', 'English', 'Parisaraya', 'Tamil'].map(subject => (
                  <label key={subject} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded text-sm">
                    <input
                      type="checkbox"
                      checked={filters.subjects.includes(subject)}
                      onChange={() => handleFilterChange('subjects', subject)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-slate-700">{subject}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <h6 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                Type
              </h6>
              <div className="space-y-2">
                {['Theory Class', 'Paper Classes', 'Quiz Classes', 'Seminars'].map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded text-sm">
                    <input
                      type="checkbox"
                      checked={filters.types.includes(type)}
                      onChange={() => handleFilterChange('types', type)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-slate-700">{type}</span>
                  </label>
                ))}
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

        {/* New Courses Tab */}
        {activeTab === 'new' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MdOutlineWorkspacePremium /> New Courses Available
            </h2>
            {currentFilteredCount > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {currentDisplayCourses.map((course) => (
                    <NewCourseCard key={course.id} course={course} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                    >
                      <FaChevronLeft />
                    </button>
                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg font-bold transition-all ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                              : 'bg-white border border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-600 text-lg">No courses match your filters</p>
              </div>
            )}
          </div>
        )}

        {/* Enrolled Courses Tab */}
        {activeTab === 'enrolled' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FaBookOpen /> Currently Enrolled Courses
            </h2>
            {currentFilteredCount > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {currentDisplayCourses.map((course) => (
                    <EnrolledCourseCard key={course.id} course={course} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                    >
                      <FaChevronLeft />
                    </button>
                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg font-bold transition-all ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                              : 'bg-white border border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-600 text-lg">No enrolled courses match your filters</p>
              </div>
            )}
          </div>
        )}

        {/* Completed Courses Tab */}
        {activeTab === 'completed' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <GrCompliance /> Completed Courses
            </h2>
            {filteredCompletedCourses.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {currentDisplayCourses.map((course) => (
                    <CompletedCourseCard key={course.id} course={course} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                    >
                      <FaChevronLeft />
                    </button>
                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg font-bold transition-all ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                              : 'bg-white border border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-600 text-lg">No completed courses yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCourses;
