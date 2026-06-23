import { Router } from 'express';
import { body } from 'express-validator';
import {
  getTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialsController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.get('/', getTestimonials);
router.get('/admin', authenticate, getAllTestimonials);
router.post(
  '/',
  authenticate,
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
    body('role').trim().isLength({ min: 2, max: 100 }).withMessage('Role must be 2–100 characters'),
    body('company')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Company must be 2–100 characters'),
    body('message')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Message must be 10–1000 characters'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('approved').optional().isBoolean().withMessage('Approved must be a boolean'),
  ],
  validateRequest,
  createTestimonial,
);
router.patch(
  '/:id',
  authenticate,
  [
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('role').optional().trim().isLength({ min: 2, max: 100 }),
    body('company').optional().trim().isLength({ min: 2, max: 100 }),
    body('message').optional().trim().isLength({ min: 10, max: 1000 }),
    body('rating').optional().isInt({ min: 1, max: 5 }),
    body('approved').optional().isBoolean(),
  ],
  validateRequest,
  updateTestimonial,
);
router.delete('/:id', authenticate, deleteTestimonial);

export default router;
