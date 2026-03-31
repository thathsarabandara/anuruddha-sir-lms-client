import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaUser, FaCog, FaSignOutAlt, FaShoppingCart } from 'react-icons/fa';
import { FaGem } from 'react-icons/fa';
import { logout } from '../../app/slices/authSlice';
import { ROUTES, ROLES } from '../../utils/constants';
import gsap from 'gsap';
import { CiMenuBurger } from 'react-icons/ci';

const DashboardTopBar = ({ onMenuToggle }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications] = useState(3);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Animate dropdown
  useEffect(() => {
    if (isDropdownOpen && dropdownRef.current) {
      gsap.fromTo(
        dropdownRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }
      );
    }
  }, [isDropdownOpen]);

  const getUserInitial = () => {
    return user?.first_name?.charAt(0).toUpperCase() || 'U';
  };

  const profileImageUrl = user?.profile_picture
    ? `${user.profile_picture}`
    : null;
  const isStudent = user?.role === ROLES.STUDENT;

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8 py-2.5 relative">
        <div className="flex items-center justify-between">
          {/* Left Side - Menu Toggle & Welcome */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <CiMenuBurger className="text-xl text-gray-600" />
            </button>

            <div className="hidden sm:block">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="text-lg font-bold text-gray-900">
                {user?.first_name} {user?.last_name}
              </p>
            </div>

          {/* Notifications Panel (separate from profile dropdown) */}
          {isNotificationsOpen && (
            <div ref={notificationsRef} className="absolute right-0 top-14  mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
              <div className="p-4 border-b border-gray-100">
                <p className="font-semibold">Notifications</p>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600">You have {notifications} notifications.</p>
                <div className="mt-3 space-y-2">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm">No new notifications.</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 p-3 text-right">
                <button className="text-sm text-primary-600 font-medium">View All</button>
              </div>
            </div>
          )}
          </div>

          {/* Right Side - Cart, Gems, Notifications & Profile */}
          <div className="flex items-center gap-6">
                        {/* Gems Display (students only) */}
                        {isStudent && (
                          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200 hover:border-amber-300 transition-all">
                            <FaGem className="text-lg text-amber-500 animate-pulse" />
                            <span className="font-bold text-amber-900">560</span>
                            <span className="text-xs text-amber-700 ml-1">Gems</span>
                          </div>
                        )}

            {/* Notification Bell */}
            <button
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group"
              onClick={() => {
                setIsNotificationsOpen((s) => !s);
                setIsDropdownOpen(false);
              }}
            >
              <FaBell className="text-xl text-gray-600 group-hover:text-primary-600" />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {notifications}
                </span>
              )}
            </button>
            {/* Shopping Cart Icon (students only) */}
            {isStudent && (
              <button
                onClick={() => navigate(ROUTES.STUDENT_CART)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                title="Shopping Cart"
              >
                <FaShoppingCart className="text-xl text-gray-600 group-hover:text-primary-600" />
                <span className="absolute top-0 right-0 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  2
                </span>
              </button>
            )}

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt={user?.first_name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-primary-200"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white font-bold text-sm">
                    {getUserInitial()}
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                  {/* User Info Header */}
                  <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-4">
                    <div className="flex items-center gap-3">
                      {profileImageUrl ? (
                        <img
                          src={profileImageUrl}
                          alt={user?.first_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center text-xl font-bold">
                          {getUserInitial()}
                        </div>
                      )}
                      <div>
                        <p className="font-bold">{user?.first_name} {user?.last_name}</p>
                        <p className="text-xs opacity-90">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* (notifications panel moved outside profile dropdown) */}

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate(ROUTES.STUDENT_PROFILE);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                    >
                      <FaUser className="w-4 h-4" />
                      <span>View Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate(ROUTES.STUDENT_PROFILE);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                    >
                      <FaCog className="w-4 h-4" />
                      <span>Settings</span>
                    </button>

                    <div className="border-t border-gray-200 my-2"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                      <FaSignOutAlt className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTopBar;
