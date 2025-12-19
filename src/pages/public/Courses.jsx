import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ROUTES } from '../../utils/constants';
import { FaBook, FaCheck, FaClock, FaFilePdf, FaVideo, FaStar, FaPlayCircle } from 'react-icons/fa';
import CourseCard from '../../components/common/CourseCard';

gsap.registerPlugin(ScrollTrigger);

const Courses = () => {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const containerRef = useRef(null);

  const courses = [
    {
      id: 1,
      title: 'Complete Scholarship Package',
      img: '/assets/images/courses/hero.jpeg ',
      subject: 'all',
      description: 'Comprehensive coverage of all subjects for Grade 5 Scholarship',
      duration: '6 Months',
      classes: '48 Live Classes',
      price: 'Rs. 15,000',
      originalPrice: 'Rs. 18,000',
      rating: 4.9,
      reviews: 247,
      features: ['All Subjects', 'Live Classes', 'Recorded Sessions', 'Study Materials', 'Mock Exams'],
      color: 'from-primary-600 to-primary-700',
      badge: 'Most Popular',
    },
    {
      id: 2,
      title: 'Sinhala Language & Literature',
      subject: 'sinhala',
      description: 'Master Sinhala language skills with comprehensive grammar and comprehension',
      duration: '3 Months',
      classes: '24 Live Classes',
      price: 'Rs. 8,000',
      originalPrice: 'Rs. 10,000',
      rating: 4.8,
      reviews: 156,
      features: ['Grammar Mastery', 'Essay Writing', 'Comprehension', 'Practice Papers'],
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 3,
      title: 'Mathematics Excellence',
      subject: 'maths',
      description: 'Build strong mathematical foundation with problem-solving techniques',
      duration: '3 Months',
      classes: '24 Live Classes',
      price: 'Rs. 8,000',
      originalPrice: 'Rs. 10,000',
      rating: 4.9,
      reviews: 189,
      features: ['Basic to Advanced', 'Problem Solving', 'Mental Math', 'Speed Techniques'],
      color: 'from-green-500 to-green-600',
    },
    {
      id: 4,
      title: 'Environment Studies',
      subject: 'environment',
      description: 'Explore Sri Lankan environment, history, and general knowledge',
      duration: '3 Months',
      classes: '24 Live Classes',
      price: 'Rs. 8,000',
      originalPrice: 'Rs. 10,000',
      rating: 4.7,
      reviews: 124,
      features: ['Geography', 'History', 'Science', 'Current Affairs'],
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      id: 5,
      title: 'English Language',
      subject: 'english',
      description: 'Improve English communication and comprehension skills',
      duration: '3 Months',
      classes: '24 Live Classes',
      price: 'Rs. 8,000',
      originalPrice: 'Rs. 10,000',
      rating: 4.8,
      reviews: 167,
      features: ['Grammar', 'Vocabulary', 'Reading', 'Writing'],
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 6,
      title: 'Intensive Revision Program',
      subject: 'all',
      description: 'Last-minute comprehensive revision with mock exams',
      duration: '1 Month',
      classes: '12 Live Classes',
      price: 'Rs. 5,000',
      originalPrice: 'Rs. 7,000',
      rating: 4.9,
      reviews: 298,
      features: ['All Subjects', 'Mock Exams', 'Doubt Clearing', 'Exam Tips'],
      color: 'from-red-500 to-red-600',
      badge: 'Best Value',
    },
  ];

  const subjects = [
    { id: 'all', name: 'All Courses' },
    { id: 'sinhala', name: 'Sinhala' },
    { id: 'maths', name: 'Mathematics' },
    { id: 'environment', name: 'Environment' },
    { id: 'english', name: 'English' },
  ];

  const filteredCourses = selectedSubject === 'all' 
    ? courses 
    : courses.filter(course => course.subject === selectedSubject || course.subject === 'all');

  useEffect(() => {
    const headerTitle = containerRef.current?.querySelector('[data-header-title]');
    const subjectButtons = containerRef.current?.querySelectorAll('[data-subject-btn]');
    const courseCards = containerRef.current?.querySelectorAll('[data-course-card]');
    const featureItems = containerRef.current?.querySelectorAll('[data-feature-item]');

    gsap.fromTo(headerTitle, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });

    gsap.fromTo(
      subjectButtons,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out', delay: 0.2 }
    );

    gsap.fromTo(
      courseCards,
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out',
      }
    );

    gsap.fromTo(
      featureItems,
      { opacity: 0, x: -40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: featureItems[0]?.parentElement,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }, [selectedSubject]);


  return (
    <div ref={containerRef}>
      {/* Header */}
      <section className="relative py-24 overflow-hidden h-96">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src='/assets/images/courses/hero.jpeg' 
            alt="Services Hero" 
            className='w-full h-full object-cover'
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 via-secondary-900/70 to-primary-900/80"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Our Comprehensive Courses
          </h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
            Structured programs designed to help students excel in Grade 5 Scholarship examination. Explore our range of courses tailored to meet diverse learning needs.
          </p>
        </div>

        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-400/20 rounded-full blur-3xl"></div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {subjects.map((subject) => (
              <button
                data-subject-btn
                key={subject.id}
                onClick={() => setSelectedSubject(subject.id)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 transform ${
                  selectedSubject === subject.id
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What's Included in Every Course
            </h2>
            <p className="text-xl text-gray-600">Premium features for maximum learning impact</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FaVideo, title: 'Live Classes', desc: 'Interactive Zoom sessions with Q&A' },
              { icon: FaBook, title: 'Study Materials', desc: 'Comprehensive notes and worksheets' },
              { icon: FaFilePdf, title: 'Regular Quizzes', desc: 'Track progress with assessments' },
              { icon: FaPlayCircle, title: 'Recordings', desc: 'Access class recordings anytime' }
            ].map((item, idx) => {
              const IconComponent = typeof item.icon === 'string' ? null : item.icon;
              return (
                <div data-feature-item key={idx} className="card text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50">
                  {IconComponent ? <IconComponent className="text-5xl mx-auto mb-4 text-primary-600" /> : <div className="text-5xl mx-auto mb-4">{item.icon}</div>}
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-4">Not Sure Which Course to Choose?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Our experts will help you find the perfect learning path
          </p>
          <Link 
            to={ROUTES.CONTACT} 
            className="inline-flex items-center gap-2 bg-white text-primary-600 hover:bg-yellow-300 font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Get Personalized Recommendations
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Courses;
