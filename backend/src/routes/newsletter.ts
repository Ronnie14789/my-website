import { Router } from 'express';
import { body } from 'express-validator';
import {
  subscribe,
  unsubscribe,
  listSubscribers,
  exportSubscribersCsv,
  updateSubscriberStatus,
} from '../controllers/newsletterController';
import { validateRequest } from '../middleware/validateRequest';
import { newsletterLimiter } from '../middleware/rateLimiter';
import { authenticate } from '../middleware/auth';

const router = Router();

const emailValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email address required'),
];

router.post('/subscribe', newsletterLimiter, emailValidation, validateRequest, subscribe);
router.post('/unsubscribe', emailValidation, validateRequest, unsubscribe);
router.get('/', authenticate, listSubscribers);
router.get('/export', authenticate, exportSubscribersCsv);
router.patch(
  '/:id/status',
  authenticate,
  [body('active').isBoolean().withMessage('Active must be a boolean value')],
  validateRequest,
  updateSubscriberStatus,
);

export default router;
