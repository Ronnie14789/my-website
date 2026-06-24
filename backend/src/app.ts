import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { generalLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { swaggerSpec } from './config/swagger';
import logger from './utils/logger';

import authRouter from './routes/auth';
import adminRouter from './routes/admin';
import analyticsRouter from './routes/analytics';
import healthRouter from './routes/health';
import contactRouter from './routes/contact';
import projectsRouter from './routes/projects';
import blogRouter from './routes/blog';
import testimonialsRouter from './routes/testimonials';
import newsletterRouter from './routes/newsletter';
import uploadRouter from './routes/upload';

const app = express();

app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:', 'https://res.cloudinary.com'],
        connectSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

const allowedOrigins = (
  process.env.CORS_ORIGINS ??
  process.env.ALLOWED_ORIGINS ??
  'http://localhost:3000,http://localhost:5173'
).split(',');

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(
    morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) },
    }),
  );
}

app.use('/api', generalLimiter);

app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Ecatu Ronald Portfolio API',
    customCss: '.swagger-ui .topbar { background-color: #0d6efd; }',
  }),
);

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/health', healthRouter);
app.use('/api/contact', contactRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/blog', blogRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/upload', uploadRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
