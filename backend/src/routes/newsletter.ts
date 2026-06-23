import { Router } from 'express';
import { body } from 'express-validator';
import { newsletterLimiter } from '../middleware/rateLimiter';
import { authenticate } from '../middleware/auth';
import {
  subscribe,
  unsubscribe,
  listSubscribers,
  deleteSubscriber,
} from '../controllers/newsletterController';

const router = Router();

const subscribeValidation = [
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
];

router.post('/subscribe', newsletterLimiter, subscribeValidation, subscribe);
router.get('/unsubscribe', unsubscribe);
router.get('/', authenticate, listSubscribers);
router.delete('/:id', authenticate, deleteSubscriber);

export default router;
