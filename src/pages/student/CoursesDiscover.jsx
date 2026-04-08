import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from '../../components/common/Notification';
import { COURSE_SUBJECT_OPTIONS, COURSE_GRADE_LEVEL_OPTIONS } from '../../utils/courseOptions';

// Dummy Courses Data
const getDummyCourses = (filters = {}) => {
  const allCourses = [
    {
      id: 'course-1',
      title: 'Advanced Python Programming',
      slug: 'advanced-python-programming',
      description: 'Master advanced Python concepts including OOP, decorators, generators, and async programming.',
      subject: 'ganithaya',
      category: 'Programming',
      grade_level: '5',
      instructor: { id: 'inst-1', name: 'John Smith', email: 'john@example.com' },
      average_rating: 4.8,
      total_reviews: 245,
      enrolled_students_count: 2340,
      price: 49.99,
      discount_price: null,
      duration: '8 weeks',
      level: 'Advanced',
      thumbnail: null,
      is_enrolled: false,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'course-2',
      title: 'Web Development Fundamentals',
      slug: 'web-development-fundamentals',
      description: 'Learn HTML, CSS, JavaScript, and create modern responsive websites from scratch.',
      subject: 'english',
      category: 'Web Development',
      grade_level: '4',
      instructor: { id: 'inst-2', name: 'Sarah Lee', email: 'sarah@example.com' },
      average_rating: 4.7,
      total_reviews: 198,
      enrolled_students_count: 1890,
      price: 39.99,
      discount_price: 29.99,
      duration: '6 weeks',
      level: 'Beginner',
      thumbnail: null,
      is_enrolled: false,
      created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'course-3',
      title: 'Data Science with Python',
      slug: 'data-science-with-python',
      description: 'Learn data analysis, visualization, and machine learning with Pandas, NumPy, and Scikit-learn.',
      subject: 'all-shishyathwaya',
      category: 'Data Science',
      grade_level: '5',
      instructor: { id: 'inst-3', name: 'Mike Johnson', email: 'mike@example.com' },
      average_rating: 4.9,
      total_reviews: 312,
      enrolled_students_count: 3120,
      price: 59.99,
      discount_price: null,
      duration: '10 weeks',
      level: 'Advanced',
      thumbnail: null,
      is_enrolled: false,
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'course-4',
      title: 'React & Redux Mastery',
      slug: 'react-redux-mastery',
      description: 'Build dynamic React applications using hooks, Redux for state management, and modern patterns.',
      subject: 'english',
      category: 'Frontend',
      grade_level: '4',
      instructor: { id: 'inst-4', name: 'Emma Brown', email: 'emma@example.com' },
      average_rating: 4.8,
      total_reviews: 287,
      enrolled_students_count: 2560,
      price: 49.99,
      discount_price: 39.99,
      duration: '8 weeks',
      level: 'Intermediate',
      thumbnail: null,
      is_enrolled: false,
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'course-5',
      title: 'Database Design & SQL',
      slug: 'database-design-sql',
      description: 'Master relational databases, SQL queries, normalization, and database optimization techniques.',
      subject: 'ganithaya',
      category: 'Databases',
      grade_level: '3',
      instructor: { id: 'inst-5', name: 'Alex Brown', email: 'alex@example.com' },
      average_rating: 4.6,
      total_reviews: 156,
      enrolled_students_count: 1620,
      price: 34.99,
      discount_price: null,
      duration: '6 weeks',
      level: 'Intermediate',
      thumbnail: null,
      is_enrolled: false,
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'course-6',
      title: 'Cloud Computing with AWS',
      slug: 'cloud-computing-aws',
      description: 'Learn AWS services including EC2, S3, Lambda, and build scalable cloud applications.',
      subject: 'all-shishyathwaya',
      category: 'Cloud Computing',
      grade_level: '5',
      instructor: { id: 'inst-6', name: 'David Wilson', email: 'david@example.com' },
      average_rating: 4.7,
      total_reviews: 203,
      enrolled_students_count: 2780,
      price: 54.99,
      discount_price: null,
      duration: '9 weeks',
      level: 'Advanced',
      thumbnail: null,
      is_enrolled: false,
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'course-7',
      title: 'JavaScript ES6+ Essentials',
      slug: 'javascript-es6-essentials',
      description: 'Master modern JavaScript with ES6+ features, async programming, and best practices.',
      subject: 'sinhala',
      category: 'Programming',
      grade_level: '2',
      instructor: { id: 'inst-7', name: 'Lisa Anderson', email: 'lisa@example.com' },
      average_rating: 4.7,
      total_reviews: 224,
      enrolled_students_count: 2100,
      price: 39.99,
      discount_price: 29.99,
      duration: '7 weeks',
      level: 'Intermediate',
      thumbnail: null,
      is_enrolled: false,
      created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'course-8',
      title: 'Machine Learning Fundamentals',
      slug: 'machine-learning-fundamentals',
      description: 'Introduction to machine learning: supervised learning, classification, regression, and evaluation.',
      subject: 'parisaraya',
      category: 'Machine Learning',
      grade_level: '4',
      instructor: { id: 'inst-8', name: 'Robert Green', email: 'robert@example.com' },
      average_rating: 4.8,
      total_reviews: 267,
      enrolled_students_count: 1950,
      price: 64.99,
      discount_price: null,
      duration: '10 weeks',
      level: 'Advanced',
      thumbnail: null,
      is_enrolled: false,
      created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'course-9',
      title: 'Mobile App Development with React Native',
      slug: 'mobile-app-development-react-native',
      description: 'Build native mobile applications for iOS and Android using React Native framework.',
      subject: 'demala',
      category: 'Mobile Development',
      grade_level: '3',
      instructor: { id: 'inst-9', name: 'Jennifer Lee', email: 'jennifer@example.com' },
      average_rating: 4.6,
      total_reviews: 178,
      enrolled_students_count: 1450,
      price: 59.99,
      discount_price: 44.99,
      duration: '10 weeks',
      level: 'Advanced',
      thumbnail: null,
      is_enrolled: false,
      created_at: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'course-10',
      title: 'DevOps and Container Technology',
      slug: 'devops-container-technology',
      description: 'Learn Docker, Kubernetes, CI/CD pipelines, and modern DevOps practices for deployment.',
      subject: 'all-shishyathwaya',
      category: 'DevOps',
      grade_level: '5',
      instructor: { id: 'inst-10', name: 'James Miller', email: 'james@example.com' },
      average_rating: 4.7,
      total_reviews: 189,
      enrolled_students_count: 1680,
      price: 69.99,
      discount_price: null,
      duration: '12 weeks',
      level: 'Advanced',
      thumbnail: null,
      is_enrolled: false,
      created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000)
    }
  ];

  // Apply filters
  let filtered = allCourses;

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(course =>
      course.title.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower) ||
      course.subject.toLowerCase().includes(searchLower)
    );
  }

  if (filters.subject) {
    filtered = filtered.filter(course => course.subject === filters.subject);
  }

  if (filters.grade_level) {
    filtered = filtered.filter(course => course.grade_level === filters.grade_level);
  }

  if (filters.price_type === 'free') {
    filtered = filtered.filter(course => course.price === 0);
  } else if (filters.price_type === 'paid') {
    filtered = filtered.filter(course => course.price > 0);
  }

  // Sort
  if (filters.sort_by === 'latest') {
    filtered.sort((a, b) => b.created_at - a.created_at);
  } else if (filters.sort_by === 'rating') {
    filtered.sort((a, b) => b.average_rating - a.average_rating);
  } else if (filters.sort_by === 'popular') {
    filtered.sort((a, b) => b.enrolled_students_count - a.enrolled_students_count);
  } else if (filters.sort_by === 'price_low') {
    filtered.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
  } else if (filters.sort_by === 'price_high') {
    filtered.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
  }

  return filtered;
};

const getDummySubjects = () => [
  ...COURSE_SUBJECT_OPTIONS.map((subject) => ({
    id: subject.value,
    name: subject.label,
  }))
];

const getDummyGradeLevels = () => [
  ...COURSE_GRADE_LEVEL_OPTIONS.map((grade) => ({
    id: grade.value,
    name: grade.label,
  }))
];

const StudentCoursesDiscover = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [gradeLevels, setGradeLevels] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    subject: '',
    grade_level: '',
    price_type: '',
    sort_by: 'latest'
  });
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  useEffect(() => {
    const fetchUtilityData = async () => {
      try {
        // Use dummy data instead of API calls
        setSubjects(getDummySubjects());
        setGradeLevels(getDummyGradeLevels());
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
        // Use dummy data with applied filters
        const courses = getDummyCourses(filters);
        setCourses(courses);
        setLoading(false);
      } catch (err) {
        showNotification('Failed to fetch courses', 'error');
        setLoading(false);
        console.error(err);
      }
    };

    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Use dummy data with applied filters
      const courses = getDummyCourses(filters);
      setCourses(courses);
      setLoading(false);
    } catch (err) {
      showNotification('Failed to fetch courses', 'error');
      setLoading(false);
      console.error(err);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      // Simulate enrollment with dummy data
      showNotification('Successfully enrolled in course!', 'success');
      // Update the course as enrolled in local state
      setCourses(courses.map(course => 
        course.id === courseId ? { ...course, is_enrolled: true } : course
      ));
    } catch (error) {
      showNotification('Failed to enroll in course', 'error');
    }
  };

  const viewCourseDetails = (courseId) => {
    navigate(`/student/course/${courseId}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
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
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                    {course.subject}
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
