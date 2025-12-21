import {  FaCertificate, FaChartBar, FaCheckCircle, FaStar } from "react-icons/fa";

const CompletedCourseCard = ({ course }) => {
    return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all overflow-hidden">
      <div className={`bg-gradient-to-r ${course.color} text-white p-6`}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold mb-1">{course.title}</h3>
            <p className="text-white/90 text-sm">{course.subject}</p>
          </div>
          <FaCheckCircle className="text-3xl text-white" />
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
          <p className="text-sm font-semibold text-green-900">✓ Course Completed</p>
          <p className="text-xs text-green-700">{course.completionDate}</p>
        </div>

        <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Total Lessons</span>
            <span className="font-semibold text-slate-900">{course.totalLessons}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Final Score</span>
            <span className="font-bold text-lg text-green-600">{course.finalScore}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Feedback</span>
            <span className="font-semibold text-slate-900 flex items-center gap-2"><FaStar /> {course.feedback}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Type</span>
            <span className="font-semibold text-slate-900">{course.type}</span>
          </div>
        </div>

        <div className="flex gap-3">
          {course.certificate && (
            <button className="flex justify-center items-center gap-1 p-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-lg transition-all">
              <FaCertificate /> Download Certificate
            </button>
          )}
          <button className="flex justify-center items-center gap-1 p-2 border-2 border-slate-300 hover:bg-slate-100 rounded-lg transition-all text-slate-600 font-semibold">
            <FaChartBar /> View Report
          </button>
        </div>
      </div>
    </div>
)
};

export default CompletedCourseCard;