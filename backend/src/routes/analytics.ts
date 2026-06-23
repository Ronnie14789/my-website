import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getDashboardStats, getContactTrend } from '../controllers/analyticsController';

const router = Router();

router.get('/dashboard', authenticate, getDashboardStats);
router.get('/contacts/trend', authenticate, getContactTrend);

export default router;
