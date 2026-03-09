import { FaStar, FaShoppingCart, FaBookOpen } from "react-icons/fa";
import { IoTimeSharp } from "react-icons/io5";
import {cartAPI} from '../../api/cartApi';

const handleAddCart = async (courseId) => {
  try {
    const response = await cartAPI.addToCart(courseId);
    if (response.data.success) {
      alert("Course added to cart successfully!");
    } else {
      alert(response.data.message || "Failed to add to cart");
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert(error.response?.data?.message || "Error adding to cart");
  }
}

const NewCourseCard = ({ course }) => (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all overflow-hidden group">
      <div className={`bg-gradient-to-r ${course.color} text-white p-6`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1 h-16 overflow-hidden">{course.title}</h3>
            <p className="text-white/90 text-sm">{course.subject}</p>
          </div>
          <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white">
            {course.badge}
          </span>
        </div>
      </div>

      <div className="p-6">
        <p className="text-sm text-slate-600 mb-4 max-h-16 overflow-hidden">{course.description}</p>

        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            <span className="font-semibold text-slate-900">{course.rating || 'N/A'}</span>
            <span className="text-xs text-slate-500">({course.students || 0} students)</span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {course.duration && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Duration</span>
              <span className="font-semibold text-slate-900 flex items-center justify-center gap-2"><IoTimeSharp /> {course.duration}</span>
            </div>
          )}
          {course.lessons && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Lessons</span>
              <span className="font-semibold text-slate-900 flex items-center justify-center gap-2"><FaBookOpen /> {course.lessons}</span>
            </div>
          )}
          {course.grade && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Grade</span>
              <span className="font-semibold text-slate-900">Grade {course.grade}</span>
            </div>
          )}
          {course.type && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Type</span>
              <span className="font-semibold text-slate-900">{course.type}</span>
            </div>
          )}
          {course.instructor && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Instructor</span>
              <span className="font-semibold text-slate-900">{course.instructor}</span>
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="text-2xl font-bold text-slate-900">{course.priceText}</div>
          <div className="text-xs text-slate-500">per course</div>
        </div>

        <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          onClick={() => handleAddCart(course.id)}
        >
          <FaShoppingCart /> Add to Cart
        </button>
      </div>
    </div>
  );

export default NewCourseCard;