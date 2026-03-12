import { useState, useEffect } from 'react';
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
  FaQuestionCircle
} from 'react-icons/fa';
import VideoPlayer from '../../components/VideoPlayer';
import PDFViewer from '../../components/PDFViewer';
import SectionProgress from '../../components/SectionProgress';

const StudentCourseLearning = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set([0]));
  const [currentLesson, setCurrentLesson] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allLessons, setAllLessons] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showPDFViewer, setShowPDFViewer] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await studentCourseAPI.getCourseDetails(courseId);
        const courseData = response.data?.course || response.data;
        
        // Calculate progress and completed lessons
        let totalLessons = 0;
        let completedCount = 0;
        const completed = new Set();
        const flatLessons = [];

        // Transform data
        const sections = (courseData.sections || []).map((section, idx) => {
          const lessons = (section.lessons || []).map((lesson, lidx) => {
            totalLessons++;
            const contentType = (lesson.content_type || lesson.type || 'video').toUpperCase();
            flatLessons.push({
              ...lesson,
              sectionId: section.id,
              sectionTitle: section.title,
              id: lesson.id,
              title: lesson.title || `Lesson ${lidx + 1}`,
              duration: lesson.duration_minutes ? `${lesson.duration_minutes} mins` : '0 mins',
              type: contentType,
              description: lesson.description,
              videoUrl: lesson.video_file || lesson.video_url || lesson.external_link,
              documentUrl: lesson.document_file || lesson.document_url,
              is_completed: lesson.is_completed || false,
              is_locked: lesson.is_locked || false,
              downloadUrl: lesson.document_file || lesson.document_url,
              resources: lesson.resources || [],
              quiz_id: lesson.quiz_id || null
            });
            
            if (lesson.is_completed) {
              completedCount++;
              completed.add(lesson.id);
            }
            return flatLessons[flatLessons.length - 1];
          });

          return {
            id: section.id,
            title: section.title || `Section ${idx + 1}`,
            description: section.description,
            lessons
          };
        });

        const transformedCourse = {
          id: courseData.id,
          title: courseData.title || 'Untitled Course',
          subject: courseData.subject || 'General',
          grade: courseData.grade_level,
          instructor: courseData.instructor?.user?.first_name || courseData.instructor?.name || 'Instructor',
          rating: courseData.average_rating || 0,
          students: courseData.enrolled_students_count || 0,
          description: courseData.description || '',
          duration: courseData.duration || 'Self-paced',
          lessons: totalLessons,
          price: courseData.price || 0,
          enrolledDate: courseData.enrollment?.enrollment_date || new Date().toISOString(),
          color: courseData.color || 'from-blue-500 to-blue-600',
          overview: courseData.description || '',
          thumbnail: courseData.thumbnail,
          sections: sections,
          resources: (courseData.resources || []).map(res => ({
            id: res.id,
            title: res.title || 'Resource',
            size: res.size || 'Unknown',
            url: res.file_url,
            type: res.type || 'pdf'
          })) || []
        };

        setCourse(transformedCourse);
        setCompletedLessons(completed);
        setAllLessons(flatLessons);
        
        const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
        setProgress(Math.round(progressPercentage));

        // Find first uncompleted lesson
        const firstUncompleted = flatLessons.find(l => !completed.has(l.id));
        const firstLesson = firstUncompleted || flatLessons[0];
        
        if (firstLesson) {
          setCurrentLesson(firstLesson);
          setCurrentLessonIndex(flatLessons.findIndex(l => l.id === firstLesson.id));
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course. Please try again.');
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const handleLessonClick = async (lesson) => {
    if (lesson.is_locked) {
      alert('This lesson is locked. Complete previous lessons to unlock it.');
      return;
    }
    
    console.log('Loading lesson:', {
      id: lesson.id,
      title: lesson.title,
      type: lesson.type,
      videoUrl: lesson.videoUrl,
      documentUrl: lesson.documentUrl
    });
    
    setCurrentLesson(lesson);
    const index = allLessons.findIndex(l => l.id === lesson.id);
    setCurrentLessonIndex(index);
    setShowPDFViewer(false);

    // Mark as completed after a brief delay for non-video content
    if (!completedLessons.has(lesson.id) && lesson.type !== 'VIDEO') {
      setTimeout(() => {
        markLessonComplete(lesson);
      }, 2000);
    }
  };

  const markLessonComplete = async (lesson) => {
    try {
      console.log('Marking lesson as completed:', {
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        totalLessons: course?.lessons
      });

      const response = await studentCourseAPI.updateLessonProgress(lesson.id, {
        status: 'COMPLETED',
        progress_percentage: 100,
        last_position_seconds: 0
      });

      console.log('Lesson marked as completed:', response);

      const newCompleted = new Set(completedLessons);
      newCompleted.add(lesson.id);
      setCompletedLessons(newCompleted);
      
      // Update progress
      const totalLessons = course?.lessons || allLessons.length;
      const newProgress = Math.round((newCompleted.size / totalLessons) * 100);
      setProgress(newProgress);
      
      console.log('Progress updated:', {
        completedCount: newCompleted.size,
        totalLessons: totalLessons,
        percentage: newProgress
      });
    } catch (err) {
      console.error('Error marking lesson as completed:', {
        error: err,
        message: err?.message,
        response: err?.response?.data,
        lessonId: lesson.id
      });
      alert('Failed to mark lesson as complete. Please try again.');
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const prevLesson = allLessons[currentLessonIndex - 1];
      handleLessonClick(prevLesson);
    }
  };

  const goToNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      handleLessonClick(nextLesson);
    }
  };

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const makeVideoUrl = (url) => {
    if (!url) return null;
    
    // If it's already a full URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    let baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    baseUrl = baseUrl.replace(/\/$/, '').replace(/\/api\/v[0-9]+\/?$/, '');
    
    // Ensure URL starts with /
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    
    const finalUrl = `${baseUrl}${cleanUrl}`;
    console.log('Generated Video URL:', { original: url, final: finalUrl });
    return finalUrl;
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="h-1 bg-slate-200"></div>
        </header>
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="hidden lg:block">
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-8 bg-slate-200 rounded animate-pulse"></div>
                ))}
              </div>
            </aside>
            <main className="lg:col-span-3">
              <div className="space-y-6">
                <div className="h-96 bg-slate-200 rounded-lg animate-pulse"></div>
                <div className="h-32 bg-slate-100 rounded-lg animate-pulse"></div>
              </div>
            </main>
          </div>
        </div>
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
      {/* Header */}
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
              <h1 className="font-semibold text-lg text-slate-900">{course?.title}</h1>
              <p className="text-xs text-slate-500">{course?.subject}</p>
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
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 sm:p-6 lg:p-8">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 overflow-y-auto z-10">
            <div className="p-4 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
              {course?.sections?.map((section) => (
                <div key={section.id} className="space-y-1">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors font-medium text-sm text-slate-900 flex items-center justify-between"
                  >
                    <span>{section.title}</span>
                    {expandedSections.has(section.id) ? (
                      <FaChevronUp size={14} />
                    ) : (
                      <FaChevronDown size={14} />
                    )}
                  </button>

                  {expandedSections.has(section.id) && (
                    <div className="space-y-1 ml-2">
                      {section.lessons?.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            handleLessonClick(lesson);
                            setSidebarOpen(false);
                          }}
                          disabled={lesson.is_locked}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                            currentLesson?.id === lesson.id
                              ? 'bg-blue-100 text-blue-900 font-medium'
                              : 'hover:bg-slate-100 text-slate-700'
                          } ${lesson.is_locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {completedLessons.has(lesson.id) ? (
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

          {/* Mobile Sidebar */}
          {sidebarOpen && (
            <div className="fixed inset-0 top-20 z-50 lg:hidden transition-opacity duration-300 ease-in-out">
              <div className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 overflow-y-auto shadow-2xl transform transition-transform duration-300 ease-in-out translate-x-0">
                <div className="p-4 space-y-2">
                  {course?.sections?.map((section) => (
                    <div key={section.id} className="space-y-1">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors font-medium text-sm text-slate-900 flex items-center justify-between"
                      >
                        <span>{section.title}</span>
                        {expandedSections.has(section.id) ? (
                          <FaChevronUp size={14} />
                        ) : (
                          <FaChevronDown size={14} />
                        )}
                      </button>

                      {expandedSections.has(section.id) && (
                        <div className="space-y-1 ml-2">
                          {section.lessons?.map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => {
                                handleLessonClick(lesson);
                                setSidebarOpen(false);
                              }}
                              disabled={lesson.is_locked}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                                currentLesson?.id === lesson.id
                                  ? 'bg-blue-100 text-blue-900 font-medium'
                                  : 'hover:bg-slate-100 text-slate-700'
                              } ${lesson.is_locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              {completedLessons.has(lesson.id) ? (
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
              <div
                className="absolute inset-0 transition-opacity duration-300 ease-in-out opacity-100"
                onClick={() => setSidebarOpen(false)}
              ></div>
            </div>
          )}

          {/* Main Content */}
          <main className="lg:col-span-3">
            {currentLesson && (
              <div className="space-y-6">
                {/* Player */}
                <div className="bg-black rounded-lg overflow-hidden shadow-sm">
                  {currentLesson.type === 'VIDEO' && currentLesson.videoUrl ? (
                    <VideoPlayer
                      videoUrl={makeVideoUrl(currentLesson.videoUrl)}
                      onProgress={() => {}}
                      onComplete={() => {
                        if (!completedLessons.has(currentLesson.id)) {
                          markLessonComplete(currentLesson);
                        }
                      }}
                      isCompleted={completedLessons.has(currentLesson.id)}
                    />
                  ) : currentLesson.type === 'PDF' && currentLesson.documentUrl ? (
                    showPDFViewer ? (
                      <PDFViewer
                        pdfUrl={currentLesson.documentUrl}
                        title={currentLesson.title}
                        onComplete={() => {
                          if (!completedLessons.has(currentLesson.id)) {
                            markLessonComplete(currentLesson);
                          }
                        }}
                        isCompleted={completedLessons.has(currentLesson.id)}
                        fileName={currentLesson.title}
                        onClose={() => setShowPDFViewer(false)}
                      />
                    ) : (
                      <div className="aspect-video flex items-center justify-center bg-slate-900">
                        <button
                          onClick={() => setShowPDFViewer(true)}
                          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                        >
                          Open PDF
                        </button>
                      </div>
                    )
                  ) : currentLesson.type === 'TEXT' ? (
                    <div className="aspect-video bg-slate-50 flex items-center justify-center p-8">
                      <div className="bg-white rounded-lg p-8 max-w-2xl">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">{currentLesson.title}</h2>
                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{currentLesson.description}</p>
                      </div>
                    </div>
                  ) : currentLesson.type === 'LINK' && currentLesson.videoUrl ? (
                    <iframe
                      src={currentLesson.videoUrl}
                      className="w-full aspect-video bg-slate-900"
                      allowFullScreen
                      title={currentLesson.title}
                    />
                  ) : (
                    <div className="aspect-video flex items-center justify-center bg-slate-100">
                      <p className="text-slate-600 font-medium">No content available</p>
                    </div>
                  )}
                </div>

                {/* Lesson Info */}
                <div className="bg-slate-50 rounded-lg p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-slate-900">{currentLesson.title}</h2>
                        {completedLessons.has(currentLesson.id) && (
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
                      <span className="font-medium capitalize">{currentLesson.type}</span>
                    </div>
                    {currentLesson.quiz_id && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <FaQuestionCircle className="text-slate-400" size={16} />
                        <span className="font-medium">Quiz Available</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    {!completedLessons.has(currentLesson.id) && (
                      <button
                        onClick={() => markLessonComplete(currentLesson)}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                      >
                        <FaCheck size={14} /> Mark Complete
                      </button>
                    )}
                    {currentLesson.documentUrl && (
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = currentLesson.documentUrl;
                          link.download = currentLesson.title || 'document';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                      >
                        <FaDownload size={14} /> Download
                      </button>
                    )}
                    {currentLesson.quiz_id && (
                      <button
                        onClick={() => navigate(`/student/quiz/${currentLesson.quiz_id}`)}
                        className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                      >
                        <FaQuestionCircle size={14} /> Take Quiz
                      </button>
                    )}
                  </div>
                </div>

                {/* Resources */}
                {currentLesson.resources?.length > 0 && (
                  <div className="bg-slate-50 rounded-lg p-6 sm:p-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Resources</h3>
                    <div className="space-y-3">
                      {currentLesson.resources.map((resource) => (
                        <div
                          key={resource.id}
                          className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-slate-900 text-sm">{resource.title}</p>
                            <p className="text-xs text-slate-500">{resource.size}</p>
                          </div>
                          <button
                            onClick={() => resource.url && window.open(resource.url, '_blank')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
                          >
                            <FaDownload size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
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

                {/* Completion */}
                {progress === 100 && (
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
