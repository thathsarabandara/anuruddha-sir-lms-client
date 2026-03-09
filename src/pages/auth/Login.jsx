import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGraduationCap, FaChalkboardTeacher, FaUserShield, FaCode, FaCrown } from 'react-icons/fa';
import { authAPI } from '../../api';
import { loginSuccess, loginStart, loginFailure } from '../../app/slices/authSlice';
import { ROUTES, getDashboardRoute } from '../../utils/constants';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector(state => state.auth);
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') || 'STUDENT';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: roleParam.toUpperCase()
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Monitor Redux auth state changes
  useEffect(() => {
    console.log('Auth State Updated:', authState);
    if (authState.isAuthenticated && authState.token && authState.user) {
      console.log('User authenticated, navigating...');
    }
  }, [authState]);

  useEffect(() => {
    // Update role from URL parameter
    const role = roleParam.toUpperCase();
    if (['STUDENT', 'TEACHER', 'ADMIN', 'DEVELOPER', 'SUPER_ADMIN'].includes(role)) {
      setFormData(prev => ({ ...prev, role }));
    }
  }, [roleParam]);



  const roles = [
    { 
      value: 'STUDENT', 
      label: 'Student', 
      icon: FaGraduationCap, 
      gradient: 'from-blue-500 to-blue-600',
      image: '/assets/images/auth/student-login.png',
      title: 'Welcome Back, Student!',
      subtitle: 'Continue your learning journey'
    },
    { 
      value: 'TEACHER', 
      label: 'Teacher', 
      icon: FaChalkboardTeacher, 
      gradient: 'from-green-500 to-green-600',
      image: '/assets/images/auth/teacher-login.png',
      title: 'Welcome Back, Teacher!',
      subtitle: 'Inspire minds, shape futures'
    },
    { 
      value: 'ADMIN', 
      label: 'Admin', 
      icon: FaUserShield, 
      gradient: 'from-purple-500 to-purple-600',
      image: '/assets/images/auth/admin-login.png',
      title: 'Welcome Back, Admin!',
      subtitle: 'Manage your platform'
    },
    { 
      value: 'DEVELOPER', 
      label: 'Developer', 
      icon: FaCode, 
      gradient: 'from-red-500 to-red-600',
      image: '/assets/images/auth/developer-login.png',
      title: 'Welcome Back, Developer!',
      subtitle: 'Build amazing features'
    },
    { 
      value: 'SUPER_ADMIN', 
      label: 'Super Admin', 
      icon: FaCrown, 
      gradient: 'from-yellow-500 to-orange-500',
      image: '/assets/images/auth/admin-login.png',
      title: 'Welcome Back, Super Admin!',
      subtitle: 'Full system control'
    }
  ];

  const currentRole = roles.find(r => r.value === formData.role) || roles[0];

  const gradientStyles = {
    'from-blue-500 to-blue-600': 'linear-gradient(to right, #3b82f6, #2563eb)',
    'from-green-500 to-green-600': 'linear-gradient(to right, #10b981, #059669)',
    'from-purple-500 to-purple-600': 'linear-gradient(to right, #a855f7, #9333ea)',
    'from-red-500 to-red-600': 'linear-gradient(to right, #ef4444, #dc2626)',
    'from-yellow-500 to-orange-500': 'linear-gradient(to right, #eab308, #f97316)',
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(loginStart());
    setError('');

    try {
      const response = await authAPI.login(formData);
      console.log('Login Response:', response.data); // Debug log
      
      let { token, user } = response.data;
      
      // Validate response data
      if (!token || !user) {
        throw new Error('Invalid response: Missing token or user data');
      }
      
      // Normalize user object from backend response
      // Handle all role types: STUDENT, TEACHER, ADMIN, DEVELOPER, SUPER_ADMIN
      const normalizedUser = {
        // Core fields (all roles)
        id: user.user_id || user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role.toUpperCase(),
        phone_number: user.phone_number || null,
        profile_picture: user.profile_picture || null,
        address: user.address || null,
        
        // Student-specific fields
        date_of_birth: user.date_of_birth || null,
        grade_level: user.grade_level || null,
        school: user.school || null,
        parent_name: user.parent_name || null,
        parent_contact: user.parent_contact || null,
        
        // Teacher-specific fields
        qualifications: user.qualifications || null,
        subjects_taught: user.subjects_taught || null,
        years_of_experience: user.years_of_experience || null,
        bio: user.bio || null,
        // Language preference (both student & teacher)
        language: user.language || null,
        
        // Admin/Developer/Super Admin fields (can be extended later)
        permissions: user.permissions || null,
        department: user.department || null,
      };
      
      dispatch(loginSuccess({ token, user: normalizedUser }));
      
      // Store token expiry time (2 hours from now as per backend)
      const tokenExpiryTime = Date.now() + (2 * 60 * 60 * 1000); // 2 hours
      localStorage.setItem('lms_token_expiry', tokenExpiryTime.toString());
      localStorage.setItem('lms_login_time', Date.now().toString());
      
      // Navigate based on role using helper function
      const dashboardRoute = getDashboardRoute(normalizedUser.role);
      
      setTimeout(() => {
        navigate(dashboardRoute);
      }, 500);
    } catch (err) {
      console.error('Login Error:', err); // Debug log
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      dispatch(loginFailure(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-7xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Form Section */}
          <div className="login-form p-8 lg:p-12 flex flex-col justify-center">
            {/* Logo */}
            <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 mb-8 group">
              <img src='/assets/images/logo.png' alt='logo' className='w-10 h-10'/>
              <span className="font-bold text-xl text-gray-900">Anuruddha Sir</span>
            </Link>

            {/* Title */}
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{currentRole.title}</h1>
              <p className="text-gray-600">{currentRole.subtitle}</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:ring-gray-900 focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:ring-gray-900 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link 
                  to={ROUTES.FORGOT_PASSWORD} 
                  state={{ role: formData.role }}
                  className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{ background: gradientStyles[currentRole.gradient] }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {(formData.role === 'STUDENT' || formData.role === 'TEACHER') && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    to={`${ROUTES.REGISTER}?role=${formData.role.toLowerCase()}`}
                    className="font-semibold text-gray-900 hover:text-gray-700 transition-colors"
                  >
                    Create one now
                  </Link>
                </p>
              </div>
            )}
          </div>

          {/* Image Section */}
          <div className="login-image hidden lg:flex items-center justify-center relative overflow-hidden" style={{ background: gradientStyles[currentRole.gradient] }}>
              <img 
                src={currentRole.image} 
                alt={currentRole.label}
                className="w-full h-full object-cover drop-shadow-2xl"
              />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
