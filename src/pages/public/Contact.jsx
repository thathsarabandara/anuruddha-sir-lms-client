import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CiMobile3 } from 'react-icons/ci';
import { FaArrowRight, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { MdEmail, MdMessage } from 'react-icons/md';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const titleRef = useRef(null);
  const contactInfoRef = useRef([]);
  const formRef = useRef(null);
  const faqItemsRef = useRef([]);
  const socialRef = useRef([]);
  const isInitialMount = useRef(true);
  const isMounted = useRef(true);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (!isInitialMount.current) return;
    isInitialMount.current = false;
    isMounted.current = true;

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
        const validContactInfos = contactInfoRef.current.filter(el => el !== null && el !== undefined);
        if (validContactInfos.length > 0) {
          gsap.set(validContactInfos, { opacity: 0, x: -20 });
          validContactInfos.forEach((item, index) => {
            gsap.to(item, {
              opacity: 1,
              x: 0,
              duration: 0.6,
              delay: 0.05 * index,
              ease: 'power2.out'
            });
          });
        }

        const validSocials = socialRef.current.filter(el => el !== null && el !== undefined);
        if (validSocials.length > 0) {
          gsap.set(validSocials, { opacity: 0, scale: 0.8 });
          validSocials.forEach((btn, index) => {
            gsap.to(btn, {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              delay: 0.1 * index,
              ease: 'back.out'
            });
          });
        }

        // Animate form
        if (formRef.current) {
          gsap.set(formRef.current, { opacity: 0, x: 30 });
          gsap.to(formRef.current, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: 0.3,
            ease: 'power2.out'
          });
        }

        // Animate FAQ items with proper ref filtering
        const validFaqItems = faqItemsRef.current.filter(el => el !== null && el !== undefined);
        if (validFaqItems.length > 0) {
          gsap.set(validFaqItems, { opacity: 0, y: 20 });
          validFaqItems.forEach((item, index) => {
            gsap.to(item, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: 0.05 * index,
              ease: 'power2.out'
            });
          });
        }
      } catch (error) {
        console.warn('GSAP animation error:', error);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      isMounted.current = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setTimeout(() => setSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div className="pb-12">
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
        <div ref={titleRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center h-full flex flex-col justify-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
            Have questions? We're here to help. Get in touch with us today.
          </p>
        </div>

        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-400/20 rounded-full blur-3xl"></div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-8">
                Feel free to reach out to us using any of the methods below. We typically respond within 24 hours.
              </p>

              <div className="space-y-6">
                <div 
                  ref={el => contactInfoRef.current[0] = el}
                  className="flex items-start p-4 rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                  <div className="text-3xl mr-4 text-primary-600"><MdEmail /></div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">anuruddharathnaya40@gmail.com</p>
                  </div>
                </div>

                <div 
                  ref={el => contactInfoRef.current[1] = el}
                  className="flex items-start p-4 rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                  <div className="text-3xl mr-4 text-primary-600"><CiMobile3 /></div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">+94 70 265 6024</p>
                    <p className="text-sm text-gray-500">Mon-Fri: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div 
                  ref={el => contactInfoRef.current[2] = el}
                  className="flex items-start p-4 rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                  <div className="text-3xl mr-4 text-primary-600"><MdMessage /></div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">WhatsApp</h3>
                    <p className="text-gray-600">+94 70 265 6024</p>
                    <a 
                      href="https://wa.me/+94702656024" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
                    >
                      Chat with us <FaArrowRight className="text-xs" />
                    </a>
                  </div>
                </div>

                <div 
                  ref={el => contactInfoRef.current[3] = el}
                  className="flex items-start p-4 rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                  <div className="text-3xl mr-4 text-primary-600"><FaLocationDot /></div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Office</h3>
                    <p className="text-gray-600">
                      ThanneKumbura<br />
                      Kandy,<br />
                      Sri Lanka
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-12">
                <h3 className="font-bold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex space-x-3">
                  <a 
                    ref={el => socialRef.current[0] = el}
                    href="#" 
                    className="w-12 h-12 bg-primary-100 hover:bg-primary-600 hover:text-white text-primary-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                  >
                    <span className="text-lg"><FaFacebook /></span>
                  </a>
                  <a 
                    ref={el => socialRef.current[1] = el}
                    href="#" 
                    className="w-12 h-12 bg-primary-100 hover:bg-primary-600 hover:text-white text-primary-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                  >
                    <span className="text-lg"><FaInstagram /></span>
                  </a>
                  <a 
                    ref={el => socialRef.current[2] = el}
                    href="#" 
                    className="w-12 h-12 bg-primary-100 hover:bg-primary-600 hover:text-white text-primary-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                  >
                    <span className="text-lg"><FaYoutube /></span>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div ref={formRef} className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send a Message</h2>

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-green-700 font-medium">
                    Thank you! Your message has been sent successfully. We'll get back to you soon.
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                    placeholder="07XXXXXXXX"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                question: 'What are the class timings?',
                answer: 'Live classes are scheduled on weekdays and weekends. Exact timings are shared after enrollment.'
              },
              {
                question: 'Can I get a refund if I\'m not satisfied?',
                answer: 'Yes, we offer a 7-day money-back guarantee if you\'re not satisfied with our services.'
              },
              {
                question: 'Are the classes conducted in Sinhala?',
                answer: 'Yes, all classes are conducted in Sinhala medium to ensure better understanding.'
              },
              {
                question: 'Do you provide study materials?',
                answer: 'Yes, comprehensive study materials, worksheets, and practice papers are provided.'
              }
            ].map((item, index) => (
              <div 
                key={index}
                ref={el => faqItemsRef.current[index] = el}
                className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-primary-200 hover:shadow-md transition-all duration-300"
              >
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">{index + 1}</span>
                  {item.question}
                </h3>
                <p className="text-gray-600">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
