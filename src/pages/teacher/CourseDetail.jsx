 
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { BiLoader } from 'react-icons/bi';
import { FaEdit, FaStar, FaCheck, FaTimes, FaUser, FaEye, FaBook, FaGamepad, FaStar as FaRating, FaUsers, FaGripVertical } from 'react-icons/fa';
import QuizSearchModal from '../../components/teacher/QuizSearchModal';
import { getAbsoluteImageUrl } from '../../utils/helpers';
import VideoPlayer from '../../components/VideoPlayer';
import PDFViewer from '../../components/PDFViewer';
import TextViewer from '../../components/TextViewer';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import Notification from '../../components/common/Notification';
import EnrollmentKeyManager from '../../components/teacher/EnrollmentKeyManager';
import { courseAPI } from '../../api/course';
import { reviewAPI } from '../../api/review';
import { quizAPI } from '../../api/quiz';
import {
  COURSE_SUBJECT_OPTIONS,
  COURSE_GRADE_LEVEL_OPTIONS,
  COURSE_TYPE_OPTIONS,
  COURSE_LANGUAGE_OPTIONS,
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

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'content', label: 'Content' },
    { key: 'reviews', label: 'Reviews' },
    { key: 'enrollment-keys', label: 'Enrollment Keys' },
    { key: 'settings', label: 'Settings' },
  ];
  const [course, setCourse] = useState(null);
  const [notification, setNotification] = useState(null);
  const [sections, setSections] = useState([]);
  
  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };
  const subjects = COURSE_SUBJECT_OPTIONS;
  const gradeLevels = COURSE_GRADE_LEVEL_OPTIONS;
  
  const subjectLabelMap = useMemo(() => {
    return COURSE_SUBJECT_OPTIONS.reduce((acc, option) => {
      acc[option.value] = option.label;
      return acc;
    }, {});
  }, []);

  const courseTypeLabelMap = useMemo(() => {
    return COURSE_TYPE_OPTIONS.reduce((acc, option) => {
      acc[option.value] = option.label;
      return acc;
    }, {});
  }, []);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewRatingFilter, setReviewRatingFilter] = useState('ALL');
  const [reviewStatusFilter, setReviewStatusFilter] = useState('ALL');
  const [reviewSort, setReviewSort] = useState('newest');
  const [showStudentProfileModal, setShowStudentProfileModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);
  const [loadingStudentDetails, setLoadingStudentDetails] = useState(false);
  const [studentDetailsError, setStudentDetailsError] = useState(null);
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
    price_type: 'FREE',
    price: '',
    status: 'DRAFT',
    visibility: 'PUBLIC',
    language: 'en',
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
  const [uploadProgressLessonId, setUploadProgressLessonId] = useState(null);
  const [uploadProgressPercent, setUploadProgressPercent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizVerification, setQuizVerification] = useState({
    isLoading: false,
    isValid: false,
    quizData: null,
    error: null
  });
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [showPDFViewerModal, setShowPDFViewerModal] = useState(false);
  const [selectedTextLesson, setSelectedTextLesson] = useState(null);
  const [showTextViewerModal, setShowTextViewerModal] = useState(false);
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
      formatter: (value) => `${value} `,
    },
  ];

  const getStudentDisplayName = (row) =>
    row?.name ||
    [row?.first_name || row?.user?.first_name, row?.last_name || row?.user?.last_name]
      .filter(Boolean)
      .join(' ') ||
    row?.username ||
    row?.user?.username ||
    row?.email ||
    row?.user?.email ||
    'N/A';

  const getStudentProfileImage = (row) =>
    getAbsoluteImageUrl(
      row?.profile_picture ||
        row?.profile_picture_url ||
        row?.image ||
        row?.user?.profile_picture ||
        row?.user?.profile_picture_url ||
        ''
    );

  const getPaymentMethodLabel = (row) => {
    const rawMethod = String(row?.payment_method || row?.enrollment_method || '').toLowerCase();
    if (rawMethod.includes('enrollment key') || rawMethod === 'enrollment_key') return 'Enrollment Key';
    if (rawMethod === 'card') return 'Card';
    if (rawMethod === 'bank_transfer') return 'Bank Transfer';
    if (rawMethod === 'cash') return 'Cash';
    if (rawMethod === 'payment') return 'Payment';
    return row?.key_id ? 'Enrollment Key' : 'N/A';
  };

  // DataTable columns for enrolled students
  const studentColumns = [
    {
      key: 'name',
      label: 'Student Name',
      searchable: true,
      render: (_, row) => {
        const profileImage = getStudentProfileImage(row);
        return (
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
            {profileImage ? (
              <img src={profileImage} alt={getStudentDisplayName(row)} className="w-full h-full object-cover" />
            ) : (
              <FaUser className="text-blue-600" />
            )}
          </div>
          <div className="ml-3">
            <div className="font-medium text-gray-900">{getStudentDisplayName(row)}</div>
            <div className="text-sm text-gray-500">{row?.email || row?.user?.email || 'N/A'}</div>
          </div>
        </div>
      )},
    },
    {
      key: 'payment_method',
      label: 'Payment Method',
      render: (_, row) => {
        const method = getPaymentMethodLabel(row);
        return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          method === 'Enrollment Key' ? 'bg-indigo-100 text-indigo-700' :
          method === 'Card' ? 'bg-blue-100 text-blue-700' :
          method === 'Bank Transfer' ? 'bg-green-100 text-green-700' :
          method === 'Cash' ? 'bg-yellow-100 text-yellow-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {method}
        </span>
      )},
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
            setSelectedStudentDetails(null);
            setStudentDetailsError(null);
            setShowStudentProfileModal(true);
          }}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          <FaEye /> View
        </button>
      ),
    },
  ];

  const getStudentId = (student) =>
    student?.user_id || student?.user?.user_id || student?.id || student?.user?.id || student?.student_id || null;

  const formatDateValue = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
  };

  const formatDateOnlyValue = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
  };

  const formatValue = (value, fallback = 'N/A') => {
    if (value === null || value === undefined || value === '') return fallback;
    return String(value);
  };

  const formatBooleanValue = (value) => (value ? 'Yes' : 'No');

  const getReviewRating = (review) => {
    const rawRating = review?.rating ?? review?.star_rating ?? review?.stars;
    const numericRating = Number(rawRating);
    return Number.isFinite(numericRating) ? numericRating : 0;
  };

  const getReviewStatus = (review) =>
    String(review?.status || review?.review_status || 'PUBLISHED').toUpperCase();

  const getReviewDateValue = (review) => {
    const rawDate = review?.created_at || review?.createdAt || review?.updated_at || review?.updatedAt;
    const date = rawDate ? new Date(rawDate) : null;
    return date && !Number.isNaN(date.getTime()) ? date.getTime() : 0;
  };

  const filteredReviews = useMemo(() => {
    const searchValue = String(reviewSearch || '').trim().toLowerCase();

    const filtered = (reviews || []).filter((review) => {
      const reviewerName = String(
        review?.student_name ||
          review?.user_name ||
          review?.reviewer_name ||
          review?.student?.name ||
          review?.user?.name ||
          ''
      ).toLowerCase();
      const reviewerEmail = String(review?.student_email || review?.user_email || review?.user?.email || '').toLowerCase();
      const reviewText = String(review?.comment || review?.review || review?.review_text || review?.message || '').toLowerCase();
      const reviewTitle = String(review?.title || '').toLowerCase();
      const reviewRating = getReviewRating(review);
      const reviewStatus = getReviewStatus(review);

      const matchesSearch =
        !searchValue ||
        reviewerName.includes(searchValue) ||
        reviewerEmail.includes(searchValue) ||
        reviewText.includes(searchValue) ||
        reviewTitle.includes(searchValue);
      const matchesRating = reviewRatingFilter === 'ALL' || reviewRating >= Number(reviewRatingFilter);
      const matchesStatus = reviewStatusFilter === 'ALL' || reviewStatus === reviewStatusFilter;

      return matchesSearch && matchesRating && matchesStatus;
    });

    return filtered.sort((a, b) => {
      if (reviewSort === 'highest') return getReviewRating(b) - getReviewRating(a);
      if (reviewSort === 'lowest') return getReviewRating(a) - getReviewRating(b);
      if (reviewSort === 'oldest') return getReviewDateValue(a) - getReviewDateValue(b);
      return getReviewDateValue(b) - getReviewDateValue(a);
    });
  }, [reviews, reviewSearch, reviewRatingFilter, reviewStatusFilter, reviewSort]);

  const selectedStudentProfile = {
    userId: selectedStudentDetails?.user_id || selectedStudentDetails?.id || getStudentId(selectedStudent),
    username:
      selectedStudentDetails?.username ||
      selectedStudent?.username ||
      selectedStudent?.user?.username,
    firstName:
      selectedStudentDetails?.first_name ||
      selectedStudent?.user?.first_name ||
      selectedStudent?.first_name ||
      '',
    lastName:
      selectedStudentDetails?.last_name ||
      selectedStudent?.user?.last_name ||
      selectedStudent?.last_name ||
      '',
    fullName:
      selectedStudentDetails?.full_name ||
      [
        selectedStudentDetails?.first_name || selectedStudent?.user?.first_name || selectedStudent?.first_name,
        selectedStudentDetails?.last_name || selectedStudent?.user?.last_name || selectedStudent?.last_name,
      ]
        .filter(Boolean)
        .join(' ') ||
      selectedStudent?.name ||
      'N/A',
    email:
      selectedStudentDetails?.email ||
      selectedStudent?.user?.email ||
      selectedStudent?.email ||
      'N/A',
    phone:
      selectedStudentDetails?.phone ||
      selectedStudent?.user?.phone ||
      selectedStudent?.phone ||
      'N/A',
    dateOfBirth:
      selectedStudentDetails?.date_of_birth ||
      selectedStudentDetails?.dateOfBirth ||
      selectedStudent?.date_of_birth ||
      selectedStudent?.dateOfBirth ||
      'N/A',
    gradeLevel:
      selectedStudentDetails?.grade_level ||
      selectedStudentDetails?.grade ||
      selectedStudent?.grade_level ||
      selectedStudent?.grade ||
      'N/A',
    school:
      selectedStudentDetails?.school ||
      selectedStudent?.school ||
      'N/A',
    address:
      selectedStudentDetails?.address ||
      selectedStudent?.address ||
      'N/A',
    parentName:
      selectedStudentDetails?.parent_name ||
      selectedStudent?.parent_name ||
      'N/A',
    parentContact:
      selectedStudentDetails?.parent_contact ||
      selectedStudent?.parent_contact ||
      'N/A',
    profilePicture:
      selectedStudentDetails?.profile_picture_url ||
      selectedStudentDetails?.profile_picture ||
      selectedStudent?.image ||
      selectedStudent?.profile_picture ||
      selectedStudent?.user?.profile_picture_url ||
      selectedStudent?.user?.profile_picture ||
      null,
    role:
      Array.isArray(selectedStudentDetails?.roles) && selectedStudentDetails.roles.length
        ? selectedStudentDetails.roles.join(', ')
        : selectedStudentDetails?.role ||
          selectedStudent?.role ||
          'student',
    emailVerified:
      selectedStudentDetails?.email_verified ??
      selectedStudent?.email_verified ??
      selectedStudent?.user?.email_verified,
    phoneVerified:
      selectedStudentDetails?.phone_verified ??
      selectedStudent?.phone_verified ??
      selectedStudent?.user?.phone_verified,
    createdAt:
      selectedStudentDetails?.created_at ||
      selectedStudent?.created_at ||
      selectedStudent?.user?.created_at ||
      null,
    updatedAt:
      selectedStudentDetails?.updated_at ||
      selectedStudent?.updated_at ||
      selectedStudent?.user?.updated_at ||
      null,
    accountStatus:
      selectedStudentDetails?.account_status ||
      selectedStudent?.account_status ||
      {},
    progress: selectedStudent?.progress ?? selectedStudentDetails?.progress ?? 0,
    enrollmentId:
      selectedStudent?.enrollment_id ||
      selectedStudentDetails?.enrollment_id ||
      selectedStudent?.id ||
      'N/A',
    enrollmentMethod:
      selectedStudent?.enrollment_method ||
      selectedStudentDetails?.enrollment_method ||
      'N/A',
    enrollmentStatus:
      selectedStudent?.status ||
      selectedStudentDetails?.status ||
      'N/A',
    enrolledAt:
      selectedStudent?.enrolled_at ||
      selectedStudent?.enrolled_date ||
      selectedStudentDetails?.enrolled_at ||
      selectedStudentDetails?.enrolled_date ||
      null,
    completedAt:
      selectedStudent?.completed_at ||
      selectedStudentDetails?.completed_at ||
      null,
    lastAccessed:
      selectedStudent?.last_accessed ||
      selectedStudentDetails?.last_accessed ||
      null,
    paymentMethod:
      selectedStudent?.payment_method ||
      selectedStudentDetails?.payment_method ||
      'N/A',
    paymentStatus:
      selectedStudent?.payment_status ||
      selectedStudentDetails?.payment_status ||
      'N/A',
    amountPaid:
      selectedStudent?.amount_paid ||
      selectedStudentDetails?.amount_paid ||
      null,
    transactionId:
      selectedStudent?.transaction_id ||
      selectedStudentDetails?.transaction_id ||
      'N/A',
    totalTimeSpentMinutes:
      selectedStudent?.total_time_spent_minutes ||
      selectedStudentDetails?.total_time_spent_minutes ||
      0,
    courseTitle: course?.title || 'Current course',
  };

  useEffect(() => {
    const studentId = getStudentId(selectedStudent);
    if (!showStudentProfileModal || !studentId) return;

    let isActive = true;

    const loadStudentDetails = async () => {
      try {
        setLoadingStudentDetails(true);
        setStudentDetailsError(null);
        const response = await courseAPI.getStudentDetails(courseId, studentId);
        const profileData = response?.data?.data || response?.data || null;
        if (isActive) {
          setSelectedStudentDetails(profileData);
        }
      } catch (err) {
        if (isActive) {
          setSelectedStudentDetails(null);
          setStudentDetailsError(getErrorMessage(err, 'Failed to load student details'));
        }
      } finally {
        if (isActive) {
          setLoadingStudentDetails(false);
        }
      }
    };

    loadStudentDetails();

    return () => {
      isActive = false;
    };
  }, [courseId, selectedStudent, showStudentProfileModal]);

  const loadCourseData = useCallback(async () => {
    try {
      setLoading(true);
      setLoadingStudents(true);
      setLoadingReviews(true);

      const [detailsRes, contentRes, statsRes, enrollmentsRes, reviewsRes] = await Promise.all([
        courseAPI.getCourseDetails(courseId),
        courseAPI.getCourseContent(courseId),
        courseAPI.getCourseStats(courseId).catch(() => null),
        courseAPI.getCourseEnrollments(courseId, { page: 1, limit: 200 }).catch(() => null),
        reviewAPI.getReviews(courseId, { page: 1, limit: 200 }).catch(() => null),
      ]);

      const details = detailsRes?.data?.data || {};
      const contentData = contentRes?.data?.data || {};
      const statsData = statsRes?.data?.data || {};
      const enrollmentRows = enrollmentsRes?.data?.data || [];
      setCourse(details);
      setSections(contentData?.sections || []);
      setEnrolledStudents(Array.isArray(enrollmentRows) ? enrollmentRows : []);

      const reviewRows =
        reviewsRes?.data?.data?.reviews ||
        reviewsRes?.data?.data?.items ||
        reviewsRes?.data?.data ||
        [];
      setReviews(Array.isArray(reviewRows) ? reviewRows : []);
      setReviewTotal(reviewsRes?.data?.pagination?.total || (Array.isArray(reviewRows) ? reviewRows.length : 0));

      setCourseForm({
        title: details?.title || '',
        description: details?.description || '',
        subject: details?.subject || '',
        grade_level: details?.grade_level || details?.grade_level_name || '',
        course_type: details?.course_type || 'monthly',
        price_type: details?.is_paid ? 'PAID' : 'FREE',
        price: details?.price || '',
        status: details?.status || 'DRAFT',
        visibility: details?.visibility || 'PUBLIC',
        language: details?.language || 'en',
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
      setLoadingReviews(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadCourseData();
  }, [loadCourseData]);

  const loadReviews = useCallback(async (queryParams = {}) => {
    try {
      setLoadingReviews(true);
      const response = await reviewAPI.getReviews(courseId, queryParams);
      const reviewRows =
        response?.data?.data?.reviews ||
        response?.data?.data?.items ||
        response?.data?.data ||
        [];
      setReviews(Array.isArray(reviewRows) ? reviewRows : []);
      setReviewTotal(response?.data?.pagination?.total || (Array.isArray(reviewRows) ? reviewRows.length : 0));
    } catch (err) {
      showNotification(getErrorMessage(err, 'Failed to load reviews'), 'error');
    } finally {
      setLoadingReviews(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (activeTab !== 'reviews') return;

    const queryParams = {
      page: 1,
      limit: 200,
      sort: reviewSort,
    };

    if (reviewSearch.trim()) {
      queryParams.q = reviewSearch.trim();
    }

    if (reviewRatingFilter !== 'ALL') {
      queryParams.rating_min = Number(reviewRatingFilter);
    }

    if (reviewStatusFilter !== 'ALL') {
      queryParams.status = reviewStatusFilter;
    }

    const debounceTimer = setTimeout(() => {
      loadReviews(queryParams);
    }, 350);

    return () => clearTimeout(debounceTimer);
  }, [activeTab, reviewSearch, reviewRatingFilter, reviewStatusFilter, reviewSort, loadReviews]);

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

    if (normalizedType === 'zoom') {
      const zoomLink = String(lessonForm.zoom_meeting_link || '').trim();
      if (!zoomLink) {
        throw new Error('Zoom meeting link is required for zoom lessons');
      }

      const existingZoomContent = findContentByType(existingContents, 'zoom_live');
      const scheduledDate = lessonForm.scheduled_date || '';
      const scheduledTime = lessonForm.scheduled_time || '';
      const scheduledDateTime = scheduledDate
        ? `${scheduledDate}T${scheduledTime || '00:00'}`
        : undefined;

      const payload = {
        title: lessonForm.title,
        description: lessonForm.description || undefined,
        zoom_link: zoomLink,
        zoom_meeting_id: lessonForm.zoom_meeting_id || undefined,
        zoom_password: lessonForm.zoom_passcode || undefined,
        scheduled_date: scheduledDateTime,
        scheduled_duration_minutes: lessonForm.duration_minutes || undefined,
      };

      if (existingZoomContent?.content_id) {
        await courseAPI.updateZoomContent(courseId, lessonId, existingZoomContent.content_id, payload);
      } else {
        await courseAPI.addZoomContent(courseId, lessonId, payload);
      }
      return;
    }

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
        is_paid: courseForm.price_type === 'PAID',
        price: courseForm.price_type === 'PAID' ? Number(courseForm.price || 0) : null,
        language: courseForm.language,
        access_type: courseForm.access_type,
        generate_certificates: Boolean(courseForm.generate_certificates),
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
      <PDFViewer
        pdfUrl={selectedPDF.url}
        title={selectedPDF.title}
        contentId={selectedPDF.id}
        onClose={() => {
          setShowPDFViewerModal(false);
          setSelectedPDF(null);
        }}
      />
    );
  }

  if (showTextViewerModal && selectedTextLesson) {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between bg-white rounded-lg border border-slate-200 px-4 py-3">
            <h2 className="font-semibold text-slate-900">{selectedTextLesson.title || 'Text Lesson'}</h2>
            <button
              onClick={() => {
                setShowTextViewerModal(false);
                setSelectedTextLesson(null);
              }}
              className="px-3 py-1.5 text-sm bg-slate-900 text-white rounded hover:bg-slate-800"
            >
              Close
            </button>
          </div>

          <TextViewer
            title={selectedTextLesson.title || 'Text Lesson'}
            content={selectedTextLesson.text || ''}
            contentId={selectedTextLesson.id}
            completionThreshold={70}
          />
        </div>
      </div>
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
      setUploadProgressLessonId(lessonId);
      setUploadProgressPercent(0);

      const response = normalizedType === 'video'
        ? await courseAPI.uploadVideoContentFile(
            courseId,
            lessonId,
            file,
            { title: file.name },
            (progressEvent) => {
              const total = progressEvent?.total || 0;
              if (!total) return;
              const percent = Math.round((progressEvent.loaded * 100) / total);
              setUploadProgressPercent(Math.max(0, Math.min(100, percent)));
            }
          )
        : await courseAPI.uploadPdfContentFile(
            courseId,
            lessonId,
            file,
            { title: file.name },
            (progressEvent) => {
              const total = progressEvent?.total || 0;
              if (!total) return;
              const percent = Math.round((progressEvent.loaded * 100) / total);
              setUploadProgressPercent(Math.max(0, Math.min(100, percent)));
            }
          );

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
      setUploadProgressLessonId(null);
      setUploadProgressPercent(0);
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
      scheduled_date: zoomContent?.scheduled_date ? String(zoomContent.scheduled_date).slice(0, 10) : '',
      scheduled_time: zoomContent?.scheduled_date ? String(zoomContent.scheduled_date).slice(11, 16) : '',
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
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {tab.label}
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
                    <span className="ml-2 font-medium">{subjectLabelMap[course?.subject] || course?.subject || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Grade Level:</span>
                    <span className="ml-2 font-medium">{course?.grade_level ? `Grade ${course.grade_level}` : '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <span className="ml-2 font-medium">Rs. {course?.price}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Course Type:</span>
                    <span className="ml-2 font-medium">{courseTypeLabelMap[course?.course_type] || course?.course_type || '-'}</span>
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

      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Course Reviews</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {reviewTotal} total reviews, {filteredReviews.length} matching current filters
                </p>
              </div>
              <div className="text-sm text-gray-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                Average rating: <span className="font-semibold">{Number(courseStats.average_rating || 0).toFixed(1)} / 5</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
                <input
                  type="text"
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  placeholder="Search by student name, email, title, or review text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Rating</label>
                <select
                  value={reviewRatingFilter}
                  onChange={(e) => setReviewRatingFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All ratings</option>
                  <option value="5">5 stars</option>
                  <option value="4">4 stars and above</option>
                  <option value="3">3 stars and above</option>
                  <option value="2">2 stars and above</option>
                  <option value="1">1 star and above</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select
                  value={reviewStatusFilter}
                  onChange={(e) => setReviewStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All statuses</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="PENDING">Pending</option>
                  <option value="HIDDEN">Hidden</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Sort</label>
                <select
                  value={reviewSort}
                  onChange={(e) => setReviewSort(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="highest">Highest rating</option>
                  <option value="lowest">Lowest rating</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {loadingReviews && (
              <div className="bg-white rounded-lg shadow p-6 text-gray-600">Loading reviews...</div>
            )}

            {!loadingReviews && filteredReviews.length === 0 && (
              <div className="bg-white rounded-lg shadow p-6 text-gray-600">
                No reviews found for the current search/filter criteria.
              </div>
            )}

            {!loadingReviews && filteredReviews.map((review, idx) => {
              const reviewerName =
                review?.student_name ||
                review?.user_name ||
                review?.reviewer_name ||
                review?.student?.name ||
                review?.user?.name ||
                'Unknown Student';
              const reviewerEmail =
                review?.student_email || review?.user_email || review?.user?.email || null;
              const rating = getReviewRating(review);
              const status = getReviewStatus(review);
              const createdAt = review?.created_at || review?.createdAt || review?.updated_at || review?.updatedAt;
              const reviewTitle = review?.title || null;
              const reviewText = review?.comment || review?.review || review?.review_text || review?.message || '';

              return (
                <div key={review?.review_id || review?.id || idx} className="bg-white rounded-lg shadow p-5 border border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{reviewerName}</h3>
                      {reviewerEmail && <p className="text-sm text-gray-500">{reviewerEmail}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        <FaStar className="text-xs" /> {rating.toFixed(1)}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-700'
                          : status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-700'
                            : status === 'REJECTED'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                      }`}>
                        {status}
                      </span>
                    </div>
                  </div>

                  {(reviewTitle || reviewText) && (
                    <div className="mt-3">
                      {reviewTitle && <p className="text-sm font-semibold text-gray-900">{reviewTitle}</p>}
                      {reviewText && <p className="text-sm text-gray-700 whitespace-pre-wrap mt-1">{reviewText}</p>}
                    </div>
                  )}

                  <div className="mt-3 text-xs text-gray-500">
                    Reviewed on {createdAt ? formatDateValue(createdAt) : 'N/A'}
                  </div>
                </div>
              );
            })}
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
                                    disabled={uploadProgressLessonId === lessonId}
                                  />
                                </label>
                              )}
                              {String(lesson.lesson_type).toLowerCase() === 'video' && lesson.video_file && uploadProgressLessonId !== lessonId && (
                                <span className="px-2 py-1 text-xs bg-green-600 text-white rounded">✓ Uploaded</span>
                              )}
                              {String(lesson.lesson_type).toLowerCase() === 'pdf' && !lesson.pdf_file && (
                                <label className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer whitespace-nowrap">
                                  Upload PDF
                                  <input
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={(e) => handleUploadLessonFile(lessonId, e.target.files[0], 'PDF')}
                                    disabled={uploadProgressLessonId === lessonId}
                                  />
                                </label>
                              )}
                              {String(lesson.lesson_type).toLowerCase() === 'pdf' && lesson.pdf_file && uploadProgressLessonId !== lessonId && (
                                <span className="px-2 py-1 text-xs bg-green-600 text-white rounded">✓ Uploaded</span>
                              )}
                              <button
                                onClick={() => openEditLesson(section, lesson)}
                                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap"
                                disabled={uploadProgressLessonId === lessonId}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteLesson(lessonId, lesson.title)}
                                className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 whitespace-nowrap"
                                disabled={uploadProgressLessonId === lessonId}
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          {/* Upload Progress Bar */}
                          {uploadProgressLessonId === lessonId && (
                            <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-blue-700">
                                  {String(lesson.lesson_type).toLowerCase() === 'video' ? 'Uploading Video' : 'Uploading PDF'}...
                                </span>
                                <span className="text-xs font-medium text-blue-600">{uploadProgressPercent}%</span>
                              </div>
                              <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${uploadProgressPercent}%` }}
                                />
                              </div>
                            </div>
                          )}
                          
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
                                      url: getAbsoluteImageUrl(lesson.video_file)
                                    });
                                    setShowVideoPlayerModal(true);
                                  }}
                                  className="ml-2 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap"
                                >
                                  Play Video
                                </button>
                              </div>
                              <label className="text-xs text-gray-600 cursor-pointer inline-block px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ opacity: uploadProgressLessonId === lessonId ? 0.5 : 1, pointerEvents: uploadProgressLessonId === lessonId ? 'none' : 'auto' }}>
                                Replace Video
                                <input
                                  type="file"
                                  accept="video/*"
                                  className="hidden"
                                  onChange={(e) => handleUploadLessonFile(lessonId, e.target.files[0], 'VIDEO')}
                                  disabled={uploadProgressLessonId === lessonId}
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
                                    url: getAbsoluteImageUrl(lesson.pdf_file)
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
                              <label className="text-xs text-gray-600 cursor-pointer inline-block px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ opacity: uploadProgressLessonId === lessonId ? 0.5 : 1, pointerEvents: uploadProgressLessonId === lessonId ? 'none' : 'auto' }}>
                                Replace PDF
                                <input
                                  type="file"
                                  accept="application/pdf"
                                  className="hidden"
                                  onChange={(e) => handleUploadLessonFile(lessonId, e.target.files[0], 'PDF')}
                                  disabled={uploadProgressLessonId === lessonId}
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
                              <button
                                onClick={() => {
                                  setSelectedTextLesson({
                                    id: lessonId,
                                    title: lesson.title,
                                    text: lesson.text_content,
                                  });
                                  setShowTextViewerModal(true);
                                }}
                                className="mt-3 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                              >
                                Open Text Reader
                              </button>
                            </div>
                          )}

                          {String(lesson.lesson_type).toLowerCase() === 'zoom' && (lesson.zoom_meeting_link || lesson.zoom_meeting_id) && (
                            <div className="p-4 bg-white border-t border-gray-200">
                              <div className="text-xs font-semibold text-gray-700 mb-2">Zoom Meeting Details</div>
                              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-700 space-y-1">
                                {lesson.zoom_meeting_link && (
                                  <p>
                                    <span className="font-medium">Link:</span>{' '}
                                    <a href={lesson.zoom_meeting_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
                                      Join Meeting
                                    </a>
                                  </p>
                                )}
                                {lesson.zoom_meeting_id && <p><span className="font-medium">Meeting ID:</span> {lesson.zoom_meeting_id}</p>}
                                {lesson.zoom_passcode && <p><span className="font-medium">Passcode:</span> {lesson.zoom_passcode}</p>}
                                {lesson.zoom_scheduled_date && <p><span className="font-medium">Scheduled:</span> {new Date(lesson.zoom_scheduled_date).toLocaleString()}</p>}
                              </div>
                            </div>
                          )}

                          {String(lesson.lesson_type).toLowerCase() === 'quiz' && lesson.quiz_id && (
                            <div className="p-4 bg-white border-t border-gray-200">
                              <div className="text-xs font-semibold text-gray-700 mb-2">Quiz Details</div>
                              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-700 space-y-1">
                                <p><span className="font-medium">Quiz ID:</span> {lesson.quiz_id}</p>
                                {(lesson.quiz_title || lesson.quiz_content_title) && (
                                  <p><span className="font-medium">Title:</span> {lesson.quiz_title || lesson.quiz_content_title}</p>
                                )}
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

      {activeTab === 'enrollment-keys' && (
        <EnrollmentKeyManager
          courseId={courseId}
          showNotification={showNotification}
        />
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select
                      value={courseForm.language}
                      onChange={(e) => setCourseForm({ ...courseForm, language: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {COURSE_LANGUAGE_OPTIONS.map((lang) => (
                        <option key={lang.value} value={lang.value}>{lang.label}</option>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Type</label>
                    <select
                      value={courseForm.course_type}
                      onChange={(e) => setCourseForm({ ...courseForm, course_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {COURSE_TYPE_OPTIONS.map((type) => (
                        <option key={type.value || type.id} value={type.value || type.id}>
                          {type.label || type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Type</label>
                    <select
                      value={courseForm.price_type}
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          price_type: e.target.value,
                          price: e.target.value === 'PAID' ? courseForm.price : 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="FREE">Free</option>
                      <option value="PAID">Paid</option>
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
                      disabled={courseForm.price_type !== 'PAID'}
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
                onClick={() => {
                  setShowStudentProfileModal(false);
                  setSelectedStudent(null);
                  setSelectedStudentDetails(null);
                  setStudentDetailsError(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {loadingStudentDetails && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                  Loading current student details...
                </div>
              )}

              {studentDetailsError && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {studentDetailsError}
                </div>
              )}

              {/* Profile Header */}
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {selectedStudentProfile.profilePicture ? (
                    <img
                      src={getAbsoluteImageUrl(selectedStudentProfile.profilePicture)}
                      alt="student profile"
                      className="w-24 h-24 object-cover"
                    />
                  ) : (
                    <FaUser className="text-white text-3xl" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1 truncate">{selectedStudentProfile.fullName}</h3>
                  <p className="text-gray-600 break-all">{selectedStudentProfile.email}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {formatValue(selectedStudentProfile.role, 'student')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedStudentProfile.accountStatus?.is_banned ? 'bg-red-100 text-red-700' : selectedStudentProfile.accountStatus?.is_active === false ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {selectedStudentProfile.accountStatus?.is_banned ? 'Banned' : selectedStudentProfile.accountStatus?.is_active === false ? 'Inactive' : 'Active'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {selectedStudentProfile.courseTitle}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Student Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ['Student ID', selectedStudentProfile.userId],
                    ['Username', selectedStudentProfile.username],
                    ['First Name', selectedStudentProfile.firstName],
                    ['Last Name', selectedStudentProfile.lastName],
                    ['Full Name', selectedStudentProfile.fullName],
                    ['Email', selectedStudentProfile.email],
                    ['Phone', selectedStudentProfile.phone],
                    ['Date of Birth', formatDateOnlyValue(selectedStudentProfile.dateOfBirth)],
                    ['Grade', selectedStudentProfile.gradeLevel],
                    ['School', selectedStudentProfile.school],
                    ['Address', selectedStudentProfile.address],
                    ['Parent Name', selectedStudentProfile.parentName],
                    ['Parent Contact', selectedStudentProfile.parentContact],
                    ['Email Verified', formatBooleanValue(selectedStudentProfile.emailVerified)],
                    ['Phone Verified', formatBooleanValue(selectedStudentProfile.phoneVerified)],
                    ['Created At', formatDateValue(selectedStudentProfile.createdAt)],
                    ['Updated At', formatDateValue(selectedStudentProfile.updatedAt)],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
                      <p className="font-semibold text-gray-900 mt-1 break-words">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enrollment Details */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ['Enrollment ID', selectedStudentProfile.enrollmentId],
                    ['Enrollment Method', selectedStudentProfile.enrollmentMethod],
                    ['Enrollment Status', selectedStudentProfile.enrollmentStatus],
                    ['Progress', `${selectedStudentProfile.progress}%`],
                    ['Enrolled At', formatDateValue(selectedStudentProfile.enrolledAt)],
                    ['Completed At', formatDateValue(selectedStudentProfile.completedAt)],
                    ['Last Accessed', formatDateValue(selectedStudentProfile.lastAccessed)],
                    ['Total Time Spent', `${selectedStudentProfile.totalTimeSpentMinutes || 0} mins`],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
                      <p className="font-semibold text-gray-900 mt-1 break-words">{value}</p>
                    </div>
                  ))}

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Payment Method</span>
                    <p className="font-semibold text-gray-900 mt-1">{formatValue(selectedStudentProfile.paymentMethod)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Payment Status</span>
                    <p className="font-semibold text-gray-900 mt-1">{formatValue(selectedStudentProfile.paymentStatus)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Amount Paid</span>
                    <p className="font-semibold text-gray-900 mt-1">
                      {selectedStudentProfile.amountPaid === null || selectedStudentProfile.amountPaid === undefined || selectedStudentProfile.amountPaid === ''
                        ? 'N/A'
                        : `Rs. ${selectedStudentProfile.amountPaid}`}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Transaction ID</span>
                    <p className="font-semibold text-gray-900 mt-1 break-all">{formatValue(selectedStudentProfile.transactionId)}</p>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Account Status</span>
                    <p className="font-semibold text-gray-900 mt-1">
                      {selectedStudentProfile.accountStatus?.is_banned
                        ? 'Banned'
                        : selectedStudentProfile.accountStatus?.is_active === false
                          ? 'Inactive'
                          : 'Active'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Ban Reason</span>
                    <p className="font-semibold text-gray-900 mt-1 break-words">{formatValue(selectedStudentProfile.accountStatus?.ban_reason)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Banned At</span>
                    <p className="font-semibold text-gray-900 mt-1">{formatDateValue(selectedStudentProfile.accountStatus?.banned_at)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Ban Expires At</span>
                    <p className="font-semibold text-gray-900 mt-1">{formatDateValue(selectedStudentProfile.accountStatus?.ban_expires_at)}</p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="border-t pt-6 flex justify-end">
                <button
                  onClick={() => {
                    setShowStudentProfileModal(false);
                    setSelectedStudent(null);
                    setSelectedStudentDetails(null);
                    setStudentDetailsError(null);
                  }}
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
          <div className="bg-black rounded-lg w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
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
            <div className="flex-1 bg-black overflow-auto p-3 sm:p-4">
              <VideoPlayer
                videoUrl={selectedVideo.url}
                contentId={selectedVideo.id}
                theme="dark"
                disableContextMenu
                disableDownload
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
