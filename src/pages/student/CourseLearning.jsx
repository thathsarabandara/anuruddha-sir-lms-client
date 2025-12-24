import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { studentCourseAPI } from '../../api/courseApi';

const StudentCourseLearning = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [progress, setProgress] = useState(0);

  const calculateProgress = (courseData) => {
    if (!courseData.sections) return;
    
    let totalLessons = 0;
    let completedLessons = 0;

    courseData.sections.forEach(section => {
      if (section.lessons) {
        totalLessons += section.lessons.length;
        completedLessons += section.lessons.filter(l => l.is_completed).length;
      }
    });

    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    setProgress(Math.round(progressPercentage));
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await studentCourseAPI.getCourseDetails(courseId);
        setCourse(response.data);
        calculateProgress(response.data);

        // Find first incomplete lesson or first lesson
        if (response.data.sections && response.data.sections.length > 0) {
          let firstLesson = null;
          for (const section of response.data.sections) {
            if (section.lessons && section.lessons.length > 0) {
              firstLesson = section.lessons.find(l => !l.is_completed) || section.lessons[0];
              if (firstLesson) break;
            }
          }
          if (firstLesson) {
            setCurrentLesson(firstLesson);
          }
        }
        setLoading(false);
      } catch (err) {
        toast.error('Failed to fetch course details');
        setLoading(false);
        console.error(err);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await studentCourseAPI.getCourseDetails(courseId);
      setCourse(response.data);
      calculateProgress(response.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch course details');
      setLoading(false);
      console.error(err);
    }
  };

  const handleLessonClick = async (lesson) => {
    setCurrentLesson(lesson);
    
    // Mark as accessed
    try {
      await studentCourseAPI.accessLesson(lesson.id);
      fetchCourseDetails(); // Refresh to update completion status
    } catch (err) {
      console.error('Failed to mark lesson as accessed:', err);
    }
  };

  const handleMarkComplete = async () => {
    if (!currentLesson) return;

    try {
      await studentCourseAPI.accessLesson(currentLesson.id, { completed: true });
      toast.success('Lesson marked as complete!');
      fetchCourseDetails();
      
      // Move to next lesson
      const nextLesson = findNextLesson();
      if (nextLesson) {
        setCurrentLesson(nextLesson);
      }
    } catch (err) {
      toast.error('Failed to mark lesson as complete');
      console.error(err);
    }
  };

  const findNextLesson = () => {
    if (!course || !currentLesson) return null;

    let foundCurrent = false;
    for (const section of course.sections) {
      if (section.lessons) {
        for (const lesson of section.lessons) {
          if (foundCurrent) {
            return lesson;
          }
          if (lesson.id === currentLesson.id) {
            foundCurrent = true;
          }
        }
      }
    }
    return null;
  };

  const renderLessonContent = () => {
    if (!currentLesson) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          Select a lesson to start learning
        </div>
      );
    }

    switch (currentLesson.lesson_type) {
      case 'VIDEO':
        return (
          <div className="space-y-4">
            {currentLesson.video_file ? (
              <div className="bg-black rounded-lg overflow-hidden">
                <div className="flex items-center justify-center bg-gray-900 p-8">
                  <a
                    href={`/api/v1/lessons/${currentLesson.id}/play/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    Open Video Player
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-12 text-center">
                <p className="text-gray-500">Video file not available</p>
              </div>
            )}
          </div>
        );

      case 'PDF':
        return (
          <div className="space-y-4">
            {currentLesson.pdf_file ? (
              <iframe
                src={currentLesson.pdf_file}
                className="w-full h-[600px] rounded-lg border"
                title={currentLesson.title}
              />
            ) : (
              <div className="bg-gray-100 rounded-lg p-12 text-center">
                <p className="text-gray-500">PDF file not available</p>
              </div>
            )}
          </div>
        );

      case 'LINK':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold mb-2">External Resource</h3>
              <a
                href={currentLesson.content_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {currentLesson.content_url}
              </a>
            </div>
          </div>
        );

      case 'TEXT':
        return (
          <div className="space-y-4">
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{currentLesson.content_url}</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-gray-500">Unsupported lesson type</div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Course Content */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => navigate('/student/courses')}
            className="text-blue-600 hover:text-blue-700 text-sm mb-2"
          >
            ← Back to Courses
          </button>
          <h2 className="font-bold text-lg mb-2">{course?.title}</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Sections and Lessons */}
        <div className="p-4 space-y-4">
          {course?.sections?.map((section, sectionIdx) => (
            <div key={section.id} className="space-y-2">
              <div className="font-semibold text-gray-900">
                Section {sectionIdx + 1}: {section.title}
              </div>
              {section.lessons?.map((lesson, lessonIdx) => (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentLesson?.id === lesson.id
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      lesson.is_completed
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {lesson.is_completed ? '✓' : lessonIdx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {lesson.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {lesson.lesson_type} • {lesson.duration_minutes || 0} mins
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6">
          {currentLesson ? (
            <div className="space-y-4">
              {/* Lesson Header */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {currentLesson.title}
                    </h1>
                    {currentLesson.description && (
                      <p className="text-gray-600">{currentLesson.description}</p>
                    )}
                  </div>
                  {currentLesson.is_completed && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      ✓ Completed
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {currentLesson.lesson_type}
                  </span>
                  <span>⏱️ {currentLesson.duration_minutes || 0} minutes</span>
                </div>
              </div>

              {/* Lesson Content */}
              <div className="bg-white rounded-lg shadow p-6">
                {renderLessonContent()}
              </div>

              {/* Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {currentLesson.is_completed ? 'You completed this lesson' : 'Mark as complete when finished'}
                  </div>
                  <div className="flex gap-2">
                    {!currentLesson.is_completed && (
                      <button
                        onClick={handleMarkComplete}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Mark as Complete
                      </button>
                    )}
                    {findNextLesson() && (
                      <button
                        onClick={() => handleLessonClick(findNextLesson())}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Next Lesson →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No lessons available</h3>
              <p className="text-gray-600">This course doesn't have any lessons yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCourseLearning;
