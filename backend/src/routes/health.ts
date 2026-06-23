import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: API health check
 *     responses:
 *       200:
 *         description: API is running
 */
router.get('/', (_req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStates: Record<number, string> = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

  res.json({
    success: true,
    message: 'Ecatu Ronald Portfolio API is running',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: dbStates[dbStatus] ?? 'unknown',
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV ?? 'development',
    },
  });
});

export default router;
