import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { logout } from '../../app/slices/authSlice';
import { ROUTES, ROLES } from '../../utils/constants';
import { FaTimes, FaBook,  FaChartBar, FaClipboardList, FaCreditCard, FaFilePdf, FaGem, FaLink, FaTrophy, FaUsers, FaVideo, FaUser, FaFlag } from 'react-icons/fa';
import { TfiAnnouncement } from 'react-icons/tfi';
import { IoSettings } from 'react-icons/io5';
import { MdError, MdHealthAndSafety, MdLogout, MdManageAccounts } from 'react-icons/md';

const Sidebar = ({ isOpen = true, onClose = () => {} }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  // Define menu items based on role
  const getMenuItems = () => {
    switch (user?.role) {
      case ROLES.STUDENT:
        return [
          { name: 'Dashboard', path: ROUTES.STUDENT_DASHBOARD, icon: FaChartBar },
          { name: 'My Courses', path: ROUTES.STUDENT_COURSES, icon: FaBook },
          { name: 'Live Classes', path: ROUTES.STUDENT_LIVE_CLASSES, icon: FaVideo },
          { name: 'Quizzes', path: ROUTES.STUDENT_QUIZZES, icon: FaFilePdf },
          { name: 'Progress', path: ROUTES.STUDENT_PROGRESS, icon: FaChartBar },
          { name: 'Recordings', path: ROUTES.STUDENT_RECORDINGS, icon: FaVideo },
          { name: 'Certificates', path: ROUTES.STUDENT_CERTIFICATES, icon: FaTrophy },
          { name: 'Payments', path: ROUTES.STUDENT_PAYMENTS, icon: FaCreditCard },
          { name: 'Rewards', path: ROUTES.STUDENT_REWARDS, icon: FaGem },
          { name: 'Profile', path: ROUTES.STUDENT_PROFILE, icon: FaUser },
        ];
      
      case ROLES.TEACHER:
        return [
          { name: 'Dashboard', path: ROUTES.TEACHER_DASHBOARD, icon: FaChartBar },
          { name: 'Courses', path: ROUTES.TEACHER_COURSES, icon: FaBook },
          { name: 'Live Classes', path: ROUTES.TEACHER_LIVE_CLASSES, icon: FaVideo },
          { name: 'Students', path: ROUTES.TEACHER_STUDENTS, icon: FaUsers },
          { name: 'Quizzes', path: ROUTES.TEACHER_QUIZZES, icon: FaFilePdf },
          { name: 'Recordings', path: ROUTES.TEACHER_RECORDINGS, icon: FaVideo },
          { name: 'Revenue', path: ROUTES.TEACHER_REVENUE, icon: FaCreditCard },
          { name: 'Rewards', path: ROUTES.TEACHER_REWARDS, icon: FaGem },
          { name: 'Announcements', path: ROUTES.TEACHER_ANNOUNCEMENTS, icon: TfiAnnouncement },
          { name: 'Profile', path: ROUTES.TEACHER_PROFILE, icon: FaUser },
        ];
      
      case ROLES.ADMIN:
      case ROLES.SUPER_ADMIN:
        return [
          { name: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: FaChartBar },
          { name: 'Students', path: ROUTES.ADMIN_STUDENTS, icon: FaUsers },
          { name: 'Teachers', path: ROUTES.ADMIN_TEACHERS, icon: FaUsers },
          { name: 'Courses', path: ROUTES.ADMIN_COURSES, icon: FaBook },
          { name: 'Payments', path: ROUTES.ADMIN_PAYMENTS, icon: FaCreditCard },
          { name: 'Quizzes', path: ROUTES.ADMIN_QUIZZES, icon: FaFilePdf },
          { name: 'Certificates', path: ROUTES.ADMIN_CERTIFICATES, icon: FaTrophy },
          { name: 'Admin Management', path: ROUTES.ADMIN_MANAGEMENT, icon: MdManageAccounts },
          { name: 'Reports', path: ROUTES.ADMIN_REPORTS, icon: FaChartBar },
          { name: 'Settings', path: ROUTES.ADMIN_SETTINGS, icon: IoSettings },
        ];
      
      case ROLES.DEVELOPER:
        return [
          { name: 'Dashboard', path: ROUTES.DEVELOPER_DASHBOARD, icon: FaChartBar },
          { name: 'System Health', path: ROUTES.DEVELOPER_SYSTEM_HEALTH, icon: MdHealthAndSafety },
          { name: 'API Logs', path: ROUTES.DEVELOPER_API_LOGS, icon: FaClipboardList },
          { name: 'Error Monitoring', path: ROUTES.DEVELOPER_ERROR_MONITORING, icon: MdError },
          { name: 'Feature Flags', path: ROUTES.DEVELOPER_FEATURE_FLAGS, icon: FaFlag },
          { name: 'Integration Status', path: ROUTES.DEVELOPER_INTEGRATION_STATUS, icon: FaLink },
        ];
      
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative bg-white h-screen flex flex-col border-r border-gray-200 transition-all duration-300 z-40 ${
          isMobile ? 'w-64' : isCollapsed ? 'w-20' : 'w-64'
        } ${isMobile && !isOpen ? '-translate-x-full' : ''}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {(!isCollapsed || isMobile) && (
            <Link to={ROUTES.HOME} className="flex items-center space-x-2">
              <img src='/assets/images/logo.png' alt='logo' className='w-8 h-8'/>
              <span className="font-bold text-lg text-gray-900">Anuruddha Sir</span>
            </Link>
          )}
          <div className="flex items-center gap-2">
            {isMobile && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            )}
            {!isMobile && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg
                  className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => isMobile && onClose()}
                className={`flex items-center space-x-3 px-4 py-3 transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                title={isCollapsed && !isMobile ? item.name : ''}
              >
                <span className="text-xl flex-shrink-0 ">{typeof item.icon === 'string' ? item.icon : <item.icon />}</span>
                {(!isCollapsed || isMobile) && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`flex items-center space-x-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
              isCollapsed && !isMobile ? 'justify-center' : ''
            }`}
            title={isCollapsed && !isMobile ? 'Logout' : ''}
          >
            <span className="text-xl"><MdLogout /></span>
            {(!isCollapsed || isMobile) && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
