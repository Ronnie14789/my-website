import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  approveTestimonial,
} from '../controllers/testimonialController';

const router = Router();

const testimonialValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name required'),
  body('content')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Content must be 10-1000 characters'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
];

router.get('/', listTestimonials);
router.post('/', testimonialValidation, createTestimonial);
router.put('/:id', authenticate, testimonialValidation, updateTestimonial);
router.delete('/:id', authenticate, deleteTestimonial);
router.patch('/:id/approve', authenticate, approveTestimonial);

export default router;
