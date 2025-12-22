import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES, getAuthRoute } from '../../utils/constants';
import { FaGraduationCap, FaUser, FaSignInAlt, FaTimes, FaBars, FaChevronDown } from 'react-icons/fa';
import LanguageSwitcher from '../common/LanguageSwitcher';
import gsap from 'gsap';

const TopNav = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const roleDropdownRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: t('common.home'), path: ROUTES.HOME },
    { name: t('common.about'), path: ROUTES.ABOUT },
    { name: t('common.courses'), path: ROUTES.COURSES },
    { name: t('common.services'), path: ROUTES.SERVICES },
    { name: t('common.gallery'), path: ROUTES.GALLERY },
    { name: t('common.contact'), path: ROUTES.CONTACT },
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
              <LanguageSwitcher />
              
              {/* Role-based Auth Dropdown */}
              <div className="relative" ref={roleDropdownRef}>
                <button
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                >
                  <FaSignInAlt size={16} />
                  <span>{t('common.login')}</span>
                  <FaChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${
                      isRoleDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isRoleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-600 uppercase">{t('common.login')}</p>
                    </div>

                    <Link
                      to={getAuthRoute('login', 'student')}
                      onClick={() => setIsRoleDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <FaGraduationCap className="text-blue-500" />
                      <div>
                        <p className="font-medium text-sm">{t('common.student')}</p>
                        <p className="text-xs text-gray-500">{t('common.studentPortal')}</p>
                      </div>
                    </Link>

                    <Link
                      to={getAuthRoute('login', 'teacher')}
                      onClick={() => setIsRoleDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors border-t border-gray-100"
                    >
                      <FaUser className="text-purple-500" />
                      <div>
                        <p className="font-medium text-sm">{t('common.teacher')}</p>
                        <p className="text-xs text-gray-500">{t('common.teacherPortal')}</p>
                      </div>
                    </Link>

                    <div className="border-t border-gray-100 p-3">
                      <p className="text-xs text-gray-600 mb-2">{t('common.noAccount')}</p>
                      <Link
                        to={getAuthRoute('register', 'student')}
                        onClick={() => setIsRoleDropdownOpen(false)}
                        className="block w-full text-center px-3 py-2 bg-blue-600 text-white rounded font-medium text-sm hover:bg-blue-700 transition-colors"
                      >
                        {t('common.registerStudent')}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
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
                <div className="flex justify-center">
                  <LanguageSwitcher />
                </div>
                <p className="px-4 text-sm font-semibold text-gray-700">{t('common.login')}</p>
                <Link
                  to={getAuthRoute('login', 'student')}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaGraduationCap className="text-sm" />
                  {t('common.student')}
                </Link>
                <Link
                  to={getAuthRoute('login', 'teacher')}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-purple-600 hover:bg-purple-50 font-medium rounded-lg transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUser className="text-sm" />
                  {t('common.teacher')}
                </Link>
                <p className="px-4 text-sm font-semibold text-gray-700 mt-3">{t('common.register')}</p>
                <Link
                  to={getAuthRoute('register', 'student')}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white w-full py-3 font-medium rounded-lg hover:shadow-lg transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaGraduationCap className="text-sm" />
                  {t('common.registerStudent')}
                </Link>
                <Link
                  to={getAuthRoute('register', 'teacher')}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white w-full py-3 font-medium rounded-lg hover:shadow-lg transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUser className="text-sm" />
                  {t('common.registerTeacher')}
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
