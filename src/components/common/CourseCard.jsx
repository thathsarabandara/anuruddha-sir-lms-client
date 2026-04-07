import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaEye, FaEdit, FaTrash, FaShoppingCart, FaChartBar, FaCertificate,
  FaStar, FaClock, FaBook, FaUsers, FaDollarSign, FaCheckCircle,
  FaVideo, FaGraduationCap
} from 'react-icons/fa';
import { COURSE_TYPE_OPTIONS, COURSE_SUBJECT_OPTIONS, COURSE_GRADE_LEVEL_OPTIONS } from '../../utils/courseOptions';
import { ROUTES } from '../../utils/constants';
import { getToken } from '../../utils/helpers';

/**
 * Reusable CourseCard Component
 * Unified professional design across all user types
 * Uses consistent admin-style format with content adapted for each user type
 */
const CourseCard = ({
  course,
  userType = 'student',
  courseStatus = 'new',
  onViewDetails,
  onEdit,
  onDelete,
  onFeature,
  onToggleEnrollments,
  onContinueLearning,
  onAddToCart,
  onDownloadCertificate,
  onViewStats,
  onViewReport,
  loading = false,
  className = '',
  onNotification
}) => {
  const navigate = useNavigate();

  // Create label maps for course metadata
  const courseTypeMap = useMemo(
    () => COURSE_TYPE_OPTIONS.reduce((acc, option) => ({ ...acc, [option.value]: option.label }), {}),
    []
  );
  const subjectMap = useMemo(
    () => COURSE_SUBJECT_OPTIONS.reduce((acc, option) => ({ ...acc, [option.value]: option.label }), {}),
    []
  );
  const gradeLevelMap = useMemo(
    () => COURSE_GRADE_LEVEL_OPTIONS.reduce((acc, option) => ({ ...acc, [option.value]: option.label }), {}),
    []
  );

  const formatPrice = (price, priceType = 'PAID') => {
    const normalizedPriceType = String(priceType || '').toUpperCase();
    if (normalizedPriceType === 'FREE' || !price) return 'Free';
    return `Rs. ${parseFloat(price).toLocaleString()}`;
  };

  const resolvedRating = Number.parseFloat(course.rating ?? course.average_rating ?? '');
  const hasRating = Number.isFinite(resolvedRating) && resolvedRating > 0;
  const displayRating = hasRating ? resolvedRating.toFixed(1) : 'N/A';
  const displayTeacherName = course.teacher_name || course.instructor_name || course.teacher || 'N/A';
  const thumbnailSrc = course.thumbnail || course.thumbnail_url || null;
  const courseIdentifier = course.id || course.course_id;

  const handleOpenCourseDetails = () => {
    if (onViewDetails) {
      onViewDetails(course);
      return;
    }

    if (courseIdentifier) {
      const detailPath = userType === 'public'
        ? `/courses/${courseIdentifier}`
        : `/student/course/${courseIdentifier}`;
      navigate(detailPath);
    }
  };

  const handlePublicAddToCart = () => {
    const accessToken = getToken('access_token');
    if (!accessToken) {
      navigate(ROUTES.LOGIN);
      return;
    }

    if (onAddToCart) {
      onAddToCart(course);
    } else if (onNotification) {
      onNotification('Please sign in as student to continue checkout.', 'info');
    }
  };

  // ==================== UNIFIED CARD STRUCTURE ====================
  return (
    <div className={`group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-indigo-300 ${className}`}>
      
      {/* IMAGE SECTION - Consistent across all types */}
      <div className="relative h-44 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {thumbnailSrc ? (
          <img 
            src={thumbnailSrc} 
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="text-center">
              <FaBook className="text-4xl text-indigo-200 mx-auto mb-2" />
              <p className="text-sm text-indigo-300 font-medium">No Image</p>
            </div>
          </div>
        )}
        
        {/* Status Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {/* Admin: Status Badge */}
          {userType === 'admin' && course.status && (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              course.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
              course.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {course.status.toUpperCase()}
            </span>
          )}

          {/* Student-Enrolled: Progress Badge */}
          {userType === 'student' && courseStatus === 'enrolled' && course.progress && (
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
              {course.progress}% Complete
            </span>
          )}

          {/* Student-Completed: Completion Badge */}
          {userType === 'student' && courseStatus === 'completed' && (
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <FaCheckCircle className="text-xs" /> Complete
            </span>
          )}

          {/* Teacher: Status Badge */}
          {userType === 'teacher' && course.status && (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              course.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
              course.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {course.status}
            </span>
          )}
        </div>

        {/* Left Badge (Teacher Approval / Student Badge) */}
        {userType === 'teacher' && course.is_approved && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 flex items-center gap-1">
            <FaCheckCircle className="text-xs" /> Approved
          </div>
        )}
      </div>

      {/* CONTENT SECTION */}
      <div className="p-5">
        
        {/* TITLE */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>

        {/* DESCRIPTION - Show for student new courses */}
        {userType === 'student' && courseStatus === 'new' && course.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-1">{course.description}</p>
        )}

        <div className="h-px bg-gray-100 mb-4"></div>

        {/* ============ ADMIN CONTENT ============ */}
        {userType === 'admin' && (
          <>
            <div className="space-y-3 mb-4">
              {displayTeacherName && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Teacher</span>
                  <span className="text-sm font-medium text-gray-700">{displayTeacherName}</span>
                </div>
              )}

              {course.subject && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Subject</span>
                  <span className="text-sm font-medium text-gray-700">{subjectMap[course.subject] || course.subject}</span>
                </div>
              )}

              {course.grade_level && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Level</span>
                  <span className="text-sm font-medium text-gray-700">{gradeLevelMap[course.grade_level] || course.grade_level}</span>
                </div>
              )}

              {course.course_type && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Type</span>
                  <span className="text-sm font-medium text-gray-700">{courseTypeMap[course.course_type] || course.course_type}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Price</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatPrice(course.price, course.price_type)}
                </span>
              </div>

              {course.status === 'PUBLISHED' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">Students</span>
                    <span className="text-sm font-semibold text-gray-900">{course.total_enrollments || 0}</span>
                  </div>

                  {course.average_rating && course.average_rating > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">Rating</span>
                      <span className="flex items-center gap-1">
                        <FaStar className="text-yellow-400 text-xs" />
                        <span className="text-sm font-semibold text-gray-900">{course.average_rating.toFixed(1)}</span>
                      </span>
                    </div>
                  )}

                  {course.total_revenue && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">Revenue</span>
                      <span className="text-sm font-semibold text-green-600">Rs. {course.total_revenue.toLocaleString()}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="h-px bg-gray-100 mb-4"></div>

            {/* Enrollment Status */}
            {course.enrollments_enabled !== undefined && (
              <div className="mb-4 flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">Enrollments</span>
                <span className={`font-semibold px-2.5 py-0.5 rounded-full ${course.enrollments_enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {course.enrollments_enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            )}

            {/* Admin Buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onViewDetails?.(course)}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <FaEye className="text-sm" />
                View Details
              </button>

              {course.status === 'PUBLISHED' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onFeature?.(course.id, course.is_featured)}
                    disabled={loading}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors duration-200 ${
                      course.is_featured
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {course.is_featured ? '⭐ Featured' : '☆ Feature'}
                  </button>
                  <button
                    onClick={() => onToggleEnrollments?.(course.id, course.enrollments_enabled)}
                    disabled={loading}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors duration-200 ${
                      course.enrollments_enabled
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {course.enrollments_enabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ============ TEACHER CONTENT ============ */}
        {userType === 'teacher' && (
          <>
            <div className="space-y-3 mb-4">
              {displayTeacherName && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Teacher</span>
                  <span className="text-sm font-medium text-gray-700">{displayTeacherName}</span>
                </div>
              )}

              {course.subject && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Subject</span>
                  <span className="text-sm font-medium text-gray-700">{subjectMap[course.subject] || course.subject}</span>
                </div>
              )}

              {course.grade_level && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Level</span>
                  <span className="text-sm font-medium text-gray-700">{gradeLevelMap[course.grade_level] || course.grade_level}</span>
                </div>
              )}

              {course.course_type && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Type</span>
                  <span className="text-sm font-medium text-gray-700">{courseTypeMap[course.course_type] || course.course_type}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Students</span>
                <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <FaUsers className="text-blue-500" /> {course.total_enrollments || 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Price</span>
                <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <FaDollarSign className="text-green-500" /> {formatPrice(course.price, course.price_type)}
                </span>
              </div>

              {hasRating && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Rating</span>
                  <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <FaStar className="text-yellow-500" />
                    {displayRating}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Created</span>
                <span className="text-sm font-semibold text-gray-900">
                  {course.created_at ? new Date(course.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>

            <div className="h-px bg-gray-100 mb-4"></div>

            {/* Teacher Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => onViewDetails?.(course) || navigate(`/teacher/courses/${course.id}?mode=view`)}
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200"
              >
                <FaEye className="text-xs" /> View
              </button>
              <button
                onClick={() => onEdit?.(course) || navigate(`/teacher/courses/${course.id}?mode=edit`)}
                disabled={loading}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200"
              >
                <FaEdit className="text-xs" /> Edit
              </button>
              <button
                onClick={() => onDelete?.(course.id)}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
              >
                <FaTrash className="text-xs" />
              </button>
            </div>
          </>
        )}

        {/* ============ STUDENT - NEW COURSE CONTENT ============ */}
        {userType === 'student' && courseStatus === 'new' && (
          <>
            <div className="space-y-3 mb-4">
              {displayTeacherName && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Teacher</span>
                  <span className="text-sm font-medium text-gray-700">{displayTeacherName}</span>
                </div>
              )}

              {course.subject && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Subject</span>
                  <span className="text-sm font-medium text-gray-700">{subjectMap[course.subject] || course.subject}</span>
                </div>
              )}

              {course.grade_level && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Level</span>
                  <span className="text-sm font-medium text-gray-700">{gradeLevelMap[course.grade_level] || course.grade_level}</span>
                </div>
              )}

              {course.course_type && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Type</span>
                  <span className="text-sm font-medium text-gray-700">{courseTypeMap[course.course_type] || course.course_type}</span>
                </div>
              )}

              {hasRating && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Rating</span>
                  <span className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                    <FaStar className="text-yellow-400" /> {displayRating}
                  </span>
                </div>
              )}

              {course.students && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Students</span>
                  <span className="text-sm font-semibold text-gray-900">{course.students}+</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Price</span>
                <span className="text-base font-bold text-indigo-600">
                  {course.priceText || formatPrice(course.price, course.price_type)}
                </span>
              </div>

              {course.duration && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Duration</span>
                  <span className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                    <FaClock className="text-blue-500" /> {course.duration}
                  </span>
                </div>
              )}

              {course.classes && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Classes</span>
                  <span className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                    <FaVideo className="text-green-500" /> {course.classes}
                  </span>
                </div>
              )}
            </div>

            <div className="h-px bg-gray-100 mb-4"></div>

            {/* Student-New Button */}
            <div className="flex gap-2">
              <button
                onClick={handleOpenCourseDetails}
                disabled={loading}
                className="flex-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <FaEye className="text-sm" />
                View
              </button>
              <button
                onClick={() => {
                  if (onAddToCart) {
                    onAddToCart(course);
                  } else if (onNotification) {
                    onNotification('Added to cart!', 'success');
                  }
                }}
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <FaShoppingCart className="text-sm" />
                Add to Cart
              </button>
            </div>
          </>
        )}

        {/* ============ PUBLIC COURSE CONTENT (WITHOUT LOGIN) ============ */}
        {userType === 'public' && (
          <>
            <div className="space-y-3 mb-4">
              {displayTeacherName && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Teacher</span>
                  <span className="text-sm font-medium text-gray-700">{displayTeacherName}</span>
                </div>
              )}

              {course.subject && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Subject</span>
                  <span className="text-sm font-medium text-gray-700">{subjectMap[course.subject] || course.subject}</span>
                </div>
              )}

              {course.grade_level && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Level</span>
                  <span className="text-sm font-medium text-gray-700">{gradeLevelMap[course.grade_level] || course.grade_level}</span>
                </div>
              )}

              {course.course_type && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Type</span>
                  <span className="text-sm font-medium text-gray-700">{courseTypeMap[course.course_type] || course.course_type}</span>
                </div>
              )}

              {hasRating && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Rating</span>
                  <span className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    {displayRating}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Price</span>
                <span className="text-base font-bold text-indigo-600">
                  {course.priceText || formatPrice(course.price, course.price_type)}
                </span>
              </div>
            </div>

            <div className="h-px bg-gray-100 mb-4"></div>

            <div className="flex gap-2">
              <button
                onClick={handleOpenCourseDetails}
                disabled={loading}
                className="flex-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <FaEye className="text-sm" />
                View
              </button>
              <button
                onClick={handlePublicAddToCart}
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <FaShoppingCart className="text-sm" />
                Add to Cart
              </button>
            </div>
          </>
        )}

        {/* ============ STUDENT - ENROLLED COURSE CONTENT ============ */}
        {userType === 'student' && courseStatus === 'enrolled' && (
          <>
            {/* Progress Bar */}
            {course.progress !== undefined && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">Progress</span>
                  <span className="text-sm font-bold text-gray-900">{course.progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-3 mb-4">
              {displayTeacherName && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Teacher</span>
                  <span className="text-sm font-medium text-gray-700">{displayTeacherName}</span>
                </div>
              )}

              {course.subject && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Subject</span>
                  <span className="text-sm font-medium text-gray-700">{subjectMap[course.subject] || course.subject}</span>
                </div>
              )}

              {course.course_type && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Type</span>
                  <span className="text-sm font-medium text-gray-700">{courseTypeMap[course.course_type] || course.course_type}</span>
                </div>
              )}

              {course.lessonsCompleted !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Lessons</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {course.lessonsCompleted}/{course.totalLessons}
                  </span>
                </div>
              )}

              {course.nextClass && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Next Class</span>
                  <span className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                    <FaClock className="text-blue-500" /> {course.nextClass}
                  </span>
                </div>
              )}

              {course.enrolledDate && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Enrolled</span>
                  <span className="text-sm font-semibold text-gray-900">{course.enrolledDate}</span>
                </div>
              )}

              {course.rating && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Rating</span>
                  <span className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                    <FaStar className="text-yellow-400" /> {course.rating}
                  </span>
                </div>
              )}
            </div>

            <div className="h-px bg-gray-100 mb-4"></div>

            {/* Student-Enrolled Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => onContinueLearning?.(course) || navigate(`/student/course/${course.id}/learn`)}
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <FaVideo className="text-xs" />
                Continue
              </button>
              <button
                onClick={() => onViewStats?.(course)}
                disabled={loading}
                className="flex-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <FaChartBar className="text-xs" />
                Stats
              </button>
            </div>
          </>
        )}

        {/* ============ STUDENT - COMPLETED COURSE CONTENT ============ */}
        {userType === 'student' && courseStatus === 'completed' && (
          <>
            {/* Completion Info */}
            <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-xs font-semibold text-purple-900 flex items-center gap-2">
                <FaGraduationCap /> Course Completed
              </p>
              {course.completionDate && (
                <p className="text-xs text-purple-700 mt-1">{course.completionDate}</p>
              )}
            </div>

            <div className="space-y-3 mb-4">
              {displayTeacherName && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Teacher</span>
                  <span className="text-sm font-medium text-gray-700">{displayTeacherName}</span>
                </div>
              )}

              {course.subject && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Subject</span>
                  <span className="text-sm font-medium text-gray-700">{subjectMap[course.subject] || course.subject}</span>
                </div>
              )}

              {course.course_type && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Type</span>
                  <span className="text-sm font-medium text-gray-700">{courseTypeMap[course.course_type] || course.course_type}</span>
                </div>
              )}

              {course.finalScore !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Final Score</span>
                  <span className="text-lg font-bold text-green-600">{course.finalScore}%</span>
                </div>
              )}

              {course.totalLessons && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Total Lessons</span>
                  <span className="text-sm font-semibold text-gray-900">{course.totalLessons}</span>
                </div>
              )}

              {course.feedback && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Feedback</span>
                  <span className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                    <FaStar className="text-yellow-400" /> {course.feedback}
                  </span>
                </div>
              )}

              {course.rating && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Rating</span>
                  <span className="text-sm font-semibold text-gray-900">{course.rating}</span>
                </div>
              )}
            </div>

            <div className="h-px bg-gray-100 mb-4"></div>

            {/* Student-Completed Buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onContinueLearning?.(course) || navigate(`/student/course/${course.id}/learn`)}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <FaVideo className="text-sm" />
                Rewatch
              </button>
              {course.certificate && (
                <button
                  onClick={() => onDownloadCertificate?.(course.id)}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <FaCertificate className="text-sm" />
                  Download Certificate
                </button>
              )}
              <button
                onClick={() => onViewReport?.(course.id)}
                disabled={loading}
                className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <FaChartBar className="text-xs" />
                View Report
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default CourseCard;
