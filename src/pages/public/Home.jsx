import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ROUTES } from '../../utils/constants';
import { PiBookOpenBold, PiChalkboardTeacherBold, PiChartBarBold, PiCreditCardBold, PiGraduationCapBold, PiNotebookBold, PiStudentBold, PiTrophyBold, PiVideoCamera, PiVideoCameraBold } from 'react-icons/pi';
import { FaChartBar, FaGraduationCap, FaLightbulb, FaStar, FaPlay, FaMedal } from 'react-icons/fa';
import { TbTarget } from 'react-icons/tb';
import { GrUserExpert } from 'react-icons/gr';
import { CiMobile3 } from 'react-icons/ci';
import { IoChatbox } from 'react-icons/io5';
import { FaSackDollar } from 'react-icons/fa6';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const containerRef = useRef(null);
  const testimonialsRef = useRef(null);

  useEffect(() => {
    const heroTitle = containerRef.current?.querySelector('[data-hero-title]');
    const heroSubtitle = containerRef.current?.querySelector('[data-hero-subtitle]');
    const heroButtons = containerRef.current?.querySelectorAll('[data-hero-btn]');
    const statsCards = containerRef.current?.querySelectorAll('[data-stat-card]');
    const heroStory = containerRef.current?.querySelector('[data-hero-story]');
    const storyImage = containerRef.current?.querySelector('[data-story-image]');
    const featureCards = containerRef.current?.querySelectorAll('[data-feature-card]');
    const subjectCards = containerRef.current?.querySelectorAll('[data-subject-card]');
    const testimonialCards = containerRef.current?.querySelectorAll('[data-testimonial-card]');

    gsap.fromTo(
      heroTitle,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 1 }
    );

    gsap.fromTo(
      heroSubtitle,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 1 }
    );

    gsap.fromTo(
      heroButtons,
      { opacity: 0, y: 20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out', delay: 0.6 }
    );

    gsap.fromTo(
      statsCards,
      { opacity: 0, scale: 0.8, y: 40 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out',
        scrollTrigger: {
          trigger: statsCards[0]?.parentElement,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    gsap.fromTo(
      heroStory,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: heroStory,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    gsap.fromTo(
      storyImage,
      { opacity: 0, x: 50, scale: 0.9 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1,
        ease: 'back.out',
        scrollTrigger: {
          trigger: storyImage,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    gsap.fromTo(
      featureCards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: featureCards[0]?.parentElement,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    gsap.fromTo(
      subjectCards,
      { opacity: 0, y: 40, rotationX: 20 },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: subjectCards[0]?.parentElement,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    gsap.fromTo(
      testimonialCards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: testimonialCards[0]?.parentElement,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    const youtubeCards = containerRef.current?.querySelectorAll('[data-youtube-card]');
    gsap.fromTo(
      youtubeCards,
      { opacity: 0, scale: 0.85, y: 40 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out',
        scrollTrigger: {
          trigger: youtubeCards?.[0]?.parentElement,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    const faqItems = containerRef.current?.querySelectorAll('[data-faq-item]');
    gsap.fromTo(
      faqItems,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: faqItems?.[0]?.parentElement,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      }
    );

    const whyChooseCards = containerRef.current?.querySelectorAll('[data-why-choose-card]');
    gsap.fromTo(
      whyChooseCards,
      { opacity: 0, y: 50, rotationZ: -5 },
      {
        opacity: 1,
        y: 0,
        rotationZ: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'back.out',
        scrollTrigger: {
          trigger: whyChooseCards?.[0]?.parentElement,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      }
    );

    const howItWorksCards = containerRef.current?.querySelectorAll('[data-how-it-works-card]');
    gsap.fromTo(
      howItWorksCards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: howItWorksCards?.[0]?.parentElement,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    const decorElements = containerRef.current?.querySelectorAll('[data-decor-element]');
    decorElements?.forEach((element) => {
      gsap.to(element, {
        y: 20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  useEffect(() => {
    const el = testimonialsRef.current;
    if (!el) return;

    el._isPaused = false;

    const getGap = () => {
      const gap = getComputedStyle(el).gap;
      return gap ? parseInt(gap) : 32;
    };

    const step = () => {
      if (!el || el._isPaused) return;
      const card = el.querySelector('.testimonial-card');
      if (!card) return;

      const gap = getGap();
      const scrollAmount = card.offsetWidth + gap;
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = el.scrollLeft - el.scrollWidth / 2;
      }

      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    const interval = setInterval(step, 3000);

    const onVisibility = () => { el._isPaused = document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // Simple slideshow for the hero story image
  const [currentSlide, setCurrentSlide] = useState(0);
  const storySlides = [
    '/assets/images/home/image-slider/img1.jpeg',
    '/assets/images/home/image-slider/img5.jpeg',
    '/assets/images/home/image-slider/img3.jpeg',
    '/assets/images/home/image-slider/img2.jpeg',
  ];

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % storySlides.length);
    }, 3800);
    return () => clearInterval(id);
  }, [storySlides.length]);

  return (
    <div ref={containerRef}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-24 overflow-hidden min-h-screen">
        <div className="absolute inset-0 bg-black/5"></div>
        
        {/* Animated Background Elements */}
        <div data-decor-element className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-10"></div>
        <div data-decor-element className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-300 rounded-full opacity-10 delay-1000"></div>
        <img src='/assets/images/home-hero.png' alt='background pattern' className='absolute inset-0 w-full h-full object-cover opacity-35'/>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-white rounded-full opacity-5 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-10 sm:mt-20 lg:mt-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 data-hero-title className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Master Grade 5 Scholarship
              <span className="block text-yellow-300 mt-2">with Anuruddha Sir</span>
            </h1>
            <p data-hero-subtitle className="text-xl md:text-2xl mb-8 text-primary-100 leading-relaxed">
              Join 1,247+ students achieving excellence with proven teaching methods, 
              live interactive classes, and comprehensive study materials
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                data-hero-btn 
                to={ROUTES.STUDENT_REGISTER} 
                className="bg-white text-primary-600 hover:bg-yellow-300 hover:text-primary-700 font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Start Learning Free
              </Link>
              <Link 
                data-hero-btn 
                to={ROUTES.COURSES} 
                className="bg-transparent border-2 border-white hover:bg-white hover:text-primary-600 font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '1,247+', label: 'Active Students', icon: PiStudentBold, color: 'from-blue-500 to-blue-600' },
              { number: '18+', label: 'Expert Teachers', icon: PiChalkboardTeacherBold, color: 'from-green-500 to-green-600' },
              { number: '45+', label: 'Quality Courses', icon: PiBookOpenBold , color: 'from-purple-500 to-purple-600' },
              { number: '98%', label: 'Success Rate', icon: PiTrophyBold, color: 'from-yellow-500 to-yellow-600' },
            ].map((stat, index) => (
              <div data-stat-card key={index} className="text-center transform hover:scale-110 transition-all duration-300 cursor-pointer">
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${stat.color} rounded-2xl mb-4 shadow-lg`}>
                  <stat.icon className="text-4xl text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Story Section - Kid-Friendly */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div data-hero-story className="space-y-6">
              <div className="inline-block px-4 py-2 bg-yellow-200 text-yellow-800 rounded-full font-bold text-sm">
                <FaStar className="inline-block mr-2" /> Success Stories
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Students Achieving Their Dreams
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                From struggling with concepts to topping the class! Our students transform their academic journey with Anuruddha Sir's personalized coaching.
              </p>
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <span className="text-3xl"><FaChartBar className='text-gray-900' /></span>
                  <div>
                    <h3 className="font-bold text-gray-900">Grade Improvement</h3>
                    <p className="text-gray-600">Average improvement of 25-40% in grades</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-3xl"><FaLightbulb className='text-gray-900' /></span>
                  <div>
                    <h3 className="font-bold text-gray-900">Concept Mastery</h3>
                    <p className="text-gray-600">Deep understanding, not just exam tips</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-3xl"><FaGraduationCap className='text-gray-900' /></span>
                  <div>
                    <h3 className="font-bold text-gray-900">Scholarship Ready</h3>
                    <p className="text-gray-600">Fully prepared for the big day</p>
                  </div>
                </div>
              </div>
            </div>
            <div data-story-image className="relative">
                <div className="relative w-full aspect-square bg-gradient-to-br from-blue-200 to-purple-200 rounded-3xl overflow-hidden shadow-2xl">
                  <div data-story-image className="absolute inset-0">
                    {storySlides.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`Story slide ${idx + 1}`}
                        className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-700 ease-in-out ${
                          idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                      />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-4 right-4 bg-white rounded-full p-4 shadow-lg">
                    </div>

                    {/* dots */}
                    <div className="absolute left-4 bottom-4 flex gap-2">
                      {storySlides.map((_, d) => (
                        <button
                          key={d}
                          onClick={() => setCurrentSlide(d)}
                          aria-label={`Go to slide ${d + 1}`}
                          className={`w-2 h-2 rounded-full ${
                            d === currentSlide ? 'bg-white' : 'bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Images */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Kids Love Learning Here
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fun, interactive, and effective learning experience designed for young minds
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: PiVideoCameraBold,
                title: 'Live Interactive Classes',
                description: 'Fun Zoom sessions with real-time Q&A',
                image: '/assets/images/home/features/features1.png',
                color: 'from-blue-500/80'
              },
              {
                icon: PiVideoCamera,
                title: 'Recorded Sessions',
                description: 'Learn anytime, anywhere at your pace',
                image: '/assets/images/home/features/features2.png',
                color: 'from-purple-500/80'
              },
              {
                icon: PiNotebookBold,
                title: 'Interactive Quizzes',
                description: 'Gamified learning with instant feedback',
                image: '/assets/images/home/features/features3.png',
                color: 'from-green-500/80'
              },
              {
                icon: PiChartBarBold,
                title: 'Progress Tracking',
                description: 'See improvement with fun analytics',
                image: '/assets/images/home/features/features4.png',
                color: 'from-yellow-500/80'
              },
              {
                icon: PiGraduationCapBold,
                title: 'Digital Certificates',
                description: 'Earn badges and certificates',
                image: '/assets/images/home/features/features5.png',
                color: 'from-red-500/80'
              },
              {
                icon: PiCreditCardBold,
                title: 'Flexible Payments',
                description: 'Easy, affordable payment options',
                image: '/assets/images/home/features/features6.png',
                color: 'from-indigo-500/80'
              },
            ].map((feature, index) => (
              <div data-feature-card key={index} className=" hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden group w- h-96 rounded-2xl">
               <div className="relative h-full overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Bottom-to-middle abstract gradient overlay (reveals on hover) */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-2/3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t ${feature.color} to-transparent`}
                    aria-hidden
                  />

                  {/* Floating icon */}
                  <div className={`absolute top-4 right-4 ${feature.color} rounded-full p-3 shadow-lg z-10`}>
                    <feature.icon className="text-2xl text-white" />
                  </div>

                  {/* Overlay details shown on hover */}
                  <div className="absolute bottom-8 left-4 right-4 text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
                    <h3 className="text-lg font-bold drop-shadow-lg">{feature.title}</h3>
                    <p className="text-sm drop-shadow-lg mt-1">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Videos Section */}
      <section className="bg-gradient-to-br from-red-50 via-white to-red-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-bold mb-4">
              🎥 Watch & Learn
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Learn from Our YouTube Channel
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Free tutorials, tips, and complete lessons from Anuruddha Sir
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {[
              {
                title: '5 ශ්‍රේණිය ශිෂ්‍යත්වය පොළොව හා අහස',
                description: 'පොළොව පාඩම - Grade 5 Scholarship Geography Lesson',
                videoId: 'SzDqJWNovjU', 
                duration: '02:03',
              },
              {
                title: '4 වසර පැළෑටි හා ගස්වැල් අනුරුද්ධ සර්',
                description: '4 වසර  පැළෑටි හා ගස්වැල් පාඩම - Plants and Trees Lesson',
                videoId: 'SFoEBsQ43Rg',
                duration: '04:24',
              },
              {
                title: '5 වසර මලක කොටස් හා පරාග ‌පෝෂණය',
                description: 'මලක කොටස් හා පරාග ‌පෝෂණය - Parts of a Flower and Pollination',
                videoId: 'Q0K7M_5rpLU',
                duration: '05:33  ',
              },
              {
                title: '5 වසර රාජ්‍ය ලාංඡනය',
                description: 'රාජ්‍ය ලාංඡනය (ලක්වැසියෝ පාඩම) - National Emblem of Sri Lanka',
                videoId: '581xsbpmOVI',
                duration: '05:22',
              },
              {
                title: '5 වසර අහස හා පොළොව',
                description: 'අහස (විශ්වය) හා පොළොව - Grade 5 Scholarship Geography Lesson',
                videoId: 'DewcRiqUq3w',
                duration: '03:55',
              },
              {
                title: 'පාපිලි හදුනා ගනිමු 3 වසර පිල්ලම් පාඩම',
                description: '3 වසර පිල්ලම් හදුනා ගනිමු පාඩම - Identifying Insects Lesson',
                videoId: '48pP_xP6fpc',
                duration: '03:34',
              },
            ].map((video, index) => (
              <div key={index} className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white" data-youtube-card>
                <div className="relative h-48 bg-gray-900 overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="w-16 h-16  rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <FaPlay className="text-white text-6xl ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {video.description}
                  </p>
                  <a
                    href={`https://youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300"
                  >
                    <FaPlay className="text-sm" /> Watch Now
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Subscribe CTA */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-12 text-center text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Don't Miss Any Updates!</h3>
            <p className="text-lg mb-6 text-red-100">Subscribe to our YouTube channel for daily lessons and updates</p>
            <a
              href="https://www.youtube.com/@anuruddhasirgrade5150"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-red-600 hover:bg-red-50 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Subscribe Now
            </a>
          </div>
        </div>
      </section>

      {/* Features Highlight - Modern Minimalist */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">Everything you need for scholarship success</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: TbTarget,
              title: 'Scholarship Focused',
              description: 'Curriculum designed for Grade 5 exam success',
            },
            {
              icon: GrUserExpert,
              title: 'Expert Instruction',
              description: 'Learn from Anuruddha Sir with 15+ years experience',
            },
            {
              icon: CiMobile3,
              title: 'Learn Anytime',
              description: 'Access lessons on any device, anywhere',
            },
            {
              icon: IoChatbox,
              title: '24/7 Support',
              description: 'Get help whenever you need it',
            },
            {
              icon: FaMedal,
              title: 'Proven Results',
              description: '98% students pass their exams',
            },
            {
              icon: FaSackDollar,
              title: 'Affordable Pricing',
              description: 'Premium education at flexible prices',
            },
          ].map((feature, index) => (
            <div key={index} className="p-6 border border-gray-100 rounded-lg hover:border-gray-200 hover:bg-gray-50 transition-all duration-300" data-why-choose-card>
              <feature.icon className="text-3xl text-gray-900 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
            </div>
          </div>
        </section>

        {/* How It Works - Minimal Modern Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Simple Learning, Big Results</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">A focused, modern path to scholarship success — Designed for young learners.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="flex flex-col items-start gap-4 p-6 border rounded-lg shadow-sm hover:shadow-md transition" data-how-it-works-card>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <FaLightbulb className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Learn with Clarity</h3>
              <p className="text-gray-600">Short, clear lessons that focus on core concepts — easy for kids to follow and remember.</p>
            </div>

            <div className="flex flex-col items-start gap-4 p-6 border rounded-lg shadow-sm hover:shadow-md transition" data-how-it-works-card>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <PiNotebookBold className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Practice & Play</h3>
              <p className="text-gray-600">Interactive quizzes and short exercises make practice fun and effective.</p>
            </div>

            <div className="flex flex-col items-start gap-4 p-6 border rounded-lg shadow-sm hover:shadow-md transition" data-how-it-works-card>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <FaChartBar className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Track Progress</h3>
              <p className="text-gray-600">Simple progress views and friendly milestones keep learners motivated.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to={ROUTES.COURSES} className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-blue-700 transition">Explore Courses</Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Horizontal Auto Carousel (3 visible on md+) */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What Parents & Students Say</h2>
            <p className="text-xl text-gray-600">Real stories from our successful students</p>
          </div>

          {/* Carousel container */}
          <div className="relative">
            <div
              ref={testimonialsRef}
              className="testimonials-track flex gap-8 overflow-hidden touch-pan-x scroll-smooth"
              onMouseEnter={() => { if (testimonialsRef.current) testimonialsRef.current._isPaused = true }}
              onMouseLeave={() => { if (testimonialsRef.current) testimonialsRef.current._isPaused = false }}
              onTouchStart={() => { if (testimonialsRef.current) testimonialsRef.current._isPaused = true }}
              onTouchEnd={() => { if (testimonialsRef.current) testimonialsRef.current._isPaused = false }}
              style={{ scrollBehavior: 'smooth' }}
            >
              {(() => {
                const testimonials = [
                  {
                    name: 'Mrs. Perera',
                    role: 'Parent of Kavindu (Grade 5)',
                    comment: "My son's grades improved dramatically after joining. The live classes and recorded sessions are extremely helpful. Highly recommended!",
                    rating: 5,
                    avatar: 'MP',
                  },
                  {
                    name: 'Mr. Silva',
                    role: 'Parent of Nethmi (Grade 5)',
                    comment: "Anuruddha Sir's teaching methods are excellent. The progress tracking feature helps us monitor our daughter's performance easily.",
                    rating: 5,
                    avatar: 'MS',
                  },
                  {
                    name: 'Kaveesha',
                    role: 'Student (Grade 5)',
                    comment: "I love the interactive quizzes and the way Sir explains difficult topics. The recorded sessions help me revise before exams!",
                    rating: 5,
                    avatar: 'KA',
                  },
                  {
                    name: 'Mr. Fernando',
                    role: 'Parent of Ishara (Grade 5)',
                    comment: "The affordable pricing and quality of education are unmatched. Our daughter feels more confident and prepared for her scholarship exam.",
                    rating: 5,
                    avatar: 'MF',
                  },
                ];

                // duplicate items for seamless loop
                return [...testimonials, ...testimonials].map((testimonial, index) => (
                  <div
                    key={index}
                    className="testimonial-card flex-shrink-0 w-full md:w-1/3 bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                    data-testimonial-card
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-3xl mr-4 text-white font-bold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">⭐</span>
                      ))}
                    </div>
                    <p className="text-gray-700 italic leading-relaxed">"{testimonial.comment}"</p>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </section>

        {/* Interactive FAQ Section */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about our platform</p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: 'Is there a free trial available?',
                answer: 'Yes! We offer a 7-day free trial for all new students. No credit card required to get started.',
              },
              {
                question: 'Can I access lessons on mobile?',
                answer: 'Absolutely! Our platform is fully responsive and works on all devices - phones, tablets, and computers.',
              },
              {
                question: 'What if I\'m not satisfied with the course?',
                answer: 'We offer a 100% money-back guarantee within 30 days if you\'re not satisfied. No questions asked!',
              },
              {
                question: 'Are the recorded sessions available forever?',
                answer: 'Yes! Once you enroll, you have lifetime access to all recorded sessions and course materials.',
              },
              {
                question: 'Do you provide certificates?',
                answer: 'Yes, upon completion of each course, you\'ll receive a digital certificate that can be shared on your resume.',
              },
              {
                question: 'What subjects are covered?',
                answer: 'We cover Maths, English, Science, and other subjects required for Grade 5 scholarship exams.',
              },
            ].map((faq, index) => (
              <details key={index} className="group border-2 border-gray-200 rounded-xl overflow-hidden hover:border-primary-400 transition-colors duration-300" data-faq-item>
                <summary className="flex items-center justify-between p-6 cursor-pointer bg-gradient-to-r from-gray-50 to-white group-open:bg-primary-50 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-gray-900 group-open:text-primary-600 transition-colors">
                    {faq.question}
                  </h3>
                  <span className="text-2xl text-primary-600 group-open:rotate-180 transition-transform duration-300">
                    +
                  </span>
                </summary>
                <div className="p-6 bg-gradient-to-br from-gray-50 to-white border-t-2 border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl p-8 text-center">
            <p className="text-gray-700 mb-4">Still have questions?</p>
            <Link
              to={ROUTES.CONTACT}
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Get in Touch with Us
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of students achieving their dreams. Register now and get 7 days free trial!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to={ROUTES.REGISTER} 
              className="bg-white text-primary-600 hover:bg-yellow-300 font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Start Free Trial
            </Link>
            <Link 
              to={ROUTES.CONTACT} 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-4 px-10 rounded-full transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
