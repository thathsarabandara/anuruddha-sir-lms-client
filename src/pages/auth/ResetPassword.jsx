import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash, FaGraduationCap, FaCheckCircle, FaTimes, FaCheck } from 'react-icons/fa';
import { authAPI } from '../../api';
import { ROUTES } from '../../utils/constants';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const roleParam = searchParams.get('role') || 'STUDENT';
  const initialRole = roleParam.toUpperCase();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenValid(false);
        setVerifying(false);
        return;
      }

      try {
        const response = await authAPI.verifyResetToken({ token });
        if (response.data.valid) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setError('This password reset link is invalid or has expired.');
        }
      } catch (err) {
        setTokenValid(false);
        setError(err.message || 'This password reset link is invalid or has expired.');
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const roleColors = {
    STUDENT: 'from-blue-500 to-blue-600',
    TEACHER: 'from-green-500 to-green-600',
    ADMIN: 'from-purple-500 to-purple-600',
    DEVELOPER: 'from-red-500 to-red-600',
    SUPER_ADMIN: 'from-yellow-500 to-orange-500'
  };

  const currentGradient = roleColors[initialRole] || roleColors.STUDENT;



  const gradientStyles = {
    'from-blue-500 to-blue-600': 'linear-gradient(to right, #3b82f6, #2563eb)',
    'from-green-500 to-green-600': 'linear-gradient(to right, #10b981, #059669)',
    'from-purple-500 to-purple-600': 'linear-gradient(to right, #a855f7, #9333ea)',
    'from-red-500 to-red-600': 'linear-gradient(to right, #ef4444, #dc2626)',
    'from-yellow-500 to-orange-500': 'linear-gradient(to right, #eab308, #f97316)',
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
  };

  const validateField = (fieldName, value) => {
    let error = '';

    switch (fieldName) {
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
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Confirm password is required';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;

      default:
        break;
    }

    setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      errors.password = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one number';
    } else if (!/(?=.*[@$!%*?&#])/.test(formData.password)) {
      errors.password = 'Password must contain at least one special character (@$!%*?&#)';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
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
      await authAPI.resetPassword({
        token,
        password: formData.password,
        confirm_password: formData.confirmPassword,
      });

      // Redirect to login with success message
      navigate(`${ROUTES.LOGIN}?role=${initialRole.toLowerCase()}`, {
        state: { message: 'Password reset successful. Please login with your new password.' },
      });
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="reset-password-card max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-12 w-12 text-gray-900" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-gray-600">Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="reset-password-card max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Invalid Reset Link</h2>
            <p className="text-gray-600 mb-8">
              This password reset link is invalid or has expired.
            </p>
            <Link 
              to={`${ROUTES.FORGOT_PASSWORD}?role=${initialRole.toLowerCase()}`}
              className="inline-block w-full text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.01] transition-all duration-200"
              style={{ background: gradientStyles[currentGradient] }}
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="reset-password-card max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 mb-8 group">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform"
            style={{ background: gradientStyles[currentGradient] }}
          >
            <FaGraduationCap className="text-white text-xl" />
          </div>
          <span className="font-bold text-xl text-gray-900">Anuruddha Sir</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">
            Choose a strong password to secure your account.
          </p>
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
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => {
                  handleChange(e);
                  validateField('password', e.target.value);
                }}
                className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-offset-0 transition-all ${
                  fieldErrors.password 
                    ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                    : formData.password && !fieldErrors.password
                    ? 'border-green-500 focus:ring-green-500 bg-green-50'
                    : 'border-gray-300 focus:ring-gray-900'
                }`}
                placeholder="••••••••"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1">
                {formData.password && (
                  fieldErrors.password ? (
                    <FaTimes className="text-red-500 text-lg" />
                  ) : (
                    <FaCheck className="text-green-500 text-lg" />
                  )
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex="-1"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Password Strength Meter */}
            {formData.password && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">Password Strength</span>
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
                      className={`h-2 flex-1 rounded-full transition-all ${
                        bar <= getPasswordStrength(formData.password).strength
                          ? getPasswordStrength(formData.password).color
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Password Requirements Checklist */}
            {formData.password && (
              <div className="mt-3 space-y-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {formData.password.length >= 8 ? (
                    <FaCheck className="text-green-500 text-sm flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 border border-gray-300 rounded-full flex-shrink-0" />
                  )}
                  <span className={`text-xs ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/(?=.*[a-z])/.test(formData.password) ? (
                    <FaCheck className="text-green-500 text-sm flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 border border-gray-300 rounded-full flex-shrink-0" />
                  )}
                  <span className={`text-xs ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                    One lowercase letter
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/(?=.*[A-Z])/.test(formData.password) ? (
                    <FaCheck className="text-green-500 text-sm flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 border border-gray-300 rounded-full flex-shrink-0" />
                  )}
                  <span className={`text-xs ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                    One uppercase letter
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/(?=.*\d)/.test(formData.password) ? (
                    <FaCheck className="text-green-500 text-sm flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 border border-gray-300 rounded-full flex-shrink-0" />
                  )}
                  <span className={`text-xs ${/(?=.*\d)/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                    One number
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/(?=.*[@$!%*?&#])/.test(formData.password) ? (
                    <FaCheck className="text-green-500 text-sm flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 border border-gray-300 rounded-full flex-shrink-0" />
                  )}
                  <span className={`text-xs ${/(?=.*[@$!%*?&#])/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                    One special character (@$!%*?&#)
                  </span>
                </div>
              </div>
            )}

            {fieldErrors.password && (
              <p className="mt-2 text-sm text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={(e) => {
                  handleChange(e);
                  validateField('confirmPassword', e.target.value);
                }}
                className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-offset-0 transition-all ${
                  fieldErrors.confirmPassword 
                    ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                    : formData.confirmPassword && !fieldErrors.confirmPassword && formData.confirmPassword === formData.password
                    ? 'border-green-500 focus:ring-green-500 bg-green-50'
                    : 'border-gray-300 focus:ring-gray-900'
                }`}
                placeholder="••••••••"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1">
                {formData.confirmPassword && (
                  formData.confirmPassword === formData.password && !fieldErrors.confirmPassword ? (
                    <FaCheck className="text-green-500 text-lg" />
                  ) : formData.confirmPassword !== formData.password || fieldErrors.confirmPassword ? (
                    <FaTimes className="text-red-500 text-lg" />
                  ) : null
                )}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
            style={{ background: gradientStyles[currentGradient] }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Resetting Password...
              </span>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
