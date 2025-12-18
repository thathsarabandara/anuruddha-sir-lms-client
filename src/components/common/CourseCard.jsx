import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { FaCheck, FaClock, FaVideo, FaStar } from 'react-icons/fa';

const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}
            size={14}
          />
        ))}
      </div>
    );
  };

const CourseCard = ({ course }) => {
  return (
    <div 
        data-course-card
        key={course.id} 
        className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 overflow-hidden group relative"
    >
        {/* Badge */}
        {course.badge && (
            <div className="absolute top-4 right-4 z-10">
                <div className="bg-yellow-400 text-yellow-900 font-bold px-3 py-1 rounded-full text-xs">
                    {course.badge}
                </div>
            </div>
        )}

        {/* Header */}
        <div className={`bg-gradient-to-br ${course.color} text-white p-6 relative overflow-hidden h-56`}>
            {course.img && (<img src={course.img} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-50" />)}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-pattern"></div>
            </div>
            <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                <p className="text-white/90 text-sm">{course.description}</p>
            </div>
        </div>
                
        {/* Body */}
        <div className="p-6">
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
                {renderStars(course.rating)}
                <span className="text-sm text-gray-600">({course.reviews})</span>
            </div>

            {/* Duration & Classes */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600 pb-4 border-b">
                    <span className="flex items-center gap-1">
                      <FaClock className="text-primary-600" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaVideo className="text-primary-600" />
                      {course.classes}
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-1">
                      <div className="text-3xl font-bold text-gray-900">
                        {course.price}
                      </div>
                      <div className="text-sm text-gray-500 line-through">
                        {course.originalPrice}
                      </div>
                    </div>
                    <div className="text-xs text-green-600 font-semibold">
                      Save Rs. {parseInt(course.originalPrice.replace(/\D/g, '')) - parseInt(course.price.replace(/\D/g, ''))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2.5 mb-6 min-h-40">
                    {course.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-700 gap-2">
                        <FaCheck className="text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <Link
                    to={ROUTES.REGISTER}
                    className="block w-full text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 group-hover:from-primary-700 group-hover:to-primary-800"
                  >
                    Enroll Now
                  </Link>
                </div>
              </div>
  );
}
export default CourseCard;