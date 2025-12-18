import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ROUTES } from '../../utils/constants';
import { FaAward, FaBook, FaGraduationCap, FaLanguage, FaLightbulb, FaTrophy, FaQuoteLeft, FaStar } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const heroText = containerRef.current?.querySelector('[data-hero-text]');
    const heroImage = containerRef.current?.querySelector('[data-hero-image]');
    const heroBtn = containerRef.current?.querySelector('[data-hero-btn]');
    const experienceCards = containerRef.current?.querySelectorAll('[data-experience-card]');
    const achievementCards = containerRef.current?.querySelectorAll('[data-achievement-card]');
    const philosophyItems = containerRef.current?.querySelectorAll('[data-philosophy-item]');

    // Hero animations
    gsap.fromTo(heroText, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1, ease: 'power2.out', delay: 0.2 });
    gsap.fromTo(heroImage, { opacity: 0, scale: 0.8, x: 50 }, { opacity: 1, scale: 1, x: 0, duration: 1, ease: 'back.out', delay: 0.4 });
    gsap.fromTo(heroBtn, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.6 });

    // Experience cards
    gsap.fromTo(
      experienceCards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: experienceCards[0]?.parentElement, start: 'top 80%', toggleActions: 'play none none none' },
      }
    );

    // Achievement cards
    gsap.fromTo(
      achievementCards,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out',
        scrollTrigger: { trigger: achievementCards[0]?.parentElement, start: 'top 80%', toggleActions: 'play none none none' },
      }
    );

    // Philosophy items
    gsap.fromTo(
      philosophyItems,
      { opacity: 0, x: -40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: { trigger: philosophyItems[0]?.parentElement, start: 'top 80%', toggleActions: 'play none none none' },
      }
    );

    // Page load fade-in
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power1.out' }
    );

    // Stats items (animate on load with slight stagger)
    const statsItems = containerRef.current?.querySelectorAll('[data-stats-item]');
    if (statsItems?.length) {
      gsap.fromTo(
        statsItems,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out', delay: 0.2 }
      );
    }

    // CTA buttons animation
    const ctaBtns = containerRef.current?.querySelectorAll('[data-cta-btn]');
    if (ctaBtns?.length) {
      gsap.fromTo(
        ctaBtns,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(1.2)', delay: 0.4 }
      );
    }

    return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }, []);

  return (
    <div ref={containerRef}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div data-hero-text>
              <div className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-6">
                Meet Your Mentor
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Anuruddha Sir
                <span className="block text-primary-600 text-4xl mt-2">Grade 5 Excellence Specialist</span>
              </h1>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                A dedicated educator with over 15 years of experience in Grade 5 Scholarship examination preparation. 
                Transforming students' futures through passion, expertise, and innovative teaching.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                With a proven track record of helping 500+ students achieve outstanding results, 
                Anuruddha Sir combines traditional teaching wisdom with cutting-edge educational technology 
                to create an engaging and transformative learning experience.
              </p>
              <Link 
                data-hero-btn
                to={ROUTES.REGISTER} 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-lg font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Join Our Classes
              </Link>
            </div>
            <div data-hero-image className="flex justify-center relative">
              <div className="relative w-90 h-90">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl transform -rotate-6"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-300 to-secondary-400 rounded-3xl flex items-center justify-center relative z-10">
                  <img src='/assets/images/about/about.png' alt="Anuruddha Sir" className="object-cover rounded-3xl shadow-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Teaching Experience</h2>
            <p className="text-xl text-gray-600">Mastering education through innovation and dedication</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: FaLanguage, title: 'Subject Expertise', desc: 'Specialized in all subjects for Grade 5 Scholarship: Sinhala, Mathematics, Environment, and English.' },
              { icon: FaAward, title: 'Result-Oriented', desc: '95% of students achieve distinction marks under our guidance with systematic preparation and care.' },
              { icon: FaLightbulb, title: 'Modern Methods', desc: 'Incorporating interactive technology and gamification to make learning engaging and enjoyable.' }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div data-experience-card key={idx} className="card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <Icon className="text-3xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Achievements & Recognition</h2>
            <p className="text-xl text-gray-600">Recognized excellence in education</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { icon: FaTrophy, title: 'Top Educator Award', desc: 'Recognized as one of the leading Grade 5 Scholarship teachers in the region.' },
              { icon: FaGraduationCap, title: '500+ Successful Students', desc: 'Helped over 500 students pass the scholarship examination with flying colors.' },
              { icon: FaBook, title: 'Published Materials', desc: 'Author of comprehensive study guides used by thousands of students nationwide.' },
              { icon: FaStar, title: 'Parent Satisfaction', desc: 'Consistently rated 5 stars by parents for teaching quality and student care.' }
            ].map((item, idx) => {
              const Icon = typeof item.icon === 'string' ? null : item.icon;
              return (
                <div data-achievement-card key={idx} className="card bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex items-start">
                    {Icon ? <Icon className="text-4xl text-primary-600 mr-4 mt-1 flex-shrink-0" /> : <div className="text-4xl mr-4 mt-1 flex-shrink-0">{item.icon}</div>}
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Teaching Philosophy */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Teaching Philosophy</h2>
            <p className="text-xl text-gray-600">Core principles that drive our approach</p>
          </div>
          <div className="space-y-6">
            {[
              { title: 'Every child can excel', desc: 'with the right guidance and support. My approach focuses on building strong fundamentals while nurturing confidence, curiosity, and a love for learning.' },
              { title: 'Interactive learning', desc: 'is at the heart of our methodology. Students are encouraged to ask questions, participate actively, and learn from each other in a supportive environment.' },
              { title: 'Consistent practice', desc: 'combined with personalized feedback ensures steady improvement. Regular assessments help identify and address learning gaps early for better outcomes.' },
              { title: 'Technology integration', desc: 'makes learning engaging and accessible. Our platform combines traditional teaching excellence with modern tools for optimal learning results.' }
            ].map((item, idx) => (
              <div data-philosophy-item key={idx} className="card bg-gradient-to-r from-primary-50 to-secondary-50 hover:shadow-lg transition-all duration-300 border-l-4 border-primary-600">
                <div className="flex gap-4">
                  <FaQuoteLeft className="text-3xl text-primary-600 flex-shrink-0 mt-2" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '15+', label: 'Years Experience' },
              { number: '500+', label: 'Students Taught' },
              { number: '98%', label: 'Success Rate' },
              { number: '5', label: 'Parent Rating' }
            ].map((stat, idx) => (
              <div key={idx} data-stats-item>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-primary-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Start Your Success Journey Today</h2>
          <p className="text-xl mb-8 text-primary-100">
            Join our community of 1000+ students who have transformed their academic futures
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to={ROUTES.REGISTER} 
              data-cta-btn
              className="inline-flex items-center justify-center bg-white text-primary-600 hover:bg-yellow-300 font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Register Now
            </Link>
            <Link 
              to={ROUTES.CONTACT} 
              data-cta-btn
              className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-4 px-8 rounded-lg transition-all duration-300"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
