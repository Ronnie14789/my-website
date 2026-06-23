import { Router } from 'express';
import { body } from 'express-validator';
import {
  submitContact,
  getSubmissions,
  updateSubmissionStatus,
  bulkUpdateSubmissionStatus,
} from '../controllers/contactController';
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
    body('subject')
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Subject must be 5–200 characters'),
    body('message')
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Message must be 10–2000 characters'),
  ],
  validateRequest,
  submitContact,
);

router.get('/', authenticate, getSubmissions);
router.patch(
  '/bulk-status',
  authenticate,
  [
    body('ids').isArray({ min: 1 }).withMessage('At least one submission id is required'),
    body('ids.*').isMongoId().withMessage('Invalid submission id'),
    body('status')
      .isIn(['new', 'read', 'replied', 'archived'])
      .withMessage('Invalid submission status'),
  ],
  validateRequest,
  bulkUpdateSubmissionStatus,
);
router.patch(
  '/:id/status',
  authenticate,
  [
    body('status')
      .isIn(['new', 'read', 'replied', 'archived'])
      .withMessage('Invalid submission status'),
  ],
  validateRequest,
  updateSubmissionStatus,
);

export default router;
