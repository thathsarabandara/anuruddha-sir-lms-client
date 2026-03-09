/**
 * Course Data Transformation Utilities
 * Ensures consistent data structure for course cards
 */

const GRADIENT_COLORS = [
  'from-blue-500 to-blue-600',
  'from-purple-500 to-purple-600',
  'from-red-500 to-red-600',
  'from-green-500 to-green-600',
  'from-orange-500 to-orange-600',
  'from-pink-500 to-pink-600',
  'from-indigo-500 to-indigo-600',
  'from-cyan-500 to-cyan-600',
  'from-yellow-500 to-yellow-600',
  'from-teal-500 to-teal-600',
];

let colorIndex = 0;

export const getRandomColor = () => {
  const color = GRADIENT_COLORS[colorIndex % GRADIENT_COLORS.length];
  colorIndex++;
  return color;
};

export const resetColorIndex = () => {
  colorIndex = 0;
};

/**
 * Transform enrolled course data from API response
 * @param {Object} course - Raw course data from API
 * @returns {Object} Formatted course data for EnrolledCourseCard
 */
export const transformEnrolledCourse = (course) => {
  if (!course || typeof course !== 'object') {
    return null;
  }

  return {
    id: course.id || course.course_id,
    title: course.title || course.name || 'Untitled Course',
    subject: course.subject || course.category || 'General',
    grade: course.grade || course.grade_level,
    type: course.type || course.course_type || course.category || 'Theory Class',
    progress: parseInt(course.progress) || 0,
    nextClass: course.next_class || course.nextClass || course.next_session || 'TBD',
    instructor: course.instructor || course.teacher || course.instructor_name || 'Instructor',
    lessonsCompleted: parseInt(course.lessons_completed || course.lessonsCompleted || 0),
    totalLessons: parseInt(course.total_lessons || course.totalLessons || 0),
    color: course.color || getRandomColor(),
    enrolledDate: formatDate(course.enrolled_date || course.enrolledDate || course.enrollment_date),
    rating: parseFloat(course.rating) || 0,
    description: course.description || '',
    // Additional fields for reference
    thumbnail: course.thumbnail || course.image,
    instructor_id: course.instructor_id,
  };
};

/**
 * Transform completed course data from API response
 * @param {Object} course - Raw course data from API
 * @returns {Object} Formatted course data for CompletedCourseCard
 */
export const transformCompletedCourse = (course) => {
  if (!course || typeof course !== 'object') {
    return null;
  }

  return {
    id: course.id || course.course_id,
    title: course.title || course.name || 'Untitled Course',
    subject: course.subject || course.category || 'General',
    grade: course.grade || course.grade_level,
    type: course.type || course.course_type || course.category || 'Theory Class',
    color: course.color || getRandomColor(),
    completionDate: formatDate(course.completion_date || course.completionDate || course.completed_date),
    totalLessons: parseInt(course.total_lessons || course.totalLessons || 0),
    finalScore: parseInt(course.final_score || course.finalScore || course.score || 0),
    feedback: course.feedback || course.remarks || 'Excellent Work!',
    certificate: course.certificate !== false && course.has_certificate !== false,
    instructor: course.instructor || course.teacher || course.instructor_name || 'Instructor',
    description: course.description || '',
    // Additional fields for reference
    thumbnail: course.thumbnail || course.image,
    instructor_id: course.instructor_id,
    completion_percentage: parseInt(course.completion_percentage || course.completion_percent || 100),
  };
};

/**
 * Transform new/available course data from API response
 * @param {Object} course - Raw course data from API
 * @returns {Object} Formatted course data for NewCourseCard
 */
export const transformNewCourse = (course) => {
  if (!course || typeof course !== 'object') {
    return null;
  }

  return {
    id: course.id || course.course_id,
    title: course.title || course.name || 'Untitled Course',
    subject: course.subject || course.category || 'General',
    grade: course.grade || course.grade_level,
    type: course.type || course.course_type || course.category || 'Theory Class',
    instructor: course.instructor || course.teacher || course.instructor_name || 'Instructor',
    rating: parseFloat(course.rating) || 0,
    students: parseInt(course.students || course.enrolled_count || 0),
    price: parseFloat(course.price) || 0,
    priceText: course.price ? `Rs. ${parseFloat(course.price).toLocaleString()}` : 'Free',
    duration: course.duration || 'TBD',
    lessons: parseInt(course.lessons || course.total_lessons || 0),
    color: course.color || getRandomColor(),
    badge: course.badge || 'New',
    description: course.description || '',
    thumbnail: course.thumbnail || course.image,
    instructor_id: course.instructor_id,
  };
};

/**
 * Format date to readable string
 * @param {string|Date} dateInput - Date string or Date object
 * @returns {string} Formatted date string
 */
export const formatDate = (dateInput) => {
  if (!dateInput) {
    return new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      // If parsing fails, return the input as is
      return String(dateInput);
    }
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(dateInput);
  }
};

/**
 * Transform batch of courses
 * @param {Array} courses - Array of course objects
 * @param {Function} transformFn - Transformation function to apply
 * @returns {Array} Array of transformed courses
 */
export const transformCourses = (courses, transformFn) => {
  if (!Array.isArray(courses)) {
    return [];
  }
  
  return courses
    .map(course => transformFn(course))
    .filter(course => course !== null);
};
