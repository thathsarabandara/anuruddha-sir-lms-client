
import { FaClock } from "react-icons/fa"

const ProgressStat = ({ name, sinhala, progress, color, icon:Icon, totalLessons, completedLessons, avgQuizScore, nextClass }) => {
 

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300 overflow-hidden group"
    >
      {/* Color Header */}
      <div className={`h-1 bg-gradient-to-r ${color}`}></div>

      {/* Card Content */}
      <div className="p-6">
        {/* Subject Title */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{name}</h3>
              <p className="text-sm text-slate-500">{sinhala}</p>
            </div>
            {Icon && <Icon className="text-3xl" />}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">Progress</span>
            <span className="text-sm font-bold text-slate-900">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${color} transition-all duration-500`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-slate-200">
          <div>
            <p className="text-xs text-slate-500">Lessons</p>
            <p className="text-lg font-bold text-slate-900">{completedLessons}/{totalLessons}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Avg Score</p>
            <p className="text-lg font-bold text-slate-900">{avgQuizScore}%</p>
          </div>
        </div>

        {/* Next Class */}
        <div className="flex items-center text-xs text-slate-600 pt-3 border-t border-slate-200">
          <FaClock className="mr-2 text-slate-400" />
          <span>{nextClass}</span>
        </div>
      </div>
    </div>
  )
}

export default ProgressStat