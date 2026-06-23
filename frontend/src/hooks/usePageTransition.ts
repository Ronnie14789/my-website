import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
} as const;

export const usePageTransition = () => {
  const location = useLocation();
  return useMemo(
    () => ({ key: location.pathname, variants: pageVariants, transition: pageTransition }),
    [location]
  );
};
