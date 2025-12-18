import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ROUTES } from '../../utils/constants';
import { FaGraduationCap, FaUser, FaSignInAlt, FaTimes, FaBars } from 'react-icons/fa';
import gsap from 'gsap';

const TopNav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen && mobileMenuRef.current) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: ROUTES.HOME },
    { name: 'About', path: ROUTES.ABOUT },
    { name: 'Courses', path: ROUTES.COURSES },
    { name: 'Services', path: ROUTES.SERVICES },
    { name: 'Gallery', path: ROUTES.GALLERY },
    { name: 'Contact', path: ROUTES.CONTACT },
    { name: 'Testimonials', path: ROUTES.TESTIMONIALS },
    { name: 'FAQ', path: ROUTES.FAQ },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md ${isScrolled ? 'bg-white/95 shadow-2xl' : 'bg-white/80 shadow-sm'}`} ref={navRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Minimalist */}
            <Link to={ROUTES.HOME} className="flex items-center space-x-2 group">
              <img src='/assets/images/logo.png' alt='logo' className='w-10 h-10'/>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-gray-900 leading-tight">Anuruddha Sir</span>
                <span className="text-xs text-gray-500">Best in Bests</span>
              </div>
            </Link>

            {/* Desktop Navigation - Minimalist */}
            <div className="hidden lg:flex items-center space-x-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative ${
                    isActive(link.path)
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>

            {/* Auth Buttons - Minimalist */}
            <div className="hidden lg:flex items-center space-x-2">
              <Link 
                to={ROUTES.LOGIN} 
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary-600 font-medium text-sm transition-colors duration-300"
              >
                <FaSignInAlt className="text-sm" />
                <span>Sign In</span>
              </Link>
              <Link 
                to={ROUTES.REGISTER} 
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium text-sm rounded-lg hover:shadow-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-105"
              >
                <FaUser className="text-sm" />
                <span>Register</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="w-6 h-6 text-gray-700" />
              ) : (
                <FaBars className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Animated */}
        {isMobileMenuOpen && (
          <div ref={mobileMenuRef} className="lg:hidden bg-white border-t shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    animation: `slideInLeft 0.3s ease-out ${index * 0.05}s both`
                  }}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t space-y-3">
                <Link
                  to={ROUTES.LOGIN}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-primary-600 hover:bg-primary-50 font-medium rounded-lg transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaSignInAlt className="text-sm" />
                  Sign In
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white w-full py-3 font-medium rounded-lg hover:shadow-lg transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUser className="text-sm" />
                  Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default TopNav;
