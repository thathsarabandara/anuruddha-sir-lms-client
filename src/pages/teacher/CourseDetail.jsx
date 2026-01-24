import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { teacherCourseAPI, utilityAPI } from '../../api/courseApi';
import { BiLoader } from 'react-icons/bi';
import { FaEdit, FaStar, FaCheck, FaTimes, FaUser, FaEye } from 'react-icons/fa';
import QuizSearchModal from '../../components/teacher/QuizSearchModal';
import API from '../../api';
import { getAbsoluteImageUrl } from '../../utils/helpers';
import PDFViewer from '../../components/PDFViewer';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'view';
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [gradeLevels, setGradeLevels] = useState([]);
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
  const [selectedSection, setSelectedSection] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    subject: '',
    grade_level: '',
    category: '',
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
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    lesson_type: 'VIDEO',
    content_url: '',
    duration_minutes: '',
    order: 1,
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
  const [uploadingFile, setUploadingFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizVerification, setQuizVerification] = useState({
    isLoading: false,
    isValid: false,
    quizData: null,
    error: null
  });
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [showPDFViewerModal, setShowPDFViewerModal] = useState(false);

  useEffect(() => {
    const fetchUtilityData = async () => {
      try {
        const [categoriesRes, subjectsRes, gradeLevelsRes] = await Promise.all([
          utilityAPI.getCategories(),
          utilityAPI.getSubjects(),
          utilityAPI.getGradeLevels()
        ]);
        setCategories(categoriesRes.data.categories || categoriesRes.data);
        setSubjects(subjectsRes.data.subjects || subjectsRes.data);
        setGradeLevels(gradeLevelsRes.data.grade_levels || gradeLevelsRes.data);
      } catch (err) {
        console.error('Failed to fetch utility data:', err);
        setCategories([]);
        setSubjects([]);
        setGradeLevels([]);
      }
    };
    fetchUtilityData();
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await teacherCourseAPI.getCourseDetails(courseId);
      const courseData = response.data.course || response.data;
      setCourse(courseData);
      setCourseForm({
        title: courseData.title,
        description: courseData.description,
        subject: courseData.subject?.id || '',
        grade_level: courseData.grade_level?.id || '',
        category: courseData.category?.id || '',
        price: courseData.price,
        status: courseData.status,
        visibility: courseData.visibility,
        language: courseData.language || 'SINHALA',
        access_type: courseData.access_type || 'NORMAL',
        generate_certificates: courseData.generate_certificates || false
      });
      
      const sectionsData = courseData.sections || [];
      setSections(sectionsData);
      setLoading(false);
      
      // Fetch enrolled students
      fetchEnrolledStudents();
    } catch (err) {
      toast.error('Failed to fetch course details');
      console.error(err);
      setCategories([]);
      setSubjects([]);
      setGradeLevels([]);
      setLoading(false);
    }
  };

  const fetchEnrolledStudents = async () => {
    try {
      setLoadingStudents(true);
      const response = await teacherCourseAPI.getEnrolledStudents(courseId);
      if (response.data.success) {
        setEnrolledStudents(response.data.students || []);
      } else {
        setEnrolledStudents(response.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch enrolled students:', err);
      toast.error('Failed to load student list');
      setEnrolledStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await teacherCourseAPI.updateCourse(courseId, courseForm);
      toast.success('Course updated successfully');
      setShowEditModal(false);
      fetchCourseDetails();
    } catch (err) {
      toast.error('Failed to update course');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadThumbnail = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('thumbnail', file);

    try {
      setUploadingFile(true);
      setUploadProgress(0);
      const config = {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      };
      await teacherCourseAPI.uploadThumbnail(courseId, formData, config);
      toast.success('Thumbnail uploaded successfully');
      setUploadProgress(0);
      fetchCourseDetails();
    } catch (err) {
      toast.error('Failed to upload thumbnail');
      console.error(err);
    } finally {
      setUploadingFile(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteThumbnail = async () => {
    if (!window.confirm('Are you sure you want to delete the current thumbnail?')) return;
    
    try {
      await teacherCourseAPI.deleteThumbnail(courseId);
      toast.success('Thumbnail deleted successfully');
      fetchCourseDetails();
    } catch (err) {
      toast.error('Failed to delete thumbnail');
      console.error(err);
    }
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await teacherCourseAPI.createSection(courseId, sectionForm);
      toast.success('Section created successfully');
      setShowSectionModal(false);
      setSectionForm({ title: '', description: '', order: 1 });
      fetchCourseDetails();
    } catch (err) {
      toast.error('Failed to create section');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSection = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await teacherCourseAPI.updateSection(editingSection.id, sectionForm);
      toast.success('Section updated successfully');
      setShowSectionModal(false);
      setEditingSection(null);
      setSectionForm({ title: '', description: '', order: 1 });
      fetchCourseDetails();
    } catch (err) {
      toast.error('Failed to update section');
      console.error(err);
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
      const response = await teacherCourseAPI.verifyQuizId({
        quiz_id: quizId,
        check_ownership: false
      });

      if (response.data.success) {
        setQuizVerification({
          isLoading: false,
          isValid: true,
          quizData: response.data.quiz,
          error: null
        });
        toast.success('Quiz verified successfully!');
      } else {
        setQuizVerification({
          isLoading: false,
          isValid: false,
          quizData: null,
          error: response.data.message || 'Failed to verify quiz'
        });
        toast.error(response.data.message || 'Failed to verify quiz');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error verifying quiz';
      setQuizVerification({
        isLoading: false,
        isValid: false,
        quizData: null,
        error: errorMessage
      });
      toast.error(errorMessage);
    }
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    try {
      if (deleteConfirmData.type === 'section') {
        await teacherCourseAPI.deleteSection(deleteConfirmData.id);
        toast.success('Section deleted successfully');
      } else if (deleteConfirmData.type === 'lesson') {
        await teacherCourseAPI.deleteLesson(deleteConfirmData.id);
        toast.success('Lesson deleted successfully');
      }
      setShowDeleteConfirmModal(false);
      setDeleteConfirmData({ type: null, id: null, name: '' });
      fetchCourseDetails();
    } catch (err) {
      toast.error(`Failed to delete ${deleteConfirmData.type}`);
      console.error(err);
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
    setIsSubmitting(true);
    try {
      const lessonData = {
        title: lessonForm.title,
        description: lessonForm.description,
        content_type: lessonForm.lesson_type,
        duration_minutes: lessonForm.duration_minutes || 0,
        order: lessonForm.order
      };

      // Add type-specific fields
      if (lessonForm.lesson_type === 'VIDEO') {
        lessonData.video_url = lessonForm.video_url;
      } else if (lessonForm.lesson_type === 'LINK') {
        lessonData.external_link = lessonForm.external_link;
      } else if (lessonForm.lesson_type === 'TEXT') {
        lessonData.text_content = lessonForm.text_content;
      } else if (lessonForm.lesson_type === 'ZOOM_CLASS') {
        lessonData.zoom_class_id = lessonForm.zoom_meeting_id;
        lessonData.external_link = lessonForm.zoom_meeting_link;
        lessonData.text_content = JSON.stringify({
          scheduled_date: lessonForm.scheduled_date,
          scheduled_time: lessonForm.scheduled_time,
          meeting_id: lessonForm.zoom_meeting_id,
          passcode: lessonForm.zoom_passcode,
          link: lessonForm.zoom_meeting_link
        });
      } else if (lessonForm.lesson_type === 'QUIZ') {
        if (!quizVerification.isValid) {
          toast.error('Please verify the quiz ID before creating the lesson');
          setIsSubmitting(false);
          return;
        }
        lessonData.quiz_id = lessonForm.quiz_id;
      }
      
      await teacherCourseAPI.createLesson(selectedSection.id, lessonData);
      toast.success('Lesson created successfully');
      setShowLessonModal(false);
      setSelectedSection(null);
      setQuizVerification({
        isLoading: false,
        isValid: false,
        quizData: null,
        error: null
      });
      setLessonForm({
        title: '',
        description: '',
        lesson_type: 'VIDEO',
        content_url: '',
        duration_minutes: '',
        order: 1,
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
      fetchCourseDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create lesson');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadLessonFile = async (lessonId, file, fileType) => {
    const formData = new FormData();
    formData.append('file_type', fileType.toLowerCase());
    formData.append(fileType.toLowerCase(), file);

    try {
      setUploadingFile(true);
      setUploadProgress(0);
      const config = {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      };
      await teacherCourseAPI.uploadLessonFile(lessonId, formData, config);
      toast.success(`${fileType} uploaded successfully`);
      setUploadProgress(0);
      fetchCourseDetails();
    } catch (err) {
      toast.error(`Failed to upload ${fileType}`);
      console.error(err);
    } finally {
      setUploadingFile(false);
      setUploadProgress(0);
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
      order: section.order
    });
    setShowSectionModal(true);
  };

  const openCreateLesson = (section) => {
    setSelectedSection(section);
    setShowLessonModal(true);
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
                {course?.thumbnail ? (
                  <img 
                    src={course.thumbnail.startsWith('http') ? course.thumbnail : `http://localhost:8000${course.thumbnail}`} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <div className={`w-full h-full ${course?.thumbnail ? 'hidden' : 'flex'} items-center justify-center text-gray-400`}>
                  No thumbnail
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">{course?.title}</h2>
                <p className="text-gray-600 mb-4">{course?.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <span className="ml-2 font-medium">{course?.category?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Subject:</span>
                    <span className="ml-2 font-medium">{course?.subject?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Grade Level:</span>
                    <span className="ml-2 font-medium">{course?.grade_level?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <span className="ml-2 font-medium">Rs. {course?.price}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500">Total Sections</div>
              <div className="text-2xl font-bold text-gray-900">{sections.length}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500">Total Lessons</div>
              <div className="text-2xl font-bold text-gray-900">
                {sections.reduce((sum, section) => sum + (section.lessons?.length || 0), 0)}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500">Students Enrolled</div>
              <div className="text-2xl font-bold text-gray-900">{enrolledStudents.length || 0}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500">Average Rating</div>
              <div className="text-2xl font-bold text-gray-900">{course?.average_rating || 0}<FaStar className="inline text-yellow-400 ml-1" /></div>
            </div>
          </div>

          {/* Enrolled Students Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Enrolled Students</h2>
            {loadingStudents ? (
              <div className="flex items-center justify-center py-8">
                <BiLoader className="animate-spin text-2xl text-blue-600 mr-2" />
                <span className="text-gray-600">Loading students...</span>
              </div>
            ) : enrolledStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Student Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment Method</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Enrolled Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrolledStudents.map((student) => (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              {student.image &&
                                <img src={getAbsoluteImageUrl(student.image)} alt='student_image' className='rounded-full w-8 h-8'/>
                              }
                              {!student.image &&
                                <FaUser className="text-blue-600 text-sm" />
                              }
                            </div>
                            <span className="font-medium text-gray-900">{student.user?.name || student.name || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{student.user?.email || student.email || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            student.payment_method === 'CARD' ? 'bg-blue-100 text-blue-700' :
                            student.payment_method === 'BANK_TRANSFER' ? 'bg-green-100 text-green-700' :
                            student.payment_method === 'CASH' ? 'bg-yellow-100 text-yellow-700' :
                            student.payment_method === 'FREE' ? 'bg-gray-100 text-gray-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {student.payment_method || 'N/A'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                            student.payment_status === 'COMPLETED' || student.payment_status === 'PAID' ? 'bg-green-100 text-green-700' :
                            student.payment_status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                            student.payment_status === 'FAILED' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {student.payment_status === 'COMPLETED' || student.payment_status === 'PAID' ? <FaCheck className="text-xs" /> : null}
                            {student.payment_status || 'FREE'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {student.enrolled_at ? new Date(student.enrolled_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowStudentProfileModal(true);
                            }}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1 transition-colors"
                          >
                            <FaEye className="text-xs" /> View Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No students enrolled yet</p>
              </div>
            )}
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
            {sections.map((section, idx) => (
              <div key={section.id} className="bg-white rounded-lg shadow">
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
                      onClick={() => handleDeleteSection(section.id, section.title)}
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
                      {section.lessons.map((lesson, lessonIdx) => (
                        <div key={lesson.id} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                          <div className="flex items-center justify-between p-4 bg-gray-100">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <span className="text-gray-500 font-medium">{lessonIdx + 1}.</span>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 truncate">{lesson.title}</div>
                                <div className="text-xs text-gray-600">
                                  {lesson.lesson_type} • {lesson.duration_minutes || 0} mins
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                              {lesson.lesson_type === 'TEXT' && lesson.text_content && (
                                <button className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                                  View
                                </button>
                              )}
                              {lesson.lesson_type === 'VIDEO' && !lesson.video_file && (
                                <label className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer whitespace-nowrap">
                                  Upload Video
                                  <input
                                    type="file"
                                    accept="video/*"
                                    className="hidden"
                                    onChange={(e) => handleUploadLessonFile(lesson.id, e.target.files[0], 'VIDEO')}
                                  />
                                </label>
                              )}
                              {lesson.lesson_type === 'PDF' && !lesson.pdf_file && (
                                <label className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer whitespace-nowrap">
                                  Upload PDF
                                  <input
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={(e) => handleUploadLessonFile(lesson.id, e.target.files[0], 'PDF')}
                                  />
                                </label>
                              )}
                              <button
                                onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
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
                                      id: lesson.id,
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
                                  onChange={(e) => handleUploadLessonFile(lesson.id, e.target.files[0], 'VIDEO')}
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
                                    id: lesson.id,
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
                                  onChange={(e) => handleUploadLessonFile(lesson.id, e.target.files[0], 'PDF')}
                                />
                              </label>
                            </div>
                          )}
                          
                          {lesson.lesson_type === 'TEXT' && lesson.text_content && (
                            <div className="p-4 bg-white border-t border-gray-200">
                              <div className="text-xs font-semibold text-gray-700 mb-2">Text Content</div>
                              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-32 overflow-y-auto text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {lesson.text_content}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No lessons yet. Add your first lesson!</p>
                  )}
                </div>
              </div>
            ))}

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
              {course?.thumbnail && (
                <div className="mb-4 bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-xs font-semibold text-gray-700 mb-3">Current Thumbnail</p>
                  <div className="flex gap-4">
                    <div className="w-48 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-300 flex-shrink-0">
                      <img 
                        src={course.thumbnail.startsWith('http') ? course.thumbnail : `http://localhost:8000${course.thumbnail}`} 
                        alt="Current thumbnail" 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Thumbnail Details</p>
                        <p className="text-xs text-gray-600 mb-2">
                          Filename: <span className="font-mono text-gray-800">{course.thumbnail.split('/').pop()}</span>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={courseForm.category}
                      onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      {Array.isArray(categories) && categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select
                      value={courseForm.subject}
                      onChange={(e) => setCourseForm({ ...courseForm, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Subject</option>
                      {Array.isArray(subjects) && subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
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
                        <option key={grade.id} value={grade.id}>{grade.name}</option>
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
              <h2 className="text-2xl font-bold mb-4">Create Lesson</h2>
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
                    <option value="VIDEO">Video</option>
                    <option value="PDF">PDF Document</option>
                    <option value="LINK">External Link</option>
                    <option value="TEXT">Text Content</option>
                    <option value="ZOOM_CLASS">Zoom Class</option>
                    <option value="QUIZ">Quiz</option>
                  </select>
                </div>

                {/* Video Upload - shown when VIDEO is selected */}
                {lessonForm.lesson_type === 'VIDEO' && (
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
                {lessonForm.lesson_type === 'PDF' && (
                  <div>
                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      After creating this lesson, you can upload the PDF file from the content view.
                    </p>
                  </div>
                )}

                {/* External Link - shown when LINK is selected */}
                {lessonForm.lesson_type === 'LINK' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">External Link URL</label>
                    <input
                      type="url"
                      value={lessonForm.external_link}
                      onChange={(e) => setLessonForm({ ...lessonForm, external_link: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com"
                      required
                    />
                  </div>
                )}

                {/* Text Content - shown when TEXT is selected */}
                {lessonForm.lesson_type === 'TEXT' && (
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
                {lessonForm.lesson_type === 'ZOOM_CLASS' && (
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
                {lessonForm.lesson_type === 'QUIZ' && (
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
                              <p><strong>Teacher:</strong> {quizVerification.quizData.teacher.name}</p>
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
                {lessonForm.lesson_type !== 'QUIZ' && (
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
                      setQuizVerification({
                        isLoading: false,
                        isValid: false,
                        quizData: null,
                        error: null
                      });
                      setLessonForm({
                        title: '',
                        description: '',
                        lesson_type: 'VIDEO',
                        content_url: '',
                        duration_minutes: '',
                        order: 1
                      });
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || (lessonForm.lesson_type === 'QUIZ' && !quizVerification.isValid)}
                    className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
                      isSubmitting || (lessonForm.lesson_type === 'QUIZ' && !quizVerification.isValid)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <BiLoader className="inline-block animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      'Create Lesson'
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
          setLessonForm({ ...lessonForm, quiz_id: quiz.id });
          setShowQuizSearchModal(false);
          // Auto-verify the selected quiz
          setTimeout(() => {
            verifyQuizId(quiz.id);
          }, 100);
        }}
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
