import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaClock } from 'react-icons/fa';
import { ROUTES } from '../../utils/constants';

const HOLD_SECONDS = 20;

const AccountPending = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const roleParam = (searchParams.get('role') || 'student').toUpperCase();

  const [secondsLeft, setSecondsLeft] = useState(HOLD_SECONDS);

  const roleColors = {
    STUDENT: {
      gradient: 'linear-gradient(to right, #0073e6, #005bb3)',
      soft: 'bg-primary-50 border-primary-100',
      text: 'text-primary-700',
    },
    TEACHER: {
      gradient: 'linear-gradient(to right, #00a85a, #008347)',
      soft: 'bg-secondary-50 border-secondary-100',
      text: 'text-secondary-700',
    },
  };

  const palette = roleColors[roleParam] || roleColors.STUDENT;

  const progressPercent = useMemo(
    () => ((HOLD_SECONDS - secondsLeft) / HOLD_SECONDS) * 100,
    [secondsLeft]
  );

  useEffect(() => {
    if (secondsLeft <= 0) {
      navigate(ROUTES.HOME, { replace: true });
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [secondsLeft, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-sm p-8 md:p-10">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: palette.gradient }}
          >
            <FaCheckCircle className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Account Created Successfully</h1>
            <p className="text-slate-600 text-sm md:text-base">Your account is now waiting for admin approval.</p>
          </div>
        </div>

        <div className={`rounded-xl border p-4 mb-6 ${palette.soft}`}>
          <p className={`font-medium ${palette.text}`}>
            After admin approval, you will get access to the system.
          </p>
          {email && <p className="text-sm text-slate-600 mt-1">Registered email: {email}</p>}
        </div>

        <div className="mb-7">
          <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
            <span className="inline-flex items-center gap-2"><FaClock /> Temporary page closes in</span>
            <span className="font-semibold text-slate-900">{secondsLeft}s</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%`, background: palette.gradient }}
            />
          </div>
        </div>

        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center justify-center w-full rounded-lg px-4 py-3 text-white font-semibold transition-opacity hover:opacity-90"
          style={{ background: palette.gradient }}
        >
          Go To Home
        </Link>
      </div>
    </div>
  );
};

export default AccountPending;
