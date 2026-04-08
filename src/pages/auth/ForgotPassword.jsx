import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaEnvelope, FaGraduationCap, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { authAPI } from '../../api';
import { ROUTES } from '../../utils/constants';
import ButtonWithLoader from '../../components/common/ButtonWithLoader';
import { isValidEmail } from '../../utils/helpers';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') || 'STUDENT';
  const initialRole = roleParam.toUpperCase();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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



  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Navigate available:', navigate);

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authAPI.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="forgot-password-card max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: gradientStyles[currentGradient] }}>
              <FaCheckCircle className="text-white text-4xl" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Check Your Email</h2>
            <p className="text-gray-600 mb-2">
              We've sent a password reset link to
            </p>
            <p className="font-semibold text-gray-900 mb-6">{email}</p>
            <p className="text-sm text-gray-500 mb-8">
              Please check your inbox and click the link to reset your password.
            </p>
            
            <Link 
              to={`${ROUTES.LOGIN}?role=${roleParam.toLowerCase()}`}
              className="inline-flex items-center justify-center gap-2 w-full text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.01] transition-all duration-200"
              style={{ background: gradientStyles[currentGradient] }}
            >
              <FaArrowLeft className="text-sm" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="forgot-password-card max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 mb-8 group">
          <img src='/assets/images/logo.png' alt='logo' className='w-10 h-10'/>
          <span className="font-bold text-xl text-gray-900">Anuruddha Sir</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
          <p className="text-gray-600">
            No worries! Enter your email and we'll send you reset instructions.
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:ring-gray-900 focus:border-transparent transition-all"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <ButtonWithLoader
            type="submit"
            label="Send Reset Link"
            loadingLabel="Sending..."
            isLoading={loading}
            fullWidth
            style={{ background: gradientStyles[currentGradient] }}
            className="text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.01] disabled:transform-none"
          />
        </form>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link 
            to={`${ROUTES.LOGIN}?role=${roleParam.toLowerCase()}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft className="text-xs" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
