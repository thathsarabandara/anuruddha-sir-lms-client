import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaGraduationCap, FaEnvelope, FaRedo } from 'react-icons/fa';
import { loginSuccess } from '../../app/slices/authSlice';
import { authAPI } from '../../api';
import { ROUTES } from '../../utils/constants';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const roleParam = searchParams.get('role') || 'STUDENT';
  const initialRole = roleParam.toUpperCase();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const roleColors = {
    STUDENT: 'from-blue-500 to-blue-600',
    TEACHER: 'from-green-500 to-green-600',
    ADMIN: 'from-purple-500 to-purple-600',
    DEVELOPER: 'from-red-500 to-red-600',
    SUPER_ADMIN: 'from-yellow-500 to-orange-500'
  };

  const currentGradient = roleColors[initialRole] || roleColors.STUDENT;

  useEffect(() => {
    if (!email) {
      navigate(`${ROUTES.REGISTER}?role=${roleParam.toLowerCase()}`);
    }
  }, [email, navigate, roleParam]);

  const gradientStyles = {
    'from-blue-500 to-blue-600': 'linear-gradient(to right, #3b82f6, #2563eb)',
    'from-green-500 to-green-600': 'linear-gradient(to right, #10b981, #059669)',
    'from-purple-500 to-purple-600': 'linear-gradient(to right, #a855f7, #9333ea)',
    'from-red-500 to-red-600': 'linear-gradient(to right, #ef4444, #dc2626)',
    'from-yellow-500 to-orange-500': 'linear-gradient(to right, #eab308, #f97316)',
  };

  const handleChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.verifyOTP({ email, otp: otpCode });
      const { token, user } = response.data;

      dispatch(loginSuccess({ token, user }));

      // Redirect to student dashboard (default role after registration)
      navigate(ROUTES.STUDENT_DASHBOARD);
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    setResendSuccess(false);

    try {
      await authAPI.resendOTP({ email });
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="verify-otp-card max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
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
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: gradientStyles[currentGradient] }}>
            <FaEnvelope className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            Enter the 6-digit code we sent to
          </p>
          <p className="font-semibold text-gray-900 mt-1">{email}</p>
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

        {/* Success Message */}
        {resendSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-green-600">OTP has been resent to your email</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{ background: gradientStyles[currentGradient] }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verifying...
              </span>
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>

        {/* Resend Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">
            Didn't receive the code?
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaRedo className={`text-xs ${resendLoading ? 'animate-spin' : ''}`} />
            {resendLoading ? 'Sending...' : 'Resend Code'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
