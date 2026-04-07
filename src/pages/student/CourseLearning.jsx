import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaCheckCircle,
  FaPlayCircle,
  FaClock,
  FaVideo,
  FaLock,
  FaChevronDown,
  FaChevronUp,
  FaDownload,
  FaTrophy,
  FaCheck,
  FaBars,
  FaTimes,
  FaChevronRight,
  FaChevronLeft,
  FaQuestionCircle,
} from 'react-icons/fa';
import VideoPlayer from '../../components/VideoPlayer';
import PDFViewer from '../../components/PDFViewer';
import TextViewer from '../../components/TextViewer';
import Notification from '../../components/common/Notification';
import ButtonWithLoader from '../../components/common/ButtonWithLoader';
import { courseAPI } from '../../api/course';
import { quizAPI } from '../../api/quiz';
import { getUser } from '../../utils/helpers';

const toAbsoluteAssetUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  let baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  baseUrl = baseUrl.replace(/\/$/, '').replace(/\/api\/v[0-9]+\/?$/, '');

  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${cleanUrl}`;
};

const toLessonKey = (value) => String(value ?? '').trim();

const toCompletedFlag = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value > 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return ['true', '1', 'yes', 'completed'].includes(normalized);
  }
  return false;
};

const getStudentDisplayName = () => {
  const user = getUser();
  const candidate =
    user?.full_name ||
    user?.name ||
    user?.username ||
    [user?.first_name, user?.last_name].filter(Boolean).join(' ');

  return String(candidate || 'Student').trim().replace(/\s+/g, ' ');
};

const buildZoomJoinLink = (zoomLink, displayName = getStudentDisplayName()) => {
  if (!zoomLink) return null;

  const trimmed = String(zoomLink).trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    url.searchParams.set('uname', displayName);
    return url.toString();
  } catch {
    const separator = trimmed.includes('?') ? '&' : '?';
    return `${trimmed}${separator}uname=${encodeURIComponent(displayName)}`;
  }
};

const normalizeLessonType = (lesson = {}) => {
  const raw = String(lesson.lesson_type || '').toLowerCase();

  if (lesson.video_file || raw === 'video') return 'VIDEO';
  if (lesson.pdf_file || raw === 'pdf') return 'PDF';
  if (lesson.text_content || raw === 'text') return 'TEXT';
  if (lesson.quiz_id || raw === 'quiz') return 'QUIZ';
  if (lesson.zoom_meeting_link || raw === 'zoom_live' || raw === 'zoom') return 'LINK';

  return 'VIDEO';
};

const mapLessonFromOutline = (lesson = {}, section = {}, index = 0) => ({
  id: toLessonKey(lesson.lesson_id || `${section.id || 'section'}-lesson-${index}`),
  sectionId: toLessonKey(section.id),
  sectionTitle: section.title,
  title: lesson.title || `Lesson ${index + 1}`,
  description: lesson.description || lesson.text_content || '',
  type: normalizeLessonType(lesson),
  duration: lesson.duration_minutes ? `${lesson.duration_minutes} mins` : '0 mins',
  videoUrl: toAbsoluteAssetUrl(lesson.video_file),
  documentUrl: toAbsoluteAssetUrl(lesson.pdf_file),
  downloadUrl: toAbsoluteAssetUrl(lesson.pdf_file),
  zoom_meeting_link: lesson.zoom_meeting_link || lesson.zoom_link || null,
  quiz_id: lesson.quiz_id || null,
  contentId: null,
  is_locked: false,
  is_completed: toCompletedFlag(lesson.is_completed),
  resources: [],
});

const mapCourseHeader = (course = {}) => ({
  id: course.course_id || course.id,
  title: course.title || 'Untitled Course',
  subject: course.subject || 'General',
  description: course.description || '',
  sections: [],
  lessons: 0,
});

const StudentCourseLearning = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [currentLesson, setCurrentLesson] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allLessons, setAllLessons] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [notification, setNotification] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [markingCompleteId, setMarkingCompleteId] = useState(null);
  const [quizStatusById, setQuizStatusById] = useState({});
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewAnonymous, setReviewAnonymous] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const showNotification = useCallback((message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  }, []);

  const setLessonInCollections = useCallback((lessonId, updater) => {
    const targetLessonId = toLessonKey(lessonId);
    setAllLessons((prev) =>
      prev.map((l) => (toLessonKey(l.id) === targetLessonId ? updater(l) : l))
    );

    setCourse((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: (prev.sections || []).map((section) => ({
          ...section,
          lessons: (section.lessons || []).map((l) =>
            toLessonKey(l.id) === targetLessonId ? updater(l) : l
          ),
        })),
      };
    });
  }, []);

  const isLessonCompleted = useCallback(
    (lesson) => {
      if (!lesson) return false;
      if (lesson.type === 'QUIZ' && lesson.quiz_id) {
        const quizStatus = quizStatusById[String(lesson.quiz_id)] || {};
        return Boolean(quizStatus.hasCompletedAttempt);
      }
      return completedLessons.has(toLessonKey(lesson.id)) || toCompletedFlag(lesson.is_completed);
    },
    [completedLessons, quizStatusById]
  );

  const fetchQuizStatus = useCallback(async (quizId) => {
    if (!quizId) return { hasCompletedAttempt: false, lastAttemptId: null, attemptsCount: 0 };

    try {
      const resultsRes = await quizAPI.getQuizResults(quizId);
      const attempts = Array.isArray(resultsRes?.data?.data?.attempts) ? resultsRes.data.data.attempts : [];

      const sortedAttempts = [...attempts].sort((a, b) => {
        const aDate = new Date(a?.submitted_at || a?.created_at || 0).getTime();
        const bDate = new Date(b?.submitted_at || b?.created_at || 0).getTime();
        return bDate - aDate;
      });

      const lastAttempt = sortedAttempts[0] || null;
      return {
        hasCompletedAttempt: sortedAttempts.length > 0,
        lastAttemptId: lastAttempt?.attempt_id || lastAttempt?.id || null,
        attemptsCount: sortedAttempts.length,
      };
    } catch {
      return { hasCompletedAttempt: false, lastAttemptId: null, attemptsCount: 0 };
    }
  }, []);

  const loadLessonDetails = useCallback(
    async (lesson) => {
      if (!lesson || !courseId) return lesson;
      if (lesson.contentId) return lesson;

      try {
        const detailsRes = await courseAPI.getCourseContentDetails(courseId, lesson.id);
        const lessonData = detailsRes?.data?.data?.lesson || {};
        const contents = Array.isArray(lessonData.contents) ? lessonData.contents : [];

        const pickByType = (type) => contents.find((c) => String(c.content_type || '').toLowerCase() === type);
        const primary =
          (lesson.type === 'VIDEO' && pickByType('video')) ||
          (lesson.type === 'PDF' && pickByType('pdf')) ||
          (lesson.type === 'TEXT' && pickByType('text')) ||
          (lesson.type === 'QUIZ' && pickByType('quiz')) ||
          (lesson.type === 'LINK' && pickByType('zoom_live')) ||
          contents[0];

        const enhanced = {
          ...lesson,
          contentId: primary?.content_id || lesson.contentId || null,
          videoUrl: toAbsoluteAssetUrl(primary?.video_url || lesson.videoUrl),
          documentUrl: toAbsoluteAssetUrl(primary?.pdf_file_url || lesson.documentUrl),
          downloadUrl: toAbsoluteAssetUrl(primary?.pdf_file_url || lesson.downloadUrl),
          zoom_meeting_link: primary?.zoom_link || lesson.zoom_meeting_link || null,
          description: primary?.text_content || primary?.description || lesson.description,
          quiz_id: primary?.quiz_id || lesson.quiz_id || null,
          type: normalizeLessonType({
            lesson_type: lesson.type,
            video_file: primary?.video_url,
            pdf_file: primary?.pdf_file_url,
            text_content: primary?.text_content,
            quiz_id: primary?.quiz_id,
            zoom_meeting_link: primary?.zoom_link,
          }),
        };

        setLessonInCollections(lesson.id, () => enhanced);
        return enhanced;
      } catch {
        return lesson;
      }
    },
    [courseId, setLessonInCollections]
  );

  const refreshProgress = useCallback(async () => {
    if (!courseId) return;
    try {
      const progressRes = await courseAPI.getCourseProgress(courseId);
      const data = progressRes?.data?.data || {};
      const apiProgress = Number(data.enrollment_progress ?? data.overall_progress ?? 0);
      setProgress(Number.isFinite(apiProgress) ? apiProgress : 0);
    } catch {
      // best effort refresh only
    }
  }, [courseId]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const [detailsRes, contentRes, progressRes] = await Promise.all([
          courseAPI.getCourseDetails(courseId),
          courseAPI.getCourseContent(courseId),
          courseAPI.getCourseProgress(courseId).catch(() => null),
        ]);

        const courseData = detailsRes?.data?.data || {};
        const contentData = contentRes?.data?.data || {};

        const mappedCourse = mapCourseHeader(courseData);
        const sectionRows = Array.isArray(contentData.sections) ? contentData.sections : [];

        const mappedSections = sectionRows.map((section, sectionIndex) => {
          const sectionShape = {
            id: section.section_id || `section-${sectionIndex}`,
            title: section.title || `Section ${sectionIndex + 1}`,
            description: section.description || '',
            lessons: [],
          };

          const lessons = (Array.isArray(section.lessons) ? section.lessons : []).map((lesson, lessonIndex) =>
            mapLessonFromOutline(lesson, sectionShape, lessonIndex)
          );

          sectionShape.lessons = lessons;
          return sectionShape;
        });

        const flatLessons = mappedSections.flatMap((s) => s.lessons);
        const completed = new Set(flatLessons.filter((l) => l.is_completed).map((l) => toLessonKey(l.id)));

        const quizLessons = flatLessons.filter((lesson) => lesson.type === 'QUIZ' && lesson.quiz_id);
        const uniqueQuizIds = [...new Set(quizLessons.map((lesson) => String(lesson.quiz_id)))];
        const quizStatusEntries = await Promise.all(
          uniqueQuizIds.map(async (quizId) => [quizId, await fetchQuizStatus(quizId)])
        );
        const quizStatusMap = Object.fromEntries(quizStatusEntries);

        quizLessons.forEach((lesson) => {
          const quizStatus = quizStatusMap[String(lesson.quiz_id)] || {};
          if (quizStatus.hasCompletedAttempt) {
            completed.add(toLessonKey(lesson.id));
            lesson.is_completed = true;
          } else {
            lesson.is_completed = false;
          }
        });

        const progressData = progressRes?.data?.data || {};
        const apiProgress = Number(progressData.enrollment_progress ?? progressData.overall_progress ?? 0);
        const computedProgress =
          flatLessons.length > 0 ? Math.round((completed.size / flatLessons.length) * 100) : 0;

        const firstLesson =
          flatLessons.find((l) => !completed.has(toLessonKey(l.id))) || flatLessons[0] || null;

        setCourse({
          ...mappedCourse,
          sections: mappedSections,
          lessons: flatLessons.length,
        });
        setAllLessons(flatLessons);
        setQuizStatusById(quizStatusMap);
        setCompletedLessons(completed);
        setExpandedSections(new Set([mappedSections[0]?.id].filter(Boolean)));
        setProgress(Number.isFinite(apiProgress) && apiProgress > 0 ? apiProgress : computedProgress);

        if (firstLesson) {
          const hydrated = await loadLessonDetails(firstLesson);
          setCurrentLesson(hydrated);
          setCurrentLessonIndex(
            flatLessons.findIndex((l) => toLessonKey(l.id) === toLessonKey(firstLesson.id))
          );
        }
      } catch (err) {
        const message = err?.response?.data?.message || 'Failed to load course. Please try again.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId, fetchQuizStatus, loadLessonDetails]);

  const handleLessonClick = useCallback(
    async (lesson) => {
      if (!lesson) return;
      if (lesson.is_locked) {
        showNotification('This lesson is locked. Complete previous lessons to unlock it.', 'warning');
        return;
      }

      const hydrated = await loadLessonDetails(lesson);
      setCurrentLesson(hydrated);
      setCurrentLessonIndex(
        allLessons.findIndex((l) => toLessonKey(l.id) === toLessonKey(lesson.id))
      );
      setSidebarOpen(false);
    },
    [allLessons, loadLessonDetails, showNotification]
  );

  const markLessonComplete = useCallback(
    async (lesson) => {
      if (!lesson || !courseId) return;
      if (lesson.type === 'QUIZ') return;

      try {
        setMarkingCompleteId(toLessonKey(lesson.id));
        await courseAPI.completeLesson(courseId, lesson.id);

        setCompletedLessons((prev) => {
          const next = new Set(prev);
          next.add(toLessonKey(lesson.id));
          return next;
        });

        setLessonInCollections(lesson.id, (prev) => ({ ...prev, is_completed: true }));
        await refreshProgress();
      } catch (err) {
        const message = err?.response?.data?.message || 'Failed to mark lesson as complete.';
        showNotification(message, 'error');
      } finally {
        setMarkingCompleteId(null);
      }
    },
    [courseId, refreshProgress, setLessonInCollections, showNotification]
  );

  const markLessonIncomplete = useCallback(
    async (lesson) => {
      if (!lesson || !courseId) return;
      if (lesson.type === 'QUIZ') return;

      try {
        setMarkingCompleteId(toLessonKey(lesson.id));
        await courseAPI.uncompleteLesson(courseId, lesson.id);

        setCompletedLessons((prev) => {
          const next = new Set(prev);
          next.delete(toLessonKey(lesson.id));
          return next;
        });

        setLessonInCollections(lesson.id, (prev) => ({ ...prev, is_completed: false }));
        await refreshProgress();
      } catch (err) {
        const message = err?.response?.data?.message || 'Failed to mark lesson as incomplete.';
        showNotification(message, 'error');
      } finally {
        setMarkingCompleteId(null);
      }
    },
    [courseId, refreshProgress, setLessonInCollections, showNotification]
  );

  const toggleLessonComplete = useCallback(
    async (lesson) => {
      if (!lesson) return;
      if (isLessonCompleted(lesson)) {
        await markLessonIncomplete(lesson);
      } else {
        await markLessonComplete(lesson);
      }
    },
    [isLessonCompleted, markLessonComplete, markLessonIncomplete]
  );

  const handleVideoSyncProgress = useCallback(
    async (payload) => {
      if (!courseId || !currentLesson?.id || !currentLesson?.contentId) return;
      try {
        await courseAPI.updateWatchProgress(courseId, currentLesson.id, currentLesson.contentId, {
          watched_percentage: Math.round(Number(payload?.percentage || 0)),
          current_position_seconds: Math.round(Number(payload?.currentTime || 0)),
          quality_watched: payload?.quality || undefined,
          watch_time_seconds: 0,
        });
      } catch {
        // sync failures are non-blocking for the learning experience
      }
    },
    [courseId, currentLesson]
  );

  const goToPreviousLesson = useCallback(() => {
    if (currentLessonIndex > 0) {
      handleLessonClick(allLessons[currentLessonIndex - 1]);
    }
  }, [allLessons, currentLessonIndex, handleLessonClick]);

  const goToNextLesson = useCallback(() => {
    if (currentLessonIndex < allLessons.length - 1) {
      handleLessonClick(allLessons[currentLessonIndex + 1]);
    }
  }, [allLessons, currentLessonIndex, handleLessonClick]);

  const submitReview = useCallback(async () => {
    if (!courseId) return;

    if (progress < 100) {
      showNotification('Complete the course before leaving a review.', 'warning');
      return;
    }

    try {
      setReviewSubmitting(true);
      await courseAPI.createReview(courseId, {
        rating: reviewRating,
        title: reviewTitle.trim() || undefined,
        review_text: reviewText.trim() || undefined,
        is_anonymous: reviewAnonymous,
      });
      setReviewSubmitted(true);
      setReviewTitle('');
      setReviewText('');
      setReviewAnonymous(false);
      showNotification('Thank you for your review.', 'success');
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to submit review.';
      showNotification(message, 'error');
    } finally {
      setReviewSubmitting(false);
    }
  }, [courseId, progress, reviewAnonymous, reviewText, reviewTitle, reviewRating, showNotification]);

  const toggleSection = useCallback((sectionId) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  const makeVideoUrl = (url) => toAbsoluteAssetUrl(url);
  const zoomJoinUrl = currentLesson?.type === 'LINK' ? buildZoomJoinLink(currentLesson.zoom_meeting_link) : null;

  const contentTypeLabel = useMemo(() => {
    if (!currentLesson) return 'Lesson';
    if (currentLesson.type === 'LINK') return 'Zoom';
    return currentLesson.type;
  }, [currentLesson]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="h-1 bg-slate-200"></div>
        </header>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-900 mb-2">Course Error</h2>
            <p className="text-red-700 mb-6">{error || 'Course not found'}</p>
            <button
              onClick={() => navigate('/student/courses')}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <FaArrowLeft size={16} /> Back to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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

      <div className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/student/courses')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <FaArrowLeft className="text-slate-600" size={20} />
            </button>
            <div>
              <h1 className="font-semibold text-lg text-slate-900">{course.title}</h1>
              <p className="text-xs text-slate-500">{course.subject}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{progress}%</p>
              <p className="text-xs text-slate-500">Complete</p>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
        <div className="h-1 bg-slate-200">
          <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 sm:p-6 lg:p-8">
          <aside className="hidden lg:block lg:col-span-1 overflow-y-auto z-10">
            <div className="p-4 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
              {(course.sections || []).map((section) => (
                <div key={section.id} className="space-y-1">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors font-medium text-sm text-slate-900 flex items-center justify-between"
                  >
                    <span>{section.title}</span>
                    {expandedSections.has(section.id) ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                  </button>

                  {expandedSections.has(section.id) && (
                    <div className="space-y-1 ml-2">
                      {(section.lessons || []).map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonClick(lesson)}
                          disabled={lesson.is_locked}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                            currentLesson?.id === lesson.id
                              ? 'bg-blue-100 text-blue-900 font-medium'
                              : 'hover:bg-slate-100 text-slate-700'
                          } ${lesson.is_locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {isLessonCompleted(lesson) ? (
                            <FaCheckCircle className="text-green-500 flex-shrink-0" size={14} />
                          ) : lesson.is_locked ? (
                            <FaLock className="text-slate-400 flex-shrink-0" size={14} />
                          ) : (
                            <FaPlayCircle className="text-blue-500 flex-shrink-0" size={14} />
                          )}
                          <span className="truncate flex-1 text-xs">{lesson.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </aside>

          {sidebarOpen && (
            <div className="fixed inset-0 top-20 z-50 lg:hidden transition-opacity duration-300 ease-in-out">
              <div className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 overflow-y-auto shadow-2xl">
                <div className="p-4 space-y-2">
                  {(course.sections || []).map((section) => (
                    <div key={section.id} className="space-y-1">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors font-medium text-sm text-slate-900 flex items-center justify-between"
                      >
                        <span>{section.title}</span>
                        {expandedSections.has(section.id) ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                      </button>

                      {expandedSections.has(section.id) && (
                        <div className="space-y-1 ml-2">
                          {(section.lessons || []).map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => handleLessonClick(lesson)}
                              disabled={lesson.is_locked}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                                currentLesson?.id === lesson.id
                                  ? 'bg-blue-100 text-blue-900 font-medium'
                                  : 'hover:bg-slate-100 text-slate-700'
                              } ${lesson.is_locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              {isLessonCompleted(lesson) ? (
                                <FaCheckCircle className="text-green-500 flex-shrink-0" size={14} />
                              ) : lesson.is_locked ? (
                                <FaLock className="text-slate-400 flex-shrink-0" size={14} />
                              ) : (
                                <FaPlayCircle className="text-blue-500 flex-shrink-0" size={14} />
                              )}
                              <span className="truncate flex-1 text-xs">{lesson.title}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 opacity-100" onClick={() => setSidebarOpen(false)}></div>
            </div>
          )}

          <main className="lg:col-span-3">
            <div className="bg-slate-50 rounded-lg p-6 sm:p-8 mb-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-slate-900">{currentLesson.title}</h2>
                        {isLessonCompleted(currentLesson) && (
                          <FaCheckCircle className="text-2xl text-green-500" />
                        )}
                      </div>
                      {currentLesson.description && (
                        <p className="text-slate-600 text-sm mt-2">{currentLesson.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 sm:gap-6 text-sm mb-6 pb-6 border-b border-slate-200">
                    <div className="flex items-center gap-2 text-slate-600">
                      <FaClock className="text-slate-400" size={16} />
                      <span className="font-medium">{currentLesson.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <FaVideo className="text-slate-400" size={16} />
                      <span className="font-medium capitalize">{contentTypeLabel}</span>
                    </div>
                    {currentLesson.quiz_id && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <FaQuestionCircle className="text-slate-400" size={16} />
                        <span className="font-medium">Quiz Available</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {currentLesson.type !== 'QUIZ' && (
                      <ButtonWithLoader
                        label={isLessonCompleted(currentLesson) ? 'Undo Complete' : 'Mark Complete'}
                        loadingLabel="Updating..."
                        isLoading={markingCompleteId === toLessonKey(currentLesson.id)}
                        onClick={() => toggleLessonComplete(currentLesson)}
                        variant="success"
                        size="md"
                        icon={isLessonCompleted(currentLesson) ? <FaCheckCircle size={14} /> : <FaCheck size={14} />}
                      />
                    )}
                    {currentLesson.documentUrl && (
                      <ButtonWithLoader
                        label="Download"
                        loadingLabel="Downloading..."
                        isLoading={downloadingId === currentLesson.id}
                        onClick={() => {
                          setDownloadingId(currentLesson.id);
                          setTimeout(() => {
                            const link = document.createElement('a');
                            link.href = currentLesson.documentUrl;
                            link.download = currentLesson.title || 'document';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            setDownloadingId(null);
                          }, 200);
                        }}
                        variant="primary"
                        size="md"
                        icon={<FaDownload size={14} />}
                      />
                    )}
                    {currentLesson.quiz_id && (
                      <button
                        onClick={() => navigate(`/student/quiz/${currentLesson.quiz_id}`)}
                        className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                      >
                        <FaQuestionCircle size={14} /> Take Quiz
                      </button>
                    )}
                    {currentLesson.type === 'LINK' && zoomJoinUrl && (
                      <a
                        href={zoomJoinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                      >
                        <FaVideo size={14} /> Join Zoom Class
                      </a>
                    )}
                </div>
            </div>
            {currentLesson && (
              <div className="space-y-6">
                <div className="bg-black rounded-lg overflow-hidden shadow-sm">
                  {currentLesson.type === 'VIDEO' && currentLesson.videoUrl ? (
                    <VideoPlayer
                      videoUrl={makeVideoUrl(currentLesson.videoUrl)}
                      contentId={currentLesson.contentId}
                      onSyncProgress={handleVideoSyncProgress}
                      onComplete={() => {
                        if (!isLessonCompleted(currentLesson)) {
                          markLessonComplete(currentLesson);
                        }
                      }}
                      isCompleted={isLessonCompleted(currentLesson)}
                    />
                  ) : currentLesson.type === 'PDF' && currentLesson.documentUrl ? (
                    <PDFViewer
                      pdfUrl={currentLesson.documentUrl}
                      title={currentLesson.title}
                      contentId={currentLesson.contentId || currentLesson.id}
                      onComplete={() => {
                        if (!isLessonCompleted(currentLesson)) {
                          markLessonComplete(currentLesson);
                        }
                      }}
                      isCompleted={isLessonCompleted(currentLesson)}
                      fileName={currentLesson.title}
                      disableDownload={false}
                      disablePrint={false}
                    />
                  ) : currentLesson.type === 'TEXT' ? (
                    <TextViewer
                      key={currentLesson.id}
                      title={currentLesson.title}
                      content={currentLesson.description || ''}
                      contentId={currentLesson.contentId || currentLesson.id}
                      onComplete={() => {
                        if (!isLessonCompleted(currentLesson)) {
                          markLessonComplete(currentLesson);
                        }
                      }}
                      isCompleted={isLessonCompleted(currentLesson)}
                    />
                  ) : currentLesson.type === 'QUIZ' && currentLesson.quiz_id ? (
                    <div className="aspect-video flex items-center justify-center bg-slate-50">
                      <div className="w-full max-w-2xl p-6 sm:p-8 text-center">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Quiz Lesson</h3>
                        <p className="text-slate-600 mb-6">
                          {isLessonCompleted(currentLesson)
                            ? 'You have completed at least one attempt for this quiz.'
                            : 'Complete a quiz attempt to mark this lesson as completed.'}
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                          <button
                            onClick={() => navigate(`/student/quiz/${currentLesson.quiz_id}/take`)}
                            className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors text-sm"
                          >
                            {isLessonCompleted(currentLesson) ? 'Retry Quiz' : 'Take Quiz'}
                          </button>
                          {(() => {
                            const quizStatus = quizStatusById[String(currentLesson.quiz_id)] || {};
                            if (!quizStatus.lastAttemptId) return null;
                            return (
                              <button
                                onClick={() =>
                                  navigate(`/student/quiz/${currentLesson.quiz_id}/results/${quizStatus.lastAttemptId}`)
                                }
                                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors text-sm"
                              >
                                View Result
                              </button>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  ) : currentLesson.type === 'LINK' ? (
                    <div className="aspect-video flex items-center justify-center bg-slate-50">
                      <div className="w-full max-w-2xl p-6 sm:p-8 text-center">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Zoom Class</h3>
                        <p className="text-slate-600 mb-6">
                          Join the live class using the button above. Your name will be passed to Zoom automatically.
                        </p>
                        {zoomJoinUrl ? (
                          <a
                            href={zoomJoinUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
                          >
                            <FaVideo size={14} /> Join Zoom Class
                          </a>
                        ) : (
                          <p className="text-slate-500 font-medium">Zoom meeting link is not available.</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video flex items-center justify-center bg-slate-100">
                      <p className="text-slate-600 font-medium">No content available for this lesson</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 justify-between">
                  <button
                    onClick={goToPreviousLesson}
                    disabled={currentLessonIndex === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 rounded-lg font-medium transition-colors text-sm"
                  >
                    <FaChevronLeft size={14} /> Previous
                  </button>
                  <button
                    onClick={goToNextLesson}
                    disabled={currentLessonIndex === allLessons.length - 1}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    Next <FaChevronRight size={14} />
                  </button>
                </div>

                {progress >= 100 && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-8 text-center border border-amber-200">
                    <FaTrophy className="text-5xl text-amber-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Course Complete!</h3>
                    <p className="text-slate-600 mb-6">You've successfully completed this course.</p>
                    <div className="flex gap-3 justify-center flex-wrap">
                      <button
                        onClick={() => navigate('/student/certificates')}
                        className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors text-sm"
                      >
                        Get Certificate
                      </button>
                      <button
                        onClick={() => navigate('/student/courses')}
                        className="px-6 py-2 bg-white border border-slate-300 text-slate-900 font-medium rounded-lg hover:bg-slate-50 transition-colors text-sm"
                      >
                        Back to Courses
                      </button>
                    </div>

                    <div className="mt-8 bg-white/80 backdrop-blur rounded-xl border border-amber-200 p-6 text-left max-w-2xl mx-auto">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">Leave a review</h4>
                          <p className="text-sm text-slate-600">Share your experience with other students.</p>
                        </div>
                        {reviewSubmitted && (
                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                            Submitted
                          </span>
                        )}
                      </div>

                      {!reviewSubmitted ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                  key={value}
                                  type="button"
                                  onClick={() => setReviewRating(value)}
                                  className="p-1"
                                  aria-label={`${value} star rating`}
                                >
                                  <FaStar
                                    className={
                                      value <= reviewRating ? 'text-yellow-400' : 'text-slate-300'
                                    }
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                            <input
                              type="text"
                              value={reviewTitle}
                              onChange={(event) => setReviewTitle(event.target.value)}
                              placeholder="What stood out most?"
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Review</label>
                            <textarea
                              value={reviewText}
                              onChange={(event) => setReviewText(event.target.value)}
                              rows={4}
                              placeholder="Tell others about your experience..."
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300 resize-none"
                            />
                          </div>

                          <label className="flex items-center gap-2 text-sm text-slate-700">
                            <input
                              type="checkbox"
                              checked={reviewAnonymous}
                              onChange={(event) => setReviewAnonymous(event.target.checked)}
                            />
                            Post anonymously
                          </label>

                          <button
                            onClick={submitReview}
                            disabled={reviewSubmitting}
                            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors text-sm"
                          >
                            {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-700">Your review has been saved.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default StudentCourseLearning;
