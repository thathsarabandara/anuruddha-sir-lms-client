import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaBook,
  FaClock,
  FaDollarSign,
  FaGraduationCap,
  FaKey,
  FaLayerGroup,
  FaListOl,
  FaPlayCircle,
  FaShoppingCart,
  FaStar,
  FaUserGraduate,
} from 'react-icons/fa';
import Notification from '../../components/common/Notification';
import { courseAPI } from '../../api/course';
import { useCart } from '../../hooks/useCart';
import { ROUTES } from '../../utils/constants';
import { getToken } from '../../utils/helpers';

const formatMoney = (amount) => {
  const value = Number(amount || 0);
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatDuration = (hours) => {
  if (!hours && hours !== 0) return 'Self-paced';
  if (hours === 0) return 'Self-paced';
  return `${hours}h`;
};

const toCourse = (row) => {
  if (!row) return null;
  return {
    id: row.course_id || row.id,
    title: row.title || 'Untitled Course',
    description: row.description || 'No description available yet.',
    subject: row.subject || 'N/A',
    gradeLevel: row.grade_level || 'N/A',
    language: row.language || 'N/A',
    teacherName: row.teacher_name || row.instructor_name || 'Instructor',
    rating: Number(row.average_rating || 0),
    reviewsCount: Number(row.total_reviews || 0),
    students: Number(row.total_enrollments || 0),
    isPaid: Boolean(row.is_paid),
    price: Number(row.price || 0),
    durationHours: row.duration_hours,
    status: row.status,
    visibility: row.visibility,
    type: row.course_type,
    thumbnailUrl: row.thumbnail_url || null,
  };
};

const toSections = (payload) => {
  const rawSections = Array.isArray(payload?.sections) ? payload.sections : [];

  return rawSections.map((section, sectionIndex) => {
    const rawLessons = Array.isArray(section.lessons) ? section.lessons : [];

    const lessons = rawLessons.map((lesson, lessonIndex) => {
      let lessonType = lesson.lesson_type || 'lesson';
      if (lesson.video_file) lessonType = 'video';
      else if (lesson.pdf_file) lessonType = 'pdf';
      else if (lesson.quiz_id) lessonType = 'quiz';
      else if (lesson.text_content) lessonType = 'text';

      return {
        id: lesson.lesson_id || `${section.section_id}-${lessonIndex}`,
        title: lesson.title || `Lesson ${lessonIndex + 1}`,
        description: lesson.description || '',
        type: lessonType,
        durationMinutes: Number(lesson.duration_minutes || 0),
        order: lesson.lesson_order,
      };
    });

    return {
      id: section.section_id || `section-${sectionIndex}`,
      title: section.title || `Section ${sectionIndex + 1}`,
      description: section.description || '',
      order: section.section_order,
      lessons,
    };
  });
};

const CourseView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentKey, setEnrollmentKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const isAuthenticated = Boolean(getToken('access_token'));

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  const totalLessons = useMemo(
    () => sections.reduce((sum, section) => sum + section.lessons.length, 0),
    [sections]
  );

  const totalMinutes = useMemo(
    () => sections.reduce(
      (sum, section) =>
        sum + section.lessons.reduce((sectionSum, lesson) => sectionSum + lesson.durationMinutes, 0),
      0
    ),
    [sections]
  );

  useEffect(() => {
    const fetchCoursePage = async () => {
      if (!courseId) {
        setPageError('Course not found');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setPageError('');

        const [detailsRes, contentRes] = await Promise.allSettled([
          courseAPI.getCourseDetails(courseId),
          courseAPI.getCourseContent(courseId),
        ]);

        if (detailsRes.status !== 'fulfilled') {
          throw detailsRes.reason;
        }

        setCourse(toCourse(detailsRes.value?.data?.data));

        if (contentRes.status === 'fulfilled') {
          setSections(toSections(contentRes.value?.data?.data));
        } else {
          const previewRes = await courseAPI.getCourseContentPreview(courseId);
          setSections(toSections(previewRes?.data?.data));
        }

        if (isAuthenticated) {
          const myCoursesRes = await courseAPI.getMyCourses({
            course_id: courseId,
            page: 1,
            limit: 1,
          });
          const rows = Array.isArray(myCoursesRes?.data?.data) ? myCoursesRes.data.data : [];
          const enrolled = rows.some((row) => String(row.course_id || row.id) === String(courseId));
          setIsEnrolled(enrolled);
        }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to load course details. Please try again.';
        setPageError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoursePage();
  }, [courseId, isAuthenticated]);

  const enrollWithKey = async () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    if (!enrollmentKey.trim()) {
      showNotification('Please enter an enrollment key', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      await courseAPI.enrollInCourse(courseId, {
        enrollment_method: 'enrollment_key',
        enrollment_key: enrollmentKey.trim(),
      });
      setIsEnrolled(true);
      setEnrollmentKey('');
      showNotification('Enrollment successful with key', 'success');
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to enroll with key';
      showNotification(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addToCartAndGo = async (target = '/student/cart') => {
    if (!course) return;

    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await addToCart({ course_id: course.id });
      if (result?.success) {
        showNotification(result.message || 'Course added to cart', 'success');
        navigate(target);
      } else {
        showNotification(result?.message || 'Failed to add course to cart', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrimaryAction = async () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    if (isEnrolled) {
      navigate(`/student/course/${courseId}/learn`);
      return;
    }

    if (!course) return;

    if (course.isPaid) {
      await addToCartAndGo('/student/cart');
      return;
    }

    try {
      setIsSubmitting(true);
      await courseAPI.enrollInCourse(courseId, { enrollment_method: 'payment' });
      setIsEnrolled(true);
      showNotification('Successfully enrolled in this free course', 'success');
    } catch (error) {
      const message = error?.response?.data?.message || 'Enrollment failed';
      showNotification(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (pageError || !course) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto bg-white border border-red-200 rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Unable to Load Course</h1>
          <p className="text-slate-600 mb-6">{pageError || 'Course was not found.'}</p>
          <button
            onClick={() => navigate('/student/courses/discover')}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back To Discover
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50">
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
      <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-8 lg:p-12 overflow-hidden">
        {course.thumbnailUrl && (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-blue-900/80 to-slate-900/85" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <button
            onClick={() => navigate(isAuthenticated ? '/student/courses/discover' : '/courses')}
            className="flex items-center gap-2 mb-6 hover:opacity-90 transition-opacity"
          >
            <FaArrowLeft /> Back to Courses
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg opacity-90 mb-6">{course.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-300" />
                  <span className="font-semibold">
                    {course.rating.toFixed(1)} ({course.reviewsCount} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock />
                  <span>{formatDuration(course.durationHours)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaListOl />
                  <span>{totalLessons} Lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaLayerGroup />
                  <span>{sections.length} Sections</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUserGraduate />
                  <span>{course.students} Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaBook />
                  <span>{course.subject} | Grade {course.gradeLevel}</span>
                </div>
              </div>

              <p className="text-sm opacity-90">
                Instructor: <span className="font-semibold">{course.teacherName}</span>
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
              <div className="mb-4">
                <p className="text-sm uppercase tracking-wider opacity-80">Price</p>
                <p className="text-3xl font-bold mt-1">
                  {course.isPaid ? formatMoney(course.price) : 'Free'}
                </p>
              </div>

              <div className="space-y-2 text-sm mb-5">
                <div className="flex justify-between">
                  <span>Course Type</span>
                  <span className="font-semibold uppercase">{course.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Language</span>
                  <span className="font-semibold uppercase">{course.language}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Duration</span>
                  <span className="font-semibold">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</span>
                </div>
              </div>

              <button
                onClick={handlePrimaryAction}
                disabled={isSubmitting}
                className="w-full mb-3 py-3 rounded-lg font-semibold bg-white text-blue-900 hover:bg-blue-50 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isEnrolled ? <FaPlayCircle /> : course.isPaid ? <FaShoppingCart /> : <FaGraduationCap />}
                {isEnrolled ? 'Continue Learning' : course.isPaid ? 'Buy Course' : 'Enroll Now'}
              </button>

              {!isEnrolled && course.isPaid && (
                <button
                  onClick={() => addToCartAndGo('/student/checkout')}
                  disabled={isSubmitting}
                  className="w-full mb-3 py-2.5 rounded-lg font-semibold border border-white/40 text-white hover:bg-white/10 disabled:opacity-50"
                >
                  Buy Now (Checkout)
                </button>
              )}

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide opacity-80 flex items-center gap-2">
                  <FaKey /> Enrollment Key
                </label>
                <input
                  type="text"
                  value={enrollmentKey}
                  onChange={(event) => setEnrollmentKey(event.target.value.toUpperCase())}
                  placeholder="ENTER-KEY-CODE"
                  className="w-full px-3 py-2 rounded-md bg-white/95 text-slate-900 outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  type="button"
                  onClick={enrollWithKey}
                  disabled={isSubmitting || !enrollmentKey.trim()}
                  className="w-full py-2.5 rounded-lg border border-white/40 text-white hover:bg-white/10 disabled:opacity-50"
                >
                  Enroll With Key
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Course Content</h2>
              <p className="text-sm text-slate-600">
                Preview the section list and lesson breakdown before purchasing.
              </p>
            </div>

            {sections.length > 0 ? (
              <div className="space-y-4">
                {sections.map((section, sectionIndex) => (
                  <div key={section.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                        Section {sectionIndex + 1}
                      </p>
                      <h3 className="text-lg font-semibold text-slate-900">{section.title}</h3>
                      {section.description && <p className="text-sm text-slate-600 mt-1">{section.description}</p>}
                    </div>

                    {isAuthenticated ? (
                      <div className="divide-y divide-slate-100">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <div key={lesson.id} className="px-6 py-3 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-medium text-slate-900 truncate">
                                {lessonIndex + 1}. {lesson.title}
                              </p>
                              {lesson.description && (
                                <p className="text-xs text-slate-500 mt-0.5 truncate">{lesson.description}</p>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-600 shrink-0">
                              <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200 uppercase">
                                {lesson.type}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaClock /> {lesson.durationMinutes}m
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-6 py-4 text-sm text-slate-600 bg-white">
                        {section.lessons.length} lesson(s) in this section. Sign in as student to view lesson details.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <p className="text-slate-700 font-medium">No section preview available for this course.</p>
                <p className="text-sm text-slate-500 mt-2">
                  The instructor may add content soon or restrict preview access.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Course Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Status</span>
                  <span className="font-medium uppercase text-slate-900">{course.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Visibility</span>
                  <span className="font-medium uppercase text-slate-900">{course.visibility}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Total Sections</span>
                  <span className="font-semibold text-slate-900">{sections.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Total Lessons</span>
                  <span className="font-semibold text-slate-900">{totalLessons}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Duration</span>
                  <span className="font-semibold text-slate-900">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Price</span>
                  <span className="font-semibold text-slate-900 flex items-center gap-1">
                    {course.isPaid ? formatMoney(course.price) : 'Free'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Next Step</h3>
              <button
                onClick={handlePrimaryAction}
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isEnrolled ? 'Go To Learning' : course.isPaid ? 'Buy This Course' : 'Enroll Free'}
              </button>
              {!isEnrolled && course.isPaid && (
                <button
                  onClick={() => addToCartAndGo('/student/checkout')}
                  disabled={isSubmitting}
                  className="w-full mt-2 py-2.5 rounded-lg border border-slate-300 text-slate-900 hover:bg-slate-50 disabled:opacity-50"
                >
                  Buy Now (Go Checkout)
                </button>
              )}
              {!isEnrolled && course.isPaid && (
                <p className="text-xs text-slate-500 mt-2">
                  Paid courses are added to cart. Complete checkout to unlock all lessons.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default CourseView;
