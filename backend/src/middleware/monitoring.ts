import type { NextFunction, Request, Response } from 'express';
import * as Sentry from '@sentry/node';

export const monitoringMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const originalJson = res.json.bind(res);

  res.json = ((body: unknown) => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.originalUrl} took ${duration}ms`);
      Sentry.withScope((scope) => {
        scope.setLevel('warning');
        scope.setContext('request', {
          method: req.method,
          endpoint: req.originalUrl,
          statusCode,
          duration,
        });
        Sentry.captureMessage('Slow API request detected');
      });
    }

    res.locals.metrics = {
      duration,
      statusCode,
      endpoint: req.originalUrl,
      method: req.method,
    };

    return originalJson(body);
  }) as Response['json'];

  next();
};
