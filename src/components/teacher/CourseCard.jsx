import { FaUsers, FaDollarSign, FaChartLine, FaClock, FaEye, FaEdit, FaTrash, FaBook, FaCheckCircle } from "react-icons/fa"
import { useNavigate } from "react-router-dom";

export const CourseCard = ({ course, confirmDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="relative h-48 w-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
              {course.thumbnail ? (
                <>
                  <img 
                    src={course.thumbnail.startsWith('http') ? course.thumbnail : `http://localhost:8000${course.thumbnail}`} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('flex', 'items-center', 'justify-center'); }}
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-white text-6xl group-hover:scale-110 transition-transform duration-300">
                  <FaBook />
                </div>
              )}
              
              {/* Status Badge */}
              <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${
                course.status === 'PUBLISHED' ? 'bg-green-500/90 text-white' :
                course.status === 'DRAFT' ? 'bg-yellow-500/90 text-white' :
                'bg-gray-500/90 text-white'
              }`}>
                {course.status}
              </div>

              {/* Approval Badge */}
              {course.is_approved && (
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500/90 text-white flex items-center gap-1 shadow-lg backdrop-blur-sm">
                  <FaCheckCircle className="text-xs" /> Approved
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="px-5 py-5">
              <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
              
              {/* Subject & Grade Badges */}
              <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
                {course.subject && (
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full font-medium text-xs border border-blue-200">{course.subject}</span>
                )}
                {course.grade_level && (
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full font-medium text-xs border border-purple-200">{course.grade_level}</span>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{course.description}</p>

              {/* Stats - Enhanced */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 mb-4 border border-gray-200">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Students</span>
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-blue-500 text-sm" />
                      <span className="font-bold text-gray-900">{course.total_enrollments}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Price</span>
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="text-green-500 text-sm" />
                      <span className="font-bold text-gray-900">
                        {course.price_type === 'FREE' ? 'Free' : `Rs. ${parseFloat(course.price).toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Rating</span>
                    <div className="flex items-center gap-2">
                      <FaChartLine className="text-yellow-500 text-sm" />
                      <span className="font-bold text-gray-900">{parseFloat(course.average_rating).toFixed(1)} ⭐</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Date</span>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-purple-500 text-sm" />
                      <span className="font-bold text-gray-900 text-xs">{new Date(course.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/teacher/courses/${course.id}?mode=view`)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <FaEye className="text-xs" /> View
                </button>
                <button
                  onClick={() => navigate(`/teacher/courses/${course.id}?mode=edit`)}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <FaEdit className="text-xs" /> Edit
                </button>
                <button
                  onClick={() => confirmDelete(course.id)}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                  title="Delete course"
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>
            </div>
    </div>
  );
}

export default CourseCard;