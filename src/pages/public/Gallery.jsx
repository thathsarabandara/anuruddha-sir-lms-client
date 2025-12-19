import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ROUTES } from '../../utils/constants';
import { FaBook, FaCamera, FaCheckCircle, FaFilePdf, FaGraduationCap, FaHashtag, FaLanguage, FaMedal, FaMicrophone, FaMicroscope, FaPlay, FaTrophy, FaUsers, FaVideo } from 'react-icons/fa';
import { MdCelebration } from 'react-icons/md';
import { FaMessage } from 'react-icons/fa6';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [imageIndices, setImageIndices] = useState({});
  const cardsRef = useRef([]);
  const statsRef = useRef([]);
  const titleRef = useRef(null);
  const filtersRef = useRef([]);
  const isInitialMount = useRef(true);
  const isMounted = useRef(true);

  const categories = ['all', 'classes', 'achievements', 'events'];

  const gallery = useMemo(() => [
    {
      id: 1,
      title: 'Scholarship Award Ceremony - 2024',
      category: 'events',
      description: 'Celebrating students who excelled in scholarship exams 2024. Anuruddha sir class top performers.',
      color: 'from-blue-400 to-blue-600',
      images: [
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving1.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving2.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving3.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving4.jpeg', 
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving5.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving6.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving7.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving8.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving9.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving10.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving11.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving12.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving13.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving14.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving15.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving16.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving17.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving18.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving19.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving20.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving21.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving22.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving23.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving24.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving25.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving26.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving27.jpeg',
        '/assets/images/gallery/ims-price-giving-2024/ims-2024-price-giving28.jpeg',
      ]
    },
    {
      id: 2,
      title: 'Ashirwada Puja Blessings for Exam Success',
      category: 'events',
      description: 'Blessings ceremony held before scholarship exams to wish students success',
      color: 'from-yellow-400 to-yellow-600',
      images: [
        '/assets/images/gallery/ashirwada-puja/ashirwada-puja1.jpeg',
        '/assets/images/gallery/ashirwada-puja/ashirwada-puja2.jpeg',
        '/assets/images/gallery/ashirwada-puja/ashirwada-puja3.jpeg',
        '/assets/images/gallery/ashirwada-puja/ashirwada-puja4.jpeg',
        '/assets/images/gallery/ashirwada-puja/ashirwada-puja5.jpeg',
        '/assets/images/gallery/ashirwada-puja/ashirwada-puja6.jpeg',
        '/assets/images/gallery/ashirwada-puja/ashirwada-puja7.jpeg',
      ]
    },
    {
      id: 3,
      title: 'Award Ceremony - Student Excellence 2023',
      category: 'events',
      description: 'Honoring students for outstanding performance in academics and extracurriculars',
      color: 'from-green-400 to-green-600',
      images: [
        '/assets/images/gallery/ims-award-ceromony-2023/award-ceromony1.jpeg',
        '/assets/images/gallery/ims-award-ceromony-2023/award-ceromony2.jpeg',
        '/assets/images/gallery/ims-award-ceromony-2023/award-ceromony3.jpeg',
        '/assets/images/gallery/ims-award-ceromony-2023/award-ceromony4.jpeg',
        '/assets/images/gallery/ims-award-ceromony-2023/award-ceromony5.jpeg',
        '/assets/images/gallery/ims-award-ceromony-2023/award-ceromony6.jpeg',
        '/assets/images/gallery/ims-award-ceromony-2023/award-ceromony7.jpeg',
        '/assets/images/gallery/ims-award-ceromony-2023/award-ceromony8.jpeg',
        '/assets/images/gallery/ims-award-ceromony-2023/award-ceromony9.jpeg',
        '/assets/images/gallery/ims-award-ceromony-2023/award-ceromony10.jpeg',
        '/assets/images/gallery/ims-award-ceromony-2023/award-ceromony11.jpeg',
        '/assets/images/gallery/ims-award-ceromony-2023/award-ceromony12.jpeg',
        '/assets/images/gallery/ims-award-ceromony-2023/award-ceromony13.jpeg',
        '/assets/images/gallery/ims-award-ceromony-2023/award-ceromony14.jpeg',
        '/assets/images/gallery/ims-award-ceromony-2023/award-ceromony15.jpeg',
        '/assets/images/gallery/ims-award-ceromony-2023/award-ceromony16.jpeg',
        '/assets/images/gallery/ims-award-ceromony-2023/award-ceromony17.jpeg',
        '/assets/images/gallery/ims-award-ceromony-2023/award-ceromony18.jpeg',
        '/assets/images/gallery/ims-award-ceromony-2023/award-ceromony19.jpeg',
        '/assets/images/gallery/ims-award-ceromony-2023/award-ceromony20.jpeg',
        '/assets/images/gallery/ims-award-ceromony-2023/award-ceromony21.jpeg',
        '/assets/images/gallery/ims-award-ceromony-2023/award-ceromony22.jpeg',
        '/assets/images/gallery/ims-award-ceromony-2023/award-ceromony23.jpeg',
        '/assets/images/gallery/ims-award-ceromony-2023/award-ceromony24.jpeg',
      ]
    },
    {
      id: 4,
      title: 'School Visiting Lectures - Interactive Learning',
      category: 'achievements',
      description: 'Engaging sessions conducted at various schools to inspire and educate students.',
      color: 'from-purple-400 to-purple-600',
      images: [
        '/assets/images/gallery/school-sponser/school-sponser1.jpeg',
        '/assets/images/gallery/school-sponser/school-sponser2.jpeg',
        '/assets/images/gallery/school-sponser/school-sponser3.jpeg',
        '/assets/images/gallery/school-sponser/school-sponser4.jpeg',
      ]
    },
    {
      id: 5,
      title: 'IMS Classroom Moments - Learning in Action',
      category: 'classes',
      description: 'Engaging sessions conducted at various schools to inspire and educate students.',
      color: 'from-purple-400 to-purple-600',
      images: [
        '/assets/images/gallery/ims-class/ims-class1.jpeg',
        '/assets/images/gallery/ims-class/ims-class2.jpeg',
        '/assets/images/gallery/ims-class/ims-class3.jpeg',
        '/assets/images/gallery/ims-class/ims-class4.jpeg',
        '/assets/images/gallery/ims-class/ims-class5.jpeg',
        '/assets/images/gallery/ims-class/ims-class6.jpeg',
        '/assets/images/gallery/ims-class/ims-class7.jpeg',
        '/assets/images/gallery/ims-class/ims-class8.jpeg',
        '/assets/images/gallery/ims-class/ims-class9.jpeg',
        '/assets/images/gallery/ims-class/ims-class10.jpeg',
        '/assets/images/gallery/ims-class/ims-class11.jpeg',
        '/assets/images/gallery/ims-class/ims-class12.jpeg',
        '/assets/images/gallery/ims-class/ims-class13.jpeg',
        '/assets/images/gallery/ims-class/ims-class14.jpeg',
        '/assets/images/gallery/ims-class/ims-class15.jpeg',
        '/assets/images/gallery/ims-class/ims-class16.jpeg',
      ]
    },
    {
      id: 6,
      title: 'IMS Classroom Moments - Learning in Action 2024',
      category: 'classes',
      description: 'Lively classroom sessions from 2024 showcasing interactive learning.',
      color: 'from-purple-400 to-purple-600',
      images: [
        '/assets/images/gallery/ims-class-2024/ims-class-2024-1.jpeg',
        '/assets/images/gallery/ims-class-2024/ims-class-2024-2.jpeg',
        '/assets/images/gallery/ims-class-2024/ims-class-2024-3.jpeg',
        '/assets/images/gallery/ims-class-2024/ims-class-2024-4.jpeg',
        '/assets/images/gallery/ims-class-2024/ims-class-2024-5.jpeg',
        '/assets/images/gallery/ims-class-2024/ims-class-2024-6.jpeg',
      ]
    },
    {
      id: 7,
      title: 'DMD Classroom Moments - Learning in Action 2024',
      category: 'classes',
      description: 'Lively classroom sessions from 2024 showcasing interactive learning.',
      color: 'from-purple-400 to-purple-600',
      images: [
        '/assets/images/gallery/dmd-class/dmd-class1.jpeg',
        '/assets/images/gallery/dmd-class/dmd-class2.jpeg',
      ]
    },
    {
      id: 8,
      title: 'Senrose Class Moments - Learning in Action 2024',
      category: 'classes',
      description: 'Lively classroom sessions from 2024 showcasing interactive learning.',
      color: 'from-purple-400 to-purple-600',
      images: [
        '/assets/images/gallery/senrose-class-2023/senrose-class1.jpeg',
        '/assets/images/gallery/senrose-class-2023/senrose-class2.jpeg',
        '/assets/images/gallery/senrose-class-2023/senrose-class3.jpeg',  
        '/assets/images/gallery/senrose-class-2023/senrose-class4.jpeg',
        '/assets/images/gallery/senrose-class-2023/senrose-class5.jpeg',
        '/assets/images/gallery/senrose-class-2023/senrose-class6.jpeg',
        '/assets/images/gallery/senrose-class-2023/senrose-class7.jpeg',
        '/assets/images/gallery/senrose-class-2023/senrose-class8.jpeg',
        '/assets/images/gallery/senrose-class-2023/senrose-class9.jpeg',
        '/assets/images/gallery/senrose-class-2023/senrose-class10.jpeg',
        '/assets/images/gallery/senrose-class-2023/senrose-class11.jpeg',
        '/assets/images/gallery/senrose-class-2023/senrose-class12.jpeg',
        '/assets/images/gallery/senrose-class-2023/senrose-class13.jpeg',
      ]
    },
    {
      id: 9,
      title: 'Online classroom Moments - Learning in Action 2025',
      category: 'classes',
      description: 'Lively online classroom sessions from 2025 showcasing interactive learning.',
      color: 'from-purple-400 to-purple-600',
      images: [
        '/assets/images/gallery/online-class/online-class1.png',
        '/assets/images/gallery/online-class/online-class2.png',
        '/assets/images/gallery/online-class/online-class3.png',
        '/assets/images/gallery/online-class/online-class4.png',
        '/assets/images/gallery/online-class/online-class5.png',
      ]
    },
  ], []);

  const youTubeVideos = useMemo(() => [
      {
                title: 'Gurudeniya college Seminar',
                description: 'Anuruddha sir visiting Gurudeniya College to inspire young minds.',
                videoId: 'OM0OPqNKSds', 
                duration: '01:48',
              },
              {
                title: 'Dheerananda College Seminar',
                description: 'Inspiring session at Dheerananda College by Anuruddha sir.',
                videoId: 'BzlOvdYyg0Q',
                duration: '02:37',
              },
              {
                title: 'Haguranketha College Seminar',
                description: 'Motivational talk at Haguranketha College with Anuruddha sir.',
                videoId: 'kWQKf8ZmcKk',
                duration: '02:48  ',
              },
              {
                title: 'Sumangala College Seminar',
                description: 'Engaging seminar at Sumangala College by Anuruddha sir.',
                videoId: 'e2CKY8jZkGg',
                duration: '01:55',
              },
            ], []);

  const filteredGallery = selectedCategory === 'all' 
    ? gallery 
    : gallery.filter(item => item.category === selectedCategory);

  useEffect(() => {
    isMounted.current = true;
    
    const initialIndices = {};
    gallery.forEach(item => {
      initialIndices[item.id] = 0;
      setImageIndices(initialIndices);
    });
    

    const intervals = gallery.map(item => {
      return setInterval(() => {
        if (isMounted.current) {
          setImageIndices(prev => ({
            ...prev,
            [item.id]: (prev[item.id] + 1) % item.images.length
          }));
        }
      }, 3000);
    });

    return () => {
      intervals.forEach(interval => clearInterval(interval));
      isMounted.current = false;
    };
  }, [gallery]);

  useEffect(() => {
    if (!isInitialMount.current) return;
    isInitialMount.current = false;

    const timer = setTimeout(() => {
      if (!isMounted.current) return;

      try {
        if (titleRef.current) {
          gsap.set(titleRef.current, { opacity: 0, y: 30 });
          gsap.to(titleRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
          });
        }

        const validStats = statsRef.current.filter(el => el !== null && el !== undefined);
        if (validStats.length > 0) {
          gsap.set(validStats, { opacity: 0, y: 20 });
          validStats.forEach((stat, index) => {
            gsap.to(stat, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: 0.1 * index,
              ease: 'power2.out'
            });
          });
        }

        const validFilters = filtersRef.current.filter(el => el !== null && el !== undefined);
        if (validFilters.length > 0) {
          gsap.set(validFilters, { opacity: 0, x: -20 });
          validFilters.forEach((filter, index) => {
            gsap.to(filter, {
              opacity: 1,
              x: 0,
              duration: 0.5,
              delay: 0.05 * index,
              ease: 'power2.out'
            });
          });
        }

        const validCards = cardsRef.current.filter(el => el !== null && el !== undefined);
        if (validCards.length > 0) {
          gsap.set(validCards, { opacity: 0, y: 30 });
          validCards.forEach((card, index) => {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: 0.05 * index,
              ease: 'power2.out'
            });
          });
        }
        if(youTubeVideos.length === 0) return;
        gsap.set('[data-youtube-card]', { opacity: 0, y: 30 });
        youTubeVideos.forEach((_, index) => {
          gsap.to('[data-youtube-card]', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.05 * index,
            ease: 'power2.out'
          });
        });

      } catch (error) {
        console.warn('GSAP animation setup error:', error);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [gallery, youTubeVideos]);

  const stats = [
    { number: '500+', label: 'Happy Moments', icon: FaCamera },
    { number: '100+', label: 'Achievements', icon: FaMedal },
    { number: '50+', label: 'Events Hosted', icon: MdCelebration },
    { number: '1,247+', label: 'Students Featured', icon: FaUsers },
  ];

  return (
    <div>
      {/* Hero Section */}
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
        <div ref={titleRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center h-full flex flex-col justify-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Photo Gallery
          </h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
            Explore moments from our classes, achievements, events, and student life. 
            Witness the vibrant learning environment we create!
          </p>
        </div>

        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-400/20 rounded-full blur-3xl"></div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                ref={el => statsRef.current[index] = el}
                className="flex flex-col items-center p-6 rounded-2xl bg-white hover:shadow-lg transition-all duration-300 group"
              >
                <div className="text-5xl mb-3 text-primary-600 group-hover:scale-110 transition-transform duration-300"><stat.icon /></div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-gray-600 text-sm text-center font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, idx) => (
              <button
                key={category}
                ref={el => filtersRef.current[idx] = el}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 transform hover:scale-105 text-sm md:text-base ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredGallery.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item, index) => (
              <div 
            key={item.id}
            ref={el => cardsRef.current[index] = el}
            className="group cursor-pointer"
              >
            <div className="h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Card Image/Icon Section */}
              <div className={`aspect-video bg-gradient-to-br ${item.color} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                
                {/* Slideshow Images */}
                <div className="relative w-full h-full">
              {item.images && item.images.length > 0 ? (
                <>
                  {item.images.map((image, imgIndex) => (
                <img
                  key={imgIndex}
                  src={image}
                  alt={`${item.title} - ${imgIndex + 1}`}
                  className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500 ${
                    imgIndex === imageIndices[item.id] ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                  ))}
                  
                  {/* Slideshow indicator dots */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
                {item.images.map((_, dotIndex) => (
                  <div
                    key={dotIndex}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  dotIndex === imageIndices[item.id]
                    ? 'bg-white/90 w-2'
                    : 'bg-white/40'
                    }`}
                  />
                ))}
                  </div>
                </>
              ) : (
                <span className="text-6xl md:text-7xl transform group-hover:scale-110 transition-transform duration-300 flex items-center justify-center w-full h-full">{item.icon}</span>
              )}
                </div>
              </div>

              {/* Card Content */}
                    <div className="p-5">
                      <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold mb-3 group-hover:bg-primary-200 transition-colors duration-300">
                        {item.category.toUpperCase()}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">No items found in this category</p>
            </div>
          )}
        </div>
      </section>

      {/* Video Gallery Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Video Gallery</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Watch highlights from our classes and events</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {youTubeVideos.map((video, index) => (
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
        </div>
      </section>

      {/* Upload Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Want to See Your Child Here?
          </h2>
          <p className="text-xl text-gray-700 mb-6">
            Join our platform and be part of our success stories gallery!
          </p>
          <p className="text-gray-600 mb-8">
            Students and parents can share their achievements, milestones, and happy moments with us.
          </p>
          <Link
            to={ROUTES.REGISTER}
            className="inline-block bg-primary-600 text-white hover:bg-primary-700 font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Join Our Community
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-6">
            Create your own success story with us!
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

export default Gallery;
