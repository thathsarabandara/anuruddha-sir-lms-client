import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { FaArrowRight, FaChartBar, FaGraduationCap, FaStar, FaVideo } from 'react-icons/fa';
import { HiEmojiHappy } from 'react-icons/hi';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Mrs. Kumari Perera',
      role: 'Parent of Kavindu Silva (Grade 5)',
      image: null,
      rating: 5,
      comment: 'My son Kavindu\'s grades improved from 65% to 92% in just 3 months! Anuruddha Sir\'s teaching methods are exceptional. The live classes are interactive, and the recorded sessions help Kavindu revise at his own pace. The progress tracking feature keeps us informed about his performance. We couldn\'t be happier with the results!',
      achievement: 'Improved from 65% to 92%',
      date: 'December 2024'
    },
    {
      id: 2,
      name: 'Mr. Pradeep Silva',
      role: 'Parent of Nethmi Silva (Grade 5)',
      image: null,
      rating: 5,
      comment: 'Nethmi was struggling with Mathematics, but after joining these classes, her confidence has soared! The interactive quizzes and instant feedback system help her understand where she needs improvement. Anuruddha Sir explains complex concepts in simple terms that children can easily grasp. Highly recommended for all parents!',
      achievement: 'Math score: 45% → 88%',
      date: 'November 2024'
    },
    {
      id: 3,
      name: 'Kaveesha Wickramasinghe',
      role: 'Student (Grade 5)',
      image: null,
      rating: 5,
      comment: 'I love attending Sir\'s classes! The way he explains difficult topics makes learning fun. I especially enjoy the quiz competitions and earning badges for my achievements. The recorded sessions are super helpful when I want to revise before exams. Thank you Sir for making learning enjoyable!',
      achievement: 'Top 10 in District',
      date: 'December 2024'
    },
    {
      id: 4,
      name: 'Mrs. Nadeeka Fernando',
      role: 'Parent of Tharindu Fernando (Grade 5)',
      image:  null,
      rating: 5,
      comment: 'The platform is user-friendly, and my son can access all materials easily. The live Zoom classes feel like a real classroom experience. The payment options are flexible - we can pay through bank transfer, which is very convenient. The certificate system motivates my son to work harder. Excellent service!',
      achievement: 'Perfect Attendance Badge',
      date: 'October 2024'
    },
    {
      id: 6,
      name: 'Mr. Chaminda Rajapaksha',
      role: 'Parent of Dinuli Rajapaksha (Grade 5)',
      image: null,
      rating: 5,
      comment: 'Worth every rupee! The comprehensive study materials, regular assessments, and personalized attention have made a huge difference. Dinuli\'s comprehension skills have improved tremendously. The teachers are always available to clarify doubts. This platform is a blessing for working parents like us!',
      achievement: 'Sinhala Language Excellence',
      date: 'November 2024'
    },
    {
      id: 7,
      name: 'Mrs. Sanduni Jayawardena',
      role: 'Parent of Twin Brothers (Grade 5)',
      image: null,
      rating: 5,
      comment: 'I have twin boys, and both are enrolled. The individual progress tracking for each child is fantastic! They can learn at their own pace, and the competitive element between them actually motivates them to study more. The reward system with coins and gems keeps them engaged. Best investment in their education!',
      achievement: 'Both in Top 20',
      date: 'December 2024'
    },
    {
      id: 8,
      name: 'Himasha Liyanage',
      role: 'Student (Grade 5)',
      image: null,
      rating: 5,
      comment: 'I was weak in Science, but Sir\'s experiments and visual explanations made it my favorite subject! The recorded sessions are like having a private tutor. I can pause, rewind, and watch again until I understand. The community of friends I made in class is also amazing. We study together and help each other!',
      achievement: 'Science Master Badge',
      date: 'October 2024'
    },
    {
      id: 9,
      name: 'Mr. Ruwan Amarasekara',
      role: 'Parent of Senuda Amarasekara (Grade 5)',
      image: null,
      rating: 5,
      comment: 'The structured curriculum and systematic approach to teaching are impressive. Senuda\'s attendance is tracked, assignments are graded promptly, and we receive regular reports. The live interaction during classes ensures students stay engaged. The platform has everything needed for scholarship exam preparation. Absolutely satisfied!',
      achievement: 'Consistent 90%+ Scores',
      date: 'November 2024'
    },
    {
      id: 10,
      name: 'Malsha Kumarasinghe',
      role: 'Student (Grade 5)',
      image: null,
      rating: 5,
      comment: 'The English classes have improved my vocabulary and grammar so much! I can now write better essays and understand reading comprehension easily. The digital certificates I earned are displayed in my profile, and I\'m so proud of them! Thank you Sir for your dedication and patience. You\'re the best teacher ever!',
      achievement: 'English Excellence Award',
      date: 'December 2024'
    },
  ];

  const stats = [
    { number: '500+', label: 'Happy Parents', icon: HiEmojiHappy },
    { number: '1,247+', label: 'Satisfied Students', icon: FaGraduationCap },
    { number: '4.9/5', label: 'Average Rating', icon: FaStar },
    { number: '98%', label: 'Success Rate', icon: FaChartBar },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Student & Parent Testimonials</h1>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Hear directly from our students and parents about their learning experience 
            and success stories with Anuruddha Sir's scholarship program
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl mb-3"><stat.icon className="mx-auto text-5xl text-primary-600" /></div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="card bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-3xl mr-4">
                      {testimonial.image == null ? (<h1 className="text-white">{testimonial.name.charAt(0)}</h1>) : (testimonial.image)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-4 italic">"{testimonial.comment}"</p>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {testimonial.achievement}
                    </span>
                    <span className="text-xs text-gray-500">{testimonial.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Video Testimonials</h2>
            <p className="text-xl text-gray-600">Coming Soon - Watch success stories</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card bg-gray-100">
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-6xl"><FaVideo /></span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Success Story #{i}</h4>
                <p className="text-gray-600 text-sm">Video testimonial coming soon...</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join Our Success Stories!
          </h2>
          <p className="text-xl text-primary-100 mb-6">
            Be the next success story. Start your learning journey today!
          </p>
          <Link
            to={ROUTES.REGISTER}
            className="inline-block bg-white text-primary-600 hover:bg-yellow-300 font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Register Now - Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
