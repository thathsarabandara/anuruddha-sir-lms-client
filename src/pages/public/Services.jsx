import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaBook, FaChartBar, FaCheck, FaCheckCircle, FaCreditCard, FaFilePdf, FaGem, FaTrophy, FaVideo } from 'react-icons/fa';
import { TfiAnnouncement } from 'react-icons/tfi';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const services = [
    {
      icon: FaVideo,
      title: 'Live Interactive Classes',
      description: 'Real-time Zoom sessions with expert teachers. Ask questions, participate in discussions, and learn together.',
      features: ['HD Video Quality', 'Screen Sharing', 'Interactive Whiteboard', 'Breakout Rooms'],
    },
    {
      icon: FaBook,
      title: 'Study Materials',
      description: 'Comprehensive study materials, notes, and worksheets designed by experienced educators.',
      features: ['PDF Downloads', 'Practice Papers', 'Model Answers', 'Revision Notes'],
    },
    {
      icon: FaFilePdf,
      title: 'Assessments & Quizzes',
      description: 'Regular quizzes and mock exams to track progress and identify areas for improvement.',
      features: ['Online Quizzes', 'Instant Results', 'Performance Analytics', 'Leaderboards'],
    },
    {
      icon: FaVideo,
      title: 'Recorded Sessions',
      description: 'Access recorded class sessions anytime. Revisit lessons and learn at your own pace.',
      features: ['Unlimited Access', 'HD Quality', 'Mobile Friendly', 'Download Option'],
    },
    {
      icon: FaGem,
      title: 'Rewards System',
      description: 'Gamified learning with coins and gems. Earn rewards for achievements and performance.',
      features: ['Achievement Badges', 'Coin System', 'Gem Rewards', 'Redemption Options'],
    },
    {
      icon: FaTrophy,
      title: 'Certificates',
      description: 'Digital certificates upon course completion to recognize student achievements.',
      features: ['Digital Certificates', 'Instant Download', 'Shareable', 'Verified'],
    },
    {
      icon: FaChartBar,
      title: 'Progress Tracking',
      description: 'Detailed analytics and reports to monitor student progress and performance.',
      features: ['Visual Dashboards', 'Subject-wise Reports', 'Improvement Tracking', 'Parent Access'],
    },
    {
      icon: FaCreditCard,
      title: 'Flexible Payments',
      description: 'Multiple payment options including online payments and bank deposits.',
      features: ['PayHere Integration', 'Bank Transfer', 'Installment Plans', 'Secure Processing'],
    },
    {
      icon: TfiAnnouncement,
      title: 'Announcements & Updates',
      description: 'Stay informed with timely notifications about classes, exams, and important updates.',
      features: ['Push Notifications', 'Email Alerts', 'SMS Updates', 'In-App Messages'],
    },
  ];

  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const serviceCards = container.querySelectorAll('[data-service-card]');
    const steps = container.querySelectorAll('[data-step]');
    const benefits = container.querySelectorAll('[data-benefit-item]');
    const ctaBtns = container.querySelectorAll('[data-cta-btn]');

    // Page fade-in
    gsap.fromTo(container, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power1.out' });

    // Service cards entrance
    if (serviceCards?.length) {
      gsap.fromTo(
        serviceCards,
        { opacity: 0, y: 24, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'back.out(1.1)',
          scrollTrigger: { trigger: serviceCards[0].parentElement, start: 'top 85%', toggleActions: 'play none none none' },
        }
      );
    }

    // How it works steps animation
    if (steps?.length) {
      gsap.fromTo(
        steps,
        { opacity: 0, x: 24 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: { trigger: steps[0].parentElement, start: 'top 85%', toggleActions: 'play none none none' },
        }
      );
    }

    // Benefits items
    if (benefits?.length) {
      gsap.fromTo(
        benefits,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: benefits[0].parentElement, start: 'top 85%', toggleActions: 'play none none none' },
        }
      );
    }

    // CTA button pop-in
    if (ctaBtns?.length) {
      gsap.fromTo(ctaBtns, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(1.2)', delay: 0.2 });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="py-12" ref={containerRef}>
      {/* Header */}
      <section className="py-16">
        <img src='/assets/images/services/hero.jpeg' alt="Services Hero" className='absolute inset-0 opacity-25'/>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete learning solutions designed to help students achieve excellence
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 mt-16 bg-gray-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div serviceCards className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                      <div key={index} className="card hover:scale-105 transition-transform duration-200" data-service-card>
                <service.icon className="text-4xl text-primary-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center text-sm text-gray-700">
                      <FaCheck className="text-primary-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center" data-step>
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Register</h3>
              <p className="text-gray-600 text-sm">
                Create your free account and complete your profile
              </p>
            </div>
            <div className="text-center" data-step>
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Choose Course</h3>
              <p className="text-gray-600 text-sm">
                Select the course that fits your needs
              </p>
            </div>
            <div className="text-center" data-step>
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Make Payment</h3>
              <p className="text-gray-600 text-sm">
                Complete payment through your preferred method
              </p>
            </div>
            <div className="text-center" data-step>
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Start Learning</h3>
              <p className="text-gray-600 text-sm">
                Access all resources and join live classes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Why Choose Our Platform
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start">
              <FaCheckCircle className="text-3xl mr-4" />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Expert Teachers</h3>
                <p className="text-gray-600">Learn from experienced educators with proven track records</p>
              </div>
            </div>
            <div className="flex items-start">
              <FaCheckCircle className="text-3xl mr-4" />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Flexible Learning</h3>
                <p className="text-gray-600">Study at your own pace with recorded sessions</p>
              </div>
            </div>
            <div className="flex items-start">
              <FaCheckCircle className="text-3xl mr-4" />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Affordable Pricing</h3>
                <p className="text-gray-600">Quality education at competitive rates</p>
              </div>
            </div>
            <div className="flex items-start">
              <FaCheckCircle className="text-3xl mr-4" />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">24/7 Support</h3>
                <p className="text-gray-600">Get help whenever you need it</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8">
            Join thousands of successful students today
          </p>
          <button className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg transition-colors">
            Register Now - It's Free!
          </button>
        </div>
      </section>
    </div>
  );
};

export default Services;
