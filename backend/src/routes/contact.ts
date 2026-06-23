import { Router } from 'express';
import { body } from 'express-validator';
import { submitContact, getSubmissions } from '../controllers/contactController';
import { validateRequest } from '../middleware/validateRequest';
import { contactLimiter } from '../middleware/rateLimiter';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post(
  '/',
  contactLimiter,
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('phone').optional().trim(),
    body('subject').trim().isLength({ min: 5, max: 200 }).withMessage('Subject must be 5–200 characters'),
    body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be 10–2000 characters'),
  ],
  validateRequest,
  submitContact,
);

router.get('/', authenticate, getSubmissions);

export default router;
