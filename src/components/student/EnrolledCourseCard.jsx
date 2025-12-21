import { FaChartBar, FaClock, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EnrolledCourseCard = ({ course }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all overflow-hidden">
      <div className={`bg-gradient-to-r ${course.color} text-white p-6`}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold mb-1">{course.title}</h3>
            <p className="text-white/90 text-sm">{course.subject}</p>
          </div>
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 p y-1 rounded-full">
            <FaStar className="text-yellow-300 text-sm" />
            <span className="text-sm font-bold">{course.rating}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-900">Progress</span>
            <span className="text-sm font-bold text-slate-900">{course.progress}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${course.color} transition-all duration-500`}
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Lessons</span>
            <span className="font-semibold text-slate-900">{course.lessonsCompleted}/{course.totalLessons}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Next Class</span>
            <span className="font-semibold text-slate-900 flex items-center gap-1"><FaClock /> {course.nextClass}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Enrolled</span>
            <span className="font-semibold text-slate-900">{course.enrolledDate}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Type</span>
            <span className="font-semibold text-slate-900">{course.type}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => navigate(`/student/course/${course.id}`)}
            className="flex-1 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg transition-all">
            Continue Learning
          </button>
          <button className="px-4 py-2 border-2 border-slate-300 hover:bg-slate-100 rounded-lg transition-all text-slate-600 font-semibold flex items-center gap-2">
            <FaChartBar /> View Stats
          </button>
        </div>
      </div>
    </div>
  )}
  ;

export default EnrolledCourseCard;