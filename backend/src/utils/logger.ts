import winston from 'winston';
import path from 'path';
import fs from 'fs';

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

const logDir = process.env.LOG_DIR || 'logs';

if (process.env.NODE_ENV === 'production' && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), json()),
  defaultMeta: { service: 'my-website-backend' },
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), simple()),
    }),
  ],
});

if (process.env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    })
  );
  logger.add(
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
    })
  );
}
