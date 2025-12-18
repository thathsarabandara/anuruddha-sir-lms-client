import { useState, useEffect, useTransition } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [, startTransition] = useTransition();
  const location = useLocation();

  useEffect(() => {
    // Start loading when route changes
    startTransition(() => setIsLoading(true));

    // Simulate loading completion
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // Show loader for 1.2 seconds

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return { isLoading };
};
