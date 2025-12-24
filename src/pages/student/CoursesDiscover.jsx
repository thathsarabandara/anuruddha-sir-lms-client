import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { studentCourseAPI, utilityAPI } from '../../api/courseApi';

const StudentCoursesDiscover = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [gradeLevels, setGradeLevels] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    subject: '',
    grade_level: '',
    category: '',
    price_type: '',
    sort_by: 'latest'
  });

  useEffect(() => {
    const fetchUtilityData = async () => {
      try {
        const [categoriesRes, subjectsRes, gradeLevelsRes] = await Promise.all([
          utilityAPI.getCategories(),
          utilityAPI.getSubjects(),
          utilityAPI.getGradeLevels()
        ]);
        setCategories(categoriesRes.data);
        setSubjects(subjectsRes.data);
        setGradeLevels(gradeLevelsRes.data);
      } catch (err) {
        console.error('Failed to fetch utility data:', err);
      }
    };

    fetchUtilityData();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const params = {};
        
        if (filters.search) params.search = filters.search;
        if (filters.subject) params.subject = filters.subject;
        if (filters.grade_level) params.grade_level = filters.grade_level;
        if (filters.category) params.category = filters.category;
        if (filters.price_type) params.price_type = filters.price_type;
        if (filters.sort_by) params.sort_by = filters.sort_by;

        const response = await studentCourseAPI.discoverCourses(params);
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        toast.error('Failed to fetch courses');
        setLoading(false);
        console.error(err);
      }
    };

    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filters.search) params.search = filters.search;
      if (filters.subject) params.subject = filters.subject;
      if (filters.grade_level) params.grade_level = filters.grade_level;
      if (filters.category) params.category = filters.category;
      if (filters.price_type) params.price_type = filters.price_type;
      if (filters.sort_by) params.sort_by = filters.sort_by;

      const response = await studentCourseAPI.discoverCourses(params);
      setCourses(response.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch courses');
      setLoading(false);
      console.error(err);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await studentCourseAPI.enrollInCourse(courseId);
      toast.success('Successfully enrolled in course!');
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to enroll in course');
    }
  };

  const viewCourseDetails = (courseId) => {
    navigate(`/student/course/${courseId}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Discover Courses</h1>
        <p className="text-gray-600 mt-1">Browse and enroll in courses to start learning</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder="Search courses..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Subjects</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filters.grade_level}
              onChange={(e) => setFilters({ ...filters, grade_level: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Grades</option>
              {gradeLevels.map((grade) => (
                <option key={grade.id} value={grade.id}>{grade.name}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filters.price_type}
              onChange={(e) => setFilters({ ...filters, price_type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Found {courses.length} course{courses.length !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={filters.sort_by}
              onChange={(e) => setFilters({ ...filters, sort_by: e.target.value })}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="latest">Latest</option>
              <option value="popular">Most Popular</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Thumbnail */}
              <div className="relative h-48 bg-gray-200">
                {course.thumbnail ? (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                {parseFloat(course.price) === 0 && (
                  <span className="absolute top-2 right-2 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                    FREE
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {course.category?.name}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                    {course.subject?.name}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <span>⭐ {course.average_rating || 0}</span>
                    <span>({course.total_reviews || 0})</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    👥 {course.total_enrollments || 0} students
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-gray-900">
                    {parseFloat(course.price) === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      <span>Rs. {parseFloat(course.price).toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => viewCourseDetails(course.id)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                    >
                      View
                    </button>
                    {!course.is_enrolled && (
                      <button
                        onClick={() => handleEnroll(course.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Enroll
                      </button>
                    )}
                    {course.is_enrolled && (
                      <button
                        onClick={() => navigate(`/student/course/${course.id}/learn`)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      >
                        Continue
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>👤 {course.teacher_name}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">Try adjusting your filters to see more courses</p>
        </div>
      )}
    </div>
  );
};

export default StudentCoursesDiscover;
