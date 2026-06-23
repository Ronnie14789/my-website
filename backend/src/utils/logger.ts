import { createLogger, format, transports } from 'winston';
import path from 'path';

const { combine, timestamp, errors, json, colorize, simple } = format;

const logger = createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  format: combine(timestamp(), errors({ stack: true }), json()),
  defaultMeta: { service: 'portfolio-api' },
  transports: [
    new transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
    }),
    new transports.File({
      filename: path.join('logs', 'combined.log'),
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(colorize(), simple()),
    }),
  );
}

export default logger;
