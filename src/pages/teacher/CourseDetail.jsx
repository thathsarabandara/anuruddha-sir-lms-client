 
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { BiLoader } from 'react-icons/bi';
import { FaEdit, FaStar, FaCheck, FaTimes, FaUser, FaEye, FaBook, FaGamepad, FaStar as FaRating, FaUsers, FaGripVertical } from 'react-icons/fa';
import QuizSearchModal from '../../components/teacher/QuizSearchModal';
import { getAbsoluteImageUrl } from '../../utils/helpers';
import PDFViewer from '../../components/PDFViewer';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import Notification from '../../components/common/Notification';
import { courseAPI } from '../../api/course';
import { quizAPI } from '../../api/quiz';
import {
  COURSE_SUBJECT_OPTIONS,
  COURSE_GRADE_LEVEL_OPTIONS,
  COURSE_TYPE_OPTIONS,
} from '../../utils/courseOptions';

const getErrorMessage = (err, fallback = 'Something went wrong') =>
  err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'view';
  const getDefaultLessonForm = () => ({
    title: '',
    description: '',
    lesson_type: 'video',
    content_url: '',
    duration_minutes: '',
    order: '',
    video_url: '',
    external_link: '',
    text_content: '',
    zoom_meeting_link: '',
    zoom_meeting_id: '',
    zoom_passcode: '',
    scheduled_date: '',
    scheduled_time: '',
    quiz_id: ''
  });

  const lessonTypeOptions = [
    { value: 'video', label: 'Video' },
    { value: 'zoom', label: 'Zoom' },
    { value: 'text', label: 'Text' },
    { value: 'pdf', label: 'PDF' },
    { value: 'quiz', label: 'Quiz' },
  ];

  const formatLessonType = (lessonType) => {
    if (!lessonType) return 'video';
    const matched = lessonTypeOptions.find((option) => option.value === String(lessonType).toLowerCase());
    return matched ? matched.label : String(lessonType);
  };

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [course, setCourse] = useState(null);
  const [notification, setNotification] = useState(null);
  const [sections, setSections] = useState([]);
  
  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };
  const subjects = COURSE_SUBJECT_OPTIONS;
  const gradeLevels = COURSE_GRADE_LEVEL_OPTIONS;
  const courseTypes = COURSE_TYPE_OPTIONS;
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [showStudentProfileModal, setShowStudentProfileModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showQuizSearchModal, setShowQuizSearchModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showVideoPlayerModal, setShowVideoPlayerModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [deleteConfirmData, setDeleteConfirmData] = useState({ type: null, id: null, name: '' });
  const [editingSection, setEditingSection] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [draggedLesson, setDraggedLesson] = useState(null);
  const [dragOverLesson, setDragOverLesson] = useState(null);
  const [uploadProgress, _setUploadProgress] = useState(0);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    subject: '',
    grade_level: '',
    course_type: 'monthly',
    price: '',
    status: 'DRAFT',
    visibility: 'PUBLIC',
    language: 'SINHALA',
    access_type: 'NORMAL',
    generate_certificates: false
  });
  const [sectionForm, setSectionForm] = useState({
    title: '',
    description: '',
    order: 1
  });
  const [lessonForm, setLessonForm] = useState(getDefaultLessonForm());
  const [uploadingFile, _setUploadingFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizVerification, setQuizVerification] = useState({
    isLoading: false,
    isValid: false,
    quizData: null,
    error: null
  });
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [showPDFViewerModal, setShowPDFViewerModal] = useState(false);
  const courseThumbnailUrl = getAbsoluteImageUrl(course?.thumbnail_url || course?.thumbnail);

  const [courseStats, setCourseStats] = useState({
    total_sections: 0,
    total_lessons: 0,
    students_enrolled: 0,
    average_rating: 0,
  });

  const courseStatsConfig = [
    {
      label: 'Total Sections',
      statsKey: 'total_sections',
      icon: FaBook,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'course sections',
    },
    {
      label: 'Total Lessons',
      statsKey: 'total_lessons',
      icon: FaGamepad,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'total lessons',
    },
    {
      label: 'Students Enrolled',
      statsKey: 'students_enrolled',
      icon: FaUsers,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'enrolled students',
    },
    {
      label: 'Average Rating',
      statsKey: 'average_rating',
      icon: FaRating,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      description: 'course rating',
      formatter: (value) => `${value} ★`,
    },
  ];

  // DataTable columns for enrolled students
  const studentColumns = [
    {
      key: 'name',
      label: 'Student Name',
      searchable: true,
      render: (_, row) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <FaUser className="text-blue-600" />
          </div>
          <div className="ml-3">
            <div className="font-medium text-gray-900">{row.name}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'payment_method',
      label: 'Payment Method',
      render: (_, row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          row.payment_method === 'CARD' ? 'bg-blue-100 text-blue-700' :
          row.payment_method === 'BANK_TRANSFER' ? 'bg-green-100 text-green-700' :
          row.payment_method === 'CASH' ? 'bg-yellow-100 text-yellow-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {row.payment_method || 'N/A'}
        </span>
      ),
    },
    {
      key: 'payment_status',
      label: 'Payment Status',
      render: (_, row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
          row.payment_status === 'PAID' || row.payment_status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
          row.payment_status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {row.payment_status === 'PAID' || row.payment_status === 'COMPLETED' ? <FaCheck className="text-xs" /> : null}
          {row.payment_status}
        </span>
      ),
    },
    {
      key: 'enrolled_date',
      label: 'Enrolled Date',
      render: (_, row) => <span className="text-sm text-gray-500">{new Date(row.enrolled_at || row.enrolled_date || row.created_at).toLocaleDateString()}</span>,
    },
    {
      key: 'progress',
      label: 'Progress',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div className={`h-2 rounded-full ${
              row.progress >= 75 ? 'bg-green-600' :
              row.progress >= 50 ? 'bg-yellow-600' :
              'bg-red-600'
            }`} style={{ width: `${row.progress}%` }}></div>
          </div>
          <span className="text-sm font-medium text-gray-900">{row.progress}%</span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <button
          onClick={() => {
            setSelectedStudent(row);
            setShowStudentProfileModal(true);
          }}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          <FaEye /> View
        </button>
      ),
    },
  ];

  const loadCourseData = useCallback(async () => {
    try {
      setLoading(true);
      setLoadingStudents(true);

      const [detailsRes, contentRes, statsRes, enrollmentsRes] = await Promise.all([
        courseAPI.getCourseDetails(courseId),
        courseAPI.getCourseContent(courseId),
        courseAPI.getCourseStats(courseId).catch(() => null),
        courseAPI.getCourseEnrollments(courseId, { page: 1, limit: 200 }).catch(() => null),
      ]);

      const details = detailsRes?.data?.data || {};
      const contentData = contentRes?.data?.data || {};
      const statsData = statsRes?.data?.data || {};
      const enrollmentRows = enrollmentsRes?.data?.data || [];
      setCourse(details);
      setSections(contentData?.sections || []);
      setEnrolledStudents(Array.isArray(enrollmentRows) ? enrollmentRows : []);

      setCourseForm({
        title: details?.title || '',
        description: details?.description || '',
        subject: details?.subject || '',
        grade_level: details?.grade_level || details?.grade_level_name || '',
        course_type: details?.course_type || 'monthly',
        price: details?.price || '',
        status: details?.status || 'DRAFT',
        visibility: details?.visibility || 'PUBLIC',
        language: details?.language || 'SINHALA',
        access_type: details?.access_type || 'NORMAL',
        generate_certificates: Boolean(details?.generate_certificates),
      });

      setCourseStats({
        total_sections: statsData?.total_sections || contentData?.sections?.length || 0,
        total_lessons: statsData?.total_lessons || contentData?.sections?.reduce((sum, section) => sum + (section?.lessons?.length || 0), 0) || 0,
        students_enrolled: statsData?.students_enrolled || details?.total_enrollments || 0,
        average_rating: statsData?.average_rating || details?.average_rating || 0,
      });
    } catch (err) {
      showNotification(getErrorMessage(err, 'Failed to load course data'), 'error');
    } finally {
      setLoading(false);
      setLoadingStudents(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadCourseData();
  }, [loadCourseData]);

  const refreshCourseContent = async () => {
    const response = await courseAPI.getCourseContent(courseId);
    const contentData = response?.data?.data;
    const nextSections = contentData?.sections || [];
    setSections(nextSections);
    setCourseStats((prev) => ({
      ...prev,
      total_sections: nextSections.length,
      total_lessons: nextSections.reduce((sum, section) => sum + (section?.lessons?.length || 0), 0),
    }));
  };

  const findContentByType = (contents = [], contentType) =>
    (contents || []).find((content) => String(content?.content_type || '').toLowerCase() === contentType);

  const syncLessonTypeContent = async (lessonId, lessonType, existingContents = []) => {
    const normalizedType = String(lessonType || '').toLowerCase();

    if (normalizedType === 'quiz') {
      const quizId = String(lessonForm.quiz_id || '').trim();
      if (!quizId) {
        throw new Error('Quiz ID is required for quiz lessons');
      }

      const existingQuizContent = findContentByType(existingContents, 'quiz');
      const payload = {
        title: lessonForm.title,
        description: lessonForm.description || undefined,
        quiz_id: quizId,
      };

      if (existingQuizContent?.content_id) {
        await courseAPI.updateQuizContent(courseId, lessonId, existingQuizContent.content_id, payload);
      } else {
        await courseAPI.addQuizContent(courseId, lessonId, payload);
      }
      return;
    }

    if (normalizedType === 'text') {
      const textValue = String(lessonForm.text_content || '').trim();
      if (!textValue) {
        throw new Error('Text content is required for text lessons');
      }

      const existingTextContent = findContentByType(existingContents, 'text');
      const payload = {
        title: lessonForm.title,
        description: lessonForm.description || undefined,
        text_content: textValue,
      };

      if (existingTextContent?.content_id) {
        await courseAPI.updateTextContent(courseId, lessonId, existingTextContent.content_id, payload);
      } else {
        await courseAPI.addTextContent(courseId, lessonId, payload);
      }
      return;
    }

    if (normalizedType === 'video') {
      const videoUrl = String(lessonForm.video_url || '').trim();
      if (!videoUrl) return;

      const existingVideoContent = findContentByType(existingContents, 'video');
      const payload = {
        title: lessonForm.title,
        description: lessonForm.description || undefined,
        video_url: videoUrl,
      };

      if (existingVideoContent?.content_id) {
        await courseAPI.updateVideoContent(courseId, lessonId, existingVideoContent.content_id, payload);
      } else {
        await courseAPI.addVideoContent(courseId, lessonId, payload);
      }
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      const existingStatus = String(course?.status || 'DRAFT').toUpperCase();
      const nextStatus = String(courseForm.status || existingStatus).toUpperCase();
      const existingVisibility = String(course?.visibility || 'PUBLIC').toUpperCase();
      const nextVisibility = String(courseForm.visibility || existingVisibility).toUpperCase();

      await courseAPI.updateCourse(courseId, {
        title: courseForm.title,
        description: courseForm.description,
        subject: courseForm.subject || undefined,
        grade_level: courseForm.grade_level || undefined,
        course_type: courseForm.course_type || undefined,
        price: courseForm.price || 0,
        language: courseForm.language,
        access_type: courseForm.access_type,
      });

      if (existingStatus !== nextStatus) {
        if (nextStatus === 'PUBLISHED') {
          await courseAPI.publishCourse(courseId);
        } else if (nextStatus === 'DRAFT') {
          await courseAPI.unpublishCourse(courseId);
        } else if (nextStatus === 'ARCHIVED') {
          await courseAPI.archiveCourse(courseId);
        }
      }

      if (existingVisibility !== nextVisibility) {
        if (nextVisibility === 'PRIVATE') {
          await courseAPI.setCoursePrivate(courseId);
        } else if (nextVisibility === 'PUBLIC') {
          await courseAPI.setCoursePublic(courseId);
        }
      }

      await loadCourseData();
      showNotification('Course updated successfully', 'success');
      setShowEditModal(false);
    } catch (err) {
      showNotification(getErrorMessage(err, 'Failed to update course'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadThumbnail = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type?.startsWith('image/')) {
      showNotification('Please select a valid image file', 'error');
      e.target.value = '';
      return;
    }

    try {
      _setUploadingFile(true);
      _setUploadProgress(0);

      await courseAPI.uploadCourseThumbnail(courseId, file, (progressEvent) => {
        const total = progressEvent?.total || 0;
        if (!total) return;
        const percent = Math.round((progressEvent.loaded * 100) / total);
        _setUploadProgress(Math.max(0, Math.min(100, percent)));
      });

      await loadCourseData();
      showNotification('Thumbnail uploaded successfully', 'success');
    } catch (err) {
      showNotification(getErrorMessage(err, 'Failed to upload thumbnail'), 'error');
    } finally {
      _setUploadingFile(false);
      _setUploadProgress(0);
      e.target.value = '';
    }
  };

  const handleDeleteThumbnail = async () => {
    if (!window.confirm('Are you sure you want to delete the current thumbnail?')) return;

    try {
      _setUploadingFile(true);
      await courseAPI.deleteCourseThumbnail(courseId);
      await loadCourseData();
      showNotification('Thumbnail deleted successfully', 'success');
    } catch (err) {
      showNotification(getErrorMessage(err, 'Failed to delete thumbnail'), 'error');
    } finally {
      _setUploadingFile(false);
    }
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await courseAPI.createSection(courseId, {
        title: sectionForm.title,
        description: sectionForm.description,
        section_order: sectionForm.order || undefined,
      });
      await refreshCourseContent();
      showNotification('Section created successfully', 'success');
      setShowSectionModal(false);
      setSectionForm({ title: '', description: '', order: 1 });
    } catch (err) {
      showNotification(getErrorMessage(err, 'Failed to create section'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSection = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const sectionId = editingSection?.section_id || editingSection?.id;
      await courseAPI.updateSection(courseId, sectionId, {
        title: sectionForm.title,
        description: sectionForm.description,
        section_order: sectionForm.order || undefined,
      });
      await refreshCourseContent();
      showNotification('Section updated successfully', 'success');
      setShowSectionModal(false);
      setEditingSection(null);
      setSectionForm({ title: '', description: '', order: 1 });
    } catch (err) {
      showNotification(getErrorMessage(err, 'Failed to update section'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSection = (sectionId, sectionTitle) => {
    setDeleteConfirmData({
      type: 'section',
      id: sectionId,
      name: sectionTitle
    });
    setShowDeleteConfirmModal(true);
  };

  const verifyQuizId = async (quizId) => {
    if (!quizId.trim()) {
      setQuizVerification({
        isLoading: false,
        isValid: false,
        quizData: null,
        error: 'Please enter a quiz ID'
      });
      return;
    }

    setQuizVerification({
      isLoading: true,
      isValid: false,
      quizData: null,
      error: null
    });

    try {
      const response = await quizAPI.getQuizDetails(quizId.trim());
      const quizData = response?.data?.data;
      if (!quizData) {
        throw new Error('Quiz not found');
      }
      setQuizVerification({
        isLoading: false,
        isValid: true,
        quizData,
        error: null
      });
      showNotification('Quiz verified successfully!', 'success');
    } catch (err) {
      setQuizVerification({
        isLoading: false,
        isValid: false,
        quizData: null,
        error: getErrorMessage(err, 'Quiz verification failed'),
      });
    }
  };

  const confirmDelete = async () => {
    try {
      setIsSubmitting(true);
      if (deleteConfirmData.type === 'section') {
        await courseAPI.deleteSection(courseId, deleteConfirmData.id);
      } else {
        await courseAPI.deleteLesson(courseId, deleteConfirmData.id);
      }
      await refreshCourseContent();
      showNotification(`${deleteConfirmData.type} deleted successfully`, 'success');
      setShowDeleteConfirmModal(false);
      setDeleteConfirmData({ type: null, id: null, name: '' });
    } catch (err) {
      showNotification(getErrorMessage(err, `Failed to delete ${deleteConfirmData.type}`), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if(showPDFViewerModal && selectedPDF) {
    return (
      <PDFViewer pdfUrl={selectedPDF.url} title={selectedPDF.title} onClose={() => setShowPDFViewerModal(false)} />
    );
  }

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    const sectionId = selectedSection?.section_id || selectedSection?.id;
    if (!sectionId && !editingLesson) {
      showNotification('Section not selected for lesson', 'error');
      return;
    }

    const payload = {
      title: lessonForm.title,
      description: lessonForm.description,
      lesson_type: lessonForm.lesson_type,
      duration_minutes: lessonForm.duration_minutes || undefined,
      lesson_order: lessonForm.order || undefined,
    };

    try {
      setIsSubmitting(true);
      let targetLessonId = null;
      let existingContents = [];

      if (editingLesson) {
        targetLessonId = editingLesson.lesson_id || editingLesson.id;
        existingContents = Array.isArray(editingLesson?.contents) ? editingLesson.contents : [];

        await courseAPI.updateLesson(
          courseId,
          targetLessonId,
          payload
        );

        await syncLessonTypeContent(targetLessonId, payload.lesson_type, existingContents);
        showNotification('Lesson updated successfully', 'success');
      } else {
        const lessonRes = await courseAPI.createLesson(courseId, sectionId, payload);
        const createdLesson = lessonRes?.data?.data || {};
        targetLessonId = createdLesson.lesson_id || createdLesson.id;

        if (targetLessonId) {
          await syncLessonTypeContent(targetLessonId, payload.lesson_type, []);
        }

        showNotification('Lesson created successfully', 'success');
      }

      await refreshCourseContent();
      setShowLessonModal(false);
      setEditingLesson(null);
      setSelectedSection(null);
      setLessonForm(getDefaultLessonForm());
    } catch (err) {
      showNotification(getErrorMessage(err, 'Failed to save lesson'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadLessonFile = async (lessonId, file, fileType) => {
    if (!file || !lessonId) return;

    const normalizedType = String(fileType).toLowerCase();
    if (!['video', 'pdf'].includes(normalizedType)) {
      showNotification(`${fileType} upload is not available yet`, 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = normalizedType === 'video'
        ? await courseAPI.uploadVideoContentFile(courseId, lessonId, file, { title: file.name })
        : await courseAPI.uploadPdfContentFile(courseId, lessonId, file, { title: file.name });

      const uploadedUrl = normalizedType === 'video'
        ? response?.data?.data?.video_url
        : response?.data?.data?.pdf_file_url;
      const targetField = normalizedType === 'video' ? 'video_file' : 'pdf_file';

      // Keep current UI responsive without requiring a full page reload.
      if (uploadedUrl) {
        setSections((prevSections) =>
          prevSections.map((section) => ({
            ...section,
            lessons: (section.lessons || []).map((lesson) => {
              const currentLessonId = lesson.lesson_id || lesson.id;
              if (currentLessonId !== lessonId) return lesson;
              return { ...lesson, [targetField]: uploadedUrl };
            }),
          }))
        );
      }

      showNotification(normalizedType === 'video' ? 'Video uploaded successfully' : 'PDF uploaded successfully', 'success');
    } catch (err) {
      showNotification(
        getErrorMessage(err, normalizedType === 'video' ? 'Failed to upload video' : 'Failed to upload PDF'),
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLesson = (lessonId, lessonTitle) => {
    setDeleteConfirmData({
      type: 'lesson',
      id: lessonId,
      name: lessonTitle
    });
    setShowDeleteConfirmModal(true);
  };

  const openEditSection = (section) => {
    setEditingSection(section);
    setSectionForm({
      title: section.title,
      description: section.description,
      order: section.section_order || section.order || 1
    });
    setShowSectionModal(true);
  };

  const openCreateLesson = (section) => {
    setSelectedSection(section);
    setEditingLesson(null);
    setQuizVerification({
      isLoading: false,
      isValid: false,
      quizData: null,
      error: null,
    });
    setLessonForm({
      ...getDefaultLessonForm(),
      order: (section.lessons?.length || 0) + 1,
    });
    setShowLessonModal(true);
  };

  const openEditLesson = async (section, lesson) => {
    setSelectedSection(section);
    let nextLesson = lesson;

    try {
      const lessonId = lesson?.lesson_id || lesson?.id;
      if (lessonId) {
        const detailsRes = await courseAPI.getCourseContentDetails(courseId, lessonId);
        const detailedLesson = detailsRes?.data?.data?.lesson;
        if (detailedLesson) {
          nextLesson = detailedLesson;
        }
      }
    } catch {
      // Keep fallback lesson object if detail fetch fails.
    }

    const nextContents = Array.isArray(nextLesson?.contents) ? nextLesson.contents : [];
    const videoContent = findContentByType(nextContents, 'video');
    const textContent = findContentByType(nextContents, 'text');
    const quizContent = findContentByType(nextContents, 'quiz');
    const zoomContent = findContentByType(nextContents, 'zoom_live');

    setEditingLesson(nextLesson);
    setLessonForm({
      ...getDefaultLessonForm(),
      title: nextLesson.title || '',
      description: nextLesson.description || '',
      lesson_type: (nextLesson.lesson_type || 'video').toLowerCase(),
      duration_minutes: nextLesson.duration_minutes || '',
      order: nextLesson.lesson_order || '',
      video_url: videoContent?.video_url || '',
      text_content: textContent?.text_content || '',
      quiz_id: quizContent?.quiz_id || '',
      zoom_meeting_link: zoomContent?.zoom_link || '',
      zoom_meeting_id: zoomContent?.zoom_meeting_id || '',
      zoom_passcode: zoomContent?.zoom_password || '',
    });

    if (String(nextLesson.lesson_type || '').toLowerCase() === 'quiz' && quizContent?.quiz_id) {
      setQuizVerification({
        isLoading: false,
        isValid: true,
        quizData: quizContent.quiz || null,
        error: null,
      });
    } else {
      setQuizVerification({
        isLoading: false,
        isValid: false,
        quizData: null,
        error: null,
      });
    }

    setShowLessonModal(true);
  };

  const handleLessonDragStart = (sectionId, lessonIndex) => {
    setDraggedLesson({ sectionId, lessonIndex });
  };

  const handleLessonDragOver = (sectionId, lessonIndex, event) => {
    event.preventDefault();
    setDragOverLesson({ sectionId, lessonIndex });
  };

  const handleLessonDrop = async (section, dropIndex, event) => {
    event.preventDefault();
    if (!draggedLesson) return;

    const sectionId = section.section_id || section.id;
    if (draggedLesson.sectionId !== sectionId || draggedLesson.lessonIndex === dropIndex) {
      setDraggedLesson(null);
      setDragOverLesson(null);
      return;
    }

    const lessons = [...(section.lessons || [])];
    const [movedLesson] = lessons.splice(draggedLesson.lessonIndex, 1);
    lessons.splice(dropIndex, 0, movedLesson);

    setSections((prevSections) =>
      prevSections.map((item) => {
        const currentSectionId = item.section_id || item.id;
        return currentSectionId === sectionId ? { ...item, lessons } : item;
      })
    );

    try {
      await courseAPI.reorderLessons(
        courseId,
        sectionId,
        lessons.map((lesson, idx) => ({
          lesson_id: lesson.lesson_id || lesson.id,
          lesson_order: idx + 1,
        }))
      );
      await refreshCourseContent();
      showNotification('Lesson order updated', 'success');
    } catch (err) {
      showNotification(getErrorMessage(err, 'Failed to reorder lessons'), 'error');
      await refreshCourseContent();
    } finally {
      setDraggedLesson(null);
      setDragOverLesson(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto animate-pulse" role="status" aria-live="polite">
        <span className="sr-only">Loading course details...</span>

        {/* Header Skeleton */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="h-5 w-12 bg-gray-200 rounded"></div>
            <div className="flex-1">
              <div className="h-8 w-1/3 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Tabs Skeleton */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 w-20 bg-gray-200 rounded"></div>
            ))}
          </nav>
        </div>

        {/* Course Info Card Skeleton */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Thumbnail Skeleton */}
            <div className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0"></div>
            
            {/* Info Skeleton */}
            <div className="flex-1">
              <div className="h-6 w-1/2 bg-gray-200 rounded mb-3"></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
              </div>
              
              {/* Grid Info Skeleton */}
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4">
              <div className="h-4 w-20 bg-gray-200 rounded mb-3"></div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        {/* Content Section Skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Section Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                    <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
              
              {/* Lessons Skeleton */}
              <div className="p-4 space-y-3">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-4 w-6 bg-gray-200 rounded"></div>
                        <div className="flex-1">
                          <div className="h-5 w-1/3 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-24 bg-gray-200 rounded"></div>
                        <div className="h-8 w-20 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/teacher/courses')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{course?.title}</h1>
            <p className="text-gray-600 mt-1">Manage your course content and settings</p>
          </div>
        </div>
        <div className="flex gap-2">
          {mode === 'view' && (
            <button
              onClick={() => navigate(`/teacher/courses/${courseId}?mode=edit`)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center gap-2"
            >
              <FaEdit /> Edit Course
            </button>
          )}
          {mode === 'edit' && (
            <button
              onClick={() => setShowEditModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Edit Details
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'content', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Course Info Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start gap-6">
              <div className="w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                {courseThumbnailUrl ? (
                  <img 
                    src={courseThumbnailUrl}
                    alt={course.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <div className={`w-full h-full ${courseThumbnailUrl ? 'hidden' : 'flex'} items-center justify-center text-gray-400`}>
                  No thumbnail
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">{course?.title}</h2>
                <p className="text-gray-600 mb-4">{course?.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Subject:</span>
                    <span className="ml-2 font-medium">{course?.subject}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Grade Level:</span>
                    <span className="ml-2 font-medium">{course?.grade_level}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <span className="ml-2 font-medium">Rs. {course?.price}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Course Type:</span>
                    <span className="ml-2 font-medium">{course?.course_type}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      course?.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                      course?.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course?.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Enrollments:</span>
                    <span className="ml-2 font-medium">{course?.total_enrollments || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8">
            <StatCard stats={courseStats} metricsConfig={courseStatsConfig} />
          </div>

          {/* Enrolled Students Section */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Enrolled Students</h2>
            <DataTable
              data={enrolledStudents}
              columns={studentColumns}
              config={{
                itemsPerPage: 10,
                searchPlaceholder: 'Search by student name...',
                hideSearch: false,
              }}
              loading={loadingStudents}
            />
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Course Content</h2>
            <button
              onClick={() => {
                setSectionForm({ title: '', description: '', order: sections.length + 1 });
                setEditingSection(null);
                setShowSectionModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Add Section
            </button>
          </div>

          {/* Sections List */}
          <div className="space-y-4">
            {sections.map((section, idx) => {
              const sectionId = section.section_id || section.id;
              return (
              <div key={sectionId} className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-medium">Section {idx + 1}</span>
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openCreateLesson(section)}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      + Add Lesson
                    </button>
                    <button
                      onClick={() => openEditSection(section)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSection(sectionId, section.title)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {/* Lessons */}
                <div className="p-4">
                  {section.lessons && section.lessons.length > 0 ? (
                    <div className="space-y-4">
                      {section.lessons.map((lesson, lessonIdx) => {
                        const lessonId = lesson.lesson_id || lesson.id;
                        const isDragged =
                          draggedLesson?.sectionId === sectionId &&
                          draggedLesson?.lessonIndex === lessonIdx;
                        const isDragOver =
                          dragOverLesson?.sectionId === sectionId &&
                          dragOverLesson?.lessonIndex === lessonIdx;
                        return (
                        <div
                          key={lessonId}
                          className={`bg-gray-50 rounded-lg border overflow-hidden transition-all ${
                            isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
                          } ${isDragged ? 'opacity-60' : ''}`}
                          draggable
                          onDragStart={() => handleLessonDragStart(sectionId, lessonIdx)}
                          onDragOver={(event) => handleLessonDragOver(sectionId, lessonIdx, event)}
                          onDrop={(event) => handleLessonDrop(section, lessonIdx, event)}
                        >
                          <div className="flex items-center justify-between p-4 bg-gray-100">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <span className="text-gray-400" title="Drag to reorder">
                                <FaGripVertical />
                              </span>
                              <span className="text-gray-500 font-medium">{lessonIdx + 1}.</span>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 truncate">{lesson.title}</div>
                                <div className="text-xs text-gray-600">
                                  {formatLessonType(lesson.lesson_type)} • {lesson.duration_minutes || 0} mins
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                              {String(lesson.lesson_type).toLowerCase() === 'text' && lesson.text_content && (
                                <button className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                                  View
                                </button>
                              )}
                              {String(lesson.lesson_type).toLowerCase() === 'video' && !lesson.video_file && (
                                <label className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer whitespace-nowrap">
                                  Upload Video
                                  <input
                                    type="file"
                                    accept="video/*"
                                    className="hidden"
                                    onChange={(e) => handleUploadLessonFile(lessonId, e.target.files[0], 'VIDEO')}
                                  />
                                </label>
                              )}
                              {String(lesson.lesson_type).toLowerCase() === 'pdf' && !lesson.pdf_file && (
                                <label className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer whitespace-nowrap">
                                  Upload PDF
                                  <input
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={(e) => handleUploadLessonFile(lessonId, e.target.files[0], 'PDF')}
                                  />
                                </label>
                              )}
                              <button
                                onClick={() => openEditLesson(section, lesson)}
                                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteLesson(lessonId, lesson.title)}
                                className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 whitespace-nowrap"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          
                          {/* File Preview Section */}
                          {lesson.video_file && (
                            <div className="p-4 bg-white border-t border-gray-200">
                              <div className="text-xs font-semibold text-gray-700 mb-2">Video File Uploaded</div>
                              <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mb-3">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{lesson.video_file.split('/').pop()}</p>
                                </div>
                                <button
                                  onClick={() => {
                                    setSelectedVideo({
                                      id: lessonId,
                                      title: lesson.title,
                                      url: lesson.video_file.startsWith('http') ? lesson.video_file : `http://localhost:8000${lesson.video_file}`
                                    });
                                    setShowVideoPlayerModal(true);
                                  }}
                                  className="ml-2 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap"
                                >
                                  Play Video
                                </button>
                              </div>
                              <label className="text-xs text-gray-600 cursor-pointer inline-block px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 whitespace-nowrap">
                                Replace Video
                                <input
                                  type="file"
                                  accept="video/*"
                                  className="hidden"
                                  onChange={(e) => handleUploadLessonFile(lessonId, e.target.files[0], 'VIDEO')}
                                />
                              </label>
                            </div>
                          )}
                          
                          {lesson.pdf_file && (
                            <div className="p-4 bg-white border-t border-gray-200">
                              <div className="text-xs font-semibold text-gray-700 mb-2">PDF File Uploaded</div>
                              <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mb-3">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{lesson.pdf_file.split('/').pop()}</p>
                                </div>
                                <button onClick={() => {
                                  setSelectedPDF({
                                    id: lessonId,
                                    title: lesson.title,
                                    url: lesson.pdf_file.startsWith('http') ? lesson.pdf_file : `http://localhost:8000${lesson.pdf_file}`
                                  });
                                  setShowPDFViewerModal(true);
                                }}
                                  className="ml-2 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap"
                                >
                                  View PDF
                                </button>
                                <a
                                  href={lesson.pdf_file.startsWith('http') ? lesson.pdf_file : `http://localhost:8000${lesson.pdf_file}`}
                                  download
                                  className="ml-2 px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 whitespace-nowrap"
                                >
                                  Download PDF
                                </a>
                              </div>
                              <label className="text-xs text-gray-600 cursor-pointer inline-block px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 whitespace-nowrap">
                                Replace PDF
                                <input
                                  type="file"
                                  accept="application/pdf"
                                  className="hidden"
                                  onChange={(e) => handleUploadLessonFile(lessonId, e.target.files[0], 'PDF')}
                                />
                              </label>
                            </div>
                          )}
                          
                          {String(lesson.lesson_type).toLowerCase() === 'text' && lesson.text_content && (
                            <div className="p-4 bg-white border-t border-gray-200">
                              <div className="text-xs font-semibold text-gray-700 mb-2">Text Content</div>
                              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-32 overflow-y-auto text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {lesson.text_content}
                              </div>
                            </div>
                          )}
                        </div>
                      )})}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No lessons yet. Add your first lesson!</p>
                  )}
                </div>
              </div>
            )})}

            {sections.length === 0 && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">No sections yet. Create your first section to start adding content.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Course Settings</h2>
          
          <div className="space-y-6">
            {/* Thumbnail Section */}
            <div className="border-b pb-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Course Thumbnail
              </label>
              
              {/* Current Thumbnail */}
              {courseThumbnailUrl && (
                <div className="mb-4 bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-xs font-semibold text-gray-700 mb-3">Current Thumbnail</p>
                  <div className="flex gap-4">
                    <div className="w-48 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-300 flex-shrink-0">
                      <img 
                        src={courseThumbnailUrl}
                        alt="Current thumbnail" 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Thumbnail Details</p>
                        <p className="text-xs text-gray-600 mb-2">
                          Filename: <span className="font-mono text-gray-800">{courseThumbnailUrl.split('/').pop()}</span>
                        </p>
                        <p className="text-xs text-gray-600">
                          Uploaded: <span className="font-medium text-gray-800">{new Date(course?.updated_at).toLocaleDateString()}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteThumbnail()}
                        className="w-full px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Delete Current Thumbnail
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Upload New Thumbnail */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-xs font-semibold text-gray-700 mb-3">Upload New Thumbnail</p>
                <div>
                  <label className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {uploadingFile ? `Uploading... ${uploadProgress}%` : 'Choose Thumbnail Image'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadThumbnail}
                      disabled={uploadingFile}
                    />
                  </label>
                  {uploadingFile && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-blue-600 min-w-fit">{uploadProgress}%</span>
                      </div>
                      <p className="text-xs text-gray-600">Uploading thumbnail...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Course Info */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Course Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Created:</span>
                  <span className="ml-2 font-medium">{new Date(course?.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Last Updated:</span>
                  <span className="ml-2 font-medium">{new Date(course?.updated_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Language:</span>
                  <span className="ml-2 font-medium">{course?.language}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Access Type:</span>
                  <span className="ml-2 font-medium">{course?.access_type}</span>
                </div>
              </div>
            </div>

            {/* Certificate Settings */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Certificate Settings</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 block mb-1">Auto-Generate Certificates</label>
                    <p className="text-xs text-gray-600">When enabled, students will receive a certificate upon course completion</p>
                  </div>
                  <label className="flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={courseForm.generate_certificates || false}
                      onChange={(e) => {
                        setCourseForm({ ...courseForm, generate_certificates: e.target.checked });
                      }}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className={`ml-2 text-sm font-medium ${courseForm.generate_certificates ? 'text-green-600' : 'text-gray-600'}`}>
                      {courseForm.generate_certificates ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Edit Course</h2>
              <form onSubmit={handleUpdateCourse} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select
                      value={courseForm.subject}
                      onChange={(e) => setCourseForm({ ...courseForm, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Subject</option>
                      {Array.isArray(subjects) && subjects.map((sub) => (
                        <option key={sub.value || sub.id} value={sub.value || sub.id}>
                          {sub.label || sub.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                    <select
                      value={courseForm.grade_level}
                      onChange={(e) => setCourseForm({ ...courseForm, grade_level: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Grade</option>
                      {Array.isArray(gradeLevels) && gradeLevels.map((grade) => (
                        <option key={grade.value || grade.id} value={grade.value || grade.id}>{grade.label || grade.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.)</label>
                    <input
                      type="number"
                      value={courseForm.price}
                      onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={courseForm.status}
                      onChange={(e) => setCourseForm({ ...courseForm, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                    <select
                      value={courseForm.visibility}
                      onChange={(e) => setCourseForm({ ...courseForm, visibility: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PUBLIC">Public</option>
                      <option value="PRIVATE">Private</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded-lg ${
                      isSubmitting ? 'text-gray-500 bg-gray-100 cursor-not-allowed' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
                      isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <BiLoader className="inline-block animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Section Modal */}
      {showSectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingSection ? 'Edit Section' : 'Create Section'}
              </h2>
              <form onSubmit={editingSection ? handleUpdateSection : handleCreateSection} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={sectionForm.title}
                    onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={sectionForm.description}
                    onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input
                    type="number"
                    value={sectionForm.order}
                    onChange={(e) => setSectionForm({ ...sectionForm, order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSectionModal(false);
                      setEditingSection(null);
                      setSectionForm({ title: '', description: '', order: 1 });
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
                      isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <BiLoader className="inline-block animate-spin" />
                        <span>{editingSection ? 'Updating...' : 'Creating...'}</span>
                      </>
                    ) : (
                      editingSection ? 'Update' : 'Create'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete {deleteConfirmData.type === 'section' ? 'Section' : 'Lesson'}?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>"{deleteConfirmData.name}"</strong>? This action cannot be undone.
              {deleteConfirmData.type === 'section' && ' All lessons in this section will also be deleted.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  setDeleteConfirmData({ type: null, id: null, name: '' });
                }}
                disabled={isSubmitting}
                className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                  isSubmitting ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isSubmitting}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-white flex items-center justify-center gap-2 ${
                  isSubmitting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <BiLoader className="inline-block animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{editingLesson ? 'Edit Lesson' : 'Create Lesson'}</h2>
              <form onSubmit={handleCreateLesson} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={lessonForm.description}
                    onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
                  <select
                    value={lessonForm.lesson_type}
                    onChange={(e) => setLessonForm({ ...lessonForm, lesson_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {lessonTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Video Upload - shown when VIDEO is selected */}
                {lessonForm.lesson_type === 'video' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (Optional)</label>
                    <input
                      type="url"
                      value={lessonForm.video_url}
                      onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Or upload video file after creating lesson"
                    />
                    <p className="text-xs text-gray-500 mt-1">You can upload a video file after creating the lesson</p>
                  </div>
                )}

                {/* PDF - shown when PDF is selected */}
                {lessonForm.lesson_type === 'pdf' && (
                  <div>
                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      After creating this lesson, you can upload the PDF file from the content view.
                    </p>
                  </div>
                )}

                {/* Text Content - shown when TEXT is selected */}
                {lessonForm.lesson_type === 'text' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Text Content</label>
                    <textarea
                      value={lessonForm.text_content}
                      onChange={(e) => setLessonForm({ ...lessonForm, text_content: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base leading-relaxed"
                      rows="8"
                      placeholder="Enter the lesson content..."
                      style={{ lineHeight: '1.8', fontSize: '1rem' }}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Use line breaks and formatting to improve readability</p>
                  </div>
                )}

                {/* Zoom Class - shown when ZOOM_CLASS is selected */}
                {lessonForm.lesson_type === 'zoom' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
                        <input
                          type="date"
                          value={lessonForm.scheduled_date}
                          onChange={(e) => setLessonForm({ ...lessonForm, scheduled_date: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Time</label>
                        <input
                          type="time"
                          value={lessonForm.scheduled_time}
                          onChange={(e) => setLessonForm({ ...lessonForm, scheduled_time: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Zoom Meeting Link</label>
                      <input
                        type="url"
                        value={lessonForm.zoom_meeting_link}
                        onChange={(e) => setLessonForm({ ...lessonForm, zoom_meeting_link: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://zoom.us/j/..."
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meeting ID</label>
                        <input
                          type="text"
                          value={lessonForm.zoom_meeting_id}
                          onChange={(e) => setLessonForm({ ...lessonForm, zoom_meeting_id: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="123 456 7890"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Passcode</label>
                        <input
                          type="text"
                          value={lessonForm.zoom_passcode}
                          onChange={(e) => setLessonForm({ ...lessonForm, zoom_passcode: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Quiz - shown when QUIZ is selected */}
                {lessonForm.lesson_type === 'quiz' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Code/ID</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={lessonForm.quiz_id}
                        onChange={(e) => {
                          setLessonForm({ ...lessonForm, quiz_id: e.target.value });
                          setQuizVerification({
                            isLoading: false,
                            isValid: false,
                            quizData: null,
                            error: null
                          });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter quiz code or ID"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => verifyQuizId(lessonForm.quiz_id)}
                        disabled={quizVerification.isLoading || !lessonForm.quiz_id.trim()}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg whitespace-nowrap transition-colors"
                      >
                        {quizVerification.isLoading ? 'Verifying...' : 'Verify'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowQuizSearchModal(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 whitespace-nowrap"
                      >
                        Search Quiz
                      </button>
                    </div>
                    
                    {/* Verification Status */}
                    {quizVerification.isValid && quizVerification.quizData && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <FaCheck className="text-green-600 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-medium text-green-800">Quiz Verified</p>
                            <div className="mt-2 space-y-1 text-sm text-green-700">
                              <p><strong>Title:</strong> {quizVerification.quizData.title}</p>
                              <p><strong>Type:</strong> {quizVerification.quizData.quiz_type}</p>
                              <p><strong>Questions:</strong> {quizVerification.quizData.total_questions}</p>
                              <p><strong>Duration:</strong> {quizVerification.quizData.time_limit_minutes} minutes</p>
                              <p><strong>Total Marks:</strong> {quizVerification.quizData.total_marks}</p>
                              <p><strong>Teacher:</strong> {
                                quizVerification.quizData.teacher?.name
                                || quizVerification.quizData.teacher_name
                                || quizVerification.quizData.instructor_name
                                || [
                                  quizVerification.quizData.teacher?.first_name,
                                  quizVerification.quizData.teacher?.last_name,
                                ].filter(Boolean).join(' ')
                                || 'N/A'
                              }</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {quizVerification.error && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <FaTimes className="text-red-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-red-800">Verification Failed</p>
                            <p className="text-sm text-red-700 mt-1">{quizVerification.error}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-2">Enter the ID of a published quiz to link to this lesson, then verify before saving</p>
                  </div>
                )}

                {/* Duration - shown for all types except QUIZ */}
                {lessonForm.lesson_type !== 'quiz' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      value={lessonForm.duration_minutes}
                      onChange={(e) => setLessonForm({ ...lessonForm, duration_minutes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                      placeholder="Estimated duration"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input
                    type="number"
                    value={lessonForm.order}
                    onChange={(e) => setLessonForm({ ...lessonForm, order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLessonModal(false);
                      setSelectedSection(null);
                      setEditingLesson(null);
                      setQuizVerification({
                        isLoading: false,
                        isValid: false,
                        quizData: null,
                        error: null
                      });
                      setLessonForm(getDefaultLessonForm());
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || (lessonForm.lesson_type === 'quiz' && !quizVerification.isValid)}
                    className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
                      isSubmitting || (lessonForm.lesson_type === 'quiz' && !quizVerification.isValid)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <BiLoader className="inline-block animate-spin" />
                        <span>{editingLesson ? 'Updating...' : 'Creating...'}</span>
                      </>
                    ) : (
                      editingLesson ? 'Update Lesson' : 'Create Lesson'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Search Modal */}
      <QuizSearchModal
        isOpen={showQuizSearchModal}
        onClose={() => setShowQuizSearchModal(false)}
        onSelect={(quiz) => {
          const selectedQuizId = quiz?.quiz_id || quiz?.id || '';
          setLessonForm({ ...lessonForm, quiz_id: selectedQuizId });
          setShowQuizSearchModal(false);
          // Auto-verify the selected quiz
          setTimeout(() => {
            verifyQuizId(selectedQuizId);
          }, 100);
        }}
        onNotification={showNotification}
      />

      {/* Student Profile Modal */}
      {showStudentProfileModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Student Profile</h2>
              <button
                onClick={() => setShowStudentProfileModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  {selectedStudent.image &&
                    <img src={getAbsoluteImageUrl(selectedStudent.image)} alt='student_image' className='rounded-full w-24 h-24 object-cover'/>
                  }
                  {!selectedStudent.image &&
                    <FaUser className="text-blue-600 text-sm" />
                  }
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedStudent.user?.name || selectedStudent.name || 'N/A'}</h3>
                  <p className="text-gray-600">{selectedStudent.user?.email || selectedStudent.email || 'N/A'}</p>
                  <div className="mt-3 flex gap-4">
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Status</span>
                      <p className="font-semibold text-gray-900 mt-1">Active</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enrollment Details */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Enrolled Date</span>
                    <p className="font-semibold text-gray-900 mt-1">
                      {selectedStudent.enrolled_at ? new Date(selectedStudent.enrolled_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Enrollment ID</span>
                    <p className="font-semibold text-gray-900 mt-1">{selectedStudent.enrollment_id || selectedStudent.id || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Payment Method</span>
                    <div className="mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
                        selectedStudent.payment_method === 'CARD' ? 'bg-blue-100 text-blue-700' :
                        selectedStudent.payment_method === 'BANK_TRANSFER' ? 'bg-green-100 text-green-700' :
                        selectedStudent.payment_method === 'CASH' ? 'bg-yellow-100 text-yellow-700' :
                        selectedStudent.payment_method === 'FREE' ? 'bg-gray-100 text-gray-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedStudent.payment_method || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Payment Status</span>
                    <div className="mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1 ${
                        selectedStudent.payment_status === 'COMPLETED' || selectedStudent.payment_status === 'PAID' ? 'bg-green-100 text-green-700' :
                        selectedStudent.payment_status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        selectedStudent.payment_status === 'FAILED' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedStudent.payment_status === 'COMPLETED' || selectedStudent.payment_status === 'PAID' ? <FaCheck className="text-xs" /> : null}
                        {selectedStudent.payment_status || 'FREE'}
                      </span>
                    </div>
                  </div>
                  {selectedStudent.amount_paid && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Amount Paid</span>
                      <p className="font-semibold text-gray-900 mt-1">Rs. {selectedStudent.amount_paid}</p>
                    </div>
                  )}
                  {selectedStudent.transaction_id && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Transaction ID</span>
                      <p className="font-semibold text-gray-900 mt-1 text-sm break-all">{selectedStudent.transaction_id}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Type</label>
                    <select
                      value={courseForm.course_type}
                      onChange={(e) => setCourseForm({ ...courseForm, course_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {Array.isArray(courseTypes) && courseTypes.map((type) => (
                        <option key={type.value || type.id} value={type.value || type.id}>
                          {type.label || type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Email</span>
                    <p className="font-semibold text-gray-900 mt-1">{selectedStudent.user?.email || selectedStudent.email || 'N/A'}</p>
                  </div>
                  {selectedStudent.user?.phone && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Phone</span>
                      <p className="font-semibold text-gray-900 mt-1">{selectedStudent.user.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <div className="border-t pt-6 flex justify-end">
                <button
                  onClick={() => setShowStudentProfileModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {showVideoPlayerModal && selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-black rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gray-900 px-6 py-4 flex justify-between items-center border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">{selectedVideo.title}</h2>
              <button
                onClick={() => {
                  setShowVideoPlayerModal(false);
                  setSelectedVideo(null);
                }}
                className="text-gray-300 hover:text-white text-2xl transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Video Container */}
            <div className="flex-1 flex items-center justify-center bg-black overflow-hidden">
              <video
                key={selectedVideo.id}
                controls
                controlsList="nodownload"
                className="w-full h-full max-w-full max-h-full object-contain"
                onContextMenu={(e) => e.preventDefault()}
                crossOrigin="anonymous"
                preload="metadata"
              >
                <source src={selectedVideo.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
