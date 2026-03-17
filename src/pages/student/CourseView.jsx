import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaStar, 
  FaCheckCircle, 
  FaPlayCircle,
  FaBook,
  FaFileDownload,
  FaClock,
  FaVideo,
  FaLock
} from 'react-icons/fa';
import Notification from '../../components/common/Notification';

const CourseView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('curriculum');
  const [completedLessons, setCompletedLessons] = useState([1, 2]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Sample course data
  const course = {
    id: courseId || 1,
    title: 'Advanced Algebra Mastery',
    subject: 'Mathematics',
    grade: 5,
    instructor: 'Dr. Samanth Perera',
    rating: 4.8,
    students: 2145,
    description: 'Master advanced algebra concepts including quadratic equations, polynomials, and algebraic expressions. Perfect for students preparing for competitive exams.',
    duration: '12 weeks',
    lessons: 24,
    price: 8500,
    enrolledDate: '2025-01-15',
    progress: 33,
    color: 'from-blue-500 to-blue-600',
    overview: 'This comprehensive course covers advanced algebra topics with practical problem-solving approaches. Learn from experienced instructors and master concepts that are critical for your academic success.',
    curriculum: [
      {
        id: 1,
        title: 'Quadratic Equations',
        lessons: [
          { id: 1, title: 'Introduction to Quadratic Equations', duration: '15 mins', type: 'video', completed: true },
          { id: 2, title: 'Solving by Factoring', duration: '22 mins', type: 'video', completed: true },
          { id: 3, title: 'Quadratic Formula', duration: '18 mins', type: 'video', completed: false },
          { id: 4, title: 'Practice Problems Set 1', duration: '30 mins', type: 'quiz', completed: false },
        ]
      },
      {
        id: 2,
        title: 'Polynomial Functions',
        lessons: [
          { id: 5, title: 'Understanding Polynomials', duration: '20 mins', type: 'video', completed: false },
          { id: 6, title: 'Polynomial Operations', duration: '25 mins', type: 'video', completed: false },
          { id: 7, title: 'Graphing Polynomials', duration: '28 mins', type: 'video', completed: false },
          { id: 8, title: 'Practice Set 2', duration: '40 mins', type: 'quiz', completed: false },
        ]
      },
      {
        id: 3,
        title: 'Systems of Equations',
        lessons: [
          { id: 9, title: 'Linear Systems Overview', duration: '18 mins', type: 'video', completed: false },
          { id: 10, title: 'Substitution Method', duration: '20 mins', type: 'video', completed: false },
          { id: 11, title: 'Elimination Method', duration: '22 mins', type: 'video', completed: false },
          { id: 12, title: 'Complex Systems', duration: '25 mins', type: 'video', completed: false },
        ]
      }
    ],
    resources: [
      { id: 1, title: 'Algebra Fundamentals Guide.pdf', size: '2.4 MB' },
      { id: 2, title: 'Formula Reference Sheet.pdf', size: '1.2 MB' },
      { id: 3, title: 'Practice Problems Collection.pdf', size: '3.8 MB' },
    ]
  };

  const handleLessonClick = (lesson) => {
    if (!completedLessons.includes(lesson.id)) {
      setCompletedLessons([...completedLessons, lesson.id]);
    }
    setSelectedLesson(lesson);
  };

  const getTotalLessons = () => {
    return course.curriculum.reduce((sum, section) => sum + section.lessons.length, 0);
  };

  const getCompletedLessonCount = () => {
    return course.curriculum.reduce((sum, section) => 
      sum + section.lessons.filter(l => completedLessons.includes(l.id)).length, 0
    );
  };

  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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
      {/* Header */}
      <div className={`bg-gradient-to-r ${course.color} text-white p-8 lg:p-12`}>
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/student/courses')}
            className="flex items-center gap-2 mb-6 hover:opacity-90 transition-opacity"
          >
            <FaArrowLeft /> Back to Courses
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg opacity-90 mb-4">{course.description}</p>
              
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-300" />
                  <span className="font-semibold">{course.rating} ({course.students} students)</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaBook />
                  <span>{course.lessons} Lessons</span>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm opacity-90">Instructor: <span className="font-semibold">{course.instructor}</span></p>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold">Your Progress</p>
                  <span className="text-2xl font-bold">{Math.round((getCompletedLessonCount() / getTotalLessons()) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-300"
                    style={{ width: `${(getCompletedLessonCount() / getTotalLessons()) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Completed Lessons</span>
                  <span className="font-semibold">{getCompletedLessonCount()} of {getTotalLessons()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Enrolled Since</span>
                  <span className="font-semibold">{course.enrolledDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          {['curriculum', 'overview', 'resources', 'reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold border-b-2 transition-all capitalize ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Curriculum Tab */}
        {activeTab === 'curriculum' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lesson List */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {course.curriculum.map(section => (
                  <div key={section.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
                      <h3 className="font-bold text-lg text-slate-900">{section.title}</h3>
                      <p className="text-sm text-slate-600">
                        {section.lessons.filter(l => completedLessons.includes(l.id)).length} of {section.lessons.length} completed
                      </p>
                    </div>

                    <div className="divide-y divide-slate-200">
                      {section.lessons.map(lesson => (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonClick(lesson)}
                          className={`w-full px-6 py-4 text-left hover:bg-slate-50 transition-all flex items-center gap-4 ${
                            selectedLesson?.id === lesson.id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex-shrink-0">
                            {completedLessons.includes(lesson.id) ? (
                              <FaCheckCircle className="text-green-600 text-xl" />
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-slate-300"></div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className={`font-semibold ${
                              completedLessons.includes(lesson.id) ? 'text-slate-500 line-through' : 'text-slate-900'
                            }`}>
                              {lesson.title}
                            </p>
                            <p className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                              {lesson.type === 'video' ? <FaVideo /> : <FaBook />}
                              {lesson.duration}
                            </p>
                          </div>

                          <FaPlayCircle className="text-blue-600 flex-shrink-0 text-lg" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Player */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden sticky top-20">
                {selectedLesson ? (
                  <>
                    {/* Video Placeholder */}
                    <div className="w-full h-64 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <FaPlayCircle className="text-white text-6xl opacity-50" />
                    </div>

                    {/* Lesson Details */}
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-slate-900 mb-2">{selectedLesson.title}</h3>
                      <p className="text-sm text-slate-600 mb-4 flex items-center gap-2">
                        <FaClock /> {selectedLesson.duration}
                      </p>

                      <button
                        onClick={() => {
                          if (!completedLessons.includes(selectedLesson.id)) {
                            setCompletedLessons([...completedLessons, selectedLesson.id]);
                          }
                        }}
                        className={`w-full py-3 rounded-lg font-bold transition-all mb-3 ${
                          completedLessons.includes(selectedLesson.id)
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {completedLessons.includes(selectedLesson.id) ? '✓ Completed' : 'Mark as Complete'}
                      </button>

                      <div className="space-y-2 text-sm">
                        <p className="text-slate-600"><span className="font-semibold">Type:</span> {selectedLesson.type}</p>
                        <p className="text-slate-600"><span className="font-semibold">Status:</span> {completedLessons.includes(selectedLesson.id) ? '✓ Done' : 'In Progress'}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-8 h-96 flex items-center justify-center">
                    <div className="text-center">
                      <FaPlayCircle className="text-slate-300 text-5xl mx-auto mb-4" />
                      <p className="text-slate-600 font-semibold">Select a lesson to start learning</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Course Overview</h2>
            <p className="text-slate-700 leading-relaxed mb-6">{course.overview}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <p className="text-sm text-slate-600 font-semibold">Duration</p>
                <p className="text-2xl font-bold text-blue-600">{course.duration}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                <p className="text-sm text-slate-600 font-semibold">Total Lessons</p>
                <p className="text-2xl font-bold text-green-600">{course.lessons}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                <p className="text-sm text-slate-600 font-semibold">Rating</p>
                <p className="text-2xl font-bold text-purple-600">{course.rating}⭐</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                <p className="text-sm text-slate-600 font-semibold">Students</p>
                <p className="text-2xl font-bold text-orange-600">{course.students}</p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-4">What You'll Learn</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                <span>Master quadratic equations and solve complex algebraic problems</span>
              </li>
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                <span>Understand polynomial functions and graph complex polynomials</span>
              </li>
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                <span>Solve systems of linear and non-linear equations</span>
              </li>
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                <span>Apply algebra to real-world problem-solving scenarios</span>
              </li>
            </ul>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Course Resources</h2>

            <div className="space-y-4">
              {course.resources.map(resource => (
                <div key={resource.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
                  <div className="flex items-center gap-3">
                    <FaFileDownload className="text-blue-600 text-xl group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-semibold text-slate-900">{resource.title}</p>
                      <p className="text-sm text-slate-600">{resource.size}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseView;
