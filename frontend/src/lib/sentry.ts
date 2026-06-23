import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

let sentryInitialized = false;

export const initSentry = (dsn: string): void => {
  if (!dsn || sentryInitialized) {
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE,
    integrations: [
      new BrowserTracing(),
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,
  });

  sentryInitialized = true;
};

export const captureException = (error: unknown, context?: Record<string, unknown>): void => {
  Sentry.captureException(error, {
    contexts: context ? { custom: context } : undefined,
  });
};
