import { Router } from 'express';
import { body } from 'express-validator';
import { subscribe, unsubscribe } from '../controllers/newsletterController';
import { validateRequest } from '../middleware/validateRequest';
import { newsletterLimiter } from '../middleware/rateLimiter';

const router = Router();

const emailValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email address required'),
];

router.post('/subscribe', newsletterLimiter, emailValidation, validateRequest, subscribe);
router.post('/unsubscribe', emailValidation, validateRequest, unsubscribe);

export default router;
