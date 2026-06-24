import { Router } from 'express';
import { getOverview } from '../controllers/adminController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/overview', authenticate, getOverview);

export default router;
