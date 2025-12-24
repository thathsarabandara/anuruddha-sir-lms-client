import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../app/slices/authSlice';
import { STORAGE_KEYS } from '../utils/constants';

export const useAuthExpiry = () => {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const checkIntervalRef = useRef(null);
  const warningShownRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
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
          const loginTime = localStorage.getItem(STORAGE_KEYS.LOGIN_TIME);
          if (loginTime) {
            const loginTimeMs = parseInt(loginTime);
            const now = Date.now();
            const twoHoursMs = 2 * 60 * 60 * 1000;
            
            if (now - loginTimeMs > twoHoursMs) {
              dispatch(logout());
              return;
            }
            const timeUntilExpiry = twoHoursMs - (now - loginTimeMs);
            if (timeUntilExpiry < 30 * 60 * 1000 && !warningShownRef.current) {
              console.warn('Token will expire in less than 30 minutes');
              warningShownRef.current = true;
            }
          }
          return;
        }

        const expiryTime = parseInt(tokenExpiry);
        const now = Date.now();
        const timeDiff = expiryTime - now;

        if (timeDiff <= 0) {
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

    checkTokenExpiry();

    checkIntervalRef.current = setInterval(checkTokenExpiry, 60000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [isAuthenticated, token, dispatch]);
};

export default useAuthExpiry;
