import { useEffect } from 'react';
import { onCLS, onFID, onLCP } from 'web-vitals';
import { trackEvent } from '@/lib/analytics';

export const usePerformanceMetrics = (): void => {
  useEffect(() => {
    onLCP(({ value }) => {
      trackEvent('web_vitals', { metric: 'LCP', value });
    });

    onFID(({ value }) => {
      trackEvent('web_vitals', { metric: 'FID', value });
    });

    onCLS(({ value }) => {
      trackEvent('web_vitals', { metric: 'CLS', value });
    });
  }, []);
};
