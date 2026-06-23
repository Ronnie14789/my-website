import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initializedMeasurementId: string | null = null;

export const initGA = (measurementId: string): void => {
  if (!measurementId || initializedMeasurementId === measurementId) {
    return;
  }

  const existingScript = document.querySelector(`script[src*="gtag/js?id=${measurementId}"]`);
  if (!existingScript) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    ((...args: unknown[]) => {
      window.dataLayer.push(args);
    });

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_path: window.location.pathname,
    anonymize_ip: true,
    send_page_view: false,
  });

  initializedMeasurementId = measurementId;
};

export const trackEvent = (eventName: string, eventParams?: Record<string, unknown>): void => {
  window.gtag?.('event', eventName, eventParams);
};

export const trackPageView = (pagePath: string, pageTitle?: string): void => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId || !window.gtag) {
    return;
  }

  window.gtag('config', measurementId, {
    page_path: pagePath,
    page_title: pageTitle,
  });
};

export const usePageTracking = (): void => {
  const location = useLocation();

  useEffect(() => {
    const pagePath = `${location.pathname}${location.search}`;
    trackPageView(pagePath, document.title);
  }, [location.pathname, location.search]);
};
