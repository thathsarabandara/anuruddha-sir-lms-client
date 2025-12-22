import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaGraduationCap, FaChalkboardTeacher, FaCheck, FaTimes } from 'react-icons/fa';
import { authAPI } from '../../api';
import { ROUTES, getAuthRoute } from '../../utils/constants';
import { isValidEmail, isValidPhone } from '../../utils/helpers';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') || 'STUDENT';
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: roleParam.toUpperCase()
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    // Update role from URL parameter
    const role = roleParam.toUpperCase();
    if (['STUDENT', 'TEACHER'].includes(role)) {
      setFormData(prev => ({ ...prev, role }));
    } else {
      // Redirect to student registration if invalid role
      navigate(`${ROUTES.REGISTER}?role=student`, { replace: true });
    }
  }, [roleParam, navigate]);



  const roles = [
    { 
      value: 'STUDENT', 
      label: 'Student', 
      icon: FaGraduationCap, 
      gradient: 'from-blue-500 to-blue-600',
      image: '/assets/images/auth/student-register.png',
      title: 'Start Your Learning Journey',
      subtitle: 'Join thousands of successful students'
    },
    { 
      value: 'TEACHER', 
      label: 'Teacher', 
      icon: FaChalkboardTeacher, 
      gradient: 'from-green-500 to-green-600',
      image: '/assets/images/auth/teacher-register.png',
      title: 'Share Your Knowledge',
      subtitle: 'Empower students with your expertise'
    }
  ];

  const currentRole = roles.find(r => r.value === formData.role) || roles[0];

  const gradientStyles = {
    'from-blue-500 to-blue-600': 'linear-gradient(to right, #3b82f6, #2563eb)',
    'from-green-500 to-green-600': 'linear-gradient(to right, #10b981, #059669)',
  };

  // Helper to get input state (valid/invalid/default)
  const getInputState = (fieldName) => {
    const value = formData[fieldName];
    const error = fieldErrors[fieldName];
    
    if (!value) return 'default';
    if (error) return 'invalid';
    return 'valid';
  };

  const getInputClassName = (fieldName) => {
    const state = getInputState(fieldName);
    const baseClasses = 'block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-offset-0 transition-all';
    
    if (state === 'invalid') {
      return `${baseClasses} border-red-500 focus:ring-red-500 focus:border-transparent bg-red-50`;
    }
    if (state === 'valid') {
      return `${baseClasses} border-green-500 focus:ring-green-500 focus:border-transparent bg-green-50`;
    }
    return `${baseClasses} border-gray-300 focus:ring-gray-900 focus:border-transparent`;
  };

  // Password strength calculator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /(?=.*[a-z])/.test(password),
      uppercase: /(?=.*[A-Z])/.test(password),
      number: /(?=.*\d)/.test(password),
      special: /(?=.*[@$!%*?&#])/.test(password),
    };
    
    strength = Object.values(checks).filter(Boolean).length;
    
    if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
    if (strength === 3) return { strength, label: 'Fair', color: 'bg-yellow-500' };
    if (strength === 4) return { strength, label: 'Good', color: 'bg-blue-500' };
    return { strength, label: 'Strong', color: 'bg-green-500' };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
    
    // Live validation
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let error = '';

    switch (fieldName) {
      case 'firstName':
        if (!value.trim()) {
          error = 'First name is required';
        } else if (value.trim().length < 2) {
          error = 'First name must be at least 2 characters';
        }
        break;

      case 'lastName':
        if (!value.trim()) {
          error = 'Last name is required';
        } else if (value.trim().length < 2) {
          error = 'Last name must be at least 2 characters';
        }
        break;

      case 'email':
        if (!value) {
          error = 'Email is required';
        } else if (!isValidEmail(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'phone':
        if (!value) {
          error = 'Phone number is required';
        } else if (!isValidPhone(value)) {
          error = 'Please enter a valid Sri Lankan phone number (e.g., 0771234567)';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = 'Password must contain at least one lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*\d)/.test(value)) {
          error = 'Password must contain at least one number';
        } else if (!/(?=.*[@$!%*?&#])/.test(value)) {
          error = 'Password must contain at least one special character (@$!%*?&#)';
        }
        // Also validate confirm password if it has value
        if (formData.confirmPassword) {
          validateField('confirmPassword', formData.confirmPassword);
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;

      default:
        break;
    }

    setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
    return error === '';
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!isValidPhone(formData.phone)) {
      errors.phone = 'Please enter a valid Sri Lankan phone number';
    }

    if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      errors.password = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one number';
    } else if (!/(?=.*[@$!%*?&#])/.test(formData.password)) {
      errors.password = 'Password must contain at least one special character';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...registerData } = formData;
      
      await authAPI.register(registerData);

      // Redirect to OTP verification
      navigate(`${ROUTES.VERIFY_OTP}?email=${formData.email}&role=${formData.role.toLowerCase()}`);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-7xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[700px]">
          {/* Form Section */}
          <div className="register-form p-8 lg:p-12 flex flex-col justify-center overflow-y-auto ">
            {/* Logo */}
            <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 mb-6 group">
              <img src='/assets/images/logo.png' alt='logo' className='w-10 h-10'/>
              <span className="font-bold text-xl text-gray-900">Anuruddha Sir</span>
            </Link>

            {/* Title */}
            <div className="mb-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{currentRole.title}</h1>
              <p className="text-gray-600">{currentRole.subtitle}</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className={getInputState('firstName') === 'invalid' ? 'text-red-400' : getInputState('firstName') === 'valid' ? 'text-green-400' : 'text-gray-400'} />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className={getInputClassName('firstName')}
                      placeholder="John"
                    />
                    {formData.firstName && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        {getInputState('firstName') === 'valid' ? (
                          <FaCheck className="text-green-500" />
                        ) : getInputState('firstName') === 'invalid' ? (
                          <FaTimes className="text-red-500" />
                        ) : null}
                      </div>
                    )}
                  </div>
                  {fieldErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FaTimes className="flex-shrink-0" />
                      {fieldErrors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className={getInputState('lastName') === 'invalid' ? 'text-red-400' : getInputState('lastName') === 'valid' ? 'text-green-400' : 'text-gray-400'} />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className={getInputClassName('lastName')}
                      placeholder="Doe"
                    />
                    {formData.lastName && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        {getInputState('lastName') === 'valid' ? (
                          <FaCheck className="text-green-500" />
                        ) : getInputState('lastName') === 'invalid' ? (
                          <FaTimes className="text-red-500" />
                        ) : null}
                      </div>
                    )}
                  </div>
                  {fieldErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FaTimes className="flex-shrink-0" />
                      {fieldErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className={getInputState('email') === 'invalid' ? 'text-red-400' : getInputState('email') === 'valid' ? 'text-green-400' : 'text-gray-400'} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={getInputClassName('email')}
                    placeholder="john@example.com"
                  />
                  {formData.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {getInputState('email') === 'valid' ? (
                        <FaCheck className="text-green-500" />
                      ) : getInputState('email') === 'invalid' ? (
                        <FaTimes className="text-red-500" />
                      ) : null}
                    </div>
                  )}
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FaTimes className="flex-shrink-0" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className={getInputState('phone') === 'invalid' ? 'text-red-400' : getInputState('phone') === 'valid' ? 'text-green-400' : 'text-gray-400'} />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className={getInputClassName('phone')}
                    placeholder="0771234567"
                  />
                  {formData.phone && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {getInputState('phone') === 'valid' ? (
                        <FaCheck className="text-green-500" />
                      ) : getInputState('phone') === 'invalid' ? (
                        <FaTimes className="text-red-500" />
                      ) : null}
                    </div>
                  )}
                </div>
                {fieldErrors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FaTimes className="flex-shrink-0" />
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className={getInputState('password') === 'invalid' ? 'text-red-400' : getInputState('password') === 'valid' ? 'text-green-400' : 'text-gray-400'} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={getInputClassName('password')}
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                    {formData.password && getInputState('password') === 'valid' && (
                      <FaCheck className="text-green-500" />
                    )}
                    {formData.password && getInputState('password') === 'invalid' && (
                      <FaTimes className="text-red-500" />
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Password Strength:</span>
                      <span className={`text-xs font-semibold ${
                        getPasswordStrength(formData.password).strength <= 2 ? 'text-red-600' :
                        getPasswordStrength(formData.password).strength === 3 ? 'text-yellow-600' :
                        getPasswordStrength(formData.password).strength === 4 ? 'text-blue-600' :
                        'text-green-600'
                      }`}>
                        {getPasswordStrength(formData.password).label}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((bar) => (
                        <div
                          key={bar}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            bar <= getPasswordStrength(formData.password).strength
                              ? getPasswordStrength(formData.password).color
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Password Requirements */}
                {formData.password && (
                  <div className="mt-3 space-y-1.5">
                    <p className="text-xs font-medium text-gray-700">Password must contain:</p>
                    <div className="space-y-1">
                      <div className={`flex items-center gap-2 text-xs ${
                        formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {formData.password.length >= 8 ? (
                          <FaCheck className="flex-shrink-0" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border-2 border-gray-300 flex-shrink-0" />
                        )}
                        <span>At least 8 characters</span>
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${
                        /(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {/(?=.*[a-z])/.test(formData.password) ? (
                          <FaCheck className="flex-shrink-0" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border-2 border-gray-300 flex-shrink-0" />
                        )}
                        <span>One lowercase letter (a-z)</span>
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${
                        /(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {/(?=.*[A-Z])/.test(formData.password) ? (
                          <FaCheck className="flex-shrink-0" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border-2 border-gray-300 flex-shrink-0" />
                        )}
                        <span>One uppercase letter (A-Z)</span>
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${
                        /(?=.*\d)/.test(formData.password) ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {/(?=.*\d)/.test(formData.password) ? (
                          <FaCheck className="flex-shrink-0" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border-2 border-gray-300 flex-shrink-0" />
                        )}
                        <span>One number (0-9)</span>
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${
                        /(?=.*[@$!%*?&#])/.test(formData.password) ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {/(?=.*[@$!%*?&#])/.test(formData.password) ? (
                          <FaCheck className="flex-shrink-0" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border-2 border-gray-300 flex-shrink-0" />
                        )}
                        <span>One special character (@$!%*?&#)</span>
                      </div>
                    </div>
                  </div>
                )}

                {fieldErrors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <FaTimes className="flex-shrink-0" />
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className={getInputState('confirmPassword') === 'invalid' ? 'text-red-400' : getInputState('confirmPassword') === 'valid' ? 'text-green-400' : 'text-gray-400'} />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={getInputClassName('confirmPassword')}
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                    {formData.confirmPassword && getInputState('confirmPassword') === 'valid' && (
                      <FaCheck className="text-green-500" />
                    )}
                    {formData.confirmPassword && getInputState('confirmPassword') === 'invalid' && (
                      <FaTimes className="text-red-500" />
                    )}
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FaTimes className="flex-shrink-0" />
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
                style={{ background: gradientStyles[currentRole.gradient] }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  to={getAuthRoute('login', formData.role.toLowerCase())}
                  className="font-semibold text-gray-900 hover:text-gray-700 transition-colors"
                >
                  Sign in instead
                </Link>
              </p>
            </div>
          </div>

          {/* Image Section */}
          <div className="register-image hidden lg:flex items-center justify-centerrelative overflow-hidden" style={{ background: gradientStyles[currentRole.gradient] }}>
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

export default Register;
