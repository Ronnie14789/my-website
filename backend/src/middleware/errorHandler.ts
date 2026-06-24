import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { sendError } from '../utils/apiResponse';

export interface AppError extends Error {
  status?: number;
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = err.statusCode ?? err.status ?? 500;
  const message = err.isOperational || statusCode < 500 ? err.message : 'Internal server error';

  logger.error('Request error', {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    statusCode,
  });

  if (typeof sendError === 'function') {
    sendError(res, message, statusCode);
    return;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export const notFound = (req: Request, res: Response): void => {
  if (typeof sendError === 'function') {
    sendError(res, `Route ${req.originalUrl} not found`, 404);
    return;
  }

  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
};

export const notFoundHandler = notFound;

export const createError = (message: string, statusCode: number): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};
