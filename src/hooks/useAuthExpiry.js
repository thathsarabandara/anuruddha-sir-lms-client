import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../app/slices/authSlice';
import { STORAGE_KEYS } from '../utils/constants';

export const useAuthExpiry = () => {
  const dispatch = useDispatch();
  const { access_token, isAuthenticated } = useSelector((state) => state.auth);
  const checkIntervalRef = useRef(null);
  const warningShownRef = useRef(false);

  // Token expiry checking effect
  useEffect(() => {
    if (!isAuthenticated || !access_token) {
      warningShownRef.current = false;
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      return;
    }

    const checkTokenExpiry = () => {
      try {
        const tokenExpiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
        
        if (!tokenExpiry) {
          return;
        }

        const expiryTime = parseInt(tokenExpiry);
        const now = Date.now();
        const timeDiff = expiryTime - now;

        if (timeDiff <= 0) {
          console.warn('Token expired - logging out');
          dispatch(logout());
          warningShownRef.current = false;
        } else if (timeDiff < 30 * 60 * 1000 && !warningShownRef.current) {
          console.warn(`Token will expire in ${Math.floor(timeDiff / 60000)} minutes`);
          warningShownRef.current = true;
        }
      } catch (error) {
        console.error('Error checking token expiry:', error);
      }
    };

    // Check immediately on load
    checkTokenExpiry();

    // Then check periodically
    checkIntervalRef.current = setInterval(checkTokenExpiry, 60000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [isAuthenticated, access_token, dispatch]);
};

export default useAuthExpiry;
